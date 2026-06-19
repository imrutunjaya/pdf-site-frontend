import { NextResponse } from 'next/server';
import { octokit, GITHUB_OWNER, GITHUB_REPO } from '@/lib/github';
import { encryptBuffer, decryptBuffer, isEncrypted } from '@/lib/crypto';

export async function POST(request) {
  try {
    const { path, password, action } = await request.json();

    if (!path || !password || !action) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (action !== 'encrypt' && action !== 'decrypt') {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    // 1. Fetch file info to get the sha (needed for update) and download URL
    const { data: fileData } = await octokit.rest.repos.getContent({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      path: path,
    });

    if (Array.isArray(fileData) || fileData.type !== 'file') {
      return NextResponse.json({ error: 'Path is not a file' }, { status: 400 });
    }

    // 2. Download the actual file buffer
    const fileResponse = await fetch(fileData.download_url, {
      headers: { Authorization: `token ${process.env.GITHUB_PAT}` },
    });

    if (!fileResponse.ok) {
      throw new Error('Failed to download file content from GitHub');
    }

    const arrayBuffer = await fileResponse.arrayBuffer();
    let buffer = Buffer.from(arrayBuffer);

    // 3. Process the buffer
    let newBuffer;
    let commitMessage;

    if (action === 'encrypt') {
      if (isEncrypted(buffer)) {
        return NextResponse.json({ error: 'File is already encrypted' }, { status: 400 });
      }
      newBuffer = encryptBuffer(buffer, password);
      commitMessage = `🔒 Encrypt ${fileData.name}`;
    } else {
      if (!isEncrypted(buffer)) {
        return NextResponse.json({ error: 'File is not encrypted' }, { status: 400 });
      }
      try {
        newBuffer = decryptBuffer(buffer, password);
      } catch (err) {
        return NextResponse.json({ error: 'Incorrect password or corrupted file' }, { status: 401 });
      }
      commitMessage = `🔓 Decrypt ${fileData.name}`;
    }

    // 4. Update the file on GitHub
    await octokit.rest.repos.createOrUpdateFileContents({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      path: path,
      message: commitMessage,
      content: newBuffer.toString('base64'),
      sha: fileData.sha,
    });

    return NextResponse.json({ success: true, message: `File successfully ${action}ed` });

  } catch (error) {
    console.error('Crypto API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
