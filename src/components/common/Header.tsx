import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sun, Moon, Menu, X, ArrowRight } from 'lucide-react';
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
      className="sticky top-0 z-50 w-full"
      style={{
        background: 'var(--bg-card)',
        borderBottom: '1px solid var(--border-base)',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <div className="w-full flex h-16 md:h-24 items-center justify-between px-4 sm:px-6">

        <div
          className="flex cursor-pointer items-center gap-2 md:gap-3.5"
          onClick={() => { setViewMode('landing'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
        >
          <img
            src="/logo.png"
            alt="MCC AI Transcription Logo"
            className="h-[52px] w-[52px] min-w-[52px] md:h-[84px] md:w-[84px] md:min-w-[84px] object-cover rounded-full shadow-lg hover:scale-105 transition-transform duration-200"
          />
          <div className="flex flex-col justify-center select-none">
            <span className="font-display text-base md:text-lg font-black tracking-tight leading-none" style={{ color: 'var(--text-primary)' }}>
              MCC <span className="text-[var(--accent)] font-bold">AI</span>
            </span>
            <span className="text-[8px] md:text-[10px] font-bold tracking-[0.15em] uppercase mt-0.5 md:mt-1.5" style={{ color: 'var(--text-muted)' }}>
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
                className="relative text-sm font-medium transition-all duration-300 hover:text-[var(--accent)] py-1.5 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-[var(--accent)] after:transition-all after:duration-300 after:ease-out"
                style={{ color: 'var(--text-secondary)' }}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:opacity-80"
              style={{
                background: 'var(--bg-subtle)',
                border: '1px solid var(--border-base)',
                color: 'var(--text-secondary)',
              }}
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            </button>

            <button
              onClick={() => handleLaunchWorkspace()}
              className={`group flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200`}
              style={viewMode === 'workspace' ? {
                background: 'var(--bg-subtle)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-base)',
              } : {
                background: 'var(--accent)',
                color: '#ffffff',
                border: '1px solid transparent',
              }}
            >
              {viewMode === 'workspace' && (
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
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
            className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
            style={{
              background: 'var(--bg-subtle)',
              border: '1px solid var(--border-base)',
              color: 'var(--text-secondary)',
            }}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon size={15} /> : <Sun size={15} />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
            style={{
              background: 'var(--bg-subtle)',
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
              background: 'var(--bg-card)',
              borderTop: '1px solid var(--border-base)',
            }}
            className="md:hidden overflow-hidden"
          >
            <div className="space-y-1 px-4 py-5">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => navigateToSection(item.id)}
                  className="block w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors hover:opacity-80"
                  style={{
                    color: 'var(--text-secondary)',
                  }}
                >
                  {item.label}
                </button>
              ))}
              <div className="pt-3 mt-3" style={{ borderTop: '1px solid var(--border-base)' }}>
                <button
                  onClick={() => handleLaunchWorkspace()}
                  className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white"
                  style={{ background: 'var(--accent)' }}
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
