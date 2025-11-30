import * as vscode from 'vscode';
import * as path from 'path';
import { execSync } from 'child_process';
import { extractRepoNameFromUrl } from './utils';

export function activate(context: vscode.ExtensionContext) {
    const disposable = vscode.commands.registerCommand('copy-repo-name.copyRepoName', async () => {
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

    context.subscriptions.push(disposable);
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
