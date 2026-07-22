import React from "react";
import { Bell } from "lucide-react";

export const NotificationCenter: React.FC = () => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Bell className="text-yellow-500" />
            Notification Center
          </h2>
          <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mt-1">
            Manage platform-wide alerts and announcements.
          </p>
        </div>
        <button className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl font-bold transition-all">
          New Announcement
        </button>
      </div>

      <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-white/5 bg-white dark:bg-[#111827]/40 text-center py-12">
        <Bell size={48} className="mx-auto mb-4 text-slate-300 dark:text-slate-600" />
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Active Announcements</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Create an announcement to notify all tenants.</p>
      </div>
    </div>
  );
};
