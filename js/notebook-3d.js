/* ==========================================================================
   NOTEBOOK 3D & PORTFÓLIO — Sequência Interativa de Zoom e Matriz Binária
   1. Tela do notebook exibe animação fluida de cascata binária (0 e 1 - 100% Vermelho)
   2. GSAP ScrollTrigger fixa (pin) o notebook e aplica zoom-in progressivo na tela
   3. Os números binários somem rapidamente revelando os cases do portfólio imediatamente
   4. Sem espaço em branco: transição direta e contínua para os projetos
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

  const matrixOverlay = document.getElementById('screenMatrixOverlay');
  const matrixCanvas = document.getElementById('screenMatrixCanvas');

  if (!section || !pinViewport || !lid || !device) return null;

  // Estado inicial 3D: Frontal e aberto (conforme image_05b180.jpg)
  gsap.set(lid, { rotateX: 0 });
  gsap.set(device, {
    xPercent: 0,
    rotateY: 0,
    rotateX: 0,
    scale: 1,
    opacity: 1,
  });

  if (matrixOverlay) {
    gsap.set(matrixOverlay, { opacity: 1, display: 'flex' });
  }

  // =========================================================================
  // 1. ANIMAÇÃO DE MATRIZ (0 E 1) DENTRO DA TELA DO NOTEBOOK (100% VERMELHO)
  // =========================================================================
  let matrixAnimationId = null;
  let isScreenVisible = false;

  if (matrixCanvas && matrixOverlay) {
    const ctx = matrixCanvas.getContext('2d');
    const FONT_SIZE = 13;
    const BINARY = ['0', '1'];
    // Todos os dígitos 0 e 1 estritamente vermelhos neon VL Tech (sem verde)
    const RED_COLORS = [
      '#FF1E26',
      '#FF2A2A',
      '#FF0033',
      '#FF3B30',
      '#E11D48',
      '#FF4D4D',
      '#FF1122',
      '#FF3344',
      '#D6001C'
    ];

    let width = 0;
    let height = 0;
    let columns = 0;
    let drops = [];
    let speeds = [];
    let colColors = [];

    const resizeScreenCanvas = () => {
      const rect = matrixOverlay.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      if (width === 0 || height === 0) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      matrixCanvas.width = width * dpr;
      matrixCanvas.height = height * dpr;
      ctx.scale(dpr, dpr);

      columns = Math.floor(width / FONT_SIZE) + 1;
      drops = [];
      speeds = [];
      colColors = [];

      for (let i = 0; i < columns; i++) {
        drops[i] = Math.random() * -50;
        speeds[i] = 1.3 + Math.random() * 2.5;
        // 100% tonalidades de vermelho vibrante
        colColors[i] = RED_COLORS[Math.floor(Math.random() * RED_COLORS.length)];
      }
    };

    const renderScreenMatrix = () => {
      if (!isScreenVisible) {
        matrixAnimationId = null;
        return;
      }

      ctx.fillStyle = 'rgba(8, 8, 12, 0.24)';
      ctx.fillRect(0, 0, width, height);

      ctx.font = `bold ${FONT_SIZE}px "JetBrains Mono", monospace`;
      ctx.textAlign = 'center';

      for (let i = 0; i < columns; i++) {
        const char = BINARY[Math.floor(Math.random() * 2)];
        const x = i * FONT_SIZE + (FONT_SIZE / 2);
        const y = drops[i] * FONT_SIZE;

        // Cabeça com brilho branco/rosa ou vermelho elétrico intenso
        if (Math.random() > 0.92) {
          ctx.fillStyle = '#FFFFFF';
        } else {
          ctx.fillStyle = colColors[i];
        }

        ctx.fillText(char, x, y);

        if (y > height && Math.random() > 0.96) {
          drops[i] = 0;
          speeds[i] = 1.3 + Math.random() * 2.5;
        }

        drops[i] += speeds[i];
      }

      matrixAnimationId = requestAnimationFrame(renderScreenMatrix);
    };

    resizeScreenCanvas();
    window.addEventListener('resize', resizeScreenCanvas, { passive: true });

    // Observador para economizar GPU quando o notebook não estiver na tela
    const screenObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          isScreenVisible = true;
          if (!matrixAnimationId) {
            matrixAnimationId = requestAnimationFrame(renderScreenMatrix);
          }
        } else {
          isScreenVisible = false;
        }
      });
    }, { rootMargin: '100px' });

    screenObserver.observe(section);
  }

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    if (matrixOverlay) gsap.set(matrixOverlay, { opacity: 0 });
    return null;
  }

  // Animação sutil de entrada automática ao atingir a seção
  if (typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.create({
      trigger: section,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.fromTo(device,
          { scale: 0.95, y: 20 },
          { scale: 1, y: 0, duration: 0.8, ease: 'power2.out' }
        );
        gsap.fromTo(glow,
          { opacity: 0.3 },
          { opacity: 1, duration: 1.0, ease: 'power2.out' }
        );
      }
    });
  }

  // =========================================================================
  // 2. ZOOM-IN PROGRESSIVO COM SCROLLTRIGGER (PINNING)
  // 3. FADE-OUT IMEDIATO DOS 0 E 1 REVELANDO OS ELEMENTOS DO PORTFÓLIO
  // =========================================================================
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: '+=900',
      pin: pinViewport,
      pinSpacing: true,
      scrub: 0.9,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    }
  });

  // Fase 1: Desaparecimento de cabeçalho e dicas
  tl.to(hint, {
    opacity: 0,
    y: 10,
    duration: 0.15,
    ease: 'power2.in',
  }, 0)
  .to(introHeader, {
    opacity: 0,
    y: -20,
    duration: 0.25,
    ease: 'power2.in',
  }, 0.05)

  // Fase 2: Zoom-In cinematográfico na tela do notebook até enquadrar perfeitamente os cases
  .to(device, {
    scale: 3.8,
    y: '-2%',
    duration: 1.2,
    ease: 'power2.inOut',
  }, 0.1)
  .to(base, {
    opacity: 0,
    duration: 0.4,
    ease: 'power2.in',
  }, 0.2)
  .to(screenInner, {
    scale: 1.05,
    duration: 1.2,
    ease: 'power2.out',
  }, 0.1);

  // Fase 3: Ao dar zoom, os números binários (0 e 1) somem rapidamente,
  // revelando os elementos do portfólio (cases em produção) imediatamente,
  // sem deixar nenhum espaço em branco!
  if (matrixOverlay) {
    tl.to(matrixOverlay, {
      opacity: 0,
      duration: 0.35,
      ease: 'power2.out',
    }, 0.45);
  }

  return { timeline: tl };
}
