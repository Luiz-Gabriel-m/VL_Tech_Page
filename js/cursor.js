/* ==========================================================================
   CUSTOM CURSOR — Mouse Follower Suave com Lerp e Reações Interativas
   - Segue a posição do cursor em 60/120fps via requestAnimationFrame / quickTo
   - Expande e ganha glow ao passar por links, botões, cards e inputs
   - Desativa automaticamente em dispositivos touch (pointer: coarse)
   ========================================================================== */

export function initCustomCursor() {
  // Desativa em dispositivos touch / mobile
  if (!window.matchMedia('(pointer: fine)').matches) return null;

  let cursor = document.getElementById('customCursor');
  if (!cursor) {
    cursor = document.createElement('div');
    cursor.id = 'customCursor';
    cursor.className = 'custom-cursor';
    cursor.setAttribute('aria-hidden', 'true');
    cursor.innerHTML = `
      <div class="custom-cursor__ring"></div>
      <div class="custom-cursor__dot"></div>
    `;
    document.body.appendChild(cursor);
  }

  const ring = cursor.querySelector('.custom-cursor__ring');
  const dot = cursor.querySelector('.custom-cursor__dot');

  let mouseX = -100;
  let mouseY = -100;
  let ringX = -100;
  let ringY = -100;
  let isVisible = false;

  const onMouseMove = (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!isVisible) {
      isVisible = true;
      cursor.classList.add('is-visible');
      ringX = mouseX;
      ringY = mouseY;
    }

    // O ponto central acompanha instantaneamente
    if (dot) {
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    }
  };

  window.addEventListener('mousemove', onMouseMove, { passive: true });

  // Animação contínua do anel externo com interpolação suave (lerp)
  let rafId;
  const lerpFactor = 0.18;

  function renderLoop() {
    ringX += (mouseX - ringX) * lerpFactor;
    ringY += (mouseY - ringY) * lerpFactor;

    if (ring) {
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
    }

    rafId = requestAnimationFrame(renderLoop);
  }

  rafId = requestAnimationFrame(renderLoop);

  // Estados de clique e hover
  window.addEventListener('mousedown', () => cursor.classList.add('is-pressed'));
  window.addEventListener('mouseup', () => cursor.classList.remove('is-pressed'));

  document.addEventListener('mouseleave', () => {
    cursor.classList.remove('is-visible');
    isVisible = false;
  });

  document.addEventListener('mouseenter', () => {
    cursor.classList.add('is-visible');
    isVisible = true;
  });

  // Detecção delegada de elementos interativos para expansão do cursor
  const INTERACTIVE_SELECTOR = 'a, button, input, textarea, select, [role="button"], .fan-card, .service-hcard, .faq-trigger, .scrolly-step, .menu-toggle, .founder-toggle-btn, .portfolio-card-3d, .partner-badge';

  document.addEventListener('mouseover', (e) => {
    const target = e.target.closest(INTERACTIVE_SELECTOR);
    if (target) {
      cursor.classList.add('is-hover');
    }
  });

  document.addEventListener('mouseout', (e) => {
    const target = e.target.closest(INTERACTIVE_SELECTOR);
    if (target) {
      cursor.classList.remove('is-hover');
    }
  });

  return {
    destroy: () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMouseMove);
      cursor.remove();
    }
  };
}
