# Documentação Técnica — VL Tech (`VL_Tech_Page`)

> **Última atualização:** 2026-11-24  
> **Stack:** HTML5 semântico · CSS3 Modular (Design Tokens + CSS 3D) · JavaScript Vanilla (ES Modules) · Three.js `0.160.0` (WebGL) · GSAP `3.12.5` + ScrollTrigger · Web Audio API · Node.js Dev Server nativo

---

## 1. O Que É o Projeto

A **`VL_Tech_Page`** é a landing page institucional e vitrine interativa de conversão da **VL Tech** — estúdio de engenharia de software liderado pelos co-fundadores **Luiz Gabriel** (*Front-end, 3D & Automações*) e **Victor Whohlers** (*Back-end, Cloud & Segurança*).

O site foi projetado como uma **experiência editorial/Awwwards em 60/120fps** sem bundler obrigatório (100% estático, deploy imediato na Vercel), unindo:
- **Identidade visual proprietária:** tema escuro **Black, White & Crimson** (`#0A0A0C`, `#111114`, `#F8F8FC`, `#FF1E26`) com tipografias `Anton`, `Syne`, `Inter`, `Mona Sans`, `JetBrains Mono` e `Monument Extended`.
- **Componentes 21st.dev adaptados para Vanilla JS:** cada interação moderna inspirada na plataforma **21st.dev** foi reescrita em ES Modules + CSS isolado + Three.js/GSAP (sem `.tsx` em runtime).
- **Foco em conversão:** demonstrações ao vivo de projetos reais (desktop 4K + mobile), laboratório interativo de automações com Robô 3D, catálogo 3D de produtos conectado diretamente às seções e CTAs diretos para WhatsApp.
- **Memória de engenharia viva:** base de aprendizados em [`padrao-criacao/`](padrao-criacao/README.md) e skill especializada em [`.agents/skills/interactive-3d-landing-pages/SKILL.md`](.agents/skills/interactive-3d-landing-pages/SKILL.md).

---

## 2. Mapa Completo das Seções (Ordem Exata do DOM)

> **Regra de ouro do ScrollTrigger (`js/main.js`):** todos os módulos em `MOTION_MODULES` são inicializados **na mesma ordem em que aparecem no `index.html`** para evitar deslocamentos de gatilhos ou *blank voids*.

| # | Seção (`id`) | Nome / Função | Arquivos CSS & JS | Tecnologia / Interação |
|---|---|---|---|---|
| 0 | `#preloader` | Preloader Minimalista `VL` (`0% → 100%`) | `css/layout.css` · `js/loader.js` | GSAP + evento `LOADER_COMPLETE_EVENT` para liberar WebGL |
| 1 | `#hero` | **Hero — Sticker Swap Headline + WebGL 3D** | `css/sections/hero-sticker.css` · `js/hero-sticker-headline.js` · `js/tech-hero-3d.js` | Three.js partículas/grade neon reativa ao mouse + headline cinética `CRIAMOS SOFTWARE / PROJETOS / PRODUTOS / AUTOMAÇÃO` |
| 2 | `#diferenciais` | **Diferenciais — Túnel de Perspectiva 3D** | `css/sections/diferenciais-tunnel.css` · `js/diferenciais-tunnel.js` | `position: sticky` + GSAP `scrub` com 8 diferenciais voando em espiral do ângulo áureo + parallax com *idle sleep* |
| 3 | `#responsividade` | **Perfeição em Qualquer Tela** | `css/sections/responsive-showcase.css` · `js/responsive-showcase.js` | Notebook 3D abrindo no scroll + cascata binária + navegador real com 5 abas (`<iframe>` sob demanda) sincronizado 1:1 ao Carrossel 3D de Celulares |
| 4 | `#automacao` | **Automação & IA — Glyph Portal + Robô 3D** | `css/sections/automacao-portal.css` · `js/automacao-portal.js` · `js/automacao-robot-3d.js` | Glyph Portal (`AUTOMAÇÃO`) dando zoom por dentro da letra até preencher 100% da tela com handoff GPU revelando o Robô 3D Three.js Studio PBR (`PMREMGenerator`), arrastável em 360°, 4 abas reais (`Instagram 24/7`, `WhatsApp IA`, `CRM & Leads`, `Backoffice IA`), olhos de coração 3D (`HeartCurve` + `Raycaster`) e botão **Testar Ação** |
| 5 | `#porque-escolher` | **Por Que Nos Escolher — Mural Editorial** | `css/sections/why-choose-wall.css` · `js/why-choose-wall.js` | Título inicial que some ao rolar + 8 pilares (6 artes Nano Banana + 2 retratos reais dos sócios) com **texto solto ao lado fora da caixa do card**, surgindo e sumindo junto com a imagem |
| 6 | `#produtos` | **Produtos VL Tech — Roda 3D Auto-Animada** | `css/sections/partners-wheel.css` · `js/partners-tech.js` | Anel 360° que abre automaticamente no tambor 3D curvo (com Play/Pause), exibindo 8 produtos reais conectados às seções e aos modos do Robô 3D |
| 7 | `#socios-scrolly` | **Co-Founders 3D Access — Crachá Pêndulo** | `css/sections/founders-badge.css` · `js/badge-3d.js` | Crachá 3D pendular com física de balanço, arrasto e giro 180° entre Luiz Gabriel e Victor Whohlers + colunas flutuantes sincronizadas |
| 8 | `#rodape` | **FAQ Editorial + Rodapé + Pixel-Pong** | `css/sections/footer-pong.css` · `js/faq.js` · `js/footer.js` · `js/footer-pong.js` | Acordeão acessível (`#faq`), contatos diretos, animação Pixel-Pong em `<canvas>` reiniciável ao clique e botão Voltar ao Topo |

### Módulos Transversais (Core)
- **`js/core/gsap.js`:** registra `ScrollTrigger`, ativa `gsap.ticker.lagSmoothing(500, 33)` e `ScrollTrigger.config({ ignoreMobileResize: true, limitCallbacks: true })`.
- **`js/sound.js`:** efeitos sonoros procedurais via Web Audio API (`FX ON / OFF` salvo em `localStorage`).
- **`js/navigation.js`:** header flutuante monitorado via `IntersectionObserver` + menu fullscreen acessível (`inert` / `aria-expanded`).
- **`js/cursor.js`:** cursor customizado com *idle sleep* (desativado automaticamente em `pointer: coarse`).

---

## 3. Arquitetura de Performance (60/120fps)

Todas as seções ativas seguem rigorosamente os padrões validados em [`padrao-criacao/acertos/04`](padrao-criacao/acertos/04-performance-60fps-gsap-idle-sleep-gpu-compositing.md) e [`05`](padrao-criacao/acertos/05-portal-gpu-robo-3d-pbr-e-mural-porque-escolher.md):

1. **Zero `ScrollTrigger pin` em seções com `<iframe>` ou palco sensível:** uso de `position: sticky; top: 0` nativo + `body { overflow-x: clip }` + GSAP `scrub`.
2. **Pausa real + *Idle Sleep* em todos os `rAF`:** loops WebGL e de física usam `IntersectionObserver` + `document.visibilitychange` (`cancelAnimationFrame`) e desligam quando atingem repouso (`gap < epsilon`).
3. **100% GPU Compositor:** apenas `transform` e `opacity` em tweens GSAP e loops contínuos; zero `filter: blur()` em glows (`radial-gradient` puro) e zero `backdrop-filter` sobre canvas WebGL.
4. **Zero Layout Thrashing:** nenhum `getBoundingClientRect()` ou `getComputedStyle()` em `mousemove`, `scroll` ou `rAF`.
5. **Iframes sob demanda:** em `#responsividade`, apenas a aba ativa carrega seu `<iframe>` ao abrir a tampa do notebook; abas inativas e a seção fora da viewport ficam congeladas com `content-visibility: hidden`.
6. **Imagens otimizadas e Zero CLS:** todas as imagens locais de `#diferenciais` (35–77 KB) e `#porque-escolher` (55–95 KB, 900×900) têm `width`, `height`, `loading="lazy"` e `decoding="async"`.
7. **Acessibilidade:** todas as seções respeitam `@media (prefers-reduced-motion: reduce)` e atributos `aria-*`.

---

## 4. Execução Local, Preview e Deploy

### Requisitos
- **Node.js 18+** (para `npm run dev`)

### Rodar localmente
```bash
npm run dev
# ou: npm start / npm run serve
```
O servidor [`scripts/dev-server.mjs`](scripts/dev-server.mjs) (zero dependências externas):
- Escuta em **dual-stack** (`http://localhost:3000/` em IPv4 e IPv6 + `http://127.0.0.1:3000/`).
- Aceita flags `--port` / `-p` / `--host` e variáveis `PORT` / `HOST`.
- Faz **fallback automático** para a próxima porta livre (`3001`, `3002`, ...) caso a `3000` esteja ocupada (`EADDRINUSE`).

### Deploy na Vercel
- O arquivo [`vercel.json`](vercel.json) habilita `cleanUrls: true`, cache imutável de 1 ano para `/assets/*` e `stale-while-revalidate` para `/css/*` e `/js/*`.
- Não há etapa de build obrigatória (`Static Site`).

---

## 5. Inventário de Arquivos Legados & Pendências Conhecidas

Durante a auditoria do repositório, foram mapeados itens legados (não carregados em produção pelo `index.html`) e pendências comerciais para decisão futura:

- **Arquivos legados preservados (inativos no `index.html`):**
  - `components/ui/gallery.tsx`, `components/ui/product-shelf.tsx`, `components/ui/tech-hardware-rail.tsx` (referências antigas `.tsx`, não executadas em runtime).
  - Módulos JS de versões anteriores: `js/arrow-scrollytelling.js`, `js/diferenciais-3d.js`, `js/hero.js`, `js/notebook-3d.js`, `js/portfolio-brands.js`, `js/tech-hardware-rail.js`, `js/why-choose-us.js`, `js/animations/matrix-cascade.js`.
  - Imagens antigas em `assets/socios/` (incluindo arquivos com espaço no nome) — a página em produção utiliza apenas `assets/images/luiz.jpg` e `assets/images/victor.jpg`.
- **Pendências comerciais antes do lançamento definitivo:**
  - Substituir o número placeholder do WhatsApp (`5511999999999`) pelo número oficial da VL Tech em `index.html`, `js/automacao-robot-3d.js` e `js/badge-3d.js`.
  - Confirmar os links reais de redes sociais no `#menu-overlay` (`LinkedIn`, `GitHub`, `Instagram`, `X`) e conectar o formulário de proposta `#newsletter-form` a um endpoint/webhook real (Formspree, Resend ou API própria).

---

## 6. Padrão de Criação (Base de Conhecimento)

Consulte [`padrao-criacao/README.md`](padrao-criacao/README.md) para os guias completos:
- **Acertos (`01` a `05`):** [`padrao-criacao/acertos/README.md`](padrao-criacao/acertos/README.md)
- **Erros (`01` a `05`):** [`padrao-criacao/erros/README.md`](padrao-criacao/erros/README.md)
- **Skill de Desenvolvimento 3D:** [`.agents/skills/interactive-3d-landing-pages/SKILL.md`](.agents/skills/interactive-3d-landing-pages/SKILL.md)
