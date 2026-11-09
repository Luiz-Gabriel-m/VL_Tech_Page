/* ==========================================================================
   CORE — Motor unificado de rolagem horizontal pinada
   Usado por: #mensagem (Por Que Escolher), #galeria (Diferenciais) e
   #loja (Soluções & Serviços) — comportamento 1:1 idêntico nas três seções.

   Arquitetura (2 ScrollTriggers sincronizados sobre o MESMO container):
   1. PIN    → fixa o .horizontal-pin-wrapper por (distância + "hold").
   2. TRACK  → tween linear do track (scrub: 1) que termina ANTES do pin
               liberar. O "hold" absorve o atraso do scrub, garantindo que o
               último card esteja 100% visível antes de a página continuar
               (sem unpin prematuro, sem tela preta).

   A distância é medida com offsetLeft/offsetWidth (ignoram transforms) e
   recalculada a cada refresh (invalidateOnRefresh) → resize-safe.
   ========================================================================== */

import { gsap, ScrollTrigger } from './gsap.js';

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * @param {Object}   opts
 * @param {string}   opts.id          Prefixo dos ids do ScrollTrigger (debug).
 * @param {Element}  opts.container   .horizontal-scroll-container (gatilho estável, nunca pinado).
 * @param {Element}  opts.pinWrapper  .horizontal-pin-wrapper (elemento fixado).
 * @param {Element}  opts.track       .horizontal-track (elemento transladado em X).
 * @param {Element[]} [opts.cards]    Cards para a microinteração de entrada.
 * @param {number}   [opts.holdRatio] Fração do viewport mantida pinada após o fim do track.
 */
export function createHorizontalScroll({
  id = 'horizontal',
  container,
  pinWrapper,
  track,
  cards = [],
  holdRatio = 0.22,
} = {}) {
  if (!container || !pinWrapper || !track) return null;

  if (prefersReducedMotion()) {
    container.classList.add('is-reduced-motion');
    return null;
  }

  // Largura útil do viewport pinado (exclui a barra de rolagem vertical)
  const getViewportWidth = () => pinWrapper.clientWidth || document.documentElement.clientWidth;

  // Distância exata: borda direita do track (incl. padding-right) → borda direita do viewport
  const getDistance = () =>
    Math.max(0, Math.ceil(track.offsetLeft + track.offsetWidth - getViewportWidth()));

  // Folga pinada após o último card (absorve o "catch-up" do scrub: 1)
  const getHold = () => Math.round(window.innerHeight * holdRatio);

  // 1. PIN — trava estrita: só libera após distância + hold
  const pin = ScrollTrigger.create({
    id: `${id}-pin`,
    trigger: container,
    start: 'top top',
    end: () => `+=${getDistance() + getHold()}`,
    pin: pinWrapper,
    pinSpacing: true,
    anticipatePin: 1,
    invalidateOnRefresh: true,
  });

  // 2. TRACK — tween linear (requisito do containerAnimation)
  const tween = gsap.to(track, {
    x: () => -getDistance(),
    ease: 'none',
    scrollTrigger: {
      id: `${id}-track`,
      trigger: container,
      start: 'top top',
      end: () => `+=${getDistance()}`,
      scrub: 1,
      invalidateOnRefresh: true,
    },
  });

  // 3. Microinteração de entrada — apenas opacidade (não disputa o transform do :hover)
  const cardTweens = Array.from(cards).map((card) =>
    gsap.fromTo(
      card,
      { opacity: 0.4 },
      {
        opacity: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: card,
          containerAnimation: tween,
          start: 'left 100%',
          end: 'left 62%',
          scrub: true,
        },
      }
    )
  );

  return {
    pin,
    tween,
    getDistance,
    kill() {
      cardTweens.forEach((t) => {
        t.scrollTrigger?.kill();
        t.kill();
      });
      tween.scrollTrigger?.kill();
      tween.kill();
      pin.kill();
      gsap.set([track, ...cards], { clearProps: 'transform,opacity' });
    },
  };
}

