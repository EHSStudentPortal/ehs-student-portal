'use client';

import { useState, useEffect } from 'react';
import { standardSchedule, minimumDaySchedule, timeToMinutes, formatTime, type Period, type Schedule } from '@/data/schedule';

export default function BellSchedule() {
  const [scheduleType, setScheduleType] = useState<'standard' | 'minimum'>('standard');
  const [now, setNow] = useState<Date | null>(null);
  const [currentMinutes, setCurrentMinutes] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem('ehs-schedule-type') as 'standard' | 'minimum' | null;
    if (stored) setScheduleType(stored);

    const update = () => {
      const d = new Date();
      setNow(d);
      setCurrentMinutes(d.getHours() * 60 + d.getMinutes() + d.getSeconds() / 60);
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleScheduleChange = (type: 'standard' | 'minimum') => {
    setScheduleType(type);
    localStorage.setItem('ehs-schedule-type', type);
  };

  const schedule: Schedule = scheduleType === 'standard' ? standardSchedule : minimumDaySchedule;

  const getStatus = (period: Period) => {
    const start = timeToMinutes(period.startTime);
    const end = timeToMinutes(period.endTime);
    if (currentMinutes >= start && currentMinutes < end) return 'active';
    if (currentMinutes < start) return 'upcoming';
    return 'past';
  };

  const getProgress = (period: Period) => {
    const start = timeToMinutes(period.startTime);
    const end = timeToMinutes(period.endTime);
    if (currentMinutes < start) return 0;
    if (currentMinutes >= end) return 100;
    return Math.round(((currentMinutes - start) / (end - start)) * 100);
  };

  const getTimeRemaining = (period: Period) => {
    const end = timeToMinutes(period.endTime);
    const remaining = end - currentMinutes;
    const h = Math.floor(remaining / 60);
    const m = Math.floor(remaining % 60);
    const s = Math.floor((remaining % 1) * 60);
    if (h > 0) return `${h}h ${m}m ${s}s`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  };

  const activePeriod = schedule.periods.find(p => getStatus(p) === 'active');
  const nextPeriod = schedule.periods.find(p => getStatus(p) === 'upcoming');

  const getPeriodDuration = (period: Period) =>
    timeToMinutes(period.endTime) - timeToMinutes(period.startTime);

  const typeConfig: Record<string, { color: string; label: string; bg: string }> = {
    class:  { color: '#10b981', label: 'Class',  bg: 'rgba(16,185,129,0.1)' },
    break:  { color: '#f59e0b', label: 'Break',  bg: 'rgba(245,158,11,0.1)' },
    lunch:  { color: '#3b82f6', label: 'Lunch',  bg: 'rgba(59,130,246,0.1)' },
    before: { color: '#6b7280', label: '',        bg: 'transparent' },
    after:  { color: '#6b7280', label: '',        bg: 'transparent' },
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 mb-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #059669, #10b981)' }}
            >
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="font-dm-mono text-xs tracking-widest uppercase text-emerald-500">Live</span>
          </div>
          <h1 className="font-syne font-black text-3xl sm:text-4xl" style={{ color: 'var(--text-primary)' }}>
            Bell Schedule
          </h1>
          <p className="font-dm-sans text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            Updates every second • {now?.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Toggle */}
        <div
          className="flex items-center p-1 rounded-xl border"
          style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-light)' }}
        >
          {(['standard', 'minimum'] as const).map((type) => (
            <button
              key={type}
              onClick={() => handleScheduleChange(type)}
              className="px-5 py-2.5 rounded-lg font-dm-sans text-sm font-medium transition-all duration-200"
              style={
                scheduleType === type
                  ? { background: 'linear-gradient(135deg, #059669, #10b981)', color: 'white', boxShadow: '0 2px 8px rgba(16,185,129,0.3)' }
                  : { color: 'var(--text-muted)' }
              }
            >
              {type === 'standard' ? 'Standard' : 'Minimum Day'}
            </button>
          ))}
        </div>
      </div>

      {/* Live status card */}
      {now && (
        <div className="mb-8 animate-fade-in">
          {activePeriod ? (
            <div
              className="rounded-2xl p-6 overflow-hidden relative"
              style={{
                background: 'linear-gradient(135deg, #047857 0%, #065f46 100%)',
                boxShadow: '0 8px 32px rgba(5,150,105,0.3)',
              }}
            >
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)', transform: 'translate(60px, -60px)' }} />

              <div className="relative flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-300 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-400" />
                    </span>
                    <span className="font-dm-mono text-xs uppercase tracking-wider text-emerald-200">Now in Progress</span>
                  </div>
                  <h2 className="font-syne font-black text-3xl text-white mb-1">{activePeriod.name}</h2>
                  <p className="font-dm-mono text-emerald-200/70 text-sm">
                    {formatTime(activePeriod.startTime)} – {formatTime(activePeriod.endTime)}
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-dm-mono text-emerald-200/60 text-xs uppercase tracking-wider mb-1">Time Remaining</div>
                  <div
                    className="font-dm-mono font-bold text-4xl text-white tabular-nums"
                    style={{ textShadow: '0 2px 12px rgba(16,185,129,0.4)' }}
                  >
                    {getTimeRemaining(activePeriod)}
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="relative mt-6">
                <div className="flex justify-between font-dm-mono text-xs text-emerald-200/50 mb-2">
                  <span>{formatTime(activePeriod.startTime)}</span>
                  <span className="text-emerald-300 font-medium">{getProgress(activePeriod)}% complete</span>
                  <span>{formatTime(activePeriod.endTime)}</span>
                </div>
                <div className="h-2.5 bg-white/15 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: `${getProgress(activePeriod)}%`,
                      background: 'linear-gradient(90deg, #34d399, #60a5fa)',
                      boxShadow: '0 0 12px rgba(52,211,153,0.5)',
                    }}
                  />
                </div>
              </div>

              {nextPeriod && (
                <div className="relative mt-4 pt-4 border-t border-white/15 flex items-center justify-between">
                  <span className="font-dm-sans text-emerald-200/70 text-sm">
                    Next: <span className="text-white font-medium">{nextPeriod.name}</span>
                  </span>
                  <span className="font-dm-mono text-emerald-200/60 text-sm">{formatTime(nextPeriod.startTime)}</span>
                </div>
              )}
            </div>
          ) : nextPeriod ? (
            <div
              className="rounded-2xl p-6 border"
              style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-medium)' }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                <span className="font-dm-mono text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  Passing Period
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
                <div>
                  <h2 className="font-syne font-bold text-2xl" style={{ color: 'var(--text-primary)' }}>
                    Coming Up: {nextPeriod.name}
                  </h2>
                  <p className="font-dm-mono mt-1" style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                    Starts at {formatTime(nextPeriod.startTime)}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div
              className="rounded-2xl p-6 border text-center"
              style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-light)' }}
            >
              <div className="text-3xl mb-3">🌿</div>
              <div className="font-syne font-bold text-xl mb-1" style={{ color: 'var(--text-primary)' }}>
                School day complete!
              </div>
              <p className="font-dm-sans text-sm" style={{ color: 'var(--text-muted)' }}>
                See you tomorrow, Shamrocks!
              </p>
            </div>
          )}
        </div>
      )}

      {/* Schedule heading */}
      <div className="flex items-center gap-3 mb-4">
        <h2 className="font-dm-mono text-xs uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
          {schedule.name} — All Periods
        </h2>
        <div className="flex-1 h-px" style={{ background: 'var(--border-light)' }} />
      </div>

      {/* Period list */}
      <div className="space-y-2">
        {schedule.periods.map((period, idx) => {
          const status = getStatus(period);
          const progress = getProgress(period);
          const duration = getPeriodDuration(period);
          const config = typeConfig[period.type] || typeConfig.class;

          return (
            <div
              key={period.id}
              className="relative rounded-xl overflow-hidden border transition-all duration-300"
              style={{
                borderColor: status === 'active'
                  ? 'rgba(16,185,129,0.4)'
                  : status === 'past'
                  ? 'var(--border-light)'
                  : 'var(--border-light)',
                background: status === 'active'
                  ? 'rgba(16,185,129,0.04)'
                  : status === 'past'
                  ? 'transparent'
                  : 'var(--bg-secondary)',
                opacity: status === 'past' ? 0.5 : 1,
              }}
            >
              {/* Active progress overlay */}
              {status === 'active' && (
                <div
                  className="absolute top-0 left-0 bottom-0 pointer-events-none transition-all duration-1000"
                  style={{
                    width: `${progress}%`,
                    background: 'rgba(16,185,129,0.04)',
                  }}
                />
              )}

              <div className="relative flex items-center gap-4 px-4 py-4">
                {/* Color strip */}
                <div
                  className="w-1 h-12 flex-shrink-0 rounded-full"
                  style={{ background: config.color }}
                />

                {/* Period number badge */}
                <div className="w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-xl"
                  style={{ background: config.bg }}>
                  {period.type === 'class' ? (
                    <span className="font-syne font-black text-sm" style={{ color: config.color }}>
                      {idx <= 1 ? idx + 1 : period.name.replace('Period ', '')}
                    </span>
                  ) : (
                    <span className="text-base">
                      {period.type === 'lunch' ? '🍽' : period.type === 'break' ? '☕' : '·'}
                    </span>
                  )}
                </div>

                {/* Period info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className="font-syne font-bold text-sm"
                      style={{ color: status === 'active' ? config.color : 'var(--text-primary)' }}
                    >
                      {period.name}
                    </span>
                    {status === 'active' && (
                      <span className="flex items-center gap-1.5">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: config.color }} />
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ background: config.color }} />
                        </span>
                        <span className="font-dm-mono text-xs uppercase tracking-wider" style={{ color: config.color }}>Live</span>
                      </span>
                    )}
                  </div>
                  <div className="font-dm-mono text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    {formatTime(period.startTime)} – {formatTime(period.endTime)}
                  </div>
                </div>

                {/* Duration */}
                <div className="text-right hidden sm:block">
                  <div className="font-dm-mono text-xs" style={{ color: 'var(--text-muted)' }}>
                    {duration} min
                  </div>
                  {config.label && (
                    <div
                      className="font-dm-mono text-[10px] uppercase tracking-wider mt-0.5"
                      style={{ color: config.color }}
                    >
                      {config.label}
                    </div>
                  )}
                </div>

                {/* Active countdown */}
                {status === 'active' && (
                  <div className="text-right ml-2">
                    <div
                      className="font-dm-mono font-bold text-base tabular-nums"
                      style={{ color: config.color }}
                    >
                      {getTimeRemaining(period)}
                    </div>
                    <div className="font-dm-mono text-[10px]" style={{ color: 'var(--text-muted)' }}>remaining</div>
                  </div>
                )}
              </div>

              {/* Active period bottom progress bar */}
              {status === 'active' && (
                <div className="h-0.5 w-full" style={{ background: 'var(--border-light)' }}>
                  <div
                    className="h-full transition-all duration-1000"
                    style={{
                      width: `${progress}%`,
                      background: `linear-gradient(90deg, ${config.color}, #60a5fa)`,
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div
        className="mt-8 p-4 rounded-xl border flex flex-wrap items-center gap-6"
        style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-light)' }}
      >
        <span className="font-dm-mono text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
          Legend
        </span>
        {[
          { color: '#10b981', label: 'Class Period' },
          { color: '#f59e0b', label: 'Break / Brunch' },
          { color: '#3b82f6', label: 'Lunch' },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ background: color }} />
            <span className="font-dm-sans text-xs" style={{ color: 'var(--text-muted)' }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
