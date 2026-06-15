import { useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { AuthModal } from './components/common/AuthModal';
import { LandingPage } from './components/landing/LandingPage';
import { WorkspacePage } from './components/workspace/WorkspacePage';
import { AnimatePresence, motion } from 'framer-motion';

function App() {
  const { viewMode } = useApp();

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

