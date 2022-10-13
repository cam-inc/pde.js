// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'PDEJS',
  tagline: 'Plugin(Preact like) Declarative for Editor.js',
  url: 'https://cam-inc.github.io',
  baseUrl: '/pde.js/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/logo.svg',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'cam-inc', // Usually your GitHub org/user name.
  projectName: 'pde.js', // Usually your repo name.
  deploymentBranch: 'gh-pages',
  trailingSlash: false,

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ja'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          // editUrl:
          //   'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          // editUrl:
          //   'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'PDEJS',
        logo: {
          alt: 'PDEJS Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            to: '/docs/intro',
            position: 'left',
            label: 'Docs',
          },
          {
            to: '/docs/api/overview',
            position: 'left',
            label: 'API',
          },
          {
            href: 'https://codesandbox.io/s/pdejs-demo-yo1787',
            position: 'left',
            label: 'Demo',
          },
          {
            href: 'https://github.com/cam-inc/pde.js',
            label: 'GitHub',
            position: 'left',
          },
          // {
          //   type: 'doc',
          //   docId: 'intro',
          //   position: 'left',
          //   label: 'Docs',
          // },
          // { to: '/blog', label: 'Blog', position: 'left' },
          {
            type: 'localeDropdown',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Introduction',
                to: '/docs/intro',
              },
              {
                label: 'Quick Start',
                to: '/docs/getting-started/quick-start',
              },
              {
                label: 'API',
                to: '/docs/api/overview',
              },
              {
                label: 'References',
                to: '/docs/references/roadmap',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/cam-inc/pde.js',
              },
              {
                label: 'npm',
                href: 'https://www.npmjs.com/package/@pdejs/core',
              },
              {
                label: 'Issues',
                href: 'https://github.com/cam-inc/pde.js/issues',
              },
              {
                label: 'Contributing',
                href: 'https://github.com/cam-inc/pde.js/blob/main/CONTRIBUTING.md',
              },
            ],
          },
          {
            title: 'Legal',
            items: [
              {
                label: 'License',
                href: 'https://github.com/cam-inc/pde.js/blob/main/LICENSE',
              },
              // {
              //   label: 'Blog',
              //   to: '/blog',
              // },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} CAM, Inc. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
