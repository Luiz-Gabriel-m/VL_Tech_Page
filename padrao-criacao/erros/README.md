# Erros — Armadilhas e Problemas Para Nunca Repetir

Esta pasta registra erros reais cometidos durante o desenvolvimento (as "cagadas" que geraram retrabalho, bugs visuais ou dívida técnica), junto da **causa raiz** e da **regra preventiva** para futuras páginas da VL Tech.

## Índice

| # | Erro | Impacto | Arquivo |
|---|---|---|---|
| 01 | Blank voids, sobreposição de texto e pinagem duplicada no scrollytelling | Alto (UX quebrada) | [`01-scrollytelling-e-layout.md`](./01-scrollytelling-e-layout.md) |
| 02 | Monólitos HTML/CSS, `.tsx` sem bundler, tokens legados e assets sem padrão | Médio/Alto (Manutenção) | [`02-organizacao-codigo-e-assets.md`](./02-organizacao-codigo-e-assets.md) |
| 03 | `ScrollTrigger pin` com `<iframe>`, `overflow-x: hidden` e cortes em geometria 3D | Crítico (Seção some) | [`03-pin-scrolltrigger-com-iframes-e-geometria-viewport.md`](./03-pin-scrolltrigger-com-iframes-e-geometria-viewport.md) |

---

## Como Adicionar um Novo Erro

1. Copie o modelo em [`_TEMPLATE.md`](./_TEMPLATE.md).
2. Salve com numeração sequencial em `kebab-case` (ex.: `03-erro-no-mobile-menu.md`).
3. Atualize a tabela de índice acima.
