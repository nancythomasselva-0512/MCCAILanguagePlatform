import React, { useState } from "react";
import { CreditCard, Save, CheckCircle } from "lucide-react";

export const PaymentSettings: React.FC = () => {
  const [config, setConfig] = useState({
    stripeEnabled: true,
    stripePublic: "pk_test_...",
    stripeSecret: "sk_test_...",
    razorpayEnabled: false,
    razorpayId: "",
    razorpaySecret: "",
    currency: "USD",
    gstPercent: 18
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <CreditCard className="text-blue-500" />
            Payment Gateways
          </h2>
          <p className="text-sm font-bold text-slate-500 mt-1">Configure Stripe, Razorpay, and billing details.</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center gap-2 transition-all">
          <Save size={16} /> Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-white/5 bg-white dark:bg-[#111827]/40">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-black flex items-center gap-2">
              <div className="w-8 h-8 bg-[#635BFF] rounded-lg flex items-center justify-center text-white font-bold text-xs">S</div>
              Stripe Configuration
            </h3>
            <button onClick={() => setConfig({...config, stripeEnabled: !config.stripeEnabled})} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${config.stripeEnabled ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${config.stripeEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase text-slate-500">Publishable Key</label>
              <input type="text" value={config.stripePublic} onChange={e => setConfig({...config, stripePublic: e.target.value})} className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl outline-none" />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-slate-500">Secret Key</label>
              <input type="password" value={config.stripeSecret} onChange={e => setConfig({...config, stripeSecret: e.target.value})} className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl outline-none" />
            </div>
            <button className="text-xs font-bold text-blue-600 hover:underline">Test Stripe Connection</button>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-white/5 bg-white dark:bg-[#111827]/40">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-black flex items-center gap-2">
              <div className="w-8 h-8 bg-[#02042B] rounded-lg flex items-center justify-center text-[#3395FF] font-bold text-xs">Rz</div>
              Razorpay Configuration
            </h3>
            <button onClick={() => setConfig({...config, razorpayEnabled: !config.razorpayEnabled})} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${config.razorpayEnabled ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${config.razorpayEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
          
          <div className="space-y-4 opacity-50 pointer-events-none">
            <div>
              <label className="text-xs font-bold uppercase text-slate-500">Key ID</label>
              <input type="text" value={config.razorpayId} onChange={e => setConfig({...config, razorpayId: e.target.value})} className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl outline-none" />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-slate-500">Key Secret</label>
              <input type="password" value={config.razorpaySecret} onChange={e => setConfig({...config, razorpaySecret: e.target.value})} className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl outline-none" />
            </div>
            <p className="text-xs text-slate-500 font-bold">Please enable Razorpay to configure.</p>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-white/5 bg-white dark:bg-[#111827]/40 lg:col-span-2">
          <h3 className="text-lg font-black mb-4 flex items-center gap-2">
            <CreditCard size={18} className="text-emerald-500" />
            Global Billing Defaults
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase text-slate-500">Platform Currency</label>
              <select value={config.currency} onChange={e => setConfig({...config, currency: e.target.value})} className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl outline-none">
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="INR">INR</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-slate-500">Tax / GST Percentage (%)</label>
              <input type="number" value={config.gstPercent} onChange={e => setConfig({...config, gstPercent: Number(e.target.value)})} className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl outline-none" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
