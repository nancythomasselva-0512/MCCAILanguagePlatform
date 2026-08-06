import React from "react";
import { Database, Download, RefreshCw } from "lucide-react";

export const BackupRestore: React.FC = () => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Database className="text-indigo-500" />
            Backup &amp; Restore
          </h2>
          <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mt-1">
            Create snapshots and manage platform data backups.
          </p>
        </div>
        <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center gap-2 transition-all">
          <Download size={16} /> Create Backup
        </button>
      </div>

      <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-white/5 bg-white dark:bg-[#111827]/40">
        <h3 className="text-lg font-black mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
          <RefreshCw size={18} className="text-slate-500" />
          Recent Backups
        </h3>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400">
              <th className="py-3 font-bold uppercase text-xs">Backup ID</th>
              <th className="py-3 font-bold uppercase text-xs">Type</th>
              <th className="py-3 font-bold uppercase text-xs">Size</th>
              <th className="py-3 font-bold uppercase text-xs">Date</th>
              <th className="py-3 font-bold uppercase text-xs">Status</th>
              <th className="py-3 font-bold uppercase text-xs text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-200 dark:border-white/5 last:border-0">
              <td className="py-4 font-bold text-slate-900 dark:text-white">backup_20260624_1000</td>
              <td className="py-4 text-slate-500 dark:text-slate-400">Full System</td>
              <td className="py-4 text-slate-500 dark:text-slate-400">1.2 GB</td>
              <td className="py-4 text-slate-500 dark:text-slate-400">Today, 10:00 AM</td>
              <td className="py-4">
                <span className="px-2 py-1 bg-emerald-500/10 text-emerald-500 rounded font-bold text-xs">
                  Completed
                </span>
              </td>
              <td className="py-4 text-right">
                <button className="text-indigo-500 hover:text-indigo-400 hover:underline font-bold mr-3 transition-colors">Download</button>
                <button className="text-red-500 hover:text-red-400 hover:underline font-bold transition-colors">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
