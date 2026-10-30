/* ==========================================================================
   MATRIX CASCADE — Efeito de Cascata de Matriz (Binário 0 e 1)
   - Transição cinematográfica para computadores/desktops
   - Cascata densa de números binários ("0" e "1" em verde-neon / vermelho-neon)
   - Os caracteres binários se organizam e convergem suavemente para formar
     a escrita tipográfica da seção de projetos ("NOSSOS PROJETOS // WEB PORTFOLIO")
   - Integração física e suave com GSAP ScrollTrigger
   ========================================================================== */

import { gsap, ScrollTrigger } from '../core/gsap.js';

export function initMatrixCascade() {
  const wrapper = document.getElementById('matrixCascadeWrapper');
  const canvas = document.getElementById('matrixCascadeCanvas');
  const section = document.getElementById('capacetes');
  const targetMain = document.getElementById('matrixTargetMain');
  const targetSub = document.getElementById('matrixTargetSub');

  if (!wrapper || !canvas || !section) return null;

  const ctx = canvas.getContext('2d');
  let width = 0;
  let height = 0;
  let dpr = 1;
  let rafId = null;
  let isVisible = false;

  // Configuração das colunas binárias
  const FONT_SIZE = 14;
  let columns = 0;
  let drops = [];
  let dropSpeeds = [];
  let dropColors = [];

  // Alvos da convergência tipográfica
  let convergenceProgress = 0; // 0: Chuva pura -> 1: Totalmente convergido no texto
  let textParticles = [];

  const BINARY_CHARS = ['0', '1'];
  const NEON_GREENS = ['#00FF66', '#27C93F', '#10B981', '#34D399'];
  const NEON_REDS = ['#FF1E26', '#FF3B30', '#E11D48', '#FF4D4D'];

  function resize() {
    const rect = wrapper.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    columns = Math.floor(width / FONT_SIZE) + 1;
    drops = [];
    dropSpeeds = [];
    dropColors = [];

    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100;
      dropSpeeds[i] = 1.2 + Math.random() * 2.8;
      // 70% verde-neon clássico, 30% vermelho-neon VL Tech
      dropColors[i] = Math.random() > 0.3
        ? NEON_GREENS[Math.floor(Math.random() * NEON_GREENS.length)]
        : NEON_REDS[Math.floor(Math.random() * NEON_REDS.length)];
    }

    calculateConvergenceTargets();
  }

  // Mapeia as posições relativas dos caracteres do título no canvas
  function calculateConvergenceTargets() {
    textParticles = [];
    if (!targetMain || !targetSub) return;

    const wrapperRect = wrapper.getBoundingClientRect();
    const mainRect = targetMain.getBoundingClientRect();
    const subRect = targetSub.getBoundingClientRect();

    const mainText = (targetMain.textContent || 'NOSSOS PROJETOS').trim();
    const subText = (targetSub.textContent || 'WEB PORTFOLIO').trim();

    // Mapeia linha 1: "NOSSOS PROJETOS"
    const mainCharWidth = mainRect.width / Math.max(1, mainText.length);
    for (let i = 0; i < mainText.length; i++) {
      const char = mainText[i];
      if (char === ' ') continue;

      const targetX = (mainRect.left - wrapperRect.left) + (i * mainCharWidth) + (mainCharWidth * 0.5);
      const targetY = (mainRect.top - wrapperRect.top) + (mainRect.height * 0.75);

      textParticles.push({
        char,
        currentDisplay: Math.random() > 0.5 ? '0' : '1',
        x: Math.random() * width,
        y: Math.random() * -height * 0.5,
        targetX,
        targetY,
        color: '#FFFFFF',
        glowColor: '#FF1E26',
        isSub: false,
        size: Math.max(18, Math.min(36, mainCharWidth * 1.3)),
        scrambleCounter: Math.floor(Math.random() * 20),
      });
    }

    // Mapeia linha 2: "WEB PORTFOLIO"
    const subCharWidth = subRect.width / Math.max(1, subText.length);
    for (let i = 0; i < subText.length; i++) {
      const char = subText[i];
      if (char === ' ') continue;

      const targetX = (subRect.left - wrapperRect.left) + (i * subCharWidth) + (subCharWidth * 0.5);
      const targetY = (subRect.top - wrapperRect.top) + (subRect.height * 0.75);

      textParticles.push({
        char,
        currentDisplay: Math.random() > 0.5 ? '0' : '1',
        x: Math.random() * width,
        y: Math.random() * -height * 0.5,
        targetX,
        targetY,
        color: '#FF1E26',
        glowColor: '#FF1E26',
        isSub: true,
        size: Math.max(22, Math.min(42, subCharWidth * 1.3)),
        scrambleCounter: Math.floor(Math.random() * 20),
      });
    }
  }

  // Interação sutil do mouse: desvia dígitos binários próximos
  let mouseX = -9999;
  let mouseY = -9999;
  window.addEventListener('pointermove', (e) => {
    if (!isVisible) return;
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  }, { passive: true });

  function render() {
    if (!isVisible) {
      rafId = null;
      return;
    }

    // Fundo semitransparente criando rastro fosfórico
    ctx.fillStyle = 'rgba(10, 10, 12, 0.18)';
    ctx.fillRect(0, 0, width, height);

    ctx.font = `bold ${FONT_SIZE}px "JetBrains Mono", monospace`;
    ctx.textAlign = 'center';

    const rainOpacity = Math.max(0, 1 - (convergenceProgress * 1.25));

    // 1. Cascata de Matriz (Chuva binária de 0s e 1s)
    if (rainOpacity > 0.05) {
      for (let i = 0; i < columns; i++) {
        const char = BINARY_CHARS[(Math.floor(Math.random() * 2))];
        const x = i * FONT_SIZE + (FONT_SIZE / 2);
        const y = drops[i] * FONT_SIZE;

        // Desvio magnético por aproximação do cursor
        let drawX = x;
        const dx = x - mouseX;
        const dy = y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          drawX += (dx / dist) * (100 - dist) * 0.3;
        }

        // Cabeça brilhante do rastro (Leading spark)
        ctx.fillStyle = Math.random() > 0.85
          ? `rgba(255, 255, 255, ${rainOpacity})`
          : dropColors[i].replace(')', `, ${rainOpacity})`).replace('rgb', 'rgba').replace('#', 'rgba(');

        // Se a cor for hex, desenha direto
        if (dropColors[i].startsWith('#')) {
          ctx.fillStyle = dropColors[i];
          ctx.globalAlpha = rainOpacity;
        }

        ctx.fillText(char, drawX, y);
        ctx.globalAlpha = 1.0;

        // Reseta gota ao passar do rodapé
        if (y > height && Math.random() > 0.975) {
          drops[i] = 0;
          dropSpeeds[i] = 1.2 + Math.random() * 2.8;
        }

        drops[i] += dropSpeeds[i] * (1 - convergenceProgress * 0.5);
      }
    }

    // 2. Convergência Tipográfica: os binários migram e formam as palavras
    if (convergenceProgress > 0.05 && textParticles.length) {
      const ease = convergenceProgress;

      textParticles.forEach((p) => {
        // Interpolação suave (lerp) das coordenadas em direção ao caractere alvo
        p.x += (p.targetX - p.x) * (0.08 + ease * 0.12);
        p.y += (p.targetY - p.y) * (0.08 + ease * 0.12);

        // Decodificação binária: alterna 0 e 1 rapidamente e fixa na letra final
        if (ease < 0.88) {
          p.scrambleCounter--;
          if (p.scrambleCounter <= 0) {
            p.currentDisplay = Math.random() > 0.5 ? '0' : '1';
            p.scrambleCounter = Math.floor(Math.random() * 6) + 2;
          }
        } else {
          p.currentDisplay = p.char;
        }

        // Desenha caractere em convergência
        ctx.save();
        ctx.font = `900 ${p.size}px ${p.isSub ? '"Anton", sans-serif' : '"Monument Extended", "Syne", sans-serif'}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Brilho volumétrico neon
        if (ease > 0.4) {
          ctx.shadowColor = p.glowColor;
          ctx.shadowBlur = Math.min(25, ease * 28);
        }

        ctx.fillStyle = ease > 0.75 ? p.color : (Math.random() > 0.3 ? '#00FF66' : '#FF1E26');
        ctx.globalAlpha = Math.min(1, ease * 1.4);
        ctx.fillText(p.currentDisplay, p.x, p.y);
        ctx.restore();
      });
    }

    rafId = requestAnimationFrame(render);
  }

  function start() {
    if (!isVisible) {
      isVisible = true;
      if (!rafId) rafId = requestAnimationFrame(render);
    }
  }

  function stop() {
    isVisible = false;
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  // Observador de visibilidade para economizar 100% de CPU fora da tela
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        start();
      } else {
        stop();
      }
    });
  }, { rootMargin: '150px' });

  observer.observe(section);
  resize();
  window.addEventListener('resize', resize, { passive: true });
  document.fonts?.ready.then(() => {
    calculateConvergenceTargets();
  });

  // GSAP ScrollTrigger orquestrando o progresso da cascata e convergência
  if (typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.addEventListener('refresh', calculateConvergenceTargets);

    ScrollTrigger.create({
      trigger: section,
      start: 'top 85%',
      end: 'top 20%',
      scrub: 1.1,
      onUpdate: (self) => {
        convergenceProgress = self.progress;

        // Ao se aproximar de 100%, faz fade sutil no canvas para liberar a tipografia DOM oficial
        if (self.progress > 0.88) {
          wrapper.style.opacity = `${(1 - (self.progress - 0.88) / 0.12 * 0.7).toFixed(2)}`;
        } else {
          wrapper.style.opacity = '0.95';
        }
      },
    });
  }

  return {
    resize,
    stop,
    start,
  };
}
