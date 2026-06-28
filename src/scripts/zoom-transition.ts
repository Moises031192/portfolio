// Transición de zoom ligada al scroll (.description-zoom-transition).
// La sección mide 500svh y su .sticky-container queda pegado al viewport.
//
// La animación arranca cuando el bloque sticky llena por completo el viewport
// (start: 'top top') y se desarrolla durante el resto del scroll de la sección.
//
// Efecto "marco": el .main-image-wrapper (overflow: hidden) actúa de MÁSCARA y
// crece hasta cubrir la pantalla (100vw/100vh). La .main-image interior es
// siempre MÁS GRANDE que su contenedor y crece a un RITMO DISTINTO (otra escala
// y otro ease), por lo que parece deslizarse/parallax dentro del marco mientras
// este se abre. Las demás imágenes (.fading-image) se desvanecen.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

function init() {
  if (reduceMotion) return;

  const sections = document.querySelectorAll<HTMLElement>(
    '.description-zoom-transition'
  );

  sections.forEach((section) => {
    const wrapper = section.querySelector<HTMLElement>('.main-image-wrapper');
    if (!wrapper) return;

    const image = wrapper.querySelector<HTMLElement>('.main-image');
    const others = Array.from(
      section.querySelectorAll<HTMLElement>('.fading-image')
    );

    // Escala uniforme para que la máscara cubra el viewport por completo (la
    // mayor de las dos ratios -> sin deformar). offsetWidth/Height dan el tamaño
    // de layout SIN transform, así que el cálculo es estable aunque ya escale.
    const targetScale = () =>
      Math.max(
        window.innerWidth / wrapper.offsetWidth,
        window.innerHeight / wrapper.offsetHeight
      );

    gsap.set(wrapper, { transformOrigin: '50% 50%', willChange: 'transform' });
    if (image) {
      gsap.set(image, { transformOrigin: '50% 50%', willChange: 'transform' });
    }

    // Compás estático inicial: durante este tramo (fracción del scroll de la
    // sección) la composición se mantiene completa, centrada y quieta. El zoom
    // solo empieza después, nunca antes de que todo esté a la vista.
    const HOLD = 0.15;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top', // el bloque sticky ya llena el viewport (imagen centrada)
        end: 'bottom bottom',
        scrub: true,
        invalidateOnRefresh: true,
      },
    });

    // Tiempo muerto inicial: nada se mueve hasta superar el compás de espera.
    tl.to({}, { duration: HOLD });

    // La máscara (contenedor) crece de su tamaño original hasta cubrir la
    // pantalla, de forma lineal con el scroll.
    tl.fromTo(
      wrapper,
      { scale: 1 },
      { scale: targetScale, ease: 'none', duration: 1 - HOLD },
      HOLD
    );

    // La imagen interior, siempre mayor que el contenedor, crece a otro ritmo
    // (otra magnitud + ease distinto) -> efecto de marco/parallax.
    if (image) {
      tl.fromTo(
        image,
        { scale: 1.2 },
        { scale: 1.6, ease: 'power1.out', duration: 1 - HOLD },
        HOLD
      );
    }

    if (others.length) {
      tl.to(
        others,
        { autoAlpha: 0, ease: 'none', duration: (1 - HOLD) * 0.6 },
        HOLD
      );
    }
  });

  ScrollTrigger.refresh();
}

// Inicia tras cargar las fuentes para que las medidas (offsetWidth/Height) sean
// correctas.
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(init);
} else {
  init();
}

// --- Recalcular posiciones cuando TODO el contenido esté cargado ---
// ScrollTrigger fija los puntos start/end al inicializarse (en fonts.ready), pero
// las imágenes lazy de la página cargan después y desplazan el documento, dejando
// esos puntos obsoletos -> las animaciones se disparaban en el sitio equivocado
// hasta recargar. refresh() recalcula TODOS los triggers (zoom, carrusel, texto).

// 1) Cuando la ventana termina de cargar (incluidas imágenes y fuentes).
window.addEventListener('load', () => ScrollTrigger.refresh());

// 2) Y por cada imagen que aún no estaba cargada al iniciar (p. ej. lazy), en
//    cuanto termine. Los <script type="module"> son diferidos, así que el DOM ya
//    está parseado y podemos recorrer las imágenes directamente.
document.querySelectorAll<HTMLImageElement>('img').forEach((img) => {
  if (!img.complete) {
    img.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
  }
});
