import React, { useState, useEffect } from "react";
import { Mail, Save, Send, History, Eye, EyeOff } from "lucide-react";
import { apiRequest } from "../../../utils/api";
import { EmailTemplateModal } from "./EmailTemplateModal";
import { useApp } from "../../../context/AppContext";

export const SMTPSettings: React.FC = () => {
  const { setNotification } = useApp();
  
  const [config, setConfig] = useState({
    smtp_host: "",
    smtp_port: 587,
    smtp_username: "",
    smtp_password: "",
    from_email: "",
    reply_to_email: "",
    from_name: "",
    encryption_type: "TLS",
    connection_timeout: 10,
    enable_authentication: true,
    is_enabled: true
  });
  
  const [hasPassword, setHasPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [testEmail, setTestEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);

  const [activeTab, setActiveTab] = useState<'config' | 'templates' | 'logs'>('config');
  const [templates, setTemplates] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [editingTemplate, setEditingTemplate] = useState<any | null>(null);

  useEffect(() => {
    if (activeTab === 'config') {
      fetchConfig();
    } else if (activeTab === 'templates') {
      fetchTemplates();
    } else if (activeTab === 'logs') {
      fetchLogs();
    }
  }, [activeTab]);

  const fetchConfig = async () => {
    try {
      const res = await apiRequest("/super-admin/smtp-settings");
      if (res) {
        setConfig({
          smtp_host: res.smtp_host || "",
          smtp_port: res.smtp_port || 587,
          smtp_username: res.smtp_username || "",
          smtp_password: "", // never returned from API
          from_email: res.from_email || "",
          reply_to_email: res.reply_to_email || "",
          from_name: res.from_name || "",
          encryption_type: res.encryption_type || "TLS",
          connection_timeout: res.connection_timeout || 10,
          enable_authentication: res.enable_authentication ?? true,
          is_enabled: res.is_enabled ?? true
        });
        setHasPassword(res.has_password);
      }
    } catch (err) {
      console.error("Failed to fetch SMTP settings:", err);
      setNotification({ message: "Failed to load SMTP settings.", type: "error" });
    }
  };

  const fetchTemplates = async () => {
    try {
      const res = await apiRequest("/super-admin/email-templates");
      setTemplates(res || []);
    } catch (err) {
      console.error("Failed to fetch templates:", err);
    }
  };

  const fetchLogs = async () => {
    try {
      const res = await apiRequest("/super-admin/email-logs");
      setLogs(res || []);
    } catch (err) {
      console.error("Failed to fetch logs:", err);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload: any = { ...config };
      if (!payload.smtp_password) {
        delete payload.smtp_password; // don't overwrite if empty
      }
      
      const res = await apiRequest("/super-admin/smtp-settings", {
        method: "PUT",
        body: JSON.stringify(payload)
      });
      
      if (res) {
        setNotification({ message: "SMTP settings saved successfully.", type: "success" });
        setHasPassword(res.has_password);
        setConfig(prev => ({...prev, smtp_password: ""}));
      }
    } catch (err: any) {
      console.error("Failed to save SMTP settings:", err);
      setNotification({ message: err.message || "Failed to save SMTP settings.", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleTestEmail = async () => {
    if (!testEmail) {
      setNotification({ message: "Please enter a destination email for the test.", type: "warning" });
      return;
    }
    
    setTesting(true);
    try {
      await apiRequest("/super-admin/smtp-settings/test", {
        method: "POST",
        body: JSON.stringify({ to_email: testEmail })
      });
      setNotification({ message: "Test email sent successfully!", type: "success" });
      setTestEmail("");
    } catch (err: any) {
      console.error("Failed to send test email:", err);
      setNotification({ message: err.message || "Failed to send test email.", type: "error" });
    } finally {
      setTesting(false);
    }
  };

  return (
    <>
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
          <button 
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <Save size={16} /> {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="flex gap-4 border-b border-slate-200 dark:border-white/10 pb-4">
        <button onClick={() => setActiveTab('config')} className={`px-4 py-2 text-sm font-bold rounded-xl transition-all ${activeTab === 'config' ? 'bg-indigo-500/10 text-indigo-500' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5'}`}>SMTP Configuration</button>
        <button onClick={() => setActiveTab('templates')} className={`px-4 py-2 text-sm font-bold rounded-xl transition-all ${activeTab === 'templates' ? 'bg-indigo-500/10 text-indigo-500' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5'}`}>Email Templates</button>
        <button onClick={() => setActiveTab('logs')} className={`px-4 py-2 text-sm font-bold rounded-xl transition-all ${activeTab === 'logs' ? 'bg-indigo-500/10 text-indigo-500' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5'}`}>Email Logs</button>
      </div>

      {activeTab === 'config' && (
        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-white/5 bg-white dark:bg-[#111827]/40">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-black">SMTP Server Details</h3>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-slate-600 dark:text-slate-400">Enable SMTP</span>
                <button 
                  onClick={() => setConfig({...config, is_enabled: !config.is_enabled})}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${config.is_enabled ? 'bg-teal-500' : 'bg-slate-300 dark:bg-slate-700'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${config.is_enabled ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-bold uppercase text-slate-500">SMTP Host <span className="text-red-500">*</span></label>
                <input type="text" value={config.smtp_host} onChange={e => setConfig({...config, smtp_host: e.target.value})} className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl outline-none" />
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-slate-500">SMTP Port <span className="text-red-500">*</span></label>
                <input type="number" value={config.smtp_port} onChange={e => setConfig({...config, smtp_port: Number(e.target.value)})} className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl outline-none" />
              </div>
              
              <div>
                <label className="text-xs font-bold uppercase text-slate-500 mb-1 block">Enable Authentication</label>
                <div className="flex items-center mt-3">
                  <button 
                    onClick={() => setConfig({...config, enable_authentication: !config.enable_authentication})}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${config.enable_authentication ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-slate-700'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${config.enable_authentication ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                  <span className="ml-3 text-sm font-medium text-slate-600 dark:text-slate-400">
                    {config.enable_authentication ? "Yes" : "No"}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-slate-500">Encryption Type</label>
                <select 
                  value={config.encryption_type} 
                  onChange={e => setConfig({...config, encryption_type: e.target.value})}
                  className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl outline-none"
                >
                  <option value="TLS">TLS</option>
                  <option value="SSL">SSL</option>
                  <option value="None">None</option>
                </select>
              </div>

              {config.enable_authentication && (
                <>
                  <div>
                    <label className="text-xs font-bold uppercase text-slate-500">SMTP Username</label>
                    <input type="text" value={config.smtp_username} onChange={e => setConfig({...config, smtp_username: e.target.value})} className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl outline-none" />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase text-slate-500">SMTP Password</label>
                    <div className="relative mt-1">
                      <input 
                        type={showPassword ? "text" : "password"} 
                        value={config.smtp_password} 
                        onChange={e => setConfig({...config, smtp_password: e.target.value})} 
                        placeholder={hasPassword ? "•••••••• (Saved securely)" : "Enter new password"} 
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl outline-none pr-10" 
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="text-xs font-bold uppercase text-slate-500">Sender Name (From Name)</label>
                <input type="text" value={config.from_name} onChange={e => setConfig({...config, from_name: e.target.value})} placeholder="e.g. Fluentia Team" className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl outline-none" />
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-slate-500">Sender Email (From Address)</label>
                <input type="email" value={config.from_email} onChange={e => setConfig({...config, from_email: e.target.value})} placeholder="e.g. noreply@fluentia.com" className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl outline-none" />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-slate-500">Reply-To Email</label>
                <input type="email" value={config.reply_to_email} onChange={e => setConfig({...config, reply_to_email: e.target.value})} className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl outline-none" />
              </div>
              
              <div>
                <label className="text-xs font-bold uppercase text-slate-500">Connection Timeout (Seconds)</label>
                <input type="number" value={config.connection_timeout} onChange={e => setConfig({...config, connection_timeout: Number(e.target.value)})} className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl outline-none" />
              </div>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-white/5 bg-white dark:bg-[#111827]/40">
            <h3 className="text-lg font-black mb-4">Send Test Email</h3>
            <div className="flex gap-4 items-center">
              <input 
                type="email" 
                value={testEmail} 
                onChange={e => setTestEmail(e.target.value)} 
                placeholder="Enter destination email address" 
                className="flex-1 max-w-md px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl outline-none" 
              />
              <button 
                onClick={handleTestEmail}
                disabled={testing}
                className="px-4 py-2 border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 text-slate-700 dark:text-white rounded-xl font-bold flex items-center gap-2 transition-all disabled:opacity-50"
              >
                <Send size={16} /> {testing ? "Sending..." : "Send Test"}
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'templates' && (
        <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-white/5 bg-white dark:bg-[#111827]/40">
          <h3 className="text-lg font-black mb-4">Notification Rules & Templates</h3>
          <div className="space-y-4">
            {templates.map((tpl) => (
              <div key={tpl.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-white/5">
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white capitalize">{tpl.template_type.replace('_', ' ')}</h4>
                  <p className="text-xs text-slate-500 mt-1">Subject: {tpl.subject}</p>
                </div>
                <div className="flex gap-3 items-center">
                  <button className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-default ${tpl.is_enabled ? 'bg-teal-500' : 'bg-slate-300 dark:bg-slate-700'}`}>
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${tpl.is_enabled ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                  <button onClick={() => setEditingTemplate(tpl)} className="text-xs font-bold text-indigo-500 hover:text-indigo-600 underline">Edit Template</button>
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
              {logs.length > 0 ? (
                logs.map((log) => (
                  <tr key={log.id} className="border-b border-slate-200 dark:border-white/5 last:border-0 text-slate-900 dark:text-white">
                    <td className="py-3 font-medium">{log.recipient}</td>
                    <td className="py-3">{log.subject}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                        log.status === 'success' ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' :
                        log.status === 'simulated' ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400' :
                        'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'
                      }`}>
                        {log.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 text-slate-500 text-xs">{new Date(log.created_at).toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-500 font-bold">No email logs found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

    </div>
    
    {editingTemplate && (
      <EmailTemplateModal 
        template={editingTemplate} 
        onClose={() => setEditingTemplate(null)} 
        onSaved={() => {
          setEditingTemplate(null);
          fetchTemplates();
        }} 
      />
    )}
    </>
  );
};
