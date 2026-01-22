import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from 'fumadocs-ui/page';
import { blog, getBlogImage } from '@/lib/source';
import { getMDXComponents } from '@/mdx-components';
import path from 'node:path';

export default async function Page(props: PageProps<'/blog/[slug]'>) {
  const params = await props.params;
  const page = blog.getPage([params.slug]);

  if (!page) notFound();
  const { body: Mdx, toc } = page.data;

  return (
    <DocsPage toc={toc}>
      <Link
        href="/blog"
        className="text-sm text-fd-muted-foreground hover:text-fd-foreground mb-4 inline-block"
      >
        ← Back to Blog
      </Link>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <div className="flex items-center gap-4 text-sm text-fd-muted-foreground border-b pb-4 mb-6">
        <span>{page.data.authors.join(', ')}</span>
        <span>•</span>
        <span>
          {new Date(
            page.data.date ?? path.basename(page.path, path.extname(page.path)),
          ).toDateString()}
        </span>
      </div>
      <DocsBody>
        <Mdx components={getMDXComponents()} />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateMetadata(
  props: PageProps<'/blog/[slug]'>,
): Promise<Metadata> {
  const params = await props.params;
  const page = blog.getPage([params.slug]);

  if (!page) notFound();

  return {
    title: page.data.title,
    description:
      page.data.description ?? 'The library for building documentation sites',
    openGraph: {
      images: getBlogImage(page).url,
    },
  };
}

export function generateStaticParams(): { slug: string }[] {
  return blog.getPages().map((page) => ({
    slug: page.slugs[0],
  }));
}
