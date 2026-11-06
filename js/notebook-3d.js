/* ==========================================================================
   NOTEBOOK 3D & PORTFÓLIO — Sequência Interativa 3D: Fechado para Aberto
   Design: Chassi Unibody de Alumínio Espacial + Logo VL Retroiluminada
   Stack: Three.js WebGL + CSS 3D Perspective + GSAP 3 ScrollTrigger
   
   Fases da Animação:
   1. Estado Inicial: Notebook 100% FECHADO em perspectiva 3D, com a logo
      VL Tech retroiluminada brilhando em vermelho neon no topo da tampa.
   2. Scroll-Driven Opening: A tampa abre suavemente (rotateX: -74deg -> 0deg),
      a logo externa dá lugar à tela interna e o chassi alinha frontalmente.
   3. Boot Sequence: Ao abrir completamente, a tela ativa o boot OS,
      disparando a cascata binária (0 e 1 vermelho) e o preview dos cases reais.
   4. Zoom-in Cinematográfico: A tela expande para preencher a viewport e
      conectar diretamente com os projetos do Hall of Fame.
   ========================================================================== */

import { gsap, ScrollTrigger } from './core/gsap.js';

/**
 * Inicializador da Iluminação Volumétrica e Reflexos via Three.js WebGL
 */
function initNotebookWebGL(canvas) {
  if (!canvas || typeof window.THREE === 'undefined') return null;
  const THREE = window.THREE;

  const stage = canvas.parentElement;
  if (!stage) return null;

  let width = stage.clientWidth || window.innerWidth;
  let height = stage.clientHeight || window.innerHeight;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, width / Math.max(height, 1), 1, 3000);
  camera.position.set(0, 0, 850);

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
  } catch (e) {
    console.warn('[Notebook3D] WebGL não suportado', e);
    return null;
  }

  // Luz Ambiente Metálica
  const ambientLight = new THREE.AmbientLight(0x0e0e14, 1.4);
  scene.add(ambientLight);

  // Luz Vermelha Neon Dinâmica (posicionada sobre a logo da tampa e dobradiça)
  const redPointLight = new THREE.PointLight(0xFF1E26, 3.8, 950);
  redPointLight.position.set(0, -10, 240);
  scene.add(redPointLight);

  // Luz de Borda Especular Superior para Reflexo Metálico
  const rimLight = new THREE.DirectionalLight(0xffffff, 0.85);
  rimLight.position.set(0, 350, 220);
  scene.add(rimLight);

  // Campo de Partículas Cibernéticas Flutuantes
  const particleCount = 55;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  const redColor = new THREE.Color(0xFF1E26);
  const whiteColor = new THREE.Color(0xffffff);

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 850;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 550;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 450;

    const c = Math.random() > 0.45 ? redColor : whiteColor;
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 3.5,
    vertexColors: true,
    transparent: true,
    opacity: 0.65,
    blending: THREE.AdditiveBlending
  });

  const particles = new THREE.Points(geometry, material);
  scene.add(particles);

  let isRendering = false;
  let animId = null;

  function render() {
    if (!isRendering) return;
    particles.rotation.y += 0.0008;
    particles.rotation.x += 0.0004;
    renderer.render(scene, camera);
    animId = requestAnimationFrame(render);
  }

  function resize() {
    if (!stage) return;
    width = stage.clientWidth || window.innerWidth;
    height = stage.clientHeight || window.innerHeight;
    camera.aspect = width / Math.max(height, 1);
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  window.addEventListener('resize', resize, { passive: true });

  return {
    start() {
      if (!isRendering) {
        isRendering = true;
        render();
      }
    },
    stop() {
      isRendering = false;
      if (animId) cancelAnimationFrame(animId);
      animId = null;
    },
    updateLight(progress) {
      // Dinâmica de luz reativa ao scroll: a luz vermelha acompanha a abertura
      redPointLight.position.y = -10 + progress * 130;
      redPointLight.position.z = 240 - progress * 70;
      redPointLight.intensity = 3.5 + Math.sin(progress * Math.PI) * 2.2;
    }
  };
}

export function initNotebook3D() {
  const section = document.getElementById('portfolio-experience');
  const pinViewport = document.getElementById('notebookPinViewport');
  const lid = document.getElementById('notebookLid');
  const lidOuter = document.getElementById('notebookLidOuter');
  const bezel = document.getElementById('notebookBezel');
  const base = document.getElementById('notebookBase');
  const device = document.getElementById('notebookDevice');
  const introHeader = document.getElementById('notebookIntroHeader');
  const hint = document.getElementById('notebookScrollHint');
  const screenInner = document.getElementById('notebookScreenInner');
  const glow = document.getElementById('notebookGlow');

  const matrixOverlay = document.getElementById('screenMatrixOverlay');
  const matrixCanvas = document.getElementById('screenMatrixCanvas');
  const hud = document.getElementById('screenMatrixHud');
  const webglCanvas = document.getElementById('notebookWebglCanvas');

  if (!section || !pinViewport || !lid || !device) return null;

  // Atualização em tempo real do relógio do sistema operacional VL-TECH OS
  const clockEl = document.getElementById('screenOsClock');
  if (clockEl) {
    const updateClock = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      clockEl.textContent = `${h}:${m}`;
    };
    updateClock();
    setInterval(updateClock, 30000);
  }

  // =========================================================================
  // ESTADO INICIAL 3D: NOTEBOOK 100% FECHADO COM LOGO RETROILUMINADA
  // =========================================================================
  // Tampa fechada no ângulo correspondente ao deck base (rotateX: -74deg)
  gsap.set(lid, { rotateX: -74 });

  // Posição do dispositivo: Perspectiva 3D elegante inclinada
  gsap.set(device, {
    xPercent: 0,
    rotateY: -6,
    rotateX: 20,
    scale: 1,
    opacity: 1,
  });

  // Tampa externa visível exibindo a logo VL Tech retroiluminada
  if (lidOuter) {
    gsap.set(lidOuter, { opacity: 1, display: 'flex' });
  }

  // Moldura e tela interna ocultas no estado fechado
  if (bezel) {
    gsap.set(bezel, { opacity: 0 });
  }

  // Overlay de matriz em estado pré-boot
  if (matrixOverlay) {
    gsap.set(matrixOverlay, { opacity: 0.15, display: 'flex' });
  }

  // Brilho ambiente sutil ao fundo
  if (glow) {
    gsap.set(glow, { opacity: 0.35, scale: 0.95 });
  }

  // =========================================================================
  // 1. ILUMINAÇÃO VOLUMÉTRICA THREE.JS WEBGL
  // =========================================================================
  const webgl = initNotebookWebGL(webglCanvas);

  // =========================================================================
  // 2. ANIMAÇÃO DE MATRIZ BINÁRIA (0 E 1) 100% VERMELHO NEON VL TECH
  // =========================================================================
  let matrixAnimationId = null;
  let isScreenVisible = false;

  if (matrixCanvas && matrixOverlay) {
    const ctx = matrixCanvas.getContext('2d');
    const FONT_SIZE = 13;
    const BINARY = ['0', '1'];
    const RED_COLORS = [
      '#FF1E26',
      '#FF2A2A',
      '#FF0033',
      '#FF3B30',
      '#E11D48',
      '#FF4D4D',
      '#FF1122',
      '#FF3344',
      '#D6001C'
    ];

    let width = 0;
    let height = 0;
    let columns = 0;
    let drops = [];
    let speeds = [];
    let colColors = [];

    const resizeScreenCanvas = () => {
      const rect = matrixOverlay.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      if (width === 0 || height === 0) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2) * 1.5;
      matrixCanvas.width = width * dpr;
      matrixCanvas.height = height * dpr;
      ctx.scale(dpr, dpr);

      columns = Math.floor(width / FONT_SIZE) + 1;
      drops = [];
      speeds = [];
      colColors = [];

      for (let i = 0; i < columns; i++) {
        drops[i] = Math.random() * -50;
        speeds[i] = 1.3 + Math.random() * 2.5;
        colColors[i] = RED_COLORS[Math.floor(Math.random() * RED_COLORS.length)];
      }
    };

    const renderScreenMatrix = () => {
      if (!isScreenVisible) {
        matrixAnimationId = null;
        return;
      }

      ctx.fillStyle = 'rgba(8, 8, 12, 0.24)';
      ctx.fillRect(0, 0, width, height);

      ctx.font = `bold ${FONT_SIZE}px "JetBrains Mono", monospace`;
      ctx.textAlign = 'center';

      for (let i = 0; i < columns; i++) {
        const char = BINARY[Math.floor(Math.random() * 2)];
        const x = i * FONT_SIZE + (FONT_SIZE / 2);
        const y = drops[i] * FONT_SIZE;

        if (Math.random() > 0.92) {
          ctx.fillStyle = '#FF7B80';
        } else {
          ctx.fillStyle = colColors[i];
        }

        ctx.fillText(char, x, y);

        if (y > height && Math.random() > 0.96) {
          drops[i] = 0;
          speeds[i] = 1.3 + Math.random() * 2.5;
        }

        drops[i] += speeds[i];
      }

      matrixAnimationId = requestAnimationFrame(renderScreenMatrix);
    };

    resizeScreenCanvas();
    window.addEventListener('resize', resizeScreenCanvas, { passive: true });

    // Observador de interseção para economizar 100% de GPU quando fora da tela
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          isScreenVisible = true;
          if (webgl) webgl.start();
          if (!matrixAnimationId) {
            matrixAnimationId = requestAnimationFrame(renderScreenMatrix);
          }
        } else {
          isScreenVisible = false;
          if (webgl) webgl.stop();
        }
      });
    }, { rootMargin: '100px' });

    sectionObserver.observe(section);
  }

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    gsap.set(lid, { rotateX: 0 });
    gsap.set(device, { rotateX: 0, rotateY: 0 });
    if (lidOuter) gsap.set(lidOuter, { opacity: 0 });
    if (bezel) gsap.set(bezel, { opacity: 1 });
    if (matrixOverlay) gsap.set(matrixOverlay, { opacity: 1 });
    return null;
  }

  // =========================================================================
  // 3. SEQUÊNCIA SCROLL-DRIVEN COM GSAP SCROLLTRIGGER (PINNING)
  // Abertura fluida da tampa -> Ativação do Boot -> Zoom-in nos Cases
  // =========================================================================
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: '+=1500',
      pin: pinViewport,
      pinSpacing: true,
      scrub: 0.8,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        if (webgl) {
          webgl.updateLight(self.progress);
        }
      }
    }
  });

  // -------------------------------------------------------------------------
  // FASE 1 (Progress 0.00 -> 0.45): ABERTURA DA TAMPA DO NOTEBOOK
  // Conecta a rotação da tampa diretamente ao scroll do mouse
  // -------------------------------------------------------------------------
  // Dica de rolagem desaparece logo no início
  tl.to(hint, {
    opacity: 0,
    y: 12,
    duration: 0.15,
    ease: 'power2.in',
  }, 0);

  // O dispositivo alinha de 3D inclinado para o centro frontal
  tl.to(device, {
    rotateX: 0,
    rotateY: 0,
    duration: 0.45,
    ease: 'power2.out',
  }, 0);

  // A tampa (lid) abre suavemente de -74deg (fechada) até 0deg (aberta em pé)
  tl.to(lid, {
    rotateX: 0,
    duration: 0.45,
    ease: 'power2.inOut',
  }, 0);

  // Transição da tampa externa (logo retroiluminada) para a tela interna
  if (lidOuter && bezel) {
    tl.to(lidOuter, {
      opacity: 0,
      duration: 0.18,
      ease: 'power2.in',
    }, 0.20)
    .to(bezel, {
      opacity: 1,
      duration: 0.22,
      ease: 'power2.out',
    }, 0.24);
  }

  // -------------------------------------------------------------------------
  // FASE 2 (Progress 0.45 -> 0.68): ATIVAÇÃO DA TELA & BOOT DO SISTEMA
  // A tela liga com efeito CRT, iluminando o HUD e a cascata de matriz binária
  // -------------------------------------------------------------------------
  if (matrixOverlay) {
    tl.to(matrixOverlay, {
      opacity: 1,
      duration: 0.18,
      ease: 'power2.out',
    }, 0.44);
  }

  if (matrixCanvas) {
    tl.fromTo(matrixCanvas,
      { filter: 'brightness(2.2) contrast(1.3)' },
      { filter: 'brightness(1) contrast(1)', duration: 0.24, ease: 'power1.out' },
      0.45
    );
  }

  if (glow) {
    tl.to(glow, {
      opacity: 1,
      scale: 1.15,
      duration: 0.25,
      ease: 'power2.out',
    }, 0.45);
  }

  if (hud) {
    tl.fromTo(hud,
      { scale: 0.9, opacity: 0.6 },
      { scale: 1, opacity: 1, duration: 0.2, ease: 'back.out(1.5)' },
      0.46
    );
  }

  // -------------------------------------------------------------------------
  // FASE 3 (Progress 0.68 -> 1.00): ZOOM-IN CINEMATOGRÁFICO NOS CASES
  // A tela expande para preencher a viewport e conectar com o portfólio
  // -------------------------------------------------------------------------
  tl.to(introHeader, {
    opacity: 0,
    y: -25,
    duration: 0.2,
    ease: 'power2.in',
  }, 0.66);

  if (hud) {
    tl.to(hud, {
      opacity: 0,
      y: 12,
      duration: 0.15,
      ease: 'power2.in',
    }, 0.70);
  }

  tl.to(base, {
    opacity: 0,
    duration: 0.25,
    ease: 'power2.in',
  }, 0.72)
  .to(device, {
    scale: 4.5,
    y: '0%',
    duration: 0.32,
    ease: 'power2.inOut',
  }, 0.68)
  .to(screenInner, {
    scale: 1.05,
    duration: 0.32,
    ease: 'power2.out',
  }, 0.68);

  return { timeline: tl, webgl };
}
