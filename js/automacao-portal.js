/* ==========================================================================
   AUTOMAÇÃO PORTAL — Transição Cinematográfica 100% GPU (GSAP ScrollTrigger)
   - Substitui SVG <clipPath> sujeito a flicker por mergulho 3D composto na GPU
     (`transform: scale()` + `opacity`) dentro de um único palco `position: sticky`
   - Fluxo contínuo e sem costura:
       1. 0.00 -> 0.12: Hold limpo da palavra monumental "AUTOMAÇÃO"
       2. 0.12 -> 0.80: Zoom de câmera através da palavra + anel de profundidade
       3. 0.35 -> 0.85: Palco do Robô 3D surge centralizado e em escala 0.92 -> 1.0
       4. >= 0.72: Véu do portal desativa pointer-events e oculta (ZERO bloqueio!)
   - Botão "Entrar em Automação ↓" leva suavemente direto ao Robô 3D aberto
   ========================================================================== */

import { gsap, ScrollTrigger } from './core/gsap.js';
import { playClick } from './sound.js';

export function initAutomacaoPortal() {
  const section = document.getElementById('automacao');
  if (!section) return null;

  const veil = section.querySelector('#autoPortalVeil');
  const word = section.querySelector('#autoPortalWord');
  const kicker = section.querySelector('#autoPortalKicker');
  const ring = section.querySelector('#autoPortalRing');
  const caption = section.querySelector('#autoPortalCaption');
  const enterBtn = section.querySelector('#autoPortalEnterBtn');
  const robotStage = section.querySelector('#autoRobotStage');

  if (!veil || !word || !robotStage) return null;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReduced || !gsap || !ScrollTrigger) {
    veil.style.display = 'none';
    robotStage.style.opacity = '1';
    robotStage.style.transform = 'none';
    robotStage.style.pointerEvents = 'auto';
    section.dataset.portalOpen = 'true';
    return null;
  }

  // Estado inicial controlado
  gsap.set(robotStage, { opacity: 0, scale: 0.92 });
  robotStage.style.pointerEvents = 'none';
  section.dataset.portalOpen = 'false';

  let isOpen = false;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: '+=58%',
      scrub: 0.45,
      invalidateOnRefresh: true,
      onUpdate(self) {
        const openNow = self.progress >= 0.68;
        if (openNow !== isOpen) {
          isOpen = openNow;
          section.dataset.portalOpen = openNow ? 'true' : 'false';
          veil.style.pointerEvents = openNow ? 'none' : 'auto';
          veil.style.visibility = openNow ? 'hidden' : 'visible';
          robotStage.style.pointerEvents = openNow ? 'auto' : 'none';
        }
      },
    },
  });

  // 0.00 -> 0.12: Hold inicial para leitura limpa de "AUTOMAÇÃO"
  tl.to({}, { duration: 0.12 });

  // 0.12 -> 0.42: Kicker e legenda somem cedo
  if (kicker) {
    tl.to(kicker, { opacity: 0, y: -18, duration: 0.25, ease: 'power2.in' }, 0.12);
  }
  if (caption) {
    tl.to(caption, { opacity: 0, y: 16, duration: 0.24, ease: 'power2.in' }, 0.12);
  }

  // 0.12 -> 0.78: Palavra "AUTOMAÇÃO" mergulha na câmera + anel expande
  tl.to(
    word,
    { scale: 7.5, opacity: 0, duration: 0.66, ease: 'power3.in' },
    0.12
  );

  if (ring) {
    tl.to(
      ring,
      { scale: 3.4, opacity: 0, duration: 0.62, ease: 'power2.in' },
      0.12
    );
  }

  // 0.46 -> 0.76: Fundo escuro do véu dissolve completamente
  tl.to(veil, { opacity: 0, duration: 0.3, ease: 'power2.out' }, 0.46);

  // 0.38 -> 0.88: Palco do Robô 3D entra centralizado, nítido e 100% interativo
  tl.to(
    robotStage,
    { opacity: 1, scale: 1, duration: 0.5, ease: 'power3.out' },
    0.38
  );

  // Botão "Entrar em Automação ↓" pula suavemente direto para o robô aberto
  const onEnterClick = (e) => {
    e.preventDefault();
    try { playClick(); } catch (_) {}
    const st = tl.scrollTrigger;
    const targetY = st ? st.end + 12 : section.offsetTop + window.innerHeight * 0.65;
    window.scrollTo({
      top: Math.round(targetY),
      behavior: 'smooth',
    });
  };
  enterBtn?.addEventListener('click', onEnterClick);

  return {
    destroy() {
      enterBtn?.removeEventListener('click', onEnterClick);
      tl.scrollTrigger?.kill();
      tl.kill();
    },
  };
}
