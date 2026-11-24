/* ==========================================================================
   WHY CHOOSE WALL — ScrollPortraitWall (21st.dev) + Nano Banana Assets
   - Título de abertura "POR QUE NOS ESCOLHER" aparece limpo e SOME suavemente
     assim que a rolagem começa
   - Em cada pilar: CARD DA IMAGEM + TEXTO SOLTO AO LADO (FORA DA CAIXA DO CARD)
     nascem juntos, seguram no centro da viewport e SOMEM JUNTOS ao sair!
   - Posicionamento espalhado alternando lados (esquerda/direita) em 12 colunas
   - 100% GPU compositor (`scale` + `autoAlpha`) e zero sobreposição
   ========================================================================== */

import { gsap, ScrollTrigger } from './core/gsap.js';
import { playHover } from './sound.js';

const VL_WHY_PILLARS = [
  {
    index: '01',
    title: 'Preço Justo & Direto',
    role: 'ATÉ 60% MENOS',
    desc: 'Sem taxas ocultas de agência ou intermediários. Você investe direto em design e engenharia de alto impacto.',
    src: 'assets/images/porque-escolher/preco-direto.jpg',
    alt: 'Escultura 3D editorial representando preço justo e alto retorno na VL Tech',
  },
  {
    index: '02',
    title: 'Entrega Ultrarrápida',
    role: '5 A 12 DIAS',
    desc: 'Do briefing ao projeto publicado em dias — com sprints transparentes e prévias ao vivo desde a semana 1.',
    src: 'assets/images/porque-escolher/entrega-veloz.jpg',
    alt: 'Escultura 3D aerodinâmica representando entrega ultrarrápida da VL Tech',
  },
  {
    index: '03',
    title: 'Performance 99+ GPU',
    role: 'ZERO LAG',
    desc: 'Código nativo enxuto e acelerado por GPU para carregar instantaneamente até em redes móveis 4G.',
    src: 'assets/images/porque-escolher/performance-gpu.jpg',
    alt: 'Microchip 3D futurista representando performance 99+ PageSpeed',
  },
  {
    index: '04',
    title: 'Design 3D & Motion',
    role: '60 / 120 FPS',
    desc: 'Three.js, WebGL e GSAP sob medida para elevar sua marca imediatamente acima dos templates comuns.',
    src: 'assets/images/porque-escolher/experiencia-3d.jpg',
    alt: 'Geometria 3D em vidro e cromo representando experiências WebGL da VL Tech',
  },
  {
    index: '05',
    title: 'Direto com Luiz Gabriel',
    role: 'FRONT-END & 3D',
    desc: 'Você conversa direto com o co-fundador que cria a interface, o 3D e cada detalhe de conversão.',
    src: 'assets/images/luiz.jpg',
    alt: 'Luiz Gabriel — Co-Founder Front-end & WebGL da VL Tech',
  },
  {
    index: '06',
    title: 'Direto com Victor Whohlers',
    role: 'CLOUD & BACK-END',
    desc: 'APIs rápidas, banco de dados escalável e arquitetura segura projetados direto pelo sócio técnico.',
    src: 'assets/images/victor.jpg',
    alt: 'Victor Whohlers — Co-Founder Back-end & Cloud da VL Tech',
  },
  {
    index: '07',
    title: 'Automações & IA 24/7',
    role: 'ESCALA REAL',
    desc: 'Robôs no Instagram, WhatsApp e CRM atendendo, respondendo e qualificando leads sem pausa.',
    src: 'assets/images/porque-escolher/automacao-ia.jpg',
    alt: 'Núcleo neural 3D representando automações inteligentes e agentes de IA 24/7',
  },
  {
    index: '08',
    title: 'Código Seu & 99.98% Uptime',
    role: '100% PROPRIETÁRIO',
    desc: 'Sem mensalidade abusiva de plataforma fechada. Código modular em Edge CDN global com suporte real.',
    src: 'assets/images/porque-escolher/codigo-suporte.jpg',
    alt: 'Monólito de servidores 3D representando código proprietário e uptime 99.98%',
  },
];

function createRowElement(pillar, idx) {
  const row = document.createElement('div');
  row.className = 'spw-row';

  const posSlot = idx % 4;
  const isRightSide = idx % 2 === 1;

  const cell = document.createElement('div');
  cell.className = `spw-cell spw-cell--pos-${posSlot}`;

  const article = document.createElement('article');
  article.className = `spw-item${isRightSide ? ' spw-item--flip' : ''}`;
  article.style.transformOrigin = isRightSide ? 'right center' : 'left center';

  article.innerHTML = `
    <div class="spw-media">
      <img
        src="${pillar.src}"
        alt="${pillar.alt}"
        class="spw-img"
        width="600"
        height="600"
        loading="lazy"
        decoding="async"
        draggable="false"
      >
      <div class="spw-media__scrim" aria-hidden="true"></div>
      <span class="spw-media__index">${pillar.index}</span>
    </div>
    <div class="spw-aside">
      <span class="spw-aside__eyebrow">
        <span class="spw-aside__rule" aria-hidden="true"></span>
        <span>${pillar.index} · ${pillar.role}</span>
      </span>
      <h3 class="spw-card-title">${pillar.title}</h3>
      <p class="spw-card-desc">${pillar.desc}</p>
    </div>
  `;

  cell.appendChild(article);
  row.appendChild(cell);
  return row;
}

export function initWhyChooseWall() {
  const section = document.getElementById('porque-escolher');
  if (!section) return null;

  const introStage = section.querySelector('#spwIntroStage');
  const gridEl = section.querySelector('#spwGrid');
  if (!gridEl) return null;

  const renderRows = () => {
    const fragment = document.createDocumentFragment();
    VL_WHY_PILLARS.forEach((pillar, idx) => {
      fragment.appendChild(createRowElement(pillar, idx));
    });
    gridEl.innerHTML = '';
    gridEl.appendChild(fragment);
  };

  renderRows();

  let lastHovered = null;
  const onPointerOver = (e) => {
    const card = e.target.closest('.spw-item');
    if (card && card !== lastHovered) {
      lastHovered = card;
      try { playHover(); } catch (_) {}
    }
  };
  const onPointerLeave = () => {
    lastHovered = null;
  };
  gridEl.addEventListener('pointerover', onPointerOver, { passive: true });
  gridEl.addEventListener('pointerleave', onPointerLeave, { passive: true });

  if (!gsap || !ScrollTrigger) {
    return {
      destroy() {
        gridEl.removeEventListener('pointerover', onPointerOver);
        gridEl.removeEventListener('pointerleave', onPointerLeave);
      },
    };
  }

  const mm = gsap.matchMedia();

  mm.add(
    {
      reduceMotion: '(prefers-reduced-motion: reduce)',
      normalMotion: '(prefers-reduced-motion: no-preference)',
    },
    (context) => {
      const { reduceMotion } = context.conditions;
      const cells = Array.from(gridEl.querySelectorAll('.spw-cell'));
      const items = cells.map((c) => c.querySelector('.spw-item')).filter(Boolean);

      if (reduceMotion) {
        gsap.set(items, { scale: 1, autoAlpha: 1 });
        if (introStage) gsap.set(introStage, { autoAlpha: 1, scale: 1 });
        return;
      }

      // Título "POR QUE NOS ESCOLHER" some completamente ao iniciar a rolagem!
      if (introStage) {
        gsap.fromTo(
          introStage,
          { autoAlpha: 1, scale: 1, y: 0 },
          {
            autoAlpha: 0,
            scale: 0.9,
            y: -28,
            ease: 'power2.in',
            scrollTrigger: {
              trigger: section,
              start: 'top top',
              end: '+=42%',
              scrub: 0.35,
            },
          }
        );
      }

      // Cada par (CARD DE IMAGEM + TEXTO SOLTO AO LADO) nasce junto,
      // segura no centro da viewport para leitura e some junto ao sair!
      cells.forEach((cell) => {
        const item = cell.querySelector('.spw-item');
        if (!item) return;

        gsap
          .timeline({
            scrollTrigger: {
              trigger: cell,
              start: 'top 96%',
              end: 'bottom 4%',
              scrub: 0.42,
            },
          })
          .fromTo(
            item,
            { scale: 0.25, autoAlpha: 0 },
            { scale: 1, autoAlpha: 1, ease: 'power2.out', duration: 0.36 }
          )
          .to(item, { scale: 1, autoAlpha: 1, duration: 0.28, ease: 'none' })
          .to(item, { scale: 0.25, autoAlpha: 0, ease: 'power2.in', duration: 0.36 });
      });
    }
  );

  return {
    destroy() {
      mm.revert();
      gridEl.removeEventListener('pointerover', onPointerOver);
      gridEl.removeEventListener('pointerleave', onPointerLeave);
    },
  };
}
