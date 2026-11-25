# 06 — Fluidez 60/120fps: Zero Recalc Style no Scroll, Pré-Compilação WebGL e Lerp Independente de Hz

- **Data:** 2026-11-25
- **Projeto de origem:** VL_Tech_Page
- **Categoria:** Performance
- **Arquivos de referência:** `js/automacao-portal.js`, `css/sections/automacao-portal.css`, `js/automacao-robot-3d.js`, `js/partners-tech.js`, `js/tech-hero-3d.js`, `js/diferenciais-tunnel.js`, `js/cursor.js`, `css/layout.css` (commit `9abaad8`)

---

## O que foi feito

Aplicamos uma otimização profunda focada em manter **60/120fps cravados** no Glyph Portal (`#automacao`), no Robô 3D Three.js PBR e nos loops interativos de todo o site:

1. **Zero Recalc Style em scroll no Glyph Portal (`js/automacao-portal.js` + `css/sections/automacao-portal.css`):**
   - Eliminamos todas as mutações de CSS Custom Properties (`section.style.setProperty('--gp-...')`) e atributos `section.dataset.*` de dentro do callback `onUpdate` (`paint()`).
   - Atualizamos `opacity` / `transform` / `pointerEvents` diretamente nos **nós-folha** (`.gp-portal-ink-veil`, `[data-gp-caption]`, `#gpRobotLayer`), com dirty-check para só escrever quando o valor muda.
   - Mantemos camadas com `mask-image` (`.gp-portal-grid`) ocultas enquanto o `clip-path: url(#...)` está animando, só ativando após `clip-path: none`.
   - Pré-calculamos `Math.log(startScale)` e `Math.log(endScale / startScale)` fora do scroll e isolamos pintura com `contain: strict` / `contain: layout style paint` e `transform: translateZ(0)`.
2. **Robô 3D WebGL sem travadinha de boot, wake ou 1º clique (`js/automacao-robot-3d.js`):**
   - Geração procedural de texturas PBR movida para `requestIdleCallback` em canvas `256×256` com 2 chamadas `ctx.fill()` em lote (de ~100ms com 13.000 `arc+fill` para **< 3ms**).
   - **Pré-compilação completa de shaders GLSL** com `renderer.compile(scene, camera)` em idle (ativando temporariamente meshes ocultos como `heartMesh` durante o `compile` e restaurando logo em seguida), eliminando 100% do stutter ao revelar o robô e no 1º clique.
   - Geometrias recalibradas com ~55% menos triângulos (mantendo silhueta PBR lisa), `stencil: false`, `AmbientLight` fundido no `HemisphereLight` e DPR `Math.min(dpr, isTouch ? 1.25 : 1.5)`.
   - Reaproveitamento in-place dos `<li>` de chips (`textContent`) em vez de `innerHTML = ''` a cada clique, e remoção de `syncSize()` síncrono dentro do evento disparado pelo scroll (`vl:automacao-card-state`).
3. **Movimento idêntico em 60Hz, 120Hz e 144Hz:**
   - Todos os lerps de `requestAnimationFrame` (`partners-tech.js`, `tech-hero-3d.js`, `diferenciais-tunnel.js`, `cursor.js`) convertidos para decaimento exponencial baseado em `dt`: `1 - Math.exp(-rate * dt)`.
   - Remoção de `backdrop-filter: blur(14px)` em botões flutuantes fixos (`.founder-toggle-btn`) que ficavam sobre palcos WebGL/SVG.

## Por que funcionou bem

- **Scroll instantâneo e sem engasgos:** o navegador deixou de recalcular estilos em ~80 descendentes 120 vezes por segundo durante o zoom do Glyph Portal.
- **Handoff invisível do SVG para o WebGL:** quando o zoom da letra termina, os shaders PBR e dos olhos de coração 3D já estão compilados na GPU — o robô acorda e responde ao 1º clique no mesmo frame.
- **Sensação física uniforme em qualquer monitor:** em telas 120Hz/144Hz, o cursor, o túnel 3D, o hero WebGL e o tambor de produtos não ficam acelerados nem inconsistentes.

## Como replicar em futuras páginas

### 1. Dirty-check em nós-folha (nunca CSS vars na `<section>` em scroll)
```js
let lastAlpha = '';
function onScrollPaint(p) {
  const nextAlpha = (1 - smooth(0.08, 0.42, p)).toFixed(3);
  if (nextAlpha !== lastAlpha) {
    lastAlpha = nextAlpha;
    veilEl.style.opacity = nextAlpha; // apenas nó-folha com translateZ(0)
  }
}
```

### 2. Pré-compilar shaders Three.js em idle (incluindo meshes ocultos)
```js
const schedule = window.requestIdleCallback
  ? (cb) => window.requestIdleCallback(cb, { timeout: 600 })
  : (cb) => setTimeout(cb, 320);

schedule(() => {
  // aplica texturas geradas em batch...
  hiddenMesh.visible = true;
  renderer.compile(scene, camera);
  hiddenMesh.visible = false;
  if (!rafId) renderer.render(scene, camera);
});
```

### 3. Lerp independente de taxa de atualização (60/120/144Hz)
```js
const dt = Math.min(Math.max((now - lastNow) / 1000, 0.001), 0.05);
lastNow = now;
const factor = 1 - Math.exp(-7.5 * dt);
current += (target - current) * factor;
```

## Checklist de aplicação
- [ ] Nenhum `section.style.setProperty(...)` ou `section.dataset.*` mutado continuamente dentro de `onUpdate` / `scroll` / `rAF`.
- [ ] Elementos pesados com `mask-image` desligados enquanto um `clip-path` animado está ativo.
- [ ] Texturas procedurais geradas em `requestIdleCallback` com `fill()` em lote + `renderer.compile(scene, camera)` cobrindo meshes inicialmente ocultos.
- [ ] Nenhum `syncSize()` / `clientWidth` chamado de forma síncrona em callbacks disparados durante scroll.
- [ ] Todos os lerps de `rAF` usando `1 - Math.exp(-rate * dt)` e zero `backdrop-filter` fixo sobre WebGL.
