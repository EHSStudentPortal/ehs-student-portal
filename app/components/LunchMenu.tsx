'use client';

import { useState } from 'react';
import {
  getTodayMenu,
  getWeekMenu,
  menuNotes,
  type DayMenu,
  type LunchItem,
  type WeekMenu,
} from '@/data/lunch';

// ── Small presentational helpers ─────────────────────────────────────────────

function VegBadge({ item }: { item: LunchItem }) {
  if (item.isVegan) {
    return (
      <span className="ml-2 inline-flex items-center rounded-full bg-green-100 px-1.5 py-0.5 text-[10px] font-bold text-green-700 ring-1 ring-green-300">
        V
      </span>
    );
  }
  if (item.isVegetarian) {
    return (
      <span className="ml-2 inline-flex items-center gap-0.5 rounded-full bg-green-50 px-1.5 py-0.5 text-[10px] font-semibold text-green-600 ring-1 ring-green-200">
        <svg className="h-2.5 w-2.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M10 2C5.58 2 2 5.58 2 10c0 4.42 3.58 8 8 8s8-3.58 8-8c0-4.42-3.58-8-8-8zm0 14.4c-3.53 0-6.4-2.87-6.4-6.4S6.47 3.6 10 3.6s6.4 2.87 6.4 6.4-2.87 6.4-6.4 6.4z" />
          <path d="M10 6a3.5 3.5 0 000 7 3.5 3.5 0 000-7z" />
        </svg>
        veg
      </span>
    );
  }
  return null;
}

function MenuItemRow({ item }: { item: LunchItem }) {
  return (
    <li className={`flex items-center gap-1 py-1 text-sm ${item.isVegetarian || item.isVegan ? 'text-green-800' : 'text-gray-700'}`}>
      <span className="flex-1">{item.name}</span>
      <VegBadge item={item} />
    </li>
  );
}

// ── Always-Available collapsible section ──────────────────────────────────────

function AlwaysAvailable({ items }: { items: LunchItem[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-3 rounded-xl border border-gray-100 bg-gray-50/70">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 transition-colors hover:text-gray-700"
        aria-expanded={open}
      >
        <span>Always Available</span>
        <svg
          className={`h-4 w-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {open && (
        <ul className="divide-y divide-gray-100 px-3 pb-2">
          {items.map((item) => (
            <MenuItemRow key={item.name} item={item} />
          ))}
        </ul>
      )}
    </div>
  );
}

// ── Today's Menu hero ─────────────────────────────────────────────────────────

function formatHeroDate(dateStr: string, dayName: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  const monthName = date.toLocaleString('en-US', { month: 'long' });
  return `${dayName}, ${monthName} ${day}`;
}

function TodayCard({ menu }: { menu: DayMenu }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-black/5">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-emerald-100">
          Today&apos;s Menu
        </p>
        <h2 className="mt-0.5 text-2xl font-bold text-white">
          {formatHeroDate(menu.date, menu.dayName)}
        </h2>
      </div>

      {/* Two-column body */}
      <div className="grid grid-cols-1 gap-px bg-gray-100 sm:grid-cols-2">
        {/* ── Breakfast column ── */}
        <div className="bg-white px-5 py-5">
          <div className="-mx-5 -mt-5 mb-4 flex items-center gap-2 bg-gradient-to-r from-amber-50 to-amber-100/60 px-5 py-3">
            <span className="text-lg" aria-label="fire">🔥</span>
            <h3 className="font-semibold text-amber-800">Breakfast</h3>
          </div>

          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-amber-600">
            Hot Items Today
          </p>
          <ul className="divide-y divide-gray-50">
            {menu.breakfast.hot.map((item) => (
              <MenuItemRow key={item.name} item={item} />
            ))}
          </ul>

          <AlwaysAvailable items={menu.breakfast.daily} />
        </div>

        {/* ── Lunch column ── */}
        <div className="bg-white px-5 py-5">
          <div className="-mx-5 -mt-5 mb-4 flex items-center gap-2 bg-gradient-to-r from-emerald-50 to-emerald-100/60 px-5 py-3">
            <span className="text-lg" aria-label="plate">🍽️</span>
            <h3 className="font-semibold text-emerald-800">Lunch</h3>
          </div>

          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-emerald-600">
            Entrée Options
          </p>
          <ul className="divide-y divide-gray-50">
            {menu.lunch.entrees.map((item) => (
              <MenuItemRow key={item.name} item={item} />
            ))}
          </ul>

          <AlwaysAvailable items={menu.lunch.daily} />
        </div>
      </div>
    </div>
  );
}

// ── Week strip ────────────────────────────────────────────────────────────────

const SHORT_DAYS: Record<string, string> = {
  Monday: 'Mon',
  Tuesday: 'Tue',
  Wednesday: 'Wed',
  Thursday: 'Thu',
  Friday: 'Fri',
};

function formatPillDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const d = new Date(year, month - 1, day);
  return d.toLocaleString('en-US', { month: 'short', day: 'numeric' });
}

function WeekStrip({
  week,
  todayDate,
}: {
  week: WeekMenu;
  todayDate: string | null;
}) {
  const [selectedDate, setSelectedDate] = useState<string | null>(
    todayDate ?? week.days[0]?.date ?? null,
  );

  const selectedMenu = week.days.find((d) => d.date === selectedDate) ?? null;

  return (
    <div>
      {/* Pill strip */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {week.days.map((day) => {
          const isToday = day.date === todayDate;
          const isSelected = day.date === selectedDate;
          return (
            <button
              key={day.date}
              onClick={() => setSelectedDate(day.date === selectedDate ? null : day.date)}
              className={`flex min-w-[64px] flex-col items-center rounded-xl px-3 py-2 text-center text-sm font-medium transition-all duration-150 ${
                isSelected
                  ? 'bg-emerald-500 text-white shadow-md'
                  : isToday
                  ? 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-300'
                  : 'bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50'
              }`}
            >
              <span className="text-xs font-semibold">{SHORT_DAYS[day.dayName] ?? day.dayName}</span>
              <span className={`text-[11px] ${isSelected ? 'text-emerald-100' : 'text-gray-400'}`}>
                {formatPillDate(day.date)}
              </span>
              {isToday && !isSelected && (
                <span className="mt-0.5 h-1 w-1 rounded-full bg-emerald-500" />
              )}
            </button>
          );
        })}
      </div>

      {/* Expanded day detail */}
      {selectedMenu && (
        <div className="mt-3 overflow-hidden rounded-xl bg-white shadow ring-1 ring-black/5">
          <div className="grid grid-cols-1 gap-px bg-gray-100 sm:grid-cols-2">
            {/* Breakfast */}
            <div className="bg-white p-4">
              <div className="-mx-4 -mt-4 mb-3 bg-amber-50 px-4 py-2">
                <h4 className="flex items-center gap-1.5 text-sm font-semibold text-amber-700">
                  <span>🔥</span> Breakfast
                </h4>
              </div>
              <ul className="divide-y divide-gray-50">
                {selectedMenu.breakfast.hot.map((item) => (
                  <MenuItemRow key={item.name} item={item} />
                ))}
              </ul>
              <AlwaysAvailable items={selectedMenu.breakfast.daily} />
            </div>

            {/* Lunch */}
            <div className="bg-white p-4">
              <div className="-mx-4 -mt-4 mb-3 bg-emerald-50 px-4 py-2">
                <h4 className="flex items-center gap-1.5 text-sm font-semibold text-emerald-700">
                  <span>🍽️</span> Lunch
                </h4>
              </div>
              <ul className="divide-y divide-gray-50">
                {selectedMenu.lunch.entrees.map((item) => (
                  <MenuItemRow key={item.name} item={item} />
                ))}
              </ul>
              <AlwaysAvailable items={selectedMenu.lunch.daily} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Menu Notes footer ─────────────────────────────────────────────────────────

const NOTE_ICONS = ['🎉', '🥦', '🌰', '✅'];
const NOTE_COLORS = [
  'bg-emerald-50 text-emerald-800 ring-emerald-200',
  'bg-amber-50 text-amber-800 ring-amber-200',
  'bg-rose-50 text-rose-800 ring-rose-200',
  'bg-blue-50 text-blue-800 ring-blue-200',
];

function MenuNotesFooter({ notes }: { notes: string[] }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {notes.map((note, i) => (
        <div
          key={note}
          className={`flex items-start gap-3 rounded-xl p-3 ring-1 ${NOTE_COLORS[i % NOTE_COLORS.length]}`}
        >
          <span className="mt-0.5 text-base" aria-hidden="true">
            {NOTE_ICONS[i % NOTE_ICONS.length]}
          </span>
          <p className="text-sm font-medium">{note}</p>
        </div>
      ))}
    </div>
  );
}

// ── No Menu state ─────────────────────────────────────────────────────────────

function NoMenuState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl bg-white px-6 py-16 shadow ring-1 ring-black/5">
      <span className="mb-4 text-5xl" aria-hidden="true">😴</span>
      <h2 className="text-xl font-bold text-gray-800">No menu today</h2>
      <p className="mt-2 max-w-xs text-center text-sm text-gray-500">
        The cafeteria is closed on weekends. Check back Monday through Friday for the daily menu.
      </p>
    </div>
  );
}

// ── Root export ───────────────────────────────────────────────────────────────

export default function LunchMenu() {
  const today = getTodayMenu();
  const todayDate = today?.date ?? null;

  // Determine which week to show in the strip.
  // If today has a menu, show that week; otherwise show the first week of April.
  const currentWeek: WeekMenu | null = today
    ? getWeekMenu(new Date(today.date.replace(/-/g, '/')))
    : getWeekMenu();

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-6">
      {/* ── Today's hero ── */}
      {today ? <TodayCard menu={today} /> : <NoMenuState />}

      {/* ── Week View ── */}
      {currentWeek && (
        <section>
          <h3 className="mb-3 flex items-center gap-2 text-base font-semibold text-gray-700">
            <svg
              className="h-4 w-4 text-emerald-500"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            Week of {currentWeek.weekStart}
          </h3>
          <WeekStrip week={currentWeek} todayDate={todayDate} />
        </section>
      )}

      {/* ── Notes footer ── */}
      <section aria-label="Menu information">
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
          Good to Know
        </h3>
        <MenuNotesFooter notes={menuNotes} />
      </section>
    </div>
  );
}
