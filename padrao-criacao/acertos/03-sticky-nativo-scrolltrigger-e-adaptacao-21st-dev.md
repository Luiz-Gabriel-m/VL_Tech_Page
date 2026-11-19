# 03 — Scrollytelling 3D com CSS `sticky` Nativo e Adaptação de Componentes 21st.dev

- **Data:** 2026-11-19
- **Projeto de origem:** VL_Tech_Page
- **Categoria:** Animação | Arquitetura | UI/Design
- **Arquivos de referência:** `css/variables.css`, `css/sections/responsive-showcase.css`, `js/responsive-showcase.js`, `css/sections/partners-wheel.css`, `js/partners-tech.js`, `css/sections/hero-sticker.css`, `js/hero-sticker-headline.js`, `css/sections/footer-pong.css`, `js/footer-pong.js`

---

## O que foi feito

1. **Scrollytelling 3D blindado com `position: sticky` + GSAP ScrollTrigger `scrub` (sem `pin`):**
   A seção `#responsividade` (Notebook 3D fechado vindo de longe → abertura com cascata binária `0/1` → navegador real com 5 abas e Heros ao vivo em `<iframe>` 1440×900 escalado → Carrossel 3D de celulares com logos) passou a usar pista CSS (`height: calc(100vh + 1950px)`) com palco `position: sticky; top: 0` e `body { overflow-x: clip }`, deixando o GSAP controlar apenas a coreografia por `scrub`.
2. **Pipeline validado de adaptação da 21st.dev (dev21) para Vanilla ES Modules + CSS modular:**
   Quatro referências React/Tailwind/TypeScript da 21st.dev (`StickerSwapHeadline` no Hero, `PhoneCarousel` no Showcase, `WorksWheel` em Ecossistema/Stack e `PixelPong` no Rodapé) foram traduzidas para módulos ES puros + `css/sections/<secao>.css` sem bundler, preservando integralmente a paleta VL Tech (`#0A0A0C`, `#111114`, `#F8F8FC`, `#FF1E26`).

## Por que funcionou bem

- **Zero mutação de DOM no scroll:** `position: sticky` nunca envolve/desembrulha `.pin-spacer`, evitando `NotFoundError` em `_swapPinOut`, colapso de altura e recarregamento de `<iframe>`s ao redimensionar ou carregar fontes.
- **Performance real a 60 FPS:** todos os loops `requestAnimationFrame` (cascata binária, Roda 3D, Crachá 3D, Pong do Rodapé e WebGL do Hero) usam `IntersectionObserver` para pausar fora da tela e respeitam `prefers-reduced-motion`.
- **CSS isolado por seção:** cada seção interativa vive em `css/sections/*.css` com `padding: 0 !important` nas full-viewport, evitando regressões em `styles.css` e `layout.css`.
- **Verificação visual automatizada em browser headless:** testar cada estágio de scroll e checar `0` exceções de console antes de entregar elimina bugs invisíveis no código estático.

## Como replicar em futuras páginas

```css
/* 1. No global (css/variables.css): use clip em vez de hidden para preservar sticky */
body {
  overflow-x: clip;
}

/* 2. Na seção scrollytelling (css/sections/<secao>.css) */
.minha-secao-scrolly {
  position: relative;
  height: calc(100vh + 1950px);
  padding: 0 !important;
  overflow: visible !important;
}

.minha-secao-viewport {
  position: sticky;
  top: 0;
  height: 100vh;
  overflow: hidden;
}
```

```js
// 3. No módulo ES (js/<secao>.js): duas timelines sem colisão de propriedades e SEM pin
const approachTl = gsap.timeline({
  scrollTrigger: {
    trigger: section,
    start: 'top 95%',
    end: 'top top',
    scrub: 0.55,
    invalidateOnRefresh: true,
  },
});

const mainTl = gsap.timeline({
  scrollTrigger: {
    trigger: section,
    start: 'top top',
    end: 'bottom bottom',
    scrub: 0.65,
    invalidateOnRefresh: true,
  },
});
```

## Checklist de aplicação

- [ ] `body` usa `overflow-x: clip` (nunca `overflow-x: hidden`) quando houver seções `position: sticky`
- [ ] Nenhum ancestral entre `body` e o container `sticky` possui `overflow: hidden`
- [ ] Cada seção 21st.dev adaptada tem seu próprio `js/<secao>.js` + `css/sections/<secao>.css` (zero `.tsx` solto)
- [ ] Loops `rAF` pausam automaticamente via `IntersectionObserver` fora da viewport
- [ ] Geometria 3D respeita limites relativos à altura/largura útil da viewport (`Math.min(h * ..., w * ...)`)
- [ ] Query strings `?v=` atualizadas em `index.html` e `js/main.js` após alterações críticas
