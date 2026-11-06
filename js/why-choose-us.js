/* ==========================================================================
   WHY CHOOSE US — Horizontal Scrollytelling Typography Sequence
   - GSAP 3 + ScrollTrigger pinned horizontal scroll (scrubbing right to left).
   - Massive typographic headers addressing "Por que escolher a VL Tech".
   - Starts clean with minimal initial breathing space.
   - Deep dark theme (#111112), crisp white headers, glowing red (#ff2a2a)
     and lime (#d2ff00) accents.
   - Smooth 60 FPS transitions with GPU acceleration.
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
    // Distância total necessária para que o último slide termine no canto direito
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
      end: () => `+=${getScrollDistance() + 450}`,
      scrub: 1.1, // Suavização fluida de inércia (60 FPS)
      invalidateOnRefresh: true,
      anticipatePin: 1,
      onUpdate: (self) => {
        const percent = Math.min(100, Math.max(0, Math.round(self.progress * 100)));
        if (progressFill) progressFill.style.width = `${percent}%`;
        if (progressCounter) progressCounter.textContent = `${percent}%`;
      },
    },
  });

  // Movimenta todo o trilho horizontal suavemente da direita para a esquerda
  horizontalTl.to(track, {
    x: () => -getScrollDistance(),
    ease: 'none', // linear dentro do scrub para mapeamento perfeito com a rolagem
  });

  // ---------------------------------------------------------------------------
  // 3. PARALLAX SUTIL E REVEAL DAS MARCAS D'ÁGUA E PILARES INDIVIDUAIS
  // ---------------------------------------------------------------------------
  slides.forEach((slide, idx) => {
    const watermark = slide.querySelector('.why-ghost-watermark');
    const card = slide.querySelector('.why-pillar-card');

    if (watermark) {
      gsap.to(watermark, {
        xPercent: -35,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${getScrollDistance() + 450}`,
          scrub: 1.6,
        },
      });
    }

    if (card && idx > 0) {
      // Efeito de entrada suave dos cards conforme entram no viewport
      gsap.fromTo(
        card,
        { y: 30, opacity: 0.88 },
        {
          y: 0,
          opacity: 1,
          duration: 0.55,
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
