import { blog, getBlogImage } from '@/lib/source';
import { notFound } from 'next/navigation';
import { ImageResponse } from 'next/og';
import { OGImage } from '@/app/og/_components/og-image';

export const revalidate = false;

export async function GET(
  _req: Request,
  { params }: RouteContext<'/og/blog/[...slug]'>,
) {
  const { slug } = await params;
  // slug is array like ['post-name', 'image.png'], remove image.png
  const page = blog.getPage(slug.slice(0, -1));
  if (!page) notFound();

  const data = page.data as any;
  const date = data.date
    ? new Date(data.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : undefined;

  return new ImageResponse(
    (
      <OGImage
        title={data.title}
        description={data.description}
        type="blog"
        author={data.authors?.join(', ')}
        date={date}
      />
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}

export function generateStaticParams() {
  return blog.getPages().map((page) => ({
    slug: getBlogImage(page).segments,
  }));
}
