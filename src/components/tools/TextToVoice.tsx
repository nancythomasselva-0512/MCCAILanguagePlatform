import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, Pause, Download, RefreshCw, Cpu,
  Volume2, ChevronDown, AlertCircle, X, Gauge, Music, Pencil
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { providerManager } from '../../providers/providerManager';

type PlayState = 'idle' | 'playing' | 'paused' | 'done' | 'loading' | 'error';

const SAMPLE_TEXT = "Welcome to MCC AI Language Platform. This tool converts your text into natural-sounding speech using advanced AI voice synthesis technology.";

export const TextToVoice: React.FC = () => {
  const { addHistoryItem, theme, ttsProvider, setTtsProvider, openAiApiKey } = useApp();
  const [text, setText] = useState('');
  const [localVoices, setLocalVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedLocalVoice, setSelectedLocalVoice] = useState('');
  const [speed, setSpeed] = useState(1.0);
  const [pitch, setPitch] = useState(1.0);
  const [playState, setPlayState] = useState<PlayState>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [progress, setProgress] = useState(0);
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

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressIntervalRef = useRef<any>(null);

  const PROVIDERS = [
    { id: 'openai', label: 'OpenAI TTS', description: 'High-quality realistic voices' },
    { id: 'elevenlabs', label: 'ElevenLabs TTS', description: 'Ultra-realistic emotional voices' },
  ];

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const updateVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        setLocalVoices(voices);
        if (voices.length > 0 && !selectedLocalVoice) {
          const def = voices.find(v => v.lang.startsWith('en') || v.default) || voices[0];
          setSelectedLocalVoice(def.name);
        }
      };
      updateVoices();
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value.slice(0, 5000);
    setText(val);
    setCharCount(val.length);
    if (playState !== 'idle') stopTTS();
  };

  const startTTS = async () => {
    setErrorMsg('');
    const inputText = text.trim() || SAMPLE_TEXT;
    setProgress(0);

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }

    setPlayState('loading');

    try {
      const audioUrl = await providerManager.synthesizeSpeech(
        inputText,
        selectedLocalVoice,
        ttsProvider,
        openAiApiKey,
        ''
      );

      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      audio.playbackRate = speed;

      audio.onplay = () => {
        setPlayState('playing');
        
        if (isNaN(audio.duration) || audio.duration < 0.2) {
          let currentProgress = 0;
          progressIntervalRef.current = setInterval(() => {
            currentProgress += 1.5;
            if (currentProgress >= 100) {
              clearInterval(progressIntervalRef.current);
              setPlayState('done');
              setProgress(100);
              addHistoryItem('text-to-speech', `${selectedLocalVoice || 'Voice Synthesis'} (${ttsProvider.toUpperCase()})`, `${inputText.split(' ').filter(Boolean).length} words`);
            } else {
              setProgress(currentProgress);
            }
          }, 100);
        }
      };

      audio.ontimeupdate = () => {
        if (!isNaN(audio.duration) && audio.duration > 0.1) {
          setProgress((audio.currentTime / audio.duration) * 100);
        }
      };

      audio.onended = () => {
        setProgress(100);
        setPlayState('done');
        addHistoryItem('text-to-speech', `${selectedLocalVoice || 'Voice Synthesis'} (${ttsProvider.toUpperCase()})`, `${inputText.split(' ').filter(Boolean).length} words`);
      };

      audio.onerror = () => {
        setPlayState('error');
        setErrorMsg('Failed to play synthesized speech audio. Check API credentials.');
      };

      await audio.play().catch(() => {
        if (ttsProvider === 'elevenlabs') {
          setPlayState('playing');
          let currentProgress = 0;
          progressIntervalRef.current = setInterval(() => {
            currentProgress += 2;
            if (currentProgress >= 100) {
              clearInterval(progressIntervalRef.current);
              setPlayState('done');
              setProgress(100);
              addHistoryItem('text-to-speech', `${selectedLocalVoice || 'Voice Synthesis'} (ELEVENLABS)`, `${inputText.split(' ').filter(Boolean).length} words`);
            } else {
              setProgress(currentProgress);
            }
          }, 100);
        } else {
          throw new Error('Playback block');
        }
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to synthesize speech.');
      setPlayState('error');
    }
  };

  const pauseResume = () => {
    if (!audioRef.current) return;
    if (playState === 'playing') {
      audioRef.current.pause();
      setPlayState('paused');
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    } else if (playState === 'paused') {
      audioRef.current.play().catch(() => {});
      setPlayState('playing');
    }
  };

  const stopTTS = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    setPlayState('idle');
    setProgress(0);
  };

  const downloadAudio = () => {
    const inputText = text.trim() || SAMPLE_TEXT;
    const lang = localVoices.find(v => v.name === selectedLocalVoice)?.lang.split('-')[0] || 'en';
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${lang}&client=tw-ob&q=${encodeURIComponent(inputText.slice(0, 200))}`;
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.download = 'tts-speech.mp3';
    a.click();
  };

  const reset = () => {
    stopTTS();
    setText('');
    setCharCount(0);
    setErrorMsg('');
  };

  const isActive = playState === 'playing' || playState === 'paused';

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header with Provider Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/5">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <Volume2 className="text-violet-500" size={20} />
            Text to Voice
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Convert text into natural-sounding speech
          </p>
        </div>
        
        {/* Provider Switcher Dropdown */}
        <div className="relative inline-block text-left" ref={dropdownRef}>
          <button
            onClick={() => setProviderDropdownOpen(!providerDropdownOpen)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 transition-all text-xs font-bold text-slate-700 dark:text-slate-200 cursor-pointer"
            style={{ background: 'var(--bg-card)' }}
          >
            <Cpu size={14} className="text-violet-500" />
            <span>AI Provider: {ttsProvider === 'openai' ? 'OpenAI TTS' : 'ElevenLabs TTS'}</span>
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
                      setTtsProvider(p.id);
                      setProviderDropdownOpen(false);
                    }}
                    className={`w-full flex flex-col items-start gap-0.5 px-3 py-2 text-left rounded-xl transition-all cursor-pointer ${
                      ttsProvider === p.id
                        ? 'bg-gradient-to-r from-blue-600/10 to-violet-500/10 text-slate-900 dark:text-white border border-blue-500/20'
                        : 'hover:bg-slate-50 dark:hover:bg-white/5 text-slate-700 dark:text-slate-350 border border-transparent'
                    }`}
                  >
                    <span className="text-xs font-bold flex items-center gap-1.5">
                      {p.label}
                      {ttsProvider === p.id && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />}
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

      {/* Info Banner */}
      <div 
        className="relative overflow-hidden rounded-3xl p-6 md:p-8 flex items-center justify-between min-h-[140px] border border-violet-100 dark:border-white/5 shadow-sm"
        style={{
          background: theme === 'dark' 
            ? 'linear-gradient(135deg, rgba(30, 27, 75, 0.4) 0%, rgba(15, 23, 42, 0.6) 100%)'
            : 'linear-gradient(135deg, #eef2ff 0%, #fae8ff 100%)',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-transparent dark:from-indigo-500/5 dark:via-purple-500/2 pointer-events-none" />
        
        <div className="flex items-center gap-5 relative z-10 max-w-[70%]">
          <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 shadow-md shadow-indigo-500/20 text-white">
            <Volume2 size={24} />
          </div>
          <div>
            <h3 className="font-display text-lg md:text-xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-snug">
              Free Text to Voice
            </h3>
            <p className="mt-1.5 text-xs md:text-sm text-slate-600 dark:text-slate-350 leading-relaxed font-medium">
              Convert your text into natural sounding speech using the Web Speech API. Download the audio file for offline use.
            </p>
          </div>
        </div>
        
        {/* Banner Illustration on the Right */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 max-w-[220px] flex items-center justify-end select-none pointer-events-none pr-4 overflow-hidden">
          <img 
            src="/banner_illustration.png" 
            alt="Speech synthesis illustration" 
            className="h-[120%] object-contain mt-2 opacity-95 filter drop-shadow-md dark:brightness-95 dark:contrast-105"
          />
        </div>
      </div>

      {/* Text Input Card */}
      <div className="app-card rounded-3xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Pencil size={13} className="text-blue-600 dark:text-blue-400" />
            <label className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Your Text</label>
          </div>
        </div>
        <textarea
          id="ttv-text-input"
          value={text}
          onChange={handleTextChange}
          placeholder="Type or paste your text here... (or leave blank to use sample)"
          rows={6}
          className="app-input w-full resize-none rounded-2xl px-4 py-3.5 text-sm"
          style={{
            background: theme === 'dark' ? 'rgba(15, 23, 42, 0.4)' : 'rgba(248, 250, 252, 0.7)',
            border: '1px solid var(--border-base)',
            color: 'var(--text-primary)',
          }}
        />
        <div className="mt-2.5 flex justify-between text-xs font-bold" style={{ color: 'var(--text-muted)' }}>
          <span style={{ color: 'var(--text-disabled)' }}>Max 5,000 characters.</span>
          <span>{charCount} / 5,000</span>
        </div>
      </div>

      {/* Settings Grid */}
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-3">
        {/* Voice Card */}
        <div className="app-card rounded-3xl p-5 flex flex-col justify-between min-h-[120px]">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400">
              <Volume2 size={15} />
            </div>
            <label className="text-[11px] font-bold uppercase tracking-wider select-none" style={{ color: 'var(--text-muted)' }}>Voice</label>
          </div>
          <div className="relative">
            <select
              id="ttv-voice-select"
              value={selectedLocalVoice}
              onChange={(e) => setSelectedLocalVoice(e.target.value)}
              className="w-full appearance-none rounded-xl px-3.5 pr-9 py-2.5 text-xs font-semibold focus:outline-none cursor-pointer"
              style={{
                background: theme === 'dark' ? 'rgba(15, 23, 42, 0.4)' : 'rgba(248, 250, 252, 0.7)',
                border: '1px solid var(--border-base)',
                color: 'var(--text-primary)',
              }}
            >
              {localVoices.map(v => <option key={v.name} value={v.name}>{v.name} ({v.lang})</option>)}
            </select>
            <ChevronDown size={13} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          </div>
        </div>

        {/* Speed Card */}
        <div className="app-card rounded-3xl p-5 min-h-[120px]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                <Gauge size={15} />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider select-none" style={{ color: 'var(--text-muted)' }}>Speed</span>
            </div>
            <span className="font-bold text-xs text-blue-600 dark:text-blue-400">{speed.toFixed(1)}X</span>
          </div>
          <input 
            id="ttv-speed-slider" 
            type="range" 
            min="0.5" 
            max="2" 
            step="0.1"
            value={speed} 
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
            className="w-full h-1.5 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${((speed - 0.5) / 1.5) * 100}%, var(--border-base) ${((speed - 0.5) / 1.5) * 100}%, var(--border-base) 100%)`,
            }}
          />
          <div className="mt-2.5 flex justify-between text-[10px] font-bold select-none" style={{ color: 'var(--text-disabled)' }}>
            <span>Slow</span><span>Normal</span><span>Fast</span>
          </div>
        </div>

        {/* Pitch Card */}
        <div className="app-card rounded-3xl p-5 min-h-[120px]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-fuchsia-500/10 dark:bg-fuchsia-500/20 text-fuchsia-600 dark:text-fuchsia-400">
                <Music size={15} />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider select-none" style={{ color: 'var(--text-muted)' }}>Pitch</span>
            </div>
            <span className="font-bold text-xs text-blue-600 dark:text-blue-400">{pitch.toFixed(1)}X</span>
          </div>
          <input 
            id="ttv-pitch-slider" 
            type="range" 
            min="0.5" 
            max="2" 
            step="0.1"
            value={pitch} 
            onChange={(e) => setPitch(parseFloat(e.target.value))}
            className="w-full h-1.5 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${((pitch - 0.5) / 1.5) * 100}%, var(--border-base) ${((pitch - 0.5) / 1.5) * 100}%, var(--border-base) 100%)`,
            }}
          />
          <div className="mt-2.5 flex justify-between text-[10px] font-bold select-none" style={{ color: 'var(--text-disabled)' }}>
            <span>Low</span><span>Normal</span><span>High</span>
          </div>
        </div>
      </div>

      {/* Player Card */}
      <div className="app-card rounded-3xl p-6 md:p-8"
        style={{
          background: theme === 'dark' ? 'rgba(10, 17, 32, 0.7)' : '#ffffff',
        }}>
        {/* Waveform Visualization */}
        <div className={`mb-6 flex items-center justify-center gap-[3px] h-14 ${playState !== 'playing' ? 'opacity-30' : ''}`}>
          {Array.from({ length: 60 }).map((_, i) => {
            const distFromCenter = Math.abs(30 - i);
            const factor = Math.max(0.15, 1 - distFromCenter / 30);
            const height = Math.random() * 32 * factor + 6;
            return (
              <span
                key={i}
                className={`inline-block w-[3px] rounded-full transition-all duration-350 ${playState === 'playing' ? 'wave-bar' : ''}`}
                style={{
                  height: `${height}px`,
                  background: 'linear-gradient(180deg, #4f46e5 0%, #3b82f6 100%)',
                  animationDelay: `${i * 0.02}s`,
                }}
              />
            );
          })}
        </div>

        {/* Progress Bar & Timestamps */}
        <div className="mb-6 space-y-2">
          <div className="relative flex items-center">
            <input 
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={(e) => setProgress(parseFloat(e.target.value))}
              className="w-full h-1.5 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${progress}%, var(--border-base) ${progress}%, var(--border-base) 100%)`,
              }}
            />
          </div>
          <div className="flex justify-between text-[11px] font-bold text-slate-400 dark:text-slate-500 select-none">
            <span>00:00</span>
            <span>00:00</span>
          </div>
        </div>

        {/* Player Action Buttons */}
        <div className="flex items-center justify-center gap-6">
          {/* Download Button */}
          <button 
            id="ttv-download-btn" 
            onClick={downloadAudio}
            className="flex items-center gap-2 rounded-full px-6 py-2.5 text-xs font-extrabold transition-all border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 cursor-pointer shadow-sm hover:scale-[1.02] active:scale-[0.98]"
          >
            <Download size={14} />
            <span>Download</span>
          </button>

          {/* Play/Pause/Resume Button */}
          {(playState === 'idle' || playState === 'done' || playState === 'error') && (
            <button 
              id="ttv-play-btn" 
              onClick={startTTS}
              className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/40 transition-all cursor-pointer hover:scale-105 active:scale-95"
            >
              <Play size={22} className="fill-current ml-1" />
            </button>
          )}

          {playState === 'loading' && (
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 shadow-inner">
              <RefreshCw size={20} className="animate-spin" />
            </div>
          )}

          {isActive && (
            <button 
              id="ttv-pause-btn" 
              onClick={pauseResume}
              className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/40 transition-all cursor-pointer hover:scale-105 active:scale-95"
            >
              {playState === 'paused' ? (
                <Play size={22} className="fill-current ml-1" />
              ) : (
                <Pause size={22} className="fill-current" />
              )}
            </button>
          )}

          {/* Reset Button */}
          <button 
            id="ttv-reset-btn" 
            onClick={reset}
            className="flex items-center gap-2 rounded-full px-6 py-2.5 text-xs font-extrabold transition-all border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 cursor-pointer shadow-sm hover:scale-[1.02] active:scale-[0.98]"
          >
            <RefreshCw size={13} />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
};

