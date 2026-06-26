import { useEffect, useRef, useState } from 'react';
import { useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { AuthModal } from './components/common/AuthModal';
import { LandingPage } from './components/landing/LandingPage';
import { WorkspacePage } from './components/workspace/WorkspacePage';
import { AnimatePresence, motion } from 'framer-motion';

function App() {
  const { viewMode, setViewMode, setAuthModalMode, setIsAuthModalOpen, user, logout, activeTab, setActiveTab } = useApp();
  const hasInitialized = useRef(false);
  const [forceRender, setForceRender] = useState(0);

  useEffect(() => {
    const handlePopState = () => setForceRender(f => f + 1);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      const isSuperAdmin = user?.role === 'super_admin';
      const isNormalUser = user && user.role !== 'super_admin';
      
      if (window.location.pathname === '/controller') {
        if (!isSuperAdmin) {
          logout(); // Clear any non-admin session
          setAuthModalMode('admin-login');
          setIsAuthModalOpen(true);
          setViewMode('landing');
        } else {
          // Already logged in as super admin
          setViewMode('workspace');
        }
      } else if (window.location.pathname === '/dashboard') {
        if (!user) { // ALLOW super_admin to access /dashboard too
          logout(); // Clear any invalid session
          setAuthModalMode('login');
          setIsAuthModalOpen(true);
          setViewMode('landing');
        } else {
          // Already logged in
          setViewMode('workspace');
        }
      } else {
        // Any other path (like /) - MUST ALWAYS BE LANDING PAGE
        setViewMode('landing');
      }
    }
  }, [user, setAuthModalMode, setIsAuthModalOpen, setViewMode, logout]);

  // Ensure URL stays synchronized with viewMode and user role
  useEffect(() => {
    if (viewMode === 'workspace') {
      if (!user) return;
      
      const path = window.location.pathname;
      const isSA = activeTab?.startsWith('sa-') || activeTab === 'super-admin-dashboard';
      
      if (user.role === 'super_admin') {
        // Super admin can be on /controller or /dashboard. Default to /controller if somewhere else.
        if (path !== '/controller' && path !== '/dashboard') {
          window.history.replaceState({}, '', '/controller');
          if (!isSA) setActiveTab('sa-overview');
        } else if (path === '/dashboard' && isSA) {
          setActiveTab('text-to-speech');
        } else if (path === '/controller' && !isSA) {
          setActiveTab('sa-overview');
        }
      } else {
        // Normal user must be on /dashboard
        if (path !== '/dashboard') {
          window.history.replaceState({}, '', '/dashboard');
        }
        if (isSA) {
          setActiveTab('text-to-speech');
        }
      }
    } else {
      // Landing mode
      if (window.location.pathname !== '/' && window.location.pathname !== '/controller' && window.location.pathname !== '/dashboard') {
        window.history.replaceState({}, '', '/');
      }
    }
  }, [viewMode, user?.role, activeTab, setActiveTab, forceRender]);

  return (
    <div className="flex min-h-screen flex-col" style={{ background: 'var(--bg-base)', color: 'var(--text-primary)' }}>
      {viewMode === 'landing' && <Header />}
      <AuthModal />
      <AnimatePresence mode="wait">
        {viewMode === 'landing' ? (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex-1"
          >
            <LandingPage />
          </motion.div>
        ) : (
          <motion.div
            key="workspace"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex-1"
          >
            <WorkspacePage />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
