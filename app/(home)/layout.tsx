import './_landing/landing.css';
import type { ReactNode } from 'react';
import { SiteHeader } from '@/components/SiteHeader';

// Theme (next-themes) comes from RootProvider in app/layout.tsx.
export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteHeader />
      {children}
    </>
  );
}
