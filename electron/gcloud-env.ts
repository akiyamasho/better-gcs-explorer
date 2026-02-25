import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

/**
 * When launched as a macOS .app bundle, the process doesn't inherit
 * shell environment variables like GOOGLE_CLOUD_PROJECT. Read the
 * gcloud CLI config files directly so the Google Cloud client
 * libraries can detect the default project.
 */
export function loadGcloudEnv(): void {
  if (process.env.GOOGLE_CLOUD_PROJECT || process.env.GCLOUD_PROJECT) return;

  const configDir =
    process.env.CLOUDSDK_CONFIG || path.join(os.homedir(), '.config', 'gcloud');

  let projectId: string | undefined;

  // Try the active named configuration first
  try {
    const activeName =
      fs.readFileSync(path.join(configDir, 'active_config'), 'utf-8').trim() ||
      'default';
    projectId = readProjectFromIni(
      path.join(configDir, 'configurations', `config_${activeName}`)
    );
  } catch {
    // no active config – fall through
  }

  // Fall back to global properties
  if (!projectId) {
    try {
      projectId = readProjectFromIni(path.join(configDir, 'properties'));
    } catch {
      // no properties file
    }
  }

  if (projectId) {
    process.env.GOOGLE_CLOUD_PROJECT = projectId;
  }
}

function readProjectFromIni(filePath: string): string | undefined {
  const content = fs.readFileSync(filePath, 'utf-8');
  const match = content.match(/^\s*project\s*=\s*(.+)$/m);
  return match?.[1]?.trim();
}
