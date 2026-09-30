import { file } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';

const socials = defineCollection({
  loader: file('src/data/socials.json'),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    url: z.string().url(),
    icon: z.string(),
    ariaLabel: z.string(),
  }),
});

const books = defineCollection({
  loader: file('src/data/books.json'),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    author: z.string(),
    image: z.string(),
    description: z.string(),
    link: z.string(),
  }),
});

const techStack = defineCollection({
  loader: file('src/data/tech-stack.json'),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    image: z.string(),
    description: z.string(),
    link: z.string().url(),
  }),
});

const desktopSetup = defineCollection({
  loader: file('src/data/desktop-setup.json'),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    image: z.string(),
    description: z.string(),
    link: z.string(),
  }),
});

const about = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
  }),
});

const operatingNotes = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    subtitle: z.string(),
    description: z.string(),
    lastUpdated: z.coerce.date(),
  }),
});

const advisory = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    subtitle: z.string(),
    description: z.string(),
    lastUpdated: z.coerce.date(),
    featuredImage: z.string().optional(),
  }),
});

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    author: z.string(),
    tags: z.array(z.string()),
    description: z.string(),
    dateCreated: z.coerce.date(),
    dateModified: z.coerce.date().optional(),
    cover_image: z.string().optional(),
    series: z.string().optional(),
    sponsors: z.array(z.string()).optional(),
    canonical_url: z.string().url().optional(),
  }),
});

const photoJournals = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    subtitle: z.string(),
    description: z.string(),
    collection: z.string().optional(),
    place: z.string(),
    days: z.number().optional(),
    nights: z.number().optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    dateLabel: z.string().optional(),
    dateModified: z.coerce.date().optional(),
    author: z.string().default('Lewis Kori'),
    tags: z.array(z.string()).default([]),
    cover: z.object({
      src: z.string(),
      alt: z.string(),
      title: z.string().optional(),
      caption: z.string().optional(),
      location: z.string().optional(),
      takenAt: z.string().optional(),
      camera: z.string().optional(),
      lens: z.string().optional(),
      aspect: z.enum(['portrait', 'landscape', 'square', 'wide']).optional(),
    }),
    galleryImages: z.array(z.string()).default([]),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    canonicalUrl: z.string().url().optional(),
    noindex: z.boolean().default(false),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

const experience = defineCollection({
  type: 'content',
  schema: z.object({
    company: z.string(),
    website: z.string().url(),
    role: z.string(),
    period: z.string(),
    order: z.number(),
  }),
});

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    tech: z.array(z.string()),
    external_link: z.string().url().optional(),
    github_link: z.string().url().optional(),
    app_store: z.string().url().optional(),
    google_play: z.string().url().optional(),
    cover_image: z.string().optional(),
    featured: z.boolean().optional(),
    year: z.number(),
    made_at: z.string().optional(),
  }),
});

const sponsors = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    url: z.string().url(),
    twitter: z.string().url().optional(),
    logo: z.string().optional(),
    excerpt: z.string(),
    is_featured: z.boolean(),
  }),
});

export const collections = {
  socials,
  books,
  techStack,
  desktopSetup,
  about,
  operatingNotes,
  advisory,
  experience,
  projects,
  blog,
  photoJournals,
  sponsors,
};
