import React, { useState } from "react";
import { Building2, Save, Users, Layers } from "lucide-react";

export const TenantSettings: React.FC = () => {
  const [config, setConfig] = useState({
    registrationMode: "public",
    defaultPlan: "Free",
    maxUsers: 100,
    maxWorkspaces: 10
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Building2 className="text-purple-500" />
            Tenant Settings
          </h2>
          <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mt-1">Configure global rules for workspaces and tenants.</p>
        </div>
        <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold flex items-center gap-2 transition-all">
          <Save size={16} /> Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-white/5 bg-white dark:bg-[#111827]/40">
          <h3 className="text-lg font-black mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
            <Users size={18} className="text-indigo-500" />
            Onboarding &amp; Registration
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Tenant Registration Mode</label>
              <select
                value={config.registrationMode}
                onChange={e => setConfig({...config, registrationMode: e.target.value})}
                className="w-full mt-1 px-3 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl outline-none text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-purple-500/40 transition-all dark:[color-scheme:dark]"
              >
                <option value="public">Public (Anyone can create a tenant)</option>
                <option value="invite_only">Invite Only</option>
                <option value="admin_approval">Admin Approval Required</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Default Assigned Plan</label>
              <select
                value={config.defaultPlan}
                onChange={e => setConfig({...config, defaultPlan: e.target.value})}
                className="w-full mt-1 px-3 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl outline-none text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-purple-500/40 transition-all dark:[color-scheme:dark]"
              >
                <option value="Free">Free Plan</option>
                <option value="Starter">Starter Plan</option>
              </select>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-white/5 bg-white dark:bg-[#111827]/40">
          <h3 className="text-lg font-black mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
            <Layers size={18} className="text-teal-500" />
            Global Constraints
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Max Users Per Tenant (Soft Limit)</label>
              <input
                type="number"
                value={config.maxUsers}
                onChange={e => setConfig({...config, maxUsers: Number(e.target.value)})}
                className="w-full mt-1 px-3 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl outline-none text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-teal-500/40 transition-all dark:[color-scheme:dark]"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Max Workspaces Per Tenant</label>
              <input
                type="number"
                value={config.maxWorkspaces}
                onChange={e => setConfig({...config, maxWorkspaces: Number(e.target.value)})}
                className="w-full mt-1 px-3 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl outline-none text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-teal-500/40 transition-all dark:[color-scheme:dark]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
