/* ==========================================================================
   FAQ — Acordeão Interativo Editorial com Suavidade e Acessibilidade
   - Expansão suave das perguntas com controle de ARIA (aria-expanded)
   - Integração com o sistema Sound FX da VL Tech
   ========================================================================== */

import { playClick } from './sound.js';

export function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return null;

  faqItems.forEach((item) => {
    const trigger = item.querySelector('.faq-trigger');
    const panel = item.querySelector('.faq-panel');
    if (!trigger || !panel) return;

    trigger.addEventListener('click', () => {
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';

      // Fecha todos os demais acordeões para manter o layout limpo e editorial
      faqItems.forEach((otherItem) => {
        if (otherItem !== item) {
          otherItem.classList.remove('is-open');
          const otherTrigger = otherItem.querySelector('.faq-trigger');
          if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
        }
      });

      // Alterna o item clicado
      if (isExpanded) {
        item.classList.remove('is-open');
        trigger.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
      }

      playClick();
    });

    // Acessibilidade por teclado (Enter ou Space)
    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        trigger.click();
      }
    });
  });

  return {
    closeAll: () => {
      faqItems.forEach((item) => {
        item.classList.remove('is-open');
        item.querySelector('.faq-trigger')?.setAttribute('aria-expanded', 'false');
      });
    }
  };
}
