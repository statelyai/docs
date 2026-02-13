import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';

export default function Layout({ children }: LayoutProps<'/docs'>) {
  return (
    <DocsLayout
      tree={{
        name: 'docs',
        children: [
          {
            name: 'Get Started',
            type: 'folder',
            children: [
              {
                type: 'page',
                name: 'Quick start',
                url: '/docs/quick-start',
              },
              {
                type: 'page',
                name: 'Install XState',
                url: '/docs/installation',
              },
              {
                type: 'page',
                name: 'Migrate to XState v5',
                url: '/docs/migration',
              },
              {
                type: 'page',
                name: 'Examples',
                url: '/docs/examples',
              },
              {
                type: 'page',
                name: 'Templates',
                url: '/docs/templates',
              },
              {
                type: 'page',
                name: 'Cheatsheet',
                url: '/docs/cheatsheet',
              },
              {
                type: 'page',
                name: 'Typescript',
                url: '/docs/typescript',
              },
              {
                type: 'page',
                name: 'API',
                url: 'https://www.jsdocs.io/package/xstate',
              },
            ],
          },
          {
            name: 'Core Concepts',
            type: 'folder',
            children: [
              {
                type: 'page',
                name: 'State machines and statecharts',
                url: '/docs/state-machines-and-statecharts',
              },
              {
                type: 'page',
                name: 'Actor model',
                url: '/docs/actor-model',
              },
              {
                type: 'page',
                name: 'What is XState?',
                url: '/docs/xstate',
              },
            ],
          },
          {
            name: 'State Machines',
            type: 'folder',
            children: [
              {
                type: 'page',
                name: 'State machines',
                url: '/docs/machines',
              },
              {
                type: 'page',
                name: 'Setup',
                url: '/docs/setup',
              },
              {
                type: 'page',
                name: 'States',
                url: '/docs/states',
              },
              {
                type: 'page',
                name: 'Context',
                url: '/docs/context',
              },
              {
                type: 'page',
                name: 'Input',
                url: '/docs/input',
              },
              {
                type: 'page',
                name: 'Output',
                url: '/docs/output',
              },
              {
                type: 'page',
                name: 'Events and transitions',
                url: '/docs/transitions',
              },
              {
                type: 'page',
                name: 'Routes',
                url: '/docs/routes',
              },
              {
                type: 'page',
                name: 'Pure transition functions',
                url: '/docs/pure-transitions',
              },
              {
                type: 'page',
                name: 'Eventless transitions',
                url: '/docs/eventless-transitions',
              },
              {
                type: 'page',
                name: 'Delayed transitions',
                url: '/docs/delayed-transitions',
              },
              {
                type: 'page',
                name: 'Actions',
                url: '/docs/actions',
              },
              {
                type: 'page',
                name: 'Guards',
                url: '/docs/guards',
              },
              {
                type: 'page',
                name: 'Initial states',
                url: '/docs/initial-states',
              },
              {
                type: 'page',
                name: 'Finite states',
                url: '/docs/finite-states',
              },
              {
                type: 'page',
                name: 'Parent states',
                url: '/docs/parent-states',
              },
              {
                type: 'page',
                name: 'Parallel states',
                url: '/docs/parallel-states',
              },
              {
                type: 'page',
                name: 'Final states',
                url: '/docs/final-states',
              },
              {
                type: 'page',
                name: 'History states',
                url: '/docs/history-states',
              },
              {
                type: 'page',
                name: 'Persistence',
                url: '/docs/persistence',
              },
              {
                type: 'page',
                name: 'Tags',
                url: '/docs/tags',
              },
              {
                type: 'page',
                name: 'Event emitter',
                url: '/docs/event-emitter',
              },
            ],
          },
          {
            name: 'Actors',
            type: 'folder',
            children: [
              {
                type: 'page',
                name: 'Actors',
                url: '/docs/actors',
              },
              {
                type: 'page',
                name: 'State machine actors',
                url: '/docs/state-machine-actors',
              },
              {
                type: 'page',
                name: 'Promise actors',
                url: '/docs/promise-actors',
              },
              {
                type: 'page',
                name: 'Transition actors',
                url: '/docs/transition-actors',
              },
              {
                type: 'page',
                name: 'Callback actors',
                url: '/docs/callback-actors',
              },
              {
                type: 'page',
                name: 'Observable actors',
                url: '/docs/observable-actors',
              },
              {
                type: 'page',
                name: 'Invoke',
                url: '/docs/invoke',
              },
              {
                type: 'page',
                name: 'Spawn',
                url: '/docs/spawn',
              },
              {
                type: 'page',
                name: 'System',
                url: '/docs/system',
              },
              {
                type: 'page',
                name: 'Inspection',
                url: '/docs/inspection',
              },
            ],
          },
          {
            name: 'Guides',
            type: 'folder',
            children: [
              {
                type: 'page',
                name: 'Graph utilities',
                url: '/docs/graph',
              },
              {
                type: 'page',
                name: 'Testing',
                url: '/docs/testing',
              },
              {
                type: 'page',
                name: 'Immer',
                url: '/docs/immer',
              },

            ],
          },
          {
            name: 'Packages',
            type: 'folder',
            children: [
              {
                name: 'XState Store',
                type: 'folder',
                index: {
                  type: 'page',
                  name: 'Overview',
                  url: '/docs/xstate-store',
                },
                children: [
                  {
                    type: 'page',
                    name: 'Vanilla',
                    url: '/docs/xstate-store',
                  },
                  {
                    type: 'page',
                    name: 'React',
                    url: '/docs/xstate-store/react',
                  },
                  {
                    type: 'page',
                    name: 'Vue',
                    url: '/docs/xstate-store/vue',
                  },
                  {
                    type: 'page',
                    name: 'Svelte',
                    url: '/docs/xstate-store/svelte',
                  },
                  {
                    type: 'page',
                    name: 'Solid',
                    url: '/docs/xstate-store/solid',
                  },
                  {
                    type: 'page',
                    name: 'Angular',
                    url: '/docs/xstate-store/angular',
                  },
                  {
                    type: 'page',
                    name: 'Preact',
                    url: '/docs/xstate-store/preact',
                  },
                ],
              },
              {
                type: 'page',
                name: 'XState React',
                url: '/docs/xstate-react',
              },
              {
                type: 'page',
                name: 'XState Vue',
                url: '/docs/xstate-vue',
              },
              {
                type: 'page',
                name: 'XState Svelte',
                url: '/docs/xstate-svelte',
              },
              {
                type: 'page',
                name: 'XState Graph',
                url: '/docs/xstate-graph',
              },
              {
                type: 'page',
                name: 'XState Test',
                url: '/docs/xstate-test',
              },
            ],
          },
          {
            name: 'Developer Tools',
            type: 'folder',
            children: [
              {
                type: 'page',
                name: 'XState VS Code extension',
                url: '/docs/xstate-vscode-extension',
              },
              {
                type: 'page',
                name: 'Visualizer',
                url: '/docs/visualizer',
              },
              {
                type: 'page',
                name: 'Inspector',
                url: '/docs/inspector',
              },
              {
                type: 'page',
                name: 'Other tools',
                url: '/docs/developer-tools',
              },
            ],
          },
          {
            name: 'Stately Studio',
            type: 'folder',
            children: [
              {
                type: 'page',
                name: 'Introducing Stately Studio',
                url: '/docs/studio',
              },
              {
                type: 'page',
                name: 'Stately Studio Pro',
                url: '/docs/studio-pro-plan',
              },
              {
                type: 'page',
                name: 'Stately Studio Team',
                url: '/docs/studio-team-plan',
              },
              {
                type: 'page',
                name: 'Stately Studio Enterprise',
                url: '/docs/studio-enterprise-plan',
              },
              {
                type: 'page',
                name: 'Stately Studio Community',
                url: '/docs/studio-community-plan',
              },
              {
                type: 'page',
                name: 'States and transitions',
                url: '/docs/editor-states-and-transitions',
              },
              {
                type: 'page',
                name: 'Actions and actors',
                url: '/docs/editor-actions-and-actors',
              },
              {
                name: 'Design mode',
                type: 'folder',
                children: [
                  {
                    type: 'page',
                    name: 'Design mode',
                    url: '/docs/design-mode',
                  },
                  {
                    type: 'page',
                    name: 'Generate with AI',
                    url: '/docs/generate-flow',
                  },
                  {
                    type: 'page',
                    name: 'Generate React app',
                    url: '/docs/generate-react',
                  },
                  {
                    type: 'page',
                    name: 'Colors',
                    url: '/docs/colors',
                  },
                  {
                    type: 'page',
                    name: 'Notes',
                    url: '/docs/annotations',
                  },
                  {
                    type: 'page',
                    name: 'Descriptions',
                    url: '/docs/descriptions',
                  },
                  {
                    type: 'page',
                    name: 'Embed Figma',
                    url: '/docs/figma',
                  },
                  {
                    type: 'page',
                    name: 'Assets',
                    url: '/docs/assets',
                  },
                  {
                    type: 'page',
                    name: 'Tags',
                    url: '/docs/editor-tags',
                  },
                  {
                    type: 'page',
                    name: 'Machine restore',
                    url: '/docs/machine-restore',
                  },
                  {
                    type: 'page',
                    name: 'Autolayout',
                    url: '/docs/autolayout',
                  },
                ],
              },
              {
                name: 'Simulate mode',
                type: 'folder',
                children: [
                  {
                    type: 'page',
                    name: 'Simulate mode',
                    url: '/docs/simulate-mode',
                  },
                  {
                    type: 'page',
                    name: 'Live simulation',
                    url: '/docs/live-simulation',
                  },
                ],
              },
              {
                name: 'Code',
                type: 'folder',
                children: [
                  {
                    type: 'page',
                    name: 'Import from code',
                    url: '/docs/import-from-code',
                  },
                  {
                    type: 'page',
                    name: 'Connect GitHub repo',
                    url: '/docs/import-from-github',
                  },
                  {
                    type: 'page',
                    name: 'Generate test paths',
                    url: '/docs/generate-test-paths',
                  },
                  {
                    type: 'page',
                    name: 'Sources',
                    url: '/docs/sources',
                  },
                  {
                    type: 'page',
                    name: 'Export as code',
                    url: '/docs/export-as-code',
                  },
                ],
              },
              {
                type: 'page',
                name: 'Projects',
                url: '/docs/projects',
              },
              {
                name: 'Stately Sky',
                type: 'folder',
                children: [
                  {
                    type: 'page',
                    name: 'Getting started',
                    url: '/docs/stately-sky-getting-started',
                  },
                ],
              },
              {
                type: 'page',
                name: 'Teams',
                url: '/docs/teams',
              },
              {
                type: 'page',
                name: 'Discover',
                url: '/docs/discover',
              },
              {
                name: 'Share',
                type: 'folder',
                children: [
                  {
                    type: 'page',
                    name: 'Embed URL',
                    url: '/docs/embed',
                  },
                  {
                    type: 'page',
                    name: 'Image URL',
                    url: '/docs/image',
                  },
                  {
                    type: 'page',
                    name: 'Share URL',
                    url: '/docs/url',
                  },
                ],
              },
              {
                name: 'Accounts',
                type: 'folder',
                children: [
                  {
                    type: 'page',
                    name: 'Sign up',
                    url: '/docs/sign-up',
                  },
                  {
                    type: 'page',
                    name: 'Upgrade',
                    url: '/docs/upgrade',
                  },
                ],
              },
              {
                type: 'page',
                name: 'Version history',
                url: '/docs/versions',
              },
              {
                type: 'page',
                name: 'Lock machines',
                url: '/docs/lock-machines',
              },
              {
                type: 'page',
                name: 'Keyboard shortcuts',
                url: '/docs/keyboard-shortcuts',
              },
              {
                type: 'page',
                name: 'Canvas view controls',
                url: '/docs/canvas-view-controls',
              },
              {
                type: 'page',
                name: 'User preferences',
                url: '/docs/user-preferences',
              },
              {
                type: 'page',
                name: 'Studio API',
                url: '/docs/studio-api',
              },
            ],
          },
          {
            name: 'Glossary',
            type: 'page',
            url: '/docs/glossary',
          },
        ],
      }}
      {...baseOptions()}
    >
      {children}
    </DocsLayout>
  );
}
