import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import type { ActiveTabType } from '../../context/AppContext';
import { Sparkles, Zap, ShieldCheck, Globe2 } from 'lucide-react';

interface PinnedWorkflowProps {
  onLaunchTool?: (tab: ActiveTabType) => void;
}

export const PinnedWorkflow: React.FC<PinnedWorkflowProps> = ({ onLaunchTool }) => {
  const { setActiveTab, user, setIsAuthModalOpen, setAuthModalMode, logout } = useApp();

  const containerRef = useRef<HTMLDivElement>(null);
  const pinRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [svgPath, setSvgPath] = useState<string>(
    'M 240 45 C 550 80, 800 180, 760 310 C 700 450, 200 480, 240 640 C 280 800, 550 940, 760 955'
  );

  const updatePath = useCallback(() => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const points: { x: number; y: number }[] = [];

    pinRefs.current.forEach((pinEl) => {
      if (pinEl) {
        const pinRect = pinEl.getBoundingClientRect();
        const x = pinRect.left + pinRect.width / 2 - containerRect.left;
        const y = pinRect.top + pinRect.height / 2 - containerRect.top;
        points.push({ x, y });
      }
    });

    if (points.length >= 4) {
      const [p0, p1, p2, p3] = points;
      const d = `M ${p0.x} ${p0.y} C ${p0.x + (p1.x - p0.x) * 0.5} ${p0.y}, ${p0.x + (p1.x - p0.x) * 0.5} ${p1.y}, ${p1.x} ${p1.y} C ${p1.x + (p2.x - p1.x) * 0.5} ${p1.y}, ${p1.x + (p2.x - p1.x) * 0.5} ${p2.y}, ${p2.x} ${p2.y} C ${p2.x + (p3.x - p2.x) * 0.5} ${p2.y}, ${p2.x + (p3.x - p2.x) * 0.5} ${p3.y}, ${p3.x} ${p3.y}`;
      setSvgPath(d);
    }
  }, []);

  useEffect(() => {
    updatePath();
    window.addEventListener('resize', updatePath);
    window.addEventListener('scroll', updatePath, { passive: true });
    const timer = setTimeout(updatePath, 150);
    const timer2 = setTimeout(updatePath, 500);
    return () => {
      window.removeEventListener('resize', updatePath);
      window.removeEventListener('scroll', updatePath);
      clearTimeout(timer);
      clearTimeout(timer2);
    };
  }, [updatePath]);

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

  const cards = [
    {
      num: '01',
      title: 'Voice to Text',
      description:
        'Capture live speech or recordings and convert them into accurate text instantly with automatic language detection.',
      tab: 'voice-to-text' as ActiveTabType,
      pinColor: '#F95738', // Red-Orange Pushpin
      cardBg: '#FFF6F0',
      numColor: '#E04828',
      rotation: -3,
      align: 'left',
    },
    {
      num: '02',
      title: 'Text to Voice',
      description:
        'Transform written text into ultra-realistic neural speech with customizable voice speed, pitch presets, and MP3 export.',
      tab: 'text-to-speech' as ActiveTabType,
      pinColor: '#3B82F6', // Blue Pushpin
      cardBg: '#EEF5FF',
      numColor: '#2563EB',
      rotation: 4,
      align: 'right',
    },
    {
      num: '03',
      title: 'Text Translation',
      description:
        'Translate text and real-time conversations seamlessly across 100+ global languages with context-aware AI translation.',
      tab: 'translation' as ActiveTabType,
      pinColor: '#A855F7', // Purple Pushpin
      cardBg: '#FAF3FF',
      numColor: '#9333EA',
      rotation: -2.5,
      align: 'left',
    },
    {
      num: '04',
      title: 'Audio to Text',
      description:
        'Upload MP3, WAV, or M4A files to generate precise transcripts equipped with automatic timestamp segmentation.',
      tab: 'audio-transcription' as ActiveTabType,
      pinColor: '#F95738', // Red-Orange Pushpin
      cardBg: '#FFF6F0',
      numColor: '#E04828',
      rotation: 3.5,
      align: 'right',
    },
  ];

  return (
    <section id="ai-models" className="relative bg-[#FAFAFC] dark:bg-[#040814] pt-8 pb-4 sm:pt-10 sm:pb-6 overflow-hidden border-b border-gray-100 dark:border-white/5">
      {/* Google Font Caveat for numbers & Inter for clean text */}
      <link
        href="https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=Inter:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      <style>{`
        .pw-paper-bg {
          background-color: #fafafc;
          background-image: repeating-linear-gradient(#00000005 0 1px, transparent 1px 28px);
        }
        .dark .pw-paper-bg {
          background-color: #040814;
          background-image: repeating-linear-gradient(#ffffff08 0 1px, transparent 1px 28px);
        }

        .pw-card {
          width: 100%;
          max-width: 380px;
          background: #ffffff;
          border-radius: 24px;
          padding: 24px;
          position: relative;
          box-shadow: 0 20px 40px -15px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.03);
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease;
          cursor: pointer;
        }

        .pw-card:hover {
          transform: translateY(-8px) rotate(0deg) scale(1.02) !important;
          box-shadow: 0 30px 60px -15px rgba(0,0,0,0.14), 0 0 0 1px rgba(0,0,0,0.06);
          z-index: 20;
        }

        .pw-inner-box {
          border-radius: 16px;
          padding: 20px;
          text-align: left;
        }

        .pw-num {
          font-family: 'Caveat', cursive;
          font-size: 2.2rem;
          font-weight: 700;
          line-height: 1;
          margin-bottom: 6px;
        }

        .pw-title {
          font-family: 'Inter', sans-serif;
          font-size: 1.25rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 8px;
        }

        .pw-desc {
          font-family: 'Inter', sans-serif;
          font-size: 0.875rem;
          color: #475569;
          line-height: 1.55;
        }

        /* 3D Pushpin Graphic */
        .pw-pin {
          position: absolute;
          top: -14px;
          left: 50%;
          transform: translateX(-50%);
          width: 28px;
          height: 28px;
          z-index: 10;
        }
        .pw-pin-head {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          margin: 0 auto;
          box-shadow: inset -3px -3px 6px rgba(0,0,0,0.3), inset 3px 3px 6px rgba(255,255,255,0.7), 0 8px 12px rgba(0,0,0,0.25);
        }
        .pw-pin-shadow {
          width: 14px;
          height: 6px;
          border-radius: 50%;
          background: rgba(0,0,0,0.2);
          filter: blur(3px);
          margin: 2px auto 0 auto;
        }
      `}</style>

      <div className="pw-paper-bg max-w-[1240px] mx-auto px-5 sm:px-8 lg:px-12 relative">
        {/* Header Row with 2-Column Split Layout */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 lg:gap-12 mb-10 sm:mb-14"
        >
          {/* Left Column: Badge, Title & Description */}
          <div className="flex flex-col items-start text-left max-w-[620px]">
            <div className="inline-flex items-center gap-2.5 mb-3">
              <div className="w-7 h-7 rounded-full bg-slate-900 text-white text-[12px] font-bold flex items-center justify-center">
                1
              </div>
              <span className="text-[13px] font-semibold border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-full px-4 py-1.5 bg-white dark:bg-slate-900 shadow-sm">
                AI Models
              </span>
            </div>

            <h2 className="text-[clamp(2rem,4.5vw,3.5rem)] font-medium leading-[1.12] tracking-[-0.02em] text-slate-900 dark:text-white">
              AI Models
            </h2>
            <p className="mt-2.5 text-[16px] sm:text-[18px] text-slate-600 dark:text-slate-300 leading-[1.6]">
              Interactive suite featuring our 4 primary speech and language translation engines.
            </p>
          </div>

          {/* Right Column: Glassmorphism Info Card */}
          <div className="w-full lg:w-auto flex-shrink-0">
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-lg shadow-slate-900/5 dark:shadow-black/20 max-w-md w-full">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-3 mb-3.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Key Capabilities
                </span>
                <span className="text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50 rounded-full px-2.5 py-0.5">
                  v2.4 Active
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-900 dark:text-white">Low Latency Engine</h4>
                    <p className="text-[12px] text-slate-500 dark:text-slate-400 leading-snug">Sub-second speech processing & real-time translation</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-900 dark:text-white">Enterprise Privacy</h4>
                    <p className="text-[12px] text-slate-500 dark:text-slate-400 leading-snug">Zero data retention with end-to-end encryption</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Globe2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-900 dark:text-white">100+ Global Languages</h4>
                    <p className="text-[12px] text-slate-500 dark:text-slate-400 leading-snug">Context-aware dialect & neural accent support</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Dynamic Curved Dashed Path Connecting the Cards */}
        <div ref={containerRef} className="relative min-h-[660px] flex flex-col justify-between py-2">
          {/* SVG Connecting Path for Desktop */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none hidden md:block"
            xmlns="http://www.w3.org/2000/svg"
          >
            <motion.path
              d={svgPath}
              fill="none"
              stroke="#CBD5E1"
              strokeWidth="2.5"
              strokeDasharray="8 8"
              className="dark:stroke-slate-700"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: false, amount: 0.1 }}
              transition={{ duration: 1.4, ease: 'easeInOut' }}
            />
          </svg>

          {/* 4 Alternating Pinned Cards */}
          {cards.map((card, index) => {
            const isLeft = card.align === 'left';
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 55, scale: 0.93 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: false, amount: 0.25 }}
                transition={{
                  duration: 0.65,
                  delay: 0.05,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={`w-full flex ${
                  isLeft ? 'justify-start md:pl-8 lg:pl-16' : 'justify-end md:pr-8 lg:pr-16'
                } my-6 relative`}
              >
                <div
                  className="pw-card"
                  style={{
                    transform: `rotate(${card.rotation}deg)`,
                  }}
                  onClick={() => handleLaunch(card.tab)}
                >
                  {/* 3D Glass Pushpin */}
                  <motion.div
                    className="pw-pin"
                    initial={{ y: -20, scale: 0.3, opacity: 0 }}
                    whileInView={{ y: 0, scale: 1, opacity: 1 }}
                    viewport={{ once: false, amount: 0.25 }}
                    transition={{
                      delay: 0.2,
                      type: 'spring',
                      stiffness: 350,
                      damping: 18,
                    }}
                    ref={(el) => {
                      pinRefs.current[index] = el;
                    }}
                  >
                    <div
                      className="pw-pin-head"
                      style={{
                        background: `radial-gradient(circle at 35% 35%, #ffffff 0%, ${card.pinColor} 55%, #000000 100%)`,
                      }}
                    />
                    <div className="pw-pin-shadow" />
                  </motion.div>

                  {/* Card Content Box */}
                  <div className="pw-inner-box" style={{ background: card.cardBg }}>
                    <div className="pw-num" style={{ color: card.numColor }}>
                      {card.num}
                    </div>
                    <h3 className="pw-title">{card.title}</h3>
                    <p className="pw-desc">{card.description}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

