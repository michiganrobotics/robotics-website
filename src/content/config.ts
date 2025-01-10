import { defineCollection, z } from 'astro:content';

const news = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    title: z.string(),
    date: z.string(),
    description: z.string().optional(),
    excerpt: z.string().optional(),
    image: z.object({
      src: z.string(),
      alt: z.string(),
    }).optional(),
    videos: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
    categories: z.array(z.string()).optional(),
    author: z.string().optional(),
  }),
});

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

const academics = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string().optional(),
    image: z.object({
      src: z.string(),
      alt: z.string(),
    }).optional(),
    order: z.number().optional(),
    featured: z.boolean().optional(),
  }),
});
