import { app, BrowserWindow, dialog, ipcMain, nativeImage } from 'electron';
import path from 'node:path';
import {
  downloadObjectToPath,
  downloadPrefix,
  downloadToTemp,
  listBuckets,
  listObjects,
  uploadPaths,
} from './gcs';

const isDev = Boolean(process.env.VITE_DEV_SERVER_URL);

const dragIcon = nativeImage.createFromDataURL(
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQI12P4//8/AwAI/AL+XByHJwAAAABJRU5ErkJggg=='
);

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    title: 'Better GCS Explorer',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  if (isDev && process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
    win.webContents.openDevTools({ mode: 'detach' });
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'));
  }
};

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.handle('gcs:list-buckets', async () => listBuckets());

ipcMain.handle('gcs:list-objects', async (_event, req) => listObjects(req));

ipcMain.handle('gcs:download', async (_event, req) => {
  try {
    const { bucket, name, isPrefix } = req as { bucket: string; name: string; isPrefix?: boolean };
    if (!bucket || !name) return { canceled: true, error: 'Missing bucket or object name' };

    if (isPrefix) {
      const result = await dialog.showOpenDialog({
        properties: ['openDirectory', 'createDirectory'],
        title: 'Select a folder to download into',
      });
      if (result.canceled || result.filePaths.length === 0) return { canceled: true };
      await downloadPrefix(bucket, name, result.filePaths[0]);
      return { canceled: false };
    }

    const fileName = path.basename(name);
    const result = await dialog.showSaveDialog({
      defaultPath: fileName,
      title: 'Save object as',
    });
    if (result.canceled || !result.filePath) return { canceled: true };
    await downloadObjectToPath(bucket, name, result.filePath);
    return { canceled: false };
  } catch (err) {
    return { canceled: true, error: String(err) };
  }
});

ipcMain.handle('gcs:choose-upload', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile', 'openDirectory', 'multiSelections'],
    title: 'Select files or folders to upload',
  });
  return { canceled: result.canceled, paths: result.filePaths };
});

ipcMain.handle('gcs:upload', async (_event, req) => {
  try {
    await uploadPaths(req);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
});

ipcMain.handle('gcs:start-drag', async (event, req) => {
  try {
    const { bucket, name } = req as { bucket: string; name: string };
    const localPath = await downloadToTemp(bucket, name);
    event.sender.startDrag({ file: localPath, icon: dragIcon });
    return { ok: true };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
});
