'use client';

import Link from 'next/link';
import { Check, ArrowRight } from 'lucide-react';
import { Footer } from '@/components/Footer';

export default function PricingPage() {
  return (
    <>
      <main className="min-h-screen py-24">
        <div className="container mx-auto max-w-7xl px-6">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-fd-foreground mb-6">
              Pricing
            </h1>
            <p className="text-lg md:text-xl text-fd-muted-foreground max-w-3xl mx-auto">
              Every new account starts with a free 7-day trial of Pro, no credit
              card required. Upgrade to keep building and working privately. Get
              a Team plan to add users and enable collaboration.
            </p>
          </div>

          {/* Main Tiers with Arrows */}
          <div className="mb-12">
            <div className="grid md:grid-cols-[1fr_auto_1fr] gap-6 items-center max-w-4xl mx-auto">
              {/* Pro Tier */}
              <PricingCard
                name="Pro"
                price="$33"
                priceDetails="per month for an annual plan."
                priceSubtext="$39 per month for a monthly plan."
                trialNote="Free 7-day trial included"
                trialDetail="When your trial ends, your machines and projects become read-only until you upgrade."
                cta="Start a free trial"
                ctaHref="/registry/billing"
                highlighted
                features={[
                  {
                    text: 'Unlimited public, private, and unlisted projects',
                    href: '/docs/projects#change-a-projects-visibility',
                  },
                  {
                    text: 'Generate and modify state machines using AI ✨',
                    subtext: '1,000 generations / month',
                    href: '/docs/generate-flow',
                  },
                  {
                    text: 'Deploy state machines as workflows with Stately Sky',
                    subtext: 'Beta feature',
                    href: '/docs/stately-sky-getting-started',
                  },
                  {
                    text: 'Version history',
                    href: '/docs/versions',
                  },
                  {
                    text: 'Live simulation mode',
                    href: '/docs/live-simulation',
                  },
                  {
                    text: 'Embed Figma designs',
                    href: '/docs/figma',
                  },
                  {
                    text: 'Color states and transitions',
                    href: '/docs/colors',
                  },
                  {
                    text: 'Codebase sync',
                    subtext: 'via GitHub or the CLI',
                    href: '/docs/import-from-github',
                  },
                  {
                    text: 'Export to JavaScript and TypeScript',
                    href: '/docs/export-as-code',
                  },
                  { text: 'Priority support' },
                ]}
              />

              {/* Arrow */}
              <div className="hidden md:flex justify-center">
                <ArrowRight className="w-8 h-8 text-fd-muted-foreground" />
              </div>

              {/* Team Tier */}
              <PricingCard
                name="Team"
                price="$167"
                priceDetails="per month for an annual plan."
                priceSubtext="$199 per month for a monthly plan."
                cta="Get started"
                ctaHref="/registry/billing"
                features={[
                  {
                    text: 'Everything from Pro',
                    subtext: 'For all team members!',
                    href: '/docs/studio-pro-plan',
                    strong: true,
                  },
                  {
                    text: 'Add up to 10 team members',
                    href: '/docs/teams',
                  },
                  {
                    text: 'Shared team projects',
                    href: '/docs/teams',
                  },
                  {
                    text: 'Team admins and editors',
                    href: '/docs/teams',
                  },
                  {
                    text: 'Unlimited view-only access for non-team members',
                    href: '/docs/teams',
                  },
                  { text: 'Live collaboration', subtext: 'Coming soon' },
                  { text: 'Priority support' },
                ]}
              />
            </div>
          </div>

          {/* Additional Tiers */}
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Enterprise Tier */}
            <PricingCard
              name="Enterprise"
              customPrice="Contact us"
              cta="Contact us"
              ctaHref="mailto:support@stately.ai?subject=I'm interested in the Stately Studio Enterprise plan"
              features={[
                {
                  text: 'Everything from the Pro and Team plans',
                  href: '/docs/studio-pro-plan',
                },
                {
                  text: 'Unlimited generated flows',
                  href: '/docs/generate-flow',
                },
                { text: 'Flexible hosting' },
                { text: 'Dedicated priority support' },
                { text: 'Custom server locations' },
                { text: 'Single sign-on (SSO)' },
                { text: 'Audit logs' },
                { text: 'Embed Stately into your own apps' },
                {
                  text: 'Custom effect collections (actions, actors, and more)',
                },
                { text: 'Custom export formats' },
                { text: 'Prioritized feature requests' },
                {
                  text: 'A custom plan tailored to the requirements of your organization',
                },
              ]}
            />

            {/* Services */}
            <PricingCard
              name="Services"
              customPrice="Contact us"
              cta="Contact us"
              ctaHref="mailto:support@stately.ai?subject=I'm interested in the Stately Studio services"
              features={[
                {
                  text: 'Consultancy on state management and/or using XState in your team',
                },
                { text: 'Workshops for XState' },
                {
                  text: 'Custom solutions for state machine logic and model-based testing',
                },
                { text: 'Priority support' },
              ]}
            />
          </div>

          {/* Free is a state, not a plan: it is what an account falls back to */}
          <p className="mt-8 text-sm text-fd-muted-foreground text-center max-w-3xl mx-auto">
            Not ready to upgrade? You can keep viewing your machines and
            projects, and browse and simulate public machines, for free.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}

interface Feature {
  text: string;
  subtext?: string;
  href?: string;
  strong?: boolean;
}

interface PricingCardProps {
  name: string;
  price?: string;
  customPrice?: string;
  priceDetails?: string;
  priceSubtext?: string;
  /** Short badge under the price, e.g. "Free 7-day trial included". */
  trialNote?: string;
  /** Fine print under the trial note, e.g. what expiry means. */
  trialDetail?: string;
  cta: string;
  ctaHref: string;
  features: Feature[];
  highlighted?: boolean;
}

function PricingCard({
  name,
  price,
  customPrice,
  priceDetails,
  priceSubtext,
  trialNote,
  trialDetail,
  cta,
  ctaHref,
  features,
  highlighted = false,
}: PricingCardProps) {
  return (
    <div
      className={`rounded-2xl border ${
        highlighted
          ? 'border-blue-500 bg-blue-950/20 dark:bg-blue-950/10 shadow-lg shadow-blue-500/10'
          : 'border-fd-border bg-fd-card'
      } p-8 flex flex-col h-full`}
    >
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-extrabold text-fd-foreground mb-4">
          {name}
        </h2>

        {/* Price */}
        {price && (
          <div className="mb-4">
            <div className="text-4xl font-extrabold text-fd-foreground mb-2">
              {price}
            </div>
            {priceDetails && (
              <div className="text-sm text-fd-muted-foreground">
                <span className="font-semibold">{priceDetails}</span>
                {priceSubtext && (
                  <>
                    <br />
                    {priceSubtext}
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {customPrice && (
          <div className="text-2xl font-semibold text-fd-muted-foreground mb-4">
            {customPrice}
          </div>
        )}

        {trialNote && (
          <div className="mb-2">
            <span className="inline-block rounded-md bg-blue-500/15 px-2 py-1 text-xs font-semibold text-blue-500">
              {trialNote}
            </span>
          </div>
        )}

        {trialDetail && (
          <p className="mb-4 text-xs text-fd-muted-foreground">{trialDetail}</p>
        )}

        {/* CTA Button */}
        <Link
          href={ctaHref}
          className={`block text-center px-6 py-3 rounded-lg font-medium transition-colors ${
            highlighted
              ? 'bg-pink-600 hover:bg-pink-700 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {cta}
        </Link>
      </div>

      {/* Features */}
      <ul className="space-y-3 flex-1">
        {features.map((feature, idx) => (
          <li key={idx} className="flex gap-3 text-sm">
            <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
            <div>
              {feature.href ? (
                <a
                  href={feature.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-fd-foreground hover:text-blue-500 transition-colors"
                >
                  {feature.strong ? (
                    <strong>{feature.text}</strong>
                  ) : (
                    feature.text
                  )}
                  {feature.subtext && (
                    <span className="block text-xs text-fd-muted-foreground mt-1">
                      {feature.subtext}
                    </span>
                  )}
                </a>
              ) : (
                <span className="text-fd-foreground">
                  {feature.strong ? (
                    <strong>{feature.text}</strong>
                  ) : (
                    feature.text
                  )}
                  {feature.subtext && (
                    <span className="block text-xs text-fd-muted-foreground mt-1">
                      {feature.subtext}
                    </span>
                  )}
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
