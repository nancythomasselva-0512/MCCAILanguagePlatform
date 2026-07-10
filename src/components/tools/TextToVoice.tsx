import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, Pause, Download, RefreshCw, Cpu,
  Volume2, ChevronDown, AlertCircle, X, Gauge, Music, Pencil,
  Award, Music4, Speaker, FileText, MoreVertical, Trash2, Activity
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { providerManager } from '../../providers/providerManager';

type PlayState = 'idle' | 'playing' | 'paused' | 'done' | 'loading' | 'error';

const SAMPLE_TEXT = "Welcome to our AI platform. This tool converts your text into natural-sounding speech using advanced AI voice synthesis technology.";

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
    // If Web Speech API is actively speaking/paused, handle it
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
    <div className="space-y-6 w-full animate-fadeIn max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="mb-6 text-left">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
          <Volume2 className="text-teal-500" size={24} />
          Text to Voice
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 font-medium">
          Convert your text into realistic speech using AI voices
        </p>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-4">
          {/* YOUR TEXT card */}
          <div className="bg-white dark:bg-[#111827] rounded-[16px] p-6 shadow-sm border border-slate-100 dark:border-white/5">
            <div className="flex items-center gap-2 mb-4">
              <Pencil size={16} className="text-teal-700 dark:text-teal-400" />
              <h3 className="text-sm font-bold text-teal-800 dark:text-teal-400 uppercase tracking-wide">Your Text</h3>
            </div>
            <textarea
              value={text}
              onChange={handleTextChange}
              placeholder="Type or paste your text here... (or leave blank to use sample)"
              className="w-full h-56 resize-none rounded-xl border border-slate-200 dark:border-white/10 p-4 text-slate-700 dark:text-slate-200 bg-white dark:bg-[#0a1120] focus:outline-none focus:border-teal-400"
            />
            <div className="flex justify-between items-center mt-3 text-xs font-bold text-teal-700 dark:text-teal-500">
              <span>Max 5,000 characters.</span>
              <span>{charCount} / 5,000</span>
            </div>
          </div>

          {/* Settings Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Voice Card */}
            <div className="bg-white dark:bg-[#111827] rounded-[16px] p-5 shadow-sm border border-slate-100 dark:border-white/5">
              <div className="flex items-center gap-2 mb-4">
                <div className="text-teal-700 dark:text-teal-400">
                  <Volume2 size={16} />
                </div>
                <h3 className="text-xs font-bold text-teal-800 dark:text-teal-400 uppercase tracking-wide">Voice</h3>
              </div>
              <div className="relative">
                <select
                  value={selectedLocalVoice}
                  onChange={(e) => setSelectedLocalVoice(e.target.value)}
                  className="w-full appearance-none bg-white dark:bg-[#0a1120] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 text-[11px] font-semibold rounded-lg px-3 py-2.5 pr-8 focus:outline-none"
                >
                  {localVoices.map(v => <option key={v.name} value={v.name}>{v.name} ({v.lang})</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Speed Card */}
            <div className="bg-white dark:bg-[#111827] rounded-[16px] p-5 shadow-sm border border-slate-100 dark:border-white/5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="text-teal-700 dark:text-teal-400">
                    <Gauge size={16} />
                  </div>
                  <h3 className="text-xs font-bold text-teal-800 dark:text-teal-400 uppercase tracking-wide">Speed</h3>
                </div>
                <span className="text-teal-700 dark:text-teal-400 font-bold text-xs">{speed.toFixed(1)}X</span>
              </div>
              <input 
                type="range" min="0.5" max="2" step="0.1" value={speed} 
                onChange={(e) => setSpeed(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${((speed - 0.5) / 1.5) * 100}%, var(--border-base) ${((speed - 0.5) / 1.5) * 100}%, var(--border-base) 100%)`,
                }}
              />
              <div className="flex justify-between text-[10px] font-bold text-teal-800 dark:text-teal-500 mt-3">
                <span>Slow</span><span>Normal</span><span>Fast</span>
              </div>
            </div>

            {/* Pitch Card */}
            <div className="bg-white dark:bg-[#111827] rounded-[16px] p-5 shadow-sm border border-slate-100 dark:border-white/5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="text-fuchsia-600 dark:text-fuchsia-400">
                    <Music size={16} />
                  </div>
                  <h3 className="text-xs font-bold text-teal-800 dark:text-teal-400 uppercase tracking-wide">Pitch</h3>
                </div>
                <span className="text-teal-700 dark:text-teal-400 font-bold text-xs">{pitch.toFixed(1)}X</span>
              </div>
              <input 
                type="range" min="0.5" max="2" step="0.1" value={pitch} 
                onChange={(e) => setPitch(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${((pitch - 0.5) / 1.5) * 100}%, var(--border-base) ${((pitch - 0.5) / 1.5) * 100}%, var(--border-base) 100%)`,
                }}
              />
              <div className="flex justify-between text-[10px] font-bold text-teal-800 dark:text-teal-500 mt-3">
                <span>Low</span><span>Normal</span><span>High</span>
              </div>
            </div>
          </div>

          {/* Convert Button */}
          <button 
            onClick={isActive ? pauseResume : startTTS}
            className="w-full bg-[#10a37f] hover:bg-[#0e906f] text-white font-bold py-4 rounded-[12px] shadow-sm flex items-center justify-center gap-2 transition-all mt-2"
          >
            {playState === 'loading' ? (
              <RefreshCw size={20} className="animate-spin" />
            ) : playState === 'playing' ? (
              <>
                <Pause size={18} /> PAUSE SPEECH
              </>
            ) : (
              <>
                <Activity size={18} /> {playState === 'paused' ? 'RESUME SPEECH' : 'CONVERT TO SPEECH'}
              </>
            )}
          </button>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex items-center justify-between px-1 mb-2">
            <h3 className="text-sm font-black text-slate-800 dark:text-slate-200 uppercase tracking-wide">Recent History</h3>
            <button className="text-[11px] font-bold text-teal-700 dark:text-teal-400 hover:text-teal-800 transition-colors">View all</button>
          </div>

          <div className="space-y-3">
            {ttsHistory.length === 0 ? (
              <div className="bg-white dark:bg-[#111827] rounded-[16px] p-6 text-center text-slate-500 text-sm font-medium border border-slate-100 dark:border-white/5">
                No recent history.
              </div>
            ) : (
              ttsHistory.slice(0, 5).map((item, idx) => {
                const isNewFormat = item.details.includes(' • ');
                const displayTitle = isNewFormat ? item.title : item.details;
                const displayDetails = isNewFormat ? item.details : `${item.title} • ${item.details}`;
                return (
                  <div key={item.id} className="bg-white dark:bg-[#111827] rounded-[16px] p-4 flex items-center gap-4 shadow-sm border border-slate-100 dark:border-white/5">
                    <button className="h-10 w-10 flex-shrink-0 rounded-full bg-[#e6f4f1] dark:bg-teal-900/30 flex items-center justify-center text-[#10a37f] dark:text-teal-400 hover:bg-teal-100 transition-colors">
                      <Play size={16} className="fill-current ml-0.5" />
                    </button>
                    <div 
                      className="flex-1 min-w-0 cursor-pointer group"
                      onClick={() => setSelectedHistoryItem(item)}
                    >
                      <p className="text-[13px] font-bold text-slate-800 dark:text-slate-200 truncate leading-snug group-hover:text-teal-600 transition-colors">{displayTitle}</p>
                      <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 truncate mt-1">
                        {displayDetails.split(' • ')[0]} • {item.timestamp}
                      </p>
                    </div>
                    <button className="text-slate-400 hover:text-slate-600 px-1">
                      <MoreVertical size={16} />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          <button 
            onClick={() => clearHistory()}
            className="w-full bg-white dark:bg-[#111827] border border-red-100 dark:border-red-500/20 text-red-500 font-bold py-3.5 rounded-[16px] shadow-sm flex items-center justify-center gap-2 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors mt-2 text-xs"
          >
            <Trash2 size={16} /> Clear History
          </button>
        </div>
      </div>

      {/* History Detail Modal */}
      <AnimatePresence>
        {selectedHistoryItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
            onClick={() => setSelectedHistoryItem(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden flex flex-col"
            >
              <div className="p-4 border-b border-slate-100 dark:border-white/5 flex justify-between items-center bg-slate-50 dark:bg-slate-900">
                <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400">
                  <FileText size={18} />
                  <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 uppercase tracking-wide">
                    Converted Text
                  </h3>
                </div>
                <button 
                  onClick={() => setSelectedHistoryItem(null)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="p-6 max-h-[60vh] overflow-y-auto">
                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-sans">
                  {selectedHistoryItem.details.includes(' • ') ? selectedHistoryItem.title : selectedHistoryItem.details}
                </p>
              </div>
              <div className="p-4 border-t border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-slate-900 text-xs font-medium text-slate-500">
                Created: {selectedHistoryItem.timestamp}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

