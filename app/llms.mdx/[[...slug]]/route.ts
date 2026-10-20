import { getLLMText, source } from '@/lib/source';
import { notFound } from 'next/navigation';
import { SITE_URL } from '@/lib/seo';

export const revalidate = false;

export async function GET(
  _req: Request,
  { params }: RouteContext<'/llms.mdx/[[...slug]]'>,
) {
  const { slug } = await params;
  const page = source.getPage(slug);
  if (!page) notFound();

  return new Response(await getLLMText(page), {
    headers: {
      'Content-Type': 'text/markdown',
      Link: `<${SITE_URL}${page.url}>; rel="canonical"`,
    },
  });
}

export function generateStaticParams() {
  return source.generateParams();
}
