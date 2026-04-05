// ============================================================
// Staff Directory Screen
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
  Image,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as ExpoLinking from 'expo-linking';
import { Colors } from '@/constants/colors';
import SearchBar from '@/components/SearchBar';
import Badge from '@/components/Badge';
import { staff, type StaffMember, type Department } from '@/data/staff';

// ============================================================
// Department color mapping
// ============================================================

type DeptColor = { fg: string; bg: string; border: string };

const DEPT_COLORS: Record<Department, DeptColor> = {
  Administration:    { fg: '#f59e0b', bg: 'rgba(245,158,11,0.12)',  border: 'rgba(245,158,11,0.3)'  },
  Math:              { fg: '#3b82f6', bg: 'rgba(59,130,246,0.12)',  border: 'rgba(59,130,246,0.3)'  },
  English:           { fg: '#a78bfa', bg: 'rgba(167,139,250,0.12)', border: 'rgba(167,139,250,0.3)' },
  Science:           { fg: '#34d399', bg: 'rgba(52,211,153,0.12)',  border: 'rgba(52,211,153,0.3)'  },
  'Social Science':  { fg: '#fb923c', bg: 'rgba(251,146,60,0.12)',  border: 'rgba(251,146,60,0.3)'  },
  PE:                { fg: '#22d3ee', bg: 'rgba(34,211,238,0.12)',  border: 'rgba(34,211,238,0.3)'  },
  Arts:              { fg: '#f472b6', bg: 'rgba(244,114,182,0.12)', border: 'rgba(244,114,182,0.3)' },
  'Computer Science':{ fg: '#60a5fa', bg: 'rgba(96,165,250,0.12)',  border: 'rgba(96,165,250,0.3)'  },
  'World Language':  { fg: '#4ade80', bg: 'rgba(74,222,128,0.12)',  border: 'rgba(74,222,128,0.3)'  },
  Health:            { fg: '#f87171', bg: 'rgba(248,113,113,0.12)', border: 'rgba(248,113,113,0.3)' },
  Culinary:          { fg: '#fdba74', bg: 'rgba(253,186,116,0.12)', border: 'rgba(253,186,116,0.3)' },
  Engineering:       { fg: '#6ee7b7', bg: 'rgba(110,231,183,0.12)', border: 'rgba(110,231,183,0.3)' },
  'Special Education':{ fg: '#c084fc', bg: 'rgba(192,132,252,0.12)', border: 'rgba(192,132,252,0.3)' },
  Wellness:          { fg: '#86efac', bg: 'rgba(134,239,172,0.12)', border: 'rgba(134,239,172,0.3)' },
  Counseling:        { fg: '#67e8f9', bg: 'rgba(103,232,249,0.12)', border: 'rgba(103,232,249,0.3)' },
  Support:           { fg: '#94a3b8', bg: 'rgba(148,163,184,0.12)', border: 'rgba(148,163,184,0.3)' },
  Athletics:         { fg: '#fbbf24', bg: 'rgba(251,191,36,0.12)',  border: 'rgba(251,191,36,0.3)'  },
  Office:            { fg: '#a3e635', bg: 'rgba(163,230,53,0.12)',  border: 'rgba(163,230,53,0.3)'  },
  ROP:               { fg: '#e879f9', bg: 'rgba(232,121,249,0.12)', border: 'rgba(232,121,249,0.3)' },
};

// Gradient pairs for the modal avatar (by first letter of dept color family)
const DEPT_GRADIENTS: Record<Department, readonly [string, string]> = {
  Administration:     ['#d97706', '#f59e0b'],
  Math:               ['#1d4ed8', '#3b82f6'],
  English:            ['#7c3aed', '#a78bfa'],
  Science:            ['#059669', '#34d399'],
  'Social Science':   ['#c2410c', '#fb923c'],
  PE:                 ['#0891b2', '#22d3ee'],
  Arts:               ['#be185d', '#f472b6'],
  'Computer Science': ['#1d4ed8', '#60a5fa'],
  'World Language':   ['#15803d', '#4ade80'],
  Health:             ['#dc2626', '#f87171'],
  Culinary:           ['#c2410c', '#fdba74'],
  Engineering:        ['#047857', '#6ee7b7'],
  'Special Education':['#7e22ce', '#c084fc'],
  Wellness:           ['#16a34a', '#86efac'],
  Counseling:         ['#0e7490', '#67e8f9'],
  Support:            ['#475569', '#94a3b8'],
  Athletics:          ['#b45309', '#fbbf24'],
  Office:             ['#4d7c0f', '#a3e635'],
  ROP:                ['#a21caf', '#e879f9'],
};

// Short display labels for filter chips
const DEPT_SHORT: Record<Department, string> = {
  Administration:     'Admin',
  Math:               'Math',
  English:            'English',
  Science:            'Science',
  'Social Science':   'Social Sci',
  PE:                 'PE',
  Arts:               'Arts',
  'Computer Science': 'CS',
  'World Language':   'World Lang',
  Health:             'Health',
  Culinary:           'Culinary',
  Engineering:        'Engineering',
  'Special Education':'Special Ed',
  Wellness:           'Wellness',
  Counseling:         'Counseling',
  Support:            'Support',
  Athletics:          'Athletics',
  Office:             'Office',
  ROP:                'ROP',
};

// Ordered list of all departments (for chips)
const ALL_DEPARTMENTS: Department[] = [
  'Administration',
  'Math',
  'English',
  'Science',
  'Social Science',
  'PE',
  'Arts',
  'Computer Science',
  'World Language',
  'Health',
  'Culinary',
  'Engineering',
  'Special Education',
  'Wellness',
  'Counseling',
  'Support',
  'Athletics',
  'Office',
  'ROP',
];

// ============================================================
// Helper: get initials from a name
// ============================================================

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

// ============================================================
// Sub-component: Avatar
// ============================================================

interface AvatarProps {
  member: StaffMember;
  size: number;
}

function Avatar({ member, size }: AvatarProps) {
  const [imgError, setImgError] = useState(false);
  const deptColor = DEPT_COLORS[member.department];
  const initials  = getInitials(member.name);
  const fontSize  = size * 0.36;
  const showPhoto = !!member.photoUrl && !imgError;

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: deptColor.bg,
        borderWidth: 2,
        borderColor: deptColor.border,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {showPhoto ? (
        <Image
          source={{ uri: member.photoUrl }}
          style={{ width: size, height: size }}
          onError={() => setImgError(true)}
          resizeMode="cover"
        />
      ) : (
        <Text
          style={{
            color: deptColor.fg,
            fontFamily: 'DMSans_700Bold',
            fontSize,
            letterSpacing: 0.5,
          }}
        >
          {initials}
        </Text>
      )}
    </View>
  );
}

// ============================================================
// Sub-component: Department filter chip
// ============================================================

interface DeptChipProps {
  label: string;
  active: boolean;
  onPress: () => void;
  color?: string;
}

function DeptChip({ label, active, onPress, color = Colors.emerald400 }: DeptChipProps) {
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
// Sub-component: Staff Card (list row)
// ============================================================

interface StaffCardProps {
  member: StaffMember;
  onPress: (member: StaffMember) => void;
}

function StaffCard({ member, onPress }: StaffCardProps) {
  const deptColor = DEPT_COLORS[member.department];

  return (
    <Pressable
      onPress={() => onPress(member)}
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.78 }]}
    >
      {/* Left accent bar */}
      <View style={[styles.cardAccent, { backgroundColor: deptColor.fg }]} />

      <View style={styles.cardInner}>
        {/* Avatar */}
        <Avatar member={member} size={50} />

        {/* Main info */}
        <View style={styles.cardBody}>
          {/* Name + dept badge row */}
          <View style={styles.cardNameRow}>
            <Text style={styles.cardName} numberOfLines={1}>
              {member.name}
            </Text>
            <Badge
              label={DEPT_SHORT[member.department]}
              color={deptColor.fg}
            />
          </View>

          {/* Title */}
          <Text style={styles.cardTitle} numberOfLines={1}>
            {member.title}
          </Text>

          {/* Room + availability */}
          <View style={styles.cardMetaRow}>
            {member.room ? (
              <View style={styles.cardMeta}>
                <Ionicons name="location-outline" size={11} color={Colors.textDim} />
                <Text style={styles.cardMetaText}>{member.room}</Text>
              </View>
            ) : null}
            {member.availability ? (
              <View style={styles.cardMeta}>
                <Ionicons name="time-outline" size={11} color={Colors.textDim} />
                <Text style={styles.cardMetaText} numberOfLines={1}>
                  {member.availability}
                </Text>
              </View>
            ) : null}
          </View>
        </View>

        {/* Chevron */}
        <Ionicons name="chevron-forward" size={16} color={Colors.textDim} style={{ marginLeft: 4 }} />
      </View>
    </Pressable>
  );
}

// ============================================================
// Sub-component: Bottom-sheet modal — full staff profile
// ============================================================

interface StaffModalProps {
  member: StaffMember | null;
  visible: boolean;
  onClose: () => void;
}

function StaffModal({ member, visible, onClose }: StaffModalProps) {
  const insets = useSafeAreaInsets();
  const slideAnim = useRef(new Animated.Value(400)).current;
  const bgAnim    = useRef(new Animated.Value(0)).current;

  // Slide up when visible, slide down when closing
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
          toValue: 400,
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

  if (!member) return null;

  const deptColor  = DEPT_COLORS[member.department];
  const gradColors = DEPT_GRADIENTS[member.department];
  const initials   = getInitials(member.name);

  const handleEmail = () => {
    ExpoLinking.openURL(`mailto:${member.email}`).catch(() => {});
  };

  const handlePhone = () => {
    if (!member.phone) return;
    ExpoLinking.openURL(`tel:${member.phone}`).catch(() => {});
  };

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
          {
            backgroundColor: 'rgba(0,0,0,0.72)',
            opacity: bgAnim,
          },
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
          contentContainerStyle={{ paddingBottom: 8 }}
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
            <Pressable
              onPress={onClose}
              style={styles.sheetClose}
              hitSlop={10}
            >
              <Ionicons name="close" size={18} color="rgba(255,255,255,0.8)" />
            </Pressable>

            {/* Large avatar */}
            <View style={styles.sheetAvatarWrap}>
              <SheetAvatar member={member} size={80} />
            </View>

            {/* Name & title */}
            <Text style={styles.sheetName}>{member.name}</Text>
            <Text style={styles.sheetTitle}>{member.title}</Text>

            {/* Dept badge */}
            <View style={{ marginTop: 8 }}>
              <Badge
                label={member.department}
                color={deptColor.fg}
                size="md"
              />
            </View>
          </LinearGradient>

          {/* Stats row */}
          <View style={styles.sheetStatsRow}>
            <View style={styles.sheetStat}>
              <Ionicons name="location" size={16} color={deptColor.fg} />
              <Text style={styles.sheetStatLabel}>Room</Text>
              <Text style={styles.sheetStatVal}>{member.room || '—'}</Text>
            </View>
            <View style={styles.sheetStatDivider} />
            <View style={styles.sheetStat}>
              <Ionicons name="time" size={16} color={deptColor.fg} />
              <Text style={styles.sheetStatLabel}>Availability</Text>
              <Text style={styles.sheetStatVal} numberOfLines={2}>
                {member.availability || 'See staff'}
              </Text>
            </View>
          </View>

          {/* Subjects */}
          {member.subjects.length > 0 && (
            <View style={styles.sheetSection}>
              <Text style={styles.sheetSectionLabel}>COURSES & SUBJECTS</Text>
              <View style={styles.sheetPillsRow}>
                {member.subjects.map((s) => (
                  <Badge key={s} label={s} color={deptColor.fg} size="md" />
                ))}
              </View>
            </View>
          )}

          {/* Bio */}
          {!!member.bio && (
            <View style={styles.sheetSection}>
              <Text style={styles.sheetSectionLabel}>ABOUT</Text>
              <Text style={styles.sheetBio}>{member.bio}</Text>
            </View>
          )}

          {/* Contact */}
          <View style={styles.sheetSection}>
            <Text style={styles.sheetSectionLabel}>CONTACT</Text>

            {/* Email row */}
            <Pressable
              onPress={handleEmail}
              style={({ pressed }) => [styles.sheetContactRow, pressed && { opacity: 0.7 }]}
            >
              <View style={[styles.sheetContactIcon, { backgroundColor: `${deptColor.fg}18` }]}>
                <Ionicons name="mail" size={16} color={deptColor.fg} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.sheetContactType}>Email</Text>
                <Text style={[styles.sheetContactValue, { color: deptColor.fg }]} numberOfLines={1}>
                  {member.email}
                </Text>
              </View>
              <Ionicons name="open-outline" size={14} color={Colors.textDim} />
            </Pressable>

            {/* Phone row */}
            {!!member.phone && (
              <Pressable
                onPress={handlePhone}
                style={({ pressed }) => [styles.sheetContactRow, pressed && { opacity: 0.7 }]}
              >
                <View style={[styles.sheetContactIcon, { backgroundColor: `${deptColor.fg}18` }]}>
                  <Ionicons name="call" size={16} color={deptColor.fg} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.sheetContactType}>Phone</Text>
                  <Text style={[styles.sheetContactValue, { color: deptColor.fg }]}>
                    {member.phone}
                  </Text>
                </View>
                <Ionicons name="open-outline" size={14} color={Colors.textDim} />
              </Pressable>
            )}
          </View>
        </ScrollView>

        {/* CTA */}
        <Pressable
          onPress={handleEmail}
          style={({ pressed }) => [
            styles.sheetCTA,
            { backgroundColor: deptColor.fg, opacity: pressed ? 0.82 : 1 },
          ]}
        >
          <Ionicons name="mail" size={17} color="#030f09" style={{ marginRight: 8 }} />
          <Text style={styles.sheetCTAText}>Send Email</Text>
        </Pressable>
      </Animated.View>
    </Modal>
  );
}

// Separate avatar for the modal that also tracks photo errors
function SheetAvatar({ member, size }: AvatarProps) {
  const [imgError, setImgError] = useState(false);
  const deptColor = DEPT_COLORS[member.department];
  const initials  = getInitials(member.name);
  const fontSize  = size * 0.36;
  const showPhoto = !!member.photoUrl && !imgError;

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderWidth: 3,
        borderColor: 'rgba(255,255,255,0.25)',
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {showPhoto ? (
        <Image
          source={{ uri: member.photoUrl }}
          style={{ width: size, height: size }}
          onError={() => setImgError(true)}
          resizeMode="cover"
        />
      ) : (
        <Text
          style={{
            color: '#fff',
            fontFamily: 'DMSans_700Bold',
            fontSize,
            letterSpacing: 0.5,
          }}
        >
          {initials}
        </Text>
      )}
    </View>
  );
}

// ============================================================
// Main screen
// ============================================================

export default function StaffScreen() {
  const insets  = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const [query,       setQuery]       = useState('');
  const [activeDept,  setActiveDept]  = useState<Department | null>(null);
  const [selected,    setSelected]    = useState<StaffMember | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // ── Filtered list ────────────────────────────────────────
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return staff.filter((m) => {
      // Dept filter
      if (activeDept && m.department !== activeDept) return false;

      // Text search
      if (q) {
        const haystack = [
          m.name,
          m.title,
          m.department,
          ...m.subjects,
          m.room,
          m.email,
        ]
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }

      return true;
    });
  }, [query, activeDept]);

  // ── Handlers ─────────────────────────────────────────────
  const openModal = useCallback((member: StaffMember) => {
    setSelected(member);
    setModalVisible(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalVisible(false);
  }, []);

  const toggleDept = useCallback((dept: Department) => {
    setActiveDept((prev) => (prev === dept ? null : dept));
  }, []);

  // ── Count label ──────────────────────────────────────────
  const countLabel = activeDept || query
    ? `${filtered.length} staff`
    : `All (${staff.length})`;

  // ── Render item ──────────────────────────────────────────
  const renderItem = useCallback(
    ({ item }: { item: StaffMember }) => (
      <StaffCard member={item} onPress={openModal} />
    ),
    [openModal]
  );

  const keyExtractor = useCallback((item: StaffMember) => item.id, []);

  // ── List header (search + chips + count) ─────────────────
  const ListHeader = (
    <View>
      {/* Header gradient */}
      <LinearGradient
        colors={['#022c22', Colors.bgPrimary]}
        style={[styles.header, { paddingTop: insets.top + 14 }]}
      >
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>Staff</Text>
            <Text style={styles.headerSub}>EMERALD HIGH SCHOOL FACULTY</Text>
          </View>
          <View style={styles.headerIconWrap}>
            <Ionicons name="people" size={22} color={Colors.emerald400} />
          </View>
        </View>

        {/* Search */}
        <SearchBar
          value={query}
          onChangeText={setQuery}
          placeholder="Search by name, subject, room…"
        />
      </LinearGradient>

      {/* Department filter chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsScroll}
        style={{ marginTop: 10 }}
      >
        {/* All chip */}
        <DeptChip
          label="All"
          active={activeDept === null}
          onPress={() => setActiveDept(null)}
          color={Colors.emerald500}
        />
        {ALL_DEPARTMENTS.map((dept) => (
          <DeptChip
            key={dept}
            label={DEPT_SHORT[dept]}
            active={activeDept === dept}
            onPress={() => toggleDept(dept)}
            color={DEPT_COLORS[dept].fg}
          />
        ))}
      </ScrollView>

      {/* Count badge */}
      <View style={styles.countRow}>
        <View style={styles.countBadge}>
          <Ionicons name="people-outline" size={12} color={Colors.textDim} />
          <Text style={styles.countText}>{countLabel}</Text>
        </View>
        {activeDept && (
          <Pressable
            onPress={() => setActiveDept(null)}
            style={styles.clearBtn}
            hitSlop={8}
          >
            <Ionicons name="close-circle" size={14} color={Colors.textDim} />
            <Text style={styles.clearText}>Clear filter</Text>
          </Pressable>
        )}
      </View>
    </View>
  );

  // ── Empty state ──────────────────────────────────────────
  const ListEmpty = (
    <View style={styles.emptyWrap}>
      <Ionicons name="search" size={36} color={Colors.textDim} />
      <Text style={styles.emptyTitle}>No staff found</Text>
      <Text style={styles.emptySubtitle}>
        Try a different name, subject, or department.
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={filtered}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={ListEmpty}
        contentContainerStyle={{ paddingBottom: insets.bottom + 24, paddingHorizontal: 14 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        initialNumToRender={18}
        maxToRenderPerBatch={20}
        windowSize={10}
        getItemLayout={(_, index) => ({
          length: CARD_HEIGHT,
          offset: CARD_HEIGHT * index,
          index,
        })}
      />

      {/* Staff profile modal */}
      <StaffModal
        member={selected}
        visible={modalVisible}
        onClose={closeModal}
      />
    </View>
  );
}

// ============================================================
// Constants for getItemLayout
// ============================================================

const CARD_HEIGHT = 82; // approx card height including margin

// ============================================================
// Styles
// ============================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
  },

  // ── Header ──
  header: {
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  headerTitle: {
    color: Colors.textPrimary,
    fontFamily: 'Syne_700Bold',
    fontSize: 26,
  },
  headerSub: {
    color: Colors.textDim,
    fontFamily: 'DMMono_400Regular',
    fontSize: 10,
    letterSpacing: 0.8,
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

  // ── Chips ──
  chipsScroll: {
    paddingHorizontal: 14,
    gap: 7,
    flexDirection: 'row',
  },
  chip: {
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 100,
    borderWidth: 1,
  },
  chipText: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 13,
  },

  // ── Count row ──
  countRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  countBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  countText: {
    color: Colors.textDim,
    fontFamily: 'DMMono_400Regular',
    fontSize: 12,
    letterSpacing: 0.5,
  },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  clearText: {
    color: Colors.textDim,
    fontFamily: 'DMSans_400Regular',
    fontSize: 12,
  },

  // ── Staff card ──
  card: {
    backgroundColor: Colors.bgCard,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 8,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  cardAccent: {
    width: 3,
    alignSelf: 'stretch',
    borderTopLeftRadius: 14,
    borderBottomLeftRadius: 14,
  },
  cardInner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    gap: 12,
  },
  cardBody: {
    flex: 1,
    gap: 2,
  },
  cardNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  cardName: {
    color: Colors.textPrimary,
    fontFamily: 'DMSans_700Bold',
    fontSize: 15,
    flex: 1,
  },
  cardTitle: {
    color: Colors.textDim,
    fontFamily: 'DMSans_400Regular',
    fontSize: 12,
  },
  cardMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 3,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    maxWidth: '55%',
  },
  cardMetaText: {
    color: Colors.textDim,
    fontFamily: 'DMMono_400Regular',
    fontSize: 10,
  },

  // ── Empty state ──
  emptyWrap: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 30,
    gap: 10,
  },
  emptyTitle: {
    color: Colors.textPrimary,
    fontFamily: 'DMSans_700Bold',
    fontSize: 17,
  },
  emptySubtitle: {
    color: Colors.textDim,
    fontFamily: 'DMSans_400Regular',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 21,
  },

  // ── Bottom sheet ──
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.bgCard,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    borderWidth: 1,
    borderColor: Colors.border,
    maxHeight: '90%',
    overflow: 'hidden',
  },
  sheetHandle: {
    alignSelf: 'center',
    width: 38,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
    marginTop: 10,
    marginBottom: 4,
  },

  // ── Sheet hero ──
  sheetHero: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 28,
    paddingHorizontal: 24,
    position: 'relative',
  },
  sheetClose: {
    position: 'absolute',
    top: 14,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetAvatarWrap: {
    marginBottom: 14,
  },
  sheetName: {
    color: '#fff',
    fontFamily: 'Syne_700Bold',
    fontSize: 22,
    textAlign: 'center',
  },
  sheetTitle: {
    color: 'rgba(255,255,255,0.65)',
    fontFamily: 'DMSans_400Regular',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 3,
  },

  // ── Sheet stats ──
  sheetStatsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.bgPrimary,
    marginHorizontal: 16,
    marginTop: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  sheetStat: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 10,
    gap: 4,
  },
  sheetStatDivider: {
    width: 1,
    backgroundColor: Colors.border,
    alignSelf: 'stretch',
  },
  sheetStatLabel: {
    color: Colors.textDim,
    fontFamily: 'DMMono_400Regular',
    fontSize: 10,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  sheetStatVal: {
    color: Colors.textPrimary,
    fontFamily: 'DMSans_500Medium',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },

  // ── Sheet sections ──
  sheetSection: {
    paddingHorizontal: 16,
    marginTop: 18,
  },
  sheetSectionLabel: {
    color: Colors.textDim,
    fontFamily: 'DMMono_400Regular',
    fontSize: 10,
    letterSpacing: 1.1,
    marginBottom: 10,
  },
  sheetPillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
  },
  sheetBio: {
    color: 'rgba(240,253,244,0.75)',
    fontFamily: 'DMSans_400Regular',
    fontSize: 14,
    lineHeight: 22,
  },

  // ── Sheet contact ──
  sheetContactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 11,
    paddingHorizontal: 14,
    backgroundColor: Colors.bgPrimary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 8,
  },
  sheetContactIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetContactType: {
    color: Colors.textDim,
    fontFamily: 'DMMono_400Regular',
    fontSize: 10,
    letterSpacing: 0.3,
  },
  sheetContactValue: {
    fontFamily: 'DMSans_500Medium',
    fontSize: 14,
    marginTop: 1,
  },

  // ── CTA ──
  sheetCTA: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginTop: 14,
    paddingVertical: 15,
    borderRadius: 14,
  },
  sheetCTAText: {
    color: '#030f09',
    fontFamily: 'DMSans_700Bold',
    fontSize: 16,
  },
});
