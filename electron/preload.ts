import { contextBridge, ipcRenderer } from 'electron';
import type { DeleteRequest, DownloadRequest, ListObjectsRequest, StartDragRequest, UploadRequest } from './types';

contextBridge.exposeInMainWorld('gcs', {
  listBuckets: () => ipcRenderer.invoke('gcs:list-buckets'),
  listObjects: (req: ListObjectsRequest) => ipcRenderer.invoke('gcs:list-objects', req),
  download: (req: DownloadRequest) => ipcRenderer.invoke('gcs:download', req),
  upload: (req: UploadRequest) => ipcRenderer.invoke('gcs:upload', req),
  delete: (req: DeleteRequest) => ipcRenderer.invoke('gcs:delete', req),
  startDrag: (req: StartDragRequest) => ipcRenderer.invoke('gcs:start-drag', req),
  chooseUpload: () => ipcRenderer.invoke('gcs:choose-upload'),
});
