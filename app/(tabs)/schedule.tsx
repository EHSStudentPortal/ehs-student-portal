// ============================================================
// Bell Schedule Screen
// Emerald High School Student Portal
// ============================================================

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Animated,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import LiveDot from '@/components/LiveDot';
import {
  getTodaySchedule,
  scheduleByDay,
  getCurrentPeriod,
  formatTime,
  timeToMinutes,
  type DaySchedule,
  type Period,
} from '@/data/schedule';

// ============================================================
// Constants
// ============================================================

/** JS day indices that map to weekday tabs */
const WEEKDAYS = [1, 2, 3, 4, 5] as const;
type WeekdayIndex = (typeof WEEKDAYS)[number];

interface DayTab {
  dayIndex: WeekdayIndex;
  short: string;
  label?: string; // special label shown beneath the day name
}

const DAY_TABS: DayTab[] = [
  { dayIndex: 1, short: 'Mon', label: 'ACCESS' },
  { dayIndex: 2, short: 'Tue' },
  { dayIndex: 3, short: 'Wed', label: 'Block Day' },
  { dayIndex: 4, short: 'Thu', label: 'Block Day' },
  { dayIndex: 5, short: 'Fri' },
];

// Accent colours per period type
const ACCESS_COLOR  = '#8b5cf6'; // purple
const LUNCH_COLOR   = '#f97316'; // orange
const STAFF_COLOR   = '#64748b'; // slate
const BLOCK_COLOR   = '#0d9488'; // teal  (#teal-600)
const CLASS_COLOR   = '#3b82f6'; // blue

// ============================================================
// Helper: format seconds-precise countdown
// ============================================================
function formatCountdown(minutesRemaining: number): string {
  const totalSec = Math.max(0, Math.round(minutesRemaining * 60));
  const h   = Math.floor(totalSec / 3600);
  const m   = Math.floor((totalSec % 3600) / 60);
  const s   = totalSec % 60;
  if (h > 0) return `${h}h ${m}m ${String(s).padStart(2, '0')}s`;
  if (m > 0) return `${m}m ${String(s).padStart(2, '0')}s`;
  return `${s}s`;
}

function formatDuration(startTime: string, endTime: string): string {
  const diff = timeToMinutes(endTime) - timeToMinutes(startTime);
  const h    = Math.floor(diff / 60);
  const m    = diff % 60;
  if (h > 0 && m > 0) return `${h}h ${m}m`;
  if (h > 0) return `${h}h`;
  return `${m}m`;
}

// ============================================================
// Sub-component: Day selector tabs
// ============================================================
interface DayTabsProps {
  selected: WeekdayIndex;
  todayIndex: number;
  onSelect: (d: WeekdayIndex) => void;
}

function DayTabs({ selected, todayIndex, onSelect }: DayTabsProps) {
  return (
    <View style={styles.tabRow}>
      {DAY_TABS.map((tab) => {
        const isSelected = tab.dayIndex === selected;
        const isToday    = tab.dayIndex === todayIndex;
        return (
          <Pressable
            key={tab.dayIndex}
            onPress={() => onSelect(tab.dayIndex)}
            style={({ pressed }) => [
              styles.tab,
              isSelected && styles.tabSelected,
              pressed && { opacity: 0.75 },
            ]}
          >
            {/* Today dot */}
            {isToday && (
              <View style={styles.todayDotWrapper}>
                <View
                  style={[
                    styles.todayDot,
                    { backgroundColor: isSelected ? '#34d399' : '#4b8a6b' },
                  ]}
                />
              </View>
            )}
            <Text
              style={[
                styles.tabDayText,
                isSelected ? styles.tabDayTextSelected : styles.tabDayTextDim,
              ]}
            >
              {tab.short}
            </Text>
            {tab.label ? (
              <Text
                style={[
                  styles.tabLabel,
                  isSelected ? styles.tabLabelSelected : styles.tabLabelDim,
                ]}
                numberOfLines={1}
              >
                {tab.label}
              </Text>
            ) : (
              // Keep height consistent even when no label
              <View style={{ height: 12 }} />
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

// ============================================================
// Sub-component: Live period card (today only)
// ============================================================
function LivePeriodCard({ schedule }: { schedule: DaySchedule }) {
  const [, setTick] = useState(0);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const prevProgressRef = useRef(0);

  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const { period, nextPeriod, minutesRemaining, progress } =
    getCurrentPeriod(schedule);

  // Animate progress bar only when it actually changes
  useEffect(() => {
    if (Math.abs(progress - prevProgressRef.current) > 0.01) {
      prevProgressRef.current = progress;
      Animated.timing(progressAnim, {
        toValue: progress / 100,
        duration: 500,
        useNativeDriver: false,
      }).start();
    }
  }, [progress, progressAnim]);

  const now     = new Date();
  const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit' });
  const dayStr  = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <LinearGradient
      colors={['#047857', '#065f46', '#064e3b']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.liveCard}
    >
      {/* Header row */}
      <View style={styles.liveCardHeader}>
        <View>
          <Text style={styles.liveCardDate}>{dayStr}</Text>
          <Text style={styles.liveCardTime}>{timeStr}</Text>
        </View>
        <View style={styles.liveBadge}>
          <LiveDot color="#34d399" size={7} />
          <Text style={styles.liveBadgeText}>LIVE</Text>
        </View>
      </View>

      {period ? (
        <>
          {/* NOW label */}
          <View style={styles.liveNowRow}>
            <LiveDot color="#34d399" size={8} />
            <Text style={styles.liveNowLabel}>NOW IN PROGRESS</Text>
          </View>

          <Text style={styles.livePeriodName}>{period.name}</Text>
          <Text style={styles.livePeriodTimes}>
            {formatTime(period.startTime)} – {formatTime(period.endTime)}
          </Text>

          {/* Countdown */}
          <View style={styles.liveCountdownRow}>
            <Ionicons name="hourglass-outline" size={13} color="rgba(255,255,255,0.55)" />
            <Text style={styles.liveCountdown}>
              {formatCountdown(minutesRemaining)} remaining
            </Text>
          </View>

          {/* Progress bar */}
          <View style={styles.progressWrapper}>
            <View style={styles.progressLabels}>
              <Text style={styles.progressLabel}>{formatTime(period.startTime)}</Text>
              <Text style={styles.progressCenter}>
                {Math.round(progress)}%
              </Text>
              <Text style={styles.progressLabel}>{formatTime(period.endTime)}</Text>
            </View>
            <View style={styles.progressTrack}>
              <Animated.View
                style={[
                  styles.progressFill,
                  {
                    width: progressAnim.interpolate({
                      inputRange:  [0, 1],
                      outputRange: ['0%', '100%'],
                    }),
                  },
                ]}
              />
            </View>
          </View>

          {nextPeriod && (
            <Text style={styles.liveNextPeriod}>
              Next: {nextPeriod.name} at {formatTime(nextPeriod.startTime)}
            </Text>
          )}
        </>
      ) : nextPeriod ? (
        <>
          <Text style={styles.liveUpcomingLabel}>COMING UP</Text>
          <Text style={styles.livePeriodName}>{nextPeriod.name}</Text>
          <Text style={styles.livePeriodTimes}>
            Starts at {formatTime(nextPeriod.startTime)}
          </Text>
        </>
      ) : (
        <>
          <Text style={styles.liveDoneTitle}>School day complete</Text>
          <Text style={styles.liveDoneSubtitle}>See you next time, Shamrock!</Text>
        </>
      )}
    </LinearGradient>
  );
}

// ============================================================
// Sub-component: Period row badges
// ============================================================
function PeriodBadge({ period }: { period: Period }) {
  const badges: React.ReactNode[] = [];

  if (period.blockDay) {
    badges.push(
      <View key="block" style={[styles.badge, { backgroundColor: 'rgba(13,148,136,0.18)', borderColor: 'rgba(13,148,136,0.4)' }]}>
        <Ionicons name="flash" size={10} color={BLOCK_COLOR} />
        <Text style={[styles.badgeText, { color: BLOCK_COLOR }]}>
          Block Day – {formatDuration(period.startTime, period.endTime)}
        </Text>
      </View>
    );
  }

  if (period.type === 'access') {
    badges.push(
      <View key="access" style={[styles.badge, { backgroundColor: 'rgba(139,92,246,0.15)', borderColor: 'rgba(139,92,246,0.35)' }]}>
        <Ionicons name="school" size={10} color={ACCESS_COLOR} />
        <Text style={[styles.badgeText, { color: ACCESS_COLOR }]}>ACCESS</Text>
      </View>
    );
  }

  if (period.type === 'staff') {
    badges.push(
      <View key="staff" style={[styles.badge, { backgroundColor: 'rgba(100,116,139,0.15)', borderColor: 'rgba(100,116,139,0.3)' }]}>
        <Ionicons name="lock-closed" size={10} color={STAFF_COLOR} />
        <Text style={[styles.badgeText, { color: STAFF_COLOR }]}>Staff Only</Text>
      </View>
    );
  }

  if (period.optional) {
    badges.push(
      <View key="optional" style={[styles.badge, { backgroundColor: 'rgba(75,138,107,0.12)', borderColor: 'rgba(75,138,107,0.25)' }]}>
        <Text style={[styles.badgeText, { color: Colors.textDim }]}>(optional)</Text>
      </View>
    );
  }

  if (badges.length === 0) return null;

  return <View style={styles.badgeRow}>{badges}</View>;
}

// ============================================================
// Sub-component: Individual period row
// ============================================================
interface PeriodRowProps {
  period: Period;
  isActive: boolean;
  isPast: boolean;
}

function PeriodRow({ period, isActive, isPast }: PeriodRowProps) {
  // Dot / accent colour
  let dotColor = CLASS_COLOR;
  if (period.type === 'lunch')  dotColor = LUNCH_COLOR;
  if (period.type === 'access') dotColor = ACCESS_COLOR;
  if (period.type === 'staff')  dotColor = STAFF_COLOR;
  if (period.type === 'break')  dotColor = Colors.warning;

  const duration = formatDuration(period.startTime, period.endTime);

  return (
    <View
      style={[
        styles.periodRow,
        isActive && styles.periodRowActive,
        isPast  && styles.periodRowPast,
      ]}
    >
      {/* Left accent bar */}
      <View
        style={[
          styles.periodAccentBar,
          { backgroundColor: isActive ? '#34d399' : dotColor },
          isPast && { opacity: 0.35 },
        ]}
      />

      {/* Live dot or static dot */}
      <View style={styles.periodDotWrapper}>
        {isActive ? (
          <LiveDot color="#10b981" size={9} />
        ) : (
          <View
            style={[
              styles.periodDotStatic,
              { backgroundColor: dotColor },
              isPast && { opacity: 0.4 },
            ]}
          />
        )}
      </View>

      {/* Text block */}
      <View style={styles.periodTextBlock}>
        <View style={styles.periodNameRow}>
          <Text
            style={[
              styles.periodName,
              isActive && styles.periodNameActive,
              isPast  && styles.periodNamePast,
            ]}
          >
            {period.name}
          </Text>
          {isActive && (
            <View style={styles.nowPill}>
              <Text style={styles.nowPillText}>NOW</Text>
            </View>
          )}
        </View>

        {/* Badges */}
        <PeriodBadge period={period} />

        {/* Time + duration row */}
        <View style={styles.periodTimeRow}>
          <Ionicons
            name="time-outline"
            size={11}
            color={isPast ? Colors.textDim : 'rgba(240,253,244,0.45)'}
          />
          <Text style={[styles.periodTimeText, isPast && { color: Colors.textDim }]}>
            {formatTime(period.startTime)} – {formatTime(period.endTime)}
          </Text>
          <View style={styles.periodTimeSep} />
          <Text style={[styles.periodDuration, isPast && { color: Colors.textDim }]}>
            {duration}
          </Text>
        </View>
      </View>
    </View>
  );
}

// ============================================================
// Sub-component: Day note footer
// ============================================================
function DayNote({ dayIndex }: { dayIndex: number }) {
  if (dayIndex === 3) {
    return (
      <View style={styles.dayNote}>
        <Ionicons name="information-circle-outline" size={14} color={Colors.textDim} />
        <Text style={styles.dayNoteText}>
          Wednesday: Odd periods (1, 3, 5)
        </Text>
      </View>
    );
  }
  if (dayIndex === 4) {
    return (
      <View style={styles.dayNote}>
        <Ionicons name="information-circle-outline" size={14} color={Colors.textDim} />
        <Text style={styles.dayNoteText}>
          Thursday: Even periods (2, 4, 6)
        </Text>
      </View>
    );
  }
  return null;
}

// ============================================================
// Main screen
// ============================================================
export default function ScheduleScreen() {
  const insets = useSafeAreaInsets();

  // Clamp today's getDay() to a weekday for the default tab
  const todayRaw       = new Date().getDay();
  const todayWeekday   = todayRaw === 0 || todayRaw === 6 ? 1 : todayRaw;
  const isToday        = (d: number) => d === todayRaw;

  const [selectedDay, setSelectedDay] = useState<WeekdayIndex>(
    todayWeekday as WeekdayIndex
  );

  // Always pull a fresh "current" minute value every second so period rows
  // reflect live past/active state when viewing today.
  const [nowMinutes, setNowMinutes] = useState(() => {
    const n = new Date();
    return n.getHours() * 60 + n.getMinutes() + n.getSeconds() / 60;
  });

  useEffect(() => {
    const t = setInterval(() => {
      const n = new Date();
      setNowMinutes(n.getHours() * 60 + n.getMinutes() + n.getSeconds() / 60);
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const daySchedule   = scheduleByDay[selectedDay];
  const todaySchedule = getTodaySchedule();
  const viewingToday  = isToday(selectedDay);

  const handleSelectDay = useCallback((d: WeekdayIndex) => {
    setSelectedDay(d);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: Colors.bgPrimary }]}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <LinearGradient
          colors={['#022c22', Colors.bgPrimary]}
          style={[styles.header, { paddingTop: insets.top + 14 }]}
        >
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.headerTitle}>Bell Schedule</Text>
              <Text style={styles.headerSub}>
                {daySchedule.label}
              </Text>
            </View>
            <View style={styles.headerIconWrap}>
              <Ionicons name="time" size={22} color={Colors.emerald400} />
            </View>
          </View>

          {/* Day selector */}
          <DayTabs
            selected={selectedDay}
            todayIndex={todayRaw}
            onSelect={handleSelectDay}
          />
        </LinearGradient>

        {/* ── Live card (today only) ── */}
        {viewingToday && (
          <View style={styles.liveCardWrapper}>
            <LivePeriodCard schedule={todaySchedule} />
          </View>
        )}

        {/* ── Period list ── */}
        <View style={styles.periodList}>
          <Text style={styles.sectionLabel}>PERIODS</Text>

          {daySchedule.periods.map((period) => {
            const startMins = timeToMinutes(period.startTime);
            const endMins   = timeToMinutes(period.endTime);

            // Only compute live state when viewing today
            const isActive = viewingToday
              ? nowMinutes >= startMins && nowMinutes < endMins
              : false;
            const isPast   = viewingToday
              ? nowMinutes >= endMins && !isActive
              : false;

            return (
              <PeriodRow
                key={period.id}
                period={period}
                isActive={isActive}
                isPast={isPast}
              />
            );
          })}
        </View>

        {/* ── Day note ── */}
        <DayNote dayIndex={selectedDay} />

        {/* ── Footer ── */}
        <View style={styles.footer}>
          <View style={styles.footerDivider} />
          <Text style={styles.footerText}>
            EMERALD HIGH SCHOOL • 2025–26 BELL SCHEDULE
          </Text>
          <Text style={styles.footerSub}>
            Times are official. Subject to change by administration.
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
    paddingBottom: 8,
  },
  headerRow: {
    flexDirection:  'row',
    alignItems:     'flex-start',
    justifyContent: 'space-between',
    marginBottom:   16,
  },
  headerTitle: {
    color:      Colors.textPrimary,
    fontFamily: 'Syne_700Bold',
    fontSize:   26,
  },
  headerSub: {
    color:       Colors.textDim,
    fontFamily:  'DMMono_400Regular',
    fontSize:    11,
    letterSpacing: 0.5,
    marginTop:   2,
  },
  headerIconWrap: {
    width:           44,
    height:          44,
    borderRadius:    12,
    backgroundColor: 'rgba(16,185,129,0.1)',
    borderWidth:     1,
    borderColor:     'rgba(16,185,129,0.2)',
    alignItems:      'center',
    justifyContent:  'center',
  },

  // ── Day tabs ──
  tabRow: {
    flexDirection:  'row',
    gap:            6,
    paddingBottom:  4,
  },
  tab: {
    flex:            1,
    alignItems:      'center',
    paddingVertical: 8,
    borderRadius:    12,
    backgroundColor: Colors.bgCard,
    borderWidth:     1,
    borderColor:     Colors.border,
    position:        'relative',
    overflow:        'visible',
    minHeight:       52,
    justifyContent:  'center',
  },
  tabSelected: {
    backgroundColor: 'rgba(16,185,129,0.14)',
    borderColor:     'rgba(52,211,153,0.45)',
  },
  todayDotWrapper: {
    position:       'absolute',
    top:            5,
    right:          6,
  },
  todayDot: {
    width:        5,
    height:       5,
    borderRadius: 2.5,
  },
  tabDayText: {
    fontFamily: 'DMSans_700Bold',
    fontSize:   13,
  },
  tabDayTextSelected: {
    color: Colors.emerald400,
  },
  tabDayTextDim: {
    color: Colors.textDim,
  },
  tabLabel: {
    fontFamily: 'DMMono_400Regular',
    fontSize:   9,
    letterSpacing: 0.2,
    marginTop:  2,
  },
  tabLabelSelected: {
    color: 'rgba(52,211,153,0.75)',
  },
  tabLabelDim: {
    color: 'rgba(75,138,107,0.6)',
  },

  // ── Live card ──
  liveCardWrapper: {
    paddingHorizontal: 16,
    marginTop:         14,
    marginBottom:      4,
  },
  liveCard: {
    borderRadius: 20,
    padding:      20,
  },
  liveCardHeader: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'flex-start',
    marginBottom:   14,
  },
  liveCardDate: {
    color:      'rgba(255,255,255,0.45)',
    fontFamily: 'DMMono_400Regular',
    fontSize:   11,
  },
  liveCardTime: {
    color:      '#fff',
    fontFamily: 'Syne_700Bold',
    fontSize:   24,
    marginTop:  2,
  },
  liveBadge: {
    flexDirection:   'row',
    alignItems:      'center',
    gap:             5,
    backgroundColor: 'rgba(52,211,153,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius:    100,
    borderWidth:     1,
    borderColor:     'rgba(52,211,153,0.3)',
  },
  liveBadgeText: {
    color:       '#34d399',
    fontFamily:  'DMMono_400Regular',
    fontSize:    10,
    letterSpacing: 1,
  },
  liveNowRow: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           7,
    marginBottom:  6,
  },
  liveNowLabel: {
    color:       '#6ee7b7',
    fontFamily:  'DMMono_400Regular',
    fontSize:    11,
    letterSpacing: 1,
  },
  livePeriodName: {
    color:       '#fff',
    fontFamily:  'Syne_700Bold',
    fontSize:    26,
    marginBottom: 2,
  },
  livePeriodTimes: {
    color:       'rgba(255,255,255,0.5)',
    fontFamily:  'DMMono_400Regular',
    fontSize:    13,
    marginBottom: 8,
  },
  liveCountdownRow: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           5,
    marginBottom:  14,
  },
  liveCountdown: {
    color:      'rgba(255,255,255,0.55)',
    fontFamily: 'DMMono_400Regular',
    fontSize:   13,
  },
  progressWrapper: {
    marginBottom: 12,
  },
  progressLabels: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    marginBottom:   5,
  },
  progressLabel: {
    color:      'rgba(255,255,255,0.35)',
    fontFamily: 'DMMono_400Regular',
    fontSize:   10,
  },
  progressCenter: {
    color:      '#34d399',
    fontFamily: 'DMMono_400Regular',
    fontSize:   10,
  },
  progressTrack: {
    height:          7,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius:    4,
    overflow:        'hidden',
  },
  progressFill: {
    height:          '100%',
    borderRadius:    4,
    backgroundColor: '#34d399',
  },
  liveNextPeriod: {
    color:      'rgba(255,255,255,0.4)',
    fontFamily: 'DMSans_400Regular',
    fontSize:   13,
  },
  liveUpcomingLabel: {
    color:       'rgba(255,255,255,0.45)',
    fontFamily:  'DMMono_400Regular',
    fontSize:    11,
    letterSpacing: 1,
    marginBottom: 4,
  },
  liveDoneTitle: {
    color:       '#34d399',
    fontFamily:  'Syne_700Bold',
    fontSize:    22,
    marginBottom: 4,
  },
  liveDoneSubtitle: {
    color:      'rgba(255,255,255,0.5)',
    fontFamily: 'DMSans_400Regular',
    fontSize:   14,
  },

  // ── Period list ──
  periodList: {
    paddingHorizontal: 16,
    marginTop:         20,
  },
  sectionLabel: {
    color:         Colors.textDim,
    fontFamily:    'DMMono_400Regular',
    fontSize:      11,
    letterSpacing: 1.2,
    marginBottom:  10,
  },

  // ── Period row ──
  periodRow: {
    flexDirection:   'row',
    alignItems:      'stretch',
    backgroundColor: Colors.bgCard,
    borderRadius:    14,
    marginBottom:    8,
    borderWidth:     1,
    borderColor:     Colors.border,
    overflow:        'hidden',
  },
  periodRowActive: {
    backgroundColor: 'rgba(16,185,129,0.1)',
    borderColor:     'rgba(52,211,153,0.35)',
  },
  periodRowPast: {
    opacity: 0.42,
  },
  periodAccentBar: {
    width:        3,
    borderRadius: 0,
    alignSelf:    'stretch',
  },
  periodDotWrapper: {
    width:           38,
    alignItems:      'center',
    justifyContent:  'center',
    paddingVertical: 14,
  },
  periodDotStatic: {
    width:        8,
    height:       8,
    borderRadius: 4,
    opacity:      0.7,
  },
  periodTextBlock: {
    flex:            1,
    paddingVertical: 12,
    paddingRight:    14,
  },
  periodNameRow: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           8,
    marginBottom:  4,
  },
  periodName: {
    color:      Colors.textPrimary,
    fontFamily: 'DMSans_500Medium',
    fontSize:   15,
  },
  periodNameActive: {
    fontFamily: 'DMSans_700Bold',
    color:      '#fff',
  },
  periodNamePast: {
    color: Colors.textDim,
  },
  nowPill: {
    backgroundColor: 'rgba(52,211,153,0.2)',
    borderRadius:    100,
    paddingHorizontal: 7,
    paddingVertical:   2,
    borderWidth:     1,
    borderColor:     'rgba(52,211,153,0.4)',
  },
  nowPillText: {
    color:       '#34d399',
    fontFamily:  'DMMono_400Regular',
    fontSize:    9,
    letterSpacing: 1,
  },
  periodTimeRow: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           5,
    marginTop:     4,
  },
  periodTimeText: {
    color:      'rgba(240,253,244,0.45)',
    fontFamily: 'DMMono_400Regular',
    fontSize:   11,
  },
  periodTimeSep: {
    width:           3,
    height:          3,
    borderRadius:    1.5,
    backgroundColor: 'rgba(240,253,244,0.2)',
    marginHorizontal: 2,
  },
  periodDuration: {
    color:      'rgba(240,253,244,0.35)',
    fontFamily: 'DMMono_400Regular',
    fontSize:   11,
  },

  // ── Badges ──
  badgeRow: {
    flexDirection: 'row',
    flexWrap:      'wrap',
    gap:           5,
    marginBottom:  4,
  },
  badge: {
    flexDirection:   'row',
    alignItems:      'center',
    gap:             4,
    paddingHorizontal: 7,
    paddingVertical:   3,
    borderRadius:    100,
    borderWidth:     1,
  },
  badgeText: {
    fontFamily: 'DMMono_400Regular',
    fontSize:   10,
  },

  // ── Day note ──
  dayNote: {
    flexDirection:   'row',
    alignItems:      'center',
    gap:             7,
    marginHorizontal: 16,
    marginTop:       8,
    paddingVertical:  10,
    paddingHorizontal: 14,
    backgroundColor: 'rgba(75,138,107,0.08)',
    borderRadius:    10,
    borderWidth:     1,
    borderColor:     'rgba(75,138,107,0.2)',
  },
  dayNoteText: {
    color:      Colors.textDim,
    fontFamily: 'DMSans_400Regular',
    fontSize:   13,
  },

  // ── Footer ──
  footer: {
    marginTop:       24,
    paddingHorizontal: 16,
  },
  footerDivider: {
    height:          1,
    backgroundColor: Colors.border,
    marginBottom:    14,
  },
  footerText: {
    color:       Colors.textDim,
    fontFamily:  'DMMono_400Regular',
    fontSize:    10,
    textAlign:   'center',
    letterSpacing: 0.5,
  },
  footerSub: {
    color:      Colors.textDim,
    fontFamily: 'DMSans_400Regular',
    fontSize:   11,
    textAlign:  'center',
    marginTop:  4,
    opacity:    0.7,
  },
});
