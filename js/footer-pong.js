/* ==========================================================================
   FOOTER PONG — Animação Pixel-Text Pong/Breakout (Adaptada da 21st.dev)
   Texto: "VL TECH" / "ENGENHARIA DE SOFTWARE"
   - Paleta VL Tech: Preto #070709 | Branco #FFFFFF | Vermelho #FF1E26
   - 4 paddles autônomos nas bordas + colisão com pixels das letras
   - HiDPI (dpr <= 2), delta-time normalizado (60/120fps) e IntersectionObserver
   - Clique no canvas reinicia a rodada / redireciona a bola
   ========================================================================== */

const COLORS = {
  bg: '#070709',
  pixelWhite: '#FFFFFF',
  pixelAccent: '#FF1E26',
  hitWhite: '#26262E',
  hitAccent: '#3D1217',
  ball: '#FF1E26',
  paddle: '#FFFFFF',
};

const LETTER_SPACING = 1;
const WORD_SPACING = 3;

const PIXEL_MAP = {
  A: [
    [0, 1, 1, 0],
    [1, 0, 0, 1],
    [1, 1, 1, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
  ],
  C: [
    [1, 1, 1, 1],
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [1, 1, 1, 1],
  ],
  D: [
    [1, 1, 1, 0],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 1, 1, 0],
  ],
  E: [
    [1, 1, 1, 1],
    [1, 0, 0, 0],
    [1, 1, 1, 1],
    [1, 0, 0, 0],
    [1, 1, 1, 1],
  ],
  F: [
    [1, 1, 1, 1],
    [1, 0, 0, 0],
    [1, 1, 1, 0],
    [1, 0, 0, 0],
    [1, 0, 0, 0],
  ],
  G: [
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0],
    [1, 0, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
  ],
  H: [
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 1, 1, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
  ],
  I: [
    [1, 1, 1],
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
    [1, 1, 1],
  ],
  L: [
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [1, 1, 1, 1],
  ],
  N: [
    [1, 0, 0, 0, 1],
    [1, 1, 0, 0, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 0, 1, 1],
    [1, 0, 0, 0, 1],
  ],
  O: [
    [1, 1, 1, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 1, 1, 1],
  ],
  R: [
    [1, 1, 1, 1],
    [1, 0, 0, 1],
    [1, 1, 1, 1],
    [1, 0, 1, 0],
    [1, 0, 0, 1],
  ],
  S: [
    [1, 1, 1, 1],
    [1, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 1],
    [1, 1, 1, 1],
  ],
  T: [
    [1, 1, 1, 1, 1],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
  ],
  V: [
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 0, 1, 0],
    [0, 0, 1, 0, 0],
  ],
  W: [
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 1, 0, 1],
    [1, 1, 0, 1, 1],
    [1, 0, 0, 0, 1],
  ],
};

function measureLineUnits(line) {
  const words = line.split(' ');
  return words.reduce((total, word, wIdx) => {
    const lettersUnits =
      word.split('').reduce((acc, ch) => {
        const map = PIXEL_MAP[ch];
        return acc + (map ? map[0].length + LETTER_SPACING : 0);
      }, 0) - LETTER_SPACING;
    return total + lettersUnits + (wIdx > 0 ? WORD_SPACING : 0);
  }, 0);
}

export function initFooterPong() {
  const canvas = document.getElementById('footerPongCanvas');
  if (!canvas) return null;

  const container = canvas.parentElement;
  const ctx = canvas.getContext('2d');
  if (!container || !ctx) return null;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const LINES = [
    { text: 'VL TECH', accentFirstWord: true },
    { text: 'ENGENHARIA DE SOFTWARE', accentFirstWord: false },
  ];

  let width = 0;
  let height = 0;
  let pixels = [];
  let hitCount = 0;
  let ball = { x: 0, y: 0, dx: 0, dy: 0, radius: 5 };
  let paddles = [];
  let rafId = null;
  let isVisible = false;
  let lastTime = performance.now();

  function buildGame() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = container.clientWidth || window.innerWidth;
    height = container.clientHeight || 360;

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Calcula tamanhos proporcionais para caber folgado com margem pros paddles
    const line1Units = measureLineUnits(LINES[0].text);
    const line2Units = measureLineUnits(LINES[1].text);

    const maxContentW = width * 0.8;
    const maxContentH = height * 0.68;

    // Proporção entre linha 1 (grande) e linha 2 (subtítulo)
    let largePx = Math.min(maxContentW / line1Units, (maxContentH * 0.56) / 5);
    let smallPx = Math.min(maxContentW / line2Units, largePx * 0.36);

    // Garante que a altura somada caiba confortavelmente dentro do canvas
    const gapBetweenLines = Math.max(largePx * 2.1, 14);
    const totalTextH = 5 * largePx + gapBetweenLines + 5 * smallPx;
    if (totalTextH > maxContentH) {
      const k = maxContentH / totalTextH;
      largePx *= k;
      smallPx *= k;
    }

    const lineGap = Math.max(largePx * 2.1, 14);
    const finalTotalH = 5 * largePx + lineGap + 5 * smallPx;
    let cursorY = (height - finalTotalH) / 2;

    pixels = [];
    hitCount = 0;

    LINES.forEach((lineObj, lineIdx) => {
      const px = lineIdx === 0 ? largePx : smallPx;
      const lineUnits = lineIdx === 0 ? line1Units : line2Units;
      let cursorX = (width - lineUnits * px) / 2;

      const words = lineObj.text.split(' ');
      words.forEach((word, wordIdx) => {
        const isAccent = lineObj.accentFirstWord && wordIdx === 0;

        word.split('').forEach((ch) => {
          const map = PIXEL_MAP[ch];
          if (!map) return;

          for (let r = 0; r < map.length; r++) {
            for (let c = 0; c < map[r].length; c++) {
              if (map[r][c]) {
                pixels.push({
                  x: cursorX + c * px,
                  y: cursorY + r * px,
                  size: Math.max(px - 0.6, 1.5),
                  hit: false,
                  accent: isAccent,
                });
              }
            }
          }
          cursorX += (map[0].length + LETTER_SPACING) * px;
        });

        cursorX += (WORD_SPACING - LETTER_SPACING) * px;
      });

      cursorY += 5 * px + lineGap;
    });

    const paddleThick = Math.max(5, Math.min(10, largePx * 0.62));
    const paddleLenH = Math.max(68, Math.min(130, width * 0.13));
    const paddleLenV = Math.max(54, Math.min(105, height * 0.28));
    const ballSpeed = Math.max(3.6, Math.min(6.4, width / 190));
    const ballRadius = Math.max(4.5, Math.min(8, largePx * 0.42));

    ball = {
      x: width * 0.86,
      y: height * 0.16,
      dx: -ballSpeed,
      dy: ballSpeed * 0.85,
      radius: ballRadius,
    };

    paddles = [
      {
        x: 6,
        y: height / 2 - paddleLenV / 2,
        width: paddleThick,
        height: paddleLenV,
        isVertical: true,
      },
      {
        x: width - paddleThick - 6,
        y: height / 2 - paddleLenV / 2,
        width: paddleThick,
        height: paddleLenV,
        isVertical: true,
      },
      {
        x: width / 2 - paddleLenH / 2,
        y: 6,
        width: paddleLenH,
        height: paddleThick,
        isVertical: false,
      },
      {
        x: width / 2 - paddleLenH / 2,
        y: height - paddleThick - 6,
        width: paddleLenH,
        height: paddleThick,
        isVertical: false,
      },
    ];

    draw();
  }

  function update(dt) {
    ball.x += ball.dx * dt;
    ball.y += ball.dy * dt;

    // Rebote nas paredes
    if (ball.y - ball.radius < 0) {
      ball.y = ball.radius;
      ball.dy = Math.abs(ball.dy);
    } else if (ball.y + ball.radius > height) {
      ball.y = height - ball.radius;
      ball.dy = -Math.abs(ball.dy);
    }

    if (ball.x - ball.radius < 0) {
      ball.x = ball.radius;
      ball.dx = Math.abs(ball.dx);
    } else if (ball.x + ball.radius > width) {
      ball.x = width - ball.radius;
      ball.dx = -Math.abs(ball.dx);
    }

    // Colisão com os 4 paddles
    for (let i = 0; i < paddles.length; i++) {
      const p = paddles[i];
      if (p.isVertical) {
        if (
          ball.x - ball.radius < p.x + p.width &&
          ball.x + ball.radius > p.x &&
          ball.y + ball.radius > p.y &&
          ball.y - ball.radius < p.y + p.height
        ) {
          ball.dx = p.x < width / 2 ? Math.abs(ball.dx) : -Math.abs(ball.dx);
        }
        const targetY = Math.max(6, Math.min(height - p.height - 6, ball.y - p.height / 2));
        p.y += (targetY - p.y) * Math.min(1, 0.12 * dt);
      } else {
        if (
          ball.y - ball.radius < p.y + p.height &&
          ball.y + ball.radius > p.y &&
          ball.x + ball.radius > p.x &&
          ball.x - ball.radius < p.x + p.width
        ) {
          ball.dy = p.y < height / 2 ? Math.abs(ball.dy) : -Math.abs(ball.dy);
        }
        const targetX = Math.max(6, Math.min(width - p.width - 6, ball.x - p.width / 2));
        p.x += (targetX - p.x) * Math.min(1, 0.12 * dt);
      }
    }

    // Colisão com os blocos de pixel do texto
    for (let i = 0; i < pixels.length; i++) {
      const px = pixels[i];
      if (
        !px.hit &&
        ball.x + ball.radius > px.x &&
        ball.x - ball.radius < px.x + px.size &&
        ball.y + ball.radius > px.y &&
        ball.y - ball.radius < px.y + px.size
      ) {
        px.hit = true;
        hitCount++;
        const cx = px.x + px.size / 2;
        const cy = px.y + px.size / 2;
        if (Math.abs(ball.x - cx) > Math.abs(ball.y - cy)) {
          ball.dx = -ball.dx;
        } else {
          ball.dy = -ball.dy;
        }
        break;
      }
    }

    // Auto-reset suave quando quase todos os pixels são acertados
    if (pixels.length > 0 && hitCount >= pixels.length * 0.92) {
      for (let i = 0; i < pixels.length; i++) pixels[i].hit = false;
      hitCount = 0;
    }
  }

  function draw() {
    ctx.fillStyle = COLORS.bg;
    ctx.fillRect(0, 0, width, height);

    // Pixels das letras
    for (let i = 0; i < pixels.length; i++) {
      const px = pixels[i];
      if (px.hit) {
        ctx.fillStyle = px.accent ? COLORS.hitAccent : COLORS.hitWhite;
      } else {
        ctx.fillStyle = px.accent ? COLORS.pixelAccent : COLORS.pixelWhite;
      }
      ctx.fillRect(px.x, px.y, px.size, px.size);
    }

    if (prefersReduced) return;

    // Paddles
    ctx.fillStyle = COLORS.paddle;
    for (let i = 0; i < paddles.length; i++) {
      const p = paddles[i];
      ctx.fillRect(p.x, p.y, p.width, p.height);
    }

    // Bolinha com brilho vermelho VL Tech
    ctx.save();
    ctx.shadowColor = 'rgba(255, 30, 38, 0.9)';
    ctx.shadowBlur = 14;
    ctx.fillStyle = COLORS.ball;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function loop(now) {
    if (!isVisible) {
      rafId = null;
      return;
    }
    const dt = Math.min((now - lastTime) / 16.67, 2.2);
    lastTime = now;

    update(dt);
    draw();
    rafId = requestAnimationFrame(loop);
  }

  buildGame();

  // Clique no canvas reseta os pixels e lança a bolinha do ponto clicado
  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    ball.x = e.clientX - rect.left;
    ball.y = e.clientY - rect.top;
    for (let i = 0; i < pixels.length; i++) pixels[i].hit = false;
    hitCount = 0;
    if (prefersReduced) draw();
  });

  let resizeTimer = null;
  const onResize = () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(buildGame, 120);
  };
  window.addEventListener('resize', onResize, { passive: true });

  let observer = null;
  if (!prefersReduced && 'IntersectionObserver' in window) {
    observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible && !rafId) {
          lastTime = performance.now();
          rafId = requestAnimationFrame(loop);
        }
      },
      { rootMargin: '120px' }
    );
    observer.observe(canvas);
  } else if (!prefersReduced) {
    isVisible = true;
    rafId = requestAnimationFrame(loop);
  }

  return {
    destroy() {
      if (rafId) cancelAnimationFrame(rafId);
      if (observer) observer.disconnect();
      window.removeEventListener('resize', onResize);
    },
  };
}
