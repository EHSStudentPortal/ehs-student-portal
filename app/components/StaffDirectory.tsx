'use client';

import { useState, useMemo } from 'react';
import { staff, departments, type StaffMember, type Department } from '@/data/staff';

const DEPT_COLORS: Record<string, string> = {
  Administration: '#059669',
  Athletics:      '#0ea5e9',
  Counseling:     '#8b5cf6',
  Office:         '#6b7280',
  Math:           '#2563eb',
  English:        '#d97706',
  Science:        '#16a34a',
  'Social Science': '#be185d',
  PE:             '#ea580c',
  Health:         '#0891b2',
  Arts:           '#9333ea',
  'Computer Science': '#7c3aed',
  Engineering:    '#1d4ed8',
  'World Language': '#b45309',
  Culinary:       '#dc2626',
  'Special Education': '#0d9488',
  Wellness:       '#10b981',
  Support:        '#64748b',
  ROP:            '#475569',
};

function StaffModal({ member, onClose }: { member: StaffMember; onClose: () => void }) {
  const color = DEPT_COLORS[member.department] || '#059669';
  const initials = member.name.split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 modal-overlay" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-md" />
      <div
        className="relative w-full sm:max-w-lg max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-2xl modal-content"
        style={{ background: 'var(--bg-secondary)', boxShadow: '0 -8px 60px rgba(0,0,0,0.3)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle bar for mobile */}
        <div className="sm:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full" style={{ background: 'var(--border-medium)' }} />
        </div>

        {/* Header */}
        <div
          className="relative p-6 overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${color}dd, ${color}99)` }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(circle at 90% 10%, rgba(255,255,255,0.15), transparent 50%)' }}
          />

          <div className="relative flex items-start gap-4">
            {/* Avatar */}
            <div
              className="w-16 h-16 rounded-2xl flex-shrink-0 flex items-center justify-center shadow-xl"
              style={{ background: 'rgba(255,255,255,0.2)', border: '2px solid rgba(255,255,255,0.3)' }}
            >
              {member.photoUrl ? (
                <img src={member.photoUrl} alt={member.name} className="w-full h-full rounded-2xl object-cover" />
              ) : (
                <span className="font-syne font-black text-white text-xl">{initials}</span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div
                className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-dm-mono uppercase tracking-wider mb-2"
                style={{ background: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.9)' }}
              >
                {member.department}
              </div>
              <h2 className="font-syne font-black text-2xl text-white leading-tight">{member.name}</h2>
              <p className="font-dm-sans text-white/75 text-sm mt-0.5">{member.title}</p>
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

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Quick info */}
          <div className="grid grid-cols-2 gap-3">
            <div
              className="p-3 rounded-xl"
              style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-light)' }}
            >
              <div className="font-dm-mono text-[10px] uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>
                Location
              </div>
              <div className="font-dm-sans text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                {member.room}
              </div>
            </div>
            <div
              className="p-3 rounded-xl"
              style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-light)' }}
            >
              <div className="font-dm-mono text-[10px] uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>
                Department
              </div>
              <div className="font-dm-sans text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                {member.department}
              </div>
            </div>
          </div>

          {/* Bio */}
          <div>
            <div className="font-dm-mono text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
              About
            </div>
            <p className="font-dm-sans text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {member.bio}
            </p>
          </div>

          {/* Subjects */}
          {member.subjects.length > 0 && (
            <div>
              <div className="font-dm-mono text-xs uppercase tracking-wider mb-2.5" style={{ color: 'var(--text-muted)' }}>
                Courses Taught
              </div>
              <div className="flex flex-wrap gap-2">
                {member.subjects.map(s => (
                  <span
                    key={s}
                    className="px-3 py-1 rounded-full text-xs font-dm-sans font-medium border"
                    style={{
                      background: `${color}10`,
                      color: color,
                      borderColor: `${color}30`,
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Contact */}
          <div
            className="p-4 rounded-xl space-y-3 border"
            style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-light)' }}
          >
            <div className="font-dm-mono text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
              Contact
            </div>
            <a
              href={`mailto:${member.email}`}
              className="flex items-center gap-3 group"
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}15` }}>
                <svg className="w-4 h-4" style={{ color }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="font-dm-mono text-sm group-hover:underline" style={{ color }}>
                {member.email}
              </span>
            </a>
            {member.phone && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}15` }}>
                  <svg className="w-4 h-4" style={{ color }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <span className="font-dm-mono text-sm" style={{ color: 'var(--text-primary)' }}>{member.phone}</span>
              </div>
            )}
            {member.availability && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}15` }}>
                  <svg className="w-4 h-4" style={{ color }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="font-dm-sans text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {member.availability}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StaffCard({ member, onClick }: { member: StaffMember; onClick: () => void }) {
  const color = DEPT_COLORS[member.department] || '#059669';
  const initials = member.name.split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <button
      onClick={onClick}
      className="group w-full text-left rounded-2xl p-4 border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex gap-4 items-start"
      style={{
        background: 'var(--bg-secondary)',
        borderColor: 'var(--border-light)',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.borderColor = `${color}50`;
        (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 24px rgba(0,0,0,0.08), 0 0 0 1px ${color}20`;
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-light)';
        (e.currentTarget as HTMLElement).style.boxShadow = 'none';
      }}
    >
      {/* Avatar */}
      <div
        className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center shadow-md text-white font-syne font-black text-sm transition-transform duration-300 group-hover:scale-105"
        style={{ background: `linear-gradient(135deg, ${color}, ${color}99)` }}
      >
        {member.photoUrl ? (
          <img src={member.photoUrl} alt={member.name} className="w-full h-full rounded-xl object-cover" />
        ) : (
          initials
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div
          className="font-syne font-bold text-sm leading-tight mb-0.5 truncate transition-colors"
          style={{ color: 'var(--text-primary)' }}
        >
          {member.name}
        </div>
        <div className="font-dm-sans text-xs truncate mb-2" style={{ color: 'var(--text-muted)' }}>
          {member.title}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="px-2 py-0.5 rounded-full text-[10px] font-dm-mono"
            style={{
              background: `${color}12`,
              color: color,
              border: `1px solid ${color}25`,
            }}
          >
            {member.department}
          </span>
          <span className="font-dm-mono text-[10px]" style={{ color: 'var(--text-muted)' }}>
            {member.room}
          </span>
        </div>
        {member.subjects.length > 0 && (
          <div className="font-dm-sans text-xs mt-1.5 truncate" style={{ color: 'var(--text-muted)' }}>
            {member.subjects.slice(0, 2).join(' · ')}{member.subjects.length > 2 ? ' +more' : ''}
          </div>
        )}
      </div>

      <svg
        className="w-4 h-4 flex-shrink-0 mt-0.5 transition-all duration-300 group-hover:translate-x-0.5"
        style={{ color: 'var(--border-medium)' }}
        fill="none" stroke="currentColor" viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </button>
  );
}

export default function StaffDirectory() {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<Department | 'All'>('All');
  const [selectedMember, setSelectedMember] = useState<StaffMember | null>(null);

  // Get unique departments that have staff
  const usedDepartments = useMemo(() =>
    departments.filter(d => staff.some(s => s.department === d)),
    []
  );

  const filtered = useMemo(() => {
    return staff.filter(s => {
      const matchesSearch = search === '' || (
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.title.toLowerCase().includes(search.toLowerCase()) ||
        s.subjects.some(sub => sub.toLowerCase().includes(search.toLowerCase())) ||
        s.room.toLowerCase().includes(search.toLowerCase()) ||
        s.department.toLowerCase().includes(search.toLowerCase())
      );
      const matchesDept = activeFilter === 'All' || s.department === activeFilter;
      return matchesSearch && matchesDept;
    });
  }, [search, activeFilter]);

  // Group by department
  const grouped = useMemo(() => {
    const groups: Record<string, StaffMember[]> = {};
    filtered.forEach(s => {
      if (!groups[s.department]) groups[s.department] = [];
      groups[s.department].push(s);
    });
    return groups;
  }, [filtered]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #2563eb, #3b82f6)' }}
          >
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <span className="font-dm-mono text-xs tracking-widest uppercase" style={{ color: '#3b82f6' }}>
            Directory
          </span>
        </div>
        <h1 className="font-syne font-black text-3xl sm:text-4xl" style={{ color: 'var(--text-primary)' }}>
          Staff Directory
        </h1>
        <p className="font-dm-sans text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
          {staff.length} faculty & staff members across {usedDepartments.length} departments
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4"
          style={{ color: 'var(--text-muted)' }}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search by name, subject, department, or room..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="input-premium"
          style={{ paddingLeft: 44 }}
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{ background: 'var(--border-light)', color: 'var(--text-muted)' }}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Department filters */}
      <div className="flex flex-wrap gap-2 mb-8 no-scrollbar">
        <button
          onClick={() => setActiveFilter('All')}
          className="px-4 py-2 rounded-full text-xs font-dm-sans font-semibold border transition-all duration-200"
          style={
            activeFilter === 'All'
              ? { background: 'linear-gradient(135deg, #059669, #10b981)', color: 'white', border: 'none', boxShadow: '0 4px 12px rgba(16,185,129,0.3)' }
              : { background: 'var(--bg-secondary)', color: 'var(--text-muted)', borderColor: 'var(--border-light)' }
          }
        >
          All ({staff.length})
        </button>
        {usedDepartments.map(dept => {
          const count = staff.filter(s => s.department === dept).length;
          const color = DEPT_COLORS[dept] || '#059669';
          return (
            <button
              key={dept}
              onClick={() => setActiveFilter(dept)}
              className="px-4 py-2 rounded-full text-xs font-dm-sans font-semibold border transition-all duration-200"
              style={
                activeFilter === dept
                  ? { background: color, color: 'white', border: 'none', boxShadow: `0 4px 12px ${color}40` }
                  : { background: 'var(--bg-secondary)', color: 'var(--text-muted)', borderColor: 'var(--border-light)' }
              }
            >
              {dept} ({count})
            </button>
          );
        })}
      </div>

      {/* Results count when filtering */}
      {(search || activeFilter !== 'All') && (
        <div className="mb-4 flex items-center gap-2">
          <span className="font-dm-mono text-xs" style={{ color: 'var(--text-muted)' }}>
            {filtered.length} result{filtered.length !== 1 ? 's' : ''}
            {search && ` for "${search}"`}
            {activeFilter !== 'All' && ` in ${activeFilter}`}
          </span>
          <button
            onClick={() => { setSearch(''); setActiveFilter('All'); }}
            className="font-dm-mono text-xs text-emerald-500 hover:underline"
          >
            Clear
          </button>
        </div>
      )}

      {/* Staff grid — grouped by department when no filter */}
      {filtered.length === 0 ? (
        <div
          className="rounded-2xl p-16 text-center border"
          style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-light)' }}
        >
          <div className="text-4xl mb-4">🔍</div>
          <div className="font-syne font-bold text-xl mb-2" style={{ color: 'var(--text-primary)' }}>
            No staff found
          </div>
          <p className="font-dm-sans text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
            Try adjusting your search or filter
          </p>
          <button
            onClick={() => { setSearch(''); setActiveFilter('All'); }}
            className="btn-apple px-6 py-2.5"
          >
            Clear Filters
          </button>
        </div>
      ) : activeFilter === 'All' && !search ? (
        // Grouped view
        <div className="space-y-10">
          {Object.entries(grouped).map(([dept, members]) => {
            const color = DEPT_COLORS[dept] || '#059669';
            return (
              <div key={dept} className="animate-fade-in-up">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-2 h-6 rounded-full" style={{ background: color }} />
                  <h2 className="font-syne font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
                    {dept}
                  </h2>
                  <span className="font-dm-mono text-xs" style={{ color: 'var(--text-muted)' }}>
                    {members.length} member{members.length !== 1 ? 's' : ''}
                  </span>
                  <div className="flex-1 h-px" style={{ background: 'var(--border-light)' }} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {members.map(member => (
                    <StaffCard key={member.id} member={member} onClick={() => setSelectedMember(member)} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        // Flat grid when filtering
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 stagger-children">
          {filtered.map(member => (
            <StaffCard key={member.id} member={member} onClick={() => setSelectedMember(member)} />
          ))}
        </div>
      )}

      {/* Modal */}
      {selectedMember && (
        <StaffModal member={selectedMember} onClose={() => setSelectedMember(null)} />
      )}
    </div>
  );
}
