// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  // Site stays static; only routes with `prerender = false`
  // (the contact API) run on-demand on Vercel.
  output: 'static',
  adapter: vercel(),
  server: {
    port: 3000,
    host: true
  },
  vite: {
    plugins: [tailwindcss()]
  }
});