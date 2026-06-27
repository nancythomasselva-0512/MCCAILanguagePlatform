import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, FileText, File as FileIcon, X, Check, Globe2, Languages, Type, Copy, Download, RefreshCw, FileUp, Sparkles, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { apiRequest } from '../../utils/api';

const LANGUAGES = [
  "English", "Tamil", "Hindi", "Malayalam", "Kannada", "Telugu", 
  "French", "German", "Spanish", "Japanese", "Chinese"
];

const DocumentIntelligence = () => {
  const { user } = useApp();
  
  // State
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<any>(null);
  const [extractedText, setExtractedText] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("English");
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedText, setTranslatedText] = useState("");
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summary, setSummary] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // File Upload Handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    
    // Check max size (50MB)
    if (selected.size > 50 * 1024 * 1024) {
      setError("File size exceeds 50MB limit");
      return;
    }
    
    setFile(selected);
    setError(null);
    handleUpload(selected);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      if (droppedFile.size > 50 * 1024 * 1024) {
        setError("File size exceeds 50MB limit");
        return;
      }
      setFile(droppedFile);
      setError(null);
      handleUpload(droppedFile);
    }
  };

  const handleUpload = async (fileToUpload: File) => {
    setIsUploading(true);
    setUploadProgress(0);
    setError(null);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setUploadProgress(p => (p < 90 ? p + 10 : p));
    }, 200);

    try {
      const formData = new FormData();
      formData.append("file", fileToUpload);

      const data = await apiRequest('/document/upload', {
        method: 'POST',
        body: formData
      });

      clearInterval(progressInterval);
      setUploadProgress(100);
      
      setDocumentId(data.id);
      setMetadata({
        filename: data.filename,
        filesize: data.filesize,
        pageCount: data.page_count,
        wordCount: data.word_count,
        charCount: data.character_count,
        uploadTime: new Date(data.created_at).toLocaleString()
      });
      setExtractedText(data.extracted_text || "");
      
      // small delay to show 100%
      setTimeout(() => setIsUploading(false), 500);

    } catch (err: any) {
      clearInterval(progressInterval);
      setIsUploading(false);
      setError(err.message || "Failed to upload document");
    }
  };

  const handleTranslate = async () => {
    if (!documentId || !extractedText) return;
    
    setIsTranslating(true);
    try {
      const data = await apiRequest(`/document/${documentId}/translate`, {
        method: 'POST',
        body: JSON.stringify({ target_language: targetLanguage })
      });
      setTranslatedText(data.translated_text);
    } catch (err: any) {
      setError("Translation failed");
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSummarize = async () => {
    if (!documentId || !extractedText) return;
    
    setIsSummarizing(true);
    try {
      const data = await apiRequest(`/document/${documentId}/summarize`, {
        method: 'POST'
      });
      if (data.summary) {
        setSummary(JSON.parse(data.summary));
      }
    } catch (err: any) {
      setError("Summarization failed");
    } finally {
      setIsSummarizing(false);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const downloadText = (text: string, name: string) => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-8 animate-fadeIn flex flex-col min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-black text-slate-900 dark:text-white flex items-center gap-3">
          <FileText className="text-teal-500" size={32} />
          Document Intelligence
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
          Extract, translate, and summarize documents powered by AI.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl flex items-center gap-3 text-red-600 dark:text-red-400">
          <AlertCircle size={20} />
          <span className="font-semibold text-sm">{error}</span>
          <button onClick={() => setError(null)} className="ml-auto hover:bg-red-100 dark:hover:bg-red-900/40 p-1 rounded-full transition-colors">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Upload Section */}
      {!metadata && (
        <div 
          className="border-2 border-dashed border-teal-200 dark:border-teal-800/50 rounded-3xl p-12 text-center bg-teal-50/50 dark:bg-teal-900/10 hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-all cursor-pointer group"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept=".pdf,.doc,.docx,.txt,.csv,.xls,.xlsx,.json"
          />
          <div className="h-20 w-20 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
            <UploadCloud size={32} className="text-teal-500" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Drop your document here</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 max-w-md mx-auto">
            Supports PDF, DOC, DOCX, TXT, CSV, XLS, XLSX, JSON up to 50MB.
          </p>
          <button className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2.5 rounded-full font-bold shadow-lg shadow-teal-500/20 transition-all active:scale-95">
            Browse Files
          </button>

          {isUploading && (
            <div className="mt-8 max-w-md mx-auto">
              <div className="flex justify-between text-xs font-bold text-teal-700 dark:text-teal-400 mb-2">
                <span>Uploading & Extracting...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="h-2 bg-teal-100 dark:bg-teal-900/50 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-all duration-300 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Results Section */}
      {metadata && (
        <div className="space-y-6 animate-slideUp">
          
          {/* Metadata Card */}
          <div className="bg-white dark:bg-slate-800/50 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                <FileIcon size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-lg">{metadata.filename}</h3>
                <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
                  <span className="bg-slate-100 dark:bg-slate-700/50 px-2 py-0.5 rounded-md">{formatSize(metadata.filesize)}</span>
                  <span>{metadata.wordCount.toLocaleString()} Words</span>
                  <span>{metadata.charCount.toLocaleString()} Chars</span>
                  <span>{metadata.uploadTime}</span>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => {
                setMetadata(null);
                setExtractedText("");
                setTranslatedText("");
                setSummary(null);
                setFile(null);
                setDocumentId(null);
              }}
              className="text-sm font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors bg-slate-100 dark:bg-slate-700/50 px-4 py-2 rounded-full"
            >
              Upload Another
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Extracted Text Area */}
            <div className="bg-white dark:bg-slate-800/50 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Type size={18} className="text-teal-500"/>
                  Extracted Text
                </h3>
                <div className="flex gap-2">
                  <button onClick={() => navigator.clipboard.writeText(extractedText)} className="p-1.5 text-slate-400 hover:text-teal-500 transition-colors" title="Copy">
                    <Copy size={16} />
                  </button>
                  <button onClick={() => downloadText(extractedText, 'extracted.txt')} className="p-1.5 text-slate-400 hover:text-teal-500 transition-colors" title="Download TXT">
                    <Download size={16} />
                  </button>
                </div>
              </div>
              <textarea
                value={extractedText}
                onChange={(e) => setExtractedText(e.target.value)}
                className="w-full h-80 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 rounded-2xl p-4 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500/50 resize-none font-medium leading-relaxed"
                placeholder="No text could be extracted..."
              />
            </div>

            {/* Translation Area */}
            <div className="bg-white dark:bg-slate-800/50 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Globe2 size={18} className="text-emerald-500"/>
                  <h3 className="font-bold text-slate-900 dark:text-white">Translation</h3>
                </div>
                <div className="flex items-center gap-2">
                  <select 
                    value={targetLanguage}
                    onChange={(e) => setTargetLanguage(e.target.value)}
                    className="text-xs font-bold bg-slate-100 dark:bg-slate-700/50 border-none rounded-lg px-3 py-1.5 text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                  >
                    {LANGUAGES.map(lang => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))}
                  </select>
                  <button 
                    onClick={handleTranslate}
                    disabled={isTranslating}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold px-4 py-1.5 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
                  >
                    {isTranslating ? <RefreshCw size={14} className="animate-spin" /> : <Languages size={14} />}
                    Translate
                  </button>
                </div>
              </div>
              <textarea
                readOnly
                value={translatedText}
                className="w-full h-80 bg-emerald-50/30 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/30 rounded-2xl p-4 text-sm text-slate-700 dark:text-slate-300 focus:outline-none resize-none font-medium leading-relaxed"
                placeholder="Click translate to view results..."
              />
            </div>
          </div>

          {/* Summary Trigger */}
          {!summary && (
            <div className="flex justify-center mt-8">
              <button 
                onClick={handleSummarize}
                disabled={isSummarizing || !extractedText}
                className="group relative inline-flex items-center justify-center gap-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-4 rounded-full font-black text-lg overflow-hidden transition-transform active:scale-95 shadow-xl disabled:opacity-50"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-emerald-500 opacity-0 group-hover:opacity-10 transition-opacity"></div>
                {isSummarizing ? (
                  <RefreshCw size={24} className="animate-spin" />
                ) : (
                  <Sparkles size={24} className="text-teal-400 group-hover:animate-pulse" />
                )}
                <span>Generate Smart Summary</span>
              </button>
            </div>
          )}

          {/* Summary Card */}
          {summary && (
            <div className="bg-gradient-to-br from-teal-500 to-emerald-600 rounded-3xl p-1 shadow-xl animate-scaleIn mt-8">
              <div className="bg-white dark:bg-slate-900 rounded-[22px] p-6 md:p-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                    <Sparkles className="text-teal-500" />
                    Document Summary
                  </h2>
                  <div className="flex gap-2">
                    <button onClick={() => navigator.clipboard.writeText(JSON.stringify(summary, null, 2))} className="bg-slate-100 dark:bg-slate-800 p-2 rounded-xl text-slate-500 hover:text-teal-500 transition-colors" title="Copy">
                      <Copy size={18} />
                    </button>
                    <button onClick={() => downloadText(JSON.stringify(summary, null, 2), 'summary.txt')} className="bg-slate-100 dark:bg-slate-800 p-2 rounded-xl text-slate-500 hover:text-teal-500 transition-colors" title="Download">
                      <Download size={18} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-xs font-black tracking-widest text-teal-500 uppercase mb-2">Short Summary</h4>
                      <p className="text-slate-700 dark:text-slate-300 font-medium">{summary.short_summary}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-black tracking-widest text-teal-500 uppercase mb-2">Detailed Overview</h4>
                      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{summary.detailed_summary}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-black tracking-widest text-emerald-500 uppercase mb-2">Action Items</h4>
                      <ul className="space-y-2">
                        {summary.action_items?.map((item: string, i: number) => (
                          <li key={i} className="flex gap-2 text-sm text-slate-700 dark:text-slate-300 items-start">
                            <span className="text-emerald-500 font-bold">•</span> {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-100 dark:border-white/5">
                      <h4 className="text-xs font-black tracking-widest text-teal-500 uppercase mb-3">Key Points</h4>
                      <ul className="space-y-3">
                        {summary.key_points?.map((point: string, i: number) => (
                          <li key={i} className="flex gap-3 text-sm text-slate-700 dark:text-slate-300">
                            <div className="h-5 w-5 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-600 flex items-center justify-center flex-shrink-0 text-[10px] font-bold">
                              {i+1}
                            </div>
                            <span className="mt-0.5">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-orange-50 dark:bg-orange-900/10 rounded-2xl p-4 border border-orange-100 dark:border-orange-800/20">
                        <h4 className="text-[10px] font-black tracking-widest text-orange-500 uppercase mb-2">Important Dates</h4>
                        {summary.important_dates?.length ? (
                          <div className="flex flex-wrap gap-2">
                            {summary.important_dates.map((d: string, i: number) => (
                              <span key={i} className="bg-white dark:bg-slate-800 text-xs font-bold px-2 py-1 rounded-md text-slate-700 dark:text-slate-300 shadow-sm border border-orange-100 dark:border-white/5">{d}</span>
                            ))}
                          </div>
                        ) : <span className="text-xs text-slate-400">None found</span>}
                      </div>
                      <div className="bg-blue-50 dark:bg-blue-900/10 rounded-2xl p-4 border border-blue-100 dark:border-blue-800/20">
                        <h4 className="text-[10px] font-black tracking-widest text-blue-500 uppercase mb-2">Key Numbers</h4>
                        {summary.important_numbers?.length ? (
                          <div className="flex flex-wrap gap-2">
                            {summary.important_numbers.map((n: string, i: number) => (
                              <span key={i} className="bg-white dark:bg-slate-800 text-xs font-bold px-2 py-1 rounded-md text-slate-700 dark:text-slate-300 shadow-sm border border-blue-100 dark:border-white/5">{n}</span>
                            ))}
                          </div>
                        ) : <span className="text-xs text-slate-400">None found</span>}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-white/10 flex justify-between items-center">
                  <p className="text-sm font-bold text-slate-500 dark:text-slate-400 max-w-2xl">
                    <span className="text-teal-500">Conclusion:</span> {summary.conclusion}
                  </p>
                  <button onClick={handleSummarize} className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1">
                    <RefreshCw size={12} /> Regenerate
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DocumentIntelligence;
