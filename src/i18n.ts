export const locales = ['en', 'sl'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export const languageNames: Record<Locale, string> = {
  sl: 'Slovenščina',
  en: 'English',
};

export function isLocale(value: string | undefined): value is Locale {
  return locales.includes(value as Locale);
}

export function localePath(locale: Locale, path = ''): string {
  const cleanPath = path.replace(/^\/+|\/+$/g, '');
  const prefix = locale === defaultLocale ? '' : `/${locale}`;
  const result = `${prefix}/${cleanPath}`;
  return result.endsWith('/') ? result : `${result}/`;
}

export function localeFromPath(pathname: string): Locale {
  const candidate = pathname.split('/').filter(Boolean)[0];
  return isLocale(candidate) ? candidate : defaultLocale;
}

export function pathWithoutLocale(pathname: string): string {
  const parts = pathname.split('/').filter(Boolean);
  if (isLocale(parts[0])) parts.shift();
  return parts.join('/');
}

const ui = {
  sl: {
    // Chrome
    mainNavigation: 'Glavna navigacija',
    guestGuide: 'Za goste',
    reserve: 'Rezerviraj',
    // Hero and intro
    propertyPhoto: 'Fotografija nastanitve',
    accommodation: 'Nastanitev',
    welcome: 'Dobrodošli',
    restSpace: 'Prostor za oddih',
    homeTitleFallback: 'Nastanitev',
    // House and garden gallery
    aroundTheHouse: 'Okoli hiše',
    houseAndGarden: 'Hiša in vrt',
    houseAndGardenCopy: 'Vrtna hiša z zasebnim parkiriščem, terasami in urejenim vrtom, kjer se dan lepo izteče.',
    // Units
    chooseSpace: 'Izberite svoj prostor',
    units: 'Nastanitvene enote',
    unit: 'Nastanitvena enota',
    unitFacts: 'Podatki o enoti',
    bookUnit: 'Rezerviraj to enoto',
    option: '1 možnost',
    options: '{count} možnosti',
    sleepsCount: 'za {count}',
    // Galleries
    openGallery: 'Odpri galerijo',
    unitPhotos: 'Galerija fotografij',
    closeGallery: 'Zapri galerijo',
    previousPhoto: 'Prejšnja fotografija',
    nextPhoto: 'Naslednja fotografija',
    photo: 'Fotografija',
    // Amenities, location, contact
    pleasantStay: 'Vse za prijetno bivanje',
    amenitiesTitle: 'Kaj vas čaka',
    location: 'Lokacija',
    locationTitle: 'Mirno zavetje po dnevu na Bledu.',
    locationCopy: 'Dan namenite raziskovanju Bleda, večer pa oddihu na vrtu. Našli nas boste na Finžgarjevi cesti, z zasebnim parkiriščem ob hiši.',
    getDirections: 'Navodila za pot',
    mapOf: 'Zemljevid lokacije',
    holidayStarts: 'Vaš oddih se začne tukaj',
    bookStay: 'Rezervirajte svoje bivanje',
    guestRating: 'Ocena gostov',
    reviews: 'mnenj',
    bookOnBooking: 'Rezerviraj na Booking.com',
    contactHost: 'Pišite gostitelju',
  },
  en: {
    // Chrome
    mainNavigation: 'Main navigation',
    guestGuide: 'Guest guide',
    reserve: 'Book now',
    // Hero and intro
    propertyPhoto: 'Property photo',
    accommodation: 'Accommodation',
    welcome: 'Welcome',
    restSpace: 'A place to unwind',
    homeTitleFallback: 'Accommodation',
    // House and garden gallery
    aroundTheHouse: 'Around the house',
    houseAndGarden: 'The house and garden',
    houseAndGardenCopy: 'A garden house with private parking, shaded terraces and a planted garden to end the day in.',
    // Units
    chooseSpace: 'Choose your space',
    units: 'Accommodation units',
    unit: 'Accommodation unit',
    unitFacts: 'Unit details',
    bookUnit: 'Book this unit',
    option: '1 option',
    options: '{count} options',
    sleepsCount: 'for {count}',
    // Galleries
    openGallery: 'Open the gallery for',
    unitPhotos: 'Photo gallery',
    closeGallery: 'Close gallery',
    previousPhoto: 'Previous photo',
    nextPhoto: 'Next photo',
    photo: 'Photo',
    // Amenities, location, contact
    pleasantStay: 'Everything for a pleasant stay',
    amenitiesTitle: 'What awaits you',
    location: 'Location',
    locationTitle: 'A quiet place to come back to.',
    locationCopy: 'Spend the day exploring Bled, then come home to the garden. Find us on Finžgarjeva cesta, with private parking at the house.',
    getDirections: 'Get directions',
    mapOf: 'Map showing',
    holidayStarts: 'Your holiday starts here',
    bookStay: 'Book your stay',
    guestRating: 'Guest rating',
    reviews: 'reviews',
    bookOnBooking: 'Book on Booking.com',
    contactHost: 'Contact the host',
  },
} as const;


/**
 * Slovenian has singular, dual and two plural forms, so "1 kopalnica / 2 kopalnici /
 * 3 kopalnice / 5 kopalnic" all differ. Categories follow CLDR.
 */
const plurals = {
  sl: {
    upToGuests: { one: 'do {count} gosta', two: 'do {count} gostov', few: 'do {count} gostov', other: 'do {count} gostov' },
    bedrooms: { one: '{count} spalnica', two: '{count} spalnici', few: '{count} spalnice', other: '{count} spalnic' },
    bathrooms: { one: '{count} kopalnica', two: '{count} kopalnici', few: '{count} kopalnice', other: '{count} kopalnic' },
    photosCount: { one: '{count} fotografija', two: '{count} fotografiji', few: '{count} fotografije', other: '{count} fotografij' },
    photos: { one: 'fotografija', two: 'fotografiji', few: 'fotografije', other: 'fotografij' },
  },
  en: {
    upToGuests: { one: 'up to {count} guest', two: 'up to {count} guests', few: 'up to {count} guests', other: 'up to {count} guests' },
    bedrooms: { one: '{count} bedroom', two: '{count} bedrooms', few: '{count} bedrooms', other: '{count} bedrooms' },
    bathrooms: { one: '{count} bathroom', two: '{count} bathrooms', few: '{count} bathrooms', other: '{count} bathrooms' },
    photosCount: { one: '{count} photo', two: '{count} photos', few: '{count} photos', other: '{count} photos' },
    photos: { one: 'photo', two: 'photos', few: 'photos', other: 'photos' },
  },
} as const;

type PluralCategory = 'one' | 'two' | 'few' | 'other';

function pluralCategory(locale: Locale, count: number): PluralCategory {
  const remainder = Math.abs(count) % 100;
  if (locale === 'sl') {
    if (remainder === 1) return 'one';
    if (remainder === 2) return 'two';
    if (remainder === 3 || remainder === 4) return 'few';
    return 'other';
  }
  return count === 1 ? 'one' : 'other';
}

export type TranslationKey = keyof typeof ui.sl | keyof typeof plurals.sl;

export function useTranslations(locale: Locale) {
  return (key: TranslationKey, values: Record<string, string | number> = {}): string => {
    let message: string;
    if (key in plurals[locale]) {
      const count = Number(values.count ?? 0);
      const forms = plurals[locale][key as keyof typeof plurals.sl];
      message = forms[pluralCategory(locale, count)];
    } else {
      const flat = ui[locale] as Record<string, string>;
      message = flat[key] ?? (ui[defaultLocale] as Record<string, string>)[key] ?? key;
    }
    for (const [name, value] of Object.entries(values)) message = message.replaceAll(`{${name}}`, String(value));
    return message;
  };
}
