<p align="center">
  <img src="media/copy-repo-name.png" alt="Copy Repo Name Logo" width="200"/>
</p>

# Copy Repo Name

A simple VS Code extension that copies the current repository name to your clipboard.

## Support the creator

<a href="https://www.buymeacoffee.com/jhhtaylor" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" width="217" height="60"></a>

Love this extension? You can support its development with a small donation - completely optional! Your support helps me keep creating and improving tools like this.

## Features

- Copy the repository name from multiple locations:
  - Right-click on an **editor tab** (tab context menu)
  - Right-click on a **file** in the Explorer
  - Right-click on **empty space** in the Explorer
  - Access from the **Command Palette** (Cmd+Shift+P / Ctrl+Shift+P)
- Automatically detects the repository name from Git remote URL
- Falls back to workspace folder name if not in a Git repository
- Positioned at the bottom of copy-related menu options for easy access

## Usage

### From Context Menus

**Option 1: Right-click on an editor tab**
1. Right-click on any editor tab
2. Select "Copy Repo Name"
3. The repository name is now in your clipboard

**Option 2: Right-click in the Explorer**
1. Right-click on any file/folder OR in empty space in the Explorer
2. Select "Copy Repo Name"
3. The repository name is now in your clipboard

### From Command Palette

1. Open the Command Palette (`Cmd+Shift+P` on macOS, `Ctrl+Shift+P` on Windows/Linux)
2. Type "Copy Repo Name"
3. Press Enter

## How It Works

The extension attempts to get the repository name from your Git remote URL (e.g., `origin`). If you're not in a Git repository, it falls back to using the workspace folder name.

## Requirements

VS Code version 1.99.0 or higher

## Known Issues

If you encounter any problem, please open an [Issue](https://github.com/jhhtaylor/copy-repo-name/issues) on the GitHub repository.

## Release Notes

See [CHANGELOG.md](CHANGELOG.md) for a detailed list of changes and releases.
