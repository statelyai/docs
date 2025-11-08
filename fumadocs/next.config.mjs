import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  images: {
    domains: ['stately.ai', 'cloudinary.com', 'amazonaws.com'],
  },
  serverExternalPackages: ['typescript', 'twoslash'],
  async redirects() {
    return [
      {
        source: '/docs/state-machines-and-statecharts',
        destination: '/docs/core-concepts/state-machines-and-statecharts',
        permanent: true,
      },
      {
        source: '/docs/actions',
        destination: '/docs/state-machines/actions',
        permanent: true,
      },
      {
        source: '/docs/actors',
        destination: '/docs/actors/actors',
        permanent: true,
      },
      {
        source: '/docs/context',
        destination: '/docs/state-machines/context',
        permanent: true,
      },
      {
        source: '/docs/delayed-transitions',
        destination: '/docs/state-machines/delayed-transitions',
        permanent: true,
      },
      {
        source: '/docs/eventless-transitions',
        destination: '/docs/state-machines/eventless-transitions',
        permanent: true,
      },
      {
        source: '/docs/final-states',
        destination: '/docs/state-machines/final-states',
        permanent: true,
      },
      {
        source: '/docs/guards',
        destination: '/docs/state-machines/guards',
        permanent: true,
      },
      {
        source: '/docs/history-states',
        destination: '/docs/state-machines/history-states',
        permanent: true,
      },
      {
        source: '/docs/initial-states',
        destination: '/docs/state-machines/initial-states',
        permanent: true,
      },
      {
        source: '/docs/parallel-states',
        destination: '/docs/state-machines/parallel-states',
        permanent: true,
      },
      {
        source: '/docs/parent-states',
        destination: '/docs/state-machines/parent-states',
        permanent: true,
      },
      {
        source: '/docs/states',
        destination: '/docs/state-machines/states',
        permanent: true,
      },
      {
        source: '/docs/transitions',
        destination: '/docs/state-machines/transitions',
        permanent: true,
      },
      {
        source: '/docs/studio',
        destination: '/docs/stately-studio/studio',
        permanent: true,
      },
      {
        source: '/docs/xstate',
        destination: '/docs/core-concepts/xstate',
        permanent: true,
      },
      {
        source: '/docs/machines',
        destination: '/docs/state-machines/machines',
        permanent: true,
      },
      {
        source: '/docs/invoke',
        destination: '/docs/actors/invoke',
        permanent: true,
      },
      {
        source: '/docs/spawn',
        destination: '/docs/actors/spawn',
        permanent: true,
      },
      {
        source: '/docs/input',
        destination: '/docs/state-machines/input',
        permanent: true,
      },
      {
        source: '/docs/output',
        destination: '/docs/state-machines/output',
        permanent: true,
      },
      {
        source: '/docs/persistence',
        destination: '/docs/state-machines/persistence',
        permanent: true,
      },
      {
        source: '/docs/inspection',
        destination: '/docs/actors/inspection',
        permanent: true,
      },
      {
        source: '/docs/inspector',
        destination: '/docs/developer-tools/inspector',
        permanent: true,
      },
      {
        source: '/docs/system',
        destination: '/docs/actors/system',
        permanent: true,
      },
      {
        source: '/docs/migration',
        destination: '/docs/get-started/migration',
        permanent: true,
      },
      {
        source: '/docs/typescript',
        destination: '/docs/get-started/typescript',
        permanent: true,
      },
      {
        source: '/docs/actor-model',
        destination: '/docs/core-concepts/actor-model',
        permanent: true,
      },
      {
        source: '/docs/finite-states',
        destination: '/docs/state-machines/finite-states',
        permanent: true,
      },
      {
        source: '/docs/tags',
        destination: '/docs/state-machines/tags',
        permanent: true,
      },
      {
        source: '/docs/setup',
        destination: '/docs/state-machines/setup',
        permanent: true,
      },
      {
        source: '/docs/cheatsheet',
        destination: '/docs/get-started/cheatsheet',
        permanent: true,
      },
      {
        source: '/docs/installation',
        destination: '/docs/get-started/installation',
        permanent: true,
      },
      {
        source: '/docs/developer-tools',
        destination: '/docs/developer-tools/developer-tools',
        permanent: true,
      },
      {
        source: '/docs/xstate-vscode-extension',
        destination: '/docs/developer-tools/xstate-vscode-extension',
        permanent: true,
      },
      {
        source: '/docs/visualizer',
        destination: '/docs/developer-tools/visualizer',
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/docs/:path*.mdx',
        destination: '/llms.mdx/:path*',
      },
    ];
  },
};

export default withMDX(config);
