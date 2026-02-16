import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';

import {
  BookOpenIcon,
  CircuitBoardIcon,
  PanelsTopLeftIcon,
  TelescopeIcon,
} from 'lucide-react';

import { ThemedLogo } from './ThemedLogo';

/**
 * Shared layout configurations
 *
 * you can customise layouts individually from:
 * Home Layout: app/(home)/layout.tsx
 * Docs Layout: app/docs/layout.tsx
 */
export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: <ThemedLogo />,
    },
    // see https://fumadocs.dev/docs/ui/navigation/links
    links: [
      {
        text: 'Docs',
        url: '/docs',
        active: 'nested-url',
      },
      {
        text: 'API',
        url: 'https://www.jsdocs.io/package/xstate',
        external: true,
        icon: <BookOpenIcon size={18} />,
      },
      {
        text: 'Studio',
        url: '/registry/projects',
        external: true,
        icon: <CircuitBoardIcon size={18} />,
      },
      {
        text: 'Editor',
        url: '/editor',
        external: true,
        icon: <PanelsTopLeftIcon size={18} />,
      },
      {
        text: 'Discover',
        url: '/registry/discover',
        external: true,
        icon: <TelescopeIcon size={18} />,
      },
      {
        text: 'Blog',
        url: '/blog',
        active: 'nested-url',
      },
      {
        type: 'icon',
        text: 'Visit XState GitHub repository',
        icon: (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 22V18C15.1392 16.7473 14.78 15.4901 14 14.5C17 14.5 20 12.5 20 9C20.08 7.75 19.73 6.52 19 5.5C19.28 4.35 19.28 3.15 19 2C19 2 18 2 16 3.5C13.36 3 10.64 3 8.00004 3.5C6.00004 2 5.00004 2 5.00004 2C4.70004 3.15 4.70004 4.35 5.00004 5.5C4.27191 6.51588 3.91851 7.75279 4.00004 9C4.00004 12.5 7.00004 14.5 10 14.5C9.61004 14.99 9.32004 15.55 9.15004 16.15C8.98004 16.75 8.93004 17.38 9.00004 18V22"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M9 18C4.49 20 4 16 2 16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ),
        url: 'https://github.com/statelyai/xstate',
        external: true,
      },
    ],
  };
}
