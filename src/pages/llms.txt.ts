import type { APIRoute } from 'astro';
import { fullAddress, getProperty, mapsUrl, unitFacts, unitFeatures, unitPath } from '../lib/property';

// llms.txt (https://llmstxt.org): a plain Markdown summary of the site for AI agents, built from the same data as the pages.
export const GET: APIRoute = async ({ site }) => {
  const property = await getProperty('en');
  const url = (path: string) => new URL(path, site).href;
  const rating = property.bookingRating;

  const lines = [
    `# ${property.name}`,
    '',
    `> ${property.description}`,
    '',
    `- Address: ${fullAddress(property)} ([map](${mapsUrl(property)}))`,
    property.checkIn && `- Check-in: ${property.checkIn}`,
    property.checkOut && `- Check-out: ${property.checkOut}`,
    property.languages && `- Languages: ${property.languages.join(', ')}`,
    property.email && `- Email: ${property.email}`,
    `- Enquiries: ${url('/#enquiry')}`,
    rating && `- Booking.com score: ${rating.value}/10 (${rating.label}) from ${rating.count} reviews, as of ${rating.capturedAt} ([reviews](${rating.url}))`,
    '',
    '## Apartments',
    '',
    ...property.units.map((unit) => `- [${unit.name}](${url(unitPath(unit.id))}): ${[unit.setting, ...unitFacts(unit)].filter(Boolean).join('; ')}. Features: ${unitFeatures(unit).join(', ')}.`),
    '',
    '## Nearby',
    '',
    ...(property.nearby ?? []).map((place) => `- ${place.name}: ${place.distance}`),
    '',
    '## Good to know',
    '',
    ...property.narrative.practical.map((item) => `- ${item.label}: ${item.value}`),
    '',
    '## Optional',
    '',
    `- [Slovenian version](${url('/sl/')})`,
  ];
  return new Response(lines.filter((line) => typeof line === 'string').join('\n') + '\n', {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
};
