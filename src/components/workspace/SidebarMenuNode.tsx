import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { ActiveTabType } from '../../context/AppContext';

export interface SidebarMenuItem {
  id: string;
  label: string;
  icon?: string;
  action?: 'tab' | 'settings' | 'logout' | 'history';
  tabId?: ActiveTabType;
  provider?: string;
  children?: SidebarMenuItem[];
}

interface SidebarMenuNodeProps {
  node: SidebarMenuItem;
  expanded: Record<string, boolean>;
  toggleExpanded: (id: string) => void;
  onSettingsOpen: () => void;
  onSidebarClose?: () => void; // for mobile drawer dismissal
  onHistoryOpen?: () => void;
}

const LucideIcon = ({ name, size = 15, className = '' }: { name: string; size?: number; className?: string }) => {
  const IconComponent = (Icons as any)[name];
  if (!IconComponent) return null;
  return <IconComponent size={size} className={className} />;
};

export const SidebarMenuNode: React.FC<SidebarMenuNodeProps> = ({
  node,
  expanded,
  toggleExpanded,
  onSettingsOpen,
  onSidebarClose,
  onHistoryOpen
}) => {
  const {
    activeTab,
    setActiveTab,
    ttsProvider,
    setTtsProvider,
    audioSttProvider,
    setAudioSttProvider,
    transcriptionProvider,
    setTranscriptionProvider,
    translationProvider,
    setTranslationProvider,
    logout,
    setViewMode
  } = useApp();

  const isFolder = node.children && node.children.length > 0;
  const isOpen = expanded[node.id] || false;

  // Determine if this node or any of its descendants is currently active
  const isNodeActive = (item: SidebarMenuItem): boolean => {
    if (item.children && item.children.length > 0) {
      return item.children.some(child => isNodeActive(child));
    }

    if (item.action === 'tab' && item.tabId === activeTab) {
      if (!item.provider) return true;

      // Check tool-specific provider selection
      if (item.tabId === 'text-to-speech') return ttsProvider === item.provider;
      if (item.tabId === 'audio-transcription') return audioSttProvider === item.provider;
      if (item.tabId === 'voice-to-text') return transcriptionProvider === item.provider;
      if (item.tabId === 'translation') return translationProvider === item.provider;
    }
    if (item.action === 'history' && activeTab === 'voice-to-text') { // Fallback/default active checks for history if needed
      return false;
    }
    return false;
  };

  const active = isNodeActive(node);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFolder) {
      toggleExpanded(node.id);
    } else {
      if (node.action === 'tab' && node.tabId) {
        setActiveTab(node.tabId);

        // Update active provider in context if defined
        if (node.provider) {
          if (node.tabId === 'text-to-speech') setTtsProvider(node.provider);
          else if (node.tabId === 'audio-transcription') setAudioSttProvider(node.provider);
          else if (node.tabId === 'voice-to-text') setTranscriptionProvider(node.provider);
          else if (node.tabId === 'translation') setTranslationProvider(node.provider);
        }

        if (onSidebarClose) onSidebarClose();
      } else if (node.action === 'settings') {
        onSettingsOpen();
        if (onSidebarClose) onSidebarClose();
      } else if (node.action === 'logout') {
        logout();
        setViewMode('landing');
      } else if (node.action === 'history') {
        if (onHistoryOpen) onHistoryOpen();
        if (onSidebarClose) onSidebarClose();
      }
    }
  };

  return (
    <div className="w-full">
      {/* Node Button */}
      <button
        onClick={handleClick}
        className={`w-full flex items-center justify-between py-1.5 px-4 rounded-xl text-sm font-semibold transition-all relative overflow-hidden select-none cursor-pointer ${isFolder
            ? 'text-teal-600 hover:text-teal-800 hover:bg-[var(--sidebar-panel-hover-bg)]'
            : active
              ? 'text-[var(--sidebar-panel-text-active)] font-bold'
              : 'text-teal-600 hover:text-teal-800 hover:bg-[var(--sidebar-panel-hover-bg)]'
          }`}
      >
        {/* Selection Indicator background */}
        {active && !isFolder && (
          <motion.div
            layoutId="sidebarNodeActiveBg"
            className="absolute inset-0 rounded-xl"
            style={{ zIndex: 0, background: "var(--sidebar-panel-active-bg)" }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          />
        )}

        <div className="flex items-center gap-2.5 relative z-10">
          {node.icon ? (
            <span className="flex h-5 w-5 items-center justify-center rounded text-current">
              <LucideIcon name={node.icon} size={15} />
            </span>
          ) : (
            // Default Bullet Dot for Sub-menu elements
            <span className={`h-1.5 w-1.5 rounded-full ml-1.5 transition-colors ${active ? 'bg-white' : 'bg-[var(--sidebar-panel-text)] opacity-30 group-hover:opacity-50'}`} />
          )}
          <span className="text-left leading-none">{node.label}</span>
        </div>

        {/* Chevron for accordions */}
        {isFolder && (
          <motion.span
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="opacity-50 text-[var(--sidebar-panel-text)] relative z-10 flex h-4 w-4 items-center justify-center"
          >
            <Icons.ChevronDown size={14} />
          </motion.span>
        )}
      </button>

      {/* Accordion Content */}
      <AnimatePresence initial={false}>
        {isFolder && isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.24, ease: 'easeInOut' }}
            className="overflow-hidden pl-3 border-l border-[var(--border-subtle)] ml-4.5 space-y-0.5 mt-1 rounded-r-xl bg-[var(--bg-subtle)] py-1 shadow-inner"
          >
            {node.children!.map((child) => (
              <SidebarMenuNode
                key={child.id}
                node={child}
                expanded={expanded}
                toggleExpanded={toggleExpanded}
                onSettingsOpen={onSettingsOpen}
                onSidebarClose={onSidebarClose}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
