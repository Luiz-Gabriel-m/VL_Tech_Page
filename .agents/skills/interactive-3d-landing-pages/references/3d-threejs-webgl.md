# Engenharia 3D para Landing Pages (Three.js / WebGL & CSS 3D)

Guia técnico para escolher, modelar, iluminar e otimizar experiências 3D em landing pages sem sacrificar performance (FPS / Core Web Vitals).

---

## 1. Quando Usar Three.js (WebGL) vs CSS 3D

| Cenário | Melhor Escolha | Por quê |
|---|---|---|
| Cards com inclinação (tilt), crachá pêndulo, tampa de notebook abrindo, carrossel em arco com HTML real | **CSS 3D** (`perspective`, `transform-style: preserve-3d`) + GSAP | Texto nítido, SEO/acessibilidade nativos, peso quase zero e fácil de estilizar |
| Modelos 3D reais (`.glb`/`.gltf`), geometrias orgânicas, iluminação PBR/metálica, shaders GLSL, partículas em massa, galerias cilíndricas reais | **Three.js / WebGL** | Profundidade real, reflexos, câmera controlada, pós-processamento e alta densidade geométrica |

---

## 2. Pipeline de Modelagem e Assets 3D

- **Formato padrão web:** sempre `.glb` (glTF 2.0 binário). Evite `.obj` ou `.fbx` em produção.
- **Compressão obrigatória para modelos pesados:** Draco (`DRACOLoader`) ou Meshopt (`MeshoptDecoder`).
- **Texturas:** prefira WebP/KTX2, dimensões potência de 2 (`512`, `1024`, `2048`) e peso enxuto.
- **Geometria procedural:** para elementos abstratos, esferas, grades, anéis, cilindros de galeria ou hardware minimalista, gere direto com `THREE.BufferGeometry` / primitivas + `MeshPhysicalMaterial` para zero download extra.
- **Organização de pastas:** `assets/models/<nome-em-kebab-case>.glb` e `assets/textures/<nome>.webp`.

---

## 3. Setup Padrão de Cena Three.js de Alta Performance

```js
import * as THREE from 'three';

export function createThreeStage(container) {
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    100
  );
  camera.position.set(0, 0, 5);

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  container.appendChild(renderer.domElement);

  let rafId = null;
  let isVisible = true;

  const observer = new IntersectionObserver(
    ([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible && !rafId) loop();
    },
    { threshold: 0.05 }
  );
  observer.observe(container);

  const clock = new THREE.Clock();

  function loop() {
    if (!isVisible) {
      rafId = null;
      return;
    }
    rafId = requestAnimationFrame(loop);
    const delta = Math.min(clock.getDelta(), 0.05);
    // Atualizar objetos/física com delta
    renderer.render(scene, camera);
  }

  function onResize() {
    const w = container.clientWidth;
    const h = container.clientHeight;
    if (!w || !h) return;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }

  window.addEventListener('resize', onResize, { passive: true });
  loop();

  return {
    scene,
    camera,
    renderer,
    destroy() {
      if (rafId) cancelAnimationFrame(rafId);
      observer.disconnect();
      window.removeEventListener('resize', onResize);
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
          mats.forEach((m) => m.dispose());
        }
      });
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
```

---

## 4. Integração Three.js + GSAP ScrollTrigger

- **Sincronização limpa:** deixe o GSAP animar um objeto proxy ou propriedades numéricas (`camera.position`, `mesh.rotation`, uniforms de shader) dentro de uma timeline com `scrub: 1`.
- **Nunca crie um novo `WebGLRenderer` por card individual** (navegadores limitam contextos WebGL ativos, geralmente entre 8 e 16). Use um único canvas por seção ou `setScissor()` se precisar de múltiplas janelas 3D.

---

## 5. Checklist de Performance 3D

- [ ] `setPixelRatio(Math.min(window.devicePixelRatio, 2))` aplicado.
- [ ] Loop `requestAnimationFrame` pausado automaticamente quando a seção sai da tela (`IntersectionObserver`).
- [ ] `delta` limitado (`Math.min(clock.getDelta(), 0.05)`) para evitar saltos ao trocar de aba.
- [ ] Em dispositivos móveis ou `prefers-reduced-motion`, reduzir partículas/pós-processamento ou oferecer fallback estático elegante.
- [ ] Método `destroy()` / `.dispose()` implementado para evitar vazamento de memória VRAM.
