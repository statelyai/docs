import { Tweet as MDXTweet } from 'mdx-embed';
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
