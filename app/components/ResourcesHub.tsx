'use client';

import { useState, useEffect } from 'react';

// ── Types ─────────────────────────────────────────────────────────────────────

interface PortalCard {
  name: string;
  description: string;
  href: string;
  icon: string;
  color: 'blue' | 'emerald' | 'purple' | 'teal';
}

interface ResourceLink {
  name: string;
  href: string;
  description?: string;
}

interface Deadline {
  title: string;
  date: Date;
  category: string;
}

interface PolicyCard {
  title: string;
  icon: string;
  summary: string;
}

// ── Static data ───────────────────────────────────────────────────────────────

const DISTRICT_PORTALS: PortalCard[] = [
  {
    name: 'Genesis Parent Portal',
    description: 'View grades, attendance & schedules',
    href: 'https://parents.dublinusd.org',
    icon: '📊',
    color: 'blue',
  },
  {
    name: 'ParentSquare',
    description: 'School communications & alerts',
    href: 'https://www.parentsquare.com',
    icon: '💬',
    color: 'emerald',
  },
  {
    name: 'Schoology LMS',
    description: 'Assignments, grades & course materials',
    href: 'https://dublinusd.schoology.com',
    icon: '📚',
    color: 'purple',
  },
  {
    name: 'DUSD Portal',
    description: 'Dublin Unified School District',
    href: 'https://www.dublinusd.org',
    icon: '🏫',
    color: 'teal',
  },
];

const PORTAL_COLORS = {
  blue:    { gradient: 'linear-gradient(135deg,#1d4ed8,#3b82f6)', shadow: 'rgba(59,130,246,0.25)',  light: '#eff6ff', border: '#bfdbfe', text: '#1d4ed8' },
  emerald: { gradient: 'linear-gradient(135deg,#047857,#10b981)', shadow: 'rgba(16,185,129,0.25)',  light: '#ecfdf5', border: '#a7f3d0', text: '#047857' },
  purple:  { gradient: 'linear-gradient(135deg,#6d28d9,#8b5cf6)', shadow: 'rgba(139,92,246,0.25)', light: '#f5f3ff', border: '#ddd6fe', text: '#6d28d9' },
  teal:    { gradient: 'linear-gradient(135deg,#0f766e,#14b8a6)', shadow: 'rgba(20,184,166,0.25)',  light: '#f0fdfa', border: '#99f6e4', text: '#0f766e' },
} as const;

const ACADEMIC_RESOURCES: ResourceLink[] = [
  { name: 'Khan Academy',      href: 'https://www.khanacademy.org',      description: 'Free courses in math, science, history & more' },
  { name: 'Desmos Calculator', href: 'https://www.desmos.com/calculator', description: 'Powerful graphing & scientific calculator' },
  { name: 'College Board',     href: 'https://www.collegeboard.org',      description: 'AP exams, SAT registration & score reports' },
  { name: 'Common App',        href: 'https://www.commonapp.org',         description: 'Apply to 1,000+ colleges with one application' },
  { name: 'Naviance',          href: 'https://www.naviance.com',          description: 'College planning, career exploration & readiness' },
  { name: 'Google Classroom',  href: 'https://classroom.google.com',      description: 'Access class assignments & Google Workspace' },
  { name: 'Turnitin',          href: 'https://www.turnitin.com',          description: 'Submit papers & check academic integrity' },
  { name: 'Quizlet',           href: 'https://quizlet.com',               description: 'Study sets, flashcards & learning games' },
];

const STUDENT_SUPPORT: ResourceLink[] = [
  { name: 'Crisis Text Line',           href: 'sms:741741',                                 description: 'Text HOME to 741741 — free, 24/7 crisis support' },
  { name: '988 Suicide & Crisis Line',  href: 'tel:988',                                    description: 'Call or text 988 — free, confidential crisis support' },
  { name: 'Dublin Teen Resource Ctr',   href: 'https://www.dublinca.gov/285/Teen-Resources', description: 'Local programs, mental health & social services' },
  { name: 'Alameda County Mental Hlth', href: 'https://www.acbhcs.org',                     description: 'Alameda County Behavioral Health Care Services' },
  { name: 'EHS Wellness Center',        href: '#wellness',                                  description: 'On-campus wellness support — visit the office anytime' },
];

const COLLEGE_CAREER: ResourceLink[] = [
  { name: 'Common App',            href: 'https://www.commonapp.org',                       description: 'Apply to 1,000+ colleges with one application' },
  { name: 'UC Application',        href: 'https://www.universityofcalifornia.edu/apply',     description: 'University of California application portal' },
  { name: 'CSU Apply',             href: 'https://www.calstate.edu/apply',                   description: 'Apply to all 23 California State University campuses' },
  { name: 'College Scorecard',     href: 'https://collegescorecard.ed.gov',                  description: 'Compare colleges by cost, outcomes & value' },
  { name: 'Fastweb Scholarships',  href: 'https://www.fastweb.com',                          description: 'Search millions of scholarships & financial aid' },
  { name: 'FAFSA',                 href: 'https://studentaid.gov',                           description: 'Apply for federal financial aid at studentaid.gov' },
  { name: 'LinkedIn Learning',     href: 'https://www.linkedin.com/learning',                description: 'Professional skills courses & career development' },
  { name: 'Internship Search',     href: 'https://www.linkedin.com/jobs/internship-jobs',    description: 'Find internship opportunities on LinkedIn Jobs' },
];

const DEADLINES: Deadline[] = [
  { title: 'AP Exam Registration',        date: new Date('2025-11-01'), category: 'Academic' },
  { title: 'College App Early Decision',  date: new Date('2025-11-01'), category: 'College' },
  { title: 'UC/CSU Application Opens',    date: new Date('2025-08-01'), category: 'College' },
  { title: 'UC/CSU Application Deadline', date: new Date('2025-11-30'), category: 'College' },
  { title: 'FAFSA Opens',                 date: new Date('2025-12-01'), category: 'Financial Aid' },
  { title: 'FAFSA Priority Deadline',     date: new Date('2026-03-02'), category: 'Financial Aid' },
  { title: 'SAT Registration (Spring)',   date: new Date('2026-01-15'), category: 'Testing' },
  { title: 'AP Exam Period',              date: new Date('2026-05-04'), category: 'Academic' },
];

const POLICIES: PolicyCard[] = [
  {
    title: 'Attendance Policy',
    icon: '📋',
    summary: 'Students must arrive on time; three tardies equal one unexcused absence and may affect grade credit.',
  },
  {
    title: 'Academic Integrity',
    icon: '🎓',
    summary: 'Plagiarism, cheating, or AI misuse may result in a zero, parent contact, and disciplinary action.',
  },
  {
    title: 'Technology Use Policy',
    icon: '💻',
    summary: 'Chromebooks are for educational use only; personal devices must remain put away unless directed by a teacher.',
  },
  {
    title: 'Dress Code',
    icon: '👕',
    summary: 'Clothing must be appropriate and free of offensive language, symbols, or excessive skin exposure.',
  },
  {
    title: 'Chromebook Care',
    icon: '🔋',
    summary: 'Students are responsible for bringing a charged Chromebook daily; damage may result in repair fees.',
  },
  {
    title: 'Graduation Requirements',
    icon: '🏅',
    summary: 'Students must earn 220 credits, pass ELD if applicable, and complete senior exit requirements.',
  },
];

// ── Small helpers ─────────────────────────────────────────────────────────────

function ExternalLinkIcon() {
  return (
    <svg className="w-3.5 h-3.5 opacity-60 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  );
}

function SectionHeader({ icon, title, subtitle }: { icon: string; title: string; subtitle?: string }) {
  return (
    <div className="flex items-start gap-3 mb-5">
      <div
        className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 text-lg shadow-sm"
        style={{ background: 'linear-gradient(135deg,#ecfdf5,#d1fae5)', border: '1px solid #a7f3d0' }}
      >
        {icon}
      </div>
      <div>
        <h2 className="font-syne font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
          {title}
        </h2>
        {subtitle && (
          <p className="font-dm-sans text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

// ── Portal Card ───────────────────────────────────────────────────────────────

function PortalCardItem({ portal }: { portal: PortalCard }) {
  const c = PORTAL_COLORS[portal.color];
  return (
    <a
      href={portal.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex flex-col overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
      style={{
        background: 'var(--bg-glass)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: `1px solid ${c.border}`,
        boxShadow: 'var(--shadow-md)',
      }}
    >
      <div className="h-1.5 w-full flex-shrink-0" style={{ background: c.gradient }} />
      <div className="flex flex-col flex-1 p-5 gap-3">
        <div className="flex items-start justify-between">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-md transition-transform duration-300 group-hover:scale-110"
            style={{ background: c.gradient, boxShadow: `0 4px 16px ${c.shadow}` }}
          >
            {portal.icon}
          </div>
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-200"
            style={{ background: c.light, color: c.text }}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </div>
        </div>
        <div>
          <h3 className="font-syne font-bold text-base leading-tight mb-1" style={{ color: 'var(--text-primary)' }}>
            {portal.name}
          </h3>
          <p className="font-dm-sans text-sm leading-snug" style={{ color: 'var(--text-muted)' }}>
            {portal.description}
          </p>
        </div>
        <div
          className="mt-auto inline-flex items-center gap-1.5 text-xs font-dm-sans font-semibold transition-all duration-200 group-hover:gap-2.5"
          style={{ color: c.text }}
        >
          Open Portal
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </a>
  );
}

// ── Resource Link Grid ────────────────────────────────────────────────────────

function ResourceLinkGrid({ links, accent = '#10b981' }: { links: ResourceLink[]; accent?: string }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {links.map((link) => {
        const isExternal = link.href.startsWith('http');
        return (
          <a
            key={link.name}
            href={link.href}
            target={isExternal ? '_blank' : undefined}
            rel={isExternal ? 'noopener noreferrer' : undefined}
            className="group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
            style={{
              background: 'var(--bg-glass)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid var(--border-light)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div
              className="w-2 h-2 rounded-full flex-shrink-0 transition-transform duration-200 group-hover:scale-125"
              style={{ background: accent }}
            />
            <div className="flex-1 min-w-0">
              <div
                className="font-dm-sans font-semibold text-sm truncate group-hover:text-emerald-600 transition-colors"
                style={{ color: 'var(--text-primary)' }}
              >
                {link.name}
              </div>
              {link.description && (
                <div className="font-dm-sans text-xs mt-0.5 truncate" style={{ color: 'var(--text-muted)' }}>
                  {link.description}
                </div>
              )}
            </div>
            <ExternalLinkIcon />
          </a>
        );
      })}
    </div>
  );
}

// ── Deadlines Widget ──────────────────────────────────────────────────────────

function DeadlineWidget() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
  }, []);

  function daysAway(deadline: Date): number | null {
    if (!now) return null;
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const dl    = new Date(deadline.getFullYear(), deadline.getMonth(), deadline.getDate());
    return Math.round((dl.getTime() - today.getTime()) / 86400000);
  }

  function urgency(days: number | null) {
    if (days === null) return { bg: 'var(--bg-glass)',  border: 'var(--border-light)', badge: '#e2e8f0', badgeText: '#64748b', dot: '#94a3b8' };
    if (days < 0)      return { bg: '#f8fafc',           border: '#e2e8f0',            badge: '#e2e8f0', badgeText: '#94a3b8', dot: '#cbd5e1' };
    if (days <= 7)     return { bg: '#fff1f2',           border: '#fecdd3',            badge: '#fecdd3', badgeText: '#be123c', dot: '#f43f5e' };
    if (days <= 30)    return { bg: '#fffbeb',           border: '#fde68a',            badge: '#fde68a', badgeText: '#b45309', dot: '#f59e0b' };
    return { bg: 'var(--bg-glass)', border: 'var(--border-light)', badge: '#d1fae5', badgeText: '#047857', dot: '#10b981' };
  }

  function label(days: number | null): string {
    if (days === null) return '…';
    if (days < 0)   return 'Passed';
    if (days === 0) return 'Today!';
    if (days === 1) return 'Tomorrow';
    return `${days}d away`;
  }

  const sorted = [...DEADLINES].sort((a, b) => a.date.getTime() - b.date.getTime());

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {sorted.map((dl) => {
        const days = daysAway(dl.date);
        const s    = urgency(days);
        const passed = days !== null && days < 0;
        return (
          <div
            key={dl.title}
            className="flex items-center gap-3 px-4 py-3 rounded-xl"
            style={{
              background: s.bg,
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: `1px solid ${s.border}`,
              opacity: passed ? 0.55 : 1,
            }}
          >
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: s.dot }} />
            <div className="flex-1 min-w-0">
              <div className="font-dm-sans font-semibold text-sm truncate" style={{ color: 'var(--text-primary)' }}>
                {dl.title}
              </div>
              <div className="font-dm-mono text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                {dl.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
            </div>
            <div
              className="flex-shrink-0 px-2.5 py-1 rounded-full font-dm-mono text-xs font-bold whitespace-nowrap"
              style={{ background: s.badge, color: s.badgeText }}
            >
              {label(days)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Policies Grid ─────────────────────────────────────────────────────────────

function PoliciesGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {POLICIES.map((policy) => (
        <div
          key={policy.title}
          className="flex gap-3 p-4 rounded-2xl transition-all duration-200 hover:-translate-y-0.5"
          style={{
            background: 'var(--bg-glass)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid var(--border-light)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-base"
            style={{ background: 'linear-gradient(135deg,#ecfdf5,#d1fae5)', border: '1px solid #a7f3d0' }}
          >
            {policy.icon}
          </div>
          <div className="min-w-0">
            <div className="font-syne font-bold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>
              {policy.title}
            </div>
            <p className="font-dm-sans text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              {policy.summary}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

export default function ResourcesHub({ onNavigate: _onNavigate }: { onNavigate?: (tab: string) => void }) {
  return (
    <div className="min-h-screen py-8 px-4 sm:px-6" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-6xl mx-auto space-y-12 animate-fade-in-up">

        {/* Page header */}
        <div className="text-center space-y-3 pt-2">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full font-dm-mono text-xs font-bold tracking-wider uppercase mb-2"
            style={{ background: 'linear-gradient(135deg,#ecfdf5,#d1fae5)', border: '1px solid #a7f3d0', color: '#047857' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Quick Access
          </div>
          <h1 className="font-syne font-black text-3xl sm:text-4xl text-gradient-blue-emerald">
            Resources &amp; Quick Links
          </h1>
          <p className="font-dm-sans text-base max-w-xl mx-auto" style={{ color: 'var(--text-muted)' }}>
            Everything you need in one place — portals, academic tools, support services &amp; key deadlines.
          </p>
        </div>

        {/* Section 1: District Portals */}
        <section>
          <SectionHeader
            icon="🔗"
            title="District Portals"
            subtitle="Official DUSD platforms for grades, communications & coursework"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {DISTRICT_PORTALS.map((portal) => (
              <PortalCardItem key={portal.name} portal={portal} />
            ))}
          </div>
        </section>

        {/* Sections 2 + 3: two-column */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
            <SectionHeader icon="📖" title="Academic Resources" subtitle="Study tools, test prep & college planning" />
            <ResourceLinkGrid links={ACADEMIC_RESOURCES} accent="#8b5cf6" />
          </section>

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
            <SectionHeader icon="💙" title="Student Support" subtitle="Mental health, crisis resources & wellness" />
            <div
              className="flex items-start gap-3 p-3 rounded-xl mb-4"
              style={{ background: '#fff1f2', border: '1px solid #fecdd3' }}
            >
              <span className="text-xl flex-shrink-0">🆘</span>
              <p className="font-dm-sans text-xs leading-relaxed" style={{ color: '#9f1239' }}>
                <span className="font-bold">In crisis?</span> Text <strong>HOME</strong> to <strong>741741</strong> or call/text <strong>988</strong> — free, confidential, 24/7.
              </p>
            </div>
            <ResourceLinkGrid links={STUDENT_SUPPORT} accent="#f43f5e" />
          </section>
        </div>

        {/* Section 4: College & Career */}
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
          <SectionHeader icon="🎓" title="College &amp; Career" subtitle="Applications, financial aid, scholarships & professional development" />
          <ResourceLinkGrid links={COLLEGE_CAREER} accent="#2563eb" />
        </section>

        {/* Section 5: Deadlines widget */}
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
          <SectionHeader icon="⏰" title="Important Deadlines" subtitle="Key dates for AP exams, college apps & financial aid — auto-updated" />
          <div className="flex flex-wrap gap-x-5 gap-y-2 mb-5">
            {[
              { dot: '#f43f5e', label: 'Within 7 days' },
              { dot: '#f59e0b', label: 'Within 30 days' },
              { dot: '#10b981', label: 'Upcoming' },
              { dot: '#94a3b8', label: 'Passed' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: item.dot }} />
                <span className="font-dm-sans text-xs" style={{ color: 'var(--text-muted)' }}>{item.label}</span>
              </div>
            ))}
          </div>
          <DeadlineWidget />
        </section>

        {/* Section 6: School Policies */}
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
          <SectionHeader icon="📜" title="School Policies Quick Reference" subtitle="EHS rules and expectations at a glance" />
          <PoliciesGrid />
          <div
            className="mt-5 pt-5 border-t flex items-center justify-between gap-4 flex-wrap"
            style={{ borderColor: 'var(--border-light)' }}
          >
            <p className="font-dm-sans text-xs" style={{ color: 'var(--text-muted)' }}>
              For the full student handbook, visit the DUSD website or the EHS front office.
            </p>
            <a
              href="https://www.dublinusd.org"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 flex items-center gap-1.5 font-dm-sans text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              DUSD Website <ExternalLinkIcon />
            </a>
          </div>
        </section>

        {/* Footer note */}
        <div className="text-center pb-4">
          <p className="font-dm-mono text-[10px] tracking-wider" style={{ color: 'var(--text-subtle)' }}>
            EMERALD HIGH SCHOOL • DUBLIN UNIFIED SCHOOL DISTRICT • DUBLIN, CA 94568
          </p>
        </div>

      </div>
    </div>
  );
}
