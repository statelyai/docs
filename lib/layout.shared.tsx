import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';

import {
  BookOpenIcon,
  CircuitBoardIcon,
  NewspaperIcon,
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
        icon: (
          <svg
            width="18"
            height="18"
            viewBox="0 0 400 400"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M160.048396,62 L200.37018,102.226265 L313.959955,215.546521 L313.959955,215.570808 C315.837975,217.466064 317,220.069114 317,222.944958 C317,226.157786 315.548447,229.029294 313.267435,230.954041 L313.267435,230.954041 L208.213956,335.758657 C203.882338,340.080448 196.858891,340.080448 192.527273,335.758657 L192.527273,335.758657 L87.2490397,230.730253 C82.9169868,226.408463 82.9169868,219.401654 87.2490397,215.080297 L87.2490397,215.080297 L152.153757,150.3289 L159.394132,157.552991 C169.631514,167.11948 186.170262,195.360094 164.012235,218.951043 C161.846426,221.111288 161.846426,224.615126 164.012235,226.775804 L164.012235,226.775804 L196.490243,259.176874 C198.656487,261.337552 202.167775,261.337552 204.334019,259.176874 L204.334019,259.176874 L236.707692,226.879891 C237.766686,225.869377 238.504418,224.471572 238.504418,222.894216 C238.504418,221.359796 237.836243,219.971098 236.827242,218.965788 L236.827242,218.965788 L209.069933,191.274668 L209.153401,191.191832 L160.173597,142.328058 C137.904715,120.111929 137.779514,84.2165628 160.048396,62 L160.048396,62 Z M244.500217,62 C260.239954,62 273,74.7595142 273,90.5 C273,106.240051 260.239954,119 244.500217,119 C228.760046,119 216,106.240051 216,90.5 C216,74.7595142 228.760046,62 244.500217,62 Z"
              fill="currentColor"
            />
          </svg>
        ),
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
        icon: <NewspaperIcon size={18} />,
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
