// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import svelte from '@astrojs/svelte';
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://jayarr.coffee',
  integrations: [mdx(), sitemap(), svelte()],

  build: {
    // Inline CSS into HTML so the page can render without a blocking
    // stylesheet request. Trades ~3-5KB gzipped per page for ~200-400ms LCP
    // on cold visits — the audit flagged the route CSS as the only
    // render-blocking resource on mobile.
    inlineStylesheets: 'always',
  },

  vite: {
    plugins: [tailwindcss()],
  },
});