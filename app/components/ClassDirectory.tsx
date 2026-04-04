'use client';

import { useState, useMemo } from 'react';
import {
  courses,
  categories,
  stressLabels,
  stressColors,
  type Course,
  type CourseCategory,
} from '@/data/courses';

const CATEGORY_ICONS: Record<CourseCategory, string> = {
  Math: '∑',
  English: '✍',
  Science: '⚗',
  History: '🏛',
  PE: '⚽',
  Arts: '🎨',
  Engineering: '⚙',
  'Computer Science': '💻',
  Health: '❤',
  Culinary: '🍳',
  'World Language': '🌐',
  'Performing Arts': '🎭',
  'Visual Arts': '🖼',
  ROP: '🏢',
};

const CATEGORY_COLORS: Record<CourseCategory, string> = {
  Math: '#2563eb',
  English: '#d97706',
  Science: '#16a34a',
  History: '#be185d',
  PE: '#ea580c',
  Arts: '#9333ea',
  Engineering: '#1d4ed8',
  'Computer Science': '#7c3aed',
  Health: '#0891b2',
  Culinary: '#dc2626',
  'World Language': '#b45309',
  'Performing Arts': '#0d9488',
  'Visual Arts': '#7c3aed',
  ROP: '#475569',
};

function StressBar({ level }: { level: 1 | 2 | 3 | 4 | 5 }) {
  const color = stressColors[level];
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map(i => (
          <div
            key={i}
            className="h-1.5 rounded-full transition-all duration-300"
            style={{
              width: 16,
              background: i <= level ? color : 'var(--border-light)',
              opacity: i <= level ? 1 : 0.4,
            }}
          />
        ))}
      </div>
      <span
        className="font-dm-mono text-[10px] uppercase tracking-wider font-semibold"
        style={{ color }}
      >
        {stressLabels[level]}
      </span>
    </div>
  );
}

function CourseModal({ course, onClose }: { course: Course; onClose: () => void }) {
  const color = CATEGORY_COLORS[course.category];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 modal-overlay"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-md" />
      <div
        className="relative w-full sm:max-w-lg max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-2xl modal-content"
        style={{ background: 'var(--bg-secondary)', boxShadow: '0 -8px 60px rgba(0,0,0,0.3)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="sm:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full" style={{ background: 'var(--border-medium)' }} />
        </div>

        {/* Header */}
        <div
          className="relative p-6 overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${color}dd, ${color}99)` }}
        >
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(circle at 90% 10%, rgba(255,255,255,0.15), transparent 50%)' }} />

          <div className="relative">
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span
                className="px-2.5 py-1 rounded-full text-[10px] font-dm-mono uppercase tracking-wider"
                style={{ background: 'rgba(255,255,255,0.15)', color: 'white' }}
              >
                {course.category}
              </span>
              {course.isAP && (
                <span className="badge-ap">AP</span>
              )}
              {course.isHonors && !course.isAP && (
                <span
                  className="px-2.5 py-1 rounded-full text-[10px] font-dm-mono uppercase tracking-wider font-bold"
                  style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}
                >
                  Honors
                </span>
              )}
            </div>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-syne font-black text-2xl text-white leading-tight">{course.name}</h2>
                <p className="font-dm-sans text-white/70 text-sm mt-1">
                  Grade {course.gradeLevel} · {course.credits} credit{course.credits !== 1 ? 's' : ''}
                </p>
              </div>
              <button
                onClick={onClose}
                className="flex-shrink-0 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white/80 hover:bg-white/30 hover:text-white transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Stress factor */}
          <div className="p-4 rounded-xl border" style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-light)' }}>
            <div className="font-dm-mono text-xs uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
              Stress Factor
            </div>
            <div className="flex items-center gap-4">
              <StressBar level={course.stressFactor} />
              <span className="font-dm-mono text-sm font-bold" style={{ color: stressColors[course.stressFactor] }}>
                {course.stressFactor}/5
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <div className="font-dm-mono text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
              Course Overview
            </div>
            <p className="font-dm-sans text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {course.description}
            </p>
          </div>

          {/* Prerequisites */}
          {course.prerequisites && (
            <div className="p-4 rounded-xl border" style={{ background: `${color}08`, borderColor: `${color}25` }}>
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-4 h-4" style={{ color }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="font-dm-mono text-[10px] uppercase tracking-wider" style={{ color }}>
                  Prerequisites
                </div>
              </div>
              <div className="font-dm-sans text-sm" style={{ color: 'var(--text-primary)' }}>
                {course.prerequisites}
              </div>
            </div>
          )}

          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Grade Level', value: course.gradeLevel },
              { label: 'Credits', value: `${course.credits} cr` },
              { label: 'Category', value: course.category },
            ].map(({ label, value }) => (
              <div key={label} className="p-3 rounded-xl text-center" style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-light)' }}>
                <div className="font-dm-mono text-[10px] uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>
                  {label}
                </div>
                <div className="font-dm-sans text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                  {value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function CourseCard({ course, onClick }: { course: Course; onClick: () => void }) {
  const color = CATEGORY_COLORS[course.category];

  return (
    <button
      onClick={onClick}
      className="group w-full text-left rounded-2xl p-4 border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex flex-col gap-3"
      style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-light)' }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.borderColor = `${color}50`;
        (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 24px rgba(0,0,0,0.08), 0 0 0 1px ${color}20`;
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-light)';
        (e.currentTarget as HTMLElement).style.boxShadow = 'none';
      }}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
            {course.isAP && <span className="badge-ap">AP</span>}
            {course.isHonors && !course.isAP && (
              <span
                className="px-1.5 py-0.5 rounded-full text-[9px] font-dm-mono font-bold"
                style={{ background: `${color}15`, color }}
              >
                HP
              </span>
            )}
          </div>
          <h3
            className="font-syne font-bold text-sm leading-tight transition-colors duration-200"
            style={{ color: 'var(--text-primary)' }}
          >
            {course.name}
          </h3>
        </div>
        <div
          className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-sm transition-transform duration-300 group-hover:scale-110"
          style={{ background: `${color}15` }}
        >
          <span style={{ color }}>{CATEGORY_ICONS[course.category]}</span>
        </div>
      </div>

      {/* Description preview */}
      <p className="font-dm-sans text-xs leading-relaxed line-clamp-2" style={{ color: 'var(--text-muted)' }}>
        {course.description}
      </p>

      {/* Stress bar */}
      <StressBar level={course.stressFactor} />

      {/* Meta row */}
      <div className="flex items-center gap-2 flex-wrap pt-1 border-t" style={{ borderColor: 'var(--border-light)' }}>
        <span
          className="px-2 py-0.5 rounded-full text-[10px] font-dm-mono"
          style={{ background: `${color}10`, color, border: `1px solid ${color}20` }}
        >
          Gr {course.gradeLevel}
        </span>
        <span className="font-dm-mono text-[10px]" style={{ color: 'var(--text-muted)' }}>
          {course.credits} cr
        </span>
        <span className="ml-auto">
          <svg
            className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
            style={{ color: 'var(--border-medium)' }}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </button>
  );
}

export default function ClassDirectory() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<CourseCategory | 'All'>('All');
  const [stressFilter, setStressFilter] = useState<number | null>(null);
  const [apOnly, setApOnly] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'stress-asc' | 'stress-desc'>('name');

  const filtered = useMemo(() => {
    let result = courses.filter(c => {
      const matchesSearch = search === '' || (
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.description.toLowerCase().includes(search.toLowerCase()) ||
        c.category.toLowerCase().includes(search.toLowerCase())
      );
      const matchesCat = activeCategory === 'All' || c.category === activeCategory;
      const matchesStress = stressFilter === null || c.stressFactor === stressFilter;
      const matchesAP = !apOnly || c.isAP;
      return matchesSearch && matchesCat && matchesStress && matchesAP;
    });

    if (sortBy === 'name') result = result.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortBy === 'stress-asc') result = result.sort((a, b) => a.stressFactor - b.stressFactor);
    else if (sortBy === 'stress-desc') result = result.sort((a, b) => b.stressFactor - a.stressFactor);

    return result;
  }, [search, activeCategory, stressFilter, apOnly, sortBy]);

  // Category stats
  const catStats = useMemo(() =>
    categories.map(c => ({ cat: c, count: courses.filter(x => x.category === c).length })),
    []
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #8b5cf6, #a855f7)' }}
          >
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <span className="font-dm-mono text-xs tracking-widest uppercase" style={{ color: '#8b5cf6' }}>
            DUSD 2023–2024
          </span>
        </div>
        <h1 className="font-syne font-black text-3xl sm:text-4xl" style={{ color: 'var(--text-primary)' }}>
          Course Catalog
        </h1>
        <p className="font-dm-sans text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
          {courses.length} courses with difficulty ratings · Complete DUSD Grades 9–12 catalog
        </p>
      </div>

      {/* Category overview row */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2 mb-8">
        {catStats.slice(0, 7).map(({ cat, count }) => {
          const color = CATEGORY_COLORS[cat];
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat === activeCategory ? 'All' : cat)}
              className="p-3 rounded-xl border text-center transition-all hover:-translate-y-0.5"
              style={{
                background: activeCategory === cat ? `${color}15` : 'var(--bg-secondary)',
                borderColor: activeCategory === cat ? `${color}40` : 'var(--border-light)',
                boxShadow: activeCategory === cat ? `0 4px 16px ${color}20` : 'none',
              }}
            >
              <div className="text-xl mb-1">{CATEGORY_ICONS[cat]}</div>
              <div className="font-dm-sans text-[10px] font-semibold leading-tight" style={{ color: activeCategory === cat ? color : 'var(--text-muted)' }}>
                {cat}
              </div>
              <div className="font-dm-mono text-[9px]" style={{ color: 'var(--text-subtle)' }}>
                {count}
              </div>
            </button>
          );
        })}
      </div>

      {/* Search + Sort row */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="flex-1 relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }}
            fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search courses, subjects, descriptions..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-premium"
            style={{ paddingLeft: 44 }}
          />
          {search && (
            <button onClick={() => setSearch('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center transition-all hover:scale-110"
              style={{ background: 'var(--border-light)', color: 'var(--text-muted)' }}>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value as typeof sortBy)}
          className="px-4 py-3 rounded-xl border font-dm-mono text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all"
          style={{
            background: 'var(--bg-secondary)',
            borderColor: 'var(--border-light)',
            color: 'var(--text-primary)',
          }}
        >
          <option value="name">Sort: A – Z</option>
          <option value="stress-asc">Easiest First</option>
          <option value="stress-desc">Hardest First</option>
        </select>
      </div>

      {/* Filter chips row */}
      <div className="flex flex-wrap gap-2 mb-4">
        {/* Category pills — all */}
        <button
          onClick={() => setActiveCategory('All')}
          className="px-3.5 py-1.5 rounded-full text-xs font-dm-sans font-semibold border transition-all"
          style={
            activeCategory === 'All'
              ? { background: 'linear-gradient(135deg, #8b5cf6, #a855f7)', color: 'white', border: 'none', boxShadow: '0 4px 12px rgba(139,92,246,0.3)' }
              : { background: 'var(--bg-secondary)', color: 'var(--text-muted)', borderColor: 'var(--border-light)' }
          }
        >
          All Courses
        </button>
        {categories.map(cat => {
          const color = CATEGORY_COLORS[cat];
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat === activeCategory ? 'All' : cat)}
              className="px-3.5 py-1.5 rounded-full text-xs font-dm-sans font-semibold border transition-all"
              style={
                activeCategory === cat
                  ? { background: color, color: 'white', border: 'none', boxShadow: `0 4px 12px ${color}40` }
                  : { background: 'var(--bg-secondary)', color: 'var(--text-muted)', borderColor: 'var(--border-light)' }
              }
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Stress filter + AP filter + count */}
      <div className="flex flex-wrap items-center gap-2 mb-6 pb-6 border-b" style={{ borderColor: 'var(--border-light)' }}>
        <span className="font-dm-mono text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
          Difficulty:
        </span>
        {[1, 2, 3, 4, 5].map(sf => (
          <button
            key={sf}
            onClick={() => setStressFilter(stressFilter === sf ? null : sf)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-dm-mono transition-all"
            style={
              stressFilter === sf
                ? { background: stressColors[sf], color: 'white', border: 'none', boxShadow: `0 2px 8px ${stressColors[sf]}50` }
                : { background: 'var(--bg-secondary)', color: 'var(--text-muted)', borderColor: 'var(--border-light)' }
            }
          >
            {stressLabels[sf]}
          </button>
        ))}
        <button
          onClick={() => setApOnly(!apOnly)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-dm-mono font-bold transition-all"
          style={
            apOnly
              ? { background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)', color: 'white', border: 'none', boxShadow: '0 2px 8px rgba(37,99,235,0.4)' }
              : { background: 'var(--bg-secondary)', color: 'var(--text-muted)', borderColor: 'var(--border-light)' }
          }
        >
          AP Only
        </button>
        {(stressFilter !== null || apOnly || search || activeCategory !== 'All') && (
          <button
            onClick={() => { setStressFilter(null); setApOnly(false); setSearch(''); setActiveCategory('All'); }}
            className="font-dm-mono text-xs text-emerald-500 hover:underline"
          >
            Clear all
          </button>
        )}
        <span className="ml-auto font-dm-mono text-xs" style={{ color: 'var(--text-muted)' }}>
          {filtered.length} course{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl p-16 text-center border"
          style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-light)' }}>
          <div className="text-4xl mb-4">📚</div>
          <div className="font-syne font-bold text-xl mb-2" style={{ color: 'var(--text-primary)' }}>No courses found</div>
          <p className="font-dm-sans text-sm mb-4" style={{ color: 'var(--text-muted)' }}>Try adjusting your filters</p>
          <button onClick={() => { setStressFilter(null); setApOnly(false); setSearch(''); setActiveCategory('All'); }}
            className="btn-apple px-6 py-2.5">
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 stagger-children">
          {filtered.map(course => (
            <CourseCard key={course.id} course={course} onClick={() => setSelectedCourse(course)} />
          ))}
        </div>
      )}

      {selectedCourse && (
        <CourseModal course={selectedCourse} onClose={() => setSelectedCourse(null)} />
      )}
    </div>
  );
}
