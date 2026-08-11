function normalizePath(value) {
  return String(value).replace(/\\/gu, '/').replace(/^\/+|\/+$/gu, '');
}

/**
 * @param {{ source: string; mounts?: Array<{ source: string }> }} project
 * @param {string} repoRelativePath
 */
export function isDocsSourceWatchPath(project, repoRelativePath) {
  const normalized = normalizePath(repoRelativePath);
  const [, ...sourceSegments] = normalizePath(project.source).split('/');
  const sourceSubpath = sourceSegments.join('/');

  if (
    sourceSubpath &&
    normalized !== sourceSubpath &&
    !normalized.startsWith(`${sourceSubpath}/`)
  ) {
    return false;
  }

  const sourceRelativePath = sourceSubpath
    ? normalized.slice(sourceSubpath.length).replace(/^\/+/, '')
    : normalized;

  if (project.mounts) {
    return project.mounts.some((mount) => {
      const mountSource = normalizePath(mount.source);
      return (
        sourceRelativePath === mountSource ||
        sourceRelativePath.startsWith(`${mountSource}/`)
      );
    });
  }

  return (
    /^readme\.(md|mdx)$/iu.test(sourceRelativePath) ||
    sourceRelativePath === 'docs' ||
    sourceRelativePath.startsWith('docs/')
  );
}
