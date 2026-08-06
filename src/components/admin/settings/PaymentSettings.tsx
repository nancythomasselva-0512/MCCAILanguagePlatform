import React, { useState, useEffect } from "react";
import { CreditCard, Save, Loader2 } from "lucide-react";
import { apiRequest } from "../../../utils/api";

const inputCls =
  "w-full mt-1 px-3 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl outline-none text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500/40 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 dark:[color-scheme:dark]";
const labelCls = "text-xs font-bold uppercase text-slate-500 dark:text-slate-400";

export const PaymentSettings: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [config, setConfig] = useState({
    stripeEnabled: true,
    stripePublic: "",
    stripeSecret: "",
    razorpayEnabled: false,
    razorpayId: "",
    razorpaySecret: "",
    currency: "USD",
    gstPercent: 18,
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await apiRequest("/billing/settings");
        setConfig({
          stripeEnabled: data.stripe_enabled ?? false,
          stripePublic: data.stripe_public_key || "",
          stripeSecret: data.stripe_secret_key || "",
          razorpayEnabled: data.razorpay_enabled ?? false,
          razorpayId: data.razorpay_key_id || "",
          razorpaySecret: data.razorpay_key_secret || "",
          currency: data.currency || "USD",
          gstPercent: data.gst_percentage || 18,
        });
      } catch (err) {
        console.error("Failed to load billing settings:", err);
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await apiRequest("/billing/settings", {
        method: "PATCH",
        body: JSON.stringify({
          stripe_enabled: config.stripeEnabled,
          stripe_public_key: config.stripePublic,
          stripe_secret_key: config.stripeSecret,
          razorpay_enabled: config.razorpayEnabled,
          razorpay_key_id: config.razorpayId,
          razorpay_key_secret: config.razorpaySecret,
          currency: config.currency,
          gst_percentage: config.gstPercent,
        }),
      });
      alert("Settings saved successfully!");
    } catch (err: any) {
      alert(err.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-blue-500" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <CreditCard className="text-blue-500" />
            Payment Gateways
          </h2>
          <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mt-1">Configure Stripe, Razorpay, and billing details.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center gap-2 transition-all disabled:opacity-50"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stripe */}
        <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-white/5 bg-white dark:bg-[#111827]/40">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-black flex items-center gap-2 text-slate-900 dark:text-white">
              <div className="w-8 h-8 bg-[#635BFF] rounded-lg flex items-center justify-center text-white font-bold text-xs">S</div>
              Stripe Configuration
            </h3>
            <button
              onClick={() => setConfig({ ...config, stripeEnabled: !config.stripeEnabled })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${config.stripeEnabled ? "bg-blue-500" : "bg-slate-300 dark:bg-slate-600"}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${config.stripeEnabled ? "translate-x-6" : "translate-x-1"}`} />
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className={labelCls}>Publishable Key</label>
              <input type="text" value={config.stripePublic} onChange={e => setConfig({ ...config, stripePublic: e.target.value })} placeholder="pk_live_..." className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Secret Key</label>
              <input type="password" value={config.stripeSecret} onChange={e => setConfig({ ...config, stripeSecret: e.target.value })} placeholder="sk_live_..." className={inputCls} />
            </div>
            <button className="text-xs font-bold text-blue-500 hover:text-blue-400 hover:underline transition-colors">Test Stripe Connection</button>
          </div>
        </div>

        {/* Razorpay */}
        <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-white/5 bg-white dark:bg-[#111827]/40">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-black flex items-center gap-2 text-slate-900 dark:text-white">
              <div className="w-8 h-8 bg-[#02042B] rounded-lg flex items-center justify-center text-[#3395FF] font-bold text-xs">Rz</div>
              Razorpay Configuration
            </h3>
            <button
              onClick={() => setConfig({ ...config, razorpayEnabled: !config.razorpayEnabled })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${config.razorpayEnabled ? "bg-blue-500" : "bg-slate-300 dark:bg-slate-600"}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${config.razorpayEnabled ? "translate-x-6" : "translate-x-1"}`} />
            </button>
          </div>
          <div className={`space-y-4 ${!config.razorpayEnabled ? "opacity-50 pointer-events-none" : ""}`}>
            <div>
              <label className={labelCls}>Key ID</label>
              <input type="text" value={config.razorpayId} onChange={e => setConfig({ ...config, razorpayId: e.target.value })} placeholder="rzp_live_..." className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Key Secret</label>
              <input type="password" value={config.razorpaySecret} onChange={e => setConfig({ ...config, razorpaySecret: e.target.value })} className={inputCls} />
            </div>
            {!config.razorpayEnabled && (
              <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">Please enable Razorpay to configure.</p>
            )}
          </div>
        </div>

        {/* Global Billing Defaults */}
        <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-white/5 bg-white dark:bg-[#111827]/40 lg:col-span-2">
          <h3 className="text-lg font-black mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
            <CreditCard size={18} className="text-emerald-500" />
            Global Billing Defaults
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Platform Currency</label>
              <select value={config.currency} onChange={e => setConfig({ ...config, currency: e.target.value })} className={inputCls}>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="INR">INR</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Tax / GST Percentage (%)</label>
              <input type="number" value={config.gstPercent} onChange={e => setConfig({ ...config, gstPercent: Number(e.target.value) })} className={inputCls} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
