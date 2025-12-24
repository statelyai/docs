'use client';

import Link from 'next/link';
import {
  ArrowRight,
  Play,
  Wand2,
  Sparkles,
  CheckCircle,
  ArrowLeftRight,
  FileDown,
  Share,
  Github,
  ShieldCheck,
  BookOpen,
  ExternalLink,
} from 'lucide-react';
import { Footer } from '@/components/Footer';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Companies />
      <DesignSection />
      <BuildSection />
      <UnderstandSection />
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-linear-to-b from-blue-950/50 via-transparent to-transparent dark:from-blue-950/30" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl" />

      <div className="container relative mx-auto max-w-6xl px-6">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-fd-foreground">
            Turn ideas into diagrams and code in minutes.
          </h1>

          <p className="mt-8 text-lg md:text-xl text-fd-muted-foreground max-w-2xl mx-auto leading-relaxed">
            From frontend user flows to backend workflows, visually build and
            deploy any type of logic with Stately as your source of truth.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="https://stately.ai/editor?source=landing-page"
              className="inline-flex items-center gap-2 px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white font-medium rounded-full transition-colors"
            >
              Try the visual editor
            </Link>
            <Link
              href="https://calendly.com/d/yc8-3hq-rpc/request-a-demo"
              target="_blank"
              className="inline-flex items-center gap-2 px-6 py-3 bg-fd-secondary hover:bg-fd-accent text-fd-foreground font-medium rounded-full transition-colors"
            >
              Book a demo
            </Link>
          </div>
        </div>

        {/* Hero image */}
        <div className="mt-16 relative">
          <div className="absolute inset-0 bg-linear-to-t from-fd-background via-transparent to-transparent z-10 pointer-events-none" />
          <div className="rounded-xl border border-fd-border shadow-2xl shadow-blue-500/10 overflow-hidden bg-fd-card">
            <img
              src="/assets/landing/room-readings.png"
              alt="This state machine is called Accumulate room readings. Its purpose is to get temperature and humidity readings from IoT sensors and generate a report every hour."
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Companies() {
  const companies = [
    { name: 'AWS', src: '/landing-page/assets/aws.svg', width: 65 },
    { name: 'Netflix', src: '/landing-page/assets/netflix.svg', width: 122 },
    { name: 'Lyft', src: '/landing-page/assets/lyft.svg', width: 58 },
    {
      name: 'Microsoft',
      src: '/landing-page/assets/microsoft.svg',
      width: 154,
    },
    {
      name: 'Epic Games',
      src: '/landing-page/assets/epic-games.svg',
      width: 45,
    },
    { name: 'Cisco', src: '/landing-page/assets/cisco.svg', width: 74 },
  ];

  return (
    <section className="py-16 border-y border-fd-border bg-fd-muted/30">
      <div className="container mx-auto max-w-6xl px-6">
        <div className="flex flex-wrap items-center justify-center gap-12 md:gap-16">
          {companies.map((company) => (
            <img
              key={company.name}
              src={company.src}
              alt={company.name}
              width={company.width}
              className="h-16 w-auto opacity-50 hover:opacity-70 transition-opacity invert-100 dark:invert-0"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function DesignSection() {
  return (
    <section className="py-24">
      <div className="container mx-auto max-w-6xl px-6">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-fd-foreground leading-tight">
          <span className="text-pink-500">Design how it works</span> with a
          visual language for everyone on the team.
        </h2>

        <div className="grid md:grid-cols-2 gap-12 mt-16">
          <div className="flex gap-6">
            <Wand2 className="w-8 h-8 text-pink-400 shrink-0 mt-1" />
            <p className="text-lg text-fd-muted-foreground">
              Our drag and drop editor brings together contributors of all
              backgrounds. Code, diagrams, documentation, test generation, and
              more in one place. No more silos. Always up to date.
            </p>
          </div>
          <div className="flex gap-6">
            <Sparkles className="w-8 h-8 text-pink-400 shrink-0 mt-1" />
            <p className="text-lg text-fd-muted-foreground">
              AIs love helping at each phase with state machines to guide them,
              while humans use the visual editor to audit and enhance their
              work.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-16">
          <div className="p-8 rounded-2xl border border-fd-border bg-fd-card">
            <p className="text-lg text-fd-muted-foreground">
              <strong className="text-fd-foreground">
                Create flows with no code required
              </strong>
              . Rapidly prototype or gather requirements without worrying about
              technical details.
            </p>
          </div>
          <div className="p-8 rounded-2xl border border-fd-border bg-fd-card">
            <p className="text-lg text-fd-muted-foreground">
              <strong className="text-fd-foreground">
                Then simulate your design
              </strong>{' '}
              to test and iterate. You can even instantly try out a prototype as
              an auto-generated React app.
            </p>
          </div>
          <div className="p-8 rounded-2xl border border-fd-border bg-fd-card">
            <p className="text-lg text-fd-muted-foreground">
              <strong className="text-fd-foreground">Get feedback</strong> from
              your team and clients on how everything is supposed to work.
            </p>
          </div>
          <div className="p-8 rounded-2xl border border-fd-border bg-fd-card">
            <p className="text-lg text-fd-muted-foreground">
              <strong className="text-fd-foreground">
                Explore community diagrams
              </strong>{' '}
              to inspire your own solutions. Share your work with the community
              to get feedback and kudos.
            </p>
          </div>
          <div className="md:col-span-2 p-8 rounded-2xl border border-fd-border bg-fd-card">
            <p className="text-lg text-fd-muted-foreground">
              <strong className="text-fd-foreground">
                Generate flows with AI
              </strong>{' '}
              to scaffold behavior, suggest variants, turn up edge cases, and
              even write code.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function BuildSection() {
  return (
    <section className="py-24 bg-fd-muted/30">
      <div className="container mx-auto max-w-6xl px-6">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-fd-foreground leading-tight">
          <span className="text-orange-500">
            Build with executable diagrams
          </span>{' '}
          and get the best of text-based and visual tools.
        </h2>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="space-y-4">
            <p className="text-lg text-fd-muted-foreground">
              <strong className="text-fd-foreground">
                Run diagrams using XState
              </strong>
              , a best-in-class open source library for orchestrating and
              managing state in JavaScript and TypeScript apps. No lock-in.
            </p>
            <div className="flex gap-2">
              <Link
                href="/docs"
                className="text-sm px-3 py-1.5 bg-fd-secondary hover:bg-fd-accent rounded-full transition-colors"
              >
                Read XState docs
              </Link>
              <Link
                href="https://github.com/statelyai/xstate"
                target="_blank"
                className="text-sm px-3 py-1.5 bg-fd-secondary hover:bg-fd-accent rounded-full transition-colors"
              >
                View on Github
              </Link>
            </div>
          </div>
          <div>
            <p className="text-lg text-fd-muted-foreground">
              <strong className="text-fd-foreground">
                Use XState on the frontend, backend, or wherever JavaScript runs
              </strong>
              . Integrations are available for React, Vue, Svelte, and other
              frameworks.
            </p>
          </div>
          <div className="space-y-4">
            <p className="text-lg text-fd-muted-foreground">
              XState uses event-driven programming, state machines, statecharts,
              and the actor model to{' '}
              <strong className="text-fd-foreground">
                handle even the most complex logic in predictable, robust, and
                visual ways
              </strong>
              .
            </p>
            <Link
              href="/docs/state-machines-and-statecharts"
              className="inline-block text-sm px-3 py-1.5 bg-fd-secondary hover:bg-fd-accent rounded-full transition-colors"
            >
              Learn more about statecharts
            </Link>
          </div>
        </div>

        {/* VS Code image */}
        <div className="mt-12 rounded-xl border border-fd-border shadow-xl overflow-hidden">
          <img
            src="/assets/landing/vscode-split.png"
            alt="A book lender state machine in VSCode. One panel shows the state machine as a JavaScript object, the other panel shows the same state machine visualized using the XState VSCode extension."
            className="w-full h-auto"
          />
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-16">
          <div className="p-6 rounded-2xl border border-fd-border bg-fd-card flex gap-4">
            <ArrowLeftRight className="w-6 h-6 text-orange-400 shrink-0 mt-1" />
            <p className="text-fd-muted-foreground">
              <strong className="text-fd-foreground">
                Bidirectional updates
              </strong>{' '}
              between code and visualization let you use what makes you most
              productive.
            </p>
          </div>
          <div className="p-6 rounded-2xl border border-fd-border bg-fd-card flex gap-4">
            <FileDown className="w-6 h-6 text-orange-400 shrink-0 mt-1" />
            <p className="text-fd-muted-foreground">
              <strong className="text-fd-foreground">
                Automatically visualize Redux, Zustand, and other code
              </strong>{' '}
              to get the benefits of Stately in your codebase even without
              XState.
            </p>
          </div>
          <div className="p-6 rounded-2xl border border-fd-border bg-fd-card space-y-3">
            <p className="text-fd-muted-foreground">
              <strong className="text-fd-foreground">An IDE extension</strong>{' '}
              brings the power of Stately into VS Code.
            </p>
            <Link
              href="https://marketplace.visualstudio.com/items?itemName=statelyai.stately-vscode"
              target="_blank"
              className="inline-block text-sm px-3 py-1.5 bg-fd-secondary hover:bg-fd-accent rounded-full transition-colors"
            >
              Download the VS Code extension
            </Link>
          </div>
        </div>

        {/* Generate React apps */}
        <div className="mt-6 rounded-2xl border border-fd-border bg-fd-card overflow-hidden">
          <div className="grid md:grid-cols-2">
            <div className="p-8 flex items-center">
              <p className="text-fd-muted-foreground">
                <strong className="text-fd-foreground">
                  Generate React apps from diagrams
                </strong>{' '}
                to jumpstart product development. Keep iterating visually with
                the help of AI, or dive straight into the code to rapidly extend
                the scaffolding with your vision.
              </p>
            </div>
            <img
              src="/assets/landing/generate-react.png"
              alt="The room reading state machine visualized in the Stately editor alongside the React app code generated for that app logic."
              className="w-full h-auto"
            />
          </div>
        </div>

        {/* Generate tests */}
        <div className="mt-6 rounded-2xl border border-fd-border bg-fd-card overflow-hidden">
          <div className="p-8">
            <p className="text-fd-muted-foreground">
              <strong className="text-fd-foreground">
                Generate tests automatically
              </strong>{' '}
              to keep coverage robust and up-to-date.
            </p>
          </div>
          <img
            src="/assets/landing/test-generation.png"
            alt="A test path list of states and events in the Stately editor alongside that path being highlighted on the canvas, and the code generated to implement the tests."
            className="w-full h-auto"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <div className="p-6 rounded-2xl border border-fd-border bg-fd-card flex gap-4">
            <Share className="w-6 h-6 text-orange-400 shrink-0 mt-1" />
            <p className="text-fd-muted-foreground">
              <strong className="text-fd-foreground">
                Export all of your generated code
              </strong>{' '}
              in Javascript or Typescript.
            </p>
          </div>
          <div className="p-6 rounded-2xl border border-fd-border bg-fd-card flex gap-4">
            <Github className="w-6 h-6 text-orange-400 shrink-0 mt-1" />
            <p className="text-fd-muted-foreground">
              <strong className="text-fd-foreground">
                Connect with Github
              </strong>{' '}
              to sync Stately with your codebase.
            </p>
          </div>
        </div>

        {/* Inspector */}
        <div className="mt-6 rounded-2xl border border-fd-border bg-fd-card overflow-hidden">
          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-6">
              <p className="text-fd-muted-foreground">
                <strong className="text-fd-foreground">
                  Inspect running apps
                </strong>{' '}
                with Stately Inspector to help test, and debug your logic.
              </p>
              <p className="text-fd-muted-foreground">
                <strong className="text-fd-foreground">
                  Visualize communication between actors
                </strong>{' '}
                in your running app with sequence diagrams.
              </p>
            </div>
          </div>
          <img
            src="/assets/landing/inspector.png"
            alt="The Stately Inspector view, showing a state machine and a sequence diagram for the pizza ordering process side-by-side."
            className="w-full h-auto"
          />
        </div>
      </div>
    </section>
  );
}

function UnderstandSection() {
  return (
    <section className="py-24">
      <div className="container mx-auto max-w-6xl px-6">
        <p className="text-2xl font-extrabold text-fd-muted-foreground mb-4">
          Products evolve. People are busy.
        </p>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-fd-foreground leading-tight">
          <span className="text-green-500">Understand and stay aligned</span>{' '}
          with Stately as the source of truth.
        </h2>

        <div className="grid md:grid-cols-2 gap-12 mt-16">
          <div className="flex gap-6">
            <ShieldCheck className="w-12 h-12 text-green-400 shrink-0" />
            <p className="text-lg text-fd-muted-foreground">
              <strong className="text-fd-foreground">
                Future proof your code
              </strong>{' '}
              with clear visualizations that are easy to return to and change
              later. Even years later.
            </p>
          </div>
          <div className="flex gap-6">
            <BookOpen className="w-12 h-12 text-green-400 shrink-0" />
            <p className="text-lg text-fd-muted-foreground">
              <strong className="text-fd-foreground">
                Living documentation
              </strong>{' '}
              keeps the whole team in sync without extra overhead.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="p-6 rounded-2xl border border-fd-border bg-fd-card">
            <p className="text-fd-muted-foreground">
              <strong className="text-fd-foreground">Save versions</strong> as
              backup and to see the history of your work.
            </p>
          </div>
          <div className="p-6 rounded-2xl border border-fd-border bg-fd-card">
            <p className="text-fd-muted-foreground">
              <strong className="text-fd-foreground">
                Export as markdown stories, Mermaid drawings, or JSON documents
              </strong>{' '}
              that can be copied into issues and project documents.
            </p>
          </div>
          <div className="p-6 rounded-2xl border border-fd-border bg-fd-card">
            <p className="text-fd-muted-foreground">
              <strong className="text-fd-foreground">
                Generate diagram summaries
              </strong>{' '}
              to get oriented quickly.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const column1 = [
    {
      quote:
        'Every team where I introduced XState has been more effective at handling state management with complex user interfaces. It fills a gap in the JS ecosystem no other tool did before.',
      name: 'Amy Pellegrini',
      company: 'Thoughtworks',
      avatar: '/landing-page/assets/amy.png',
    },
    {
      quote:
        "We've been using XState for our new payments product. Shout out to the team that is making designing complex front-end flows a dream.",
      name: 'Natalie Cuthbert',
      company: 'Stitch',
      avatar: '/landing-page/assets/natalie.png',
    },
    {
      quote:
        'XState is a revelation. It makes complex tasks easier to build and debug while also making the code more straightforward and approachable.',
      name: 'Patrick Cavit',
      company: 'Netflix',
      avatar: '/landing-page/assets/patrick.png',
    },
  ];

  const column2 = [
    {
      quote:
        "XState naturally separates the logic and makes it simple to mock out API calls, so it's easier to test the code and organize it!",
      name: 'Presley Pizzo',
      company: 'Coder',
      avatar: '/landing-page/assets/presley.png',
    },
    {
      quote:
        'We use XState to implement business workflows as statecharts. The visualizer helps us collaborate more closely with customers, the ability to externalize workflows as JSON configuration makes complex workflow changes surprisingly simple to roll out, and test case generation makes it easier than ever to move forward with confidence. XState makes it all possible!',
      name: 'James Tharpe',
      company: 'T-Mobile',
      avatar: '/landing-page/assets/james.png',
    },
  ];

  const column3 = [
    {
      quote:
        'Advantages of XState: Visually clear view of the code flow, code reusability, test coverage, easy to debug/ spot bugs, code scalability & maintenance, and better code design & planning.',
      name: 'Maya Shavin',
      company: 'Microsoft',
      avatar: '/landing-page/assets/maya.png',
    },
    {
      quote:
        'Thinking and building with XState has been a revolution in how I develop robust business logic. But being able to visualize that in real time, has been a game changer in how I model and communicate any logic!',
      name: 'Santi Cros',
      company: 'Domestic Data Streamers',
      avatar: '/landing-page/assets/santi.png',
    },
  ];

  const TestimonialCard = ({
    testimonial,
  }: {
    testimonial: (typeof column1)[0];
  }) => (
    <div className="p-6 rounded-2xl border border-fd-border bg-fd-card">
      <div className="flex items-center gap-4 mb-4">
        <img
          src={testimonial.avatar}
          alt={testimonial.name}
          className="w-14 h-14 rounded-full"
        />
        <div>
          <p className="font-semibold text-fd-foreground">{testimonial.name}</p>
          <p className="text-sm text-fd-muted-foreground">
            @ {testimonial.company}
          </p>
        </div>
      </div>
      <p className="text-fd-foreground leading-relaxed">{testimonial.quote}</p>
    </div>
  );

  return (
    <section className="py-24 bg-fd-muted/30">
      <div className="container mx-auto max-w-6xl px-6">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-fd-foreground text-center mb-16">
          Loved by teams
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
          <div className="space-y-6">
            {column1.map((t) => (
              <TestimonialCard key={t.name} testimonial={t} />
            ))}
          </div>
          <div className="space-y-6">
            {column2.map((t) => (
              <TestimonialCard key={t.name} testimonial={t} />
            ))}
          </div>
          <div className="space-y-6">
            {column3.map((t) => (
              <TestimonialCard key={t.name} testimonial={t} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="py-24">
      <div className="container mx-auto max-w-4xl px-6">
        <div className="relative rounded-3xl overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-linear-to-br from-blue-600 to-blue-700" />

          <div className="relative p-12 md:p-16 text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
              Intelligent logic to transition from design to deployment,{' '}
              <span className="text-blue-200">and back again.</span>
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12">
              <Link
                href="https://stately.ai/registry/signup"
                target="_blank"
                className="inline-flex items-center gap-2 px-8 py-4 bg-blue-500 hover:bg-blue-400 text-white font-semibold rounded-full transition-colors"
              >
                Sign up for free
              </Link>
              <Link
                href="https://calendly.com/d/yc8-3hq-rpc/request-a-demo"
                target="_blank"
                className="inline-flex items-center gap-2 px-8 py-4 bg-orange-500 hover:bg-orange-400 text-white font-semibold rounded-full transition-colors"
              >
                Book a demo
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

