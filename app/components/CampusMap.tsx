'use client';

import { useState, useRef, useCallback } from 'react';
import { buildings, type Building } from '@/data/map';

export default function CampusMap() {
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  }, [pan]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => setIsDragging(false), []);

  const resetView = () => { setZoom(1); setPan({ x: 0, y: 0 }); };
  const zoomIn  = () => setZoom(z => Math.min(z + 0.25, 3));
  const zoomOut = () => setZoom(z => Math.max(z - 0.25, 0.4));

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setZoom(z => Math.max(0.4, Math.min(3, z - e.deltaY * 0.001)));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #d97706, #f59e0b)' }}
            >
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <span className="font-dm-mono text-xs tracking-widest uppercase" style={{ color: '#d97706' }}>
              Interactive
            </span>
          </div>
          <h1 className="font-syne font-black text-3xl sm:text-4xl" style={{ color: 'var(--text-primary)' }}>
            Campus Map
          </h1>
          <p className="font-dm-sans text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            Click any building for details · Drag to pan · Scroll to zoom
          </p>
        </div>

        {/* Zoom controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={zoomOut}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold border transition-all hover:scale-105"
            style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-light)', color: 'var(--text-primary)' }}
          >
            −
          </button>
          <div
            className="flex items-center justify-center rounded-xl border px-4 h-10 font-dm-mono text-sm"
            style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-light)', color: 'var(--text-muted)', minWidth: 70 }}
          >
            {Math.round(zoom * 100)}%
          </div>
          <button
            onClick={zoomIn}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold border transition-all hover:scale-105"
            style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-light)', color: 'var(--text-primary)' }}
          >
            +
          </button>
          <button
            onClick={resetView}
            className="px-4 h-10 rounded-xl flex items-center justify-center border text-sm font-dm-mono transition-all hover:scale-105"
            style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-light)', color: 'var(--text-muted)' }}
          >
            Reset
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Map container */}
        <div
          ref={containerRef}
          className="flex-1 rounded-2xl overflow-hidden border relative"
          style={{
            minHeight: 520,
            cursor: isDragging ? 'grabbing' : 'grab',
            background: 'linear-gradient(135deg, #e8f5ee 0%, #dbeafe 100%)',
            borderColor: 'var(--border-light)',
            boxShadow: 'var(--shadow-md)',
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
        >
          {/* Zoom indicator */}
          <div
            className="absolute top-3 left-3 z-10 px-3 py-1.5 rounded-lg text-xs font-dm-mono border"
            style={{ background: 'rgba(255,255,255,0.9)', borderColor: 'rgba(0,0,0,0.1)', color: '#374151' }}
          >
            {Math.round(zoom * 100)}% zoom
          </div>

          <svg
            viewBox="0 0 750 620"
            style={{
              width: '100%',
              height: '100%',
              minHeight: 520,
              transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
              transformOrigin: 'center center',
              transition: isDragging ? 'none' : 'transform 0.2s ease',
            }}
          >
            {/* Campus ground */}
            <defs>
              <linearGradient id="groundGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#ecfdf5', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#dbeafe', stopOpacity: 1 }} />
              </linearGradient>
              <filter id="shadow">
                <feDropShadow dx="2" dy="3" stdDeviation="4" floodColor="rgba(0,0,0,0.12)" />
              </filter>
            </defs>

            <rect x="0" y="0" width="750" height="620" fill="url(#groundGrad)" />

            {/* Grass areas */}
            <rect x="72" y="432" width="488" height="130" fill="#86efac" opacity="0.4" rx="8" />
            <rect x="80" y="440" width="472" height="114" fill="#4ade80" opacity="0.2" rx="4" />
            {[100, 150, 200, 250, 300, 350, 400, 450, 500].map((x, i) => (
              <line key={i} x1={x} y1="442" x2={x} y2="552" stroke="white" strokeWidth="0.8" opacity="0.6" />
            ))}
            <ellipse cx="316" cy="497" rx="44" ry="30" fill="none" stroke="white" strokeWidth="1" opacity="0.5" />

            {/* Walkways */}
            <rect x="60" y="55"  width="630" height="10" fill="white" opacity="0.5" rx="2" />
            <rect x="60" y="420" width="580" height="10" fill="white" opacity="0.5" rx="2" />
            <rect x="60" y="55"  width="10"  height="510" fill="white" opacity="0.5" rx="2" />
            <rect x="678" y="55" width="10"  height="375" fill="white" opacity="0.5" rx="2" />
            <rect x="60" y="250" width="630" height="8" fill="white" opacity="0.4" rx="2" />
            <rect x="245" y="130" width="8" height="120" fill="white" opacity="0.4" rx="2" />
            <rect x="435" y="55"  width="8" height="120" fill="white" opacity="0.4" rx="2" />

            {/* Main entrance road */}
            <rect x="290" y="0" width="40" height="65" fill="#d1d5db" opacity="0.7" />
            <text x="310" y="22" textAnchor="middle" fill="#6b7280" fontSize="8"
              fontFamily="DM Mono, monospace" fontWeight="500" letterSpacing="1">MAIN ENTRANCE</text>

            {/* Trees */}
            {[
              [70,85],[70,125],[70,175],[70,225],[70,300],[70,360],
              [690,85],[690,125],[690,185],[690,260],[690,340],
              [155,455],[230,455],[380,455],[500,455],[590,455],
              [195,320],[420,260],[560,260],[310,155],
            ].map(([cx, cy], i) => (
              <g key={i}>
                <circle cx={cx} cy={cy} r="11" fill="#15803d" opacity="0.35" />
                <circle cx={cx} cy={cy} r="7"  fill="#166534" opacity="0.5" />
                <circle cx={cx-1} cy={cy-2} r="4" fill="#15803d" opacity="0.4" />
              </g>
            ))}

            {/* Compass */}
            <g transform="translate(710, 34)">
              <circle cx="0" cy="0" r="20" fill="white" stroke="#d1d5db" strokeWidth="1" opacity="0.95" />
              <text x="0" y="-8" textAnchor="middle" fill="#059669" fontSize="9"
                fontFamily="DM Mono, monospace" fontWeight="700">N</text>
              <path d="M 0 -15 L 3 -3 L 0 0 L -3 -3 Z" fill="#059669" />
              <path d="M 0 15 L 3 3 L 0 0 L -3 3 Z" fill="#d1d5db" />
            </g>

            {/* Buildings */}
            {buildings.map((building) => {
              const isSelected = selectedBuilding?.id === building.id;
              return (
                <g
                  key={building.id}
                  onClick={e => { e.stopPropagation(); setSelectedBuilding(isSelected ? null : building); }}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Shadow */}
                  <rect
                    x={building.x + 4}
                    y={building.y + 5}
                    width={building.width}
                    height={building.height}
                    fill="rgba(0,0,0,0.12)"
                    rx="6"
                  />
                  {/* Building */}
                  <rect
                    x={building.x}
                    y={building.y}
                    width={building.width}
                    height={building.height}
                    fill={building.color}
                    stroke={isSelected ? '#f59e0b' : 'rgba(255,255,255,0.25)'}
                    strokeWidth={isSelected ? 3 : 1}
                    rx="6"
                    opacity={isSelected ? 1 : 0.88}
                    style={{ filter: isSelected ? `drop-shadow(0 0 12px ${building.color}80)` : 'none' }}
                  />
                  {/* Roof detail */}
                  <rect x={building.x+5} y={building.y+5} width={building.width-10} height={6}
                    fill="rgba(255,255,255,0.12)" rx="3" />
                  {/* Selected highlight */}
                  {isSelected && (
                    <rect x={building.x} y={building.y} width={building.width} height={5}
                      fill="#f59e0b" rx="6" />
                  )}
                  {/* Abbreviation */}
                  <text
                    x={building.x + building.width / 2}
                    y={building.y + building.height / 2 - 5}
                    textAnchor="middle"
                    fill="white"
                    fontSize={building.height > 80 ? 14 : 11}
                    fontFamily="Syne, sans-serif"
                    fontWeight="800"
                    dominantBaseline="middle"
                    style={{ textShadow: '0 1px 4px rgba(0,0,0,0.3)' }}
                  >
                    {building.abbreviation}
                  </text>
                  {/* Name */}
                  <text
                    x={building.x + building.width / 2}
                    y={building.y + building.height / 2 + 10}
                    textAnchor="middle"
                    fill="rgba(255,255,255,0.7)"
                    fontSize={7}
                    fontFamily="DM Mono, monospace"
                    dominantBaseline="middle"
                    letterSpacing="0.5"
                  >
                    {building.name.length > 14 ? building.name.split(' ').slice(0, 2).join(' ') : building.name}
                  </text>
                </g>
              );
            })}

            {/* Deselect overlay */}
            <rect x="0" y="0" width="750" height="620" fill="transparent"
              onClick={() => setSelectedBuilding(null)} style={{ zIndex: -1 }} />
          </svg>
        </div>

        {/* Sidebar */}
        <div className="lg:w-72 space-y-4 flex-shrink-0">
          {selectedBuilding ? (
            <div
              className="rounded-2xl overflow-hidden border animate-fade-in-scale"
              style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-light)', boxShadow: 'var(--shadow-md)' }}
            >
              {/* Building header */}
              <div
                className="p-5 relative overflow-hidden"
                style={{ background: `linear-gradient(135deg, ${selectedBuilding.color}dd, ${selectedBuilding.color}99)` }}
              >
                <div className="absolute inset-0 pointer-events-none"
                  style={{ background: 'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.15), transparent 50%)' }} />
                <div className="relative flex items-start justify-between gap-2">
                  <div>
                    <div className="font-dm-mono text-[10px] uppercase tracking-wider text-white/60 mb-1">
                      Building
                    </div>
                    <h3 className="font-syne font-black text-xl text-white leading-tight">
                      {selectedBuilding.name}
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedBuilding(null)}
                    className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white/80 hover:bg-white/30 transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="p-4 space-y-4">
                <p className="font-dm-sans text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {selectedBuilding.description}
                </p>
                {selectedBuilding.rooms.length > 0 && (
                  <div>
                    <div className="font-dm-mono text-[10px] uppercase tracking-wider mb-2.5" style={{ color: 'var(--text-muted)' }}>
                      Rooms
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedBuilding.rooms.map(room => (
                        <span
                          key={room}
                          className="font-dm-mono text-[10px] px-2.5 py-1 rounded-lg border"
                          style={{
                            background: `${selectedBuilding.color}10`,
                            color: selectedBuilding.color,
                            borderColor: `${selectedBuilding.color}30`,
                          }}
                        >
                          {room}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div
              className="rounded-2xl p-5 border"
              style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-light)' }}
            >
              <div className="font-dm-mono text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
                How to use
              </div>
              <div className="space-y-2.5">
                {[
                  { icon: '👆', text: 'Click any building for details' },
                  { icon: '🖱️', text: 'Drag to pan around the map' },
                  { icon: '🔍', text: 'Scroll to zoom in & out' },
                  { icon: '🔄', text: 'Press Reset to return to default view' },
                ].map(({ icon, text }) => (
                  <div key={text} className="flex items-center gap-2.5">
                    <span className="text-base">{icon}</span>
                    <span className="font-dm-sans text-xs" style={{ color: 'var(--text-muted)' }}>{text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Building index */}
          <div
            className="rounded-2xl overflow-hidden border"
            style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-light)' }}
          >
            <div
              className="px-4 py-3 border-b font-dm-mono text-xs uppercase tracking-wider"
              style={{ color: 'var(--text-muted)', borderColor: 'var(--border-light)' }}
            >
              Building Index
            </div>
            <div className="divide-y" style={{ borderColor: 'var(--border-light)' }}>
              {buildings.map(b => (
                <button
                  key={b.id}
                  onClick={() => setSelectedBuilding(b)}
                  className="w-full flex items-center gap-3 px-4 py-3 transition-all text-left"
                  style={{
                    background: selectedBuilding?.id === b.id ? `${b.color}10` : 'transparent',
                  }}
                  onMouseEnter={e => {
                    if (selectedBuilding?.id !== b.id)
                      (e.currentTarget as HTMLElement).style.background = 'var(--bg-primary)';
                  }}
                  onMouseLeave={e => {
                    if (selectedBuilding?.id !== b.id)
                      (e.currentTarget as HTMLElement).style.background = 'transparent';
                  }}
                >
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: b.color }} />
                  <div className="flex-1 min-w-0">
                    <div className="font-dm-sans text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                      {b.name}
                    </div>
                    <div className="font-dm-mono text-[10px]" style={{ color: 'var(--text-muted)' }}>
                      {b.abbreviation}
                    </div>
                  </div>
                  {selectedBuilding?.id === b.id && (
                    <svg className="w-3.5 h-3.5 flex-shrink-0" style={{ color: b.color }}
                      fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
