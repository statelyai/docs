// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion
require('dotenv').config();

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Stately Docs',
  tagline:
    'Documentation for Stately: state machines and statecharts for the modern web',
  url: 'https://stately-docs.vercel.app',
  baseUrl: '/docs/',
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'icon.svg',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'statelyai', // Usually your GitHub org/user name.
  projectName: 'docusaurus-docs', // Usually your repo name.

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars.js'),

          // Remove this to remove the "edit this page" links.
          editUrl: 'https://github.com/statelyai/tree/main/docusaurus-docs/',
          admonitions: {
            tag: ':::',
            keywords: [
              'note',
              'tip',
              'info',
              'caution',
              'danger',
              'typescript',
              'xstate',
              'studio',
            ],
          },
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
    [
      'docusaurus-preset-shiki-twoslash',
      {
        alwayRaiseForTwoslashExceptions: true,
        themes: ['github-light', 'github-dark'],
      },
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: '',
        logo: {
          alt: 'Stately',
          src: '/logo-black.svg',
          srcDark: '/logo-white-nobg.svg',
        },
        items: [
          {
            type: 'search',
            position: 'left',
          },
          {
            href: 'https://github.com/statelyai/docusaurus-docs',
            label: 'GitHub',
            position: 'right',
          },
          {
            href: 'https://stately.ai/editor',
            label: 'Editor',
            position: 'right',
          },
          {
            href: 'https://stately.ai/viz',
            label: 'Visualizer',
            position: 'right',
          },
          {
            href: 'https://stately.ai/blog',
            label: 'Blog',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'light',
        links: [
          {
            title: 'Stately',
            items: [
              {
                label: 'Visual editor',
                href: 'https://stately.ai/editor',
                target: '_self',
              },
              {
                label: 'VS Code extension',
                href: 'https://marketplace.visualstudio.com/items?itemName=statelyai.stately-vscode',
                target: '_self',
              },
              {
                label: 'Visualizer',
                href: 'https://stately.ai/viz',
                target: '_self',
              },
              {
                label: 'Discover machines',
                href: 'https://stately.ai/discover',
                target: '_self',
              },
            ],
          },
          {
            title: 'Find out more',
            items: [
              {
                label: 'Stately blog',
                href: 'https://stately.ai/blog',
                target: '_self',
              },
              {
                label: 'Roadmap',
                href: 'https://statelyai.canny.io',
                target: '_self',
              },
              {
                label: 'Stately RFCs',
                href: 'https://github.com/statelyai/rfcs',
                target: '_self',
              },
              {
                label: 'Code of conduct',
                href: 'https://stately.ai/code-of-conduct',
                target: '_self',
              },
              {
                label: 'Privacy policy',
                href: 'https://stately.ai/privacy',
                target: '_self',
              },
            ],
          },
          {
            title: 'Stay updated',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/statelyai/xstate',
                target: '_self',
              },
              {
                label: 'Discord',
                href: 'https://discord.gg/xstate',
                target: '_self',
              },
              {
                label: 'Twitter',
                href: 'https://twitter.com/statelyai',
                target: '_self',
              },
              {
                label: 'YouTube',
                href: 'https://youtube.com/c/statelyai',
                target: '_self',
              },
              {
                label: 'LinkedIn',
                href: 'https://www.linkedin.com/company/statelyai/',
                target: '_self',
              },
            ],
          },
        ],
        copyright: `Copyright © Stately, ${new Date().getFullYear()}`,
      },
      algolia: {
        appId: process.env.ALGOLIA_APP_ID,
        apiKey: process.env.ALGOLIA_API_KEY,
        indexName: process.env.ALGOLIA_INDEX,
        contextualSearch: false,
      },
      announcementBar: {
        content:
          '<strong>👋 Welcome!</strong> These docs are in beta, please give us any feedback in our <a href="https://discord.com/channels/795785288994652170/838444044774277151">Discord Documentation channel</a>.',
        isCloseable: false,
      },
      colorMode: {
        disableSwitch: false,
        respectPrefersColorScheme: true,
      },
    }),
};

module.exports = config;
