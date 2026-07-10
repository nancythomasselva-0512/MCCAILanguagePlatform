import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Download, Edit3, Check, Copy, RefreshCw,
  Clock, AlertCircle, CheckCircle2, FileAudio, X, Cpu, ChevronDown, Trash2,
  Award, Activity, MoreVertical, FileText
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
  const { history, clearHistory, billingOverview, addHistoryItem, openAiApiKey, fetchBillingOverview } = useApp();
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
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<any>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const xhrRef = useRef<XMLHttpRequest | null>(null);

  const checkBackend = async () => {
    setBackendStatus('checking');
    try {
      const res = await fetch('/api/health');
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
          xhr.open('POST', '/api/transcribe', true);
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
          const fullText = formatted.map(s => s.text).join(' ');
          addHistoryItem('audio-transcription', file.name, `Faster-Whisper${langInfo} · ${totalWords} words`, fullText);
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
      addHistoryItem('audio-transcription', file.name, `Platform STT · ${totalWords} words`, text);
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
    <div className="space-y-6 w-full animate-fadeIn max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="mb-6 text-left">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
          <FileAudio className="text-teal-500" size={24} />
          Audio to Text
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 font-medium">
          Upload audio files to transcribe into structured text
        </p>
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Forms & Overview */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Configuration (only when idle) */}
          {processState === 'idle' && (
            <div className="bg-white dark:bg-[#111827] rounded-[16px] p-5 shadow-sm border border-slate-100 dark:border-white/5 grid gap-4 sm:grid-cols-2">
              <div className="w-full text-left">
                <label className="mb-2 block text-xs font-bold text-teal-800 dark:text-teal-400 uppercase tracking-wide">Language</label>
                <div className="relative">
                  <select id="att-lang-select" value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="w-full appearance-none bg-white dark:bg-[#0a1120] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 text-[11px] font-semibold rounded-lg px-3 py-2.5 pr-8 focus:outline-none">
                    {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
                  </select>
                  <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div className="w-full text-left">
                <label className="mb-2 block text-xs font-bold text-teal-800 dark:text-teal-400 uppercase tracking-wide">
                  Model Size
                  {backendStatus !== 'connected' && (
                    <span className="ml-2 text-teal-500 normal-case font-medium">(Server only)</span>
                  )}
                </label>
                <div className="relative">
                  <select id="att-model-select" value={modelSize}
                    onChange={(e) => setModelSize(e.target.value)}
                    disabled={backendStatus !== 'connected'}
                    className="w-full appearance-none bg-white dark:bg-[#0a1120] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 text-[11px] font-semibold rounded-lg px-3 py-2.5 pr-8 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed">
                    {MODELS.map(m => <option key={m.code} value={m.code}>{m.label}</option>)}
                  </select>
                  <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>
          )}

          {/* Upload Area */}
          {processState === 'idle' && (
            <div
              id="att-upload-area"
              className={`bg-white dark:bg-[#111827] rounded-[16px] p-6 sm:p-14 flex flex-col items-center justify-center text-center cursor-pointer shadow-sm border border-slate-100 dark:border-white/5 transition-all ${isDragOver ? 'border-teal-400 bg-teal-50 dark:bg-teal-900/10' : ''}`}
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
              <div className={`mb-5 flex h-20 w-20 items-center justify-center rounded-2xl transition-colors bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400`}>
                <FileAudio size={34} />
              </div>
              <p className="text-base font-bold text-slate-800 dark:text-slate-200">
                {isDragOver ? 'Drop your audio file here' : 'Drag & drop your audio file'}
              </p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">or click to browse from your device</p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {['MP3', 'WAV', 'M4A', 'OGG', 'FLAC'].map(fmt => (
                  <span key={fmt} className="rounded-full px-3 py-1 text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
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
                className="bg-white dark:bg-[#111827] rounded-[16px] shadow-sm border border-slate-100 dark:border-white/5 p-6">
                <div className="flex items-center gap-4 mb-5">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400">
                    {processState === 'error' ? <AlertCircle size={20} className="text-red-500" /> : <FileAudio size={20} />}
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="truncate text-sm font-bold text-slate-800 dark:text-slate-200">{fileName || 'Audio File'}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {processState === 'decoding' && 'Decoding audio and resampling to 16kHz…'}
                      {processState === 'downloading' && (
                        backendStatus === 'connected'
                          ? `Uploading to Faster-Whisper server… (${uploadProgress}%)`
                          : `Downloading AI model files… (${modelProgress}%)`
                      )}
                      {processState === 'processing' && 'Running speech recognition…'}
                      {processState === 'error' && <span className="text-red-500">{errorMsg || 'An error occurred during transcription.'}</span>}
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
                    <div className="mb-1.5 flex justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span className="truncate max-w-[260px]">
                        {backendStatus === 'connected' ? 'Uploading…' : (downloadingFile || 'Model files')}
                      </span>
                      <span>{backendStatus === 'connected' ? uploadProgress : modelProgress}%</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                      <div className="h-full rounded-full bg-teal-500 transition-all duration-300"
                        style={{ width: `${backendStatus === 'connected' ? uploadProgress : modelProgress}%` }} />
                    </div>
                  </div>
                )}

                {processState === 'processing' && (
                  <div className="mb-4">
                    <div className="mb-1.5 flex justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span>AI Transcription</span>
                      <span>{backendStatus === 'connected' ? 'Processing…' : `${Math.round(transcribeProgress)}%`}</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                      <div
                        className={`h-full rounded-full bg-teal-500 ${backendStatus === 'connected' ? 'w-full animate-pulse' : 'transition-all'}`}
                        style={backendStatus === 'connected' ? {} : { width: `${transcribeProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Skeleton shimmer */}
                {processState !== 'error' && (
                  <div className="space-y-2 mt-4">
                    {[90, 70, 80, 55].map((w, i) => (
                      <div key={i} className="shimmer h-3 rounded-full bg-slate-100 dark:bg-slate-800" style={{ width: `${w}%` }} />
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
                {/* Toolbar */}
                <div className="bg-white dark:bg-[#111827] rounded-[16px] shadow-sm border border-slate-100 dark:border-white/5 p-4 sm:px-5 sm:py-3.5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex flex-wrap items-center gap-2.5 text-xs sm:text-sm">
                    <CheckCircle2 size={14} className="text-teal-500 animate-pulse" />
                    <span className="font-semibold text-left text-slate-800 dark:text-slate-200">{fileName}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-50 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400">
                      {backendStatus === 'connected' ? 'Faster-Whisper' : 'Local Whisper'}
                    </span>
                    <span className="text-xs text-left text-slate-500 dark:text-slate-400">
                      {segments.length} segments · {segments.reduce((a, s) => a + s.text.split(' ').length, 0)} words
                    </span>

                    {/* View Mode Toggle */}
                    <div className="flex rounded-lg bg-slate-100 dark:bg-[#0a1120] p-0.5 border border-slate-200 dark:border-white/10 ml-1">
                      <button
                        onClick={() => setViewMode('segmented')}
                        className={`rounded-md px-2.5 py-1 text-[10px] font-extrabold transition-all duration-200 cursor-pointer ${
                          viewMode === 'segmented'
                            ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 shadow-sm'
                            : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                        }`}
                      >
                        Segments
                      </button>
                      <button
                        onClick={() => setViewMode('paragraph')}
                        className={`rounded-md px-2.5 py-1 text-[10px] font-extrabold transition-all duration-200 cursor-pointer ${
                          viewMode === 'paragraph'
                            ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 shadow-sm'
                            : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
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
                          className="appearance-none rounded-lg px-2.5 pr-7 py-1 text-[10px] font-extrabold focus:outline-none bg-slate-100 dark:bg-[#0a1120] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200">
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
                        <ChevronDown size={11} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-500" />
                      </div>
                      <div className="relative">
                        <select value={fontSize}
                          onChange={(e) => setFontSize(e.target.value)}
                          className="appearance-none rounded-lg px-2.5 pr-7 py-1 text-[10px] font-extrabold focus:outline-none bg-slate-100 dark:bg-[#0a1120] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200">
                          <option value="12px">12</option>
                          <option value="14px">14</option>
                          <option value="16px">16</option>
                          <option value="18px">18</option>
                          <option value="20px">20</option>
                          <option value="22px">22</option>
                          <option value="24px">24</option>
                        </select>
                        <ChevronDown size={11} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-500" />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 w-full md:w-auto md:justify-end">
                    <button onClick={reset} className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 transition-colors">
                      <RefreshCw size={11} /> New File
                    </button>
                    <button id="att-copy-btn" onClick={handleCopy}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 transition-colors">
                      {copied ? <Check size={12} className="text-teal-500" /> : <Copy size={12} />}
                      {copied ? 'Copied!' : 'Copy All'}
                    </button>
                    <button id="att-download-btn" onClick={handleDownload}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-sm transition-colors">
                      <Download size={12} /> Download .txt
                    </button>
                  </div>
                </div>

                {viewMode === 'paragraph' ? (
                  <div 
                    className="bg-white dark:bg-[#111827] rounded-[16px] shadow-sm border border-slate-100 dark:border-white/5 p-6 text-sm font-semibold leading-relaxed text-left whitespace-pre-wrap select-text" 
                    style={{ 
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
                            className="rounded-lg px-2.5 py-1 text-sm focus:outline-none w-64 md:w-80 h-10 border border-teal-500 resize-none bg-slate-50 dark:bg-[#0a1120] text-slate-800 dark:text-slate-200"
                            onKeyDown={(e) => { 
                              if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); saveEdit(); }
                              if (e.key === 'Escape') setEditingIndex(null);
                            }}
                            onBlur={saveEdit}
                          />
                          <button onClick={saveEdit}
                            className="rounded-lg p-1.5 text-xs font-bold text-white bg-teal-500 hover:bg-teal-600 transition-colors">
                            <Check size={13} />
                          </button>
                        </span>
                      ) : (
                        <span 
                          key={idx}
                          className="inline transition-all duration-200 cursor-pointer hover:text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/30 px-1 py-0.5 rounded"
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
                  <div className="bg-white dark:bg-[#111827] rounded-[16px] shadow-sm border border-slate-100 dark:border-white/5 overflow-hidden">
                    {segments.map((seg, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className="group flex flex-col sm:flex-row gap-3 p-4 transition-colors border-b border-slate-100 dark:border-white/5 last:border-b-0"
                        style={{
                          background: seg.highlighted
                            ? 'var(--bg-highlight)'
                            : i % 2 === 1 ? 'var(--bg-subtle)' : 'var(--bg-card)',
                        }}
                      >
                        {/* Timestamp */}
                        <div className="flex-shrink-0 pt-0.5 text-left">
                          <span className="inline-flex items-center gap-1 rounded-lg px-2 py-0.5 font-mono text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
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
                                className="flex-1 resize-none rounded-xl px-3 py-2 text-sm focus:outline-none bg-slate-50 dark:bg-slate-900 border border-teal-500 text-slate-800 dark:text-slate-200"
                                onKeyDown={(e) => { 
                                  if (e.key === 'Enter' && e.ctrlKey) saveEdit(); 
                                  if (e.key === 'Escape') setEditingIndex(null);
                                }}
                              />
                              <button onClick={saveEdit}
                                className="flex-shrink-0 rounded-xl px-3 py-2 text-xs font-bold text-white bg-teal-500">
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
                            className={`rounded-lg p-1.5 text-xs font-bold transition-colors ${seg.highlighted ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30' : 'text-slate-400 hover:text-slate-600'}`}>
                            ★
                          </button>
                          <button onClick={() => startEdit(i)}
                            className="rounded-lg p-1.5 transition-colors text-slate-400 hover:text-slate-600">
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
        </div>

        {/* Right Column */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex items-center justify-between px-1 mb-2">
            <h3 className="text-sm font-black text-slate-800 dark:text-slate-200 uppercase tracking-wide">Recent History</h3>
            <button className="text-[11px] font-bold text-teal-700 dark:text-teal-400 hover:text-teal-800 transition-colors">View all</button>
          </div>

          <div className="space-y-3">
            {attHistory.length === 0 ? (
              <div className="bg-white dark:bg-[#111827] rounded-[16px] p-6 text-center text-slate-500 text-sm font-medium border border-slate-100 dark:border-white/5">
                No recent history.
              </div>
            ) : (
              attHistory.slice(0, 5).map((item, idx) => {
                return (
                  <div key={item.id} className="bg-white dark:bg-[#111827] rounded-[16px] p-4 flex items-center gap-4 shadow-sm border border-slate-100 dark:border-white/5">
                    <button className="h-10 w-10 flex-shrink-0 rounded-full bg-[#e6f4f1] dark:bg-teal-900/30 flex items-center justify-center text-[#10a37f] dark:text-teal-400 hover:bg-teal-100 transition-colors">
                      <FileAudio size={16} className="fill-current ml-0.5" />
                    </button>
                    <div 
                      className="flex-1 min-w-0 cursor-pointer group text-left"
                      onClick={() => setSelectedHistoryItem(item)}
                    >
                      <p className="text-[13px] font-bold text-slate-800 dark:text-slate-200 truncate leading-snug group-hover:text-teal-600 transition-colors">{item.title}</p>
                      <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 truncate mt-1">
                        {item.details.split(' · ')[0]} • {item.timestamp}
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
                  <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 uppercase tracking-wide truncate max-w-[250px]">
                    {selectedHistoryItem.title}
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
                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-sans text-left">
                  {selectedHistoryItem.content || "Transcription content unavailable."}
                </p>
              </div>
              <div className="p-4 border-t border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-slate-900 text-xs font-medium text-slate-500 flex justify-between">
                <span>{selectedHistoryItem.details.split(' · ')[0]}</span>
                <span>Created: {selectedHistoryItem.timestamp}</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
