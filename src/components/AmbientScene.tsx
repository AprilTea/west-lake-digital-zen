import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SeasonType, ScenicSpot, InkRipple, HANGZHOU_SEASONS_DATA } from '../types';

interface AmbientSceneProps {
  activeSeason: SeasonType;
  styleMode: 'artistic' | 'geometric';
  activeSpot: ScenicSpot | null;
  hoveredSpot: ScenicSpot | null;
  setActiveSpot: (spot: ScenicSpot) => void;
  setHoveredSpot: (spot: ScenicSpot | null) => void;
  playPluck: (freq: number, style?: 'artistic' | 'geometric') => void;
}

export const AmbientScene: React.FC<AmbientSceneProps> = ({
  activeSeason,
  styleMode,
  activeSpot,
  hoveredSpot,
  setActiveSpot,
  setHoveredSpot,
  playPluck
}) => {
  const [mapPan, setMapPan] = useState({ x: 0, y: 0 });
  const [mapScale, setMapScale] = useState(1);
  const [isDraggingMap, setIsDraggingMap] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const dragDistanceRef = useRef(0);
  const [ripples, setRipples] = useState<InkRipple[]>([]);

  // Map Panning Event Handlers
  
  const handleMapWheel = (e: React.WheelEvent<SVGSVGElement>) => {
    
    setMapScale(prev => {
      const zoomSensitivity = 0.001;
      const newScale = prev - e.deltaY * zoomSensitivity;
      return Math.max(0.5, Math.min(3, newScale));
    });
  };

  const handleMapMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    setIsDraggingMap(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    dragDistanceRef.current = 0;
  };

  const handleMapMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isDraggingMap) return;
    
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const scale = Math.max(100 / rect.width, 100 / rect.height);
    
    const dx = (e.clientX - dragStartRef.current.x) * scale;
    const dy = (e.clientY - dragStartRef.current.y) * scale;
    
    dragDistanceRef.current += Math.sqrt(dx * dx + dy * dy);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    
    setMapPan(prev => {
      // Expanded map bounds
      const maxPanX = 160;
      const maxPanY = 160;
      return {
        x: Math.max(-maxPanX, Math.min(maxPanX, prev.x + dx)),
        y: Math.max(-maxPanY, Math.min(maxPanY, prev.y + dy))
      };
    });
  };

  const handleMapMouseUpOrLeave = () => {
    setIsDraggingMap(false);
  };

  // Map Click Handler for Procedural Ripples
  const scrollVelocityRef = useRef(0);
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY || document.documentElement.scrollTop;
      const delta = currentScrollY - lastScrollYRef.current;
      scrollVelocityRef.current = Math.min(15, scrollVelocityRef.current + Math.abs(delta) * 0.08);
      lastScrollYRef.current = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMapClick = (e: React.MouseEvent<SVGSVGElement>) => {
    // If the mouse dragged/panned the map, don't trigger a click ripple
    if (dragDistanceRef.current > 10) {
      dragDistanceRef.current = 0;
      return;
    }
    dragDistanceRef.current = 0;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    
    // Reverse math to calculate 0-100 coordinates relative to zoomed and panned layer
    const x = (((clickX - mapPan.x) / mapScale) / rect.width) * 100;
    const y = (((clickY - mapPan.y) / mapScale) / rect.height) * 100;
    
    if (x < -100 || x > 200 || y < -100 || y > 200) return;

    // Append ripple state
    const newRipple: InkRipple = {
      id: Date.now(),
      x,
      y,
      size: 0,
      maxSize: styleMode === 'artistic' ? 12 + Math.random() * 20 : 8 + Math.random() * 12,
      opacity: 1,
      color: styleMode === 'artistic' ? '#27272a' : '#22d3ee',
      type: styleMode === 'artistic' ? 'ink' : 'circuit'
    };

    setRipples(prev => [...prev, newRipple]);
    
    // Play sound based on placement frequency
    const pluckFreq = 200 + (100 - Math.max(0, Math.min(100, y))) * 5; // Higher spots yield higher notes
    playPluck(pluckFreq);
  };

  // Progress the ripples
  useEffect(() => {
    if (ripples.length === 0) return;
    const interval = setInterval(() => {
      setRipples(prev => 
        prev
          .map(r => ({
            ...r,
            size: r.size + (styleMode === 'artistic' ? 1.2 : 2.0),
            opacity: Math.max(0, 1 - r.size / r.maxSize)
          }))
          .filter(r => r.opacity > 0)
      );
    }, 30);
    return () => clearInterval(interval);
  }, [ripples, styleMode]);




  const currentContent = HANGZHOU_SEASONS_DATA.find(s => s.id === activeSeason) || HANGZHOU_SEASONS_DATA[0];
  const allSpots = HANGZHOU_SEASONS_DATA.filter(s => s.id !== 'tech').flatMap(s => s.spots);


  // Dynamic map colors based on the selected season to reflect scenic changes
  const lakeFill = 
    activeSeason === 'spring' ? 'rgba(236, 72, 153, 0.04)' : // peach pink tint in green
    activeSeason === 'summer' ? 'rgba(5, 150, 105, 0.09)' : // deep vibrant emerald
    activeSeason === 'autumn' ? 'rgba(217, 119, 6, 0.06)' : // warm golden amber
    activeSeason === 'winter' ? 'rgba(148, 163, 184, 0.07)' : // cool slate snow blue
    'rgba(16, 185, 129, 0.05)';

  const lakeStroke = 
    activeSeason === 'spring' ? 'rgba(236, 72, 153, 0.25)' : 
    activeSeason === 'summer' ? 'rgba(4, 120, 87, 0.35)' : 
    activeSeason === 'autumn' ? 'rgba(217, 119, 6, 0.3)' : 
    activeSeason === 'winter' ? 'rgba(100, 116, 139, 0.25)' : 
    'rgba(16, 185, 129, 0.15)';

  const suCausewayStroke = 
    activeSeason === 'spring' ? 'rgba(244, 63, 94, 0.45)' : 
    activeSeason === 'summer' ? 'rgba(4, 120, 87, 0.45)' : 
    activeSeason === 'autumn' ? 'rgba(217, 119, 6, 0.45)' : 
    activeSeason === 'winter' ? 'rgba(241, 245, 249, 0.75)' : 
    'rgba(16, 185, 129, 0.35)';

  const suCausewayInnerStroke = 
    activeSeason === 'spring' ? '#ec4899' : 
    activeSeason === 'summer' ? '#047857' : 
    activeSeason === 'autumn' ? '#d97706' : 
    activeSeason === 'winter' ? '#94a3b8' : 
    '#2d6a4f';

  const solitaryHillFill = 
    activeSeason === 'spring' ? 'rgba(252, 165, 185, 0.15)' : 
    activeSeason === 'summer' ? 'rgba(16, 185, 129, 0.22)' : 
    activeSeason === 'autumn' ? 'rgba(245, 158, 11, 0.18)' : 
    activeSeason === 'winter' ? 'rgba(248, 250, 252, 0.55)' : 
    'rgba(44, 120, 80, 0.15)';

  const solitaryHillStroke = 
    activeSeason === 'spring' ? 'rgba(244, 63, 94, 0.3)' : 
    activeSeason === 'summer' ? 'rgba(6, 78, 59, 0.35)' : 
    activeSeason === 'autumn' ? 'rgba(180, 83, 9, 0.3)' : 
    activeSeason === 'winter' ? 'rgba(203, 213, 225, 0.6)' : 
    'rgba(44, 120, 80, 0.25)';

  const waterColor = 
    activeSeason === 'spring' ? 'rgba(236, 72, 153, 0.03)' : 
    activeSeason === 'summer' ? 'rgba(16, 185, 129, 0.04)' : 
    activeSeason === 'autumn' ? 'rgba(217, 119, 6, 0.03)' : 
    activeSeason === 'winter' ? 'rgba(226, 232, 240, 0.08)' : 
    'rgba(0, 0, 0, 0.03)';

  const mountainStroke = 
    activeSeason === 'spring' ? 'rgba(244, 63, 94, 0.15)' :
    activeSeason === 'summer' ? 'rgba(16, 185, 129, 0.2)' :
    activeSeason === 'autumn' ? 'rgba(180, 83, 9, 0.18)' :
    activeSeason === 'winter' ? 'rgba(100, 116, 139, 0.15)' :
    'rgba(44, 42, 37, 0.12)';



  return (
    <div className="relative w-full h-full overflow-hidden flex items-center justify-center">
<svg
              id="interactive-svg-map"
              className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing select-none"
              onClick={handleMapClick}
              onWheel={handleMapWheel}
              onMouseDown={handleMapMouseDown}
              onMouseMove={handleMapMouseMove}
              onMouseUp={handleMapMouseUpOrLeave}
              onMouseLeave={handleMapMouseUpOrLeave}
              viewBox="0 0 100 100"
              preserveAspectRatio="xMidYMid meet"
            >
              <g 
                id="zoomable-map-layer"
                transform={`translate(${mapPan.x}, ${mapPan.y}) scale(${mapScale})`}
                style={{ transformOrigin: '50px 50px' }}
                className={isDraggingMap ? "" : "transition-transform duration-300 ease-out"}
              >
              {/* Draw Procedural Lake Water Gradients / Textures */}
              {styleMode === 'artistic' ? (
                <>
                  {/* Procedural Classical Ink Wash West Lake Outline */}
                  <path 
                    d="M 22,35 C 28,18 62,18 74,30 C 78,42 76,58 68,72 C 60,82 45,84 32,82 C 20,80 18,55 22,35 Z"
                    fill={waterColor}
                    stroke={mountainStroke}
                    strokeWidth="0.5"
                    className="transition-all duration-1000"
                  />
                  {/* Su Causeway (苏堤) - Classical */}
                  <path 
                    d="M 38,81 L 38,30" 
                    fill="none" 
                    stroke={mountainStroke} 
                    strokeWidth="0.6" 
                    className="transition-colors duration-1000" 
                  />
                  {/* Bai Causeway (白堤) - Classical */}
                  <path 
                    d="M 38,30 C 45,30 55,25 65,22" 
                    fill="none" 
                    stroke={mountainStroke} 
                    strokeWidth="0.6" 
                    className="transition-colors duration-1000" 
                  />
                  {/* Three Pools Mirroring the Moon (三潭印月) Islands */}
                  <circle cx="55" cy="55" r="2.5" fill={waterColor} stroke={mountainStroke} strokeWidth="0.3" className="transition-all duration-1000" />
                  <circle cx="53" cy="58" r="0.4" fill={mountainStroke} />
                  <circle cx="57" cy="58" r="0.4" fill={mountainStroke} />
                  <circle cx="55" cy="52" r="0.4" fill={mountainStroke} />
</>
              ) : (
                <>
                  {/* Cyber grid, digital shorelines, and geometric connections */}
                  <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(34, 211, 238, 0.03)" strokeWidth="0.5" strokeDasharray="3,3" />
                  <circle cx="50" cy="50" r="30" fill="none" stroke="rgba(34, 211, 238, 0.02)" strokeWidth="1" />
                  <circle cx="50" cy="50" r="15" fill="none" stroke="rgba(34, 211, 238, 0.03)" strokeWidth="0.5" />

                  {/* Glowing Digital West Lake (数智西湖水体) */}
                  <path 
                    d="M 22,35 C 28,18 62,18 74,30 C 78,42 76,58 68,72 C 60,82 45,84 32,82 C 20,80 18,55 22,35 Z" 
                    fill="rgba(34, 211, 238, 0.02)" 
                    stroke="rgba(34, 211, 238, 0.15)" 
                    strokeWidth="0.75" 
                    strokeDasharray="4,2" 
                  />

                  {/* Cyber Su Causeway circuit route */}
                  <path 
                    d="M 38,81 L 38,30" 
                    stroke="#22d3ee" 
                    strokeWidth="0.8" 
                    strokeDasharray="2,2" 
                    opacity="0.6" 
                  />

                  {/* Cyber Bai Causeway circuit route */}
                  <path 
                    d="M 45,25 Q 60,24 75,28" 
                    stroke="#818cf8" 
                    strokeWidth="0.8" 
                    strokeDasharray="3,3" 
                    fill="none" 
                    opacity="0.6" 
                  />

                  {/* Cyber Solitary Hill wireframe */}
                  <polygon 
                    points="42,25 46,22 52,22 55,25 50,28 44,28" 
                    fill="none" 
                    stroke="rgba(129, 140, 248, 0.25)" 
                    strokeWidth="0.5" 
                  />

                  {/* Cyber Three Pools central ring */}
                  <circle 
                    cx="50" 
                    cy="70" 
                    r="4.5" 
                    fill="none" 
                    stroke="#22d3ee" 
                    strokeWidth="0.5" 
                    strokeDasharray="2,2" 
                  />

                  {/* Qiantang River (数智钱塘江) glowing current layers */}
                  <path 
                    d="M 70,100 C 72,92 82,88 100,78" 
                    fill="none" 
                    stroke="rgba(99, 102, 241, 0.2)" 
                    strokeWidth="1.2" 
                    strokeDasharray="5,3" 
                  />
                  <path 
                    d="M 75,100 C 77,94 84,91 100,82" 
                    fill="none" 
                    stroke="rgba(34, 211, 238, 0.15)" 
                    strokeWidth="0.8" 
                    strokeDasharray="2,2" 
                  />
                  
                  {/* Digital Twin flow coordinates lines */}
                  <line x1="50" y1="5" x2="50" y2="95" stroke="rgba(34, 211, 238, 0.03)" strokeWidth="0.5" />
                  <line x1="5" y1="50" x2="95" y2="50" stroke="rgba(34, 211, 238, 0.03)" strokeWidth="0.5" />

                  {/* Laser mesh pathways connecting spots of the active season */}
                  {currentContent.spots.length >= 2 && (
                    <g opacity="0.6">
                      <line 
                        x1={currentContent.spots[0].coordinates.x} 
                        y1={currentContent.spots[0].coordinates.y} 
                        x2={currentContent.spots[1].coordinates.x} 
                        y2={currentContent.spots[1].coordinates.y} 
                        stroke="#22d3ee" 
                        strokeWidth="0.75" 
                        strokeDasharray="1,3"
                        className="animate-pulse"
                      />
                      {/* Connection to Qianjiang New Town (tech node) */}
                      <line 
                        x1={currentContent.spots[0].coordinates.x} 
                        y1={currentContent.spots[0].coordinates.y} 
                        x2="80" 
                        y2="80" 
                        stroke="rgba(99, 102, 241, 0.3)" 
                        strokeWidth="0.5" 
                        strokeDasharray="2,2"
                      />
                    </g>
                  )}
                </>
              )}



              {/* Render ripples click effects dynamically */}
              {ripples.map((ripple) => (
                <g key={ripple.id}>
                  {ripple.type === 'ink' ? (
                    // Traditional expanding watery ink wash drops
                    <circle
                      cx={ripple.x}
                      cy={ripple.y}
                      r={ripple.size}
                      fill="none"
                      stroke={ripple.color}
                      strokeWidth={1.8 * ripple.opacity}
                      opacity={ripple.opacity * 0.4}
                    />
                  ) : (
                    // Glowing laser grid nodes
                    <>
                      <circle
                        cx={ripple.x}
                        cy={ripple.y}
                        r={ripple.size}
                        fill="none"
                        stroke={ripple.color}
                        strokeWidth={0.5}
                        opacity={ripple.opacity}
                      />
                      <rect
                        x={ripple.x - ripple.size / 1.4}
                        y={ripple.y - ripple.size / 1.4}
                        width={ripple.size * 1.4}
                        height={ripple.size * 1.4}
                        fill="none"
                        stroke="#6366f1"
                        strokeWidth={0.5}
                        opacity={ripple.opacity * 0.5}
                        transform={`rotate(${ripple.size * 5}, ${ripple.x}, ${ripple.y})`}
                      />
                    </>
                  )}
                </g>
              ))}

              {/* Render Static Active Season Scenic Nodes */}
              {allSpots.map((spot, idx) => {
                const isActive = activeSpot?.name === spot.name;
                const isHovered = hoveredSpot?.name === spot.name;
                return (
                  <g 
                    key={spot.name}
                    transform={`translate(${spot.coordinates.x}, ${spot.coordinates.y})`}
                  >
                    <motion.g 
                      className="cursor-pointer group"
                      animate={{ 
                        scale: isActive ? 1.15 : isHovered ? 1.1 : 1,
                        filter: styleMode === 'artistic'
                          ? (isActive 
                            ? 'drop-shadow(0px 2px 4px rgba(16, 185, 129, 0.45))' 
                            : isHovered 
                              ? 'drop-shadow(0px 2px 3px rgba(44, 42, 37, 0.3))' 
                              : 'drop-shadow(0px 0.5px 1px rgba(0, 0, 0, 0.1))')
                          : (isActive 
                            ? 'drop-shadow(0px 0px 6px rgba(34, 211, 238, 0.85)) drop-shadow(0px 0px 2px rgba(99, 102, 241, 0.5))' 
                            : isHovered 
                              ? 'drop-shadow(0px 0px 4px rgba(34, 211, 238, 0.6))' 
                              : 'drop-shadow(0px 0px 1px rgba(0, 0, 0, 0.15))')
                      }}
                      transition={{ type: "spring", stiffness: 350, damping: 22 }}
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent duplicate ripples
                        setActiveSpot(spot);
                        playPluck(300 + idx * 80);
                      }}
                      onMouseEnter={() => setHoveredSpot(spot)}
                      onMouseLeave={() => setHoveredSpot(null)}
                    >
                      {styleMode === 'artistic' ? (
                        // Classical Stamp / Ink Droplet Node
                        <>
                           <circle 
                             cx="0" 
                             cy="0" 
                             r={isActive ? 2.6 : isHovered ? 2.2 : 1.6} 
                             className="transition-all duration-300 fill-[#2c2a25] stroke-[#eae5da]"
                             strokeWidth="1.0"
                           />
                           <circle 
                             cx="0" 
                             cy="0" 
                             r={isActive ? 4.8 : 0} 
                             className="transition-all duration-500 fill-none stroke-[#10B981] animate-ping"
                             strokeWidth="0.4"
                             opacity="0.6"
                           />
                           {/* Classical calligraphy text tag */}
                           <text
                             x="0"
                             y="-4.8"
                             textAnchor="middle"
                             className="text-[2.8px] font-bold fill-[#2c2a25] tracking-widest transition-opacity duration-300 font-serif-sc"
                           >
                             {spot.name.split(' (')[0]}
                           </text>
                        </>
                      ) : (
                        // Advanced Cyber Metric Glowing Node
                        <>
                           <rect
                             x={isActive ? -1.8 : -1.3}
                             y={isActive ? -1.8 : -1.3}
                             width={isActive ? 3.6 : 2.6}
                             height={isActive ? 3.6 : 2.6}
                             className="transition-all duration-300 fill-slate-900 stroke-cyan-400"
                             strokeWidth={isActive ? 0.9 : 0.6}
                             transform="rotate(45)"
                           />
                           {/* Core pulse */}
                           <circle
                             cx="0"
                             cy="0"
                             r={isActive ? 3.8 : isHovered ? 2.8 : 1.8}
                             className="fill-none stroke-cyan-400 animate-pulse"
                             strokeWidth="0.4"
                             opacity={isActive ? 0.8 : 0.3}
                           />
                           {/* Scanning orbit rings */}
                           {isActive && (
                             <circle
                               cx="0"
                               cy="0"
                               r="5.5"
                               className="fill-none stroke-indigo-500/40"
                               strokeWidth="0.4"
                               strokeDasharray="1.5,1.5"
                             />
                           )}
                           <text
                             x="4.5"
                             y="1.0"
                             className="text-[2.4px] font-mono fill-cyan-400 tracking-wider transition-all duration-300"
                           >
                             {spot.name.split(' (')[0]}
                           </text>
                        </>
                      )}
                    </motion.g>
                  </g>
                );
              })}

              {/* Interactive Boat Sailing to Selected Scenic Spot (Rendered on highest layer) */}
              {activeSpot && (
                <motion.g
                  key="lake-boat-sailing"
                  initial={{ 
                    x: activeSpot.coordinates.x - 3.5, 
                    y: activeSpot.coordinates.y + 4.5 
                  }}
                  animate={{ 
                    x: activeSpot.coordinates.x - 3.5, 
                    y: activeSpot.coordinates.y + 4.5,
                    rotate: [ -1.8, 1.8, -1.8 ]
                  }}
                  transition={{ 
                    x: { type: "tween", ease: "easeInOut", duration: 4.5 },
                    y: { type: "tween", ease: "easeInOut", duration: 4.5 },
                    rotate: { repeat: Infinity, duration: 4, ease: "easeInOut" }
                  }}
                  className="pointer-events-none"
                >
                  {styleMode === 'artistic' ? (
                    <g transform="scale(0.8) translate(-1, -1)">
                      {/* Traditional Jiangnan Wupeng Boat (乌篷船) centered around 0,0 */}
                      {/* Water Ripples under the boat */}
                      <ellipse cx="0" cy="2.5" rx="6.2" ry="0.7" fill="none" stroke="rgba(16, 185, 129, 0.25)" strokeWidth="0.2" className="animate-pulse" />
                      <ellipse cx="-1" cy="3.0" rx="3.5" ry="0.4" fill="none" stroke="rgba(16, 185, 129, 0.15)" strokeWidth="0.15" />
                      
                      {/* Wooden steering oar (橹) at the stern */}
                      <line x1="-5" y1="0.8" x2="-9" y2="2.8" stroke="#3a2212" strokeWidth="0.25" strokeLinecap="round" />
                      <path d="M -8.2,2.4 L -9.8,3.2" stroke="#251408" strokeWidth="0.45" strokeLinecap="round" />
                      
                      {/* Three overlapping black felt canopies (乌篷) indicating traditional cabins */}
                      {/* Canopy 1 (Back) */}
                      <path 
                        d="M -2.5,0.8 C -2.5,-1.3 -0.5,-1.3 -0.5,0.8" 
                        fill="#161616" 
                        stroke="#2e2e2e" 
                        strokeWidth="0.2" 
                      />
                      {/* Canopy 2 (Middle, slightly taller) */}
                      <path 
                        d="M -1.1,0.8 C -1.1,-1.6 1.1,-1.6 1.1,0.8" 
                        fill="#202020" 
                        stroke="#3c3c3c" 
                        strokeWidth="0.2" 
                      />
                      {/* Canopy 3 (Front) */}
                      <path 
                        d="M 0.5,0.8 C 0.5,-1.3 2.3,-1.3 2.3,0.8" 
                        fill="#161616" 
                        stroke="#2e2e2e" 
                        strokeWidth="0.2" 
                      />

                      {/* Boat Hull with sleek, high-upturned bow and dark wood texture */}
                      <path 
                        d="M -7,0.5 Q -4,2.5 0,2.5 Q 4,2.5 7.5,-0.5 Q 4,0.5 0,0.5 Q -4,0.5 -7,0.5 Z" 
                        fill="#25160d" 
                        stroke="#0e0804"
                        strokeWidth="0.3"
                      />
                      {/* Gunwale (upper rim highlight) */}
                      <path 
                        d="M -7,0.5 Q -4,0.5 0,0.5 Q 4,0.5 7.5,-0.5" 
                        fill="none" 
                        stroke="#4a3120" 
                        strokeWidth="0.2" 
                      />
                      
                      {/* Hanging red lantern at the elegant upturned bow */}
                      <line x1="7.5" y1="-0.5" x2="7.5" y2="0.2" stroke="#0e0804" strokeWidth="0.15" />
                      <ellipse cx="7.5" cy="0.6" rx="0.6" ry="0.8" fill="#dc2626" stroke="#7f1d1d" strokeWidth="0.15" />
                      {/* Golden tassel */}
                      <line x1="7.5" y1="1.4" x2="7.5" y2="1.8" stroke="#d97706" strokeWidth="0.2" />
                      {/* Ambient red glow */}
                      <circle cx="7.5" cy="0.6" r="2.0" fill="#f43f5e" opacity="0.3" className="animate-ping" style={{ animationDuration: '2.5s' }} />
                    </g>
                  ) : (
                    <g transform="scale(0.8) translate(0, 0)">
                      {/* Futuristic cyber autonomous solar vessel centered around 0,0 */}
                      {/* Energy core ripple */}
                      <ellipse cx="0" cy="0" rx="3.5" ry="1.2" fill="none" stroke="rgba(34, 211, 238, 0.4)" strokeWidth="0.2" className="animate-pulse" />
                      
                      {/* Sleek triangular cyber ship body */}
                      <path 
                        d="M 5,0 L -4,-2 L -2,0 L -4,2 Z" 
                        fill="rgba(34, 211, 238, 0.35)" 
                        stroke="#22d3ee" 
                        strokeWidth="0.45" 
                      />
                      {/* Solar panel mesh */}
                      <polygon points="-1,-0.8 1,-0.8 0.5,0.8 -0.5,0.8" fill="#4f46e5" opacity="0.8" />
                      
                      {/* Laser pointer line */}
                      <line x1="5" y1="0" x2="10" y2="0" stroke="rgba(236, 72, 153, 0.5)" strokeWidth="0.3" strokeDasharray="1,1" />
                      {/* Thruster wake glow */}
                      <circle cx="-4.5" cy="0" r="0.6" fill="#38bdf8" className="animate-ping" />
                    </g>
                  )}
                </motion.g>
              )}
              </g>
            </svg>
      {/* Floating Zoom & Pan Controls */}
      <div className="absolute top-4 right-4 z-30 flex flex-col space-y-1.5 items-end">
        <div className={`flex items-center space-x-1 p-1 rounded-xl shadow-md border transition-all duration-1000
          ${styleMode === 'artistic'
            ? 'bg-[#fbf8f2]/95 border-transparent text-zinc-800'
            : 'bg-slate-900/95 border-cyan-500/20 text-cyan-300'
          }`}
        >
          <button
            title="放大 (Zoom In)"
            onClick={(e) => { e.stopPropagation(); setMapScale(prev => Math.min(3.0, prev + 0.25)); }}
            className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs font-bold transition-all duration-300
        ${styleMode === 'artistic' ? 'hover:bg-zinc-200 text-[#2c2a25]' : 'hover:bg-cyan-500/25 text-cyan-400'}`}
          >
            {styleMode === 'artistic' ? '十' : '+'}
          </button>
          <div className="w-[1px] h-4 bg-zinc-300/40 dark:bg-zinc-800/40" />
          <button
            title="缩小 (Zoom Out)"
            onClick={(e) => { e.stopPropagation(); setMapScale(prev => Math.max(0.5, prev - 0.25)); }}
            className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs font-bold transition-all duration-300
        ${styleMode === 'artistic' ? 'hover:bg-zinc-200 text-[#2c2a25]' : 'hover:bg-cyan-500/25 text-cyan-400'}`}
          >
            {styleMode === 'artistic' ? '一' : '-'}
          </button>
          <div className="w-[1px] h-4 bg-zinc-300/40 dark:bg-zinc-800/40" />
          <button
            title="重置 (Reset)"
            onClick={(e) => { e.stopPropagation(); setMapScale(1.0); setMapPan({ x: 0, y: 0 }); }}
            className={`px-2 h-7 flex items-center justify-center rounded-lg text-[10px] font-mono transition-all duration-300
        ${styleMode === 'artistic' ? 'hover:bg-zinc-200 text-[#2c2a25] font-serif-sc font-bold' : 'hover:bg-cyan-500/25 text-cyan-400'}`}
          >
            {styleMode === 'artistic' ? '归' : 'Reset'}
          </button>
        </div>
      </div>
    </div>
  );
};
