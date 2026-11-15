import { getPageImage, source } from '@/lib/source';
import { notFound } from 'next/navigation';
import { ImageResponse } from 'next/og';
import {
  getOGFonts,
  OG_SIZE,
  OGImage,
} from '@/app/_og/_components/og-image';

export const revalidate = false;

export async function GET(
  req: Request,
  { params }: RouteContext<'/docs/og/[...slug]'>,
) {
  const { slug } = await params;
  const page = source.getPage(slug.slice(0, -1));
  if (!page) notFound();

  return new ImageResponse(
    (
      <OGImage
        title={page.data.title}
        description={page.data.description}
        type="docs"
        path={page.slugs.slice(0, -1)}
        url={page.url}
      />
    ),
    { ...OG_SIZE, fonts: await getOGFonts() },
  );
}

export function generateStaticParams() {
  return source.getPages().map((page) => ({
    lang: page.locale,
    slug: getPageImage(page).segments,
  }));
}
