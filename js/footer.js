/* ==========================================================================
   FOOTER — Interações Premium do Rodapé da VL Tech
   - Relógio em tempo real de São Paulo (UTC-3)
   - Botão de cópia rápida de e-mail (1-click clipboard com feedback visual)
   - Botão suave de voltar ao topo (Back to top com GSAP / Scroll suave)
   ========================================================================== */

import { playClick } from './sound.js';
import { initFooterPong } from './footer-pong.js?v=7.5';

export function initFooter() {
  const pong = initFooterPong();
  // 1. Relógio em tempo real da estação (São Paulo - BR / UTC-3)
  const clockElement = document.getElementById('footerClock');
  if (clockElement) {
    const updateClock = () => {
      try {
        const now = new Date();
        const timeString = now.toLocaleTimeString('pt-BR', {
          timeZone: 'America/Sao_Paulo',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        });
        clockElement.textContent = timeString;
      } catch {
        const now = new Date();
        clockElement.textContent = now.toTimeString().split(' ')[0];
      }
    };

    updateClock();
    setInterval(updateClock, 1000);
  }

  // 2. Botão de cópia rápida de e-mail com feedback
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  const copyFeedback = document.getElementById('copyEmailFeedback');

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      const email = 'contato@vltech.com';

      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(email);
        } else {
          // Fallback para navegadores legados
          const tempInput = document.createElement('input');
          tempInput.value = email;
          document.body.appendChild(tempInput);
          tempInput.select();
          document.execCommand('copy');
          document.body.removeChild(tempInput);
        }

        if (copyFeedback) {
          copyFeedback.textContent = '✓ COPIADO!';
          copyFeedback.classList.add('is-copied');
          setTimeout(() => {
            copyFeedback.textContent = 'COPIAR';
            copyFeedback.classList.remove('is-copied');
          }, 2400);
        }
      } catch (err) {
        console.warn('[footer] Erro ao copiar e-mail:', err);
      }

      playClick();
    });
  }

  // 3. Botão suave "Voltar ao Topo" (funciona sem depender do ScrollToPlugin)
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (backToTopBtn) {
    let scrollTween = null;

    const cancelScrollTween = () => {
      if (scrollTween) {
        scrollTween.kill();
        scrollTween = null;
      }
    };

    window.addEventListener('wheel', cancelScrollTween, { passive: true });
    window.addEventListener('touchstart', cancelScrollTween, { passive: true });

    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      try { playClick(); } catch (_) {}

      const startY = window.scrollY || document.documentElement.scrollTop || 0;
      if (startY <= 0) return;

      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReduced || !window.gsap) {
        window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
        return;
      }

      cancelScrollTween();
      const proxy = { y: startY };
      scrollTween = window.gsap.to(proxy, {
        y: 0,
        duration: 1.15,
        ease: 'power3.inOut',
        onUpdate: () => {
          window.scrollTo(0, Math.round(proxy.y));
        },
        onComplete: () => {
          window.scrollTo(0, 0);
          scrollTween = null;
        },
      });
    });
  }

  // 4. Formulário de Parceria / Proposta no Rodapé
  const footerForm = document.getElementById('newsletter-form');
  if (footerForm) {
    footerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = document.getElementById('newsletter-email');
      const submitBtn = document.getElementById('newsletter-submit');
      if (!input || !submitBtn) return;

      const userEmail = input.value.trim();
      if (!userEmail) return;

      submitBtn.textContent = 'Enviando...';
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.textContent = 'Proposta Enviada! ✓';
        submitBtn.classList.add('btn--success');
        input.value = '';
        input.placeholder = 'Entraremos em contato em breve!';
        playClick();
      }, 800);
    });
  }

  return {
    updateClock: () => {},
    pong,
  };
}
