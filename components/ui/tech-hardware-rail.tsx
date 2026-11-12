'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';

/**
 * VL TECH HIGH-PERFORMANCE HARDWARE SUITE
 * Enterprise servers, cloud nodes, AI tensor processors, and encrypted arrays.
 */
export interface HardwareItem {
  id: string;
  name: string;
  code: string;
  badge: string;
  role: string;
  status: 'ONLINE' | 'ACTIVE' | 'HIGH LOAD' | 'SECURE';
  latency: string;
  throughput: string;
  compute: string;
  memory: string;
  power: string;
  formFactor: string;
  description: string;
  features: string[];
  telemetry: {
    load: number;
    temp: number;
    efficiency: number;
    bandwidthGbps: number;
  };
}

export const HARDWARE_ITEMS: HardwareItem[] = [
  {
    id: 'edge-node-x1',
    name: 'VL-Edge Node X1',
    code: 'VL-EN-X1',
    badge: '01 · Ultra-Low Latency',
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
    name: 'Neural Quantum Core',
    code: 'VL-NQC-96',
    badge: '02 · AI Tensor Engine',
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
    name: 'Cloud Matrix Blade',
    code: 'VL-CMB-64',
    badge: '03 · Microservices Hub',
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
    name: 'Neural AI Accelerator',
    code: 'VL-NAA-48',
    badge: '04 · Deep Learning Coprocessor',
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
    name: 'Encrypted Storage Array',
    code: 'VL-ESA-32T',
    badge: '05 · Hardware Security Vault',
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

export function TechHardwareRail() {
  const [selectedHardware, setSelectedHardware] = useState<HardwareItem | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeTab, setActiveTab] = useState<'front' | 'internal'>('front');

  const railRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  // Close modal on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedHardware(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Drag-to-scroll on the hanging rail
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!railRef.current) return;
    isDraggingRef.current = true;
    startXRef.current = e.pageX - railRef.current.offsetLeft;
    scrollLeftRef.current = railRef.current.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || !railRef.current) return;
    e.preventDefault();
    const x = e.pageX - railRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;
    railRef.current.scrollLeft = scrollLeftRef.current - walk;
    updateScrollProgress();
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const updateScrollProgress = useCallback(() => {
    if (!railRef.current) return;
    const maxScroll = railRef.current.scrollWidth - railRef.current.clientWidth;
    if (maxScroll <= 0) {
      setScrollProgress(0);
      return;
    }
    setScrollProgress(railRef.current.scrollLeft / maxScroll);
  }, []);

  return (
    <section className="relative w-full py-16 px-4 md:px-8 bg-[#0A0A0C] border-y border-[#ff2a2a]/20 overflow-hidden select-none">
      {/* Background Matrix/Cyber Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,42,42,0.12)_0%,_transparent_70%)] pointer-events-none" />
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, #ff2a2a 1px, transparent 1px), linear-gradient(to bottom, #ff2a2a 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative max-w-7xl mx-auto z-10">
        {/* Header Editorial */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff2a2a]/10 border border-[#ff2a2a]/30 mb-4">
              <span className="w-2 h-2 rounded-full bg-[#ff2a2a] animate-pulse" />
              <span className="font-mono text-xs uppercase tracking-widest text-[#ff2a2a]">
                04 — Infraestrutura &amp; Hardware Vitrine
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white font-display">
              Hardware de <span className="text-[#ff2a2a]">Alta Performance</span>
            </h2>
            <p className="mt-3 text-sm md:text-base text-neutral-400 max-w-2xl font-mono">
              Nós de borda, aceleradores quânticos de tensores e blades distribuídos de altíssima densidade.
              Passe o cursor sobre os módulos suspensos no trilho e inspecione as especificações militares.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <span className="font-mono text-xs text-neutral-500 uppercase tracking-wider hidden sm:inline">
              Arraste o trilho lateralmente ↔
            </span>
            <div className="w-32 h-1 bg-neutral-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#ff2a2a] transition-all duration-150"
                style={{ width: `${Math.max(10, scrollProgress * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* INDUSTRIAL TOP MOUNTING SUSPENSION RAIL */}
        <div className="relative w-full">
          {/* Main Powder-Coated Heavy Rail Bar */}
          <div className="relative w-full h-7 bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 rounded-lg border border-neutral-700 shadow-[0_10px_30px_rgba(0,0,0,0.9)] flex items-center px-4 overflow-hidden">
            {/* Neon Red Laser Guide Line */}
            <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-[#ff2a2a] to-transparent shadow-[0_0_12px_#ff2a2a]" />
            <div className="flex items-center justify-between w-full font-mono text-[10px] text-neutral-500 uppercase tracking-widest">
              <span>VL-TECH // HEAVY HARDWARE SUSPENSION RAIL v5.8</span>
              <span className="text-[#ff2a2a] flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#ff2a2a] animate-ping" />
                LIVE TELEMETRY ACTIVE
              </span>
            </div>
          </div>

          {/* Hanging Hardware Modules Rail Track */}
          <div
            ref={railRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onScroll={updateScrollProgress}
            className="flex items-start gap-6 md:gap-8 overflow-x-auto pt-6 pb-12 cursor-grab active:cursor-grabbing no-scrollbar scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {HARDWARE_ITEMS.map((item, index) => {
              const isHovered = hoveredId === item.id;

              return (
                <div
                  key={item.id}
                  onMouseEnter={() => setHoveredId(item.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() => setSelectedHardware(item)}
                  className="relative flex-shrink-0 flex flex-col items-center group cursor-pointer transition-transform duration-300"
                  style={{
                    transform: isHovered
                      ? 'translateY(12px) scale(1.03)'
                      : 'translateY(0) scale(1)',
                  }}
                >
                  {/* Heavy Steel Suspension Bracket & Hook */}
                  <div className="flex flex-col items-center">
                    {/* Rail Clamp */}
                    <div className="w-8 h-4 bg-gradient-to-b from-neutral-700 to-neutral-900 rounded-t border border-neutral-600 shadow-md flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-[#ff2a2a] shadow-[0_0_6px_#ff2a2a]" />
                    </div>
                    {/* Hanging Cable */}
                    <div className="w-1 h-8 bg-gradient-to-b from-neutral-500 to-neutral-700 shadow-sm" />
                    {/* Chassis Anchor Mount */}
                    <div className="w-10 h-3 bg-neutral-800 rounded border border-neutral-600 flex items-center justify-around px-1">
                      <span className="w-1 h-1 rounded-full bg-white/40" />
                      <span className="w-1 h-1 rounded-full bg-white/40" />
                    </div>
                  </div>

                  {/* Vertical Server Chassis Blade */}
                  <div className="relative w-[280px] md:w-[320px] h-[480px] bg-gradient-to-b from-[#181820] via-[#121217] to-[#0A0A0E] rounded-2xl border border-white/10 group-hover:border-[#ff2a2a] p-5 shadow-[0_20px_45px_rgba(0,0,0,0.85)] group-hover:shadow-[0_25px_60px_rgba(255,42,42,0.25)] flex flex-col justify-between transition-all duration-300 overflow-hidden">
                    {/* Ambient Glow on Hover */}
                    <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#ff2a2a]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                    {/* Chassis Top Header */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-mono text-xs font-bold text-[#ff2a2a]">
                          {item.badge}
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-neutral-900 border border-white/10 font-mono text-[10px] text-neutral-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#ff2a2a]" />
                          {item.status}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold font-display uppercase tracking-tight text-white mb-1">
                        {item.name}
                      </h3>
                      <p className="font-mono text-xs text-neutral-400 uppercase tracking-wider mb-4">
                        {item.role}
                      </p>
                    </div>

                    {/* Industrial Hardware Ventilation Grilles & Telemetry LED Panel */}
                    <div className="relative my-auto py-4 px-3 bg-neutral-950/70 rounded-xl border border-white/5 flex flex-col gap-2">
                      {/* Ventilation Slots */}
                      <div className="flex justify-between gap-1 opacity-60">
                        {Array.from({ length: 14 }).map((_, i) => (
                          <div
                            key={i}
                            className={`w-1 h-6 rounded-full ${
                              i % 3 === 0 ? 'bg-[#ff2a2a]' : 'bg-neutral-700'
                            }`}
                          />
                        ))}
                      </div>

                      {/* Hardware Core Specs Matrix */}
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5 font-mono text-[11px]">
                        <div>
                          <span className="text-neutral-500 block">LATENCY</span>
                          <span className="text-white font-bold">{item.latency}</span>
                        </div>
                        <div>
                          <span className="text-neutral-500 block">THROUGHPUT</span>
                          <span className="text-[#ff2a2a] font-bold">{item.throughput}</span>
                        </div>
                        <div>
                          <span className="text-neutral-500 block">COMPUTE</span>
                          <span className="text-neutral-300 truncate block">{item.compute.split(' ')[0]}</span>
                        </div>
                        <div>
                          <span className="text-neutral-500 block">MEMORY</span>
                          <span className="text-neutral-300">{item.memory.split(' ')[0]}</span>
                        </div>
                      </div>
                    </div>

                    {/* Chassis Bottom Controls */}
                    <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                      <span className="font-mono text-[10px] text-neutral-500">
                        FORM: {item.formFactor.split(' ')[0]}
                      </span>
                      <button
                        type="button"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 border border-white/10 group-hover:border-[#ff2a2a] group-hover:bg-[#ff2a2a]/10 font-mono text-xs font-bold text-white group-hover:text-[#ff2a2a] transition-all"
                      >
                        <span>INSPECIONAR</span>
                        <span className="text-[#ff2a2a]">↗</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* DETAILED SPECIFICATION MODAL DIALOG */}
      {selectedHardware && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200"
          onClick={() => setSelectedHardware(null)}
        >
          <div
            className="relative w-full max-w-3xl bg-[#111116] border border-[#ff2a2a]/40 rounded-3xl p-6 md:p-8 shadow-[0_25px_80px_rgba(0,0,0,0.95)] max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Top Header */}
            <div className="flex items-start justify-between pb-6 border-b border-white/10">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-mono text-xs text-[#ff2a2a] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-[#ff2a2a]/10 border border-[#ff2a2a]/30">
                    {selectedHardware.code}
                  </span>
                  <span className="font-mono text-xs text-neutral-400">
                    STATUS: <span className="text-white font-bold">{selectedHardware.status}</span>
                  </span>
                </div>
                <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white font-display">
                  {selectedHardware.name}
                </h3>
                <p className="font-mono text-xs text-neutral-400 mt-1">
                  {selectedHardware.role} · {selectedHardware.formFactor}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedHardware(null)}
                className="w-10 h-10 rounded-xl bg-neutral-900 border border-white/15 hover:border-[#ff2a2a] text-neutral-400 hover:text-white flex items-center justify-center font-mono text-sm transition-all"
                aria-label="Fechar especificações"
              >
                ✕
              </button>
            </div>

            {/* View Selector Tabs */}
            <div className="flex items-center gap-2 my-6">
              <button
                type="button"
                onClick={() => setActiveTab('front')}
                className={`px-4 py-2 rounded-xl font-mono text-xs uppercase tracking-wider transition-all ${
                  activeTab === 'front'
                    ? 'bg-[#ff2a2a] text-white shadow-[0_0_15px_rgba(255,42,42,0.4)]'
                    : 'bg-neutral-900 text-neutral-400 hover:text-white border border-white/10'
                }`}
              >
                Painel Frontal &amp; Telemetria
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('internal')}
                className={`px-4 py-2 rounded-xl font-mono text-xs uppercase tracking-wider transition-all ${
                  activeTab === 'internal'
                    ? 'bg-[#ff2a2a] text-white shadow-[0_0_15px_rgba(255,42,42,0.4)]'
                    : 'bg-neutral-900 text-neutral-400 hover:text-white border border-white/10'
                }`}
              >
                Arquitetura de Silício &amp; PCB
              </button>
            </div>

            {/* Modal Body Content */}
            {activeTab === 'front' ? (
              <div className="space-y-6">
                <p className="text-sm text-neutral-300 font-sans leading-relaxed">
                  {selectedHardware.description}
                </p>

                {/* Telemetry Benchmarks Gauge */}
                <div className="bg-neutral-950/80 rounded-2xl p-5 border border-white/10">
                  <h4 className="font-mono text-xs uppercase tracking-wider text-[#ff2a2a] mb-4 flex items-center justify-between">
                    <span>Telemetria em Tempo Real (Live Benchmark)</span>
                    <span className="text-white">60 FPS</span>
                  </h4>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-neutral-900/60 p-3 rounded-xl border border-white/5">
                      <span className="font-mono text-[10px] text-neutral-500 block">CARGA DA CPU/NPU</span>
                      <span className="font-display text-xl text-white font-bold">{selectedHardware.telemetry.load}%</span>
                      <div className="w-full bg-neutral-800 h-1.5 rounded-full mt-2 overflow-hidden">
                        <div className="bg-[#ff2a2a] h-full" style={{ width: `${selectedHardware.telemetry.load}%` }} />
                      </div>
                    </div>

                    <div className="bg-neutral-900/60 p-3 rounded-xl border border-white/5">
                      <span className="font-mono text-[10px] text-neutral-500 block">TEMP. OPERACIONAL</span>
                      <span className="font-display text-xl text-white font-bold">{selectedHardware.telemetry.temp}°C</span>
                      <div className="w-full bg-neutral-800 h-1.5 rounded-full mt-2 overflow-hidden">
                        <div className="bg-emerald-500 h-full" style={{ width: `${(selectedHardware.telemetry.temp / 85) * 100}%` }} />
                      </div>
                    </div>

                    <div className="bg-neutral-900/60 p-3 rounded-xl border border-white/5">
                      <span className="font-mono text-[10px] text-neutral-500 block">EFICIÊNCIA TÉRMICA</span>
                      <span className="font-display text-xl text-white font-bold">{selectedHardware.telemetry.efficiency}%</span>
                      <div className="w-full bg-neutral-800 h-1.5 rounded-full mt-2 overflow-hidden">
                        <div className="bg-[#ff2a2a] h-full" style={{ width: `${selectedHardware.telemetry.efficiency}%` }} />
                      </div>
                    </div>

                    <div className="bg-neutral-900/60 p-3 rounded-xl border border-white/5">
                      <span className="font-mono text-[10px] text-neutral-500 block">BANDWIDTH ATUAL</span>
                      <span className="font-display text-xl text-white font-bold">{selectedHardware.telemetry.bandwidthGbps} Gbps</span>
                      <div className="w-full bg-neutral-800 h-1.5 rounded-full mt-2 overflow-hidden">
                        <div className="bg-[#ff2a2a] h-full" style={{ width: `${(selectedHardware.telemetry.bandwidthGbps / 250) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Key Specifications Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 font-mono text-xs">
                  <div className="p-3 rounded-xl bg-neutral-900/50 border border-white/5">
                    <span className="text-neutral-500 block text-[10px]">LATÊNCIA P99</span>
                    <span className="text-white font-bold text-sm">{selectedHardware.latency}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-neutral-900/50 border border-white/5">
                    <span className="text-neutral-500 block text-[10px]">THROUGHPUT MÁXIMO</span>
                    <span className="text-[#ff2a2a] font-bold text-sm">{selectedHardware.throughput}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-neutral-900/50 border border-white/5">
                    <span className="text-neutral-500 block text-[10px]">CONSUMO ENERGÉTICO</span>
                    <span className="text-white font-bold text-sm">{selectedHardware.power}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-neutral-900/50 border border-white/5 col-span-2 md:col-span-1">
                    <span className="text-neutral-500 block text-[10px]">PROCESSADOR</span>
                    <span className="text-white font-bold text-sm">{selectedHardware.compute}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-neutral-900/50 border border-white/5 col-span-2">
                    <span className="text-neutral-500 block text-[10px]">MEMÓRIA &amp; BUS</span>
                    <span className="text-white font-bold text-sm">{selectedHardware.memory}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="p-5 rounded-2xl bg-neutral-950 border border-white/10 font-mono">
                  <h4 className="text-xs uppercase tracking-wider text-[#ff2a2a] mb-3">
                    Arquitetura de Segurança &amp; Engenharia de Silício
                  </h4>
                  <ul className="space-y-2 text-xs text-neutral-300">
                    {selectedHardware.features.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="text-[#ff2a2a]">✦</span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-[#ff2a2a]/10 border border-[#ff2a2a]/30 font-mono text-xs text-neutral-300">
                  <span className="text-[#ff2a2a] font-bold block mb-1">
                    GARANTIA DE NÍVEL DE SERVIÇO (SLA):
                  </span>
                  Cada servidor conta com replicação geográfica multi-região na Vercel Edge e AWS,
                  garantindo 99.999% de disponibilidade sob stress testing contínuo.
                </div>
              </div>
            )}

            {/* Modal Footer & Actions */}
            <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="font-mono text-xs text-neutral-400">
                Disponível para alocação dedicada no seu projeto
              </span>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setSelectedHardware(null)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/10 hover:border-white/20 text-neutral-300 font-mono text-xs font-bold transition-all"
                >
                  FECHAR
                </button>
                <a
                  href={`https://wa.me/5511999999999?text=Ol%C3%A1%2C%20gostaria%20de%20solicitar%20a%20infraestrutura%20${encodeURIComponent(
                    selectedHardware.name
                  )}%20para%20o%20meu%20projeto%20com%20a%20VL%20Tech.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ff2a2a] to-[#c20e15] text-white font-mono text-xs font-bold tracking-wider uppercase hover:shadow-[0_0_20px_rgba(255,42,42,0.6)] hover:scale-105 active:scale-95 transition-all text-center"
                >
                  SOLICITAR ALOCAÇÃO ↗
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default TechHardwareRail;
