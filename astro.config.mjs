import { defineConfig } from 'astro/config';
import node from "@astrojs/node";
import mdx from '@astrojs/mdx';
import embeds from 'astro-embed/integration';

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
import preact from "@astrojs/preact";

// https://astro.build/config
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  output: 'static',
  // adapter: node({
  //   mode: 'standalone'
  // }),
  site: 'https://dnewms.github.io',
  base: process.env.NODE_ENV === 'production' ? '/rob-astro-23' : '/',
  integrations: [tailwind(), preact(), sitemap(),  embeds(), mdx()]
});