/* ==========================================================================
   SOUND FX — Sistema de Efeitos Sonoros Interativos via Web Audio API
   - Sintetizador de áudio nativo (sem dependência de arquivos externos)
   - Micro-sons elegantes: hover, click, menu open/close, toggle FX
   - Persistência no localStorage ('vltech_sound_fx')
   - Botão interativo FX ON / FX OFF integrado ao cabeçalho
   ========================================================================== */

let audioCtx = null;
let isEnabled = true;
let lastHoverTime = 0;

/**
 * Obtém ou inicializa o contexto de áudio sob demanda
 */
function getContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function isSoundEnabled() {
  return isEnabled;
}

/**
 * Micro-som sutil de hover em links e botões (blip suave em alta frequência)
 */
export function playHover() {
  if (!isEnabled) return;
  const now = performance.now();
  if (now - lastHoverTime < 45) return; // Debounce para evitar sobreposição rápida
  lastHoverTime = now;

  try {
    const ctx = getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const startTime = ctx.currentTime;
    osc.frequency.setValueAtTime(1550, startTime);
    osc.frequency.exponentialRampToValueAtTime(1200, startTime + 0.025);

    gain.gain.setValueAtTime(0.018, startTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.028);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + 0.03);
  } catch (err) {
    // Falha silenciosa em navegadores com restrições
  }
}

/**
 * Micro-som tátil de clique de botão (click switch orgânico)
 */
export function playClick() {
  if (!isEnabled) return;
  try {
    const ctx = getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    const startTime = ctx.currentTime;
    osc.frequency.setValueAtTime(720, startTime);
    osc.frequency.exponentialRampToValueAtTime(200, startTime + 0.038);

    gain.gain.setValueAtTime(0.05, startTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + 0.045);
  } catch (err) {}
}

/**
 * Som harmônico suave para abertura do Menu Overlay
 */
export function playMenuOpen() {
  if (!isEnabled) return;
  try {
    const ctx = getContext();
    if (!ctx) return;

    const startTime = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(440, startTime);
    osc1.frequency.exponentialRampToValueAtTime(660, startTime + 0.14);
    gain1.gain.setValueAtTime(0.035, startTime);
    gain1.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.15);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(660, startTime);
    osc2.frequency.exponentialRampToValueAtTime(990, startTime + 0.14);
    gain2.gain.setValueAtTime(0.025, startTime);
    gain2.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.15);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);

    osc1.start(startTime);
    osc2.start(startTime);
    osc1.stop(startTime + 0.16);
    osc2.stop(startTime + 0.16);
  } catch (err) {}
}

/**
 * Som descendente suave para fechamento do Menu Overlay
 */
export function playMenuClose() {
  if (!isEnabled) return;
  try {
    const ctx = getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const startTime = ctx.currentTime;
    osc.frequency.setValueAtTime(600, startTime);
    osc.frequency.exponentialRampToValueAtTime(320, startTime + 0.11);

    gain.gain.setValueAtTime(0.03, startTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.11);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + 0.12);
  } catch (err) {}
}

/**
 * Som de confirmação ao alternar o FX ON / OFF
 */
export function playToggle(on) {
  try {
    const ctx = getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const startTime = ctx.currentTime;
    if (on) {
      osc.frequency.setValueAtTime(520, startTime);
      osc.frequency.exponentialRampToValueAtTime(880, startTime + 0.08);
    } else {
      osc.frequency.setValueAtTime(440, startTime);
      osc.frequency.exponentialRampToValueAtTime(260, startTime + 0.08);
    }

    gain.gain.setValueAtTime(0.045, startTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.09);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + 0.1);
  } catch (err) {}
}

/**
 * Efeito sonoro cinemático de ignição / glow neon (quando o 'V' vermelho acende)
 */
export function playIgnite() {
  if (!isEnabled) return;
  try {
    const ctx = getContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.exponentialRampToValueAtTime(780, now + 0.18);
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.038, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.24);
  } catch (err) {}
}

/**
 * Efeito sonoro cinemático suave de transição entre palcos (swoosh de frequência)
 */
export function playSwoosh() {
  if (!isEnabled) return;
  try {
    const ctx = getContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.15);
    gain.gain.setValueAtTime(0.03, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.17);
  } catch (err) {}
}

/**
 * Inicializa o módulo de efeitos sonoros e liga aos elementos da interface
 */
export function initSound() {
  // Carrega preferência persistida
  const saved = localStorage.getItem('vltech_sound_fx');
  isEnabled = saved !== 'false';

  const toggleBtn = document.getElementById('fxToggleBtn');
  const statusText = document.getElementById('fxStatusText');

  function updateButtonUI() {
    if (!toggleBtn) return;
    toggleBtn.setAttribute('aria-pressed', String(isEnabled));
    toggleBtn.classList.toggle('is-muted', !isEnabled);
    toggleBtn.classList.toggle('is-active', isEnabled);
    if (statusText) {
      statusText.textContent = isEnabled ? 'FX ON' : 'FX OFF';
    }
  }

  updateButtonUI();

  if (toggleBtn) {
    toggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      getContext();
      isEnabled = !isEnabled;
      localStorage.setItem('vltech_sound_fx', String(isEnabled));
      updateButtonUI();
      playToggle(isEnabled);
    });
  }

  // Desbloqueia o AudioContext na primeira interação do usuário
  const unlockAudio = () => {
    getContext();
    window.removeEventListener('pointerdown', unlockAudio);
    window.removeEventListener('keydown', unlockAudio);
  };
  window.addEventListener('pointerdown', unlockAudio, { once: true });
  window.addEventListener('keydown', unlockAudio, { once: true });

  // Vincula hover suave em elementos clicáveis
  document.addEventListener('mouseover', (e) => {
    const target = e.target.closest('a, button, .menu-toggle, .founder-toggle-btn, .portfolio-card-3d, .nav__quick-cta');
    if (target) {
      playHover();
    }
  });

  // Vincula som de clique
  document.addEventListener('click', (e) => {
    const target = e.target.closest('a, button, .founder-toggle-btn, .menu-toggle, .nav__quick-cta');
    if (target && target.id !== 'fxToggleBtn') {
      playClick();
    }
  });

  return {
    playHover,
    playClick,
    playMenuOpen,
    playMenuClose,
    playToggle,
    isSoundEnabled,
  };
}
