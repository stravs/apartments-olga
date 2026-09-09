import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Change `site` here and `site.url` in .data/site.json when the real domain is ready.
export default defineConfig({
  output: 'static',
  site: 'https://apartments-olga.example',
  i18n: { locales: ['en', 'sl'], defaultLocale: 'en', routing: { prefixDefaultLocale: false } },
  prefetch: true,
  integrations: [
    sitemap({
      // The guest guide is noindex, so it must not be advertised in the sitemap.
      filter: (page) => !page.includes('/guests'),
      i18n: { defaultLocale: 'en', locales: { en: 'en', sl: 'sl' } },
    }),
  ],
});
