import React from 'react';
import { motion } from 'motion/react';
import { Music } from 'lucide-react';

interface GuqinStringsProps {
  styleMode: 'artistic' | 'geometric';
  playingScoreName: string | null;
  activeScore: any;
  currentPlayingNoteIdx: number;
  playPluck: (freq: number) => void;
}

export const GuqinStrings: React.FC<GuqinStringsProps> = ({
  styleMode,
  playingScoreName,
  activeScore,
  currentPlayingNoteIdx,
  playPluck
}) => {
  return (
    <>
      <h3 className={`text-md font-bold tracking-wider flex items-center space-x-2 
        ${styleMode === 'artistic' ? 'text-zinc-800 font-serif-sc' : 'text-cyan-400 font-mono'}`}
      >
        <Music className="w-4 h-4 text-emerald-600 animate-pulse" />
        <span>{styleMode === 'artistic' ? '西湖琴韵与古琴声景' : 'WEST LAKE GUQIN SOUNDSCAPE'}</span>
      </h3>
      <p className="text-xs opacity-70 mt-1 mb-6">
        {styleMode === 'artistic' 
          ? '触摸下方五音弦聆听江南古琴和声，体悟西湖名景之雅乐。' 
          : 'Touch the Chinese pentatonic chimes below to listen to the traditional Jiangnan Guqin harmony.'}
      </p>

      {/* Touch Chimes (Pentatonic Zen Synthesizer with active score playback animation) */}
      <div className="mt-4 pt-1">
        <span className="text-xs font-mono block mb-2.5 uppercase tracking-wider opacity-75">
          🎼 古琴五音声律和鸣 (Chinese Pentatonic Touch Chimes)
        </span>
        <div className="grid grid-cols-5 gap-1.5 mb-5">
          {[
            { note: '宫', eng: 'Gong (Do)', freq: 261.63, sub: '土 / 脾', bgArt: 'bg-amber-500/10 border-amber-500/30 text-amber-900', bgGeo: 'bg-amber-950/40 border-amber-500/40 text-amber-300' },
            { note: '商', eng: 'Shang (Re)', freq: 293.66, sub: '金 / 肺', bgArt: 'bg-slate-300/30 border-slate-400/30 text-slate-800', bgGeo: 'bg-slate-900/60 border-slate-400/40 text-slate-300' },
            { note: '角', eng: 'Jue (Mi)', freq: 329.63, sub: '木 / 肝', bgArt: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-900', bgGeo: 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' },
            { note: '徵', eng: 'Zhi (Sol)', freq: 392.00, sub: '火 / 心', bgArt: 'bg-rose-500/10 border-rose-500/30 text-rose-900', bgGeo: 'bg-rose-950/40 border-rose-500/40 text-rose-300' },
            { note: '羽', eng: 'Yu (La)', freq: 440.00, sub: '水 / 肾', bgArt: 'bg-blue-500/10 border-blue-500/30 text-blue-900', bgGeo: 'bg-blue-950/40 border-blue-500/40 text-blue-300' }
          ].map((chime) => {
            const isChimeActive = playingScoreName !== null && activeScore?.notes[currentPlayingNoteIdx]?.char === chime.note;
            return (
              <motion.button
                key={chime.note}
                onClick={() => {
                  playPluck(chime.freq);
                }}
                animate={isChimeActive ? {
                  scale: [1, 1.15, 1],
                  y: [0, -8, 0],
                } : {
                  scale: 1,
                  y: 0,
                }}
                transition={isChimeActive ? {
                  duration: 0.4,
                  ease: "easeOut",
                } : {}}
                className={`py-3.5 rounded-xl border flex flex-col items-center justify-center transition-all duration-300 transform active:scale-95 group relative overflow-hidden
                  ${isChimeActive
                    ? styleMode === 'artistic'
                      ? `${chime.bgArt} ring-2 ring-emerald-500/50 shadow-md shadow-emerald-500/10 font-bold z-10`
                      : `${chime.bgGeo} ring-2 ring-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.4)] z-10`
                    : styleMode === 'artistic'
                      ? 'bg-zinc-50 border-zinc-200 hover:bg-emerald-50 hover:border-emerald-300'
                      : 'bg-slate-900/60 border-cyan-500/10 hover:bg-cyan-950/40 hover:border-cyan-400/40'
                  }`}
              >
                {/* Interactive dynamic soundwave ripple inside button */}
                {isChimeActive && (
                  <span className={`absolute inset-0 w-full h-full opacity-30 animate-pulse
                    ${styleMode === 'artistic' ? 'bg-gradient-to-t from-emerald-500/20 to-transparent' : 'bg-gradient-to-t from-cyan-400/20 to-transparent'}`} 
                  />
                )}
                
                <span className={`text-lg font-calligraphy font-bold relative z-10 transition-colors
                  ${isChimeActive
                    ? styleMode === 'artistic' ? 'text-zinc-900' : 'text-cyan-300'
                    : styleMode === 'artistic' ? 'text-zinc-800 group-hover:text-emerald-800' : 'text-cyan-300 group-hover:text-cyan-200'
                  }`}
                >
                  {chime.note}
                </span>
                <span className="text-[8px] opacity-60 scale-90 relative z-10">{chime.eng}</span>
                <span className="text-[7px] opacity-45 mt-0.5 scale-95 relative z-10">{chime.sub}</span>
                
                {/* Small glowing touch light */}
                {isChimeActive && (
                  <span className={`absolute bottom-1 w-1 h-1 rounded-full
                    ${styleMode === 'artistic' ? 'bg-emerald-500' : 'bg-cyan-400 animate-ping'}`} 
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </>
  );
};
