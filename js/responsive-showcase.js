/* ==========================================================================
   RESPONSIVE SHOWCASE — "PERFEIÇÃO EM QUALQUER TELA" (OTIMIZADO 60/120FPS)
   - ZERO carregamento de 5 iframes no boot: carrega apenas a aba ativa sob demanda
     quando a tampa do notebook abre (progress >= 0.12) ou ao trocar de aba.
   - ZERO getComputedStyle() em loop rAF: cascata binária 0/1 roda ~30fps SOMENTE
     enquanto está visível (abertura da tampa ou pulso de troca) e dorme 100% fora.
   - ZERO animação de CSS filter: brightness() em GSAP (usa apenas transform/opacity).
   - Drag com gsap.set() (sem criar 5 tweens novos por pixel de pointermove).
   - CSS sticky nativo + ScrollTrigger scrub (zero pin-spacer / DOM reparenting).
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
 * Motor da Cascata Binária (0 e 1 vermelho VL Tech) — 0% CPU quando inativo
 */
function createBinaryMatrix(canvas, overlay, section) {
  if (!canvas || !overlay) {
    return { setActive: () => {}, pulse: () => {}, destroy: () => {} };
  }

  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) {
    return { setActive: () => {}, pulse: () => {}, destroy: () => {} };
  }

  const FONT_SIZE = 13;
  const BINARY = ['0', '1'];
  const COLORS = ['#FF1E26', '#FF2A2A', '#E11D48', '#FF4D4D', '#D6001C'];
  const FRAME_INTERVAL = 33; // ~30fps: visual matrix idêntico com metade do custo

  let width = 0;
  let height = 0;
  let columns = 0;
  let drops = [];
  let speeds = [];
  let colColors = [];
  let rafId = null;
  let lastTick = 0;
  let isVisible = false;
  let isActive = false;
  let isPulsing = false;
  let resizeTimer = null;

  function resize() {
    const rect = overlay.getBoundingClientRect();
    width = rect.width || 640;
    height = rect.height || 360;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    columns = Math.floor(width / FONT_SIZE) + 1;
    drops = Array.from({ length: columns }, () => Math.random() * -40);
    speeds = Array.from({ length: columns }, () => 1.4 + Math.random() * 2.2);
    colColors = Array.from(
      { length: columns },
      () => COLORS[Math.floor(Math.random() * COLORS.length)]
    );
  }

  function stop() {
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  function maybeStart() {
    if ((isActive || isPulsing) && isVisible && !document.hidden && !rafId) {
      lastTick = 0;
      rafId = requestAnimationFrame(render);
    }
  }

  function render(now) {
    if ((!isActive && !isPulsing) || !isVisible || document.hidden) {
      rafId = null;
      return;
    }

    if (now - lastTick >= FRAME_INTERVAL) {
      lastTick = now;
      ctx.fillStyle = 'rgba(6, 6, 10, 0.28)';
      ctx.fillRect(0, 0, width, height);
      ctx.font = `bold ${FONT_SIZE}px "JetBrains Mono", monospace`;
      ctx.textAlign = 'center';

      for (let i = 0; i < columns; i++) {
        const char = BINARY[(Math.random() * 2) | 0];
        const x = i * FONT_SIZE + FONT_SIZE / 2;
        const y = drops[i] * FONT_SIZE;

        ctx.fillStyle = Math.random() > 0.92 ? '#FF8A8E' : colColors[i];
        ctx.fillText(char, x, y);

        if (y > height && Math.random() > 0.95) {
          drops[i] = 0;
          speeds[i] = 1.4 + Math.random() * 2.2;
        }
        drops[i] += speeds[i];
      }
    }

    rafId = requestAnimationFrame(render);
  }

  const onResize = () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 140);
  };

  resize();
  window.addEventListener('resize', onResize, { passive: true });

  const observer = new IntersectionObserver(
    ([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible) {
        maybeStart();
      } else {
        stop();
      }
    },
    { threshold: 0.01 }
  );
  observer.observe(section);

  const onVisibilityChange = () => {
    if (document.hidden) stop();
    else maybeStart();
  };
  document.addEventListener('visibilitychange', onVisibilityChange);

  return {
    setActive(active) {
      if (isActive === active) return;
      isActive = active;
      if (isActive) {
        maybeStart();
      } else if (!isPulsing) {
        stop();
      }
    },
    pulse() {
      isPulsing = true;
      maybeStart();
      gsap.killTweensOf(overlay, 'opacity');
      gsap.fromTo(
        overlay,
        { opacity: 0.36 },
        {
          opacity: 0,
          duration: 0.34,
          ease: 'power2.out',
          onComplete: () => {
            isPulsing = false;
            if (!isActive) stop();
          },
        }
      );
    },
    destroy() {
      stop();
      clearTimeout(resizeTimer);
      observer.disconnect();
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibilityChange);
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
  // 0. ESCALA REAL 1440×900 DOS IFRAMES — LAZY ON-DEMAND (ZERO LOAD NO BOOT!)
  // =========================================================================
  let isSectionInView = false;
  let hasOpenedOnce = prefersReduced;

  function ensureIframeLoaded(index) {
    const iframe = heroIframes[index];
    if (!iframe || iframe.dataset.mounted === '1') return;
    const src = iframe.dataset.src;
    if (!src) return;
    iframe.dataset.mounted = '1';
    iframe.loading = 'lazy';
    iframe.addEventListener(
      'load',
      () => {
        iframe.classList.add('is-loaded');
      },
      { once: true }
    );
    iframe.src = src;
  }

  function scaleHeroIframes() {
    if (!monitorViewport) return;
    const vw = monitorViewport.clientWidth;
    const vh = monitorViewport.clientHeight;
    if (!vw || !vh) return;
    const scale = vw / 1440;
    const targetHeight = Math.ceil(vh / scale);
    const heightCss = `${Math.max(820, targetHeight)}px`;
    const transformCss = `scale(${scale.toFixed(4)})`;
    heroIframes.forEach((iframe) => {
      iframe.style.height = heightCss;
      iframe.style.transform = transformCss;
    });
  }

  scaleHeroIframes();
  let resizeObserver = null;
  let scaleResizeTimer = null;
  const debouncedScale = () => {
    clearTimeout(scaleResizeTimer);
    scaleResizeTimer = setTimeout(scaleHeroIframes, 120);
  };
  if ('ResizeObserver' in window && monitorViewport) {
    resizeObserver = new ResizeObserver(debouncedScale);
    resizeObserver.observe(monitorViewport);
  }
  window.addEventListener('resize', debouncedScale, { passive: true });

  // =========================================================================
  // 1. CARROSSEL 3D DE CELULARES (SOMENTE TRANSFORM & OPACITY — ZERO FILTER!)
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
    const useImmediate = immediate || prefersReduced;

    phoneItems.forEach((item, idx) => {
      const diff = wrapDelta(idx, activeIndex, total);
      const absDiff = Math.abs(diff);

      let x = 0;
      let z = 45;
      let rotateY = 0;
      let scale = 1;
      let opacity = 1;
      let zIndex = 6;

      if (absDiff === 1) {
        x = diff * spreadX;
        z = -120;
        rotateY = diff * -24;
        scale = 0.8;
        opacity = 0.58;
        zIndex = 4;
      } else if (absDiff >= 2) {
        x = Math.sign(diff) * farX;
        z = -240;
        rotateY = Math.sign(diff) * -36;
        scale = 0.62;
        opacity = isMobile ? 0 : 0.2;
        zIndex = 2;
      }

      item.classList.toggle('is-active', diff === 0);
      item.setAttribute('aria-hidden', diff === 0 ? 'false' : 'true');

      const props = {
        x: x + dragOffsetX * (diff === 0 ? 0.65 : 0.35),
        z,
        rotateY: rotateY + dragOffsetX * 0.04,
        scale,
        opacity,
        zIndex,
      };

      if (useImmediate) {
        gsap.set(item, props);
      } else {
        gsap.to(item, {
          ...props,
          duration: 0.55,
          ease: 'power3.out',
          overwrite: 'auto',
        });
      }
    });
  }

  function syncBrowserAndMeta(index, withTransition = true) {
    const project = PROJECTS[index];
    if (!project) return;

    // Carrega o iframe somente se a seção já entrou/abriu (nunca no boot!)
    if (hasOpenedOnce) {
      ensureIframeLoaded(index);
    }

    browserTabs.forEach((tab, idx) => {
      const isActive = idx === index;
      tab.classList.toggle('is-active', isActive);
      tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    tabPanes.forEach((pane, idx) => {
      pane.classList.toggle('is-active', idx === index);
    });

    dots.forEach((dot, idx) => {
      const isActive = idx === index;
      dot.classList.toggle('is-active', isActive);
      dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    if (laptopUrl) laptopUrl.textContent = project.url;
    if (activeNameEl) activeNameEl.textContent = project.name;
    if (activeMetaEl) {
      activeMetaEl.innerHTML = `${project.category} · <span class="text-red">OTIMIZADO MONITOR &amp; MOBILE</span>`;
    }
    if (visitLink) visitLink.href = project.url;

    if (withTransition && !prefersReduced && isCarouselRevealed) {
      matrix.pulse();
    }
  }

  function goToIndex(nextIndex, userTriggered = false) {
    const total = PROJECTS.length;
    const target = ((nextIndex % total) + total) % total;
    if (target === activeIndex && userTriggered) return;

    activeIndex = target;
    hasOpenedOnce = true;
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
    if (isPaused || prefersReduced || !isCarouselRevealed || !isSectionInView) return;
    autoTimer = setInterval(() => {
      if (!isDragging && isSectionInView && !document.hidden) nextSlide(false);
    }, 4500);
  }

  function restartAutoPlay() {
    if (!isPaused) startAutoPlay();
  }

  // Observa se a seção está na viewport para congelar autoplay e panes fora da tela
  let viewObserver = null;
  if ('IntersectionObserver' in window) {
    viewObserver = new IntersectionObserver(
      ([entry]) => {
        isSectionInView = entry.isIntersecting;
        section.classList.toggle('is-dormant', !isSectionInView);
        if (isSectionInView) {
          if (isCarouselRevealed) startAutoPlay();
        } else {
          stopAutoPlay();
        }
      },
      { rootMargin: '120px' }
    );
    viewObserver.observe(section);
  } else {
    isSectionInView = true;
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

  phoneItems.forEach((item, idx) => {
    item.addEventListener('click', () => {
      if (Math.abs(dragDeltaX) > 10) return;
      if (idx !== activeIndex) goToIndex(idx, true);
    });
  });

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
  const onPhonesResize = () => layoutPhones(0, true);
  window.addEventListener('resize', onPhonesResize, { passive: true });

  // =========================================================================
  // 3. COREOGRAFIA SCROLLTRIGGER EM 2 ETAPAS COM CSS STICKY NATIVO
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
    ensureIframeLoaded(0);
    return {
      goToIndex,
      next: () => nextSlide(true),
      prev: () => prevSlide(true),
      destroy: () => {
        stopAutoPlay();
        viewObserver?.disconnect();
        resizeObserver?.disconnect();
        window.removeEventListener('resize', debouncedScale);
        window.removeEventListener('resize', onPhonesResize);
        matrix.destroy();
      },
    };
  }

  // ESTADO INICIAL ANTES DA SEÇÃO ENTRAR NA TELA
  if (header) gsap.set(header, { opacity: 0, y: -22 });
  if (glow) gsap.set(glow, { opacity: 0, scale: 0.72 });
  if (laptopApproach) {
    gsap.set(laptopApproach, { opacity: 0, scale: 0.56, y: 90 });
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

  // ETAPA A: NOTEBOOK FECHADO VEM VINDO DE LONGE
  const approachTl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top 95%',
      end: 'top top',
      scrub: 0.45,
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

  // ETAPA B: SEQUÊNCIA STICKY
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.5,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const p = self.progress;

        // Só carrega o iframe da aba ativa quando a tampa começa a abrir
        if (!hasOpenedOnce && p >= 0.12) {
          hasOpenedOnce = true;
          ensureIframeLoaded(activeIndex);
        }

        // Liga a cascata binária SOMENTE na janela em que ela está visível na tela
        matrix.setActive(p >= 0.15 && p <= 0.46);

        const ready = p >= 0.72;
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

  // 1) Dica some + Notebook ABRE a tampa + 0 e 1 + Navegador com Hero ao vivo
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
      0.3
    );
  }

  if (monitorSiteLayer) {
    tl.to(
      monitorSiteLayer,
      { opacity: 1, scale: 1, duration: 0.16, ease: 'power2.out' },
      0.27
    );
  }

  // 2) Aparecem as escritas ("PERFEIÇÃO EM QUALQUER TELA")
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
      { opacity: 1, scale: 1.08, duration: 0.18, ease: 'power2.out', immediateRender: false },
      0.36
    );
  }

  // 3) Notebook sobe + Celulares 3D entram abaixo
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

  // 4) Hold final
  tl.to({}, { duration: 0.18 });

  return {
    goToIndex,
    next: () => nextSlide(true),
    prev: () => prevSlide(true),
    destroy: () => {
      stopAutoPlay();
      clearTimeout(scaleResizeTimer);
      viewObserver?.disconnect();
      resizeObserver?.disconnect();
      window.removeEventListener('resize', debouncedScale);
      window.removeEventListener('resize', onPhonesResize);
      approachTl.scrollTrigger?.kill();
      approachTl.kill();
      tl.scrollTrigger?.kill();
      tl.kill();
      matrix.destroy();
    },
  };
}
