import { defineConfig, envField, fontProviders } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import expressiveCode from 'astro-expressive-code';

import sitemap from '@astrojs/sitemap';

import cloudflare from '@astrojs/cloudflare';
import mdx from '@astrojs/mdx';

const SITE_URL = 'https://lewiskori.com';

// These journals remain available as previews, but their frontmatter marks them
// as noindex. Keep them out of the sitemap until they are ready to be indexed.
const NOINDEX_PATHS = new Set([
  '/photography/africa/cape-town',
  '/photography/africa/namibia',
  '/photography/africa/zanzibar',
  '/photography/asia/united-arab-emirates',
  '/photography/africa/indian-ocean',
]);

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: cloudflare(),
  site: SITE_URL,
  prefetch: { prefetchAll: false },
  experimental: {
    fonts: [
      {
        provider: fontProviders.google(),
        name: 'Inter',
        cssVariable: '--font-inter',
        fallbacks: ['sans-serif'],
        display: 'swap',
      },
    ],
  },
  env: {
    schema: {
      BEEHIIV_PUBLICATION_ID: envField.string({
        context: 'server',
        access: 'secret',
        default: 'abc',
      }),
      BEEHIIV_API_KEY: envField.string({
        context: 'server',
        access: 'secret',
        default: '',
      }),
      GTM_ID: envField.string({
        context: 'client',
        access: 'public',
        default: 'GTM-WWKZNJ8N',
      }),
    },
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es', 'fr', 'de'],
    routing: {
      prefixDefaultLocale: false,
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [
    expressiveCode({
      themes: ['aurora-x'],
    }),
    mdx(),
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      filter(page) {
        const pathname = new URL(page).pathname.replace(/\/$/, '') || '/';
        return !NOINDEX_PATHS.has(pathname);
      },
      serialize(item) {
        if (item.url === SITE_URL + '/' || item.url === SITE_URL) {
          item.changefreq = 'daily';
          item.priority = 1.0;
          return item;
        }

        if (/\/blog\/[^/]+\/?$/.test(item.url)) {
          item.changefreq = 'weekly';
          item.priority = 0.8;
          return item;
        }

        if (
          /\/(about|contact|projects|advisory|operating-notes|photography|photostream)\/?$/.test(
            item.url,
          )
        ) {
          item.changefreq = 'monthly';
          item.priority = 0.9;
          return item;
        }

        if (/\/blog\/?$/.test(item.url)) {
          item.changefreq = 'daily';
          item.priority = 0.9;
          return item;
        }
        if (/\/resources\/?$/.test(item.url)) {
          item.changefreq = 'monthly';
          item.priority = 0.6;
          return item;
        }

        return item;
      },
    }),
  ],
});
