/* ==========================================================================
   TECH HERO 3D — WebGL Interactive Particle Field & Neon Matrix Grid
   Otimizado para 60/120fps reais sem travamentos:
   - Antialias desligado (desnecessário para partículas aditivas/wireframe)
   - PixelRatio limitado a 1.5 (economia massiva de fill-rate em telas 4K/Retina)
   - Cancelamento real de requestAnimationFrame fora da viewport / aba oculta
   - Zero getBoundingClientRect() no mousemove (dimensões cacheadas no resize)
   - Inicia o loop apenas após o preloader liberar o Hero (renderiza 1 frame inicial)
   ========================================================================== */

import { LOADER_COMPLETE_EVENT } from './loader.js?v=7.5';

export function initTechHero() {
  const canvas = document.getElementById('techHeroCanvas');
  const heroSection = document.getElementById('hero');
  if (!canvas || !heroSection) return null;

  const THREE = window.THREE;
  if (!THREE) {
    console.warn('[tech-hero-3d] Three.js não encontrado na janela global.');
    return null;
  }

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(pointer: coarse)').matches;

  let heroWidth = heroSection.clientWidth || window.innerWidth;
  let heroHeight = heroSection.clientHeight || window.innerHeight;

  // Configurações otimizadas do Renderer
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: false,
    alpha: true,
    powerPreference: 'high-performance',
    stencil: false,
    depth: false,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.setSize(heroWidth, heroHeight, false);

  // Cena e Câmera
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0a0a0c, 0.038);

  const camera = new THREE.PerspectiveCamera(60, heroWidth / heroHeight, 0.1, 120);
  camera.position.set(0, 1.2, 10);

  // 1. Textura compacta 64x64 de Partícula Glow Circular
  function createParticleTexture() {
    const size = 64;
    const pCanvas = document.createElement('canvas');
    pCanvas.width = size;
    pCanvas.height = size;
    const ctx = pCanvas.getContext('2d');

    const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    grad.addColorStop(0, 'rgba(255, 130, 130, 1)');
    grad.addColorStop(0.28, 'rgba(255, 30, 38, 0.96)');
    grad.addColorStop(0.62, 'rgba(220, 10, 20, 0.42)');
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

  // 2. Campo de Partículas (contagem calibrada para visual rico com baixo overdraw)
  const particleCount = heroWidth < 768 ? 320 : 680;
  const particleGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  const colorRed = new THREE.Color(0xff1e26);
  const colorRuby = new THREE.Color(0xff3b42);
  const colorCrimson = new THREE.Color(0xd6001c);

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * 32;
    positions[i3 + 1] = (Math.random() - 0.5) * 18;
    positions[i3 + 2] = (Math.random() - 0.5) * 26 - 2;

    const rChoice = Math.random();
    const pColor = rChoice < 0.6 ? colorRed : rChoice < 0.85 ? colorRuby : colorCrimson;

    colors[i3] = pColor.r;
    colors[i3 + 1] = pColor.g;
    colors[i3 + 2] = pColor.b;
  }

  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const particleMaterial = new THREE.PointsMaterial({
    size: 0.34,
    map: particleTexture,
    vertexColors: true,
    transparent: true,
    opacity: 0.88,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const particleField = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particleField);

  // 3. Grid Neon de Matriz em Perspectiva
  const gridWidth = 40;
  const gridDivisions = 32;
  const gridStep = gridWidth / gridDivisions;

  const gridHelper = new THREE.GridHelper(gridWidth, gridDivisions, 0xff1e26, 0x300507);
  gridHelper.position.set(0, -3.2, -8);
  gridHelper.material.transparent = true;
  gridHelper.material.opacity = 0.32;
  gridHelper.material.blending = THREE.AdditiveBlending;
  scene.add(gridHelper);

  const ceilingGrid = new THREE.GridHelper(gridWidth, gridDivisions, 0xff1e26, 0x1f0305);
  ceilingGrid.position.set(0, 8.5, -8);
  ceilingGrid.material.transparent = true;
  ceilingGrid.material.opacity = 0.15;
  ceilingGrid.material.blending = THREE.AdditiveBlending;
  scene.add(ceilingGrid);

  // 4. Floating Holographic Cyber Polyhedron
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

  if (heroWidth > 992) {
    scene.add(coreGroup);
  }

  // 5. Interação com Mouse (ZERO getBoundingClientRect() no mousemove!)
  let targetMouseX = 0;
  let targetMouseY = 0;
  let currentMouseX = 0;
  let currentMouseY = 0;
  let isVisible = true;
  let loaderReady = Boolean(window.__loaderComplete);

  const onMouseMove = (e) => {
    if (!isVisible || !loaderReady) return;
    targetMouseX = (e.clientX / (heroWidth || 1)) * 2 - 1;
    targetMouseY = -((e.clientY / (heroHeight || 1)) * 2 - 1);
  };

  if (!isTouch && !prefersReduced) {
    window.addEventListener('mousemove', onMouseMove, { passive: true });
  }

  // 6. Loop com parada REAL de rAF fora da viewport ou com aba oculta
  let animationFrameId = null;
  let elapsedTime = 0;
  let lastNow = performance.now();

  function renderOnce() {
    camera.position.x = currentMouseX * 1.5;
    camera.position.y = 1.2 + currentMouseY * 0.8;
    camera.lookAt(0, 0, -4);
    renderer.render(scene, camera);
  }

  function animate(now) {
    if (!isVisible || document.hidden || !loaderReady || prefersReduced) {
      animationFrameId = null;
      return;
    }

    const dt = Math.min((now - lastNow) / 1000, 0.05);
    lastNow = now;
    elapsedTime += dt;

    currentMouseX += (targetMouseX - currentMouseX) * 0.05;
    currentMouseY += (targetMouseY - currentMouseY) * 0.05;

    camera.position.x = currentMouseX * 1.5;
    camera.position.y = 1.2 + currentMouseY * 0.8;
    camera.lookAt(0, 0, -4);

    particleField.rotation.y = elapsedTime * 0.03 + currentMouseX * 0.15;
    particleField.rotation.x = currentMouseY * 0.1;

    gridHelper.position.z = -8 + ((elapsedTime * 1.8) % gridStep);
    ceilingGrid.position.z = -8 + ((elapsedTime * 1.2) % gridStep);

    if (coreGroup.parent) {
      polyMesh.rotation.x = elapsedTime * 0.15;
      polyMesh.rotation.y = elapsedTime * 0.22;
      innerMesh.rotation.x = -elapsedTime * 0.25;
      innerMesh.rotation.z = elapsedTime * 0.3;
    }

    renderer.render(scene, camera);
    animationFrameId = requestAnimationFrame(animate);
  }

  function startLoop() {
    if (prefersReduced || !isVisible || document.hidden || !loaderReady || animationFrameId) {
      return;
    }
    lastNow = performance.now();
    animationFrameId = requestAnimationFrame(animate);
  }

  function stopLoop() {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
  }

  // Renderiza 1 frame inicial limpo e só ativa o loop contínuo após o preloader
  renderOnce();
  if (loaderReady) {
    startLoop();
  } else {
    document.addEventListener(
      LOADER_COMPLETE_EVENT,
      () => {
        loaderReady = true;
        startLoop();
      },
      { once: true }
    );
  }

  // 7. IntersectionObserver + VisibilityChange
  const observer = new IntersectionObserver(
    ([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible) {
        startLoop();
      } else {
        stopLoop();
      }
    },
    { threshold: 0.02 }
  );
  observer.observe(heroSection);

  const onVisibilityChange = () => {
    if (document.hidden) {
      stopLoop();
    } else {
      startLoop();
    }
  };
  document.addEventListener('visibilitychange', onVisibilityChange);

  // 8. Redimensionamento Responsivo com debounce
  let resizeTimer = null;
  const onResize = () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (!heroSection || !renderer || !camera) return;
      heroWidth = heroSection.clientWidth || window.innerWidth;
      heroHeight = heroSection.clientHeight || window.innerHeight;

      camera.aspect = heroWidth / heroHeight;
      camera.updateProjectionMatrix();

      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      renderer.setSize(heroWidth, heroHeight, false);

      if (heroWidth <= 992 && coreGroup.parent) {
        scene.remove(coreGroup);
      } else if (heroWidth > 992 && !coreGroup.parent) {
        scene.add(coreGroup);
      }

      if (!animationFrameId) renderOnce();
    }, 120);
  };

  window.addEventListener('resize', onResize, { passive: true });

  return {
    destroy: () => {
      stopLoop();
      clearTimeout(resizeTimer);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      observer.disconnect();
      renderer.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      particleTexture.dispose();
      polyGeom.dispose();
      polyWireMat.dispose();
      innerGeom.dispose();
      innerMat.dispose();
    },
  };
}
