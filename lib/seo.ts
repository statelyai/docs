import type { Metadata } from 'next';

export const SITE_URL = 'https://stately.ai';
export const SITE_DESCRIPTION =
  'Design, simulate, and build application logic with Stately, XState, state machines, statecharts, and actors.';
export const SITE_IMAGE = '/assets/landing/room-readings.png';

export function pageMetadata({
  title,
  description = SITE_DESCRIPTION,
  path,
  image = SITE_IMAGE,
}: {
  title: string;
  description?: string;
  path: string;
  image?: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      siteName: 'Stately',
      title,
      description,
      url: path,
      images: [{ url: image, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}
