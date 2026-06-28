// Doble carrusel de imágenes (.description_carousel) presente en las páginas de
// proyecto. El desplazamiento horizontal va ligado al scroll del navegador
// (scrub): al bajar, la fila superior va de derecha a izquierda y la inferior
// de izquierda a derecha; al subir, el movimiento se invierte automáticamente.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

function init() {
  if (reduceMotion) return;

  const carousels = document.querySelectorAll<HTMLElement>('.description_carousel');

  carousels.forEach((carousel) => {
    const upper = carousel.querySelector<HTMLElement>(
      '.description_carousel_upperrow'
    );
    const bottom = carousel.querySelector<HTMLElement>(
      '.description_carousel_bottomrow'
    );
    if (!upper || !bottom) return;

    // Cuánto sobresale cada fila respecto al contenedor (lo que hay para recorrer).
    const overflow = (row: HTMLElement) =>
      Math.max(0, row.scrollWidth - carousel.clientWidth);

    // Fila superior: empieza pegada a la izquierda y se desplaza hacia la
    // izquierda (derecha -> izquierda) conforme se baja.
    gsap.fromTo(
      upper,
      { x: 0 },
      {
        x: () => -overflow(upper),
        ease: 'none',
        scrollTrigger: {
          trigger: carousel,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
          invalidateOnRefresh: true,
        },
      }
    );

    // Fila inferior: empieza desplazada a la izquierda y avanza hacia la
    // derecha (izquierda -> derecha) conforme se baja.
    gsap.fromTo(
      bottom,
      { x: () => -overflow(bottom) },
      {
        x: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: carousel,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
          invalidateOnRefresh: true,
        },
      }
    );
  });

  ScrollTrigger.refresh();
}

// Inicia tras cargar las fuentes para que los anchos (scrollWidth) sean correctos.
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(init);
} else {
  init();
}
