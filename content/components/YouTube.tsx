'use client';
import { YouTube as MDXYouTube } from 'mdx-embed';

export function YouTube({ id }: { id: string }) {
  return (
    <div className="my-4">
      <MDXYouTube youTubeId={id} />
    </div>
  );
}
