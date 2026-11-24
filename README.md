# ⚡ VL Tech — High Performance Software Engineering

<div align="center">

![VL Tech](assets/logo/vl-logo.jpg)

**Experiência Web 3D Cinemática de Alta Performance**  
*Desenvolvida com foco obsessivo em precisão cirúrgica, animações fluidas em 60/120fps, estética editorial Awwwards e arquitetura modular.*

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)
[![License: MIT](https://img.shields.io/badge/License-MIT-red.svg)](LICENSE)
[![Three.js](https://img.shields.io/badge/3D-Three.js%20%2B%20WebGL-0A0A0C.svg)](https://threejs.org/)
[![GSAP 3](https://img.shields.io/badge/Animation-GSAP%203%20%2B%20ScrollTrigger-FF1E26.svg)](https://greensock.com/)
[![Web Audio API](https://img.shields.io/badge/Audio-Web%20Audio%20API-0A0A0C.svg)]()

[Visão Geral](#-visão-geral) • [Seções & Interações 3D](#-seções--interações-3d) • [Padrão de Criação & Aprendizados](#-padrão-de-criação--aprendizados-técnicos) • [Arquitetura](#-arquitetura-modular) • [Deploy na Vercel](#-deploy-na-vercel)

</div>

---

## 📖 Visão Geral

A **VL Tech** é um estúdio de engenharia de software de alta performance especializado em arquiteturas escaláveis, automações inteligentes e experiências web interativas em 3D.

Esta landing page oficial combina estética editorial minimalista no tema exclusivo **Black, White & Crimson** (`#0A0A0C`, `#111114`, `#F8F8FC` e `#FF1E26`), **Three.js / WebGL**, **CSS 3D Perspective**, **GSAP 3 + ScrollTrigger**, sintetização procedural de som via **Web Audio API** e referências interativas inspiradas na **21st.dev (dev21)** adaptadas 100% para **Vanilla ES Modules** (zero build / deploy instantâneo).

---

## ✨ Seções & Interações 3D

### 1. 💥 Hero — Sticker Swap Headline + Campo WebGL 3D (`#hero`)
- Tipografia monumental minimalista (`CRIAMOS` + alternância animada entre `SOFTWARE`, `PROJETOS`, `PRODUTOS` e `AUTOMAÇÃO`) inspirada no `StickerSwapHeadline` da 21st.dev, com sticker die-cut animado encaixando na letra **"O"** em sincronia com GSAP (`js/hero-sticker-headline.js` + `css/sections/hero-sticker.css`).
- Fundo interativo **Three.js WebGL** com campo de partículas e grade neon responsiva ao mouse (`js/tech-hero-3d.js`).

### 2. 💻📱 Perfeição em Qualquer Tela — Notebook 3D + Carrossel 3D de Celulares (`#responsividade`)
- Sequência cinemática guiada por scroll usando **CSS `position: sticky` nativo + GSAP ScrollTrigger `scrub`** (`js/responsive-showcase.js` + `css/sections/responsive-showcase.css`):
  1. **Palco limpo → Aproximação 3D:** o notebook 3D fechado com a logo VL Tech retroiluminada surge vindo de longe em perspectiva 3/4.
  2. **Abertura & Matriz Binária:** a tampa abre suavemente, dispara cascata binária `0/1` em vermelho VL Tech e revela um **navegador real com 5 abas clicáveis** exibindo a **Hero ao vivo** (`<iframe>` 1440×900 escalado) de cada projeto em produção (**Maciel Fit**, **G4 Batatas**, **Marinho Odonto**, **Ribeiro Team** e **Zildo Oliveira**).
  3. **Sincronia Monitor + Mobile 3D:** o título editorial aparece, o notebook eleva-se mantendo a Hero visível e o **Carrossel 3D de Celulares** (adaptado do `PhoneCarousel` da 21st.dev, com a logo oficial de cada cliente) entra logo abaixo com arrasto lateral, clique e rotação sincronizada 1:1 com as abas do navegador.

### 3. 🎡 Ecossistema & Stack Tecnológica — 3D Works Wheel (`#parceiros`)
- Roda 3D interativa adaptada do `WorksWheel` da 21st.dev (`js/partners-tech.js` + `css/sections/partners-wheel.css`):
  - **Estado Anel 360° (`turn = 0`):** todos os 8 cards da stack VL Tech (*Node.js & Go, Amazon AWS, Three.js & WebGL, Google Cloud, Docker & K8s, TypeScript, PostgreSQL & Redis, VL Tech Cloud*) dispostos em círculo 3D ao redor de `STACK '26`, com raio calibrado dinamicamente à viewport para zero corte.
  - **Estado Tambor Curvo 3D (`turn = 1..8`):** rolar, arrastar ou clicar no índice lateral abre o anel em um tambor vertical 3D curvado à esquerda (`BOW`), destacando o card frontal com leitura editorial lateral.

### 4. 🪪 Co-Founders 3D Access — Crachá com Física de Pêndulo (`#socios-scrolly`)
- Credencial corporativa interativa em 3D (`js/badge-3d.js` + `css/sections/founders-badge.css`) com física real de pêndulo, arrasto e rotação 180° entre **Luiz Gabriel** (*Front-end & WebGL*) e **Victor Whohlers** (*Back-end & Cloud*), acompanhada por blocos editoriais flutuantes laterais sincronizados via GSAP.

### 5. 🕹️ FAQ Editorial & Rodapé Pixel-Pong (`#rodape`)
- Acordeão técnico acessível (`#faq`) + grid minimalista de contato direto.
- Animação interativa **Pixel-Text Pong** em `<canvas>` (`VL TECH` / `ENGENHARIA DE SOFTWARE`) adaptada da 21st.dev (`js/footer-pong.js` + `css/sections/footer-pong.css`), reiniciável ao clique.
- Botão **Voltar ao Topo** com scroll suave via proxy numérico do GSAP (sem dependência de `ScrollToPlugin`) e cancelamento automático ao toque/roda do mouse (`js/footer.js`).

### 6. 🔊 Sound FX Procedural, Cursor Customizado & Preloader
- **Web Audio API (`js/sound.js`):** micro-sons sintetizados em tempo real (hover, click, transições) com controle `FX ON / FX OFF` persistido em `localStorage`.
- **Preloader Minimalista (`js/loader.js`):** tela `#0A0A0C` com monograma `VL` e contador `0% → 100%`.
- **Cursor Procedural (`js/cursor.js`):** interpolação suave (lerp) desativada automaticamente em telas touch.

---

## 📚 Padrão de Criação & Aprendizados Técnicos

Este repositório mantém uma base viva de conhecimento em [`padrao-criacao/`](padrao-criacao/README.md) e a skill especialista [`.agents/skills/interactive-3d-landing-pages/SKILL.md`](.agents/skills/interactive-3d-landing-pages/SKILL.md) para acelerar e blindar futuras landing pages da VL Tech:

### ✅ Principais Acertos Validados ([`padrao-criacao/acertos/`](padrao-criacao/acertos/README.md))
- **[01 — Arquitetura Modular, Design Tokens e Web Audio API](padrao-criacao/acertos/01-arquitetura-e-design-system.md):** tokens semânticos em `css/variables.css`, módulos ES desacoplados e áudio procedural sem assets externos.
- **[02 — Motor Unificado de Scrollytelling Horizontal](padrao-criacao/acertos/02-scrollytelling-horizontal-unificado.md):** cálculo dinâmico de largura com `holdRatio` e limpeza de triggers.
- **[03 — Scrollytelling 3D com CSS `sticky` Nativo e Adaptação 21st.dev](padrao-criacao/acertos/03-sticky-nativo-scrolltrigger-e-adaptacao-21st-dev.md):** uso de `position: sticky; top: 0` + `body { overflow-x: clip }` + GSAP `scrub` (sem `pin`), adaptação limpa de componentes React/Tailwind da 21st.dev para Vanilla ES Modules + `css/sections/*.css` e pausa automática de loops `rAF` fora da tela via `IntersectionObserver`.
- **[04 — Performance 60/120fps em GSAP, Idle Sleep e GPU Compositing Limpo](padrao-criacao/acertos/04-performance-60fps-gsap-idle-sleep-gpu-compositing.md):** `lagSmoothing` + `limitCallbacks` + debounce no `ScrollTrigger.refresh()`, *idle sleep* em loops `rAF`, iframes sob demanda com `content-visibility: hidden`, glows em `radial-gradient` puro (sem `filter: blur`) e zero layout thrashing.

### ⚠️ Principais Erros Documentados Para Nunca Repetir ([`padrao-criacao/erros/`](padrao-criacao/erros/README.md))
- **[01 — Blank Voids, Sobreposição de Texto e Pinagem Duplicada](padrao-criacao/erros/01-scrollytelling-e-layout.md):** evitar pins duplicados, criar triggers na ordem do DOM e garantir fade-out completo antes do próximo fade-in.
- **[02 — Monólitos HTML/CSS, `.tsx` Solto e Assets Sem Padrão](padrao-criacao/erros/02-organizacao-codigo-e-assets.md):** nunca jogar `.tsx` sem bundler em site estático, isolar estilos em `css/sections/*.css` e padronizar nomes em `kebab-case`.
- **[03 — `ScrollTrigger pin` com `<iframe>`, `overflow-x: hidden` e Geometria 3D](padrao-criacao/erros/03-pin-scrolltrigger-com-iframes-e-geometria-viewport.md):**
  - `ScrollTrigger` com `pin: true` move o container via `insertBefore` (`.pin-spacer`), causando `NotFoundError` em `_swapPinOut` e recarregamento de `<iframe>`s embutidos — **solução:** usar `position: sticky` nativo + `body { overflow-x: clip }` (nunca `overflow-x: hidden`, que quebra `sticky`).
  - Sempre limitar raios/dimensões de componentes 3D à altura útil da viewport (`Math.min(h * ..., w * ...)`) para evitar corte em telas de notebook/preview estreito.
  - Nunca usar `gsap.to(window, { scrollTo })` sem carregar o `ScrollToPlugin` — usar proxy numérico do GSAP com `window.scrollTo`.
  - Sempre atualizar query strings (`?v=`) em `index.html` e `js/main.js` para evitar cache obsoleto no navegador.
- **[04 — Travamento Severo no Load e Scroll (GSAP + `rAF` + Blur GPU + Iframes)](padrao-criacao/erros/04-travamento-performance-gsap-raf-blur-iframes.md):**
  - Nunca pré-carregar vários `<iframe>`s `1440×900` no boot (`rootMargin` alto) nem mantê-los ativos fora de foco.
  - Nunca ler `getComputedStyle`/`getBoundingClientRect` dentro de `rAF`, `mousemove` ou `scroll`, nem animar `filter` (`blur`/`brightness`/`drop-shadow`) ou `background: radial-gradient` em GSAP/keyframes/rAF.
  - Todo loop `rAF` precisa de `cancelAnimationFrame` real fora da viewport/aba oculta e *idle sleep* quando assentar.

---

## 🧩 Arquitetura Modular

```text
VLtech/
├── index.html                           # Página principal (5 seções: Hero, Responsividade, Stack, Sócios, Rodapé)
├── AGENTS.md                            # Regras obrigatórias de engenharia e consulta ao Padrão de Criação
├── css/
│   ├── variables.css                    # Design tokens VL Tech + overflow-x: clip
│   ├── layout.css                       # Base global, preloader e navegação flutuante
│   └── sections/
│       ├── hero-sticker.css             # Hero StickerSwapHeadline
│       ├── responsive-showcase.css      # Notebook 3D + Carrossel 3D de Celulares (sticky nativo)
│       ├── partners-wheel.css           # Roda 3D Ecossistema & Stack
│       ├── founders-badge.css           # Crachá 3D Co-Founders
│       └── footer-pong.css              # Rodapé Pixel-Pong
├── js/
│   ├── main.js                          # Bootstrap na ordem exata do DOM
│   ├── core/                            # Ponte GSAP + motor de scroll
│   ├── hero-sticker-headline.js         # Headline interativa do Hero
│   ├── tech-hero-3d.js                  # Cena Three.js WebGL do Hero
│   ├── responsive-showcase.js           # Notebook 3D + 5 Abas ao Vivo + Celulares 3D
│   ├── partners-tech.js                 # Roda 3D (Anel 360° -> Tambor Curvo)
│   ├── badge-3d.js                      # Física de pêndulo 3D dos Co-Founders
│   ├── footer-pong.js / footer.js       # Pixel-Pong + Voltar ao Topo suave
│   └── sound.js / cursor.js / loader.js / navigation.js / faq.js
├── padrao-criacao/                      # Base de conhecimento (acertos/ e erros/)
└── .agents/skills/                      # Skill especialista em Landing Pages 3D + 21st.dev
```

---

## 🚀 Como Executar Localmente

```bash
git clone https://github.com/Luiz-Gabriel-m/VL_Tech_Page.git
cd VL_Tech_Page

# Usando Python:
python -m http.server 5500

# Ou com Node:
npx serve -l 5500 .
```

Acesse `http://localhost:5500` no navegador.

---

## ☁️ Deploy na Vercel

O projeto é 100% estático (zero build obrigatório) e pronto para deploy contínuo na Vercel:
1. Importe o repositório na [Vercel](https://vercel.com/new) como **Other / Static Site**.
2. O arquivo [`vercel.json`](vercel.json) já configura cabeçalhos de cache e rotas limpas.

---

## 👥 Sócios & Liderança Técnica

<div align="center">

| **Luiz Gabriel** | **Victor Whohlers** |
| :---: | :---: |
| *Co-Founder & Front-end Architect* | *Co-Founder & Cloud Architect* |
| **Expertise:** Front-end, Landing Pages 3D (Three.js/GSAP) & Automações | **Expertise:** Back-end, Arquitetura Cloud, Microsserviços & Segurança |

</div>

---

## 📄 Licença

Este projeto é distribuído sob a licença MIT. Consulte [`LICENSE`](LICENSE) para mais detalhes.

<div align="center">
  <sub>© 2026 VL Tech — Engenharia de Software e Alta Performance. Todos os direitos reservados.</sub>
</div>
