// ============================================================
// SchoolVoice — Anonymous Feedback Screen
// Emerald High School Student Portal
// ============================================================

import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  Modal,
  TextInput,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import {
  seedFeedback,
  feedbackCategories,
  type FeedbackItem,
  type FeedbackCategory,
  type FeedbackStatus,
} from '@/data/feedback';
import { useStorage } from '@/hooks/useStorage';

// ============================================================
// Constants
// ============================================================

const STORAGE_KEY = 'ehs-schoolvoice-feedback';
const MIN_CHARS = 20;
const MAX_CHARS = 500;

const CATEGORY_COLORS: Record<FeedbackCategory, string> = {
  'Mental Health Resources': '#8b5cf6',
  'Food Quality': '#f97316',
  'Safety': '#ef4444',
  'Facilities': '#3b82f6',
  'School Policy': '#f59e0b',
  'Events & Activities': '#06b6d4',
  'Other': '#64748b',
};

const CATEGORY_ICONS: Record<FeedbackCategory, string> = {
  'Mental Health Resources': 'heart-outline',
  'Food Quality': 'restaurant-outline',
  'Safety': 'shield-outline',
  'Facilities': 'business-outline',
  'School Policy': 'document-text-outline',
  'Events & Activities': 'calendar-outline',
  'Other': 'ellipsis-horizontal-circle-outline',
};

const STATUS_COLORS: Record<FeedbackStatus, string> = {
  pending: '#64748b',
  acknowledged: '#f59e0b',
  resolved: '#10b981',
};

const STATUS_LABELS: Record<FeedbackStatus, string> = {
  pending: 'Pending',
  acknowledged: 'Acknowledged',
  resolved: 'Resolved',
};

const STATUS_ICONS: Record<FeedbackStatus, string> = {
  pending: 'time-outline',
  acknowledged: 'eye-outline',
  resolved: 'checkmark-circle-outline',
};

// ============================================================
// Helpers
// ============================================================

function timeAgo(isoStr: string): string {
  const diff = (Date.now() - new Date(isoStr).getTime()) / 1000;
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  const days = Math.floor(diff / 86400);
  if (days === 1) return '1 day ago';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

function generateId(): string {
  return `fb-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

// ============================================================
// Sub-component: Category badge
// ============================================================
function CategoryBadge({ category }: { category: FeedbackCategory }) {
  const color = CATEGORY_COLORS[category];
  return (
    <View style={[styles.catBadge, { backgroundColor: `${color}18`, borderColor: `${color}40` }]}>
      <Ionicons name={CATEGORY_ICONS[category] as any} size={10} color={color} />
      <Text style={[styles.catBadgeText, { color }]}>{category}</Text>
    </View>
  );
}

// ============================================================
// Sub-component: Status badge
// ============================================================
function StatusBadge({ status }: { status: FeedbackStatus }) {
  const color = STATUS_COLORS[status];
  return (
    <View style={[styles.statusBadge, { backgroundColor: `${color}18`, borderColor: `${color}40` }]}>
      <Ionicons name={STATUS_ICONS[status] as any} size={10} color={color} />
      <Text style={[styles.statusBadgeText, { color }]}>{STATUS_LABELS[status]}</Text>
    </View>
  );
}

// ============================================================
// Sub-component: Feedback card
// ============================================================
function FeedbackCard({ item }: { item: FeedbackItem }) {
  const isResolved = item.status === 'resolved';
  return (
    <View style={[styles.feedbackCard, isResolved && styles.feedbackCardResolved]}>
      {/* Top row: category + status */}
      <View style={styles.feedbackCardTop}>
        <CategoryBadge category={item.category} />
        <StatusBadge status={item.status} />
      </View>

      {/* Message */}
      <Text style={[styles.feedbackMessage, isResolved && styles.feedbackMessageResolved]} numberOfLines={2}>
        {item.message}
      </Text>

      {/* Admin note */}
      {item.adminNote && (
        <View style={styles.adminNote}>
          <View style={styles.adminNoteHeader}>
            <Ionicons name="shield-checkmark" size={12} color="#10b981" />
            <Text style={styles.adminNoteLabel}>Admin Response</Text>
          </View>
          <Text style={styles.adminNoteText}>{item.adminNote}</Text>
        </View>
      )}

      {/* Footer: time ago */}
      <Text style={styles.feedbackTime}>{timeAgo(item.submittedAt)}</Text>
    </View>
  );
}

// ============================================================
// Sub-component: Submit Modal
// ============================================================
interface SubmitModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (category: FeedbackCategory, message: string) => void;
}

function SubmitModal({ visible, onClose, onSubmit }: SubmitModalProps) {
  const insets = useSafeAreaInsets();
  const [selectedCategory, setSelectedCategory] = useState<FeedbackCategory | null>(null);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const successScale = React.useRef(new Animated.Value(0)).current;

  const charCount = message.length;
  const canSubmit = selectedCategory !== null && charCount >= MIN_CHARS;

  const handleSubmit = useCallback(() => {
    if (!canSubmit || !selectedCategory) return;
    onSubmit(selectedCategory, message);
    setSubmitted(true);
    Animated.spring(successScale, {
      toValue: 1,
      useNativeDriver: true,
      damping: 12,
      stiffness: 200,
    }).start();
    setTimeout(() => {
      setSubmitted(false);
      successScale.setValue(0);
      setSelectedCategory(null);
      setMessage('');
      onClose();
    }, 1800);
  }, [canSubmit, selectedCategory, message, onSubmit, onClose, successScale]);

  const handleClose = useCallback(() => {
    setSelectedCategory(null);
    setMessage('');
    setSubmitted(false);
    successScale.setValue(0);
    onClose();
  }, [onClose, successScale]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={[styles.modalContainer, { paddingBottom: insets.bottom + 16 }]}>
          {/* Modal header */}
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>Submit Feedback</Text>
              <Text style={styles.modalSub}>Your voice matters at EHS</Text>
            </View>
            <Pressable
              onPress={handleClose}
              style={({ pressed }) => [styles.modalClose, pressed && { opacity: 0.6 }]}
            >
              <Ionicons name="close" size={20} color={Colors.textDim} />
            </Pressable>
          </View>

          {submitted ? (
            /* ── Success state ── */
            <View style={styles.successState}>
              <Animated.View style={[styles.successCircle, { transform: [{ scale: successScale }] }]}>
                <Ionicons name="checkmark" size={40} color="#fff" />
              </Animated.View>
              <Text style={styles.successTitle}>Feedback Submitted!</Text>
              <Text style={styles.successText}>
                Your anonymous feedback has been received. Thank you for helping improve EHS.
              </Text>
            </View>
          ) : (
            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={{ padding: 16 }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {/* Anonymous guarantee banner */}
              <LinearGradient
                colors={['#064e3b', '#065f46']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.anonBanner}
              >
                <Ionicons name="lock-closed" size={18} color="#34d399" />
                <View style={{ flex: 1 }}>
                  <Text style={styles.anonBannerTitle}>100% Anonymous</Text>
                  <Text style={styles.anonBannerText}>
                    No names, no logins, no tracking. Your identity is never stored or shared.
                  </Text>
                </View>
              </LinearGradient>

              {/* Category grid */}
              <Text style={styles.fieldLabel}>SELECT CATEGORY</Text>
              <View style={styles.categoryGrid}>
                {feedbackCategories.map((cat) => {
                  const color = CATEGORY_COLORS[cat];
                  const isSelected = cat === selectedCategory;
                  return (
                    <Pressable
                      key={cat}
                      onPress={() => setSelectedCategory(cat)}
                      style={({ pressed }) => [
                        styles.categoryGridItem,
                        isSelected && {
                          backgroundColor: `${color}20`,
                          borderColor: `${color}60`,
                        },
                        pressed && { opacity: 0.7 },
                      ]}
                    >
                      <View style={[
                        styles.categoryGridIcon,
                        { backgroundColor: isSelected ? `${color}25` : 'rgba(255,255,255,0.05)' },
                      ]}>
                        <Ionicons
                          name={CATEGORY_ICONS[cat] as any}
                          size={18}
                          color={isSelected ? color : Colors.textDim}
                        />
                      </View>
                      <Text style={[
                        styles.categoryGridText,
                        { color: isSelected ? color : Colors.textDim },
                      ]} numberOfLines={2}>
                        {cat}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              {/* Message input */}
              <Text style={[styles.fieldLabel, { marginTop: 16 }]}>YOUR FEEDBACK</Text>
              <View style={styles.textInputWrapper}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Share your thoughts, concerns, or suggestions..."
                  placeholderTextColor="rgba(75,138,107,0.6)"
                  multiline
                  numberOfLines={5}
                  maxLength={MAX_CHARS}
                  value={message}
                  onChangeText={setMessage}
                  textAlignVertical="top"
                />
                <View style={styles.charCountRow}>
                  {charCount < MIN_CHARS && (
                    <Text style={styles.charCountMin}>
                      {MIN_CHARS - charCount} more char{MIN_CHARS - charCount !== 1 ? 's' : ''} needed
                    </Text>
                  )}
                  <Text style={[
                    styles.charCount,
                    charCount > MAX_CHARS * 0.9 && { color: '#ef4444' },
                  ]}>
                    {charCount}/{MAX_CHARS}
                  </Text>
                </View>
              </View>

              {/* Submit button */}
              <Pressable
                onPress={handleSubmit}
                disabled={!canSubmit}
                style={({ pressed }) => [
                  styles.submitBtn,
                  !canSubmit && styles.submitBtnDisabled,
                  pressed && canSubmit && { opacity: 0.85 },
                ]}
              >
                {canSubmit ? (
                  <LinearGradient
                    colors={['#059669', '#10b981']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.submitBtnGradient}
                  >
                    <Ionicons name="send" size={16} color="#fff" />
                    <Text style={styles.submitBtnText}>Submit Anonymously</Text>
                  </LinearGradient>
                ) : (
                  <View style={styles.submitBtnGradient}>
                    <Ionicons name="send" size={16} color={Colors.textDim} />
                    <Text style={[styles.submitBtnText, { color: Colors.textDim }]}>
                      Submit Anonymously
                    </Text>
                  </View>
                )}
              </Pressable>
            </ScrollView>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ============================================================
// Main Screen
// ============================================================
export default function VoiceScreen() {
  const insets = useSafeAreaInsets();
  const [feedbackItems, setFeedbackItems, loaded] = useStorage<FeedbackItem[]>(
    STORAGE_KEY,
    seedFeedback,
  );
  const [activeCategory, setActiveCategory] = useState<FeedbackCategory | 'All'>('All');
  const [modalVisible, setModalVisible] = useState(false);

  const filteredItems = useMemo<FeedbackItem[]>(() => {
    if (activeCategory === 'All') return feedbackItems;
    return feedbackItems.filter((f) => f.category === activeCategory);
  }, [feedbackItems, activeCategory]);

  const handleSubmit = useCallback((category: FeedbackCategory, message: string) => {
    const newItem: FeedbackItem = {
      id: generateId(),
      category,
      message,
      status: 'pending',
      submittedAt: new Date().toISOString(),
    };
    setFeedbackItems((prev) => [newItem, ...prev]);
  }, [setFeedbackItems]);

  const categoryFilter = useMemo<(FeedbackCategory | 'All')[]>(() => {
    return ['All', ...feedbackCategories];
  }, []);

  const renderItem = useCallback(({ item }: { item: FeedbackItem }) => (
    <FeedbackCard item={item} />
  ), []);

  const keyExtractor = useCallback((item: FeedbackItem) => item.id, []);

  const ListHeader = useMemo(() => (
    <View>
      {/* ── Screen header ── */}
      <LinearGradient
        colors={['#022c22', Colors.bgPrimary]}
        style={[styles.header, { paddingTop: insets.top + 14 }]}
      >
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>SchoolVoice</Text>
            <Text style={styles.headerSub}>Anonymous student feedback</Text>
          </View>
          {/* Privacy badge */}
          <View style={styles.privacyBadge}>
            <Ionicons name="lock-closed" size={12} color="#34d399" />
            <Text style={styles.privacyBadgeText}>100% Anonymous</Text>
          </View>
        </View>

        {/* New feedback button */}
        <Pressable
          onPress={() => setModalVisible(true)}
          style={({ pressed }) => [styles.newFeedbackBtn, pressed && { opacity: 0.85 }]}
        >
          <LinearGradient
            colors={['#059669', '#10b981']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.newFeedbackBtnInner}
          >
            <Ionicons name="add-circle-outline" size={18} color="#fff" />
            <Text style={styles.newFeedbackBtnText}>New Feedback</Text>
          </LinearGradient>
        </Pressable>
      </LinearGradient>

      {/* ── Category filter chips ── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterChips}
      >
        {categoryFilter.map((cat) => {
          const isActive = cat === activeCategory;
          const color = cat === 'All' ? '#34d399' : CATEGORY_COLORS[cat as FeedbackCategory];
          return (
            <Pressable
              key={cat}
              onPress={() => setActiveCategory(cat)}
              style={({ pressed }) => [
                styles.filterChip,
                isActive && { backgroundColor: `${color}18`, borderColor: `${color}50` },
                pressed && { opacity: 0.7 },
              ]}
            >
              {cat !== 'All' && (
                <Ionicons
                  name={CATEGORY_ICONS[cat as FeedbackCategory] as any}
                  size={11}
                  color={isActive ? color : Colors.textDim}
                />
              )}
              <Text style={[
                styles.filterChipText,
                { color: isActive ? color : Colors.textDim },
              ]}>
                {cat}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* ── List header label ── */}
      <View style={styles.listHeader}>
        <Text style={styles.listHeaderLabel}>
          {filteredItems.length} SUBMISSION{filteredItems.length !== 1 ? 'S' : ''}
          {activeCategory !== 'All' ? ` · ${activeCategory.toUpperCase()}` : ''}
        </Text>
      </View>
    </View>
  ), [insets.top, activeCategory, categoryFilter, filteredItems.length]);

  const ListEmpty = useMemo(() => (
    <View style={styles.emptyState}>
      <Ionicons name="chatbubble-outline" size={40} color={Colors.textDim} style={{ marginBottom: 12 }} />
      <Text style={styles.emptyTitle}>No feedback yet</Text>
      <Text style={styles.emptyText}>
        {activeCategory === 'All'
          ? 'Be the first to share your thoughts anonymously.'
          : `No feedback in "${activeCategory}" yet.`}
      </Text>
    </View>
  ), [activeCategory]);

  const ListFooter = useMemo(() => (
    <View style={[styles.listFooter, { paddingBottom: insets.bottom + 16 }]}>
      <View style={styles.footerDivider} />
      <Text style={styles.footerText}>
        All submissions are anonymous. EHS administration reviews feedback weekly.
      </Text>
    </View>
  ), [insets.bottom]);

  if (!loaded) {
    return (
      <View style={[styles.container, { backgroundColor: Colors.bgPrimary, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: Colors.textDim, fontFamily: 'DMMono_400Regular', fontSize: 12 }}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: Colors.bgPrimary }]}>
      <FlatList
        data={filteredItems}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={ListEmpty}
        ListFooterComponent={ListFooter}
        contentContainerStyle={styles.flatListContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      />

      <SubmitModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleSubmit}
      />
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
  flatListContent: {
    flexGrow: 1,
  },

  // ── Screen header ──
  header: {
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 10,
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
  privacyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: 'rgba(52,211,153,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(52,211,153,0.25)',
    borderRadius: 100,
    alignSelf: 'flex-start',
  },
  privacyBadgeText: {
    color: '#34d399',
    fontFamily: 'DMMono_400Regular',
    fontSize: 10,
    letterSpacing: 0.3,
  },
  newFeedbackBtn: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  newFeedbackBtnInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 13,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  newFeedbackBtnText: {
    color: '#fff',
    fontFamily: 'DMSans_700Bold',
    fontSize: 15,
  },

  // ── Filter chips ──
  filterChips: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 6,
    flexDirection: 'row',
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 100,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterChipText: {
    fontFamily: 'DMSans_500Medium',
    fontSize: 12,
  },

  // ── List header ──
  listHeader: {
    paddingHorizontal: 16,
    paddingBottom: 6,
  },
  listHeaderLabel: {
    color: Colors.textDim,
    fontFamily: 'DMMono_400Regular',
    fontSize: 10,
    letterSpacing: 1,
  },

  // ── Feedback card ──
  feedbackCard: {
    marginHorizontal: 12,
    marginBottom: 8,
    backgroundColor: Colors.bgCard,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
  },
  feedbackCardResolved: {
    opacity: 0.7,
  },
  feedbackCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  feedbackMessage: {
    color: Colors.textPrimary,
    fontFamily: 'DMSans_400Regular',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 6,
  },
  feedbackMessageResolved: {
    color: 'rgba(240,253,244,0.6)',
  },
  feedbackTime: {
    color: Colors.textDim,
    fontFamily: 'DMMono_400Regular',
    fontSize: 10,
    marginTop: 4,
  },

  // ── Category badge ──
  catBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 100,
    borderWidth: 1,
  },
  catBadgeText: {
    fontFamily: 'DMMono_400Regular',
    fontSize: 9,
    letterSpacing: 0.2,
  },

  // ── Status badge ──
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 100,
    borderWidth: 1,
  },
  statusBadgeText: {
    fontFamily: 'DMMono_400Regular',
    fontSize: 9,
    letterSpacing: 0.2,
  },

  // ── Admin note ──
  adminNote: {
    backgroundColor: 'rgba(16,185,129,0.08)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(16,185,129,0.2)',
    padding: 10,
    marginTop: 6,
    marginBottom: 4,
  },
  adminNoteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 4,
  },
  adminNoteLabel: {
    color: '#10b981',
    fontFamily: 'DMSans_700Bold',
    fontSize: 11,
  },
  adminNoteText: {
    color: 'rgba(240,253,244,0.75)',
    fontFamily: 'DMSans_400Regular',
    fontSize: 12,
    lineHeight: 18,
  },

  // ── Empty / footer ──
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    color: Colors.textPrimary,
    fontFamily: 'Syne_700Bold',
    fontSize: 18,
    marginBottom: 8,
  },
  emptyText: {
    color: Colors.textDim,
    fontFamily: 'DMSans_400Regular',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
  },
  listFooter: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  footerDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginBottom: 12,
  },
  footerText: {
    color: Colors.textDim,
    fontFamily: 'DMSans_400Regular',
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 17,
  },

  // ── Modal ──
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    color: Colors.textPrimary,
    fontFamily: 'Syne_700Bold',
    fontSize: 22,
  },
  modalSub: {
    color: Colors.textDim,
    fontFamily: 'DMMono_400Regular',
    fontSize: 11,
    marginTop: 2,
  },
  modalClose: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(75,138,107,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Anon banner ──
  anonBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
  },
  anonBannerTitle: {
    color: '#fff',
    fontFamily: 'DMSans_700Bold',
    fontSize: 14,
    marginBottom: 3,
  },
  anonBannerText: {
    color: 'rgba(255,255,255,0.65)',
    fontFamily: 'DMSans_400Regular',
    fontSize: 12,
    lineHeight: 17,
  },

  // ── Category grid ──
  fieldLabel: {
    color: Colors.textDim,
    fontFamily: 'DMMono_400Regular',
    fontSize: 10,
    letterSpacing: 1.2,
    marginBottom: 10,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryGridItem: {
    width: '47%',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 10,
    backgroundColor: Colors.bgCard,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 8,
  },
  categoryGridIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryGridText: {
    fontFamily: 'DMSans_500Medium',
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 15,
  },

  // ── Text input ──
  textInputWrapper: {
    backgroundColor: Colors.bgCard,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 12,
  },
  textInput: {
    color: Colors.textPrimary,
    fontFamily: 'DMSans_400Regular',
    fontSize: 14,
    lineHeight: 21,
    minHeight: 100,
  },
  charCountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  charCountMin: {
    color: '#f59e0b',
    fontFamily: 'DMMono_400Regular',
    fontSize: 10,
  },
  charCount: {
    color: Colors.textDim,
    fontFamily: 'DMMono_400Regular',
    fontSize: 11,
    marginLeft: 'auto',
  },

  // ── Submit button ──
  submitBtn: {
    marginTop: 20,
    borderRadius: 14,
    overflow: 'hidden',
  },
  submitBtnDisabled: {
    opacity: 0.5,
  },
  submitBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 15,
    borderRadius: 14,
    backgroundColor: Colors.bgCard,
  },
  submitBtnText: {
    color: '#fff',
    fontFamily: 'DMSans_700Bold',
    fontSize: 16,
  },

  // ── Success state ──
  successState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  successCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#10b981',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  successTitle: {
    color: Colors.textPrimary,
    fontFamily: 'Syne_700Bold',
    fontSize: 22,
    marginBottom: 10,
    textAlign: 'center',
  },
  successText: {
    color: Colors.textDim,
    fontFamily: 'DMSans_400Regular',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 21,
  },
});
