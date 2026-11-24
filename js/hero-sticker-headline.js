/* ==========================================================================
   HERO STICKER SWAP HEADLINE — Adaptado da 21st.dev (StickerSwapHeadline)
   - Palavras da VL Tech: CRIAMOS [ SOFTWARE | PROJETOS | PRODUTOS | AUTOMAÇÃO ]
   - Em cada troca: sticker sai (scale 0) -> palavra rola pra cima ->
     letras abrem o vão do "O" -> novo sticker redondo die-cut salta com bounce!
   - 100% GSAP 3 + ES Modules, pausa fora da tela e clique na palavra avança!
   ========================================================================== */

import { gsap } from './core/gsap.js';
import { playClick } from './sound.js';
import { LOADER_COMPLETE_EVENT } from './loader.js?v=7.5';

const svgUri = (svg) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

// Stickers vetoriais exclusivos VL Tech (nítidos em 4K, zero dependência externa)
const STICKER_CODE = svgUri(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
    <defs>
      <radialGradient id="g1" cx="50%" cy="45%" r="60%">
        <stop offset="0%" stop-color="#221015"/>
        <stop offset="100%" stop-color="#09090d"/>
      </radialGradient>
    </defs>
    <circle cx="100" cy="100" r="100" fill="url(#g1)"/>
    <circle cx="100" cy="100" r="82" fill="none" stroke="#FF1E26" stroke-width="4" stroke-dasharray="10 8" opacity="0.75"/>
    <path d="M72 68 L40 100 L72 132 M128 68 L160 100 L128 132 M110 56 L90 144" fill="none" stroke="#FFFFFF" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="100" cy="100" r="6" fill="#FF1E26"/>
  </svg>`
);

const STICKER_3D = svgUri(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
    <defs>
      <radialGradient id="g2" cx="45%" cy="40%" r="65%">
        <stop offset="0%" stop-color="#FF1E26"/>
        <stop offset="55%" stop-color="#7a0b12"/>
        <stop offset="100%" stop-color="#0a0a0f"/>
      </radialGradient>
    </defs>
    <circle cx="100" cy="100" r="100" fill="url(#g2)"/>
    <circle cx="100" cy="100" r="64" fill="none" stroke="#FFFFFF" stroke-width="5" opacity="0.9"/>
    <ellipse cx="100" cy="100" rx="64" ry="26" fill="none" stroke="#FFFFFF" stroke-width="4.5" opacity="0.85"/>
    <ellipse cx="100" cy="100" rx="26" ry="64" fill="none" stroke="#FFFFFF" stroke-width="4.5" opacity="0.85"/>
    <line x1="36" y1="100" x2="164" y2="100" stroke="#FFFFFF" stroke-width="3.5" opacity="0.65"/>
    <circle cx="100" cy="100" r="10" fill="#FFFFFF"/>
  </svg>`
);

const STICKER_AI = svgUri(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
    <circle cx="100" cy="100" r="100" fill="#0b0b10"/>
    <circle cx="100" cy="100" r="78" fill="none" stroke="rgba(255,255,255,0.16)" stroke-width="3"/>
    <path d="M112 36 L60 112 H98 L88 164 L142 88 H104 Z" fill="#FF1E26" stroke="#FFFFFF" stroke-width="6" stroke-linejoin="round"/>
  </svg>`
);

const WORDS = [
  {
    word: 'SOFTWARE',
    alt: 'Engenharia de Software VL Tech',
    sticker: STICKER_CODE,
    spin: false,
    tilt: -7,
  },
  {
    word: 'PROJETOS',
    alt: 'Logotipo Oficial VL Tech',
    sticker: 'assets/logo/vl-logo.jpg',
    spin: false,
    tilt: 6,
  },
  {
    word: 'PRODUTOS',
    alt: 'Experiências 3D WebGL',
    sticker: STICKER_3D,
    spin: true,
    tilt: -5,
  },
  {
    word: 'AUTOMAÇÃO',
    alt: 'Automações Inteligentes e IA',
    sticker: STICKER_AI,
    spin: false,
    tilt: 8,
  },
];

const INTERVAL_MS = 2900;

function splitAtO(word) {
  const idx = word.toUpperCase().indexOf('O');
  return idx < 0 ? [word, ''] : [word.slice(0, idx), word.slice(idx + 1)];
}

function buildWordElement(item, index) {
  const [before, after] = splitAtO(item.word);
  const el = document.createElement('span');
  el.className = 'ssh-word';
  el.tabIndex = 0;
  el.title = `${item.alt} — Clique para avançar`;
  el.dataset.index = String(index);

  const beforeSpan = document.createElement('span');
  beforeSpan.className = 'ssh-part ssh-before';
  beforeSpan.textContent = before;
  el.appendChild(beforeSpan);

  const slot = document.createElement('span');
  slot.className = 'ssh-slot';

  const stk = document.createElement('span');
  stk.className = `ssh-stk${item.spin ? ' ssh-spin' : ''}`;
  stk.dataset.tilt = String(item.tilt);
  stk.style.transform = `rotate(${item.tilt}deg)`;

  const img = document.createElement('img');
  img.src = item.sticker;
  img.alt = '';
  img.draggable = false;
  img.width = 240;
  img.height = 240;

  stk.appendChild(img);
  slot.appendChild(stk);
  el.appendChild(slot);

  if (after) {
    const afterSpan = document.createElement('span');
    afterSpan.className = 'ssh-part ssh-after';
    afterSpan.textContent = after;
    el.appendChild(afterSpan);
  }

  return el;
}

export function initHeroStickerHeadline() {
  const root = document.getElementById('hero');
  const reel = document.getElementById('heroStickerReel');
  const srText = document.getElementById('heroStickerSr');
  const dots = Array.from(document.querySelectorAll('.ssh-word-dot'));

  if (!root || !reel) return null;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const n = WORDS.length;

  let currentIndex = 0;
  let busy = false;
  let visible = true;
  let timerId = null;

  function updateIndicators(idx) {
    if (srText) srText.textContent = `CRIAMOS ${WORDS[idx].word}`;
    dots.forEach((dot, i) => {
      const isActive = i === idx;
      dot.classList.toggle('is-active', isActive);
      dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
  }

  function bindWordEvents(wordEl) {
    wordEl.addEventListener('click', () => {
      try { playClick(); } catch (_) {}
      advance();
    });
    wordEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        try { playClick(); } catch (_) {}
        advance();
      }
    });
  }

  function mountWord(nextIndex, isFirst = false) {
    const prevEl = reel.querySelector('.ssh-word:not(.is-out)');
    if (prevEl && !isFirst) {
      prevEl.classList.add('is-out');
      prevEl.tabIndex = -1;
    }

    const nextEl = buildWordElement(WORDS[nextIndex], nextIndex);
    bindWordEvents(nextEl);
    reel.appendChild(nextEl);
    updateIndicators(nextIndex);

    const stk = nextEl.querySelector('.ssh-stk');
    const tilt = Number(stk?.dataset.tilt || 0);
    const before = nextEl.querySelector('.ssh-before');
    const after = nextEl.querySelector('.ssh-after');

    const finish = () => {
      busy = false;
      reel.querySelectorAll('.ssh-word.is-out').forEach((el) => el.remove());
    };

    if (prefersReduced || !gsap) {
      if (prevEl && !isFirst) prevEl.remove();
      finish();
      return;
    }

    const tl = gsap.timeline({ onComplete: finish });

    if (isFirst) {
      const leadAndWord = root.querySelectorAll('.ssh-lead, .ssh-word:not(.is-out)');
      const fades = root.querySelectorAll('.ssh-fade');
      tl.fromTo(
        leadAndWord,
        { yPercent: 18, opacity: 0.18 },
        { yPercent: 0, opacity: 1, duration: 0.72, ease: 'power3.out', stagger: 0.06 },
        0
      );
      if (fades.length) {
        tl.fromTo(
          fades,
          { y: 14, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.62, ease: 'power3.out', stagger: 0.07 },
          0.25
        );
      }
    } else {
      if (prevEl) {
        tl.to(prevEl, { yPercent: -100, opacity: 0, duration: 0.42, ease: 'power3.out' }, 0);
      }
      tl.fromTo(nextEl, { yPercent: 100 }, { yPercent: 0, duration: 0.42, ease: 'power3.out' }, 0);
      tl.fromTo(nextEl, { opacity: 0.2 }, { opacity: 1, duration: 0.55, ease: 'power1.out' }, 0.05);
    }

    const at = isFirst ? 0.54 : 0.46;
    if (before) {
      tl.fromTo(before, { x: '0.39em' }, { x: 0, duration: 0.22, ease: 'power2.out' }, at);
    }
    if (after) {
      tl.fromTo(after, { x: '-0.39em' }, { x: 0, duration: 0.22, ease: 'power2.out' }, at);
    }
    if (stk) {
      tl.fromTo(
        stk,
        { scale: 0, rotate: tilt - 24 },
        { scale: 1, rotate: tilt, duration: 0.44, ease: 'back.out(2.2)' },
        at + 0.1
      );
    }
  }

  function swapTo(targetIndex) {
    const nextIdx = ((targetIndex % n) + n) % n;
    if (busy || nextIdx === currentIndex) return;
    busy = true;
    restartTimer();

    const currentStk = reel.querySelector('.ssh-word:not(.is-out) .ssh-stk');
    const proceed = () => {
      currentIndex = nextIdx;
      mountWord(currentIndex, false);
    };

    if (prefersReduced || !currentStk || !gsap) {
      proceed();
      return;
    }

    // Passo 1: sticker atual salta fora antes da palavra rolar pra cima
    gsap.to(currentStk, {
      scale: 0,
      duration: 0.14,
      ease: 'power2.in',
      onComplete: proceed,
    });
  }

  function advance() {
    swapTo(currentIndex + 1);
  }

  function stopTimer() {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
  }

  function restartTimer() {
    stopTimer();
    if (prefersReduced || n < 2) return;
    timerId = setInterval(() => {
      if (visible && !document.hidden && !busy) {
        advance();
      }
    }, INTERVAL_MS);
  }

  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      try { playClick(); } catch (_) {}
      swapTo(idx);
    });
  });

  // Observa visibilidade para economizar CPU/GPU fora do Hero
  let observer = null;
  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0.1 }
    );
    observer.observe(root);
  }

  // Monta a primeira palavra assim que o preloader termina (ou imediatamente se já terminou)
  const startHero = () => {
    reel.innerHTML = '';
    busy = true;
    mountWord(0, true);
    restartTimer();
  };

  if (window.__loaderComplete) {
    startHero();
  } else {
    // Render estático imediato e anima a entrada completa ao liberar o preloader
    reel.innerHTML = '';
    const initialEl = buildWordElement(WORDS[0], 0);
    bindWordEvents(initialEl);
    reel.appendChild(initialEl);
    updateIndicators(0);
    document.addEventListener(LOADER_COMPLETE_EVENT, startHero, { once: true });
  }

  return {
    advance,
    swapTo,
    destroy() {
      stopTimer();
      observer?.disconnect();
    },
  };
}
