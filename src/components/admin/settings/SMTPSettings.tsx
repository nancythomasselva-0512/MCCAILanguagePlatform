import React, { useState } from "react";
import { Mail, Save, Send, History } from "lucide-react";

export const SMTPSettings: React.FC = () => {
  const [config, setConfig] = useState({
    host: "smtp.example.com",
    port: 587,
    username: "apikey",
    password: "",
    fromEmail: "noreply@example.com",
    replyTo: "support@example.com"
  });

  const [activeTab, setActiveTab] = useState<'config' | 'templates' | 'logs'>('config');

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Mail className="text-indigo-500" />
            SMTP & Email
          </h2>
          <p className="text-sm font-bold text-slate-500 mt-1">Configure email delivery, templates, and notifications.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 text-slate-700 dark:text-white rounded-xl font-bold flex items-center gap-2 transition-all">
            <Send size={16} /> Send Test Email
          </button>
          <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center gap-2 transition-all">
            <Save size={16} /> Save Changes
          </button>
        </div>
      </div>

      <div className="flex gap-4 border-b border-slate-200 dark:border-white/10 pb-4">
        <button onClick={() => setActiveTab('config')} className={`px-4 py-2 text-sm font-bold rounded-xl transition-all ${activeTab === 'config' ? 'bg-indigo-500/10 text-indigo-500' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5'}`}>SMTP Configuration</button>
        <button onClick={() => setActiveTab('templates')} className={`px-4 py-2 text-sm font-bold rounded-xl transition-all ${activeTab === 'templates' ? 'bg-indigo-500/10 text-indigo-500' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5'}`}>Email Templates</button>
        <button onClick={() => setActiveTab('logs')} className={`px-4 py-2 text-sm font-bold rounded-xl transition-all ${activeTab === 'logs' ? 'bg-indigo-500/10 text-indigo-500' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5'}`}>Email Logs</button>
      </div>

      {activeTab === 'config' && (
        <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-white/5 bg-white dark:bg-[#111827]/40">
          <h3 className="text-lg font-black mb-4">SMTP Server Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-bold uppercase text-slate-500">SMTP Host</label>
              <input type="text" value={config.host} onChange={e => setConfig({...config, host: e.target.value})} className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl outline-none" />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-slate-500">SMTP Port</label>
              <input type="number" value={config.port} onChange={e => setConfig({...config, port: Number(e.target.value)})} className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl outline-none" />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-slate-500">SMTP Username</label>
              <input type="text" value={config.username} onChange={e => setConfig({...config, username: e.target.value})} className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl outline-none" />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-slate-500">SMTP Password</label>
              <input type="password" value={config.password} onChange={e => setConfig({...config, password: e.target.value})} placeholder="••••••••" className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl outline-none" />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-slate-500">From Email</label>
              <input type="email" value={config.fromEmail} onChange={e => setConfig({...config, fromEmail: e.target.value})} className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl outline-none" />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-slate-500">Reply-To Email</label>
              <input type="email" value={config.replyTo} onChange={e => setConfig({...config, replyTo: e.target.value})} className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl outline-none" />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'templates' && (
        <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-white/5 bg-white dark:bg-[#111827]/40">
          <h3 className="text-lg font-black mb-4">Notification Rules & Templates</h3>
          <div className="space-y-4">
            {['Welcome Email', 'User Invitation', 'OTP Verification', 'Password Reset', 'Invoice Generated', 'Subscription Renewal'].map((tpl, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-white/5">
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{tpl}</h4>
                  <p className="text-xs text-slate-500 mt-1">Sent automatically on specific triggers</p>
                </div>
                <div className="flex gap-3 items-center">
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-teal-500 transition-colors cursor-pointer">
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
                  </button>
                  <button className="text-xs font-bold text-indigo-500 hover:text-indigo-600 underline">Edit Template</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'logs' && (
        <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-white/5 bg-white dark:bg-[#111827]/40">
          <h3 className="text-lg font-black mb-4 flex items-center gap-2">
            <History size={18} className="text-slate-500" />
            Recent Deliveries
          </h3>
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-white/10 text-slate-500">
                <th className="py-2">Recipient</th>
                <th className="py-2">Subject</th>
                <th className="py-2">Status</th>
                <th className="py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={4} className="py-8 text-center text-slate-500 font-bold">No email logs found.</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};
