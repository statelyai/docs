import { externalDocsNav } from '@/lib/external-docs-nav.generated';
import { getPageGitHubUrl, getPageImage } from '@/lib/source';

export function isExternalDocsSlug(slugs: string[] = []): boolean {
  return slugs[0] === 'packages' && typeof slugs[1] === 'string';
}

export function getExternalPackageStaticParams() {
  return externalDocsNav.flatMap((sourceConfig) =>
    sourceConfig.pages.map((page) => {
      const [, docsRoot, packagesRoot, packageName, ...slug] =
        page.url.split('/');

      if (
        docsRoot !== 'docs' ||
        packagesRoot !== 'packages' ||
        !packageName
      ) {
        throw new Error(`Invalid external docs URL in generated nav: ${page.url}`);
      }

      return {
        package: packageName,
        slug,
      };
    }),
  );
}
export { getPageGitHubUrl, getPageImage };
