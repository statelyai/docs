import { YouTube as MDXYouTube } from 'mdx-embed';
import React from 'react';

export default function YouTube({ id }: { id: string }) {
  return (
    <div style={{ margin: '20px 0' }}>
      <MDXYouTube youTubeId={id} />
    </div>
  );
}
