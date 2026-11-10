import { createMDX } from 'fumadocs-mdx/next';
import { blogAliases } from './lib/blog-aliases.mjs';
import { getXStateV5Path, xstateV5Slugs } from './lib/xstate-v5-routes.mjs';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'stately.ai',
      },
      {
        protocol: 'https',
        hostname: 'cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: '*.amazonaws.com',
      },
    ],
  },
  serverExternalPackages: ['typescript', 'twoslash'],
  async redirects() {
    return [
      {
        source: '/docs/xstate/basics/what-is-a-statechart',
        destination: '/docs/statecharts',
        permanent: true,
      },
      ...xstateV5Slugs.flatMap((slug) => {
        const destination = getXStateV5Path(slug);
        return [
          { source: `/docs/${slug}`, destination, permanent: true },
          {
            source: `/docs/${slug}.mdx`,
            destination: `${destination}.mdx`,
            permanent: true,
          },
          {
            source: `/llms.mdx/${slug}`,
            destination: `/llms.mdx/${destination.slice('/docs/'.length)}`,
            permanent: true,
          },
        ];
      }),
      ...blogAliases.map((alias) => ({ ...alias, permanent: true })),
      {
        source: '/docs/privacy',
        destination: '/privacy',
        permanent: true,
      },
      {
        source: '/docs/xstate-graph',
        destination: '/docs/xstate/v5/graph',
        permanent: true,
      },
      {
        source: '/docs/mcp',
        destination: '/docs/packages/mcp',
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
