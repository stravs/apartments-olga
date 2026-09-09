import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { readFileSync } from 'node:fs';

const siteConfig = JSON.parse(readFileSync(process.env.SITE_CONFIG_FILE ?? '.data/site.json', 'utf8'));
// Set SITE_URL in Workers Build variables to the production domain or workers.dev URL.
const site = process.env.SITE_URL || siteConfig.site.url || 'http://localhost:4321';
export default defineConfig({
  output: 'static',
  site,
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
