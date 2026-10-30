/* ==========================================================================
   REVEAL — Entrada dos títulos de seção ao rolar a página
   - .section__header  → eyebrow + título (clip reveal) + lead/controles
   - títulos avulsos    → fade + slide
   - [data-reveal]      → opt-in genérico para qualquer elemento
   ========================================================================== */

import { gsap, mm, MOTION_OK } from '../core/gsap.js';

const HEADER_SELECTOR = '.section__header';
const STANDALONE_TITLES = '.manifesto__title, .track-card__title, .footer__newsletter-title';
const GENERIC_SELECTOR = '[data-reveal]';

function revealHeaders() {
  gsap.utils.toArray(HEADER_SELECTOR).forEach((header) => {
    const eyebrow = header.querySelector('.eyebrow');
    const title = header.querySelector('.section__title');
    const extras = header.querySelectorAll('.section__lead, .helmets__controls');

    const tl = gsap.timeline({
      scrollTrigger: { trigger: header, start: 'top 85%' },
    });

    if (eyebrow) {
      tl.from(eyebrow, { autoAlpha: 0, y: 16, duration: 0.6 });
    }

    if (title) {
      tl.from(
        title,
        {
          autoAlpha: 0,
          yPercent: 40,
          clipPath: 'inset(0% 0% 100% 0%)',
          duration: 1.2,
          ease: 'expo.out',
          clearProps: 'clipPath',
        },
        eyebrow ? '-=0.35' : 0
      );
    }

    if (extras.length) {
      tl.from(extras, { autoAlpha: 0, y: 24, duration: 0.8, stagger: 0.1 }, '-=0.8');
    }
  });
}

function revealStandaloneTitles() {
  gsap.utils.toArray(STANDALONE_TITLES).forEach((el) => {
    gsap.from(el, {
      autoAlpha: 0,
      y: 40,
      duration: 1,
      scrollTrigger: { trigger: el, start: 'top 90%' },
    });
  });
}

function revealGeneric() {
  gsap.utils.toArray(GENERIC_SELECTOR).forEach((el) => {
    gsap.from(el, {
      autoAlpha: 0,
      y: Number(el.dataset.revealY ?? 32),
      duration: 1,
      delay: Number(el.dataset.revealDelay ?? 0),
      scrollTrigger: { trigger: el, start: 'top 88%' },
    });
  });
}

export function initReveal() {
  // Só anima se o usuário não pediu movimento reduzido.
  // Caso a preferência mude, o matchMedia reverte tudo e o conteúdo fica visível.
  mm.add(MOTION_OK, () => {
    revealHeaders();
    revealStandaloneTitles();
    revealGeneric();
  });
}
