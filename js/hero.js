/* ==========================================================================
   HERO / SÓCIOS — Interactive VL Brandmark Sequence & State Machine
   - State 1 (Vitor Whohlers): "V" highlighted in vibrant red (#FF1E26 / #ff2a2a),
     "L" remains subdued/white. Triggers and reveals Vitor's profile information,
     backend/cloud expertise, and portrait.
   - State 2 (Luiz Gabriel): "V" transitions to neutral white, "L" lights up in
     vibrant red (#FF1E26 / #ff2a2a). Shifts the view to reveal Luiz Gabriel's
     profile information, front-end/3D expertise, and portrait.
   - GSAP ScrollTrigger & Click Synchronization: Seamless color morphing and
     crossfade between co-founders via both scroll scrubbing and direct clicks.
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

/**
 * Divide o texto do elemento em palavras e caracteres individuais (.type-char)
 */
function splitTextIntoChars(element) {
  if (!element) return [];
  const text = element.textContent.trim();
  element.innerHTML = '';
  const charSpans = [];

  const words = text.split(/\s+/);
  words.forEach((word, wordIndex) => {
    const wordSpan = document.createElement('span');
    wordSpan.className = 'word-span';

    for (let i = 0; i < word.length; i++) {
      const charSpan = document.createElement('span');
      charSpan.className = 'type-char';
      charSpan.textContent = word[i];
      wordSpan.appendChild(charSpan);
      charSpans.push(charSpan);
    }

    element.appendChild(wordSpan);

    if (wordIndex < words.length - 1) {
      const spaceSpan = document.createElement('span');
      spaceSpan.className = 'type-space';
      spaceSpan.innerHTML = '&nbsp;';
      element.appendChild(spaceSpan);
    }
  });

  return charSpans;
}

export function initHero() {
  const scrollySection = document.getElementById('socios-scrolly');
  const heroPin = document.getElementById('heroPin');
  if (!scrollySection || !heroPin) return null;

  // Palcos dos Sócios (Estado 1: Victor, Estado 2: Luiz)
  const stageVictor = document.getElementById('stageVictor');
  const stageLuiz = document.getElementById('stageLuiz');

  // Interactive VL Brandmark Switcher Elements
  const vlSymbolV = document.getElementById('vlSymbolV');
  const vlSymbolL = document.getElementById('vlSymbolL');
  const vlCharV = vlSymbolV ? vlSymbolV.querySelector('.vl-char') : null;
  const vlCharL = vlSymbolL ? vlSymbolL.querySelector('.vl-char') : null;
  const vlBrandmarkStatusText = document.getElementById('vlBrandmarkStatusText');

  // Elementos do Palco Victor Whohlers (Estado 1)
  const victorTopline = document.getElementById('victorTopline');
  const victorName = document.getElementById('victorGiantName');
  const victorInitial = document.getElementById('victorInitial');
  const victorTypedText = document.getElementById('victorTypedText');
  const victorCaret = document.getElementById('victorCaret');
  const victorOutline = document.getElementById('victorGiantOutline');
  const victorJustification = document.getElementById('victorJustification');
  const victorVisual = document.getElementById('victor-visual');
  const victorPortraitStage = document.getElementById('victorPortraitStage');
  const victorMeta = document.getElementById('victorMeta');

  // Elementos do Palco Luiz Gabriel (Estado 2)
  const luizTopline = document.getElementById('luizTopline');
  const luizName = document.getElementById('heroGiantName');
  const partnerInitial = document.getElementById('partnerInitial');
  const luizTypedText = document.getElementById('luizTypedText');
  const luizCaret = document.getElementById('luizCaret');
  const luizOutline = document.getElementById('heroGiantOutline');
  const luizJustification = document.getElementById('heroJustification');
  const luizVisual = document.getElementById('luiz-visual');
  const luizPortraitStage = document.getElementById('luizPortraitStage');
  const luizMeta = document.getElementById('luizMeta');

  // Background Letter & Ambient Glow
  const bgVectorLetter = document.getElementById('bgVectorLetter');
  const heroAmbientGlow = document.getElementById('heroAmbientGlow');

  // Indicadores de Passos Laterais
  const stepVictor = document.getElementById('scrollyStepVictor');
  const stepLuiz = document.getElementById('scrollyStepLuiz');

  // Sincronização com Header Switch & Seção Manifesto
  const activeName = document.getElementById('activeName');
  const founderToggleBtn = document.getElementById('founderToggleBtn');
  const aboutFounderName = document.getElementById('aboutFounderName');
  const aboutFounderRole = document.getElementById('aboutFounderRole');

  // Prepara os textos descritivos divididos em letras para revelação
  const victorChars = splitTextIntoChars(victorOutline);
  const luizChars = splitTextIntoChars(luizOutline);

  // Configura tilt nos retratos
  setupPortraitTilt(victorPortraitStage, victorVisual);
  setupPortraitTilt(luizPortraitStage, luizVisual);

  // Cores da Máquina de Estados VL
  const RED_COLOR = '#FF1E26';
  const RED_GLOW = '0 0 15px rgba(255, 30, 38, 0.95), 0 0 35px rgba(255, 30, 38, 0.75), 0 0 70px rgba(255, 30, 38, 0.45)';
  const WHITE_SUBDUED = 'rgba(248, 248, 252, 0.45)';
  const WHITE_GLOW = 'none';

  // Controle de estado ativo
  let activeFounder = 'victor'; // Inicia com Victor (Estado 1)
  let isTransitioning = false;
  let victorTypingTimer = null;
  let luizTypingTimer = null;

  /**
   * Typewriter Effect para o nome ativo
   */
  function typeFounderName(nameKey) {
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
      }, 40);
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
      }, 40);
    }
  }

  /**
   * Sincronização de Metadados e Interfaces Globais
   */
  function syncFounderMetadata(founder) {
    activeFounder = founder;

    if (activeName) {
      activeName.textContent = founder === 'victor' ? 'VICTOR WHOHLERS' : 'LUIZ GABRIEL';
    }

    if (aboutFounderName) {
      aboutFounderName.textContent = founder === 'victor'
        ? 'Victor Whohlers — Co-founder & Cloud Architect'
        : 'Luiz Gabriel — Co-founder & Tech Lead';
    }

    if (aboutFounderRole) {
      aboutFounderRole.textContent = founder === 'victor'
        ? 'Especialista em Back-end, Cloud & Lógica de Sistemas · VL Tech'
        : 'Especialista em Front-end, Arquitetura Web & Automações · VL Tech';
    }

    if (bgVectorLetter) {
      bgVectorLetter.textContent = founder === 'victor' ? 'V' : 'L';
    }

    if (vlBrandmarkStatusText) {
      vlBrandmarkStatusText.textContent = founder === 'victor'
        ? 'ESTADO ATIVO: VITOR WHOHLERS // BACK-END & CLOUD ARCHITECT'
        : 'ESTADO ATIVO: LUIZ GABRIEL // FRONT-END & 3D WEBGL LEAD';
    }

    if (stepVictor && stepLuiz) {
      stepVictor.classList.toggle('is-active', founder === 'victor');
      stepLuiz.classList.toggle('is-active', founder === 'luiz');
    }

    if (vlSymbolV && vlSymbolL) {
      vlSymbolV.classList.toggle('is-active', founder === 'victor');
      vlSymbolL.classList.toggle('is-active', founder === 'luiz');
      vlSymbolV.setAttribute('aria-selected', founder === 'victor' ? 'true' : 'false');
      vlSymbolL.setAttribute('aria-selected', founder === 'luiz' ? 'true' : 'false');
    }

    document.dispatchEvent(new CustomEvent('founder:changed', { detail: { founder } }));
  }

  // Se o usuário prefere movimento reduzido:
  if (prefersReducedMotion()) {
    if (victorTypedText) victorTypedText.textContent = 'ICTOR WHOHLERS';
    if (luizTypedText) luizTypedText.textContent = 'UIZ GABRIEL';
    gsap.set(stageVictor, { autoAlpha: 1, display: 'flex' });
    gsap.set(stageLuiz, { autoAlpha: 0, display: 'none' });
    syncFounderMetadata('victor');
    return null;
  }

  // ==========================================================================
  // 1. CONFIGURAÇÃO DO ESTADO INICIAL 1 (VITOR WHOHLERS)
  // "V" em vermelho vibrante (#FF1E26), "L" em branco neutro/subdued
  // ==========================================================================
  gsap.set(stageVictor, { autoAlpha: 1, display: 'flex', pointerEvents: 'auto' });
  gsap.set(stageLuiz, { autoAlpha: 0, display: 'none', pointerEvents: 'none' });

  if (vlCharV) {
    gsap.set(vlCharV, { color: RED_COLOR, textShadow: RED_GLOW, scale: 1.06 });
  }
  if (vlCharL) {
    gsap.set(vlCharL, { color: WHITE_SUBDUED, textShadow: WHITE_GLOW, scale: 1 });
  }

  if (victorInitial) {
    gsap.set(victorInitial, { color: RED_COLOR, textShadow: RED_GLOW });
  }
  if (partnerInitial) {
    gsap.set(partnerInitial, { color: RED_COLOR, textShadow: RED_GLOW });
  }

  gsap.set(victorChars, { opacity: 1, y: 0 });
  gsap.set(luizChars, { opacity: 1, y: 0 });
  if (victorTypedText) victorTypedText.textContent = 'ICTOR WHOHLERS';
  if (luizTypedText) luizTypedText.textContent = 'UIZ GABRIEL';

  syncFounderMetadata('victor');

  // ==========================================================================
  // 2. TIMELINE GSAP SCROLLTRIGGER — MORPHING "VL" & SWAP SUAVE
  // ==========================================================================
  const scrollyTimeline = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: scrollySection,
      start: 'top top',
      end: '+=2800',
      pin: heroPin,
      pinSpacing: true,
      scrub: 0.9,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const progress = self.progress;

        if (progress < 0.5) {
          if (activeFounder !== 'victor') {
            syncFounderMetadata('victor');
          }
        } else {
          if (activeFounder !== 'luiz') {
            syncFounderMetadata('luiz');
          }
        }
      },
    },
  });

  // ETAPA 1 (0.0 -> 0.4): Vitor Whohlers visível e fixado para leitura confortável
  scrollyTimeline.to({}, { duration: 1.4 });

  // TRANSIÇÃO INTERATIVA DE MORPHING DO BRANDMARK "VL" (0.4 -> 0.6)
  // 1. "V" apaga de vermelho para branco neutro
  // 2. "L" acende de branco para vermelho neon vibrante
  // 3. Stage Victor crossfades suavemente para Stage Luiz
  scrollyTimeline
    .addLabel('morphStart')
    // Desvanece palco de Victor suavemente
    .to(
      stageVictor,
      {
        autoAlpha: 0,
        y: -25,
        filter: 'blur(6px)',
        duration: 0.85,
        ease: 'power2.inOut',
        onStart: () => {
          playSwoosh();
        },
      },
      'morphStart'
    )
    // Transição de cores na letra 'V' (Vermelho -> Branco Subdued)
    .to(
      vlCharV,
      {
        color: WHITE_SUBDUED,
        textShadow: 'none',
        scale: 1,
        duration: 0.8,
        ease: 'power2.inOut',
      },
      'morphStart'
    )
    // Transição de cores na letra 'L' (Branco Subdued -> Vermelho Neon Vibrante)
    .to(
      vlCharL,
      {
        color: RED_COLOR,
        textShadow: RED_GLOW,
        scale: 1.06,
        duration: 0.8,
        ease: 'power2.inOut',
        onStart: () => {
          playIgnite();
        },
      },
      'morphStart+=0.15'
    )
    // Troca de display e ativação do palco de Luiz Gabriel
    .set(stageVictor, { display: 'none', pointerEvents: 'none' }, 'morphStart+=0.85')
    .set(stageLuiz, { display: 'flex', autoAlpha: 0, y: 25, filter: 'blur(6px)' }, 'morphStart+=0.85')
    .to(
      stageLuiz,
      {
        autoAlpha: 1,
        y: 0,
        filter: 'blur(0px)',
        pointerEvents: 'auto',
        duration: 0.85,
        ease: 'power2.out',
      },
      'morphStart+=0.85'
    );

  // ETAPA 2 (0.6 -> 1.0): Luiz Gabriel visível e fixado para leitura confortável
  scrollyTimeline.to({}, { duration: 1.4 });

  // ==========================================================================
  // 3. CONTROLE DE ALTERNÂNCIA DIRETA POR CLIQUE (CLICK-DRIVEN SWITCHING)
  // ==========================================================================
  function switchFounderDirect(founder) {
    if (isTransitioning || activeFounder === founder) return;
    isTransitioning = true;
    syncFounderMetadata(founder);

    const st = scrollyTimeline.scrollTrigger;
    const targetProgress = founder === 'victor' ? 0.08 : 0.88;

    if (founder === 'victor') {
      playIgnite();
      gsap.to(vlCharL, { color: WHITE_SUBDUED, textShadow: 'none', scale: 1, duration: 0.35 });
      gsap.to(vlCharV, { color: RED_COLOR, textShadow: RED_GLOW, scale: 1.06, duration: 0.35 });

      gsap.to(stageLuiz, {
        autoAlpha: 0,
        y: 20,
        duration: 0.3,
        ease: 'power2.inOut',
        onComplete: () => {
          stageLuiz.style.display = 'none';
          stageLuiz.style.pointerEvents = 'none';
          stageVictor.style.display = 'flex';
          stageVictor.style.pointerEvents = 'auto';
          gsap.fromTo(
            stageVictor,
            { autoAlpha: 0, y: -20, filter: 'blur(4px)' },
            {
              autoAlpha: 1,
              y: 0,
              filter: 'blur(0px)',
              duration: 0.35,
              ease: 'power2.out',
              onComplete: () => {
                isTransitioning = false;
                typeFounderName('victor');
              },
            }
          );
        },
      });
    } else {
      playIgnite();
      gsap.to(vlCharV, { color: WHITE_SUBDUED, textShadow: 'none', scale: 1, duration: 0.35 });
      gsap.to(vlCharL, { color: RED_COLOR, textShadow: RED_GLOW, scale: 1.06, duration: 0.35 });

      gsap.to(stageVictor, {
        autoAlpha: 0,
        y: -20,
        duration: 0.3,
        ease: 'power2.inOut',
        onComplete: () => {
          stageVictor.style.display = 'none';
          stageVictor.style.pointerEvents = 'none';
          stageLuiz.style.display = 'flex';
          stageLuiz.style.pointerEvents = 'auto';
          gsap.fromTo(
            stageLuiz,
            { autoAlpha: 0, y: 20, filter: 'blur(4px)' },
            {
              autoAlpha: 1,
              y: 0,
              filter: 'blur(0px)',
              duration: 0.35,
              ease: 'power2.out',
              onComplete: () => {
                isTransitioning = false;
                typeFounderName('luiz');
              },
            }
          );
        },
      });
    }

    if (st) {
      const targetScroll = st.start + (st.end - st.start) * targetProgress;
      window.scrollTo({
        top: targetScroll,
        behavior: 'smooth',
      });
    }
  }

  // Click listeners nos botões do Brandmark Interativo VL
  if (vlSymbolV) {
    vlSymbolV.addEventListener('click', (e) => {
      e.preventDefault();
      switchFounderDirect('victor');
    });
  }

  if (vlSymbolL) {
    vlSymbolL.addEventListener('click', (e) => {
      e.preventDefault();
      switchFounderDirect('luiz');
    });
  }

  // Click listeners nos indicadores laterais
  if (stepVictor) {
    stepVictor.addEventListener('click', () => switchFounderDirect('victor'));
  }

  if (stepLuiz) {
    stepLuiz.addEventListener('click', () => switchFounderDirect('luiz'));
  }

  // Click listener no seletor de perfil da barra de navegação superior
  if (founderToggleBtn) {
    founderToggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const nextFounder = activeFounder === 'victor' ? 'luiz' : 'victor';
      switchFounderDirect(nextFounder);
    });
  }

  // Gatilho inicial ao concluir o preloader
  function startIntroAnimation() {
    syncFounderMetadata('victor');
    typeFounderName('victor');
    document.dispatchEvent(new CustomEvent(HERO_INTRO_EVENT));
    ScrollTrigger.refresh();
  }

  if (window.__loaderComplete) {
    startIntroAnimation();
  } else {
    document.addEventListener('loader:complete', startIntroAnimation, { once: true });
    window.addEventListener('loader:complete', startIntroAnimation, { once: true });
  }

  return {
    timeline: scrollyTimeline,
    switchFounder: switchFounderDirect,
    getCurrentFounder: () => activeFounder,
  };
}
