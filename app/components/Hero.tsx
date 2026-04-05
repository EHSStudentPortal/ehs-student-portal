'use client';

import { useState, useEffect, useRef } from 'react';

type Tab = 'home' | 'schedule' | 'map' | 'staff' | 'classes' | 'voice';

interface HeroProps {
  onNavigate: (tab: Tab) => void;
}

// Animated demo preview of Bell Schedule
function ScheduleDemo() {
  const [progress, setProgress] = useState(67);
  const periods = [
    { name: 'Period 1', time: '8:00 – 9:05', status: 'past' },
    { name: 'Period 2', time: '9:10 – 10:15', status: 'past' },
    { name: 'Brunch', time: '10:15 – 10:30', status: 'past' },
    { name: 'Period 3', time: '10:30 – 11:35', status: 'active' },
    { name: 'Period 4', time: '11:40 – 12:45', status: 'upcoming' },
    { name: 'Lunch', time: '12:45 – 1:15', status: 'upcoming' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => p >= 100 ? 0 : p + 0.5);
    }, 80);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-2 p-4">
      <div
        className="rounded-xl p-4 mb-3"
        style={{ background: 'linear-gradient(135deg, #047857, #059669)' }}
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-300 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
          </span>
          <span className="text-green-200 text-xs font-dm-mono uppercase tracking-wider">Now in Progress</span>
        </div>
        <div className="font-syne font-bold text-white text-lg">Period 3</div>
        <div className="text-white/60 text-xs font-dm-mono mt-0.5">10:30 AM – 11:35 AM</div>
        <div className="mt-3">
          <div className="flex justify-between text-[10px] font-dm-mono text-white/50 mb-1.5">
            <span>10:30 AM</span>
            <span className="text-emerald-300 font-medium tabular-nums">{Math.round(100 - progress)}m left</span>
            <span>11:35 AM</span>
          </div>
          <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-100"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #34d399, #60a5fa)',
              }}
            />
          </div>
        </div>
      </div>
      {periods.slice(3).map((p, i) => (
        <div
          key={i}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
            p.status === 'active'
              ? 'bg-emerald-500/10 border border-emerald-400/30'
              : p.status === 'past'
              ? 'opacity-40'
              : 'bg-white/5 border border-white/10'
          }`}
        >
          <div
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{
              background: p.status === 'active' ? '#10b981' : p.status === 'past' ? '#6b7280' : '#3b82f6',
            }}
          />
          <span className="font-dm-sans font-medium text-white/90 flex-1">{p.name}</span>
          <span className="font-dm-mono text-[11px] text-white/40">{p.time}</span>
        </div>
      ))}
    </div>
  );
}

// Staff card demo
function StaffDemo() {
  const [selected, setSelected] = useState(0);
  const members = [
    { name: 'Lenni Velez', role: 'Principal', dept: 'Administration', color: '#059669', initials: 'LV' },
    { name: 'Jaime Roberts', role: 'Math Lead Teacher', dept: 'Mathematics', color: '#2563eb', initials: 'JR' },
    { name: 'Katherine Hermens', role: 'Science Lead', dept: 'Science', color: '#7c3aed', initials: 'KH' },
    { name: 'Kjelene Deakin', role: 'English Teacher', dept: 'English', color: '#d97706', initials: 'KD' },
    { name: 'Carter Imai', role: 'Social Science Lead', dept: 'Social Studies', color: '#be185d', initials: 'CI' },
  ];

  useEffect(() => {
    const t = setInterval(() => setSelected(s => (s + 1) % members.length), 2000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="p-4 space-y-2">
      <div className="flex gap-2 mb-3">
        <div className="flex-1 bg-white/10 rounded-lg px-3 py-2 flex items-center gap-2">
          <svg className="w-3.5 h-3.5 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span className="font-dm-mono text-xs text-white/30">Search staff...</span>
        </div>
      </div>
      {members.map((m, i) => (
        <div
          key={i}
          onClick={() => setSelected(i)}
          className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-300 ${
            selected === i
              ? 'bg-white/15 border border-white/20 scale-[1.02]'
              : 'bg-white/5 border border-white/5 hover:bg-white/10'
          }`}
        >
          <div
            className="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center text-white font-syne font-bold text-xs shadow-lg"
            style={{ background: `linear-gradient(135deg, ${m.color}, ${m.color}cc)` }}
          >
            {m.initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-dm-sans font-semibold text-sm text-white/90 truncate">{m.name}</div>
            <div className="font-dm-sans text-xs text-white/45 truncate">{m.role}</div>
          </div>
          <div
            className="flex-shrink-0 px-2 py-0.5 rounded-full text-[10px] font-dm-mono border"
            style={{ color: m.color, borderColor: `${m.color}50`, background: `${m.color}15` }}
          >
            {m.dept.split(' ')[0]}
          </div>
        </div>
      ))}
    </div>
  );
}

// Course catalog demo
function CoursesDemo() {
  const [hovered, setHovered] = useState<number | null>(null);
  const courses = [
    { name: 'AP Calculus BC', cat: 'Math', stress: 5, isAP: true, color: '#2563eb' },
    { name: 'AP Computer Science A', cat: 'CS', stress: 4, isAP: true, color: '#7c3aed' },
    { name: 'AP Environmental Science', cat: 'Science', stress: 4, isAP: true, color: '#059669' },
    { name: 'AP World History', cat: 'History', stress: 4, isAP: true, color: '#d97706' },
    { name: 'Creative Writing', cat: 'English', stress: 2, isAP: false, color: '#be185d' },
    { name: 'International Cuisine', cat: 'Culinary', stress: 1, isAP: false, color: '#16a34a' },
  ];

  const stressColors = ['', '#10b981', '#3b82f6', '#f59e0b', '#f97316', '#ef4444'];

  return (
    <div className="p-4">
      <div className="flex gap-2 mb-3 flex-wrap">
        {['Math', 'Science', 'English', 'AP Only'].map((f, i) => (
          <span
            key={i}
            className="px-2.5 py-1 rounded-full text-[10px] font-dm-mono border transition-all"
            style={{
              background: i === 0 ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.05)',
              color: i === 0 ? '#34d399' : 'rgba(255,255,255,0.4)',
              borderColor: i === 0 ? 'rgba(52,211,153,0.3)' : 'rgba(255,255,255,0.1)',
            }}
          >
            {f}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {courses.map((c, i) => (
          <div
            key={i}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            className="p-3 rounded-xl border transition-all duration-300 cursor-pointer"
            style={{
              background: hovered === i ? `${c.color}18` : 'rgba(255,255,255,0.05)',
              borderColor: hovered === i ? `${c.color}40` : 'rgba(255,255,255,0.08)',
              transform: hovered === i ? 'translateY(-2px)' : 'none',
            }}
          >
            <div className="flex items-start justify-between gap-1 mb-2">
              <div className="font-dm-sans text-xs font-semibold text-white/90 leading-tight">{c.name}</div>
              {c.isAP && (
                <span className="flex-shrink-0 px-1.5 py-0.5 rounded-full text-[9px] font-dm-mono font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)' }}>AP</span>
              )}
            </div>
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map(j => (
                <div
                  key={j}
                  className="h-1 flex-1 rounded-full transition-all duration-300"
                  style={{
                    background: j <= c.stress ? stressColors[c.stress] : 'rgba(255,255,255,0.1)',
                    opacity: j <= c.stress ? 1 : 0.3,
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// SchoolVoice demo
function VoiceDemo() {
  const [charCount, setCharCount] = useState(0);
  const [activeCategory, setActiveCategory] = useState('Mental Health');
  const [submitted, setSubmitted] = useState(false);
  const target = 'I think we should have more mental health days and open discussion periods...';
  const categories = ['Mental Health', 'Food Quality', 'Safety', 'Facilities', 'School Policy'];

  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      if (i <= target.length) {
        setCharCount(i);
        i++;
      } else {
        clearInterval(t);
        setTimeout(() => {
          setSubmitted(true);
          setTimeout(() => {
            setSubmitted(false);
            setCharCount(0);
            i = 0;
          }, 2500);
        }, 800);
      }
    }, 40);
    return () => clearInterval(t);
  }, [submitted]);

  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-400/20">
        <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
          <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <span className="font-dm-mono text-xs text-emerald-400">100% Anonymous</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {categories.map((c, i) => (
          <button
            key={i}
            onClick={() => setActiveCategory(c)}
            className="px-2.5 py-1 rounded-full text-[10px] font-dm-sans border transition-all"
            style={{
              background: activeCategory === c ? '#059669' : 'rgba(255,255,255,0.05)',
              color: activeCategory === c ? 'white' : 'rgba(255,255,255,0.5)',
              borderColor: activeCategory === c ? '#10b981' : 'rgba(255,255,255,0.1)',
            }}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="relative">
        <div
          className="p-3 rounded-xl border text-xs font-dm-sans min-h-[70px]"
          style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' }}
        >
          {target.slice(0, charCount)}
          {charCount < target.length && <span className="animate-pulse border-r-2 border-emerald-400 ml-0.5" />}
        </div>
      </div>
      {submitted ? (
        <div className="p-3 rounded-xl flex items-center gap-2 animate-fade-in"
          style={{ background: 'linear-gradient(135deg, #059669, #047857)' }}>
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
          <span className="font-dm-sans text-xs font-semibold text-white">Feedback submitted anonymously!</span>
        </div>
      ) : (
        <button
          className="w-full py-2.5 rounded-xl font-dm-sans text-xs font-semibold text-white transition-all"
          style={{ background: charCount >= 10 ? 'linear-gradient(135deg, #059669, #10b981)' : 'rgba(255,255,255,0.1)' }}
        >
          Submit Anonymously →
        </button>
      )}
    </div>
  );
}

// Animated demo card
function DemoCard({
  title,
  description,
  icon,
  tab,
  color,
  children,
  onNavigate,
  delay = 0,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  tab: Tab;
  color: string;
  children: React.ReactNode;
  onNavigate: (tab: Tab) => void;
  delay?: number;
}) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="rounded-2xl overflow-hidden border border-white/10 transition-all duration-500 cursor-pointer group hover:scale-[1.02] hover:border-white/20"
      style={{
        background: 'linear-gradient(135deg, rgba(6,78,59,0.8) 0%, rgba(30,58,138,0.6) 100%)',
        backdropFilter: 'blur(20px)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms, scale 0.3s ease, border-color 0.3s ease`,
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
      }}
      onClick={() => onNavigate(tab)}
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg"
            style={{ background: `linear-gradient(135deg, ${color}80, ${color}40)` }}
          >
            {icon}
          </div>
          <div>
            <div className="font-syne font-bold text-white text-sm">{title}</div>
            <div className="font-dm-sans text-white/40 text-xs">{description}</div>
          </div>
        </div>
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0 translate-x-2"
          style={{ background: `${color}30` }}
        >
          <svg className="w-3.5 h-3.5" style={{ color }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>

      {/* Demo content */}
      <div className="relative overflow-hidden" style={{ maxHeight: 280 }}>
        {children}
        {/* Fade out at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-8 pointer-events-none"
          style={{ background: 'linear-gradient(transparent, rgba(6,78,59,0.9))' }} />
      </div>

      {/* CTA */}
      <div className="px-5 py-3 border-t border-white/10 flex items-center justify-between">
        <span className="font-dm-sans text-xs text-white/40">Click to explore</span>
        <span
          className="font-dm-mono text-[10px] tracking-wider uppercase"
          style={{ color }}
        >
          Open →
        </span>
      </div>
    </div>
  );
}

function StatCounter({ value, label, delay = 0 }: { value: string; label: string; delay?: number }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="text-center"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(16px)',
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      <div className="font-syne font-black text-3xl sm:text-4xl text-gradient-emerald">{value}</div>
      <div className="font-dm-sans text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{label}</div>
    </div>
  );
}

export default function Hero({ onNavigate }: HeroProps) {
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  const features = [
    {
      icon: '⏱',
      title: 'Bell Schedule',
      desc: 'Period tracking',
      tab: 'schedule' as Tab,
      bold: 'Live countdowns.',
      copy: 'Real-time period tracking with live countdown timers for every class.',
    },
    {
      icon: '🗺',
      title: 'Campus Map',
      desc: 'Interactive',
      tab: 'map' as Tab,
      bold: 'Find any room.',
      copy: 'Interactive campus map with building details and classroom information.',
    },
    {
      icon: '👥',
      title: 'Staff Directory',
      desc: '100+ staff members',
      tab: 'staff' as Tab,
      bold: 'Meet your teachers.',
      copy: 'Comprehensive directory with contact info, office hours, and subjects.',
    },
    {
      icon: '📚',
      title: 'Course Catalog',
      desc: '100+ courses',
      tab: 'classes' as Tab,
      bold: 'Plan your future.',
      copy: 'Full DUSD course catalog with AP, Honors, and ROP offerings.',
    },
    {
      icon: '💬',
      title: 'SchoolVoice',
      desc: 'Anonymous feedback',
      tab: 'voice' as Tab,
      bold: 'Be heard.',
      copy: 'Anonymously share feedback with school administration — completely private.',
    },
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Ambient blobs */}
      <div
        className="absolute top-0 left-0 w-[600px] h-[600px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)',
          transform: 'translate(-200px, -100px)',
        }}
      />
      <div
        className="absolute top-0 right-0 w-[600px] h-[600px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)',
          transform: 'translate(200px, -150px)',
        }}
      />

      {/* ── Hero Section ── */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-24">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 border"
            style={{
              background: 'rgba(16,185,129,0.08)',
              borderColor: 'rgba(16,185,129,0.2)',
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? 'translateY(0)' : 'translateY(-10px)',
              transition: 'opacity 0.6s ease, transform 0.6s ease',
            }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="font-dm-mono text-xs text-emerald-600 dark:text-emerald-400 tracking-wider">
              2025–2026 SCHOOL YEAR
            </span>
          </div>

          {/* Headline */}
          <h1
            className="font-syne font-black leading-[1.05] mb-6"
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 0.7s ease 100ms, transform 0.7s ease 100ms',
            }}
          >
            <span className="block" style={{ color: 'var(--text-primary)' }}>
              Your EHS portal,
            </span>
            <span className="block text-gradient-emerald">
              reimagined.
            </span>
          </h1>

          {/* Subheadline */}
          <p
            className="font-dm-sans text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto mb-10"
            style={{
              color: 'var(--text-muted)',
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 0.7s ease 200ms, transform 0.7s ease 200ms',
            }}
          >
            Live bell schedules, the complete course catalog, staff directory, campus map, and anonymous feedback — all in one beautiful place.
          </p>

          {/* CTAs */}
          <div
            className="flex flex-wrap items-center justify-center gap-4"
            style={{
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 0.7s ease 300ms, transform 0.7s ease 300ms',
            }}
          >
            <button
              onClick={() => onNavigate('schedule')}
              className="btn-apple text-base px-8 py-4"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              View Bell Schedule
            </button>
            <button
              onClick={() => onNavigate('classes')}
              className="btn-outline text-base px-8 py-4"
            >
              Explore Courses
            </button>
          </div>
        </div>

        {/* Stats row */}
        <div
          className="grid grid-cols-2 sm:grid-cols-4 gap-8 mt-20 max-w-3xl mx-auto"
          style={{
            opacity: heroVisible ? 1 : 0,
            transition: 'opacity 0.8s ease 400ms',
          }}
        >
          <StatCounter value="150+" label="Courses offered" delay={0} />
          <StatCounter value="100+" label="Faculty & staff" delay={100} />
          <StatCounter value="6" label="Academic periods" delay={200} />
          <StatCounter value="Live" label="Bell schedule" delay={300} />
        </div>
      </section>

      {/* ── Feature Cards Section ── */}
      <section className="relative px-4 sm:px-6 pb-24">
        {/* Section header */}
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4 text-xs font-dm-mono tracking-wider uppercase"
              style={{ background: 'rgba(59,130,246,0.08)', color: '#3b82f6', border: '1px solid rgba(59,130,246,0.2)' }}>
              Interactive Demos
            </div>
            <h2 className="font-syne font-black text-3xl sm:text-4xl mb-3" style={{ color: 'var(--text-primary)' }}>
              Everything you need,
              <span className="text-gradient-blue-emerald"> live.</span>
            </h2>
            <p className="font-dm-sans text-base max-w-xl mx-auto" style={{ color: 'var(--text-muted)' }}>
              Click any card below to jump directly into that feature. Watch the live demos and see what your portal can do.
            </p>
          </div>

          {/* Demo cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DemoCard
              title="Bell Schedule"
              description="Live period countdown"
              icon={<svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
              tab="schedule"
              color="#10b981"
              onNavigate={onNavigate}
              delay={0}
            >
              <ScheduleDemo />
            </DemoCard>

            <DemoCard
              title="Staff Directory"
              description="100+ faculty & staff"
              icon={<svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
              tab="staff"
              color="#3b82f6"
              onNavigate={onNavigate}
              delay={100}
            >
              <StaffDemo />
            </DemoCard>

            <DemoCard
              title="Course Catalog"
              description="Full DUSD catalog"
              icon={<svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>}
              tab="classes"
              color="#8b5cf6"
              onNavigate={onNavigate}
              delay={200}
            >
              <CoursesDemo />
            </DemoCard>

            <DemoCard
              title="SchoolVoice"
              description="Anonymous feedback"
              icon={<svg className="w-4 h-4 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>}
              tab="voice"
              color="#ec4899"
              onNavigate={onNavigate}
              delay={300}
            >
              <VoiceDemo />
            </DemoCard>

            {/* Campus map card — special layout */}
            <div className="md:col-span-2 lg:col-span-2 rounded-2xl overflow-hidden border border-white/10 cursor-pointer group hover:scale-[1.01] transition-all duration-500 hover:border-white/20"
              style={{
                background: 'linear-gradient(135deg, rgba(6,78,59,0.8) 0%, rgba(30,58,138,0.6) 100%)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              }}
              onClick={() => onNavigate('map')}
            >
              <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: 'rgba(234,179,8,0.2)' }}>
                    <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-syne font-bold text-white text-sm">Campus Map</div>
                    <div className="font-dm-sans text-white/40 text-xs">Interactive • Click any building</div>
                  </div>
                </div>
                <span className="font-dm-mono text-[10px] tracking-wider uppercase text-yellow-400">Explore →</span>
              </div>

              {/* Mini map SVG */}
              <div className="relative p-4 flex items-center justify-center" style={{ minHeight: 200 }}>
                <svg viewBox="0 0 600 200" className="w-full max-w-2xl" style={{ maxHeight: 200 }}>
                  <rect x="0" y="0" width="600" height="200" fill="rgba(6,78,59,0.4)" rx="12" />
                  {/* Buildings */}
                  {[
                    { x: 40, y: 30, w: 80, h: 50, label: 'ADMIN', color: '#059669' },
                    { x: 160, y: 20, w: 100, h: 60, label: 'MAIN', color: '#047857' },
                    { x: 300, y: 30, w: 80, h: 50, label: 'SCI', color: '#065f46' },
                    { x: 420, y: 25, w: 90, h: 55, label: 'ARTS', color: '#064e3b' },
                    { x: 40, y: 120, w: 120, h: 60, label: 'GYM', color: '#1d4ed8' },
                    { x: 200, y: 115, w: 160, h: 65, label: 'ATHLETICS', color: '#1e3a5f' },
                    { x: 400, y: 120, w: 110, h: 60, label: 'LIBRARY', color: '#047857' },
                  ].map((b, i) => (
                    <g key={i}>
                      <rect x={b.x} y={b.y} width={b.w} height={b.h} fill={b.color} rx="6" opacity="0.9" />
                      <rect x={b.x} y={b.y} width={b.w} height={4} fill="rgba(255,255,255,0.2)" rx="2" />
                      <text x={b.x + b.w/2} y={b.y + b.h/2 + 4} textAnchor="middle" fill="white" fontSize="10"
                        fontFamily="Syne, sans-serif" fontWeight="700">{b.label}</text>
                    </g>
                  ))}
                  {/* Paths */}
                  <rect x="130" y="0" width="10" height="200" fill="rgba(255,255,255,0.05)" />
                  <rect x="390" y="0" width="10" height="200" fill="rgba(255,255,255,0.05)" />
                  <rect x="0" y="100" width="600" height="10" fill="rgba(255,255,255,0.05)" />
                  {/* Trees */}
                  {[[15, 15], [15, 75], [15, 145], [575, 15], [575, 75], [575, 145]].map(([cx, cy], i) => (
                    <circle key={i} cx={cx} cy={cy} r="8" fill="rgba(52,211,153,0.3)" />
                  ))}
                </svg>
                {/* Pulse indicator */}
                <div className="absolute top-6 right-6 flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-400" />
                  </span>
                  <span className="font-dm-mono text-[10px] text-yellow-400">Interactive</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Quick access ── */}
      <section className="px-4 sm:px-6 pb-24">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-syne font-black text-2xl sm:text-3xl text-center mb-10" style={{ color: 'var(--text-primary)' }}>
            Jump to any section
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {features.map((f, i) => (
              <button
                key={i}
                onClick={() => onNavigate(f.tab)}
                className="group p-5 rounded-2xl border text-center transition-all duration-300 hover:scale-105 hover:shadow-lg"
                style={{
                  background: 'var(--bg-secondary)',
                  borderColor: 'var(--border-light)',
                  animationDelay: `${i * 80}ms`,
                }}
              >
                <div className="text-3xl mb-3">{f.icon}</div>
                <div className="font-syne font-bold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>
                  {f.title}
                </div>
                <div className="font-dm-sans text-xs" style={{ color: 'var(--text-muted)' }}>{f.desc}</div>
                <div className="mt-3 inline-flex items-center gap-1 text-emerald-500 text-xs font-dm-sans font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Open <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── EHS Info Band ── */}
      <section
        className="relative overflow-hidden py-16 px-4 sm:px-6"
        style={{
          background: 'linear-gradient(135deg, #064e3b 0%, #065f46 40%, #1e3a8a 100%)',
        }}
      >
        {/* Ambient glow */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, rgba(16,185,129,0.1) 0%, transparent 60%)' }} />

        <div className="max-w-4xl mx-auto text-center relative">
          <div className="font-dm-mono text-xs tracking-widest uppercase text-emerald-400/60 mb-4">
            Emerald High School • Go Shamrocks!
          </div>
          <h2 className="font-syne font-black text-3xl sm:text-4xl text-white mb-4">
            Built for EHS students, <br className="hidden sm:block" />
            <span className="text-gradient-green">by the community.</span>
          </h2>
          <p className="font-dm-sans text-emerald-100/60 text-base max-w-2xl mx-auto mb-8">
            The EHS Student Portal is your all-in-one companion for navigating high school. From live bell schedules to anonymous feedback — we've got you covered.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('schedule')}
              className="btn-apple"
            >
              Get Started →
            </button>
            <button
              onClick={() => onNavigate('voice')}
              className="px-6 py-3 rounded-full border border-white/20 text-white/70 hover:bg-white/10 font-dm-sans text-sm font-medium transition-all hover:text-white"
            >
              Submit Feedback
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
