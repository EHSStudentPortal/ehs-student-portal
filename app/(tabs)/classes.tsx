// ============================================================
// Courses / Class Directory Screen
// Emerald High School Student Portal
// ============================================================

import React, { useState, useMemo, useRef, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  Pressable,
  Modal,
  Animated,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import SearchBar from '@/components/SearchBar';
import Badge from '@/components/Badge';
import { courses, type Course, type CourseCategory } from '@/data/courses';

// ============================================================
// Constants
// ============================================================

const STRESS_COLORS = ['', '#10b981', '#3b82f6', '#f59e0b', '#f97316', '#ef4444'] as const;
const STRESS_LABELS = ['', 'Very Easy', 'Light', 'Moderate', 'Challenging', 'Intense'] as const;

type CategoryColor = { fg: string; bg: string; border: string };

const CATEGORY_COLORS: Record<CourseCategory, CategoryColor> = {
  Math:              { fg: '#3b82f6', bg: 'rgba(59,130,246,0.12)',   border: 'rgba(59,130,246,0.3)'   },
  English:           { fg: '#a78bfa', bg: 'rgba(167,139,250,0.12)',  border: 'rgba(167,139,250,0.3)'  },
  Science:           { fg: '#34d399', bg: 'rgba(52,211,153,0.12)',   border: 'rgba(52,211,153,0.3)'   },
  History:           { fg: '#fb923c', bg: 'rgba(251,146,60,0.12)',   border: 'rgba(251,146,60,0.3)'   },
  PE:                { fg: '#22d3ee', bg: 'rgba(34,211,238,0.12)',   border: 'rgba(34,211,238,0.3)'   },
  Arts:              { fg: '#f472b6', bg: 'rgba(244,114,182,0.12)',  border: 'rgba(244,114,182,0.3)'  },
  Engineering:       { fg: '#6ee7b7', bg: 'rgba(110,231,183,0.12)', border: 'rgba(110,231,183,0.3)'  },
  'Computer Science':{ fg: '#60a5fa', bg: 'rgba(96,165,250,0.12)',   border: 'rgba(96,165,250,0.3)'   },
  Health:            { fg: '#f87171', bg: 'rgba(248,113,113,0.12)',  border: 'rgba(248,113,113,0.3)'  },
  Culinary:          { fg: '#fdba74', bg: 'rgba(253,186,116,0.12)',  border: 'rgba(253,186,116,0.3)'  },
  'World Language':  { fg: '#4ade80', bg: 'rgba(74,222,128,0.12)',   border: 'rgba(74,222,128,0.3)'   },
  'Performing Arts': { fg: '#e879f9', bg: 'rgba(232,121,249,0.12)',  border: 'rgba(232,121,249,0.3)'  },
  'Visual Arts':     { fg: '#f9a8d4', bg: 'rgba(249,168,212,0.12)',  border: 'rgba(249,168,212,0.3)'  },
  ROP:               { fg: '#fbbf24', bg: 'rgba(251,191,36,0.12)',   border: 'rgba(251,191,36,0.3)'   },
};

const CATEGORY_GRADIENTS: Record<CourseCategory, readonly [string, string]> = {
  Math:              ['#1d4ed8', '#3b82f6'],
  English:           ['#7c3aed', '#a78bfa'],
  Science:           ['#059669', '#34d399'],
  History:           ['#c2410c', '#fb923c'],
  PE:                ['#0891b2', '#22d3ee'],
  Arts:              ['#be185d', '#f472b6'],
  Engineering:       ['#047857', '#6ee7b7'],
  'Computer Science':['#1e40af', '#60a5fa'],
  Health:            ['#dc2626', '#f87171'],
  Culinary:          ['#b45309', '#fdba74'],
  'World Language':  ['#15803d', '#4ade80'],
  'Performing Arts': ['#a21caf', '#e879f9'],
  'Visual Arts':     ['#9d174d', '#f9a8d4'],
  ROP:               ['#92400e', '#fbbf24'],
};

const ALL_CATEGORIES: CourseCategory[] = [
  'Math',
  'English',
  'Science',
  'History',
  'PE',
  'Arts',
  'Engineering',
  'Computer Science',
  'Health',
  'Culinary',
  'World Language',
  'Performing Arts',
  'Visual Arts',
  'ROP',
];

// Short display labels for filter chips
const CATEGORY_SHORT: Record<CourseCategory, string> = {
  Math:              'Math',
  English:           'English',
  Science:           'Science',
  History:           'History',
  PE:                'PE',
  Arts:              'Arts',
  Engineering:       'Engineering',
  'Computer Science':'CS',
  Health:            'Health',
  Culinary:          'Culinary',
  'World Language':  'World Lang',
  'Performing Arts': 'Perf. Arts',
  'Visual Arts':     'Visual Arts',
  ROP:               'ROP',
};

// ============================================================
// Sub-component: Category filter chip
// ============================================================

interface CategoryChipProps {
  label: string;
  active: boolean;
  onPress: () => void;
  color?: string;
}

function CategoryChip({ label, active, onPress, color = Colors.emerald400 }: CategoryChipProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        active && { backgroundColor: `${color}22`, borderColor: `${color}55` },
        !active && { backgroundColor: Colors.bgCard, borderColor: Colors.border },
        pressed && { opacity: 0.7 },
      ]}
    >
      <Text
        style={[
          styles.chipText,
          { color: active ? color : Colors.textDim },
          active && { fontFamily: 'DMSans_700Bold' },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

// ============================================================
// Sub-component: Toggle pill (AP / Honors)
// ============================================================

interface TogglePillProps {
  label: string;
  active: boolean;
  onPress: () => void;
  color?: string;
}

function TogglePill({ label, active, onPress, color = Colors.emerald500 }: TogglePillProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.togglePill,
        active
          ? { backgroundColor: `${color}22`, borderColor: `${color}66` }
          : { backgroundColor: Colors.bgCard, borderColor: Colors.border },
        pressed && { opacity: 0.7 },
      ]}
    >
      {active && (
        <Ionicons name="checkmark-circle" size={13} color={color} style={{ marginRight: 4 }} />
      )}
      <Text
        style={[
          styles.togglePillText,
          { color: active ? color : Colors.textDim },
          active && { fontFamily: 'DMSans_700Bold' },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

// ============================================================
// Sub-component: Stress indicator row (dot segments + label)
// ============================================================

interface StressRowProps {
  value: number;
  size?: 'sm' | 'lg';
}

function StressRow({ value, size = 'sm' }: StressRowProps) {
  const color = STRESS_COLORS[value] ?? '#10b981';
  const label = STRESS_LABELS[value] ?? '';
  const segHeight = size === 'lg' ? 6 : 4;
  const gap = size === 'lg' ? 4 : 3;
  const width = size === 'lg' ? 120 : 80;

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      <View style={{ flexDirection: 'row', gap, width }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <View
            key={i}
            style={{
              height: segHeight,
              flex: 1,
              borderRadius: segHeight / 2,
              backgroundColor: i <= value ? color : 'rgba(255,255,255,0.1)',
            }}
          />
        ))}
      </View>
      <Text style={[styles.stressLabel, { color }]}>{label}</Text>
    </View>
  );
}

// ============================================================
// Sub-component: Course Card (list row)
// ============================================================

interface CourseCardProps {
  course: Course;
  onPress: (course: Course) => void;
}

function CourseCard({ course, onPress }: CourseCardProps) {
  const catColor = CATEGORY_COLORS[course.category];

  return (
    <Pressable
      onPress={() => onPress(course)}
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.78 }]}
    >
      {/* Left accent bar */}
      <View style={[styles.cardAccent, { backgroundColor: catColor.fg }]} />

      <View style={styles.cardInner}>
        {/* Name + badges row */}
        <View style={styles.cardTopRow}>
          <Text style={styles.cardName} numberOfLines={2}>
            {course.name}
          </Text>
          <View style={styles.cardBadgesCol}>
            <Badge label={CATEGORY_SHORT[course.category]} color={catColor.fg} />
            {course.isAP && (
              <Badge label="AP" color="#f59e0b" />
            )}
            {course.isHonors && !course.isAP && (
              <Badge label="HON" color="#a78bfa" />
            )}
          </View>
        </View>

        {/* Stress bar */}
        <View style={styles.cardStressRow}>
          <StressRow value={course.stressFactor} size="sm" />
        </View>

        {/* Meta row: credits + grade */}
        <View style={styles.cardMetaRow}>
          <View style={styles.cardMeta}>
            <Ionicons name="star-outline" size={11} color={Colors.textDim} />
            <Text style={styles.cardMetaText}>
              {course.credits} {course.credits === 1 ? 'credit' : 'credits'}
            </Text>
          </View>
          <View style={styles.cardMeta}>
            <Ionicons name="school-outline" size={11} color={Colors.textDim} />
            <Text style={styles.cardMetaText}>Grade {course.gradeLevel}</Text>
          </View>
        </View>
      </View>

      {/* Chevron */}
      <Ionicons
        name="chevron-forward"
        size={16}
        color={Colors.textDim}
        style={{ alignSelf: 'center', marginLeft: 4 }}
      />
    </Pressable>
  );
}

// ============================================================
// Sub-component: Course detail modal (slide-up sheet)
// ============================================================

interface CourseModalProps {
  course: Course | null;
  visible: boolean;
  onClose: () => void;
}

function CourseModal({ course, visible, onClose }: CourseModalProps) {
  const insets = useSafeAreaInsets();
  const slideAnim = useRef(new Animated.Value(600)).current;
  const bgAnim    = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          damping: 22,
          stiffness: 220,
        }),
        Animated.timing(bgAnim, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 600,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(bgAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, slideAnim, bgAnim]);

  if (!course) return null;

  const catColor   = CATEGORY_COLORS[course.category];
  const gradColors = CATEGORY_GRADIENTS[course.category];
  const stressColor = STRESS_COLORS[course.stressFactor] ?? '#10b981';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      {/* Scrim */}
      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          { backgroundColor: 'rgba(0,0,0,0.75)', opacity: bgAnim },
        ]}
      >
        <Pressable style={StyleSheet.absoluteFillObject} onPress={onClose} />
      </Animated.View>

      {/* Sheet */}
      <Animated.View
        style={[
          styles.sheet,
          {
            paddingBottom: insets.bottom + 16,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* Drag handle */}
        <View style={styles.sheetHandle} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 16 }}
          bounces={false}
        >
          {/* Hero gradient */}
          <LinearGradient
            colors={[gradColors[0], gradColors[1], Colors.bgCard]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.sheetHero}
          >
            {/* Close button */}
            <Pressable onPress={onClose} style={styles.sheetClose} hitSlop={10}>
              <Ionicons name="close" size={18} color="rgba(255,255,255,0.8)" />
            </Pressable>

            {/* Course name */}
            <Text style={styles.sheetCourseName}>{course.name}</Text>

            {/* Badges row */}
            <View style={styles.sheetBadgesRow}>
              <Badge label={course.category} color={catColor.fg} size="md" />
              {course.isAP && <Badge label="AP" color="#f59e0b" size="md" />}
              {course.isHonors && <Badge label="Honors" color="#a78bfa" size="md" />}
            </View>
          </LinearGradient>

          {/* Stats row */}
          <View style={styles.sheetStatsRow}>
            <View style={styles.sheetStat}>
              <Ionicons name="star" size={15} color={catColor.fg} />
              <Text style={styles.sheetStatLabel}>Credits</Text>
              <Text style={styles.sheetStatVal}>{course.credits}</Text>
            </View>
            <View style={styles.sheetStatDivider} />
            <View style={styles.sheetStat}>
              <Ionicons name="school" size={15} color={catColor.fg} />
              <Text style={styles.sheetStatLabel}>Grade Level</Text>
              <Text style={styles.sheetStatVal}>{course.gradeLevel}</Text>
            </View>
            <View style={styles.sheetStatDivider} />
            <View style={styles.sheetStat}>
              <Ionicons name="people" size={15} color={catColor.fg} />
              <Text style={styles.sheetStatLabel}>Teachers</Text>
              <Text style={styles.sheetStatVal}>
                {course.teacherIds.length > 0 ? course.teacherIds.length : '—'}
              </Text>
            </View>
          </View>

          {/* Stress section */}
          <View style={styles.sheetSection}>
            <Text style={styles.sheetSectionLabel}>WORKLOAD</Text>
            <View style={styles.sheetStressWrap}>
              <StressRow value={course.stressFactor} size="lg" />
              <Text style={[styles.sheetStressLevel, { color: stressColor }]}>
                Level {course.stressFactor} / 5
              </Text>
            </View>
          </View>

          {/* Description */}
          <View style={styles.sheetSection}>
            <Text style={styles.sheetSectionLabel}>ABOUT THIS COURSE</Text>
            <Text style={styles.sheetDescription}>{course.description}</Text>
          </View>

          {/* Prerequisites */}
          <View style={styles.sheetSection}>
            <Text style={styles.sheetSectionLabel}>PREREQUISITES</Text>
            {course.prerequisites ? (
              <View style={styles.sheetPrereqBox}>
                <Ionicons
                  name="git-branch-outline"
                  size={14}
                  color={catColor.fg}
                  style={{ marginTop: 1 }}
                />
                <Text style={styles.sheetPrereqText}>{course.prerequisites}</Text>
              </View>
            ) : (
              <View style={styles.sheetPrereqBox}>
                <Ionicons name="checkmark-circle-outline" size={14} color={Colors.emerald500} />
                <Text style={[styles.sheetPrereqText, { color: Colors.emerald500 }]}>
                  None — open to all qualifying students
                </Text>
              </View>
            )}
          </View>

          {/* Teacher IDs (shown only if present) */}
          {course.teacherIds.length > 0 && (
            <View style={styles.sheetSection}>
              <Text style={styles.sheetSectionLabel}>TEACHER INFO</Text>
              <View style={styles.sheetTeacherRow}>
                <View style={[styles.sheetContactIcon, { backgroundColor: `${catColor.fg}18` }]}>
                  <Ionicons name="person" size={15} color={catColor.fg} />
                </View>
                <Text style={styles.sheetTeacherText}>
                  {course.teacherIds.length === 1
                    ? '1 teacher assigned'
                    : `${course.teacherIds.length} teachers assigned`}
                </Text>
              </View>
            </View>
          )}
        </ScrollView>
      </Animated.View>
    </Modal>
  );
}

// ============================================================
// Main Screen
// ============================================================

export default function ClassesScreen() {
  const insets = useSafeAreaInsets();

  const [query, setQuery]               = useState('');
  const [activeCategory, setCategory]   = useState<CourseCategory | 'All'>('All');
  const [apOnly, setApOnly]             = useState(false);
  const [honorsOnly, setHonorsOnly]     = useState(false);
  const [selectedCourse, setSelected]   = useState<Course | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // ── Filtering ─────────────────────────────────────────────
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return courses.filter((c) => {
      if (activeCategory !== 'All' && c.category !== activeCategory) return false;
      if (apOnly && !c.isAP) return false;
      if (honorsOnly && !c.isHonors) return false;
      if (q) {
        const haystack = `${c.name} ${c.category} ${c.description}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [query, activeCategory, apOnly, honorsOnly]);

  // ── Handlers ──────────────────────────────────────────────
  const handleSelectCourse = useCallback((course: Course) => {
    setSelected(course);
    setModalVisible(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalVisible(false);
  }, []);

  const handleCategoryPress = useCallback((cat: CourseCategory | 'All') => {
    setCategory(cat);
  }, []);

  const handleApToggle = useCallback(() => {
    setApOnly((v) => !v);
    if (!apOnly) setHonorsOnly(false);
  }, [apOnly]);

  const handleHonorsToggle = useCallback(() => {
    setHonorsOnly((v) => !v);
    if (!honorsOnly) setApOnly(false);
  }, [honorsOnly]);

  const renderCourse = useCallback(
    ({ item }: { item: Course }) => (
      <CourseCard course={item} onPress={handleSelectCourse} />
    ),
    [handleSelectCourse]
  );

  const keyExtractor = useCallback((item: Course) => item.id, []);

  // ── Active category accent color ──────────────────────────
  const accentColor =
    activeCategory === 'All'
      ? Colors.emerald400
      : CATEGORY_COLORS[activeCategory].fg;

  // ── List header (search + filters) ────────────────────────
  const ListHeader = (
    <View style={styles.listHeader}>
      {/* Search */}
      <View style={styles.searchWrap}>
        <SearchBar
          value={query}
          onChangeText={setQuery}
          placeholder="Search courses..."
        />
      </View>

      {/* Category chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsContent}
        style={styles.chipsScroll}
      >
        <CategoryChip
          label="All"
          active={activeCategory === 'All'}
          onPress={() => handleCategoryPress('All')}
          color={Colors.emerald400}
        />
        {ALL_CATEGORIES.map((cat) => (
          <CategoryChip
            key={cat}
            label={CATEGORY_SHORT[cat]}
            active={activeCategory === cat}
            onPress={() => handleCategoryPress(cat)}
            color={CATEGORY_COLORS[cat].fg}
          />
        ))}
      </ScrollView>

      {/* Toggle filters row */}
      <View style={styles.toggleRow}>
        <TogglePill
          label="AP Only"
          active={apOnly}
          onPress={handleApToggle}
          color="#f59e0b"
        />
        <TogglePill
          label="Honors Only"
          active={honorsOnly}
          onPress={handleHonorsToggle}
          color="#a78bfa"
        />
        <View style={styles.countBadge}>
          <Text style={styles.countText}>
            {filtered.length} {filtered.length === 1 ? 'course' : 'courses'}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={[styles.root, { backgroundColor: Colors.bgPrimary }]}>
      {/* Screen header */}
      <LinearGradient
        colors={['#042b18', Colors.bgPrimary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[styles.header, { paddingTop: insets.top + 8 }]}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>Courses</Text>
            <Text style={styles.headerSub}>Class Directory</Text>
          </View>
          <View style={styles.headerIconWrap}>
            <Ionicons name="book" size={22} color={Colors.emerald400} />
          </View>
        </View>
      </LinearGradient>

      {/* Course list */}
      <FlatList
        data={filtered}
        renderItem={renderCourse}
        keyExtractor={keyExtractor}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Ionicons name="search-outline" size={40} color={Colors.textDim} />
            <Text style={styles.emptyTitle}>No courses found</Text>
            <Text style={styles.emptyBody}>
              Try adjusting your search or filters
            </Text>
          </View>
        }
      />

      {/* Detail modal */}
      <CourseModal
        course={selectedCourse}
        visible={modalVisible}
        onClose={handleCloseModal}
      />
    </View>
  );
}

// ============================================================
// Styles
// ============================================================

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },

  // ── Header ──────────────────────────────────────────────
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontFamily: 'Syne_700Bold',
    fontSize: 26,
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  headerSub: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 13,
    color: Colors.textDim,
    marginTop: 1,
  },
  headerIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: `${Colors.emerald500}18`,
    borderWidth: 1,
    borderColor: `${Colors.emerald500}30`,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── List header section ──────────────────────────────────
  listHeader: {
    paddingTop: 16,
    paddingBottom: 4,
  },
  searchWrap: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },

  // ── Category chips ───────────────────────────────────────
  chipsScroll: {
    marginBottom: 10,
  },
  chipsContent: {
    paddingHorizontal: 16,
    gap: 8,
    flexDirection: 'row',
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 100,
    borderWidth: 1,
  },
  chipText: {
    fontFamily: 'DMSans_500Medium',
    fontSize: 13,
  },

  // ── Toggle pills row ─────────────────────────────────────
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 12,
  },
  togglePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
    borderWidth: 1,
  },
  togglePillText: {
    fontFamily: 'DMSans_500Medium',
    fontSize: 13,
  },
  countBadge: {
    marginLeft: 'auto',
    backgroundColor: `${Colors.emerald500}18`,
    borderColor: `${Colors.emerald500}30`,
    borderWidth: 1,
    borderRadius: 100,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  countText: {
    fontFamily: 'DMMono_400Regular',
    fontSize: 11,
    color: Colors.emerald400,
    letterSpacing: 0.3,
  },

  // ── List content ─────────────────────────────────────────
  listContent: {
    paddingHorizontal: 16,
  },

  // ── Course card ──────────────────────────────────────────
  card: {
    backgroundColor: Colors.bgCard,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 10,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  cardAccent: {
    width: 4,
    borderTopLeftRadius: 14,
    borderBottomLeftRadius: 14,
  },
  cardInner: {
    flex: 1,
    paddingHorizontal: 13,
    paddingVertical: 13,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 9,
  },
  cardName: {
    flex: 1,
    fontFamily: 'DMSans_700Bold',
    fontSize: 15,
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  cardBadgesCol: {
    alignItems: 'flex-end',
    gap: 4,
    flexShrink: 0,
  },
  cardStressRow: {
    marginBottom: 9,
  },
  cardMetaRow: {
    flexDirection: 'row',
    gap: 14,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cardMetaText: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 11,
    color: Colors.textDim,
  },

  // ── Stress label ─────────────────────────────────────────
  stressLabel: {
    fontFamily: 'DMMono_400Regular',
    fontSize: 10,
    letterSpacing: 0.2,
  },

  // ── Empty state ──────────────────────────────────────────
  emptyWrap: {
    alignItems: 'center',
    paddingTop: 64,
    gap: 12,
  },
  emptyTitle: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 17,
    color: Colors.textPrimary,
  },
  emptyBody: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 14,
    color: Colors.textDim,
    textAlign: 'center',
    paddingHorizontal: 40,
  },

  // ── Modal sheet ──────────────────────────────────────────
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.bgCard,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    borderColor: Colors.border,
    maxHeight: '92%',
    overflow: 'hidden',
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 4,
  },

  // Hero banner
  sheetHero: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
    position: 'relative',
  },
  sheetClose: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetCourseName: {
    fontFamily: 'Syne_700Bold',
    fontSize: 20,
    color: Colors.textPrimary,
    lineHeight: 26,
    marginBottom: 12,
    paddingRight: 36,
  },
  sheetBadgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  // Stats row
  sheetStatsRow: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 16,
    backgroundColor: Colors.bgPrimary,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: 14,
    paddingHorizontal: 8,
  },
  sheetStat: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  sheetStatDivider: {
    width: 1,
    backgroundColor: Colors.border,
    alignSelf: 'stretch',
    marginVertical: 2,
  },
  sheetStatLabel: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 11,
    color: Colors.textDim,
    textAlign: 'center',
  },
  sheetStatVal: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 15,
    color: Colors.textPrimary,
    textAlign: 'center',
  },

  // Sections
  sheetSection: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  sheetSectionLabel: {
    fontFamily: 'DMMono_400Regular',
    fontSize: 10,
    color: Colors.textDim,
    letterSpacing: 1.2,
    marginBottom: 10,
  },

  // Stress in modal
  sheetStressWrap: {
    backgroundColor: Colors.bgPrimary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
    gap: 10,
  },
  sheetStressLevel: {
    fontFamily: 'DMMono_400Regular',
    fontSize: 11,
    letterSpacing: 0.5,
  },

  // Description
  sheetDescription: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22,
  },

  // Prerequisites
  sheetPrereqBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: Colors.bgPrimary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 12,
  },
  sheetPrereqText: {
    flex: 1,
    fontFamily: 'DMSans_400Regular',
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 20,
  },

  // Teacher row
  sheetTeacherRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.bgPrimary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 12,
  },
  sheetContactIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetTeacherText: {
    fontFamily: 'DMSans_500Medium',
    fontSize: 14,
    color: Colors.textPrimary,
  },
});
