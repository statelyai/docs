import docsSourcesJson from '../docs-sources.json';

const docsSources = docsSourcesJson as string[];

function parseEnabledSourceOverride(value: string | undefined): Set<string> | 'all' {
  if (!value) return new Set();

  const ids = value
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean);

  return ids.includes('*') ? 'all' : new Set(ids);
}

const enabledSourceOverride = parseEnabledSourceOverride(process.env.DOCS_SOURCE_IDS);

export function isDocsSourceEnabled(sourceId: string): boolean {
  if (enabledSourceOverride === 'all') return true;
  if (enabledSourceOverride.size > 0) {
    return enabledSourceOverride.has(sourceId);
  }

  return true;
}

export function getProjectRepo(project: string): string {
  return `statelyai/${project}`;
}

export function getProjectBranch(): string {
  return 'main';
}

export function getProjectDocsDir(): string {
  return 'docs';
}

export function getProjectEditUrlBase(project: string): string {
  return `https://github.com/${getProjectRepo(project)}/blob/${getProjectBranch()}/${getProjectDocsDir()}`;
}

export function normalizeRoute(route: string | string[]): string {
  if (Array.isArray(route)) return route.join('/');
  return route.replace(/^\/+|\/+$/g, '');
}

export function getProjectRoutePrefix(project: string): string {
  return `packages/${project}`;
}

export function prefixRoute(project: string, route: string): string {
  const normalized = normalizeRoute(route);
  const prefix = getProjectRoutePrefix(project);
  return normalized ? `${prefix}/${normalized}` : prefix;
}

export function stripProjectPrefix(project: string, pagePath: string): string {
  const normalized = pagePath.replace(/^\/+/, '');
  const prefix = getProjectRoutePrefix(project);

  if (normalized === prefix) return 'index.md';

  const nestedPrefix = `${prefix}/`;
  if (normalized.startsWith(nestedPrefix)) {
    return normalized.slice(nestedPrefix.length);
  }

  return normalized;
}

export const docsSourceConfigs = docsSources;
export const enabledExternalDocsSources = docsSourceConfigs.filter((sourceId) =>
  isDocsSourceEnabled(sourceId),
);

export function getDocsPageGitHubUrl(sourceId: string, pagePath: string): string {
  const normalizedPath = pagePath.replace(/^\/+/, '');

  if (sourceId === 'docs') {
    return `https://github.com/statelyai/docs/blob/main/content/docs/${normalizedPath}`;
  }

  return `${getProjectEditUrlBase(sourceId)}/${stripProjectPrefix(
    sourceId,
    normalizedPath,
  )}`;
}
