// Page transition (raviklaassens-style) for the static Astro MPA.
//
// EXIT  (click on an internal link): the flow content scales 1 -> 0.92 while a
//        black veil rises 0 -> 0.4; a black panel then rotates on its top-right
//        corner (OFF -> 0deg) until it fully covers the viewport, and only then
//        does the browser navigate.
// ENTER (new page load): the page paints already covered (CSS rotate(0)); the
//        panel rotates away (0 -> OFF) revealing the content, which scales
//        0.92 -> 1 as the veil fades 0.4 -> 0. Because both the outgoing and
//        incoming pages are black at the navigation instant, the hard nav is
//        seamless (no white flash) without turning the site into an SPA.
//
// position:fixed chrome (nav, bottom-navbar, decorative fixed bits) is faded
// out during the scale so it doesn't jump (a transformed ancestor reparents
// fixed descendants to the document). Wired in PortfolioLayout.astro.
import gsap from 'gsap';

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const html = document.documentElement;

const veil = document.querySelector<HTMLElement>('.pt-veil');
const cover = document.querySelector<HTMLElement>('.pt-cover');
const scale = document.getElementById('page-scale');

// Tunables — tweak to taste.
const OFF = 118;          // deg: parked / off-screen rotation of the panel
const SCALE = 0.9;        // how much the outgoing/incoming page shrinks
const VEIL = 0.5;         // max dim of the black veil
const BLUR = 8;           // px: how much the page blurs while receding
const DUR_DIM = 0.5;      // exit: quick "recede + darken" beat (scale + blur + veil)
const COVER_DELAY = 0.22; // exit: the panel starts soon (overlaps the recede tail — no dead gap)
const DUR_COVER = 1.2;    // exit: panel ROTATION to cover — 1.2s, ease-out
const DUR_ENTER = 1.2;    // enter: reveal ROTATION — 1.2s, ease-out

// Collect the fixed-positioned chrome (robust: by computed style, not classes).
function fixedChrome(): HTMLElement[] {
  return Array.from(document.querySelectorAll<HTMLElement>('body *')).filter((el) => {
    if (el.closest('.pt-veil, .pt-cover-clip') || el.classList.contains('cursor')) return false;
    return getComputedStyle(el).position === 'fixed';
  });
}

function playEnter() {
  if (!cover || !scale) return;
  const chrome = fixedChrome();
  html.classList.add('pt-anim');
  // Instant covered/shrunken state (invisible behind the covering panel).
  gsap.set(scale, { scale: SCALE, '--pt-blur': BLUR + 'px', transformOrigin: `50% ${window.innerHeight / 2}px` });
  gsap.set(veil, { opacity: VEIL });
  gsap.set(cover, { rotate: 0 });
  gsap.set(chrome, { autoAlpha: 0 });

  gsap
    .timeline({
      onComplete: () => {
        html.classList.remove('pt-anim');
        gsap.set(scale, { clearProps: 'transform,transformOrigin,--pt-blur' });
        gsap.set(veil, { opacity: 0 });
        gsap.set(chrome, { clearProps: 'opacity,visibility' });
      },
    })
    .to(cover, { rotate: OFF, duration: DUR_ENTER, ease: 'power2.out' }, 0)
    .to(scale, { scale: 1, '--pt-blur': '0px', duration: DUR_ENTER, ease: 'power2.out' }, 0.06)
    .to(veil, { opacity: 0, duration: DUR_ENTER * 0.7, ease: 'power1.out' }, 0.06)
    .to(chrome, { autoAlpha: 1, duration: 0.4, ease: 'power1.out' }, DUR_ENTER * 0.55);
}

let leaving = false;
function playExit(href: string) {
  if (leaving || !cover || !scale) return;
  leaving = true;
  const chrome = fixedChrome();
  html.classList.add('pt-anim');
  gsap.set(scale, { transformOrigin: `50% ${window.scrollY + window.innerHeight / 2}px` });

  gsap
    .timeline({ onComplete: () => { window.location.href = href; } })
    // Beat 1 — the page recedes, blurs and darkens (visible on its own)…
    .to(chrome, { autoAlpha: 0, duration: 0.25, ease: 'power1.out' }, 0)
    .fromTo(scale, { '--pt-blur': '0px' }, { scale: SCALE, '--pt-blur': BLUR + 'px', duration: DUR_DIM, ease: 'power2.out' }, 0)
    .to(veil, { opacity: VEIL, duration: DUR_DIM, ease: 'power2.out' }, 0)
    // Beat 2 — …then the black panel sweeps in to cover, and we navigate.
    .fromTo(cover, { rotate: OFF }, { rotate: 0, duration: DUR_COVER, ease: 'power2.out' }, COVER_DELAY);
}

// Which links should trigger the transition.
function shouldIntercept(a: HTMLAnchorElement, e: MouseEvent): boolean {
  if (e.defaultPrevented || e.button !== 0) return false;
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return false;
  if (a.target && a.target !== '' && a.target !== '_self') return false;
  if (a.hasAttribute('download')) return false;
  let url: URL;
  try { url = new URL(a.href, location.href); } catch { return false; }
  if (url.origin !== location.origin) return false;                       // external site
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return false; // mailto:, tel:
  if (url.href === location.href) return false;                           // same URL
  if (url.pathname === location.pathname && url.hash) return false;       // in-page anchor
  return true;
}

if (!reduce && cover && scale) {
  playEnter();

  document.addEventListener('click', (e) => {
    const target = e.target as Element | null;
    const a = target?.closest?.('a') as HTMLAnchorElement | null;
    if (!a || !shouldIntercept(a, e)) return;
    e.preventDefault();
    playExit(a.href);
  });

  // Returning via the back/forward cache: reset and replay the reveal.
  window.addEventListener('pageshow', (e) => {
    if ((e as PageTransitionEvent).persisted) {
      leaving = false;
      playEnter();
    }
  });
}
