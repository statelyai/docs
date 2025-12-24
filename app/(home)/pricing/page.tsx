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
              Create unlimited public projects for free. Upgrade to work
              privately and unlock more features. Get a team to add users and
              enable collaboration.
            </p>
          </div>

          {/* Main Tiers with Arrows */}
          <div className="mb-12">
            <div className="grid md:grid-cols-[1fr_auto_1fr_auto_1fr] gap-6 items-center max-w-6xl mx-auto">
              {/* Community Tier */}
              <PricingCard
                name="Community"
                price="FREE"
                cta="Get started"
                ctaHref="https://stately.ai/registry/billing"
                features={[
                  {
                    text: 'Public projects and state machines',
                    href: 'https://stately.ai/docs/projects#change-a-projects-visibility',
                  },
                  {
                    text: 'Export to JavaScript and TypeScript',
                    href: 'https://stately.ai/docs/export-as-code',
                  },
                  {
                    text: 'State machine simulation',
                    href: 'https://stately.ai/docs/simulate-mode',
                  },
                  {
                    text: 'Generate and modify state machines using AI ✨',
                    subtext: '3 generations / month',
                    href: 'https://stately.ai/docs/generate-flow',
                  },
                  { text: 'Community support' },
                ]}
              />

              {/* Arrow */}
              <div className="hidden md:flex justify-center">
                <ArrowRight className="w-8 h-8 text-fd-muted-foreground" />
              </div>

              {/* Professional Tier */}
              <PricingCard
                name="Professional"
                price="$33"
                priceDetails="per month for an annual plan."
                priceSubtext="$39 per month for a monthly plan."
                cta="Start a free trial"
                ctaHref="https://stately.ai/registry/billing"
                highlighted
                features={[
                  {
                    text: 'Everything from Community',
                    href: 'https://stately.ai/docs/studio-community-plan',
                    strong: true,
                  },
                  {
                    text: 'Private and unlisted projects',
                    href: 'https://stately.ai/docs/projects#change-a-projects-visibility',
                  },
                  {
                    text: 'Generate and modify state machines using AI ✨',
                    subtext: '1,000 generations / month',
                    href: 'https://stately.ai/docs/generate-flow',
                  },
                  {
                    text: 'Generate React UIs',
                    href: 'https://stately.ai/docs/generate-react',
                  },
                  {
                    text: 'Version history',
                    href: 'https://stately.ai/docs/versions',
                  },
                  {
                    text: 'Live simulation mode',
                    href: 'https://stately.ai/docs/live-simulation',
                  },
                  {
                    text: 'Embed Figma designs',
                    href: 'https://stately.ai/docs/figma',
                  },
                  {
                    text: 'Color states and transitions',
                    href: 'https://stately.ai/docs/colors',
                  },
                  {
                    text: 'GitHub Sync',
                    href: 'https://stately.ai/docs/import-from-github',
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
                cta="Start a free trial"
                ctaHref="https://stately.ai/registry/billing"
                features={[
                  {
                    text: 'Everything from Pro',
                    subtext: 'For all team members!',
                    href: 'https://stately.ai/docs/studio-pro-plan',
                    strong: true,
                  },
                  {
                    text: 'Add up to 10 team members',
                    href: 'https://stately.ai/docs/teams',
                  },
                  {
                    text: 'Shared team projects',
                    href: 'https://stately.ai/docs/teams',
                  },
                  {
                    text: 'Team admins and editors',
                    href: 'https://stately.ai/docs/teams',
                  },
                  {
                    text: 'Unlimited view-only access for non-team members',
                    href: 'https://stately.ai/docs/teams',
                  },
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
                  text: 'Everything from the Community, Pro, and Team plans',
                  href: 'https://stately.ai/docs/studio-pro-plan',
                },
                {
                  text: 'Unlimited generated flows',
                  href: 'https://stately.ai/docs/generate-flow',
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
