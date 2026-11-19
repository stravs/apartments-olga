import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import type { Locale } from './i18n';

export type PropertyPhoto = { url: string; alt?: string };
export type PropertyRoom = { name: string; sleeps?: number; beds?: string };

export type PropertyUnit = {
  id: string;
  /** Booking.com room-type ID the unit and its photos are linked to. */
  bookingRoomId?: string;
  name: string;
  type?: string;
  description?: string;
  /** Short line: floor, entrance, what it opens onto. */
  setting?: string;
  /** Reviewed short facts, shown before the general amenities. */
  highlights?: string[];
  areaSquareMetres?: number;
  maxGuests?: number;
  /** Display label; keeps adults/children apart when the source does. */
  occupancyLabel?: string;
  bedrooms?: number;
  bathrooms?: number;
  rooms: PropertyRoom[];
  amenities: string[];
  /** Photos source-linked to this unit only. Shared house/garden photos live on the property. */
  photos: PropertyPhoto[];
};

export type Rating = {
  value: number;
  label: string;
  count: number;
  url: string;
  /** Date the score was copied from the listing (YYYY-MM-DD). */
  capturedAt: string;
};

export type Property = {
  name: string;
  type?: string;
  description: string;
  address?: string;
  postalCode?: string;
  city?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  checkIn?: string;
  checkOut?: string;
  languages?: string[];
  email?: string;
  /** Booking.com score (out of 10). Not added to structured data: Google ignores self-served ratings. */
  bookingRating?: Rating;
  /** Verbatim guest reviews, without guest names or countries. date: YYYY-MM of the review. */
  testimonials?: Array<{ quote: string; date?: string; source: string; url: string }>;
  photos: PropertyPhoto[];
  amenities: Array<{ icon: string; label: string }>;
  nearby?: Array<{ name: string; distance: string; major?: boolean }>;
  units: PropertyUnit[];
  narrative: {
    heroEyebrow?: string;
    heroTitle: string;
    heroText: string;
    heroPhotos: string[];
    introTitle: string;
    introText: string;
    highlights: Array<{ title: string; text: string }>;
    housePhoto?: string;
    settingPhoto?: string;
    spacesTitle: string;
    spacesText?: string;
    settingTitle: string;
    settingText?: string;
    practical: Array<{ label: string; value: string }>;
  };
};

type Translation = Partial<Pick<Property, 'description' | 'checkIn' | 'country' | 'languages' | 'amenities' | 'nearby' | 'bookingRating' | 'testimonials'>> & {
  narrative?: Partial<Property['narrative']>;
  units?: Record<string, Partial<Pick<PropertyUnit, 'name' | 'description' | 'setting' | 'highlights' | 'amenities' | 'occupancyLabel' | 'rooms'>>>;
  /** English alt text → translated alt text. */
  photoAlts?: Record<string, string>;
};

/** Property data. For Slovenian, .data/property.sl.json holds only translated fields: units match by id, photo alt text by the English alt. */
export async function getProperty(locale: Locale = 'en'): Promise<Property> {
  const path = resolve(process.cwd(), process.env.PROPERTY_DATA_FILE ?? '.data/property.json');
  const property = JSON.parse(await readFile(path, 'utf8')) as Property;
  if (locale === 'en') return property;
  const translation = JSON.parse(await readFile(path.replace(/\.json$/, `.${locale}.json`), 'utf8')) as Translation;
  const { narrative, units, photoAlts, ...fields } = translation;
  const alt = (photo: PropertyPhoto): PropertyPhoto => {
    const translated = photo.alt && photoAlts?.[photo.alt];
    return translated ? { ...photo, alt: translated } : photo;
  };
  return {
    ...property,
    ...fields,
    narrative: { ...property.narrative, ...narrative },
    photos: property.photos.map(alt),
    units: property.units.map((unit) => ({ ...unit, ...units?.[unit.id], photos: unit.photos.map(alt) })),
  };
}

/** Every photo of the property, unit photos included, for lookups by URL. */
export function findPhoto(property: Property, url: string | undefined): PropertyPhoto | undefined {
  return [...property.photos, ...property.units.flatMap((unit) => unit.photos)].find((photo) => photo.url === url);
}

/** Readable unit IDs stay as they are; unusual IDs are encoded without route collisions. */
export function unitSlug(id: string): string {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id) && !id.startsWith('encoded-')
    ? id : `encoded-${Array.from(new TextEncoder().encode(id), (byte) => byte.toString(16).padStart(2, '0')).join('')}`;
}

/** Ends with a slash, like the built page, so links don't hit a redirect. */
export function unitPath(id: string): string {
  return `/units/${unitSlug(id)}/`;
}

/** Meta description: whitespace collapsed, cut at a word boundary to fit search snippets. */
export function summary(text: string, max = 158): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  return clean.length <= max ? clean : `${clean.slice(0, max - 1).replace(/\s+\S*$/, '')}…`;
}

/** Highlights first, then amenities not already covered by a highlight. */
export function unitFeatures(unit: PropertyUnit): string[] {
  const highlights = unit.highlights ?? [];
  return [...new Set([...highlights, ...unit.amenities.filter((item) => !highlights.some((h) => h.toLowerCase().includes(item.toLowerCase())))])];
}

/** Size, guests and beds in one short list. */
export function unitFacts(unit: PropertyUnit): string[] {
  return [unit.areaSquareMetres && `${unit.areaSquareMetres} m²`, unit.occupancyLabel, ...unit.rooms.map((room) => room.beds)].filter((fact): fact is string => Boolean(fact));
}

export function fullAddress(property: Property): string {
  return [property.address, [property.postalCode, property.city].filter(Boolean).join(' '), property.country].filter(Boolean).join(', ');
}

function mapQuery(property: Property): string {
  const { latitude, longitude } = property;
  return latitude !== undefined && longitude !== undefined ? `${latitude},${longitude}` : fullAddress(property);
}

export function mapsUrl(property: Property): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery(property))}`;
}

/** Keyless Google Maps embed: coordinates when captured, otherwise the address. */
export function mapEmbedUrl(property: Property, locale: Locale = 'en'): string {
  return `https://www.google.com/maps?q=${encodeURIComponent(mapQuery(property))}&z=15&hl=${locale}&output=embed`;
}

/** Two-digit label for numbered lists: 1 → "01". */
export function pad(value: number): string {
  return String(value).padStart(2, '0');
}
