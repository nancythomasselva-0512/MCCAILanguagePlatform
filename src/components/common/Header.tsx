import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Sun, Moon, Menu, X, ArrowRight, LogOut, ChevronDown, User, LogIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PROVIDER_NAMES: Record<string, string> = {
  'openai': 'OpenAI API',
  'elevenlabs': 'ElevenLabs TTS',
  'deepgram': 'Deepgram AI',
  'assemblyai': 'AssemblyAI',
  'google': 'Google Translate',
  'deepl': 'DeepL Translator',
};

export const Header: React.FC = () => {
  const { 
    theme, 
    toggleTheme, 
    viewMode, 
    setViewMode, 
    setActiveTab,
    user,
    logout,
    setIsAuthModalOpen,
    setAuthModalMode,
    activeTab,
    globalConfig,
    ttsProvider,
    audioSttProvider,
    transcriptionProvider,
    translationProvider
  } = useApp();

  const activeProviderCode = ( {
    'text-to-speech': ttsProvider,
    'audio-transcription': audioSttProvider,
    'voice-to-text': transcriptionProvider,
    'translation': translationProvider,
  } as Record<string, string> )[activeTab] || '';

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navigateToSection = (sectionId: string) => {
    setMobileMenuOpen(false);
    setViewMode('landing');
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleLaunchWorkspace = (tabName?: any) => {
    setMobileMenuOpen(false);
    setViewMode('workspace');
    if (tabName) setActiveTab(tabName);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAuth = (mode: 'login' | 'signup') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
    setMobileMenuOpen(false);
  };

  const dbNavs = globalConfig?.navigation;
  const menuItems = dbNavs && dbNavs.length > 0
    ? dbNavs.filter((n: any) => n.is_visible).map((n: any) => ({ label: n.label, id: n.route }))
    : [
        { label: 'AI Tools', id: 'ai-language-tools' },
        { label: 'How It Works', id: 'workflow' },
        { label: 'Why MCC AI', id: 'features' },
        { label: 'Languages', id: 'languages' },
        { label: 'Testimonials', id: 'testimonials' },
      ];

  return (
    <header
      className="sticky top-0 z-50 w-full transition-all duration-300 backdrop-blur-md"
      style={{
        background: theme === 'dark' ? 'rgba(3, 7, 18, 0.75)' : 'rgba(255, 255, 255, 0.8)',
        borderBottom: '1px solid var(--border-base)',
        boxShadow: theme === 'dark' 
          ? '0 4px 24px -1px rgba(0, 0, 0, 0.3), 0 1px 0 rgba(255, 255, 255, 0.03)'
          : '0 4px 20px -1px rgba(0, 0, 0, 0.04)',
      }}
    >
      <div className={`w-full flex h-16 md:h-20 items-center justify-between px-4 sm:px-6 ${viewMode === 'workspace' ? 'w-full px-4 md:px-8' : 'max-w-7xl mx-auto'}`}>

        <div className="flex items-center gap-2 md:gap-3">
          {viewMode !== 'workspace' && (
            <div
              className="flex cursor-pointer items-center gap-2 md:gap-3"
              onClick={() => { setViewMode('landing'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            >
              <img
                src={globalConfig?.branding?.logo_url || "/logo.png"}
                alt="Logo"
                className="h-10 w-10 min-w-[40px] md:h-12 md:w-12 md:min-w-[48px] object-cover rounded-full shadow-md border border-white/10 hover:scale-105 transition-transform duration-200"
                style={{ height: globalConfig?.branding?.logo_size || "40px", width: globalConfig?.branding?.logo_size || "40px" }}
              />
              <div className="flex flex-col justify-center select-none">
                <span className="font-display text-base md:text-lg font-black tracking-tight leading-none text-slate-900 dark:text-white flex items-center gap-1">
                  {globalConfig?.branding?.platform_name || "MCC AI"}
                </span>
                <span className="text-[7px] md:text-[9px] font-bold tracking-[0.18em] uppercase mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                  {globalConfig?.branding?.tagline || "Language Platform"}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Center: Desktop Nav Menu (Only shown on Landing Page) */}
        {viewMode !== 'workspace' && (
          <nav className="hidden md:flex items-center justify-center gap-6">
            {menuItems.map((item: any) => (
              <button
                key={item.id}
                onClick={() => navigateToSection(item.id)}
                className="relative text-sm font-bold transition-all duration-200 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white py-1.5 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-blue-600 dark:after:bg-cyan-500 after:transition-all after:duration-200 after:ease-out"
              >
                {item.label}
              </button>
            ))}
          </nav>
        )}

        {/* Right: Actions */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
            style={{
              background: theme === 'dark' ? 'rgba(255, 255, 255, 0.04)' : 'rgba(15, 23, 42, 0.05)',
              border: '1px solid var(--border-base)',
              color: 'var(--text-secondary)',
            }}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          </button>

          {/* Auth Buttons or User Menu */}
          {(user && viewMode === 'workspace') ? (
            <div className="flex items-center gap-3">
              {/* Active Workspace / Open Workspace Button */}
              <button
                onClick={() => handleLaunchWorkspace()}
                className={`group flex items-center gap-2 rounded-full px-5 py-2 text-xs font-extrabold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer`}
                style={{
                  background: viewMode === 'workspace' 
                    ? (theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(15, 23, 42, 0.08)')
                    : 'rgba(37, 99, 235, 0.1)',
                  color: viewMode === 'workspace' ? 'var(--text-primary)' : '#3b82f6',
                  border: '1px solid var(--border-base)',
                }}
              >
                <span className={`h-2 w-2 rounded-full ${viewMode === 'workspace' ? 'bg-emerald-500 animate-pulse' : 'bg-blue-500'}`} />
                <span>{viewMode === 'workspace' ? 'Workspace Active' : 'Go to Workspace'}</span>
              </button>

              {viewMode === 'workspace' && activeProviderCode && (
                <div className="flex items-center gap-1.5 rounded-full bg-indigo-500/10 dark:bg-indigo-500/25 border border-indigo-500/20 dark:border-indigo-500/30 px-3.5 py-1.5 text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400 select-none shadow-sm transition-all hover:scale-[1.02]">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
                  <span>{PROVIDER_NAMES[activeProviderCode] || activeProviderCode.toUpperCase()}</span>
                </div>
              )}

              {viewMode === 'workspace' && (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 rounded-full p-1 pr-3 border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 transition-all cursor-pointer"
                  >
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 object-cover border border-white/10"
                    />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 max-w-[80px] truncate">
                      {user.name}
                    </span>
                    <ChevronDown size={14} className={`text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 dark:border-white/10 shadow-xl p-2 z-50 overflow-hidden"
                        style={{
                          background: theme === 'dark' ? '#0b1120' : '#ffffff',
                        }}
                      >
                        {/* User Info Header */}
                        <div className="px-3 py-2.5 mb-1.5 select-none rounded-xl bg-slate-50 dark:bg-white/5">
                          <p className="text-xs font-extrabold text-slate-900 dark:text-white truncate">
                            {user.name}
                          </p>
                          <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate mt-0.5">
                            {user.email}
                          </p>
                        </div>

                        {/* Dropdown Items */}
                        <button
                          onClick={() => { handleLaunchWorkspace(); setDropdownOpen(false); }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white transition-all text-left cursor-pointer"
                        >
                          <User size={14} />
                          <span>Open Workspace</span>
                        </button>

                        <div className="h-[1px] bg-slate-200 dark:bg-white/5 my-1.5" />

                        <button
                          onClick={() => { logout(); setDropdownOpen(false); }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-lg text-red-500 hover:bg-red-500/10 transition-all text-left cursor-pointer"
                        >
                          <LogOut size={14} />
                          <span>Sign Out</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3 pl-1">
              {/* Single Combined Auth Button */}
              <button
                onClick={() => handleOpenAuth('login')}
                className="group flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-extrabold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                style={{
                  background: 'linear-gradient(135deg, #1e40af, #0891b2)',
                  color: '#ffffff',
                  border: '1px solid transparent',
                  boxShadow: '0 0 15px rgba(6, 182, 212, 0.15)',
                }}
              >
                <span>Sign In / Sign Up</span>
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          )}
        </div>

        {/* Mobile Actions */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={toggleTheme}
            className="flex h-8 w-8 items-center justify-center rounded-lg transition-all"
            style={{
              background: theme === 'dark' ? 'rgba(255, 255, 255, 0.04)' : 'rgba(15, 23, 42, 0.05)',
              border: '1px solid var(--border-base)',
              color: 'var(--text-secondary)',
            }}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon size={15} /> : <Sun size={15} />}
          </button>

          {user && viewMode === 'workspace' && (
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="h-8 w-8 rounded-full border border-white/10 bg-slate-100 dark:bg-slate-800"
              onClick={() => handleLaunchWorkspace()}
            />
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-8 w-8 items-center justify-center rounded-lg transition-all"
            style={{
              background: theme === 'dark' ? 'rgba(255, 255, 255, 0.04)' : 'rgba(15, 23, 42, 0.05)',
              color: 'var(--text-secondary)',
            }}
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              background: theme === 'dark' ? 'rgba(10, 15, 30, 0.95)' : 'rgba(255, 255, 255, 0.98)',
              borderTop: '1px solid var(--border-base)',
            }}
            className="md:hidden overflow-hidden backdrop-blur-lg"
          >
            <div className="space-y-1 px-4 py-5">
              {menuItems.map((item: any) => (
                <button
                  key={item.id}
                  onClick={() => navigateToSection(item.id)}
                  className="block w-full rounded-lg px-3 py-2.5 text-left text-sm font-bold transition-colors hover:bg-slate-100 dark:hover:bg-white/5"
                  style={{
                    color: 'var(--text-secondary)',
                  }}
                >
                  {item.label}
                </button>
              ))}

              {/* User details or Auth buttons inside mobile drawer */}
              {user ? (
                <div className="pt-4 mt-4 space-y-3" style={{ borderTop: '1px solid var(--border-base)' }}>
                  <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5">
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="h-10 w-10 rounded-full border border-white/10"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-extrabold truncate text-slate-900 dark:text-white">{user.name}</p>
                      <p className="text-xs truncate text-slate-500 dark:text-slate-400 mt-0.5">{user.email}</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleLaunchWorkspace()}
                    className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-white cursor-pointer"
                    style={{ background: 'linear-gradient(135deg, #1e40af, #0891b2)' }}
                  >
                    <span>Launch Workspace</span>
                    <ArrowRight size={14} />
                  </button>

                  <button
                    onClick={() => { logout(); setMobileMenuOpen(false); }}
                    className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold border border-red-500/20 text-red-500 hover:bg-red-500/5 transition-colors cursor-pointer"
                  >
                    <LogOut size={14} />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="pt-4 mt-4 space-y-2.5" style={{ borderTop: '1px solid var(--border-base)' }}>
                  <button
                    onClick={() => handleOpenAuth('login')}
                    className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold text-white cursor-pointer"
                    style={{ background: 'linear-gradient(135deg, #1e40af, #0891b2)' }}
                  >
                    <LogIn size={13} />
                    <span>Sign In / Sign Up</span>
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

