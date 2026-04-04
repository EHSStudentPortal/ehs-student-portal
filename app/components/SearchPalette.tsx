'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { staff as staffMembers } from '@/data/staff';
import { courses } from '@/data/courses';
import { events as calendarEvents } from '@/data/calendar';

// ── Types ──────────────────────────────────────────────────────────────────────

type ResultGroup = 'page' | 'staff' | 'course' | 'event' | 'building';

interface SearchResult {
  id: string;
  group: ResultGroup;
  label: string;
  sublabel?: string;
  badge?: string;
  badgeColor?: string;
  action: () => void;
}

// ── Static data ────────────────────────────────────────────────────────────────

const PAGES: { id: string; label: string; sublabel: string; tab: string }[] = [
  { id: 'p-home',      label: 'Home',          sublabel: 'Dashboard & announcements',          tab: 'home'      },
  { id: 'p-schedule',  label: 'Bell Schedule',  sublabel: 'Live period tracker & daily times',  tab: 'schedule'  },
  { id: 'p-map',       label: 'Campus Map',     sublabel: 'Interactive building finder',         tab: 'map'       },
  { id: 'p-staff',     label: 'Staff Directory',sublabel: 'Browse all teachers & staff',         tab: 'staff'     },
  { id: 'p-classes',   label: 'Courses',        sublabel: 'Full EHS course catalog',             tab: 'classes'   },
  { id: 'p-lunch',     label: 'Lunch Menu',     sublabel: "Today's breakfast & lunch",           tab: 'lunch'     },
  { id: 'p-calendar',  label: 'School Calendar',sublabel: '2025–26 events & holidays',           tab: 'calendar'  },
  { id: 'p-resources', label: 'Resources',      sublabel: 'Portals, links & deadlines',          tab: 'resources' },
  { id: 'p-voice',     label: 'SchoolVoice',    sublabel: 'Anonymous student community board',   tab: 'voice'     },
];

const BUILDINGS = [
  { id: 'b-A', label: 'Building A — Administration',  sublabel: 'Main office, counseling, front entrance' },
  { id: 'b-C', label: 'Building C — VAPA',            sublabel: 'Visual arts, performing arts, drama'     },
  { id: 'b-D', label: 'Building D — Cafeteria',       sublabel: 'Dining hall, kitchen, outdoor seating'   },
  { id: 'b-E', label: 'Building E — Library',         sublabel: 'Media center, study rooms'               },
  { id: 'b-F', label: 'Building F — Academic Wing 1', sublabel: 'Rooms 100–155, math & science'           },
  { id: 'b-G', label: 'Building G — Academic Wing 2', sublabel: 'Rooms 200–310, humanities'               },
  { id: 'b-L', label: 'Building L — Lockers',         sublabel: 'Student locker area'                     },
  { id: 'b-M', label: 'Building M — Gym',             sublabel: 'Main gym, weight room, PE'               },
  { id: 'b-PAC', label: 'PAC — Performing Arts',      sublabel: 'Auditorium, theater, choir'              },
  { id: 'b-W', label: 'Wellness Center',              sublabel: 'On-campus mental health & wellness'      },
];

const GROUP_META: Record<ResultGroup, { label: string; color: string; bg: string; dot: string }> = {
  page:     { label: 'Pages',     color: '#047857', bg: '#ecfdf5', dot: '#10b981' },
  staff:    { label: 'Staff',     color: '#1d4ed8', bg: '#eff6ff', dot: '#3b82f6' },
  course:   { label: 'Courses',   color: '#6d28d9', bg: '#f5f3ff', dot: '#8b5cf6' },
  event:    { label: 'Events',    color: '#b45309', bg: '#fffbeb', dot: '#f59e0b' },
  building: { label: 'Buildings', color: '#0f766e', bg: '#f0fdfa', dot: '#14b8a6' },
};

const RECENT_TABS = ['schedule', 'lunch', 'map', 'resources'];

// ── Search logic ───────────────────────────────────────────────────────────────

function search(query: string, onNavigate: (tab: string) => void): SearchResult[] {
  const q = query.toLowerCase().trim();
  const results: SearchResult[] = [];

  // Pages
  for (const page of PAGES) {
    if (page.label.toLowerCase().includes(q) || page.sublabel.toLowerCase().includes(q)) {
      results.push({
        id: page.id,
        group: 'page',
        label: page.label,
        sublabel: page.sublabel,
        action: () => onNavigate(page.tab),
      });
    }
  }

  // Staff
  const staffHits = staffMembers.filter(
    (s) =>
      s.name.toLowerCase().includes(q) ||
      s.department.toLowerCase().includes(q) ||
      s.subjects.some((sub) => sub.toLowerCase().includes(q)) ||
      s.title.toLowerCase().includes(q),
  );
  for (const s of staffHits.slice(0, 6)) {
    results.push({
      id: s.id,
      group: 'staff',
      label: s.name,
      sublabel: `${s.title} · ${s.department}`,
      badge: s.department,
      action: () => onNavigate('staff'),
    });
  }

  // Courses
  const courseHits = courses.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q),
  );
  for (const c of courseHits.slice(0, 6)) {
    results.push({
      id: c.id,
      group: 'course',
      label: c.name,
      sublabel: `${c.category} · Grade ${c.gradeLevel}`,
      badge: c.isAP ? 'AP' : c.isHonors ? 'H' : undefined,
      badgeColor: c.isAP ? '#8b5cf6' : '#6d28d9',
      action: () => onNavigate('classes'),
    });
  }

  // Calendar events
  const today = new Date();
  const eventHits = calendarEvents
    .filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        (e.description?.toLowerCase().includes(q) ?? false),
    )
    .sort((a, b) => {
      // prefer upcoming events
      const da = Math.abs(new Date(a.date).getTime() - today.getTime());
      const db = Math.abs(new Date(b.date).getTime() - today.getTime());
      return da - db;
    });
  for (const e of eventHits.slice(0, 4)) {
    const d = new Date(e.date);
    results.push({
      id: e.id,
      group: 'event',
      label: e.title,
      sublabel: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      badge: e.icon,
      action: () => onNavigate('calendar'),
    });
  }

  // Buildings
  for (const b of BUILDINGS) {
    if (b.label.toLowerCase().includes(q) || b.sublabel.toLowerCase().includes(q)) {
      results.push({
        id: b.id,
        group: 'building',
        label: b.label,
        sublabel: b.sublabel,
        action: () => onNavigate('map'),
      });
    }
  }

  return results.slice(0, 20);
}

function defaultResults(onNavigate: (tab: string) => void): SearchResult[] {
  return PAGES.filter((p) => RECENT_TABS.includes(p.tab)).map((p) => ({
    id: p.id,
    group: 'page' as ResultGroup,
    label: p.label,
    sublabel: p.sublabel,
    action: () => onNavigate(p.tab),
  }));
}

// ── Component ──────────────────────────────────────────────────────────────────

export default function SearchPalette({
  isOpen,
  onClose,
  onNavigate,
}: {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: string) => void;
}) {
  const [query, setQuery] = useState('');
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const results = query.trim()
    ? search(query, onNavigate)
    : defaultResults(onNavigate);

  // Group results for display
  const groups = results.reduce<Record<ResultGroup, SearchResult[]>>((acc, r) => {
    if (!acc[r.group]) acc[r.group] = [];
    acc[r.group].push(r);
    return acc;
  }, {} as Record<ResultGroup, SearchResult[]>);

  const flat = results; // flat list for keyboard nav

  const handleSelect = useCallback(
    (r: SearchResult) => {
      r.action();
      onClose();
      setQuery('');
      setActiveIdx(0);
    },
    [onClose],
  );

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setActiveIdx(0);
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [isOpen]);

  useEffect(() => {
    setActiveIdx(0);
  }, [query]);

  // Scroll active item into view
  useEffect(() => {
    if (!listRef.current) return;
    const el = listRef.current.querySelector<HTMLElement>('[data-active="true"]');
    el?.scrollIntoView({ block: 'nearest' });
  }, [activeIdx]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, flat.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (flat[activeIdx]) handleSelect(flat[activeIdx]);
    } else if (e.key === 'Escape') {
      onClose();
      setQuery('');
    }
  };

  if (!isOpen) return null;

  const groupOrder: ResultGroup[] = ['page', 'staff', 'course', 'event', 'building'];

  let flatIdx = 0; // counter to assign indices to items across groups

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-start justify-center pt-[12vh] px-4"
      style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-[580px] rounded-2xl overflow-hidden shadow-2xl animate-palette-in"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-light)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.35)',
        }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Search"
        aria-modal="true"
      >
        {/* Input row */}
        <div
          className="flex items-center gap-3 px-4 py-3.5 border-b"
          style={{ borderColor: 'var(--border-light)' }}
        >
          <svg
            className="w-4.5 h-4.5 flex-shrink-0 opacity-50"
            style={{ width: 18, height: 18, color: 'var(--text-muted)' }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search staff, courses, events, buildings…"
            className="flex-1 bg-transparent font-dm-sans text-sm outline-none placeholder:opacity-40"
            style={{ color: 'var(--text-primary)' }}
            aria-label="Search"
            autoComplete="off"
            spellCheck={false}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center opacity-40 hover:opacity-70 transition-opacity"
              style={{ background: 'var(--border-light)' }}
              aria-label="Clear"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          <kbd
            className="hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 rounded font-dm-mono text-[10px] opacity-40"
            style={{ background: 'var(--border-light)', color: 'var(--text-muted)' }}
          >
            ESC
          </kbd>
        </div>

        {/* Results list */}
        <div
          ref={listRef}
          className="overflow-y-auto"
          style={{ maxHeight: '60vh' }}
          role="listbox"
        >
          {results.length === 0 && query.trim() ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2 opacity-50">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="font-dm-sans text-sm" style={{ color: 'var(--text-muted)' }}>
                No results for &ldquo;{query}&rdquo;
              </p>
            </div>
          ) : (
            <>
              {!query.trim() && (
                <div
                  className="px-4 pt-3 pb-1 font-dm-mono text-[10px] tracking-widest uppercase"
                  style={{ color: 'var(--text-subtle)' }}
                >
                  Quick Navigation
                </div>
              )}
              {groupOrder.map((groupKey) => {
                const items = groups[groupKey];
                if (!items || items.length === 0) return null;
                const meta = GROUP_META[groupKey];
                return (
                  <div key={groupKey}>
                    <div
                      className="px-4 pt-3 pb-1 font-dm-mono text-[10px] tracking-widest uppercase flex items-center gap-2"
                      style={{ color: 'var(--text-subtle)' }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: meta.dot }}
                      />
                      {meta.label}
                    </div>
                    {items.map((r) => {
                      const idx = flat.findIndex((f) => f.id === r.id);
                      const isActive = idx === activeIdx;
                      return (
                        <button
                          key={r.id}
                          data-active={isActive}
                          role="option"
                          aria-selected={isActive}
                          onClick={() => handleSelect(r)}
                          onMouseEnter={() => setActiveIdx(idx)}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors"
                          style={{
                            background: isActive ? 'var(--bg-glass)' : 'transparent',
                            outline: 'none',
                          }}
                        >
                          {/* Group dot */}
                          <div
                            className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ background: meta.bg, border: `1px solid ${meta.dot}22` }}
                          >
                            <div
                              className="w-2 h-2 rounded-full"
                              style={{ background: meta.dot }}
                            />
                          </div>

                          {/* Text */}
                          <div className="flex-1 min-w-0">
                            <div
                              className="font-dm-sans font-semibold text-sm truncate"
                              style={{ color: 'var(--text-primary)' }}
                            >
                              {r.label}
                            </div>
                            {r.sublabel && (
                              <div
                                className="font-dm-sans text-xs truncate mt-0.5"
                                style={{ color: 'var(--text-muted)' }}
                              >
                                {r.sublabel}
                              </div>
                            )}
                          </div>

                          {/* Badge */}
                          {r.badge && r.group !== 'event' && (
                            <span
                              className="flex-shrink-0 px-2 py-0.5 rounded-full font-dm-mono text-[10px] font-bold"
                              style={{
                                background: r.badgeColor ? `${r.badgeColor}20` : meta.bg,
                                color: r.badgeColor ?? meta.color,
                                border: `1px solid ${r.badgeColor ? `${r.badgeColor}40` : meta.dot + '40'}`,
                              }}
                            >
                              {r.badge}
                            </span>
                          )}
                          {r.badge && r.group === 'event' && (
                            <span className="flex-shrink-0 text-base">{r.badge}</span>
                          )}

                          {/* Arrow hint on active */}
                          {isActive && (
                            <svg
                              className="w-4 h-4 flex-shrink-0 opacity-40"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          )}
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </>
          )}
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between px-4 py-2.5 border-t"
          style={{ borderColor: 'var(--border-light)' }}
        >
          <div className="flex items-center gap-3 font-dm-mono text-[10px] opacity-40" style={{ color: 'var(--text-muted)' }}>
            <span className="flex items-center gap-1">
              <kbd className="px-1 rounded" style={{ background: 'var(--border-light)' }}>↑↓</kbd>
              navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1 rounded" style={{ background: 'var(--border-light)' }}>↵</kbd>
              select
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1 rounded" style={{ background: 'var(--border-light)' }}>esc</kbd>
              close
            </span>
          </div>
          <span className="font-dm-mono text-[10px] opacity-30" style={{ color: 'var(--text-muted)' }}>
            {results.length} result{results.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
    </div>
  );
}
