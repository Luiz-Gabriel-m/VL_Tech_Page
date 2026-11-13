/* ==========================================================================
   3D ID BADGE (CRACHÁ) — CO-FOUNDERS SHOWCASE
   Luiz Gabriel (Frente / 0°) ⇄ Victor Whohlers (Verso / 180°)
   
   - Rotação 3D com física realista, GSAP 3 easing, arrasto (drag/throw) e inércia
   - Tilt 3D com acompanhamento do cursor e reflexo especular dinâmico
   - Oscilação física do cordão / lanyard suspenso
   - Sincronização em tempo real com painéis HUD de telemetria e botões de contato
   - Compatível com GSAP 3, acessibilidade (teclado/leitor de tela) e touch mobile
   ========================================================================== */

import { gsap } from './core/gsap.js';
import { playIgnite } from './sound.js';

const FOUNDERS_DATA = {
  front: {
    key: 'luiz',
    index: '01 / 02',
    nameFirst: 'LUIZ',
    nameLast: 'GABRIEL',
    role: 'Especialista em Front-end, Arquitetura Web & Automações',
    bio: 'Transforma arquitetura em experiência: interfaces WebGL de alta performance, design systems escaláveis e automações inteligentes com foco em conversão e retenção.',
    clearance: 'LEVEL 05 // SYSTEM ROOT',
    idCode: 'VL-ENG-01 · SAO-HQ',
    stack: [
      'WebGL / Three.js',
      'GSAP 3 Animation',
      'Next.js & Tailwind',
      'Design Systems',
      'Automações n8n/AI'
    ],
    waUrl: 'https://wa.me/5511999999999?text=Ol%C3%A1%20Luiz%20Gabriel%2C%20gostaria%20de%20conversar%20sobre%20um%20projeto%20com%20a%20VL%20Tech',
    waText: 'Falar com Luiz no WhatsApp',
    linkedinUrl: 'https://www.linkedin.com/in/luiz-gabriel-moraes/',
    targetAngle: 0,
    flipBtnLabel: 'GIRAR PARA VICTOR (VERSO)'
  },
  back: {
    key: 'victor',
    index: '02 / 02',
    nameFirst: 'VICTOR',
    nameLast: 'WHOHLERS',
    role: 'Especialista em Back-end, Cloud & Lógica de Sistemas',
    bio: 'Arquiteta a espinha dorsal das operações: APIs distribuídas, microsserviços de alto volume, bancos de dados escaláveis e infraestrutura cloud de máxima disponibilidade.',
    clearance: 'LEVEL 05 // SYSTEM ROOT',
    idCode: 'VL-ENG-02 · SAO-HQ',
    stack: [
      'Cloud AWS / GCP',
      'Docker & Kubernetes',
      'APIs Distribuídas',
      'PostgreSQL & Redis',
      'Segurança & Criptografia'
    ],
    waUrl: 'https://wa.me/5511999999999?text=Ol%C3%A1%20Victor%20Whohlers%2C%20gostaria%20de%20conversar%20sobre%20arquitetura%20cloud%20com%20a%20VL%20Tech',
    waText: 'Falar com Victor no WhatsApp',
    linkedinUrl: 'https://www.linkedin.com/in/victor-whohlers/',
    targetAngle: 180,
    flipBtnLabel: 'GIRAR PARA LUIZ (FRENTE)'
  }
};

export function initBadge3D() {
  const section = document.querySelector('.founders-badge-section') || document.getElementById('socios-scrolly');
  if (!section) return null;

  const stage = section.querySelector('#badge3dStage');
  const card = section.querySelector('#badgeCard3d');
  const faceFront = section.querySelector('#badgeFaceFront');
  const faceBack = section.querySelector('#badgeFaceBack');
  const lanyardStrap = section.querySelector('#badgeLanyardStrap');
  const specular = section.querySelector('#badgeSpecularGlare');
  const flipActionBtn = section.querySelector('#badgeFlipActionBtn');
  const flipBtnLabel = section.querySelector('#badgeFlipBtnLabel');
  const navLuiz = section.querySelector('#badgeNavLuiz');
  const navVictor = section.querySelector('#badgeNavVictor');

  // Elementos do painel esquerdo
  const metaIndex = section.querySelector('#founderMetaIndex');
  const metaClearance = section.querySelector('#founderMetaClearance');
  const metaNameFirst = section.querySelector('#founderMetaName .name-first');
  const metaNameLast = section.querySelector('#founderMetaName .name-last');
  const metaRole = section.querySelector('#founderMetaRole');
  const metaBio = section.querySelector('#founderMetaBio');
  const metaStack = section.querySelector('#founderMetaStack');
  const waBtn = section.querySelector('#badgeFounderWaBtn');
  const waBtnText = section.querySelector('#badgeWaBtnText');
  const linkedinBtn = section.querySelector('#badgeFounderLinkedinBtn');

  // Elementos do painel direito
  const angleDisplay = section.querySelector('#badgeAngleDisplay');
  const angleFill = section.querySelector('#badgeAngleFill');

  if (!card) return null;

  // Estado da rotação e física
  let currentRotationY = 0;
  let targetRotationY = 0;
  let currentTiltX = 0;
  let currentTiltY = 0;
  let isDragging = false;
  let dragStartX = 0;
  let dragStartRot = 0;
  let lastDragX = 0;
  let dragVelocity = 0;
  let currentFace = 'front'; // 'front' | 'back'
  let flipTween = null;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. Atualização do DOM dos dados do co-founder ativo
  function updateActiveFounderInfo(face) {
    if (currentFace === face && metaNameFirst?.textContent === FOUNDERS_DATA[face].nameFirst) return;
    currentFace = face;
    const data = FOUNDERS_DATA[face];

    section.dataset.activeFounder = data.key;

    // Atualiza botões de topo
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

    // Transição suave no painel esquerdo
    if (metaNameFirst && metaNameLast) {
      gsap.to(['#badgeDynamicProfile'], {
        opacity: 0.45,
        y: 6,
        duration: 0.15,
        ease: 'power2.in',
        onComplete: () => {
          if (metaIndex) metaIndex.innerHTML = `<span class="text-red">${data.index.split(' / ')[0]}</span> / ${data.index.split(' / ')[1]}`;
          if (metaClearance) metaClearance.textContent = data.clearance;
          metaNameFirst.textContent = data.nameFirst;
          metaNameLast.textContent = data.nameLast;
          if (metaRole) metaRole.textContent = data.role;
          if (metaBio) metaBio.textContent = data.bio;

          if (metaStack) {
            metaStack.innerHTML = data.stack
              .map((tag) => `<li class="pillar-tag">${tag}</li>`)
              .join('');
          }

          if (waBtn) {
            waBtn.href = data.waUrl;
            if (waBtnText) waBtnText.textContent = data.waText;
          }
          if (linkedinBtn) {
            linkedinBtn.href = data.linkedinUrl;
          }

          gsap.to(['#badgeDynamicProfile'], {
            opacity: 1,
            y: 0,
            duration: 0.25,
            ease: 'power2.out',
          });
        },
      });
    }
  }

  // 2. Renderização da Rotação 3D & Especular
  function applyTransforms() {
    // Normaliza ângulo para exibição no HUD (0° a 360°)
    let normalized = Math.round(((currentRotationY % 360) + 360) % 360);
    const facingFront = normalized <= 90 || normalized >= 270;
    const activeFace = facingFront ? 'front' : 'back';

    updateActiveFounderInfo(activeFace);

    if (angleDisplay) {
      const label = facingFront ? 'LUIZ' : 'VICTOR';
      angleDisplay.textContent = `${normalized}° (${label})`;
    }
    if (angleFill) {
      angleFill.style.width = `${(normalized / 360) * 100}%`;
    }

    // Garante alternância visual nítida e sem bleed entre faces
    if (faceFront && faceBack) {
      faceFront.style.visibility = facingFront ? 'visible' : 'hidden';
      faceBack.style.visibility = facingFront ? 'hidden' : 'visible';
    }

    // Aplica matriz 3D ao crachá
    card.style.transform = `rotateX(${currentTiltX.toFixed(2)}deg) rotateY(${(currentRotationY + currentTiltY).toFixed(2)}deg)`;

    // Aplica deformação sutil ao cordão suspenso
    if (lanyardStrap) {
      const strapBend = (currentTiltY * 0.4) + Math.sin((currentRotationY * Math.PI) / 180) * 6;
      lanyardStrap.style.transform = `skewX(${strapBend.toFixed(2)}deg)`;
    }

    // Atualiza reflexo especular na superfície plástica
    if (specular) {
      const sheenX = 50 + currentTiltY * 2.5;
      const sheenY = 50 - currentTiltX * 2.5;
      specular.style.background = `radial-gradient(circle at ${sheenX}% ${sheenY}%, rgba(255, 255, 255, 0.25) 0%, rgba(255, 42, 42, 0.08) 35%, transparent 70%)`;
    }
  }

  // 3. Loop de Física & Amortecimento
  let rafId;
  function updatePhysics() {
    if (!isDragging && !flipTween) {
      if (Math.abs(dragVelocity) > 0.05) {
        currentRotationY += dragVelocity;
        dragVelocity *= 0.92; // fricção
        targetRotationY = currentRotationY;
        applyTransforms();
      } else if (Math.abs(targetRotationY - currentRotationY) > 0.01) {
        currentRotationY += (targetRotationY - currentRotationY) * 0.12;
        applyTransforms();
      }
    } else if (isDragging) {
      currentRotationY = targetRotationY;
      applyTransforms();
    }

    rafId = requestAnimationFrame(updatePhysics);
  }

  rafId = requestAnimationFrame(updatePhysics);

  // 4. Interação de Arrasto (Mouse & Touch Drag)
  function onPointerDown(e) {
    if (e.target.closest('a, button')) return;

    if (flipTween) {
      flipTween.kill();
      flipTween = null;
    }

    isDragging = true;
    dragStartX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    dragStartRot = currentRotationY;
    lastDragX = dragStartX;
    dragVelocity = 0;
    card.classList.add('is-dragging');

    window.addEventListener('pointermove', onPointerMove, { passive: false });
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
  }

  function onPointerMove(e) {
    if (!isDragging) return;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const deltaX = clientX - dragStartX;
    dragVelocity = (clientX - lastDragX) * 0.8;
    lastDragX = clientX;

    targetRotationY = dragStartRot + deltaX * 0.65;
  }

  function onPointerUp() {
    if (!isDragging) return;
    isDragging = false;
    card.classList.remove('is-dragging');

    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);
    window.removeEventListener('pointercancel', onPointerUp);

    // Snap automático com GSAP para a face mais próxima (0° ou 180°)
    if (Math.abs(dragVelocity) < 1.2) {
      let mod = ((currentRotationY % 360) + 360) % 360;
      let snapTarget;
      if (mod > 90 && mod < 270) {
        snapTarget = 180;
      } else {
        snapTarget = mod >= 270 ? 360 : 0;
      }
      const fullRotations = Math.floor(currentRotationY / 360) * 360;
      const finalSnap = fullRotations + snapTarget;

      const rotObj = { r: currentRotationY };
      flipTween = gsap.to(rotObj, {
        r: finalSnap,
        duration: 0.6,
        ease: 'power3.out',
        onUpdate: () => {
          currentRotationY = rotObj.r;
          targetRotationY = currentRotationY;
          applyTransforms();
        },
        onComplete: () => {
          flipTween = null;
        }
      });
    }
  }

  card.addEventListener('pointerdown', onPointerDown);

  // 5. Tilt 3D com Parallax do Mouse no Palco
  if (stage && !prefersReduced && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    stage.addEventListener('mousemove', (e) => {
      const rect = stage.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 a 0.5
      const relY = (e.clientY - rect.top) / rect.height - 0.5;

      currentTiltY = relX * 18; // Max 18 graus tilt Y
      currentTiltX = -relY * 16; // Max 16 graus tilt X
      applyTransforms();
    });

    stage.addEventListener('mouseleave', () => {
      gsap.to({ tiltX: currentTiltX, tiltY: currentTiltY }, {
        tiltX: 0,
        tiltY: 0,
        duration: 0.6,
        ease: 'power2.out',
        onUpdate: function () {
          currentTiltX = this.targets()[0].tiltX;
          currentTiltY = this.targets()[0].tiltY;
          applyTransforms();
        },
      });
    });
  }

  // 6. Botão de Giro 3D Rápido (Click to Flip com GSAP 3)
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
    dragVelocity = 0;

    if (flipTween) {
      flipTween.kill();
      flipTween = null;
    }

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

  // Clique simples no próprio crachá também gira
  card.addEventListener('click', (e) => {
    if (Math.abs(lastDragX - dragStartX) < 5) {
      toggleFlip();
    }
  });

  // Acessibilidade via teclado (Enter ou Barra de Espaço)
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleFlip();
    }
  });

  // Inicialização com Luiz Gabriel (0°)
  applyTransforms();

  return {
    destroy: () => {
      cancelAnimationFrame(rafId);
      if (flipTween) flipTween.kill();
      card.removeEventListener('pointerdown', onPointerDown);
    },
    flip: toggleFlip,
    setFace: flipToFace,
  };
}
