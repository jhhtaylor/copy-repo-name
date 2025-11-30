/**
 * Extract repository name from a git remote URL.
 * Handles both HTTPS and SSH formats:
 * - https://github.com/user/repo.git
 * - git@github.com:user/repo.git
 * - https://gitlab.com/user/repo
 *
 * @param remoteUrl The git remote URL
 * @returns The repository name or null if unable to extract
 */
export function extractRepoNameFromUrl(remoteUrl: string): string | null {
    if (!remoteUrl || remoteUrl.trim() === '') {
        return null;
    }

    // Extract repository name from remote URL
    // Matches the last part after a slash, optionally removing .git extension
    const match = remoteUrl.match(/\/([^\/]+?)(\.git)?$/);

    if (match && match[1]) {
        return match[1];
    }

    return null;
}
