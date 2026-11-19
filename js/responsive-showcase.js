/* ==========================================================================
   RESPONSIVE SHOWCASE — "PERFEIÇÃO EM QUALQUER TELA"
   Sequência Unificada:
   0. Inicia sem nada (palco escuro limpo)
   1. Notebook 3D surge fechado em perspectiva 3/4 com logo VL retroiluminada
   2. Tampa abre suavemente + roda cascata 0 e 1 + abre Navegador Real com
      5 abas clicáveis mostrando a HERO ao vivo de cada site!
   3. Aparecem as escritas ("PERFEIÇÃO EM QUALQUER TELA")
   4. Notebook sobe mais para cima no fundo (deixando a Hero toda visível!)
      e o Carrossel 3D de Celulares (com a LOGO de cada cliente) entra bem
      mais em baixo, sincronizado 1:1 com as abas do navegador!
   ========================================================================== */

import { gsap } from './core/gsap.js';
import { playClick, playHover } from './sound.js';

const PROJECTS = [
  {
    key: 'maciel-fit',
    name: 'MACIEL FIT',
    category: 'STUDIO FITNESS',
    url: 'https://macielfit-studio-eta.vercel.app/',
  },
  {
    key: 'g4-batatas',
    name: 'G4 BATATAS',
    category: 'INDÚSTRIA & AGRO',
    url: 'https://project-zil-g4-batatas.vercel.app/',
  },
  {
    key: 'marinho-odonto',
    name: 'MARINHO ODONTO',
    category: 'SAÚDE & ESTÉTICA',
    url: 'https://marinhoodonto.vercel.app/',
  },
  {
    key: 'ribeiro-team',
    name: 'RIBEIRO TEAM',
    category: 'CENTRO DE LUTAS',
    url: 'https://ribeiro-team.vercel.app/',
  },
  {
    key: 'zildo-oliveira',
    name: 'ZILDO OLIVEIRA',
    category: 'PORTAL OFICIAL',
    url: 'https://project-zil-zildo.vercel.app/',
  },
];

/**
 * Motor da Cascata Binária (0 e 1 vermelho VL Tech) na tela do Notebook 3D
 */
function createBinaryMatrix(canvas, overlay, section) {
  if (!canvas || !overlay) return { pulse: () => {}, destroy: () => {} };

  const ctx = canvas.getContext('2d');
  if (!ctx) return { pulse: () => {}, destroy: () => {} };

  const FONT_SIZE = 13;
  const BINARY = ['0', '1'];
  const COLORS = ['#FF1E26', '#FF2A2A', '#E11D48', '#FF4D4D', '#D6001C'];

  let width = 0;
  let height = 0;
  let columns = 0;
  let drops = [];
  let speeds = [];
  let colColors = [];
  let rafId = null;
  let isVisible = false;

  function resize() {
    const rect = overlay.getBoundingClientRect();
    width = rect.width || 640;
    height = rect.height || 360;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    columns = Math.floor(width / FONT_SIZE) + 1;
    drops = Array.from({ length: columns }, () => Math.random() * -40);
    speeds = Array.from({ length: columns }, () => 1.2 + Math.random() * 2.2);
    colColors = Array.from(
      { length: columns },
      () => COLORS[Math.floor(Math.random() * COLORS.length)]
    );
  }

  function render() {
    if (!isVisible) {
      rafId = null;
      return;
    }

    const opacity = parseFloat(getComputedStyle(overlay).opacity || '0');
    if (opacity > 0.02) {
      ctx.fillStyle = 'rgba(6, 6, 10, 0.26)';
      ctx.fillRect(0, 0, width, height);
      ctx.font = `bold ${FONT_SIZE}px "JetBrains Mono", monospace`;
      ctx.textAlign = 'center';

      for (let i = 0; i < columns; i++) {
        const char = BINARY[Math.floor(Math.random() * 2)];
        const x = i * FONT_SIZE + FONT_SIZE / 2;
        const y = drops[i] * FONT_SIZE;

        ctx.fillStyle = Math.random() > 0.92 ? '#FF8A8E' : colColors[i];
        ctx.fillText(char, x, y);

        if (y > height && Math.random() > 0.96) {
          drops[i] = 0;
          speeds[i] = 1.2 + Math.random() * 2.2;
        }
        drops[i] += speeds[i];
      }
    }

    rafId = requestAnimationFrame(render);
  }

  resize();
  window.addEventListener('resize', resize, { passive: true });

  const observer = new IntersectionObserver(
    ([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible && !rafId) {
        rafId = requestAnimationFrame(render);
      }
    },
    { rootMargin: '140px' }
  );
  observer.observe(section);

  return {
    pulse() {
      gsap.killTweensOf(overlay, 'opacity');
      gsap.fromTo(
        overlay,
        { opacity: 0.36 },
        { opacity: 0, duration: 0.34, ease: 'power2.out' }
      );
    },
    destroy() {
      if (rafId) cancelAnimationFrame(rafId);
      observer.disconnect();
      window.removeEventListener('resize', resize);
    },
  };
}

export function initResponsiveShowcase() {
  const section = document.getElementById('responsividade');
  if (!section) return null;

  const pinViewport = section.querySelector('#respPinViewport');
  const header = section.querySelector('#respHeader');
  const laptopApproach = section.querySelector('#respLaptopApproach');
  const laptopDevice = section.querySelector('#respLaptopDevice');
  const laptopLid = section.querySelector('#respLaptopLid');
  const lidOuter = section.querySelector('#respLidOuter');
  const laptopBezel = section.querySelector('#respLaptopBezel');
  const monitorViewport = section.querySelector('#respMonitorViewport');
  const monitorSiteLayer = section.querySelector('#respMonitorSiteLayer');
  const matrixOverlay = section.querySelector('#respMatrixOverlay');
  const matrixCanvas = section.querySelector('#respMatrixCanvas');
  const scrollHint = section.querySelector('#respScrollHint');
  const glow = section.querySelector('#respAmbientGlow');

  const browserTabs = Array.from(section.querySelectorAll('.resp-browser-tab'));
  const tabPanes = Array.from(section.querySelectorAll('.resp-tab-pane'));
  const heroIframes = Array.from(section.querySelectorAll('.resp-hero-iframe'));

  const phoneLayer = section.querySelector('#respPhoneCarouselLayer');
  const carouselTrack = section.querySelector('#phoneCarouselTrack');
  const phoneItems = Array.from(section.querySelectorAll('.phone-3d-item'));
  const bottomControls = section.querySelector('#respBottomControls');

  const laptopUrl = section.querySelector('#laptopUrlText');
  const activeNameEl = section.querySelector('#respActiveName');
  const activeMetaEl = section.querySelector('#respActiveMeta');
  const visitLink = section.querySelector('#respVisitLink');

  const prevBtn = section.querySelector('#respPrevBtn');
  const nextBtn = section.querySelector('#respNextBtn');
  const pauseBtn = section.querySelector('#respPauseBtn');
  const pauseIcon = section.querySelector('#respPauseIcon');
  const dots = Array.from(section.querySelectorAll('.resp-dot'));

  if (!pinViewport || !laptopDevice || !laptopLid || !phoneItems.length) return null;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const matrix = createBinaryMatrix(matrixCanvas, matrixOverlay, section);

  // =========================================================================
  // 0. ESCALA REAL 1440×900 DOS IFRAMES DA HERO + LAZY LOAD INTELIGENTE
  // =========================================================================
  let iframesLoaded = false;

  function ensureIframeLoaded(index) {
    const iframe = heroIframes[index];
    if (!iframe || iframe.dataset.mounted === '1') return;
    const src = iframe.dataset.src;
    if (!src) return;
    iframe.dataset.mounted = '1';
    iframe.addEventListener(
      'load',
      () => {
        iframe.classList.add('is-loaded');
      },
      { once: true }
    );
    iframe.src = src;
  }

  function preloadAllHeroIframes() {
    if (iframesLoaded) return;
    iframesLoaded = true;
    // Carrega primeiro a aba ativa, depois as demais em sequência rápida
    ensureIframeLoaded(activeIndex);
    heroIframes.forEach((_, idx) => {
      if (idx !== activeIndex) {
        setTimeout(() => ensureIframeLoaded(idx), 250 + idx * 180);
      }
    });
  }

  function scaleHeroIframes() {
    if (!monitorViewport) return;
    const vw = monitorViewport.clientWidth;
    const vh = monitorViewport.clientHeight;
    if (!vw || !vh) return;
    const scale = vw / 1440;
    const targetHeight = Math.ceil(vh / scale);
    heroIframes.forEach((iframe) => {
      iframe.style.height = `${Math.max(820, targetHeight)}px`;
      iframe.style.transform = `scale(${scale.toFixed(4)})`;
    });
  }

  scaleHeroIframes();
  let resizeObserver = null;
  if ('ResizeObserver' in window && monitorViewport) {
    resizeObserver = new ResizeObserver(scaleHeroIframes);
    resizeObserver.observe(monitorViewport);
  }
  window.addEventListener('resize', scaleHeroIframes, { passive: true });

  // Carrega a Hero do primeiro site imediatamente e as demais ao se aproximar
  ensureIframeLoaded(0);
  if ('IntersectionObserver' in window) {
    const preloadObs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          preloadAllHeroIframes();
          preloadObs.disconnect();
        }
      },
      { rootMargin: '900px' }
    );
    preloadObs.observe(section);
  } else {
    preloadAllHeroIframes();
  }

  // =========================================================================
  // 1. CARROSSEL 3D DE CELULARES (LOGOS DOS CLIENTES) + SINCRONIA COM ABAS
  // =========================================================================
  let activeIndex = 0;
  let isPaused = false;
  let autoTimer = null;
  let isCarouselRevealed = prefersReduced;

  function wrapDelta(index, center, total) {
    let diff = index - center;
    const half = total / 2;
    if (diff > half) diff -= total;
    if (diff < -half) diff += total;
    return diff;
  }

  function layoutPhones(dragOffsetX = 0, immediate = false) {
    const total = phoneItems.length;
    const isMobile = window.innerWidth < 768;
    const spreadX = isMobile ? 132 : 196;
    const farX = isMobile ? 210 : 320;
    const duration = immediate || prefersReduced ? 0 : 0.6;

    phoneItems.forEach((item, idx) => {
      const diff = wrapDelta(idx, activeIndex, total);
      const absDiff = Math.abs(diff);

      let x = 0;
      let z = 45;
      let rotateY = 0;
      let scale = 1;
      let opacity = 1;
      let zIndex = 6;
      let filter = 'brightness(1)';

      if (absDiff === 1) {
        x = diff * spreadX;
        z = -120;
        rotateY = diff * -24;
        scale = 0.8;
        opacity = 0.72;
        zIndex = 4;
        filter = 'brightness(0.74)';
      } else if (absDiff >= 2) {
        x = Math.sign(diff) * farX;
        z = -240;
        rotateY = Math.sign(diff) * -36;
        scale = 0.62;
        opacity = isMobile ? 0 : 0.22;
        zIndex = 2;
        filter = 'brightness(0.45)';
      }

      item.classList.toggle('is-active', diff === 0);
      item.setAttribute('aria-hidden', diff === 0 ? 'false' : 'true');

      gsap.to(item, {
        x: x + dragOffsetX * (diff === 0 ? 0.65 : 0.35),
        z,
        rotateY: rotateY + dragOffsetX * 0.04,
        scale,
        opacity,
        zIndex,
        filter,
        duration,
        ease: 'power3.out',
        overwrite: 'auto',
      });
    });
  }

  function syncBrowserAndMeta(index, withTransition = true) {
    const project = PROJECTS[index];
    if (!project) return;

    ensureIframeLoaded(index);

    // Atualiza Abas Reais do Navegador no Notebook
    browserTabs.forEach((tab, idx) => {
      const isActive = idx === index;
      tab.classList.toggle('is-active', isActive);
      tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    // Alterna a pré-visualização da Hero correspondente no navegador
    tabPanes.forEach((pane, idx) => {
      pane.classList.toggle('is-active', idx === index);
    });

    // Atualiza dots inferiores
    dots.forEach((dot, idx) => {
      const isActive = idx === index;
      dot.classList.toggle('is-active', isActive);
      dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    // Atualiza URL e textos
    if (laptopUrl) laptopUrl.textContent = project.url;
    if (activeNameEl) activeNameEl.textContent = project.name;
    if (activeMetaEl) {
      activeMetaEl.innerHTML = `${project.category} · <span class="text-red">OTIMIZADO MONITOR &amp; MOBILE</span>`;
    }
    if (visitLink) visitLink.href = project.url;

    // Pulso breve de 0/1 ao alternar de aba no navegador aberto
    if (withTransition && !prefersReduced && isCarouselRevealed) {
      matrix.pulse();
    }
  }

  function goToIndex(nextIndex, userTriggered = false) {
    const total = PROJECTS.length;
    const target = ((nextIndex % total) + total) % total;
    if (target === activeIndex && userTriggered) return;

    activeIndex = target;
    if (userTriggered) {
      try { playClick(); } catch (_) {}
      restartAutoPlay();
    }

    layoutPhones(0, false);
    syncBrowserAndMeta(activeIndex, true);
  }

  function nextSlide(userTriggered = false) {
    goToIndex(activeIndex + 1, userTriggered);
  }

  function prevSlide(userTriggered = false) {
    goToIndex(activeIndex - 1, userTriggered);
  }

  function stopAutoPlay() {
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
    }
  }

  function startAutoPlay() {
    stopAutoPlay();
    if (isPaused || prefersReduced || !isCarouselRevealed) return;
    autoTimer = setInterval(() => {
      if (!isDragging) nextSlide(false);
    }, 4500);
  }

  function restartAutoPlay() {
    if (!isPaused) startAutoPlay();
  }

  // =========================================================================
  // 2. INTERAÇÃO "JOGAR PRO LADO" + CLIQUE NAS ABAS DO NAVEGADOR NO NOTEBOOK
  // =========================================================================
  let isDragging = false;
  let dragStartX = 0;
  let dragDeltaX = 0;

  if (carouselTrack) {
    carouselTrack.addEventListener('pointerdown', (e) => {
      if (e.target.closest('button, a')) return;
      isDragging = true;
      dragStartX = e.clientX;
      dragDeltaX = 0;
      carouselTrack.classList.add('is-dragging');
      carouselTrack.setPointerCapture?.(e.pointerId);
      stopAutoPlay();
    });

    carouselTrack.addEventListener('pointermove', (e) => {
      if (!isDragging) return;
      dragDeltaX = Math.max(-180, Math.min(180, e.clientX - dragStartX));
      layoutPhones(dragDeltaX, true);
    });

    const endDrag = () => {
      if (!isDragging) return;
      isDragging = false;
      carouselTrack.classList.remove('is-dragging');

      if (dragDeltaX <= -42) {
        nextSlide(true);
      } else if (dragDeltaX >= 42) {
        prevSlide(true);
      } else {
        layoutPhones(0, false);
        restartAutoPlay();
      }
      dragDeltaX = 0;
    };

    carouselTrack.addEventListener('pointerup', endDrag);
    carouselTrack.addEventListener('pointercancel', endDrag);

    carouselTrack.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextSlide(true);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide(true);
      }
    });
  }

  // Clique direto num celular lateral traz ele pro centro
  phoneItems.forEach((item, idx) => {
    item.addEventListener('click', () => {
      if (Math.abs(dragDeltaX) > 10) return;
      if (idx !== activeIndex) goToIndex(idx, true);
    });
  });

  // Clique direto nas ABAS DO NAVEGADOR no notebook também troca tudo!
  browserTabs.forEach((tab, idx) => {
    tab.addEventListener('click', () => goToIndex(idx, true));
    tab.addEventListener('mouseenter', () => {
      try { playHover(); } catch (_) {}
    });
  });

  prevBtn?.addEventListener('click', () => prevSlide(true));
  nextBtn?.addEventListener('click', () => nextSlide(true));

  pauseBtn?.addEventListener('click', () => {
    isPaused = !isPaused;
    pauseBtn.setAttribute('aria-pressed', isPaused ? 'true' : 'false');
    if (pauseIcon) pauseIcon.textContent = isPaused ? '▶' : '❚❚';
    try { playClick(); } catch (_) {}
    if (isPaused) {
      stopAutoPlay();
    } else {
      startAutoPlay();
    }
  });

  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => goToIndex(idx, true));
    dot.addEventListener('mouseenter', () => {
      try { playHover(); } catch (_) {}
    });
  });

  layoutPhones(0, true);
  syncBrowserAndMeta(0, false);
  window.addEventListener('resize', () => layoutPhones(0, true), { passive: true });

  // =========================================================================
  // 3. COREOGRAFIA SCROLLTRIGGER EM 2 ETAPAS COM CSS STICKY NATIVO:
  //    (Zero DOM reparenting / pin-spacer -> nunca conflita com iframes!)
  //    ETAPA A (top 95% -> top top):
  //      - Palco começa limpo e o Notebook 3D FECHADO já vem vindo de longe!
  //    ETAPA B (top top -> bottom bottom, dentro do sticky 100vh):
  //      - Notebook abre a tampa -> roda 0 e 1 -> mostra Navegador + Hero ao vivo
  //      - Aparecem as escritas ("PERFEIÇÃO EM QUALQUER TELA")
  //      - Notebook sobe bem pra cima + Celulares 3D (com logos) entram em baixo
  // =========================================================================
  if (prefersReduced) {
    if (header) gsap.set(header, { opacity: 1, y: 0 });
    if (laptopApproach) gsap.set(laptopApproach, { opacity: 1, scale: 1, y: 0 });
    gsap.set(laptopLid, { rotateX: 0 });
    gsap.set(laptopDevice, { opacity: 1, rotateX: 0, rotateY: 0, scale: 0.92, y: -14 });
    if (lidOuter) gsap.set(lidOuter, { opacity: 0, display: 'none' });
    if (laptopBezel) gsap.set(laptopBezel, { opacity: 1 });
    if (matrixOverlay) gsap.set(matrixOverlay, { opacity: 0 });
    if (monitorSiteLayer) gsap.set(monitorSiteLayer, { opacity: 1 });
    if (phoneLayer) {
      gsap.set(phoneLayer, { opacity: 1, y: 0, scale: 1 });
      phoneLayer.classList.add('is-interactive');
    }
    if (bottomControls) gsap.set(bottomControls, { opacity: 1, y: 0 });
    if (scrollHint) gsap.set(scrollHint, { opacity: 0 });
    isCarouselRevealed = true;
    preloadAllHeroIframes();
    return {
      goToIndex,
      next: () => nextSlide(true),
      prev: () => prevSlide(true),
      destroy: () => {
        stopAutoPlay();
        resizeObserver?.disconnect();
        matrix.destroy();
      },
    };
  }

  // ESTADO INICIAL ANTES DA SEÇÃO ENTRAR NA TELA:
  // Sem textos, sem celular; Notebook fechado bem longe pronto para se aproximar
  if (header) gsap.set(header, { opacity: 0, y: -22 });
  if (glow) gsap.set(glow, { opacity: 0, scale: 0.65 });
  if (laptopApproach) {
    gsap.set(laptopApproach, { opacity: 0, scale: 0.52, y: 95 });
  }
  gsap.set(laptopLid, { rotateX: -62 });
  gsap.set(laptopDevice, {
    opacity: 1,
    rotateX: 28,
    rotateY: -10,
    scale: 1,
    y: 42,
  });
  if (lidOuter) gsap.set(lidOuter, { opacity: 1, display: 'flex' });
  if (laptopBezel) gsap.set(laptopBezel, { opacity: 0 });
  if (matrixOverlay) gsap.set(matrixOverlay, { opacity: 0 });
  if (monitorSiteLayer) gsap.set(monitorSiteLayer, { opacity: 0, scale: 1.03 });
  if (phoneLayer) {
    gsap.set(phoneLayer, { opacity: 0, y: 85, scale: 0.86 });
    phoneLayer.classList.remove('is-interactive');
  }
  if (bottomControls) gsap.set(bottomControls, { opacity: 0, y: 20 });
  if (scrollHint) gsap.set(scrollHint, { opacity: 0.85, y: 0 });

  // ETAPA A: NOTEBOOK FECHADO VEM VINDO DE LONGE ENQUANTO A SEÇÃO ENTRA NA TELA
  const approachTl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top 95%',
      end: 'top top',
      scrub: 0.55,
      invalidateOnRefresh: true,
    },
  });

  if (laptopApproach) {
    approachTl.to(
      laptopApproach,
      { opacity: 1, scale: 1, y: 0, ease: 'power2.out', duration: 1 },
      0
    );
  }

  if (glow) {
    approachTl.to(
      glow,
      { opacity: 0.65, scale: 0.96, ease: 'power2.out', duration: 1 },
      0
    );
  }

  // ETAPA B: SEQUÊNCIA STICKY (COM O NOTEBOOK FECHADO JÁ NA FRENTE!)
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.65,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        if (self.progress >= 0.04) preloadAllHeroIframes();
        const ready = self.progress >= 0.72;
        if (ready !== isCarouselRevealed) {
          isCarouselRevealed = ready;
          phoneLayer?.classList.toggle('is-interactive', ready);
          if (ready) {
            startAutoPlay();
          } else {
            stopAutoPlay();
          }
        }
      },
    },
  });

  // 1) Dica some + Notebook ABRE a tampa + 0 e 1 + Navegador com Hero ao vivo (0.00 -> 0.40)
  if (scrollHint) {
    tl.to(scrollHint, { opacity: 0, y: 12, duration: 0.08, ease: 'power2.in' }, 0);
  }

  tl.to(
    laptopDevice,
    { rotateX: 2, rotateY: 0, scale: 0.98, y: 10, duration: 0.28, ease: 'power2.inOut' },
    0.02
  );

  tl.to(laptopLid, { rotateX: 0, duration: 0.28, ease: 'power3.inOut' }, 0.02);

  if (lidOuter && laptopBezel) {
    tl.to(lidOuter, { opacity: 0, duration: 0.1, ease: 'power2.in' }, 0.11).to(
      laptopBezel,
      { opacity: 1, duration: 0.13, ease: 'power2.out' },
      0.14
    );
  }

  if (matrixOverlay) {
    tl.to(matrixOverlay, { opacity: 1, duration: 0.08, ease: 'power2.out' }, 0.16).to(
      matrixOverlay,
      { opacity: 0, duration: 0.14, ease: 'power2.inOut' },
      0.30
    );
  }

  if (monitorSiteLayer) {
    tl.to(
      monitorSiteLayer,
      { opacity: 1, scale: 1, duration: 0.16, ease: 'power2.out' },
      0.27
    );
  }

  // 2) Aparecem as escritas ("PERFEIÇÃO EM QUALQUER TELA") (0.36 -> 0.54)
  if (header) {
    tl.to(
      header,
      { opacity: 1, y: 0, duration: 0.16, ease: 'power3.out' },
      0.36
    );
  }

  if (glow) {
    tl.to(
      glow,
      { opacity: 1, scale: 1.12, duration: 0.18, ease: 'power2.out', immediateRender: false },
      0.36
    );
  }

  // 3) Notebook sobe bem para cima + Celulares 3D (com logos) entram em baixo (0.54 -> 0.82)
  tl.to(
    laptopDevice,
    { scale: 0.88, y: -26, rotateX: 0, duration: 0.22, ease: 'power2.out' },
    0.54
  );

  if (phoneLayer) {
    tl.to(
      phoneLayer,
      { opacity: 1, y: 0, scale: 1, duration: 0.24, ease: 'power3.out' },
      0.56
    );
  }

  if (bottomControls) {
    tl.to(
      bottomControls,
      { opacity: 1, y: 0, duration: 0.18, ease: 'power2.out' },
      0.64
    );
  }

  // 4) Hold final (0.82 -> 1.00)
  tl.to({}, { duration: 0.18 });

  return {
    goToIndex,
    next: () => nextSlide(true),
    prev: () => prevSlide(true),
    destroy: () => {
      stopAutoPlay();
      resizeObserver?.disconnect();
      approachTl.scrollTrigger?.kill();
      approachTl.kill();
      tl.scrollTrigger?.kill();
      tl.kill();
      matrix.destroy();
    },
  };
}
