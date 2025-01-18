import { defineCollection, reference, z } from 'astro:content';
import { glob } from 'astro/loaders';

const focusAreas = defineCollection({
  loader: glob({ pattern: "*.mdx", base: "./src/content/focus-areas" }),
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string(),
    icon: z.string(),
    image: z.object({
      src: image(),
      alt: z.string()
    }).optional(),
    videos: z.array(z.string()).optional(),
    slug: z.string(),
  })
});

const news = defineCollection({
  loader: glob({ pattern: ["**/*.md", "**/*.mdx"], base: "./src/content/news" }),
  schema: ({ image }) => z.object({
    title: z.string(),
    date: z.string(),
    seoDescription: z.string().optional(),
    excerpt: z.string().optional(),
    image: z.object({
      src: image(),
      alt: z.string(),
    }).optional().default({
      src: "/public/social/og-default.jpg",
      alt: "University of Michigan Robotics"
    }),
    categories: z.array(z.enum([
      'artificial-intelligence',
      'autonomous-vehicles',
      'deep-learning',
      'human-robot-interaction',
      'legged-robots',
      'manufacturing',
      'motion-planning',
      'perception-manipulation',
      'rehabilitation',
      'safe-autonomy',
      'slam',
      'teams-swarms',
      'robotics-community',
    ])),
    tags: z.array(z.string()).optional(),
    author: z.string().optional(),
    featured: z.boolean().optional(),
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
    featured: z.boolean().default(true),
  }),
});

export const collections = {
  focusAreas,
  news,
  courses,
  academics,
};