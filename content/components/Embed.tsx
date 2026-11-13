'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useTheme } from 'next-themes';
import { useStatelyVizIframe } from './useStatelyVizIframe';

type Embed = {
  name?: string;
  title?: string;
  machine: unknown;
  mode?: string;
};

export function Embed({ name = 'State', title, machine, mode }: Embed) {
  const [mounted, setMounted] = useState(false);
  const [status, setStatus] = useState<
    'waiting' | 'loading' | 'ready' | 'error'
  >('waiting');
  const [attempt, setAttempt] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const frameHost = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === 'dark' ? 'dark' : 'light';
  const src = inlineEmbedURL(machine, theme, mode);
  const label = title ?? `${name} machine`;
  const handleFrameError = useCallback(() => setStatus('error'), []);

  useEffect(() => setMounted(true), []);

  // Load once the embed nears the viewport, so the timeout only runs while loading.
  useEffect(() => {
    if (status !== 'waiting' || !containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setStatus('loading');
      },
      { rootMargin: '200px' },
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [status]);

  // Viz posts `@statelyai.loaded` after layout. A blocked frame (Viz only allows
  // https://stately.ai as a frame ancestor) never does, so it times out.
  useEffect(() => {
    function receive(event: MessageEvent) {
      if (
        event.origin !== 'https://editor.stately.ai' ||
        event.source !== iframeRef.current?.contentWindow
      )
        return;
      const type = (event.data as { type?: unknown } | null)?.type;
      if (type === '@statelyai.loaded') setStatus('ready');
      else if (type === '@statelyai.error')
        setStatus((current) => (current === 'ready' ? current : 'error'));
    }
    window.addEventListener('message', receive);
    return () => window.removeEventListener('message', receive);
  }, []);

  useEffect(() => {
    if (status !== 'loading') return;
    const timeout = window.setTimeout(() => setStatus('error'), 20_000);
    return () => window.clearTimeout(timeout);
  }, [status, attempt]);

  // Viz reads `theme` only on load, so a theme switch remounts the iframe.
  useEffect(() => {
    setStatus((current) => (current === 'ready' ? 'loading' : current));
  }, [theme]);
  const iframeRef = useStatelyVizIframe(frameHost, {
    src,
    title: label,
    colorScheme: theme,
    load: mounted && status !== 'waiting',
    visible: status === 'ready',
    reloadKey: attempt,
    onError: handleFrameError,
  });
  return (
    <div
      ref={containerRef}
      data-embed={status}
      className="relative my-4 aspect-video overflow-hidden rounded-lg border bg-fd-card"
    >
      <div
        ref={frameHost}
        aria-hidden={status !== 'ready'}
        inert={status !== 'ready'}
        className={`absolute inset-0 h-full w-full ${status === 'ready' ? '' : 'pointer-events-none opacity-0'}`}
      />
      {status !== 'ready' && (
        <div
          role="status"
          className="absolute inset-0 flex items-center justify-center p-4 text-center text-sm text-fd-muted-foreground"
        >
          {!src ? (
            'Machine preview unavailable'
          ) : status === 'error' ? (
            <span>
              The editor could not load here.{' '}
              <a href={src} target="_blank" rel="noopener noreferrer">
                Open {label} in Stately
              </a>{' '}
              or{' '}
              <button
                type="button"
                className="cursor-pointer underline"
                onClick={() => {
                  setAttempt((value) => value + 1);
                  setStatus('loading');
                }}
              >
                retry
              </button>
              .
            </span>
          ) : (
            'Loading machine preview…'
          )}
        </div>
      )}
    </div>
  );
}

export function inlineEmbedURL(
  machine: unknown,
  theme: 'light' | 'dark',
  mode?: string,
): string | null {
  if (!machine || typeof machine !== 'object' || Array.isArray(machine))
    return null;
  const wrapper = machine as Record<string, unknown>;
  const definition = wrapper.definition ?? wrapper;
  const format =
    wrapper.format ??
    (wrapper.rootNode ? 'digraph' : wrapper.nodes ? 'xgraph' : undefined);
  if (
    format !== 'digraph' &&
    format !== 'xgraph' &&
    format !== 'xstate' &&
    format !== 'xstate-json'
  )
    return null;
  const source =
    typeof definition === 'string' ? definition : JSON.stringify(definition);
  const bytes = new TextEncoder().encode(source);
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  const encoded = btoa(binary)
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replace(/=+$/, '');
  const params = new URLSearchParams({ machine: encoded, format, theme });
  if (mode) params.set('mode', mode);
  return `https://editor.stately.ai/viz#${params.toString()}`;
}
