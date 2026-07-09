import * as vscode from 'vscode';
import * as path from 'path';
import { execSync } from 'child_process';
import { extractRepoNameFromUrl, buildCopyIdentifier, generateCommentForIdentifier } from './utils';

export function activate(context: vscode.ExtensionContext) {
    const copyRepoName = vscode.commands.registerCommand('copy-repo-name.copyRepoName', async () => {
        try {
            const repoName = await getRepositoryName();

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

    const copyRepoPath = vscode.commands.registerCommand('copy-repo-name.copyRepoPath', async () => {
        try {
            const repoPath = getWorkspacePath();

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
            const firstLine = (selection.isEmpty ? 0 : selection.start.line) + 1;

            const repoName = (await getRepositoryName()) ?? 'Untitled';
            const fileName = path.basename(document.uri.fsPath);
            const identifier = buildCopyIdentifier(repoName, fileName, firstLine);
            const comment = generateCommentForIdentifier(document.languageId, identifier);

            await vscode.env.clipboard.writeText(`${comment}\n${text}`);
            vscode.window.showInformationMessage('Text with repo comment copied to clipboard!');
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to copy text with comment: ${error}`);
        }
    });

    context.subscriptions.push(copyRepoName, copyRepoPath, copyTextWithComment);
}

function getWorkspacePath(): string | null {
    const workspaceFolders = vscode.workspace.workspaceFolders;

    if (!workspaceFolders || workspaceFolders.length === 0) {
        return null;
    }

    return workspaceFolders[0].uri.fsPath;
}

async function getRepositoryName(): Promise<string | null> {
    const workspaceFolders = vscode.workspace.workspaceFolders;

    if (!workspaceFolders || workspaceFolders.length === 0) {
        return null;
    }

    const workspaceRoot = workspaceFolders[0].uri.fsPath;

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

export function deactivate() {}
