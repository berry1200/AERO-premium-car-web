// Web Audio API engine sound synthesizer for supercars
let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let isAudioRunning = false;

// Engine state
let osc1: OscillatorNode | null = null;
let osc2: OscillatorNode | null = null;
let osc3: OscillatorNode | null = null;
let noiseNode: AudioBufferSourceNode | null = null;
let filterNode: BiquadFilterNode | null = null;
let engineGain: GainNode | null = null;

export function initAudio() {
  if (audioCtx) return;
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
    masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.18, audioCtx.currentTime);
    masterGain.connect(audioCtx.destination);
  } catch (err) {
    console.warn('AudioContext not supported or blocked', err);
  }
}

export function startEngine(engineType: string = 'V8') {
  if (!audioCtx) initAudio();
  if (!audioCtx || isAudioRunning) return;
  
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  const now = audioCtx.currentTime;
  
  // Base frequency according to cylinder count
  let baseFreq = 55; // V8
  if (engineType.includes('FLAT-6')) baseFreq = 50;
  if (engineType.includes('V10')) baseFreq = 65;
  if (engineType.includes('V12')) baseFreq = 75;

  // Master engine gain
  engineGain = audioCtx.createGain();
  engineGain.gain.setValueAtTime(0.001, now);
  engineGain.gain.exponentialRampToValueAtTime(0.14, now + 0.3);

  // Filter for exhaust muffler / manifold resonance
  filterNode = audioCtx.createBiquadFilter();
  filterNode.type = 'lowpass';
  filterNode.frequency.setValueAtTime(320, now);
  filterNode.Q.setValueAtTime(3.5, now);

  // 3 Harmonics for rich cylinder exhaust pulses
  osc1 = audioCtx.createOscillator();
  osc1.type = 'sawtooth';
  osc1.frequency.setValueAtTime(baseFreq, now);

  osc2 = audioCtx.createOscillator();
  osc2.type = 'triangle';
  osc2.frequency.setValueAtTime(baseFreq * 1.5, now);

  osc3 = audioCtx.createOscillator();
  osc3.type = 'sawtooth';
  osc3.frequency.setValueAtTime(baseFreq * 2.0, now);

  // Connect chain
  osc1.connect(filterNode);
  osc2.connect(filterNode);
  osc3.connect(filterNode);
  filterNode.connect(engineGain);

  if (masterGain) {
    engineGain.connect(masterGain);
  }

  osc1.start();
  osc2.start();
  osc3.start();

  isAudioRunning = true;
}

export function revEngine(rpmFactor: number = 0.5) {
  // rpmFactor: 0.0 (idle) to 1.0 (redline)
  if (!audioCtx || !isAudioRunning || !osc1 || !osc2 || !osc3 || !filterNode) return;
  const now = audioCtx.currentTime;
  
  const base = 48 + rpmFactor * 130;
  osc1.frequency.cancelScheduledValues(now);
  osc2.frequency.cancelScheduledValues(now);
  osc3.frequency.cancelScheduledValues(now);
  filterNode.frequency.cancelScheduledValues(now);

  osc1.frequency.linearRampToValueAtTime(base, now + 0.1);
  osc2.frequency.linearRampToValueAtTime(base * 1.5, now + 0.1);
  osc3.frequency.linearRampToValueAtTime(base * 2.0, now + 0.1);

  // Open up the exhaust valve filter as RPM rises
  const filterCutoff = 300 + rpmFactor * 1600;
  filterNode.frequency.linearRampToValueAtTime(filterCutoff, now + 0.1);
}

export function stopEngine() {
  if (!audioCtx || !isAudioRunning) return;
  const now = audioCtx.currentTime;
  if (engineGain) {
    engineGain.gain.setValueAtTime(engineGain.gain.value, now);
    engineGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
  }
  setTimeout(() => {
    try {
      osc1?.stop();
      osc2?.stop();
      osc3?.stop();
      osc1?.disconnect();
      osc2?.disconnect();
      osc3?.disconnect();
    } catch {
      // Ignored
    }
    isAudioRunning = false;
  }, 350);
}

export function playShiftGear() {
  if (!audioCtx) return;
  const now = audioCtx.currentTime;
  const clickOsc = audioCtx.createOscillator();
  const clickGain = audioCtx.createGain();

  clickOsc.type = 'sine';
  clickOsc.frequency.setValueAtTime(1400, now);
  clickOsc.frequency.exponentialRampToValueAtTime(300, now + 0.05);

  clickGain.gain.setValueAtTime(0.2, now);
  clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

  clickOsc.connect(clickGain);
  clickGain.connect(audioCtx.destination);

  clickOsc.start();
  clickOsc.stop(now + 0.06);
}
