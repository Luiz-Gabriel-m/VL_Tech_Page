/* ==========================================================================
   HERO — Sequência Cinemática de Scrollytelling com GSAP ScrollTrigger
   
   1. Início da Hero:
      - O palco de Luiz Gabriel inicia visível logo após o fade-out do preloader.
      - A letra 'L' do nome de Luiz Gabriel aparece em destaque vermelho brilhante (#FF1E26).
      - O nome "LUIZ GABRIEL" é digitado automaticamente (efeito typewriter).
      - Ao rolar a página, as descrições de Front-end surgem progressivamente letra por letra.
   
   2. Transição do 'L' para o Centro e Retorno ao Branco Padrão:
      - Ao rolar a página para baixo, o 'L' vermelho descola-se suavemente para o centro da tela.
      - Ao unir-se ao monograma central "VL", retorna à cor branca padrão (#F8F8FC).
   
   3. O 'V' assume o papel dinâmico e transiciona para Victor Whohlers:
      - O 'V' do Victor Whohlers ganha intenso destaque em vermelho brilhante (#FF1E26).
      - Transição fluida e espelhada para o palco do Victor Whohlers.
      - Digitação automática do nome "VICTOR WHOHLERS" com o 'V' em vermelho neon.
      - Ao rolar, a especialidade de Back-end / Cloud surge letra por letra.
      - Zero sobreposição de texto entre os fundadores (isolamento estrito de visibilidade).
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

  // Elementos da Transição do Logotipo Central VL
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

  // Prepara os textos descritivos divididos em letras para revelação ao rolar
  const luizChars = splitTextIntoChars(luizOutline);
  const victorChars = splitTextIntoChars(victorOutline);

  // Configura tilt nos retratos
  setupPortraitTilt(luizPortraitStage, luizVisual);
  setupPortraitTilt(victorPortraitStage, victorVisual);

  // Controle de estado ativo e digitação
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
   * Efeito Typewriter para os nomes dos fundadores
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

  // Se reduz movimento, desativa timeline complexa
  if (prefersReducedMotion()) {
    if (luizTypedText) luizTypedText.textContent = 'UIZ GABRIEL';
    if (victorTypedText) victorTypedText.textContent = 'ICTOR WHOHLERS';
    gsap.set(stageLuiz, { autoAlpha: 1, display: 'flex' });
    gsap.set(stageVictor, { autoAlpha: 0, display: 'none' });
    gsap.set(stageLogo, { autoAlpha: 0, display: 'none' });
    gsap.set(luizChars, { opacity: 1, y: 0 });
    gsap.set(victorChars, { opacity: 1, y: 0 });
    return null;
  }

  // 1. Estado Inicial Absoluto:
  // Palco do Luiz Gabriel começa visível no topo, com o 'L' em vermelho neon brilhante.
  // Palcos do Victor e do Logo central começam estritamente ocultos (autoAlpha: 0 e display: none).
  gsap.set(stageLuiz, { autoAlpha: 1, display: 'flex', pointerEvents: 'auto' });
  gsap.set(stageLogo, { autoAlpha: 0, display: 'none', pointerEvents: 'none' });
  gsap.set(stageVictor, { autoAlpha: 0, display: 'none', pointerEvents: 'none' });

  // O 'L' de Luiz Gabriel ganha destaque brilhante em vermelho neon (#FF1E26)
  if (partnerInitial) {
    gsap.set(partnerInitial, {
      color: '#FF1E26',
      textShadow: '0 0 28px rgba(255, 30, 38, 0.95), 0 0 55px rgba(255, 30, 38, 0.5)',
    });
  }

  // Letras de descrição iniciam com leve transparência para revelar ao rolar
  gsap.set(luizChars, { opacity: 0.12, y: 6 });
  gsap.set(victorChars, { opacity: 0.12, y: 6 });

  gsap.set([luizJustification, luizMeta], { autoAlpha: 0, y: 25 });
  gsap.set([victorJustification, victorMeta], { autoAlpha: 0, y: 25 });

  if (luizTypedText) luizTypedText.textContent = '';
  if (victorTypedText) victorTypedText.textContent = '';

  /**
   * Disparo inicial ao concluir o preloader
   */
  let introStarted = false;
  function startIntroAnimation() {
    if (introStarted) return;
    introStarted = true;

    // Garante que o palco do Luiz está ativo e visível
    gsap.set(stageLuiz, { autoAlpha: 1, display: 'flex', pointerEvents: 'auto' });
    gsap.set(stageLogo, { autoAlpha: 0, display: 'none', pointerEvents: 'none' });
    gsap.set(stageVictor, { autoAlpha: 0, display: 'none', pointerEvents: 'none' });

    // Dispara a digitação elegante do nome LUIZ GABRIEL
    typeFounderName('luiz');
    document.dispatchEvent(new CustomEvent(HERO_INTRO_EVENT));
    ScrollTrigger.refresh();
  }

  // Timeline Cinemática Principal com GSAP ScrollTrigger
  const scrollyTimeline = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: hero,
      start: 'top top',
      end: '+=4200',
      pin: heroPin,
      pinSpacing: true,
      scrub: 1.15,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const progress = self.progress;

        // Atualização sincronizada dos passos laterais e do sócio ativo
        if (progress < 0.3) {
          syncFounderState('luiz');
          setStepActive(stepLuiz);
          hasIgnitedV = false;
          hasSoundTransition = false;
        } else if (progress >= 0.3 && progress < 0.65) {
          setStepActive(stepLogo);
          if (!hasSoundTransition && progress > 0.34) {
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
          if (!victorHasTyped) {
            typeFounderName('victor');
          }
        }
      },
    },
  });

  /* --------------------------------------------------------------------------
     1. ETAPA DE ROLAGEM 1: Revelação da Especialidade de Luiz Gabriel
     Ao iniciar a rolagem, a descrição descritiva ("ESPECIALISTA EM FRONT-END...")
     surge gradualmente letra por letra, acompanhada do badge e retrato.
     -------------------------------------------------------------------------- */
  scrollyTimeline
    .to(
      luizChars,
      {
        opacity: 1,
        y: 0,
        stagger: 0.03,
        duration: 1.2,
        ease: 'power1.out',
      },
      0.1
    )
    .to(luizJustification, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power2.out' }, 0.4)
    .to(luizMeta, { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power2.out' }, 0.6)
    .to({}, { duration: 0.8 }, 1.3);

  /* --------------------------------------------------------------------------
     2. ETAPA DE ROLAGEM 2: O 'L' vermelho descola para o centro e volta ao branco
     Luiz Gabriel dissolve suavemente. O monograma central surge com o 'L' vermelho.
     Ao unir-se ao centro, o 'L' retorna suavemente à cor branca padrão (#F8F8FC).
     -------------------------------------------------------------------------- */
  scrollyTimeline
    // Fade out elegante dos detalhes de Luiz
    .to(
      [luizTopline, luizOutline, luizJustification, luizPortraitStage, luizMeta],
      { autoAlpha: 0, y: -25, duration: 1.0, ease: 'power2.inOut', stagger: 0.03 },
      2.1
    )
    .to(luizName, { autoAlpha: 0, y: -20, duration: 0.9, ease: 'power2.inOut' }, 2.3)
    // O palco central do Logotipo é ativado
    .set(stageLogo, { display: 'flex' }, 3.0)
    .set(stageLuiz, { display: 'none', pointerEvents: 'none' }, 3.1)
    // O 'V' central inicia em branco e o 'L' inicia em vermelho brilhante (deslocado)
    .set(letterV, { color: '#F8F8FC', textShadow: 'none', scale: 1, autoAlpha: 1, x: 0, filter: 'none' }, 3.0)
    .set(letterL, {
      color: '#FF1E26',
      textShadow: '0 0 35px #FF1E26, 0 0 75px #FF1E26',
      scale: 1.15,
      autoAlpha: 1,
      x: 0,
      filter: 'none'
    }, 3.0)
    .to(stageLogo, { autoAlpha: 1, pointerEvents: 'auto', duration: 0.8, ease: 'power2.out' }, 3.0)
    .fromTo(
      logoGlow,
      { autoAlpha: 0, scale: 0.5 },
      { autoAlpha: 0.85, scale: 1.15, duration: 1.0, ease: 'power2.out' },
      3.0
    )
    .fromTo(
      tagline,
      { autoAlpha: 0, y: 15 },
      { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power2.out' },
      3.2
    )
    // O 'L' vermelho retorna fluidamente à cor branca padrão (#F8F8FC), unindo o 'VL' em branco
    .to(
      letterL,
      {
        color: '#F8F8FC',
        textShadow: 'none',
        scale: 1,
        duration: 1.0,
        ease: 'power2.inOut',
      },
      3.5
    )
    // Breve momento com o monograma "VL" puramente branco e elegante
    .to({}, { duration: 0.8 }, 4.3);

  /* --------------------------------------------------------------------------
     3. ETAPA DE ROLAGEM 3: O 'V' assume o papel dinâmico em vermelho brilhante
     A letra 'L' dissolve suavemente. A letra 'V' ganha destaque vermelho brilhante (#FF1E26).
     -------------------------------------------------------------------------- */
  scrollyTimeline
    .to(letterL, { autoAlpha: 0, x: 45, filter: 'blur(10px)', duration: 0.85, ease: 'power2.in' }, 5.1)
    .to(tagline, { autoAlpha: 0, y: 15, duration: 0.7, ease: 'power2.in' }, 5.1)
    // O 'V' ganha o brilho vermelho neon intenso (#FF1E26)
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
      5.1
    )
    .to(
      logoGlow,
      {
        background:
          'radial-gradient(circle, rgba(255, 30, 38, 0.75) 0%, rgba(255, 30, 38, 0.2) 48%, transparent 75%)',
        scale: 1.35,
        duration: 0.9,
      },
      5.1
    )
    // O logotipo central encerra
    .to(stageLogo, { autoAlpha: 0, duration: 0.8, ease: 'power2.inOut' }, 6.1)
    .set(stageLogo, { display: 'none', pointerEvents: 'none' }, 6.9);

  /* --------------------------------------------------------------------------
     4. ETAPA DE ROLAGEM 4: Transição para o Palco de Victor Whohlers
     O palco do Victor é ativado exclusivamente (stageLuiz permanece display: none).
     O 'V' está em vermelho neon, o nome é digitado e as especialidades reveladas.
     -------------------------------------------------------------------------- */
  scrollyTimeline
    .set(stageVictor, { display: 'flex', autoAlpha: 0 }, 6.8)
    .set(stageLuiz, { display: 'none', autoAlpha: 0 }, 6.8)
    .to(stageVictor, { autoAlpha: 1, pointerEvents: 'auto', duration: 0.8, ease: 'power2.out' }, 6.9)
    .fromTo(
      victorTopline,
      { autoAlpha: 0, y: -20 },
      { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power2.out' },
      7.0
    )
    .fromTo(
      victorName,
      { autoAlpha: 0, y: 20 },
      { autoAlpha: 1, y: 0, duration: 0.8, ease: 'expo.out' },
      7.1
    )
    .fromTo(
      victorPortraitStage,
      { autoAlpha: 0, scale: 0.95 },
      { autoAlpha: 1, scale: 1, duration: 1.0, ease: 'expo.out' },
      7.2
    )
    // Revelação progressiva da especialidade de Victor letra por letra
    .to(
      victorChars,
      {
        opacity: 1,
        y: 0,
        stagger: 0.03,
        duration: 1.2,
        ease: 'power1.out',
      },
      7.4
    )
    .to(victorJustification, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power2.out' }, 7.7)
    .to(victorMeta, { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power2.out' }, 7.9)
    // Pausa confortável para leitura antes da liberação do pin
    .to({}, { duration: 1.6 }, 8.9);

  // Navegação suave pelos botões laterais
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

  // Integração com o seletor de perfil no header
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
