import React from 'react';
import { useApp } from '../../context/AppContext';
import { Shield, ArrowRight, Lock, Sun, Moon, CheckCircle2 } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { motion } from 'framer-motion';
import { HeroNeuralSphere } from '../landing/HeroNeuralSphere';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.4
    }
  }
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { type: 'spring' as const, bounce: 0.4, duration: 0.8 } 
  }
} as const;

const DynamicIcon = ({ name, size = 24 }: { name: string, size?: number }) => {
  const Icon = (LucideIcons as any)[name] || LucideIcons.Circle;
  return <Icon size={size} />;
};

export const ControllerLandingPage: React.FC = () => {
  const { setViewMode, globalConfig, theme, toggleTheme, user, logout } = useApp();

  const adminLandingConfig = globalConfig?.admin_landing || {
    title: "Platform Controller",
    description: "Welcome to the centralized management console. Control infrastructure, oversee tenants, and monitor global usage in real-time.",
    features: [
      {
        icon: "Server",
        title: "Infrastructure Control",
        description: "Manage global AI model deployments, API keys, and system resources from a central hub."
      },
      {
        icon: "Users",
        title: "Tenant Management",
        description: "Oversee all platform workspaces, monitor usage, and configure tenant-specific limits."
      },
      {
        icon: "CreditCard",
        title: "Billing & Plans",
        description: "Configure subscription tiers, handle payments, and review global platform revenue."
      },
      {
        icon: "Activity",
        title: "Audit & Compliance",
        description: "Track system health, review detailed audit logs, and enforce security policies."
      }
    ]
  };

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center p-4 lg:p-8 overflow-hidden" style={{ background: 'var(--bg-base)' }}>
      {/* Header Container */}
      <div className="absolute top-0 left-0 w-full h-16 md:h-20 z-[60] bg-[#f4f7f6] dark:bg-slate-950/80 border-b border-slate-200 dark:border-white/5 shadow-sm backdrop-blur-md px-4 lg:px-8 flex justify-center">
        <div className="w-full max-w-6xl h-full flex items-center justify-between">
          <div className="flex cursor-pointer items-center gap-0" onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
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

        {/* Right: Actions & Status */}
        <div className="flex items-center gap-4 md:gap-6">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold uppercase tracking-widest shadow-sm">
            <Shield size={14} className="text-teal-400 dark:text-teal-600" />
            <span>Secure Admin Portal</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              All Systems Operational
            </span>
          </div>

          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          </button>
        </div>
      </div>
    </div>

      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none flex justify-center">
        <div className="absolute top-0 w-full h-[500px] bg-gradient-to-b from-slate-900/10 to-transparent dark:from-white/5" />
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-teal-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-6xl relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">

        {/* Left Column: Branding and Intro */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, type: 'spring', bounce: 0.2 }}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-black tracking-tight text-slate-900 dark:text-white leading-[1.1] mb-6">
            {adminLandingConfig.title.split(' ')[0]} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-500 dark:from-teal-400 dark:to-emerald-400">
              {adminLandingConfig.title.split(' ').slice(1).join(' ')}
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-lg leading-relaxed">
            {adminLandingConfig.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => {
                  logout(); // Wipe any existing session for security
                  setViewMode('admin-login');
                }}
                className="group flex items-center justify-center gap-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-4 rounded-2xl font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-xl shadow-slate-900/20 dark:shadow-white/10"
              >
                <Lock size={18} className="text-teal-400 dark:text-teal-600" />
                <span>Super Admin Sign In</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform opacity-70" />
              </button>
            <a
              href="/"
              onClick={(e) => { e.preventDefault(); setViewMode('landing'); window.history.pushState({}, '', '/'); }}
              className="flex items-center justify-center px-8 py-4 rounded-2xl font-bold text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
            >
              Back to Website
            </a>
          </div>
        </motion.div>

        {/* Right Column: Hero Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, type: 'spring' }}
          className="relative flex justify-center items-center h-[400px] lg:h-[500px]"
        >
          <HeroNeuralSphere />
        </motion.div>
      </div>

      {/* Feature Grid Section (moved below) */}
      <div className="w-full max-w-6xl relative z-10 mt-20 mb-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {adminLandingConfig.features.map((feature: any, idx: number) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{ y: -5, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="p-6 rounded-3xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-white/5 shadow-sm hover:shadow-xl transition-all group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-teal-50 dark:group-hover:bg-teal-900/30 transition-all">
                <DynamicIcon name={feature.icon} size={24} />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};
