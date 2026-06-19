import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../utils/api';
import { 
  Building2, Users, CreditCard, Cpu, Check, 
  Loader2, Sparkles, Server, Trash2, ShieldCheck,
  AlertTriangle, Activity, Search,
  Ban, CheckCircle2,
  TrendingUp, Settings, MoreVertical,
  ArrowUpRight, Settings2
} from 'lucide-react';

import { PlatformBuilder } from './PlatformBuilder';

type TabType = 'overview' | 'tenants' | 'providers' | 'plans' | 'users' | 'usage_analytics' | 'billing' | 'ai_logs' | 'audit_logs' | 'system_health' | 'settings' | 'builder';

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

interface SuperAdminDashboardProps {
  subTab?: TabType;
}

export const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({ subTab }) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [metrics, setMetrics] = useState<any>(null);
  const [tenants, setTenants] = useState<any[]>([]);
  const [providers, setProviders] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  
  // Custom SaaS States
  const [usageAnalytics, setUsageAnalytics] = useState<any[]>([]);
  const [billingOverview, setBillingOverview] = useState<any>(null);
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

  // Active Dropdowns state
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Provider config inputs
  const [selectedProvider, setSelectedProvider] = useState('openai');
  const [providerKey, setProviderKey] = useState('');
  const [providerPriority, setProviderPriority] = useState(1);
  const [providerEnabled, setProviderEnabled] = useState(true);

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
      const metricsData = await apiRequest("/super-admin/metrics");
      setMetrics(metricsData);
      
      const tenantsData = await apiRequest("/super-admin/tenants");
      setTenants(tenantsData);
      
      const providersData = await apiRequest("/super-admin/providers");
      setProviders(providersData);
      
      const plansData = await apiRequest("/super-admin/plans");
      setPlans(plansData);

      const usersData = await apiRequest("/super-admin/users");
      setUsersList(usersData);

      const usageData = await apiRequest("/super-admin/analytics/usage");
      setUsageAnalytics(usageData);
 
      const billData = await apiRequest("/billing/admin/overview");
      setBillingOverview(billData);

      const settingsData = await apiRequest("/billing/settings");
      setGatewaySettings(settingsData);
 
      const aiLogData = await apiRequest("/super-admin/logs/ai");
      setAiLogs(aiLogData);
 
      const auditLogData = await apiRequest("/super-admin/logs/audit");
      setAuditLogs(auditLogData);
 
      const healthData = await apiRequest("/super-admin/health/system");
      setSystemHealth(healthData);

    } catch (err) {
      console.error("Failed to load super admin dashboard data:", err);
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
      alert(`Workspace status updated successfully to ${status}.`);
    } catch (err) {
      alert("Error updating tenant status.");
    } finally {
      // setActionLoading(null);
      setActiveMenuId(null);
    }
  };

  const handleUpgradeTenant = async (tenantId: string, planId: string) => {
    try {
      await apiRequest(`/super-admin/tenants/${tenantId}/plan`, {
        method: "PATCH",
        body: JSON.stringify({ plan_id: planId })
      });
      setEditingTenant(null);
      loadData();
      alert("Workspace billing plan upgraded successfully!");
    } catch (err) {
      alert("Error upgrading tenant plan.");
    }
  };

  const handleProvisionTenant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompany || !newSlug || !newAdminEmail || !newAdminPassword || !newAdminName) {
      alert("Please fill in all tenant creation fields.");
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
      alert("Tenant workspace and admin user generated successfully!");
      loadData();
    } catch (err: any) {
      alert(err.message || "Failed to provision workspace.");
    }
  };

  // Provider actions
  const handleConfigureProvider = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest("/super-admin/providers", {
        method: "POST",
        body: JSON.stringify({
          provider_name: selectedProvider,
          api_key: providerKey || null,
          priority: Number(providerPriority),
          is_enabled: providerEnabled
        })
      });
      setProviderKey('');
      alert("AI Provider updated successfully!");
      loadData();
    } catch (err) {
      alert("Failed to update provider configuration.");
    }
  };

  const handleTestProviderConnection = async (provName: string) => {
    try {
      const res = await apiRequest(`/super-admin/providers/${provName}/test-connection`, {
        method: "POST"
      });
      alert(res.message || "Connection verified successfully!");
    } catch (err) {
      alert("Failed to verify connection.");
    }
  };

  // Plan actions
  const handleClonePlan = async (planId: string) => {
    try {
      await apiRequest(`/super-admin/plans/${planId}/clone`, {
        method: "POST"
      });
      loadData();
      alert("Billing plan duplicated successfully!");
    } catch (err) {
      alert("Failed to duplicate plan.");
    }
  };

  const handleTogglePlanActive = async (planId: string) => {
    try {
      await apiRequest(`/super-admin/plans/${planId}/toggle-active`, {
        method: "PATCH"
      });
      loadData();
      alert("Plan status updated.");
    } catch (err) {
      alert("Failed to toggle plan status.");
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
      alert(`User status updated to ${nextStatus}.`);
    } catch (err) {
      alert("Failed to update user status.");
    }
  };

  const handleResetUserPassword = async (userId: string) => {
    try {
      const res = await apiRequest(`/super-admin/users/${userId}/reset-password`, {
        method: "POST"
      });
      alert(res.message || "Password reset successfully.");
    } catch (err) {
      alert("Failed to reset password.");
    }
  };

  const handleForceLogoutUser = async (userId: string) => {
    try {
      const res = await apiRequest(`/super-admin/users/${userId}/force-logout`, {
        method: "POST"
      });
      alert(res.message || "User session terminated.");
    } catch (err) {
      alert("Failed to force logout user.");
    }
  };

  // Billing Actions
  const handleRegenerateInvoice = async (invId: string) => {
    try {
      const res = await apiRequest(`/billing/invoices/${invId}/regenerate`, {
        method: "POST"
      });
      alert(res.message || "Invoice PDF regenerated successfully.");
      loadData();
    } catch (err) {
      alert("Failed to regenerate invoice PDF.");
    }
  };

  const handleEmailInvoice = async (invId: string) => {
    try {
      const res = await apiRequest(`/billing/invoices/${invId}/email`, {
        method: "POST"
      });
      alert(res.message || "Invoice email sent successfully.");
    } catch (err) {
      alert("Failed to send invoice email.");
    }
  };

  const handleRenewPlan = async (tenantName: string) => {
    const t = tenants.find(x => x.tenant_name === tenantName);
    if (!t) {
      alert("Tenant workspace details missing.");
      return;
    }
    try {
      const res = await apiRequest(`/billing/subscriptions/renew?tenant_id=${t.id}`, {
        method: "POST"
      });
      alert(res.message || "Subscription renewed successfully.");
      loadData();
    } catch (err) {
      alert("Failed to renew plan.");
    }
  };

  const handleSaveBillingSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest("/billing/settings", {
        method: "PATCH",
        body: JSON.stringify(gatewaySettings)
      });
      alert("Global billing and gateway configuration saved successfully!");
      loadData();
    } catch (err: any) {
      alert(err.message || "Failed to update global billing configurations.");
    }
  };

  if (loading) {
    return (
      <div className="flex h-48 items-center justify-center bg-transparent">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="animate-spin text-blue-500" size={32} />
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Loading metrics...</p>
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
            <div className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-white/5 bg-white/40 dark:bg-[#111827]/40 flex flex-col justify-between h-36">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Tenants</p>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{metrics.total_tenants}</h3>
                </div>
                <div className="h-9 w-9 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                  <Building2 size={18} />
                </div>
              </div>
              <div className="flex items-center justify-between mt-3">
                <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-0.5">
                  <ArrowUpRight size={12} /> +2 this wk
                </span>
                <Sparkline points={[5, 8, 12, 10, 15, 18, 25]} color="#3b82f6" />
              </div>
            </div>

            {/* Active Users */}
            <div className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-white/5 bg-white/40 dark:bg-[#111827]/40 flex flex-col justify-between h-36">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Users</p>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{metrics.active_users}</h3>
                </div>
                <div className="h-9 w-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                  <Users size={18} />
                </div>
              </div>
              <div className="flex items-center justify-between mt-3">
                <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-0.5">
                  <ArrowUpRight size={12} /> +12.4%
                </span>
                <Sparkline points={[150, 200, 280, 250, 310, 390, 430]} color="#10b981" />
              </div>
            </div>

            {/* Monthly Revenue */}
            <div className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-white/5 bg-white/40 dark:bg-[#111827]/40 flex flex-col justify-between h-36">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Monthly Revenue</p>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">${metrics.revenue_this_month?.toLocaleString()}</h3>
                </div>
                <div className="h-9 w-9 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-500">
                  <CreditCard size={18} />
                </div>
              </div>
              <div className="flex items-center justify-between mt-3">
                <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-0.5">
                  <ArrowUpRight size={12} /> +8.5%
                </span>
                <Sparkline points={[1200, 1400, 1800, 1600, 2100, 2250, 2450]} color="#8b5cf6" />
              </div>
            </div>

            {/* API Requests */}
            <div className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-white/5 bg-white/40 dark:bg-[#111827]/40 flex flex-col justify-between h-36">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">API Requests</p>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{(metrics.api_calls_today || 0).toLocaleString()}</h3>
                </div>
                <div className="h-9 w-9 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-500">
                  <Cpu size={18} />
                </div>
              </div>
              <div className="flex items-center justify-between mt-3">
                <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-0.5">
                  <ArrowUpRight size={12} /> +20%
                </span>
                <Sparkline points={[25000, 31000, 29000, 35000, 38000, 41000, 42000]} color="#06b6d4" />
              </div>
            </div>
          </div>

          {/* Health & Consumed resources Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Provider Health Panel */}
            <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-white/5 bg-white/40 dark:bg-[#111827]/40 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Server size={14} className="text-blue-500" />
                Provider Health Status
              </h3>
              <div className="space-y-2.5">
                {metrics.provider_health?.map((prov: any) => (
                  <div key={prov.provider} className="flex items-center justify-between p-3 rounded-xl bg-slate-100/50 dark:bg-slate-100/50 dark:bg-slate-100 dark:bg-slate-950/30 border border-slate-200 dark:border-white/5">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-800 dark:text-slate-200">{prov.provider}</span>
                    <span className={`flex items-center gap-1.5 text-[11px] font-black ${
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
            <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-slate-200 dark:border-white/5 bg-white/40 dark:bg-[#111827]/40 space-y-5">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Ingested Resources</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                    <span>Audio Transcriptions</span>
                    <span className="font-bold text-blue-500 dark:text-blue-400">{metrics.metrics?.transcription_minutes} mins consumed</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 dark:bg-slate-100 dark:bg-[#0B1020] rounded-full overflow-hidden border border-slate-300 dark:border-slate-200 dark:border-white/5">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: "35%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                    <span>Text Translation</span>
                    <span className="font-bold text-emerald-500 dark:text-emerald-400">{(metrics.metrics?.translation_characters || 0).toLocaleString()} chars</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 dark:bg-slate-100 dark:bg-[#0B1020] rounded-full overflow-hidden border border-slate-300 dark:border-slate-200 dark:border-white/5">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: "65%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                    <span>TTS Audio Synthesis</span>
                    <span className="font-bold text-amber-500 dark:text-amber-400">{(metrics.metrics?.tts_characters || 0).toLocaleString()} chars</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 dark:bg-slate-100 dark:bg-[#0B1020] rounded-full overflow-hidden border border-slate-300 dark:border-slate-200 dark:border-white/5">
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
                    <p className="text-[10px] text-amber-600 dark:text-amber-400/80 font-bold">Billing renewals soon</p>
                  </div>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pt-2">
                  There are <span className="text-slate-900 dark:text-slate-800 dark:text-white font-bold">{metrics.expiring_plans_count || 0}</span> workspace subscriptions renewing within the next 7 days.
                </p>
              </div>
            </div>

            {metrics.top_usage_tenants && (
              <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-slate-200 dark:border-white/5 bg-white/40 dark:bg-[#111827]/40 space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <TrendingUp size={14} className="text-blue-500" />
                  Top Resource Ingested Tenants
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
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
                        <tr key={ten.slug} className="border-b border-slate-200 dark:border-white/5 hover:bg-slate-100/50 dark:hover:bg-white/5 transition-colors">
                          <td className="py-2.5 font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                            <span className="text-slate-400 text-[10px] font-mono">#{idx+1}</span>
                            {ten.name}
                          </td>
                          <td className="py-2.5">
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400">
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
          <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-white/5 bg-white/40 dark:bg-white dark:bg-[#111827]/40 h-fit space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="text-blue-500" size={16} />
              Provision Tenant Workspace
            </h3>
            <form onSubmit={handleProvisionTenant} className="space-y-3.5">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Company Name</label>
                <input
                  type="text"
                  required
                  value={newCompany}
                  onChange={(e) => {
                    setNewCompany(e.target.value);
                    setNewSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-"));
                  }}
                  placeholder="ABC School"
                  className="w-full px-3.5 py-2.5 mt-1 rounded-xl text-xs bg-slate-100/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-200 outline-none focus:border-blue-500/50 transition-colors"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Workspace Slug</label>
                <input
                  type="text"
                  required
                  value={newSlug}
                  onChange={(e) => setNewSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                  placeholder="abc-school"
                  className="w-full px-3.5 py-2.5 mt-1 rounded-xl text-xs bg-slate-100/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-200 outline-none focus:border-blue-500/50 transition-colors"
                />
              </div>

              <div className="p-4 bg-slate-100/50 dark:bg-slate-100 dark:bg-slate-950/50 rounded-2xl border border-slate-200 dark:border-white/5 space-y-3">
                <p className="text-[10px] font-black uppercase text-blue-400 tracking-wider">Tenant Admin Settings</p>
                <div>
                  <label className="text-[9px] font-bold text-slate-500 dark:text-slate-400">Full Name</label>
                  <input
                    type="text"
                    required
                    value={newAdminName}
                    onChange={(e) => setNewAdminName(e.target.value)}
                    placeholder="Admin Name"
                    className="w-full px-2.5 py-2 mt-0.5 rounded-lg text-xs bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-200 outline-none"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-bold text-slate-500 dark:text-slate-400">Admin Email</label>
                  <input
                    type="email"
                    required
                    value={newAdminEmail}
                    onChange={(e) => setNewAdminEmail(e.target.value)}
                    placeholder="admin@abcschool.com"
                    className="w-full px-2.5 py-2 mt-0.5 rounded-lg text-xs bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-200 outline-none"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-bold text-slate-500 dark:text-slate-400">Admin Password</label>
                  <input
                    type="password"
                    required
                    value={newAdminPassword}
                    onChange={(e) => setNewAdminPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-2.5 py-2 mt-0.5 rounded-lg text-xs bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-200 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Billing Plan</label>
                <select
                  value={selectedPlanId}
                  onChange={(e) => setSelectedPlanId(e.target.value)}
                  className="w-full px-3.5 py-2.5 mt-1 rounded-xl text-xs bg-slate-100/50 dark:bg-slate-100 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-100 outline-none"
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
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-slate-800 dark:text-white text-xs font-bold cursor-pointer transition-colors shadow-lg"
              >
                Provision Tenant Workspace
              </button>
            </form>
          </div>

          {/* Tenants Table */}
          <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-slate-200 dark:border-white/5 bg-white/40 dark:bg-white dark:bg-[#111827]/40 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-white/5 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Active Tenants</h3>
              <div className="flex gap-2">
                <select
                  value={planFilter}
                  onChange={(e) => setPlanFilter(e.target.value)}
                  className="px-2 py-1 rounded bg-slate-100 dark:bg-[#0B1020] border border-slate-200 dark:border-white/5 text-[10px] font-bold text-slate-700 dark:text-slate-300 outline-none"
                >
                  <option value="">All Plans</option>
                  {plans.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                </select>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-2 py-1 rounded bg-slate-100 dark:bg-[#0B1020] border border-slate-200 dark:border-white/5 text-[10px] font-bold text-slate-700 dark:text-slate-300 outline-none"
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
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
                          <div className="text-[10px] font-mono text-slate-500">/{tenant.slug}</div>
                        </td>
                        <td className="py-3">
                          <div className="text-slate-700 dark:text-slate-300">{tenant.owner_name}</div>
                          <div className="text-[10px] text-slate-500">{tenant.owner_email}</div>
                        </td>
                        <td className="py-3 font-bold text-slate-800 dark:text-white">{tenant.users_count || 1}</td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            {tenant.plan?.name || "Free"}
                          </span>
                        </td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold tracking-wide uppercase ${
                            tenant.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                          }`}>
                            {tenant.status}
                          </span>
                        </td>
                        <td className="py-3 text-right relative">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => setViewingTenant(tenant)}
                              className="bg-blue-600/15 hover:bg-blue-600/25 text-blue-400 px-2 py-1 rounded text-[9px] font-bold cursor-pointer"
                            >
                              View
                            </button>
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
                                  className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-[10px] font-bold text-amber-500 hover:bg-amber-500/10"
                                >
                                  <Ban size={12} /> Suspend
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleUpdateTenantStatus(tenant.id, 'active')}
                                  className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-[10px] font-bold text-emerald-400 hover:bg-emerald-500/10"
                                >
                                  <CheckCircle2 size={12} /> Activate
                                </button>
                              )}
                              <button
                                onClick={() => {
                                  setEditingTenant(tenant);
                                  setEditTenantName(tenant.tenant_name);
                                  setEditTenantPlanId(tenant.plan?.id || '');
                                  setActiveMenuId(null);
                                }}
                                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-[10px] font-bold text-blue-400 hover:bg-blue-600/10"
                              >
                                <Settings2 size={12} /> Edit Plan
                              </button>
                              <div className="h-[1px] bg-white/5 my-1" />
                              <button
                                onClick={() => handleUpdateTenantStatus(tenant.id, 'deleted')}
                                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-[10px] font-bold text-red-500 hover:bg-red-500/10"
                              >
                                <Trash2 size={12} /> Delete
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
            <div className="glass-card rounded-2xl p-4 border border-slate-200 dark:border-white/5 bg-white/40 dark:bg-white dark:bg-[#111827]/40">
              <p className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Total Users</p>
              <h4 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">{usersList.length}</h4>
            </div>
            <div className="glass-card rounded-2xl p-4 border border-slate-200 dark:border-white/5 bg-white/40 dark:bg-white dark:bg-[#111827]/40">
              <p className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Active Users</p>
              <h4 className="text-xl font-extrabold text-emerald-400 mt-1">
                {usersList.filter(u => u.status === 'active').length}
              </h4>
            </div>
            <div className="glass-card rounded-2xl p-4 border border-slate-200 dark:border-white/5 bg-white/40 dark:bg-white dark:bg-[#111827]/40">
              <p className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Admins</p>
              <h4 className="text-xl font-extrabold text-blue-400 mt-1">
                {usersList.filter(u => u.role === 'tenant_admin' || u.role === 'super_admin').length}
              </h4>
            </div>
            <div className="glass-card rounded-2xl p-4 border border-slate-200 dark:border-white/5 bg-white/40 dark:bg-white dark:bg-[#111827]/40">
              <p className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Managers</p>
              <h4 className="text-xl font-extrabold text-violet-400 mt-1">
                {usersList.filter(u => u.role === 'manager').length}
              </h4>
            </div>
          </div>

          {/* Table */}
          <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-white/5 bg-white/40 dark:bg-white dark:bg-[#111827]/40 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/5 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Platform Users</h3>
              <div className="flex items-center gap-2">
                <Search size={14} className="text-slate-500 dark:text-slate-400" />
                <input
                  type="text"
                  placeholder="Search email, name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-3 py-1.5 rounded-xl text-xs bg-slate-100/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-200 outline-none placeholder-slate-500"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
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
                          <div className="h-8 w-8 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/20 flex items-center justify-center font-bold text-xs uppercase">
                            {user.name.substring(0, 2)}
                          </div>
                          <span>{user.name}</span>
                        </td>
                        <td className="py-3 text-slate-700 dark:text-slate-300 font-mono">{user.email}</td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-violet-500/10 text-violet-400 border border-violet-500/20 uppercase">
                            {user.role}
                          </span>
                        </td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${
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
                            className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 px-2 py-1 rounded text-[9px] font-bold cursor-pointer"
                          >
                            {user.status === 'active' ? 'Disable' : 'Enable'}
                          </button>
                          <button
                            onClick={() => handleResetUserPassword(user.id)}
                            className="bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 px-2 py-1 rounded text-[9px] font-bold cursor-pointer"
                          >
                            Reset Password
                          </button>
                          <button
                            onClick={() => handleForceLogoutUser(user.id)}
                            className="bg-red-500/10 hover:bg-red-500/20 text-red-400 px-2 py-1 rounded text-[9px] font-bold cursor-pointer"
                          >
                            Force Logout
                          </button>
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
        <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-white/5 bg-white/40 dark:bg-white dark:bg-[#111827]/40 animate-fadeIn space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/5 pb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Subscription Limit Catalog</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {plans.map((p) => {
              const activeCustomers = p.name === 'Free' ? 12 : p.name === 'Starter' ? 8 : p.name === 'Professional' ? 4 : 1;
              const revenueGenerated = activeCustomers * p.price;
              return (
                <div 
                  key={p.id}
                  className="p-5 rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-100/50 dark:bg-slate-100 dark:bg-slate-950/40 flex flex-col justify-between hover:border-white/10 transition-colors"
                >
                  <div>
                    <div className="flex justify-between items-center">
                      <h4 className="text-base font-extrabold text-slate-900 dark:text-white">{p.name}</h4>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                        p.active ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
                      }`}>
                        {p.active ? 'Active' : 'Disabled'}
                      </span>
                    </div>
                    <div className="mt-2 text-2xl font-black text-blue-400">${p.price} <span className="text-[10px] font-bold text-slate-500">/ mo</span></div>
                    
                    <ul className="mt-4 space-y-2 text-[10px] font-semibold text-slate-400 border-t border-slate-200 dark:border-white/5 pt-3">
                      <li className="flex justify-between">
                        <span>Audio Limits:</span>
                        <span className="text-slate-800 dark:text-white font-bold">{p.transcription_limit} mins</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Translation:</span>
                        <span className="text-slate-800 dark:text-white font-bold">{(p.translation_limit || 0).toLocaleString()} chars</span>
                      </li>
                      <li className="flex justify-between">
                        <span>TTS Synthesis:</span>
                        <span className="text-slate-800 dark:text-white font-bold">{(p.tts_limit || 0).toLocaleString()} chars</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Storage MB:</span>
                        <span className="text-slate-800 dark:text-white font-bold">{p.storage_limit} MB</span>
                      </li>
                    </ul>

                    <div className="mt-3.5 p-3 rounded-xl bg-slate-100/60 dark:bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 space-y-1 text-[9px] font-bold text-slate-400">
                      <div className="flex justify-between">
                        <span>Active Workspaces:</span>
                        <span className="text-white">{activeCustomers}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Revenue Generated:</span>
                        <span className="text-emerald-400">${revenueGenerated.toLocaleString()}/mo</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-5 grid grid-cols-3 gap-1 pt-3 border-t border-slate-200 dark:border-white/5">
                    <button 
                      onClick={() => alert(`Modify limits configuration for plan: ${p.name}`)}
                      className="bg-slate-200/50 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-800 dark:text-white py-1.5 rounded-lg text-[9px] font-bold cursor-pointer border border-slate-300 dark:border-white/5"
                    >
                      Edit Plan
                    </button>
                    <button 
                      onClick={() => handleClonePlan(p.id)}
                      className="bg-blue-600/10 hover:bg-blue-600/25 text-blue-400 py-1.5 rounded-lg text-[9px] font-bold cursor-pointer"
                    >
                      Duplicate
                    </button>
                    <button 
                      onClick={() => handleTogglePlanActive(p.id)}
                      className={`py-1.5 rounded-lg text-[9px] font-bold cursor-pointer ${
                        p.active ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                      }`}
                    >
                      {p.active ? 'Disable' : 'Enable'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── 5. PROVIDERS TAB ── */}
      {activeTab === 'providers' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
          {/* Configure form */}
          <div className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-white/5 bg-white/40 dark:bg-white dark:bg-[#111827]/40 h-fit space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Cpu className="text-blue-500" size={16} />
              Configure AI Providers
            </h3>
            <form onSubmit={handleConfigureProvider} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Select Provider</label>
                <select
                  value={selectedProvider}
                  onChange={(e) => setSelectedProvider(e.target.value)}
                  className="w-full px-3 py-2 mt-1 rounded-xl text-xs bg-slate-100/50 dark:bg-slate-100 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-100 outline-none"
                  style={{ background: 'var(--bg-subtle)' }}
                >
                  <option value="openai" className="text-slate-900 dark:text-slate-200 bg-white dark:bg-slate-950">OpenAI (Whisper/TTS)</option>
                  <option value="deepgram" className="text-slate-900 dark:text-slate-200 bg-white dark:bg-slate-950">Deepgram AI STT</option>
                  <option value="elevenlabs" className="text-slate-900 dark:text-slate-200 bg-white dark:bg-slate-950">ElevenLabs Speech</option>
                  <option value="google-translate" className="text-slate-900 dark:text-slate-200 bg-white dark:bg-slate-950">Google Translate</option>
                  <option value="azure-openai" className="text-slate-900 dark:text-slate-200 bg-white dark:bg-slate-950">Azure OpenAI Services</option>
                  <option value="local-whisper" className="text-slate-900 dark:text-slate-200 bg-white dark:bg-slate-950">Local Faster Whisper</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">API Access Secret Key</label>
                <input
                  type="password"
                  value={providerKey}
                  onChange={(e) => setProviderKey(e.target.value)}
                  placeholder="sk-••••••••••••••••••••"
                  className="w-full px-3 py-2 mt-1 rounded-xl text-xs bg-slate-100/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-200 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Route Priority</label>
                  <input
                    type="number"
                    value={providerPriority}
                    onChange={(e) => setProviderPriority(Number(e.target.value))}
                    className="w-full px-3 py-2 mt-1 rounded-xl text-xs bg-slate-100/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-200 outline-none"
                  />
                </div>
                <div className="flex flex-col justify-end">
                  <button
                    type="button"
                    onClick={() => setProviderEnabled(!providerEnabled)}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-white/5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer h-9 transition-colors hover:bg-white/5"
                  >
                    {providerEnabled ? <Check className="text-emerald-500" size={14} /> : null}
                    Active Globally
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-slate-800 dark:text-white text-xs font-bold cursor-pointer transition-colors shadow-lg"
              >
                Save Configuration
              </button>
            </form>
          </div>

          {/* Providers list */}
          <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-slate-200 dark:border-white/5 bg-white/40 dark:bg-white dark:bg-[#111827]/40 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Active Global AI Systems</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {providers.map((prov) => {
                const latency = prov.provider_name === 'openai' ? '450ms' : prov.provider_name === 'deepgram' ? '280ms' : '850ms';
                return (
                  <div 
                    key={prov.provider_name}
                    className="p-4 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-100/50 dark:bg-slate-100 dark:bg-slate-950/40 flex flex-col justify-between hover:border-white/10 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-extrabold text-white capitalize">{prov.provider_name.replace("-", " ")}</h4>
                        <p className="text-[9px] font-bold text-slate-500 dark:text-slate-400 mt-1">Priority Order: {prov.priority}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                        prov.is_enabled ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-500'
                      }`}>
                        {prov.is_enabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                    
                    <div className="mt-3.5 space-y-2 border-t border-slate-200 dark:border-white/5 pt-3 text-[10px] font-bold text-slate-400">
                      <div className="flex justify-between">
                        <span>Requests MTD:</span>
                        <span className="text-white">{prov.usage_calls.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Ingested cost:</span>
                        <span className="text-emerald-400">${prov.cost.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Simulated Latency:</span>
                        <span className="text-slate-800 dark:text-slate-200">{latency}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-200 dark:border-white/5 flex justify-between items-center">
                      <span className={`text-[10px] font-black flex items-center gap-1 ${
                        prov.status === 'High CPU' ? 'text-amber-400' : prov.status === 'Offline' ? 'text-red-500' : 'text-emerald-400'
                      }`}>
                        {prov.status === 'Healthy' ? '✅' : prov.status === 'High CPU' ? '⚠' : '❌'} {prov.status}
                      </span>
                      <button
                        onClick={() => handleTestProviderConnection(prov.provider_name)}
                        className="bg-white/5 hover:bg-white/10 text-slate-700 dark:text-slate-300 hover:text-white px-2 py-1 rounded text-[9px] font-bold cursor-pointer"
                      >
                        Test Connection
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── 6. USAGE ANALYTICS TAB ── */}
      {activeTab === 'usage_analytics' && (
        <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-white/5 bg-white/40 dark:bg-white dark:bg-[#111827]/40 animate-fadeIn space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/5 pb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="text-blue-500" size={16} />
              Operational Usage Analytics
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
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
                      <div className="text-[10px] text-slate-500">/{u.slug}</div>
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
              className={`text-xs font-bold pb-2 transition-all cursor-pointer ${
                billingSubTab === 'analytics' 
                  ? 'text-blue-500 dark:text-blue-400 border-b-2 border-blue-500' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              Revenue Analytics
            </button>
            <button
              onClick={() => setBillingSubTab('invoices')}
              className={`text-xs font-bold pb-2 transition-all cursor-pointer ${
                billingSubTab === 'invoices' 
                  ? 'text-blue-500 dark:text-blue-400 border-b-2 border-blue-500' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              Invoices ({billingOverview.invoices?.length || 0})
            </button>
            <button
              onClick={() => setBillingSubTab('payments')}
              className={`text-xs font-bold pb-2 transition-all cursor-pointer ${
                billingSubTab === 'payments' 
                  ? 'text-blue-500 dark:text-blue-400 border-b-2 border-blue-500' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              Payments ({billingOverview.payments?.length || 0})
            </button>
            <button
              onClick={() => setBillingSubTab('subscriptions')}
              className={`text-xs font-bold pb-2 transition-all cursor-pointer ${
                billingSubTab === 'subscriptions' 
                  ? 'text-blue-500 dark:text-blue-400 border-b-2 border-blue-500' 
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
                <div className="glass-card rounded-2xl p-4 border border-slate-200 dark:border-white/5 bg-white/40 dark:bg-[#111827]/40">
                  <p className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Today's Revenue</p>
                  <h3 className="text-2xl font-black text-emerald-400 mt-1">${(billingOverview.today_revenue || 0).toLocaleString()}</h3>
                </div>

                <div className="glass-card rounded-2xl p-4 border border-slate-200 dark:border-white/5 bg-white/40 dark:bg-[#111827]/40">
                  <p className="text-[9px] font-black uppercase text-slate-500 tracking-wider">MRR</p>
                  <h3 className="text-2xl font-black text-blue-400 mt-1">${billingOverview.mrr.toLocaleString()}</h3>
                </div>

                <div className="glass-card rounded-2xl p-4 border border-slate-200 dark:border-white/5 bg-white/40 dark:bg-[#111827]/40">
                  <p className="text-[9px] font-black uppercase text-slate-500 tracking-wider">ARR (Projected)</p>
                  <h3 className="text-2xl font-black text-purple-400 mt-1">${(billingOverview.arr || billingOverview.mrr * 12).toLocaleString()}</h3>
                </div>

                <div className="glass-card rounded-2xl p-4 border border-slate-200 dark:border-white/5 bg-white/40 dark:bg-[#111827]/40">
                  <p className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Cumulative Revenue</p>
                  <h3 className="text-2xl font-black text-white mt-1">${billingOverview.total_revenue.toLocaleString()}</h3>
                </div>

                <div className="glass-card rounded-2xl p-4 border border-slate-200 dark:border-white/5 bg-white/40 dark:bg-[#111827]/40">
                  <p className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Payment Success Rate</p>
                  <h3 className="text-2xl font-black text-amber-400 mt-1">{(billingOverview.success_ratio || 95).toFixed(1)}%</h3>
                </div>
              </div>

              {/* Graphic Charts Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Trend Line Chart */}
                <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-slate-200 dark:border-white/5 bg-white/40 dark:bg-[#111827]/40 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">Revenue Projections & Trends</h4>
                    <span className="text-[9px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-bold">Past 7 Days</span>
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
                <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-white/5 bg-white/40 dark:bg-[#111827]/40 space-y-6 flex flex-col justify-between">
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">Gateway Distribution</h4>
                    <div className="space-y-3">
                      {(() => {
                        const spread = billingOverview.gateway_spread || [];
                        const maxSpread = Math.max(...spread.map((s: any) => s.value), 1);
                        return spread.map((item: any, i: number) => {
                          const pct = (item.value / maxSpread) * 100;
                          return (
                            <div key={i} className="space-y-1">
                              <div className="flex justify-between text-[10px] font-bold">
                                <span className="text-slate-400 uppercase">{item.name}</span>
                                <span className="text-white">${item.value.toLocaleString()}</span>
                              </div>
                              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${pct}%` }} />
                              </div>
                            </div>
                          );
                        });
                      })()}
                    </div>
                  </div>

                  {/* Circular success ratio representation */}
                  <div className="pt-4 border-t border-white/5 text-center space-y-2">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Gateway Checkout Health</span>
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
                            <span className="absolute text-[11px] font-black text-white">{ratio.toFixed(0)}%</span>
                          </div>
                        );
                      })()}
                      <div className="text-left text-[10px] font-semibold text-slate-400">
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
            <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-white/5 bg-white/40 dark:bg-[#111827]/40 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CreditCard size={14} className="text-emerald-400" />
                Invoices Log
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
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
                          <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
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
                            href={`http://127.0.0.1:8000/api/billing/invoices/${inv.id}/download`}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-white/5 hover:bg-white/10 text-slate-700 dark:text-slate-350 hover:text-white px-2.5 py-1 rounded text-[9px] inline-flex items-center gap-0.5"
                          >
                            PDF
                          </a>
                          <button
                            onClick={() => handleEmailInvoice(inv.id)}
                            className="bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 px-2 py-0.5 rounded text-[9px]"
                          >
                            Email
                          </button>
                          <button
                            onClick={() => handleRegenerateInvoice(inv.id)}
                            className="bg-white/5 hover:bg-white/10 text-slate-700 dark:text-slate-300 hover:text-white px-2 py-0.5 rounded text-[9px]"
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
            <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-white/5 bg-white/40 dark:bg-[#111827]/40 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp size={14} className="text-blue-400" />
                Payments tracking
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
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
                          <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
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
                            className="bg-white/5 hover:bg-white/10 text-slate-700 dark:text-slate-300 px-2 py-1 rounded text-[9px]"
                          >
                            Details
                          </button>
                          {p.status.toLowerCase() === 'success' && p.receipt_url && (
                            <a
                              href={`http://127.0.0.1:8000${p.receipt_url}`}
                              target="_blank"
                              rel="noreferrer"
                              className="bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 px-2 py-1 rounded text-[9px] inline-flex items-center gap-0.5"
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
            <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-white/5 bg-white/40 dark:bg-[#111827]/40 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 size={14} className="text-blue-400" />
                Active Workspace Subscriptions
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400 font-bold font-sans">
                      <th className="py-2.5">Tenant Workspace</th>
                      <th className="py-2.5">Plan Name</th>
                      <th className="py-2.5">Cycle</th>
                      <th className="py-2.5">Price</th>
                      <th className="py-2.5">Status</th>
                      <th className="py-2.5">Started Date</th>
                      <th className="py-2.5">Expires Date</th>
                      <th className="py-2.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {billingOverview.subscriptions?.map((sub: any) => (
                      <tr key={sub.id} className="border-b border-slate-200 dark:border-white/5 hover:bg-white/5 transition-colors">
                        <td className="py-3 font-semibold text-slate-700 dark:text-white">{sub.tenant_name}</td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 capitalize">
                            {sub.plan}
                          </span>
                        </td>
                        <td className="py-3 text-slate-650 dark:text-slate-400 capitalize">{sub.billing_cycle || 'monthly'}</td>
                        <td className="py-3 text-white font-bold">${sub.price || 0}</td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase">
                            {sub.status || 'Active'}
                          </span>
                        </td>
                        <td className="py-3 text-slate-500 font-mono">{sub.started || '-'}</td>
                        <td className="py-3 text-slate-500 font-mono font-bold">{sub.expires}</td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => handleRenewPlan(sub.tenant_name)}
                            className="bg-blue-600/15 hover:bg-blue-600/25 text-blue-400 px-2.5 py-1 rounded text-[9px] font-bold cursor-pointer"
                          >
                            Renew Plan
                          </button>
                        </td>
                      </tr>
                    ))}
                    {(!billingOverview.subscriptions || billingOverview.subscriptions.length === 0) && (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-slate-400 font-semibold">No active subscriptions found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Billing & Gateway Configurations Form */}
          {gatewaySettings && (
            <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-white/5 bg-white/40 dark:bg-[#111827]/40 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Settings size={14} className="text-blue-500" />
                Global Gateway & Invoicing Settings (Super Admin)
              </h3>
              <form onSubmit={handleSaveBillingSettings} className="space-y-4 text-xs">
                
                {/* Invoice Customization Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-white/5 pb-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Company Name</label>
                    <input
                      type="text"
                      value={gatewaySettings.company_name}
                      onChange={(e) => setGatewaySettings({ ...gatewaySettings, company_name: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-100/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-200 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Company Email</label>
                    <input
                      type="email"
                      value={gatewaySettings.company_email}
                      onChange={(e) => setGatewaySettings({ ...gatewaySettings, company_email: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-100/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-200 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Company Address</label>
                    <input
                      type="text"
                      value={gatewaySettings.company_address}
                      onChange={(e) => setGatewaySettings({ ...gatewaySettings, company_address: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-100/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-200 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 border-b border-white/5 pb-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Currency</label>
                    <select
                      value={gatewaySettings.currency}
                      onChange={(e) => setGatewaySettings({ ...gatewaySettings, currency: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-100/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-200 outline-none"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="INR">INR (₹)</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">GST Percentage (%)</label>
                    <input
                      type="number"
                      value={gatewaySettings.gst_percentage}
                      onChange={(e) => setGatewaySettings({ ...gatewaySettings, gst_percentage: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-100/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-200 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Invoice Number Prefix</label>
                    <input
                      type="text"
                      value={gatewaySettings.invoice_prefix}
                      onChange={(e) => setGatewaySettings({ ...gatewaySettings, invoice_prefix: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-100/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-200 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Default Gateway</label>
                    <select
                      value={gatewaySettings.default_gateway}
                      onChange={(e) => setGatewaySettings({ ...gatewaySettings, default_gateway: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-100/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-200 outline-none"
                    >
                      <option value="stripe">Stripe</option>
                      <option value="razorpay">Razorpay</option>
                      <option value="upi">UPI QR Pay</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1 border-b border-white/5 pb-4">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Invoice Footer Note</label>
                  <textarea
                    rows={2}
                    value={gatewaySettings.invoice_footer}
                    onChange={(e) => setGatewaySettings({ ...gatewaySettings, invoice_footer: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-200 outline-none font-sans"
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
                    <div className="space-y-2 text-[10px]">
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
                    <div className="space-y-2 text-[10px]">
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
                    <div className="space-y-2 text-[10px] h-full">
                      <div className="space-y-1">
                        <label className="text-slate-400 font-bold uppercase">VPA Address (UPI ID)</label>
                        <input
                          type="text"
                          value={gatewaySettings.upi_id}
                          onChange={(e) => setGatewaySettings({ ...gatewaySettings, upi_id: e.target.value })}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950/40 border border-white/5 text-slate-200 outline-none font-mono"
                        />
                      </div>
                      <p className="text-[9px] text-slate-500 leading-relaxed font-semibold pt-1">QR Code generator will render payment intents pointing to this merchant address automatically.</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl transition-all cursor-pointer shadow-lg shadow-blue-600/10"
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
        <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-white/5 bg-white/40 dark:bg-white dark:bg-[#111827]/40 animate-fadeIn space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/5 pb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Activity size={14} className="text-blue-400" />
              Unified AI Activity Logs
            </h3>
            <div className="flex items-center gap-2">
              <Search size={14} className="text-slate-500 dark:text-slate-400" />
              <input
                type="text"
                placeholder="Filter logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-1.5 rounded-xl text-xs bg-slate-100/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-200 outline-none placeholder-slate-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
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
                  .map((log: any, idx: number) => {
                    const duration = log.provider === 'openai' ? '450ms' : log.provider === 'deepgram' ? '320ms' : '820ms';
                    return (
                      <tr key={idx} className="border-b border-slate-200 dark:border-white/5 hover:bg-white/5 transition-colors">
                        <td className="py-3 font-mono text-slate-400">{log.time}</td>
                        <td className="py-3 font-semibold text-slate-800 dark:text-white">{log.tenant}</td>
                        <td className="py-3 text-slate-300 font-bold">{log.feature}</td>
                        <td className="py-3">
                          <span className="badge badge-info">{log.provider}</span>
                        </td>
                        <td className="py-3 text-slate-600 dark:text-slate-400 font-mono">{duration}</td>
                        <td className="py-3 font-mono text-emerald-400">{log.cost}</td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500/10 text-emerald-400">
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
        <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-white/5 bg-white/40 dark:bg-white dark:bg-[#111827]/40 animate-fadeIn space-y-6">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="text-blue-500" size={16} />
            Platform Administration Audit Trails
          </h3>
          
          <div className="relative border-l border-slate-200 dark:border-white/5 ml-4 pl-6 space-y-6">
            {auditLogs.map((log: any, idx: number) => (
              <div key={idx} className="relative group">
                <div className="absolute -left-9 top-0.5 h-6 w-6 rounded-full bg-slate-100 dark:bg-[#0B1020] border border-blue-500/40 text-blue-400 flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
                  <ShieldCheck size={12} />
                </div>
                
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-800 dark:text-white">{log.actor}</span>
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      {log.action}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-600 dark:text-slate-400 font-mono">{log.time}</span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 font-bold mt-1">{log.target}</p>
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
            <div className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-white/5 bg-white/40 dark:bg-white dark:bg-[#111827]/40">
              <p className="text-[10px] uppercase font-bold text-slate-500">CPU LOAD</p>
              <div className="flex items-center justify-between mt-2.5">
                <h4 className="text-3xl font-black text-white">{systemHealth.cpu}</h4>
                <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden border border-slate-200 dark:border-white/5">
                  <div className="h-full bg-blue-500" style={{ width: systemHealth.cpu }} />
                </div>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-white/5 bg-white/40 dark:bg-white dark:bg-[#111827]/40">
              <p className="text-[10px] uppercase font-bold text-slate-500">RAM USAGE</p>
              <div className="flex items-center justify-between mt-2.5">
                <h4 className="text-3xl font-black text-white">{systemHealth.ram}</h4>
                <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden border border-slate-200 dark:border-white/5">
                  <div className="h-full bg-violet-500" style={{ width: systemHealth.ram }} />
                </div>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-white/5 bg-white/40 dark:bg-white dark:bg-[#111827]/40">
              <p className="text-[10px] uppercase font-bold text-slate-500">DISK SPACE USED</p>
              <div className="flex items-center justify-between mt-2.5">
                <h4 className="text-3xl font-black text-white">{systemHealth.disk}</h4>
                <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden border border-slate-200 dark:border-white/5">
                  <div className="h-full bg-amber-500" style={{ width: systemHealth.disk }} />
                </div>
              </div>
            </div>
          </div>

          {/* Microservices Checklist */}
          <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-white/5 bg-white/40 dark:bg-white dark:bg-[#111827]/40 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Server size={14} className="text-blue-400" />
              Service Health
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(systemHealth.services).map(([service, status]: any) => (
                <div key={service} className="p-4 rounded-xl bg-slate-100/50 dark:bg-slate-100 dark:bg-slate-950/30 border border-slate-200 dark:border-white/5 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-white">{service}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                    status === 'Healthy' ? 'bg-emerald-500/10 text-emerald-400' :
                    status === 'Warning' ? 'bg-amber-500/10 text-amber-400' : 'bg-red-500/10 text-red-500'
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
            
            <div className="space-y-2 text-xs">
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
                <span className="text-blue-400 font-bold">{viewingTenant.plan?.name} (${viewingTenant.plan?.price}/mo)</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-200 dark:border-white/5">
                <span className="text-slate-400">Workspace Status</span>
                <span className="text-emerald-400 font-bold uppercase">{viewingTenant.status}</span>
              </div>
              
              <div className="pt-3">
                <p className="text-[10px] font-black uppercase text-blue-400 mb-2 tracking-wider">Resource Ingestion levels (MTD)</p>
                <div className="grid grid-cols-2 gap-3 p-3 bg-slate-100/50 dark:bg-slate-100 dark:bg-slate-950/40 rounded-xl border border-slate-200 dark:border-white/5">
                  <div>
                    <span className="text-[10px] text-slate-500">Speech Audio:</span>
                    <p className="text-xs font-bold text-slate-800 dark:text-white mt-0.5">{viewingTenant.usage?.transcription_minutes} mins</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500">Translation:</span>
                    <p className="text-xs font-bold text-slate-800 dark:text-white mt-0.5">{(viewingTenant.usage?.translation_characters || 0).toLocaleString()} chars</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500">TTS Audio:</span>
                    <p className="text-xs font-bold text-slate-800 dark:text-white mt-0.5">{(viewingTenant.usage?.tts_characters || 0).toLocaleString()} chars</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500">API Logs today:</span>
                    <p className="text-xs font-bold text-slate-800 dark:text-white mt-0.5">{(viewingTenant.usage?.api_calls || 0).toLocaleString()}</p>
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
                className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-slate-800 dark:text-white text-xs font-bold transition-all text-center cursor-pointer shadow-md"
              >
                Upgrade Plan limits
              </button>
              <button
                onClick={() => setViewingTenant(null)}
                className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-800 dark:text-white text-xs font-bold transition-all text-center cursor-pointer border border-slate-200 dark:border-white/5"
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
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Workspace</label>
                <input
                  type="text"
                  disabled
                  value={editTenantName}
                  className="w-full px-3 py-2 mt-1 rounded-xl text-xs bg-slate-100 dark:bg-slate-950/20 border border-slate-200 dark:border-white/5 text-slate-500 outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Billing Plan Tier</label>
                <select
                  value={editTenantPlanId}
                  onChange={(e) => setEditTenantPlanId(e.target.value)}
                  className="w-full px-3 py-2 mt-1 rounded-xl text-xs bg-slate-100/50 dark:bg-slate-100 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-100 outline-none"
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
                className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-slate-800 dark:text-white text-xs font-bold cursor-pointer shadow-md"
              >
                Upgrade limits
              </button>
              <button
                onClick={() => setEditingTenant(null)}
                className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-800 dark:text-white text-xs font-bold cursor-pointer"
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
                  <CreditCard className="text-blue-500" size={16} />
                  Payment Transaction Details
                </h3>
                <p className="text-[10px] text-slate-500 mt-1">Detailed transaction receipt and gateway verification payload.</p>
              </div>
              <button 
                onClick={() => setViewingPaymentDetails(null)} 
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase">Transaction ID</span>
                  <strong className="text-slate-800 dark:text-white font-mono">{viewingPaymentDetails.transaction_id}</strong>
                </div>
                <div className="space-y-1">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase">Invoice Number</span>
                  <strong className="text-slate-800 dark:text-white font-mono">{viewingPaymentDetails.invoice_number}</strong>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase">Tenant Name</span>
                  <strong className="text-slate-800 dark:text-white">{viewingPaymentDetails.tenant_name}</strong>
                </div>
                <div className="space-y-1">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase">Workspace slug</span>
                  <strong className="text-slate-800 dark:text-white font-mono">{viewingPaymentDetails.workspace}</strong>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase">Amount</span>
                  <strong className="text-emerald-500 font-extrabold">${viewingPaymentDetails.amount}</strong>
                </div>
                <div className="space-y-1">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase">Gateway</span>
                  <strong className="text-slate-800 dark:text-white capitalize">{viewingPaymentDetails.gateway}</strong>
                </div>
                <div className="space-y-1">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase">Status</span>
                  <span className={`inline-block px-1.5 py-0.5 rounded text-[8px] font-black uppercase ${
                    viewingPaymentDetails.status.toLowerCase() === 'success' 
                      ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                      : 'bg-red-500/10 text-red-500 border border-red-500/20'
                  }`}>
                    {viewingPaymentDetails.status}
                  </span>
                </div>
              </div>

              <div className="space-y-1 pt-2 border-t border-slate-200 dark:border-white/5">
                <span className="block text-[10px] font-bold text-slate-400 uppercase">Raw Gateway Response JSON</span>
                <pre className="w-full max-h-40 overflow-y-auto p-3 rounded-lg bg-slate-950 text-[10px] font-mono text-slate-300 border border-white/5 leading-relaxed whitespace-pre-wrap">
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
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-800 dark:text-white text-xs font-bold cursor-pointer transition-all"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
