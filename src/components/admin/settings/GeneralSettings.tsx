import React, { useState } from "react";
import { Settings, Save, Upload, Globe, Type } from "lucide-react";

export const GeneralSettings: React.FC = () => {
  const [config, setConfig] = useState({
    platformName: "Fluentia",
    description: "Next Generation AI Workstation",
    timezone: "UTC",
    language: "en-US",
    dateFormat: "MM/DD/YYYY",
    currency: "USD",
    footerText: "Powering Next-Gen Language AI",
    copyright: "© 2026 MCC AI. All rights reserved."
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Settings className="text-teal-500" />
            General Settings
          </h2>
          <p className="text-sm font-bold text-slate-500 mt-1">Configure global platform details.</p>
        </div>
        <button className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold flex items-center gap-2 transition-all">
          <Save size={16} /> Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-white/5 bg-white dark:bg-[#111827]/40">
          <h3 className="text-lg font-black mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
            <Type size={18} className="text-blue-500" />
            Platform Details
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase text-slate-500">Platform Name</label>
              <input type="text" value={config.platformName} onChange={e => setConfig({...config, platformName: e.target.value})} className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl outline-none" />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-slate-500">Description</label>
              <textarea value={config.description} onChange={e => setConfig({...config, description: e.target.value})} className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl h-24 outline-none" />
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-white/5 bg-white dark:bg-[#111827]/40">
          <h3 className="text-lg font-black mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
            <Upload size={18} className="text-indigo-500" />
            Media & Assets
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase text-slate-500 mb-2 block">Logo</label>
              <div className="border-2 border-dashed border-slate-200 dark:border-white/10 rounded-xl p-4 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900/50 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800">
                <Upload size={24} className="text-slate-400 mb-2" />
                <span className="text-xs font-bold text-slate-500">Click to upload logo</span>
              </div>
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-slate-500 mb-2 block">Favicon</label>
              <div className="border-2 border-dashed border-slate-200 dark:border-white/10 rounded-xl p-4 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900/50 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800">
                <Upload size={24} className="text-slate-400 mb-2" />
                <span className="text-xs font-bold text-slate-500">Click to upload favicon</span>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-white/5 bg-white dark:bg-[#111827]/40">
          <h3 className="text-lg font-black mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
            <Globe size={18} className="text-emerald-500" />
            Localization
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase text-slate-500">Timezone</label>
              <select value={config.timezone} onChange={e => setConfig({...config, timezone: e.target.value})} className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl outline-none">
                <option>UTC</option>
                <option>America/New_York</option>
                <option>Asia/Kolkata</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-slate-500">Language</label>
              <select value={config.language} onChange={e => setConfig({...config, language: e.target.value})} className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl outline-none">
                <option value="en-US">English (US)</option>
                <option value="en-GB">English (UK)</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-slate-500">Date Format</label>
              <select value={config.dateFormat} onChange={e => setConfig({...config, dateFormat: e.target.value})} className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl outline-none">
                <option>MM/DD/YYYY</option>
                <option>DD/MM/YYYY</option>
                <option>YYYY-MM-DD</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-slate-500">Currency</label>
              <select value={config.currency} onChange={e => setConfig({...config, currency: e.target.value})} className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl outline-none">
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="INR">INR (₹)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-white/5 bg-white dark:bg-[#111827]/40">
          <h3 className="text-lg font-black mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
            <Type size={18} className="text-purple-500" />
            Footer & Legal
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase text-slate-500">Footer Text</label>
              <input type="text" value={config.footerText} onChange={e => setConfig({...config, footerText: e.target.value})} className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl outline-none" />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-slate-500">Copyright Text</label>
              <input type="text" value={config.copyright} onChange={e => setConfig({...config, copyright: e.target.value})} className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl outline-none" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
