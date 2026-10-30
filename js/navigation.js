/* ==========================================================================
   NAVIGATION — Menu em tela cheia
   - .menu-toggle abre/fecha o #menu-overlay com timeline GSAP
   - Bloqueia a rolagem do body enquanto aberto (com compensação da scrollbar)
   - Acessibilidade: aria-expanded, inert, Esc para fechar, foco preso no menu
   - Funciona sem GSAP (fallback instantâneo) — por isso é um módulo "core"
   ========================================================================== */

import { gsap, isReady } from './core/gsap.js';
import { playMenuOpen, playMenuClose } from './sound.js';

const SELECTORS = {
  nav: '#nav',
  toggle: '.menu-toggle',
  overlay: '#menu-overlay',
  links: '.menu-overlay__link',
  footer: '.menu-overlay__footer',
};

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
const LABELS = { open: 'Abrir menu', close: 'Fechar menu' };

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Bloqueio de rolagem ---------- */

function lockScroll() {
  const root = document.documentElement;
  const scrollbar = window.innerWidth - root.clientWidth;
  root.style.setProperty('--scrollbar-comp', `${scrollbar}px`);
  document.body.style.paddingRight = scrollbar ? `${scrollbar}px` : '';
  document.body.classList.add('is-locked');
}

function unlockScroll() {
  document.documentElement.style.removeProperty('--scrollbar-comp');
  document.body.style.paddingRight = '';
  document.body.classList.remove('is-locked');
}

/* ---------- Timeline do overlay ---------- */

function buildTimeline(overlay, links, footer) {
  const tl = gsap.timeline({ paused: true });

  tl.fromTo(
    overlay,
    { clipPath: 'inset(0% 0% 100% 0%)' },
    { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9, ease: 'expo.inOut' }
  )
    .fromTo(
      links,
      { yPercent: 110 },
      { yPercent: 0, duration: 0.9, stagger: 0.06, ease: 'expo.out' },
      '-=0.35'
    )
    .fromTo(
      footer,
      { autoAlpha: 0, y: 20 },
      { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out' },
      '-=0.6'
    );

  return tl;
}

/* ---------- Inicialização ---------- */

export function initNavigation() {
  const toggle = document.querySelector(SELECTORS.toggle);
  const overlay = document.querySelector(SELECTORS.overlay);
  if (!toggle || !overlay) return null;

  const nav = document.querySelector(SELECTORS.nav);
  const links = [...overlay.querySelectorAll(SELECTORS.links)];
  const footer = overlay.querySelector(SELECTORS.footer);
  const tl = isReady ? buildTimeline(overlay, links, footer) : null;

  let isOpen = false;
  let lastFocused = null;

  function setState(open) {
    isOpen = open;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? LABELS.close : LABELS.open);
    overlay.setAttribute('aria-hidden', String(!open));
    overlay.inert = !open;
    nav?.classList.toggle('is-open', open);
    document.body.classList.toggle('is-menu-open', open);
  }

  function open() {
    if (isOpen) return;
    lastFocused = document.activeElement;

    setState(true);
    lockScroll();
    playMenuOpen();
    overlay.style.visibility = 'visible';

    if (tl) {
      tl.eventCallback('onReverseComplete', null);
      tl.timeScale(1);
      prefersReducedMotion() ? tl.progress(1) : tl.play();
    } else {
      overlay.style.clipPath = 'inset(0% 0% 0% 0%)';
    }

    requestAnimationFrame(() => links[0]?.focus({ preventScroll: true }));
    document.addEventListener('keydown', onKeydown);
  }

  /** Fecha o menu. Resolve quando a animação de saída termina. */
  function close({ restoreFocus = true } = {}) {
    return new Promise((resolve) => {
      if (!isOpen) return resolve();

      setState(false);
      playMenuClose();
      document.removeEventListener('keydown', onKeydown);

      const finish = () => {
        overlay.style.visibility = 'hidden';
        unlockScroll();
        if (restoreFocus) (lastFocused ?? toggle).focus({ preventScroll: true });
        resolve();
      };

      if (tl && !prefersReducedMotion()) {
        tl.eventCallback('onReverseComplete', finish);
        tl.timeScale(1.6).reverse();
      } else {
        tl?.progress(0);
        overlay.style.clipPath = '';
        finish();
      }
    });
  }

  function toggleMenu() {
    isOpen ? close() : open();
  }

  /* Esc fecha; Tab fica preso entre o botão e os itens do menu */
  function onKeydown(event) {
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
      return;
    }

    if (event.key !== 'Tab') return;

    const focusables = [toggle, ...overlay.querySelectorAll(FOCUSABLE)];
    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  /* Links internos: fecha o menu primeiro e só então rola até a seção */
  async function onLinkClick(event) {
    const hash = event.currentTarget.getAttribute('href');
    const target = hash?.startsWith('#') ? document.querySelector(hash) : null;
    if (!target) return;

    event.preventDefault();
    await close({ restoreFocus: false });

    target.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
    history.pushState(null, '', hash);

    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  }

  toggle.addEventListener('click', toggleMenu);
  links.forEach((link) => link.addEventListener('click', onLinkClick));

  // O menu superior flutuante (seletor de perfil, WhatsApp e Serviços)
  // fica visível apenas na seção Hero. Fora da Hero, desaparece suavemente.
  const heroEl = document.getElementById('hero');
  if (nav && heroEl) {
    const handleHeroScroll = () => {
      const heroRect = heroEl.getBoundingClientRect();
      const isOutside = heroRect.bottom <= 80;
      nav.classList.toggle('is-outside-hero', isOutside);
    };

    window.addEventListener('scroll', handleHeroScroll, { passive: true });
    handleHeroScroll();
  }

  setState(false);

  return {
    open,
    close,
    toggle: toggleMenu,
    get isOpen() {
      return isOpen;
    },
  };
}
