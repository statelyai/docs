// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion
require('dotenv').config();
const a11yEmoji = require('@fec/remark-a11y-emoji');
const { themes } = require('prism-react-renderer');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Stately',
  tagline:
    'Stately’s documentation and blog: state machines and statecharts for the modern web',
  url: 'https://stately.ai',
  baseUrl: '/',
  baseUrlIssueBanner: false,
  onBrokenAnchors: 'warn',
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'icon.svg',
  staticDirectories: ['static'],

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'statelyai', // Usually your GitHub org/user name.
  projectName: 'docs', // Usually your repo name.

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  scripts: [
    {
      src: 'https://plausible.io/js/script.tagged-events.js',
      defer: true,
      'data-domain': 'stately.ai',
    },
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/docs',
          sidebarPath: require.resolve('./sidebars.js'),

          // Remove this to remove the "edit this page" links.
          editUrl: 'https://github.com/statelyai/docs/tree/main/',

          lastVersion: 'current',
          includeCurrentVersion: true,
          versions: {
            current: {
              label: 'XState v5',
              banner: 'none',
            },
            4: {
              label: 'XState v4',
              path: 'xstate-v4',
              banner: 'none',
            },
          },

          // Different types of admonitions/“tip boxes” available for our use.
          admonitions: {
            keywords: [
              'note',
              'tip',
              'info',
              'warning',
              'danger',
              'typescript',
              'xstate',
              'warningxstate',
              'breakingchange',
              'studio',
              'new',
              'video',
            ],
          },

          // Add accessible emoji remark plugin
          remarkPlugins: [
            a11yEmoji,
            [require('@docusaurus/remark-plugin-npm2yarn'), { sync: true }],
          ],
        },
        blog: {
          blogTitle: 'Stately Blog',
          blogDescription: 'Stately’s engineering blog',
          blogSidebarCount: 0,
          postsPerPage: 10,
          editUrl: ({ locale, blogDirPath, blogPath, permalink }) =>
            `https://github.com/statelyai/docs/edit/main/${blogDirPath}/${blogPath}`,
          remarkPlugins: [
            [require('@docusaurus/remark-plugin-npm2yarn'), { sync: true }],
          ],
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],

  plugins: [
    [
      '@docusaurus/plugin-client-redirects',
      {
        // Unbreak specific pages we know are broken where the structure changed between XState v4 and v5
        redirects: [
          {
            to: '/docs/xstate-v4/xstate/model-based-testing/intro',
            from: '/docs/category/xstate-model-based-testing',
          },
          {
            to: '/docs/xstate-v4/xstate/actors/parent-child-communication',
            from: '/docs/xstate/actors/parent-child-communication',
          },
          {
            to: '/docs/xstate-v4/xstate/typescript/type-helpers',
            from: '/docs/xstate/typescript/type-helpers',
          },
          {
            to: '/docs/states',
            from: '/docs/states/intro',
          },
          {
            to: '/docs/state-machines-and-statecharts',
            from: '/docs/xstate/basics/what-is-a-statechart',
          },
          {
            to: '/docs/typegen',
            from: '/docs/xstate/typescript/typegen',
          },
          {
            // Redirect to the new "Getting Started" page from the Sky category page (until we have a Sky category page)
            to: '/docs/stately-sky-getting-started',
            from: '/docs/sky',
          },
        ],
        createRedirects(existingPath) {
          if (existingPath.includes('/docs')) {
            // Redirect everything from /docs/xstate-v5 to /docs (to unbreak Google search results)
            return [existingPath.replace('/docs', '/docs/xstate-v5')];
          }
          return undefined; // Return a falsy value: no redirect created
        },
      },
    ],
    async function tailwindPlugin(context, options) {
      return {
        name: 'docusaurus-tailwindcss',
        configurePostCss(postcssOptions) {
          // Appends TailwindCSS and AutoPrefixer.
          postcssOptions.plugins.push(require('tailwindcss'));
          postcssOptions.plugins.push(require('autoprefixer'));
          return postcssOptions;
        },
      };
    },
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'static/docs-default.png',
      docs: {
        sidebar: {
          hideable: true,
        },
      },
      navbar: {
        title: '',
        logo: {
          alt: 'Stately',
          src: '/logo-black.svg',
          srcDark: '/logo-white-nobg.svg',
          href: '/docs',
        },
        items: [
          {
            type: 'search',
            position: 'right',
          },
          { to: '/docs', label: 'Docs', position: 'right' },
          {
            href: 'https://tsdocs.dev/docs/xstate',
            label: 'API',
            position: 'right',
            className: 'plausible-event-name=docs+api',
          },
          {
            href: 'https://stately.ai/registry/projects',
            label: 'Studio',
            position: 'right',
            className: 'plausible-event-name=docs+studio',
          },
          {
            href: 'https://stately.ai/editor',
            label: 'Editor',
            position: 'right',
            className: 'plausible-event-name=docs+editor',
          },
          {
            href: 'https://stately.ai/registry/discover',
            label: 'Discover',
            position: 'right',
            className: 'plausible-event-name=docs+discover',
          },
          { to: 'blog', label: 'Blog', position: 'right' },
          {
            type: 'docsVersionDropdown',
            position: 'right',
          },
          {
            type: 'html',
            position: 'right',
            value:
              '<a class="navbar__link navbar__icon" href="https://github.com/statelyai/xstate"><svg alt="XState GitHub repository" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 22V18C15.1392 16.7473 14.78 15.4901 14 14.5C17 14.5 20 12.5 20 9C20.08 7.75 19.73 6.52 19 5.5C19.28 4.35 19.28 3.15 19 2C19 2 18 2 16 3.5C13.36 3 10.64 3 8.00004 3.5C6.00004 2 5.00004 2 5.00004 2C4.70004 3.15 4.70004 4.35 5.00004 5.5C4.27191 6.51588 3.91851 7.75279 4.00004 9C4.00004 12.5 7.00004 14.5 10 14.5C9.61004 14.99 9.32004 15.55 9.15004 16.15C8.98004 16.75 8.93004 17.38 9.00004 18V22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 18C4.49 20 4 16 2 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></a>',
          },
        ],
      },
      footer: {
        style: 'light',
        links: [
          {
            label: 'Changelog',
            href: 'https://stately.ai/blog/tags/changelog',
            target: '_self',
          },
          {
            label: 'Roadmap',
            href: 'https://feedback.stately.ai',
            target: '_self',
          },
          {
            label: 'Code of conduct',
            href: '/code-of-conduct',
            target: '_self',
          },
          {
            label: 'Privacy policy',
            href: '/privacy',
            target: '_self',
          },
          {
            html: '<a href="https://github.com/statelyai/xstate"><svg alt="GitHub" viewBox="0 0 24 24" width="24" height="24"><g fill-rule="evenodd" fill="currentColor"><path d="M12,0.296c-6.627,0-12,5.372-12,12c0,5.302,3.438,9.8,8.206,11.387 c0.6,0.111,0.82-0.26,0.82-0.577c0-0.286-0.011-1.231-0.016-2.234c-3.338,0.726-4.043-1.416-4.043-1.416 C4.421,18.069,3.635,17.7,3.635,17.7c-1.089-0.745,0.082-0.729,0.082-0.729c1.205,0.085,1.839,1.237,1.839,1.237 c1.07,1.834,2.807,1.304,3.492,0.997C9.156,18.429,9.467,17.9,9.81,17.6c-2.665-0.303-5.467-1.332-5.467-5.93 c0-1.31,0.469-2.381,1.237-3.221C5.455,8.146,5.044,6.926,5.696,5.273c0,0,1.008-0.322,3.301,1.23 C9.954,6.237,10.98,6.104,12,6.099c1.02,0.005,2.047,0.138,3.006,0.404c2.29-1.553,3.297-1.23,3.297-1.23 c0.653,1.653,0.242,2.873,0.118,3.176c0.769,0.84,1.235,1.911,1.235,3.221c0,4.609-2.807,5.624-5.479,5.921 c0.43,0.372,0.814,1.103,0.814,2.222c0,1.606-0.014,2.898-0.014,3.293c0,0.319,0.216,0.694,0.824,0.576 c4.766-1.589,8.2-6.085,8.2-11.385C24,5.669,18.627,0.296,12,0.296z"/><path d="M4.545,17.526c-0.026,0.06-0.12,0.078-0.206,0.037c-0.087-0.039-0.136-0.121-0.108-0.18 c0.026-0.061,0.12-0.078,0.207-0.037C4.525,17.384,4.575,17.466,4.545,17.526L4.545,17.526z"/><path d="M5.031,18.068c-0.057,0.053-0.169,0.028-0.245-0.055c-0.079-0.084-0.093-0.196-0.035-0.249 c0.059-0.053,0.167-0.028,0.246,0.056C5.076,17.903,5.091,18.014,5.031,18.068L5.031,18.068z"/><path d="M5.504,18.759c-0.074,0.051-0.194,0.003-0.268-0.103c-0.074-0.107-0.074-0.235,0.002-0.286 c0.074-0.051,0.193-0.005,0.268,0.101C5.579,18.579,5.579,18.707,5.504,18.759L5.504,18.759z"/><path d="M6.152,19.427c-0.066,0.073-0.206,0.053-0.308-0.046c-0.105-0.097-0.134-0.234-0.068-0.307 c0.067-0.073,0.208-0.052,0.311,0.046C6.191,19.217,6.222,19.355,6.152,19.427L6.152,19.427z"/><path d="M7.047,19.814c-0.029,0.094-0.164,0.137-0.3,0.097C6.611,19.87,6.522,19.76,6.55,19.665 c0.028-0.095,0.164-0.139,0.301-0.096C6.986,19.609,7.075,19.719,7.047,19.814L7.047,19.814z"/><path d="M8.029,19.886c0.003,0.099-0.112,0.181-0.255,0.183c-0.143,0.003-0.26-0.077-0.261-0.174c0-0.1,0.113-0.181,0.256-0.184 C7.912,19.708,8.029,19.788,8.029,19.886L8.029,19.886z"/><path d="M8.943,19.731c0.017,0.096-0.082,0.196-0.224,0.222c-0.139,0.026-0.268-0.034-0.286-0.13 c-0.017-0.099,0.084-0.198,0.223-0.224C8.797,19.574,8.925,19.632,8.943,19.731L8.943,19.731z"/></g></svg></a>',
          },
          {
            html: '<a href="https://discord.gg/xstate" class="plausible-event-name=docs+discord"><svg alt="Discord" viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M20.317,4.37c-1.53-0.702-3.17-1.219-4.885-1.515c-0.031-0.006-0.062,0.009-0.079,0.037 c-0.211,0.375-0.445,0.865-0.608,1.249c-1.845-0.276-3.68-0.276-5.487,0C9.095,3.748,8.852,3.267,8.641,2.892 C8.624,2.864,8.593,2.85,8.562,2.855C6.848,3.15,5.208,3.667,3.677,4.37C3.664,4.375,3.652,4.385,3.645,4.397 c-3.111,4.648-3.964,9.182-3.546,13.66c0.002,0.022,0.014,0.043,0.031,0.056c2.053,1.508,4.041,2.423,5.993,3.029 c0.031,0.01,0.064-0.002,0.084-0.028c0.462-0.63,0.873-1.295,1.226-1.994c0.021-0.041,0.001-0.09-0.042-0.106 c-0.653-0.248-1.274-0.55-1.872-0.892c-0.047-0.028-0.051-0.095-0.008-0.128c0.126-0.094,0.252-0.192,0.372-0.291 c0.022-0.018,0.052-0.022,0.078-0.01c3.928,1.793,8.18,1.793,12.061,0c0.026-0.012,0.056-0.009,0.079,0.01 c0.12,0.099,0.246,0.198,0.373,0.292c0.044,0.032,0.041,0.1-0.007,0.128c-0.598,0.349-1.219,0.645-1.873,0.891 c-0.043,0.016-0.061,0.066-0.041,0.107c0.36,0.698,0.772,1.363,1.225,1.993c0.019,0.027,0.053,0.038,0.084,0.029 c1.961-0.607,3.95-1.522,6.002-3.029c0.018-0.013,0.029-0.033,0.031-0.055c0.5-5.177-0.838-9.674-3.548-13.66 C20.342,4.385,20.33,4.375,20.317,4.37z M8.02,15.331c-1.183,0-2.157-1.086-2.157-2.419s0.955-2.419,2.157-2.419 c1.211,0,2.176,1.095,2.157,2.419C10.177,14.246,9.221,15.331,8.02,15.331z M15.995,15.331c-1.182,0-2.157-1.086-2.157-2.419 s0.955-2.419,2.157-2.419c1.211,0,2.176,1.095,2.157,2.419C18.152,14.246,17.206,15.331,15.995,15.331z"/></g></svg></a>',
          },
          {
            html: '<a href="https://social.stately.ai/@stately" rel="https://social.stately.ai/@stately"><svg alt="Mastodon" width="24px" height="24px" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="nonzero" d="M12.334 0c3.096.025 6.076.357 7.812 1.147 0 0 3.441 1.526 3.441 6.733v.077l.001.22c-.002.95-.045 3.988-.48 6.21-.333 1.694-2.975 3.547-6.009 3.906-1.582.187-3.14.359-4.801.283a28.44 28.44 0 0 1-4.86-.642c0 .262.016.511.049.745.333 2.505 2.401 2.79 4.467 2.876l.375.014c2.204.075 4.166-.538 4.166-.538l.09 1.974-.021.011c-.196.1-1.71.82-4.266.96-1.514.083-3.395-.037-5.585-.612-4.75-1.246-5.566-6.264-5.691-11.355-.039-1.512-.015-2.937-.015-4.13 0-4.763 2.88-6.445 3.371-6.697l.053-.026a.81.81 0 0 1 .018-.009C6.184.357 9.162.025 12.259 0h.075Zm3.5 4.068c-1.29 0-2.267.491-2.912 1.474l-.628 1.043-.628-1.043c-.645-.983-1.622-1.474-2.912-1.474-1.114 0-2.012.388-2.698 1.146-.665.757-.996 1.781-.996 3.07v6.303h2.52V8.47c0-1.29.548-1.945 1.643-1.945 1.211 0 1.818.777 1.818 2.313v3.349h2.506v-3.35c0-1.535.607-2.312 1.818-2.312 1.095 0 1.642.655 1.642 1.945v6.118h2.52V8.283c0-1.288-.33-2.312-.995-3.07-.686-.757-1.584-1.145-2.698-1.145Z"/></svg></a>',
          },
          {
            html: '<a href="https://twitter.com/statelyai"><svg alt="Twitter/X" viewBox="0 -2 24 24" width="23" height="23"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><path d="M12.2291176,8.89206683 L19.8787397,0 L18.0660241,0 L11.4238582,7.72085667 L6.11877981,0 L3.55271368e-15,0 L8.02231953,11.6753027 L3.55271368e-15,21 L1.81281832,21 L8.82711661,12.8465129 L14.429668,21 L20.5484479,21 L12.2286724,8.89206683 L12.2291176,8.89206683 Z M9.74621444,11.7781648 L8.93338634,10.6155679 L2.4660021,1.36466352 L5.25038528,1.36466352 L10.4696397,8.83043861 L11.2824678,9.99303554 L18.0668803,19.6973996 L15.2824971,19.6973996 L9.74621444,11.77861 L9.74621444,11.7781648 Z" fill="currentColor" fill-rule="nonzero"></path></g></svg></a>',
          },
          {
            html: '<a href="https://youtube.com/c/statelyai"><svg alt="YouTube" viewBox="0 0 24 24" width="24" height="24"><g fill="currentColor"><path d="M23.498,6.186c-0.276-1.039-1.089-1.858-2.122-2.136C19.505,3.546,12,3.546,12,3.546s-7.505,0-9.377,0.504 C1.591,4.328,0.778,5.146,0.502,6.186C0,8.07,0,12,0,12s0,3.93,0.502,5.814c0.276,1.039,1.089,1.858,2.122,2.136 C4.495,20.454,12,20.454,12,20.454s7.505,0,9.377-0.504c1.032-0.278,1.845-1.096,2.122-2.136C24,15.93,24,12,24,12 S24,8.07,23.498,6.186z M9.546,15.569V8.431L15.818,12L9.546,15.569z"/></g></svg></a>',
          },
          {
            html: '<a href="https://www.linkedin.com/company/statelyai/"><svg alt="LinkedIn" width="24px" height="24px" viewBox="0 0 24 24"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><path d="M19.0413443,19.0518556 L16.0777608,19.0518556 L16.0777608,14.4108464 C16.0777608,13.3040608 16.0580496,11.8799244 14.5363426,11.8799244 C12.9929532,11.8799244 12.7564185,13.0852661 12.7564185,14.3310159 L12.7564185,19.0518556 L9.79382053,19.0518556 L9.79382053,9.50767779 L12.6391366,9.50767779 L12.6391366,10.8115757 L12.6785591,10.8115757 C13.2590548,9.82010079 14.3372592,9.22777832 15.4854383,9.27015746 C18.4894299,9.27015746 19.0423299,11.2462083 19.0423299,13.8155672 L19.0413443,19.0518556 Z M6.44981028,8.20279433 C5.49972897,8.20279433 4.73000542,7.43307078 4.73000542,6.48298947 C4.73000542,5.53290816 5.49972897,4.76318461 6.44981028,4.76318461 C7.39989159,4.76318461 8.16961514,5.53290816 8.16961514,6.48298947 C8.16961514,7.43307078 7.39989159,8.20279433 6.44981028,8.20279433 L6.44981028,8.20279433 M7.93110925,19.0518556 L4.96456906,19.0518556 L4.96456906,9.50767779 L7.93110925,9.50767779 L7.93110925,19.0518556 Z M20.518701,2.01149684 L3.4753856,2.01149684 C2.67018184,2.00262679 2.00985562,2.64816958 2,3.45337335 L2,20.5666636 C2.00985562,21.372853 2.67018184,22.0183958 3.4753856,22.0096371 L20.518701,22.0096371 C21.3258759,22.0193813 21.9891588,21.3738385 22,20.5666636 L22,3.45238779 C21.9881733,2.6452129 21.3248904,1.9996701 20.518701,2.0103767" id="Path_2520" fill="currentColor" fill-rule="nonzero"></path></g></svg></a>',
          },
          {
            html: '<form action="https://stately.ai/registry/api/newsletter/signup" method="post" target="popupwindow" class="embeddable-buttondown-form state plausible-event-name=docs+newsletter" data-active><label for="bd-email">Subscribe to our newsletter</label><div class="fields"><input type="email" name="email" id="bd-email" required="" placeholder="your@email.com"><input type="hidden" value="1" name="embed"><input type="submit" class="white" class="copy-button" value="Subscribe"></div></form>',
          },
        ],
        copyright: `Copyright © Stately, ${new Date().getFullYear()}`,
      },
      algolia: {
        appId: 'BYNMHHN151',
        apiKey: 'e2fd3f2a7cd06067674996dd674fb241',
        indexName: 'stately',
        contextualSearch: true,
      },
      announcementBar: {
        content:
          '<strong>👋 Welcome!</strong> These docs are in beta, please give us any feedback in our <a href="https://discord.com/channels/795785288994652170/838444044774277151">Discord Documentation channel</a>.',
        isCloseable: true,
      },
      colorMode: {
        disableSwitch: false,
        respectPrefersColorScheme: true,
      },
      prism: {
        theme: themes.oneLight,
        darkTheme: themes.oneDark,
      },
    }),
};

module.exports = config;
