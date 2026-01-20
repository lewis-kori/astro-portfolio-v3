// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import expressiveCode from 'astro-expressive-code';

import sitemap from '@astrojs/sitemap';
import { siteConfig } from '@/config';

// https://astro.build/config
export default defineConfig({
  site: siteConfig.url,
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

  integrations: [expressiveCode({
    themes: ['gruvbox-dark-medium', 'solarized-light'],
  }), sitemap()],
});