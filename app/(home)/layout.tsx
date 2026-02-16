import { baseOptions } from '@/lib/layout.shared';
import type { ReactNode } from 'react';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { TelescopeIcon } from 'lucide-react';
import Link from 'next/link';

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
          type: 'custom',
          children: (
            <div className="flex items-center gap-2 ml-4">
              <Link
                href="/registry/login"
                className="text-sm text-fd-foreground hover:text-fd-accent-foreground transition-colors border border-fd-border rounded-md px-4 py-2"
              >
                Log in
              </Link>
              <Link
                href="/registry/signup"
                className="text-sm px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
              >
                Sign up
              </Link>
            </div>
          ),
        },
      ]}
    >
      {children}
    </HomeLayout>
  );
}
