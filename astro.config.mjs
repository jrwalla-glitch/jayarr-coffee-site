// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import svelte from '@astrojs/svelte';
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://jayarr.coffee',
  // Each worktree keeps its own build cache. node_modules is shared between worktrees, and Astro's default
  // cache inside it let one worktree's build read another's content (Wave D research batch R1).
  cacheDir: './.astro-cache',
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