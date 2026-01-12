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

export const collections = { socials };
