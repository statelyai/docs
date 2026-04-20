import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { AISearchPanel } from '@/components/ai/search-panel';
import { getProjectRoutePrefix } from '@/lib/docs-sources';
import { externalDocsNav } from '@/lib/external-docs-nav.generated';
import { baseOptions } from '@/lib/layout.shared';

const externalProjectPages = externalDocsNav.map((sourceConfig) => {
  const routePrefix = `/docs/${getProjectRoutePrefix(sourceConfig.package)}`;
  const indexPage = sourceConfig.pages.find((page) => page.url === routePrefix);
  const childPages = sourceConfig.pages
    .filter((page) => page.url !== routePrefix)
    .map((page) => ({
      type: 'page' as const,
      name: page.title,
      url: page.url,
    }));

  if (childPages.length === 0) {
    return {
      type: 'page' as const,
      name: sourceConfig.name,
      url: routePrefix,
    };
  }

  return {
    name: sourceConfig.name,
    type: 'folder' as const,
    index: {
      type: 'page' as const,
      name: indexPage?.title ?? 'Overview',
      url: routePrefix,
    },
    children: childPages,
  };
});

const tree = {
  name: 'docs',
  children: [
    {
      name: 'Get Started',
      type: 'folder' as const,
      children: [
        {
          type: 'page' as const,
          name: 'Quick start',
          url: '/docs/quick-start',
        },
        {
          type: 'page' as const,
          name: 'Install XState',
          url: '/docs/installation',
        },
        {
          type: 'page' as const,
          name: 'Migrate to XState v5',
          url: '/docs/migration',
        },
        {
          type: 'page' as const,
          name: 'Examples',
          url: '/docs/examples',
        },
        {
          type: 'page' as const,
          name: 'Templates',
          url: '/docs/templates',
        },
        {
          type: 'page' as const,
          name: 'Cheatsheet',
          url: '/docs/cheatsheet',
        },
        {
          type: 'page' as const,
          name: 'Typescript',
          url: '/docs/typescript',
        },
        {
          type: 'page' as const,
          name: 'API',
          url: 'https://www.jsdocs.io/package/xstate',
        },
      ],
    },
    {
      name: 'Core Concepts',
      type: 'folder' as const,
      children: [
        {
          type: 'page' as const,
          name: 'State machines and statecharts',
          url: '/docs/state-machines-and-statecharts',
        },
        {
          type: 'page' as const,
          name: 'Actor model',
          url: '/docs/actor-model',
        },
        {
          type: 'page' as const,
          name: 'What is XState?',
          url: '/docs/xstate',
        },
      ],
    },
    {
      name: 'State Machines',
      type: 'folder' as const,
      children: [
        {
          type: 'page' as const,
          name: 'State machines',
          url: '/docs/machines',
        },
        {
          type: 'page' as const,
          name: 'Setup',
          url: '/docs/setup',
        },
        {
          type: 'page' as const,
          name: 'States',
          url: '/docs/states',
        },
        {
          type: 'page' as const,
          name: 'Context',
          url: '/docs/context',
        },
        {
          type: 'page' as const,
          name: 'Input',
          url: '/docs/input',
        },
        {
          type: 'page' as const,
          name: 'Output',
          url: '/docs/output',
        },
        {
          type: 'page' as const,
          name: 'Events and transitions',
          url: '/docs/transitions',
        },
        {
          type: 'page' as const,
          name: 'Routes',
          url: '/docs/routes',
        },
        {
          type: 'page' as const,
          name: 'Pure transition functions',
          url: '/docs/pure-transitions',
        },
        {
          type: 'page' as const,
          name: 'Eventless transitions',
          url: '/docs/eventless-transitions',
        },
        {
          type: 'page' as const,
          name: 'Delayed transitions',
          url: '/docs/delayed-transitions',
        },
        {
          type: 'page' as const,
          name: 'Actions',
          url: '/docs/actions',
        },
        {
          type: 'page' as const,
          name: 'Guards',
          url: '/docs/guards',
        },
        {
          type: 'page' as const,
          name: 'Initial states',
          url: '/docs/initial-states',
        },
        {
          type: 'page' as const,
          name: 'Finite states',
          url: '/docs/finite-states',
        },
        {
          type: 'page' as const,
          name: 'Parent states',
          url: '/docs/parent-states',
        },
        {
          type: 'page' as const,
          name: 'Parallel states',
          url: '/docs/parallel-states',
        },
        {
          type: 'page' as const,
          name: 'Final states',
          url: '/docs/final-states',
        },
        {
          type: 'page' as const,
          name: 'History states',
          url: '/docs/history-states',
        },
        {
          type: 'page' as const,
          name: 'Persistence',
          url: '/docs/persistence',
        },
        {
          type: 'page' as const,
          name: 'Tags',
          url: '/docs/tags',
        },
        {
          type: 'page' as const,
          name: 'Event emitter',
          url: '/docs/event-emitter',
        },
      ],
    },
    {
      name: 'Actors',
      type: 'folder' as const,
      children: [
        {
          type: 'page' as const,
          name: 'Actors',
          url: '/docs/actors',
        },
        {
          type: 'page' as const,
          name: 'State machine actors',
          url: '/docs/state-machine-actors',
        },
        {
          type: 'page' as const,
          name: 'Promise actors',
          url: '/docs/promise-actors',
        },
        {
          type: 'page' as const,
          name: 'Transition actors',
          url: '/docs/transition-actors',
        },
        {
          type: 'page' as const,
          name: 'Callback actors',
          url: '/docs/callback-actors',
        },
        {
          type: 'page' as const,
          name: 'Observable actors',
          url: '/docs/observable-actors',
        },
        {
          type: 'page' as const,
          name: 'Invoke',
          url: '/docs/invoke',
        },
        {
          type: 'page' as const,
          name: 'Spawn',
          url: '/docs/spawn',
        },
        {
          type: 'page' as const,
          name: 'System',
          url: '/docs/system',
        },
        {
          type: 'page' as const,
          name: 'Inspection',
          url: '/docs/inspection',
        },
      ],
    },
    {
      name: 'Guides',
      type: 'folder' as const,
      children: [
        {
          type: 'page' as const,
          name: 'Graph utilities',
          url: '/docs/graph',
        },
        {
          type: 'page' as const,
          name: 'Testing',
          url: '/docs/testing',
        },
        {
          type: 'page' as const,
          name: 'Immer',
          url: '/docs/immer',
        },
      ],
    },
    {
      name: 'Packages',
      type: 'folder' as const,
      children: [
        {
          name: 'XState Store',
          type: 'folder' as const,
          index: {
            type: 'page' as const,
            name: 'Overview',
            url: '/docs/xstate-store',
          },
          children: [
            {
              type: 'page' as const,
              name: 'Vanilla',
              url: '/docs/xstate-store',
            },
            {
              type: 'page' as const,
              name: 'React',
              url: '/docs/xstate-store/react',
            },
            {
              type: 'page' as const,
              name: 'Vue',
              url: '/docs/xstate-store/vue',
            },
            {
              type: 'page' as const,
              name: 'Svelte',
              url: '/docs/xstate-store/svelte',
            },
            {
              type: 'page' as const,
              name: 'Solid',
              url: '/docs/xstate-store/solid',
            },
            {
              type: 'page' as const,
              name: 'Angular',
              url: '/docs/xstate-store/angular',
            },
            {
              type: 'page' as const,
              name: 'Preact',
              url: '/docs/xstate-store/preact',
            },
          ],
        },
        {
          type: 'page' as const,
          name: 'XState React',
          url: '/docs/xstate-react',
        },
        {
          type: 'page' as const,
          name: 'XState Vue',
          url: '/docs/xstate-vue',
        },
        {
          type: 'page' as const,
          name: 'XState Svelte',
          url: '/docs/xstate-svelte',
        },
        {
          type: 'page' as const,
          name: 'XState Graph',
          url: '/docs/xstate-graph',
        },
        {
          type: 'page' as const,
          name: 'XState Test',
          url: '/docs/xstate-test',
        },
        ...externalProjectPages,
      ],
    },
    {
      name: 'Developer Tools',
      type: 'folder' as const,
      children: [
        {
          type: 'page' as const,
          name: 'XState VS Code extension',
          url: '/docs/xstate-vscode-extension',
        },
        {
          type: 'page' as const,
          name: 'Visualizer',
          url: '/docs/visualizer',
        },
        {
          type: 'page' as const,
          name: 'Inspector',
          url: '/docs/inspector',
        },
        {
          type: 'page' as const,
          name: 'Other tools',
          url: '/docs/developer-tools',
        },
      ],
    },
    {
      name: 'Stately Studio',
      type: 'folder' as const,
      children: [
        {
          type: 'page' as const,
          name: 'Introducing Stately Studio',
          url: '/docs/studio',
        },
        {
          type: 'page' as const,
          name: 'Stately Studio Pro',
          url: '/docs/studio-pro-plan',
        },
        {
          type: 'page' as const,
          name: 'Stately Studio Team',
          url: '/docs/studio-team-plan',
        },
        {
          type: 'page' as const,
          name: 'Stately Studio Enterprise',
          url: '/docs/studio-enterprise-plan',
        },
        {
          type: 'page' as const,
          name: 'Stately Studio Community',
          url: '/docs/studio-community-plan',
        },
        {
          type: 'page' as const,
          name: 'States and transitions',
          url: '/docs/editor-states-and-transitions',
        },
        {
          type: 'page' as const,
          name: 'Actions and actors',
          url: '/docs/editor-actions-and-actors',
        },
        {
          name: 'Design mode',
          type: 'folder' as const,
          children: [
            {
              type: 'page' as const,
              name: 'Design mode',
              url: '/docs/design-mode',
            },
            {
              type: 'page' as const,
              name: 'Generate with AI',
              url: '/docs/generate-flow',
            },
            {
              type: 'page' as const,
              name: 'Generate React app',
              url: '/docs/generate-react',
            },
            {
              type: 'page' as const,
              name: 'Colors',
              url: '/docs/colors',
            },
            {
              type: 'page' as const,
              name: 'Notes',
              url: '/docs/annotations',
            },
            {
              type: 'page' as const,
              name: 'Descriptions',
              url: '/docs/descriptions',
            },
            {
              type: 'page' as const,
              name: 'Embed Figma',
              url: '/docs/figma',
            },
            {
              type: 'page' as const,
              name: 'Assets',
              url: '/docs/assets',
            },
            {
              type: 'page' as const,
              name: 'Tags',
              url: '/docs/editor-tags',
            },
            {
              type: 'page' as const,
              name: 'Machine restore',
              url: '/docs/machine-restore',
            },
            {
              type: 'page' as const,
              name: 'Autolayout',
              url: '/docs/autolayout',
            },
          ],
        },
        {
          name: 'Simulate mode',
          type: 'folder' as const,
          children: [
            {
              type: 'page' as const,
              name: 'Simulate mode',
              url: '/docs/simulate-mode',
            },
            {
              type: 'page' as const,
              name: 'Live simulation',
              url: '/docs/live-simulation',
            },
          ],
        },
        {
          name: 'Code',
          type: 'folder' as const,
          children: [
            {
              type: 'page' as const,
              name: 'Import from code',
              url: '/docs/import-from-code',
            },
            {
              type: 'page' as const,
              name: 'Connect GitHub repo',
              url: '/docs/import-from-github',
            },
            {
              type: 'page' as const,
              name: 'Generate test paths',
              url: '/docs/generate-test-paths',
            },
            {
              type: 'page' as const,
              name: 'Sources',
              url: '/docs/sources',
            },
            {
              type: 'page' as const,
              name: 'Export as code',
              url: '/docs/export-as-code',
            },
          ],
        },
        {
          type: 'page' as const,
          name: 'Projects',
          url: '/docs/projects',
        },
        {
          name: 'Stately Sky',
          type: 'folder' as const,
          children: [
            {
              type: 'page' as const,
              name: 'Getting started',
              url: '/docs/stately-sky-getting-started',
            },
          ],
        },
        {
          type: 'page' as const,
          name: 'Teams',
          url: '/docs/teams',
        },
        {
          type: 'page' as const,
          name: 'Discover',
          url: '/docs/discover',
        },
        {
          name: 'Share',
          type: 'folder' as const,
          children: [
            {
              type: 'page' as const,
              name: 'Embed URL',
              url: '/docs/embed',
            },
            {
              type: 'page' as const,
              name: 'Image URL',
              url: '/docs/image',
            },
            {
              type: 'page' as const,
              name: 'Share URL',
              url: '/docs/url',
            },
          ],
        },
        {
          name: 'Accounts',
          type: 'folder' as const,
          children: [
            {
              type: 'page' as const,
              name: 'Sign up',
              url: '/docs/sign-up',
            },
            {
              type: 'page' as const,
              name: 'Upgrade',
              url: '/docs/upgrade',
            },
          ],
        },
        {
          type: 'page' as const,
          name: 'Version history',
          url: '/docs/versions',
        },
        {
          type: 'page' as const,
          name: 'Lock machines',
          url: '/docs/lock-machines',
        },
        {
          type: 'page' as const,
          name: 'Keyboard shortcuts',
          url: '/docs/keyboard-shortcuts',
        },
        {
          type: 'page' as const,
          name: 'Canvas view controls',
          url: '/docs/canvas-view-controls',
        },
        {
          type: 'page' as const,
          name: 'User preferences',
          url: '/docs/user-preferences',
        },
        {
          type: 'page' as const,
          name: 'Studio API',
          url: '/docs/studio-api',
        },
      ],
    },
    {
      name: 'Glossary',
      type: 'page' as const,
      url: '/docs/glossary',
    },
  ],
};

export default function Layout({ children }: LayoutProps<'/docs'>) {
  return (
    <DocsLayout tree={tree} {...baseOptions()}>
      {children}
      <AISearchPanel />
    </DocsLayout>
  );
}
