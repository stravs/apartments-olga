export const locales = ['en', 'sl'] as const;
export type Locale = (typeof locales)[number];

export function toLocale(value: string | undefined): Locale {
  return value === 'sl' ? 'sl' : 'en';
}

/** Path in the given language. English has no prefix; Slovenian lives under /sl. */
export function localePath(locale: Locale, path: string): string {
  return locale === 'en' ? path : `/sl${path}`;
}

/** The same page in the other language. */
export function alternatePath(pathname: string, target: Locale): string {
  const base = pathname.replace(/^\/sl(?=\/|$)/, '') || '/';
  return localePath(target, base);
}

/** ["a", "b", "c"] → "a, b and c". */
const list = (items: string[], and: string) => items.length < 2 ? items.join('') : `${items.slice(0, -1).join(', ')} ${and} ${items.at(-1)}`;

const en = {
  htmlLang: 'en',
  ogLocale: 'en_GB',
  languageName: 'English',
  languageShort: 'EN',
  skip: 'Skip to content',
  menu: 'Menu',
  close: 'Close',
  mainNav: 'Main navigation',
  home: (name: string) => `${name} home`,
  apartments: 'Apartments',
  reviews: 'Reviews',
  location: 'Location',
  goodToKnow: 'Good to know',
  accommodation: 'Accommodation',
  enquire: 'Send enquiry',
  enquireAbout: 'Enquire about this apartment',
  seeApartments: 'See the apartments',
  propertyHighlights: 'Property highlights',
  housePhotos: 'Photos of the house and garden',
  openHousePhotos: 'Open photos of the house and garden',
  photoCount: (n: number) => `${n} ${n === 1 ? 'photo' : 'photos'}`,
  detailsLink: 'Photos and details',
  compareTitle: 'Side by side',
  compareCaption: 'The three apartments compared',
  size: 'Size',
  guests: 'Guests',
  sleeps: 'Sleeps',
  beds: 'Beds',
  rooms: 'Rooms',
  separateBedroom: 'Separate bedroom',
  openPlan: 'Open-plan studio',
  reviewsTitle: 'What guests say',
  reviewsCount: (n: number) => `${n} Booking.com reviews`,
  readAllReviews: (n: number) => `Read all ${n} reviews on Booking.com`,
  outOfTen: 'out of 10',
  guestReviews: 'Guest reviews',
  nearbyTitle: 'Around the corner and a little further',
  distancesNote: 'Distances are approximate; walking routes may be longer.',
  /** Nearby places grouped by distance: up to 1 km, 2 km, 5 km, then the rest. */
  distanceBands: [['A short stroll', 'under 1 km'], ['Walking distance', '1–2 km'], ['A longer walk or a ride', '2–5 km'], ['Further afield', 'over 5 km']] as [string, string][],
  directions: 'Directions in Google Maps',
  mapTitle: (name: string) => `Map showing ${name}`,
  practicalTitle: 'Good to know',
  formTitle: 'Send an enquiry',
  formText: 'Tell us your dates and we will reply with availability and the price.',
  formName: 'Name',
  formEmail: 'Email',
  formArrival: 'Arrival',
  formDeparture: 'Departure',
  formAdults: 'Adults',
  formChildren: 'Children',
  formApartment: 'Apartment',
  formAny: 'Any apartment',
  formMessage: 'Message',
  formPreview: 'Preview: enquiries are not sent yet.',
  formPlaceholder: 'Tell us about your trip…',
  formSign: 'Best wishes,',
  formTo: 'To',
  postcard: 'Postcard',
  ctaTitle: ['Your table on the terrace', 'is waiting.'],
  allApartments: 'All apartments',
  showAllPhotos: (n: number) => `Show all ${n} photos`,
  swipePhotos: (name: string) => `Photos of ${name}, scroll sideways`,
  openPhoto: (n: number, total: number) => `Open photo ${n} of ${total}`,
  theApartment: 'The apartment',
  inTheApartment: 'In the apartment',
  sharedTitle: 'Shared by every apartment',
  aroundHouse: 'Around the house',
  aroundHouseText: 'The garden, terrace and courtyard belong to the whole house, not to one apartment.',
  toLake: (distance: string) => `${distance} to Lake Bled`,
  seeLocation: 'See the location',
  otherTitle: 'The other apartments',
  galleryLabel: (name: string) => `Photos of ${name}`,
  closeGallery: 'Close photos',
  previousPhoto: 'Previous photo',
  nextPhoto: 'Next photo',
  photo: 'Photo',
  notFoundTitle: 'Page not found',
  notFoundText: 'This page does not exist. Have a look at the apartments instead.',
  photosSoon: 'Photos coming soon',
  loadMore: 'Load more photos',
  checkIn: 'Check-in',
  checkOut: 'Check-out',
  enquiryLead: ['Dates, beds, a cot for the little one?', 'Just ask.'],
  weSpeak: (languages: string[]) => `We speak ${list(languages, 'and')}.`,
};

export type Strings = typeof en;

// Slovenian plural by the last two digits: 1 ocena, 2 oceni, 3–4 ocene, 5+ ocen.
const plural = (n: number, forms: [string, string, string, string]) => {
  const rest = n % 100;
  return rest === 1 ? forms[0] : rest === 2 ? forms[1] : rest === 3 || rest === 4 ? forms[2] : forms[3];
};

const sl: Strings = {
  htmlLang: 'sl',
  ogLocale: 'sl_SI',
  languageName: 'Slovenščina',
  languageShort: 'SL',
  skip: 'Preskoči na vsebino',
  menu: 'Meni',
  close: 'Zapri',
  mainNav: 'Glavna navigacija',
  home: (name) => `${name} – domov`,
  apartments: 'Apartmaji',
  reviews: 'Ocene',
  location: 'Lokacija',
  goodToKnow: 'Dobro je vedeti',
  accommodation: 'Nastanitev',
  enquire: 'Pošlji povpraševanje',
  enquireAbout: 'Povprašajte za ta apartma',
  seeApartments: 'Oglejte si apartmaje',
  propertyHighlights: 'Prednosti nastanitve',
  housePhotos: 'Fotografije hiše in vrta',
  openHousePhotos: 'Odpri fotografije hiše in vrta',
  photoCount: (n) => `${n} ${plural(n, ['fotografija', 'fotografiji', 'fotografije', 'fotografij'])}`,
  detailsLink: 'Fotografije in podrobnosti',
  compareTitle: 'Primerjava',
  compareCaption: 'Primerjava treh apartmajev',
  size: 'Velikost',
  guests: 'Gostje',
  sleeps: 'Ležišča',
  beds: 'Postelje',
  rooms: 'Prostori',
  separateBedroom: 'Ločena spalnica',
  openPlan: 'Studio v enem prostoru',
  reviewsTitle: 'Kaj pravijo gostje',
  reviewsCount: (n) => `${n} ${plural(n, ['ocena', 'oceni', 'ocene', 'ocen'])} na Booking.com`,
  readAllReviews: (n) => `Preberite vseh ${n} ${plural(n, ['oceno', 'oceni', 'ocene', 'ocen'])} na Booking.com`,
  outOfTen: 'od 10',
  guestReviews: 'Mnenja gostov',
  nearbyTitle: 'Za vogalom in malo dlje',
  distancesNote: 'Razdalje so približne; peš poti so lahko daljše.',
  distanceBands: [['Kratek sprehod', 'do 1 km'], ['Peš dosegljivo', '1–2 km'], ['Daljši sprehod ali vožnja', '2–5 km'], ['Dlje stran', 'nad 5 km']],
  directions: 'Navodila za pot v Google Zemljevidih',
  mapTitle: (name) => `Zemljevid: ${name}`,
  practicalTitle: 'Dobro je vedeti',
  formTitle: 'Pošljite povpraševanje',
  formText: 'Sporočite nam datume, odgovorili vam bomo z razpoložljivostjo in ceno.',
  formName: 'Ime',
  formEmail: 'E-pošta',
  formArrival: 'Prihod',
  formDeparture: 'Odhod',
  formAdults: 'Odrasli',
  formChildren: 'Otroci',
  formApartment: 'Apartma',
  formAny: 'Kateri koli apartma',
  formMessage: 'Sporočilo',
  formPreview: 'Predogled: povpraševanja se še ne pošiljajo.',
  formPlaceholder: 'Povejte nam kaj o svojem potovanju …',
  formSign: 'Lep pozdrav,',
  formTo: 'Za',
  postcard: 'Razglednica',
  ctaTitle: ['Vaša miza na terasi', 'vas že čaka.'],
  allApartments: 'Vsi apartmaji',
  showAllPhotos: (n) => `Pokaži vse fotografije (${n})`,
  swipePhotos: (name) => `Fotografije: ${name}, podrsajte vstran`,
  openPhoto: (n, total) => `Odpri fotografijo ${n} od ${total}`,
  theApartment: 'Apartma',
  inTheApartment: 'V apartmaju',
  sharedTitle: 'Skupno vsem apartmajem',
  aroundHouse: 'Okoli hiše',
  aroundHouseText: 'Vrt, terasa in dvorišče pripadajo vsej hiši, ne enemu apartmaju.',
  toLake: (distance) => `${distance} do Blejskega jezera`,
  seeLocation: 'Poglejte lokacijo',
  otherTitle: 'Drugi apartmaji',
  galleryLabel: (name) => `Fotografije: ${name}`,
  closeGallery: 'Zapri fotografije',
  previousPhoto: 'Prejšnja fotografija',
  nextPhoto: 'Naslednja fotografija',
  photo: 'Fotografija',
  notFoundTitle: 'Stran ne obstaja',
  notFoundText: 'Te strani ni. Oglejte si raje apartmaje.',
  photosSoon: 'Fotografije kmalu',
  loadMore: 'Naloži več fotografij',
  checkIn: 'Prijava',
  checkOut: 'Odjava',
  enquiryLead: ['Datumi, ležišča, posteljica za najmlajše?', 'Kar vprašajte.'],
  weSpeak: (languages) => `Govorimo ${list(languages, 'in')}.`,
};

export function strings(locale: Locale): Strings {
  return locale === 'sl' ? sl : en;
}

/** "2026-08" → "August 2026" / "avgust 2026". */
export function formatMonth(yearMonth: string, locale: Locale): string {
  return new Date(`${yearMonth}-15T12:00:00Z`).toLocaleDateString(locale === 'sl' ? 'sl-SI' : 'en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' });
}

/** 9.1 → "9.1" / "9,1". */
export function formatScore(value: number, locale: Locale): string {
  return value.toLocaleString(locale === 'sl' ? 'sl-SI' : 'en-GB', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}
