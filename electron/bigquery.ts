import { BigQuery } from '@google-cloud/bigquery';
import type {
  BqDataset,
  BqProject,
  BqQueryRequest,
  BqQueryResult,
  BqSavedQuery,
  BqTable,
  BqTablePreview,
} from './types';

const bigquery = new BigQuery();

export const listProjects = async (): Promise<BqProject[]> => {
  const [datasets] = await bigquery.getDatasets();
  const projectId = datasets.length > 0
    ? datasets[0].metadata?.datasetReference?.projectId ?? bigquery.projectId
    : bigquery.projectId;
  return [{ id: projectId, name: projectId }];
};

export const listDatasets = async (projectId: string): Promise<BqDataset[]> => {
  const bq = new BigQuery({ projectId });
  const [datasets] = await bq.getDatasets();
  return datasets.map((dataset) => ({
    id: dataset.id ?? '',
    projectId,
  }));
};

export const listTables = async (projectId: string, datasetId: string): Promise<BqTable[]> => {
  const bq = new BigQuery({ projectId });
  const dataset = bq.dataset(datasetId);
  const [tables] = await dataset.getTables();
  return tables.map((table) => ({
    id: table.id ?? '',
    datasetId,
    projectId,
    type: (table.metadata?.type as string) ?? 'TABLE',
  }));
};

export const previewTable = async (
  projectId: string,
  datasetId: string,
  tableId: string
): Promise<BqTablePreview> => {
  const bq = new BigQuery({ projectId });
  const query = `SELECT * FROM \`${projectId}.${datasetId}.${tableId}\` LIMIT 5`;
  const [rows] = await bq.query({ query });
  const columns = rows.length > 0 ? Object.keys(rows[0]) : [];
  return {
    columns,
    rows: rows.map((row) => columns.map((col) => formatCellValue(row[col]))),
    totalRows: rows.length,
  };
};

const formatCellValue = (value: unknown): string => {
  if (value === null || value === undefined) return 'NULL';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
};

export const runQuery = async (req: BqQueryRequest): Promise<BqQueryResult> => {
  const bq = req.projectId ? new BigQuery({ projectId: req.projectId }) : bigquery;
  const startTime = Date.now();
  const [job] = await bq.createQueryJob({ query: req.query });
  const [rows] = await job.getQueryResults();
  const durationMs = Date.now() - startTime;
  const columns = rows.length > 0 ? Object.keys(rows[0]) : [];
  const metadata = await job.getMetadata();
  const totalBytesProcessed = metadata[0]?.statistics?.totalBytesProcessed ?? '0';
  return {
    columns,
    rows: rows.map((row) => columns.map((col) => formatCellValue(row[col]))),
    totalRows: rows.length,
    durationMs,
    bytesProcessed: Number(totalBytesProcessed),
  };
};

const SAVED_QUERIES_PATH = (): string => {
  const { app } = require('electron');
  const path = require('node:path');
  return path.join(app.getPath('userData'), 'saved-queries.json');
};

export const loadSavedQueries = async (): Promise<BqSavedQuery[]> => {
  const fs = require('node:fs/promises');
  try {
    const data = await fs.readFile(SAVED_QUERIES_PATH(), 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
};

export const saveSavedQueries = async (queries: BqSavedQuery[]): Promise<void> => {
  const fs = require('node:fs/promises');
  await fs.writeFile(SAVED_QUERIES_PATH(), JSON.stringify(queries, null, 2));
};
