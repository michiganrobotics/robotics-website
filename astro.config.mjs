import { defineConfig } from 'astro/config';
import node from "@astrojs/node";
import mdx from '@astrojs/mdx';
import embeds from 'astro-embed/integration';
import tailwind from "@astrojs/tailwind";
import preact from "@astrojs/preact";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  output: 'static',
  site: 'https://dnewms.github.io',
  base: process.env.NODE_ENV === 'production' ? '/rob-astro-23/' : '/',
  integrations: [
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
            const base = process.env.NODE_ENV === 'production' ? '/rob-astro-23' : '';
            tree.url = `${base}/academics/courses/online-courses/${courseId}/${tree.url}`;
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