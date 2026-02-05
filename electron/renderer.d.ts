import type {
  DownloadRequest,
  GcsBucket,
  ListObjectsRequest,
  ListObjectsResponse,
  StartDragRequest,
  UploadRequest,
} from '../shared/types';

declare global {
  interface Window {
    gcs: {
      listBuckets: () => Promise<GcsBucket[]>;
      listObjects: (req: ListObjectsRequest) => Promise<ListObjectsResponse>;
      download: (req: DownloadRequest) => Promise<{ canceled: boolean } | { canceled: boolean; error?: string }>;
      upload: (req: UploadRequest) => Promise<{ ok: boolean; error?: string }>;
      startDrag: (req: StartDragRequest) => Promise<{ ok: boolean; error?: string }>;
      chooseUpload: () => Promise<{ canceled: boolean; paths: string[] }>;
    };
  }
}

export {};
