import { NextResponse } from 'next/server';
import { octokit, GITHUB_OWNER, GITHUB_REPO } from '@/lib/github';

export async function GET() {
  try {
    // Fetch the root directory contents of the repository
    const { data: rootData } = await octokit.rest.repos.getContent({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      path: '',
    });

    // Filter out only directories (these are our parent sections)
    const rootDirs = rootData.filter((item) => item.type === 'dir' && !item.name.startsWith('.'));

    // Fetch subdirectories for each parent section
    const categories = await Promise.all(
      rootDirs.map(async (dir) => {
        try {
          const { data: subData } = await octokit.rest.repos.getContent({
            owner: GITHUB_OWNER,
            repo: GITHUB_REPO,
            path: dir.path,
          });

          // If a root directory has subdirectories, use them as cards
          const subDirs = subData
            .filter((item) => item.type === 'dir' && !item.name.startsWith('.'))
            .map((subDir) => ({
              name: subDir.name,
              path: subDir.path,
            }));

          return {
            sectionName: dir.name,
            sectionPath: dir.path,
            subCategories: subDirs.length > 0 ? subDirs : [{ name: dir.name, path: dir.path }]
          };
        } catch (err) {
          return {
            sectionName: dir.name,
            sectionPath: dir.path,
            subCategories: [{ name: dir.name, path: dir.path }]
          };
        }
      })
    );

    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories. Make sure your GitHub token and repository settings are correct.' }, { status: 500 });
  }
}
