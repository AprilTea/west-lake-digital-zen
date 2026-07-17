// Classical Pentatonic Melodies (五音曲谱) definition and helpers

export interface Note {
  char: string;
  freq: number;
  delay: number;
}

export interface MusicalScore {
  name: string;
  spot: string;
  mode: string;
  description: string;
  notes: Note[];
}

export interface RhythmicScore extends MusicalScore {
  totalDuration: number;
}

export const CLASSICAL_SCORES: MusicalScore[] = [
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

// Helper to get beautiful, flowing traditional musical rhythms (beat durations) for each note
export const getNoteDurationInBeats = (scoreName: string, noteIdx: number): number => {
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

export const getMusicalScoreWithRhythms = (score: MusicalScore): RhythmicScore => {
  if (!score) return score as any;
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

  const notesWithDelays = score.notes.map((note, idx) => {
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
