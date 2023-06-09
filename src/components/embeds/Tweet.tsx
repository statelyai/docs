import { Tweet as MDXTweet } from 'mdx-embed';
import React from 'react';
export default function Tweet({ id }: { id: string }) {
  return (
    <MDXTweet
      hideConversation
      tweetLink={`anyuser/status/${id}`}
      theme="dark"
      align="center"
    />
  );
}
