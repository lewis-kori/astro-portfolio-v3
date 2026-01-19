import { defineCollection, z } from 'astro:content';
import { file, glob } from 'astro/loaders';

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

const about = defineCollection({
  type: 'content',
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
    cover_image: z.string().optional(),
    series: z.string().optional(),
    sponsors: z.array(z.string()).optional(),
  }),
});

const experience = defineCollection({
  loader: file('src/data/experience.json'),
  schema: z.object({
    id: z.string(),
    company: z.string(),
    website: z.string().url(),
    role: z.string(),
    period: z.string(),
    responsibilities: z.array(z.string()),
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
  }),
});

export const collections = {
  socials,
  about,
  operatingNotes,
  advisory,
  experience,
  projects,
  blog,
  sponsors,
};
