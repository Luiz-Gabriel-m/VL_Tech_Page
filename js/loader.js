/* ==========================================================================
   LOADER — Preloader Minimalista VL Tech (Fundo #0A0A0C + "VL" + 0% a 100%)
   - Tela totalmente preta (#0A0A0C) com o símbolo "VL" limpo ao centro
   - Apenas o contador numérico de 0% a 100% em números puros
   - Ao atingir 100%, executa fade-out elegante revelando a seção Hero
   ========================================================================== */

import { gsap, isReady, ScrollTrigger } from './core/gsap.js';

export const LOADER_COMPLETE_EVENT = 'loader:complete';

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Inicializa o Preloader minimalista da VL Tech
 */
export function initLoader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) {
    document.documentElement.classList.remove('is-loading');
    document.body.classList.remove('is-loading');
    window.__loaderComplete = true;
    document.dispatchEvent(new CustomEvent(LOADER_COMPLETE_EVENT));
    return null;
  }

  // Garante posição inicial no topo ao carregar a página
  window.scrollTo(0, 0);

  const counter = document.getElementById('preloaderCounter');
  const wrap = preloader.querySelector('.preloader__minimal-wrap');
  const glow = preloader.querySelector('.preloader__glow');

  // Bloqueio de scroll durante o carregamento inicial
  document.documentElement.classList.add('is-loading');
  document.body.classList.add('is-loading');

  const releaseScroll = () => {
    document.documentElement.classList.remove('is-loading');
    document.body.classList.remove('is-loading');
  };

  const finish = () => {
    releaseScroll();
    window.__loaderComplete = true;
    document.dispatchEvent(new CustomEvent(LOADER_COMPLETE_EVENT));
    window.dispatchEvent(new CustomEvent(LOADER_COMPLETE_EVENT));
    if (preloader) {
      preloader.style.display = 'none';
      preloader.setAttribute('aria-hidden', 'true');
    }
    if (ScrollTrigger && typeof ScrollTrigger.refresh === 'function') {
      ScrollTrigger.refresh();
    }
  };

  // Se reduz movimento ou GSAP ausente
  if (!isReady || prefersReducedMotion()) {
    if (counter) counter.textContent = '100';
    setTimeout(() => {
      if (preloader) {
        preloader.style.transition = 'opacity 0.4s ease';
        preloader.style.opacity = '0';
        setTimeout(finish, 400);
      } else {
        finish();
      }
    }, 200);
    return { finish };
  }

  const loaderState = { progress: 0 };
  const tl = gsap.timeline();

  // 1. Apresentação suave do monograma "VL" e do glow vermelho sutil
  if (wrap) {
    tl.fromTo(
      wrap,
      { autoAlpha: 0, scale: 0.96 },
      { autoAlpha: 1, scale: 1, duration: 0.6, ease: 'expo.out' }
    );
  }
  if (glow) {
    tl.fromTo(
      glow,
      { autoAlpha: 0, scale: 0.7 },
      { autoAlpha: 0.7, scale: 1, duration: 0.8, ease: 'power2.out' },
      '<'
    );
  }

  // 2. Incremento numérico fluido de 0 a 100 em números puros (~1.1s)
  tl.to(
    loaderState,
    {
      progress: 100,
      duration: 1.15,
      ease: 'power2.inOut',
      onUpdate: () => {
        const rounded = Math.round(loaderState.progress);
        if (counter) counter.textContent = rounded;
        preloader.setAttribute('aria-valuenow', rounded);
      },
    },
    '-=0.2'
  );

  // 3. Breve pausa em 100% para leitura limpa
  tl.to({}, { duration: 0.2 });

  // 4. Fade-out suave em tela cheia para revelar a seção Hero
  tl.to(
    preloader,
    {
      autoAlpha: 0,
      duration: 0.75,
      ease: 'power2.inOut',
      onStart: () => {
        releaseScroll();
        window.__loaderComplete = true;
        document.dispatchEvent(new CustomEvent(LOADER_COMPLETE_EVENT));
        window.dispatchEvent(new CustomEvent(LOADER_COMPLETE_EVENT));
      },
      onComplete: finish,
    },
    '+=0.05'
  );

  return { timeline: tl, finish };
}
