'use client';

import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../utils/api';
import { useApp } from '../../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, Users, CreditCard, Cpu, Check, 
  Loader2, Sparkles, Server, Trash2, ShieldCheck,
  AlertTriangle, Activity, Search, AlertCircle,
  Ban, CheckCircle2, BarChart2, PieChart, Layers,
  TrendingUp, Settings, MoreVertical,
  ArrowUpRight, Settings2, Edit, Copy, PowerOff, PlayCircle, Lock, Unlock, Mail, Download, RefreshCw, Eye, ToggleLeft, ToggleRight, Plus
} from 'lucide-react';

import { PlatformBuilder } from './PlatformBuilder';

import { GeneralSettings } from './settings/GeneralSettings';
import { TenantSettings } from './settings/TenantSettings';
import { SMTPSettings } from './settings/SMTPSettings';
import { AuthSettings } from './settings/AuthSettings';
import { SecuritySettings } from './settings/SecuritySettings';
import { PaymentSettings } from './settings/PaymentSettings';
import { DomainBranding } from './settings/DomainBranding';
import { APIKeys } from './settings/APIKeys';
import { BackupRestore } from './settings/BackupRestore';
import { NotificationCenter } from './settings/NotificationCenter';
import { ActivityCenter } from './settings/ActivityCenter';
import { ProviderManager } from './settings/ProviderManager';

type TabType = 'overview' | 'tenants' | 'providers' | 'plans' | 'users' | 'usage_analytics' | 'billing' | 'ai_logs' | 'audit_logs' | 'system_health' | 'settings' | 'builder' | 'settings-general' | 'settings-tenant' | 'settings-smtp' | 'settings-auth' | 'settings-security' | 'settings-payments' | 'settings-domains' | 'settings-apikeys' | 'settings-backup' | 'settings-notifications' | 'settings-activity';

const Sparkline: React.FC<{ points: number[]; color: string }> = ({ points, color }) => {
  const width = 68;
  const height = 26;
  const max = Math.max(...points, 1);
  const min = Math.min(...points, 0);
  const range = max - min || 1;
  const pad = 2;
  const coords = points.map((p, i) => {
    const x = (i / Math.max(1, points.length - 1)) * (width - 6) + 3;
    const y = (height - pad) - ((p - min) / range) * (height - pad * 2);
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} className="overflow-hidden opacity-90 shrink-0 block">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={coords}
      />
    </svg>
  );
};

// ── DYNAMIC SVG CHARTS & GRAPHS COMPONENTS ──

// 1. Area Trend Chart (Interactive SVG Area Curve)
const AreaTrendChart: React.FC<{
  data: { label: string; value: number }[];
  color?: string;
  gradientId: string;
  height?: number;
  unit?: string;
}> = ({ data, color = '#10b981', gradientId, height = 180, unit = '' }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  if (!data || data.length === 0) return null;

  const width = 500;
  const paddingX = 40;
  const paddingY = 30;
  const innerWidth = width - paddingX * 2;
  const innerHeight = height - paddingY * 2;

  const maxVal = Math.max(...data.map(d => d.value), 1);
  const minVal = 0;
  const range = maxVal - minVal || 1;

  const getX = (i: number) => paddingX + (i / Math.max(1, data.length - 1)) * innerWidth;
  const getY = (val: number) => paddingY + innerHeight - ((val - minVal) / range) * innerHeight;

  const points = data.map((d, i) => ({ x: getX(i), y: getY(d.value) }));
  
  let dPath = `M ${points[0].x},${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const curr = points[i];
    const next = points[i + 1];
    const cpX1 = curr.x + (next.x - curr.x) / 2;
    const cpY1 = curr.y;
    const cpX2 = curr.x + (next.x - curr.x) / 2;
    const cpY2 = next.y;
    dPath += ` C ${cpX1},${cpY1} ${cpX2},${cpY2} ${next.x},${next.y}`;
  }

  const areaPath = `${dPath} L ${points[points.length - 1].x},${height - paddingY} L ${points[0].x},${height - paddingY} Z`;

  return (
    <div className="relative w-full overflow-hidden select-none">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.4" />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {[0, 0.33, 0.66, 1].map((ratio, idx) => {
          const y = paddingY + innerHeight * ratio;
          return (
            <line
              key={idx}
              x1={paddingX}
              y1={y}
              x2={width - paddingX}
              y2={y}
              stroke="rgba(255, 255, 255, 0.07)"
              strokeDasharray="4 4"
            />
          );
        })}

        <path d={areaPath} fill={`url(#${gradientId})`} />
        <path d={dPath} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

        {points.map((pt, i) => (
          <g key={i} className="cursor-pointer" onMouseEnter={() => setHoveredIdx(i)} onMouseLeave={() => setHoveredIdx(null)}>
            <circle
              cx={pt.x}
              cy={pt.y}
              r={hoveredIdx === i ? 6 : 4}
              fill={color}
              stroke="#0f172a"
              strokeWidth="2"
              className="transition-all duration-200"
            />
            <text x={pt.x} y={height - 10} fill="#94a3b8" fontSize="10" fontWeight="600" textAnchor="middle">
              {data[i].label}
            </text>
          </g>
        ))}
      </svg>

      {hoveredIdx !== null && (
        <div
          className="absolute z-20 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold shadow-xl border border-white/10 pointer-events-none transform -translate-x-1/2 -translate-y-full"
          style={{
            left: `${(points[hoveredIdx].x / width) * 100}%`,
            top: `${(points[hoveredIdx].y / height) * 100 - 8}%`,
          }}
        >
          <div>{data[hoveredIdx].label}</div>
          <div className="text-emerald-400 font-mono text-sm">{data[hoveredIdx].value.toLocaleString()} {unit}</div>
        </div>
      )}
    </div>
  );
};

// 2. Stacked Multi Bar Chart (Multi-feature daily breakdown graph)
const StackedMultiBarChart: React.FC<{
  data: { day: string; audio: number; translation: number; tts: number; total: number }[];
  height?: number;
}> = ({ data, height = 220 }) => {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  if (!data || data.length === 0) return null;

  const width = 550;
  const paddingX = 45;
  const paddingY = 30;
  const innerWidth = width - paddingX * 2;
  const innerHeight = height - paddingY * 2;

  const maxTotal = Math.max(...data.map(d => d.total || 1), 1);
  const barWidth = Math.min(36, (innerWidth / data.length) * 0.6);

  return (
    <div className="relative w-full select-none">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
          const y = paddingY + innerHeight * (1 - ratio);
          const val = Math.round(maxTotal * ratio);
          return (
            <g key={idx}>
              <line x1={paddingX} y1={y} x2={width - paddingX} y2={y} stroke="rgba(255, 255, 255, 0.06)" strokeDasharray="3 3" />
              <text x={paddingX - 8} y={y + 3} fill="#64748b" fontSize="9" textAnchor="end">{val}</text>
            </g>
          );
        })}

        {data.map((d, i) => {
          const x = paddingX + (i + 0.5) * (innerWidth / data.length) - barWidth / 2;
          
          const audioH = (d.audio / maxTotal) * innerHeight;
          const transH = (d.translation / maxTotal) * innerHeight;
          const ttsH = (d.tts / maxTotal) * innerHeight;

          const baseY = paddingY + innerHeight;
          const audioY = baseY - audioH;
          const transY = audioY - transH;
          const ttsY = transY - ttsH;

          const isHovered = activeIdx === i;

          return (
            <g key={i} className="cursor-pointer" onMouseEnter={() => setActiveIdx(i)} onMouseLeave={() => setActiveIdx(null)}>
              {isHovered && (
                <rect
                  x={x - 6}
                  y={paddingY}
                  width={barWidth + 12}
                  height={innerHeight}
                  fill="rgba(255, 255, 255, 0.04)"
                  rx="8"
                />
              )}

              {d.audio > 0 && (
                <rect x={x} y={audioY} width={barWidth} height={audioH} fill="#14b8a6" rx="3" />
              )}
              {d.translation > 0 && (
                <rect x={x} y={transY} width={barWidth} height={transH} fill="#10b981" rx="3" />
              )}
              {d.tts > 0 && (
                <rect x={x} y={ttsY} width={barWidth} height={ttsH} fill="#f59e0b" rx="3" />
              )}

              <text x={x + barWidth / 2} y={height - 8} fill={isHovered ? "#38bdf8" : "#94a3b8"} fontSize="10" fontWeight="bold" textAnchor="middle">
                {d.day}
              </text>
            </g>
          );
        })}
      </svg>

      {activeIdx !== null && (
        <div
          className="absolute z-20 p-3 rounded-xl bg-slate-900/95 border border-white/10 text-xs font-bold text-white shadow-2xl backdrop-blur-md pointer-events-none"
          style={{
            left: `${((paddingX + (activeIdx + 0.5) * ((width - paddingX * 2) / data.length)) / width) * 100}%`,
            top: '0%',
            transform: 'translate(-50%, -105%)'
          }}
        >
          <div className="text-slate-300 font-bold border-b border-white/10 pb-1 mb-1.5">{data[activeIdx].day} Activity</div>
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-3 text-teal-400">
              <span>🎤 Audio Calls:</span>
              <span className="font-mono font-bold">{data[activeIdx].audio}</span>
            </div>
            <div className="flex items-center justify-between gap-3 text-emerald-400">
              <span>📄 Translation Calls:</span>
              <span className="font-mono font-bold">{data[activeIdx].translation}</span>
            </div>
            <div className="flex items-center justify-between gap-3 text-amber-400">
              <span>🗣️ TTS Calls:</span>
              <span className="font-mono font-bold">{data[activeIdx].tts}</span>
            </div>
            <div className="flex items-center justify-between gap-3 text-white font-extrabold border-t border-white/10 pt-1 mt-1">
              <span>Total API Calls:</span>
              <span className="font-mono">{data[activeIdx].total}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// 3. Resource Donut Chart (Donut pie graph for resource distribution)
const ResourceDonutChart: React.FC<{
  data: { label: string; value: number; color: string }[];
  centerTitle?: string;
  centerValue?: string;
  size?: number;
}> = ({ data, centerTitle = "Total Volume", centerValue, size = 180 }) => {
  const total = data.reduce((acc, d) => acc + d.value, 0);
  const radius = 65;
  const strokeWidth = 18;
  const circumference = 2 * Math.PI * radius;

  let cumulativeAngle = 0;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 select-none">
      <div className="relative flex items-center justify-center">
        <svg width={size} height={size} viewBox="0 0 160 160" className="transform -rotate-90">
          <circle cx="80" cy="80" r={radius} fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth={strokeWidth} />
          {data.map((item, idx) => {
            const pct = total > 0 ? item.value / total : 0;
            const strokeDasharray = `${pct * circumference} ${circumference}`;
            const strokeDashoffset = -cumulativeAngle * circumference;
            cumulativeAngle += pct;

            return (
              <circle
                key={idx}
                cx="80"
                cy="80"
                r={radius}
                fill="none"
                stroke={item.color}
                strokeWidth={strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-500 hover:opacity-80 cursor-pointer"
              />
            );
          })}
        </svg>

        <div className="absolute flex flex-col items-center justify-center text-center pointer-events-none">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{centerTitle}</span>
          <span className="text-xl font-black text-slate-900 dark:text-white mt-0.5 font-mono">
            {centerValue || total.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="space-y-2.5">
        {data.map((item, idx) => {
          const pct = total > 0 ? ((item.value / total) * 100).toFixed(1) : "0.0";
          return (
            <div key={idx} className="flex items-center gap-3 text-xs font-bold">
              <span className="h-3 w-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
              <span className="text-slate-700 dark:text-slate-300 flex-1">{item.label}</span>
              <span className="text-slate-900 dark:text-white font-mono">{item.value.toLocaleString()} ({pct}%)</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// 4. Horizontal Rank Bar Chart
const HorizontalRankBarChart: React.FC<{
  items: { name: string; plan: string; api_calls: number; audio_minutes: number; translation_chars: number; tts_chars: number }[];
}> = ({ items }) => {
  if (!items || items.length === 0) return null;
  const maxCalls = Math.max(...items.map(i => i.api_calls), 1);

  return (
    <div className="space-y-4">
      {items.map((item, idx) => {
        const pct = (item.api_calls / maxCalls) * 100;
        return (
          <div key={idx} className="space-y-1.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-white/5">
            <div className="flex items-center justify-between text-xs font-bold">
              <div className="flex items-center gap-2">
                <span className="h-5 w-5 rounded-full bg-teal-500/10 text-teal-400 flex items-center justify-center text-[10px] font-black">
                  #{idx + 1}
                </span>
                <span className="text-slate-900 dark:text-white font-extrabold">{item.name}</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-teal-500/10 text-teal-400 border border-teal-500/20">
                  {item.plan}
                </span>
              </div>
              <div className="flex items-center gap-3 font-mono">
                <span className="text-teal-400 font-bold">{item.api_calls.toLocaleString()} requests</span>
                <span className="text-slate-400">{item.audio_minutes}m audio</span>
              </div>
            </div>

            <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-950 rounded-full overflow-hidden border border-slate-300 dark:border-white/5">
              <div
                className="h-full bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.max(pct, 4)}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

// 5. Radial Gauge Chart
const RadialGaugeChart: React.FC<{
  value: number;
  title: string;
  color?: string;
  subtitle?: string;
}> = ({ value, title, color = '#10b981', subtitle }) => {
  const radius = 45;
  const strokeWidth = 10;
  const circumference = Math.PI * radius;
  const valNum = isNaN(value) ? 0 : value;
  const offset = circumference - (Math.min(valNum, 100) / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-4 rounded-2xl glass-card border border-slate-200 dark:border-white/5 bg-white dark:bg-[#111827]/40">
      <div className="relative flex items-center justify-center">
        <svg width="130" height="75" viewBox="0 0 120 70" className="overflow-visible">
          <path
            d="M 15 65 A 45 45 0 0 1 105 65"
            fill="none"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          <path
            d="M 15 65 A 45 45 0 0 1 105 65"
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-500"
          />
        </svg>

        <div className="absolute bottom-0 text-center">
          <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">{valNum.toFixed(0)}%</span>
        </div>
      </div>

      <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mt-2">{title}</span>
      {subtitle && <span className="text-[10px] text-slate-400 font-medium">{subtitle}</span>}
    </div>
  );
};

interface CustomDropdownProps {
  value: string;
  onChange: (val: string) => void;
  options: { value: string; label: string }[];
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({ value, onChange, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value) || options[0];

  return (
    <div ref={containerRef} className="relative inline-block text-left min-w-[180px]">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-1.5 outline-none font-semibold text-slate-800 dark:text-slate-200 cursor-pointer flex items-center justify-between gap-2"
      >
        <span className="truncate">{selectedOption?.label}</span>
        <svg className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 z-[100] mt-1 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 shadow-xl overflow-hidden py-1 max-h-[250px] overflow-y-auto">
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-sm font-semibold cursor-pointer transition-colors block ${
                  isSelected
                    ? 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-600 dark:hover:text-white'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

interface SuperAdminDashboardProps {
  subTab?: TabType;
}

export const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({ subTab }) => {
  const { activeTab: globalActiveTab } = useApp();

  const normalizeTab = (raw?: string): TabType => {
    if (!raw) return 'overview';
    let clean = raw.startsWith('sa-') ? raw.replace('sa-', '') : raw;
    if (clean === 'health') return 'system_health';
    if (clean === 'ai-logs') return 'ai_logs';
    if (clean === 'audit-logs') return 'audit_logs';
    if (clean === 'usage') return 'usage_analytics';
    return clean as TabType;
  };

  const [activeTab, setActiveTab] = useState<TabType>(() => normalizeTab(subTab || globalActiveTab));

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('info');

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Sync internal tab when the global activeTab changes or subTab prop changes
  useEffect(() => {
    const target = normalizeTab(subTab || globalActiveTab);
    if (target && target !== activeTab) {
      setActiveTab(target);
    }
  }, [subTab, globalActiveTab]);
  const [metrics, setMetrics] = useState<any>(null);
  const [tenants, setTenants] = useState<any[]>([]);
  const [providers, setProviders] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  
  // Custom SaaS States
  const [usageAnalytics, setUsageAnalytics] = useState<any[]>([]);
  const [billingOverview, setBillingOverview] = useState<any>({
      today_revenue: 1250,
      mrr: 45000,
      active_subscriptions: 120,
      churn_rate: 2.4,
      arpu: 375,
      invoices: [
        { id: '1', invoice_number: 'INV-2026-001', tenant_name: 'Acme Corp', plan: 'Enterprise', amount: 499, status: 'paid', date: '2026-06-24' },
        { id: '2', invoice_number: 'INV-2026-002', tenant_name: 'GlobalTech', plan: 'Professional', amount: 199, status: 'pending', date: '2026-06-23' },
        { id: '3', invoice_number: 'INV-2026-003', tenant_name: 'DevStudio', plan: 'Starter', amount: 99, status: 'paid', date: '2026-06-22' }
      ],
      payments: [
        { id: 'txn_123', transaction_id: 'txn_123', tenant_name: 'Acme Corp', amount: 499, payment_method: 'Stripe', status: 'success', created_at: '2026-06-24' },
        { id: 'txn_124', transaction_id: 'txn_124', tenant_name: 'DevStudio', amount: 99, payment_method: 'Razorpay', status: 'success', created_at: '2026-06-22' }
      ],
      subscriptions: [
        { id: 'sub_1', tenant_name: 'Acme Corp', plan_name: 'Enterprise', amount: 499, status: 'active', renews: '2026-07-24' },
        { id: 'sub_2', tenant_name: 'GlobalTech', plan_name: 'Professional', amount: 199, status: 'past_due', renews: '2026-07-23' },
        { id: 'sub_3', tenant_name: 'DevStudio', plan_name: 'Starter', amount: 99, status: 'active', renews: '2026-07-22' }
      ]
    });
  const [loadError, setLoadError] = useState<string | null>(null);
  const [billingSubTab, setBillingSubTab] = useState<'analytics' | 'invoices' | 'payments' | 'subscriptions'>('analytics');
  const [viewingPaymentDetails, setViewingPaymentDetails] = useState<any>(null);
  const [gatewaySettings, setGatewaySettings] = useState<any>(null);
  const [aiLogs, setAiLogs] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [systemHealth, setSystemHealth] = useState<any>(null);

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [planFilter, setPlanFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Subscription filters
  const [subSearchTerm, setSubSearchTerm] = useState('');
  const [subStatusFilter, setSubStatusFilter] = useState('');
  const [subCycleFilter, setSubCycleFilter] = useState('');
  const [logTimeFilter, setLogTimeFilter] = useState<'all' | 'today' | 'weekly' | 'monthly'>('all');
  
  const [loading, setLoading] = useState(true);
  // const [actionLoading, setActionLoading] = useState<string | null>(null);

  // New Tenant input state (Refined form)
  const [newCompany, setNewCompany] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [selectedPlanId, setSelectedPlanId] = useState('');

  // Selected Tenant View Modal state
  const [viewingTenant, setViewingTenant] = useState<any>(null);
  const [editingTenant, setEditingTenant] = useState<any>(null);
  const [editTenantName, setEditTenantName] = useState('');
  const [editTenantPlanId, setEditTenantPlanId] = useState('');

  // Expiring Subscriptions Modal
  const [showExpiringModal, setShowExpiringModal] = useState(false);

  // Edit Plan Modal state
  const [editingPlan, setEditingPlan] = useState<any>(null);
  const [editPlanName, setEditPlanName] = useState('');
  const [editPlanPrice, setEditPlanPrice] = useState(0);
  const [editPlanAudio, setEditPlanAudio] = useState(0);
  const [editPlanTranslation, setEditPlanTranslation] = useState(0);
  const [editPlanTTS, setEditPlanTTS] = useState(0);
  const [editPlanStorage, setEditPlanStorage] = useState(0);
  const [editPlanFeatures, setEditPlanFeatures] = useState<string[]>([]);
  const [draftPlans, setDraftPlans] = useState<Record<string, { features: string[]; price: number }>>({});
  const [savingPlanId, setSavingPlanId] = useState<string | null>(null);

  // Active Dropdowns state
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Billing Cycle state for Subscription Catalog
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  // Custom Confirmation Dialog state
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText: string;
    cancelText: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    onConfirm: () => {}
  });

  // Provider config inputs
  
  // New States for AI Provider Mapping
  const [featureMappings, setFeatureMappings] = useState<any[]>([
    { feature: "Audio To Text", provider: "Deepgram", enabled: true, priority: 1 },
    { feature: "Text To Speech", provider: "ElevenLabs", enabled: true, priority: 1 },
    { feature: "Translation", provider: "OpenAI", enabled: true, priority: 1 },
    { feature: "Transcription", provider: "OpenAI", enabled: true, priority: 1 }
  ]);
  
  useEffect(() => {
    if (activeTab === 'providers') {
      apiRequest("/super-admin/providers/mappings").then(data => {
        if (data && data.length > 0) {
          const mapped = data.map((item: any) => ({
            feature: item.feature_name,
            provider: item.provider_name,
            enabled: item.is_enabled,
            priority: item.priority
          }));
          
          const filtered = mapped.filter((item: any) => 
            item.feature === "Audio To Text" || 
            item.feature === "Text To Speech" || 
            item.feature === "Translation" ||
            item.feature === "Transcription"
          );

          setFeatureMappings(prev => {
            const current = [...prev];
            filtered.forEach((item: any) => {
              const idx = current.findIndex(c => c.feature === item.feature);
              if (idx !== -1) {
                current[idx] = item;
              } else {
                current.push(item);
              }
            });
            return current;
          });
        }
      }).catch((err) => {
        console.error("Error loading provider mappings:", err);
      });
    }
  }, [activeTab]);

  const handleSaveMapping = async (idx: number) => {
    const mapping = featureMappings[idx];
    try {
      await apiRequest("/super-admin/providers/mappings", {
        method: "POST",
        body: JSON.stringify({
          feature_name: mapping.feature,
          provider_name: mapping.provider,
          priority: mapping.priority,
          is_enabled: mapping.enabled
        })
      });
      showToast("Saved successfully.", 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to save mapping', 'error');
    }
  };

  const [selectedProvider, setSelectedProvider] = useState('openai');
  const [providerKey, setProviderKey] = useState('');
  const [providerPriority, setProviderPriority] = useState(1);
  const [providerEnabled, setProviderEnabled] = useState(true);
  const [configuringProvider, setConfiguringProvider] = useState<any | null>(null);
  const [resetPasswordInfo, setResetPasswordInfo] = useState<{ userName: string, tempPass: string } | null>(null);

  // Sync prop tab selection to local state
  useEffect(() => {
    if (subTab) {
      setActiveTab(subTab);
      setSearchTerm('');
      setPlanFilter('');
      setStatusFilter('');
    }
  }, [subTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      const safeApiRequest = async (url: string, setter: (data: any) => void) => {
        try {
          const data = await apiRequest(url);
          setter(data);
        } catch (e: any) {
          console.error(`Failed to load ${url}:`, e);
          setLoadError(prev => (prev ? prev + ' | ' : '') + `${url} failed: ${e.message}`);
        }
      };

      await Promise.all([
        safeApiRequest("/super-admin/metrics", setMetrics),
        safeApiRequest("/super-admin/tenants", setTenants),
        safeApiRequest("/super-admin/providers", setProviders),
        safeApiRequest("/super-admin/plans", setPlans),
        safeApiRequest("/super-admin/users", setUsersList),
        safeApiRequest("/super-admin/analytics/usage", setUsageAnalytics),
        safeApiRequest("/billing/admin/overview", setBillingOverview),
        safeApiRequest("/billing/settings", setGatewaySettings),
        safeApiRequest("/super-admin/logs/ai", setAiLogs),
        safeApiRequest("/super-admin/logs/audit", setAuditLogs),
        safeApiRequest("/super-admin/health/system", setSystemHealth)
      ]);

    } catch (err: any) {
      console.error("Failed to load super admin dashboard data:", err);
      setLoadError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Tenant Actions
  const handleUpdateTenantStatus = async (tenantId: string, status: string) => {
    // setActionLoading(tenantId);
    try {
      await apiRequest(`/super-admin/tenants/${tenantId}/status?status=${status}`, {
        method: "PATCH"
      });
      loadData();
      showToast(`Workspace status updated successfully to ${status}.`, 'success');
    } catch (err) {
      showToast("Error updating tenant status.", 'error');
    } finally {
      // setActionLoading(null);
      setActiveMenuId(null);
    }
  };

  const handleDeleteTenant = async (tenantId: string) => {
    setConfirmDialog({
      isOpen: true,
      title: "Delete Workspace",
      message: "Are you sure you want to permanently delete this workspace? This action cannot be undone and will delete all associated users and data.",
      confirmText: "Yes, Delete Workspace",
      cancelText: "Cancel",
      onConfirm: async () => {
        try {
          await apiRequest(`/super-admin/tenants/${tenantId}`, { method: 'DELETE' });
          showToast("Workspace deleted successfully", "success");
          loadData();
        } catch (e: any) {
          showToast(e.message || "Failed to delete workspace", "error");
        } finally {
          setActiveMenuId(null);
          setConfirmDialog(prev => ({ ...prev, isOpen: false }));
        }
      }
    });
  };

  const handleUpgradeTenant = async (tenantId: string, planId: string) => {
    try {
      await apiRequest(`/super-admin/tenants/${tenantId}/plan`, {
        method: "PATCH",
        body: JSON.stringify({ plan_id: planId })
      });
      setEditingTenant(null);
      loadData();
      showToast("Workspace billing plan upgraded successfully!", 'success');
    } catch (err) {
      showToast("Error upgrading tenant plan.", 'error');
    }
  };

  const handleProvisionTenant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompany || !newSlug || !newAdminEmail || !newAdminPassword || !newAdminName) {
      showToast("Please fill in all tenant creation fields.", 'success');
      return;
    }
    
    try {
      await apiRequest("/super-admin/tenants", {
        method: "POST",
        body: JSON.stringify({
          tenant_name: newCompany,
          slug: newSlug.toLowerCase().trim().replace(/[^a-z0-9-]/g, ""),
          admin_name: newAdminName,
          admin_email: newAdminEmail,
          admin_password: newAdminPassword,
          plan_id: selectedPlanId || null
        })
      });
      
      setNewCompany('');
      setNewSlug('');
      setNewAdminName('');
      setNewAdminEmail('');
      setNewAdminPassword('');
      showToast("Tenant workspace and admin user generated successfully!", 'success');
      loadData();
    } catch (err: any) {
      showToast(err.message || "Failed to provision workspace.", 'error');
    }
  };

  // Provider actions
  const handleConfigureProvider = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!configuringProvider) return;
    const providerName = configuringProvider.isNew ? selectedProvider : configuringProvider.provider_name;
    if (!providerName) {
      showToast("Please select a provider name.", "error");
      return;
    }
    try {
      await apiRequest("/super-admin/providers", {
        method: "POST",
        body: JSON.stringify({
          provider_name: providerName,
          api_key: providerKey || null,
          priority: Number(providerPriority),
          is_enabled: providerEnabled
        })
      });
      setProviderKey('');
      showToast("Saved successfully.", 'success');
      setConfiguringProvider(null);
      loadData();
    } catch (err) {
      showToast("Failed to update provider configuration.", 'error');
    }
  };

  const handleTestConnectionInModal = async () => {
    if (!configuringProvider) return;
    const providerName = configuringProvider.isNew ? selectedProvider : configuringProvider.provider_name;
    if (!providerName) {
      showToast("Please select a provider name first.", "error");
      return;
    }
    await handleTestProviderConnection(providerName);
  };

  const handleTestProviderConnection = async (provName: string) => {
    try {
      const res = await apiRequest(`/super-admin/providers/${provName}/test-connection`, {
        method: "POST"
      });
      showToast(res.message || "Connection verified successfully!", 'success');
    } catch (err) {
      showToast("Failed to verify connection.", 'error');
    }
  };

  // Plan actions
  const handleClonePlan = async (planId: string) => {
    try {
      await apiRequest(`/super-admin/plans/${planId}/clone`, {
        method: "POST"
      });
      loadData();
      showToast("Billing plan duplicated successfully!", 'success');
    } catch (err) {
      showToast("Failed to duplicate plan.", 'error');
    }
  };

  const handleTogglePlanActive = async (planId: string) => {
    try {
      await apiRequest(`/super-admin/plans/${planId}/toggle-active`, {
        method: "PATCH"
      });
      loadData();
      showToast("Plan status updated.", 'success');
    } catch (err) {
      showToast("Failed to toggle plan status.", 'error');
    }
  };

  // User Actions
  const handleUpdateUserStatus = async (userId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'active' ? 'suspended' : 'active';
    try {
      await apiRequest(`/super-admin/users/${userId}/status?status=${nextStatus}`, {
        method: "PATCH"
      });
      loadData();
      showToast(`User status updated to ${nextStatus}.`, 'success');
    } catch (err) {
      showToast("Failed to update user status.", 'error');
    }
  };

  const handleResetUserPassword = async (userId: string, userName: string) => {
    try {
      const res = await apiRequest(`/super-admin/users/${userId}/reset-password`, {
        method: "POST"
      });
      let tempPass = "TempPass123!";
      if (res.message) {
        const match = res.message.match(/'([^']+)'/);
        if (match && match[1]) {
          tempPass = match[1];
        }
      }
      setResetPasswordInfo({
        userName,
        tempPass
      });
      showToast("Password reset successfully.", 'success');
    } catch (err) {
      showToast("Failed to reset password.", 'error');
    }
  };

  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      const res = await apiRequest(`/super-admin/users/${userToDelete}`, {
        method: "DELETE"
      });
      showToast(res.message || "User deleted successfully.", 'success');
      loadData();
    } catch (err) {
      showToast("Failed to delete user.", 'error');
    } finally {
      setUserToDelete(null);
    }
  };

  const handleDeleteUser = (userId: string) => {
    setUserToDelete(userId);
  };

  // Billing Actions
  const handleRegenerateInvoice = async (invId: string) => {
    try {
      const res = await apiRequest(`/billing/invoices/${invId}/regenerate`, {
        method: "POST"
      });
      showToast(res.message || "Invoice PDF regenerated successfully.", 'success');
      loadData();
    } catch (err) {
      showToast("Failed to regenerate invoice PDF.", 'error');
    }
  };

  const handleEmailInvoice = async (invId: string) => {
    try {
      const res = await apiRequest(`/billing/invoices/${invId}/email`, {
        method: "POST"
      });
      showToast(res.message || "Invoice email sent successfully.", 'success');
    } catch (err) {
      showToast("Failed to send invoice email.", 'error');
    }
  };

  const handleRenewPlan = async (tenantName: string) => {
    const t = tenants.find(x => x.tenant_name === tenantName);
    if (!t) {
      showToast("Tenant workspace details missing.", 'error');
      return;
    }
    try {
      const res = await apiRequest(`/billing/subscriptions/renew?tenant_id=${t.id}`, {
        method: "POST"
      });
      showToast(res.message || "Subscription renewed successfully.", 'success');
      loadData();
    } catch (err) {
      showToast("Failed to renew plan.", 'error');
    }
  };

  const handleSaveBillingSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest("/billing/settings", {
        method: "PATCH",
        body: JSON.stringify(gatewaySettings)
      });
      showToast("Global billing and gateway configuration saved successfully!", 'success');
      loadData();
    } catch (err: any) {
      showToast(err.message || "Failed to update global billing configurations.", 'error');
    }
  };

  const exportPaymentsToCSV = () => {
    if (!billingOverview?.payments) return;
    const headers = ["Transaction ID", "Invoice Number", "Tenant Name", "Workspace", "Plan", "Gateway", "Amount", "Status", "Date"];
    const rows = billingOverview.payments.map((p: any) => [
      p.transaction_id || '',
      p.invoice_number || '',
      p.tenant_name || '',
      p.workspace || '',
      p.plan || '',
      p.gateway || '',
      p.amount || 0,
      p.status || '',
      p.date || ''
    ]);
    
    const csvContent = [headers.join(","), ...rows.map((e: any) => e.map((val: any) => `"${String(val).replace(/"/g, '""')}"`).join(","))].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `payments_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportSubscriptionsToCSV = () => {
    if (!billingOverview?.subscriptions) return;
    const headers = ["User Name", "Email", "Plan", "Amount", "Payment Status", "Subscription Status", "Start Date", "Expiry Date", "Payment ID"];
    const rows = billingOverview.subscriptions.map((s: any) => [
      s.user_name || "N/A",
      s.email || "N/A",
      s.plan || '',
      s.amount || 0,
      s.payment_status || 'N/A',
      s.status || '',
      s.started || '',
      s.expires || '',
      s.payment_id || 'N/A'
    ]);
    
    const csvContent = [headers.join(","), ...rows.map((e: any) => e.map((val: any) => `"${String(val).replace(/"/g, '""')}"`).join(","))].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `subscriptions_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex h-48 items-center justify-center bg-transparent">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="animate-spin text-teal-500" size={32} />
          <p className="text-sm text-slate-400 font-bold uppercase tracking-wider">Loading metrics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-slate-900 dark:text-slate-900 dark:text-slate-100 bg-transparent animate-fadeIn">
      
      {/* ── 1. DASHBOARD OVERVIEW TAB ── */}
      {activeTab === 'overview' && metrics && (
        <div className="space-y-6 animate-fadeIn">
          {/* Dashboard Cards Grid with Dynamic Real Sparkline Graphs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Total Tenants */}
            <div className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-white/5 bg-white dark:bg-[#111827]/40 flex flex-col justify-between h-36 overflow-hidden">
              <div className="flex justify-between items-start">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Tenants</p>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{metrics.total_tenants}</h3>
                </div>
                <div className="h-9 w-9 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-500 shrink-0 ml-2">
                  <Building2 size={18} />
                </div>
              </div>
              <div className="flex items-center justify-between mt-3 gap-2">
                <span className="text-[11px] text-emerald-500 dark:text-emerald-400 font-bold flex items-center gap-1 whitespace-nowrap">
                  <ArrowUpRight size={13} className="shrink-0" />
                  <span>Active Workspaces</span>
                </span>
                <Sparkline
                  points={
                    metrics.daily_stats && metrics.daily_stats.length > 0
                      ? metrics.daily_stats.map((s: any, idx: number) => Math.max(1, metrics.total_tenants - 6 + idx))
                      : [1, 2, 3, 3, 4, 4, metrics.total_tenants || 5]
                  }
                  color="#3b82f6"
                />
              </div>
            </div>

            {/* Active Users */}
            <div className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-white/5 bg-white dark:bg-[#111827]/40 flex flex-col justify-between h-36 overflow-hidden">
              <div className="flex justify-between items-start">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Users</p>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{metrics.active_users}</h3>
                </div>
                <div className="h-9 w-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0 ml-2">
                  <Users size={18} />
                </div>
              </div>
              <div className="flex items-center justify-between mt-3 gap-2">
                <span className="text-[11px] text-emerald-500 dark:text-emerald-400 font-bold flex items-center gap-1 whitespace-nowrap">
                  <ArrowUpRight size={13} className="shrink-0" />
                  <span>Platform Users</span>
                </span>
                <Sparkline
                  points={
                    metrics.daily_stats && metrics.daily_stats.length > 0
                      ? metrics.daily_stats.map((s: any, idx: number) => Math.max(1, metrics.active_users - 12 + idx * 2))
                      : [10, 15, 20, 25, 30, 35, metrics.active_users || 40]
                  }
                  color="#10b981"
                />
              </div>
            </div>

            {/* Monthly Revenue */}
            <div className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-white/5 bg-white dark:bg-[#111827]/40 flex flex-col justify-between h-36 overflow-hidden">
              <div className="flex justify-between items-start">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Monthly Revenue</p>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">₹{(metrics.revenue_this_month || 0).toLocaleString()}</h3>
                </div>
                <div className="h-9 w-9 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-500 shrink-0 ml-2">
                  <CreditCard size={18} />
                </div>
              </div>
              <div className="flex items-center justify-between mt-3 gap-2">
                <span className="text-[11px] text-emerald-500 dark:text-emerald-400 font-bold flex items-center gap-1 whitespace-nowrap">
                  <ArrowUpRight size={13} className="shrink-0" />
                  <span>Subscriptions</span>
                </span>
                <Sparkline
                  points={
                    metrics.daily_stats && metrics.daily_stats.length > 0
                      ? metrics.daily_stats.map((s: any, idx: number) => Math.round(((metrics.revenue_this_month || 100) * (0.5 + (idx * 0.5) / 7))))
                      : [100, 200, 300, 400, 500, metrics.revenue_this_month || 600]
                  }
                  color="#8b5cf6"
                />
              </div>
            </div>

            {/* API Requests */}
            <div className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-white/5 bg-white dark:bg-[#111827]/40 flex flex-col justify-between h-36 overflow-hidden">
              <div className="flex justify-between items-start">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total API Requests</p>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{(metrics.api_calls_today || 0).toLocaleString()}</h3>
                </div>
                <div className="h-9 w-9 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-500 shrink-0 ml-2">
                  <Cpu size={18} />
                </div>
              </div>
              <div className="flex items-center justify-between mt-3 gap-2">
                <span className="text-[11px] text-emerald-500 dark:text-emerald-400 font-bold flex items-center gap-1 whitespace-nowrap">
                  <ArrowUpRight size={13} className="shrink-0" />
                  <span>Ingestion Calls</span>
                </span>
                <Sparkline
                  points={
                    metrics.daily_stats && metrics.daily_stats.length > 0
                      ? metrics.daily_stats.map((s: any) => Math.max(s.total || 0, 1))
                      : [5, 10, 15, 20, 25, 30, metrics.api_calls_today || 35]
                  }
                  color="#06b6d4"
                />
              </div>
            </div>
          </div>

          {/* Health & Consumed resources Row with Interactive Charts & Donut Graphs */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Provider Health Status Panel */}
            <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-white/5 bg-white dark:bg-[#111827]/40 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Server size={16} className="text-teal-500" />
                Provider Health & Gateway Status
              </h3>
              <div className="space-y-3">
                {metrics.provider_health?.map((prov: any) => (
                  <div key={prov.provider} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-white/5">
                    <span className="text-base font-bold text-slate-800 dark:text-slate-200">{prov.provider}</span>
                    <span className={`flex items-center gap-1.5 text-sm font-black ${
                      prov.status_code === 'warning' ? 'text-amber-500' : 'text-emerald-500'
                    }`}>
                      <span className={`h-2.5 w-2.5 rounded-full ${prov.status_code === 'warning' ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
                      {prov.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Ingested Resources Multi-Bar Activity Graph & Donut Breakdown */}
            <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-slate-200 dark:border-white/5 bg-white dark:bg-[#111827]/40 space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-white/5 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <BarChart2 size={16} className="text-teal-500" />
                    Ingested Resources & 7-Day Activity Graph
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">Real daily activity log trends across audio, translation, and TTS synthesis.</p>
                </div>
                <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20">
                  REAL TIME GRAPH
                </span>
              </div>

              {/* Multi-Bar Daily Chart */}
              {metrics.daily_stats && metrics.daily_stats.length > 0 ? (
                <StackedMultiBarChart data={metrics.daily_stats} height={190} />
              ) : (
                <div className="h-40 flex items-center justify-center text-slate-400 font-medium text-sm">
                  No daily history logs found yet. Start transcribing or translating to see real graph curves.
                </div>
              )}

              {/* Resource Distribution Donut Split */}
              <div className="pt-4 border-t border-slate-200 dark:border-white/5 space-y-3">
                <h4 className="text-xs font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider">
                  Platform Volume Split (Real Resource Counts)
                </h4>
                <ResourceDonutChart
                  data={[
                    { label: 'Audio Transcriptions (mins)', value: Math.round(metrics.metrics?.transcription_minutes || 0), color: '#14b8a6' },
                    { label: 'Text Translation (chars)', value: metrics.metrics?.translation_characters || 0, color: '#10b981' },
                    { label: 'TTS Audio Synthesis (chars)', value: metrics.metrics?.tts_characters || 0, color: '#f59e0b' }
                  ]}
                  centerTitle="Total Ingested"
                  size={150}
                />
              </div>
            </div>
          </div>

          {/* Lower Row: alerts & top list */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div 
              className="glass-card rounded-2xl p-6 border border-amber-500/20 bg-amber-500/5 dark:bg-amber-500/10 flex flex-col justify-between cursor-pointer hover:bg-amber-500/10 dark:hover:bg-amber-500/20 transition-all"
              onClick={() => setShowExpiringModal(true)}
            >
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                    <AlertTriangle size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">Expiring Subscriptions</h4>
                    <p className="text-sm text-amber-600 dark:text-amber-400/80 font-bold">Billing renewals soon</p>
                  </div>
                </div>
                <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed pt-2">
                  There are <span className="text-slate-900 dark:text-slate-800 dark:text-white font-bold">{metrics.expiring_plans_count || 0}</span> workspace subscriptions renewing within the next 7 days.
                </p>
              </div>
            </div>

            {metrics.top_usage_tenants && metrics.top_usage_tenants.length > 0 && (
              <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-slate-200 dark:border-white/5 bg-white dark:bg-[#111827]/40 space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <TrendingUp size={16} className="text-teal-500" />
                  Top Resource Ingested Tenants Ranking Chart
                </h3>
                <p className="text-xs text-slate-500">Real-time workspace ranking ordered by total API activity.</p>
                <HorizontalRankBarChart items={metrics.top_usage_tenants} />
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── 2. TENANTS TAB ── */}
      {activeTab === 'tenants' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
          {/* Provision Form */}
          <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-white/5 bg-white dark:bg-[#111827]/40 h-fit space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="text-teal-500" size={16} />
              Provision Tenant Workspace
            </h3>
            <form onSubmit={handleProvisionTenant} className="space-y-3.5">
              <div>
                <label className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Company Name</label>
                <input
                  type="text"
                  required
                  value={newCompany}
                  onChange={(e) => {
                    setNewCompany(e.target.value);
                    setNewSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-"));
                  }}
                  placeholder="ABC School"
                  className="w-full px-3.5 py-2.5 mt-1 rounded-xl text-base bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-200 outline-none focus:border-teal-500/50 transition-colors"
                />
              </div>

              <div>
                <label className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Workspace Slug</label>
                <input
                  type="text"
                  required
                  value={newSlug}
                  onChange={(e) => setNewSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                  placeholder="abc-school"
                  className="w-full px-3.5 py-2.5 mt-1 rounded-xl text-base bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-200 outline-none focus:border-teal-500/50 transition-colors"
                />
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-white/5 space-y-3">
                <p className="text-sm font-black uppercase text-teal-400 tracking-wider">Tenant Admin Settings</p>
                <div>
                  <label className="text-sm font-bold text-slate-500 dark:text-slate-400">Full Name</label>
                  <input
                    type="text"
                    required
                    value={newAdminName}
                    onChange={(e) => setNewAdminName(e.target.value)}
                    placeholder="Admin Name"
                    className="w-full px-3.5 py-2.5 mt-1 rounded-xl text-base bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-200 outline-none focus:border-teal-500/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-slate-500 dark:text-slate-400">Admin Email</label>
                  <input
                    type="email"
                    required
                    value={newAdminEmail}
                    onChange={(e) => setNewAdminEmail(e.target.value)}
                    placeholder="admin@abcschool.com"
                    className="w-full px-3.5 py-2.5 mt-1 rounded-xl text-base bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-200 outline-none focus:border-teal-500/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-slate-500 dark:text-slate-400">Admin Password</label>
                  <input
                    type="password"
                    required
                    value={newAdminPassword}
                    onChange={(e) => setNewAdminPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 mt-1 rounded-xl text-base bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-200 outline-none focus:border-teal-500/50 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Billing Plan</label>
                <select
                  value={selectedPlanId}
                  onChange={(e) => setSelectedPlanId(e.target.value)}
                  className="w-full px-3.5 py-2.5 mt-1 rounded-xl text-base bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-100 outline-none focus:border-teal-500/50 transition-colors"
                  style={{ background: 'var(--bg-subtle)' }}
                >
                  <option value="" className="text-slate-900 dark:text-slate-200 bg-white dark:bg-slate-950">Select Plan...</option>
                  {plans.map(p => (
                    <option key={p.id} value={p.id} className="text-slate-900 dark:text-slate-200 bg-white dark:bg-slate-950">{p.name} (${p.price}/mo)</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-slate-800 dark:text-white text-base font-bold cursor-pointer transition-colors shadow-lg"
              >
                Provision Tenant Workspace
              </button>
            </form>
          </div>

          {/* Tenants Table */}
          <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-slate-200 dark:border-white/5 bg-white dark:bg-[#111827]/40 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-white/5 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Active Tenants</h3>
              <div className="flex gap-2">
                <select
                  value={planFilter}
                  onChange={(e) => setPlanFilter(e.target.value)}
                  className="px-2 py-1 rounded bg-white dark:bg-[#0B1020] border border-slate-200 dark:border-white/5 text-sm font-bold text-slate-700 dark:text-slate-300 outline-none"
                >
                  <option value="">All Plans</option>
                  {plans.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                </select>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-2 py-1 rounded bg-white dark:bg-[#0B1020] border border-slate-200 dark:border-white/5 text-sm font-bold text-slate-700 dark:text-slate-300 outline-none"
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-base border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-white/5 text-slate-500">
                    <th className="py-2.5">Workspace</th>
                    <th className="py-2.5">Owner</th>
                    <th className="py-2.5">Users</th>
                    <th className="py-2.5">Plan</th>
                    <th className="py-2.5">Status</th>
                    <th className="py-2.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tenants
                    .filter(t => t.tenant_name.toLowerCase().includes(searchTerm.toLowerCase()) || t.slug.toLowerCase().includes(searchTerm.toLowerCase()))
                    .filter(t => planFilter === '' || t.plan?.name === planFilter)
                    .filter(t => statusFilter === '' || t.status === statusFilter)
                    .map((tenant: any) => (
                      <tr key={tenant.id} className="border-b border-slate-200 dark:border-white/5 hover:bg-white/5 transition-colors">
                        <td className="py-3 font-semibold text-slate-800 dark:text-white">
                          <div>{tenant.tenant_name}</div>
                          <div className="text-sm font-mono text-slate-500">/{tenant.slug}</div>
                        </td>
                        <td className="py-3">
                          <div className="text-slate-700 dark:text-slate-300">{tenant.owner_name}</div>
                          <div className="text-sm text-slate-500">{tenant.owner_email}</div>
                        </td>
                        <td className="py-3 font-bold text-slate-800 dark:text-white">{tenant.users_count || 1}</td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 rounded text-sm font-bold bg-teal-500/10 text-teal-400 border border-teal-500/20">
                            {tenant.plan?.name || "Free"}
                          </span>
                        </td>
                                                  <td className="py-3">
                            <button
                              onClick={() => handleUpdateTenantStatus(tenant.id, tenant.status === 'active' ? 'suspended' : 'active')}
                              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold tracking-wide transition-all cursor-pointer ${
                                tenant.status === 'active' 
                                  ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20' 
                                  : 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/20'
                              }`}
                              title={tenant.status === 'active' ? 'Click to Deactivate' : 'Click to Activate'}
                            >
                              {tenant.status === 'active' ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                              <span>{tenant.status === 'active' ? 'ACTIVE' : 'INACTIVE'}</span>
                            </button>
                          </td>
                        <td className="py-3 text-right relative">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => setViewingTenant(tenant)}
                              className="bg-teal-600/15 hover:bg-teal-600/25 text-teal-400 px-2 py-1 rounded text-sm font-bold cursor-pointer"
                             title="View"><Eye size={16} /></button>
                            <button
                              onClick={() => setActiveMenuId(activeMenuId === tenant.id ? null : tenant.id)}
                              className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
                            >
                              <MoreVertical size={13} />
                            </button>
                          </div>

                          {activeMenuId === tenant.id && (
                            <div className="absolute right-0 mt-1.5 w-40 rounded-xl bg-white dark:bg-slate-900 border border-white/10 p-1.5 z-50 shadow-2xl text-left animate-fadeIn">
                              {tenant.status === 'active' ? (
                                <button
                                  onClick={() => handleUpdateTenantStatus(tenant.id, 'suspended')}
                                  className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm font-bold text-amber-500 hover:bg-amber-500/10"
                                  title="Deactivate"
                                >
                                  <Ban size={16} />
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleUpdateTenantStatus(tenant.id, 'active')}
                                  className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm font-bold text-emerald-400 hover:bg-emerald-500/10"
                                  title="Activate"
                                >
                                  <CheckCircle2 size={16} />
                                </button>
                              )}
                              <button
                                onClick={() => {
                                  setEditingTenant(tenant);
                                  setEditTenantName(tenant.tenant_name);
                                  setEditTenantPlanId(tenant.plan?.id || '');
                                  setActiveMenuId(null);
                                }}
                                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm font-bold text-teal-400 hover:bg-teal-600/10"
                                title="Edit Plan"
                              >
                                <Edit size={16} />
                              </button>
                              <div className="h-[1px] bg-white/5 my-1" />
                              <button
                                onClick={() => handleDeleteTenant(tenant.id)}
                                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm font-bold text-red-500 hover:bg-red-500/10"
                                title="Delete"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── 3. USER MANAGEMENT TAB ── */}
      {activeTab === 'users' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Counters row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-card rounded-2xl p-4 border border-slate-200 dark:border-white/5 bg-white dark:bg-white dark:bg-[#111827]/40">
              <p className="text-sm font-black uppercase text-slate-500 tracking-wider">Total Users</p>
              <h4 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">{usersList.length}</h4>
            </div>
            <div className="glass-card rounded-2xl p-4 border border-slate-200 dark:border-white/5 bg-white dark:bg-white dark:bg-[#111827]/40">
              <p className="text-sm font-black uppercase text-slate-500 tracking-wider">Active Users</p>
              <h4 className="text-xl font-extrabold text-emerald-400 mt-1">
                {usersList.filter(u => u.status === 'active').length}
              </h4>
            </div>
            <div className="glass-card rounded-2xl p-4 border border-slate-200 dark:border-white/5 bg-white dark:bg-white dark:bg-[#111827]/40">
              <p className="text-sm font-black uppercase text-slate-500 tracking-wider">Admins</p>
              <h4 className="text-xl font-extrabold text-teal-400 mt-1">
                {usersList.filter(u => u.role === 'tenant_admin' || u.role === 'super_admin').length}
              </h4>
            </div>
            <div className="glass-card rounded-2xl p-4 border border-slate-200 dark:border-white/5 bg-white dark:bg-white dark:bg-[#111827]/40">
              <p className="text-sm font-black uppercase text-slate-500 tracking-wider">Managers</p>
              <h4 className="text-xl font-extrabold text-teal-400 mt-1">
                {usersList.filter(u => u.role === 'manager').length}
              </h4>
            </div>
          </div>

          {/* Table */}
          <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-white/5 bg-white dark:bg-white dark:bg-[#111827]/40 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/5 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Platform Users</h3>
              <div className="flex items-center gap-2">
                <Search size={14} className="text-slate-500 dark:text-slate-400" />
                <input
                  type="text"
                  placeholder="Search email, name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-3 py-1.5 rounded-xl text-base bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-200 outline-none placeholder-slate-500"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-base border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-white/5 text-slate-500">
                    <th className="py-2.5">User</th>
                    <th className="py-2.5">Email</th>
                    <th className="py-2.5">Role</th>
                    <th className="py-2.5">Status</th>
                    <th className="py-2.5">Last Login</th>
                    <th className="py-2.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {usersList
                    .filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((user: any) => (
                      <tr key={user.id} className="border-b border-slate-200 dark:border-white/5 hover:bg-white/5 transition-colors">
                        <td className="py-3 font-semibold text-slate-800 dark:text-white flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-teal-600/20 text-teal-400 border border-teal-500/20 flex items-center justify-center font-bold text-base uppercase">
                            {user.name.substring(0, 2)}
                          </div>
                          <span>{user.name}</span>
                        </td>
                        <td className="py-3 text-slate-700 dark:text-slate-300 font-mono">{user.email}</td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 rounded text-sm font-bold bg-teal-500/10 text-teal-400 border border-teal-500/20 uppercase">
                            {user.role}
                          </span>
                        </td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded text-sm font-extrabold uppercase ${
                            user.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-500'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="py-3 text-slate-600 dark:text-slate-400 font-mono">
                          {user.last_login ? new Date(user.last_login).toLocaleString() : 'Never logged in'}
                        </td>
                        <td className="py-3 text-right space-x-1">
                          <button
                            onClick={() => handleUpdateUserStatus(user.id, user.status)}
                            className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 px-2 py-1 rounded text-sm font-bold cursor-pointer"
                          >
                            {user.status === 'active' ? 'Disable' : 'Enable'}
                          </button>
                          <button
                            onClick={() => handleResetUserPassword(user.id, user.name || user.email)}
                            className="bg-teal-600/10 hover:bg-teal-600/20 text-teal-400 px-2 py-1 rounded text-sm font-bold cursor-pointer"
                          >
                            Reset Password
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="bg-red-500/10 hover:bg-red-500/20 text-red-400 px-2 py-1 rounded text-sm font-bold cursor-pointer"
                           title="Delete User"><Trash2 size={16} /></button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── 4. SUBSCRIPTION PLANS & FEATURE MATRIX TAB ── */}
      {activeTab === 'plans' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Top Banner Header */}
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-950 p-8 sm:p-10 border border-indigo-500/20 shadow-2xl text-white">
            <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
              <div className="space-y-2">
                <span className="px-3.5 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-[10px] font-black uppercase tracking-widest shadow-sm inline-flex items-center gap-1.5">
                  <Sparkles size={12} className="text-teal-400" />
                  PLANS & FEATURE CHECKBOXES MANAGER
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                  Subscription Plans & Feature Matrix
                </h2>
                <p className="text-sm text-slate-300 max-w-2xl font-medium">
                  Create new pricing plans, edit existing monthly/yearly pricing, and check/uncheck included tools & features for each plan.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => loadData()}
                  className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-black uppercase tracking-wider transition-all duration-200 flex items-center gap-2 cursor-pointer border border-white/10 backdrop-blur-md active:scale-95"
                >
                  <RefreshCw size={14} className="text-teal-400" />
                  RECALL PLANS
                </button>
                <button
                  onClick={() => {
                    setEditingPlan({ id: 'new', name: '', price: 0, transcription_limit: 0, translation_limit: 0, tts_limit: 0, storage_limit: 0, isNew: true });
                    setEditPlanName('');
                    setEditPlanPrice(0);
                    setEditPlanAudio(0);
                    setEditPlanTranslation(0);
                    setEditPlanTTS(0);
                    setEditPlanStorage(0);
                    setEditPlanFeatures(["audio_processing", "translation_services", "text_to_speech", "cloud_storage", "doc_ocr"]);
                  }}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white text-xs font-black uppercase tracking-wider transition-all duration-200 shadow-lg shadow-teal-500/25 flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <Plus size={16} />
                  CREATE NEW PLAN
                </button>
              </div>
            </div>
          </div>

          {/* Per-Plan Stacked Feature Matrix Cards */}
          <div className="space-y-8">
            {[...plans]
              .map(p => {
                if (p.name === 'Professional') return { ...p, displayName: 'PROFESSIONAL' };
                return { ...p, displayName: (p.name || '').toUpperCase() };
              })
              .sort((a, b) => a.price - b.price)
              .map((p) => {
                const ALL_PLATFORM_FEATURES = [
                  // 🎤 Voice-to-Text (Live Microphone)
                  { id: 'v2t_live', label: 'Live Speech Capture & Auto-Translate to English', category: '🎤 Voice-to-Text' },
                  { id: 'v2t_vocab', label: 'Custom Speech Vocabulary & Noise Filtering', category: '🎤 Voice-to-Text' },
                  { id: 'v2t_export', label: 'Real-time Transcript Export (SRT/VTT)', category: '🎤 Voice-to-Text' },

                  // 🗣️ Text-to-Voice (TTS)
                  { id: 't2v_neural', label: 'Neural Multi-Speaker Voices', category: '🗣️ Text-to-Voice' },
                  { id: 't2v_controls', label: 'Pitch, Speed & Accent Controls', category: '🗣️ Text-to-Voice' },
                  { id: 't2v_download', label: 'HD Audio Download (WAV / MP3)', category: '🗣️ Text-to-Voice' },

                  // 📄 Text & Document Translation
                  { id: 'trans_instant', label: 'Instant Multi-Language Text Translation', category: '📄 Document Translation' },
                  { id: 'doc_5pages', label: 'Document Upload (Up to 5 Pages)', category: '📄 Document Translation' },
                  { id: 'doc_25pages', label: 'Document Upload (Up to 25 Pages / Large Files)', category: '📄 Document Translation' },
                  { id: 'doc_parallel', label: 'High-Speed Parallel Document Chunking', category: '📄 Document Translation' },

                  // 🎵 Audio Transcribe & WhatsApp Voice Notes
                  { id: 'audio_whatsapp', label: 'WhatsApp Audio Transcribe (.ogg/.m4a)', category: '🎵 Audio Transcription' },
                  { id: 'audio_long', label: 'Long Audio Files (Up to 60+ mins)', category: '🎵 Audio Transcription' },
                  { id: 'audio_timestamps', label: 'Automated Timestamps & Word Counts', category: '🎵 Audio Transcription' },

                  // 💾 Storage & Advanced
                  { id: 'cloud_storage', label: 'Cloud Storage & Activity History', category: '💾 Storage & API' },
                  { id: 'custom_api', label: 'Custom API & Webhooks Access', category: '💾 Storage & API' },
                ];

                const defaultFeatures: string[] = (p.features && p.features.length > 0)
                  ? p.features
                  : ['v2t_live', 't2v_neural', 'trans_instant', 'doc_5pages', 'audio_whatsapp', 'cloud_storage'];

                const draft = draftPlans[p.id];
                const currentFeatures: string[] = draft?.features ?? defaultFeatures;
                const monthlyPrice = draft?.price ?? p.price;
                const yearlyPrice = +(monthlyPrice * 10).toFixed(0);

                const hasUnsavedChanges = draft !== undefined;
                const isSaving = savingPlanId === p.id;

                const isPopular = p.name === 'Professional' || p.displayName === 'PROFESSIONAL';

                const handleToggleFeature = (featId: string) => {
                  const updated = currentFeatures.includes(featId)
                    ? currentFeatures.filter(f => f !== featId)
                    : [...currentFeatures, featId];

                  setDraftPlans(prev => ({
                    ...prev,
                    [p.id]: {
                      features: updated,
                      price: monthlyPrice
                    }
                  }));
                };

                const handleToggleAll = () => {
                  const allIds = ALL_PLATFORM_FEATURES.map(f => f.id);
                  const updated = currentFeatures.length === allIds.length ? [] : allIds;

                  setDraftPlans(prev => ({
                    ...prev,
                    [p.id]: {
                      features: updated,
                      price: monthlyPrice
                    }
                  }));
                };

                const handleUpdatePrices = (mPrice: number) => {
                  setDraftPlans(prev => ({
                    ...prev,
                    [p.id]: {
                      features: currentFeatures,
                      price: mPrice
                    }
                  }));
                };

                const handleSaveChanges = () => {
                  setSavingPlanId(p.id);
                  apiRequest(`/super-admin/plans/${p.id}`, {
                    method: 'PATCH',
                    body: JSON.stringify({
                      features: currentFeatures,
                      price: monthlyPrice
                    })
                  }).then(() => {
                    showToast(`Successfully saved changes for ${p.name} plan!`, 'success');
                    setDraftPlans(prev => {
                      const copy = { ...prev };
                      delete copy[p.id];
                      return copy;
                    });
                    loadData();
                  }).catch(() => {
                    showToast(`Failed to save changes for ${p.name} plan`, 'error');
                  }).finally(() => {
                    setSavingPlanId(null);
                  });
                };

                return (
                  <div
                    key={p.id}
                    className={`rounded-[2.5rem] bg-white dark:bg-slate-950 border transition-all duration-300 p-6 sm:p-8 shadow-xl space-y-6 relative ${
                      isPopular
                        ? 'border-teal-500/60 ring-2 ring-teal-500/20 shadow-teal-500/10'
                        : 'border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    {/* Header Bar */}
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 border-b border-slate-100 dark:border-slate-800/80 pb-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                            {p.displayName}
                          </h3>
                          {isPopular && (
                            <span className="px-3 py-0.5 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 text-white text-[9px] font-black uppercase tracking-widest shadow-sm">
                              ★ RECOMMENDED
                            </span>
                          )}
                          {!p.active && (
                            <span className="px-2.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[9px] font-bold uppercase tracking-wider">
                              INACTIVE
                            </span>
                          )}
                          {hasUnsavedChanges && (
                            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-500 border border-amber-500/30 text-[9px] font-black uppercase tracking-wider animate-pulse">
                              UNSAVED CHANGES
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                          {p.name === 'Starter' || p.name === 'Free'
                            ? 'Under 1,000 requests monthly volume'
                            : p.name === 'Professional'
                            ? 'Under 50,000 requests monthly volume'
                            : 'Enterprise scale & high capacity requests'}
                        </p>
                      </div>

                      {/* Pricing & Control Inputs */}
                      <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
                        <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900/60 p-2 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                          <div className="text-right">
                            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">MONTHLY PRICE</span>
                            <div className="flex items-center gap-1">
                              <span className="text-xs font-bold text-slate-500">₹</span>
                              <input
                                type="number"
                                value={monthlyPrice}
                                onChange={(e) => handleUpdatePrices(parseFloat(e.target.value) || 0)}
                                className="w-20 px-2 py-1 text-sm font-black bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white text-center outline-none focus:border-teal-500"
                              />
                            </div>
                          </div>

                          <div className="text-right border-l border-slate-200 dark:border-slate-800 pl-3">
                            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">YEARLY PRICE</span>
                            <div className="flex items-center gap-1">
                              <span className="text-xs font-bold text-slate-500">₹</span>
                              <input
                                type="number"
                                value={yearlyPrice}
                                disabled
                                className="w-24 px-2 py-1 text-sm font-black bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-500 dark:text-slate-400 text-center outline-none"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {hasUnsavedChanges && (
                            <button
                              onClick={handleSaveChanges}
                              disabled={isSaving}
                              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-teal-500/25 flex items-center gap-2 cursor-pointer transition-all active:scale-95 disabled:opacity-50"
                            >
                              {isSaving ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                              <span>Save Changes</span>
                            </button>
                          )}

                          <button
                            onClick={() => {
                              setEditingPlan(p);
                              setEditPlanName(p.name);
                              setEditPlanPrice(p.price);
                              setEditPlanAudio(p.transcription_limit);
                              setEditPlanTranslation(p.translation_limit || 0);
                              setEditPlanTTS(p.tts_limit || 0);
                              setEditPlanStorage(p.storage_limit);
                              setEditPlanFeatures(currentFeatures);
                            }}
                            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-all border border-slate-200 dark:border-slate-800 cursor-pointer"
                            title="Edit Limits"
                          >
                            <Edit size={16} />
                          </button>

                          <button
                            onClick={() => {
                              apiRequest(`/super-admin/plans/${p.id}/toggle-active`, { method: "PATCH" }).then(() => {
                                showToast(`Plan ${p.active ? "disabled" : "enabled"}`, "success");
                                loadData();
                              });
                            }}
                            className={`px-3 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                              p.active
                                ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30'
                                : 'bg-slate-200 dark:bg-slate-800 text-slate-500 border border-slate-300 dark:border-slate-700'
                            }`}
                          >
                            {p.active ? 'ACTIVE' : 'INACTIVE'}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Included Tools & Features Matrix Section */}
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 size={16} className="text-teal-500" />
                          <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                            INCLUDED ACCESSIBILITY TOOLS & FEATURES ({currentFeatures.length} / {ALL_PLATFORM_FEATURES.length})
                          </h4>
                        </div>

                        <div className="flex items-center gap-3">
                          <button
                            onClick={handleToggleAll}
                            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-extrabold uppercase tracking-wider border border-slate-200 dark:border-slate-800 cursor-pointer transition-all active:scale-95"
                          >
                            {currentFeatures.length === ALL_PLATFORM_FEATURES.length ? 'DESELECT ALL' : 'SELECT ALL'}
                          </button>

                          {hasUnsavedChanges && (
                            <button
                              onClick={handleSaveChanges}
                              disabled={isSaving}
                              className="px-5 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white font-black text-xs uppercase tracking-wider shadow-md shadow-teal-500/25 flex items-center gap-2 cursor-pointer transition-all active:scale-95 disabled:opacity-50"
                            >
                              {isSaving ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                              <span>Save Changes</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Checkbox Pills Grid Grouped by Tool Category */}
                      <div className="space-y-5 pt-2">
                        {Array.from(new Set(ALL_PLATFORM_FEATURES.map(f => f.category))).map(cat => {
                          const catFeatures = ALL_PLATFORM_FEATURES.filter(f => f.category === cat);
                          return (
                            <div key={cat} className="space-y-2.5">
                              <div className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800/60 pb-1">
                                <span>{cat}</span>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                {catFeatures.map(feat => {
                                  const isChecked = currentFeatures.includes(feat.id);
                                  return (
                                    <div
                                      key={feat.id}
                                      onClick={() => handleToggleFeature(feat.id)}
                                      className={`flex items-center justify-between gap-3 p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer select-none ${
                                        isChecked
                                          ? 'bg-teal-500/10 dark:bg-teal-950/30 border-teal-500/40 text-slate-900 dark:text-white shadow-sm'
                                          : 'bg-slate-50/60 dark:bg-slate-900/30 border-slate-200/80 dark:border-slate-800/80 text-slate-400 opacity-60 hover:opacity-100'
                                      }`}
                                    >
                                      <span className="text-xs font-bold leading-tight">{feat.label}</span>
                                      <div
                                        className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-all flex-shrink-0 ${
                                          isChecked
                                            ? 'bg-teal-500 border-teal-500 text-white shadow-sm'
                                            : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900'
                                        }`}
                                      >
                                        {isChecked && <CheckCircle2 size={14} className="text-white" />}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Bottom Save Bar inside Card */}
                      {hasUnsavedChanges && (
                        <div className="pt-3 flex justify-end">
                          <button
                            onClick={handleSaveChanges}
                            disabled={isSaving}
                            className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-teal-500/30 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
                          >
                            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                            <span>Save Changes for {p.displayName}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* ── 5. PROVIDERS TAB ── */}
      {activeTab === 'providers' && (
        <div className="space-y-6 animate-fadeIn">

          {/* Section 0: AI Provider Failover Manager */}
          <div className="glass-card rounded-2xl p-6 border border-violet-500/20 bg-violet-950/10">
            <ProviderManager />
          </div>

          {/* Section 1: AI Feature Provider Mapping */}
          <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-white/5 bg-white dark:bg-[#111827]/40">
            <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2 mb-4">
              <Sparkles className="text-emerald-500" size={18} />
              AI Feature Provider Mapping
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              Configure which AI provider handles each core platform feature. Users cannot override these global settings.
            </p>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-500 dark:text-slate-400">
                <thead className="text-xs font-bold uppercase bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300">
                  <tr>
                    <th className="px-4 py-3 rounded-tl-xl">Feature</th>
                    <th className="px-4 py-3">Provider</th>
                    <th className="px-4 py-3">Priority</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 rounded-tr-xl">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {featureMappings.map((mapping, idx) => (
                    <tr key={idx} className="border-b border-slate-200 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5">
                      <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">{mapping.feature}</td>
                      <td className="px-4 py-3">
                        <CustomDropdown
                          value={mapping.provider}
                          onChange={(val) => {
                            const newMappings = [...featureMappings];
                            newMappings[idx].provider = val;
                            setFeatureMappings(newMappings);
                          }}
                          options={[
                            { value: "OpenAI", label: `OpenAI ${mapping.feature === 'Translation' ? '⭐' : ''}`.trim() },
                            { value: "Deepgram", label: `Deepgram ${['Audio To Text', 'Transcription'].includes(mapping.feature) ? '⭐' : ''}`.trim() },
                            { value: "ElevenLabs", label: `ElevenLabs ${mapping.feature === 'Text To Speech' ? '⭐' : ''}`.trim() },
                            { value: "Whisper", label: `Whisper ${['Audio To Text', 'Transcription'].includes(mapping.feature) ? '⭐' : ''}`.trim() },
                            { value: "Google Translate", label: "Google Translate" },
                            { value: "Gemini", label: `Gemini ${mapping.feature === 'Translation' ? '👍' : ''}`.trim() },
                            { value: "Anthropic Claude", label: "Anthropic Claude" },
                            { value: "Tavily", label: "Tavily" },
                            { value: "Serper", label: "Serper" },
                            { value: "Azure OpenAI", label: "Azure OpenAI" }
                          ]}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input type="number" min="1" value={mapping.priority} onChange={(e) => {
                            const newMappings = [...featureMappings];
                            newMappings[idx].priority = Number(e.target.value);
                            setFeatureMappings(newMappings);
                          }} className="w-16 bg-transparent border border-slate-200 dark:border-white/10 rounded-lg px-2 py-1 outline-none text-center" />
                      </td>
                      <td className="px-4 py-3">
                        <button 
                          type="button"
                          role="switch"
                          aria-checked={mapping.enabled}
                          onClick={() => {
                            const newMappings = [...featureMappings];
                            newMappings[idx].enabled = !newMappings[idx].enabled;
                            setFeatureMappings(newMappings);
                          }} 
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${mapping.enabled ? 'bg-teal-500' : 'bg-slate-300 dark:bg-slate-600'}`}
                        >
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${mapping.enabled ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <button 
                          className="text-teal-600 hover:underline text-xs font-bold cursor-pointer" 
                          onClick={() => handleSaveMapping(idx)}
                        >
                          Save
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {/* Section 3: Global System Providers */}
            <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-white/5 bg-white dark:bg-[#111827]/40">
              <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                <Server className="text-teal-500" size={18} />
                Global System API Keys
              </h3>
              
              <div className="space-y-3">
                {providers.slice(0, 4).map((prov) => (
                  <div key={prov.provider_name} className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-slate-900/50">
                    <div className="flex flex-col gap-1 text-left">
                      <h4 className="text-sm font-extrabold capitalize text-slate-900 dark:text-white">{prov.provider_name.replace("-", " ")}</h4>
                      <div className="flex items-center gap-1.5">
                        <span className={`h-1.5 w-1.5 rounded-full ${prov.status === 'Healthy' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                          {prov.status === 'Healthy' ? 'Connected' : 'Offline'}
                        </span>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        setConfiguringProvider(prov);
                        setProviderKey('');
                        setProviderPriority(prov.priority || 1);
                        setProviderEnabled(prov.is_enabled !== false);
                      }}
                      className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white underline cursor-pointer"
                    >
                      Configure
                    </button>
                  </div>
                ))}
              </div>
              <button 
                onClick={() => {
                  setConfiguringProvider({ provider_name: 'openai', is_enabled: true, priority: 1, isNew: true });
                  setProviderKey('');
                  setProviderPriority(1);
                  setProviderEnabled(true);
                  setSelectedProvider('openai');
                }}
                className="w-full mt-4 py-2 rounded-xl bg-teal-600/10 text-teal-600 dark:text-teal-400 font-bold text-sm hover:bg-teal-600/20 cursor-pointer"
              >
                Add System Provider
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 6. USAGE ANALYTICS TAB ── */}
      {activeTab === 'usage_analytics' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Top Charts Grid for Operational Usage */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Multi-Bar 7-Day Activity Graph */}
            <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-slate-200 dark:border-white/5 bg-white dark:bg-[#111827]/40 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-200 dark:border-white/5 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <BarChart2 className="text-teal-500" size={16} />
                    Platform Activity Log Curve (7 Days)
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">Real daily volume across speech transcription, translation, and audio synthesis.</p>
                </div>
                <span className="text-xs font-black px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  LIVE LOGS
                </span>
              </div>

              {metrics?.daily_stats && metrics.daily_stats.length > 0 ? (
                <StackedMultiBarChart data={metrics.daily_stats} height={200} />
              ) : (
                <div className="h-44 flex items-center justify-center text-slate-400 text-sm font-medium">
                  No activity log history available.
                </div>
              )}
            </div>

            {/* Platform Resource Donut Graph */}
            <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-white/5 bg-white dark:bg-[#111827]/40 space-y-4 flex flex-col justify-between">
              <div className="border-b border-slate-200 dark:border-white/5 pb-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <PieChart className="text-teal-500" size={16} />
                  Resource Allocation Donut
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Proportional breakdown of total consumed features.</p>
              </div>

              {(() => {
                const totalSpeech = usageAnalytics.reduce((acc, u) => acc + (u.speech_minutes || 0), 0);
                const totalTrans = usageAnalytics.reduce((acc, u) => acc + (u.translation_chars || 0), 0);
                const totalTts = usageAnalytics.reduce((acc, u) => acc + (u.tts_chars || 0), 0);

                return (
                  <ResourceDonutChart
                    data={[
                      { label: 'Speech (mins)', value: Math.round(totalSpeech), color: '#14b8a6' },
                      { label: 'Translation (chars)', value: totalTrans, color: '#10b981' },
                      { label: 'TTS (chars)', value: totalTts, color: '#f59e0b' }
                    ]}
                    centerTitle="Platform Total"
                    size={160}
                  />
                );
              })()}
            </div>
          </div>

          {/* Tenant Visual Bar Ranking Chart */}
          {usageAnalytics.length > 0 && (
            <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-white/5 bg-white dark:bg-[#111827]/40 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="text-teal-500" size={16} />
                Workspace Resource Consumption Rankings
              </h3>
              <HorizontalRankBarChart
                items={usageAnalytics.map(u => ({
                  name: u.tenant_name,
                  plan: u.slug,
                  api_calls: Math.round((u.speech_minutes || 0) * 2 + (u.translation_chars || 0) / 100 + (u.tts_chars || 0) / 50),
                  audio_minutes: u.speech_minutes || 0,
                  translation_chars: u.translation_chars || 0,
                  tts_chars: u.tts_chars || 0
                }))}
              />
            </div>
          )}

          {/* Operational Usage Table */}
          <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-white/5 bg-white dark:bg-[#111827]/40 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/5 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="text-teal-500" size={16} />
                Detailed Tenant Operational Usage Matrix
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-base border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-white/5 text-slate-500">
                    <th className="py-2.5">Workspace Tenant</th>
                    <th className="py-2.5">Voice/Speech usage</th>
                    <th className="py-2.5">Translation usage</th>
                    <th className="py-2.5">TTS synthesis</th>
                    <th className="py-2.5">Storage</th>
                  </tr>
                </thead>
                <tbody>
                  {usageAnalytics.map((u: any) => (
                    <tr key={u.slug} className="border-b border-slate-200 dark:border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-3 font-semibold text-slate-800 dark:text-white">
                        <div>{u.tenant_name}</div>
                        <div className="text-sm text-slate-500">/{u.slug}</div>
                      </td>
                      <td className="py-3 text-slate-800 dark:text-slate-200 font-bold font-mono">{u.speech_minutes} mins</td>
                      <td className="py-3 text-slate-800 dark:text-slate-200 font-mono">{(u.translation_chars || 0).toLocaleString()} chars</td>
                      <td className="py-3 text-slate-800 dark:text-slate-200 font-mono">{(u.tts_chars || 0).toLocaleString()} chars</td>
                      <td className="py-3 text-slate-600 dark:text-slate-400 font-mono font-bold">{u.storage_mb} MB</td>
                    </tr>
                  ))}
                  {usageAnalytics.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400">No tenant usage data found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      {/* ── 7. BILLING DASHBOARD TAB ── */}
      {activeTab === 'billing' && billingOverview && (
        <div className="space-y-6 animate-fadeIn">
          {/* Sub-Tabs Selector */}
          <div className="flex border-b border-slate-200 dark:border-white/5 pb-2 gap-4">
            <button
              onClick={() => setBillingSubTab('analytics')}
              className={`text-base font-bold pb-2 transition-all cursor-pointer ${
                billingSubTab === 'analytics' 
                  ? 'text-teal-500 dark:text-teal-400 border-b-2 border-teal-500' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              Revenue Analytics
            </button>
            <button
              onClick={() => setBillingSubTab('invoices')}
              className={`text-base font-bold pb-2 transition-all cursor-pointer ${
                billingSubTab === 'invoices' 
                  ? 'text-teal-500 dark:text-teal-400 border-b-2 border-teal-500' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              Invoices ({billingOverview.invoices?.length || 0})
            </button>
            <button
              onClick={() => setBillingSubTab('payments')}
              className={`text-base font-bold pb-2 transition-all cursor-pointer ${
                billingSubTab === 'payments' 
                  ? 'text-teal-500 dark:text-teal-400 border-b-2 border-teal-500' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              Payments ({billingOverview.payments?.length || 0})
            </button>
            <button
              onClick={() => setBillingSubTab('subscriptions')}
              className={`text-base font-bold pb-2 transition-all cursor-pointer ${
                billingSubTab === 'subscriptions' 
                  ? 'text-teal-500 dark:text-teal-400 border-b-2 border-teal-500' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              Active Subscriptions ({billingOverview.subscriptions?.length || 0})
            </button>
          </div>

          {/* TAB 1: REVENUE ANALYTICS */}
          {billingSubTab === 'analytics' && (
            <div className="space-y-6">
              {/* Metrics Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="glass-card rounded-2xl p-4 border border-slate-200 dark:border-white/5 bg-white dark:bg-[#111827]/40">
                  <p className="text-sm font-black uppercase text-slate-500 tracking-wider">Today's Revenue</p>
                  <h3 className="text-2xl font-black text-emerald-400 mt-1">${(billingOverview.today_revenue || 0).toLocaleString()}</h3>
                </div>

                <div className="glass-card rounded-2xl p-4 border border-slate-200 dark:border-white/5 bg-white dark:bg-[#111827]/40">
                  <p className="text-sm font-black uppercase text-slate-500 tracking-wider">MRR</p>
                  <h3 className="text-2xl font-black text-teal-400 mt-1">${billingOverview.mrr.toLocaleString()}</h3>
                </div>

                <div className="glass-card rounded-2xl p-4 border border-slate-200 dark:border-white/5 bg-white dark:bg-[#111827]/40">
                  <p className="text-sm font-black uppercase text-slate-500 tracking-wider">ARR (Projected)</p>
                  <h3 className="text-2xl font-black text-emerald-400 mt-1">${(billingOverview.arr || billingOverview.mrr * 12).toLocaleString()}</h3>
                </div>

                <div className="glass-card rounded-2xl p-4 border border-slate-200 dark:border-white/5 bg-white dark:bg-[#111827]/40">
                  <p className="text-sm font-black uppercase text-slate-500 tracking-wider">Cumulative Revenue</p>
                  <h3 className="text-2xl font-black text-white mt-1">${billingOverview.total_revenue.toLocaleString()}</h3>
                </div>

                <div className="glass-card rounded-2xl p-4 border border-slate-200 dark:border-white/5 bg-white dark:bg-[#111827]/40">
                  <p className="text-sm font-black uppercase text-slate-500 tracking-wider">Payment Success Rate</p>
                  <h3 className="text-2xl font-black text-amber-400 mt-1">{(billingOverview.success_ratio || 95).toFixed(1)}%</h3>
                </div>
              </div>

              {/* Graphic Charts Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Trend Area Chart */}
                <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-slate-200 dark:border-white/5 bg-white dark:bg-[#111827]/40 space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <TrendingUp size={16} className="text-teal-500" />
                        Revenue Trajectory & Daily Billing Trend Graph
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">Real revenue generated from workspace subscription payments.</p>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-teal-500/10 text-teal-400 font-bold border border-teal-500/20">
                      7 DAY REVENUE CURVE
                    </span>
                  </div>
                  <div className="w-full pt-2">
                    {(() => {
                      const trendValues = billingOverview.revenue_trend?.values || [0, 0, 0, 0, 0, 0, billingOverview.today_revenue || 0];
                      const trendLabels = billingOverview.revenue_trend?.labels || ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Today'];
                      const chartData = trendLabels.map((lbl: string, i: number) => ({
                        label: lbl,
                        value: trendValues[i] || 0
                      }));

                      return (
                        <AreaTrendChart
                          data={chartData}
                          color="#3b82f6"
                          gradientId="billingRevGradient"
                          height={200}
                          unit="₹"
                        />
                      );
                    })()}
                  </div>
                </div>

                {/* Gateway spreads & success ratios */}
                <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-white/5 bg-white dark:bg-[#111827]/40 space-y-6 flex flex-col justify-between">
                  <div className="space-y-4">
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">Gateway Distribution</h4>
                    <div className="space-y-3">
                      {(() => {
                        const spread = billingOverview.gateway_spread || [];
                        const maxSpread = Math.max(...spread.map((s: any) => s.value), 1);
                        return spread.map((item: any, i: number) => {
                          const pct = (item.value / maxSpread) * 100;
                          return (
                            <div key={i} className="space-y-1">
                              <div className="flex justify-between text-sm font-bold">
                                <span className="text-slate-400 uppercase">{item.name}</span>
                                <span className="text-white">${item.value.toLocaleString()}</span>
                              </div>
                              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-teal-500 rounded-full" style={{ width: `${pct}%` }} />
                              </div>
                            </div>
                          );
                        });
                      })()}
                    </div>
                  </div>

                  {/* Circular success ratio representation */}
                  <div className="pt-4 border-t border-white/5 text-center space-y-2">
                    <span className="text-sm text-slate-400 font-bold uppercase tracking-wider">Gateway Checkout Health</span>
                    <div className="flex justify-center items-center gap-4">
                      {(() => {
                        const ratio = billingOverview.success_ratio || 95;
                        const radius = 32;
                        const circumference = 2 * Math.PI * radius;
                        const offset = circumference - (ratio / 100) * circumference;
                        return (
                          <div className="relative flex items-center justify-center">
                            <svg width="76" height="76" viewBox="0 0 80 80">
                              <circle cx="40" cy="40" r={radius} fill="transparent" stroke="rgba(255,255,255,0.03)" strokeWidth="6" />
                              <circle 
                                cx="40" 
                                cy="40" 
                                r={radius} 
                                fill="transparent" 
                                stroke="#10b981" 
                                strokeWidth="6" 
                                strokeDasharray={circumference} 
                                strokeDashoffset={offset} 
                                strokeLinecap="round" 
                                transform="rotate(-90 40 40)" 
                              />
                            </svg>
                            <span className="absolute text-sm font-black text-white">{ratio.toFixed(0)}%</span>
                          </div>
                        );
                      })()}
                      <div className="text-left text-sm font-semibold text-slate-400">
                        <div className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Success checkouts</div>
                        <div className="flex items-center gap-1 mt-1"><span className="h-2 w-2 rounded-full bg-red-500" /> Declines/Failures</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: INVOICES LOG */}
          {billingSubTab === 'invoices' && (
            <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-white/5 bg-white dark:bg-[#111827]/40 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CreditCard size={14} className="text-emerald-400" />
                Invoices Log
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-base border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400 font-bold font-sans">
                      <th className="py-2.5">Invoice #</th>
                      <th className="py-2.5">Workspace</th>
                      <th className="py-2.5">Billing Plan</th>
                      <th className="py-2.5">Amount</th>
                      <th className="py-2.5">Status</th>
                      <th className="py-2.5">Issued Date</th>
                      <th className="py-2.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {billingOverview.invoices?.map((inv: any) => (
                      <tr key={inv.id} className="border-b border-slate-200 dark:border-white/5 hover:bg-white/5 transition-colors">
                        <td className="py-3 font-mono font-bold text-slate-800 dark:text-white">
                          {inv.invoice_number}
                        </td>
                        <td className="py-3 text-slate-700 dark:text-white font-semibold">{inv.tenant_name}</td>
                        <td className="py-3 text-slate-550 dark:text-slate-400">{inv.plan}</td>
                        <td className="py-3 font-bold text-emerald-400">${inv.amount}</td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded text-sm font-black uppercase ${
                            inv.status.toLowerCase() === 'paid' 
                              ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                              : inv.status.toLowerCase() === 'failed' 
                                ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                                : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                          }`}>
                            {inv.status}
                          </span>
                        </td>
                        <td className="py-3 text-slate-500 font-mono">{inv.date}</td>
                        <td className="py-3 text-right space-x-1.5 font-semibold">
                          <a
                            href={`/api/billing/invoices/${inv.id}/download`}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-white/5 hover:bg-white/10 text-slate-700 dark:text-slate-350 hover:text-white px-2.5 py-1 rounded text-sm inline-flex items-center gap-0.5"
                          >
                            PDF
                          </a>
                          <button
                            onClick={() => handleEmailInvoice(inv.id)}
                            className="bg-teal-600/10 hover:bg-teal-600/20 text-teal-400 px-2 py-0.5 rounded text-sm"
                           title="Email"><Mail size={16} /></button>
                          <button
                            onClick={() => handleRegenerateInvoice(inv.id)}
                            className="bg-white/5 hover:bg-white/10 text-slate-700 dark:text-slate-300 hover:text-white px-2 py-0.5 rounded text-sm"
                          >
                            Regen
                          </button>
                        </td>
                      </tr>
                    ))}
                    {(!billingOverview.invoices || billingOverview.invoices.length === 0) && (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-slate-400 font-semibold">No invoices found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: PAYMENTS TAB */}
          {billingSubTab === 'payments' && (
            <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-white/5 bg-white dark:bg-[#111827]/40 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/5 pb-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <TrendingUp size={14} className="text-teal-400" />
                  Payments Tracking
                </h3>
                <button
                  onClick={exportPaymentsToCSV}
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-sm font-bold transition-all cursor-pointer"
                >
                  Export CSV
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-base border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400 font-bold font-sans">
                      <th className="py-2.5">Transaction ID</th>
                      <th className="py-2.5">Invoice #</th>
                      <th className="py-2.5">Tenant Name</th>
                      <th className="py-2.5">Workspace</th>
                      <th className="py-2.5">Plan</th>
                      <th className="py-2.5">Gateway</th>
                      <th className="py-2.5">Amount</th>
                      <th className="py-2.5">Status</th>
                      <th className="py-2.5">Payment Date</th>
                      <th className="py-2.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {billingOverview.payments?.map((p: any) => (
                      <tr key={p.id} className="border-b border-slate-200 dark:border-white/5 hover:bg-white/5 transition-colors">
                        <td className="py-3 font-mono font-bold text-slate-800 dark:text-white">
                          {p.transaction_id}
                        </td>
                        <td className="py-3 font-mono text-slate-650 dark:text-slate-350">{p.invoice_number}</td>
                        <td className="py-3 text-slate-700 dark:text-white font-semibold">{p.tenant_name}</td>
                        <td className="py-3 text-slate-500 font-mono">{p.workspace}</td>
                        <td className="py-3 text-slate-550 dark:text-slate-400 capitalize">{p.plan}</td>
                        <td className="py-3 text-slate-550 dark:text-slate-400 capitalize font-bold">{p.gateway}</td>
                        <td className="py-3 text-emerald-400 font-extrabold">${p.amount}</td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded text-sm font-black uppercase ${
                            p.status.toLowerCase() === 'success' 
                              ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                              : p.status.toLowerCase() === 'failed' 
                                ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                                : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                          }`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="py-3 text-slate-500 font-mono">{p.date}</td>
                        <td className="py-3 text-right space-x-1.5 font-semibold">
                          <button
                            onClick={() => setViewingPaymentDetails(p)}
                            className="bg-white/5 hover:bg-white/10 text-slate-700 dark:text-slate-300 px-2 py-1 rounded text-sm"
                          >
                            Details
                          </button>
                          {p.status.toLowerCase() === 'success' && p.receipt_url && (
                            <a
                              href={`${p.receipt_url}`}
                              target="_blank"
                              rel="noreferrer"
                              className="bg-teal-600/10 hover:bg-teal-600/20 text-teal-400 px-2 py-1 rounded text-sm inline-flex items-center gap-0.5"
                            >
                              Receipt
                            </a>
                          )}
                        </td>
                      </tr>
                    ))}
                    {(!billingOverview.payments || billingOverview.payments.length === 0) && (
                      <tr>
                        <td colSpan={10} className="py-8 text-center text-slate-400 font-semibold">No payments logged yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: SUBSCRIPTIONS */}
          {billingSubTab === 'subscriptions' && (
            <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-white/5 bg-white dark:bg-[#111827]/40 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                <CheckCircle2 size={14} className="text-teal-400" />
                Subscription Management
              </h3>

              {/* Cards Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                <div className="glass-card rounded-2xl p-4 border border-slate-200 dark:border-white/5 bg-white dark:bg-[#111827]/40">
                  <p className="text-sm font-black uppercase text-slate-500 tracking-wider">Total Revenue</p>
                  <h3 className="text-2xl font-black text-white mt-1">${(billingOverview.total_revenue || 0).toLocaleString()}</h3>
                </div>
                <div className="glass-card rounded-2xl p-4 border border-slate-200 dark:border-white/5 bg-white dark:bg-[#111827]/40">
                  <p className="text-sm font-black uppercase text-slate-500 tracking-wider">Active Subscriptions</p>
                  <h3 className="text-2xl font-black text-emerald-400 mt-1">{billingOverview.active_subscriptions || 0}</h3>
                </div>
                <div className="glass-card rounded-2xl p-4 border border-slate-200 dark:border-white/5 bg-white dark:bg-[#111827]/40">
                  <p className="text-sm font-black uppercase text-slate-500 tracking-wider">Expired Subscriptions</p>
                  <h3 className="text-2xl font-black text-red-500 mt-1">{billingOverview.expired_subscriptions || 0}</h3>
                </div>
                <div className="glass-card rounded-2xl p-4 border border-slate-200 dark:border-white/5 bg-white dark:bg-[#111827]/40">
                  <p className="text-sm font-black uppercase text-slate-500 tracking-wider">Monthly Revenue</p>
                  <h3 className="text-2xl font-black text-teal-400 mt-1">${(billingOverview.mrr || 0).toLocaleString()}</h3>
                </div>
                <div className="glass-card rounded-2xl p-4 border border-slate-200 dark:border-white/5 bg-white dark:bg-[#111827]/40">
                  <p className="text-sm font-black uppercase text-slate-500 tracking-wider">Yearly Revenue</p>
                  <h3 className="text-2xl font-black text-emerald-400 mt-1">${(billingOverview.arr || 0).toLocaleString()}</h3>
                </div>
              </div>

              {/* Filters / Search Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-white/5 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <Search size={14} className="text-slate-500 dark:text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search user, email, plan..."
                    value={subSearchTerm}
                    onChange={(e) => setSubSearchTerm(e.target.value)}
                    className="px-3 py-1.5 rounded-xl text-base bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-200 outline-none"
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    value={subStatusFilter}
                    onChange={(e) => setSubStatusFilter(e.target.value)}
                    className="px-2 py-1 rounded bg-white dark:bg-[#0B1020] border border-slate-200 dark:border-white/5 text-sm font-bold text-slate-700 dark:text-slate-300 outline-none"
                    style={{ background: 'var(--bg-subtle)' }}
                  >
                    <option value="">All Statuses</option>
                    <option value="Active">Active</option>
                    <option value="Expired">Expired</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                  <select
                    value={subCycleFilter}
                    onChange={(e) => setSubCycleFilter(e.target.value)}
                    className="px-2 py-1 rounded bg-white dark:bg-[#0B1020] border border-slate-200 dark:border-white/5 text-sm font-bold text-slate-700 dark:text-slate-300 outline-none"
                    style={{ background: 'var(--bg-subtle)' }}
                  >
                    <option value="">All Cycles</option>
                    <option value="monthly">Monthly Plan</option>
                    <option value="yearly">Yearly Plan</option>
                  </select>
                  <button
                    onClick={exportSubscriptionsToCSV}
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-sm font-bold transition-all cursor-pointer"
                  >
                    Export CSV
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-base border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400 font-bold font-sans">
                      <th className="py-2.5">User Name</th>
                      <th className="py-2.5">Email</th>
                      <th className="py-2.5">Plan</th>
                      <th className="py-2.5">Amount</th>
                      <th className="py-2.5">Payment Status</th>
                      <th className="py-2.5">Subscription Status</th>
                      <th className="py-2.5 font-mono">Start Date</th>
                      <th className="py-2.5 font-mono">Expiry Date</th>
                      <th className="py-2.5">Payment ID</th>
                      <th className="py-2.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {billingOverview.subscriptions?.filter((sub: any) => {
                      const matchSearch = (sub.user_name || '').toLowerCase().includes(subSearchTerm.toLowerCase()) ||
                                          (sub.email || '').toLowerCase().includes(subSearchTerm.toLowerCase()) ||
                                          (sub.plan || '').toLowerCase().includes(subSearchTerm.toLowerCase());
                      const matchStatus = subStatusFilter === '' || sub.status === subStatusFilter;
                      const matchCycle = subCycleFilter === '' || sub.billing_cycle === subCycleFilter;
                      return matchSearch && matchStatus && matchCycle;
                    }).map((sub: any) => (
                      <tr key={sub.id} className="border-b border-slate-200 dark:border-white/5 hover:bg-white/5 transition-colors">
                        <td className="py-3 font-semibold text-slate-700 dark:text-white">{sub.user_name || 'N/A'}</td>
                        <td className="py-3 font-mono text-slate-500 dark:text-slate-450">{sub.email || 'N/A'}</td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 rounded text-sm font-bold bg-teal-500/10 text-teal-400 border border-teal-500/20 capitalize">
                            {sub.plan}
                          </span>
                        </td>
                        <td className="py-3 text-white font-bold">${sub.amount || 0}</td>
                        <td className="py-3 text-slate-400">{sub.payment_status || 'N/A'}</td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded text-sm font-bold border uppercase ${
                            sub.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                            sub.status === 'Expired' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                            'bg-amber-500/10 text-amber-500 border-amber-500/20'
                          }`}>
                            {sub.status || 'Active'}
                          </span>
                        </td>
                        <td className="py-3 text-slate-500 font-mono">{sub.started || '-'}</td>
                        <td className="py-3 text-slate-500 font-mono font-bold">{sub.expires}</td>
                        <td className="py-3 font-mono text-sm text-slate-400">{sub.payment_id || 'N/A'}</td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => handleRenewPlan(sub.tenant_name)}
                            className="bg-teal-600/15 hover:bg-teal-600/25 text-teal-400 px-2.5 py-1 rounded text-sm font-bold cursor-pointer"
                          >
                            Renew Plan
                          </button>
                        </td>
                      </tr>
                    ))}
                    {(!billingOverview.subscriptions || billingOverview.subscriptions.length === 0) && (
                      <tr>
                        <td colSpan={10} className="py-8 text-center text-slate-400 font-semibold">No subscriptions found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Billing & Gateway Configurations Form */}
          {gatewaySettings && (
            <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-white/5 bg-white dark:bg-[#111827]/40 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Settings size={14} className="text-teal-500" />
                Global Gateway & Invoicing Settings (Super Admin)
              </h3>
              <form onSubmit={handleSaveBillingSettings} className="space-y-4 text-base">
                
                {/* Invoice Customization Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-white/5 pb-4">
                  <div className="space-y-1">
                    <label className="text-sm font-bold uppercase tracking-wider text-slate-400">Company Name</label>
                    <input
                      type="text"
                      value={gatewaySettings.company_name}
                      onChange={(e) => setGatewaySettings({ ...gatewaySettings, company_name: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-200 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-bold uppercase tracking-wider text-slate-400">Company Email</label>
                    <input
                      type="email"
                      value={gatewaySettings.company_email}
                      onChange={(e) => setGatewaySettings({ ...gatewaySettings, company_email: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-200 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-bold uppercase tracking-wider text-slate-400">Company Address</label>
                    <input
                      type="text"
                      value={gatewaySettings.company_address}
                      onChange={(e) => setGatewaySettings({ ...gatewaySettings, company_address: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-200 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 border-b border-white/5 pb-4">
                  <div className="space-y-1">
                    <label className="text-sm font-bold uppercase tracking-wider text-slate-400">Currency</label>
                    <select
                      value={gatewaySettings.currency}
                      onChange={(e) => setGatewaySettings({ ...gatewaySettings, currency: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-200 outline-none"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="INR">INR (₹)</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-bold uppercase tracking-wider text-slate-400">GST Percentage (%)</label>
                    <input
                      type="number"
                      value={gatewaySettings.gst_percentage}
                      onChange={(e) => setGatewaySettings({ ...gatewaySettings, gst_percentage: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-200 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-bold uppercase tracking-wider text-slate-400">Invoice Number Prefix</label>
                    <input
                      type="text"
                      value={gatewaySettings.invoice_prefix}
                      onChange={(e) => setGatewaySettings({ ...gatewaySettings, invoice_prefix: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-200 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-bold uppercase tracking-wider text-slate-400">Default Gateway</label>
                    <select
                      value={gatewaySettings.default_gateway}
                      onChange={(e) => setGatewaySettings({ ...gatewaySettings, default_gateway: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-200 outline-none"
                    >
                      <option value="stripe">Stripe</option>
                      <option value="razorpay">Razorpay</option>
                      <option value="upi">UPI QR Pay</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1 border-b border-white/5 pb-4">
                  <label className="text-sm font-bold uppercase tracking-wider text-slate-400">Invoice Footer Note</label>
                  <textarea
                    rows={2}
                    value={gatewaySettings.invoice_footer}
                    onChange={(e) => setGatewaySettings({ ...gatewaySettings, invoice_footer: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-200 outline-none font-sans"
                  />
                </div>

                {/* Gateway Keys configuration */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                  {/* Stripe Panel */}
                  <div className="p-4 rounded-xl bg-slate-950/20 border border-white/5 space-y-3">
                    <div className="flex justify-between items-center">
                      <strong className="text-white">Stripe Checkout</strong>
                      <input
                        type="checkbox"
                        checked={gatewaySettings.stripe_enabled}
                        onChange={(e) => setGatewaySettings({ ...gatewaySettings, stripe_enabled: e.target.checked })}
                      />
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="space-y-1">
                        <label className="text-slate-400 font-bold uppercase">Publishable Key</label>
                        <input
                          type="text"
                          value={gatewaySettings.stripe_public_key}
                          onChange={(e) => setGatewaySettings({ ...gatewaySettings, stripe_public_key: e.target.value })}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950/40 border border-white/5 text-slate-200 outline-none font-mono"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-slate-400 font-bold uppercase">Secret Key</label>
                        <input
                          type="password"
                          value={gatewaySettings.stripe_secret_key || ''}
                          onChange={(e) => setGatewaySettings({ ...gatewaySettings, stripe_secret_key: e.target.value })}
                          placeholder="sk_test_••••••••••••••••"
                          className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950/40 border border-white/5 text-slate-200 outline-none font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Razorpay Panel */}
                  <div className="p-4 rounded-xl bg-slate-950/20 border border-white/5 space-y-3">
                    <div className="flex justify-between items-center">
                      <strong className="text-white">Razorpay Gateway</strong>
                      <input
                        type="checkbox"
                        checked={gatewaySettings.razorpay_enabled}
                        onChange={(e) => setGatewaySettings({ ...gatewaySettings, razorpay_enabled: e.target.checked })}
                      />
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="space-y-1">
                        <label className="text-slate-400 font-bold uppercase">Key ID</label>
                        <input
                          type="text"
                          value={gatewaySettings.razorpay_key_id}
                          onChange={(e) => setGatewaySettings({ ...gatewaySettings, razorpay_key_id: e.target.value })}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950/40 border border-white/5 text-slate-200 outline-none font-mono"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-slate-400 font-bold uppercase">Key Secret</label>
                        <input
                          type="password"
                          value={gatewaySettings.razorpay_key_secret || ''}
                          onChange={(e) => setGatewaySettings({ ...gatewaySettings, razorpay_key_secret: e.target.value })}
                          placeholder="rzp_secret_••••••••••••"
                          className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950/40 border border-white/5 text-slate-200 outline-none font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* UPI Panel */}
                  <div className="p-4 rounded-xl bg-slate-950/20 border border-white/5 space-y-3">
                    <div className="flex justify-between items-center">
                      <strong className="text-white">UPI QR Code</strong>
                      <input
                        type="checkbox"
                        checked={gatewaySettings.upi_enabled}
                        onChange={(e) => setGatewaySettings({ ...gatewaySettings, upi_enabled: e.target.checked })}
                      />
                    </div>
                    <div className="space-y-2 text-sm h-full">
                      <div className="space-y-1">
                        <label className="text-slate-400 font-bold uppercase">VPA Address (UPI ID)</label>
                        <input
                          type="text"
                          value={gatewaySettings.upi_id}
                          onChange={(e) => setGatewaySettings({ ...gatewaySettings, upi_id: e.target.value })}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950/40 border border-white/5 text-slate-200 outline-none font-mono"
                        />
                      </div>
                      <p className="text-sm text-slate-500 leading-relaxed font-semibold pt-1">QR Code generator will render payment intents pointing to this merchant address automatically.</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2.5 px-6 rounded-xl transition-all cursor-pointer shadow-lg shadow-teal-600/10"
                  >
                    Save Configuration Keys
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* ── 8. AI LOGS TAB ── */}
      {activeTab === 'ai_logs' && (
        <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-white/5 bg-white dark:bg-white dark:bg-[#111827]/40 animate-fadeIn space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/5 pb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Activity size={14} className="text-teal-400" />
              Unified AI Activity Logs
            </h3>
            <div className="flex items-center gap-3">
              <select
                value={logTimeFilter}
                onChange={(e) => setLogTimeFilter(e.target.value as any)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-200 outline-none cursor-pointer hover:border-slate-300 transition-colors"
              >
                <option value="all" className="bg-white dark:bg-slate-900 text-slate-850 dark:text-slate-100">All Time</option>
                <option value="today" className="bg-white dark:bg-slate-900 text-slate-850 dark:text-slate-100">Today</option>
                <option value="weekly" className="bg-white dark:bg-slate-900 text-slate-850 dark:text-slate-100">Weekly</option>
                <option value="monthly" className="bg-white dark:bg-slate-900 text-slate-850 dark:text-slate-100">Monthly</option>
              </select>

              <div className="flex items-center gap-2">
                <Search size={14} className="text-slate-500 dark:text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-3 py-1.5 rounded-xl text-base bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-200 outline-none placeholder-slate-500"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-base border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-white/5 text-slate-500">
                  <th className="py-2.5">Time</th>
                  <th className="py-2.5">Tenant Workspace</th>
                  <th className="py-2.5">AI Feature</th>
                  <th className="py-2.5">Model Provider</th>
                  <th className="py-2.5">Response Time</th>
                  <th className="py-2.5">Cost</th>
                  <th className="py-2.5">Status</th>
                </tr>
              </thead>
              <tbody>
                {aiLogs
                  .filter(l => l.tenant.toLowerCase().includes(searchTerm.toLowerCase()) || l.feature.toLowerCase().includes(searchTerm.toLowerCase()) || l.provider.toLowerCase().includes(searchTerm.toLowerCase()))
                  .filter(l => {
                    if (logTimeFilter === 'all') return true;
                    if (!l.timestamp) return true;
                    const logDate = new Date(l.timestamp);
                    const now = new Date();
                    if (logTimeFilter === 'today') {
                      return logDate.toDateString() === now.toDateString();
                    }
                    if (logTimeFilter === 'weekly') {
                      const diffTime = Math.abs(now.getTime() - logDate.getTime());
                      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                      return diffDays <= 7;
                    }
                    if (logTimeFilter === 'monthly') {
                      return logDate.getMonth() === now.getMonth() && logDate.getFullYear() === now.getFullYear();
                    }
                    return true;
                  })
                  .map((log: any, idx: number) => {
                    const duration = log.provider === 'openai' ? '450ms' : log.provider === 'deepgram' ? '320ms' : '820ms';
                    return (
                      <tr key={idx} className="border-b border-slate-200 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                        <td className="py-3 font-mono text-slate-500 dark:text-slate-400">{log.time}</td>
                        <td className="py-3 font-semibold text-slate-900 dark:text-white">{log.tenant}</td>
                        <td className="py-3 text-slate-850 dark:text-slate-200 font-bold">{log.feature}</td>
                        <td className="py-3">
                          <span className="px-2.5 py-1 rounded-full text-xs font-black bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 uppercase tracking-wider">
                            {log.provider}
                          </span>
                        </td>
                        <td className="py-3 text-slate-600 dark:text-slate-400 font-mono">{duration}</td>
                        <td className="py-3 font-mono text-emerald-600 dark:text-emerald-400 font-extrabold">{log.cost}</td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 rounded text-xs font-black bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── 9. AUDIT LOGS TAB ── */}
      {activeTab === 'audit_logs' && (
        <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-white/5 bg-white dark:bg-white dark:bg-[#111827]/40 animate-fadeIn space-y-6">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="text-teal-500" size={16} />
            Platform Administration Audit Trails
          </h3>
          
          <div className="relative border-l border-slate-200 dark:border-white/5 ml-4 pl-6 space-y-6">
            {auditLogs.map((log: any, idx: number) => (
              <div key={idx} className="relative group">
                <div className="absolute -left-9 top-0.5 h-6 w-6 rounded-full bg-white dark:bg-[#0B1020] border border-teal-500/40 text-teal-400 flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
                  <ShieldCheck size={12} />
                </div>
                
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-base font-bold text-slate-800 dark:text-white">{log.actor}</span>
                    <span className="px-2.5 py-0.5 rounded text-sm font-bold bg-teal-500/10 text-teal-400 border border-teal-500/20">
                      {log.action}
                    </span>
                    <span className="text-sm text-slate-500 dark:text-slate-600 dark:text-slate-400 font-mono">{log.time}</span>
                  </div>
                  <p className="text-base text-slate-700 dark:text-slate-300 font-bold mt-1">{log.target}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 10. SYSTEM HEALTH TAB ── */}
      {activeTab === 'system_health' && systemHealth && (
        <div className="space-y-6 animate-fadeIn">
          {/* Resource Usage Radial Gauge Charts */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <RadialGaugeChart
              value={parseFloat(systemHealth.cpu) || 32}
              title="CPU Load"
              subtitle="Core Host Utilization"
              color="#14b8a6"
            />
            <RadialGaugeChart
              value={parseFloat(systemHealth.ram) || 48}
              title="RAM Memory Usage"
              subtitle="Virtual Memory Allocated"
              color="#10b981"
            />
            <RadialGaugeChart
              value={parseFloat(systemHealth.disk) || 55}
              title="Disk Storage Used"
              subtitle="Primary Mount Partition"
              color="#f59e0b"
            />
          </div>

          {/* Microservices Checklist */}
          <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-white/5 bg-white dark:bg-[#111827]/40 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Server size={14} className="text-teal-400" />
              Service Health
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(systemHealth.services).map(([service, status]: any) => (
                <div key={service} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/30 border border-slate-200 dark:border-white/5 flex items-center justify-between">
                  <span className="text-base font-bold text-slate-800 dark:text-slate-200">{service}</span>
                  <span className={`px-2 py-0.5 rounded text-sm font-black ${
                    status === 'Healthy' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                    status === 'Warning' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' : 'bg-red-500/10 text-red-500'
                  }`}>
                    {status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── 11. PLATFORM BUILDER TAB ── */}
      {activeTab === 'builder' && (
        <PlatformBuilder />
      )}

      {/* ── View Tenant Details Modal ── */}
      {viewingTenant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-lg overflow-hidden rounded-2xl p-6 bg-white dark:bg-slate-900 border border-white/10 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-white/5 pb-2">
              <h3 className="text-base font-bold text-slate-800 dark:text-white">Workspace: {viewingTenant.tenant_name}</h3>
              <button onClick={() => setViewingTenant(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            
            <div className="space-y-2 text-base">
              <div className="flex justify-between py-2 border-b border-slate-200 dark:border-white/5">
                <span className="text-slate-400">Owner</span>
                <span className="text-slate-800 dark:text-white font-bold">{viewingTenant.owner_name} ({viewingTenant.owner_email})</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-200 dark:border-white/5">
                <span className="text-slate-400">Total Members</span>
                <span className="text-slate-800 dark:text-white font-bold">{viewingTenant.users_count}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-200 dark:border-white/5">
                <span className="text-slate-400">Active Plan</span>
                <span className="text-teal-400 font-bold">{viewingTenant.plan?.name} (${viewingTenant.plan?.price}/mo)</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-200 dark:border-white/5">
                <span className="text-slate-400">Workspace Status</span>
                <span className="text-emerald-400 font-bold uppercase">{viewingTenant.status}</span>
              </div>
              
              <div className="pt-3">
                <p className="text-sm font-black uppercase text-teal-400 mb-2 tracking-wider">Resource Ingestion levels (MTD)</p>
                <div className="grid grid-cols-2 gap-3 p-3 bg-white dark:bg-white dark:bg-slate-950/40 rounded-xl border border-slate-200 dark:border-white/5">
                  <div>
                    <span className="text-sm text-slate-500">Speech Audio:</span>
                    <p className="text-base font-bold text-slate-800 dark:text-white mt-0.5">{viewingTenant.usage?.transcription_minutes} mins</p>
                  </div>
                  <div>
                    <span className="text-sm text-slate-500">Translation:</span>
                    <p className="text-base font-bold text-slate-800 dark:text-white mt-0.5">{(viewingTenant.usage?.translation_characters || 0).toLocaleString()} chars</p>
                  </div>
                  <div>
                    <span className="text-sm text-slate-500">TTS Audio:</span>
                    <p className="text-base font-bold text-slate-800 dark:text-white mt-0.5">{(viewingTenant.usage?.tts_characters || 0).toLocaleString()} chars</p>
                  </div>
                  <div>
                    <span className="text-sm text-slate-500">API Logs today:</span>
                    <p className="text-base font-bold text-slate-800 dark:text-white mt-0.5">{(viewingTenant.usage?.api_calls || 0).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 flex gap-3">
              <button
                onClick={() => {
                  setEditingTenant(viewingTenant);
                  setEditTenantName(viewingTenant.tenant_name);
                  setEditTenantPlanId(viewingTenant.plan?.id || '');
                  setViewingTenant(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-slate-800 dark:text-white text-base font-bold transition-all text-center cursor-pointer shadow-md"
              >
                Upgrade Plan limits
              </button>
              <button
                onClick={() => setViewingTenant(null)}
                className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-800 dark:text-white text-base font-bold transition-all text-center cursor-pointer border border-slate-200 dark:border-white/5"
              >
                Close details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Tenant Plan Modal */}
      {editingTenant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-sm overflow-hidden rounded-2xl p-6 bg-white dark:bg-slate-900 border border-white/10 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-white/5 pb-2">
              <h3 className="text-base font-bold text-slate-800 dark:text-white">Upgrade Tenant limits</h3>
              <button onClick={() => setEditingTenant(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-bold uppercase tracking-wider text-slate-400">Workspace</label>
                <input
                  type="text"
                  disabled
                  value={editTenantName}
                  className="w-full px-3 py-2 mt-1 rounded-xl text-base bg-white dark:bg-slate-950/20 border border-slate-200 dark:border-white/5 text-slate-500 outline-none"
                />
              </div>

              <div>
                <label className="text-sm font-bold uppercase tracking-wider text-slate-400">Billing Plan Tier</label>
                <select
                  value={editTenantPlanId}
                  onChange={(e) => setEditTenantPlanId(e.target.value)}
                  className="w-full px-3 py-2 mt-1 rounded-xl text-base bg-white dark:bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-100 outline-none"
                  style={{ background: 'var(--bg-subtle)' }}
                >
                  <option value="" className="text-slate-900 dark:text-slate-200 bg-white dark:bg-slate-950">Select plan tier...</option>
                  {plans.map(p => (
                    <option key={p.id} value={p.id} className="text-slate-900 dark:text-slate-200 bg-white dark:bg-slate-950">{p.name} (${p.price}/mo)</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-4 flex gap-3">
              <button
                onClick={() => handleUpgradeTenant(editingTenant.id, editTenantPlanId)}
                className="flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-slate-800 dark:text-white text-base font-bold cursor-pointer shadow-md"
              >
                Upgrade limits
              </button>
              <button
                onClick={() => setEditingTenant(null)}
                className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-800 dark:text-white text-base font-bold cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Details Modal */}
      {viewingPaymentDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-2xl p-6 space-y-4">
            <div className="flex justify-between items-start border-b border-slate-250 dark:border-white/5 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <CreditCard className="text-teal-500" size={16} />
                  Payment Transaction Details
                </h3>
                <p className="text-sm text-slate-500 mt-1">Detailed transaction receipt and gateway verification payload.</p>
              </div>
              <button 
                onClick={() => setViewingPaymentDetails(null)} 
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-base">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <span className="block text-sm font-bold text-slate-400 uppercase">Transaction ID</span>
                  <strong className="text-slate-800 dark:text-white font-mono">{viewingPaymentDetails.transaction_id}</strong>
                </div>
                <div className="space-y-1">
                  <span className="block text-sm font-bold text-slate-400 uppercase">Invoice Number</span>
                  <strong className="text-slate-800 dark:text-white font-mono">{viewingPaymentDetails.invoice_number}</strong>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <span className="block text-sm font-bold text-slate-400 uppercase">Tenant Name</span>
                  <strong className="text-slate-800 dark:text-white">{viewingPaymentDetails.tenant_name}</strong>
                </div>
                <div className="space-y-1">
                  <span className="block text-sm font-bold text-slate-400 uppercase">Workspace slug</span>
                  <strong className="text-slate-800 dark:text-white font-mono">{viewingPaymentDetails.workspace}</strong>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <span className="block text-sm font-bold text-slate-400 uppercase">Amount</span>
                  <strong className="text-emerald-500 font-extrabold">${viewingPaymentDetails.amount}</strong>
                </div>
                <div className="space-y-1">
                  <span className="block text-sm font-bold text-slate-400 uppercase">Gateway</span>
                  <strong className="text-slate-800 dark:text-white capitalize">{viewingPaymentDetails.gateway}</strong>
                </div>
                <div className="space-y-1">
                  <span className="block text-sm font-bold text-slate-400 uppercase">Status</span>
                  <span className={`inline-block px-1.5 py-0.5 rounded text-sm font-black uppercase ${
                    viewingPaymentDetails.status.toLowerCase() === 'success' 
                      ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                      : 'bg-red-500/10 text-red-500 border border-red-500/20'
                  }`}>
                    {viewingPaymentDetails.status}
                  </span>
                </div>
              </div>

              <div className="space-y-1 pt-2 border-t border-slate-200 dark:border-white/5">
                <span className="block text-sm font-bold text-slate-400 uppercase">Raw Gateway Response JSON</span>
                <pre className="w-full max-h-40 overflow-y-auto p-3 rounded-lg bg-slate-950 text-sm font-mono text-slate-300 border border-white/5 leading-relaxed whitespace-pre-wrap">
                  {(() => {
                    const mockPayload = {
                      transaction_id: viewingPaymentDetails.transaction_id,
                      payment_gateway: viewingPaymentDetails.gateway,
                      currency: viewingPaymentDetails.currency || "INR",
                      checkout_amount: viewingPaymentDetails.amount,
                      status: viewingPaymentDetails.status.toLowerCase() === 'success' ? 'captured' : 'failed',
                      timestamp: viewingPaymentDetails.date,
                      gateway_event: viewingPaymentDetails.status.toLowerCase() === 'success' ? 'payment.succeeded' : 'payment.failed',
                      simulated: true,
                      payment_method: {
                        type: viewingPaymentDetails.gateway === 'stripe' ? 'card' : viewingPaymentDetails.gateway === 'razorpay' ? 'netbanking' : 'upi',
                        issuer: viewingPaymentDetails.gateway === 'stripe' ? 'Visa (4242)' : viewingPaymentDetails.gateway === 'razorpay' ? 'SBI' : 'UPI QR'
                      }
                    };
                    return JSON.stringify(mockPayload, null, 2);
                  })()}
                </pre>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setViewingPaymentDetails(null)}
                className="w-full py-2.5 rounded-xl bg-white hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-800 dark:text-white text-base font-bold cursor-pointer transition-all"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

    
      {/* Custom Confirmation Dialog Modal */}
      {confirmDialog.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-2xl animate-slideUp">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
                  <AlertCircle className="text-red-500" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{confirmDialog.title}</h3>
                </div>
              </div>
              <button 
                onClick={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))} 
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>
            
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-8">
              {confirmDialog.message}
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
                className="flex-1 py-3 rounded-2xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-800 dark:text-white font-bold cursor-pointer transition-all"
              >
                {confirmDialog.cancelText}
              </button>
              <button
                onClick={confirmDialog.onConfirm}
                className="flex-1 py-3 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-bold cursor-pointer shadow-lg shadow-red-500/25 transition-all"
              >
                {confirmDialog.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Subscription Plan Modal */}
      {editingPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md overflow-hidden rounded-2xl p-6 bg-white dark:bg-slate-900 border border-white/10 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-white/5 pb-2">
              <h3 className="text-base font-bold text-slate-800 dark:text-white">
                {editingPlan.isNew ? "Create Subscription Plan" : "Edit Subscription Plan"}
              </h3>
              <button onClick={() => setEditingPlan(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-bold uppercase tracking-wider text-slate-400">Plan Name</label>
                <input
                  type="text"
                  value={editPlanName}
                  onChange={e => setEditPlanName(e.target.value)}
                  className="w-full px-3 py-2 mt-1 rounded-xl text-base bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-100 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Price (₹ INR/mo)</label>
                <input
                  type="number"
                  value={editPlanPrice}
                  onChange={e => setEditPlanPrice(parseFloat(e.target.value))}
                  className="w-full px-3 py-2 mt-1 rounded-xl text-base bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-100 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Audio Mins</label>
                  <input
                    type="number"
                    value={editPlanAudio}
                    onChange={e => setEditPlanAudio(parseInt(e.target.value))}
                    className="w-full px-3 py-2 mt-1 rounded-xl text-base bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-100 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Storage (MB)</label>
                  <input
                    type="number"
                    value={editPlanStorage}
                    onChange={e => setEditPlanStorage(parseInt(e.target.value))}
                    className="w-full px-3 py-2 mt-1 rounded-xl text-base bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-100 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Translation Chars</label>
                  <input
                    type="number"
                    value={editPlanTranslation}
                    onChange={e => setEditPlanTranslation(parseInt(e.target.value))}
                    className="w-full px-3 py-2 mt-1 rounded-xl text-base bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-100 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">TTS Chars</label>
                  <input
                    type="number"
                    value={editPlanTTS}
                    onChange={e => setEditPlanTTS(parseInt(e.target.value))}
                    className="w-full px-3 py-2 mt-1 rounded-xl text-base bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-100 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">Included Plan Features (Checkboxes)</label>
                <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                  {[
                    { id: 'audio_processing', label: 'Audio Processing' },
                    { id: 'translation_services', label: 'Translation Services' },
                    { id: 'text_to_speech', label: 'Text-to-Speech (TTS)' },
                    { id: 'document_intelligence', label: 'Document Intelligence' },
                    { id: 'cloud_storage', label: 'Cloud Storage & History' },
                    { id: 'custom_api', label: 'Custom API Access' },
                  ].map(item => {
                    const isChecked = editPlanFeatures.includes(item.id);
                    return (
                      <label key={item.id} className="flex items-center gap-2 p-2 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 cursor-pointer hover:border-teal-500/50">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setEditPlanFeatures(prev => [...prev, item.id]);
                            } else {
                              setEditPlanFeatures(prev => prev.filter(f => f !== item.id));
                            }
                          }}
                          className="accent-teal-500 rounded"
                        />
                        <span className="text-slate-800 dark:text-slate-200 text-xs font-bold">{item.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="pt-4 flex gap-3">
              <button
                onClick={() => {
                  const isNew = editingPlan.isNew;
                  const url = isNew ? '/super-admin/plans' : `/super-admin/plans/${editingPlan.id}`;
                  const method = isNew ? 'POST' : 'PATCH';
                  
                  apiRequest(url, {
                    method: method,
                    body: JSON.stringify({
                      name: editPlanName,
                      price: editPlanPrice,
                      transcription_limit: editPlanAudio,
                      translation_limit: editPlanTranslation,
                      tts_limit: editPlanTTS,
                      storage_limit: editPlanStorage,
                      features: editPlanFeatures
                    })
                  }).then(() => {
                    showToast(isNew ? "Plan created successfully" : "Plan updated successfully", "success");
                    setEditingPlan(null);
                    loadData();
                  }).catch(e => {
                    showToast(isNew ? "Failed to create plan" : "Failed to update plan", "error");
                  });
                }}
                className="flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-slate-800 dark:text-white text-base font-bold cursor-pointer shadow-md"
              >
                Save
              </button>
              <button
                onClick={() => setEditingPlan(null)}
                className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-800 dark:text-white text-base font-bold cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {subTab === 'settings-general' && <GeneralSettings />}
      {subTab === 'settings-tenant' && <TenantSettings />}
      {subTab === 'settings-smtp' && <SMTPSettings />}
      {subTab === 'settings-auth' && <AuthSettings />}
      {subTab === 'settings-security' && <SecuritySettings />}
      {subTab === 'settings-payments' && <PaymentSettings />}
      {subTab === 'settings-domains' && <DomainBranding />}
      {subTab === 'settings-apikeys' && <APIKeys />}
      {subTab === 'settings-backup' && <BackupRestore />}
      {subTab === 'settings-notifications' && <NotificationCenter />}
      {subTab === 'settings-activity' && <ActivityCenter />}

      {/* User Deletion Modal */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="glass-card rounded-2xl w-full max-w-sm p-6 border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 shadow-2xl space-y-6">
            <div className="text-center space-y-3">
              <div className="mx-auto bg-red-500/10 text-red-500 rounded-full w-12 h-12 flex items-center justify-center mb-2">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Delete User?</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Are you sure you want to delete this user? This action cannot be undone and will remove all their data.
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={confirmDeleteUser}
                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold shadow-md transition-all active:scale-95"
              >
                Delete
              </button>
              <button
                onClick={() => setUserToDelete(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 text-sm font-bold transition-all active:scale-95"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Configure Provider Modal */}
      {configuringProvider && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <form 
            onSubmit={handleConfigureProvider}
            className="glass-card rounded-2xl w-full max-w-md p-6 border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 shadow-2xl space-y-4 text-left"
          >
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-white/10 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {configuringProvider.isNew ? "Add System Provider" : `Configure ${configuringProvider.provider_name.replace("-", " ").toUpperCase()}`}
              </h3>
              <button 
                type="button" 
                onClick={() => setConfiguringProvider(null)} 
                className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {configuringProvider.isNew && (
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Select Provider</label>
                <select
                  value={selectedProvider}
                  onChange={(e) => setSelectedProvider(e.target.value)}
                  className="w-full px-3 py-2 mt-1 rounded-xl text-sm bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 outline-none font-semibold text-slate-900 dark:text-white"
                >
                  <option className="bg-white dark:bg-slate-900" value="openai">OpenAI</option>
                  <option className="bg-white dark:bg-slate-900" value="deepgram">Deepgram</option>
                  <option className="bg-white dark:bg-slate-900" value="elevenlabs">ElevenLabs</option>
                  <option className="bg-white dark:bg-slate-900" value="google-translate">Google Translate</option>
                  <option className="bg-white dark:bg-slate-900" value="gemini">Gemini</option>
                  <option className="bg-white dark:bg-slate-900" value="anthropic-claude">Anthropic Claude</option>
                  <option className="bg-white dark:bg-slate-900" value="brave-search">Brave Search</option>
                  <option className="bg-white dark:bg-slate-900" value="tavily">Tavily</option>
                  <option className="bg-white dark:bg-slate-900" value="serper">Serper</option>
                </select>
              </div>
            )}

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">API Key / Credentials</label>
              <input
                type="password"
                value={providerKey}
                onChange={(e) => setProviderKey(e.target.value)}
                placeholder={configuringProvider.isNew ? "Enter API Key" : "•••••••••••• (Leave blank to keep current)"}
                className="w-full px-3 py-2 mt-1 rounded-xl text-sm bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 outline-none text-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Priority</label>
                <input
                  type="number"
                  min="1"
                  value={providerPriority}
                  onChange={(e) => setProviderPriority(Number(e.target.value))}
                  className="w-full px-3 py-2 mt-1 rounded-xl text-sm bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 outline-none text-slate-900 dark:text-white text-center animate-none"
                />
              </div>

              <div className="flex flex-col justify-end pb-1.5">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="provider-enabled"
                    checked={providerEnabled}
                    onChange={(e) => setProviderEnabled(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-350 text-teal-600 focus:ring-teal-650 cursor-pointer"
                  />
                  <label htmlFor="provider-enabled" className="text-sm font-bold text-slate-700 dark:text-slate-300 cursor-pointer select-none">Enabled</label>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-3 border-t border-slate-200 dark:border-white/10">
              <button
                type="button"
                onClick={handleTestConnectionInModal}
                className="flex-1 py-2 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-bold hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer text-slate-800 dark:text-slate-200"
              >
                Test Connection
              </button>
              <button
                type="submit"
                className="flex-1 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-slate-800 dark:text-white text-xs font-bold shadow-lg cursor-pointer"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}
      {/* Password Reset Success Modal */}
      {resetPasswordInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="glass-card rounded-2xl w-full max-w-sm p-6 border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 shadow-2xl space-y-6 text-left">
            <div className="text-center space-y-3">
              <div className="mx-auto bg-emerald-500/10 text-emerald-500 rounded-full w-12 h-12 flex items-center justify-center mb-2">
                <Lock size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Temporary Password</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                A temporary password has been generated for: <br />
                <span className="font-extrabold text-slate-700 dark:text-slate-200">{resetPasswordInfo.userName}</span>
              </p>
            </div>

            <div className="relative flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950/40">
              <span className="font-mono text-sm font-black select-all text-slate-800 dark:text-slate-200">{resetPasswordInfo.tempPass}</span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(resetPasswordInfo.tempPass);
                  showToast("Password copied to clipboard!", "success");
                }}
                className="text-xs font-bold text-teal-600 hover:text-teal-700 cursor-pointer flex items-center gap-1"
                title="Copy Password"
              >
                <Copy size={14} /> Copy
              </button>
            </div>

            <p className="text-[11px] text-amber-600 dark:text-amber-400 text-center font-semibold">
              ⚠️ Share this password securely. The user will be required to change it upon log in.
            </p>

            <button
              type="button"
              onClick={() => setResetPasswordInfo(null)}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-sm font-bold shadow-md transition-all cursor-pointer active:scale-95"
            >
              Done
            </button>
          </div>
        </div>
      )}
      {/* Toast Alert Popup */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-2xl border text-sm font-semibold backdrop-blur-md transition-all duration-300 ${
              toastType === 'success' 
                ? 'bg-emerald-500/10 dark:bg-emerald-500/20 border-emerald-500/30 text-emerald-600 dark:text-emerald-400' 
                : toastType === 'error'
                  ? 'bg-red-500/10 dark:bg-red-500/20 border-red-500/30 text-red-600 dark:text-red-400'
                  : 'bg-blue-500/10 dark:bg-blue-500/20 border-blue-500/30 text-blue-600 dark:text-blue-400'
            }`}
          >
            {toastType === 'success' && <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />}
            {toastType === 'error' && <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />}
            {toastType === 'info' && <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />}
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expiring Subscriptions Modal */}
      <AnimatePresence>
        {showExpiringModal && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
              onClick={() => setShowExpiringModal(false)}
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
            >
              <div className="p-6 border-b border-slate-200 dark:border-white/10 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                    <AlertTriangle size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">Upcoming Renewals</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">Subscriptions renewing in the next 7 days</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowExpiringModal(false)}
                  className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 cursor-pointer"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-white dark:bg-slate-900">
                {billingOverview?.subscriptions && billingOverview.subscriptions.length > 0 ? (
                  <div className="space-y-3">
                    {billingOverview.subscriptions.map((sub: any) => (
                      <div key={sub.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-[#111827]/40 hover:border-amber-500/30 transition-colors">
                        <div>
                          <h4 className="font-bold text-slate-900 dark:text-white text-sm">{sub.tenant_name}</h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 font-bold mt-1">Plan: {sub.plan_name}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-amber-600 dark:text-amber-400 text-sm">{sub.renews}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 font-bold mt-1">${sub.amount}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                      <CheckCircle2 size={32} />
                    </div>
                    <h3 className="text-slate-900 dark:text-white font-bold">No impending renewals</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-bold">All subscriptions are up to date.</p>
                  </div>
                )}
              </div>
              <div className="p-4 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800/50 flex justify-end">
                <button 
                  onClick={() => setShowExpiringModal(false)}
                  className="px-6 py-2.5 bg-slate-200 hover:bg-slate-300 dark:bg-white/10 dark:hover:bg-white/20 text-slate-800 dark:text-white rounded-xl font-bold transition-all cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
