// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // Canonical origin — required for sitemap, canonical URLs and og:url.
  site: 'https://www.mrmoises.es',
  // Site stays static; only routes with `prerender = false`
  // (the contact API) run on-demand on Vercel.
  output: 'static',
  adapter: vercel(),
  // 301 redirects for pages that existed on the old Webflow site and were
  // dropped in the Astro migration (see MIGRATION-REDIRECT-MAP.md). Astro emits
  // these as real 301s through the Vercel adapter.
  redirects: {
    '/calopa-concept': '/proyectos',
    '/icoa-dental': '/proyectos',
    '/la-razon-desing-system-y-rediseno': '/proyectos',
    '/love-is-in-the-hair': '/proyectos',
    '/maas-ens-mous': '/proyectos',
    '/lulas': '/lulas-lulas',
    '/servicios': '/'
  },
  integrations: [
    sitemap({
      // Keep error pages and the legacy redirect URLs out of the sitemap.
      filter: (page) =>
        !/\/(401|404)\/?$/.test(page) &&
        !/\/(calopa-concept|icoa-dental|la-razon-desing-system-y-rediseno|love-is-in-the-hair|maas-ens-mous|lulas|servicios)\/?$/.test(
          page
        )
    })
  ],
  server: {
    port: 3000,
    host: true
  },
  vite: {
    plugins: [tailwindcss()]
  }
});