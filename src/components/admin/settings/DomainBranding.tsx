import React, { useState } from "react";
import { Globe, Save, Layout, Palette } from "lucide-react";

export const DomainBranding: React.FC = () => {
  const [config, setConfig] = useState({
    customDomain: "mccai.example.com",
    primaryColor: "#2563EB",
    fontFamily: "Inter"
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Globe className="text-pink-500" />
            Domains & Branding
          </h2>
          <p className="text-sm font-bold text-slate-500 mt-1">Configure white-labeling and custom domains.</p>
        </div>
        <button className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-xl font-bold flex items-center gap-2 transition-all">
          <Save size={16} /> Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-white/5 bg-white dark:bg-[#111827]/40">
          <h3 className="text-lg font-black mb-4 flex items-center gap-2">
            <Globe size={18} className="text-blue-500" />
            Custom Domain
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase text-slate-500">Platform Domain</label>
              <div className="flex gap-2 mt-1">
                <input type="text" value={config.customDomain} onChange={e => setConfig({...config, customDomain: e.target.value})} className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl outline-none" />
                <button className="px-4 py-2 bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-white font-bold rounded-xl hover:bg-slate-300 dark:hover:bg-white/20 transition-all">Verify</button>
              </div>
              <p className="text-xs text-slate-500 mt-2 font-bold">Please configure your DNS CNAME to point to domains.mcc-ai.com</p>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-white/5 bg-white dark:bg-[#111827]/40">
          <h3 className="text-lg font-black mb-4 flex items-center gap-2">
            <Palette size={18} className="text-purple-500" />
            Theme Defaults
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase text-slate-500">Primary Color</label>
              <div className="flex items-center gap-3 mt-1">
                <div className="w-8 h-8 rounded-full border border-slate-200 dark:border-white/10 shadow-inner" style={{backgroundColor: config.primaryColor}} />
                <input type="text" value={config.primaryColor} onChange={e => setConfig({...config, primaryColor: e.target.value})} className="w-32 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl outline-none" />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-slate-500">Font Family</label>
              <select value={config.fontFamily} onChange={e => setConfig({...config, fontFamily: e.target.value})} className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl outline-none">
                <option value="Inter">Inter (Default)</option>
                <option value="Roboto">Roboto</option>
                <option value="Outfit">Outfit</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
