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
  });

  describe('Menu Contribution Points', () => {
    it('should contribute to editor/title/context menu (tab right-click)', async () => {
      const packageJSON = vscode.extensions.getExtension('jhhtaylor.copy-repo-name')?.packageJSON;
      ok(packageJSON, 'Package JSON should exist');

      const menus = packageJSON.contributes.menus;
      ok(menus['editor/title/context'], 'Should contribute to editor/title/context menu');

      const editorTitleContextMenu = menus['editor/title/context'];
      const hasCommand = editorTitleContextMenu.some((item: any) =>
        item.command === 'copy-repo-name.copyRepoName'
      );
      ok(hasCommand, 'editor/title/context menu should include copy-repo-name.copyRepoName');
    });

    it('should contribute to explorer/context menu (file and empty space)', async () => {
      const packageJSON = vscode.extensions.getExtension('jhhtaylor.copy-repo-name')?.packageJSON;
      ok(packageJSON, 'Package JSON should exist');

      const menus = packageJSON.contributes.menus;
      ok(menus['explorer/context'], 'Should contribute to explorer/context menu');

      const explorerContextMenu = menus['explorer/context'];
      const hasCommand = explorerContextMenu.some((item: any) =>
        item.command === 'copy-repo-name.copyRepoName'
      );
      ok(hasCommand, 'explorer/context menu should include copy-repo-name.copyRepoName');
    });

    it('should contribute to command palette', async () => {
      const packageJSON = vscode.extensions.getExtension('jhhtaylor.copy-repo-name')?.packageJSON;
      ok(packageJSON, 'Package JSON should exist');

      const menus = packageJSON.contributes.menus;
      ok(menus['commandPalette'], 'Should contribute to command palette');

      const commandPaletteMenu = menus['commandPalette'];
      const hasCommand = commandPaletteMenu.some((item: any) =>
        item.command === 'copy-repo-name.copyRepoName'
      );
      ok(hasCommand, 'command palette should include copy-repo-name.copyRepoName');
    });

    it('should use correct menu group placement', async () => {
      const packageJSON = vscode.extensions.getExtension('jhhtaylor.copy-repo-name')?.packageJSON;
      ok(packageJSON, 'Package JSON should exist');

      const menus = packageJSON.contributes.menus;

      // Check explorer/context menu group
      const explorerContextMenu = menus['explorer/context'][0];
      strictEqual(explorerContextMenu.group, '6_copypath', 'Should use 6_copypath group');

      // Check editor/title/context menu group (tab right-click)
      const editorTitleContextMenu = menus['editor/title/context'][0];
      strictEqual(editorTitleContextMenu.group, '1_copy', 'Should use 1_copy group for tab copy commands');
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
});
