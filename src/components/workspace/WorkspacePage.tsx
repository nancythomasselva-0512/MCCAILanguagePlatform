import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic, Volume2, Languages, FileAudio,
  History, Trash2, ChevronRight, Clock, X, Settings, ShieldCheck, Key, Menu
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { ActiveTabType } from '../../context/AppContext';
import { VoiceToText } from '../tools/VoiceToText';
import { TextToVoice } from '../tools/TextToVoice';
import { TextTranslation } from '../tools/TextTranslation';
import { AudioToText } from '../tools/AudioToText';

const TABS: {
  id: ActiveTabType;
  label: string;
  shortLabel: string;
  icon: React.ReactNode;
  activeColor: string;
}[] = [
  { id: 'voice-to-text',     label: 'Transcription',  shortLabel: 'Record',      icon: <Mic size={16} />,      activeColor: '#3b82f6' },
  { id: 'text-to-speech',    label: 'Text to Voice',  shortLabel: 'Voice',       icon: <Volume2 size={16} />,  activeColor: '#8b5cf6' },
  { id: 'translation',       label: 'Translation',    shortLabel: 'Translate',   icon: <Languages size={16} />,activeColor: '#10b981' },
  { id: 'audio-transcription',label: 'Audio to Text', shortLabel: 'Audio',       icon: <FileAudio size={16} />,activeColor: '#f59e0b' },
];

const TYPE_LABELS: Record<ActiveTabType, string> = {
  'voice-to-text': 'Voice to Text',
  'text-to-speech': 'Text to Voice',
  'translation': 'Translation',
  'audio-transcription': 'Audio to Text',
};

const TYPE_COLORS: Record<ActiveTabType, string> = {
  'voice-to-text': '#3b82f6',
  'text-to-speech': '#8b5cf6',
  'translation': '#10b981',
  'audio-transcription': '#f59e0b',
};

export const WorkspacePage: React.FC = () => {
  const { activeTab, setActiveTab, history, clearHistory, deleteHistoryItem, openAiApiKey, setOpenAiApiKey, detectedLang } = useApp();
  const [historyOpen, setHistoryOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false); // mobile sidebar
  const [tempKey, setTempKey] = useState(openAiApiKey);

  const ActiveTool = {
    'voice-to-text': VoiceToText,
    'text-to-speech': TextToVoice,
    'translation': TextTranslation,
    'audio-transcription': AudioToText,
  }[activeTab];

  const handleSaveSettings = () => {
    setOpenAiApiKey(tempKey);
    setSettingsOpen(false);
  };

  const currentTab = TABS.find(t => t.id === activeTab)!;

  return (
    <div className="flex min-h-[calc(100vh-64px)] sm:min-h-[calc(100vh-96px)] flex-col" style={{ background: 'var(--bg-base)' }}>

      {/* ── Settings Modal ── */}
      <AnimatePresence>
        {settingsOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setSettingsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 32 }}
              transition={{ duration: 0.22, type: 'spring', stiffness: 300, damping: 30 }}
              className="relative w-full sm:max-w-md overflow-hidden rounded-t-3xl sm:rounded-2xl p-6"
              style={{ background: 'var(--bg-elevated)', zIndex: 10 }}
            >
              {/* Mobile drag handle */}
              <div className="mx-auto mb-5 h-1 w-10 rounded-full sm:hidden" style={{ background: 'var(--border-strong)' }} />

              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: 'var(--accent-subtle)' }}>
                    <Settings size={15} style={{ color: 'var(--accent)' }} />
                  </div>
                  <h3 className="font-display text-base font-bold" style={{ color: 'var(--text-primary)' }}>Workspace Settings</h3>
                </div>
                <button onClick={() => setSettingsOpen(false)} className="rounded-lg p-1.5 transition-colors hover:opacity-70" style={{ color: 'var(--text-muted)' }}>
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                    <Key size={10} /> OpenAI API Key
                  </label>
                  <input
                    type="password"
                    value={tempKey}
                    onChange={(e) => setTempKey(e.target.value)}
                    placeholder="sk-proj-..."
                    className="glass-input w-full rounded-xl px-4 py-3 text-sm"
                  />
                  <p className="mt-2 text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                    Used for high-accuracy Whisper transcription. Stored locally in your browser only.
                  </p>
                </div>
                <div className="flex items-start gap-2 rounded-xl p-3 text-xs" style={{
                  background: 'color-mix(in srgb, #10b981 8%, var(--bg-card))',
                  border: '1px solid color-mix(in srgb, #10b981 20%, transparent)',
                  color: '#10b981',
                }}>
                  <ShieldCheck size={14} className="flex-shrink-0 mt-0.5" />
                  <span>Your API key is sent directly to OpenAI. We never store it.</span>
                </div>
              </div>

              <div className="mt-5 flex gap-3">
                <button onClick={() => setSettingsOpen(false)} className="btn-ghost flex-1 rounded-xl py-2.5 text-sm">Cancel</button>
                <button id="settings-save-btn" onClick={handleSaveSettings} className="btn-primary flex-1 rounded-xl py-2.5 text-sm">Save Changes</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Mobile Top Bar (replaces tab bar) ── */}
      <div
        className="flex items-center gap-3 px-4 py-3 sm:hidden"
        style={{ borderBottom: '1px solid var(--border-base)', background: 'var(--bg-card)' }}
      >
        {/* Hamburger / sidebar toggle */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg transition-colors"
          style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-base)', color: 'var(--text-secondary)' }}
          aria-label="Open menu"
        >
          <Menu size={18} />
        </button>

        {/* Current tool indicator */}
        <div className="flex flex-1 items-center gap-2 min-w-0">
          <span
            className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg"
            style={{
              background: `color-mix(in srgb, ${currentTab.activeColor} 15%, var(--bg-subtle))`,
              color: currentTab.activeColor,
            }}
          >
            {currentTab.icon}
          </span>
          <span className="truncate text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{currentTab.label}</span>
        </div>

        {/* Quick actions */}
        <div className="flex flex-shrink-0 items-center gap-2">
          <button
            onClick={() => setHistoryOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors"
            style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-base)', color: 'var(--text-secondary)' }}
            aria-label="History"
          >
            <History size={16} />
          </button>
          <button
            onClick={() => setSettingsOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors"
            style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-base)', color: 'var(--text-secondary)' }}
            aria-label="Settings"
          >
            <Settings size={16} />
          </button>
        </div>
      </div>

      {/* ── Mobile Sidebar Overlay ── */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 sm:hidden"
              style={{ background: 'rgba(0,0,0,0.5)' }}
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="fixed left-0 top-0 z-50 flex h-full w-72 flex-col sm:hidden rounded-tr-[32px] rounded-br-[32px] p-4"
              style={{
                background: 'var(--sidebar-panel-bg)',
                borderRight: '1px solid var(--sidebar-panel-border)',
                boxShadow: 'var(--shadow-xl)'
              }}
            >
              {/* Sidebar Header */}
              <div className="flex items-center justify-between px-3 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/20">
                    <span className="text-[9px] font-bold text-white">MCC</span>
                  </div>
                  <span className="text-sm font-bold text-white">AI Tools</span>
                </div>
                <button onClick={() => setSidebarOpen(false)} className="rounded-lg p-1.5 hover:bg-white/10" style={{ color: '#ffffff' }}>
                  <X size={18} />
                </button>
              </div>

              {/* Sidebar Nav */}
              <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
                {TABS.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <motion.button
                      key={tab.id}
                      onClick={() => { setActiveTab(tab.id); setSidebarOpen(false); }}
                      className="nav-item relative overflow-hidden"
                      whileTap={{ scale: 0.97 }}
                      style={{
                        color: isActive ? 'var(--sidebar-panel-text-active)' : 'var(--sidebar-panel-text)',
                      }}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="mobileActiveTabBg"
                          className="absolute inset-0 rounded-xl"
                          style={{
                            background: 'var(--sidebar-panel-active-bg)',
                            zIndex: 0,
                          }}
                          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                        />
                      )}
                      <span className="nav-icon relative z-10" style={isActive ? {
                        background: 'transparent',
                        color: 'var(--sidebar-panel-text-active)',
                      } : { color: 'inherit' }}>
                        {tab.icon}
                      </span>
                      <span className="flex-1 text-left relative z-10">{tab.label}</span>
                      {isActive && <ChevronRight size={12} className="relative z-10" style={{ color: 'var(--sidebar-panel-text-active)', opacity: 0.7 }} />}
                    </motion.button>
                  );
                })}

                <div className="my-2" style={{ height: '1px', background: 'rgba(255,255,255,0.1)' }} />

                <motion.button
                  onClick={() => { setHistoryOpen(true); setSidebarOpen(false); }}
                  className="nav-item"
                  whileTap={{ scale: 0.97 }}
                  style={{ color: 'var(--sidebar-panel-text)' }}
                >
                  <span className="nav-icon" style={{ color: 'inherit' }}><History size={16} /></span>
                  <span>History</span>
                </motion.button>
                <motion.button
                  onClick={() => { setSettingsOpen(true); setSidebarOpen(false); }}
                  className="nav-item"
                  whileTap={{ scale: 0.97 }}
                  style={{ color: 'var(--sidebar-panel-text)' }}
                >
                  <span className="nav-icon" style={{ color: 'inherit' }}><Settings size={16} /></span>
                  <span>Settings</span>
                </motion.button>
              </nav>

              {/* Mobile Sidebar System/Storage Details */}
              <div className="p-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                <div className="rounded-xl p-3.5 space-y-2.5 bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2 text-white/95">
                    <span className="flex h-5 w-5 items-center justify-center rounded bg-white/10 text-xs">
                      ⚙️
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider">System Details</span>
                  </div>
                  <div className="h-1 w-full bg-white/15 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-400 rounded-full" style={{ width: '85%' }} />
                  </div>
                  <div className="flex justify-between text-[9px] text-white/60">
                    <span>Model: Local AI</span>
                    <span>Active</span>
                  </div>
                </div>
              </div>


            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Main layout wrapper ── */}
      <div className="flex w-full flex-1 gap-0">

        {/* ── Desktop Sidebar ── */}
        <aside
          className="hidden w-64 flex-shrink-0 sm:flex sm:flex-col justify-between p-6 rounded-none"
          style={{
            background: 'var(--sidebar-panel-bg)',
            borderRight: '1px solid var(--sidebar-panel-border)',
          }}
        >
          <nav className="space-y-1.5" aria-label="Tool navigation">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <motion.button
                  key={tab.id}
                  id={`workspace-tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className="nav-item relative overflow-hidden"
                  whileTap={{ scale: 0.97 }}
                  style={{
                    color: isActive ? 'var(--sidebar-panel-text-active)' : 'var(--sidebar-panel-text)',
                  }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="desktopActiveTabBg"
                      className="absolute inset-0 rounded-xl"
                      style={{
                        background: 'var(--sidebar-panel-active-bg)',
                        zIndex: 0,
                      }}
                      transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                    />
                  )}
                  <span className="nav-icon relative z-10" style={isActive ? {
                    background: 'transparent',
                    color: 'var(--sidebar-panel-text-active)',
                  } : { color: 'inherit' }}>
                    {tab.icon}
                  </span>
                  <span className="flex-1 text-left relative z-10">{tab.label}</span>
                  {isActive && <ChevronRight size={12} className="relative z-10" style={{ color: 'var(--sidebar-panel-text-active)', opacity: 0.7 }} />}
                </motion.button>
              );
            })}

            <div className="my-2" style={{ height: '1px', background: 'rgba(255,255,255,0.1)' }} />

            <motion.button
              onClick={() => setHistoryOpen(true)}
              className="nav-item"
              whileTap={{ scale: 0.97 }}
              style={{ color: 'var(--sidebar-panel-text)' }}
            >
              <span className="nav-icon" style={{ color: 'inherit' }}><History size={16} /></span>
              <span>History</span>
            </motion.button>
            <motion.button
              onClick={() => setSettingsOpen(true)}
              className="nav-item"
              whileTap={{ scale: 0.97 }}
              style={{ color: 'var(--sidebar-panel-text)' }}
            >
              <span className="nav-icon" style={{ color: 'inherit' }}><Settings size={16} /></span>
              <span>Settings</span>
            </motion.button>
          </nav>

          <div className="pt-4 space-y-4">
            {detectedLang && (
              <div className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-[10px] font-semibold bg-white/10 text-white border border-white/10">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Detected: {detectedLang}
              </div>
            )}

            {/* System Details box mimicking Storage Details in Drive */}
            <div className="rounded-xl p-3.5 space-y-2.5 bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 text-white/95">
                <span className="flex h-5 w-5 items-center justify-center rounded bg-white/10 text-xs">
                  ⚙️
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider">System Details</span>
              </div>
              <div className="h-1 w-full bg-white/15 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400 rounded-full" style={{ width: '85%' }} />
              </div>
              <div className="flex justify-between text-[9px] text-white/60">
                <span>Model: Local AI</span>
                <span>Active</span>
              </div>
            </div>
          </div>
        </aside>

        {/* ── Main Content ── */}
        <main className="flex-1 min-w-0 px-4 py-6 sm:px-8 sm:py-8 lg:px-12 lg:py-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
            >
              <ActiveTool />
            </motion.div>
          </AnimatePresence>
        </main>

        {/* ── History Drawer ── */}
        <AnimatePresence>
          {historyOpen && (
            <>
              {/* Backdrop — always visible when open on mobile, click-away on desktop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-30"
                style={{ background: 'rgba(0,0,0,0.4)' }}
                onClick={() => setHistoryOpen(false)}
              />
              <motion.aside
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', stiffness: 320, damping: 32 }}
                className="fixed right-0 top-0 z-40 flex h-full flex-col"
                style={{
                  width: 'min(88vw, 22rem)',
                  background: 'var(--bg-card)',
                  borderLeft: '1px solid var(--border-base)',
                  boxShadow: 'var(--shadow-xl)',
                }}
              >
                {/* Drawer Header */}
                <div className="flex items-center justify-between px-4 py-3.5 flex-shrink-0" style={{ borderBottom: '1px solid var(--border-base)' }}>
                  <div className="flex items-center gap-2">
                    <History size={14} style={{ color: 'var(--accent)' }} />
                    <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>History</span>
                    {history.length > 0 && (
                      <span className="rounded-full px-1.5 py-0.5 text-[9px] font-bold" style={{ background: 'var(--accent-subtle)', color: 'var(--accent)' }}>
                        {history.length}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    {history.length > 0 && (
                      <button onClick={clearHistory} className="rounded-md px-2 py-1 text-[10px] font-medium transition-colors hover:opacity-70" style={{ color: 'var(--text-muted)' }}>
                        Clear all
                      </button>
                    )}
                    <button onClick={() => setHistoryOpen(false)} className="rounded-md p-1.5 transition-colors hover:opacity-70" style={{ color: 'var(--text-muted)' }}>
                      <X size={15} />
                    </button>
                  </div>
                </div>

                {/* Drawer Content */}
                <div className="flex-1 overflow-y-auto">
                  {history.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full px-4 py-10 text-center">
                      <History size={32} className="mb-3 opacity-20" style={{ color: 'var(--text-muted)' }} />
                      <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>No history yet</p>
                      <p className="mt-1 text-xs" style={{ color: 'var(--text-disabled)' }}>Completed tasks will appear here</p>
                    </div>
                  ) : (
                    <ul>
                      {history.map((item) => (
                        <li
                          key={item.id}
                          className="group flex items-start gap-3 px-4 py-3 transition-colors"
                          style={{ borderBottom: '1px solid var(--border-subtle)' }}
                        >
                          <div className="mt-0.5 flex-shrink-0">
                            <span
                              className="text-[9px] rounded-full px-1.5 py-0.5 font-bold"
                              style={{
                                background: `color-mix(in srgb, ${TYPE_COLORS[item.type]} 12%, var(--bg-subtle))`,
                                color: TYPE_COLORS[item.type],
                                border: `1px solid color-mix(in srgb, ${TYPE_COLORS[item.type]} 25%, transparent)`,
                              }}
                            >
                              {TYPE_LABELS[item.type].split(' ')[0]}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="truncate text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{item.title}</p>
                            <p className="mt-0.5 truncate text-[10px]" style={{ color: 'var(--text-muted)' }}>{item.details}</p>
                            <p className="mt-0.5 flex items-center gap-1 text-[9px]" style={{ color: 'var(--text-disabled)' }}>
                              <Clock size={8} /> {item.timestamp}
                            </p>
                          </div>
                          <button
                            onClick={() => deleteHistoryItem(item.id)}
                            className="mt-0.5 flex-shrink-0 rounded p-1 opacity-0 transition-all group-hover:opacity-100 hover:text-red-500"
                            style={{ color: 'var(--text-disabled)' }}
                          >
                            <Trash2 size={11} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
