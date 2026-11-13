/* ==========================================================================
   3D ID BADGE (CRACHÁ) — CO-FOUNDERS SHOWCASE
   Ultra-Clean Minimalist Layout with Realistic 3D Pendulum Physics
   Luiz Gabriel (Frente / 0°) ⇄ Victor Whohlers (Verso / 180°)
   
   - Pêndulo Físico com gravidade, inércia, arrasto e arremesso (drag-to-throw)
   - Rotação 3D axial com GSAP 3 easing suave
   - Tilt 3D com acompanhamento do cursor e reflexo especular dinâmico
   - Flexão física do cordão / lanyard suspenso
   - 100% responsivo, acessível por teclado e touch mobile
   ========================================================================== */

import { gsap } from './core/gsap.js';
import { playIgnite } from './sound.js';

const FOUNDERS_DATA = {
  front: {
    key: 'luiz',
    name: 'LUIZ GABRIEL',
    role: 'Especialista em Front-end, Arquitetura Web & Automações',
    idCode: 'VL-ENG-01 · SAO-HQ',
    serial: 'AUTH // 0492-8812-7740-L',
    angleLabel: '0° (LUIZ)',
    flipBtnLabel: 'GIRAR PARA VICTOR (VERSO)',
    targetAngle: 0
  },
  back: {
    key: 'victor',
    name: 'VICTOR WHOHLERS',
    role: 'Especialista em Back-end, Cloud & Lógica de Sistemas',
    idCode: 'VL-ENG-02 · SAO-HQ',
    serial: 'AUTH // 0492-8812-7741-V',
    angleLabel: '180° (VICTOR)',
    flipBtnLabel: 'GIRAR PARA LUIZ (FRENTE)',
    targetAngle: 180
  }
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
  const flipActionBtn = section.querySelector('#badgeFlipActionBtn');
  const flipBtnLabel = section.querySelector('#badgeFlipBtnLabel');
  const angleDisplay = section.querySelector('#badgeAngleDisplay');
  const navLuiz = section.querySelector('#badgeNavLuiz');
  const navVictor = section.querySelector('#badgeNavVictor');

  if (!card || !rig) return null;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Estado da física do Pêndulo (Swing ao redor do topo)
  let swingAngleZ = 0;
  let swingVelocityZ = 0;
  let cardWobbleZ = 0;
  const gravity = 0.16;
  const damping = 0.982;

  // Estado da rotação axial (Frente 0° ⇄ Verso 180°)
  let currentRotationY = 0;
  let targetRotationY = 0;
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
  let throwVelocityY = 0;
  let dragStartTime = 0;

  // 1. Atualização dos indicadores de face (Luiz / Victor)
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
  }

  // 2. Aplicação das matrizes de transformação 3D
  function applyTransforms() {
    // Normalização do ângulo para telemetria
    let normalized = Math.round(((currentRotationY % 360) + 360) % 360);
    const facingFront = normalized <= 90 || normalized >= 270;
    const activeFace = facingFront ? 'front' : 'back';
    updateFaceState(activeFace);

    if (angleDisplay) {
      const label = facingFront ? 'LUIZ' : 'VICTOR';
      angleDisplay.textContent = `${normalized}° (${label})`;
    }

    // Visibilidade das faces para evitar bleed no 3D
    if (faceFront && faceBack) {
      faceFront.style.visibility = facingFront ? 'visible' : 'hidden';
      faceBack.style.visibility = facingFront ? 'hidden' : 'visible';
    }

    // 1. Aplica o balanço do pêndulo no Rig (pivot no topo)
    // O leve deslocamento em Y simula a elevação física do arco do pêndulo
    const swingRad = (swingAngleZ * Math.PI) / 180;
    const arcLiftY = (1 - Math.cos(swingRad)) * -22;
    rig.style.transform = `translateY(${arcLiftY.toFixed(2)}px) rotateZ(${swingAngleZ.toFixed(2)}deg)`;

    // 2. Flexão física do cordão suspenso (lanyard strap)
    if (lanyardStrap) {
      const strapSkew = -(swingAngleZ * 0.35);
      lanyardStrap.style.transform = `skewX(${strapSkew.toFixed(2)}deg)`;
    }

    // 3. Matriz 3D no próprio crachá (oscilação secundária + rotação axial + tilt)
    const totalTiltX = currentTiltX;
    const totalRotationY = currentRotationY + currentTiltY;
    const totalWobbleZ = cardWobbleZ;

    card.style.transform = `rotateX(${totalTiltX.toFixed(2)}deg) rotateY(${totalRotationY.toFixed(2)}deg) rotateZ(${totalWobbleZ.toFixed(2)}deg)`;

    // 4. Reflexo especular dinâmico na superfície acrílica
    if (specular) {
      const sheenX = 50 + (currentTiltY * 2.2) + (swingAngleZ * 1.2);
      const sheenY = 50 - (currentTiltX * 2.2);
      specular.style.background = `radial-gradient(circle at ${sheenX.toFixed(1)}% ${sheenY.toFixed(1)}%, rgba(255, 255, 255, 0.28) 0%, rgba(255, 42, 42, 0.08) 35%, transparent 70%)`;
    }
  }

  // 3. Simulação Física do Pêndulo em Tempo Real (RequestAnimationFrame)
  let rafId;
  let lastTime = performance.now();

  function updatePhysics(time) {
    const dt = Math.min((time - lastTime) / 16.67, 2.5); // delta normalizado a 60fps
    lastTime = time;

    if (!isDragging) {
      // Força restauradora da gravidade no pêndulo: F = -g * sin(theta)
      const swingRad = (swingAngleZ * Math.PI) / 180;
      const restoringForce = -Math.sin(swingRad) * gravity * dt;

      // Amortecimento aerodinâmico
      swingVelocityZ = (swingVelocityZ + restoringForce) * Math.pow(damping, dt);
      swingAngleZ += swingVelocityZ * dt;

      // Oscilação suave e orgânica de ar no estado de repouso (respiração do ambiente)
      if (Math.abs(swingAngleZ) < 0.25 && Math.abs(swingVelocityZ) < 0.05) {
        const ambientDraft = Math.sin(time * 0.0018) * 1.4;
        swingAngleZ += (ambientDraft - swingAngleZ) * 0.04 * dt;
      }

      // Wobble secundário da presilha / cartão
      cardWobbleZ += (swingAngleZ * 0.38 - cardWobbleZ) * 0.14 * dt;
    } else {
      // Durante o arrasto, wobble acompanha suavemente
      cardWobbleZ += (swingAngleZ * 0.45 - cardWobbleZ) * 0.22 * dt;
    }

    applyTransforms();
    rafId = requestAnimationFrame(updatePhysics);
  }

  rafId = requestAnimationFrame(updatePhysics);

  // 4. Interação Física de Arrasto & Arremesso (Drag-to-Throw & Flick)
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
    throwVelocityY = 0;
    dragStartTime = performance.now();

    card.classList.add('is-dragging');

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

    // Calcula velocidade instantânea do arremesso
    throwVelocityX = (clientX - lastClientX);
    throwVelocityY = (clientY - lastClientY);
    lastClientX = clientX;
    lastClientY = clientY;

    // Converte o deslocamento horizontal em ângulo do pêndulo (clamp em 48°)
    swingAngleZ = Math.max(-48, Math.min(48, deltaX * 0.16));
    
    // Pequena inclinação 3D no cartão durante o arrasto
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

    // Injeta impulso do arremesso (throw velocity) no pêndulo
    const flickVelocity = Math.max(-15, Math.min(15, throwVelocityX * 0.35));
    swingVelocityZ += flickVelocity;

    // Retorna o tilt do cartão suavemente para o neutro com GSAP
    gsap.to({ tiltX: currentTiltX, tiltY: currentTiltY }, {
      tiltX: 0,
      tiltY: 0,
      duration: 0.7,
      ease: 'power2.out',
      onUpdate: function () {
        currentTiltX = this.targets()[0].tiltX;
        currentTiltY = this.targets()[0].tiltY;
      }
    });
  }

  card.addEventListener('pointerdown', onPointerDown);

  // 5. Parallax do Mouse no Palco (Efeito de inclinação 3D quando o mouse passeia)
  if (stage && !prefersReduced && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    stage.addEventListener('mousemove', (e) => {
      if (isDragging) return;
      const rect = stage.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 a 0.5
      const relY = (e.clientY - rect.top) / rect.height - 0.5;

      currentTiltY = relX * 16; // Max 16 graus tilt Y
      currentTiltX = -relY * 14; // Max 14 graus tilt X
    });

    stage.addEventListener('mouseleave', () => {
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
    targetRotationY = finalTarget;

    if (flipTween) {
      flipTween.kill();
      flipTween = null;
    }

    // Leve impulso físico no pêndulo causado pelo torque do giro 3D
    swingVelocityZ += (face === 'back' ? -2.0 : 2.0);

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
      }
    });
  }

  function toggleFlip() {
    let mod = ((currentRotationY % 360) + 360) % 360;
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

  // Clique rápido no crachá também gira (se não foi um arrasto)
  card.addEventListener('click', (e) => {
    if (e.target.closest('a, button')) return;
    if (Math.abs(lastClientX - dragStartX) < 8 && Math.abs(lastClientY - dragStartY) < 8) {
      toggleFlip();
    }
  });

  // Acessibilidade via teclado
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleFlip();
    }
  });

  // Inicialização no ângulo 0° (Luiz)
  applyTransforms();

  return {
    destroy: () => {
      cancelAnimationFrame(rafId);
      if (flipTween) flipTween.kill();
      card.removeEventListener('pointerdown', onPointerDown);
    },
    flip: toggleFlip,
    setFace: flipToFace,
    nudge: (impulse = 5) => { swingVelocityZ += impulse; }
  };
}
