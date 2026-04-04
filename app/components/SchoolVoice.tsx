'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import { seedFeedback, feedbackCategories, type FeedbackItem, type FeedbackCategory, type FeedbackStatus } from '@/data/feedback';

const CATEGORY_COLORS: Record<string, string> = {
  'Mental Health Resources': '#10b981',
  'Food Quality':            '#f59e0b',
  'Safety':                  '#f97316',
  'Facilities':              '#3b82f6',
  'School Policy':           '#8b5cf6',
  'Events & Activities':     '#ec4899',
  'Other':                   '#6b7280',
};

const STORAGE_KEY = 'ehs-schoolvoice-feedback';

function loadFeedback(): FeedbackItem[] {
  if (typeof window === 'undefined') return seedFeedback;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return seedFeedback;
}

function saveFeedback(items: FeedbackItem[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch {}
}

const statusConfig: Record<FeedbackStatus, { label: string; color: string; bg: string }> = {
  pending:      { label: 'Pending',      color: '#6b7280', bg: 'rgba(107,114,128,0.1)' },
  acknowledged: { label: 'Acknowledged', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  resolved:     { label: 'Resolved',     color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
};

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return `${Math.floor(diffDays / 30)}mo ago`;
}

function FeedbackCard({ item }: { item: FeedbackItem }) {
  const status = statusConfig[item.status];
  const catColor = CATEGORY_COLORS[item.category] || '#6b7280';

  return (
    <div
      className="rounded-2xl p-4 border transition-all duration-300 hover:shadow-md animate-fade-in"
      style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-light)' }}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="px-2.5 py-1 rounded-full text-[10px] font-dm-mono uppercase tracking-wider border"
            style={{ color: catColor, background: `${catColor}12`, borderColor: `${catColor}30` }}
          >
            {item.category}
          </span>
          <span
            className="px-2.5 py-1 rounded-full text-[10px] font-dm-mono uppercase tracking-wider"
            style={{ color: status.color, background: status.bg }}
          >
            {status.label}
          </span>
        </div>
        <span className="font-dm-mono text-[10px] flex-shrink-0" style={{ color: 'var(--text-muted)' }}>
          {timeAgo(item.submittedAt)}
        </span>
      </div>

      <p className="font-dm-sans text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>
        {item.message}
      </p>

      {item.adminNote && (
        <div
          className="mt-3 p-3 rounded-xl border-l-4"
          style={{ background: 'rgba(16,185,129,0.06)', borderLeftColor: '#10b981' }}
        >
          <div className="font-dm-mono text-[10px] uppercase tracking-wider text-emerald-500 mb-1.5">
            Admin Response
          </div>
          <p className="font-dm-sans text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            {item.adminNote}
          </p>
          {item.resolvedAt && (
            <div className="font-dm-mono text-[10px] mt-1" style={{ color: 'var(--text-subtle)' }}>
              Resolved {timeAgo(item.resolvedAt)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function SchoolVoice() {
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [category, setCategory] = useState<FeedbackCategory>('Other');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [statusFilter, setStatusFilter] = useState<FeedbackStatus | 'All'>('All');
  const [categoryFilter, setCategoryFilter] = useState<FeedbackCategory | 'All'>('All');
  const [activeTab, setActiveTab] = useState<'submit' | 'dashboard'>('submit');
  const [charCount, setCharCount] = useState(0);
  const MAX_CHARS = 500;

  useEffect(() => { setFeedback(loadFeedback()); }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || message.trim().length < 10) return;

    const newItem: FeedbackItem = {
      id: `fb-${Date.now()}`,
      category,
      message: message.trim(),
      status: 'pending',
      submittedAt: new Date().toISOString(),
    };

    const updated = [newItem, ...feedback];
    setFeedback(updated);
    saveFeedback(updated);
    setMessage('');
    setCharCount(0);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4500);
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    if (val.length <= MAX_CHARS) { setMessage(val); setCharCount(val.length); }
  };

  const filtered = useMemo(() => feedback.filter(f => {
    const matchesStatus = statusFilter === 'All' || f.status === statusFilter;
    const matchesCat = categoryFilter === 'All' || f.category === categoryFilter;
    return matchesStatus && matchesCat;
  }), [feedback, statusFilter, categoryFilter]);

  const stats = useMemo(() => {
    const total = feedback.length;
    const pending = feedback.filter(f => f.status === 'pending').length;
    const acknowledged = feedback.filter(f => f.status === 'acknowledged').length;
    const resolved = feedback.filter(f => f.status === 'resolved').length;

    const byCatMap: Record<string, number> = {};
    feedback.forEach(f => { byCatMap[f.category] = (byCatMap[f.category] || 0) + 1; });
    const pieData = Object.entries(byCatMap).sort((a, b) => b[1] - a[1]).map(([name, value]) => ({ name, value }));

    const barData: { label: string; count: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      const label = i === 0 ? 'Today' : i % 7 === 0 ? `${d.getMonth() + 1}/${d.getDate()}` : '';
      barData.push({ label, count: feedback.filter(f => f.submittedAt.slice(0, 10) === dateStr).length });
    }

    return { total, pending, acknowledged, resolved, pieData, barData };
  }, [feedback]);

  const CustomPieTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number }> }) => {
    if (active && payload?.length) {
      return (
        <div className="rounded-xl px-3 py-2 shadow-xl border text-sm font-dm-sans"
          style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-light)' }}>
          <p style={{ color: 'var(--text-primary)' }}>{payload[0].name}</p>
          <p className="font-semibold text-emerald-500">{payload[0].value} submissions</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #ec4899, #f43f5e)' }}>
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <span className="font-dm-mono text-xs tracking-widest uppercase" style={{ color: '#ec4899' }}>
            Anonymous
          </span>
        </div>
        <h1 className="font-syne font-black text-3xl sm:text-4xl" style={{ color: 'var(--text-primary)' }}>
          SchoolVoice
        </h1>
        <p className="font-dm-sans text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
          Share your thoughts with EHS administration — completely anonymous
        </p>
      </div>

      {/* Privacy notice */}
      <div
        className="flex items-start gap-3 p-4 rounded-2xl mb-6 border"
        style={{ background: 'rgba(16,185,129,0.06)', borderColor: 'rgba(16,185,129,0.2)' }}
      >
        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
          <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <div>
          <div className="font-dm-mono text-xs uppercase tracking-wider text-emerald-500 font-bold mb-0.5">
            100% Anonymous
          </div>
          <p className="font-dm-sans text-xs" style={{ color: 'var(--text-muted)' }}>
            No personal information is collected. Your identity is fully protected when you submit feedback.
          </p>
        </div>
      </div>

      {/* Tab toggle */}
      <div
        className="flex p-1 rounded-xl mb-6 border"
        style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-light)' }}
      >
        {([
          { id: 'submit', label: 'Submit Feedback', icon: '✏️' },
          { id: 'dashboard', label: 'View Dashboard', icon: '📊' },
        ] as const).map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-dm-sans text-sm font-medium transition-all duration-200"
            style={
              activeTab === tab.id
                ? { background: 'linear-gradient(135deg, #ec4899, #f43f5e)', color: 'white', boxShadow: '0 2px 8px rgba(236,72,153,0.3)' }
                : { color: 'var(--text-muted)' }
            }
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'submit' ? (
        <div className="max-w-xl">
          {submitted && (
            <div
              className="mb-6 p-4 rounded-2xl flex items-center gap-3 animate-fade-in-scale"
              style={{ background: 'linear-gradient(135deg, #059669, #10b981)', boxShadow: '0 8px 24px rgba(16,185,129,0.3)' }}
            >
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <div className="font-syne font-bold text-white">Feedback submitted!</div>
                <div className="font-dm-sans text-white/80 text-xs mt-0.5">
                  Thank you. Your anonymous feedback has been received.
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Category */}
            <div>
              <label className="block font-dm-mono text-xs uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
                Category
              </label>
              <div className="flex flex-wrap gap-2">
                {feedbackCategories.map(cat => {
                  const color = CATEGORY_COLORS[cat] || '#6b7280';
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className="px-3.5 py-2 rounded-full text-xs font-dm-sans font-medium border transition-all duration-200"
                      style={
                        category === cat
                          ? { background: color, color: 'white', border: 'none', boxShadow: `0 4px 12px ${color}40` }
                          : { background: 'var(--bg-secondary)', color: 'var(--text-muted)', borderColor: 'var(--border-light)' }
                      }
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block font-dm-mono text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
                Your Message
              </label>
              <textarea
                value={message}
                onChange={handleMessageChange}
                placeholder="Share your thoughts, concerns, or suggestions about EHS..."
                rows={5}
                className="w-full p-4 rounded-xl border font-dm-sans text-sm resize-none transition-all focus:outline-none"
                style={{
                  background: 'var(--bg-secondary)',
                  borderColor: message.length > 0 ? 'rgba(236,72,153,0.4)' : 'var(--border-light)',
                  color: 'var(--text-primary)',
                  boxShadow: message.length > 0 ? '0 0 0 3px rgba(236,72,153,0.1)' : 'none',
                }}
                required
                minLength={10}
              />
              <div className="flex justify-between mt-2">
                <span className="font-dm-mono text-[10px]" style={{ color: 'var(--text-subtle)' }}>
                  Minimum 10 characters
                </span>
                <span
                  className="font-dm-mono text-[10px]"
                  style={{ color: charCount > MAX_CHARS * 0.85 ? '#f59e0b' : 'var(--text-subtle)' }}
                >
                  {charCount}/{MAX_CHARS}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={message.trim().length < 10}
              className="w-full py-4 rounded-xl font-dm-sans font-bold text-sm transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: message.trim().length >= 10
                  ? 'linear-gradient(135deg, #ec4899, #f43f5e)'
                  : 'var(--border-light)',
                color: message.trim().length >= 10 ? 'white' : 'var(--text-muted)',
                boxShadow: message.trim().length >= 10 ? '0 8px 24px rgba(236,72,153,0.3)' : 'none',
              }}
            >
              Submit Anonymously →
            </button>
          </form>
        </div>
      ) : (
        <div>
          {/* Stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {[
              { label: 'Total Submissions', value: stats.total, color: '#6b7280' },
              { label: 'Pending', value: stats.pending, color: '#6b7280' },
              { label: 'Acknowledged', value: stats.acknowledged, color: '#f59e0b' },
              { label: 'Resolved', value: stats.resolved, color: '#10b981' },
            ].map(stat => (
              <div
                key={stat.label}
                className="rounded-2xl p-4 border text-center"
                style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-light)' }}
              >
                <div
                  className="font-syne font-black text-3xl mb-1"
                  style={{ color: stat.color }}
                >
                  {stat.value}
                </div>
                <div className="font-dm-mono text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="rounded-2xl p-5 border" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-light)' }}>
              <div className="font-dm-mono text-xs uppercase tracking-wider mb-4" style={{ color: 'var(--text-muted)' }}>
                By Category
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={stats.pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={76} paddingAngle={3} dataKey="value">
                    {stats.pieData.map((entry, i) => (
                      <Cell key={i} fill={CATEGORY_COLORS[entry.name] || '#6b7280'} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5 mt-2">
                {stats.pieData.slice(0, 5).map(entry => (
                  <div key={entry.name} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ background: CATEGORY_COLORS[entry.name] || '#6b7280' }} />
                      <span className="font-dm-sans text-xs truncate" style={{ color: 'var(--text-primary)' }}>
                        {entry.name}
                      </span>
                    </div>
                    <span className="font-dm-mono text-xs flex-shrink-0" style={{ color: 'var(--text-muted)' }}>
                      {entry.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl p-5 border" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-light)' }}>
              <div className="font-dm-mono text-xs uppercase tracking-wider mb-4" style={{ color: 'var(--text-muted)' }}>
                Last 30 Days
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={stats.barData} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 9, fontFamily: 'DM Mono, monospace', fill: 'var(--text-muted)' }}
                    axisLine={false} tickLine={false} interval={0} />
                  <YAxis tick={{ fontSize: 9, fontFamily: 'DM Mono, monospace', fill: 'var(--text-muted)' }}
                    axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-light)', borderRadius: 12, fontSize: 12 }} />
                  <Bar dataKey="count" fill="#ec4899" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-4">
            {(['All', 'pending', 'acknowledged', 'resolved'] as const).map(s => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className="px-3.5 py-1.5 rounded-full text-xs font-dm-mono border transition-all"
                style={statusFilter === s
                  ? { background: '#ec4899', color: 'white', border: 'none' }
                  : { background: 'var(--bg-secondary)', color: 'var(--text-muted)', borderColor: 'var(--border-light)' }}>
                {s === 'All' ? 'All Status' : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>

          <div className="font-dm-mono text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
            {filtered.length} submission{filtered.length !== 1 ? 's' : ''}
          </div>

          <div className="space-y-3">
            {filtered.length === 0 ? (
              <div className="rounded-2xl p-12 text-center border"
                style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-light)' }}>
                <div className="text-4xl mb-4">💬</div>
                <div className="font-syne font-bold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>
                  No submissions yet
                </div>
                <p className="font-dm-sans text-sm" style={{ color: 'var(--text-muted)' }}>
                  Be the first to share feedback!
                </p>
              </div>
            ) : (
              filtered.map(item => <FeedbackCard key={item.id} item={item} />)
            )}
          </div>
        </div>
      )}
    </div>
  );
}
