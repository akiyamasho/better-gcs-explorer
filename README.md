# Better GCP

![Version](https://img.shields.io/badge/version-v2.0.0-blue)
![Release](https://img.shields.io/badge/release-stable-brightgreen)

Local-only Electron app for browsing Google Cloud Platform services with a Finder-like UI. All data stays on your machine — no telemetry, no cloud backend.

## Cloud Storage

![Cloud Storage Tab](./doc/screenshot.png)

- Finder-like browsing with breadcrumbs and directory tree.
- Favorites and recents for fast bucket access.
- Quick Open (`Cmd/Ctrl+Shift+O`) for already-loaded items.
- Go to path (`Cmd/Ctrl+Shift+P`) modal for direct navigation.
- Context menu actions: copy paths and gsutil commands.
- Drag-and-drop upload and drag-out download.
- Batch selection bar with download/delete actions and select-all toggle.
- Per-row download button and file-only delete actions.
- Create-folder action in empty-space context menu.

## BigQuery

<!-- screenshot here -->

- **Sidebar tree** for projects, datasets, and tables with lazy loading.
- **Favorite projects** and **favorite tables** pinned to the top of the sidebar.
- **Add projects manually** with access validation — shows an error if the project is inaccessible.
- **Quick Jump** (`Cmd/Ctrl+Shift+P`) with regex search across loaded tables and datasets.
- **Middle-truncated names** in the sidebar so you can see both the start and end of long identifiers, with full name on hover.
- **Table preview** on click (LIMIT 5 rows).
- **Query editor** with `Cmd/Ctrl+Enter` to run. Shows row count, duration, and bytes processed.
- **Tab-based query management** — open multiple queries side by side, each with its own result.
- **Save and load queries** for reuse across sessions.
- **Drag-and-drop tables** from the sidebar into the query editor to insert the fully-qualified table ID.
- **Right-click context menu** on tables: copy dataset ID, copy backtick-quoted ID, or insert into editor.
- **Excel-like results grid**: click to select a cell, shift-click or drag to select a range, arrow keys to navigate, `Cmd/Ctrl+C` to copy as tab-separated values, `Cmd/Ctrl+A` to select all. Click a column header to select the entire column.
- **Smart cell rendering**: image URLs render as inline thumbnails, regular URLs render as clickable links that open in your system browser.

## Prereqs

- Node.js (18+)
- `gcloud` (`brew install google-cloud-sdk`)
- `pnpm` (`brew install pnpm`)
- Application Default Credentials: `gcloud auth application-default login`

## Development (hot-reload)

```bash
make dev
```

Runs Vite dev server + TypeScript watcher + Electron with hot-reload. Works on Apple Silicon Macs.

## Package and run (macOS)

```bash
make run
```

## Build DMG (macOS)

```bash
make dmg
```

## Notes

- Quick Open / Quick Jump only search already-loaded items. Expand projects and datasets in the sidebar to load them.
- Drag a file from the GCS list to the desktop to download via a temp file.
- Drop local files or folders into the GCS list to upload to the current prefix.
- BigQuery queries run using your Application Default Credentials project unless a specific project is set on the query tab.

## Changelog

See [`CHANGELOG.md`](./CHANGELOG.md)
