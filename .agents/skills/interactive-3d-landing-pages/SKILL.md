---
name: interactive-3d-landing-pages
description: >-
  Especialista em criar landing pages e leadpages interativas de alta conversão e
  estética editorial/Awwwards com modelagem 3D (Three.js/WebGL e CSS 3D),
  JavaScript modular (ES Modules), GSAP 3 + ScrollTrigger e referências visuais
  adaptadas da plataforma 21st.dev (dev21). Use esta skill sempre que for criar,
  refatorar ou evoluir seções interativas, animações de scroll, componentes 3D
  ou novas landing pages da VL Tech.
---

# Interactive 3D Landing Pages (VL Tech)

Runbook operacional para desenvolver landing pages e leadpages interativas em 60/120fps combinando **JavaScript (ES Modules)**, **GSAP 3 + ScrollTrigger**, **Three.js / WebGL**, **CSS 3D** e referências de componentes modernos da plataforma **21st.dev (dev21)**.

---

## Pré-requisito Obrigatório (Memória do Projeto)

Antes de criar qualquer seção ou página nova:
1. Leia [`padrao-criacao/erros/README.md`](../../../padrao-criacao/erros/README.md) para **não repetir erros documentados**.
2. Leia [`padrao-criacao/acertos/README.md`](../../../padrao-criacao/acertos/README.md) para **reutilizar padrões já validados**.

---

## Fluxo de Execução Passo a Passo

### 1. Definir Stack e Arquitetura (Zero Mistura Acidental)
- Verifique o `package.json` antes de criar componentes.
- Em projetos estáticos (HTML/CSS/JS Vanilla + ES Modules, como a `VL_Tech_Page`), **nunca copie arquivos `.tsx` crus** da 21st.dev direto para o projeto sem adaptá-los para Vanilla JS + CSS Tokens (a menos que exista um bundler React/Astro/Vite configurado).
- Separe responsabilidades:
  - `css/variables.css` (design tokens semânticos)
  - `css/sections/<secao>.css` (estilos isolados; evite inflar um único `styles.css`)
  - `js/core/` (motores compartilhados: GSAP, scroll horizontal, WebGL manager, áudio)
  - `js/<secao>.js` (comportamento da seção)

### 2. Design System, Identidade e Conversão (Leadpage)
- Defina ou respeite os tokens em `:root` (`--bg-*`, `--surface-*`, `--brand-*`, `--text-*`, tipografia fluida com `clamp()`).
- Estruture toda leadpage para equilibrar **impacto visual 3D + conversão clara**:
  - **Above the fold:** proposta de valor imediata, elemento visual/3D protagonista, CTA primário visível sem depender de 5 telas de scroll.
  - **Prova social e autoridade:** logos de clientes, cases interativos, números reais.
  - **Ritmo visual:** alterne seções cinematográficas (3D / scrollytelling) com seções respiráveis e diretas (FAQ, benefícios, CTA final).

### 3. Referência e Adaptação da 21st.dev (dev21)
- Consulte [`references/21st-dev-adaptation.md`](./references/21st-dev-adaptation.md) sempre que for pesquisar, estudar ou portar componentes inspirados na **21st.dev** (carrosséis 3D, product shelves, tilt cards, galerias orbitais, bento grids, textos cinéticos, shaders).
- Sempre converta classes Tailwind/Framer Motion/React para a stack real do projeto mantendo a física, proporção e microinterações originais.

### 4. Modelagem e Renderização 3D (Three.js / WebGL & CSS 3D)
- Consulte [`references/3d-threejs-webgl.md`](./references/3d-threejs-webgl.md) para decidir entre **Three.js/WebGL** (modelos `.glb`/`.gltf`, geometrias procedurais, iluminação PBR, shaders, galerias cilíndricas) e **CSS 3D** (`perspective` + `preserve-3d` para cards, notebooks, crachás pêndulo).
- Aplique sempre controle de `devicePixelRatio`, pausa fora da viewport (`IntersectionObserver`) e limpeza de recursos GPU (`.dispose()`).

### 5. Scrollytelling e Animações (GSAP 3 + ScrollTrigger)
- Consulte [`references/gsap-scrollytelling.md`](./references/gsap-scrollytelling.md) antes de criar qualquer seção pinada ou timeline de scroll.
- Regra rígida: separe `container` (trigger) > `pinWrapper` (fixado) > `track` (animado), calcule largura dinamicamente via `scrollWidth`, adicione `holdRatio` e garanta transições sequenciais sem sobreposição de texto.

### 6. Verificação e Retroalimentação Obrigatória
Antes de concluir a entrega, valide todos os itens:
- [ ] Zero erros no console e zero links/assets quebrados (nomes em `kebab-case`, sem espaços ou extensão dupla).
- [ ] Animações usando apenas propriedades compostas na GPU (`transform`, `opacity`, `clip-path`).
- [ ] Scroll testado para baixo, para cima (reverso) e após redimensionamento da janela (zero *blank voids*).
- [ ] Acessibilidade e dispositivos móveis: `prefers-reduced-motion` respeitado e efeitos de cursor desativados em `pointer: coarse`.
- [ ] Se surgiu um novo padrão reutilizável ou uma armadilha nova, registre em `padrao-criacao/acertos/` ou `padrao-criacao/erros/`.
