# 05 — Portal GPU Unificado, Robô 3D Studio PBR, Mural Sincronizado e Dev Server Nativo

- **Data:** 2026-11-24
- **Projeto de origem:** VL_Tech_Page
- **Categoria:** 3D & WebGL | Animação GSAP | Arquitetura | Conversão
- **Arquivos de referência:** `js/automacao-portal.js`, `js/automacao-robot-3d.js`, `css/sections/automacao-portal.css`, `js/why-choose-wall.js`, `css/sections/why-choose-wall.css`, `scripts/dev-server.mjs`, `package.json`

---

## O que foi feito

1. **Glyph Portal `"AUTOMAÇÃO"` Otimizado em Palco `sticky` Único (`js/automacao-portal.js`):**
   - Mantém o impacto visual do zoom por dentro da letra escolhida (`SVG <clipPath>`) até preencher 100% da tela, mas **sem engasgo e sem bloquear cliques**:
     - Palco único `position: sticky; top: 0` (`100svh`) com `GSAP ScrollTrigger` `scrub: 0.35` (sem deslocar conteúdo com `margin-top`).
     - **Handoff GPU inteligente (`vl:automacao-card-state` + `data-robot-awake`):** o WebGL Three.js fica pausado durante o zoom da letra (`p < 0.46`); assim que a letra preenche 100% da tela (`t >= 0.99`), o `clipPath` é desligado (`none`), o SVG oculta (`visibility: hidden`), `gpRobotLayer` libera `pointer-events: auto` e o Robô 3D acorda com 100% da GPU livre.
2. **Robô 3D Vanilla fiel ao `RobotHero` (21st.dev) com Studio PBR + Arrasto 360° (`js/automacao-robot-3d.js`):**
   - `THREE.PMREMGenerator` cria um mapa de ambiente de estúdio procedural em Three.js puro (sem dependências `@react-three/drei`), dando volume real ao chassi PBR granulado, visor obsidian e antenas metálicas.
   - Física de mola estável integrada com `* dt` + `clamp`, decaimento exponencial (`1 - Math.exp(-rate * dt)`), tracking de cursor normalizado pela viewport (imune a scroll), **arrasto 3D interativo** (`pointerdown`/`pointermove` girando e deslocando o robô com retorno elástico suave ao soltar), `THREE.Raycaster` para olhos de coração 3D (`HeartCurve`) em cliques rápidos, `ResizeObserver` no canvas e 4 modos interativos completos com layout limpo sem sobreposição.
3. **Mural "Por Que Nos Escolher" com Nano Banana + Texto Solto ao Lado (`js/why-choose-wall.js`):**
   - Título de abertura `"POR QUE NOS ESCOLHER"` some suavemente ao iniciar o scroll (`autoAlpha: 0`), liberando 100% da tela para os cards.
   - Em cada pilar (6 artes editoriais geradas no Nano Banana em `assets/images/porque-escolher/` comprimidas para `55–95 KB`, `900×900` + 2 retratos reais dos sócios), a **imagem fica isolada no card** e o **texto explicativo flutua solto ao lado (fora da caixa, sem fundo/borda)** com traço vermelho conector, alternando esquerda/direita em 12 colunas. Ambos crescem juntos (`scale` + `autoAlpha`), seguram no centro para leitura e somem juntos ao sair.
4. **Roda 3D de Produtos Auto-Animada + Ligação com Seções (`js/partners-tech.js` + `css/sections/partners-wheel.css`):**
   - Catálogo `"PRODUTOS VL"` inicia automaticamente ao entrar na viewport (`IntersectionObserver` com `threshold: 0.25`): exibe o anel 360° brevemente (`650ms`), abre no tambor 3D curvo e alterna entre os 8 produtos a cada `3.8s` com controle **Play/Pause** e pausa inteligente em hover/interação/aba oculta.
   - Cada produto conecta diretamente à sua seção (`#hero`, `#responsividade`, `#automacao`, `#diferenciais`, `#socios-scrolly`), e os produtos de Automação já ativam automaticamente o modo correspondente no Robô 3D (`window.app.automacaoRobot.setMode(...)`) ao navegar!
5. **Servidor local zero-dependência dual-stack (`scripts/dev-server.mjs` + `package.json`):**
   - Scripts `dev`, `start` e `serve` configurados no `package.json` com bind dual-stack (`localhost` IPv4 + IPv6), suporte a `--port`/`-p`/`--host` e fallback automático de porta em `EADDRINUSE`.

## Por que funcionou bem

- **Zero flicker e zero bloqueio de cliques** na transição de entrada da seção de Automação.
- **Palco do Robô 3D muito mais legível e interativo**, com contraste de estúdio e 4 abas que transformam cor, iluminação, copy, métricas e CTA em tempo real.
- **Leitura confortável no mural "Por Que Nos Escolher"** sem conflito entre título fixo e cards, com assets locais leves e identidade visual 100% unificada (`#0A0A0C` + `#FF1E26`).
- **Preview funciona de primeira** em qualquer ambiente/app que execute `npm run dev`.

## Checklist de aplicação

- [ ] Em portais de entrada de seção, usar palco `sticky` único com `transform` + `opacity` e alternar `pointer-events` / `visibility` do véu assim que abrir
- [ ] Em cenas Three.js PBR sem Drei, gerar `scene.environment` com `THREE.PMREMGenerator` e dar `.dispose()` no `envRT`
- [ ] Em animações de mola no `rAF`, multiplicar SEMPRE velocidade e posição por `dt` (com `dt` clampado e exponencial em lerps)
- [ ] Em cards animados por `scale(0 -> 1 -> 0)`, ancorar o `ScrollTrigger` no container pai estático (`.spw-cell`) e agrupar imagem + texto no mesmo elemento animado
- [ ] Garantir script `dev` funcional no `package.json` mesmo em projetos Vanilla estáticos
