/* ==========================================================================
   WHY CHOOSE US — Pinned Horizontal Scrollytelling Sequence (#mensagem)
   - Mesmo motor de "Soluções & Serviços" (core/horizontal-scroll.js)
   - Header introdutório fixo à esquerda dentro do viewport pinado
   - Trava estrita: a rolagem vertical só continua após o último card
   - Distância dinâmica do track recalculada a cada refresh/resize
   ========================================================================== */

import { createHorizontalScroll } from './core/horizontal-scroll.js';

export function initWhyChooseUs() {
  const section = document.querySelector('.why-horizontal-section') || document.getElementById('mensagem');
  if (!section) return null;

  return createHorizontalScroll({
    id: 'why',
    container: section.querySelector('#why-scroll-container') || section.querySelector('.horizontal-scroll-container'),
    pinWrapper: section.querySelector('#why-pin-wrapper') || section.querySelector('.horizontal-pin-wrapper'),
    track: section.querySelector('#whyTrack') || section.querySelector('.why-track'),
    cards: section.querySelectorAll('.why-card'),
  });
}
