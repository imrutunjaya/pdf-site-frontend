import { NextResponse } from 'next/server';
import { octokit, GITHUB_OWNER, GITHUB_REPO } from '@/lib/github';

export async function POST(request) {
  try {
    const { path, content, message } = await request.json();

    if (!path || !content) {
      return NextResponse.json({ error: 'Missing required fields: path and content are required' }, { status: 400 });
    }

    // Attempt to upload the file
    await octokit.rest.repos.createOrUpdateFileContents({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      path: path,
      message: message || `Upload ${path}`,
      content: content,
    });

    return NextResponse.json({ success: true, message: 'File uploaded successfully' });

  } catch (error) {
    console.error('Upload Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to upload file' }, { status: 500 });
  }
}
