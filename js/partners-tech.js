/* ==========================================================================
   PARCEIROS & TECNOLOGIAS — 3D WORKS WHEEL (ADAPTADO DA 21st.dev)
   - Estado 0: Todos os 8 cards em anel 3D ao redor de "STACK VL TECH"
   - Estado 1..8: O primeiro giro de scroll/arrasto abre o anel em um tambor
     vertical 3D curvado para a esquerda (BOW), trazendo cada tecnologia ao
     centro frontal em tamanho real com leitura editorial e índice lateral.
   - Zero travamento de scroll: ao atingir 0 (topo) ou fim (8), o scroll
     continua livremente para a seção anterior/próxima!
   ========================================================================== */

import { playClick, playHover } from './sound.js';

const TECH_ITEMS = [
  {
    id: '01',
    title: 'NODE.JS & GO',
    telemetry: 'ONLINE // RUNTIME',
    tag: 'REST & gRPC API',
    metric: '< 10ms',
    glyph: 'GO',
    desc: 'Microsserviços de ultra-baixa latência & concorrência massiva.',
    featured: false,
  },
  {
    id: '02',
    title: 'AMAZON AWS',
    telemetry: 'CLOUD // MULTI-AZ',
    tag: 'INFRA AS CODE',
    metric: '99.99%',
    glyph: 'AWS',
    desc: 'Infraestrutura elástica, Lambda Serverless & CloudFront Edge.',
    featured: false,
  },
  {
    id: '03',
    title: 'THREE.JS & WEBGL',
    telemetry: 'GRAPHICS // GPU',
    tag: 'HARDWARE ACCEL',
    metric: '60 FPS',
    glyph: '3D',
    desc: 'Cenas tridimensionais imersivas, Shaders GLSL & 60 FPS fluidos.',
    featured: false,
  },
  {
    id: '04',
    title: 'GOOGLE CLOUD',
    telemetry: 'EDGE // GLOBAL CDN',
    tag: 'ENTERPRISE CLOUD',
    metric: 'GLOBAL',
    glyph: 'GCP',
    desc: 'Kubernetes GKE, BigQuery Analytics & inteligência artificial em nuvem.',
    featured: false,
  },
  {
    id: '05',
    title: 'DOCKER & K8S',
    telemetry: 'DEVOPS // CI/CD',
    tag: 'ORCHESTRATION',
    metric: 'AUTO-SCALE',
    glyph: 'K8S',
    desc: 'Conteinerização isolada, autoscaling instantâneo & zero downtime deploy.',
    featured: false,
  },
  {
    id: '06',
    title: 'TYPESCRIPT',
    telemetry: 'TYPE-SAFE // ARCHITECTURE',
    tag: 'STRICT COMPLIANCE',
    metric: '100% TYPED',
    glyph: 'TS',
    desc: 'Segurança estática de tipagem eliminando 99% dos erros em tempo de execução.',
    featured: false,
  },
  {
    id: '07',
    title: 'POSTGRESQL & REDIS',
    telemetry: 'DATABASE // CACHE',
    tag: 'IN-MEMORY CACHE',
    metric: '< 1ms',
    glyph: 'SQL',
    desc: 'Bancos relacionais robustos ACID somados a cache em memória sub-milissegundo.',
    featured: false,
  },
  {
    id: '08',
    title: 'VL TECH CLOUD',
    telemetry: 'PROPRIETARY // CORE',
    tag: 'EDGE ENGINE',
    metric: 'ZERO LATENCY',
    glyph: 'VL',
    desc: 'Plataforma própria de orquestração de borda com caching adaptativo e segurança militar.',
    featured: true,
  },
];

// Geometria fiel ao WorksWheel (21st.dev), calibrada para zero corte nas bordas
const CARD_H = 0.36;
const CARD_MAX_W = 0.36;
const CARD_RATIO = 1.48;
const STEP = 40;
const DRUM = 2.22;
const LENS = 2.7;
const RING_R = 0.96;
const BOW = 1.82;
const TITLE_SCALE = 0.14;
const CULL = 1.6;

const WHEEL_UNITS = 760;
const DRAG_UNITS = 380;
const SETTLE = 140;
const EASE = 0.12;

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const lerp = (a, b, t) => a + (b - a) * t;
const rad = (deg) => (deg * Math.PI) / 180;
const bowAt = (drumDeg, bow) => -bow * (1 - Math.cos(rad(drumDeg)));

function place(ringDeg, drumDeg, ringR, drumR, bow, m) {
  return (
    `translateX(${(m * bowAt(drumDeg, bow)).toFixed(2)}px)` +
    ` rotateZ(${((1 - m) * ringDeg).toFixed(2)}deg)` +
    ` translateY(${(-(1 - m) * ringR).toFixed(2)}px)` +
    ` rotateX(${(m * drumDeg).toFixed(2)}deg)` +
    ` translateZ(${(m * drumR).toFixed(2)}px)`
  );
}

export function initPartnersTech() {
  const section = document.getElementById('parceiros');
  if (!section) return null;

  const stage = section.querySelector('#partnersWheelStage');
  const pivot = section.querySelector('#partnersWheelPivot');
  const cards = Array.from(section.querySelectorAll('.wheel-card'));
  const topBadge = section.querySelector('.wheel-top-badge');
  const ringLabel = section.querySelector('#wheelRingLabel');
  const ringLabelTitle = section.querySelector('#wheelRingLabelTitle');
  const activeReadout = section.querySelector('#wheelActiveReadout');
  const activeKicker = section.querySelector('#wheelActiveKicker');
  const activeTitle = section.querySelector('#wheelActiveTitle');
  const activeMetric = section.querySelector('#wheelActiveMetric');
  const indexButtons = Array.from(section.querySelectorAll('.wheel-index-btn[data-turn]'));
  const prevBtn = section.querySelector('#wheelPrevBtn');
  const nextBtn = section.querySelector('#wheelNextBtn');
  const ringResetBtn = section.querySelector('#wheelRingBtn');

  if (!stage || !pivot || !cards.length) return null;

  const count = cards.length;
  const last = Math.max(count - 1, 0);
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let turn = 0;
  let target = 0;
  let active = 0;
  let metrics = {
    cardW: 320,
    cardH: 216,
    ringR: 246,
    ringScale: 0.42,
    drumR: 480,
    bow: 393,
    depth: 583,
    titleSize: 30,
  };

  function computeMetrics() {
    const w = stage.clientWidth || window.innerWidth;
    const h = stage.clientHeight || window.innerHeight;
    const isNarrow = w < 760;
    const cardMaxW = isNarrow ? 0.68 : CARD_MAX_W;
    const cardW = Math.min(h * CARD_H * CARD_RATIO, w * cardMaxW);
    const cardH = cardW / CARD_RATIO;
    const drumR = cardH * DRUM;
    // Garante que todos os 8 cards do anel fiquem 100% visíveis sem cortar topo/base
    const maxRingR = Math.min(h * 0.305, w * (isNarrow ? 0.30 : 0.245));
    const ringR = Math.min(cardH * (isNarrow ? 0.88 : RING_R), maxRingR);
    const ringScale = clamp((((2 * Math.PI * ringR) / count) * 0.84) / (cardW || 1), 0.3, 0.72);

    metrics = {
      cardW,
      cardH,
      ringR,
      ringScale,
      drumR,
      bow: cardH * (isNarrow ? 0.55 : BOW),
      depth: cardH * LENS,
      titleSize: Math.max(22, Math.min(44, cardH * TITLE_SCALE)),
    };

    stage.style.perspective = `${metrics.depth.toFixed(1)}px`;

    cards.forEach((card) => {
      card.style.width = `${metrics.cardW.toFixed(1)}px`;
      card.style.height = `${metrics.cardH.toFixed(1)}px`;
      card.style.marginLeft = `${(-metrics.cardW / 2).toFixed(1)}px`;
      card.style.marginTop = `${(-metrics.cardH / 2).toFixed(1)}px`;
    });

    if (ringLabelTitle) {
      ringLabelTitle.style.fontSize = `${metrics.titleSize.toFixed(1)}px`;
    }
    if (activeTitle) {
      activeTitle.style.fontSize = `${(metrics.titleSize * 0.92).toFixed(1)}px`;
    }
  }

  function updateActiveReadout(idx) {
    const item = TECH_ITEMS[idx];
    if (!item) return;

    if (activeKicker) activeKicker.textContent = `${item.id} // ${item.telemetry}`;
    if (activeTitle) activeTitle.textContent = item.title;
    if (activeMetric) activeMetric.textContent = `${item.tag} · ${item.metric}`;

    cards.forEach((card, i) => {
      const isCurrent = i === idx;
      card.classList.toggle('is-active', isCurrent);
      card.setAttribute('aria-selected', isCurrent ? 'true' : 'false');
    });

    indexButtons.forEach((btn) => {
      const turnVal = Number(btn.dataset.turn);
      btn.classList.toggle('is-active', turnVal === idx + 1 && target >= 0.5);
    });

    stage.setAttribute('aria-activedescendant', `partners-wheel-card-${idx}`);
  }

  function to(next, withSound = false) {
    const clamped = clamp(next, 0, last + 1);
    if (withSound && Math.round(clamped) !== Math.round(target)) {
      try { playClick(); } catch (_) {}
    }
    target = clamped;
    startLoop();
  }

  // Loop de renderização com IDLE SLEEP automático (0% CPU quando assentado ou fora da tela!)
  let rafId = null;
  let isVisible = false;
  const cardState = cards.map(() => ({ opacity: '', zIndex: '' }));

  function renderFrame() {
    const gap = target - turn;
    let settled = false;
    if (Math.abs(gap) < 0.0005) {
      turn = target;
      settled = true;
    } else {
      turn += gap * (prefersReduced ? 1 : EASE);
    }

    const t = turn;
    const m = clamp(t, 0, 1);
    const pos = Math.max(0, t - 1);
    const { ringR, ringScale, drumR, bow } = metrics;

    pivot.style.transform = `translateZ(${(-m * drumR).toFixed(2)}px)`;

    const faceScale = `scale(${lerp(ringScale, 1, m).toFixed(4)})`;

    for (let i = 0; i < count; i++) {
      const d = i - pos;
      const drumDeg = d * STEP;
      const card = cards[i];

      card.style.transform = place(d * (360 / count), drumDeg, ringR, drumR, bow, m);

      const nextOpacity = m > 0.5 && Math.abs(d) > CULL ? '0' : '1';
      if (cardState[i].opacity !== nextOpacity) {
        cardState[i].opacity = nextOpacity;
        card.style.opacity = nextOpacity;
      }

      const nextZ = String(Math.round(100 - Math.abs(d) * 2));
      if (cardState[i].zIndex !== nextZ) {
        cardState[i].zIndex = nextZ;
        card.style.zIndex = nextZ;
      }

      const face = card.firstElementChild;
      if (face) {
        face.style.transform = faceScale;
      }
    }

    if (ringLabel) ringLabel.style.opacity = String((1 - m).toFixed(3));
    if (topBadge) topBadge.style.opacity = String(clamp(1 - m * 1.4, 0, 1).toFixed(3));
    if (activeReadout) activeReadout.style.opacity = String(m.toFixed(3));

    const near = clamp(Math.round(pos), 0, last);
    if (near !== active || (m < 0.15 && indexButtons.some((b) => b.classList.contains('is-active')))) {
      active = near;
      updateActiveReadout(active);
    }

    return settled;
  }

  function draw() {
    if (!isVisible || document.hidden) {
      rafId = null;
      return;
    }
    const settled = renderFrame();
    if (settled) {
      rafId = null;
      return;
    }
    rafId = requestAnimationFrame(draw);
  }

  function startLoop() {
    if (!rafId && isVisible && !document.hidden) {
      rafId = requestAnimationFrame(draw);
    }
  }

  // Wheel nativo (não prende o scroll nas extremidades!)
  let settleTimer = null;
  const onWheel = (event) => {
    const next = target + event.deltaY / WHEEL_UNITS;
    // Só intercepta o scroll enquanto a roda ainda tem espaço para girar
    if (next > 0 && next < last + 1) {
      event.preventDefault();
    }
    to(next);
    clearTimeout(settleTimer);
    settleTimer = setTimeout(() => {
      to(Math.round(target));
    }, SETTLE);
  };
  stage.addEventListener('wheel', onWheel, { passive: false });

  // Arrasto vertical com ponteiro
  let dragY = null;
  let dragMoved = false;

  stage.addEventListener('pointerdown', (e) => {
    if (e.target.closest('button, a')) return;
    dragY = e.clientY;
    dragMoved = false;
    stage.classList.add('is-dragging');
    stage.setPointerCapture?.(e.pointerId);
  });

  stage.addEventListener('pointermove', (e) => {
    if (dragY === null) return;
    const dy = dragY - e.clientY;
    if (Math.abs(dy) > 4) dragMoved = true;
    to(target + dy / DRAG_UNITS);
    dragY = e.clientY;
  });

  const endDrag = () => {
    if (dragY === null) return;
    dragY = null;
    stage.classList.remove('is-dragging');
    if (target > 0.4) {
      to(Math.round(target));
    } else {
      to(0);
    }
  };
  stage.addEventListener('pointerup', endDrag);
  stage.addEventListener('pointercancel', endDrag);

  // Clique direto em qualquer card leva ele para a frente do tambor
  cards.forEach((card, idx) => {
    card.addEventListener('click', () => {
      if (dragMoved) return;
      to(idx + 1, true);
    });
  });

  // Botões do índice à direita
  indexButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const dest = Number(btn.dataset.turn);
      to(dest, true);
    });
    btn.addEventListener('mouseenter', () => {
      try { playHover(); } catch (_) {}
    });
  });

  ringResetBtn?.addEventListener('click', () => to(0, true));

  prevBtn?.addEventListener('click', () => {
    const current = Math.round(target);
    to(current <= 0 ? last + 1 : current - 1, true);
  });

  nextBtn?.addEventListener('click', () => {
    const current = Math.round(target);
    to(current >= last + 1 ? 0 : current + 1, true);
  });

  // Teclado
  stage.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      to(Math.round(target) + 1, true);
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      to(Math.round(target) - 1, true);
    } else if (e.key === 'Escape') {
      to(0, true);
    }
  });

  // ResizeObserver & IntersectionObserver
  computeMetrics();
  updateActiveReadout(0);

  let ro = null;
  if ('ResizeObserver' in window) {
    ro = new ResizeObserver(() => {
      computeMetrics();
      renderFrame();
    });
    ro.observe(stage);
  }
  const onResize = () => {
    computeMetrics();
    renderFrame();
  };
  window.addEventListener('resize', onResize, { passive: true });

  let io = null;
  if ('IntersectionObserver' in window) {
    io = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible && Math.abs(target - turn) >= 0.0005) startLoop();
      },
      { rootMargin: '140px' }
    );
    io.observe(section);
  } else {
    isVisible = true;
  }

  const onVisibilityChange = () => {
    if (!document.hidden && isVisible && Math.abs(target - turn) >= 0.0005) {
      startLoop();
    }
  };
  document.addEventListener('visibilitychange', onVisibilityChange);

  // Renderiza o anel inicial imediatamente (e fica em idle 0% CPU!)
  renderFrame();

  return {
    to,
    destroy() {
      if (rafId) cancelAnimationFrame(rafId);
      clearTimeout(settleTimer);
      ro?.disconnect();
      io?.disconnect();
      stage.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    },
  };
}
