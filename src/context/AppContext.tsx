import React, { createContext, useContext, useState, useEffect } from 'react';

export type ActiveTabType = 'voice-to-text' | 'text-to-speech' | 'translation' | 'audio-transcription' | 'super-admin-dashboard' | 'tenant-dashboard' | 'tenant-billing' | 'sa-overview' | 'sa-tenants' | 'sa-users' | 'sa-plans' | 'sa-providers' | 'sa-usage' | 'sa-billing' | 'sa-ai-logs' | 'sa-audit-logs' | 'sa-health' | 'sa-builder';
export type ViewModeType = 'landing' | 'workspace';

export interface HistoryItem {
  id: string;
  type: string;
  title: string;
  timestamp: string;
  details: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'tenant_admin' | 'manager' | 'user';
  tenant_slug: string | null;
  avatarUrl?: string;
  createdAt?: string;
}

interface AppContextProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  activeTab: ActiveTabType;
  setActiveTab: (tab: ActiveTabType) => void;
  viewMode: ViewModeType;
  setViewMode: (mode: ViewModeType) => void;
  history: HistoryItem[];
  addHistoryItem: (type: string, title: string, details: string) => void;
  clearHistory: () => void;
  deleteHistoryItem: (id: string) => void;
  openAiApiKey: string;
  setOpenAiApiKey: (key: string) => void;
  detectedLang: string;
  setDetectedLang: (lang: string) => void;
  
  // Provider states
  ttsProvider: string;
  setTtsProvider: (provider: string) => void;
  audioSttProvider: string;
  setAudioSttProvider: (provider: string) => void;
  transcriptionProvider: string;
  setTranscriptionProvider: (provider: string) => void;
  translationProvider: string;
  setTranslationProvider: (provider: string) => void;

  // Notification toast
  notification: { message: string; type: 'success' | 'info' | 'warning' | 'error' } | null;
  setNotification: (notif: { message: string; type: 'success' | 'info' | 'warning' | 'error' } | null) => void;
  
  // Auth state
  user: UserProfile | null;
  token: string | null;
  tenantSlug: string | null;
  login: (name: string, email: string, role: string, token: string, refreshToken: string, tenantSlug?: string | null) => void;
  logout: () => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'signup' | 'tenant-signup';
  setAuthModalMode: (mode: 'login' | 'signup' | 'tenant-signup') => void;
  globalConfig: any;
  loadGlobalConfig: () => Promise<void>;
  billingOverview: any;
  fetchBillingOverview: () => Promise<void>;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('mcc-ai-theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return 'dark';
  });

  const [globalConfig, setGlobalConfig] = useState<any>(null);
  const [billingOverview, setBillingOverview] = useState<any>(null);

  const fetchBillingOverview = async () => {
    const savedToken = localStorage.getItem('mcc-ai-token');
    const savedSlug = localStorage.getItem('mcc-ai-tenant-slug');
    if (!savedToken) {
      setBillingOverview(null);
      return;
    }
    try {
      const response = await fetch("http://127.0.0.1:8000/api/billing/tenant/overview", {
        headers: {
          "Authorization": `Bearer ${savedToken}`,
          "x-tenant-slug": savedSlug || ""
        }
      });
      if (response.ok) {
        const data = await response.json();
        setBillingOverview(data);
      }
    } catch (e) {
      console.error("Failed to fetch billing overview", e);
    }
  };

  const loadGlobalConfig = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/platform-builder/global-config");
      if (response.ok) {
        const data = await response.json();
        setGlobalConfig(data);
        
        // Apply theme variables dynamically to document root
        if (data.theme) {
          const root = document.documentElement;
          if (data.theme.primary_color) {
            root.style.setProperty('--accent', data.theme.primary_color);
          }
          if (data.theme.secondary_color) {
            root.style.setProperty('--accent-hover', data.theme.secondary_color);
          }
          if (data.theme.font_family) {
            root.style.setProperty('--font-sans', `'${data.theme.font_family}', sans-serif`);
          }
        }
        
        // Apply branding name dynamically to document title
        if (data.branding?.platform_name) {
          document.title = `${data.branding.platform_name} - ${data.branding.tagline || 'Language Platform'}`;
        }
      }
    } catch (e) {
      console.error("Failed to fetch global config", e);
    }
  };

  useEffect(() => {
    loadGlobalConfig();
  }, []);

  const [activeTab, setActiveTab] = useState<ActiveTabType>(() => {
    const savedUser = localStorage.getItem('mcc-ai-user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed.role === 'super_admin') {
          return 'sa-overview';
        }
      } catch (e) {
        // ignore
      }
    }
    return 'voice-to-text';
  });
  const [viewMode, setViewMode] = useState<ViewModeType>('landing');
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    const saved = localStorage.getItem('mcc-ai-history');
    return saved ? JSON.parse(saved) : [];
  });

  // Provider states
  const [ttsProvider, setTtsProviderState] = useState<string>(() => {
    return localStorage.getItem('mcc-ai-tts-provider') || 'openai';
  });
  const [audioSttProvider, setAudioSttProviderState] = useState<string>(() => {
    return localStorage.getItem('mcc-ai-audiostt-provider') || 'openai';
  });
  const [transcriptionProvider, setTranscriptionProviderState] = useState<string>(() => {
    return localStorage.getItem('mcc-ai-transcription-provider') || 'openai';
  });
  const [translationProvider, setTranslationProviderState] = useState<string>(() => {
    return localStorage.getItem('mcc-ai-translation-provider') || 'openai';
  });
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' | 'warning' | 'error' } | null>(null);

  const setTtsProvider = (provider: string) => {
    setTtsProviderState(provider);
    localStorage.setItem('mcc-ai-tts-provider', provider);
  };
  const setAudioSttProvider = (provider: string) => {
    setAudioSttProviderState(provider);
    localStorage.setItem('mcc-ai-audiostt-provider', provider);
  };
  const setTranscriptionProvider = (provider: string) => {
    setTranscriptionProviderState(provider);
    localStorage.setItem('mcc-ai-transcription-provider', provider);
  };
  const setTranslationProvider = (provider: string) => {
    setTranslationProviderState(provider);
    localStorage.setItem('mcc-ai-translation-provider', provider);
  };

  // Auth States
  const [user, setUser] = useState<UserProfile | null>(() => {
    const savedUser = localStorage.getItem('mcc-ai-user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setTokenState] = useState<string | null>(() => {
    return localStorage.getItem('mcc-ai-token');
  });
  const [tenantSlug, setTenantSlugState] = useState<string | null>(() => {
    return localStorage.getItem('mcc-ai-tenant-slug');
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup' | 'tenant-signup'>('login');

  useEffect(() => {
    localStorage.setItem('mcc-ai-theme', theme);
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
    }
  }, [theme]);

  useEffect(() => {
    if (token) {
      fetchBillingOverview();
    } else {
      setBillingOverview(null);
    }
  }, [token]);

  const [openAiApiKey, setOpenAiApiKeyState] = useState<string>(() => {
    return localStorage.getItem('mcc-ai-openai-key') || '';
  });

  const [detectedLang, setDetectedLang] = useState('');

  const setOpenAiApiKey = (key: string) => {
    setOpenAiApiKeyState(key);
    localStorage.setItem('mcc-ai-openai-key', key);
  };

  useEffect(() => {
    localStorage.setItem('mcc-ai-history', JSON.stringify(history));
  }, [history]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const addHistoryItem = (type: string, title: string, details: string) => {
    const newItem: HistoryItem = {
      id: Math.random().toString(36).substring(2, 9),
      type,
      title,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      details,
    };
    setHistory((prev) => [newItem, ...prev].slice(0, 50));
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const deleteHistoryItem = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  // Auth Handlers
  const login = (
    name: string,
    email: string,
    role: any,
    token: string,
    refreshToken: string,
    slug?: string | null
  ) => {
    const profile: UserProfile = {
      id: Math.random().toString(36).substring(2, 9), // placeholder id if none parsed
      name,
      email,
      role,
      tenant_slug: slug || null,
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`
    };
    
    setUser(profile);
    setTokenState(token);
    setTenantSlugState(slug || null);
    
    localStorage.setItem('mcc-ai-user', JSON.stringify(profile));
    localStorage.setItem('mcc-ai-token', token);
    localStorage.setItem('mcc-ai-refresh-token', refreshToken);
    if (slug) {
      localStorage.setItem('mcc-ai-tenant-slug', slug);
    } else {
      localStorage.removeItem('mcc-ai-tenant-slug');
    }

    setNotification({ message: `Welcome back, ${name}!`, type: 'success' });
    
    // Set default active tab based on role
    if (role === 'super_admin') {
      setActiveTab('sa-overview');
    } else {
      setActiveTab('voice-to-text');
    }
    setViewMode('workspace');
  };

  const logout = () => {
    setUser(null);
    setTokenState(null);
    setTenantSlugState(null);
    localStorage.removeItem('mcc-ai-user');
    localStorage.removeItem('mcc-ai-token');
    localStorage.removeItem('mcc-ai-refresh-token');
    localStorage.removeItem('mcc-ai-tenant-slug');
    setViewMode('landing');
    setNotification({ message: 'Logged out successfully.', type: 'info' });
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        activeTab,
        setActiveTab,
        viewMode,
        setViewMode,
        history,
        addHistoryItem,
        clearHistory,
        deleteHistoryItem,
        openAiApiKey,
        setOpenAiApiKey,
        detectedLang,
        setDetectedLang,
        ttsProvider,
        setTtsProvider,
        audioSttProvider,
        setAudioSttProvider,
        transcriptionProvider,
        setTranscriptionProvider,
        translationProvider,
        setTranslationProvider,
        notification,
        setNotification,
        user,
        token,
        tenantSlug,
        login,
        logout,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        globalConfig,
        loadGlobalConfig,
        billingOverview,
        fetchBillingOverview
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
