'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  getEventsForDate,
  getEventsForMonth,
  getUpcomingEvents,
  EVENT_TYPE_CONFIG,
  type CalendarEvent,
  type EventType,
} from '@/data/calendar';

// ── Constants ─────────────────────────────────────────────────────────────────

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

// Max event entries to show per calendar cell before "+N more"
const MAX_VISIBLE_DOTS = 3;

// ── Helpers ───────────────────────────────────────────────────────────────────

function toDateString(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function todayString(): string {
  const d = new Date();
  return toDateString(d.getFullYear(), d.getMonth() + 1, d.getDate());
}

function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

function firstDayOfMonth(year: number, month: number): number {
  return new Date(year, month - 1, 1).getDay();
}

function formatEventDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  });
}

function formatUpcomingDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const today = new Date();
  const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const diff = Math.round((date.getTime() - todayMidnight.getTime()) / 86400000);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  if (diff > 1 && diff <= 6) return date.toLocaleDateString('en-US', { weekday: 'long' });
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Build a date→events map expanding multi-day events across a month grid
function buildMonthEventMap(
  year: number,
  month: number,
): Map<string, CalendarEvent[]> {
  const monthEvents = getEventsForMonth(year, month);
  const map = new Map<string, CalendarEvent[]>();

  for (const ev of monthEvents) {
    const startCursor = new Date(ev.date + 'T00:00:00');
    const endDate = new Date((ev.endDate ?? ev.date) + 'T00:00:00');

    while (startCursor <= endDate) {
      const cur = toDateString(
        startCursor.getFullYear(),
        startCursor.getMonth() + 1,
        startCursor.getDate(),
      );
      const [cy, cm] = cur.split('-').map(Number);
      if (cy === year && cm === month) {
        if (!map.has(cur)) map.set(cur, []);
        const arr = map.get(cur)!;
        if (!arr.find((e) => e.id === ev.id)) arr.push(ev);
      }
      startCursor.setDate(startCursor.getDate() + 1);
    }
  }
  return map;
}

// ── Sub-components ────────────────────────────────────────────────────────────

function EventDot({ type, size = 6 }: { type: EventType; size?: number }) {
  const cfg = EVENT_TYPE_CONFIG[type];
  return (
    <span
      className="inline-block rounded-full flex-shrink-0"
      style={{ width: size, height: size, background: cfg.dot }}
      title={cfg.label}
    />
  );
}

function EventChip({ event, compact = false }: { event: CalendarEvent; compact?: boolean }) {
  const cfg = EVENT_TYPE_CONFIG[event.type];

  if (compact) {
    return (
      <div
        className="w-full truncate rounded px-1.5 py-0.5 font-dm-sans text-[10px] font-medium leading-tight"
        style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}
      >
        {event.icon && <span className="mr-0.5">{event.icon}</span>}
        {event.title}
      </div>
    );
  }

  return (
    <div
      className="flex items-start gap-2.5 p-3 rounded-xl"
      style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}
    >
      <div className="flex-shrink-0 mt-0.5">
        <EventDot type={event.type} size={8} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-dm-sans font-semibold text-sm leading-tight" style={{ color: cfg.color }}>
          {event.icon && <span className="mr-1">{event.icon}</span>}
          {event.title}
        </div>
        {event.description && (
          <p className="font-dm-sans text-xs mt-1 leading-relaxed" style={{ color: '#475569' }}>
            {event.description}
          </p>
        )}
        {event.endDate && event.endDate !== event.date && (
          <div className="font-dm-mono text-[10px] mt-1" style={{ color: '#94a3b8' }}>
            Through {formatEventDate(event.endDate)}
          </div>
        )}
      </div>
      <span
        className="flex-shrink-0 px-2 py-0.5 rounded-full font-dm-mono text-[10px] font-bold whitespace-nowrap"
        style={{ background: cfg.border, color: cfg.color }}
      >
        {cfg.label}
      </span>
    </div>
  );
}

// ── Calendar Day Cell ─────────────────────────────────────────────────────────

interface DayCellProps {
  day: number;
  year: number;
  month: number;
  todayStr: string;
  dayEvents: CalendarEvent[];
  isSelected: boolean;
  onClick: () => void;
}

function DayCell({ day, year, month, todayStr, dayEvents, isSelected, onClick }: DayCellProps) {
  const dateStr = toDateString(year, month, day);
  const isToday = dateStr === todayStr;
  const visibleEvents = dayEvents.slice(0, MAX_VISIBLE_DOTS);
  const overflow = dayEvents.length - MAX_VISIBLE_DOTS;

  return (
    <button
      onClick={onClick}
      className="relative w-full aspect-square sm:aspect-auto sm:min-h-[80px] flex flex-col items-center sm:items-start rounded-xl p-1 sm:p-2 transition-all duration-150 group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
      style={{
        background: isSelected
          ? 'linear-gradient(135deg, #ecfdf5, #d1fae5)'
          : isToday
          ? 'rgba(16, 185, 129, 0.08)'
          : 'transparent',
        border: isSelected
          ? '1.5px solid #10b981'
          : isToday
          ? '1.5px solid rgba(16, 185, 129, 0.4)'
          : '1px solid transparent',
        boxShadow: isSelected ? '0 2px 12px rgba(16,185,129,0.15)' : undefined,
      }}
    >
      {/* Day number */}
      <span
        className={`
          flex items-center justify-center w-7 h-7 rounded-full font-dm-sans text-sm font-medium transition-all duration-150
          ${!isToday && !isSelected ? 'group-hover:bg-emerald-50' : ''}
        `}
        style={
          isToday
            ? {
                background: 'linear-gradient(135deg, #059669, #10b981)',
                boxShadow: '0 2px 8px rgba(16,185,129,0.4)',
                color: '#ffffff',
                fontWeight: 700,
              }
            : {
                color: isSelected ? '#047857' : 'var(--text-primary)',
                fontWeight: isSelected ? 600 : undefined,
              }
        }
      >
        {day}
      </span>

      {/* Mobile: dots row */}
      {dayEvents.length > 0 && (
        <div className="flex sm:hidden gap-0.5 mt-1 flex-wrap justify-center">
          {visibleEvents.map((ev) => (
            <EventDot key={ev.id} type={ev.type} size={5} />
          ))}
          {overflow > 0 && (
            <span
              className="font-dm-mono text-[8px] leading-none self-center"
              style={{ color: 'var(--text-muted)' }}
            >
              +{overflow}
            </span>
          )}
        </div>
      )}

      {/* Desktop: compact chips */}
      {dayEvents.length > 0 && (
        <div className="hidden sm:flex flex-col gap-0.5 w-full mt-1">
          {visibleEvents.map((ev) => (
            <EventChip key={ev.id} event={ev} compact />
          ))}
          {overflow > 0 && (
            <div
              className="w-full text-center rounded px-1 py-0.5 font-dm-mono text-[10px] font-bold"
              style={{ background: '#f1f5f9', color: '#64748b' }}
            >
              +{overflow} more
            </div>
          )}
        </div>
      )}
    </button>
  );
}

// ── Side Panel ────────────────────────────────────────────────────────────────

interface SidePanelProps {
  selectedDate: string | null;
  dayEvents: CalendarEvent[];
  onClose: () => void;
}

function SidePanel({ selectedDate, dayEvents, onClose }: SidePanelProps) {
  const isOpen = !!selectedDate;

  return (
    <div
      className={`
        fixed inset-y-0 right-0 z-50 w-full sm:w-96
        transition-transform transition-opacity duration-300 ease-out
        ${isOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 pointer-events-none'}
      `}
      style={{
        background: 'var(--bg-secondary)',
        borderLeft: '1px solid var(--border-light)',
        boxShadow: '-12px 0 40px rgba(0,0,0,0.12)',
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Day events"
    >
      {/* Panel header */}
      <div
        className="flex items-center justify-between px-5 py-4 sticky top-0 z-10"
        style={{
          background: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border-light)',
        }}
      >
        <div>
          <h3 className="font-syne font-bold text-base" style={{ color: 'var(--text-primary)' }}>
            {selectedDate ? formatEventDate(selectedDate) : ''}
          </h3>
          <p className="font-dm-mono text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {dayEvents.length === 0
              ? 'No events'
              : `${dayEvents.length} event${dayEvents.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-emerald-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
          style={{ color: 'var(--text-muted)', border: '1px solid var(--border-light)' }}
          aria-label="Close panel"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Events */}
      <div className="overflow-y-auto h-full pb-24 px-4 py-4 space-y-3">
        {dayEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 opacity-50">
            <span className="text-4xl">📅</span>
            <p className="font-dm-sans text-sm text-center" style={{ color: 'var(--text-muted)' }}>
              Nothing scheduled for this day.
            </p>
          </div>
        ) : (
          dayEvents.map((ev) => <EventChip key={ev.id} event={ev} />)
        )}
      </div>
    </div>
  );
}

// ── Overlay backdrop (mobile) ─────────────────────────────────────────────────

function Overlay({ visible, onClick }: { visible: boolean; onClick: () => void }) {
  if (!visible) return null;
  return (
    <div
      className="fixed inset-0 z-40 sm:hidden bg-black/40 backdrop-blur-sm animate-fade-in"
      onClick={onClick}
      aria-hidden="true"
    />
  );
}

// ── Upcoming Events Timeline ──────────────────────────────────────────────────

function UpcomingTimeline({
  onSelectDate,
}: {
  onSelectDate: (date: string, year: number, month: number) => void;
}) {
  const upcoming = getUpcomingEvents(8);

  if (upcoming.length === 0) {
    return (
      <div className="text-center py-8 opacity-50">
        <p className="font-dm-sans text-sm" style={{ color: 'var(--text-muted)' }}>
          No upcoming events found.
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Vertical timeline line */}
      <div
        className="absolute left-[19px] top-5 bottom-5 w-0.5 rounded-full"
        style={{ background: 'linear-gradient(to bottom, #10b981, #3b82f6, transparent)' }}
        aria-hidden="true"
      />

      <div className="space-y-3">
        {upcoming.map((ev, idx) => {
          const cfg = EVENT_TYPE_CONFIG[ev.type];
          const [y, m] = ev.date.split('-').map(Number);
          return (
            <button
              key={ev.id}
              onClick={() => onSelectDate(ev.date, y, m)}
              className="group relative w-full flex items-start gap-4 text-left transition-all duration-200 hover:translate-x-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded-2xl"
              style={{ animationDelay: `${idx * 40}ms` }}
            >
              {/* Timeline node */}
              <div
                className="relative z-10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm transition-transform duration-200 group-hover:scale-110"
                style={{ background: cfg.bg, border: `2px solid ${cfg.dot}` }}
                aria-hidden="true"
              >
                <span className="text-base leading-none">{ev.icon ?? '📌'}</span>
              </div>

              {/* Card */}
              <div
                className="flex-1 min-w-0 p-3 rounded-2xl transition-all duration-200 group-hover:shadow-md"
                style={{
                  background: 'var(--bg-glass)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  border: '1px solid var(--border-light)',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <h4
                    className="font-dm-sans font-semibold text-sm leading-snug group-hover:text-emerald-600 transition-colors"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {ev.title}
                  </h4>
                  <span
                    className="flex-shrink-0 font-dm-mono text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap"
                    style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}
                  >
                    {cfg.label}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                  <span className="font-dm-mono text-xs font-medium" style={{ color: cfg.color }}>
                    {formatUpcomingDate(ev.date)}
                  </span>
                  {ev.endDate && ev.endDate !== ev.date && (
                    <span className="font-dm-mono text-[10px]" style={{ color: 'var(--text-muted)' }}>
                      → {formatUpcomingDate(ev.endDate)}
                    </span>
                  )}
                </div>
                {ev.description && (
                  <p
                    className="font-dm-sans text-xs mt-1.5 leading-relaxed line-clamp-2"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {ev.description}
                  </p>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Legend ────────────────────────────────────────────────────────────────────

function CalendarLegend() {
  return (
    <div className="flex flex-wrap gap-x-5 gap-y-2">
      {(Object.entries(EVENT_TYPE_CONFIG) as [EventType, (typeof EVENT_TYPE_CONFIG)[EventType]][]).map(
        ([type, cfg]) => (
          <div key={type} className="flex items-center gap-1.5">
            <span
              className="inline-block w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ background: cfg.dot }}
            />
            <span className="font-dm-sans text-xs" style={{ color: 'var(--text-muted)' }}>
              {cfg.label}
            </span>
          </div>
        ),
      )}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function SchoolCalendar() {
  const today = todayString();
  const [currentYear, setCurrentYear] = useState<number>(() => new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(() => new Date().getMonth() + 1);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);

  // Escape key closes panel
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') closePanel();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  const closePanel = useCallback(() => {
    setPanelOpen(false);
    setSelectedDate(null);
  }, []);

  const selectDate = useCallback((dateStr: string) => {
    setSelectedDate(dateStr);
    setPanelOpen(true);
  }, []);

  const goToPrevMonth = useCallback(() => {
    if (currentMonth === 1) { setCurrentMonth(12); setCurrentYear((y) => y - 1); }
    else setCurrentMonth((m) => m - 1);
  }, [currentMonth]);

  const goToNextMonth = useCallback(() => {
    if (currentMonth === 12) { setCurrentMonth(1); setCurrentYear((y) => y + 1); }
    else setCurrentMonth((m) => m + 1);
  }, [currentMonth]);

  const goToToday = useCallback(() => {
    const now = new Date();
    setCurrentYear(now.getFullYear());
    setCurrentMonth(now.getMonth() + 1);
    selectDate(today);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [today, selectDate]);

  // Build grid
  const numDays = daysInMonth(currentYear, currentMonth);
  const startDay = firstDayOfMonth(currentYear, currentMonth);
  const totalCells = Math.ceil((startDay + numDays) / 7) * 7;
  const eventsByDate = buildMonthEventMap(currentYear, currentMonth);
  const selectedDayEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-5xl mx-auto space-y-8 animate-fade-in-up">

        {/* ── Page header ────────────────────────────────────────────────────── */}
        <div className="text-center space-y-2 pt-2">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full font-dm-mono text-xs font-bold tracking-wider uppercase mb-2"
            style={{
              background: 'linear-gradient(135deg, #ecfdf5, #d1fae5)',
              border: '1px solid #a7f3d0',
              color: '#047857',
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            School Year 2025–2026
          </div>
          <h1 className="font-syne font-black text-3xl sm:text-4xl text-gradient-blue-emerald">
            School Calendar
          </h1>
          <p className="font-dm-sans text-base max-w-lg mx-auto" style={{ color: 'var(--text-muted)' }}>
            Holidays, breaks, events & key deadlines for Emerald High School.
          </p>
        </div>

        {/* ── Calendar card ───────────────────────────────────────────────────── */}
        <div
          className="rounded-3xl overflow-hidden"
          style={{
            background: 'var(--bg-glass)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid var(--border-light)',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          {/* Month navigation */}
          <div
            className="flex items-center justify-between px-5 py-4"
            style={{ borderBottom: '1px solid var(--border-light)' }}
          >
            <button
              onClick={goToPrevMonth}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-150 hover:bg-emerald-50 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
              style={{ color: 'var(--text-muted)', border: '1px solid var(--border-light)' }}
              aria-label="Previous month"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div className="text-center">
              <h2 className="font-syne font-black text-2xl sm:text-3xl text-gradient-blue-emerald" style={{ lineHeight: 1.1 }}>
                {MONTHS[currentMonth - 1]}
              </h2>
              <div className="font-dm-mono text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
                {currentYear}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={goToToday}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-dm-sans text-xs font-semibold transition-all duration-150 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                style={{
                  background: 'linear-gradient(135deg, #ecfdf5, #d1fae5)',
                  border: '1px solid #a7f3d0',
                  color: '#047857',
                }}
              >
                Today
              </button>
              <button
                onClick={goToNextMonth}
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-150 hover:bg-emerald-50 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                style={{ color: 'var(--text-muted)', border: '1px solid var(--border-light)' }}
                aria-label="Next month"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Day-of-week header row */}
          <div className="grid grid-cols-7 px-2 pt-3 pb-1">
            {DAYS_OF_WEEK.map((day) => (
              <div
                key={day}
                className="text-center font-dm-mono text-xs font-bold tracking-wider uppercase pb-2"
                style={{ color: 'var(--text-muted)' }}
              >
                <span className="hidden sm:inline">{day}</span>
                <span className="sm:hidden">{day.charAt(0)}</span>
              </div>
            ))}
          </div>

          {/* Calendar grid cells */}
          <div className="grid grid-cols-7 gap-1 px-2 pb-3">
            {Array.from({ length: totalCells }).map((_, idx) => {
              const dayNum = idx - startDay + 1;
              if (dayNum < 1 || dayNum > numDays) {
                return <div key={`empty-${idx}`} className="rounded-xl" aria-hidden="true" />;
              }
              const dateStr = toDateString(currentYear, currentMonth, dayNum);
              const dayEvents = eventsByDate.get(dateStr) ?? [];
              return (
                <DayCell
                  key={dateStr}
                  day={dayNum}
                  year={currentYear}
                  month={currentMonth}
                  todayStr={today}
                  dayEvents={dayEvents}
                  isSelected={selectedDate === dateStr}
                  onClick={() => selectDate(dateStr)}
                />
              );
            })}
          </div>

          {/* Legend */}
          <div
            className="px-5 py-4"
            style={{ borderTop: '1px solid var(--border-light)' }}
          >
            <CalendarLegend />
          </div>
        </div>

        {/* ── Upcoming events timeline ─────────────────────────────────────────── */}
        <section
          className="rounded-3xl p-6"
          style={{
            background: 'var(--bg-glass)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid var(--border-light)',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 text-lg shadow-sm"
              style={{
                background: 'linear-gradient(135deg, #ecfdf5, #d1fae5)',
                border: '1px solid #a7f3d0',
              }}
            >
              🗓️
            </div>
            <div>
              <h2 className="font-syne font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
                Upcoming Events
              </h2>
              <p className="font-dm-sans text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
                Next 8 events — click any to view on the calendar
              </p>
            </div>
          </div>

          <UpcomingTimeline
            onSelectDate={(date, year, month) => {
              setCurrentYear(year);
              setCurrentMonth(month);
              selectDate(date);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </section>

        {/* ── Footer ──────────────────────────────────────────────────────────── */}
        <div className="text-center pb-4">
          <p className="font-dm-mono text-[10px] tracking-wider" style={{ color: 'var(--text-subtle)' }}>
            EMERALD HIGH SCHOOL • DUBLIN UNIFIED SCHOOL DISTRICT • DUBLIN, CA 94568
          </p>
        </div>
      </div>

      {/* ── Side panel overlay (mobile) ──────────────────────────────────────── */}
      <Overlay visible={panelOpen} onClick={closePanel} />

      {/* ── Side panel ──────────────────────────────────────────────────────── */}
      <SidePanel
        selectedDate={selectedDate}
        dayEvents={selectedDayEvents}
        onClose={closePanel}
      />
    </div>
  );
}
