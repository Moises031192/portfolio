// Global text reveal: every text block fades in line-by-line when it enters the
// viewport. Each line is masked (overflow-clip) and rises from yPercent:5 + opacity:0
// to its resting position (yPercent:0 + opacity:1). Driven by GSAP SplitText +
// ScrollTrigger. Wired in PortfolioLayout.astro.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

// On mobile the address bar shows/hides while scrolling, which changes the
// viewport height and would otherwise make ScrollTrigger recompute start
// positions mid-scroll — causing reveals to fire late (only after you've
// already scrolled past the text). Pinning the resize handling keeps the
// start points stable.
ScrollTrigger.config({ ignoreMobileResize: true });

// Keep this list in sync with the pre-hide CSS and the IX2 filter in PortfolioLayout.astro.
export const TEXT_SELECTOR =
  'h1, h2, h3, h4, h5, h6, p, .wysiwyg, .service-car_list-item';

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

// Fire the reveal earlier on small screens: the short mobile viewport means a
// `top 85%` start lands very close to the fold, so text often only animates
// once it's already halfway up the screen. Trigger near the very bottom edge
// on mobile so lines are revealing as they enter view.
const isMobile = matchMedia('(max-width: 990px)').matches;
const revealStart = isMobile ? 'top 98%' : 'top 85%';

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
        return gsap.fromTo(
          self.lines,
          { yPercent: 100, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 1.2,
            ease: 'power4.out',
            stagger: 0.08,
            scrollTrigger: {
              trigger: el,
              start: revealStart,
              once: true,
            },
          }
        );
      },
    });

    el.style.visibility = 'visible';
  }

  showAll();
  ScrollTrigger.refresh();
}

// Split after fonts are ready so line breaks are measured correctly.
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(init);
} else {
  init();
}

// Safety net: never leave content hidden if something above fails.
setTimeout(showAll, 3000);
