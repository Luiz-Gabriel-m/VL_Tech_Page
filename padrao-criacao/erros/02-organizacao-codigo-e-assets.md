# 02 — Monólitos HTML/CSS, `.tsx` Sem Bundler, Tokens Legados e Assets Sem Padrão

- **Data:** 2026-11-19
- **Projeto de origem:** VL_Tech_Page
- **Severidade:** Média/Alta
- **Categoria:** Arquitetura & Assets
- **Commits/arquivos relacionados:** `index.html` (~80 KB), `styles.css` (~114 KB), `components/ui/*.tsx`, `css/variables.css`, `assets/socios/`, `f50f51a`

---

## O que deu errado (Sintoma)
Ao longo do desenvolvimento rápido, quatro dívidas técnicas se acumularam no repositório:
1. **Arquivos monolíticos gigantes:** `index.html` chegou a ~80 KB e `styles.css` a ~114 KB, dificultando manutenção, busca de estilos e causando conflitos de cascata.
2. **Mistura de stacks no mesmo repo:** surgiram arquivos React/TypeScript (`components/ui/gallery.tsx`, `product-shelf.tsx`, `tech-hardware-rail.tsx`) dentro de um projeto servido como HTML/JS estático, sem bundler ou React configurado no `package.json`.
3. **Tokens CSS com nomes enganosos e cores vazadas:** foram deixadas variáveis herdadas de temas antigos (`--bg-olive`, `--bg-offwhite`, `--text-on-light`, `--accent-neon`) apontando para cores escuras/vermelhas, além de cores fora da paleta (verde/lime/ciano) que exigiram uma auditoria inteira depois (`f50f51a`).
4. **Assets sem padronização de nome:** arquivos salvos diretamente do WhatsApp com espaços e parênteses (`assets/socios/WhatsApp Image 2026-10-29 at 16.47.50 (1).jpeg`) e extensões duplas (`founder-1.jpg.jpeg`).

## Causa raiz (Por que aconteceu)
- Crescimento incremental da landing page sem quebrar seções em arquivos dedicados desde o começo.
- Copiar componentes React/TSX de referência direto para a pasta do projeto em vez de adaptá-los ou usar uma stack com build (Astro/Vite/Next).
- Reaproveitar nomes de variáveis CSS de templates anteriores em vez de renomear para a identidade real da marca.
- Jogar imagens recebidas por mensagem direto na pasta `assets/` sem renomear nem otimizar antes.

## Como foi resolvido (ou como corrigir)
- Para novas páginas (e refatorações futuras):
  - Separar CSS por responsabilidade/seção (`css/variables.css`, `css/base.css`, `css/sections/*.css`) ou usar um framework com componentização real (ex.: Astro).
  - Decidir **uma única stack** antes de codar; não manter `.tsx` morto em projeto estático.
  - Usar apenas nomes semânticos nos tokens (`--bg-primary`, `--surface-card`, `--brand-primary`).
  - Renomear e otimizar imagens (WebP/AVIF + `kebab-case`) **antes** de colocar em `assets/`.

## Regra para nunca repetir
> **Regra de ouro:** todo arquivo novo precisa respeitar a stack definida, ter escopo pequeno (sem monólitos de 100 KB), usar tokens CSS com nomes fiéis à paleta oficial e assets limpos em `kebab-case` sem espaços ou extensão dupla.
