import { defineCollection, z } from 'astro:content';

const focusAreas = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    videos: z.array(z.string()).optional(),
    images: z.array(z.object({
      src: z.string(),
      alt: z.string(),
    })).optional(),
  }),
});

const courses = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.string().optional(),
    description: z.string().optional(),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
  }),
});

export const collections = {
  'focus-areas': focusAreas,
  'courses': courses,
};