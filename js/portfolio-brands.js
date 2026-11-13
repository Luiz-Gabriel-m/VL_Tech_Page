/* ==========================================================================
   PORTFÓLIO DE MARCAS — ANIMAÇÕES GSAP & MICRO-INTERAÇÕES
   Zildo Oliveira · G4 Beneficiadora · Maciel Fit · Marinho Odonto · Ribeiro Team
   ========================================================================== */

import { gsap, ScrollTrigger } from './core/gsap.js';

export function initPortfolioBrands() {
  const grid = document.getElementById('portfolioBrandsGrid');
  if (!grid) return null;

  const cards = grid.querySelectorAll('.brand-showcase-card');
  if (!cards.length) return null;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return null;

  // Animação de entrada fluida escalonada (Stagger)
  const anim = gsap.fromTo(
    cards,
    {
      opacity: 0,
      y: 45,
      scale: 0.96,
    },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        id: 'portfolio-brands',
        trigger: grid,
        start: 'top 82%',
        toggleActions: 'play none none reverse',
      },
    }
  );

  return {
    destroy: () => {
      anim.kill();
      ScrollTrigger.getById('portfolio-brands')?.kill();
    },
  };
}
