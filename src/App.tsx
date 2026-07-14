import React, { useState, useEffect, useRef } from 'react';
import { 
  Compass, 
  Layers, 
  Wind, 
  Music, 
  Volume2, 
  VolumeX, 
  Cpu, 
  Sparkles, 
  RotateCcw, 
  ChevronRight, 
  Clock, 
  Activity, 
  ShieldAlert, 
  CloudRain, 
  Compass as CompassIcon,
  HelpCircle,
  X,
  Sun,
  Moon
} from 'lucide-react';
import { HANGZHOU_SEASONS_DATA, POETIC_ORACLES, SeasonType, ScenicSpot, InkRipple } from './types';
import { WeatherType } from './photos';
import { motion, AnimatePresence } from 'motion/react';

// Helper to get beautiful, flowing traditional musical rhythms (beat durations) for each note
const getNoteDurationInBeats = (scoreName: string, noteIdx: number): number => {
  if (scoreName === "《春江花月夜》") {
    const patterns = [
      1.5, 0.5, 1, 2,      // Slow majestic intro
      1, 1, 2,            // Smooth flow
      0.5, 0.5, 1, 1, 2,  // Rising ripples
      1.5, 0.5, 1.5, 0.5, 3, // Floating moon
      1, 1, 1, 2,         // Evening breeze
      0.5, 0.5, 0.5, 0.5, 2, // Cascading stream
      2, 2, 4             // Deep resolution
    ];
    return patterns[noteIdx % patterns.length];
  } else if (scoreName === "《平沙落雁》") {
    const patterns = [
      2, 1, 1, 2,         // Geese flying high
      0.25, 0.25, 0.25, 0.25, 1, 1, 2, // Rapid wing flaps
      0.5, 0.5, 1.5, 0.5, 3,  // Descending glide
      2, 2, 4             // Landing on sand
    ];
    return patterns[noteIdx % patterns.length];
  } else if (scoreName === "《渔樵问答》") {
    const patterns = [
      1, 1, 2,            // Fisherman's call
      1.5, 0.5, 1,        // Woodcutter's echo
      0.5, 0.5, 1, 2,     // Dialogue banter
      1.5, 0.5, 2,        // Playful syncopation
      1, 1, 1, 3,         // Steady gaze
      0.5, 0.5, 0.5, 0.5, 1, 1, 2, 4 // Shared laughter
    ];
    return patterns[noteIdx % patterns.length];
  } else { // 《高山流水》
    const patterns = [
      3, 1, 2, 4,         // Lofty mountain heights
      0.5, 0.5, 0.5, 0.5, 1, 1, // Flowing trickle
      0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 1.5, // Waterfall rapids
      1.5, 0.5, 2, 4      // Deep river valley
    ];
    return patterns[noteIdx % patterns.length];
  }
};

const getMusicalScoreWithRhythms = (score: any) => {
  if (!score) return score;
  let cumulative = 0;
  
  // Set different tempos (ms per beat) for each song to reflect their traditional performance styles
  let tempo = 450;
  if (score.name === "《春江花月夜》") {
    tempo = 650; // Slow, majestic and poetic
  } else if (score.name === "《平沙落雁》") {
    tempo = 550; // Airy, breathing, relaxed
  } else if (score.name === "《渔樵问答》") {
    tempo = 480; // Dialogue-like, crisp and responsive
  } else if (score.name === "《高山流水》") {
    tempo = 380; // Fast-moving stream, energetic and spectacular
  }

  const notesWithDelays = score.notes.map((note: any, idx: number) => {
    const delay = cumulative;
    const durBeats = getNoteDurationInBeats(score.name, idx);
    cumulative += durBeats * tempo;
    return {
      ...note,
      delay
    };
  });
  return {
    ...score,
    notes: notesWithDelays,
    totalDuration: cumulative
  };
};

export default function App() {
  // State definitions
  const [activeSeason, setActiveSeason] = useState<SeasonType>('spring');
  const [styleMode, setStyleMode] = useState<'artistic' | 'geometric'>('artistic');
  const [hoveredSpot, setHoveredSpot] = useState<ScenicSpot | null>(null);
  const [activeSpot, setActiveSpot] = useState<ScenicSpot | null>(HANGZHOU_SEASONS_DATA[0].spots[0]);
  const [activeWeather, setActiveWeather] = useState<WeatherType>('sunny');
  const [lightboxImage, setLightboxImage] = useState<{ url: string; caption: string; photographer: string; settings: string; note: string } | null>(null);
  const [ripples, setRipples] = useState<InkRipple[]>([]);
  const [oracleCard, setOracleCard] = useState<(typeof POETIC_ORACLES[0] & { poem?: string[] }) | null>(null);
  const [isOracleFlipped, setIsOracleFlipped] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [audioInited, setAudioInited] = useState(false);
  const [mapScale, setMapScale] = useState(1.0);
  const [mapPan, setMapPan] = useState({ x: 0, y: 0 });
  const [isDraggingMap, setIsDraggingMap] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const dragDistanceRef = useRef(0);
  const [isGeneratingOracle, setIsGeneratingOracle] = useState(false);
  const [oracleLoadingStep, setOracleLoadingStep] = useState(0);

  useEffect(() => {
    let interval: any = null;
    if (isGeneratingOracle) {
      setOracleLoadingStep(0);
      interval = setInterval(() => {
        setOracleLoadingStep(prev => (prev + 1) % 4);
      }, 900);
    } else {
      setOracleLoadingStep(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isGeneratingOracle]);

  const [selectedOracleIndex, setSelectedOracleIndex] = useState<number | null>(null);
  const [smartStats, setSmartStats] = useState({
    pm25: 12,
    waterClarity: 1.8,
    soilMoisture: 45.3,
    smartGridLoad: 28.5,
    crowdFlow: '畅通'
  });

  // AI Poetic Oracle & Custom Micro-Climate Controls
  const [oraclePurpose, setOraclePurpose] = useState<'serendipity' | 'inspiration' | 'career' | 'mindfulness'>('serendipity');
  const [oracleQuestion, setOracleQuestion] = useState('');
  const [useAiOracle, setUseAiOracle] = useState(true);
  const [windSpeed, setWindSpeed] = useState(50);
  const [waterVisibility, setWaterVisibility] = useState(60);
  const [temperature, setTemperature] = useState(22);
  const [pentatonicScale, setPentatonicScale] = useState<'gong' | 'shang' | 'jue' | 'zhi' | 'yu'>('gong');

  // Modern Architecture Interactive Light Show States
  const [activeLandmark, setActiveLandmark] = useState<'conference' | 'theater' | 'g20' | 'lotus'>('conference');
  const [activeLightMode, setActiveLightMode] = useState<'ink' | 'cyber' | 'golden' | 'eco'>('cyber');
  const [isLightshowRunning, setIsLightshowRunning] = useState(false);
  const [isEcoOptimizing, setIsEcoOptimizing] = useState(false);
  const [viewPerspective, setViewPerspective] = useState<'front' | 'isometric' | 'top'>('front');

  // Classical Pentatonic Melodies (五音曲谱) definition
  const melodyTimeoutsRef = useRef<any[]>([]);
  
  const CLASSICAL_SCORES = [
    {
      name: "《春江花月夜》",
      spot: "苏堤春晓 / 断桥残雪",
      mode: "羽调式 (水/柔美)",
      description: "江南古雅名曲。乐曲以柔缓温润的羽调式旋律徐徐铺展，描绘了夕阳西下、江月乍升、西湖水光瀲灩、轻舟逐浪的静谧春夜，呈现天人合一、宁静悠远的山水意境。",
      notes: [
        { char: "羽", freq: 220.00, delay: 0 },
        { char: "宫", freq: 261.63, delay: 450 },
        { char: "商", freq: 293.66, delay: 900 },
        { char: "角", freq: 329.63, delay: 1350 },
        { char: "徵", freq: 392.00, delay: 1800 },
        { char: "羽", freq: 440.00, delay: 2250 },
        { char: "宫", freq: 523.25, delay: 2700 },
        { char: "商", freq: 587.33, delay: 3150 },
        { char: "角", freq: 659.25, delay: 3600 },
        { char: "羽", freq: 880.00, delay: 4050 },
        { char: "徵", freq: 783.99, delay: 4500 },
        { char: "角", freq: 659.25, delay: 5000 },
        { char: "商", freq: 587.33, delay: 5500 },
        { char: "宫", freq: 523.25, delay: 6000 },
        { char: "羽", freq: 440.00, delay: 6500 },
        { char: "徵", freq: 392.00, delay: 7000 },
        { char: "角", freq: 329.63, delay: 7500 },
        { char: "商", freq: 293.66, delay: 8000 },
        { char: "宫", freq: 261.63, delay: 8500 },
        { char: "羽", freq: 220.00, delay: 9000 },
        { char: "徵", freq: 196.00, delay: 9550 },
        { char: "羽", freq: 220.00, delay: 10100 },
        { char: "宫", freq: 261.63, delay: 10650 },
        { char: "商", freq: 293.66, delay: 11200 },
        { char: "角", freq: 329.63, delay: 11750 },
        { char: "徵", freq: 392.00, delay: 12300 },
        { char: "羽", freq: 440.00, delay: 12850 },
        { char: "宫", freq: 523.25, delay: 13400 },
        { char: "商", freq: 587.33, delay: 13950 },
        { char: "角", freq: 659.25, delay: 14500 },
        { char: "徵", freq: 783.99, delay: 15100 },
        { char: "羽", freq: 880.00, delay: 15700 },
        { char: "羽", freq: 440.00, delay: 16300 },
        { char: "徵", freq: 392.00, delay: 16900 },
        { char: "角", freq: 329.63, delay: 17500 },
        { char: "商", freq: 293.66, delay: 18100 },
        { char: "宫", freq: 261.63, delay: 18700 },
        { char: "羽", freq: 220.00, delay: 19300 },
        { char: "徵", freq: 196.00, delay: 19900 },
        { char: "羽", freq: 220.00, delay: 20500 },
        { char: "宫", freq: 261.63, delay: 21100 },
        { char: "羽", freq: 220.00, delay: 21800 }
      ]
    },
    {
      name: "《平沙落雁》",
      spot: "平湖秋月 / 柳浪闻莺",
      mode: "商调式 (金/空灵)",
      description: "古琴隽雅名作。曲调空灵流畅，描写秋高气爽、风静沙平，雁群由远及近，在湖畔飞鸣落滩的安详、开阔画面。音域宽广空灵，寄托高洁淡泊的隐逸之志。",
      notes: [
        { char: "商", freq: 293.66, delay: 0 },
        { char: "角", freq: 329.63, delay: 450 },
        { char: "徵", freq: 392.00, delay: 900 },
        { char: "羽", freq: 440.00, delay: 1350 },
        { char: "商", freq: 587.33, delay: 1800 },
        { char: "羽", freq: 440.00, delay: 2250 },
        { char: "徵", freq: 392.00, delay: 2700 },
        { char: "角", freq: 329.63, delay: 3150 },
        { char: "商", freq: 293.66, delay: 3600 },
        { char: "羽", freq: 220.00, delay: 4100 },
        { char: "商", freq: 293.66, delay: 4600 },
        { char: "角", freq: 329.63, delay: 5100 },
        { char: "徵", freq: 392.00, delay: 5600 },
        { char: "羽", freq: 440.00, delay: 6100 },
        { char: "商", freq: 587.33, delay: 6600 },
        { char: "角", freq: 659.25, delay: 7100 },
        { char: "徵", freq: 783.99, delay: 7600 },
        { char: "羽", freq: 880.00, delay: 8100 },
        { char: "商", freq: 587.33, delay: 8650 },
        { char: "羽", freq: 440.00, delay: 9200 },
        { char: "徵", freq: 392.00, delay: 9750 },
        { char: "角", freq: 329.63, delay: 10300 },
        { char: "商", freq: 293.66, delay: 10850 },
        { char: "宫", freq: 261.63, delay: 11400 },
        { char: "商", freq: 293.66, delay: 11950 },
        { char: "角", freq: 329.63, delay: 12500 },
        { char: "徵", freq: 392.00, delay: 13050 },
        { char: "商", freq: 587.33, delay: 13600 },
        { char: "羽", freq: 440.00, delay: 14150 },
        { char: "徵", freq: 392.00, delay: 14700 },
        { char: "角", freq: 329.63, delay: 15250 },
        { char: "商", freq: 293.66, delay: 15800 },
        { char: "羽", freq: 220.00, delay: 16400 },
        { char: "徵", freq: 196.00, delay: 17000 },
        { char: "角", freq: 329.63, delay: 17600 },
        { char: "商", freq: 293.66, delay: 18200 },
        { char: "角", freq: 329.63, delay: 18800 },
        { char: "徵", freq: 392.00, delay: 19400 },
        { char: "羽", freq: 440.00, delay: 20000 },
        { char: "商", freq: 587.33, delay: 20700 },
        { char: "羽", freq: 440.00, delay: 21400 },
        { char: "商", freq: 293.66, delay: 22100 }
      ]
    },
    {
      name: "《渔樵问答》",
      spot: "三潭印月 / 双峰插云",
      mode: "宫调式 (土/稳重)",
      description: "琴学经典对话体。通过稳健舒展、一唱一和的音调，展现渔父与樵子在湖光山色之间谈笑风生、洒脱不羁的悠闲情态，烟波浩渺，尽显沧桑看破、超凡脱俗之意趣。",
      notes: [
        { char: "宫", freq: 261.63, delay: 0 },
        { char: "商", freq: 293.66, delay: 450 },
        { char: "宫", freq: 261.63, delay: 900 },
        { char: "徵", freq: 196.00, delay: 1350 },
        { char: "羽", freq: 220.00, delay: 1800 },
        { char: "宫", freq: 261.63, delay: 2250 },
        { char: "宫", freq: 523.25, delay: 2750 },
        { char: "商", freq: 587.33, delay: 3250 },
        { char: "宫", freq: 523.25, delay: 3750 },
        { char: "角", freq: 659.25, delay: 4250 },
        { char: "羽", freq: 440.00, delay: 4750 },
        { char: "徵", freq: 392.00, delay: 5250 },
        { char: "宫", freq: 261.63, delay: 5800 },
        { char: "商", freq: 293.66, delay: 6350 },
        { char: "角", freq: 329.63, delay: 6900 },
        { char: "徵", freq: 392.00, delay: 7450 },
        { char: "羽", freq: 440.00, delay: 8000 },
        { char: "宫", freq: 523.25, delay: 8550 },
        { char: "羽", freq: 440.00, delay: 9100 },
        { char: "徵", freq: 392.00, delay: 9650 },
        { char: "角", freq: 329.63, delay: 10200 },
        { char: "商", freq: 293.66, delay: 10750 },
        { char: "宫", freq: 261.63, delay: 11300 },
        { char: "羽", freq: 220.00, delay: 11850 },
        { char: "宫", freq: 261.63, delay: 12400 },
        { char: "商", freq: 293.66, delay: 12950 },
        { char: "宫", freq: 261.63, delay: 13500 },
        { char: "徵", freq: 196.00, delay: 14050 },
        { char: "宫", freq: 261.63, delay: 14600 },
        { char: "商", freq: 293.66, delay: 15150 },
        { char: "角", freq: 329.63, delay: 15700 },
        { char: "徵", freq: 392.00, delay: 16250 },
        { char: "羽", freq: 440.00, delay: 16800 },
        { char: "宫", freq: 523.25, delay: 17350 },
        { char: "商", freq: 587.33, delay: 17900 },
        { char: "宫", freq: 523.25, delay: 18500 },
        { char: "角", freq: 659.25, delay: 19100 },
        { char: "羽", freq: 440.00, delay: 19700 },
        { char: "徵", freq: 392.00, delay: 20300 },
        { char: "商", freq: 293.66, delay: 20900 },
        { char: "宫", freq: 261.63, delay: 21500 },
        { char: "宫", freq: 523.25, delay: 22200 }
      ]
    },
    {
      name: "《高山流水》",
      spot: "雷峰夕照 / 花港观鱼",
      mode: "徵调式 (火/热烈)",
      description: "流传千古之知音神曲。本曲模拟飞瀑骤落、高山耸峙，通过宽广奔放的五音声羽，模拟山风穿林、涧水喧嚣。于波澜壮阔的流水音中，寻求心灵归于平湖的至高和谐。",
      notes: [
        { char: "徵", freq: 196.00, delay: 0 },
        { char: "羽", freq: 220.00, delay: 400 },
        { char: "宫", freq: 261.63, delay: 800 },
        { char: "商", freq: 293.66, delay: 1200 },
        { char: "角", freq: 329.63, delay: 1600 },
        { char: "徵", freq: 392.00, delay: 2050 },
        { char: "羽", freq: 440.00, delay: 2450 },
        { char: "宫", freq: 523.25, delay: 2850 },
        { char: "徵", freq: 783.99, delay: 3300 },
        { char: "羽", freq: 880.00, delay: 3700 },
        { char: "徵", freq: 783.99, delay: 4100 },
        { char: "商", freq: 587.33, delay: 4500 },
        { char: "宫", freq: 523.25, delay: 4900 },
        { char: "羽", freq: 440.00, delay: 5300 },
        { char: "徵", freq: 392.00, delay: 5700 },
        { char: "角", freq: 329.63, delay: 6100 },
        { char: "商", freq: 293.66, delay: 6500 },
        { char: "宫", freq: 261.63, delay: 6900 },
        { char: "徵", freq: 196.00, delay: 7300 },
        { char: "宫", freq: 261.63, delay: 7750 },
        { char: "商", freq: 293.66, delay: 8150 },
        { char: "角", freq: 329.63, delay: 8550 },
        { char: "徵", freq: 392.00, delay: 8950 },
        { char: "羽", freq: 440.00, delay: 9350 },
        { char: "宫", freq: 523.25, delay: 9750 },
        { char: "徵", freq: 783.99, delay: 10250 },
        { char: "羽", freq: 880.00, delay: 10700 },
        { char: "徵", freq: 783.99, delay: 11150 },
        { char: "角", freq: 659.25, delay: 11600 },
        { char: "商", freq: 587.33, delay: 12050 },
        { char: "宫", freq: 523.25, delay: 12500 },
        { char: "羽", freq: 440.00, delay: 12950 },
        { char: "徵", freq: 392.00, delay: 13400 },
        { char: "角", freq: 329.63, delay: 13850 },
        { char: "羽", freq: 440.00, delay: 14350 },
        { char: "徵", freq: 392.00, delay: 14900 },
        { char: "宫", freq: 261.63, delay: 15500 },
        { char: "商", freq: 293.66, delay: 16100 },
        { char: "角", freq: 329.63, delay: 16700 },
        { char: "徵", freq: 392.00, delay: 17300 },
        { char: "羽", freq: 440.00, delay: 18000 },
        { char: "宫", freq: 523.25, delay: 18700 },
        { char: "徵", freq: 783.99, delay: 19500 },
        { char: "羽", freq: 880.00, delay: 20200 },
        { char: "徵", freq: 783.99, delay: 21000 }
      ]
    }
  ];

  const [activeScore, setActiveScore] = useState<typeof CLASSICAL_SCORES[0] | null>(null);
  const [playingScoreName, setPlayingScoreName] = useState<string | null>(null);
  const [currentPlayingNoteIdx, setCurrentPlayingNoteIdx] = useState<number>(-1);
  const [isLooping, setIsLooping] = useState<boolean>(true);
  const isLoopingRef = useRef<boolean>(true);

  const [orderedScores, setOrderedScores] = useState<typeof CLASSICAL_SCORES>(CLASSICAL_SCORES);
  const [choreographyStage, setChoreographyStage] = useState<'idle' | 'shrink_A' | 'move_B' | 'arrange_CD' | 'move_A' | 'expand_B'>('idle');
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
        height: 195,
      };
    } else if (slotIdx === 1) {
      return {
        left: "0%",
        top: 210,
        width: "31%",
        height: 112,
      };
    } else if (slotIdx === 2) {
      return {
        left: "34.5%",
        top: 210,
        width: "31%",
        height: 112,
      };
    } else {
      return {
        left: "69%",
        top: 210,
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
    
    // Step 1: Shrink A
    setChoreographyStage('shrink_A');
    
    // Step 2: Move B up
    setTimeout(() => {
      setChoreographyStage('move_B');
    }, 350);
    
    // Step 3: Arrange CD
    setTimeout(() => {
      setChoreographyStage('arrange_CD');
    }, 700);
    
    // Step 4: Move A down
    setTimeout(() => {
      setChoreographyStage('move_A');
    }, 1000);
    
    // Step 5: Expand B
    setTimeout(() => {
      setChoreographyStage('expand_B');
    }, 1350);
    
    // Step 6: Finalize
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
      
      // Stop old and play new
      stopScore();
      playScore(targetScore);
    }, 1750);
  };

  useEffect(() => {
    isLoopingRef.current = isLooping;
  }, [isLooping]);

  useEffect(() => {
    setActiveScore(CLASSICAL_SCORES[0]);
  }, []);

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

  // Cleanup melody timeouts on unmount
  useEffect(() => {
    return () => {
      melodyTimeoutsRef.current.forEach(t => clearTimeout(t));
    };
  }, []);

  // Scroll and ink-flow tracking refs
  const scrollVelocityRef = useRef(0);
  const lastScrollYRef = useRef(0);

  // Audio Context Ref
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorNodeRef = useRef<OscillatorNode | null>(null);
  const lfoNodeRef = useRef<OscillatorNode | null>(null);
  const filterNodeRef = useRef<BiquadFilterNode | null>(null);
  const delayNodeRef = useRef<DelayNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

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

  // Web Audio Synthesizer Controls
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

  // Trigger a pluck synth sound
  const playPluck = (freq: number, style: 'artistic' | 'geometric' = styleMode) => {
    // If muted or audio context not ready, allow returning so we don't crash
    if (!audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    
    // Resume context if suspended (browser behavior)
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    if (isMuted) return;

    try {
      if (style === 'artistic') {
        // --- AUTHENTIC PORTABLE GUQIN SYNTHESIS ---
        const now = ctx.currentTime;
        
        // Main note gain node with decay envelope
        const noteGain = ctx.createGain();
        noteGain.gain.setValueAtTime(0, now);
        // Soft pluck attack, followed by decay
        noteGain.gain.linearRampToValueAtTime(0.42, now + 0.012);
        noteGain.gain.exponentialRampToValueAtTime(0.12, now + 0.45);
        noteGain.gain.exponentialRampToValueAtTime(0.001, now + 2.6);

        // Guqin slides: pitch glide/bend into the target note ("绰" or "注")
        // Direct strike (65%), slide-up "绰" (25%), slide-down "注" (10%)
        const randSlide = Math.random();
        let startFreq = freq;
        const slideTime = 0.16;
        if (randSlide < 0.25) {
          startFreq = freq * 0.94; // Slide up from half step below
        } else if (randSlide < 0.35) {
          startFreq = freq * 1.04; // Slide down from above
        }

        // We combine triangle and sine waves at different harmonics for woody resonance:
        // 1. Fundamental (1x freq): Triangle wave for warm body
        const osc1 = ctx.createOscillator();
        osc1.type = 'triangle';
        osc1.frequency.setValueAtTime(startFreq, now);
        osc1.frequency.exponentialRampToValueAtTime(freq, now + slideTime);

        // 2. Second Harmonic (2x freq): Sine wave for rich string overtones
        const osc2 = ctx.createOscillator();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(startFreq * 2, now);
        osc2.frequency.exponentialRampToValueAtTime(freq * 2, now + slideTime);

        // 3. Third Harmonic (3x freq): Sine wave for hollow woodiness
        const osc3 = ctx.createOscillator();
        osc3.type = 'sine';
        osc3.frequency.setValueAtTime(startFreq * 3, now);
        osc3.frequency.exponentialRampToValueAtTime(freq * 3, now + slideTime);

        // 4. Low-frequency string/wooden thump ("散音" finger strike transient)
        const thump = ctx.createOscillator();
        thump.type = 'sine';
        thump.frequency.setValueAtTime(100, now);
        thump.frequency.exponentialRampToValueAtTime(35, now + 0.08);
        const thumpGain = ctx.createGain();
        thumpGain.gain.setValueAtTime(0.25, now);
        thumpGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        thump.connect(thumpGain);
        thumpGain.connect(noteGain);

        // Slow Vibrato ("吟/猱" sliding finger vibration) starting after 0.2s
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.setValueAtTime(4.8, now); // ~4.8Hz serene vibrato
        lfoGain.gain.setValueAtTime(0, now);
        lfoGain.gain.setValueAtTime(0, now + 0.22);
        lfoGain.gain.linearRampToValueAtTime(freq * 0.006, now + 0.65); // subtle pitch wave

        lfo.connect(lfoGain);
        lfoGain.connect(osc1.frequency);
        lfoGain.connect(osc2.frequency);
        lfoGain.connect(osc3.frequency);

        // Lowpass filter to simulate higher harmonic absorption by wooden soundboard
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(freq * 4.0, now);
        filter.frequency.exponentialRampToValueAtTime(freq * 1.3, now + 0.55);
        filter.Q.setValueAtTime(1.0, now);

        // Harmonic balance gains
        const mix1 = ctx.createGain();
        mix1.gain.setValueAtTime(0.68, now);
        const mix2 = ctx.createGain();
        mix2.gain.setValueAtTime(0.24, now);
        const mix3 = ctx.createGain();
        mix3.gain.setValueAtTime(0.08, now);

        osc1.connect(mix1);
        mix1.connect(filter);

        osc2.connect(mix2);
        mix2.connect(filter);

        osc3.connect(mix3);
        mix3.connect(filter);

        filter.connect(noteGain);

        // Ping-pong delay line (湖畔余音) for spatial resonance
        const delay = ctx.createDelay(1.5);
        delay.delayTime.setValueAtTime(0.42, now);
        const delayFeedback = ctx.createGain();
        delayFeedback.gain.setValueAtTime(0.28, now);

        const delayFilter = ctx.createBiquadFilter();
        delayFilter.type = 'lowpass';
        delayFilter.frequency.setValueAtTime(900, now);

        noteGain.connect(delay);
        delay.connect(delayFilter);
        delayFilter.connect(delayFeedback);
        delayFeedback.connect(delay);

        const dryGain = ctx.createGain();
        dryGain.gain.setValueAtTime(0.82, now);
        const wetGain = ctx.createGain();
        wetGain.gain.setValueAtTime(0.28, now);

        noteGain.connect(dryGain);
        dryGain.connect(ctx.destination);

        delayFeedback.connect(wetGain);
        wetGain.connect(ctx.destination);

        // Play and cleanup
        osc1.start(now);
        osc2.start(now);
        osc3.start(now);
        thump.start(now);
        lfo.start(now);

        const stopTime = now + 2.8;
        osc1.stop(stopTime);
        osc2.stop(stopTime);
        osc3.stop(stopTime);
        thump.stop(now + 0.1);
        lfo.stop(stopTime);
      } else {
        // Cyber frequency scan
        const osc = ctx.createOscillator();
        const clickGain = ctx.createGain();
        const pDelay = ctx.createDelay(1.0);
        const pDelayGain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq * 1.5, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.5, ctx.currentTime + 0.3);

        clickGain.gain.setValueAtTime(0.2, ctx.currentTime);
        clickGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);

        pDelay.delayTime.setValueAtTime(0.12, ctx.currentTime);
        pDelayGain.gain.setValueAtTime(0.15, ctx.currentTime);

        // Chain
        osc.connect(clickGain);
        clickGain.connect(pDelay);
        pDelay.connect(pDelayGain);
        pDelayGain.connect(ctx.destination);
        clickGain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 1.5);
      }
    } catch (e) {
      // Ignored gracefully
    }
  };

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

  // Map Panning Event Handlers
  const handleMapMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    setIsDraggingMap(true);
    dragStartRef.current = { x: e.clientX - mapPan.x, y: e.clientY - mapPan.y };
    dragDistanceRef.current = 0;
  };

  const handleMapMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isDraggingMap) return;
    const newX = e.clientX - dragStartRef.current.x;
    const newY = e.clientY - dragStartRef.current.y;
    
    const dx = newX - mapPan.x;
    const dy = newY - mapPan.y;
    dragDistanceRef.current += Math.sqrt(dx * dx + dy * dy);
    
    setMapPan({ x: newX, y: newY });
  };

  const handleMapMouseUpOrLeave = () => {
    setIsDraggingMap(false);
  };

  // Map Click Handler for Procedural Ripples
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

  // Particles / Background Canvas render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle class definition
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      rot: number;
      rotSpeed: number;
      type: 'petal' | 'leaf' | 'osmanthus' | 'snow' | 'digital';
      subType: 'peach' | 'willow' | 'lotus' | 'summer-leaf' | 'maple' | 'osmanthus' | 'snow' | 'plum' | 'digital';
      color: string;
    }

    const particles: Particle[] = [];
    const maxParticles = styleMode === 'artistic' ? 50 : 70;
    const content = HANGZHOU_SEASONS_DATA.find(s => s.id === activeSeason) || HANGZHOU_SEASONS_DATA[0];

    const generateParticle = (): Particle => {
      const isTech = content.particleType === 'digital';
      
      // Determine secondary sub-types for seasons to create richer visual scenes
      let subType: 'peach' | 'willow' | 'lotus' | 'summer-leaf' | 'maple' | 'osmanthus' | 'snow' | 'plum' | 'digital' = 'digital';
      let color = content.particlesColor;
      
      if (activeSeason === 'spring') {
        const rand = Math.random();
        if (rand < 0.55) {
          subType = 'peach';
          color = '#FCA5A5'; // Peach blossom pink
        } else {
          subType = 'willow';
          color = '#6EE7B7'; // Willow bud soft light green
        }
      } else if (activeSeason === 'summer') {
        const rand = Math.random();
        if (rand < 0.45) {
          subType = 'lotus';
          color = '#F472B6'; // Lotus pink
        } else {
          subType = 'summer-leaf';
          color = '#047857'; // Forest green shady leaf
        }
      } else if (activeSeason === 'autumn') {
        const rand = Math.random();
        if (rand < 0.5) {
          subType = 'maple';
          color = '#DC2626'; // Red leaf like fire
        } else {
          subType = 'osmanthus';
          color = '#F59E0B'; // Osmanthus amber/gold
        }
      } else if (activeSeason === 'winter') {
        const rand = Math.random();
        if (rand < 0.7) {
          subType = 'snow';
          color = '#FFFFFF'; // Silver snow
        } else {
          subType = 'plum';
          color = '#E11D48'; // Red wintersweet plum blossom
        }
      } else {
        subType = 'digital';
        color = content.particlesColor;
      }

      return {
        x: Math.random() * width,
        y: -10,
        vx: (Math.random() - 0.35) * (isTech ? 0.3 : 1.3),
        vy: (Math.random() * 0.9 + 0.5) * (isTech ? 1.6 : 1.2),
        size: Math.random() * (isTech ? 12 : 8) + 4,
        alpha: Math.random() * 0.5 + 0.3,
        rot: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.03,
        type: content.particleType,
        subType,
        color
      };
    };

    // Pre-populate particles
    for (let i = 0; i < maxParticles; i++) {
      const p = generateParticle();
      p.y = Math.random() * height;
      particles.push(p);
    }

    // High fidelity traditional ink wash drawings
    const drawPeach = (c: CanvasRenderingContext2D, r: number, colorStr: string) => {
      c.fillStyle = colorStr;
      c.beginPath();
      c.ellipse(0, 0, r, r / 1.5, Math.PI / 6, 0, Math.PI * 2);
      c.fill();
    };

    const drawWillow = (c: CanvasRenderingContext2D, r: number, colorStr: string) => {
      c.fillStyle = colorStr;
      c.beginPath();
      c.moveTo(-r, 0);
      c.quadraticCurveTo(0, -r / 2.5, r, 0);
      c.quadraticCurveTo(0, r / 2.5, -r, 0);
      c.fill();
    };

    const drawLotus = (c: CanvasRenderingContext2D, r: number, colorStr: string) => {
      const grad = c.createRadialGradient(0, r / 2, 1, 0, 0, r);
      grad.addColorStop(0, '#FFFFFF');
      grad.addColorStop(1, colorStr);
      c.fillStyle = grad;
      c.beginPath();
      c.moveTo(0, r);
      c.bezierCurveTo(-r * 0.8, r * 0.3, -r * 0.5, -r * 0.7, 0, -r);
      c.bezierCurveTo(r * 0.5, -r * 0.7, r * 0.8, r * 0.3, 0, r);
      c.fill();
    };

    const drawSummerLeaf = (c: CanvasRenderingContext2D, r: number, colorStr: string) => {
      c.fillStyle = colorStr;
      c.beginPath();
      c.moveTo(-r * 1.2, 0);
      c.bezierCurveTo(-r * 0.5, -r * 0.8, r * 0.5, -r * 0.8, r * 1.2, 0);
      c.bezierCurveTo(r * 0.5, r * 0.8, -r * 0.5, r * 0.8, -r * 1.2, 0);
      c.fill();
    };

    const drawMaple = (c: CanvasRenderingContext2D, r: number, colorStr: string) => {
      c.fillStyle = colorStr;
      c.beginPath();
      // Jagged multi-point maple leaf
      c.moveTo(0, -r);
      c.lineTo(r * 0.25, -r * 0.25);
      c.lineTo(r, -r * 0.35);
      c.lineTo(r * 0.35, 0);
      c.lineTo(r * 0.75, r * 0.45);
      c.lineTo(0, r * 0.2);
      c.lineTo(-r * 0.75, r * 0.45);
      c.lineTo(-r * 0.35, 0);
      c.lineTo(-r, -r * 0.35);
      c.lineTo(-r * 0.25, -r * 0.25);
      c.closePath();
      c.fill();
    };

    const drawOsmanthusCluster = (c: CanvasRenderingContext2D, r: number, colorStr: string) => {
      c.fillStyle = colorStr;
      for (let i = 0; i < 4; i++) {
        const angle = (i * Math.PI) / 2;
        const px = Math.cos(angle) * r * 0.5;
        const py = Math.sin(angle) * r * 0.5;
        c.beginPath();
        c.arc(px, py, r * 0.35, 0, Math.PI * 2);
        c.fill();
      }
      c.fillStyle = '#EA580C';
      c.beginPath();
      c.arc(0, 0, r * 0.15, 0, Math.PI * 2);
      c.fill();
    };

    const drawPlum = (c: CanvasRenderingContext2D, r: number, colorStr: string) => {
      c.fillStyle = colorStr;
      for (let i = 0; i < 5; i++) {
        const angle = (i * Math.PI * 2) / 5;
        const px = Math.cos(angle) * r * 0.45;
        const py = Math.sin(angle) * r * 0.45;
        c.beginPath();
        c.arc(px, py, r * 0.4, 0, Math.PI * 2);
        c.fill();
      }
      c.fillStyle = '#FBBF24';
      c.beginPath();
      c.arc(0, 0, r * 0.15, 0, Math.PI * 2);
      c.fill();
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth decay of scroll speed breeze
      scrollVelocityRef.current *= 0.94;
      const currentScrollWind = scrollVelocityRef.current * (styleMode === 'artistic' ? 1.6 : 2.5);

      // Render aesthetic-specific procedural background enhancements
      if (styleMode === 'artistic') {
        // Draw soft ambient mountain fog in background
        ctx.fillStyle = 'rgba(235, 230, 220, 0.08)';
        ctx.beginPath();
        ctx.moveTo(0, height * 0.6);
        ctx.bezierCurveTo(width * 0.3, height * 0.5, width * 0.7, height * 0.7, width, height * 0.6);
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.fill();

        // Parallax scroll-driven floating ink clouds
        const scrollOffset = lastScrollYRef.current;
        ctx.fillStyle = 'rgba(44, 42, 37, 0.015)'; // soft charcoal wash
        ctx.beginPath();
        const yOffset = (scrollOffset * 0.15) % height;
        ctx.moveTo(0, height * 0.35 + yOffset * 0.4);
        ctx.bezierCurveTo(width * 0.35, height * 0.3 - yOffset * 0.1, width * 0.65, height * 0.45 + yOffset * 0.2, width, height * 0.4);
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.fill();
      } else {
        // Draw cyber subtle coordinate markers
        ctx.strokeStyle = 'rgba(34, 211, 238, 0.02)';
        ctx.lineWidth = 0.5;
        // Horizontal grid
        for (let i = 0; i < height; i += 60) {
          ctx.beginPath();
          ctx.moveTo(0, i);
          ctx.lineTo(width, i);
          ctx.stroke();
        }
        // Vertical grid
        for (let i = 0; i < width; i += 60) {
          ctx.beginPath();
          ctx.moveTo(i, 0);
          ctx.lineTo(i, height);
          ctx.stroke();
        }
      }

      // Draw and update particles
      particles.forEach((p, idx) => {
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);

        // Render based on fine-grained season sub-type
        if (p.subType === 'peach') {
          drawPeach(ctx, p.size, p.color);
        } else if (p.subType === 'willow') {
          drawWillow(ctx, p.size, p.color);
        } else if (p.subType === 'lotus') {
          drawLotus(ctx, p.size, p.color);
        } else if (p.subType === 'summer-leaf') {
          drawSummerLeaf(ctx, p.size, p.color);
        } else if (p.subType === 'maple') {
          drawMaple(ctx, p.size, p.color);
        } else if (p.subType === 'osmanthus') {
          drawOsmanthusCluster(ctx, p.size, p.color);
        } else if (p.subType === 'snow') {
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.35, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.subType === 'plum') {
          drawPlum(ctx, p.size, p.color);
        } else if (p.subType === 'digital') {
          // Render glowing binary coordinates or 0/1 bits
          ctx.fillStyle = p.color;
          ctx.font = `${p.size + 4}px JetBrains Mono, Space Grotesk, monospace`;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 6;
          ctx.fillText(idx % 2 === 0 ? '0' : '1', 0, 0);
        }

        ctx.restore();

        // Physics movement (combining original velocities, custom wind speed sliders, and scroll wind forces)
        const windFactor = (windSpeed / 50);
        p.x += (p.vx * windFactor) + currentScrollWind * (p.size / 10);
        p.y += (p.vy * windFactor) + Math.abs(currentScrollWind) * 0.15;
        p.rot += p.rotSpeed * windFactor + currentScrollWind * 0.008;

        // Reset particles exceeding bounds
        if (p.y > height || p.x < -30 || p.x > width + 30) {
          particles[idx] = generateParticle();
        }
      });

      requestRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [activeSeason, styleMode, windSpeed]);

  // Poetic Oracle Drawing Simulation
  const handleDrawOracle = async () => {
    if (isGeneratingOracle) return;
    setIsGeneratingOracle(true);
    setIsOracleFlipped(false);

    // Play drawing sound effect
    playPluck(392.00); // G4
    setTimeout(() => playPluck(523.25), 150); // C5

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
        setOracleCard(data);
        setIsGeneratingOracle(false);
        setIsOracleFlipped(true);
        playPluck(659.25); // E5
      } catch (error: any) {
        console.warn("AI Oracle generation failed, falling back to traditional:", error);
        // Fallback to traditional drawing
        const randomIndex = Math.floor(Math.random() * POETIC_ORACLES.length);
        setSelectedOracleIndex(randomIndex);
        setTimeout(() => {
          setOracleCard({
            ...POETIC_ORACLES[randomIndex],
            title: POETIC_ORACLES[randomIndex].title + " (传统签)"
          });
          setIsGeneratingOracle(false);
          setIsOracleFlipped(true);
          playPluck(659.25); // E5
        }, 1200);
      }
    } else {
      // Traditional drawing
      const randomIndex = Math.floor(Math.random() * POETIC_ORACLES.length);
      setSelectedOracleIndex(randomIndex);
      setTimeout(() => {
        setOracleCard(POETIC_ORACLES[randomIndex]);
        setIsGeneratingOracle(false);
        setIsOracleFlipped(true);
        playPluck(659.25); // E5
      }, 1200);
    }
  };

  const currentContent = HANGZHOU_SEASONS_DATA.find(s => s.id === activeSeason) || HANGZHOU_SEASONS_DATA[0];

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

  const mountainStroke = 
    activeSeason === 'spring' ? 'rgba(244, 63, 94, 0.15)' :
    activeSeason === 'summer' ? 'rgba(16, 185, 129, 0.2)' :
    activeSeason === 'autumn' ? 'rgba(180, 83, 9, 0.18)' :
    activeSeason === 'winter' ? 'rgba(100, 116, 139, 0.15)' :
    'rgba(44, 42, 37, 0.12)';

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
          : 'radial-gradient(circle at top right, rgba(34,211,238,0.08), transparent), radial-gradient(circle at bottom left, rgba(99,102,241,0.06), transparent)'
      }}
    >
      {/* Background Particles Canvas */}
      <canvas 
        ref={canvasRef} 
        id="bg-canvas"
        className="fixed inset-0 pointer-events-none z-10"
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

      {/* Nav Row (Seasons & Modern Tech Tabs) */}
      <nav 
        id="seasons-navbar"
        className="relative z-20 py-3 px-6 flex items-center justify-center space-x-2 sm:space-x-4 overflow-x-auto"
      >
        {HANGZHOU_SEASONS_DATA.filter((s) => s.id !== 'tech').map((season) => {
          const isActive = activeSeason === season.id;
          return (
            <button
              id={`nav-tab-${season.id}`}
              key={season.id}
              onClick={() => {
                setActiveSeason(season.id);
                playPluck(isActive ? 300 : 440);
                // Auto active the first spot of this season
                setActiveSpot(season.spots[0]);
              }}
              className={`px-4 py-2 rounded-lg text-sm transition-all duration-500 whitespace-nowrap relative flex items-center space-x-2
                ${isActive 
                  ? styleMode === 'artistic'
                    ? 'bg-[#2c2a25] text-[#f4f0e6] font-semibold'
                    : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-[0_0_15px_rgba(34,211,238,0.15)] font-bold'
                  : styleMode === 'artistic'
                    ? 'hover:bg-[#eae6db] text-[#2c2a25]/70 hover:text-[#2c2a25]'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/20'
                }`}
            >
              {/* Season indicator circle */}
              <span 
                className="w-2 h-2 rounded-full transition-all duration-300" 
                style={{ 
                  backgroundColor: isActive 
                    ? styleMode === 'artistic' ? '#10b981' : '#22d3ee'
                    : 'rgba(156, 163, 175, 0.4)' 
                }} 
              />
              <span className={styleMode === 'artistic' ? 'font-serif-sc' : 'font-mono'}>
                {styleMode === 'artistic' ? season.name.split(' · ')[0] : season.englishName.split(' · ')[0]}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Main Body */}
      <main 
        id="main-dashboard"
        className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-20 items-start"
      >
        
        {/* Left Column: Interactive Map/Visualizer (7 Cols) */}
        <section 
          id="visualizer-section"
          className="lg:col-span-7 flex flex-col space-y-4 lg:sticky lg:top-24"
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
              <span className={`text-[11px] uppercase tracking-wider font-mono ${styleMode === 'artistic' ? 'text-emerald-800' : 'text-cyan-400'}`}>
                {styleMode === 'artistic' ? '● 水墨幻境地图' : '● DIGITAL TWIN ACTIVE MAP'}
              </span>
            </div>

            {/* Interactive map SVG */}
            <svg
              id="interactive-svg-map"
              className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing select-none"
              onClick={handleMapClick}
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
                className="transition-transform duration-300 ease-out"
              >
              {/* Draw Procedural Lake Water Gradients / Textures */}
              {styleMode === 'artistic' ? (
                <>
                  {/* Classical Hand-Sketched Lakeshore and Hills around West Lake */}
                  {/* Western mountains background (水墨西湖群山) */}
                  <path 
                    d="M -10,38 Q 12,20 28,34 T 62,28 T 92,32 T 110,25" 
                    fill="none" 
                    stroke={mountainStroke} 
                    strokeWidth="1.2" 
                  />
                  <path 
                    d="M -5,44 Q 18,28 35,40 T 75,34 T 105,38" 
                    fill="none" 
                    stroke={mountainStroke} 
                    strokeWidth="0.8" 
                    opacity="0.65"
                  />
                  <path 
                    d="M 15,35 C 22,22 30,22 38,35" 
                    fill="none" 
                    stroke={mountainStroke} 
                    strokeWidth="0.5" 
                    opacity="0.5"
                  />

                  {/* Recognition representation of West Lake water basin (西湖水体) */}
                  <path 
                    d="M 22,35 C 28,18 62,18 74,30 C 78,42 76,58 68,72 C 60,82 45,84 32,82 C 20,80 18,55 22,35 Z" 
                    fill={lakeFill} 
                    stroke={lakeStroke} 
                    strokeWidth="0.8" 
                    className="transition-all duration-1000"
                  />

                  {/* Seasonal Map Overlay Details (季节限定气象景致) */}
                  {activeSeason === 'spring' && (
                    <g id="spring-blossoms" opacity="0.85">
                      {/* Pink peach petals drifting */}
                      <path d="M 25,42 Q 26,44 28,43" stroke="#f43f5e" strokeWidth="0.6" fill="none" />
                      <path d="M 55,38 Q 56,40 58,39" stroke="#f43f5e" strokeWidth="0.6" fill="none" />
                      <path d="M 68,52 Q 69,54 71,53" stroke="#f43f5e" strokeWidth="0.6" fill="none" />
                      <path d="M 34,70 Q 35,72 37,71" stroke="#f43f5e" strokeWidth="0.5" fill="none" />
                    </g>
                  )}
                  {activeSeason === 'summer' && (
                    <g id="summer-lotus" opacity="0.9">
                      {/* Lotus leaves on the lake water */}
                      <circle cx="30" cy="52" r="1.2" fill="#047857" opacity="0.6" />
                      <circle cx="31" cy="53" r="0.9" fill="#047857" opacity="0.6" />
                      <circle cx="30.5" cy="52.5" r="0.4" fill="#f43f5e" /> {/* Pink bud */}

                      <circle cx="58" cy="62" r="1.5" fill="#047857" opacity="0.6" />
                      <circle cx="59.5" cy="61.5" r="1.0" fill="#047857" opacity="0.6" />
                      <circle cx="58.5" cy="61.8" r="0.5" fill="#f43f5e" /> {/* Pink bud */}

                      <circle cx="48" cy="45" r="1.1" fill="#047857" opacity="0.5" />
                    </g>
                  )}
                  {activeSeason === 'autumn' && (
                    <g id="autumn-osmanthus" opacity="0.8">
                      {/* Golden maple / osmanthus specs */}
                      <circle cx="41" cy="38" r="0.4" fill="#d97706" />
                      <circle cx="43" cy="40" r="0.5" fill="#f59e0b" />
                      <circle cx="65" cy="48" r="0.4" fill="#f59e0b" />
                      <circle cx="32" cy="65" r="0.5" fill="#d97706" />
                    </g>
                  )}
                  {activeSeason === 'winter' && (
                    <g id="winter-snowflakes" opacity="0.9">
                      {/* Falling white snowflakes and snow caps */}
                      <circle cx="28" cy="22" r="0.6" fill="#ffffff" stroke="rgba(148,163,184,0.4)" strokeWidth="0.2" />
                      <circle cx="46" cy="18" r="0.5" fill="#ffffff" stroke="rgba(148,163,184,0.4)" strokeWidth="0.2" />
                      <circle cx="68" cy="15" r="0.6" fill="#ffffff" stroke="rgba(148,163,184,0.4)" strokeWidth="0.2" />
                      {/* Snow capping on Broken Bridge */}
                      <path d="M 45,24 Q 60,23 75,27" stroke="#ffffff" strokeWidth="0.6" fill="none" />
                    </g>
                  )}

                  {/* Su Causeway (苏堤) - Runs South to North */}
                  <path 
                    d="M 38,81 C 37,68 37,55 38,30" 
                    stroke={suCausewayStroke} 
                    strokeWidth="2.5" 
                    strokeLinecap="round"
                    fill="none"
                    className="transition-all duration-1000"
                  />
                  <path 
                    d="M 38,81 C 37,68 37,55 38,30" 
                    stroke={suCausewayInnerStroke} 
                    strokeWidth="0.75" 
                    strokeDasharray="1,1" 
                    fill="none"
                    className="transition-all duration-1000"
                  />

                  {/* Bai Causeway (白堤) - Connecting Broken Bridge to Solitary Hill */}
                  <path 
                    d="M 45,25 Q 60,24 75,28" 
                    stroke="rgba(44, 42, 37, 0.3)" 
                    strokeWidth="1.2" 
                    strokeLinecap="round" 
                    fill="none" 
                    opacity="0.7" 
                  />

                  {/* Solitary Hill (孤山) - Large wooded island */}
                  <path 
                    d="M 42,25 C 45,22 52,22 55,25 C 53,28 44,28 42,25 Z" 
                    fill={solitaryHillFill} 
                    stroke={solitaryHillStroke} 
                    strokeWidth="0.4" 
                    className="transition-all duration-1000"
                  />

                  {/* Three Pools Mirroring the Moon (三潭印月 / 小瀛洲) */}
                  <circle 
                    cx="50" 
                    cy="70" 
                    r="4.5" 
                    fill={lakeFill} 
                    stroke={lakeStroke} 
                    strokeWidth="0.5" 
                    className="transition-all duration-1000"
                  />
                  {/* Three tiny pagoda landmarks in water (三潭) */}
                  <circle cx="48.2" cy="73.2" r="0.5" fill="#3e3b32" stroke="#f4f0e6" strokeWidth="0.15" />
                  <circle cx="51.8" cy="73.2" r="0.5" fill="#3e3b32" stroke="#f4f0e6" strokeWidth="0.15" />
                  <circle cx="50" cy="75" r="0.5" fill="#3e3b32" stroke="#f4f0e6" strokeWidth="0.15" />

                  {/* Leifeng Pagoda Silhouette (雷峰夕照) */}
                  <path 
                    d="M 44,85 L 46,85 L 45.6,82 L 44.4,82 Z M 44.2,82 L 45.8,82 L 45.3,79 L 44.7,79 Z M 44.5,79 L 45.5,79 L 45,75 Z" 
                    fill={activeSeason === 'winter' ? 'rgba(100, 116, 139, 0.6)' : activeSeason === 'autumn' ? 'rgba(217, 119, 6, 0.65)' : 'rgba(120, 80, 40, 0.45)'} 
                  />

                  {/* Qiantang River (钱塘江) flowing in bottom-right corner */}
                  <path 
                    d="M 70,100 C 72,92 82,88 100,78 L 100,100 Z" 
                    fill="rgba(37, 99, 235, 0.03)" 
                    stroke="rgba(37, 99, 235, 0.08)" 
                    strokeWidth="0.5" 
                  />

                  {/* Decorative classical boat */}
                  <path 
                    d="M 28,62 C 32,62 34,60 38,60 C 37,61 35,63 28,63 Z" 
                    fill="#2c2a25" 
                    opacity="0.4" 
                  />
                  <line x1="33" y1="56" x2="33" y2="60" stroke="#2c2a25" strokeWidth="0.5" opacity="0.4" />
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
              {currentContent.spots.map((spot, idx) => {
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

            {/* Aesthetic specific map card bottom footer banner */}
            {styleMode === 'artistic' ? (
              <div 
                id="artistic-hint-overlay"
                className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none"
              >
                <div className="text-[11px] text-emerald-950/60 font-serif-sc flex items-center space-x-1.5 bg-[#eae5da]/90 px-3 py-1 rounded-full shadow-sm">
                  <Wind className="w-3.5 h-3.5 animate-spin-slow text-emerald-800" />
                  <span>点击湖面，泛起涟漪，聆听古琴和声</span>
                </div>
                <div className="text-[10px] text-emerald-950/50 font-calligraphy text-right">
                  “山色空蒙雨亦奇”
                </div>
              </div>
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

        {/* Right Column: Detailed Poetry & Poetic Oracle (5 Cols) */}
        <section 
          id="content-details-section"
          className="lg:col-span-5 flex flex-col space-y-6"
        >
          {/* Main Season Card */}
          <div 
            id="season-content-card"
            className={`p-6 rounded-2xl border transition-all duration-1000 relative overflow-hidden flex flex-col justify-between min-h-[400px]
              ${styleMode === 'artistic'
                ? 'bg-[#fbf8f2] border-transparent shadow-[0_4px_24px_rgba(40,30,10,0.02)]'
                : 'bg-[#111622] border-cyan-500/10 shadow-lg'
              }`}
          >
            {/* Stamp seal overlay at the top left of card */}
            {styleMode === 'artistic' && (
              <div className="absolute right-4 top-4 border-2 border-red-700/60 text-red-700/80 font-bold px-2 py-1 rounded-sm text-[11px] tracking-widest leading-tight uppercase transform rotate-12 font-calligraphy">
                江南印记
              </div>
            )}

            {/* Card Heading */}
            <div>
              <div className="flex items-center space-x-2">
                <span className={`text-xs font-mono tracking-widest uppercase ${styleMode === 'artistic' ? 'text-emerald-800' : 'text-cyan-400'}`}>
                  {currentContent.englishName}
                </span>
              </div>
              <h2 className={`text-2xl font-bold tracking-widest mt-2 ${styleMode === 'artistic' ? 'text-zinc-900 font-serif-sc' : 'text-white'}`}>
                {currentContent.title}
              </h2>
              <p className="text-sm leading-relaxed opacity-85 mt-3">
                {currentContent.description}
              </p>
            </div>

            {/* Classical Poem Display Section */}
            <div className={`my-6 p-5 rounded-2xl transition-all duration-1000 flex flex-col items-center justify-center relative
              ${styleMode === 'artistic' 
                ? 'bg-[#eae5da]/30' 
                : 'bg-slate-950/50'
              }`}
            >
              {/* Calligraphy brush strokes background lines */}
              {styleMode === 'artistic' ? (
                <div className="flex flex-col space-y-2 items-center">
                  <div className="font-calligraphy text-2xl tracking-[0.4em] text-zinc-800 flex flex-col sm:flex-row sm:space-x-4 items-center">
                    {currentContent.poem.map((line, lidx) => (
                      <span key={lidx} className="block pb-1 py-1">
                        {line}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="w-full font-mono text-sm tracking-wider text-cyan-300 text-left space-y-1.5 pl-3">
                  <div className="text-[10px] text-cyan-500/60 uppercase">{'// POETIC DATA GRID'}</div>
                  {currentContent.poem.map((line, lidx) => (
                    <div key={lidx} className="flex items-center space-x-2">
                      <ChevronRight className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                      <span>{line}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Translation */}
              <div className="mt-4 pt-1 w-full">
                <p className={`text-xs leading-relaxed italic text-center ${styleMode === 'artistic' ? 'text-zinc-600' : 'text-slate-400'}`}>
                  {currentContent.translation}
                </p>
              </div>
            </div>

            {/* Quick stats grid for modern tech overlay */}
            {styleMode === 'geometric' && (
              <div className="mb-4 bg-slate-950/60 p-3 rounded-xl flex items-center justify-between text-xs font-mono">
                <div className="flex items-center space-x-2">
                  <Activity className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="text-slate-400">数智客流状况:</span>
                </div>
                <span className="text-cyan-300 font-bold">{smartStats.crowdFlow}</span>
              </div>
            )}

            {/* Dynamic decorative stamp or glowing grid node */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-2 text-xs opacity-60">
                <Compass className="w-4 h-4 animate-spin-slow" />
                <span className="font-serif-sc">
                  {styleMode === 'artistic' ? '杭州 · 钱塘风雅' : 'HANGZHOU, SECURE NODE'}
                </span>
              </div>
              <div className="text-[11px] font-mono opacity-50">
                SYS_VER: 2026.07.13
              </div>
            </div>
          </div>

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
                <div className="relative w-full h-[332px] mb-2">
                  {orderedScores.map((score, idx) => {
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
                    let targetH = 195;
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

                      if (score.name === aName) {
                        // Card A (originally active at Slot 0)
                        if (choreographyStage === 'shrink_A') {
                          const slot = getSlotProps(0);
                          targetLeft = slot.left;
                          targetTop = slot.top;
                          targetW = slot.width;
                          targetH = slot.height;
                          targetScale = 0.85;
                          isExpanded = true;
                        } else if (choreographyStage === 'move_B' || choreographyStage === 'arrange_CD') {
                          const slot = getSlotProps(0);
                          targetLeft = slot.left;
                          targetTop = slot.top;
                          targetW = slot.width;
                          targetH = 112; // Shrunk collapsed height
                          targetScale = 0.85;
                          isExpanded = false;
                        } else {
                          // move_A or expand_B (A moves down to its new fixed bottom slot!)
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
                        if (choreographyStage === 'shrink_A') {
                          const currentSlotIdx = getStableSlotIdx(bName!, aName);
                          const slot = getSlotProps(currentSlotIdx);
                          targetLeft = slot.left;
                          targetTop = slot.top;
                          targetW = slot.width;
                          targetH = slot.height;
                          targetScale = 1.0;
                          isExpanded = false;
                        } else if (choreographyStage === 'move_B' || choreographyStage === 'arrange_CD' || choreographyStage === 'move_A') {
                          const slot = getSlotProps(0);
                          targetLeft = slot.left;
                          targetTop = slot.top;
                          targetW = slot.width;
                          targetH = 112; // Keep it collapsed height while moving to Slot 0
                          targetScale = 0.85;
                          isExpanded = false;
                        } else {
                          // expand_B
                          const slot = getSlotProps(0);
                          targetLeft = slot.left;
                          targetTop = slot.top;
                          targetW = slot.width;
                          targetH = slot.height;
                          targetScale = 1.0;
                          isExpanded = true;
                        }
                      } else {
                        // Cards C or D (remains in stable slots)
                        if (choreographyStage === 'shrink_A' || choreographyStage === 'move_B') {
                          const currentSlotIdx = getStableSlotIdx(score.name, aName);
                          const slot = getSlotProps(currentSlotIdx);
                          targetLeft = slot.left;
                          targetTop = slot.top;
                          targetW = slot.width;
                          targetH = slot.height;
                          targetScale = 1.0;
                          isExpanded = false;
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
                    }

                    const isCurrentlyActiveVisual = choreographyStage === 'idle'
                      ? isPlaying
                      : (clickedScoreName ? (score.name === clickedScoreName) : isPlaying);

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
                          type: "spring",
                          stiffness: 110,
                          damping: 18,
                        }}
                        className={`rounded-2xl border text-xs flex flex-col justify-between relative overflow-hidden transition-all duration-300 shadow-md ${
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
                          className={`w-full h-full flex flex-col justify-between transition-all duration-300 ${
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
                              <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="mt-2 text-left relative w-full"
                              >
                                <div className="absolute left-4 right-4 top-[14px] h-[1px] bg-dashed border-t border-zinc-300 dark:border-zinc-700/50 z-0 pointer-events-none" />
                                <div 
                                  ref={notesScrollRef}
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
                            )}

                            {/* Footer/Description area */}
                            <div className={`mt-auto pt-1.5 border-t border-dashed w-full transition-all duration-300 ${
                              isCurrentlyActiveVisual
                                ? styleMode === 'artistic'
                                  ? 'border-rose-200/60 text-rose-900/80'
                                  : 'border-rose-900/40 text-rose-200/80'
                                : styleMode === 'artistic'
                                  ? 'border-zinc-200 text-zinc-500'
                                  : 'border-cyan-950/50 text-slate-400'
                            }`}>
                              {isExpanded ? (
                                <p className="font-serif-sc text-[10px] leading-relaxed line-clamp-2 text-left">
                                  {score.description}
                                </p>
                              ) : (
                                <div className="flex items-center justify-between w-full">
                                  <span className={`text-[8.5px] truncate max-w-[65%] font-medium ${
                                    isCurrentlyActiveVisual
                                      ? styleMode === 'artistic' ? 'text-rose-800/90' : 'text-rose-300/95'
                                      : styleMode === 'artistic' ? 'text-[#8b8273]' : 'text-slate-400/95'
                                  }`}>
                                     点击可切换到此曲谱
                                  </span>
                                  <span className={`text-[8.5px] font-bold tracking-wider ${
                                    isCurrentlyActiveVisual
                                      ? styleMode === 'artistic'
                                        ? 'text-rose-800 group-hover:text-rose-950'
                                        : 'text-rose-300 group-hover:text-rose-100'
                                      : styleMode === 'artistic'
                                        ? 'text-emerald-800 group-hover:text-[#2d553b]'
                                        : 'text-cyan-400 group-hover:text-cyan-300'
                                  }`}>
                                    切换
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Poetic Oracle & Calligraphy Fortune (Lower Card) */}
          <div 
            id="oracle-generator-card"
            className={`p-6 rounded-2xl border transition-all duration-1000 flex flex-col justify-between relative overflow-hidden
              ${styleMode === 'artistic'
                ? 'bg-[#fbf8f2] border-transparent shadow-[0_4px_24px_rgba(40,30,10,0.02)]'
                : 'bg-[#111622] border-cyan-500/10 shadow-lg'
              }`}
          >
            {/* Draw Loader Overlay covering the ENTIRE card */}
            <AnimatePresence>
              {isGeneratingOracle && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-[#fdfbf7]/98 dark:bg-[#0c0f17]/98 flex flex-col items-center justify-center z-30 transition-all duration-300 p-6 text-center select-none"
                >
                  {styleMode === 'artistic' ? (
                    <div className="flex flex-col items-center justify-center space-y-7 relative w-full h-full">
                      {/* Beautiful Rotating Trigram / Yin-Yang watermark */}
                      <motion.svg
                        className="absolute w-72 h-72 opacity-[0.04] text-amber-900/60 pointer-events-none"
                        viewBox="0 0 100 100"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
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
                            rotate: [-8, 8, -8, 8, -8, 8, -4, 4, 0],
                            y: [-3, 3, -3, 3, -3, 3, -1, 1, 0]
                          }}
                          transition={{
                            duration: 0.9,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                          className="relative w-20 h-24 bg-gradient-to-b from-amber-800/15 via-amber-900/35 to-amber-950/50 border border-amber-900/20 rounded-b-3xl flex items-center justify-center pt-3 shadow-md"
                        >
                          {/* Inside Sticks */}
                          <motion.div className="absolute -top-6 left-4 w-1.5 h-12 bg-amber-800/50 rounded-t" animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6 }} />
                          <motion.div className="absolute -top-8 left-8 w-1.5 h-14 bg-amber-700/60 rounded-t" animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 0.5, delay: 0.15 }} />
                          <motion.div className="absolute -top-7 left-12 w-1.5 h-13 bg-amber-800/40 rounded-t" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.7, delay: 0.05 }} />
                          <motion.div className="absolute -top-9 left-15 w-1.5 h-14 bg-amber-700/50 rounded-t" animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.65, delay: 0.25 }} />
                          
                          <div className="absolute bottom-3 left-0 right-0 text-center text-[10px] text-amber-100/60 font-serif-sc tracking-widest font-bold">
                            西湖签筒
                          </div>
                        </motion.div>

                        {/* Elegantly Rising Gilded Stick */}
                        <motion.div
                          initial={{ y: 25, scale: 0.8, opacity: 0, rotate: -15 }}
                          animate={{ 
                            y: -48, 
                            scale: 1, 
                            opacity: 1, 
                            rotate: [0, 5, -5, 0],
                            boxShadow: ["0 0 5px rgba(245,158,11,0.2)", "0 0 20px rgba(245,158,11,0.6)", "0 0 5px rgba(245,158,11,0.2)"]
                          }}
                          transition={{
                            duration: 2.0,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                          className="absolute w-8 h-24 bg-[#fefdfa] border-2 border-amber-600/40 shadow-xl rounded flex flex-col items-center justify-between py-2 px-1 text-amber-950"
                        >
                          <div className="w-1.5 h-1.5 bg-red-600 rounded-full" />
                          <div className="text-[9px] font-serif-sc font-bold tracking-widest text-center" style={{ writingMode: 'vertical-rl' }}>
                            上签
                          </div>
                          <div className="w-1 h-3 bg-red-600/30 rounded-full" />
                        </motion.div>
                      </div>

                      <div className="space-y-2 relative z-10">
                        <p className="text-sm font-serif-sc text-zinc-800 font-bold tracking-widest min-h-[20px] transition-all duration-300">
                          {oracleLoadingStep === 0 && "澄澈杂念，诚心祈愿..."}
                          {oracleLoadingStep === 1 && "西湖水色，凝入灵签..."}
                          {oracleLoadingStep === 2 && "摇掷乾坤，天人感应..."}
                          {oracleLoadingStep === 3 && "水光潋滟，笔走龙蛇..."}
                        </p>
                        <p className="text-[10px] text-zinc-500 font-serif-sc">
                          正在虔诚摇取今日诗意灵气，静待水墨丹青生成...
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center space-y-7 relative w-full h-full">
                      {/* Glowing Holographic Matrix Radar Background */}
                      <motion.svg
                        className="absolute w-80 h-80 opacity-[0.08] text-cyan-400 pointer-events-none"
                        viewBox="0 0 100 100"
                        animate={{ rotate: -360 }}
                        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
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
                      <div className="relative w-48 h-28 flex items-center justify-center">
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
                      </div>

                      {/* Interactive Telemetry Log steps */}
                      <div className="space-y-1.5 w-full max-w-[280px]">
                        <p className="text-[10px] font-mono text-cyan-400 tracking-widest uppercase min-h-[16px]">
                          {oracleLoadingStep === 0 && ">> CALIBRATING QUANTUM SENSORS..."}
                          {oracleLoadingStep === 1 && ">> ESTABLISHING WAVE COHERENCE..."}
                          {oracleLoadingStep === 2 && ">> DECRYPTING SPECTRAL CODES..."}
                          {oracleLoadingStep === 3 && ">> RESOLVING ALGORITHMIC SIGNALS..."}
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
                      </div>
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
                <div 
                  id="oracle-result-wrapper"
                  className={`w-full p-4 rounded-xl transition-all duration-500 flex flex-col justify-between h-full relative
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
                </div>
              ) : (
                <div className="text-center opacity-60">
                  <CompassIcon className={`w-12 h-12 mx-auto mb-2 text-zinc-400 animate-spin-slow`} />
                  <p className="text-xs">暂无运势。点击下方按钮，摇取你的西湖诗意签</p>
                </div>
              )}

              {/* Draw Loader Overlay has been moved to the outer container level */}
            </div>

            {/* Oracle Control Button */}
            <button
              id="draw-oracle-btn"
              onClick={handleDrawOracle}
              className={`w-full py-2.5 rounded-xl font-bold tracking-widest text-sm transition-all duration-300 flex items-center justify-center space-x-2
                ${styleMode === 'artistic'
                  ? 'bg-[#2c2a25] text-[#f4f0e6] hover:bg-zinc-800'
                  : 'bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white hover:brightness-110 shadow-[0_0_20px_rgba(6,182,212,0.25)]'
                }`}
            >
              <RotateCcw className="w-4 h-4 animate-spin-slow" />
              <span>{styleMode === 'artistic' ? (useAiOracle ? 'AI 妙笔撰灵签' : '摇取西湖意境签') : 'DRAW ALGORITHMIC SIGN'}</span>
            </button>
          </div>
        </section>

        {/* Full-Width Section: Modern Architectures Cyber Light Show Control Center */}
        <section 
          id="modern-landmarks-lightshow"
          className="lg:col-span-12 mt-6"
        >
          <div className={`p-6 rounded-3xl border transition-all duration-1000 overflow-hidden relative group
            ${styleMode === 'artistic' 
              ? 'bg-[#eae5da]/40 border-transparent text-zinc-900 shadow-[0_4px_30px_rgba(20,83,45,0.02)]' 
              : 'bg-[#121927]/90 border-cyan-500/10 text-slate-100 shadow-[0_8px_32px_rgba(0,0,0,0.5)]'
            }`}
          >
            {/* Ink wash background stains or cyber grid decor */}
            {styleMode === 'artistic' ? (
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-zinc-800/5 rounded-full filter blur-3xl pointer-events-none" />
            ) : (
              <>
                <div className="absolute inset-0 bg-gradient-to-tr from-cyan-950/10 via-indigo-950/5 to-purple-950/10 pointer-events-none" />
                <div className="absolute -top-32 -left-32 w-80 h-80 bg-cyan-500/5 rounded-full filter blur-3xl animate-pulse pointer-events-none" />
              </>
            )}

            <div className="relative z-10 flex flex-col xl:flex-row gap-8 items-stretch">
              
              {/* Left Panel: Slogan, Tabs, Modes & Actions */}
              <div className="flex-1 flex flex-col justify-between space-y-6">
                
                {/* Header Slogan */}
                <div>
                  <div className="flex items-center space-x-2">
                    <Cpu className={`w-4 h-4 ${styleMode === 'artistic' ? 'text-emerald-800' : 'text-cyan-400'}`} />
                    <span className={`text-xs font-mono tracking-widest uppercase ${styleMode === 'artistic' ? 'text-emerald-900/70' : 'text-cyan-400/80'}`}>
                      {styleMode === 'artistic' ? '现代重器 · 数智脉搏' : 'CYBER METROPOLIS CONTROL'}
                    </span>
                  </div>
                  <h3 className={`text-2xl font-bold mt-2 tracking-wider ${styleMode === 'artistic' ? 'font-serif-sc text-zinc-900' : 'font-sans text-white bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-indigo-300'}`}>
                    {styleMode === 'artistic' ? '钱塘数智地标 · 动态光影控制台' : 'Qiantang Smart Landmarks Light Show Simulator'}
                  </h3>
                  <p className="text-xs sm:text-sm mt-3 opacity-80 leading-relaxed">
                    {styleMode === 'artistic'
                      ? '当西湖的古典意境流经钱塘之畔，现代建筑群在AI算法与清洁电能的驱动下，编织出虚实相生的宏伟灯光画卷。点击选择地标与灯光样式，为整座未来城市谱写数字乐章。'
                      : 'Simulate urban smart-grid energy scheduling and adaptive dynamic architectural illumination. The landmarks harmonize via real-time algorithmic power management to bridge traditional Jiangnan beauty and peak green-energy automation.'}
                  </p>
                </div>

                {/* Tabs: Landmark Selection */}
                <div className="space-y-2">
                  <span className={`text-xs font-mono block mb-1 uppercase tracking-wider ${styleMode === 'artistic' ? 'text-zinc-500' : 'text-slate-400'}`}>
                    {styleMode === 'artistic' ? '1. 选择数智地标 (Select Landmark)' : '1. SELECT LANDMARK ENGINE'}
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'conference', name: '国际会议中心', eng: 'Conference' },
                      { id: 'theater', name: '杭州大剧院', eng: 'Grand Theater' },
                      { id: 'g20', name: 'G20主会场', eng: 'G20 Summit' },
                      { id: 'lotus', name: '奥体「大莲花」', eng: 'Big Lotus' }
                    ].map(tab => {
                      const isActive = activeLandmark === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => {
                            setActiveLandmark(tab.id as any);
                            // Play a soft select beep
                            playPluck(isActive ? 330 : 261.63);
                          }}
                          className={`p-3 rounded-xl border text-left transition-all duration-300 flex flex-col justify-between group/tab
                            ${isActive 
                              ? styleMode === 'artistic'
                                ? 'bg-zinc-900/5 border-emerald-950/40 text-emerald-950 shadow-[inset_0_1px_3px_rgba(0,0,0,0.05)]'
                                : 'bg-cyan-500/10 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.15)]'
                              : styleMode === 'artistic'
                                ? 'bg-transparent border-emerald-950/10 text-zinc-600 hover:border-emerald-950/30'
                                : 'bg-[#151c2d] border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                            }`}
                        >
                          <span className={`text-xs font-bold leading-none ${styleMode === 'artistic' ? 'font-serif-sc' : ''}`}>
                            {tab.name}
                          </span>
                          <span className="text-[10px] font-mono opacity-60 mt-1 leading-none uppercase">
                            {tab.eng}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Lighting Theme Selection */}
                <div className="space-y-2">
                  <span className={`text-xs font-mono block mb-1 uppercase tracking-wider ${styleMode === 'artistic' ? 'text-zinc-500' : 'text-slate-400'}`}>
                    {styleMode === 'artistic' ? '2. 选择灯光样式 (Select Light Mode)' : '2. SELECT LIGHTING STYLE'}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: 'ink', name: '水墨江南', color: 'border-zinc-500 text-zinc-600 bg-zinc-100/50 dark:bg-zinc-900/30' },
                      { id: 'cyber', name: '赛博未来', color: 'border-pink-500 text-pink-400 bg-pink-500/5' },
                      { id: 'golden', name: '盛世金华', color: 'border-amber-500 text-amber-400 bg-amber-500/5' },
                      { id: 'eco', name: '数智绿色', color: 'border-emerald-500 text-emerald-400 bg-emerald-500/5' }
                    ].map(style => {
                      const isStyleActive = activeLightMode === style.id;
                      return (
                        <button
                          key={style.id}
                          onClick={() => {
                            setActiveLightMode(style.id as any);
                            playPluck(440);
                          }}
                          className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-all duration-300 flex items-center space-x-1.5
                            ${isStyleActive 
                              ? styleMode === 'artistic'
                                ? 'bg-emerald-900/10 border-emerald-800 text-emerald-900 shadow-sm'
                                : 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.1)]'
                              : styleMode === 'artistic'
                                ? 'bg-transparent border-emerald-950/10 text-zinc-500 hover:border-emerald-950/20'
                                : 'bg-transparent border-slate-800 text-slate-400 hover:border-slate-700'
                            }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${isStyleActive ? 'animate-pulse' : ''}
                            ${style.id === 'ink' ? 'bg-zinc-600' : ''}
                            ${style.id === 'cyber' ? 'bg-pink-500' : ''}
                            ${style.id === 'golden' ? 'bg-amber-400' : ''}
                            ${style.id === 'eco' ? 'bg-emerald-400' : ''}
                          `} />
                          <span className={styleMode === 'artistic' ? 'font-serif-sc' : ''}>{style.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Actions Block */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    onClick={() => {
                      if (isLightshowRunning) {
                        setIsLightshowRunning(false);
                        playPluck(220); // Low pitch stop sound
                        setSmartStats(prev => ({
                          ...prev,
                          smartGridLoad: 28.5,
                          crowdFlow: styleMode === 'artistic' ? '畅通' : 'NORMAL'
                        }));
                      } else {
                        setIsLightshowRunning(true);
                        setIsEcoOptimizing(false);
                        
                        // Increase grid load slightly during lightshow to simulate energy flow
                        setSmartStats(prev => ({
                          ...prev,
                          smartGridLoad: Math.min(95, prev.smartGridLoad + Math.floor(Math.random() * 10) + 15),
                          crowdFlow: styleMode === 'artistic' ? '盛会如织' : 'HIGH_DENSITY'
                        }));

                        // Trigger appropriate chord
                        const chords: Record<string, number[]> = {
                          conference: [261.63, 329.63, 392.00, 523.25], // C Major
                          theater: [293.66, 349.23, 440.00, 587.33], // D Minor 7
                          g20: [329.63, 392.00, 440.00, 523.25, 659.25], // Pentatonic
                          lotus: [349.23, 440.00, 523.25, 698.46] // F Major
                        };
                        const activeChord = chords[activeLandmark];
                        activeChord.forEach((freq, idx) => {
                          setTimeout(() => {
                            playPluck(freq);
                          }, idx * 100);
                        });
                        
                        // Trigger brief ripple explosion on main canvas or localized console effect
                        const consoleX = Math.random() * 200 + 100;
                        const consoleY = Math.random() * 100 + 100;
                        const newRipple: InkRipple = {
                          id: Date.now() + Math.random(),
                          x: consoleX,
                          y: consoleY,
                          size: 5,
                          maxSize: 180,
                          opacity: 1,
                          color: activeLightMode === 'ink' ? 'rgba(0,0,0,0.6)' : 
                                 activeLightMode === 'cyber' ? '#EC4899' :
                                 activeLightMode === 'golden' ? '#F59E0B' : '#10B981',
                          type: activeLightMode === 'ink' ? 'ink' : 'circuit'
                        };
                        setRipples(prev => [...prev, newRipple]);
                      }
                    }}
                    className={`flex-1 py-3 px-4 rounded-xl font-bold tracking-widest text-xs flex items-center justify-center space-x-2 transition-all duration-300
                      ${isLightshowRunning
                        ? styleMode === 'artistic'
                          ? 'bg-red-950/10 text-red-950 hover:bg-red-950/20 border border-red-950/20 shadow-sm'
                          : 'bg-gradient-to-r from-rose-500 to-red-600 text-white hover:brightness-110 shadow-[0_0_15px_rgba(244,63,94,0.3)]'
                        : styleMode === 'artistic'
                          ? 'bg-[#2c2a25] text-[#f4f0e6] hover:bg-zinc-800'
                          : 'bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white hover:brightness-110 shadow-[0_0_20px_rgba(6,182,212,0.25)]'
                      } ${isLightshowRunning && styleMode !== 'artistic' ? 'ring-2 ring-red-400 scale-[0.98]' : ''}`}
                  >
                    <Sparkles className={`w-4 h-4 ${isLightshowRunning ? 'animate-pulse' : ''}`} />
                    <span>
                      {isLightshowRunning 
                        ? (styleMode === 'artistic' ? '停止动态光影秀' : 'STOP CYBER LIGHTSHOW')
                        : (styleMode === 'artistic' ? '启动动态光影秀' : 'LAUNCH CYBER LIGHTSHOW')
                      }
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      playPluck(440);
                      if (isEcoOptimizing) {
                        setIsEcoOptimizing(false);
                        setSmartStats(prev => ({
                          ...prev,
                          smartGridLoad: 28.5,
                          crowdFlow: styleMode === 'artistic' ? '畅通' : 'NORMAL'
                        }));
                      } else {
                        setIsEcoOptimizing(true);
                        setIsLightshowRunning(false);

                        // Decrease load dramatically to green optimization state
                        setSmartStats(prev => ({
                          ...prev,
                          smartGridLoad: 12.8,
                          crowdFlow: styleMode === 'artistic' ? '绿色低碳' : 'ECO_FRIENDLY'
                        }));
                        // play double beep
                        setTimeout(() => playPluck(554.37), 120);
                      }
                    }}
                    className={`py-3 px-4 rounded-xl font-bold tracking-widest text-xs flex items-center justify-center space-x-2 border transition-all duration-300
                      ${styleMode === 'artistic'
                        ? isEcoOptimizing
                          ? 'border-red-950/20 bg-red-950/5 text-red-950 hover:bg-red-950/10'
                          : 'border-emerald-950/20 text-emerald-950 hover:bg-emerald-950/5'
                        : isEcoOptimizing
                          ? 'border-red-400/30 text-red-400 hover:bg-red-500/10'
                          : 'border-cyan-400/30 text-cyan-400 hover:border-cyan-400/60 hover:bg-cyan-500/10'
                      } ${isEcoOptimizing ? 'ring-2 ring-emerald-400 scale-[0.98]' : ''}`}
                  >
                    <Activity className="w-4 h-4 animate-pulse" />
                    <span>
                      {isEcoOptimizing
                        ? (styleMode === 'artistic' ? '停止能效优化' : 'STOP ECO-GRID FLOW')
                        : (styleMode === 'artistic' ? '绿色能效优化调度' : 'OPTIMIZE ECO-GRID FLOW')
                      }
                    </span>
                  </button>
                </div>

                {/* Real-time Dynamic Status Console Output */}
                <div className={`p-3 rounded-xl border font-mono text-[10px] transition-all duration-500 leading-relaxed
                  ${styleMode === 'artistic'
                    ? 'bg-zinc-900/5 text-zinc-800 border-emerald-950/10'
                    : 'bg-black/40 border-cyan-500/10 text-cyan-400/90'
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-dashed border-zinc-500/20 pb-1.5 mb-1.5">
                    <span className="font-bold flex items-center space-x-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${isLightshowRunning || isEcoOptimizing ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-400'} shrink-0`} />
                      <span>{styleMode === 'artistic' ? '控制中心 · 数智和鸣' : 'SYSTEM_TELEMETRY_CONSOLE'}</span>
                    </span>
                    <span className="opacity-55">{new Date().toLocaleTimeString()}</span>
                  </div>
                  {isLightshowRunning ? (
                    <div className="space-y-1">
                      <p className="font-bold text-amber-500">
                        &gt; {styleMode === 'artistic' ? '【光影广播指令已下达】' : '[LIGHTSHOW BROADCAST COMMAND DISPATCHED]'}
                      </p>
                      <p className="opacity-80">
                        {styleMode === 'artistic' 
                          ? `正在向【${activeLandmark === 'conference' ? '杭州国际会议中心' : activeLandmark === 'theater' ? '杭州大剧院' : activeLandmark === 'g20' ? 'G20峰会主会场' : '奥体中心「大莲花」'}】广播【${activeLightMode === 'ink' ? '水墨雅韵' : activeLightMode === 'cyber' ? '赛博幻彩' : activeLightMode === 'golden' ? '金碧辉煌' : '绿色能效'}】动态光影秀！` 
                          : `Broadcasting ${activeLightMode.toUpperCase()} pattern directly to ${activeLandmark.toUpperCase()} node...`}
                      </p>
                      <p className="text-[9px] opacity-60">
                        - {styleMode === 'artistic' ? '实时传输率' : 'LINK_RATE'}: 100% · {styleMode === 'artistic' ? '能耗负载' : 'GRID_LOAD'}: {smartStats.smartGridLoad}% · {styleMode === 'artistic' ? '状态' : 'STATUS'}: RUNNING
                      </p>
                    </div>
                  ) : isEcoOptimizing ? (
                    <div className="space-y-1 text-emerald-600 dark:text-emerald-400">
                      <p className="font-bold">
                        &gt; {styleMode === 'artistic' ? '【绿色低碳调优调度激活】' : '[GREEN ECO-GRID OPTIMIZATION ACTIVE]'}
                      </p>
                      <p className="opacity-80">
                        {styleMode === 'artistic'
                          ? `微网协同调度中：钱塘江潮汐势能与光伏清洁绿电协同供电，能耗负载调优至 12.8%，碳排比降至 0.0%！`
                          : `Harmonizing solar microgrid and tidal storage. Grid load optimized to 12.8%. Carbon offset: 100%.`}
                      </p>
                      <p className="text-[9px] opacity-65">
                        - {styleMode === 'artistic' ? '绿电配比' : 'GREEN_RATIO'}: 100% · {styleMode === 'artistic' ? '水质提升' : 'WATER_QUALITY'}: +0.1 · {styleMode === 'artistic' ? '模式' : 'MODE'}: ECO_MAX
                      </p>
                    </div>
                  ) : (
                    <p className="opacity-60 italic">
                      &gt; {styleMode === 'artistic' 
                        ? '控制台处于就绪状态。请在上方选择地标与模式，点击按钮以广播动态光影秀或优化绿色电网。' 
                        : 'System idle. Select a landmark and visual style above, then trigger a command to begin.'}
                    </p>
                  )}
                </div>

              </div>

              {/* Right Panel: Geodesic Vector Simulator Canvas (SVG Display) */}
              <div className={`xl:w-[420px] rounded-2xl border p-4 flex flex-col justify-between relative overflow-hidden transition-all duration-1000 min-h-[280px]
                ${styleMode === 'artistic'
                  ? 'bg-zinc-900/5 border-emerald-950/10 text-zinc-900'
                  : 'bg-[#0e1422] border-slate-800 text-slate-200'
                }`}
              >
                {/* Simulated Grid Scanning Line */}
                {(activeLightMode === 'cyber' || isLightshowRunning) && (
                  <div className="absolute left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_8px_rgba(34,211,238,0.8)] animate-scan z-10 pointer-events-none" />
                )}

                {/* Spectacular Lightshow Ambient Sweeping Beams */}
                {isLightshowRunning && (
                  <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40 mix-blend-screen z-0">
                    <svg viewBox="0 0 400 300" className="w-full h-full">
                      <defs>
                        <linearGradient id="beamGrad1" x1="0" y1="1" x2="0" y2="0">
                          <stop offset="0%" stopColor="transparent" />
                          <stop offset="100%" stopColor={
                            activeLightMode === 'ink' ? 'rgba(39,39,42,0.3)' :
                            activeLightMode === 'cyber' ? 'rgba(236,72,153,0.45)' :
                            activeLightMode === 'golden' ? 'rgba(245,158,11,0.5)' : 'rgba(16,185,129,0.45)'
                          } />
                        </linearGradient>
                        <linearGradient id="beamGrad2" x1="0" y1="1" x2="0" y2="0">
                          <stop offset="0%" stopColor="transparent" />
                          <stop offset="100%" stopColor={
                            activeLightMode === 'ink' ? 'rgba(39,39,42,0.2)' :
                            activeLightMode === 'cyber' ? 'rgba(34,211,238,0.45)' :
                            activeLightMode === 'golden' ? 'rgba(251,191,36,0.4)' : 'rgba(52,211,153,0.45)'
                          } />
                        </linearGradient>
                      </defs>
                      <path d="M 200,300 L 40,0 L 140,0 Z" fill="url(#beamGrad1)" className="animate-beam-1" />
                      <path d="M 200,300 L 360,0 L 260,0 Z" fill="url(#beamGrad2)" className="animate-beam-2" />
                    </svg>
                    {/* Tiny magical sparkles */}
                    <div className="absolute bottom-4 left-1/4 w-1 h-1 rounded-full bg-white animate-float-1" />
                    <div className="absolute bottom-8 left-1/2 w-1.5 h-1.5 rounded-full bg-cyan-200 animate-float-2" />
                    <div className="absolute bottom-2 right-1/4 w-1 h-1 rounded-full bg-pink-200 animate-float-3" />
                  </div>
                )}

                {/* Spectacular Eco Optimizing Active Background Glow & Particles */}
                {isEcoOptimizing && (
                  <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-emerald-500/10 dark:bg-emerald-400/15 blur-3xl animate-eco-breathe" />
                    {/* Floating green leaves / micro-grid particles */}
                    <div className="absolute bottom-4 left-1/4 w-2 h-2 rounded-full bg-emerald-400/60 animate-float-1" />
                    <div className="absolute bottom-8 left-1/2 w-3 h-3 rounded-full bg-teal-400/50 animate-float-2" />
                    <div className="absolute bottom-2 right-1/4 w-1.5 h-1.5 rounded-full bg-green-400/60 animate-float-3" />
                  </div>
                )}

                {/* Slogan Description Card Overlay */}
                <div className="absolute top-3 left-3 right-3 bg-white/40 dark:bg-slate-900/60 backdrop-blur-md rounded-xl p-2 px-3 border border-white/20 dark:border-white/10 flex justify-between items-center z-10 shadow-sm">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-mono tracking-wider opacity-60 uppercase">
                      {styleMode === 'artistic' ? '地标诗意联觉' : 'LANDMARK SYNTHESIS SYSTEM'}
                    </span>
                    <span className={`text-xs font-bold ${styleMode === 'artistic' ? 'font-serif-sc text-zinc-800' : 'text-cyan-300'}`}>
                      {activeLandmark === 'conference' ? '杭州国际会议中心' :
                       activeLandmark === 'theater' ? '杭州大剧院' :
                       activeLandmark === 'g20' ? 'G20峰会主会场' : '奥体中心「大莲花」'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    {isLightshowRunning && <span className="text-[9px] text-pink-500 font-bold animate-pulse">LIGHTSHOW ON</span>}
                    {isEcoOptimizing && <span className="text-[9px] text-emerald-500 font-bold animate-pulse">ECO OPTIMAL</span>}
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-mono text-[9px] opacity-70">LIVE_TELEMETRY</span>
                  </div>
                </div>

                {/* Vector SVG Landmark Drawing Canvas */}
                <div className="flex-1 flex items-center justify-center py-6 relative z-5 overflow-hidden" style={{ perspective: '800px' }}>
                  
                  {/* Background Water ripple or circuit trace */}
                  {styleMode === 'geometric' && (
                    <div className="absolute inset-0 border border-dashed border-cyan-500/5 rounded-full m-4 pointer-events-none animate-spin-slow" />
                  )}

                  <motion.div 
                    className="w-full flex items-center justify-center relative"
                    animate={{
                      rotateX: viewPerspective === 'isometric' ? 45 : viewPerspective === 'top' ? 65 : 0,
                      rotateY: viewPerspective === 'isometric' ? 5 : 0,
                      rotateZ: viewPerspective === 'isometric' ? -25 : 0,
                      scale: viewPerspective === 'isometric' ? 0.95 : viewPerspective === 'top' ? 0.85 : 1,
                      y: viewPerspective === 'top' ? -10 : 0,
                    }}
                    transition={{ type: "spring", stiffness: 85, damping: 18 }}
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    <AnimatePresence mode="wait">
                    {activeLandmark === 'conference' && (
                      <motion.div
                        key="conference"
                        initial={{ opacity: 0, scale: 0.85, rotate: -3 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        exit={{ opacity: 0, scale: 0.85, rotate: 3 }}
                        transition={{ type: "spring", stiffness: 100, damping: 15 }}
                        className="w-full flex items-center justify-center relative"
                      >
                        <svg viewBox="0 0 400 300" className="w-full max-w-[280px] h-auto overflow-visible">
                          {/* Sun / Sphere layout with glowing lines based on light mode */}
                          <defs>
                            <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
                              <stop offset="0%" stopColor={
                                activeLightMode === 'ink' ? '#52525b' :
                                activeLightMode === 'cyber' ? '#ec4899' :
                                activeLightMode === 'golden' ? '#fbbf24' : '#10b981'
                              } stopOpacity="0.25" />
                              <stop offset="100%" stopColor="#000" stopOpacity="0" />
                            </radialGradient>
                          </defs>
                          <motion.circle 
                            cx="200" 
                            cy="150" 
                            r="75" 
                            fill="url(#sunGlow)" 
                            className="animate-pulse"
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                          />
                          
                          {/* Grid structure (sun lines) */}
                          <motion.circle 
                            cx="200" 
                            cy="150" 
                            r="70" 
                            animate={{
                              stroke: isEcoOptimizing ? '#34d399' :
                                      activeLightMode === 'ink' ? 'rgba(39,39,42,0.4)' :
                                      activeLightMode === 'cyber' ? 'rgba(236,72,153,0.6)' :
                                      activeLightMode === 'golden' ? 'rgba(245,158,11,0.7)' : 'rgba(16,185,129,0.6)'
                            }}
                            className={isEcoOptimizing ? "animate-dash-flow" : ""}
                            transition={{ duration: 0.8, ease: "easeInOut" }}
                            strokeWidth={isEcoOptimizing ? "1.5" : "1"} 
                            fill="none" 
                            strokeDasharray={isEcoOptimizing ? "8,4" : "3,3"} 
                          />
                          
                          <motion.circle 
                            cx="200" 
                            cy="150" 
                            r="50" 
                            animate={{
                              stroke: isEcoOptimizing ? '#059669' :
                                      activeLightMode === 'ink' ? 'rgba(39,39,42,0.6)' :
                                      activeLightMode === 'cyber' ? 'rgba(236,72,153,0.8)' :
                                      activeLightMode === 'golden' ? '#fbbf24' : '#34d399'
                            }}
                            className={isEcoOptimizing ? "animate-spin-slow" : ""}
                            transition={{ duration: 0.8, ease: "easeInOut" }}
                            strokeWidth="1.5" 
                            fill="none" 
                          />

                          {/* Longitudinal grid lines */}
                          {[-50, -30, -10, 10, 30, 50].map((offset, idx) => (
                            <motion.ellipse 
                              key={idx} 
                              cx="200" 
                              cy="150" 
                              rx="70" 
                              ry={Math.abs(offset) * 1.2} 
                              animate={{
                                stroke: isEcoOptimizing ? 'rgba(16,185,129,0.5)' :
                                        activeLightMode === 'ink' ? 'rgba(0,0,0,0.2)' :
                                        activeLightMode === 'cyber' ? 'rgba(244,114,182,0.3)' :
                                        activeLightMode === 'golden' ? 'rgba(251,191,36,0.3)' : 'rgba(52,211,153,0.3)'
                              }}
                              className={isEcoOptimizing ? "animate-dash-flow" : ""}
                              transition={{ duration: 0.8, ease: "easeInOut" }}
                              strokeWidth="0.5" 
                              fill="none" 
                              transform={`rotate(${offset}, 200, 150)`} 
                            />
                          ))}

                          {/* Spectacular Lightshow Ripple rings */}
                          {isLightshowRunning && (
                            <>
                              <circle cx="200" cy="150" r="10" stroke={
                                activeLightMode === 'ink' ? 'rgba(0,0,0,0.4)' :
                                activeLightMode === 'cyber' ? '#ec4899' :
                                activeLightMode === 'golden' ? '#fbbf24' : '#10b981'
                              } fill="none" className="animate-wave-ripple" style={{ animationDelay: '0s' }} />
                              <circle cx="200" cy="150" r="10" stroke={
                                activeLightMode === 'ink' ? 'rgba(0,0,0,0.2)' :
                                activeLightMode === 'cyber' ? '#22d3ee' :
                                activeLightMode === 'golden' ? '#f59e0b' : '#34d399'
                              } fill="none" className="animate-wave-ripple" style={{ animationDelay: '1.5s' }} />
                            </>
                          )}

                          {/* Nodes */}
                          {[
                            {x: 200, y: 80}, {x: 200, y: 220}, {x: 130, y: 150}, {x: 270, y: 150},
                            {x: 150, y: 100}, {x: 250, y: 100}, {x: 150, y: 200}, {x: 250, y: 200}
                          ].map((node, nidx) => (
                            <motion.circle 
                              key={nidx} 
                              cx={node.x} 
                              cy={node.y} 
                              r={activeLightMode === 'cyber' ? "3" : "2"} 
                              animate={{
                                fill: isEcoOptimizing ? '#10b981' :
                                      activeLightMode === 'ink' ? '#18181b' :
                                      activeLightMode === 'cyber' ? '#ec4899' :
                                      activeLightMode === 'golden' ? '#fbbf24' : '#10b981'
                              }}
                              transition={{ duration: 0.8, ease: "easeInOut" }}
                              className="animate-ping" 
                              style={{ animationDelay: `${nidx * 300}ms`, animationDuration: '2s' }} 
                            />
                          ))}
                          
                          {/* Solid central core lines representing high-tech integration */}
                          <motion.circle 
                            cx="200" 
                            cy="150" 
                            r="3" 
                            animate={{
                              fill: activeLightMode === 'ink' ? '#000' :
                                    activeLightMode === 'cyber' ? '#06b6d4' :
                                    activeLightMode === 'golden' ? '#f59e0b' : '#34d399'
                            }}
                            transition={{ duration: 0.8, ease: "easeInOut" }}
                          />
                        </svg>
                      </motion.div>
                    )}

                    {activeLandmark === 'theater' && (
                      <motion.div
                        key="theater"
                        initial={{ opacity: 0, scale: 0.85, rotate: -3 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        exit={{ opacity: 0, scale: 0.85, rotate: 3 }}
                        transition={{ type: "spring", stiffness: 100, damping: 15 }}
                        className="w-full flex items-center justify-center relative"
                      >
                        <svg viewBox="0 0 400 300" className="w-full max-w-[280px] h-auto overflow-visible">
                          <defs>
                            <linearGradient id="crescentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor={
                                activeLightMode === 'ink' ? '#27272a' :
                                activeLightMode === 'cyber' ? '#d946ef' :
                                activeLightMode === 'golden' ? '#f59e0b' : '#059669'
                              } />
                              <stop offset="100%" stopColor={
                                activeLightMode === 'ink' ? '#71717a' :
                                activeLightMode === 'cyber' ? '#4f46e5' :
                                activeLightMode === 'golden' ? '#fef08a' : '#34d399'
                              } stopOpacity="0.4" />
                            </linearGradient>
                          </defs>

                          {/* Crescent curved grand shape */}
                          <motion.path 
                            d="M 120,180 Q 200,90 280,180" 
                            stroke="url(#crescentGrad)" 
                            strokeWidth="8" 
                            fill="none" 
                            strokeLinecap="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 1.2, ease: "easeInOut" }}
                          />
                          <motion.path 
                            d="M 115,190 Q 200,105 285,190" 
                            initial={{ pathLength: 0 }}
                            animate={{
                              pathLength: 1,
                              stroke: activeLightMode === 'ink' ? '#18181b' :
                                      activeLightMode === 'cyber' ? '#22d3ee' :
                                      activeLightMode === 'golden' ? '#fbbf24' : '#10b981'
                            }}
                            transition={{ duration: 1.2, delay: 0.1, ease: "easeInOut" }}
                            strokeWidth="1.5" 
                            fill="none" 
                            strokeLinecap="round" 
                          />

                          {/* Glass panel struts vertical ribs */}
                          {[135, 150, 165, 180, 195, 210, 225, 240, 255, 270].map((xCoord, idx) => {
                            const t = (xCoord - 120) / 160;
                            const bx = xCoord;
                            const by = 180 + Math.sin(t * Math.PI) * 10;
                            const tx = xCoord;
                            const ty = 180 - Math.sin(t * Math.PI) * 45;
                            return (
                              <motion.line 
                                key={idx} 
                                x1={bx} 
                                y1={by} 
                                x2={tx} 
                                y2={ty} 
                                initial={{ scaleY: 0 }}
                                animate={{
                                  scaleY: 1,
                                  stroke: activeLightMode === 'ink' ? 'rgba(39,39,42,0.3)' :
                                          activeLightMode === 'cyber' ? 'rgba(34,211,238,0.4)' :
                                          activeLightMode === 'golden' ? 'rgba(251,191,36,0.4)' : 'rgba(110,231,183,0.4)'
                                }}
                                transition={{ duration: 0.6, delay: 0.2 + idx * 0.05 }}
                                style={{ transformOrigin: `${bx}px ${by}px` }}
                                strokeWidth="1" 
                              />
                            );
                          })}

                          {/* Water reflection lines (Qiantang River) */}
                          {[-5, 5, 15, 25].map((yOffset, idx) => (
                            <motion.path 
                              key={idx} 
                              d={`M 100,${195 + yOffset} Q 200,${192 + yOffset + (idx % 2 * 3)} 300,${195 + yOffset}`} 
                              animate={{
                                stroke: isEcoOptimizing ? 'rgba(16,185,129,0.4)' :
                                        activeLightMode === 'ink' ? 'rgba(0,0,0,0.15)' :
                                        activeLightMode === 'cyber' ? 'rgba(99,102,241,0.3)' :
                                        activeLightMode === 'golden' ? 'rgba(251,191,36,0.3)' : 'rgba(52,211,153,0.3)'
                              }}
                              className={isLightshowRunning || isEcoOptimizing ? "animate-dash-flow" : ""}
                              transition={{ duration: 0.8, ease: "easeInOut" }}
                              strokeWidth={isLightshowRunning || isEcoOptimizing ? "1.5" : "1"} 
                              fill="none" 
                              strokeDasharray={(isLightshowRunning || isEcoOptimizing) ? "10,5" : (idx % 2 === 0 ? "5,5" : "none")} 
                            />
                          ))}

                          {/* Spectacular Lightshow Ripple rings */}
                          {isLightshowRunning && (
                            <>
                              <circle cx="200" cy="180" r="10" stroke="#f472b6" fill="none" className="animate-wave-ripple" style={{ animationDelay: '0s' }} />
                              <circle cx="200" cy="180" r="10" stroke="#22d3ee" fill="none" className="animate-wave-ripple" style={{ animationDelay: '1.5s' }} />
                            </>
                          )}

                          {/* Pulse soundwave emitting arc */}
                          <path d="M 140,205 Q 200,160 260,205" stroke={
                            activeLightMode === 'cyber' ? '#ec4899' :
                            activeLightMode === 'golden' ? '#fbbf24' :
                            activeLightMode === 'eco' ? '#10b981' : 'rgba(0,0,0,0.4)'
                          } strokeWidth="2" fill="none" className="animate-ping" style={{ transformOrigin: '200px 180px', animationDuration: '3s' }} />
                        </svg>
                      </motion.div>
                    )}

                    {activeLandmark === 'g20' && (
                      <motion.div
                        key="g20"
                        initial={{ opacity: 0, scale: 0.85, rotate: -3 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        exit={{ opacity: 0, scale: 0.85, rotate: 3 }}
                        transition={{ type: "spring", stiffness: 100, damping: 15 }}
                        className="w-full flex items-center justify-center relative"
                      >
                        <svg viewBox="0 0 400 300" className="w-full max-w-[280px] h-auto overflow-visible">
                          {/* Oriental Pagoda Grand Eaves combined with stream lines */}
                          <defs>
                            <linearGradient id="g20RoofGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stopColor={
                                activeLightMode === 'ink' ? '#18181b' :
                                activeLightMode === 'cyber' ? '#6366f1' :
                                activeLightMode === 'golden' ? '#d97706' : '#047857'
                              } />
                              <stop offset="100%" stopColor="transparent" stopOpacity="0.1" />
                            </linearGradient>
                          </defs>

                          {/* Top Eave Curve (江南重楼飞檐) */}
                          <motion.path 
                            d="M 110,120 Q 200,105 290,120 Q 250,110 200,110 Q 150,110 110,120 Z" 
                            fill="url(#g20RoofGrad)"
                            initial={{ scaleY: 0, opacity: 0 }}
                            animate={{ scaleY: 1, opacity: 1 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            style={{ transformOrigin: '200px 110px' }}
                          />
                          <motion.path 
                            d="M 105,122 Q 200,105 295,122" 
                            initial={{ pathLength: 0 }}
                            animate={{
                              pathLength: 1,
                              stroke: activeLightMode === 'ink' ? '#000' :
                                      activeLightMode === 'cyber' ? '#818cf8' :
                                      activeLightMode === 'golden' ? '#fbbf24' : '#34d399'
                            }}
                            transition={{ duration: 1.2, ease: "easeInOut" }}
                            strokeWidth="2.5" 
                            fill="none" 
                            strokeLinecap="round" 
                          />

                          {/* Secondary mid-level grand eave */}
                          <motion.path 
                            d="M 90,150 Q 200,135 310,150 Q 260,140 200,140 Q 140,140 90,150 Z" 
                            fill="url(#g20RoofGrad)"
                            initial={{ scaleY: 0, opacity: 0 }}
                            animate={{ scaleY: 1, opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
                            style={{ transformOrigin: '200px 140px' }}
                          />
                          <motion.path 
                            d="M 85,152 Q 200,135 315,152" 
                            initial={{ pathLength: 0 }}
                            animate={{
                              pathLength: 1,
                              stroke: activeLightMode === 'ink' ? '#000' :
                                      activeLightMode === 'cyber' ? '#a5b4fc' :
                                      activeLightMode === 'golden' ? '#fbbf24' : '#10b981'
                            }}
                            transition={{ duration: 1.2, delay: 0.15, ease: "easeInOut" }}
                            strokeWidth="2" 
                            fill="none" 
                            strokeLinecap="round" 
                          />

                          {/* Main supporting structure columns with circuit boards elements */}
                          <motion.rect 
                            x="130" 
                            y="152" 
                            width="140" 
                            height="40" 
                            fill="none" 
                            initial={{ opacity: 0 }}
                            animate={{
                              opacity: 1,
                              stroke: activeLightMode === 'ink' ? 'rgba(0,0,0,0.15)' :
                                      activeLightMode === 'cyber' ? 'rgba(99,102,241,0.3)' :
                                      activeLightMode === 'golden' ? 'rgba(245,158,11,0.2)' : 'rgba(16,185,129,0.2)'
                            }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            strokeWidth="1" 
                          />

                          {/* Vertical pillar lines */}
                          {[145, 170, 200, 230, 255].map((xCoord, idx) => (
                            <motion.line 
                              key={idx} 
                              x1={xCoord} 
                              y1="152" 
                              x2={xCoord} 
                              y2="192" 
                              initial={{ scaleY: 0 }}
                              animate={{
                                scaleY: 1,
                                stroke: activeLightMode === 'ink' ? '#52525b' :
                                        activeLightMode === 'cyber' ? '#818cf8' :
                                        activeLightMode === 'golden' ? '#fbbf24' : '#34d399'
                              }}
                              transition={{ duration: 0.6, delay: 0.3 + idx * 0.05 }}
                              style={{ transformOrigin: `${xCoord}px 152px` }}
                              strokeWidth={idx === 2 ? "2" : "1"} 
                            />
                          ))}

                          {/* Flying global data connection rays */}
                          {(activeLightMode !== 'ink' || isLightshowRunning || isEcoOptimizing) && (
                            <>
                              <motion.line 
                                x1="200" 
                                y1="110" 
                                x2="160" 
                                y2="70" 
                                stroke={isEcoOptimizing ? '#10b981' : activeLightMode === 'cyber' ? '#d946ef' : activeLightMode === 'golden' ? '#f59e0b' : '#10b981'} 
                                strokeWidth="1" 
                                strokeDasharray={isLightshowRunning || isEcoOptimizing ? "8,4" : "3,3"}
                                className={isLightshowRunning || isEcoOptimizing ? "animate-dash-flow" : ""}
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 0.8, delay: 0.5 }}
                              />
                              <circle cx="160" cy="70" r="3" fill={isEcoOptimizing ? '#10b981' : activeLightMode === 'cyber' ? '#d946ef' : activeLightMode === 'golden' ? '#f59e0b' : '#10b981'} className={isLightshowRunning || isEcoOptimizing ? "animate-ping" : ""} />
                              <motion.line 
                                x1="200" 
                                y1="110" 
                                x2="240" 
                                y2="70" 
                                stroke={isEcoOptimizing ? '#34d399' : activeLightMode === 'cyber' ? '#06b6d4' : activeLightMode === 'golden' ? '#fbbf24' : '#34d399'} 
                                strokeWidth="1" 
                                strokeDasharray={isLightshowRunning || isEcoOptimizing ? "8,4" : "3,3"}
                                className={isLightshowRunning || isEcoOptimizing ? "animate-dash-flow" : ""}
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 0.8, delay: 0.5 }}
                              />
                              <circle cx="240" cy="70" r="3" fill={isEcoOptimizing ? '#34d399' : activeLightMode === 'cyber' ? '#06b6d4' : activeLightMode === 'golden' ? '#fbbf24' : '#34d399'} className={isLightshowRunning || isEcoOptimizing ? "animate-ping" : ""} />
                            </>
                          )}

                          {/* Spectacular Lightshow Ripple rings */}
                          {isLightshowRunning && (
                            <>
                              <circle cx="200" cy="110" r="10" stroke="#f59e0b" fill="none" className="animate-wave-ripple" style={{ animationDelay: '0s' }} />
                              <circle cx="200" cy="110" r="10" stroke="#10b981" fill="none" className="animate-wave-ripple" style={{ animationDelay: '1.5s' }} />
                            </>
                          )}
                        </svg>
                      </motion.div>
                    )}

                    {activeLandmark === 'lotus' && (
                      <motion.div
                        key="lotus"
                        initial={{ opacity: 0, scale: 0.85, rotate: -3 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        exit={{ opacity: 0, scale: 0.85, rotate: 3 }}
                        transition={{ type: "spring", stiffness: 100, damping: 15 }}
                        className="w-full flex items-center justify-center relative"
                      >
                        <svg viewBox="0 0 400 300" className="w-full max-w-[280px] h-auto overflow-visible">
                          <defs>
                            <radialGradient id="lotusCenterGlow" cx="50%" cy="50%" r="50%">
                              <stop offset="0%" stopColor={
                                activeLightMode === 'ink' ? '#3f3f46' :
                                activeLightMode === 'cyber' ? '#db2777' :
                                activeLightMode === 'golden' ? '#fbbf24' : '#10b981'
                              } stopOpacity="0.4" />
                              <stop offset="100%" stopColor="#000" stopOpacity="0" />
                            </radialGradient>
                          </defs>

                          {/* Center arena ring */}
                          <circle cx="200" cy="150" r="105" fill="url(#lotusCenterGlow)" />
                          <motion.ellipse 
                            cx="200" 
                            cy="150" 
                            rx="45" 
                            ry="25" 
                            animate={{
                              stroke: activeLightMode === 'ink' ? 'rgba(0,0,0,0.5)' :
                                      activeLightMode === 'cyber' ? '#a5b4fc' :
                                      activeLightMode === 'golden' ? '#fde047' : '#6ee7b7'
                            }}
                            transition={{ duration: 0.8, ease: "easeInOut" }}
                            strokeWidth="1.5" 
                            fill="none" 
                          />

                          {/* Petal structures arranged radially */}
                          <g className={isEcoOptimizing ? "animate-spin-slow origin-[200px_150px]" : (isLightshowRunning ? "animate-spin-reverse origin-[200px_150px]" : "")}>
                            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, idx) => {
                              const rad = (angle * Math.PI) / 180;
                              const petalLength = 65;
                              const px = 200 + Math.cos(rad) * petalLength;
                              const py = 150 + Math.sin(rad) * petalLength;

                              return (
                                <g key={idx} transform={`translate(${px}, ${py}) rotate(${angle}, 0, 0)`}>
                                  {/* Stylized geometric lotus petal */}
                                  <motion.path 
                                    d="M -10,-12 C -2, -28 10, -28 15, -12 C 18, 5 8, 12 0, 0" 
                                    initial={{ scale: 0 }}
                                    animate={{
                                      scale: 1,
                                      fill: isEcoOptimizing ? 'rgba(16,185,129,0.25)' :
                                            activeLightMode === 'ink' ? 'rgba(39,39,42,0.15)' :
                                            activeLightMode === 'cyber' ? 'rgba(236,72,153,0.2)' :
                                            activeLightMode === 'golden' ? 'rgba(245,158,11,0.2)' : 'rgba(16,185,129,0.2)',
                                      stroke: isEcoOptimizing ? '#10b981' :
                                              activeLightMode === 'ink' ? 'rgba(0,0,0,0.4)' :
                                              activeLightMode === 'cyber' ? '#f472b6' :
                                              activeLightMode === 'golden' ? '#fbbf24' : '#34d399'
                                    }}
                                    transition={{ type: "spring", stiffness: 100, damping: 10, delay: idx * 0.03 }}
                                    strokeWidth="1" 
                                    className="hover:scale-110 transition-transform duration-300" 
                                  />
                                </g>
                              );
                            })}
                          </g>

                          {/* Spectacular Lightshow Ripple rings */}
                          {isLightshowRunning && (
                            <>
                              <circle cx="200" cy="150" r="10" stroke="#f472b6" fill="none" className="animate-wave-ripple" style={{ animationDelay: '0s' }} />
                              <circle cx="200" cy="150" r="10" stroke="#10b981" fill="none" className="animate-wave-ripple" style={{ animationDelay: '1.5s' }} />
                            </>
                          )}

                          {/* Center sub-ring with smart eco dots */}
                          <circle cx="200" cy="150" r="5" fill={
                            activeLightMode === 'ink' ? '#18181b' :
                            activeLightMode === 'cyber' ? '#f472b6' :
                            activeLightMode === 'golden' ? '#fbbf24' : '#10b981'
                          } className="animate-ping" style={{ animationDuration: '1.5s' }} />
                        </svg>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  </motion.div>

                </div>

                {/* Slogan and details card displaying current landmark description */}
                <div className={`mt-3 p-3 rounded-xl border flex flex-col justify-between transition-all duration-1000
                  ${styleMode === 'artistic'
                    ? 'bg-zinc-900/5 border-emerald-950/5'
                    : 'bg-[#151d2f] border-slate-800/80'
                  }`}
                >
                  <p className="text-xs italic leading-relaxed opacity-95 text-center">
                    「 {activeLandmark === 'conference' ? '数智金星，映照未来视界 —— 科技脉搏，点亮城市未来' :
                       activeLandmark === 'theater' ? '银色月轮，奏响城市交响 —— 琴声悠扬，汇聚时代潮音' :
                       activeLandmark === 'g20' ? '开放之门，纵览全球峰会 —— 智连世界，激荡国际浪潮' :
                       '生态莲花，绽放绿色能效 —— 零碳律动，铸就亚运传奇'} 」
                  </p>
                  
                  <div className="flex items-center justify-between border-t border-dashed border-zinc-300 dark:border-slate-800/60 mt-2.5 pt-2 text-[10px] font-mono">
                    <span className="opacity-60">
                      {activeLandmark === 'conference' ? 'SOLAR_MICRO_GRID: 98.4%' :
                       activeLandmark === 'theater' ? 'AI_ACOUSTICS: 120dB' :
                       activeLandmark === 'g20' ? 'IOT_CHANNELS: 10k+' : 'ZERO_CARBON_INDEX: 0.0'}
                    </span>
                    <span className={styleMode === 'artistic' ? 'text-emerald-800 font-bold' : 'text-cyan-400 font-bold'}>
                      {activeLightMode === 'ink' ? 'WATER_INK_WASH' :
                       activeLightMode === 'cyber' ? 'CYBER_FUTURE' :
                       activeLightMode === 'golden' ? 'GOLDEN_GLORY' : 'GREEN_ENERGY_ECO'}
                    </span>
                  </div>
                </div>

              </div>

            </div>
          </div>
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
