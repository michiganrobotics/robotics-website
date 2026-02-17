import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import embeds from 'astro-embed/integration';
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";

import tailwindcss from '@tailwindcss/vite';

const isNetlify = process.env.NETLIFY_BUILD === 'true';

export default defineConfig({
  output: 'static',
  trailingSlash: 'always',

  // Simplified site config
  site: 'https://robotics.umich.edu',

  // Remove GitHub Pages base path
  base: '/',

  // Inline stylesheets under 8KB to reduce render-blocking requests
  build: {
    inlineStylesheets: 'auto',
  },

  integrations: [
    icon(),
    sitemap(), 
    embeds(), 
    mdx()
  ],

  markdown: {
    remarkPlugins: [
      () => (tree, file) => {
        // Only apply this plugin to course files, not all markdown files
        const courseMatch = file.history[0].match(/courses\/([^/]+)/);
        if (!courseMatch) {
          return; // Exit early if not a course file
        }
        
        const courseId = courseMatch[1];
        
        function visitLinks(tree) {
          if (tree.type === 'link' && 
              !tree.url.startsWith('/') && 
              !tree.url.startsWith('http') && 
              !tree.url.startsWith('mailto:') &&
              !tree.url.startsWith('#')) { // Also exclude anchor links
            tree.url = `${import.meta.env.BASE_URL}/academics/courses/online-courses/${courseId}/${tree.url}`;
          }
          
          if (tree.children) {
            tree.children.forEach(visitLinks);
          }
        }
        
        visitLinks(tree);
      }
    ],
  },

  vite: {
    define: {
      'import.meta.env.BASE_URL': '"/"',
    },

    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return 'vendor';
            }
          },
        }
      },
      target: 'esnext',
    },

    plugins: [tailwindcss()]
  },

  image: {
    domains: [
      'robotics.umich.edu',
      'www.umich.edu',
      'news.engin.umich.edu',
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.umich.edu',
      },
      {
        protocol: 'https',
        hostname: '**.ytimg.com',
      },
      {
        protocol: 'https',
        hostname: '**.cdninstagram.com',
      },
      {
        protocol: 'https',
        hostname: '**.twimg.com',
      },
    ],
  },
});