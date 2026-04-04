'use client';

import { useState, useRef, useCallback } from 'react';
import { staff } from '@/data/staff';

/* ─── Building data (matches ehsmap.pdf layout) ─────────────────────── */
interface Building {
  id: string;
  name: string;
  abbr: string;
  description: string;
  rooms: string[];
  color: string;
  x: number; y: number;
  w: number; h: number;
  shape?: 'oval';
}

const BUILDINGS: Building[] = [
  { id: 'parking-a', name: 'Parking Lot A', abbr: 'P-A', description: 'Main student & staff parking, front of campus.', rooms: [], color: '#94a3b8', x: 60, y: 20, w: 300, h: 40 },
  { id: 'parking-b', name: 'Parking Lot B', abbr: 'P-B', description: 'East side overflow parking.', rooms: [], color: '#94a3b8', x: 680, y: 160, w: 90, h: 190 },
  { id: 'admin', name: 'Building A – Administration', abbr: 'A', description: "Principal's office, VP offices, Main Office, Registrar, Attendance, College & Career Center, and Counseling suite.", rooms: ['Main Office', "Principal's Office", 'VP Office', 'Registrar', 'Attendance Office', 'College & Career Center', 'Counseling Office'], color: '#059669', x: 580, y: 75, w: 90, h: 75 },
  { id: 'cafeteria', name: 'Building D – Cafeteria & Student Union', abbr: 'D', description: 'Main cafeteria serving breakfast and lunch. Features indoor dining, outdoor patio, and the student union gathering space.', rooms: ['Cafeteria', 'Food Court', 'Outdoor Patio', 'Student Union'], color: '#f59e0b', x: 340, y: 75, w: 120, h: 75 },
  { id: 'library', name: 'Building E – Library & Resource Center', abbr: 'E', description: 'Learning resource center with computer lab, research databases, study rooms, and media collection.', rooms: ['Library', 'Media Center', 'Computer Lab', 'Study Rooms'], color: '#8b5cf6', x: 475, y: 75, w: 95, h: 75 },
  { id: 'vapa', name: 'Building C – Visual & Performing Arts', abbr: 'C', description: 'Art studios, photography lab, ceramics room, video production suite, and music rehearsal rooms.', rooms: ['Art Studio', 'Ceramics Room', 'Photography Lab', 'Video Production Suite', 'Music Room', 'Band Room', 'Orchestra Room'], color: '#ec4899', x: 60, y: 75, w: 130, h: 75 },
  { id: 'pac', name: 'Kuo Performing Arts Center', abbr: 'PAC', description: "State-of-the-art performing arts center. Home of EHS drama productions, concerts, and large assemblies.", rooms: ['Main Theater', 'Backstage', 'Green Room', 'Orchestra Pit', 'Drama Room'], color: '#db2777', x: 60, y: 165, w: 130, h: 85 },
  { id: 'bldg-f', name: 'Building F – Academic Tower 1', abbr: 'F', description: 'English and Social Science classrooms. Rooms 100–112 (English) and 150–156 (Social Science/History).', rooms: ['Room 100','Room 101','Room 102','Room 103','Room 104','Room 105','Room 106','Room 107','Room 108','Room 109','Room 110','Room 150','Room 151','Room 152','Room 153','Room 154','Room 155'], color: '#3b82f6', x: 205, y: 165, w: 140, h: 85 },
  { id: 'bldg-g', name: 'Building G – Academic Tower 2', abbr: 'G', description: 'Math, Computer Science, Science, Engineering, and World Language classrooms. Rooms 200–215, 250–260, 300–310.', rooms: ['Room 200','Room 201','Room 202','Room 203','Room 204','Room 205','Room 206','Room 207','Room 208','Room 209','Room 210','Room 214','Room 215','Room 250','Room 251','Room 252','Room 253','Room 254','Room 255','Room 256','Room 300','Room 301','Room 302','Room 303','Room 304','Room 305','Room 306','Room 307','Room 308','Room 309'], color: '#2563eb', x: 360, y: 165, w: 140, h: 85 },
  { id: 'quad', name: 'Main Quad', abbr: 'QD', description: 'Central gathering space for students during break and lunch. Hosts assemblies and outdoor events.', rooms: ['Main Quad'], color: '#22c55e', x: 205, y: 75, w: 125, h: 75 },
  { id: 'gym', name: 'Building M – Gymnasium', abbr: 'M', description: 'Full-size gymnasium for basketball, volleyball, and large-group PE. Home of Shamrocks home games and school assemblies.', rooms: ['Main Gym', 'Dance Studio', 'Wrestling Room', 'Athletic Training Room'], color: '#f97316', x: 590, y: 270, w: 90, h: 75 },
  { id: 'locker', name: 'Building L – Locker & Weight Rooms', abbr: 'L', description: 'Boys and girls locker rooms, weight room, and strength & conditioning facility.', rooms: ['Boys Locker Room', 'Girls Locker Room', 'Weight Room', 'Strength & Conditioning'], color: '#ea580c', x: 590, y: 165, w: 90, h: 95 },
  { id: 'tennis', name: 'Tennis Courts', abbr: 'TC', description: '6 full-size tennis courts used for PE and EHS tennis team practices and matches.', rooms: ['Court 1','Court 2','Court 3','Court 4','Court 5','Court 6'], color: '#4ade80', x: 60, y: 365, w: 130, h: 85 },
  { id: 'stadium', name: 'EHS Stadium & Athletic Fields', abbr: 'STD', description: 'Football/soccer field with track, bleachers, and press box. Home of EHS Shamrocks home games and track & field.', rooms: ['Football Field', 'Track', 'Soccer Field', 'Bleachers', 'Concession Stand'], color: '#16a34a', x: 205, y: 365, w: 370, h: 95, shape: 'oval' },
  { id: 'wellness', name: 'Wellness Center', abbr: 'WC', description: 'Student mental health and wellness support. Drop-in welcome. Houses school psychologists and wellness counselors.', rooms: ['Wellness Center', 'Counselor Office', 'Private Session Room'], color: '#06b6d4', x: 510, y: 270, w: 70, h: 80 },
];

const MAP_W = 790;
const MAP_H = 475;

function findBuildingForStaff(s: typeof staff[0]): Building | null {
  const q = s.room.toLowerCase();
  for (const b of BUILDINGS) {
    if (b.rooms.some(r => r.toLowerCase().includes(q) || q.includes(r.toLowerCase()))) return b;
  }
  const num = parseInt(s.room.replace(/\D/g, ''));
  if (!isNaN(num)) {
    if (num >= 100 && num < 200) return BUILDINGS.find(b => b.id === 'bldg-f') || null;
    if (num >= 200 && num < 400) return BUILDINGS.find(b => b.id === 'bldg-g') || null;
  }
  const deptMap: Record<string, string> = {
    'Administration': 'admin', 'Office': 'admin', 'Counseling': 'admin',
    'Math': 'bldg-g', 'Computer Science': 'bldg-g', 'Engineering': 'bldg-g',
    'Science': 'bldg-g', 'World Language': 'bldg-g',
    'English': 'bldg-f', 'Social Science': 'bldg-f',
    'Arts': 'vapa', 'Performing Arts': 'pac',
    'PE': 'gym', 'Athletics': 'gym', 'Health': 'gym',
    'Culinary': 'cafeteria',
    'Special Education': 'wellness', 'Wellness': 'wellness',
    'Support': 'admin',
  };
  const bid = deptMap[s.department];
  return bid ? (BUILDINGS.find(b => b.id === bid) || null) : null;
}

export default function CampusMap() {
  const [selected, setSelected] = useState<Building | null>(null);
  const [origin, setOrigin] = useState<Building | null>(null);
  const [destination, setDestination] = useState<Building | null>(null);
  const [staffQuery, setStaffQuery] = useState('');
  const [staffResults, setStaffResults] = useState<typeof staff>([]);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, px: 0, py: 0 });
  const [mode, setMode] = useState<'explore' | 'wayfind'>('explore');
  const [wayfindStep, setWayfindStep] = useState<'from' | 'to' | 'done'>('from');

  const handleStaffSearch = (val: string) => {
    setStaffQuery(val);
    if (!val.trim()) { setStaffResults([]); return; }
    const q = val.toLowerCase();
    setStaffResults(
      staff.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.department.toLowerCase().includes(q) ||
        s.room.toLowerCase().includes(q) ||
        s.subjects.some(sub => sub.toLowerCase().includes(q))
      ).slice(0, 6)
    );
  };

  const handleBuildingClick = (b: Building) => {
    if (mode === 'explore') {
      setSelected(prev => prev?.id === b.id ? null : b);
    } else {
      if (wayfindStep === 'from') { setOrigin(b); setWayfindStep('to'); }
      else if (wayfindStep === 'to') { setDestination(b); setWayfindStep('done'); }
      else { setOrigin(b); setDestination(null); setWayfindStep('to'); }
    }
  };

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    setZoom(z => Math.min(3, Math.max(0.5, z - e.deltaY * 0.001)));
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY, px: pan.x, py: pan.y };
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return;
    setPan({ x: dragStart.current.px + (e.clientX - dragStart.current.x), y: dragStart.current.py + (e.clientY - dragStart.current.y) });
  };
  const handleMouseUp = () => setDragging(false);

  const resetWayfind = () => { setOrigin(null); setDestination(null); setWayfindStep('from'); };

  function arrowPath(a: Building, b: Building) {
    const ax = a.x + a.w / 2, ay = a.y + a.h / 2;
    const bx = b.x + b.w / 2, by = b.y + b.h / 2;
    const mx = (ax + bx) / 2, my = (ay + by) / 2 - 28;
    return `M ${ax} ${ay} Q ${mx} ${my} ${bx} ${by}`;
  }

  const LEGEND = [
    { color: '#059669', label: 'Admin' },
    { color: '#3b82f6', label: 'Academic' },
    { color: '#8b5cf6', label: 'Library' },
    { color: '#f97316', label: 'Athletics' },
    { color: '#f59e0b', label: 'Cafeteria' },
    { color: '#ec4899', label: 'Arts/PAC' },
    { color: '#06b6d4', label: 'Wellness' },
    { color: '#22c55e', label: 'Fields' },
  ];

  return (
    <div className="min-h-screen py-8 px-4" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-5 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xl shadow-lg"
              style={{ background: 'linear-gradient(135deg, #059669, #3b82f6)' }}>📍</div>
            <div>
              <h1 className="font-syne font-bold text-2xl" style={{ color: 'var(--text-primary)' }}>Campus Map</h1>
              <p className="font-dm-sans text-sm" style={{ color: 'var(--text-muted)' }}>
                Interactive EHS campus · Find buildings, rooms & teachers
              </p>
            </div>
          </div>
        </div>

        {/* Mode tabs */}
        <div className="flex gap-2 mb-5">
          {[{ id: 'explore' as const, icon: '🗺', label: 'Explore' }, { id: 'wayfind' as const, icon: '🧭', label: 'Wayfinding' }].map(m => (
            <button key={m.id}
              onClick={() => { setMode(m.id); resetWayfind(); setSelected(null); }}
              className="px-4 py-2 rounded-xl font-dm-sans text-sm font-medium transition-all duration-200 hover:scale-105"
              style={{
                background: mode === m.id ? 'linear-gradient(135deg,#059669,#3b82f6)' : 'var(--bg-card)',
                color: mode === m.id ? 'white' : 'var(--text-primary)',
                border: '1px solid var(--border-light)',
                boxShadow: mode === m.id ? '0 4px 15px rgba(5,150,105,0.3)' : undefined,
              }}>
              {m.icon} {m.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl overflow-hidden shadow-2xl border" style={{ border: '1px solid rgba(255,255,255,0.08)', background: '#0d1a10' }}>
              {/* Toolbar */}
              <div className="flex items-center justify-between px-4 py-2.5 border-b" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500/60" />
                  <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
                  <div className="w-2 h-2 rounded-full bg-green-500/60" />
                  <span className="ml-2 font-dm-mono text-[11px] text-white/30">EHS CAMPUS · DUBLIN, CA</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => setZoom(z => Math.min(3, z + 0.25))}
                    className="w-7 h-7 rounded-lg bg-white/8 text-white/60 hover:bg-white/15 text-base font-bold flex items-center justify-center transition-all">+</button>
                  <span className="font-dm-mono text-[11px] text-white/40 w-11 text-center">{Math.round(zoom * 100)}%</span>
                  <button onClick={() => setZoom(z => Math.max(0.5, z - 0.25))}
                    className="w-7 h-7 rounded-lg bg-white/8 text-white/60 hover:bg-white/15 text-base font-bold flex items-center justify-center transition-all">−</button>
                  <button onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
                    className="px-2.5 h-7 rounded-lg bg-white/8 text-white/50 hover:bg-white/15 text-[11px] font-dm-mono transition-all">↺ Reset</button>
                </div>
              </div>

              {/* SVG viewport */}
              <div
                className="relative overflow-hidden select-none"
                style={{ height: 440, cursor: dragging ? 'grabbing' : 'grab' }}
                onWheel={handleWheel}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                <svg
                  viewBox={`0 0 ${MAP_W} ${MAP_H}`}
                  style={{
                    width: '100%', height: '100%',
                    transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
                    transformOrigin: 'center',
                    transition: dragging ? 'none' : 'transform 0.15s ease-out',
                  }}
                >
                  <defs>
                    <filter id="bldg-glow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="4" result="blur" />
                      <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                    <filter id="bldg-shadow">
                      <feDropShadow dx="1" dy="2" stdDeviation="3" floodOpacity="0.5" />
                    </filter>
                    <marker id="arrowhead" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                      <path d="M0,0 L0,6 L8,3 z" fill="#10b981" />
                    </marker>
                  </defs>

                  {/* Ground */}
                  <rect x="0" y="0" width={MAP_W} height={MAP_H} fill="#0d1a10" />
                  {/* Campus boundary */}
                  <rect x="48" y="12" width="724" height={MAP_H - 22} rx="10" fill="#132318" stroke="#1d3a23" strokeWidth="1.5" />

                  {/* Walkways */}
                  {[
                    [48, 162, 772, 162], [48, 260, 772, 260], [48, 358, 772, 358],
                    [194, 12, 194, MAP_H - 10], [338, 12, 338, MAP_H - 10],
                    [482, 12, 482, MAP_H - 10], [580, 12, 580, MAP_H - 10],
                  ].map(([x1, y1, x2, y2], i) => (
                    <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#1a3320" strokeWidth="12" strokeLinecap="round" />
                  ))}

                  {/* Buildings */}
                  {BUILDINGS.map(b => {
                    const isSel = selected?.id === b.id;
                    const isOrg = origin?.id === b.id;
                    const isDst = destination?.id === b.id;
                    const lit = isSel || isOrg || isDst;
                    const cx = b.x + b.w / 2, cy = b.y + b.h / 2;
                    const isPark = b.id.startsWith('parking');

                    if (isPark) return (
                      <rect key={b.id} x={b.x} y={b.y} width={b.w} height={b.h} rx="3"
                        fill="#1e293b" stroke="#334155" strokeWidth="0.75"
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleBuildingClick(b)}
                      />
                    );

                    return (
                      <g key={b.id}
                        filter={lit ? 'url(#bldg-glow)' : 'url(#bldg-shadow)'}
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleBuildingClick(b)}>
                        {b.shape === 'oval' ? (
                          <ellipse cx={cx} cy={cy} rx={b.w / 2} ry={b.h / 2}
                            fill={lit ? b.color + '35' : b.color + '20'}
                            stroke={b.color} strokeWidth={lit ? 2.5 : 1.5}
                            strokeDasharray={lit ? undefined : '5 3'} />
                        ) : (
                          <>
                            <rect x={b.x} y={b.y} width={b.w} height={b.h} rx="7"
                              fill={lit ? b.color + '38' : b.color + '22'}
                              stroke={b.color} strokeWidth={lit ? 2.5 : 1.5} />
                            {lit && (
                              <rect x={b.x - 4} y={b.y - 4} width={b.w + 8} height={b.h + 8} rx="11"
                                fill="none" stroke={isOrg ? '#10b981' : isDst ? '#3b82f6' : b.color}
                                strokeWidth="1.5" opacity="0.5" strokeDasharray="4 3" />
                            )}
                          </>
                        )}
                        {/* Abbr */}
                        <text x={cx} y={cy - 5} textAnchor="middle" fill="white"
                          fontSize="11" fontWeight="800" fontFamily="var(--font-syne),sans-serif"
                          style={{ pointerEvents: 'none', filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.9))' }}>
                          {b.abbr}
                        </text>
                        {/* Sub label */}
                        <text x={cx} y={cy + 9} textAnchor="middle" fill="rgba(255,255,255,0.55)"
                          fontSize="6.5" fontFamily="var(--font-dm-sans),sans-serif"
                          style={{ pointerEvents: 'none' }}>
                          {b.name.split('–').pop()?.trim().split(' ').slice(0, 2).join(' ')}
                        </text>
                        {/* Badges */}
                        {isOrg && <circle cx={b.x + b.w - 9} cy={b.y + 9} r="8" fill="#10b981" />}
                        {isDst && <circle cx={b.x + b.w - 9} cy={b.y + 9} r="8" fill="#3b82f6" />}
                        {isOrg && <text x={b.x + b.w - 9} y={b.y + 12} textAnchor="middle" fill="white" fontSize="8" fontWeight="bold" style={{ pointerEvents: 'none' }}>A</text>}
                        {isDst && <text x={b.x + b.w - 9} y={b.y + 12} textAnchor="middle" fill="white" fontSize="8" fontWeight="bold" style={{ pointerEvents: 'none' }}>B</text>}
                      </g>
                    );
                  })}

                  {/* Route arrow */}
                  {origin && destination && (
                    <path d={arrowPath(origin, destination)}
                      fill="none" stroke="#10b981" strokeWidth="3"
                      strokeDasharray="10 5" markerEnd="url(#arrowhead)"
                      opacity="0.9" />
                  )}

                  {/* Compass rose */}
                  <g transform={`translate(${MAP_W - 38}, ${MAP_H - 38})`}>
                    <circle r="16" fill="rgba(0,0,0,0.55)" />
                    <text y="-4" textAnchor="middle" fill="white" fontSize="8" fontWeight="700">N</text>
                    <line y1="-2" y2="2" stroke="white" strokeWidth="1.5" />
                    <line x1="-2" x2="2" stroke="white" strokeWidth="1" opacity="0.4" />
                  </g>
                </svg>
              </div>

              {/* Legend */}
              <div className="px-4 py-2.5 flex flex-wrap gap-x-4 gap-y-1.5 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                {LEGEND.map(l => (
                  <div key={l.label} className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-sm" style={{ background: l.color }} />
                    <span className="font-dm-mono text-[10px] text-white/40">{l.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Wayfinding */}
            {mode === 'wayfind' && (
              <div className="rounded-2xl p-4 border animate-fade-in"
                style={{ background: 'var(--bg-card)', borderColor: 'var(--border-light)' }}>
                <h3 className="font-syne font-bold text-sm mb-3" style={{ color: 'var(--text-primary)' }}>
                  🧭 Get Directions
                </h3>
                <div className="space-y-2 mb-3">
                  {[
                    { step: 'from' as const, label: 'Start', color: '#10b981', badge: 'A', val: origin, prompt: wayfindStep === 'from' ? '← Tap a building' : 'Not set' },
                    { step: 'to' as const, label: 'Destination', color: '#3b82f6', badge: 'B', val: destination, prompt: wayfindStep === 'to' ? '← Tap a building' : 'Not set' },
                  ].map(({ step, color, badge, val, prompt }) => (
                    <div key={step}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all"
                      style={{
                        background: 'var(--bg-secondary)',
                        border: `1px solid ${wayfindStep === step ? color + '60' : 'var(--border-light)'}`,
                        boxShadow: wayfindStep === step ? `0 0 0 2px ${color}30` : undefined,
                      }}>
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0"
                        style={{ background: color }}>
                        {badge}
                      </div>
                      <span className="font-dm-sans text-xs" style={{ color: val ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                        {val ? val.name.split('–').pop()?.trim() : prompt}
                      </span>
                    </div>
                  ))}
                </div>
                {wayfindStep === 'done' && origin && destination && (
                  <div className="p-3 rounded-xl mb-3"
                    style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)' }}>
                    <p className="font-dm-sans text-xs font-bold text-emerald-500 mb-0.5">Route plotted ✓</p>
                    <p className="font-dm-sans text-xs" style={{ color: 'var(--text-secondary)' }}>
                      {origin.abbr} → {destination.abbr} · Follow the green dashed line on the map
                    </p>
                  </div>
                )}
                <button onClick={resetWayfind}
                  className="w-full py-2 rounded-xl text-xs font-dm-sans font-medium transition-all hover:bg-red-500/10"
                  style={{ color: '#f87171', border: '1px solid rgba(248,113,113,0.2)' }}>
                  Reset route
                </button>
              </div>
            )}

            {/* Staff/Room search */}
            <div className="rounded-2xl p-4 border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-light)' }}>
              <h3 className="font-syne font-bold text-sm mb-2.5" style={{ color: 'var(--text-primary)' }}>
                🔍 Find Teacher or Room
              </h3>
              <input
                value={staffQuery}
                onChange={e => handleStaffSearch(e.target.value)}
                placeholder="Search name, room, subject…"
                className="w-full px-3 py-2.5 rounded-xl text-sm font-dm-sans outline-none"
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-light)',
                  color: 'var(--text-primary)',
                }}
              />
              {staffResults.length > 0 && (
                <div className="mt-2 space-y-1.5 max-h-72 overflow-y-auto">
                  {staffResults.map(s => {
                    const b = findBuildingForStaff(s);
                    return (
                      <button key={s.id}
                        onClick={() => {
                          if (b) {
                            if (mode === 'explore') setSelected(b);
                            else handleBuildingClick(b);
                          }
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all hover:scale-[1.01]"
                        style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-light)' }}>
                        <div className="w-8 h-8 rounded-full flex-shrink-0 overflow-hidden"
                          style={{ border: `2px solid ${b?.color || '#4b5563'}` }}>
                          {s.photoUrl
                            ? <img src={s.photoUrl} alt={s.name} className="w-full h-full object-cover" />
                            : <div className="w-full h-full flex items-center justify-center text-[10px] font-bold"
                                style={{ background: (b?.color || '#4b5563') + '22', color: b?.color || 'var(--text-muted)' }}>
                                {s.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                              </div>
                          }
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-dm-sans text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                            {s.name}
                          </p>
                          <p className="font-dm-mono text-[10px]" style={{ color: 'var(--text-muted)' }}>
                            {s.room} · {b ? b.abbr : s.department}
                          </p>
                        </div>
                        {b && <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: b.color }} />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Selected building detail */}
            {selected ? (
              <div className="rounded-2xl p-4 border animate-fade-in-scale"
                style={{ background: 'var(--bg-card)', borderColor: selected.color + '50' }}>
                <div className="flex items-start justify-between mb-2.5">
                  <div>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-dm-mono font-bold mb-1.5"
                      style={{ background: selected.color + '20', color: selected.color }}>
                      BLDG {selected.abbr}
                    </span>
                    <h3 className="font-syne font-bold text-sm leading-snug" style={{ color: 'var(--text-primary)' }}>
                      {selected.name}
                    </h3>
                  </div>
                  <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-300 transition-colors ml-2 text-base leading-none">✕</button>
                </div>
                <p className="font-dm-sans text-xs leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>
                  {selected.description}
                </p>
                {selected.rooms.length > 0 && (
                  <>
                    <p className="font-dm-mono text-[10px] tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>ROOMS & SPACES</p>
                    <div className="flex flex-wrap gap-1.5">
                      {selected.rooms.map(r => (
                        <span key={r} className="px-2 py-0.5 rounded-lg text-[10px] font-dm-sans"
                          style={{ background: selected.color + '15', color: selected.color, border: `1px solid ${selected.color}30` }}>
                          {r}
                        </span>
                      ))}
                    </div>
                  </>
                )}
                {mode === 'wayfind' && (
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <button onClick={() => { setOrigin(selected); setWayfindStep('to'); }}
                      className="py-1.5 rounded-xl text-xs font-dm-sans font-medium text-white transition-all hover:opacity-90"
                      style={{ background: '#059669' }}>Set as Start</button>
                    <button onClick={() => { setDestination(selected); if (origin) setWayfindStep('done'); }}
                      className="py-1.5 rounded-xl text-xs font-dm-sans font-medium text-white transition-all hover:opacity-90"
                      style={{ background: '#3b82f6' }}>Set as End</button>
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-2xl p-4 border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-light)' }}>
                <h3 className="font-syne font-bold text-sm mb-2.5" style={{ color: 'var(--text-primary)' }}>How to use</h3>
                <ul className="space-y-2">
                  {[
                    ['🖱', 'Click any building on the map to see details'],
                    ['🔍', 'Search a teacher\'s name to jump to their building'],
                    ['🧭', 'Switch to Wayfinding for A→B directions'],
                    ['🖐', 'Scroll to zoom · drag to pan the map'],
                  ].map(([icon, text]) => (
                    <li key={text} className="flex gap-2 font-dm-sans text-xs" style={{ color: 'var(--text-secondary)' }}>
                      <span>{icon}</span><span>{text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* All buildings grid */}
        <div className="mt-8">
          <h2 className="font-syne font-bold text-lg mb-4" style={{ color: 'var(--text-primary)' }}>
            All Buildings & Locations
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
            {BUILDINGS.filter(b => !b.id.startsWith('parking')).map(b => (
              <button key={b.id}
                onClick={() => { setSelected(b); setMode('explore'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="text-left p-3 rounded-xl border transition-all duration-200 hover:scale-[1.02]"
                style={{
                  background: selected?.id === b.id ? b.color + '15' : 'var(--bg-card)',
                  borderColor: selected?.id === b.id ? b.color + '55' : 'var(--border-light)',
                }}>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: b.color }} />
                  <span className="font-syne font-bold text-xs" style={{ color: 'var(--text-primary)' }}>{b.abbr}</span>
                </div>
                <p className="font-dm-sans text-[10px] leading-snug" style={{ color: 'var(--text-muted)' }}>
                  {b.name.split('–').pop()?.trim().split(' ').slice(0, 3).join(' ')}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
