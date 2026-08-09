import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, MessageSquare } from 'lucide-react';

interface FaqItem {
  id: number;
  question: string;
  answer: string;
  category: string;
}

const faqs: FaqItem[] = [
  {
    id: 1,
    question: 'What audio and video file formats are supported for transcription?',
    answer:
      'We support MP3, WAV, M4A, FLAC, AAC, OGG, and WebM formats up to 500MB per file. Transcripts include automatic timestamp segmentation and speaker detection.',
    category: 'Transcription',
  },
  {
    id: 2,
    question: 'Is my audio and text data kept private and secure?',
    answer:
      'Yes, 100%. All processing strictly follows enterprise privacy standards with end-to-end encryption. We enforce zero data training or retention on your inputs.',
    category: 'Privacy',
  },
  {
    id: 3,
    question: 'How accurate is Tamil & Indian regional language translation?',
    answer:
      'Our custom neural transformer models are fine-tuned specifically for Indian regional languages (Tamil, Telugu, Malayalam, Hindi, Kannada, etc.), delivering 98.5%+ accuracy with dialect sensitivity.',
    category: 'AI Models',
  },
  {
    id: 4,
    question: 'Can I integrate MCC AI engines into my own app via API?',
    answer:
      'Yes! We provide low-latency REST APIs and real-time WebSocket streaming endpoints with SDK support, interactive documentation, and dashboard API key management.',
    category: 'Developer API',
  },
  {
    id: 5,
    question: 'Can I switch plans or cancel my subscription at any time?',
    answer:
      'Absolutely. You can upgrade, downgrade, or cancel your plan at any time directly from your workspace dashboard with no lock-in contracts or hidden charges.',
    category: 'Billing',
  },
];

export const FaqAccordion: React.FC = () => {
  const [openId, setOpenId] = useState<number | null>(1);

  const toggleFaq = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="relative bg-[#FAFAFC] dark:bg-[#040814] py-10 sm:py-14 overflow-hidden border-b border-gray-100 dark:border-white/5">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 lg:px-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex flex-col items-start text-left mb-6 sm:mb-8"
        >
          <div className="inline-flex items-center gap-2.5 mb-2.5">
            <div className="w-7 h-7 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[12px] font-bold flex items-center justify-center shadow-sm">
              4
            </div>
            <span className="text-[13px] font-semibold border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-full px-4 py-1.5 bg-white dark:bg-slate-900 shadow-sm">
              Frequently Asked Questions
            </span>
          </div>

          <h2 className="text-[clamp(1.75rem,3.5vw,2.75rem)] font-medium leading-[1.12] tracking-[-0.02em] text-slate-900 dark:text-white max-w-[760px]">
            Got Questions? We've Got Answers.
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-[620px] leading-[1.6]">
            Everything you need to know about MCC AI speech, translation, and privacy.
          </p>
        </motion.div>

        {/* Accordion Container */}
        <div className="max-w-[860px] space-y-2.5">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.4 }}
                className={`rounded-xl border transition-all duration-300 overflow-hidden bg-white dark:bg-slate-900/90 ${
                  isOpen
                    ? 'border-orange-500/60 dark:border-orange-500/60 shadow-md shadow-orange-500/5'
                    : 'border-slate-200/80 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm'
                }`}
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full text-left px-4 py-3.5 sm:px-5 sm:py-4 flex items-center justify-between gap-3 cursor-pointer focus:outline-none"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-[11px] font-semibold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/60 border border-orange-200 dark:border-orange-800/50 rounded-full px-2.5 py-0.5 flex-shrink-0">
                      {faq.category}
                    </span>
                    <h3 className="text-sm sm:text-[15px] font-medium text-slate-900 dark:text-white leading-snug">
                      {faq.question}
                    </h3>
                  </div>
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${
                      isOpen
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 rotate-180'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 pt-3">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Help Prompt */}
        <div className="mt-10 sm:mt-12 p-5 rounded-2xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 max-w-[860px] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center flex-shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Still have custom questions?</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">Our engineering team is here to assist with enterprise API setups.</p>
            </div>
          </div>
          <a
            href="mailto:support@mccai.com"
            className="text-xs font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full px-4 py-2 hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors shadow-sm whitespace-nowrap"
          >
            Contact Support →
          </a>
        </div>
      </div>
    </section>
  );
};
