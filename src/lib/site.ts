import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

export type SiteConfig = { site: { url?: string; preview?: boolean } };

export async function getSiteConfig(): Promise<SiteConfig> {
  const path = resolve(process.cwd(), process.env.SITE_CONFIG_FILE ?? '.data/site.json');
  return JSON.parse(await readFile(path, 'utf8')) as SiteConfig;
}
