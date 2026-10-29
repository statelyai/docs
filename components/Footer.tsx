// Site footer in the landing token language; follows the site theme.
// Carries its own `.sp` scope so it renders the same outside the landing page.
import { ThemedLogo } from '@/lib/ThemedLogo';

type FooterLink = { text: string; href: string };

const columns: { title: string; links: FooterLink[] }[] = [
  {
    title: 'Product',
    links: [
      { text: 'Editor', href: 'https://editor.stately.ai/' },
      { text: 'Documentation', href: '/docs' },
      { text: 'XState', href: 'https://github.com/statelyai/xstate' },
      { text: 'Pricing', href: '/pricing' },
    ],
  },
  {
    title: 'Company',
    links: [
      { text: 'Blog', href: '/blog' },
      { text: 'Contact', href: 'mailto:support@stately.ai' },
      { text: 'Book a demo', href: 'https://cal.com/statelyai/enterprise-calls' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { text: 'Inspector', href: '/docs/inspector' },
      { text: 'Self-hosting', href: '/docs/self-hosting' },
      { text: 'llms.txt', href: '/llms.txt' },
    ],
  },
  {
    title: 'Community',
    links: [
      { text: 'Discord', href: 'https://discord.gg/xstate' },
      { text: 'Office Hours', href: 'https://www.youtube.com/@Statelyai/streams' },
      { text: 'YouTube', href: 'https://youtube.com/c/statelyai' },
      { text: 'Twitter', href: 'https://twitter.com/statelyai' },
      { text: 'LinkedIn', href: 'https://www.linkedin.com/company/statelyai' },
    ],
  },
];

const legal: FooterLink[] = [
  { text: 'Privacy', href: '/privacy' },
  { text: 'Terms', href: '/terms' },
  { text: 'Code of conduct', href: '/code-of-conduct' },
];

const linkCls = 'text-[var(--sp-muted)] hover:text-[var(--sp-fg)] transition-colors';

export function Footer() {
  return (
    <footer className="sp border-t border-[var(--sp-border)] bg-[var(--sp-bg)] text-[14px]">
      <div className="mx-auto max-w-6xl px-6 sm:px-10 pt-16 pb-10">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-[minmax(0,2fr)_repeat(4,minmax(0,1fr))] gap-x-8 gap-y-10">
          <div className="col-span-2 md:col-span-4 lg:col-span-1 max-w-[22rem]">
            <a href="/" aria-label="Stately home" className="inline-block [&_img]:h-6">
              <ThemedLogo />
            </a>
            <p className="mt-4 text-[var(--sp-muted)]">Stately maps how software behaves.</p>
            <form action="/registry/api/newsletter/signup" method="post" target="_blank" className="mt-6">
              <label htmlFor="footer-email" className="block font-medium text-[var(--sp-fg)]">
                Get updates by email
              </label>
              <div className="mt-2 flex gap-2">
                <input
                  type="email"
                  name="email"
                  id="footer-email"
                  required
                  autoComplete="email"
                  placeholder="you@company.com"
                  className="min-w-0 flex-1 h-9 rounded-[var(--sp-radius)] border border-[var(--sp-border-strong)] bg-transparent px-3 text-[var(--sp-fg)] placeholder:text-[var(--sp-muted-2)] focus:outline-none focus-visible:border-[var(--sp-ring)] focus-visible:ring-2 focus-visible:ring-[var(--sp-primary)]/30"
                />
                <input type="hidden" value="1" name="embed" />
                <button type="submit" className="sp-btn sp-btn-primary !min-h-9 !px-3.5 cursor-pointer">
                  Subscribe
                </button>
              </div>
            </form>
          </div>
          {columns.map((c) => (
            <nav key={c.title} aria-label={c.title}>
              <h2 className="font-medium text-[var(--sp-fg)]">{c.title}</h2>
              <ul className="mt-3 space-y-2">
                {c.links.map((l) => (
                  <li key={l.text}>
                    <a href={l.href} className={linkCls}>
                      {l.text}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="mt-14 pt-6 border-t border-[var(--sp-border)] flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px]">
          <span className="text-[var(--sp-muted)]">&copy; {new Date().getFullYear()} Stately</span>
          {legal.map((l) => (
            <a key={l.text} href={l.href} className={linkCls}>
              {l.text}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
