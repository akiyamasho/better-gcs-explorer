# Changelog

All notable changes to this project will be documented in this file.

## [2.0.0] - 2026-02-25

### Added
- **BigQuery tab** with sidebar tree for browsing projects, datasets, and tables.
- Query editor with tab management, `Cmd/Ctrl+Enter` to run, save/load queries.
- Table preview (LIMIT 5) on click.
- Quick Jump (`Cmd/Ctrl+Shift+P`) with regex search across loaded tables and datasets.
- Favorite projects and favorite tables, pinned to the top of the sidebar.
- Manually add projects with access validation (shows error if inaccessible).
- Drag-and-drop tables from sidebar into query editor to insert fully-qualified table ID.
- Right-click context menu on tables: copy dataset ID, copy backtick-quoted ID, insert into editor.
- Excel-like results grid with cell selection (click, shift-click, drag), keyboard navigation (arrow keys, Tab), copy (`Cmd/Ctrl+C` as TSV), and select all (`Cmd/Ctrl+A`).
- Smart cell rendering: image URLs display as inline thumbnails, regular URLs as clickable links opening in system browser.
- Service tab switcher at the top to switch between Cloud Storage and BigQuery.

### Changed
- Renamed project from "Better GCS Explorer" to "Better GCP".
- Sidebar is now independently scrollable with long dataset/table names middle-truncated (start...end) and full name on hover.

### Fixed
- `make dev` now works on Apple Silicon Macs (fixed `ELECTRON_RUN_AS_NODE` env var leak and IPv4/IPv6 localhost mismatch).

## [1.1.0] - 2026-02-05
### Added
- Batch selection bar with download/delete actions and select-all toggle.
- Per-row download button and file-only delete actions.
- Quick Open keyboard navigation (up/down + enter).
- Create-folder action in empty-space context menu.

## [1.0.0] - 2026-02-05
### Added
- Finder-like GCS browsing with breadcrumbs and directory tree.
- Favorites, recents, quick open, and go-to-path modal.
- Context menu actions for path/gsutil commands.
- Drag-and-drop upload and drag-out download.
- Local packaging and GitHub Actions release workflow.
