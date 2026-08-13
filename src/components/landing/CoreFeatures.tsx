import React from 'react';
import { useApp } from '../../context/AppContext';

interface CoreFeaturesProps {
  onLaunchTool?: (tab: any) => void;
  dbPlans?: any[];
}

const FEATURE_LABEL_MAP: Record<string, string> = {
  v2t_live: 'Live Voice-to-Text',
  v2t_vocab: 'Custom Vocabulary',
  v2t_export: 'Transcript Export (SRT/VTT)',
  t2v_neural: 'Neural Voices',
  t2v_controls: 'Voice Pitch/Speed Controls',
  t2v_download: 'HD Audio Download (WAV/MP3)',
  trans_instant: 'Instant Translation',
  doc_5pages: 'Doc Upload (5 Pages)',
  doc_25pages: 'Doc Upload (25 Pages)',
  doc_parallel: 'Parallel Document Chunking',
  audio_whatsapp: 'WhatsApp Audio Transcribe',
  audio_long: 'Long Audio (60+ mins)',
  audio_timestamps: 'Automated Timestamps',
  cloud_storage: 'Cloud Storage & History',
  custom_api: 'Custom API & Webhooks Access',

  // Fallback keys
  audio_processing: 'Live Voice-to-Text',
  translation_services: 'Instant Translation',
  text_to_speech: 'Neural Voice TTS',
};

export const CoreFeatures: React.FC<CoreFeaturesProps> = ({ onLaunchTool, dbPlans: propDbPlans }) => {
  const { setActiveTab, user, setIsAuthModalOpen, setAuthModalMode, logout } = useApp();
  const [billingCycle, setBillingCycle] = React.useState<'monthly' | 'yearly'>('monthly');
  const [fetchedPlans, setFetchedPlans] = React.useState<any[]>([]);

  React.useEffect(() => {
    if (!propDbPlans || propDbPlans.length === 0) {
      fetch('/api/billing/plans')
        .then(res => res.ok ? res.json() : [])
        .then(data => {
          if (Array.isArray(data) && data.length > 0) setFetchedPlans(data);
        })
        .catch(() => {});
    }
  }, [propDbPlans]);

  const activePlans = (propDbPlans && propDbPlans.length > 0) ? propDbPlans : fetchedPlans;

  const handleLaunch = (tab: any) => {
    if (onLaunchTool) {
      onLaunchTool(tab);
    } else {
      setActiveTab(tab);
      if (user) logout();
      setAuthModalMode('login');
      setIsAuthModalOpen(true);
    }
  };

  const fallbackPlans = [
    { id: 'free', name: 'Free', price: 0, transcription_limit: 15, translation_limit: 10000, storage_limit: 50, features: ['v2t_live', 't2v_neural', 'trans_instant', 'doc_5pages'] },
    { id: 'starter', name: 'Starter', price: 19, transcription_limit: 60, translation_limit: 100000, storage_limit: 500, features: ['v2t_live', 't2v_neural', 'trans_instant', 'doc_5pages', 'audio_whatsapp', 'cloud_storage'] },
    { id: 'pro', name: 'Professional', price: 49, transcription_limit: 300, translation_limit: 500000, storage_limit: 5000, features: ['v2t_live', 'v2t_vocab', 'v2t_export', 't2v_neural', 't2v_controls', 't2v_download', 'trans_instant', 'doc_25pages', 'audio_whatsapp', 'audio_long', 'cloud_storage'] },
    { id: 'ent', name: 'Enterprise', price: 149, transcription_limit: 1200, translation_limit: 2000000, storage_limit: 10000, features: ['v2t_live', 'v2t_vocab', 'v2t_export', 't2v_neural', 't2v_controls', 't2v_download', 'trans_instant', 'doc_25pages', 'doc_parallel', 'audio_whatsapp', 'audio_long', 'audio_timestamps', 'cloud_storage', 'custom_api'] }
  ];

  const displayPlans = activePlans.length > 0 ? activePlans : fallbackPlans;

  return (
    <div className="w-full bg-white dark:bg-[#0b1120] text-slate-900 dark:text-slate-100 py-12 px-6 lg:py-20 flex flex-col items-start justify-center font-sans">
      <div className="max-w-7xl mx-auto w-full">
        {/* Header Badge */}
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">3</div>
          <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
            Flexible Pricing Plans
          </span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight mb-2">
          Choose the Perfect Plan for You
        </h2>
        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
          Start for free or scale with our flexible monthly/yearly plans.
        </p>

        {/* Toggle */}
        <div className="inline-flex bg-slate-100 dark:bg-slate-800/80 p-1 rounded-full mb-8 border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              billingCycle === 'monthly'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            MONTHLY
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              billingCycle === 'yearly'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            YEARLY <span className="bg-emerald-500 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full">SAVE 30%</span>
          </button>
        </div>

        {/* Plan Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          {displayPlans.map((plan: any, idx: number) => {
            const isFree = plan.price === 0;
            const displayPrice = isFree
              ? '₹0/mo'
              : billingCycle === 'yearly'
              ? `₹${Math.round(plan.price * 0.7)}/mo`
              : `₹${plan.price}/mo`;

            const planFeatures: string[] = plan.features || ['v2t_live', 't2v_neural', 'trans_instant', 'cloud_storage'];

            const cardStyles = [
              {
                bg: 'bg-gradient-to-b from-yellow-200/90 via-yellow-100/40 to-yellow-50/20 dark:from-yellow-950/40 dark:via-slate-800/80 dark:to-slate-900 border-yellow-300/80 dark:border-yellow-700/50 shadow-yellow-500/10',
                badge: 'bg-white/90 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-300/60 dark:border-emerald-500/30',
                summaryBox: 'bg-white/90 dark:bg-slate-900/90 border border-yellow-200/80 dark:border-yellow-900/40',
                chip: 'bg-white/90 dark:bg-slate-900/90 border border-yellow-200/80 dark:border-yellow-900/40 text-slate-800 dark:text-slate-200'
              },
              {
                bg: 'bg-gradient-to-b from-rose-200/90 via-orange-100/40 to-rose-50/20 dark:from-rose-950/40 dark:via-slate-800/80 dark:to-slate-900 border-rose-300/80 dark:border-rose-700/50 shadow-rose-500/10',
                badge: 'bg-white/90 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 border border-amber-300/60 dark:border-amber-500/30',
                summaryBox: 'bg-white/90 dark:bg-slate-900/90 border border-rose-200/80 dark:border-rose-900/40',
                chip: 'bg-white/90 dark:bg-slate-900/90 border border-rose-200/80 dark:border-rose-900/40 text-slate-800 dark:text-slate-200'
              },
              {
                bg: 'bg-gradient-to-b from-purple-200/90 via-indigo-100/40 to-purple-50/20 dark:from-purple-950/40 dark:via-slate-800/80 dark:to-slate-900 border-purple-300/80 dark:border-purple-700/50 shadow-purple-500/10 relative overflow-hidden',
                isGrid: true,
                badge: 'bg-white/90 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400 border border-purple-300/60 dark:border-purple-500/30',
                summaryBox: 'bg-white/90 dark:bg-slate-900/90 border border-purple-200/80 dark:border-purple-900/40 relative z-10',
                chip: 'bg-white/90 dark:bg-slate-900/90 border border-purple-200/80 dark:border-purple-900/40 text-slate-800 dark:text-slate-200'
              },
              {
                bg: 'bg-gradient-to-b from-amber-300/80 via-orange-100/40 to-amber-50/20 dark:from-amber-950/40 dark:via-slate-800/80 dark:to-slate-900 border-amber-300/80 dark:border-amber-700/50 shadow-amber-500/10',
                badge: 'bg-white/90 text-pink-700 dark:bg-pink-500/20 dark:text-pink-400 border border-pink-300/60 dark:border-pink-500/30',
                summaryBox: 'bg-white/90 dark:bg-slate-900/90 border border-amber-200/80 dark:border-amber-900/40',
                chip: 'bg-white/90 dark:bg-slate-900/90 border border-amber-200/80 dark:border-amber-900/40 text-slate-800 dark:text-slate-200'
              }
            ];

            return (
              <div
                key={plan.id || idx}
                onClick={() => !isFree && handleLaunch('text-to-speech')}
                className={`rounded-3xl p-4 sm:p-5 ${cardStyles[idx % 4].bg} flex flex-col justify-start transition-all hover:-translate-y-1 hover:shadow-xl relative overflow-hidden h-full ${
                  isFree ? 'cursor-default' : 'cursor-pointer'
                }`}
              >
                {cardStyles[idx % 4].isGrid && (
                  <div className="absolute inset-0 opacity-30 pointer-events-none bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:16px_16px]" />
                )}

                <div className="relative z-10 flex flex-col h-full">
                  {/* Top Tier Badge & Price Header */}
                  <div className="mb-4 min-h-[64px] flex flex-col justify-between">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className={`text-[10px] sm:text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full border shadow-xs ${cardStyles[idx % 4].badge}`}>
                        {plan.name} Tier
                      </span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                        {isFree ? '₹0' : `₹${billingCycle === 'yearly' ? Math.round(plan.price * 0.7) : plan.price}`}
                      </span>
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400">/month</span>
                    </div>
                  </div>

                  {/* Summary box - uniform height so INCLUDED FEATURES aligns on same row across all cards */}
                  <div className={`rounded-2xl p-3.5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed mb-4 min-h-[72px] flex items-center ${cardStyles[idx % 4].summaryBox}`}>
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white">{plan.name} Plan</span>: includes{' '}
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">{plan.transcription_limit || 15} mins audio</span>,{' '}
                      {((plan.translation_limit || 0) / 1000).toFixed(0)}k translation & {plan.storage_limit || 50} MB storage.
                    </div>
                  </div>

                  {/* Included Features Section - locked at identical vertical position across all 4 cards */}
                  <div className="border-t border-slate-900/10 dark:border-white/10 pt-3">
                    <div className="text-[10px] font-extrabold uppercase tracking-wider mb-2 text-slate-500 dark:text-slate-400">
                      INCLUDED FEATURES ({planFeatures.length})
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {(() => {
                        const formatLimitNumber = (num?: number) => {
                          if (num === undefined || num === null) return '';
                          if (num === 0) return 'Unlimited';
                          if (num >= 1000000) return `${(num / 1000000).toFixed(1).replace(/\.0$/, '')}M`;
                          if (num >= 1000) return `${(num / 1000).toFixed(0)}k`;
                          return `${num}`;
                        };

                        const ttsChars = plan.tts_char_limit ?? plan.tts_limit ?? 10000;
                        const ttsFiles = plan.tts_file_limit;
                        const ttsCharStr = ttsChars === 0 ? 'Unlimited chars' : `${formatLimitNumber(ttsChars)} chars`;
                        const ttsFileStr = ttsFiles === 0 ? 'Unlimited files' : (ttsFiles ? `${ttsFiles} files/mo` : '');
                        const ttsLabel = `TTS (${[ttsCharStr, ttsFileStr].filter(Boolean).join(', ')})`;

                        const v2tMins = plan.voice_minutes_limit ?? plan.transcription_limit ?? 30;
                        const v2tSess = plan.voice_session_limit;
                        const v2tMinStr = v2tMins === 0 ? 'Unlimited mins' : `${v2tMins} mins`;
                        const v2tSessStr = v2tSess === 0 ? 'Unlimited sessions' : (v2tSess ? `${v2tSess} sessions/mo` : '');
                        const v2tLabel = `Voice-to-Text (${[v2tMinStr, v2tSessStr].filter(Boolean).join(', ')})`;

                        const transChars = plan.translation_char_limit ?? plan.translation_limit ?? 50000;
                        const transTexts = plan.translation_text_limit;
                        const transCharStr = transChars === 0 ? 'Unlimited chars' : `${formatLimitNumber(transChars)} chars`;
                        const transTextStr = transTexts === 0 ? 'Unlimited texts' : (transTexts ? `${transTexts} texts/mo` : '');
                        const transLabel = `Translation (${[transCharStr, transTextStr].filter(Boolean).join(', ')})`;

                        const map: Record<string, string> = {
                          v2t_live: v2tLabel,
                          v2t_vocab: 'Custom Vocabulary',
                          v2t_export: 'Transcript Export',
                          t2v_neural: ttsLabel,
                          t2v_controls: 'Voice Controls',
                          t2v_download: 'HD Audio Download',
                          trans_instant: transLabel,
                          doc_5pages: 'Doc Upload (5 Pages)',
                          doc_25pages: 'Doc Upload (25 Pages)',
                          doc_parallel: 'Parallel Chunking',
                          audio_whatsapp: 'WhatsApp Audio Transcribe',
                          audio_long: 'Long Audio (60+ mins)',
                          audio_timestamps: 'Timestamps',
                          cloud_storage: `${plan.storage_limit || 50} MB Storage`,
                          custom_api: 'Custom API & Webhooks',

                          audio_processing: v2tLabel,
                          translation_services: transLabel,
                          text_to_speech: ttsLabel,
                          read_aloud: 'Read Aloud',
                          doc_ocr: 'Document OCR',
                          custom_vocab: 'Custom Vocabulary',
                          parallel_chunks: 'Parallel Chunking',
                          whatsapp_audio: 'WhatsApp Transcribe',
                          audio_export: 'HD Audio Export',
                          srt_vtt_export: 'SRT/VTT Subtitles',
                          enterprise_support: '24/7 Enterprise Support',
                          tenant_branding: 'Custom Branding',
                          audit_logs: 'Audit Logging',
                          high_priority_queue: 'Priority Queue'
                        };

                        const uniqueList = Array.from(new Set(planFeatures.map((fId: string) => map[fId] || fId)));

                        return uniqueList.map((label: string, fIdx: number) => (
                          <span
                            key={fIdx}
                            className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg inline-flex items-center gap-1 shadow-2xs ${cardStyles[idx % 4].chip}`}
                          >
                            ✓ {label}
                          </span>
                        ));
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CoreFeatures;
