import type { Metadata } from 'next';
import type React from 'react';
import { notFound } from 'next/navigation';
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from 'fumadocs-ui/page';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import {
  getExternalPackageStaticParams,
  getPageGitHubUrl,
  getPageImage,
  resolveExternalPackageHref,
} from '@/lib/external-package-source';
import { source } from '@/lib/source';
import { getMDXComponents } from '@/mdx-components';
import { LLMCopyButton, ViewOptions } from '@/components/page-actions';
import { DocsSourceNotice } from '@/components/docs-source-notice';

type RenderableDocsData = {
  body: React.ComponentType<{
    components?: ReturnType<typeof getMDXComponents>;
  }>;
  description?: string;
  full?: boolean;
  title: string;
  toc: React.ComponentProps<typeof DocsPage>['toc'];
};

function getPackagePage(packageName: string, slugs: string[] = []) {
  return source.getPage(['packages', packageName, ...slugs]);
}

export default async function Page(
  props: PageProps<'/docs/packages/[package]/[[...slug]]'>,
) {
  const params = await props.params;
  const page = getPackagePage(params.package, params.slug);
  if (!page) notFound();

  const data = (
    'load' in page.data ? { ...page.data, ...(await page.data.load()) } : page.data
  ) as unknown as RenderableDocsData;
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

export function generateStaticParams() {
  if (process.env.NODE_ENV === 'development') {
    return [];
  }

  return getExternalPackageStaticParams();
}

export async function generateMetadata(
  props: PageProps<'/docs/packages/[package]/[[...slug]]'>,
): Promise<Metadata> {
  const params = await props.params;
  const page = getPackagePage(params.package, params.slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
    openGraph: {
      images: getPageImage(page).url,
    },
  };
}
