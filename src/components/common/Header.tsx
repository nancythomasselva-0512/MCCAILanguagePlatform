import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sun, Moon, Menu, X, ArrowRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Header: React.FC = () => {
  const { theme, toggleTheme, viewMode, setViewMode, setActiveTab } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const menuItems = [
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
      <div className="w-full flex h-16 md:h-20 items-center justify-between px-4 sm:px-6 max-w-7xl mx-auto">

        <div
          className="flex cursor-pointer items-center gap-2 md:gap-3"
          onClick={() => { setViewMode('landing'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
        >
          <img
            src="/logo.png"
            alt="MCC AI Transcription Logo"
            className="h-10 w-10 min-w-[40px] md:h-12 md:w-12 md:min-w-[48px] object-cover rounded-full shadow-md border border-white/10 hover:scale-105 transition-transform duration-200"
          />
          <div className="flex flex-col justify-center select-none">
            <span className="font-display text-base md:text-lg font-black tracking-tight leading-none text-slate-900 dark:text-white flex items-center gap-1">
              MCC <span className="bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent font-extrabold">AI</span>
              <Sparkles size={11} className="text-cyan-600 dark:text-cyan-400 animate-pulse hidden md:inline" />
            </span>
            <span className="text-[7px] md:text-[9px] font-bold tracking-[0.18em] uppercase mt-0.5" style={{ color: 'var(--text-secondary)' }}>
              Language Platform
            </span>
          </div>
        </div>

        {/* Desktop Nav & Actions Grouped on the Right */}
        <div className="hidden md:flex items-center gap-8">
          <nav className="flex items-center gap-6">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => navigateToSection(item.id)}
                className="relative text-sm font-bold transition-all duration-200 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white py-1.5 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-blue-600 dark:after:bg-cyan-500 after:transition-all after:duration-200 after:ease-out"
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
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

            <button
              onClick={() => handleLaunchWorkspace()}
              className={`group flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-extrabold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer`}
              style={viewMode === 'workspace' ? {
                background: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(15, 23, 42, 0.08)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-base)',
              } : {
                background: 'linear-gradient(135deg, #1e40af, #0891b2)',
                color: '#ffffff',
                border: '1px solid transparent',
                boxShadow: '0 0 15px rgba(6, 182, 212, 0.15)',
              }}
            >
              {viewMode === 'workspace' && (
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              )}
              <span>{viewMode === 'workspace' ? 'Workspace Active' : 'Launch Platform'}</span>
              {viewMode !== 'workspace' && (
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
              )}
            </button>
          </div>
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
              {menuItems.map((item) => (
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
              <div className="pt-3 mt-3 animate-fade-in" style={{ borderTop: '1px solid var(--border-base)' }}>
                <button
                  onClick={() => handleLaunchWorkspace()}
                  className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-white cursor-pointer"
                  style={{ background: 'linear-gradient(135deg, #1e40af, #0891b2)' }}
                >
                  <span>Launch Workspace</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
