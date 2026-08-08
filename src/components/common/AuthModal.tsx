'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useGoogleLogin } from '@react-oauth/google';
import { motion, AnimatePresence } from 'framer-motion';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    login: saveLoginSession,
    setViewMode,
    globalConfig
  } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [tenantName, setTenantName] = useState('');
  const [tenantSlug, setTenantSlug] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const platformName = globalConfig?.branding?.platform_name || 'Fluentia';
  const taglineText = globalConfig?.branding?.tagline || 'AI Language Platform';
  const footerText = globalConfig?.branding?.footer_text || 'Powering Next-Gen Language AI';

  // Update page title when modal opens
  useEffect(() => {
    if (isAuthModalOpen) {
      document.title = `${platformName} — ${taglineText}`;
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isAuthModalOpen, platformName, taglineText]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isAuthModalOpen) {
        if (mobileMenuOpen) {
          setMobileMenuOpen(false);
        } else {
          handleClose(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAuthModalOpen, mobileMenuOpen]);

  const handleClose = (force = false) => {
    setIsAuthModalOpen(false);
    setMobileMenuOpen(false);
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
    if (!email) {
      setError('Please enter your email address.');
      return;
    }
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
            admin_password: password || 'defaultpass123'
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
            password: password || 'defaultpass123'
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

  if (!isAuthModalOpen) return null;

  return (
    <AnimatePresence>
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="echoid-hero"
      >
        {/* Full-bleed Background Video Layer */}
        <div className="echoid-media">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260806_132328_5f9029c8-218f-4489-82b6-29ff2849920e.png"
          >
            <source
              src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260806_133255_956f653f-5d80-4b06-abd5-0f46c98b60fa.mp4"
              type="video/mp4"
            />
          </video>
        </div>

        {/* Dual Gradient Scrim Overlay */}
        <div className="echoid-scrim" />

        {/* Row 1: Navbar (Top) */}
        <header className="echoid-nav">
          <button onClick={() => handleClose(false)} className="echoid-logo flex items-center gap-2">
            <img src="/logo.png?v=3" alt="Logo" className="h-8 sm:h-9 w-auto object-contain dark:invert-0 dark:brightness-100 invert brightness-90 filter transition-all duration-200" />
            <span className="font-extrabold tracking-tight">{platformName}</span>
          </button>

          {/* Desktop Nav Cluster */}
          <div className="echoid-nav-links">
            <nav className="echoid-nav-items">
              <a href="#ai-language-tools" className="echoid-nav-link" onClick={() => handleClose(false)}>AI Tools</a>
              <a href="#pricing" className="echoid-nav-link" onClick={() => handleClose(false)}>Plans</a>
              <a href="#contact" className="echoid-nav-link" onClick={() => handleClose(false)}>Contact</a>
            </nav>
            <a href="#join" className="echoid-cta-btn" onClick={(e) => { e.preventDefault(); setAuthModalMode('login'); }}>
              JOIN UP
            </a>
            <button
              type="button"
              onClick={() => handleClose(false)}
              className="echoid-close-btn"
              title="Close overlay"
              aria-label="Close menu"
            >
              [ X ]
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            className={`echoid-hamburger ${mobileMenuOpen ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobileMenu"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            <span className="echoid-hamburger-bar" />
            <span className="echoid-hamburger-bar" />
            <span className="echoid-hamburger-bar" />
          </button>
        </header>

        {/* Mobile Menu Overlay */}
        <div
          id="mobileMenu"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          aria-hidden={!mobileMenuOpen}
          className={`echoid-mobile-menu ${mobileMenuOpen ? 'open' : ''}`}
        >
          <a href="#ai-language-tools" className="echoid-mobile-item" style={{ transitionDelay: '180ms' }} onClick={() => { setMobileMenuOpen(false); handleClose(false); }}>
            AI Tools
          </a>
          <a href="#pricing" className="echoid-mobile-item" style={{ transitionDelay: '250ms' }} onClick={() => { setMobileMenuOpen(false); handleClose(false); }}>
            Plans
          </a>
          <a href="#contact" className="echoid-mobile-item" style={{ transitionDelay: '320ms' }} onClick={() => { setMobileMenuOpen(false); handleClose(false); }}>
            Contact
          </a>
          <a href="#join" className="echoid-mobile-item echoid-mobile-cta" style={{ transitionDelay: '390ms' }} onClick={() => { setMobileMenuOpen(false); setAuthModalMode('login'); }}>
            JOIN UP
          </a>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="echoid-close-btn mt-6"
          >
            [ CLOSE MENU ]
          </button>
        </div>

        {/* Row 2: Right Panel Form (Voice Entry Signup) */}
        <main className="echoid-body">
          <div className="echoid-panel">
            {/* 1) Chip */}
            <div className="echoid-chip">
              [ {taglineText.toUpperCase()} ]
            </div>

            {/* 2) H1 */}
            <h1 className="echoid-h1">
              {platformName.toUpperCase()}
            </h1>

            {/* 3) Tagline */}
            <p className="echoid-tagline">
              {footerText.toUpperCase()}
            </p>

            {/* Success State Notification */}
            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 p-6 border border-emerald-500/50 bg-emerald-500/10 text-white font-mono text-sm uppercase tracking-widest text-center w-full"
              >
                ✓ AUTHENTICATION GRANTED. REDIRECTING...
              </motion.div>
            ) : (
              /* 4) Form */
              <form noValidate onSubmit={handleSubmit} className="echoid-form">
                {error && (
                  <div className="p-3 border border-red-500/40 bg-red-500/10 text-red-300 font-mono text-xs uppercase tracking-wider mb-2">
                    ERROR: {error}
                  </div>
                )}

                {/* Additional workspace fields if registering workspace */}
                {authModalMode === 'tenant-signup' && (
                  <>
                    <div>
                      <label htmlFor="tenantName" className="sr-only">Workspace Name</label>
                      <input
                        id="tenantName"
                        type="text"
                        required
                        value={tenantName}
                        onChange={(e) => {
                          setTenantName(e.target.value);
                          setTenantSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''));
                        }}
                        placeholder="Workspace Name (e.g. Acme Corp)"
                        className="echoid-input mb-2"
                      />
                    </div>
                    <div>
                      <label htmlFor="adminName" className="sr-only">Full Name</label>
                      <input
                        id="adminName"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Full Name"
                        className="echoid-input mb-2"
                      />
                    </div>
                  </>
                )}

                {/* a) Email Field */}
                <div>
                  <label htmlFor="echoidEmail" className="sr-only">Email</label>
                  <input
                    id="echoidEmail"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="echoid-input"
                  />
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="echoidPassword" className="sr-only">Password</label>
                  <input
                    id="echoidPassword"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="echoid-input"
                  />
                </div>

                {/* b) Button "Proceed with Google" (.btn--ghost) -> Google Sign In */}
                <button
                  type="button"
                  onClick={() => loginWithGoogle()}
                  disabled={isLoading}
                  className="echoid-btn-ghost flex items-center justify-center gap-3"
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
                  <span>SIGN IN WITH GOOGLE</span>
                </button>

                {/* c) Button "Access" (.btn--solid) -> Submit form */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="echoid-btn-solid"
                >
                  {isLoading ? 'AUTHENTICATING...' : (authModalMode === 'tenant-signup' ? 'REGISTER WORKSPACE' : 'ACCESS')}
                </button>

                {/* 5) Referral Link */}
                <button
                  type="button"
                  onClick={() => setAuthModalMode(authModalMode === 'tenant-signup' ? 'login' : 'tenant-signup')}
                  className="echoid-referral"
                >
                  {authModalMode === 'tenant-signup' ? 'SIGN IN WITH EXISTING ACCOUNT' : "I'VE GOT AN INVITE KEY"}
                </button>
              </form>
            )}
          </div>
        </main>

        {/* Row 3: Legal Footer */}
        <footer className="echoid-footer">
          Opening a {platformName} account signals that you accept our{' '}
          <a href="#privacy" onClick={(e) => e.preventDefault()}>Privacy Notice</a> and{' '}
          <a href="#terms" onClick={(e) => e.preventDefault()}>Service Contract</a>.
        </footer>
      </motion.section>
    </AnimatePresence>
  );
};
