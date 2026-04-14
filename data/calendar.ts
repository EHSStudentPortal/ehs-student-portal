// ─── EHS Calendar Data — School Year 2025–2026 ───────────────────────────────
// Emerald High School, Dublin, CA (Dublin Unified School District)

export type EventType =
  | 'holiday'
  | 'break'
  | 'event'
  | 'deadline'
  | 'early-release'
  | 'staff'
  | 'sports'
  | 'academic';

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;       // "2025-08-14"
  endDate?: string;   // for multi-day events (inclusive)
  type: EventType;
  description?: string;
  icon?: string;      // emoji
}

// ─── Event type display config ───────────────────────────────────────────────

export const EVENT_TYPE_CONFIG: Record<
  EventType,
  { label: string; color: string; bg: string; border: string; dot: string }
> = {
  holiday:         { label: 'Holiday',       color: '#dc2626', bg: '#fef2f2', border: '#fecaca', dot: '#ef4444' },
  break:           { label: 'Break',         color: '#ea580c', bg: '#fff7ed', border: '#fed7aa', dot: '#f97316' },
  event:           { label: 'School Event',  color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe', dot: '#3b82f6' },
  deadline:        { label: 'Deadline',      color: '#d97706', bg: '#fffbeb', border: '#fde68a', dot: '#f59e0b' },
  'early-release': { label: 'Early Release', color: '#ca8a04', bg: '#fefce8', border: '#fef08a', dot: '#eab308' },
  staff:           { label: 'Staff Day',     color: '#475569', bg: '#f8fafc', border: '#e2e8f0', dot: '#94a3b8' },
  sports:          { label: 'Sports',        color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0', dot: '#22c55e' },
  academic:        { label: 'Academic',      color: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe', dot: '#8b5cf6' },
};

// ─── Helper ──────────────────────────────────────────────────────────────────

/** Return today's date as a "YYYY-MM-DD" string (client-safe — no Date.now at import time) */
function todayString(): string {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

// ─── Master Event List ────────────────────────────────────────────────────────

export const events: CalendarEvent[] = [

  // ── FALL SEMESTER ─────────────────────────────────────────────────────────

  {
    id: 'first-day-2025',
    title: 'First Day of School',
    date: '2025-08-14',
    type: 'academic',
    description: 'Welcome back, Aeronauts! The 2025–26 school year begins. All students report to first period.',
    icon: '🎒',
  },
  {
    id: 'picture-day-2025',
    title: 'School Picture Day',
    date: '2025-09-05',
    type: 'event',
    description: 'Official school portraits taken during class periods. Retake day to be announced.',
    icon: '📸',
  },
  {
    id: 'sat-school-day-oct',
    title: 'SAT School Day',
    date: '2025-10-08',
    type: 'academic',
    description: 'All juniors participate in the SAT during the school day. Testing begins at 8:00 AM in the gymnasium.',
    icon: '✏️',
  },
  {
    id: 'homecoming-2025',
    title: 'Homecoming Game',
    date: '2025-10-10',
    type: 'sports',
    description: 'Annual Homecoming football game at EHS Stadium. Kickoff at 7:00 PM. Homecoming Court crowned at halftime.',
    icon: '🏈',
  },
  {
    id: 'fall-break-2025',
    title: 'Fall Break',
    date: '2025-10-13',
    endDate: '2025-10-17',
    type: 'break',
    description: 'No school October 13–17. Enjoy the fall break!',
    icon: '🍂',
  },
  {
    id: 'psat-2025',
    title: 'PSAT / NMSQT',
    date: '2025-10-15',
    type: 'academic',
    description: 'PSAT/NMSQT administered during fall break for pre-registered sophomores and juniors. Check with your counselor.',
    icon: '📝',
  },
  {
    id: 'veterans-day-2025',
    title: 'Veterans Day — No School',
    date: '2025-11-11',
    type: 'holiday',
    description: 'School closed in observance of Veterans Day. Thank you to all who have served.',
    icon: '🇺🇸',
  },
  {
    id: 'college-app-deadline-2025',
    title: 'College Application Deadline Reminder',
    date: '2025-11-01',
    type: 'deadline',
    description: 'UC/CSU Early Decision deadline is November 1. See your counselor to verify your applications are submitted!',
    icon: '🎓',
  },
  {
    id: 'thanksgiving-break-2025',
    title: 'Thanksgiving Break',
    date: '2025-11-26',
    endDate: '2025-11-28',
    type: 'break',
    description: 'School closed November 26–28 for Thanksgiving. Classes resume Monday, December 1.',
    icon: '🦃',
  },
  {
    id: 'finals-fall-2025',
    title: 'Finals Week',
    date: '2025-12-15',
    endDate: '2025-12-19',
    type: 'academic',
    description: 'First-semester final exams. Modified schedule in effect — check the bell schedule page for exam times.',
    icon: '📚',
  },
  {
    id: 'winter-break-2025',
    title: 'Winter Break',
    date: '2025-12-22',
    endDate: '2026-01-09',
    type: 'break',
    description: 'School closed December 22 – January 9. Happy Holidays! Classes resume January 12.',
    icon: '❄️',
  },

  // ── SPRING SEMESTER ────────────────────────────────────────────────────────

  {
    id: 'mlk-day-2026',
    title: 'Martin Luther King Jr. Day — No School',
    date: '2026-01-19',
    type: 'holiday',
    description: 'School closed in observance of Dr. Martin Luther King Jr. Day.',
    icon: '✊',
  },
  {
    id: 'presidents-day-2026',
    title: 'Presidents Day — No School',
    date: '2026-02-16',
    type: 'holiday',
    description: 'School closed in observance of Presidents Day.',
    icon: '🏛️',
  },
  {
    id: 'open-house-2026',
    title: 'Open House',
    date: '2026-03-05',
    type: 'event',
    description: 'Open House evening event from 6:00–8:00 PM. Families visit classrooms and meet teachers. All students encouraged to attend.',
    icon: '🏫',
  },
  {
    id: 'spring-break-2026',
    title: 'Spring Break',
    date: '2026-03-30',
    endDate: '2026-04-03',
    type: 'break',
    description: 'School closed March 30 – April 3. Spring Break! Classes resume April 6.',
    icon: '🌸',
  },
  {
    id: 'prom-2026',
    title: 'Prom',
    date: '2026-05-02',
    type: 'event',
    description: 'Junior–Senior Prom. Venue and ticket info released by ASB. Tickets on sale in the spring.',
    icon: '🪩',
  },
  {
    id: 'ap-exams-begin-2026',
    title: 'AP Exams Begin',
    date: '2026-05-04',
    type: 'academic',
    description: 'AP exam season begins. Exams run May 4–15. Check College Board for your personal exam schedule.',
    icon: '🧑‍💻',
  },
  {
    id: 'memorial-day-2026',
    title: 'Memorial Day — No School',
    date: '2026-05-25',
    type: 'holiday',
    description: 'School closed in observance of Memorial Day.',
    icon: '🎖️',
  },
  {
    id: 'senior-finals-2026',
    title: 'Senior Finals',
    date: '2026-06-01',
    endDate: '2026-06-03',
    type: 'academic',
    description: 'Final exams for seniors (Class of 2026). Modified schedule for 12th grade only.',
    icon: '🏅',
  },
  {
    id: 'last-day-2026',
    title: 'Last Day of School',
    date: '2026-06-05',
    type: 'academic',
    description: 'Last day of the 2025–26 school year for all students. Early release schedule.',
    icon: '🎉',
  },
  {
    id: 'graduation-2026',
    title: 'Graduation Ceremony',
    date: '2026-06-12',
    type: 'event',
    description: 'Commencement ceremony for the Class of 2026. Location and time to be announced by administration.',
    icon: '🎓',
  },

  // ── BACK TO SCHOOL NIGHT ──────────────────────────────────────────────────

  {
    id: 'back-to-school-night-2025',
    title: 'Back to School Night',
    date: '2025-09-11',
    type: 'event',
    description: 'Evening event (6:00–8:30 PM) for families to meet teachers and learn about courses. Students follow their class schedule.',
    icon: '👨‍👩‍👧',
  },

  // ── STAFF DEVELOPMENT DAYS ────────────────────────────────────────────────

  {
    id: 'staff-dev-aug-2025',
    title: 'Staff Development Day — No School',
    date: '2025-08-13',
    type: 'staff',
    description: 'Staff professional development day. Students do not report. First student day is August 14.',
    icon: '📋',
  },
  {
    id: 'staff-dev-nov-2025',
    title: 'Staff Development Day — No School',
    date: '2025-11-07',
    type: 'staff',
    description: 'Teacher professional development. No school for students.',
    icon: '📋',
  },
  {
    id: 'staff-dev-jan-2026',
    title: 'Staff Development Day — No School',
    date: '2026-01-12',
    type: 'staff',
    description: 'First student day of second semester. Staff development in the morning; students report after lunch on a modified schedule.',
    icon: '📋',
  },
  {
    id: 'staff-dev-mar-2026',
    title: 'Staff Development Day — No School',
    date: '2026-03-20',
    type: 'staff',
    description: 'Teacher professional development. No school for students.',
    icon: '📋',
  },

  // ── EARLY RELEASE DAYS ────────────────────────────────────────────────────

  {
    id: 'early-release-sep-2025',
    title: 'Early Release Day',
    date: '2025-09-26',
    type: 'early-release',
    description: 'Students released at 12:30 PM for teacher collaboration time.',
    icon: '⏰',
  },
  {
    id: 'early-release-oct-2025',
    title: 'Early Release Day',
    date: '2025-10-24',
    type: 'early-release',
    description: 'Students released at 12:30 PM for teacher collaboration time.',
    icon: '⏰',
  },
  {
    id: 'early-release-dec-2025',
    title: 'Early Release Day',
    date: '2025-12-05',
    type: 'early-release',
    description: 'Students released at 12:30 PM for teacher collaboration time.',
    icon: '⏰',
  },
  {
    id: 'early-release-feb-2026',
    title: 'Early Release Day',
    date: '2026-02-06',
    type: 'early-release',
    description: 'Students released at 12:30 PM for teacher collaboration time.',
    icon: '⏰',
  },
  {
    id: 'early-release-apr-2026',
    title: 'Early Release Day',
    date: '2026-04-17',
    type: 'early-release',
    description: 'Students released at 12:30 PM for teacher collaboration time.',
    icon: '⏰',
  },
  {
    id: 'early-release-may-2026',
    title: 'Early Release Day',
    date: '2026-05-15',
    type: 'early-release',
    description: 'Students released at 12:30 PM for teacher collaboration time.',
    icon: '⏰',
  },

  // ── ACCESS FOCUS MONTHS ───────────────────────────────────────────────────
  // ACCESS = Achievement, Community, Character, Equity, Service, Success

  {
    id: 'access-achievement-sep',
    title: 'ACCESS Focus: Achievement',
    date: '2025-09-02',
    type: 'academic',
    description: 'September ACCESS theme: Achievement. Goal-setting workshops in advisory, academic planning with counselors.',
    icon: '🏆',
  },
  {
    id: 'access-community-oct',
    title: 'ACCESS Focus: Community',
    date: '2025-10-01',
    type: 'event',
    description: 'October ACCESS theme: Community. Campus beautification projects, school spirit events, and community volunteer opportunities.',
    icon: '🤝',
  },
  {
    id: 'access-character-nov',
    title: 'ACCESS Focus: Character',
    date: '2025-11-03',
    type: 'academic',
    description: 'November ACCESS theme: Character. Advisory discussions on integrity, resilience, and leadership.',
    icon: '⭐',
  },
  {
    id: 'access-equity-jan',
    title: 'ACCESS Focus: Equity',
    date: '2026-01-13',
    type: 'event',
    description: 'January ACCESS theme: Equity. Diversity showcases, cultural events, and equity speaker series.',
    icon: '⚖️',
  },
  {
    id: 'access-service-feb',
    title: 'ACCESS Focus: Service',
    date: '2026-02-02',
    type: 'event',
    description: 'February ACCESS theme: Service. Community service projects, volunteer fair, and NHS induction ceremony.',
    icon: '💚',
  },
  {
    id: 'access-success-mar',
    title: 'ACCESS Focus: Success',
    date: '2026-03-02',
    type: 'academic',
    description: 'March ACCESS theme: Success. College and career panels, scholarship info sessions, internship fair.',
    icon: '🚀',
  },

  // ── SPIRIT WEEKS & ASB EVENTS ─────────────────────────────────────────────

  {
    id: 'homecoming-week-2025',
    title: 'Homecoming Spirit Week',
    date: '2025-10-06',
    endDate: '2025-10-10',
    type: 'event',
    description: 'Week of spirit days, hallway decorating, and the Homecoming pep rally on Friday. Themes announced by ASB.',
    icon: '🟢',
  },
  {
    id: 'winter-spirit-week-2025',
    title: 'Winter Spirit Week',
    date: '2025-12-08',
    endDate: '2025-12-12',
    type: 'event',
    description: 'ASB-organized holiday spirit week. Ugly sweater day, pajama day, and more. Festive fun before finals!',
    icon: '🎄',
  },
  {
    id: 'black-history-month-assembly',
    title: 'Black History Month Assembly',
    date: '2026-02-20',
    type: 'event',
    description: 'All-school assembly celebrating Black History Month. Student performances, guest speakers, and ASB presentations.',
    icon: '✊',
  },
  {
    id: 'spring-spirit-week-2026',
    title: 'Spring Spirit Week',
    date: '2026-04-20',
    endDate: '2026-04-24',
    type: 'event',
    description: 'ASB spring spirit week with daily themes. Includes the annual spring pep rally on Friday.',
    icon: '🌼',
  },
  {
    id: 'asb-elections-2026',
    title: 'ASB Elections',
    date: '2026-05-06',
    type: 'event',
    description: 'Associated Student Body officer elections for the 2026–27 school year. All students vote during lunch.',
    icon: '🗳️',
  },
  {
    id: 'senior-sunrise-2026',
    title: 'Senior Sunrise',
    date: '2025-08-20',
    type: 'event',
    description: 'Senior class tradition — gather at the stadium at sunrise before the first full week of school. Coffee and donuts provided by ASB.',
    icon: '🌅',
  },
  {
    id: 'senior-sunset-2026',
    title: 'Senior Sunset',
    date: '2026-05-29',
    type: 'event',
    description: 'Annual senior tradition at the stadium to celebrate the end of the school year together. Bring a blanket!',
    icon: '🌇',
  },
  {
    id: 'club-fair-fall-2025',
    title: 'Fall Club Fair',
    date: '2025-09-17',
    type: 'event',
    description: 'Annual fall club fair on the Main Quad during lunch. Browse 50+ student clubs and sign up to join!',
    icon: '🎪',
  },
  {
    id: 'club-fair-spring-2026',
    title: 'Spring Club Interest Fair',
    date: '2026-02-25',
    type: 'event',
    description: 'Spring club interest fair for new and returning students to explore clubs and activities for second semester.',
    icon: '🎪',
  },
  {
    id: 'winter-formal-2025',
    title: 'Winter Formal',
    date: '2026-01-30',
    type: 'event',
    description: 'Winter Formal dance for all EHS students. Tickets on sale through ASB.',
    icon: '✨',
  },
  {
    id: 'teacher-appreciation-week-2026',
    title: 'Teacher Appreciation Week',
    date: '2026-05-11',
    endDate: '2026-05-15',
    type: 'event',
    description: 'Thank your teachers! ASB-organized events and gifts honoring EHS faculty and staff.',
    icon: '🍎',
  },
  {
    id: 'science-fair-2026',
    title: 'EHS Science & Engineering Fair',
    date: '2026-02-12',
    type: 'academic',
    description: 'Annual science and engineering fair showcasing student research projects. Open to the public 6:00–8:30 PM in the gymnasium.',
    icon: '🔬',
  },
  {
    id: 'arts-showcase-2026',
    title: 'Spring Arts Showcase',
    date: '2026-04-30',
    type: 'event',
    description: 'Visual and performing arts showcase in the PAC and VAPA hallways. Student artwork on display; performances at 7:00 PM.',
    icon: '🎨',
  },
  {
    id: 'nhs-induction-2026',
    title: 'NHS Induction Ceremony',
    date: '2026-02-19',
    type: 'event',
    description: 'National Honor Society induction for new members. Ceremony held in the Kuo Performing Arts Center at 6:30 PM.',
    icon: '🏅',
  },
  {
    id: 'college-signing-day-2026',
    title: 'College Signing Day',
    date: '2026-05-01',
    type: 'event',
    description: 'Seniors celebrate college commitments! Sign the banner in the Main Quad and wear your future school colors.',
    icon: '🎊',
  },
  {
    id: 'multicultural-night-2026',
    title: 'Multicultural Night',
    date: '2026-03-19',
    type: 'event',
    description: 'Annual Multicultural Night in the Kuo Performing Arts Center. Student-performed dances, food, and cultural exhibits.',
    icon: '🌏',
  },
  {
    id: 'ap-exam-registration-deadline-2026',
    title: 'AP Exam Registration Deadline',
    date: '2026-02-27',
    type: 'deadline',
    description: 'Deadline to register for AP exams. See your counselor or the College & Career Center. Exam fees apply.',
    icon: '⚠️',
  },
  {
    id: 'financial-aid-fafsa-deadline',
    title: 'FAFSA Priority Deadline (CA Dream Act)',
    date: '2026-03-02',
    type: 'deadline',
    description: 'Recommended priority deadline to file FAFSA and CA Dream Act application for maximum financial aid consideration.',
    icon: '💸',
  },
  {
    id: 'spring-musical-2026',
    title: 'Spring Musical',
    date: '2026-04-09',
    endDate: '2026-04-11',
    type: 'event',
    description: 'EHS Drama Department spring musical production in the Kuo Performing Arts Center. Tickets at the door or through ASB.',
    icon: '🎭',
  },
  {
    id: 'track-field-invitational-2026',
    title: 'EHS Track & Field Invitational',
    date: '2026-04-25',
    type: 'sports',
    description: 'Annual home track and field invitational at EHS Stadium. Event begins at 9:00 AM.',
    icon: '🏃',
  },
  {
    id: 'academic-awards-night-2026',
    title: 'Academic Awards Night',
    date: '2026-05-21',
    type: 'academic',
    description: 'Annual academic awards ceremony recognizing student achievement. Held in the Kuo Performing Arts Center at 6:30 PM.',
    icon: '🎖️',
  },
];

// ─── Query Helpers ────────────────────────────────────────────────────────────

/**
 * Returns all events that occur within the given calendar month.
 * Handles both single-day and multi-day events.
 */
export function getEventsForMonth(year: number, month: number): CalendarEvent[] {
  // month is 1-indexed (January = 1)
  const monthStart = new Date(year, month - 1, 1);
  const monthEnd = new Date(year, month, 0); // last day of month

  return events.filter((event) => {
    const start = new Date(event.date + 'T00:00:00');
    const end = event.endDate ? new Date(event.endDate + 'T00:00:00') : start;
    // Event overlaps with the month if it starts before monthEnd and ends after monthStart
    return start <= monthEnd && end >= monthStart;
  }).sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Returns the next `count` upcoming events from today (inclusive of today).
 * Defaults to 5.
 */
export function getUpcomingEvents(count: number = 5): CalendarEvent[] {
  const today = todayString();
  const upcoming = events
    .filter((event) => {
      // Include event if it starts today or later, OR if it is a multi-day event
      // that has not yet ended (endDate >= today)
      const endDate = event.endDate ?? event.date;
      return endDate >= today;
    })
    .sort((a, b) => a.date.localeCompare(b.date));
  return upcoming.slice(0, count);
}

/**
 * Returns all events that fall on a specific date string "YYYY-MM-DD".
 * Includes multi-day events that span the given date.
 */
export function getEventsForDate(date: string): CalendarEvent[] {
  return events.filter((event) => {
    const end = event.endDate ?? event.date;
    return event.date <= date && end >= date;
  });
}
