import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Rect, Text as SvgText, G } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

// ─── Building data ───────────────────────────────────────────────────────────

const BUILDINGS = [
  { id: 'admin',     label: 'A – Administration',          abbrev: 'A',   color: '#059669', desc: 'Main office, principal, counseling',              rooms: ['A101', 'A102', 'A103', 'A104'] },
  { id: 'vapa',      label: 'C – Visual & Performing Arts', abbrev: 'C',   color: '#7c3aed', desc: 'Art, drama, music',                               rooms: ['C101', 'C102', 'C103', 'C105', 'C106'] },
  { id: 'cafeteria', label: 'D – Cafeteria',                abbrev: 'D',   color: '#f97316', desc: 'Cafeteria, student store',                        rooms: ['D100'] },
  { id: 'library',   label: 'E – Library',                  abbrev: 'E',   color: '#0891b2', desc: 'Library, computer lab, tutoring center',          rooms: ['E101', 'E102', 'E105'] },
  { id: 'f_wing',    label: 'F – Academic Wing',            abbrev: 'F',   color: '#2563eb', desc: 'Math, science, English classrooms',               rooms: ['F101','F102','F103','F104','F105','F106','F107','F108','F109','F110','F111','F112'] },
  { id: 'g_wing',    label: 'G – Academic Wing',            abbrev: 'G',   color: '#1d4ed8', desc: 'Social studies, world language, health',          rooms: ['G101','G102','G103','G104','G105','G106','G107','G108','G109','G110'] },
  { id: 'gym',       label: 'M – Main Gym',                 abbrev: 'M',   color: '#be185d', desc: 'PE, basketball courts, weight room',              rooms: ['M100', 'M101', 'M102'] },
  { id: 'pac',       label: 'PAC – Performing Arts Center', abbrev: 'PAC', color: '#9333ea', desc: 'Auditorium, theater performances',                rooms: ['PAC'] },
  { id: 'stadium',   label: 'Stadium & Track',              abbrev: 'STD', color: '#16a34a', desc: 'Football field, running track, bleachers',        rooms: [] },
  { id: 'tennis',    label: 'Tennis Courts',                abbrev: 'TEN', color: '#ca8a04', desc: 'Tennis courts',                                   rooms: [] },
];

// ─── SVG layout ──────────────────────────────────────────────────────────────

const SVG_BUILDINGS: { id: string; x: number; y: number; w: number; h: number }[] = [
  { id: 'admin',     x: 10,  y: 10,  w: 60,  h: 40 },
  { id: 'vapa',      x: 80,  y: 10,  w: 70,  h: 40 },
  { id: 'cafeteria', x: 160, y: 10,  w: 60,  h: 40 },
  { id: 'library',   x: 230, y: 10,  w: 70,  h: 40 },
  { id: 'f_wing',    x: 10,  y: 70,  w: 150, h: 50 },
  { id: 'g_wing',    x: 170, y: 70,  w: 130, h: 50 },
  { id: 'gym',       x: 10,  y: 140, w: 80,  h: 50 },
  { id: 'pac',       x: 100, y: 140, w: 80,  h: 50 },
  { id: 'stadium',   x: 190, y: 140, w: 100, h: 70 },
  { id: 'tennis',    x: 300, y: 10,  w: 50,  h: 60 },
];

// ─── Types ───────────────────────────────────────────────────────────────────

type Building = typeof BUILDINGS[number];

interface RoomMatch {
  room: string;
  building: Building;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

// ─── Campus SVG Map ──────────────────────────────────────────────────────────

function CampusSvgMap({
  selectedId,
  onSelect,
}: {
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <View
      style={{
        marginHorizontal: 16,
        marginBottom: 16,
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#1a3326',
        backgroundColor: '#0a1f13',
      }}
    >
      <Svg
        width="100%"
        height={undefined}
        viewBox="0 0 360 220"
        style={{ aspectRatio: 360 / 220 }}
      >
        {/* Background grid lines */}
        {[30, 60, 90, 120, 150, 180].map((y) => (
          <Rect key={`hy${y}`} x={0} y={y} width={360} height={1} fill="rgba(26,51,38,0.6)" />
        ))}
        {[60, 120, 180, 240, 300].map((x) => (
          <Rect key={`vx${x}`} x={x} y={0} width={1} height={220} fill="rgba(26,51,38,0.6)" />
        ))}

        {SVG_BUILDINGS.map((svgB) => {
          const data = BUILDINGS.find((b) => b.id === svgB.id);
          if (!data) return null;

          const isSelected = selectedId === svgB.id;
          const cx = svgB.x + svgB.w / 2;
          const cy = svgB.y + svgB.h / 2;

          const fillColor = hexToRgba(data.color, isSelected ? 0.45 : 0.22);
          const strokeColor = isSelected ? '#fbbf24' : data.color;
          const strokeWidth = isSelected ? 2 : 1;

          // Determine font size for label based on available space
          const abbrevSize = svgB.w < 50 ? 9 : svgB.w < 80 ? 10 : 11;

          return (
            <G key={svgB.id} onPress={() => onSelect(svgB.id)}>
              {/* Shadow / glow when selected */}
              {isSelected && (
                <Rect
                  x={svgB.x - 3}
                  y={svgB.y - 3}
                  width={svgB.w + 6}
                  height={svgB.h + 6}
                  rx={5}
                  ry={5}
                  fill={hexToRgba('#fbbf24', 0.12)}
                />
              )}
              <Rect
                x={svgB.x}
                y={svgB.y}
                width={svgB.w}
                height={svgB.h}
                rx={4}
                ry={4}
                fill={fillColor}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
              />
              <SvgText
                x={cx}
                y={cy - (svgB.h > 44 ? 6 : 0)}
                textAnchor="middle"
                fill={isSelected ? '#fbbf24' : '#f0fdf4'}
                fontSize={abbrevSize}
                fontWeight="bold"
              >
                {data.abbrev}
              </SvgText>
              {svgB.h > 44 && (
                <SvgText
                  x={cx}
                  y={cy + 8}
                  textAnchor="middle"
                  fill={isSelected ? 'rgba(251,191,36,0.75)' : 'rgba(240,253,244,0.5)'}
                  fontSize={7}
                >
                  {data.rooms.length > 0 ? `${data.rooms.length} rooms` : ''}
                </SvgText>
              )}
            </G>
          );
        })}

        {/* Compass rose */}
        <SvgText
          x={345}
          y={210}
          textAnchor="middle"
          fill="rgba(75,138,107,0.5)"
          fontSize={8}
        >
          N↑
        </SvgText>
      </Svg>

      <View
        style={{
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderTopWidth: 1,
          borderTopColor: '#1a3326',
        }}
      >
        <Text
          style={{
            color: '#4b8a6b',
            fontFamily: 'DMMono_400Regular',
            fontSize: 10,
            letterSpacing: 0.5,
            textAlign: 'center',
          }}
        >
          TAP A BUILDING TO SELECT • EMERALD HIGH SCHOOL CAMPUS
        </Text>
      </View>
    </View>
  );
}

// ─── Building Card ────────────────────────────────────────────────────────────

function BuildingCard({
  building,
  isSelected,
  isExpanded,
  onPress,
}: {
  building: Building;
  isSelected: boolean;
  isExpanded: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        marginHorizontal: 16,
        marginBottom: 10,
        borderRadius: 16,
        backgroundColor: '#0f2418',
        borderWidth: 1.5,
        borderColor: isSelected ? '#10b981' : '#1a3326',
        overflow: 'hidden',
        opacity: pressed ? 0.85 : 1,
        shadowColor: isSelected ? '#10b981' : 'transparent',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: isSelected ? 0.3 : 0,
        shadowRadius: 8,
      })}
    >
      {/* Header row */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: 14,
          gap: 12,
        }}
      >
        {/* Color circle with abbrev */}
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: hexToRgba(building.color, 0.2),
            borderWidth: 1.5,
            borderColor: hexToRgba(building.color, 0.5),
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Text
            style={{
              color: building.color,
              fontFamily: 'Syne_700Bold',
              fontSize: building.abbrev.length > 2 ? 9 : 13,
              lineHeight: building.abbrev.length > 2 ? 12 : 16,
            }}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {building.abbrev}
          </Text>
        </View>

        {/* Label + desc */}
        <View style={{ flex: 1 }}>
          <Text
            style={{
              color: '#f0fdf4',
              fontFamily: 'DMSans_700Bold',
              fontSize: 15,
              marginBottom: 2,
            }}
          >
            {building.label}
          </Text>
          <Text
            style={{
              color: '#4b8a6b',
              fontFamily: 'DMSans_400Regular',
              fontSize: 12,
            }}
          >
            {building.desc}
          </Text>
        </View>

        {/* Room count badge + chevron */}
        <View style={{ alignItems: 'flex-end', gap: 6 }}>
          {building.rooms.length > 0 && (
            <View
              style={{
                backgroundColor: hexToRgba(building.color, 0.15),
                borderRadius: 100,
                paddingHorizontal: 8,
                paddingVertical: 3,
                borderWidth: 1,
                borderColor: hexToRgba(building.color, 0.3),
              }}
            >
              <Text
                style={{
                  color: building.color,
                  fontFamily: 'DMMono_400Regular',
                  fontSize: 11,
                }}
              >
                {building.rooms.length} {building.rooms.length === 1 ? 'room' : 'rooms'}
              </Text>
            </View>
          )}
          <Ionicons
            name={isExpanded ? 'chevron-up' : 'chevron-down'}
            size={16}
            color="#4b8a6b"
          />
        </View>
      </View>

      {/* Expanded room list */}
      {isExpanded && building.rooms.length > 0 && (
        <View
          style={{
            borderTopWidth: 1,
            borderTopColor: '#1a3326',
            paddingHorizontal: 14,
            paddingVertical: 12,
          }}
        >
          <Text
            style={{
              color: '#4b8a6b',
              fontFamily: 'DMMono_400Regular',
              fontSize: 10,
              letterSpacing: 1,
              marginBottom: 10,
            }}
          >
            ROOMS
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {building.rooms.map((room) => (
              <View
                key={room}
                style={{
                  backgroundColor: hexToRgba(building.color, 0.1),
                  borderRadius: 8,
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderWidth: 1,
                  borderColor: hexToRgba(building.color, 0.25),
                }}
              >
                <Text
                  style={{
                    color: '#f0fdf4',
                    fontFamily: 'DMMono_400Regular',
                    fontSize: 12,
                  }}
                >
                  {room}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </Pressable>
  );
}

// ─── Room Match Card ──────────────────────────────────────────────────────────

function RoomMatchCard({
  match,
  onSelect,
}: {
  match: RoomMatch;
  onSelect: (id: string) => void;
}) {
  return (
    <Pressable
      onPress={() => onSelect(match.building.id)}
      style={({ pressed }) => ({
        marginHorizontal: 16,
        marginBottom: 8,
        borderRadius: 12,
        backgroundColor: '#0f2418',
        borderWidth: 1,
        borderColor: '#1a3326',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        gap: 12,
        opacity: pressed ? 0.8 : 1,
      })}
    >
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          backgroundColor: hexToRgba(match.building.color, 0.2),
          borderWidth: 1,
          borderColor: hexToRgba(match.building.color, 0.4),
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Ionicons name="location" size={16} color={match.building.color} />
      </View>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            color: '#f0fdf4',
            fontFamily: 'DMSans_700Bold',
            fontSize: 14,
            marginBottom: 2,
          }}
        >
          {match.room}
        </Text>
        <Text
          style={{
            color: '#4b8a6b',
            fontFamily: 'DMSans_400Regular',
            fontSize: 12,
          }}
        >
          {match.building.label}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={14} color="#4b8a6b" />
    </Pressable>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function MapScreen() {
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  const cardRefs = useRef<Record<string, number>>({});

  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  // ── Search filtering ──────────────────────────────────────────────────────

  const trimmedQuery = query.trim().toLowerCase();

  const filteredBuildings: Building[] = trimmedQuery
    ? BUILDINGS.filter(
        (b) =>
          b.label.toLowerCase().includes(trimmedQuery) ||
          b.abbrev.toLowerCase().includes(trimmedQuery) ||
          b.desc.toLowerCase().includes(trimmedQuery)
      )
    : BUILDINGS;

  const matchedRooms: RoomMatch[] = trimmedQuery
    ? BUILDINGS.flatMap((b) =>
        b.rooms
          .filter((r) => r.toLowerCase().includes(trimmedQuery))
          .map((r) => ({ room: r, building: b }))
      )
    : [];

  const isSearching = trimmedQuery.length > 0;

  // ── Handlers ──────────────────────────────────────────────────────────────

  const toggleExpand = useCallback((id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const handleCardPress = useCallback((id: string) => {
    setSelectedId((prev) => (prev === id ? null : id));
    toggleExpand(id);
  }, [toggleExpand]);

  const handleSvgSelect = useCallback(
    (id: string) => {
      setSelectedId(id);
      setExpandedIds((prev) => {
        const next = new Set(prev);
        next.add(id);
        return next;
      });

      // Scroll to card
      const offset = cardRefs.current[id];
      if (offset !== undefined && scrollRef.current) {
        scrollRef.current.scrollTo({ y: offset, animated: true });
      }
    },
    []
  );

  const handleRoomMatchSelect = useCallback(
    (id: string) => {
      setSelectedId(id);
      setExpandedIds((prev) => {
        const next = new Set(prev);
        next.add(id);
        return next;
      });
      setQuery('');
    },
    []
  );

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <View style={{ flex: 1, backgroundColor: '#030f09' }}>
      <ScrollView
        ref={scrollRef}
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <View
          style={{
            paddingTop: insets.top + 16,
            paddingHorizontal: 16,
            paddingBottom: 16,
            backgroundColor: '#030f09',
          }}
        >
          <Text
            style={{
              color: '#f0fdf4',
              fontFamily: 'Syne_700Bold',
              fontSize: 26,
              marginBottom: 2,
            }}
          >
            Campus Map
          </Text>
          <Text
            style={{
              color: '#4b8a6b',
              fontFamily: 'DMMono_400Regular',
              fontSize: 11,
              letterSpacing: 1,
              marginBottom: 16,
            }}
          >
            EMERALD HIGH SCHOOL • DUBLIN, CA
          </Text>

          {/* Search bar */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#0f2418',
              borderRadius: 12,
              borderWidth: 1,
              borderColor: query.length > 0 ? '#10b981' : '#1a3326',
              paddingHorizontal: 12,
              gap: 8,
            }}
          >
            <Ionicons name="search" size={16} color="#4b8a6b" />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search buildings or rooms…"
              placeholderTextColor="#4b8a6b"
              style={{
                flex: 1,
                color: '#f0fdf4',
                fontFamily: 'DMSans_400Regular',
                fontSize: 14,
                paddingVertical: 12,
              }}
              returnKeyType="search"
              clearButtonMode="while-editing"
            />
            {query.length > 0 && (
              <Pressable onPress={() => setQuery('')} hitSlop={8}>
                <Ionicons name="close-circle" size={18} color="#4b8a6b" />
              </Pressable>
            )}
          </View>
        </View>

        {/* ── SVG Map (hidden while searching) ──────────────────────────── */}
        {!isSearching && (
          <CampusSvgMap selectedId={selectedId} onSelect={handleSvgSelect} />
        )}

        {/* ── Section label ──────────────────────────────────────────────── */}
        {isSearching ? (
          <View style={{ paddingHorizontal: 16, marginBottom: 12 }}>
            <Text
              style={{
                color: '#4b8a6b',
                fontFamily: 'DMMono_400Regular',
                fontSize: 11,
                letterSpacing: 1,
              }}
            >
              {filteredBuildings.length + matchedRooms.length === 0
                ? 'NO RESULTS'
                : `${filteredBuildings.length} BUILDING${filteredBuildings.length !== 1 ? 'S' : ''} · ${matchedRooms.length} ROOM${matchedRooms.length !== 1 ? 'S' : ''}`}
            </Text>
          </View>
        ) : (
          <View style={{ paddingHorizontal: 16, marginBottom: 12 }}>
            <Text
              style={{
                color: '#4b8a6b',
                fontFamily: 'DMMono_400Regular',
                fontSize: 11,
                letterSpacing: 1,
              }}
            >
              ALL BUILDINGS
            </Text>
          </View>
        )}

        {/* ── Room matches (search only) ──────────────────────────────────── */}
        {isSearching && matchedRooms.length > 0 && (
          <View style={{ marginBottom: 16 }}>
            <View style={{ paddingHorizontal: 16, marginBottom: 8 }}>
              <Text
                style={{
                  color: '#4b8a6b',
                  fontFamily: 'DMMono_400Regular',
                  fontSize: 10,
                  letterSpacing: 1,
                }}
              >
                ROOM MATCHES
              </Text>
            </View>
            {matchedRooms.map((match) => (
              <RoomMatchCard
                key={`${match.building.id}-${match.room}`}
                match={match}
                onSelect={handleRoomMatchSelect}
              />
            ))}
            {filteredBuildings.length > 0 && (
              <View style={{ paddingHorizontal: 16, marginTop: 8, marginBottom: 8 }}>
                <Text
                  style={{
                    color: '#4b8a6b',
                    fontFamily: 'DMMono_400Regular',
                    fontSize: 10,
                    letterSpacing: 1,
                  }}
                >
                  BUILDING MATCHES
                </Text>
              </View>
            )}
          </View>
        )}

        {/* ── Building cards ──────────────────────────────────────────────── */}
        {filteredBuildings.length === 0 && matchedRooms.length === 0 ? (
          <View
            style={{
              alignItems: 'center',
              paddingTop: 40,
              paddingHorizontal: 32,
            }}
          >
            <Ionicons name="search-outline" size={40} color="#1a3326" />
            <Text
              style={{
                color: '#4b8a6b',
                fontFamily: 'DMSans_400Regular',
                fontSize: 14,
                textAlign: 'center',
                marginTop: 12,
              }}
            >
              No buildings or rooms match "{query.trim()}"
            </Text>
          </View>
        ) : (
          filteredBuildings.map((building) => (
            <View
              key={building.id}
              onLayout={(e) => {
                cardRefs.current[building.id] = e.nativeEvent.layout.y;
              }}
            >
              <BuildingCard
                building={building}
                isSelected={selectedId === building.id}
                isExpanded={expandedIds.has(building.id)}
                onPress={() => handleCardPress(building.id)}
              />
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}
