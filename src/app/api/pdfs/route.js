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
    const pdfs = files
      .filter((item) => item.type === 'file')
      .map((file) => ({
        name: file.name,
        path: file.path,
        size: file.size,
        sha: file.sha,
      }));

    return NextResponse.json({ pdfs });
  } catch (error) {
    console.error(`Error fetching PDFs for category ${category}:`, error);
    return NextResponse.json({ error: 'Failed to fetch PDFs for this category.' }, { status: 500 });
  }
}
