import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../utils/api';
import { useApp } from '../../context/AppContext';
import { 
  Users, Key, Activity, Settings, UserPlus, Loader2
} from 'lucide-react';

export const TenantDashboard: React.FC = () => {
  const { user } = useApp();
  const [activeSubTab, setActiveSubTab] = useState<'metrics' | 'team' | 'keys'>('metrics');
  
  // Data States
  const [metrics, setMetrics] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [keys, setKeys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Invite member states
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState('user');

  // Custom key states
  const [selectedProvider, setSelectedProvider] = useState('openai');
  const [providerKey, setProviderKey] = useState('');

  const loadTenantData = async () => {
    setLoading(true);
    try {
      const metricsData = await apiRequest("/tenant-admin/metrics");
      setMetrics(metricsData);
      
      const usersData = await apiRequest("/tenant-admin/users");
      setUsers(usersData);
      
      const keysData = await apiRequest("/tenant-admin/providers");
      setKeys(keysData);
    } catch (err) {
      console.error("Failed to load tenant admin dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTenantData();
  }, []);

  const handleInviteUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail || !newUserPassword) return;

    try {
      await apiRequest("/tenant-admin/users", {
        method: "POST",
        body: JSON.stringify({
          name: newUserName,
          email: newUserEmail,
          password: newUserPassword,
          role: newUserRole
        })
      });
      setNewUserName('');
      setNewUserEmail('');
      setNewUserPassword('');
      alert("Team member invited successfully!");
      loadTenantData();
    } catch (err: any) {
      alert(err.message || "Failed to invite user.");
    }
  };

  const handleSaveWorkspaceKey = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest("/tenant-admin/providers", {
        method: "POST",
        body: JSON.stringify({
          provider_name: selectedProvider,
          api_key: providerKey || null,
          is_enabled: true,
          priority: 1
        })
      });
      setProviderKey('');
      alert("Workspace API credential updated!");
      loadTenantData();
    } catch (err) {
      alert("Failed to update workspace API credential.");
    }
  };

  const handleUpdateUserStatus = async (userId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'active' ? 'suspended' : 'active';
    try {
      await apiRequest(`/tenant-admin/users/${userId}`, {
        method: "PATCH",
        body: JSON.stringify({ status: nextStatus })
      });
      loadTenantData();
    } catch (err) {
      alert("Failed to update user status.");
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="animate-spin text-teal-500" size={32} />
      </div>
    );
  }

  // Helper limits values: assume default limits structure
  const audioMax = 60; // default Starter max minutes
  const transMax = 100000; // default Starter max translation chars
  const ttsMax = 50000; // default Starter max tts chars

  return (
    <div className="space-y-6 w-full p-4 md:p-8">
      {/* Dashboard sub header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/5 pb-5">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Settings className="text-teal-500" size={20} />
            Workspace Settings & Dashboard
          </h1>
          <p className="text-base text-slate-500 dark:text-slate-400 font-semibold mt-1">
            Manage your workspace limits, set tenant API keys, and organize team members.
          </p>
        </div>

        <div className="flex bg-white dark:bg-slate-900/60 rounded-xl p-1 border border-slate-200 dark:border-white/5">
          <button
            onClick={() => setActiveSubTab('metrics')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-base font-bold transition-all cursor-pointer ${
              activeSubTab === 'metrics' 
                ? 'bg-teal-600 text-white' 
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <Activity size={13} /> Usage Metrics
          </button>
          <button
            onClick={() => setActiveSubTab('team')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-base font-bold transition-all cursor-pointer ${
              activeSubTab === 'team' 
                ? 'bg-teal-600 text-white' 
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <Users size={13} /> Team Management
          </button>
          <button
            onClick={() => setActiveSubTab('keys')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-base font-bold transition-all cursor-pointer ${
              activeSubTab === 'keys' 
                ? 'bg-teal-600 text-white' 
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <Key size={13} /> Custom Keys
          </button>
        </div>
      </div>

      {activeSubTab === 'metrics' && metrics && (
        <div className="space-y-6 animate-fadeIn">
          {/* Billing cycle dates */}
          <div className="app-card rounded-2xl p-4 flex justify-between text-base text-slate-655 dark:text-slate-400">
            <span>Billing period start: <strong className="text-slate-900 dark:text-white">{new Date(metrics.billing_period_start).toLocaleDateString()}</strong></span>
            <span>Billing period end: <strong className="text-slate-900 dark:text-white">{new Date(metrics.billing_period_end).toLocaleDateString()}</strong></span>
          </div>

          {/* Progress limit meters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="app-card rounded-2xl p-5 space-y-3">
              <div className="flex justify-between items-center text-base">
                <span className="font-bold text-slate-900 dark:text-white">Audio Transcription</span>
                <span className="text-slate-500 dark:text-slate-400">{roundValue(metrics.audio_minutes_used)} mins consumed</span>
              </div>
              <div className="w-full h-2 bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-teal-500 rounded-full" style={{ width: `${Math.min(100, (metrics.audio_minutes_used / audioMax) * 100)}%` }} />
              </div>
              <p className="text-sm text-slate-500">Starter Plan allocation: {audioMax} minutes</p>
            </div>

            <div className="app-card rounded-2xl p-5 space-y-3">
              <div className="flex justify-between items-center text-base">
                <span className="font-bold text-slate-900 dark:text-white">Language translation</span>
                <span className="text-slate-500 dark:text-slate-400">{metrics.translation_chars_used} chars translated</span>
              </div>
              <div className="w-full h-2 bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.min(100, (metrics.translation_chars_used / transMax) * 100)}%` }} />
              </div>
              <p className="text-sm text-slate-500">Starter Plan allocation: {transMax} characters</p>
            </div>

            <div className="app-card rounded-2xl p-5 space-y-3">
              <div className="flex justify-between items-center text-base">
                <span className="font-bold text-slate-900 dark:text-white">Text to speech</span>
                <span className="text-slate-500 dark:text-slate-400">{metrics.tts_chars_used} chars synthesized</span>
              </div>
              <div className="w-full h-2 bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: `${Math.min(100, (metrics.tts_chars_used / ttsMax) * 100)}%` }} />
              </div>
              <p className="text-sm text-slate-500">Starter Plan allocation: {ttsMax} characters</p>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'team' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
          {/* Invite Member form */}
          <div className="app-card rounded-2xl p-5 h-fit space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <UserPlus className="text-teal-500" size={16} />
              Add Team Member
            </h3>
            <form onSubmit={handleInviteUser} className="space-y-3">
              <div className="space-y-1">
                <label className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Full Name</label>
                <input
                  type="text"
                  required
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-3 py-2 rounded-xl text-base bg-white dark:bg-slate-950/40 border border-slate-350 dark:border-white/5 text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Email Address</label>
                <input
                  type="email"
                  required
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="john@acme.com"
                  className="w-full px-3 py-2 rounded-xl text-base bg-white dark:bg-slate-950/40 border border-slate-350 dark:border-white/5 text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Initial Password</label>
                <input
                  type="password"
                  required
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 rounded-xl text-base bg-white dark:bg-slate-950/40 border border-slate-350 dark:border-white/5 text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Role Designation</label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-base bg-white dark:bg-slate-950/40 border border-slate-350 dark:border-white/5 text-slate-900 dark:text-white outline-none"
                  style={{ background: 'var(--bg-subtle)' }}
                >
                  <option value="user">Workspace User</option>
                  <option value="manager">Workspace Manager</option>
                  <option value="tenant_admin">Workspace Admin</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-base font-bold cursor-pointer"
              >
                Create Member Account
              </button>
            </form>
          </div>

          {/* Members List */}
          <div className="lg:col-span-2 app-card rounded-2xl p-6">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Workspace Active Members</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-base border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400">
                    <th className="py-2">User</th>
                    <th className="py-2">Email</th>
                    <th className="py-2">Role</th>
                    <th className="py-2">Status</th>
                    <th className="py-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u: any) => (
                    <tr key={u.id} className="border-b border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5">
                      <td className="py-3 font-semibold text-slate-900 dark:text-white">{u.name}</td>
                      <td className="py-3 text-slate-650 dark:text-slate-355">{u.email}</td>
                      <td className="py-3 capitalize">
                        <span className="badge badge-info">{u.role.replace("_", " ")}</span>
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded text-sm font-bold ${u.status === 'active' ? 'bg-emerald-500/10 text-emerald-550 dark:text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                          {u.status}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        {u.id !== user?.id && (
                          <button
                            onClick={() => handleUpdateUserStatus(u.id, u.status)}
                            className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-500 px-2 py-1 rounded text-sm font-bold cursor-pointer"
                          >
                            {u.status === 'active' ? 'Suspend' : 'Activate'}
                          </button>
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

      {activeSubTab === 'keys' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
          {/* Key Input Form */}
          <div className="app-card rounded-2xl p-5 h-fit space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Key className="text-teal-500" size={16} />
              Set Custom API Keys
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
              If configured, calls from this workspace will use your custom API credentials instead of platform defaults.
            </p>
            <form onSubmit={handleSaveWorkspaceKey} className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">AI Provider</label>
                <select
                  value={selectedProvider}
                  onChange={(e) => setSelectedProvider(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-base bg-white dark:bg-slate-950/40 border border-slate-350 dark:border-white/5 text-slate-900 dark:text-white outline-none"
                  style={{ background: 'var(--bg-subtle)' }}
                >
                  <option value="openai">OpenAI Whisper/TTS</option>
                  <option value="deepgram">Deepgram STT</option>
                  <option value="elevenlabs">ElevenLabs Speech</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Secret API Key</label>
                <input
                  type="password"
                  value={providerKey}
                  onChange={(e) => setProviderKey(e.target.value)}
                  placeholder="sk-sksksksksksksksksksk"
                  className="w-full px-3 py-2 rounded-xl text-base bg-white dark:bg-slate-950/40 border border-slate-350 dark:border-white/5 text-slate-900 dark:text-white outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-base font-bold cursor-pointer"
              >
                Apply Custom Key
              </button>
            </form>
          </div>

          {/* Installed Keys Overview */}
          <div className="lg:col-span-2 app-card rounded-2xl p-6">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Workspace Installed Credentials</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {keys.map((key) => (
                <div 
                  key={key.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-slate-950/40 flex flex-col justify-between"
                >
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white capitalize">{key.provider_name}</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold mt-1">Status: {key.is_enabled ? "Active override" : "Suspended override"}</p>
                  </div>
                  
                  <div className="mt-4 pt-3 border-t border-slate-200 dark:border-white/5 text-sm font-semibold text-slate-550 dark:text-slate-400 flex justify-between">
                    <span>Key: configured</span>
                    <span className="text-teal-500 dark:text-teal-400">Workspace Level</span>
                  </div>
                </div>
              ))}
              {keys.length === 0 && (
                <div className="col-span-2 text-center py-10 text-base text-slate-500 dark:text-slate-400 font-semibold">
                  No custom workspace keys configured. Using platform default fallback credentials.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper rounding function
function roundValue(v: any) {
  if (typeof v === 'number') {
    return v.toFixed(2);
  }
  return v;
}
