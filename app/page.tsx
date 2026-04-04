'use client';

import { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import BellSchedule from './components/BellSchedule';
import CampusMap from './components/CampusMap';
import StaffDirectory from './components/StaffDirectory';
import ClassDirectory from './components/ClassDirectory';
import SchoolVoice from './components/SchoolVoice';
import Hero from './components/Hero';
import LunchMenu from './components/LunchMenu';
import SchoolCalendar from './components/SchoolCalendar';
import ResourcesHub from './components/ResourcesHub';
import SearchPalette from './components/SearchPalette';

type Tab = 'home' | 'schedule' | 'map' | 'staff' | 'classes' | 'voice' | 'lunch' | 'calendar' | 'resources';

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [showBanner, setShowBanner] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dismissed = localStorage.getItem('ehs-banner-dismissed');
    if (dismissed === 'true') setShowBanner(false);
    // Global Cmd+K search shortcut
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    // Smooth scroll to top of content
    mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const dismissBanner = () => {
    setShowBanner(false);
    localStorage.setItem('ehs-banner-dismissed', 'true');
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <SearchPalette isOpen={searchOpen} onClose={() => setSearchOpen(false)} onNavigate={(tab) => { handleTabChange(tab as Tab); setSearchOpen(false); }} />
      <Header activeTab={activeTab} onTabChange={handleTabChange} onSearchOpen={() => setSearchOpen(true)} />

      {/* Announcement Banner */}
      {showBanner && (
        <div
          className="relative overflow-hidden px-4 py-3 flex items-center justify-between gap-4"
          style={{
            background: 'linear-gradient(135deg, #059669 0%, #047857 50%, #1d4ed8 100%)',
          }}
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 shimmer opacity-20" />

          <div className="relative flex items-center gap-3 flex-1 min-w-0">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                  d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
            </div>
            <p className="font-dm-sans text-sm text-white leading-snug truncate">
              <span className="font-bold">Spring Update:</span>{' '}
              AP exam registration closes April 18 — see your counselor to confirm enrollment.
            </p>
          </div>
          <button
            onClick={dismissBanner}
            className="relative flex-shrink-0 w-6 h-6 rounded-full bg-white/15 flex items-center justify-center text-white/80 hover:bg-white/25 hover:text-white transition-all"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Main content */}
      <main ref={mainRef}>
        {activeTab === 'home' && <Hero onNavigate={handleTabChange} />}
        {activeTab === 'schedule' && <BellSchedule />}
        {activeTab === 'map' && <CampusMap />}
        {activeTab === 'staff' && <StaffDirectory />}
        {activeTab === 'classes' && <ClassDirectory />}
        {activeTab === 'voice' && <SchoolVoice />}
        {activeTab === 'lunch' && <LunchMenu />}
        {activeTab === 'calendar' && <SchoolCalendar />}
        {activeTab === 'resources' && <ResourcesHub onNavigate={handleTabChange as (tab: string) => void} />}
      </main>

      {/* Footer */}
      <footer className="border-t mt-20 py-10 px-6" style={{ borderColor: 'var(--border-light)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg"
                style={{ background: 'linear-gradient(135deg, #10b981, #3b82f6)' }}
              >
                <span className="font-syne font-black text-white text-xs">EHS</span>
              </div>
              <div>
                <div className="font-syne font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                  Emerald High School
                </div>
                <div className="font-dm-mono text-[10px] tracking-widest" style={{ color: 'var(--text-muted)' }}>
                  STUDENT PORTAL
                </div>
              </div>
            </div>

            {/* Links */}
            <div className="flex items-center gap-6">
              {[
                { label: 'Bell Schedule', tab: 'schedule' as Tab },
                { label: 'Campus Map', tab: 'map' as Tab },
                { label: 'Staff Directory', tab: 'staff' as Tab },
                { label: 'Courses', tab: 'classes' as Tab },
              ].map(({ label, tab }) => (
                <button
                  key={tab}
                  onClick={() => handleTabChange(tab)}
                  className="font-dm-sans text-xs transition-colors hover:text-emerald-500"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Info */}
            <div className="flex items-center gap-3">
              <span className="font-dm-mono text-xs" style={{ color: 'var(--text-muted)' }}>
                Dublin, CA 94568
              </span>
              <span className="w-px h-3 bg-emerald-200 dark:bg-emerald-900" />
              <a
                href="/admin"
                className="font-dm-mono text-xs text-emerald-500 hover:text-emerald-600 transition-colors"
              >
                Admin ↗
              </a>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t text-center" style={{ borderColor: 'var(--border-light)' }}>
            <p className="font-dm-mono text-[10px] tracking-wider" style={{ color: 'var(--text-subtle)' }}>
              EMERALD HIGH SCHOOL STUDENT PORTAL • DUBLIN UNIFIED SCHOOL DISTRICT • 2024–2025
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
