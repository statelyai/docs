'use client';
import { Tweet as MDXTweet } from 'mdx-embed';

export function Tweet({ id }: { id: string }) {
  return (
    <div className="my-4 flex justify-center">
      <MDXTweet tweetLink={`x/status/${id}`} />
    </div>
  );
}
