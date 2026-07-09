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

/**
 * Build the identifier text placed above copied code: repo name, file name,
 * and the line number of the first copied/selected line.
 */
export function buildCopyIdentifier(repoName: string, fileName: string, lineNumber: number): string {
    return `${repoName} - ${fileName} - ${lineNumber}`;
}

/**
 * Wrap an identifier in the comment syntax appropriate for the given VS Code
 * language identifier (https://code.visualstudio.com/docs/languages/identifiers).
 */
export function generateCommentForIdentifier(languageId: string, identifier: string): string {
    const commentStyles: Record<string, string[]> = {
        'double-slash': ['c', 'cpp', 'csharp', 'cuda-cpp', 'd', 'go', 'groovy', 'java', 'javascript', 'javascriptreact', 'jsonc', 'objective-c', 'objective-cpp', 'rust', 'swift', 'typescript', 'typescriptreact', 'shaderlab'],
        hash: ['coffeescript', 'perl', 'python', 'r', 'ruby', 'shellscript', 'yaml', 'dockercompose', 'dockerfile', 'erlang', 'git-commit', 'git-rebase', 'ini', 'makefile', 'powershell'],
        'html-like': ['html', 'markdown', 'svelte', 'vue', 'vue-html', 'xml', 'xsl'],
        'multi-line': ['css', 'less', 'scss', 'stylus'],
        percent: ['bibtex', 'latex', 'tex'],
        semicolon: ['clojure'],
        'lua-style': ['lua'],
        'razor-style': ['razor'],
        'sql-style': ['sql'],
        'vb-style': ['vb'],
        'handlebars-style': ['handlebars'],
        'abap-style': ['abap'],
        'batch-style': ['bat'],
        'fsharp-style': ['fsharp', 'haskell', 'ocaml'],
        plaintext: ['plaintext'],
    };

    const commentPrefixes: Record<string, string> = {
        'double-slash': `// ${identifier}`,
        hash: `# ${identifier}`,
        'html-like': `<!-- ${identifier} -->`,
        'multi-line': `/* ${identifier} */`,
        percent: `% ${identifier}`,
        semicolon: `;; ${identifier}`,
        'lua-style': `-- ${identifier}`,
        'razor-style': `@* ${identifier} *@`,
        'sql-style': `-- ${identifier}`,
        'vb-style': `' ${identifier}`,
        'handlebars-style': `{{!-- ${identifier} --}}`,
        'abap-style': `" ${identifier}`,
        'batch-style': `REM ${identifier}`,
        'fsharp-style': `(* ${identifier} *)`,
        plaintext: identifier,
    };

    for (const [style, languages] of Object.entries(commentStyles)) {
        if (languages.includes(languageId)) {
            return commentPrefixes[style];
        }
    }

    return `// ${identifier}`;
}
