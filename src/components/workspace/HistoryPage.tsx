import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, ChevronDown, Trash2, Clock, History as HistoryIcon, Eye, Download, X } from 'lucide-react';
import type { HistoryItem } from '../../context/AppContext';

const TYPE_COLORS: Record<string, string> = {
  'translation': '#10b981',
  'audio-transcription': '#f59e0b',
  'text-to-speech': '#8b5cf6',
  'voice-to-text': '#3b82f6',
};

const TYPE_LABELS: Record<string, string> = {
  'translation': 'Translation',
  'audio-transcription': 'Audio to Text',
  'text-to-speech': 'Text to Voice',
  'voice-to-text': 'Transcription',
};

export function HistoryPage() {
  const { history, deleteHistoryItem, clearHistory } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [filterType, setFilterType] = useState('All');
  
  // State for the details modal
  const [viewingItem, setViewingItem] = useState<HistoryItem | null>(null);

  const filteredHistory = history.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All' || item.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedItems(filteredHistory.map(h => h.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedItems.length} items?`)) {
      selectedItems.forEach(id => deleteHistoryItem(id));
      setSelectedItems([]);
    }
  };

  const handleExportPDF = () => {
    window.print();
  };

  const renderMetadata = (details: string) => {
    let part1 = details;
    let part2 = '';
    
    if (details.includes(' • ')) {
      [part1, part2] = details.split(' • ');
    } else if (details.includes(' · ')) {
      [part1, part2] = details.split(' · ');
    } else if (details.toLowerCase().includes('words')) {
      // Just words
      return <span className="font-semibold text-teal-600 dark:text-teal-400">{details}</span>;
    }
    
    if (part2) {
      return (
        <div className="flex flex-col gap-1">
          <span className="truncate" title={part1}>{part1}</span>
          <span className="font-semibold text-teal-600 dark:text-teal-400">{part2}</span>
        </div>
      );
    }
    
    return <span className="truncate">{details}</span>;
  };

  return (
    <div className="w-full mx-auto animate-fadeIn flex flex-col h-full bg-[var(--bg-base)]">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8 print:hidden">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <HistoryIcon className="text-teal-500" size={24} />
            History & Records
          </h2>
          <p className="text-xs text-slate-500 mt-1">View and manage all your historical AI tool usage and records.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportPDF}
            className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-slate-700 px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 shadow-sm"
          >
            <Download size={16} />
            Export PDF
          </button>
          
          {history.length > 0 && (
             <button
               onClick={() => {
                 if(window.confirm('Are you sure you want to clear all history?')) clearHistory();
               }}
               className="bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
             >
               <Trash2 size={16} />
               Clear All
             </button>
          )}
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl flex-grow shadow-sm flex flex-col overflow-hidden">
        
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between p-4 border-b border-slate-200 dark:border-white/10 gap-4 print:hidden">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-slate-700 dark:text-slate-300">
              <input 
                type="checkbox" 
                className="rounded text-teal-500 focus:ring-teal-500 bg-slate-100 border-slate-300 w-4 h-4 cursor-pointer"
                checked={selectedItems.length === filteredHistory.length && filteredHistory.length > 0}
                onChange={handleSelectAll}
              />
              Select All
            </label>
            
            {selectedItems.length > 0 && (
              <button 
                onClick={handleDeleteSelected}
                className="text-xs font-semibold bg-red-50 text-red-600 px-3 py-1.5 rounded-md hover:bg-red-100 transition-colors"
              >
                Delete Selected ({selectedItems.length})
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search records..." 
                className="pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50 w-64 text-slate-800 dark:text-slate-200 placeholder:text-slate-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Filter */}
            <div className="relative">
              <select 
                className="appearance-none bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-lg py-2 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50 text-slate-800 dark:text-slate-200 font-medium cursor-pointer"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="All">All Types</option>
                {Object.keys(TYPE_LABELS).map(key => (
                  <option key={key} value={key}>{TYPE_LABELS[key]}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="flex-1 overflow-auto bg-white dark:bg-slate-900">
          <table className="w-full text-left text-sm border-collapse whitespace-nowrap">
            <thead className="sticky top-0 bg-slate-50/95 dark:bg-slate-800/95 backdrop-blur z-10 print:static print:bg-white">
              <tr className="border-b border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-bold">
                <th className="py-4 pl-4 pr-2 w-12 text-center print:hidden"></th>
                <th className="py-4 px-4 font-semibold">Type / Service</th>
                <th className="py-4 px-4 font-semibold">Details / Text</th>
                <th className="py-4 px-4 font-semibold">Metadata</th>
                <th className="py-4 px-4 font-semibold">Timestamp</th>
                <th className="py-4 px-4 text-center font-semibold print:hidden">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.map(item => {
                const isSelected = selectedItems.includes(item.id);
                const color = TYPE_COLORS[item.type] || '#94a3b8';
                const label = TYPE_LABELS[item.type] || item.type;
                
                return (
                  <tr 
                    key={item.id} 
                    className={`border-b border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${isSelected ? 'bg-teal-50/50 dark:bg-teal-900/10' : ''} print:border-slate-300 print:text-black`}
                  >
                    <td className="py-4 pl-4 pr-2 text-center print:hidden">
                      <input 
                        type="checkbox" 
                        className="rounded text-teal-500 focus:ring-teal-500 bg-slate-100 border-slate-300 w-4 h-4 cursor-pointer"
                        checked={isSelected}
                        onChange={() => handleSelectItem(item.id)}
                      />
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className="inline-flex items-center justify-center text-[11px] rounded-md px-2.5 py-1 font-bold tracking-wide print:border print:border-gray-400 print:text-black"
                        style={{
                          background: `color-mix(in srgb, ${color} 12%, transparent)`,
                          color: color,
                          border: `1px solid color-mix(in srgb, ${color} 25%, transparent)`,
                        }}
                      >
                        {label}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-medium text-slate-800 dark:text-slate-200 max-w-[200px] truncate print:max-w-none print:whitespace-normal print:text-black">
                      {item.title}
                    </td>
                    <td className="py-4 px-4 text-slate-500 dark:text-slate-400 text-xs font-mono max-w-[300px] print:max-w-none print:whitespace-normal print:text-black">
                      {renderMetadata(item.details)}
                    </td>
                    <td className="py-4 px-4 text-slate-500 dark:text-slate-400 flex items-center gap-1.5 text-xs print:text-black">
                      <Clock size={14} className="text-slate-400 print:hidden" />
                      {item.timestamp}
                    </td>
                    <td className="py-4 px-4 text-center print:hidden">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          className="p-1.5 text-slate-400 hover:text-teal-500 hover:bg-teal-50 dark:hover:bg-teal-500/10 rounded-md transition-colors"
                          onClick={() => setViewingItem(item)}
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md transition-colors"
                          onClick={() => deleteHistoryItem(item.id)}
                          title="Delete Record"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              
              {filteredHistory.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
                      <HistoryIcon size={48} className="mb-4 opacity-20" />
                      <p className="text-base font-semibold text-slate-600 dark:text-slate-400">No records found</p>
                      <p className="text-sm mt-1">Your generated content history will appear here.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details View Modal */}
      {viewingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm print:hidden animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-white/10">
              <div className="flex items-center gap-3">
                <span
                  className="inline-flex items-center justify-center text-[11px] rounded-md px-2.5 py-1 font-bold tracking-wide"
                  style={{
                    background: `color-mix(in srgb, ${TYPE_COLORS[viewingItem.type] || '#94a3b8'} 12%, transparent)`,
                    color: TYPE_COLORS[viewingItem.type] || '#94a3b8',
                    border: `1px solid color-mix(in srgb, ${TYPE_COLORS[viewingItem.type] || '#94a3b8'} 25%, transparent)`,
                  }}
                >
                  {TYPE_LABELS[viewingItem.type] || viewingItem.type}
                </span>
                <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Clock size={14} /> {viewingItem.timestamp}
                </span>
              </div>
              <button 
                onClick={() => setViewingItem(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Generated Content / Title</h4>
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 border border-slate-200 dark:border-white/5">
                  <p className="text-slate-800 dark:text-slate-200 whitespace-pre-wrap font-medium">
                    {viewingItem.content || viewingItem.title}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Metadata Details</h4>
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 border border-slate-200 dark:border-white/5">
                  <p className="text-slate-600 dark:text-slate-300 font-mono text-sm">
                    {viewingItem.details}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-slate-200 dark:border-white/10 flex justify-end">
              <button 
                onClick={() => setViewingItem(null)}
                className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
