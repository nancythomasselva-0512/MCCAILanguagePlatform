import React from "react";
import { Activity } from "lucide-react";

export const ActivityCenter: React.FC = () => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Activity className="text-teal-500" />
            Activity Center
          </h2>
          <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mt-1">
            Real-time pulse of platform activities.
          </p>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-white/5 bg-white dark:bg-[#111827]/40">
        <div className="space-y-2">
          {[
            {
              color: "bg-emerald-500/20 text-emerald-500",
              title: 'New Tenant Registered: "Acme Corp"',
              time: "2 minutes ago",
            },
            {
              color: "bg-blue-500/20 text-blue-500",
              title: "Invoice INV-2026-0001 Paid",
              time: "15 minutes ago",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-4 p-3 hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl transition-colors"
            >
              <div className={`w-8 h-8 rounded-full ${item.color} flex items-center justify-center shrink-0`}>
                <Activity size={14} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">{item.title}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
