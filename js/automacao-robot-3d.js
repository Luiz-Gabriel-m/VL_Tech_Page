/* ==========================================================================
   AUTOMAÇÃO ROBOT 3D — Port fiel e blindado do RobotHero (21st.dev)
   - Geometria fiel ao RobotPrototype:
       · Corpo esférico PBR granulado + bevel torus + pescoço Lathe torneado
       · Cabeça obsidian + cápsula de vidro Fresnel GLSL
       · Olhos 3D (piscada natural a cada 3s + corações 3D HeartCurve no clique!)
       · Orelhas + antenas com ponta luminosa reativa ao modo ativo
   - Iluminação Studio PBR (THREE.PMREMGenerator + 3-point + rim reativo)
     para alto contraste e leitura nítida no fundo escuro da VL Tech
   - Todas as interações 100% funcionais e sem bugs:
       1. Abas (Instagram 24/7, WhatsApp IA, CRM & Leads, Backoffice IA) trocam
          cor do visor, rim light, antena, wordmark, status, headline, chips e KPIs
       2. Clique no robô (Raycaster + fallback central) ou mini-rosto -> olhos
          de coração 3D + pulo elástico estável (`* dt` + clamp) + feedback sonoro
       3. Botão "Testar Ação" dispara evento simulado no balão + aceno do robô
       4. Tracking de cursor clampado pela viewport (zero layout thrashing e
          100% imune a scroll) + ResizeObserver + pausa real fora da tela
   ========================================================================== */

import { gsap } from './core/gsap.js';
import { playClick, playHover, playIgnite } from './sound.js';

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

const MODES = {
  instagram: {
    key: 'instagram',
    bgWord: 'INSTAGRAM',
    badge: 'MODO INSTA · PILOTO AUTOMÁTICO',
    bubble: 'Respondendo DMs e comentários do seu Insta em 1.4s',
    loveBubble: 'Cuidando do seu Insta com carinho ❤',
    title: 'CUIDAMOS DO SEU INSTA 24/7.',
    desc: 'Nosso agente responde Directs, reage a comentários em Reels e posts ("comenta EU QUERO"), envia links e qualifica seguidores automaticamente.',
    chips: ['DMs & Comentários', 'Link no Direct', 'Filtro p/ WhatsApp'],
    metricA: { val: '1.4s', label: 'Resposta na DM' },
    metricB: { val: '+340%', label: 'Engajamento ativo' },
    ctaHref:
      'https://wa.me/5511999999999?text=Ol%C3%A1%2C%20quero%20automatizar%20meu%20Instagram%20com%20o%20rob%C3%B4%20da%20VL%20Tech',
    ctaLabel: 'Automatizar Insta',
    accentHex: '#ff245b',
    accentRgb: '255, 36, 91',
    screenColor: '#ff245b',
    screenIntensity: 1.35,
    eyeHex: 0xffffff,
    rimHex: 0xff245b,
    simulations: [
      '✓ Comentário "EU QUERO" respondido com catálogo no Direct (1.1s)',
      '✓ Menção nos Stories respondida com cupom exclusivo (0.8s)',
      '✓ Seguidor qualificado encaminhado para seu WhatsApp (1.2s)',
    ],
  },
  whatsapp: {
    key: 'whatsapp',
    bgWord: 'WHATSAPP',
    badge: 'MODO WHATSAPP · AGENTE IA OFICIAL',
    bubble: 'Qualificando leads e agendando reuniões no WhatsApp',
    loveBubble: 'Atendimento humanizado 24 horas ❤',
    title: 'VENDAS E ATENDIMENTO NO WHATSAPP.',
    desc: 'Agente treinado com a linguagem da sua marca na API oficial do WhatsApp: tira dúvidas, envia propostas e agenda horários no Google Agenda.',
    chips: ['API Oficial Meta', 'IA Treinada', 'Agendamento Auto'],
    metricA: { val: '24/7', label: 'Plantão comercial' },
    metricB: { val: '< 2s', label: 'Tempo de resposta' },
    ctaHref:
      'https://wa.me/5511999999999?text=Ol%C3%A1%2C%20quero%20um%20agente%20de%20IA%20no%20WhatsApp%20da%20VL%20Tech',
    ctaLabel: 'Ativar WhatsApp IA',
    accentHex: '#00ffc6',
    accentRgb: '0, 255, 198',
    screenColor: '#00ffc6',
    screenIntensity: 1.3,
    eyeHex: 0xeafffa,
    rimHex: 0x00ffc6,
    simulations: [
      '✓ Áudio do cliente transcrito e orçamento enviado (1.5s)',
      '✓ Reunião agendada automaticamente para amanhã às 15h (0.9s)',
      '✓ Follow-up inteligente enviado para proposta em aberto (0.6s)',
    ],
  },
  crm: {
    key: 'crm',
    bgWord: 'CRM & LEADS',
    badge: 'MODO PIPELINE · ZERO LEAD PERDIDO',
    bubble: 'Sincronizando anúncios, site e CRM em tempo real',
    loveBubble: 'Nenhum lead fica para trás ❤',
    title: 'SEU FUNIL CONECTADO SEM DIGITAÇÃO.',
    desc: 'Ligamos seu site, Meta/Google Ads, HubSpot, RD Station, Pipedrive e pagamentos via webhooks instantâneos com alerta imediato ao vendedor.',
    chips: ['Meta & Google Ads', 'HubSpot / RD / Pipedrive', 'Follow-up Auto'],
    metricA: { val: '0%', label: 'Leads perdidos' },
    metricB: { val: '100%', label: 'Dados rastreados' },
    ctaHref:
      'https://wa.me/5511999999999?text=Ol%C3%A1%2C%20quero%20integrar%20meu%20CRM%20e%20funil%20de%20vendas%20com%20a%20VL%20Tech',
    ctaLabel: 'Integrar CRM',
    accentHex: '#ff1e26',
    accentRgb: '255, 30, 38',
    screenColor: '#ff1e26',
    screenIntensity: 1.4,
    eyeHex: 0xffffff,
    rimHex: 0xff1e26,
    simulations: [
      '✓ Novo lead do Meta Ads criado no Pipedrive + alerta enviado (0.4s)',
      '✓ Pagamento PIX confirmado → etapa atualizada no funil (0.3s)',
      '✓ Proposta em PDF gerada e disparada por e-mail (0.7s)',
    ],
  },
  backoffice: {
    key: 'backoffice',
    bgWord: 'IA 24/7',
    badge: 'MODO BACKOFFICE · FLUXOS AUTÔNOMOS',
    bubble: 'Gerando relatórios, contratos e cobranças em nuvem',
    loveBubble: 'Menos trabalho manual, mais escala ❤',
    title: 'ROTINAS INTERNAS NO PILOTO AUTOMÁTICO.',
    desc: 'Eliminamos planilhas repetitivas com robôs sob medida: contratos, faturas, relatórios diários no WhatsApp e monitoramento em nuvem.',
    chips: ['Contratos & PDFs', 'Relatório Diário', 'Cloud 99.98%'],
    metricA: { val: '-80%', label: 'Tarefas manuais' },
    metricB: { val: '99.98%', label: 'Uptime em nuvem' },
    ctaHref:
      'https://wa.me/5511999999999?text=Ol%C3%A1%2C%20quero%20automatizar%20processos%20internos%20com%20a%20VL%20Tech',
    ctaLabel: 'Criar Meu Robô',
    accentHex: '#ff6b2b',
    accentRgb: '255, 107, 43',
    screenColor: '#ff6b2b',
    screenIntensity: 1.35,
    eyeHex: 0xfff4ed,
    rimHex: 0xff6b2b,
    simulations: [
      '✓ Contrato assinado → Nota fiscal e boleto emitidos (1.0s)',
      '✓ Resumo diário de vendas enviado no WhatsApp dos sócios (0.5s)',
      '✓ Conciliação de 48 lançamentos concluída sem erros (1.3s)',
    ],
  },
};

function createHeartCurve(THREE) {
  class HeartCurve extends THREE.Curve {
    getPoint(t, optionalTarget = new THREE.Vector3()) {
      const a = t * Math.PI * 2;
      const x = 16 * Math.pow(Math.sin(a), 3);
      const y =
        13 * Math.cos(a) -
        5 * Math.cos(2 * a) -
        2 * Math.cos(3 * a) -
        Math.cos(4 * a);
      return optionalTarget.set(x * 0.002, (y + 6) * 0.002, 0);
    }
  }
  return new HeartCurve();
}

function createStudioEnvironment(THREE, renderer) {
  const pmrem = new THREE.PMREMGenerator(renderer);
  pmrem.compileEquirectangularShader();

  const envScene = new THREE.Scene();
  envScene.background = new THREE.Color(0x1f2028);

  const softboxGeom = new THREE.PlaneGeometry(1, 1);
  const addPanel = (color, intensity, pos, scale, rot) => {
    const mat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(color).multiplyScalar(intensity),
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(softboxGeom, mat);
    mesh.position.set(...pos);
    mesh.scale.set(...scale);
    if (rot) mesh.rotation.set(...rot);
    envScene.add(mesh);
  };

  // Softboxes brilhantes de estúdio (dão volume e contraste ao chassi prata/branco)
  addPanel(0xffffff, 2.8, [0, 5.2, 2.0], [8, 5, 1], [Math.PI / 2, 0, 0]);
  addPanel(0xf0f4ff, 2.2, [-5.5, 2.4, 3.6], [5, 4.5, 1], [0, Math.PI / 3, 0]);
  addPanel(0xffffff, 1.8, [5.5, 1.8, 3.6], [4.5, 4, 1], [0, -Math.PI / 3, 0]);
  addPanel(0xffffff, 1.3, [0, -3.5, 2.0], [6, 4, 1], [-Math.PI / 2, 0, 0]);

  const envRT = pmrem.fromScene(envScene, 0.04);

  softboxGeom.dispose();
  envScene.traverse((obj) => {
    if (obj.material) obj.material.dispose();
  });
  pmrem.dispose();

  return envRT;
}

function generatePbrTexturesAsync(THREE) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const size = 512;
      const canvasC = document.createElement('canvas');
      const canvasB = document.createElement('canvas');
      canvasC.width = canvasB.width = size;
      canvasC.height = canvasB.height = size;
      const ctxC = canvasC.getContext('2d');
      const ctxB = canvasB.getContext('2d');

      if (ctxC && ctxB) {
        ctxC.fillStyle = '#e6e6ee';
        ctxC.fillRect(0, 0, size, size);
        ctxB.fillStyle = '#808080';
        ctxB.fillRect(0, 0, size, size);

        for (let i = 0; i < 6500; i++) {
          const x = Math.random() * size;
          const y = Math.random() * size;
          const r = 0.5 + Math.random() * 1.35;
          const isDark = Math.random() > 0.16;

          ctxC.beginPath();
          ctxC.arc(x, y, r, 0, Math.PI * 2);
          ctxC.fillStyle = isDark ? '#3a3a44' : '#f2f2f8';
          ctxC.fill();

          ctxB.beginPath();
          ctxB.arc(x, y, r, 0, Math.PI * 2);
          ctxB.fillStyle = isDark ? '#181818' : '#f4f4f4';
          ctxB.fill();
        }
      }

      const colorMap = new THREE.CanvasTexture(canvasC);
      const bumpMap = new THREE.CanvasTexture(canvasB);
      colorMap.wrapS = bumpMap.wrapS = THREE.RepeatWrapping;
      colorMap.wrapT = bumpMap.wrapT = THREE.RepeatWrapping;
      colorMap.repeat.set(6, 3);
      bumpMap.repeat.set(6, 3);
      colorMap.needsUpdate = true;
      bumpMap.needsUpdate = true;

      resolve({ colorMap, bumpMap });
    }, 0);
  });
}

function createShadowTexture(THREE) {
  const size = 256;
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d');
  const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, 'rgba(0, 0, 0, 0.88)');
  grad.addColorStop(0.45, 'rgba(0, 0, 0, 0.45)');
  grad.addColorStop(0.78, 'rgba(0, 0, 0, 0.12)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(c);
  tex.needsUpdate = true;
  return tex;
}

function createEyePaths(THREE) {
  const w = 0.025;
  const h = 0.035;
  const r = 0.02;
  const g = 0.005;

  const topPath = new THREE.CurvePath();
  topPath.add(new THREE.LineCurve3(new THREE.Vector3(-w, g, 0), new THREE.Vector3(-w, h - r, 0)));
  topPath.add(
    new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(-w, h - r, 0),
      new THREE.Vector3(-w, h, 0),
      new THREE.Vector3(-w + r, h, 0)
    )
  );
  topPath.add(new THREE.LineCurve3(new THREE.Vector3(-w + r, h, 0), new THREE.Vector3(w - r, h, 0)));
  topPath.add(
    new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(w - r, h, 0),
      new THREE.Vector3(w, h, 0),
      new THREE.Vector3(w, h - r, 0)
    )
  );
  topPath.add(new THREE.LineCurve3(new THREE.Vector3(w, h - r, 0), new THREE.Vector3(w, g, 0)));

  const bottomPath = new THREE.CurvePath();
  bottomPath.add(new THREE.LineCurve3(new THREE.Vector3(-w, -g, 0), new THREE.Vector3(-w, -(h - r), 0)));
  bottomPath.add(
    new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(-w, -(h - r), 0),
      new THREE.Vector3(-w, -h, 0),
      new THREE.Vector3(-w + r, -h, 0)
    )
  );
  bottomPath.add(new THREE.LineCurve3(new THREE.Vector3(-w + r, -h, 0), new THREE.Vector3(w - r, -h, 0)));
  bottomPath.add(
    new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(w - r, -h, 0),
      new THREE.Vector3(w, -h, 0),
      new THREE.Vector3(w, -(h - r), 0)
    )
  );
  bottomPath.add(new THREE.LineCurve3(new THREE.Vector3(w, -(h - r), 0), new THREE.Vector3(w, -g, 0)));

  return { topPath, bottomPath };
}

export function initAutomacaoRobot() {
  const section = document.getElementById('automacao');
  const stage = document.getElementById('autoRobotStage');
  const canvas = document.getElementById('autoRobotCanvas');
  if (!stage || !canvas) return null;

  const THREE = window.THREE;
  if (!THREE) {
    console.warn('[automacao-robot-3d] Three.js não encontrado.');
    return null;
  }

  const canvasWrap = stage.querySelector('#autoRobotCanvasWrap') || canvas.parentElement;
  const bgWordEl = stage.querySelector('#autoRobotBgWord');
  const bubbleTextEl = stage.querySelector('#autoRobotBubbleText');
  const badgeEl = stage.querySelector('#autoRobotModeBadge');
  const titleEl = stage.querySelector('#autoRobotModeTitle');
  const descEl = stage.querySelector('#autoRobotModeDesc');
  const chipsEl = stage.querySelector('#autoRobotModeChips');
  const metricAVal = stage.querySelector('#autoMetricAVal');
  const metricALabel = stage.querySelector('#autoMetricALabel');
  const metricBVal = stage.querySelector('#autoMetricBVal');
  const metricBLabel = stage.querySelector('#autoMetricBLabel');
  const ctaLink = stage.querySelector('#autoRobotCta');
  const ctaLabelEl = stage.querySelector('#autoRobotCtaLabel');
  const simulateBtn = stage.querySelector('#autoRobotSimulateBtn');
  const modeBtns = Array.from(stage.querySelectorAll('.robot-mode-btn'));
  const miniFaceBtn = stage.querySelector('#autoRobotMiniFace');
  const infoPanel = stage.querySelector('#autoRobotInfoPanel');

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(pointer: coarse)').matches;

  // =========================================================================
  // 1. RENDERER, CENA, STUDIO PBR & CÂMERA (ENQUADRAMENTO HERO)
  // =========================================================================
  let width = Math.max(1, canvasWrap.clientWidth || window.innerWidth);
  let height = Math.max(1, canvasWrap.clientHeight || 380);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.setSize(width, height, false);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.24;

  const scene = new THREE.Scene();
  const envRT = createStudioEnvironment(THREE, renderer);
  scene.environment = envRT.texture;

  const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 30);
  camera.position.set(0, 0.14, 3.85);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
  scene.add(ambientLight);

  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x262632, 1.05);
  scene.add(hemiLight);

  const keyLight = new THREE.DirectionalLight(0xffffff, 1.85);
  keyLight.position.set(2.4, 4.8, 4.2);
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0xeef3ff, 0.85);
  fillLight.position.set(-4.2, 1.8, 3.0);
  scene.add(fillLight);

  const rimLight = new THREE.DirectionalLight(MODES.instagram.rimHex, 2.4);
  rimLight.position.set(0, 2.2, -4.2);
  scene.add(rimLight);

  const bottomBounce = new THREE.PointLight(MODES.instagram.rimHex, 0.95, 6);
  bottomBounce.position.set(0, -1.1, 1.35);
  scene.add(bottomBounce);

  // =========================================================================
  // 2. GEOMETRIA DO ROBOZINHO 3D (FIEL AO ROBOTPROTOTYPE)
  // =========================================================================
  const responsiveGroup = new THREE.Group();
  scene.add(responsiveGroup);

  const shadowTex = createShadowTexture(THREE);
  const shadowPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(2.15, 2.15),
    new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
      opacity: 0.92,
    })
  );
  shadowPlane.rotation.x = -Math.PI / 2;
  shadowPlane.position.set(0, -0.78, 0);
  responsiveGroup.add(shadowPlane);

  const bodyGroup = new THREE.Group();
  bodyGroup.position.set(0, -0.28, 0);
  responsiveGroup.add(bodyGroup);

  const chassisMat = new THREE.MeshStandardMaterial({
    color: 0xdcdce4,
    bumpScale: 0.005,
    roughness: 0.68,
    metalness: 0.1,
    envMapIntensity: 0.65,
  });

  let disposed = false;
  let generatedMaps = null;
  generatePbrTexturesAsync(THREE).then((maps) => {
    if (disposed) {
      maps.colorMap.dispose();
      maps.bumpMap.dispose();
      return;
    }
    generatedMaps = maps;
    chassisMat.map = maps.colorMap;
    chassisMat.bumpMap = maps.bumpMap;
    chassisMat.needsUpdate = true;
    if (!rafId) renderOnce();
  });

  const bodyMesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.43, 48, 48, 0, Math.PI * 2, Math.PI * 0.15, Math.PI * 0.85),
    chassisMat
  );
  bodyGroup.add(bodyMesh);

  const bevelMesh = new THREE.Mesh(
    new THREE.TorusGeometry(0.235, 0.025, 24, 48),
    chassisMat
  );
  bevelMesh.position.set(0, 0.34, 0);
  bevelMesh.rotation.x = Math.PI / 2;
  bodyGroup.add(bevelMesh);

  const neckPoints = [
    new THREE.Vector2(0.1, -0.05),
    new THREE.Vector2(0.215, -0.05),
    new THREE.Vector2(0.28, 0.02),
    new THREE.Vector2(0.295, 0.045),
    new THREE.Vector2(0.27, 0.055),
    new THREE.Vector2(0.1, 0.055),
  ];
  const neckMesh = new THREE.Mesh(new THREE.LatheGeometry(neckPoints, 48), chassisMat);
  neckMesh.position.set(0, 0.38, 0);
  bodyGroup.add(neckMesh);

  const headGroup = new THREE.Group();
  headGroup.position.set(0, 0.6, 0);
  bodyGroup.add(headGroup);

  const headMat = new THREE.MeshStandardMaterial({
    color: 0x0b0b10,
    roughness: 0.35,
    metalness: 0.18,
    envMapIntensity: 0.75,
  });
  const headMesh = new THREE.Mesh(new THREE.SphereGeometry(0.28, 48, 48), headMat);
  headGroup.add(headMesh);

  const glassUniforms = {
    color: { value: new THREE.Color(MODES.instagram.screenColor) },
    power: { value: 3.5 },
    intensity: { value: MODES.instagram.screenIntensity },
  };
  const glassMat = new THREE.ShaderMaterial({
    uniforms: glassUniforms,
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vViewPosition;
      void main() {
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vViewPosition = -mvPosition.xyz;
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform vec3 color;
      uniform float power;
      uniform float intensity;
      varying vec3 vNormal;
      varying vec3 vViewPosition;
      void main() {
        vec3 normal = normalize(vNormal);
        vec3 viewDir = normalize(vViewPosition);
        float fresnel = 1.0 - max(dot(viewDir, normal), 0.0);
        fresnel = pow(fresnel, power);
        gl_FragColor = vec4(color, fresnel * intensity);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const glassMesh = new THREE.Mesh(new THREE.SphereGeometry(0.302, 48, 48), glassMat);
  headGroup.add(glassMesh);

  // Olhos 3D + Corações 3D HeartCurve
  const { topPath, bottomPath } = createEyePaths(THREE);
  const heartCurve = createHeartCurve(THREE);

  const eyeTopGeom = new THREE.TubeGeometry(topPath, 18, 0.004, 8, false);
  const eyeBottomGeom = new THREE.TubeGeometry(bottomPath, 18, 0.004, 8, false);
  const heartGeom = new THREE.TubeGeometry(heartCurve, 56, 0.004, 8, true);

  const eyeMat = new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false });
  const heartMat = new THREE.MeshBasicMaterial({ color: 0xff245b, toneMapped: false });

  function createEye(posX, rotY) {
    const group = new THREE.Group();
    group.position.set(posX, -0.02, 0.292);
    group.rotation.y = rotY;
    group.scale.setScalar(1.14);

    const normalGroup = new THREE.Group();
    normalGroup.add(new THREE.Mesh(eyeTopGeom, eyeMat));
    normalGroup.add(new THREE.Mesh(eyeBottomGeom, eyeMat));
    group.add(normalGroup);

    const heartMesh = new THREE.Mesh(heartGeom, heartMat);
    heartMesh.visible = false;
    group.add(heartMesh);

    return { group, normalGroup, heartMesh };
  }

  const leftEye = createEye(-0.072, -0.2);
  const rightEye = createEye(0.072, 0.2);
  headGroup.add(leftEye.group);
  headGroup.add(rightEye.group);

  // Orelhas & Antenas
  const earBaseMat = new THREE.MeshStandardMaterial({ color: 0xf2f2f6, roughness: 0.4, envMapIntensity: 0.9 });
  const earRingMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.22, envMapIntensity: 1.0 });
  const earCenterMat = new THREE.MeshStandardMaterial({ color: 0x3c3c48, roughness: 0.68 });
  const antBaseMat = new THREE.MeshStandardMaterial({ color: 0xa0a0b0, roughness: 0.3, metalness: 0.6 });
  const antStickMat = new THREE.MeshStandardMaterial({ color: 0xdcdce6, roughness: 0.3, metalness: 0.35 });
  const antTipMat = new THREE.MeshBasicMaterial({ color: 0xff245b, toneMapped: false });

  const earCylGeom = new THREE.CylinderGeometry(0.04, 0.04, 0.025, 24);
  const earTorusGeom = new THREE.TorusGeometry(0.032, 0.008, 12, 24);
  const earCenterGeom = new THREE.CylinderGeometry(0.03, 0.03, 0.006, 24);
  const antBaseGeom = new THREE.CylinderGeometry(0.006, 0.008, 0.02, 12);
  const antStickGeom = new THREE.CylinderGeometry(0.003, 0.003, 0.1, 8);
  const antTipGeom = new THREE.SphereGeometry(0.008, 14, 14);

  function createEar(isLeft) {
    const dir = isLeft ? -1 : 1;
    const ear = new THREE.Group();
    ear.position.set(dir * 0.29, 0, 0);
    ear.scale.setScalar(1.28);

    const base = new THREE.Mesh(earCylGeom, earBaseMat);
    base.rotation.z = Math.PI / 2;
    ear.add(base);

    const ring = new THREE.Mesh(earTorusGeom, earRingMat);
    ring.position.x = dir * 0.012;
    ring.rotation.y = Math.PI / 2;
    ear.add(ring);

    const center = new THREE.Mesh(earCenterGeom, earCenterMat);
    center.position.x = dir * 0.012;
    center.rotation.z = Math.PI / 2;
    ear.add(center);

    const antenna = new THREE.Group();
    antenna.position.set(dir * 0.015, 0.035, 0);
    antenna.rotation.x = -0.38;

    const aBase = new THREE.Mesh(antBaseGeom, antBaseMat);
    aBase.position.y = 0.01;
    antenna.add(aBase);

    const aStick = new THREE.Mesh(antStickGeom, antStickMat);
    aStick.position.y = 0.06;
    antenna.add(aStick);

    const aTip = new THREE.Mesh(antTipGeom, antTipMat);
    aTip.position.y = 0.112;
    antenna.add(aTip);

    ear.add(antenna);
    return ear;
  }

  headGroup.add(createEar(true));
  headGroup.add(createEar(false));

  const hitMeshes = [bodyMesh, neckMesh, headMesh, glassMesh];
  const raycaster = new THREE.Raycaster();
  const ndcPoint = new THREE.Vector2();

  function updateResponsiveScale() {
    const vFov = (camera.fov * Math.PI) / 180;
    const visH = 2 * Math.tan(vFov / 2) * camera.position.z;
    const visW = visH * camera.aspect;
    const s = clamp(Math.min(visH / 1.95, visW / 2.65), 0.9, 1.38);
    responsiveGroup.scale.setScalar(s);
    responsiveGroup.position.y = 0.08;
  }
  updateResponsiveScale();

  // =========================================================================
  // 3. INTERAÇÕES: ABAS + SIMULAÇÃO + CARINHO (OLHOS DE CORAÇÃO)
  // =========================================================================
  let activeModeKey = 'instagram';
  let simCursor = 0;
  let isLoved = false;
  let loveTimer = null;

  let bounceOffset = 0;
  let bounceVel = 0;
  let scalePulse = 0;
  let nodImpulse = 0;

  let pointerX = 0;
  let pointerY = 0;
  let lastPointerTime = 0;

  const targetGlassColor = new THREE.Color(MODES.instagram.screenColor);
  const targetRimColor = new THREE.Color(MODES.instagram.rimHex);
  let targetGlassIntensity = MODES.instagram.screenIntensity;

  function applyThemeVars(mode) {
    const host = section || stage;
    host.style.setProperty('--robot-accent', mode.accentHex);
    host.style.setProperty('--robot-accent-rgb', mode.accentRgb);
    stage.dataset.activeMode = mode.key;
  }

  function renderModeUI(mode, animate = true) {
    const apply = () => {
      if (bgWordEl) bgWordEl.textContent = mode.bgWord;
      if (badgeEl) badgeEl.textContent = mode.badge;
      if (bubbleTextEl) bubbleTextEl.textContent = isLoved ? mode.loveBubble : mode.bubble;
      if (titleEl) titleEl.textContent = mode.title;
      if (descEl) descEl.textContent = mode.desc;
      if (chipsEl) {
        chipsEl.innerHTML = '';
        mode.chips.forEach((label) => {
          const li = document.createElement('li');
          li.textContent = label;
          chipsEl.appendChild(li);
        });
      }
      if (metricAVal) metricAVal.textContent = mode.metricA.val;
      if (metricALabel) metricALabel.textContent = mode.metricA.label;
      if (metricBVal) metricBVal.textContent = mode.metricB.val;
      if (metricBLabel) metricBLabel.textContent = mode.metricB.label;
      if (ctaLink) ctaLink.href = mode.ctaHref;
      if (ctaLabelEl) ctaLabelEl.textContent = mode.ctaLabel;
    };

    if (!animate || !gsap || prefersReduced) {
      apply();
      return;
    }

    if (bgWordEl) {
      gsap.fromTo(
        bgWordEl,
        { opacity: 0.02, scale: 0.94 },
        { opacity: 1, scale: 1, duration: 0.4, ease: 'power3.out', overwrite: 'auto' }
      );
    }

    if (infoPanel) {
      gsap.killTweensOf(infoPanel);
      gsap
        .timeline()
        .to(infoPanel, { opacity: 0, y: 6, duration: 0.12, ease: 'power2.in', onComplete: apply })
        .to(infoPanel, { opacity: 1, y: 0, duration: 0.24, ease: 'power3.out' });
    } else {
      apply();
    }
  }

  function setMode(key, userTriggered = false) {
    const mode = MODES[key];
    if (!mode) return;
    if (key === activeModeKey && userTriggered) return;

    activeModeKey = key;
    simCursor = 0;
    applyThemeVars(mode);

    modeBtns.forEach((btn) => {
      const isActive = btn.dataset.robotMode === key;
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });

    targetGlassColor.set(mode.screenColor);
    targetRimColor.set(mode.rimHex);
    targetGlassIntensity = mode.screenIntensity;
    eyeMat.color.setHex(mode.eyeHex);
    antTipMat.color.set(mode.accentHex);

    if (userTriggered) {
      try { playClick(); } catch (_) {}
      bounceVel = 0.9;
      scalePulse = 0.06;
      nodImpulse = 0.55;
    }

    renderModeUI(mode, userTriggered);
    if (!rafId) renderOnce();
  }

  function triggerSimulation() {
    const mode = MODES[activeModeKey];
    if (!mode || !mode.simulations?.length) return;

    const msg = mode.simulations[simCursor % mode.simulations.length];
    simCursor += 1;

    try { playClick(); } catch (_) {}
    bounceVel = 1.0;
    scalePulse = 0.07;
    nodImpulse = 0.72;

    if (bubbleTextEl && !isLoved) {
      bubbleTextEl.textContent = msg;
    }
  }

  function triggerLove() {
    isLoved = true;
    bounceVel = 1.35;
    scalePulse = 0.1;
    nodImpulse = 0.42;

    try { playIgnite(); } catch (_) {}
    if (bubbleTextEl) {
      bubbleTextEl.textContent = MODES[activeModeKey].loveBubble;
    }
    stage.classList.add('is-loved');

    clearTimeout(loveTimer);
    loveTimer = setTimeout(() => {
      isLoved = false;
      stage.classList.remove('is-loved');
      if (bubbleTextEl) {
        bubbleTextEl.textContent = MODES[activeModeKey].bubble;
      }
    }, 2400);
  }

  modeBtns.forEach((btn) => {
    btn.addEventListener('click', () => setMode(btn.dataset.robotMode, true));
    btn.addEventListener('mouseenter', () => {
      try { playHover(); } catch (_) {}
    });
  });

  miniFaceBtn?.addEventListener('click', triggerLove);
  simulateBtn?.addEventListener('click', triggerSimulation);

  const onCanvasPointerDown = (e) => {
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    ndcPoint.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    ndcPoint.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

    raycaster.setFromCamera(ndcPoint, camera);
    const hits = raycaster.intersectObjects(hitMeshes, false);

    if (hits.length > 0 || (Math.abs(ndcPoint.x) < 0.48 && Math.abs(ndcPoint.y) < 0.75)) {
      triggerLove();
    }
  };
  canvas.addEventListener('pointerdown', onCanvasPointerDown);

  const onWindowPointerMove = (e) => {
    if (!isVisible || document.hidden) return;
    const vw = window.innerWidth || 1;
    const vh = window.innerHeight || 1;
    pointerX = clamp((e.clientX / vw) * 2 - 1, -1, 1);
    pointerY = clamp(-((e.clientY / vh) * 2 - 1), -1, 1);
    lastPointerTime = performance.now();
  };

  if (!isTouch && !prefersReduced) {
    window.addEventListener('pointermove', onWindowPointerMove, { passive: true });
  }

  // =========================================================================
  // 4. LOOP 60/120FPS COM PAUSA REAL FORA DA VIEWPORT, ABA OCULTA E PORTAL
  // =========================================================================
  let rafId = null;
  let isVisible = false;
  let cardAwake = prefersReduced || section?.dataset.robotAwake === 'true';
  let elapsed = 0;
  let lastNow = performance.now();

  const BLINK_CYCLE = 3.0;
  const BLINK_DUR = 0.34;

  function renderOnce() {
    renderer.render(scene, camera);
  }

  function animate(now) {
    if (disposed || !isVisible || !cardAwake || document.hidden) {
      rafId = null;
      return;
    }

    const dt = clamp((now - lastNow) / 1000, 0.001, 0.05);
    lastNow = now;
    elapsed += dt;

    const pointerActive = !isTouch && now - lastPointerTime < 5000 && lastPointerTime > 0;
    const tx = pointerActive ? pointerX : Math.sin(elapsed * 0.75) * 0.42;
    const ty = pointerActive ? pointerY : Math.cos(elapsed * 0.52) * 0.2;

    bounceVel += (-bounceOffset * 135 - bounceVel * 13) * dt;
    bounceOffset = clamp(bounceOffset + bounceVel * dt, -0.08, 0.22);
    if (Math.abs(bounceOffset) < 0.0004 && Math.abs(bounceVel) < 0.0004) {
      bounceOffset = 0;
      bounceVel = 0;
    }

    const expDecay = (rate) => 1 - Math.exp(-rate * dt);

    scalePulse = THREE.MathUtils.lerp(scalePulse, 0, expDecay(10));
    nodImpulse = THREE.MathUtils.lerp(nodImpulse, 0, expDecay(6.5));

    const floatY = prefersReduced ? 0 : Math.sin(elapsed * 2.1) * 0.025;
    bodyGroup.position.y = -0.28 + floatY + bounceOffset;

    const sY = 1 + scalePulse;
    const sXZ = 1 - scalePulse * 0.45;
    bodyGroup.scale.set(sXZ, sY, sXZ);

    const maxMoveX = width < 768 ? 0.24 : 0.56;
    const targetPosX = tx * maxMoveX;
    bodyGroup.position.x = THREE.MathUtils.lerp(bodyGroup.position.x, targetPosX, expDecay(1.7));
    shadowPlane.position.x = bodyGroup.position.x;

    const shadowScale = clamp(1 - bounceOffset * 1.4, 0.75, 1.08);
    shadowPlane.scale.setScalar(shadowScale);

    const relX = clamp(tx - bodyGroup.position.x * 0.4, -1.1, 1.1);
    const bodyRotSpeed = expDecay(8.5);
    bodyGroup.rotation.y = THREE.MathUtils.lerp(bodyGroup.rotation.y, -relX * 0.55, bodyRotSpeed);
    bodyGroup.rotation.x = THREE.MathUtils.lerp(bodyGroup.rotation.x, -ty * 0.16, bodyRotSpeed);
    bodyGroup.rotation.z = THREE.MathUtils.lerp(bodyGroup.rotation.z, -relX * 0.13, bodyRotSpeed);

    const headRotSpeed = expDecay(15);
    const targetHeadY = clamp(relX * 1.12 + Math.sin(elapsed * 15) * nodImpulse * 0.28, -1.15, 1.15);
    const targetHeadX = clamp(-ty * 0.32 - nodImpulse * 0.18, -0.42, 0.42);
    headGroup.rotation.y = THREE.MathUtils.lerp(headGroup.rotation.y, targetHeadY, headRotSpeed);
    headGroup.rotation.x = THREE.MathUtils.lerp(headGroup.rotation.x, targetHeadX, headRotSpeed);

    const colorLerp = expDecay(6);
    glassUniforms.color.value.lerp(targetGlassColor, colorLerp);
    rimLight.color.lerp(targetRimColor, colorLerp);
    bottomBounce.color.lerp(targetRimColor, colorLerp);

    const desiredIntensity = isLoved ? 1.7 : targetGlassIntensity + nodImpulse * 0.45;
    glassUniforms.intensity.value = THREE.MathUtils.lerp(
      glassUniforms.intensity.value,
      desiredIntensity,
      expDecay(7)
    );

    const cycle = elapsed % BLINK_CYCLE;
    let scaleY = 1;
    if (!isLoved && cycle < BLINK_DUR) {
      const p = cycle / BLINK_DUR;
      scaleY = Math.max(0.06, 1 - Math.sin(p * Math.PI));
    }

    const eyeScale = isLoved ? 1.18 + Math.sin(elapsed * 12) * 0.08 : 1.14;
    leftEye.normalGroup.visible = !isLoved;
    leftEye.heartMesh.visible = isLoved;
    leftEye.group.scale.set(eyeScale, eyeScale * scaleY, eyeScale);

    rightEye.normalGroup.visible = !isLoved;
    rightEye.heartMesh.visible = isLoved;
    rightEye.group.scale.set(eyeScale, eyeScale * scaleY, eyeScale);

    renderer.render(scene, camera);
    rafId = requestAnimationFrame(animate);
  }

  function startLoop() {
    if (!disposed && !rafId && isVisible && cardAwake && !document.hidden) {
      lastNow = performance.now();
      rafId = requestAnimationFrame(animate);
    }
  }

  function stopLoop() {
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  // Acorda o loop WebGL somente quando o card físico entra em cena (zero disputa de GPU no scroll!)
  const onCardState = (e) => {
    cardAwake = Boolean(e?.detail?.active);
    if (cardAwake && isVisible) {
      syncSize();
      startLoop();
    } else if (!cardAwake) {
      stopLoop();
    }
  };
  window.addEventListener('vl:automacao-card-state', onCardState);

  const intersectionObserver = new IntersectionObserver(
    ([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible && cardAwake) {
        syncSize();
        startLoop();
      } else if (!isVisible) {
        stopLoop();
      }
    },
    { rootMargin: '120px', threshold: 0.01 }
  );
  intersectionObserver.observe(section || stage);

  const onVisibilityChange = () => {
    if (document.hidden) stopLoop();
    else startLoop();
  };
  document.addEventListener('visibilitychange', onVisibilityChange);

  function syncSize() {
    const nextW = Math.max(1, Math.round(canvasWrap.clientWidth));
    const nextH = Math.max(1, Math.round(canvasWrap.clientHeight));
    if (nextW === width && nextH === height) return;
    width = nextW;
    height = nextH;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setSize(width, height, false);
    updateResponsiveScale();
    if (!rafId) renderOnce();
  }

  let resizeTimer = null;
  const onResize = () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(syncSize, 80);
  };

  let resizeObserver = null;
  if ('ResizeObserver' in window) {
    resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(canvasWrap);
  }
  window.addEventListener('resize', onResize, { passive: true });

  setMode('instagram', false);
  syncSize();
  renderOnce();

  return {
    setMode,
    triggerLove,
    triggerSimulation,
    destroy() {
      disposed = true;
      stopLoop();
      clearTimeout(loveTimer);
      clearTimeout(resizeTimer);
      intersectionObserver.disconnect();
      resizeObserver?.disconnect();
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onWindowPointerMove);
      window.removeEventListener('vl:automacao-card-state', onCardState);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      canvas.removeEventListener('pointerdown', onCanvasPointerDown);

      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
          mats.forEach((m) => m.dispose());
        }
      });
      if (generatedMaps) {
        generatedMaps.colorMap.dispose();
        generatedMaps.bumpMap.dispose();
      }
      shadowTex.dispose();
      envRT.dispose();
      renderer.dispose();
    },
  };
}
