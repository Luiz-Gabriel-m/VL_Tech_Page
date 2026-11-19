# 03 — `ScrollTrigger pin` com `<iframe>`, `overflow-x: hidden` e Clamping de Geometria 3D

- **Data:** 2026-11-19
- **Projeto de origem:** VL_Tech_Page
- **Severidade:** Crítica
- **Categoria:** Animação | Layout
- **Commits/arquivos relacionados:** `js/responsive-showcase.js`, `css/sections/responsive-showcase.css`, `css/variables.css`, `js/partners-tech.js`, `css/sections/partners-wheel.css`, `js/footer.js`, `index.html`

---

## O que deu errado (Sintoma)

1. **Seção `#responsividade` sumindo e invadindo seções abaixo (`#socios-scrolly` / `#faq`):**
   Ao finalizar o preloader ou carregar fontes (`ScrollTrigger.refresh()`), o console disparava `NotFoundError: Failed to execute 'insertBefore' on 'Node'` dentro de `_swapPinOut` do GSAP ScrollTrigger. A `.pin-spacer` era removida no meio do refresh, colapsando a altura da seção (de `2655px` para `707px`) e fazendo os celulares 3D flutuarem sobre o FAQ.
2. **Cards da Roda 3D (`#parceiros`) cortados no topo e na base + colisão com a navbar fixa:**
   Em viewports de ~705px de altura (ex.: notebook ou preview lateral), o raio fixo proporcional ao card (`ringR = cardH * 1.14`) ultrapassava metade da altura da tela, cortando os cards superior e inferior e sobrepondo o eyebrow à logo fixa da navbar.
3. **Botão "Voltar ao Topo" sem resposta e cache antigo de `js/main.js`:**
   `gsap.to(window, { scrollTo: ... })` falhava silenciosamente por falta do `ScrollToPlugin` na CDN; além disso, editar módulos sem atualizar `?v=X.Y` em `index.html` fazia o preview continuar executando a versão antiga em cache.

## Causa raiz (Por que aconteceu)

1. **GSAP `pin: elemento` muta o DOM** envolvendo e desembrulhando o alvo dentro de uma `<div class="pin-spacer">` via `insertBefore` em cada `ScrollTrigger.refresh()`. Quando o container pinado possui `<iframe>` embutidos (como as 5 prévias ao vivo das Heros dentro do notebook 3D), mover o nó no DOM dispara mutações/reloads internos no Chromium e quebra `_swapPinOut`.
2. **`body { overflow-x: hidden; }` quebra `position: sticky`:** tentar usar `position: sticky` com `overflow-x: hidden` em um ancestral impede o elemento de grudar no topo durante o scroll.
3. **Geometria 3D baseada apenas no tamanho do card** sem teto relativo à altura útil da viewport (`h * 0.305`) sempre estoura em telas mais baixas; e `.section` global (`padding-block` + `overflow: hidden`) interferia em seções `100vh`.

## Como foi resolvido

1. **Troca de `pin: pinViewport` por CSS `position: sticky; top: 0` nativo:**
   - Em `css/variables.css`, trocado `overflow-x: hidden` no `body` por **`overflow-x: clip`** (mantém o corte horizontal sem quebrar `position: sticky`).
   - Em `css/sections/responsive-showcase.css`, a seção pai recebeu altura fixa de pista (`height: calc(100vh + 1950px); overflow: visible !important;`) e o palco recebeu `position: sticky; top: 0; height: 100vh;`.
   - Em `js/responsive-showcase.js`, o ScrollTrigger passou a fazer apenas `scrub` (`start: 'top top'`, `end: 'bottom bottom'`, **sem `pin`**), eliminando 100% da mutação no DOM e dos erros de `insertBefore`.
2. **Clamping de geometria 3D na viewport (`js/partners-tech.js`):**
   - Limitado o raio do anel por `maxRingR = Math.min(h * 0.305, w * 0.245)` e centralizado o badge superior (que faz fade-out ao abrir o tambor 3D).
3. **Scroll suave sem plugin externo (`js/footer.js`) e versionamento de cache (`?v=`):**
   - Substituído `scrollTo` por um proxy numérico do GSAP (`gsap.to({ y: startY }, { y: 0, onUpdate: () => window.scrollTo(0, Math.round(proxy.y)) })`) com cancelamento em `wheel`/`touchstart`.
   - Atualizadas as query strings `?v=` em `index.html` e `js/main.js` a cada alteração relevante.

## Regra para nunca repetir

> **Regra de ouro:** Nunca use `ScrollTrigger` com `pin: true` em containers que possuam `<iframe>` (ou WebGL/DOM sensível a reparenting) — use **`position: sticky; top: 0` + `body { overflow-x: clip }`** com ScrollTrigger apenas em modo `scrub`. Sempre limite geometrias 3D circulares à altura da viewport (`h`) e nunca use `gsap.to(window, { scrollTo })` sem confirmar que o `ScrollToPlugin` está carregado.
