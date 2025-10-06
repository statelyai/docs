import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';

import Logo from '@/content/docs/assets/logo-white-nobg.svg';

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
      title: (
        <>
          <img src={Logo.src} alt="Stately" className="h-8 w-auto" />
        </>
      ),
    },
    // see https://fumadocs.dev/docs/ui/navigation/links
    links: [],
  };
}
