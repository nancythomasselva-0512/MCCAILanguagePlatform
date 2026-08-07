import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic, Volume2, Languages, FileAudio, ArrowRight, Sparkles,
  Zap, Globe, Shield, Clock, Star, ChevronRight, Play,
  CheckCircle2, Users, BarChart3, Headphones, Plus, Activity,
  Server, Database, ArrowRightLeft, FileCode, X, Menu,
  Mail, Phone, MapPin
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { ActiveTabType } from '../../context/AppContext';
import { HeroNeuralSphere } from './HeroNeuralSphere';
import { AnimatedCounter } from './AnimatedCounter';
import { NeuralBackground } from './NeuralBackground';
import { HeroShaderBackground } from './HeroShaderBackground';

// ── STARBURST COMPASS ICON FOR PARTNER BADGE ─────────────────────────────────
const StarburstIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-5 h-5 sm:w-6 sm:h-6 fill-current text-[#E8704E] shrink-0">
    <path d="m19.6 66.5 19.7-11 .3-1-.3-.5h-1l-3.3-.2-11.2-.3L14 53l-9.5-.5-2.4-.5L0 49l.2-1.5 2-1.3 2.9.2 6.3.5 9.5.6 6.9.4L38 49.1h1.6l.2-.7-.5-.4-.4-.4L29 41l-10.6-7-5.6-4.1-3-2-1.5-2-.6-4.2 2.7-3 3.7.3.9.2 3.7 2.9 8 6.1L37 36l1.5 1.2.6-.4.1-.3-.7-1.1L33 25l-6-10.4-2.7-4.3-.7-2.6c-.3-1-.4-2-.4-3l3-4.2L28 0l4.2.6L33.8 2l2.6 6 4.1 9.3L47 29.9l2 3.8 1 3.4.3 1h.7v-.5l.5-7.2 1-8.7 1-11.2.3-3.2 1.6-3.8 3-2L61 2.6l2 2.9-.3 1.8-1.1 7.7L59 27.1l-1.5 8.2h.9l1-1.1 4.1-5.4 6.9-8.6 3-3.5L77 13l2.3-1.8h4.3l3.1 4.7-1.4 4.9-4.4 5.6-3.7 4.7-5.3 7.1-3.2 5.7.3.4h.7l12-2.6 6.4-1.1 7.6-1.3 3.5 1.6.4 1.6-1.4 3.4-8.2 2-9.6 2-14.3 3.3-.2.1.2.3 6.4.6 2.8.2h6.8l12.6 1 3.3 2 1.9 2.7-.3 2-5.1 2.6-6.8-1.6-16-3.8-5.4-1.3h-.8v.4l4.6 4.5 8.3 7.5L89 80.1l.5 2.4-1.3 2-1.4-.2-9.2-7-3.6-3-8-6.8h-.5v.7l1.8 2.7 9.8 14.7.5 4.5-.7 1.4-2.6 1-2.7-.6-5.8-8-6-9-4.7-8.2-.5.4-2.9 30.2-1.3 1.5-3 1.2-2.5-2-1.4-3 1.4-6.2 1.6-8 1.3-6.4 1.2-7.9.7-2.6v-.2H49L43 72l-9 12.3-7.2 7.6-1.7.7-3-1.5.3-2.8L24 86l10-12.8 6-7.9 4-4.6-.1-.5h-.3L17.2 77.4l-4.7.6-2-2 .2-3 1-1 8-5.5Z"/>
  </svg>
);

// ── TEXT ROLL HOVER BUTTON COMPONENT ─────────────────────────────────────────
const TextRollButton = ({
  text,
  onClick,
  bgClass = "bg-gray-900 text-white",
  iconBgClass = "bg-white text-gray-900",
  arrowColorClass = "",
  paddingClass = "pl-5 pr-2 py-2"
}: {
  text: string;
  onClick?: () => void;
  bgClass?: string;
  iconBgClass?: string;
  arrowColorClass?: string;
  paddingClass?: string;
}) => (
  <button
    onClick={onClick}
    className={`group relative inline-flex items-center gap-3 rounded-full font-medium text-[13px] sm:text-[14px] cursor-pointer ${bgClass} ${paddingClass} transition-all duration-300 shadow-md`}
  >
    <div className="flex flex-col h-[20px] overflow-hidden leading-[20px]">
      <span className="transform group-hover:-translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]">
        {text}
      </span>
      <span className="transform group-hover:-translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]">
        {text}
      </span>
    </div>
    <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-rotate-45 ${iconBgClass}`}>
      <ArrowRight size={14} className={arrowColorClass} />
    </div>
  </button>
);

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

// const VIDEO_CHAPTERS = [
//   { time: 5, label: 'Voice To Text', displayTime: '00:05' },
//   { time: 15, label: 'Translation', displayTime: '00:15' },
//   { time: 25, label: 'Text To Voice', displayTime: '00:25' },
//   { time: 35, label: 'Audio To Text', displayTime: '00:35' },
//   { time: 50, label: 'Export Features', displayTime: '00:50' },
// ];

export const LandingPage: React.FC = () => {
  const { user, setViewMode, setActiveTab, globalConfig, setIsAuthModalOpen, setAuthModalMode, logout } = useApp();
  const [isPlansModalOpen, setIsPlansModalOpen] = useState(false);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [dbPlans, setDbPlans] = useState<any[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [londonTime, setLondonTime] = useState('');

  useEffect(() => {
    fetch('/api/billing/plans')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setDbPlans(data);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const updateTime = () => {
      try {
        const formatter = new Intl.DateTimeFormat('en-GB', {
          timeZone: 'Europe/London',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        });
        setLondonTime(formatter.format(new Date()));
      } catch (e) {
        const d = new Date();
        setLondonTime(`${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`);
      }
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const launchTool = (tab: ActiveTabType) => {
    setActiveTab(tab);
    if (user) logout(); // Wipe session to force re-login
    setAuthModalMode('login');
    setIsAuthModalOpen(true);
  };

  return (
    <main id="landing" className="overflow-x-hidden relative min-h-screen text-slate-900 dark:text-slate-100" style={{ background: 'var(--bg-base)' }}>
      {/* ── SECTION 1: HERO (Full viewport height) ───────────────────────────── */}
      <section className="relative min-h-screen h-[100vh] h-[100svh] flex flex-col justify-between overflow-hidden bg-[#EFEFEF] dark:bg-[#080d18] text-gray-900 dark:text-white border-b border-gray-200 dark:border-white/5">
        
        {/* Full-screen Animated Shader Overlay */}
        <HeroShaderBackground />

        {/* Navigation (z-20 relative) */}
        <header className="relative z-20 w-full max-w-[1440px] mx-auto p-2 sm:p-3">
          <nav className="bg-white dark:bg-slate-900 rounded-full p-[5px] shadow-md border border-slate-200 dark:border-white/10 flex items-center justify-between">
            {/* LEFT */}
            <div className="flex items-center gap-3 pl-1">
              <button
                onClick={() => {
                  if (user) logout();
                  setAuthModalMode('login');
                  setIsAuthModalOpen(true);
                }}
                className="flex items-center gap-2.5 cursor-pointer"
              >
                <img src="/logo.png?v=2" alt="Logo" className="h-7 w-7 sm:h-8 sm:w-8 object-contain brightness-125" />
                <span className="font-extrabold text-sm sm:text-base tracking-tight text-gray-900 dark:text-white">
                  {globalConfig?.branding?.platform_name || 'MCC AI'}
                </span>
              </button>
              <div className="hidden md:flex items-center gap-6 text-[14px] font-medium text-gray-900 dark:text-gray-100 pl-4">
                <a href="#ai-language-tools" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors duration-300">AI Tools</a>
                <a href="#about-studio" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors duration-300">Capabilities</a>
                <a href="#pricing" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors duration-300">Pricing</a>
                <a href="#contact" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors duration-300">Contact</a>
              </div>
            </div>

            {/* RIGHT */}
            <div className="hidden md:flex items-center gap-4 pr-1">
              <span className="text-[13px] text-emerald-600 dark:text-emerald-400 font-semibold hidden lg:flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                Engine Status: Online
              </span>
              <div className="flex items-center gap-1.5 text-[13px] text-gray-600 dark:text-gray-400 font-normal">
                <Clock size={14} className="text-gray-500 shrink-0" />
                <span>{londonTime || '12:00'} in London</span>
              </div>
              <TextRollButton
                text="Launch AI Workstation"
                onClick={() => {
                  if (user) logout();
                  setAuthModalMode('login');
                  setIsAuthModalOpen(true);
                }}
              />
            </div>

            {/* MOBILE MENU TOGGLE */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden bg-gray-900 text-white rounded-full p-2.5 flex items-center justify-center"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </nav>
        </header>

        {/* MOBILE MENU OVERLAY */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col justify-end"
              onClick={() => setMobileMenuOpen(false)}
            >
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-slate-900 rounded-2xl mx-3 mb-3 p-6 shadow-2xl space-y-6"
              >
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/10 pb-4">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock size={14} />
                    <span>{londonTime} in London</span>
                  </div>
                  <button onClick={() => setMobileMenuOpen(false)} className="text-gray-500">
                    <X size={20} />
                  </button>
                </div>
                <div className="flex flex-col space-y-4 text-[28px] font-medium text-gray-900 dark:text-white">
                  <a href="#ai-language-tools" onClick={() => setMobileMenuOpen(false)}>AI Tools</a>
                  <a href="#about-studio" onClick={() => setMobileMenuOpen(false)}>Capabilities</a>
                  <a href="#pricing" onClick={() => setMobileMenuOpen(false)}>Pricing</a>
                  <a href="#contact" onClick={() => setMobileMenuOpen(false)}>Contact</a>
                </div>
                <TextRollButton
                  text="Launch AI Workstation"
                  bgClass="bg-[#F26522] hover:bg-[#e05a1a] text-white w-full justify-between"
                  arrowColorClass="text-[#F26522]"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (user) logout();
                    setAuthModalMode('login');
                    setIsAuthModalOpen(true);
                  }}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hero Content (z-20) */}
        <div className="relative z-20 max-w-[1440px] w-full mx-auto px-5 sm:px-8 lg:px-12 pb-14 sm:pb-16 lg:pb-20 flex-1 flex flex-col justify-end">
          <p className="text-[13px] sm:text-[14px] text-gray-900 dark:text-gray-100 tracking-wide font-semibold mb-5 sm:mb-8 uppercase">
            [ {globalConfig?.branding?.platform_name || 'MCC AI'} LANGUAGE PLATFORM ]
          </p>

          <h1 className="text-[clamp(1.75rem,7vw,4.2rem)] sm:text-[clamp(2.5rem,5vw,4.2rem)] font-medium leading-[1.08] tracking-[-0.03em] text-gray-900 dark:text-white max-w-5xl">
            {globalConfig?.branding?.platform_name || 'MCC AI'} — Next-Gen{' '}
            <br className="hidden sm:block" />
            <span className="sm:hidden"> </span>
            AI Language Platform for Voice,{' '}
            <br className="hidden sm:block" />
            <span className="sm:hidden"> </span>
            Speech & Real-Time Translation.
          </h1>

          <p className="mt-4 text-sm sm:text-base text-gray-700 dark:text-gray-300 max-w-2xl font-medium leading-relaxed">
            Local client-side Whisper transcription, multi-speaker neural voice synthesis, and zero-latency document translation loaded into a high-performance desktop workstation.
          </p>

          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5">
            <TextRollButton
              text="Launch AI Workstation"
              bgClass="bg-[#F26522] hover:bg-[#e05a1a] text-white"
              arrowColorClass="text-[#F26522]"
              paddingClass="pl-5 sm:pl-6 pr-2 py-2"
              onClick={() => {
                if (user) logout();
                setAuthModalMode('login');
                setIsAuthModalOpen(true);
              }}
            />

            <div className="bg-white dark:bg-slate-900 rounded-[4px] px-3.5 py-2 flex items-center gap-2 border border-slate-200 dark:border-white/10 shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)] transition-shadow duration-300 cursor-pointer">
              <StarburstIcon />
              <span className="text-[13px] sm:text-[14px] font-medium text-gray-900 dark:text-white">
                Certified AI Engine
              </span>
              <span className="text-[10px] sm:text-[11px] font-bold bg-gray-900 text-white px-1.5 sm:px-2 py-0.5 rounded ml-1">
                v2.4 Active
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: ABOUT ─────────────────────────────────────────────────── */}
      <section id="about-studio" className="bg-white dark:bg-[#030712] pt-16 sm:pt-20 lg:pt-32 pb-12 sm:pb-16 lg:pb-24 overflow-hidden border-b border-gray-100 dark:border-white/5">
        <div className="max-w-[1440px] mx-auto">
          {/* Badge Row */}
          <div className="px-5 sm:px-8 lg:px-12 flex items-center gap-3 mb-6 sm:mb-8">
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gray-900 text-white text-[11px] sm:text-[12px] font-semibold flex items-center justify-center">
              1
            </div>
            <span className="text-[12px] sm:text-[13px] font-medium border border-gray-200 dark:border-white/10 text-gray-900 dark:text-gray-100 rounded-full px-3 sm:px-4 py-1 sm:py-1.5">
              Introducing {globalConfig?.branding?.platform_name || 'MCC AI'} Engine
            </span>
          </div>

          {/* Heading h2 */}
          <h2 className="text-[clamp(1.5rem,4vw,3.2rem)] font-medium leading-[1.12] tracking-[-0.02em] text-gray-900 dark:text-white mb-12 sm:mb-16 lg:mb-28 px-5 sm:px-8 lg:px-12">
            Neural speech processing, delivering{' '}
            <br className="hidden sm:block" />
            unmatched accuracy across 100+ languages.
          </h2>

          {/* DESKTOP LAYOUT (lg:grid) */}
          <div className="hidden lg:grid grid-cols-[26%_1fr_48%] items-end gap-6 xl:gap-8 px-5 sm:px-8 lg:px-12">
            {/* Left Col: Small Image */}
            <div className="self-end overflow-hidden rounded-2xl aspect-[438/346] shadow-lg group">
              <img
                src="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260516_090123_74be96d4-9c1b-40cf-932a-96f4f4babed3.png&w=1280&q=85"
                alt="AI Speech Intelligence"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Center Col: Paragraph + Button */}
            <div className="self-start flex flex-col justify-end items-start pb-2">
              <p className="text-[16px] xl:text-[18px] leading-[1.65] font-medium text-gray-900 dark:text-gray-200 mb-6">
                Through deep learning models, <br />
                client-side Whisper processing, and <br />
                neural voice cloning, we empower global teams.
              </p>
              <TextRollButton
                text="Explore AI Modules"
                bgClass="bg-[#F26522] hover:bg-[#e05a1a] text-white"
                arrowColorClass="text-[#F26522]"
                onClick={() => document.getElementById('ai-language-tools')?.scrollIntoView({ behavior: 'smooth' })}
              />
            </div>

            {/* Right Col: Large Image */}
            <div className="self-end overflow-hidden rounded-2xl aspect-[3/2] shadow-lg group">
              <img
                src="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260516_090133_c157d30b-a99a-4477-bec1-a446149ec3f2.png&w=1280&q=85"
                alt="Language Workstation"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

          {/* MOBILE/TABLET LAYOUT (lg:hidden) */}
          <div className="lg:hidden px-5 sm:px-8 space-y-8">
            <p className="text-[15px] sm:text-[17px] leading-[1.6] font-medium text-gray-900 dark:text-gray-200">
              Through deep learning models, client-side Whisper processing, and neural voice cloning, we empower global teams to automate language workflows.
            </p>
            <TextRollButton
              text="Explore AI Modules"
              bgClass="bg-[#F26522] hover:bg-[#e05a1a] text-white"
              arrowColorClass="text-[#F26522]"
              onClick={() => document.getElementById('ai-language-tools')?.scrollIntoView({ behavior: 'smooth' })}
            />
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 pt-4">
              <div className="sm:w-[45%] aspect-[438/346] rounded-xl sm:rounded-2xl overflow-hidden shadow-md">
                <img
                  src="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260516_090123_74be96d4-9c1b-40cf-932a-96f4f4babed3.png&w=1280&q=85"
                  alt="AI Speech Intelligence"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="sm:w-[55%] aspect-[900/600] rounded-xl sm:rounded-2xl overflow-hidden shadow-md">
                <img
                  src="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260516_090133_c157d30b-a99a-4477-bec1-a446149ec3f2.png&w=1280&q=85"
                  alt="Language Workstation"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 3: CASE STUDIES / FEATURED AI MODULES ─────────────────────── */}
      <section id="ai-language-tools" className="bg-[#F5F5F5] dark:bg-[#090f1d] pt-16 sm:pt-20 lg:pt-28 pb-16 sm:pb-20 lg:pb-28">
        <div className="max-w-[1440px] mx-auto">
          {/* Badge Row */}
          <div className="px-5 sm:px-8 lg:px-12 flex items-center gap-3 mb-6 sm:mb-8">
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gray-900 text-white text-[11px] sm:text-[12px] font-semibold flex items-center justify-center">
              2
            </div>
            <span className="text-[12px] sm:text-[13px] font-medium border border-gray-300 dark:border-white/10 text-gray-900 dark:text-gray-100 rounded-full px-3 sm:px-4 py-1 sm:py-1.5">
              Featured AI Workstations
            </span>
          </div>

          {/* Heading h2 */}
          <h2 className="text-[clamp(1.75rem,7vw,4.2rem)] sm:text-[clamp(2.5rem,5vw,4.2rem)] font-medium leading-[1.08] tracking-[-0.03em] text-gray-900 dark:text-white mb-10 sm:mb-14 lg:mb-16 px-5 sm:px-8 lg:px-12">
            Our AI Modules
          </h2>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 lg:gap-7 px-5 sm:px-8 lg:px-12">
            
            {/* CARD 1: Voice to Text */}
            <div className="flex flex-col group cursor-pointer" onClick={() => launchTool('voice-to-text')}>
              <div className="aspect-[329/246] rounded-2xl overflow-hidden bg-[#1a1d2e] relative shadow-md">
                <video
                  src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260516_122702_390f5305-8719-41d5-ae80-d23ab3796c28.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                />
                
                {/* Expanding Hover Pill Button */}
                <div className="absolute bottom-4 left-4 h-9 w-9 group-hover:w-[154px] rounded-full bg-white shadow-lg flex items-center justify-between px-2.5 transition-all duration-300 ease-in-out overflow-hidden z-20">
                  <span className="text-[13px] font-medium text-gray-900 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-100">
                    Launch Voice AI
                  </span>
                  <svg className="w-3.5 h-3.5 text-gray-900 transform -rotate-45 group-hover:rotate-0 transition-transform duration-300 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                  </svg>
                </div>
              </div>
              <p className="text-[13px] sm:text-[14px] text-gray-600 dark:text-gray-400 mt-4 leading-relaxed">
                Real-time client-side speech recognition with automatic timestamp alignment and multi-speaker detection.
              </p>
              <h3 className="text-[14px] sm:text-[15px] font-semibold text-gray-900 dark:text-white mt-1">
                Voice-to-Text & Audio Transcription
              </h3>
            </div>

            {/* CARD 2: Translation */}
            <div className="flex flex-col group cursor-pointer" onClick={() => launchTool('translation')}>
              <div className="aspect-square rounded-2xl overflow-hidden bg-[#6b6b6b] relative shadow-md">
                <video
                  src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260516_123323_f909c2b8-ff6c-4edf-882b-8ebcdbe389b5.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                />
                
                {/* Expanding Hover Pill Button */}
                <div className="absolute bottom-4 left-4 h-9 w-9 group-hover:w-[168px] rounded-full bg-gray-900 text-white shadow-lg flex items-center justify-between px-2.5 transition-all duration-300 ease-in-out overflow-hidden z-20">
                  <span className="text-[13px] font-medium text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-100">
                    Launch Translator
                  </span>
                  <ArrowRight size={14} className="text-white transform -rotate-45 group-hover:rotate-0 transition-transform duration-300 shrink-0" />
                </div>
              </div>
              <p className="text-[13px] sm:text-[14px] text-gray-600 dark:text-gray-400 mt-4 leading-relaxed">
                Neural machine translation supporting 100+ global languages with formatting retention and speech playback.
              </p>
              <h3 className="text-[14px] sm:text-[15px] font-semibold text-gray-900 dark:text-white mt-1">
                Real-Time Multi-Lingual Translation
              </h3>
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



      {/* ── ABOUT SECTION (Process, Features, Languages) ─────────────────────────── */}
      <div id="about">
        {/* ── HOW IT WORKS (INTERACTIVE PROCESS ROW) ─────────────────────────── */}
        <section className="py-10 px-4 relative overflow-hidden">
        <div className="mx-auto max-w-5xl">
          
          <div className="mb-14 text-center">
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white">
              Interactive AI{' '}
              <span className="bg-gradient-to-r from-teal-600 to-emerald-600 dark:from-teal-400 dark:to-emerald-400 bg-clip-text text-transparent font-black">
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
              style={{ background: 'linear-gradient(to right, #14b8a6, #0d9488, #10b981, #059669)' }} />

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
                    style={{ background: 'linear-gradient(135deg, #14b8a6, #10b981)' }}>
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



      {/* ── WHY FLUENTIA (STRIPE-STYLE GRID) ──────────────────────────────────── */}
      <section className="py-10 px-4 relative">
        <div className="mx-auto max-w-6xl">
          
          <div className="mb-14 text-center">
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white">
              Enterprise{' '}
              <span className="bg-gradient-to-r from-teal-600 to-emerald-600 dark:from-teal-400 dark:to-emerald-400 bg-clip-text text-transparent font-black">
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
      <section className="py-10 px-4 relative overflow-hidden">
        <div className="mx-auto max-w-5xl text-center relative z-10">
          
          <div className="mb-10 text-center">
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white">
              Supported{' '}
              <span className="bg-gradient-to-r from-teal-600 to-emerald-600 dark:from-teal-400 dark:to-emerald-400 bg-clip-text text-transparent font-black">
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
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-60"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-teal-500"></span>
              </span>
              {/* India Node */}
              <span className="absolute top-[42%] left-[64%] flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
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
                  fill="none" stroke="rgba(16, 185, 129, 0.45)" strokeWidth="1.5" strokeDasharray="5 3"
                />
                <motion.path 
                  d="M 825 165 Q 750 180 645 215" 
                  fill="none" stroke="rgba(20, 184, 166, 0.45)" strokeWidth="1.5" strokeDasharray="5 3"
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
      </div>



      {/* ── TOOLS SECTION (PREMIUM PRODUCT SHOWCASES) ───────────────────────── */}
      <section id="ai-language-tools" className="relative py-10 px-4">
        <div className="mx-auto max-w-7xl">
          
          <div className="mb-14 text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[10px] font-extrabold uppercase tracking-widest bg-teal-500/10 dark:bg-teal-500/10 border border-teal-500/30 text-teal-700 dark:text-teal-400 mb-4 shadow-[0_0_15px_rgba(37,99,235,0.1)]">
              <Zap size={11} /> AI Language Workstation
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white">
              Center Stage{' '}
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 dark:from-teal-400 dark:via-cyan-400 dark:to-emerald-400 bg-clip-text text-transparent font-black">
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
                            className="w-1.5 bg-teal-600 dark:bg-teal-500 rounded-full"
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
                        <div className="flex justify-between items-center text-[7px] text-emerald-700 dark:text-emerald-400 font-extrabold uppercase tracking-wider">
                          <span>Synthesizing Voice</span>
                          <span>480Hz</span>
                        </div>
                        <div className="flex gap-1 h-6 items-center">
                          {[4, 2, 7, 5, 8, 3, 6, 2, 5, 4, 8, 3].map((h, i) => (
                            <motion.span
                              key={i}
                              className="flex-1 bg-emerald-600 dark:bg-emerald-500 rounded-full"
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



      {/* ── PRICING & PLAN DETAILS SECTION ───────────────────────────────────── */}
      <section id="pricing" className="py-20 sm:py-28 px-4 relative overflow-hidden bg-slate-50/50 dark:bg-[#070d1e]/20 border-y border-slate-200 dark:border-white/5">
        {/* Cinematic ambient background glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-teal-500/10 via-emerald-500/10 to-cyan-500/10 dark:from-teal-500/15 dark:via-emerald-500/20 dark:to-cyan-500/15 rounded-full blur-[120px] pointer-events-none" />

        <div className="mx-auto max-w-5xl text-center relative z-10">
          <div className="space-y-4 mb-16">
            <span className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[10px] font-extrabold uppercase tracking-widest bg-teal-500/10 dark:bg-teal-500/10 border border-teal-500/30 text-teal-700 dark:text-teal-400 mb-4 shadow-[0_0_15px_rgba(37,99,235,0.1)]">
              <Zap size={11} /> Pricing Plans
            </span>
            <h2 className="font-display text-4xl sm:text-6xl font-black tracking-tight text-slate-900 dark:text-white">
              SaaS{' '}
              <span className="bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 dark:from-teal-400 dark:via-emerald-400 dark:to-cyan-400 bg-clip-text text-transparent">
                Plan Details
              </span>
            </h2>
            <p className="mx-auto max-w-2xl text-sm sm:text-base text-slate-700 dark:text-slate-300 font-bold leading-relaxed">
              Start with our full-featured Free Trial and upgrade as your team grows.
            </p>
          </div>

          <div className="relative z-10 flex items-center justify-center gap-3 pt-2 mb-10">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-[0.15em] transition-all duration-200 ${
                billingCycle === 'monthly'
                  ? 'bg-teal-500 text-white shadow-[0_4px_14px_rgba(20,184,166,0.4)]'
                  : 'bg-white/70 dark:bg-white/5 text-slate-500 dark:text-slate-400 border border-teal-200/60 dark:border-teal-900/40 hover:border-teal-300'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-[0.15em] transition-all duration-200 flex items-center gap-2 ${
                billingCycle === 'yearly'
                  ? 'bg-teal-500 text-white shadow-[0_4px_14px_rgba(20,184,166,0.4)]'
                  : 'bg-white/70 dark:bg-white/5 text-slate-500 dark:text-slate-400 border border-teal-200/60 dark:border-teal-900/40 hover:border-teal-300'
              }`}
            >
              Yearly
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-black tracking-wider ${
                billingCycle === 'yearly' ? 'bg-white/30 text-white' : 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
              }`}>
                Save 30%
              </span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
            {/* Free Trial Card */}
            <ThreeDInteractiveCard
              glowColor="rgba(59, 130, 246, 0.15)"
              className="p-8 flex flex-col justify-between items-start text-left bg-white dark:bg-[#070d1e]/90 border border-slate-200 dark:border-white/5 rounded-3xl shadow-xl relative"
            >
              <div className="w-full">
                <div className="flex justify-between items-center mb-4">
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-teal-500/10 text-teal-600 dark:text-teal-400 tracking-wider">
                    Most Popular
                  </span>
                  <span className="text-sm font-bold text-slate-500 dark:text-slate-400">7 Days Trial</span>
                </div>
                <h3 className="font-display text-3xl font-black text-slate-900 dark:text-white mb-2">Free Trial</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold mb-6">
                  Perfect for experiencing the complete {globalConfig?.branding?.platform_name || 'MCC AI'} platform workstation locally on your device.
                </p>
                <div className="h-[1px] bg-slate-200 dark:bg-white/5 my-4" />
                <ul className="space-y-4">
                  <li className="flex items-center gap-3">
                    <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-slate-800 dark:text-white">7 Days Trial Period</p>
                      <p className="text-[10px] text-slate-500">Unrestricted system access</p>
                    </div>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-slate-800 dark:text-white">Audio Processing</p>
                      <p className="text-[10px] text-slate-500">30 minutes of translation & transcription</p>
                    </div>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-slate-800 dark:text-white">Translation Services</p>
                      <p className="text-[10px] text-slate-500">25,000 characters processed</p>
                    </div>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-slate-800 dark:text-white">Text-to-Speech (TTS)</p>
                      <p className="text-[10px] text-slate-500">10,000 synthesis characters</p>
                    </div>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-slate-800 dark:text-white">Cloud Storage Allocation</p>
                      <p className="text-[10px] text-slate-500">100 MB secure isolated storage</p>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="w-full mt-8">
                <button
                  onClick={() => { if (!user) { setAuthModalMode('login'); setIsAuthModalOpen(true); } else { setViewMode('workspace'); window.scrollTo({ top: 0, behavior: 'smooth' }); } }}
                  className="w-full py-3 px-6 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold cursor-pointer transition-colors shadow-lg text-center block"
                >
                  Start 7-Day Free Trial
                </button>
              </div>
            </ThreeDInteractiveCard>

            {/* Upgrade Plans Card */}
            <ThreeDInteractiveCard
              glowColor="rgba(168, 85, 247, 0.15)"
              className="p-8 flex flex-col justify-between items-start text-left bg-white dark:bg-[#070d1e]/90 border border-slate-200 dark:border-white/5 rounded-3xl shadow-xl"
            >
              <div className="w-full">
                <div className="flex justify-between items-center mb-4">
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 tracking-wider">
                    Paid Tiers
                  </span>
                  <span className="text-sm font-bold text-slate-500 dark:text-slate-400">Post-Trial Options</span>
                </div>
                <h3 className="font-display text-3xl font-black text-slate-900 dark:text-white mb-2">Upgrade Plans</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold mb-6">
                  After your 7-day trial concludes, select one of our premium enterprise tiers:
                </p>
                <div className="h-[1px] bg-slate-200 dark:bg-white/5 my-4" />
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-white/5 flex justify-between items-center">
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">Starter Plan</h4>
                      <p className="text-[10px] text-slate-500">60 mins audio / 100k translation / 50k TTS</p>
                    </div>
                    <span className="text-base font-black text-teal-600 dark:text-teal-400">{billingCycle === "yearly" ? "$13/mo" : "$19/mo"}</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-white/5 flex justify-between items-center">
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">Professional Plan</h4>
                      <p className="text-[10px] text-slate-500">300 mins audio / 500k translation / 250k TTS</p>
                    </div>
                    <span className="text-base font-black text-teal-600 dark:text-teal-400">{billingCycle === "yearly" ? "$34/mo" : "$49/mo"}</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-white/5 flex justify-between items-center">
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">Enterprise Plan</h4>
                      <p className="text-[10px] text-slate-500">1200 mins audio / 2M translation / 1M TTS</p>
                    </div>
                    <span className="text-base font-black text-teal-600 dark:text-teal-400">{billingCycle === "yearly" ? "$104/mo" : "$149/mo"}</span>
                  </div>
                </div>
              </div>
              <div className="w-full mt-8">
                <button
                  onClick={() => setIsPlansModalOpen(true)}
                  className="w-full py-3 px-6 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 text-slate-900 dark:text-white text-xs font-bold cursor-pointer transition-colors text-center block"
                >
                  Explore Pricing Details
                </button>
              </div>
            </ThreeDInteractiveCard>
          </div>
        </div>
      </section>

      {/* ── MASSIVE PREMIUM CALL TO ACTION ──────────────────────────────────── */}
      <section id="contact" className="py-14 px-4 relative">
        <div className="mx-auto max-w-4xl overflow-hidden rounded-[36px] p-8 sm:p-12 text-center relative border border-[#DDE5F0] dark:border-white/10 shadow-2xl bg-white dark:bg-[#070d1e]/85"
          style={{
            backdropFilter: 'blur(25px)',
          }}
        >
          <div className="pointer-events-none absolute inset-0 rounded-[36px]"
            style={{ background: 'radial-gradient(ellipse at top right, rgba(6, 182, 212, 0.08), transparent 50%)' }} />
          
          <div className="flex flex-col items-center justify-center space-y-6">
            <h2 className="font-display text-3xl font-black text-slate-900 dark:text-white sm:text-5xl">
              Get in Touch
            </h2>
            <p className="text-slate-600 dark:text-slate-300 max-w-2xl text-center mb-8">
              Have questions about our enterprise plans, custom integrations, or need technical support? Our team is ready to help you build the future of AI language processing.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl mt-4">
              <a href="https://mail.google.com/mail/?view=cm&fs=1&to=aachinancy@gmail.com" target="_blank" rel="noopener noreferrer" className="block p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-white/5 flex flex-col items-center text-center transition-transform hover:scale-105 cursor-pointer">
                <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center mb-4">
                  <Mail className="text-teal-600 dark:text-teal-400" size={24} />
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-1">Email Us</h4>
                <span className="text-sm text-teal-600 dark:text-teal-400 hover:underline">aachinancy@gmail.com</span>
              </a>
              
              <a href="tel:+18005550199" className="block p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-white/5 flex flex-col items-center text-center transition-transform hover:scale-105 cursor-pointer">
                <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center mb-4">
                  <Phone className="text-teal-600 dark:text-teal-400" size={24} />
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-1">Call Us</h4>
                <span className="text-sm text-teal-600 dark:text-teal-400 hover:underline">+1 (800) 555-0199</span>
              </a>

              <a href="https://maps.google.com/?q=MMIP,MCC,Tambaram,600059" target="_blank" rel="noopener noreferrer" className="block p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-white/5 flex flex-col items-center text-center transition-transform hover:scale-105 cursor-pointer">
                <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center mb-4">
                  <MapPin className="text-teal-600 dark:text-teal-400" size={24} />
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-1">Office</h4>
                <span className="text-sm text-slate-600 dark:text-slate-400">MMIP, MCC, Tambaram<br/>600059</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    
      {isPlansModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-2xl w-full shadow-2xl relative border border-[#DDE5F0] dark:border-white/10">
            <button onClick={() => setIsPlansModalOpen(false)} className="absolute top-4 right-4 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer">
              <X size={24} />
            </button>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Premium Plan Details</h3>
            
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              {(() => {
                const FEATURE_LABEL_MAP: Record<string, string> = {
                  v2t_live: `Live Voice-to-Text Speech Capture`,
                  v2t_vocab: 'Custom Speech Vocabulary & Noise Filtering',
                  v2t_export: 'Real-time Transcript Export (SRT/VTT)',
                  t2v_neural: `Neural Multi-Speaker Voices`,
                  t2v_controls: 'Pitch, Speed & Accent Controls',
                  t2v_download: 'HD Audio Download (WAV / MP3)',
                  trans_instant: `Instant Multi-Language Translation`,
                  doc_5pages: 'Document Upload (Up to 5 Pages)',
                  doc_25pages: 'Document Upload (Up to 25 Pages)',
                  doc_parallel: 'High-Speed Parallel Document Chunking',
                  audio_whatsapp: 'WhatsApp Audio Transcribe (.ogg/.m4a)',
                  audio_long: 'Long Audio Processing (60+ mins)',
                  audio_timestamps: 'Automated Timestamps & Word Counts',
                  cloud_storage: `Cloud Storage & History`,
                  custom_api: 'Custom API & Webhooks Access',

                  audio_processing: `Live Voice-to-Text Speech Capture`,
                  translation_services: `Fast Multi-Language Translation`,
                  text_to_speech: `Voice Synthesis TTS`,
                  read_aloud: 'Read Aloud & Audio Narration',
                  whatsapp_audio: 'WhatsApp Audio Transcribe (.ogg/.m4a)',
                  doc_ocr: 'Document OCR & PDF Intelligence',
                  auto_detect: 'Multi-Language Auto Detection',
                  custom_vocab: 'Custom AI Vocabulary & Glossary',
                  parallel_chunks: 'High-Speed Parallel Processing',
                  font_selector: 'Dynamic Font Family Selector',
                  theme_toggle: 'Dark / Light Glassmorphism Theme',
                  audio_export: 'Export HD Audio (WAV / MP3)',
                  srt_vtt_export: 'Export Subtitles (SRT / VTT)',
                  enterprise_support: '24/7 Dedicated Enterprise Support',
                  tenant_branding: 'Custom Tenant Domain & Branding',
                  audit_logs: 'Security & Audit Logging',
                  high_priority_queue: 'High Priority Processing Queue',
                  unlimited_history: 'Unlimited Activity History'
                };

                const plansToDisplay = dbPlans.length > 0 ? dbPlans : [
                  { id: '1', name: 'Starter', price: 19, transcription_limit: 60, translation_limit: 100000, tts_limit: 50000, storage_limit: 500, features: ['v2t_live', 't2v_neural', 'trans_instant', 'doc_5pages', 'audio_whatsapp', 'cloud_storage'] },
                  { id: '2', name: 'Professional', price: 49, transcription_limit: 300, translation_limit: 500000, tts_limit: 250000, storage_limit: 5000, features: ['v2t_live', 'v2t_vocab', 'v2t_export', 't2v_neural', 't2v_controls', 't2v_download', 'trans_instant', 'doc_25pages', 'audio_whatsapp', 'audio_long', 'cloud_storage'] },
                  { id: '3', name: 'Enterprise', price: 149, transcription_limit: 1200, translation_limit: 2000000, tts_limit: 1000000, storage_limit: 10000, features: ['v2t_live', 'v2t_vocab', 'v2t_export', 't2v_neural', 't2v_controls', 't2v_download', 'trans_instant', 'doc_25pages', 'doc_parallel', 'audio_whatsapp', 'audio_long', 'audio_timestamps', 'cloud_storage', 'custom_api'] }
                ];

                return plansToDisplay.map((plan: any) => {
                  const mPrice = plan.price;
                  const displayPrice = billingCycle === "yearly" ? `₹${(mPrice * 10).toFixed(0)}/yr` : `₹${mPrice}/mo`;
                  const featureLabels = (plan.features && plan.features.length > 0)
                    ? plan.features.map((fId: string) => FEATURE_LABEL_MAP[fId] || fId)
                    : [`${plan.transcription_limit} mins Voice-to-Text`, `Instant Translation`, `Text-to-Voice TTS`, `${plan.storage_limit} MB Storage`];

                  return (
                    <div key={plan.id} className="p-5 border border-slate-200 dark:border-white/10 rounded-2xl bg-slate-50 dark:bg-slate-800/50 space-y-3">
                      <div className="flex justify-between items-center border-b border-slate-200/60 dark:border-slate-700/60 pb-3">
                        <h4 className="font-extrabold text-lg text-slate-900 dark:text-white">{plan.name} Plan</h4>
                        <span className="text-base font-black text-teal-600 dark:text-teal-400">{displayPrice}</span>
                      </div>
                      <ul className="text-xs text-slate-700 dark:text-slate-300 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {featureLabels.map((featText: string, fIdx: number) => (
                          <li key={fIdx} className="flex items-center gap-2">
                            <CheckCircle2 size={14} className="text-teal-500 flex-shrink-0" />
                            <span>{featText}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        </div>
      )}
</main>
  );
};


