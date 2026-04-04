'use client';

import { useState, useEffect, useMemo } from 'react';
import { seedFeedback, feedbackCategories, type FeedbackItem, type FeedbackStatus } from '@/data/feedback';

const STORAGE_KEY = 'ehs-schoolvoice-feedback';
const ADMIN_PW = 'ehsadmin2025';

function loadFeedback(): FeedbackItem[] {
  if (typeof window === 'undefined') return seedFeedback;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return seedFeedback;
}

function saveFeedback(items: FeedbackItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {}
}

const statusConfig: Record<FeedbackStatus, { label: string; color: string; bgClass: string }> = {
  pending: { label: 'Pending', color: '#6b6860', bgClass: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400' },
  acknowledged: { label: 'Acknowledged', color: '#c8a84b', bgClass: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400' },
  resolved: { label: 'Resolved', color: '#1a5c38', bgClass: 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400' },
};

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${diffDays >= 14 ? 's' : ''} ago`;
  return `${Math.floor(diffDays / 30)} month${diffDays >= 60 ? 's' : ''} ago`;
}

function AdminFeedbackCard({
  item,
  onUpdateStatus,
  onAddNote,
}: {
  item: FeedbackItem;
  onUpdateStatus: (id: string, status: FeedbackStatus) => void;
  onAddNote: (id: string, note: string) => void;
}) {
  const [editingNote, setEditingNote] = useState(false);
  const [noteText, setNoteText] = useState(item.adminNote || '');
  const [expanded, setExpanded] = useState(false);

  const handleSaveNote = () => {
    onAddNote(item.id, noteText);
    setEditingNote(false);
  };

  return (
    <div className={`bg-white dark:bg-[#1a2820] border transition-all ${
      item.status === 'pending'
        ? 'border-[#d8d4cc] dark:border-[#2a3530]'
        : item.status === 'acknowledged'
        ? 'border-[#c8a84b]/40'
        : 'border-[#1a5c38]/30'
    }`}>
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-dm-mono text-[10px] uppercase tracking-wider px-2 py-0.5 border border-[#d8d4cc] dark:border-[#2a3530] text-[#6b6860]">
              {item.category}
            </span>
            <span className={`font-dm-mono text-[10px] uppercase tracking-wider px-2 py-0.5 ${statusConfig[item.status].bgClass}`}>
              {statusConfig[item.status].label}
            </span>
            <span className="font-dm-mono text-[10px] text-[#6b6860]">{timeAgo(item.submittedAt)}</span>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-[#6b6860] hover:text-[#0f0f0f] dark:hover:text-[#f0ede8] transition-colors flex-shrink-0"
          >
            <svg className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        <p className="font-dm-sans text-sm text-[#0f0f0f] dark:text-[#f0ede8] leading-relaxed">{item.message}</p>

        {/* Admin note preview */}
        {item.adminNote && !expanded && (
          <div className="mt-3 border-l-2 border-[#1a5c38] pl-3">
            <div className="font-dm-mono text-[10px] uppercase tracking-wider text-[#1a5c38] mb-0.5">Your Note</div>
            <p className="font-dm-sans text-xs text-[#6b6860] line-clamp-2">{item.adminNote}</p>
          </div>
        )}
      </div>

      {/* Expanded admin panel */}
      {expanded && (
        <div className="border-t border-[#d8d4cc] dark:border-[#2a3530] p-4 bg-[#f7f5f0] dark:bg-[#0f1a13]">
          {/* Status controls */}
          <div className="mb-4">
            <div className="font-dm-mono text-xs uppercase tracking-wider text-[#6b6860] mb-2">Update Status</div>
            <div className="flex gap-2">
              {(['pending', 'acknowledged', 'resolved'] as FeedbackStatus[]).map(s => (
                <button
                  key={s}
                  onClick={() => onUpdateStatus(item.id, s)}
                  className={`px-3 py-1.5 text-xs font-dm-mono border transition-all ${
                    item.status === s
                      ? 'bg-[#1a5c38] text-white border-[#1a5c38]'
                      : 'border-[#d8d4cc] dark:border-[#2a3530] text-[#6b6860] hover:border-[#1a5c38] bg-white dark:bg-[#1a2820]'
                  }`}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Admin note */}
          <div>
            <div className="font-dm-mono text-xs uppercase tracking-wider text-[#6b6860] mb-2">Admin Response (visible to students)</div>
            {editingNote ? (
              <div>
                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  rows={3}
                  className="w-full p-2 border border-[#d8d4cc] dark:border-[#2a3530] bg-white dark:bg-[#1a2820] text-[#0f0f0f] dark:text-[#f0ede8] font-dm-sans text-sm focus:outline-none focus:border-[#1a5c38] resize-none"
                  placeholder="Write a response that will be shown publicly next to this feedback..."
                />
                <div className="flex gap-2 mt-2">
                  <button onClick={handleSaveNote} className="px-3 py-1.5 bg-[#1a5c38] text-white text-xs font-dm-mono hover:bg-[#134429] transition-colors">
                    Save Note
                  </button>
                  <button onClick={() => { setEditingNote(false); setNoteText(item.adminNote || ''); }} className="px-3 py-1.5 border border-[#d8d4cc] dark:border-[#2a3530] text-xs font-dm-mono text-[#6b6860] hover:bg-white dark:hover:bg-[#1a2820] transition-colors">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                {item.adminNote ? (
                  <div className="border-l-2 border-[#1a5c38] pl-3 mb-2">
                    <p className="font-dm-sans text-sm text-[#0f0f0f] dark:text-[#f0ede8]">{item.adminNote}</p>
                    {item.resolvedAt && <div className="font-dm-mono text-[10px] text-[#6b6860] mt-1">Resolved {timeAgo(item.resolvedAt)}</div>}
                  </div>
                ) : (
                  <p className="font-dm-sans text-xs text-[#6b6860] italic mb-2">No response added yet.</p>
                )}
                <button
                  onClick={() => setEditingNote(true)}
                  className="px-3 py-1.5 border border-[#d8d4cc] dark:border-[#2a3530] text-xs font-dm-mono text-[#6b6860] hover:border-[#1a5c38] hover:text-[#1a5c38] transition-colors"
                >
                  {item.adminNote ? 'Edit Response' : '+ Add Response'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [statusFilter, setStatusFilter] = useState<FeedbackStatus | 'All'>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('ehs-dark-mode');
    if (stored === 'true') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
    const authStored = localStorage.getItem('ehs-admin-auth');
    if (authStored === 'true') {
      setAuthenticated(true);
      setFeedback(loadFeedback());
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PW) {
      setAuthenticated(true);
      setError('');
      localStorage.setItem('ehs-admin-auth', 'true');
      setFeedback(loadFeedback());
    } else {
      setError('Incorrect password. Please try again.');
    }
  };

  const handleLogout = () => {
    setAuthenticated(false);
    localStorage.removeItem('ehs-admin-auth');
    setPassword('');
  };

  const updateStatus = (id: string, status: FeedbackStatus) => {
    const updated = feedback.map(f => {
      if (f.id !== id) return f;
      return {
        ...f,
        status,
        resolvedAt: status === 'resolved' ? new Date().toISOString() : f.resolvedAt,
      };
    });
    setFeedback(updated);
    saveFeedback(updated);
  };

  const addNote = (id: string, note: string) => {
    const updated = feedback.map(f => f.id === id ? { ...f, adminNote: note } : f);
    setFeedback(updated);
    saveFeedback(updated);
  };

  const resetToSeed = () => {
    if (confirm('This will reset all feedback to seed data. Continue?')) {
      saveFeedback(seedFeedback);
      setFeedback(seedFeedback);
    }
  };

  const filtered = useMemo(() => {
    return feedback.filter(f => {
      const matchesStatus = statusFilter === 'All' || f.status === statusFilter;
      const matchesCat = categoryFilter === 'All' || f.category === categoryFilter;
      const matchesSearch = search === '' || f.message.toLowerCase().includes(search.toLowerCase());
      return matchesStatus && matchesCat && matchesSearch;
    });
  }, [feedback, statusFilter, categoryFilter, search]);

  const stats = useMemo(() => ({
    total: feedback.length,
    pending: feedback.filter(f => f.status === 'pending').length,
    acknowledged: feedback.filter(f => f.status === 'acknowledged').length,
    resolved: feedback.filter(f => f.status === 'resolved').length,
  }), [feedback]);

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#f7f5f0] dark:bg-[#0f1a13] flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-[#1a5c38] flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-syne font-bold">EHS</span>
            </div>
            <h1 className="font-syne font-bold text-2xl text-[#0f0f0f] dark:text-[#f0ede8]">Admin Portal</h1>
            <p className="font-dm-sans text-sm text-[#6b6860] mt-1">SchoolVoice Management</p>
          </div>

          <form onSubmit={handleLogin} className="bg-white dark:bg-[#1a2820] border border-[#d8d4cc] dark:border-[#2a3530] p-6">
            <div className="mb-4">
              <label className="block font-dm-mono text-xs uppercase tracking-wider text-[#6b6860] mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full px-3 py-2.5 border border-[#d8d4cc] dark:border-[#2a3530] bg-[#f7f5f0] dark:bg-[#0f1a13] text-[#0f0f0f] dark:text-[#f0ede8] placeholder-[#6b6860] focus:outline-none focus:border-[#1a5c38] font-dm-sans text-sm"
                autoFocus
              />
              {error && <p className="font-dm-sans text-xs text-red-500 mt-2">{error}</p>}
            </div>
            <button type="submit" className="w-full py-2.5 bg-[#1a5c38] text-white font-dm-sans font-medium hover:bg-[#134429] transition-colors">
              Sign In
            </button>
          </form>

          <div className="text-center mt-4">
            <a href="/" className="font-dm-mono text-xs text-[#6b6860] hover:text-[#1a5c38] transition-colors">← Back to Student Portal</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f5f0] dark:bg-[#0f1a13]">
      {/* Admin header */}
      <header className="bg-[#1a5c38] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#c8a84b] flex items-center justify-center">
            <span className="text-[#1a5c38] font-syne font-bold text-xs">EHS</span>
          </div>
          <div>
            <div className="font-syne font-bold text-white text-sm">Admin Dashboard</div>
            <div className="font-dm-mono text-[10px] text-white/50 uppercase tracking-wider">SchoolVoice Management</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <a href="/" className="font-dm-mono text-xs text-white/60 hover:text-white transition-colors">← Student Portal</a>
          <button onClick={handleLogout} className="px-3 py-1.5 border border-white/20 text-xs font-dm-mono text-white/70 hover:bg-white/10 transition-colors">
            Sign Out
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: 'Total', value: stats.total, color: '#0f0f0f' },
            { label: 'Pending', value: stats.pending, color: '#6b6860' },
            { label: 'Acknowledged', value: stats.acknowledged, color: '#c8a84b' },
            { label: 'Resolved', value: stats.resolved, color: '#1a5c38' },
          ].map(stat => (
            <div key={stat.label} className="bg-white dark:bg-[#1a2820] border border-[#d8d4cc] dark:border-[#2a3530] p-4">
              <div className="font-syne font-bold text-2xl" style={{ color: stat.color }}>{stat.value}</div>
              <div className="font-dm-mono text-[10px] uppercase tracking-wider text-[#6b6860] mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Resolution rate */}
        <div className="bg-white dark:bg-[#1a2820] border border-[#d8d4cc] dark:border-[#2a3530] p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="font-dm-mono text-xs uppercase tracking-wider text-[#6b6860]">Resolution Rate</span>
            <span className="font-dm-mono text-sm font-medium text-[#1a5c38]">
              {stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0}%
            </span>
          </div>
          <div className="h-2 bg-[#f7f5f0] dark:bg-[#0f1a13]">
            <div
              className="h-full bg-[#1a5c38] transition-all"
              style={{ width: `${stats.total > 0 ? (stats.resolved / stats.total) * 100 : 0}%` }}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="flex-1 relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b6860]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search feedback..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-[#d8d4cc] dark:border-[#2a3530] bg-white dark:bg-[#1a2820] text-[#0f0f0f] dark:text-[#f0ede8] placeholder-[#6b6860] focus:outline-none focus:border-[#1a5c38] font-dm-sans text-sm"
            />
          </div>
          <button onClick={resetToSeed} className="px-4 py-2 border border-[#d8d4cc] dark:border-[#2a3530] text-xs font-dm-mono text-[#6b6860] hover:border-red-400 hover:text-red-500 transition-colors bg-white dark:bg-[#1a2820]">
            Reset to Seed Data
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-4">
          {(['All', 'pending', 'acknowledged', 'resolved'] as const).map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 text-xs font-dm-mono border transition-all ${
                statusFilter === s
                  ? 'bg-[#1a5c38] text-white border-[#1a5c38]'
                  : 'border-[#d8d4cc] dark:border-[#2a3530] text-[#6b6860] bg-white dark:bg-[#1a2820] hover:border-[#1a5c38]'
              }`}
            >
              {s === 'All' ? `All (${stats.total})` : `${s.charAt(0).toUpperCase() + s.slice(1)} (${stats[s as keyof typeof stats]})`}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setCategoryFilter('All')}
            className={`px-2.5 py-1 text-xs font-dm-mono border transition-all ${categoryFilter === 'All' ? 'bg-[#1a5c38] text-white border-[#1a5c38]' : 'border-[#d8d4cc] dark:border-[#2a3530] text-[#6b6860] bg-white dark:bg-[#1a2820]'}`}
          >
            All Categories
          </button>
          {feedbackCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-2.5 py-1 text-xs font-dm-mono border transition-all ${categoryFilter === cat ? 'bg-[#1a5c38] text-white border-[#1a5c38]' : 'border-[#d8d4cc] dark:border-[#2a3530] text-[#6b6860] bg-white dark:bg-[#1a2820]'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="font-dm-mono text-xs text-[#6b6860] mb-4">
          Showing {filtered.length} of {feedback.length} submissions
        </div>

        {/* Feedback list */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="bg-white dark:bg-[#1a2820] border border-[#d8d4cc] dark:border-[#2a3530] p-12 text-center">
              <div className="font-syne font-bold text-lg text-[#0f0f0f] dark:text-[#f0ede8] mb-2">No submissions found</div>
            </div>
          ) : (
            filtered.map(item => (
              <AdminFeedbackCard
                key={item.id}
                item={item}
                onUpdateStatus={updateStatus}
                onAddNote={addNote}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
