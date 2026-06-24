import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic, MicOff, Copy, Download, Edit3, Check, Play, Trash2,
  AlertCircle, CheckCircle2, RefreshCw, X, Calendar, Globe, Clock, ChevronDown, Cpu,
  Award, Activity
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { providerManager } from '../../providers/providerManager';

type RecordingState = 'idle' | 'recording' | 'processing' | 'done' | 'error';

interface TranscriptionSegment {
  id: string;
  timestamp: string;
  day?: string;
  language?: string;
  text: string;
  isEditing?: boolean;
}

const LANGUAGES = [
  { label: 'English (US)', code: 'en-US' },
  { label: 'Tamil (தமிழ்)', code: 'ta-IN' },
  { label: 'Hindi (हिन्दी)', code: 'hi-IN' },
  { label: 'Spanish (Español)', code: 'es-ES' },
  { label: 'French (Français)', code: 'fr-FR' },
  { label: 'German (Deutsch)', code: 'de-DE' },
];

const getLanguageName = (code: string): string => {
  try {
    const displayNames = new Intl.DisplayNames(['en'], { type: 'language' });
    const name = displayNames.of(code) || code;
    return name.split(' (')[0];
  } catch (e) {
    const map: Record<string, string> = {
      'en-US': 'English',
      'ta-IN': 'Tamil',
      'hi-IN': 'Hindi',
      'es-ES': 'Spanish',
      'fr-FR': 'French',
      'de-DE': 'German',
    };
    return map[code] || code;
  }
};

export const VoiceToText: React.FC = () => {
  const {
    history,
    billingOverview,
    addHistoryItem,
    setDetectedLang,
    openAiApiKey,
    setNotification,
    fetchBillingOverview
  } = useApp();
  
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [activeProvider, setActiveProvider] = useState<string>('Managed by Platform');
  const [segments, setSegments] = useState<TranscriptionSegment[]>([]);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');
  const [isInsecureOrigin, setIsInsecureOrigin] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const isManuallyStoppedRef = useRef(false);
  const liveTranscriptRef = useRef('');

  
  useEffect(() => {
    providerManager.getActiveProviders().then(res => {
      if (res["Audio To Text"]) {
        setActiveProvider(res["Audio To Text"].toUpperCase());
      }
    });
  }, []);
useEffect(() => {
    // Check if loaded on a secure origin (SpeechRecognition is disabled on HTTP except localhost)
    const isSecure = window.location.protocol === 'https:' || 
                     window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1';
    setIsInsecureOrigin(!isSecure);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        try { mediaRecorderRef.current.stop(); } catch (e) {}
      }
      if ((window as any)._activeRecognition) {
        try { (window as any)._activeRecognition.stop(); } catch (e) {}
      }
    };
  }, []);

  const formatTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const triggerDemoMode = () => {
    setErrorMsg('');
    setRecordingState('recording');
    setLiveTranscript('');
    liveTranscriptRef.current = '';
    setRecordSeconds(0);
    
    const samplePhrases = {
      'en-US': 'Hello! Welcome to the MCC AI language workstation. This is an English voice transcription test.',
      'ta-IN': 'வணக்கம்! எமசிசி ஏஐ மொழி பணிநிலையத்திற்கு உங்களை வரவேற்கிறோம். இது தமிழ் குரல்வழி உரை மாற்ற சோதனை ஆகும்.',
      'hi-IN': 'नमस्ते! एमसीसी एआई भाषा वर्कस्टेशन में आपका स्वागत है। यह हिंदी वॉयस ट्रांसक्रिप्शन परीक्षण है।',
      'es-ES': '¡Hola! Bienvenido a la estación de trabajo de lenguaje MCC AI. Esta es una prueba de transcripción de voz en español.',
      'fr-FR': 'Bonjour! Bienvenue dans le poste de travail linguistique de MCC AI. Ceci est un test de transcription vocale en français.',
      'de-DE': 'Hallo! Willkommen an der MCC AI Sprach-Workstation. Dies ist ein Test für die deutsche Sprachtranskription.',
    };

    const textToSimulate = samplePhrases[selectedLanguage as keyof typeof samplePhrases] || samplePhrases['en-US'];
    const words = textToSimulate.split(' ');
    
    if (timerRef.current) clearInterval(timerRef.current);
    isManuallyStoppedRef.current = true; // prevent native onend from triggering
    
    let secondsElapsed = 0;
    const timer = setInterval(() => {
      secondsElapsed++;
      setRecordSeconds(secondsElapsed);
    }, 1000);
    timerRef.current = timer;

    let currentWordIdx = 0;
    let textAccumulator = '';
    const simulateInterval = setInterval(() => {
      if (currentWordIdx < words.length) {
        textAccumulator += words[currentWordIdx] + ' ';
        setLiveTranscript(textAccumulator.trim());
        liveTranscriptRef.current = textAccumulator.trim();
        currentWordIdx++;
      } else {
        clearInterval(simulateInterval);
        clearInterval(timer);
        setRecordingState('done');
        setDetectedLang(selectedLanguage);
        const finalTranscript = liveTranscriptRef.current.trim();
        if (finalTranscript) {
          const langName = getLanguageName(selectedLanguage);
          setSegments(s => [...s, {
            id: Date.now().toString(),
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            day: new Date().toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' }),
            language: langName,
            text: finalTranscript
          }]);
          addHistoryItem('voice-to-text', finalTranscript, `Voice Recording (Demo) • ${finalTranscript.split(' ').filter(Boolean).length} words`);
        }
        setLiveTranscript('');
        liveTranscriptRef.current = '';
      }
    }, 150);
  };


  const startRecording = async () => {
    isManuallyStoppedRef.current = false;
    setErrorMsg('');
    setLiveTranscript('');
    liveTranscriptRef.current = '';
    setDetectedLang('');
    setRecordSeconds(0);
    audioChunksRef.current = [];

    // 1. Try to start MediaRecorder for raw audio capture
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        // Stop stream tracks
        stream.getTracks().forEach(track => track.stop());

        // Construct final audio file
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioFile = new File([audioBlob], 'voice-recording.wav', { type: 'audio/wav' });

        setRecordingState('processing');
        try {
          const result = await providerManager.transcribeVoice(
            audioFile,
            openAiApiKey,
            '', // deepgram key
            selectedLanguage,
            (newProvider) => {
              // Trigger failover notification!
              // setTranscriptionProvider(newProvider);
              setNotification({
                message: `Switched to ${newProvider === 'deepgram' ? 'Deepgram' : newProvider.toUpperCase()} for processing.`,
                type: 'info'
              });
            }
          );
          fetchBillingOverview();

          const finalTranscript = result.text.trim();
          if (finalTranscript) {
            setRecordingState('done');
            setDetectedLang(selectedLanguage);
            const langName = getLanguageName(selectedLanguage);
            setSegments(s => [...s, {
              id: Date.now().toString(),
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
              day: new Date().toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' }),
              language: langName,
              text: finalTranscript
            }]);
            addHistoryItem(
              'voice-to-text',
              finalTranscript,
              `Live Recording (${result.finalProvider.toUpperCase()}) • ${finalTranscript.split(' ').filter(Boolean).length} words`
            );
          } else {
            setRecordingState('error');
            setErrorMsg('No speech detected. Please check if your microphone is active and try again.');
          }
        } catch (err: any) {
          setErrorMsg(err.message || 'Voice transcription failed.');
          setRecordingState('error');
        }

        setLiveTranscript('');
        liveTranscriptRef.current = '';
        if (timerRef.current) clearInterval(timerRef.current);
      };

      mediaRecorder.start();
      setRecordingState('recording');
      timerRef.current = setInterval(() => setRecordSeconds(s => s + 1), 1000);

    } catch (err: any) {
      console.error('Mic access error:', err);
      setErrorMsg('Microphone access blocked or failed. Please check permissions.');
      setRecordingState('error');
      return;
    }

    // 2. Also try starting browser-native SpeechRecognition for live interim visual feedback
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        // Save recognition instance so we can stop it
        (window as any)._activeRecognition = recognition;
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = selectedLanguage;

        recognition.onresult = (event: any) => {
          let transcript = '';
          for (let i = 0; i < event.results.length; ++i) {
            transcript += event.results[i][0].transcript + ' ';
          }
          const trimmed = transcript.trim();
          setLiveTranscript(trimmed);
          liveTranscriptRef.current = trimmed;
        };

        recognition.start();
      } catch (e) {
        console.warn('Native speech recognition failed to start for live feedback:', e);
      }
    }
  };

  const stopRecording = (isError = false) => {
    isManuallyStoppedRef.current = true;
    if (timerRef.current) clearInterval(timerRef.current);

    // Stop MediaRecorder
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }

    // Stop Native SpeechRecognition
    if ((window as any)._activeRecognition) {
      try {
        (window as any)._activeRecognition.stop();
        (window as any)._activeRecognition = null;
      } catch (e) {}
    }

    if (isError) {
      setRecordingState('error');
      setLiveTranscript('');
      liveTranscriptRef.current = '';
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1200);
  };

  const handleExportAll = () => {
    if (!segments.length) return;
    const blob = new Blob([segments.map(s => s.text).join('\n\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transcription.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setRecordingState('idle');
    setSegments([]);
    setLiveTranscript('');
    setDetectedLang('');
    setRecordSeconds(0);
    setErrorMsg('');
  };

  const vttHistory = (history || []).filter(item => item.type === 'voice-to-text');
  const audioLimit = billingOverview?.usage?.audio_minutes_limit || 30;
  const remainingMinutes = Math.max(0, audioLimit - (billingOverview?.usage?.audio_minutes_used || 0));

  return (
    <div className="space-y-6 w-full animate-fadeIn">
      {/* Header with Provider Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/5">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <Mic className="text-teal-500" size={20} />
            Voice Transcription
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Record voice from your microphone and transcribe using AI models
          </p>
        </div>
        
        {/* Managed Provider Badge */}
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-200" style={{ background: 'var(--bg-card)' }}>
          <Cpu size={14} className="text-teal-500" />
          <span>Managed by Platform Administrator</span>
        </div>
      </div>

      {/* Insecure Origin Alert */}
      {isInsecureOrigin && (
        <div className="alert alert-warning text-xs flex items-start gap-2.5 rounded-2xl p-4 border" style={{
          background: 'color-mix(in srgb, #f59e0b 8%, var(--bg-card))',
          borderColor: 'color-mix(in srgb, #f59e0b 20%, transparent)',
          color: '#d97706'
        }}>
          <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
          <div className="flex-1 text-left">
            <span className="font-bold">Security Constraint:</span> Voice recognition requires an HTTPS connection or localhost. Because this site is loaded over insecure HTTP, the browser's microphone API is blocked.
            <button 
              onClick={triggerDemoMode}
              className="ml-2 underline font-extrabold cursor-pointer hover:opacity-80 text-[#d97706]"
            >
              Click here to Try Demo Mode (Simulate transcription)
            </button>
          </div>
        </div>
      )}

      {/* Error Banner */}
      <AnimatePresence>
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="alert alert-error"
          >
            <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
            <div className="flex-1 text-left flex flex-wrap items-center gap-x-2">
              <span>{errorMsg}</span>
              <button 
                onClick={triggerDemoMode}
                className="underline font-extrabold cursor-pointer text-red-100 hover:text-white"
              >
                Or Try Demo Mode
              </button>
            </div>
            <button onClick={() => setErrorMsg('')} className="flex-shrink-0 opacity-60 hover:opacity-100">
              <X size={14} />
            </button>
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
              background: 'linear-gradient(135deg, rgba(13, 148, 136, 0.1) 0%, rgba(15, 118, 110, 0.05) 100%)',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 via-emerald-500/5 to-transparent pointer-events-none" />
            
            <div className="flex items-center gap-5 relative z-10 max-w-[70%] text-left">
              <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-teal-600 to-emerald-500 shadow-md shadow-teal-500/20 text-white">
                <Mic size={24} />
              </div>
              <div>
                <h3 className="font-display text-lg md:text-xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-snug">
                  Voice Transcription
                </h3>
                <p className="mt-1.5 text-xs md:text-sm text-slate-600 dark:text-slate-350 leading-relaxed font-medium">
                  Record your voice via the microphone and transcribe it in real-time. Choose your speech input language for accurate translation.
                </p>
              </div>
            </div>
            
            {/* Banner Illustration on the Right */}
            <div className="absolute right-0 top-0 bottom-0 w-1/3 max-w-[220px] flex items-center justify-end select-none pointer-events-none pr-4 overflow-hidden">
              <img 
                src="/banner_illustration.png" 
                alt="Voice recording illustration" 
                className="h-[120%] object-contain mt-2 opacity-95 filter drop-shadow-md hue-rotate-[250deg] dark:brightness-95 dark:contrast-105"
              />
            </div>
          </div>

          {/* Speech Input Language Selector */}
          <div className="app-card rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2">
              <Globe size={16} className="text-[var(--accent)] animate-pulse" />
              <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Speech Input Language</span>
            </div>
            <div className="relative w-full sm:w-64">
              <select
                id="vtt-language-select"
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                disabled={recordingState === 'recording'}
                className="w-full appearance-none rounded-xl px-3.5 pr-9 py-2.5 text-xs font-semibold focus:outline-none disabled:opacity-50"
                style={{
                  background: 'var(--bg-subtle)',
                  border: '1px solid var(--border-base)',
                  color: 'var(--text-primary)',
                }}
              >
                {LANGUAGES.map(lang => (
                  <option key={lang.code} value={lang.code}>{lang.label}</option>
                ))}
              </select>
              <ChevronDown size={13} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
            </div>
          </div>

          {/* Microphone Card */}
          <div className="app-card rounded-3xl p-8 sm:p-16 flex flex-col items-center justify-center relative text-center" style={{ minHeight: '260px' }}>
            <div className="relative inline-flex items-center justify-center">
              {recordingState === 'recording' && (
                <span className="absolute inline-flex h-24 w-24 rounded-full bg-red-500/15 animate-ping" />
              )}
              <button
                id="vtt-record-btn"
                onClick={recordingState === 'recording' ? () => stopRecording(false) : startRecording}
                disabled={recordingState === 'processing'}
                className={`relative z-10 flex h-20 w-20 items-center justify-center rounded-full transition-all duration-300 ${
                  recordingState === 'recording'
                    ? 'bg-red-500 hover:bg-red-600 scale-105 shadow-lg shadow-red-500/25'
                    : recordingState === 'processing'
                    ? 'cursor-not-allowed'
                    : 'bg-teal-600 hover:bg-teal-700 hover:scale-105 shadow-lg shadow-teal-500/20'
                }`}
                style={recordingState === 'processing' ? {
                  background: 'var(--bg-subtle)',
                  color: 'var(--text-muted)',
                } : {}}
              >
                {recordingState === 'processing' ? (
                  <RefreshCw size={22} className="animate-spin" style={{ color: 'var(--text-muted)' }} />
                ) : recordingState === 'recording' ? (
                  <MicOff size={22} className="text-white" />
                ) : (
                  <Mic size={22} className="text-white" />
                )}
              </button>
            </div>

            <p className="mt-5 text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
              {recordingState === 'idle' && 'Tap the microphone to start recording'}
              {recordingState === 'recording' && (
                <span className="flex items-center gap-2 text-red-500 font-semibold">
                  <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                  Recording — {formatTime(recordSeconds)}
                </span>
              )}
              {recordingState === 'processing' && (
                <span style={{ color: 'var(--text-secondary)' }}>Processing your audio…</span>
              )}
              {recordingState === 'done' && (
                <span className="flex items-center gap-1.5 text-emerald-500 font-semibold">
                  <CheckCircle2 size={15} /> Transcription complete
                </span>
              )}
              {recordingState === 'error' && <span className="text-red-500">Recording failed</span>}
            </p>

            {/* Live transcript */}
            {recordingState === 'recording' && (
              <div
                className="w-full max-w-lg mt-4 rounded-xl p-3.5 text-sm italic text-left"
                style={{
                  background: 'var(--bg-subtle)',
                  border: '1px solid var(--border-base)',
                  color: 'var(--text-secondary)',
                  minHeight: '3rem',
                }}
              >
                {liveTranscript || <span style={{ color: 'var(--text-muted)' }}>Listening… speak now…</span>}
              </div>
            )}
          </div>

          {/* Transcription Results */}
          <AnimatePresence>
            {segments.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between px-0.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-left" style={{ color: 'var(--text-muted)' }}>
                    Transcription · {segments.length} segment{segments.length !== 1 ? 's' : ''}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={reset}
                      className="btn-ghost flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs"
                    >
                      <RefreshCw size={11} /> New
                    </button>
                    <button
                      id="vtt-export-btn"
                      onClick={handleExportAll}
                      className="btn-ghost flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs"
                    >
                      <Download size={12} /> Export
                    </button>
                  </div>
                </div>

                <div className="space-y-3 text-left">
                  {segments.map((seg) => (
                    <div
                      key={seg.id}
                      className="app-card rounded-2xl p-4 flex flex-col gap-3 transition-all"
                    >
                      {/* Card Header (Metadata & Play button) */}
                      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border-base)] pb-3">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                          <span className="flex items-center gap-1.5">
                            <Calendar size={12} className="text-slate-400" />
                            {seg.day || new Date().toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}
                          </span>
                          <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                          <span className="flex items-center gap-1.5">
                            <Clock size={12} className="text-slate-400" />
                            {seg.timestamp}
                          </span>
                          <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                          <span className="flex items-center gap-1 rounded-full bg-[var(--accent)]/10 px-2 py-0.5 text-[10px] font-semibold text-[var(--accent)] border border-[var(--accent)]/15">
                            <Globe size={11} />
                            {seg.language || 'English'}
                          </span>
                          <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                          <span className="flex items-center gap-1.5 text-slate-500">
                            {seg.text.split(/\s+/).filter(Boolean).length} words
                          </span>
                        </div>

                        <button
                          onClick={() => {
                            if ('speechSynthesis' in window) {
                              window.speechSynthesis.cancel();
                              window.speechSynthesis.speak(new SpeechSynthesisUtterance(seg.text));
                            }
                          }}
                          className="flex h-7 w-7 items-center justify-center rounded-full transition-colors flex-shrink-0"
                          style={{
                            border: '1px solid color-mix(in srgb, var(--accent) 30%, transparent)',
                            color: 'var(--accent)',
                            background: 'color-mix(in srgb, var(--accent) 5%, transparent)',
                          }}
                          title="Play Text-to-Speech"
                        >
                          <Play size={11} className="ml-0.5" />
                        </button>
                      </div>

                      {/* Text */}
                      <div className="flex-1 min-w-0">
                        {seg.isEditing ? (
                          <textarea
                            value={seg.text}
                            onChange={(e) => setSegments(prev =>
                              prev.map(s => s.id === seg.id ? { ...s, text: e.target.value } : s)
                            )}
                            rows={2}
                            autoFocus
                            className="w-full resize-none rounded-xl px-3 py-2 text-sm app-input"
                          />
                        ) : (
                          <p className="text-sm font-medium leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                            {seg.text}
                          </p>
                        )}
                      </div>

                      {/* Actions — always below text, right-aligned */}
                      <div className="flex items-center gap-2 justify-end relative">
                        {/* Copy Button Container */}
                        <div className="relative">
                          <button
                            onClick={() => handleCopy(seg.id, seg.text)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-slate-200 dark:hover:bg-slate-800"
                            style={{
                              background: 'var(--bg-subtle)',
                              border: '1px solid var(--border-base)',
                              color: 'var(--text-muted)',
                            }}
                          >
                            <Copy size={13} />
                          </button>
                          <AnimatePresence>
                            {copiedId === seg.id && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.8, y: 5, x: '-50%' }}
                                animate={{ opacity: 1, scale: 1, y: -32, x: '-50%' }}
                                exit={{ opacity: 0, scale: 0.8, y: 5, x: '-50%' }}
                                transition={{ duration: 0.1 }}
                                className="absolute left-1/2 bg-emerald-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-lg pointer-events-none whitespace-nowrap z-50"
                              >
                                <div className="absolute bottom-[-3px] left-1/2 -translate-x-1/2 w-1.5 h-1.5 rotate-45 bg-emerald-500" />
                                Copied!
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        {/* Edit Button */}
                        <button
                          onClick={() => setSegments(prev =>
                            prev.map(s => s.id === seg.id ? { ...s, isEditing: !s.isEditing } : s)
                          )}
                          className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
                          style={{
                            background: seg.isEditing ? 'color-mix(in srgb, #10b981 10%, var(--bg-subtle))' : 'var(--bg-subtle)',
                            border: '1px solid var(--border-base)',
                            color: seg.isEditing ? '#10b981' : 'var(--text-muted)',
                          }}
                        >
                          {seg.isEditing ? <Check size={13} /> : <Edit3 size={13} />}
                        </button>

                        {/* Delete Button Container */}
                        <div className="relative">
                          <button
                            onClick={() => setDeleteConfirmId(seg.id)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
                            style={{
                              background: 'color-mix(in srgb, #ef4444 6%, var(--bg-subtle))',
                              border: '1px solid color-mix(in srgb, #ef4444 20%, var(--border-base))',
                              color: '#ef4444',
                            }}
                          >
                            <Trash2 size={13} />
                          </button>
                          <AnimatePresence>
                            {deleteConfirmId === seg.id && (
                              <>
                                {/* Backdrop to dismiss confirmation on click outside */}
                                <motion.div
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  exit={{ opacity: 0 }}
                                  className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                                  onClick={() => setDeleteConfirmId(null)}
                                />
                                {/* Modal Box */}
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.9, x: '-50%', y: '-50%' }}
                                  animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
                                  exit={{ opacity: 0, scale: 0.9, x: '-50%', y: '-50%' }}
                                  transition={{ duration: 0.15 }}
                                  className="fixed left-1/2 top-1/2 z-50 w-[90%] max-w-sm rounded-2xl p-6 shadow-2xl flex flex-col items-center text-center gap-4"
                                  style={{
                                    background: 'var(--bg-elevated, var(--bg-card))',
                                    border: '1px solid var(--border-base)',
                                    color: 'var(--text-primary)',
                                    boxShadow: 'var(--shadow-2xl)',
                                  }}
                                >
                                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 text-red-500 mb-1">
                                    <Trash2 size={20} />
                                  </div>
                                  <div className="space-y-1">
                                    <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                                      Delete segment?
                                    </h3>
                                    <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                                      Are you sure you want to delete this segment? This action cannot be undone.
                                    </p>
                                  </div>
                                  <div className="flex gap-3 w-full mt-2">
                                    <button
                                      onClick={() => setDeleteConfirmId(null)}
                                      className="flex-1 rounded-xl py-2.5 text-xs font-bold transition-colors"
                                      style={{
                                        background: 'var(--bg-subtle)',
                                        border: '1px solid var(--border-base)',
                                        color: 'var(--text-secondary)',
                                      }}
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      onClick={() => {
                                        setSegments(prev => prev.filter(s => s.id !== seg.id));
                                        setDeleteConfirmId(null);
                                      }}
                                      className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-xl py-2.5 text-xs font-bold transition-colors shadow-lg shadow-red-500/15"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </motion.div>
                              </>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Usage Overview Row */}
          <div className="space-y-4 pt-2 text-left">
            <h3 className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Usage Overview</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {/* Recordings Today */}
              <div className="glass-card rounded-2xl p-4.5 border border-slate-200 dark:border-white/5 bg-white/40 dark:bg-[#111827]/40 flex flex-col justify-between min-h-[105px]">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Recordings Count</span>
                    <h4 className="text-xl font-black text-slate-900 dark:text-white mt-1">{vttHistory.length}</h4>
                  </div>
                  <div className="h-7 w-7 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-500 flex-shrink-0">
                    <Mic size={14} />
                  </div>
                </div>
                <div className="text-[9px] text-slate-400 dark:text-slate-500 font-bold mt-2.5">
                  Total voice sessions
                </div>
              </div>

              {/* Recorded Minutes */}
              <div className="glass-card rounded-2xl p-4.5 border border-slate-200 dark:border-white/5 bg-white/40 dark:bg-[#111827]/40 flex flex-col justify-between min-h-[105px]">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Recorded Minutes</span>
                    <h4 className="text-xl font-black text-slate-900 dark:text-white mt-1">{(billingOverview?.usage?.audio_minutes_used || 0).toFixed(1)} mins</h4>
                  </div>
                  <div className="h-7 w-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 flex-shrink-0">
                    <Clock size={14} />
                  </div>
                </div>
                <div className="text-[9px] text-slate-400 dark:text-slate-500 font-bold mt-2.5">
                  Transcription time used
                </div>
              </div>

              {/* Remaining Minutes */}
              <div className="glass-card rounded-2xl p-4.5 border border-slate-200 dark:border-white/5 bg-white/40 dark:bg-[#111827]/40 flex flex-col justify-between min-h-[105px]">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Remaining Minutes</span>
                    <h4 className="text-xl font-black text-slate-900 dark:text-white mt-1">{remainingMinutes.toFixed(1)} mins</h4>
                  </div>
                  <div className="h-7 w-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 flex-shrink-0">
                    <Activity size={14} />
                  </div>
                </div>
                <div className="text-[9px] text-slate-400 dark:text-slate-500 font-bold mt-2.5">
                  Out of {audioLimit.toFixed(0)} mins limit
                </div>
              </div>

              {/* Active Provider */}
              <div className="glass-card rounded-2xl p-4.5 border border-slate-250 dark:border-white/5 bg-white/40 dark:bg-[#111827]/40 flex flex-col justify-between min-h-[105px]">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Active Engine</span>
                    <h4 className="text-xl font-black text-slate-900 dark:text-white mt-1">{activeProvider}</h4>
                  </div>
                  <div className="h-7 w-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 flex-shrink-0">
                    <Award size={14} />
                  </div>
                </div>
                <div className="text-[9px] text-slate-400 dark:text-slate-500 font-bold mt-2.5">
                  Current STT provider
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Banners & Recent Activity */}
        <div className="lg:col-span-1 space-y-6">
          {/* Mic Banner */}
          <div className="relative overflow-hidden rounded-2xl p-5 border border-slate-200 dark:border-white/5 bg-gradient-to-br from-teal-600/10 to-emerald-500/10 dark:from-teal-600/5 dark:to-emerald-500/5 min-h-[120px] flex flex-col justify-center text-left">
            <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />
            <div className="relative z-10">
              <span className="text-[8px] font-black uppercase text-teal-500 dark:text-teal-400 tracking-wider">Live Mic</span>
              <h4 className="font-display text-sm font-black text-slate-955 dark:text-white mt-1 leading-snug">High-accuracy Real-time</h4>
              <p className="mt-1 text-[10px] text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                Stream live recording through Whisper & Deepgram engines.
              </p>
            </div>
            <Mic size={52} className="absolute right-[-10px] bottom-[-10px] opacity-10 text-teal-500" />
          </div>

          {/* Recent Recordings Card */}
          <div className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-white/5 bg-white/40 dark:bg-[#111827]/40 space-y-3 text-left">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/5 pb-2">
              <h4 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">Recent recordings</h4>
              <span className="text-[9px] text-teal-500 dark:text-teal-400 font-bold cursor-pointer hover:underline" onClick={() => fetchBillingOverview()}>Refresh</span>
            </div>

            <div className="space-y-2">
              {vttHistory.length === 0 ? (
                <div className="text-center py-6 text-slate-400 dark:text-slate-500 text-[10px] font-medium font-sans">
                  No recent recordings.
                </div>
              ) : (
                vttHistory.slice(0, 4).map(item => (
                  <div key={item.id} className="p-2.5 rounded-xl bg-slate-100/50 dark:bg-slate-950/20 border border-slate-200 dark:border-white/5 flex items-start gap-3 hover:border-slate-300 dark:hover:border-white/10 transition-colors">
                    <span className="text-[9px] font-black text-teal-600 bg-teal-500/10 rounded px-1.5 py-0.5 mt-0.5">REC</span>
                    <div className="flex-1 min-w-0 text-left font-sans">
                      <p className="text-[10px] font-bold text-slate-800 dark:text-slate-200 truncate">{item.title}</p>
                      <span className="text-[8px] text-slate-500 font-medium">{item.details} · {item.timestamp}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Activity Timeline */}
          <div className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-white/5 bg-white/40 dark:bg-[#111827]/40 space-y-3 text-left">
            <h4 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest border-b border-slate-200 dark:border-white/5 pb-2">Recent Activity</h4>
            <div className="relative border-l border-slate-200 dark:border-white/5 ml-2 pl-4 space-y-4 text-[10px] font-semibold text-slate-500">
              {vttHistory.length === 0 ? (
                <div className="text-center py-4 text-slate-400 dark:text-slate-500 text-[10px] font-medium font-sans">
                  No recent activity.
                </div>
              ) : (
                vttHistory.slice(0, 3).map(item => (
                  <div key={item.id} className="relative text-left">
                    <div className="absolute -left-[23px] top-1 h-3 w-3 rounded-full bg-slate-50 dark:bg-[#0B1020] border-2 border-teal-500 flex items-center justify-center z-10" />
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-slate-900 dark:text-white block font-bold truncate max-w-[120px]">{item.title}</span>
                        <span className="text-[9px] text-slate-550 dark:text-slate-400 mt-0.5 block">{item.details}</span>
                      </div>
                      <span className="text-[8px] text-slate-450 dark:text-slate-500 font-mono flex-shrink-0">{item.timestamp}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
