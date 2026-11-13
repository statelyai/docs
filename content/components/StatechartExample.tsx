'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import darkCaptures from '@/public/assets/statecharts/dark-captures.json';
import {
  statechartExamples,
  statechartExampleURL,
  statechartExampleEditURL,
  type StatechartExampleId,
  type StatechartColorMode,
} from '@/lib/statechart-examples';
import { useStatelyVizIframe } from './useStatelyVizIframe';

type Props = {
  name: string;
  example: StatechartExampleId;
  alt: string;
  caption: string;
  display?: 'inline' | 'on-demand';
};

const subscribeToNothing = () => () => {};

function StatechartImage({
  example,
  alt,
  className,
  fill = false,
}: Pick<Props, 'example' | 'alt'> & { className: string; fill?: boolean }) {
  const entry = statechartExamples[example];
  const dark = darkCaptures[example];
  return (
    <div
      className={`not-prose ${className}`}
      style={fill ? undefined : { width: entry.width }}
    >
      <Image
        src={
          'image' in entry ? entry.image : `/assets/statecharts/${example}.jpg`
        }
        alt={alt}
        width={entry.width}
        height={entry.height}
        unoptimized
        className={`${fill ? 'h-full max-h-full w-full object-contain' : 'h-auto w-full'} dark:hidden`}
      />
      <Image
        src={`/assets/statecharts/dark/${example}.png`}
        alt={alt}
        width={dark.width}
        height={dark.height}
        unoptimized
        className={`hidden ${fill ? 'h-full max-h-full w-full object-contain' : 'h-auto w-full'} dark:block`}
      />
    </div>
  );
}

function InlineStatechart({
  example,
  name,
  alt,
  embedURL,
  colorMode,
}: Pick<Props, 'example' | 'name' | 'alt'> & {
  embedURL: string;
  colorMode: StatechartColorMode;
}) {
  const container = useRef<HTMLDivElement>(null);
  const frameHost = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<
    'waiting' | 'loading' | 'ready' | 'error'
  >('waiting');
  const [attempt, setAttempt] = useState(0);
  const colorScheme = colorMode === 'system' ? 'light dark' : colorMode;
  const handleFrameError = useCallback(() => setStatus('error'), []);

  useEffect(() => {
    if (status !== 'waiting' || !container.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setStatus('loading');
      },
      { rootMargin: '200px' },
    );
    observer.observe(container.current);
    return () => observer.disconnect();
  }, [status]);

  useEffect(() => {
    function receive(event: MessageEvent) {
      if (
        event.origin !== 'https://editor.stately.ai' ||
        event.source !== iframe.current?.contentWindow
      )
        return;
      const data: unknown = event.data;
      if (!data || typeof data !== 'object' || !('type' in data)) return;
      if (data.type === '@statelyai.loaded') {
        setStatus('ready');
      } else if (data.type === '@statelyai.error') {
        setStatus((current) => (current === 'ready' ? current : 'error'));
      }
    }
    window.addEventListener('message', receive);
    return () => window.removeEventListener('message', receive);
  }, [example]);

  useEffect(() => {
    if (status !== 'loading') return;
    const timeout = window.setTimeout(() => setStatus('error'), 45_000);
    return () => window.clearTimeout(timeout);
  }, [status, attempt]);

  useEffect(() => {
    setStatus((current) => (current === 'waiting' ? current : 'loading'));
  }, [embedURL]);

  const iframe = useStatelyVizIframe(frameHost, {
    src: embedURL,
    title: `${name} read-only statechart`,
    colorScheme,
    load: status !== 'waiting',
    visible: status === 'ready',
    reloadKey: attempt,
    onError: handleFrameError,
  });

  return (
    <div
      ref={container}
      data-statechart-embed={status}
      className="relative flex h-[min(640px,60svh)] flex-col overflow-hidden rounded-lg border bg-fd-card"
    >
      <StatechartImage
        example={example}
        alt={alt}
        fill
        className={status === 'ready' ? 'hidden' : 'min-h-0 w-full flex-1'}
      />
      <div
        ref={frameHost}
        aria-hidden={status !== 'ready'}
        inert={status !== 'ready'}
        className={`absolute inset-0 h-full w-full ${status === 'ready' ? '' : 'pointer-events-none opacity-0'}`}
      />
      {(status === 'loading' || status === 'error') && (
        <div
          role="status"
          className="shrink-0 bg-fd-card/95 p-3 text-center text-sm text-fd-muted-foreground"
        >
          {status === 'loading' ? (
            'Loading interactive example…'
          ) : (
            <>
              The editor could not load. The diagram is still available.{' '}
              <button
                type="button"
                className="cursor-pointer underline"
                onClick={() => {
                  setAttempt((value) => value + 1);
                  setStatus('loading');
                }}
              >
                Retry loading
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function OnDemandStatechartFrame({
  embedURL,
  colorMode,
  name,
}: {
  embedURL: string;
  colorMode: StatechartColorMode;
  name: string;
}) {
  const frameHost = useRef<HTMLDivElement>(null);
  const colorScheme = colorMode === 'system' ? 'light dark' : colorMode;
  useStatelyVizIframe(frameHost, {
    src: embedURL,
    title: `${name} read-only statechart`,
    colorScheme,
    load: true,
    visible: true,
  });

  return (
    <div
      ref={frameHost}
      className="w-full"
      style={{ height: 'min(640px, 60svh)' }}
    />
  );
}

export function StatechartExample({
  name,
  example,
  alt,
  caption,
  display = 'on-demand',
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const { resolvedTheme } = useTheme();
  const hydrated = useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false,
  );
  const colorMode =
    hydrated && (resolvedTheme === 'light' || resolvedTheme === 'dark')
      ? resolvedTheme
      : 'system';
  const embedURL = statechartExampleURL(example, colorMode);
  const entry = statechartExamples[example];

  return (
    <div className="my-6">
      <figure>
        {display === 'inline' ? (
          <InlineStatechart
            key={example}
            example={example}
            name={name}
            alt={alt}
            embedURL={embedURL}
            colorMode={colorMode}
          />
        ) : (
          <StatechartImage
            example={example}
            alt={alt}
            className="mx-auto w-fit max-w-full rounded-lg bg-fd-card"
          />
        )}
        <figcaption className="mt-2 text-sm text-fd-muted-foreground">
          {caption}
        </figcaption>
      </figure>
      {'sourceFile' in entry && (
        <div data-statechart-handoff={example} className="mt-3 text-sm">
          <p>
            <a
              href={statechartExampleEditURL(example)}
              target="_blank"
              rel="noopener noreferrer"
              className="plausible-event-name=Editor+CTA"
            >
              Edit {name}
            </a>{' '}
            or{' '}
            <a href={entry.sourceFile} download>
              download the XState JSON
            </a>
            .
          </p>
          <p className="text-fd-muted-foreground">
            Sign in to edit this example. Changes in this view are not saved to
            your workspace. Export your edited machine to keep a copy, or{' '}
            <Link href="/docs/import-from-code#import-an-example-in-the-stately-editor">
              import the downloaded JSON
            </Link>{' '}
            into a project to save it there.
          </p>
        </div>
      )}
      {display === 'inline' ? (
        <p className="mt-2 text-sm">
          <a href={embedURL} target="_blank" rel="noopener noreferrer">
            Open {name} in Stately
          </a>
        </p>
      ) : (
        <details
          className="mt-3 rounded-lg border p-3"
          onToggle={(event) => setExpanded(event.currentTarget.open)}
        >
          <summary className="cursor-pointer">
            Explore {name} in Stately
          </summary>
          <p className="text-sm">
            Simulate events, expand or collapse parent states, and pan or zoom
            this read-only example. The screenshot stays available if the editor
            cannot load.{' '}
            <a href={embedURL} target="_blank" rel="noopener noreferrer">
              Open the example in a new tab
            </a>
            .
          </p>
          {expanded && (
            <OnDemandStatechartFrame
              embedURL={embedURL}
              colorMode={colorMode}
              name={name}
            />
          )}
        </details>
      )}
    </div>
  );
}
