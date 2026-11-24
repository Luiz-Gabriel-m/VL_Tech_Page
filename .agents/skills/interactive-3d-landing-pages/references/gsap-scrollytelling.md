# GSAP 3 + ScrollTrigger — Padrão de Scrollytelling VL Tech

Regras de engenharia para criar animações cinematográficas e seções pinadas fluidas, evitando os erros mais comuns (espaços pretos vazios, sobreposição de texto e saltos no mobile).

---

## 1. Arquitetura Obrigatória de 3 Camadas para Pin Horizontal

Nunca use o mesmo elemento como trigger, pin e alvo de translação `X`. Separe sempre:

```html
<section class="horizontal-scroll-container" id="minha-secao">
  <div class="horizontal-pin-wrapper">
    <div class="horizontal-track">
      <!-- Cards / slides -->
    </div>
  </div>
</section>
```

- **`container`:** gatilho estável do ScrollTrigger (nunca animar `transform` nele).
- **`pinWrapper`:** elemento que recebe `pin: true` (`height: 100vh; overflow: hidden;`).
- **`track`:** elemento deslocado em `x` com distância calculada dinamicamente via `scrollWidth`.

---

## 2. Cálculo Dinâmico 1:1 + Hold Final (Zero Blank Void)

```js
const getViewportWidth = () => pinWrapper.clientWidth || window.innerWidth;
const getDistance = () => {
  const trackWidth = Math.max(track.scrollWidth, track.offsetWidth);
  const startOffset = track.offsetLeft || 0;
  return Math.max(0, Math.ceil(startOffset + trackWidth - getViewportWidth()));
};
const getHold = () => Math.round(window.innerHeight * 0.25);

const tl = gsap.timeline({
  scrollTrigger: {
    trigger: container,
    pin: pinWrapper,
    start: 'top top',
    end: () => `+=${getDistance() + getHold()}`,
    scrub: 1,
    invalidateOnRefresh: true,
    anticipatePin: 1,
  },
});

tl.to(track, { x: () => -getDistance(), ease: 'none', duration: 1 })
  .to({}, { duration: 0.25 }); // Hold para absorver a inércia do scrub
```

Pontos críticos:
- Use sempre funções (`() => ...`) em `end` e `x` combinadas com `invalidateOnRefresh: true` para recalcular perfeitamente no resize.
- Chame `ScrollTrigger.refresh()` após o carregamento de fontes (`document.fonts.ready`) e imagens críticas que alteram altura.

---

## 3. Coreografia Sem Sobreposição de Texto (Zero Overlap)

Quando uma seção pinada troca entre Estado A e Estado B no mesmo espaço visual:
1. **Saída completa de A:** `opacity: 0`, `y: -24`, `pointerEvents: 'none'` (ex.: `0.00 → 0.35`).
2. **Pausa de respiro (gap):** pequeno intervalo limpo (ex.: `0.35 → 0.42`) onde nenhum dos dois textos compete visualmente.
3. **Entrada de B:** `opacity: 1`, `y: 0`, `pointerEvents: 'auto'` (ex.: `0.42 → 0.78`).
4. **Hold de leitura:** (ex.: `0.78 → 1.00`).

Teste obrigatoriamente rolando **para baixo e de volta para cima** rápido!

---

## 4. Responsividade e Acessibilidade com `gsap.matchMedia()`

```js
const mm = gsap.matchMedia();

mm.add(
  {
    isDesktop: '(min-width: 1024px)',
    isMobile: '(max-width: 1023px)',
    reduceMotion: '(prefers-reduced-motion: reduce)',
  },
  (context) => {
    const { isDesktop, reduceMotion } = context.conditions;

    if (reduceMotion) {
      // Exibir conteúdo imediatamente sem travar scroll
      return;
    }

    if (isDesktop) {
      // Montar scrollytelling complexo / pinagem horizontal
    } else {
      // Layout vertical limpo ou carrossel horizontal nativo com scroll-snap
    }
  }
);
```

---

## 5. Regras de Ouro de Performance (60/120fps)

- **Configuração global obrigatória (`js/core/gsap.js`):**
  ```js
  ScrollTrigger.config({ ignoreMobileResize: true, limitCallbacks: true });
  gsap.ticker.lagSmoothing(500, 33);
  ```
- **Debounce no `ScrollTrigger.refresh()`:** consolide recálculos de `fonts.ready`, `window.load` e `loader:complete` em um único timer debounced (~120ms) dentro de `requestAnimationFrame` para nunca causar travamentos no boot.
- Anime **apenas** `transform` (`x`, `y`, `scale`, `rotate`, `rotateX/Y`), `opacity` e `clip-path`.
- **Nunca anime** `width`, `height`, `top`, `left`, `margin`, `padding`, `box-shadow`, `background` (`radial-gradient`) ou CSS `filter` (`blur`, `brightness`, `drop-shadow`) em `scrub` contínuo, tweens GSAP ou keyframes infinitos.
- **Glows ambientais sem `filter: blur()`:** use `radial-gradient` puro com 3–4 stops suaves até `transparent` — nunca aplique `filter: blur(60px+)` em elementos grandes (especialmente se o GSAP animar `scale`/`opacity` neles) e evite `backdrop-filter` sobre palcos WebGL/3D.
- **Drag e mousemove eficientes:** use `gsap.set()` ou `gsap.quickTo()` no `pointermove`/`mousemove` em vez de criar novos `gsap.to()` a cada pixel. Nunca chame `getBoundingClientRect()` ou `getComputedStyle()` dentro de `rAF`, `mousemove` ou `scroll` (cacheie no `resize`/`mouseenter` ou use `IntersectionObserver`).
- **Idle sleep obrigatório em loops `rAF`:** todo loop paralelo ao GSAP (WebGL, física 3D, roda 3D, cursor, canvas) deve usar `IntersectionObserver` + `visibilitychange`, cancelar o `rAF` de verdade fora da tela e dormir automaticamente (`rafId = null`) quando o movimento assentar.
- **Iframes em seções animadas:** nunca carregue múltiplos `<iframe>`s no boot — carregue sob demanda (apenas a aba ativa quando a seção abrir) e congele os inativos com `content-visibility: hidden` + `contain: strict`.
- Evite `will-change: transform` em dezenas de elementos aninhados ao mesmo tempo — aplique apenas no trilho ou camada realmente em movimento.
