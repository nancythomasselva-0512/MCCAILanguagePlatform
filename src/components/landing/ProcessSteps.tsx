import React from 'react';
import { motion } from 'framer-motion';
import { Mic, Server, Languages, FileText, ArrowUpRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { ActiveTabType } from '../../context/AppContext';

interface ProcessStepsProps {
  onLaunchTool?: (tab: ActiveTabType) => void;
}

export const ProcessSteps: React.FC<ProcessStepsProps> = ({ onLaunchTool }) => {
  const { setActiveTab, user, setIsAuthModalOpen, setAuthModalMode, logout } = useApp();

  const handleLaunch = (tab: ActiveTabType) => {
    if (onLaunchTool) {
      onLaunchTool(tab);
    } else {
      setActiveTab(tab);
      if (user) logout();
      setAuthModalMode('login');
      setIsAuthModalOpen(true);
    }
  };

  const steps = [
    {
      num: '1',
      title: 'Input Capture',
      description: 'Speak, type, or drag-and-drop raw audio streams directly inside the web browser.',
      icon: Mic,
      tab: 'voice-to-text' as ActiveTabType,
      bgColor: '#FF7A00', // Vibrant Sunset Orange
      align: 'right', // Number cap on right
    },
    {
      num: '2',
      title: 'AI Processing',
      description: 'Our ONNX runtime extracts acoustic spectrogram parameters locally.',
      icon: Server,
      tab: 'audio-transcription' as ActiveTabType,
      bgColor: '#FF5500', // Warm Coral Orange
      align: 'left', // Number cap on left
    },
    {
      num: '3',
      title: 'Neural Translation',
      description: 'Transformers map tokens and semantic fields into target accent dictionaries.',
      icon: Languages,
      tab: 'translation' as ActiveTabType,
      bgColor: '#E04828', // Deep Flame Orange
      align: 'right', // Number cap on right
    },
    {
      num: '4',
      title: 'Output Generation',
      description: 'Export formatted transcripts, download MP3 synthesis, or copy translations.',
      icon: FileText,
      tab: 'text-to-speech' as ActiveTabType,
      bgColor: '#C8371A', // Rich Terracotta Orange
      align: 'left', // Number cap on left
    },
  ];

  return (
    <section id="about-studio" className="bg-[#F8FAFC] dark:bg-[#030712] py-16 sm:py-24 overflow-hidden border-b border-gray-100 dark:border-white/5">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 lg:px-12">
        
        {/* Header Block */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mb-14 sm:mb-20 text-left"
        >
          <div className="inline-flex items-center gap-2.5 mb-4">
            <div className="w-7 h-7 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[12px] font-bold flex items-center justify-center shadow-sm">
              1
            </div>
            <span className="text-[13px] font-semibold border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-full px-4 py-1.5 bg-white dark:bg-slate-900 shadow-sm">
              Our Process Workflow
            </span>
          </div>

          <h2 className="text-[clamp(1.8rem,4vw,3.2rem)] font-medium leading-[1.12] tracking-[-0.02em] text-slate-900 dark:text-white max-w-[760px]">
            Steps to automate your speech &amp; language workflows
          </h2>
        </motion.div>

        {/* Process Steps Staggered Container */}
        <div className="flex flex-col gap-6 max-w-[920px] mx-auto relative">
          
          {steps.map((step, idx) => {
            const IconComp = step.icon;
            const isRightCap = step.align === 'right';

            return (
              <React.Fragment key={idx}>
                <motion.div
                  initial={{ opacity: 0, y: 50, x: isRightCap ? 35 : -35, scale: 0.94 }}
                  whileInView={{ opacity: 1, y: 0, x: 0, scale: 1 }}
                  viewport={{ once: false, amount: 0.25 }}
                  transition={{
                    duration: 0.65,
                    delay: 0.05,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className={`w-full flex ${
                    isRightCap ? 'justify-end pl-0 sm:pl-16' : 'justify-start pr-0 sm:pr-16'
                  }`}
                >
                  <div
                    onClick={() => handleLaunch(step.tab)}
                    className="group cursor-pointer flex items-stretch w-full max-w-[620px] rounded-[50px] shadow-[0_12px_30px_-8px_rgba(0,0,0,0.08)] dark:shadow-[0_12px_30px_-8px_rgba(0,0,0,0.5)] hover:-translate-y-1 hover:shadow-xl transition-all duration-300 overflow-hidden bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60"
                  >
                    {/* LEFT CAP (If Number Cap is on Left) */}
                    {!isRightCap && (
                      <motion.div
                        initial={{ scale: 0.8 }}
                        whileInView={{ scale: 1 }}
                        transition={{ duration: 0.4, delay: 0.15 }}
                        className="w-[90px] sm:w-[110px] shrink-0 flex items-center justify-center text-white text-3xl sm:text-4xl font-extrabold rounded-l-[50px] shadow-inner transition-transform group-hover:scale-105"
                        style={{ backgroundColor: step.bgColor }}
                      >
                        {step.num}
                      </motion.div>
                    )}

                    {/* CONTENT BODY */}
                    <div className="flex-1 px-6 sm:px-8 py-5 sm:py-6 flex items-center gap-4 sm:gap-6 justify-between">
                      {/* Left Icon (If Right Cap) */}
                      {isRightCap && (
                        <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center shrink-0 group-hover:bg-slate-900 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-slate-900 transition-colors">
                          <IconComp className="w-6 h-6" />
                        </div>
                      )}

                      {/* Text */}
                      <div className="flex-1 text-left">
                        <h3 className="text-[17px] sm:text-[19px] font-bold text-slate-900 dark:text-white mb-1 leading-snug">
                          {step.title}
                        </h3>
                        <p className="text-[13px] sm:text-[14px] text-slate-500 dark:text-slate-400 leading-normal">
                          {step.description}
                        </p>
                      </div>

                      {/* Right Icon (If Left Cap) */}
                      {!isRightCap && (
                        <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center shrink-0 group-hover:bg-slate-900 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-slate-900 transition-colors">
                          <IconComp className="w-6 h-6" />
                        </div>
                      )}
                    </div>

                    {/* RIGHT CAP (If Number Cap is on Right) */}
                    {isRightCap && (
                      <motion.div
                        initial={{ scale: 0.8 }}
                        whileInView={{ scale: 1 }}
                        transition={{ duration: 0.4, delay: 0.15 }}
                        className="w-[90px] sm:w-[110px] shrink-0 flex items-center justify-center text-white text-3xl sm:text-4xl font-extrabold rounded-r-[50px] shadow-inner transition-transform group-hover:scale-105"
                        style={{ backgroundColor: step.bgColor }}
                      >
                        {step.num}
                      </motion.div>
                    )}
                  </div>
                </motion.div>

                {/* Subtle Dotted Separator Line between steps */}
                {idx < steps.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 0.5, scale: 1 }}
                    viewport={{ once: false }}
                    transition={{ duration: 0.4 }}
                    className="flex justify-center items-center py-1 opacity-40"
                  >
                    <div className="flex gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-600" />
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-600" />
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-600" />
                    </div>
                  </motion.div>
                )}
              </React.Fragment>
            );
          })}

        </div>

        {/* Footer Action matching "Visit site ↗" */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.5 }}
          className="mt-14 pt-6 flex items-center justify-between border-t border-slate-200/60 dark:border-white/5"
        >
          <button
            onClick={() => handleLaunch('voice-to-text')}
            className="inline-flex items-center gap-2 text-[15px] font-bold text-slate-900 dark:text-white hover:text-[#FF7A00] dark:hover:text-[#FF9F1C] transition-colors group"
          >
            <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            Launch Platform Workstation
          </button>
        </motion.div>

      </div>
    </section>
  );
};
