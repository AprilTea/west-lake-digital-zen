import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  RotateCcw, 
  Compass
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { POETIC_ORACLES, ScenicSpot, SeasonType } from '../types';
import { WeatherType } from '../photos';

const YinYangBaguaIcon = ({ className }: { className?: string }) => {
  return (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
      <g stroke="currentColor" fill="none" strokeLinecap="round">
        {/* Bagua Trigrams around the edge */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
          <g key={i} transform={`rotate(${angle} 50 50)`}>
            <line x1="42" y1="6" x2="58" y2="6" strokeWidth="2.5" />
            <line x1="42" y1="12" x2="48" y2="12" strokeWidth="2.5" />
            <line x1="52" y1="12" x2="58" y2="12" strokeWidth="2.5" />
            <line x1="42" y1="18" x2="58" y2="18" strokeWidth="2.5" />
          </g>
        ))}
        {/* Inner circle */}
        <circle cx="50" cy="50" r="28" strokeWidth="1.5" />
      </g>
      {/* Yin Yang */}
      <g transform="translate(50, 50)">
        {/* Yang (Light) */}
        <path d="M 0 -25 A 25 25 0 0 1 0 25 A 12.5 12.5 0 0 1 0 0 A 12.5 12.5 0 0 0 0 -25" fill="currentColor" />
        {/* Dots */}
        <circle cx="0" cy="-12.5" r="3.5" fill="var(--bg-color, white)" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="0" cy="12.5" r="4.5" fill="currentColor" />
      </g>
      <circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
};

interface PoeticOracleProps {
  styleMode: 'artistic' | 'geometric';
  activeSpot: ScenicSpot | null;
  activeSeason: SeasonType;
  activeWeather: WeatherType;
  playPluck: (freq: number) => void;
}

export function PoeticOracle({
  styleMode,
  activeSpot,
  activeSeason,
  activeWeather,
  playPluck,
}: PoeticOracleProps) {
  // Oracle States
  const [oracleCard, setOracleCard] = useState<(typeof POETIC_ORACLES[0] & { poem?: string[] }) | null>(null);
  const [isGeneratingOracle, setIsGeneratingOracle] = useState(false);
  const [isDroppingOracle, setIsDroppingOracle] = useState(false);
  const [oracleDropTarget, setOracleDropTarget] = useState({ x: 0, y: 145, rotate: 15 });
  const [oraclePurpose, setOraclePurpose] = useState<'serendipity' | 'inspiration' | 'career' | 'mindfulness'>('serendipity');
  const [oracleQuestion, setOracleQuestion] = useState('');
  const [useAiOracle, setUseAiOracle] = useState(false);

  const handleDrawOracle = async () => {
    if (isGeneratingOracle || isDroppingOracle) return;
    
    // Generate random drop target below the cylinder
    const randX = (Math.random() - 0.5) * 150; // -75px to 75px
    const randY = 135 + Math.random() * 25;     // 135px to 160px
    const randRot = (Math.random() - 0.5) * 110; // -55 to 55 degrees
    setOracleDropTarget({ x: randX, y: randY, rotate: randRot });
    
    setIsGeneratingOracle(true);
    setOracleCard(null); // Clear previous card
    
    // Play drawing sound effect
    playPluck(392.00); // G4
    setTimeout(() => playPluck(523.25), 150); // C5
    
    const finishDrawing = (cardData: any) => {
      setIsGeneratingOracle(false);
      setIsDroppingOracle(true);
      playPluck(523.25); // Drop start sound
      setTimeout(() => {
        setIsDroppingOracle(false);
        setOracleCard(cardData);
        playPluck(659.25); // Card reveal sound E5
      }, 1400); // Wait for the drop animation
    };

    if (useAiOracle) {
      try {
        const response = await fetch("/api/oracle", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            purpose: oraclePurpose,
            customQuestion: oracleQuestion,
            spot: activeSpot?.name || "西湖",
            season: activeSeason,
            weather: activeWeather,
            styleMode: styleMode
          })
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || "API returned error status");
        }

        const data = await response.json();
        finishDrawing(data);
      } catch (error: any) {
        console.warn("AI Oracle generation failed, falling back to traditional:", error);
        // Fallback to traditional drawing
        const randomIndex = Math.floor(Math.random() * POETIC_ORACLES.length);
        setTimeout(() => {
          finishDrawing({
            ...POETIC_ORACLES[randomIndex],
            title: POETIC_ORACLES[randomIndex].title + " (传统签)"
          });
        }, 1200);
      }
    } else {
      // Traditional drawing
      const randomIndex = Math.floor(Math.random() * POETIC_ORACLES.length);
      setTimeout(() => {
        finishDrawing(POETIC_ORACLES[randomIndex]);
      }, 1200);
    }
  };
return (
    <div 
      id="oracle-generator-card"
      className={`p-6 rounded-2xl border transition-all duration-1000 flex flex-col justify-between relative overflow-hidden
        ${(isGeneratingOracle || isDroppingOracle) ? 'bg-transparent border-transparent shadow-none' : 
          (styleMode === 'artistic' 
            ? 'bg-[#fbf8f2] border-transparent shadow-[0_4px_24px_rgba(40,30,10,0.02)]' 
            : 'bg-[#111622] border-cyan-500/10 shadow-lg')
        }`}
    >
      {/* Draw Loader Overlay covering the ENTIRE card */}
      <AnimatePresence>
        {(isGeneratingOracle || isDroppingOracle) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center z-30 p-6 text-center select-none pointer-events-none"
          >
            {/* Background Overlay */}
            <motion.div 
              className={`absolute inset-0 ${styleMode === 'artistic' ? 'bg-[#fdfbf7]/98' : 'bg-[#0c0f17]/98'} pointer-events-auto`}
              initial={{ opacity: 0 }}
              animate={{ opacity: isDroppingOracle ? 0 : 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
            {styleMode === 'artistic' ? (
              <div className="flex flex-col items-center justify-center space-y-7 relative w-full h-full">
                {/* Beautiful Rotating Trigram / Yin-Yang watermark */}
                <motion.svg
                  className="absolute w-72 h-72 text-amber-900/60 pointer-events-none"
                  viewBox="0 0 100 100"
                  initial={{ opacity: 0.04 }}
                  animate={{ rotate: 360, opacity: isDroppingOracle ? 0 : 0.04 }}
                  transition={{ rotate: { duration: 35, repeat: Infinity, ease: "linear" }, opacity: { duration: 0.3 } }}
                >
                  <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="0.4" strokeDasharray="3 3" />
                  <circle cx="50" cy="50" r="39" fill="none" stroke="currentColor" strokeWidth="0.7" />
                  <circle cx="50" cy="50" r="28" fill="none" stroke="currentColor" strokeWidth="0.4" />
                  {Array.from({ length: 8 }).map((_, i) => {
                    const angle = (i * 45 * Math.PI) / 180;
                    const x1 = 50 + 28 * Math.cos(angle);
                    const y1 = 50 + 28 * Math.sin(angle);
                    const x2 = 50 + 39 * Math.cos(angle);
                    const y2 = 50 + 39 * Math.sin(angle);
                    return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="0.8" />;
                  })}
                  <path d="M 50,22 A 14,14 0 0,0 50,50 A 14,14 0 0,1 50,78 A 28,28 0 0,0 50,22 Z" fill="currentColor" opacity="0.12" />
                </motion.svg>

                {/* Traditional Shaker cylinder + stick selected */}
                <div className="relative w-28 h-28 flex items-center justify-center">
                  {/* Shaking Bamboo Cylinder */}
                  <motion.div
                    animate={{
                      opacity: isDroppingOracle ? 0 : 1,
                      ...(isGeneratingOracle ? { rotate: [-6, 6, -6], y: [-2, 2, -2] } : { rotate: 0, y: 0 })
                    }}
                    transition={{
                      opacity: { duration: 0.3 },
                      ...(isGeneratingOracle ? { duration: 0.2, repeat: Infinity, ease: "linear" } : { duration: 0.3 })
                    }}
                    className="relative w-20 h-24 flex items-center justify-center"
                  >
                    {/* Inside/Background Sticks */}
                    <motion.div 
                      className="absolute left-3.5 w-1.5 h-15 bg-gradient-to-b from-[#dc2626] from-15% via-[#d97706] to-[#78350f] rounded-t shadow-sm z-0"
                      animate={isGeneratingOracle ? { y: [0, -4, 0] } : { y: 0 }}
                      transition={isGeneratingOracle ? { repeat: Infinity, duration: 0.22, ease: "linear", delay: 0.05 } : { duration: 0.3 }}
                      style={{ top: "-18px" }}
                    />
                    <motion.div 
                      className="absolute left-6.5 w-1.5 h-16 bg-gradient-to-b from-[#dc2626] from-15% via-[#d97706] to-[#78350f] rounded-t shadow-sm z-0"
                      animate={isGeneratingOracle ? { y: [0, -5, 0] } : { y: 0 }}
                      transition={isGeneratingOracle ? { repeat: Infinity, duration: 0.18, ease: "linear", delay: 0.1 } : { duration: 0.3 }}
                      style={{ top: "-24px" }}
                    />
                    <motion.div 
                      className="absolute left-9.5 w-1.5 h-15 bg-gradient-to-b from-[#dc2626] from-15% via-[#d97706] to-[#78350f] rounded-t shadow-sm z-0"
                      animate={isGeneratingOracle ? { y: [0, -4, 0] } : { y: 0 }}
                      transition={isGeneratingOracle ? { repeat: Infinity, duration: 0.25, ease: "linear", delay: 0.05 } : { duration: 0.3 }}
                      style={{ top: "-21px" }}
                    />
                    <motion.div 
                      className="absolute left-12.5 w-1.5 h-16 bg-gradient-to-b from-[#dc2626] from-15% via-[#d97706] to-[#78350f] rounded-t shadow-sm z-0"
                      animate={isGeneratingOracle ? { y: [0, -4, 0] } : { y: 0 }}
                      transition={isGeneratingOracle ? { repeat: Infinity, duration: 0.23, ease: "linear", delay: 0.15 } : { duration: 0.3 }}
                      style={{ top: "-23px" }}
                    />
                    <motion.div 
                      className="absolute left-15 w-1.5 h-14 bg-gradient-to-b from-[#dc2626] from-15% via-[#d97706] to-[#78350f] rounded-t shadow-sm z-0"
                      animate={isGeneratingOracle ? { y: [0, -3, 0] } : { y: 0 }}
                      transition={isGeneratingOracle ? { repeat: Infinity, duration: 0.21, ease: "linear", delay: 0.2 } : { duration: 0.3 }}
                      style={{ top: "-17px" }}
                    />

                    {/* Gilded drawn stick (rises up in step 3, otherwise hidden inside) */}
                    <motion.div
                      initial={{ y: 22, opacity: 0 }}
                      animate={{
                        y: isDroppingOracle ? -36 : 22,
                        opacity: 1,
                        scale: isDroppingOracle ? 1.1 : 0.95,
                        boxShadow: isDroppingOracle 
                          ? "0 0 15px rgba(245,158,11,0.4)" 
                          : "0 0 0px rgba(0,0,0,0)"
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 80,
                        damping: 14
                      }}
                      className="absolute left-1/2 -translate-x-1/2 w-4.5 h-20 bg-gradient-to-b from-[#dc2626] from-15% via-[#d97706] to-[#78350f] rounded-t border border-[#d97706]/30 flex flex-col items-center justify-between py-2 px-0.5 text-[#fef3c7] z-10"
                    >
                      <div className="w-1 h-1 bg-yellow-400 rounded-full opacity-60 animate-pulse" />
                      <div className="text-[8px] font-serif-sc font-extrabold tracking-widest text-center text-amber-100 select-none drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)] leading-tight" style={{ writingMode: 'vertical-rl' }}>
                        上签
                      </div>
                      <div className="w-0.5 h-2 bg-[#dc2626] rounded-full opacity-60" />
                    </motion.div>

                    {/* Solid Front plate of the Cylinder (covers bottom half of sticks) */}
                    <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-b from-[#7c5635] via-[#5c3e25] to-[#3a2615] border-2 border-[#8e6542]/40 rounded-b-3xl shadow-lg flex flex-col justify-between pt-3 pb-3 px-1 z-20 pointer-events-none">
                      {/* Beautiful gold border line or pattern on the cylinder */}
                      <div className="absolute inset-1 border border-amber-500/10 rounded-b-2xl pointer-events-none" />
                      
                      <div className="text-center">
                        <span className="text-[10px] text-amber-200/60 font-serif-sc tracking-widest font-bold block">
                          西湖签筒
                        </span>
                        <span className="text-[6px] text-amber-500/40 font-mono tracking-widest block uppercase mt-0.5">
                          West Lake
                        </span>
                      </div>

                      {/* Subtle water wave pattern at the bottom of the cylinder */}
                      <div className="flex justify-center opacity-25">
                        <svg className="w-10 h-2.5 text-amber-400" viewBox="0 0 24 6" fill="currentColor">
                          <path d="M0 3 Q 3 0, 6 3 T 12 3 T 18 3 T 24 3 L 24 6 L 0 6 Z" />
                        </svg>
                      </div>
                    </div>

                    {/* Left Hand wrapping around cylinder */}
                    <div className="absolute -left-7 bottom-1 w-12 h-16 z-30 pointer-events-none drop-shadow-[2px_3px_5px_rgba(58,38,21,0.25)]">
                      <svg className="w-full h-full text-amber-200/90 dark:text-amber-100/85" viewBox="0 0 48 64" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M 2,58 C 4,50 8,44 13,38 C 17,33 21,30 26,30 C 31,30 35,32 34,35 C 32,38 27,39 22,39" fill="currentColor" fillOpacity="0.15" />
                        <path d="M 11,46 C 15,41 20,36 26,36 C 30,36 34,38 33,40 C 31,42 26,43 22,43" stroke="currentColor" strokeWidth="1.2" />
                        <path d="M 10,51 C 14,46 19,41 25,41 C 29,41 33,43 32,45 C 30,47 25,48 21,48" stroke="currentColor" strokeWidth="1.2" />
                        <path d="M 8,56 C 12,51 17,46 23,46 C 27,46 31,48 30,50 C 28,52 24,53 20,53" stroke="currentColor" strokeWidth="1.2" />
                        <path d="M 5,50 C 9,48 13,44 17,44 C 21,44 24,46 22,48 C 20,50 15,52 11,52" stroke="currentColor" strokeWidth="1.5" />
                      </svg>
                    </div>

                    {/* Right Hand wrapping around cylinder */}
                    <div className="absolute -right-7 bottom-1 w-12 h-16 z-30 pointer-events-none scale-x-[-1] drop-shadow-[-2px_3px_5px_rgba(58,38,21,0.25)]">
                      <svg className="w-full h-full text-amber-200/90 dark:text-amber-100/85" viewBox="0 0 48 64" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M 2,58 C 4,50 8,44 13,38 C 17,33 21,30 26,30 C 31,30 35,32 34,35 C 32,38 27,39 22,39" fill="currentColor" fillOpacity="0.15" />
                        <path d="M 11,46 C 15,41 20,36 26,36 C 30,36 34,38 33,40 C 31,42 26,43 22,43" stroke="currentColor" strokeWidth="1.2" />
                        <path d="M 10,51 C 14,46 19,41 25,41 C 29,41 33,43 32,45 C 30,47 25,48 21,48" stroke="currentColor" strokeWidth="1.2" />
                        <path d="M 8,56 C 12,51 17,46 23,46 C 27,46 31,48 30,50 C 28,52 24,53 20,53" stroke="currentColor" strokeWidth="1.2" />
                        <path d="M 5,50 C 9,48 13,44 17,44 C 21,44 24,46 22,48 C 20,50 15,52 11,52" stroke="currentColor" strokeWidth="1.5" />
                      </svg>
                    </div>
                  </motion.div>

                  {/* Elegantly Tumbling Selected Stick falling down to a random position */}
                  {isDroppingOracle && (
                    <motion.div
                      initial={{ y: -36, x: 0, rotate: 0, opacity: 1, scale: 1.1 }}
                      animate={{
                        y: oracleDropTarget.y,
                        x: oracleDropTarget.x,
                        rotate: oracleDropTarget.rotate,
                        opacity: 1,
                        scale: 1
                      }}
                      transition={{
                        y: { type: "spring", bounce: 0.5, duration: 1.2 },
                        x: { type: "spring", bounce: 0, duration: 1.2 },
                        rotate: { type: "spring", bounce: 0.3, duration: 1.2 },
                        scale: { duration: 0.8, ease: "easeOut" },
                        opacity: { duration: 0.3 }
                      }}
                      className="absolute w-5 h-24 bg-gradient-to-b from-[#fcd34d] via-[#f59e0b] to-[#b45309] rounded-t-sm border border-yellow-300 flex flex-col items-center justify-between py-2.5 px-0.5 shadow-[0_0_20px_rgba(251,191,36,0.6)] z-25 text-amber-900"
                    >
                      <div className="w-1.5 h-1.5 bg-yellow-100 rounded-full opacity-90 shadow-[0_0_5px_white]" />
                      <div className="text-[10px] font-serif-sc font-extrabold tracking-widest text-center text-amber-900 select-none drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)] leading-tight" style={{ writingMode: 'vertical-rl' }}>
                        西湖灵签
                      </div>
                      <div className="w-1 h-3 bg-[#b45309] rounded-full opacity-60" />
                    </motion.div>
                  )}
                </div>

                <motion.div className="space-y-2 relative z-10" animate={{ opacity: isDroppingOracle ? 0 : 1 }} transition={{ duration: 0.3 }}>
                  <p className="text-sm font-serif-sc text-zinc-800 font-bold tracking-widest min-h-[20px] transition-all duration-300">
                    {isGeneratingOracle && "凝心定念，西湖赐签..."}
                    
                    
                    {isDroppingOracle && "天机乍现..."}
                  </p>
                  <p className="text-[10px] text-zinc-500 font-serif-sc">
                    正在虔诚摇取今日诗意灵气，静待水墨丹青生成...
                  </p>
                </motion.div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center space-y-7 relative w-full h-full">
                {/* Glowing Holographic Matrix Radar Background */}
                <motion.svg
                  className="absolute w-80 h-80 text-cyan-400 pointer-events-none"
                  viewBox="0 0 100 100"
                  initial={{ opacity: 0.08 }}
                  animate={{ rotate: -360, opacity: isDroppingOracle ? 0 : 0.08 }}
                  transition={{ rotate: { duration: 30, repeat: Infinity, ease: "linear" }, opacity: { duration: 0.3 } }}
                >
                  <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.3" />
                  <circle cx="50" cy="50" r="41" fill="none" stroke="currentColor" strokeWidth="0.2" strokeDasharray="1 3" />
                  <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="0.6" />
                  {Array.from({ length: 12 }).map((_, i) => {
                    const angle = (i * 30 * Math.PI) / 180;
                    const x1 = 50 + 30 * Math.cos(angle);
                    const y1 = 50 + 30 * Math.sin(angle);
                    const x2 = 50 + 48 * Math.cos(angle);
                    const y2 = 50 + 48 * Math.sin(angle);
                    return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="0.4" opacity="0.5" />;
                  })}
                </motion.svg>

                {/* Holographic Glowing Shuffle Cards */}
                <motion.div className="relative w-48 h-28 flex items-center justify-center" animate={{ opacity: isDroppingOracle ? 0 : 1 }} transition={{ duration: 0.3 }}>
                  <motion.div 
                    animate={{ rotate: [-12, -12], x: [-22, -22], scale: [0.85, 0.85] }} 
                    className="absolute w-16 h-26 bg-cyan-950/30 border border-cyan-500/10 rounded-xl shadow-inner flex items-center justify-center"
                  >
                    <span className="text-[8px] font-mono opacity-20 text-cyan-400">01</span>
                  </motion.div>
                  <motion.div 
                    animate={{ rotate: [12, 12], x: [22, 22], scale: [0.85, 0.85] }} 
                    className="absolute w-16 h-26 bg-cyan-950/30 border border-cyan-500/10 rounded-xl shadow-inner flex items-center justify-center"
                  >
                    <span className="text-[8px] font-mono opacity-20 text-cyan-400">99</span>
                  </motion.div>
                  
                  {/* Central Active Scanning Oracle card */}
                  <motion.div
                    animate={{
                      y: [-6, 6, -6],
                      scale: [1, 1.04, 1],
                      borderColor: ["rgba(6,182,212,0.3)", "rgba(168,85,247,0.6)", "rgba(6,182,212,0.3)"],
                      boxShadow: [
                        "0 0 12px rgba(6,182,212,0.2)",
                        "0 0 25px rgba(168,85,247,0.45)",
                        "0 0 12px rgba(6,182,212,0.2)"
                      ]
                    }}
                    transition={{ duration: 2.0, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute w-18 h-28 bg-[#0b0f1a]/95 border-2 rounded-2xl flex flex-col items-center justify-between p-2.5 text-cyan-400 overflow-hidden"
                  >
                    {/* Glowing scan bar sweep */}
                    <motion.div 
                      animate={{ y: [-15, 115, -15] }} 
                      transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
                      className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_10px_cyan]"
                    />
                    <div className="text-[6.5px] font-mono tracking-wider opacity-60">ORACLE_PRO</div>
                    <div className="w-9 h-9 rounded-lg border border-cyan-500/20 flex items-center justify-center bg-cyan-950/30">
                      <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                    </div>
                    <div className="w-12 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full animate-pulse" />
                  </motion.div>
                </motion.div>


                {/* Elegantly Tumbling Selected Stick falling down to a random position */}
                {isDroppingOracle && (
                  <motion.div
                    initial={{ y: -36, x: 0, rotate: 0, opacity: 1, scale: 1.1 }}
                    animate={{
                      y: oracleDropTarget.y,
                      x: oracleDropTarget.x,
                      rotate: oracleDropTarget.rotate,
                      opacity: 1,
                      scale: 1
                    }}
                    transition={{
                      y: { type: "spring", bounce: 0.5, duration: 1.2 },
                      x: { type: "spring", bounce: 0, duration: 1.2 },
                      rotate: { type: "spring", bounce: 0.3, duration: 1.2 },
                      scale: { duration: 0.8, ease: "easeOut" },
                      opacity: { duration: 0.3 }
                    }}
                    className="absolute w-5 h-24 bg-gradient-to-b from-[#fcd34d] via-[#f59e0b] to-[#b45309] rounded-t-sm border border-yellow-300 flex flex-col items-center justify-between py-2.5 px-0.5 shadow-[0_0_20px_rgba(251,191,36,0.6)] z-25 text-amber-900"
                  >
                    <div className="w-1.5 h-1.5 bg-yellow-100 rounded-full opacity-90 shadow-[0_0_5px_white]" />
                    <div className="text-[10px] font-serif-sc font-extrabold tracking-widest text-center text-amber-900 select-none drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)] leading-tight" style={{ writingMode: 'vertical-rl' }}>
                      西湖灵签
                    </div>
                    <div className="w-1 h-3 bg-[#b45309] rounded-full opacity-60" />
                  </motion.div>
                )}
                {/* Interactive Telemetry Log steps */}
                <motion.div className="space-y-1.5 w-full max-w-[280px]" animate={{ opacity: isDroppingOracle ? 0 : 1 }} transition={{ duration: 0.3 }}>
                  <p className="text-[10px] font-mono text-cyan-400 tracking-widest uppercase min-h-[16px]">
                    {isGeneratingOracle && ">> SYNCING DATA..."}
                    
                    
                    {isDroppingOracle && ">> RESOLVING SIGNALS..."}
                  </p>
                  
                  {/* Micro Progress Bar */}
                  <div className="w-full h-[3px] bg-slate-900 rounded-full overflow-hidden relative">
                    <motion.div 
                      animate={{ left: ["-100%", "100%"] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                      className="absolute top-0 bottom-0 w-1/3 bg-cyan-400 shadow-[0_0_8px_cyan]"
                    />
                  </div>

                  <p className="text-[8px] text-slate-500 font-mono text-center">
                    DEC_KEY: {oracleQuestion ? oracleQuestion.substring(0, 10).toUpperCase() : "RANDOM_SEED_4109"} | WAVE_C_COEFF: 99.47
                  </p>
                </motion.div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div>
        <h3 className={`text-md font-bold tracking-wider flex items-center space-x-2 
          ${styleMode === 'artistic' ? 'text-zinc-800 font-serif-sc' : 'text-cyan-400 font-mono'}`}
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>{styleMode === 'artistic' ? '西湖诗意卜卦' : 'ALGORITHMIC POETIC ORACLE'}</span>
        </h3>
        <p className="text-xs opacity-70 mt-1 mb-4">
          {styleMode === 'artistic' 
            ? '点击摇取卦签，在古典意境中探求今日数智灵感与运势启示。' 
            : 'Synthesize traditional Jiangnan elements with real-time algorithm state guidance.'}
        </p>

        {/* Form Config Fields */}
        <div className="space-y-3 mb-4 text-xs">
          {/* Mode Select */}
          <div className="flex items-center justify-between pb-2">
            <span className="opacity-70">占卜模式</span>
            <div className="flex space-x-2">
              <button 
                type="button"
                onClick={() => setUseAiOracle(true)}
                className={`px-2 py-1 rounded text-xs transition-all border
                  ${useAiOracle 
                    ? styleMode === 'artistic'
                      ? 'bg-[#2c2a25] text-[#f4f0e6] border-transparent font-medium'
                      : 'bg-cyan-500 text-slate-950 border-transparent font-bold'
                    : styleMode === 'artistic'
                      ? 'bg-zinc-100 text-zinc-600 border-zinc-200/50 hover:bg-zinc-200/50'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
              >
                AI 灵笔妙算
              </button>
              <button 
                type="button"
                onClick={() => setUseAiOracle(false)}
                className={`px-2 py-1 rounded text-xs transition-all border
                  ${!useAiOracle 
                    ? styleMode === 'artistic'
                      ? 'bg-[#2c2a25] text-[#f4f0e6] border-transparent font-medium'
                      : 'bg-cyan-500 text-slate-950 border-transparent font-bold'
                    : styleMode === 'artistic'
                      ? 'bg-zinc-100 text-zinc-600 border-zinc-200/50 hover:bg-zinc-200/50'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
              >
                传统卦签
              </button>
            </div>
          </div>

          {/* Purpose Select */}
          <div className="flex flex-col space-y-1.5">
            <span className="opacity-70">求签问卜方向</span>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { id: 'serendipity', name: '随缘' },
                { id: 'inspiration', name: '灵感' },
                { id: 'career', name: '学业' },
                { id: 'mindfulness', name: '正念' }
              ].map(p => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setOraclePurpose(p.id as any)}
                  className={`py-1 rounded-xl text-center transition-all text-xs font-semibold
                    ${oraclePurpose === p.id 
                      ? styleMode === 'artistic'
                        ? 'bg-emerald-100/65 text-emerald-900 shadow-sm'
                        : 'bg-cyan-500/20 text-cyan-300 ring-1 ring-cyan-500/30'
                      : styleMode === 'artistic'
                        ? 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200/50'
                        : 'bg-slate-900/60 text-slate-400 hover:text-slate-200'
                    }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Optional custom question */}
          {useAiOracle && (
            <div className="flex flex-col space-y-1.5">
              <span className="opacity-70">心中所问 (可选)</span>
              <input
                type="text"
                value={oracleQuestion}
                onChange={(e) => setOracleQuestion(e.target.value)}
                placeholder="如：今日写代码是否有灵感？"
                className={`w-full px-3 py-2 rounded-xl text-xs transition-all focus:outline-none focus:ring-1 ${
                  styleMode === 'artistic'
                    ? 'bg-zinc-100/60 text-zinc-800 placeholder-zinc-400 focus:bg-white focus:ring-emerald-600/30'
                    : 'bg-slate-900/80 text-slate-200 placeholder-slate-500 focus:bg-slate-950 focus:ring-cyan-500/30'
                }`}
              />
            </div>
          )}
        </div>
      </div>

      {/* Drawn Oracle Card Display Area */}
      <div className="my-3 relative min-h-[140px] flex items-center justify-center">
        {oracleCard ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            id="oracle-result-wrapper"
            className={`w-full p-4 rounded-xl flex flex-col justify-between h-full relative
              ${styleMode === 'artistic' 
                ? 'bg-[#f7f5ef] shadow-inner' 
                : 'bg-slate-950/80 shadow-[0_0_15px_rgba(34,211,238,0.05)]'
              }`}
          >
            <div className="flex items-start justify-between">
              <span className={`text-xs font-bold px-2 py-0.5 rounded
                ${styleMode === 'artistic' 
                  ? 'bg-red-50 text-red-800 font-calligraphy' 
                  : 'bg-indigo-950 text-indigo-300 font-mono'
                }`}
              >
                {oracleCard.title}
              </span>
              <span className="text-[10px] opacity-50 font-mono">
                {oracleCard.spot}
              </span>
            </div>

            {/* AI Poem display block */}
            {oracleCard.poem && oracleCard.poem.length > 0 && (
              <div className="my-3 py-2 bg-zinc-50/50 dark:bg-slate-900/30 rounded-xl flex flex-col items-center justify-center space-y-1">
                {oracleCard.poem.map((line, pidx) => (
                  <p 
                    key={pidx} 
                    className={`text-xs tracking-widest text-center leading-relaxed ${styleMode === 'artistic' ? 'text-[#2c2a25] font-serif-sc font-semibold' : 'text-cyan-300 font-mono'}`}
                  >
                    {line}
                  </p>
                ))}
              </div>
            )}

            <p className="text-xs font-semibold my-2.5 leading-relaxed">
              {oracleCard.content}
            </p>

            <div className="text-[11px] pt-3 mt-1 flex items-center justify-between">
              <span className={styleMode === 'artistic' ? 'text-emerald-800 font-bold' : 'text-cyan-400 font-mono font-bold'}>
                {oracleCard.advice.includes(' ') ? oracleCard.advice.split(' ')[0] : '宜：静心、感悟'}
              </span>
              <span className="opacity-70 text-[10px]">
                {oracleCard.advice.includes(' ') ? oracleCard.advice.split(' ')[1] : '忌：浮躁焦虑'}
              </span>
            </div>
          </motion.div>
        ) : (
          <div className={`flex flex-col flex-1 h-full items-center justify-center opacity-40 transition-opacity duration-300 ${(isGeneratingOracle || isDroppingOracle) ? 'opacity-0' : ''}`}>
            <YinYangBaguaIcon className="w-16 h-16 text-zinc-400 animate-[spin_8s_linear_infinite]" />
          </div>
        )}
      </div>

      {/* Oracle Control Button */}
      <button
        id="draw-oracle-btn"
        type="button"
        onClick={handleDrawOracle}
        className={`w-fit mx-auto py-2 px-6 rounded-full font-bold tracking-wider text-xs transition-all duration-300 flex items-center justify-center
          ${styleMode === 'artistic'
            ? 'bg-[#2c2a25] text-[#f4f0e6] hover:bg-zinc-800'
            : 'bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white hover:brightness-110 shadow-[0_0_20px_rgba(6,182,212,0.25)]'
          }`}
      >
        <span>摇一卦</span>
      </button>
    </div>
  );
}
