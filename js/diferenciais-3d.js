/* ==========================================================================
   DIFERENCIAIS 3D — Pinned Horizontal Scrollytelling & 8-Card Showcase
   Three.js WebGL + GSAP 3 ScrollTrigger for VL Tech Elite Capabilities:
   1. PERFORMANCE EXTREMA (Supersonic Speedometer / Aerodynamic Rocket)
   2. AUTOMAÇÃO INTELIGENTE (Quantum AI Core & Neural Gyroscope)
   3. DIREÇÃO CRIATIVA F1 (Aerodynamic F1 Winglet & Vortex Flow)
   4. ENTREGA ÁGIL & CONTÍNUA (Continuous CI/CD Möbius Pipeline)
   5. ARQUITETURA DISTRIBUÍDA (Multi-node Microservices Octahedron & Orbital Ring)
   6. TESTES & QA RESILIENTE (Holographic Precision Prism & Scanning Laser Ring)
   7. CYBERSECURITY OFENSIVA (Cybernetic Dodecahedron Shield & Defense Satellites)
   8. SQUAD SÊNIOR DEDICADO (Dual-Helix Founder Pillars & Core Energy Bridge)
   - Strict Black & Red Palette (#0A0A0C / #ff2a2a)
   - 1:1 Horizontal scroll lock releasing immediately after Card 08 exits viewport
   ========================================================================== */

import { gsap, ScrollTrigger, isReady } from './core/gsap.js';

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function initDiferenciais() {
  const section = document.getElementById('galeria');
  if (!section) return null;

  const THREE = window.THREE;
  if (!THREE) {
    console.warn('[diferenciais-3d] Three.js não encontrado.');
    return null;
  }

  const container = section.querySelector('#diferenciais-scroll-container') || section;
  const pinWrapper = section.querySelector('#diferenciais-pin-wrapper') || section;
  const track = section.querySelector('#diferenciaisTrack');
  const cards = section.querySelectorAll('.diferencial-card');

  if (!cards.length || !track) return null;

  // ---------------------------------------------------------------------------
  // 1. TIMELINE DE SCROLLYTELLING PINNED (UNIFIED COM SOLUÇÕES & SERVIÇOS)
  // ---------------------------------------------------------------------------
  let diferencialsTl = null;

  const getScrollDistance = () => {
    const startOffset = track.offsetLeft || 0;
    return Math.max(0, startOffset + track.scrollWidth - window.innerWidth + 80);
  };

  if (!prefersReducedMotion()) {
    diferencialsTl = gsap.to(track, {
      x: () => -getScrollDistance(),
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        pin: pinWrapper,
        start: 'top top',
        end: () => `+=${getScrollDistance()}`,
        scrub: 1,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    cards.forEach((card) => {
      gsap.fromTo(
        card,
        { opacity: 0.82, scale: 0.96 },
        {
          opacity: 1,
          scale: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: card,
            containerAnimation: diferencialsTl,
            start: 'left 95%',
            end: 'left 35%',
            scrub: true,
          },
        }
      );
    });
  }

  // ---------------------------------------------------------------------------
  // 2. CONFIGURAÇÃO DOS CENÁRIOS 3D POR CARD (STRICT BLACK & NEON RED)
  // ---------------------------------------------------------------------------
  const instances = [];

  // Materiais Compartilhados (Strict Black & Red Aesthetic)
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
    renderer.setSize(160, 160);
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
    // CRIAÇÃO DO OBJETO CONFORME O TIPO (8 MODELOS DISTINTOS)
    // -------------------------------------------------------------------------
    if (type === 'performance') {
      // 1. PERFORMANCE EXTREMA: Foguete Aerodinâmico / Turbina Supersônica
      const rocketBodyGeo = new THREE.ConeGeometry(0.75, 2.4, 24);
      const rocketBody = new THREE.Mesh(rocketBodyGeo, chromeMat);
      group.add(rocketBody);

      const speedRingGeo = new THREE.TorusGeometry(1.25, 0.05, 12, 32);
      const speedRing = new THREE.Mesh(speedRingGeo, anodizedRedMat);
      speedRing.rotation.x = Math.PI / 2.5;
      group.add(speedRing);

      for (let i = 0; i < 3; i++) {
        const finGeo = new THREE.BoxGeometry(0.08, 0.7, 0.65);
        const fin = new THREE.Mesh(finGeo, anodizedRedMat);
        fin.position.set(0, -0.7, 0);
        fin.rotation.y = (i * Math.PI * 2) / 3;
        fin.translateX(0.55);
        group.add(fin);
      }

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

      const gyroGeo1 = new THREE.TorusGeometry(1.35, 0.045, 12, 36);
      const gyro1 = new THREE.Mesh(gyroGeo1, chromeMat);
      group.add(gyro1);

      const gyroGeo2 = new THREE.TorusGeometry(1.65, 0.04, 12, 36);
      const gyro2 = new THREE.Mesh(gyroGeo2, darkCarbonMat);
      gyro2.rotation.x = Math.PI / 2;
      group.add(gyro2);

      for (let i = 0; i < 4; i++) {
        const nodeGeo = new THREE.SphereGeometry(0.1, 12, 12);
        const node = new THREE.Mesh(nodeGeo, neonRedGlowMat);
        const ang = (i * Math.PI * 2) / 4;
        node.position.set(Math.cos(ang) * 1.35, Math.sin(ang) * 1.35, 0);
        gyro1.add(node);
      }
    } else if (type === 'criativa') {
      // 3. DIREÇÃO CRIATIVA F1: Asa Dianteira & Aerofólio de F1
      const wingMainGeo = new THREE.BoxGeometry(2.3, 0.12, 0.8);
      const wingMain = new THREE.Mesh(wingMainGeo, darkCarbonMat);
      group.add(wingMain);

      const upperFlapGeo = new THREE.BoxGeometry(2.1, 0.08, 0.4);
      const upperFlap = new THREE.Mesh(upperFlapGeo, anodizedRedMat);
      upperFlap.position.set(0, 0.28, -0.15);
      upperFlap.rotation.x = Math.PI / 10;
      group.add(upperFlap);

      const endplateGeo = new THREE.BoxGeometry(0.08, 0.75, 1.0);
      const endplateL = new THREE.Mesh(endplateGeo, chromeMat);
      endplateL.position.set(-1.18, 0.1, 0);
      group.add(endplateL);

      const endplateR = new THREE.Mesh(endplateGeo, chromeMat);
      endplateR.position.set(1.18, 0.1, 0);
      group.add(endplateR);

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
      group.add(pulse);
    } else if (type === 'cloud') {
      // 5. ARQUITETURA DISTRIBUÍDA & CLOUD: Cluster Multidimensional de Microsserviços
      const octGeo = new THREE.OctahedronGeometry(0.85, 0);
      const oct = new THREE.Mesh(octGeo, anodizedRedMat);
      group.add(oct);

      const wireGeo = new THREE.WireframeGeometry(new THREE.BoxGeometry(1.5, 1.5, 1.5));
      const wireframe = new THREE.LineSegments(
        wireGeo,
        new THREE.LineBasicMaterial({ color: 0xff1e26, transparent: true, opacity: 0.65 })
      );
      group.add(wireframe);

      const ringGeo = new THREE.TorusGeometry(1.5, 0.035, 12, 36);
      const ring = new THREE.Mesh(ringGeo, chromeMat);
      ring.rotation.x = Math.PI / 3;
      group.add(ring);

      for (let i = 0; i < 3; i++) {
        const satNode = new THREE.Mesh(new THREE.SphereGeometry(0.1, 10, 10), neonRedGlowMat);
        const ang = (i * Math.PI * 2) / 3;
        satNode.position.set(Math.cos(ang) * 1.5, Math.sin(ang) * 1.5, 0);
        ring.add(satNode);
      }
    } else if (type === 'qa') {
      // 6. ENGENHARIA DE TESTES & QA: Prisma Geométrico de Precisão e Validação
      const coneGeo = new THREE.ConeGeometry(0.95, 1.9, 6);
      const cone = new THREE.Mesh(coneGeo, chromeMat);
      cone.rotation.x = Math.PI;
      group.add(cone);

      const scanRingGeo = new THREE.TorusGeometry(1.25, 0.04, 12, 32);
      const scanRing = new THREE.Mesh(scanRingGeo, neonRedGlowMat);
      scanRing.rotation.x = Math.PI / 2;
      group.add(scanRing);

      const shieldGeo = new THREE.IcosahedronGeometry(0.48, 0);
      const shield = new THREE.Mesh(shieldGeo, anodizedRedMat);
      shield.position.y = -0.15;
      group.add(shield);
    } else if (type === 'security') {
      // 7. CYBERSECURITY OFENSIVA: Escudo Cibernético & Anéis de Defesa
      const dodefGeo = new THREE.DodecahedronGeometry(0.82, 0);
      const dodef = new THREE.Mesh(dodefGeo, darkCarbonMat);
      group.add(dodef);

      const secRing1 = new THREE.Mesh(new THREE.TorusGeometry(1.35, 0.04, 12, 36), anodizedRedMat);
      secRing1.rotation.y = Math.PI / 4;
      group.add(secRing1);

      const secRing2 = new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.035, 12, 36), chromeMat);
      secRing2.rotation.x = Math.PI / 2;
      group.add(secRing2);

      for (let i = 0; i < 3; i++) {
        const sat = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), neonRedGlowMat);
        const angle = (i * Math.PI * 2) / 3;
        sat.position.set(Math.cos(angle) * 1.6, 0, Math.sin(angle) * 1.6);
        secRing2.add(sat);
      }
    } else if (type === 'squad') {
      // 8. SQUAD SÊNIOR DEDICADO: Núcleo Duplo de Liderança Técnica
      const colL = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 1.8, 16), chromeMat);
      colL.position.x = -0.65;
      group.add(colL);

      const colV = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 1.8, 16), darkCarbonMat);
      colV.position.x = 0.65;
      group.add(colV);

      const bridgeGeo = new THREE.TorusGeometry(1.15, 0.045, 12, 36);
      const bridge = new THREE.Mesh(bridgeGeo, anodizedRedMat);
      bridge.rotation.x = Math.PI / 3;
      group.add(bridge);

      const coreCenter = new THREE.Mesh(new THREE.SphereGeometry(0.38, 16, 16), neonRedGlowMat);
      group.add(coreCenter);
    }

    // Interatividade com Mouse / Hover no Card
    let targetScale = 1.0;
    let currentScale = 1.0;
    let rotSpeedY = 0.008;
    let rotSpeedX = 0.003;

    card.addEventListener('mouseenter', () => {
      targetScale = 1.15;
      rotSpeedY = 0.024;
      rotSpeedX = 0.012;
    });

    card.addEventListener('mouseleave', () => {
      targetScale = 1.0;
      rotSpeedY = 0.008;
      rotSpeedX = 0.003;
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

  // Inicializar cada um dos 8 cards
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

  // Recálculo dinâmico garantido quando fontes personalizadas carregarem
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      ScrollTrigger.refresh();
    });
  }

  // Resize handler
  const onResize = () => ScrollTrigger.refresh();
  window.addEventListener('resize', onResize);
  window.addEventListener('load', onResize);

  return {
    timeline: diferencialsTl,
    refresh: () => ScrollTrigger.refresh(),
    destroy: () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('load', onResize);
      if (animId) cancelAnimationFrame(animId);
      instances.forEach((inst) => inst.destroy());
      if (diferencialsTl) diferencialsTl.kill();
    },
  };
}
