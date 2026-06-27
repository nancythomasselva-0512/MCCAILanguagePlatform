import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic, Volume2, Languages, FileAudio,
  History, Trash2, Clock, X, Settings, ShieldCheck, Key, Menu, ArrowLeft, LogOut,
  Activity, Building2, Users, Layers, Server, TrendingUp, CreditCard, Cpu, ShieldAlert, Settings2,
  ArrowUpRight, FileText
  , Mail, Globe, Database, Bell, LayoutGrid, ChevronDown, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { VoiceToText } from '../tools/VoiceToText';
import { TextToVoice } from '../tools/TextToVoice';
import { TextTranslation } from '../tools/TextTranslation';
import { AudioToText } from '../tools/AudioToText';
import { SuperAdminDashboard } from '../admin/SuperAdminDashboard';
import { TenantDashboard } from './TenantDashboard';
import { TenantBilling } from './TenantBilling';
import UserDashboard from './UserDashboard';
import DocumentIntelligence from './DocumentIntelligence';
import { SMTPSettings } from '../admin/settings/SMTPSettings';
import { PaymentSettings } from '../admin/settings/PaymentSettings';
import { Header } from '../common/Header';
import { SidebarMenuNode } from './SidebarMenuNode';
import type { SidebarMenuItem } from './SidebarMenuNode';
import { HistoryPage } from './HistoryPage';
import { storage } from "../../utils/storage";


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
  'tenant-settings-smtp': 'SMTP & Email',
  'tenant-settings-payments': 'Payment Gateways',
  'sa-ai-logs': 'AI Logs',
  'sa-audit-logs': 'Audit Logs',
  'sa-health': 'System Health',
  'sa-builder': 'Platform Builder',

  'sa-settings-general': 'General Settings',
  'sa-settings-tenant': 'Tenant Settings',
  'sa-settings-smtp': 'SMTP & Email',
  'sa-settings-auth': 'Authentication',
  'sa-settings-security': 'Security',
  'sa-settings-payments': 'Payment Gateways',
  'sa-settings-domains': 'Domains & Branding',
  'sa-settings-apikeys': 'API Keys',
  'sa-settings-backup': 'Backup & Restore',
  'sa-settings-notifications': 'Notification Center',
  'sa-settings-activity': 'Activity Center',
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
  'tenant-settings-smtp': '#ef4444',
  'tenant-settings-payments': '#ef4444',
  'sa-ai-logs': '#3b82f6',
  'sa-audit-logs': '#3b82f6',
  'sa-health': '#3b82f6',
  'sa-builder': '#3b82f6',

  'sa-settings-general': '#ef4444',
  'sa-settings-tenant': '#ef4444',
  'sa-settings-smtp': '#ef4444',
  'sa-settings-auth': '#ef4444',
  'sa-settings-security': '#ef4444',
  'sa-settings-payments': '#ef4444',
  'sa-settings-domains': '#ef4444',
  'sa-settings-apikeys': '#ef4444',
  'sa-settings-backup': '#ef4444',
  'sa-settings-notifications': '#ef4444',
  'sa-settings-activity': '#ef4444',
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
    globalConfig,
    billingOverview
  } = useApp();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [tempKey, setTempKey] = useState(openAiApiKey);

  interface SidebarSection {
    title: string;
    items: SidebarMenuItem[];
  }

  // Dynamic Sidebar configuration based on RBAC role
  const getSidebarConfig = (): SidebarSection[] => {
    const baseSections: SidebarSection[] = [
      {
        title: 'Overview',
        items: [
          { id: 'dashboard', label: 'Dashboard', icon: 'LayoutGrid', action: 'tab', tabId: 'dashboard' }
        ]
      },
      {
        title: 'Speech Tools',
        items: [
          { id: 'text-to-speech', label: 'Text to Voice', icon: 'Volume2', action: 'tab', tabId: 'text-to-speech' },
          { id: 'audio-transcription', label: 'Audio to Text', icon: 'FileAudio', action: 'tab', tabId: 'audio-transcription' }
        ]
      },
      {
        title: 'Transcription',
        items: [
          { id: 'voice-to-text', label: 'Transcription', icon: 'Mic', action: 'tab', tabId: 'voice-to-text' },
          { id: 'translation', label: 'Translation', icon: 'Languages', action: 'tab', tabId: 'translation' }
        ]
      }
    ];

    if (user?.role === 'super_admin' && window.location.pathname === '/controller') {
      return [
        {
          title: '',
          items: [
            { id: 'sa-overview', label: 'Dashboard', icon: 'Activity', action: 'tab', tabId: 'sa-overview' },
          ]
        },
        {
          title: 'Management',
          items: [
            { id: 'sa-tenants', label: 'Tenants', icon: 'Building2', action: 'tab', tabId: 'sa-tenants' },
            { id: 'sa-users', label: 'Users', icon: 'Users', action: 'tab', tabId: 'sa-users' },
            { id: 'sa-plans', label: 'Plans', icon: 'Layers', action: 'tab', tabId: 'sa-plans' },
          ]
        },
        {
          title: 'AI & Analytics',
          items: [
            { id: 'sa-providers', label: 'AI Providers', icon: 'Server', action: 'tab', tabId: 'sa-providers' },
            { id: 'sa-usage', label: 'Usage Analytics', icon: 'TrendingUp', action: 'tab', tabId: 'sa-usage' },
            { id: 'sa-ai-logs', label: 'AI Logs', icon: 'Cpu', action: 'tab', tabId: 'sa-ai-logs' },
          ]
        },
        {
          title: 'Finance',
          items: [
            { id: 'sa-billing', label: 'Billing', icon: 'CreditCard', action: 'tab', tabId: 'sa-billing' },
          ]
        },
        {
          title: 'Monitoring',
          items: [
            { id: 'sa-audit-logs', label: 'Audit Logs', icon: 'ShieldAlert', action: 'tab', tabId: 'sa-audit-logs' },
            { id: 'sa-health', label: 'System Health', icon: 'Activity', action: 'tab', tabId: 'sa-health' },
          ]
        },
        {
          title: 'Platform',
          items: [
            { id: 'sa-builder', label: 'Platform Builder', icon: 'Settings2', action: 'tab', tabId: 'sa-builder' },
          ]
        },
        {
          title: 'Settings',
          items: [
            { id: 'sa-settings-general', label: 'General Settings', icon: 'Settings', action: 'tab', tabId: 'sa-settings-general' },
            { id: 'sa-settings-tenant', label: 'Tenant Settings', icon: 'Building2', action: 'tab', tabId: 'sa-settings-tenant' },
            { id: 'sa-settings-smtp', label: 'SMTP & Email', icon: 'Mail', action: 'tab', tabId: 'sa-settings-smtp' },
            { id: 'sa-settings-auth', label: 'Authentication', icon: 'Key', action: 'tab', tabId: 'sa-settings-auth' },
            { id: 'sa-settings-security', label: 'Security', icon: 'ShieldCheck', action: 'tab', tabId: 'sa-settings-security' },
            { id: 'sa-settings-payments', label: 'Payment Gateways', icon: 'CreditCard', action: 'tab', tabId: 'sa-settings-payments' },
            { id: 'sa-settings-domains', label: 'Domains & Branding', icon: 'Globe', action: 'tab', tabId: 'sa-settings-domains' },
            { id: 'sa-settings-apikeys', label: 'API Keys', icon: 'Key', action: 'tab', tabId: 'sa-settings-apikeys' },
            { id: 'sa-settings-backup', label: 'Backup & Restore', icon: 'Database', action: 'tab', tabId: 'sa-settings-backup' },
            { id: 'sa-settings-notifications', label: 'Notification Center', icon: 'Bell', action: 'tab', tabId: 'sa-settings-notifications' },
            { id: 'sa-settings-activity', label: 'Activity Center', icon: 'Activity', action: 'tab', tabId: 'sa-settings-activity' },
          ]
        }
      ];
    }

    const sections: SidebarSection[] = [
      ...baseSections
    ];

    // Add Workspace section
    if (user) {
      const workspaceItems: SidebarMenuItem[] = [];
      workspaceItems.push({ id: 'tenant-billing-menu', label: 'Plans & Billing', icon: 'CreditCard', action: 'tab', tabId: 'tenant-billing' });
      workspaceItems.push({ id: 'document-intelligence', label: 'Document Intelligence', icon: 'FileText', action: 'tab', tabId: 'document-intelligence' });

      sections.push({
        title: 'Workspace',
        items: workspaceItems
      });
    }

    // Add Other section with History
    sections.push({
      title: 'Other',
      items: [
        { id: 'history-page', label: 'History', icon: 'History', action: 'tab', tabId: 'history-page' }
      ]
    });

    return sections;
  };

  const SIDEBAR_CONFIG = getSidebarConfig();

  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    const saved = storage.getItem('mcc-ai-sidebar-expanded');
    return saved ? JSON.parse(saved) : { 'speech-tools': true };
  });

  const toggleExpanded = (nodeId: string) => {
    setExpanded((prev) => {
      const next = { ...prev, [nodeId]: !prev[nodeId] };
      storage.setItem('mcc-ai-sidebar-expanded', JSON.stringify(next));
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
  const isValidSuperAdminView = isSuperAdminTab && window.location.pathname === '/controller' && user?.role === 'super_admin';
  const getSuperAdminSubTab = (): any => {
    if (!isSuperAdminTab) return 'overview';
    const sub = activeTab.replace('sa-', '');
    if (sub === 'health') return 'system_health';
    if (sub === 'ai-logs') return 'ai_logs';
    if (sub === 'audit-logs') return 'audit_logs';
    if (sub === 'usage') return 'usage_analytics';
    return sub;
  };
  const superAdminSubTab = getSuperAdminSubTab();

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
    if (activeTab === 'sa-settings-general') return { label: 'General Settings', icon: <Settings size={16} />, activeColor: '#ef4444' };
    if (activeTab === 'sa-settings-tenant') return { label: 'Tenant Settings', icon: <Building2 size={16} />, activeColor: '#ef4444' };
    if (activeTab === 'sa-settings-smtp') return { label: 'SMTP & Email', icon: <Mail size={16} />, activeColor: '#ef4444' };
    if (activeTab === 'sa-settings-auth') return { label: 'Authentication', icon: <Key size={16} />, activeColor: '#ef4444' };
    if (activeTab === 'sa-settings-security') return { label: 'Security', icon: <ShieldCheck size={16} />, activeColor: '#ef4444' };
    if (activeTab === 'sa-settings-payments') return { label: 'Payment Gateways', icon: <CreditCard size={16} />, activeColor: '#ef4444' };
    if (activeTab === 'sa-settings-domains') return { label: 'Domains & Branding', icon: <Globe size={16} />, activeColor: '#ef4444' };
    if (activeTab === 'sa-settings-apikeys') return { label: 'API Keys', icon: <Key size={16} />, activeColor: '#ef4444' };
    if (activeTab === 'sa-settings-backup') return { label: 'Backup & Restore', icon: <Database size={16} />, activeColor: '#ef4444' };
    if (activeTab === 'sa-settings-notifications') return { label: 'Notification Center', icon: <Bell size={16} />, activeColor: '#ef4444' };
    if (activeTab === 'sa-settings-activity') return { label: 'Activity Center', icon: <Activity size={16} />, activeColor: '#ef4444' };


    return {
      'dashboard': { label: 'Dashboard', icon: <LayoutGrid size={16} />, activeColor: '#10b981' },
      'voice-to-text': { label: 'Transcription', icon: <Mic size={16} />, activeColor: '#3b82f6' },
      'text-to-speech': { label: 'Text to Voice', icon: <Volume2 size={16} />, activeColor: '#8b5cf6' },
      'translation': { label: 'Translation', icon: <Languages size={16} />, activeColor: '#10b981' },
      'audio-transcription': { label: 'Audio to Text', icon: <FileAudio size={16} />, activeColor: '#f59e0b' },
      'super-admin-dashboard': { label: 'Super Admin', icon: <ShieldCheck size={16} />, activeColor: '#ef4444' },
      'tenant-dashboard': { label: 'Workspace settings', icon: <Settings size={16} />, activeColor: '#3b82f6' },
      'tenant-settings-smtp': { label: 'SMTP & Email', icon: <Mail size={16} />, activeColor: '#ef4444' },
      'tenant-settings-payments': { label: 'Payment Gateways', icon: <CreditCard size={16} />, activeColor: '#ef4444' },
      'tenant-billing': { label: 'Plans & Billing', icon: <CreditCard size={16} />, activeColor: '#3b82f6' },
      'document-intelligence': { label: 'Document Intelligence', icon: <FileText size={16} />, activeColor: '#10b981' },
    }[activeTab] || { label: 'Tools', icon: <Volume2 size={16} />, activeColor: '#8b5cf6' };
  };

  const currentTab = getActiveTabMetadata();

  const ActiveTool = isValidSuperAdminView
    ? null
    : ({
      'dashboard': UserDashboard,
      'voice-to-text': VoiceToText,
      'text-to-speech': TextToVoice,
      'translation': TextTranslation,
      'audio-transcription': AudioToText,
      'super-admin-dashboard': SuperAdminDashboard,
      'tenant-dashboard': TenantDashboard,
      'tenant-billing': TenantBilling,
      'tenant-settings-smtp': SMTPSettings,
      'tenant-settings-payments': PaymentSettings,
      'history-page': HistoryPage,
      'document-intelligence': DocumentIntelligence,
    } as Record<string, any>)[activeTab] || VoiceToText;

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
                  <label className="mb-2 flex items-center gap-1.5 text-sm font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                    <Key size={14} /> OpenAI API Key
                  </label>
                  <input
                    type="password"
                    value={tempKey}
                    onChange={(e) => setTempKey(e.target.value)}
                    placeholder="sk-proj-..."
                    className="glass-input w-full rounded-xl px-4 py-3 text-sm"
                  />
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                    Used for high-accuracy Whisper transcription. Stored locally in your browser only.
                  </p>
                </div>
                <div className="flex items-start gap-2 rounded-xl p-3 text-sm" style={{
                  background: 'color-mix(in srgb, #10b981 8%, var(--bg-card))',
                  border: '1px solid color-mix(in srgb, #10b981 20%, transparent)',
                  color: '#10b981',
                }}>
                  <ShieldCheck size={16} className="flex-shrink-0 mt-0.5" />
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
              className="fixed left-0 top-0 z-50 flex h-full w-[100px] flex-col sm:hidden rounded-tr-[32px] rounded-br-[32px] p-4"
              style={{
                background: 'var(--sidebar-panel-bg)',
                borderRight: '1px solid var(--sidebar-panel-border)',
                boxShadow: 'var(--shadow-xl)'
              }}
            >
              <div className="flex items-center justify-between px-3 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <div className="flex items-center gap-0">
                  <img src={"/logo.png?v=2"} alt="Logo" className="h-14 w-14 min-w-[56px] object-contain transform scale-125 origin-center -ml-2 -mr-3 dark:invert-0 dark:hue-rotate-0 invert hue-rotate-180" />
                  <span className="text-sm font-bold text-[var(--text-primary)]">{globalConfig?.branding?.platform_name || "Fluentia"}</span>
                </div>
                <button onClick={() => setSidebarOpen(false)} className="rounded-lg p-1.5 hover:bg-white/40" style={{ color: '#ffffff' }}>
                  <X size={18} />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto p-3 space-y-2.5">
                {SIDEBAR_CONFIG.map((section) => {
                  const sectionId = `section-${section.title}`;
                  const isSectionOpen = expanded[sectionId] ?? true;
                  return (
                    <div key={section.title || `section-${section.items[0]?.id}`} className="space-y-0.5 mb-2">
                      {section.title && (
                        <div className="w-full flex justify-center py-2 relative mt-1 mb-1">
                          <hr className="w-[60%] border-[rgba(255,255,255,0.1)] absolute top-1/2 -translate-y-1/2" style={{ borderColor: 'var(--sidebar-panel-border)' }} />
                          <span className="bg-[var(--sidebar-bg)] px-1 text-[8px] font-bold tracking-wider text-[var(--sidebar-panel-text)] opacity-60 uppercase z-10 text-center leading-tight max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
                            {section.title}
                          </span>
                        </div>
                      )}
                      <AnimatePresence initial={false}>
                        {(!section.title || isSectionOpen) && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden space-y-1"
                          >
                            {section.items.map((item) => (
                              <SidebarMenuNode
                                key={item.id}
                                node={item}
                                expanded={expanded}
                                toggleExpanded={toggleExpanded}
                                onSettingsOpen={() => setSettingsOpen(true)}
                                onSidebarClose={() => setSidebarOpen(false)}
                                onHistoryOpen={() => setHistoryOpen(true)}
                              />
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Left Panel: Desktop Sidebar */}
      <aside
        className={`hidden sm:flex sm:flex-col justify-between px-2 py-6 rounded-none relative z-10 transition-all duration-300 ease-in-out ${isCollapsed ? 'w-[72px]' : 'w-[230px]'} flex-shrink-0 min-h-0`}
        style={{
          background: 'var(--sidebar-bg)',
          borderRight: 'none',
        }}
      >
        <div className="flex flex-col flex-1 min-h-0">
          <div className={`flex items-center select-none w-full pr-1 mt-1 mb-6 transition-all duration-300 ${isCollapsed ? 'flex-col gap-4 justify-center' : 'justify-between'}`}>
            <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-0 ml-0.5'}`}>
              <img
                src={"/logo.png?v=2"}
                alt="Logo"
                className={`object-contain flex-shrink-0 transform origin-center dark:invert-0 dark:hue-rotate-0 invert hue-rotate-180 transition-all duration-300 ${isCollapsed ? 'h-11 w-11 min-w-[44px] scale-[1.4]' : 'h-16 w-16 min-w-[64px] scale-[1.45] -ml-2 -mr-3'}`}
              />
              {!isCollapsed && (
                <div className="flex flex-col min-w-0 justify-center mt-1">
                  <span className="text-[26px] leading-[0.95] font-black tracking-tight text-[var(--text-primary)] drop-shadow-sm truncate" style={{ fontFamily: "'Outfit', sans-serif" }}>
                    Fluentia
                  </span>
                  <span className="text-[11.5px] text-[var(--text-secondary)] font-bold tracking-[0.08em] truncate mt-1 opacity-80 uppercase">
                    AI Language Platform
                  </span>
                </div>
              )}
            </div>
            
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="flex h-6 w-6 items-center justify-center rounded text-[var(--text-primary)] transition-all cursor-pointer hover:bg-white/10 active:scale-95 flex-shrink-0 opacity-50 hover:opacity-100"
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          </div>

          <nav className="space-y-2.5 flex-1 overflow-y-auto min-h-0 pr-2 mb-2 custom-scrollbar" aria-label="Tool navigation">
            {SIDEBAR_CONFIG.map((section) => {
              const sectionId = `section-${section.title}`;
              const isSectionOpen = expanded[sectionId] ?? true;
              return (
                <div key={section.title || `section-${section.items[0]?.id}`} className="space-y-0.5 mb-2">
                  {!isCollapsed && section.title && (
                    <div
                      className="flex items-center justify-between px-2 py-2 mt-2 mb-1 cursor-pointer group select-none rounded-lg hover:bg-[var(--sidebar-item-hover)] transition-colors"
                      onClick={() => toggleExpanded(sectionId)}
                    >
                      <h4 className="text-xs font-bold tracking-[0.05em] text-[var(--sidebar-panel-text)] uppercase opacity-80 group-hover:opacity-100 transition-colors truncate pr-1">
                        {section.title}
                      </h4>
                      <ChevronDown
                        size={16}
                        className={`flex-shrink-0 text-[var(--sidebar-panel-text)] opacity-50 group-hover:opacity-100 transition-transform duration-200 ${isSectionOpen ? 'rotate-180' : ''}`}
                      />
                    </div>
                  )}
                  <AnimatePresence initial={false}>
                    {(!section.title || isSectionOpen || isCollapsed) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden space-y-1"
                      >
                        {section.items.map((item) => (
                          <SidebarMenuNode
                            key={item.id}
                            node={item}
                            expanded={expanded}
                            toggleExpanded={toggleExpanded}
                            onSettingsOpen={() => setSettingsOpen(true)}
                            onHistoryOpen={() => setHistoryOpen(true)}
                            isCollapsed={isCollapsed}
                          />
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </nav>


        </div>

        <div className="pt-4 mt-auto">
          <button
            onClick={() => logout()}
            className={`w-full flex items-center justify-center gap-2 rounded-xl py-2.5 ${isCollapsed ? 'px-0' : 'px-4'} text-sm font-bold text-red-500 hover:text-red-600 border border-red-500/20 hover:bg-red-500/10 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]`}
            title="Logout"
          >
            <LogOut size={16} />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Right Panel */}
      <div className="flex-grow h-full flex flex-col min-w-0 overflow-hidden bg-[var(--bg-base)]">
        <Header />

        <main className="flex-grow overflow-y-auto px-4 py-6 sm:px-8 sm:py-8 lg:px-12 lg:py-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={isValidSuperAdminView ? 'admin-panel' : activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
            >
              {isValidSuperAdminView
                ? <SuperAdminDashboard subTab={superAdminSubTab} />
                : ActiveTool && <ActiveTool setActiveTab={setActiveTab} setHistoryOpen={setHistoryOpen} />
              }
            </motion.div>
          </AnimatePresence>
        </main>


        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="fixed top-6 right-6 z-[9999] flex items-center gap-3 rounded-2xl p-4.5 shadow-2xl border backdrop-blur-md text-[var(--text-primary)] font-sans text-xs max-w-sm"
              style={{
                background: 'rgba(15, 23, 42, 0.95)',
                borderColor: 'rgba(255,255,255,0.1)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
              }}
            >
              <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-amber-500 text-[var(--text-primary)] font-black text-sm">
                !
              </span>
              <div className="flex-grow text-left">
                <p className="font-bold text-sm uppercase tracking-wider text-amber-400 mb-1">System Notice</p>
                <p className="text-slate-200 text-sm leading-relaxed font-semibold">{notification.message}</p>
              </div>
              <button
                onClick={() => setNotification(null)}
                className="flex-shrink-0 p-1 rounded-lg hover:bg-white/15 text-[var(--text-primary)]/40 hover:text-[var(--text-primary)] transition-colors cursor-pointer"
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
