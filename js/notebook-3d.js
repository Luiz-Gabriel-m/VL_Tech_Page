/* ==========================================================================
   NOTEBOOK 3D — Showcase Pinned com GSAP ScrollTrigger e Zoom-In
   - O notebook estilizado em 3D inicia AUTOMATICAMENTE aberto e centralizado,
     já exibindo o ambiente simulado com os cases em produção (Maciel Fit, etc.)
   - Ao rolar suavemente a página, aplica o zoom-in progressivo cinematográfico
   - Transição fluida e rápida para o portfólio sem depender de scroll prévio longo
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
  const glow = document.getElementById('notebookGlow');

  if (!section || !pinViewport || !lid || !device) return null;

  // Estado inicial direto em 3D: Frontal, aberto e 100% visível (conforme image_05b180.jpg)
  gsap.set(lid, { rotateX: 0 });
  gsap.set(device, {
    xPercent: 0,
    rotateY: 0,
    rotateX: 0,
    scale: 1,
    opacity: 1,
  });

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    gsap.set(lid, { rotateX: 0 });
    gsap.set(device, { xPercent: 0, rotateY: 0, rotateX: 0, scale: 1, opacity: 1 });
    return null;
  }

  // 1. Animação automática de entrada ao carregar / entrar na seção (sem exigir scroll prévio)
  let hasAutoPlayed = false;
  const playAutoEntrance = () => {
    if (hasAutoPlayed) return;
    hasAutoPlayed = true;

    const introTl = gsap.timeline({ defaults: { ease: 'power2.out' } });
    introTl
      .fromTo(device,
        { scale: 0.94, opacity: 0.85, y: 30 },
        { scale: 1, opacity: 1, y: 0, duration: 0.9 }
      )
      .fromTo(lid,
        { rotateX: 18 },
        { rotateX: 0, duration: 0.8, ease: 'power3.out' },
        '-=0.7'
      )
      .fromTo(glow,
        { opacity: 0.4, scale: 0.85 },
        { opacity: 1, scale: 1, duration: 1.1, ease: 'power2.out' },
        '-=0.8'
      );
  };

  // Dispara a inicialização automática assim que a seção aparece na viewport
  if (typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.create({
      trigger: section,
      start: 'top 85%',
      once: true,
      onEnter: playAutoEntrance,
    });
  } else {
    playAutoEntrance();
  }

  // 2. Timeline de Zoom-In progressivo no scroll (enxuto e ágil: +=1200)
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: '+=1200',
      pin: pinViewport,
      pinSpacing: true,
      scrub: 1.0,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    }
  });

  tl.to(hint, {
    opacity: 0,
    y: 12,
    duration: 0.3,
    ease: 'power2.in',
  }, 0)
  .to(introHeader, {
    opacity: 0,
    y: -24,
    duration: 0.5,
    ease: 'power2.in',
  }, 0.1)

  // Zoom-In direto e cinematográfico na tela do notebook cobrindo a viewport
  .to(device, {
    scale: 7.8,
    y: '22%',
    duration: 2.0,
    ease: 'power3.inOut',
  }, 0.2)
  .to(base, {
    opacity: 0,
    duration: 0.8,
    ease: 'power2.in',
  }, 0.5)
  .to(screenInner, {
    scale: 1.12,
    duration: 2.0,
    ease: 'power2.out',
  }, 0.2)

  // Pausa final suave antes do despinning para a seção de projetos
  .to({}, { duration: 0.4 }, 2.2);

  return { timeline: tl };
}
