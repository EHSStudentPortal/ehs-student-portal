'use client';

import { useState, useEffect, useMemo, useRef } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

type PostCategory =
  | 'General'
  | 'Academics'
  | 'Sports'
  | 'Events'
  | 'Clubs'
  | 'Feedback'
  | 'Lost & Found'
  | 'Shoutouts';

interface VoiceComment {
  id: string;
  body: string;
  author: string;
  isAdmin: boolean;
  upvotes: number;
  timestamp: number;
}

interface VoicePost {
  id: string;
  title: string;
  body: string;
  author: string;
  isAdmin: boolean;
  category: PostCategory;
  upvotes: number;
  downvotes: number;
  timestamp: number;
  comments: VoiceComment[];
  pinned?: boolean;
}

type SortMode = 'hot' | 'new' | 'top';

// ─── Constants ────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'ehs-voice-posts';

const ADMIN_NAMES = [
  'Lenni Velez', 'Chiharu Kitchens', 'Geoff Peppler', 'Dianna Heise',
  'Laura Gordon Reska', 'Carter Imai', 'Jaime Roberts', 'Katherine Hermens',
  'Constance Turpel', 'Curt Johansen', 'Miguel Baez', 'Priscilla Barton',
  'Geeta Subramonian', 'Chris MacDougall', 'Samantha Bacher',
  'ASB Leadership', 'EHS Admin', 'EHS Staff', 'Principal Velez', 'School Admin',
];

const CATEGORIES: PostCategory[] = [
  'General', 'Academics', 'Sports', 'Events', 'Clubs', 'Feedback', 'Lost & Found', 'Shoutouts',
];

const CATEGORY_COLORS: Record<PostCategory, { text: string; bg: string; border: string }> = {
  'General':     { text: '#10b981', bg: 'rgba(16,185,129,0.12)',  border: 'rgba(16,185,129,0.3)'  },
  'Academics':   { text: '#3b82f6', bg: 'rgba(59,130,246,0.12)',  border: 'rgba(59,130,246,0.3)'  },
  'Sports':      { text: '#f97316', bg: 'rgba(249,115,22,0.12)',  border: 'rgba(249,115,22,0.3)'  },
  'Events':      { text: '#a855f7', bg: 'rgba(168,85,247,0.12)',  border: 'rgba(168,85,247,0.3)'  },
  'Clubs':       { text: '#14b8a6', bg: 'rgba(20,184,166,0.12)',  border: 'rgba(20,184,166,0.3)'  },
  'Feedback':    { text: '#ef4444', bg: 'rgba(239,68,68,0.12)',   border: 'rgba(239,68,68,0.3)'   },
  'Lost & Found':{ text: '#eab308', bg: 'rgba(234,179,8,0.12)',   border: 'rgba(234,179,8,0.3)'   },
  'Shoutouts':   { text: '#ec4899', bg: 'rgba(236,72,153,0.12)',  border: 'rgba(236,72,153,0.3)'  },
};

const BAD_WORDS = [
  'fuck', 'shit', 'ass', 'bitch', 'bastard', 'damn', 'crap', 'piss', 'cock',
  'dick', 'pussy', 'cunt', 'whore', 'slut', 'fag', 'faggot', 'nigger', 'nigga',
  'retard', 'retarded', 'rape', 'rapist', 'kike', 'spic', 'chink', 'cracker',
  'motherfucker', 'asshole', 'bullshit', 'jackass', 'dumbass', 'idiot',
];

const THREAT_PHRASES = [
  'kill you', 'kill myself', 'going to kill', 'gonna kill', 'i will kill',
  'hate you', 'shut up', 'i hate', 'will hurt', 'gonna hurt',
  'stab', 'shoot you', 'bomb', 'threat',
];

// ─── Seed Data ───────────────────────────────────────────────────────────────

const NOW = Date.now();

const SEED_POSTS: VoicePost[] = [
  {
    id: 'seed-1',
    title: 'Welcome to EHS School Voice! 🎉',
    author: 'EHS Admin',
    isAdmin: true,
    category: 'General',
    body: 'This is your anonymous community board. Share thoughts, ask questions, give shoutouts, and connect with your EHS community. Keep it kind and school-appropriate!',
    upvotes: 47,
    downvotes: 2,
    timestamp: NOW - 86400000 * 3,
    pinned: true,
    comments: [
      {
        id: 'seed-1-c1',
        author: 'Anonymous',
        isAdmin: false,
        body: 'So excited for this! Love it',
        upvotes: 12,
        timestamp: NOW - 86400000 * 2.8,
      },
      {
        id: 'seed-1-c2',
        author: 'EHS Staff',
        isAdmin: true,
        body: 'We read everything! Keep the feedback coming 🌿',
        upvotes: 8,
        timestamp: NOW - 86400000 * 2.5,
      },
    ],
  },
  {
    id: 'seed-2',
    title: 'The new lunch menu is actually bussin',
    author: 'Anonymous',
    isAdmin: false,
    category: 'General',
    body: 'The birria pupusas on Tuesday are incredible. The food this year got a serious upgrade 🤤',
    upvotes: 38,
    downvotes: 3,
    timestamp: NOW - 86400000 * 2,
    comments: [
      {
        id: 'seed-2-c1',
        author: 'Anonymous',
        isAdmin: false,
        body: 'The BBQ burger on Thursday too 🔥',
        upvotes: 5,
        timestamp: NOW - 86400000 * 1.8,
      },
      {
        id: 'seed-2-c2',
        author: 'Anonymous',
        isAdmin: false,
        body: 'agreed the chicken shawarma wrap is S tier',
        upvotes: 9,
        timestamp: NOW - 86400000 * 1.5,
      },
    ],
  },
  {
    id: 'seed-3',
    title: 'Shoutout to Mr. Baez for staying late to help with the CS project 🙏',
    author: 'Anonymous',
    isAdmin: false,
    category: 'Shoutouts',
    body: 'Spent like 2 hours after school debugging our final project. Best teacher.',
    upvotes: 29,
    downvotes: 0,
    timestamp: NOW - 86400000 * 5,
    comments: [
      {
        id: 'seed-3-c1',
        author: 'Anonymous',
        isAdmin: false,
        body: "He's the GOAT",
        upvotes: 14,
        timestamp: NOW - 86400000 * 4.8,
      },
    ],
  },
  {
    id: 'seed-4',
    title: 'AP Calc BC study group?',
    author: 'Anonymous',
    isAdmin: false,
    category: 'Academics',
    body: "Anyone down to form an AP Calc BC study group before finals? DM me through school email if interested!",
    upvotes: 15,
    downvotes: 1,
    timestamp: NOW - 86400000 * 6,
    comments: [
      {
        id: 'seed-4-c1',
        author: 'Anonymous',
        isAdmin: false,
        body: "I'm in! Roberts' class?",
        upvotes: 3,
        timestamp: NOW - 86400000 * 5.9,
      },
    ],
  },
  {
    id: 'seed-5',
    title: 'Lost: AirPods Pro near the gym',
    author: 'Anonymous',
    isAdmin: false,
    category: 'Lost & Found',
    body: 'Lost my AirPods Pro (white case, has a small scratch) near the gym entrance during 6th period Friday. Please contact the main office if found!',
    upvotes: 7,
    downvotes: 0,
    timestamp: NOW - 86400000 * 1,
    comments: [],
  },
];

// ─── Utilities ────────────────────────────────────────────────────────────────

function isAdmin(name: string): boolean {
  return ADMIN_NAMES.some(a => a.toLowerCase() === name.trim().toLowerCase());
}

function filterContent(text: string): { clean: boolean; filtered: string } {
  const lower = text.toLowerCase();

  for (const word of BAD_WORDS) {
    // match word boundaries loosely: the bad word appearing as a standalone "word"
    const regex = new RegExp(`(?<![a-z])${word}(?![a-z])`, 'i');
    if (regex.test(lower)) {
      return { clean: false, filtered: text };
    }
  }

  for (const phrase of THREAT_PHRASES) {
    if (lower.includes(phrase)) {
      return { clean: false, filtered: text };
    }
  }

  return { clean: true, filtered: text };
}

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  if (days === 1) return 'Yesterday';
  if (days < 30) return `${days} days ago`;
  return new Date(ts).toLocaleDateString();
}

function generateId(): string {
  return `post-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function hotScore(post: VoicePost): number {
  const score = post.upvotes - post.downvotes;
  const order = Math.log10(Math.max(Math.abs(score), 1));
  const sign = score > 0 ? 1 : score < 0 ? -1 : 0;
  const seconds = post.timestamp / 1000 - 1134028003;
  return sign * order + seconds / 45000;
}

// ─── localStorage helpers ─────────────────────────────────────────────────────

function loadPosts(): VoicePost[] {
  if (typeof window === 'undefined') return SEED_POSTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as VoicePost[];
  } catch {}
  return SEED_POSTS;
}

function savePosts(posts: VoicePost[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  } catch {}
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function CategoryBadge({ category }: { category: PostCategory }) {
  const c = CATEGORY_COLORS[category];
  return (
    <span
      style={{
        color: c.text,
        background: c.bg,
        border: `1px solid ${c.border}`,
        borderRadius: 999,
        padding: '2px 10px',
        fontSize: 11,
        fontFamily: 'DM Mono, monospace',
        fontWeight: 600,
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        display: 'inline-block',
        lineHeight: '1.6',
      }}
    >
      {category}
    </span>
  );
}

function AdminBadge() {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 3,
        background: 'rgba(245,158,11,0.15)',
        border: '1px solid rgba(245,158,11,0.4)',
        color: '#f59e0b',
        borderRadius: 999,
        padding: '1px 8px',
        fontSize: 10,
        fontFamily: 'DM Mono, monospace',
        fontWeight: 700,
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
      }}
    >
      <svg width="9" height="9" viewBox="0 0 24 24" fill="#f59e0b">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
      Admin
    </span>
  );
}

function VoteButton({
  direction,
  active,
  count,
  onClick,
}: {
  direction: 'up' | 'down';
  active?: boolean;
  count: number;
  onClick: () => void;
}) {
  const up = direction === 'up';
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '4px 6px',
        borderRadius: 8,
        transition: 'all 0.15s',
        color: active ? (up ? '#10b981' : '#ef4444') : 'var(--text-muted, #9ca3af)',
      }}
    >
      {up ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 4l8 8H4l8-8z" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 20l-8-8h16l-8 8z" />
        </svg>
      )}
      <span style={{ fontSize: 11, fontFamily: 'DM Mono, monospace', fontWeight: 700 }}>
        {count}
      </span>
    </button>
  );
}

// ─── New Post Modal ────────────────────────────────────────────────────────────

interface NewPostModalProps {
  onClose: () => void;
  onSubmit: (post: Omit<VoicePost, 'id' | 'upvotes' | 'downvotes' | 'timestamp' | 'comments'>) => void;
}

function NewPostModal({ onClose, onSubmit }: NewPostModalProps) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState<PostCategory>('General');
  const [authorName, setAuthorName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const MAX_BODY = 1000;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimTitle = title.trim();
    const trimBody = body.trim();
    if (!trimTitle || trimTitle.length < 3) {
      setError('Title must be at least 3 characters.');
      return;
    }
    if (!trimBody || trimBody.length < 5) {
      setError('Post body must be at least 5 characters.');
      return;
    }

    const titleCheck = filterContent(trimTitle);
    const bodyCheck = filterContent(trimBody);
    if (!titleCheck.clean || !bodyCheck.clean) {
      setError('Your post contains inappropriate content. Please keep it school-appropriate.');
      return;
    }

    setLoading(true);
    const displayName = authorName.trim() || 'Anonymous';
    setTimeout(() => {
      onSubmit({
        title: trimTitle,
        body: trimBody,
        author: displayName,
        isAdmin: isAdmin(displayName),
        category,
      });
      setLoading(false);
    }, 400);
  };

  // Close on backdrop click
  const backdropRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={backdropRef}
      onClick={(e) => { if (e.target === backdropRef.current) onClose(); }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: 'rgba(0,0,0,0.55)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
    >
      <div
        style={{
          background: 'var(--bg-card, #1a1f2e)',
          border: '1px solid var(--border-light, rgba(255,255,255,0.08))',
          borderRadius: 24,
          width: '100%',
          maxWidth: 560,
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '32px',
          boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
          animation: 'sv-modal-in 0.2s ease-out',
        }}
      >
        {/* Modal header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h2 style={{
              fontSize: 22, fontFamily: 'Syne, sans-serif', fontWeight: 800,
              color: 'var(--text-primary, #f1f5f9)', margin: 0,
            }}>
              Create a Post
            </h2>
            <p style={{ fontSize: 12, color: 'var(--text-muted, #94a3b8)', marginTop: 4, fontFamily: 'DM Sans, sans-serif' }}>
              Share something with the EHS community
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid var(--border-light, rgba(255,255,255,0.08))',
              borderRadius: 12,
              width: 36, height: 36,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-muted, #94a3b8)',
              fontSize: 18,
              flexShrink: 0,
            }}
          >
            ×
          </button>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: 12, padding: '12px 16px', marginBottom: 20,
            color: '#ef4444', fontSize: 13, fontFamily: 'DM Sans, sans-serif',
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Title */}
          <div>
            <label style={{ display: 'block', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-muted, #94a3b8)', marginBottom: 8 }}>
              Title *
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's on your mind?"
              maxLength={150}
              style={{
                width: '100%', padding: '12px 16px', borderRadius: 12,
                background: 'var(--bg-secondary, rgba(255,255,255,0.04))',
                border: '1px solid var(--border-light, rgba(255,255,255,0.08))',
                color: 'var(--text-primary, #f1f5f9)',
                fontSize: 15, fontFamily: 'DM Sans, sans-serif',
                outline: 'none', boxSizing: 'border-box',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => (e.target.style.borderColor = 'rgba(16,185,129,0.5)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--border-light, rgba(255,255,255,0.08))')}
            />
          </div>

          {/* Category */}
          <div>
            <label style={{ display: 'block', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-muted, #94a3b8)', marginBottom: 8 }}>
              Category
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {CATEGORIES.map((cat) => {
                const c = CATEGORY_COLORS[cat];
                const active = category === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    style={{
                      padding: '6px 14px', borderRadius: 999, fontSize: 12,
                      fontFamily: 'DM Sans, sans-serif', fontWeight: 500,
                      cursor: 'pointer', transition: 'all 0.15s',
                      background: active ? c.bg : 'transparent',
                      color: active ? c.text : 'var(--text-muted, #94a3b8)',
                      border: `1px solid ${active ? c.border : 'var(--border-light, rgba(255,255,255,0.08))'}`,
                    }}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Body */}
          <div>
            <label style={{ display: 'block', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-muted, #94a3b8)', marginBottom: 8 }}>
              Body *
            </label>
            <textarea
              value={body}
              onChange={(e) => { if (e.target.value.length <= MAX_BODY) setBody(e.target.value); }}
              placeholder="Tell your story..."
              rows={5}
              style={{
                width: '100%', padding: '12px 16px', borderRadius: 12,
                background: 'var(--bg-secondary, rgba(255,255,255,0.04))',
                border: '1px solid var(--border-light, rgba(255,255,255,0.08))',
                color: 'var(--text-primary, #f1f5f9)',
                fontSize: 14, fontFamily: 'DM Sans, sans-serif', lineHeight: 1.6,
                outline: 'none', resize: 'vertical', boxSizing: 'border-box',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => (e.target.style.borderColor = 'rgba(16,185,129,0.5)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--border-light, rgba(255,255,255,0.08))')}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
              <span style={{ fontSize: 10, fontFamily: 'DM Mono, monospace', color: body.length > MAX_BODY * 0.85 ? '#f59e0b' : 'var(--text-muted, #94a3b8)' }}>
                {body.length}/{MAX_BODY}
              </span>
            </div>
          </div>

          {/* Author name */}
          <div>
            <label style={{ display: 'block', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-muted, #94a3b8)', marginBottom: 8 }}>
              Your Name <span style={{ opacity: 0.5, textTransform: 'none', fontSize: 10 }}>(optional — leave blank for Anonymous)</span>
            </label>
            <input
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="Anonymous"
              maxLength={60}
              style={{
                width: '100%', padding: '12px 16px', borderRadius: 12,
                background: 'var(--bg-secondary, rgba(255,255,255,0.04))',
                border: '1px solid var(--border-light, rgba(255,255,255,0.08))',
                color: 'var(--text-primary, #f1f5f9)',
                fontSize: 14, fontFamily: 'DM Sans, sans-serif',
                outline: 'none', boxSizing: 'border-box',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => (e.target.style.borderColor = 'rgba(16,185,129,0.5)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--border-light, rgba(255,255,255,0.08))')}
            />
          </div>

          {/* Content policy */}
          <div style={{
            background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)',
            borderRadius: 12, padding: '12px 16px',
            fontSize: 12, fontFamily: 'DM Sans, sans-serif', color: 'var(--text-muted, #94a3b8)',
            lineHeight: 1.5,
          }}>
            <span style={{ color: '#10b981', fontWeight: 600 }}>Community Guidelines: </span>
            Keep it kind, school-appropriate, and constructive. Harassment, threats, and profanity are not allowed.
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !title.trim() || !body.trim()}
            style={{
              width: '100%', padding: '14px',
              borderRadius: 14, border: 'none',
              background: loading || !title.trim() || !body.trim()
                ? 'rgba(255,255,255,0.08)'
                : 'linear-gradient(135deg, #059669, #10b981)',
              color: loading || !title.trim() || !body.trim() ? 'var(--text-muted, #94a3b8)' : 'white',
              fontSize: 15, fontFamily: 'DM Sans, sans-serif', fontWeight: 700,
              cursor: loading || !title.trim() || !body.trim() ? 'not-allowed' : 'pointer',
              boxShadow: loading || !title.trim() || !body.trim() ? 'none' : '0 8px 24px rgba(16,185,129,0.3)',
              transition: 'all 0.2s',
            }}
          >
            {loading ? 'Posting...' : 'Post to Board'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Thread View ───────────────────────────────────────────────────────────────

interface ThreadViewProps {
  post: VoicePost;
  onBack: () => void;
  onVotePost: (postId: string, dir: 'up' | 'down') => void;
  onAddComment: (postId: string, comment: Omit<VoiceComment, 'id' | 'timestamp'>) => void;
  onVoteComment: (postId: string, commentId: string) => void;
  userVotes: Record<string, 'up' | 'down'>;
  userCommentVotes: Record<string, boolean>;
}

function ThreadView({
  post, onBack, onVotePost, onAddComment, onVoteComment, userVotes, userCommentVotes,
}: ThreadViewProps) {
  const [commentAuthor, setCommentAuthor] = useState('');
  const [commentBody, setCommentBody] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const MAX_COMMENT = 500;
  const c = CATEGORY_COLORS[post.category];
  const score = post.upvotes - post.downvotes;

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const trimBody = commentBody.trim();
    if (!trimBody || trimBody.length < 2) { setError('Comment is too short.'); return; }
    const check = filterContent(trimBody);
    if (!check.clean) { setError('Comment contains inappropriate content.'); return; }
    setLoading(true);
    setTimeout(() => {
      const displayName = commentAuthor.trim() || 'Anonymous';
      onAddComment(post.id, {
        body: trimBody,
        author: displayName,
        isAdmin: isAdmin(displayName),
        upvotes: 0,
      });
      setCommentBody('');
      setCommentAuthor('');
      setLoading(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }, 350);
  };

  return (
    <div style={{ maxWidth: 720, margin: '0 auto' }}>
      {/* Back */}
      <button
        onClick={onBack}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-light, rgba(255,255,255,0.08))',
          borderRadius: 12, padding: '8px 16px', marginBottom: 24,
          color: 'var(--text-muted, #94a3b8)', fontSize: 13, fontFamily: 'DM Sans, sans-serif',
          cursor: 'pointer', transition: 'all 0.15s',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Back to Board
      </button>

      {/* Post card */}
      <div style={{
        background: 'var(--bg-card, rgba(255,255,255,0.03))',
        border: '1px solid var(--border-light, rgba(255,255,255,0.08))',
        borderRadius: 20, overflow: 'hidden',
        marginBottom: 28,
      }}>
        {post.pinned && (
          <div style={{
            background: 'rgba(16,185,129,0.1)', borderBottom: '1px solid rgba(16,185,129,0.2)',
            padding: '8px 20px', fontSize: 11, fontFamily: 'DM Mono, monospace',
            color: '#10b981', letterSpacing: '0.07em', textTransform: 'uppercase',
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5v6l1 1 1-1v-6h5v-2l-2-2z" />
            </svg>
            Pinned Post
          </div>
        )}
        <div style={{ display: 'flex', gap: 0 }}>
          {/* Vote column */}
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            padding: '20px 12px', gap: 0,
            background: 'rgba(255,255,255,0.02)',
            borderRight: '1px solid var(--border-light, rgba(255,255,255,0.06))',
          }}>
            <VoteButton
              direction="up"
              active={userVotes[post.id] === 'up'}
              count={post.upvotes}
              onClick={() => onVotePost(post.id, 'up')}
            />
            <div style={{
              fontSize: 13, fontFamily: 'DM Mono, monospace', fontWeight: 700,
              color: score > 0 ? '#10b981' : score < 0 ? '#ef4444' : 'var(--text-muted, #94a3b8)',
              padding: '4px 0',
            }}>
              {score}
            </div>
            <VoteButton
              direction="down"
              active={userVotes[post.id] === 'down'}
              count={post.downvotes}
              onClick={() => onVotePost(post.id, 'down')}
            />
          </div>

          {/* Content */}
          <div style={{ flex: 1, padding: '20px 24px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', marginBottom: 12 }}>
              <CategoryBadge category={post.category} />
            </div>
            <h1 style={{
              fontSize: 22, fontFamily: 'Syne, sans-serif', fontWeight: 800,
              color: 'var(--text-primary, #f1f5f9)', margin: '0 0 12px',
              lineHeight: 1.3,
            }}>
              {post.title}
            </h1>
            <p style={{
              fontSize: 15, fontFamily: 'DM Sans, sans-serif', lineHeight: 1.7,
              color: 'var(--text-secondary, #cbd5e1)', margin: '0 0 16px', whiteSpace: 'pre-wrap',
            }}>
              {post.body}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 13, fontFamily: 'DM Sans, sans-serif', color: 'var(--text-muted, #94a3b8)', fontWeight: 600 }}>
                {post.author}
              </span>
              {post.isAdmin && <AdminBadge />}
              <span style={{ fontSize: 12, fontFamily: 'DM Mono, monospace', color: 'var(--text-subtle, #64748b)' }}>
                {timeAgo(post.timestamp)}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-subtle, #64748b)', fontFamily: 'DM Sans, sans-serif' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {post.comments.length} {post.comments.length === 1 ? 'comment' : 'comments'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Comments section */}
      <h3 style={{
        fontSize: 16, fontFamily: 'Syne, sans-serif', fontWeight: 700,
        color: 'var(--text-primary, #f1f5f9)', marginBottom: 20,
      }}>
        {post.comments.length} {post.comments.length === 1 ? 'Comment' : 'Comments'}
      </h3>

      {/* Add comment form */}
      <div style={{
        background: 'var(--bg-card, rgba(255,255,255,0.03))',
        border: '1px solid var(--border-light, rgba(255,255,255,0.08))',
        borderRadius: 16, padding: '20px', marginBottom: 20,
      }}>
        {success && (
          <div style={{
            background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)',
            borderRadius: 10, padding: '10px 14px', marginBottom: 16,
            color: '#10b981', fontSize: 13, fontFamily: 'DM Sans, sans-serif',
          }}>
            Comment posted!
          </div>
        )}
        {error && (
          <div style={{
            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: 10, padding: '10px 14px', marginBottom: 16,
            color: '#ef4444', fontSize: 13, fontFamily: 'DM Sans, sans-serif',
          }}>
            {error}
          </div>
        )}
        <form onSubmit={handleComment} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input
            value={commentAuthor}
            onChange={(e) => setCommentAuthor(e.target.value)}
            placeholder="Your name (optional — defaults to Anonymous)"
            maxLength={60}
            style={{
              padding: '10px 14px', borderRadius: 10,
              background: 'var(--bg-secondary, rgba(255,255,255,0.04))',
              border: '1px solid var(--border-light, rgba(255,255,255,0.08))',
              color: 'var(--text-primary, #f1f5f9)',
              fontSize: 13, fontFamily: 'DM Sans, sans-serif', outline: 'none',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => (e.target.style.borderColor = 'rgba(16,185,129,0.5)')}
            onBlur={(e) => (e.target.style.borderColor = 'var(--border-light, rgba(255,255,255,0.08))')}
          />
          <div>
            <textarea
              value={commentBody}
              onChange={(e) => { if (e.target.value.length <= MAX_COMMENT) setCommentBody(e.target.value); }}
              placeholder="Add a comment..."
              rows={3}
              style={{
                width: '100%', padding: '10px 14px', borderRadius: 10,
                background: 'var(--bg-secondary, rgba(255,255,255,0.04))',
                border: '1px solid var(--border-light, rgba(255,255,255,0.08))',
                color: 'var(--text-primary, #f1f5f9)',
                fontSize: 13, fontFamily: 'DM Sans, sans-serif', lineHeight: 1.6,
                outline: 'none', resize: 'vertical', boxSizing: 'border-box',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => (e.target.style.borderColor = 'rgba(16,185,129,0.5)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--border-light, rgba(255,255,255,0.08))')}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
              <span style={{ fontSize: 10, fontFamily: 'DM Mono, monospace', color: 'var(--text-subtle, #64748b)' }}>
                {commentBody.length}/{MAX_COMMENT}
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="submit"
              disabled={loading || !commentBody.trim()}
              style={{
                padding: '10px 20px', borderRadius: 10, border: 'none',
                background: loading || !commentBody.trim()
                  ? 'rgba(255,255,255,0.06)'
                  : 'linear-gradient(135deg, #059669, #10b981)',
                color: loading || !commentBody.trim() ? 'var(--text-muted, #94a3b8)' : 'white',
                fontSize: 13, fontFamily: 'DM Sans, sans-serif', fontWeight: 700,
                cursor: loading || !commentBody.trim() ? 'not-allowed' : 'pointer',
                boxShadow: loading || !commentBody.trim() ? 'none' : '0 4px 12px rgba(16,185,129,0.3)',
                transition: 'all 0.2s',
              }}
            >
              {loading ? 'Posting...' : 'Post Comment'}
            </button>
          </div>
        </form>
      </div>

      {/* Comments list */}
      {post.comments.length === 0 ? (
        <div style={{
          background: 'var(--bg-card, rgba(255,255,255,0.02))',
          border: '1px solid var(--border-light, rgba(255,255,255,0.06))',
          borderRadius: 16, padding: '40px 24px', textAlign: 'center',
        }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>💬</div>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 16, color: 'var(--text-primary, #f1f5f9)', marginBottom: 6 }}>
            No comments yet
          </div>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'var(--text-muted, #94a3b8)' }}>
            Be the first to comment!
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {post.comments.map((comment) => (
            <div
              key={comment.id}
              style={{
                background: comment.isAdmin
                  ? 'rgba(16,185,129,0.05)'
                  : 'var(--bg-card, rgba(255,255,255,0.03))',
                border: `1px solid ${comment.isAdmin ? 'rgba(16,185,129,0.2)' : 'var(--border-light, rgba(255,255,255,0.08))'}`,
                borderLeft: comment.isAdmin ? '3px solid #10b981' : '1px solid var(--border-light, rgba(255,255,255,0.08))',
                borderRadius: 14,
                padding: '16px 18px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8, flexWrap: 'wrap', gap: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 13, fontFamily: 'DM Sans, sans-serif', fontWeight: 600, color: 'var(--text-primary, #f1f5f9)' }}>
                    {comment.author}
                  </span>
                  {comment.isAdmin && <AdminBadge />}
                  <span style={{ fontSize: 11, fontFamily: 'DM Mono, monospace', color: 'var(--text-subtle, #64748b)' }}>
                    {timeAgo(comment.timestamp)}
                  </span>
                </div>
                <button
                  onClick={() => onVoteComment(post.id, comment.id)}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: userCommentVotes[comment.id] ? '#10b981' : 'var(--text-subtle, #64748b)',
                    fontSize: 12, fontFamily: 'DM Mono, monospace', fontWeight: 700,
                    transition: 'color 0.15s', padding: '2px 4px',
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 4l8 8H4l8-8z" />
                  </svg>
                  {comment.upvotes}
                </button>
              </div>
              <p style={{
                fontSize: 14, fontFamily: 'DM Sans, sans-serif', lineHeight: 1.6,
                color: 'var(--text-secondary, #cbd5e1)', margin: 0, whiteSpace: 'pre-wrap',
              }}>
                {comment.body}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Post Card ─────────────────────────────────────────────────────────────────

interface PostCardProps {
  post: VoicePost;
  onClick: () => void;
  onVote: (postId: string, dir: 'up' | 'down') => void;
  userVote?: 'up' | 'down';
}

function PostCard({ post, onClick, onVote, userVote }: PostCardProps) {
  const [hovered, setHovered] = useState(false);
  const score = post.upvotes - post.downvotes;
  const c = CATEGORY_COLORS[post.category];

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'var(--bg-card, rgba(255,255,255,0.03))',
        border: `1px solid ${hovered ? 'rgba(16,185,129,0.3)' : 'var(--border-light, rgba(255,255,255,0.08))'}`,
        borderRadius: 16,
        display: 'flex',
        overflow: 'hidden',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: hovered ? '0 8px 32px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.1)',
        transition: 'all 0.2s ease',
      }}
    >
      {/* Vote column */}
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '14px 10px', gap: 0,
        background: 'rgba(255,255,255,0.02)',
        borderRight: '1px solid var(--border-light, rgba(255,255,255,0.06))',
        minWidth: 52,
      }}>
        <VoteButton
          direction="up"
          active={userVote === 'up'}
          count={post.upvotes}
          onClick={() => onVote(post.id, 'up')}
        />
        <div style={{
          fontSize: 12, fontFamily: 'DM Mono, monospace', fontWeight: 700,
          padding: '2px 0',
          color: score > 0 ? '#10b981' : score < 0 ? '#ef4444' : 'var(--text-muted, #94a3b8)',
        }}>
          {score}
        </div>
        <VoteButton
          direction="down"
          active={userVote === 'down'}
          count={post.downvotes}
          onClick={() => onVote(post.id, 'down')}
        />
      </div>

      {/* Content */}
      <div
        style={{ flex: 1, padding: '14px 18px', cursor: 'pointer', minWidth: 0 }}
        onClick={onClick}
      >
        {/* Badges row */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center', marginBottom: 8 }}>
          <CategoryBadge category={post.category} />
          {post.pinned && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)',
              color: '#10b981', borderRadius: 999, padding: '2px 8px',
              fontSize: 10, fontFamily: 'DM Mono, monospace', fontWeight: 700,
              letterSpacing: '0.07em', textTransform: 'uppercase',
            }}>
              <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5v6l1 1 1-1v-6h5v-2l-2-2z" />
              </svg>
              Pinned
            </span>
          )}
        </div>

        {/* Title */}
        <h3 style={{
          fontSize: 15, fontFamily: 'Syne, sans-serif', fontWeight: 700,
          color: 'var(--text-primary, #f1f5f9)', margin: '0 0 6px',
          lineHeight: 1.35,
        }}>
          {post.title}
        </h3>

        {/* Body preview */}
        <p style={{
          fontSize: 13, fontFamily: 'DM Sans, sans-serif', lineHeight: 1.5,
          color: 'var(--text-muted, #94a3b8)', margin: '0 0 10px',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {post.body}
        </p>

        {/* Meta row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 12, fontFamily: 'DM Sans, sans-serif', fontWeight: 600, color: 'var(--text-secondary, #cbd5e1)' }}>
            {post.author}
          </span>
          {post.isAdmin && <AdminBadge />}
          <span style={{ fontSize: 11, fontFamily: 'DM Mono, monospace', color: 'var(--text-subtle, #64748b)' }}>
            {timeAgo(post.timestamp)}
          </span>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            fontSize: 12, fontFamily: 'DM Sans, sans-serif', color: 'var(--text-subtle, #64748b)',
          }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {post.comments.length}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function SchoolVoice() {
  const [posts, setPosts] = useState<VoicePost[]>([]);
  const [activePost, setActivePost] = useState<string | null>(null);
  const [sortMode, setSortMode] = useState<SortMode>('hot');
  const [categoryFilter, setCategoryFilter] = useState<PostCategory | 'All'>('All');
  const [showNewPost, setShowNewPost] = useState(false);
  // userVotes: postId -> 'up' | 'down'
  const [userVotes, setUserVotes] = useState<Record<string, 'up' | 'down'>>({});
  // userCommentVotes: commentId -> true
  const [userCommentVotes, setUserCommentVotes] = useState<Record<string, boolean>>({});

  // Load from localStorage on mount
  useEffect(() => {
    setPosts(loadPosts());
  }, []);

  const currentPost = useMemo(
    () => (activePost ? posts.find((p) => p.id === activePost) ?? null : null),
    [activePost, posts],
  );

  // Sorted + filtered feed
  const feedPosts = useMemo(() => {
    let filtered = categoryFilter === 'All' ? posts : posts.filter((p) => p.category === categoryFilter);

    // Always float pinned posts to the top in hot/new
    const pinned = filtered.filter((p) => p.pinned);
    const rest = filtered.filter((p) => !p.pinned);

    let sorted: VoicePost[];
    if (sortMode === 'new') {
      sorted = [...rest].sort((a, b) => b.timestamp - a.timestamp);
    } else if (sortMode === 'top') {
      sorted = [...rest].sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes));
    } else {
      // hot
      sorted = [...rest].sort((a, b) => hotScore(b) - hotScore(a));
    }

    return [...pinned, ...sorted];
  }, [posts, sortMode, categoryFilter]);

  function updatePosts(updated: VoicePost[]) {
    setPosts(updated);
    savePosts(updated);
  }

  function handleVotePost(postId: string, dir: 'up' | 'down') {
    const prev = userVotes[postId];
    const newVotes = { ...userVotes };

    const updated = posts.map((p) => {
      if (p.id !== postId) return p;
      let { upvotes, downvotes } = p;

      // Remove previous vote
      if (prev === 'up') upvotes = Math.max(0, upvotes - 1);
      if (prev === 'down') downvotes = Math.max(0, downvotes - 1);

      // Apply new vote (toggle off if same)
      if (prev !== dir) {
        if (dir === 'up') upvotes++;
        else downvotes++;
        newVotes[postId] = dir;
      } else {
        delete newVotes[postId];
      }

      return { ...p, upvotes, downvotes };
    });

    setUserVotes(newVotes);
    updatePosts(updated);
  }

  function handleAddComment(postId: string, comment: Omit<VoiceComment, 'id' | 'timestamp'>) {
    const updated = posts.map((p) => {
      if (p.id !== postId) return p;
      const newComment: VoiceComment = {
        ...comment,
        id: `c-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        timestamp: Date.now(),
      };
      return { ...p, comments: [...p.comments, newComment] };
    });
    updatePosts(updated);
  }

  function handleVoteComment(postId: string, commentId: string) {
    const alreadyVoted = userCommentVotes[commentId];
    const newCommentVotes = { ...userCommentVotes };

    const updated = posts.map((p) => {
      if (p.id !== postId) return p;
      const updatedComments = p.comments.map((c) => {
        if (c.id !== commentId) return c;
        if (alreadyVoted) {
          delete newCommentVotes[commentId];
          return { ...c, upvotes: Math.max(0, c.upvotes - 1) };
        } else {
          newCommentVotes[commentId] = true;
          return { ...c, upvotes: c.upvotes + 1 };
        }
      });
      return { ...p, comments: updatedComments };
    });

    setUserCommentVotes(newCommentVotes);
    updatePosts(updated);
  }

  function handleNewPost(postData: Omit<VoicePost, 'id' | 'upvotes' | 'downvotes' | 'timestamp' | 'comments'>) {
    const newPost: VoicePost = {
      ...postData,
      id: generateId(),
      upvotes: 1,
      downvotes: 0,
      timestamp: Date.now(),
      comments: [],
    };
    const updated = [newPost, ...posts];
    updatePosts(updated);
    setShowNewPost(false);
    // Open the new post
    setActivePost(newPost.id);
  }

  const totalPostCount = posts.length;

  return (
    <>
      {/* CSS keyframes injected inline via style tag */}
      <style>{`
        @keyframes sv-modal-in {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes sv-fade-in {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 16px 80px', animation: 'sv-fade-in 0.3s ease-out' }}>

        {/* ── Header ────────────────────────────────────────────── */}
        {!activePost && (
          <>
            <div style={{ marginBottom: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 14,
                  background: 'linear-gradient(135deg, #059669, #10b981)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 16px rgba(16,185,129,0.35)',
                  flexShrink: 0,
                }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <path d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <h1 style={{
                    fontSize: 28, fontFamily: 'Syne, sans-serif', fontWeight: 900,
                    color: 'var(--text-primary, #f1f5f9)', margin: 0, lineHeight: 1.1,
                  }}>
                    School Voice
                  </h1>
                  <p style={{
                    fontSize: 13, fontFamily: 'DM Sans, sans-serif',
                    color: 'var(--text-muted, #94a3b8)', margin: 0,
                  }}>
                    EHS Community Board &nbsp;·&nbsp; {totalPostCount} post{totalPostCount !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            </div>

            {/* ── Sort + New Post bar ───────────────────────────── */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
              {/* Sort tabs */}
              <div style={{
                display: 'flex', gap: 2, padding: 3,
                background: 'var(--bg-secondary, rgba(255,255,255,0.04))',
                border: '1px solid var(--border-light, rgba(255,255,255,0.08))',
                borderRadius: 12,
              }}>
                {(['hot', 'new', 'top'] as SortMode[]).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setSortMode(mode)}
                    style={{
                      padding: '7px 16px', borderRadius: 9, border: 'none',
                      fontSize: 13, fontFamily: 'DM Sans, sans-serif', fontWeight: 600,
                      cursor: 'pointer', transition: 'all 0.15s', textTransform: 'capitalize',
                      background: sortMode === mode
                        ? 'linear-gradient(135deg, #059669, #10b981)'
                        : 'transparent',
                      color: sortMode === mode ? 'white' : 'var(--text-muted, #94a3b8)',
                      boxShadow: sortMode === mode ? '0 2px 8px rgba(16,185,129,0.3)' : 'none',
                    }}
                  >
                    {mode === 'hot' ? '🔥 Hot' : mode === 'new' ? '✨ New' : '⬆ Top'}
                  </button>
                ))}
              </div>

              <div style={{ flex: 1 }} />

              {/* New Post button */}
              <button
                onClick={() => setShowNewPost(true)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '9px 18px', borderRadius: 12, border: 'none',
                  background: 'linear-gradient(135deg, #059669, #10b981)',
                  color: 'white', fontSize: 13, fontFamily: 'DM Sans, sans-serif', fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(16,185,129,0.35)',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(16,185,129,0.45)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(16,185,129,0.35)'; }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                </svg>
                New Post
              </button>
            </div>

            {/* ── Category filter pills ──────────────────────────── */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 24 }}>
              <button
                onClick={() => setCategoryFilter('All')}
                style={{
                  padding: '6px 14px', borderRadius: 999,
                  fontSize: 12, fontFamily: 'DM Sans, sans-serif', fontWeight: 500,
                  cursor: 'pointer', transition: 'all 0.15s',
                  background: categoryFilter === 'All' ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.04)',
                  color: categoryFilter === 'All' ? '#10b981' : 'var(--text-muted, #94a3b8)',
                  border: `1px solid ${categoryFilter === 'All' ? 'rgba(16,185,129,0.4)' : 'var(--border-light, rgba(255,255,255,0.08))'}`,
                }}
              >
                All
              </button>
              {CATEGORIES.map((cat) => {
                const c = CATEGORY_COLORS[cat];
                const active = categoryFilter === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(active ? 'All' : cat)}
                    style={{
                      padding: '6px 14px', borderRadius: 999,
                      fontSize: 12, fontFamily: 'DM Sans, sans-serif', fontWeight: 500,
                      cursor: 'pointer', transition: 'all 0.15s',
                      background: active ? c.bg : 'rgba(255,255,255,0.04)',
                      color: active ? c.text : 'var(--text-muted, #94a3b8)',
                      border: `1px solid ${active ? c.border : 'var(--border-light, rgba(255,255,255,0.08))'}`,
                    }}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* ── Thread View ────────────────────────────────────────── */}
        {activePost && currentPost ? (
          <ThreadView
            post={currentPost}
            onBack={() => setActivePost(null)}
            onVotePost={handleVotePost}
            onAddComment={handleAddComment}
            onVoteComment={handleVoteComment}
            userVotes={userVotes}
            userCommentVotes={userCommentVotes}
          />
        ) : (
          /* ── Feed ───────────────────────────────────────────────── */
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {feedPosts.length === 0 ? (
              <div style={{
                background: 'var(--bg-card, rgba(255,255,255,0.02))',
                border: '1px solid var(--border-light, rgba(255,255,255,0.06))',
                borderRadius: 20, padding: '64px 24px', textAlign: 'center',
              }}>
                <div style={{ fontSize: 40, marginBottom: 14 }}>📭</div>
                <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 18, color: 'var(--text-primary, #f1f5f9)', marginBottom: 8 }}>
                  Nothing here yet
                </div>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'var(--text-muted, #94a3b8)', marginBottom: 20 }}>
                  Be the first to post in {categoryFilter === 'All' ? 'this community' : `#${categoryFilter}`}!
                </p>
                <button
                  onClick={() => setShowNewPost(true)}
                  style={{
                    padding: '10px 22px', borderRadius: 12, border: 'none',
                    background: 'linear-gradient(135deg, #059669, #10b981)',
                    color: 'white', fontSize: 14, fontFamily: 'DM Sans, sans-serif', fontWeight: 700,
                    cursor: 'pointer', boxShadow: '0 4px 14px rgba(16,185,129,0.3)',
                  }}
                >
                  Create a Post
                </button>
              </div>
            ) : (
              feedPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onClick={() => setActivePost(post.id)}
                  onVote={handleVotePost}
                  userVote={userVotes[post.id]}
                />
              ))
            )}
          </div>
        )}
      </div>

      {/* ── New Post Modal ─────────────────────────────────────────── */}
      {showNewPost && (
        <NewPostModal
          onClose={() => setShowNewPost(false)}
          onSubmit={handleNewPost}
        />
      )}
    </>
  );
}
