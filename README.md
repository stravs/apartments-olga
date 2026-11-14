# Apartments Olga

Static Astro + Tailwind site, English and Slovenian (`/sl/`). Design: mustard, teal and lemon taken from the rooms, Fraunces + Instrument Sans, postcard-framed photos.

Features carried over from `rose-in-winter` and `apartments-bassanese`: apartment menu, mobile menu, language switch, Booking score stamp and category bars, testimonial rail (shown only when `testimonials` has permitted quotes), comparison table, lightbox (keys, swipe, captions), photo rail on phones, gallery with load more, sticky enquiry bar on phones, enquiry form with apartment preselect, lazy Google map, nearby distances, Good to know accordion, scroll reveals, JSON-LD, hreflang, sitemap, robots, llms.txt, 404, optimised images and self-hosted fonts, Cloudflare Workers config.

## Data

- `.data/property.json` and `.data/property.sl.json` (Slovenian holds translated fields only).
- `.data/site.json`: `site.preview: true` → noindex, robots disallow, no sitemap. Set `site.url` (or `SITE_URL`) before publishing.
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
