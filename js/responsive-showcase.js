/* ==========================================================================
   RESPONSIVE SHOWCASE — "Perfeição em Qualquer Tela // Notebook & Mobile"
   Interactive Dual-Device 3D/Glassmorphic Showcase for VL Tech
   - Space-Black MacBook Pro (Desktop 1920×1080)
   - Titanium Glassmorphic Smartphone (Mobile 390×844)
   - Interactive Project Tab Switcher with Real Live Cases
   - 3D Parallax Mouse Tracking & GSAP ScrollTrigger Choreography
   - Strict Black & Red Palette (#111112 / #ff2a2a)
   ========================================================================== */

import { gsap, ScrollTrigger } from './core/gsap.js';
import { playClick, playHover } from './sound.js';

const PROJECTS_DATA = {
  'maciel-fit': {
    name: 'Maciel Fit',
    category: 'Studio Fitness & Performance',
    desktopImg: 'assets/images/portfolio/maciel-fit.jpg',
    mobileImg: 'assets/images/portfolio/maciel-fit.jpg',
    url: 'https://macielfit-studio-eta.vercel.app/',
    desktopRes: 'DESKTOP 1920×1080',
    mobileRes: 'MOBILE 390×844 · 120Hz',
    lcp: '< 0.6s',
    fid: '2ms',
    cls: '0.00'
  },
  'g4-batatas': {
    name: 'G4 Batatas',
    category: 'Website Corporativo & Indústria',
    desktopImg: 'assets/images/portfolio/g4-batatas.jpg',
    mobileImg: 'assets/images/portfolio/g4-batatas.jpg',
    url: 'https://project-zil-g4-batatas.vercel.app/',
    desktopRes: 'DESKTOP 1920×1080',
    mobileRes: 'MOBILE 390×844 · 120Hz',
    lcp: '< 0.7s',
    fid: '3ms',
    cls: '0.00'
  },
  'marinho-odonto': {
    name: 'Marinho Odonto',
    category: 'Clínica & Estética do Sorriso',
    desktopImg: 'assets/images/portfolio/marinho-odonto.jpg',
    mobileImg: 'assets/images/portfolio/marinho-odonto.jpg',
    url: 'https://marinhoodonto.vercel.app/',
    desktopRes: 'DESKTOP 1920×1080',
    mobileRes: 'MOBILE 390×844 · 120Hz',
    lcp: '< 0.5s',
    fid: '1ms',
    cls: '0.00'
  },
  'ribeiro-team': {
    name: 'Ribeiro Team',
    category: 'Centro de Treinamento & Lutas',
    desktopImg: 'assets/images/portfolio/ribeiro-team.jpg',
    mobileImg: 'assets/images/portfolio/ribeiro-team.jpg',
    url: 'https://ribeiro-team.vercel.app/',
    desktopRes: 'DESKTOP 1920×1080',
    mobileRes: 'MOBILE 390×844 · 120Hz',
    lcp: '< 0.6s',
    fid: '2ms',
    cls: '0.00'
  },
  'zildo-oliveira': {
    name: 'Zildo Oliveira',
    category: 'Portal Oficial & Campanha Pública',
    desktopImg: 'assets/images/portfolio/zildo-oliveira.jpg',
    mobileImg: 'assets/images/portfolio/zildo-oliveira.jpg',
    url: 'https://project-zil-zildo.vercel.app/',
    desktopRes: 'DESKTOP 1920×1080',
    mobileRes: 'MOBILE 390×844 · 120Hz',
    lcp: '< 0.8s',
    fid: '3ms',
    cls: '0.00'
  }
};

export function initResponsiveShowcase() {
  const section = document.getElementById('responsividade');
  if (!section) return null;

  const stage = section.querySelector('#responsiveStage');
  const laptop = section.querySelector('#responsiveLaptop');
  const mobile = section.querySelector('#responsiveMobile');
  const tabs = section.querySelectorAll('.responsive-tab');
  const laptopImg = section.querySelector('#laptopScreenImg');
  const mobileImg = section.querySelector('#mobileScreenImg');
  const urlText = section.querySelector('#laptopUrlText');
  const floatingCards = section.querySelectorAll('.responsive-floating-card');
  const metricItems = section.querySelectorAll('.responsive-metric-item');

  let activeKey = 'maciel-fit';
  let isTransitioning = false;

  // ---------------------------------------------------------------------------
  // 1. GSAP SCROLLTRIGGER ENTRY ANIMATION
  // ---------------------------------------------------------------------------
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion && stage) {
    const entryTl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 75%',
        toggleActions: 'play none none none',
      }
    });

    // Revelação do cabeçalho e abas
    entryTl.from(section.querySelector('.responsive-header'), {
      opacity: 0,
      y: 40,
      duration: 0.85,
      ease: 'power3.out'
    });

    // Aparição cinematográfica do Notebook (Desktop)
    if (laptop) {
      entryTl.from(laptop, {
        opacity: 0,
        y: 60,
        scale: 0.92,
        duration: 1.1,
        ease: 'power2.out'
      }, '-=0.5');
    }

    // Aparição do Smartphone (Mobile) com sobreposição e overshoot
    if (mobile) {
      entryTl.from(mobile, {
        opacity: 0,
        x: 50,
        y: 70,
        rotationY: -20,
        scale: 0.88,
        duration: 1.2,
        ease: 'back.out(1.4)'
      }, '-=0.8');
    }

    // Badges flutuantes de telemetria
    if (floatingCards.length) {
      entryTl.from(floatingCards, {
        opacity: 0,
        scale: 0.85,
        y: 20,
        stagger: 0.18,
        duration: 0.75,
        ease: 'power2.out'
      }, '-=0.6');
    }

    // Barra de métricas inferiores
    if (metricItems.length) {
      entryTl.from(metricItems, {
        opacity: 0,
        y: 25,
        stagger: 0.1,
        duration: 0.65,
        ease: 'power2.out'
      }, '-=0.4');
    }
  }

  // ---------------------------------------------------------------------------
  // 2. INTERACTIVE 3D PARALLAX TILT NO PALCO
  // ---------------------------------------------------------------------------
  if (!prefersReducedMotion && stage && laptop && mobile && window.innerWidth > 992) {
    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;
    let isHovering = false;
    let rafId = null;

    const onMouseMove = (e) => {
      const rect = stage.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouseX = x;
      mouseY = y;
    };

    const onMouseEnter = () => {
      isHovering = true;
      if (!rafId) rafId = requestAnimationFrame(animateTilt);
    };

    const onMouseLeave = () => {
      isHovering = false;
      mouseX = 0;
      mouseY = 0;
    };

    const animateTilt = () => {
      currentX += (mouseX - currentX) * 0.08;
      currentY += (mouseY - currentY) * 0.08;

      // Notebook inclina suavemente no plano de fundo
      gsap.set(laptop, {
        rotateY: currentX * 12,
        rotateX: -currentY * 9,
        x: currentX * 16,
        y: currentY * 12,
        transformPerspective: 1200
      });

      // Smartphone tem movimento oposto para gerar profundidade 3D
      gsap.set(mobile, {
        rotateY: -10 + currentX * 20,
        rotateX: 4 - currentY * 14,
        x: -currentX * 28,
        y: -currentY * 20,
        transformPerspective: 900
      });

      if (isHovering || Math.abs(mouseX - currentX) > 0.001 || Math.abs(mouseY - currentY) > 0.001) {
        rafId = requestAnimationFrame(animateTilt);
      } else {
        rafId = null;
      }
    };

    stage.addEventListener('mousemove', onMouseMove, { passive: true });
    stage.addEventListener('mouseenter', onMouseEnter);
    stage.addEventListener('mouseleave', onMouseLeave);
  }

  // ---------------------------------------------------------------------------
  // 3. SELETOR INTERATIVO DE PROJETOS COM TRANSIÇÃO FLUIDA
  // ---------------------------------------------------------------------------
  function switchProject(key) {
    if (key === activeKey || isTransitioning) return;
    const project = PROJECTS_DATA[key];
    if (!project) return;

    isTransitioning = true;
    activeKey = key;

    // Atualiza classes ativas nos botões
    tabs.forEach((tab) => {
      const isCurrent = tab.dataset.project === key;
      tab.classList.toggle('is-active', isCurrent);
      tab.setAttribute('aria-selected', isCurrent ? 'true' : 'false');
    });

    // Efeito sonoro tátil
    playClick();

    // Transição suave nas telas do laptop e do celular
    const tl = gsap.timeline({
      onComplete: () => {
        isTransitioning = false;
      }
    });

    // Fade out sutil das imagens
    tl.to([laptopImg, mobileImg], {
      opacity: 0.25,
      scale: 0.98,
      duration: 0.2,
      ease: 'power2.in',
      onComplete: () => {
        if (laptopImg) laptopImg.src = project.desktopImg;
        if (mobileImg) mobileImg.src = project.mobileImg;
        if (urlText) urlText.textContent = project.url;
      }
    });

    // Fade in dinâmico com novo conteúdo
    tl.to([laptopImg, mobileImg], {
      opacity: 1,
      scale: 1,
      duration: 0.35,
      ease: 'power2.out'
    });
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const key = tab.dataset.project;
      if (key) switchProject(key);
    });

    tab.addEventListener('mouseenter', () => {
      playHover();
    });
  });

  return {
    switchProject,
    getActiveProject: () => activeKey
  };
}
