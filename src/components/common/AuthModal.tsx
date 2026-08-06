import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Mail, Lock, Sparkles, CheckCircle2, Eye, EyeOff, Globe, User as UserIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGoogleLogin } from '@react-oauth/google';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    login: saveLoginSession,
    setViewMode,
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

  const handleClose = (force = false) => {
    setIsAuthModalOpen(false);
    if (!force) {
      setTimeout(() => {
        setError('');
        setIsSuccess(false);
      }, 300);
    }
  };

  const handleGoogleSuccess = async (tokenResponse: any) => {
    setError('');
    setIsLoading(true);
    try {
      if (authModalMode === 'tenant-signup') {
        if (!tenantName || !tenantSlug) {
           throw new Error("Please fill in Workspace Name and URL Slug before using Google Sign up.");
        }
        const response = await fetch("/api/auth/google/register-tenant", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tenant_name: tenantName,
            slug: tenantSlug.toLowerCase().trim(),
            credential: tokenResponse.access_token || tokenResponse.credential
          })
        });

        if (!response.ok) {
          const data = await response.json();
          const msg = Array.isArray(data.detail) ? data.detail.map((e: any) => e.msg || 'Invalid field').join(', ') : (data.detail || "Workspace registration failed.");
          throw new Error(msg);
        }

        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          setAuthModalMode('login');
        }, 1500);
      } else {
        const response = await fetch("/api/auth/google/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            credential: tokenResponse.access_token || tokenResponse.credential
          })
        });

        if (!response.ok) {
          const errData = await response.json();
          const msg = Array.isArray(errData.detail) ? errData.detail.map((e: any) => e.msg || 'Invalid field').join(', ') : (errData.detail || "Google Sign-In failed.");
          throw new Error(msg);
        }

        const data = await response.json();
        setIsSuccess(true);
        setTimeout(() => {
          const displayName = data.name || (data.email ? data.email.split('@')[0] : 'User');
          saveLoginSession(displayName, data.email || email || 'user@fluentia.ai', data.role || 'user', data.access_token, data.refresh_token, data.tenant_slug || null);
          setViewMode('workspace');
          handleClose(true);
        }, 1200);
      }
    } catch (err: any) {
      setError(err.message || "Google authentication failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: () => setError('Google Sign-In was cancelled.'),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (authModalMode === 'tenant-signup') {
        const response = await fetch("/api/auth/register-tenant", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tenant_name: tenantName || `${name || 'User'}'s Workspace`,
            slug: (tenantSlug || name || 'workspace').toLowerCase().replace(/[^a-z0-9]/g, ''),
            admin_name: name || 'Admin',
            admin_email: email,
            admin_password: password
          })
        });

        if (!response.ok) {
          const data = await response.json();
          const msg = Array.isArray(data.detail) ? data.detail.map((e: any) => `${e.loc?.join('.') || 'field'}: ${e.msg}`).join(', ') : (data.detail || "Workspace registration failed.");
          throw new Error(msg);
        }

        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          setAuthModalMode('login');
        }, 1500);

      } else {
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
          const msg = Array.isArray(data.detail) ? data.detail.map((e: any) => e.msg || 'Invalid credentials').join(', ') : (data.detail || "Incorrect email or password.");
          throw new Error(msg);
        }

        const data = await response.json();
        setIsSuccess(true);
        setTimeout(() => {
          saveLoginSession(data.name, email, data.role, data.access_token, data.refresh_token, data.tenant_slug);
          setViewMode('workspace');
          handleClose(true);
        }, 1200);
      }
    } catch (err: any) {
      setError(err.message || "Authentication request failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => handleClose(false)}
            className="absolute inset-0 bg-[#050A18]/80 backdrop-blur-md z-0"
          />

          {/* Modal Container Card */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ type: "spring", duration: 0.35 }}
            className="relative z-10 w-full max-w-[420px] overflow-hidden rounded-[28px] border border-slate-700/50 bg-[#0B132B] p-7 shadow-2xl text-white"
          >
            {/* Close Button */}
            <button
              onClick={() => handleClose(false)}
              className="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-full bg-slate-800/60 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer z-20"
            >
              <X size={16} />
            </button>

            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-10 text-center"
                >
                  <div className="rounded-full bg-emerald-500/20 p-4 text-emerald-400 mb-4">
                    <CheckCircle2 size={48} className="animate-pulse" />
                  </div>
                  <h3 className="text-xl font-bold tracking-tight mb-2 text-white">
                    {authModalMode === 'tenant-signup' ? 'Workspace Registered!' : 'Welcome Back'}
                  </h3>
                  <p className="text-xs text-slate-300">
                    {authModalMode === 'tenant-signup'
                      ? "Your workspace is ready. Please sign in to continue."
                      : "Redirecting to your language workstation..."}
                  </p>
                  <div className="w-10 h-1 bg-emerald-500 rounded-full mt-6 animate-pulse" />
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* Header Title */}
                  <div className="text-center mb-5">
                    <h2 className="text-2xl font-bold tracking-tight text-white">
                      {authModalMode === 'tenant-signup' ? 'Register Workspace' : 'Sign in to platform'}
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Access high-speed transcription & language models.
                    </p>
                  </div>

                  {/* Mode Switcher Tabs */}
                  <div className="grid grid-cols-2 p-1 bg-[#131D3B] rounded-2xl mb-5 border border-slate-700/40">
                    <button
                      type="button"
                      onClick={() => setAuthModalMode('login')}
                      className={`py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                        authModalMode === 'login'
                          ? 'bg-[#1E294B] text-white shadow-sm border border-slate-600/40'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Sign In
                    </button>
                    <button
                      type="button"
                      onClick={() => setAuthModalMode('tenant-signup')}
                      className={`py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                        authModalMode === 'tenant-signup'
                          ? 'bg-[#1E294B] text-white shadow-sm border border-slate-600/40'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Register Workspace
                    </button>
                  </div>

                  {error && (
                    <div className="mb-4 p-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 text-xs font-medium flex items-center gap-2">
                      <X size={14} className="shrink-0 cursor-pointer" onClick={() => setError('')} />
                      <span>{error}</span>
                    </div>
                  )}

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {authModalMode === 'tenant-signup' && (
                      <>
                        <div>
                          <label className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase mb-1.5">
                            WORKSPACE NAME
                          </label>
                          <div className="relative flex items-center bg-[#131D3B]/80 border border-slate-700/50 rounded-xl overflow-hidden focus-within:border-emerald-500 transition-colors">
                            <Globe size={15} className="ml-3.5 text-slate-400 shrink-0" />
                            <input
                              type="text"
                              required
                              value={tenantName}
                              onChange={(e) => {
                                setTenantName(e.target.value);
                                setTenantSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''));
                              }}
                              placeholder="Acme Corp"
                              className="w-full pl-3 pr-4 py-2.5 bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase mb-1.5">
                            FULL NAME
                          </label>
                          <div className="relative flex items-center bg-[#131D3B]/80 border border-slate-700/50 rounded-xl overflow-hidden focus-within:border-emerald-500 transition-colors">
                            <UserIcon size={15} className="ml-3.5 text-slate-400 shrink-0" />
                            <input
                              type="text"
                              required
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              placeholder="John Doe"
                              className="w-full pl-3 pr-4 py-2.5 bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
                            />
                          </div>
                        </div>
                      </>
                    )}

                    <div>
                      <label className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase mb-1.5">
                        EMAIL ADDRESS
                      </label>
                      <div className="relative flex items-center bg-[#131D3B]/80 border border-slate-700/50 rounded-xl overflow-hidden focus-within:border-emerald-500 transition-colors">
                        <Mail size={15} className="ml-3.5 text-slate-400 shrink-0" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@example.com"
                          className="w-full pl-3 pr-4 py-2.5 bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase mb-1.5">
                        PASSWORD
                      </label>
                      <div className="relative flex items-center bg-[#131D3B]/80 border border-slate-700/50 rounded-xl overflow-hidden focus-within:border-emerald-500 transition-colors">
                        <Lock size={15} className="ml-3.5 text-slate-400 shrink-0" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-3 pr-10 py-2.5 bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 text-slate-400 hover:text-white"
                        >
                          {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                    </div>

                    {/* Primary Button */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer mt-2"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Processing...</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <span>{authModalMode === 'tenant-signup' ? 'Register Workspace' : 'Sign In'}</span>
                          <Sparkles size={14} className="text-emerald-200" />
                        </div>
                      )}
                    </button>
                  </form>

                  {/* OR Divider */}
                  <div className="relative flex items-center justify-center my-4">
                    <div className="border-t border-slate-800 w-full" />
                    <span className="bg-[#0B132B] px-3 text-[10px] font-bold tracking-wider text-slate-500 uppercase absolute">
                      OR
                    </span>
                  </div>

                  {/* Google Button */}
                  <button
                    type="button"
                    onClick={() => loginWithGoogle()}
                    disabled={isLoading}
                    className="w-full py-3 px-4 rounded-xl bg-[#131D3B] hover:bg-[#1E294B] border border-slate-700/50 text-white text-xs font-bold transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-sm"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="#EA4335"
                        d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"
                      />
                      <path
                        fill="#4285F4"
                        d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16C3.7 19.7 7.5 22.3 12 23z"
                      />
                    </svg>
                    <span>Sign in with Google</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
