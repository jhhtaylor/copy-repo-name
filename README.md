<p align="center">
  <img src="media/copy-repo-name.png" alt="Copy Repo Name Logo" width="200"/>
</p>

# Copy Repo Name

A simple VS Code extension that copies the current repository name or workspace path to your clipboard.

## Support the creator

<a href="https://www.buymeacoffee.com/jhhtaylor" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" width="217" height="60"></a>

Love this extension? You can support its development with a small donation - completely optional! Your support helps me keep creating and improving tools like this.

## Features

- Copy the repository name or full workspace path from multiple locations:
  - Right-click on an **editor tab** (tab context menu)
  - Right-click on a **file** in the Explorer
  - Right-click on **empty space** in the Explorer
  - Access from the **Command Palette** (Cmd+Shift+P / Ctrl+Shift+P)
- **Copy Repo Name**: copies just the repository name (e.g. `copy-repo-name`)
- **Copy Repo Path**: copies the full workspace folder path (e.g. `/Users/jhhtaylor/Code/copy-repo-name` on macOS or `C:\Users\jhhtaylor\Code\copy-repo-name` on Windows)
- **Copy Text With Repo Comment**: copies the selected text (or the whole file if nothing is selected) to the clipboard with a comment above it in the form `<repo-name> - <file-name> - <line-number>`, where the line number is the first line of the copied text. The comment syntax is chosen based on the file's language (e.g. `//` for JavaScript, `#` for Python, `<!-- -->` for HTML).
- Automatically detects the repository name from Git remote URL
- Falls back to workspace folder name if not in a Git repository
- Positioned at the bottom of copy-related menu options for easy access

## Usage

### From Context Menus

**Option 1: Right-click on an editor tab**
1. Right-click on any editor tab
2. Select "Copy Repo Name" or "Copy Repo Path"
3. The repository name or path is now in your clipboard

**Option 2: Right-click in the Explorer**
1. Right-click on any file/folder OR in empty space in the Explorer
2. Select "Copy Repo Name" or "Copy Repo Path"
3. The repository name or path is now in your clipboard

### From Command Palette

1. Open the Command Palette (`Cmd+Shift+P` on macOS, `Ctrl+Shift+P` on Windows/Linux)
2. Type "Copy Repo Name", "Copy Repo Path", or "Copy Text With Repo Comment"
3. Press Enter

### Copy Text With Repo Comment

1. Select the code you want to copy (or leave the selection empty to copy the whole file)
2. Press `Cmd+Shift+C` on macOS / `Ctrl+Shift+C` on Windows/Linux, use the Command Palette, or run "Copy Text With Repo Comment"
3. The selected text is now on your clipboard with a comment above it: `<repo-name> - <file-name> - <line-number>`

## How It Works

The extension attempts to get the repository name from your Git remote URL (e.g., `origin`). If you're not in a Git repository, it falls back to using the workspace folder name.

"Copy Repo Path" copies the actual workspace folder path as reported by VS Code.

"Copy Text With Repo Comment" builds the comment from the repository name, the current file's name, and the first line number of the selection, then wraps it in the comment syntax for the file's language.

## Requirements

VS Code version 1.99.0 or higher

## Known Issues

If you encounter any problem, please open an [Issue](https://github.com/jhhtaylor/copy-repo-name/issues) on the GitHub repository.

## Release Notes

See [CHANGELOG.md](CHANGELOG.md) for a detailed list of changes and releases.
