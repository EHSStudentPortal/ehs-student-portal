export interface Building {
  id: string;
  name: string;
  abbreviation: string;
  description: string;
  rooms: string[];
  color: string;
  x: number;
  y: number;
  width: number;
  height: number;
  shape?: 'rect' | 'oval'; // default rect
}

export interface MapPath {
  id: string;
  d: string; // SVG path
  label: string;
}

export const mapWidth: number = 800;
export const mapHeight: number = 600;

export const buildings: Building[] = [
  // ── PARKING LOT A – front/top strip ──────────────────────────────────────
  {
    id: 'parking-a',
    name: 'Parking Lot A',
    abbreviation: 'P-A',
    description: 'Main student and visitor parking lot at the front entrance of campus.',
    rooms: [],
    color: '#6b7280',
    x: 60,
    y: 10,
    width: 400,
    height: 45,
  },

  // ── BUILDING A – Administration & Counseling (top-right) ──────────────────
  {
    id: 'building-a',
    name: 'Building A – Administration & Counseling',
    abbreviation: 'A',
    description:
      "Houses the main office, principal's office, and full counseling center for academic and college advising.",
    rooms: [
      'Main Office',
      "Principal's Office",
      "Assistant Principal's Office",
      'Counseling Office',
      'College & Career Center',
      'Attendance Office',
      "Nurse's Office",
    ],
    color: '#059669',
    x: 555,
    y: 15,
    width: 200,
    height: 80,
  },

  // ── BUILDING D – Student Union & Cafeteria (top-center) ────────────────────
  {
    id: 'building-d',
    name: 'Building D – Student Union & Cafeteria',
    abbreviation: 'D',
    description:
      'Central campus hub featuring the cafeteria, food court, student lounge, and outdoor patio.',
    rooms: ['Cafeteria', 'Food Court', 'Outdoor Patio', 'Student Lounge'],
    color: '#f59e0b',
    x: 305,
    y: 65,
    width: 185,
    height: 65,
  },

  // ── BUILDING C – VAPA (left/west side) ────────────────────────────────────
  {
    id: 'building-c',
    name: 'Building C – Visual & Performing Arts (VAPA)',
    abbreviation: 'C',
    description:
      'Home to the visual art studios, band, orchestra, drama, and dance programs.',
    rooms: [
      'Band Room',
      'Orchestra Room',
      'Drama Room',
      'Dance Studio',
      'Visual Art Studio',
      'Ceramics Room',
      'Photography Lab',
    ],
    color: '#ec4899',
    x: 25,
    y: 145,
    width: 140,
    height: 100,
  },

  // ── CATHERINE C. KUO PERFORMING ARTS CENTER (west, below VAPA) ────────────
  {
    id: 'pac',
    name: 'Catherine C. Kuo Performing Arts Center',
    abbreviation: 'PAC',
    description:
      'State-of-the-art performing arts venue hosting concerts, plays, dance shows, and major school events.',
    rooms: [
      'Performing Arts Center (Main Hall)',
      'Backstage',
      'Green Room',
      'Costume Room',
      'Box Office',
    ],
    color: '#ec4899',
    x: 25,
    y: 265,
    width: 140,
    height: 95,
  },

  // ── BUILDING F – Academic Tower 1 (100s-200s, center-left) ────────────────
  {
    id: 'building-f',
    name: 'Building F – Academic Tower 1',
    abbreviation: 'F',
    description:
      'Multi-story academic building housing 100-series (English/History) and 200-series (Math/CS) classrooms.',
    rooms: [
      'Room 100',
      'Room 101',
      'Room 102',
      'Room 103',
      'Room 104',
      'Room 105',
      'Room 106',
      'Room 107',
      'Room 108',
      'Room 109',
      'Room 110',
      'Room 111',
      'Room 112',
      'Room 113',
      'Room 114',
      'Room 115',
      'Room 150',
      'Room 151',
      'Room 152',
      'Room 153',
      'Room 154',
      'Room 155',
      'Room 200',
      'Room 201',
      'Room 202',
      'Room 203',
      'Room 204',
      'Room 205',
      'Room 206',
      'Room 207',
      'Room 208',
      'Room 209',
      'Room 210',
      'Room 211',
      'Room 212',
      'Room 213',
      'Room 250',
      'Room 251',
      'Room 252',
      'Room 253',
      'Room 254',
    ],
    color: '#3b82f6',
    x: 210,
    y: 150,
    width: 155,
    height: 135,
  },

  // ── BUILDING G – Academic Tower 2 (300s, center) ──────────────────────────
  {
    id: 'building-g',
    name: 'Building G – Academic Tower 2',
    abbreviation: 'G',
    description:
      'Multi-story academic building housing 300-series (Science) classrooms with fully equipped labs.',
    rooms: [
      'Room 300',
      'Room 301',
      'Room 302',
      'Room 303',
      'Room 304',
      'Room 305',
      'Room 306',
      'Room 307',
      'Room 308',
      'Room 309',
      'Room 310',
      'Room 311',
      'Room 312',
      'Room 313',
      'Room 314',
      'Room 315',
      'Room 316',
      'Room 317',
      'Room 350',
      'Room 351',
      'Room 352',
      'Room 353',
      'Room 354',
      'Room 355',
    ],
    color: '#3b82f6',
    x: 390,
    y: 150,
    width: 140,
    height: 135,
  },

  // ── BUILDING E – Library & Resource Center (center-right) ─────────────────
  {
    id: 'building-e',
    name: 'Building E – Library & Resource Center',
    abbreviation: 'E',
    description:
      'Library, media center, and computer labs for student research, study, and digital learning.',
    rooms: [
      'Library / Media Center',
      'Computer Lab',
      'Study Hall',
      'Makerspace',
      'Reading Room',
    ],
    color: '#8b5cf6',
    x: 550,
    y: 140,
    width: 160,
    height: 100,
  },

  // ── BUILDING M – Gymnasium (right side) ───────────────────────────────────
  {
    id: 'building-m',
    name: 'Building M – Gymnasium',
    abbreviation: 'M',
    description:
      'Full-size gymnasium for P.E., basketball, volleyball, wrestling, and school assemblies.',
    rooms: ['Main Gym', 'Wrestling Room', 'Dance Studio', 'P.E. Office'],
    color: '#f97316',
    x: 550,
    y: 265,
    width: 160,
    height: 110,
  },

  // ── BUILDING L – Locker & Weight Rooms (right, adjacent to gym) ───────────
  {
    id: 'building-l',
    name: 'Building L – Locker & Weight Rooms',
    abbreviation: 'L',
    description:
      'Locker rooms and weight/fitness facilities directly adjacent to the gymnasium.',
    rooms: [
      'Boys Locker Room',
      'Girls Locker Room',
      'Weight Room',
      'Athletic Training Room',
    ],
    color: '#f97316',
    x: 550,
    y: 395,
    width: 160,
    height: 80,
  },

  // ── PARKING LOT B – right/east side ──────────────────────────────────────
  {
    id: 'parking-b',
    name: 'Parking Lot B',
    abbreviation: 'P-B',
    description: 'Secondary parking lot on the east side of campus, adjacent to the gym.',
    rooms: [],
    color: '#6b7280',
    x: 725,
    y: 140,
    width: 65,
    height: 340,
  },

  // ── STADIUM – large oval, center-bottom ───────────────────────────────────
  {
    id: 'stadium',
    name: 'Stadium',
    abbreviation: 'STD',
    description:
      'Main athletic stadium with a 400m running track, football/soccer field, and bleachers for home and away fans.',
    rooms: [
      'Football / Soccer Field',
      'Running Track',
      'Home Bleachers',
      'Away Bleachers',
      'Press Box',
      'Concession Stand',
    ],
    color: '#22c55e',
    x: 175,
    y: 390,
    width: 350,
    height: 185,
    shape: 'oval',
  },

  // ── TENNIS COURTS – bottom-left ───────────────────────────────────────────
  {
    id: 'tennis-courts',
    name: 'Tennis Courts',
    abbreviation: 'TC',
    description: 'Six hard-surface courts used for P.E. classes and the EHS tennis team.',
    rooms: [
      'Court 1',
      'Court 2',
      'Court 3',
      'Court 4',
      'Court 5',
      'Court 6',
    ],
    color: '#22c55e',
    x: 30,
    y: 385,
    width: 120,
    height: 190,
  },
];

// ── Helper: find building by room number or keyword string ───────────────────
//
// Usage examples:
//   findBuildingForRoom('Room 150')   → Building F
//   findBuildingForRoom('300')        → Building G
//   findBuildingForRoom('cafeteria')  → Building D
//   findBuildingForRoom('Mrs. Smith – Room 210') → Building F

export function findBuildingForRoom(roomOrTeacher: string): Building | null {
  const normalized = roomOrTeacher.trim().toLowerCase();

  // 1. Direct full-string match against every room entry
  for (const building of buildings) {
    for (const room of building.rooms) {
      if (room.toLowerCase() === normalized) return building;
      // Compare with "room " prefix stripped from both sides
      const roomNum = room.toLowerCase().replace(/^room\s*/, '');
      const queryNum = normalized.replace(/^room\s*/, '');
      if (roomNum === queryNum) return building;
    }
  }

  // 2. Extract a three-digit number and use range heuristic
  const numMatch = normalized.match(/\b([1-9]\d{2})\b/);
  if (numMatch) {
    const num = parseInt(numMatch[1], 10);
    if (num >= 100 && num <= 299) {
      return buildings.find((b) => b.id === 'building-f') ?? null;
    }
    if (num >= 300 && num <= 399) {
      return buildings.find((b) => b.id === 'building-g') ?? null;
    }
  }

  // 3. Keyword / phrase fallback (longest-match wins via ordering)
  const keywordMap: Array<[string, string]> = [
    ['main office', 'building-a'],
    ['assistant principal', 'building-a'],
    ['principal', 'building-a'],
    ['counseling', 'building-a'],
    ['college & career', 'building-a'],
    ['attendance', 'building-a'],
    ['administration', 'building-a'],
    ['nurse', 'building-a'],
    ['admin', 'building-a'],
    ['library', 'building-e'],
    ['media center', 'building-e'],
    ['computer lab', 'building-e'],
    ['makerspace', 'building-e'],
    ['main gym', 'building-m'],
    ['gymnasium', 'building-m'],
    ['wrestling', 'building-m'],
    ['gym', 'building-m'],
    ['cafeteria', 'building-d'],
    ['food court', 'building-d'],
    ['student union', 'building-d'],
    ['patio', 'building-d'],
    ['performing arts center', 'pac'],
    ['backstage', 'pac'],
    ['green room', 'pac'],
    ['kuo', 'pac'],
    ['pac', 'pac'],
    ['band', 'building-c'],
    ['orchestra', 'building-c'],
    ['drama', 'building-c'],
    ['ceramics', 'building-c'],
    ['photography', 'building-c'],
    ['visual art', 'building-c'],
    ['vapa', 'building-c'],
    ['dance studio', 'building-c'],
    ['boys locker', 'building-l'],
    ['girls locker', 'building-l'],
    ['locker', 'building-l'],
    ['weight room', 'building-l'],
    ['athletic training', 'building-l'],
    ['football', 'stadium'],
    ['bleachers', 'stadium'],
    ['press box', 'stadium'],
    ['running track', 'stadium'],
    ['stadium', 'stadium'],
    ['track', 'stadium'],
    ['field', 'stadium'],
    ['court', 'tennis-courts'],
    ['tennis', 'tennis-courts'],
    ['parking lot b', 'parking-b'],
    ['parking lot a', 'parking-a'],
    ['parking', 'parking-a'],
  ];

  for (const [keyword, buildingId] of keywordMap) {
    if (normalized.includes(keyword)) {
      return buildings.find((b) => b.id === buildingId) ?? null;
    }
  }

  return null;
}
