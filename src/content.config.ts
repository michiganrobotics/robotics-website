import { defineCollection, reference, z } from 'astro:content';
import { glob } from 'astro/loaders';

const focusAreas = defineCollection({
  loader: glob({ pattern: "*.mdx", base: "./src/content/focus-areas" }),
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string(),
    icon: z.string(),
    type: z.enum(['core', 'application']),
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
    }).optional(),
    categories: z.array(z.enum([
      'robot-learning-foundational-models',
      'robot-perception',
      'human-robot-interaction',
      'autonomous-vehicles',
      'robotic-manipulation',
      'legged-robotics',
      'rehabilitation-wearables',
      'manufacturing-robotics',
      'motion-planning-control',
      'multi-robot-swarms',
      'safe-autonomy',
      'medical-robotics',
      'design-soft-robotics',
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

const collegeNews = defineCollection({
  loader: glob({ pattern: "*.json", base: "./src/content/college-news" }),
  schema: ({ image }) => z.object({
    title: z.string(),
    date: z.string(),
    description: z.string().optional(),
    link: z.string().url(),
    image: z.object({
      src: image(),
      alt: z.string(),
    }).optional(),
    categories: z.array(z.enum([
      'robot-learning-foundational-models',
      'robot-perception',
      'human-robot-interaction',
      'autonomous-vehicles',
      'robotic-manipulation',
      'legged-robotics',
      'rehabilitation-wearables',
      'manufacturing-robotics',
      'motion-planning-control',
      'multi-robot-swarms',
      'safe-autonomy',
      'medical-robotics',
      'design-soft-robotics',
      'robotics-community',
    ])).optional(),
    tags: z.array(z.string()).optional(),
    featured: z.boolean().default(true),
  }),
});

export const collections = {
  focusAreas,
  news,
  courses,
  academics,
  collegeNews,
};