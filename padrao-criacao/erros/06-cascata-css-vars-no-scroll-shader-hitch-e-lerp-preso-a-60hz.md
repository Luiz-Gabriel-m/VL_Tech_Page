# 06 — Cascata de CSS Vars no Scroll, Shader Hitch no 1º Clique e Lerp Preso a 60Hz

- **Data:** 2026-11-25
- **Projeto de origem:** VL_Tech_Page
- **Severidade:** Alta
- **Categoria:** Performance
- **Commits/arquivos relacionados:** `9abaad8` / `js/automacao-portal.js`, `js/automacao-robot-3d.js`, `css/sections/automacao-portal.css`, `js/partners-tech.js`, `js/tech-hero-3d.js`, `js/diferenciais-tunnel.js`, `js/cursor.js`, `css/layout.css`

---

## O que deu errado (Sintoma)

Mesmo após eliminar `filter: blur()` pesados e pausar loops fora da viewport, a transição da seção `#automacao` ainda apresentava micro-engasgos durante o zoom da palavra `"AUTOMAÇÃO"`, um pequeno soluço no instante em que o Robô 3D acordava ou recebia o 1º clique, e velocidades de suavização diferentes entre monitores 60Hz e 120Hz/144Hz.

## Causa raiz (Por que aconteceu)

1. **Recalc Style em cascata a 120fps:** `paint()` no `ScrollTrigger` chamava `section.style.setProperty('--gp-ink-veil', ...)` e escrevia `section.dataset.gpChoosing` em **todo frame** no elemento raiz `<section id="automacao">`, invalidando estilos de dezenas de nós filhos (toda a UI do robô).
2. **`mask-image` dentro de `clip-path: url(#...)` animado:** `.gp-portal-grid` permanecia visível e re-mascarado a cada frame enquanto o SVG `<clipPath>` dava zoom.
3. **Compilação tardia de shaders e texturas pesadas no boot:** `generatePbrTexturesAsync` fazia 13.000 chamadas `arc + fill` em `setTimeout(..., 0)` (travando a main thread por ~100ms) e aplicava `chassisMat.needsUpdate = true` sem `renderer.compile()`, deixando a compilação GLSL (e dos olhos de coração inicialmente `visible = false`) acontecer bem na hora do wake/1º clique.
4. **Reflow no handoff de scroll:** `onCardState` chamava `syncSize()` (`clientWidth`/`clientHeight`) dentro do evento disparado durante `ScrollTrigger.onUpdate`.
5. **Lerps sem `dt` e `backdrop-filter` fixo:** `x += (target - x) * 0.08` rodava 2× mais rápido em monitores 120Hz; `.founder-toggle-btn` mantinha `backdrop-filter: blur(14px)` fixo sobre palcos WebGL/SVG.

## Como foi resolvido

- Trocamos CSS vars/dataset na `<section>` por atualização direta nos nós-folha com dirty-check, escondemos `.gp-portal-grid` até o `clip-path` desligar e adicionamos `contain: strict` / `translateZ(0)`.
- Movemos texturas PBR para `requestIdleCallback` com `256×256` + 2 `fill()` em lote, pré-compilamos todos os shaders (inclusive `heartMesh`) com `renderer.compile(scene, camera)`, reduzimos ~55% dos triângulos mantendo suavidade PBR e removemos `syncSize()` do handoff de scroll.
- Convertemos todos os lerps de `rAF` para `1 - Math.exp(-rate * dt)` e removemos o `backdrop-filter` do botão fixo no header.

## Regra para nunca repetir

> **Regra de ouro:** Nunca atualize CSS custom properties ou `dataset` no container `<section>` dentro de callbacks de scroll/rAF — anime apenas nós-folha com dirty-check; sempre pré-compile shaders WebGL (incluindo meshes ocultos) em idle e use `1 - Math.exp(-rate * dt)` em qualquer lerp de `requestAnimationFrame`.
