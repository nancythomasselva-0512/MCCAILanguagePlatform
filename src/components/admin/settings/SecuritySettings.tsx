import React, { useState } from "react";
import { ShieldCheck, Save, AlertTriangle, ShieldAlert } from "lucide-react";

const inputCls =
  "w-full mt-1 px-3 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl outline-none text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-red-500/40 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 dark:[color-scheme:dark]";

export const SecuritySettings: React.FC = () => {
  const [config, setConfig] = useState({
    require2fa: false,
    maxLoginAttempts: 5,
    lockoutDuration: 30,
    ipWhitelist: "",
    ipBlacklist: "",
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="text-red-500" />
            Security Settings
          </h2>
          <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mt-1">
            Manage policies, access controls, and monitor activity.
          </p>
        </div>
        <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold flex items-center gap-2 transition-all">
          <Save size={16} /> Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          {/* Account Security */}
          <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-white/5 bg-white dark:bg-[#111827]/40">
            <h3 className="text-lg font-black mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
              <ShieldAlert size={18} className="text-amber-500" />
              Account Security
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">Require Two-Factor Auth (2FA)</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Enforce 2FA for all users</p>
                </div>
                <button
                  onClick={() => setConfig({ ...config, require2fa: !config.require2fa })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    config.require2fa ? "bg-red-500" : "bg-slate-300 dark:bg-slate-600"
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${config.require2fa ? "translate-x-6" : "translate-x-1"}`} />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Max Login Attempts</label>
                  <input type="number" value={config.maxLoginAttempts} onChange={e => setConfig({ ...config, maxLoginAttempts: Number(e.target.value) })} className={inputCls} />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Lockout Duration (Mins)</label>
                  <input type="number" value={config.lockoutDuration} onChange={e => setConfig({ ...config, lockoutDuration: Number(e.target.value) })} className={inputCls} />
                </div>
              </div>
            </div>
          </div>

          {/* Network Access Controls */}
          <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-white/5 bg-white dark:bg-[#111827]/40">
            <h3 className="text-lg font-black mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
              <AlertTriangle size={18} className="text-red-500" />
              Network Access Controls
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">IP Whitelist</label>
                <textarea
                  value={config.ipWhitelist}
                  onChange={e => setConfig({ ...config, ipWhitelist: e.target.value })}
                  placeholder="Enter IP addresses separated by commas"
                  className="w-full mt-1 px-3 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl h-20 outline-none text-slate-900 dark:text-white font-medium resize-none focus:ring-2 focus:ring-red-500/40 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">IP Blacklist</label>
                <textarea
                  value={config.ipBlacklist}
                  onChange={e => setConfig({ ...config, ipBlacklist: e.target.value })}
                  placeholder="Enter IP addresses to block"
                  className="w-full mt-1 px-3 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl h-20 outline-none text-slate-900 dark:text-white font-medium resize-none focus:ring-2 focus:ring-red-500/40 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Security Dashboard */}
        <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-white/5 bg-white dark:bg-[#111827]/40">
          <h3 className="text-lg font-black mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
            <ShieldCheck size={18} className="text-emerald-500" />
            Security Dashboard
          </h3>
          <div className="space-y-3">
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-600 dark:text-emerald-400 font-bold text-sm">
              No recent security threats detected.
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-4">
              <h4 className="font-bold uppercase tracking-wider mb-2 text-slate-600 dark:text-slate-300">Recent Failed Logins</h4>
              <p>No failed login attempts in the last 24 hours.</p>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-4">
              <h4 className="font-bold uppercase tracking-wider mb-2 text-slate-600 dark:text-slate-300">Active Admin Sessions</h4>
              <p>1 Session from 127.0.0.1 (Current)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
