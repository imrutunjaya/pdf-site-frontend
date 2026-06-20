import { NextResponse } from 'next/server';
import { octokit, GITHUB_OWNER, GITHUB_REPO } from '@/lib/github';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');

  if (!category) {
    return NextResponse.json({ error: 'Category is required' }, { status: 400 });
  }

  try {
    const { data } = await octokit.rest.repos.getContent({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      path: category,
    });

    // Ensure it's an array and filter for PDF files
    const files = Array.isArray(data) ? data : [data];
    
    let readmeContent = null;
    const readmeFile = files.find((item) => item.type === 'file' && item.name.toLowerCase() === 'readme.md');

    if (readmeFile) {
      try {
        const { data: fileData } = await octokit.rest.repos.getContent({
          owner: GITHUB_OWNER,
          repo: GITHUB_REPO,
          path: readmeFile.path,
        });
        if (fileData.content) {
          readmeContent = Buffer.from(fileData.content, 'base64').toString('utf8');
        }
      } catch (err) {
        console.error('Failed to fetch category README:', err);
      }
    }

    const pdfs = files
      .filter((file) => file.name.toLowerCase() !== 'readme.md')
      .map((file) => ({
        name: file.name,
        path: file.path,
        size: file.size,
        sha: file.sha,
        type: file.type,
      }));

    return NextResponse.json({ pdfs, readme: readmeContent });
  } catch (error) {
    console.error(`Error fetching PDFs for category ${category}:`, error);
    return NextResponse.json({ error: 'Failed to fetch PDFs for this category.' }, { status: 500 });
  }
}
