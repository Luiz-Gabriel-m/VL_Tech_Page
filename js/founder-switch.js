/* ==========================================================================
   FOUNDER SWITCH — Alternância dinâmica entre Luiz Gabriel & Victor Whohlers
   Hero de Alta Performance VL Tech com Tipografia Gigante em Camadas,
   Conexão Conceitual das Iniciais (L & V) e Retratos com Glow Vermelho.
   ========================================================================== */

export function initFounderSwitch() {
  const toggleBtn = document.getElementById('founderToggleBtn');
  if (!toggleBtn) return null;

  // Elementos do Header e Hero
  const activeName = document.getElementById('activeName');
  const partnerInitial = document.getElementById('partnerInitial');
  const partnerRemainingName = document.getElementById('partnerRemainingName');
  const heroGiantOutline = document.getElementById('heroGiantOutline');
  const justificationLetter = document.getElementById('justificationLetter');
  const justificationTitle = document.getElementById('justificationTitle');
  const justificationPillars = document.getElementById('justificationPillars');
  const founderImage = document.getElementById('founderImage');
  const portraitWatermark = document.getElementById('portraitWatermark');
  const bgVectorLetter = document.getElementById('bgVectorLetter') || document.querySelector('.bg-vector-letter') || document.querySelector('.bg-vector-v');
  const metaFounderName = document.getElementById('metaFounderName');
  const metaFounderRole = document.getElementById('metaFounderRole');
  const aboutFounderName = document.getElementById('aboutFounderName');
  const aboutQuote = document.getElementById('aboutQuote');
  const aboutDesc = document.getElementById('aboutDesc');

  // Dados completos e precisos dos Sócios
  const founders = {
    luiz: {
      key: 'luiz',
      buttonLabel: 'LUIZ GABRIEL',
      fullName: 'LUIZ GABRIEL',
      initial: 'L',
      remainingName: 'UIZ GABRIEL',
      outlineTitle: 'Especialista em Front-end, Arquitetura Web e Automações',
      justificationTitle: 'CONEXÃO VL TECH: FRONT-END',
      justificationPillars: 'Layout · Lógica · Liderança Técnica no front',
      badgeTag: 'FRONT-END',
      specialty: 'Arquitetura Front & Automação',
      partnerBadgeName: 'Luiz Gabriel · Co-founder',
      metaRole: 'Front-end, Arquitetura Web & Automações',
      bgLetter: 'V', // O 'V' da marca VL Tech conectado por trás
      image: 'assets/images/rosto.jpg',
      quote: 'Cada linha de código é um diálogo entre precisão cirúrgica e arquitetura visual imersiva.',
      desc: 'Co-fundador da VL Tech, especialista em engenharia front-end de alta performance, design systems escaláveis e automações inteligentes.'
    },
    victor: {
      key: 'victor',
      buttonLabel: 'VICTOR WHOHLERS',
      fullName: 'VICTOR WHOHLERS',
      initial: 'V',
      remainingName: 'ICTOR WHOHLERS',
      outlineTitle: 'Especialista em Back-end, Cloud & Lógica de Sistemas',
      justificationTitle: 'CONEXÃO VL TECH: BACK-END',
      justificationPillars: 'Virtualização · Volumes de Dados · Visão Sistêmica no back',
      badgeTag: 'BACK-END',
      specialty: 'Back-end, Cloud & Lógica de Sistemas',
      partnerBadgeName: 'Victor Whohlers · Co-founder',
      metaRole: 'Back-end, Cloud & Lógica de Sistemas',
      bgLetter: 'V', // O 'V' oficial de Victor da VL Tech por trás
      image: 'assets/images/victor.jpg',
      quote: 'Robustez, escalabilidade extrema e inteligência aplicada nos bastidores da sua operação.',
      desc: 'Co-fundador da VL Tech, especialista em engenharia de software distribuída, bancos de dados escaláveis e arquitetura cloud de alto volume.'
    }
  };

  let currentKey = 'luiz';

  function applyFounder(key, animate = true) {
    const data = founders[key];
    if (!data) return;

    const animatedElements = [
      partnerInitial,
      partnerRemainingName,
      heroGiantOutline,
      justificationLetter,
      justificationTitle,
      justificationPillars,
      founderImage,
      portraitWatermark,
      metaFounderName,
      metaFounderRole,
    ].filter(Boolean);

    if (animate) {
      animatedElements.forEach((el) => {
        el.style.transition = 'opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1), transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)';
        el.style.opacity = '0';
        el.style.transform = 'translateY(8px)';
      });

      if (bgVectorLetter) {
        bgVectorLetter.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
        bgVectorLetter.style.opacity = '0';
        bgVectorLetter.style.transform = 'translateY(-50%) scale(0.96)';
      }
    }

    const updateDOM = () => {
      // Header Switch Button
      if (activeName) activeName.textContent = data.buttonLabel;

      // Tipografia Gigante
      if (partnerInitial) {
        partnerInitial.textContent = data.initial;
        partnerInitial.setAttribute('data-partner', data.key);
      }
      if (partnerRemainingName) partnerRemainingName.textContent = data.remainingName;
      if (heroGiantOutline) heroGiantOutline.textContent = data.outlineTitle;

      // Conexão e Justificativa da Inicial (L / V)
      if (justificationLetter) justificationLetter.textContent = data.initial;
      if (justificationTitle) justificationTitle.textContent = data.justificationTitle;
      if (justificationPillars) justificationPillars.textContent = data.justificationPillars;

      // Retrato Limpo
      if (founderImage) {
        founderImage.src = data.image;
        founderImage.alt = `Retrato do Co-founder ${data.fullName}`;
      }
      if (portraitWatermark) portraitWatermark.textContent = data.initial;

      // Background Vector Letter
      if (bgVectorLetter) {
        bgVectorLetter.textContent = data.bgLetter;
        bgVectorLetter.setAttribute('title', `Conexão VL Tech: ${data.fullName}`);
      }

      // Meta do Hero
      if (metaFounderName) metaFounderName.textContent = data.fullName;
      if (metaFounderRole) metaFounderRole.textContent = data.metaRole;

      // Seção Sobre / Bio
      if (aboutFounderName) aboutFounderName.textContent = `${data.fullName} — Co-founder & ${data.specialty}`;
      if (aboutQuote) aboutQuote.innerHTML = data.quote;
      if (aboutDesc) aboutDesc.textContent = data.desc;

      if (animate) {
        requestAnimationFrame(() => {
          animatedElements.forEach((el) => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
          });
          if (bgVectorLetter) {
            bgVectorLetter.style.opacity = '0.045';
            bgVectorLetter.style.transform = 'translateY(-50%) scale(1)';
          }
        });
      }
    };

    if (animate) {
      setTimeout(updateDOM, 160);
    } else {
      updateDOM();
    }
  }

  // Sincroniza com a timeline cinemática do Hero Scrollytelling
  document.addEventListener('founder:changed', (e) => {
    const key = e.detail?.founder;
    if (key && key !== currentKey) {
      currentKey = key;
      applyFounder(key, false);
    }
  });

  return {
    getCurrentFounder: () => currentKey,
    setFounder: (key) => {
      currentKey = key;
      applyFounder(key, true);
    }
  };
}
