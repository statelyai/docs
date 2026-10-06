import { baseOptions } from '@/lib/layout.shared';
import type { ReactNode } from 'react';
import { HomeLayout } from 'fumadocs-ui/layouts/home';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <HomeLayout
      {...baseOptions()}
      searchToggle={{
        enabled: false,
      }}
      links={[
        {
          text: 'Pricing',
          url: '/pricing',
          external: true,
        },
        {
          text: 'Blog',
          url: '/blog',
          active: 'nested-url',
        },
        {
          text: 'Docs',
          url: '/docs',
          active: 'nested-url',
        },
        {
          type: 'button',
          text: 'Log in',
          url: '/registry/login',
          secondary: true,
        },
        {
          type: 'button',
          text: 'Sign up',
          url: '/registry/signup',
        },
      ]}
    >
      {children}
    </HomeLayout>
  );
}
