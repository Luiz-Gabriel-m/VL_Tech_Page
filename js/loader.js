/* ==========================================================================
   LOADER — Preloader Editorial & Imersivo VL Tech
   - Simula carregamento fluido dos assets e incrementa de 0 a 100 em frações de segundo
   - Transição de saída: cortina deslizante para cima (transform: translateY(-100%) / power4.inOut)
   - Scroll bloqueado (overflow: hidden / html.is-loading, body.is-loading)
   - Dispara evento 'loader:complete' para sincronizar com a revelação do Hero
   ========================================================================== */

import { gsap, isReady, ScrollTrigger } from './core/gsap.js';

export const LOADER_COMPLETE_EVENT = 'loader:complete';

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Inicializa o componente de Preloader editorial da VL Tech
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
  const fill = document.getElementById('preloaderFill');
  const statusEl = document.getElementById('preloaderStatus');
  const inner = preloader.querySelector('.preloader__inner');

  // Garante bloqueio estrito de scroll no HTML e Body
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
    // Atualiza ScrollTrigger para garantir alinhamento perfeito de seções fixadas
    if (ScrollTrigger && typeof ScrollTrigger.refresh === 'function') {
      ScrollTrigger.refresh();
    }
  };

  // Se o usuário prefere movimento reduzido ou GSAP não estiver disponível
  if (!isReady || prefersReducedMotion()) {
    if (fill) fill.style.width = '100%';
    if (counter) counter.textContent = '100';
    if (statusEl) statusEl.textContent = 'SISTEMAS PRONTOS // ENTRADA LIBERADA';

    setTimeout(() => {
      if (preloader) {
        preloader.style.transition = 'opacity 0.4s ease, transform 0.5s cubic-bezier(0.77, 0, 0.175, 1)';
        preloader.style.opacity = '0';
        preloader.style.transform = 'translateY(-100%)';
        setTimeout(finish, 500);
      } else {
        finish();
      }
    }, 200);

    return { finish };
  }

  // Objeto de estado animável pelo GSAP
  const loaderState = { progress: 0 };

  // Atualização editorial das mensagens de status conforme o progresso
  const updateStatus = (val) => {
    if (!statusEl) return;
    if (val < 28) {
      statusEl.textContent = 'INICIALIZANDO SISTEMAS...';
    } else if (val < 58) {
      statusEl.textContent = 'CARREGANDO CORE & MÓDULOS DO SISTEMA...';
    } else if (val < 88) {
      statusEl.textContent = 'SINCRONIZANDO ARQUITETURA VL TECH...';
    } else if (val < 99) {
      statusEl.textContent = 'FINALIZANDO CONEXÕES DE REDE...';
    } else {
      statusEl.textContent = 'SISTEMAS PRONTOS // ENTRADA LIBERADA';
    }
  };

  // Timeline principal do Preloader com GSAP
  const tl = gsap.timeline();

  // 1. Revelação inicial suave dos elementos centrais
  if (inner) {
    tl.from(inner.children, {
      y: 24,
      autoAlpha: 0,
      duration: 0.5,
      stagger: 0.07,
      ease: 'power2.out',
    });
  }

  // 2. Incremento numérico fluido de 0 a 100% em fração de segundo (~1.3s)
  tl.to(
    loaderState,
    {
      progress: 100,
      duration: 1.35,
      ease: 'power2.inOut',
      onUpdate: () => {
        const rounded = Math.round(loaderState.progress);
        if (counter) counter.textContent = rounded;
        if (fill) fill.style.width = `${rounded}%`;
        preloader.setAttribute('aria-valuenow', rounded);
        updateStatus(rounded);
      },
    },
    '-=0.15'
  );

  // 3. Pausa rápida de leitura ao atingir 100%
  tl.to({}, { duration: 0.25 });

  // 4. Fade-out suave em tela cheia para revelar a página principal
  tl.to(
    preloader,
    {
      autoAlpha: 0,
      duration: 0.85,
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
