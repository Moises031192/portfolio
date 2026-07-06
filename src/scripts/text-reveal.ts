// Global text reveal: every text block fades in line-by-line when it enters the
// viewport. Each line is masked (overflow-clip) and rises from yPercent:100 +
// opacity:0 to its resting position (yPercent:0 + opacity:1).
//
// The animation is GSAP SplitText, but the *trigger* is a native
// IntersectionObserver rather than ScrollTrigger. On mobile ScrollTrigger's
// precomputed scroll positions drift badly (the address bar shows/hides and the
// layout reflows after images/fonts load), which left fully on-screen text
// stuck hidden until you scrolled well past it. IntersectionObserver is
// evaluated by the browser against the live layout, so it fires exactly when a
// block enters view regardless of the mobile viewport quirks. Wired in
// PortfolioLayout.astro.
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(SplitText);

// Keep this list in sync with the pre-hide CSS and the IX2 filter in PortfolioLayout.astro.
export const TEXT_SELECTOR =
  'h1, h2, h3, h4, h5, h6, p, .wysiwyg, .service-car_list-item';

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

// Snappier reveal on mobile so blocks resolve almost the instant they appear
// instead of animating lazily as you scroll past them.
const isMobile = matchMedia('(max-width: 990px)').matches;
const revealDuration = isMobile ? 0.6 : 1.1;
const revealStagger = isMobile ? 0.04 : 0.08;

// Each split block gets its reveal tween created paused; the observer plays it.
const tweenByEl = new WeakMap<Element, gsap.core.Tween>();
const revealedEls = new WeakSet<Element>();

// rootMargin bottom is expanded so the reveal fires a bit *before* the block
// scrolls into view — by the time it's actually on screen it's already resolving.
const observer = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      revealedEls.add(entry.target);
      tweenByEl.get(entry.target)?.play();
      observer.unobserve(entry.target);
    }
  },
  { root: null, rootMargin: '0px 0px 18% 0px', threshold: 0 }
);

// Drop the FOUC guard so nothing can stay invisible.
function showAll() {
  document.documentElement.classList.remove('gsap-split');
}

function collectTargets(): HTMLElement[] {
  const all = Array.from(
    document.querySelectorAll<HTMLElement>(TEXT_SELECTOR)
  ).filter((el) => {
    if (!el.textContent || !el.textContent.trim()) return false; // no text
    if (!el.getClientRects().length) return false; // display:none (e.g. mobile menu)
    return true;
  });
  // Keep only the outermost match so we never split text inside already-split text.
  return all.filter((el) => !all.some((other) => other !== el && other.contains(el)));
}

function init() {
  if (reduceMotion) {
    showAll();
    return;
  }

  for (const el of collectTargets()) {
    // Neutralize any inline Webflow IX2 hide so the split lines own opacity/transform.
    el.style.opacity = '';
    el.style.transform = '';

    SplitText.create(el, {
      type: 'lines',
      mask: 'lines',
      linesClass: 'gsap-line',
      autoSplit: true, // re-split on font load / width change for correct line breaks
      onSplit(self) {
        // Returning the tween lets SplitText revert + time-sync it on re-split.
        const tween = gsap.fromTo(
          self.lines,
          { yPercent: 100, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: revealDuration,
            ease: 'power4.out',
            stagger: revealStagger,
            paused: true,
          }
        );
        tweenByEl.set(el, tween);

        if (revealedEls.has(el)) {
          // Already revealed before this re-split — keep it shown, don't replay.
          tween.progress(1);
        } else {
          observer.observe(el);
        }
        return tween;
      },
    });

    el.style.visibility = 'visible';
  }

  showAll();
}

// Split after fonts are ready so line breaks are measured correctly.
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(init);
} else {
  init();
}

// Safety net: never leave content hidden if something above fails.
setTimeout(showAll, 3000);
