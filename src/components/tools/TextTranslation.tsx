import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeftRight, Copy, Volume2, RefreshCw,
  ChevronDown, AlertCircle, CheckCircle2, Loader2, X, Cpu, Languages
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { providerManager } from '../../providers/providerManager';

const LANGUAGES = [
  'Auto Detect', 'English', 'Tamil', 'Hindi', 'Spanish', 'French', 'German',
  'Portuguese', 'Arabic', 'Japanese', 'Korean', 'Chinese (Simplified)',
  'Russian', 'Italian', 'Dutch', 'Polish', 'Turkish', 'Vietnamese',
  'Thai', 'Indonesian', 'Bengali', 'Urdu', 'Swahili',
];

const TARGET_LANGUAGES = LANGUAGES.filter(l => l !== 'Auto Detect');



type TranslateState = 'idle' | 'translating' | 'done' | 'error';

export const TextTranslation: React.FC = () => {
  const { addHistoryItem, translationProvider, setTranslationProvider, openAiApiKey } = useApp();
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLang, setSourceLang] = useState('Auto Detect');
  const [targetLang, setTargetLang] = useState('Tamil');
  const [state, setState] = useState<TranslateState>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [copiedSrc, setCopiedSrc] = useState(false);
  const [copiedTgt, setCopiedTgt] = useState(false);
  const [detectedLang, setDetectedLang] = useState('');
  const [charCount, setCharCount] = useState(0);
  
  const [providerDropdownOpen, setProviderDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProviderDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const PROVIDERS = [
    { id: 'openai', label: 'OpenAI Translation', description: 'Context-aware GPT-4o-mini translation' },
    { id: 'google', label: 'Google Translate', description: 'Fast, multi-language translation' },
    { id: 'deepl', label: 'DeepL Translate', description: 'Highly accurate, nuance-preserving' },
  ];

  const translate = (text: string, target: string) => {
    if (!text.trim()) { setTranslatedText(''); setState('idle'); return; }
    setState('translating');
    setErrorMsg('');
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const result = await providerManager.translateText(
          text,
          sourceLang,
          target,
          translationProvider,
          openAiApiKey
        );
        setTranslatedText(result.text);
        if (sourceLang === 'Auto Detect' && result.detectedLang) {
          setDetectedLang(result.detectedLang);
        } else {
          setDetectedLang('');
        }
        setState('done');
        addHistoryItem('translation', `${sourceLang === 'Auto Detect' ? (result.detectedLang || 'Detected') : sourceLang} → ${target}`, `${text.split(' ').filter(Boolean).length} words`);
      } catch (err: any) {
        setErrorMsg(err.message || 'Translation failed. Please check your connection.');
        setState('error');
      }
    }, 700);
  };

  useEffect(() => {
    if (sourceText.trim()) {
      translate(sourceText, targetLang);
    }
  }, [translationProvider]);

  const handleSourceChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value.slice(0, 5000);
    setSourceText(val);
    setCharCount(val.length);
    translate(val, targetLang);
  };

  const handleSwap = () => {
    if (sourceLang === 'Auto Detect') return;
    const prevSrc = sourceLang, prevTgt = targetLang;
    setSourceLang(prevTgt);
    setTargetLang(prevSrc);
    setSourceText(translatedText);
    setCharCount(translatedText.length);
    translate(translatedText, prevSrc);
  };

  const handleTargetChange = (lang: string) => { setTargetLang(lang); translate(sourceText, lang); };

  const speakText = (text: string, lang: string) => {
    if (!window.speechSynthesis || !text) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    const langMap: Record<string, string> = {
      Tamil: 'ta', Hindi: 'hi', Spanish: 'es', French: 'fr',
      German: 'de', Japanese: 'ja', Korean: 'ko', Arabic: 'ar',
      English: 'en', Portuguese: 'pt', Russian: 'ru', Italian: 'it',
    };
    utt.lang = langMap[lang] || 'en';
    window.speechSynthesis.speak(utt);
  };

  const copyText = (text: string, type: 'src' | 'tgt') => {
    navigator.clipboard.writeText(text);
    if (type === 'src') { setCopiedSrc(true); setTimeout(() => setCopiedSrc(false), 2000); }
    else { setCopiedTgt(true); setTimeout(() => setCopiedTgt(false), 2000); }
  };

  const reset = () => {
    setSourceText(''); setTranslatedText(''); setState('idle');
    setDetectedLang(''); setCharCount(0); setErrorMsg('');
  };

  const selectStyle = {
    background: 'var(--bg-subtle)',
    border: '1px solid var(--border-base)',
    color: 'var(--text-primary)',
  };

  return (
    <div className="space-y-5 max-w-5xl mx-auto">
      {/* Header with Provider Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/5">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <Languages className="text-emerald-500" size={20} />
            Text Translation
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Translate text across languages using advanced AI translation models
          </p>
        </div>
        
        {/* Provider Switcher Dropdown */}
        <div className="relative inline-block text-left" ref={dropdownRef}>
          <button
            onClick={() => setProviderDropdownOpen(!providerDropdownOpen)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 transition-all text-xs font-bold text-slate-700 dark:text-slate-200 cursor-pointer"
            style={{ background: 'var(--bg-card)' }}
          >
            <Cpu size={14} className="text-emerald-500" />
            <span>AI Provider: {
              translationProvider === 'openai' ? 'OpenAI Translation' :
              translationProvider === 'google' ? 'Google Translate' : 'DeepL Translate'
            }</span>
            <ChevronDown size={14} className={`text-slate-400 transition-transform ${providerDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          
          <AnimatePresence>
            {providerDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 8 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-64 rounded-2xl border border-slate-200 dark:border-white/10 shadow-xl p-1.5 z-30"
                style={{ background: 'var(--bg-elevated, var(--bg-card))' }}
              >
                {PROVIDERS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setTranslationProvider(p.id);
                      setProviderDropdownOpen(false);
                    }}
                    className={`w-full flex flex-col items-start gap-0.5 px-3 py-2 text-left rounded-xl transition-all cursor-pointer ${
                      translationProvider === p.id
                        ? 'bg-gradient-to-r from-blue-600/10 to-emerald-500/10 text-slate-900 dark:text-white border border-blue-500/20'
                        : 'hover:bg-slate-50 dark:hover:bg-white/5 text-slate-700 dark:text-slate-350 border border-transparent'
                    }`}
                  >
                    <span className="text-xs font-bold flex items-center gap-1.5">
                      {p.label}
                      {translationProvider === p.id && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />}
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">{p.description}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Error */}
      <AnimatePresence>
        {errorMsg && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="alert alert-error">
            <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
            <span className="flex-1">{errorMsg}</span>
            <button onClick={() => setErrorMsg('')} className="flex-shrink-0 opacity-60 hover:opacity-100"><X size={14} /></button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Language Bar */}
      <div className="app-card rounded-2xl p-4">
        <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-2 sm:flex sm:flex-row sm:flex-nowrap sm:gap-3">
        {/* Source Lang */}
        <div className="flex-1 min-w-0">
          <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>From</label>
          <div className="relative">
            <select id="trans-source-lang" value={sourceLang}
              onChange={(e) => setSourceLang(e.target.value)}
              className="w-full appearance-none rounded-xl px-3.5 pr-9 py-2.5 text-sm font-semibold focus:outline-none"
              style={selectStyle}>
              {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
            <ChevronDown size={13} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          </div>
          {detectedLang && sourceLang === 'Auto Detect' && (
            <p className="mt-1 text-[11px] font-semibold" style={{ color: 'var(--accent)' }}>
              Detected: {detectedLang}
            </p>
          )}
        </div>

        {/* Swap */}
        <button id="trans-swap-btn" onClick={handleSwap}
          disabled={sourceLang === 'Auto Detect'}
          className="btn-ghost flex h-9 w-9 flex-shrink-0 items-center justify-center self-end rounded-xl p-0 disabled:opacity-40 disabled:cursor-not-allowed"
          title={sourceLang === 'Auto Detect' ? 'Select a source language first' : 'Swap languages'}>
          <ArrowLeftRight size={15} />
        </button>

        {/* Target Lang */}
        <div className="flex-1 min-w-0">
          <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>To</label>
          <div className="relative">
            <select id="trans-target-lang" value={targetLang}
              onChange={(e) => handleTargetChange(e.target.value)}
              className="w-full appearance-none rounded-xl px-3.5 pr-9 py-2.5 text-sm font-semibold focus:outline-none"
              style={selectStyle}>
              {TARGET_LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
            <ChevronDown size={13} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          </div>
        </div>

        {/* Clear */}
        {(sourceText || translatedText) && (
          <button onClick={reset}
            className="btn-ghost col-span-3 flex flex-shrink-0 items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs sm:col-span-1 sm:mt-5 sm:py-2.5">
            <RefreshCw size={11} /> Clear
          </button>
        )}
      </div>
    </div>

      {/* Translation Panels */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Source */}
        <div className="app-card rounded-2xl p-5 flex flex-col">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Source</span>
            <div className="flex gap-2">
              <button id="trans-copy-src-btn" onClick={() => copyText(sourceText, 'src')}
                disabled={!sourceText}
                className="btn-ghost flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs disabled:opacity-40">
                {copiedSrc ? <CheckCircle2 size={11} className="text-emerald-500" /> : <Copy size={11} />}
                {copiedSrc ? 'Copied' : 'Copy'}
              </button>
              <button id="trans-listen-src-btn"
                onClick={() => speakText(sourceText, sourceLang === 'Auto Detect' ? 'English' : sourceLang)}
                disabled={!sourceText}
                className="btn-ghost flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs disabled:opacity-40">
                <Volume2 size={11} /> Listen
              </button>
            </div>
          </div>
          <textarea
            id="trans-source-input"
            value={sourceText}
            onChange={handleSourceChange}
            placeholder="Type or paste text to translate…"
            rows={6}
            className="flex-1 resize-none rounded-xl px-4 py-3 text-sm focus:outline-none"
            style={{
              background: 'var(--bg-subtle)',
              border: '1px solid var(--border-base)',
              color: 'var(--text-primary)',
            }}
          />
          <div className="mt-1.5 text-right text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
            {charCount} / 5,000
          </div>
        </div>

        {/* Translation Output */}
        <div className="app-card rounded-2xl p-5 flex flex-col">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
              Translation — {targetLang}
            </span>
            <div className="flex gap-2">
              <button id="trans-copy-tgt-btn" onClick={() => copyText(translatedText, 'tgt')}
                disabled={!translatedText}
                className="btn-ghost flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs disabled:opacity-40">
                {copiedTgt ? <CheckCircle2 size={11} className="text-emerald-500" /> : <Copy size={11} />}
                {copiedTgt ? 'Copied' : 'Copy'}
              </button>
              <button id="trans-listen-tgt-btn" onClick={() => speakText(translatedText, targetLang)}
                disabled={!translatedText}
                className="btn-ghost flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs disabled:opacity-40">
                <Volume2 size={11} /> Listen
              </button>
            </div>
          </div>

          <div className="relative flex flex-1 rounded-xl p-4" style={{
            background: 'var(--bg-subtle)',
            border: '1px solid var(--border-base)',
            minHeight: '14rem',
          }}>
            {state === 'translating' && (
              <div className="absolute inset-0 flex items-center justify-center rounded-xl"
                style={{ background: 'color-mix(in srgb, var(--bg-subtle) 80%, transparent)' }}>
                <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: 'var(--text-muted)' }}>
                  <Loader2 size={15} className="animate-spin" /> Translating…
                </div>
              </div>
            )}
            {state === 'done' && translatedText && (
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>{translatedText}</p>
            )}
            {state === 'idle' && !translatedText && (
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Translation will appear here…</p>
            )}
          </div>

          {state === 'done' && translatedText && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="mt-1.5 flex items-center gap-1 text-xs font-semibold text-emerald-500">
              <CheckCircle2 size={11} /> Translated successfully
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
