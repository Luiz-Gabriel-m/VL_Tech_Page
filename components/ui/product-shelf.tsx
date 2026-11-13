'use client';

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'motion/react';
import {
  Sparkles,
  Layers,
  Cpu,
  Clock,
  ShieldCheck,
  Check,
  Plus,
  Trash2,
  ExternalLink,
  RotateCcw,
  Sliders,
  ChevronRight,
  ShoppingCart,
  X,
  Code2,
  Zap,
  Activity,
  Bot,
  Globe2,
  Server,
  Workflow,
  ArrowUpRight,
  MessageSquare
} from 'lucide-react';

/* ==========================================================================
   TYPES & DATA CONTRACTS
   ========================================================================== */

export type ServiceKind = 'bottle' | 'pump' | 'jar' | 'tube' | 'stick' | 'perfume' | 'dropper' | 'lip';

export interface VLTechMetric {
  label: string;
  value: string;
  subtext?: string;
}

export interface VLTechSpecs {
  sla: string;
  deliveryTime: string;
  deployment: string;
  architecture: string;
  stackTier: string;
}

export interface VLTechService {
  id: string;
  kind: ServiceKind;
  code: string;
  badge: string;
  title: string;
  category: string;
  tagline: string;
  description: string;
  fullOverview: string;
  deliverables: string[];
  techStack: string[];
  metrics: VLTechMetric[];
  specs: VLTechSpecs;
  investment: {
    startingAt: string;
    tier: string;
    period?: string;
  };
  accentColor: string;
  glowColor: string;
  features: { title: string; desc: string }[];
}

/* ==========================================================================
   DEFAULT PRODUCTS: VL TECH ENTERPRISE SOFTWARE SUITE
   ========================================================================== */

export const DEFAULT_PRODUCTS: VLTechService[] = [
  {
    id: 'webgl-immersive-site',
    kind: 'perfume',
    code: 'VL-3D-EXP',
    badge: '01 · Flagship WebGL · Awwwards Tier',
    title: 'Site 3D / WebGL Imersivo',
    category: 'Imersão Web & 3D',
    tagline: 'Experiências visuais interativas em 60 FPS com Three.js e shaders personalizados.',
    description:
      'Transforme a presença digital da sua marca em um espetáculo cinematográfico tridimensional, com física interativa e scrollytelling de alta conversão.',
    fullOverview:
      'Projetado para marcas que recusam o padrão convencional. Desenvolvemos interfaces com WebGL, Three.js, shaders GLSL de iluminação volumétrica e animações GSAP de precisão milimétrica. Otimizado para bater 100/100 no Google Lighthouse com carregamento progressivo e assets comprimidos via DRACO.',
    deliverables: [
      'Modelagem e otimização de malhas 3D (glTF/GLB com DRACO & Meshopt)',
      'Shaders GLSL customizados para reflexão metálica, refração e pós-processamento bloom',
      'Micro-interações de física, cursor magnético e scrollytelling com GSAP ScrollTrigger',
      'Integração com headless CMS (Sanity / Strapi) e suporte multi-idiomas',
      'Otimização Core Web Vitals (< 0.8s LCP, 0 CLS, 60 FPS fixos no mobile e desktop)',
    ],
    techStack: ['Three.js', 'WebGL 2.0', 'GLSL Shaders', 'GSAP 3', 'React / Next.js', 'Tailwind CSS'],
    metrics: [
      { label: 'Tempo Médio na Página', value: '+340%', subtext: 'Retenção recorde' },
      { label: 'Taxa de Retenção', value: '88.4%', subtext: 'Engajamento contínuo' },
      { label: 'Performance 60 FPS', value: '100%', subtext: 'Zero engasgos' },
    ],
    specs: {
      sla: '99.98% Uptime',
      deliveryTime: '15 a 25 dias úteis',
      deployment: 'Vercel Edge Network / Cloudflare Global CDN',
      architecture: 'Headless Next.js App Router + GLSL Canvas',
      stackTier: 'Enterprise Visual FX',
    },
    investment: {
      startingAt: 'R$ 8.900',
      tier: 'High-End Brand Experience',
    },
    accentColor: '#ff2a2a',
    glowColor: 'rgba(255, 42, 42, 0.45)',
    features: [
      { title: 'Controle de Câmera 3D', desc: 'Órbita cinemática com damping suave e rotação dinâmica.' },
      { title: 'Pipeline Otimizado', desc: 'Carregamento assíncrono de texturas sem travar a thread principal.' },
      { title: 'Fidelidade Gráfica', desc: 'Iluminação HDR baseada em física (PBR) com sombras realistas.' },
    ],
  },
  {
    id: 'intelligent-automation',
    kind: 'pump',
    code: 'VL-AUTO-AI',
    badge: '02 · Zero Manual Work · High Throughput',
    title: 'Automação Inteligente',
    category: 'Engenharia de Processos & Agentes',
    tagline: 'Elimine 90% do trabalho repetitivo com pipelines orquestrados e agentes autônomos.',
    description:
      'Conectamos seu ERP, CRM, planilhas e gateways de pagamento com fluxos n8n, Python e micro-agentes de IA que processam dados, emitem documentos e tomam decisões sem intervenção humana.',
    fullOverview:
      'Desenvolvemos uma camada de automação robusta capaz de lidar com milhares de eventos por minuto com tolerância a falhas. Desde a captura do lead até o faturamento e emissão de notas fiscais, seus processos operam com precisão matemática 24/7 sem erros humanos.',
    deliverables: [
      'Mapeamento arquitetural de gargalos e blueprint operacional completo',
      'Fluxos automatizados de alta resiliência via n8n / Temporal / Python',
      'Agentes de IA para triagem de e-mails, orçamentos e contratos',
      'Sincronização bidirecional entre CRM (HubSpot, RD Station) e ERPs',
      'Painel de telemetria em tempo real com alertas via Telegram/Slack e reprocessamento automático',
    ],
    techStack: ['Python', 'n8n Enterprise', 'FastAPI', 'OpenAI Agents', 'Redis Queue', 'PostgreSQL'],
    metrics: [
      { label: 'Horas Manuais Poupadas', value: '180h+', subtext: 'Por mês por equipe' },
      { label: 'Redução de Erro Humano', value: '-99.2%', subtext: 'Execução auditada' },
      { label: 'Retorno sobre Investimento', value: '4.8x ROI', subtext: 'Em menos de 90 dias' },
    ],
    specs: {
      sla: '99.99% Execution Reliability',
      deliveryTime: '7 a 14 dias úteis',
      deployment: 'Docker Swarm / AWS Lambda Dedicated',
      architecture: 'Event-Driven Webhook Pipeline',
      stackTier: 'Enterprise AI & Automation',
    },
    investment: {
      startingAt: 'R$ 4.200',
      tier: 'Scale & Operations',
    },
    accentColor: '#ff3b3b',
    glowColor: 'rgba(255, 59, 59, 0.4)',
    features: [
      { title: 'Self-Healing Retry', desc: 'Tentativas automáticas em caso de instabilidade de APIs terceiras.' },
      { title: 'Auditoria Criptografada', desc: 'Logs detalhados de cada execução com garantia de privacidade.' },
      { title: 'Gatilhos Instantâneos', desc: 'Acionamento por Webhook com tempo de resposta inferior a 80ms.' },
    ],
  },
  {
    id: 'ai-automated-support-247',
    kind: 'jar',
    code: 'VL-BOT-247',
    badge: '03 · WhatsApp Cloud API · Context RAG',
    title: 'Atendimento Automático 24/7',
    category: 'IA Conversacional & Vendas',
    tagline: 'Agente de IA humanizado que qualifica leads, agenda reuniões e fecha vendas no WhatsApp.',
    description:
      'Um assistente virtual alimentado por Retrieval-Augmented Generation (RAG) treinado com todo o acervo técnico e comercial da sua empresa, respondendo em linguagem natural e fluida.',
    fullOverview:
      'Integrado diretamente à API Oficial do WhatsApp (Meta Cloud API). O bot compreende áudios de clientes, envia PDFs, calcula orçamentos em tempo real, consulta estoque e transfere para atendentes humanos apenas quando estrategicamente necessário, com resumo completo da conversa.',
    deliverables: [
      'Configuração e verificação oficial Meta Business WhatsApp Cloud API',
      'Base de conhecimento vetorial (RAG) com Pinecone e embeddings OpenAI',
      'Transcrição de áudio e respostas contextuais ultra-humanizadas',
      'Integração direta com Google Agenda / Calendly para agendamentos de reuniões',
      'Painel administrativo multiatendente para intervenção humana instantânea',
    ],
    techStack: ['OpenAI GPT-4o', 'Meta Cloud API', 'LangChain', 'Typebot', 'Pinecone Vector', 'Node.js'],
    metrics: [
      { label: 'Tempo de Primeira Resposta', value: '< 2s', subtext: 'Instantâneo 24/7' },
      { label: 'Leads Qualificados Noturnos', value: '+62%', subtext: 'Sem perda de oportunidades' },
      { label: 'Taxa de Conversão Direta', value: '31.5%', subtext: 'Conversão ativa' },
    ],
    specs: {
      sla: '99.95% Message Delivery',
      deliveryTime: '5 a 10 dias úteis',
      deployment: 'Meta Cloud API + Node.js Microservice',
      architecture: 'Vector RAG + Hybrid Handover Engine',
      stackTier: 'Enterprise Conversational AI',
    },
    investment: {
      startingAt: 'R$ 3.800',
      tier: 'Sales & Growth AI',
    },
    accentColor: '#ff2a2a',
    glowColor: 'rgba(255, 42, 42, 0.45)',
    features: [
      { title: 'Compreensão de Áudio', desc: 'Processamento de mensagens de voz com transcrição Whisper.' },
      { title: 'Zero Bloqueios', desc: 'Arquitetura 100% aderente às diretrizes oficiais da Meta.' },
      { title: 'Handover Fluido', desc: 'Transição suave para atendimento humano com histórico e tags.' },
    ],
  },
  {
    id: 'high-conversion-landing-page',
    kind: 'stick',
    code: 'VL-LP-HIGH',
    badge: '04 · Ultra-Fast 0.4s · CRO Engineered',
    title: 'Landing Page de Alta Conversão',
    category: 'Direct Response & Growth UI',
    tagline: 'Estrutura visual brutalista com copywriting persuasivo desenhado para maximizar tráfego pago.',
    description:
      'Esqueça páginas genéricas em construtores pesados. Criamos LPs em código nativo de altíssimo nível com tracking avançado de Meta Pixel/GA4 via Server-Side e taxas de conversão acima de 25%.',
    fullOverview:
      'Projetada após análise minuciosa de mapas de calor, psicologia comportamental e tempo de carregamento instantâneo no 4G/5G mobile. Integração com formulários de qualificação, WhatsApp flutuante inteligente e checkout seguro para escala em tráfego pago.',
    deliverables: [
      'Direção de arte editorial personalizada com a identidade visual da sua marca',
      'Copywriting de resposta direta focado em quebra de objeções e persuasão',
      'Rastreamento Server-Side de Conversões (Meta CAPI + Google Tag Manager)',
      'Mobile-First com LCP inferior a 0.6s e nota 98+ no Google PageSpeed',
      'Configuração de Testes A/B nativos com medição de conversão em tempo real',
    ],
    techStack: ['Next.js 15', 'Tailwind CSS', 'Motion', 'Meta Conversions API', 'Vercel Edge', 'TypeScript'],
    metrics: [
      { label: 'Taxa Média de Conversão', value: '26.8%', subtext: 'Benchmarking auditado' },
      { label: 'PageSpeed Mobile', value: '98/100', subtext: 'Score máximo Google' },
      { label: 'Custo por Lead (CPL)', value: '-42%', subtext: 'Eficiência de tráfego' },
    ],
    specs: {
      sla: '100% Core Web Vitals Pass',
      deliveryTime: '3 a 7 dias úteis',
      deployment: 'Vercel Edge Global CDN',
      architecture: 'Server-Side Rendered Next.js + Edge Cache',
      stackTier: 'High-Impact Direct Response',
    },
    investment: {
      startingAt: 'R$ 2.900',
      tier: 'Growth & Ads Scale',
    },
    accentColor: '#ff4444',
    glowColor: 'rgba(255, 68, 68, 0.4)',
    features: [
      { title: 'Server-Side Tracking', desc: '100% de mensuração sem perda por bloqueadores de anúncios.' },
      { title: 'Mobile-First Extremo', desc: 'Componentes calibrados para toque e velocidade na mão do usuário.' },
      { title: 'SEO Técnico Incluso', desc: 'Metadados semânticos, Open Graph dinâmico e schema markup JSON-LD.' },
    ],
  },
  {
    id: 'dedicated-squad-cto-service',
    kind: 'bottle',
    code: 'VL-SQUAD-CTO',
    badge: '05 · Executive Engineering · Full Leadership',
    title: 'Squad Dedicado & CTO as a Service',
    category: 'Liderança Técnica & Squads Ágeis',
    tagline: 'Engenheiros seniores e liderança estratégica guiando seu roadmap tecnológico e execução.',
    description:
      'Tenha o calibre técnico dos co-fundadores Luiz Gabriel e Victor Whohlers liderando sua infraestrutura, recrutamento técnico, arquitetura de sistemas e entrega contínua com sprints semanais.',
    fullOverview:
      'Substitua contratações lentas e custos astronômicos de CLT por um squad de elite que entra operando no primeiro dia. Governança, code reviews rigorosos, segurança da informação e aceleração real de produto para startups e médias empresas em expansão.',
    deliverables: [
      'Alinhamento semanal de roadmap estratégico com diretoria e stakeholders',
      'Squad multidisciplinar (Front-end sênior, Back-end sênior, Arquiteto Cloud)',
      'Auditoria contínua de código, segurança, dependências e performance',
      'Sprints ágeis semanais com demos em vídeo e entregas contínuas',
      'Estruturação de CI/CD automatizado com testes de regressão e deploy sem downtime',
    ],
    techStack: ['TypeScript', 'Node.js', 'Go', 'Kubernetes', 'AWS', 'GitHub Actions', 'PostgreSQL'],
    metrics: [
      { label: 'Velocidade de Entrega', value: '3.2x', subtext: 'Ciclos rápidos de sprint' },
      { label: 'Redução de Custos CLT', value: '-60%', subtext: 'Sem passivos trabalhistas' },
      { label: 'Dívida Técnica Zerada', value: '100%', subtext: 'Código limpo e auditado' },
    ],
    specs: {
      sla: 'Resposta em < 30min em horário comercial',
      deliveryTime: 'Início Imediato / Onboarding 48h',
      deployment: 'Sprints Semanais em GitHub / Linear / Jira',
      architecture: 'Microservices & Enterprise Clean Architecture',
      stackTier: 'Executive Engineering Suite',
    },
    investment: {
      startingAt: 'R$ 9.800',
      tier: 'Executive Enterprise Tier',
      period: '/mês',
    },
    accentColor: '#ff2a2a',
    glowColor: 'rgba(255, 42, 42, 0.5)',
    features: [
      { title: 'Code Review Rigoroso', desc: 'Aprovação manual de cada pull request antes de ir para produção.' },
      { title: 'Mentoria & Treinamento', desc: 'Capacitação da sua equipe interna em padrões globais de engenharia.' },
      { title: 'Segurança & LGPD', desc: 'Políticas rigorosas de controle de acesso e auditoria de vulnerabilidades.' },
    ],
  },
  {
    id: 'cloud-infrastructure-apis',
    kind: 'dropper',
    code: 'VL-CLOUD-API',
    badge: '06 · Multi-Cloud · High Availability',
    title: 'Infraestrutura Cloud & APIs',
    category: 'DevOps, Kubernetes & Back-end',
    tagline: 'Back-end elástico, microsserviços distribuídos e bancos de dados projetados para zero downtime.',
    description:
      'Projetamos e gerenciamos arquiteturas seguras em AWS, GCP ou Hetzner com Docker, Kubernetes, isolamento de ambientes e proteção avançada contra ataques DDoS e injeções.',
    fullOverview:
      'Sua aplicação pronta para suportar picos de tráfego de milhões de acessos sem engasgos. Implementação de caching distribuído com Redis, bancos relacionais PostgreSQL particionados e pipelines CI/CD com rollback automatizado.',
    deliverables: [
      'Arquitetura Infrastructure as Code (Terraform / Pulumi) versionada em Git',
      'Cluster Kubernetes (EKS / GKE) com auto-scaling horizontal de pods (HPA)',
      'Desenvolvimento de APIs RESTful e GraphQL de ultra-baixa latência',
      'Cache de alta velocidade com Redis e indexação rápida de consultas complexas',
      'Configuração de monitoramento Datadog / Grafana com alertas proativos 24/7',
    ],
    techStack: ['AWS / GCP', 'Docker', 'Kubernetes', 'Terraform', 'PostgreSQL', 'Redis', 'Node / Go'],
    metrics: [
      { label: 'Uptime Garantido', value: '99.99%', subtext: 'Alta disponibilidade' },
      { label: 'Latência de API (p95)', value: '< 18ms', subtext: 'Respostas ultrarrápidas' },
      { label: 'Throughput por Nó', value: '45k req/s', subtext: 'Escalabilidade elástica' },
    ],
    specs: {
      sla: '99.99% Availability SLA',
      deliveryTime: '10 a 20 dias úteis',
      deployment: 'AWS Multi-AZ / Google Cloud Kubernetes Engine',
      architecture: 'Event-Driven Distributed Microservices',
      stackTier: 'Mission-Critical Cloud Suite',
    },
    investment: {
      startingAt: 'R$ 6.500',
      tier: 'Enterprise Cloud Infra',
    },
    accentColor: '#ff3030',
    glowColor: 'rgba(255, 48, 48, 0.45)',
    features: [
      { title: 'Zero Downtime Deploys', desc: 'Estratégias Blue/Green e Canary com rollback instantâneo.' },
      { title: 'Defesa Criptográfica', desc: 'Isolamento de VPC, firewalls WAF e criptografia AES-256 em repouso.' },
      { title: 'Backups Georredundantes', desc: 'Snapshots síncronos com recuperação point-in-time testada.' },
    ],
  },
];

/* ==========================================================================
   PROCEDURAL 3D CYBERNETIC VISUALIZERS (KIND-BASED)
   Rendered with SVG geometric meshes, laser pulse nodes, and 3D lighting.
   ========================================================================== */

interface Cyber3DVisualProps {
  kind: ServiceKind;
  isHovered?: boolean;
  isActive?: boolean;
  dragRotateX?: number;
  dragRotateY?: number;
}

export function Cyber3DVisual({
  kind,
  isHovered = false,
  isActive = false,
  dragRotateX = 0,
  dragRotateY = 0,
}: Cyber3DVisualProps) {
  // Lighting shift based on 3D rotation
  const lightShiftX = dragRotateY * 1.5;
  const lightShiftY = -dragRotateX * 1.5;

  return (
    <div className="relative w-full h-full flex items-center justify-center pointer-events-none select-none">
      {/* Background cybernetic grid lines & glowing radial aura */}
      <div
        className="absolute inset-0 transition-opacity duration-700 pointer-events-none"
        style={{
          background: `radial-gradient(circle at calc(50% + ${lightShiftX}px) calc(50% + ${lightShiftY}px), rgba(255, 42, 42, 0.22) 0%, rgba(255, 42, 42, 0.04) 45%, transparent 70%)`,
        }}
      />

      {/* Floating orbital rings */}
      <div
        className={`absolute w-48 h-48 rounded-full border border-red-500/20 transition-all duration-700 ${
          isActive ? 'scale-110 border-red-500/40 animate-[spin_24s_linear_infinite]' : 'border-red-500/15'
        }`}
        style={{
          boxShadow: isActive ? '0 0 35px rgba(255, 42, 42, 0.15)' : 'none',
          transform: `rotateX(65deg) rotateZ(${dragRotateY * 0.8}deg)`,
        }}
      />
      <div
        className="absolute w-60 h-60 rounded-full border border-dashed border-white/10 transition-transform duration-500"
        style={{
          transform: `rotateX(72deg) rotateZ(${-dragRotateY * 0.6}deg)`,
        }}
      />

      {/* KIND-SPECIFIC PROCEDURAL GEOMETRIES */}
      <svg
        viewBox="0 0 240 280"
        className="w-48 h-56 md:w-56 md:h-64 drop-shadow-[0_15px_35px_rgba(0,0,0,0.85)] filter transition-transform duration-300"
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="bodyDark" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#252528" />
            <stop offset="50%" stopColor="#141416" />
            <stop offset="100%" stopColor="#0a0a0c" />
          </linearGradient>

          <linearGradient id="redLaser" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ff2a2a" />
            <stop offset="50%" stopColor="#ff6b6b" />
            <stop offset="100%" stopColor="#ff2a2a" />
          </linearGradient>

          <linearGradient id="metallicSheen" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
            <stop offset="45%" stopColor="#ffffff" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.8" />
          </linearGradient>

          <filter id="neonGlowRed" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="laserBeamGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 1. PERFUME / BOTTLE: SITE 3D / WEBGL MONOLITH */}
        {(kind === 'perfume' || kind === 'bottle') && (
          <g transform={`translate(${lightShiftX * 0.1}, ${lightShiftY * 0.1})`}>
            {/* Top Nozzle / Quantum Emitter */}
            <rect x="105" y="24" width="30" height="18" rx="3" fill="url(#bodyDark)" stroke="#ff2a2a" strokeWidth="1.2" />
            <circle cx="120" cy="20" r="4" fill="#ff2a2a" filter="url(#laserBeamGlow)" />
            <line x1="120" y1="12" x2="120" y2="4" stroke="#ff2a2a" strokeWidth="2" strokeDasharray="2 2" />

            {/* Neck Collar */}
            <polygon points="100,42 140,42 148,60 92,60" fill="#1b1b1e" stroke="#ffffff" strokeOpacity="0.2" strokeWidth="1" />
            <line x1="96" y1="51" x2="144" y2="51" stroke="#ff2a2a" strokeWidth="1.5" />

            {/* Main Faceted Monolith Body */}
            <polygon points="68,60 172,60 188,230 52,230" fill="url(#bodyDark)" stroke="#ffffff" strokeOpacity="0.18" strokeWidth="1.5" />
            {/* Specular Front Chamfer */}
            <polygon points="85,60 155,60 166,225 74,225" fill="url(#metallicSheen)" />

            {/* Glowing Internal Core Chamber */}
            <rect
              x="96"
              y="85"
              width="48"
              height="115"
              rx="4"
              fill="#08080a"
              stroke="#ff2a2a"
              strokeWidth="1.5"
              filter="url(#neonGlowRed)"
            />
            {/* Pulsing Core Laser Lines */}
            <line x1="120" y1="92" x2="120" y2="192" stroke="#ff6b6b" strokeWidth="2.5" />
            <circle cx="120" cy="142" r="9" fill="#ff2a2a" filter="url(#laserBeamGlow)" />
            <circle cx="120" cy="142" r="4" fill="#ffffff" />

            {/* Telemetry Grid Overlay */}
            <line x1="102" y1="110" x2="138" y2="110" stroke="#ff2a2a" strokeWidth="1" strokeOpacity="0.6" />
            <line x1="102" y1="142" x2="138" y2="142" stroke="#ff2a2a" strokeWidth="1" strokeOpacity="0.6" />
            <line x1="102" y1="174" x2="138" y2="174" stroke="#ff2a2a" strokeWidth="1" strokeOpacity="0.6" />

            {/* Base Pedestal */}
            <polygon points="46,230 194,230 186,246 54,246" fill="#141416" stroke="#ff2a2a" strokeWidth="1" />
            <line x1="60" y1="238" x2="180" y2="238" stroke="#ff2a2a" strokeWidth="2" filter="url(#laserBeamGlow)" />
          </g>
        )}

        {/* 2. PUMP: AUTOMAÇÃO INTELIGENTE ACTUATOR */}
        {kind === 'pump' && (
          <g transform={`translate(${lightShiftX * 0.1}, ${lightShiftY * 0.1})`}>
            {/* High-Pressure Plunger Head */}
            <path
              d="M75,30 L165,30 L160,50 L135,50 L135,70 L105,70 L105,50 L80,50 Z"
              fill="url(#bodyDark)"
              stroke="#ff2a2a"
              strokeWidth="1.5"
            />
            <line x1="65" y1="38" x2="105" y2="38" stroke="#ff2a2a" strokeWidth="2.5" filter="url(#laserBeamGlow)" />

            {/* Compression Spring Shaft */}
            <line x1="120" y1="70" x2="120" y2="105" stroke="#ffffff" strokeWidth="4" strokeOpacity="0.5" />
            <circle cx="120" cy="88" r="16" fill="none" stroke="#ff2a2a" strokeWidth="2" strokeDasharray="6 4" />

            {/* Main Automation Reservoir Body */}
            <rect x="65" y="105" width="110" height="125" rx="14" fill="url(#bodyDark)" stroke="#ffffff" strokeOpacity="0.2" strokeWidth="1.5" />
            <rect x="75" y="115" width="90" height="105" rx="8" fill="url(#metallicSheen)" />

            {/* Transparent Data Pipeline Tube */}
            <rect x="100" y="120" width="40" height="95" rx="6" fill="#09090b" stroke="#ff2a2a" strokeWidth="1.5" />
            {/* Flow Indicators / Energy Nodes */}
            <circle cx="120" cy="138" r="6" fill="#ff2a2a" filter="url(#laserBeamGlow)" />
            <circle cx="120" cy="168" r="6" fill="#ff6b6b" filter="url(#laserBeamGlow)" />
            <circle cx="120" cy="198" r="6" fill="#ff2a2a" filter="url(#laserBeamGlow)" />

            {/* Data In / Out Conduit Ports */}
            <circle cx="58" cy="168" r="6" fill="#141416" stroke="#ff2a2a" strokeWidth="1.5" />
            <line x1="64" y1="168" x2="100" y2="168" stroke="#ff2a2a" strokeWidth="2" strokeDasharray="3 2" />
            <circle cx="182" cy="168" r="6" fill="#141416" stroke="#ff2a2a" strokeWidth="1.5" />
            <line x1="140" y1="168" x2="176" y2="168" stroke="#ff2a2a" strokeWidth="2" strokeDasharray="3 2" />

            {/* Base Mount Plate */}
            <rect x="55" y="230" width="130" height="16" rx="4" fill="#18181b" stroke="#ff2a2a" strokeWidth="1" />
            <line x1="70" y1="238" x2="170" y2="238" stroke="#ff2a2a" strokeWidth="2" filter="url(#laserBeamGlow)" />
          </g>
        )}

        {/* 3. JAR: ATENDIMENTO AUTOMÁTICO 24/7 NEURAL CORE */}
        {kind === 'jar' && (
          <g transform={`translate(${lightShiftX * 0.1}, ${lightShiftY * 0.1})`}>
            {/* Upper Hologram Halo Dome */}
            <ellipse cx="120" cy="46" rx="68" ry="18" fill="url(#bodyDark)" stroke="#ff2a2a" strokeWidth="1.5" />
            <ellipse cx="120" cy="46" rx="50" ry="12" fill="#ff2a2a" fillOpacity="0.25" filter="url(#laserBeamGlow)" />
            <circle cx="120" cy="46" r="5" fill="#ffffff" />

            {/* Cylindrical AI Acoustic Core Glass */}
            <path
              d="M52,46 L52,190 C52,216 188,216 188,190 L188,46 Z"
              fill="url(#bodyDark)"
              stroke="#ffffff"
              strokeOpacity="0.2"
              strokeWidth="1.5"
            />
            {/* Front Glass Reflections */}
            <path
              d="M66,54 L66,182 C72,204 168,204 174,182 L174,54 Z"
              fill="url(#metallicSheen)"
            />

            {/* Central Neural Sphere (Conversational AI Orb) */}
            <circle cx="120" cy="125" r="36" fill="#08080a" stroke="#ff2a2a" strokeWidth="2" filter="url(#neonGlowRed)" />
            <circle cx="120" cy="125" r="22" fill="#ff2a2a" fillOpacity="0.3" filter="url(#laserBeamGlow)" />
            <circle cx="120" cy="125" r="9" fill="#ffffff" />

            {/* Sound Wave Frequency Rings */}
            <path d="M96,125 Q120,95 144,125" fill="none" stroke="#ff2a2a" strokeWidth="2" strokeDasharray="3 3" />
            <path d="M96,125 Q120,155 144,125" fill="none" stroke="#ff2a2a" strokeWidth="2" strokeDasharray="3 3" />

            {/* Base Acoustic Dispersion Plate */}
            <ellipse cx="120" cy="195" rx="74" ry="20" fill="#141416" stroke="#ff2a2a" strokeWidth="1.5" />
            <line x1="60" y1="216" x2="180" y2="216" stroke="#ff2a2a" strokeWidth="2.5" filter="url(#laserBeamGlow)" />
          </g>
        )}

        {/* 4. STICK: LANDING PAGE DE ALTA CONVERSÃO BLADE */}
        {kind === 'stick' && (
          <g transform={`translate(${lightShiftX * 0.1}, ${lightShiftY * 0.1})`}>
            {/* Top Speed Tip */}
            <polygon points="120,15 152,48 88,48" fill="#ff2a2a" filter="url(#laserBeamGlow)" />
            <line x1="120" y1="8" x2="120" y2="40" stroke="#ffffff" strokeWidth="2" />

            {/* High-Velocity Blade Core */}
            <rect x="85" y="48" width="70" height="175" rx="6" fill="url(#bodyDark)" stroke="#ffffff" strokeOpacity="0.2" strokeWidth="1.5" />
            <rect x="94" y="56" width="52" height="158" rx="4" fill="url(#metallicSheen)" />

            {/* Vertical Laser Tracking Line */}
            <line x1="120" y1="50" x2="120" y2="218" stroke="#ff2a2a" strokeWidth="3" filter="url(#laserBeamGlow)" />

            {/* CRO Conversion Heat Ribs */}
            {[75, 105, 135, 165, 195].map((y, idx) => (
              <g key={idx}>
                <line x1="90" y1={y} x2="108" y2={y} stroke="#ff2a2a" strokeWidth="1.5" />
                <line x1="132" y1={y} x2="150" y2={y} stroke="#ff2a2a" strokeWidth="1.5" />
                <circle cx="120" cy={y} r="3" fill="#ffffff" />
              </g>
            ))}

            {/* Base Magnetic Connector */}
            <rect x="74" y="223" width="92" height="20" rx="4" fill="#141416" stroke="#ff2a2a" strokeWidth="1.5" />
            <line x1="82" y1="233" x2="158" y2="233" stroke="#ff2a2a" strokeWidth="2" filter="url(#laserBeamGlow)" />
          </g>
        )}

        {/* 5. DROPPER: CLOUD INFRASTRUCTURE & APIS POD */}
        {kind === 'dropper' && (
          <g transform={`translate(${lightShiftX * 0.1}, ${lightShiftY * 0.1})`}>
            {/* Top Quantum Bulb / Bulb Cap */}
            <ellipse cx="120" cy="38" rx="34" ry="22" fill="#ff2a2a" filter="url(#laserBeamGlow)" fillOpacity="0.85" />
            <circle cx="120" cy="32" r="8" fill="#ffffff" />

            {/* Collar Screw Ring */}
            <rect x="94" y="55" width="52" height="18" rx="3" fill="url(#bodyDark)" stroke="#ffffff" strokeOpacity="0.3" strokeWidth="1" />
            <line x1="96" y1="64" x2="144" y2="64" stroke="#ff2a2a" strokeWidth="2" />

            {/* Suspended Cylindrical Pipette / Quantum Chamber */}
            <polygon points="102,73 138,73 132,195 108,195" fill="url(#bodyDark)" stroke="#ffffff" strokeOpacity="0.2" strokeWidth="1.5" />
            <polygon points="106,75 134,75 130,190 110,190" fill="url(#metallicSheen)" />

            {/* Dropper Fine Emitter Tip */}
            <polygon points="112,195 128,195 122,230 118,230" fill="#ff2a2a" filter="url(#laserBeamGlow)" />
            {/* Suspended Quantum Drop */}
            <circle cx="120" cy="245" r="7" fill="#ff2a2a" filter="url(#laserBeamGlow)" />
            <circle cx="120" cy="245" r="3" fill="#ffffff" />

            {/* Internal Suspended Logic Matrix */}
            <line x1="120" y1="85" x2="120" y2="185" stroke="#ff2a2a" strokeWidth="2.5" />
            <circle cx="120" cy="115" r="5" fill="#ffffff" />
            <circle cx="120" cy="145" r="5" fill="#ffffff" />
            <circle cx="120" cy="175" r="5" fill="#ffffff" />
          </g>
        )}
      </svg>

      {/* Floating 3D Telemetry HUD Badges */}
      {isActive && (
        <>
          <div className="absolute top-4 left-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/80 border border-white/10 backdrop-blur-md text-[10px] font-mono text-zinc-300">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_#ff2a2a]" />
            <span>CORE: ONLINE</span>
          </div>

          <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/80 border border-white/10 backdrop-blur-md text-[10px] font-mono text-zinc-300">
            <Activity className="w-3 h-3 text-red-500" />
            <span>60.0 FPS</span>
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1 rounded-full bg-black/80 border border-red-500/30 backdrop-blur-md text-[10px] font-mono text-zinc-400">
            <RotateCcw className="w-3 h-3 text-red-400" />
            <span>ARRASTE PARA GIRAR EM 3D</span>
          </div>
        </>
      )}
    </div>
  );
}

/* ==========================================================================
   MAIN COMPONENT: PRODUCT SHELF FOR VL TECH SERVICES
   ========================================================================== */

export interface ProductShelfProps {
  products?: VLTechService[];
  initialSelectedId?: string;
  onSelectService?: (service: VLTechService) => void;
  onRequestQuote?: (selectedServices: VLTechService[]) => void;
}

export function ProductShelf({
  products = DEFAULT_PRODUCTS,
  initialSelectedId = DEFAULT_PRODUCTS[0]?.id,
  onSelectService,
  onRequestQuote,
}: ProductShelfProps) {
  // State
  const [activeServiceId, setActiveServiceId] = useState<string>(initialSelectedId);
  const [projectScope, setProjectScope] = useState<string[]>([]);
  const [isScopeModalOpen, setIsScopeModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [is3DDragging, setIs3DDragging] = useState(false);

  // Active service object
  const activeService = useMemo(() => {
    return products.find((p) => p.id === activeServiceId) || products[0];
  }, [products, activeServiceId]);

  // Categories list
  const categories = useMemo(() => {
    const list = Array.from(new Set(products.map((p) => p.category)));
    return ['all', ...list];
  }, [products]);

  // Filtered shelf products
  const filteredProducts = useMemo(() => {
    if (activeCategory === 'all') return products;
    return products.filter((p) => p.category === activeCategory);
  }, [products, activeCategory]);

  // 3D Tilt & Drag Motion Values
  const stageRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring physics for natural pendulum inertia
  const rotateX = useSpring(useTransform(mouseY, [-200, 200], [18, -18]), { stiffness: 180, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-200, 200], [-22, 22]), { stiffness: 180, damping: 20 });

  // Reset 3D position
  const handleResetTilt = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Pointer drag handler for 3D stage
  const handlePointerDown = (e: React.PointerEvent) => {
    setIs3DDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const offsetX = e.clientX - centerX;
    const offsetY = e.clientY - centerY;

    mouseX.set(Math.max(-200, Math.min(200, offsetX)));
    mouseY.set(Math.max(-200, Math.min(200, offsetY)));
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIs3DDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
  };

  // Toggle service in project scope
  const toggleProjectScope = (serviceId: string) => {
    setProjectScope((prev) => {
      const exists = prev.includes(serviceId);
      if (exists) {
        return prev.filter((id) => id !== serviceId);
      } else {
        return [...prev, serviceId];
      }
    });
  };

  const isInScope = (serviceId: string) => projectScope.includes(serviceId);

  // WhatsApp formatted quote message
  const handleSendWhatsAppQuote = () => {
    const selectedList = products.filter((p) => projectScope.includes(p.id));
    const targetServices = selectedList.length > 0 ? selectedList : [activeService];

    const messageLines = [
      'Olá equipe VL Tech! Gostaria de uma proposta comercial para o seguinte escopo de projeto:',
      '',
      ...targetServices.map((s, i) => `${i + 1}. *${s.title}* (${s.code}) - Tier: ${s.investment.tier}`),
      '',
      'Aguardo retorno para alinharmos os requisitos técnicos e cronograma!',
    ];

    const encoded = encodeURIComponent(messageLines.join('\n'));
    window.open(`https://wa.me/5519999999999?text=${encoded}`, '_blank');
  };

  return (
    <section className="relative w-full min-h-screen bg-[#111112] text-zinc-100 py-16 px-4 sm:px-6 lg:px-8 font-sans selection:bg-red-600 selection:text-white overflow-hidden">
      {/* Background Ambience & Cyber Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(255,42,42,0.15),rgba(255,255,255,0))]" />
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative max-w-7xl mx-auto space-y-10">
        {/* ====================================================================
            HEADER BAR & PROJECT CART COUNTER
            ==================================================================== */}
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-medium tracking-wide bg-red-950/60 text-red-400 border border-red-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse mr-1.5 shadow-[0_0_8px_#ff2a2a]" />
                VL TECH DIGITAL SHELF 2026
              </span>
              <span className="text-zinc-500 text-xs font-mono">// ARQUITETURA & SOFTWARE</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white uppercase font-sans">
              Catálogo de <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-red-500">Serviços & Soluções</span>
            </h1>
          </div>

          {/* Action CTAs & Project Scope Cart */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsScopeModalOpen(true)}
              className="relative flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-zinc-900/90 border border-white/10 hover:border-red-500/50 transition-all duration-300 group shadow-lg"
            >
              <ShoppingCart className="w-4 h-4 text-red-500 transition-transform group-hover:scale-110" />
              <span className="text-xs font-mono uppercase tracking-wider text-zinc-300">
                Escopo do Projeto
              </span>
              <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-red-600 text-white font-mono text-[11px] font-bold shadow-[0_0_10px_rgba(255,42,42,0.6)]">
                {projectScope.length}
              </span>
            </button>

            <button
              onClick={handleSendWhatsAppQuote}
              className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono text-xs uppercase tracking-wider font-semibold transition-all duration-300 shadow-[0_0_20px_rgba(255,42,42,0.35)] hover:shadow-[0_0_28px_rgba(255,42,42,0.55)]"
            >
              <span>Solicitar Orçamento</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </header>

        {/* ====================================================================
            CATEGORY FILTER PILLS
            ==================================================================== */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const isCatActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-mono tracking-wide transition-all duration-300 whitespace-nowrap border ${
                  isCatActive
                    ? 'bg-red-600 text-white border-red-500 shadow-[0_0_15px_rgba(255,42,42,0.4)]'
                    : 'bg-zinc-900/60 text-zinc-400 border-white/5 hover:border-white/20 hover:text-white'
                }`}
              >
                {cat === 'all' ? 'TODOS OS SERVIÇOS' : cat.toUpperCase()}
              </button>
            );
          })}
        </div>

        {/* ====================================================================
            SPLIT VIEW: ACTIVE 3D SERVICE SHOWCASE (LEFT) & INTERACTIVE SHELF (RIGHT)
            ==================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ==================================================================
              LEFT / CENTER STAGE: ACTIVE SERVICE EXPANDED SHOWCASE
              ================================================================== */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            <motion.div
              key={activeService.id}
              layoutId={`service-card-${activeService.id}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative rounded-3xl bg-zinc-950/80 border border-white/10 p-6 sm:p-8 backdrop-blur-xl shadow-2xl overflow-hidden group/stage"
            >
              {/* Subtle top edge neon line */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent" />

              {/* 3D INTERACTIVE VISUALIZER STAGE */}
              <div
                ref={stageRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onDoubleClick={handleResetTilt}
                className="relative w-full h-80 sm:h-96 rounded-2xl bg-black/60 border border-white/5 flex items-center justify-center cursor-grab active:cursor-grabbing overflow-hidden group perspective-[1200px]"
                style={{ touchAction: 'none' }}
              >
                <motion.div
                  style={{
                    rotateX,
                    rotateY,
                    transformStyle: 'preserve-3d',
                  }}
                  className="w-full h-full flex items-center justify-center"
                >
                  <Cyber3DVisual
                    kind={activeService.kind}
                    isActive={true}
                    isHovered={is3DDragging}
                    dragRotateX={rotateX.get()}
                    dragRotateY={rotateY.get()}
                  />
                </motion.div>

                {/* Reset Camera Button */}
                <button
                  onClick={handleResetTilt}
                  title="Resetar Ângulo 3D"
                  className="absolute bottom-4 right-4 p-2 rounded-xl bg-zinc-900/80 border border-white/10 hover:border-red-500/50 text-zinc-400 hover:text-white transition-all duration-300"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* SERVICE HEADER & BADGES */}
              <div className="mt-8 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-md bg-red-950/70 text-red-400 text-xs font-mono font-bold border border-red-500/40">
                      {activeService.code}
                    </span>
                    <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                      {activeService.category}
                    </span>
                  </div>

                  <span className="text-xs font-mono text-zinc-400 bg-white/5 px-2.5 py-1 rounded-md border border-white/10">
                    {activeService.badge}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                  {activeService.title}
                </h2>

                <p className="text-base sm:text-lg text-zinc-300 font-medium leading-relaxed">
                  {activeService.tagline}
                </p>

                <p className="text-sm text-zinc-400 leading-relaxed">
                  {activeService.fullOverview}
                </p>
              </div>

              {/* PERFORMANCE METRICS CARDS */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
                {activeService.metrics.map((metric, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-zinc-900/60 border border-white/5 flex flex-col justify-between"
                  >
                    <span className="text-[11px] font-mono uppercase text-zinc-400 tracking-wider">
                      {metric.label}
                    </span>
                    <div className="text-2xl font-black font-mono text-white mt-1">
                      {metric.value}
                    </div>
                    {metric.subtext && (
                      <span className="text-[10px] font-mono text-red-400 mt-1">
                        {metric.subtext}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* KEY DELIVERABLES & FEATURES */}
              <div className="mt-8 pt-6 border-t border-white/10 space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono text-zinc-300 uppercase tracking-wider font-semibold">
                  <ShieldCheck className="w-4 h-4 text-red-500" />
                  <span>Entregáveis de Alta Precisão</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {activeService.deliverables.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 text-xs text-zinc-300 bg-white/[0.02] p-2.5 rounded-lg border border-white/5"
                    >
                      <Check className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* TECH STACK CHIPS */}
              <div className="mt-6 flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono text-zinc-400 mr-2 flex items-center gap-1">
                  <Code2 className="w-3.5 h-3.5 text-zinc-400" /> STACK:
                </span>
                {activeService.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-zinc-900 border border-white/10 text-zinc-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* TECHNICAL SPECIFICATIONS TABLE */}
              <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
                <div>
                  <span className="text-zinc-400 block text-[10px] uppercase">Garantia / SLA</span>
                  <span className="text-zinc-200 font-semibold">{activeService.specs.sla}</span>
                </div>
                <div>
                  <span className="text-zinc-400 block text-[10px] uppercase">Prazo de Entrega</span>
                  <span className="text-zinc-200 font-semibold">{activeService.specs.deliveryTime}</span>
                </div>
                <div>
                  <span className="text-zinc-400 block text-[10px] uppercase">Infra / Deploy</span>
                  <span className="text-zinc-200 font-semibold truncate block">
                    {activeService.specs.deployment}
                  </span>
                </div>
                <div>
                  <span className="text-zinc-400 block text-[10px] uppercase">Arquitetura</span>
                  <span className="text-zinc-200 font-semibold truncate block">
                    {activeService.specs.architecture}
                  </span>
                </div>
              </div>

              {/* ACTION FOOTER BAR */}
              <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider block">
                    Investimento Estimado ({activeService.investment.tier})
                  </span>
                  <div className="text-2xl font-black font-mono text-white flex items-baseline gap-1">
                    <span>{activeService.investment.startingAt}</span>
                    {activeService.investment.period && (
                      <span className="text-xs font-mono text-zinc-400 font-normal">
                        {activeService.investment.period}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => toggleProjectScope(activeService.id)}
                    className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-mono text-xs uppercase tracking-wider font-semibold transition-all duration-300 border ${
                      isInScope(activeService.id)
                        ? 'bg-red-950/80 text-red-300 border-red-500 shadow-[0_0_15px_rgba(255,42,42,0.3)]'
                        : 'bg-zinc-900 text-zinc-200 border-white/15 hover:border-white/30'
                    }`}
                  >
                    {isInScope(activeService.id) ? (
                      <>
                        <Check className="w-4 h-4 text-red-400" />
                        <span>No Escopo</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 text-zinc-400" />
                        <span>Adicionar ao Projeto</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleSendWhatsAppQuote}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono text-xs uppercase tracking-wider font-semibold transition-all duration-300 shadow-[0_0_20px_rgba(255,42,42,0.4)]"
                  >
                    <span>Solicitar Proposta</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* ==================================================================
              RIGHT RAIL: INTERACTIVE SHELF SELECTION LIST
              ================================================================== */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-4">
            <div className="flex items-center justify-between px-2">
              <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                Prateleira de Soluções ({filteredProducts.length})
              </span>
              <span className="text-[11px] font-mono text-zinc-400">Clique para inspecionar</span>
            </div>

            <div className="space-y-3 max-h-[820px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-zinc-800">
              {filteredProducts.map((service) => {
                const isSelected = service.id === activeServiceId;
                const inScope = isInScope(service.id);

                return (
                  <motion.div
                    key={service.id}
                    layoutId={`shelf-item-${service.id}`}
                    onClick={() => {
                      setActiveServiceId(service.id);
                      onSelectService?.(service);
                    }}
                    className={`relative p-4 rounded-2xl cursor-pointer transition-all duration-300 border backdrop-blur-md group ${
                      isSelected
                        ? 'bg-zinc-900/90 border-red-500 shadow-[0_0_25px_rgba(255,42,42,0.22)]'
                        : 'bg-zinc-950/60 border-white/5 hover:border-white/20 hover:bg-zinc-900/50'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Mini 3D Silhouette Preview */}
                      <div className="relative w-16 h-20 rounded-xl bg-black/60 border border-white/5 flex items-center justify-center shrink-0 overflow-hidden">
                        <div className="w-12 h-14">
                          <Cyber3DVisual kind={service.kind} isHovered={isSelected} />
                        </div>
                      </div>

                      {/* Info & Metadata */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider truncate">
                            {service.code} · {service.category}
                          </span>
                          {inScope && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-red-950 text-red-400 border border-red-500/40 shrink-0">
                              NO ESCOPO
                            </span>
                          )}
                        </div>

                        <h3 className="text-sm font-bold text-white group-hover:text-red-400 transition-colors truncate">
                          {service.title}
                        </h3>

                        <p className="text-xs text-zinc-400 line-clamp-1 mt-0.5">
                          {service.tagline}
                        </p>

                        <div className="mt-3 flex items-center justify-between text-xs font-mono">
                          <span className="text-zinc-300 font-semibold">
                            {service.investment.startingAt}
                          </span>
                          <span className="text-[11px] text-zinc-400 group-hover:text-white flex items-center gap-1 transition-colors">
                            Detalhes <ChevronRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Active Border Ping */}
                    {isSelected && (
                      <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_#ff2a2a]" />
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ====================================================================
            PROJECT SCOPE DRAWER / MODAL
            ==================================================================== */}
        <AnimatePresence>
          {isScopeModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className="relative w-full max-w-2xl rounded-3xl bg-zinc-950 border border-white/15 p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5 text-red-500" />
                    <h3 className="text-lg font-bold text-white uppercase font-sans">
                      Escopo do Seu Projeto
                    </h3>
                  </div>

                  <button
                    onClick={() => setIsScopeModalOpen(false)}
                    className="p-1.5 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white border border-white/10"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {projectScope.length === 0 ? (
                  <div className="py-12 text-center space-y-3">
                    <p className="text-zinc-400 text-sm">
                      Nenhum serviço selecionado ainda para o escopo do projeto.
                    </p>
                    <p className="text-xs text-zinc-400">
                      Navegue pela prateleira e clique em "Adicionar ao Projeto" nos serviços que sua empresa precisa.
                    </p>
                  </div>
                ) : (
                  <div className="py-6 space-y-4">
                    <div className="space-y-2.5">
                      {products
                        .filter((p) => projectScope.includes(p.id))
                        .map((service) => (
                          <div
                            key={service.id}
                            className="flex items-center justify-between gap-4 p-3.5 rounded-xl bg-zinc-900/70 border border-white/10"
                          >
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-mono text-red-400 font-bold">
                                  {service.code}
                                </span>
                                <h4 className="text-sm font-semibold text-white">
                                  {service.title}
                                </h4>
                              </div>
                              <span className="text-xs text-zinc-400 font-mono">
                                Prazo estimado: {service.specs.deliveryTime}
                              </span>
                            </div>

                            <div className="flex items-center gap-3">
                              <span className="text-xs font-mono font-bold text-white">
                                {service.investment.startingAt}
                              </span>
                              <button
                                onClick={() => toggleProjectScope(service.id)}
                                title="Remover do Escopo"
                                className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-950/40 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>

                    <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-zinc-400">
                      <span>Total de Serviços: {projectScope.length}</span>
                      <button
                        onClick={() => setProjectScope([])}
                        className="text-red-400 hover:underline"
                      >
                        Limpar Todos
                      </button>
                    </div>

                    <div className="pt-4 flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => {
                          setIsScopeModalOpen(false);
                          handleSendWhatsAppQuote();
                        }}
                        className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono text-xs uppercase tracking-wider font-semibold transition-all duration-300 shadow-[0_0_20px_rgba(255,42,42,0.4)]"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>Enviar Escopo Completo via WhatsApp</span>
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

export default ProductShelf;
