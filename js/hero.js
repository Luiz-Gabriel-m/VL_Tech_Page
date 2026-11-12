/* ==========================================================================
   SÓCIOS (#socios-scrolly) — Co-Founder Scrollytelling Pin
   Victor Whohlers (V) → Luiz Gabriel (L)

   DESKTOP (≥ 993px de largura, ≥ 620px de altura, sem reduced-motion):
   - A seção inteira é pinada (pin: true, scrub: 1) por 160vh de rolagem.
   - 0.00 → 0.34  Victor ativo, estável
   - 0.34 → 0.48  saída limpa de Victor (texto em stagger + retrato)
   - 0.50         troca do brandmark: "V" apaga, "L" acende em neon #ff2a2a
   - 0.52 → 0.66  entrada limpa de Luiz (zero sobreposição entre os palcos)
   - 0.66 → 1.00  Luiz ativo, estável → libera o fluxo para o rodapé

   MOBILE / TELAS BAIXAS / REDUCED-MOTION:
   - Sem pin: os dois perfis ficam empilhados (layout fluido, sem clipping).
   - O brandmark "VL" acompanha o perfil visível via ScrollTrigger.

   O estado visual do brandmark é 100% controlado por classes (.is-active)
   + transições CSS — nenhum estilo inline disputa com a folha de estilos.
   ========================================================================== */

import { gsap, ScrollTrigger } from './core/gsap.js';
import { playIgnite } from './sound.js';

export const HERO_INTRO_EVENT = 'hero:intro-complete';

/** Mesma condição usada no styles.css para o layout sobreposto (pinado) */
export const FOUNDERS_SCROLLY_QUERY =
  '(min-width: 993px) and (min-height: 620px) and (prefers-reduced-motion: no-preference)';
export const FOUNDERS_STACKED_QUERY =
  '(max-width: 992px), (max-height: 619px), (prefers-reduced-motion: reduce)';

const FOUNDERS = {
  victor: { index: '01', letter: 'V' },
  luiz: { index: '02', letter: 'L' },
};

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Tilt 3D sutil nos retratos (apenas dispositivos com hover real)
 */
function setupPortraitTilt(stage, visual) {
  if (!stage || !visual || prefersReducedMotion()) return;
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const quickX = gsap.quickTo(visual, 'rotationY', { duration: 0.8, ease: 'power2.out' });
  const quickY = gsap.quickTo(visual, 'rotationX', { duration: 0.8, ease: 'power2.out' });

  stage.addEventListener('mousemove', (e) => {
    const rect = stage.getBoundingClientRect();
    quickX(((e.clientX - rect.left) / rect.width - 0.5) * 10);
    quickY(-((e.clientY - rect.top) / rect.height - 0.5) * 10);
  });

  stage.addEventListener('mouseleave', () => {
    quickX(0);
    quickY(0);
  });
}

export function initHero() {
  const section =
    document.querySelector('.founders-showcase-section') ||
    document.getElementById('socios-scrolly') ||
    document.getElementById('founders');
  if (!section) return null;

  const panes = {
    victor: section.querySelector('#stageVictor'),
    luiz: section.querySelector('#stageLuiz'),
  };
  const symbols = {
    victor: section.querySelector('#vlSymbolV'),
    luiz: section.querySelector('#vlSymbolL'),
  };
  const bgLetter = section.querySelector('#bgVectorLetter');
  const counter = section.querySelector('#foundersCounter');
  const progressFill = section.querySelector('#foundersProgressFill');

  if (!panes.victor || !panes.luiz) return null;

  setupPortraitTilt(section.querySelector('#victorPortraitStage'), section.querySelector('#victor-visual'));
  setupPortraitTilt(section.querySelector('#luizPortraitStage'), section.querySelector('#luiz-visual'));

  let active = null;
  let mode = 'stacked';
  let scrollyST = null;

  // ---------------------------------------------------------------------------
  // ESTADO ATIVO (brandmark, painéis, letra de fundo, contador, a11y)
  // ---------------------------------------------------------------------------
  function setActive(key, { silent = false } = {}) {
    if (!FOUNDERS[key] || key === active) return;
    const hadPrevious = active !== null;
    active = key;

    section.dataset.activeFounder = key;

    Object.entries(symbols).forEach(([k, btn]) => {
      if (!btn) return;
      const on = k === key;
      btn.classList.toggle('is-active', on);
      btn.setAttribute('aria-selected', String(on));
      btn.tabIndex = on ? 0 : -1;
    });

    Object.entries(panes).forEach(([k, pane]) => {
      const on = k === key;
      pane.classList.toggle('is-active', on);
      if (mode === 'scrolly') pane.setAttribute('aria-hidden', String(!on));
      else pane.removeAttribute('aria-hidden');
    });

    if (bgLetter) bgLetter.textContent = FOUNDERS[key].letter;
    if (counter) counter.textContent = FOUNDERS[key].index;

    if (hadPrevious && !silent) playIgnite();
    document.dispatchEvent(new CustomEvent('founder:changed', { detail: { founder: key } }));
  }

  const keyFromProgress = (p) => (p < 0.5 ? 'victor' : 'luiz');

  const mm = gsap.matchMedia();

  // ---------------------------------------------------------------------------
  // MODO 1 — SCROLLYTELLING PINADO (DESKTOP)
  // ---------------------------------------------------------------------------
  mm.add(FOUNDERS_SCROLLY_QUERY, () => {
    mode = 'scrolly';
    section.classList.add('is-scrolly');

    const victorText = panes.victor.querySelectorAll('.founder-typography-stack > *');
    const luizText = panes.luiz.querySelectorAll('.founder-typography-stack > *');
    const victorPortrait = panes.victor.querySelector('.founder-portrait-column');
    const luizPortrait = panes.luiz.querySelector('.founder-portrait-column');
    const luizPhoto = panes.luiz.querySelector('.founder-photo');

    // Estado inicial explícito (o CSS já espelha este estado → zero FOUC)
    gsap.set(panes.victor, { autoAlpha: 1 });
    gsap.set(panes.luiz, { autoAlpha: 0 });

    const tl = gsap.timeline({
      defaults: { ease: 'power2.inOut' },
      // Sincronizado com o progresso VISUAL (já suavizado pelo scrub),
      // para que o "V"/"L" acenda exatamente no meio da transição.
      onUpdate() {
        setActive(keyFromProgress(this.progress()));
      },
      scrollTrigger: {
        id: 'founders-pin',
        trigger: section,
        start: 'top top',
        end: () => `+=${Math.round(window.innerHeight * 1.6)}`,
        pin: true,
        pinSpacing: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onRefresh: (self) => setActive(keyFromProgress(self.progress), { silent: true }),
      },
    });

    scrollyST = tl.scrollTrigger;

    // Barra de progresso define a duração total da timeline (0 → 1)
    if (progressFill) {
      tl.fromTo(progressFill, { scaleX: 0 }, { scaleX: 1, ease: 'none', duration: 1 }, 0);
    } else {
      tl.to({}, { duration: 1 }, 0);
    }

    // Transição lateral suave entre os dois sócios:
    // 1. Saída lateral de Victor Whohlers para a esquerda (0.34 → 0.48)
    tl.to(victorText, { x: -45, autoAlpha: 0, duration: 0.11, stagger: 0.008, ease: 'power2.in' }, 0.34);
    if (victorPortrait) {
      tl.to(victorPortrait, { x: -35, scale: 0.95, autoAlpha: 0, duration: 0.13, ease: 'power2.in' }, 0.35);
    }
    tl.set(panes.victor, { autoAlpha: 0 }, 0.48);

    // 2. Intervalo central (0.48 → 0.52): O brandmark "V" apaga e "L" acende em neon red #ff2a2a

    // 3. Entrada lateral de Luiz Gabriel vindo da direita (0.52 → 0.66)
    tl.set(panes.luiz, { autoAlpha: 1 }, 0.52);
    tl.fromTo(
      luizText,
      { x: 45, autoAlpha: 0 },
      { x: 0, autoAlpha: 1, duration: 0.11, stagger: 0.008, ease: 'power2.out', immediateRender: false },
      0.52
    );
    if (luizPortrait) {
      tl.fromTo(
        luizPortrait,
        { x: 35, scale: 0.95, autoAlpha: 0 },
        { x: 0, scale: 1, autoAlpha: 1, duration: 0.13, ease: 'power2.out', immediateRender: false },
        0.52
      );
    }
    if (luizPhoto) {
      tl.fromTo(luizPhoto, { scale: 1.06 }, { scale: 1, duration: 0.22, ease: 'power2.out', immediateRender: false }, 0.52);
    }

    return () => {
      mode = 'stacked';
      scrollyST = null;
      section.classList.remove('is-scrolly');
    };
  });

  // ---------------------------------------------------------------------------
  // MODO 2 — PERFIS EMPILHADOS (MOBILE / TELAS BAIXAS / REDUCED-MOTION)
  // ---------------------------------------------------------------------------
  mm.add(FOUNDERS_STACKED_QUERY, () => {
    mode = 'stacked';
    Object.values(panes).forEach((pane) => pane.removeAttribute('aria-hidden'));

    Object.entries(panes).forEach(([key, pane]) => {
      ScrollTrigger.create({
        trigger: pane,
        start: 'top 60%',
        end: 'bottom 60%',
        onToggle: (self) => self.isActive && setActive(key),
      });
    });
  });

  // ---------------------------------------------------------------------------
  // NAVEGAÇÃO PELO BRANDMARK (clique + setas do teclado)
  // ---------------------------------------------------------------------------
  const goTo = (key) => {
    const smooth = prefersReducedMotion() ? 'auto' : 'smooth';

    if (mode === 'scrolly' && scrollyST) {
      const { start, end } = scrollyST;
      const top = key === 'victor' ? start + 2 : start + (end - start) * 0.8;
      window.scrollTo({ top, behavior: smooth });
      return;
    }

    panes[key]?.scrollIntoView({ behavior: smooth, block: 'start' });
  };

  Object.entries(symbols).forEach(([key, btn]) => {
    if (!btn) return;
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      goTo(key);
    });
    btn.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      e.preventDefault();
      const next = key === 'victor' ? 'luiz' : 'victor';
      symbols[next]?.focus();
      goTo(next);
    });
  });

  setActive('victor', { silent: true });

  return {
    getCurrentFounder: () => active,
    goTo,
    get scrollTrigger() {
      return scrollyST;
    },
  };
}
