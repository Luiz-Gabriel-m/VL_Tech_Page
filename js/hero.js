/* ==========================================================================
   HERO / SÓCIOS — Scroll-Driven Co-Founder Scrollytelling Pin & Morphing
   - Pinned GSAP ScrollTrigger: locks in place as the user scrolls into the section.
   - Automatic morph/transition: Vitor Whohlers (0.0 -> 0.4) -> Luiz Gabriel (0.6 -> 1.0).
   - "VL" Brandmark Synchronization:
     - State 1 (Vitor): "V" pulses in neon red (#FF1E26 / #ff2a2a), "L" remains white.
     - State 2 (Luiz): "L" pulses in neon red (#FF1E26 / #ff2a2a), "V" remains white.
   - Direct click triggers: Clicking "V" or "L" smoothly scrolls to that founder.
   - Zero layout overlaps: Grid overlay and pinSpacing guarantee pristine document flow.
   ========================================================================== */

import { gsap, ScrollTrigger } from './core/gsap.js';
import { playIgnite } from './sound.js';

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

  // Palcos dos Sócios (Sobrepostos em CSS Grid 1 / 1)
  const stageVictor = document.getElementById('stageVictor');
  const stageLuiz = document.getElementById('stageLuiz');

  // Letras Monumentais "V" e "L" do Brandmark Interativo
  const vlSymbolV = document.getElementById('vlSymbolV');
  const vlSymbolL = document.getElementById('vlSymbolL');
  const vlCharV = document.getElementById('vlCharV') || (vlSymbolV ? vlSymbolV.querySelector('.vl-char') : null);
  const vlCharL = document.getElementById('vlCharL') || (vlSymbolL ? vlSymbolL.querySelector('.vl-char') : null);

  // Letra vetorial de fundo
  const bgVectorLetter = document.getElementById('bgVectorLetter');

  // Retratos
  const victorPortraitStage = document.getElementById('victorPortraitStage');
  const victorVisual = document.getElementById('victor-visual');
  const luizPortraitStage = document.getElementById('luizPortraitStage');
  const luizVisual = document.getElementById('luiz-visual');

  // Configura tilt 3D nos retratos
  setupPortraitTilt(victorPortraitStage, victorVisual);
  setupPortraitTilt(luizPortraitStage, luizVisual);

  // Cores Neon VL Tech (#ff2a2a)
  const RED_COLOR = '#ff2a2a';
  const RED_GLOW = '0 0 15px rgba(255, 42, 42, 0.95), 0 0 35px rgba(255, 42, 42, 0.8), 0 0 75px rgba(255, 42, 42, 0.5)';
  const WHITE_SUBDUED = 'rgba(255, 255, 255, 0.35)';

  const metaFounderName = document.getElementById('metaFounderName');
  const metaFounderRole = document.getElementById('metaFounderRole');

  let activeFounder = 'victor';

  // ---------------------------------------------------------------------------
  // MODO COM REDUÇÃO DE MOVIMENTO (PREFERS-REDUCED-MOTION)
  // ---------------------------------------------------------------------------
  if (prefersReducedMotion()) {
    const setFounderReduced = (key) => {
      activeFounder = key;
      const isVictor = key === 'victor';

      if (stageVictor) {
        stageVictor.style.opacity = isVictor ? '1' : '0';
        stageVictor.style.pointerEvents = isVictor ? 'auto' : 'none';
      }
      if (stageLuiz) {
        stageLuiz.style.opacity = !isVictor ? '1' : '0';
        stageLuiz.style.pointerEvents = !isVictor ? 'auto' : 'none';
      }
      if (vlCharV) {
        vlCharV.style.color = isVictor ? RED_COLOR : '#FFFFFF';
        vlCharV.style.opacity = isVictor ? '1' : '0.35';
      }
      if (vlCharL) {
        vlCharL.style.color = !isVictor ? RED_COLOR : '#FFFFFF';
        vlCharL.style.opacity = !isVictor ? '1' : '0.35';
      }
      if (bgVectorLetter) bgVectorLetter.textContent = isVictor ? 'V' : 'L';
      if (metaFounderName) {
        metaFounderName.textContent = isVictor ? 'Victor Whohlers · Co-founder' : 'Luiz Gabriel · Co-founder';
      }
      if (metaFounderRole) {
        metaFounderRole.textContent = isVictor ? 'Especialista em Back-End & Cloud' : 'Especialista em Front-End & 3D';
      }
    };

    setFounderReduced('victor');
    if (vlSymbolV) vlSymbolV.addEventListener('click', () => setFounderReduced('victor'));
    if (vlSymbolL) vlSymbolL.addEventListener('click', () => setFounderReduced('luiz'));

    return {
      switchFounder: setFounderReduced,
      getCurrentFounder: () => activeFounder,
    };
  }

  // ---------------------------------------------------------------------------
  // ESTADO INICIAL DOS PALCOS
  // ---------------------------------------------------------------------------
  gsap.set(stageVictor, { autoAlpha: 1, y: 0, scale: 1, pointerEvents: 'auto' });
  gsap.set(stageLuiz, { autoAlpha: 0, y: 25, scale: 0.98, pointerEvents: 'none' });

  if (vlCharV) {
    gsap.set(vlCharV, { color: RED_COLOR, opacity: 1, scale: 1.08, textShadow: RED_GLOW });
  }
  if (vlCharL) {
    gsap.set(vlCharL, { color: '#FFFFFF', opacity: 0.35, scale: 1, textShadow: 'none' });
  }
  if (bgVectorLetter) {
    bgVectorLetter.textContent = 'V';
  }

  // ---------------------------------------------------------------------------
  // TIMELINE DE SCROLLYTELLING PINNED (TRAVA NA TELA E TRANSIÇÃO FLUIDA)
  // ---------------------------------------------------------------------------
  const scrollyTl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: '+=1400',
      pin: true,
      pinSpacing: true, // Garante espaçamento automático sem sobreposição de seções
      scrub: 0.8,       // Suavização ultra-responsiva de 60 FPS
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const p = self.progress;
        const newFounder = p < 0.5 ? 'victor' : 'luiz';

        if (stageVictor) {
          stageVictor.style.pointerEvents = newFounder === 'victor' ? 'auto' : 'none';
          stageVictor.classList.toggle('is-active', newFounder === 'victor');
        }
        if (stageLuiz) {
          stageLuiz.style.pointerEvents = newFounder === 'luiz' ? 'auto' : 'none';
          stageLuiz.classList.toggle('is-active', newFounder === 'luiz');
        }

        if (metaFounderName) {
          metaFounderName.textContent = newFounder === 'victor' ? 'Victor Whohlers · Co-founder' : 'Luiz Gabriel · Co-founder';
        }
        if (metaFounderRole) {
          metaFounderRole.textContent = newFounder === 'victor' ? 'Especialista em Back-End & Cloud' : 'Especialista em Front-End & 3D';
        }

        if (newFounder !== activeFounder) {
          activeFounder = newFounder;
          playIgnite();

          // Sincroniza classes acessíveis nos botões de letra
          if (vlSymbolV) {
            vlSymbolV.classList.toggle('is-active', newFounder === 'victor');
            vlSymbolV.setAttribute('aria-selected', newFounder === 'victor' ? 'true' : 'false');
          }
          if (vlSymbolL) {
            vlSymbolL.classList.toggle('is-active', newFounder === 'luiz');
            vlSymbolL.setAttribute('aria-selected', newFounder === 'luiz' ? 'true' : 'false');
          }

          if (bgVectorLetter) {
            bgVectorLetter.textContent = newFounder === 'victor' ? 'V' : 'L';
          }

          document.dispatchEvent(new CustomEvent('founder:changed', { detail: { founder: activeFounder } }));
        }
      },
    },
  });

  // ---------------------------------------------------------------------------
  // ETAPA 1 (0.00 -> 0.32): VITOR WHOHLERS ATIVO, ESTÁVEL E NÍTIDO
  // ---------------------------------------------------------------------------
  scrollyTl.to({}, { duration: 0.32 });

  // ---------------------------------------------------------------------------
  // ETAPA 2 (0.32 -> 0.46): SAÍDA LIMPA DE VITOR WHOHLERS
  // Victor desaparece 100% ANTES de Luiz começar a entrar (Zero Overlap!)
  // ---------------------------------------------------------------------------
  scrollyTl.to(
    stageVictor,
    {
      autoAlpha: 0,
      y: -25,
      scale: 0.98,
      duration: 0.14,
      ease: 'power2.in',
    },
    0.32
  );

  // ---------------------------------------------------------------------------
  // ETAPA 3 (0.44 -> 0.54): TRANSIÇÃO DO BRANDMARK "VL" & AMBIENTE
  // Intervalo central onde ambos os palcos de texto estão ocultos.
  // ---------------------------------------------------------------------------
  if (vlCharV && vlCharL) {
    // "V" transita de neon red para branco neutro
    scrollyTl.to(
      vlCharV,
      {
        color: '#FFFFFF',
        opacity: 0.35,
        scale: 1,
        textShadow: 'none',
        duration: 0.1,
        ease: 'power2.inOut',
      },
      0.44
    );

    // "L" acende em neon red com brilho pulsante
    scrollyTl.to(
      vlCharL,
      {
        color: RED_COLOR,
        opacity: 1,
        scale: 1.08,
        textShadow: RED_GLOW,
        duration: 0.1,
        ease: 'power2.inOut',
      },
      0.44
    );
  }

  const tagV = vlSymbolV ? vlSymbolV.querySelector('.vl-letter-tag') : null;
  const tagL = vlSymbolL ? vlSymbolL.querySelector('.vl-letter-tag') : null;
  if (tagV && tagL) {
    scrollyTl.to(tagV, { color: 'rgba(248, 248, 252, 0.4)', duration: 0.1 }, 0.44);
    scrollyTl.to(tagL, { color: '#FFFFFF', duration: 0.1 }, 0.44);
  }

  if (bgVectorLetter) {
    scrollyTl.to(bgVectorLetter, { opacity: 0, scale: 0.88, duration: 0.06, ease: 'power2.in' }, 0.44);
    scrollyTl.to(bgVectorLetter, { opacity: 0.025, scale: 1, duration: 0.06, ease: 'power2.out' }, 0.50);
  }

  // ---------------------------------------------------------------------------
  // ETAPA 4 (0.54 -> 0.68): ENTRADA LIMPA DE LUIZ GABRIEL
  // Inicia apenas em 0.54, após Victor estar 100% oculto!
  // ---------------------------------------------------------------------------
  scrollyTl.fromTo(
    stageLuiz,
    {
      autoAlpha: 0,
      y: 25,
      scale: 0.98,
    },
    {
      autoAlpha: 1,
      y: 0,
      scale: 1,
      duration: 0.14,
      ease: 'power2.out',
    },
    0.54
  );

  // ---------------------------------------------------------------------------
  // ETAPA 5 (0.68 -> 1.00): LUIZ GABRIEL ATIVO, ESTÁVEL E NÍTIDO
  // ---------------------------------------------------------------------------
  scrollyTl.to({}, { duration: 0.32 });

  // ---------------------------------------------------------------------------
  // INTERAÇÕES POR CLIQUE DIRETO NAS LETRAS "V" E "L"
  // ---------------------------------------------------------------------------
  if (vlSymbolV) {
    vlSymbolV.addEventListener('click', (e) => {
      e.preventDefault();
      if (!scrollyTl.scrollTrigger) return;
      const startY = scrollyTl.scrollTrigger.start;
      window.scrollTo({
        top: startY + 10,
        behavior: 'smooth',
      });
    });
  }

  if (vlSymbolL) {
    vlSymbolL.addEventListener('click', (e) => {
      e.preventDefault();
      if (!scrollyTl.scrollTrigger) return;
      const startY = scrollyTl.scrollTrigger.start;
      const endY = scrollyTl.scrollTrigger.end;
      const targetY = startY + (endY - startY) * 0.85;
      window.scrollTo({
        top: targetY,
        behavior: 'smooth',
      });
    });
  }

  return {
    timeline: scrollyTl,
    getCurrentFounder: () => activeFounder,
  };
}
