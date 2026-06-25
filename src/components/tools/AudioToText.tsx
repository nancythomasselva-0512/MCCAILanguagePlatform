import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Download, Edit3, Check, Copy, RefreshCw,
  Clock, AlertCircle, CheckCircle2, FileAudio, X, Cpu, ChevronDown, Trash2,
  Award, Activity
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { providerManager } from '../../providers/providerManager';
import { storage } from "../../utils/storage";


type ProcessState = 'idle' | 'decoding' | 'downloading' | 'processing' | 'done' | 'error';

interface TranscriptSegment {
  timestamp: string;
  text: string;
  highlighted: boolean;
}

const formatSeconds = (secs: number) => {
  const m = Math.floor(secs / 60).toString().padStart(2, '0');
  const s = Math.floor(secs % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

const LANGUAGES = [
  { label: 'Auto Detect', code: 'auto' },
  { label: 'English', code: 'en' },
  { label: 'Spanish', code: 'es' },
  { label: 'French', code: 'fr' },
  { label: 'German', code: 'de' },
  { label: 'Italian', code: 'it' },
  { label: 'Portuguese', code: 'pt' },
  { label: 'Hindi', code: 'hi' },
  { label: 'Chinese', code: 'zh' },
  { label: 'Japanese', code: 'ja' },
  { label: 'Russian', code: 'ru' },
  { label: 'Korean', code: 'ko' },
];

const MODELS = [
  { label: 'Tiny (Fast)', code: 'tiny' },
  { label: 'Base (Balanced)', code: 'base' },
  { label: 'Small (Accurate)', code: 'small' },
];

export const AudioToText: React.FC = () => {
  const { history, billingOverview, addHistoryItem, openAiApiKey, fetchBillingOverview } = useApp();
  const [processState, setProcessState] = useState<ProcessState>('idle');
  const [modelProgress] = useState(0);
  const [downloadingFile] = useState('');
  const [transcribeProgress, setTranscribeProgress] = useState(0);
  const [segments, setSegments] = useState<TranscriptSegment[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
  const [fileName, setFileName] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [copied, setCopied] = useState(false);
  const [backendStatus, setBackendStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const [activeProvider, setActiveProvider] = useState<string>('Managed by Platform');
  const [selectedLanguage, setSelectedLanguage] = useState('auto');
  const [modelSize, setModelSize] = useState('base');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [viewMode, setViewMode] = useState<'segmented' | 'paragraph'>('segmented');
  const [fontSize, setFontSize] = useState('14px');
  const [fontFamily, setFontFamily] = useState('System Default');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const xhrRef = useRef<XMLHttpRequest | null>(null);

  const checkBackend = async () => {
    setBackendStatus('checking');
    try {
      const res = await fetch('http://127.0.0.1:8000/api/health');
      if (res.ok) {
        const data = await res.json();
        if (data.status === 'ok' && data.engine === 'faster-whisper') {
          setBackendStatus('connected');
          return;
        }
      }
      setBackendStatus('disconnected');
    } catch (e) {
      setBackendStatus('disconnected');
    }
  };

  useEffect(() => { checkBackend(); }, []);

  useEffect(() => {
    providerManager.getActiveProviders().then(res => {
      if (res["Audio To Text"]) {
        setActiveProvider(res["Audio To Text"].toUpperCase());
      }
    });
  }, []);


  const processFile = async (file: File) => {
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    if (!file.type.startsWith('audio/') && !['mp3', 'wav', 'm4a', 'aac', 'ogg', 'webm', 'flac'].includes(ext)) {
      setErrorMsg('Unsupported format. Please upload MP3, WAV, M4A, AAC, OGG, or FLAC.');
      setProcessState('error');
      return;
    }
    setErrorMsg('');
    setFileName(file.name);
    setSegments([]);
    setTranscribeProgress(0);
    setUploadProgress(0);

    const token = storage.getItem("mcc-ai-token");
    // If local Faster-Whisper server is active and we are in single-tenant mode (no token), use direct upload
    if (backendStatus === 'connected' && !token) {
      try {
        setProcessState('downloading');
        const formData = new FormData();
        formData.append('file', file);
        formData.append('model', modelSize);
        formData.append('language', selectedLanguage);

        const xhr = new XMLHttpRequest();
        xhrRef.current = xhr;
        const responseData = await new Promise<any>((resolve, reject) => {
          xhr.open('POST', 'http://127.0.0.1:8000/api/transcribe', true);
          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) setUploadProgress(Math.round((event.loaded / event.total) * 100));
          };
          xhr.onload = () => {
            xhrRef.current = null;
            if (xhr.status === 200) {
              try { resolve(JSON.parse(xhr.responseText)); }
              catch { reject(new Error('Invalid server response.')); }
            } else {
              try { reject(new Error(JSON.parse(xhr.responseText).detail || `Server error ${xhr.status}`)); }
              catch { reject(new Error(`Server error ${xhr.status}`)); }
            }
          };
          xhr.onerror = () => {
            xhrRef.current = null;
            reject(new Error('Connection error. Ensure the Python server is running.'));
          };
          xhr.send(formData);
        });

        setProcessState('processing');
        setTranscribeProgress(100);

        if (responseData.segments?.length) {
          const formatted: TranscriptSegment[] = responseData.segments.map((seg: any) => ({
            timestamp: seg.timestamp,
            text: seg.text,
            highlighted: false,
          }));
          setSegments(formatted);
          setProcessState('done');
          const totalWords = formatted.reduce((a, s) => a + s.text.split(' ').length, 0);
          const langInfo = responseData.language ? ` (${responseData.language.toUpperCase()})` : '';
          addHistoryItem('audio-transcription', file.name, `Faster-Whisper${langInfo} · ${totalWords} words`);
        } else {
          throw new Error('No segments returned from server.');
        }
      } catch (err: any) {
        xhrRef.current = null;
        setErrorMsg(err.message || 'Server transcription failed.');
        setProcessState('error');
      }
      return;
    }

    try {
      setProcessState('processing');
      setTranscribeProgress(10);

      // Animate progress up to 90%
      const progressTimer = setInterval(() => {
        setTranscribeProgress(p => p < 90 ? p + 5 : p);
      }, 300);

      const text = await providerManager.transcribeAudio(
        file,
        openAiApiKey,
        '', // deepgram key
        selectedLanguage === 'auto' ? 'en' : selectedLanguage
      );
      fetchBillingOverview();

      clearInterval(progressTimer);
      setTranscribeProgress(100);

      // Split text into realistic segments, supporting periods inside filenames
      const sentences = text.split(/(?<=[.!?])\s+/).filter(Boolean);
      const finalSentences = sentences.length > 0 ? sentences : [text];
      const formatted: TranscriptSegment[] = finalSentences
        .map(s => s.trim())
        .filter(Boolean)
        .map((sentence, index) => {
          const secs = index * 4;
          return {
            timestamp: formatSeconds(secs),
            text: sentence,
            highlighted: false
          };
        });

      setSegments(formatted);
      setProcessState('done');
      const totalWords = formatted.reduce((a, s) => a + s.text.split(' ').length, 0);
      addHistoryItem('audio-transcription', file.name, `Platform STT · ${totalWords} words`);
    } catch (err: any) {
      setErrorMsg(err.message || 'Transcription failed.');
      setProcessState('error');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const startEdit = (i: number) => { setEditingIndex(i); setEditValue(segments[i].text); };
  const saveEdit = () => {
    if (editingIndex === null) return;
    setSegments(prev => prev.map((s, i) => i === editingIndex ? { ...s, text: editValue } : s));
    setEditingIndex(null);
  };
  const toggleHighlight = (i: number) => {
    setSegments(prev => prev.map((s, idx) => idx === i ? { ...s, highlighted: !s.highlighted } : s));
  };

  const getFormattedText = () => {
    if (viewMode === 'paragraph') {
      return segments.map(s => s.text).join(' ');
    }
    return segments.map(s => `[${s.timestamp}] ${s.text}`).join('\n\n');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getFormattedText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([getFormattedText()], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName || 'transcript'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    if (xhrRef.current) {
      xhrRef.current.abort();
      xhrRef.current = null;
    }
    setProcessState('idle');
    setSegments([]);
    setFileName('');
    setTranscribeProgress(0);
    setUploadProgress(0);
    setErrorMsg('');
    setEditingIndex(null);
  };

  const selectStyle = {
    background: 'var(--bg-subtle)',
    border: '1px solid var(--border-base)',
    color: 'var(--text-primary)',
  };

  const attHistory = (history || []).filter(item => item.type === 'audio-transcription');
  const audioLimit = billingOverview?.usage?.audio_minutes_limit || 30;
  const remainingMinutes = Math.max(0, audioLimit - (billingOverview?.usage?.audio_minutes_used || 0));

  const getFileExt = (title: string) => {
    const parts = title.split('.');
    if (parts.length > 1) {
      const ext = parts[parts.length - 1].toUpperCase();
      if (ext.length <= 4) return ext;
    }
    return 'AUDIO';
  };

  return (
    <div className="space-y-6 w-full animate-fadeIn">
      {/* Header with Provider Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/5">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <FileAudio className="text-teal-500" size={20} />
            Audio to Text
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Upload audio files to transcribe into structured text
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
            <button onClick={() => { setErrorMsg(''); setProcessState('idle'); }} className="flex-shrink-0 opacity-60 hover:opacity-100"><X size={14} /></button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backend Status Banner */}
      {backendStatus === 'connected' ? (
        <div className="alert alert-success">
          <Cpu size={14} className="flex-shrink-0 animate-pulse" />
          <span className="flex-1 text-xs">
            <strong>Faster-Whisper Active</strong> — High-performance local Python backend connected. Supports all languages with automatic detection.
          </span>
          <span className="badge badge-success text-[9px]">Online</span>
        </div>
      ) : backendStatus === 'checking' ? (
        <div className="alert alert-info">
          <Cpu size={14} className="flex-shrink-0 animate-spin" style={{ color: 'var(--text-muted)' }} />
          <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Checking connection to local Faster-Whisper server…</span>
        </div>
      ) : (
        <div className="alert alert-warning">
          <Cpu size={14} className="flex-shrink-0" />
          <span className="flex-1 text-xs">
            <strong>Faster-Whisper Offline</strong> — Start the backend (<code className="font-mono">start_backend.ps1</code>) for best results. Falling back to browser-based transcription.
          </span>
          <button onClick={checkBackend} className="flex-shrink-0 text-xs font-bold hover:underline" style={{ color: 'var(--accent)' }}>
            Retry
          </button>
        </div>
      )}

      {/* 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column - Forms & Overview */}
        <div className="lg:col-span-3 space-y-6">
          {/* Info Banner */}
          <div 
            className="relative overflow-hidden rounded-3xl p-6 md:p-8 flex items-center justify-between min-h-[140px] border border-teal-100 dark:border-white/5 shadow-sm"
            style={{
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.05) 100%)',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 via-emerald-500/5 to-transparent pointer-events-none" />
            
            <div className="flex items-center gap-5 relative z-10 max-w-[70%] text-left">
              <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-teal-500 to-emerald-500 shadow-md shadow-teal-500/20 text-white">
                <FileAudio size={24} />
              </div>
              <div>
                <h3 className="font-display text-lg md:text-xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-snug">
                  Audio to Text Transcription
                </h3>
                <p className="mt-1.5 text-xs md:text-sm text-slate-600 dark:text-slate-350 leading-relaxed font-medium">
                  Upload your audio files to convert them into structured text. Supports multiple audio formats and automatic language detection.
                </p>
              </div>
            </div>
            
            {/* Banner Illustration on the Right */}
            <div className="absolute right-0 top-0 bottom-0 w-1/3 max-w-[220px] flex items-center justify-end select-none pointer-events-none pr-4 overflow-hidden">
              <img 
                src="/banner_illustration.png" 
                alt="Transcription illustration" 
                className="h-[120%] object-contain mt-2 opacity-95 filter drop-shadow-md hue-rotate-[250deg] dark:brightness-95 dark:contrast-105"
              />
            </div>
          </div>

          {/* Configuration (only when idle) — Grid layout for clean responsiveness */}
          {processState === 'idle' && (
            <div className="app-card rounded-2xl p-4 grid gap-3 sm:grid-cols-2">
              <div className="w-full text-left">
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Language</label>
                <div className="relative">
                  <select id="att-lang-select" value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="w-full appearance-none rounded-xl px-3.5 pr-9 py-2.5 text-sm font-semibold focus:outline-none"
                    style={selectStyle}>
                    {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
                  </select>
                  <ChevronDown size={13} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                </div>
              </div>

              <div className="w-full text-left">
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  Model Size
                  {backendStatus !== 'connected' && (
                    <span className="ml-2 text-teal-500 normal-case font-medium">(Server only)</span>
                  )}
                </label>
                <div className="relative">
                  <select id="att-model-select" value={modelSize}
                    onChange={(e) => setModelSize(e.target.value)}
                    disabled={backendStatus !== 'connected'}
                    className="w-full appearance-none rounded-xl px-3.5 pr-9 py-2.5 text-sm font-semibold focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                    style={selectStyle}>
                    {MODELS.map(m => <option key={m.code} value={m.code}>{m.label}</option>)}
                  </select>
                  <ChevronDown size={13} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                </div>
              </div>
            </div>
          )}

          {/* Upload Area — Compact padding on mobile */}
          {processState === 'idle' && (
            <div
              id="att-upload-area"
              className={`app-card rounded-2xl p-6 sm:p-14 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${isDragOver ? 'drag-over' : ''}`}
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              role="button"
              tabIndex={0}
              aria-label="Upload audio file"
              onKeyDown={(e) => { if (e.key === 'Enter') fileInputRef.current?.click(); }}
            >
              <input ref={fileInputRef} type="file" accept="audio/*" className="hidden"
                onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])} />
              <div className={`mb-5 flex h-20 w-20 items-center justify-center rounded-2xl transition-colors`}
                style={{
                  background: isDragOver ? 'color-mix(in srgb, var(--accent) 10%, var(--bg-subtle))' : 'var(--bg-subtle)',
                  color: isDragOver ? 'var(--accent)' : 'var(--text-muted)',
                  border: '1px solid var(--border-base)',
                }}>
                <FileAudio size={34} />
              </div>
              <p className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                {isDragOver ? 'Drop your audio file here' : 'Drag & drop your audio file'}
              </p>
              <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>or click to browse from your device</p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {['MP3', 'WAV', 'M4A', 'OGG', 'FLAC'].map(fmt => (
                  <span key={fmt} className="rounded-full px-3 py-1 text-xs font-bold"
                    style={{
                      background: 'var(--bg-subtle)',
                      border: '1px solid var(--border-base)',
                      color: 'var(--text-muted)',
                    }}>
                    {fmt}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Progress & Error States */}
          <AnimatePresence>
            {(['decoding', 'downloading', 'processing', 'error'] as ProcessState[]).includes(processState) && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="app-card rounded-2xl p-6">
                <div className="flex items-center gap-4 mb-5">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl"
                    style={
                      processState === 'error'
                        ? { background: 'rgba(239, 68, 68, 0.1)', color: 'rgb(239, 68, 68)' }
                        : { background: 'var(--accent-subtle)', color: 'var(--accent)' }
                    }>
                    {processState === 'error' ? <AlertCircle size={20} /> : <FileAudio size={20} />}
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="truncate text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{fileName || 'Audio File'}</p>
                    <p className="text-xs" style={processState === 'error' ? { color: 'rgb(239, 68, 68)' } : { color: 'var(--text-muted)' }}>
                      {processState === 'decoding' && 'Decoding audio and resampling to 16kHz…'}
                      {processState === 'downloading' && (
                        backendStatus === 'connected'
                          ? `Uploading to Faster-Whisper server… (${uploadProgress}%)`
                          : `Downloading AI model files… (${modelProgress}%)`
                      )}
                      {processState === 'processing' && 'Running speech recognition…'}
                      {processState === 'error' && (errorMsg || 'An error occurred during transcription.')}
                    </p>
                  </div>

                  {/* Delete / Cancel button */}
                  <button
                    onClick={reset}
                    className="flex-shrink-0 p-2.5 rounded-xl border border-transparent hover:border-red-500/20 text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                    title={processState === 'error' ? 'Clear error' : 'Cancel upload & delete'}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {processState === 'downloading' && (
                  <div className="mb-4">
                    <div className="mb-1.5 flex justify-between text-xs" style={{ color: 'var(--text-muted)' }}>
                      <span className="truncate max-w-[260px]">
                        {backendStatus === 'connected' ? 'Uploading…' : (downloadingFile || 'Model files')}
                      </span>
                      <span>{backendStatus === 'connected' ? uploadProgress : modelProgress}%</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full" style={{ background: 'var(--border-base)' }}>
                      <div className="h-full rounded-full bg-teal-500 transition-all duration-300"
                        style={{ width: `${backendStatus === 'connected' ? uploadProgress : modelProgress}%` }} />
                    </div>
                  </div>
                )}

                {processState === 'processing' && (
                  <div className="mb-4">
                    <div className="mb-1.5 flex justify-between text-xs" style={{ color: 'var(--text-muted)' }}>
                      <span>AI Transcription</span>
                      <span>{backendStatus === 'connected' ? 'Processing…' : `${Math.round(transcribeProgress)}%`}</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full" style={{ background: 'var(--border-base)' }}>
                      <div
                        className={`h-full rounded-full bg-emerald-500 ${backendStatus === 'connected' ? 'w-full animate-pulse' : 'transition-all'}`}
                        style={backendStatus === 'connected' ? {} : { width: `${transcribeProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Skeleton shimmer */}
                {processState !== 'error' && (
                  <div className="space-y-2 mt-4">
                    {[90, 70, 80, 55].map((w, i) => (
                      <div key={i} className="shimmer h-3 rounded-full" style={{ width: `${w}%` }} />
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Transcript Result */}
          <AnimatePresence>
            {processState === 'done' && segments.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="space-y-4">
                {/* Toolbar — Responsive wrapping and centering */}
                <div className="app-card rounded-2xl p-4 sm:px-5 sm:py-3.5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex flex-wrap items-center gap-2.5 text-xs sm:text-sm">
                    <CheckCircle2 size={14} className="text-emerald-500 animate-pulse" />
                    <span className="font-semibold text-left" style={{ color: 'var(--text-primary)' }}>{fileName}</span>
                    <span className="badge badge-success">
                      {backendStatus === 'connected' ? 'Faster-Whisper' : 'Local Whisper'}
                    </span>
                    <span className="text-xs text-left" style={{ color: 'var(--text-muted)' }}>
                      {segments.length} segments · {segments.reduce((a, s) => a + s.text.split(' ').length, 0)} words
                    </span>

                    {/* View Mode Toggle */}
                    <div className="flex rounded-lg bg-[var(--bg-subtle)] p-0.5 border border-[var(--border-base)] ml-1">
                      <button
                        onClick={() => setViewMode('segmented')}
                        className={`rounded-md px-2.5 py-1 text-[10px] font-extrabold transition-all duration-200 cursor-pointer ${
                          viewMode === 'segmented'
                            ? 'bg-white dark:bg-slate-800 text-[var(--text-primary)] shadow-sm'
                            : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                        }`}
                      >
                        Segments
                      </button>
                      <button
                        onClick={() => setViewMode('paragraph')}
                        className={`rounded-md px-2.5 py-1 text-[10px] font-extrabold transition-all duration-200 cursor-pointer ${
                          viewMode === 'paragraph'
                            ? 'bg-white dark:bg-slate-800 text-[var(--text-primary)] shadow-sm'
                            : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                        }`}
                      >
                        Paragraph
                      </button>
                    </div>
                    
                    {/* Font Configuration */}
                    <div className="flex items-center gap-2 ml-1">
                      <div className="relative">
                        <select value={fontFamily}
                          onChange={(e) => setFontFamily(e.target.value)}
                          className="appearance-none rounded-lg px-2.5 pr-7 py-1 text-[10px] font-extrabold focus:outline-none bg-[var(--bg-subtle)] border border-[var(--border-base)] text-[var(--text-primary)]">
                          <option value="System Default">Default Font</option>
                          <option value="Inter">Inter</option>
                          <option value="Roboto">Roboto</option>
                          <option value="Marudham">Marudham</option>
                          <option value="Latha">Latha</option>
                          <option value="Arial">Arial</option>
                          <option value="Times New Roman">Times New Roman</option>
                          <option value="Courier New">Courier New</option>
                          <option value="Georgia">Georgia</option>
                        </select>
                        <ChevronDown size={11} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                      </div>
                      <div className="relative">
                        <select value={fontSize}
                          onChange={(e) => setFontSize(e.target.value)}
                          className="appearance-none rounded-lg px-2.5 pr-7 py-1 text-[10px] font-extrabold focus:outline-none bg-[var(--bg-subtle)] border border-[var(--border-base)] text-[var(--text-primary)]">
                          <option value="12px">12</option>
                          <option value="14px">14</option>
                          <option value="16px">16</option>
                          <option value="18px">18</option>
                          <option value="20px">20</option>
                          <option value="22px">22</option>
                          <option value="24px">24</option>
                        </select>
                        <ChevronDown size={11} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 w-full md:w-auto md:justify-end">
                    <button onClick={reset} className="btn-ghost flex-1 sm:flex-none flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs">
                      <RefreshCw size={11} /> New File
                    </button>
                    <button id="att-copy-btn" onClick={handleCopy}
                      className="btn-ghost flex-1 sm:flex-none flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs">
                      {copied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                      {copied ? 'Copied!' : 'Copy All'}
                    </button>
                    <button id="att-download-btn" onClick={handleDownload}
                      className="btn-primary flex-1 sm:flex-none flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs">
                      <Download size={12} /> Download .txt
                    </button>
                  </div>
                </div>

                {viewMode === 'paragraph' ? (
                  <div 
                    className="app-card rounded-2xl p-6 text-sm font-semibold leading-relaxed text-left whitespace-pre-wrap select-text" 
                    style={{ 
                      border: '1px solid var(--border-base)', 
                      color: 'var(--text-primary)',
                      fontSize: fontSize,
                      fontFamily: fontFamily === 'System Default' ? 'inherit' : `"${fontFamily}", sans-serif`
                    }}
                  >
                    {segments.map((seg, idx) => (
                      editingIndex === idx ? (
                        <span key={idx} className="inline-flex gap-1.5 items-center align-middle mx-1 my-0.5">
                          <textarea
                            autoFocus
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="rounded-lg px-2.5 py-1 text-sm focus:outline-none w-64 md:w-80 h-10 border border-[var(--accent)] resize-none"
                            style={{
                              background: 'var(--bg-subtle)',
                              color: 'var(--text-primary)',
                            }}
                            onKeyDown={(e) => { 
                              if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); saveEdit(); }
                              if (e.key === 'Escape') setEditingIndex(null);
                            }}
                            onBlur={saveEdit}
                          />
                          <button onClick={saveEdit}
                            className="rounded-lg p-1.5 text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600 transition-colors">
                            <Check size={13} />
                          </button>
                        </span>
                      ) : (
                        <span 
                          key={idx}
                          className="inline transition-all duration-200 cursor-pointer hover:text-[var(--accent)] hover:bg-[var(--accent)]/5 px-1 py-0.5 rounded"
                          onClick={() => startEdit(idx)}
                          title="Click to edit segment"
                        >
                          {seg.text}{' '}
                        </span>
                      )
                    ))}
                  </div>
                ) : (
                  /* Segment list */
                  <div className="app-card rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border-base)' }}>
                    {segments.map((seg, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className="group flex flex-col sm:flex-row gap-3 p-4 transition-colors"
                        style={{
                          background: seg.highlighted
                            ? 'color-mix(in srgb, #f59e0b 6%, var(--bg-card))'
                            : i % 2 === 1 ? 'var(--bg-subtle)' : 'var(--bg-card)',
                          borderBottom: i < segments.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                        }}
                      >
                        {/* Timestamp */}
                        <div className="flex-shrink-0 pt-0.5 text-left">
                          <span className="inline-flex items-center gap-1 rounded-lg px-2 py-0.5 font-mono text-[11px] font-bold"
                            style={{
                              background: 'var(--bg-elevated)',
                              border: '1px solid var(--border-base)',
                              color: 'var(--text-muted)',
                            }}>
                            <Clock size={9} /> {seg.timestamp}
                          </span>
                        </div>

                        {/* Text / Edit */}
                        <div className="flex-1 min-w-0 text-left">
                          {editingIndex === i ? (
                            <div className="flex gap-2">
                              <textarea
                                autoFocus
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                rows={3}
                                className="flex-1 resize-none rounded-xl px-3 py-2 text-sm focus:outline-none"
                                style={{
                                  background: 'var(--bg-subtle)',
                                  border: '1px solid var(--accent)',
                                  color: 'var(--text-primary)',
                                }}
                                onKeyDown={(e) => { 
                                  if (e.key === 'Enter' && e.ctrlKey) saveEdit(); 
                                  if (e.key === 'Escape') setEditingIndex(null);
                                }}
                              />
                              <button onClick={saveEdit}
                                className="flex-shrink-0 rounded-xl px-3 py-2 text-xs font-bold text-white"
                                style={{ background: '#10b981' }}>
                                <Check size={14} />
                              </button>
                            </div>
                          ) : (
                            <p className="cursor-text text-sm font-medium leading-relaxed"
                              style={{ 
                                color: 'var(--text-primary)',
                                fontSize: fontSize,
                                fontFamily: fontFamily === 'System Default' ? 'inherit' : `"${fontFamily}", sans-serif`
                              }}
                              onClick={() => startEdit(i)}>
                              {seg.text}
                            </p>
                          )}
                        </div>

                        {/* Actions — Visible on touch devices, hover-triggered on desktop */}
                        <div className="flex flex-row sm:flex-col gap-1.5 justify-end sm:justify-start opacity-100 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100">
                          <button onClick={() => toggleHighlight(i)}
                            className="rounded-lg p-1.5 text-xs font-bold transition-colors"
                            style={seg.highlighted ? {
                              background: 'color-mix(in srgb, #f59e0b 15%, var(--bg-subtle))',
                              color: '#f59e0b',
                            } : {
                              color: 'var(--text-muted)',
                            }}>
                            ★
                          </button>
                          <button onClick={() => startEdit(i)}
                            className="rounded-lg p-1.5 transition-colors"
                            style={{ color: 'var(--text-muted)' }}>
                            <Edit3 size={12} />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Usage Overview Row */}
          <div className="space-y-4 pt-2 text-left">
            <h3 className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Usage Overview</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {/* Files Transcribed Today */}
              <div className="glass-card rounded-2xl p-4.5 border border-slate-200 dark:border-white/5 bg-white/40 dark:bg-[#111827]/40 flex flex-col justify-between min-h-[105px]">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Files Transcribed</span>
                    <h4 className="text-xl font-black text-slate-900 dark:text-white mt-1">{attHistory.length}</h4>
                  </div>
                  <div className="h-7 w-7 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-500 flex-shrink-0">
                    <FileAudio size={14} />
                  </div>
                </div>
                <div className="text-[9px] text-slate-400 dark:text-slate-500 font-bold mt-2.5">
                  Total audio uploads
                </div>
              </div>

              {/* Minutes Transcribed */}
              <div className="glass-card rounded-2xl p-4.5 border border-slate-200 dark:border-white/5 bg-white/40 dark:bg-[#111827]/40 flex flex-col justify-between min-h-[105px]">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Minutes Transcribed</span>
                    <h4 className="text-xl font-black text-slate-900 dark:text-white mt-1">{(billingOverview?.usage?.audio_minutes_used || 0).toFixed(1)} mins</h4>
                  </div>
                  <div className="h-7 w-7 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-500 flex-shrink-0">
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
              <div className="glass-card rounded-2xl p-4.5 border border-slate-200 dark:border-white/5 bg-white/40 dark:bg-[#111827]/40 flex flex-col justify-between min-h-[105px]">
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
                  Current Whisper/STT engine
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Banners & Recent Activity */}
        <div className="lg:col-span-1 space-y-6">
          {/* Upload Banner */}
          <div className="relative overflow-hidden rounded-2xl p-5 border border-slate-200 dark:border-white/5 bg-gradient-to-br from-teal-600/10 to-emerald-500/10 dark:from-teal-600/5 dark:to-emerald-500/5 min-h-[120px] flex flex-col justify-center text-left">
            <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />
            <div className="relative z-10">
              <span className="text-[8px] font-black uppercase text-teal-500 dark:text-teal-400 tracking-wider">STT Engine</span>
              <h4 className="font-display text-sm font-black text-slate-950 dark:text-white mt-1 leading-snug">Instant Multi-format</h4>
              <p className="mt-1 text-[10px] text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                High-accuracy local and cloud speech transcription.
              </p>
            </div>
            <FileAudio size={52} className="absolute right-[-10px] bottom-[-10px] opacity-10 text-teal-500" />
          </div>

          {/* Recent Transcriptions Card */}
          <div className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-white/5 bg-white/40 dark:bg-[#111827]/40 space-y-3 text-left">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/5 pb-2">
              <h4 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">Recent files</h4>
              <span className="text-[9px] text-teal-500 dark:text-teal-400 font-bold cursor-pointer hover:underline" onClick={() => fetchBillingOverview()}>Refresh</span>
            </div>

            <div className="space-y-2">
              {attHistory.length === 0 ? (
                <div className="text-center py-6 text-slate-400 dark:text-slate-500 text-[10px] font-medium font-sans">
                  No recent transcriptions.
                </div>
              ) : (
                attHistory.slice(0, 4).map(item => (
                  <div key={item.id} className="p-2.5 rounded-xl bg-slate-100/50 dark:bg-slate-950/20 border border-slate-200 dark:border-white/5 flex items-start gap-3 hover:border-slate-300 dark:hover:border-white/10 transition-colors">
                    <span className="text-[9px] font-black text-teal-600 bg-teal-500/10 rounded px-1.5 py-0.5 mt-0.5">{getFileExt(item.title)}</span>
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
              {attHistory.length === 0 ? (
                <div className="text-center py-4 text-slate-400 dark:text-slate-500 text-[10px] font-medium font-sans">
                  No recent activity.
                </div>
              ) : (
                attHistory.slice(0, 3).map(item => (
                  <div key={item.id} className="relative text-left">
                    <div className="absolute -left-[23px] top-1 h-3 w-3 rounded-full bg-slate-50 dark:bg-[#0B1020] border-2 border-teal-500 flex items-center justify-center z-10" />
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-slate-900 dark:text-white block font-bold truncate max-w-[120px]">{item.title}</span>
                        <span className="text-[9px] text-slate-550 dark:text-slate-400 mt-0.5 block">{item.details}</span>
                      </div>
                      <span className="text-[8px] text-slate-455 dark:text-slate-500 font-mono flex-shrink-0">{item.timestamp}</span>
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
