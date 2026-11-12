/* ==========================================================================
   CORE — Motor unificado de rolagem horizontal pinada (GSAP 3 + ScrollTrigger)
   Usado nas seções:
   1. .why-horizontal-section (#mensagem)
   2. .diferenciais-section (#galeria)
   3. .shop-section.helmets-section (#loja)

   Regra de Trava Estrita (Strict Scroll-Lock Rule):
   - O scroll vertical é completamente bloqueado (pin: pinWrapper) assim que
     o topo do container atinge o topo da janela ('top top').
   - O usuário progride lateralmente por todos os cards da seção (scrub: 1).
   - O pin só é liberado APÓS o último card ter sido 100% revelado e apreciado
     (graças ao hold integrado no final da timeline única do GSAP).
   - Zero espaços em branco, zero saltos e zero desfixação prematura.
   ========================================================================== */

import { gsap, ScrollTrigger } from './gsap.js';

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * @param {Object}   opts
 * @param {string}   opts.id          Identificador único do ScrollTrigger (debug/profiling).
 * @param {Element}  opts.container   .horizontal-scroll-container (gatilho estável, nunca pinado).
 * @param {Element}  opts.pinWrapper  .horizontal-pin-wrapper (elemento fixado no viewport).
 * @param {Element}  opts.track       .horizontal-track (elemento transladado em X).
 * @param {Element[]} [opts.cards]    Cards para microinteração de entrada/revelação.
 * @param {number}   [opts.holdRatio] Fração da altura da janela mantida após o último card (padrão 0.25).
 */
export function createHorizontalScroll({
  id = 'horizontal',
  container,
  pinWrapper,
  track,
  cards = [],
  holdRatio = 0.25,
} = {}) {
  if (!container || !pinWrapper || !track) return null;

  if (prefersReducedMotion()) {
    container.classList.add('is-reduced-motion');
    return null;
  }

  // Largura útil da janela de visualização pinada
  const getViewportWidth = () => pinWrapper.clientWidth || window.innerWidth;

  // Distância exata da translação lateral:
  // (Início do track + Largura total de todos os cards + gap + padding-right) - Largura do viewport
  const getDistance = () => {
    const viewportWidth = getViewportWidth();
    const trackWidth = Math.max(track.scrollWidth, track.offsetWidth);
    const startOffset = track.offsetLeft || 0;
    return Math.max(0, Math.ceil(startOffset + trackWidth - viewportWidth));
  };

  // Folga de retenção final que absorve a inércia do scrub: 1
  // Garante que o último card fique perfeitamente parado na tela antes de unpin
  const getHold = () => Math.round(window.innerHeight * holdRatio);

  // Timeline unificada com ScrollTrigger — Uma única instância para PIN e SCRUB
  const tl = gsap.timeline({
    scrollTrigger: {
      id: `${id}-horizontal`,
      trigger: container,
      pin: pinWrapper,
      start: 'top top',
      end: () => `+=${getDistance() + getHold()}`,
      scrub: 1,
      pinSpacing: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  });

  // Animação linear do percurso horizontal
  const trackTween = tl.to(
    track,
    {
      x: () => -getDistance(),
      ease: 'none',
      duration: 1,
    },
    0
  );

  // Trava estrita de leitura do último card (hold)
  tl.to({}, { duration: holdRatio }, 1);

  // Microinterações de entrada suave de cada card com containerAnimation
  const cardTweens = Array.from(cards).map((card) =>
    gsap.fromTo(
      card,
      { opacity: 0.35, scale: 0.96 },
      {
        opacity: 1,
        scale: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: card,
          containerAnimation: trackTween,
          start: 'left 98%',
          end: 'left 60%',
          scrub: true,
        },
      }
    )
  );

  return {
    timeline: tl,
    tween: trackTween,
    getDistance,
    kill() {
      cardTweens.forEach((t) => {
        t.scrollTrigger?.kill();
        t.kill();
      });
      tl.scrollTrigger?.kill();
      tl.kill();
      gsap.set([track, ...cards], { clearProps: 'transform,opacity,scale' });
    },
  };
}
