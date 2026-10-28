'use client';
// Site header for the (home) group: logo, links, theme toggle, account buttons.
// Tokens come from the landing stylesheet (`.sp`), so it follows the theme.
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Menu, Moon, Sun, X } from 'lucide-react';
import { ThemedLogo } from '@/lib/ThemedLogo';

const links: { text: string; href: string; external?: boolean }[] = [
  { text: 'Docs', href: '/docs' },
  { text: 'Pricing', href: '/pricing' },
  { text: 'Blog', href: '/blog' },
  { text: 'GitHub', href: 'https://github.com/statelyai/xstate', external: true },
];

const linkCls =
  'text-[14px] font-medium text-[var(--sp-muted)] hover:text-[var(--sp-fg)] aria-[current=page]:text-[var(--sp-fg)] transition-colors';
const iconBtnCls =
  'grid size-8 place-items-center rounded-[var(--sp-radius)] border border-[var(--sp-border-strong)] text-[var(--sp-fg)] hover:border-[var(--sp-ring)] transition-colors';

function NavLink({ text, href, external, className = '' }: (typeof links)[number] & { className?: string }) {
  const pathname = usePathname();
  const current = !external && (pathname === href || pathname.startsWith(`${href}/`));
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={`${linkCls} ${className}`}>
      {text}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  ) : (
    <Link href={href} aria-current={current ? 'page' : undefined} className={`${linkCls} ${className}`}>
      {text}
    </Link>
  );
}

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const dark = mounted && resolvedTheme === 'dark';
  return (
    <button
      type="button"
      onClick={() => setTheme(dark ? 'light' : 'dark')}
      aria-label={mounted ? `Switch to ${dark ? 'light' : 'dark'} theme` : 'Toggle theme'}
      className={iconBtnCls}
    >
      {dark ? <Sun size={16} aria-hidden /> : <Moon size={16} aria-hidden />}
    </button>
  );
}

function AccountButtons({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <a href="/registry/login" className="sp-btn sp-btn-outline !min-h-9 !px-3.5">
        Log in
      </a>
      <a href="/registry/signup" className="sp-btn sp-btn-primary !min-h-9 !px-3.5">
        Sign up
      </a>
    </div>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className="sp sticky top-0 z-40 border-b border-[var(--sp-border)] bg-[var(--sp-bg)]">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-8 px-6 sm:px-10">
        <Link href="/" aria-label="Stately home" className="shrink-0 [&_img]:h-6">
          <ThemedLogo />
        </Link>
        <nav aria-label="Main" className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <NavLink key={l.href} {...l} />
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <AccountButtons className="hidden md:flex" />
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="site-menu"
            className="md:hidden sp-btn sp-btn-outline !min-h-8 !px-3 !gap-1.5"
          >
            {open ? <X size={16} aria-hidden /> : <Menu size={16} aria-hidden />}
            Menu
          </button>
        </div>
      </div>
      <div
        id="site-menu"
        hidden={!open}
        className="md:hidden border-t border-[var(--sp-border)] bg-[var(--sp-bg)] px-6 pb-6 pt-2"
      >
        <nav aria-label="Main" className="flex flex-col">
          {links.map((l) => (
            <NavLink key={l.href} {...l} className="py-3 border-b border-[var(--sp-border)] !text-[16px]" />
          ))}
        </nav>
        <AccountButtons className="mt-5 [&>a]:flex-1" />
      </div>
    </header>
  );
}
