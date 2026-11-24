# 05 — SVG ClipPath Bloqueando Cliques, Mola Sem `dt`, `wrapRect` Obsoleto e Título Sobreposto

- **Data:** 2026-11-24
- **Projeto de origem:** VL_Tech_Page
- **Severidade:** Crítica
- **Categoria:** 3D & WebGL | Interação | Animação GSAP | DevEx
- **Arquivos relacionados:** `js/automacao-portal.js`, `js/automacao-robot-3d.js`, `css/sections/automacao-portal.css`, `js/why-choose-wall.js`, `css/sections/why-choose-wall.css`, `package.json`

---

## O que deu errado (Sintoma)

1. **Robô 3D e abas de Automação "bugados":**
   - Os botões de modo e o próprio robô não respondiam a cliques durante parte da entrada na seção.
   - Ao clicar no robô ou trocar de aba, ele podia quicar violentamente ou sumir da tela em quedas de FPS.
   - Ao rolar a página com o mouse sobre a seção, a cabeça do robô torcia para trás/ângulos extremos.
   - A transição com `SVG <clipPath>` escalado + conteúdo abaixo com `margin-top` gerava corte brusco e sensação de palco desalinhado, agravada por excesso de caixas flutuantes sobre o robô.
2. **Mural "Por Que Nos Escolher":**
   - O título central fixo permanecia sobreposto sobre os cards durante toda a seção, atrapalhando a leitura dos textos de cada diferencial.
3. **Preview do projeto não subia no app:**
   - `package.json` não possuía script `"dev"`, `"start"` ou `"serve"` para iniciar o servidor local na porta esperada.

## Causa raiz (Por que aconteceu)

1. **`pointer-events: none` tardio + `SVG <clipPath>` gigante:** `[data-gp-content]` só recebia `pointer-events: auto` em `p >= 0.88`, enquanto `[data-gp-pin]` continuava interceptando eventos por cima.
2. **Erro de integração física (`bounceOffset += bounceVel` sem `* dt`):** Sem multiplicar por `dt`, o ganho efetivo `k * dt` ultrapassava o limite de estabilidade de Euler explícito em quedas de FPS (~30fps), fazendo `bounceOffset` divergir para `±Infinity`.
3. **Cache de `getBoundingClientRect()` sem invalidar no scroll:** `wrapRect` era capturado no `mouseenter` e ficava defasado centenas de pixels após o scroll, enviando `pointerY` fora de `[-1, 1]` sem `clamp`.
4. **Sobreposição de camadas:** Feed flutuante + balão + hint + 3 colunas no rodapé competiam pelo espaço da arena 3D; no mural, o título `sticky` nunca fazia fade-out.
5. **Ausência de script `dev` no `package.json`.**

## Como foi resolvido

1. **Portal reescrito em palco `sticky` único 100% GPU (`js/automacao-portal.js`):** Zoom de `"AUTOMAÇÃO"` via `scale` + `opacity` revelando o palco do robô já centralizado atrás, com `veil.style.pointerEvents = 'none'` e `visibility: hidden` assim que abre.
2. **Física e tracking blindados (`js/automacao-robot-3d.js`):** `bounceOffset = clamp(bounceOffset + bounceVel * dt, -0.08, 0.22)`, `expDecay(rate)` independente de FPS, ponteiro normalizado direto pela viewport (`window.innerWidth/Height`) clampado em `[-1, 1]`, iluminação Studio PBR via `PMREMGenerator` e layout da aba do robô limpo sem caixas sobrepostas.
3. **Fade-out do título + sincronia imagem/texto (`js/why-choose-wall.js`):** O cabeçalho `"POR QUE NOS ESCOLHER"` faz fade para `autoAlpha: 0` ao iniciar a rolagem, e cada diferencial anima imagem + texto juntos (`scale` + `autoAlpha` com pausa de leitura no centro).
4. **Dev server nativo (`scripts/dev-server.mjs`):** Adicionados scripts `dev`, `start` e `serve` ao `package.json` escutando em `http://localhost:3000`.

## Regra para nunca repetir

> **Regra de ouro:**
> 1. **Nunca** integre posição física sem `* dt` (`x += v * dt`) e **sempre** aplique `clamp` em deslocamentos e ângulos 3D.
> 2. **Nunca** use `wrapRect` cacheado no `mouseenter` para calcular posição de ponteiro em páginas com scroll — normalize pela viewport com `clamp(-1, 1)` ou invalide no scroll.
> 3. **Nunca** deixe uma camada de transição (`sticky` ou overlay) com `pointer-events: auto` sobre conteúdo interativo depois de revelar.
> 4. **Sempre** inclua um script `"dev"` funcional no `package.json` para previews locais e webviews.
