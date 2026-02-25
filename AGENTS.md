# Better GCP - Agent Onboarding

## Project Overview

A local-only Electron desktop app for browsing Google Cloud Platform services with a Finder-like UI. Built with React (renderer) and Node.js (main process), using `@google-cloud/storage` and `@google-cloud/bigquery` SDKs.

## Tech Stack

- **Runtime**: Electron 30, Node.js 18+
- **Frontend**: React 18, TypeScript, Vite
- **Backend (main process)**: TypeScript, `@google-cloud/storage`, `@google-cloud/bigquery`
- **Package manager**: pnpm
- **Build**: Vite (renderer) + tsc (electron), electron-builder (packaging)
- **Platform**: macOS (primary target)

## File Structure (Clean Architecture)

```
├── src/                  # Renderer process (React UI)
│   ├── App.tsx           # Root component with service tab switching
│   ├── GcsTab.tsx        # Cloud Storage tab (sidebar, file list, modals)
│   ├── BigQueryTab.tsx   # BigQuery tab (tree, query editor, results)
│   ├── main.tsx          # React entry point
│   └── styles.css        # Global styles
├── electron/             # Main process (Electron backend)
│   ├── main.ts           # Electron app entry, window creation, IPC handlers
│   ├── gcs.ts            # GCS operations (list, download, upload, delete)
│   ├── bigquery.ts       # BigQuery operations (list, query, saved queries)
│   ├── preload.ts        # Context bridge for renderer ↔ main IPC
│   ├── renderer.d.ts     # Type declarations for preload API
│   └── types.ts          # Electron-side type definitions
├── shared/               # Shared types between renderer and main process
│   └── types.ts          # GCS and BigQuery request/response types
├── scripts/              # Build and dev scripts
│   ├── dev.mjs           # Dev server launcher
│   └── package.mjs       # Packaging script
├── build/                # Electron-builder resources (icons, etc.)
├── dist/                 # Vite build output (renderer)
├── dist-electron/        # tsc build output (main process)
├── dist-app/             # Final packaged app directory
├── index.html            # Vite HTML entry point
├── vite.config.ts        # Vite configuration
├── tsconfig.json         # TypeScript config (renderer + shared)
├── electron/tsconfig.json # TypeScript config (main process)
├── Makefile              # Build/run shortcuts
└── package.json          # Dependencies and scripts
```

When adding new code, follow Clean Architecture layering:
- **shared/**: Domain types and interfaces shared across processes. No dependencies on Electron or React.
- **electron/**: Infrastructure and application logic for the main process. GCS/BigQuery operations, file system access, IPC handlers.
- **src/**: Presentation layer. React components, UI state, and user interaction logic.

Keep dependencies flowing inward: `src/` and `electron/` may depend on `shared/`, but `shared/` must not import from `src/` or `electron/`.

## Commands

```bash
make install    # Install dependencies (pnpm install)
make run        # Build + package + launch the app
make dmg        # Build + package as DMG

pnpm run build      # Build renderer (Vite) + main process (tsc)
pnpm run typecheck  # Type-check both renderer and electron
pnpm run package    # Package with electron-builder
```

```bash
make dev        # Dev mode with hot-reload (Electron + Vite + tsc watch)
```

## Path Alias

`@shared/*` resolves to `shared/*` (configured in both `tsconfig.json` and `vite.config.ts`).

## IPC Pattern

Renderer ↔ Main communication uses Electron IPC:
1. Handlers registered in `electron/main.ts` via `ipcMain.handle('<service>:<action>', ...)`
2. Exposed to renderer via `electron/preload.ts` context bridge as `window.gcs.*`, `window.bq.*`, and `window.shell.*`
3. Called from React components via the corresponding window API

When adding a new service:
1. Create `electron/<service>.ts` with operations
2. Add types to `electron/types.ts` and `shared/types.ts`
3. Register IPC handlers in `electron/main.ts`
4. Expose via `contextBridge` in `electron/preload.ts`
5. Declare on `Window` in `electron/renderer.d.ts`
6. Create `src/<Service>Tab.tsx` and add to `src/App.tsx` tab switcher

## Coding Rules

Follow Clean Code principles (Robert C. Martin). The goal is self-documenting code.

### Naming
- Use intention-revealing names. A reader should understand what a variable, function, or type does from its name alone.
- Functions should be named as verbs or verb phrases (`listBuckets`, `downloadPrefix`, `formatBytes`).
- Types and interfaces should be named as nouns (`GcsBucket`, `ListObjectsRequest`).
- Booleans should read as predicates (`isPrefix`, `isDev`, `loaded`).
- Avoid abbreviations unless universally understood (`req`, `res`, `err` are fine; avoid made-up shorthands).

### Functions
- Keep functions small and focused on a single task.
- Prefer fewer arguments. Use an options object when a function takes more than 2-3 parameters.
- Functions should do one thing. If a function name contains "and", it likely does too much.
- Extract helper functions instead of writing comments to explain complex blocks.

### Comments
- Do not write comments that restate what the code does. The code should be readable on its own.
- Comments are acceptable for: explaining *why* (not *what*), legal notices, TODOs with context, and warnings about consequences.
- If you feel a comment is necessary, first try to refactor the code to make it self-explanatory.

### Types
- Use TypeScript types for all function signatures, parameters, and return values.
- Prefer `type` over `interface` for consistency with the existing codebase.
- Define shared types in `shared/types.ts`; electron-specific types in `electron/types.ts`.
- Do not use `any`. Use `unknown` and narrow with type guards when the type is genuinely unknown.

### Error Handling
- Do not ignore errors silently. Either handle them or let them propagate.
- Use structured error returns (`{ ok: false, error: string }`) for IPC handlers, matching the existing pattern.
- Only add error handling at system boundaries (IPC handlers, user input). Trust internal function contracts.

### Formatting
- Keep files focused. If a file grows beyond a single responsibility, split it.
- Group related code together: types at the top, constants next, then functions.
- No dead code. Delete unused imports, variables, and functions — do not comment them out.

## Git Conventions

Use **Conventional Commits** for all commit messages:

```
<type>(<optional scope>): <description>

[optional body]
```

### Types
- `feat`: New feature or user-facing functionality
- `fix`: Bug fix
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `docs`: Documentation only changes
- `style`: Formatting, missing semicolons, etc. (no code logic change)
- `test`: Adding or updating tests
- `chore`: Build process, dependency updates, tooling
- `perf`: Performance improvement

### Rules
- Use lowercase for the description. Do not end with a period.
- Keep the subject line under 72 characters.
- Use the body to explain *what* and *why*, not *how*.
- Scope is optional but encouraged (e.g., `feat(gcs): add folder creation`, `feat(bq): add query editor`).
