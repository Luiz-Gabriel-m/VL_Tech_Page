/* ==========================================================================
   TECH HERO 3D — WebGL Interactive Particle Field & Neon Matrix Grid
   State-of-the-art corporate tech introduction for VL Tech:
   - Deep dark theme (#111112)
   - Three.js WebGL Particle Field with depth, float and mouse parallax
   - Receding glowing neon matrix grid highway with horizon fade
   - Live telemetry dynamic updates
   - Magnetic CTA button hover physics
   ========================================================================== */

export function initTechHero() {
  const canvas = document.getElementById('techHeroCanvas');
  const heroSection = document.getElementById('hero');
  if (!canvas || !heroSection) return null;

  // Verifica se o Three.js está disponível globalmente
  const THREE = window.THREE;
  if (!THREE) {
    console.warn('[tech-hero-3d] Three.js não encontrado na janela global.');
    return null;
  }

  // Configurações do Renderer
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(heroSection.clientWidth, heroSection.clientHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;

  // Cena e Câmera
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0a0a0c, 0.038);

  const camera = new THREE.PerspectiveCamera(
    60,
    heroSection.clientWidth / heroSection.clientHeight,
    0.1,
    1000
  );
  camera.position.set(0, 1.2, 10);

  // ---------------------------------------------------------------------------
  // 1. Textura de Partícula Glow Circular (Vermelho VL Tech #FF1E26 & Branco)
  // ---------------------------------------------------------------------------
  function createParticleTexture() {
    const size = 128;
    const pCanvas = document.createElement('canvas');
    pCanvas.width = size;
    pCanvas.height = size;
    const ctx = pCanvas.getContext('2d');

    const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    grad.addColorStop(0, 'rgba(255, 120, 120, 1)');
    grad.addColorStop(0.25, 'rgba(255, 30, 38, 0.98)');
    grad.addColorStop(0.6, 'rgba(220, 10, 20, 0.45)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.fill();

    const texture = new THREE.CanvasTexture(pCanvas);
    texture.needsUpdate = true;
    return texture;
  }

  const particleTexture = createParticleTexture();

  // ---------------------------------------------------------------------------
  // 2. Campo de Partículas Interativo (Dust & Digital Constellation 100% Vermelho Neon)
  // ---------------------------------------------------------------------------
  const particleCount = window.innerWidth < 768 ? 650 : 1500;
  const particleGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const scales = new Float32Array(particleCount);

  // Paleta de cores exclusiva: Vermelho neon (#FF1E26), Vermelho Rubi (#FF3B42) e Vermelho Carmesim (#D6001C)
  const colorRed = new THREE.Color(0xff1e26);
  const colorRuby = new THREE.Color(0xff3b42);
  const colorCrimson = new THREE.Color(0xd6001c);

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    // Dispersão espacial tridimensional em torno da visão do usuário
    positions[i3] = (Math.random() - 0.5) * 32;
    positions[i3 + 1] = (Math.random() - 0.5) * 18;
    positions[i3 + 2] = (Math.random() - 0.5) * 28 - 2;

    // Distribuição de cores 100% vermelhas
    const rChoice = Math.random();
    let pColor;
    if (rChoice < 0.6) {
      pColor = colorRed;
    } else if (rChoice < 0.85) {
      pColor = colorRuby;
    } else {
      pColor = colorCrimson;
    }

    colors[i3] = pColor.r;
    colors[i3 + 1] = pColor.g;
    colors[i3 + 2] = pColor.b;

    scales[i] = Math.random() * 0.8 + 0.3;
  }

  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const particleMaterial = new THREE.PointsMaterial({
    size: 0.28,
    map: particleTexture,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const particleField = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particleField);

  // ---------------------------------------------------------------------------
  // 3. Grid Neon de Matriz em Perspectiva (Wireframe Ground Highway Vermelho #FF1E26)
  // ---------------------------------------------------------------------------
  const gridWidth = 40;
  const gridDepth = 60;
  const gridDivisions = 40;

  const gridHelper = new THREE.GridHelper(gridWidth, gridDivisions, 0xff1e26, 0x300507);
  gridHelper.position.set(0, -3.2, -8);
  gridHelper.material.transparent = true;
  gridHelper.material.opacity = 0.32;
  gridHelper.material.blending = THREE.AdditiveBlending;
  scene.add(gridHelper);

  // Segundo Grid no teto invertido (estilo túnel tecnológico de dados)
  const ceilingGrid = new THREE.GridHelper(gridWidth, gridDivisions, 0xff1e26, 0x1f0305);
  ceilingGrid.position.set(0, 8.5, -8);
  ceilingGrid.material.transparent = true;
  ceilingGrid.material.opacity = 0.15;
  ceilingGrid.material.blending = THREE.AdditiveBlending;
  scene.add(ceilingGrid);

  // ---------------------------------------------------------------------------
  // 4. Floating Holographic Cyber Polyhedron (Símbolo de Engenharia Vermelho #FF1E26)
  // ---------------------------------------------------------------------------
  const coreGroup = new THREE.Group();
  coreGroup.position.set(6, 0.5, -4);

  const polyGeom = new THREE.IcosahedronGeometry(2.4, 1);
  const polyWireMat = new THREE.MeshBasicMaterial({
    color: 0xff1e26,
    wireframe: true,
    transparent: true,
    opacity: 0.25,
    blending: THREE.AdditiveBlending,
  });
  const polyMesh = new THREE.Mesh(polyGeom, polyWireMat);
  coreGroup.add(polyMesh);

  // Núcleo interno menor em rotação oposta
  const innerGeom = new THREE.OctahedronGeometry(1.2, 0);
  const innerMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    wireframe: true,
    transparent: true,
    opacity: 0.35,
    blending: THREE.AdditiveBlending,
  });
  const innerMesh = new THREE.Mesh(innerGeom, innerMat);
  coreGroup.add(innerMesh);

  // Esconde o núcleo em telas mobile muito estreitas para focar na tipografia
  if (window.innerWidth > 992) {
    scene.add(coreGroup);
  }

  // ---------------------------------------------------------------------------
  // 5. Interação com Mouse & Smooth Lerp Parallax
  // ---------------------------------------------------------------------------
  let targetMouseX = 0;
  let targetMouseY = 0;
  let currentMouseX = 0;
  let currentMouseY = 0;

  const onMouseMove = (e) => {
    const rect = heroSection.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight) return;
    targetMouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    targetMouseY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
  };

  window.addEventListener('mousemove', onMouseMove, { passive: true });

  // ---------------------------------------------------------------------------
  // 6. Loop de Renderização Acelerado por GPU
  // ---------------------------------------------------------------------------
  let animationFrameId = null;
  let isVisible = true;
  const clock = new THREE.Clock();

  function animate() {
    animationFrameId = requestAnimationFrame(animate);

    if (!isVisible) return;

    const elapsedTime = clock.getElapsedTime();

    // Interpolação suave do mouse (damping 0.05)
    currentMouseX += (targetMouseX - currentMouseX) * 0.05;
    currentMouseY += (targetMouseY - currentMouseY) * 0.05;

    // Movimentação sutil da câmera reagindo ao mouse
    camera.position.x = currentMouseX * 1.5;
    camera.position.y = 1.2 + currentMouseY * 0.8;
    camera.lookAt(0, 0, -4);

    // Rotação suave do campo de partículas
    particleField.rotation.y = elapsedTime * 0.03 + currentMouseX * 0.15;
    particleField.rotation.x = currentMouseY * 0.1;

    // Deslocamento contínuo do grid para simular fluxo de dados infinito
    gridHelper.position.z = -8 + (elapsedTime * 1.8) % (gridWidth / gridDivisions);
    ceilingGrid.position.z = -8 + (elapsedTime * 1.2) % (gridWidth / gridDivisions);

    // Rotação do holograma de engenharia
    if (coreGroup) {
      polyMesh.rotation.x = elapsedTime * 0.15;
      polyMesh.rotation.y = elapsedTime * 0.22;
      innerMesh.rotation.x = -elapsedTime * 0.25;
      innerMesh.rotation.z = elapsedTime * 0.3;
    }

    renderer.render(scene, camera);
  }

  animate();

  // ---------------------------------------------------------------------------
  // 7. Otimização de Performance via IntersectionObserver
  // ---------------------------------------------------------------------------
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        isVisible = entry.isIntersecting;
      });
    },
    { threshold: 0.05 }
  );
  observer.observe(heroSection);

  // ---------------------------------------------------------------------------
  // 8. Redimensionamento Responsivo
  // ---------------------------------------------------------------------------
  const onResize = () => {
    if (!heroSection || !renderer || !camera) return;
    const width = heroSection.clientWidth;
    const height = heroSection.clientHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    if (width <= 992 && coreGroup.parent) {
      scene.remove(coreGroup);
    } else if (width > 992 && !coreGroup.parent) {
      scene.add(coreGroup);
    }
  };

  window.addEventListener('resize', onResize, { passive: true });

  // ---------------------------------------------------------------------------
  // 9. Entrada Cinemática dos Elementos da Hero pós-Preloader (Da Esquerda)
  // ---------------------------------------------------------------------------
  function triggerHeroIntro() {
    if (!window.gsap) return;
    const gsap = window.gsap;
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.fromTo(
      '.tech-hero__eyebrow',
      { autoAlpha: 0, x: -30 },
      { autoAlpha: 1, x: 0, duration: 0.8, delay: 0.1 }
    )
      .fromTo(
        '.tech-hero__title',
        { autoAlpha: 0, x: -45, filter: 'blur(8px)' },
        { autoAlpha: 1, x: 0, filter: 'blur(0px)', duration: 1.0 },
        '-=0.5'
      )
      .fromTo(
        '.tech-hero__lead',
        { autoAlpha: 0, x: -25 },
        { autoAlpha: 1, x: 0, duration: 0.8 },
        '-=0.6'
      );
  }

  if (window.__loaderComplete) {
    triggerHeroIntro();
  } else {
    document.addEventListener('loader:complete', triggerHeroIntro, { once: true });
    window.addEventListener('loader:complete', triggerHeroIntro, { once: true });
  }

  return {
    destroy: () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      observer.disconnect();
      renderer.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      particleTexture.dispose();
    },
  };
}
