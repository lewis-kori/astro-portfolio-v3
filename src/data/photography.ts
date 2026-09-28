export type Photo = {
  src: string;
  alt: string;
  title?: string;
  caption?: string;
  location?: string;
  takenAt?: string;
  camera?: string;
  lens?: string;
  aspect?: 'portrait' | 'landscape' | 'square' | 'wide';
};

export type PhotoCollection = {
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  cover: Photo;
};

export const unsplash = (id: string, width = 1800) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=88`;

export const collections: PhotoCollection[] = [
  {
    slug: 'africa',
    title: 'Africa',
    eyebrow: 'Home, seen slowly',
    description:
      'Light, landscape and everyday life across a continent that never fits inside a single frame.',
    cover: {
      src: unsplash('photo-1516026672322-bc52d61a55d5', 2200),
      alt: 'A winding road through a green African landscape',
      location: 'Africa',
      aspect: 'wide',
    },
  },
  /* Europe is paused until the collection is ready to publish.
  {
    slug: 'europe',
    title: 'Europe',
    eyebrow: 'Old streets, new eyes',
    description:
      'Cities best understood on foot: quiet facades, public spaces and the geometry of ordinary days.',
    cover: {
      src: unsplash('photo-1499856871958-5b9627545d1a', 2200),
      alt: 'A Parisian street leading toward the Eiffel Tower',
      location: 'Paris, France',
      aspect: 'wide',
    },
  },
  */
  /* Americas is paused until the collection is ready to publish.
  {
    slug: 'americas',
    title: 'Americas',
    eyebrow: 'Cities & wide horizons',
    description:
      'Architecture, movement and the landscapes beyond the edge of the city.',
    cover: {
      src: unsplash('photo-1477959858617-67f85cf4f1df', 2200),
      alt: 'A city skyline extending to the horizon',
      location: 'City studies',
      aspect: 'wide',
    },
  },
  */
  {
    slug: 'asia',
    title: 'Asia',
    eyebrow: 'Future-facing horizons',
    description:
      'A growing collection of cities, landscapes and visual contrasts across Asia.',
    cover: {
      src: unsplash('photo-1512453979798-5ea266f8880c', 2200),
      alt: 'Dubai skyline glowing at dusk',
      location: 'United Arab Emirates',
      aspect: 'wide',
    },
  },
];

export const photostream: Photo[] = [
  {
    src: unsplash('photo-1464822759023-fed622ff2c3b'),
    alt: 'Mountain ridge catching soft afternoon light',
    title: 'First light above the valley',
    takenAt: 'January 18, 2026',
    camera: 'DJI Osmo Pocket 4P',
    lens: 'Built-in wide camera',
    location: 'Great Rift Valley, Kenya',
    aspect: 'portrait',
  },
  { src: unsplash('photo-1499856871958-5b9627545d1a'), alt: 'Classic Parisian street view', aspect: 'portrait' },
  { src: unsplash('photo-1498623116890-37e912163d5d'), alt: 'Palm trees against a warm evening sky', aspect: 'portrait' },
  { src: unsplash('photo-1500534623283-312aade485b7'), alt: 'Mountain landscape at dusk', aspect: 'landscape' },
  { src: unsplash('photo-1472214103451-9374bd1c798e'), alt: 'Green landscape under a luminous sky', aspect: 'landscape' },
  // Europe collection is paused for now.
  { src: unsplash('photo-1510414842594-a61c69b5ae57'), alt: 'Ocean and tropical shore from above', aspect: 'landscape' },
  { src: unsplash('photo-1469474968028-56623f02e42e'), alt: 'Road leading into the mountains', aspect: 'portrait' },
  { src: unsplash('photo-1441974231531-c6227db76b6e'), alt: 'Light passing through a dense forest', aspect: 'portrait' },
  { src: unsplash('photo-1477959858617-67f85cf4f1df'), alt: 'Dense city architecture viewed from above', aspect: 'landscape' },
  { src: unsplash('photo-1507525428034-b723cf961d3e'), alt: 'Turquoise water meeting a pale sandy beach', aspect: 'square' },
  { src: unsplash('photo-1470770841072-f978cf4d019e'), alt: 'Still lake beneath misty mountains', aspect: 'wide' },
];

export const getCollectionBySlug = (slug: string) =>
  collections.find((collection) => collection.slug === slug);
