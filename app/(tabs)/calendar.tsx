// ============================================================
// School Calendar Screen
// Emerald High School Student Portal
// ============================================================

import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import {
  getEventsForMonth,
  getUpcomingEvents,
  type CalendarEvent,
} from '@/data/calendar';

// ============================================================
// Types & Constants
// ============================================================

type EventType =
  | 'holiday'
  | 'break'
  | 'event'
  | 'deadline'
  | 'early-release'
  | 'staff'
  | 'sports'
  | 'academic';

const EVENT_COLORS: Record<EventType, string> = {
  holiday: '#10b981',
  break: '#3b82f6',
  event: '#8b5cf6',
  deadline: '#ef4444',
  'early-release': '#f59e0b',
  staff: '#64748b',
  sports: '#f97316',
  academic: '#06b6d4',
};

const EVENT_LABELS: Record<EventType, string> = {
  holiday: 'Holiday',
  break: 'Break',
  event: 'School Event',
  deadline: 'Deadline',
  'early-release': 'Early Release',
  staff: 'Staff Day',
  sports: 'Sports',
  academic: 'Academic',
};

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const DAY_HEADERS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// ============================================================
// Helpers
// ============================================================

function todayString(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function dateString(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function eventSpansDate(event: CalendarEvent, dateStr: string): boolean {
  const end = event.endDate ?? event.date;
  return event.date <= dateStr && end >= dateStr;
}

function formatEventDate(event: CalendarEvent): string {
  const start = new Date(event.date + 'T00:00:00');
  const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  if (event.endDate && event.endDate !== event.date) {
    const end = new Date(event.endDate + 'T00:00:00');
    return `${start.toLocaleDateString('en-US', opts)} – ${end.toLocaleDateString('en-US', opts)}`;
  }
  return start.toLocaleDateString('en-US', { ...opts, weekday: 'short' });
}

function timeAgo(dateStr: string): string {
  const now = new Date();
  const d = new Date(dateStr + 'T00:00:00');
  const diffDays = Math.round((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';
  if (diffDays > 0 && diffDays < 7) return `In ${diffDays} days`;
  if (diffDays > 0 && diffDays < 30) return `In ${Math.round(diffDays / 7)} week${Math.round(diffDays / 7) > 1 ? 's' : ''}`;
  if (diffDays < 0 && diffDays > -7) return `${Math.abs(diffDays)} days ago`;
  return formatEventDate({ date: dateStr } as CalendarEvent);
}

// ============================================================
// Sub-component: Event type badge
// ============================================================
function EventTypeBadge({ type }: { type: EventType }) {
  const color = EVENT_COLORS[type];
  return (
    <View style={[styles.typeBadge, { backgroundColor: `${color}18`, borderColor: `${color}40` }]}>
      <Text style={[styles.typeBadgeText, { color }]}>
        {EVENT_LABELS[type]}
      </Text>
    </View>
  );
}

// ============================================================
// Sub-component: Event card (in list / panel)
// ============================================================
function EventCard({ event }: { event: CalendarEvent }) {
  const color = EVENT_COLORS[event.type as EventType];
  return (
    <View style={[styles.eventCard, { borderLeftColor: color }]}>
      <View style={styles.eventCardTop}>
        <Text style={styles.eventCardIcon}>{event.icon ?? '📅'}</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.eventCardTitle} numberOfLines={2}>{event.title}</Text>
          <Text style={styles.eventCardDate}>{formatEventDate(event)}</Text>
        </View>
        <EventTypeBadge type={event.type as EventType} />
      </View>
      {event.description && (
        <Text style={styles.eventCardDesc} numberOfLines={3}>
          {event.description}
        </Text>
      )}
    </View>
  );
}

// ============================================================
// Sub-component: Upcoming event row (compact)
// ============================================================
function UpcomingEventRow({ event }: { event: CalendarEvent }) {
  const color = EVENT_COLORS[event.type as EventType];
  return (
    <View style={styles.upcomingRow}>
      <View style={[styles.upcomingAccent, { backgroundColor: color }]} />
      <View style={styles.upcomingContent}>
        <View style={styles.upcomingTopRow}>
          <Text style={styles.upcomingIcon}>{event.icon ?? '📅'}</Text>
          <Text style={styles.upcomingTitle} numberOfLines={1}>{event.title}</Text>
        </View>
        <View style={styles.upcomingMeta}>
          <Text style={styles.upcomingDate}>{formatEventDate(event)}</Text>
          <View style={[styles.upcomingTimePill, { backgroundColor: `${color}18` }]}>
            <Text style={[styles.upcomingTimeText, { color }]}>{timeAgo(event.date)}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

// ============================================================
// Sub-component: Calendar grid
// ============================================================
interface CalendarGridProps {
  year: number;
  month: number; // 1-indexed
  events: CalendarEvent[];
  selectedDate: string | null;
  onSelectDate: (dateStr: string) => void;
}

function CalendarGrid({ year, month, events, selectedDate, onSelectDate }: CalendarGridProps) {
  const today = todayString();

  // Build grid cells: null = padding, number = day
  const cells = useMemo<(number | null)[]>(() => {
    const firstDow = new Date(year, month - 1, 1).getDay(); // 0=Sun
    const daysInMonth = new Date(year, month, 0).getDate();
    const grid: (number | null)[] = Array(firstDow).fill(null);
    for (let d = 1; d <= daysInMonth; d++) grid.push(d);
    // Pad to full rows
    while (grid.length % 7 !== 0) grid.push(null);
    return grid;
  }, [year, month]);

  // Map dateStr -> events
  const eventsByDate = useMemo<Record<string, CalendarEvent[]>>(() => {
    const map: Record<string, CalendarEvent[]> = {};
    const daysInMonth = new Date(year, month, 0).getDate();
    for (let d = 1; d <= daysInMonth; d++) {
      const ds = dateString(year, month, d);
      const dayEvents = events.filter((e) => eventSpansDate(e, ds));
      if (dayEvents.length > 0) map[ds] = dayEvents;
    }
    return map;
  }, [year, month, events]);

  const rows: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    rows.push(cells.slice(i, i + 7));
  }

  return (
    <View style={styles.calendarGrid}>
      {/* Day-of-week header */}
      <View style={styles.dowHeader}>
        {DAY_HEADERS.map((h) => (
          <View key={h} style={styles.dowCell}>
            <Text style={[
              styles.dowText,
              (h === 'Sun' || h === 'Sat') && styles.dowTextWeekend,
            ]}>
              {h}
            </Text>
          </View>
        ))}
      </View>

      {/* Week rows */}
      {rows.map((row, ri) => (
        <View key={ri} style={styles.weekRow}>
          {row.map((day, ci) => {
            if (day === null) {
              return <View key={ci} style={styles.dayCell} />;
            }
            const ds = dateString(year, month, day);
            const isToday = ds === today;
            const isSelected = ds === selectedDate;
            const dayEvents = eventsByDate[ds] ?? [];
            const hasEvents = dayEvents.length > 0;
            const isWeekend = ci === 0 || ci === 6;

            return (
              <Pressable
                key={ci}
                style={({ pressed }) => [
                  styles.dayCell,
                  hasEvents && styles.dayCellHasEvents,
                  isSelected && styles.dayCellSelected,
                  pressed && { opacity: 0.7 },
                ]}
                onPress={() => onSelectDate(ds)}
              >
                {/* Today circle */}
                {isToday && !isSelected && (
                  <View style={styles.todayCircle} />
                )}
                {isSelected && (
                  <View style={styles.selectedCircle} />
                )}
                <Text style={[
                  styles.dayNumber,
                  isToday && styles.dayNumberToday,
                  isSelected && styles.dayNumberSelected,
                  isWeekend && !isToday && !isSelected && styles.dayNumberWeekend,
                ]}>
                  {day}
                </Text>
                {/* Event dots (up to 3) */}
                {dayEvents.length > 0 && (
                  <View style={styles.dotRow}>
                    {dayEvents.slice(0, 3).map((e, ei) => (
                      <View
                        key={ei}
                        style={[
                          styles.eventDot,
                          { backgroundColor: EVENT_COLORS[e.type as EventType] },
                        ]}
                      />
                    ))}
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
}

// ============================================================
// Main Screen
// ============================================================
export default function CalendarScreen() {
  const insets = useSafeAreaInsets();
  const today = new Date();

  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1); // 1-indexed
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const monthEvents = useMemo(() => getEventsForMonth(year, month), [year, month]);
  const upcomingEvents = useMemo(() => getUpcomingEvents(5), []);

  const selectedDayEvents = useMemo<CalendarEvent[]>(() => {
    if (!selectedDate) return [];
    return monthEvents.filter((e) => eventSpansDate(e, selectedDate));
  }, [selectedDate, monthEvents]);

  const goToPrevMonth = useCallback(() => {
    if (month === 1) { setYear(y => y - 1); setMonth(12); }
    else setMonth(m => m - 1);
    setSelectedDate(null);
  }, [month]);

  const goToNextMonth = useCallback(() => {
    if (month === 12) { setYear(y => y + 1); setMonth(1); }
    else setMonth(m => m + 1);
    setSelectedDate(null);
  }, [month]);

  const handleSelectDate = useCallback((ds: string) => {
    setSelectedDate(prev => (prev === ds ? null : ds));
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: Colors.bgPrimary }]}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <LinearGradient
          colors={['#022c22', Colors.bgPrimary]}
          style={[styles.header, { paddingTop: insets.top + 14 }]}
        >
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.headerTitle}>Calendar</Text>
              <Text style={styles.headerSub}>EHS 2025–26 School Year</Text>
            </View>
            <View style={styles.headerIconWrap}>
              <Ionicons name="calendar" size={22} color={Colors.emerald400} />
            </View>
          </View>
        </LinearGradient>

        {/* ── Month navigator ── */}
        <View style={styles.monthNav}>
          <Pressable
            onPress={goToPrevMonth}
            style={({ pressed }) => [styles.chevronBtn, pressed && { opacity: 0.6 }]}
          >
            <Ionicons name="chevron-back" size={20} color={Colors.textPrimary} />
          </Pressable>

          <View style={{ alignItems: 'center' }}>
            <Text style={styles.monthTitle}>{MONTH_NAMES[month - 1]} {year}</Text>
            <Text style={styles.monthEventCount}>
              {monthEvents.length} event{monthEvents.length !== 1 ? 's' : ''}
            </Text>
          </View>

          <Pressable
            onPress={goToNextMonth}
            style={({ pressed }) => [styles.chevronBtn, pressed && { opacity: 0.6 }]}
          >
            <Ionicons name="chevron-forward" size={20} color={Colors.textPrimary} />
          </Pressable>
        </View>

        {/* ── Calendar grid ── */}
        <View style={styles.gridWrapper}>
          <CalendarGrid
            year={year}
            month={month}
            events={monthEvents}
            selectedDate={selectedDate}
            onSelectDate={handleSelectDate}
          />
        </View>

        {/* ── Legend ── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.legend}
        >
          {(Object.keys(EVENT_COLORS) as EventType[]).map((type) => (
            <View key={type} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: EVENT_COLORS[type] }]} />
              <Text style={styles.legendText}>{EVENT_LABELS[type]}</Text>
            </View>
          ))}
        </ScrollView>

        {/* ── Selected day panel ── */}
        {selectedDate !== null && (
          <View style={styles.panel}>
            <View style={styles.panelHeader}>
              <View>
                <Text style={styles.panelTitle}>
                  {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
                    weekday: 'long', month: 'long', day: 'numeric',
                  })}
                </Text>
                <Text style={styles.panelSub}>
                  {selectedDayEvents.length === 0
                    ? 'No events on this day'
                    : `${selectedDayEvents.length} event${selectedDayEvents.length !== 1 ? 's' : ''}`}
                </Text>
              </View>
              <Pressable
                onPress={() => setSelectedDate(null)}
                style={({ pressed }) => [styles.panelClose, pressed && { opacity: 0.6 }]}
              >
                <Ionicons name="close" size={18} color={Colors.textDim} />
              </Pressable>
            </View>

            {selectedDayEvents.length === 0 ? (
              <View style={styles.panelEmpty}>
                <Ionicons name="calendar-outline" size={28} color={Colors.textDim} style={{ marginBottom: 8 }} />
                <Text style={styles.panelEmptyText}>No school events scheduled for this day.</Text>
              </View>
            ) : (
              <View style={{ gap: 8 }}>
                {selectedDayEvents.map((e) => (
                  <EventCard key={e.id} event={e} />
                ))}
              </View>
            )}
          </View>
        )}

        {/* ── Upcoming events (shown when no day selected) ── */}
        {selectedDate === null && (
          <View style={styles.upcomingSection}>
            <View style={styles.upcomingSectionHeader}>
              <Ionicons name="time-outline" size={16} color={Colors.emerald400} />
              <Text style={styles.upcomingSectionTitle}>Upcoming Events</Text>
            </View>
            {upcomingEvents.length === 0 ? (
              <Text style={styles.noUpcomingText}>No upcoming events found.</Text>
            ) : (
              <View style={{ gap: 6 }}>
                {upcomingEvents.map((e) => (
                  <UpcomingEventRow key={e.id} event={e} />
                ))}
              </View>
            )}
          </View>
        )}

        {/* ── Footer ── */}
        <View style={styles.footer}>
          <View style={styles.footerDivider} />
          <Text style={styles.footerText}>
            EMERALD HIGH SCHOOL • 2025–26 ACADEMIC CALENDAR
          </Text>
          <Text style={styles.footerSub}>
            Dates subject to change. Check DUSD for official updates.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

// ============================================================
// Styles
// ============================================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // ── Header ──
  header: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  headerTitle: {
    color: Colors.textPrimary,
    fontFamily: 'Syne_700Bold',
    fontSize: 26,
  },
  headerSub: {
    color: Colors.textDim,
    fontFamily: 'DMMono_400Regular',
    fontSize: 11,
    letterSpacing: 0.5,
    marginTop: 2,
  },
  headerIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(16,185,129,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(16,185,129,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Month nav ──
  monthNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  chevronBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthTitle: {
    color: Colors.textPrimary,
    fontFamily: 'Syne_700Bold',
    fontSize: 20,
    textAlign: 'center',
  },
  monthEventCount: {
    color: Colors.textDim,
    fontFamily: 'DMMono_400Regular',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 2,
  },

  // ── Grid ──
  gridWrapper: {
    paddingHorizontal: 12,
    marginBottom: 4,
  },
  calendarGrid: {
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 8,
  },
  dowHeader: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  dowCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
  },
  dowText: {
    color: Colors.textDim,
    fontFamily: 'DMMono_400Regular',
    fontSize: 11,
  },
  dowTextWeekend: {
    color: 'rgba(75,138,107,0.5)',
  },
  weekRow: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  dayCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
    borderRadius: 8,
    minHeight: 46,
    justifyContent: 'center',
    gap: 2,
    position: 'relative',
  },
  dayCellHasEvents: {
    backgroundColor: 'rgba(16,185,129,0.05)',
  },
  dayCellSelected: {
    backgroundColor: 'rgba(16,185,129,0.12)',
  },
  todayCircle: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(52,211,153,0.2)',
    borderWidth: 1.5,
    borderColor: '#34d399',
  },
  selectedCircle: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#10b981',
  },
  dayNumber: {
    color: Colors.textPrimary,
    fontFamily: 'DMSans_500Medium',
    fontSize: 13,
    zIndex: 1,
  },
  dayNumberToday: {
    color: '#34d399',
    fontFamily: 'DMSans_700Bold',
  },
  dayNumberSelected: {
    color: '#fff',
    fontFamily: 'DMSans_700Bold',
  },
  dayNumberWeekend: {
    color: 'rgba(240,253,244,0.45)',
  },
  dotRow: {
    flexDirection: 'row',
    gap: 2,
    zIndex: 1,
  },
  eventDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },

  // ── Legend ──
  legend: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
    flexDirection: 'row',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: Colors.bgCard,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  legendDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  legendText: {
    color: Colors.textDim,
    fontFamily: 'DMSans_400Regular',
    fontSize: 11,
  },

  // ── Selected day panel ──
  panel: {
    marginHorizontal: 12,
    marginTop: 8,
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
  },
  panelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  panelTitle: {
    color: Colors.textPrimary,
    fontFamily: 'Syne_700Bold',
    fontSize: 17,
  },
  panelSub: {
    color: Colors.textDim,
    fontFamily: 'DMMono_400Regular',
    fontSize: 11,
    marginTop: 2,
  },
  panelClose: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(75,138,107,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  panelEmpty: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  panelEmptyText: {
    color: Colors.textDim,
    fontFamily: 'DMSans_400Regular',
    fontSize: 13,
    textAlign: 'center',
  },

  // ── Event card ──
  eventCard: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    borderLeftWidth: 3,
    padding: 12,
  },
  eventCardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 4,
  },
  eventCardIcon: {
    fontSize: 18,
    lineHeight: 24,
  },
  eventCardTitle: {
    color: Colors.textPrimary,
    fontFamily: 'DMSans_700Bold',
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
  eventCardDate: {
    color: Colors.textDim,
    fontFamily: 'DMMono_400Regular',
    fontSize: 11,
    marginTop: 2,
  },
  eventCardDesc: {
    color: 'rgba(240,253,244,0.55)',
    fontFamily: 'DMSans_400Regular',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
    paddingLeft: 28,
  },

  // ── Type badge ──
  typeBadge: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 100,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  typeBadgeText: {
    fontFamily: 'DMMono_400Regular',
    fontSize: 9,
    letterSpacing: 0.3,
  },

  // ── Upcoming events ──
  upcomingSection: {
    marginHorizontal: 12,
    marginTop: 8,
  },
  upcomingSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginBottom: 10,
  },
  upcomingSectionTitle: {
    color: Colors.textPrimary,
    fontFamily: 'Syne_700Bold',
    fontSize: 17,
  },
  noUpcomingText: {
    color: Colors.textDim,
    fontFamily: 'DMSans_400Regular',
    fontSize: 13,
    textAlign: 'center',
    paddingVertical: 16,
  },
  upcomingRow: {
    flexDirection: 'row',
    backgroundColor: Colors.bgCard,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  upcomingAccent: {
    width: 3,
    alignSelf: 'stretch',
  },
  upcomingContent: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  upcomingTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  upcomingIcon: {
    fontSize: 15,
  },
  upcomingTitle: {
    color: Colors.textPrimary,
    fontFamily: 'DMSans_500Medium',
    fontSize: 14,
    flex: 1,
  },
  upcomingMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  upcomingDate: {
    color: Colors.textDim,
    fontFamily: 'DMMono_400Regular',
    fontSize: 11,
    flex: 1,
  },
  upcomingTimePill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 100,
  },
  upcomingTimeText: {
    fontFamily: 'DMMono_400Regular',
    fontSize: 10,
  },

  // ── Footer ──
  footer: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  footerDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginBottom: 14,
  },
  footerText: {
    color: Colors.textDim,
    fontFamily: 'DMMono_400Regular',
    fontSize: 10,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  footerSub: {
    color: Colors.textDim,
    fontFamily: 'DMSans_400Regular',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 4,
    opacity: 0.7,
  },
});
