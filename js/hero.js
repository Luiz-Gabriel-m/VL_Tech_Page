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

  // Cores Neon VL Tech
  const RED_COLOR = '#FF1E26';
  const RED_GLOW = '0 0 15px rgba(255, 30, 38, 0.95), 0 0 35px rgba(255, 30, 38, 0.8), 0 0 75px rgba(255, 30, 38, 0.5)';
  const WHITE_SUBDUED = 'rgba(255, 255, 255, 0.35)';

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
  gsap.set(stageVictor, { opacity: 1, y: 0, scale: 1, pointerEvents: 'auto', visibility: 'visible' });
  gsap.set(stageLuiz, { opacity: 0, y: 25, scale: 0.98, pointerEvents: 'none', visibility: 'hidden' });

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
      end: '+=1350',
      pin: true,
      pinSpacing: true, // Garante espaçamento automático sem sobreposição de seções
      scrub: 0.8,       // Suavização fluida de 60 FPS
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const p = self.progress;
        const newFounder = p < 0.5 ? 'victor' : 'luiz';

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

          document.dispatchEvent(new CustomEvent('founder:changed', { detail: { founder: activeFounder } }));
        }
      },
    },
  });

  // ---------------------------------------------------------------------------
  // ETAPA 1 (0.0 -> 0.35): VITOR WHOHLERS ATIVO E LENDO
  // ---------------------------------------------------------------------------
  // Pequena respiração inicial para leitura de Victor Whohlers
  scrollyTl.to({}, { duration: 0.35 });

  // ---------------------------------------------------------------------------
  // ETAPA 2 (0.35 -> 0.65): MORPHING FLUIDO DE VITOR PARA LUIZ GABRIEL
  // ---------------------------------------------------------------------------
  // 1. Saída suave de Victor Whohlers
  scrollyTl.to(
    stageVictor,
    {
      opacity: 0,
      y: -22,
      scale: 0.98,
      duration: 0.3,
      ease: 'power2.inOut',
    },
    0.35
  );

  // 2. Transição das letras monumentais do Brandmark "VL"
  if (vlCharV && vlCharL) {
    // "V" transita de neon red para branco neutro
    scrollyTl.to(
      vlCharV,
      {
        color: '#FFFFFF',
        opacity: 0.35,
        scale: 1,
        textShadow: 'none',
        duration: 0.3,
        ease: 'power2.inOut',
      },
      0.35
    );

    // "L" transita de branco neutro para neon red pulsante
    scrollyTl.to(
      vlCharL,
      {
        color: RED_COLOR,
        opacity: 1,
        scale: 1.08,
        textShadow: RED_GLOW,
        duration: 0.3,
        ease: 'power2.inOut',
      },
      0.35
    );
  }

  // 3. Transição das tags de texto embaixo das letras ("VITOR" e "LUIZ")
  const tagV = vlSymbolV ? vlSymbolV.querySelector('.vl-letter-tag') : null;
  const tagL = vlSymbolL ? vlSymbolL.querySelector('.vl-letter-tag') : null;

  if (tagV && tagL) {
    scrollyTl.to(tagV, { color: 'rgba(248, 248, 252, 0.4)', duration: 0.25 }, 0.35);
    scrollyTl.to(tagL, { color: '#FFFFFF', duration: 0.25 }, 0.4);
  }

  // 4. Morfismo da letra vetorial de fundo gigante ('V' -> 'L')
  if (bgVectorLetter) {
    scrollyTl.to(bgVectorLetter, { opacity: 0, scale: 0.88, duration: 0.15, ease: 'power2.in' }, 0.35);
    scrollyTl.call(() => {
      if (bgVectorLetter) bgVectorLetter.textContent = 'L';
    }, null, 0.5);
    scrollyTl.to(bgVectorLetter, { opacity: 0.025, scale: 1, duration: 0.15, ease: 'power2.out' }, 0.5);
  }

  // 5. Troca de interatividade nos ponteiros no ponto médio
  scrollyTl.call(() => {
    if (stageVictor) {
      stageVictor.style.pointerEvents = 'none';
      stageVictor.style.visibility = 'hidden';
    }
    if (stageLuiz) {
      stageLuiz.style.pointerEvents = 'auto';
      stageLuiz.style.visibility = 'visible';
    }
  }, null, 0.5);

  // 6. Entrada suave de Luiz Gabriel
  scrollyTl.to(
    stageLuiz,
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.3,
      ease: 'power2.inOut',
    },
    0.35
  );

  // ---------------------------------------------------------------------------
  // ETAPA 3 (0.65 -> 1.00): LUIZ GABRIEL ATIVO E LENDO
  // ---------------------------------------------------------------------------
  // Respiração para o usuário explorar o perfil de Luiz e suas ações
  scrollyTl.to({}, { duration: 0.35 });

  // ---------------------------------------------------------------------------
  // INTERAÇÕES POR CLIQUE DIRETO NAS LETRAS "V" E "L"
  // ---------------------------------------------------------------------------
  if (vlSymbolV) {
    vlSymbolV.addEventListener('click', (e) => {
      e.preventDefault();
      if (!scrollyTl.scrollTrigger) return;
      const startY = scrollyTl.scrollTrigger.start;
      window.scrollTo({
        top: startY + 20,
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
