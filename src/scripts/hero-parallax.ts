// Parallax del hero en las páginas de proyecto (akra-restaurante, basica-co,
// estudioarquo, etc.). La imagen de fondo (.hero_project_bg) se desplaza
// ligeramente hacia abajo a medida que el usuario hace scroll por la sección,
// creando profundidad. Wired en PortfolioLayout.astro.
//
// Solo usamos transforms: un scale leve da "overscan" para que el movimiento no
// revele huecos dentro del .hero_project (overflow:hidden), y yPercent ligado al
// scroll (scrub) mueve la imagen. Así no tocamos el CSS exportado de Webflow ni
// sus overrides responsive. ScrollTrigger ya queda sincronizado con el smooth
// scroll de Locomotive (ver smooth-scroll.ts).
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const sections = document.querySelectorAll<HTMLElement>('.hero_project');

  sections.forEach((section) => {
    const img = section.querySelector<HTMLElement>('.hero_project_bg');
    if (!img) return;

    img.style.willChange = 'transform';

    gsap.fromTo(
      img,
      { yPercent: -4, scale: 1.12 },
      {
        yPercent: 4,
        scale: 1.12,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      }
    );
  });
}
