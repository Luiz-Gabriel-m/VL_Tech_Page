/* ==========================================================================
   CORE — Ponte entre o GSAP global (CDN) e os módulos ES
   Todos os módulos devem importar gsap/ScrollTrigger daqui, nunca do window.
   ========================================================================== */

const { gsap, ScrollTrigger } = window;

/** true quando GSAP e ScrollTrigger foram carregados com sucesso pela CDN */
export const isReady = Boolean(gsap && ScrollTrigger);

/** Media query usada para respeitar a preferência de movimento reduzido */
export const MOTION_OK = '(prefers-reduced-motion: no-preference)';

/** Breakpoints espelhados do layout.css */
export const BREAKPOINTS = {
  mobile: '(max-width: 600px)',
  tablet: '(max-width: 860px)',
  desktop: '(min-width: 861px)',
};

/** Instância compartilhada de matchMedia — reverte animações automaticamente */
export const mm = isReady ? gsap.matchMedia() : null;

if (isReady) {
  gsap.registerPlugin(ScrollTrigger);

  gsap.defaults({
    ease: 'power3.out',
    duration: 1,
  });

  ScrollTrigger.defaults({
    toggleActions: 'play none none none',
  });

  // Evita saltos de layout ao abrir/fechar a barra de endereço no mobile
  ScrollTrigger.config({ ignoreMobileResize: true });
}

export { gsap, ScrollTrigger };
