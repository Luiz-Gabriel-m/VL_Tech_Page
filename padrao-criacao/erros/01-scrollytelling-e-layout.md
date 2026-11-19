# 01 — Blank Voids, Sobreposição de Texto e Pinagem Duplicada no Scrollytelling

- **Data:** 2026-11-19
- **Projeto de origem:** VL_Tech_Page
- **Severidade:** Alta
- **Categoria:** Animação & Layout
- **Commits relacionados:** `d72432c`, `d2e9d40`, `6757ce6`, `ffec06e`, `6308767`, `5b9d8e4`, `782783a`

---

## O que deu errado (Sintoma)
Durante a evolução das seções de scrollytelling (Co-founders, *Por que escolher* e *Diferenciais*), apareceram três bugs recorrentes que exigiram vários commits de correção:
1. **Espaço preto vazio (*blank void*)** logo após seções horizontais pinadas.
2. **Desfixação prematura** antes de o último card terminar de atravessar a tela.
3. **Textos sobrepostos** durante transições entre estados de fundadores na rolagem (principalmente ao rolar de volta para cima).

## Causa raiz (Por que aconteceu)
- Cada seção horizontal tinha sua própria lógica ad-hoc de `ScrollTrigger` e valores fixos de distância em vez de calcular a largura real do conteúdo (`scrollWidth`).
- O mesmo elemento era usado simultaneamente como trigger e alvo de pin/transform, bagunçando o `pin-spacer` do GSAP.
- Animações de saída e entrada de textos aconteciam em janelas de progresso sobrepostas na timeline em vez de serem estritamente sequenciais.

## Como foi resolvido
- Unificação do scroll horizontal em um motor único (`js/core/horizontal-scroll.js`) com estrutura fixa de 3 elementos (`container` > `pinWrapper` > `track`), distância dinâmica 1:1 via `scrollWidth` e `holdRatio` final.
- Transições sequenciais sem sobreposição (estado A sai 100% antes do estado B entrar), testadas tanto rolando para baixo quanto para cima.

## Regra para nunca repetir
> **Regra de ouro:** nunca crie uma lógica de pinagem horizontal nova do zero por seção e nunca use distâncias fixas. Use um motor único com `scrollWidth` dinâmico, separe `container` / `pinWrapper` / `track` e faça transições de texto estritamente sequenciais (zero overlap).
