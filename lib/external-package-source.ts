import path from 'node:path';
import type { InferPageType } from 'fumadocs-core/source';
import { externalDocsNav } from '@/lib/external-docs-nav.generated';
import { getPageGitHubUrl, getPageImage, source } from '@/lib/source';
import {
  getDocsSourceByPackage,
  getDocsSourceGitRef,
  getDocsSourceRepo,
  getDocsSourceSubpath,
  getProjectRepo,
  stripProjectPrefix,
} from '@/lib/docs-sources';

export function isExternalDocsSlug(slugs: string[] = []): boolean {
  return slugs[0] === 'packages' && typeof slugs[1] === 'string';
}

export function getExternalPackageStaticParams() {
  return externalDocsNav.flatMap((sourceConfig) =>
    sourceConfig.pages.flatMap((page) => {
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
    }),
  );
}

export function resolveExternalPackageHref(
  page: InferPageType<typeof source>,
  href: string | undefined,
): string | undefined {
  if (!href) return href;

  const resolved = source.resolveHref(href, page);
  if (resolved !== href) return resolved;
  if (!href.startsWith('./') && !href.startsWith('../')) return href;

  const sourceConfig = getDocsSourceByPackage(page.type);
  if (sourceConfig?.mode !== 'workspace') return href;

  const suffixIndex = href.search(/[?#]/u);
  const target = suffixIndex === -1 ? href : href.slice(0, suffixIndex);
  const suffix = suffixIndex === -1 ? '' : href.slice(suffixIndex);
  const sourcePagePath =
    page.data.sourcePath ?? stripProjectPrefix(page.type, page.path);
  const workspacePath = path.posix.normalize(
    path.posix.join(path.posix.dirname(sourcePagePath), target),
  );

  if (workspacePath.startsWith('../')) return href;

  const sourcePath = path.posix.join(
    getDocsSourceSubpath(sourceConfig.source),
    workspacePath,
  );
  const view = path.posix.extname(sourcePath) ? 'blob' : 'tree';
  const repo = getProjectRepo(getDocsSourceRepo(sourceConfig.source));

  return `https://github.com/${repo}/${view}/${getDocsSourceGitRef(sourceConfig)}/${sourcePath}${suffix}`;
}
export { getPageGitHubUrl, getPageImage };
