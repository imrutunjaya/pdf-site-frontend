import { NextResponse } from 'next/server';
import { octokit, GITHUB_OWNER, GITHUB_REPO } from '@/lib/github';
import { encryptBuffer, decryptBuffer, isEncrypted } from '@/lib/crypto';

// Recursive function to process files and folders
async function processPath(targetPath, password, action) {
  let processedCount = 0;
  let skippedCount = 0;

  const { data: nodeData } = await octokit.rest.repos.getContent({
    owner: GITHUB_OWNER,
    repo: GITHUB_REPO,
    path: targetPath,
  });

  if (Array.isArray(nodeData)) {
    // It's a directory, process all items inside recursively
    for (const item of nodeData) {
      const result = await processPath(item.path, password, action);
      processedCount += result.processedCount;
      skippedCount += result.skippedCount;
    }
  } else if (nodeData.type === 'file') {
    // It's a file, process it
    const fileResponse = await fetch(nodeData.download_url, {
      headers: { Authorization: `token ${process.env.GITHUB_PAT}` },
    });

    if (!fileResponse.ok) {
      throw new Error(`Failed to download ${nodeData.name}`);
    }

    const arrayBuffer = await fileResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let newBuffer;
    let commitMessage;

    if (action === 'encrypt') {
      if (isEncrypted(buffer)) {
        // Skip already encrypted
        return { processedCount: 0, skippedCount: 1 };
      }
      newBuffer = encryptBuffer(buffer, password);
      commitMessage = `🔒 Encrypt ${nodeData.name}`;
    } else {
      if (!isEncrypted(buffer)) {
        // Skip not encrypted
        return { processedCount: 0, skippedCount: 1 };
      }
      try {
        newBuffer = decryptBuffer(buffer, password);
      } catch (err) {
        throw new Error(`Incorrect password or corrupted file: ${nodeData.name}`);
      }
      commitMessage = `🔓 Decrypt ${nodeData.name}`;
    }

    await octokit.rest.repos.createOrUpdateFileContents({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      path: targetPath,
      message: commitMessage,
      content: newBuffer.toString('base64'),
      sha: nodeData.sha,
    });

    processedCount++;
  }

  return { processedCount, skippedCount };
}

export async function POST(request) {
  try {
    const { path, password, action } = await request.json();

    if (!path || !password || !action) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (action !== 'encrypt' && action !== 'decrypt') {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const result = await processPath(path, password, action);

    if (result.processedCount === 0 && result.skippedCount > 0) {
       return NextResponse.json({ error: `All items were already ${action === 'encrypt' ? 'encrypted' : 'decrypted'}.` }, { status: 400 });
    }

    return NextResponse.json({ 
      success: true, 
      message: `Successfully ${action}ed ${result.processedCount} file(s).` 
    });

  } catch (error) {
    console.error('Crypto API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
