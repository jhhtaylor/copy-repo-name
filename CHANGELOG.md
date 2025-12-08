# Change Log

All notable changes to the "Copy Repo Name" extension will be documented in this file.

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
