/* ==========================================================================
   TILT HAT — Efeito 3D Interativo de "Tirar o Chapéu" na Seção de Tecnologia
   - Movimento 3D em perspectiva (tilt) com rotação nos eixos X e Y
   - Simulação cinematográfica de "tirar o chapéu" ao passar o mouse ou no scroll
   - Revela a camada interna tecnológica (circuitos e luz vermelha volumétrica)
   ========================================================================== */

import { gsap, ScrollTrigger } from '../core/gsap.js';

export function initTiltHat() {
  const cards = document.querySelectorAll('[data-tilt-hat]');
  if (!cards.length) return null;

  cards.forEach((card) => {
    let bounds = null;
    let isHovered = false;
    let currentTiltX = 0;
    let currentTiltY = 0;
    let targetTiltX = 0;
    let targetTiltY = 0;
    let rafId = null;

    const updateBounds = () => {
      bounds = card.getBoundingClientRect();
    };

    const updateTiltPhysics = () => {
      if (!isHovered) {
        // Interpolação suave (lerp) de volta à posição de repouso
        currentTiltX += (0 - currentTiltX) * 0.12;
        currentTiltY += (0 - currentTiltY) * 0.12;

        card.style.setProperty('--tilt-x', currentTiltX.toFixed(2));
        card.style.setProperty('--tilt-y', currentTiltY.toFixed(2));

        if (Math.abs(currentTiltX) > 0.05 || Math.abs(currentTiltY) > 0.05) {
          rafId = requestAnimationFrame(updateTiltPhysics);
        } else {
          card.style.setProperty('--tilt-x', '0');
          card.style.setProperty('--tilt-y', '0');
          rafId = null;
        }
        return;
      }

      // Lerp físico responsivo nos ângulos de inclinação
      currentTiltX += (targetTiltX - currentTiltX) * 0.18;
      currentTiltY += (targetTiltY - currentTiltY) * 0.18;

      card.style.setProperty('--tilt-x', currentTiltX.toFixed(2));
      card.style.setProperty('--tilt-y', currentTiltY.toFixed(2));

      rafId = requestAnimationFrame(updateTiltPhysics);
    };

    card.addEventListener('pointerenter', (e) => {
      isHovered = true;
      updateBounds();
      if (!rafId) {
        rafId = requestAnimationFrame(updateTiltPhysics);
      }
    });

    card.addEventListener('pointermove', (e) => {
      if (!bounds) updateBounds();
      const mouseX = e.clientX - bounds.left;
      const mouseY = e.clientY - bounds.top;

      const normX = Math.max(0, Math.min(1, mouseX / bounds.width));
      const normY = Math.max(0, Math.min(1, mouseY / bounds.height));

      // Ângulos de rotação em perspectiva
      targetTiltX = (normY - 0.5) * -15; // Inverte eixo X para inclinar para trás
      targetTiltY = (normX - 0.5) * 16;

      // Posição do brilho especular dinâmico
      card.style.setProperty('--mouse-x', `${(normX * 100).toFixed(1)}%`);
      card.style.setProperty('--mouse-y', `${(normY * 100).toFixed(1)}%`);

      if (!rafId) {
        rafId = requestAnimationFrame(updateTiltPhysics);
      }
    });

    card.addEventListener('pointerleave', () => {
      isHovered = false;
      targetTiltX = 0;
      targetTiltY = 0;
      card.style.setProperty('--mouse-x', '50%');
      card.style.setProperty('--mouse-y', '50%');
      if (!rafId) {
        rafId = requestAnimationFrame(updateTiltPhysics);
      }
    });

    window.addEventListener('resize', updateBounds, { passive: true });
  });

  // Gestual de Boas-Vindas ("Tirar o Chapéu") acionado por ScrollTrigger na entrada da seção
  const tracksSection = document.querySelector('#tracks');
  if (tracksSection && typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.create({
      trigger: tracksSection,
      start: 'top 75%',
      once: true,
      onEnter: () => {
        cards.forEach((card, index) => {
          gsap.delayedCall(index * 0.18 + 0.2, () => {
            card.classList.add('is-hat-tipped');
            gsap.delayedCall(0.9, () => {
              card.classList.remove('is-hat-tipped');
            });
          });
        });
      }
    });
  }

  return { cards };
}
