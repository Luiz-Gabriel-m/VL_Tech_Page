/* ==========================================================================
   WHY CHOOSE US — Pinned Horizontal Scrollytelling Sequence
   - GSAP 3 + ScrollTrigger pinned horizontal scroll matching "Soluções & Serviços"
   - Static left intro header (#why-section-title) anchored in the pinned viewport
   - Sequential cards on the right moving across the screen seamlessly
   - Strict lock: Vertical scroll remains locked until all cards have traversed
   - Dynamic track width calculation: end: () => "+=" + getScrollDistance()
   - Zero gaps, 60 FPS smooth scrubbing with GPU acceleration
   ========================================================================== */

import { gsap, ScrollTrigger } from './core/gsap.js';

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function initWhyChooseUs() {
  const section = document.getElementById('mensagem');
  if (!section) return null;

  const container = section.querySelector('#why-scroll-container') || section;
  const pinWrapper = section.querySelector('#why-pin-wrapper') || section;
  const track = section.querySelector('#whyTrack');
  const cards = section.querySelectorAll('.why-card, .service-hcard');

  if (!container || !pinWrapper || !track || cards.length === 0) return null;

  if (prefersReducedMotion()) {
    section.classList.add('is-reduced-motion');
    return null;
  }

  // ---------------------------------------------------------------------------
  // 1. CÁLCULO DINÂMICO DA DISTÂNCIA DE ROLAGEM HORIZONTAL
  // ---------------------------------------------------------------------------
  const getScrollDistance = () => {
    const startOffset = track.offsetLeft || 0;
    return Math.max(0, startOffset + track.scrollWidth - window.innerWidth + 80);
  };

  // ---------------------------------------------------------------------------
  // 2. TWEEN HORIZONTAL ACIONADO POR SCROLLTRIGGER COM PIN & SCRUB
  // ---------------------------------------------------------------------------
  const horizontalTween = gsap.to(track, {
    x: () => -getScrollDistance(),
    ease: 'none',
    scrollTrigger: {
      trigger: section,
      pin: pinWrapper,
      start: 'top top',
      end: () => `+=${getScrollDistance()}`,
      scrub: 1,
      pinSpacing: true,
      invalidateOnRefresh: true,
      anticipatePin: 1,
    },
  });

  // ---------------------------------------------------------------------------
  // 3. MICRO-INTERAÇÕES DE REVELAÇÃO INDIVIDUAL DOS CARDS
  // ---------------------------------------------------------------------------
  cards.forEach((card) => {
    gsap.fromTo(
      card,
      { opacity: 0.82, scale: 0.96 },
      {
        opacity: 1,
        scale: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: card,
          containerAnimation: horizontalTween,
          start: 'left 95%',
          end: 'left 35%',
          scrub: true,
        },
      }
    );
  });

  // Recálculo dinâmico garantido quando fontes personalizadas carregarem
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      ScrollTrigger.refresh();
    });
  }

  // Atualiza gatilhos ao redimensionar ou carregar completamente a página
  const onResize = () => ScrollTrigger.refresh();
  window.addEventListener('resize', onResize);
  window.addEventListener('load', onResize);

  return {
    timeline: horizontalTween,
    refresh: () => ScrollTrigger.refresh(),
    destroy: () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('load', onResize);
      horizontalTween.kill();
    },
  };
}
