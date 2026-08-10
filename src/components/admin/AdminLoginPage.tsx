'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Mail, Lock, Eye, EyeOff, Sparkles, AlertCircle, X, Shield, User } from 'lucide-react';
import { motion } from 'framer-motion';

export const AdminLoginPage: React.FC = () => {
  const { theme, setViewMode, login: saveLoginSession, setActiveTab } = useApp();
  const [selectedRole, setSelectedRole] = useState<'super_admin' | 'tenant_admin'>('super_admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: email,
          password: password
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Incorrect email or password.");
      }

      const data = await response.json();

      setTimeout(() => {
        saveLoginSession(data.name, email, data.role, data.access_token, data.refresh_token, data.tenant_slug);
        if (data.role === 'super_admin') {
          setActiveTab('sa-overview');
          setViewMode('workspace');
          window.history.pushState({}, '', '/controller');
        } else if (data.role === 'tenant_admin') {
          setActiveTab('tenant-dashboard');
          setViewMode('workspace');
          window.history.pushState({}, '', '/dashboard');
        } else {
          setActiveTab('dashboard');
          setViewMode('workspace');
          window.history.pushState({}, '', '/dashboard');
        }
      }, 300);

    } catch (err: any) {
      setError(err.message || "Connection failed. Please ensure the backend is running.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative" style={{ background: 'var(--bg-base)' }}>
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[20%] w-96 h-96 bg-orange-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[20%] w-96 h-96 bg-amber-500/10 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="w-full max-w-md relative z-10 p-8 sm:p-10 rounded-3xl border shadow-2xl backdrop-blur-xl"
        style={{
          background: theme === 'dark'
            ? 'linear-gradient(180deg, rgba(16,24,39,0.8) 0%, rgba(10,15,30,0.95) 100%)'
            : 'rgba(255,255,255,0.9)',
          borderColor: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'
        }}
      >
        <button
          onClick={() => { setViewMode('landing'); window.history.pushState({}, '', '/'); }}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 p-0.5 shadow-lg shadow-orange-500/20">
              <div className="w-full h-full bg-slate-950/50 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <Lock className="text-white" size={28} />
              </div>
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-black text-slate-900 dark:text-white mb-2 tracking-tight">
            Admin Sign In
          </h2>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            Platform administration and global settings
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 mb-6 text-sm bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl flex items-start gap-3"
          >
            <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
            <span className="font-semibold">{error}</span>
          </motion.div>
        )}

        {/* Role Quick Selector Tabs */}
        <div className="flex items-center gap-2 p-1.5 mb-6 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
          <button
            type="button"
            onClick={() => {
              setSelectedRole('super_admin');
              setError('');
            }}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              selectedRole === 'super_admin'
                ? 'bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white shadow-md shadow-orange-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Shield size={14} />
            <span>Super Admin</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectedRole('tenant_admin');
              setError('');
            }}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              selectedRole === 'tenant_admin'
                ? 'bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white shadow-md shadow-orange-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <User size={14} />
            <span>Admin</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} autoComplete="off" className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="email"
                required
                name="admin_login_email_no_autofill"
                autoComplete="one-time-code"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={selectedRole === 'super_admin' ? "aiadmin@gmail.com" : "workspaceadmin@gmail.com"}
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl text-sm transition-all focus:ring-2 bg-slate-100 dark:bg-white/5 border border-transparent dark:border-white/5 outline-none text-slate-900 dark:text-white focus:border-orange-500 focus:ring-orange-500/20 focus:bg-white dark:focus:bg-slate-900/50 font-medium"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Admin Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                required
                name="admin_login_password_no_autofill"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-12 pr-12 py-3.5 rounded-2xl text-sm transition-all focus:ring-2 bg-slate-100 dark:bg-white/5 border border-transparent dark:border-white/5 outline-none text-slate-900 dark:text-white focus:border-orange-500 focus:ring-orange-500/20 focus:bg-white dark:focus:bg-slate-900/50 font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-4 flex items-center justify-center gap-2 rounded-2xl py-4 text-sm font-black text-white transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:scale-100 shadow-lg shadow-orange-500/25 cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, #f97316 0%, #f59e0b 50%, #ea580c 100%)',
            }}
          >
            {isLoading ? (
              <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In Securely</span>
                <Sparkles size={16} className="animate-pulse opacity-80" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-xs font-semibold text-slate-500 dark:text-slate-400">
          Return to <a href="/" onClick={(e) => { e.preventDefault(); setViewMode('landing'); window.history.pushState({}, '', '/'); }} className="text-orange-600 dark:text-orange-400 hover:underline">main website</a>
        </div>
      </motion.div>
    </div>
  );
};
