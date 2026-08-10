import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface UserDashboardProps {
  setActiveTab: (tab: string) => void;
  setHistoryOpen?: (open: boolean) => void;
}

const ROTATING_QUOTES = [
  "like to translate?",
  "like to speak?",
  "like to upload?",
  "like to text?",
  "like to transcribe?",
  "like to voiceover?",
];

export default function UserDashboard({ setActiveTab, setHistoryOpen }: UserDashboardProps) {
  const { setViewMode, globalConfig } = useApp();
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % ROTATING_QUOTES.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  const cards = [
    {
      id: 'text-to-speech',
      badge: 'Text Generation',
      badgeColor: '#ff5f03',
      title: 'Text to Voice',
      description: 'Convert text into lifelike speech with ultra-realistic AI voices.',
      linkText: 'Start generating',
      bgClass: 'bg-[#fff7ed]',
      hoverClass: 'hover:bg-[#ffedd5]',
      pattern: (
        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-30 pointer-events-none flex items-center justify-end overflow-hidden pr-4">
          <div className="flex gap-2">
            <div className="h-32 w-12 rounded-full bg-[#ff5f03] transform rotate-45 -mr-4" />
            <div className="h-32 w-12 rounded-full bg-[#f97316] transform rotate-45 -mr-4" />
            <div className="h-32 w-12 rounded-full bg-[#fdba74] transform rotate-45" />
          </div>
        </div>
      )
    },
    {
      id: 'audio-transcription',
      badge: 'Speech Recognition',
      badgeColor: '#171717',
      title: 'Audio to Text',
      description: 'Transcribe audio files into highly accurate text instantly.',
      linkText: 'Start transcribing',
      bgClass: 'bg-[#fafaf9]',
      hoverClass: 'hover:bg-[#f5f5f4]',
      pattern: (
        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-20 pointer-events-none flex flex-col items-end justify-center overflow-hidden pr-4 gap-4">
          <div className="h-20 w-20 rounded-full bg-black" />
          <div className="h-20 w-20 rounded-t-full bg-black" />
        </div>
      )
    },
    {
      id: 'voice-to-text',
      badge: 'Live Processing',
      badgeColor: '#f97316',
      title: 'Transcription',
      description: 'Real-time voice-to-text transcription for live speech and dictation.',
      linkText: 'Start recording',
      bgClass: 'bg-[#fffbe6]',
      hoverClass: 'hover:bg-[#fef3c7]',
      pattern: (
        <div className="absolute right-[-10%] top-[-10%] bottom-0 w-2/3 opacity-30 pointer-events-none flex items-center justify-center overflow-hidden">
          <div className="h-48 w-48 rounded-full border-[24px] border-[#fb923c] flex items-center justify-center">
             <div className="h-24 w-24 rounded-full bg-[#fdba74]" />
          </div>
        </div>
      )
    },
    {
      id: 'translation',
      badge: 'Multi-language',
      badgeColor: '#ff5f03',
      title: 'Translation',
      description: 'Translate text across languages with contextual AI understanding.',
      linkText: 'Start translating',
      bgClass: 'bg-[#fff7ed]',
      hoverClass: 'hover:bg-[#ffedd5]',
      pattern: (
        <div className="absolute right-0 bottom-0 w-1/2 h-full opacity-30 pointer-events-none flex items-end justify-end overflow-hidden p-4">
          <div className="grid grid-cols-2 gap-2 transform rotate-12 translate-x-4 translate-y-4">
            <div className="h-20 w-20 rounded-[20px] bg-[#fdba74]" />
            <div className="h-20 w-20 rounded-[20px] bg-[#fb923c]" />
            <div className="h-20 w-20 rounded-[20px] rounded-bl-[40px] bg-[#ff5f03]" />
            <div className="h-20 w-20 rounded-[20px] bg-[#fed7aa]" />
          </div>
        </div>
      )
    },
    {
      id: 'tenant-billing',
      badge: 'Workspace',
      badgeColor: '#c2410c',
      title: 'Plans & Billing',
      description: 'Manage your subscription, limits, and billing history easily.',
      linkText: 'View plans',
      bgClass: 'bg-[#fff1f2]',
      hoverClass: 'hover:bg-[#ffe4e6]',
      pattern: (
        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-30 pointer-events-none flex items-center justify-end overflow-hidden pr-4">
          <div className="h-32 w-32 rounded-full border-4 border-[#fb923c] flex items-center justify-center">
             <div className="h-16 w-16 bg-[#fdba74] rotate-45" />
          </div>
        </div>
      )
    },
    {
      id: 'history',
      badge: 'Activity',
      badgeColor: '#ea580c',
      title: 'Activity History',
      description: 'Review your past generations, transcriptions, and usage logs.',
      linkText: 'View history',
      bgClass: 'bg-[#fff7ed]',
      hoverClass: 'hover:bg-[#ffedd5]',
      pattern: (
        <div className="absolute right-[-5%] top-[-5%] bottom-0 w-1/2 opacity-30 pointer-events-none flex items-center justify-center overflow-hidden">
          <div className="w-full h-full bg-gradient-to-bl from-[#f97316] to-transparent rounded-full blur-2xl transform scale-150" />
        </div>
      )
    }
  ];

  const handleNavigation = (id: string) => {
    if (id === 'history') {
      setActiveTab('history-page');
    } else {
      setActiveTab(id);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 text-left">
        <div>
          
          <div className="flex flex-wrap items-center gap-x-3 text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight mt-1">
            <span>What would you</span>
            <div className="inline-flex items-center overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.span
                  key={quoteIndex}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 italic font-serif font-bold text-2xl sm:text-3xl md:text-4xl"
                >
                  {ROTATING_QUOTES[quoteIndex]}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
        {cards.map((card, index) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            key={card.id}
            onClick={() => handleNavigation(card.id)}
            className={`relative overflow-hidden cursor-pointer rounded-[2rem] p-8 ${card.bgClass} ${card.hoverClass} transition-colors duration-300 shadow-sm hover:shadow-md`}
          >
            {/* Pattern */}
            {card.pattern}

            {/* Content */}
            <div className="relative z-10 flex flex-col h-full max-w-[65%]">
              <div className="bg-white/90 backdrop-blur-sm self-start px-3 py-1.5 rounded-full flex items-center gap-2 mb-6 shadow-sm border border-black/5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: card.badgeColor }} />
                <span className="text-xs font-semibold text-slate-700">{card.badge}</span>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-3">
                {card.title}
              </h2>

              <p className="text-slate-700 text-sm leading-relaxed mb-10 min-h-[40px]">
                {card.description}
              </p>

              <div className="mt-auto flex items-center gap-2 text-slate-900 font-bold text-sm group">
                {card.linkText}
                <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
