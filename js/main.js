/* ==========================================================================
   MAIN — Ponto de entrada da aplicação (type="module")
   Módulos são "defer" por padrão: o DOM já está pronto e os scripts
   clássicos do GSAP (CDN) já foram executados quando este arquivo roda.

   REGRA DE OURO DO SCROLLTRIGGER
   Pins precisam ser criados NA ORDEM EM QUE APARECEM NO DOM. Um pin criado
   depois de gatilhos que estão abaixo dele desloca a página sem que esses
   gatilhos saibam → pin prematuro, espaço em branco e "tela preta".
   Por isso MOTION_MODULES segue exatamente a ordem das seções do index.html.
   ========================================================================== */

import { isReady, ScrollTrigger } from './core/gsap.js';
import { initLoader } from './loader.js';
import { initSound } from './sound.js';
import { initCustomCursor } from './cursor.js';
import { initNavigation } from './navigation.js';
import { initFounderSwitch } from './founder-switch.js';
import { initFAQ } from './faq.js';
import { initFooter } from './footer.js?v=5.7';
import { initHero } from './hero.js?v=5.7';
import { initReveal } from './animations/reveal.js';
import { initScroll, initServicesScroll } from './scroll.js?v=5.7';
import { initNotebook3D } from './notebook-3d.js?v=5.7';
import { initTiltHat } from './animations/tilt-hat.js';
import { initMatrixCascade } from './animations/matrix-cascade.js';
import { initTechHero } from './tech-hero-3d.js?v=5.7';
import { initArrowScrollytelling } from './arrow-scrollytelling.js?v=5.7';
import { initDiferenciais } from './diferenciais-3d.js?v=5.7';
import { initPartnersTech } from './partners-tech.js?v=5.7';
import { initWhyChooseUs } from './why-choose-us.js?v=5.6';
import { initResponsiveShowcase } from './responsive-showcase.js?v=5.7';

/**
 * Módulos essenciais — funcionam mesmo se o GSAP não carregar.
 */
const CORE_MODULES = [
  ['sound', initSound],
  ['cursor', initCustomCursor],
  ['navigation', initNavigation],
  ['founderSwitch', initFounderSwitch],
  ['faq', initFAQ],
  ['footer', initFooter],
];

/**
 * Módulos de animação — dependem de GSAP + ScrollTrigger.
 * ORDEM = ORDEM DO DOM (comentário à direita indica a seção / se há pin).
 */
const MOTION_MODULES = [
  ['loader', initLoader],                         // #preloader
  ['techHero', initTechHero],                     // #hero
  ['whyChooseUs', initWhyChooseUs],               // #mensagem            · PIN horizontal
  ['tiltHat', initTiltHat],                       // #tracks (gatilho simples)
  ['arrowScrollytelling', initArrowScrollytelling], // #tracks            · PIN
  ['diferenciais', initDiferenciais],             // #galeria             · PIN horizontal
  ['notebook3D', initNotebook3D],                 // #portfolio-experience · PIN
  ['matrixCascade', initMatrixCascade],           // #capacetes
  ['responsiveShowcase', initResponsiveShowcase], // #responsividade
  ['servicesScroll', initServicesScroll],         // #loja                · PIN horizontal
  ['partnersTech', initPartnersTech],             // #parceiros
  ['founders', initHero],                         // #socios-scrolly      · PIN (Victor → Luiz)
  ['reveal', initReveal],                         // gatilhos genéricos (sem pin)
  ['scroll', initScroll],                         // galeria / manifesto / leque (sem pin)
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

/**
 * Recalcula todos os gatilhos de cima para baixo (ordem de criação = ordem
 * do DOM). Obs.: não usamos ScrollTrigger.sort() porque os gatilhos com
 * containerAnimation (cards horizontais) precisam permanecer depois do
 * tween do track ao qual pertencem.
 */
function syncScrollTriggers() {
  ScrollTrigger.refresh();
}

function refreshOnAssetsLoad() {
  // Fontes e imagens alteram a altura/largura das seções e dos tracks
  // horizontais → recalcula distâncias e posições de pin.
  document.fonts?.ready.then(syncScrollTriggers);
  window.addEventListener('load', syncScrollTriggers, { once: true });
}

function boot() {
  const root = document.documentElement;

  // O navegador restaurar a posição antiga ANTES dos pin-spacers existirem
  // leva o usuário para o meio de uma seção pinada. O loader sobe ao topo.
  // (Obs.: scroll-behavior: smooth foi desativado no styles.css — conflita
  // com os recálculos de pin; as âncoras já usam behavior: 'smooth' via JS.)
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

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
  syncScrollTriggers();
  refreshOnAssetsLoad();
}

boot();
