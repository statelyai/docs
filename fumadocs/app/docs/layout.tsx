import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';
import { source } from '@/lib/source';

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
                name: 'XState',
                url: '/docs/xstate',
              },
              {
                type: 'page',
                name: 'Actor model',
                url: '/docs/actor-model',
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
                name: 'States',
                url: '/docs/states',
              },
              {
                type: 'page',
                name: 'Finite states',
                url: '/docs/finite-states',
              },
              {
                type: 'page',
                name: 'Initial states',
                url: '/docs/initial-states',
              },
              {
                type: 'page',
                name: 'Final states',
                url: '/docs/final-states',
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
                name: 'History states',
                url: '/docs/history-states',
              },
              {
                type: 'page',
                name: 'Transitions',
                url: '/docs/transitions',
              },
              {
                type: 'page',
                name: 'Delayed transitions',
                url: '/docs/delayed-transitions',
              },
              {
                type: 'page',
                name: 'Eventless transitions',
                url: '/docs/eventless-transitions',
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
                name: 'Setup',
                url: '/docs/setup',
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
                name: 'Inspection',
                url: '/docs/inspection',
              },
              {
                type: 'page',
                name: 'System',
                url: '/docs/system',
              },
            ],
          },
          {
            name: 'Developer Tools',
            type: 'folder',
            children: [
              {
                type: 'page',
                name: 'Developer tools',
                url: '/docs/developer-tools',
              },
              {
                type: 'page',
                name: 'Inspector',
                url: '/docs/inspector',
              },
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
            ],
          },
          {
            name: 'Stately Studio',
            type: 'folder',
            children: [
              {
                type: 'page',
                name: 'Studio',
                url: '/docs/studio',
              },
            ],
          },
        ],
      }}
      {...baseOptions()}
    >
      {children}
    </DocsLayout>
  );
}
