import * as path from 'path';
import { runTests } from '@vscode/test-electron';

async function main() {
  try {
    const extensionDevelopmentPath = path.resolve(__dirname, '../../');
    const extensionTestsPath = path.resolve(__dirname, './suite/index');

    // If this process was itself launched from an Electron-based tool (e.g. an
    // IDE or CLI built on Electron), ELECTRON_RUN_AS_NODE may be set in the
    // environment. runTests() spawns the downloaded VS Code binary with a copy
    // of process.env, so that variable would force it to run as a plain Node
    // process instead of launching as an app, making it reject every VS Code
    // launch flag it's given.
    delete process.env.ELECTRON_RUN_AS_NODE;

    await runTests({
      extensionDevelopmentPath,
      extensionTestsPath,
    });
  } catch (err) {
    console.error('Failed to run tests');
    process.exit(1);
  }
}

main();
