/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */


module.exports = {
  title: 'Frictionless Data',
  tagline: 'The future of data is frictionless',
  organizationName: 'facebook',
  projectName: 'docusaurus',
  baseUrl: '/',
  url: 'https://v2.frictionlessdata.io',
  favicon: 'img/fd-blue.png',
  customFields: {
    description:
      'An optimized site generator in React. Docusaurus helps you to move fast and write content. Build documentation websites, blogs, marketing pages, and more.',
  },
  themes: ['@docusaurus/theme-live-codeblock'],
  stylesheets: [
    'https://fonts.googleapis.com/css?family=Roboto&display=swap',
  ],
  plugins: [
    [
      '@docusaurus/plugin-ideal-image',
      {
        quality: 70,
        max: 1030, // max resized image's size.
        min: 640, // min resized image's size. if original is lower, use that size.
        steps: 2, // the max number of images generated between min and max (inclusive)
      },
    ],
  ],
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          path: 'docs',
          sidebarPath: require.resolve('./sidebars.js'),
          // editUrl: 'https://github.com/frictionlessdata/frictionlessdata.io/edit/master/',
          // showLastUpdateAuthor: true,
          // showLastUpdateTime: true,
          remarkPlugins: [require('./src/plugins/remark-npm2yarn')],
        },
        blog: {
          path: './blog',
          postsPerPage: 10,
          feedOptions: {
            type: 'all',
            copyright: `Copyright © ${new Date().getFullYear()} Frictionless Data`,
          },
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
  themeConfig: {
    sidebarCollapsible: false,
    image: 'img/docusaurus.png',
    gtag: {
      trackingID: 'UA-141789564-1',
    },
    // googleAnalytics: {
    //   trackingID: 'UA-141789564-1',
    // },
    algolia: {
      apiKey: '47ecd3b21be71c5822571b9f59e52544',
      indexName: 'docusaurus-2',
      algoliaOptions: {
        // facetFilters: [`version:${versions[0]}`],
      },
    },
    navbar: {
      hideOnScroll: true,
      title: 'Frictionless Data',
      logo: {
        alt: 'Frictionless Data Logo',
        src: 'img/fd-blue.png',
      },
      links: [
        {to: 'docs/intro/home', label: 'Intro', position: 'left'},
        {to: 'docs/specs/home', label: 'Specs', position: 'left'},
        {to: 'docs/software/home', label: 'Software', position: 'left'},
        {to: 'showcase', label: 'Universe', position: 'left'},
        {to: 'blog', label: 'Blog', position: 'left'},
        {to: 'feedback', label: 'Forum', position: 'left'},
        {
          href: 'https://gitter.im/frictionlessdata/chat',
          label: 'Chat',
          position: 'left',
        },
        {
          href: 'https://github.com/frictionlessdata',
          label: 'GitHub',
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
              label: 'Intro',
              to: 'docs/introduction',
            },
            {
              label: 'Specs',
              to: 'docs/installation',
            },
            {
              label: 'Software',
              to: 'docs/migrating-from-v1-to-v2',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Blog',
              href: 'https://stackoverflow.com/questions/tagged/docusaurus',
            },
            {
              label: 'Forum',
              to: 'feedback',
            },
            {
              label: 'Chat',
              href: 'https://discordapp.com/invite/docusaurus',
            },
          ],
        },
        {
          title: 'Social',
          items: [
            {
              label: 'GitHub',
              to: 'https://github.com/frictionlessdata/frictionlessdata.io',
            },
            {
              label: 'Facebook',
              href: 'https://github.com/facebook/docusaurus',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/docusaurus',
            },
          ],
        },
      ],
      logo: {
        alt: 'Open Knowledge Foundation',
        src: 'https://a.okfn.org/img/oki/landscape-white-468x122.png',
        href: 'https://okfn.org',
      },
      copyright: `Copyright © ${new Date().getFullYear()} Frictionless Data`,
    },
  },
};
