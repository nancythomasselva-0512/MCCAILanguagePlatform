import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Cpu, Radio, ShieldCheck } from 'lucide-react';

interface LanguageItem {
  flag: string;
  name: string;
  native: string;
  accuracy: string;
}

const languagesRow1: LanguageItem[] = [
  { flag: '🇮🇳', name: 'Tamil', native: 'தமிழ்', accuracy: '99.2%' },
  { flag: '🇺🇸', name: 'English', native: 'Global', accuracy: '99.9%' },
  { flag: '🇮🇳', name: 'Hindi', native: 'हिंदी', accuracy: '99.4%' },
  { flag: '🇪🇸', name: 'Spanish', native: 'Español', accuracy: '99.1%' },
  { flag: '🇯🇵', name: 'Japanese', native: '日本語', accuracy: '98.9%' },
  { flag: '🇫🇷', name: 'French', native: 'Français', accuracy: '99.3%' },
  { flag: '🇩🇪', name: 'German', native: 'Deutsch', accuracy: '99.0%' },
  { flag: '🇦🇪', name: 'Arabic', native: 'العربية', accuracy: '98.8%' },
  { flag: '🇮🇳', name: 'Telugu', native: 'తెలుగు', accuracy: '99.0%' },
  { flag: '🇮🇳', name: 'Malayalam', native: 'മലയാളം', accuracy: '98.7%' },
];

const languagesRow2: LanguageItem[] = [
  { flag: '🇮🇳', name: 'Kannada', native: 'கன்னட / ಕನ್ನಡ', accuracy: '98.9%' },
  { flag: '🇮🇳', name: 'Bengali', native: 'বাংলা', accuracy: '99.1%' },
  { flag: '🇮🇳', name: 'Marathi', native: 'मराठी', accuracy: '98.8%' },
  { flag: '🇨🇳', name: 'Chinese', native: '中文', accuracy: '99.0%' },
  { flag: '🇰🇷', name: 'Korean', native: '한국어', accuracy: '99.2%' },
  { flag: '🇮🇹', name: 'Italian', native: 'Italiano', accuracy: '99.1%' },
  { flag: '🇧🇷', name: 'Portuguese', native: 'Português', accuracy: '99.0%' },
  { flag: '🇷🇺', name: 'Russian', native: 'Русский', accuracy: '98.6%' },
  { flag: '🇮🇳', name: 'Gujarati', native: 'ગુજરાતી', accuracy: '98.5%' },
  { flag: '🇮🇳', name: 'Punjabi', native: 'ਪੰਜਾਬੀ', accuracy: '98.7%' },
];

export const LanguageMarquee: React.FC = () => {
  return (
    <section id="languages" className="relative bg-[#FAFAFC] dark:bg-[#040814] py-12 sm:py-16 overflow-hidden border-b border-gray-100 dark:border-white/5">
      <style>{`
        @keyframes marquee-scroll {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-scroll-reverse {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0%); }
        }
        .animate-marquee-left {
          display: flex;
          width: max-content;
          animation: marquee-scroll 35s linear infinite;
        }
        .animate-marquee-right {
          display: flex;
          width: max-content;
          animation: marquee-scroll-reverse 35s linear infinite;
        }
        .animate-marquee-left:hover,
        .animate-marquee-right:hover {
          animation-play-state: paused;
        }
        .marquee-mask {
          mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
        }
      `}</style>

      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 lg:px-12 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4"
        >
          <div>
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="text-[12px] font-bold text-orange-600 bg-orange-50 dark:bg-orange-950/60 border border-orange-200 dark:border-orange-800/50 rounded-full px-3 py-1 flex items-center gap-1.5 shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                100+ Global &amp; Indian Languages
              </span>
            </div>
            <h2 className="text-[clamp(1.75rem,3.5vw,2.75rem)] font-medium leading-[1.15] tracking-[-0.02em] text-slate-900 dark:text-white">
              Supported Languages &amp; Dialects
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-[580px]">
              High-accuracy speech synthesis, translation, and transcription tuned for regional accents.
            </p>
          </div>

          {/* Micro Badges */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <span className="inline-flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full px-3 py-1.5 shadow-sm">
              <Cpu className="w-3.5 h-3.5 text-blue-500" />
              Auto Dialect Detection
            </span>
            <span className="inline-flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full px-3 py-1.5 shadow-sm">
              <Radio className="w-3.5 h-3.5 text-emerald-500" />
              Neural Phonemes
            </span>
          </div>
        </motion.div>
      </div>

      {/* Marquee Rows Container */}
      <div className="relative w-full overflow-hidden marquee-mask space-y-3 sm:space-y-4">
        {/* Row 1: Left Scroll */}
        <div className="overflow-hidden">
          <div className="animate-marquee-left gap-3 sm:gap-4">
            {[...languagesRow1, ...languagesRow1].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-2.5 bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl px-4 py-2.5 shadow-sm hover:border-orange-400 dark:hover:border-orange-500 transition-colors duration-200 cursor-pointer group"
              >
                <span className="text-xl leading-none">{item.flag}</span>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    {item.name}
                    <span className="text-[10px] font-normal text-slate-500 dark:text-slate-400">
                      ({item.native})
                    </span>
                  </span>
                </div>
                <span className="ml-2 text-[10px] font-extrabold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 rounded-full px-2 py-0.5">
                  {item.accuracy}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Row 2: Right Scroll */}
        <div className="overflow-hidden">
          <div className="animate-marquee-right gap-3 sm:gap-4">
            {[...languagesRow2, ...languagesRow2].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-2.5 bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl px-4 py-2.5 shadow-sm hover:border-blue-400 dark:hover:border-blue-500 transition-colors duration-200 cursor-pointer group"
              >
                <span className="text-xl leading-none">{item.flag}</span>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    {item.name}
                    <span className="text-[10px] font-normal text-slate-500 dark:text-slate-400">
                      ({item.native})
                    </span>
                  </span>
                </div>
                <span className="ml-2 text-[10px] font-extrabold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/60 rounded-full px-2 py-0.5">
                  {item.accuracy}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
