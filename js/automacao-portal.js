/* ==========================================================================
   AUTOMAÇÃO PORTAL — Glyph Portal Otimizado 120fps (Zoom por Dentro da Letra)
   Baseado em Glyph Portal © 2026 Christian Katzmann (MIT) — ktzm.dk
   Otimizações VL Tech:
   - Palco único `position: sticky` (`100svh`): a palavra "AUTOMAÇÃO" dá zoom
     por dentro da letra escolhida até preencher 100% da tela, revelando o
     Robô 3D já perfeitamente centralizado no MESMO viewport (zero corte!)
   - ZERO disputa de GPU:
       1. Durante o zoom da letra (`p < 0.48`), o WebGL do Robô 3D fica pausado
          (100% GPU livre para o zoom do SVG `<clipPath>`!)
       2. Assim que a letra preenche 100% da tela (`t >= 0.99`), o `clipPath`
          desliga (`none`), a camada do portal recebe `pointer-events: none` e
          o Robô 3D acorda instantaneamente (`vl:automacao-card-state: true`)
   - Scrub suavizado via GSAP ScrollTrigger + escolha interativa da letra
     (hover / clique / teclado / select touch)
   ========================================================================== */

import { gsap, ScrollTrigger } from './core/gsap.js';
import { playClick } from './sound.js';

const DEFAULT_FONT = '"Anton", Impact, "Arial Black", sans-serif';

const clamp = (n, a = 0, b = 1) => Math.min(b, Math.max(a, n));
const smooth = (a, b, n) => {
  const t = clamp((n - a) / (b - a || 1));
  return t * t * (3 - 2 * t);
};

/**
 * Encontra o maior quadrado interno opaco da letra em O(W*H) para centralizar
 * o zoom exatamente dentro do preenchimento do glifo (A, U, T, O, M, Ç, Ã).
 */
function interior(context, char, font) {
  const canvas = context.canvas;
  context.font = font;
  const m = context.measureText(char);
  const pad = 8;
  const left = Math.ceil(m.actualBoundingBoxLeft);
  const ascent = Math.ceil(m.actualBoundingBoxAscent);
  canvas.width = Math.max(1, Math.ceil(m.actualBoundingBoxLeft + m.actualBoundingBoxRight) + pad * 2);
  canvas.height = Math.max(1, Math.ceil(m.actualBoundingBoxAscent + m.actualBoundingBoxDescent) + pad * 2);

  context.font = font;
  context.fontKerning = 'none';
  context.fillStyle = '#000';
  context.fillText(char, pad + left, pad + ascent);

  const { width, height } = canvas;
  const pixels = context.getImageData(0, 0, width, height).data;
  const rows = new Uint16Array(width + 1);
  let size = 0;
  let bx = 0;
  let by = 0;

  for (let y = 0; y < height; y++) {
    let diagonal = 0;
    for (let x = 0; x < width; x++) {
      const above = rows[x + 1];
      rows[x + 1] =
        pixels[(y * width + x) * 4 + 3] > 245
          ? Math.min(above, rows[x], diagonal) + 1
          : 0;
      diagonal = above;
      if (rows[x + 1] > size) {
        size = rows[x + 1];
        bx = x;
        by = y;
      }
    }
  }

  if (size < 3) return null;
  return {
    x: (bx + 1 - size / 2 - pad - left) / 3,
    y: (by + 1 - size / 2 - pad - ascent) / 3,
    radius: (size / 2 - 1) / 3,
  };
}

export function initAutomacaoPortal() {
  const section = document.getElementById('automacao');
  if (!section) return null;

  const pin = section.querySelector('[data-gp-pin]');
  const field = section.querySelector('[data-gp-field]');
  const art = section.querySelector('[data-gp-art]');
  const clip = section.querySelector('#gp-automacao-clip');
  const glyph = section.querySelector('[data-gp-glyph]');
  const marks = section.querySelector('[data-gp-marks]');
  const choices = section.querySelector('[data-gp-choices]');
  const picker = section.querySelector('[data-gp-select]');
  const enterLink = section.querySelector('[data-gp-enter]');
  const robotLayer = section.querySelector('#gpRobotLayer');

  if (!pin || !field || !art || !clip || !glyph || !choices || !robotLayer) {
    return null;
  }

  const text = (section.dataset.gpWord || 'AUTOMAÇÃO').trim().normalize('NFC');
  const focusChar = (section.dataset.gpFocusChar || '').trim().normalize('NFC');
  const interactive = section.dataset.gpInteractive !== 'false';
  const fontFamily = section.dataset.gpFont || DEFAULT_FONT;
  const fontWeight = section.dataset.gpWeight || '400';

  const notifyRobot = (active) => {
    section.dataset.robotAwake = active ? 'true' : 'false';
    window.dispatchEvent(new CustomEvent('vl:automacao-card-state', { detail: { active } }));
  };

  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');

  if (motion.matches || !gsap || !ScrollTrigger) {
    section.dataset.gpMotion = 'off';
    section.dataset.gpEntered = 'true';
    field.style.clipPath = 'none';
    robotLayer.style.opacity = '1';
    robotLayer.style.transform = 'none';
    robotLayer.style.pointerEvents = 'auto';
    notifyRobot(true);
    return {
      scrollToCard() {
        section.scrollIntoView({ behavior: 'auto', block: 'start' });
      },
      destroy() {},
    };
  }

  section.style.setProperty('--gp-characters', String(Array.from(text).length));

  // Popula botões invisíveis sobre cada letra para escolher por onde dar zoom
  const chars = [];
  let charOffset = 0;
  for (const ch of Array.from(text)) {
    chars.push({ char: ch, index: charOffset });
    charOffset += ch.length;
  }

  choices.innerHTML = '';
  const buttons = chars.map(({ char, index }, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.role = 'radio';
    btn.setAttribute('aria-checked', 'false');
    btn.tabIndex = -1;
    btn.dataset.gpLetter = String(index);
    btn.setAttribute('aria-label', `${char}, letra ${i + 1} de ${chars.length}`);
    choices.appendChild(btn);
    return btn;
  });

  if (picker) {
    picker.innerHTML = '<option value="" disabled selected>Escolher letra</option>';
    chars.forEach(({ char, index }, i) => {
      const opt = document.createElement('option');
      opt.value = String(index);
      opt.textContent = `${i + 1} · ${char}`;
      picker.appendChild(opt);
    });
  }

  glyph.textContent = text;
  glyph.style.fontFamily = fontFamily;
  glyph.style.fontWeight = fontWeight;

  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d', { willReadFrequently: true });

  let disposed = false;
  let ready = false;
  let W = 1;
  let H = 1;
  let startScale = 1;
  let endScale = 1;
  let center = { x: 0, y: 0 };
  let bounds = { x: 0, y: 0, width: 1, height: 1 };
  let target = null;
  let candidates = [];
  let letters = [];
  let choosing = false;
  let fontDirty = true;
  let lastClipDropped = null;
  let robotAwake = false;
  let entered = false;

  const state = { p: 0 };

  function readInk() {
    if (!context) return false;
    const computed = getComputedStyle(glyph);
    const weightStr = computed.fontWeight || fontWeight;
    const familyStr = computed.fontFamily || fontFamily;
    const scanFont = `${weightStr} 300px ${familyStr}`;
    const baseFont = `${weightStr} 100px ${familyStr}`;

    context.font = baseFont;
    context.fontKerning = 'none';
    const metrics = context.measureText(text);
    const advances = Array.from({ length: text.length }, (_, i) =>
      context.measureText(text.slice(0, i)).width
    );

    bounds = {
      x: -metrics.actualBoundingBoxLeft,
      y: -metrics.actualBoundingBoxAscent,
      width: metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight,
      height: metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent,
    };

    if (!bounds.width || !bounds.height) return false;
    center = { x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height / 2 };

    const requested = focusChar ? text.indexOf(focusChar) : -1;
    let offset = 0;
    candidates = [];
    letters = [];

    for (const char of Array.from(text)) {
      context.font = baseFont;
      const m = context.measureText(char);
      letters.push({
        index: offset,
        x: advances[offset] - m.actualBoundingBoxLeft,
        y: -m.actualBoundingBoxAscent,
        width: m.actualBoundingBoxLeft + m.actualBoundingBoxRight,
        height: m.actualBoundingBoxAscent + m.actualBoundingBoxDescent,
      });

      const found = interior(context, char, scanFont);
      if (found) {
        candidates.push({ ...found, x: found.x + advances[offset], index: offset });
      }
      offset += char.length;
    }

    const prevIndex = target?.index;
    target =
      candidates.find((c) => c.index === prevIndex) ??
      candidates.find((c) => c.index === requested) ??
      [...candidates].sort(
        (a, b) => b.radius - a.radius || Math.abs(a.x - center.x) - Math.abs(b.x - center.x)
      )[0] ??
      null;

    return Boolean(target);
  }

  function select(next) {
    target = next;
    endScale = target
      ? Math.max(startScale, Math.hypot(W, H) / (target.radius * 1.28))
      : startScale;

    section.dataset.gpFocus = target ? Array.from(text.slice(target.index))[0] : '';
    section.dataset.gpFocusIndex = String(target?.index ?? -1);

    for (const btn of buttons) {
      const idx = Number(btn.dataset.gpLetter);
      const selected = idx === target?.index;
      btn.disabled = !candidates.some((c) => c.index === idx);
      btn.setAttribute('aria-checked', String(selected));
      btn.tabIndex = selected ? 0 : -1;
    }

    if (picker) {
      if (picker.value !== '') picker.value = String(target?.index ?? -1);
      for (const opt of Array.from(picker.options)) {
        opt.disabled =
          opt.value === '' || !candidates.some((c) => c.index === Number(opt.value));
      }
    }

    if (marks) {
      const u = 1 / (startScale || 1);
      const y = bounds.y + bounds.height + 24 * u;
      const x = bounds.x;
      const right = x + bounds.width;
      const cross = target
        ? `M${target.x - 9 * u} ${target.y}h${18 * u}M${target.x} ${target.y - 9 * u}v${18 * u}`
        : '';
      const annotationPath = marks.querySelector('path');
      if (annotationPath) {
        annotationPath.setAttribute(
          'd',
          `M${x} ${y}H${right}M${x} ${y - 5 * u}v${10 * u}M${right} ${y - 5 * u}v${10 * u}${cross}`
        );
        annotationPath.setAttribute('stroke-width', String(u));
      }
    }
  }

  function paint() {
    if (!ready || !target) return;
    const p = state.p;

    // 0.00 -> 0.06: hold inicial limpo em "AUTOMAÇÃO"
    // 0.06 -> 0.52: zoom contínuo por dentro da letra até preencher 100% da tela!
    const t = clamp((p - 0.06) / 0.46);
    const shouldDropClip = t >= 0.99;

    // Só muta SVG enquanto o clipPath está ativo (0% custo SVG após preencher a tela!)
    if (!shouldDropClip) {
      const eased = t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2;
      const scale = Math.exp(Math.log(startScale) + Math.log(endScale / startScale) * eased);
      const blend =
        endScale === startScale
          ? 0
          : (1 / scale - 1 / startScale) / (1 / endScale - 1 / startScale);

      const cx = center.x + (target.x - center.x) * blend;
      const cy = center.y + (target.y - center.y) * blend;
      const roll = -3.5 * smooth(0.06, 0.5, t) * (1 - smooth(0.62, 0.94, t));

      const radians = (roll * Math.PI) / 180;
      const anchorY = H * 0.5;
      const dx = W / 2 / scale;
      const dy = anchorY / scale;

      clip.setAttribute('transform', `scale(${scale.toFixed(4)}) rotate(${roll.toFixed(3)})`);
      glyph.setAttribute(
        'transform',
        `translate(${(Math.cos(radians) * dx + Math.sin(radians) * dy - cx).toFixed(3)} ${(
          -Math.sin(radians) * dx +
          Math.cos(radians) * dy -
          cy
        ).toFixed(3)})`
      );

      if (marks) {
        marks.setAttribute(
          'transform',
          `translate(${W / 2} ${anchorY}) scale(${scale.toFixed(4)}) rotate(${roll.toFixed(3)}) translate(${-cx} ${-cy})`
        );
        marks.style.opacity = String((1 - smooth(0.05, 0.18, p)).toFixed(3));
      }
    }

    if (shouldDropClip !== lastClipDropped) {
      lastClipDropped = shouldDropClip;
      field.style.clipPath = shouldDropClip ? 'none' : 'url(#gp-automacao-clip)';
      art.style.visibility = shouldDropClip ? 'hidden' : 'visible';
    }

    choosing = interactive && p < 0.08;
    choices.inert = !choosing;
    section.dataset.gpChoosing = String(choosing);

    // Véu branco inicial dissolve suavemente durante o mergulho na letra
    const inkVeil = 1 - smooth(0.08, 0.42, p);
    const captionAlpha = 1 - smooth(0.05, 0.16, p);
    const reveal = smooth(0.48, 0.62, p);
    const robotScale = 0.95 + 0.05 * reveal;

    section.style.setProperty('--gp-ink-veil', inkVeil.toFixed(3));
    section.style.setProperty('--gp-caption', captionAlpha.toFixed(3));
    section.style.setProperty('--gp-caption-hit', p < 0.14 ? 'auto' : 'none');

    // Palco do Robô 3D já está no MESMO viewport sticky (zero salto/corte!)
    robotLayer.style.opacity = reveal.toFixed(3);
    robotLayer.style.transform = `scale(${robotScale.toFixed(4)})`;

    // Libera cliques/arrasto no Robô 3D e nas 4 abas imediatamente ao revelar!
    const nowEntered = p >= 0.5;
    if (nowEntered !== entered) {
      entered = nowEntered;
      section.dataset.gpEntered = nowEntered ? 'true' : 'false';
      robotLayer.style.pointerEvents = nowEntered ? 'auto' : 'none';
      robotLayer.style.visibility = nowEntered ? 'visible' : 'hidden';
    } else if (reveal > 0.01 && robotLayer.style.visibility !== 'visible') {
      robotLayer.style.visibility = 'visible';
    }

    // Handoff GPU: acorda o WebGL do Robô 3D só depois que o zoom da letra terminou!
    const shouldWake = p >= 0.46;
    if (shouldWake !== robotAwake) {
      robotAwake = shouldWake;
      notifyRobot(shouldWake);
    }
  }

  function layout() {
    if (!section.clientWidth) return;
    W = pin.clientWidth || window.innerWidth;
    H = pin.clientHeight || window.innerHeight;
    art.setAttribute('viewBox', `0 0 ${W} ${H}`);

    if (fontDirty) {
      ready = readInk();
      fontDirty = false;
    }
    if (!ready) return;

    const maxW = Math.min(W * 0.86, 1220);
    const maxH = H * 0.36;
    startScale = Math.min(maxW / bounds.width, maxH / bounds.height);

    select(target);

    for (const btn of buttons) {
      const letter = letters.find((item) => item.index === Number(btn.dataset.gpLetter));
      if (!letter) continue;
      Object.assign(btn.style, {
        left: `${W / 2 + (letter.x - center.x) * startScale}px`,
        top: `${
          H * 0.5 +
          (letter.y - center.y) * startScale -
          Math.max(0, 44 - letter.height * startScale) / 2
        }px`,
        width: `${Math.max(1, letter.width * startScale)}px`,
        height: `${Math.max(44, letter.height * startScale)}px`,
      });
    }

    section.dataset.gpReady = 'true';
    section.dataset.gpMotion = 'on';
    lastClipDropped = null;
    paint();
  }

  // GSAP ScrollTrigger scrub suave (elimina trancos de scroll discreto!)
  const scrollTween = gsap.to(state, {
    p: 1,
    ease: 'none',
    onUpdate: paint,
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.35,
      invalidateOnRefresh: true,
    },
  });

  const onChoose = (event) => {
    if (!choosing || state.p >= 0.08) return;
    const btn = event.target.closest('[data-gp-letter]');
    if (!btn) return;
    const next = candidates.find((c) => c.index === Number(btn.dataset.gpLetter));
    if (!next || next === target) return;
    select(next);
    paint();
    if (event.type === 'click') {
      try { playClick(); } catch (_) {}
    }
  };

  const onKeydown = (event) => {
    if (
      !choosing ||
      !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)
    ) {
      return;
    }
    event.preventDefault();
    const current = candidates.indexOf(target);
    const index =
      event.key === 'Home'
        ? 0
        : event.key === 'End'
          ? candidates.length - 1
          : (current + (event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? -1 : 1) + candidates.length) %
            candidates.length;
    buttons
      .find((b) => Number(b.dataset.gpLetter) === candidates[index].index)
      ?.focus({ preventScroll: true });
  };

  const onPick = () => {
    if (!choosing || state.p >= 0.08 || !picker) return;
    const next = candidates.find((c) => c.index === Number(picker.value));
    if (next) {
      select(next);
      paint();
    }
  };

  // Vai direto para o meio do hold com o Robô 3D 100% aberto e interativo!
  const scrollToCard = () => {
    const st = scrollTween.scrollTrigger;
    const targetY = st
      ? st.start + (st.end - st.start) * 0.72
      : section.offsetTop + window.innerHeight * 1.1;
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

  choices.addEventListener('pointerover', onChoose);
  choices.addEventListener('click', onChoose);
  choices.addEventListener('focusin', onChoose);
  choices.addEventListener('keydown', onKeydown);
  picker?.addEventListener('change', onPick);
  enterLink?.addEventListener('click', onEnterClick);

  let resizeTimer = null;
  const onResize = () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(layout, 120);
  };
  window.addEventListener('resize', onResize, { passive: true });

  // Medição inicial + re-medição exata assim que a fonte Anton carregar
  robotLayer.style.pointerEvents = 'none';
  robotLayer.style.visibility = 'hidden';
  layout();
  document.fonts?.ready.then(() => {
    if (disposed) return;
    fontDirty = true;
    layout();
  });

  return {
    scrollToCard,
    destroy() {
      disposed = true;
      clearTimeout(resizeTimer);
      scrollTween.scrollTrigger?.kill();
      scrollTween.kill();
      window.removeEventListener('resize', onResize);
      choices.removeEventListener('pointerover', onChoose);
      choices.removeEventListener('click', onChoose);
      choices.removeEventListener('focusin', onChoose);
      choices.removeEventListener('keydown', onKeydown);
      picker?.removeEventListener('change', onPick);
      enterLink?.removeEventListener('click', onEnterClick);
    },
  };
}
