/* ==========================================================================
   PARCEIROS & TECNOLOGIAS — ULTRA-MODERN GLASSMORPHIC TECH STACK
   GSAP 3 ScrollTrigger Staggered Reveal & Interactive Specular Sheen
   ========================================================================== */

import { gsap, ScrollTrigger, isReady } from './core/gsap.js';

export function initPartnersTech() {
  const section = document.getElementById('parceiros');
  if (!section) return null;

  const grid = document.getElementById('techStackGrid');
  const cards = section.querySelectorAll('.tech-glass-card');
  const header = section.querySelector('.partners-tech-header');

  // ---------------------------------------------------------------------------
  // 1. EFEITO DE REFLEXO ESPECULAR INTERATIVO (MOUSEMOVE SPOTLIGHT)
  // ---------------------------------------------------------------------------
  cards.forEach((card) => {
    let ticking = false;

    card.addEventListener('mousemove', (e) => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        card.style.setProperty('--mouse-x', `${x.toFixed(2)}%`);
        card.style.setProperty('--mouse-y', `${y.toFixed(2)}%`);
        ticking = false;
      });
    });

    card.addEventListener('mouseleave', () => {
      card.style.removeProperty('--mouse-x');
      card.style.removeProperty('--mouse-y');
    });
  });

  if (!isReady || !gsap) return null;

  // ---------------------------------------------------------------------------
  // 2. ENTRADA SUAVE DO CABEÇALHO (HEADER REVEAL)
  // ---------------------------------------------------------------------------
  if (header) {
    const badge = header.querySelector('.partners-header__badge');
    const title = header.querySelector('.tech-main-title');
    const lead = header.querySelector('.tech-lead-text');

    const headerTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });

    if (badge) {
      headerTimeline.fromTo(
        badge,
        { opacity: 0, y: 25, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'power3.out' }
      );
    }

    if (title) {
      headerTimeline.fromTo(
        title,
        { opacity: 0, y: 35 },
        { opacity: 1, y: 0, duration: 0.85, ease: 'power3.out' },
        '-=0.45'
      );
    }

    if (lead) {
      headerTimeline.fromTo(
        lead,
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out' },
        '-=0.55'
      );
    }
  }

  // ---------------------------------------------------------------------------
  // 3. ENTRADA ESCALONADA DOS CARDS GLASSMÓRFICOS (STAGGERED GSAP ENTRANCE)
  // ---------------------------------------------------------------------------
  if (cards.length && grid) {
    gsap.fromTo(
      cards,
      {
        opacity: 0,
        y: 45,
        scale: 0.94,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: grid,
          start: 'top 84%',
          toggleActions: 'play none none none',
        },
      }
    );
  }

  return {
    refresh: () => ScrollTrigger?.refresh(),
  };
}
