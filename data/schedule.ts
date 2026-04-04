// ============================================================
// EHS Bell Schedule Data
// Emerald High School — Dublin, CA
// Accurate times sourced from official bell schedule PDF
// ============================================================

export type PeriodType =
  | 'class'
  | 'break'
  | 'lunch'
  | 'before'
  | 'after'
  | 'access'
  | 'staff';

export type DayType =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'weekend';

export interface Period {
  id: string;
  name: string;
  startTime: string; // "HH:MM" 24-hour
  endTime: string;   // "HH:MM" 24-hour
  type: PeriodType;
  optional?: boolean;
  blockDay?: boolean; // true for 90-min block periods
}

export interface DaySchedule {
  name: string;
  dayType: DayType;
  label: string; // e.g. "Monday – All Periods"
  periods: Period[];
}

// ============================================================
// MONDAY — All Periods + ACCESS
// ============================================================
export const mondaySchedule: DaySchedule = {
  name: 'Monday',
  dayType: 'monday',
  label: 'Monday – All Periods + ACCESS',
  periods: [
    {
      id: 'mon-p0',
      name: 'Period 0',
      startTime: '07:15',
      endTime: '08:20',
      type: 'class',
      optional: true,
    },
    {
      id: 'mon-p1',
      name: 'Period 1',
      startTime: '08:30',
      endTime: '09:22',
      type: 'class',
    },
    {
      id: 'mon-p2',
      name: 'Period 2',
      startTime: '09:28',
      endTime: '10:20',
      type: 'class',
    },
    {
      id: 'mon-p3',
      name: 'Period 3',
      startTime: '10:26',
      endTime: '11:18',
      type: 'class',
    },
    {
      id: 'mon-p4',
      name: 'Period 4',
      startTime: '11:24',
      endTime: '12:16',
      type: 'class',
    },
    {
      id: 'mon-lunch',
      name: 'Lunch',
      startTime: '12:16',
      endTime: '12:51',
      type: 'lunch',
    },
    {
      id: 'mon-access',
      name: 'ACCESS',
      startTime: '12:57',
      endTime: '13:29',
      type: 'access',
    },
    {
      id: 'mon-p5',
      name: 'Period 5',
      startTime: '13:35',
      endTime: '14:27',
      type: 'class',
    },
    {
      id: 'mon-p6',
      name: 'Period 6',
      startTime: '14:33',
      endTime: '15:25',
      type: 'class',
    },
    {
      id: 'mon-p7',
      name: 'Period 7',
      startTime: '15:31',
      endTime: '16:36',
      type: 'class',
      optional: true,
    },
  ],
};

// ============================================================
// TUESDAY — All Periods, NO ACCESS
// ============================================================
export const tuesdaySchedule: DaySchedule = {
  name: 'Tuesday',
  dayType: 'tuesday',
  label: 'Tuesday – All Periods',
  periods: [
    {
      id: 'tue-p0',
      name: 'Period 0',
      startTime: '07:15',
      endTime: '08:20',
      type: 'class',
      optional: true,
    },
    {
      id: 'tue-p1',
      name: 'Period 1',
      startTime: '08:30',
      endTime: '09:28',
      type: 'class',
    },
    {
      id: 'tue-p2',
      name: 'Period 2',
      startTime: '09:34',
      endTime: '10:32',
      type: 'class',
    },
    {
      id: 'tue-p3',
      name: 'Period 3',
      startTime: '10:38',
      endTime: '11:38',
      type: 'class',
    },
    {
      id: 'tue-p4',
      name: 'Period 4',
      startTime: '11:44',
      endTime: '12:42',
      type: 'class',
    },
    {
      id: 'tue-lunch',
      name: 'Lunch',
      startTime: '12:42',
      endTime: '13:17',
      type: 'lunch',
    },
    {
      id: 'tue-p5',
      name: 'Period 5',
      startTime: '13:23',
      endTime: '14:21',
      type: 'class',
    },
    {
      id: 'tue-p6',
      name: 'Period 6',
      startTime: '14:27',
      endTime: '15:25',
      type: 'class',
    },
    {
      id: 'tue-p7',
      name: 'Period 7',
      startTime: '15:31',
      endTime: '16:36',
      type: 'class',
      optional: true,
    },
  ],
};

// ============================================================
// WEDNESDAY — Odd Block (Periods 1, 3, 5 + ACCESS)
// Staff Collaboration 8:00–8:55 (staff only, shown with lock icon)
// ============================================================
export const wednesdaySchedule: DaySchedule = {
  name: 'Wednesday',
  dayType: 'wednesday',
  label: 'Wednesday – Odd Block Day',
  periods: [
    {
      id: 'wed-staff',
      name: 'Staff Collaboration',
      startTime: '08:00',
      endTime: '08:55',
      type: 'staff',
    },
    {
      id: 'wed-p1',
      name: 'Period 1',
      startTime: '09:00',
      endTime: '10:30',
      type: 'class',
      blockDay: true,
    },
    {
      id: 'wed-p3',
      name: 'Period 3',
      startTime: '10:36',
      endTime: '12:06',
      type: 'class',
      blockDay: true,
    },
    {
      id: 'wed-lunch',
      name: 'Lunch',
      startTime: '12:06',
      endTime: '12:41',
      type: 'lunch',
    },
    {
      id: 'wed-access',
      name: 'ACCESS',
      startTime: '12:47',
      endTime: '13:49',
      type: 'access',
    },
    {
      id: 'wed-p5',
      name: 'Period 5',
      startTime: '13:55',
      endTime: '15:25',
      type: 'class',
      blockDay: true,
    },
  ],
};

// ============================================================
// THURSDAY — Even Block (Periods 2, 4, 6 + ACCESS)
// ============================================================
export const thursdaySchedule: DaySchedule = {
  name: 'Thursday',
  dayType: 'thursday',
  label: 'Thursday – Even Block Day',
  periods: [
    {
      id: 'thu-p0',
      name: 'Period 0',
      startTime: '07:15',
      endTime: '08:20',
      type: 'class',
      optional: true,
    },
    {
      id: 'thu-p2',
      name: 'Period 2',
      startTime: '08:30',
      endTime: '10:00',
      type: 'class',
      blockDay: true,
    },
    {
      id: 'thu-p4',
      name: 'Period 4',
      startTime: '10:06',
      endTime: '11:36',
      type: 'class',
      blockDay: true,
    },
    {
      id: 'thu-lunch',
      name: 'Lunch',
      startTime: '11:36',
      endTime: '12:11',
      type: 'lunch',
    },
    {
      id: 'thu-access',
      name: 'ACCESS',
      startTime: '12:17',
      endTime: '13:09',
      type: 'access',
    },
    {
      id: 'thu-p6',
      name: 'Period 6',
      startTime: '13:15',
      endTime: '14:45',
      type: 'class',
      blockDay: true,
    },
    {
      id: 'thu-p7',
      name: 'Period 7',
      startTime: '14:51',
      endTime: '15:56',
      type: 'class',
      optional: true,
    },
  ],
};

// ============================================================
// FRIDAY — All Periods, NO ACCESS (same structure as Tuesday)
// ============================================================
export const fridaySchedule: DaySchedule = {
  name: 'Friday',
  dayType: 'friday',
  label: 'Friday – All Periods',
  periods: [
    {
      id: 'fri-p0',
      name: 'Period 0',
      startTime: '07:15',
      endTime: '08:20',
      type: 'class',
      optional: true,
    },
    {
      id: 'fri-p1',
      name: 'Period 1',
      startTime: '08:30',
      endTime: '09:28',
      type: 'class',
    },
    {
      id: 'fri-p2',
      name: 'Period 2',
      startTime: '09:34',
      endTime: '10:32',
      type: 'class',
    },
    {
      id: 'fri-p3',
      name: 'Period 3',
      startTime: '10:38',
      endTime: '11:38',
      type: 'class',
    },
    {
      id: 'fri-p4',
      name: 'Period 4',
      startTime: '11:44',
      endTime: '12:42',
      type: 'class',
    },
    {
      id: 'fri-lunch',
      name: 'Lunch',
      startTime: '12:42',
      endTime: '13:17',
      type: 'lunch',
    },
    {
      id: 'fri-p5',
      name: 'Period 5',
      startTime: '13:23',
      endTime: '14:21',
      type: 'class',
    },
    {
      id: 'fri-p6',
      name: 'Period 6',
      startTime: '14:27',
      endTime: '15:25',
      type: 'class',
    },
    {
      id: 'fri-p7',
      name: 'Period 7',
      startTime: '15:31',
      endTime: '16:36',
      type: 'class',
      optional: true,
    },
  ],
};

// ============================================================
// Schedule map keyed by JS getDay() value
// 0 = Sun, 1 = Mon, 2 = Tue, 3 = Wed, 4 = Thu, 5 = Fri, 6 = Sat
// Weekends fall back to Friday schedule
// ============================================================
export const scheduleByDay: Record<number, DaySchedule> = {
  0: fridaySchedule, // Sunday  → Friday fallback
  1: mondaySchedule,
  2: tuesdaySchedule,
  3: wednesdaySchedule,
  4: thursdaySchedule,
  5: fridaySchedule,
  6: fridaySchedule, // Saturday → Friday fallback
};

// ============================================================
// Helper Functions
// ============================================================

/**
 * Parses a "HH:MM" string into separate hours and minutes.
 */
export function parseTime(timeStr: string): { hours: number; minutes: number } {
  const [h, m] = timeStr.split(':').map(Number);
  return { hours: h, minutes: m };
}

/**
 * Converts a "HH:MM" string to total minutes since midnight.
 */
export function timeToMinutes(timeStr: string): number {
  const { hours, minutes } = parseTime(timeStr);
  return hours * 60 + minutes;
}

/**
 * Formats a 24-hour "HH:MM" string to a human-readable 12-hour time.
 * e.g. "13:35" → "1:35 PM"
 */
export function formatTime(timeStr: string): string {
  const { hours, minutes } = parseTime(timeStr);
  const period = hours >= 12 ? 'PM' : 'AM';
  const h = hours % 12 === 0 ? 12 : hours % 12;
  const m = String(minutes).padStart(2, '0');
  return `${h}:${m} ${period}`;
}

/**
 * Returns today's DaySchedule based on the current date.
 * On weekends, returns the Friday schedule as a fallback.
 */
export function getTodaySchedule(): DaySchedule {
  const day = new Date().getDay();
  return scheduleByDay[day] ?? fridaySchedule;
}

/**
 * Given a DaySchedule, returns info about the currently active period,
 * the upcoming next period, minutes remaining in the current period,
 * and a 0–100 progress value.
 */
export function getCurrentPeriod(schedule: DaySchedule): {
  period: Period | null;
  nextPeriod: Period | null;
  minutesRemaining: number;
  progress: number;
} {
  const now = new Date();
  const currentMinutes =
    now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;

  let activePeriod: Period | null = null;
  let nextPeriod: Period | null = null;

  for (let i = 0; i < schedule.periods.length; i++) {
    const p = schedule.periods[i];
    const start = timeToMinutes(p.startTime);
    const end = timeToMinutes(p.endTime);

    if (currentMinutes >= start && currentMinutes < end) {
      activePeriod = p;
      // Look ahead for the next period after this one
      const remaining = schedule.periods.slice(i + 1);
      nextPeriod =
        remaining.find(
          (np) => np.type !== 'before' && np.type !== 'after'
        ) ?? null;
      break;
    }

    // Track the next upcoming period even if nothing is currently active
    if (currentMinutes < start && nextPeriod === null) {
      nextPeriod = p;
    }
  }

  let minutesRemaining = 0;
  let progress = 0;

  if (activePeriod) {
    const start = timeToMinutes(activePeriod.startTime);
    const end = timeToMinutes(activePeriod.endTime);
    const total = end - start;
    const elapsed = currentMinutes - start;
    minutesRemaining = Math.max(0, end - currentMinutes);
    progress =
      total > 0 ? Math.min(100, Math.max(0, (elapsed / total) * 100)) : 0;
  }

  return { period: activePeriod, nextPeriod, minutesRemaining, progress };
}

// ============================================================
// Legacy exports (backwards-compatibility with old BellSchedule)
// ============================================================

/** @deprecated Use per-day schedule exports instead */
export const standardSchedule = tuesdaySchedule;

/** @deprecated Use fridaySchedule instead */
export const minimumDaySchedule = fridaySchedule;

/** @deprecated Use DaySchedule instead */
export type Schedule = DaySchedule;

export const schedules: Record<string, DaySchedule> = {
  standard: tuesdaySchedule,
  minimum: fridaySchedule,
};
