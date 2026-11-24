/* ==========================================================================
   PRODUTOS VL TECH — 3D WORKS WHEEL (ADAPTADO DA 21st.dev)
   - Catálogo 3D interativo dos 8 produtos / soluções que a VL Tech oferece
   - AUTO-START: assim que a seção entra na viewport, o anel 360° de "PRODUTOS"
     abre automaticamente no tambor 3D curvo e percorre os produtos em ritmo
     fluido (com pausa automática em hover/interação e botão Play/Pause)
   - CONEXÃO COM AS SEÇÕES DA PÁGINA:
       · Cada produto tem link direto para a seção correspondente (#hero,
         #responsividade, #automacao, #diferenciais, #socios-scrolly)
       · Produtos de Automação (#automacao) também selecionam automaticamente
         o modo correspondente no Robô 3D (instagram / whatsapp / crm / backoffice)!
   - Performance 60/120fps: idle sleep real + pausa via IntersectionObserver
     e document.visibilitychange
   ========================================================================== */

import { playClick, playHover } from './sound.js';

const PRODUCT_ITEMS = [
  {
    id: '01',
    title: 'LANDING PAGES 3D',
    telemetry: 'CONVERSÃO // WEBGL',
    tag: 'DESIGN AWWWARDS',
    metric: '5–12 DIAS',
    glyph: '3D',
    desc: 'Páginas editoriais de alta conversão com Three.js, GSAP 60/120fps e foco em vendas.',
    targetSection: '#hero',
    ctaLabel: 'Ver experiência 3D',
    robotMode: null,
    featured: false,
  },
  {
    id: '02',
    title: 'SITES 4K & MOBILE',
    telemetry: 'MULTIDISPOSITIVOS',
    tag: 'RESPONSIVO REAL',
    metric: '99+ SPEED',
    glyph: '4K',
    desc: 'Sites institucionais e vitrines otimizadas tanto para monitores 4K quanto para smartphones.',
    targetSection: '#responsividade',
    ctaLabel: 'Ver vitrine de telas',
    robotMode: null,
    featured: false,
  },
  {
    id: '03',
    title: 'AUTOMAÇÃO INSTAGRAM',
    telemetry: 'AGENTE // IG GRAPH',
    tag: 'DMs & COMENTÁRIOS',
    metric: '1.4s DM',
    glyph: 'IG',
    desc: 'Robô 24/7 que responde Directs, comentários em Reels/posts e envia catálogos na hora.',
    targetSection: '#automacao',
    ctaLabel: 'Testar Robô no Insta',
    robotMode: 'instagram',
    featured: false,
  },
  {
    id: '04',
    title: 'AGENTE IA WHATSAPP',
    telemetry: 'API OFICIAL // META',
    tag: 'VENDAS 24/7',
    metric: '< 2s IA',
    glyph: 'WA',
    desc: 'Atendimento humanizado na API oficial que qualifica leads, envia propostas e agenda reuniões.',
    targetSection: '#automacao',
    ctaLabel: 'Testar WhatsApp IA',
    robotMode: 'whatsapp',
    featured: false,
  },
  {
    id: '05',
    title: 'CRM & FUNIL DE LEADS',
    telemetry: 'WEBHOOKS // REAL-TIME',
    tag: 'ZERO LEAD PERDIDO',
    metric: '100% SYNC',
    glyph: 'CRM',
    desc: 'Integração entre site, Meta/Google Ads, HubSpot, RD Station, Pipedrive e pagamentos.',
    targetSection: '#automacao',
    ctaLabel: 'Testar Modo CRM',
    robotMode: 'crm',
    featured: false,
  },
  {
    id: '06',
    title: 'BACKOFFICE & FLUXOS IA',
    telemetry: 'CLOUD // AUTÔNOMO',
    tag: 'PILOTO AUTOMÁTICO',
    metric: '-80% MANUAL',
    glyph: 'IA',
    desc: 'Emissão automática de contratos, notas fiscais e relatórios diários direto no WhatsApp.',
    targetSection: '#automacao',
    ctaLabel: 'Testar Backoffice IA',
    robotMode: 'backoffice',
    featured: false,
  },
  {
    id: '07',
    title: 'SISTEMAS WEB & SAAS',
    telemetry: 'ENGENHARIA // FULL-STACK',
    tag: 'CÓDIGO PROPRIETÁRIO',
    metric: '99.98% UP',
    glyph: 'SYS',
    desc: 'Plataformas corporativas, dashboards, APIs rápidas e infraestrutura Edge escalável.',
    targetSection: '#diferenciais',
    ctaLabel: 'Ver diferenciais',
    robotMode: null,
    featured: false,
  },
  {
    id: '08',
    title: 'SQUAD DEDICADO VL TECH',
    telemetry: 'DIRETO COM OS SÓCIOS',
    tag: 'LUIZ + VICTOR',
    metric: 'ELITE TEAM',
    glyph: 'VL',
    desc: 'Evolução contínua de produto liderada diretamente pelos co-fundadores sem intermediários.',
    targetSection: '#socios-scrolly',
    ctaLabel: 'Conhecer os sócios',
    robotMode: null,
    featured: true,
  },
];

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
const AUTO_OPEN_DELAY = 650;
const AUTO_CYCLE_MS = 3800;

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

/**
 * Navega até a seção vinculada ao produto. Se for um produto de Automação,
 * abre direto no palco do Robô 3D já com o modo correspondente ativado!
 */
function navigateToProductSection(item) {
  if (!item?.targetSection) return;
  try { playClick(); } catch (_) {}

  if (item.targetSection === '#automacao') {
    if (item.robotMode && window.app?.automacaoRobot?.setMode) {
      window.app.automacaoRobot.setMode(item.robotMode, true);
    }
    const autoSec = document.getElementById('automacao');
    if (autoSec) {
      const top = autoSec.getBoundingClientRect().top + window.scrollY + window.innerHeight * 0.65;
      window.scrollTo({ top: Math.round(top), behavior: 'smooth' });
      return;
    }
  }

  const targetEl = document.querySelector(item.targetSection);
  if (targetEl) {
    targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

export function initPartnersTech() {
  const section = document.getElementById('produtos') || document.getElementById('parceiros');
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
  const activeCta = section.querySelector('#wheelActiveCta');
  const activeCtaLabel = section.querySelector('#wheelActiveCtaLabel');
  const indexButtons = Array.from(section.querySelectorAll('.wheel-index-btn[data-turn]'));
  const prevBtn = section.querySelector('#wheelPrevBtn');
  const nextBtn = section.querySelector('#wheelNextBtn');
  const playPauseBtn = section.querySelector('#wheelPlayPauseBtn');
  const playPauseIcon = section.querySelector('#wheelPlayPauseIcon');
  const ringResetBtn = section.querySelector('#wheelRingBtn');

  if (!stage || !pivot || !cards.length) return null;

  const count = cards.length;
  const last = Math.max(count - 1, 0);
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let turn = 0;
  let target = 0;
  let active = 0;
  let hasAutoOpened = false;
  let userPaused = prefersReduced;
  let isHoveringControls = false;
  let autoOpenTimer = null;
  let autoCycleTimer = null;

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
    const item = PRODUCT_ITEMS[idx];
    if (!item) return;

    if (activeKicker) activeKicker.textContent = `${item.id} // ${item.telemetry}`;
    if (activeTitle) activeTitle.textContent = item.title;
    if (activeMetric) activeMetric.textContent = `${item.tag} · ${item.metric}`;
    if (activeCta) activeCta.href = item.targetSection;
    if (activeCtaLabel) activeCtaLabel.textContent = item.ctaLabel;

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

  function updatePlayPauseUI() {
    if (!playPauseBtn) return;
    playPauseBtn.setAttribute('aria-pressed', userPaused ? 'true' : 'false');
    playPauseBtn.setAttribute('aria-label', userPaused ? 'Retomar rotação automática' : 'Pausar rotação automática');
    if (playPauseIcon) playPauseIcon.textContent = userPaused ? '▶' : '❚❚';
  }

  function stopAutoTimers() {
    clearTimeout(autoOpenTimer);
    clearInterval(autoCycleTimer);
    autoOpenTimer = null;
    autoCycleTimer = null;
  }

  function startAutoCycle() {
    stopAutoTimers();
    if (userPaused || prefersReduced || !isVisible || document.hidden) return;

    // Se ainda está no anel inicial (0), abre automaticamente para o produto 01!
    if (!hasAutoOpened && target < 0.5) {
      autoOpenTimer = setTimeout(() => {
        if (!isVisible || document.hidden || userPaused) return;
        hasAutoOpened = true;
        to(1, false);
        startAutoCycle();
      }, AUTO_OPEN_DELAY);
      return;
    }

    autoCycleTimer = setInterval(() => {
      if (!isVisible || document.hidden || userPaused || isHoveringControls) return;
      const current = Math.round(target);
      const next = current >= last + 1 || current < 1 ? 1 : current + 1;
      to(next, false);
    }, AUTO_CYCLE_MS);
  }

  function pauseAutoTemporarily() {
    if (userPaused) return;
    stopAutoTimers();
    startAutoCycle();
  }

  // Loop de renderização com IDLE SLEEP automático
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
    if (activeReadout) {
      activeReadout.style.opacity = String(m.toFixed(3));
      activeReadout.style.pointerEvents = m > 0.65 ? 'auto' : 'none';
    }

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
    if (next > 0 && next < last + 1) {
      event.preventDefault();
    }
    hasAutoOpened = true;
    to(next);
    pauseAutoTemporarily();
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
    hasAutoOpened = true;
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
    pauseAutoTemporarily();
  };
  stage.addEventListener('pointerup', endDrag);
  stage.addEventListener('pointercancel', endDrag);

  // Pausa suave enquanto o usuário passa o mouse sobre o índice ou readout
  const setHoverPause = (flag) => {
    isHoveringControls = flag;
  };
  activeReadout?.addEventListener('mouseenter', () => setHoverPause(true));
  activeReadout?.addEventListener('mouseleave', () => setHoverPause(false));

  // Clique no card: se ainda não é o ativo, traz à frente; se já é o ativo, navega à seção!
  cards.forEach((card, idx) => {
    card.addEventListener('click', (e) => {
      if (dragMoved) return;
      if (e.target.closest('.wheel-card__link')) {
        e.preventDefault();
        navigateToProductSection(PRODUCT_ITEMS[idx]);
        return;
      }
      hasAutoOpened = true;
      if (Math.round(target) === idx + 1) {
        navigateToProductSection(PRODUCT_ITEMS[idx]);
      } else {
        to(idx + 1, true);
        pauseAutoTemporarily();
      }
    });
  });

  // Botão CTA principal do painel editorial esquerdo
  activeCta?.addEventListener('click', (e) => {
    e.preventDefault();
    navigateToProductSection(PRODUCT_ITEMS[active]);
  });

  // Botões do índice à direita
  indexButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      hasAutoOpened = true;
      to(Number(btn.dataset.turn), true);
      pauseAutoTemporarily();
    });
    btn.addEventListener('mouseenter', () => {
      setHoverPause(true);
      try { playHover(); } catch (_) {}
    });
    btn.addEventListener('mouseleave', () => setHoverPause(false));
  });

  ringResetBtn?.addEventListener('click', () => {
    userPaused = true;
    updatePlayPauseUI();
    stopAutoTimers();
    to(0, true);
  });

  prevBtn?.addEventListener('click', () => {
    hasAutoOpened = true;
    const current = Math.round(target);
    to(current <= 1 ? last + 1 : current - 1, true);
    pauseAutoTemporarily();
  });

  nextBtn?.addEventListener('click', () => {
    hasAutoOpened = true;
    const current = Math.round(target);
    to(current >= last + 1 || current < 1 ? 1 : current + 1, true);
    pauseAutoTemporarily();
  });

  playPauseBtn?.addEventListener('click', () => {
    userPaused = !userPaused;
    try { playClick(); } catch (_) {}
    updatePlayPauseUI();
    if (userPaused) {
      stopAutoTimers();
    } else {
      hasAutoOpened = true;
      if (target < 0.5) to(1, false);
      startAutoCycle();
    }
  });

  stage.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      hasAutoOpened = true;
      to(Math.round(target) + 1, true);
      pauseAutoTemporarily();
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      hasAutoOpened = true;
      to(Math.round(target) - 1, true);
      pauseAutoTemporarily();
    } else if (e.key === 'Escape') {
      to(0, true);
    }
  });

  computeMetrics();
  updateActiveReadout(0);
  updatePlayPauseUI();

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
        if (isVisible) {
          if (Math.abs(target - turn) >= 0.0005) startLoop();
          startAutoCycle();
        } else {
          stopAutoTimers();
        }
      },
      { rootMargin: '0px', threshold: 0.25 }
    );
    io.observe(section);
  } else {
    isVisible = true;
    startAutoCycle();
  }

  const onVisibilityChange = () => {
    if (document.hidden) {
      stopAutoTimers();
    } else if (isVisible) {
      if (Math.abs(target - turn) >= 0.0005) startLoop();
      startAutoCycle();
    }
  };
  document.addEventListener('visibilitychange', onVisibilityChange);

  renderFrame();

  return {
    to,
    destroy() {
      if (rafId) cancelAnimationFrame(rafId);
      clearTimeout(settleTimer);
      stopAutoTimers();
      ro?.disconnect();
      io?.disconnect();
      stage.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    },
  };
}
