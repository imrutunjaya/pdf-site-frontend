import { NextResponse } from 'next/server';
import { octokit, GITHUB_OWNER, GITHUB_REPO } from '@/lib/github';
import { isEncrypted, decryptBuffer } from '@/lib/crypto';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get('path');
  const password = searchParams.get('password');

  if (!path) {
    return new NextResponse('File path is required', { status: 400 });
  }

  try {
    // 1. Get file metadata to find the download URL or fetch the blob directly
    const { data } = await octokit.rest.repos.getContent({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      path: path,
    });

    if (Array.isArray(data) || data.type !== 'file') {
      return new NextResponse('Requested path is not a file', { status: 400 });
    }

    // 2. The GitHub API returns file content in base64 if it's small, 
    // but for PDFs it's often better to fetch the raw download_url directly with our token
    // so we don't hit payload limits.
    const downloadUrl = data.download_url;
    
    if (!downloadUrl) {
        return new NextResponse('File cannot be downloaded directly', { status: 400 });
    }

    // 3. Fetch the actual raw file content using the download URL and our PAT
    const fileResponse = await fetch(downloadUrl, {
      headers: {
        Authorization: `token ${process.env.GITHUB_PAT}`,
      },
    });

    if (!fileResponse.ok) {
      throw new Error(`Failed to download file: ${fileResponse.statusText}`);
    }

    // 4. Return the buffer as a PDF response
    const arrayBuffer = await fileResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let finalBuffer = buffer;
    if (isEncrypted(buffer)) {
      if (!password) {
        return new NextResponse(JSON.stringify({ error: 'FILE_ENCRYPTED' }), { 
          status: 403, 
          headers: { 'Content-Type': 'application/json' } 
        });
      }
      try {
        finalBuffer = decryptBuffer(buffer, password);
      } catch (err) {
        return new NextResponse(JSON.stringify({ error: 'INVALID_PASSWORD' }), { 
          status: 401, 
          headers: { 'Content-Type': 'application/json' } 
        });
      }
    }

    // Determine content type
    let contentType = 'application/octet-stream';
    const ext = data.name.split('.').pop().toLowerCase();
    if (ext === 'pdf') contentType = 'application/pdf';
    else if (ext === 'png') contentType = 'image/png';
    else if (['jpg', 'jpeg'].includes(ext)) contentType = 'image/jpeg';
    else if (ext === 'gif') contentType = 'image/gif';
    else if (ext === 'svg') contentType = 'image/svg+xml';
    else if (ext === 'txt') contentType = 'text/plain';
    else if (ext === 'html') contentType = 'text/html';
    else if (['js', 'jsx'].includes(ext)) contentType = 'text/javascript';
    else if (ext === 'css') contentType = 'text/css';
    else if (ext === 'json') contentType = 'application/json';

    return new NextResponse(finalBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `inline; filename="${data.name}"`,
      },
    });

  } catch (error) {
    console.error(`Error fetching file content for ${path}:`, error);
    return new NextResponse('Failed to fetch file content', { status: 500 });
  }
}
