/* ==========================================================================
   MAIN — Ponto de entrada da aplicação (type="module")
   Módulos são "defer" por padrão: o DOM já está pronto e os scripts
   clássicos do GSAP (CDN) já foram executados quando este arquivo roda.
   ========================================================================== */

import { isReady, ScrollTrigger } from './core/gsap.js';
import { initLoader } from './loader.js';
import { initSound } from './sound.js';
import { initCustomCursor } from './cursor.js';
import { initNavigation } from './navigation.js';
import { initFounderSwitch } from './founder-switch.js';
import { initFAQ } from './faq.js';
import { initHero } from './hero.js';
import { initReveal } from './animations/reveal.js';
import { initScroll } from './scroll.js';
import { initNotebook3D } from './notebook-3d.js';
import { initTiltHat } from './animations/tilt-hat.js';
import { initMatrixCascade } from './animations/matrix-cascade.js';

/**
 * Módulos essenciais — funcionam mesmo se o GSAP não carregar.
 */
const CORE_MODULES = [
  ['sound', initSound],
  ['cursor', initCustomCursor],
  ['navigation', initNavigation],
  ['founderSwitch', initFounderSwitch],
  ['faq', initFAQ],
];

/**
 * Módulos de animação — dependem de GSAP + ScrollTrigger. A ordem importa.
 * O loader é inicializado primeiro para que os demais componentes possam sincronizar sua entrada.
 */
const MOTION_MODULES = [
  ['loader', initLoader],
  ['hero', initHero],
  ['tiltHat', initTiltHat],
  ['notebook3D', initNotebook3D],
  ['matrixCascade', initMatrixCascade],
  ['reveal', initReveal],
  ['scroll', initScroll],
];

/** Instâncias retornadas pelos módulos (ex.: app.navigation.close()) */
export const app = {};

function initModules(modules) {
  modules.forEach(([name, init]) => {
    try {
      app[name] = init() ?? null;
    } catch (error) {
      // Um componente com erro não derruba os demais
      console.error(`[main] Falha ao iniciar o módulo "${name}":`, error);
    }
  });
}

function refreshOnAssetsLoad() {
  // Fontes e imagens alteram a altura das seções → recalcula os gatilhos
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
  window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
}

function boot() {
  const root = document.documentElement;

  initModules(CORE_MODULES);

  if (!isReady) {
    // Sem GSAP: remove o anti-FOUC e libera o scroll caso estivesse travado
    root.classList.remove('js', 'is-loading');
    document.body.classList.remove('is-loading');
    const preloader = document.getElementById('preloader');
    if (preloader) preloader.style.display = 'none';
    root.classList.add('no-gsap');
    console.warn('[main] GSAP/ScrollTrigger não carregados — animações desativadas.');
    return;
  }

  root.classList.add('js-ready');
  initModules(MOTION_MODULES);
  refreshOnAssetsLoad();
}

boot();
