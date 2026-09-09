# Apartments Olga

Standalone Astro site for the Apartments Olga guest house in Bled, generated from
`apartments-olga.json` and finished by hand. English is the default locale and Slovenian is
served from `/sl/`.

```sh
npm install
npm run dev      # local dev server
npm run build    # astro check + static build into dist/
npm run preview  # serve the built output
```

## Where the content lives

| File | Holds |
| --- | --- |
| `.data/property.json` | The property: description, address, amenities, units, rooms, photos and per-locale translations. |
| `.data/site.json` | Design tokens and page composition. |
| `src/assets/images/olga/` | Original photo folders: `studio/`, `1bedroom/`, and `studio2/`, mirrored from `/workspace/gank/public/images/olga/`. Outdoor photos remain with their original units. |

Slovenian is the base language in `.data/property.json`; English lives under
`translations.en`. The `photoAlts` arrays are **index-aligned** with the matching `photos`
array, so adding a photo means adding its English alt text at the same position.

## Adding photos

1. Drop the file into `src/assets/images/olga/<studio|1bedroom|studio2>/`, preserving its original unit folder.
2. Add an entry to the relevant `photos` array in `.data/property.json` with a `url` of
   `/images/olga/<folder>/<file>.jpg` and a Slovenian `alt`.
3. Append the English alt text at the same index in the matching `photoAlts` array.

The `/images/...` url is a stable key, not a served path — `src/lib/images.ts` maps it onto
the file under `src/assets/images` so Astro can emit AVIF/WebP at several widths. A url with
no matching file fails the build with the offending path, rather than shipping a broken image.

## Cloudflare Workers (Wrangler)

Connect the GitHub repository `stravs/apartments-olga` using these build settings:

| Setting | Value |
| --- | --- |
| Worker name | `apartments-olga` |
| Production branch | `main` |
| Root directory | Repository root (leave blank) |
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |
| Static assets directory | `dist`, set in `wrangler.jsonc` |
| Node version | `24.16.0`, pinned in `.node-version` |

This is a static Astro site deployed with Wrangler to Workers Static Assets. No server
adapter or Worker entrypoint is required. Images are optimized during the build using
the originals in the repository. Existing routes use trailing slashes; unknown routes
return 404 instead of displaying the homepage.

Set the build environment variable `SITE_URL` to the full production origin (including
`https://`), either your custom domain or the Worker's actual `workers.dev` URL. Add it
under **Settings → Build → Variables and secrets**, because Astro needs it at build time.
URL precedence is `SITE_URL`, optional `site.url` in `.data/site.json`, then
`http://localhost:4321` for local development. Set this before the first production build.
This single value controls canonical links, language alternates, social images, JSON-LD,
robots.txt and the sitemap. Set `SITE_URL` for preview builds too if they should reference
the production domain.

To reproduce a clean build locally:

```sh
npm ci
SITE_URL=https://your-domain.example npm run build
```

For a local deployment, `npm run deploy` builds and deploys using Wrangler authentication.
`npm run deploy:check` builds and runs a Wrangler dry run without deploying.
`npm run preview:cloudflare` builds and serves the site locally using Workers tooling.

Configuration follows [Cloudflare Workers Static Assets](https://developers.cloudflare.com/workers/static-assets/).

## Going live

Optional but worth adding when known: `latitude` / `longitude` on the property (the location
map currently geocodes the street address), `checkIn` / `checkOut` times, `rating` /
`reviewCount`, and `contact.email` / `contact.phone`. Every one of these is optional — the
page and the guest guide simply omit what is missing.

## Notes

- `.data/site.json` keeps the generator's full design schema, but this build only reads
  `design.colors`, `design.fonts`, `design.edges`, `sections`, `contact.type` and
  `guestGuide`. The other design variants were pruned from the stylesheet.
- The guest guide at `/guests` and `/sl/guests` is deliberately `noindex` and excluded from
  the sitemap.
