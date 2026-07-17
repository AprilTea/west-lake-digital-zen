import React from 'react';
import { motion } from 'motion/react';
import { ClassicalStave } from './ClassicalStave';

interface ScoreCardProps {
  score: any;
  rhythmicScore: any;
  isPlaying: boolean;
  isCurrentlyActiveVisual: boolean;
  styleMode: 'artistic' | 'geometric';
  targetLeft: string;
  targetTop: number;
  targetW: string;
  targetH: number;
  targetScale: number;
  isExpanded: boolean;
  startChoreographySwitch: (score: any) => void;
  stopScore: () => void;
  playScore: (score: any) => void;
  playPluck: (freq: number) => void;
  currentPlayingNoteIdx: number;
  setCurrentPlayingNoteIdx: (idx: number) => void;
  notesScrollRef: React.RefObject<HTMLDivElement>;
}

export const ScoreCard: React.FC<ScoreCardProps> = ({
  score,
  rhythmicScore,
  isPlaying,
  isCurrentlyActiveVisual,
  styleMode,
  targetLeft,
  targetTop,
  targetW,
  targetH,
  targetScale,
  isExpanded,
  startChoreographySwitch,
  stopScore,
  playScore,
  playPluck,
  currentPlayingNoteIdx,
  setCurrentPlayingNoteIdx,
  notesScrollRef
}) => {
  return (
    <motion.div
      key={score.name}
      style={{
        position: 'absolute',
      }}
      animate={{
        left: targetLeft,
        top: targetTop,
        width: targetW,
        height: targetH,
        scale: targetScale,
      }}
      transition={{
        type: "tween",
        ease: "easeInOut",
        duration: 0.3
      }}
      className={`rounded-2xl border text-xs flex flex-col justify-between relative overflow-hidden transition-colors duration-300 shadow-md ${
        !isExpanded ? 'cursor-pointer group' : ''
      } ${
        isCurrentlyActiveVisual
          ? styleMode === 'artistic'
            ? 'bg-[#fdf6f3] border-rose-300 text-rose-950 shadow-rose-950/5 ring-1 ring-rose-400/25'
            : 'bg-rose-950/25 border-rose-500/30 text-rose-100 shadow-rose-950/5 ring-1 ring-rose-500/20'
          : styleMode === 'artistic'
            ? 'bg-[#fbf8f2] border-transparent text-zinc-800 hover:bg-[#f5f1e5] hover:shadow-lg'
            : 'bg-[#0f1423] border-cyan-500/20 text-slate-200 hover:bg-[#131b2f] hover:border-cyan-500/40 hover:shadow-[0_0_15px_rgba(6,182,212,0.15)]'
      }`}
    >
      <div 
        className={`w-full h-full flex flex-col justify-between transition-[padding] duration-300 ${
          isExpanded ? 'p-4' : 'p-3'
        }`}
        onClick={!isExpanded ? () => startChoreographySwitch(score) : undefined}
      >
        <div className="flex flex-col h-full justify-between w-full">
          {/* Header row */}
          <div className="flex items-start justify-between w-full">
            <div className="flex flex-col space-y-0.5 pr-4 truncate w-full">
              {isExpanded && (
                <motion.span 
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`text-[8.5px] uppercase font-mono tracking-wider font-semibold transition-colors duration-300 ${
                    isCurrentlyActiveVisual
                      ? styleMode === 'artistic'
                        ? 'text-rose-800/85'
                        : 'text-rose-300/85'
                      : styleMode === 'artistic'
                        ? 'text-emerald-800/85'
                        : 'text-cyan-400/85'
                  }`}
                >
                  ✨ 当前选定曲谱 (Active Score)
                </motion.span>
              )}
              
              <div className="flex items-center space-x-1.5 mt-0.5">
                <span className={`font-bold font-serif-sc transition-all duration-300 truncate ${
                  isExpanded 
                    ? 'text-xs sm:text-sm' 
                    : 'text-[11px]'
                } ${
                  isCurrentlyActiveVisual
                    ? styleMode === 'artistic'
                      ? 'text-rose-950'
                      : 'text-rose-100'
                    : styleMode === 'artistic'
                      ? 'text-zinc-800 group-hover:text-emerald-900'
                      : 'text-slate-100 group-hover:text-cyan-300'
                }`}>
                  {score.name}
                </span>
                
                <span className={`text-[8px] font-mono px-1 py-0.5 rounded font-semibold border transition-all duration-300 whitespace-nowrap ${
                  isCurrentlyActiveVisual
                    ? styleMode === 'artistic'
                      ? 'bg-rose-100 border-rose-200 text-rose-800'
                      : 'bg-rose-950/60 border-rose-900/40 text-rose-300'
                    : styleMode === 'artistic'
                      ? 'bg-emerald-50/80 border-[#ebdcc3] text-emerald-800'
                      : 'bg-cyan-950/40 border-cyan-900/30 text-cyan-400'
                }`}>
                  {isExpanded ? score.mode : score.mode.split(' ')[0]}
                </span>
              </div>

              <div className="text-[10px] font-mono flex items-center space-x-1 mt-1 transition-all duration-300">
                <span className={`text-[8.5px] transition-colors duration-300 ${
                  isCurrentlyActiveVisual 
                    ? styleMode === 'artistic' ? 'text-rose-900/75' : 'text-rose-300/75'
                    : styleMode === 'artistic' ? 'text-[#8b8273]' : 'text-slate-400/75'
                }`}>
                  📍 {isExpanded ? '关联景点' : ''}:
                </span>
                <span className={`text-[8.5px] font-bold transition-colors duration-300 ${
                  isCurrentlyActiveVisual
                    ? styleMode === 'artistic' ? 'text-rose-700' : 'text-rose-300'
                    : styleMode === 'artistic' ? 'text-zinc-700' : 'text-slate-200'
                }`}>
                  {isExpanded ? score.spot : score.spot.split(' / ')[0]}
                </span>
              </div>
            </div>

            {/* Play button or Ping dot */}
            {isExpanded ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (isPlaying) {
                    stopScore();
                  } else {
                    playScore(score);
                  }
                }}
                className={`px-2.5 py-1.5 rounded-xl text-[10px] font-mono font-bold shadow-md transition-all duration-300 flex items-center space-x-1 shrink-0 ${
                  isPlaying
                    ? 'bg-rose-500 hover:bg-rose-600 text-white animate-pulse'
                    : styleMode === 'artistic'
                      ? 'bg-emerald-800 text-emerald-50 hover:bg-emerald-950'
                      : 'bg-cyan-500 text-slate-900 hover:bg-cyan-400'
                }`}
              >
                <span>{isPlaying ? '⏹ 停止' : '▶ 演奏'}</span>
              </button>
            ) : (
              isCurrentlyActiveVisual && (
                <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-ping mt-1 shrink-0" />
              )
            )}
          </div>

          {/* Classical circular note scroll - Only shown when expanded */}
          {isExpanded && (
            <ClassicalStave
              rhythmicScore={rhythmicScore}
              isPlaying={isPlaying}
              isCurrentlyActiveVisual={isCurrentlyActiveVisual}
              currentPlayingNoteIdx={currentPlayingNoteIdx}
              setCurrentPlayingNoteIdx={setCurrentPlayingNoteIdx}
              playPluck={playPluck}
              styleMode={styleMode}
              notesScrollRef={notesScrollRef}
            />
          )}

          
      </div>
      </div>
    </motion.div>
  );
};