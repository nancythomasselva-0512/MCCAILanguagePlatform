import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic, Volume2, Languages, FileAudio, ArrowRight, Sparkles,
  Zap, Globe, Shield, Clock, Star, ChevronRight, Play,
  CheckCircle2, Users, BarChart3, Headphones, Plus, Activity,
  Server, Database, ArrowRightLeft, FileCode
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { ActiveTabType } from '../../context/AppContext';
import { HeroNeuralSphere } from './HeroNeuralSphere';
import { AnimatedCounter } from './AnimatedCounter';
import { NeuralBackground } from './NeuralBackground';

// ── CUSTOM 3D INTERACTIVE CARD COMPONENT ──────────────────────────────────────
interface ThreeDInteractiveCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  onClick?: () => void;
}

const ThreeDInteractiveCard: React.FC<ThreeDInteractiveCardProps> = ({
  children,
  className = '',
  glowColor = 'rgba(37,99,235,0.15)',
  onClick
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xc = rect.width / 2;
    const yc = rect.height / 2;

    const rY = ((x - xc) / xc) * 10;
    const rX = -((y - yc) / yc) * 10;

    // Direct DOM manipulation to avoid React re-renders on mousemove
    cardRef.current.style.transform = `perspective(1000px) rotateX(${rX}deg) rotateY(${rY}deg) scale3d(1.025, 1.025, 1.025)`;
    
    if (contentRef.current) {
      contentRef.current.style.transform = 'translateZ(25px)';
    }

    const glow = cardRef.current.querySelector('.card-3d-glow') as HTMLDivElement;
    if (glow) {
      glow.style.background = `radial-gradient(circle 220px at ${x}px ${y}px, ${glowColor}, transparent 80%)`;
    }
  };

  const handleMouseLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    }
    if (contentRef.current) {
      contentRef.current.style.transform = 'translateZ(0px)';
    }
    const glow = cardRef.current?.querySelector('.card-3d-glow') as HTMLDivElement;
    if (glow) {
      glow.style.background = 'transparent';
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
        transformStyle: 'preserve-3d',
      }}
      className={`bg-white dark:bg-[#0a1120]/85 border border-[#DDE5F0] dark:border-white/5 rounded-[28px] shadow-lg dark:shadow-2xl transition-all duration-300 relative overflow-hidden group select-none ${className}`}
    >
      <div className="card-3d-glow absolute inset-0 pointer-events-none transition-all duration-300" />
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#2563eb]/10 dark:via-white/10 to-transparent" />
      <div
        ref={contentRef}
        style={{
          transform: 'translateZ(0px)',
          transformStyle: 'preserve-3d',
        }}
        className="transition-transform duration-300 h-full w-full"
      >
        {children}
      </div>
    </div>
  );
};

// ── CONSTANTS ──
const TOOLS: {
  id: ActiveTabType;
  icon: React.ReactNode;
  label: string;
  tagline: string;
  description: string;
  accentColor: string;
  glowColor: string;
  status: string;
  features: string[];
}[] = [
  {
    id: 'voice-to-text',
    icon: <Mic size={22} />,
    label: 'Voice to Text',
    tagline: 'Real-time Capturing',
    description: 'Convert live speech or voice recordings to accurate text in real-time with automatic language detection.',
    accentColor: '#3b82f6',
    glowColor: 'rgba(59, 130, 246, 0.2)',
    status: 'ONNX Engine Ready',
    features: ['Live recording', 'Auto detection', 'Download TXT'],
  },
  {
    id: 'text-to-speech',
    icon: <Volume2 size={22} />,
    label: 'Text to Voice',
    tagline: 'High-Fidelity Synthesis',
    description: 'Transform written text into natural-sounding speech. Choose speed, pitch, and voice preset options.',
    accentColor: '#a855f7',
    glowColor: 'rgba(168, 85, 247, 0.2)',
    status: '12 voices loaded',
    features: ['20+ neural voices', 'Speed control', 'MP3 download'],
  },
  {
    id: 'translation',
    icon: <Languages size={22} />,
    label: 'Text Translation',
    tagline: 'Multi-lingual Mapping',
    description: 'Translate text between 100+ languages instantly. Play translated speech output with natural phrasing.',
    accentColor: '#10b981',
    glowColor: 'rgba(16, 185, 129, 0.2)',
    status: 'Offline Translating',
    features: ['100+ languages', 'Source detection', 'Audio output'],
  },
  {
    id: 'audio-transcription',
    icon: <FileAudio size={22} />,
    label: 'Audio to Text',
    tagline: 'Timeline Segmentation',
    description: 'Upload audio files (MP3, WAV, M4A) to generate accurate transcripts equipped with automatic timestamp dividers.',
    accentColor: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.2)',
    status: 'All formats supported',
    features: ['Multiple file formats', 'Timestamps', 'Inline editor'],
  },
];

const STATS = [
  { icon: <Users size={20} />, value: '2M+', label: 'Active Users', percent: 85, color: '#3b82f6' },
  { icon: <Globe size={20} />, value: '100+', label: 'Languages', percent: 92, color: '#06b6d4' },
  { icon: <BarChart3 size={20} />, value: '99.2%', label: 'Accuracy', percent: 99, color: '#10b981' },
  { icon: <Clock size={20} />, value: '<1s', label: 'Response Time', percent: 88, color: '#a855f7' },
];

const TESTIMONIALS = [
  {
    name: 'Ananya Sharma',
    role: 'Content Specialist',
    text: 'The Voice to Text accuracy is mind-blowing. It handles my bilingual transitions perfectly!',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  },
  {
    name: 'Carlos Mendez',
    role: 'Research Lead',
    text: 'Instant translation combined with audio narration is a game-changer for international study.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  },
  {
    name: 'Priya Nair',
    role: 'Podcast Editor',
    text: 'The transcript timestamps are clean, and the editor lets me patch errors in seconds.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  },
];

const VIDEO_CHAPTERS = [
  { time: 5, label: 'Voice To Text', displayTime: '00:05' },
  { time: 15, label: 'Translation', displayTime: '00:15' },
  { time: 25, label: 'Text To Voice', displayTime: '00:25' },
  { time: 35, label: 'Audio To Text', displayTime: '00:35' },
  { time: 50, label: 'Export Features', displayTime: '00:50' },
];

export const LandingPage: React.FC = () => {
  const { setViewMode, setActiveTab } = useApp();
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Video Showcase states
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const [activeChapter, setActiveChapter] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    let currentChapterIdx = 0;
    for (let i = VIDEO_CHAPTERS.length - 1; i >= 0; i--) {
      if (current >= VIDEO_CHAPTERS[i].time) {
        currentChapterIdx = i;
        break;
      }
    }
    setActiveChapter(currentChapterIdx);
  };

  const seekToChapter = (seconds: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = seconds;
    videoRef.current.play().catch(() => {});
    setIsVideoPlaying(true);
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isVideoPlaying) {
      videoRef.current.pause();
      setIsVideoPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsVideoPlaying(true);
    }
  };

  useEffect(() => {
    // Testimonials Auto Loop
    const testimonialTimer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5500);

    return () => {
      clearInterval(testimonialTimer);
    };
  }, []);

  const launchTool = (tab: ActiveTabType) => {
    setActiveTab(tab);
    setViewMode('workspace');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="overflow-x-hidden relative min-h-screen text-slate-900 dark:text-slate-100" style={{ background: 'var(--bg-base)' }}>
      {/* ── LIVE BACKGROUND EFFECTS ── */}
      <NeuralBackground />

      {/* ── HERO SECTION (MASSIVE HIGH-CONTRAST OVERHAUL) ────────────────────── */}
      <section className="relative min-h-[96vh] flex items-center justify-center pt-12 pb-16 overflow-hidden border-b border-[#DDE5F0] dark:border-white/5">
        
        {/* Soft grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border-base)_1px,transparent_1px),linear-gradient(to_bottom,var(--border-base)_1px,transparent_1px)] bg-[size:40px_40px] opacity-25 dark:opacity-10 pointer-events-none" />
        
        {/* Soft blur auroras */}
        <div className="absolute top-[15%] right-[-15%] w-[50%] h-[50%] rounded-full blur-[180px] opacity-20 dark:opacity-15 bg-radial from-blue-600 via-cyan-500 to-transparent pointer-events-none" />
        <div className="absolute bottom-[10%] left-[-15%] w-[50%] h-[50%] rounded-full blur-[180px] opacity-20 dark:opacity-15 bg-radial from-purple-600 via-indigo-500 to-transparent pointer-events-none" />

        <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Block */}
          <div className="lg:col-span-7 flex flex-col justify-center text-left">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: 'easeOut' }}
            >
              {/* Badges block */}
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-md bg-blue-500/10 dark:bg-blue-500/10 border border-blue-500/30 text-blue-700 dark:text-blue-400">
                  <Activity size={10} className="animate-pulse" /> Real-Time AI
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-md bg-cyan-500/10 border border-cyan-500/30 text-cyan-700 dark:text-cyan-400">
                  +2M Users
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-md bg-purple-500/10 border border-purple-500/30 text-purple-700 dark:text-purple-400">
                  99.2% Accuracy
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400">
                  100+ Languages
                </span>
              </div>

              {/* Title Word Reveal Sequence */}
              <h1 className="font-display text-4xl font-extrabold leading-[1.08] tracking-tight xs:text-5xl sm:text-6xl md:text-7xl text-slate-900 dark:text-white mb-6">
                Redefining the{' '}
                <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-purple-600 dark:from-blue-400 dark:via-cyan-400 dark:to-purple-400 bg-clip-text text-transparent font-black">
                  Future of Language
                </span>{' '}
                AI
              </h1>

              <p className="text-base sm:text-lg text-slate-700 dark:text-slate-200 max-w-2xl mb-8 leading-relaxed font-semibold">
                Experience high-performance, local client-side transcription, multi-speaker voice synthesis, and real-time document translations. Complete workspace capability loaded into a premium desktop layout.
              </p>
            </motion.div>

            {/* Launch Call To Actions with Magnetic/Scale effects */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                id="hero-launch-btn"
                onClick={() => { setViewMode('workspace'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="group flex items-center justify-center gap-2.5 rounded-full px-8 py-4 text-base font-extrabold text-white transition-all duration-300 hover:scale-[1.04] active:scale-[0.98] cursor-pointer shadow-lg"
                style={{ 
                  background: 'linear-gradient(135deg, #1e40af, #0891b2)', 
                }}
              >
                <Play size={16} className="fill-current" />
                Launch Workstation
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </button>
              <button
                id="hero-explore-btn"
                onClick={() => document.getElementById('ai-language-tools')?.scrollIntoView({ behavior: 'smooth' })}
                className="flex items-center justify-center gap-2 rounded-full px-8 py-4 text-base font-extrabold transition-all duration-300 hover:scale-[1.04] active:scale-[0.98] text-slate-900 dark:text-white bg-white/70 dark:bg-white/5 border border-[#DDE5F0] dark:border-white/10 hover:bg-white dark:hover:bg-white/10 hover:border-blue-500/20 backdrop-blur-md cursor-pointer"
              >
                Explore Modules
                <ChevronRight size={16} />
              </button>
            </div>
            
            <div className="mt-8 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-bold">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Model status: Online</span>
              <span className="mx-2 text-[#DDE5F0] dark:text-white/10">|</span>
              <span>All 4 networks sandbox validated</span>
            </div>
          </div>

          {/* Right 3D Visualizer block */}
          <div className="lg:col-span-5 flex justify-center items-center relative min-h-[460px] xl:min-h-[500px]">
            
            {/* 3D Neural Sphere */}
            <div className="relative z-10 w-full max-w-[420px] aspect-square flex items-center justify-center">
              <HeroNeuralSphere />
            </div>
          </div>

        </div>
      </section>



      {/* ── STATISTICS SECTION ────────────────────────────────────────────────────── */}
      <section className="relative py-8 px-4">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STATS.map((s) => (
              <ThreeDInteractiveCard
                key={s.label}
                glowColor={`color-mix(in srgb, ${s.color} 20%, transparent)`}
                className="p-6 cursor-default"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 rounded-2xl flex items-center justify-center text-white"
                    style={{ background: s.color }}
                  >
                    {s.icon}
                  </div>
                  
                  {/* Dynamic Progress Ring */}
                  <svg className="w-10 h-10 rotate-[-90deg]">
                    <circle cx="20" cy="20" r="16" fill="transparent" stroke="var(--border-base)" strokeWidth="3" />
                    <motion.circle 
                      cx="20" cy="20" r="16" fill="transparent" stroke={s.color} strokeWidth="3"
                      strokeDasharray={100}
                      initial={{ strokeDashoffset: 100 }}
                      whileInView={{ strokeDashoffset: 100 - s.percent }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, ease: 'easeOut' }}
                    />
                  </svg>
                </div>

                <div className="font-display text-3xl font-black tracking-tight text-slate-900 dark:text-white mb-0.5">
                  <AnimatedCounter value={s.value} />
                </div>
                <div className="text-[10px] font-extrabold tracking-wider uppercase text-slate-700 dark:text-slate-400">{s.label}</div>
                
                {/* Micro analytical mini bar mockup inside card */}
                <div className="mt-4 pt-3 border-t border-[#DDE5F0] dark:border-white/5 flex items-center justify-between text-[9px] text-slate-500 dark:text-slate-400 font-bold">
                  <span>Engine accuracy rate</span>
                  <span className="text-emerald-600 dark:text-emerald-400">Stable</span>
                </div>
              </ThreeDInteractiveCard>
            ))}
          </div>
        </div>
      </section>



      {/* ── TOOLS SECTION (PREMIUM PRODUCT SHOWCASES) ───────────────────────── */}
      <section id="ai-language-tools" className="relative py-10 px-4">
        <div className="mx-auto max-w-7xl">
          
          <div className="mb-14 text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[10px] font-extrabold uppercase tracking-widest bg-blue-500/10 dark:bg-blue-500/10 border border-blue-500/30 text-blue-700 dark:text-blue-400 mb-4 shadow-[0_0_15px_rgba(37,99,235,0.1)]">
              <Zap size={11} /> AI Language Workstation
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white">
              Center Stage{' '}
              <span className="bg-gradient-to-r from-blue-600 via-cyan-600 to-purple-600 dark:from-blue-400 dark:via-cyan-400 dark:to-purple-400 bg-clip-text text-transparent font-black">
                Product Showcase
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base text-slate-700 dark:text-slate-300 font-semibold">
              Select a workbench and deploy our localized browser networks. Low bundle weights, sub-20ms rendering loops, and complete privacy.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TOOLS.map((tool) => (
              <ThreeDInteractiveCard
                key={tool.id}
                glowColor={tool.glowColor}
                onClick={() => launchTool(tool.id)}
                className="flex flex-col"
              >
                <div className="p-6 flex flex-col justify-between h-full w-full">
                  
                  {/* Visual mockup preview illustration */}
                  <div className="relative h-28 w-full mb-5 rounded-2xl bg-slate-50 dark:bg-black/40 border border-[#DDE5F0] dark:border-white/5 overflow-hidden flex items-center justify-center shadow-inner">
                    
                    {tool.id === 'voice-to-text' && (
                      <div className="flex gap-1.5 items-end justify-center h-10 w-full px-6">
                        {[1, 3, 2, 4, 3, 5, 3, 2, 4, 1].map((val, idx) => (
                          <motion.span 
                            key={idx}
                            className="w-1.5 bg-blue-600 dark:bg-blue-500 rounded-full"
                            animate={{ height: [`${val * 12}%`, `${val * 20}%`, `${val * 12}%`] }}
                            transition={{ repeat: Infinity, duration: 1.0, delay: idx * 0.08 }}
                          />
                        ))}
                        <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-red-100 dark:bg-red-500/10 px-1.5 py-0.5 rounded border border-red-200 dark:border-red-500/30">
                          <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                          <span className="text-[7px] font-extrabold text-red-700 dark:text-red-500 uppercase tracking-widest">Live Mic</span>
                        </div>
                      </div>
                    )}

                    {tool.id === 'text-to-speech' && (
                      <div className="flex flex-col gap-2 w-4/5">
                        <div className="flex justify-between items-center text-[7px] text-purple-700 dark:text-purple-400 font-extrabold uppercase tracking-wider">
                          <span>Synthesizing Voice</span>
                          <span>480Hz</span>
                        </div>
                        <div className="flex gap-1 h-6 items-center">
                          {[4, 2, 7, 5, 8, 3, 6, 2, 5, 4, 8, 3].map((h, i) => (
                            <motion.span
                              key={i}
                              className="flex-1 bg-purple-600 dark:bg-purple-500 rounded-full"
                              style={{ height: `${h * 10}%` }}
                              animate={{ scaleY: [1, 1.4, 1] }}
                              transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.05 }}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {tool.id === 'translation' && (
                      <div className="flex items-center gap-2 justify-center w-full text-[9px] font-extrabold">
                        <div className="px-2.5 py-1 rounded bg-white dark:bg-white/5 border border-[#DDE5F0] dark:border-white/10 text-slate-800 dark:text-slate-300 shadow-sm">English</div>
                        <motion.div animate={{ rotate: [0, 180, 180, 360] }} transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}>
                          <ArrowRightLeft size={10} className="text-emerald-600 dark:text-emerald-500" />
                        </motion.div>
                        <div className="px-2.5 py-1 rounded bg-white dark:bg-white/5 border border-[#DDE5F0] dark:border-white/10 text-emerald-700 dark:text-emerald-400 shadow-sm">Tamil</div>
                      </div>
                    )}

                    {tool.id === 'audio-transcription' && (
                      <div className="w-11/12 flex flex-col gap-1 px-2">
                        <div className="flex justify-between text-[7px] text-amber-700 dark:text-amber-500 font-extrabold tracking-wider uppercase">
                          <span>transcription.wav</span>
                          <span>00:14 / 01:25</span>
                        </div>
                        <div className="h-6 bg-white dark:bg-white/5 rounded border border-[#DDE5F0] dark:border-white/5 relative overflow-hidden flex items-center px-1">
                          <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-amber-500/40 animate-pulse" />
                          <div className="flex gap-0.5 w-full items-end h-4 opacity-50">
                            {[2, 5, 3, 8, 4, 6, 3, 2, 5, 7, 4, 3, 6, 2, 5, 3, 4, 1].map((val, idx) => (
                              <span key={idx} className="flex-1 bg-amber-600 dark:bg-amber-500 rounded-sm" style={{ height: `${val * 10}%` }} />
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                  </div>

                  {/* Info text fields */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2.5 mb-2.5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl text-white shadow-md"
                          style={{ background: tool.accentColor }}>
                          {tool.icon}
                        </div>
                        <h3 className="font-display text-base font-extrabold text-slate-900 dark:text-white tracking-tight leading-none">{tool.label}</h3>
                      </div>
                      
                      <div className="flex items-center justify-between text-[9px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">
                        <span>{tool.tagline}</span>
                        <span className="text-emerald-600 dark:text-emerald-400">{tool.status}</span>
                      </div>

                      <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300 font-semibold mb-4">{tool.description}</p>
                    </div>

                    <div>
                      {/* Features list */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {tool.features.map((f) => (
                          <span key={f} className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-extrabold tracking-wide bg-slate-100 dark:bg-white/[0.02] border border-[#DDE5F0] dark:border-white/[0.04] text-slate-700 dark:text-slate-300">
                            <CheckCircle2 size={8} className="text-emerald-600 dark:text-emerald-500" />
                            {f}
                          </span>
                        ))}
                      </div>

                      <button
                        className="group/btn w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-extrabold transition-all duration-300 cursor-pointer text-white shadow"
                        style={{
                          background: tool.accentColor,
                        }}
                      >
                        Deploy Module
                        <ArrowRight size={11} className="transition-transform group-hover/btn:translate-x-0.5" />
                      </button>
                    </div>
                  </div>

                </div>
              </ThreeDInteractiveCard>
            ))}
          </div>

        </div>
      </section>



      {/* ── HOW IT WORKS (INTERACTIVE PROCESS ROW) ─────────────────────────── */}
      <section id="workflow" className="py-10 px-4 relative overflow-hidden">
        <div className="mx-auto max-w-5xl">
          
          <div className="mb-14 text-center">
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white">
              Interactive AI{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent font-black">
                Process Flow
              </span>
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-semibold">
              Watch your voice files transform inside our client-side pipelines. Minimal network latencies, complete privacy.
            </p>
          </div>

          <div className="relative grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            
            {/* Dotted vector connector line */}
            <div className="pointer-events-none absolute top-12 left-[12%] hidden h-0.5 w-[76%] lg:block"
              style={{ background: 'linear-gradient(to right, #3b82f6, #a855f7, #f59e0b, #10b981)' }} />

            {[
              { idx: '01', title: 'Input Capture', desc: 'Speak, type, or drag-and-drop raw audio streams directly inside the web browser.', icon: <Mic size={16} /> },
              { idx: '02', title: 'AI Processing', desc: 'Our ONNX runtime extracts acoustic spectrogram parameters locally.', icon: <Server size={16} /> },
              { idx: '03', title: 'Neural Translation', desc: 'Transformers map tokens and semantic fields into target accent dictionaries.', icon: <Languages size={16} /> },
              { idx: '04', title: 'Output Generation', desc: 'Export formatted transcripts, download MP3 synthesis, or copy translations.', icon: <Plus size={16} /> },
            ].map((w) => (
              <ThreeDInteractiveCard
                key={w.idx}
                glowColor="rgba(168, 85, 247, 0.12)"
                className="p-5"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl text-white font-display text-sm font-black shadow-lg"
                    style={{ background: 'linear-gradient(135deg, #3b82f6, #a855f7)' }}>
                    {w.idx}
                  </div>
                  <div className="text-slate-600 dark:text-slate-400 group-hover:scale-105 transition-transform">{w.icon}</div>
                </div>
                <h3 className="mb-2 font-bold text-slate-900 dark:text-white text-base">{w.title}</h3>
                <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300 font-semibold">{w.desc}</p>
              </ThreeDInteractiveCard>
            ))}
          </div>

        </div>
      </section>



      {/* ── WHY MCC AI (STRIPE-STYLE GRID) ──────────────────────────────────── */}
      <section id="features" className="py-10 px-4 relative">
        <div className="mx-auto max-w-6xl">
          
          <div className="mb-14 text-center">
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white">
              Enterprise{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent font-black">
                Infrastructure
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-semibold">
              Engineered with modern browser compilation tools for maximum execution efficiency.
            </p>
          </div>

          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: <Zap size={18} />, title: 'Sub-Second Latencies', desc: 'Localized models process acoustic pipelines with zero routing handshakes.', color: '#f59e0b' },
              { icon: <Shield size={18} />, title: 'Privacy Sandbox', desc: 'Executes safely on device. No voice data or documents ever leave your machine.', color: '#10b981' },
              { icon: <Globe size={18} />, title: 'Global Translations', desc: 'Integrated transformer networks support regional dialects and Tamil accents.', color: '#3b82f6' },
              { icon: <Headphones size={18} />, title: 'Speech Intonation', desc: 'Diverse presets simulate human prosody, volume waves, and intonations.', color: '#a855f7' },
              { icon: <Database size={18} />, title: 'Zero Cache Logging', desc: 'No accounts, cookies, or credentials are required. Load the URL and work.', color: '#f97316' },
              { icon: <FileCode size={18} />, title: 'ONNX Accelerations', desc: 'Uses WASM assembly vectors to run models at native GPU/CPU limits.', color: '#ec4899' },
            ].map((feat) => (
              <ThreeDInteractiveCard
                key={feat.title}
                glowColor={`color-mix(in srgb, ${feat.color} 18%, transparent)`}
                className="p-5"
              >
                <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl text-white shadow"
                  style={{ background: feat.color }}>
                  {feat.icon}
                </div>
                <h3 className="mb-1.5 font-bold text-slate-900 dark:text-white text-base">{feat.title}</h3>
                <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300 font-semibold">{feat.desc}</p>
              </ThreeDInteractiveCard>
            ))}
          </div>

        </div>
      </section>



      {/* ── SUPPORTED LANGUAGES INTERACTIVE MAP ─────────────────────────────── */}
      <section id="languages" className="py-10 px-4 relative overflow-hidden">
        <div className="mx-auto max-w-5xl text-center relative z-10">
          
          <div className="mb-10 text-center">
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white">
              Supported{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent font-black">
                Languages Network
              </span>
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-semibold">
              Dotted connection paths track our regional translation relays and Tamil dictionary synchronizers.
            </p>
          </div>

          {/* Interactive World Map SVG */}
          <div className="relative h-64 sm:h-80 w-full max-w-4xl mx-auto bg-white dark:bg-black/40 border border-[#DDE5F0] dark:border-white/5 rounded-[28px] p-4 shadow-lg flex items-center justify-center overflow-hidden mb-8">
            <div className="absolute inset-0 bg-radial from-cyan-500/5 via-transparent to-transparent pointer-events-none" />
            
            {/* World outline SVG */}
            <svg className="w-4/5 h-full opacity-20 dark:opacity-15 text-slate-500 dark:text-slate-400" viewBox="0 0 1000 500" fill="currentColor">
              <path d="M150,150 Q180,100 240,120 Q300,140 280,220 Q240,280 180,240 Z" />
              <path d="M220,280 Q250,340 280,420 Q250,450 200,410 Q160,350 180,300 Z" />
              <path d="M500,120 Q550,80 620,100 Q680,120 650,200 Q580,260 520,210 Z" />
              <path d="M550,220 Q600,280 580,360 Q530,380 490,340 Z" />
              <path d="M720,150 Q780,120 850,160 Q880,220 820,280 Q760,250 740,180 Z" />
              <path d="M800,320 Q850,300 890,340 Q840,410 790,380 Z" />
            </svg>

            {/* Glowing nodes overlay */}
            <div className="absolute inset-0 pointer-events-none">
              {/* US Node */}
              <span className="absolute top-[28%] left-[25%] flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-60"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
              </span>
              {/* Europe Node */}
              <span className="absolute top-[25%] left-[56%] flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-60"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
              </span>
              {/* India Node */}
              <span className="absolute top-[42%] left-[64%] flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-60"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
              </span>
              {/* Japan Node */}
              <span className="absolute top-[32%] left-[82%] flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-60"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
              </span>

              {/* Vector connection paths */}
              <svg className="absolute inset-0 w-full h-full">
                <motion.path 
                  d="M 255 145 Q 400 80 565 130" 
                  fill="none" stroke="rgba(6, 182, 212, 0.45)" strokeWidth="1.5" strokeDasharray="5 3"
                />
                <motion.path 
                  d="M 565 130 Q 600 200 645 215" 
                  fill="none" stroke="rgba(168, 85, 247, 0.45)" strokeWidth="1.5" strokeDasharray="5 3"
                />
                <motion.path 
                  d="M 825 165 Q 750 180 645 215" 
                  fill="none" stroke="rgba(59, 130, 246, 0.45)" strokeWidth="1.5" strokeDasharray="5 3"
                />
              </svg>
            </div>

            {/* Live activity indicator badge */}
            <div className="absolute bottom-4 px-3.5 py-1.5 rounded-full bg-white/95 dark:bg-black/80 border border-[#DDE5F0] dark:border-white/10 text-[10px] font-extrabold text-slate-800 dark:text-slate-200 backdrop-blur-md flex items-center gap-1.5 shadow-lg select-none">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Translating Live Speech Stream (Tamil ➔ English)</span>
            </div>
          </div>

          {/* Languages list pills */}
          <div className="flex flex-wrap justify-center gap-2 max-w-4xl mx-auto">
            {['English', 'Tamil (தமிழ்)', 'Hindi (हिन्दी)', 'Spanish', 'French', 'German', 'Italian', 'Japanese', 'Arabic', 'Russian', 'Dutch', 'Korean', '+80 more'].map((lang) => (
              <span 
                key={lang} 
                className="rounded-full px-4 py-2 text-xs font-bold bg-white dark:bg-white/[0.02] border border-[#DDE5F0] dark:border-white/[0.06] text-slate-800 dark:text-slate-300 transition-all hover:scale-105 shadow-sm"
              >
                {lang}
              </span>
            ))}
          </div>

        </div>
      </section>



      {/* ── TESTIMONIALS CAROUSEL ───────────────────────────────────────────── */}
      <section id="testimonials" className="py-10 px-4 relative">
        <div className="mx-auto max-w-4xl">
          
          <div className="mb-12 text-center">
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white">
              Loved by{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent font-black">
                Creators
              </span>
            </h2>
          </div>

          {/* Premium testimonial slider deck */}
          <div className="relative h-44 sm:h-36 flex items-center justify-center">
            <AnimatePresence mode="wait">
              {TESTIMONIALS.map((t, idx) => {
                if (idx !== activeTestimonial) return null;
                return (
                  <motion.div
                    key={t.name}
                    initial={{ opacity: 0, scale: 0.96, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96, y: -10 }}
                    transition={{ duration: 0.35 }}
                    className="bg-white dark:bg-[#0a1120]/80 border border-[#DDE5F0] dark:border-white/10 rounded-[28px] p-6 w-full absolute shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 select-none"
                  >
                    <div className="flex-1">
                      <p className="text-sm italic leading-relaxed text-slate-800 dark:text-slate-200 font-bold mb-3">
                        "{t.text}"
                      </p>
                      <div className="flex items-center gap-3">
                        <img src={t.avatar} alt={t.name} className="h-9 w-9 rounded-full object-cover border border-[#DDE5F0] dark:border-cyan-500/20 shadow-sm" />
                        <div>
                          <h4 className="text-xs font-extrabold text-slate-900 dark:text-white leading-none">{t.name}</h4>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold block mt-0.5">{t.role}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star key={j} size={13} className="fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Slider indicator dots */}
          <div className="flex justify-center gap-2 mt-8">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveTestimonial(i)}
                className={`h-2 rounded-full transition-all duration-200 cursor-pointer ${i === activeTestimonial ? 'w-8 bg-cyan-500' : 'w-2 bg-slate-300 dark:bg-white/20'}`}
                aria-label={`Testimonial ${i + 1}`}
              />
            ))}
          </div>

        </div>
      </section>



      {/* ── VIDEO DEMO SECTION ──────────────────────────────────────────────── */}
      <section className="py-20 sm:py-28 px-4 relative overflow-hidden bg-slate-50/50 dark:bg-[#070d1e]/20 border-y border-slate-200 dark:border-white/5">
        {/* Cinematic ambient background glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-blue-500/10 via-purple-500/10 to-cyan-500/10 dark:from-blue-500/15 dark:via-purple-500/20 dark:to-cyan-500/15 rounded-full blur-[120px] pointer-events-none" />

        <div className="mx-auto max-w-5xl text-center relative z-10">
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-4 mb-16"
          >
            <h2 className="font-display text-4xl sm:text-6xl font-black tracking-tight text-slate-900 dark:text-white">
              MCC AI Platform{' '}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 dark:from-blue-400 dark:via-purple-400 dark:to-cyan-400 bg-clip-text text-transparent">
                Live Demonstration
              </span>
            </h2>
            <p className="mx-auto max-w-2xl text-sm sm:text-base text-slate-700 dark:text-slate-300 font-bold leading-relaxed">
              Watch speech recognition, translation, voice synthesis, and audio transcription working in real time.
            </p>

            {/* Mobile Badge Row */}
            <div className="flex flex-wrap justify-center gap-2 lg:hidden pt-2">
              {['Voice To Text', 'Text To Voice', 'Translation', 'Audio To Text', '100+ Languages', 'AI Powered'].map((badge) => (
                <span key={badge} className="px-2.5 py-1 rounded-full text-[10px] font-extrabold border bg-white dark:bg-[#0a1120]/80 border-slate-200 dark:border-white/10 text-slate-800 dark:text-white shadow-sm">
                  ✓ {badge}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Video Player Wrapper with relative positioning for floating badges */}
          <div className="relative max-w-3xl mx-auto mb-12">
            
            {/* Left side floating badges */}
            <div className="absolute left-[-160px] top-6 hidden lg:flex flex-col gap-6 z-20 text-left">
              {[
                { label: 'Voice To Text', delay: 0 },
                { label: 'Translation', delay: 0.4 },
                { label: '100+ Languages', delay: 0.8 }
              ].map((badge) => (
                <motion.div
                  key={badge.label}
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, delay: badge.delay, ease: "easeInOut" }}
                  className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-xs font-black border backdrop-blur-xl shadow-lg bg-white/95 dark:bg-[#0a1120]/90 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white hover:scale-105 transition-transform"
                >
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  {badge.label}
                </motion.div>
              ))}
            </div>

            {/* Right side floating badges */}
            <div className="absolute right-[-160px] top-6 hidden lg:flex flex-col gap-6 z-20 text-left">
              {[
                { label: 'Text To Voice', delay: 0.2 },
                { label: 'Audio To Text', delay: 0.6 },
                { label: 'AI Powered', delay: 1.0 }
              ].map((badge) => (
                <motion.div
                  key={badge.label}
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, delay: badge.delay, ease: "easeInOut" }}
                  className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-xs font-black border backdrop-blur-xl shadow-lg bg-white/95 dark:bg-[#0a1120]/90 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white hover:scale-105 transition-transform"
                >
                  <span className="h-2 w-2 rounded-full bg-cyan-500 animate-pulse" />
                  {badge.label}
                </motion.div>
              ))}
            </div>

            {/* Ambient light glow backing card */}
            <div className={`absolute inset-0 rounded-3xl filter blur-[40px] transition-all duration-700 pointer-events-none opacity-40 dark:opacity-75 -z-10 bg-gradient-to-tr from-blue-500/20 via-purple-500/20 to-cyan-500/20 dark:from-blue-600/30 dark:via-purple-600/30 dark:to-cyan-600/30 ${isVideoPlaying ? 'scale-[1.08] blur-[55px] opacity-60 dark:opacity-95' : ''}`} />

            {/* 3D Glass Video Container */}
            <ThreeDInteractiveCard
              glowColor="rgba(99, 102, 241, 0.2)"
              className="w-full rounded-[28px] overflow-hidden border border-slate-200 dark:border-white/10 bg-white/95 dark:bg-[#070d1e]/85 shadow-2xl p-2 sm:p-3 transition-all duration-500"
            >
              <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-950">
                <video
                  ref={videoRef}
                  src="https://assets.mixkit.co/videos/preview/mixkit-plexus-connections-background-loop-34444-large.mp4"
                  loop
                  muted={isVideoMuted}
                  onTimeUpdate={handleTimeUpdate}
                  className="w-full h-full object-cover rounded-2xl"
                  onClick={togglePlay}
                />

                {/* Big play button overlay */}
                <AnimatePresence>
                  {!isVideoPlaying && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] flex items-center justify-center cursor-pointer z-10 group/play"
                      onClick={togglePlay}
                    >
                      <div className="relative flex items-center justify-center">
                        <motion.div 
                          className="absolute h-24 w-24 rounded-full border-2 border-blue-500/40"
                          animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
                          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                        />
                        <motion.div 
                          className="absolute h-32 w-32 rounded-full border border-purple-500/20"
                          animate={{ scale: [1, 1.8, 1], opacity: [0.4, 0, 0.4] }}
                          transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
                        />
                        <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-2xl group-hover/play:scale-110 transition-transform duration-300">
                          <Play size={22} className="fill-current text-white ml-1" />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Video controls bottom bar */}
                <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-slate-950/90 via-slate-950/60 to-transparent flex items-center justify-between gap-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button onClick={togglePlay} className="text-white hover:text-blue-400 font-extrabold text-xs">
                    {isVideoPlaying ? 'PAUSE' : 'PLAY'}
                  </button>
                  <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden cursor-pointer relative" onClick={(e) => {
                    if (!videoRef.current) return;
                    const rect = e.currentTarget.getBoundingClientRect();
                    const percent = (e.clientX - rect.left) / rect.width;
                    videoRef.current.currentTime = percent * videoRef.current.duration;
                  }}>
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" 
                      style={{ width: `${videoRef.current ? (videoRef.current.currentTime / (videoRef.current.duration || 1)) * 100 : 0}%` }}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setIsVideoMuted(!isVideoMuted)} className="text-white hover:text-blue-400">
                      <Volume2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            </ThreeDInteractiveCard>
          </div>

          {/* Timeline Chapters below the video */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto mb-16"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white/70 dark:bg-[#070d1e]/80 border border-slate-200 dark:border-white/5 rounded-3xl p-6 shadow-xl backdrop-blur-xl">
              <div className="flex items-center gap-2 flex-shrink-0">
                <Clock size={16} className="text-blue-500 animate-pulse" />
                <span className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white">Interactive Chapters</span>
              </div>
              <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2.5">
                {VIDEO_CHAPTERS.map((chapter, idx) => (
                  <button
                    key={chapter.label}
                    onClick={() => seekToChapter(chapter.time)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      activeChapter === idx
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25 scale-105'
                        : 'bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span className="opacity-60 mr-1">{chapter.displayTime}</span> {chapter.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Animated Statistics Row below video */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
          >
            {[
              { value: '2M+', label: 'Active Users', color: 'from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400' },
              { value: '100+', label: 'Languages Supported', color: 'from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400' },
              { value: '99.2%', label: 'Speech Accuracy', color: 'from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400' },
              { value: '<1s', label: 'Response Time', color: 'from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400' }
            ].map((stat) => (
              <ThreeDInteractiveCard
                key={stat.label}
                glowColor="rgba(59, 130, 246, 0.15)"
                className="p-5 flex flex-col justify-center items-center text-center bg-white dark:bg-[#070d1e]/90 border border-slate-200 dark:border-white/5 rounded-2xl shadow-lg"
              >
                <div className={`text-3xl sm:text-4xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-1`}>
                  {stat.value}
                </div>
                <div className="text-[10px] sm:text-xs font-extrabold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  {stat.label}
                </div>
              </ThreeDInteractiveCard>
            ))}
          </motion.div>

        </div>
      </section>

      {/* ── MASSIVE PREMIUM CALL TO ACTION ──────────────────────────────────── */}
      <section className="py-14 px-4 relative">
        <div className="mx-auto max-w-4xl overflow-hidden rounded-[36px] p-8 sm:p-12 text-center relative border border-[#DDE5F0] dark:border-white/10 shadow-2xl bg-white dark:bg-[#070d1e]/85"
          style={{
            backdropFilter: 'blur(25px)',
          }}
        >
          <div className="pointer-events-none absolute inset-0 rounded-[36px]"
            style={{ background: 'radial-gradient(ellipse at top right, rgba(6, 182, 212, 0.08), transparent 50%)' }} />
          
          <Sparkles size={32} className="mx-auto mb-5 text-cyan-600 dark:text-cyan-400 animate-pulse" />
          
          <h2 className="font-display text-2xl font-black text-slate-900 dark:text-white sm:text-4xl md:text-5xl leading-tight">
            Launch Your Local AI Workspace
          </h2>
          
          <p className="mx-auto mt-3.5 max-w-lg text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-semibold">
            Join developers, creators, and researchers using MCC AI. Complete document translation, audio speech synthesis, and transcripts in seconds.
          </p>
          
          <button
            id="cta-launch-btn"
            onClick={() => { setViewMode('workspace'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="mt-8 inline-flex items-center gap-2.5 rounded-full bg-slate-900 dark:bg-white px-8 py-4 text-sm font-extrabold text-white dark:text-blue-900 transition-all duration-300 hover:scale-[1.04] active:scale-[0.98] shadow-lg cursor-pointer"
          >
            <Play size={13} className="fill-current" />
            Launch Workspace Free
          </button>
        </div>
      </section>
    </main>
  );
};


