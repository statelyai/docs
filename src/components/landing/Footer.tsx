import Link from '@docusaurus/Link';

export function Footer() {
  return (
    <div className="bg-blue-950 pb-24 pt-72">
      <section className="container grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl pb-16 mx-auto">
        <Newsletter />
        <DiscordCommunity />
      </section>
      <footer className="container border-t border-t-white/10">
        <AllLinks />
      </footer>
    </div>
  );
}

function AllLinks() {
  return (
    <nav className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 justify-center pt-8 pb-16 max-w-5xl m-auto">
      <div className="mt-8">
        <a href="/">
          <img
            className="h-6 w-auto"
            src="/assets/landing/stately-logo.svg"
            alt="Stately"
            height="24"
            width="86"
          />
        </a>
        <p className="text-white/60 mt-5 text-base">
          &copy; {new Date().getFullYear()} Stately
        </p>
      </div>
      <LinkList title="Product">
        <LinkItem href="#design">Features</LinkItem>
        <LinkItem href="/docs/">Documentation</LinkItem>
        <LinkItem href="https://github.com/statelyai/xstate">XState</LinkItem>
        <LinkItem href="/agent/">Stately Agent</LinkItem>
        <LinkItem href="https://stately.ai/blog/tags/case-study">
          Case studies
        </LinkItem>
        <LinkItem href="/pricing/">Pricing</LinkItem>
      </LinkList>
      <LinkList title="Company">
        <LinkItem href="/blog/tags/changelog">Changelog</LinkItem>
        <LinkItem href="/blog/">Blog</LinkItem>
        <LinkItem href="mailto:support@stately.ai">Contact</LinkItem>
      </LinkList>
      <LinkList title="Resources">
        <LinkItem href="/privacy/">Privacy policy</LinkItem>
        <LinkItem href="/code-of-conduct/">Code of conduct</LinkItem>
      </LinkList>

      <LinkList title="Community">
        <LinkItem href="https://discord.gg/xstate">Discord</LinkItem>
        <LinkItem href="https://twitter.com/statelyai">Twitter</LinkItem>
        <LinkItem href="https://youtube.com/c/statelyai">YouTube</LinkItem>
        <LinkItem href="https://www.linkedin.com/company/statelyai">
          LinkedIn
        </LinkItem>
      </LinkList>
    </nav>
  );
}

function LinkList({ children, title }) {
  return (
    <div className="mt-8">
      <h4 className="text-base font-bold text-white/60 mb-4 mt-0">{title}</h4>
      <ul className="text-white/90 font-medium text-base list-none m-0 p-0 space-y-2">
        {children}
      </ul>
    </div>
  );
}

function LinkItem({ href, children }) {
  return (
    <li>
      <a
        href={href}
        className="no-underline hover:no-underline text-white/80 hover:text-white transition-colors"
      >
        {children}
      </a>
    </li>
  );
}

function Newsletter() {
  return (
    <aside>
      <h3 className="text-2xl font-black text-white/90 mb-4">
        Get updates by email
      </h3>
      <form
        action="registry/api/newsletter/signup"
        method="post"
        target="popupwindow"
        className="embeddable-buttondown-form state"
        data-active
      >
        <label
          htmlFor="bd-email"
          className="text-base text-white/60 font-semibold"
        >
          Subscribe to our newsletter
        </label>
        <div className="fields pt-2">
          <input
            type="email"
            name="email"
            id="bd-email"
            required
            placeholder="your@email.com"
            className="text-gray-900 bg-white/90 rounded-md px-3 py-2 text-base font-medium"
          />
          <input type="hidden" value="1" name="embed" />
          <input
            type="submit"
            className="text-blue-900 ml-2 bg-blue-300 rounded-md px-3 py-2 text-base font-medium cursor-pointer hover:bg-blue-200 shadow-sm"
            value="Subscribe"
          />
        </div>
      </form>
    </aside>
  );
}

function DiscordCommunity() {
  return (
    <aside>
      <h3 className="text-2xl font-black text-white/90 mb-4">
        Be part of a friendly and helpful community
      </h3>
      <p className="text-white/60 font-medium">
        <a
          href="https://discord.gg/xstate"
          className="text-blue-300 hover:text-white font-bold no-underline hover:no-underline"
        >
          Join our Discord
        </a>{' '}
        to give us feedback and get support. And participate in our{' '}
        <a
          href="https://www.youtube.com/@Statelyai/streams"
          className="text-blue-300 hover:text-white font-bold no-underline hover:no-underline"
        >
          Office Hours
        </a>{' '}
        for previews and announcements with the Stately team.
      </p>
    </aside>
  );
}
