import React from "react";
import { Key, Plus } from "lucide-react";

export const APIKeys: React.FC = () => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Key className="text-amber-500" />
            API Keys
          </h2>
          <p className="text-sm font-bold text-slate-500 mt-1">Manage global platform API keys for external access.</p>
        </div>
        <button className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold flex items-center gap-2 transition-all">
          <Plus size={16} /> Generate New Key
        </button>
      </div>

      <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-white/5 bg-white dark:bg-[#111827]/40">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-white/10 text-slate-500">
              <th className="py-3">Name</th>
              <th className="py-3">Key Preview</th>
              <th className="py-3">Created</th>
              <th className="py-3">Last Used</th>
              <th className="py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-4 font-bold">Production API</td>
              <td className="py-4 font-mono text-xs bg-slate-100 dark:bg-white/5 px-2 rounded">sk_live_...4f9a</td>
              <td className="py-4 text-slate-500">2026-01-15</td>
              <td className="py-4 text-emerald-500">Today</td>
              <td className="py-4 text-right">
                <button className="text-red-500 hover:text-red-600 font-bold">Revoke</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
