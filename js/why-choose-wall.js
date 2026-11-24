/* ==========================================================================
   WHY CHOOSE WALL — ScrollPortraitWall (21st.dev) + Nano Banana Assets
   - Título de abertura "POR QUE NOS ESCOLHER" aparece limpo e SOME suavemente
     assim que a rolagem começa (zero sobreposição com os cards!)
   - Em cada pilar, IMAGEM + TEXTO EXPLICATIVO aparecem juntos, seguram um
     instante no centro da tela para leitura fácil e SOMEM JUNTOS ao sair!
   - Grade espalhada determinística (4 cols desktop / 3 tablet / 2 mobile)
   - 100% GPU compositor (`scale` + `autoAlpha`), `gsap.matchMedia()` e zero CLS
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

function buildLayout(count, cols) {
  const rows = [];
  let i = 0;
  let r = 0;
  while (i < count) {
    const row = new Array(cols).fill(-1);
    const a = (r * 2 + (r % 2)) % cols;
    row[a] = i++;
    if (r % 3 === 0 && i < count) {
      let b = (a + 2) % cols;
      if (b === a) b = (a + 1) % cols;
      row[b] = i++;
    }
    rows.push(row);
    r++;
  }
  return rows;
}

function createCardElement(pillar, origin) {
  const cell = document.createElement('div');
  cell.className = 'spw-cell';

  const article = document.createElement('article');
  article.className = 'spw-item';
  article.style.transformOrigin = origin;

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
      <div class="spw-media__top">
        <span class="spw-media__index">${pillar.index}</span>
        <span class="spw-media__pill">${pillar.role}</span>
      </div>
    </div>
    <div class="spw-caption">
      <div class="spw-caption__head">
        <h3 class="spw-card-title">${pillar.title}</h3>
        <span class="spw-card-tag">${pillar.index}</span>
      </div>
      <p class="spw-card-desc">${pillar.desc}</p>
    </div>
  `;

  cell.appendChild(article);
  return cell;
}

export function initWhyChooseWall() {
  const section = document.getElementById('porque-escolher');
  if (!section) return null;

  const introStage = section.querySelector('#spwIntroStage');
  const gridEl = section.querySelector('#spwGrid');
  if (!gridEl) return null;

  const renderGrid = (cols) => {
    const layout = buildLayout(VL_WHY_PILLARS.length, cols);
    const fragment = document.createDocumentFragment();
    gridEl.style.setProperty('--spw-cols', String(cols));

    layout.forEach((row) => {
      const rowEl = document.createElement('div');
      rowEl.className = 'spw-row';

      row.forEach((idx, ci) => {
        if (idx === -1) {
          const spacer = document.createElement('div');
          spacer.className = 'spw-spacer';
          spacer.setAttribute('aria-hidden', 'true');
          rowEl.appendChild(spacer);
          return;
        }
        const origin = ci < cols / 2 ? 'right bottom' : 'left bottom';
        rowEl.appendChild(createCardElement(VL_WHY_PILLARS[idx], origin));
      });

      fragment.appendChild(rowEl);
    });

    gridEl.innerHTML = '';
    gridEl.appendChild(fragment);
  };

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
    renderGrid(window.innerWidth >= 1024 ? 4 : window.innerWidth >= 640 ? 3 : 2);
    return {
      destroy() {
        gridEl.removeEventListener('pointerover', onPointerOver);
        gridEl.removeEventListener('pointerleave', onPointerLeave);
      },
    };
  }

  const mm = gsap.matchMedia();

  const mountBreakpoint = (cols, reduceMotion) => {
    renderGrid(cols);

    const cells = Array.from(gridEl.querySelectorAll('.spw-cell'));
    const items = cells.map((c) => c.querySelector('.spw-item')).filter(Boolean);

    if (reduceMotion) {
      gsap.set(items, { scale: 1, autoAlpha: 1 });
      if (introStage) gsap.set(introStage, { autoAlpha: 1, scale: 1 });
      return;
    }

    // Título "POR QUE NOS ESCOLHER" aparece na entrada e SOME completamente ao começar a rolar!
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

    // Cada diferencial (IMAGEM + TEXTO EXPLICATIVO) nasce junto, segura no centro
    // da tela para leitura limpa e some junto ao sair da viewport!
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
          { scale: 0.16, autoAlpha: 0 },
          { scale: 1, autoAlpha: 1, ease: 'power2.out', duration: 0.38 }
        )
        .to(item, { scale: 1, autoAlpha: 1, duration: 0.24, ease: 'none' })
        .to(item, { scale: 0.16, autoAlpha: 0, ease: 'power2.in', duration: 0.38 });
    });
  };

  mm.add(
    {
      isDesktop: '(min-width: 1024px)',
      isTablet: '(min-width: 640px) and (max-width: 1023px)',
      isMobile: '(max-width: 639px)',
      reduceMotion: '(prefers-reduced-motion: reduce)',
    },
    (context) => {
      const { isDesktop, isTablet, reduceMotion } = context.conditions;
      const cols = isDesktop ? 4 : isTablet ? 3 : 2;
      mountBreakpoint(cols, reduceMotion);
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
