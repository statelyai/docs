import type { Metadata } from 'next';
import { Footer } from '@/components/Footer';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Privacy',
  description:
    'The Stately privacy policy outlines how we collect, use, and protect your personal data when you use our platform.',
  path: '/privacy',
});

export default function PrivacyPage() {
  return (
    <>
      <main className="min-h-screen py-24">
        <div className="container mx-auto max-w-4xl px-6 prose prose-invert prose-fd">
          <h1>Privacy policy</h1>

          <p>Last updated November 2026:</p>
          <ul>
            <li>
              Added the{' '}
              <a href="#editor-mcp-skills">
                Stately editor, MCP server, and agent skills
              </a>{' '}
              section
            </li>
            <li>
              Updated <a href="#analytics">analytics</a> with opt-out and
              regional rules
            </li>
            <li>
              Updated <a href="#stately-ai">Stately AI</a>
            </li>
            <li>
              Added <a href="#account-deletion">account deletion</a>,{' '}
              <a href="#subprocessors">subprocessors</a>, and{' '}
              <a href="#your-rights">your rights</a>
            </li>
          </ul>
          <p>April 2026:</p>
          <ul>
            <li>
              Added information about{' '}
              <a href="#data-ownership">data ownership</a>
            </li>
            <li>
              Added information about <a href="#inspector">Stately Inspector</a>
            </li>
          </ul>

          <h2 id="data-ownership">Data ownership</h2>
          <p>
            You retain full ownership of any content you create or upload to
            Stately, including state machines, projects, and any proprietary
            business logic they contain. We do not claim ownership of your
            content.
          </p>
          <p>
            We do not sell your content, and we do not use the contents of your
            machines to train machine learning or AI models. We only access your
            content to operate and improve the Stately platform (for example, to
            render your machines in the editor, sync with your connected
            services, or provide support when you request it).
          </p>
          <p>
            Private projects on paid plans, including the Team plan, are only
            visible to you and the teammates you explicitly share them with.
          </p>
          <p>
            If you need a Data Processing Agreement (DPA) or custom contractual
            terms for your organization, please contact{' '}
            <a href="mailto:support@stately.ai">support@stately.ai</a>.
          </p>

          <h2 id="analytics">Analytics</h2>
          <p>
            We use Plausible Analytics to collect aggregated statistics about
            your visits to Stately&apos;s websites. The statistics include
            information such as pageviews, visit duration, visitors&apos;
            countries and devices. The aggregated statistics have no way to
            identify individuals from that data, and no data about any specific
            individual.
          </p>
          <p>
            <a href="https://plausible.io/privacy-focused-web-analytics">
              Plausible&apos;s privacy information
            </a>
            .
          </p>
          <p>
            We use Vercel Web Analytics on the Stately editor. It does not use
            cookies and reports aggregated page views.
          </p>
          <p>
            We send usage events from Stately Studio, the Stately editor, and
            the Stately MCP server to Mixpanel. Events describe which features
            and tools you use, how long they take, and whether they fail. They
            are tied to a random identifier. In the Stately editor and the MCP
            server, events are also tied to your account when you are signed
            in. In Stately Studio, events are tied to a hashed user id only if
            you consent in the Studio settings. They do not include your machine contents, the inputs you
            pass to MCP tools, or your source code. We send events to Mixpanel
            without your IP address, so Mixpanel does not derive your location
            from it. We use this data to understand how our tools are used and
            how to improve them.
          </p>
          <p>
            You can turn off usage analytics with the Usage analytics setting in
            the editor. We also turn it off when your browser sends a Global
            Privacy Control or Do Not Track signal. MCP clients can turn it off
            for a request by sending the <code>Sec-GPC: 1</code>,{' '}
            <code>DNT: 1</code>, or <code>x-stately-telemetry-optout: 1</code>{' '}
            header. When you turn analytics off, the editor deletes the
            identifiers it stored in your browser.
          </p>
          <p>
            If you visit from the European Economic Area, the United Kingdom,
            or Switzerland, we keep analytics identifiers for the current
            browser session only and do not link events to your account or to
            earlier visits.
          </p>
          <p>
            <a href="https://mixpanel.com/legal/privacy-hub/">
              Mixpanel&apos;s privacy information
            </a>
            .
          </p>

          <h2 id="survey">Survey</h2>
          <p>
            We use Google Forms for our surveys. Your survey responses are
            stored with Google. We do not collect any information about you
            except what you provide in your responses, and you&apos;re not
            required to provide your email address unless you consent to further
            contact from us.
          </p>
          <p>
            We use the survey responses to help research and develop our
            products, and to potentially contact respondents for future
            research. We will not share any of the survey answers, or your email
            address, with any third-parties.
          </p>
          <p>
            If you would like us to delete your survey responses, please email{' '}
            <a href="mailto:jenny@stately.ai">jenny@stately.ai</a>.
          </p>
          <p>
            <a href="https://policies.google.com/privacy">
              Google&apos;s privacy policy
            </a>
            .
          </p>

          <h2 id="storage">Storage</h2>
          <p>
            We use Supabase as a database for our platform. We use the database
            to store your profile information required for login (email),
            optional profile information (name, profile picture) as well as any
            data you save on our platform. We also use Supabase to store any
            assets you add to your projects. We do not use Supabase to collect
            any further information about you.
          </p>
          <h3 id="account-deletion">Account deletion</h3>
          <p>
            You can delete your account from your profile settings. Your
            account is disabled right away, and you can restore it by signing
            in within 7 days. After 7 days, we permanently delete your account,
            your sign-in record, and the projects, machines, and assets you own.
            Projects you created in other people&apos;s teams, and machines you
            edited in other people&apos;s projects, stay with those projects
            and are credited to the project owner. If you own a team that has
            other members, remove them before you delete your account. If you
            have an active paid subscription, cancel it in Billing first. We delete data in our
            database backups within 30 days.
          </p>
          <p>
            Deleting your account does not delete usage events already sent to
            Mixpanel or your customer record in Stripe. To request deletion of
            that data, email{' '}
            <a href="mailto:support@stately.ai">support@stately.ai</a>.
          </p>
          <p>
            <a href="https://supabase.io/privacy">
              Supabase&apos;s privacy policy
            </a>
            .
          </p>

          <h2 id="authentication">Authentication</h2>
          <p>
            We use GitHub, Google, and Twitter for authentication so you can
            sign into our platform using their platforms. We do not use these
            providers to collect any information about you.
          </p>

          <h3 id="github-sync">GitHub Sync</h3>
          <p>
            We use{' '}
            <a href="https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/generating-a-user-access-token-for-a-github-app">
              GitHub tokens
            </a>{' '}
            to sync your GitHub repositories to your Stately projects when you
            connect a GitHub repo. We do not use GitHub to collect any
            information about you.
          </p>
          <p>
            <a href="https://docs.github.com/en/github/site-policy/github-privacy-statement#github-privacy-statement">
              GitHub&apos;s privacy statement
            </a>
            .
          </p>

          <h3 id="figma-sync">Figma Sync</h3>
          <p>
            We use{' '}
            <a href="https://help.figma.com/hc/en-us/articles/8085703771159-Manage-personal-access-tokens">
              Figma tokens
            </a>{' '}
            to sync your Figma frames when you embed Figma assets. We do not use
            Figma to collect any information about you.
          </p>
          <p>
            <a href="https://www.figma.com/legal/privacy/">
              Figma&apos;s privacy policy
            </a>
            .
          </p>

          <h2 id="hosting">Hosting</h2>
          <p>
            We use GitHub to host our repositories and GitHub Pages to host our
            legacy documentation. We do not use GitHub to collect any
            information about you.
          </p>
          <p>
            <a href="https://docs.github.com/en/github/site-policy/github-privacy-statement#github-privacy-statement">
              GitHub&apos;s privacy statement
            </a>
            .
          </p>
          <p>We use Vercel to host:</p>
          <ul>
            <li>
              <a href="https://stately.ai">stately.ai website</a>
            </li>
            <li>
              <a href="https://stately.ai/docs">our docs and blog</a>
            </li>
            <li>our platform and API</li>
          </ul>
          <p>
            Vercel collects activity logs which includes your user agent
            information to help us understand where we need to fix bugs. We do
            not use Vercel to collect any further information about you.
          </p>
          <p>
            <a href="https://vercel.com/legal/privacy-policy">
              Vercel&apos;s privacy policy
            </a>
            .
          </p>
          <p>
            We use Amazon Web Services to host a microservice that generates
            preview images of public machines. We do not use AWS to collect any
            information about you.
          </p>

          <h2 id="videos-and-livestreams">Videos and livestreams</h2>
          <p>
            We use YouTube to broadcast livestreams and host our videos. We do
            not use YouTube to collect any information about you.
          </p>
          <p>
            <a href="https://policies.google.com/privacy">
              Google&apos;s privacy policy
            </a>
            .
          </p>
          <p>
            We use StreamYard to record and broadcast livestreams. You will only
            have access to StreamYard if you join us as a guest in the
            StreamYard studio. We do not use StreamYard to collect any
            information about you.
          </p>
          <p>
            <a href="https://streamyard.com/resources/docs/privacy/index.html">
              StreamYard&apos;s privacy policy
            </a>
            .
          </p>

          <h2 id="chat">Chat</h2>
          <p>
            We use Discord as a chat server for discussions about XState and
            Stately. We do not use Discord to collect any information about you.
          </p>
          <p>
            <a href="https://discord.com/privacy">
              Discord&apos;s privacy policy
            </a>
            .
          </p>

          <h2 id="search">Search</h2>
          <p>We use Algolia search to:</p>
          <ul>
            <li>Index Stately Studio projects and machines</li>
            <li>
              Provide useful search results in Stately Studio based on your
              search keywords.
            </li>
            <li>Index our documentation content</li>
            <li>
              Provide useful search results in our documentation based on your
              search keywords.
            </li>
          </ul>
          <p>We do not use Algolia to collect any information about you.</p>
          <p>
            <a href="https://www.algolia.com/policies/privacy/">
              Algolia&apos;s privacy policy, relevant section: 9
            </a>
            .
          </p>

          <h2 id="payment-processing">Payment processing</h2>
          <p>
            We use Stripe to collect your payment information and accept
            payments. We do not store any of your payment information ourselves,
            or use Stripe to collect any information about you.
          </p>
          <p>
            <a href="https://stripe.com/ie/privacy">
              Stripe&apos;s privacy information
            </a>
            .
          </p>

          <h2 id="studio-emails">Studio emails</h2>
          <p>
            We use Postmark to send you emails about your account and teams in
            the Stately Studio. We do not use your email address for any other
            purposes unless you have signed up to our{' '}
            <a href="#mailing-list">mailing list</a>. We do not use Postmark to
            collect any information about you.
          </p>
          <p>
            <a href="https://postmarkapp.com/privacy-policy">
              Postmark&apos;s privacy policy
            </a>
            .
          </p>

          <h2 id="mailing-list">Mailing list</h2>
          <p>
            We use Crisp to host our mailing list. Your email address is
            securely stored with Crisp.
          </p>
          <p>
            If you sign up for our mailing list, we will only use your email
            address to send you updates about Stately, or to request your
            feedback on Stately&apos;s work. We will not send you spam and we
            will not share or sell your email address to any third-parties.
          </p>
          <p>
            You can unsubscribe from our mailing list at any time using the
            unsubscribe link included in all of our emails.
          </p>
          <p>
            <a href="https://crisp.chat/en/privacy/">
              Crisp&apos;s privacy policy
            </a>
            .
          </p>

          <h2 id="bug-tracking">Bug tracking</h2>
          <p>We use Sentry to track bugs.</p>
          <p>
            While using the Studio, we gather data about your actions and your
            operating system and browser, commonly referred to as the{' '}
            <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/User-Agent">
              user_agent
            </a>
            . This is the only personally-identifiable information we send to
            Sentry.
          </p>
          <p>
            The actions we send to Sentry include copying nodes, moving edges,
            and similar events you can do in Stately Studio&apos;s editor.
          </p>
          <p>
            We use this information to detect and address any issues that may
            have been overlooked during our quality control process.
          </p>
          <p>
            <a href="https://sentry.io/privacy/">
              Sentry&apos;s privacy policy
            </a>
            .
          </p>

          <h2 id="stately-ai">Stately AI</h2>
          <p>
            We use OpenAI for Stately AI features, such as generating and
            reviewing flows, chat, and visualizing code. When you use an AI
            feature, we send the machine, chat message, or code you submit to
            OpenAI to generate a response. We do not send your name, email, or
            other account details. OpenAI does not use data sent through its
            API to train its models, and it can keep that data for up to 30 days
            to monitor abuse.
          </p>
          <p>
            <a href="https://openai.com/policies/privacy-policy">
              OpenAI&apos;s privacy policy
            </a>
          </p>

          <h2 id="editor-mcp-skills">
            Stately editor, MCP server, and agent skills
          </h2>
          <p>
            The Stately MCP server lets coding agents create, save, and check
            models in Stately. You sign in to it with your Stately account.
          </p>
          <h3 id="share-links">Share links</h3>
          <p>
            When you or your agent create a share link for a diagram, we store
            the diagram with the link for 30 days, then delete it. Anyone with a
            link can view the diagram. If you were signed in when you created
            the link, you can delete it before it expires. On paid plans, you
            can make a link private so that only you can view it. Links created
            without signing in cannot be deleted before they expire.
          </p>
          <h3 id="saved-models">Saved models and check results</h3>
          <p>
            When your agent saves a model or a check result, we store the model,
            the check report, and the context your agent sends: the repository
            URL, the commit, the project folder name, file paths relative to
            your project, file hashes, and the source citations and
            descriptions attached to the model. We do not store absolute paths
            from your computer. The agent skill does not upload your source
            code. A citation can include a short description of the cited code.
            Saved models stay until you delete them or your account.
          </p>
          <h3 id="agent-skills">Agent skills</h3>
          <p>
            The Stately agent skills run on your computer. They do not send
            usage data to Stately. On first use, the checker downloads the TLA+
            tools from GitHub and a checksum-verified copy of XState from
            jsDelivr.
          </p>
          <h3 id="comments">Comments</h3>
          <p>
            We use Liveblocks to store and sync comments in the Stately editor.
          </p>
          <p>
            <a href="https://liveblocks.io/privacy">
              Liveblocks&apos;s privacy policy
            </a>
            .
          </p>

          <h2 id="inspector">Stately Inspector</h2>
          <p>
            When you use Stately Inspector, your machine configurations are sent
            to our servers to generate the visualizations. We do not store your
            machine configurations on our servers or collect any information
            about your machines.
          </p>

          <h2 id="support">Support</h2>
          <p>
            We use Crisp to respond to Premium support emails. Your email
            address is securely stored with Crisp. We do not use your email
            address for any other purpose.
          </p>
          <p>
            <a href="https://crisp.chat/en/privacy/">
              Crisp&apos;s privacy policy
            </a>
            .
          </p>

          <h2 id="subprocessors">Subprocessors</h2>
          <p>
            We use these services to process personal data on our behalf:
          </p>
          <ul>
            <li>Vercel: hosting, logs, and web analytics</li>
            <li>Supabase: database, authentication, and asset storage</li>
            <li>Upstash: share link storage</li>
            <li>Liveblocks: editor comments</li>
            <li>Mixpanel: usage analytics</li>
            <li>Plausible: website analytics (processed in the EU)</li>
            <li>OpenAI: AI features</li>
            <li>Algolia: search</li>
            <li>Stripe: payments</li>
            <li>Postmark: account emails</li>
            <li>Crisp: mailing list and support</li>
            <li>Google: surveys (Google Forms)</li>
            <li>Sentry: error tracking in Stately Studio</li>
            <li>Amazon Web Services: preview images of public machines</li>
          </ul>
          <p>
            Except for Plausible, which processes website visitor data in the
            EU, these services are based in the United States or process data
            there. When we transfer personal data from the European Economic
            Area, the United Kingdom, or Switzerland, we rely on the
            transfer mechanisms these providers offer, such as Standard
            Contractual Clauses.
          </p>

          <h2 id="your-rights">Your rights</h2>
          <p>
            We process your account data to provide the service you signed up
            for, usage analytics based on our legitimate interest in improving
            our tools (you can opt out at any time), and mailing list data based
            on your consent.
          </p>
          <p>
            You can ask us to access, correct, export, or delete your personal
            data, or object to how we process it. Email{' '}
            <a href="mailto:support@stately.ai">support@stately.ai</a> and we
            will respond within 30 days. You can also complain to your local
            data protection authority.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
