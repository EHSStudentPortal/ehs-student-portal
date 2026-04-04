'use client';

import { useState, useEffect, useRef } from 'react';
import { standardSchedule, minimumDaySchedule, timeToMinutes, formatTime } from '@/data/schedule';

type Tab = 'home' | 'schedule' | 'map' | 'staff' | 'classes' | 'voice';

interface HeaderProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

function LiveTicker() {
  const [now, setNow] = useState<Date | null>(null);
  const [scheduleType] = useState<'standard' | 'minimum'>('standard');

  useEffect(() => {
    setNow(new Date());
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  if (!now) return null;

  const schedule = scheduleType === 'standard' ? standardSchedule : minimumDaySchedule;
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  let currentPeriod = null;
  let nextPeriod = null;
  let timeUntilNext = 0;
  let timeRemaining = 0;
  let isInPeriod = false;

  for (let i = 0; i < schedule.periods.length; i++) {
    const period = schedule.periods[i];
    const start = timeToMinutes(period.startTime);
    const end = timeToMinutes(period.endTime);

    if (currentMinutes >= start && currentMinutes < end) {
      currentPeriod = period;
      nextPeriod = schedule.periods[i + 1] || null;
      timeRemaining = end - currentMinutes;
      isInPeriod = true;
      break;
    } else if (currentMinutes < start) {
      nextPeriod = period;
      timeUntilNext = start - currentMinutes;
      break;
    }
  }

  const formatCountdown = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = Math.floor(mins % 60);
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  };

  const timeStr = now.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
  });

  if (isInPeriod && currentPeriod) {
    return (
      <div className="hidden md:flex items-center gap-3 text-xs font-dm-mono">
        <span className="text-white/60 tabular-nums">{timeStr}</span>
        <span className="w-px h-3 bg-white/20" />
        <span className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
          </span>
          <span className="text-white font-medium">{currentPeriod.name}</span>
        </span>
        <span className="text-white/50">
          ends in{' '}
          <span className="text-emerald-300 font-medium tabular-nums">{formatCountdown(timeRemaining)}</span>
        </span>
        {nextPeriod && (
          <>
            <span className="w-px h-3 bg-white/20" />
            <span className="text-white/40">
              → {nextPeriod.name} @ {formatTime(nextPeriod.startTime)}
            </span>
          </>
        )}
      </div>
    );
  }

  if (nextPeriod && !isInPeriod) {
    return (
      <div className="hidden md:flex items-center gap-3 text-xs font-dm-mono">
        <span className="text-white/60 tabular-nums">{timeStr}</span>
        <span className="w-px h-3 bg-white/20" />
        <span className="text-white/50">
          {currentMinutes < timeToMinutes(schedule.periods[0].startTime)
            ? <>School starts in <span className="text-emerald-300 font-medium">{formatCountdown(timeUntilNext)}</span></>
            : <>Passing → <span className="text-white/80">{nextPeriod.name}</span> in <span className="text-emerald-300 font-medium">{formatCountdown(timeUntilNext)}</span></>
          }
        </span>
      </div>
    );
  }

  return (
    <div className="hidden md:flex items-center gap-3 text-xs font-dm-mono">
      <span className="text-white/60 tabular-nums">{timeStr}</span>
      <span className="w-px h-3 bg-white/20" />
      <span className="text-white/40">School day complete • See you tomorrow! 🌿</span>
    </div>
  );
}

const tabs: { id: Tab; label: string; icon: string }[] = [
  { id: 'home', label: 'Home', icon: '⌂' },
  { id: 'schedule', label: 'Bell Schedule', icon: '◷' },
  { id: 'map', label: 'Campus Map', icon: '◈' },
  { id: 'staff', label: 'Staff', icon: '◉' },
  { id: 'classes', label: 'Courses', icon: '◫' },
  { id: 'voice', label: 'SchoolVoice', icon: '◌' },
];

export default function Header({ activeTab, onTabChange }: HeaderProps) {
  const [darkMode, setDarkMode] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem('ehs-dark-mode');
    if (stored === 'true') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }

    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Animate indicator
    if (!tabsRef.current || !indicatorRef.current) return;
    const activeEl = tabsRef.current.querySelector<HTMLElement>(`[data-tab="${activeTab}"]`);
    if (!activeEl) return;
    const tabRect = activeEl.getBoundingClientRect();
    const containerRect = tabsRef.current.getBoundingClientRect();
    indicatorRef.current.style.left = `${tabRect.left - containerRect.left}px`;
    indicatorRef.current.style.width = `${tabRect.width}px`;
  }, [activeTab]);

  const toggleDark = () => {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem('ehs-dark-mode', String(next));
    if (next) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'glass-dark shadow-2xl'
            : 'bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-700'
        }`}
        style={{
          backdropFilter: scrolled ? 'blur(24px) saturate(200%)' : undefined,
        }}
      >
        {/* Gradient line at top */}
        <div className="h-px bg-gradient-to-r from-emerald-400 via-blue-400 to-green-400 opacity-60" />

        {/* Main header */}
        <div className="flex items-center justify-between px-4 sm:px-6 h-16">
          {/* Logo */}
          <button
            onClick={() => onTabChange('home')}
            className="flex items-center gap-3 group"
          >
            <div className="relative">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-900/50 transition-transform duration-300 group-hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #10b981, #3b82f6)',
                }}
              >
                <span className="font-syne font-black text-white text-sm tracking-tight">EHS</span>
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-emerald-800 animate-pulse" />
            </div>
            <div className="hidden sm:block">
              <div className="font-syne font-bold text-white text-sm leading-tight tracking-wide">
                Emerald High School
              </div>
              <div className="text-emerald-300/70 text-[10px] font-dm-mono tracking-widest uppercase">
                Dublin, CA • Student Portal
              </div>
            </div>
          </button>

          {/* Live ticker */}
          <LiveTicker />

          {/* Right controls */}
          <div className="flex items-center gap-2">
            {/* Dark mode */}
            <button
              onClick={toggleDark}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {/* Mobile menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all"
              aria-label="Menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
          </div>
        </div>

        {/* Desktop tab navigation */}
        <nav className="hidden md:block px-6 relative">
          <div ref={tabsRef} className="flex items-center gap-1 relative">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                data-tab={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`relative px-4 py-3 font-dm-sans text-sm font-medium transition-all duration-200 rounded-t-lg ${
                  activeTab === tab.id
                    ? 'text-white'
                    : 'text-white/50 hover:text-white/80'
                }`}
              >
                {tab.label}
              </button>
            ))}
            {/* Animated indicator */}
            <span
              ref={indicatorRef}
              className="absolute bottom-0 h-0.5 rounded-t-full transition-all duration-300 ease-out"
              style={{
                background: 'linear-gradient(90deg, #10b981, #3b82f6)',
                left: 0,
                width: 0,
              }}
            />
          </div>
        </nav>
      </header>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={() => setMobileMenuOpen(false)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div
            className="absolute top-16 left-0 right-0 shadow-2xl animate-fade-in-up"
            style={{ background: 'linear-gradient(135deg, #064e3b, #047857)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-4 py-3 space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => { onTabChange(tab.id); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-dm-sans text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-white/15 text-white'
                      : 'text-white/60 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  {tab.label}
                  {activeTab === tab.id && (
                    <svg className="ml-auto w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
            {/* Quick time display */}
            <div className="px-4 py-3 border-t border-white/10">
              <div className="font-dm-mono text-xs text-white/40 text-center">
                Emerald High School • Dublin, CA 94568
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
