// Web Audio API Synthesizer for West Lake Guqin (数智古琴/古雅和鸣)

let audioCtx: AudioContext | null = null;

export function getAudioContext(): AudioContext | null {
  if (!audioCtx) {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      audioCtx = new AudioCtx();
    } catch (e) {
      console.warn("Web Audio is not supported by your browser.", e);
    }
  }
  return audioCtx;
}

export function playPluckSound(ctx: AudioContext, freq: number, styleMode: 'artistic' | 'geometric', isMuted: boolean) {
  if (isMuted) return;
  if (!ctx) return;
  if (ctx.state === 'suspended') {
    ctx.resume();
  }
  try {
    if (styleMode === 'artistic') {
      const now = ctx.currentTime;
      
      // Main note gain node with decay envelope
      const noteGain = ctx.createGain();
      noteGain.gain.setValueAtTime(0, now);
      noteGain.gain.linearRampToValueAtTime(0.42, now + 0.012);
      noteGain.gain.exponentialRampToValueAtTime(0.12, now + 0.45);
      noteGain.gain.exponentialRampToValueAtTime(0.001, now + 2.6);

      // Guqin slides: pitch glide/bend into the target note ("绰" or "注")
      const randSlide = Math.random();
      let startFreq = freq;
      const slideTime = 0.16;
      if (randSlide < 0.25) {
        startFreq = freq * 0.94; // Slide up from half step below
      } else if (randSlide < 0.35) {
        startFreq = freq * 1.04; // Slide down from above
      }

      // We combine triangle and sine waves at different harmonics for woody resonance:
      const osc1 = ctx.createOscillator();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(startFreq, now);
      osc1.frequency.exponentialRampToValueAtTime(freq, now + slideTime);

      const osc2 = ctx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(startFreq * 2, now);
      osc2.frequency.exponentialRampToValueAtTime(freq * 2, now + slideTime);

      const osc3 = ctx.createOscillator();
      osc3.type = 'sine';
      osc3.frequency.setValueAtTime(startFreq * 3, now);
      osc3.frequency.exponentialRampToValueAtTime(freq * 3, now + slideTime);

      // Low-frequency string/wooden thump ("散音" finger strike transient)
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
}
