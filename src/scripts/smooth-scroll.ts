// Smooth scroll vertical con Locomotive Scroll v5 (https://github.com/locomotivemtl/locomotive-scroll).
// La v5 está construida sobre Lenis y mantiene el scroll NATIVO (no secuestra la
// posición con transforms), por lo que respeta los position:fixed (cursor,
// bottom-navbar), el IntersectionObserver de reveal y todo el GSAP ScrollTrigger
// que ya usa la web; solo suaviza el desplazamiento. Wired en PortfolioLayout.astro.
import LocomotiveScroll from 'locomotive-scroll';
import 'locomotive-scroll/dist/locomotive-scroll.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Respeta a quien prefiere movimiento reducido: scroll nativo sin suavizado.
if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const locomotiveScroll = new LocomotiveScroll({
    lenisOptions: {
      lerp: 0.09,
      duration: 1.2,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    },
    // En cada frame del scroll suave, mantenemos ScrollTrigger sincronizado
    // para que los reveals/scrubs ligados al scroll vayan perfectamente a la par.
    scrollCallback: () => ScrollTrigger.update(),
  });

  // Cuando ScrollTrigger recalcula posiciones (resize, carga de fuentes, etc.),
  // pedimos a Locomotive que vuelva a medir el documento.
  ScrollTrigger.addEventListener('refresh', () => locomotiveScroll.resize());
  ScrollTrigger.refresh();

  // Disponible en window por si se necesita para anclas o depuración.
  (window as unknown as { locomotiveScroll: LocomotiveScroll }).locomotiveScroll =
    locomotiveScroll;
}
