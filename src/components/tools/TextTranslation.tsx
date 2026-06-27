import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeftRight, Copy, Volume2, RefreshCw,
  ChevronDown, AlertCircle, CheckCircle2, Loader2, X, Cpu, Languages,
  Globe, Activity, Award, FileText, Download,
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Play, Pause, Square
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { providerManager } from '../../providers/providerManager';
import { FontPicker } from '../common/FontPicker';
import { ttsService } from '../../services/ttsService';
import type { TTSState } from '../../services/ttsService';

const LANGUAGES = [
  'Auto Detect', 'English', 'Tamil', 'Hindi', 'Spanish', 'French', 'German',
  'Portuguese', 'Arabic', 'Japanese', 'Korean', 'Chinese (Simplified)',
  'Russian', 'Italian', 'Dutch', 'Polish', 'Turkish', 'Vietnamese',
  'Thai', 'Indonesian', 'Bengali', 'Urdu', 'Swahili',
];

const TARGET_LANGUAGES = LANGUAGES.filter(l => l !== 'Auto Detect');



type TranslateState = 'idle' | 'translating' | 'done' | 'error';

export const TextTranslation: React.FC = () => {
  const { history, billingOverview, addHistoryItem, openAiApiKey, fetchBillingOverview } = useApp();
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLang, setSourceLang] = useState('Auto Detect');
  const [targetLang, setTargetLang] = useState('Tamil');
  const [state, setState] = useState<TranslateState>('idle');
  const [activeProvider, setActiveProvider] = useState<string>('Managed by Platform');
  const [errorMsg, setErrorMsg] = useState('');
  const [copiedSrc, setCopiedSrc] = useState(false);
  const [copiedTgt, setCopiedTgt] = useState(false);
  const [detectedLang, setDetectedLang] = useState('');
  const [charCount, setCharCount] = useState(0);
  const [fontSize, setFontSize] = useState('14px');
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right' | 'justify'>('left');
  const [textColor, setTextColor] = useState('#1e293b');

  const [sourceFont, setSourceFontState] = useState(() => localStorage.getItem('mcc-ai-source-font') || 'TAU-Marutham');
  const [targetFont, setTargetFontState] = useState(() => localStorage.getItem('mcc-ai-target-font') || 'TAU-Marutham');
  
  const [srcTtsState, setSrcTtsState] = useState<TTSState>('idle');
  const [tgtTtsState, setTgtTtsState] = useState<TTSState>('idle');

  const setSourceFont = (font: string) => { setSourceFontState(font); localStorage.setItem('mcc-ai-source-font', font); };
  const setTargetFont = (font: string) => { setTargetFontState(font); localStorage.setItem('mcc-ai-target-font', font); };
  
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    
    if (sourceText.trim()) {
      debounceRef.current = setTimeout(() => {
        translate(sourceText, targetLang);
      }, 800);
    } else {
      setTranslatedText('');
      setState('idle');
    }
    
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sourceText, targetLang, sourceLang]);

  const exportTranslation = () => {
    if (!translatedText) return;

    const htmlContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>Translation</title>
      </head>
      <body>
        <div style="font-family: ${targetFont === 'System Default' ? 'sans-serif' : targetFont}; font-size: ${fontSize}; font-weight: ${isBold ? 'bold' : 'normal'}; font-style: ${isItalic ? 'italic' : 'normal'}; text-decoration: ${isUnderline ? 'underline' : 'none'}; text-align: ${textAlign}; color: ${textColor};">
          ${translatedText.replace(/\n/g, '<br>')}
        </div>
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff', htmlContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `translation_${targetLang.toLowerCase()}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const translate = async (text: string, target: string) => {
    if (!text.trim()) { setTranslatedText(''); setState('idle'); return; }
    setState('translating');
    setErrorMsg('');
    try {
      const result = await providerManager.translateText(
        text,
        sourceLang,
        target,
        openAiApiKey
      );
      setTranslatedText(result.text);
      if (sourceLang === 'Auto Detect' && result.detectedLang) {
        setDetectedLang(result.detectedLang);
      } else {
        setDetectedLang('');
      }
      setState('done');
      fetchBillingOverview();
      addHistoryItem('translation', `${sourceLang === 'Auto Detect' ? (result.detectedLang || 'Detected') : sourceLang} → ${target}`, `${text.split(' ').filter(Boolean).length} words`, `Original:\n${text}\n\nTranslation:\n${result.text}`);
    } catch (err: any) {
      setErrorMsg(err.message || 'Translation failed. Please check your connection.');
      setState('error');
    }
  };

  const handleSourceChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value.slice(0, 5000);
    setSourceText(val);
    setCharCount(val.length);
  };

  const handleSwap = () => {
    if (sourceLang === 'Auto Detect') return;
    ttsService.stop();
    const prevSrc = sourceLang, prevTgt = targetLang;
    setSourceLang(prevTgt);
    setTargetLang(prevSrc);
    setSourceText(translatedText);
    setCharCount(translatedText.length);
    setTranslatedText('');
    setState('idle');
  };

  const handleTargetChange = (lang: string) => { setTargetLang(lang); };

  const handleSrcListen = () => {
    if (srcTtsState === 'idle' || srcTtsState === 'error') {
      const lang = sourceLang === 'Auto Detect' ? (detectedLang || 'English') : sourceLang;
      ttsService.play(sourceText, lang, {
        onStateChange: setSrcTtsState,
        onWarning: (msg) => setErrorMsg(msg),
        openAiApiKey: openAiApiKey
      });
      setTgtTtsState('idle'); // ensure target UI resets if playing
    } else if (srcTtsState === 'playing') {
      ttsService.pause();
    } else if (srcTtsState === 'paused') {
      ttsService.resume();
    }
  };

  const handleSrcStop = () => {
    ttsService.stop();
  };

  const handleTgtListen = () => {
    if (tgtTtsState === 'idle' || tgtTtsState === 'error') {
      ttsService.play(translatedText, targetLang, {
        onStateChange: setTgtTtsState,
        onWarning: (msg) => setErrorMsg(msg),
        openAiApiKey: openAiApiKey
      });
      setSrcTtsState('idle'); // ensure source UI resets if playing
    } else if (tgtTtsState === 'playing') {
      ttsService.pause();
    } else if (tgtTtsState === 'paused') {
      ttsService.resume();
    }
  };

  const handleTgtStop = () => {
    ttsService.stop();
  };

  const copyText = (text: string, type: 'src' | 'tgt') => {
    navigator.clipboard.writeText(text);
    if (type === 'src') { setCopiedSrc(true); setTimeout(() => setCopiedSrc(false), 2000); }
    else { setCopiedTgt(true); setTimeout(() => setCopiedTgt(false), 2000); }
  };

  const reset = () => {
    ttsService.stop();
    setSourceText(''); setTranslatedText(''); setState('idle');
    setDetectedLang(''); setCharCount(0); setErrorMsg('');
  };

  const selectStyle = {
    background: 'var(--bg-subtle)',
    border: '1px solid var(--border-base)',
    color: 'var(--text-primary)',
  };

  const translationHistory = (history || []).filter(item => item.type === 'translation');
  const translationLimit = billingOverview?.usage?.translation_chars_limit || 50000;
  const remainingChars = Math.max(0, translationLimit - (billingOverview?.usage?.translation_chars_used || 0));

  return (
    <div className="space-y-6 w-full animate-fadeIn">
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
        
        {/* Managed Provider Badge */}
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-200" style={{ background: 'var(--bg-card)' }}>
          <Cpu size={14} className="text-emerald-500" />
          <span>Managed by Platform Administrator</span>
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

      {/* Main Content */}
      <div className="flex flex-col gap-6">
          {/* Language Bar Card */}
          <div className="app-card rounded-2xl p-5 border border-slate-200/60 dark:border-white/5 pb-7">
            <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-2 sm:flex sm:flex-row sm:flex-nowrap sm:gap-3 relative">
              {/* Source Lang */}
              <div className="flex-1 min-w-0 relative">
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
                  <p className="absolute -bottom-5 left-1 text-[10px] font-semibold" style={{ color: 'var(--accent)' }}>
                    Detected: {detectedLang}
                  </p>
                )}
              </div>

              {/* Swap */}
              <button id="trans-swap-btn" onClick={handleSwap}
                disabled={sourceLang === 'Auto Detect'}
                className="btn-ghost flex h-[38px] w-9 flex-shrink-0 items-center justify-center rounded-xl p-0 disabled:opacity-40 disabled:cursor-not-allowed"
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



              {/* Font Size */}
              <div className="flex-1 min-w-0 sm:max-w-[100px]">
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Size</label>
                <div className="relative">
                  <select value={fontSize}
                    onChange={(e) => setFontSize(e.target.value)}
                    className="w-full appearance-none rounded-xl px-3.5 pr-9 py-2.5 text-sm font-semibold focus:outline-none"
                    style={selectStyle}>
                    <option value="12px">12</option>
                    <option value="14px">14</option>
                    <option value="16px">16</option>
                    <option value="18px">18</option>
                    <option value="20px">20</option>
                    <option value="22px">22</option>
                    <option value="24px">24</option>
                  </select>
                  <ChevronDown size={13} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                </div>
              </div>

              {/* Clear */}
              {(sourceText || translatedText) && (
                <button onClick={reset}
                  className="btn-ghost col-span-3 flex flex-shrink-0 items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-xs h-[38px] sm:col-span-1">
                  <RefreshCw size={11} /> Clear
                </button>
              )}
            </div>
          </div>

          {/* Translation Panels */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Source */}
            <div className="app-card rounded-2xl p-5 flex flex-col border border-slate-200/60 dark:border-white/5">
              <div className="mb-3 flex items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Source Text</span>
                  <div className="w-[140px]">
                    <FontPicker value={sourceFont} onChange={setSourceFont} hideLabel />
                  </div>
                </div>
                <div className="flex gap-1">
                  <button id="trans-copy-src-btn" onClick={() => copyText(sourceText, 'src')}
                    disabled={!sourceText}
                    title="Copy"
                    className="btn-ghost flex items-center justify-center rounded-lg p-1.5 disabled:opacity-40">
                    {copiedSrc ? <CheckCircle2 size={14} className="text-emerald-500" /> : <Copy size={14} />}
                  </button>
                  <button id="trans-listen-src-btn"
                    onClick={handleSrcListen}
                    disabled={!sourceText}
                    title={srcTtsState === 'playing' ? "Pause" : (srcTtsState === 'paused' ? "Resume" : "Listen")}
                    className="btn-ghost flex items-center justify-center rounded-lg p-1.5 disabled:opacity-40">
                    {srcTtsState === 'playing' ? <Pause size={14} /> : (srcTtsState === 'paused' ? <Play size={14} /> : <Volume2 size={14} />)}
                  </button>
                  {srcTtsState !== 'idle' && srcTtsState !== 'error' && (
                    <button id="trans-stop-src-btn" onClick={handleSrcStop}
                      title="Stop"
                      className="btn-ghost flex items-center justify-center rounded-lg p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                      <Square size={14} fill="currentColor" />
                    </button>
                  )}
                </div>
              </div>
              <textarea
                id="trans-source-input"
                value={sourceText}
                onChange={handleSourceChange}
                placeholder="Type or paste text to translate…"
                rows={15}
                className="flex-1 resize-none rounded-xl px-4 py-3 text-sm focus:outline-none"
                style={{
                  background: 'var(--bg-subtle)',
                  border: '1px solid var(--border-base)',
                  color: 'var(--text-primary)',
                  fontSize: fontSize,
                  fontFamily: sourceFont === 'System Default' ? 'inherit' : `"${sourceFont}", sans-serif`
                }}
              />
              <div className="mt-3 flex items-center justify-between">
                <div className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                  {charCount} / 5,000
                </div>
              </div>
            </div>

            {/* Translation Output */}
            <div className="app-card rounded-2xl p-5 flex flex-col border border-slate-200/60 dark:border-white/5">
              <div className="mb-3 flex items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                    Translation — {targetLang}
                  </span>
                  <div className="w-[140px]">
                    <FontPicker value={targetFont} onChange={setTargetFont} hideLabel />
                  </div>
                </div>
                <div className="flex gap-1">
                  <button id="trans-copy-tgt-btn" onClick={() => copyText(translatedText, 'tgt')}
                    disabled={!translatedText}
                    title="Copy"
                    className="btn-ghost flex items-center justify-center rounded-lg p-1.5 disabled:opacity-40">
                    {copiedTgt ? <CheckCircle2 size={14} className="text-emerald-500" /> : <Copy size={14} />}
                  </button>
                  <button id="trans-listen-tgt-btn" onClick={handleTgtListen}
                    disabled={!translatedText}
                    title={tgtTtsState === 'playing' ? "Pause" : (tgtTtsState === 'paused' ? "Resume" : "Listen")}
                    className="btn-ghost flex items-center justify-center rounded-lg p-1.5 disabled:opacity-40">
                    {tgtTtsState === 'playing' ? <Pause size={14} /> : (tgtTtsState === 'paused' ? <Play size={14} /> : <Volume2 size={14} />)}
                  </button>
                  {tgtTtsState !== 'idle' && tgtTtsState !== 'error' && (
                    <button id="trans-stop-tgt-btn" onClick={handleTgtStop}
                      title="Stop"
                      className="btn-ghost flex items-center justify-center rounded-lg p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                      <Square size={14} fill="currentColor" />
                    </button>
                  )}
                  <button id="trans-export-btn" onClick={exportTranslation}
                    disabled={!translatedText}
                    title="Export"
                    className="btn-ghost flex items-center justify-center rounded-lg p-1.5 disabled:opacity-40">
                    <Download size={14} />
                  </button>
                </div>
              </div>

              <div className="relative flex flex-col flex-1 rounded-xl p-4" style={{
                background: 'var(--bg-subtle)',
                border: '1px solid var(--border-base)',
                minHeight: '24rem',
              }}>
                <div className="flex flex-col flex-1">
                  <div className="flex flex-wrap items-center gap-1.5 border-b border-[var(--border-base)] pb-2 mb-3">
                    <button onClick={() => setIsBold(!isBold)} className={`p-1.5 rounded-lg transition-colors ${isBold ? 'bg-slate-200 dark:bg-slate-700 text-teal-600' : 'hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'}`} title="Bold"><Bold size={14} /></button>
                    <button onClick={() => setIsItalic(!isItalic)} className={`p-1.5 rounded-lg transition-colors ${isItalic ? 'bg-slate-200 dark:bg-slate-700 text-teal-600' : 'hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'}`} title="Italic"><Italic size={14} /></button>
                    <button onClick={() => setIsUnderline(!isUnderline)} className={`p-1.5 rounded-lg transition-colors ${isUnderline ? 'bg-slate-200 dark:bg-slate-700 text-teal-600' : 'hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'}`} title="Underline"><Underline size={14} /></button>
                    
                    <div className="w-px h-4 bg-slate-300 dark:bg-slate-600 mx-1.5" />
                    
                    <button onClick={() => setTextAlign('left')} className={`p-1.5 rounded-lg transition-colors ${textAlign === 'left' ? 'bg-slate-200 dark:bg-slate-700 text-teal-600' : 'hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'}`} title="Align Left"><AlignLeft size={14} /></button>
                    <button onClick={() => setTextAlign('center')} className={`p-1.5 rounded-lg transition-colors ${textAlign === 'center' ? 'bg-slate-200 dark:bg-slate-700 text-teal-600' : 'hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'}`} title="Align Center"><AlignCenter size={14} /></button>
                    <button onClick={() => setTextAlign('right')} className={`p-1.5 rounded-lg transition-colors ${textAlign === 'right' ? 'bg-slate-200 dark:bg-slate-700 text-teal-600' : 'hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'}`} title="Align Right"><AlignRight size={14} /></button>
                    <button onClick={() => setTextAlign('justify')} className={`p-1.5 rounded-lg transition-colors ${textAlign === 'justify' ? 'bg-slate-200 dark:bg-slate-700 text-teal-600' : 'hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'}`} title="Justify"><AlignJustify size={14} /></button>
                    
                    <div className="w-px h-4 bg-slate-300 dark:bg-slate-600 mx-1.5" />

                    <input 
                      type="color" 
                      value={textColor} 
                      onChange={(e) => setTextColor(e.target.value)}
                      className="w-6 h-6 p-0 border-0 rounded cursor-pointer bg-transparent"
                      title="Text Color"
                    />
                  </div>

                <textarea 
                  value={translatedText}
                  onChange={(e) => setTranslatedText(e.target.value)}
                  placeholder="Translation will appear here…"
                  className="flex-1 w-full h-full resize-none bg-transparent focus:outline-none text-sm leading-relaxed"
                  style={{ 
                    color: textColor, 
                    minHeight: '20rem',
                    fontSize: fontSize,
                    fontFamily: targetFont === 'System Default' ? 'inherit' : `"${targetFont}", sans-serif`,
                    fontWeight: isBold ? 'bold' : 'normal',
                    fontStyle: isItalic ? 'italic' : 'normal',
                    textDecoration: isUnderline ? 'underline' : 'none',
                    textAlign: textAlign
                  }}
                />
                </div>
                {state === 'translating' && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-xl"
                    style={{ background: 'color-mix(in srgb, var(--bg-subtle) 80%, transparent)' }}>
                    <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: 'var(--text-muted)' }}>
                      <Loader2 size={15} className="animate-spin" /> Translating…
                    </div>
                  </div>
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
    </div>
  );
};
