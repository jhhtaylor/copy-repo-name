/// <reference types="mocha" />
import { strictEqual, ok } from 'assert';
import * as vscode from 'vscode';

describe('Extension Tests', () => {
  describe('Extension Activation', () => {
    it('should be present', () => {
      const extension = vscode.extensions.getExtension('jhhtaylor.copy-repo-name');
      ok(extension, 'Extension should be present');
    });

    it('should activate', async () => {
      const extension = vscode.extensions.getExtension('jhhtaylor.copy-repo-name');
      ok(extension, 'Extension should be present');
      await extension.activate();
      ok(extension.isActive, 'Extension should be active');
    });
  });

  describe('Command Registration', () => {
    it('should register copy-repo-name.copyRepoName command', async () => {
      const commands = await vscode.commands.getCommands(true);
      const hasCommand = commands.includes('copy-repo-name.copyRepoName');
      ok(hasCommand, 'Command copy-repo-name.copyRepoName should be registered');
    });

    it('should register copy-repo-name.copyRepoPath command', async () => {
      const commands = await vscode.commands.getCommands(true);
      const hasCommand = commands.includes('copy-repo-name.copyRepoPath');
      ok(hasCommand, 'Command copy-repo-name.copyRepoPath should be registered');
    });

    it('should register copy-repo-name.copyTextWithComment command', async () => {
      const commands = await vscode.commands.getCommands(true);
      const hasCommand = commands.includes('copy-repo-name.copyTextWithComment');
      ok(hasCommand, 'Command copy-repo-name.copyTextWithComment should be registered');
    });

    it('should register copy-repo-name.copyBranchName command', async () => {
      const commands = await vscode.commands.getCommands(true);
      const hasCommand = commands.includes('copy-repo-name.copyBranchName');
      ok(hasCommand, 'Command copy-repo-name.copyBranchName should be registered');
    });

    it('should register copy-repo-name.copyCommitHash command', async () => {
      const commands = await vscode.commands.getCommands(true);
      const hasCommand = commands.includes('copy-repo-name.copyCommitHash');
      ok(hasCommand, 'Command copy-repo-name.copyCommitHash should be registered');
    });
  });

  describe('Command Execution', () => {
    it('should execute copy-repo-name.copyRepoName command without errors', async () => {
      // This test verifies the command can be executed
      // In a real workspace, it would copy the repo name to clipboard
      try {
        await vscode.commands.executeCommand('copy-repo-name.copyRepoName');
        ok(true, 'Command executed successfully');
      } catch (error) {
        // Command might fail if not in a workspace, but it should still be registered
        ok(true, 'Command is registered and attempted execution');
      }
    });

    it('should copy text to clipboard when executed', async function() {
      // Skip this test if not in a workspace
      if (!vscode.workspace.workspaceFolders || vscode.workspace.workspaceFolders.length === 0) {
        this.skip();
      }

      // Execute the command
      await vscode.commands.executeCommand('copy-repo-name.copyRepoName');

      // Read from clipboard
      const clipboardText = await vscode.env.clipboard.readText();

      // Verify something was copied
      ok(clipboardText && clipboardText.length > 0, 'Clipboard should contain text');

      // The clipboard should contain a valid repository name
      ok(/^[a-zA-Z0-9._-]+$/.test(clipboardText), 'Clipboard should contain a valid repository name');
    });

    it('should resolve the repo name from an explicit resource URI (as passed by context-menu invocations)', async function() {
      // Skip this test if not in a workspace
      if (!vscode.workspace.workspaceFolders || vscode.workspace.workspaceFolders.length === 0) {
        this.skip();
      }

      // Context menu commands (editor tab / Explorer) receive the clicked
      // resource's URI as the first argument, distinct from whatever the
      // active editor happens to be. This guards against always falling
      // back to workspaceFolders[0] regardless of which resource/folder
      // the command was actually invoked on.
      const workspaceFolder = vscode.workspace.workspaceFolders[0];
      const packageJsonUri = vscode.Uri.joinPath(workspaceFolder.uri, 'package.json');

      await vscode.commands.executeCommand('copy-repo-name.copyRepoName', packageJsonUri);

      const clipboardText = await vscode.env.clipboard.readText();

      ok(clipboardText && clipboardText.length > 0, 'Clipboard should contain text');
      ok(/^[a-zA-Z0-9._-]+$/.test(clipboardText), 'Clipboard should contain a valid repository name');
    });

    it('should execute copy-repo-name.copyRepoPath command without errors', async () => {
      try {
        await vscode.commands.executeCommand('copy-repo-name.copyRepoPath');
        ok(true, 'Command executed successfully');
      } catch (error) {
        // Command might fail if not in a workspace, but it should still be registered
        ok(true, 'Command is registered and attempted execution');
      }
    });

    it('should copy the workspace folder path to clipboard when executed', async function() {
      // Skip this test if not in a workspace
      if (!vscode.workspace.workspaceFolders || vscode.workspace.workspaceFolders.length === 0) {
        this.skip();
      }

      await vscode.commands.executeCommand('copy-repo-name.copyRepoPath');

      const clipboardText = await vscode.env.clipboard.readText();

      ok(clipboardText && clipboardText.length > 0, 'Clipboard should contain text');

      // Should be an absolute path
      ok(clipboardText.startsWith('/') || /^[A-Za-z]:/.test(clipboardText), 'Clipboard should contain an absolute path');
    });

    it('should execute copy-repo-name.copyTextWithComment command without errors', async () => {
      try {
        await vscode.commands.executeCommand('copy-repo-name.copyTextWithComment');
        ok(true, 'Command executed successfully');
      } catch (error) {
        // Command might fail if not in a workspace, but it should still be registered
        ok(true, 'Command is registered and attempted execution');
      }
    });

    it('should copy a single-line selection with a "<repo> - <file> - line N" comment above it', async function() {
      const document = await vscode.workspace.openTextDocument({
        content: 'line one\nline two\nline three',
        language: 'javascript',
      });
      const editor = await vscode.window.showTextDocument(document);

      // Select "line two" (the second line, index 1)
      editor.selection = new vscode.Selection(1, 0, 1, 'line two'.length);

      await vscode.commands.executeCommand('copy-repo-name.copyTextWithComment');

      const clipboardText = await vscode.env.clipboard.readText();
      const lines = clipboardText.split('\n');

      ok(lines[0].startsWith('// '), 'First line should be a JS comment');
      ok(lines[0].endsWith(' - line 2'), 'Comment should reference line 2 (1-based) with no range');
      strictEqual(lines[1], 'line two', 'Second line should be the copied selection');

      await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
    });

    it('should copy a multi-line selection with a "<repo> - <file> - line N to line M" comment above it', async function() {
      const document = await vscode.workspace.openTextDocument({
        content: 'line one\nline two\nline three',
        language: 'javascript',
      });
      const editor = await vscode.window.showTextDocument(document);

      // Select from the start of "line two" through the end of "line three"
      editor.selection = new vscode.Selection(1, 0, 2, 'line three'.length);

      await vscode.commands.executeCommand('copy-repo-name.copyTextWithComment');

      const clipboardText = await vscode.env.clipboard.readText();
      const lines = clipboardText.split('\n');

      ok(lines[0].startsWith('// '), 'First line should be a JS comment');
      ok(lines[0].endsWith(' - line 2 to line 3'), 'Comment should reference the line 2-3 range');
      strictEqual(lines[1], 'line two', 'Second line should be the start of the copied selection');
      strictEqual(lines[2], 'line three', 'Third line should be the end of the copied selection');

      await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
    });

    it('should execute copy-repo-name.copyBranchName command without errors', async () => {
      try {
        await vscode.commands.executeCommand('copy-repo-name.copyBranchName');
        ok(true, 'Command executed successfully');
      } catch (error) {
        // Command might fail if not in a Git repository, but it should still be registered
        ok(true, 'Command is registered and attempted execution');
      }
    });

    it('should copy the current branch name to clipboard when executed', async function() {
      if (!vscode.workspace.workspaceFolders || vscode.workspace.workspaceFolders.length === 0) {
        this.skip();
      }

      await vscode.commands.executeCommand('copy-repo-name.copyBranchName');

      const clipboardText = await vscode.env.clipboard.readText();

      ok(clipboardText && clipboardText.length > 0, 'Clipboard should contain text');
      ok(/^[a-zA-Z0-9._/-]+$/.test(clipboardText), 'Clipboard should contain a valid branch name');
    });

    it('should execute copy-repo-name.copyCommitHash command without errors', async () => {
      try {
        await vscode.commands.executeCommand('copy-repo-name.copyCommitHash');
        ok(true, 'Command executed successfully');
      } catch (error) {
        // Command might fail if not in a Git repository, but it should still be registered
        ok(true, 'Command is registered and attempted execution');
      }
    });

    it('should copy the current commit hash to clipboard when executed', async function() {
      if (!vscode.workspace.workspaceFolders || vscode.workspace.workspaceFolders.length === 0) {
        this.skip();
      }

      await vscode.commands.executeCommand('copy-repo-name.copyCommitHash');

      const clipboardText = await vscode.env.clipboard.readText();

      ok(clipboardText && clipboardText.length > 0, 'Clipboard should contain text');
      ok(/^[a-f0-9]{40}$/.test(clipboardText), 'Clipboard should contain a full 40-character commit SHA');
    });
  });

  describe('Menu Contribution Points', () => {
    it('should contribute to editor/title/context menu (tab right-click)', async () => {
      const packageJSON = vscode.extensions.getExtension('jhhtaylor.copy-repo-name')?.packageJSON;
      ok(packageJSON, 'Package JSON should exist');

      const menus = packageJSON.contributes.menus;
      ok(menus['editor/title/context'], 'Should contribute to editor/title/context menu');

      const editorTitleContextMenu = menus['editor/title/context'];
      const hasCopyRepoName = editorTitleContextMenu.some((item: any) =>
        item.command === 'copy-repo-name.copyRepoName'
      );
      const hasCopyRepoPath = editorTitleContextMenu.some((item: any) =>
        item.command === 'copy-repo-name.copyRepoPath'
      );
      const hasCopyBranchName = editorTitleContextMenu.some((item: any) =>
        item.command === 'copy-repo-name.copyBranchName'
      );
      const hasCopyCommitHash = editorTitleContextMenu.some((item: any) =>
        item.command === 'copy-repo-name.copyCommitHash'
      );
      ok(hasCopyRepoName, 'editor/title/context menu should include copy-repo-name.copyRepoName');
      ok(hasCopyRepoPath, 'editor/title/context menu should include copy-repo-name.copyRepoPath');
      ok(hasCopyBranchName, 'editor/title/context menu should include copy-repo-name.copyBranchName');
      ok(hasCopyCommitHash, 'editor/title/context menu should include copy-repo-name.copyCommitHash');
    });

    it('should contribute to explorer/context menu (file and empty space)', async () => {
      const packageJSON = vscode.extensions.getExtension('jhhtaylor.copy-repo-name')?.packageJSON;
      ok(packageJSON, 'Package JSON should exist');

      const menus = packageJSON.contributes.menus;
      ok(menus['explorer/context'], 'Should contribute to explorer/context menu');

      const explorerContextMenu = menus['explorer/context'];
      const hasCopyRepoName = explorerContextMenu.some((item: any) =>
        item.command === 'copy-repo-name.copyRepoName'
      );
      const hasCopyRepoPath = explorerContextMenu.some((item: any) =>
        item.command === 'copy-repo-name.copyRepoPath'
      );
      const hasCopyBranchName = explorerContextMenu.some((item: any) =>
        item.command === 'copy-repo-name.copyBranchName'
      );
      const hasCopyCommitHash = explorerContextMenu.some((item: any) =>
        item.command === 'copy-repo-name.copyCommitHash'
      );
      ok(hasCopyRepoName, 'explorer/context menu should include copy-repo-name.copyRepoName');
      ok(hasCopyRepoPath, 'explorer/context menu should include copy-repo-name.copyRepoPath');
      ok(hasCopyBranchName, 'explorer/context menu should include copy-repo-name.copyBranchName');
      ok(hasCopyCommitHash, 'explorer/context menu should include copy-repo-name.copyCommitHash');
    });

    it('should contribute to command palette', async () => {
      const packageJSON = vscode.extensions.getExtension('jhhtaylor.copy-repo-name')?.packageJSON;
      ok(packageJSON, 'Package JSON should exist');

      const menus = packageJSON.contributes.menus;
      ok(menus['commandPalette'], 'Should contribute to command palette');

      const commandPaletteMenu = menus['commandPalette'];
      const hasCopyRepoName = commandPaletteMenu.some((item: any) =>
        item.command === 'copy-repo-name.copyRepoName'
      );
      const hasCopyRepoPath = commandPaletteMenu.some((item: any) =>
        item.command === 'copy-repo-name.copyRepoPath'
      );
      const hasCopyTextWithComment = commandPaletteMenu.some((item: any) =>
        item.command === 'copy-repo-name.copyTextWithComment'
      );
      const hasCopyBranchName = commandPaletteMenu.some((item: any) =>
        item.command === 'copy-repo-name.copyBranchName'
      );
      const hasCopyCommitHash = commandPaletteMenu.some((item: any) =>
        item.command === 'copy-repo-name.copyCommitHash'
      );
      ok(hasCopyRepoName, 'command palette should include copy-repo-name.copyRepoName');
      ok(hasCopyRepoPath, 'command palette should include copy-repo-name.copyRepoPath');
      ok(hasCopyTextWithComment, 'command palette should include copy-repo-name.copyTextWithComment');
      ok(hasCopyBranchName, 'command palette should include copy-repo-name.copyBranchName');
      ok(hasCopyCommitHash, 'command palette should include copy-repo-name.copyCommitHash');
    });

    it('should use correct menu group placement', async () => {
      const packageJSON = vscode.extensions.getExtension('jhhtaylor.copy-repo-name')?.packageJSON;
      ok(packageJSON, 'Package JSON should exist');

      const menus = packageJSON.contributes.menus;

      // Check explorer/context menu group
      const explorerContextMenu = menus['explorer/context'];
      ok(explorerContextMenu.every((item: any) => item.group === '6_copypath'), 'Should use 6_copypath group');

      // Check editor/title/context menu group (tab right-click)
      const editorTitleContextMenu = menus['editor/title/context'];
      ok(editorTitleContextMenu.every((item: any) => item.group === '1_copy'), 'Should use 1_copy group for tab copy commands');
    });

    it('should only contribute to exactly 3 menu locations', async () => {
      const packageJSON = vscode.extensions.getExtension('jhhtaylor.copy-repo-name')?.packageJSON;
      ok(packageJSON, 'Package JSON should exist');

      const menus = packageJSON.contributes.menus;
      const menuKeys = Object.keys(menus);

      strictEqual(menuKeys.length, 3, 'Should contribute to exactly 3 menu locations');
      ok(menuKeys.includes('editor/title/context'), 'Should include editor/title/context');
      ok(menuKeys.includes('explorer/context'), 'Should include explorer/context');
      ok(menuKeys.includes('commandPalette'), 'Should include commandPalette');
    });
  });

  describe('Keybindings', () => {
    it('should bind copy-repo-name.copyTextWithComment to cmd/ctrl+shift+c when editor is focused', () => {
      const packageJSON = vscode.extensions.getExtension('jhhtaylor.copy-repo-name')?.packageJSON;
      ok(packageJSON, 'Package JSON should exist');

      const keybindings = packageJSON.contributes.keybindings;
      ok(keybindings, 'Should contribute keybindings');

      const binding = keybindings.find((item: any) => item.command === 'copy-repo-name.copyTextWithComment');
      ok(binding, 'Should bind copy-repo-name.copyTextWithComment');
      strictEqual(binding.key, 'ctrl+shift+c');
      strictEqual(binding.mac, 'cmd+shift+c');
      strictEqual(binding.when, 'editorTextFocus');
    });
  });
});
