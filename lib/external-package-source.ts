import path from 'node:path';
import type { InferPageType } from 'fumadocs-core/source';
import { externalDocsNav } from '@/lib/external-docs-nav.generated';
import { getPageGitHubUrl, getPageImage, source } from '@/lib/source';
import {
  getDocsSourceByPackage,
  getDocsSourceGitRef,
  getDocsSourceRepo,
  getDocsSourceRoutePath,
  getDocsSourceSubpath,
  getProjectRoutePrefix,
  getProjectRepo,
  stripProjectPrefix,
} from '@/lib/docs-sources';
import { parseWorkspaceRelativeHref } from '@/lib/workspace-link.mjs';

export function isExternalDocsSlug(slugs: string[] = []): boolean {
  return slugs[0] === 'packages' && typeof slugs[1] === 'string';
}

export function getVersionedDocsRoot(slugs: string[] = []) {
  const route = slugs.join('/');
  return externalDocsNav.find(
    (sourceConfig) =>
      !sourceConfig.route.startsWith('packages/') && sourceConfig.route === route,
  );
}

export function getVersionedDocsStaticParams() {
  return externalDocsNav
    .filter((sourceConfig) => !sourceConfig.route.startsWith('packages/'))
    .map((sourceConfig) => ({ slug: sourceConfig.route.split('/') }));
}

export function getExternalPackageStaticParams() {
  return externalDocsNav.flatMap((sourceConfig) => {
    if (sourceConfig.route !== `packages/${sourceConfig.package}`) return [];

    return sourceConfig.pages.flatMap((page) => {
      if (!('url' in page)) return [];

      const [, docsRoot, packagesRoot, packageName, ...slug] =
        page.url.split('/');

      if (
        docsRoot !== 'docs' ||
        packagesRoot !== 'packages' ||
        !packageName
      ) {
        throw new Error(`Invalid external docs URL in generated nav: ${page.url}`);
      }

      return [
        {
          package: packageName,
          slug,
        },
      ];
    });
  });
}

export function resolveExternalPackageHref(
  page: InferPageType<typeof source>,
  href: string | undefined,
): string | undefined {
  if (!href) return href;

  const resolved = source.resolveHref(href, page);
  if (resolved !== href) return resolved;

  const sourceConfig = getDocsSourceByPackage(page.type);
  if (sourceConfig?.mode !== 'workspace') return href;

  const relativeHref = parseWorkspaceRelativeHref(href);
  if (!relativeHref) return href;

  const { target, suffix } = relativeHref;
  const sourcePagePath =
    page.data.sourcePath ?? stripProjectPrefix(page.type, page.path);
  const workspacePath = path.posix.normalize(
    path.posix.join(path.posix.dirname(sourcePagePath), target),
  );

  if (workspacePath.startsWith('../')) return href;

  const isIncludedMarkdown =
    /\.(md|mdx)$/iu.test(workspacePath) &&
    (sourceConfig.include ?? [
      'README.md',
      'docs/**/*.md',
      'docs/**/*.mdx',
    ]).some((pattern) => path.matchesGlob(workspacePath, pattern));

  if (isIncludedMarkdown) {
    let routePath = getDocsSourceRoutePath(sourceConfig, workspacePath)
      .replace(/\.(md|mdx)$/iu, '')
      .replace(/(^|\/)(readme|index)$/iu, '');
    routePath = routePath.replace(/^\/+|\/+$/gu, '');
    const prefix = `/docs/${getProjectRoutePrefix(sourceConfig.package)}`;
    return `${routePath ? `${prefix}/${routePath}` : prefix}${suffix}`;
  }

  const sourcePath = path.posix.join(
    getDocsSourceSubpath(sourceConfig.source),
    workspacePath,
  );
  const view = path.posix.extname(sourcePath) ? 'blob' : 'tree';
  const repo = getProjectRepo(getDocsSourceRepo(sourceConfig.source));

  return `https://github.com/${repo}/${view}/${getDocsSourceGitRef(sourceConfig)}/${sourcePath}${suffix}`;
}
export { getPageGitHubUrl, getPageImage };
