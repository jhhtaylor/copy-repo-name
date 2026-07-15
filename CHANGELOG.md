# Change Log

All notable changes to the "Copy Repo Name" extension will be documented in this file.

## [0.1.6] - 2026-07-15

### Fixed
- All copy commands now resolve the repository/branch/commit from the workspace folder that actually owns the file being copied or right-clicked, instead of always the first folder in the workspace. In a multi-root workspace, this previously meant a file physically belonging to one folder could report another folder's repo name if that folder happened to be listed first.

## [0.1.5] - 2026-07-09

### Added
- New "Copy Branch Name" command that copies the current Git branch name to the clipboard
- New "Copy Commit Hash" command that copies the current Git commit hash (full SHA) to the clipboard

### Changed
- "Copy Text With Repo Comment" now reports the copied line range as `line <N>` for a single line, or `line <start> to line <end>` for a multi-line selection, instead of just the first line number

## [0.1.4] - 2026-07-09

### Added
- New "Copy Text With Repo Comment" command that copies the selected text (or whole file) to the clipboard with a `<repo-name> - <file-name> - <line-number>` comment above it, using the comment syntax for the file's language
- Keybinding `Cmd+Shift+C` (macOS) / `Ctrl+Shift+C` (Windows/Linux) for the new command

## [0.1.3] - 2026-06-19

### Fixed
- "Copy Repo Path" now uses the actual workspace folder path instead of a hardcoded `~/source/repos/<repoName>` path

## [0.1.2] - 2026-06-13

### Added
- New "Copy Repo Path" command that copies the full workspace folder path to the clipboard

## [0.1.1] - 2025-12-08

### Added
- Sponsor link in package.json and marketplace page
- Support message in README.md

## [0.0.1] - 2025-11-30

### Added
- Initial release
- Copy repository name to clipboard from multiple locations:
  - Right-click on editor tabs
  - Right-click in Explorer (files and empty space)
  - Command Palette (Cmd+Shift+P / Ctrl+Shift+P)
- Automatic detection of repository name from Git remote URL
- Fallback to workspace folder name if not in a Git repository
- Comprehensive test suite (21 tests):
  - 12 unit tests for URL parsing
  - 9 integration tests for extension functionality
