export function Footer() {
  return (
    <div className="bg-blue-950 pb-24 pt-24">
      <section className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl pb-16 px-6">
        {/* Newsletter */}
        <aside>
          <h3 className="text-2xl font-black text-white/90 mb-4">
            Get updates by email
          </h3>
          <form
            action="https://stately.ai/registry/api/newsletter/signup"
            method="post"
            target="_blank"
          >
            <label
              htmlFor="bd-email"
              className="text-base text-white/60 font-semibold"
            >
              Subscribe to our newsletter
            </label>
            <div className="flex gap-2 pt-2">
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
                className="text-blue-900 bg-blue-300 rounded-md px-3 py-2 text-base font-medium cursor-pointer hover:bg-blue-200"
                value="Subscribe"
              />
            </div>
          </form>
        </aside>

        {/* Discord */}
        <aside>
          <h3 className="text-2xl font-black text-white/90 mb-4">
            Be part of a friendly and helpful community
          </h3>
          <p className="text-white/60 font-medium">
            <a
              href="https://discord.gg/xstate"
              className="text-blue-300 hover:text-white font-bold"
            >
              Join our Discord
            </a>{' '}
            to give us feedback and get support. And participate in our{' '}
            <a
              href="https://www.youtube.com/@Statelyai/streams"
              className="text-blue-300 hover:text-white font-bold"
            >
              Office Hours
            </a>{' '}
            for previews and announcements with the Stately team.
          </p>
        </aside>
      </section>

      <footer className="container mx-auto border-t border-t-white/10 px-6">
        <nav className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 justify-center pt-8 pb-16 max-w-5xl mx-auto gap-8">
          <div>
            <a href="https://stately.ai">
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

          <div>
            <h4 className="text-base font-bold text-white/60 mb-4">Product</h4>
            <ul className="text-white/90 font-medium text-base space-y-2">
              <li>
                <a href="/docs" className="text-white/80 hover:text-white">
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/statelyai/xstate"
                  className="text-white/80 hover:text-white"
                >
                  XState
                </a>
              </li>
              <li>
                <a href="/pricing" className="text-white/80 hover:text-white">
                  Pricing
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-base font-bold text-white/60 mb-4">Company</h4>
            <ul className="text-white/90 font-medium text-base space-y-2">
              <li>
                <a href="/blog" className="text-white/80 hover:text-white">
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="mailto:support@stately.ai"
                  className="text-white/80 hover:text-white"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-base font-bold text-white/60 mb-4">
              Resources
            </h4>
            <ul className="text-white/90 font-medium text-base space-y-2">
              <li>
                <a
                  href="https://stately.ai/privacy"
                  className="text-white/80 hover:text-white"
                >
                  Privacy policy
                </a>
              </li>
              <li>
                <a
                  href="https://stately.ai/code-of-conduct"
                  className="text-white/80 hover:text-white"
                >
                  Code of conduct
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-base font-bold text-white/60 mb-4">
              Community
            </h4>
            <ul className="text-white/90 font-medium text-base space-y-2">
              <li>
                <a
                  href="https://discord.gg/xstate"
                  className="text-white/80 hover:text-white"
                >
                  Discord
                </a>
              </li>
              <li>
                <a
                  href="https://twitter.com/statelyai"
                  className="text-white/80 hover:text-white"
                >
                  Twitter
                </a>
              </li>
              <li>
                <a
                  href="https://youtube.com/c/statelyai"
                  className="text-white/80 hover:text-white"
                >
                  YouTube
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/company/statelyai"
                  className="text-white/80 hover:text-white"
                >
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </footer>
    </div>
  );
}
