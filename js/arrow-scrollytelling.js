/* ==========================================================================
   ARROW SCROLLYTELLING — The Arrow of Execution ("A Flecha da Execução")
   Three.js WebGL 3D Interactive Scrollytelling Experience for VL Tech
   - Bow & Arrow Metaphor: A Ideia (Notched Arrow) -> A Execução (Bow Draw & Launch)
   - 360-Degree Interactive Inspection: Rotação livre por toque e arraste no início
   - Obstacle Avoidance: Bugs, Preço Abusivo, Falta de Execução, Baixa Qualidade
   - Ultimate Target: Fazer Tudo com a VL Tech (Dead-center bullseye impact)
   - Layout Desobstruído: Cards ancorados na margem, deixando o alvo 100% visível
   - GSAP 3 + ScrollTrigger pinned 60fps cinematic flight choreography
   ========================================================================== */

import { gsap, ScrollTrigger, isReady } from './core/gsap.js';

export function initArrowScrollytelling() {
  const section = document.getElementById('tracks');
  const canvas = document.getElementById('arrowCanvas');
  const pinViewport = document.getElementById('arrowPinViewport');

  if (!section || !canvas || !pinViewport) {
    return null;
  }

  const THREE = window.THREE;
  if (!THREE) {
    console.warn('[arrow-scrollytelling] Three.js não encontrado.');
    return null;
  }

  // ---------------------------------------------------------------------------
  // 1. SETUP DO RENDERER & CENA THREE.JS
  // ---------------------------------------------------------------------------
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(pinViewport.clientWidth, pinViewport.clientHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.35;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0a0a0c, 0.024);

  const camera = new THREE.PerspectiveCamera(
    52,
    pinViewport.clientWidth / Math.max(pinViewport.clientHeight, 1),
    0.1,
    600
  );
  camera.position.set(0, 1.2, 5.5);

  // ---------------------------------------------------------------------------
  // 2. ILUMINAÇÃO CINEMATOGRÁFICA (VERMELHO VL TECH & BRANCO NEUTRO)
  // ---------------------------------------------------------------------------
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
  scene.add(ambientLight);

  const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
  keyLight.position.set(5, 10, 7);
  scene.add(keyLight);

  const redFillLight = new THREE.PointLight(0xff1e26, 4.8, 70);
  redFillLight.position.set(-4, 3, -10);
  scene.add(redFillLight);

  const targetLight = new THREE.PointLight(0xff1e26, 6.5, 90);
  targetLight.position.set(0, 0, -150);
  scene.add(targetLight);

  // ---------------------------------------------------------------------------
  // 3. MATERIAIS CYBERNETIC DARK & NEON RED
  // ---------------------------------------------------------------------------
  const carbonMaterial = new THREE.MeshStandardMaterial({
    color: 0x141419,
    metalness: 0.88,
    roughness: 0.22,
  });

  const chromeMaterial = new THREE.MeshStandardMaterial({
    color: 0xcccccc,
    metalness: 0.95,
    roughness: 0.12,
  });

  const neonRedMaterial = new THREE.MeshStandardMaterial({
    color: 0xff1e26,
    emissive: 0xff1e26,
    emissiveIntensity: 1.8,
    metalness: 0.2,
    roughness: 0.2,
  });

  const glowingWireMaterial = new THREE.MeshBasicMaterial({
    color: 0xff2a2a,
    wireframe: true,
    transparent: true,
    opacity: 0.45,
  });

  // ---------------------------------------------------------------------------
  // 4. CONSTRUÇÃO DO ARCO PROCEDURAL (THE BOW // A EXECUÇÃO)
  // ---------------------------------------------------------------------------
  const bowGroup = new THREE.Group();
  scene.add(bowGroup);

  function createBowLimbCurve(isUpper) {
    const dir = isUpper ? 1 : -1;
    const points = [
      new THREE.Vector3(0, dir * 0.4, 0),
      new THREE.Vector3(0, dir * 1.5, 0.4),
      new THREE.Vector3(0, dir * 2.5, 0.2),
      new THREE.Vector3(0, dir * 3.3, -0.2),
    ];
    return new THREE.CatmullRomCurve3(points);
  }

  const upperCurve = createBowLimbCurve(true);
  const lowerCurve = createBowLimbCurve(false);

  const upperLimbGeo = new THREE.TubeGeometry(upperCurve, 32, 0.08, 10, false);
  const lowerLimbGeo = new THREE.TubeGeometry(lowerCurve, 32, 0.08, 10, false);

  const upperLimbMesh = new THREE.Mesh(upperLimbGeo, carbonMaterial);
  const lowerLimbMesh = new THREE.Mesh(lowerLimbGeo, carbonMaterial);
  bowGroup.add(upperLimbMesh);
  bowGroup.add(lowerLimbMesh);

  const riserGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.9, 16);
  const riserMesh = new THREE.Mesh(riserGeo, carbonMaterial);
  bowGroup.add(riserMesh);

  const riserGripGeo = new THREE.CylinderGeometry(0.13, 0.13, 0.4, 16);
  const riserGripMesh = new THREE.Mesh(riserGripGeo, neonRedMaterial);
  bowGroup.add(riserGripMesh);

  const camGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.06, 16);
  camGeo.rotateZ(Math.PI / 2);

  const upperCam = new THREE.Mesh(camGeo, chromeMaterial);
  upperCam.position.set(0, 3.3, -0.2);
  bowGroup.add(upperCam);

  const lowerCam = new THREE.Mesh(camGeo, chromeMaterial);
  lowerCam.position.set(0, -3.3, -0.2);
  bowGroup.add(lowerCam);

  const stringMaterial = new THREE.LineBasicMaterial({
    color: 0xff3b42,
    linewidth: 2,
    transparent: true,
    opacity: 0.9,
  });

  const upperStringGeo = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, 3.3, -0.2),
    new THREE.Vector3(0, 0, 0),
  ]);
  const lowerStringGeo = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, -3.3, -0.2),
    new THREE.Vector3(0, 0, 0),
  ]);

  const upperString = new THREE.Line(upperStringGeo, stringMaterial);
  const lowerString = new THREE.Line(lowerStringGeo, stringMaterial);
  bowGroup.add(upperString);
  bowGroup.add(lowerString);

  bowGroup.position.set(0, 0, 0);

  // ---------------------------------------------------------------------------
  // 5. CONSTRUÇÃO DA FLECHA PROCEDURAL (THE ARROW // A IDEIA EM MOVIMENTO)
  // ---------------------------------------------------------------------------
  const arrowGroup = new THREE.Group();
  scene.add(arrowGroup);

  const shaftLength = 3.6;
  const shaftGeo = new THREE.CylinderGeometry(0.045, 0.045, shaftLength, 16);
  shaftGeo.rotateX(Math.PI / 2);
  const shaftMesh = new THREE.Mesh(shaftGeo, carbonMaterial);
  arrowGroup.add(shaftMesh);

  const ringGeo = new THREE.TorusGeometry(0.052, 0.012, 8, 16);
  const ring1 = new THREE.Mesh(ringGeo, neonRedMaterial);
  ring1.position.z = -0.5;
  const ring2 = new THREE.Mesh(ringGeo, neonRedMaterial);
  ring2.position.z = 0.5;
  arrowGroup.add(ring1);
  arrowGroup.add(ring2);

  const tipGeo = new THREE.ConeGeometry(0.18, 0.75, 4);
  tipGeo.rotateX(-Math.PI / 2);
  tipGeo.rotateZ(Math.PI / 4);
  const tipMesh = new THREE.Mesh(tipGeo, chromeMaterial);
  tipMesh.position.set(0, 0, -shaftLength / 2 - 0.35);
  arrowGroup.add(tipMesh);

  const tipCoreGeo = new THREE.SphereGeometry(0.07, 12, 12);
  const tipCoreMesh = new THREE.Mesh(tipCoreGeo, neonRedMaterial);
  tipCoreMesh.position.set(0, 0, -shaftLength / 2 - 0.2);
  arrowGroup.add(tipCoreMesh);

  const fletchingShape = new THREE.Shape();
  fletchingShape.moveTo(0, 0);
  fletchingShape.lineTo(0.35, -0.6);
  fletchingShape.lineTo(0.35, -1.1);
  fletchingShape.lineTo(0, -0.9);
  fletchingShape.closePath();

  const fletchExtrudeSettings = { depth: 0.02, bevelEnabled: false };
  const fletchGeo = new THREE.ExtrudeGeometry(fletchingShape, fletchExtrudeSettings);
  fletchGeo.rotateX(-Math.PI / 2);

  for (let i = 0; i < 3; i++) {
    const fletchMesh = new THREE.Mesh(fletchGeo, neonRedMaterial);
    fletchMesh.position.set(0, 0, shaftLength / 2);
    fletchMesh.rotation.z = (i * Math.PI * 2) / 3;
    arrowGroup.add(fletchMesh);
  }

  const nockGeo = new THREE.CylinderGeometry(0.048, 0.048, 0.3, 12);
  nockGeo.rotateX(Math.PI / 2);
  const nockMesh = new THREE.Mesh(nockGeo, chromeMaterial);
  nockMesh.position.set(0, 0, shaftLength / 2 + 0.15);
  arrowGroup.add(nockMesh);

  const thrusterCount = 60;
  const thrusterGeo = new THREE.BufferGeometry();
  const thrusterPos = new Float32Array(thrusterCount * 3);
  for (let i = 0; i < thrusterCount; i++) {
    thrusterPos[i * 3] = (Math.random() - 0.5) * 0.12;
    thrusterPos[i * 3 + 1] = (Math.random() - 0.5) * 0.12;
    thrusterPos[i * 3 + 2] = shaftLength / 2 + Math.random() * 2.5;
  }
  thrusterGeo.setAttribute('position', new THREE.BufferAttribute(thrusterPos, 3));
  const thrusterMat = new THREE.PointsMaterial({
    color: 0xff1e26,
    size: 0.08,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
  });
  const thrusterParticles = new THREE.Points(thrusterGeo, thrusterMat);
  arrowGroup.add(thrusterParticles);

  arrowGroup.position.set(0, 0, 0);

  // ---------------------------------------------------------------------------
  // 6. OS 4 BLOCOS DE OBSTÁCULOS (MARKET HAZARDS / DESAFIOS)
  // ---------------------------------------------------------------------------
  const obstacles = [];

  const obstacleData = [
    {
      id: 'bugs',
      name: 'Bugs & Instabilidade',
      sub: 'Arquiteturas frágeis e falhas em produção',
      pos: new THREE.Vector3(-3.2, 0.4, -38),
      scale: 2.8,
      dodgeX: 2.7,
      dodgeY: -0.2,
      roll: -0.42,
    },
    {
      id: 'price',
      name: 'Preço Abusivo',
      sub: 'Custos inflados sem contrapartida de entrega',
      pos: new THREE.Vector3(3.6, -0.3, -72),
      scale: 3.2,
      dodgeX: -2.8,
      dodgeY: 0.3,
      roll: 0.48,
    },
    {
      id: 'delay',
      name: 'Falta de Execução',
      sub: 'Sprints congeladas e prazos ultrapassados',
      pos: new THREE.Vector3(-3.4, -0.4, -106),
      scale: 3.0,
      dodgeX: 2.6,
      dodgeY: 0.5,
      roll: -0.38,
    },
    {
      id: 'quality',
      name: 'Baixa Qualidade',
      sub: 'Interfaces genéricas e desempenho precário',
      pos: new THREE.Vector3(3.0, 0.5, -132),
      scale: 2.9,
      dodgeX: 0.0,
      dodgeY: -0.6,
      roll: 0.15,
    },
  ];

  obstacleData.forEach((data, index) => {
    const obsGroup = new THREE.Group();
    obsGroup.position.copy(data.pos);

    const coreGeo = new THREE.OctahedronGeometry(data.scale * 0.75, 1);
    const coreMesh = new THREE.Mesh(coreGeo, carbonMaterial);
    obsGroup.add(coreMesh);

    const wireGeo = new THREE.OctahedronGeometry(data.scale * 0.85, 1);
    const wireMesh = new THREE.Mesh(wireGeo, glowingWireMaterial);
    obsGroup.add(wireMesh);

    const warningRingGeo = new THREE.TorusGeometry(data.scale * 1.05, 0.04, 8, 24);
    const warningRing = new THREE.Mesh(warningRingGeo, neonRedMaterial);
    warningRing.rotation.x = Math.PI / 3;
    obsGroup.add(warningRing);

    const markerGeo = new THREE.SphereGeometry(0.18, 12, 12);
    const marker = new THREE.Mesh(markerGeo, neonRedMaterial);
    marker.position.set(0, data.scale * 0.95, 0);
    obsGroup.add(marker);

    scene.add(obsGroup);

    obstacles.push({
      ...data,
      group: obsGroup,
      ring: warningRing,
      index,
    });
  });

  // ---------------------------------------------------------------------------
  // 7. O ALVO SUPREMO ("VL TECH SOLUTION" // BULLSEYE)
  // ---------------------------------------------------------------------------
  const targetGroup = new THREE.Group();
  targetGroup.position.set(0, 0, -156);
  scene.add(targetGroup);

  const targetChassisGeo = new THREE.CylinderGeometry(5.2, 5.2, 0.35, 36);
  targetChassisGeo.rotateX(Math.PI / 2);
  const targetChassis = new THREE.Mesh(targetChassisGeo, carbonMaterial);
  targetGroup.add(targetChassis);

  const ringOuterGeo = new THREE.RingGeometry(4.2, 4.8, 36);
  const ringOuter = new THREE.Mesh(ringOuterGeo, neonRedMaterial);
  ringOuter.position.z = 0.2;
  targetGroup.add(ringOuter);

  const ringMidGeo = new THREE.RingGeometry(2.6, 4.0, 36);
  const ringMidMat = new THREE.MeshStandardMaterial({
    color: 0x1a1a22,
    metalness: 0.8,
    roughness: 0.3,
  });
  const ringMid = new THREE.Mesh(ringMidGeo, ringMidMat);
  ringMid.position.z = 0.21;
  targetGroup.add(ringMid);

  const ringInnerGeo = new THREE.RingGeometry(1.2, 2.4, 36);
  const ringInner = new THREE.Mesh(ringInnerGeo, neonRedMaterial);
  ringInner.position.z = 0.22;
  targetGroup.add(ringInner);

  const bullseyeGeo = new THREE.CircleGeometry(1.0, 32);
  const bullseyeMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xff1e26,
    emissiveIntensity: 2.5,
  });
  const bullseye = new THREE.Mesh(bullseyeGeo, bullseyeMat);
  bullseye.position.z = 0.23;
  targetGroup.add(bullseye);

  const shockwaveGeo = new THREE.RingGeometry(0.1, 0.35, 36);
  const shockwaveMat = new THREE.MeshBasicMaterial({
    color: 0xff3b42,
    transparent: true,
    opacity: 0,
    side: THREE.DoubleSide,
  });
  const shockwave = new THREE.Mesh(shockwaveGeo, shockwaveMat);
  shockwave.position.z = 0.28;
  targetGroup.add(shockwave);

  const sparkCount = 80;
  const sparkGeo = new THREE.BufferGeometry();
  const sparkPos = new Float32Array(sparkCount * 3);
  const sparkVels = [];
  for (let i = 0; i < sparkCount; i++) {
    sparkPos[i * 3] = 0;
    sparkPos[i * 3 + 1] = 0;
    sparkPos[i * 3 + 2] = 0.3;
    const theta = Math.random() * Math.PI * 2;
    const speed = 0.5 + Math.random() * 2.5;
    sparkVels.push({
      vx: Math.cos(theta) * speed,
      vy: Math.sin(theta) * speed,
      vz: 0.2 + Math.random() * 1.5,
    });
  }
  sparkGeo.setAttribute('position', new THREE.BufferAttribute(sparkPos, 3));
  const sparkMat = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.14,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
  });
  const sparkParticles = new THREE.Points(sparkGeo, sparkMat);
  targetGroup.add(sparkParticles);

  // ---------------------------------------------------------------------------
  // 8. TÚNEL DE VELOCIDADE / CYBERSPACE PARTICLES
  // ---------------------------------------------------------------------------
  const tunnelCount = 450;
  const tunnelGeo = new THREE.BufferGeometry();
  const tunnelPos = new Float32Array(tunnelCount * 3);
  for (let i = 0; i < tunnelCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 3.5 + Math.random() * 6.5;
    tunnelPos[i * 3] = Math.cos(angle) * radius;
    tunnelPos[i * 3 + 1] = Math.sin(angle) * radius;
    tunnelPos[i * 3 + 2] = -Math.random() * 165;
  }
  tunnelGeo.setAttribute('position', new THREE.BufferAttribute(tunnelPos, 3));
  const tunnelMat = new THREE.PointsMaterial({
    color: 0xff1e26,
    size: 0.09,
    transparent: true,
    opacity: 0.4,
    blending: THREE.AdditiveBlending,
  });
  const tunnelParticles = new THREE.Points(tunnelGeo, tunnelMat);
  scene.add(tunnelParticles);

  // ---------------------------------------------------------------------------
  // 9. ELEMENTOS DE UI / HUD EDITORIAL
  // ---------------------------------------------------------------------------
  const telemetryDistance = document.getElementById('arrowTelemetryDistance');
  const telemetrySpeed = document.getElementById('arrowTelemetrySpeed');
  const telemetryStatus = document.getElementById('arrowTelemetryStatus');
  const telemetryPhaseBadge = document.getElementById('arrowPhaseBadge');
  const stageCards = [
    document.getElementById('arrowStage1'),
    document.getElementById('arrowStage2'),
    document.getElementById('arrowStage3'),
    document.getElementById('arrowStage4'),
  ];
  const hurdlePills = document.querySelectorAll('[data-hurdle-pill]');
  const hudSteps = document.querySelectorAll('.arrow-hud-center .hud-step');
  const orbitIndicator = document.getElementById('arrowOrbitIndicator');
  const orbitText = document.getElementById('arrowOrbitText');
  const hudBottom = document.getElementById('arrowHudBottom');

  // ---------------------------------------------------------------------------
  // 10. MODO DE INSPEÇÃO 360° INTERATIVO (DRAG ORBIT CONTROLS)
  // Permite inspecionar livremente o arco e flecha em 360 graus antes do disparo
  // ---------------------------------------------------------------------------
  let isDragging = false;
  let prevPointerX = 0;
  let prevPointerY = 0;
  let orbitTheta = 0; // rotação horizontal 360 graus
  let orbitPhi = 0;   // rotação vertical (-60 a +60 graus)
  let targetOrbitTheta = 0;
  let targetOrbitPhi = 0;
  let isUserInteracting = false;
  const idleRotationSpeed = 0.0016;

  function onPointerDown(e) {
    if (e.target.closest('a, button, .btn')) return;
    isDragging = true;
    prevPointerX = e.clientX;
    prevPointerY = e.clientY;
    canvas.classList.add('is-grabbing');
    isUserInteracting = true;
    if (orbitText) {
      orbitText.textContent = 'INSPEÇÃO 360° ATIVA · GIRANDO';
    }
  }

  function onPointerMove(e) {
    if (!isDragging) return;
    const dx = e.clientX - prevPointerX;
    const dy = e.clientY - prevPointerY;
    prevPointerX = e.clientX;
    prevPointerY = e.clientY;

    targetOrbitTheta -= dx * 0.0065;
    targetOrbitPhi = Math.max(-1.1, Math.min(1.1, targetOrbitPhi + dy * 0.0065));
  }

  function onPointerUp() {
    isDragging = false;
    canvas.classList.remove('is-grabbing');
    if (orbitText) {
      orbitText.textContent = 'INSPEÇÃO 360° ATIVA · ARRASTE PARA GIRAR';
    }
  }

  pinViewport.addEventListener('pointerdown', onPointerDown, { passive: true });
  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('pointerup', onPointerUp, { passive: true });
  window.addEventListener('pointercancel', onPointerUp, { passive: true });

  // ---------------------------------------------------------------------------
  // 11. EQUAÇÃO CINEMÁTICA DE VOO DA FLECHA (TRAJETÓRIA 3D INTERPOLADA)
  // ---------------------------------------------------------------------------
  function calculateArrowState(progress) {
    const state = {
      arrowPos: new THREE.Vector3(0, 0, 0),
      arrowRot: new THREE.Euler(0, 0, 0),
      bowStringPull: 0,
      bowOpacity: 1,
      camPos: new THREE.Vector3(0, 1.2, 5.5),
      camLookAt: new THREE.Vector3(0, 0, -10),
      speedKm: 0,
      distMeters: 0,
      phase: 1,
      impactProgress: 0,
    };

    if (progress < 0.16) {
      // FASE 1: A IDEIA (Flecha no arco, corda puxando para trás acumulando tensão)
      const p = progress / 0.16;
      state.phase = 1;
      state.bowStringPull = p * 2.2;
      state.arrowPos.set(0, 0, state.bowStringPull);
      state.arrowRot.set(0, 0, 0);
      state.bowOpacity = 1;

      state.camPos.set(0, 1.1 + p * 0.2, 5.2 - p * 0.8);
      state.camLookAt.set(0, 0, -20);
      state.speedKm = Math.round(p * 45);
      state.distMeters = Math.round(p * 2);
    } else if (progress < 0.24) {
      // FASE 2: O DISPARO & PRODUÇÃO (Corda solta, flecha parte em alta velocidade)
      const p = (progress - 0.16) / 0.08;
      state.phase = 2;
      state.bowStringPull = (1 - p) * 0.4;
      const zLaunch = -p * 22;
      state.arrowPos.set(0, 0, zLaunch);
      state.arrowRot.set(0, 0, 0);
      state.bowOpacity = 1 - p * 0.85;

      state.camPos.set(0, 1.3, zLaunch + 4.8);
      state.camLookAt.set(0, 0, zLaunch - 18);
      state.speedKm = Math.round(380 + p * 240);
      state.distMeters = Math.round(2 + p * 20);
    } else if (progress < 0.82) {
      // FASE 3: DESVIOS DE MERCADO (Navegando entre os 4 obstáculos)
      const p = (progress - 0.24) / 0.58;
      state.phase = 3;
      state.bowOpacity = 0;

      const currentZ = -22 - p * 118;
      state.distMeters = Math.round(22 + p * 118);
      state.speedKm = 640 + Math.round(Math.sin(p * Math.PI * 4) * 35);

      let currentX = 0;
      let currentY = 0;
      let rollZ = 0;

      if (p < 0.25) {
        const subP = p / 0.25;
        const wave = Math.sin(subP * Math.PI);
        currentX = wave * 2.8;
        currentY = wave * 0.3;
        rollZ = -wave * 0.45;
      } else if (p < 0.5) {
        const subP = (p - 0.25) / 0.25;
        const wave = Math.sin(subP * Math.PI);
        currentX = -wave * 2.9;
        currentY = -wave * 0.2;
        rollZ = wave * 0.52;
      } else if (p < 0.75) {
        const subP = (p - 0.5) / 0.25;
        const wave = Math.sin(subP * Math.PI);
        currentX = wave * 2.7;
        currentY = wave * 0.6;
        rollZ = -wave * 0.42;
      } else {
        const subP = (p - 0.75) / 0.25;
        const wave = Math.sin(subP * Math.PI);
        currentX = -wave * 1.5;
        currentY = -wave * 0.4;
        rollZ = wave * 0.25;
      }

      state.arrowPos.set(currentX, currentY, currentZ);
      state.arrowRot.set(-currentY * 0.15, -currentX * 0.08, rollZ);

      state.camPos.set(
        currentX * 0.65,
        currentY * 0.65 + 1.25,
        currentZ + 4.9
      );
      state.camLookAt.set(currentX * 0.2, currentY * 0.2, currentZ - 20);
    } else {
      // FASE 4: O ALVO SUPREMO (VL TECH - Impacto perfeito no centro, enquadrado à direita/centro)
      const p = (progress - 0.82) / 0.18;
      state.phase = 4;
      state.bowOpacity = 0;
      state.speedKm = p > 0.85 ? 0 : Math.round((1 - p) * 650);
      state.distMeters = 156;

      const targetZ = -153.8;
      const startZ = -140;
      const arrowZ = p < 0.85 ? startZ + (p / 0.85) * (targetZ - startZ) : targetZ;

      state.arrowPos.set(0, 0, arrowZ);

      if (p >= 0.85) {
        const recoilP = (p - 0.85) / 0.15;
        state.impactProgress = recoilP;
        const quiver = Math.sin(recoilP * Math.PI * 10) * Math.exp(-recoilP * 4) * 0.04;
        state.arrowPos.x = quiver;
        state.arrowRot.set(0, 0, quiver * 2);
      } else {
        state.arrowRot.set(0, 0, 0);
      }

      // Enquadramento limpo: Câmera posicionada em ângulo 3/4 aberto,
      // mantendo o alvo no centro-direita do canvas, sem qualquer obstrução de texto
      const camTargetPos = new THREE.Vector3(2.4, 1.0, -146);
      const camTargetLook = new THREE.Vector3(-0.3, 0, -156);
      state.camPos.lerpVectors(new THREE.Vector3(0, 1.2, -135), camTargetPos, p);
      state.camLookAt.lerpVectors(new THREE.Vector3(0, 0, -156), camTargetLook, p);
    }

    return state;
  }

  // ---------------------------------------------------------------------------
  // 12. GSAP SCROLLTRIGGER ORCHESTRATION (PINNED TIMELINE)
  // ---------------------------------------------------------------------------
  let scrollProgress = 0;
  let isSectionActive = true;

  const scrollTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: '+=420%',
      pin: pinViewport,
      scrub: 0.8,
      anticipatePin: 1,
      onToggle: (self) => {
        isSectionActive = self.isActive;
      },
      onUpdate: (self) => {
        scrollProgress = self.progress;
        updateUI(self.progress);
      },
    },
  });

  function updateUI(p) {
    stageCards.forEach((card, idx) => {
      if (!card) return;
      let active = false;
      if (idx === 0 && p < 0.22) active = true;
      if (idx === 1 && p >= 0.22 && p < 0.44) active = true;
      if (idx === 2 && p >= 0.44 && p < 0.8) active = true;
      if (idx === 3 && p >= 0.8) active = true;

      if (active) {
        card.classList.add('is-active');
      } else {
        card.classList.remove('is-active');
      }
    });

    if (hudSteps.length >= 4) {
      hudSteps.forEach((step, idx) => {
        let stepActive = false;
        if (idx === 0 && p < 0.22) stepActive = true;
        if (idx === 1 && p >= 0.22 && p < 0.44) stepActive = true;
        if (idx === 2 && p >= 0.44 && p < 0.8) stepActive = true;
        if (idx === 3 && p >= 0.8) stepActive = true;

        if (stepActive) step.classList.add('hud-step-active');
        else step.classList.remove('hud-step-active');
      });
    }

    if (hurdlePills.length >= 4) {
      if (p >= 0.48) hurdlePills[0].classList.add('is-dodged');
      else hurdlePills[0].classList.remove('is-dodged');

      if (p >= 0.58) hurdlePills[1].classList.add('is-dodged');
      else hurdlePills[1].classList.remove('is-dodged');

      if (p >= 0.68) hurdlePills[2].classList.add('is-dodged');
      else hurdlePills[2].classList.remove('is-dodged');

      if (p >= 0.76) hurdlePills[3].classList.add('is-dodged');
      else hurdlePills[3].classList.remove('is-dodged');
    }
  }

  // ---------------------------------------------------------------------------
  // 13. LOOP DE RENDERIZAÇÃO 60 FPS COM MODO DE ÓRBITA INTEGRADO
  // ---------------------------------------------------------------------------
  let animationFrameId = null;
  let clock = new THREE.Clock();

  function animate() {
    animationFrameId = requestAnimationFrame(animate);

    if (!isSectionActive) return;

    const elapsedTime = clock.getElapsedTime();

    // Rotação suave dos obstáculos
    obstacles.forEach((obs, idx) => {
      obs.group.rotation.y = elapsedTime * 0.4 + idx * 1.2;
      obs.group.rotation.x = Math.sin(elapsedTime * 0.8 + idx) * 0.15;
      obs.ring.rotation.z = -elapsedTime * 0.6;
    });

    ringOuter.rotation.z = elapsedTime * 0.35;
    ringMid.rotation.z = -elapsedTime * 0.2;

    // Calcular estado cinemático da trajetória
    const state = calculateArrowState(scrollProgress);

    // Órbita 360° interativa: se o scroll está próximo do início, o usuário tem controle 360°
    if (!isDragging && !isUserInteracting) {
      targetOrbitTheta += idleRotationSpeed;
    }
    orbitTheta += (targetOrbitTheta - orbitTheta) * 0.08;
    orbitPhi += (targetOrbitPhi - orbitPhi) * 0.08;

    const orbitBlend = Math.max(0, 1 - (scrollProgress / 0.08));

    if (orbitIndicator) {
      orbitIndicator.style.opacity = orbitBlend.toString();
      orbitIndicator.style.pointerEvents = orbitBlend > 0.1 ? 'auto' : 'none';
      orbitIndicator.style.transform = `translateX(-50%) translateY(${(1 - orbitBlend) * -12}px)`;
    }

    if (hudBottom) {
      const bottomOpacity = Math.max(0, 1 - (scrollProgress / 0.05));
      hudBottom.style.opacity = bottomOpacity.toString();
    }

    if (orbitBlend > 0.001) {
      const radius = 5.6;
      const orbitCamX = radius * Math.sin(orbitTheta) * Math.cos(orbitPhi);
      const orbitCamY = 1.1 + radius * Math.sin(orbitPhi);
      const orbitCamZ = radius * Math.cos(orbitTheta) * Math.cos(orbitPhi);

      const orbitCamPos = new THREE.Vector3(orbitCamX, orbitCamY, orbitCamZ);
      const orbitLookAt = new THREE.Vector3(0, 0, 0);

      state.camPos.lerp(orbitCamPos, orbitBlend);
      state.camLookAt.lerp(orbitLookAt, orbitBlend);
    }

    arrowGroup.position.copy(state.arrowPos);
    arrowGroup.rotation.copy(state.arrowRot);

    const thrusterPositions = thrusterGeo.attributes.position.array;
    for (let i = 0; i < thrusterCount; i++) {
      thrusterPositions[i * 3 + 2] += (0.05 + Math.random() * 0.08);
      if (thrusterPositions[i * 3 + 2] > 4.0) {
        thrusterPositions[i * 3 + 2] = shaftLength / 2;
      }
    }
    thrusterGeo.attributes.position.needsUpdate = true;

    if (state.bowOpacity > 0.01) {
      bowGroup.visible = true;
      carbonMaterial.opacity = state.bowOpacity;
      stringMaterial.opacity = state.bowOpacity * 0.9;

      const nockWorldZ = state.bowStringPull;
      const upperStrPos = upperString.geometry.attributes.position.array;
      upperStrPos[3] = 0;
      upperStrPos[4] = 0;
      upperStrPos[5] = nockWorldZ;
      upperString.geometry.attributes.position.needsUpdate = true;

      const lowerStrPos = lowerString.geometry.attributes.position.array;
      lowerStrPos[3] = 0;
      lowerStrPos[4] = 0;
      lowerStrPos[5] = nockWorldZ;
      lowerString.geometry.attributes.position.needsUpdate = true;
    } else {
      bowGroup.visible = false;
    }

    if (state.impactProgress > 0) {
      const imp = state.impactProgress;
      shockwave.scale.set(1 + imp * 18, 1 + imp * 18, 1);
      shockwaveMat.opacity = Math.max(0, 1 - imp * 1.2);

      sparkMat.opacity = Math.max(0, 1 - imp * 0.9);
      const sparkArray = sparkGeo.attributes.position.array;
      for (let i = 0; i < sparkCount; i++) {
        sparkArray[i * 3] += sparkVels[i].vx * 0.06;
        sparkArray[i * 3 + 1] += sparkVels[i].vy * 0.06;
        sparkArray[i * 3 + 2] += sparkVels[i].vz * 0.05;
      }
      sparkGeo.attributes.position.needsUpdate = true;
    } else {
      shockwaveMat.opacity = 0;
      sparkMat.opacity = 0;
    }

    camera.position.lerp(state.camPos, 0.14);
    camera.lookAt(state.camLookAt);

    if (telemetryDistance) telemetryDistance.textContent = `${state.distMeters}M`;
    if (telemetrySpeed) telemetrySpeed.textContent = `${state.speedKm} KM/H`;
    if (telemetryStatus) {
      if (state.phase === 1) telemetryStatus.textContent = 'CONCEPÇÃO // CARREGANDO TENSÃO';
      else if (state.phase === 2) telemetryStatus.textContent = 'DISPARO // ACELERAÇÃO MÁXIMA';
      else if (state.phase === 3) telemetryStatus.textContent = 'RADAR // DESVIANDO DE ARMADILHAS';
      else telemetryStatus.textContent = '100% PRECISÃO // ALVO ATINGIDO';
    }
    if (telemetryPhaseBadge) {
      telemetryPhaseBadge.textContent = `0${state.phase} / 04`;
    }

    renderer.render(scene, camera);
  }

  animate();

  // ---------------------------------------------------------------------------
  // 14. RESIZE RESPONSIVO & CLEANUP
  // ---------------------------------------------------------------------------
  function handleResize() {
    if (!pinViewport) return;
    const width = pinViewport.clientWidth;
    const height = pinViewport.clientHeight;
    camera.aspect = width / Math.max(height, 1);
    camera.fov = width < 768 ? 64 : 52;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  window.addEventListener('resize', handleResize);

  return {
    destroy: () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      pinViewport.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
      renderer.dispose();
      scrollTimeline.kill();
    },
  };
}
