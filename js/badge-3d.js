/* ==========================================================================
   3D ID BADGE (CRACHÁ) — CO-FOUNDERS SHOWCASE
   Crachá Ultra-Limpo (Acesso, Foto Grande, Nome e Função) + Painéis Laterais
   Luiz Gabriel (Frente / 0°) ⇄ Victor Whohlers (Verso / 180°)

   - Pêndulo Físico com gravidade, inércia, arrasto e arremesso (drag-to-throw)
   - Rotação 3D axial com GSAP 3 easing suave
   - Atualização sincronizada dos painéis externos (esquerdo e direito) com GSAP
   - Pausa inteligente do loop de física fora da viewport (IntersectionObserver)
   ========================================================================== */

import { gsap } from './core/gsap.js';
import { playIgnite } from './sound.js';

const FOUNDERS_DATA = {
  front: {
    key: 'luiz',
    name: 'LUIZ GABRIEL',
    kicker: '01 // FRONT-END & AUTOMAÇÕES',
    summary:
      'Interfaces de alta conversão, experiências 3D WebGL e automações sob medida.',
    responsibilities: [
      'Arquitetura Front-end & Design Systems',
      'Landing Pages 3D · Three.js & GSAP',
      'Automações Inteligentes & IA Aplicada',
    ],
    stackLine: 'Three.js · WebGL · GSAP 3 · Next.js · IA',
    idCode: 'VL-ENG-01 · SAO-HQ',
    whatsappHref:
      'https://wa.me/5535997363608?text=Ol%C3%A1%20Luiz%20Gabriel%2C%20gostaria%20de%20conversar%20sobre%20um%20projeto%20com%20a%20VL%20Tech',
    whatsappLabel: 'Falar com Luiz',
    flipBtnLabel: 'GIRAR PARA VICTOR (VERSO)',
    targetAngle: 0,
  },
  back: {
    key: 'victor',
    name: 'VICTOR WHOHLERS',
    kicker: '02 // BACK-END & CLOUD',
    summary:
      'Arquitetura cloud resiliente, APIs distribuídas e sistemas de missão crítica.',
    responsibilities: [
      'Back-end & APIs de Alta Escala',
      'Cloud Resiliente · AWS, GCP & Docker',
      'Segurança, Dados & Uptime 99.98%',
    ],
    stackLine: 'AWS · GCP · Docker · Node.js · PostgreSQL',
    idCode: 'VL-ENG-02 · SAO-HQ',
    whatsappHref:
      'https://wa.me/5511999999999?text=Ol%C3%A1%20Victor%20Whohlers%2C%20gostaria%20de%20conversar%20sobre%20arquitetura%20cloud%20com%20a%20VL%20Tech',
    whatsappLabel: 'Falar com Victor',
    flipBtnLabel: 'GIRAR PARA LUIZ (FRENTE)',
    targetAngle: 180,
  },
};

export function initBadge3D() {
  const section = document.querySelector('.founders-badge-section') || document.getElementById('socios-scrolly');
  if (!section) return null;

  const stage = section.querySelector('#badge3dStage');
  const rig = section.querySelector('#badgePendulumRig');
  const card = section.querySelector('#badgeCard3d');
  const faceFront = section.querySelector('#badgeFaceFront');
  const faceBack = section.querySelector('#badgeFaceBack');
  const lanyardStrap = section.querySelector('#badgeLanyardStrap');
  const specular = section.querySelector('#badgeSpecularGlare');
  let specularBeam = null;
  if (specular) {
    specularBeam = specular.querySelector('.badge-specular-glare__beam');
    if (!specularBeam) {
      specularBeam = document.createElement('span');
      specularBeam.className = 'badge-specular-glare__beam';
      specularBeam.setAttribute('aria-hidden', 'true');
      specular.appendChild(specularBeam);
    }
  }
  const flipActionBtn = section.querySelector('#badgeFlipActionBtn');
  const flipBtnLabel = section.querySelector('#badgeFlipBtnLabel');
  const angleDisplay = section.querySelector('#badgeAngleDisplay');
  const navLuiz = section.querySelector('#badgeNavLuiz');
  const navVictor = section.querySelector('#badgeNavVictor');

  // Blocos flutuantes externos (esquerdo e direito, sem cards)
  const sideLeft = section.querySelector('#badgeSideLeft');
  const sideRight = section.querySelector('#badgeSideRight');
  const infoKicker = section.querySelector('#badgeInfoKicker');
  const infoSummary = section.querySelector('#badgeInfoSummary');
  const respList = section.querySelector('#badgeRespList');
  const stackLine = section.querySelector('#badgeStackLine');
  const metaId = section.querySelector('#badgeMetaId');
  const sideCta = section.querySelector('#badgeSideCta');
  const sideCtaLabel = section.querySelector('#badgeSideCtaLabel');

  if (!card || !rig) return null;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const sidePanels = [sideLeft, sideRight].filter(Boolean);
  let sidePanelTween = null;

  // Estado da física do Pêndulo (Swing ao redor do topo)
  let swingAngleZ = 0;
  let swingVelocityZ = 0;
  let cardWobbleZ = 0;
  const gravity = 0.16;
  const damping = 0.982;

  // Estado da rotação axial (Frente 0° ⇄ Verso 180°)
  let currentRotationY = 0;
  let flipTween = null;
  let currentFace = 'front';

  // Estado de perspectiva / tilt do mouse
  let currentTiltX = 0;
  let currentTiltY = 0;

  // Estado do arrasto (Drag-to-Throw)
  let isDragging = false;
  let dragStartX = 0;
  let dragStartY = 0;
  let lastClientX = 0;
  let lastClientY = 0;
  let throwVelocityX = 0;

  // Renderiza conteúdo nos blocos flutuantes laterais
  function renderSidePanels(data) {
    if (infoKicker) infoKicker.textContent = data.kicker;
    if (infoSummary) infoSummary.textContent = data.summary;

    if (respList) {
      respList.innerHTML = '';
      data.responsibilities.forEach((item) => {
        const li = document.createElement('li');
        li.className = 'badge-float-item';
        li.textContent = item;
        respList.appendChild(li);
      });
    }

    if (stackLine) stackLine.textContent = data.stackLine;
    if (metaId) metaId.textContent = data.idCode;
    if (sideCta) sideCta.href = data.whatsappHref;
    if (sideCtaLabel) sideCtaLabel.textContent = data.whatsappLabel;
  }

  function animateSidePanels(data) {
    if (!sidePanels.length || prefersReduced) {
      renderSidePanels(data);
      return;
    }

    if (sidePanelTween) {
      sidePanelTween.kill();
      sidePanelTween = null;
    }

    // Transição sequencial (zero overlap): sai suavemente -> atualiza conteúdo -> entra
    sidePanelTween = gsap.timeline();
    sidePanelTween
      .to(sidePanels, {
        opacity: 0,
        y: 10,
        duration: 0.18,
        ease: 'power2.in',
        onComplete: () => renderSidePanels(data),
      })
      .to(sidePanels, {
        opacity: 1,
        y: 0,
        duration: 0.32,
        ease: 'power3.out',
        clearProps: 'transform',
      });
  }

  // 1. Atualização dos indicadores e painéis externos (Luiz / Victor)
  function updateFaceState(face) {
    if (currentFace === face) return;
    currentFace = face;
    const data = FOUNDERS_DATA[face];

    section.dataset.activeFounder = data.key;

    if (navLuiz && navVictor) {
      if (face === 'front') {
        navLuiz.classList.add('is-active');
        navLuiz.setAttribute('aria-selected', 'true');
        navVictor.classList.remove('is-active');
        navVictor.setAttribute('aria-selected', 'false');
      } else {
        navVictor.classList.add('is-active');
        navVictor.setAttribute('aria-selected', 'true');
        navLuiz.classList.remove('is-active');
        navLuiz.setAttribute('aria-selected', 'false');
      }
    }

    if (flipBtnLabel) {
      flipBtnLabel.textContent = data.flipBtnLabel;
    }

    animateSidePanels(data);
  }

  // 2. Aplicação das matrizes de transformação 3D (ZERO repaint / ZERO textContent redundante!)
  let lastAngleText = '';
  let lastFacingFront = null;

  function applyTransforms() {
    const normalized = Math.round(((currentRotationY % 360) + 360) % 360);
    const facingFront = normalized <= 90 || normalized >= 270;
    const activeFace = facingFront ? 'front' : 'back';
    updateFaceState(activeFace);

    if (angleDisplay) {
      const nextAngleText = `${normalized}° (${facingFront ? 'LUIZ' : 'VICTOR'})`;
      if (nextAngleText !== lastAngleText) {
        lastAngleText = nextAngleText;
        angleDisplay.textContent = nextAngleText;
      }
    }

    if (faceFront && faceBack && facingFront !== lastFacingFront) {
      lastFacingFront = facingFront;
      faceFront.style.visibility = facingFront ? 'visible' : 'hidden';
      faceBack.style.visibility = facingFront ? 'hidden' : 'visible';
    }

    const swingRad = (swingAngleZ * Math.PI) / 180;
    const arcLiftY = (1 - Math.cos(swingRad)) * -20;
    rig.style.transform = `translate3d(0, ${arcLiftY.toFixed(2)}px, 0) rotateZ(${swingAngleZ.toFixed(2)}deg)`;

    if (lanyardStrap) {
      const strapSkew = -(swingAngleZ * 0.35);
      lanyardStrap.style.transform = `skewX(${strapSkew.toFixed(2)}deg)`;
    }

    const totalTiltX = currentTiltX;
    const totalRotationY = currentRotationY + currentTiltY;
    const totalWobbleZ = cardWobbleZ;

    card.style.transform = `rotateX(${totalTiltX.toFixed(2)}deg) rotateY(${totalRotationY.toFixed(2)}deg) rotateZ(${totalWobbleZ.toFixed(2)}deg)`;

    if (specularBeam) {
      // Move camada especular interna via GPU transform (zero repaint e sem vazar do crachá!)
      const shiftX = (currentTiltY * 1.4 + swingAngleZ * 0.85).toFixed(1);
      const shiftY = (-currentTiltX * 1.4).toFixed(1);
      specularBeam.style.transform = `translate3d(${shiftX}%, ${shiftY}%, 0)`;
    }
  }

  // 3. Simulação Física do Pêndulo com pausa automática fora da tela (inicia dormindo!)
  let rafId = null;
  let isVisible = false;
  let lastTime = performance.now();

  function updatePhysics(time) {
    if ((!isVisible || document.hidden) && !isDragging && !flipTween) {
      rafId = null;
      return;
    }

    const dt = Math.min((time - lastTime) / 16.67, 2.5);
    lastTime = time;

    if (!isDragging) {
      const swingRad = (swingAngleZ * Math.PI) / 180;
      const restoringForce = -Math.sin(swingRad) * gravity * dt;

      swingVelocityZ = (swingVelocityZ + restoringForce) * Math.pow(damping, dt);
      swingAngleZ += swingVelocityZ * dt;

      if (!prefersReduced && Math.abs(swingAngleZ) < 0.25 && Math.abs(swingVelocityZ) < 0.05) {
        const ambientDraft = Math.sin(time * 0.0018) * 1.3;
        swingAngleZ += (ambientDraft - swingAngleZ) * 0.04 * dt;
      }

      cardWobbleZ += (swingAngleZ * 0.38 - cardWobbleZ) * 0.14 * dt;
    } else {
      cardWobbleZ += (swingAngleZ * 0.45 - cardWobbleZ) * 0.22 * dt;
    }

    applyTransforms();
    rafId = requestAnimationFrame(updatePhysics);
  }

  function startLoop() {
    if (!rafId && !document.hidden) {
      lastTime = performance.now();
      rafId = requestAnimationFrame(updatePhysics);
    }
  }

  let observer = null;
  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) startLoop();
      },
      { threshold: 0.05 }
    );
    observer.observe(section);
  } else {
    isVisible = true;
    startLoop();
  }

  const onVisibilityChange = () => {
    if (!document.hidden && isVisible) startLoop();
  };
  document.addEventListener('visibilitychange', onVisibilityChange);

  // 4. Interação Física de Arrasto & Arremesso (Drag-to-Throw)
  function onPointerDown(e) {
    if (e.target.closest('a, button')) return;

    isDragging = true;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;

    dragStartX = clientX;
    dragStartY = clientY;
    lastClientX = clientX;
    lastClientY = clientY;
    throwVelocityX = 0;

    card.classList.add('is-dragging');
    startLoop();

    window.addEventListener('pointermove', onPointerMove, { passive: false });
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
  }

  function onPointerMove(e) {
    if (!isDragging) return;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;

    const deltaX = clientX - dragStartX;
    const deltaY = clientY - dragStartY;

    throwVelocityX = clientX - lastClientX;
    lastClientX = clientX;
    lastClientY = clientY;

    swingAngleZ = Math.max(-44, Math.min(44, deltaX * 0.16));
    currentTiltX = Math.max(-18, Math.min(18, -deltaY * 0.1));
    currentTiltY = Math.max(-20, Math.min(20, deltaX * 0.12));
  }

  function onPointerUp() {
    if (!isDragging) return;
    isDragging = false;
    card.classList.remove('is-dragging');

    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);
    window.removeEventListener('pointercancel', onPointerUp);

    const flickVelocity = Math.max(-15, Math.min(15, throwVelocityX * 0.35));
    swingVelocityZ += flickVelocity;

    gsap.to({ tiltX: currentTiltX, tiltY: currentTiltY }, {
      tiltX: 0,
      tiltY: 0,
      duration: 0.7,
      ease: 'power2.out',
      onUpdate: function () {
        currentTiltX = this.targets()[0].tiltX;
        currentTiltY = this.targets()[0].tiltY;
      },
    });
  }

  card.addEventListener('pointerdown', onPointerDown);

  // 5. Parallax do Mouse no Palco (rect cacheado no mouseenter — zero layout read no mousemove!)
  let stageRect = null;
  if (stage && !prefersReduced && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    stage.addEventListener('mouseenter', () => {
      stageRect = stage.getBoundingClientRect();
    }, { passive: true });

    stage.addEventListener('mousemove', (e) => {
      if (isDragging) return;
      if (!stageRect) stageRect = stage.getBoundingClientRect();
      const relX = (e.clientX - stageRect.left) / (stageRect.width || 1) - 0.5;
      const relY = (e.clientY - stageRect.top) / (stageRect.height || 1) - 0.5;

      currentTiltY = relX * 15;
      currentTiltX = -relY * 13;
    }, { passive: true });

    stage.addEventListener('mouseleave', () => {
      stageRect = null;
      if (isDragging) return;
      gsap.to({ tiltX: currentTiltX, tiltY: currentTiltY }, {
        tiltX: 0,
        tiltY: 0,
        duration: 0.6,
        ease: 'power2.out',
        onUpdate: function () {
          currentTiltX = this.targets()[0].tiltX;
          currentTiltY = this.targets()[0].tiltY;
        },
      });
    });
  }

  // 6. Giro 3D Suave (Flip Front / Back com GSAP 3)
  function flipToFace(face, immediate = false) {
    try { playIgnite(); } catch (_) {}

    const fullRotations = Math.floor(currentRotationY / 360) * 360;
    const currentMod = ((currentRotationY % 360) + 360) % 360;

    let targetOffset;
    if (face === 'front') {
      targetOffset = currentMod > 180 ? 360 : 0;
    } else {
      targetOffset = 180;
    }

    const finalTarget = fullRotations + targetOffset;

    if (flipTween) {
      flipTween.kill();
      flipTween = null;
    }

    swingVelocityZ += face === 'back' ? -2.0 : 2.0;
    startLoop();

    if (immediate || prefersReduced) {
      currentRotationY = finalTarget;
      applyTransforms();
      return;
    }

    const rotObj = { r: currentRotationY };
    flipTween = gsap.to(rotObj, {
      r: finalTarget,
      duration: 0.85,
      ease: 'power3.out',
      onUpdate: () => {
        currentRotationY = rotObj.r;
        applyTransforms();
      },
      onComplete: () => {
        flipTween = null;
      },
    });
  }

  function toggleFlip() {
    const mod = ((currentRotationY % 360) + 360) % 360;
    const facingFront = mod <= 90 || mod >= 270;
    flipToFace(facingFront ? 'back' : 'front');
  }

  flipActionBtn?.addEventListener('click', toggleFlip);

  navLuiz?.addEventListener('click', (e) => {
    e.preventDefault();
    flipToFace('front');
  });

  navVictor?.addEventListener('click', (e) => {
    e.preventDefault();
    flipToFace('back');
  });

  card.addEventListener('click', (e) => {
    if (e.target.closest('a, button')) return;
    if (Math.abs(lastClientX - dragStartX) < 8 && Math.abs(lastClientY - dragStartY) < 8) {
      toggleFlip();
    }
  });

  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleFlip();
    }
  });

  // Inicialização no ângulo 0° (Luiz)
  renderSidePanels(FOUNDERS_DATA.front);
  applyTransforms();

  return {
    destroy: () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (observer) observer.disconnect();
      if (flipTween) flipTween.kill();
      if (sidePanelTween) sidePanelTween.kill();
      card.removeEventListener('pointerdown', onPointerDown);
    },
    flip: toggleFlip,
    setFace: flipToFace,
    nudge: (impulse = 5) => {
      swingVelocityZ += impulse;
      startLoop();
    },
  };
}
