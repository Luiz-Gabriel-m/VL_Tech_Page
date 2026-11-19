# Regras do Projeto — VL Tech

Este repositório contém a base oficial da landing page da **VL Tech** (`VL_Tech_Page`) e o **Padrão de Criação** para futuras páginas.

## Regras Obrigatórias

1. **Consultar o Padrão de Criação antes de codar:**
   - Leia `padrao-criacao/erros/README.md` para evitar armadilhas já documentadas (blank voids, sobreposição de texto, monólitos, `.tsx` solto sem bundler, assets sem padrão).
   - Leia `padrao-criacao/acertos/README.md` para reutilizar os padrões validados do projeto.
2. **Ativar a Skill de Landing Pages 3D:**
   - Sempre que desenvolver ou refatorar leadpages/landing pages interativas, modelagens 3D (Three.js/WebGL ou CSS 3D), animações com GSAP 3 + ScrollTrigger ou adaptar componentes inspirados na **21st.dev (dev21)**, siga rigorosamente a skill `.agents/skills/interactive-3d-landing-pages/SKILL.md`.
3. **Retroalimentar `acertos/` e `erros/`:**
   - Quando resolver um bug recorrente ou validar uma solução reutilizável, sugira registrar o aprendizado em `padrao-criacao/acertos/` ou `padrao-criacao/erros/`.
