import React, { useState } from "react";
import { Key, Save, Lock, Mail, Users } from "lucide-react";

export const AuthSettings: React.FC = () => {
  const [config, setConfig] = useState({
    emailLogin: true,
    googleLogin: false,
    microsoftLogin: false,
    otpLogin: false,
    magicLink: false,
    publicRegistration: true,
    adminApproval: false,
    sessionTimeout: 120,
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Key className="text-pink-500" />
            Authentication
          </h2>
          <p className="text-sm font-bold text-slate-500 mt-1">Configure login methods and registration rules.</p>
        </div>
        <button className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-xl font-bold flex items-center gap-2 transition-all">
          <Save size={16} /> Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Login Methods */}
        <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-white/5 bg-white dark:bg-[#111827]/40">
          <h3 className="text-lg font-black mb-4 flex items-center gap-2">
            <Lock size={18} className="text-indigo-500" />
            Login Methods
          </h3>
          <div className="space-y-4">
            {[
              { id: 'emailLogin', label: 'Email & Password Login', desc: 'Standard username/password login' },
              { id: 'googleLogin', label: 'Google Single Sign-On', desc: 'Login using Google Workspace' },
              { id: 'microsoftLogin', label: 'Microsoft SSO', desc: 'Login using Azure AD' },
              { id: 'otpLogin', label: 'OTP Login', desc: 'Login via Email/SMS OTP' },
              { id: 'magicLink', label: 'Magic Link Login', desc: 'Passwordless login via email link' },
            ].map((method) => (
              <div key={method.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{method.label}</h4>
                  <p className="text-xs text-slate-500">{method.desc}</p>
                </div>
                <button 
                  onClick={() => setConfig({...config, [method.id]: !(config as any)[method.id]})}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${(config as any)[method.id] ? 'bg-pink-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${(config as any)[method.id] ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Registration Controls */}
        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-white/5 bg-white dark:bg-[#111827]/40">
            <h3 className="text-lg font-black mb-4 flex items-center gap-2">
              <Users size={18} className="text-teal-500" />
              Registration Controls
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">Public Registration</h4>
                  <p className="text-xs text-slate-500">Allow anyone to sign up</p>
                </div>
                <button onClick={() => setConfig({...config, publicRegistration: !config.publicRegistration})} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${config.publicRegistration ? 'bg-teal-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${config.publicRegistration ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">Admin Approval Required</h4>
                  <p className="text-xs text-slate-500">Admins must approve new accounts</p>
                </div>
                <button onClick={() => setConfig({...config, adminApproval: !config.adminApproval})} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${config.adminApproval ? 'bg-teal-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${config.adminApproval ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-white/5 bg-white dark:bg-[#111827]/40">
            <h3 className="text-lg font-black mb-4 flex items-center gap-2">
              <Lock size={18} className="text-orange-500" />
              Session Controls
            </h3>
            <div>
              <label className="text-xs font-bold uppercase text-slate-500">Session Timeout (Minutes)</label>
              <input type="number" value={config.sessionTimeout} onChange={e => setConfig({...config, sessionTimeout: Number(e.target.value)})} className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl outline-none" />
              <p className="text-xs text-slate-500 mt-2">Users will be logged out after this period of inactivity.</p>
            </div>
            <button className="mt-4 w-full py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl font-bold text-sm transition-all">
              Force Logout All Users
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
