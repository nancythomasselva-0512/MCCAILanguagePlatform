import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Mail, Lock, User as UserIcon, Eye, EyeOff, Sparkles, CheckCircle2, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    login: saveLoginSession,
    theme,
    setViewMode,
    globalConfig,
  } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [tenantName, setTenantName] = useState('');
  const [tenantSlug, setTenantSlug] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isAuthModalOpen) return null;

  const handleClose = () => {
    setIsAuthModalOpen(false);
    setError('');
    setEmail('');
    setPassword('');
    setName('');
    setTenantName('');
    setTenantSlug('');
    setIsSuccess(false);
    setIsLoading(false);
    if (window.location.pathname === '/admin') {
      window.location.href = '/';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (authModalMode === 'tenant-signup') {
        // Multi-Tenant workspace setup
        const response = await fetch("http://127.0.0.1:8000/api/auth/register-tenant", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tenant_name: tenantName,
            slug: tenantSlug.toLowerCase().trim(),
            admin_name: name,
            admin_email: email,
            admin_password: password
          })
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.detail || "Workspace registration failed.");
        }

        await response.json();
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          setAuthModalMode('login');
          setPassword('');
          setName('');
          setTenantName('');
          setTenantSlug('');
        }, 2000);

      } else {
        // Standard Login
        const response = await fetch("http://127.0.0.1:8000/api/auth/login", {
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

        // Enforce role separation checks based on route path
        const role = data.role;
        const isAdminRoute = window.location.pathname === '/admin';
        if (isAdminRoute) {
          if (role !== 'super_admin') {
            throw new Error("This login is reserved for the Platform Super Administrator.");
          }
        } else {
          if (role === 'super_admin') {
            throw new Error("Super Admin accounts must log in through the Admin Portal.");
          }
        }

        setIsSuccess(true);
        setTimeout(() => {
          saveLoginSession(data.name, email, data.role, data.access_token, data.refresh_token, data.tenant_slug);
          setViewMode('workspace');
          handleClose();
        }, 1500);
      }
    } catch (err: any) {
      setError(err.message || "Connection failed. Please ensure the backend is running.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
        />

        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: "spring", duration: 0.4 }}
          className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-2xl p-8"
          style={{
            background: theme === 'dark'
              ? 'radial-gradient(circle at top left, rgba(16, 24, 48, 0.95), rgba(8, 12, 24, 0.98))'
              : 'rgba(255, 255, 255, 0.98)',
            color: 'var(--text-primary)',
          }}
        >
          {theme === 'dark' && (
            <div className="absolute -left-16 -top-16 w-36 h-36 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
          )}

          <button
            onClick={handleClose}
            className="absolute top-5 right-5 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-all cursor-pointer"
          >
            <X size={18} />
          </button>

          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-12 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 10 }}
                  className="rounded-full bg-emerald-500/10 p-4 text-emerald-500 mb-6"
                >
                  <CheckCircle2 size={56} className="animate-pulse" />
                </motion.div>
                <h3 className="text-2xl font-display font-black tracking-tight mb-2">
                  {authModalMode === 'tenant-signup' ? 'Workspace Registered!' : 'Authentication Successful'}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-[280px]">
                  {authModalMode === 'tenant-signup'
                    ? "Your corporate tenant has been successfully registered. Please sign in to continue."
                    : "Welcome back! Redirecting to your workspace..."}
                </p>
                <div className="w-12 h-1 bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-400 rounded-full mt-8 animate-pulse" />
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="mb-6 flex flex-col items-center text-center select-none">
                  <h2 className="text-2xl md:text-3xl font-display font-black tracking-tight leading-tight">
                    {window.location.pathname === '/admin'
                      ? 'Admin Sign In'
                      : authModalMode === 'tenant-signup'
                        ? 'Register Workspace'
                        : `Sign in to ${globalConfig?.branding?.platform_name || 'platform'}`}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {window.location.pathname === '/admin'
                      ? 'Configure tenant workspace parameters or platform options.'
                      : authModalMode === 'tenant-signup'
                        ? 'Provision a custom isolated tenant domain.'
                        : 'Access high-speed transcription & language models.'}
                  </p>
                </div>

                {window.location.pathname !== '/admin' && (
                  <div className="relative flex rounded-xl bg-slate-100 dark:bg-white/5 p-1 mb-6">
                    <button
                      type="button"
                      onClick={() => { setAuthModalMode('login'); setError(''); }}
                      className={`relative flex-1 py-2 text-xs font-bold transition-all duration-200 cursor-pointer ${authModalMode === 'login'
                          ? 'text-slate-900 dark:text-white'
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                        }`}
                    >
                      {authModalMode === 'login' && (
                        <motion.div
                          layoutId="active-tab-bg"
                          className="absolute inset-0 rounded-lg shadow-sm bg-white dark:bg-slate-800/80 border border-slate-200/40 dark:border-white/5"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                      <span className="relative z-10">Sign In</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => { setAuthModalMode('tenant-signup'); setError(''); }}
                      className={`relative flex-1 py-2 text-xs font-bold transition-all duration-200 cursor-pointer ${authModalMode === 'tenant-signup'
                          ? 'text-slate-900 dark:text-white'
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                        }`}
                    >
                      {authModalMode === 'tenant-signup' && (
                        <motion.div
                          layoutId="active-tab-bg"
                          className="absolute inset-0 rounded-lg shadow-sm bg-white dark:bg-slate-800/80 border border-slate-200/40 dark:border-white/5"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                      <span className="relative z-10">Register Workspace</span>
                    </button>
                  </div>
                )}

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 mb-4 text-xs bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl flex items-center gap-2"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500 flex-shrink-0 animate-ping" />
                    <span>{error}</span>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {authModalMode === 'tenant-signup' && (
                    <>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                            Workspace Name
                          </label>
                          <input
                            type="text"
                            required
                            value={tenantName}
                            onChange={(e) => setTenantName(e.target.value)}
                            placeholder="Acme Corp"
                            className="w-full px-3.5 py-2.5 rounded-xl text-sm transition-all focus:ring-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 outline-none text-slate-900 dark:text-white focus:border-blue-500 dark:focus:border-cyan-500"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                            Workspace URL Slug
                          </label>
                          <div className="relative">
                            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
                            <input
                              type="text"
                              required
                              value={tenantSlug}
                              onChange={(e) => setTenantSlug(e.target.value.replace(/[^a-zA-Z0-9-]/g, ""))}
                              placeholder="acme"
                              className="w-full pl-8 pr-3 py-2.5 rounded-xl text-xs font-semibold transition-all focus:ring-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 outline-none text-slate-900 dark:text-white focus:border-blue-500 dark:focus:border-cyan-500"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                          Your Name
                        </label>
                        <div className="relative">
                          <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={16} />
                          <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="John Doe"
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm transition-all focus:ring-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 outline-none text-slate-900 dark:text-white focus:border-blue-500 dark:focus:border-cyan-500"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      {window.location.pathname === '/admin' ? 'Admin Email Address' : 'Email Address'}
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={16} />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={window.location.pathname === '/admin' ? 'admin@company.com' : 'you@example.com'}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm transition-all focus:ring-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 outline-none text-slate-900 dark:text-white focus:border-blue-500 dark:focus:border-cyan-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        Password
                      </label>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={16} />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl text-sm transition-all focus:ring-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 outline-none text-slate-900 dark:text-white focus:border-blue-500 dark:focus:border-cyan-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer"
                      >
                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-extrabold text-white transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] cursor-pointer disabled:opacity-50"
                    style={{
                      background: 'linear-gradient(135deg, #1e40af, #0891b2)',
                      boxShadow: '0 4px 15px rgba(6, 182, 212, 0.2)',
                    }}
                  >
                    {isLoading ? (
                      <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>
                          {window.location.pathname === '/admin'
                            ? 'Admin Sign In'
                            : authModalMode === 'tenant-signup'
                              ? 'Register Workspace'
                              : 'Sign In'}
                        </span>
                        <Sparkles size={14} className="animate-pulse" />
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
