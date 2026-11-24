# 04 — Travamento Severo no Load e Scroll (GSAP + Loops `rAF` + Blur GPU + Iframes)

- **Data:** 2026-11-20
- **Projeto de origem:** VL_Tech_Page
- **Severidade:** Crítica
- **Categoria:** Performance | Animação GSAP | GPU & Layout
- **Arquivos relacionados:** `js/core/gsap.js`, `js/main.js`, `js/tech-hero-3d.js`, `js/responsive-showcase.js`, `js/partners-tech.js`, `js/badge-3d.js`, `js/cursor.js`, `js/navigation.js`, `js/footer-pong.js`, `css/layout.css`, `styles.css`, `css/sections/responsive-showcase.css`, `css/sections/partners-wheel.css`, `css/sections/founders-badge.css`

---

## O que deu errado (Sintoma)

Ao acessar a página ou começar a rolar pelas seções com animações GSAP/3D, o site ficava **severamente travado** (engasgos de FPS, lentidão no preloader, scroll pesado e CPU/GPU no limite mesmo sem o usuário interagir).

## Causa raiz (Por que aconteceu)

Uma combinação de 6 gargalos simultâneos sufocava a main thread e o compositor GPU ao mesmo tempo:

1. **5 `<iframe>`s externos `1440×900` carregando no boot (`js/responsive-showcase.js`):**
   - `ensureIframeLoaded(0)` disparava no carregamento inicial durante o preloader, e um `IntersectionObserver` com `rootMargin: '900px'` disparava imediatamente em `scrollY = 0` (porque `#responsividade` fica logo abaixo de um `#hero` de `100svh`), baixando e renderizando **5 páginas web completas simultaneamente** dentro de um container `preserve-3d` animado por GSAP `scrub`.
   - Mesmo após trocadas as abas, os 4 iframes ocultos permaneciam apenas com `visibility: hidden` (continuando a consumir CPU/GPU) em vez de congelados com `content-visibility: hidden`.
2. **Layout thrashing (`getComputedStyle` / `getBoundingClientRect`) em loops 60fps e eventos contínuos:**
   - A cascata binária em `js/responsive-showcase.js` chamava `getComputedStyle(overlay).opacity` **dentro do `requestAnimationFrame` a 60fps** mesmo quando invisível.
   - `js/tech-hero-3d.js` e `js/badge-3d.js` chamavam `getBoundingClientRect()` em **todo evento `mousemove`**.
   - `js/navigation.js` chamava `heroEl.getBoundingClientRect()` em **todo evento `scroll`**.
3. **Loops `requestAnimationFrame` infinitos sem *idle sleep* nem parada real:**
   - `js/tech-hero-3d.js` chamava `requestAnimationFrame(animate)` mesmo quando `!isVisible`, além de rodar 1500 partículas com `antialias: true` e `dpr: 2` **por trás do preloader**.
   - `js/partners-tech.js` continuava reescrevendo `transform`, `opacity` e `zIndex` de 8 cards 3D a 60fps **para sempre**, mesmo depois que a roda já tinha parado (`gap < 0.0005`).
   - `js/badge-3d.js` iniciava com `isVisible = true` (rodando lá embaixo no boot) e reescrevia `specular.style.background = 'radial-gradient(...)'` + `angleDisplay.textContent` em todo frame (forçando **Paint + Layout** 60x/s).
   - `js/cursor.js` mantinha um `rAF` 60fps infinito mesmo com o mouse totalmente parado.
4. **`filter: blur(64px–85px)` e `backdrop-filter: blur(14px)` sobre camadas animadas por GSAP/WebGL:**
   - Glows ambientais de ~1000×600px que já eram `radial-gradient(..., transparent 74%)` tinham `filter: blur(85px)` em cima — e no `#responsividade` o GSAP animava `scale`/`opacity` dessa camada em `scrub` contínuo!
   - 8 cards da Roda 3D tinham `filter: blur(22px)` simultâneos dentro de `preserve-3d`.
   - Botões fixos da navbar tinham `backdrop-filter: blur(14px)` sobre o canvas WebGL + um `@keyframes` infinito animando `filter: drop-shadow(...)` no botão `FX ON`.
5. **GSAP animando propriedades que forçam repaint ou recriando tweens por pixel:**
   - `js/responsive-showcase.js` animava `filter: 'brightness(...)'` nos 5 celulares 3D e criava 5 novos `gsap.to()` em cada pixel de `pointermove` durante o drag.
   - Múltiplas chamadas síncronas de `ScrollTrigger.refresh()` no boot/loader/fonts sem debounce.
6. **`ctx.shadowBlur` por frame no Canvas 2D (`js/footer-pong.js`):**
   - `shadowBlur = 14` em cada frame penaliza fortemente a rasterização 2D.

## Como foi resolvido

1. **GSAP blindado (`js/core/gsap.js` & `js/main.js`):**
   - Configurado `gsap.ticker.lagSmoothing(500, 33)` e `ScrollTrigger.config({ ignoreMobileResize: true, limitCallbacks: true })`.
   - `ScrollTrigger.refresh()` centralizado com debounce (`120ms` + `requestAnimationFrame`).
2. **Iframes 100% sob demanda + congelamento fora de foco (`js/responsive-showcase.js` & `css/sections/responsive-showcase.css`):**
   - Zero iframe carregado no boot; carrega **apenas a aba ativa** quando a tampa do notebook começa a abrir (`progress >= 0.12`) ou ao clicar em outra aba.
   - `contain: strict` no viewport do monitor e `content-visibility: hidden` em `.resp-tab-pane:not(.is-active)` e quando a seção recebe `.is-dormant` fora da viewport.
   - Cascata binária controlada por `matrix.setActive(p >= 0.15 && p <= 0.46)` a ~30fps (0% CPU fora dessa janela, zero `getComputedStyle`).
   - Removido `filter: brightness()` dos tweens GSAP e trocado drag para `gsap.set()`.
3. **Idle sleep real em todos os `rAF` e WebGL enxuto:**
   - `tech-hero-3d.js`: `cancelAnimationFrame` real fora da tela/aba oculta, só liga o loop após `LOADER_COMPLETE_EVENT`, `antialias: false`, `dpr <= 1.5`, partículas calibradas e dimensões cacheadas no resize.
   - `partners-tech.js` e `cursor.js`: param o `rAF` automaticamente quando assentam e acordam sob demanda na interação.
   - `badge-3d.js`: nasce `isVisible = false`, move o brilho especular com `transform: translate3d(...)` em filho recortado (zero repaint de `radial-gradient`), aplica dirty-check em `textContent`/`visibility` e cacheia `stageRect`.
   - `navigation.js`: trocou `scroll` + `getBoundingClientRect()` por `IntersectionObserver`.
4. **Remoção de `filter: blur()` redundante e `backdrop-filter` sobre 3D/WebGL:**
   - Glows convertidos para `radial-gradient` puro com stops suaves (visual idêntico, fração do custo GPU).
   - Removido `filter: drop-shadow` de keyframes contínuos e `ctx.shadowBlur` do Pong.

## Regra para nunca repetir

> **Regra de ouro:** Em páginas com GSAP + 3D/WebGL:
> 1. **Nunca** anime `filter` (`blur`, `brightness`, `drop-shadow`) nem `background: radial-gradient(...)` em timelines GSAP, `scrub`, keyframes infinitos ou `rAF`. Use apenas `transform` e `opacity`.
> 2. **Nunca** leia layout (`getComputedStyle`, `getBoundingClientRect`) dentro de `requestAnimationFrame`, `mousemove` ou `scroll` — cacheie no `resize`/`mouseenter` ou use `IntersectionObserver`.
> 3. **Todo loop `rAF` precisa de *idle sleep* + pausa real (`cancelAnimationFrame`)** fora da viewport e quando `document.hidden` for `true`.
> 4. **Nunca** pré-carregue múltiplos `<iframe>`s pesados no boot — carregue sob demanda (1 por vez) e congele os inativos com `content-visibility: hidden`.
> 5. **Nunca** aplique `filter: blur(60px+)` em cima de um `radial-gradient` que já termina em `transparent`, e evite `backdrop-filter` sobre palcos WebGL/3D animados.
