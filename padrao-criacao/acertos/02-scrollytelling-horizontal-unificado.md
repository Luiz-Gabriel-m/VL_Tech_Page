# 02 — Motor Unificado de Scrollytelling Horizontal Pinado

- **Data:** 2026-11-19
- **Projeto de origem:** VL_Tech_Page
- **Categoria:** Animação & UX
- **Arquivos de referência:** `js/core/horizontal-scroll.js`

---

## O que foi feito
Foi criado um único motor reutilizável (`createHorizontalScroll`) em `js/core/horizontal-scroll.js` para controlar todas as seções horizontais pinadas com GSAP 3 + ScrollTrigger, separando três papéis bem definidos no DOM:
- `container`: gatilho estável (nunca pinado)
- `pinWrapper`: elemento realmente fixado no viewport
- `track`: trilho deslocado no eixo `X`

Além disso, o motor calcula a distância dinamicamente (`track.offsetLeft + track.scrollWidth - viewportWidth`), aplica um `holdRatio` final para absorver a inércia do `scrub: 1` e respeita `prefers-reduced-motion`.

## Por que funcionou bem
- Eliminou duplicação de lógica entre seções diferentes (`#mensagem`, `#galeria`, `#loja`).
- Garantiu proporção 1:1 com a largura real dos cards mesmo quando o número de cards ou o tamanho da tela muda.
- O `holdRatio` evita que o último card "fuja" da tela antes do usuário conseguir ler.
- Respeitar `prefers-reduced-motion` melhora acessibilidade sem esforço extra em cada seção.

## Como replicar em futuras páginas
Sempre que uma página precisar de mais de uma seção com scroll horizontal pinado:
1. Extrair a lógica para um único módulo em `js/core/horizontal-scroll.js`.
2. Manter a hierarquia fixa de 3 camadas (`container` > `pinWrapper` > `track`).
3. Calcular a distância sempre em função do `scrollWidth` real, nunca em pixels ou porcentagens fixas chutadas.

## Checklist de aplicação
- [ ] Container de trigger separado do elemento pinado
- [ ] Distância calculada dinamicamente via `scrollWidth`
- [ ] Tempo de retenção final (`holdRatio`) configurado para absorver `scrub`
- [ ] Fallback para `prefers-reduced-motion` implementado
