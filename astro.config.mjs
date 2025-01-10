import { defineConfig } from 'astro/config';
import node from "@astrojs/node";
import mdx from '@astrojs/mdx';
import embeds from 'astro-embed/integration';
import tailwind from "@astrojs/tailwind";
import preact from "@astrojs/preact";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";
const isGitHubPages = process.env.GITHUB_ACTIONS === 'true';
const isNetlify = process.env.NETLIFY_BUILD === 'true';

export default defineConfig({
  output: 'static',
  site: isGitHubPages ? 'https://dnewms.github.io' : 
        isNetlify ? 'https://umrob.netlify.com' : 
        'http://localhost:4321', // Default for local development
  base: isGitHubPages ? '/rob-astro-23' : '/',
  integrations: [
    icon(),
    tailwind(), 
    preact(), 
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
          if (tree.type === 'link' && !tree.url.startsWith('/') && !tree.url.startsWith('http')) {
            tree.url = `${import.meta.env.BASE_URL}/academics/courses/online-courses/${courseId}/${tree.url}`;
          }
          
          if (tree.children) {
            tree.children.forEach(visitLinks);
          }
        }
        
        visitLinks(tree);
      }
    ]
  },
  vite: {
    define: {
      'import.meta.env.BASE_URL': isGitHubPages ? '"/rob-astro-23"' : '"/"',
    },
    build: {
      rollupOptions: {
        output: {
          assetFileNames: 'assets/[name][extname]',
          chunkFileNames: 'assets/[name].js',
          entryFileNames: 'assets/[name].js',
        }
      }
    }
  }
});