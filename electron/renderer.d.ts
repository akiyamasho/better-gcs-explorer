import type {
  BqDataset,
  BqProject,
  BqQueryRequest,
  BqQueryResult,
  BqSavedQuery,
  BqTable,
  BqTablePreview,
  DeleteRequest,
  DownloadManyRequest,
  DownloadRequest,
  CreateFolderRequest,
  GcsBucket,
  ListObjectsRequest,
  ListObjectsResponse,
  StartDragRequest,
  UploadRequest,
} from '../shared/types';

type IpcResult<T> = { ok: true; data: T } | { ok: false; error: string };

declare global {
  interface Window {
    gcs: {
      listBuckets: () => Promise<GcsBucket[]>;
      listObjects: (req: ListObjectsRequest) => Promise<ListObjectsResponse>;
      download: (req: DownloadRequest) => Promise<{ canceled: boolean } | { canceled: boolean; error?: string }>;
      downloadMany: (
        req: DownloadManyRequest
      ) => Promise<{ canceled: boolean } | { canceled: boolean; error?: string }>;
      upload: (req: UploadRequest) => Promise<{ ok: boolean; error?: string }>;
      delete: (req: DeleteRequest) => Promise<{ ok: boolean; error?: string }>;
      createFolder: (req: CreateFolderRequest) => Promise<{ ok: boolean; error?: string }>;
      startDrag: (req: StartDragRequest) => Promise<{ ok: boolean; error?: string }>;
      chooseUpload: () => Promise<{ canceled: boolean; paths: string[] }>;
    };
    bq: {
      listProjects: () => Promise<IpcResult<BqProject[]>>;
      listDatasets: (req: { projectId: string }) => Promise<IpcResult<BqDataset[]>>;
      listTables: (req: { projectId: string; datasetId: string }) => Promise<IpcResult<BqTable[]>>;
      previewTable: (req: {
        projectId: string;
        datasetId: string;
        tableId: string;
      }) => Promise<IpcResult<BqTablePreview>>;
      runQuery: (req: BqQueryRequest) => Promise<IpcResult<BqQueryResult>>;
      loadSavedQueries: () => Promise<IpcResult<BqSavedQuery[]>>;
      saveSavedQueries: (queries: BqSavedQuery[]) => Promise<{ ok: boolean; error?: string }>;
    };
  }
}

export {};
