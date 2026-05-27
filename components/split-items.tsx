'use client';

import {
  Children,
  isValidElement,
  useCallback,
  useRef,
  useState,
  type PointerEvent,
  type ReactElement,
  type ReactNode,
} from 'react';
import { cn } from '@/lib/cn';
import { buttonVariants } from '@/components/ui/button';

export interface SplitItemProps {
  value: string;
  label: string;
  children: ReactNode;
}

export interface SplitItemsProps {
  children: ReactNode;
  className?: string;
}

const MIN_SIZE = 25;
const MAX_SIZE = 75;

function clamp(value: number) {
  return Math.min(MAX_SIZE, Math.max(MIN_SIZE, value));
}

export function SplitItem(_props: SplitItemProps) {
  return null;
}

export function SplitItems({ children, className }: SplitItemsProps) {
  const items = Children.toArray(children).filter(
    (child): child is ReactElement<SplitItemProps> =>
      isValidElement(child) &&
      typeof child.props === 'object' &&
      child.props !== null &&
      'value' in child.props &&
      'label' in child.props &&
      'children' in child.props,
  );

  if (items.length !== 2) {
    throw new Error('SplitItems expects exactly two SplitItem children.');
  }

  const [visible, setVisible] = useState<[boolean, boolean]>([true, true]);
  const [leftSize, setLeftSize] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const bothVisible = visible[0] && visible[1];

  const toggle = (index: 0 | 1) => {
    setVisible((current) => {
      if (current[index] && !current[index === 0 ? 1 : 0]) {
        return current;
      }

      const next: [boolean, boolean] = [...current] as [boolean, boolean];
      next[index] = !next[index];
      return next;
    });
  };

  const updateSize = useCallback((clientX: number) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const next = ((clientX - rect.left) / rect.width) * 100;
    setLeftSize(clamp(next));
  }, []);

  const onHandlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    updateSize(event.clientX);
  };

  return (
    <div
      className={cn(
        'my-6 overflow-hidden rounded-lg border bg-fd-card text-fd-card-foreground',
        className,
      )}
    >
      <div className="not-prose flex items-center justify-between gap-3 border-b bg-fd-muted/40 px-3 py-2">
        <div className="flex min-w-0 items-center gap-1.5">
          {items.map((item, index) => (
            <button
              key={item.props.value}
              type="button"
              aria-pressed={visible[index]}
              className={cn(
                buttonVariants({
                  size: 'sm',
                  color: visible[index] ? 'secondary' : 'ghost',
                }),
                'h-7 rounded-md',
              )}
              onClick={() => toggle(index as 0 | 1)}
            >
              {item.props.label}
            </button>
          ))}
        </div>
      </div>

      <div
        ref={containerRef}
        className={cn(
          'grid min-h-0',
          bothVisible
            ? 'grid-cols-[minmax(0,1fr)_2px_minmax(0,1fr)]'
            : 'grid-cols-1',
        )}
        style={
          bothVisible
            ? {
                gridTemplateColumns: `${leftSize}% 2px minmax(0, 1fr)`,
              }
            : undefined
        }
      >
        {visible[0] ? <SplitPane item={items[0]} /> : null}

        {bothVisible ? (
          <div
            role="separator"
            aria-orientation="vertical"
            aria-valuemin={MIN_SIZE}
            aria-valuemax={MAX_SIZE}
            aria-valuenow={Math.round(leftSize)}
            tabIndex={0}
            className="not-prose cursor-col-resize bg-fd-border/70 outline-none transition-colors hover:bg-fd-muted-foreground/40 focus-visible:bg-fd-primary focus-visible:ring-2 focus-visible:ring-fd-ring"
            onPointerDown={onHandlePointerDown}
            onPointerMove={(event) => {
              if (event.buttons === 1) {
                updateSize(event.clientX);
              }
            }}
            onKeyDown={(event) => {
              if (event.key === 'ArrowLeft') {
                event.preventDefault();
                setLeftSize((value) => clamp(value - 5));
              } else if (event.key === 'ArrowRight') {
                event.preventDefault();
                setLeftSize((value) => clamp(value + 5));
              }
            }}
          />
        ) : null}

        {visible[1] ? <SplitPane item={items[1]} /> : null}
      </div>
    </div>
  );
}

function SplitPane({ item }: { item: ReactElement<SplitItemProps> }) {
  return (
    <div className="min-w-0 overflow-hidden [&_figure]:mx-0 [&_figure]:my-0 [&_figure]:w-full [&_figure]:rounded-none [&_figure]:border-x-0 [&_pre]:rounded-none">
      <div className="min-w-0 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
        {item.props.children}
      </div>
    </div>
  );
}
