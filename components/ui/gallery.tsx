'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';

/**
 * HIGH-IMPACT TECH VISUALS FOR THE VL TECH ECOSYSTEM
 * Curated high-resolution dark tech, AI neural pipelines, Formula 1 telemetry,
 * distributed cloud architecture, and cryptographic defense visuals.
 */
export const GALLERY_IMAGE_URLS = [
  {
    url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80',
    title: 'Cybersecurity Ofensiva',
    category: 'Infraestrutura & Hardening',
    metric: 'AES-256 · Zero Data Leaks',
  },
  {
    url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    title: 'Performance Extrema',
    category: 'Engenharia de Software',
    metric: '< 0.8s LCP · 100/100 Core Web Vitals',
  },
  {
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    title: 'Direção Criativa F1',
    category: 'WebGL 3D & Micro-interações',
    metric: '60 FPS Fluido · Awwwards Standard',
  },
  {
    url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    title: 'Automação Inteligente',
    category: 'IA Neural 24/7 & WhatsApp API',
    metric: 'Zero Latência · CRM Realtime',
  },
  {
    url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    title: 'Arquitetura Distribuída',
    category: 'Multi-Cloud & Kubernetes',
    metric: '100k+ Req/s · 99.99% Uptime',
  },
  {
    url: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=1200&q=80',
    title: 'Entrega Ágil & Contínua',
    category: 'CI/CD Pipeline & Vercel Edge',
    metric: 'Deploys Contínuos · Zero Downtime',
  },
  {
    url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
    title: 'Testes & QA Resiliente',
    category: 'Qualidade & Cobertura E2E',
    metric: '100% Automated Testing · Zero Regressão',
  },
  {
    url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
    title: 'Squad Sênior Dedicado',
    category: 'Acesso Direto aos Fundadores',
    metric: 'Liderança Técnica Luiz & Victor',
  },
];

interface GalleryProps {
  images?: typeof GALLERY_IMAGE_URLS;
  radius?: number;
  autoRotateSpeed?: number;
  cardWidth?: number;
  cardHeight?: number;
  className?: string;
  onActiveChange?: (index: number) => void;
}

export function CylindricalGallery({
  images = GALLERY_IMAGE_URLS,
  radius = 6.2,
  autoRotateSpeed = 0.0018,
  cardWidth = 2.4,
  cardHeight = 3.3,
  className = '',
  onActiveChange,
}: GalleryProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // References for Three.js state
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cylinderGroupRef = useRef<THREE.Group | null>(null);
  const meshesRef = useRef<THREE.Mesh[]>([]);

  // Interaction state
  const rotTargetRef = useRef(0);
  const rotCurrentRef = useRef(0);
  const pointerDownXRef = useRef(0);
  const pointerDownRotRef = useRef(0);
  const isPointerDownRef = useRef(false);

  // Initialize Three.js scene
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = mountRef.current;
    if (!canvas || !container) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.fog = new THREE.FogExp2(0x0a0a0c, 0.045);

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 560;

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 0.2, 9.2);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    rendererRef.current = renderer;

    // 2. Futuristic Studio Lighting (Black & Neon Red Glow)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const redSpotLight = new THREE.SpotLight(0xff2a2a, 8.0, 24, Math.PI / 4, 0.5, 1.2);
    redSpotLight.position.set(0, 6, 4);
    scene.add(redSpotLight);

    const fillBlueLight = new THREE.PointLight(0x221133, 2.0, 15);
    fillBlueLight.position.set(0, -4, 2);
    scene.add(fillBlueLight);

    // 3. Central Cylinder Group
    const cylinderGroup = new THREE.Group();
    scene.add(cylinderGroup);
    cylinderGroupRef.current = cylinderGroup;

    // 4. Subtle Ambient Rings (Top & Bottom of Cylinder)
    const ringGeo = new THREE.TorusGeometry(radius, 0.03, 16, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xff2a2a,
      transparent: true,
      opacity: 0.35,
    });
    const topRing = new THREE.Mesh(ringGeo, ringMat);
    topRing.rotation.x = Math.PI / 2;
    topRing.position.y = cardHeight * 0.58;
    cylinderGroup.add(topRing);

    const bottomRing = topRing.clone();
    bottomRing.position.y = -cardHeight * 0.58;
    cylinderGroup.add(bottomRing);

    // 5. Build Cylindrical Cards with Textures
    const textureLoader = new THREE.TextureLoader();
    const count = images.length;
    const meshes: THREE.Mesh[] = [];

    // Curved plane geometry for authentic cylinder wrap
    const cardSegments = 16;
    const cardAngleWidth = cardWidth / radius; // angle swept by card
    const cardGeo = new THREE.CylinderGeometry(
      radius,
      radius,
      cardHeight,
      cardSegments,
      1,
      true,
      -cardAngleWidth / 2,
      cardAngleWidth
    );

    images.forEach((item, index) => {
      const angle = (index / count) * Math.PI * 2;

      // Load texture with fallback
      const texture = textureLoader.load(item.url);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.generateMipmaps = true;
      texture.minFilter = THREE.LinearMipmapLinearFilter;

      // Card Material (Double-sided with red rim illumination)
      const mat = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        roughness: 0.28,
        metalness: 0.45,
      });

      const mesh = new THREE.Mesh(cardGeo, mat);
      mesh.rotation.y = angle;
      mesh.userData = { index, data: item };

      // Border Wireframe Outline for High-Tech Neon Red Glow
      const borderGeo = new THREE.EdgesGeometry(cardGeo);
      const borderMat = new THREE.LineBasicMaterial({
        color: 0xff2a2a,
        transparent: true,
        opacity: 0.7,
        linewidth: 1.5,
      });
      const border = new THREE.LineSegments(borderGeo, borderMat);
      mesh.add(border);

      cylinderGroup.add(mesh);
      meshes.push(mesh);
    });

    meshesRef.current = meshes;

    // 6. Animation Loop with Smooth Inertia / Damping
    let animationFrameId: number;
    let lastTime = performance.now();

    const animate = (time: number) => {
      const delta = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      // Auto-rotation when not dragging
      if (!isPointerDownRef.current && !isPaused) {
        rotTargetRef.current -= autoRotateSpeed;
      }

      // Smooth Lerp Damping
      rotCurrentRef.current += (rotTargetRef.current - rotCurrentRef.current) * 0.08;
      cylinderGroup.rotation.y = rotCurrentRef.current;

      // Determine the active (closest to front camera) card
      const normalizedAngle = (-rotCurrentRef.current) % (Math.PI * 2);
      const positiveAngle = normalizedAngle < 0 ? normalizedAngle + Math.PI * 2 : normalizedAngle;
      const computedActive = Math.round((positiveAngle / (Math.PI * 2)) * count) % count;

      if (computedActive !== activeIndex) {
        setActiveIndex(computedActive);
        onActiveChange?.(computedActive);
      }

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    // 7. Responsive Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      scene.clear();
    };
  }, [images, radius, autoRotateSpeed, cardWidth, cardHeight, isPaused, onActiveChange]);

  // Pointer / Drag Interaction Handlers
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    isPointerDownRef.current = true;
    setIsDragging(true);
    pointerDownXRef.current = e.clientX;
    pointerDownRotRef.current = rotTargetRef.current;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isPointerDownRef.current) return;
    const deltaX = e.clientX - pointerDownXRef.current;
    const rotationSensitivity = 0.0042;
    rotTargetRef.current = pointerDownRotRef.current + deltaX * rotationSensitivity;
  }, []);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    isPointerDownRef.current = false;
    setIsDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignore if pointer capture was already released
    }
  }, []);

  // Wheel horizontal scrubbing support
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const scrollSensitivity = 0.0018;
    rotTargetRef.current -= (e.deltaY || e.deltaX) * scrollSensitivity;
  }, []);

  const currentItem = images[activeIndex] || images[0];

  return (
    <div
      ref={mountRef}
      className={`relative w-full h-[520px] md:h-[600px] bg-[#0A0A0C] border border-[#ff2a2a]/20 rounded-3xl overflow-hidden select-none shadow-[0_20px_50px_rgba(0,0,0,0.85)] ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* 3D WebGL Canvas */}
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onWheel={handleWheel}
        className={`w-full h-full cursor-grab active:cursor-grabbing transition-opacity duration-300 ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
      />

      {/* Top Header HUD */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between pointer-events-none z-10">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs uppercase tracking-widest text-[#ff2a2a] px-3 py-1 rounded-full bg-[#ff2a2a]/10 border border-[#ff2a2a]/30">
            00 — Galeria 3D Cilíndrica
          </span>
          <span className="hidden sm:inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-neutral-400">
            <span className="w-2 h-2 rounded-full bg-[#ff2a2a] animate-pulse" />
            Interativo 360° WebGL
          </span>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-neutral-300">
          <span className="text-[#ff2a2a] font-bold">0{activeIndex + 1}</span>
          <span className="text-neutral-600">/</span>
          <span className="text-neutral-500">0{images.length}</span>
        </div>
      </div>

      {/* Active Card Bottom Overlay with Glassmorphic Card */}
      <div className="absolute bottom-6 left-6 right-6 pointer-events-none z-10 flex flex-col md:flex-row items-end md:items-center justify-between gap-4">
        <div className="bg-[#141418]/85 backdrop-blur-md border border-[#ff2a2a]/30 rounded-2xl p-4 md:p-5 max-w-md w-full shadow-[0_15px_35px_rgba(0,0,0,0.7)] pointer-events-auto">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#ff2a2a]">
              {currentItem.category}
            </span>
            <span className="font-mono text-[10px] uppercase text-neutral-400 bg-neutral-800/80 px-2 py-0.5 rounded">
              {currentItem.metric}
            </span>
          </div>
          <h4 className="font-display text-lg md:text-xl font-bold uppercase tracking-tight text-white mb-1">
            {currentItem.title}
          </h4>
          <p className="font-mono text-xs text-neutral-400 flex items-center gap-2">
            <span>Arraste com o mouse para orbitar em 360°</span>
            <span className="text-[#ff2a2a]">↔</span>
          </p>
        </div>

        {/* Quick Stepper Controls */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            type="button"
            onClick={() => {
              rotTargetRef.current += (Math.PI * 2) / images.length;
            }}
            className="w-11 h-11 rounded-xl bg-neutral-900/90 border border-white/10 hover:border-[#ff2a2a] text-white hover:text-[#ff2a2a] flex items-center justify-center font-mono text-sm transition-all hover:scale-105 active:scale-95 shadow-lg"
            aria-label="Slide anterior"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => {
              rotTargetRef.current -= (Math.PI * 2) / images.length;
            }}
            className="w-11 h-11 rounded-xl bg-neutral-900/90 border border-white/10 hover:border-[#ff2a2a] text-white hover:text-[#ff2a2a] flex items-center justify-center font-mono text-sm transition-all hover:scale-105 active:scale-95 shadow-lg"
            aria-label="Próximo slide"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}

export default CylindricalGallery;
