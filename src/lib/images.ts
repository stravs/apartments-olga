import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';
import type { PropertyPhoto } from '../domain/property';

/**
 * Every photo referenced by `.data/property.json` lives under `src/assets/images`, so Astro
 * can optimize it. The data keeps stable `/images/...` URLs; this module is the only place
 * that knows how those map onto build-time assets.
 */
const assets = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/images/**/*.{jpg,jpeg,png,webp,avif}',
  { eager: true },
);

const dataPrefix = '/images/';
const assetPrefix = '/src/assets/images/';

export type ResolvedPhoto = { image: ImageMetadata; alt: string };
export type LightboxPhoto = { src: string; srcset: string; width: number; height: number; alt: string };

export function resolveImage(url: string): ImageMetadata {
  const key = url.startsWith(dataPrefix) ? `${assetPrefix}${url.slice(dataPrefix.length)}` : url;
  const asset = assets[key];
  if (!asset) {
    throw new Error(`Photo "${url}" has no file at "${key}". Add the image or fix the url in .data/property.json.`);
  }
  return asset.default;
}

export function resolvePhoto(photo: PropertyPhoto, fallbackAlt: string): ResolvedPhoto {
  return { image: resolveImage(photo.url), alt: photo.alt ?? fallbackAlt };
}

export function resolvePhotos(photos: PropertyPhoto[], fallbackAlt: string): ResolvedPhoto[] {
  return photos.map((photo) => resolvePhoto(photo, fallbackAlt));
}

/** Never ask sharp to upscale: an original narrower than the candidate is its own largest width. */
export function widthsFor(image: ImageMetadata, candidates: number[]): number[] {
  const usable = candidates.filter((width) => width < image.width);
  return [...new Set([...usable, image.width])].sort((first, second) => first - second);
}

/**
 * The lightbox swaps photos from client script, so its sources are optimized here at build
 * time rather than pointing the viewer at the untouched originals.
 */
export async function lightboxPhotos(photos: PropertyPhoto[], fallbackAlt: string): Promise<LightboxPhoto[]> {
  return Promise.all(resolvePhotos(photos, fallbackAlt).map(async ({ image, alt }) => {
    const optimized = await getImage({
      src: image,
      format: 'webp',
      widths: widthsFor(image, [480, 768, 1024, 1440]),
      sizes: '100vw',
    });
    return {
      src: optimized.src,
      srcset: optimized.srcSet.attribute,
      width: image.width,
      height: image.height,
      alt,
    };
  }));
}

export function absoluteUrl(path: string, site: URL | string | undefined): string {
  return new URL(path, site ?? 'http://localhost').href;
}
