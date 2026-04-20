import docsSourcesJson from '../docs-sources.json';

export type DocsSourceConfig = {
  name: string;
  package: string;
  source: string;
  mode?: 'snapshot';
};

const docsSources = docsSourcesJson as DocsSourceConfig[];

function parseEnabledSourceOverride(value: string | undefined): Set<string> | 'all' {
  if (!value) return new Set();

  const ids = value
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean);

  return ids.includes('*') ? 'all' : new Set(ids);
}

function normalizeSourcePath(source: string): string {
  return source.replace(/^\/+|\/+$/g, '');
}

export function getDocsSourceRepo(source: string): string {
  return normalizeSourcePath(source).split('/')[0] ?? source;
}

export function getDocsSourceSubpath(source: string): string {
  return normalizeSourcePath(source).split('/').slice(1).join('/');
}

const enabledSourceOverride = parseEnabledSourceOverride(process.env.DOCS_SOURCE_IDS);

export function isDocsSourceEnabled(sourceId: string): boolean {
  if (enabledSourceOverride === 'all') return true;
  if (enabledSourceOverride.size > 0) {
    return enabledSourceOverride.has(sourceId);
  }

  return true;
}

export function getProjectRepo(repo: string): string {
  return `statelyai/${repo}`;
}

export function getProjectBranch(): string {
  return 'main';
}

export function getProjectDocsDir(): string {
  return 'docs';
}

export function normalizeRoute(route: string | string[]): string {
  if (Array.isArray(route)) return route.join('/');
  return route.replace(/^\/+|\/+$/g, '');
}

export function getProjectRoutePrefix(packageName: string): string {
  return `packages/${packageName}`;
}

export function prefixRoute(packageName: string, route: string): string {
  const normalized = normalizeRoute(route);
  const prefix = getProjectRoutePrefix(packageName);
  return normalized ? `${prefix}/${normalized}` : prefix;
}

export function stripProjectPrefix(packageName: string, pagePath: string): string {
  const normalized = pagePath.replace(/^\/+/, '');
  const prefix = getProjectRoutePrefix(packageName);

  if (normalized === prefix) return 'index.md';

  const nestedPrefix = `${prefix}/`;
  if (normalized.startsWith(nestedPrefix)) {
    return normalized.slice(nestedPrefix.length);
  }

  return normalized;
}

export const docsSourceConfigs = docsSources;
export const enabledExternalDocsSources = docsSourceConfigs.filter((sourceConfig) =>
  isDocsSourceEnabled(sourceConfig.package),
);

export function getDocsSourceByPackage(packageName: string): DocsSourceConfig | undefined {
  return docsSourceConfigs.find((sourceConfig) => sourceConfig.package === packageName);
}

export function getDocsPageGitHubUrl(sourceId: string, pagePath: string): string {
  const normalizedPath = pagePath.replace(/^\/+/, '');

  if (sourceId === 'docs') {
    return `https://github.com/statelyai/docs/blob/main/content/docs/${normalizedPath}`;
  }

  const sourceConfig = getDocsSourceByPackage(sourceId);
  if (!sourceConfig) {
    return `https://github.com/statelyai/docs/blob/main/content/docs/${normalizedPath}`;
  }

  return `https://github.com/${getProjectRepo(getDocsSourceRepo(sourceConfig.source))}/blob/${getProjectBranch()}/${stripProjectPrefix(
    sourceId,
    normalizedPath,
  )}`;
}
