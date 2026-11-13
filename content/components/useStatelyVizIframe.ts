'use client';

import { createStatelyInteractionGate } from '@statelyai/sdk/embed';
import { useEffect, useRef, type RefObject } from 'react';

type Options = {
  src: string | null;
  title: string;
  colorScheme: string;
  load: boolean;
  visible: boolean;
  reloadKey?: number;
  onError?: () => void;
};

export function useStatelyVizIframe(
  container: RefObject<HTMLDivElement | null>,
  { src, title, colorScheme, load, visible, reloadKey, onError }: Options,
) {
  const iframe = useRef<HTMLIFrameElement | null>(null);
  const visibleRef = useRef(visible);

  useEffect(() => {
    if (!load || !src || !container.current) return;
    const frame = document.createElement('iframe');
    frame.src = src;
    frame.title = title;
    frame.loading = 'lazy';
    frame.allowFullscreen = true;
    frame.style.width = '100%';
    frame.style.height = '100%';
    frame.style.display = 'block';
    frame.style.border = '0';
    frame.style.colorScheme = colorScheme;
    frame.setAttribute('aria-hidden', String(!visibleRef.current));
    if (onError) frame.addEventListener('error', onError);
    container.current.appendChild(frame);
    iframe.current = frame;

    const gate = createStatelyInteractionGate(frame);
    gate.setColorScheme(colorScheme);
    return () => {
      gate.destroy();
      frame.remove();
      iframe.current = null;
    };
  }, [container, src, title, colorScheme, load, reloadKey, onError]);

  useEffect(() => {
    visibleRef.current = visible;
    iframe.current?.setAttribute('aria-hidden', String(!visible));
  }, [visible]);

  return iframe;
}
