import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import embeds from 'astro-embed/integration';
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";

import tailwindcss from '@tailwindcss/vite';

const isNetlify = process.env.NETLIFY_BUILD === 'true';

export default defineConfig({
  output: 'static',

  // Simplified site config
  site: 'https://robotics.umich.edu',

  // Remove GitHub Pages base path
  base: '/',

  integrations: [
    icon(),
    sitemap(), 
    embeds(), 
    mdx()
  ],

  markdown: {
    remarkPlugins: [
      () => (tree, file) => {
        const courseMatch = file.history[0].match(/courses\/([^/]+)/);
        const courseId = courseMatch ? courseMatch[1] : '';
        
        function visitLinks(tree) {
          if (tree.type === 'link' && 
              !tree.url.startsWith('/') && 
              !tree.url.startsWith('http') && 
              !tree.url.startsWith('mailto:')) {
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