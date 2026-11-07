/* ==========================================================================
   WHY CHOOSE US — Pinned Horizontal Scrollytelling Sequence
   - GSAP 3 + ScrollTrigger pinned horizontal scroll (scrub: 1, pin: true, pinSpacing: true, anticipatePin: 1).
   - Strict Black & Red Aesthetic: pure black background, crisp white typography,
     and vibrant neon red glows (#ff2a2a). Zero lime/cyan accents.
   - Pinned scrollytelling container locks vertical page scrolling immediately on entry.
   - As the user scrolls down, the entire sequence of cards slides horizontally
     seamlessly, remaining locked until every single card has completely traversed
     the screen and been fully displayed.
   - Dynamic width & end calculation: end: () => "+=" + (track.scrollWidth - window.innerWidth).
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
  // 1. CÁLCULO DINÂMICO DA DISTÂNCIA DE ROLAGEM HORIZONTAL (LOCKED 1:1)
  // ---------------------------------------------------------------------------
  const getScrollDistance = () => {
    // Distância exata necessária para que todos os cards percorram a tela completamente
    return Math.max(0, track.scrollWidth - window.innerWidth);
  };

  // ---------------------------------------------------------------------------
  // 2. TIMELINE HORIZONTAL ACIONADA POR SCROLLTRIGGER COM PIN & SCRUB
  // ---------------------------------------------------------------------------
  const horizontalTl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      pin: true,
      pinSpacing: true, // Garante travamento rígido e impede sobreposição com a próxima seção
      start: 'top top',
      end: () => `+=${getScrollDistance()}`, // Distância calculada dinamicamente com base no scrollWidth
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

  // Movimenta suavemente o trilho horizontal de forma contínua até o último card
  horizontalTl.to(track, {
    x: () => -getScrollDistance(),
    ease: 'none',
    duration: 1,
  });

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
          end: () => `+=${getScrollDistance()}`,
          scrub: 1.2,
        },
      });
    }

    if (card && idx > 0) {
      // Efeito de entrada suave dos cards conforme entram no viewport
      gsap.fromTo(
        card,
        { y: 30, opacity: 0.8, scale: 0.98 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.5,
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
    timeline: horizontalTl,
    refresh: () => ScrollTrigger.refresh(),
    destroy: () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('load', onResize);
      horizontalTl.kill();
    },
  };
}
