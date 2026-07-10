import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, Users, CreditCard, Cpu, Check, 
  Loader2, Sparkles, Server, Trash2, ShieldCheck,
  AlertTriangle, Activity, Search, AlertCircle,
  Ban, CheckCircle2,
  TrendingUp, Settings, MoreVertical,
  ArrowUpRight, Settings2, Edit, Copy, PowerOff, PlayCircle, Lock, Unlock, Mail, Download, RefreshCw, Eye, ToggleLeft, ToggleRight
} from 'lucide-react';

import { PlatformBuilder } from './PlatformBuilder';

import { GeneralSettings } from './settings/GeneralSettings';
import { TenantSettings } from './settings/TenantSettings';
import { SMTPSettings } from './settings/SMTPSettings';
import { AuthSettings } from './settings/AuthSettings';
import { SecuritySettings } from './settings/SecuritySettings';
import { PaymentSettings } from './settings/PaymentSettings';
import { DomainBranding } from './settings/DomainBranding';
import { APIKeys } from './settings/APIKeys';
import { BackupRestore } from './settings/BackupRestore';
import { NotificationCenter } from './settings/NotificationCenter';
import { ActivityCenter } from './settings/ActivityCenter';
import { ProviderManager } from './settings/ProviderManager';

type TabType = 'overview' | 'tenants' | 'providers' | 'plans' | 'users' | 'usage_analytics' | 'billing' | 'ai_logs' | 'audit_logs' | 'system_health' | 'settings' | 'builder' | 'settings-general' | 'settings-tenant' | 'settings-smtp' | 'settings-auth' | 'settings-security' | 'settings-payments' | 'settings-domains' | 'settings-apikeys' | 'settings-backup' | 'settings-notifications' | 'settings-activity';

const Sparkline: React.FC<{ points: number[]; color: string }> = ({ points, color }) => {
  const width = 120;
  const height = 36;
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;
  const coords = points.map((p, i) => {
    const x = (i / (points.length - 1)) * width;
    const y = height - ((p - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} className="overflow-visible opacity-85">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={coords}
      />
    </svg>
  );
};

interface CustomDropdownProps {
  value: string;
  onChange: (val: string) => void;
  options: { value: string; label: string }[];
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({ value, onChange, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value) || options[0];

  return (
    <div ref={containerRef} className="relative inline-block text-left min-w-[180px]">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-1.5 outline-none font-semibold text-slate-800 dark:text-slate-200 cursor-pointer flex items-center justify-between gap-2"
      >
        <span className="truncate">{selectedOption?.label}</span>
        <svg className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 z-[100] mt-1 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 shadow-xl overflow-hidden py-1 max-h-[250px] overflow-y-auto">
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-sm font-semibold cursor-pointer transition-colors block ${
                  isSelected
                    ? 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-600 dark:hover:text-white'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};


interface SuperAdminDashboardProps {
  subTab?: TabType;
}

export const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({ subTab }) => {
  const [activeTab, setActiveTab] = useState<TabType>(subTab || 'overview');

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('info');

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };


  // Sync internal tab when the global activeTab changes (e.g. after refresh)
  useEffect(() => {
    if (subTab && subTab !== activeTab) {
      setActiveTab(subTab);
    }
  }, [subTab]);
  const [metrics, setMetrics] = useState<any>(null);
  const [tenants, setTenants] = useState<any[]>([]);
  const [providers, setProviders] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  
  // Custom SaaS States
  const [usageAnalytics, setUsageAnalytics] = useState<any[]>([]);
  const [billingOverview, setBillingOverview] = useState<any>({
      today_revenue: 1250,
      mrr: 45000,
      active_subscriptions: 120,
      churn_rate: 2.4,
      arpu: 375,
      invoices: [
        { id: '1', invoice_number: 'INV-2026-001', tenant_name: 'Acme Corp', plan: 'Enterprise', amount: 499, status: 'paid', date: '2026-06-24' },
        { id: '2', invoice_number: 'INV-2026-002', tenant_name: 'GlobalTech', plan: 'Professional', amount: 199, status: 'pending', date: '2026-06-23' },
        { id: '3', invoice_number: 'INV-2026-003', tenant_name: 'DevStudio', plan: 'Starter', amount: 99, status: 'paid', date: '2026-06-22' }
      ],
      payments: [
        { id: 'txn_123', transaction_id: 'txn_123', tenant_name: 'Acme Corp', amount: 499, payment_method: 'Stripe', status: 'success', created_at: '2026-06-24' },
        { id: 'txn_124', transaction_id: 'txn_124', tenant_name: 'DevStudio', amount: 99, payment_method: 'Razorpay', status: 'success', created_at: '2026-06-22' }
      ],
      subscriptions: [
        { id: 'sub_1', tenant_name: 'Acme Corp', plan_name: 'Enterprise', amount: 499, status: 'active', renews: '2026-07-24' },
        { id: 'sub_2', tenant_name: 'GlobalTech', plan_name: 'Professional', amount: 199, status: 'past_due', renews: '2026-07-23' },
        { id: 'sub_3', tenant_name: 'DevStudio', plan_name: 'Starter', amount: 99, status: 'active', renews: '2026-07-22' }
      ]
    });
  const [loadError, setLoadError] = useState<string | null>(null);
  const [billingSubTab, setBillingSubTab] = useState<'analytics' | 'invoices' | 'payments' | 'subscriptions'>('analytics');
  const [viewingPaymentDetails, setViewingPaymentDetails] = useState<any>(null);
  const [gatewaySettings, setGatewaySettings] = useState<any>(null);
  const [aiLogs, setAiLogs] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [systemHealth, setSystemHealth] = useState<any>(null);

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [planFilter, setPlanFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Subscription filters
  const [subSearchTerm, setSubSearchTerm] = useState('');
  const [subStatusFilter, setSubStatusFilter] = useState('');
  const [subCycleFilter, setSubCycleFilter] = useState('');
  const [logTimeFilter, setLogTimeFilter] = useState<'all' | 'today' | 'weekly' | 'monthly'>('all');
  
  const [loading, setLoading] = useState(true);
  // const [actionLoading, setActionLoading] = useState<string | null>(null);

  // New Tenant input state (Refined form)
  const [newCompany, setNewCompany] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [selectedPlanId, setSelectedPlanId] = useState('');

  // Selected Tenant View Modal state
  const [viewingTenant, setViewingTenant] = useState<any>(null);
  const [editingTenant, setEditingTenant] = useState<any>(null);
  const [editTenantName, setEditTenantName] = useState('');
  const [editTenantPlanId, setEditTenantPlanId] = useState('');

  // Edit Plan Modal state
  const [editingPlan, setEditingPlan] = useState<any>(null);
  const [editPlanName, setEditPlanName] = useState('');
  const [editPlanPrice, setEditPlanPrice] = useState(0);
  const [editPlanAudio, setEditPlanAudio] = useState(0);
  const [editPlanTranslation, setEditPlanTranslation] = useState(0);
  const [editPlanTTS, setEditPlanTTS] = useState(0);
  const [editPlanStorage, setEditPlanStorage] = useState(0);

  // Active Dropdowns state
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Billing Cycle state for Subscription Catalog
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  // Custom Confirmation Dialog state
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText: string;
    cancelText: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    onConfirm: () => {}
  });

  // Provider config inputs
  
  // New States for AI Provider Mapping
  const [featureMappings, setFeatureMappings] = useState<any[]>([
    { feature: "Audio To Text", provider: "Deepgram", enabled: true, priority: 1 },
    { feature: "Text To Speech", provider: "ElevenLabs", enabled: true, priority: 1 },
    { feature: "Translation", provider: "OpenAI", enabled: true, priority: 1 },
    { feature: "Transcription", provider: "OpenAI", enabled: true, priority: 1 }
  ]);
  
  useEffect(() => {
    if (activeTab === 'providers') {
      apiRequest("/super-admin/providers/mappings").then(data => {
        if (data && data.length > 0) {
          const mapped = data.map((item: any) => ({
            feature: item.feature_name,
            provider: item.provider_name,
            enabled: item.is_enabled,
            priority: item.priority
          }));
          
          const filtered = mapped.filter((item: any) => 
            item.feature === "Audio To Text" || 
            item.feature === "Text To Speech" || 
            item.feature === "Translation" ||
            item.feature === "Transcription"
          );

          setFeatureMappings(prev => {
            const current = [...prev];
            filtered.forEach((item: any) => {
              const idx = current.findIndex(c => c.feature === item.feature);
              if (idx !== -1) {
                current[idx] = item;
              } else {
                current.push(item);
              }
            });
            return current;
          });
        }
      }).catch((err) => {
        console.error("Error loading provider mappings:", err);
      });
    }
  }, [activeTab]);

  const handleSaveMapping = async (idx: number) => {
    const mapping = featureMappings[idx];
    try {
      await apiRequest("/super-admin/providers/mappings", {
        method: "POST",
        body: JSON.stringify({
          feature_name: mapping.feature,
          provider_name: mapping.provider,
          priority: mapping.priority,
          is_enabled: mapping.enabled
        })
      });
      showToast("Saved successfully.", 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to save mapping', 'error');
    }
  };

  const [selectedProvider, setSelectedProvider] = useState('openai');
  const [providerKey, setProviderKey] = useState('');
  const [providerPriority, setProviderPriority] = useState(1);
  const [providerEnabled, setProviderEnabled] = useState(true);
  const [configuringProvider, setConfiguringProvider] = useState<any | null>(null);
  const [resetPasswordInfo, setResetPasswordInfo] = useState<{ userName: string, tempPass: string } | null>(null);

  // Sync prop tab selection to local state
  useEffect(() => {
    if (subTab) {
      setActiveTab(subTab);
      setSearchTerm('');
      setPlanFilter('');
      setStatusFilter('');
    }
  }, [subTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      const safeApiRequest = async (url: string, setter: (data: any) => void) => {
        try {
          const data = await apiRequest(url);
          setter(data);
        } catch (e: any) {
          console.error(`Failed to load ${url}:`, e);
          setLoadError(prev => (prev ? prev + ' | ' : '') + `${url} failed: ${e.message}`);
        }
      };

      await Promise.all([
        safeApiRequest("/super-admin/metrics", setMetrics),
        safeApiRequest("/super-admin/tenants", setTenants),
        safeApiRequest("/super-admin/providers", setProviders),
        safeApiRequest("/super-admin/plans", setPlans),
        safeApiRequest("/super-admin/users", setUsersList),
        safeApiRequest("/super-admin/analytics/usage", setUsageAnalytics),
        safeApiRequest("/billing/admin/overview", setBillingOverview),
        safeApiRequest("/billing/settings", setGatewaySettings),
        safeApiRequest("/super-admin/logs/ai", setAiLogs),
        safeApiRequest("/super-admin/logs/audit", setAuditLogs),
        safeApiRequest("/super-admin/health/system", setSystemHealth)
      ]);

    } catch (err: any) {
      console.error("Failed to load super admin dashboard data:", err);
      setLoadError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Tenant Actions
  const handleUpdateTenantStatus = async (tenantId: string, status: string) => {
    // setActionLoading(tenantId);
    try {
      await apiRequest(`/super-admin/tenants/${tenantId}/status?status=${status}`, {
        method: "PATCH"
      });
      loadData();
      showToast(`Workspace status updated successfully to ${status}.`, 'success');
    } catch (err) {
      showToast("Error updating tenant status.", 'error');
    } finally {
      // setActionLoading(null);
      setActiveMenuId(null);
    }
  };

  const handleDeleteTenant = async (tenantId: string) => {
    setConfirmDialog({
      isOpen: true,
      title: "Delete Workspace",
      message: "Are you sure you want to permanently delete this workspace? This action cannot be undone and will delete all associated users and data.",
      confirmText: "Yes, Delete Workspace",
      cancelText: "Cancel",
      onConfirm: async () => {
        try {
          await apiRequest(`/super-admin/tenants/${tenantId}`, { method: 'DELETE' });
          showToast("Workspace deleted successfully", "success");
          loadData();
        } catch (e: any) {
          showToast(e.message || "Failed to delete workspace", "error");
        } finally {
          setActiveMenuId(null);
          setConfirmDialog(prev => ({ ...prev, isOpen: false }));
        }
      }
    });
  };

  const handleUpgradeTenant = async (tenantId: string, planId: string) => {
    try {
      await apiRequest(`/super-admin/tenants/${tenantId}/plan`, {
        method: "PATCH",
        body: JSON.stringify({ plan_id: planId })
      });
      setEditingTenant(null);
      loadData();
      showToast("Workspace billing plan upgraded successfully!", 'success');
    } catch (err) {
      showToast("Error upgrading tenant plan.", 'error');
    }
  };

  const handleProvisionTenant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompany || !newSlug || !newAdminEmail || !newAdminPassword || !newAdminName) {
      showToast("Please fill in all tenant creation fields.", 'success');
      return;
    }
    
    try {
      await apiRequest("/super-admin/tenants", {
        method: "POST",
        body: JSON.stringify({
          tenant_name: newCompany,
          slug: newSlug.toLowerCase().trim().replace(/[^a-z0-9-]/g, ""),
          admin_name: newAdminName,
          admin_email: newAdminEmail,
          admin_password: newAdminPassword,
          plan_id: selectedPlanId || null
        })
      });
      
      setNewCompany('');
      setNewSlug('');
      setNewAdminName('');
      setNewAdminEmail('');
      setNewAdminPassword('');
      showToast("Tenant workspace and admin user generated successfully!", 'success');
      loadData();
    } catch (err: any) {
      showToast(err.message || "Failed to provision workspace.", 'error');
    }
  };

  // Provider actions
  const handleConfigureProvider = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!configuringProvider) return;
    const providerName = configuringProvider.isNew ? selectedProvider : configuringProvider.provider_name;
    if (!providerName) {
      showToast("Please select a provider name.", "error");
      return;
    }
    try {
      await apiRequest("/super-admin/providers", {
        method: "POST",
        body: JSON.stringify({
          provider_name: providerName,
          api_key: providerKey || null,
          priority: Number(providerPriority),
          is_enabled: providerEnabled
        })
      });
      setProviderKey('');
      showToast("Saved successfully.", 'success');
      setConfiguringProvider(null);
      loadData();
    } catch (err) {
      showToast("Failed to update provider configuration.", 'error');
    }
  };

  const handleTestConnectionInModal = async () => {
    if (!configuringProvider) return;
    const providerName = configuringProvider.isNew ? selectedProvider : configuringProvider.provider_name;
    if (!providerName) {
      showToast("Please select a provider name first.", "error");
      return;
    }
    await handleTestProviderConnection(providerName);
  };

  const handleTestProviderConnection = async (provName: string) => {
    try {
      const res = await apiRequest(`/super-admin/providers/${provName}/test-connection`, {
        method: "POST"
      });
      showToast(res.message || "Connection verified successfully!", 'success');
    } catch (err) {
      showToast("Failed to verify connection.", 'error');
    }
  };

  // Plan actions
  const handleClonePlan = async (planId: string) => {
    try {
      await apiRequest(`/super-admin/plans/${planId}/clone`, {
        method: "POST"
      });
      loadData();
      showToast("Billing plan duplicated successfully!", 'success');
    } catch (err) {
      showToast("Failed to duplicate plan.", 'error');
    }
  };

  const handleTogglePlanActive = async (planId: string) => {
    try {
      await apiRequest(`/super-admin/plans/${planId}/toggle-active`, {
        method: "PATCH"
      });
      loadData();
      showToast("Plan status updated.", 'success');
    } catch (err) {
      showToast("Failed to toggle plan status.", 'error');
    }
  };

  // User Actions
  const handleUpdateUserStatus = async (userId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'active' ? 'suspended' : 'active';
    try {
      await apiRequest(`/super-admin/users/${userId}/status?status=${nextStatus}`, {
        method: "PATCH"
      });
      loadData();
      showToast(`User status updated to ${nextStatus}.`, 'success');
    } catch (err) {
      showToast("Failed to update user status.", 'error');
    }
  };

  const handleResetUserPassword = async (userId: string, userName: string) => {
    try {
      const res = await apiRequest(`/super-admin/users/${userId}/reset-password`, {
        method: "POST"
      });
      let tempPass = "TempPass123!";
      if (res.message) {
        const match = res.message.match(/'([^']+)'/);
        if (match && match[1]) {
          tempPass = match[1];
        }
      }
      setResetPasswordInfo({
        userName,
        tempPass
      });
      showToast("Password reset successfully.", 'success');
    } catch (err) {
      showToast("Failed to reset password.", 'error');
    }
  };

  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      const res = await apiRequest(`/super-admin/users/${userToDelete}`, {
        method: "DELETE"
      });
      showToast(res.message || "User deleted successfully.", 'success');
      loadData();
    } catch (err) {
      showToast("Failed to delete user.", 'error');
    } finally {
      setUserToDelete(null);
    }
  };

  const handleDeleteUser = (userId: string) => {
    setUserToDelete(userId);
  };

  // Billing Actions
  const handleRegenerateInvoice = async (invId: string) => {
    try {
      const res = await apiRequest(`/billing/invoices/${invId}/regenerate`, {
        method: "POST"
      });
      showToast(res.message || "Invoice PDF regenerated successfully.", 'success');
      loadData();
    } catch (err) {
      showToast("Failed to regenerate invoice PDF.", 'error');
    }
  };

  const handleEmailInvoice = async (invId: string) => {
    try {
      const res = await apiRequest(`/billing/invoices/${invId}/email`, {
        method: "POST"
      });
      showToast(res.message || "Invoice email sent successfully.", 'success');
    } catch (err) {
      showToast("Failed to send invoice email.", 'error');
    }
  };

  const handleRenewPlan = async (tenantName: string) => {
    const t = tenants.find(x => x.tenant_name === tenantName);
    if (!t) {
      showToast("Tenant workspace details missing.", 'error');
      return;
    }
    try {
      const res = await apiRequest(`/billing/subscriptions/renew?tenant_id=${t.id}`, {
        method: "POST"
      });
      showToast(res.message || "Subscription renewed successfully.", 'success');
      loadData();
    } catch (err) {
      showToast("Failed to renew plan.", 'error');
    }
  };

  const handleSaveBillingSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest("/billing/settings", {
        method: "PATCH",
        body: JSON.stringify(gatewaySettings)
      });
      showToast("Global billing and gateway configuration saved successfully!", 'success');
      loadData();
    } catch (err: any) {
      showToast(err.message || "Failed to update global billing configurations.", 'error');
    }
  };

  const exportPaymentsToCSV = () => {
    if (!billingOverview?.payments) return;
    const headers = ["Transaction ID", "Invoice Number", "Tenant Name", "Workspace", "Plan", "Gateway", "Amount", "Status", "Date"];
    const rows = billingOverview.payments.map((p: any) => [
      p.transaction_id || '',
      p.invoice_number || '',
      p.tenant_name || '',
      p.workspace || '',
      p.plan || '',
      p.gateway || '',
      p.amount || 0,
      p.status || '',
      p.date || ''
    ]);
    
    const csvContent = [headers.join(","), ...rows.map((e: any) => e.map((val: any) => `"${String(val).replace(/"/g, '""')}"`).join(","))].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `payments_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportSubscriptionsToCSV = () => {
    if (!billingOverview?.subscriptions) return;
    const headers = ["User Name", "Email", "Plan", "Amount", "Payment Status", "Subscription Status", "Start Date", "Expiry Date", "Payment ID"];
    const rows = billingOverview.subscriptions.map((s: any) => [
      s.user_name || "N/A",
      s.email || "N/A",
      s.plan || '',
      s.amount || 0,
      s.payment_status || 'N/A',
      s.status || '',
      s.started || '',
      s.expires || '',
      s.payment_id || 'N/A'
    ]);
    
    const csvContent = [headers.join(","), ...rows.map((e: any) => e.map((val: any) => `"${String(val).replace(/"/g, '""')}"`).join(","))].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `subscriptions_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex h-48 items-center justify-center bg-transparent">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="animate-spin text-teal-500" size={32} />
          <p className="text-sm text-slate-400 font-bold uppercase tracking-wider">Loading metrics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-slate-900 dark:text-slate-900 dark:text-slate-100 bg-transparent animate-fadeIn">
      
      {/* ── 1. DASHBOARD OVERVIEW TAB ── */}
      {activeTab === 'overview' && metrics && (
        <div className="space-y-6 animate-fadeIn">
          {/* Morning Check Dashboard Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Total Tenants */}
            <div className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-white/5 bg-white dark:bg-[#111827]/40 flex flex-col justify-between h-36">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Tenants</p>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{metrics.total_tenants}</h3>
                </div>
                <div className="h-9 w-9 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-500">
                  <Building2 size={18} />
                </div>
              </div>
              <div className="flex items-center justify-between mt-3">
                <span className="text-sm text-emerald-400 font-bold flex items-center gap-0.5">
                  <ArrowUpRight size={12} /> +2 this wk
                </span>
                <Sparkline points={[5, 8, 12, 10, 15, 18, 25]} color="#3b82f6" />
              </div>
            </div>

            {/* Active Users */}
            <div className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-white/5 bg-white dark:bg-[#111827]/40 flex flex-col justify-between h-36">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Users</p>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{metrics.active_users}</h3>
                </div>
                <div className="h-9 w-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                  <Users size={18} />
                </div>
              </div>
              <div className="flex items-center justify-between mt-3">
                <span className="text-sm text-emerald-400 font-bold flex items-center gap-0.5">
                  <ArrowUpRight size={12} /> +12.4%
                </span>
                <Sparkline points={[150, 200, 280, 250, 310, 390, 430]} color="#10b981" />
              </div>
            </div>

            {/* Monthly Revenue */}
            <div className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-white/5 bg-white dark:bg-[#111827]/40 flex flex-col justify-between h-36">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Monthly Revenue</p>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">${metrics.revenue_this_month?.toLocaleString()}</h3>
                </div>
                <div className="h-9 w-9 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-500">
                  <CreditCard size={18} />
                </div>
              </div>
              <div className="flex items-center justify-between mt-3">
                <span className="text-sm text-emerald-400 font-bold flex items-center gap-0.5">
                  <ArrowUpRight size={12} /> +8.5%
                </span>
                <Sparkline points={[1200, 1400, 1800, 1600, 2100, 2250, 2450]} color="#8b5cf6" />
              </div>
            </div>

            {/* API Requests */}
            <div className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-white/5 bg-white dark:bg-[#111827]/40 flex flex-col justify-between h-36">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">API Requests</p>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{(metrics.api_calls_today || 0).toLocaleString()}</h3>
                </div>
                <div className="h-9 w-9 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-500">
                  <Cpu size={18} />
                </div>
              </div>
              <div className="flex items-center justify-between mt-3">
                <span className="text-sm text-emerald-400 font-bold flex items-center gap-0.5">
                  <ArrowUpRight size={12} /> +20%
                </span>
                <Sparkline points={[25000, 31000, 29000, 35000, 38000, 41000, 42000]} color="#06b6d4" />
              </div>
            </div>
          </div>

          {/* Health & Consumed resources Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Provider Health Panel */}
            <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-white/5 bg-white dark:bg-[#111827]/40 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Server size={14} className="text-teal-500" />
                Provider Health Status
              </h3>
              <div className="space-y-2.5">
                {metrics.provider_health?.map((prov: any) => (
                  <div key={prov.provider} className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-white dark:bg-white dark:bg-slate-950/30 border border-slate-200 dark:border-white/5">
                    <span className="text-base font-bold text-slate-800 dark:text-slate-800 dark:text-slate-200">{prov.provider}</span>
                    <span className={`flex items-center gap-1.5 text-sm font-black ${
                      prov.status_code === 'warning' ? 'text-amber-500' : 'text-emerald-500'
                    }`}>
                      <span className={`h-2 w-2 rounded-full ${prov.status_code === 'warning' ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
                      {prov.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Resources usage progress bars */}
            <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-slate-200 dark:border-white/5 bg-white dark:bg-[#111827]/40 space-y-5">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Ingested Resources</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-base font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                    <span>Audio Transcriptions</span>
                    <span className="font-bold text-teal-500 dark:text-teal-400">{metrics.metrics?.transcription_minutes} mins consumed</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 dark:bg-white dark:bg-[#0B1020] rounded-full overflow-hidden border border-slate-300 dark:border-slate-200 dark:border-white/5">
                    <div className="h-full bg-teal-500 rounded-full" style={{ width: "35%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-base font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                    <span>Text Translation</span>
                    <span className="font-bold text-emerald-500 dark:text-emerald-400">{(metrics.metrics?.translation_characters || 0).toLocaleString()} chars</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 dark:bg-white dark:bg-[#0B1020] rounded-full overflow-hidden border border-slate-300 dark:border-slate-200 dark:border-white/5">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: "65%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-base font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                    <span>TTS Audio Synthesis</span>
                    <span className="font-bold text-amber-500 dark:text-amber-400">{(metrics.metrics?.tts_characters || 0).toLocaleString()} chars</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 dark:bg-white dark:bg-[#0B1020] rounded-full overflow-hidden border border-slate-300 dark:border-slate-200 dark:border-white/5">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: "45%" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Lower Row: alerts & top list */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="glass-card rounded-2xl p-6 border border-amber-500/20 bg-amber-500/5 dark:bg-amber-500/10 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                    <AlertTriangle size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">Expiring Subscriptions</h4>
                    <p className="text-sm text-amber-600 dark:text-amber-400/80 font-bold">Billing renewals soon</p>
                  </div>
                </div>
                <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed pt-2">
                  There are <span className="text-slate-900 dark:text-slate-800 dark:text-white font-bold">{metrics.expiring_plans_count || 0}</span> workspace subscriptions renewing within the next 7 days.
                </p>
              </div>
            </div>

            {metrics.top_usage_tenants && (
              <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-slate-200 dark:border-white/5 bg-white dark:bg-[#111827]/40 space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <TrendingUp size={14} className="text-teal-500" />
                  Top Resource Ingested Tenants
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-base border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-white/5 text-slate-500">
                        <th className="py-2">Workspace</th>
                        <th className="py-2">Plan</th>
                        <th className="py-2">API Calls</th>
                        <th className="py-2">Speech</th>
                        <th className="py-2 text-right">Translation</th>
                      </tr>
                    </thead>
                    <tbody>
                      {metrics.top_usage_tenants.slice(0, 3).map((ten: any, idx: number) => (
                        <tr key={ten.slug} className="border-b border-slate-200 dark:border-white/5 hover:bg-white dark:hover:bg-white/5 transition-colors">
                          <td className="py-2.5 font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                            <span className="text-slate-400 text-sm font-mono">#{idx+1}</span>
                            {ten.name}
                          </td>
                          <td className="py-2.5">
                            <span className="px-1.5 py-0.5 rounded text-sm font-bold bg-teal-500/10 text-teal-600 dark:text-teal-400">
                              {ten.plan}
                            </span>
                          </td>
                          <td className="py-2.5 text-slate-800 dark:text-white font-mono font-bold">{ten.api_calls.toLocaleString()}</td>
                          <td className="py-2.5 text-slate-600 dark:text-slate-300">{ten.audio_minutes}m</td>
                          <td className="py-2.5 text-slate-600 dark:text-slate-300 text-right">{ten.translation_chars.toLocaleString()}c</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── 2. TENANTS TAB ── */}
      {activeTab === 'tenants' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
          {/* Provision Form */}
          <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-white/5 bg-white dark:bg-white dark:bg-[#111827]/40 h-fit space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="text-teal-500" size={16} />
              Provision Tenant Workspace
            </h3>
            <form onSubmit={handleProvisionTenant} className="space-y-3.5">
              <div>
                <label className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Company Name</label>
                <input
                  type="text"
                  required
                  value={newCompany}
                  onChange={(e) => {
                    setNewCompany(e.target.value);
                    setNewSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-"));
                  }}
                  placeholder="ABC School"
                  className="w-full px-3.5 py-2.5 mt-1 rounded-xl text-base bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-200 outline-none focus:border-teal-500/50 transition-colors"
                />
              </div>

              <div>
                <label className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Workspace Slug</label>
                <input
                  type="text"
                  required
                  value={newSlug}
                  onChange={(e) => setNewSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                  placeholder="abc-school"
                  className="w-full px-3.5 py-2.5 mt-1 rounded-xl text-base bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-200 outline-none focus:border-teal-500/50 transition-colors"
                />
              </div>

              <div className="p-4 bg-white dark:bg-white dark:bg-slate-950/50 rounded-2xl border border-slate-200 dark:border-white/5 space-y-3">
                <p className="text-sm font-black uppercase text-teal-400 tracking-wider">Tenant Admin Settings</p>
                <div>
                  <label className="text-sm font-bold text-slate-500 dark:text-slate-400">Full Name</label>
                  <input
                    type="text"
                    required
                    value={newAdminName}
                    onChange={(e) => setNewAdminName(e.target.value)}
                    placeholder="Admin Name"
                    className="w-full px-2.5 py-2 mt-0.5 rounded-lg text-base bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-200 outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-slate-500 dark:text-slate-400">Admin Email</label>
                  <input
                    type="email"
                    required
                    value={newAdminEmail}
                    onChange={(e) => setNewAdminEmail(e.target.value)}
                    placeholder="admin@abcschool.com"
                    className="w-full px-2.5 py-2 mt-0.5 rounded-lg text-base bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-200 outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-slate-500 dark:text-slate-400">Admin Password</label>
                  <input
                    type="password"
                    required
                    value={newAdminPassword}
                    onChange={(e) => setNewAdminPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-2.5 py-2 mt-0.5 rounded-lg text-base bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-200 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Billing Plan</label>
                <select
                  value={selectedPlanId}
                  onChange={(e) => setSelectedPlanId(e.target.value)}
                  className="w-full px-3.5 py-2.5 mt-1 rounded-xl text-base bg-white dark:bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-100 outline-none"
                  style={{ background: 'var(--bg-subtle)' }}
                >
                  <option value="" className="text-slate-900 dark:text-slate-200 bg-white dark:bg-slate-950">Select Plan...</option>
                  {plans.map(p => (
                    <option key={p.id} value={p.id} className="text-slate-900 dark:text-slate-200 bg-white dark:bg-slate-950">{p.name} (${p.price}/mo)</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-slate-800 dark:text-white text-base font-bold cursor-pointer transition-colors shadow-lg"
              >
                Provision Tenant Workspace
              </button>
            </form>
          </div>

          {/* Tenants Table */}
          <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-slate-200 dark:border-white/5 bg-white dark:bg-white dark:bg-[#111827]/40 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-white/5 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Active Tenants</h3>
              <div className="flex gap-2">
                <select
                  value={planFilter}
                  onChange={(e) => setPlanFilter(e.target.value)}
                  className="px-2 py-1 rounded bg-white dark:bg-[#0B1020] border border-slate-200 dark:border-white/5 text-sm font-bold text-slate-700 dark:text-slate-300 outline-none"
                >
                  <option value="">All Plans</option>
                  {plans.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                </select>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-2 py-1 rounded bg-white dark:bg-[#0B1020] border border-slate-200 dark:border-white/5 text-sm font-bold text-slate-700 dark:text-slate-300 outline-none"
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-base border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-white/5 text-slate-500">
                    <th className="py-2.5">Workspace</th>
                    <th className="py-2.5">Owner</th>
                    <th className="py-2.5">Users</th>
                    <th className="py-2.5">Plan</th>
                    <th className="py-2.5">Status</th>
                    <th className="py-2.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tenants
                    .filter(t => t.tenant_name.toLowerCase().includes(searchTerm.toLowerCase()) || t.slug.toLowerCase().includes(searchTerm.toLowerCase()))
                    .filter(t => planFilter === '' || t.plan?.name === planFilter)
                    .filter(t => statusFilter === '' || t.status === statusFilter)
                    .map((tenant: any) => (
                      <tr key={tenant.id} className="border-b border-slate-200 dark:border-white/5 hover:bg-white/5 transition-colors">
                        <td className="py-3 font-semibold text-slate-800 dark:text-white">
                          <div>{tenant.tenant_name}</div>
                          <div className="text-sm font-mono text-slate-500">/{tenant.slug}</div>
                        </td>
                        <td className="py-3">
                          <div className="text-slate-700 dark:text-slate-300">{tenant.owner_name}</div>
                          <div className="text-sm text-slate-500">{tenant.owner_email}</div>
                        </td>
                        <td className="py-3 font-bold text-slate-800 dark:text-white">{tenant.users_count || 1}</td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 rounded text-sm font-bold bg-teal-500/10 text-teal-400 border border-teal-500/20">
                            {tenant.plan?.name || "Free"}
                          </span>
                        </td>
                                                  <td className="py-3">
                            <button
                              onClick={() => handleUpdateTenantStatus(tenant.id, tenant.status === 'active' ? 'suspended' : 'active')}
                              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold tracking-wide transition-all cursor-pointer ${
                                tenant.status === 'active' 
                                  ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20' 
                                  : 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/20'
                              }`}
                              title={tenant.status === 'active' ? 'Click to Deactivate' : 'Click to Activate'}
                            >
                              {tenant.status === 'active' ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                              <span>{tenant.status === 'active' ? 'ACTIVE' : 'INACTIVE'}</span>
                            </button>
                          </td>
                        <td className="py-3 text-right relative">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => setViewingTenant(tenant)}
                              className="bg-teal-600/15 hover:bg-teal-600/25 text-teal-400 px-2 py-1 rounded text-sm font-bold cursor-pointer"
                             title="View"><Eye size={16} /></button>
                            <button
                              onClick={() => setActiveMenuId(activeMenuId === tenant.id ? null : tenant.id)}
                              className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
                            >
                              <MoreVertical size={13} />
                            </button>
                          </div>

                          {activeMenuId === tenant.id && (
                            <div className="absolute right-0 mt-1.5 w-40 rounded-xl bg-white dark:bg-slate-900 border border-white/10 p-1.5 z-50 shadow-2xl text-left animate-fadeIn">
                              {tenant.status === 'active' ? (
                                <button
                                  onClick={() => handleUpdateTenantStatus(tenant.id, 'suspended')}
                                  className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm font-bold text-amber-500 hover:bg-amber-500/10"
                                  title="Deactivate"
                                >
                                  <Ban size={16} />
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleUpdateTenantStatus(tenant.id, 'active')}
                                  className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm font-bold text-emerald-400 hover:bg-emerald-500/10"
                                  title="Activate"
                                >
                                  <CheckCircle2 size={16} />
                                </button>
                              )}
                              <button
                                onClick={() => {
                                  setEditingTenant(tenant);
                                  setEditTenantName(tenant.tenant_name);
                                  setEditTenantPlanId(tenant.plan?.id || '');
                                  setActiveMenuId(null);
                                }}
                                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm font-bold text-teal-400 hover:bg-teal-600/10"
                                title="Edit Plan"
                              >
                                <Edit size={16} />
                              </button>
                              <div className="h-[1px] bg-white/5 my-1" />
                              <button
                                onClick={() => handleDeleteTenant(tenant.id)}
                                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm font-bold text-red-500 hover:bg-red-500/10"
                                title="Delete"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── 3. USER MANAGEMENT TAB ── */}
      {activeTab === 'users' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Counters row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-card rounded-2xl p-4 border border-slate-200 dark:border-white/5 bg-white dark:bg-white dark:bg-[#111827]/40">
              <p className="text-sm font-black uppercase text-slate-500 tracking-wider">Total Users</p>
              <h4 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">{usersList.length}</h4>
            </div>
            <div className="glass-card rounded-2xl p-4 border border-slate-200 dark:border-white/5 bg-white dark:bg-white dark:bg-[#111827]/40">
              <p className="text-sm font-black uppercase text-slate-500 tracking-wider">Active Users</p>
              <h4 className="text-xl font-extrabold text-emerald-400 mt-1">
                {usersList.filter(u => u.status === 'active').length}
              </h4>
            </div>
            <div className="glass-card rounded-2xl p-4 border border-slate-200 dark:border-white/5 bg-white dark:bg-white dark:bg-[#111827]/40">
              <p className="text-sm font-black uppercase text-slate-500 tracking-wider">Admins</p>
              <h4 className="text-xl font-extrabold text-teal-400 mt-1">
                {usersList.filter(u => u.role === 'tenant_admin' || u.role === 'super_admin').length}
              </h4>
            </div>
            <div className="glass-card rounded-2xl p-4 border border-slate-200 dark:border-white/5 bg-white dark:bg-white dark:bg-[#111827]/40">
              <p className="text-sm font-black uppercase text-slate-500 tracking-wider">Managers</p>
              <h4 className="text-xl font-extrabold text-teal-400 mt-1">
                {usersList.filter(u => u.role === 'manager').length}
              </h4>
            </div>
          </div>

          {/* Table */}
          <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-white/5 bg-white dark:bg-white dark:bg-[#111827]/40 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/5 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Platform Users</h3>
              <div className="flex items-center gap-2">
                <Search size={14} className="text-slate-500 dark:text-slate-400" />
                <input
                  type="text"
                  placeholder="Search email, name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-3 py-1.5 rounded-xl text-base bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-200 outline-none placeholder-slate-500"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-base border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-white/5 text-slate-500">
                    <th className="py-2.5">User</th>
                    <th className="py-2.5">Email</th>
                    <th className="py-2.5">Role</th>
                    <th className="py-2.5">Status</th>
                    <th className="py-2.5">Last Login</th>
                    <th className="py-2.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {usersList
                    .filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((user: any) => (
                      <tr key={user.id} className="border-b border-slate-200 dark:border-white/5 hover:bg-white/5 transition-colors">
                        <td className="py-3 font-semibold text-slate-800 dark:text-white flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-teal-600/20 text-teal-400 border border-teal-500/20 flex items-center justify-center font-bold text-base uppercase">
                            {user.name.substring(0, 2)}
                          </div>
                          <span>{user.name}</span>
                        </td>
                        <td className="py-3 text-slate-700 dark:text-slate-300 font-mono">{user.email}</td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 rounded text-sm font-bold bg-teal-500/10 text-teal-400 border border-teal-500/20 uppercase">
                            {user.role}
                          </span>
                        </td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded text-sm font-extrabold uppercase ${
                            user.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-500'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="py-3 text-slate-600 dark:text-slate-400 font-mono">
                          {user.last_login ? new Date(user.last_login).toLocaleString() : 'Never logged in'}
                        </td>
                        <td className="py-3 text-right space-x-1">
                          <button
                            onClick={() => handleUpdateUserStatus(user.id, user.status)}
                            className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 px-2 py-1 rounded text-sm font-bold cursor-pointer"
                          >
                            {user.status === 'active' ? 'Disable' : 'Enable'}
                          </button>
                          <button
                            onClick={() => handleResetUserPassword(user.id, user.name || user.email)}
                            className="bg-teal-600/10 hover:bg-teal-600/20 text-teal-400 px-2 py-1 rounded text-sm font-bold cursor-pointer"
                          >
                            Reset Password
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="bg-red-500/10 hover:bg-red-500/20 text-red-400 px-2 py-1 rounded text-sm font-bold cursor-pointer"
                           title="Delete User"><Trash2 size={16} /></button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── 4. SUBSCRIPTION PLANS TAB ── */}
      {activeTab === 'plans' && (
        <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-white/5 bg-white dark:bg-white dark:bg-[#111827]/40 animate-fadeIn space-y-6">
          <div className="flex flex-col items-center gap-6 pb-6">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white self-start w-full border-b border-slate-200 dark:border-white/5 pb-3">Subscription Limit Catalog</h3>
            
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-[0.15em] transition-all duration-200 cursor-pointer ${
                    billingCycle === 'monthly'
                      ? 'bg-teal-500 text-white shadow-[0_4px_14px_rgba(20,184,166,0.4)]'
                      : 'bg-white/70 dark:bg-slate-900 text-slate-500 border border-teal-200/60 dark:border-white/10 hover:border-teal-300 dark:hover:border-white/30'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingCycle('yearly')}
                  className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-[0.15em] transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                    billingCycle === 'yearly'
                      ? 'bg-teal-500 text-white shadow-[0_4px_14px_rgba(20,184,166,0.4)]'
                      : 'bg-white/70 dark:bg-slate-900 text-slate-500 border border-teal-200/60 dark:border-white/10 hover:border-teal-300 dark:hover:border-white/30'
                  }`}
                >
                  Yearly
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-black tracking-wider ${
                    billingCycle === 'yearly' ? 'bg-white/30 text-white' : 'bg-emerald-100 text-emerald-600 border border-emerald-200'
                  }`}>
                    Save 30%
                  </span>
                </button>
              </div>

              <button
                onClick={() => {
                  setEditingPlan({ id: 'new', name: '', price: 0, transcription_limit: 0, translation_limit: 0, tts_limit: 0, storage_limit: 0, isNew: true });
                  setEditPlanName('');
                  setEditPlanPrice(0);
                  setEditPlanAudio(0);
                  setEditPlanTranslation(0);
                  setEditPlanTTS(0);
                  setEditPlanStorage(0);
                }}
                className="px-5 py-2.5 rounded-xl bg-teal-600/10 dark:bg-teal-600 hover:bg-teal-700 hover:text-slate-800 dark:hover:text-white text-teal-600 dark:text-teal-400 text-xs font-bold uppercase tracking-wider cursor-pointer shadow-sm transition-all active:scale-95 flex items-center gap-1.5 border border-teal-500/20"
              >
                <span>+ Create Plan</span>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...plans]
              .map(p => {
                if (p.name === 'Professional') return { ...p, name: 'Premium' };
                return p;
              })
              .filter(p => p.name === 'Free' || p.name === 'Starter' || p.name === 'Premium')
              .sort((a, b) => a.price - b.price)
              .map((p) => {
                const activeCustomers = p.name === 'Free' ? 12 : p.name === 'Starter' ? 8 : 4;
                const revenueGenerated = activeCustomers * p.price;
                
                const monthlyPrice = p.price;
                const yearlyPerMonth = +(p.price * 0.7).toFixed(0);
                const displayPrice = billingCycle === 'yearly' ? yearlyPerMonth : monthlyPrice;

                const subtitle = p.name === 'Free' ? 'Individual (Trial)' : p.name === 'Starter' ? 'Individual' : 'Business';
                const iconName = p.name === 'Free' ? 'box' : p.name === 'Starter' ? 'trending' : 'diamond';

                return (
                  <div 
                    key={p.id}
                    className="flex flex-col justify-between transition-all duration-300 relative overflow-hidden rounded-[2.5rem] bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 shadow-xl max-w-[340px] mx-auto w-full"
                    style={{ minHeight: '520px' }}
                  >
                    <div className="bg-slate-50 dark:bg-slate-900/40 p-6 pt-8 pb-8 flex flex-col items-center relative border-b-4 border-emerald-500 rounded-b-[2rem]">
                      <div className="flex justify-between items-start w-full mb-1">
                        <div className="text-left">
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-xl font-extrabold text-slate-900 dark:text-white">{p.name}</h4>
                            {p.name === 'Free' && (
                              <span className="px-1.5 py-0.5 bg-emerald-500 text-white text-[8px] font-black uppercase tracking-wider rounded-md shadow-sm">
                                7 Days
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">{subtitle}</p>
                        </div>
                        <div className="text-emerald-500 opacity-80">
                          {iconName === 'box' && <Building2 size={24} />}
                          {iconName === 'trending' && <TrendingUp size={24} />}
                          {iconName === 'diamond' && <Sparkles size={24} />}
                        </div>
                      </div>

                      <div className="flex items-baseline justify-center gap-1 mt-6">
                        <span className="text-4xl font-black text-slate-900 dark:text-white">${displayPrice}</span>
                        <span className="text-xs font-bold text-slate-550 dark:text-slate-400 uppercase tracking-wider">/ Month</span>
                      </div>

                      {billingCycle === 'yearly' && p.price > 0 && (
                        <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mt-1.5">
                          Billed as ${(displayPrice * 12).toFixed(0)} / year
                        </p>
                      )}

                      <div className="mt-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          p.active ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-550/20'
                        }`}>
                          {p.active ? 'Active' : 'Disabled'}
                        </span>
                      </div>
                    </div>

                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <ul className="space-y-3.5 mb-6 text-left">
                        <li className="flex items-center gap-2.5 text-xs font-semibold text-slate-600 dark:text-slate-300">
                          <Check size={14} className="text-emerald-500 shrink-0 stroke-[3]" />
                          <span className="font-extrabold text-slate-900 dark:text-white mr-0.5">{p.transcription_limit} mins</span> Audio Transcriptions
                        </li>
                        <li className="flex items-center gap-2.5 text-xs font-semibold text-slate-600 dark:text-slate-300">
                          <Check size={14} className="text-emerald-500 shrink-0 stroke-[3]" />
                          <span className="font-extrabold text-slate-900 dark:text-white mr-0.5">{(p.translation_limit || 0).toLocaleString()}</span> Translation Chars
                        </li>
                        <li className="flex items-center gap-2.5 text-xs font-semibold text-slate-600 dark:text-slate-300">
                          <Check size={14} className="text-emerald-500 shrink-0 stroke-[3]" />
                          <span className="font-extrabold text-slate-900 dark:text-white mr-0.5">{(p.tts_limit || 0).toLocaleString()}</span> TTS Voice Chars
                        </li>
                        <li className="flex items-center gap-2.5 text-xs font-semibold text-slate-600 dark:text-slate-300">
                          <Check size={14} className="text-emerald-500 shrink-0 stroke-[3]" />
                          <span className="font-extrabold text-slate-900 dark:text-white mr-0.5">{p.storage_limit} MB</span> Cloud Storage
                        </li>
                      </ul>

                      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 space-y-1.5 text-xs font-bold text-slate-500 dark:text-slate-400">
                        <div className="flex justify-between">
                          <span>Active Workspaces:</span>
                          <span className="text-slate-900 dark:text-white">{activeCustomers}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Revenue Generated:</span>
                          <span className="text-emerald-600 dark:text-emerald-500">${revenueGenerated.toLocaleString()}/mo</span>
                        </div>
                      </div>

                      <div className="mt-5 grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                        <button 
                          onClick={() => {
                            setEditingPlan(p);
                            setEditPlanName(p.name);
                            setEditPlanPrice(p.price);
                            setEditPlanAudio(p.transcription_limit);
                            setEditPlanTranslation(p.translation_limit || 0);
                            setEditPlanTTS(p.tts_limit || 0);
                            setEditPlanStorage(p.storage_limit);
                          }}
                          className="bg-slate-55/40 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-white py-1.5 rounded-lg text-sm font-bold cursor-pointer border border-slate-200 dark:border-slate-800 flex justify-center items-center active:scale-95 transition-all"
                          title="Edit Plan"
                        >
                          <Edit size={16} />
                        </button>
                        
                        <button 
                          onClick={() => {
                            setConfirmDialog({
                              isOpen: true,
                              title: "Delete Plan",
                              message: "Are you sure you want to delete this plan? Workspaces using this plan might be affected.",
                              confirmText: "Yes, Delete Plan",
                              cancelText: "Cancel",
                              onConfirm: () => {
                                apiRequest(`/super-admin/plans/${p.id}`, { method: "DELETE" }).then(() => {
                                  showToast("Plan deleted successfully.", "success");
                                  loadData();
                                }).catch(err => {
                                  showToast(err.message || "Failed to delete plan", "error");
                                }).finally(() => {
                                  setConfirmDialog(prev => ({ ...prev, isOpen: false }));
                                });
                              }
                            });
                          }}
                          className="bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 py-1.5 rounded-lg text-sm font-bold cursor-pointer flex justify-center items-center border border-red-200/50 dark:border-red-950/30 active:scale-95 transition-all"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>

                        <button 
                          onClick={() => handleTogglePlanActive(p.id)}
                          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out place-self-center ${
                            p.active ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'
                          }`}
                          title={p.active ? "Disable" : "Enable"}
                        >
                          <span className="sr-only">Toggle Plan</span>
                          <span
                            aria-hidden="true"
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              p.active ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* ── 5. PROVIDERS TAB ── */}
      {activeTab === 'providers' && (
        <div className="space-y-6 animate-fadeIn">

          {/* Section 0: AI Provider Failover Manager */}
          <div className="glass-card rounded-2xl p-6 border border-violet-500/20 bg-violet-950/10">
            <ProviderManager />
          </div>

          {/* Section 1: AI Feature Provider Mapping */}
          <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-white/5 bg-white dark:bg-[#111827]/40">
            <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2 mb-4">
              <Sparkles className="text-emerald-500" size={18} />
              AI Feature Provider Mapping
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              Configure which AI provider handles each core platform feature. Users cannot override these global settings.
            </p>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-500 dark:text-slate-400">
                <thead className="text-xs font-bold uppercase bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300">
                  <tr>
                    <th className="px-4 py-3 rounded-tl-xl">Feature</th>
                    <th className="px-4 py-3">Provider</th>
                    <th className="px-4 py-3">Priority</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 rounded-tr-xl">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {featureMappings.map((mapping, idx) => (
                    <tr key={idx} className="border-b border-slate-200 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5">
                      <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">{mapping.feature}</td>
                      <td className="px-4 py-3">
                        <CustomDropdown
                          value={mapping.provider}
                          onChange={(val) => {
                            const newMappings = [...featureMappings];
                            newMappings[idx].provider = val;
                            setFeatureMappings(newMappings);
                          }}
                          options={[
                            { value: "OpenAI", label: `OpenAI ${mapping.feature === 'Translation' ? '⭐' : ''}`.trim() },
                            { value: "Deepgram", label: `Deepgram ${['Audio To Text', 'Transcription'].includes(mapping.feature) ? '⭐' : ''}`.trim() },
                            { value: "ElevenLabs", label: `ElevenLabs ${mapping.feature === 'Text To Speech' ? '⭐' : ''}`.trim() },
                            { value: "Whisper", label: `Whisper ${['Audio To Text', 'Transcription'].includes(mapping.feature) ? '⭐' : ''}`.trim() },
                            { value: "Google Translate", label: "Google Translate" },
                            { value: "Gemini", label: `Gemini ${mapping.feature === 'Translation' ? '👍' : ''}`.trim() },
                            { value: "Anthropic Claude", label: "Anthropic Claude" },
                            { value: "Tavily", label: "Tavily" },
                            { value: "Serper", label: "Serper" },
                            { value: "Azure OpenAI", label: "Azure OpenAI" }
                          ]}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input type="number" min="1" value={mapping.priority} onChange={(e) => {
                            const newMappings = [...featureMappings];
                            newMappings[idx].priority = Number(e.target.value);
                            setFeatureMappings(newMappings);
                          }} className="w-16 bg-transparent border border-slate-200 dark:border-white/10 rounded-lg px-2 py-1 outline-none text-center" />
                      </td>
                      <td className="px-4 py-3">
                        <button 
                          type="button"
                          role="switch"
                          aria-checked={mapping.enabled}
                          onClick={() => {
                            const newMappings = [...featureMappings];
                            newMappings[idx].enabled = !newMappings[idx].enabled;
                            setFeatureMappings(newMappings);
                          }} 
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${mapping.enabled ? 'bg-teal-500' : 'bg-slate-300 dark:bg-slate-600'}`}
                        >
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${mapping.enabled ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <button 
                          className="text-teal-600 hover:underline text-xs font-bold cursor-pointer" 
                          onClick={() => handleSaveMapping(idx)}
                        >
                          Save
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {/* Section 3: Global System Providers */}
            <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-white/5 bg-white dark:bg-[#111827]/40">
              <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                <Server className="text-teal-500" size={18} />
                Global System API Keys
              </h3>
              
              <div className="space-y-3">
                {providers.slice(0, 4).map((prov) => (
                  <div key={prov.provider_name} className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-slate-900/50">
                    <div className="flex flex-col gap-1 text-left">
                      <h4 className="text-sm font-extrabold capitalize text-slate-900 dark:text-white">{prov.provider_name.replace("-", " ")}</h4>
                      <div className="flex items-center gap-1.5">
                        <span className={`h-1.5 w-1.5 rounded-full ${prov.status === 'Healthy' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                          {prov.status === 'Healthy' ? 'Connected' : 'Offline'}
                        </span>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        setConfiguringProvider(prov);
                        setProviderKey('');
                        setProviderPriority(prov.priority || 1);
                        setProviderEnabled(prov.is_enabled !== false);
                      }}
                      className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white underline cursor-pointer"
                    >
                      Configure
                    </button>
                  </div>
                ))}
              </div>
              <button 
                onClick={() => {
                  setConfiguringProvider({ provider_name: 'openai', is_enabled: true, priority: 1, isNew: true });
                  setProviderKey('');
                  setProviderPriority(1);
                  setProviderEnabled(true);
                  setSelectedProvider('openai');
                }}
                className="w-full mt-4 py-2 rounded-xl bg-teal-600/10 text-teal-600 dark:text-teal-400 font-bold text-sm hover:bg-teal-600/20 cursor-pointer"
              >
                Add System Provider
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 6. USAGE ANALYTICS TAB ── */}
      {activeTab === 'usage_analytics' && (
        <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-white/5 bg-white dark:bg-white dark:bg-[#111827]/40 animate-fadeIn space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/5 pb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="text-teal-500" size={16} />
              Operational Usage Analytics
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-base border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-white/5 text-slate-500">
                  <th className="py-2.5">Workspace Tenant</th>
                  <th className="py-2.5">Voice/Speech usage</th>
                  <th className="py-2.5">Translation usage</th>
                  <th className="py-2.5">TTS synthesis</th>
                  <th className="py-2.5">Storage</th>
                </tr>
              </thead>
              <tbody>
                {usageAnalytics.map((u: any) => (
                  <tr key={u.slug} className="border-b border-slate-200 dark:border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-3 font-semibold text-slate-800 dark:text-white">
                      <div>{u.tenant_name}</div>
                      <div className="text-sm text-slate-500">/{u.slug}</div>
                    </td>
                    <td className="py-3 text-slate-800 dark:text-slate-200 font-bold font-mono">{u.speech_minutes} mins</td>
                    <td className="py-3 text-slate-800 dark:text-slate-200 font-mono">{u.translation_chars.toLocaleString()} chars</td>
                    <td className="py-3 text-slate-800 dark:text-slate-200 font-mono">{u.tts_chars.toLocaleString()} chars</td>
                    <td className="py-3 text-slate-600 dark:text-slate-400 font-mono font-bold">{u.storage_mb} MB</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {/* ── 7. BILLING DASHBOARD TAB ── */}
      {activeTab === 'billing' && billingOverview && (
        <div className="space-y-6 animate-fadeIn">
          {/* Sub-Tabs Selector */}
          <div className="flex border-b border-slate-200 dark:border-white/5 pb-2 gap-4">
            <button
              onClick={() => setBillingSubTab('analytics')}
              className={`text-base font-bold pb-2 transition-all cursor-pointer ${
                billingSubTab === 'analytics' 
                  ? 'text-teal-500 dark:text-teal-400 border-b-2 border-teal-500' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              Revenue Analytics
            </button>
            <button
              onClick={() => setBillingSubTab('invoices')}
              className={`text-base font-bold pb-2 transition-all cursor-pointer ${
                billingSubTab === 'invoices' 
                  ? 'text-teal-500 dark:text-teal-400 border-b-2 border-teal-500' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              Invoices ({billingOverview.invoices?.length || 0})
            </button>
            <button
              onClick={() => setBillingSubTab('payments')}
              className={`text-base font-bold pb-2 transition-all cursor-pointer ${
                billingSubTab === 'payments' 
                  ? 'text-teal-500 dark:text-teal-400 border-b-2 border-teal-500' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              Payments ({billingOverview.payments?.length || 0})
            </button>
            <button
              onClick={() => setBillingSubTab('subscriptions')}
              className={`text-base font-bold pb-2 transition-all cursor-pointer ${
                billingSubTab === 'subscriptions' 
                  ? 'text-teal-500 dark:text-teal-400 border-b-2 border-teal-500' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              Active Subscriptions ({billingOverview.subscriptions?.length || 0})
            </button>
          </div>

          {/* TAB 1: REVENUE ANALYTICS */}
          {billingSubTab === 'analytics' && (
            <div className="space-y-6">
              {/* Metrics Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="glass-card rounded-2xl p-4 border border-slate-200 dark:border-white/5 bg-white dark:bg-[#111827]/40">
                  <p className="text-sm font-black uppercase text-slate-500 tracking-wider">Today's Revenue</p>
                  <h3 className="text-2xl font-black text-emerald-400 mt-1">${(billingOverview.today_revenue || 0).toLocaleString()}</h3>
                </div>

                <div className="glass-card rounded-2xl p-4 border border-slate-200 dark:border-white/5 bg-white dark:bg-[#111827]/40">
                  <p className="text-sm font-black uppercase text-slate-500 tracking-wider">MRR</p>
                  <h3 className="text-2xl font-black text-teal-400 mt-1">${billingOverview.mrr.toLocaleString()}</h3>
                </div>

                <div className="glass-card rounded-2xl p-4 border border-slate-200 dark:border-white/5 bg-white dark:bg-[#111827]/40">
                  <p className="text-sm font-black uppercase text-slate-500 tracking-wider">ARR (Projected)</p>
                  <h3 className="text-2xl font-black text-emerald-400 mt-1">${(billingOverview.arr || billingOverview.mrr * 12).toLocaleString()}</h3>
                </div>

                <div className="glass-card rounded-2xl p-4 border border-slate-200 dark:border-white/5 bg-white dark:bg-[#111827]/40">
                  <p className="text-sm font-black uppercase text-slate-500 tracking-wider">Cumulative Revenue</p>
                  <h3 className="text-2xl font-black text-white mt-1">${billingOverview.total_revenue.toLocaleString()}</h3>
                </div>

                <div className="glass-card rounded-2xl p-4 border border-slate-200 dark:border-white/5 bg-white dark:bg-[#111827]/40">
                  <p className="text-sm font-black uppercase text-slate-500 tracking-wider">Payment Success Rate</p>
                  <h3 className="text-2xl font-black text-amber-400 mt-1">{(billingOverview.success_ratio || 95).toFixed(1)}%</h3>
                </div>
              </div>

              {/* Graphic Charts Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Trend Line Chart */}
                <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-slate-200 dark:border-white/5 bg-white dark:bg-[#111827]/40 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">Revenue Projections & Trends</h4>
                    <span className="text-sm px-2 py-0.5 rounded bg-teal-500/10 text-teal-400 font-bold">Past 7 Days</span>
                  </div>
                  <div className="w-full relative">
                    {(() => {
                      const trendValues = billingOverview.revenue_trend?.values || [1200, 1500, 1800, 2200, 2900, 3500, 4500];
                      const maxVal = Math.max(...trendValues, 100);
                      const minVal = Math.min(...trendValues, 0);
                      const rangeDiff = maxVal - minVal || 1;
                      const points = trendValues.map((val: number, idx: number) => {
                        const x = (idx / Math.max(1, trendValues.length - 1)) * 340 + 30;
                        const y = 120 - ((val - minVal) / rangeDiff) * 80;
                        return `${x},${y}`;
                      }).join(' ');

                      return (
                        <svg viewBox="0 0 400 150" className="w-full h-48 bg-slate-950/20 rounded-xl p-3 border border-white/5 overflow-visible">
                          <line x1="30" y1="20" x2="370" y2="20" stroke="rgba(255,255,255,0.03)" strokeDasharray="3" />
                          <line x1="30" y1="60" x2="370" y2="60" stroke="rgba(255,255,255,0.03)" strokeDasharray="3" />
                          <line x1="30" y1="100" x2="370" y2="100" stroke="rgba(255,255,255,0.03)" strokeDasharray="3" />
                          <line x1="30" y1="120" x2="370" y2="120" stroke="rgba(255,255,255,0.1)" />

                          {/* SVG Line path */}
                          <polyline
                            fill="none"
                            stroke="#3b82f6"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            points={points}
                          />

                          {/* Data point indicators */}
                          {trendValues.map((val: number, idx: number) => {
                            const x = (idx / Math.max(1, trendValues.length - 1)) * 340 + 30;
                            const y = 120 - ((val - minVal) / rangeDiff) * 80;
                            return (
                              <g key={idx}>
                                <circle cx={x} cy={y} r="3.5" fill="#3b82f6" stroke="#0f172a" strokeWidth="1.5" />
                                <text x={x} y={y - 8} fill="white" fontSize="7" fontWeight="bold" textAnchor="middle">${val}</text>
                                <text x={x} y="136" fill="#94a3b8" fontSize="7" textAnchor="middle">
                                  {billingOverview.revenue_trend?.labels?.[idx] || ''}
                                </text>
                              </g>
                            );
                          })}
                        </svg>
                      );
                    })()}
                  </div>
                </div>

                {/* Gateway spreads & success ratios */}
                <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-white/5 bg-white dark:bg-[#111827]/40 space-y-6 flex flex-col justify-between">
                  <div className="space-y-4">
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">Gateway Distribution</h4>
                    <div className="space-y-3">
                      {(() => {
                        const spread = billingOverview.gateway_spread || [];
                        const maxSpread = Math.max(...spread.map((s: any) => s.value), 1);
                        return spread.map((item: any, i: number) => {
                          const pct = (item.value / maxSpread) * 100;
                          return (
                            <div key={i} className="space-y-1">
                              <div className="flex justify-between text-sm font-bold">
                                <span className="text-slate-400 uppercase">{item.name}</span>
                                <span className="text-white">${item.value.toLocaleString()}</span>
                              </div>
                              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-teal-500 rounded-full" style={{ width: `${pct}%` }} />
                              </div>
                            </div>
                          );
                        });
                      })()}
                    </div>
                  </div>

                  {/* Circular success ratio representation */}
                  <div className="pt-4 border-t border-white/5 text-center space-y-2">
                    <span className="text-sm text-slate-400 font-bold uppercase tracking-wider">Gateway Checkout Health</span>
                    <div className="flex justify-center items-center gap-4">
                      {(() => {
                        const ratio = billingOverview.success_ratio || 95;
                        const radius = 32;
                        const circumference = 2 * Math.PI * radius;
                        const offset = circumference - (ratio / 100) * circumference;
                        return (
                          <div className="relative flex items-center justify-center">
                            <svg width="76" height="76" viewBox="0 0 80 80">
                              <circle cx="40" cy="40" r={radius} fill="transparent" stroke="rgba(255,255,255,0.03)" strokeWidth="6" />
                              <circle 
                                cx="40" 
                                cy="40" 
                                r={radius} 
                                fill="transparent" 
                                stroke="#10b981" 
                                strokeWidth="6" 
                                strokeDasharray={circumference} 
                                strokeDashoffset={offset} 
                                strokeLinecap="round" 
                                transform="rotate(-90 40 40)" 
                              />
                            </svg>
                            <span className="absolute text-sm font-black text-white">{ratio.toFixed(0)}%</span>
                          </div>
                        );
                      })()}
                      <div className="text-left text-sm font-semibold text-slate-400">
                        <div className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Success checkouts</div>
                        <div className="flex items-center gap-1 mt-1"><span className="h-2 w-2 rounded-full bg-red-500" /> Declines/Failures</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: INVOICES LOG */}
          {billingSubTab === 'invoices' && (
            <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-white/5 bg-white dark:bg-[#111827]/40 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CreditCard size={14} className="text-emerald-400" />
                Invoices Log
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-base border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400 font-bold font-sans">
                      <th className="py-2.5">Invoice #</th>
                      <th className="py-2.5">Workspace</th>
                      <th className="py-2.5">Billing Plan</th>
                      <th className="py-2.5">Amount</th>
                      <th className="py-2.5">Status</th>
                      <th className="py-2.5">Issued Date</th>
                      <th className="py-2.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {billingOverview.invoices?.map((inv: any) => (
                      <tr key={inv.id} className="border-b border-slate-200 dark:border-white/5 hover:bg-white/5 transition-colors">
                        <td className="py-3 font-mono font-bold text-slate-800 dark:text-white">
                          {inv.invoice_number}
                        </td>
                        <td className="py-3 text-slate-700 dark:text-white font-semibold">{inv.tenant_name}</td>
                        <td className="py-3 text-slate-550 dark:text-slate-400">{inv.plan}</td>
                        <td className="py-3 font-bold text-emerald-400">${inv.amount}</td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded text-sm font-black uppercase ${
                            inv.status.toLowerCase() === 'paid' 
                              ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                              : inv.status.toLowerCase() === 'failed' 
                                ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                                : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                          }`}>
                            {inv.status}
                          </span>
                        </td>
                        <td className="py-3 text-slate-500 font-mono">{inv.date}</td>
                        <td className="py-3 text-right space-x-1.5 font-semibold">
                          <a
                            href={`/api/billing/invoices/${inv.id}/download`}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-white/5 hover:bg-white/10 text-slate-700 dark:text-slate-350 hover:text-white px-2.5 py-1 rounded text-sm inline-flex items-center gap-0.5"
                          >
                            PDF
                          </a>
                          <button
                            onClick={() => handleEmailInvoice(inv.id)}
                            className="bg-teal-600/10 hover:bg-teal-600/20 text-teal-400 px-2 py-0.5 rounded text-sm"
                           title="Email"><Mail size={16} /></button>
                          <button
                            onClick={() => handleRegenerateInvoice(inv.id)}
                            className="bg-white/5 hover:bg-white/10 text-slate-700 dark:text-slate-300 hover:text-white px-2 py-0.5 rounded text-sm"
                          >
                            Regen
                          </button>
                        </td>
                      </tr>
                    ))}
                    {(!billingOverview.invoices || billingOverview.invoices.length === 0) && (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-slate-400 font-semibold">No invoices found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: PAYMENTS TAB */}
          {billingSubTab === 'payments' && (
            <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-white/5 bg-white dark:bg-[#111827]/40 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/5 pb-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <TrendingUp size={14} className="text-teal-400" />
                  Payments Tracking
                </h3>
                <button
                  onClick={exportPaymentsToCSV}
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-sm font-bold transition-all cursor-pointer"
                >
                  Export CSV
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-base border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400 font-bold font-sans">
                      <th className="py-2.5">Transaction ID</th>
                      <th className="py-2.5">Invoice #</th>
                      <th className="py-2.5">Tenant Name</th>
                      <th className="py-2.5">Workspace</th>
                      <th className="py-2.5">Plan</th>
                      <th className="py-2.5">Gateway</th>
                      <th className="py-2.5">Amount</th>
                      <th className="py-2.5">Status</th>
                      <th className="py-2.5">Payment Date</th>
                      <th className="py-2.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {billingOverview.payments?.map((p: any) => (
                      <tr key={p.id} className="border-b border-slate-200 dark:border-white/5 hover:bg-white/5 transition-colors">
                        <td className="py-3 font-mono font-bold text-slate-800 dark:text-white">
                          {p.transaction_id}
                        </td>
                        <td className="py-3 font-mono text-slate-650 dark:text-slate-350">{p.invoice_number}</td>
                        <td className="py-3 text-slate-700 dark:text-white font-semibold">{p.tenant_name}</td>
                        <td className="py-3 text-slate-500 font-mono">{p.workspace}</td>
                        <td className="py-3 text-slate-550 dark:text-slate-400 capitalize">{p.plan}</td>
                        <td className="py-3 text-slate-550 dark:text-slate-400 capitalize font-bold">{p.gateway}</td>
                        <td className="py-3 text-emerald-400 font-extrabold">${p.amount}</td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded text-sm font-black uppercase ${
                            p.status.toLowerCase() === 'success' 
                              ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                              : p.status.toLowerCase() === 'failed' 
                                ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                                : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                          }`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="py-3 text-slate-500 font-mono">{p.date}</td>
                        <td className="py-3 text-right space-x-1.5 font-semibold">
                          <button
                            onClick={() => setViewingPaymentDetails(p)}
                            className="bg-white/5 hover:bg-white/10 text-slate-700 dark:text-slate-300 px-2 py-1 rounded text-sm"
                          >
                            Details
                          </button>
                          {p.status.toLowerCase() === 'success' && p.receipt_url && (
                            <a
                              href={`${p.receipt_url}`}
                              target="_blank"
                              rel="noreferrer"
                              className="bg-teal-600/10 hover:bg-teal-600/20 text-teal-400 px-2 py-1 rounded text-sm inline-flex items-center gap-0.5"
                            >
                              Receipt
                            </a>
                          )}
                        </td>
                      </tr>
                    ))}
                    {(!billingOverview.payments || billingOverview.payments.length === 0) && (
                      <tr>
                        <td colSpan={10} className="py-8 text-center text-slate-400 font-semibold">No payments logged yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: SUBSCRIPTIONS */}
          {billingSubTab === 'subscriptions' && (
            <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-white/5 bg-white dark:bg-[#111827]/40 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                <CheckCircle2 size={14} className="text-teal-400" />
                Subscription Management
              </h3>

              {/* Cards Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                <div className="glass-card rounded-2xl p-4 border border-slate-200 dark:border-white/5 bg-white dark:bg-[#111827]/40">
                  <p className="text-sm font-black uppercase text-slate-500 tracking-wider">Total Revenue</p>
                  <h3 className="text-2xl font-black text-white mt-1">${(billingOverview.total_revenue || 0).toLocaleString()}</h3>
                </div>
                <div className="glass-card rounded-2xl p-4 border border-slate-200 dark:border-white/5 bg-white dark:bg-[#111827]/40">
                  <p className="text-sm font-black uppercase text-slate-500 tracking-wider">Active Subscriptions</p>
                  <h3 className="text-2xl font-black text-emerald-400 mt-1">{billingOverview.active_subscriptions || 0}</h3>
                </div>
                <div className="glass-card rounded-2xl p-4 border border-slate-200 dark:border-white/5 bg-white dark:bg-[#111827]/40">
                  <p className="text-sm font-black uppercase text-slate-500 tracking-wider">Expired Subscriptions</p>
                  <h3 className="text-2xl font-black text-red-500 mt-1">{billingOverview.expired_subscriptions || 0}</h3>
                </div>
                <div className="glass-card rounded-2xl p-4 border border-slate-200 dark:border-white/5 bg-white dark:bg-[#111827]/40">
                  <p className="text-sm font-black uppercase text-slate-500 tracking-wider">Monthly Revenue</p>
                  <h3 className="text-2xl font-black text-teal-400 mt-1">${(billingOverview.mrr || 0).toLocaleString()}</h3>
                </div>
                <div className="glass-card rounded-2xl p-4 border border-slate-200 dark:border-white/5 bg-white dark:bg-[#111827]/40">
                  <p className="text-sm font-black uppercase text-slate-500 tracking-wider">Yearly Revenue</p>
                  <h3 className="text-2xl font-black text-emerald-400 mt-1">${(billingOverview.arr || 0).toLocaleString()}</h3>
                </div>
              </div>

              {/* Filters / Search Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-white/5 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <Search size={14} className="text-slate-500 dark:text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search user, email, plan..."
                    value={subSearchTerm}
                    onChange={(e) => setSubSearchTerm(e.target.value)}
                    className="px-3 py-1.5 rounded-xl text-base bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-200 outline-none"
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    value={subStatusFilter}
                    onChange={(e) => setSubStatusFilter(e.target.value)}
                    className="px-2 py-1 rounded bg-white dark:bg-[#0B1020] border border-slate-200 dark:border-white/5 text-sm font-bold text-slate-700 dark:text-slate-300 outline-none"
                    style={{ background: 'var(--bg-subtle)' }}
                  >
                    <option value="">All Statuses</option>
                    <option value="Active">Active</option>
                    <option value="Expired">Expired</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                  <select
                    value={subCycleFilter}
                    onChange={(e) => setSubCycleFilter(e.target.value)}
                    className="px-2 py-1 rounded bg-white dark:bg-[#0B1020] border border-slate-200 dark:border-white/5 text-sm font-bold text-slate-700 dark:text-slate-300 outline-none"
                    style={{ background: 'var(--bg-subtle)' }}
                  >
                    <option value="">All Cycles</option>
                    <option value="monthly">Monthly Plan</option>
                    <option value="yearly">Yearly Plan</option>
                  </select>
                  <button
                    onClick={exportSubscriptionsToCSV}
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-sm font-bold transition-all cursor-pointer"
                  >
                    Export CSV
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-base border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400 font-bold font-sans">
                      <th className="py-2.5">User Name</th>
                      <th className="py-2.5">Email</th>
                      <th className="py-2.5">Plan</th>
                      <th className="py-2.5">Amount</th>
                      <th className="py-2.5">Payment Status</th>
                      <th className="py-2.5">Subscription Status</th>
                      <th className="py-2.5 font-mono">Start Date</th>
                      <th className="py-2.5 font-mono">Expiry Date</th>
                      <th className="py-2.5">Payment ID</th>
                      <th className="py-2.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {billingOverview.subscriptions?.filter((sub: any) => {
                      const matchSearch = (sub.user_name || '').toLowerCase().includes(subSearchTerm.toLowerCase()) ||
                                          (sub.email || '').toLowerCase().includes(subSearchTerm.toLowerCase()) ||
                                          (sub.plan || '').toLowerCase().includes(subSearchTerm.toLowerCase());
                      const matchStatus = subStatusFilter === '' || sub.status === subStatusFilter;
                      const matchCycle = subCycleFilter === '' || sub.billing_cycle === subCycleFilter;
                      return matchSearch && matchStatus && matchCycle;
                    }).map((sub: any) => (
                      <tr key={sub.id} className="border-b border-slate-200 dark:border-white/5 hover:bg-white/5 transition-colors">
                        <td className="py-3 font-semibold text-slate-700 dark:text-white">{sub.user_name || 'N/A'}</td>
                        <td className="py-3 font-mono text-slate-500 dark:text-slate-450">{sub.email || 'N/A'}</td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 rounded text-sm font-bold bg-teal-500/10 text-teal-400 border border-teal-500/20 capitalize">
                            {sub.plan}
                          </span>
                        </td>
                        <td className="py-3 text-white font-bold">${sub.amount || 0}</td>
                        <td className="py-3 text-slate-400">{sub.payment_status || 'N/A'}</td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded text-sm font-bold border uppercase ${
                            sub.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                            sub.status === 'Expired' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                            'bg-amber-500/10 text-amber-500 border-amber-500/20'
                          }`}>
                            {sub.status || 'Active'}
                          </span>
                        </td>
                        <td className="py-3 text-slate-500 font-mono">{sub.started || '-'}</td>
                        <td className="py-3 text-slate-500 font-mono font-bold">{sub.expires}</td>
                        <td className="py-3 font-mono text-sm text-slate-400">{sub.payment_id || 'N/A'}</td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => handleRenewPlan(sub.tenant_name)}
                            className="bg-teal-600/15 hover:bg-teal-600/25 text-teal-400 px-2.5 py-1 rounded text-sm font-bold cursor-pointer"
                          >
                            Renew Plan
                          </button>
                        </td>
                      </tr>
                    ))}
                    {(!billingOverview.subscriptions || billingOverview.subscriptions.length === 0) && (
                      <tr>
                        <td colSpan={10} className="py-8 text-center text-slate-400 font-semibold">No subscriptions found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Billing & Gateway Configurations Form */}
          {gatewaySettings && (
            <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-white/5 bg-white dark:bg-[#111827]/40 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Settings size={14} className="text-teal-500" />
                Global Gateway & Invoicing Settings (Super Admin)
              </h3>
              <form onSubmit={handleSaveBillingSettings} className="space-y-4 text-base">
                
                {/* Invoice Customization Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-white/5 pb-4">
                  <div className="space-y-1">
                    <label className="text-sm font-bold uppercase tracking-wider text-slate-400">Company Name</label>
                    <input
                      type="text"
                      value={gatewaySettings.company_name}
                      onChange={(e) => setGatewaySettings({ ...gatewaySettings, company_name: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-200 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-bold uppercase tracking-wider text-slate-400">Company Email</label>
                    <input
                      type="email"
                      value={gatewaySettings.company_email}
                      onChange={(e) => setGatewaySettings({ ...gatewaySettings, company_email: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-200 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-bold uppercase tracking-wider text-slate-400">Company Address</label>
                    <input
                      type="text"
                      value={gatewaySettings.company_address}
                      onChange={(e) => setGatewaySettings({ ...gatewaySettings, company_address: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-200 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 border-b border-white/5 pb-4">
                  <div className="space-y-1">
                    <label className="text-sm font-bold uppercase tracking-wider text-slate-400">Currency</label>
                    <select
                      value={gatewaySettings.currency}
                      onChange={(e) => setGatewaySettings({ ...gatewaySettings, currency: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-200 outline-none"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="INR">INR (₹)</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-bold uppercase tracking-wider text-slate-400">GST Percentage (%)</label>
                    <input
                      type="number"
                      value={gatewaySettings.gst_percentage}
                      onChange={(e) => setGatewaySettings({ ...gatewaySettings, gst_percentage: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-200 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-bold uppercase tracking-wider text-slate-400">Invoice Number Prefix</label>
                    <input
                      type="text"
                      value={gatewaySettings.invoice_prefix}
                      onChange={(e) => setGatewaySettings({ ...gatewaySettings, invoice_prefix: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-200 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-bold uppercase tracking-wider text-slate-400">Default Gateway</label>
                    <select
                      value={gatewaySettings.default_gateway}
                      onChange={(e) => setGatewaySettings({ ...gatewaySettings, default_gateway: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-200 outline-none"
                    >
                      <option value="stripe">Stripe</option>
                      <option value="razorpay">Razorpay</option>
                      <option value="upi">UPI QR Pay</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1 border-b border-white/5 pb-4">
                  <label className="text-sm font-bold uppercase tracking-wider text-slate-400">Invoice Footer Note</label>
                  <textarea
                    rows={2}
                    value={gatewaySettings.invoice_footer}
                    onChange={(e) => setGatewaySettings({ ...gatewaySettings, invoice_footer: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-200 outline-none font-sans"
                  />
                </div>

                {/* Gateway Keys configuration */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                  {/* Stripe Panel */}
                  <div className="p-4 rounded-xl bg-slate-950/20 border border-white/5 space-y-3">
                    <div className="flex justify-between items-center">
                      <strong className="text-white">Stripe Checkout</strong>
                      <input
                        type="checkbox"
                        checked={gatewaySettings.stripe_enabled}
                        onChange={(e) => setGatewaySettings({ ...gatewaySettings, stripe_enabled: e.target.checked })}
                      />
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="space-y-1">
                        <label className="text-slate-400 font-bold uppercase">Publishable Key</label>
                        <input
                          type="text"
                          value={gatewaySettings.stripe_public_key}
                          onChange={(e) => setGatewaySettings({ ...gatewaySettings, stripe_public_key: e.target.value })}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950/40 border border-white/5 text-slate-200 outline-none font-mono"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-slate-400 font-bold uppercase">Secret Key</label>
                        <input
                          type="password"
                          value={gatewaySettings.stripe_secret_key || ''}
                          onChange={(e) => setGatewaySettings({ ...gatewaySettings, stripe_secret_key: e.target.value })}
                          placeholder="sk_test_••••••••••••••••"
                          className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950/40 border border-white/5 text-slate-200 outline-none font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Razorpay Panel */}
                  <div className="p-4 rounded-xl bg-slate-950/20 border border-white/5 space-y-3">
                    <div className="flex justify-between items-center">
                      <strong className="text-white">Razorpay Gateway</strong>
                      <input
                        type="checkbox"
                        checked={gatewaySettings.razorpay_enabled}
                        onChange={(e) => setGatewaySettings({ ...gatewaySettings, razorpay_enabled: e.target.checked })}
                      />
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="space-y-1">
                        <label className="text-slate-400 font-bold uppercase">Key ID</label>
                        <input
                          type="text"
                          value={gatewaySettings.razorpay_key_id}
                          onChange={(e) => setGatewaySettings({ ...gatewaySettings, razorpay_key_id: e.target.value })}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950/40 border border-white/5 text-slate-200 outline-none font-mono"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-slate-400 font-bold uppercase">Key Secret</label>
                        <input
                          type="password"
                          value={gatewaySettings.razorpay_key_secret || ''}
                          onChange={(e) => setGatewaySettings({ ...gatewaySettings, razorpay_key_secret: e.target.value })}
                          placeholder="rzp_secret_••••••••••••"
                          className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950/40 border border-white/5 text-slate-200 outline-none font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* UPI Panel */}
                  <div className="p-4 rounded-xl bg-slate-950/20 border border-white/5 space-y-3">
                    <div className="flex justify-between items-center">
                      <strong className="text-white">UPI QR Code</strong>
                      <input
                        type="checkbox"
                        checked={gatewaySettings.upi_enabled}
                        onChange={(e) => setGatewaySettings({ ...gatewaySettings, upi_enabled: e.target.checked })}
                      />
                    </div>
                    <div className="space-y-2 text-sm h-full">
                      <div className="space-y-1">
                        <label className="text-slate-400 font-bold uppercase">VPA Address (UPI ID)</label>
                        <input
                          type="text"
                          value={gatewaySettings.upi_id}
                          onChange={(e) => setGatewaySettings({ ...gatewaySettings, upi_id: e.target.value })}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950/40 border border-white/5 text-slate-200 outline-none font-mono"
                        />
                      </div>
                      <p className="text-sm text-slate-500 leading-relaxed font-semibold pt-1">QR Code generator will render payment intents pointing to this merchant address automatically.</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2.5 px-6 rounded-xl transition-all cursor-pointer shadow-lg shadow-teal-600/10"
                  >
                    Save Configuration Keys
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* ── 8. AI LOGS TAB ── */}
      {activeTab === 'ai_logs' && (
        <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-white/5 bg-white dark:bg-white dark:bg-[#111827]/40 animate-fadeIn space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/5 pb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Activity size={14} className="text-teal-400" />
              Unified AI Activity Logs
            </h3>
            <div className="flex items-center gap-3">
              <select
                value={logTimeFilter}
                onChange={(e) => setLogTimeFilter(e.target.value as any)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-200 outline-none cursor-pointer hover:border-slate-300 transition-colors"
              >
                <option value="all" className="bg-white dark:bg-slate-900 text-slate-850 dark:text-slate-100">All Time</option>
                <option value="today" className="bg-white dark:bg-slate-900 text-slate-850 dark:text-slate-100">Today</option>
                <option value="weekly" className="bg-white dark:bg-slate-900 text-slate-850 dark:text-slate-100">Weekly</option>
                <option value="monthly" className="bg-white dark:bg-slate-900 text-slate-850 dark:text-slate-100">Monthly</option>
              </select>

              <div className="flex items-center gap-2">
                <Search size={14} className="text-slate-500 dark:text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-3 py-1.5 rounded-xl text-base bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-200 outline-none placeholder-slate-500"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-base border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-white/5 text-slate-500">
                  <th className="py-2.5">Time</th>
                  <th className="py-2.5">Tenant Workspace</th>
                  <th className="py-2.5">AI Feature</th>
                  <th className="py-2.5">Model Provider</th>
                  <th className="py-2.5">Response Time</th>
                  <th className="py-2.5">Cost</th>
                  <th className="py-2.5">Status</th>
                </tr>
              </thead>
              <tbody>
                {aiLogs
                  .filter(l => l.tenant.toLowerCase().includes(searchTerm.toLowerCase()) || l.feature.toLowerCase().includes(searchTerm.toLowerCase()) || l.provider.toLowerCase().includes(searchTerm.toLowerCase()))
                  .filter(l => {
                    if (logTimeFilter === 'all') return true;
                    if (!l.timestamp) return true;
                    const logDate = new Date(l.timestamp);
                    const now = new Date();
                    if (logTimeFilter === 'today') {
                      return logDate.toDateString() === now.toDateString();
                    }
                    if (logTimeFilter === 'weekly') {
                      const diffTime = Math.abs(now.getTime() - logDate.getTime());
                      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                      return diffDays <= 7;
                    }
                    if (logTimeFilter === 'monthly') {
                      return logDate.getMonth() === now.getMonth() && logDate.getFullYear() === now.getFullYear();
                    }
                    return true;
                  })
                  .map((log: any, idx: number) => {
                    const duration = log.provider === 'openai' ? '450ms' : log.provider === 'deepgram' ? '320ms' : '820ms';
                    return (
                      <tr key={idx} className="border-b border-slate-200 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                        <td className="py-3 font-mono text-slate-500 dark:text-slate-400">{log.time}</td>
                        <td className="py-3 font-semibold text-slate-900 dark:text-white">{log.tenant}</td>
                        <td className="py-3 text-slate-850 dark:text-slate-200 font-bold">{log.feature}</td>
                        <td className="py-3">
                          <span className="px-2.5 py-1 rounded-full text-xs font-black bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 uppercase tracking-wider">
                            {log.provider}
                          </span>
                        </td>
                        <td className="py-3 text-slate-600 dark:text-slate-400 font-mono">{duration}</td>
                        <td className="py-3 font-mono text-emerald-600 dark:text-emerald-400 font-extrabold">{log.cost}</td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 rounded text-xs font-black bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── 9. AUDIT LOGS TAB ── */}
      {activeTab === 'audit_logs' && (
        <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-white/5 bg-white dark:bg-white dark:bg-[#111827]/40 animate-fadeIn space-y-6">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="text-teal-500" size={16} />
            Platform Administration Audit Trails
          </h3>
          
          <div className="relative border-l border-slate-200 dark:border-white/5 ml-4 pl-6 space-y-6">
            {auditLogs.map((log: any, idx: number) => (
              <div key={idx} className="relative group">
                <div className="absolute -left-9 top-0.5 h-6 w-6 rounded-full bg-white dark:bg-[#0B1020] border border-teal-500/40 text-teal-400 flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
                  <ShieldCheck size={12} />
                </div>
                
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-base font-bold text-slate-800 dark:text-white">{log.actor}</span>
                    <span className="px-2.5 py-0.5 rounded text-sm font-bold bg-teal-500/10 text-teal-400 border border-teal-500/20">
                      {log.action}
                    </span>
                    <span className="text-sm text-slate-500 dark:text-slate-600 dark:text-slate-400 font-mono">{log.time}</span>
                  </div>
                  <p className="text-base text-slate-700 dark:text-slate-300 font-bold mt-1">{log.target}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 10. SYSTEM HEALTH TAB ── */}
      {activeTab === 'system_health' && systemHealth && (
        <div className="space-y-6 animate-fadeIn">
          {/* Resource Usage Gauges */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-white/5 bg-white dark:bg-[#111827]/40">
              <p className="text-sm uppercase font-bold text-slate-500">CPU LOAD</p>
              <div className="flex items-center justify-between mt-2.5">
                <h4 className="text-3xl font-black text-slate-900 dark:text-white">{systemHealth.cpu}</h4>
                <div className="w-24 h-2 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden border border-slate-200 dark:border-white/5">
                  <div className="h-full bg-teal-500" style={{ width: systemHealth.cpu }} />
                </div>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-white/5 bg-white dark:bg-[#111827]/40">
              <p className="text-sm uppercase font-bold text-slate-500">RAM USAGE</p>
              <div className="flex items-center justify-between mt-2.5">
                <h4 className="text-3xl font-black text-slate-900 dark:text-white">{systemHealth.ram}</h4>
                <div className="w-24 h-2 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden border border-slate-200 dark:border-white/5">
                  <div className="h-full bg-teal-500" style={{ width: systemHealth.ram }} />
                </div>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-white/5 bg-white dark:bg-[#111827]/40">
              <p className="text-sm uppercase font-bold text-slate-500">DISK SPACE USED</p>
              <div className="flex items-center justify-between mt-2.5">
                <h4 className="text-3xl font-black text-slate-900 dark:text-white">{systemHealth.disk}</h4>
                <div className="w-24 h-2 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden border border-slate-200 dark:border-white/5">
                  <div className="h-full bg-amber-500" style={{ width: systemHealth.disk }} />
                </div>
              </div>
            </div>
          </div>

          {/* Microservices Checklist */}
          <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-white/5 bg-white dark:bg-[#111827]/40 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Server size={14} className="text-teal-400" />
              Service Health
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(systemHealth.services).map(([service, status]: any) => (
                <div key={service} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/30 border border-slate-200 dark:border-white/5 flex items-center justify-between">
                  <span className="text-base font-bold text-slate-800 dark:text-slate-200">{service}</span>
                  <span className={`px-2 py-0.5 rounded text-sm font-black ${
                    status === 'Healthy' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                    status === 'Warning' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' : 'bg-red-500/10 text-red-500'
                  }`}>
                    {status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── 11. PLATFORM BUILDER TAB ── */}
      {activeTab === 'builder' && (
        <PlatformBuilder />
      )}

      {/* ── View Tenant Details Modal ── */}
      {viewingTenant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-lg overflow-hidden rounded-2xl p-6 bg-white dark:bg-slate-900 border border-white/10 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-white/5 pb-2">
              <h3 className="text-base font-bold text-slate-800 dark:text-white">Workspace: {viewingTenant.tenant_name}</h3>
              <button onClick={() => setViewingTenant(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            
            <div className="space-y-2 text-base">
              <div className="flex justify-between py-2 border-b border-slate-200 dark:border-white/5">
                <span className="text-slate-400">Owner</span>
                <span className="text-slate-800 dark:text-white font-bold">{viewingTenant.owner_name} ({viewingTenant.owner_email})</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-200 dark:border-white/5">
                <span className="text-slate-400">Total Members</span>
                <span className="text-slate-800 dark:text-white font-bold">{viewingTenant.users_count}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-200 dark:border-white/5">
                <span className="text-slate-400">Active Plan</span>
                <span className="text-teal-400 font-bold">{viewingTenant.plan?.name} (${viewingTenant.plan?.price}/mo)</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-200 dark:border-white/5">
                <span className="text-slate-400">Workspace Status</span>
                <span className="text-emerald-400 font-bold uppercase">{viewingTenant.status}</span>
              </div>
              
              <div className="pt-3">
                <p className="text-sm font-black uppercase text-teal-400 mb-2 tracking-wider">Resource Ingestion levels (MTD)</p>
                <div className="grid grid-cols-2 gap-3 p-3 bg-white dark:bg-white dark:bg-slate-950/40 rounded-xl border border-slate-200 dark:border-white/5">
                  <div>
                    <span className="text-sm text-slate-500">Speech Audio:</span>
                    <p className="text-base font-bold text-slate-800 dark:text-white mt-0.5">{viewingTenant.usage?.transcription_minutes} mins</p>
                  </div>
                  <div>
                    <span className="text-sm text-slate-500">Translation:</span>
                    <p className="text-base font-bold text-slate-800 dark:text-white mt-0.5">{(viewingTenant.usage?.translation_characters || 0).toLocaleString()} chars</p>
                  </div>
                  <div>
                    <span className="text-sm text-slate-500">TTS Audio:</span>
                    <p className="text-base font-bold text-slate-800 dark:text-white mt-0.5">{(viewingTenant.usage?.tts_characters || 0).toLocaleString()} chars</p>
                  </div>
                  <div>
                    <span className="text-sm text-slate-500">API Logs today:</span>
                    <p className="text-base font-bold text-slate-800 dark:text-white mt-0.5">{(viewingTenant.usage?.api_calls || 0).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 flex gap-3">
              <button
                onClick={() => {
                  setEditingTenant(viewingTenant);
                  setEditTenantName(viewingTenant.tenant_name);
                  setEditTenantPlanId(viewingTenant.plan?.id || '');
                  setViewingTenant(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-slate-800 dark:text-white text-base font-bold transition-all text-center cursor-pointer shadow-md"
              >
                Upgrade Plan limits
              </button>
              <button
                onClick={() => setViewingTenant(null)}
                className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-800 dark:text-white text-base font-bold transition-all text-center cursor-pointer border border-slate-200 dark:border-white/5"
              >
                Close details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Tenant Plan Modal */}
      {editingTenant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-sm overflow-hidden rounded-2xl p-6 bg-white dark:bg-slate-900 border border-white/10 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-white/5 pb-2">
              <h3 className="text-base font-bold text-slate-800 dark:text-white">Upgrade Tenant limits</h3>
              <button onClick={() => setEditingTenant(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-bold uppercase tracking-wider text-slate-400">Workspace</label>
                <input
                  type="text"
                  disabled
                  value={editTenantName}
                  className="w-full px-3 py-2 mt-1 rounded-xl text-base bg-white dark:bg-slate-950/20 border border-slate-200 dark:border-white/5 text-slate-500 outline-none"
                />
              </div>

              <div>
                <label className="text-sm font-bold uppercase tracking-wider text-slate-400">Billing Plan Tier</label>
                <select
                  value={editTenantPlanId}
                  onChange={(e) => setEditTenantPlanId(e.target.value)}
                  className="w-full px-3 py-2 mt-1 rounded-xl text-base bg-white dark:bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-100 outline-none"
                  style={{ background: 'var(--bg-subtle)' }}
                >
                  <option value="" className="text-slate-900 dark:text-slate-200 bg-white dark:bg-slate-950">Select plan tier...</option>
                  {plans.map(p => (
                    <option key={p.id} value={p.id} className="text-slate-900 dark:text-slate-200 bg-white dark:bg-slate-950">{p.name} (${p.price}/mo)</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-4 flex gap-3">
              <button
                onClick={() => handleUpgradeTenant(editingTenant.id, editTenantPlanId)}
                className="flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-slate-800 dark:text-white text-base font-bold cursor-pointer shadow-md"
              >
                Upgrade limits
              </button>
              <button
                onClick={() => setEditingTenant(null)}
                className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-800 dark:text-white text-base font-bold cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Details Modal */}
      {viewingPaymentDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-2xl p-6 space-y-4">
            <div className="flex justify-between items-start border-b border-slate-250 dark:border-white/5 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <CreditCard className="text-teal-500" size={16} />
                  Payment Transaction Details
                </h3>
                <p className="text-sm text-slate-500 mt-1">Detailed transaction receipt and gateway verification payload.</p>
              </div>
              <button 
                onClick={() => setViewingPaymentDetails(null)} 
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-base">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <span className="block text-sm font-bold text-slate-400 uppercase">Transaction ID</span>
                  <strong className="text-slate-800 dark:text-white font-mono">{viewingPaymentDetails.transaction_id}</strong>
                </div>
                <div className="space-y-1">
                  <span className="block text-sm font-bold text-slate-400 uppercase">Invoice Number</span>
                  <strong className="text-slate-800 dark:text-white font-mono">{viewingPaymentDetails.invoice_number}</strong>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <span className="block text-sm font-bold text-slate-400 uppercase">Tenant Name</span>
                  <strong className="text-slate-800 dark:text-white">{viewingPaymentDetails.tenant_name}</strong>
                </div>
                <div className="space-y-1">
                  <span className="block text-sm font-bold text-slate-400 uppercase">Workspace slug</span>
                  <strong className="text-slate-800 dark:text-white font-mono">{viewingPaymentDetails.workspace}</strong>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <span className="block text-sm font-bold text-slate-400 uppercase">Amount</span>
                  <strong className="text-emerald-500 font-extrabold">${viewingPaymentDetails.amount}</strong>
                </div>
                <div className="space-y-1">
                  <span className="block text-sm font-bold text-slate-400 uppercase">Gateway</span>
                  <strong className="text-slate-800 dark:text-white capitalize">{viewingPaymentDetails.gateway}</strong>
                </div>
                <div className="space-y-1">
                  <span className="block text-sm font-bold text-slate-400 uppercase">Status</span>
                  <span className={`inline-block px-1.5 py-0.5 rounded text-sm font-black uppercase ${
                    viewingPaymentDetails.status.toLowerCase() === 'success' 
                      ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                      : 'bg-red-500/10 text-red-500 border border-red-500/20'
                  }`}>
                    {viewingPaymentDetails.status}
                  </span>
                </div>
              </div>

              <div className="space-y-1 pt-2 border-t border-slate-200 dark:border-white/5">
                <span className="block text-sm font-bold text-slate-400 uppercase">Raw Gateway Response JSON</span>
                <pre className="w-full max-h-40 overflow-y-auto p-3 rounded-lg bg-slate-950 text-sm font-mono text-slate-300 border border-white/5 leading-relaxed whitespace-pre-wrap">
                  {(() => {
                    const mockPayload = {
                      transaction_id: viewingPaymentDetails.transaction_id,
                      payment_gateway: viewingPaymentDetails.gateway,
                      currency: viewingPaymentDetails.currency || "INR",
                      checkout_amount: viewingPaymentDetails.amount,
                      status: viewingPaymentDetails.status.toLowerCase() === 'success' ? 'captured' : 'failed',
                      timestamp: viewingPaymentDetails.date,
                      gateway_event: viewingPaymentDetails.status.toLowerCase() === 'success' ? 'payment.succeeded' : 'payment.failed',
                      simulated: true,
                      payment_method: {
                        type: viewingPaymentDetails.gateway === 'stripe' ? 'card' : viewingPaymentDetails.gateway === 'razorpay' ? 'netbanking' : 'upi',
                        issuer: viewingPaymentDetails.gateway === 'stripe' ? 'Visa (4242)' : viewingPaymentDetails.gateway === 'razorpay' ? 'SBI' : 'UPI QR'
                      }
                    };
                    return JSON.stringify(mockPayload, null, 2);
                  })()}
                </pre>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setViewingPaymentDetails(null)}
                className="w-full py-2.5 rounded-xl bg-white hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-800 dark:text-white text-base font-bold cursor-pointer transition-all"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

    
      {/* Custom Confirmation Dialog Modal */}
      {confirmDialog.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-2xl animate-slideUp">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
                  <AlertCircle className="text-red-500" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{confirmDialog.title}</h3>
                </div>
              </div>
              <button 
                onClick={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))} 
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>
            
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-8">
              {confirmDialog.message}
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
                className="flex-1 py-3 rounded-2xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-800 dark:text-white font-bold cursor-pointer transition-all"
              >
                {confirmDialog.cancelText}
              </button>
              <button
                onClick={confirmDialog.onConfirm}
                className="flex-1 py-3 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-bold cursor-pointer shadow-lg shadow-red-500/25 transition-all"
              >
                {confirmDialog.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Subscription Plan Modal */}
      {editingPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md overflow-hidden rounded-2xl p-6 bg-white dark:bg-slate-900 border border-white/10 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-white/5 pb-2">
              <h3 className="text-base font-bold text-slate-800 dark:text-white">
                {editingPlan.isNew ? "Create Subscription Plan" : "Edit Subscription Plan"}
              </h3>
              <button onClick={() => setEditingPlan(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-bold uppercase tracking-wider text-slate-400">Plan Name</label>
                <input
                  type="text"
                  value={editPlanName}
                  onChange={e => setEditPlanName(e.target.value)}
                  className="w-full px-3 py-2 mt-1 rounded-xl text-base bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-100 outline-none"
                />
              </div>

              <div>
                <label className="text-sm font-bold uppercase tracking-wider text-slate-400">Price ($/mo)</label>
                <input
                  type="number"
                  value={editPlanPrice}
                  onChange={e => setEditPlanPrice(parseFloat(e.target.value))}
                  className="w-full px-3 py-2 mt-1 rounded-xl text-base bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-100 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-bold uppercase tracking-wider text-slate-400">Audio Mins</label>
                  <input
                    type="number"
                    value={editPlanAudio}
                    onChange={e => setEditPlanAudio(parseInt(e.target.value))}
                    className="w-full px-3 py-2 mt-1 rounded-xl text-base bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-100 outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm font-bold uppercase tracking-wider text-slate-400">Storage (MB)</label>
                  <input
                    type="number"
                    value={editPlanStorage}
                    onChange={e => setEditPlanStorage(parseInt(e.target.value))}
                    className="w-full px-3 py-2 mt-1 rounded-xl text-base bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-100 outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm font-bold uppercase tracking-wider text-slate-400">Translation Chars</label>
                  <input
                    type="number"
                    value={editPlanTranslation}
                    onChange={e => setEditPlanTranslation(parseInt(e.target.value))}
                    className="w-full px-3 py-2 mt-1 rounded-xl text-base bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-100 outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm font-bold uppercase tracking-wider text-slate-400">TTS Chars</label>
                  <input
                    type="number"
                    value={editPlanTTS}
                    onChange={e => setEditPlanTTS(parseInt(e.target.value))}
                    className="w-full px-3 py-2 mt-1 rounded-xl text-base bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-100 outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 flex gap-3">
              <button
                onClick={() => {
                  const isNew = editingPlan.isNew;
                  const url = isNew ? '/super-admin/plans' : `/super-admin/plans/${editingPlan.id}`;
                  const method = isNew ? 'POST' : 'PATCH';
                  
                  apiRequest(url, {
                    method: method,
                    body: JSON.stringify({
                      name: editPlanName,
                      price: editPlanPrice,
                      transcription_limit: editPlanAudio,
                      translation_limit: editPlanTranslation,
                      tts_limit: editPlanTTS,
                      storage_limit: editPlanStorage
                    })
                  }).then(() => {
                    showToast(isNew ? "Plan created successfully" : "Plan updated successfully", "success");
                    setEditingPlan(null);
                    loadData();
                  }).catch(e => {
                    showToast(isNew ? "Failed to create plan" : "Failed to update plan", "error");
                  });
                }}
                className="flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-slate-800 dark:text-white text-base font-bold cursor-pointer shadow-md"
              >
                Save
              </button>
              <button
                onClick={() => setEditingPlan(null)}
                className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-800 dark:text-white text-base font-bold cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {subTab === 'settings-general' && <GeneralSettings />}
      {subTab === 'settings-tenant' && <TenantSettings />}
      {subTab === 'settings-smtp' && <SMTPSettings />}
      {subTab === 'settings-auth' && <AuthSettings />}
      {subTab === 'settings-security' && <SecuritySettings />}
      {subTab === 'settings-payments' && <PaymentSettings />}
      {subTab === 'settings-domains' && <DomainBranding />}
      {subTab === 'settings-apikeys' && <APIKeys />}
      {subTab === 'settings-backup' && <BackupRestore />}
      {subTab === 'settings-notifications' && <NotificationCenter />}
      {subTab === 'settings-activity' && <ActivityCenter />}

      {/* User Deletion Modal */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="glass-card rounded-2xl w-full max-w-sm p-6 border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 shadow-2xl space-y-6">
            <div className="text-center space-y-3">
              <div className="mx-auto bg-red-500/10 text-red-500 rounded-full w-12 h-12 flex items-center justify-center mb-2">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Delete User?</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Are you sure you want to delete this user? This action cannot be undone and will remove all their data.
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={confirmDeleteUser}
                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold shadow-md transition-all active:scale-95"
              >
                Delete
              </button>
              <button
                onClick={() => setUserToDelete(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 text-sm font-bold transition-all active:scale-95"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Configure Provider Modal */}
      {configuringProvider && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <form 
            onSubmit={handleConfigureProvider}
            className="glass-card rounded-2xl w-full max-w-md p-6 border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 shadow-2xl space-y-4 text-left"
          >
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-white/10 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {configuringProvider.isNew ? "Add System Provider" : `Configure ${configuringProvider.provider_name.replace("-", " ").toUpperCase()}`}
              </h3>
              <button 
                type="button" 
                onClick={() => setConfiguringProvider(null)} 
                className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {configuringProvider.isNew && (
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Select Provider</label>
                <select
                  value={selectedProvider}
                  onChange={(e) => setSelectedProvider(e.target.value)}
                  className="w-full px-3 py-2 mt-1 rounded-xl text-sm bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 outline-none font-semibold text-slate-900 dark:text-white"
                >
                  <option className="bg-white dark:bg-slate-900" value="openai">OpenAI</option>
                  <option className="bg-white dark:bg-slate-900" value="deepgram">Deepgram</option>
                  <option className="bg-white dark:bg-slate-900" value="elevenlabs">ElevenLabs</option>
                  <option className="bg-white dark:bg-slate-900" value="google-translate">Google Translate</option>
                  <option className="bg-white dark:bg-slate-900" value="gemini">Gemini</option>
                  <option className="bg-white dark:bg-slate-900" value="anthropic-claude">Anthropic Claude</option>
                  <option className="bg-white dark:bg-slate-900" value="brave-search">Brave Search</option>
                  <option className="bg-white dark:bg-slate-900" value="tavily">Tavily</option>
                  <option className="bg-white dark:bg-slate-900" value="serper">Serper</option>
                </select>
              </div>
            )}

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">API Key / Credentials</label>
              <input
                type="password"
                value={providerKey}
                onChange={(e) => setProviderKey(e.target.value)}
                placeholder={configuringProvider.isNew ? "Enter API Key" : "•••••••••••• (Leave blank to keep current)"}
                className="w-full px-3 py-2 mt-1 rounded-xl text-sm bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 outline-none text-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Priority</label>
                <input
                  type="number"
                  min="1"
                  value={providerPriority}
                  onChange={(e) => setProviderPriority(Number(e.target.value))}
                  className="w-full px-3 py-2 mt-1 rounded-xl text-sm bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 outline-none text-slate-900 dark:text-white text-center animate-none"
                />
              </div>

              <div className="flex flex-col justify-end pb-1.5">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="provider-enabled"
                    checked={providerEnabled}
                    onChange={(e) => setProviderEnabled(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-350 text-teal-600 focus:ring-teal-650 cursor-pointer"
                  />
                  <label htmlFor="provider-enabled" className="text-sm font-bold text-slate-700 dark:text-slate-300 cursor-pointer select-none">Enabled</label>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-3 border-t border-slate-200 dark:border-white/10">
              <button
                type="button"
                onClick={handleTestConnectionInModal}
                className="flex-1 py-2 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-bold hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer text-slate-800 dark:text-slate-200"
              >
                Test Connection
              </button>
              <button
                type="submit"
                className="flex-1 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-slate-800 dark:text-white text-xs font-bold shadow-lg cursor-pointer"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}
      {/* Password Reset Success Modal */}
      {resetPasswordInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="glass-card rounded-2xl w-full max-w-sm p-6 border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 shadow-2xl space-y-6 text-left">
            <div className="text-center space-y-3">
              <div className="mx-auto bg-emerald-500/10 text-emerald-500 rounded-full w-12 h-12 flex items-center justify-center mb-2">
                <Lock size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Temporary Password</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                A temporary password has been generated for: <br />
                <span className="font-extrabold text-slate-700 dark:text-slate-200">{resetPasswordInfo.userName}</span>
              </p>
            </div>

            <div className="relative flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950/40">
              <span className="font-mono text-sm font-black select-all text-slate-800 dark:text-slate-200">{resetPasswordInfo.tempPass}</span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(resetPasswordInfo.tempPass);
                  showToast("Password copied to clipboard!", "success");
                }}
                className="text-xs font-bold text-teal-600 hover:text-teal-700 cursor-pointer flex items-center gap-1"
                title="Copy Password"
              >
                <Copy size={14} /> Copy
              </button>
            </div>

            <p className="text-[11px] text-amber-600 dark:text-amber-400 text-center font-semibold">
              ⚠️ Share this password securely. The user will be required to change it upon log in.
            </p>

            <button
              type="button"
              onClick={() => setResetPasswordInfo(null)}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-sm font-bold shadow-md transition-all cursor-pointer active:scale-95"
            >
              Done
            </button>
          </div>
        </div>
      )}
      {/* Toast Alert Popup */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-2xl border text-sm font-semibold backdrop-blur-md transition-all duration-300 ${
              toastType === 'success' 
                ? 'bg-emerald-500/10 dark:bg-emerald-500/20 border-emerald-500/30 text-emerald-600 dark:text-emerald-400' 
                : toastType === 'error'
                  ? 'bg-red-500/10 dark:bg-red-500/20 border-red-500/30 text-red-600 dark:text-red-400'
                  : 'bg-blue-500/10 dark:bg-blue-500/20 border-blue-500/30 text-blue-600 dark:text-blue-400'
            }`}
          >
            {toastType === 'success' && <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />}
            {toastType === 'error' && <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />}
            {toastType === 'info' && <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />}
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
</div>
  );
};
