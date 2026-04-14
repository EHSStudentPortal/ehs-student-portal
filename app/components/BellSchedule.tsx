'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  mondaySchedule,
  tuesdaySchedule,
  wednesdaySchedule,
  thursdaySchedule,
  fridaySchedule,
  scheduleByDay,
  timeToMinutes,
  formatTime,
  type Period,
  type DaySchedule,
} from '@/data/schedule';

// ============================================================
// Types & constants
// ============================================================

const DAY_TABS = [
  { label: 'MON', dayNum: 1, schedule: mondaySchedule },
  { label: 'TUE', dayNum: 2, schedule: tuesdaySchedule },
  { label: 'WED', dayNum: 3, schedule: wednesdaySchedule },
  { label: 'THU', dayNum: 4, schedule: thursdaySchedule },
  { label: 'FRI', dayNum: 5, schedule: fridaySchedule },
] as const;

type DayNum = 1 | 2 | 3 | 4 | 5;

// ============================================================
// Small helper sub-components
// ============================================================

function PulseDot({ color = '#10b981' }: { color?: string }) {
  return (
    <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
      <span
        className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
        style={{ background: color }}
      />
      <span
        className="relative inline-flex rounded-full h-2.5 w-2.5"
        style={{ background: color }}
      />
    </span>
  );
}

function LunchIcon() {
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
      />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
      />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
      />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

// ============================================================
// Helpers
// ============================================================

function getPeriodStatus(
  period: Period,
  currentMinutes: number
): 'active' | 'past' | 'upcoming' {
  const start = timeToMinutes(period.startTime);
  const end = timeToMinutes(period.endTime);
  if (currentMinutes >= start && currentMinutes < end) return 'active';
  if (currentMinutes >= end) return 'past';
  return 'upcoming';
}

function getProgress(period: Period, currentMinutes: number): number {
  const start = timeToMinutes(period.startTime);
  const end = timeToMinutes(period.endTime);
  if (currentMinutes < start) return 0;
  if (currentMinutes >= end) return 100;
  return Math.min(100, Math.max(0, ((currentMinutes - start) / (end - start)) * 100));
}

function getMinutesRemaining(period: Period, currentMinutes: number): number {
  return Math.max(0, timeToMinutes(period.endTime) - currentMinutes);
}

function formatMinutes(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = Math.floor(mins % 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m} min`;
}

function getPeriodIcon(period: Period) {
  if (period.type === 'lunch') return <LunchIcon />;
  if (period.type === 'access') return <BookIcon />;
  if (period.type === 'staff') return <LockIcon />;
  return null;
}

function getPeriodAccentColor(period: Period): string {
  switch (period.type) {
    case 'lunch':  return '#3b82f6';
    case 'access': return '#8b5cf6';
    case 'staff':  return '#6b7280';
    case 'break':  return '#f59e0b';
    default:       return '#10b981';
  }
}

function normaliseToWeekday(dayNum: number): DayNum {
  if (dayNum === 0 || dayNum === 6) return 5; // weekend → Friday
  return dayNum as DayNum;
}

// ============================================================
// Active period "Now in Progress" card
// ============================================================

interface ActiveCardProps {
  activePeriod: Period;
  nextPeriod: Period | null;
  currentMinutes: number;
}

function ActivePeriodCard({ activePeriod, nextPeriod, currentMinutes }: ActiveCardProps) {
  const progress = getProgress(activePeriod, currentMinutes);
  const minsLeft = getMinutesRemaining(activePeriod, currentMinutes);

  return (
    <div
      className="rounded-2xl p-6 overflow-hidden relative animate-fade-in"
      style={{
        background: 'linear-gradient(135deg, #047857 0%, #065f46 50%, #1e3a5f 100%)',
        boxShadow: '0 8px 32px rgba(5,150,105,0.35)',
      }}
    >
      {/* Background orb decoration */}
      <div
        className="absolute top-0 right-0 w-72 h-72 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(16,185,129,0.18) 0%, transparent 70%)',
          transform: 'translate(50px, -50px)',
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-48 h-48 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(96,165,250,0.12) 0%, transparent 70%)',
          transform: 'translate(-30px, 30px)',
        }}
      />

      <div className="relative">
        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <PulseDot color="#34d399" />
              <span className="font-dm-mono text-xs uppercase tracking-wider text-emerald-200">
                Now in Progress
              </span>
            </div>
            <h2 className="font-syne font-black text-3xl sm:text-4xl text-white mb-1 leading-tight">
              {activePeriod.name}
            </h2>
            <p className="font-dm-mono text-emerald-200/70 text-sm">
              {formatTime(activePeriod.startTime)} – {formatTime(activePeriod.endTime)}
              {activePeriod.blockDay && (
                <span className="ml-2 text-emerald-300/80">· 90 min block</span>
              )}
            </p>
          </div>

          {/* Time remaining */}
          <div className="text-left sm:text-right flex-shrink-0">
            <div className="font-dm-mono text-emerald-200/60 text-xs uppercase tracking-wider mb-1">
              Time Remaining
            </div>
            <div
              className="font-dm-mono font-bold text-4xl text-white tabular-nums"
              style={{ textShadow: '0 2px 12px rgba(52,211,153,0.4)' }}
            >
              {formatMinutes(minsLeft)}
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-6">
          <div className="flex justify-between font-dm-mono text-xs text-emerald-200/50 mb-2">
            <span>{formatTime(activePeriod.startTime)}</span>
            <span className="text-emerald-300 font-medium">{Math.round(progress)}% complete</span>
            <span>{formatTime(activePeriod.endTime)}</span>
          </div>
          <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.12)' }}>
            <div
              className="h-full rounded-full transition-all duration-[60000ms] ease-linear"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #34d399, #60a5fa)',
                boxShadow: '0 0 12px rgba(52,211,153,0.5)',
              }}
            />
          </div>
        </div>

        {/* Next period */}
        {nextPeriod && (
          <div className="mt-4 pt-4 border-t border-white/15 flex items-center justify-between">
            <span className="font-dm-sans text-emerald-200/70 text-sm">
              Next:{' '}
              <span className="text-white font-semibold">{nextPeriod.name}</span>
            </span>
            <span className="font-dm-mono text-emerald-200/60 text-sm">
              {formatTime(nextPeriod.startTime)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// "Between periods" card
// ============================================================

function BetweenPeriodsCard({ nextPeriod }: { nextPeriod: Period | null }) {
  if (!nextPeriod) {
    return (
      <div
        className="rounded-2xl p-6 border text-center animate-fade-in"
        style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-light)' }}
      >
        <div className="w-12 h-12 rounded-2xl mx-auto mb-4 flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #059669, #10b981)' }}>
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        </div>
        <div className="font-syne font-bold text-xl mb-1" style={{ color: 'var(--text-primary)' }}>
          School day complete!
        </div>
        <p className="font-dm-sans text-sm" style={{ color: 'var(--text-muted)' }}>
          See you tomorrow, Aeronauts!
        </p>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl p-6 border animate-fade-in"
      style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-medium)' }}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse flex-shrink-0" />
        <span className="font-dm-mono text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
          Passing Period
        </span>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
        <div>
          <h2 className="font-syne font-bold text-2xl" style={{ color: 'var(--text-primary)' }}>
            Coming Up: {nextPeriod.name}
          </h2>
          <p className="font-dm-mono mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>
            Starts at {formatTime(nextPeriod.startTime)}
          </p>
        </div>
        <div
          className="flex-shrink-0 px-4 py-2 rounded-xl font-dm-mono text-sm font-medium text-white"
          style={{ background: 'linear-gradient(135deg, #059669, #10b981)' }}
        >
          {formatTime(nextPeriod.startTime)}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Single period row
// ============================================================

interface PeriodRowProps {
  period: Period;
  status: 'active' | 'past' | 'upcoming';
  progress: number;
  minsLeft: number;
  isToday: boolean;
}

function PeriodRow({ period, status, progress, minsLeft, isToday }: PeriodRowProps) {
  const accent = getPeriodAccentColor(period);
  const icon = getPeriodIcon(period);
  const duration = timeToMinutes(period.endTime) - timeToMinutes(period.startTime);

  const isActive = status === 'active' && isToday;
  const isPast = status === 'past' && isToday;

  return (
    <div
      className="relative rounded-xl overflow-hidden border transition-all duration-300"
      style={{
        borderColor: isActive
          ? `${accent}66`
          : 'var(--border-light)',
        background: isActive
          ? `${accent}08`
          : isPast
          ? 'transparent'
          : 'var(--bg-secondary)',
        opacity: isPast ? 0.48 : 1,
        borderLeftWidth: isActive ? 3 : 1,
        borderLeftColor: isActive ? accent : 'var(--border-light)',
      }}
    >
      {/* Active background fill overlay */}
      {isActive && (
        <div
          className="absolute top-0 left-0 bottom-0 pointer-events-none transition-all duration-[60000ms] ease-linear"
          style={{ width: `${progress}%`, background: `${accent}06` }}
        />
      )}

      <div className="relative flex items-center gap-3 px-4 py-3.5">
        {/* Color strip */}
        <div
          className="w-1 h-10 flex-shrink-0 rounded-full"
          style={{ background: isActive ? accent : isPast ? '#cbd5e1' : accent, opacity: isPast ? 0.4 : 1 }}
        />

        {/* Icon / badge */}
        <div
          className="w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-xl"
          style={{ background: `${accent}14`, color: accent }}
        >
          {icon ?? (
            <span className="font-syne font-black text-sm" style={{ color: accent }}>
              {period.name.replace('Period ', '')}
            </span>
          )}
        </div>

        {/* Period info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Name — strikethrough if past */}
            <span
              className={`font-syne font-bold text-sm ${isPast ? 'line-through' : ''}`}
              style={{ color: isActive ? accent : 'var(--text-primary)' }}
            >
              {period.name}
            </span>

            {/* Optional badge */}
            {period.optional && (
              <span
                className="font-dm-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full"
                style={{
                  background: 'rgba(148,163,184,0.15)',
                  color: 'var(--text-subtle)',
                  border: '1px solid rgba(148,163,184,0.25)',
                }}
              >
                Optional
              </span>
            )}

            {/* Block day badge */}
            {period.blockDay && (
              <span
                className="font-dm-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full"
                style={{
                  background: 'rgba(96,165,250,0.12)',
                  color: '#3b82f6',
                  border: '1px solid rgba(96,165,250,0.25)',
                }}
              >
                90 min
              </span>
            )}

            {/* Active live dot */}
            {isActive && (
              <span className="flex items-center gap-1.5">
                <span className="relative flex h-1.5 w-1.5">
                  <span
                    className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                    style={{ background: accent }}
                  />
                  <span
                    className="relative inline-flex rounded-full h-1.5 w-1.5"
                    style={{ background: accent }}
                  />
                </span>
                <span className="font-dm-mono text-[10px] uppercase tracking-wider" style={{ color: accent }}>
                  Live
                </span>
              </span>
            )}

            {/* Staff note */}
            {period.type === 'staff' && (
              <span
                className="font-dm-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full"
                style={{
                  background: 'rgba(107,114,128,0.1)',
                  color: '#6b7280',
                  border: '1px solid rgba(107,114,128,0.2)',
                }}
              >
                Staff only
              </span>
            )}
          </div>
          <div className="font-dm-mono text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {formatTime(period.startTime)} – {formatTime(period.endTime)}
          </div>
        </div>

        {/* Right: duration + countdown */}
        <div className="text-right flex-shrink-0 hidden sm:block">
          <div className="font-dm-mono text-xs" style={{ color: 'var(--text-muted)' }}>
            {duration} min
          </div>
        </div>

        {isActive && isToday && (
          <div className="text-right flex-shrink-0 ml-1">
            <div className="font-dm-mono font-bold text-sm tabular-nums" style={{ color: accent }}>
              {formatMinutes(minsLeft)}
            </div>
            <div className="font-dm-mono text-[10px]" style={{ color: 'var(--text-muted)' }}>
              left
            </div>
          </div>
        )}
      </div>

      {/* Active period bottom progress bar */}
      {isActive && isToday && (
        <div className="h-0.5 w-full" style={{ background: 'var(--border-light)' }}>
          <div
            className="h-full transition-all duration-[60000ms] ease-linear"
            style={{
              width: `${progress}%`,
              background: `linear-gradient(90deg, ${accent}, #60a5fa)`,
            }}
          />
        </div>
      )}
    </div>
  );
}

// ============================================================
// Main component
// ============================================================

export default function BellSchedule() {
  const todayDayNum = normaliseToWeekday(new Date().getDay());
  const [selectedDay, setSelectedDay] = useState<DayNum>(todayDayNum);
  const [currentMinutes, setCurrentMinutes] = useState<number>(0);
  const [mounted, setMounted] = useState(false);

  // Tick every minute
  const tick = useCallback(() => {
    const n = new Date();
    setCurrentMinutes(n.getHours() * 60 + n.getMinutes() + n.getSeconds() / 60);
  }, []);

  useEffect(() => {
    tick();
    setMounted(true);
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, [tick]);

  const schedule: DaySchedule = scheduleByDay[selectedDay] ?? fridaySchedule;
  const isViewingToday = selectedDay === todayDayNum;

  // Derive active / next from today's schedule (only when viewing today)
  const todaySchedule = scheduleByDay[todayDayNum] ?? fridaySchedule;
  const activePeriod = isViewingToday
    ? todaySchedule.periods.find((p) => getPeriodStatus(p, currentMinutes) === 'active') ?? null
    : null;
  const nextPeriod = isViewingToday
    ? todaySchedule.periods.find((p) => getPeriodStatus(p, currentMinutes) === 'upcoming') ?? null
    : null;

  const isWeekend = new Date().getDay() === 0 || new Date().getDay() === 6;

  // Block day label badge
  const blockBadge =
    schedule.dayType === 'wednesday'
      ? { label: 'ODD BLOCK', color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)', border: 'rgba(139,92,246,0.25)' }
      : schedule.dayType === 'thursday'
      ? { label: 'EVEN BLOCK', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.25)' }
      : null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 animate-fade-in">

      {/* ── Page header ── */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #059669, #10b981)' }}
          >
            <ClockIcon />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-dm-mono text-xs tracking-widest uppercase text-emerald-500">Live</span>
            <PulseDot />
          </div>
        </div>
        <h1
          className="font-syne font-black text-3xl sm:text-4xl mb-1"
          style={{ color: 'var(--text-primary)' }}
        >
          Bell Schedule
        </h1>
        <p className="font-dm-sans text-sm" style={{ color: 'var(--text-muted)' }}>
          {mounted
            ? new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
            : 'Loading...'}
          {isWeekend && (
            <span className="ml-2 font-dm-mono text-xs text-amber-500 uppercase tracking-wider">
              (Weekend — showing Friday)
            </span>
          )}
        </p>
      </div>

      {/* ── Day-of-week pill selector ── */}
      <div
        className="flex items-center p-1 rounded-2xl border mb-6 gap-1 overflow-x-auto no-scrollbar"
        style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-light)' }}
      >
        {DAY_TABS.map(({ label, dayNum }) => {
          const isActive = selectedDay === dayNum;
          const isToday = todayDayNum === dayNum;
          return (
            <button
              key={dayNum}
              onClick={() => setSelectedDay(dayNum)}
              className="relative flex-1 min-w-[52px] py-2.5 px-2 rounded-xl font-dm-mono text-xs font-medium tracking-wider uppercase transition-all duration-200 text-center"
              style={
                isActive
                  ? {
                      background: 'linear-gradient(135deg, #059669, #10b981)',
                      color: 'white',
                      boxShadow: '0 2px 10px rgba(16,185,129,0.35)',
                    }
                  : { color: 'var(--text-muted)' }
              }
            >
              {label}
              {/* Today indicator dot */}
              {isToday && !isActive && (
                <span
                  className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                  style={{ background: '#10b981' }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* ── Schedule name label + block badge ── */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <h2 className="font-syne font-bold text-base" style={{ color: 'var(--text-primary)' }}>
          {schedule.label}
        </h2>
        {blockBadge && (
          <span
            className="font-dm-mono text-[10px] uppercase tracking-widest px-3 py-1 rounded-full font-bold"
            style={{
              background: blockBadge.bg,
              color: blockBadge.color,
              border: `1px solid ${blockBadge.border}`,
            }}
          >
            {blockBadge.label}
          </span>
        )}
      </div>

      {/* ── Live status card (only when viewing today) ── */}
      {mounted && isViewingToday && (
        <div className="mb-6">
          {activePeriod ? (
            <ActivePeriodCard
              activePeriod={activePeriod}
              nextPeriod={nextPeriod}
              currentMinutes={currentMinutes}
            />
          ) : (
            <BetweenPeriodsCard nextPeriod={nextPeriod} />
          )}
        </div>
      )}

      {/* ── Section header ── */}
      <div className="flex items-center gap-3 mb-3">
        <span className="font-dm-mono text-[11px] uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
          Today&apos;s Schedule
        </span>
        <div className="flex-1 h-px" style={{ background: 'var(--border-light)' }} />
      </div>

      {/* ── Period list ── */}
      <div className="space-y-2 stagger-children">
        {schedule.periods.map((period) => {
          const status = getPeriodStatus(period, currentMinutes);
          const progress = getProgress(period, currentMinutes);
          const minsLeft = getMinutesRemaining(period, currentMinutes);
          return (
            <PeriodRow
              key={period.id}
              period={period}
              status={status}
              progress={progress}
              minsLeft={minsLeft}
              isToday={isViewingToday}
            />
          );
        })}
      </div>

      {/* ── Legend ── */}
      <div
        className="mt-8 p-4 rounded-2xl border"
        style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-light)' }}
      >
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <span className="font-dm-mono text-[11px] uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
            Legend
          </span>
          {[
            { color: '#10b981', label: 'Class Period' },
            { color: '#3b82f6', label: 'Lunch' },
            { color: '#8b5cf6', label: 'ACCESS' },
            { color: '#6b7280', label: 'Staff Collaboration' },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: color }} />
              <span className="font-dm-sans text-xs" style={{ color: 'var(--text-muted)' }}>
                {label}
              </span>
            </div>
          ))}
          <div className="flex items-center gap-2">
            <div
              className="px-1.5 py-0.5 rounded font-dm-mono text-[9px] uppercase tracking-wider"
              style={{ background: 'rgba(148,163,184,0.15)', color: 'var(--text-subtle)', border: '1px solid rgba(148,163,184,0.25)' }}
            >
              Optional
            </div>
            <span className="font-dm-sans text-xs" style={{ color: 'var(--text-muted)' }}>
              Period 0 / Period 7
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
