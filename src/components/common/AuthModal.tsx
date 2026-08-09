'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { useGoogleLogin } from '@react-oauth/google';
import { Eye, EyeOff, X, Sparkles, CheckCircle2, Lock, Mail, User, Building } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    login: saveLoginSession,
    setViewMode,
    globalConfig,
  } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [tenantName, setTenantName] = useState('');
  const [tenantSlug, setTenantSlug] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  // Character Interaction State: 'idle' | 'email-focus' | 'password-focus' | 'password-peek'
  const [characterMood, setCharacterMood] = useState<'idle' | 'email-focus' | 'password-focus' | 'password-peek'>('idle');

  const platformName = globalConfig?.branding?.platform_name || 'Fluentia';

  useEffect(() => {
    if (isAuthModalOpen) {
      document.body.style.overflow = 'hidden';
      setEmail('');
      setPassword('');
      setName('');
      setTenantName('');
      setTenantSlug('');
      setError('');
      setIsSuccess(false);
      setCharacterMood('idle');
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isAuthModalOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isAuthModalOpen) {
        handleClose(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAuthModalOpen]);

  const handleClose = (force = false) => {
    setIsAuthModalOpen(false);
    if (!force) {
      setTimeout(() => {
        setError('');
        setIsSuccess(false);
        setCharacterMood('idle');
      }, 300);
    }
  };

  const handleGoogleSuccess = async (tokenResponse: any) => {
    setError('');
    setIsLoading(true);
    try {
      if (authModalMode === 'tenant-signup') {
        const autoName = name || 'User';
        const autoTenantName = tenantName || `${autoName}'s Workspace`;
        const autoTenantSlug = (tenantSlug || autoName.toLowerCase().replace(/[^a-z0-9]/g, '')) || 'workspace';

        const response = await fetch('/api/auth/google/register-tenant', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tenant_name: autoTenantName,
            slug: autoTenantSlug,
            credential: tokenResponse.access_token || tokenResponse.credential,
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          const msg = Array.isArray(data.detail)
            ? data.detail.map((e: any) => e.msg || 'Invalid field').join(', ')
            : data.detail || 'Workspace registration failed.';
          throw new Error(msg);
        }

        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          setAuthModalMode('login');
        }, 1500);
      } else {
        const response = await fetch('/api/auth/google/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            credential: tokenResponse.access_token || tokenResponse.credential,
          }),
        });

        if (!response.ok) {
          const errData = await response.json();
          const msg = Array.isArray(errData.detail)
            ? errData.detail.map((e: any) => e.msg || 'Invalid field').join(', ')
            : errData.detail || 'Google Sign-In failed.';
          throw new Error(msg);
        }

        const data = await response.json();
        setIsSuccess(true);
        setTimeout(() => {
          const displayName = data.name || (data.email ? data.email.split('@')[0] : 'User');
          saveLoginSession(
            displayName,
            data.email || email || 'user@fluentia.ai',
            data.role || 'user',
            data.access_token,
            data.refresh_token,
            data.tenant_slug || null
          );
          setViewMode('workspace');
          handleClose(true);
        }, 1200);
      }
    } catch (err: any) {
      setError(err.message || 'Google authentication failed.');
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
    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    setError('');
    setIsLoading(true);

    try {
      if (authModalMode === 'tenant-signup') {
        const autoName = name || (email ? email.split('@')[0] : 'User');
        const autoTenantName = `${autoName}'s Workspace`;
        let rawSlug = autoName.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (!rawSlug || rawSlug.length < 2) {
          rawSlug = 'workspace';
        }
        const autoSlug = `${rawSlug}-${Math.random().toString(36).substring(2, 6)}`;

        const response = await fetch('/api/auth/register-tenant', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tenant_name: autoTenantName,
            slug: autoSlug,
            admin_name: autoName,
            admin_email: email,
            admin_password: password || 'defaultpass123',
          }),
        });

        if (!response.ok) {
          let errorMsg = 'Workspace registration failed.';
          try {
            const data = await response.json();
            errorMsg = Array.isArray(data.detail)
              ? data.detail.map((e: any) => (typeof e === 'string' ? e : e.msg || 'Invalid field')).join(', ')
              : (typeof data.detail === 'string' ? data.detail : errorMsg);
          } catch {
            errorMsg = `Server response error (${response.status}). Please check your input.`;
          }
          throw new Error(errorMsg);
        }

        await response.json();
        setIsSuccess(true);
        setPassword('');
        setTimeout(() => {
          setIsSuccess(false);
          setAuthModalMode('login');
        }, 1500);
      } else {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: email,
            password: password || 'defaultpass123',
          }),
        });

        if (!response.ok) {
          let errorMsg = 'Incorrect email or password.';
          try {
            const data = await response.json();
            errorMsg = Array.isArray(data.detail)
              ? data.detail.map((e: any) => (typeof e === 'string' ? e : e.msg || 'Invalid credentials')).join(', ')
              : (typeof data.detail === 'string' ? data.detail : errorMsg);
          } catch {
            errorMsg = `Authentication error (${response.status}).`;
          }
          throw new Error(errorMsg);
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
      setError(err.message || 'Authentication request failed.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthModalOpen) return null;

  const isPasswordFocused = characterMood === 'password-focus';
  const isPasswordPeek = characterMood === 'password-peek' || (isPasswordFocused && showPassword);
  const isShy = isPasswordFocused && !showPassword;
  const isEmailFocused = characterMood === 'email-focus';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#0a0a0f]/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-[940px] bg-white rounded-[32px] shadow-2xl overflow-hidden border border-slate-100 flex flex-col my-auto"
        >
          {/* Close Modal Button */}
          <button
            onClick={() => handleClose(false)}
            className="absolute top-5 right-5 z-20 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Main 2-Column Container */}
          <div className="grid grid-cols-1 md:grid-cols-12 min-h-[560px]">
            {/* ── LEFT COLUMN: Animated Characters Playground ────────────────── */}
            <div className="md:col-span-5 bg-[#F4F4F6] relative p-8 flex flex-col justify-between items-center overflow-hidden min-h-[280px] md:min-h-full">
              {/* Top Platform Tag */}
              <div className="w-full flex items-center justify-start">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                  {platformName}
                </span>
              </div>

              {/* SVG Animated Characters Group */}
              <div className="relative w-full max-w-[280px] h-[220px] my-auto flex items-end justify-center">
                <svg viewBox="0 0 320 240" className="w-full h-full overflow-visible">
                  {/* 1. Orange Dome Character (Bottom Left) */}
                  <motion.g
                    animate={{
                      rotate: isShy ? -28 : isEmailFocused ? 4 : 0,
                      x: isShy ? -12 : isEmailFocused ? 6 : 0,
                      y: isShy ? 8 : 0,
                    }}
                    transition={{ type: 'spring', stiffness: 220, damping: 16 }}
                  >
                    {/* Body */}
                    <path
                      d="M 20 220 C 20 120, 150 120, 150 220 Z"
                      fill="#FF6B4A"
                    />
                    {/* Face Details */}
                    {isShy ? (
                      /* Turned away face / blush dots */
                      <g transform="translate(45, 160)">
                        <circle cx="15" cy="0" r="3" fill="#C0392B" opacity="0.6" />
                        <circle cx="45" cy="0" r="3" fill="#C0392B" opacity="0.6" />
                        <path d="M 25 10 Q 30 15 35 10" fill="none" stroke="#7F1D1D" strokeWidth="2.5" strokeLinecap="round" />
                      </g>
                    ) : (
                      /* Expressive Eyes & Mouth */
                      <g transform={isEmailFocused ? 'translate(75, 155)' : 'translate(65, 155)'}>
                        <circle cx="0" cy="0" r="4.5" fill="#1E293B" />
                        <circle cx="30" cy="0" r="4.5" fill="#1E293B" />
                        {/* Cheeks */}
                        <circle cx="-10" cy="8" r="4" fill="#E74C3C" opacity="0.4" />
                        <circle cx="40" cy="8" r="4" fill="#E74C3C" opacity="0.4" />
                        {/* Mouth */}
                        <path d="M 8 12 Q 15 18 22 12" fill="none" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
                      </g>
                    )}
                  </motion.g>

                  {/* 2. Purple Tall Character (Middle Left/Back) */}
                  <motion.g
                    animate={{
                      rotate: isShy ? -35 : isEmailFocused ? 6 : 0,
                      x: isShy ? -16 : isEmailFocused ? 8 : 0,
                      y: isShy ? 12 : 0,
                    }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  >
                    {/* Body */}
                    <rect x="90" y="55" width="85" height="165" rx="22" fill="#7C3AED" />
                    {/* Eyes & Mouth */}
                    {isShy ? (
                      /* Shy Eyes Closed */
                      <g transform="translate(115, 85)">
                        <path d="M 0 0 Q 5 -5 10 0" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
                        <path d="M 25 0 Q 30 -5 35 0" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
                      </g>
                    ) : (
                      <g transform={isEmailFocused ? 'translate(125, 85)' : 'translate(118, 85)'}>
                        <circle cx="0" cy="0" r="5" fill="#FFFFFF" />
                        <circle cx="0" cy="0" r="2.5" fill="#000000" />
                        <circle cx="28" cy="0" r="5" fill="#FFFFFF" />
                        <circle cx="28" cy="0" r="2.5" fill="#000000" />
                        <circle cx="14" cy="18" r="4" fill="#000000" />
                      </g>
                    )}
                  </motion.g>

                  {/* 3. Black Pillar Character with Big Eyes (Center Right) */}
                  <motion.g
                    animate={{
                      rotate: isShy ? 45 : isEmailFocused ? 3 : 0,
                      x: isShy ? 25 : isEmailFocused ? 5 : 0,
                      scaleY: isShy ? 0.9 : 1,
                    }}
                    transition={{ type: 'spring', stiffness: 240, damping: 18 }}
                  >
                    {/* Body */}
                    <rect x="160" y="85" width="60" height="135" rx="18" fill="#18181B" />
                    {/* Eyes */}
                    {isShy ? (
                      /* Turned completely around / Eyes hiding */
                      <g transform="translate(180, 115)">
                        <circle cx="10" cy="5" r="2" fill="#666666" />
                      </g>
                    ) : (
                      <g transform={isEmailFocused ? 'translate(178, 110)' : 'translate(172, 110)'}>
                        {/* Eye 1 */}
                        <circle cx="0" cy="0" r="10" fill="#FFFFFF" />
                        <circle cx={isEmailFocused ? 3 : 0} cy={isEmailFocused ? 1 : 0} r="4.5" fill="#000000" />
                        {/* Eye 2 */}
                        <circle cx="22" cy="0" r="10" fill="#FFFFFF" />
                        <circle cx={isEmailFocused ? 25 : 22} cy={isEmailFocused ? 1 : 0} r="4.5" fill="#000000" />
                      </g>
                    )}
                  </motion.g>

                  {/* 4. Yellow Arch Character (Front Right) */}
                  <motion.g
                    animate={{
                      rotate: isShy ? 30 : isEmailFocused ? 2 : 0,
                      x: isShy ? 20 : isEmailFocused ? 4 : 0,
                    }}
                    transition={{ type: 'spring', stiffness: 210, damping: 17 }}
                  >
                    {/* Body */}
                    <path
                      d="M 195 220 C 195 110, 275 110, 275 220 Z"
                      fill="#F59E0B"
                    />
                    {/* Eyes & Mouth */}
                    {isShy ? (
                      <g transform="translate(240, 145)">
                        <line x1="0" y1="0" x2="10" y2="0" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />
                      </g>
                    ) : (
                      <g transform={isEmailFocused ? 'translate(235, 140)' : 'translate(230, 140)'}>
                        <circle cx="0" cy="0" r="4" fill="#1E293B" />
                        <line x1="-15" y1="18" x2="15" y2="18" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
                      </g>
                    )}
                  </motion.g>
                </svg>
              </div>

              {/* Bottom Interactive Hint Caption */}
              <div className="w-full text-center">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {isShy ? (
                    <span className="text-purple-600 font-bold animate-pulse">
                      🙈 Shh! They turned around to protect your password.
                    </span>
                  ) : isPasswordPeek ? (
                    <span className="text-amber-600 font-bold">
                      😳 Whoa! Password revealed!
                    </span>
                  ) : (
                    <span>Type your password. Watch them look away.</span>
                  )}
                </p>
              </div>
            </div>

            {/* ── RIGHT COLUMN: Modern Clean Auth Form ────────────────────────── */}
            <div className="md:col-span-7 p-6 sm:p-10 flex flex-col justify-between">
              <div>
                {/* Starburst Icon */}
                <div className="w-full flex justify-center mb-4">
                  <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-900 shadow-sm">
                    <Sparkles className="w-5 h-5 text-slate-800" />
                  </div>
                </div>

                {/* Form Title & Subtitle */}
                <div className="text-center mb-6">
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                    {authModalMode === 'tenant-signup'
                      ? 'Register Workspace'
                      : authModalMode === 'signup'
                      ? 'Create an Account'
                      : 'Welcome back'}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    {authModalMode === 'tenant-signup'
                      ? 'Set up your dedicated AI Language platform workspace.'
                      : authModalMode === 'signup'
                      ? 'Start for free with instant access to AI tools.'
                      : 'Please enter your details.'}
                  </p>
                </div>

                {/* Error Message Alert */}
                {error && (
                  <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold">
                    {error}
                  </div>
                )}

                {/* Success Notification */}
                {isSuccess && (
                  <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>
                      {authModalMode === 'tenant-signup'
                        ? 'Registration Successful! Redirecting to Log In...'
                        : 'Authentication Granted! Redirecting...'}
                    </span>
                  </div>
                )}

                {/* Main Auth Form */}
                <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
                  {/* Additional Workspace Fields */}
                  {authModalMode === 'tenant-signup' && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          required
                          autoComplete="off"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Alex Morgan"
                          className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-slate-900 focus:bg-white transition-all"
                        />
                      </div>
                    </div>
                  )}

                  {/* Email Field */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type="email"
                        required
                        autoComplete="off"
                        value={email}
                        onFocus={() => setCharacterMood('email-focus')}
                        onBlur={() => setCharacterMood('idle')}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all shadow-sm"
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        autoComplete="new-password"
                        value={password}
                        onFocus={() => setCharacterMood(showPassword ? 'password-peek' : 'password-focus')}
                        onBlur={() => setCharacterMood('idle')}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setShowPassword(!showPassword);
                          setCharacterMood(!showPassword ? 'password-peek' : 'password-focus');
                        }}
                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-700 transition-colors"
                        title={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Checkbox & Forgot Password Row */}
                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer font-medium">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
                      />
                      <span>Remember for 30 days</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => setError('Password reset instructions sent to your email.')}
                      className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#18181B] hover:bg-black text-white font-bold py-3 rounded-full text-xs sm:text-sm transition-all shadow-md active:scale-[0.99] cursor-pointer disabled:opacity-50 mt-2"
                  >
                    {isLoading
                      ? 'Processing...'
                      : authModalMode === 'tenant-signup'
                      ? 'Register Workspace'
                      : authModalMode === 'signup'
                      ? 'Sign Up'
                      : 'Log in'}
                  </button>
                </form>

                {/* Or Divider */}
                <div className="relative my-5">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-white px-3 text-slate-400 font-medium">or</span>
                  </div>
                </div>

                {/* Google Sign-In Button */}
                <button
                  type="button"
                  onClick={() => loginWithGoogle()}
                  disabled={isLoading}
                  className="w-full bg-[#F4F4F6] hover:bg-[#EAEAEA] text-slate-800 font-bold py-2.5 px-4 rounded-full text-xs sm:text-sm transition-colors flex items-center justify-center gap-3 border border-slate-200/60 cursor-pointer"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
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
                  <span>Log in with Google</span>
                </button>
              </div>

              {/* Modal Footer Switch Mode */}
              <div className="mt-6 text-center text-xs text-slate-500">
                {authModalMode === 'login' ? (
                  <>
                    Don't have an account?{' '}
                    <button
                      onClick={() => setAuthModalMode('tenant-signup')}
                      className="font-bold text-[#6366F1] hover:underline cursor-pointer"
                    >
                      Sign up
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{' '}
                    <button
                      onClick={() => setAuthModalMode('login')}
                      className="font-bold text-[#6366F1] hover:underline cursor-pointer"
                    >
                      Log in
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
