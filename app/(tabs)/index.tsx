import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, ScrollView, Pressable, Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import LiveDot from '@/components/LiveDot';
import { getTodaySchedule, getCurrentPeriod, formatTime, type DaySchedule } from '@/data/schedule';

type TabRoute = '/(tabs)/schedule' | '/(tabs)/staff' | '/(tabs)/classes' | '/(tabs)/map' | '/(tabs)/lunch' | '/(tabs)/calendar' | '/(tabs)/voice' | '/(tabs)/resources';

interface QuickLink {
  title: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  route: TabRoute;
  color: string;
  desc: string;
}

const QUICK_LINKS: QuickLink[] = [
  { title: 'Bell Schedule', icon: 'time',       route: '/(tabs)/schedule',  color: '#10b981', desc: 'Live countdown' },
  { title: 'Campus Map',    icon: 'map',         route: '/(tabs)/map',       color: '#f59e0b', desc: 'Find rooms' },
  { title: 'Staff',         icon: 'people',      route: '/(tabs)/staff',     color: '#3b82f6', desc: '100+ faculty' },
  { title: 'Courses',       icon: 'book',        route: '/(tabs)/classes',   color: '#8b5cf6', desc: '150+ offered' },
  { title: 'Lunch',         icon: 'restaurant',  route: '/(tabs)/lunch',     color: '#f97316', desc: "Today's menu" },
  { title: 'Calendar',      icon: 'calendar',    route: '/(tabs)/calendar',  color: '#06b6d4', desc: 'Events & dates' },
  { title: 'SchoolVoice',   icon: 'chatbubble',  route: '/(tabs)/voice',     color: '#ec4899', desc: 'Anonymous' },
  { title: 'Resources',     icon: 'grid',        route: '/(tabs)/resources', color: '#a78bfa', desc: 'Links & tools' },
];

function LivePeriodCard({ schedule }: { schedule: DaySchedule }) {
  const [now, setNow] = useState(new Date());
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const info = getCurrentPeriod(schedule);
  const { period, nextPeriod, minutesRemaining, progress } = info;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress / 100,
      duration: 600,
      useNativeDriver: false,
    }).start();
  }, [progress, progressAnim]);

  const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  const dayName = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  const formatMins = (m: number) => {
    const h = Math.floor(m / 60);
    const min = Math.floor(m % 60);
    if (h > 0) return `${h}h ${min}m`;
    return `${Math.floor(m)}m`;
  };

  return (
    <LinearGradient
      colors={['#047857', '#065f46']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ borderRadius: 20, padding: 20, marginHorizontal: 16, marginBottom: 4 }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <View>
          <Text style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'DMMono_400Regular', fontSize: 11 }}>
            {dayName}
          </Text>
          <Text style={{ color: '#fff', fontFamily: 'Syne_700Bold', fontSize: 28, marginTop: 2 }}>
            {timeStr}
          </Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'DMMono_400Regular', fontSize: 10, letterSpacing: 1 }}>
            {schedule.label.toUpperCase()}
          </Text>
        </View>
      </View>

      {period ? (
        <>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <LiveDot color="#34d399" size={8} />
            <Text style={{ color: '#6ee7b7', fontFamily: 'DMMono_400Regular', fontSize: 11, letterSpacing: 1 }}>
              NOW IN PROGRESS
            </Text>
          </View>
          <Text style={{ color: '#fff', fontFamily: 'Syne_700Bold', fontSize: 24, marginBottom: 2 }}>
            {period.name}
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.55)', fontFamily: 'DMMono_400Regular', fontSize: 13, marginBottom: 14 }}>
            {formatTime(period.startTime)} – {formatTime(period.endTime)}
          </Text>

          {/* Progress bar */}
          <View style={{ marginBottom: 10 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
              <Text style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'DMMono_400Regular', fontSize: 11 }}>
                {formatTime(period.startTime)}
              </Text>
              <Text style={{ color: '#34d399', fontFamily: 'DMMono_400Regular', fontSize: 11, fontWeight: '600' }}>
                {formatMins(minutesRemaining)} left
              </Text>
              <Text style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'DMMono_400Regular', fontSize: 11 }}>
                {formatTime(period.endTime)}
              </Text>
            </View>
            <View style={{ height: 6, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 3, overflow: 'hidden' }}>
              <Animated.View
                style={{
                  height: '100%',
                  borderRadius: 3,
                  width: progressAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
                  backgroundColor: '#34d399',
                }}
              />
            </View>
          </View>

          {nextPeriod && (
            <Text style={{ color: 'rgba(255,255,255,0.45)', fontFamily: 'DMSans_400Regular', fontSize: 13 }}>
              Next: {nextPeriod.name} at {formatTime(nextPeriod.startTime)}
            </Text>
          )}
        </>
      ) : nextPeriod ? (
        <>
          <Text style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'DMMono_400Regular', fontSize: 11, marginBottom: 4 }}>
            NEXT PERIOD
          </Text>
          <Text style={{ color: '#fff', fontFamily: 'Syne_700Bold', fontSize: 22 }}>
            {nextPeriod.name}
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.55)', fontFamily: 'DMMono_400Regular', fontSize: 13 }}>
            Starts at {formatTime(nextPeriod.startTime)}
          </Text>
        </>
      ) : (
        <>
          <Text style={{ color: '#34d399', fontFamily: 'Syne_700Bold', fontSize: 20, marginBottom: 4 }}>
            School day complete
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'DMSans_400Regular', fontSize: 14 }}>
            See you next time, Shamrock! 🌿
          </Text>
        </>
      )}
    </LinearGradient>
  );
}

function ScheduleMiniList({ schedule }: { schedule: DaySchedule }) {
  const now = new Date();
  const currentMins = now.getHours() * 60 + now.getMinutes();

  const classPeriods = schedule.periods.filter(p =>
    p.type === 'class' || p.type === 'lunch' || p.type === 'access' || p.type === 'break'
  );

  return (
    <View style={{ paddingHorizontal: 16, marginBottom: 8 }}>
      <Text style={{ color: Colors.textDim, fontFamily: 'DMMono_400Regular', fontSize: 11, letterSpacing: 1, marginBottom: 10 }}>
        TODAY'S PERIODS
      </Text>
      {classPeriods.map((p) => {
        const startMins = parseInt(p.startTime.split(':')[0]) * 60 + parseInt(p.startTime.split(':')[1]);
        const endMins = parseInt(p.endTime.split(':')[0]) * 60 + parseInt(p.endTime.split(':')[1]);
        const isActive = currentMins >= startMins && currentMins < endMins;
        const isPast = currentMins >= endMins;

        let dotColor = '#3b82f6';
        if (p.type === 'lunch') dotColor = '#f97316';
        else if (p.type === 'access') dotColor = '#8b5cf6';
        else if (p.type === 'break') dotColor = '#f59e0b';

        return (
          <View
            key={p.id}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 9,
              paddingHorizontal: 14,
              borderRadius: 12,
              marginBottom: 4,
              backgroundColor: isActive ? 'rgba(16,185,129,0.12)' : 'rgba(255,255,255,0.03)',
              borderWidth: 1,
              borderColor: isActive ? 'rgba(52,211,153,0.3)' : 'rgba(255,255,255,0.06)',
              opacity: isPast && !isActive ? 0.4 : 1,
            }}
          >
            {isActive ? (
              <LiveDot color="#10b981" size={8} />
            ) : (
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: dotColor, opacity: isPast ? 0.5 : 0.7 }} />
            )}
            <Text style={{ flex: 1, marginLeft: 10, color: Colors.textPrimary, fontFamily: isActive ? 'DMSans_700Bold' : 'DMSans_400Regular', fontSize: 14 }}>
              {p.name}
              {p.optional ? ' (optional)' : ''}
            </Text>
            <Text style={{ color: Colors.textDim, fontFamily: 'DMMono_400Regular', fontSize: 12 }}>
              {formatTime(p.startTime)}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [schedule] = useState<DaySchedule>(() => getTodaySchedule());
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
  }, [fadeAnim]);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bgPrimary }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <LinearGradient
          colors={['#022c22', '#030f09']}
          style={{ paddingTop: insets.top + 16, paddingBottom: 20, paddingHorizontal: 16, marginBottom: 4 }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <LinearGradient
                colors={['#10b981', '#3b82f6']}
                style={{ width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}
              >
                <Text style={{ color: '#fff', fontFamily: 'Syne_700Bold', fontSize: 13 }}>EHS</Text>
              </LinearGradient>
              <View>
                <Text style={{ color: Colors.textPrimary, fontFamily: 'Syne_700Bold', fontSize: 16 }}>
                  Emerald High School
                </Text>
                <Text style={{ color: Colors.textDim, fontFamily: 'DMMono_400Regular', fontSize: 10, letterSpacing: 1 }}>
                  STUDENT PORTAL • 2025–26
                </Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(16,185,129,0.1)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 100, borderWidth: 1, borderColor: 'rgba(16,185,129,0.2)' }}>
              <LiveDot color="#10b981" size={6} />
              <Text style={{ color: Colors.emerald400, fontFamily: 'DMMono_400Regular', fontSize: 10 }}>LIVE</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Live period card */}
        <Animated.View style={{ opacity: fadeAnim }}>
          <LivePeriodCard schedule={schedule} />
        </Animated.View>

        {/* Schedule mini list */}
        <View style={{ marginTop: 20 }}>
          <ScheduleMiniList schedule={schedule} />
        </View>

        {/* Quick links grid */}
        <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
          <Text style={{ color: Colors.textDim, fontFamily: 'DMMono_400Regular', fontSize: 11, letterSpacing: 1, marginBottom: 12 }}>
            QUICK ACCESS
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            {QUICK_LINKS.map((link) => (
              <Pressable
                key={link.route}
                onPress={() => router.push(link.route as any)}
                style={({ pressed }) => ({
                  width: '47%',
                  backgroundColor: Colors.bgCard,
                  borderRadius: 16,
                  padding: 16,
                  borderWidth: 1,
                  borderColor: Colors.border,
                  opacity: pressed ? 0.8 : 1,
                })}
              >
                <View style={{ width: 38, height: 38, borderRadius: 10, backgroundColor: `${link.color}18`, alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                  <Ionicons name={link.icon as any} size={20} color={link.color} />
                </View>
                <Text style={{ color: Colors.textPrimary, fontFamily: 'DMSans_700Bold', fontSize: 14, marginBottom: 2 }}>
                  {link.title}
                </Text>
                <Text style={{ color: Colors.textDim, fontFamily: 'DMSans_400Regular', fontSize: 12 }}>
                  {link.desc}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Footer info */}
        <View style={{ marginTop: 28, paddingHorizontal: 16 }}>
          <View style={{ borderTopWidth: 1, borderTopColor: Colors.border, paddingTop: 16 }}>
            <Text style={{ color: Colors.textDim, fontFamily: 'DMMono_400Regular', fontSize: 10, textAlign: 'center', letterSpacing: 0.5 }}>
              EMERALD HIGH SCHOOL • 3600 CENTRAL PKWY, DUBLIN CA 94568
            </Text>
            <Text style={{ color: Colors.textDim, fontFamily: 'DMSans_400Regular', fontSize: 11, textAlign: 'center', marginTop: 4 }}>
              Unofficial student-created app. Not affiliated with DUSD.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
