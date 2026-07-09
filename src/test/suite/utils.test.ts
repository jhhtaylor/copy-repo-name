/// <reference types="mocha" />
import { strictEqual } from 'assert';
import { extractRepoNameFromUrl, buildCopyIdentifier, generateCommentForIdentifier } from '../../utils';

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

describe('buildCopyIdentifier', () => {
  it('joins repo name, file name, and line number with " - "', () => {
    const result = buildCopyIdentifier('copy-repo-name', 'extension.ts', 42);
    strictEqual(result, 'copy-repo-name - extension.ts - 42');
  });

  it('uses the given line number as-is (1-based)', () => {
    const result = buildCopyIdentifier('copy-repo-name', 'utils.ts', 1);
    strictEqual(result, 'copy-repo-name - utils.ts - 1');
  });
});

describe('generateCommentForIdentifier', () => {
  const testCases: Record<
    string,
    { languageId: string; identifier: string; expectedComment: string }
  > = {
    javascript: {
      languageId: 'javascript',
      identifier: 'copy-repo-name - example.js - 1',
      expectedComment: '// copy-repo-name - example.js - 1',
    },
    typescript: {
      languageId: 'typescript',
      identifier: 'copy-repo-name - example.ts - 10',
      expectedComment: '// copy-repo-name - example.ts - 10',
    },
    python: {
      languageId: 'python',
      identifier: 'copy-repo-name - example.py - 5',
      expectedComment: '# copy-repo-name - example.py - 5',
    },
    html: {
      languageId: 'html',
      identifier: 'copy-repo-name - example.html - 3',
      expectedComment: '<!-- copy-repo-name - example.html - 3 -->',
    },
    css: {
      languageId: 'css',
      identifier: 'copy-repo-name - example.css - 7',
      expectedComment: '/* copy-repo-name - example.css - 7 */',
    },
    latex: {
      languageId: 'latex',
      identifier: 'copy-repo-name - example.tex - 2',
      expectedComment: '% copy-repo-name - example.tex - 2',
    },
    plaintext: {
      languageId: 'plaintext',
      identifier: 'copy-repo-name - example.txt - 1',
      expectedComment: 'copy-repo-name - example.txt - 1',
    },
    unrecognized: {
      languageId: 'nonexistent-language',
      identifier: 'copy-repo-name - example.unknown - 1',
      expectedComment: '// copy-repo-name - example.unknown - 1',
    },
  };

  Object.values(testCases).forEach(({ languageId, identifier, expectedComment }) => {
    it(`should return correct comment format for ${languageId}`, () => {
      strictEqual(generateCommentForIdentifier(languageId, identifier), expectedComment);
    });
  });
});
