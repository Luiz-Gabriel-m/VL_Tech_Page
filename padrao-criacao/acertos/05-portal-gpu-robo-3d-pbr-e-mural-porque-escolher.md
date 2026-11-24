# 05 — Portal GPU Unificado, Robô 3D Studio PBR, Mural Sincronizado e Dev Server Nativo

- **Data:** 2026-11-24
- **Projeto de origem:** VL_Tech_Page
- **Categoria:** 3D & WebGL | Animação GSAP | Arquitetura | Conversão
- **Arquivos de referência:** `js/automacao-portal.js`, `js/automacao-robot-3d.js`, `css/sections/automacao-portal.css`, `js/why-choose-wall.js`, `css/sections/why-choose-wall.css`, `scripts/dev-server.mjs`, `package.json`

---

## O que foi feito

1. **Portal de Automação 100% GPU em palco `sticky` único (`js/automacao-portal.js`):**
   - Trocou o `SVG <clipPath>` sujeito a flicker e cortes por uma transição direta em `transform: scale()` + `opacity` dentro de um único `.auto-sticky-viewport` (`100svh`).
   - A palavra `"AUTOMAÇÃO"` mergulha em direção à câmera enquanto o palco do Robô 3D já nasce perfeitamente enquadrado atrás dela, liberando `pointer-events` assim que o portal abre (`progress >= 0.68`).
2. **Robô 3D Vanilla fiel ao `RobotHero` (21st.dev) com Studio PBR (`js/automacao-robot-3d.js`):**
   - `THREE.PMREMGenerator` cria um mapa de ambiente de estúdio procedural em Three.js puro (sem dependências `@react-three/drei`), dando volume real ao chassi PBR granulado, visor obsidian e antenas metálicas.
   - Física de mola estável integrada com `* dt` + `clamp`, decaimento exponencial (`1 - Math.exp(-rate * dt)`), tracking de cursor normalizado pela viewport (imune a scroll), `THREE.Raycaster` para olhos de coração 3D (`HeartCurve`), `ResizeObserver` no canvas e 4 modos interativos completos com layout limpo sem sobreposição.
3. **Mural "Por Que Nos Escolher" com Nano Banana + Texto Sincronizado (`js/why-choose-wall.js`):**
   - Título de abertura `"POR QUE NOS ESCOLHER"` some suavemente ao iniciar o scroll (`autoAlpha: 0`), liberando 100% da tela para os cards.
   - Em cada pilar (6 artes editoriais geradas no Nano Banana em `assets/images/porque-escolher/` + 2 retratos reais dos sócios), **imagem e texto explicativo** ficam no mesmo bloco `.spw-item`, crescem juntos (`scale` + `autoAlpha`), seguram no centro da viewport para leitura e somem juntos ao sair — com trigger ancorado na célula pai estática `.spw-cell`.
4. **Servidor local zero-dependência (`scripts/dev-server.mjs` + `package.json`):**
   - Scripts `dev`, `start` e `serve` configurados no `package.json` servindo `http://localhost:3000` instantaneamente com MIME types corretos para preview/webviews.

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
