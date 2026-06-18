import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic, Volume2, Languages, FileAudio,
  History, Trash2, Clock, X, Settings, ShieldCheck, Key, Menu, ArrowLeft, LogOut,
  Activity, Building2, Users, Layers, Server, TrendingUp, CreditCard, Cpu, ShieldAlert, Settings2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { VoiceToText } from '../tools/VoiceToText';
import { TextToVoice } from '../tools/TextToVoice';
import { TextTranslation } from '../tools/TextTranslation';
import { AudioToText } from '../tools/AudioToText';
import { SuperAdminDashboard } from '../admin/SuperAdminDashboard';
import { TenantDashboard } from './TenantDashboard';
import { TenantBilling } from './TenantBilling';
import { Header } from '../common/Header';
import { SidebarMenuNode } from './SidebarMenuNode';
import type { SidebarMenuItem } from './SidebarMenuNode';

const TYPE_LABELS: Record<string, string> = {
  'voice-to-text': 'Voice to Text',
  'text-to-speech': 'Text to Voice',
  'translation': 'Translation',
  'audio-transcription': 'Audio to Text',
  'super-admin-dashboard': 'Super Admin',
  'tenant-dashboard': 'Workspace Settings',
  'sa-overview': 'Dashboard',
  'sa-tenants': 'Tenants',
  'sa-users': 'Users',
  'sa-plans': 'Plans',
  'sa-providers': 'AI Providers',
  'sa-usage': 'Usage Analytics',
  'sa-billing': 'Billing',
  'tenant-billing': 'Billing',
  'sa-ai-logs': 'AI Logs',
  'sa-audit-logs': 'Audit Logs',
  'sa-health': 'System Health',
  'sa-builder': 'Platform Builder',
};

const TYPE_COLORS: Record<string, string> = {
  'voice-to-text': '#3b82f6',
  'text-to-speech': '#8b5cf6',
  'translation': '#10b981',
  'audio-transcription': '#f59e0b',
  'super-admin-dashboard': '#ef4444',
  'tenant-dashboard': '#3b82f6',
  'sa-overview': '#3b82f6',
  'sa-tenants': '#3b82f6',
  'sa-users': '#3b82f6',
  'sa-plans': '#3b82f6',
  'sa-providers': '#3b82f6',
  'sa-usage': '#3b82f6',
  'sa-billing': '#3b82f6',
  'tenant-billing': '#3b82f6',
  'sa-ai-logs': '#3b82f6',
  'sa-audit-logs': '#3b82f6',
  'sa-health': '#3b82f6',
  'sa-builder': '#3b82f6',
};

export const WorkspacePage: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab,
    history, 
    clearHistory, 
    deleteHistoryItem, 
    openAiApiKey, 
    setOpenAiApiKey, 
    setViewMode,
    logout,
    notification,
    setNotification,
    user,
    globalConfig
  } = useApp();
  
  const [historyOpen, setHistoryOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tempKey, setTempKey] = useState(openAiApiKey);

  // Dynamic Sidebar configuration based on RBAC role
  const getSidebarConfig = (): SidebarMenuItem[] => {
    if (user?.role === 'super_admin') {
      return [
        { id: 'sa-overview', label: 'Dashboard', icon: 'Activity', action: 'tab', tabId: 'sa-overview' },
        { id: 'sa-tenants', label: 'Tenants', icon: 'Building2', action: 'tab', tabId: 'sa-tenants' },
        { id: 'sa-users', label: 'Users', icon: 'Users', action: 'tab', tabId: 'sa-users' },
        { id: 'sa-plans', label: 'Plans', icon: 'Layers', action: 'tab', tabId: 'sa-plans' },
        { id: 'sa-providers', label: 'AI Providers', icon: 'Server', action: 'tab', tabId: 'sa-providers' },
        { id: 'sa-usage', label: 'Usage Analytics', icon: 'TrendingUp', action: 'tab', tabId: 'sa-usage' },
        { id: 'sa-billing', label: 'Billing', icon: 'CreditCard', action: 'tab', tabId: 'sa-billing' },
        { id: 'sa-ai-logs', label: 'AI Logs', icon: 'Clock', action: 'tab', tabId: 'sa-ai-logs' },
        { id: 'sa-audit-logs', label: 'Audit Logs', icon: 'ShieldAlert', action: 'tab', tabId: 'sa-audit-logs' },
        { id: 'sa-health', label: 'System Health', icon: 'Cpu', action: 'tab', tabId: 'sa-health' },
        { id: 'sa-builder', label: 'Platform Builder', icon: 'Settings2', action: 'tab', tabId: 'sa-builder' }
      ];
    }

    const items: SidebarMenuItem[] = [
      {
        id: 'speech-tools',
        label: 'Speech Tools',
        icon: 'Volume2',
        children: [
          { id: 'text-to-speech', label: 'Text to Voice', action: 'tab', tabId: 'text-to-speech' },
          { id: 'audio-transcription', label: 'Audio to Text', action: 'tab', tabId: 'audio-transcription' }
        ]
      },
      {
        id: 'voice-to-text',
        label: 'Transcription',
        icon: 'Mic',
        action: 'tab',
        tabId: 'voice-to-text'
      },
      {
        id: 'translation',
        label: 'Translation',
        icon: 'Languages',
        action: 'tab',
        tabId: 'translation'
      }
    ];

    // Add Tenant settings Dashboard for Tenant Admin & Manager roles
    if (user?.role === 'tenant_admin' || user?.role === 'manager') {
      items.push({
        id: 'tenant-dashboard-menu',
        label: 'Workspace Panel',
        icon: 'Settings',
        action: 'tab',
        tabId: 'tenant-dashboard'
      });
      items.push({
        id: 'tenant-billing-menu',
        label: 'Billing',
        icon: 'CreditCard',
        action: 'tab',
        tabId: 'tenant-billing'
      });
    }

    return items;
  };

  const SIDEBAR_CONFIG = getSidebarConfig();

  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('mcc-ai-sidebar-expanded');
    return saved ? JSON.parse(saved) : { 'speech-tools': true };
  });

  const toggleExpanded = (nodeId: string) => {
    setExpanded((prev) => {
      const next = { ...prev, [nodeId]: !prev[nodeId] };
      localStorage.setItem('mcc-ai-sidebar-expanded', JSON.stringify(next));
      return next;
    });
  };

  React.useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification, setNotification]);

  React.useEffect(() => {
    if (activeTab === 'super-admin-dashboard') {
      setActiveTab('sa-overview');
    }
  }, [activeTab, setActiveTab]);

  const handleSaveSettings = () => {
    setOpenAiApiKey(tempKey);
    setSettingsOpen(false);
  };

  const isSuperAdminTab = activeTab.startsWith('sa-');
  const superAdminSubTab = isSuperAdminTab ? (activeTab.replace('sa-', '') as any) : 'overview';

  const getActiveTabMetadata = () => {
    if (activeTab === 'sa-overview') return { label: 'Dashboard', icon: <Activity size={16} />, activeColor: '#3b82f6' };
    if (activeTab === 'sa-tenants') return { label: 'Tenants', icon: <Building2 size={16} />, activeColor: '#3b82f6' };
    if (activeTab === 'sa-users') return { label: 'Users', icon: <Users size={16} />, activeColor: '#3b82f6' };
    if (activeTab === 'sa-plans') return { label: 'Plans', icon: <Layers size={16} />, activeColor: '#3b82f6' };
    if (activeTab === 'sa-providers') return { label: 'AI Providers', icon: <Server size={16} />, activeColor: '#3b82f6' };
    if (activeTab === 'sa-usage') return { label: 'Usage Analytics', icon: <TrendingUp size={16} />, activeColor: '#3b82f6' };
    if (activeTab === 'sa-billing') return { label: 'Billing', icon: <CreditCard size={16} />, activeColor: '#3b82f6' };
    if (activeTab === 'sa-ai-logs') return { label: 'AI Logs', icon: <Clock size={16} />, activeColor: '#3b82f6' };
    if (activeTab === 'sa-audit-logs') return { label: 'Audit Logs', icon: <ShieldAlert size={16} />, activeColor: '#3b82f6' };
    if (activeTab === 'sa-health') return { label: 'System Health', icon: <Cpu size={16} />, activeColor: '#3b82f6' };
    if (activeTab === 'sa-builder') return { label: 'Platform Builder', icon: <Settings2 size={16} />, activeColor: '#3b82f6' };

    return {
      'voice-to-text': { label: 'Transcription', icon: <Mic size={16} />, activeColor: '#3b82f6' },
      'text-to-speech': { label: 'Text to Voice', icon: <Volume2 size={16} />, activeColor: '#8b5cf6' },
      'translation': { label: 'Translation', icon: <Languages size={16} />, activeColor: '#10b981' },
      'audio-transcription': { label: 'Audio to Text', icon: <FileAudio size={16} />, activeColor: '#f59e0b' },
      'super-admin-dashboard': { label: 'Super Admin', icon: <ShieldCheck size={16} />, activeColor: '#ef4444' },
      'tenant-dashboard': { label: 'Workspace settings', icon: <Settings size={16} />, activeColor: '#3b82f6' },
      'tenant-billing': { label: 'Billing', icon: <CreditCard size={16} />, activeColor: '#3b82f6' },
    }[activeTab] || { label: 'Tools', icon: <Volume2 size={16} />, activeColor: '#8b5cf6' };
  };

  const currentTab = getActiveTabMetadata();

  const ActiveTool = isSuperAdminTab 
    ? () => <SuperAdminDashboard subTab={superAdminSubTab} /> 
    : {
        'voice-to-text': VoiceToText,
        'text-to-speech': TextToVoice,
        'translation': TextTranslation,
        'audio-transcription': AudioToText,
        'super-admin-dashboard': SuperAdminDashboard,
        'tenant-dashboard': TenantDashboard,
        'tenant-billing': TenantBilling,
      }[activeTab] || VoiceToText;

  return (
    <div className="flex h-screen w-screen overflow-hidden flex-col sm:flex-row" style={{ background: 'var(--bg-base)' }}>

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

      {/* ── Mobile Top Bar ── */}
      <div
        className="flex items-center gap-3 px-4 py-3 sm:hidden"
        style={{ borderBottom: '1px solid var(--border-base)', background: 'var(--bg-card)' }}
      >
        <button
          onClick={() => setSidebarOpen(true)}
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg transition-colors"
          style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-base)', color: 'var(--text-secondary)' }}
          aria-label="Open menu"
        >
          <Menu size={18} />
        </button>

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

        <div className="flex flex-shrink-0 items-center gap-2">
          {user?.role !== 'super_admin' && (
            <button
              onClick={() => setHistoryOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors"
              style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-base)', color: 'var(--text-secondary)' }}
              aria-label="History"
            >
              <History size={16} />
            </button>
          )}
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
              <div className="flex items-center justify-between px-3 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">{globalConfig?.branding?.platform_name || "MCC AI"} Workstation</span>
                </div>
                <button onClick={() => setSidebarOpen(false)} className="rounded-lg p-1.5 hover:bg-white/10" style={{ color: '#ffffff' }}>
                  <X size={18} />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
                {SIDEBAR_CONFIG.map((item) => (
                  <SidebarMenuNode
                    key={item.id}
                    node={item}
                    expanded={expanded}
                    toggleExpanded={toggleExpanded}
                    onSettingsOpen={() => setSettingsOpen(true)}
                    onSidebarClose={() => setSidebarOpen(false)}
                  />
                ))}

                {user?.role !== 'super_admin' && (
                  <>
                    <div className="my-2" style={{ height: '1px', background: 'rgba(255,255,255,0.1)' }} />
                    <motion.button
                      onClick={() => { setHistoryOpen(true); setSidebarOpen(false); }}
                      className="nav-item text-xs font-semibold"
                      whileTap={{ scale: 0.97 }}
                      style={{ color: 'var(--sidebar-panel-text)' }}
                    >
                      <span className="nav-icon" style={{ color: 'inherit' }}><History size={15} /></span>
                      <span>History</span>
                    </motion.button>
                  </>
                )}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Left Panel: Desktop Sidebar */}
      <aside
        className="hidden w-64 flex-shrink-0 sm:flex sm:flex-col justify-between p-6 rounded-none relative z-10"
        style={{
          background: 'linear-gradient(180deg, #0d1224 0%, #070913 100%)',
          borderRight: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <div className="flex flex-col flex-1">
          <div className="flex items-center gap-2.5 mb-6 select-none">
            <button
              onClick={() => { setViewMode('landing'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white transition-all cursor-pointer hover:scale-105 active:scale-95 flex-shrink-0"
              title="Back to Home"
            >
              <ArrowLeft size={14} />
            </button>
            <div className="flex items-center gap-2 overflow-hidden">
              <img
                src={globalConfig?.branding?.logo_url || "/logo.png"}
                alt="Logo"
                className="h-8 w-8 rounded-full border border-white/20 object-cover flex-shrink-0"
                style={{ height: globalConfig?.branding?.logo_size || "32px", width: globalConfig?.branding?.logo_size || "32px" }}
              />
              <div className="flex flex-col justify-center min-w-0">
                <span className="font-display text-xs font-black tracking-tight leading-none text-white truncate flex items-center gap-0.5">
                  {globalConfig?.branding?.platform_name || "MCC AI"}
                </span>
                <span className="text-[6px] font-bold tracking-[0.15em] uppercase mt-0.5 text-slate-400 truncate">
                  {globalConfig?.branding?.tagline || "Language Platform"}
                </span>
              </div>
            </div>
          </div>

          <nav className="space-y-1.5" aria-label="Tool navigation">
            {SIDEBAR_CONFIG.map((item) => (
              <SidebarMenuNode
                key={item.id}
                node={item}
                expanded={expanded}
                toggleExpanded={toggleExpanded}
                onSettingsOpen={() => setSettingsOpen(true)}
              />
            ))}

            {user?.role !== 'super_admin' && (
              <>
                <div className="my-2" style={{ height: '1px', background: 'rgba(255,255,255,0.08)' }} />
                <motion.button
                  onClick={() => setHistoryOpen(true)}
                  className="nav-item relative text-xs font-semibold"
                  whileTap={{ scale: 0.97 }}
                  style={{ color: 'rgba(255, 255, 255, 0.7)' }}
                >
                  <span className="nav-icon" style={{ color: 'inherit' }}><History size={15} /></span>
                  <span className="flex-grow text-left text-xs">History</span>
                </motion.button>
              </>
            )}
          </nav>

          {user?.role !== 'super_admin' && (
            <div className="relative w-full p-2 mt-6 mb-4 flex items-center justify-center aspect-[4/3] group">
              <div className="absolute w-32 h-32 rounded-full bg-blue-500/20 dark:bg-blue-500/30 blur-2xl pointer-events-none" />
              <img 
                src="/microphone_card_illustration.png" 
                alt="Voice Platform"
                className="h-full w-full object-contain relative z-10 transition-transform duration-300 group-hover:scale-105"
                style={{ 
                  mixBlendMode: 'screen',
                  maskImage: 'radial-gradient(circle, rgba(0,0,0,1) 45%, rgba(0,0,0,0) 85%)',
                  WebkitMaskImage: 'radial-gradient(circle, rgba(0,0,0,1) 45%, rgba(0,0,0,0) 85%)'
                }}
              />
            </div>
          )}
        </div>

        <div className="pt-4 mt-auto">
          <button
            onClick={() => logout()}
            className="w-full flex items-center justify-center gap-2 rounded-xl py-2 px-4 text-xs font-bold text-white border border-white/10 hover:bg-white/5 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
          >
            <LogOut size={13} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Right Panel */}
      <div className="flex-grow h-full flex flex-col min-w-0 overflow-hidden bg-slate-50/20 dark:bg-slate-950/20">
        <Header />

        <main className="flex-grow overflow-y-auto px-4 py-6 sm:px-8 sm:py-8 lg:px-12 lg:py-10">
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

        {/* History Drawer */}
        <AnimatePresence>
          {historyOpen && (
            <>
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

                <div className="flex-1 overflow-y-auto">
                  {history.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full px-4 py-10 text-center">
                      <History size={32} className="mb-3 opacity-20" style={{ color: 'var(--text-muted)' }} />
                      <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>No history yet</p>
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
                              {TYPE_LABELS[item.type]?.split(' ')[0] || item.type}
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

        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="fixed top-6 right-6 z-[9999] flex items-center gap-3 rounded-2xl p-4.5 shadow-2xl border backdrop-blur-md text-white font-sans text-xs max-w-sm"
              style={{
                background: 'rgba(15, 23, 42, 0.95)',
                borderColor: 'rgba(255,255,255,0.1)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
              }}
            >
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-amber-500 text-white font-black text-xs">
                !
              </span>
              <div className="flex-grow text-left">
                <p className="font-bold text-[10px] uppercase tracking-wider text-amber-400 mb-0.5">System Notice</p>
                <p className="text-slate-200 leading-relaxed font-semibold">{notification.message}</p>
              </div>
              <button 
                onClick={() => setNotification(null)} 
                className="flex-shrink-0 p-1 rounded-lg hover:bg-white/15 text-white/40 hover:text-white transition-colors cursor-pointer"
              >
                <X size={14} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
