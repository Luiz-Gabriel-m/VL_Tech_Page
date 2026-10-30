/* ==========================================================================
   HERO — Sequência Cinemática de Scrollytelling com GSAP ScrollTrigger
   
   1. Preloader -> Entrada com Logotipo Centralizado VL Tech
   2. Sequência de Entrada e Animação do Luiz Gabriel (Foco no 'L'):
      - O monograma VL centralizado surge na tela preta (#0A0A0C).
      - A letra 'L' do logotipo ganha destaque em vermelho brilhante (#FF1E26).
      - Transição fluida para o palco de Luiz Gabriel.
      - Digitação automática do nome "LUIZ GABRIEL" (efeito typewriter).
      - Ao rolar a página (ScrollTrigger), a descrição de front-end surge 
        gradualmente letra por letra, acompanhada do retrato e do "L" estilizado.
   3. Transição e Sequência para o Victor Whohlers (Foco no 'V'):
      - Ao rolar ou clicar no seletor de perfil, a tela transiciona.
      - Symmetria espelhada: foco na letra 'V' em vermelho brilhante (#FF1E26).
      - Digitação automática do nome "VICTOR WHOHLERS".
      - Ao rolar a página, a descrição de Back-end / Cloud surge letra por letra.
   ========================================================================== */

import { gsap, ScrollTrigger } from './core/gsap.js';
import { playIgnite, playSwoosh } from './sound.js';

export const HERO_INTRO_EVENT = 'hero:intro-complete';

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Adiciona interação suave de paralaxe (tilt) 3D via GSAP nos retratos dos fundadores
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
 * para revelação progressiva letra por letra no ScrollTrigger, preservando quebras de linha naturais.
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
  const hero = document.getElementById('hero');
  const heroPin = document.getElementById('heroPin');
  if (!hero || !heroPin) return null;

  // Palcos do Scrollytelling
  const stageLuiz = document.getElementById('stageLuiz');
  const stageLogo = document.getElementById('stageVLLogo');
  const stageVictor = document.getElementById('stageVictor');

  // Elementos do Palco Luiz Gabriel
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

  // Elementos da Transição do Logotipo Central VL & Foco nas Iniciais
  const logoCenter = document.getElementById('scrollyLogoCenter');
  const logoGlow = document.getElementById('scrollyLogoGlow');
  const letterV = document.getElementById('scrollyLetterV');
  const letterL = document.getElementById('scrollyLetterL');
  const monogram = document.getElementById('scrollyMonogramDisplay');
  const tagline = document.getElementById('scrollyTaglineContainer');

  // Elementos do Palco Victor Whohlers
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

  // Background Letter & Ambient Glow
  const bgVectorLetter = document.getElementById('bgVectorLetter');
  const heroAmbientGlow = document.getElementById('heroAmbientGlow');

  // Indicadores de Passos Laterais
  const stepLuiz = document.getElementById('scrollyStepLuiz');
  const stepLogo = document.getElementById('scrollyStepLogo');
  const stepVictor = document.getElementById('scrollyStepVictor');
  const steps = [stepLuiz, stepLogo, stepVictor].filter(Boolean);

  // Sincronização com Header Switch & Seção Manifesto
  const activeName = document.getElementById('activeName');
  const founderToggleBtn = document.getElementById('founderToggleBtn');
  const aboutFounderName = document.getElementById('aboutFounderName');
  const aboutFounderRole = document.getElementById('aboutFounderRole');

  // Prepara os textos descritivos divididos em letras para animação progressiva
  const luizChars = splitTextIntoChars(luizOutline);
  const victorChars = splitTextIntoChars(victorOutline);

  // Configura tilt nos retratos
  setupPortraitTilt(luizPortraitStage, luizVisual);
  setupPortraitTilt(victorPortraitStage, victorVisual);

  // Estado ativo e controle de digitação e som
  let activeFounder = 'luiz';
  let hasIgnitedV = false;
  let hasSoundTransition = false;
  let victorHasTyped = false;
  let luizTypingTimer = null;
  let victorTypingTimer = null;

  function setStepActive(activeStep) {
    steps.forEach((step) => {
      const isActive = step === activeStep;
      step.classList.toggle('is-active', isActive);
      step.setAttribute('aria-current', isActive ? 'step' : 'false');
    });
  }

  function syncFounderState(founder) {
    if (activeFounder === founder) return;
    activeFounder = founder;

    if (activeName) {
      activeName.textContent = founder === 'luiz' ? 'LUIZ GABRIEL' : 'VICTOR WHOHLERS';
    }

    if (aboutFounderName) {
      aboutFounderName.textContent = founder === 'luiz' 
        ? 'Luiz Gabriel — Co-founder & Tech Lead' 
        : 'Victor Whohlers — Co-founder & Cloud Architect';
    }

    if (aboutFounderRole) {
      aboutFounderRole.textContent = founder === 'luiz'
        ? 'Especialista em Front-end, Arquitetura Web & Automações · VL Tech'
        : 'Especialista em Back-end, Cloud & Lógica de Sistemas · VL Tech';
    }

    if (bgVectorLetter) {
      bgVectorLetter.textContent = founder === 'luiz' ? 'L' : 'V';
    }

    document.dispatchEvent(new CustomEvent('founder:changed', { detail: { founder } }));
  }

  /**
   * Efeito Typewriter limpo e elegante para o nome dos fundadores
   */
  function typeFounderName(nameKey) {
    if (nameKey === 'luiz') {
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
      }, 45);
    } else if (nameKey === 'victor') {
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
          victorHasTyped = true;
          if (victorCaret) victorCaret.classList.add('cursor-idle');
        }
      }, 45);
    }
  }

  // Se reduz movimento, desativa animações complexas
  if (prefersReducedMotion()) {
    if (luizTypedText) luizTypedText.textContent = 'UIZ GABRIEL';
    if (victorTypedText) victorTypedText.textContent = 'ICTOR WHOHLERS';
    gsap.set([stageLuiz, luizName, luizOutline, luizJustification, luizVisual], {
      visibility: 'visible',
      opacity: 1,
    });
    gsap.set(luizChars, { opacity: 1, y: 0 });
    gsap.set(victorChars, { opacity: 1, y: 0 });
    return null;
  }

  // 1. Configuração do Estado Inicial:
  // Inicialmente exibe o logotipo centralizado da VL Tech (conforme especificação)
  // enquanto Luiz e Victor iniciam ocultos até a entrada do preloader.
  gsap.set(stageLogo, { opacity: 1, pointerEvents: 'none', visibility: 'visible' });
  gsap.set([letterV, letterL], { color: '#F8F8FC', textShadow: 'none', scale: 1, opacity: 1 });
  gsap.set(logoGlow, { opacity: 0.35, scale: 1 });
  gsap.set(tagline, { opacity: 0.85, y: 0 });

  gsap.set(stageLuiz, { opacity: 0, pointerEvents: 'none', visibility: 'visible' });
  gsap.set(stageVictor, { opacity: 0, pointerEvents: 'none', visibility: 'visible' });

  // Letras das descrições iniciam com outline sutil para revelação ao rolar
  gsap.set(luizChars, { opacity: 0.12, y: 6 });
  gsap.set(victorChars, { opacity: 0.12, y: 6 });

  gsap.set([luizJustification, luizMeta], { opacity: 0, y: 25 });
  gsap.set([victorJustification, victorMeta], { opacity: 0, y: 25 });

  if (luizTypedText) luizTypedText.textContent = '';
  if (victorTypedText) victorTypedText.textContent = '';

  /**
   * 2. Sequência de Entrada e Animação do Luiz Gabriel (Foco no 'L'):
   * Ao completar o carregamento do preloader:
   * - A letra 'L' do logotipo central ganha destaque em vermelho brilhante (#FF1E26)
   * - Transiciona fluidamente para a tela inicial de Luiz Gabriel
   * - O nome "LUIZ GABRIEL" é digitado automaticamente (typewriter)
   */
  let introStarted = false;
  function startIntroAnimation() {
    if (introStarted) return;
    introStarted = true;

    const introTL = gsap.timeline();

    introTL
      // Breve pausa para contemplação do logotipo centralizado
      .to({}, { duration: 0.35 })
      // Destaque brilhante em vermelho neon na letra 'L'
      .to(letterL, {
        color: '#FF1E26',
        textShadow: '0 0 35px #FF1E26, 0 0 75px #FF1E26, 0 0 130px #FF1E26, 0 0 180px rgba(255, 30, 38, 0.85)',
        scale: 1.15,
        duration: 0.7,
        ease: 'power2.out',
        onStart: () => {
          playIgnite();
        },
      })
      .to(
        logoGlow,
        {
          opacity: 0.85,
          scale: 1.25,
          duration: 0.7,
          ease: 'power2.out',
        },
        '<'
      )
      // Dissolução do 'V' e tagline central
      .to(letterV, { opacity: 0, x: -35, filter: 'blur(8px)', duration: 0.6, ease: 'power2.in' }, '+=0.2')
      .to(tagline, { opacity: 0, y: 15, duration: 0.5, ease: 'power2.in' }, '<')
      .to([stageLogo, logoGlow], { opacity: 0, duration: 0.6, ease: 'power2.inOut' })
      .set(stageLogo, { pointerEvents: 'none' })
      // Revelação fluida da tela inicial do Luiz Gabriel
      .set(stageLuiz, { opacity: 1, pointerEvents: 'auto' })
      .fromTo(luizTopline, { opacity: 0, y: -15 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' })
      .fromTo(luizName, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, '<')
      .fromTo(luizPortraitStage, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.8, ease: 'power2.out' }, '<')
      // Disparo automático do typewriter para o nome LUIZ GABRIEL
      .add(() => {
        typeFounderName('luiz');
        document.dispatchEvent(new CustomEvent(HERO_INTRO_EVENT));
        ScrollTrigger.refresh();
      }, '-=0.2');
  }

  // Timeline Cinemática Principal com GSAP ScrollTrigger
  const scrollyTimeline = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: hero,
      start: 'top top',
      end: '+=4000',
      pin: heroPin,
      pinSpacing: true,
      scrub: 1.15,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const progress = self.progress;

        // Atualização dos indicadores e sócio ativo
        if (progress < 0.28) {
          syncFounderState('luiz');
          setStepActive(stepLuiz);
          hasIgnitedV = false;
          hasSoundTransition = false;
        } else if (progress >= 0.28 && progress < 0.65) {
          setStepActive(stepLogo);
          if (!hasSoundTransition && progress > 0.32) {
            hasSoundTransition = true;
            playSwoosh();
          }
          if (!hasIgnitedV && progress > 0.52) {
            hasIgnitedV = true;
            playIgnite();
          }
        } else {
          syncFounderState('victor');
          setStepActive(stepVictor);
          // Dispara digitação automática do Victor na entrada do seu estágio
          if (!victorHasTyped) {
            typeFounderName('victor');
          }
        }
      },
    },
  });

  /* --------------------------------------------------------------------------
     ETAPA 1: Revelação progressiva da especialidade de Luiz letra por letra
     Ao rolar a página, as escritas ("ESPECIALISTA EM FRONT-END...") surgem
     gradualmente letra por letra, acompanhadas do "L" e do retrato.
     -------------------------------------------------------------------------- */
  scrollyTimeline
    .to(
      luizChars,
      {
        opacity: 1,
        y: 0,
        stagger: 0.035,
        duration: 1.25,
        ease: 'power1.out',
      },
      0.15
    )
    .to(luizJustification, { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out' }, 0.45)
    .to(luizMeta, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, 0.65)
    // Tempo de leitura do perfil de Luiz Gabriel
    .to({}, { duration: 0.9 }, 1.45);

  /* --------------------------------------------------------------------------
     ETAPA 2: Transição e Sequência para o Victor Whohlers (Foco no 'V')
     Luiz faz fade-out. A tela fica preta e o logotipo oficial VL ressurge.
     Em simetria espelhada, a letra 'V' ganha destaque em vermelho brilhante (#FF1E26).
     -------------------------------------------------------------------------- */
  scrollyTimeline
    // Fade out elegante da seção Luiz
    .to(
      [luizTopline, luizName, luizOutline, luizJustification, luizPortraitStage, luizMeta],
      { opacity: 0, y: -25, duration: 1.1, ease: 'power2.inOut', stagger: 0.04 },
      2.35
    )
    .set(stageLuiz, { pointerEvents: 'none' }, 3.1)
    // Entrada do Logotipo Central VL
    .set(stageLogo, { opacity: 1, pointerEvents: 'auto' }, 3.1)
    .set([letterV, letterL], { color: '#F8F8FC', textShadow: 'none', scale: 1, opacity: 1, x: 0, filter: 'none' }, 3.1)
    .fromTo(
      logoGlow,
      { opacity: 0, scale: 0.5 },
      { opacity: 0.85, scale: 1.15, duration: 1.2, ease: 'power2.out' },
      3.1
    )
    .fromTo(
      tagline,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
      3.35
    )
    .to({}, { duration: 0.7 }, 4.35)
    // Foco na letra 'V': a letra 'L' dissolve e o 'V' ganha vermelho neon intenso
    .to(letterL, { opacity: 0, x: 45, filter: 'blur(10px)', duration: 0.85, ease: 'power2.in' }, 5.05)
    .to(tagline, { opacity: 0, y: 20, duration: 0.7, ease: 'power2.in' }, 5.05)
    .to(
      letterV,
      {
        color: '#FF1E26',
        textShadow:
          '0 0 35px #FF1E26, 0 0 75px #FF1E26, 0 0 130px #FF1E26, 0 0 180px rgba(255, 30, 38, 0.85)',
        scale: 1.2,
        duration: 0.9,
        ease: 'power2.out',
      },
      5.05
    )
    .to(
      logoGlow,
      {
        background:
          'radial-gradient(circle, rgba(255, 30, 38, 0.75) 0%, rgba(255, 30, 38, 0.2) 48%, transparent 75%)',
        scale: 1.35,
        duration: 0.9,
      },
      5.05
    )
    // O 'V' vermelho faz transição fluida para o perfil de Victor
    .to(stageLogo, { opacity: 0, duration: 0.8, ease: 'power2.inOut' }, 5.95)
    .set(stageLogo, { pointerEvents: 'none' }, 6.75)
    // Apresentação de Victor Whohlers
    .set(stageVictor, { opacity: 1, pointerEvents: 'auto' }, 6.65)
    .fromTo(
      victorTopline,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
      6.75
    )
    .fromTo(
      victorName,
      { opacity: 0, y: 25 },
      { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out' },
      6.85
    )
    .fromTo(
      victorPortraitStage,
      { opacity: 0, x: 45, scale: 0.95 },
      { opacity: 1, x: 0, scale: 1, duration: 1.1, ease: 'expo.out' },
      6.95
    )
    /* --------------------------------------------------------------------------
       ETAPA 3: Revelação progressiva da especialidade de Victor letra por letra
       Ao rolar a página, as escritas ("ESPECIALISTA EM BACK-END...") surgem
       gradualmente letra por letra, acompanhadas do "V" e do retrato.
       -------------------------------------------------------------------------- */
    .to(
      victorChars,
      {
        opacity: 1,
        y: 0,
        stagger: 0.035,
        duration: 1.25,
        ease: 'power1.out',
      },
      7.2
    )
    .to(victorJustification, { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out' }, 7.5)
    .to(victorMeta, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, 7.7)
    // Tempo de leitura e liberação fluida do pin para as demais seções
    .to({}, { duration: 1.6 }, 8.7);

  // Navegação suave ao clicar nos indicadores laterais
  const scrollToStageProgress = (targetProgress) => {
    const st = scrollyTimeline.scrollTrigger;
    if (!st) return;
    const targetScroll = st.start + (st.end - st.start) * targetProgress;
    window.scrollTo({
      top: targetScroll,
      behavior: 'smooth',
    });
  };

  if (stepLuiz) {
    stepLuiz.addEventListener('click', () => scrollToStageProgress(0.05));
  }
  if (stepLogo) {
    stepLogo.addEventListener('click', () => scrollToStageProgress(0.42));
  }
  if (stepVictor) {
    stepVictor.addEventListener('click', () => scrollToStageProgress(0.88));
  }

  // Integração com o botão do Header (VER PERFIL: LUIZ GABRIEL / VICTOR WHOHLERS)
  if (founderToggleBtn) {
    founderToggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const nextProgress = activeFounder === 'luiz' ? 0.88 : 0.05;
      scrollToStageProgress(nextProgress);
    });
  }

  // Sincronização estrita com a conclusão do preloader
  if (window.__loaderComplete) {
    startIntroAnimation();
  } else {
    document.addEventListener('loader:complete', startIntroAnimation, { once: true });
    window.addEventListener('loader:complete', startIntroAnimation, { once: true });
  }

  return {
    timeline: scrollyTimeline,
    scrollToFounder: (name) => scrollToStageProgress(name === 'victor' ? 0.88 : 0.05),
    getCurrentFounder: () => activeFounder,
  };
}
