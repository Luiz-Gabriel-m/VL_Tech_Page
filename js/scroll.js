/* ==========================================================================
   SCROLL — Efeitos e animações baseados em ScrollTrigger
   - Efeito parallax / revelação fluida na seção Galeria / Manifesto
   - Animação de revelação (fade-up) para os cards do Manifesto
   - Animação de revelação (fade-up com stagger) para os produtos da Loja
   ========================================================================== */

import { gsap, mm, MOTION_OK, isReady } from './core/gsap.js';
import { createHorizontalScroll } from './core/horizontal-scroll.js';

/**
 * Revelação fluida e efeito de parallax na Galeria / Manifesto
 */
function setupGalleryScroll() {
  const gallery = document.querySelector('#galeria');
  const galleryGrid = document.querySelector('.gallery__grid');
  if (!gallery || !galleryGrid) return;

  const galleryItems = gsap.utils.toArray('.gallery__item, .gallery__manifesto');

  // 1. Entrada fluida e escalonada dos itens da galeria ao entrar na viewport
  if (galleryItems.length) {
    gsap.from(galleryItems, {
      scrollTrigger: {
        trigger: galleryGrid,
        start: 'top 85%',
      },
      autoAlpha: 0,
      y: 50,
      scale: 0.95,
      stagger: 0.09,
      duration: 1.1,
      ease: 'power3.out',
      clearProps: 'transform,opacity,visibility',
    });
  }

  // 2. Parallax vertical suave nos cards durante o scroll (Desktop/Tablet)
  // Cria dinâmica entre colunas conforme o usuário rola
  const parallaxItems = gsap.utils.toArray('.gallery__item');
  parallaxItems.forEach((item, index) => {
    // Varia a velocidade e direção baseado no índice ou atributo data-speed
    const speed = parseFloat(item.dataset.speed) || 1;
    const offset = (index % 2 === 0 ? -35 : 45) * speed;

    gsap.to(item, {
      y: offset,
      ease: 'none',
      scrollTrigger: {
        trigger: galleryGrid,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.2,
      },
    });
  });
}

/**
 * Animação de revelação (fade-up) para os cards da seção de Manifesto
 */
function setupManifestoCards() {
  const manifestoGrid = document.querySelector('.manifesto');
  const items = gsap.utils.toArray('.manifesto__item');
  if (!manifestoGrid || !items.length) return;

  gsap.from(items, {
    scrollTrigger: {
      trigger: manifestoGrid,
      start: 'top 85%',
    },
    autoAlpha: 0,
    y: 40,
    stagger: 0.15,
    duration: 1,
    ease: 'power3.out',
    clearProps: 'transform,opacity,visibility',
  });
}

/**
 * Seção de Serviços Interativa com Rolagem Horizontal Pinned (Awwwards Style)
 * - Motor unificado em core/horizontal-scroll.js (idêntico a #mensagem e #galeria)
 * - Pin no #services-pin-wrapper; gatilho no #services-scroll-container (nunca pinado)
 * - x: () => -(track.offsetLeft + track.offsetWidth - viewport) · scrub: 1
 * - invalidateOnRefresh: recalcula dinamicamente no resize
 *
 * Exportado separadamente para que main.js o inicialize NA ORDEM DO DOM
 * (antes de #parceiros e #socios-scrolly). Criar este pin depois dos gatilhos
 * abaixo dele era a causa do pin prematuro da seção de Sócios.
 */
export function initServicesScroll() {
  const section =
    document.querySelector('.shop-section.helmets-section') ||
    document.querySelector('.services-section.shop-section') ||
    document.getElementById('loja');
  const container =
    section?.querySelector('#services-scroll-container') ||
    section?.querySelector('.horizontal-scroll-container') ||
    document.querySelector('#services-scroll-container');
  if (!container) return null;

  return createHorizontalScroll({
    id: 'services',
    container,
    pinWrapper:
      section?.querySelector('#services-pin-wrapper') ||
      section?.querySelector('.horizontal-pin-wrapper') ||
      document.querySelector('#services-pin-wrapper'),
    track:
      section?.querySelector('#services-track') ||
      section?.querySelector('.horizontal-track') ||
      document.querySelector('#services-track'),
    cards: (section || document).querySelectorAll('#services-track .service-hcard, .shop-section .service-hcard'),
  });
}

/**
 * Animação de entrada e abertura em leque 3D para o Hall of Fame / Portfólio (Lando Norris Style)
 * - Ao entrar na viewport, os cartões sobem a partir do centro e abrem em leque suave
 * - ScrollTrigger orquestra a transição com interpolação física fluida
 */
function setupPortfolioFanScroll() {
  const section = document.querySelector('.portfolio-fan-section, #capacetes');
  const container = document.querySelector('#portfolioFanContainer');
  if (!section || !container) return;

  const headerElements = section.querySelectorAll('.portfolio-fan-glyph, .portfolio-fan-title, .portfolio-fan-lead');
  const cards = gsap.utils.toArray('.fan-card');
  const footer = section.querySelector('.portfolio-fan-footer');

  // 1. Revelação imediata do header editorial (sem espaço em branco)
  if (headerElements.length) {
    gsap.set(headerElements, { autoAlpha: 1 });
    gsap.from(headerElements, {
      scrollTrigger: {
        trigger: section,
        start: 'top 98%',
      },
      autoAlpha: 0,
      y: 20,
      stagger: 0.08,
      duration: 0.8,
      ease: 'power3.out',
      clearProps: 'transform,opacity,visibility',
    });
  }

  // 2. Abertura monumental em leque 3D com GSAP imediata
  if (cards.length) {
    const fanConfig = cards.map((card) => ({
      rot: parseFloat(card.dataset.fanRot) || 0,
      y: parseFloat(card.dataset.fanY) || 0,
      x: parseFloat(card.dataset.fanX) || 0,
      scale: parseFloat(card.dataset.fanScale) || 1,
    }));

    if (window.innerWidth > 820) {
      gsap.set(cards, {
        autoAlpha: 1,
        y: 40,
        x: 0,
        rotation: 0,
        scale: 0.94,
        transformOrigin: '50% 120%',
      });

      gsap.to(cards, {
        scrollTrigger: {
          trigger: section,
          start: 'top 98%',
        },
        autoAlpha: 1,
        y: (i) => fanConfig[i].y,
        x: (i) => fanConfig[i].x,
        rotation: (i) => fanConfig[i].rot,
        scale: (i) => fanConfig[i].scale,
        duration: 0.9,
        stagger: 0.05,
        ease: 'power3.out',
        onComplete: () => {
          cards.forEach((card) => {
            gsap.set(card, { clearProps: 'transform' });
          });
        },
      });
    } else {
      gsap.from(cards, {
        scrollTrigger: {
          trigger: section,
          start: 'top 98%',
        },
        autoAlpha: 0,
        y: 25,
        stagger: 0.08,
        duration: 0.7,
        ease: 'power2.out',
        clearProps: 'transform,opacity,visibility',
      });
    }
  }

  // 3. Rodapé do leque
  if (footer) {
    gsap.from(footer, {
      scrollTrigger: {
        trigger: footer,
        start: 'top 92%',
      },
      autoAlpha: 0,
      y: 20,
      duration: 0.9,
      ease: 'power2.out',
    });
  }
}

/**
 * Inicializa todos os comportamentos de rolagem controlados por ScrollTrigger
 */
export function initScroll() {
  if (!isReady || !mm) return;

  // Só executa animações se o usuário não preferir movimento reduzido
  mm.add(MOTION_OK, () => {
    setupGalleryScroll();
    setupManifestoCards();
    setupPortfolioFanScroll();
  });
}




