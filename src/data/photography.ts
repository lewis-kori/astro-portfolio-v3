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
    src: 'https://res.cloudinary.com/lewiskori/image/upload/v1790601471/Travel/Random/IMG_20221112_121527_ztjfyn.jpg',
    alt: "Dragon's Teeth in the Aberdares",
    title: "Dragon's Teeth",
    camera: 'Google Pixel 7',
    location: 'Aberdares, Kenya',
  },
  {
    src: 'https://res.cloudinary.com/lewiskori/image/upload/v1790601325/Travel/Random/PXL_20260905_092057243_cjew4g.jpg',
    alt: 'Elephant Hill in the Aberdares',
    title: 'Elephant Hill',
    camera: 'Google Pixel 9',
    location: 'Aberdares, Kenya',
  },
  {
    src: 'https://res.cloudinary.com/lewiskori/image/upload/v1790601465/Travel/Random/PXL_20251230_131055360_je2axb.jpg',
    alt: 'A travel photograph from Rusinga Island',
    title: 'Rusinga Island',
    camera: 'iPhone 15 Pro',
    location: 'Rusinga Island, Kenya',
  },
  {
    src: 'https://res.cloudinary.com/lewiskori/image/upload/v1790601345/Travel/Random/PXL_20241019_074451728.MP_n3c0h4.jpg',
    alt: 'A travel photograph from Lake Turkana',
    title: 'Lake Turkana',
    camera: 'Google Pixel 9',
    location: 'Lake Turkana, Kenya',
  },
  {
    src: 'https://res.cloudinary.com/lewiskori/image/upload/v1790601225/Travel/Random/PXL_20260725_132942897.MP_mqwtni.jpg',
    alt: 'A travel photograph from Lake Ellis',
    title: 'Lake Ellis',
    camera: 'Google Pixel 9',
    location: 'Lake Ellis, Kenya',
  },
  {
    src: 'https://res.cloudinary.com/lewiskori/image/upload/v1790601697/Travel/Random/PXL_20260905_040327444.MP_wi3zlz.jpg',
    alt: 'A travel photograph from Njambini',
    title: 'Njambini',
    camera: 'Google Pixel 9',
    location: 'Njambini, Kenya',
  },
];

export const getCollectionBySlug = (slug: string) =>
  collections.find((collection) => collection.slug === slug);
