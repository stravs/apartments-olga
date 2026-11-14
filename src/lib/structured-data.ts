import { unitFeatures, type Property, type PropertyUnit } from './property';

// schema.org JSON-LD for search engines and AI agents. Only facts from the reviewed profile; no ratings
// (Google treats a business's own rating markup as self-serving and ignores it).

const features = (names: string[]) => names.map((name) => ({ '@type': 'LocationFeatureSpecification', name, value: true }));

/** "14:00–22:00" → "14:00" (first) or "22:00" (last). */
const time = (range: string | undefined, part: 'first' | 'last') => {
  const times = range?.match(/\d{1,2}:\d{2}/g);
  return part === 'first' ? times?.[0] : times?.at(-1);
};

export function accommodation(unit: PropertyUnit, url: string, images: string[]) {
  return {
    '@type': 'Accommodation',
    '@id': `${url}#accommodation`,
    name: unit.name,
    url,
    description: unit.description,
    image: images,
    floorSize: unit.areaSquareMetres ? { '@type': 'QuantitativeValue', value: unit.areaSquareMetres, unitCode: 'MTK' } : undefined,
    // The label keeps adults and children apart; a single number would blur them.
    occupancy: unit.occupancyLabel ? { '@type': 'QuantitativeValue', description: unit.occupancyLabel } : undefined,
    numberOfBedrooms: unit.bedrooms,
    numberOfBathroomsTotal: unit.bathrooms,
    bed: unit.rooms.map((room) => room.beds).filter(Boolean).join(', ') || undefined,
    amenityFeature: features(unitFeatures(unit)),
  };
}

export function lodgingBusiness(property: Property, homeUrl: string, images: string[], units: ReturnType<typeof accommodation>[]) {
  return {
    '@type': 'LodgingBusiness',
    '@id': `${homeUrl}#lodging`,
    name: property.name,
    url: homeUrl,
    description: property.description,
    image: images,
    email: property.email,
    address: { '@type': 'PostalAddress', streetAddress: property.address, postalCode: property.postalCode, addressLocality: property.city, addressCountry: 'SI' },
    geo: property.latitude !== undefined && property.longitude !== undefined ? { '@type': 'GeoCoordinates', latitude: property.latitude, longitude: property.longitude } : undefined,
    checkinTime: time(property.checkIn, 'first'),
    checkoutTime: time(property.checkOut, 'last'),
    knowsLanguage: property.languages,
    paymentAccepted: 'Cash',
    petsAllowed: false,
    amenityFeature: features(property.amenities.map((amenity) => amenity.label)),
    containsPlace: units,
  };
}
