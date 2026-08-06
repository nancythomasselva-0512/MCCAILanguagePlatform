import React, { useState, useEffect, useCallback } from 'react';
import { apiRequest } from '../../../utils/api';
import {
  Activity, AlertTriangle, CheckCircle2, XCircle, RefreshCw,
  Zap, Shield, Clock, ChevronDown, ChevronUp, Play, RotateCcw,
  ToggleLeft, ToggleRight, ArrowUpDown, Filter, Download
} from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────

interface ProviderHealth {
  name: string;
  display_name: string;
  capability: string;
  priority: number;
  health: 'Healthy' | 'No Key' | 'Circuit Open' | 'Probing';
  has_key: boolean;
  circuit_state: 'closed' | 'open' | 'half_open';
  failure_count: number;
  cooldown_remaining_seconds: number;
  opened_at: string | null;
  notes: string;
}

interface ProviderLogEntry {
  id: string;
  provider: string;
  feature: string;
  status: 'success' | 'failed' | 'skipped';
  error_code: string | null;
  error_message: string | null;
  response_time_ms: number;
  retry_count: number;
  fallback: boolean;
  created_at: string | null;
}

// ── Health Badge ──────────────────────────────────────────────────────────

const HealthBadge: React.FC<{ health: string }> = ({ health }) => {
  const cfg: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
    'Healthy':      { bg: 'bg-emerald-500/20 border border-emerald-500/40', text: 'text-emerald-400', icon: <CheckCircle2 size={12} /> },
    'No Key':       { bg: 'bg-amber-500/20 border border-amber-500/40',     text: 'text-amber-400',   icon: <AlertTriangle size={12} /> },
    'Circuit Open': { bg: 'bg-red-500/20 border border-red-500/40',         text: 'text-red-400',     icon: <XCircle size={12} /> },
    'Probing':      { bg: 'bg-blue-500/20 border border-blue-500/40',       text: 'text-blue-400',    icon: <Activity size={12} className="animate-pulse" /> },
  };
  const c = cfg[health] || cfg['No Key'];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${c.bg} ${c.text}`}>
      {c.icon} {health}
    </span>
  );
};

// ── Capability Badge ──────────────────────────────────────────────────────

const CapabilityBadge: React.FC<{ capability: string }> = ({ capability }) => {
  const cfg: Record<string, string> = {
    llm: 'bg-violet-500/20 text-violet-300 border border-violet-500/30',
    stt: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
    tts: 'bg-pink-500/20 text-pink-300 border border-pink-500/30',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wide ${cfg[capability] || 'bg-slate-700 text-slate-300'}`}>
      {capability === 'llm' ? '🧠 LLM' : capability === 'stt' ? '🎙️ STT' : '🔊 TTS'}
    </span>
  );
};

// ── Provider Card ─────────────────────────────────────────────────────────

const ProviderCard: React.FC<{
  provider: ProviderHealth;
  onTest: (name: string) => void;
  onReset: (name: string) => void;
  testing: boolean;
  testResult: { success: boolean; detail?: string; error?: string; response_time_ms?: number } | null;
}> = ({ provider, onTest, onReset, testing, testResult }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`rounded-xl border transition-all duration-200 ${
      provider.health === 'Healthy'
        ? 'bg-slate-800/60 border-slate-700/60 hover:border-emerald-500/30'
        : provider.health === 'Circuit Open'
        ? 'bg-red-950/30 border-red-800/50'
        : 'bg-slate-800/60 border-slate-700/60 hover:border-amber-500/30'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${
            provider.health === 'Healthy' ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)] animate-pulse' :
            provider.health === 'Circuit Open' ? 'bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.6)]' :
            provider.health === 'Probing' ? 'bg-blue-400 animate-pulse' :
            'bg-amber-400'
          }`} />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-white font-semibold text-sm">{provider.display_name}</span>
              <CapabilityBadge capability={provider.capability} />
            </div>
            <div className="text-slate-400 text-xs mt-0.5 font-mono">{provider.name}</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right mr-2">
            <HealthBadge health={provider.health} />
            <div className="text-slate-500 text-xs mt-1">Priority {provider.priority}</div>
          </div>

          {/* Test button */}
          <button
            onClick={() => onTest(provider.name)}
            disabled={testing}
            className="flex items-center gap-1 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs rounded-lg transition-colors disabled:opacity-50"
          >
            {testing ? <RefreshCw size={11} className="animate-spin" /> : <Play size={11} />}
            Test
          </button>

          {/* Reset circuit button */}
          {provider.circuit_state !== 'closed' && (
            <button
              onClick={() => onReset(provider.name)}
              className="flex items-center gap-1 px-3 py-1.5 bg-orange-600/20 hover:bg-orange-600/40 text-orange-300 text-xs rounded-lg border border-orange-500/30 transition-colors"
            >
              <RotateCcw size={11} /> Reset CB
            </button>
          )}

          <button onClick={() => setExpanded(e => !e)} className="text-slate-500 hover:text-slate-300 p-1">
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
      </div>

      {/* Circuit breaker warning */}
      {provider.circuit_state === 'open' && (
        <div className="mx-4 mb-3 px-3 py-2 bg-red-900/30 border border-red-700/40 rounded-lg flex items-center gap-2 text-red-300 text-xs">
          <Shield size={12} />
          <span>Circuit breaker OPEN — {provider.failure_count} failures. Cooldown: {provider.cooldown_remaining_seconds}s remaining</span>
        </div>
      )}

      {/* Test result */}
      {testResult && (
        <div className={`mx-4 mb-3 px-3 py-2 rounded-lg text-xs flex items-start gap-2 ${
          testResult.success
            ? 'bg-emerald-900/30 border border-emerald-700/40 text-emerald-300'
            : 'bg-red-900/30 border border-red-700/40 text-red-300'
        }`}>
          {testResult.success ? <CheckCircle2 size={12} className="mt-0.5 shrink-0" /> : <XCircle size={12} className="mt-0.5 shrink-0" />}
          <span>
            {testResult.success
              ? `✓ Connected — ${testResult.response_time_ms}ms${testResult.detail ? ` · ${testResult.detail}` : ''}`
              : `✗ Failed — ${testResult.error}`
            }
          </span>
        </div>
      )}

      {/* Expanded details */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-slate-700/50 pt-3 space-y-2">
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-900/50 rounded-lg p-2">
              <div className="text-slate-500 text-xs">CB State</div>
              <div className="text-white text-sm font-medium capitalize">{provider.circuit_state.replace('_', ' ')}</div>
            </div>
            <div className="bg-slate-900/50 rounded-lg p-2">
              <div className="text-slate-500 text-xs">Failures</div>
              <div className={`text-sm font-medium ${provider.failure_count > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                {provider.failure_count}
              </div>
            </div>
            <div className="bg-slate-900/50 rounded-lg p-2">
              <div className="text-slate-500 text-xs">API Key</div>
              <div className={`text-sm font-medium ${provider.has_key ? 'text-emerald-400' : 'text-amber-400'}`}>
                {provider.has_key ? '✓ Set' : '✗ Missing'}
              </div>
            </div>
          </div>
          {provider.notes && (
            <div className="text-slate-400 text-xs bg-slate-900/30 rounded px-3 py-2">{provider.notes}</div>
          )}
        </div>
      )}
    </div>
  );
};

// ── Provider Logs Table ───────────────────────────────────────────────────

const ProviderLogsTable: React.FC<{ logs: ProviderLogEntry[] }> = ({ logs }) => {
  if (logs.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500">
        <Activity size={32} className="mx-auto mb-3 opacity-30" />
        <p>No provider logs yet. Logs appear after the first AI request.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-slate-400 text-xs uppercase tracking-wider border-b border-slate-700/50">
            <th className="text-left py-3 px-3">Provider</th>
            <th className="text-left py-3 px-3">Feature</th>
            <th className="text-left py-3 px-3">Status</th>
            <th className="text-left py-3 px-3">Time</th>
            <th className="text-left py-3 px-3">Retries</th>
            <th className="text-left py-3 px-3">Fallback</th>
            <th className="text-left py-3 px-3">Error</th>
            <th className="text-left py-3 px-3">When</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60">
          {logs.map(log => (
            <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
              <td className="py-2.5 px-3">
                <span className="font-mono text-xs text-violet-300 bg-violet-900/30 px-2 py-0.5 rounded">{log.provider}</span>
              </td>
              <td className="py-2.5 px-3 text-slate-300 text-xs">{log.feature}</td>
              <td className="py-2.5 px-3">
                {log.status === 'success' && <span className="text-emerald-400 text-xs flex items-center gap-1"><CheckCircle2 size={10} /> success</span>}
                {log.status === 'failed'  && <span className="text-red-400 text-xs flex items-center gap-1"><XCircle size={10} /> failed</span>}
                {log.status === 'skipped' && <span className="text-slate-400 text-xs flex items-center gap-1">— skipped</span>}
              </td>
              <td className="py-2.5 px-3 text-slate-300 text-xs">
                <span className={log.response_time_ms > 2000 ? 'text-amber-400' : ''}>{log.response_time_ms}ms</span>
              </td>
              <td className="py-2.5 px-3 text-slate-400 text-xs">{log.retry_count}</td>
              <td className="py-2.5 px-3 text-xs">
                {log.fallback ? <span className="text-amber-400">⚡ Yes</span> : <span className="text-slate-500">—</span>}
              </td>
              <td className="py-2.5 px-3 text-xs text-red-400 max-w-[200px] truncate" title={log.error_message || ''}>
                {log.error_message ? `[${log.error_code}] ${log.error_message.slice(0, 60)}...` : '—'}
              </td>
              <td className="py-2.5 px-3 text-slate-500 text-xs">
                {log.created_at ? new Date(log.created_at).toLocaleTimeString() : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────

export const ProviderManager: React.FC = () => {
  const [providers, setProviders] = useState<ProviderHealth[]>([]);
  const [logs, setLogs] = useState<ProviderLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [logsLoading, setLogsLoading] = useState(false);
  const [testingProvider, setTestingProvider] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<Record<string, any>>({});
  const [activeView, setActiveView] = useState<'health' | 'logs'>('health');
  const [filterCapability, setFilterCapability] = useState<string>('all');
  const [logFilter, setLogFilter] = useState<'all' | 'success' | 'failed'>('all');

  // ── Load providers health ──────────────────────────────────────────────
  const loadHealth = useCallback(async () => {
    try {
      const data = await apiRequest('/super-admin/providers/health');
      setProviders(data);
    } catch (e) {
      console.error('Failed to load provider health', e);
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Load logs ──────────────────────────────────────────────────────────
  const loadLogs = useCallback(async () => {
    setLogsLoading(true);
    try {
      const params = logFilter !== 'all' ? `?status=${logFilter}&limit=200` : '?limit=200';
      const data = await apiRequest(`/super-admin/providers/logs${params}`);
      setLogs(data);
    } catch (e) {
      console.error('Failed to load provider logs', e);
    } finally {
      setLogsLoading(false);
    }
  }, [logFilter]);

  useEffect(() => { loadHealth(); }, [loadHealth]);
  useEffect(() => { if (activeView === 'logs') loadLogs(); }, [activeView, loadLogs]);

  // ── Test provider ──────────────────────────────────────────────────────
  const handleTest = async (name: string) => {
    setTestingProvider(name);
    setTestResults(r => ({ ...r, [name]: null }));
    try {
      const result = await apiRequest(`/super-admin/providers/${name}/test`, { method: 'POST' });
      setTestResults(r => ({ ...r, [name]: result }));
      // Refresh health after test
      setTimeout(loadHealth, 1000);
    } catch (e: any) {
      setTestResults(r => ({ ...r, [name]: { success: false, error: e.message } }));
    } finally {
      setTestingProvider(null);
    }
  };

  // ── Reset circuit breaker ──────────────────────────────────────────────
  const handleReset = async (name: string) => {
    try {
      await apiRequest(`/super-admin/providers/${name}/reset-circuit`, { method: 'POST' });
      await loadHealth();
    } catch (e) {
      console.error('Reset failed', e);
    }
  };

  // ── Filter providers ───────────────────────────────────────────────────
  const filteredProviders = filterCapability === 'all'
    ? providers
    : providers.filter(p => p.capability === filterCapability);

  // ── Summary stats ──────────────────────────────────────────────────────
  const stats = {
    total:   providers.length,
    healthy: providers.filter(p => p.health === 'Healthy').length,
    open:    providers.filter(p => p.circuit_state === 'open').length,
    noKey:   providers.filter(p => !p.has_key).length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Zap className="text-violet-400" size={20} />
            AI Provider Failover Manager
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Real-time health monitoring, circuit breakers, and fallback chain management
          </p>
        </div>
        <button
          onClick={loadHealth}
          className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm rounded-lg transition-colors"
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Providers', value: stats.total, color: 'text-white', icon: <Activity size={16} className="text-violet-400" /> },
          { label: 'Healthy',         value: stats.healthy, color: 'text-emerald-400', icon: <CheckCircle2 size={16} className="text-emerald-400" /> },
          { label: 'Circuit Open',    value: stats.open,    color: 'text-red-400',     icon: <Shield size={16} className="text-red-400" /> },
          { label: 'Missing Key',     value: stats.noKey,   color: 'text-amber-400',   icon: <AlertTriangle size={16} className="text-amber-400" /> },
        ].map(s => (
          <div key={s.label} className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 flex items-center gap-3">
            {s.icon}
            <div>
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-slate-400 text-xs">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* View Toggle */}
      <div className="flex items-center gap-2 border-b border-slate-700/50 pb-4">
        {(['health', 'logs'] as const).map(v => (
          <button
            key={v}
            onClick={() => setActiveView(v)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeView === v
                ? 'bg-violet-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {v === 'health' ? '🛡️ Health Monitor' : '📋 Call Logs'}
          </button>
        ))}

        {activeView === 'health' && (
          <div className="ml-auto flex items-center gap-2">
            <Filter size={14} className="text-slate-400" />
            {(['all', 'llm', 'stt', 'tts'] as const).map(cap => (
              <button
                key={cap}
                onClick={() => setFilterCapability(cap)}
                className={`px-3 py-1 rounded-lg text-xs transition-colors ${
                  filterCapability === cap
                    ? 'bg-slate-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {cap === 'all' ? 'All' : cap.toUpperCase()}
              </button>
            ))}
          </div>
        )}

        {activeView === 'logs' && (
          <div className="ml-auto flex items-center gap-2">
            {(['all', 'success', 'failed'] as const).map(f => (
              <button
                key={f}
                onClick={() => setLogFilter(f)}
                className={`px-3 py-1 rounded-lg text-xs transition-colors ${
                  logFilter === f
                    ? 'bg-slate-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Health View */}
      {activeView === 'health' && (
        <div className="space-y-3">
          {loading ? (
            <div className="text-center py-16 text-slate-400">
              <RefreshCw size={28} className="mx-auto animate-spin mb-3 opacity-50" />
              Loading provider health...
            </div>
          ) : filteredProviders.length === 0 ? (
            <div className="text-center py-12 text-slate-500">No providers found.</div>
          ) : (
            filteredProviders.map(p => (
              <ProviderCard
                key={p.name}
                provider={p}
                onTest={handleTest}
                onReset={handleReset}
                testing={testingProvider === p.name}
                testResult={testResults[p.name] ?? null}
              />
            ))
          )}
        </div>
      )}

      {/* Logs View */}
      {activeView === 'logs' && (
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-700/50 flex items-center justify-between">
            <span className="text-white font-medium text-sm">Provider Call Logs</span>
            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-xs">{logs.length} entries</span>
              <button
                onClick={loadLogs}
                disabled={logsLoading}
                className="flex items-center gap-1 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-xs text-slate-200 rounded-lg transition-colors"
              >
                <RefreshCw size={11} className={logsLoading ? 'animate-spin' : ''} />
                Reload
              </button>
            </div>
          </div>
          {logsLoading ? (
            <div className="text-center py-12 text-slate-400">
              <RefreshCw size={24} className="mx-auto animate-spin mb-2 opacity-40" />
              Loading logs...
            </div>
          ) : (
            <ProviderLogsTable logs={logs} />
          )}
        </div>
      )}

      {/* Failover Chain Diagram */}
      {activeView === 'health' && (
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5">
          <h3 className="text-white font-semibold text-sm mb-4 flex items-center gap-2">
            <ArrowUpDown size={14} className="text-violet-400" />
            Failover Chain (by capability)
          </h3>
          {(['llm', 'stt', 'tts'] as const).map(cap => {
            const chain = providers.filter(p => p.capability === cap).sort((a, b) => a.priority - b.priority);
            return (
              <div key={cap} className="mb-4 last:mb-0">
                <div className="text-slate-400 text-xs font-medium uppercase tracking-widest mb-2">
                  {cap === 'llm' ? '🧠 Language Model' : cap === 'stt' ? '🎙️ Speech-to-Text' : '🔊 Text-to-Speech'}
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {chain.map((p, i) => (
                    <React.Fragment key={p.name}>
                      <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs ${
                        p.health === 'Healthy'      ? 'bg-emerald-900/20 border-emerald-700/40 text-emerald-300' :
                        p.circuit_state === 'open'  ? 'bg-red-900/20 border-red-700/40 text-red-300 opacity-50' :
                                                      'bg-amber-900/20 border-amber-700/40 text-amber-300'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          p.health === 'Healthy' ? 'bg-emerald-400' :
                          p.circuit_state === 'open' ? 'bg-red-400' : 'bg-amber-400'
                        }`} />
                        <span className="font-medium">{p.display_name}</span>
                        <span className="text-slate-500">#{p.priority}</span>
                      </div>
                      {i < chain.length - 1 && (
                        <span className="text-slate-600 text-lg">→</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
