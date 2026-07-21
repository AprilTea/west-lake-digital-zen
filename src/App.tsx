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
  ChevronDown,
  ArrowUp,
  X,
  MapPin,
  Calendar,
  Layers,
  Award
} from 'lucide-react';
import { HANGZHOU_SEASONS_DATA, SeasonType, ScenicSpot } from './types';
import { WeatherType, SPOT_PHOTOS_DATA } from './photos';
import { motion, AnimatePresence } from 'motion/react';
import { CLASSICAL_SCORES, getMusicalScoreWithRhythms } from './data/musicData';
import { useGuqinAudio } from './hooks/useGuqinAudio';
import { AmbientScene } from './components/AmbientScene';
import { ScoreCard } from "./components/ScoreCard";
import { GuqinStrings } from "./components/GuqinStrings";
import { BackgroundParticles } from './components/BackgroundParticles';
import { PoeticOracle } from './components/PoeticOracle';
import { TechAndEducation } from './components/TechAndEducation';

// Definitions for fullscreen snap sections
const SECTIONS = [
  { id: 'hero', title: '题章 · 幻境启幕', eng: 'PROLOGUE', desc: '古典水墨与数字孪生的交融之美' },
  { id: 'map', title: '舆地 · 幻境地图', eng: 'DIGITAL TWIN MAP', desc: '西湖十景智能物联网感知底座' },
  { id: 'guqin', title: '乐章 · 琴韵和鸣', eng: 'GUQIN HARMONY', desc: '国风五音与实时 Web Audio 合成器' },
  { id: 'tech', title: '贤英 · 智联新篇', eng: 'INNOVATION HUB', desc: '杭州前沿高科技与学术生态' },
  { id: 'oracle', title: '灵启 · 西湖心印', eng: 'POETIC ORACLE', desc: '基于 Gemini AI 的古典诗意灵签' }
];

export default function App() {
  // State definitions
  const [activeSeason, setActiveSeason] = useState<SeasonType>('spring');
  const styleMode = 'artistic';
  const [hoveredSpot, setHoveredSpot] = useState<ScenicSpot | null>(null);
  const [activeSpot, setActiveSpot] = useState<ScenicSpot | null>(HANGZHOU_SEASONS_DATA[0].spots[0]);
  const [activeWeather, setActiveWeather] = useState<WeatherType>('sunny');
  const [lightboxImage, setLightboxImage] = useState<{ url: string; caption: string; photographer: string; settings: string; note: string } | null>(null);
  
  // Section Tracking via Intersection Observer
  const [activeSectionIdx, setActiveSectionIdx] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [smartStats, setSmartStats] = useState({
    pm25: 12,
    waterClarity: 1.8,
    soilMoisture: 45.3,
    smartGridLoad: 28.5,
    crowdFlow: '畅通'
  });

  const windSpeed = 50;

  // Guqin Audio custom hook
  const { 
    isMuted, 
    audioInited, 
    activeScore, 
    setActiveScore, 
    playingScoreName, 
    currentPlayingNoteIdx, 
    setCurrentPlayingNoteIdx, 
    isLooping, 
    setIsLooping, 
    playPluck, 
    playScore, 
    stopScore, 
    toggleMute, 
    initAudio 
  } = useGuqinAudio(styleMode);

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
        height: 125,
      };
    } else if (slotIdx === 1) {
      return {
        left: "0%",
        top: 138,
        width: "31%",
        height: 105,
      };
    } else if (slotIdx === 2) {
      return {
        left: "34.5%",
        top: 138,
        width: "31%",
        height: 105,
      };
    } else {
      return {
        left: "69%",
        top: 138,
        width: "31%",
        height: 105,
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
    
    setChoreographyStage('stage_align');
    
    setTimeout(() => {
      setChoreographyStage('stage_swap');
    }, 600);
    
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
      
      playScore(targetScore);
    }, 1100);
  };

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

  // Synchronize weather state when season changes
  useEffect(() => {
    if (activeSeason === 'spring') setActiveWeather('sunny');
    else if (activeSeason === 'summer') setActiveWeather('rainy');
    else if (activeSeason === 'autumn') setActiveWeather('misty');
    else if (activeSeason === 'winter') setActiveWeather('night');
    else if (activeSeason === 'tech') setActiveWeather('night');
  }, [activeSeason]);

  // Set up Intersection Observer for Scroll Snap Active Tracking
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute('data-section-idx'));
            if (!isNaN(index)) {
              setActiveSectionIdx(index);
            }
          }
        });
      },
      {
        root: null,
        threshold: 0.45, // Triggers when almost half the section is visible
      }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  // Keypress Support (Arrows, PageUp, PageDown)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        const nextIdx = Math.min(activeSectionIdx + 1, SECTIONS.length - 1);
        scrollToSection(nextIdx);
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        const nextIdx = Math.max(activeSectionIdx - 1, 0);
        scrollToSection(nextIdx);
      }
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSectionIdx]);

  const scrollToSection = (index: number) => {
    const target = sectionRefs.current[index];
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
      setActiveSectionIdx(index);
      playPluck(200 + index * 80);
    }
  };

  // Trigger Lightbox for current spot
  const handleOpenPhoto = () => {
    if (!activeSpot) return;
    const photo = SPOT_PHOTOS_DATA[activeSpot.name]?.[activeWeather];
    if (photo) {
      setLightboxImage({
        url: photo.url,
        caption: photo.caption,
        photographer: photo.photographer,
        settings: photo.cameraSettings,
        note: photo.poeticNote
      });
    }
  };

  return (
    <div 
      id="app-container"
      className="h-screen w-screen overflow-hidden bg-gradient-to-b from-[#FAF8F5] via-[#F3ECE1] to-[#FAF8F5] text-[#2c2a25] relative selection:bg-[#C9A96E]/30 selection:text-slate-900"
    >
      {/* Background Particles Canvas */}
      <BackgroundParticles 
        activeSeason={activeSeason} 
        styleMode={styleMode} 
        windSpeed={windSpeed} 
      />

      {/* Classical rice paper overlay texture in Artistic Mode */}
      {styleMode === 'artistic' && (
        <div 
          id="paper-texture"
          className="absolute inset-0 pointer-events-none opacity-[0.06] mix-blend-multiply z-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
          }}
        />
      )}

      {/* Elegant Ink Wash Mountain & Water Background Overlay */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-[0.35] select-none">
        {/* Layer 1: Distant misty mountains (charcoal wash) */}
        <svg className="absolute bottom-0 w-full h-[38%] min-h-[220px] text-[#b5ae9a]" viewBox="0 0 1440 300" preserveAspectRatio="none" opacity="0.3">
          <path fill="currentColor" d="M0,130 Q180,80 360,170 T720,110 T1080,180 T1440,120 L1440,300 L0,300 Z" />
        </svg>
        
        {/* Layer 2: Mid-distance mountains (softer ink wash) */}
        <svg className="absolute bottom-0 w-full h-[29%] min-h-[170px] text-[#9c937a]" viewBox="0 0 1440 300" preserveAspectRatio="none" opacity="0.4">
          <path fill="currentColor" d="M0,180 Q240,120 480,210 T960,150 T1440,210 L1440,300 L0,300 Z" />
        </svg>

        {/* Layer 3: Close-range shoreline and reeds */}
        <svg className="absolute bottom-0 w-full h-[16%] min-h-[100px] text-[#7c735d]" viewBox="0 0 1440 150" preserveAspectRatio="none" opacity="0.45">
          <path fill="currentColor" d="M0,105 Q360,85 720,115 T1440,95 L1440,150 L0,150 Z" />
        </svg>

        {/* Ink Wash Birds (Flock of birds flying) */}
        <div className="absolute top-[18%] left-[15%] w-48 h-24 opacity-60 animate-pulse-slow">
          <svg viewBox="0 0 100 50" className="w-full h-full text-[#4a463d]">
            <path d="M10,20 Q15,15 20,20 Q25,15 30,20" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
            <path d="M40,15 Q43,11 46,15 Q49,11 52,15" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
            <path d="M25,35 Q28,32 31,35 Q34,32 37,35" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
            <path d="M65,25 Q68,22 71,25 Q74,22 77,25" fill="none" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {/* Ambient Parallax Backdrop Orbs - smooth motion on active index changes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          animate={{
            x: activeSectionIdx === 0 ? '10vw' : activeSectionIdx === 1 ? '-20vw' : activeSectionIdx === 2 ? '30vw' : activeSectionIdx === 3 ? '-10vw' : '20vw',
            y: activeSectionIdx === 0 ? '10vh' : activeSectionIdx === 1 ? '40vh' : activeSectionIdx === 2 ? '-10vh' : activeSectionIdx === 3 ? '20vh' : '50vh',
            scale: activeSectionIdx % 2 === 0 ? 1.2 : 0.9,
          }}
          transition={{ type: 'spring', stiffness: 40, damping: 15 }}
          className="absolute w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-[#7FB5B0]/12 to-transparent blur-[120px]"
        />
        <motion.div
          animate={{
            x: activeSectionIdx === 0 ? '-10vw' : activeSectionIdx === 1 ? '20vw' : activeSectionIdx === 2 ? '-30vw' : activeSectionIdx === 3 ? '20vw' : '-10vw',
            y: activeSectionIdx === 0 ? '50vh' : activeSectionIdx === 1 ? '-10vh' : activeSectionIdx === 2 ? '40vh' : activeSectionIdx === 3 ? '-20vh' : '10vh',
            scale: activeSectionIdx % 2 === 0 ? 0.95 : 1.3,
          }}
          transition={{ type: 'spring', stiffness: 35, damping: 12 }}
          className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-[#C9A96E]/12 to-transparent blur-[100px]"
        />
      </div>

      {/* Fixed Header Row - Floats over all snap pages */}
      <header 
        id="main-header"
        className="fixed top-0 left-0 right-0 z-50 px-8 sm:px-12 py-5 flex items-center justify-between bg-transparent border-none transition-all duration-500"
      >
        <div className="flex items-center space-x-3">
          <div id="artistic-logo" className="flex items-center space-x-2">
            <span className="w-8 h-8 rounded-full bg-[#2c2a25] text-[#FAF8F5] flex items-center justify-center font-calligraphy text-lg font-bold shadow-md">
              印
            </span>
            <div className="overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSectionIdx}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                >
                  <h1 className="text-base sm:text-lg font-bold tracking-widest font-serif-sc text-[#2c2a25]">
                    {SECTIONS[activeSectionIdx].title}
                  </h1>
                  <p className="text-[9px] uppercase tracking-widest opacity-60 font-sans text-[#6e685c] mt-0.5">
                    {SECTIONS[activeSectionIdx].eng}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Floating Controls Dashboard */}
        <div className="flex items-center space-x-3">
          {/* Ambient Music Synthesizer Controller */}
          <button
            id="audio-toggle-btn"
            onClick={toggleMute}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full border text-xs tracking-wider transition-all duration-300 border-[#2c2a25]/15 hover:bg-[#2c2a25]/5 text-[#2c2a25]"
          >
            {isMuted ? (
              <>
                <VolumeX className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">无声</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 animate-bounce" />
                <span className="hidden sm:inline">听琴</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Right Fixed Pagination Indicator Column (Desktop only, md:flex) */}
      <div className="hidden md:flex fixed right-6 top-1/2 -translate-y-1/2 z-40 flex-col space-y-6">
        {SECTIONS.map((sec, idx) => {
          const isActive = activeSectionIdx === idx;
          return (
            <div 
              key={sec.id}
              onClick={() => scrollToSection(idx)}
              className="relative flex items-center justify-end cursor-pointer group"
            >
              {/* Tooltip Label */}
              <span className="absolute right-8 text-right pr-2 py-1.5 px-3 rounded-lg bg-[#FAF8F5]/95 text-[#2c2a25] text-[10px] font-medium tracking-wider uppercase border border-[#2c2a25]/10 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0 pointer-events-none shadow-md">
                <span className="text-[#845e2c] font-serif-sc block text-xs font-bold">{sec.title}</span>
                <span className="font-mono text-[8px] opacity-60 block mt-0.5">{sec.eng}</span>
              </span>

              {/* Dynamic Dot indicator */}
              <div 
                className={`w-3.5 h-3.5 rounded-full border transition-all duration-500 flex items-center justify-center
                  ${isActive 
                    ? 'border-[#2c2a25] bg-[#2c2a25]/10 scale-150'
                    : 'border-[#2c2a25]/20 bg-transparent hover:border-[#2c2a25]/60 hover:scale-125'
                  }`}
              >
                {/* Nested pulsing center circle */}
                <div className={`w-1.5 h-1.5 rounded-full transition-colors duration-300
                  ${isActive 
                    ? 'bg-[#2c2a25]' 
                    : 'bg-[#2c2a25]/20 group-hover:bg-[#2c2a25]/50'
                  }`} 
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile-Only Bottom Navigation Indicator Bar */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 md:hidden flex items-center space-x-3 bg-[#FAF8F5]/90 backdrop-blur-md px-4 py-2 rounded-full border border-[#2c2a25]/10 shadow-lg">
        {SECTIONS.map((sec, idx) => (
          <button
            key={sec.id}
            onClick={() => scrollToSection(idx)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              activeSectionIdx === idx 
                ? 'bg-[#2c2a25] scale-125'
                : 'bg-[#2c2a25]/20'
            }`}
          />
        ))}
      </div>

      {/* Master Scroll-Snap Container */}
      <div 
        ref={scrollContainerRef}
        className="h-full w-full overflow-y-scroll snap-y snap-mandatory overscroll-y-contain scrollbar-none"
        style={{ scrollbarWidth: 'none', scrollSnapType: 'y mandatory' }}
      >
        
        {/* ================= SECTION 1: HERO (题章 · 幻境启幕) ================= */}
        <div 
          ref={el => { sectionRefs.current[0] = el; }}
          data-section-idx={0}
          className="w-full h-screen snap-start flex flex-col justify-center items-center relative px-6 md:px-12 pt-20"
        >
          <div className="max-w-4xl text-center flex flex-col items-center justify-center space-y-6 md:space-y-8">
            {/* Tiny modern pre-header */}
            <div 
              className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full border text-[10px] tracking-widest font-semibold uppercase animate-fade-in
                ${activeSectionIdx === 0 
                  ? 'opacity-100 scale-100' 
                  : 'opacity-0 scale-95'
                } transition-all duration-1000 duration-500 bg-[#845e2c]/5 border-[#845e2c]/20 text-[#845e2c]`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#845e2c] animate-pulse" />
              <span>西湖数智幻境 · INTUITIVE METROPOLIS</span>
            </div>

            {/* Huge Staggered Headings */}
            <div className="space-y-2">
              <h1 
                className={`text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight font-serif-sc font-bold transition-all duration-1000 transform
                  ${activeSectionIdx === 0 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} text-transparent bg-clip-text bg-gradient-to-b from-[#1a1a18] via-[#33312c] to-[#7c694a]`}
              >
                数智西湖 · 杭州印象
              </h1>
              
              <h2 
                className={`text-sm sm:text-base md:text-lg tracking-[0.3em] font-english italic opacity-75 font-medium uppercase transition-all duration-1000 delay-200 transform
                  ${activeSectionIdx === 0 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'} text-[#845e2c]`}
              >
                West Lake Digital Twin Zenith
              </h2>
            </div>

            {/* Descriptive verse */}
            <p 
              className={`text-xs sm:text-sm md:text-base max-w-2xl text-[#4a463d] leading-relaxed font-sans font-medium transition-all duration-1000 delay-300 transform
                ${activeSectionIdx === 0 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
            >
              一湖一潮，水墨江南的优雅余韵；一网一智，数字城市的科技浪潮。
              在这里，古典意境与先进计算深度交融，重塑千年古都的数字孪生生命。
            </p>

            {/* Floating scroll down arrow indicator */}
            <div 
              onClick={() => scrollToSection(1)}
              className="absolute bottom-8 cursor-pointer flex flex-col items-center space-y-1 group hover:scale-105 transition-all duration-300"
            >
              <span className="text-[10px] uppercase tracking-widest text-[#6e685c] font-mono transition-colors group-hover:text-[#2c2a25]">
                开始幻境旅程 (Scroll Down)
              </span>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              >
                <ChevronDown className="w-5 h-5 text-[#845e2c]" />
              </motion.div>
            </div>
          </div>
        </div>

        {/* ================= SECTION 2: DIGITAL TWIN INTERACTIVE MAP (舆地 · 幻境地图) ================= */}
        <div 
          ref={el => { sectionRefs.current[1] = el; }}
          data-section-idx={1}
          className="w-full h-screen snap-start flex flex-col justify-center items-center px-4 sm:px-10 md:px-16 pt-24 pb-8 relative z-10"
        >
          <div className="w-full max-w-6xl flex-1 flex flex-col justify-between overflow-hidden">
            {/* Interactive Inner Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 flex-1 items-stretch overflow-hidden my-2">
              
              {/* Left Side: Interactive Map Visualizer (7 columns) */}
              <div 
                className="col-span-1 md:col-span-7 rounded-2xl relative overflow-hidden flex flex-col border border-[#2c2a25]/10 transition-all duration-1000 bg-[#fbf9f6]/45 shadow-sm"
              >
                {/* Top status indicator line */}
                <div className="absolute top-3 left-3 z-30 flex items-center space-x-2">
                  <span className="animate-ping w-2 h-2 rounded-full bg-[#845e2c]" />
                  <span className="text-[9px] tracking-wider font-mono text-[#6e685c]">
                    ● 水墨幻境感知系统
                  </span>
                </div>

                {/* Map SVG Component */}
                <div className="w-full h-full min-h-[180px] relative flex items-center justify-center">
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
                </div>
              </div>

              {/* Right Side: Active Spot Details & Photo Link (5 columns) */}
              <div className="col-span-1 md:col-span-5 flex flex-col justify-between space-y-3 overflow-y-auto pr-1">
                {activeSpot ? (
                  <div className="space-y-3 h-full flex flex-col justify-between">
                    {/* Header Spot Title */}
                    <div className="bg-[#f5f1ea]/80 border border-[#2c2a25]/10 rounded-xl p-3 relative overflow-hidden">
                      <div className="absolute right-3 top-2 opacity-[0.06] font-calligraphy text-4xl font-bold select-none text-red-700 leading-none">
                        西湖景
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-3.5 h-3.5 text-[#845e2c]" />
                        <h4 className="text-sm font-bold tracking-wider text-[#845e2c] font-serif-sc">
                          {activeSpot.name}
                        </h4>
                      </div>
                      
                      <p className="text-[11px] opacity-90 mt-1.5 italic font-serif-sc text-[#4a463d]">
                        “{activeSpot.poeticVerse}”
                      </p>
                    </div>

                    {/* Spot content description details */}
                    <div className="space-y-3 flex-1 overflow-y-auto py-1">
                      <div>
                        <span className="text-[9px] uppercase tracking-wider text-[#845e2c] block mb-0.5 font-mono font-semibold">
                          ◇ 景色赏析 (Vibe Description)
                        </span>
                        <p className="text-xs leading-relaxed text-[#33312c] font-medium">
                          {activeSpot.description}
                        </p>
                      </div>

                      <div className="border-l-2 border-[#845e2c]/30 pl-2.5">
                        <span className="text-[9px] uppercase tracking-wider text-[#845e2c] block mb-0.5 font-mono font-semibold">
                          ✦ 智能物联网感知 (IoT Monitoring)
                        </span>
                        <p className="text-xs leading-relaxed text-[#4a463d] font-medium">
                          {activeSpot.techAspect}
                        </p>
                      </div>
                    </div>

                    {/* Scenic photo preview & click-to-lightbox */}
                    {SPOT_PHOTOS_DATA[activeSpot.name]?.[activeWeather] && (
                      <div 
                        onClick={handleOpenPhoto}
                        className="group relative h-20 sm:h-24 rounded-xl overflow-hidden border border-[#2c2a25]/10 cursor-pointer shadow-sm transition-all duration-300 hover:border-[#845e2c]"
                      >
                        <img 
                          src={SPOT_PHOTOS_DATA[activeSpot.name][activeWeather].url} 
                          alt={activeSpot.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 brightness-[0.9] group-hover:brightness-100"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#2c2a25]/60 via-transparent to-transparent" />
                        <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between">
                          <span className="text-[10px] text-white font-serif-sc font-medium truncate">
                            📷 {SPOT_PHOTOS_DATA[activeSpot.name][activeWeather].caption.slice(0, 16)}...
                          </span>
                          <span className="text-[8px] font-mono tracking-widest text-[#845e2c] bg-white/90 px-2 py-0.5 rounded border border-[#2c2a25]/10 group-hover:bg-[#2c2a25] group-hover:text-white transition-colors font-semibold">
                            查看实像 EXIF
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-xs text-[#6e685c] font-serif-sc">
                    请在左侧地图上选取任意景点
                  </div>
                )}
              </div>
            </div>

            {/* Environmental Sensors stats overlay banner at bottom */}
            <div 
              id="sensors-bar"
              className="grid grid-cols-2 sm:grid-cols-4 gap-2 border-t border-[#2c2a25]/5 pt-3 mt-1"
            >
              <div className="bg-[#fbf9f6]/45 border border-[#2c2a25]/10 p-2 rounded-xl flex items-center space-x-2.5 shadow-[0_1px_4px_rgba(44,42,37,0.01)]">
                <Activity className="w-3.5 h-3.5 text-[#3d6964] shrink-0" />
                <div>
                  <p className="text-[8px] text-[#6e685c] uppercase font-mono">PM2.5 空气</p>
                  <p className="text-xs font-mono font-bold text-[#3d6964]">{smartStats.pm25} μg/m³</p>
                </div>
              </div>
              <div className="bg-[#fbf9f6]/45 border border-[#2c2a25]/10 p-2 rounded-xl flex items-center space-x-2.5 shadow-[0_1px_4px_rgba(44,42,37,0.01)]">
                <CloudRain className="w-3.5 h-3.5 text-[#36496b] shrink-0" />
                <div>
                  <p className="text-[8px] text-[#6e685c] uppercase font-mono">水质透光度</p>
                  <p className="text-xs font-mono font-bold text-[#36496b]">{smartStats.waterClarity} 米</p>
                </div>
              </div>
              <div className="bg-[#fbf9f6]/45 border border-[#2c2a25]/10 p-2 rounded-xl flex items-center space-x-2.5 shadow-[0_1px_4px_rgba(44,42,37,0.01)]">
                <Wind className="w-3.5 h-3.5 text-[#2d5c32] shrink-0" />
                <div>
                  <p className="text-[8px] text-[#6e685c] uppercase font-mono">生态土壤湿度</p>
                  <p className="text-xs font-mono font-bold text-[#2d5c32]">{smartStats.soilMoisture}%</p>
                </div>
              </div>
              <div className="bg-[#fbf9f6]/45 border border-[#2c2a25]/10 p-2 rounded-xl flex items-center space-x-2.5 shadow-[0_1px_4px_rgba(44,42,37,0.01)]">
                <Clock className="w-3.5 h-3.5 text-[#73511f] shrink-0" />
                <div>
                  <p className="text-[8px] text-[#6e685c] uppercase font-mono">智网低耗负载</p>
                  <p className="text-xs font-mono font-bold text-[#73511f]">{smartStats.smartGridLoad}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= SECTION 3: CLASSICAL GUQIN SYNTHESIZER (乐章 · 琴韵和鸣) ================= */}
        <div 
          ref={el => { sectionRefs.current[2] = el; }}
          data-section-idx={2}
          className="w-full h-screen snap-start flex flex-col justify-center items-center px-4 sm:px-10 md:px-16 pt-24 pb-8 relative z-10"
        >
          <div className="w-full max-w-6xl flex-1 flex flex-col justify-between overflow-hidden">
            {/* Header / Sub-controls Row */}
            <div className="flex items-center justify-between border-b border-[#2c2a25]/10 pb-3">
              <span className="text-[11px] block uppercase tracking-wider font-bold text-[#845e2c] font-serif-sc">
                五音古琴 (Pentatonic Scale)
              </span>
              
              <div className="flex items-center space-x-2">
                {/* Loop Toggle Button */}
                <button
                  onClick={() => setIsLooping(!isLooping)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-semibold flex items-center space-x-1 transition-all duration-300 border ${
                    isLooping
                      ? 'bg-[#2c2a25] border-[#2c2a25] text-white font-bold'
                      : 'bg-[#fbf9f6]/45 border-[#2c2a25]/15 text-[#6e685c]'
                  }`}
                >
                  <span>🔁 {isLooping ? '循环: 开' : '循环: 关'}</span>
                </button>

                {playingScoreName && (
                  <span className="text-[9px] sm:text-[10px] text-red-800 animate-pulse flex items-center space-x-1 bg-red-100/50 px-2.5 py-1 rounded-lg border border-red-200">
                    <span className="inline-block w-1.5 h-1.5 bg-red-700 rounded-full animate-ping" />
                    <span className="hidden sm:inline">正在演奏...</span>
                  </span>
                )}
              </div>
            </div>

            {/* Guqin strings chimes soundboard (Gong, Shang, Jue, Zhi, Yu) */}
            <div className="my-3">
              <GuqinStrings
                styleMode={styleMode}
                playingScoreName={playingScoreName}
                activeScore={activeScore}
                currentPlayingNoteIdx={currentPlayingNoteIdx}
                playPluck={playPluck}
              />
            </div>

            {/* Classical Scenic Scores list and circular scroll notes */}
            <div className="border-t border-[#2c2a25]/10 pt-3 flex-1 flex flex-col justify-between overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] block uppercase tracking-wider font-bold text-[#4a463d] font-serif-sc">
                  西湖琴谱 (Guqin Scores)
                </span>
              </div>

              {/* Score selector choreographic board */}
              <div className="relative w-full h-[225px] sm:h-[240px] mb-1">
                {orderedScores.map((score) => {
                  const isPlaying = playingScoreName === score.name;
                  const rhythmicScore = getMusicalScoreWithRhythms(score);
                  
                  const getStableSlotIdx = (name: string, active: string) => {
                    if (name === active) return 0;
                    const inactives = CLASSICAL_SCORES.map(s => s.name).filter(n => n !== active);
                    const inactiveIdx = inactives.indexOf(name);
                    return inactiveIdx + 1; // slots 1, 2, 3
                  };

                  let targetLeft = "0%";
                  let targetTop = 0;
                  let targetW = "100%";
                  let targetH = 115;
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

                    const idxA = CLASSICAL_SCORES.findIndex(s => s.name === aName);
                    const idxB = CLASSICAL_SCORES.findIndex(s => s.name === bName);
                    const isALeftOfB = idxA < idxB;

                    if (score.name === aName) {
                      if (choreographyStage === 'stage_align') {
                        targetLeft = isALeftOfB ? "0%" : "51.5%";
                        targetTop = 0;
                        targetW = "48.5%";
                        targetH = 100;
                        targetScale = 1.0;
                        isExpanded = false;
                      } else {
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
                      if (choreographyStage === 'stage_align') {
                        targetLeft = isALeftOfB ? "51.5%" : "0%";
                        targetTop = 0;
                        targetW = "48.5%";
                        targetH = 100;
                        targetScale = 1.0;
                        isExpanded = false;
                      } else {
                        targetLeft = "0%";
                        targetTop = 0;
                        targetW = "100%";
                        targetH = 115;
                        targetScale = 1.0;
                        isExpanded = true;
                      }
                    } else {
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
        </div>

        {/* ================= SECTION 4: INNOVATION & ACADEMIC HUB (贤英 · 智联新篇) ================= */}
        <div 
          ref={el => { sectionRefs.current[3] = el; }}
          data-section-idx={3}
          className="w-full h-screen snap-start flex flex-col justify-center items-center px-4 sm:px-10 md:px-16 pt-24 pb-8 relative z-10"
        >
          <div className="w-full max-w-6xl flex-1 flex flex-col justify-between overflow-hidden">
            {/* Smart City tech hub component */}
            <div className="flex-1 my-2 overflow-y-auto">
              <TechAndEducation styleMode={styleMode} playPluck={playPluck} />
            </div>

            {/* Dynamic metrics description footer */}
            <div className="border-t border-[#2c2a25]/10 pt-3 flex items-center justify-between text-[10px] font-sans text-[#6e685c] font-medium">
              <div className="flex items-center space-x-2">
                <Layers className="w-3.5 h-3.5 text-[#845e2c]" />
                <span>实时前沿科创雷达: 已接入杭州市智能算力服务网络</span>
              </div>
              <span className="hidden sm:inline">数智创新节点 · 杭州</span>
            </div>
          </div>
        </div>

        {/* ================= SECTION 5: POETIC ORACLE (灵启 · 西湖心印) ================= */}
        <div 
          ref={el => { sectionRefs.current[4] = el; }}
          data-section-idx={4}
          className="w-full h-screen snap-start flex flex-col justify-center items-center px-4 sm:px-10 md:px-16 pt-24 pb-8 relative z-10"
        >


          <div className="w-full max-w-6xl flex-1 flex flex-col justify-between overflow-hidden">
            {/* Oracle card and cylinder drawer */}
            <div className="flex-1 my-2 overflow-y-auto pr-1">
              <PoeticOracle 
                styleMode={styleMode}
                activeSpot={activeSpot}
                activeSeason={activeSeason}
                activeWeather={activeWeather}
                playPluck={playPluck}
              />
            </div>

            {/* Footer with project credits */}
            <footer 
              id="app-footer"
              className="border-t border-[#2c2a25]/10 pt-3 flex flex-col sm:flex-row items-center justify-between text-[11px] font-sans gap-2 text-[#6e685c] font-medium"
            >
              <p className="font-serif-sc text-[#4a463d]">
                杭州西湖与数字城市 · 古典水墨与数字科技的融合之作
              </p>
              <div className="flex items-center space-x-3 text-[10px] font-mono text-[#6e685c]">
                <span>westlake.ai.studio</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#845e2c]" />
                <span>© 2026 AI Studio</span>
              </div>
            </footer>
          </div>
        </div>

      </div>

      {/* Immersive Lightbox Modal for Real-Scene Photos (EXIF Camera Stats) */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl"
            onClick={() => setLightboxImage(null)}
          >
            {/* Close button */}
            <button 
              className="absolute top-4 right-4 z-50 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors border border-white/10"
              onClick={() => setLightboxImage(null)}
            >
              <X className="w-6 h-6" />
            </button>

            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative max-w-5xl w-full flex flex-col md:flex-row bg-zinc-950 rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#C9A96E] bg-slate-950/80 px-2.5 py-1 rounded-full border border-[#C9A96E]/20">
                    {activeSpot?.name} · {activeWeather === 'sunny' ? '晴空' : activeWeather === 'rainy' ? '烟雨' : activeWeather === 'misty' ? '晨雾' : '暮色'}
                  </span>
                  <h4 className="text-white text-base md:text-lg font-bold mt-2.5 drop-shadow-md">
                    {lightboxImage.caption}
                  </h4>
                </div>
              </div>

              {/* Poetic & Exif Metadata side */}
              <div className="md:w-1/3 p-6 flex flex-col justify-between bg-zinc-900 text-slate-300 border-t md:border-t-0 md:border-l border-white/5">
                <div className="space-y-5">
                  <div>
                    <span className="text-[9px] uppercase font-mono tracking-wider text-slate-500 block">
                      ◇ 意境品鉴 / POETIC VIBE
                    </span>
                    <p className="mt-2 text-sm italic font-serif-sc leading-relaxed text-slate-100">
                      “{lightboxImage.note}”
                    </p>
                  </div>

                  <div>
                    <span className="text-[9px] uppercase font-mono tracking-wider text-slate-500 block">
                      ◇ 相机物理参数 / CAMERA EXIF
                    </span>
                    <div className="mt-2 bg-black/40 rounded-xl p-3 border border-white/5 space-y-1.5 font-mono text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-500">设备机身</span>
                        <span className="text-slate-300 truncate pl-3">{lightboxImage.settings.split(' • ')[0] || 'Sony α7'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">镜头规格</span>
                        <span className="text-slate-300 truncate pl-3">{lightboxImage.settings.split(' • ')[1] || '50mm F1.4'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">曝光设置</span>
                        <span className="text-slate-300 truncate pl-3">
                          {lightboxImage.settings.split(' • ').slice(2).join(' • ') || 'ISO 100 • 1/250s'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <span className="text-[9px] uppercase font-mono tracking-wider text-slate-500 block">
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
