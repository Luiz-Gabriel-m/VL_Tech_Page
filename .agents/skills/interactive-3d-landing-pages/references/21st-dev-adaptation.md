# Referência 21st.dev (dev21) — Estudo e Adaptação de Componentes

Guia para usar a plataforma **21st.dev** como base de estudo, inspiração visual e engenharia de componentes para landing pages e leadpages da VL Tech.

---

## O que estudar na 21st.dev

A **21st.dev** reúne componentes modernos da comunidade React / Tailwind / shadcn / Aceternity UI / Magic UI / Kokonut UI. Use a plataforma como catálogo de **padrões de interação e composição**, focando especialmente em:

1. **Heroes de Alto Impacto:** fundos com shaders/partículas, texto cinético com revelação por linha/palavra, spotlights seguindo o mouse e elementos 3D flutuantes.
2. **Vitrines e Galerias 3D:** carrosséis em leque 3D, galerias cilíndricas/orbitais, *product shelves* interativos, cards com *perspective tilt* e reflexo especular (glare).
3. **Seções de Conversão (Leadpages):** Bento Grids animados, comparativos interativos, marquee contínuo de logos de clientes, botões magnéticos/brilhantes (*shimmer/glow CTAs*) e acordeões fluidos.
4. **Microinterações:** indicadores de progresso de scroll, tooltips espaciais, badges com física de pêndulo/mola e feedback tátil/sonoro.

---

## Regra Crítica de Adaptação por Stack

Os componentes da 21st.dev normalmente vêm escritos em **React + TypeScript (`.tsx`) + Tailwind CSS + Framer Motion**.

- **Se o projeto usar React/Next/Astro com React:** você pode integrar o componente `.tsx`, mas ainda precisa trocar cores hardcoded pelos tokens da marca e revisar performance mobile.
- **Se o projeto for estático (HTML + CSS + Vanilla JS ES Modules, como `VL_Tech_Page`):** **NÃO salve `.tsx` morto no repositório.** Faça a tradução completa seguindo a matriz abaixo.

---

## Matriz de Tradução: 21st.dev → Vanilla JS + GSAP + Three.js

| Recurso na 21st.dev | Equivalente na Stack VL Tech (Vanilla + GSAP + Three.js) |
|---|---|
| `framer-motion` (`motion.div`, `initial`/`animate`) | `gsap.fromTo()` / `gsap.timeline()` |
| `useScroll` + `useTransform` (Framer Motion) | `GSAP ScrollTrigger` com `scrub: true` / `scrub: 1` |
| `useSpring` (física de mola/ponteiro) | `gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3.out' })` ou interpolação `lerp` em `requestAnimationFrame` |
| `whileHover` / `whileTap` | Listeners `pointerenter` / `pointerleave` / `pointerdown` + `gsap.to()` |
| `@react-three/fiber` (`<Canvas>`, `<mesh>`) | Instância nativa `THREE.Scene`, `THREE.PerspectiveCamera`, `THREE.WebGLRenderer` em módulo ES |
| `@react-three/drei` (Orbit, Environment, Float) | `OrbitControls`, `RoomEnvironment`/`PMREMGenerator` e oscilação senoidal no loop `requestAnimationFrame` |
| Classes Tailwind de cor (`bg-zinc-950`, `text-emerald-400`) | Tokens semânticos em `css/variables.css` (`var(--bg-primary)`, `var(--brand-primary)`) |
| `cn()` / `clsx` condicional | `element.classList.toggle('is-active', cond)` + `data-state="..."` |

---

## Checklist de Adaptação de Componente 21st.dev

- [ ] Identifiquei qual é a essência visual/interativa do componente (geometria, timing, física, iluminação).
- [ ] Removi dependências não existentes no `package.json` (sem copiar React/Framer/Lucide sem bundler).
- [ ] Substituí todas as cores externas pelas variáveis oficiais da marca (sem vazar verde, roxo ou azul fora da paleta).
- [ ] Garanti que o componente funciona em desktop, mobile (touch) e `prefers-reduced-motion`.
- [ ] Mantive o CSS isolado com prefixo claro da seção para não conflitar com o resto da página.
