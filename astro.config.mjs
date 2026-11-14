import { defineConfig, fontProviders } from 'astro/config';
import { existsSync, readFileSync } from 'node:fs';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Same file the pages read (src/lib/site.ts). Preview sites are noindex and get no sitemap.
const siteConfigFile = process.env.SITE_CONFIG_FILE ?? '.data/site.json';
const siteConfig = existsSync(siteConfigFile) ? JSON.parse(readFileSync(siteConfigFile, 'utf8')).site ?? {} : {};

// Latin for most text, latin-ext for č, š, ž on the Slovenian pages.
const latin = ['U+0000-00FF', 'U+0131', 'U+0152-0153', 'U+02BB-02BC', 'U+02C6', 'U+02DA', 'U+02DC', 'U+0304', 'U+0308', 'U+0329', 'U+2000-206F', 'U+20AC', 'U+2122', 'U+2191', 'U+2193', 'U+2212', 'U+2215', 'U+FEFF', 'U+FFFD'];
const latinExt = ['U+0100-02BA', 'U+02BD-02C5', 'U+02C7-02CC', 'U+02CE-02D7', 'U+02DD-02FF', 'U+1D00-1DBF', 'U+1E00-1E9F', 'U+1EF2-1EFF', 'U+2020', 'U+20A0-20AB', 'U+20AD-20C0', 'U+2113', 'U+2C60-2C7F', 'U+A720-A7FF'];
const files = (pkg, file, styles) => styles.flatMap((style) => [
  { weight: '100 900', style, unicodeRange: latin, src: [`@fontsource-variable/${pkg}/files/${pkg}-latin-${file}-${style}.woff2`] },
  { weight: '100 900', style, unicodeRange: latinExt, src: [`@fontsource-variable/${pkg}/files/${pkg}-latin-ext-${file}-${style}.woff2`] },
]);

export default defineConfig({
  site: siteConfig.url ?? process.env.SITE_URL ?? 'http://localhost:4321',
  output: 'static',
  trailingSlash: 'always',
  integrations: siteConfig.preview ? [] : [sitemap({ i18n: { defaultLocale: 'en', locales: { en: 'en', sl: 'sl' } } })],
  i18n: { defaultLocale: 'en', locales: ['en', 'sl'], routing: { prefixDefaultLocale: false } },
  // Self-hosted from installed @fontsource-variable packages; no network at build.
  // Fraunces "soft" files carry the weight and SOFT axes (rounded serif headings).
  fonts: [
    { provider: fontProviders.local(), name: 'Fraunces', cssVariable: '--font-fraunces', fallbacks: ['Georgia', 'serif'], options: { variants: files('fraunces', 'soft', ['normal', 'italic']) } },
    { provider: fontProviders.local(), name: 'Instrument Sans', cssVariable: '--font-instrument', fallbacks: ['system-ui', 'sans-serif'], options: { variants: files('instrument-sans', 'wght', ['normal']) } },
  ],
  build: { inlineStylesheets: 'always' },
  // Fetch same-site pages on hover/focus, so apartment pages open instantly.
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  vite: { plugins: [tailwindcss()] },
});
