export interface LunchItem {
  name: string;
  isVegetarian?: boolean;
  isVegan?: boolean;
}

export interface DayMenu {
  date: string; // "2026-04-07" etc.
  dayName: string;
  breakfast: {
    hot: LunchItem[];   // day-specific hot items
    daily: LunchItem[]; // always available
  };
  lunch: {
    entrees: LunchItem[]; // 2 options
    daily: LunchItem[];   // always available daily options
  };
}

export interface WeekMenu {
  weekStart: string; // e.g. "April 7, 2026"
  days: DayMenu[];
}

// ── Always-available items ───────────────────────────────────────────────────

const DAILY_BREAKFAST: LunchItem[] = [
  { name: 'Nonfat or 1% Milk' },
  { name: 'Fresh Fruit & Veggies', isVegetarian: true, isVegan: true },
  { name: 'Assorted Cereal', isVegetarian: true },
  { name: 'Yogurt Parfait', isVegetarian: true },
  { name: 'Vegan Coconut Chia Pudding with Seasonal Fruit', isVegetarian: true, isVegan: true },
  { name: 'Assorted Breakfast Bar', isVegetarian: true },
  { name: 'Assorted Muffins', isVegetarian: true },
  { name: 'Raspberry Breakfast Square', isVegetarian: true },
];

const DAILY_LUNCH: LunchItem[] = [
  { name: 'Chicken & Waffles' },
  { name: 'Spicy Chicken Sandwich' },
  { name: 'Spicy Chicken Salad', isVegetarian: true },
  { name: 'Cheesy Lasagna Roll-Ups', isVegetarian: true },
  { name: 'Strawberry Spring Salad', isVegetarian: true },
  { name: "Chef's Choice Salad", isVegetarian: true },
  { name: 'Protein Box' },
];

// ── Day-specific breakfast hot items ────────────────────────────────────────

const MONDAY_BREAKFAST_HOT: LunchItem[] = [
  { name: 'Assorted Local Bagels with Cream Cheese', isVegetarian: true },
  { name: 'Banana Chocolate Muffin', isVegetarian: true },
];

const TUESDAY_BREAKFAST_HOT: LunchItem[] = [
  { name: 'Assorted Muffins', isVegetarian: true },
  { name: 'Raspberry Breakfast Square', isVegetarian: true },
];

const WEDNESDAY_BREAKFAST_HOT: LunchItem[] = [
  { name: 'Sausage Egg Cheese English Muffin' },
  { name: 'Waffle', isVegetarian: true },
];

const THURSDAY_BREAKFAST_HOT: LunchItem[] = [
  { name: 'Vegan Coconut Chia Pudding with Seasonal Fruit', isVegetarian: true, isVegan: true },
  { name: 'Assorted Breakfast Bar', isVegetarian: true },
];

const FRIDAY_BREAKFAST_HOT: LunchItem[] = [
  { name: 'Egg Cheese & Potato Breakfast Burrito', isVegetarian: true },
  { name: 'Cinnamon Roll', isVegetarian: true },
];

// ── Lunch entrees by day ─────────────────────────────────────────────────────

const MONDAY_ENTREES: LunchItem[] = [
  { name: "Chef's Choice Pizza" },
  { name: 'Cheese Pizza', isVegetarian: true },
];

const TUESDAY_ENTREES: LunchItem[] = [
  { name: 'Beef Birria & Cheese Pupusa' },
  { name: 'Bean & Cheese Quesadilla', isVegetarian: true },
];

const WEDNESDAY_ENTREES: LunchItem[] = [
  { name: 'Buffalo Tenders with Potato Wedges' },
  { name: 'Mac & Cheese', isVegetarian: true },
];

const THURSDAY_ENTREES: LunchItem[] = [
  { name: 'BBQ Bacon Burger with Onion Rings' },
  { name: 'Black Bean Burger with Onion Rings', isVegetarian: true },
];

const FRIDAY_ENTREES: LunchItem[] = [
  { name: 'Chicken Shawarma Wrap' },
  { name: 'Veggie Shawarma Wrap', isVegetarian: true },
];

// ── Factory helpers ──────────────────────────────────────────────────────────

type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';

interface DayConfig {
  dayName: DayOfWeek;
  breakfastHot: LunchItem[];
  entrees: LunchItem[];
}

const DAY_CONFIGS: DayConfig[] = [
  { dayName: 'Monday',    breakfastHot: MONDAY_BREAKFAST_HOT,    entrees: MONDAY_ENTREES    },
  { dayName: 'Tuesday',   breakfastHot: TUESDAY_BREAKFAST_HOT,   entrees: TUESDAY_ENTREES   },
  { dayName: 'Wednesday', breakfastHot: WEDNESDAY_BREAKFAST_HOT, entrees: WEDNESDAY_ENTREES },
  { dayName: 'Thursday',  breakfastHot: THURSDAY_BREAKFAST_HOT,  entrees: THURSDAY_ENTREES  },
  { dayName: 'Friday',    breakfastHot: FRIDAY_BREAKFAST_HOT,    entrees: FRIDAY_ENTREES    },
];

/** Build a DayMenu given a YYYY-MM-DD date string */
function buildDayMenu(dateStr: string): DayMenu {
  const [year, month, day] = dateStr.split('-').map(Number);
  // JS Date: month is 0-indexed
  const jsDate = new Date(year, month - 1, day);
  const dow = jsDate.getDay(); // 0=Sun, 1=Mon … 5=Fri, 6=Sat
  // Map Sunday→0 but we only call this for weekdays
  const configIndex = dow - 1; // Mon=0 … Fri=4
  const config = DAY_CONFIGS[configIndex];

  return {
    date: dateStr,
    dayName: config.dayName,
    breakfast: {
      hot: config.breakfastHot,
      daily: DAILY_BREAKFAST,
    },
    lunch: {
      entrees: config.entrees,
      daily: DAILY_LUNCH,
    },
  };
}

/** Build a full Mon–Fri WeekMenu given the Monday date (YYYY-MM-DD) */
function buildWeek(mondayDateStr: string, weekStartLabel: string): WeekMenu {
  const [year, month, day] = mondayDateStr.split('-').map(Number);
  const days: DayMenu[] = [];

  for (let offset = 0; offset < 5; offset++) {
    const d = new Date(year, month - 1, day + offset);
    const yy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    days.push(buildDayMenu(`${yy}-${mm}-${dd}`));
  }

  return { weekStart: weekStartLabel, days };
}

// ── April 2026 — four full weeks ─────────────────────────────────────────────
//
// Note: April 6 is a Monday (week 1 starts Apr 6).

export const aprilMenuWeeks: WeekMenu[] = [
  buildWeek('2026-04-06', 'April 6, 2026'),
  buildWeek('2026-04-13', 'April 13, 2026'),
  buildWeek('2026-04-20', 'April 20, 2026'),
  buildWeek('2026-04-27', 'April 27, 2026'),
];

// ── Menu notes ───────────────────────────────────────────────────────────────

export const menuNotes: string[] = [
  '1 breakfast and 1 lunch FREE daily',
  'Meals must include a fruit or vegetable',
  'Peanut & tree nut free (except coconut)',
  'All meals meet USDA nutrition guidelines',
];

// ── Query helpers ─────────────────────────────────────────────────────────────

/** Returns today's DayMenu, or null if today is a weekend or outside the menu range. */
export function getTodayMenu(): DayMenu | null {
  const now = new Date();
  const dow = now.getDay(); // 0=Sun, 6=Sat
  if (dow === 0 || dow === 6) return null;

  const yy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const todayStr = `${yy}-${mm}-${dd}`;

  for (const week of aprilMenuWeeks) {
    for (const dayMenu of week.days) {
      if (dayMenu.date === todayStr) return dayMenu;
    }
  }
  return null;
}

/** Returns the WeekMenu that contains the given date (defaults to today). */
export function getWeekMenu(date?: Date): WeekMenu | null {
  const target = date ?? new Date();
  const yy = target.getFullYear();
  const mm = String(target.getMonth() + 1).padStart(2, '0');
  const dd = String(target.getDate()).padStart(2, '0');
  const targetStr = `${yy}-${mm}-${dd}`;

  for (const week of aprilMenuWeeks) {
    for (const dayMenu of week.days) {
      if (dayMenu.date === targetStr) return week;
    }
    // Also check if target is within the Mon–Fri span of this week
    const firstDate = week.days[0].date;
    const lastDate = week.days[week.days.length - 1].date;
    if (targetStr >= firstDate && targetStr <= lastDate) return week;
  }
  return null;
}
