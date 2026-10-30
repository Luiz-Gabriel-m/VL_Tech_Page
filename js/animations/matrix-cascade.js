/* ==========================================================================
   MATRIX CASCADE — Efeito Contínuo de Matriz Binária (0 e 1 - 100% Vermelho)
   - Transição cinematográfica contínua da tela do notebook 3D para o Portfólio
   - Cascata densa de números binários ("0" e "1" estritamente em vermelho-neon)
   - Preenche toda a extensão vertical e horizontal da seção de projetos (#capacetes)
   - Resposta magnética ao ponteiro do mouse
   - Otimizado com IntersectionObserver para máxima fluidez e 60 FPS
   ========================================================================== */

export function initMatrixCascade() {
  const wrapper = document.getElementById('matrixCascadeWrapper');
  const canvas = document.getElementById('matrixCascadeCanvas');
  const section = document.getElementById('capacetes');

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

  const BINARY_CHARS = ['0', '1'];
  // Todos os dígitos 0 e 1 estritamente em vermelho neon (sem verde nem branco puro)
  const NEON_REDS = [
    '#FF1E26',
    '#FF2A2A',
    '#FF0033',
    '#FF3B30',
    '#E11D48',
    '#FF4D4D',
    '#FF1122',
    '#D6001C',
    '#FF3344',
    '#FF5555'
  ];

  function resize() {
    const rect = section.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    if (width === 0 || height === 0) return;

    dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    columns = Math.floor(width / FONT_SIZE) + 1;
    drops = [];
    dropSpeeds = [];
    dropColors = [];

    const rowsCount = Math.floor(height / FONT_SIZE);

    for (let i = 0; i < columns; i++) {
      // Distribui as gotas ao longo da altura para que a chuva já esteja ativa
      drops[i] = Math.random() * rowsCount;
      dropSpeeds[i] = 1.3 + Math.random() * 2.5;
      // 100% vermelho-neon VL Tech
      dropColors[i] = NEON_REDS[Math.floor(Math.random() * NEON_REDS.length)];
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
    ctx.fillStyle = 'rgba(10, 10, 12, 0.22)';
    ctx.fillRect(0, 0, width, height);

    ctx.font = `bold ${FONT_SIZE}px "JetBrains Mono", monospace`;
    ctx.textAlign = 'center';

    // Cascata Contínua de Matriz (Chuva binária de 0s e 1s em toda a seção)
    for (let i = 0; i < columns; i++) {
      const char = BINARY_CHARS[(Math.floor(Math.random() * 2))];
      const x = i * FONT_SIZE + (FONT_SIZE / 2);
      const y = drops[i] * FONT_SIZE;

      // Desvio magnético por aproximação do cursor
      let drawX = x;
      const dx = x - mouseX;
      const dy = y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        drawX += (dx / dist) * (120 - dist) * 0.35;
      }

      // Cabeça brilhante do rastro (100% vermelho elétrico neon, sem verde ou branco puro)
      if (Math.random() > 0.88) {
        ctx.fillStyle = '#FF7B80';
      } else {
        ctx.fillStyle = dropColors[i];
      }

      ctx.fillText(char, drawX, y);

      // Reseta gota ao ultrapassar o rodapé da seção de projetos
      if (y > height && Math.random() > 0.975) {
        drops[i] = 0;
        dropSpeeds[i] = 1.3 + Math.random() * 2.5;
      }

      drops[i] += dropSpeeds[i];
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
  }, { rootMargin: '200px' });

  observer.observe(section);
  resize();
  window.addEventListener('resize', resize, { passive: true });

  return {
    resize,
    stop,
    start,
  };
}
