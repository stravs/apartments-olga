# Apartments Olga

Static Astro + Tailwind site, English and Slovenian (`/sl/`). Design: mustard, teal and lemon taken from the rooms, Fraunces + Instrument Sans, postcard-framed photos.

Features carried over from `rose-in-winter` and `apartments-bassanese`: apartment menu, mobile menu, language switch, Booking score stamp and category bars, testimonial rail (shown only when `testimonials` has permitted quotes), comparison table, lightbox (keys, swipe, captions), photo rail on phones, gallery with load more, sticky enquiry bar on phones, enquiry form with apartment preselect, lazy Google map, nearby distances, Good to know accordion, scroll reveals, JSON-LD, hreflang, sitemap, robots, llms.txt, 404, optimised images and self-hosted fonts, Cloudflare Workers config.

## Data

- `.data/property.json` and `.data/property.sl.json` (Slovenian holds translated fields only).
- `.data/site.json`: `site.preview: true` → noindex, robots disallow, no sitemap. Set `site.url` (or `SITE_URL`) before publishing.
- Photos: 31 higher-resolution versions of the same captured Booking photo IDs (up to 3000px), with unchanged gallery assignments. `880633183.jpg` (Studio 2 cover) is straightened by 3° and cropped to 1152×1536. Responsive WebP uses quality 85; full-size lightbox images use quality 90. Local download provenance: `data/runs/apartments-olga/photo-upgrade.json` at the Izba root.
- Sources: Booking capture `data/snapshots/388fb7b0e80a4ca0939b0bb027096737` (13 Oct 2026) and the historical spec. See `provenance` in `property.json`.

## Open items before publishing

- The enquiry form does not send anything yet (no delivery target, no contact email).
- Bed types and ground floor / private entrance details come from the historical spec; confirm with the owner.
- Guest review quotes and names are not published (no permission). Add them to `testimonials` only with permission.
- Photo rights and owner approval are still needed.

## Run

```sh
npm ci
npm run dev -- --host
npm run build
npm run preview -- --host
```

## Cloudflare Workers

Static assets only (`wrangler.jsonc` serves `dist`, unknown paths get `404.html`). In the Cloudflare dashboard connect `stravs/apartments-olga`:

| Setting | Value |
| --- | --- |
| Worker name | `apartments-olga` |
| Production branch | `main` |
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |
| Build variable | `SITE_URL` = full origin, e.g. `https://apartments-olga.<subdomain>.workers.dev` or the custom domain |

Without `SITE_URL` (or `site.url`), canonical, `og:url`, JSON-LD and `llms.txt` point to localhost. Node is pinned in `.node-version`. While `site.preview` is `true` the deployed site stays noindex with robots disallow; set it to `false` when the open items above are done.

Local: `npm run deploy` (needs `wrangler login`), or `npx wrangler deploy --dry-run` after a build to check.
