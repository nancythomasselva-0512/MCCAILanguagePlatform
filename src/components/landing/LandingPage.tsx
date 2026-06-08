import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic, Volume2, Languages, FileAudio, ArrowRight, Sparkles,
  Zap, Globe, Shield, Clock, Star, ChevronRight, Play,
  CheckCircle2, Users, BarChart3, Headphones
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { ActiveTabType } from '../../context/AppContext';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as any },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

const TOOLS: {
  id: ActiveTabType;
  icon: React.ReactNode;
  label: string;
  tagline: string;
  description: string;
  accentColor: string;
  features: string[];
}[] = [
  {
    id: 'voice-to-text',
    icon: <Mic size={24} />,
    label: 'Voice to Text',
    tagline: 'Speak. Transcribe. Done.',
    description: 'Record live audio or upload a file — convert spoken words to accurate text instantly with language auto-detection.',
    accentColor: '#3b82f6',
    features: ['Live recording', 'Language detection', 'Copy & download'],
  },
  {
    id: 'text-to-speech',
    icon: <Volume2 size={24} />,
    label: 'Text to Voice',
    tagline: 'Type. Select. Listen.',
    description: 'Convert any text to natural-sounding speech. Choose voice, accent, speed, and pitch — then play or download.',
    accentColor: '#8b5cf6',
    features: ['20+ voice options', 'Speed & pitch control', 'Download MP3'],
  },
  {
    id: 'translation',
    icon: <Languages size={24} />,
    label: 'Text Translation',
    tagline: 'Instant. Accurate. Multilingual.',
    description: 'Translate between 100+ languages with source auto-detection. Swap languages and listen to output.',
    accentColor: '#10b981',
    features: ['100+ languages', 'Auto-detect source', 'Listen to translation'],
  },
  {
    id: 'audio-transcription',
    icon: <FileAudio size={24} />,
    label: 'Audio to Text',
    tagline: 'Upload. Process. Download.',
    description: 'Upload MP3, WAV, M4A, or AAC files to generate accurate, timestamped transcripts — editable and downloadable.',
    accentColor: '#f59e0b',
    features: ['MP3 / WAV / M4A / AAC', 'Timestamps included', 'Editable output'],
  },
];

const STATS = [
  { icon: <Users size={18} />, value: '2M+', label: 'Active Users' },
  { icon: <Globe size={18} />, value: '100+', label: 'Languages' },
  { icon: <BarChart3 size={18} />, value: '99.2%', label: 'Accuracy' },
  { icon: <Clock size={18} />, value: '<1s', label: 'Avg. Response' },
];

const TESTIMONIALS = [
  {
    name: 'Ananya Sharma',
    role: 'Content Creator',
    text: 'The Voice to Text tool saves me hours every week. The accuracy is incredible and language detection just works!',
    stars: 5,
  },
  {
    name: 'Carlos Mendez',
    role: 'Language Researcher',
    text: 'I use the Translation tool daily. Being able to swap languages and listen to pronunciation is a game-changer.',
    stars: 5,
  },
  {
    name: 'Priya Nair',
    role: 'Podcast Producer',
    text: 'Audio to Text with timestamps is exactly what I needed. Editing the transcript inline is so smooth.',
    stars: 5,
  },
];

const WORKFLOW = [
  { step: '01', title: 'Choose Your Tool', desc: 'Pick from Voice to Text, Text to Voice, Translation, or Audio Transcription.' },
  { step: '02', title: 'Provide Your Input', desc: 'Speak, type, paste text, or upload an audio file in seconds.' },
  { step: '03', title: 'AI Processes Instantly', desc: 'Our AI engine analyzes and converts your input with high accuracy.' },
  { step: '04', title: 'Export & Use', desc: 'Copy, download, or listen to your results — ready to use anywhere.' },
];

const SLIDES = [
  {
    image: '/hero_image.png',
    title: 'The Complete AI Language Platform',
    subtitle: 'Voice transcription, text-to-speech, real-time translation, and audio processing — all in one beautifully designed workspace.',
  },
  {
    image: '/slider_image_2.png',
    title: 'Intuitive Dashboard Workspace',
    subtitle: 'Switch seamlessly between Voice to Text, Text to Voice, Text Translation, and Audio to Text.',
  },
  {
    image: '/slider_image_3.png',
    title: 'High-Quality Speech Generation',
    subtitle: 'Generate and fine-tune natural speech voice overs in over 100 languages with advanced parameter controls.',
  }
];

const HeroSlider: React.FC = () => {
  const [index, setIndex] = React.useState(0);
  const [direction, setDirection] = React.useState(0);
  const { setViewMode } = useApp();

  React.useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [index]);

  const nextSlide = () => {
    setDirection(1);
    setIndex((prev) => (prev + 1) % SLIDES.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  return (
    <div className="relative w-full overflow-hidden bg-[#090b11] h-[calc(100vh-64px)] sm:h-[calc(100vh-96px)] min-h-[500px] border-b border-white/5">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={index}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: 'spring', stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 }
          }}
          className="absolute inset-0 w-full h-full"
        >
          <img
            src={SLIDES[index].image}
            alt={SLIDES[index].title}
            className="w-full h-full object-cover opacity-80 object-[center_28%]"
          />
          {/* Dark overlay for readable text */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/55 to-transparent"></div>
          
          {/* Content */}
          <div className="absolute inset-0 flex items-center pt-24 sm:pt-32">
            <div className="mx-auto max-w-7xl w-full px-6 sm:px-12 md:px-20 text-left z-10">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium"
                style={{
                  background: 'rgba(37, 99, 235, 0.2)',
                  border: '1px solid rgba(37, 99, 235, 0.4)',
                  color: '#60a5fa',
                }}
              >
                <Sparkles size={12} />
                Powered by Advanced AI Language Models
              </motion.div>

              <motion.h1
                key={`title-${index}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="font-display text-3xl font-extrabold leading-tight tracking-tight xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white mb-5 max-w-3xl"
              >
                {SLIDES[index].title === 'The Complete AI Language Platform' ? (
                  <>
                    The Complete{' '}
                    <span className="bg-gradient-to-r from-blue-500 via-blue-400 to-violet-500 bg-clip-text text-transparent">
                      AI Language
                    </span>{' '}
                    Platform
                  </>
                ) : (
                  SLIDES[index].title
                )}
              </motion.h1>

              <motion.p
                key={`subtitle-${index}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="text-sm sm:text-base lg:text-lg text-white/80 max-w-2xl mb-8 leading-relaxed"
              >
                {SLIDES[index].subtitle}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5"
              >
                <button
                  id="hero-launch-btn"
                  onClick={() => { setViewMode('workspace'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="group flex items-center justify-center gap-2.5 rounded-2xl px-6 py-3.5 sm:px-8 sm:py-4 text-sm sm:text-base font-semibold text-white transition-all duration-200 hover:-translate-y-0.5"
                  style={{ background: 'var(--accent)', boxShadow: '0 8px 24px color-mix(in srgb, var(--accent) 30%, transparent)' }}
                >
                  <Play size={16} className="fill-current" />
                  Launch Free Workspace
                  <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
                </button>
                <button
                  id="hero-explore-btn"
                  onClick={() => document.getElementById('ai-language-tools')?.scrollIntoView({ behavior: 'smooth' })}
                  className="flex items-center justify-center gap-2 rounded-2xl px-6 py-3.5 sm:px-8 sm:py-4 text-sm sm:text-base font-semibold transition-all duration-200 hover:-translate-y-0.5 text-white/95"
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    backdropFilter: 'blur(4px)',
                  }}
                >
                  Explore Tools
                  <ChevronRight size={15} />
                </button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur-sm transition-all border border-white/10 z-20 hover:scale-105"
      >
        ←
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur-sm transition-all border border-white/10 z-20 hover:scale-105"
      >
        →
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => { setDirection(i > index ? 1 : -1); setIndex(i); }}
            className={`h-2 rounded-full transition-all duration-300 ${i === index ? 'w-8 bg-blue-500' : 'w-2 bg-white/40 hover:bg-white/65'}`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export const LandingPage: React.FC = () => {
  const { setViewMode, setActiveTab } = useApp();

  const launchTool = (tab: ActiveTabType) => {
    setActiveTab(tab);
    setViewMode('workspace');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="overflow-x-hidden" style={{ background: 'var(--bg-base)' }}>

      {/* ── HERO SLIDER ──────────────────────────────────────────────────────── */}
      <HeroSlider />

      {/* ── STATS SECTION ────────────────────────────────────────────────────── */}
      <section className="relative px-4 py-6 sm:py-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="glass-card rounded-2xl px-4 py-5 text-center transition-all duration-300 hover:-translate-y-0.5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-base)', boxShadow: 'var(--shadow-sm)' }}>
                <div className="mb-1.5 flex justify-center" style={{ color: 'var(--accent)' }}>{s.icon}</div>
                <div className="font-display text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{s.value}</div>
                <div className="mt-0.5 text-xs" style={{ color: 'var(--text-muted)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ── AI TOOLS SECTION ────────────────────────────────────────────────── */}
      <section id="ai-language-tools" className="relative px-4 py-10 sm:py-14 lg:py-16">
        <div className="pointer-events-none absolute inset-0 -z-10" style={{
          background: 'linear-gradient(to bottom, transparent, color-mix(in srgb, var(--accent) 3%, transparent), transparent)',
        }} />
        {/* Ambient Glow Blobs */}
        <div className="absolute top-1/4 left-1/4 -z-10 h-72 w-72 rounded-full bg-blue-500/5 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 -z-10 h-80 w-80 rounded-full bg-purple-500/5 blur-3xl pointer-events-none" />

        <div className="mx-auto max-w-7xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}
            variants={stagger} className="mb-10 text-center">
            <motion.div variants={fadeUp}
              className="mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium"
              style={{
                background: 'color-mix(in srgb, #10b981 8%, var(--bg-card))',
                border: '1px solid color-mix(in srgb, #10b981 20%, transparent)',
                color: '#10b981',
              }}>
              <Zap size={13} /> AI Language Tools
            </motion.div>
            <motion.h2 variants={fadeUp}
              className="font-display text-2xl font-extrabold sm:text-4xl lg:text-5xl"
              style={{ color: 'var(--text-primary)' }}>
              Four Powerful Tools,{' '}
              <span className="bg-gradient-to-r from-blue-500 to-violet-500 bg-clip-text text-transparent">
                One Platform
              </span>
            </motion.h2>
            <motion.p variants={fadeUp} className="mx-auto mt-4 max-w-xl text-base"
              style={{ color: 'var(--text-secondary)' }}>
              Everything you need for voice, text, and audio language processing — fast, accurate, and accessible.
            </motion.p>
          </motion.div>

          {/* Tool Cards */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }}
            variants={stagger} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TOOLS.map((tool, i) => (
              <motion.div
                key={tool.id}
                variants={fadeUp}
                custom={i}
                className="tool-card-glow glass-card group relative flex cursor-pointer flex-col overflow-hidden rounded-[32px] p-8 sm:p-9 transition-all duration-300"
                whileHover={{
                  y: -8,
                  scale: 1.025,
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)'
                }}
                whileTap={{
                  scale: 0.975,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 400,
                  damping: 17
                }}
                onClick={() => launchTool(tool.id)}
                role="button"
                tabIndex={0}
                id={`tool-card-${tool.id}`}
                aria-label={`Open ${tool.label} tool`}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') launchTool(tool.id); }}
              >
                {/* Subtle gradient overlay */}
                <div className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: `linear-gradient(135deg, color-mix(in srgb, ${tool.accentColor} 5%, transparent), transparent)`,
                  }} />

                {/* Icon */}
                <div className="relative mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110"
                  style={{
                    background: `color-mix(in srgb, ${tool.accentColor} 12%, var(--bg-subtle))`,
                    color: tool.accentColor,
                    border: `1px solid color-mix(in srgb, ${tool.accentColor} 20%, transparent)`,
                  }}>
                  {tool.icon}
                </div>

                {/* Content */}
                <div className="relative flex flex-1 flex-col">
                  <p className="mb-0.5 text-xs font-semibold uppercase tracking-widest"
                    style={{ color: 'var(--text-muted)' }}>{tool.tagline}</p>
                  <h3 className="mb-2.5 font-display text-2xl font-bold"
                    style={{ color: 'var(--text-primary)' }}>{tool.label}</h3>
                  <p className="mb-5 text-sm leading-relaxed"
                    style={{ color: 'var(--text-secondary)' }}>{tool.description}</p>

                  {/* Feature chips */}
                  <div className="mb-6 flex flex-wrap gap-1.5">
                    {tool.features.map((f) => (
                      <span key={f} className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium"
                        style={{
                          background: 'var(--bg-subtle)',
                          border: '1px solid var(--border-base)',
                          color: 'var(--text-secondary)',
                        }}>
                        <CheckCircle2 size={9} className="text-emerald-500" />
                        {f}
                      </span>
                    ))}
                  </div>

                  {/* CTA */}
                  <button
                    className="group/btn mt-auto flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-base font-bold transition-all duration-200"
                    style={{
                      background: `color-mix(in srgb, ${tool.accentColor} 8%, var(--bg-subtle))`,
                      border: `1px solid color-mix(in srgb, ${tool.accentColor} 20%, transparent)`,
                      color: tool.accentColor,
                    }}
                  >
                    Open Tool
                    <ArrowRight size={13} className="transition-transform group-hover/btn:translate-x-0.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────────────────────── */}
      <section id="workflow" className="px-4 py-10 sm:py-14">
        <div className="mx-auto max-w-5xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}
            variants={stagger} className="mb-8 text-center">
            <motion.h2 variants={fadeUp} className="font-display text-4xl font-extrabold"
              style={{ color: 'var(--text-primary)' }}>How It Works</motion.h2>
            <motion.p variants={fadeUp} className="mx-auto mt-3 max-w-lg text-base"
              style={{ color: 'var(--text-secondary)' }}>From input to output in seconds — no setup required.</motion.p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }}
            variants={stagger} className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Connector line (desktop) */}
            <div className="pointer-events-none absolute top-10 left-[12.5%] hidden h-0.5 w-3/4 lg:block"
              style={{ background: 'linear-gradient(to right, color-mix(in srgb, var(--accent) 20%, transparent), color-mix(in srgb, #8b5cf6 20%, transparent), color-mix(in srgb, #f59e0b 20%, transparent))' }} />

            {WORKFLOW.map((w, i) => (
              <motion.div
                key={w.step}
                variants={fadeUp}
                custom={i}
                className="glass-card relative rounded-2xl p-6"
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl font-display text-lg font-bold text-white shadow-md"
                  style={{ background: 'linear-gradient(135deg, var(--accent), #8b5cf6)' }}>
                  {w.step}
                </div>
                <h3 className="mb-2 font-semibold" style={{ color: 'var(--text-primary)' }}>{w.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{w.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── WHY MCC AI ──────────────────────────────────────────────────────── */}
      <section id="features" className="relative px-4 py-10 sm:py-14">
        <div className="pointer-events-none absolute inset-0 -z-10"
          style={{ background: 'linear-gradient(to bottom, transparent, color-mix(in srgb, #8b5cf6 3%, transparent), transparent)' }} />
        {/* Ambient Glow Blob */}
        <div className="absolute top-1/2 left-1/3 -z-10 h-72 w-72 rounded-full bg-purple-500/5 blur-3xl pointer-events-none" />

        <div className="mx-auto max-w-6xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={stagger}>
            <motion.div variants={fadeUp} className="mb-8 text-center">
              <h2 className="font-display text-2xl sm:text-4xl font-extrabold" style={{ color: 'var(--text-primary)' }}>Why MCC AI?</h2>
              <p className="mx-auto mt-3 max-w-lg text-base" style={{ color: 'var(--text-secondary)' }}>
                Built for speed, accuracy, and a seamless experience across every device.
              </p>
            </motion.div>

            <motion.div variants={stagger} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { icon: <Zap size={20} />, title: 'Lightning Fast', desc: 'Sub-second processing for real-time transcription and translation.', color: '#f59e0b' },
                { icon: <Shield size={20} />, title: 'Private & Secure', desc: 'All processing stays client-side. Your data never leaves your browser.', color: '#10b981' },
                { icon: <Globe size={20} />, title: '100+ Languages', desc: 'Full support for major world languages with dialect variants.', color: '#3b82f6' },
                { icon: <Headphones size={20} />, title: 'Natural Voices', desc: '20+ neural voice options with natural prosody and emotion.', color: '#8b5cf6' },
                { icon: <Clock size={20} />, title: 'Always Available', desc: 'No login required. Open the tool and start working instantly.', color: '#f97316' },
                { icon: <Sparkles size={20} />, title: 'AI-Powered', desc: 'State-of-the-art models for industry-leading accuracy.', color: '#ec4899' },
              ].map((feat, i) => (
                <motion.div
                  key={feat.title}
                  variants={fadeUp}
                  custom={i}
                  className="glass-card rounded-2xl p-6"
                  whileHover={{ y: -5, scale: 1.015 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{ color: feat.color, background: `color-mix(in srgb, ${feat.color} 10%, var(--bg-subtle))` }}>
                    {feat.icon}
                  </div>
                  <h3 className="mb-1.5 font-semibold" style={{ color: 'var(--text-primary)' }}>{feat.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{feat.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── LANGUAGES ───────────────────────────────────────────────────────── */}
      <section id="languages" className="px-4 py-10 sm:py-14">
        <div className="mx-auto max-w-5xl text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.h2 variants={fadeUp} className="font-display text-2xl sm:text-4xl font-extrabold"
              style={{ color: 'var(--text-primary)' }}>Supported Languages</motion.h2>
            <motion.p variants={fadeUp} className="mx-auto mt-3 max-w-lg text-base"
              style={{ color: 'var(--text-secondary)' }}>From widely spoken global languages to regional dialects.</motion.p>
            <motion.div variants={fadeUp} className="mt-10 flex flex-wrap justify-center gap-2.5">
              {['English', 'Tamil', 'Hindi', 'Spanish', 'French', 'German', 'Portuguese', 'Arabic', 'Japanese', 'Korean', 'Chinese', 'Russian', 'Italian', 'Dutch', 'Polish', 'Turkish', 'Vietnamese', 'Thai', 'Indonesian', 'Swahili', 'Bengali', 'Urdu', '+80 more'].map((lang) => (
                <span key={lang} className="rounded-full px-3.5 py-1.5 text-sm font-medium"
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-base)',
                    color: 'var(--text-secondary)',
                    boxShadow: 'var(--shadow-sm)',
                  }}>
                  {lang}
                </span>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── TESTIMONIALS ────────────────────────────────────────────────────── */}
      <section id="testimonials" className="relative px-4 py-10 sm:py-14">
        <div className="pointer-events-none absolute inset-0 -z-10"
          style={{ background: 'linear-gradient(to bottom, transparent, color-mix(in srgb, #f59e0b 3%, transparent), transparent)' }} />
        <div className="mx-auto max-w-5xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.div variants={fadeUp} className="mb-8 text-center">
              <h2 className="font-display text-2xl sm:text-4xl font-extrabold" style={{ color: 'var(--text-primary)' }}>Loved by Users</h2>
            </motion.div>
            <motion.div variants={stagger} className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
              {TESTIMONIALS.map((t, i) => (
                <motion.div
                  key={t.name}
                  variants={fadeUp}
                  custom={i}
                  className="glass-card rounded-2xl p-6"
                  whileHover={{ y: -5, scale: 1.015 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <div className="mb-3 flex gap-0.5">
                    {Array.from({ length: t.stars }).map((_, j) => (
                      <Star key={j} size={13} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="mb-4 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>"{t.text}"</p>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{t.name}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{t.role}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── CTA BANNER ──────────────────────────────────────────────────────── */}
      <section className="px-4 pb-16 pt-4">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="mx-auto max-w-4xl overflow-hidden rounded-2xl sm:rounded-3xl p-6 sm:p-10 text-center relative"
          style={{
            background: 'linear-gradient(135deg, #1e40af, #2563eb, #7c3aed)',
            boxShadow: '0 20px 60px color-mix(in srgb, #2563eb 30%, transparent)',
          }}
        >
          {/* Subtle radial overlay */}
          <div className="pointer-events-none absolute inset-0 rounded-3xl"
            style={{ background: 'radial-gradient(ellipse at top right, rgba(255,255,255,0.1), transparent 60%)' }} />
          <Sparkles size={34} className="mx-auto mb-4" style={{ color: 'rgba(255,255,255,0.8)' }} />
          <h2 className="font-display text-xl font-extrabold text-white sm:text-3xl md:text-4xl">
            Ready to transform your workflow?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm sm:text-base" style={{ color: 'rgba(255,255,255,0.75)' }}>
            Join 2 million users already using MCC AI Language Platform — free, instant, no account required.
          </p>
          <button
            id="cta-launch-btn"
            onClick={() => { setViewMode('workspace'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="mt-6 sm:mt-8 inline-flex items-center gap-2.5 rounded-xl sm:rounded-2xl bg-white px-6 py-3.5 sm:px-8 sm:py-4 text-sm sm:text-base font-bold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
            style={{ color: '#1e40af' }}
          >
            <Play size={16} className="fill-current" />
            Launch Workspace Now
          </button>
        </motion.div>
      </section>
    </main>
  );
};
