import * as vscode from 'vscode';
import * as path from 'path';
import { execSync } from 'child_process';
import { extractRepoNameFromUrl, buildCopyIdentifier, generateCommentForIdentifier } from './utils';

export function activate(context: vscode.ExtensionContext) {
    const copyRepoName = vscode.commands.registerCommand('copy-repo-name.copyRepoName', async (resourceUri?: vscode.Uri) => {
        try {
            const repoName = await getRepositoryName(resourceUri ?? vscode.window.activeTextEditor?.document.uri);

            if (repoName) {
                await vscode.env.clipboard.writeText(repoName);
                vscode.window.showInformationMessage(`Copied repo name: ${repoName}`);
            } else {
                vscode.window.showWarningMessage('Could not determine repo name. Make sure you are in a Git repository.');
            }
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to copy repo name: ${error}`);
        }
    });

    const copyRepoPath = vscode.commands.registerCommand('copy-repo-name.copyRepoPath', async (resourceUri?: vscode.Uri) => {
        try {
            const repoPath = getWorkspacePath(resourceUri ?? vscode.window.activeTextEditor?.document.uri);

            if (repoPath) {
                await vscode.env.clipboard.writeText(repoPath);
                vscode.window.showInformationMessage(`Copied repo path: ${repoPath}`);
            } else {
                vscode.window.showWarningMessage('Could not determine repo path. Make sure you have a workspace open.');
            }
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to copy repo path: ${error}`);
        }
    });

    const copyTextWithComment = vscode.commands.registerCommand('copy-repo-name.copyTextWithComment', async () => {
        try {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                vscode.window.showWarningMessage('No active editor. Open a file to copy text with a comment.');
                return;
            }

            const document = editor.document;
            const selection = editor.selection;
            const text = selection.isEmpty ? document.getText() : document.getText(selection);

            let startLine: number;
            let endLine: number;
            if (selection.isEmpty) {
                startLine = 0;
                endLine = document.lineCount - 1;
            } else {
                startLine = selection.start.line;
                endLine = selection.end.line;
                // A line-wise selection (e.g. triple-click or Shift+Down onto the next
                // line) reports its end at column 0 of the line after the last selected
                // line; exclude that trailing line from the reported range.
                if (selection.end.character === 0 && endLine > startLine) {
                    endLine -= 1;
                }
            }

            const repoName = (await getRepositoryName(document.uri)) ?? 'Untitled';
            const fileName = path.basename(document.uri.fsPath);
            const identifier = buildCopyIdentifier(repoName, fileName, startLine + 1, endLine + 1);
            const comment = generateCommentForIdentifier(document.languageId, identifier);

            await vscode.env.clipboard.writeText(`${comment}\n${text}`);
            vscode.window.showInformationMessage('Text with repo comment copied to clipboard!');
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to copy text with comment: ${error}`);
        }
    });

    const copyBranchName = vscode.commands.registerCommand('copy-repo-name.copyBranchName', async (resourceUri?: vscode.Uri) => {
        try {
            const branchName = await getBranchName(resourceUri ?? vscode.window.activeTextEditor?.document.uri);

            if (branchName) {
                await vscode.env.clipboard.writeText(branchName);
                vscode.window.showInformationMessage(`Copied branch name: ${branchName}`);
            } else {
                vscode.window.showWarningMessage('Could not determine branch name. Make sure you are in a Git repository.');
            }
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to copy branch name: ${error}`);
        }
    });

    const copyCommitHash = vscode.commands.registerCommand('copy-repo-name.copyCommitHash', async (resourceUri?: vscode.Uri) => {
        try {
            const commitHash = await getCommitHash(resourceUri ?? vscode.window.activeTextEditor?.document.uri);

            if (commitHash) {
                await vscode.env.clipboard.writeText(commitHash);
                vscode.window.showInformationMessage(`Copied commit hash: ${commitHash}`);
            } else {
                vscode.window.showWarningMessage('Could not determine commit hash. Make sure you are in a Git repository.');
            }
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to copy commit hash: ${error}`);
        }
    });

    context.subscriptions.push(copyRepoName, copyRepoPath, copyTextWithComment, copyBranchName, copyCommitHash);
}

// Resolves to the workspace folder that actually owns `referenceUri` (the
// file being copied or right-clicked), rather than always the first folder
// in a multi-root workspace — otherwise a repo could report another
// workspace folder's name just because it happens to be listed first.
function getWorkspacePath(referenceUri?: vscode.Uri): string | null {
    if (referenceUri) {
        const owningFolder = vscode.workspace.getWorkspaceFolder(referenceUri);
        if (owningFolder) {
            return owningFolder.uri.fsPath;
        }
    }

    const workspaceFolders = vscode.workspace.workspaceFolders;

    if (!workspaceFolders || workspaceFolders.length === 0) {
        return null;
    }

    return workspaceFolders[0].uri.fsPath;
}

async function getRepositoryName(referenceUri?: vscode.Uri): Promise<string | null> {
    const workspaceRoot = getWorkspacePath(referenceUri);

    if (!workspaceRoot) {
        return null;
    }

    try {
        // Try to get the remote URL from git
        const remoteUrl = execSync('git config --get remote.origin.url', {
            cwd: workspaceRoot,
            encoding: 'utf8'
        }).trim();

        if (remoteUrl) {
            const repoName = extractRepoNameFromUrl(remoteUrl);
            if (repoName) {
                return repoName;
            }
        }
    } catch (error) {
        // If git command fails, fall back to directory name
    }

    // Fallback: use the workspace folder name
    return path.basename(workspaceRoot);
}

async function getBranchName(referenceUri?: vscode.Uri): Promise<string | null> {
    const workspaceRoot = getWorkspacePath(referenceUri);

    if (!workspaceRoot) {
        return null;
    }

    try {
        const branchName = execSync('git rev-parse --abbrev-ref HEAD', {
            cwd: workspaceRoot,
            encoding: 'utf8'
        }).trim();

        return branchName || null;
    } catch (error) {
        return null;
    }
}

async function getCommitHash(referenceUri?: vscode.Uri): Promise<string | null> {
    const workspaceRoot = getWorkspacePath(referenceUri);

    if (!workspaceRoot) {
        return null;
    }

    try {
        const commitHash = execSync('git rev-parse HEAD', {
            cwd: workspaceRoot,
            encoding: 'utf8'
        }).trim();

        return commitHash || null;
    } catch (error) {
        return null;
    }
}

export function deactivate() {}
