# Padrão de Criação — VL Tech

Base viva de conhecimento da **VL Tech** para padronizar o desenvolvimento de futuras páginas e projetos web, registrando o que **funcionou muito bem** ([`acertos/`](./acertos/README.md)) e o que **deu dor de cabeça ou gerou retrabalho** ([`erros/`](./erros/README.md)).

---

## Estrutura das Pastas

```text
padrao-criacao/
├── README.md                                     # Este guia + checklist de novas páginas
├── acertos/                                      # Padrões validados para REPLICAR
│   ├── README.md                                 # Índice de acertos
│   ├── _TEMPLATE.md                              # Modelo para registrar novos acertos
│   ├── 01-arquitetura-e-design-system.md
│   ├── 02-scrollytelling-horizontal-unificado.md
│   ├── 03-sticky-nativo-scrolltrigger-e-adaptacao-21st-dev.md
│   ├── 04-performance-60fps-gsap-idle-sleep-gpu-compositing.md
│   ├── 05-portal-gpu-robo-3d-pbr-e-mural-porque-escolher.md
│   └── 06-fluidez-120fps-zero-recalc-precompilacao-webgl-e-lerp-dt.md
└── erros/                                        # Erros/armadilhas para EVITAR
    ├── README.md                                 # Índice de erros
    ├── _TEMPLATE.md                              # Modelo para registrar novos erros
    ├── 01-scrollytelling-e-layout.md
    ├── 02-organizacao-codigo-e-assets.md
    ├── 03-pin-scrolltrigger-com-iframes-e-geometria-viewport.md
    ├── 04-travamento-performance-gsap-raf-blur-iframes.md
    ├── 05-svg-clippath-trava-cliques-mola-sem-dt-e-titulo-sobreposto.md
    └── 06-cascata-css-vars-no-scroll-shader-hitch-e-lerp-preso-a-60hz.md
```

---

## Como Usar no Dia a Dia

1. **Antes de começar uma nova página:** revise o checklist abaixo e dê uma passada rápida em [`erros/README.md`](./erros/README.md).
2. **Quando algo ficar excelente e reutilizável:** copie [`acertos/_TEMPLATE.md`](./acertos/_TEMPLATE.md), crie um novo arquivo numerado em `acertos/` (ex.: `03-nome-do-acerto.md`) e adicione ao índice.
3. **Quando der alguma "cagada" ou bug chato:** copie [`erros/_TEMPLATE.md`](./erros/_TEMPLATE.md), documente o sintoma, a causa raiz e a regra preventiva em `erros/` (ex.: `03-nome-do-erro.md`) e adicione ao índice.

---

## Checklist Padrão Para Futuras Páginas

### Planejamento e Identidade
- [ ] Definir paleta oficial e criar tokens semânticos em `css/variables.css` **antes** de estilizar seções (sem nomes legados que não combinam com a cor real).
- [ ] Definir a stack real do projeto desde o início (ex.: HTML/CSS/JS puro **ou** Astro/React com build) — não misturar arquivos `.tsx` sem bundler em projeto estático.
- [ ] Padronizar nomes de pastas e arquivos de mídia em `kebab-case` sem espaços nem extensão dupla (`luiz-studio.jpg`, nunca `WhatsApp Image...` ou `.jpg.jpeg`).

### Estrutura de Código
- [ ] Quebrar o CSS por seção/componente (`css/variables.css`, `css/layout.css`, `css/sections/*.css`) em vez de acumular um único `styles.css` gigante.
- [ ] Manter `js/core/` para motores reutilizáveis (GSAP, scroll horizontal, áudio) e módulos separados por seção.
- [ ] Respeitar `prefers-reduced-motion` e desativar interações exclusivas de mouse (como cursor customizado) em dispositivos touch (`pointer: coarse`).

### Scrollytelling e Animações
- [ ] Configurar `gsap.ticker.lagSmoothing(500, 33)`, `ScrollTrigger.config({ ignoreMobileResize: true, limitCallbacks: true })` e consolidar `ScrollTrigger.refresh()` com debounce.
- [ ] Usar **`position: sticky; top: 0` + `body { overflow-x: clip }`** com ScrollTrigger apenas em `scrub` (sem `pin: true`) sempre que a seção contiver `<iframe>` ou DOM sensível a reparenting.
- [ ] Usar sempre o motor unificado para seções pinadas horizontais com cálculo dinâmico de `scrollWidth` + `holdRatio`.
- [ ] Garantir **idle sleep + `cancelAnimationFrame` real** em todos os loops `rAF` (WebGL, física 3D, cursor, canvas) fora da viewport e quando `document.hidden` for `true`.
- [ ] **Zero layout thrashing & zero repaint em 60/120fps:** nunca chamar `getComputedStyle`/`getBoundingClientRect` em `rAF`, `mousemove` ou `scroll`; nunca mutar CSS custom properties ou `dataset` na `<section>` durante scroll (atualizar nós-folha com dirty-check); nunca animar `filter` (`blur`, `brightness`, `drop-shadow`) ou `background: radial-gradient` em GSAP/keyframes/rAF.
- [ ] **WebGL sem stutter & independente de Hz:** gerar texturas procedurais em `requestIdleCallback` com `fill()` em lote, pré-compilar shaders (inclusive meshes ocultos) com `renderer.compile(scene, camera)` e usar decaimento exponencial `1 - Math.exp(-rate * dt)` em todos os lerps de `rAF`.
- [ ] Usar `radial-gradient` puro para glows (sem `filter: blur(60px+)`) e evitar `backdrop-filter` sobre palcos WebGL/3D; carregar `<iframe>`s sob demanda (1 por vez) congelando os inativos com `content-visibility: hidden`.
- [ ] Limitar geometrias 3D (anéis, tambores, carrosséis) à altura e largura útil da viewport (`Math.min(h * ..., w * ...)`) para nunca cortar cards no topo/base.
- [ ] Garantir transições sequenciais (fade-out completo antes do próximo fade-in) para evitar sobreposição de texto.
- [ ] Testar redimensionamento de tela, mobile e rolagem rápida (ida e volta) para garantir ausência de "buracos pretos" (*blank voids*) após seções pinadas.

### Antes de Subir / Publicar
- [ ] Revisar `git status` para não commitar arquivos temporários, backups ou assets não utilizados.
- [ ] Auditar cores, fontes e contrastes para garantir aderência 100% à identidade visual.
- [ ] Atualizar `acertos/` ou `erros/` com qualquer aprendizado relevante da entrega.
