import React, { createContext, useContext, useState, useEffect } from 'react';

export type ActiveTabType = 'voice-to-text' | 'text-to-speech' | 'translation' | 'audio-transcription';
export type ViewModeType = 'landing' | 'workspace';

export interface HistoryItem {
  id: string;
  type: ActiveTabType;
  title: string;
  timestamp: string;
  details: string;
}

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl?: string;
  createdAt: string;
}

interface AppContextProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  activeTab: ActiveTabType;
  setActiveTab: (tab: ActiveTabType) => void;
  viewMode: ViewModeType;
  setViewMode: (mode: ViewModeType) => void;
  history: HistoryItem[];
  addHistoryItem: (type: ActiveTabType, title: string, details: string) => void;
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
  login: (name: string, email: string) => void;
  logout: () => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'signup';
  setAuthModalMode: (mode: 'login' | 'signup') => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('mcc-ai-theme');
    if (saved === 'light' || saved === 'dark') return saved;
    // Default to dark mode for the premium look!
    return 'dark';
  });

  const [activeTab, setActiveTab] = useState<ActiveTabType>('voice-to-text');
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
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');

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
    // Remove stale body class if any legacy code added it
    document.body.classList.remove('dark');
  }, [theme]);

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

  const addHistoryItem = (type: ActiveTabType, title: string, details: string) => {
    const newItem: HistoryItem = {
      id: Math.random().toString(36).substring(2, 9),
      type,
      title,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      details,
    };
    setHistory((prev) => [newItem, ...prev].slice(0, 50)); // Cap history at 50 items
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const deleteHistoryItem = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  // Auth Handlers
  const login = (name: string, email: string) => {
    const profile: UserProfile = {
      name,
      email,
      createdAt: new Date().toISOString(),
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`
    };
    setUser(profile);
    localStorage.setItem('mcc-ai-user', JSON.stringify(profile));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mcc-ai-user');
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
        login,
        logout,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
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

