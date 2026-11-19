# 01 — Arquitetura Modular, Design Tokens e Web Audio API

- **Data:** 2026-11-19
- **Projeto de origem:** VL_Tech_Page
- **Categoria:** Arquitetura & UI
- **Arquivos de referência:** `css/variables.css`, `js/core/`, `js/sound.js`, `js/cursor.js`, `vercel.json`

---

## O que foi feito
1. **Design Tokens centralizados em `:root`** (`css/variables.css`) com tipografia fluida via `clamp()`, escala de espaçamentos (`--space-*`) e tokens de glassmorphism/glow.
2. **Separação de JavaScript em ES Modules por responsabilidade**, isolando utilitários base em `js/core/` (`gsap.js`, `horizontal-scroll.js`) e animações/seções em módulos próprios.
3. **Engine de áudio procedural via Web Audio API** (`js/sound.js`) sem arquivos `.mp3`/`.wav` externos, com botão ON/OFF persistido em `localStorage`.
4. **Degradação inteligente em touch devices** (`pointer: coarse`) para desativar o cursor customizado em celulares/tablets.
5. **Política de cache estático na Vercel** (`vercel.json`) com `immutable` para `/assets/` e `stale-while-revalidate` para `/css/` e `/js/`.
6. **Histórico Git com commits semânticos** (`feat(...)`, `fix(...)`, `refactor(...)`).

## Por que funcionou bem
- Tipografia com `clamp()` elimina dezenas de media queries manuais entre mobile e desktop.
- Áudio sintetizado em tempo real garante **zero latência**, **zero erro 404** e peso mínimo de página.
- Módulos ES isolados facilitam encontrar e corrigir bugs em uma seção sem quebrar outras.
- Commits semânticos permitiram rastrear rapidamente exatamente onde surgiram e foram resolvidos problemas de scroll e layout.

## Como replicar em futuras páginas
- Iniciar sempre criando `css/variables.css` com paleta, escala tipográfica `clamp()` e escala de espaçamento antes de escrever qualquer seção.
- Estruturar `js/core/` para motores compartilhados e um arquivo por funcionalidade/seção.
- Copiar a base de `vercel.json` (headers de cache + `cleanUrls`) em projetos estáticos publicados na Vercel.
- Manter o padrão de mensagens de commit: `feat(escopo):`, `fix(escopo):`, `refactor(escopo):`.

## Checklist de aplicação
- [ ] `css/variables.css` criado com paleta final e tipografia fluida (`clamp()`)
- [ ] `js/core/` separado das seções específicas
- [ ] Interações exclusivas de mouse desabilitadas em `pointer: coarse`
- [ ] Cache configurado no `vercel.json`
