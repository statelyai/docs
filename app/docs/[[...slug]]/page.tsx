import { getPageGitHubUrl, getPageImage, source } from '@/lib/source';
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from 'fumadocs-ui/page';
import { notFound, redirect } from 'next/navigation';
import { getMDXComponents } from '@/mdx-components';
import type { Metadata } from 'next';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import { LLMCopyButton, ViewOptions } from '@/components/page-actions';
import { DocsSourceNotice } from '@/components/docs-source-notice';
import {
  isExternalDocsSlug,
  getVersionedDocsRoot,
  getVersionedDocsStaticParams,
  resolveExternalPackageHref,
} from '@/lib/external-package-source';

export default async function Page(props: PageProps<'/docs/[[...slug]]'>) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) {
    const versionedRoot = getVersionedDocsRoot(params.slug);
    const firstPage = versionedRoot?.pages.find((item) => 'url' in item);
    if (firstPage && 'url' in firstPage) redirect(firstPage.url);
    notFound();
  }

  const data = 'load' in page.data ? { ...page.data, ...(await page.data.load()) } : page.data;
  const MDX = data.body;
  const RelativeLink = createRelativeLink(source as any, page);

  return (
    <DocsPage toc={data.toc} full={data.full}>
      <DocsTitle>{data.title}</DocsTitle>
      <DocsDescription>{data.description}</DocsDescription>
      <DocsBody>
        <div className="flex flex-row gap-2 items-center border-b pt-2 pb-6">
          <LLMCopyButton markdownUrl={`${page.url}.mdx`} />
          <ViewOptions
            markdownUrl={`${page.url}.mdx`}
            githubUrl={getPageGitHubUrl(page)}
          />
        </div>
        <DocsSourceNotice sourceId={page.type} />
        <MDX
          components={getMDXComponents({
            a: (linkProps) => (
              <RelativeLink
                {...linkProps}
                href={resolveExternalPackageHref(page, linkProps.href)}
              />
            ),
          })}
        />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  if (process.env.NODE_ENV === 'development') {
    return [];
  }

  return [
    ...source
      .generateParams()
      .filter((params) => !isExternalDocsSlug(params.slug)),
    ...getVersionedDocsStaticParams(),
  ];
}

export async function generateMetadata(
  props: PageProps<'/docs/[[...slug]]'>,
): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) {
    const versionedRoot = getVersionedDocsRoot(params.slug);
    if (versionedRoot) return { title: versionedRoot.name };
    notFound();
  }

  return {
    title: page.data.title,
    description: page.data.description,
    openGraph: {
      images: getPageImage(page).url,
    },
  };
}
