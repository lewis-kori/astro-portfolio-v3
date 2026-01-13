import { defineCollection, z } from 'astro:content';
import { file } from 'astro/loaders';

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
  loader: file('src/data/projects.json'),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    shortDescription: z.string(),
    fullDescription: z.string(),
    techStack: z.array(z.string()),
    image: z.string(),
    websiteUrl: z.string().url().optional(),
    appStoreUrl: z.string().url().optional(),
    playStoreUrl: z.string().url().optional(),
    order: z.number(),
  }),
});

export const collections = { socials, about, experience, projects };
