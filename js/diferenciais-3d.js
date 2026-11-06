/* ==========================================================================
   DIFERENCIAIS 3D — Interactive "Nano Banana" Style Feature Showcase
   Three.js WebGL + GSAP 3 ScrollTrigger for VL Tech Competitive Advantages:
   1. PERFORMANCE EXTREMA (Supersonic Speedometer / Aerodynamic Rocket)
   2. AUTOMAÇÃO INTELIGENTE (Quantum AI Core & Neural Gyroscope)
   3. DIREÇÃO CRIATIVA F1 (Aerodynamic F1 Winglet & Vortex Flow)
   4. ENTREGA ÁGIL & CONTÍNUA (Continuous CI/CD Möbius Pipeline)
   ========================================================================== */

import { gsap, ScrollTrigger, isReady } from './core/gsap.js';

export function initDiferenciais() {
  const section = document.getElementById('galeria');
  if (!section) return null;

  const THREE = window.THREE;
  if (!THREE) {
    console.warn('[diferenciais-3d] Three.js não encontrado.');
    return null;
  }

  const cards = section.querySelectorAll('.diferencial-card');
  if (!cards.length) return null;

  // ---------------------------------------------------------------------------
  // 1. ANIMAÇÃO DE ENTRADA ESCALONADA (GSAP SCROLLTRIGGER)
  // ---------------------------------------------------------------------------
  const header = section.querySelector('.section__header');
  if (header) {
    gsap.from(header.children, {
      scrollTrigger: {
        trigger: section,
        start: 'top 82%',
        toggleActions: 'play none none none',
      },
      y: 40,
      opacity: 0,
      duration: 0.9,
      stagger: 0.12,
      ease: 'power3.out',
    });
  }

  gsap.from(cards, {
    scrollTrigger: {
      trigger: section.querySelector('.diferenciais-grid') || section,
      start: 'top 78%',
      toggleActions: 'play none none none',
    },
    y: 55,
    opacity: 0,
    duration: 1.0,
    stagger: 0.14,
    ease: 'power3.out',
  });

  // ---------------------------------------------------------------------------
  // 2. CONFIGURAÇÃO DOS CENÁRIOS 3D POR CARD ("NANO BANANA" LIQUID METALLIC)
  // ---------------------------------------------------------------------------
  const instances = [];

  // Materiais Compartilhados
  const chromeMat = new THREE.MeshStandardMaterial({
    color: 0xeeeeee,
    metalness: 0.96,
    roughness: 0.14,
  });

  const darkCarbonMat = new THREE.MeshStandardMaterial({
    color: 0x14141a,
    metalness: 0.85,
    roughness: 0.25,
  });

  const anodizedRedMat = new THREE.MeshStandardMaterial({
    color: 0xff1e26,
    metalness: 0.85,
    roughness: 0.2,
    emissive: 0xff1e26,
    emissiveIntensity: 0.45,
  });

  const neonRedGlowMat = new THREE.MeshStandardMaterial({
    color: 0xff1e26,
    emissive: 0xff1e26,
    emissiveIntensity: 2.2,
    metalness: 0.1,
    roughness: 0.3,
  });

  const neonLimeMat = new THREE.MeshStandardMaterial({
    color: 0xd2ff00,
    emissive: 0xd2ff00,
    emissiveIntensity: 1.4,
    metalness: 0.2,
    roughness: 0.3,
  });

  // Função para criar uma cena Three.js individual em um canvas
  function setupCard3D(card, type) {
    const canvas = card.querySelector('.diferencial-canvas');
    if (!canvas) return null;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(180, 180);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 5.8);

    // Iluminação de Estúdio com Destaques Metálicos
    const amb = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(amb);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 2.5);
    dirLight1.position.set(4, 5, 4);
    scene.add(dirLight1);

    const redLight = new THREE.PointLight(0xff1e26, 4.0, 12);
    redLight.position.set(-3, -2, 3);
    scene.add(redLight);

    const group = new THREE.Group();
    scene.add(group);

    // -------------------------------------------------------------------------
    // CRIAÇÃO DO OBJETO CONFORME O TIPO
    // -------------------------------------------------------------------------
    if (type === 'performance') {
      // 1. PERFORMANCE EXTREMA: Foguete Aerodinâmico / Turbina Supersônica
      const rocketBodyGeo = new THREE.ConeGeometry(0.75, 2.4, 24);
      const rocketBody = new THREE.Mesh(rocketBodyGeo, chromeMat);
      group.add(rocketBody);

      // Anel de velocidade / telemetria
      const speedRingGeo = new THREE.TorusGeometry(1.25, 0.05, 12, 32);
      const speedRing = new THREE.Mesh(speedRingGeo, anodizedRedMat);
      speedRing.rotation.x = Math.PI / 2.5;
      group.add(speedRing);

      // Aletas traseiras
      for (let i = 0; i < 3; i++) {
        const finGeo = new THREE.BoxGeometry(0.08, 0.7, 0.65);
        const fin = new THREE.Mesh(finGeo, anodizedRedMat);
        fin.position.set(0, -0.7, 0);
        fin.rotation.y = (i * Math.PI * 2) / 3;
        fin.translateX(0.55);
        group.add(fin);
      }

      // Propulsor Neon
      const nozzleGeo = new THREE.CylinderGeometry(0.35, 0.45, 0.35, 16);
      const nozzle = new THREE.Mesh(nozzleGeo, neonRedGlowMat);
      nozzle.position.y = -1.15;
      group.add(nozzle);

      group.rotation.z = -Math.PI / 6;
      group.rotation.x = Math.PI / 8;
    } else if (type === 'automacao') {
      // 2. AUTOMAÇÃO INTELIGENTE: Núcleo Quântico de IA & Giroscópio
      const coreGeo = new THREE.IcosahedronGeometry(0.85, 1);
      const core = new THREE.Mesh(coreGeo, anodizedRedMat);
      group.add(core);

      const innerGlowGeo = new THREE.SphereGeometry(0.45, 16, 16);
      const innerGlow = new THREE.Mesh(innerGlowGeo, neonRedGlowMat);
      group.add(innerGlow);

      // Anéis Giroscópicos
      const gyroGeo1 = new THREE.TorusGeometry(1.35, 0.045, 12, 36);
      const gyro1 = new THREE.Mesh(gyroGeo1, chromeMat);
      group.add(gyro1);

      const gyroGeo2 = new THREE.TorusGeometry(1.65, 0.04, 12, 36);
      const gyro2 = new THREE.Mesh(gyroGeo2, darkCarbonMat);
      gyro2.rotation.x = Math.PI / 2;
      group.add(gyro2);

      // Nós orbitais
      for (let i = 0; i < 4; i++) {
        const nodeGeo = new THREE.SphereGeometry(0.1, 12, 12);
        const node = new THREE.Mesh(nodeGeo, neonLimeMat);
        const ang = (i * Math.PI * 2) / 4;
        node.position.set(Math.cos(ang) * 1.35, Math.sin(ang) * 1.35, 0);
        gyro1.add(node);
      }
    } else if (type === 'criativa') {
      // 3. DIREÇÃO CRIATIVA F1: Asa Dianteira & Aerofólio de F1
      const wingMainGeo = new THREE.BoxGeometry(2.3, 0.12, 0.8);
      const wingMain = new THREE.Mesh(wingMainGeo, darkCarbonMat);
      group.add(wingMain);

      // Lâmina superior aerodinâmica
      const upperFlapGeo = new THREE.BoxGeometry(2.1, 0.08, 0.4);
      const upperFlap = new THREE.Mesh(upperFlapGeo, anodizedRedMat);
      upperFlap.position.set(0, 0.28, -0.15);
      upperFlap.rotation.x = Math.PI / 10;
      group.add(upperFlap);

      // Endplates laterais (Aletas verticais com detalhe neon)
      const endplateGeo = new THREE.BoxGeometry(0.08, 0.75, 1.0);
      const endplateL = new THREE.Mesh(endplateGeo, chromeMat);
      endplateL.position.set(-1.18, 0.1, 0);
      group.add(endplateL);

      const endplateR = new THREE.Mesh(endplateGeo, chromeMat);
      endplateR.position.set(1.18, 0.1, 0);
      group.add(endplateR);

      // Linha de fluxo aerodinâmico neon
      const flowGeo = new THREE.TorusGeometry(1.2, 0.03, 8, 32, Math.PI * 1.2);
      const flow = new THREE.Mesh(flowGeo, neonRedGlowMat);
      flow.rotation.x = Math.PI / 3;
      flow.position.y = 0.2;
      group.add(flow);

      group.rotation.x = Math.PI / 6;
      group.rotation.y = -Math.PI / 8;
    } else if (type === 'agil') {
      // 4. ENTREGA ÁGIL & CONTÍNUA: Nó de Möbius / Infinity CI/CD Pipeline
      const knotGeo = new THREE.TorusKnotGeometry(0.95, 0.28, 90, 16, 2, 3);
      const knot = new THREE.Mesh(knotGeo, chromeMat);
      group.add(knot);

      const ringOuterGeo = new THREE.TorusGeometry(1.6, 0.035, 12, 36);
      const ringOuter = new THREE.Mesh(ringOuterGeo, anodizedRedMat);
      ringOuter.rotation.x = Math.PI / 4;
      group.add(ringOuter);

      const pulseGeo = new THREE.SphereGeometry(0.12, 12, 12);
      const pulse = new THREE.Mesh(pulseGeo, neonRedGlowMat);
      pulse.position.set(1.6, 0, 0);
      ringOuter.add(pulse);
    }

    // -------------------------------------------------------------------------
    // ESTADO DE INTERAÇÃO (HOVER PHYSICS & TILT)
    // -------------------------------------------------------------------------
    let isHovered = false;
    let targetScale = 1.0;
    let currentScale = 1.0;
    let rotSpeedX = 0.008;
    let rotSpeedY = 0.012;

    card.addEventListener('pointerenter', () => {
      isHovered = true;
      targetScale = 1.18;
      rotSpeedY = 0.035;
      gsap.to(redLight, { intensity: 7.0, duration: 0.35 });
    });

    card.addEventListener('pointerleave', () => {
      isHovered = false;
      targetScale = 1.0;
      rotSpeedY = 0.012;
      gsap.to(redLight, { intensity: 4.0, duration: 0.35 });
    });

    // 3D Tilt sutil no Card ao mover o mouse
    card.addEventListener('pointermove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      gsap.to(card, {
        rotationY: x * 10,
        rotationX: -y * 10,
        duration: 0.3,
        ease: 'power2.out',
        transformPerspective: 900,
      });

      // Leve parallax no objeto 3D
      group.rotation.x = y * 0.8;
      group.rotation.y = x * 1.2;
    });

    card.addEventListener('pointerleave', () => {
      gsap.to(card, {
        rotationY: 0,
        rotationX: 0,
        duration: 0.6,
        ease: 'power3.out',
      });
    });

    return {
      renderer,
      scene,
      camera,
      group,
      update: () => {
        // Rotação contínua elegante
        group.rotation.y += rotSpeedY;
        group.rotation.x += rotSpeedX;

        // Lerp na escala do objeto
        currentScale += (targetScale - currentScale) * 0.12;
        group.scale.set(currentScale, currentScale, currentScale);

        renderer.render(scene, camera);
      },
      destroy: () => {
        renderer.dispose();
      },
    };
  }

  // Inicializar cada um dos 4 cards
  cards.forEach((card) => {
    const type = card.dataset.diferencialType;
    const inst = setupCard3D(card, type);
    if (inst) instances.push(inst);
  });

  // ---------------------------------------------------------------------------
  // 3. LOOP DE RENDERIZAÇÃO 60 FPS
  // ---------------------------------------------------------------------------
  let animId = null;
  let isSectionVisible = true;

  ScrollTrigger.create({
    trigger: section,
    start: 'top bottom',
    end: 'bottom top',
    onToggle: (self) => {
      isSectionVisible = self.isActive;
    },
  });

  function renderLoop() {
    animId = requestAnimationFrame(renderLoop);
    if (!isSectionVisible) return;

    for (let i = 0; i < instances.length; i++) {
      instances[i].update();
    }
  }

  renderLoop();

  return {
    destroy: () => {
      if (animId) cancelAnimationFrame(animId);
      instances.forEach((inst) => inst.destroy());
    },
  };
}
