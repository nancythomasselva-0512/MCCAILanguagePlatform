'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic, Volume2, Languages, FileAudio, ArrowRight, Sparkles,
  Zap, Globe, Shield, Clock, Star, ChevronRight, ChevronUp, Play,
  CheckCircle2, Users, BarChart3, Headphones, Plus, Activity,
  Server, Database, ArrowRightLeft, FileCode, X, Menu,
  Mail, Phone, MapPin, Sun, Moon
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { ActiveTabType } from '../../context/AppContext';
import { HeroNeuralSphere } from './HeroNeuralSphere';
import { AnimatedCounter } from './AnimatedCounter';
import { NeuralBackground } from './NeuralBackground';
import { HeroShaderBackground } from './HeroShaderBackground';
import { CoreFeatures } from './CoreFeatures';
import { ProcessSteps } from './ProcessSteps';
import { PinnedWorkflow } from './PinnedWorkflow';
import { LanguageMarquee } from './LanguageMarquee';
import { FaqAccordion } from './FaqAccordion';
import { ContactSection } from './ContactSection';
import { FooterParallax } from './FooterParallax';

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
  const { user, setViewMode, setActiveTab, globalConfig, setIsAuthModalOpen, setAuthModalMode, logout, theme, toggleTheme } = useApp();
  const [isPlansModalOpen, setIsPlansModalOpen] = useState(false);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [dbPlans, setDbPlans] = useState<any[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [londonTime, setLondonTime] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    fetch('/api/billing/plans')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
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
            <div className="flex items-center gap-3 pl-4 sm:pl-5 md:pl-6">
              <button
                onClick={() => {
                  if (user) logout();
                  setAuthModalMode('login');
                  setIsAuthModalOpen(true);
                }}
                className="flex items-center gap-2.5 cursor-pointer text-left select-none"
              >
                <img src="/logo.png?v=3" alt="Logo" className="h-8 sm:h-9 md:h-10 w-auto object-contain hover:scale-105 dark:invert-0 dark:brightness-100 invert brightness-90 filter transition-all duration-200" />
                <div className="flex flex-col min-w-0 justify-center">
                  <span className="font-extrabold text-sm sm:text-base tracking-tight text-gray-900 dark:text-white leading-tight">
                    {globalConfig?.branding?.platform_name || 'Fluentia'}
                  </span>
                  <span className="text-[8px] sm:text-[8.5px] text-orange-500 dark:text-orange-400 font-extrabold tracking-[0.05em] uppercase whitespace-nowrap">
                    AI Language Platform
                  </span>
                </div>
              </button>
              <div className="hidden md:flex items-center gap-6 text-[14px] font-medium text-gray-900 dark:text-gray-100 pl-4">
                <a href="#ai-models" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors duration-300">AI Models</a>
                <a href="#process" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors duration-300">Process</a>
                <a href="#pricing" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors duration-300">Pricing</a>
                <a href="#faq" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors duration-300">FAQ</a>
                <a href="#contact" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors duration-300">Contact</a>
              </div>
            </div>

            {/* RIGHT */}
            <div className="hidden md:flex items-center gap-3 pr-1">
              <button
                id="landing-theme-toggle-btn"
                onClick={(e) => {
                  e.preventDefault();
                  toggleTheme();
                }}
                className="flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer flex-shrink-0 bg-gray-100 dark:bg-white/10 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-white/15"
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                aria-label="Toggle theme"
              >
                {theme === 'light' ? <Moon size={16} className="transition-transform duration-300 hover:rotate-12" /> : <Sun size={16} className="transition-transform duration-300 hover:rotate-45" />}
              </button>
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
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Navigation</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleTheme()}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 dark:bg-white/10 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-white/15"
                      aria-label="Toggle theme"
                    >
                      {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
                    </button>
                    <button onClick={() => setMobileMenuOpen(false)} className="text-gray-500">
                      <X size={20} />
                    </button>
                  </div>
                </div>
                <div className="flex flex-col space-y-3 text-[22px] font-medium text-gray-900 dark:text-white">
                  <a href="#ai-models" onClick={() => setMobileMenuOpen(false)}>AI Models</a>
                  <a href="#process" onClick={() => setMobileMenuOpen(false)}>Process</a>
                  <a href="#pricing" onClick={() => setMobileMenuOpen(false)}>Pricing</a>
                  <a href="#faq" onClick={() => setMobileMenuOpen(false)}>FAQ</a>
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
            [ {globalConfig?.branding?.platform_name || 'Fluentia'} LANGUAGE PLATFORM ]
          </p>

          <h1 className="text-[clamp(1.75rem,7vw,4.2rem)] sm:text-[clamp(2.5rem,5vw,4.2rem)] font-medium leading-[1.08] tracking-[-0.03em] text-gray-900 dark:text-white max-w-5xl">
            {globalConfig?.branding?.platform_name || 'Fluentia'} — Next-Gen{' '}
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

      {/* ── SECTION 1: PINNED WORKFLOW (4 CORE AI MODULES) ───────────── */}
      <PinnedWorkflow onLaunchTool={(tab) => setActiveTab(tab)} />

      {/* ── LANGUAGE MARQUEE SECTION (100+ SUPPORTED LANGUAGES) ─────────────── */}
      <LanguageMarquee />

      {/* ── SECTION 2: PROCESS STEPS WORKFLOW ─────────────────────────────────── */}
      <ProcessSteps onLaunchTool={(tab) => setActiveTab(tab)} />

      {/* ── CORE FEATURES MARKETING SECTION (SECTION 3: PRICING) ─────────────────── */}
      <CoreFeatures dbPlans={dbPlans} />

      {/* ── SECTION 4: FREQUENTLY ASKED QUESTIONS ACCORDION ───────────────────── */}
      <FaqAccordion />

      {/* ── SECTION 5: ENTERPRISE CONTACT & INQUIRY FORM ─────────────────────── */}
      <ContactSection />

      {/* ── ABOUT SECTION (Process, Features, Languages) ─────────────────────────── */}
      <div id="about">
      </div>










    
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

      {/* ── PARALLAX HAUL FOOTER ─────────────────────────────────────────── */}
      <FooterParallax />

      {/* ── FLOATING AUTOMATIC SCROLL TO TOP BUTTON ───────────────────────── */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            whileHover={{ scale: 1.12, y: -2 }}
            whileTap={{ scale: 0.92 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-tr from-orange-500 via-amber-500 to-orange-600 text-white shadow-xl shadow-orange-500/35 border border-white/20 cursor-pointer transition-all duration-300 group"
            title="Scroll to top"
            aria-label="Scroll to top"
          >
            <ChevronUp size={24} className="group-hover:-translate-y-1 transition-transform duration-300 text-white stroke-[2.5]" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-400" />
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </main>
  );
};


