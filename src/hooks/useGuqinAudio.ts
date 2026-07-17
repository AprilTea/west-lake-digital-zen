import { useState, useRef, useEffect } from 'react';
import { playPluckSound } from '../lib/audio';
import { CLASSICAL_SCORES, getMusicalScoreWithRhythms } from '../data/musicData';

export function useGuqinAudio(styleMode: 'artistic' | 'geometric') {
  const [isMuted, setIsMuted] = useState(true);
  const [audioInited, setAudioInited] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const melodyTimeoutsRef = useRef<any[]>([]);

  const [activeScore, setActiveScore] = useState<typeof CLASSICAL_SCORES[0]>(CLASSICAL_SCORES[0]);
  const [playingScoreName, setPlayingScoreName] = useState<string | null>(null);
  const [currentPlayingNoteIdx, setCurrentPlayingNoteIdx] = useState<number>(-1);
  const [isLooping, setIsLooping] = useState<boolean>(true);
  const isLoopingRef = useRef<boolean>(true);

  useEffect(() => {
    isLoopingRef.current = isLooping;
  }, [isLooping]);

  const initAudio = () => {
    if (audioInited) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;
      setAudioInited(true);
    } catch (e) {
      console.warn("Web Audio is not supported by your browser.", e);
    }
  };

  const playPluck = (freq: number, style: 'artistic' | 'geometric' = styleMode) => {
    if (!audioCtxRef.current) return;
    playPluckSound(audioCtxRef.current, freq, style, isMuted);
  };

  const playScore = (score: typeof CLASSICAL_SCORES[0]) => {
    // Clear any existing melody timeouts
    melodyTimeoutsRef.current.forEach(t => clearTimeout(t));
    melodyTimeoutsRef.current = [];
    
    // Initialize audio if not initialized
    if (!audioInited) {
      initAudio();
    }
    
    const rhythmicScore = getMusicalScoreWithRhythms(score);
    
    setActiveScore(rhythmicScore);
    setPlayingScoreName(rhythmicScore.name);
    setCurrentPlayingNoteIdx(-1);
    
    rhythmicScore.notes.forEach((note: any, index: number) => {
      const t = setTimeout(() => {
        playPluck(note.freq);
        setCurrentPlayingNoteIdx(index);
        
        // If it is the last note, clear or loop playing state after a small delay
        if (index === rhythmicScore.notes.length - 1) {
          const endT = setTimeout(() => {
            if (isLoopingRef.current) {
              // Seamlessly loop the melody!
              playScore(score);
            } else {
              setPlayingScoreName(null);
              setCurrentPlayingNoteIdx(-1);
            }
          }, 1600);
          melodyTimeoutsRef.current.push(endT);
        }
      }, note.delay);
      melodyTimeoutsRef.current.push(t);
    });
  };

  const stopScore = () => {
    melodyTimeoutsRef.current.forEach(t => clearTimeout(t));
    melodyTimeoutsRef.current = [];
    setPlayingScoreName(null);
    setCurrentPlayingNoteIdx(-1);
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);

    if (!audioInited) {
      initAudio();
    } else {
      if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
    }

    // Automatically trigger default Guqin melody if we unmute and nothing is playing
    if (!nextMuted) {
      if (!playingScoreName) {
        // Find the default spring score or first score
        playScore(CLASSICAL_SCORES[0]);
      }
    } else {
      stopScore();
    }
  };

  // Cleanup melody timeouts on unmount
  useEffect(() => {
    return () => {
      melodyTimeoutsRef.current.forEach(t => clearTimeout(t));
    };
  }, []);

  return {
    isMuted,
    audioInited,
    activeScore,
    setActiveScore,
    playingScoreName,
    currentPlayingNoteIdx, setCurrentPlayingNoteIdx,
    isLooping,
    setIsLooping,
    playPluck,
    playScore,
    stopScore,
    toggleMute,
    initAudio
  };
}
