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

            const accentColors = [
              'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
              'text-amber-500 bg-amber-500/10 border-amber-500/20',
              'text-purple-500 bg-purple-500/10 border-purple-500/20',
              'text-pink-500 bg-pink-500/10 border-pink-500/20'
            ];

            return (
              <div
                key={plan.id || idx}
                onClick={() => !isFree && handleLaunch('text-to-speech')}
                className={`rounded-3xl p-6 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex flex-col justify-between transition-all hover:-translate-y-1 hover:shadow-xl relative overflow-hidden min-h-[380px] ${
                  isFree ? 'cursor-default' : 'cursor-pointer'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full border ${accentColors[idx % 4]}`}>
                      {plan.name} Tier
                    </span>
                    <span className="text-xl font-black text-slate-900 dark:text-white">{displayPrice}</span>
                  </div>

                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-3.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                    <span className="font-bold text-slate-900 dark:text-white">{plan.name} Plan</span>: includes{' '}
                    <span className="font-bold text-emerald-500">{plan.transcription_limit || 15} mins audio</span>,{' '}
                    {((plan.translation_limit || 0) / 1000).toFixed(0)}k translation & {plan.storage_limit || 50} MB storage.
                  </div>
                </div>

                <div className="mt-auto border-t border-slate-200 dark:border-slate-700/60 pt-3">
                  <div className="text-[10px] font-extrabold uppercase tracking-wider mb-2 text-slate-400">
                    INCLUDED FEATURES ({planFeatures.length})
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {planFeatures.map((fId: string, fIdx: number) => (
                      <span
                        key={fIdx}
                        className="text-[11px] font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-2 py-1 rounded-lg inline-flex items-center gap-1"
                      >
                        ✓ {FEATURE_LABEL_MAP[fId] || fId}
                      </span>
                    ))}
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
