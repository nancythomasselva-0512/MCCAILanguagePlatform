import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, Pause, Download, RefreshCw, Cpu,
  Volume2, ChevronDown, AlertCircle, X, Gauge, Music, Pencil,
  Award, Music4, Speaker, FileText
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { providerManager } from '../../providers/providerManager';

type PlayState = 'idle' | 'playing' | 'paused' | 'done' | 'loading' | 'error';

const SAMPLE_TEXT = "Welcome to MCC AI Language Platform. This tool converts your text into natural-sounding speech using advanced AI voice synthesis technology.";

export const TextToVoice: React.FC = () => {
  const { history, billingOverview, addHistoryItem, theme, openAiApiKey, fetchBillingOverview } = useApp();
  const [text, setText] = useState('');
  const [localVoices, setLocalVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [activeProvider, setActiveProvider] = useState<string>('Managed by Platform');
  const [selectedLocalVoice, setSelectedLocalVoice] = useState('');
  const [speed, setSpeed] = useState(1.0);
  const [pitch, setPitch] = useState(1.0);
  const [playState, setPlayState] = useState<PlayState>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [progress, setProgress] = useState(0);
  const [charCount, setCharCount] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressIntervalRef = useRef<any>(null);

  
  useEffect(() => {
    providerManager.getActiveProviders().then(res => {
      if (res["Text To Speech"]) {
        setActiveProvider(res["Text To Speech"].toUpperCase());
      }
    });
  }, []);
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
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    setPlayState('loading');

    // Call backend endpoint which uses global provider mapping
    try {
      const audioUrl = await providerManager.synthesizeSpeech(
        inputText,
        selectedLocalVoice,
        openAiApiKey,
        ''
      );
      fetchBillingOverview();

      // Check if audioUrl is the mock fallback song
      if (audioUrl === "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3") {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          console.log("Mock audio URL received. Falling back to browser SpeechSynthesis.");
          const utterance = new SpeechSynthesisUtterance(inputText);
          const voice = window.speechSynthesis.getVoices().find(v => v.name === selectedLocalVoice);
          if (voice) {
            utterance.voice = voice;
          }
          utterance.rate = speed;
          utterance.pitch = pitch;

          utterance.onstart = () => {
            setPlayState('playing');
          };

          let progressVal = 0;
          const totalChars = inputText.length;
          utterance.onboundary = (event) => {
            if (event.charIndex) {
              progressVal = (event.charIndex / totalChars) * 100;
              setProgress(Math.min(99, progressVal));
            }
          };

          utterance.onend = () => {
            setProgress(100);
            setPlayState('done');
            addHistoryItem('text-to-speech', inputText, `${selectedLocalVoice || 'Browser Voice'} (Web Speech) • ${inputText.split(' ').filter(Boolean).length} words`);
          };

          utterance.onerror = (e) => {
            console.error("Fallback Speech synthesis error:", e);
            setPlayState('error');
            setErrorMsg('Failed to synthesize speech using Web Speech API.');
          };

          window.speechSynthesis.speak(utterance);
          return;
        }
      }

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
              addHistoryItem('text-to-speech', inputText, `${selectedLocalVoice || 'Voice Synthesis'} (${activeProvider}) • ${inputText.split(' ').filter(Boolean).length} words`);
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
        addHistoryItem('text-to-speech', inputText, `${selectedLocalVoice || 'Voice Synthesis'} (${activeProvider}) • ${inputText.split(' ').filter(Boolean).length} words`);
      };

      audio.onerror = () => {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(inputText);
          const voice = window.speechSynthesis.getVoices().find(v => v.name === selectedLocalVoice);
          if (voice) {
            utterance.voice = voice;
          }
          utterance.rate = speed;
          utterance.pitch = pitch;

          utterance.onstart = () => {
            setPlayState('playing');
          };

          let progressVal = 0;
          const totalChars = inputText.length;
          utterance.onboundary = (event) => {
            if (event.charIndex) {
              progressVal = (event.charIndex / totalChars) * 100;
              setProgress(Math.min(99, progressVal));
            }
          };

          utterance.onend = () => {
            setProgress(100);
            setPlayState('done');
            addHistoryItem('text-to-speech', inputText, `${selectedLocalVoice || 'Browser Voice'} (Web Speech) • ${inputText.split(' ').filter(Boolean).length} words`);
          };

          utterance.onerror = () => {
            setPlayState('error');
            setErrorMsg('Failed to synthesize speech using Web Speech API.');
          };

          window.speechSynthesis.speak(utterance);
          return;
        }

        setPlayState('error');
        setErrorMsg('Failed to play synthesized speech audio. Check API credentials.');
      };

      await audio.play().catch(() => {
        if (activeProvider.toLowerCase() === 'elevenlabs') {
          setPlayState('playing');
          let currentProgress = 0;
          progressIntervalRef.current = setInterval(() => {
            currentProgress += 2;
            if (currentProgress >= 100) {
              clearInterval(progressIntervalRef.current);
              setPlayState('done');
              setProgress(100);
              addHistoryItem('text-to-speech', inputText, `${selectedLocalVoice || 'Voice Synthesis'} (ELEVENLABS) • ${inputText.split(' ').filter(Boolean).length} words`);
            } else {
              setProgress(currentProgress);
            }
          }, 100);
        } else {
          // Playback blocked fallback
          if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(inputText);
            const voice = window.speechSynthesis.getVoices().find(v => v.name === selectedLocalVoice);
            if (voice) {
              utterance.voice = voice;
            }
            utterance.rate = speed;
            utterance.pitch = pitch;

            utterance.onstart = () => {
              setPlayState('playing');
            };

            let progressVal = 0;
            const totalChars = inputText.length;
            utterance.onboundary = (event) => {
              if (event.charIndex) {
                progressVal = (event.charIndex / totalChars) * 100;
                setProgress(Math.min(99, progressVal));
              }
            };

            utterance.onend = () => {
              setProgress(100);
              setPlayState('done');
              addHistoryItem('text-to-speech', inputText, `${selectedLocalVoice || 'Browser Voice'} (Web Speech) • ${inputText.split(' ').filter(Boolean).length} words`);
            };

            utterance.onerror = () => {
              setPlayState('error');
              setErrorMsg('Failed to synthesize speech using Web Speech API.');
            };

            window.speechSynthesis.speak(utterance);
            return;
          }
          throw new Error('Playback block');
        }
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to synthesize speech.');
      setPlayState('error');
    }
  };

  const pauseResume = () => {
    if (!audioRef.current) {
      return;
    }

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
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
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

  const ttsHistory = (history || []).filter(item => item.type === 'text-to-speech');
  const getVoiceName = (item: any) => {
    if (item.details.includes(' • ')) {
      return item.details.split(' • ')[0];
    }
    return item.title;
  };
  const uniqueVoicesCount = new Set(ttsHistory.map(getVoiceName)).size;
  const ttsLimit = billingOverview?.usage?.tts_chars_limit || 10000;
  const remainingChars = Math.max(0, ttsLimit - (billingOverview?.usage?.tts_chars_used || 0));

  const getVoiceBadge = (title: string, details: string) => {
    const searchString = details.includes(' • ') ? details : title;
    if (searchString.includes('OpenAI') || searchString.includes('OPENAI')) {
      return 'OPENAI';
    }
    if (searchString.includes('ElevenLabs') || searchString.includes('ELEVENLABS')) {
      return '11LABS';
    }
    if (searchString.includes('Web Speech') || searchString.includes('Browser') || searchString.includes('Microsoft') || searchString.includes('Google')) {
      return 'BROWSR';
    }
    const parts = searchString.split(' • ')[0].split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return 'VOICE';
  };

  return (
    <div className="space-y-6 w-full animate-fadeIn">
      {/* Header with Provider Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/5">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <Volume2 className="text-teal-500" size={20} />
            Text to Voice
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Convert text into natural-sounding speech
          </p>
        </div>
        
        {/* Managed Provider Badge */}
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-200" style={{ background: 'var(--bg-card)' }}>
          <Cpu size={14} className="text-teal-500" />
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

      {/* 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column - Forms & Overview */}
        <div className="lg:col-span-3 space-y-6">
          {/* Info Banner */}
          <div 
            className="relative overflow-hidden rounded-3xl p-6 md:p-8 flex items-center justify-between min-h-[140px] border border-teal-100 dark:border-white/5 shadow-sm"
            style={{
              background: theme === 'dark' 
                ? 'linear-gradient(135deg, rgba(6, 78, 59, 0.4) 0%, rgba(15, 118, 110, 0.6) 100%)'
                : 'linear-gradient(135deg, #ccfbf1 0%, #dcfce7 100%)',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent dark:from-emerald-500/5 dark:via-emerald-500/2 pointer-events-none" />
            
            <div className="flex items-center gap-5 relative z-10 max-w-[70%]">
              <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 shadow-md shadow-emerald-500/20 text-white">
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
                className="h-[120%] object-contain mt-2 opacity-95 filter drop-shadow-md hue-rotate-[250deg] dark:brightness-95 dark:contrast-105"
              />
            </div>
          </div>

          {/* Text Input Card */}
          <div className="app-card rounded-3xl p-6 border border-slate-200/60 dark:border-white/5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Pencil size={13} className="text-teal-600 dark:text-teal-400" />
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
                fontFamily: 'var(--content-font)'
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
            <div className="app-card rounded-3xl p-5 flex flex-col justify-between min-h-[120px] border border-slate-200/60 dark:border-white/5">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-500/10 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400">
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
            <div className="app-card rounded-3xl p-5 min-h-[120px] border border-slate-200/60 dark:border-white/5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                    <Gauge size={15} />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider select-none" style={{ color: 'var(--text-muted)' }}>Speed</span>
                </div>
                <span className="font-bold text-xs text-teal-600 dark:text-teal-400">{speed.toFixed(1)}X</span>
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
            <div className="app-card rounded-3xl p-5 min-h-[120px] border border-slate-200/60 dark:border-white/5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-fuchsia-500/10 dark:bg-fuchsia-500/20 text-fuchsia-600 dark:text-fuchsia-400">
                    <Music size={15} />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider select-none" style={{ color: 'var(--text-muted)' }}>Pitch</span>
                </div>
                <span className="font-bold text-xs text-teal-600 dark:text-teal-400">{pitch.toFixed(1)}X</span>
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
          <div className="app-card rounded-3xl p-6 md:p-8 border border-slate-200/60 dark:border-white/5"
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
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/40 transition-all cursor-pointer hover:scale-105 active:scale-95"
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
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/40 transition-all cursor-pointer hover:scale-105 active:scale-95"
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

          {/* Usage Overview Row */}
          <div className="space-y-4 pt-2">
            <h3 className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Usage Overview</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {/* Audio Generated */}
              <div className="glass-card rounded-2xl p-4.5 border border-slate-200 dark:border-white/5 bg-white/40 dark:bg-[#111827]/40 flex flex-col justify-between min-h-[105px]">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Audio Generated</span>
                    <h4 className="text-xl font-black text-slate-900 dark:text-white mt-1">{ttsHistory.length}</h4>
                  </div>
                  <div className="h-7 w-7 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-500 flex-shrink-0">
                    <Music4 size={14} />
                  </div>
                </div>
                <div className="text-[9px] text-slate-400 dark:text-slate-500 font-bold mt-2.5">
                  Total voice outputs
                </div>
              </div>

              {/* Characters Synthesized */}
              <div className="glass-card rounded-2xl p-4.5 border border-slate-200 dark:border-white/5 bg-white/40 dark:bg-[#111827]/40 flex flex-col justify-between min-h-[105px]">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Characters Synthesized</span>
                    <h4 className="text-xl font-black text-slate-900 dark:text-white mt-1">{(billingOverview?.usage?.tts_chars_used || 0).toLocaleString()}</h4>
                  </div>
                  <div className="h-7 w-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 flex-shrink-0">
                    <FileText size={14} />
                  </div>
                </div>
                <div className="text-[9px] text-slate-400 dark:text-slate-500 font-bold mt-2.5">
                  Characters synthesized
                </div>
              </div>

              {/* Voices Active */}
              <div className="glass-card rounded-2xl p-4.5 border border-slate-200 dark:border-white/5 bg-white/40 dark:bg-[#111827]/40 flex flex-col justify-between min-h-[105px]">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Voices Active</span>
                    <h4 className="text-xl font-black text-slate-900 dark:text-white mt-1">{uniqueVoicesCount}</h4>
                  </div>
                  <div className="h-7 w-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 flex-shrink-0">
                    <Speaker size={14} />
                  </div>
                </div>
                <div className="text-[9px] text-slate-400 dark:text-slate-500 font-bold mt-2.5">
                  Unique voice models used
                </div>
              </div>

              {/* Quality Score */}
              <div className="glass-card rounded-2xl p-4.5 border border-slate-200 dark:border-white/5 bg-white/40 dark:bg-[#111827]/40 flex flex-col justify-between min-h-[105px]">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Remaining Characters</span>
                    <h4 className="text-xl font-black text-slate-900 dark:text-white mt-1">{remainingChars.toLocaleString()}</h4>
                  </div>
                  <div className="h-7 w-7 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500 flex-shrink-0">
                    <Award size={14} />
                  </div>
                </div>
                <div className="text-[9px] text-slate-400 dark:text-slate-500 font-bold mt-2.5">
                  Out of {ttsLimit.toLocaleString()} chars
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Banners & Recent Activity */}
        <div className="lg:col-span-1 space-y-6">
          {/* Connected Banner */}
          <div className="relative overflow-hidden rounded-2xl p-5 border border-slate-200 dark:border-white/5 bg-gradient-to-br from-emerald-600/10 to-teal-500/10 dark:from-emerald-600/5 dark:to-teal-500/5 min-h-[120px] flex flex-col justify-center">
            <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />
            <div className="relative z-10">
              <span className="text-[8px] font-black uppercase text-teal-500 dark:text-teal-400 tracking-wider">Voice Engine</span>
              <h4 className="font-display text-sm font-black text-slate-950 dark:text-white mt-1 leading-snug">18+ Realistic Voice Models</h4>
              <p className="mt-1 text-[10px] text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                High-fidelity realistic text-to-speech voice generation.
              </p>
            </div>
            <Volume2 size={52} className="absolute right-[-10px] bottom-[-10px] opacity-10 text-teal-500" />
          </div>

          {/* Recent Generations Card */}
          <div className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-white/5 bg-white/40 dark:bg-[#111827]/40 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/5 pb-2">
              <h4 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">Recent Audio Files</h4>
              <span className="text-[9px] text-teal-500 dark:text-teal-400 font-bold cursor-pointer hover:underline" onClick={() => fetchBillingOverview()}>Refresh</span>
            </div>

            <div className="space-y-2">
              {ttsHistory.length === 0 ? (
                <div className="text-center py-6 text-slate-400 dark:text-slate-500 text-[10px] font-medium font-sans">
                  No recent audio files.
                </div>
              ) : (
                ttsHistory.slice(0, 5).map(item => {
                  const isNewFormat = item.details.includes(' • ');
                  const displayTitle = isNewFormat ? item.title : item.details;
                  const displayDetails = isNewFormat ? item.details : `${item.title} • ${item.details}`;
                  return (
                    <div key={item.id} className="p-2.5 rounded-xl bg-slate-100/50 dark:bg-slate-950/20 border border-slate-200 dark:border-white/5 flex items-start gap-3 hover:border-slate-300 dark:hover:border-white/10 transition-colors">
                      <span className="text-[9px] font-black text-teal-650 bg-teal-500/10 rounded px-1.5 py-0.5 mt-0.5">{getVoiceBadge(item.title, item.details)}</span>
                      <div className="flex-1 min-w-0 text-left font-sans">
                        <p className="text-[10px] font-bold text-slate-800 dark:text-slate-200 truncate">{displayTitle}</p>
                        <span className="text-[8px] text-slate-500 font-medium">{displayDetails} · {item.timestamp}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Recent Activity Timeline */}
          <div className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-white/5 bg-white/40 dark:bg-[#111827]/40 space-y-3">
            <h4 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest border-b border-slate-200 dark:border-white/5 pb-2">Recent Activity</h4>
            <div className="relative border-l border-slate-200 dark:border-white/5 ml-2 pl-4 space-y-4 text-[10px] font-semibold text-slate-500 text-left">
              {ttsHistory.length === 0 ? (
                <div className="text-center py-4 text-slate-400 dark:text-slate-500 text-[10px] font-medium font-sans">
                  No recent activity.
                </div>
              ) : (
                ttsHistory.slice(0, 4).map(item => {
                  const isNewFormat = item.details.includes(' • ');
                  const displayTitle = isNewFormat ? item.title : item.details;
                  const displayDetails = isNewFormat ? item.details : `${item.title} • ${item.details}`;
                  return (
                    <div key={item.id} className="relative">
                      <div className="absolute -left-[23px] top-1 h-3 w-3 rounded-full bg-slate-50 dark:bg-[#0B1020] border-2 border-teal-500 flex items-center justify-center z-10" />
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-slate-900 dark:text-white block font-bold truncate max-w-[120px]">{displayTitle}</span>
                          <span className="text-[9px] text-slate-550 dark:text-slate-400 mt-0.5 block">{displayDetails}</span>
                        </div>
                        <span className="text-[8px] text-slate-400 dark:text-slate-500 font-mono flex-shrink-0">{item.timestamp}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

