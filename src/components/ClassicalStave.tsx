import React from 'react';
import { motion } from 'motion/react';

interface ClassicalStaveProps {
  rhythmicScore: any;
  isPlaying: boolean;
  isCurrentlyActiveVisual: boolean;
  currentPlayingNoteIdx: number;
  setCurrentPlayingNoteIdx: (idx: number) => void;
  playPluck: (freq: number) => void;
  styleMode: 'artistic' | 'geometric';
  notesScrollRef: React.RefObject<HTMLDivElement>;
}

export const ClassicalStave: React.FC<ClassicalStaveProps> = ({
  rhythmicScore,
  isPlaying,
  isCurrentlyActiveVisual,
  currentPlayingNoteIdx,
  setCurrentPlayingNoteIdx,
  playPluck,
  styleMode,
  notesScrollRef
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="mt-2 text-left relative w-full"
    >
      <div className="absolute left-4 right-4 top-[14px] h-[1px] bg-dashed border-t border-zinc-300 dark:border-zinc-700/50 z-0 pointer-events-none" />
      <div 
        ref={notesScrollRef as any}
        className="flex items-center space-x-3 overflow-x-auto py-1.5 px-4 scrollbar-none scroll-smooth relative z-10"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {rhythmicScore.notes.map((note: any, noteIdx: number) => {
          const isNotePlaying = isPlaying && currentPlayingNoteIdx === noteIdx;
          return (
            <div
              key={noteIdx}
              onClick={(e) => {
                e.stopPropagation();
                playPluck(note.freq);
                if (isPlaying) {
                  setCurrentPlayingNoteIdx(noteIdx);
                }
              }}
              className="flex flex-col items-center shrink-0 cursor-pointer transition-all duration-300 relative group"
            >
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-serif-sc border font-bold relative transition-all duration-300 ${
                isNotePlaying
                  ? 'bg-rose-600 border-rose-500 text-white shadow-md shadow-rose-500/30 scale-110 ring-2 ring-rose-300/40'
                  : styleMode === 'artistic'
                    ? isCurrentlyActiveVisual
                      ? 'bg-[#fbf8f2] border-rose-200 text-rose-950 hover:border-rose-400 hover:bg-rose-50/40 shadow-sm'
                      : 'bg-[#fbf8f2] border-zinc-300/80 text-zinc-800 hover:border-emerald-700 hover:bg-emerald-50/40 shadow-sm'
                    : 'bg-slate-900/90 border-cyan-800/60 text-cyan-200 hover:border-cyan-400 hover:bg-cyan-950/40'
              }`}>
                {isNotePlaying && (
                  <span className="absolute -inset-1 rounded-full bg-rose-500/25 animate-ping pointer-events-none" />
                )}
                {note.char}
              </div>
              <span className={`text-[7.5px] font-mono mt-0.5 ${
                isNotePlaying 
                  ? 'text-rose-600 dark:text-rose-400 font-bold' 
                  : styleMode === 'artistic' ? 'text-zinc-500/70' : 'text-slate-500'
              }`}>
                {noteIdx + 1}
              </span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};
