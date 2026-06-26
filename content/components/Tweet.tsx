'use client';
import { Component, type ReactNode } from 'react';
import { Tweet as ReactTweet } from 'react-tweet';

class TweetBoundary extends Component<
  { id: string; children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <a
          href={`https://x.com/i/status/${this.props.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-fd-muted-foreground hover:text-fd-foreground text-sm"
        >
          View tweet on X →
        </a>
      );
    }
    return this.props.children;
  }
}

export function Tweet({ id }: { id: string }) {
  return (
    <div className="my-4 flex justify-center">
      <TweetBoundary id={id}>
        <ReactTweet id={id} />
      </TweetBoundary>
    </div>
  );
}
