/* ==========================================================================
   WHY CHOOSE US — Pinned Horizontal Scrollytelling Sequence
   - GSAP 3 + ScrollTrigger pinned horizontal scroll (scrub: 1, pin: true).
   - Strict Black & Red Aesthetic: pure black background, crisp white headers,
     and vibrant neon red glows (#ff2a2a). Zero lime/cyan accents.
   - Pinned scrollytelling container locks vertical page scrolling temporarily,
     sliding smoothly horizontally to reveal all differential cards sequentially
     from left to right until the final card is fully revealed.
   - Smooth 60 FPS performance with GPU hardware acceleration.
   ========================================================================== */

import { gsap, ScrollTrigger } from './core/gsap.js';

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function initWhyChooseUs() {
  const section = document.getElementById('mensagem');
  if (!section) return null;

  const viewport = section.querySelector('.why-viewport');
  const track = section.querySelector('.why-track');
  const slides = section.querySelectorAll('.why-slide');
  const progressFill = document.getElementById('whyProgressBarFill');
  const progressCounter = document.getElementById('whyProgressCounter');

  if (!viewport || !track || slides.length === 0) return null;

  if (prefersReducedMotion()) {
    section.classList.add('is-reduced-motion');
    return null;
  }

  // ---------------------------------------------------------------------------
  // 1. CÁLCULO DINÂMICO DA DISTÂNCIA DE ROLAGEM HORIZONTAL
  // ---------------------------------------------------------------------------
  const getScrollDistance = () => {
    // Distância total necessária para que o último card fique completamente visível
    return Math.max(0, track.scrollWidth - window.innerWidth);
  };

  // ---------------------------------------------------------------------------
  // 2. TIMELINE HORIZONTAL ACIONADA POR SCROLLTRIGGER COM PIN & SCRUB
  // ---------------------------------------------------------------------------
  const horizontalTl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      pin: true,
      start: 'top top',
      end: () => `+=${Math.round(getScrollDistance() + window.innerHeight * 0.85)}`,
      scrub: 1, // Suavização fluida de inércia a 60 FPS
      invalidateOnRefresh: true,
      anticipatePin: 1,
      onUpdate: (self) => {
        const percent = Math.min(100, Math.max(0, Math.round(self.progress * 100)));
        if (progressFill) progressFill.style.width = `${percent}%`;
        if (progressCounter) progressCounter.textContent = `${percent}%`;
      },
    },
  });

  // Movimenta suavemente o trilho horizontal revelando cada diferencial da esquerda para a direita
  horizontalTl.to(track, {
    x: () => -getScrollDistance(),
    ease: 'none',
    duration: 1,
  });

  // Período de acomodação no último card (Pilar 04 com CTAs) antes de liberar o scroll vertical da página
  horizontalTl.to({}, { duration: 0.18 });

  // ---------------------------------------------------------------------------
  // 3. PARALLAX SUTIL E REVEAL DAS MARCAS D'ÁGUA E PILARES INDIVIDUAIS
  // ---------------------------------------------------------------------------
  slides.forEach((slide, idx) => {
    const watermark = slide.querySelector('.why-ghost-watermark');
    const card = slide.querySelector('.why-pillar-card');

    if (watermark) {
      gsap.to(watermark, {
        xPercent: -30,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${Math.round(getScrollDistance() + window.innerHeight * 0.85)}`,
          scrub: 1.5,
        },
      });
    }

    if (card && idx > 0) {
      // Efeito de entrada suave dos cards conforme entram no viewport
      gsap.fromTo(
        card,
        { y: 35, opacity: 0.75, scale: 0.98 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: slide,
            containerAnimation: horizontalTl,
            start: 'left 85%',
            toggleActions: 'play reverse play reverse',
          },
        }
      );
    }
  });

  // Atualiza gatilhos ao redimensionar a tela
  const onResize = () => ScrollTrigger.refresh();
  window.addEventListener('resize', onResize);

  return {
    timeline: horizontalTl,
    refresh: () => ScrollTrigger.refresh(),
    destroy: () => {
      window.removeEventListener('resize', onResize);
      horizontalTl.kill();
    },
  };
}
