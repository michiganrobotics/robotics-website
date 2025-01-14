import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const news = defineCollection({
  loader: glob({ pattern: ["**/*.md", "**/*.mdx"], base: "./src/content/news" }),
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
  loader: glob({ pattern: ["*.md", "*.mdx"], base: "./src/content/focus-areas" }),
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string(),
    icon: z.string(),
    images: z.array(z.object({
      src: image(),
      alt: z.string(),
    })),
  }),
});

const courses = defineCollection({
  loader: glob({ pattern: ["**/*.md", "**/*.mdx"], base: "./src/content/courses" }),
  schema: z.object({
    title: z.string(),
    date: z.string().optional(),
    description: z.string().optional(),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
  }),
});

const academics = defineCollection({
  loader: glob({ pattern: ["**/*.md", "**/*.mdx"], base: "./src/content/academics" }),
  schema: ({ image }) => z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    description: z.string().optional(),
    image: z.object({
      src: image(),
      alt: z.string(),
    }).optional(),
    order: z.number().optional(),
    featured: z.boolean().optional(),
  }),
});

export const collections = {
  news,
  focusAreas,
  courses,
  academics,
};