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
| `src/assets/images/olga/` | Every photo, grouped into `property/` (house and garden) and one folder per unit. |

Slovenian is the base language in `.data/property.json`; English lives under
`translations.en`. The `photoAlts` arrays are **index-aligned** with the matching `photos`
array, so adding a photo means adding its English alt text at the same position.

## Adding photos

1. Drop the file into `src/assets/images/olga/<property|studio|1bedroom|studio2>/`.
2. Add an entry to the relevant `photos` array in `.data/property.json` with a `url` of
   `/images/olga/<folder>/<file>.jpg` and a Slovenian `alt`.
3. Append the English alt text at the same index in the matching `photoAlts` array.

The `/images/...` url is a stable key, not a served path — `src/lib/images.ts` maps it onto
the file under `src/assets/images` so Astro can emit AVIF/WebP at several widths. A url with
no matching file fails the build with the offending path, rather than shipping a broken image.

## Going live

Two places still carry the placeholder origin:

- `site` in `astro.config.mjs`
- `site.url` in `.data/site.json`

Set both to the real domain so canonical links, `hreflang` alternates, Open Graph tags,
JSON-LD and the sitemap resolve correctly.

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
