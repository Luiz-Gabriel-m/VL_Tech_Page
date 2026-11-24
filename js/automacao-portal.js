/* ==========================================================================
   AUTOMAÇÃO PORTAL — Coreografia 3 Atos CinematicHero (21st.dev) em 120fps
   - ATO 1 (0.00 -> 0.28): Título editorial ("AUTOMAÇÃO / EM PILOTO AUTOMÁTICO.")
     recua suavemente enquanto o Card Físico (`#autoMainCard`) sobe da base da
     tela via `translate3d` + `scale(0.90 -> 1)` (ZERO blur / ZERO width/height!)
   - ATO 2 (0.28 -> 0.68): Palco do Robô 3D fica 100% centralizado, nítido e
     interativo (4 abas + clique no robô + Testar Ação) com hold confortável
   - ATO 3 (0.68 -> 1.00): Pullback físico do card (`scale: 1 -> 0.88`) e saída
     suave pelo topo (`yPercent: 0 -> -118`), revelando por trás a camada CTA
     com botões táteis ("Quero Automatizar Agora" + "Por Que a VL Tech")!
   - Handoff GPU inteligente: acorda o loop WebGL Three.js apenas enquanto o
     card físico está em tela (`0.08 <= p <= 0.84`) — 100% GPU livre na entrada/saída!
   ========================================================================== */

import { gsap, ScrollTrigger } from './core/gsap.js';
import { playClick } from './sound.js';

export function initAutomacaoPortal() {
  const section = document.getElementById('automacao');
  if (!section) return null;

  const introLayer = section.querySelector('#autoIntroLayer');
  const ctaLayer = section.querySelector('#autoCtaLayer');
  const line1 = section.querySelector('#autoCineLine1');
  const line2 = section.querySelector('#autoCineLine2');
  const kicker = section.querySelector('#autoPortalKicker');
  const caption = section.querySelector('#autoPortalCaption');
  const enterBtn = section.querySelector('#autoPortalEnterBtn');
  const mainCard = section.querySelector('#autoMainCard');
  const topbar = section.querySelector('.robot-topbar');
  const arena = section.querySelector('.robot-arena');
  const bottomDeck = section.querySelector('.robot-bottom-deck');

  if (!introLayer || !mainCard) return null;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const notifyRobot = (active) => {
    section.dataset.robotAwake = active ? 'true' : 'false';
    window.dispatchEvent(new CustomEvent('vl:automacao-card-state', { detail: { active } }));
  };

  if (prefersReduced || !gsap || !ScrollTrigger) {
    introLayer.style.display = 'none';
    if (ctaLayer) ctaLayer.style.display = 'none';
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

  // Estados iniciais 100% GPU
  gsap.set(mainCard, { yPercent: 112, scale: 0.9, force3D: true });
  gsap.set(introLayer, { opacity: 1, scale: 1, y: 0, force3D: true });
  if (line2) gsap.set(line2, { clipPath: 'inset(0 100% 0 0)' });
  if (ctaLayer) {
    gsap.set(ctaLayer, { autoAlpha: 0, scale: 0.9, y: 24, force3D: true });
    ctaLayer.style.pointerEvents = 'none';
  }
  if (topbar) gsap.set(topbar, { opacity: 0, y: -14 });
  if (arena) gsap.set(arena, { opacity: 0, scale: 0.92 });
  if (bottomDeck) gsap.set(bottomDeck, { opacity: 0, y: 18 });

  // Revelação editorial leve quando a seção entra na tela
  let introPlayed = false;
  const playIntroReveal = () => {
    if (introPlayed) return;
    introPlayed = true;
    if (line1) {
      gsap.fromTo(
        line1,
        { y: 26, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.85, ease: 'expo.out' }
      );
    }
    if (line2) {
      gsap.to(line2, {
        clipPath: 'inset(0 0% 0 0)',
        duration: 0.9,
        delay: 0.14,
        ease: 'power4.inOut',
      });
    }
  };

  let robotAwake = false;
  let ctaInteractive = false;

  // Timeline de 3 Atos (scrub suave 0.4s, apenas transform + opacity)
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.4,
      invalidateOnRefresh: true,
      onEnter: playIntroReveal,
      onEnterBack: playIntroReveal,
      onUpdate(self) {
        const p = self.progress;

        // WebGL acorda apenas enquanto o card do robô está visível na viewport
        const shouldWake = p >= 0.08 && p <= 0.86;
        if (shouldWake !== robotAwake) {
          robotAwake = shouldWake;
          notifyRobot(shouldWake);
        }

        // Camada CTA só recebe cliques quando o card saiu e ela está revelada
        const ctaReady = p >= 0.78;
        if (ctaReady !== ctaInteractive) {
          ctaInteractive = ctaReady;
          if (ctaLayer) {
            ctaLayer.style.pointerEvents = ctaReady ? 'auto' : 'none';
            ctaLayer.setAttribute('aria-hidden', ctaReady ? 'false' : 'true');
          }
          mainCard.style.pointerEvents = ctaReady ? 'none' : 'auto';
        }
      },
    },
  });

  const rect = section.getBoundingClientRect();
  if (rect.top < window.innerHeight * 0.85) {
    playIntroReveal();
  }

  // ===== ATO 1 (0.00 -> 0.28): Intro recua + Card físico sobe da base =====
  if (kicker) tl.to(kicker, { opacity: 0, y: -14, duration: 0.1, ease: 'power2.in' }, 0);
  if (caption) tl.to(caption, { opacity: 0, y: 12, duration: 0.1, ease: 'power2.in' }, 0);

  tl.to(
    introLayer,
    { scale: 1.08, y: -28, autoAlpha: 0, duration: 0.2, ease: 'power2.inOut' },
    0.02
  );

  tl.to(
    mainCard,
    { yPercent: 0, scale: 1, duration: 0.26, ease: 'power3.out' },
    0.02
  );

  // Revelação sequencial limpa dos elementos internos do Robô 3D
  if (topbar) tl.to(topbar, { opacity: 1, y: 0, duration: 0.12, ease: 'power3.out' }, 0.16);
  if (arena) tl.to(arena, { opacity: 1, scale: 1, duration: 0.16, ease: 'expo.out' }, 0.18);
  if (bottomDeck) tl.to(bottomDeck, { opacity: 1, y: 0, duration: 0.12, ease: 'power3.out' }, 0.2);

  // ===== ATO 2 (0.32 -> 0.66): Hold interativo estável no Robô 3D =====
  tl.to({}, { duration: 0.34 }, 0.32);

  // ===== ATO 3 (0.66 -> 1.00): Pullback físico + saída do card -> revela CTA Tátil =====
  tl.to(
    mainCard,
    { scale: 0.88, duration: 0.14, ease: 'power2.inOut' },
    0.66
  );

  if (ctaLayer) {
    tl.to(
      ctaLayer,
      { autoAlpha: 1, scale: 1, y: 0, duration: 0.18, ease: 'expo.out' },
      0.74
    );
  }

  tl.to(
    mainCard,
    { yPercent: -120, duration: 0.2, ease: 'power3.in' },
    0.78
  );

  // Pequeno hold final no CTA tátil
  tl.to({}, { duration: 0.06 }, 0.98);

  // Pula diretamente para o meio do ATO 2 (Robô 3D aberto e 100% interativo!)
  const scrollToCard = () => {
    const st = tl.scrollTrigger;
    const targetY = st
      ? st.start + (st.end - st.start) * 0.45
      : section.offsetTop + window.innerHeight * 0.95;
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
