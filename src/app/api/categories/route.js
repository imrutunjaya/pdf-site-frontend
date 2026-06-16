import { NextResponse } from 'next/server';
import { octokit, GITHUB_OWNER, GITHUB_REPO } from '@/lib/github';

export async function GET() {
  try {
    // Fetch the root directory contents of the repository
    const { data } = await octokit.rest.repos.getContent({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      path: '',
    });

    // Filter out only directories (these are our categories)
    // We ignore files at the root level and hidden folders (like .github)
    const categories = data
      .filter((item) => item.type === 'dir' && !item.name.startsWith('.'))
      .map((dir) => ({
        name: dir.name,
        path: dir.path,
      }));

    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories. Make sure your GitHub token and repository settings are correct.' }, { status: 500 });
  }
}
