import type { Metadata } from 'next';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Privacy',
  description:
    "The Stately privacy policy outlines how we collect, use, and protect your personal data when you use our platform.",
};

export default function PrivacyPage() {
  return (
    <>
      <main className="min-h-screen py-24">
        <div className="container mx-auto max-w-4xl px-6 prose prose-invert prose-fd">
          <h1>Privacy policy</h1>

          <p>Last updated February 2024:</p>
          <ul>
            <li>
              Added information about{' '}
              <a href="#inspector">Stately Inspector</a>
            </li>
          </ul>

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
            We track how you use Stately Studio and use Mixpanel to analyze the
            activity data. With your consent in the Studio settings, we
            attribute your hashed user id to the activity data. Analyzing
            patterns in user activity helps us understand how you use our tools
            and how we might improve your experience.
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
          <p>
            If you would like to delete your profile information from our
            database, please email{' '}
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
            to sync your Figma frames when you embed Figma assets. We do not
            use Figma to collect any information about you.
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
          <p>
            We do not use Algolia to collect any information about you.
          </p>
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

          <h2 id="connecting-actors">Connecting actors</h2>
          <p>
            We use Partykit for live connections between running actors. We
            don&apos;t send any personal data to Partykit. We send machine
            configurations and events for the actors.
          </p>
          <p>
            <a href="https://partykit.io/privacy">
              Partykit&apos;s privacy policy
            </a>
          </p>

          <h2 id="stately-ai">Stately AI</h2>
          <p>
            We use OpenAI for Stately AI features including generating flows,
            generating summaries, and enhancing generated React apps. The
            Stately AI features are optional Premium features and we do not send
            any of your personal data to OpenAI. We only send your machine
            configurations back to OpenAI if you are modifying an existing flow.
          </p>
          <p>
            <a href="https://openai.com/policies/privacy-policy">
              OpenAI&apos;s privacy policy
            </a>
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
        </div>
      </main>
      <Footer />
    </>
  );
}
