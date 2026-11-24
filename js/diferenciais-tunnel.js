/* ==========================================================================
   DIFERENCIAIS TUNNEL 3D — Adaptado da 21st.dev (PerspectiveTunnelHero)
   - 8 diferenciais da VL Tech voando em corredor 3D (espiral do ângulo áureo)
   - CSS position: sticky nativo + GSAP ScrollTrigger scrub (zero pin-spacer!)
   - Parallax de câmera suavizado com IDLE SLEEP real (0% CPU parado)
   - ZERO getBoundingClientRect() no pointermove / ZERO filter em tweens
   ========================================================================== */

import { gsap, ScrollTrigger } from './core/gsap.js';
import { playHover } from './sound.js';

const GOLDEN_ANGLE_RAD = 137.5 * (Math.PI / 180);
const TUNNEL_END = 0.94;
const STAGGER_SPAN = 0.48;

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const remap = (v, inMin, inMax, outMin, outMax) => {
  const t = clamp((v - inMin) / (inMax - inMin || 1), 0, 1);
  return outMin + (outMax - outMin) * t;
};

export function initDiferenciaisTunnel() {
  const section = document.getElementById('diferenciais');
  if (!section) return null;

  const viewport = section.querySelector('#dtunnelViewport');
  const bgWrap = section.querySelector('#dtunnelBgWrap');
  const anchor = section.querySelector('#dtunnelAnchor');
  const prompt = section.querySelector('#dtunnelPrompt');
  const progressBar = section.querySelector('#dtunnelProgress');
  const progressFill = section.querySelector('#dtunnelProgressFill');
  const cardEls = Array.from(section.querySelectorAll('.dtunnel-card'));

  if (!viewport || !cardEls.length) return null;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(pointer: coarse)').matches;

  if (prefersReduced || !gsap || !ScrollTrigger) {
    return null;
  }

  const total = cardEls.length;

  // Pré-calcula geometria de cada card na espiral do ângulo áureo (igual PerspectiveTunnelHero)
  const cards = cardEls.map((el, i) => {
    const angle = i * GOLDEN_ANGLE_RAD;
    const radiusFactorX = 0.27 + (i % 3) * 0.075;
    const radiusFactorY = 0.25 + (i % 2) * 0.085;
    const rotationZ = (i % 2 === 0 ? 1 : -1) * (3 + (i % 5) * 1.8);
    const start = (i / total) * (1 - STAGGER_SPAN);
    const end = start + STAGGER_SPAN;

    el.style.zIndex = String(i + 1);
    el.addEventListener('mouseenter', () => {
      try { playHover(); } catch (_) {}
    });

    return {
      el,
      angleCos: Math.cos(angle),
      angleSin: Math.sin(angle),
      radiusFactorX,
      radiusFactorY,
      rotationZ,
      start,
      end,
      baseX: 0,
      baseY: 0,
      visible: false,
    };
  });

  // Dimensões cacheadas no resize (ZERO layout read em scroll/pointermove)
  let stageW = window.innerWidth;
  let stageH = window.innerHeight;
  let isMobile = stageW < 768;
  let farZ = -1650;
  let nearZ = 480;
  let panStrength = 44;

  function computeMetrics() {
    stageW = viewport.clientWidth || window.innerWidth;
    stageH = viewport.clientHeight || window.innerHeight;
    isMobile = stageW < 768;
    farZ = isMobile ? -1150 : -1650;
    nearZ = isMobile ? 340 : 480;
    panStrength = isMobile ? 16 : 44;

    const cardWidth = isMobile
      ? Math.max(142, Math.min(188, stageW * 0.42))
      : Math.max(195, Math.min(278, stageW * 0.19));

    for (let i = 0; i < total; i++) {
      const c = cards[i];
      c.baseX = c.angleCos * (stageW * c.radiusFactorX);
      c.baseY = c.angleSin * (stageH * c.radiusFactorY);
      c.el.style.width = `${cardWidth.toFixed(1)}px`;
    }
  }

  // Estado de progresso (controlado por ScrollTrigger) e parallax (ponteiro)
  const state = { p: 0 };
  let targetPx = 0;
  let targetPy = 0;
  let currPx = 0;
  let currPy = 0;
  let isVisible = false;
  let rafId = null;

  function render() {
    const p = state.p;
    const tunnelP = clamp(p / TUNNEL_END, 0, 1);

    // 1. Cards voando no túnel Z-space (somente os dentro do intervalo ficam visíveis)
    for (let i = 0; i < total; i++) {
      const c = cards[i];
      if (tunnelP <= c.start || tunnelP >= c.end) {
        if (c.visible) {
          c.visible = false;
          c.el.style.opacity = '0';
          c.el.style.visibility = 'hidden';
        }
        continue;
      }

      const localP = (tunnelP - c.start) / (c.end - c.start);
      const z = farZ + (nearZ - farZ) * localP;

      let alpha;
      if (localP < 0.18) {
        alpha = localP / 0.18;
      } else if (localP > 0.8) {
        alpha = clamp(1 - (localP - 0.8) / 0.18, 0, 1);
      } else {
        alpha = 1;
      }

      const offsetX = c.baseX - currPx * panStrength;
      const offsetY = c.baseY - currPy * panStrength;

      if (!c.visible) {
        c.visible = true;
        c.el.style.visibility = 'visible';
      }

      c.el.style.opacity = alpha.toFixed(3);
      c.el.style.transform =
        `translate3d(calc(-50% + ${offsetX.toFixed(1)}px), calc(-50% + ${offsetY.toFixed(1)}px), ${z.toFixed(1)}px)` +
        ` rotateZ(${c.rotationZ}deg)`;
    }

    // 2. Título âncora central dos Diferenciais (cresce suavemente e sai 100% antes do final)
    if (anchor) {
      const anchorScale =
        p < 0.45
          ? remap(p, 0, 0.45, 0.78, 1)
          : remap(p, 0.45, 0.84, 1, 1.28);

      let anchorOpacity;
      if (p < 0.1) {
        anchorOpacity = remap(p, 0, 0.1, 0.35, 1);
      } else if (p > 0.7) {
        anchorOpacity = remap(p, 0.7, 0.84, 1, 0);
      } else {
        anchorOpacity = 1;
      }

      anchor.style.opacity = anchorOpacity.toFixed(3);
      anchor.style.transform = `scale(${anchorScale.toFixed(4)})`;
    }

    // 3. Prompt de scroll inicial
    if (prompt) {
      prompt.style.opacity = remap(p, 0, 0.1, 1, 0).toFixed(3);
    }

    // 4. Fundo (grid, glow, anéis) e barra de progresso suavizam na saída da seção
    const bgOpacity = p > 0.86 ? remap(p, 0.86, 0.98, 1, 0) : 1;
    if (bgWrap) bgWrap.style.opacity = bgOpacity.toFixed(3);
    if (progressBar) progressBar.style.opacity = bgOpacity.toFixed(3);
    if (progressFill) progressFill.style.transform = `scaleY(${tunnelP.toFixed(4)})`;
  }

  // Loop de parallax com IDLE SLEEP real (dorme assim que o ponteiro assenta!)
  function parallaxTick() {
    if (!isVisible || document.hidden) {
      rafId = null;
      return;
    }

    const dx = targetPx - currPx;
    const dy = targetPy - currPy;

    if (Math.abs(dx) < 0.002 && Math.abs(dy) < 0.002) {
      currPx = targetPx;
      currPy = targetPy;
      render();
      rafId = null;
      return;
    }

    currPx += dx * 0.08;
    currPy += dy * 0.08;
    render();
    rafId = requestAnimationFrame(parallaxTick);
  }

  function wakeParallax() {
    if (!rafId && isVisible && !document.hidden) {
      rafId = requestAnimationFrame(parallaxTick);
    }
  }

  const onPointerMove = (e) => {
    if (!isVisible || state.p > 0.78) return;
    targetPx = (e.clientX / (stageW || 1) - 0.5) * 2;
    targetPy = (e.clientY / (stageH || 1) - 0.5) * 2;
    wakeParallax();
  };

  if (!isTouch) {
    window.addEventListener('pointermove', onPointerMove, { passive: true });
  }

  // ScrollTrigger em modo scrub puro (sem pin -> zero mutação no DOM)
  const scrollTween = gsap.to(state, {
    p: 1,
    ease: 'none',
    onUpdate: render,
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.55,
      invalidateOnRefresh: true,
    },
  });

  // IntersectionObserver + VisibilityChange
  let io = null;
  if ('IntersectionObserver' in window) {
    io = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (!isVisible && rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      },
      { rootMargin: '120px' }
    );
    io.observe(section);
  } else {
    isVisible = true;
  }

  const onVisibilityChange = () => {
    if (document.hidden && rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  };
  document.addEventListener('visibilitychange', onVisibilityChange);

  let resizeTimer = null;
  const onResize = () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      computeMetrics();
      render();
    }, 120);
  };
  window.addEventListener('resize', onResize, { passive: true });

  computeMetrics();
  render();

  return {
    destroy() {
      if (rafId) cancelAnimationFrame(rafId);
      clearTimeout(resizeTimer);
      io?.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      scrollTween.scrollTrigger?.kill();
      scrollTween.kill();
    },
  };
}
