'use client';
import { Tweet as ReactTweet } from 'react-tweet';

export function Tweet({ id }: { id: string }) {
  return (
    <div className="my-4 flex justify-center">
      <ReactTweet id={id} />
    </div>
  );
}
