import React, { useState, useEffect, useRef } from 'react';
import { 
  Wind, 
  Music, 
  Volume2, 
  VolumeX, 
  Cpu, 
  Sparkles, 
  Clock, 
  Activity, 
  CloudRain, 
  X
} from 'lucide-react';
import { HANGZHOU_SEASONS_DATA, SeasonType, ScenicSpot, InkRipple } from './types';
import { WeatherType } from './photos';
import { motion, AnimatePresence } from 'motion/react';
import { CLASSICAL_SCORES, getMusicalScoreWithRhythms } from './data/musicData';
import { useGuqinAudio } from './hooks/useGuqinAudio';
import { AmbientScene } from './components/AmbientScene';
import { ScoreCard } from "./components/ScoreCard";
import { GuqinStrings } from "./components/GuqinStrings";
import { BackgroundParticles } from './components/BackgroundParticles';
import { PoeticOracle } from './components/PoeticOracle';
import { TechAndEducation } from './components/TechAndEducation';


export default function App() {
  // State definitions
  const [activeSeason, setActiveSeason] = useState<SeasonType>('spring');
  const [styleMode, setStyleMode] = useState<'artistic' | 'geometric'>('artistic');
  const [hoveredSpot, setHoveredSpot] = useState<ScenicSpot | null>(null);
  const [activeSpot, setActiveSpot] = useState<ScenicSpot | null>(HANGZHOU_SEASONS_DATA[0].spots[0]);
  const [activeWeather, setActiveWeather] = useState<WeatherType>('sunny');
  const [lightboxImage, setLightboxImage] = useState<{ url: string; caption: string; photographer: string; settings: string; note: string } | null>(null);
      
  const [smartStats, setSmartStats] = useState({
    pm25: 12,
    waterClarity: 1.8,
    soilMoisture: 45.3,
    smartGridLoad: 28.5,
    crowdFlow: '畅通'
  });

  const windSpeed = 50;

  const { isMuted, audioInited, activeScore, setActiveScore, playingScoreName, currentPlayingNoteIdx, setCurrentPlayingNoteIdx, isLooping, setIsLooping, playPluck, playScore, stopScore, toggleMute, initAudio } = useGuqinAudio(styleMode);

  const [orderedScores, setOrderedScores] = useState<typeof CLASSICAL_SCORES>(CLASSICAL_SCORES);
  const [choreographyStage, setChoreographyStage] = useState<'idle' | 'stage_align' | 'stage_swap'>('idle');
  const [clickedScoreName, setClickedScoreName] = useState<string | null>(null);
  const [originalActiveScore, setOriginalActiveScore] = useState<typeof CLASSICAL_SCORES[0] | null>(null);

  const notesScrollRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll the classical stave to center-highlight the active note
  useEffect(() => {
    if (notesScrollRef.current && currentPlayingNoteIdx !== -1) {
      const activeEl = notesScrollRef.current.children[currentPlayingNoteIdx] as HTMLElement;
      if (activeEl) {
        notesScrollRef.current.scrollTo({
          left: activeEl.offsetLeft - notesScrollRef.current.offsetWidth / 2 + activeEl.offsetWidth / 2,
          behavior: 'smooth'
        });
      }
    }
  }, [currentPlayingNoteIdx]);

  const getSlotProps = (slotIdx: number) => {
    if (slotIdx === 0) {
      return {
        left: "0%",
        top: 0,
        width: "100%",
        height: 140,
      };
    } else if (slotIdx === 1) {
      return {
        left: "0%",
        top: 155,
        width: "31%",
        height: 112,
      };
    } else if (slotIdx === 2) {
      return {
        left: "34.5%",
        top: 155,
        width: "31%",
        height: 112,
      };
    } else {
      return {
        left: "69%",
        top: 155,
        width: "31%",
        height: 112,
      };
    }
  };

  const startChoreographySwitch = (targetScore: typeof CLASSICAL_SCORES[0]) => {
    if (choreographyStage !== 'idle') return;
    
    const targetIdx = orderedScores.findIndex(s => s.name === targetScore.name);
    if (targetIdx === 0) return; // Already top/active
    
    const prevActive = orderedScores[0];
    setOriginalActiveScore(prevActive);
    setClickedScoreName(targetScore.name);
    
    // Stop playback immediately when clicked!
    stopScore();
    
    // Step 1: Immediately align side-by-side (A shrinks & slides left, B shrinks & slides up right)
    setChoreographyStage('stage_align');
    
    // Step 2: Swap: expand B to full width/height, recede A to its final bottom slot
    setTimeout(() => {
      setChoreographyStage('stage_swap');
    }, 600);
    
    // Step 3: Finalize layout and start playing the new score!
    setTimeout(() => {
      const nextOrdered = [
        targetScore,
        ...CLASSICAL_SCORES.filter(s => s.name !== targetScore.name)
      ];
      setOrderedScores(nextOrdered);
      
      setActiveScore(targetScore);
      setChoreographyStage('idle');
      setClickedScoreName(null);
      setOriginalActiveScore(null);
      
      // Start playing the new score now that the animation is fully complete
      playScore(targetScore);
    }, 1100);
  };


  // Particles Canvas Refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const requestRef = useRef<number | null>(null);

  // Dynamic simulation of smart data in Geometric mode
  useEffect(() => {
    const interval = setInterval(() => {
      setSmartStats(prev => ({
        pm25: Math.max(5, Math.min(25, +(prev.pm25 + (Math.random() - 0.5) * 1.5).toFixed(1))),
        waterClarity: Math.max(1.5, Math.min(2.5, +(prev.waterClarity + (Math.random() - 0.5) * 0.1).toFixed(2))),
        soilMoisture: Math.max(35, Math.min(60, +(prev.soilMoisture + (Math.random() - 0.5) * 2).toFixed(1))),
        smartGridLoad: Math.max(15, Math.min(45, +(prev.smartGridLoad + (Math.random() - 0.5) * 3).toFixed(1))),
        crowdFlow: Math.random() > 0.8 ? '缓行' : '畅通'
      }));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const scrollVelocityRef = useRef(0);
  const lastScrollYRef = useRef(0);
  // Track scroll speed to trigger ink flow horizontal breeze
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY || document.documentElement.scrollTop;
      const delta = currentScrollY - lastScrollYRef.current;
      // Accumulate velocity with scroll activity
      scrollVelocityRef.current = Math.min(15, scrollVelocityRef.current + Math.abs(delta) * 0.08);
      lastScrollYRef.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  // Synchronize weather state when season changes
  useEffect(() => {
    if (activeSeason === 'spring') setActiveWeather('sunny');
    else if (activeSeason === 'summer') setActiveWeather('rainy');
    else if (activeSeason === 'autumn') setActiveWeather('misty');
    else if (activeSeason === 'winter') setActiveWeather('night');
    else if (activeSeason === 'tech') setActiveWeather('night');
  }, [activeSeason]);

  // Style shift trigger sound
  const handleStyleToggle = () => {
    const nextStyle = styleMode === 'artistic' ? 'geometric' : 'artistic';
    setStyleMode(nextStyle);
    
    if (nextStyle === 'artistic') {
      // Warm guqin sweeping chords
      playPluck(196.00, 'artistic'); // G3
      setTimeout(() => playPluck(261.63, 'artistic'), 120); // C4
      setTimeout(() => playPluck(329.63, 'artistic'), 240); // E4
    } else {
      // Sci-fi power-up scan
      playPluck(150, 'geometric');
      setTimeout(() => playPluck(450, 'geometric'), 100);
      setTimeout(() => playPluck(900, 'geometric'), 200);
    }
  };

  return (
    <div 
      id="app-container"
      className={`min-h-screen relative flex flex-col overflow-x-hidden transition-all duration-1000 select-none
        ${styleMode === 'artistic' 
          ? 'bg-[#f4f0e6] text-[#2c2a25] font-serif-sc' 
          : 'bg-[#0b0f17] text-slate-100 font-tech'
        }`}
      style={{
        backgroundImage: styleMode === 'artistic' 
          ? 'radial-gradient(circle at top right, rgba(16,185,129,0.03), transparent), radial-gradient(circle at bottom left, rgba(236,72,153,0.02), transparent)' 
          : 'linear-gradient(to right, rgba(34,211,238,0.015) 1px, transparent 1px), linear-gradient(to bottom, rgba(34,211,238,0.015) 1px, transparent 1px), radial-gradient(circle at top right, rgba(34,211,238,0.08), transparent), radial-gradient(circle at bottom left, rgba(99,102,241,0.06), transparent)',
        backgroundSize: styleMode === 'artistic'
          ? 'auto'
          : '60px 60px, 60px 60px, auto, auto'
      }}
    >
      {/* Background Particles Canvas */}
      <BackgroundParticles 
        activeSeason={activeSeason} 
        styleMode={styleMode} 
        windSpeed={windSpeed} 
      />

      {/* Classical rice paper overlay texture when in Artistic Mode */}
      {styleMode === 'artistic' && (
        <div 
          id="paper-texture"
          className="absolute inset-0 pointer-events-none opacity-[0.035] mix-blend-multiply z-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
          }}
        />
      )}

      <div className="w-full max-w-4xl mx-auto min-h-screen flex flex-col shadow-2xl relative z-20 border-x border-zinc-200/10 dark:border-slate-800/20 bg-transparent">
        {/* Top Header Row */}
        <header 
          id="main-header"
        className={`relative z-20 w-full px-6 py-4 flex items-center justify-between border-b transition-colors duration-1000
          ${styleMode === 'artistic' 
            ? 'border-emerald-950/5 bg-[#f4f0e6]' 
            : 'border-cyan-500/10 bg-[#0b0f17]'
          }`}
      >
        <div className="flex items-center space-x-3">
          {styleMode === 'artistic' ? (
            <div id="artistic-logo" className="flex items-center space-x-2">
              <span className="w-8 h-8 rounded-full bg-[#2c2a25] text-[#f4f0e6] flex items-center justify-center font-calligraphy text-lg font-bold shadow-md">
                印
              </span>
              <div>
                <h1 className="text-xl font-bold tracking-widest font-serif-sc">西湖数智幻影</h1>
                <p className="text-[10px] uppercase tracking-widest opacity-60 font-sans">West Lake Digital Zen</p>
              </div>
            </div>
          ) : (
            <div id="geometric-logo" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded bg-gradient-to-br from-cyan-400 to-indigo-500 flex items-center justify-center animate-pulse shadow-[0_0_10px_rgba(34,211,238,0.3)]">
                <Cpu className="w-4 h-4 text-slate-900" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-wider font-tech bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-indigo-400">
                  WESTLAKE.AI.STUDIO
                </h1>
                <p className="text-[9px] tracking-widest text-cyan-400/80 font-mono">INTELLIGENT HANGZHOU GRID</p>
              </div>
            </div>
          )}
        </div>

        {/* Floating Controls Dashboard */}
        <div className="flex items-center space-x-4">
          {/* Ambient Music Synthesizer Controller */}
          <button
            id="audio-toggle-btn"
            onClick={toggleMute}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-full border text-xs tracking-wider transition-all duration-300
              ${styleMode === 'artistic'
                ? 'border-emerald-800/10 hover:bg-[#eae6db] text-emerald-950'
                : 'border-cyan-500/20 hover:bg-cyan-500/5 text-cyan-400'
              }`}
            title={isMuted ? "开启意境背景音 (Web Audio 实时合成)" : "静音"}
          >
            {isMuted ? (
              <>
                <VolumeX className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">无声</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 animate-bounce" />
                <span className="hidden sm:inline">数智和鸣</span>
              </>
            )}
          </button>

          {/* Aesthetic Toggle Switch */}
          <button
            id="paradigm-switch-btn"
            onClick={handleStyleToggle}
            className={`relative flex items-center space-x-2 px-4 py-2 rounded-full font-bold shadow-sm transition-all duration-500 group overflow-hidden
              ${styleMode === 'artistic'
                ? 'bg-[#2c2a25] text-[#f4f0e6] hover:bg-zinc-800'
                : 'bg-cyan-400 text-slate-950 hover:bg-cyan-300'
              }`}
          >
            <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-emerald-400 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
            {styleMode === 'artistic' ? (
              <>
                <Cpu className="w-4 h-4 mr-1 text-cyan-300 animate-spin-slow" />
                <span className="font-tech text-xs tracking-widest">GEOMETRIC BALANCE</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-1 text-[#2c2a25]" />
                <span className="font-serif-sc text-xs tracking-widest">水墨意境 ARTISTIC</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Nav Row (Seasons) */}
      

      {/* Main Body */}
      <main 
        id="main-dashboard"
        className="flex-1 w-full p-4 sm:p-6 flex flex-col space-y-6 relative z-20"
      >
        
        {/* Left Column: Interactive Map/Visualizer (Stacked) */}
        <section 
          id="visualizer-section"
          className="w-full flex flex-col space-y-6"
        >
          <div 
            id="map-container-card"
            className={`w-full h-[380px] sm:h-[440px] md:h-[480px] lg:h-[480px] rounded-2xl relative overflow-hidden flex flex-col border transition-all duration-1000
              ${styleMode === 'artistic'
                ? 'bg-[#eae5da]/70 border-emerald-950/5 shadow-inner'
                : 'bg-[#0f1422]/90 border-cyan-500/10 shadow-[0_0_30px_rgba(0,0,0,0.5)]'
              }`}
          >
            {/* Top Indicator */}
            <div className="absolute top-4 left-4 z-30 flex items-center space-x-2">
              <span className={`animate-ping w-2.5 h-2.5 rounded-full ${styleMode === 'artistic' ? 'bg-emerald-600' : 'bg-cyan-400'}`} />
              <span className={`text-[11px] uppercase tracking-wider font-mono opacity-50 ${styleMode === 'artistic' ? 'text-emerald-800' : 'text-cyan-400'}`}>
                {styleMode === 'artistic' ? '● 水墨幻境地图' : '● DIGITAL TWIN ACTIVE MAP'}
              </span>
            </div>

            {/* Interactive map SVG */}
            <AmbientScene
              activeSeason={activeSeason}
              styleMode={styleMode}
              activeSpot={activeSpot}
              hoveredSpot={hoveredSpot}
              setActiveSpot={(spot) => {
                setActiveSpot(spot);
                const season = HANGZHOU_SEASONS_DATA.find(s => s.spots.some(sp => sp.name === spot.name));
                if (season) setActiveSeason(season.id);
                playPluck(300);
              }}
              setHoveredSpot={setHoveredSpot}
              playPluck={playPluck}
            />


            {/* Aesthetic specific map card bottom footer banner */}
            {styleMode === 'artistic' ? (
              null
            ) : (
              <div 
                id="geometric-data-overlay"
                className="absolute bottom-4 left-4 right-4 z-20 grid grid-cols-2 sm:grid-cols-4 gap-2 bg-[#0c0e16]/95 border border-cyan-500/10 p-3 rounded-xl shadow-lg"
              >
                <div className="flex items-center space-x-2 border-r border-white/5 pr-2">
                  <Activity className="w-4 h-4 text-cyan-400 shrink-0" />
                  <div>
                    <p className="text-[8px] text-slate-400 uppercase font-mono">PM2.5 AQI</p>
                    <p className="text-xs font-mono font-bold text-cyan-300">{smartStats.pm25} μg/m³</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 border-r border-white/5 pr-2">
                  <CloudRain className="w-4 h-4 text-indigo-400 shrink-0" />
                  <div>
                    <p className="text-[8px] text-slate-400 uppercase font-mono">水质透光度</p>
                    <p className="text-xs font-mono font-bold text-indigo-300">{smartStats.waterClarity} 米</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 border-r border-white/5 pr-2">
                  <Cpu className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <p className="text-[8px] text-slate-400 uppercase font-mono">生态土壤湿度</p>
                    <p className="text-xs font-mono font-bold text-emerald-300">{smartStats.soilMoisture}%</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 pl-1">
                  <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <p className="text-[8px] text-slate-400 uppercase font-mono">智网低能耗负载</p>
                    <p className="text-xs font-mono font-bold text-amber-300">{smartStats.smartGridLoad}%</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Interactive Spot Detail Display Card */}
          {activeSpot && (
            <div 
              id="active-spot-card"
              className={`p-5 rounded-2xl border transition-all duration-1000 relative overflow-hidden
                ${styleMode === 'artistic'
                  ? 'bg-[#fbf8f2] border-transparent shadow-[0_4px_24px_rgba(40,30,10,0.02)]'
                  : 'bg-[#111622] border-cyan-500/10 shadow-lg'
                }`}
            >
              {/* Subtle visual stamp mark when in Artistic */}
              {styleMode === 'artistic' && (
                <div className="absolute right-6 top-6 opacity-[0.06] font-calligraphy text-7xl font-bold select-none text-red-700 leading-none">
                  西湖景
                </div>
              )}

              <div className="flex items-start justify-between">
                <div>
                  <h3 className={`text-lg font-bold tracking-wider ${styleMode === 'artistic' ? 'text-zinc-800' : 'text-cyan-400 font-mono'}`}>
                    {activeSpot.name}
                  </h3>
                  <p className="text-xs opacity-60 mt-1 italic font-serif-sc">
                    “{activeSpot.poeticVerse}”
                  </p>
                </div>
                <span className={`text-[10px] px-2.5 py-1 rounded-full font-mono uppercase tracking-wider
                  ${styleMode === 'artistic' 
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-800/10' 
                    : 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20'
                  }`}
                >
                  {styleMode === 'artistic' ? '历史传承' : 'AI IOT ACTIVE'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
                <div>
                  <h4 className={`text-xs font-bold uppercase tracking-wider mb-1.5 ${styleMode === 'artistic' ? 'text-zinc-600' : 'text-slate-400 font-mono'}`}>
                    {styleMode === 'artistic' ? '◇ 景色赏析' : '◇ POETIC INHERITANCE'}
                  </h4>
                  <p className="text-sm leading-relaxed opacity-80">
                    {activeSpot.description}
                  </p>
                </div>
                <div>
                  <h4 className={`text-xs font-bold uppercase tracking-wider mb-1.5 flex items-center space-x-1 ${styleMode === 'artistic' ? 'text-emerald-800' : 'text-cyan-400 font-mono'}`}>
                    <span>{styleMode === 'artistic' ? '✦ 智慧物联赋能' : '✦ DIGITAL TWIN INFRASTRUCTURE'}</span>
                  </h4>
                  <p className="text-sm leading-relaxed opacity-80 border-l-2 border-emerald-500/20 pl-3">
                    {activeSpot.techAspect}
                  </p>
                </div>
              </div>


            </div>
          )}

          </section>

        {/* Right Column: Guqin Synthesizer (Full Width) */}
        <section 
          id="content-details-section"
          className="w-full flex flex-col space-y-6"
        >
          {/* Smart Climatron & Zen Synthesizer Card */}
          <div 
            id="climatron-synth-card"
            className={`p-6 rounded-2xl border transition-all duration-1000 flex flex-col justify-between relative overflow-hidden
              ${styleMode === 'artistic'
                ? 'bg-[#fbf8f2] border-transparent shadow-[0_4px_24px_rgba(40,30,10,0.02)]'
                : 'bg-[#111622] border-cyan-500/10 shadow-lg'
              }`}
          >
            <div>
              <GuqinStrings
                styleMode={styleMode}
                playingScoreName={playingScoreName}
                activeScore={activeScore}
                currentPlayingNoteIdx={currentPlayingNoteIdx}
                playPluck={playPluck}
              />
            </div>

              {/* Classical Scenic Scores (西湖十景古琴曲谱) */}
              <div className="border-t border-zinc-100 dark:border-zinc-800/60 pt-4 mt-4">
                <div className="flex items-center justify-between mb-3.5">
                  <span className={`text-xs block uppercase tracking-wider font-bold ${styleMode === 'artistic' ? 'text-zinc-700 font-serif-sc' : 'text-cyan-400 font-mono'}`}>
                    🎵 西湖雅韵：名景古琴曲谱
                  </span>
                  
                  <div className="flex items-center space-x-2 shrink-0">
                    {/* Loop Toggle Button */}
                    <button
                      onClick={() => setIsLooping(!isLooping)}
                      className={`px-2 py-1 rounded-lg text-[10px] font-mono font-medium flex items-center space-x-1 transition-all duration-300 border ${
                        isLooping
                          ? styleMode === 'artistic'
                            ? 'bg-emerald-500/10 border-emerald-400 text-emerald-800'
                            : 'bg-cyan-500/10 border-cyan-400 text-cyan-300'
                          : 'bg-zinc-100 dark:bg-slate-900 border-zinc-200 dark:border-zinc-800/60 text-zinc-400 dark:text-zinc-600'
                      }`}
                      title={isLooping ? "已开启自动循环" : "未开启自动循环"}
                    >
                      <span className={`text-[11px] transition-transform ${isLooping ? 'animate-spin-slow inline-block' : 'opacity-60'}`}>🔁</span>
                      <span>{isLooping ? '循环: 开' : '循环: 关'}</span>
                    </button>

                    {playingScoreName && (
                      <span className="text-[10px] text-rose-500 animate-pulse flex items-center space-x-1 bg-rose-500/5 px-2 py-1 rounded-lg border border-rose-500/20">
                        <span className="inline-block w-1.5 h-1.5 bg-rose-500 rounded-full animate-ping" />
                        <span>正在演奏...</span>
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Score Selector List */}
                <div className="relative w-full h-[277px] mb-2">
                  {orderedScores.map((score) => {
                    const isPlaying = playingScoreName === score.name;
                    const rhythmicScore = getMusicalScoreWithRhythms(score);
                    
                    // Natural stable ordering for non-active cards (ABCD sequential slots, compacted into slots 1-3)
                    const getStableSlotIdx = (name: string, active: string) => {
                      if (name === active) return 0;
                      const inactives = CLASSICAL_SCORES.map(s => s.name).filter(n => n !== active);
                      const inactiveIdx = inactives.indexOf(name);
                      return inactiveIdx + 1; // slots 1, 2, 3 (no gaps, no 4th empty cell)
                    };

                    let targetLeft = "0%";
                    let targetTop = 0;
                    let targetW = "100%";
                    let targetH = 145;
                    let targetScale = 1.0;
                    let isExpanded = false;

                    const activeName = activeScore?.name || CLASSICAL_SCORES[0].name;

                    if (choreographyStage === 'idle') {
                      const slotIdx = getStableSlotIdx(score.name, activeName);
                      const slot = getSlotProps(slotIdx);
                      targetLeft = slot.left;
                      targetTop = slot.top;
                      targetW = slot.width;
                      targetH = slot.height;
                      targetScale = 1.0;
                      isExpanded = (slotIdx === 0);
                    } else {
                      const bName = clickedScoreName;
                      const aName = originalActiveScore?.name || activeName;

                      // Find their relative order to decide left vs right positions
                      const idxA = CLASSICAL_SCORES.findIndex(s => s.name === aName);
                      const idxB = CLASSICAL_SCORES.findIndex(s => s.name === bName);
                      const isALeftOfB = idxA < idxB;

                      if (score.name === aName) {
                        // Card A (originally active at Slot 0)
                        if (choreographyStage === 'stage_align') {
                          // Side-by-side layout: left or right based on relative list order
                          targetLeft = isALeftOfB ? "0%" : "51.5%";
                          targetTop = 0;
                          targetW = "48.5%";
                          targetH = 112;
                          targetScale = 1.0;
                          isExpanded = false;
                        } else {
                          // stage_swap: A moves down to its new fixed bottom slot
                          const nextSlotIdx = getStableSlotIdx(aName, bName!);
                          const slot = getSlotProps(nextSlotIdx);
                          targetLeft = slot.left;
                          targetTop = slot.top;
                          targetW = slot.width;
                          targetH = slot.height;
                          targetScale = 1.0;
                          isExpanded = false;
                        }
                      } else if (score.name === bName) {
                        // Card B (clicked bottom card moving to Slot 0)
                        if (choreographyStage === 'stage_align') {
                          // Side-by-side layout: left or right based on relative list order
                          targetLeft = isALeftOfB ? "51.5%" : "0%";
                          targetTop = 0;
                          targetW = "48.5%";
                          targetH = 112;
                          targetScale = 1.0;
                          isExpanded = false;
                        } else {
                          // stage_swap: expands to take full Slot 0
                          targetLeft = "0%";
                          targetTop = 0;
                          targetW = "100%";
                          targetH = 145;
                          targetScale = 1.0;
                          isExpanded = true;
                        }
                      } else {
                        // Cards C or D (remains in stable slots, transitions immediately to their new bottom slots)
                        const nextSlotIdx = getStableSlotIdx(score.name, bName!);
                        const slot = getSlotProps(nextSlotIdx);
                        targetLeft = slot.left;
                        targetTop = slot.top;
                        targetW = slot.width;
                        targetH = slot.height;
                        targetScale = 1.0;
                        isExpanded = false;
                      }
                    }

                    const isCurrentlyActiveVisual = choreographyStage === 'idle'
                      ? isPlaying
                      : (clickedScoreName ? (score.name === clickedScoreName) : isPlaying);

                    return (
                      <ScoreCard
                        key={score.name}
                        score={score}
                        rhythmicScore={rhythmicScore}
                        isPlaying={isPlaying}
                        isCurrentlyActiveVisual={isCurrentlyActiveVisual}
                        styleMode={styleMode}
                        targetLeft={targetLeft}
                        targetTop={targetTop}
                        targetW={targetW}
                        targetH={targetH}
                        targetScale={targetScale}
                        isExpanded={isExpanded}
                        startChoreographySwitch={startChoreographySwitch}
                        stopScore={stopScore}
                        playScore={playScore}
                        playPluck={playPluck}
                        currentPlayingNoteIdx={currentPlayingNoteIdx}
                        setCurrentPlayingNoteIdx={setCurrentPlayingNoteIdx}
                        notesScrollRef={notesScrollRef}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
        </section>

      {/* Full-Width Section: Tech and Education Hub */}
      <section 
        id="tech-and-education-hub"
        className="w-full"
      >
        <TechAndEducation styleMode={styleMode} playPluck={playPluck} />
        </section>

      {/* Poetic Oracle Section */}
      <section 
        id="oracle-section"
        className="w-full"
      >
        <PoeticOracle 
          styleMode={styleMode}
          activeSpot={activeSpot}
          activeSeason={activeSeason}
          activeWeather={activeWeather}
          playPluck={playPluck}
        />
      </section>

      </main>

      {/* Modern footer with attribution */}
      <footer 
        id="app-footer"
        className={`relative z-20 py-4 px-6 text-center border-t transition-colors duration-1000 text-xs
          ${styleMode === 'artistic' 
            ? 'border-emerald-950/5 text-[#2c2a25]/60 bg-[#ece8dd]/40' 
            : 'border-cyan-500/5 text-slate-500 bg-[#0f1420]/50'
          }`}
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className={styleMode === 'artistic' ? 'font-serif-sc' : 'font-mono'}>
            {styleMode === 'artistic' 
              ? '杭州西湖与数字城市 · 古典水墨与数字科技的融合之作' 
              : 'HANGZHOU SMART METROPOLIS GRID. TWIN SIMULATOR v1.4.2'}
          </p>
          <div className="flex items-center space-x-3">
            <span className="opacity-50">Host: westlake.ai.studio</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="opacity-50">© 2026 AI Studio</span>
          </div>
        </div>
      </footer>

      </div>

      {/* Immersive Lightbox Modal for Real-Scene Photos */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fade-in"
          onClick={() => setLightboxImage(null)}
        >
          {/* Close button */}
          <button 
            className="absolute top-4 right-4 z-50 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            onClick={() => setLightboxImage(null)}
          >
            <X className="w-6 h-6" />
          </button>

          <div 
            className="relative max-w-5xl w-full flex flex-col md:flex-row bg-zinc-950 rounded-2xl overflow-hidden border border-white/10 shadow-2xl animate-scale-up"
            onClick={e => e.stopPropagation()}
          >
            {/* Image side */}
            <div className="md:w-2/3 aspect-[16/10] md:aspect-auto md:h-[65vh] bg-zinc-900 relative">
              <img 
                src={lightboxImage.url} 
                alt={lightboxImage.caption} 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4">
                <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  {activeSpot?.name} · {activeWeather === 'sunny' ? '晴空' : activeWeather === 'rainy' ? '烟雨' : activeWeather === 'misty' ? '晨雾' : '暮色'}
                </span>
                <h4 className="text-white text-base md:text-lg font-bold mt-2 drop-shadow-md">
                  {lightboxImage.caption}
                </h4>
              </div>
            </div>

            {/* Poetic & Exif Metadata side */}
            <div className="md:w-1/3 p-6 flex flex-col justify-between bg-zinc-900 text-slate-300 border-t md:border-t-0 md:border-l border-white/5">
              <div className="space-y-5">
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500">
                    ◇ 意境品鉴 / POETIC VIBE
                  </span>
                  <p className="mt-2 text-sm italic font-serif-sc leading-relaxed text-slate-100">
                    “{lightboxImage.note}”
                  </p>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500">
                    ◇ 相机参数 / CAMERA CAPTURE
                  </span>
                  <div className="mt-2 bg-black/40 rounded-xl p-3 border border-white/5 space-y-1.5 font-mono text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">设备机身</span>
                      <span className="text-slate-300">{lightboxImage.settings.split(' • ')[0] || 'Sony α7'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">镜头规格</span>
                      <span className="text-slate-300">{lightboxImage.settings.split(' • ')[1] || '50mm F1.4'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">曝光设置</span>
                      <span className="text-slate-300">
                        {lightboxImage.settings.split(' • ').slice(2).join(' • ') || 'ISO 100 • 1/250s'}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500">
                    ◇ 创作者署名 / ARTIST CREDIT
                  </span>
                  <p className="mt-1.5 text-xs font-mono text-slate-300">
                    {lightboxImage.photographer}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span>PROJECT WESTLAKE</span>
                <span>RESOLVED AT 100%</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
