import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Download, Edit3, Check, Copy, RefreshCw,
  Clock, AlertCircle, CheckCircle2, FileAudio, X, Cpu, ChevronDown
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getTranscriber, decodeAudioFile } from '../../utils/transcribeHelper';

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
  const { addHistoryItem } = useApp();
  const [processState, setProcessState] = useState<ProcessState>('idle');
  const [modelProgress, setModelProgress] = useState(0);
  const [downloadingFile, setDownloadingFile] = useState('');
  const [transcribeProgress, setTranscribeProgress] = useState(0);
  const [segments, setSegments] = useState<TranscriptSegment[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
  const [fileName, setFileName] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [copied, setCopied] = useState(false);
  const [backendStatus, setBackendStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const [selectedLanguage, setSelectedLanguage] = useState('auto');
  const [modelSize, setModelSize] = useState('base');
  const [uploadProgress, setUploadProgress] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

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

    if (backendStatus === 'connected') {
      // Faster-Whisper server path
      try {
        setProcessState('downloading');
        const formData = new FormData();
        formData.append('file', file);
        formData.append('model', modelSize);
        formData.append('language', selectedLanguage);

        const xhr = new XMLHttpRequest();
        const responseData = await new Promise<any>((resolve, reject) => {
          xhr.open('POST', 'http://127.0.0.1:8000/api/transcribe', true);
          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) setUploadProgress(Math.round((event.loaded / event.total) * 100));
          };
          xhr.onload = () => {
            if (xhr.status === 200) {
              try { resolve(JSON.parse(xhr.responseText)); }
              catch { reject(new Error('Invalid server response.')); }
            } else {
              try { reject(new Error(JSON.parse(xhr.responseText).detail || `Server error ${xhr.status}`)); }
              catch { reject(new Error(`Server error ${xhr.status}`)); }
            }
          };
          xhr.onerror = () => reject(new Error('Connection error. Ensure the Python server is running.'));
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
        setErrorMsg(err.message || 'Server transcription failed.');
        setProcessState('error');
      }
      return;
    }

    // Browser fallback path
    try {
      setProcessState('decoding');
      const audioData = await decodeAudioFile(file);

      setProcessState('downloading');
      const transcriber = await getTranscriber((data) => {
        if (data.status === 'downloading') {
          setModelProgress(data.progress);
          if (data.file) setDownloadingFile(data.file.split('/').pop() || data.file);
        }
      });

      setProcessState('processing');
      setTranscribeProgress(20);

      const progressTimer = setInterval(() => {
        setTranscribeProgress(p => p < 90 ? p + 2 : p);
      }, 500);

      const result = await transcriber(audioData, {
        chunk_length_s: 30,
        stride_length_s: 5,
        return_timestamps: true,
      });

      clearInterval(progressTimer);
      setTranscribeProgress(100);

      let formatted: TranscriptSegment[] = [];
      if (result.chunks?.length) {
        formatted = result.chunks.map((chunk: any) => ({
          timestamp: formatSeconds(chunk.timestamp?.[0] ?? 0),
          text: chunk.text.trim(),
          highlighted: false,
        })).filter((s: any) => s.text.length > 0);
      }
      if (!formatted.length && result.text) {
        formatted = [{ timestamp: '00:00', text: result.text.trim(), highlighted: false }];
      }

      setSegments(formatted);
      setProcessState('done');
      const totalWords = formatted.reduce((a, s) => a + s.text.split(' ').length, 0);
      addHistoryItem('audio-transcription', file.name, `Local AI · ${totalWords} words`);
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

  const fullTranscript = segments.map(s => `[${s.timestamp}] ${s.text}`).join('\n\n');

  const handleCopy = () => {
    navigator.clipboard.writeText(fullTranscript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([fullTranscript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName || 'transcript'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setProcessState('idle');
    setSegments([]);
    setFileName('');
    setModelProgress(0);
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

      {/* Configuration (only when idle) — Grid layout for clean responsiveness */}
      {processState === 'idle' && (
        <div className="app-card rounded-2xl p-4 grid gap-3 sm:grid-cols-2">
          <div className="w-full">
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

          <div className="w-full">
            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
              Model Size
              {backendStatus !== 'connected' && (
                <span className="ml-2 text-amber-500 normal-case font-medium">(Server only)</span>
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

      {/* Progress State */}
      <AnimatePresence>
        {(['decoding', 'downloading', 'processing'] as ProcessState[]).includes(processState) && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="app-card rounded-2xl p-6">
            <div className="flex items-center gap-4 mb-5">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl"
                style={{ background: 'var(--accent-subtle)', color: 'var(--accent)' }}>
                <FileAudio size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{fileName}</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  {processState === 'decoding' && 'Decoding audio and resampling to 16kHz…'}
                  {processState === 'downloading' && (
                    backendStatus === 'connected'
                      ? `Uploading to Faster-Whisper server… (${uploadProgress}%)`
                      : `Downloading AI model files… (${modelProgress}%)`
                  )}
                  {processState === 'processing' && 'Running speech recognition…'}
                </p>
              </div>
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
                  <div className="h-full rounded-full bg-blue-500 transition-all duration-300"
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
            <div className="space-y-2 mt-4">
              {[90, 70, 80, 55].map((w, i) => (
                <div key={i} className="shimmer h-3 rounded-full" style={{ width: `${w}%` }} />
              ))}
            </div>
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
              <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
                <CheckCircle2 size={14} className="text-emerald-500" />
                <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{fileName}</span>
                <span className="badge badge-success">
                  {backendStatus === 'connected' ? 'Faster-Whisper' : 'Local Whisper'}
                </span>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  {segments.length} segments · {segments.reduce((a, s) => a + s.text.split(' ').length, 0)} words
                </span>
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

            {/* Segment list */}
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
                  <div className="flex-shrink-0 pt-0.5">
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
                  <div className="flex-1 min-w-0">
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
                          onKeyDown={(e) => { if (e.key === 'Enter' && e.ctrlKey) saveEdit(); }}
                        />
                        <button onClick={saveEdit}
                          className="flex-shrink-0 rounded-xl px-3 py-2 text-xs font-bold text-white"
                          style={{ background: '#10b981' }}>
                          <Check size={14} />
                        </button>
                      </div>
                    ) : (
                      <p className="cursor-text text-sm font-medium leading-relaxed"
                        style={{ color: 'var(--text-primary)' }}
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
