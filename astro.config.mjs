import { defineConfig, envField } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import expressiveCode from 'astro-expressive-code';

import sitemap from '@astrojs/sitemap';

import cloudflare from '@astrojs/cloudflare';

const SITE_URL = 'https://lewiskori.com';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: cloudflare(),
  site: SITE_URL,
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
        default: '',
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
      themes: ['aurora-x', 'solarized-light'],
    }),
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      serialize(item) {
        if (item.url === SITE_URL + '/' || item.url === SITE_URL) {
          item.changefreq = 'daily';
          item.priority = 1.0;
          item.lastmod = new Date();
          return item;
        }

        if (/\/blog\/[^/]+\/?$/.test(item.url)) {
          item.changefreq = 'weekly';
          item.priority = 0.8;
          return item;
        }

        if (
          /\/(about|contact|projects|advisory|operating-notes)\/?$/.test(
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
