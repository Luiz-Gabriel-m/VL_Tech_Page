/* ==========================================================================
   NOTEBOOK 3D — Showcase Pinned com GSAP ScrollTrigger e Zoom-In
   - O notebook estilizado em 3D inicia com deslize horizontal para o centro
   - Ao rolar a página, a tampa (lid) realiza a abertura fluida
   - Em seguida, dispara o efeito cinematográfico de zoom-in progressivo
   - A tela do notebook expande cobrindo 100% do viewport e revelando os cases
   ========================================================================== */

import { gsap, ScrollTrigger } from './core/gsap.js';

export function initNotebook3D() {
  const section = document.getElementById('portfolio-experience');
  const pinViewport = document.getElementById('notebookPinViewport');
  const lid = document.getElementById('notebookLid');
  const base = document.getElementById('notebookBase');
  const device = document.getElementById('notebookDevice');
  const introHeader = document.getElementById('notebookIntroHeader');
  const hint = document.getElementById('notebookScrollHint');
  const screenInner = document.getElementById('notebookScreenInner');

  if (!section || !pinViewport || !lid || !device) return null;

  // Estado inicial em 3D: Tampa semi-aberta e entrada lateral horizontal
  gsap.set(lid, { rotateX: 68 });
  gsap.set(device, {
    xPercent: 45,
    rotateY: 26,
    rotateX: 18,
    scale: 0.92,
    opacity: 0.95,
  });

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    gsap.set(lid, { rotateX: 0 });
    gsap.set(device, { xPercent: 0, rotateY: 0, rotateX: 0, scale: 1, opacity: 1 });
    return null;
  }

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: '+=2800',
      pin: pinViewport,
      pinSpacing: true,
      scrub: 1.15,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    }
  });

  // 1. Deslize horizontal revelando o notebook e trazendo para o centro do palco
  tl.to(device, {
    xPercent: 0,
    rotateY: 0,
    rotateX: 14,
    scale: 1,
    opacity: 1,
    duration: 1.2,
    ease: 'power2.out',
  }, 0)
  .to(hint, {
    opacity: 0,
    y: 16,
    duration: 0.4,
    ease: 'power2.in',
  }, 0.2)

  // 2. Abertura da tampa do notebook e alinhamento frontal
  .to(lid, {
    rotateX: 0,
    duration: 1.3,
    ease: 'power2.inOut',
  }, 0.8)
  .to(device, {
    rotateX: 0,
    scale: 1.04,
    duration: 1.0,
    ease: 'power2.out',
  }, 1.1)
  .to(introHeader, {
    opacity: 0,
    y: -30,
    duration: 0.8,
    ease: 'power2.in',
  }, 0.9)

  // 3. Zoom-In progressivo e cinematográfico na tela do notebook até cobrir 100% da viewport
  .to(device, {
    scale: 8.2,
    y: '24%',
    duration: 2.6,
    ease: 'power3.inOut',
  }, 1.8)
  .to(base, {
    opacity: 0,
    duration: 0.9,
    ease: 'power2.in',
  }, 2.0)
  .to(screenInner, {
    scale: 1.15,
    duration: 2.6,
    ease: 'power2.out',
  }, 1.8)

  // 4. Pausa de contemplação na tela expandida antes do despinning para o portfólio em leque
  .to({}, { duration: 0.8 }, 4.4);

  return { timeline: tl };
}
