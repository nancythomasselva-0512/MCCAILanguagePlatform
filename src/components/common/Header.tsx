import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Sun, Moon, Menu, X, ArrowRight, LogOut, ChevronDown, User, LogIn, Search, Activity } from 'lucide-react';
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

  const activeProviderCode = ({
    'text-to-speech': ttsProvider,
    'audio-transcription': audioSttProvider,
    'voice-to-text': transcriptionProvider,
    'translation': translationProvider,
  } as Record<string, string>)[activeTab] || '';

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const query = searchQuery.toLowerCase();
      let targetTab = '';

      if (query.includes('plan') || query.includes('bill') || query.includes('subscript') || query.includes('pay') || query.includes('upgrade')) targetTab = 'tenant-billing';
      else if (query.includes('dash') || query.includes('home') || query.includes('overview')) targetTab = 'dashboard';
      else if (query.includes('history') || query.includes('record') || query.includes('past')) targetTab = 'history-page';
      else if (query.includes('document') || query.includes('doc')) targetTab = 'document-intelligence';
      else if (query.includes('translate') || query.includes('language')) targetTab = 'text-translation';
      else if ((query.includes('audio') || query.includes('mp3')) && query.includes('text')) targetTab = 'audio-to-text';
      else if (query.includes('voice') && query.includes('text')) targetTab = 'voice-to-text';
      else if (query.includes('text') && query.includes('voice')) targetTab = 'text-to-speech';
      else if (query.includes('tts') || query.includes('speech') || query.includes('read')) targetTab = 'text-to-speech';
      else if (query.includes('stt') || query.includes('transcrib')) targetTab = 'voice-to-text';
      else if (query.includes('admin') || query.includes('super')) targetTab = 'sa-overview';

      if (targetTab) {
        if (setActiveTab) setActiveTab(targetTab as any);
        setSearchQuery('');
        (e.target as HTMLInputElement).blur();
      }
    }
  };

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
      { label: 'Home', id: 'landing' },
      { label: 'About', id: 'about' },
      { label: 'AI Tools', id: 'ai-language-tools' },
      { label: 'Plans', id: 'pricing' },
      { label: 'Contacts', id: 'contact' },
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
      <div className={`w-full flex h-20 md:h-24 items-center justify-between px-4 sm:px-6 ${viewMode === 'workspace' ? 'w-full px-4 md:px-8' : 'max-w-7xl mx-auto'}`}>

        <div className="flex items-center gap-2 md:gap-3">
          {viewMode !== 'workspace' ? (
            <div
              className="flex cursor-pointer items-center gap-0"
              onClick={() => { setViewMode('landing'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            >
              <img
                src={"/logo.png?v=2"}
                alt="Logo"
                className="h-16 w-16 min-w-[64px] md:h-20 md:w-20 md:min-w-[80px] object-contain transform scale-125 origin-center -ml-2 -mr-4 hover:scale-[1.35] transition-transform duration-200 dark:invert-0 dark:hue-rotate-0 invert hue-rotate-180"
              />
              <div className="flex flex-col justify-center select-none">
                <span className="font-display text-xl md:text-2xl font-black tracking-tight leading-none text-emerald-900 dark:text-emerald-50 flex items-center gap-1">
                  {globalConfig?.branding?.platform_name || "Fluentia"}
                </span>
                <span className="text-[8px] md:text-[10px] font-bold tracking-[0.2em] uppercase mt-1 text-teal-600 dark:text-teal-400">
                  {globalConfig?.branding?.tagline || "AI Language Platform"}
                </span>
              </div>
            </div>
          ) : (
            <div className="hidden md:flex flex-col justify-center animate-fadeIn">
              <span className="font-display text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                Welcome back, {user?.name?.split(' ')[0] || 'User'} 👋
              </span>
              <span className="text-xs font-bold tracking-wider text-slate-500 dark:text-slate-400 mt-1 uppercase">
                Ready to conquer the day and create something amazing
              </span>
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
                className="relative text-lg font-bold transition-all duration-200 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white py-1.5 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-teal-500 dark:after:bg-emerald-500 after:transition-all after:duration-200 after:ease-out"
              >
                {item.label}
              </button>
            ))}
          </nav>
        )}

        {/* Right: Actions */}
        <div className="hidden md:flex items-center gap-3">
          {viewMode === 'workspace' && (
            <div className="relative w-64 lg:w-80 transition-all mr-2">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Search size={16} className="text-slate-400 dark:text-slate-500" />
              </div>
              <input
                type="text"
                placeholder="Search tools, history..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                className="block w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-white/10 rounded-full leading-5 bg-white/50 dark:bg-slate-900/50 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 sm:text-sm shadow-sm transition-all hover:bg-white dark:hover:bg-slate-900/80"
              />
            </div>
          )}

          <button
            onClick={toggleTheme}
            className="flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
            style={{
              background: theme === 'dark' ? 'rgba(255, 255, 255, 0.04)' : 'rgba(15, 23, 42, 0.05)',
              border: '1px solid var(--border-base)',
              color: 'var(--text-secondary)',
            }}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {/* Auth Buttons or User Menu */}
          {(user && viewMode === 'workspace') ? (
            <div className="flex items-center gap-3">
              {/* Active Workspace / Open Workspace Button */}
              <button
                onClick={() => handleLaunchWorkspace()}
                className={`group flex items-center gap-2 rounded-full px-5 py-2 text-sm font-extrabold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer`}
                style={{
                  background: viewMode === 'workspace'
                    ? (theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(15, 23, 42, 0.08)')
                    : 'rgba(37, 99, 235, 0.1)',
                  color: viewMode === 'workspace' ? 'var(--text-primary)' : '#3b82f6',
                  border: '1px solid var(--border-base)',
                }}
              >
                <span className={`h-2 w-2 rounded-full ${viewMode === 'workspace' ? 'bg-emerald-500 animate-pulse' : 'bg-teal-500'}`} />
                <span>{viewMode === 'workspace' ? 'Workspace Active' : 'Go to Workspace'}</span>
              </button>

              {viewMode === 'workspace' && (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 rounded-full p-1 pr-3 border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 transition-all cursor-pointer"
                  >
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-teal-600 to-emerald-500 text-white flex items-center justify-center text-xs font-black border border-white/10 uppercase select-none">
                      {user.name ? user.name.charAt(0) : 'U'}
                    </div>
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300 max-w-[100px] truncate">
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

                        {user.role === 'super_admin' ? (
                          <>
                            <button
                              onClick={() => { window.history.pushState({}, '', '/controller'); handleLaunchWorkspace(); setDropdownOpen(false); }}
                              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white transition-all text-left cursor-pointer"
                            >
                              <Activity size={14} />
                              <span>Admin Panel</span>
                            </button>
                            <button
                              onClick={() => { window.history.pushState({}, '', '/dashboard'); handleLaunchWorkspace(); setDropdownOpen(false); }}
                              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white transition-all text-left cursor-pointer mt-0.5"
                            >
                              <User size={14} />
                              <span>User Dashboard</span>
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => { window.history.pushState({}, '', '/dashboard'); handleLaunchWorkspace(); setDropdownOpen(false); }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white transition-all text-left cursor-pointer"
                          >
                            <User size={14} />
                            <span>Open Workspace</span>
                          </button>
                        )}

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
                  background: 'linear-gradient(135deg, #0D9488, #10B981)',
                  color: '#ffffff',
                  border: '1px solid transparent',
                  boxShadow: '0 0 15px rgba(13, 148, 136, 0.15)',
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
            <div
              className="h-8 w-8 rounded-full bg-gradient-to-br from-teal-600 to-emerald-500 text-white flex items-center justify-center text-xs font-black border border-white/10 uppercase select-none cursor-pointer"
              onClick={() => handleLaunchWorkspace()}
            >
              {user.name ? user.name.charAt(0) : 'U'}
            </div>
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
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-teal-600 to-emerald-500 text-white flex items-center justify-center text-sm font-black border border-white/10 uppercase select-none">
                      {user.name ? user.name.charAt(0) : 'U'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-extrabold truncate text-slate-900 dark:text-white">{user.name}</p>
                      <p className="text-xs truncate text-slate-500 dark:text-slate-400 mt-0.5">{user.email}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleLaunchWorkspace()}
                    className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-white cursor-pointer"
                    style={{ background: 'linear-gradient(135deg, #0D9488, #10B981)' }}
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
                    style={{ background: 'linear-gradient(135deg, #0D9488, #10B981)' }}
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

