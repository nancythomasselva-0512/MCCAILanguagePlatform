import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface UserDashboardProps {
  setActiveTab: (tab: string) => void;
  setHistoryOpen?: (open: boolean) => void;
}

export default function UserDashboard({ setActiveTab, setHistoryOpen }: UserDashboardProps) {
  const { setViewMode } = useApp();
  
  const cards = [
    {
      id: 'text-to-speech',
      badge: 'Text Generation',
      badgeColor: '#0d9488',
      title: 'Text to Voice',
      description: 'Convert text into lifelike speech with ultra-realistic AI voices.',
      linkText: 'Start generating',
      bgClass: 'bg-[#f0fdfa]',
      hoverClass: 'hover:bg-[#ccfbf1]',
      pattern: (
        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-30 pointer-events-none flex items-center justify-end overflow-hidden pr-4">
          <div className="flex gap-2">
            <div className="h-32 w-12 rounded-full bg-[#14b8a6] transform rotate-45 -mr-4" />
            <div className="h-32 w-12 rounded-full bg-[#2dd4bf] transform rotate-45 -mr-4" />
            <div className="h-32 w-12 rounded-full bg-[#5eead4] transform rotate-45" />
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
      bgClass: 'bg-[#f5f5f5]',
      hoverClass: 'hover:bg-[#eaeaea]',
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
      badgeColor: '#8b5cf6',
      title: 'Transcription',
      description: 'Real-time voice-to-text transcription for live speech and dictation.',
      linkText: 'Start recording',
      bgClass: 'bg-[#ede9fe]',
      hoverClass: 'hover:bg-[#e4dcff]',
      pattern: (
        <div className="absolute right-[-10%] top-[-10%] bottom-0 w-2/3 opacity-30 pointer-events-none flex items-center justify-center overflow-hidden">
          <div className="h-48 w-48 rounded-full border-[24px] border-[#a78bfa] flex items-center justify-center">
             <div className="h-24 w-24 rounded-full bg-[#c4b5fd]" />
          </div>
        </div>
      )
    },
    {
      id: 'translation',
      badge: 'Multi-language',
      badgeColor: '#10b981',
      title: 'Translation',
      description: 'Translate text across languages with contextual AI understanding.',
      linkText: 'Start translating',
      bgClass: 'bg-[#dcfce7]',
      hoverClass: 'hover:bg-[#c9fbd8]',
      pattern: (
        <div className="absolute right-0 bottom-0 w-1/2 h-full opacity-30 pointer-events-none flex items-end justify-end overflow-hidden p-4">
          <div className="grid grid-cols-2 gap-2 transform rotate-12 translate-x-4 translate-y-4">
            <div className="h-20 w-20 rounded-[20px] bg-[#6ee7b7]" />
            <div className="h-20 w-20 rounded-[20px] bg-[#34d399]" />
            <div className="h-20 w-20 rounded-[20px] rounded-bl-[40px] bg-[#10b981]" />
            <div className="h-20 w-20 rounded-[20px] bg-[#a7f3d0]" />
          </div>
        </div>
      )
    },
    {
      id: 'tenant-billing',
      badge: 'Workspace',
      badgeColor: '#06b6d4',
      title: 'Plans & Billing',
      description: 'Manage your subscription, limits, and billing history easily.',
      linkText: 'View plans',
      bgClass: 'bg-[#cffafe]',
      hoverClass: 'hover:bg-[#bbf7d0]', // Actually wait, #bbf7d0 is green. #a5f3fc is cyan.
      pattern: (
        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-30 pointer-events-none flex items-center justify-end overflow-hidden pr-4">
          <div className="h-32 w-32 rounded-full border-4 border-[#22d3ee] flex items-center justify-center">
             <div className="h-16 w-16 bg-[#67e8f9] rotate-45" />
          </div>
        </div>
      )
    },
    {
      id: 'history',
      badge: 'Activity',
      badgeColor: '#3b82f6',
      title: 'Activity History',
      description: 'Review your past generations, transcriptions, and usage logs.',
      linkText: 'View history',
      bgClass: 'bg-[#dbeafe]',
      hoverClass: 'hover:bg-[#bfdbfe]',
      pattern: (
        <div className="absolute right-[-5%] top-[-5%] bottom-0 w-1/2 opacity-30 pointer-events-none flex items-center justify-center overflow-hidden">
          <div className="w-full h-full bg-gradient-to-bl from-[#60a5fa] to-transparent rounded-full blur-2xl transform scale-150" />
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
      <div className="mb-8 flex items-center gap-4">
        <button
          onClick={() => { setViewMode('landing'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 transition-all cursor-pointer hover:scale-105 active:scale-95 flex-shrink-0 hover:bg-slate-50 dark:hover:bg-slate-700"
          title="Back to Home"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-none mb-1">Welcome to Fluentia</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Select a tool below to get started with your workflow.</p>
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
