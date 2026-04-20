import path from 'node:path';

export function getRepoRoot() {
  return process.cwd();
}

export function getLocalProjectCheckoutDir(project: string): string {
  return path.resolve(getRepoRoot(), '..', project);
}

export function getRemoteProjectCheckoutDir(project: string): string {
  return path.resolve(getRepoRoot(), '.cache', 'docs-repos', project);
}

export function getGeneratedProjectCheckoutDir(project: string): string {
  return path.resolve(getRepoRoot(), '.cache', 'docs-workspaces', project);
}

export function getSnapshotProjectCheckoutDir(project: string): string {
  return path.resolve(getRepoRoot(), 'external-docs', project);
}

export function getProjectCheckoutDir(
  project: string,
  mode?: 'snapshot',
): string {
  if (mode === 'snapshot') {
    return getSnapshotProjectCheckoutDir(project);
  }

  return getGeneratedProjectCheckoutDir(project);
}
