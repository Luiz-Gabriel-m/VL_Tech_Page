/* ==========================================================================
   NOTEBOOK 3D — Showcase Pinned com GSAP ScrollTrigger e Zoom-In
   - O notebook estilizado em 3D inicia no palco em perspectiva
   - Ao rolar a página, a tampa (lid) realiza a abertura fluida
   - Em seguida, dispara o efeito cinematográfico de zoom-in progressivo
   - A tela do notebook expande cobrindo o viewport e revelando os cases
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

  // Estado inicial em 3D: tampa semi-aberta com inclinação editorial
  gsap.set(lid, { rotateX: 68 });
  gsap.set(device, { rotateX: 18, rotateY: -8, scale: 0.92 });

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    gsap.set(lid, { rotateX: 0 });
    gsap.set(device, { rotateX: 0, rotateY: 0, scale: 1 });
    return null;
  }

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: '+=2400',
      pin: pinViewport,
      pinSpacing: true,
      scrub: 1.15,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    }
  });

  // 1. Abertura da tampa do notebook e alinhamento frontal
  tl.to(lid, {
    rotateX: 0,
    duration: 1.2,
    ease: 'power2.inOut',
  }, 0)
  .to(device, {
    rotateX: 0,
    rotateY: 0,
    scale: 1.04,
    duration: 1.2,
    ease: 'power2.out',
  }, 0)
  .to(hint, {
    opacity: 0,
    y: 16,
    duration: 0.4,
    ease: 'power2.in',
  }, 0.2)
  .to(introHeader, {
    opacity: 0,
    y: -30,
    duration: 0.8,
    ease: 'power2.in',
  }, 0.5)

  // 2. Zoom-In progressivo e cinematográfico na tela do notebook
  .to(device, {
    scale: 6.5,
    y: '22%',
    duration: 2.2,
    ease: 'power3.inOut',
  }, 1.2)
  .to(base, {
    opacity: 0,
    duration: 0.9,
    ease: 'power2.in',
  }, 1.6)
  .to(screenInner, {
    scale: 1.12,
    duration: 2.2,
    ease: 'power2.out',
  }, 1.2)
  // Pausa final de contemplação antes da liberação do pin
  .to({}, { duration: 0.8 }, 3.4);

  return { timeline: tl };
}
