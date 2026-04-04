export type PeriodType = 'class' | 'break' | 'lunch' | 'before' | 'after';

export interface Period {
  id: string;
  name: string;
  startTime: string; // "HH:MM" 24hr
  endTime: string;   // "HH:MM" 24hr
  type: PeriodType;
}

export interface Schedule {
  name: string;
  periods: Period[];
}

export const standardSchedule: Schedule = {
  name: 'Standard Day',
  periods: [
    { id: 'p1', name: 'Period 1', startTime: '08:00', endTime: '08:55', type: 'class' },
    { id: 'p2', name: 'Period 2', startTime: '09:00', endTime: '09:55', type: 'class' },
    { id: 'break', name: 'Break', startTime: '09:55', endTime: '10:10', type: 'break' },
    { id: 'p3', name: 'Period 3', startTime: '10:15', endTime: '11:05', type: 'class' },
    { id: 'p4', name: 'Period 4', startTime: '11:10', endTime: '12:00', type: 'class' },
    { id: 'lunch', name: 'Lunch', startTime: '12:00', endTime: '12:35', type: 'lunch' },
    { id: 'p5', name: 'Period 5', startTime: '12:40', endTime: '13:30', type: 'class' },
    { id: 'p6', name: 'Period 6', startTime: '13:35', endTime: '14:25', type: 'class' },
    { id: 'p7', name: 'Period 7', startTime: '14:30', endTime: '15:20', type: 'class' },
  ],
};

export const minimumDaySchedule: Schedule = {
  name: 'Minimum Day',
  periods: [
    { id: 'p1', name: 'Period 1', startTime: '08:00', endTime: '08:43', type: 'class' },
    { id: 'p2', name: 'Period 2', startTime: '08:47', endTime: '09:30', type: 'class' },
    { id: 'break', name: 'Break', startTime: '09:30', endTime: '09:40', type: 'break' },
    { id: 'p3', name: 'Period 3', startTime: '09:44', endTime: '10:27', type: 'class' },
    { id: 'p4', name: 'Period 4', startTime: '10:31', endTime: '11:14', type: 'class' },
    { id: 'lunch', name: 'Lunch', startTime: '11:14', endTime: '11:44', type: 'lunch' },
    { id: 'p5', name: 'Period 5', startTime: '11:48', endTime: '12:24', type: 'class' },
  ],
};

export const schedules: Record<string, Schedule> = {
  standard: standardSchedule,
  minimum: minimumDaySchedule,
};

export function parseTime(timeStr: string): { hours: number; minutes: number } {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return { hours, minutes };
}

export function timeToMinutes(timeStr: string): number {
  const { hours, minutes } = parseTime(timeStr);
  return hours * 60 + minutes;
}

export function formatTime(timeStr: string): string {
  const { hours, minutes } = parseTime(timeStr);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}
