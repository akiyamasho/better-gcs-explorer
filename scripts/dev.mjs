import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const bin = (name) => path.join(root, 'node_modules', '.bin', name);

const tsc = spawn(bin('tsc'), ['-p', 'electron/tsconfig.json', '-w', '--preserveWatchOutput'], {
  stdio: 'inherit',
  cwd: root,
});

const vite = spawn(bin('vite'), [], {
  stdio: 'inherit',
  cwd: root,
});

const waitOn = spawn(bin('wait-on'), ['http://127.0.0.1:5173', 'dist-electron/main.js'], {
  stdio: 'inherit',
  cwd: root,
});

let electron;

waitOn.on('exit', (code) => {
  if (code) {
    process.exit(code);
  }
  const env = { ...process.env, VITE_DEV_SERVER_URL: 'http://127.0.0.1:5173' };
  delete env.ELECTRON_RUN_AS_NODE;
  electron = spawn(bin('electron'), ['.'], {
    stdio: 'inherit',
    cwd: root,
    env,
  });
  electron.on('exit', (exitCode) => {
    process.exit(exitCode ?? 0);
  });
});

const shutdown = () => {
  tsc.kill();
  vite.kill();
  if (electron) {
    electron.kill();
  }
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
