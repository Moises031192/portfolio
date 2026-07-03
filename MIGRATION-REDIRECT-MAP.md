# Migration Redirect Map — mrmoises.es (Webflow → Astro)

Source of truth for old URLs: original Webflow export `src/portfolio-4e8c8c.webflow (1).zip`.
Verified live status: 2026-07-03.

## URLs preserved (Webflow → Astro, same path, 200 OK) — no redirect needed
- / (index)
- /proyectos
- /sobre-mi
- /contacto
- /akra-restaurante
- /basica-co
- /estudioarquo
- /huntingtallares
- /lulas-lulas

## URLs DROPPED in migration (existed in Webflow, now 404) — DECISION MADE 2026-07-03
Decision: 301 redirect all. Implement in Phase 01 (Vercel/Astro). No recreations for now.
| Old URL (404) | 301 →  Destination | Status |
|---|---|---|
| /calopa-concept | /proyectos | pending implementation |
| /icoa-dental | /proyectos | pending implementation |
| /la-razon-desing-system-y-rediseno | /proyectos | pending implementation |
| /love-is-in-the-hair | /proyectos | pending implementation |
| /lulas | /lulas-lulas | pending implementation |
| /maas-ens-mous | /proyectos | pending implementation |
| /servicios | / | pending implementation |

Note: GSC just installed (2026-07-03) → no historical data. Redirecting is the safe
default regardless. All 7 → implement as 301 in Phase 01.
