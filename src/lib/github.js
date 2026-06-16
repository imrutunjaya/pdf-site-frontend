import { Octokit } from 'octokit';

// Initialize Octokit with the Personal Access Token from environment variables
// If GITHUB_PAT is not set (e.g., local dev), it will still try to work for public repos,
// but for private repos, it is REQUIRED.
export const octokit = new Octokit({
  auth: process.env.GITHUB_PAT,
});

export const GITHUB_OWNER = process.env.GITHUB_OWNER || 'your-username';
export const GITHUB_REPO = process.env.GITHUB_REPO || 'my-pdf-library';
