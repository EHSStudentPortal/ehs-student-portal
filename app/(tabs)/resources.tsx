// ============================================================
// Resources Hub Screen
// Emerald High School Student Portal
// ============================================================

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';

// ============================================================
// Types & Data
// ============================================================

interface Resource {
  title: string;
  description: string;
  url: string;
  domain: string;
  icon: string; // Ionicons name
  color: string;
}

interface ResourceSection {
  title: string;
  icon: string;
  color: string;
  items: Resource[];
}

interface Deadline {
  title: string;
  date: string;
  color: string;
  icon: string;
  note?: string;
}

const RESOURCE_SECTIONS: ResourceSection[] = [
  {
    title: 'Grades & School',
    icon: 'school-outline',
    color: '#10b981',
    items: [
      {
        title: 'Aeries Student Portal',
        description: 'View grades, attendance, transcripts, and more',
        url: 'https://portal.dublinusd.org/student',
        domain: 'portal.dublinusd.org',
        icon: 'bar-chart-outline',
        color: '#10b981',
      },
      {
        title: 'Canvas LMS',
        description: 'Course assignments, announcements, and resources',
        url: 'https://dublinusd.instructure.com',
        domain: 'dublinusd.instructure.com',
        icon: 'layers-outline',
        color: '#e13f29',
      },
      {
        title: 'Google Classroom',
        description: 'Class materials, assignments, and teacher communication',
        url: 'https://classroom.google.com',
        domain: 'classroom.google.com',
        icon: 'book-outline',
        color: '#4285f4',
      },
      {
        title: 'Dublin USD Homepage',
        description: 'District news, calendars, and official announcements',
        url: 'https://www.dublinusd.org',
        domain: 'dublinusd.org',
        icon: 'globe-outline',
        color: '#059669',
      },
    ],
  },
  {
    title: 'College Applications',
    icon: 'ribbon-outline',
    color: '#8b5cf6',
    items: [
      {
        title: 'Common App',
        description: 'Apply to 900+ colleges with one application',
        url: 'https://www.commonapp.org',
        domain: 'commonapp.org',
        icon: 'document-outline',
        color: '#3b82f6',
      },
      {
        title: 'UC Application',
        description: 'Apply to all 9 undergraduate UC campuses',
        url: 'https://apply.universityofcalifornia.edu',
        domain: 'universityofcalifornia.edu',
        icon: 'school-outline',
        color: '#1d4ed8',
      },
      {
        title: 'CSU Apply',
        description: 'Apply to all 23 California State University campuses',
        url: 'https://www2.calstate.edu/apply',
        domain: 'calstate.edu',
        icon: 'medal-outline',
        color: '#dc2626',
      },
      {
        title: 'Coalition App',
        description: 'Alternative to Common App — accepted at 150+ schools',
        url: 'https://www.coalitionforcollegeaccess.org',
        domain: 'coalitionforcollegeaccess.org',
        icon: 'people-outline',
        color: '#7c3aed',
      },
    ],
  },
  {
    title: 'Test Prep',
    icon: 'pencil-outline',
    color: '#f59e0b',
    items: [
      {
        title: 'Khan Academy SAT Prep',
        description: 'Free, official SAT practice with College Board',
        url: 'https://www.khanacademy.org/sat',
        domain: 'khanacademy.org',
        icon: 'bulb-outline',
        color: '#14b8a6',
      },
      {
        title: 'College Board',
        description: 'SAT, AP, and PSAT registration and score reports',
        url: 'https://www.collegeboard.org',
        domain: 'collegeboard.org',
        icon: 'trophy-outline',
        color: '#1d4ed8',
      },
      {
        title: 'ACT Student',
        description: 'ACT registration, test prep, and score access',
        url: 'https://www.act.org/content/act/en/products-and-services/the-act/registration.html',
        domain: 'act.org',
        icon: 'checkmark-circle-outline',
        color: '#dc2626',
      },
      {
        title: 'Naviance',
        description: 'College & career planning, scholarship search',
        url: 'https://student.naviance.com',
        domain: 'naviance.com',
        icon: 'navigate-outline',
        color: '#059669',
      },
    ],
  },
  {
    title: 'Academic Tools',
    icon: 'calculator-outline',
    color: '#06b6d4',
    items: [
      {
        title: 'Desmos Calculator',
        description: 'Free graphing & scientific calculator for math',
        url: 'https://www.desmos.com',
        domain: 'desmos.com',
        icon: 'stats-chart-outline',
        color: '#7c3aed',
      },
      {
        title: 'WolframAlpha',
        description: 'Computational answers for math, science, and more',
        url: 'https://www.wolframalpha.com',
        domain: 'wolframalpha.com',
        icon: 'analytics-outline',
        color: '#dc2626',
      },
      {
        title: 'Quizlet',
        description: 'Flashcards, practice tests, and study sets',
        url: 'https://quizlet.com',
        domain: 'quizlet.com',
        icon: 'clipboard-outline',
        color: '#3b82f6',
      },
      {
        title: 'Google Scholar',
        description: 'Search scholarly articles and research papers',
        url: 'https://scholar.google.com',
        domain: 'scholar.google.com',
        icon: 'search-outline',
        color: '#4285f4',
      },
    ],
  },
  {
    title: 'Mental Health & Support',
    icon: 'heart-outline',
    color: '#ec4899',
    items: [
      {
        title: 'Crisis Text Line',
        description: 'Text HOME to 741741 — free, 24/7 crisis support',
        url: 'https://www.crisistextline.org',
        domain: 'crisistextline.org',
        icon: 'chatbubble-ellipses-outline',
        color: '#ec4899',
      },
      {
        title: 'Teen Line',
        description: 'Talk to a teen counselor: 1-800-852-8336',
        url: 'https://www.teenline.org',
        domain: 'teenline.org',
        icon: 'call-outline',
        color: '#f97316',
      },
      {
        title: 'School Counseling',
        description: 'EHS counselors — schedule an appointment today',
        url: 'https://ehs.dublinusd.org/apps/pages/counseling',
        domain: 'ehs.dublinusd.org',
        icon: 'people-circle-outline',
        color: '#10b981',
      },
      {
        title: 'DUSD Wellness',
        description: 'District mental health resources and support programs',
        url: 'https://www.dublinusd.org/departments/student-services/wellness',
        domain: 'dublinusd.org',
        icon: 'medkit-outline',
        color: '#8b5cf6',
      },
    ],
  },
];

const DEADLINES: Deadline[] = [
  {
    title: 'UC/CSU Application',
    date: 'Nov 30, 2025',
    color: '#3b82f6',
    icon: 'school-outline',
    note: 'Submit by midnight PST',
  },
  {
    title: 'Common App Early Decision',
    date: 'Nov 1, 2025',
    color: '#8b5cf6',
    icon: 'document-outline',
  },
  {
    title: 'FAFSA Priority Deadline',
    date: 'Dec 1, 2025',
    color: '#10b981',
    icon: 'cash-outline',
    note: 'For maximum aid consideration',
  },
  {
    title: 'AP Exam Registration',
    date: '~April 18, 2026',
    color: '#f59e0b',
    icon: 'pencil-outline',
    note: 'Check with your counselor',
  },
  {
    title: 'SAT April Test',
    date: 'April 5, 2026',
    color: '#ef4444',
    icon: 'checkbox-outline',
    note: 'Register at collegeboard.org',
  },
];

// ============================================================
// Sub-component: Resource card
// ============================================================
function ResourceCard({ item }: { item: Resource }) {
  const handlePress = () => {
    Linking.openURL(item.url).catch(() => {});
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [styles.resourceCard, pressed && { opacity: 0.8 }]}
    >
      <View style={[styles.resourceIcon, { backgroundColor: `${item.color}18` }]}>
        <Ionicons name={item.icon as any} size={20} color={item.color} />
      </View>
      <View style={styles.resourceContent}>
        <Text style={styles.resourceTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.resourceDesc} numberOfLines={2}>{item.description}</Text>
        <View style={styles.resourceDomain}>
          <Ionicons name="globe-outline" size={10} color={Colors.textDim} />
          <Text style={styles.resourceDomainText}>{item.domain}</Text>
        </View>
      </View>
      <Ionicons name="open-outline" size={16} color={Colors.textDim} style={styles.externalIcon} />
    </Pressable>
  );
}

// ============================================================
// Sub-component: Resource section
// ============================================================
function ResourceSection({ section }: { section: ResourceSection }) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={[styles.sectionIconWrap, { backgroundColor: `${section.color}18` }]}>
          <Ionicons name={section.icon as any} size={16} color={section.color} />
        </View>
        <Text style={[styles.sectionTitle, { color: section.color }]}>{section.title}</Text>
      </View>
      <View style={styles.sectionCards}>
        {section.items.map((item) => (
          <ResourceCard key={item.url} item={item} />
        ))}
      </View>
    </View>
  );
}

// ============================================================
// Sub-component: Deadline row
// ============================================================
function DeadlineRow({ deadline }: { deadline: Deadline }) {
  return (
    <View style={styles.deadlineRow}>
      <View style={[styles.deadlineAccent, { backgroundColor: deadline.color }]} />
      <View style={[styles.deadlineIconWrap, { backgroundColor: `${deadline.color}15` }]}>
        <Ionicons name={deadline.icon as any} size={14} color={deadline.color} />
      </View>
      <View style={styles.deadlineContent}>
        <Text style={styles.deadlineTitle}>{deadline.title}</Text>
        {deadline.note && (
          <Text style={styles.deadlineNote}>{deadline.note}</Text>
        )}
      </View>
      <View style={[styles.deadlineDatePill, { backgroundColor: `${deadline.color}14`, borderColor: `${deadline.color}35` }]}>
        <Text style={[styles.deadlineDateText, { color: deadline.color }]}>{deadline.date}</Text>
      </View>
    </View>
  );
}

// ============================================================
// Main Screen
// ============================================================
export default function ResourcesScreen() {
  const insets = useSafeAreaInsets();

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
              <Text style={styles.headerTitle}>Resources</Text>
              <Text style={styles.headerSub}>Links, tools, and support</Text>
            </View>
            <View style={styles.headerIconWrap}>
              <Ionicons name="grid" size={22} color={Colors.emerald400} />
            </View>
          </View>
        </LinearGradient>

        {/* ── Resource sections ── */}
        <View style={styles.sectionsWrapper}>
          {RESOURCE_SECTIONS.map((section) => (
            <ResourceSection key={section.title} section={section} />
          ))}
        </View>

        {/* ── Important deadlines ── */}
        <View style={styles.deadlinesSection}>
          <View style={styles.deadlinesSectionHeader}>
            <Ionicons name="alarm-outline" size={18} color="#ef4444" />
            <Text style={styles.deadlinesSectionTitle}>Important Deadlines</Text>
            <View style={styles.deadlinesBadge}>
              <Text style={styles.deadlinesBadgeText}>2025–26</Text>
            </View>
          </View>
          <View style={styles.deadlinesCard}>
            {DEADLINES.map((d, i) => (
              <View key={d.title}>
                <DeadlineRow deadline={d} />
                {i < DEADLINES.length - 1 && (
                  <View style={styles.deadlineSep} />
                )}
              </View>
            ))}
          </View>
          <View style={styles.deadlinesNote}>
            <Ionicons name="information-circle-outline" size={12} color={Colors.textDim} />
            <Text style={styles.deadlinesNoteText}>
              Deadlines are approximate. Always verify with official sources and your counselor.
            </Text>
          </View>
        </View>

        {/* ── EHS Contact info ── */}
        <View style={styles.contactSection}>
          <View style={styles.contactHeader}>
            <LinearGradient
              colors={['#10b981', '#3b82f6']}
              style={styles.contactLogo}
            >
              <Text style={styles.contactLogoText}>EHS</Text>
            </LinearGradient>
            <View>
              <Text style={styles.contactSchoolName}>Emerald High School</Text>
              <Text style={styles.contactDistrict}>Dublin Unified School District</Text>
            </View>
          </View>

          <View style={styles.contactInfoList}>
            <Pressable
              onPress={() => Linking.openURL('https://maps.apple.com/?address=3600+Central+Parkway,+Dublin,+CA+94568').catch(() => {})}
              style={({ pressed }) => [styles.contactRow, pressed && { opacity: 0.7 }]}
            >
              <View style={styles.contactRowIcon}>
                <Ionicons name="location-outline" size={16} color={Colors.emerald400} />
              </View>
              <Text style={styles.contactRowText}>3600 Central Parkway, Dublin, CA 94568</Text>
              <Ionicons name="open-outline" size={13} color={Colors.textDim} />
            </Pressable>

            <View style={styles.contactDivider} />

            <Pressable
              onPress={() => Linking.openURL('tel:+19255514040').catch(() => {})}
              style={({ pressed }) => [styles.contactRow, pressed && { opacity: 0.7 }]}
            >
              <View style={styles.contactRowIcon}>
                <Ionicons name="call-outline" size={16} color={Colors.emerald400} />
              </View>
              <Text style={styles.contactRowText}>(925) 551-4040</Text>
              <Ionicons name="open-outline" size={13} color={Colors.textDim} />
            </Pressable>

            <View style={styles.contactDivider} />

            <Pressable
              onPress={() => Linking.openURL('https://ehs.dublinusd.org').catch(() => {})}
              style={({ pressed }) => [styles.contactRow, pressed && { opacity: 0.7 }]}
            >
              <View style={styles.contactRowIcon}>
                <Ionicons name="globe-outline" size={16} color={Colors.emerald400} />
              </View>
              <Text style={styles.contactRowText}>ehs.dublinusd.org</Text>
              <Ionicons name="open-outline" size={13} color={Colors.textDim} />
            </Pressable>
          </View>
        </View>

        {/* ── Footer ── */}
        <View style={styles.footer}>
          <View style={styles.footerDivider} />
          <Text style={styles.footerText}>
            EMERALD HIGH SCHOOL • RESOURCES HUB
          </Text>
          <Text style={styles.footerSub}>
            Unofficial student app. Not affiliated with DUSD.
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

  // ── Sections ──
  sectionsWrapper: {
    paddingHorizontal: 12,
    marginTop: 12,
    gap: 20,
  },
  section: {},
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  sectionIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontFamily: 'Syne_700Bold',
    fontSize: 16,
  },
  sectionCards: {
    gap: 6,
  },

  // ── Resource card ──
  resourceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgCard,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 12,
    gap: 12,
  },
  resourceIcon: {
    width: 40,
    height: 40,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  resourceContent: {
    flex: 1,
    gap: 2,
  },
  resourceTitle: {
    color: Colors.textPrimary,
    fontFamily: 'DMSans_700Bold',
    fontSize: 14,
  },
  resourceDesc: {
    color: 'rgba(240,253,244,0.55)',
    fontFamily: 'DMSans_400Regular',
    fontSize: 12,
    lineHeight: 17,
  },
  resourceDomain: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  resourceDomainText: {
    color: Colors.textDim,
    fontFamily: 'DMMono_400Regular',
    fontSize: 10,
  },
  externalIcon: {
    flexShrink: 0,
  },

  // ── Deadlines ──
  deadlinesSection: {
    paddingHorizontal: 12,
    marginTop: 24,
  },
  deadlinesSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  deadlinesSectionTitle: {
    color: Colors.textPrimary,
    fontFamily: 'Syne_700Bold',
    fontSize: 16,
    flex: 1,
  },
  deadlinesBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: 'rgba(239,68,68,0.12)',
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.3)',
  },
  deadlinesBadgeText: {
    color: '#ef4444',
    fontFamily: 'DMMono_400Regular',
    fontSize: 10,
  },
  deadlinesCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  deadlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 10,
  },
  deadlineAccent: {
    width: 3,
    height: '100%',
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
  },
  deadlineIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
  deadlineContent: {
    flex: 1,
  },
  deadlineTitle: {
    color: Colors.textPrimary,
    fontFamily: 'DMSans_500Medium',
    fontSize: 13,
  },
  deadlineNote: {
    color: Colors.textDim,
    fontFamily: 'DMSans_400Regular',
    fontSize: 11,
    marginTop: 1,
  },
  deadlineDatePill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  deadlineDateText: {
    fontFamily: 'DMMono_400Regular',
    fontSize: 10,
    letterSpacing: 0.2,
  },
  deadlineSep: {
    height: 1,
    backgroundColor: Colors.border,
    marginHorizontal: 14,
  },
  deadlinesNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginTop: 8,
    paddingHorizontal: 4,
  },
  deadlinesNoteText: {
    color: Colors.textDim,
    fontFamily: 'DMSans_400Regular',
    fontSize: 11,
    flex: 1,
    lineHeight: 16,
  },

  // ── Contact ──
  contactSection: {
    marginHorizontal: 12,
    marginTop: 24,
  },
  contactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  contactLogo: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactLogoText: {
    color: '#fff',
    fontFamily: 'Syne_700Bold',
    fontSize: 14,
  },
  contactSchoolName: {
    color: Colors.textPrimary,
    fontFamily: 'Syne_700Bold',
    fontSize: 16,
  },
  contactDistrict: {
    color: Colors.textDim,
    fontFamily: 'DMSans_400Regular',
    fontSize: 12,
    marginTop: 1,
  },
  contactInfoList: {
    backgroundColor: Colors.bgCard,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 13,
    paddingHorizontal: 14,
  },
  contactRowIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: 'rgba(16,185,129,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactRowText: {
    color: Colors.textPrimary,
    fontFamily: 'DMSans_400Regular',
    fontSize: 13,
    flex: 1,
  },
  contactDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginHorizontal: 14,
  },

  // ── Footer ──
  footer: {
    marginTop: 28,
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
