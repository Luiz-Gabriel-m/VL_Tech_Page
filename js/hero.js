/* ==========================================================================
   HERO — Sequência Cinemática de Scrollytelling com GSAP ScrollTrigger
   Ordem estrita das animações:
   1. Estado Inicial: Hero de Luiz Gabriel (nome com 'L' vermelho e retrato limpo)
   2. Etapa 1: Revele suave dos textos descritivos e justificativa abaixo do nome
   3. Etapa 2: Fade-out do Luiz, tela preta e o logotipo oficial 'VL' emerge centralizado
   4. Etapa 3: Foco no 'V', brilho intenso vermelho neon, e deslocamento suave para o canto
   5. Etapa 4: Apresentação completa do co-founder Victor Whohlers (Back-end / Cloud)
   6. Conclusão: Liberação do pin para rolagem fluida das demais seções
   ========================================================================== */

import { gsap, ScrollTrigger } from './core/gsap.js';
import { playIgnite, playSwoosh } from './sound.js';

export const HERO_INTRO_EVENT = 'hero:intro-complete';

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Adiciona interação suave de paralaxe (tilt) 3D via GSAP nos palcos de retrato
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
  const luizOutline = document.getElementById('heroGiantOutline');
  const luizJustification = document.getElementById('heroJustification');
  const luizVisual = document.getElementById('luiz-visual');
  const luizPortraitStage = document.getElementById('luizPortraitStage');
  const luizMeta = document.getElementById('luizMeta');

  // Elementos da Transição do Logotipo Central VL & 'V' Dinâmico
  const logoCenter = document.getElementById('scrollyLogoCenter');
  const logoGlow = document.getElementById('scrollyLogoGlow');
  const logoOfficial = document.getElementById('scrollyLogoOfficial');
  const letterV = document.getElementById('scrollyLetterV');
  const letterL = document.getElementById('scrollyLetterL');
  const monogram = document.getElementById('scrollyMonogramDisplay');
  const tagline = document.getElementById('scrollyTaglineContainer');

  // Elementos do Palco Victor Whohlers
  const victorTopline = document.getElementById('victorTopline');
  const victorName = document.getElementById('victorGiantName');
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

  // Configura tilt nos retratos
  setupPortraitTilt(luizPortraitStage, luizVisual);
  setupPortraitTilt(victorPortraitStage, victorVisual);

  // Estado ativo e debounce sonoro
  let activeFounder = 'luiz';
  let hasIgnitedV = false;
  let hasSoundTransition = false;

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

  // Se reduz movimento, desativa scrolltrigger pin
  if (prefersReducedMotion()) {
    gsap.set([stageLuiz, luizName, luizOutline, luizJustification, luizVisual], {
      visibility: 'visible',
      opacity: 1,
    });
    return null;
  }

  // Inicializa o estado visual dos palcos
  gsap.set(stageLuiz, { opacity: 1, pointerEvents: 'auto', visibility: 'visible' });
  gsap.set(stageLogo, { opacity: 0, pointerEvents: 'none', visibility: 'visible' });
  gsap.set(stageVictor, { opacity: 0, pointerEvents: 'none', visibility: 'visible' });

  // 1. Estado Inicial (Hero de Luiz Gabriel como na referência visual)
  // O nome e a foto iniciam visíveis e com impacto.
  // Os textos secundários iniciam recolhidos para revelar na 1ª etapa de rolagem.
  gsap.set([luizName, luizVisual, luizTopline], { opacity: 1, y: 0, visibility: 'visible' });
  gsap.set([luizOutline, luizJustification, luizMeta], { opacity: 0, y: 35, visibility: 'visible' });

  // Cria a Timeline Cinemática com ScrollTrigger Pin
  const scrollyTimeline = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: hero,
      start: 'top top',
      end: '+=3800',
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
        }
      },
    },
  });

  /* --------------------------------------------------------------------------
     2. PRIMEIRA ETAPA DE ROLAGEM: Revele das Demais Escritas
     Ao rolar levemente para baixo, os textos descritivos de especialidade e 
     subtítulos abaixo do nome do Luiz surgem com transição fluida.
     -------------------------------------------------------------------------- */
  scrollyTimeline
    .to(luizOutline, { opacity: 1, y: 0, duration: 1.0, ease: 'power2.out' }, 0.15)
    .to(luizJustification, { opacity: 1, y: 0, duration: 1.0, ease: 'power2.out' }, 0.35)
    .to(luizMeta, { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out' }, 0.55)
    // Pequena pausa para tempo de leitura da apresentação de Luiz
    .to({}, { duration: 0.8 }, 1.35);

  /* --------------------------------------------------------------------------
     3. SEGUNDA ETAPA DE ROLAGEM: Transição do Logotipo Central
     Todos os elementos da seção do Luiz se encerram com fade-out.
     A tela fica totalmente preta e o logotipo oficial da "VL" surge centralizado.
     -------------------------------------------------------------------------- */
  scrollyTimeline
    // Fade out elegante da seção Luiz
    .to(
      [luizTopline, luizName, luizOutline, luizJustification, luizVisual, luizMeta],
      { opacity: 0, y: -30, duration: 1.2, ease: 'power2.inOut', stagger: 0.05 },
      2.15
    )
    .set(stageLuiz, { pointerEvents: 'none' }, 2.9)
    // Entrada imersiva do Logotipo Central VL na tela totalmente preta (#0A0A0C)
    .set(stageLogo, { opacity: 1, pointerEvents: 'auto' }, 2.9)
    .fromTo(
      logoGlow,
      { opacity: 0, scale: 0.5 },
      { opacity: 0.9, scale: 1.15, duration: 1.3, ease: 'power2.out' },
      2.9
    )
    .fromTo(
      logoOfficial,
      { opacity: 0, y: -25, scale: 0.85 },
      { opacity: 1, y: 0, scale: 1, duration: 1.0, ease: 'power3.out' },
      3.05
    )
    .fromTo(
      monogram,
      { opacity: 0, scale: 0.82 },
      { opacity: 1, scale: 1, duration: 1.2, ease: 'expo.out' },
      3.15
    )
    .fromTo(
      tagline,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out' },
      3.35
    )
    // Momento contemplativo com a identidade monumental VL
    .to({}, { duration: 0.9 }, 4.35);

  /* --------------------------------------------------------------------------
     4. TERCEIRA ETAPA DE ROLAGEM: O Brilho e Deslocamento do 'V'
     O logotipo 'VL' se foca no 'V', que ganha intenso brilho vermelho neon.
     Em seguida, o 'V' brilha e desloca-se suavemente para o canto superior esquerdo.
     -------------------------------------------------------------------------- */
  scrollyTimeline
    // A letra 'L', o badge oficial e a tagline dissolvem, deixando o foco total no 'V'
    .to(letterL, { opacity: 0, x: 55, filter: 'blur(10px)', duration: 0.9, ease: 'power2.in' }, 5.25)
    .to([logoOfficial, tagline], { opacity: 0, y: 25, duration: 0.8, ease: 'power2.in' }, 5.25)
    // O 'V' ganha o efeito intenso de brilho vermelho neon (#FF1E26)
    .to(
      letterV,
      {
        color: '#FF1E26',
        textShadow:
          '0 0 35px #FF1E26, 0 0 75px #FF1E26, 0 0 130px #FF1E26, 0 0 180px rgba(255, 30, 38, 0.85)',
        scale: 1.22,
        duration: 0.9,
        ease: 'power2.out',
      },
      5.25
    )
    .to(
      logoGlow,
      {
        background:
          'radial-gradient(circle, rgba(255, 30, 38, 0.75) 0%, rgba(255, 30, 38, 0.2) 48%, transparent 75%)',
        scale: 1.35,
        duration: 0.9,
      },
      5.25
    )
    // O 'V' vermelho brilha e desloca-se suavemente para o canto superior esquerdo
    .to(
      letterV,
      {
        x: '-34vw',
        y: '-26vh',
        scale: 0.65,
        opacity: 0.85,
        duration: 1.3,
        ease: 'power3.inOut',
      },
      6.15
    )
    .to(logoGlow, { opacity: 0, duration: 0.9, ease: 'power2.inOut' }, 6.35)
    .to(stageLogo, { opacity: 0, duration: 0.5 }, 7.35)
    .set(stageLogo, { pointerEvents: 'none' }, 7.45);

  /* --------------------------------------------------------------------------
     5. QUARTA ETAPA DE ROLAGEM: Apresentação do Victor Whohlers
     Imediatamente após o 'V' se posicionar no canto, a tela transiciona 
     revelando a apresentação completa do co-founder Victor Whohlers 
     (Back-end, Cloud & Lógica de Sistemas).
     -------------------------------------------------------------------------- */
  scrollyTimeline
    .set(stageVictor, { opacity: 1, pointerEvents: 'auto' }, 7.35)
    .fromTo(
      victorTopline,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out' },
      7.45
    )
    .fromTo(
      victorName,
      { opacity: 0, y: 35, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 1.1, ease: 'expo.out' },
      7.55
    )
    .fromTo(
      victorOutline,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1.0, ease: 'power3.out' },
      7.8
    )
    .fromTo(
      victorJustification,
      { opacity: 0, y: 25 },
      { opacity: 1, y: 0, duration: 1.0, ease: 'power2.out' },
      8.0
    )
    .fromTo(
      victorVisual,
      { opacity: 0, x: 55, scale: 0.92 },
      { opacity: 1, x: 0, scale: 1, duration: 1.2, ease: 'expo.out' },
      7.6
    )
    .fromTo(
      victorMeta,
      { opacity: 0, y: 25 },
      { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out' },
      8.2
    )
    /* --------------------------------------------------------------------------
       6. CONCLUSÃO DA SEQUÊNCIA: Tempo de Leitura & Liberação do Pin
       Só após a apresentação completa do Victor, o ScrollTrigger libera o pin,
       permitindo que o usuário continue rolando normalmente pelas demais seções.
       -------------------------------------------------------------------------- */
    .to({}, { duration: 1.5 }, 9.2);

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

  // Preloader sync: quando o preloader conclui a cortina, atualiza as dimensões
  document.addEventListener('loader:complete', () => {
    ScrollTrigger.refresh();
  }, { once: true });

  document.dispatchEvent(new CustomEvent(HERO_INTRO_EVENT));

  return {
    timeline: scrollyTimeline,
    scrollToFounder: (name) => scrollToStageProgress(name === 'victor' ? 0.88 : 0.05),
    getCurrentFounder: () => activeFounder,
  };
}
