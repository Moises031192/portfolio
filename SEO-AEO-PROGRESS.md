# SEO & AEO Progress

**Route:** Rebuild (Webflow → Astro migration, same URLs, already live)
**Current live site:** https://www.mrmoises.es/
**About:** Portfolio de un product designer centrado en growth, creatividad y conversión
**Started:** 2026-07-03
**Current phase:** 01 (in progress — jumped here from Phase 00 to fix criticals; 3 Phase 00 baseline tasks deferred)

## Phase 01 — Technical SEO (implemented 2026-07-03, NOT YET DEPLOYED)
DONE in code:
- [x] 301 redirects for 7 dropped URLs (astro.config redirects → verified as real 301 in .vercel output)
- [x] site: 'https://www.mrmoises.es' in astro.config
- [x] sitemap via @astrojs/sitemap (sitemap-index.xml, 9 pages, error/redirect URLs filtered out)
- [x] public/robots.txt (allow all + Sitemap directive)
- [x] `<meta name="description">` added to layout + unique description on all 9 pages
- [x] canonical link + og:url + og:locale es_ES + absolute og:image
- [x] Person + WebSite JSON-LD in PortfolioLayout (validated, parses OK)
- [x] Fixed double <h1> on home (index.astro:114 → h2)
- [x] Rewrote all 9 titles (brand + keyword, unique)
- [x] alt text on profile photo (sobre-mi)
- [x] Internal linking: /basica-co was ORPHAN → now linked from home + /proyectos (replaced dead "Pure Higia" href="#" cards)
- [x] Broken links: fixed both href="#" dead cards; all internal links resolve; no external broken links
- [x] alt text on project thumbnails (index + proyectos) + profile photo
PENDING:
- [ ] DEPLOY to Vercel (all above is local — live site still 404s the 7 URLs until deploy)
- [~] sameAs: Instagram (https://www.instagram.com/mrmoises92/) added + verified. LinkedIn PENDING — user only gave homepage, needs /in/ profile URL. Add more profiles (Behance/Malt) when available.
- [x] Core Web Vitals: converted 340 referenced PNG/JPG images (all variants) to AVIF q50 via sharp. 124.1MB → 17.5MB (−86%, 106.7MB saved). Rewrote 508 refs across 8 pages (src/srcset/style url). All AVIF refs verified on disk, dimensions preserved. Originals kept (Webflow CSS backgrounds still reference them).
- [ ] alt text on remaining decorative/logo images in home (7 alt="" left — client-logo marquee + hero deco; lower priority)
- [ ] Reconsider FOUC guard (visibility:hidden on text until GSAP) delaying text LCP on home

## Pre-Migration / Post-Migration Verification
- [x] URL inventory → 9 content routes confirmed 200 on production
- [x] Rankings snapshot → N/A: GSC installed 2026-07-03, no history. Baseline = today, measure forward.
- [x] Old-URL discovery → used original Webflow export (src/portfolio-4e8c8c.webflow (1).zip) instead of GSC
- [!] FOUND: 7 URLs existed in Webflow but 404 now → MIGRATION-REDIRECT-MAP.md
      (/calopa-concept, /icoa-dental, /la-razon-desing-system-y-rediseno,
       /love-is-in-the-hair, /lulas, /maas-ens-mous, /servicios)
- [x] DECISION (2026-07-03): 301 redirect all 7. /lulas→/lulas-lulas, projects→/proyectos, /servicios→/. Implement in Phase 01.

## Known technical gaps (found during Phase 00 audit, fix in Phase 01)
CRITICAL:
- No `<meta name="description">` tag anywhere (layout only emits og/twitter description) — PortfolioLayout.astro:26-31
- Missing sitemap.xml (404) + no `site:` in astro.config
- Missing robots.txt (404)
- 242 of 243 `<img>` have alt="" (Webflow export artifact)
- Zero JSON-LD structured data (no Person / WebSite schema) — biggest AEO gap
WARNINGS:
- Double `<h1>` on homepage (index.astro:16 hero + :114 "Proyectos que he ayudado a crecer" → should be h2)
- Generic/short titles, no brand or keyword ("MrMoises Portfolio", "Proyectos", "Sobre mí", "Contacto")
- Duplicate meta descriptions ("Product Designer y Nocode-Lover" on almost all pages)
- No canonical link, no og:url

## Core Web Vitals baseline (heuristic from code — confirm w/ PSI field data)
- LCP: HIGH risk on project pages (2–3.8MB uncompressed PNGs: cocineros, ceviche, generate_an_image*.png; 1.9–2.1MB JPGs desktop4/Desktop-1/hero-entry/Group-1). MEDIUM on home (FOUC guard hides h1..h6/p via visibility:hidden until GSAP SplitText runs — PortfolioLayout.astro:127).
- CLS: LOW (srcset/sizes + transform-based reveals).
- INP: MEDIUM (Locomotive/Lenis smooth scroll + cursor mousemove + scroll listeners).
- Well optimized: Moises-portada hero (42KB max). Render-blocking: 3 Webflow CSS (~116KB) + Google Fonts stylesheet.

## Phases

- [ ] 00 — Foundation Audit
- [ ] 01 — Technical SEO
- [ ] 02 — Keyword Strategy
- [ ] 03 — AEO Content
- [ ] 04 — Link Building Foundation
- [ ] 05 — Content Production
- [ ] 06 — Brand & Entity
- [ ] 07 — Schema & AI Access
- [ ] 08 — Link Building at Scale
- [ ] 09 — UX & Conversion
- [ ] 10 — Measurement

## Phase 00 task status
- [x] Technical audit (score ~50/100)
- [x] Core Web Vitals baseline (heuristic)
- [x] Rankings snapshot (N/A — GSC fresh, baseline = today)
- [x] Old-URL / migration discovery (7 dropped URLs → redirect plan)
- [x] AEO baseline → AEO-BASELINE.md (score ~48/100)
- [ ] Competitor snapshot
- [ ] Content inventory
- [ ] Knowledge panel check

## Notes
- AEO baseline: findable by name (brand queries surface mrmoises.es) but INVISIBLE on category/discovery queries ("product designer growth conversión") where AI cites marketplaces (Malt/Toptal). Entity confusion with "Moisés Hernández". Fix via Person schema + listings + category content.
- Migration Webflow → Astro already live at mrmoises.es with identical URL structure. All known routes return 200 — no broken migration for known pages.
- Content is server-rendered in static HTML (Astro output: 'static') — good baseline for SEO and AEO/AI crawlers.
- Pages in repo: index, proyectos, sobre-mi, contacto, akra-restaurante, basica-co, estudioarquo, huntingtallares, lulas-lulas (+ 401/404 error pages).
