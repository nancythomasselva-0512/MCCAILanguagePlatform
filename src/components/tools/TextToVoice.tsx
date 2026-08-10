'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, Pause, Download, RefreshCw, Cpu,
  Volume2, ChevronDown, AlertCircle, X, Gauge, Music, Pencil, PenLine,
  Award, Music4, Speaker, FileText, MoreVertical, Trash2, Activity,
  Sparkles, ArrowUpRight, CheckCircle2, Sliders, AudioWaveform
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { providerManager } from '../../providers/providerManager';

type PlayState = 'idle' | 'playing' | 'paused' | 'done' | 'loading' | 'error';

const SAMPLE_TEXT = "Welcome to Voicely AI. Turn your ideas into a powerful studio-quality voiceover in seconds using advanced neural voice synthesis.";

export const TextToVoice: React.FC = () => {
  const { history, clearHistory, billingOverview, addHistoryItem, theme, openAiApiKey, fetchBillingOverview } = useApp();
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
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<any>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressIntervalRef = useRef<any>(null);
  const hasAddedHistoryRef = useRef<boolean>(false);

  const recordHistoryOnce = (type: string, title: string, details: string) => {
    if (!hasAddedHistoryRef.current) {
      hasAddedHistoryRef.current = true;
      addHistoryItem(type, title, details);
    }
  };

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

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  }, [speed]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value.slice(0, 5000);
    setText(val);
    setCharCount(val.length);
    if (playState !== 'idle') stopTTS();
  };

  const startTTS = async () => {
    setErrorMsg('');
    hasAddedHistoryRef.current = false;
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

    try {
      const audioUrl = await providerManager.synthesizeSpeech(
        inputText,
        selectedLocalVoice,
        openAiApiKey,
        ''
      );
      fetchBillingOverview();

      if (audioUrl === "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3") {
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
            recordHistoryOnce('text-to-speech', inputText, `${selectedLocalVoice || 'Browser Voice'} (Web Speech) • ${inputText.split(' ').filter(Boolean).length} words`);
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
        audio.playbackRate = speed;
        setPlayState('playing');
        if (isNaN(audio.duration) || audio.duration < 0.2) {
          let currentProgress = 0;
          progressIntervalRef.current = setInterval(() => {
            currentProgress += 1.5;
            if (currentProgress >= 100) {
              clearInterval(progressIntervalRef.current);
              setPlayState('done');
              setProgress(100);
              recordHistoryOnce('text-to-speech', inputText, `${selectedLocalVoice || 'Voice Synthesis'} (${activeProvider}) • ${inputText.split(' ').filter(Boolean).length} words`);
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
        recordHistoryOnce('text-to-speech', inputText, `${selectedLocalVoice || 'Voice Synthesis'} (${activeProvider}) • ${inputText.split(' ').filter(Boolean).length} words`);
      };

      audio.onerror = () => {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(inputText);
          const voice = window.speechSynthesis.getVoices().find(v => v.name === selectedLocalVoice);
          if (voice) utterance.voice = voice;
          utterance.rate = speed;
          utterance.pitch = pitch;

          utterance.onstart = () => setPlayState('playing');
          utterance.onend = () => {
            setProgress(100);
            setPlayState('done');
            recordHistoryOnce('text-to-speech', inputText, `${selectedLocalVoice || 'Browser Voice'} (Web Speech) • ${inputText.split(' ').filter(Boolean).length} words`);
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
              recordHistoryOnce('text-to-speech', inputText, `${selectedLocalVoice || 'Voice Synthesis'} (ELEVENLABS) • ${inputText.split(' ').filter(Boolean).length} words`);
            } else {
              setProgress(currentProgress);
            }
          }, 100);
        } else {
          if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(inputText);
            const voice = window.speechSynthesis.getVoices().find(v => v.name === selectedLocalVoice);
            if (voice) utterance.voice = voice;
            utterance.rate = speed;
            utterance.pitch = pitch;

            utterance.onstart = () => setPlayState('playing');
            utterance.onend = () => {
              setProgress(100);
              setPlayState('done');
              recordHistoryOnce('text-to-speech', inputText, `${selectedLocalVoice || 'Browser Voice'} (Web Speech) • ${inputText.split(' ').filter(Boolean).length} words`);
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
    if (typeof window !== 'undefined' && window.speechSynthesis && (window.speechSynthesis.speaking || window.speechSynthesis.paused)) {
      if (playState === 'playing') {
        window.speechSynthesis.pause();
        setPlayState('paused');
      } else if (playState === 'paused') {
        window.speechSynthesis.resume();
        setPlayState('playing');
      }
      return;
    }

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
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    setPlayState('idle');
    setProgress(0);
  };

  const isActive = playState === 'playing' || playState === 'paused';
  const rawTtsHistory = (history || []).filter(item => item.type === 'text-to-speech');
  const ttsHistory = rawTtsHistory.filter((item, index, arr) => {
    if (index === 0) return true;
    const prev = arr[index - 1];
    return !(prev.title === item.title && prev.details === item.details);
  });

  return (
    <div className="w-full max-w-[1240px] mx-auto space-y-8 animate-fadeIn">
      {/* Studio Header Banner matching reference design */}
      <div className="text-center sm:text-left space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 text-xs font-bold border border-orange-500/20 shadow-sm">
          <Sparkles size={14} className="text-orange-500" />
          <span>AI Voice Generation</span>
          <span className="text-[10px] bg-orange-500/20 dark:bg-orange-500/30 px-2 py-0.5 rounded-full uppercase tracking-wider ml-1">
            GPT-S2 Engine
          </span>
        </div>
        
        <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight flex flex-wrap items-center gap-x-2">
          <span>Create Studio</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 italic font-serif px-1">
            Quality AI Voices
          </span>
          <span>in Seconds</span>
          <span className="inline-flex items-center gap-0.5 ml-1 text-orange-500">
            <span className="w-1 h-3.5 bg-orange-500 rounded-full animate-pulse"></span>
            <span className="w-1 h-5 bg-amber-500 rounded-full animate-pulse delay-75"></span>
            <span className="w-1 h-2.5 bg-orange-400 rounded-full animate-pulse delay-150"></span>
            <span className="w-1 h-4 bg-amber-600 rounded-full animate-pulse delay-200"></span>
          </span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl font-medium">
          Generate realistic voiceovers for videos, ads, podcasts, and apps using advanced neural speech synthesis.
        </p>
      </div>

      {/* Error Alert */}
      <AnimatePresence>
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-3 p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/40 text-red-700 dark:text-red-300 text-sm font-semibold shadow-sm"
          >
            <AlertCircle size={18} className="flex-shrink-0" />
            <span className="flex-1">{errorMsg}</span>
            <button onClick={() => setErrorMsg('')} className="p-1 hover:opacity-100 opacity-60 transition-opacity">
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Glassmorphic Studio Workspace matching Target UI */}
        <div className="lg:col-span-2 space-y-6">
          <div className="relative overflow-hidden rounded-[2.2rem] bg-gradient-to-br from-white/90 via-orange-50/20 to-amber-50/30 dark:from-slate-900/90 dark:via-slate-900/80 dark:to-orange-950/20 border border-slate-200/80 dark:border-white/10 shadow-2xl p-6 sm:p-8 backdrop-blur-xl space-y-6">
            
            {/* Background Ambient Mesh Glow */}
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-orange-400/20 via-amber-300/15 to-transparent blur-3xl pointer-events-none rounded-full" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-gradient-to-tr from-sky-400/15 via-teal-300/10 to-transparent blur-3xl pointer-events-none rounded-full" />

            {/* Input Workspace Card Header */}
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-orange-500/15 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold">
                  <Pencil size={15} />
                </div>
                <span className="text-xs font-extrabold tracking-widest text-slate-700 dark:text-slate-300 uppercase">
                  Studio Input Workspace
                </span>
              </div>

              <div className="text-xs font-bold text-slate-500 dark:text-slate-400 bg-white/70 dark:bg-slate-800/70 border border-slate-200/60 dark:border-white/10 px-3 py-1 rounded-full shadow-sm">
                <span>Max 5,000 chars</span>
                <span className="mx-1.5 opacity-40">•</span>
                <span className="text-orange-600 dark:text-orange-400">{charCount} / 5,000</span>
              </div>
            </div>

            {/* Textarea Area */}
            <div className="relative z-10">
              <textarea
                value={text}
                onChange={handleTextChange}
                placeholder="Type or paste your text here... (or leave blank to use sample text)"
                className="w-full h-56 sm:h-64 resize-none rounded-2xl border border-slate-200/90 dark:border-white/10 p-5 text-slate-800 dark:text-slate-100 bg-white/80 dark:bg-slate-950/70 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all font-sans text-base leading-relaxed placeholder:text-slate-400 shadow-inner"
              />
            </div>

            {/* Progress Audio Waveform Bar */}
            {isActive && (
              <div className="relative z-10 space-y-1.5 animate-fadeIn">
                <div className="flex justify-between items-center text-xs font-bold text-orange-600 dark:text-orange-400">
                  <span className="flex items-center gap-1.5">
                    <AudioWaveform size={14} className="animate-pulse" />
                    <span>Synthesizing Speech...</span>
                  </span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-150"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Bottom Controls Bar embedded matching Image 2 floating pills */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-200/60 dark:border-white/10">
              
              {/* Voice Selector Pill */}
              <div className="flex items-center gap-2 bg-white/90 dark:bg-slate-800/90 border border-slate-200/80 dark:border-white/10 px-3.5 py-2 rounded-full shadow-sm hover:border-orange-300 transition-colors">
                <Volume2 size={15} className="text-orange-500" />
                <select
                  value={selectedLocalVoice}
                  onChange={(e) => setSelectedLocalVoice(e.target.value)}
                  className="bg-transparent text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none appearance-none pr-5 cursor-pointer max-w-[160px] truncate"
                >
                  {localVoices.map(v => <option key={v.name} value={v.name} className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white">{v.name}</option>)}
                </select>
                <ChevronDown size={14} className="text-slate-400 -ml-4 pointer-events-none" />
              </div>

              {/* Speed Pill */}
              <div className="flex items-center gap-2 bg-white/90 dark:bg-slate-800/90 border border-slate-200/80 dark:border-white/10 px-3.5 py-2 rounded-full shadow-sm">
                <Gauge size={15} className="text-amber-500" />
                <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300">Speed:</span>
                <input
                  type="range" min="0.5" max="2" step="0.1" value={speed}
                  onChange={(e) => setSpeed(parseFloat(e.target.value))}
                  className="w-16 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
                <span className="text-xs font-black text-orange-600 dark:text-orange-400 w-8">{speed.toFixed(1)}x</span>
              </div>

              {/* Pitch Pill */}
              <div className="flex items-center gap-2 bg-white/90 dark:bg-slate-800/90 border border-slate-200/80 dark:border-white/10 px-3.5 py-2 rounded-full shadow-sm">
                <Music size={15} className="text-purple-500" />
                <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300">Pitch:</span>
                <input
                  type="range" min="0.5" max="2" step="0.1" value={pitch}
                  onChange={(e) => setPitch(parseFloat(e.target.value))}
                  className="w-16 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
                <span className="text-xs font-black text-purple-600 dark:text-purple-400 w-8">{pitch.toFixed(1)}x</span>
              </div>

              {/* Generate Voice Button matching target Image 2 button style */}
              <button
                onClick={isActive ? pauseResume : startTTS}
                className="bg-slate-900 hover:bg-black dark:bg-gradient-to-r dark:from-orange-500 dark:to-amber-500 text-white font-extrabold px-7 py-3 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer text-sm ml-auto"
              >
                {playState === 'loading' ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : playState === 'playing' ? (
                  <>
                    <Pause size={16} />
                    <span>Pause Voice</span>
                  </>
                ) : (
                  <>
                    <span>{playState === 'paused' ? 'Resume Voice' : 'Generate Voice'}</span>
                    <ArrowUpRight size={16} />
                  </>
                )}
              </button>

            </div>
          </div>
        </div>

        {/* Right Column: Recent History Studio Cards matching Image 1 layout */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              Recent History
            </h3>
            <span className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline cursor-pointer">
              View all
            </span>
          </div>

          <div className="space-y-3">
            {ttsHistory.length === 0 ? (
              <div className="bg-white/80 dark:bg-slate-900/80 rounded-2xl p-6 text-center text-slate-500 dark:text-slate-400 text-sm font-medium border border-slate-200/80 dark:border-white/10 shadow-sm">
                No generated speech history yet.
              </div>
            ) : (
              ttsHistory.slice(0, 5).map((item) => {
                const isNewFormat = item.details.includes(' • ');
                const displayTitle = isNewFormat ? item.title : item.details;
                const displayDetails = isNewFormat ? item.details : `${item.title} • ${item.details}`;
                return (
                  <div
                    key={item.id}
                    className="bg-white/90 dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-900 rounded-2xl p-4 flex items-center gap-3.5 shadow-sm border border-slate-200/80 dark:border-white/10 transition-all hover:border-orange-300 dark:hover:border-orange-500/40 group"
                  >
                    <button
                      onClick={() => setSelectedHistoryItem(item)}
                      className="w-10 h-10 flex-shrink-0 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 text-white flex items-center justify-center shadow-md hover:scale-105 transition-transform"
                    >
                      <Play size={16} className="fill-current ml-0.5" />
                    </button>
                    <div
                      className="flex-1 min-w-0 cursor-pointer"
                      onClick={() => setSelectedHistoryItem(item)}
                    >
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate group-hover:text-orange-600 transition-colors">
                        {displayTitle}
                      </p>
                      <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        {displayDetails.split(' • ')[0]}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedHistoryItem(item)}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                    >
                      <MoreVertical size={16} />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {ttsHistory.length > 0 && (
            <button
              onClick={() => clearHistory()}
              className="w-full bg-white/80 dark:bg-slate-900/80 border border-red-200/80 dark:border-red-500/30 text-red-600 dark:text-red-400 font-bold py-3 rounded-2xl shadow-sm flex items-center justify-center gap-2 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors text-xs cursor-pointer"
            >
              <Trash2 size={15} /> Clear History
            </button>
          )}
        </div>
      </div>

      {/* History Detail Modal */}
      <AnimatePresence>
        {selectedHistoryItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4"
            onClick={() => setSelectedHistoryItem(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden flex flex-col"
            >
              <div className="p-5 border-b border-slate-100 dark:border-white/5 flex justify-between items-center bg-slate-50/80 dark:bg-slate-900">
                <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 font-bold text-sm">
                  <FileText size={18} />
                  <span className="uppercase tracking-wider">Converted Text</span>
                </div>
                <button
                  onClick={() => setSelectedHistoryItem(null)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="p-6 max-h-[60vh] overflow-y-auto">
                <p className="text-slate-800 dark:text-slate-200 text-sm leading-relaxed whitespace-pre-wrap font-sans">
                  {selectedHistoryItem.details.includes(' • ') ? selectedHistoryItem.title : selectedHistoryItem.details}
                </p>
              </div>
              <div className="p-4 border-t border-slate-100 dark:border-white/5 bg-slate-50/80 dark:bg-slate-900 text-xs font-medium text-slate-500">
                Created: {selectedHistoryItem.timestamp}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
