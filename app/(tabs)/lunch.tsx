// ============================================================
// Lunch Menu Screen
// Emerald High School Student Portal
// ============================================================

import React, { useState, useMemo } from 'react';
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
import { getTodayMenu, getWeekMenu, type DayMenu } from '@/data/lunch';

// ============================================================
// Types
// ============================================================

interface LunchItem {
  name: string;
  isVegetarian?: boolean;
  isVegan?: boolean;
}

// ============================================================
// Constants
// ============================================================

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] as const;
type ShortDay = (typeof DAYS)[number];

const DAY_INDEX_MAP: Record<ShortDay, number> = {
  Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5,
};

const ALWAYS_BREAKFAST: LunchItem[] = [
  { name: 'Fresh Fruit', isVegetarian: true, isVegan: true },
  { name: 'Assorted Cereals', isVegetarian: true },
  { name: 'Milk (1%, Non-fat, Chocolate)' },
  { name: 'Yogurt Cup', isVegetarian: true },
  { name: 'Toast', isVegetarian: true },
];

const ALWAYS_LUNCH: LunchItem[] = [
  { name: 'Garden Salad', isVegetarian: true, isVegan: true },
  { name: 'Fresh Fruit', isVegetarian: true, isVegan: true },
  { name: 'Assorted Milk' },
];

// ============================================================
// Helpers
// ============================================================

function getTodayShortDay(): ShortDay {
  const dow = new Date().getDay();
  if (dow >= 1 && dow <= 5) return DAYS[dow - 1];
  return 'Mon';
}

// ============================================================
// Sub-component: Vegetarian / Vegan leaf badge
// ============================================================
function LeafBadge({ isVegan }: { isVegan?: boolean }) {
  return (
    <View style={[
      styles.leafBadge,
      { backgroundColor: isVegan ? 'rgba(52,211,153,0.15)' : 'rgba(16,185,129,0.12)' },
    ]}>
      <Ionicons name="leaf" size={9} color={isVegan ? '#34d399' : '#10b981'} />
      <Text style={[styles.leafBadgeText, { color: isVegan ? '#34d399' : '#10b981' }]}>
        {isVegan ? 'Vegan' : 'Veg'}
      </Text>
    </View>
  );
}

// ============================================================
// Sub-component: Featured / special item card (gradient bg)
// ============================================================
function FeaturedCard({ item, index }: { item: LunchItem; index: number }) {
  const gradients: [string, string][] = [
    ['#064e3b', '#065f46'],
    ['#0c1a4a', '#1e3a8a'],
    ['#3b0764', '#581c87'],
    ['#431407', '#7c2d12'],
  ];
  const grad = gradients[index % gradients.length];

  return (
    <LinearGradient
      colors={grad}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.featuredCard}
    >
      <View style={styles.featuredCardInner}>
        <View style={{ flex: 1 }}>
          <Text style={styles.featuredCardName}>{item.name}</Text>
          <View style={{ flexDirection: 'row', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
            {(item.isVegetarian || item.isVegan) && (
              <LeafBadge isVegan={item.isVegan} />
            )}
          </View>
        </View>
        <View style={styles.featuredCardDot} />
      </View>
    </LinearGradient>
  );
}

// ============================================================
// Sub-component: Regular list item with check icon
// ============================================================
function ListItem({ item }: { item: LunchItem }) {
  return (
    <View style={styles.listItem}>
      <View style={styles.listItemCheck}>
        <Ionicons name="checkmark" size={12} color="#10b981" />
      </View>
      <Text style={styles.listItemText} numberOfLines={2}>{item.name}</Text>
      {(item.isVegetarian || item.isVegan) && (
        <LeafBadge isVegan={item.isVegan} />
      )}
    </View>
  );
}

// ============================================================
// Sub-component: Section heading
// ============================================================
function SectionHeading({ icon, title, color }: { icon: string; title: string; color: string }) {
  return (
    <View style={styles.sectionHeading}>
      <View style={[styles.sectionIcon, { backgroundColor: `${color}18` }]}>
        <Ionicons name={icon as any} size={14} color={color} />
      </View>
      <Text style={[styles.sectionTitle, { color }]}>{title}</Text>
    </View>
  );
}

// ============================================================
// Sub-component: Menu not available state
// ============================================================
function MenuUnavailable() {
  return (
    <View style={styles.unavailable}>
      <Ionicons name="restaurant-outline" size={40} color={Colors.textDim} style={{ marginBottom: 12 }} />
      <Text style={styles.unavailableTitle}>Menu Not Available</Text>
      <Text style={styles.unavailableText}>
        No menu data found for this day. Check back later or visit the cafeteria page on the DUSD website.
      </Text>
    </View>
  );
}

// ============================================================
// Sub-component: Day selector tabs
// ============================================================
interface DayTabsProps {
  selected: ShortDay;
  todayShort: ShortDay;
  onSelect: (d: ShortDay) => void;
}

function DayTabs({ selected, todayShort, onSelect }: DayTabsProps) {
  return (
    <View style={styles.tabRow}>
      {DAYS.map((day) => {
        const isSelected = day === selected;
        const isToday = day === todayShort;
        return (
          <Pressable
            key={day}
            onPress={() => onSelect(day)}
            style={({ pressed }) => [
              styles.tab,
              isSelected && styles.tabSelected,
              pressed && { opacity: 0.75 },
            ]}
          >
            <Text style={[
              styles.tabText,
              isSelected ? styles.tabTextSelected : styles.tabTextDim,
            ]}>
              {day}
            </Text>
            {isToday && (
              <View style={[
                styles.todayBadge,
                isSelected && styles.todayBadgeSelected,
              ]}>
                <Text style={[
                  styles.todayBadgeText,
                  isSelected && styles.todayBadgeTextSelected,
                ]}>
                  Today
                </Text>
              </View>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

// ============================================================
// Sub-component: Day menu content
// ============================================================
function DayMenuContent({ dayMenu }: { dayMenu: DayMenu | null }) {
  if (!dayMenu) return <MenuUnavailable />;

  return (
    <View>
      {/* ── Breakfast ── */}
      <View style={styles.mealSection}>
        <SectionHeading icon="sunny-outline" title="Breakfast" color="#f59e0b" />

        {/* Hot items as featured cards */}
        {dayMenu.breakfast.hot.length > 0 && (
          <>
            <Text style={styles.subSectionLabel}>TODAY'S HOT ITEMS</Text>
            <View style={styles.featuredGrid}>
              {dayMenu.breakfast.hot.map((item, i) => (
                <FeaturedCard key={item.name} item={item} index={i} />
              ))}
            </View>
          </>
        )}

        {/* Daily items as list */}
        {dayMenu.breakfast.daily.length > 0 && (
          <>
            <Text style={styles.subSectionLabel}>DAILY OPTIONS</Text>
            <View style={styles.listContainer}>
              {dayMenu.breakfast.daily.map((item) => (
                <ListItem key={item.name} item={item} />
              ))}
            </View>
          </>
        )}
      </View>

      {/* ── Lunch ── */}
      <View style={styles.mealSection}>
        <SectionHeading icon="restaurant-outline" title="Lunch" color="#10b981" />

        {/* Entrees as featured cards */}
        {dayMenu.lunch.entrees.length > 0 && (
          <>
            <Text style={styles.subSectionLabel}>TODAY'S ENTREES</Text>
            <View style={styles.featuredGrid}>
              {dayMenu.lunch.entrees.map((item, i) => (
                <FeaturedCard key={item.name} item={item} index={i} />
              ))}
            </View>
          </>
        )}

        {/* Daily lunch items as list */}
        {dayMenu.lunch.daily.length > 0 && (
          <>
            <Text style={styles.subSectionLabel}>DAILY OPTIONS</Text>
            <View style={styles.listContainer}>
              {dayMenu.lunch.daily.map((item) => (
                <ListItem key={item.name} item={item} />
              ))}
            </View>
          </>
        )}
      </View>
    </View>
  );
}

// ============================================================
// Sub-component: Always available section
// ============================================================
function AlwaysAvailableSection() {
  return (
    <View style={styles.alwaysSection}>
      <View style={styles.alwaysSectionHeader}>
        <Ionicons name="star" size={14} color="#34d399" />
        <Text style={styles.alwaysSectionTitle}>Always Available</Text>
      </View>

      <View style={styles.alwaysColumn}>
        <Text style={styles.alwaysSubLabel}>BREAKFAST</Text>
        {ALWAYS_BREAKFAST.map((item) => (
          <View key={item.name} style={styles.alwaysItem}>
            <View style={styles.alwaysDot} />
            <Text style={styles.alwaysItemText}>{item.name}</Text>
            {(item.isVegetarian || item.isVegan) && (
              <LeafBadge isVegan={item.isVegan} />
            )}
          </View>
        ))}
      </View>

      <View style={[styles.alwaysColumn, { marginTop: 14 }]}>
        <Text style={styles.alwaysSubLabel}>LUNCH</Text>
        {ALWAYS_LUNCH.map((item) => (
          <View key={item.name} style={styles.alwaysItem}>
            <View style={styles.alwaysDot} />
            <Text style={styles.alwaysItemText}>{item.name}</Text>
            {(item.isVegetarian || item.isVegan) && (
              <LeafBadge isVegan={item.isVegan} />
            )}
          </View>
        ))}
        {/* Peanut-free note */}
        <View style={styles.peanutNote}>
          <Ionicons name="information-circle-outline" size={12} color={Colors.textDim} />
          <Text style={styles.peanutNoteText}>
            Peanut-free campus (except coconut). Please check allergen info before eating.
          </Text>
        </View>
      </View>
    </View>
  );
}

// ============================================================
// Main Screen
// ============================================================
export default function LunchScreen() {
  const insets = useSafeAreaInsets();

  const todayShort = useMemo(getTodayShortDay, []);
  const [selectedDay, setSelectedDay] = useState<ShortDay>(todayShort);

  // Get the week menu — try current week first
  const weekMenu = useMemo(() => getWeekMenu(), []);

  // Find the DayMenu for the selected tab
  const selectedDayMenu = useMemo<DayMenu | null>(() => {
    if (!weekMenu) return null;
    const targetDow = DAY_INDEX_MAP[selectedDay];
    return weekMenu.days.find((d) => {
      const [y, m, day] = d.date.split('-').map(Number);
      const date = new Date(y, m - 1, day);
      return date.getDay() === targetDow;
    }) ?? null;
  }, [weekMenu, selectedDay]);

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
              <Text style={styles.headerTitle}>Lunch Menu</Text>
              <Text style={styles.headerSub}>
                {weekMenu ? `Week of ${weekMenu.weekStart}` : 'EHS Cafeteria'}
              </Text>
            </View>
            <View style={styles.headerIconWrap}>
              <Ionicons name="restaurant" size={22} color={Colors.emerald400} />
            </View>
          </View>

          {/* Free meal banner */}
          <View style={styles.freeBanner}>
            <Ionicons name="gift-outline" size={14} color="#34d399" />
            <Text style={styles.freeBannerText}>
              1 breakfast &amp; 1 lunch FREE daily for all students
            </Text>
          </View>

          {/* Day selector */}
          <DayTabs
            selected={selectedDay}
            todayShort={todayShort}
            onSelect={setSelectedDay}
          />
        </LinearGradient>

        {/* ── Day menu content ── */}
        <View style={styles.menuBody}>
          <DayMenuContent dayMenu={selectedDayMenu} />
        </View>

        {/* ── Always available ── */}
        <View style={styles.sectionWrapper}>
          <AlwaysAvailableSection />
        </View>

        {/* ── USDA note ── */}
        <View style={styles.usdaNote}>
          <Ionicons name="shield-checkmark-outline" size={13} color={Colors.textDim} />
          <Text style={styles.usdaNoteText}>
            All meals meet USDA nutrition guidelines. Meals must include a fruit or vegetable.
            In accordance with Federal civil rights law and USDA policy, USDA is an equal
            opportunity provider.
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
    marginBottom: 12,
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
  freeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: 'rgba(52,211,153,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(52,211,153,0.2)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
  },
  freeBannerText: {
    color: '#34d399',
    fontFamily: 'DMSans_500Medium',
    fontSize: 12,
    flex: 1,
  },

  // ── Day tabs ──
  tabRow: {
    flexDirection: 'row',
    gap: 6,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 4,
    minHeight: 54,
    justifyContent: 'center',
  },
  tabSelected: {
    backgroundColor: 'rgba(16,185,129,0.14)',
    borderColor: 'rgba(52,211,153,0.45)',
  },
  tabText: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 13,
  },
  tabTextSelected: {
    color: Colors.emerald400,
  },
  tabTextDim: {
    color: Colors.textDim,
  },
  todayBadge: {
    backgroundColor: 'rgba(75,138,107,0.2)',
    borderRadius: 100,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  todayBadgeSelected: {
    backgroundColor: 'rgba(52,211,153,0.2)',
  },
  todayBadgeText: {
    color: Colors.textDim,
    fontFamily: 'DMMono_400Regular',
    fontSize: 8,
    letterSpacing: 0.3,
  },
  todayBadgeTextSelected: {
    color: '#34d399',
  },

  // ── Menu body ──
  menuBody: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  sectionWrapper: {
    paddingHorizontal: 16,
    marginTop: 4,
  },

  // ── Meal section ──
  mealSection: {
    marginBottom: 24,
  },
  sectionHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontFamily: 'Syne_700Bold',
    fontSize: 18,
  },
  subSectionLabel: {
    color: Colors.textDim,
    fontFamily: 'DMMono_400Regular',
    fontSize: 10,
    letterSpacing: 1.2,
    marginBottom: 8,
  },

  // ── Featured cards ──
  featuredGrid: {
    gap: 8,
    marginBottom: 14,
  },
  featuredCard: {
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  featuredCardInner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  featuredCardName: {
    color: '#fff',
    fontFamily: 'DMSans_700Bold',
    fontSize: 15,
    flex: 1,
    lineHeight: 20,
  },
  featuredCardDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginTop: 4,
    marginLeft: 8,
  },

  // ── List items ──
  listContainer: {
    gap: 4,
    marginBottom: 8,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: Colors.bgCard,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  listItemCheck: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(16,185,129,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listItemText: {
    color: Colors.textPrimary,
    fontFamily: 'DMSans_400Regular',
    fontSize: 14,
    flex: 1,
  },

  // ── Leaf badge ──
  leafBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 100,
  },
  leafBadgeText: {
    fontFamily: 'DMMono_400Regular',
    fontSize: 9,
    letterSpacing: 0.3,
  },

  // ── Always available ──
  alwaysSection: {
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
  },
  alwaysSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginBottom: 14,
  },
  alwaysSectionTitle: {
    color: Colors.textPrimary,
    fontFamily: 'Syne_700Bold',
    fontSize: 16,
  },
  alwaysColumn: {},
  alwaysSubLabel: {
    color: Colors.textDim,
    fontFamily: 'DMMono_400Regular',
    fontSize: 10,
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  alwaysItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 5,
  },
  alwaysDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: Colors.textDim,
  },
  alwaysItemText: {
    color: 'rgba(240,253,244,0.75)',
    fontFamily: 'DMSans_400Regular',
    fontSize: 13,
    flex: 1,
  },
  peanutNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(75,138,107,0.08)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(75,138,107,0.18)',
  },
  peanutNoteText: {
    color: Colors.textDim,
    fontFamily: 'DMSans_400Regular',
    fontSize: 11,
    flex: 1,
    lineHeight: 16,
  },

  // ── Unavailable ──
  unavailable: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 32,
  },
  unavailableTitle: {
    color: Colors.textPrimary,
    fontFamily: 'Syne_700Bold',
    fontSize: 18,
    marginBottom: 8,
    textAlign: 'center',
  },
  unavailableText: {
    color: Colors.textDim,
    fontFamily: 'DMSans_400Regular',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
  },

  // ── USDA note ──
  usdaNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginHorizontal: 16,
    marginTop: 4,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: 'rgba(75,138,107,0.06)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(75,138,107,0.15)',
  },
  usdaNoteText: {
    color: Colors.textDim,
    fontFamily: 'DMSans_400Regular',
    fontSize: 11,
    flex: 1,
    lineHeight: 17,
  },
});
