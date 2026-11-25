# Erros — Armadilhas e Problemas Para Nunca Repetir

Esta pasta registra erros reais cometidos durante o desenvolvimento (as "cagadas" que geraram retrabalho, bugs visuais ou dívida técnica), junto da **causa raiz** e da **regra preventiva** para futuras páginas da VL Tech.

## Índice

| # | Erro | Impacto | Arquivo |
|---|---|---|---|
| 01 | Blank voids, sobreposição de texto e pinagem duplicada no scrollytelling | Alto (UX quebrada) | [`01-scrollytelling-e-layout.md`](./01-scrollytelling-e-layout.md) |
| 02 | Monólitos HTML/CSS, `.tsx` sem bundler, tokens legados e assets sem padrão | Médio/Alto (Manutenção) | [`02-organizacao-codigo-e-assets.md`](./02-organizacao-codigo-e-assets.md) |
| 03 | `ScrollTrigger pin` com `<iframe>`, `overflow-x: hidden` e cortes em geometria 3D | Crítico (Seção some) | [`03-pin-scrolltrigger-com-iframes-e-geometria-viewport.md`](./03-pin-scrolltrigger-com-iframes-e-geometria-viewport.md) |
| 04 | Travamento severo no load e scroll (GSAP + loops `rAF` + `blur` GPU + iframes) | Crítico (Site trava) | [`04-travamento-performance-gsap-raf-blur-iframes.md`](./04-travamento-performance-gsap-raf-blur-iframes.md) |
| 05 | `SVG clipPath` travando cliques, mola sem `dt`, `wrapRect` obsoleto e título sobreposto | Crítico (Robô/UX quebrados) | [`05-svg-clippath-trava-cliques-mola-sem-dt-e-titulo-sobreposto.md`](./05-svg-clippath-trava-cliques-mola-sem-dt-e-titulo-sobreposto.md) |
| 06 | Cascata de CSS vars no scroll, shader hitch no 1º clique e lerp preso a 60Hz | Alto (Micro-engasgos) | [`06-cascata-css-vars-no-scroll-shader-hitch-e-lerp-preso-a-60hz.md`](./06-cascata-css-vars-no-scroll-shader-hitch-e-lerp-preso-a-60hz.md) |

---

## Como Adicionar um Novo Erro

1. Copie o modelo em [`_TEMPLATE.md`](./_TEMPLATE.md).
2. Salve com numeração sequencial em `kebab-case` (ex.: `03-erro-no-mobile-menu.md`).
3. Atualize a tabela de índice acima.
