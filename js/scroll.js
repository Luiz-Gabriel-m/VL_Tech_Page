/* ==========================================================================
   SCROLL — Efeitos e animações baseados em ScrollTrigger
   - Efeito parallax / revelação fluida na seção Galeria / Manifesto
   - Animação de revelação (fade-up) para os cards do Manifesto
   - Animação de revelação (fade-up com stagger) para os produtos da Loja
   ========================================================================== */

import { gsap, mm, MOTION_OK, isReady } from './core/gsap.js';

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
 * - Container principal com altura estendida (#services-scroll-container)
 * - Pin: true para fixar o container (#services-pin-wrapper) durante a rolagem vertical
 * - Tween com x: () => -(trackWidth - window.innerWidth + offset)
 * - scrub: 1 para interpolação física suave
 * - invalidateOnRefresh: true para recalcular dinamicamente no redimensionamento da janela
 * - Microinterações individuais em cada card com containerAnimation
 */
function setupHorizontalServicesScroll() {
  const container = document.querySelector('#services-scroll-container');
  const pinWrapper = document.querySelector('#services-pin-wrapper');
  const track = document.querySelector('#services-track');

  if (!container || !pinWrapper || !track) return;

  const getScrollDistance = () => {
    // Distância total necessária para que todos os cards passem com margem confortável
    const trackWidth = track.scrollWidth;
    const windowWidth = window.innerWidth;
    const introWidth = document.querySelector('.horizontal-intro')?.offsetWidth || 0;
    return Math.max(0, trackWidth + introWidth - windowWidth + 140);
  };

  const horizontalTween = gsap.to(track, {
    x: () => -getScrollDistance(),
    ease: 'none',
    scrollTrigger: {
      trigger: container,
      pin: pinWrapper,
      start: 'top top',
      end: () => `+=${getScrollDistance() * 1.5}`,
      scrub: 1,
      invalidateOnRefresh: true,
      anticipatePin: 1,
    },
  });

  // Microinteração sutil de entrada/revelação em cada card horizontal
  const cards = gsap.utils.toArray('.service-hcard');
  cards.forEach((card) => {
    gsap.fromTo(
      card,
      { opacity: 0.82, scale: 0.96 },
      {
        opacity: 1,
        scale: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: card,
          containerAnimation: horizontalTween,
          start: 'left 94%',
          end: 'left 35%',
          scrub: true,
        },
      }
    );
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

  // 1. Revelação suave do header editorial
  if (headerElements.length) {
    gsap.from(headerElements, {
      scrollTrigger: {
        trigger: section,
        start: 'top 85%',
      },
      autoAlpha: 0,
      y: 35,
      stagger: 0.1,
      duration: 1,
      ease: 'power3.out',
    });
  }

  // 2. Abertura monumental em leque 3D com GSAP
  if (cards.length) {
    const fanConfig = cards.map((card) => ({
      rot: parseFloat(card.dataset.fanRot) || 0,
      y: parseFloat(card.dataset.fanY) || 0,
      x: parseFloat(card.dataset.fanX) || 0,
      scale: parseFloat(card.dataset.fanScale) || 1,
    }));

    if (window.innerWidth > 820) {
      gsap.set(cards, {
        autoAlpha: 0,
        y: 80,
        x: 0,
        rotation: 0,
        scale: 0.88,
        transformOrigin: '50% 120%',
      });

      gsap.to(cards, {
        scrollTrigger: {
          trigger: container,
          start: 'top 80%',
        },
        autoAlpha: 1,
        y: (i) => fanConfig[i].y,
        x: (i) => fanConfig[i].x,
        rotation: (i) => fanConfig[i].rot,
        scale: (i) => fanConfig[i].scale,
        duration: 1.25,
        stagger: 0.08,
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
          trigger: container,
          start: 'top 85%',
        },
        autoAlpha: 0,
        y: 40,
        stagger: 0.12,
        duration: 0.9,
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
    setupHorizontalServicesScroll();
  });
}




