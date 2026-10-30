import { createMDX } from 'fumadocs-mdx/next';
import { blogAliases } from './lib/blog-aliases.mjs';

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
      ...blogAliases.map((alias) => ({ ...alias, permanent: true })),
      {
        source: '/docs/privacy',
        destination: '/privacy',
        permanent: true,
      },
      {
        source: '/docs/xstate-graph',
        destination: '/docs/graph',
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
