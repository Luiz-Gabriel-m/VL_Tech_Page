/* ==========================================================================
   TECH HARDWARE RAIL VITRINE — VL Tech High-Performance Infrastructure
   - Hanging rail physics with suspension brackets & laser alignment LED
   - Interactive brush, swing, and hover physics with GSAP
   - Horizontal drag-to-slide rail inspection
   - Detailed Specification Modal with real-time telemetry gauges & WhatsApp CTA
   ========================================================================== */

import { gsap } from './core/gsap.js';

export const HARDWARE_DATA = [
  {
    id: 'edge-node-x1',
    code: 'VL-EN-X1',
    badge: '01 · Ultra-Low Latency',
    name: 'VL-Edge Node X1',
    role: 'Edge Computing Server Blade',
    status: 'ONLINE',
    latency: '0.4ms',
    throughput: '200 Gbps',
    compute: '128-Core ARM Neoverse V2',
    memory: '256GB ECC DDR5-5600',
    power: '185W Ultra-Efficient',
    formFactor: '1U Micro-Blade Modular',
    description:
      'Nó de computação de borda de altíssima densidade para roteamento e renderização global ultraveloz na Vercel Edge e AWS Wavelength com latência sub-milisegundo.',
    features: [
      'Criptografia nativa em silício com zero overhead',
      'Auto-routing inteligente com protocolo Anycast',
      'Zero jitter sob 100k conexões simultâneas',
      'Deploy instantâneo via Vercel e Kubernetes',
    ],
    telemetry: { load: 42, temp: 48, efficiency: 98, bandwidthGbps: 184 },
  },
  {
    id: 'neural-quantum-core',
    code: 'VL-NQC-96',
    badge: '02 · AI Tensor Engine',
    name: 'Neural Quantum Core',
    role: 'Inferência Neural & LLMs 24/7',
    status: 'ACTIVE',
    latency: '1.2ms',
    throughput: '1.8 PFLOPS FP8',
    compute: '96 Tensor Cores V4',
    memory: '96GB HBM3e (1.2 TB/s)',
    power: '320W Liquid Cooled',
    formFactor: '2U Neural Acceleration Bay',
    description:
      'Acelerador de tensores projetado para inferência contínua de LLMs corporativos e agentes autônomos de IA integrados à API oficial do WhatsApp sem interrupções.',
    features: [
      'Pipeline de baixa latência para automação de WhatsApp API',
      'Suporte a Retrieval-Augmented Generation (RAG) em tempo real',
      'Quantização dinâmica de precisão mista (FP8 / INT4)',
      'Refrigeração líquida com redundância térmica passiva',
    ],
    telemetry: { load: 78, temp: 62, efficiency: 95, bandwidthGbps: 240 },
  },
  {
    id: 'cloud-matrix-blade',
    code: 'VL-CMB-64',
    badge: '03 · Microservices Hub',
    name: 'Cloud Matrix Blade',
    role: 'Cluster Distribuído de Alta Concorrência',
    status: 'HIGH LOAD',
    latency: '0.8ms',
    throughput: '2.4M Req/s',
    compute: '64-Core AMD EPYC 9004',
    memory: '512GB ECC DDR5 Quad-Channel',
    power: '280W Redundant Dual-PSU',
    formFactor: '1U Dense Cluster Module',
    description:
      'Lâmina de alta densidade otimizada para orquestração Kubernetes, microsserviços desacoplados e escalabilidade horizontal elástica em nuvens híbridas AWS e GCP.',
    features: [
      'Service mesh redundante com proxy Envoy embutido',
      'Isolamento estrito de nós por cliente corporativo',
      'Failover automatizado de réplicas em menos de 50ms',
      'Throughput validado para picos de mais de 2 milhões req/s',
    ],
    telemetry: { load: 64, temp: 54, efficiency: 97, bandwidthGbps: 195 },
  },
  {
    id: 'neural-ai-accelerator',
    code: 'VL-NAA-48',
    badge: '04 · Deep Learning Coprocessor',
    name: 'Neural AI Accelerator',
    role: 'Processamento Visual & WebGL 3D',
    status: 'ACTIVE',
    latency: '2.1ms',
    throughput: '840 TFLOPS',
    compute: '48 Streaming Multiprocessors',
    memory: '48GB GDDR6X Alta Velocidade',
    power: '225W Dynamic Smart-Fan',
    formFactor: 'PCIe Gen5 Single-Slot Blade',
    description:
      'Unidade de aceleração visual para renderização Three.js em tempo real, visão computacional e interfaces brutalistas de alta conversão para o ecossistema VL Tech.',
    features: [
      'Aceleração direta de shaders GLSL e pipeline Three.js',
      'Pipeline neural de visão para análise documental imediata',
      'Buffer ultrarrápido para streaming de telemetria 3D',
      'Taxa garantida de 60 FPS contínuos em WebGL',
    ],
    telemetry: { load: 55, temp: 51, efficiency: 96, bandwidthGbps: 120 },
  },
  {
    id: 'encrypted-storage-array',
    code: 'VL-ESA-32T',
    badge: '05 · Hardware Security Vault',
    name: 'Encrypted Storage Array',
    role: 'Armazenamento Criptografado Militar',
    status: 'SECURE',
    latency: '0.02ms',
    throughput: '14.5 GB/s Read',
    compute: 'Crypto Coprocessor ASIC',
    memory: '32TB NVMe PCIe 5.0 RAID 10',
    power: '120W Protected Battery-Backup',
    formFactor: '1U Hot-Swap Storage Unit',
    description:
      'Array de armazenamento em estado sólido com criptografia AES-256 no nível do silício, zero data leaks e conformidade absoluta com os padrões LGPD e SOC-2.',
    features: [
      'Chaves criptográficas rotativas gerenciadas em hardware HSM',
      'Proteção contra injeções, exfiltração e ataques DDoS',
      'Imutabilidade de dados contra ransomware corporativo',
      'Backup síncrono distribuído em zonas geográficas isoladas',
    ],
    telemetry: { load: 31, temp: 44, efficiency: 99, bandwidthGbps: 116 },
  },
];

export function initTechHardwareRail() {
  const section = document.querySelector('#capacetes');
  const railTrack = document.querySelector('#techHardwareRailTrack');
  const progressBar = document.querySelector('#techHardwareProgressBar');
  const modal = document.querySelector('#techHardwareModal');
  if (!section || !railTrack) return null;

  const blades = railTrack.querySelectorAll('.hardware-blade-unit');

  // 1. Atualização do indicador de progresso do trilho
  function updateProgress() {
    if (!progressBar) return;
    const maxScroll = railTrack.scrollWidth - railTrack.clientWidth;
    if (maxScroll <= 0) {
      progressBar.style.width = '100%';
      return;
    }
    const percent = Math.min(100, Math.max(12, (railTrack.scrollLeft / maxScroll) * 100));
    progressBar.style.width = `${percent}%`;
  }

  railTrack.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  // 2. Física de Arrasto Horizontal do Trilho (Drag to Slide)
  let isDown = false;
  let startX = 0;
  let scrollLeft = 0;

  railTrack.addEventListener('mousedown', (e) => {
    isDown = true;
    railTrack.classList.add('is-dragging');
    startX = e.pageX - railTrack.offsetLeft;
    scrollLeft = railTrack.scrollLeft;
  });

  window.addEventListener('mouseup', () => {
    if (isDown) {
      isDown = false;
      railTrack.classList.remove('is-dragging');
    }
  });

  railTrack.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - railTrack.offsetLeft;
    const walk = (x - startX) * 1.6;
    railTrack.scrollLeft = scrollLeft - walk;
    updateProgress();
  });

  // 3. Física de Oscilação dos Módulos Suspensos (Hanger Physics on Hover)
  blades.forEach((blade, idx) => {
    const chassis = blade.querySelector('.hardware-chassis');
    const cable = blade.querySelector('.hardware-hanging-cable');

    blade.addEventListener('mouseenter', () => {
      // Oscilação pendular suave
      if (chassis) {
        gsap.to(chassis, {
          y: 12,
          rotationZ: idx % 2 === 0 ? 1.5 : -1.5,
          scale: 1.025,
          duration: 0.45,
          ease: 'power2.out',
        });
      }
      if (cable) {
        gsap.to(cable, {
          scaleY: 1.15,
          duration: 0.35,
          ease: 'power2.out',
        });
      }
    });

    blade.addEventListener('mouseleave', () => {
      if (chassis) {
        gsap.to(chassis, {
          y: 0,
          rotationZ: 0,
          scale: 1,
          duration: 0.6,
          ease: 'elastic.out(1, 0.4)',
        });
      }
      if (cable) {
        gsap.to(cable, {
          scaleY: 1,
          duration: 0.45,
          ease: 'power2.out',
        });
      }
    });
  });

  // 4. Modal de Especificações Técnicas & Telemetria
  if (modal) {
    const closeBtn = modal.querySelector('#techModalCloseBtn');
    const backdrop = modal.querySelector('.tech-modal__backdrop');
    const tabFront = modal.querySelector('#techModalTabFront');
    const tabInternal = modal.querySelector('#techModalTabInternal');
    const bodyFront = modal.querySelector('#techModalBodyFront');
    const bodyInternal = modal.querySelector('#techModalBodyInternal');

    function openModal(item) {
      // Preenchimento dos dados do item
      modal.querySelector('#modalCode').textContent = item.code;
      modal.querySelector('#modalStatus').textContent = item.status;
      modal.querySelector('#modalTitle').textContent = item.name;
      modal.querySelector('#modalRole').textContent = `${item.role} · ${item.formFactor}`;
      modal.querySelector('#modalDescription').textContent = item.description;

      // Telemetria
      modal.querySelector('#modalLoadVal').textContent = `${item.telemetry.load}%`;
      modal.querySelector('#modalLoadBar').style.width = `${item.telemetry.load}%`;

      modal.querySelector('#modalTempVal').textContent = `${item.telemetry.temp}°C`;
      modal.querySelector('#modalTempBar').style.width = `${(item.telemetry.temp / 85) * 100}%`;

      modal.querySelector('#modalEffVal').textContent = `${item.telemetry.efficiency}%`;
      modal.querySelector('#modalEffBar').style.width = `${item.telemetry.efficiency}%`;

      modal.querySelector('#modalBwVal').textContent = `${item.telemetry.bandwidthGbps} Gbps`;
      modal.querySelector('#modalBwBar').style.width = `${(item.telemetry.bandwidthGbps / 250) * 100}%`;

      // Specs
      modal.querySelector('#modalLatency').textContent = item.latency;
      modal.querySelector('#modalThroughput').textContent = item.throughput;
      modal.querySelector('#modalPower').textContent = item.power;
      modal.querySelector('#modalCompute').textContent = item.compute;
      modal.querySelector('#modalMemory').textContent = item.memory;

      // Features
      const featList = modal.querySelector('#modalFeaturesList');
      if (featList) {
        featList.innerHTML = item.features
          .map((f) => `<li class="tech-modal__feat-item"><span class="feat-star text-red">✦</span><span>${f}</span></li>`)
          .join('');
      }

      // WhatsApp link dinâmico
      const ctaBtn = modal.querySelector('#modalCtaBtn');
      if (ctaBtn) {
        ctaBtn.href = `https://wa.me/5511999999999?text=Ol%C3%A1%2C%20gostaria%20de%20solicitar%20a%20infraestrutura%20${encodeURIComponent(
          item.name
        )}%20para%20o%20meu%20projeto%20com%20a%20VL%20Tech.`;
      }

      // Reset para aba frontal
      setTab('front');

      modal.classList.add('is-open');
      document.body.classList.add('modal-open');

      gsap.fromTo(
        modal.querySelector('.tech-modal__window'),
        { scale: 0.94, opacity: 0, y: 20 },
        { scale: 1, opacity: 1, y: 0, duration: 0.35, ease: 'power3.out' }
      );
    }

    function closeModal() {
      gsap.to(modal.querySelector('.tech-modal__window'), {
        scale: 0.94,
        opacity: 0,
        y: 15,
        duration: 0.25,
        ease: 'power2.in',
        onComplete: () => {
          modal.classList.remove('is-open');
          document.body.classList.remove('modal-open');
        },
      });
    }

    function setTab(tab) {
      if (tab === 'front') {
        tabFront?.classList.add('is-active');
        tabInternal?.classList.remove('is-active');
        bodyFront?.classList.remove('is-hidden');
        bodyInternal?.classList.add('is-hidden');
      } else {
        tabInternal?.classList.add('is-active');
        tabFront?.classList.remove('is-active');
        bodyInternal?.classList.remove('is-hidden');
        bodyFront?.classList.add('is-hidden');
      }
    }

    tabFront?.addEventListener('click', () => setTab('front'));
    tabInternal?.addEventListener('click', () => setTab('internal'));
    closeBtn?.addEventListener('click', closeModal);
    backdrop?.addEventListener('click', closeModal);

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) {
        closeModal();
      }
    });

    // Event delegation nos botões e nos cards
    railTrack.addEventListener('click', (e) => {
      const targetUnit = e.target.closest('.hardware-blade-unit');
      if (!targetUnit) return;
      const itemId = targetUnit.dataset.hardwareId;
      const item = HARDWARE_DATA.find((h) => h.id === itemId);
      if (item) {
        openModal(item);
      }
    });
  }

  return {
    destroy: () => {
      railTrack.removeEventListener('scroll', updateProgress);
    },
  };
}
