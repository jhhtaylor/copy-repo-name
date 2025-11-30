/// <reference types="mocha" />
import { strictEqual } from 'assert';
import { extractRepoNameFromUrl } from '../../utils';

describe('extractRepoNameFromUrl', () => {
  it('extracts repo name from HTTPS URL with .git extension', () => {
    const result = extractRepoNameFromUrl('https://github.com/jhhtaylor/copy-repo-name.git');
    strictEqual(result, 'copy-repo-name');
  });

  it('extracts repo name from HTTPS URL without .git extension', () => {
    const result = extractRepoNameFromUrl('https://github.com/jhhtaylor/copy-repo-name');
    strictEqual(result, 'copy-repo-name');
  });

  it('extracts repo name from SSH URL with .git extension', () => {
    const result = extractRepoNameFromUrl('git@github.com:jhhtaylor/copy-repo-name.git');
    strictEqual(result, 'copy-repo-name');
  });

  it('extracts repo name from SSH URL without .git extension', () => {
    const result = extractRepoNameFromUrl('git@github.com:jhhtaylor/copy-repo-name');
    strictEqual(result, 'copy-repo-name');
  });

  it('extracts repo name from GitLab HTTPS URL', () => {
    const result = extractRepoNameFromUrl('https://gitlab.com/myuser/my-project.git');
    strictEqual(result, 'my-project');
  });

  it('extracts repo name from Bitbucket HTTPS URL', () => {
    const result = extractRepoNameFromUrl('https://bitbucket.org/team/repository.git');
    strictEqual(result, 'repository');
  });

  it('handles repo names with hyphens and underscores', () => {
    const result = extractRepoNameFromUrl('https://github.com/user/my-cool_repo.git');
    strictEqual(result, 'my-cool_repo');
  });

  it('handles repo names with numbers', () => {
    const result = extractRepoNameFromUrl('https://github.com/user/project123.git');
    strictEqual(result, 'project123');
  });

  it('returns null for empty string', () => {
    const result = extractRepoNameFromUrl('');
    strictEqual(result, null);
  });

  it('returns null for whitespace-only string', () => {
    const result = extractRepoNameFromUrl('   ');
    strictEqual(result, null);
  });

  it('returns null for invalid URL format', () => {
    const result = extractRepoNameFromUrl('not-a-valid-url');
    strictEqual(result, null);
  });

  it('returns null for URL without repository path', () => {
    const result = extractRepoNameFromUrl('https://github.com/');
    strictEqual(result, null);
  });
});
