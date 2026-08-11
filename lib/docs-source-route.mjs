function normalizePath(value) {
  return value.replace(/\\/gu, '/').replace(/^\/+|\/+$/gu, '');
}

/**
 * @param {{ mounts?: Array<{ source: string; route: string }> }} source
 * @param {string} sourcePath
 * @returns {string | null}
 */
export function resolveDocsSourceRoutePath(source, sourcePath) {
  const normalized = normalizePath(sourcePath);
  const mount = source.mounts
    ?.filter((candidate) => {
      const mountSource = normalizePath(candidate.source);
      return (
        normalized === mountSource || normalized.startsWith(`${mountSource}/`)
      );
    })
    .sort((left, right) => right.source.length - left.source.length)[0];

  if (source.mounts && !mount) return null;

  const mountSource = mount ? normalizePath(mount.source) : '';
  const relative = mount
    ? normalized.slice(mountSource.length).replace(/^\/+/, '')
    : normalized.replace(/^docs\//u, '');
  const indexPath = relative.replace(
    /(^|\/)readme\.(md|mdx)$/iu,
    '$1index.$2',
  );

  return [mount?.route, indexPath]
    .map((segment) => segment && normalizePath(segment))
    .filter(Boolean)
    .join('/');
}
