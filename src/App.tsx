import { useEffect, useRef } from 'react';
import { useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { AuthModal } from './components/common/AuthModal';
import { LandingPage } from './components/landing/LandingPage';
import { WorkspacePage } from './components/workspace/WorkspacePage';
import { AnimatePresence, motion } from 'framer-motion';

function App() {
  const { viewMode, setViewMode, setAuthModalMode, setIsAuthModalOpen, user, logout } = useApp();
  const hasInitialized = useRef(false);

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
        } else {
          // Already logged in as super admin
          setViewMode('workspace');
        }
      } else if (window.location.pathname === '/dashboard') {
        if (!isNormalUser) {
          logout(); // Clear any invalid session
          setAuthModalMode('login');
          setIsAuthModalOpen(true);
        } else {
          // Already logged in as user
          setViewMode('workspace');
        }
      } else {
        // Any other path (like /)
        if (isSuperAdmin) {
          // Super admins should be on /controller
          window.history.replaceState({}, '', '/controller');
          setViewMode('workspace');
        } else if (isNormalUser) {
          // Normal users should be on /dashboard
          window.history.replaceState({}, '', '/dashboard');
          setViewMode('workspace');
        } else {
          // Not logged in -> Landing page
          setViewMode('landing');
        }
      }
    }
  }, [user, setAuthModalMode, setIsAuthModalOpen, setViewMode, logout]);

  // Ensure URL stays synchronized with viewMode and user role
  useEffect(() => {
    if (viewMode === 'workspace') {
      if (user?.role === 'super_admin' && window.location.pathname !== '/controller') {
        window.history.replaceState({}, '', '/controller');
      } else if (user?.role && user.role !== 'super_admin' && window.location.pathname !== '/dashboard') {
        window.history.replaceState({}, '', '/dashboard');
      }
    } else {
      // Landing mode
      if (window.location.pathname !== '/' && window.location.pathname !== '/controller' && window.location.pathname !== '/dashboard') {
        window.history.replaceState({}, '', '/');
      }
    }
  }, [viewMode, user?.role]);

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
