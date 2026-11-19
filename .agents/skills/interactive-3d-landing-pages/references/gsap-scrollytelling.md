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

- Anime **apenas** `transform` (`x`, `y`, `scale`, `rotate`, `rotateX/Y`), `opacity` e `clip-path`.
- **Nunca anime** `width`, `height`, `top`, `left`, `margin`, `padding` ou `box-shadow` em `scrub` contínuo.
- Use `gsap.quickTo()` para seguir o mouse (cursor, tilt, parallax) em vez de criar um novo `gsap.to()` a cada evento `mousemove`.
- Evite `will-change: transform` em dezenas de elementos ao mesmo tempo — aplique apenas no trilho ou elemento realmente em movimento.
