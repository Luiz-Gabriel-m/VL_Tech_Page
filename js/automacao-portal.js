/* ==========================================================================
   AUTOMAÇÃO PORTAL — Transição Cinematográfica 120fps (CinematicHero 21st.dev)
   - Substitui o zoom gigante em texto (`scale: 7.5` com text-shadow pesado)
     pela coreografia fluida do CinematicLandingHero em 100% GPU compositor:
       1. Fundo: Título editorial "AUTOMAÇÃO / EM PILOTO AUTOMÁTICO." revela
          com clip-path limpo e recua suavemente em profundidade (`scale: 0.9`)
       2. Primeiro plano: O card físico de profundidade (`#autoMainCard` com o
          Robô 3D já pronto dentro) sobe da base da tela via `translate3d` +
          `scale(0.92 -> 1)` sem mutar `width/height` (zero layout thrashing!)
       3. Handoff GPU inteligente: dispara `vl:automacao-card-visible` assim
          que o card entra na tela para acordar o loop Three.js sem disputar
          GPU durante o início da rolagem!
   ========================================================================== */

import { gsap, ScrollTrigger } from './core/gsap.js';
import { playClick } from './sound.js';

export function initAutomacaoPortal() {
  const section = document.getElementById('automacao');
  if (!section) return null;

  const introLayer = section.querySelector('#autoIntroLayer');
  const line1 = section.querySelector('#autoCineLine1');
  const line2 = section.querySelector('#autoCineLine2');
  const kicker = section.querySelector('#autoPortalKicker');
  const caption = section.querySelector('#autoPortalCaption');
  const enterBtn = section.querySelector('#autoPortalEnterBtn');
  const mainCard = section.querySelector('#autoMainCard');

  if (!introLayer || !mainCard) return null;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const notifyRobot = (active) => {
    section.dataset.robotAwake = active ? 'true' : 'false';
    window.dispatchEvent(new CustomEvent('vl:automacao-card-state', { detail: { active } }));
  };

  if (prefersReduced || !gsap || !ScrollTrigger) {
    introLayer.style.display = 'none';
    gsap?.set(mainCard, { yPercent: 0, scale: 1, opacity: 1 });
    section.dataset.portalOpen = 'true';
    notifyRobot(true);
    return {
      scrollToCard() {
        section.scrollIntoView({ behavior: 'auto', block: 'start' });
      },
      destroy() {},
    };
  }

  // Estado inicial: texto editorial visível e card físico aguardando logo abaixo
  gsap.set(mainCard, { yPercent: 108, scale: 0.92, force3D: true });
  gsap.set(introLayer, { opacity: 1, scale: 1, y: 0, force3D: true });
  if (line2) {
    gsap.set(line2, { clipPath: 'inset(0 100% 0 0)' });
  }

  // Animação leve de entrada do texto assim que a seção chega na viewport
  let introPlayed = false;
  const playIntroReveal = () => {
    if (introPlayed) return;
    introPlayed = true;
    if (line1) {
      gsap.fromTo(
        line1,
        { y: 28, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.85, ease: 'expo.out' }
      );
    }
    if (line2) {
      gsap.to(line2, {
        clipPath: 'inset(0 0% 0 0)',
        duration: 0.95,
        delay: 0.15,
        ease: 'power4.inOut',
      });
    }
  };

  let robotAwake = false;
  let portalOpen = false;

  // Timeline única de scroll — 100% GPU (`transform` + `opacity`), sem `filter` nem `width/height`
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: '+=68%',
      scrub: 0.35,
      invalidateOnRefresh: true,
      onEnter: playIntroReveal,
      onEnterBack: playIntroReveal,
      onUpdate(self) {
        const p = self.progress;

        const shouldWakeRobot = p >= 0.14;
        if (shouldWakeRobot !== robotAwake) {
          robotAwake = shouldWakeRobot;
          notifyRobot(shouldWakeRobot);
        }

        const isNowOpen = p >= 0.55;
        if (isNowOpen !== portalOpen) {
          portalOpen = isNowOpen;
          section.dataset.portalOpen = isNowOpen ? 'true' : 'false';
          introLayer.style.visibility = isNowOpen ? 'hidden' : 'visible';
        }
      },
    },
  });

  // Se o usuário já recarregou com a seção na tela, revela o texto na hora
  const rect = section.getBoundingClientRect();
  if (rect.top < window.innerHeight * 0.85) {
    playIntroReveal();
  }

  // 0.00 -> 0.45: Texto de abertura recua suavemente em profundidade (sem zoom gigante!)
  if (kicker) {
    tl.to(kicker, { opacity: 0, y: -16, duration: 0.25, ease: 'power2.in' }, 0);
  }
  if (caption) {
    tl.to(caption, { opacity: 0, y: 14, duration: 0.22, ease: 'power2.in' }, 0);
  }
  tl.to(
    introLayer,
    { scale: 0.88, y: -44, opacity: 0, duration: 0.5, ease: 'power2.inOut' },
    0.04
  );

  // 0.06 -> 0.88: Card físico com o Robô 3D sobe suavemente da base e assenta no centro
  tl.to(
    mainCard,
    { yPercent: 0, scale: 1, duration: 0.82, ease: 'power3.out' },
    0.06
  );

  // Micro-hold no final para assentar perfeitamente antes de liberar o scroll
  tl.to({}, { duration: 0.12 });

  const scrollToCard = () => {
    const st = tl.scrollTrigger;
    const targetY = st ? st.end + 16 : section.offsetTop + window.innerHeight * 0.72;
    window.scrollTo({
      top: Math.round(targetY),
      behavior: 'smooth',
    });
  };

  const onEnterClick = (e) => {
    e.preventDefault();
    try { playClick(); } catch (_) {}
    scrollToCard();
  };
  enterBtn?.addEventListener('click', onEnterClick);

  return {
    scrollToCard,
    destroy() {
      enterBtn?.removeEventListener('click', onEnterClick);
      tl.scrollTrigger?.kill();
      tl.kill();
    },
  };
}
