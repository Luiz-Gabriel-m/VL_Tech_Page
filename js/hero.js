/* ==========================================================================
   HERO / SÓCIOS — Interactive "VL" Brandmark State Machine & Showcase
   - Fix: Normal document flow (zero overlap with preceding/following sections).
   - State 1 (Vitor Whohlers): "V" highlighted in vibrant red (#FF1E26 / #ff2a2a),
     "L" remains neutral white. Reveals Vitor's profile, cloud expertise, and portrait.
   - State 2 (Luiz Gabriel): "L" highlighted in vibrant red (#FF1E26 / #ff2a2a),
     "V" remains neutral white. Reveals Luiz Gabriel's profile, 3D expertise, and portrait.
   - Interactions: Interactive clicks, hovers, button triggers, and GSAP reveal.
   ========================================================================== */

import { gsap, ScrollTrigger } from './core/gsap.js';
import { playIgnite, playSwoosh } from './sound.js';

export const HERO_INTRO_EVENT = 'hero:intro-complete';

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Adiciona interação suave de paralaxe (tilt) 3D nos retratos dos fundadores
 */
function setupPortraitTilt(stage, visual) {
  if (!stage || !visual || prefersReducedMotion()) return null;

  const quickX = gsap.quickTo(visual, 'rotationY', { duration: 0.8, ease: 'power2.out' });
  const quickY = gsap.quickTo(visual, 'rotationX', { duration: 0.8, ease: 'power2.out' });

  const onMouseMove = (e) => {
    const rect = stage.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    quickX(x * 12);
    quickY(-y * 12);
  };

  const onMouseLeave = () => {
    quickX(0);
    quickY(0);
  };

  stage.addEventListener('mousemove', onMouseMove);
  stage.addEventListener('mouseleave', onMouseLeave);

  return () => {
    stage.removeEventListener('mousemove', onMouseMove);
    stage.removeEventListener('mouseleave', onMouseLeave);
  };
}

export function initHero() {
  const section = document.getElementById('socios-scrolly');
  if (!section) return null;

  // Palcos dos Sócios (Estado 1: Victor, Estado 2: Luiz)
  const stageVictor = document.getElementById('stageVictor');
  const stageLuiz = document.getElementById('stageLuiz');

  // Letras Monumentais "V" e "L" do Brandmark Interativo
  const vlSymbolV = document.getElementById('vlSymbolV');
  const vlSymbolL = document.getElementById('vlSymbolL');
  const vlCharV = document.getElementById('vlCharV') || (vlSymbolV ? vlSymbolV.querySelector('.vl-char') : null);
  const vlCharL = document.getElementById('vlCharL') || (vlSymbolL ? vlSymbolL.querySelector('.vl-char') : null);

  // Botões Seletores em Pill
  const btnSwitchVictor = document.getElementById('btnSwitchVictor');
  const btnSwitchLuiz = document.getElementById('btnSwitchLuiz');

  // Telemetria e Indicadores
  const vlBrandmarkStatusText = document.getElementById('vlBrandmarkStatusText');
  const bgVectorLetter = document.getElementById('bgVectorLetter');

  // Typewriter Text Elements
  const victorTypedText = document.getElementById('victorTypedText');
  const victorCaret = document.getElementById('victorCaret');
  const luizTypedText = document.getElementById('luizTypedText');
  const luizCaret = document.getElementById('luizCaret');

  // Retratos
  const victorPortraitStage = document.getElementById('victorPortraitStage');
  const victorVisual = document.getElementById('victor-visual');
  const luizPortraitStage = document.getElementById('luizPortraitStage');
  const luizVisual = document.getElementById('luiz-visual');

  // Configura tilt 3D nos retratos
  setupPortraitTilt(victorPortraitStage, victorVisual);
  setupPortraitTilt(luizPortraitStage, luizVisual);

  // Cores da Máquina de Estados VL
  const RED_COLOR = '#FF1E26';
  const RED_GLOW = '0 0 15px rgba(255, 30, 38, 0.95), 0 0 35px rgba(255, 30, 38, 0.8), 0 0 75px rgba(255, 30, 38, 0.5)';
  const WHITE_SUBDUED = 'rgba(255, 255, 255, 0.35)';

  let activeFounder = 'victor'; // Estado inicial: Vitor Whohlers
  let isTransitioning = false;
  let victorTypingTimer = null;
  let luizTypingTimer = null;

  /**
   * Efeito de Digitação Máquina de Escrever no Nome do Sócio
   */
  function typeFounderName(nameKey) {
    if (prefersReducedMotion()) {
      if (nameKey === 'victor' && victorTypedText) victorTypedText.textContent = 'ICTOR WHOHLERS';
      if (nameKey === 'luiz' && luizTypedText) luizTypedText.textContent = 'UIZ GABRIEL';
      return;
    }

    if (nameKey === 'victor') {
      if (victorTypingTimer) clearInterval(victorTypingTimer);
      if (!victorTypedText) return;
      const target = 'ICTOR WHOHLERS';
      victorTypedText.textContent = '';
      if (victorCaret) {
        victorCaret.style.display = 'inline-block';
        victorCaret.classList.remove('cursor-idle');
      }
      let idx = 0;
      victorTypingTimer = setInterval(() => {
        if (idx < target.length) {
          victorTypedText.textContent += target.charAt(idx);
          idx++;
        } else {
          clearInterval(victorTypingTimer);
          victorTypingTimer = null;
          if (victorCaret) victorCaret.classList.add('cursor-idle');
        }
      }, 35);
    } else if (nameKey === 'luiz') {
      if (luizTypingTimer) clearInterval(luizTypingTimer);
      if (!luizTypedText) return;
      const target = 'UIZ GABRIEL';
      luizTypedText.textContent = '';
      if (luizCaret) {
        luizCaret.style.display = 'inline-block';
        luizCaret.classList.remove('cursor-idle');
      }
      let idx = 0;
      luizTypingTimer = setInterval(() => {
        if (idx < target.length) {
          luizTypedText.textContent += target.charAt(idx);
          idx++;
        } else {
          clearInterval(luizTypingTimer);
          luizTypingTimer = null;
          if (luizCaret) luizCaret.classList.add('cursor-idle');
        }
      }, 35);
    }
  }

  /**
   * Atualização de Classes e Acessibilidade do Brandmark VL
   */
  function updateBrandmarkVisuals(founder) {
    const isVictor = founder === 'victor';

    // Botões V e L
    if (vlSymbolV) {
      vlSymbolV.classList.toggle('is-active', isVictor);
      vlSymbolV.setAttribute('aria-selected', isVictor ? 'true' : 'false');
    }
    if (vlSymbolL) {
      vlSymbolL.classList.toggle('is-active', !isVictor);
      vlSymbolL.setAttribute('aria-selected', !isVictor ? 'true' : 'false');
    }

    // Pills de Seleção
    if (btnSwitchVictor) btnSwitchVictor.classList.toggle('is-active', isVictor);
    if (btnSwitchLuiz) btnSwitchLuiz.classList.toggle('is-active', !isVictor);

    // Letra vetorial de fundo
    if (bgVectorLetter) {
      bgVectorLetter.textContent = isVictor ? 'V' : 'L';
    }

    // Telemetria de Status
    if (vlBrandmarkStatusText) {
      vlBrandmarkStatusText.textContent = isVictor
        ? 'ESTADO ATIVO: VITOR WHOHLERS // BACK-END & CLOUD ARCHITECT'
        : 'ESTADO ATIVO: LUIZ GABRIEL // FRONT-END & 3D WEBGL LEAD';
    }

    // Cores e Efeito Neon nas Letras Monumentais
    if (vlCharV && vlCharL) {
      if (isVictor) {
        gsap.to(vlCharV, {
          color: RED_COLOR,
          textShadow: RED_GLOW,
          scale: 1.08,
          duration: 0.35,
          ease: 'power2.out',
        });
        gsap.to(vlCharL, {
          color: '#FFFFFF',
          opacity: 0.35,
          textShadow: 'none',
          scale: 1,
          duration: 0.35,
          ease: 'power2.out',
        });
      } else {
        gsap.to(vlCharL, {
          color: RED_COLOR,
          textShadow: RED_GLOW,
          scale: 1.08,
          duration: 0.35,
          ease: 'power2.out',
        });
        gsap.to(vlCharV, {
          color: '#FFFFFF',
          opacity: 0.35,
          textShadow: 'none',
          scale: 1,
          duration: 0.35,
          ease: 'power2.out',
        });
      }
    }
  }

  /**
   * Transição fluida entre perfis dos sócios (State Machine)
   */
  function switchFounderDirect(targetFounder, options = {}) {
    if (isTransitioning || activeFounder === targetFounder) return;
    isTransitioning = true;
    activeFounder = targetFounder;

    updateBrandmarkVisuals(targetFounder);
    if (!options.silent) playIgnite();

    const outgoingStage = targetFounder === 'victor' ? stageLuiz : stageVictor;
    const incomingStage = targetFounder === 'victor' ? stageVictor : stageLuiz;

    if (!outgoingStage || !incomingStage) {
      isTransitioning = false;
      return;
    }

    // Transição suave de cross-fade com GSAP
    gsap.to(outgoingStage, {
      opacity: 0,
      y: targetFounder === 'victor' ? 12 : -12,
      duration: 0.25,
      ease: 'power2.in',
      onComplete: () => {
        outgoingStage.style.display = 'none';
        outgoingStage.classList.remove('is-active');
        outgoingStage.setAttribute('aria-hidden', 'true');

        incomingStage.style.display = 'block';
        incomingStage.classList.add('is-active');
        incomingStage.removeAttribute('aria-hidden');

        gsap.fromTo(
          incomingStage,
          { opacity: 0, y: targetFounder === 'victor' ? -12 : 12 },
          {
            opacity: 1,
            y: 0,
            duration: 0.35,
            ease: 'power2.out',
            onComplete: () => {
              isTransitioning = false;
              typeFounderName(targetFounder);
              ScrollTrigger?.refresh();
            },
          }
        );
      },
    });

    document.dispatchEvent(new CustomEvent('founder:changed', { detail: { founder: targetFounder } }));
  }

  // ---------------------------------------------------------------------------
  // INTERAÇÕES: CLIQUES & HOVERS NAS LETRAS "V" E "L" DO BRANDMARK
  // ---------------------------------------------------------------------------
  if (vlSymbolV) {
    vlSymbolV.addEventListener('click', (e) => {
      e.preventDefault();
      switchFounderDirect('victor');
    });
    vlSymbolV.addEventListener('mouseenter', () => {
      if (activeFounder !== 'victor') {
        gsap.to(vlCharV, { color: '#FFFFFF', opacity: 0.85, scale: 1.04, duration: 0.2 });
      }
    });
    vlSymbolV.addEventListener('mouseleave', () => {
      if (activeFounder !== 'victor') {
        gsap.to(vlCharV, { color: '#FFFFFF', opacity: 0.35, scale: 1, duration: 0.2 });
      }
    });
  }

  if (vlSymbolL) {
    vlSymbolL.addEventListener('click', (e) => {
      e.preventDefault();
      switchFounderDirect('luiz');
    });
    vlSymbolL.addEventListener('mouseenter', () => {
      if (activeFounder !== 'luiz') {
        gsap.to(vlCharL, { color: '#FFFFFF', opacity: 0.85, scale: 1.04, duration: 0.2 });
      }
    });
    vlSymbolL.addEventListener('mouseleave', () => {
      if (activeFounder !== 'luiz') {
        gsap.to(vlCharL, { color: '#FFFFFF', opacity: 0.35, scale: 1, duration: 0.2 });
      }
    });
  }

  // Botões Seletores em Pill
  if (btnSwitchVictor) {
    btnSwitchVictor.addEventListener('click', () => switchFounderDirect('victor'));
  }
  if (btnSwitchLuiz) {
    btnSwitchLuiz.addEventListener('click', () => switchFounderDirect('luiz'));
  }

  // Sincronização inicial do estado
  updateBrandmarkVisuals('victor');
  typeFounderName('victor');

  // ---------------------------------------------------------------------------
  // ENTRADA REVEAL SUAVE AO ROLAR ATÉ A SEÇÃO (SEM VIEWPORT PINNING PROBLEMÁTICO)
  // ---------------------------------------------------------------------------
  let revealTimeline = null;
  if (!prefersReducedMotion()) {
    const headerEl = section.querySelector('.founders-stage-header');
    const logoEl = document.getElementById('vlMonumentStage');

    revealTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 82%',
        toggleActions: 'play none none none',
      },
    });

    if (headerEl) {
      revealTimeline.fromTo(
        headerEl,
        { opacity: 0, y: 35 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
      );
    }

    if (logoEl) {
      revealTimeline.fromTo(
        logoEl,
        { opacity: 0, scale: 0.92 },
        { opacity: 1, scale: 1, duration: 0.75, ease: 'back.out(1.4)' },
        '-=0.45'
      );
    }

    if (stageVictor) {
      revealTimeline.fromTo(
        stageVictor,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.85, ease: 'power3.out' },
        '-=0.4'
      );
    }
  }

  return {
    timeline: revealTimeline,
    switchFounder: switchFounderDirect,
    getCurrentFounder: () => activeFounder,
  };
}
