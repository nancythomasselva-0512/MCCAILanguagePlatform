import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, Pause, Square, Download, RefreshCw,
  Volume2, ChevronDown, AlertCircle, CheckCircle2, X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

type PlayState = 'idle' | 'playing' | 'paused' | 'done' | 'loading' | 'error';

const SAMPLE_TEXT = "Welcome to MCC AI Language Platform. This tool converts your text into natural-sounding speech using advanced AI voice synthesis technology.";

export const TextToVoice: React.FC = () => {
  const { addHistoryItem } = useApp();
  const [text, setText] = useState('');
  const [localVoices, setLocalVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedLocalVoice, setSelectedLocalVoice] = useState('');
  const [speed, setSpeed] = useState(1.0);
  const [pitch, setPitch] = useState(1.0);
  const [playState, setPlayState] = useState<PlayState>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [progress, setProgress] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

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

    if (!('speechSynthesis' in window)) {
      setErrorMsg('Your browser does not support Speech Synthesis.');
      return;
    }

    window.speechSynthesis.cancel();
    setPlayState('loading');

    try {
      const utterance = new SpeechSynthesisUtterance(inputText);
      utteranceRef.current = utterance;
      const voiceObj = localVoices.find(v => v.name === selectedLocalVoice);
      if (voiceObj) utterance.voice = voiceObj;
      utterance.rate = speed;
      utterance.pitch = pitch;

      utterance.onstart = () => setPlayState('playing');

      utterance.onboundary = (event) => {
        if (inputText.length > 0) setProgress((event.charIndex / inputText.length) * 100);
      };

      utterance.onend = () => {
        setProgress(100);
        setPlayState('done');
        addHistoryItem('text-to-speech', `${selectedLocalVoice || 'Default Voice'}`, `${inputText.split(' ').filter(Boolean).length} words`);
      };

      utterance.onerror = () => {
        setPlayState('error');
        setErrorMsg('Speech synthesis failed. Please try again.');
      };

      window.speechSynthesis.speak(utterance);
    } catch (err: any) {
      setErrorMsg('Failed to play synthesized speech.');
      setPlayState('error');
    }
  };

  const pauseResume = () => {
    if (playState === 'playing') {
      window.speechSynthesis.pause();
      setPlayState('paused');
    } else if (playState === 'paused') {
      window.speechSynthesis.resume();
      setPlayState('playing');
    }
  };

  const stopTTS = () => {
    window.speechSynthesis.cancel();
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
    window.speechSynthesis.cancel();
    setPlayState('idle');
    setProgress(0);
    setText('');
    setCharCount(0);
    setErrorMsg('');
  };

  const isActive = playState === 'playing' || playState === 'paused';

  return (
    <div className="space-y-5 max-w-4xl mx-auto">
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
      <div className="alert alert-info">
        <Volume2 size={14} className="flex-shrink-0" style={{ color: 'var(--accent)' }} />
        <span>
          <strong style={{ color: 'var(--text-primary)' }}>Free Text to Voice:</strong>{' '}
          <span style={{ color: 'var(--text-secondary)' }}>
            Synthesizes speech locally in the browser using the Web Speech API. Use Download for an audio file via Google TTS.
          </span>
        </span>
      </div>

      {/* Text Input */}
      <div className="app-card rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <label className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Your Text</label>
          {playState !== 'idle' && (
            <button onClick={reset} className="btn-ghost flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs">
              <RefreshCw size={11} /> Reset
            </button>
          )}
        </div>
        <textarea
          id="ttv-text-input"
          value={text}
          onChange={handleTextChange}
          placeholder={`Type or paste your text here… (or leave blank to use sample)\n\nMax 5,000 characters.`}
          rows={6}
          className="app-input w-full resize-none rounded-xl px-4 py-3 text-sm"
          style={{
            background: 'var(--bg-subtle)',
            border: '1px solid var(--border-base)',
            color: 'var(--text-primary)',
          }}
        />
        <div className="mt-1.5 text-right text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{charCount} / 5,000</div>
      </div>

      {/* Settings Grid — 1 col on mobile, 2 on sm (voice spans full), 3 on lg */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {/* Voice */}
        <div className="app-card rounded-2xl p-4 sm:col-span-2 lg:col-span-1">
          <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Voice</label>
          <div className="relative">
            <select
              id="ttv-voice-select"
              value={selectedLocalVoice}
              onChange={(e) => setSelectedLocalVoice(e.target.value)}
              className="w-full appearance-none rounded-xl px-3.5 pr-9 py-2.5 text-xs font-semibold focus:outline-none"
              style={{
                background: 'var(--bg-subtle)',
                border: '1px solid var(--border-base)',
                color: 'var(--text-primary)',
              }}
            >
              {localVoices.map(v => <option key={v.name} value={v.name}>{v.name} ({v.lang})</option>)}
            </select>
            <ChevronDown size={13} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          </div>
        </div>

        {/* Speed */}
        <div className="app-card rounded-2xl p-4">
          <label className="mb-3 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider">
            <span style={{ color: 'var(--text-muted)' }}>Speed</span>
            <span className="font-bold" style={{ color: 'var(--accent)' }}>{speed.toFixed(1)}x</span>
          </label>
          <input id="ttv-speed-slider" type="range" min="0.5" max="2" step="0.1"
            value={speed} onChange={(e) => setSpeed(parseFloat(e.target.value))}
            className="w-full accent-blue-600" />
          <div className="mt-1.5 flex justify-between text-[10px]" style={{ color: 'var(--text-muted)' }}>
            <span>Slow</span><span>Normal</span><span>Fast</span>
          </div>
        </div>

        {/* Pitch */}
        <div className="app-card rounded-2xl p-4">
          <label className="mb-3 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider">
            <span style={{ color: 'var(--text-muted)' }}>Pitch</span>
            <span className="font-bold" style={{ color: 'var(--accent)' }}>{pitch.toFixed(1)}x</span>
          </label>
          <input id="ttv-pitch-slider" type="range" min="0.5" max="2" step="0.1"
            value={pitch} onChange={(e) => setPitch(parseFloat(e.target.value))}
            className="w-full accent-blue-600" />
          <div className="mt-1.5 flex justify-between text-[10px]" style={{ color: 'var(--text-muted)' }}>
            <span>Low</span><span>Normal</span><span>High</span>
          </div>
        </div>
      </div>

      {/* Player */}
      <div className="app-card rounded-2xl p-6">
        {/* Waveform */}
        <div className={`mb-5 flex items-center justify-center gap-0.5 h-10 ${playState !== 'playing' ? 'opacity-15' : ''}`}>
          {Array.from({ length: 28 }).map((_, i) => (
            <span
              key={i}
              className={`inline-block w-1 rounded-full bg-blue-500 ${playState === 'playing' ? 'wave-bar' : ''}`}
              style={{ height: `${Math.random() * 28 + 6}px` }}
            />
          ))}
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="h-1.5 w-full overflow-hidden rounded-full" style={{ background: 'var(--border-base)' }}>
            <div className="h-full rounded-full bg-blue-500 transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {(playState === 'idle' || playState === 'done' || playState === 'error') && (
            <button id="ttv-play-btn" onClick={startTTS}
              className="btn-primary flex items-center gap-2 rounded-xl px-6 py-3 text-sm">
              <Play size={16} className="fill-current" />
              {playState === 'done' ? 'Play Again' : 'Synthesize & Play'}
            </button>
          )}

          {playState === 'loading' && (
            <div className="flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold"
              style={{ background: 'var(--bg-subtle)', color: 'var(--text-secondary)' }}>
              <RefreshCw size={15} className="animate-spin" /> Generating…
            </div>
          )}

          {isActive && (
            <>
              <button id="ttv-pause-btn" onClick={pauseResume}
                className="btn-primary flex items-center gap-2 rounded-xl px-5 py-3 text-sm">
                {playState === 'paused'
                  ? <><Play size={15} className="fill-current" /> Resume</>
                  : <><Pause size={15} /> Pause</>}
              </button>
              <button id="ttv-stop-btn" onClick={stopTTS}
                className="btn-ghost flex items-center gap-2 rounded-xl px-5 py-3 text-sm">
                <Square size={15} /> Stop
              </button>
            </>
          )}

          <button id="ttv-download-btn" onClick={downloadAudio}
            className="btn-ghost flex items-center gap-2 rounded-xl px-5 py-3 text-sm">
            <Download size={15} /> Download
          </button>
        </div>

        {playState === 'done' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="mt-4 flex items-center justify-center gap-1.5 text-sm font-semibold text-emerald-500">
            <CheckCircle2 size={14} /> Playback complete
          </motion.div>
        )}
      </div>
    </div>
  );
};
