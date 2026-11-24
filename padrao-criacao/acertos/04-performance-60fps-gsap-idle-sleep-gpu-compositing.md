# 04 — Performance 60/120fps em GSAP, Loops `rAF` com Idle Sleep e GPU Compositing Limpo

- **Data:** 2026-11-20
- **Projeto de origem:** VL_Tech_Page
- **Categoria:** Performance | Animação GSAP | 3D & WebGL
- **Arquivos de referência:** `js/core/gsap.js`, `js/main.js`, `js/tech-hero-3d.js`, `js/responsive-showcase.js`, `js/partners-tech.js`, `js/badge-3d.js`, `js/cursor.js`, `js/navigation.js`

---

## O que foi feito

Foi padronizada uma arquitetura de **zero desperdício de CPU/GPU** para landing pages ricas em GSAP 3 + ScrollTrigger + Three.js + CSS 3D:

1. **Configuração base do GSAP (`js/core/gsap.js` + `js/main.js`):**
   - `gsap.ticker.lagSmoothing(500, 33)` para evitar saltos bruscos em picos de GC/CPU.
   - `ScrollTrigger.config({ ignoreMobileResize: true, limitCallbacks: true })`.
   - `ScrollTrigger.refresh()` sempre com **debounce** (`120ms` + `requestAnimationFrame`) para consolidar recálculos de fontes/imagens/preloader em uma única passagem.
2. **Idle Sleep + Pausa Real em todo `requestAnimationFrame`:**
   - Loops de física/interpolação (`partners-tech.js`, `cursor.js`) encerram o `rAF` (`rafId = null`) assim que atingem o alvo (`Math.abs(gap) < epsilon`) e só reacordam no próximo evento de interação.
   - Loops contínuos (`tech-hero-3d.js`, `badge-3d.js`, `footer-pong.js`, `matrix`) pausam de verdade (`cancelAnimationFrame`) via `IntersectionObserver` + `document.visibilitychange`, e o WebGL do Hero só liga o loop contínuo após `LOADER_COMPLETE_EVENT`.
3. **100% GPU Compositor (zero layout thrashing e zero repaint):**
   - Glows de fundo usam `radial-gradient` puro com 4 stops suaves (sem `filter: blur(60px–85px)`).
   - Brilho especular 3D (`badge-3d.js`) usa um filho `.badge-specular-glare__beam` recortado por `overflow: hidden` e movido via `transform: translate3d(...)` (sem mutar `style.background`).
   - Drag com GSAP usa `gsap.set()` no `pointermove` e `gsap.to()` apenas ao soltar/trocar slide.
   - Zero `getBoundingClientRect()` / `getComputedStyle()` em `mousemove`, `scroll` ou `rAF`.
4. **Iframes pesados sob demanda + `content-visibility: hidden`:**
   - Carregamento lazy apenas da aba ativa quando o usuário abre a seção, com `contain: strict` no palco e `content-visibility: hidden` em abas inativas e seções fora da viewport (`.is-dormant`).

## Por que funcionou bem

- **Carregamento inicial instantâneo:** zero disputa de rede/CPU entre o preloader, o WebGL e 5 iframes externos simultâneos.
- **Scroll fluido a 60/120fps mesmo em notebooks com GPU integrada:** eliminar `filter: blur(85px)` animado em `scrub`, `backdrop-filter` sobre WebGL e repaints de `radial-gradient` libera imediatamente o compositor da GPU.
- **Zero consumo em repouso:** com a página parada, a CPU cai praticamente a 0% graças ao *idle sleep* dos loops `rAF`.

## Como replicar em futuras páginas

```js
// 1. Configuração obrigatória em js/core/gsap.js
ScrollTrigger.config({ ignoreMobileResize: true, limitCallbacks: true });
gsap.ticker.lagSmoothing(500, 33);

// 2. Padrão obrigatório de Idle Sleep em qualquer loop rAF com lerp
function draw() {
  if (!isVisible || document.hidden) {
    rafId = null;
    return;
  }
  const gap = target - current;
  if (Math.abs(gap) < 0.0005) {
    current = target;
    render();
    rafId = null; // Dorme até a próxima interação!
    return;
  }
  current += gap * 0.12;
  render();
  rafId = requestAnimationFrame(draw);
}
```

## Checklist de aplicação

- [ ] `gsap.ticker.lagSmoothing(500, 33)` e `ScrollTrigger.config({ limitCallbacks: true, ignoreMobileResize: true })` ativos
- [ ] `ScrollTrigger.refresh()` agrupado com debounce + `requestAnimationFrame`
- [ ] Zero `filter: blur()` em glows que já usam `radial-gradient(..., transparent)` e zero `filter` em tweens GSAP
- [ ] Zero `getBoundingClientRect()` / `getComputedStyle()` dentro de `rAF`, `mousemove` ou `scroll`
- [ ] Todo loop `rAF` tem `IntersectionObserver`, `visibilitychange` e *idle sleep* quando assentado
- [ ] `<iframe>`s carregados sob demanda (1 por vez) com `content-visibility: hidden` quando ocultos
- [ ] WebGL com `antialias: false` (em partículas/wireframe), `dpr <= 1.5` e loop iniciado após preloader
