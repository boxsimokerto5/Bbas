/**
 * Web Audio API procedural sound synthesizer for Block Blast.
 * Works 100% offline with zero external audio assets.
 */

class SoundSystem {
  private ctx: AudioContext | null = null;
  private sfxMuted: boolean = false;
  private bgmMuted: boolean = false;
  private bgmPlaying: boolean = false;
  private bgmTimer: ReturnType<typeof setInterval> | null = null;
  private bgmCurrentStep: number = 0;
  private nextStepTime: number = 0;
  private bgmMasterGain: GainNode | null = null;

  constructor() {
    // Read saved mute preferences
    if (typeof window !== 'undefined') {
      const savedSfx = localStorage.getItem('blockblast_sfx_muted') ?? localStorage.getItem('blockblast_muted');
      if (savedSfx !== null) {
        this.sfxMuted = savedSfx === 'true';
      }
      const savedBgm = localStorage.getItem('blockblast_bgm_muted');
      if (savedBgm !== null) {
        this.bgmMuted = savedBgm === 'true';
      }
    }
  }

  // Compatibility getter for existing methods
  private get muted(): boolean {
    return this.sfxMuted;
  }

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public isMuted(): boolean {
    return this.sfxMuted;
  }

  public toggleMute(): boolean {
    return this.toggleSfxMute();
  }

  public isSfxMuted(): boolean {
    return this.sfxMuted;
  }

  public toggleSfxMute(): boolean {
    this.sfxMuted = !this.sfxMuted;
    if (typeof window !== 'undefined') {
      localStorage.setItem('blockblast_sfx_muted', String(this.sfxMuted));
      localStorage.setItem('blockblast_muted', String(this.sfxMuted));
    }
    return this.sfxMuted;
  }

  public isBgmMuted(): boolean {
    return this.bgmMuted;
  }

  public toggleBgmMute(): boolean {
    this.bgmMuted = !this.bgmMuted;
    if (typeof window !== 'undefined') {
      localStorage.setItem('blockblast_bgm_muted', String(this.bgmMuted));
    }
    if (this.bgmMuted) {
      this.pauseBgm();
    } else {
      this.startBgm();
    }
    return this.bgmMuted;
  }

  private getBgmMasterGain(): GainNode | null {
    if (!this.ctx) return null;
    if (!this.bgmMasterGain) {
      this.bgmMasterGain = this.ctx.createGain();
      this.bgmMasterGain.gain.setValueAtTime(this.bgmMuted ? 0 : 0.14, this.ctx.currentTime);
      this.bgmMasterGain.connect(this.ctx.destination);
    }
    return this.bgmMasterGain;
  }

  /**
   * Start looping background music track
   */
  public startBgm(): void {
    if (this.bgmMuted) return;
    this.initContext();
    if (!this.ctx) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    const master = this.getBgmMasterGain();
    if (master) {
      try {
        master.gain.cancelScheduledValues(this.ctx.currentTime);
        master.gain.setValueAtTime(master.gain.value, this.ctx.currentTime);
        master.gain.linearRampToValueAtTime(0.14, this.ctx.currentTime + 0.3);
      } catch {
        // Ignore
      }
    }

    if (this.bgmPlaying && this.bgmTimer) return;
    this.bgmPlaying = true;
    this.nextStepTime = this.ctx.currentTime + 0.05;

    this.bgmTimer = setInterval(() => {
      this.scheduleBgmSteps();
    }, 30);
  }

  /**
   * Pause/fade out background music track
   */
  public pauseBgm(): void {
    if (!this.ctx || !this.bgmMasterGain) return;
    try {
      this.bgmMasterGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.bgmMasterGain.gain.setValueAtTime(this.bgmMasterGain.gain.value, this.ctx.currentTime);
      this.bgmMasterGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.15);
    } catch {
      // Ignore
    }
  }

  /**
   * Stop background music loop completely
   */
  public stopBgm(): void {
    this.pauseBgm();
    if (this.bgmTimer) {
      clearInterval(this.bgmTimer);
      this.bgmTimer = null;
    }
    this.bgmPlaying = false;
    this.bgmCurrentStep = 0;
  }

  private scheduleBgmSteps(): void {
    if (!this.ctx || !this.bgmPlaying || this.bgmMuted) return;
    const lookahead = 0.12;
    const stepDuration = 0.144; // ~104 BPM 16th note

    while (this.nextStepTime < this.ctx.currentTime + lookahead) {
      this.playBgmStep(this.bgmCurrentStep, this.nextStepTime);
      this.nextStepTime += stepDuration;
      this.bgmCurrentStep = (this.bgmCurrentStep + 1) % 64;
    }
  }

  private playBgmStep(step: number, time: number): void {
    if (!this.ctx) return;
    const master = this.getBgmMasterGain();
    if (!master) return;

    const bar = Math.floor(step / 16);
    const barStep = step % 16;

    // 1. Bassline (warm low sine) on beats 0, 6, 10
    if (barStep === 0 || barStep === 6 || barStep === 10) {
      const bassFreqs = [
        [65.41, 98.00, 65.41], // C2, G2, C2 (Cmaj7)
        [55.00, 82.41, 55.00], // A1, E2, A1 (Am7)
        [43.65, 65.41, 43.65], // F1, C2, F1 (Fmaj7)
        [49.00, 73.42, 49.00], // G1, D2, G1 (G7)
      ];
      const noteIdx = barStep === 0 ? 0 : barStep === 6 ? 1 : 2;
      const freq = bassFreqs[bar][noteIdx];

      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, time);

        gain.gain.setValueAtTime(0.22, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.28);

        osc.connect(gain);
        gain.connect(master);
        osc.start(time);
        osc.stop(time + 0.28);
      } catch {
        // Ignore
      }
    }

    // 2. Pad Chord Swell on beat 0 of each bar (soft, lush, relaxing)
    if (barStep === 0) {
      const chordNotes = [
        [130.81, 164.81, 196.00, 246.94], // C3, E3, G3, B3 (Cmaj7)
        [110.00, 130.81, 164.81, 196.00], // A2, C3, E3, G3 (Am7)
        [87.31, 110.00, 130.81, 164.81],  // F2, A2, C3, E3 (Fmaj7)
        [98.00, 123.47, 146.83, 174.61],  // G2, B2, D3, F3 (G7)
      ][bar];

      chordNotes.forEach((freq) => {
        if (!this.ctx) return;
        try {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, time);

          gain.gain.setValueAtTime(0.001, time);
          gain.gain.linearRampToValueAtTime(0.03, time + 0.4);
          gain.gain.exponentialRampToValueAtTime(0.001, time + 2.1);

          osc.connect(gain);
          gain.connect(master);
          osc.start(time);
          osc.stop(time + 2.1);
        } catch {
          // Ignore
        }
      });
    }

    // 3. Melodic Marimba / Bell Arpeggio
    const melodyMap: Record<number, number> = {
      // Bar 0 (Cmaj7)
      0: 392.00, 2: 523.25, 4: 659.25, 6: 783.99, 8: 659.25, 10: 587.33, 12: 523.25, 14: 493.88,
      // Bar 1 (Am7)
      16: 329.63, 18: 440.00, 20: 523.25, 22: 659.25, 24: 523.25, 26: 493.88, 28: 440.00, 30: 392.00,
      // Bar 2 (Fmaj7)
      32: 440.00, 34: 523.25, 36: 698.46, 38: 659.25, 40: 587.33, 42: 523.25, 44: 440.00, 46: 392.00,
      // Bar 3 (G7)
      48: 392.00, 50: 493.88, 52: 587.33, 54: 698.46, 56: 659.25, 58: 587.33, 60: 493.88, 62: 587.33,
    };

    const melFreq = melodyMap[step];
    if (melFreq) {
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(melFreq, time);

        gain.gain.setValueAtTime(0.11, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.22);

        osc.connect(gain);
        gain.connect(master);
        osc.start(time);
        osc.stop(time + 0.22);
      } catch {
        // Ignore
      }
    }

    // 4. Soft Lo-Fi Percussion (Kick on 0 & 8, Shaker on even steps)
    if (barStep === 0 || barStep === 8) {
      try {
        const kickOsc = this.ctx.createOscillator();
        const kickGain = this.ctx.createGain();
        kickOsc.type = 'sine';
        kickOsc.frequency.setValueAtTime(75, time);
        kickOsc.frequency.exponentialRampToValueAtTime(32, time + 0.08);

        kickGain.gain.setValueAtTime(0.1, time);
        kickGain.gain.exponentialRampToValueAtTime(0.001, time + 0.08);

        kickOsc.connect(kickGain);
        kickGain.connect(master);
        kickOsc.start(time);
        kickOsc.stop(time + 0.08);
      } catch {
        // Ignore
      }
    }

    // Light shaker on 8th notes
    if (barStep % 2 === 0 && barStep !== 0 && barStep !== 8) {
      try {
        const bufferSize = Math.floor(this.ctx.sampleRate * 0.02);
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let j = 0; j < bufferSize; j++) {
          data[j] = (Math.random() * 2 - 1) * Math.exp(-j / (bufferSize * 0.2));
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(4200, time);
        filter.Q.setValueAtTime(2.0, time);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.028, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.02);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(master);
        noise.start(time);
      } catch {
        // Ignore
      }
    }
  }

  /**
   * Sound when picking up a block
   */
  public playPick(): void {
    if (this.muted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(480, now + 0.08);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch {
      // AudioContext could be blocked by browser policy until gesture
    }
  }

  /**
   * Sound when placing a block down on the board
   */
  public playPlace(): void {
    if (this.muted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;

      // Click/thud component
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.09);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.09);

      // Glass tap tone
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(520, now);
      osc2.frequency.exponentialRampToValueAtTime(380, now + 0.06);

      gain2.gain.setValueAtTime(0.06, now);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);

      osc2.start(now);
      osc2.stop(now + 0.06);
    } catch {
      // Ignore
    }
  }

  /**
   * Sound when lines are blasted/cleared.
   * Pitch climbs melodically with combo streak!
   */
  public playClear(lines: number, comboStreak: number): void {
    if (this.muted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // Musical pentatonic scale base notes: C4, D4, E4, G4, A4, C5, D5, E5, G5, A5
      const scale = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25, 783.99, 880.0];
      const baseIndex = Math.min(comboStreak * 2, scale.length - 3);

      const notes = [
        scale[baseIndex % scale.length],
        scale[(baseIndex + 2) % scale.length],
        scale[(baseIndex + 4) % scale.length],
      ];

      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const noteTime = now + idx * 0.065;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = lines >= 3 ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(freq, noteTime);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.02, noteTime + 0.28);

        const volume = 0.14 + Math.min(lines * 0.03, 0.12);
        gain.gain.setValueAtTime(volume, noteTime);
        gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.32);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(noteTime);
        osc.stop(noteTime + 0.32);
      });

      // Shimmer sparkle if high combo
      if (comboStreak >= 2) {
        const sparkleTime = now + 0.18;
        const sOsc = this.ctx.createOscillator();
        const sGain = this.ctx.createGain();
        sOsc.type = 'sine';
        sOsc.frequency.setValueAtTime(1046.5, sparkleTime); // C6
        sOsc.frequency.exponentialRampToValueAtTime(1318.5, sparkleTime + 0.2); // E6

        sGain.gain.setValueAtTime(0.08, sparkleTime);
        sGain.gain.exponentialRampToValueAtTime(0.001, sparkleTime + 0.2);

        sOsc.connect(sGain);
        sGain.connect(this.ctx.destination);

        sOsc.start(sparkleTime);
        sOsc.stop(sparkleTime + 0.2);
      }

      // 1. Suara tepuk tangan (applause) di setiap blast
      this.playClap();

      // 2. Jika 1 baris: suara tepuk tangan + sorak "Horeee!"
      // 3. Jika lebih dari 1 baris (> 1): suara laki-laki besar berseru "Mini block blast!"
      if (lines > 1) {
        setTimeout(() => {
          this.playMiniBlockBlastVoice();
        }, 90);
      } else {
        setTimeout(() => {
          this.playHoree();
        }, 80);
      }
    } catch {
      // Ignore
    }
  }

  /**
   * Suara tepuk tangan (applause claps) yang renyah dan meriah
   */
  public playClap(): void {
    if (this.muted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const clapCount = 6;
      for (let i = 0; i < clapCount; i++) {
        const clapTime = now + i * 0.05 + Math.random() * 0.025;
        const bufferSize = Math.floor(this.ctx.sampleRate * 0.035);
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let j = 0; j < bufferSize; j++) {
          data[j] = (Math.random() * 2 - 1) * Math.exp(-j / (bufferSize * 0.25));
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        // Bandpass filter akustik tepuk tangan (~1100Hz)
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1050 + Math.random() * 250, clapTime);
        filter.Q.setValueAtTime(2.2, clapTime);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.18, clapTime);
        gain.gain.exponentialRampToValueAtTime(0.001, clapTime + 0.035);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        noise.start(clapTime);
      }
    } catch {
      // Ignore
    }
  }

  /**
   * Suara sorak riang "Horeee!" saat blast 1 baris
   */
  public playHoree(): void {
    if (this.muted) return;

    // Harmonik nada riang naik
    this.initContext();
    if (this.ctx) {
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(784, now + 0.12);
        osc.frequency.exponentialRampToValueAtTime(987.77, now + 0.25);

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.3);
      } catch {
        // Ignore
      }
    }

    // Suara vokal "Horeee!" via SpeechSynthesis
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance('Horeee!');
        utter.lang = 'id-ID';
        utter.pitch = 1.35; // Nada tinggi ceria
        utter.rate = 1.25;  // Tempo cepat gembira
        utter.volume = 0.95;
        window.speechSynthesis.speak(utter);
      } catch {
        // Ignore
      }
    }
  }

  /**
   * Suara laki-laki besar bertenaga berseru "Mini block blast!" saat > 1 baris hancur
   */
  public playMiniBlockBlastVoice(): void {
    if (this.muted) return;

    // Dentuman bass tebal menggelegar di Web Audio
    this.initContext();
    if (this.ctx) {
      try {
        const now = this.ctx.currentTime;
        const subOsc = this.ctx.createOscillator();
        const subGain = this.ctx.createGain();
        subOsc.type = 'sine';
        subOsc.frequency.setValueAtTime(115, now);
        subOsc.frequency.exponentialRampToValueAtTime(42, now + 0.45);

        subGain.gain.setValueAtTime(0.3, now);
        subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

        subOsc.connect(subGain);
        subGain.connect(this.ctx.destination);
        subOsc.start(now);
        subOsc.stop(now + 0.5);
      } catch {
        // Ignore
      }
    }

    // Suara pria berwibawa & bernada rendah/berat (deep voice)
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance('Mini block blast!');
        utter.pitch = 0.52; // Pitch rendah laki-laki besar (deep bass)
        utter.rate = 0.88;  // Tempo artikulatif & berwibawa
        utter.volume = 1.0;

        // Cari suara pria jika tersedia di sistem browser
        const voices = window.speechSynthesis.getVoices();
        const maleVoice = voices.find((v) =>
          /male|david|george|alex|daniel|guy|deep|id-id/i.test(v.name)
        );
        if (maleVoice) {
          utter.voice = maleVoice;
        }

        window.speechSynthesis.speak(utter);
      } catch {
        // Ignore
      }
    }
  }

  /**
   * Sound when game is over
   */
  public playGameOver(): void {
    if (this.muted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [440, 392, 349.23, 293.66, 220]; // Descending melancholy chord

      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const time = now + idx * 0.12;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, time);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.95, time + 0.35);

        gain.gain.setValueAtTime(0.12, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(time);
        osc.stop(time + 0.4);
      });
    } catch {
      // Ignore
    }
  }

  /**
   * New high score chime
   */
  public playHighScore(): void {
    if (this.muted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5 - E5 - G5 - C6 fanfare

      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const time = now + idx * 0.08;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, time);

        gain.gain.setValueAtTime(0.15, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.3);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(time);
        osc.stop(time + 0.3);
      });
    } catch {
      // Ignore
    }
  }

  /**
   * Sound when combo multiplier increases or charges up
   */
  public playMultiplierSurge(multiplier: number): void {
    if (this.muted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const isMax = multiplier >= 5.0;

      // Scale notes based on multiplier level
      const chord = isMax
        ? [523.25, 659.25, 783.99, 1046.5, 1318.51] // C5 E5 G5 C6 E6 fever
        : multiplier >= 3.0
        ? [392.0, 493.88, 587.33, 783.99] // G4 B4 D5 G5
        : [329.63, 440.0, 523.25]; // E4 A4 C5

      chord.forEach((freq, idx) => {
        if (!this.ctx) return;
        const noteTime = now + idx * 0.05;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = isMax ? 'sawtooth' : 'triangle';
        osc.frequency.setValueAtTime(freq, noteTime);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.05, noteTime + 0.22);

        gain.gain.setValueAtTime(isMax ? 0.09 : 0.07, noteTime);
        gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(noteTime);
        osc.stop(noteTime + 0.25);
      });
    } catch {
      // Ignore
    }
  }

  /**
   * Unique sound effect that triggers specifically when the combo streak increases.
   * Completely distinct from the low thud of block placement:
   * Uses an energetic rising power glissando + dual detuned harmonic crystal bells
   * that climb in frequency and brilliance with each consecutive combo!
   */
  public playComboStreak(streak: number): void {
    if (this.muted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;

      // Base pitch climbs with streak (G4 up through C6 and above)
      const streakIndex = Math.min(Math.max(streak, 1), 6);
      const rootFrequencies = [0, 659.25, 783.99, 880.0, 987.77, 1046.5, 1318.51];
      const baseFreq = rootFrequencies[streakIndex] || 880.0;
      const targetFreq = baseFreq * 1.333; // Ascending musical fourth/fifth interval

      // 1. Rising Power Glissando / Arcade Streak Surge (completely unlike placement thud)
      const riserOsc = this.ctx.createOscillator();
      const riserGain = this.ctx.createGain();

      riserOsc.type = 'sine';
      riserOsc.frequency.setValueAtTime(baseFreq * 0.72, now);
      riserOsc.frequency.exponentialRampToValueAtTime(targetFreq * 1.15, now + 0.12);

      riserGain.gain.setValueAtTime(0.001, now);
      riserGain.gain.linearRampToValueAtTime(0.12, now + 0.025);
      riserGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      riserOsc.connect(riserGain);
      riserGain.connect(this.ctx.destination);

      riserOsc.start(now);
      riserOsc.stop(now + 0.18);

      // 2. Crystal Ding / Bell impact (Twin detuned oscillators for lush chorus sparkle)
      const detunes = [-7, 7];
      detunes.forEach((cents) => {
        if (!this.ctx) return;
        const bellOsc = this.ctx.createOscillator();
        const bellGain = this.ctx.createGain();

        bellOsc.type = 'triangle';
        bellOsc.frequency.setValueAtTime(targetFreq, now + 0.075);
        bellOsc.detune.setValueAtTime(cents, now + 0.075);

        bellGain.gain.setValueAtTime(0.001, now + 0.075);
        bellGain.gain.linearRampToValueAtTime(0.14, now + 0.09);
        bellGain.gain.exponentialRampToValueAtTime(0.001, now + 0.36);

        bellOsc.connect(bellGain);
        bellGain.connect(this.ctx.destination);

        bellOsc.start(now + 0.075);
        bellOsc.stop(now + 0.36);
      });

      // 3. High harmonic sparkle for streaks >= 2
      if (streak >= 2) {
        const sparkleOsc = this.ctx.createOscillator();
        const sparkleGain = this.ctx.createGain();

        sparkleOsc.type = 'sine';
        sparkleOsc.frequency.setValueAtTime(targetFreq * 2, now + 0.11);
        sparkleOsc.frequency.exponentialRampToValueAtTime(targetFreq * 2.5, now + 0.26);

        sparkleGain.gain.setValueAtTime(0.001, now + 0.11);
        sparkleGain.gain.linearRampToValueAtTime(0.08, now + 0.13);
        sparkleGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

        sparkleOsc.connect(sparkleGain);
        sparkleGain.connect(this.ctx.destination);

        sparkleOsc.start(now + 0.11);
        sparkleOsc.stop(now + 0.3);
      }

      // 4. Extra Fever cascade for streak >= 4
      if (streak >= 4) {
        const feverOsc = this.ctx.createOscillator();
        const feverGain = this.ctx.createGain();

        feverOsc.type = 'sine';
        feverOsc.frequency.setValueAtTime(targetFreq * 1.5, now + 0.15);
        feverOsc.frequency.exponentialRampToValueAtTime(targetFreq * 3, now + 0.34);

        feverGain.gain.setValueAtTime(0.001, now + 0.15);
        feverGain.gain.linearRampToValueAtTime(0.09, now + 0.18);
        feverGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

        feverOsc.connect(feverGain);
        feverGain.connect(this.ctx.destination);

        feverOsc.start(now + 0.15);
        feverOsc.stop(now + 0.4);
      }
    } catch {
      // Ignore if audio context suspended
    }
  }

  /**
   * Heavy crunch sound when breaking a block with the Hammer booster
   */
  public playHammer(): void {
    if (this.muted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;

      // Heavy metal/stone impact
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.14);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.18);

      // Glass smash high ping
      const shatter = this.ctx.createOscillator();
      const shatterGain = this.ctx.createGain();
      shatter.type = 'triangle';
      shatter.frequency.setValueAtTime(950, now);
      shatter.frequency.exponentialRampToValueAtTime(1400, now + 0.08);

      shatterGain.gain.setValueAtTime(0.12, now);
      shatterGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      shatter.connect(shatterGain);
      shatterGain.connect(this.ctx.destination);
      shatter.start(now);
      shatter.stop(now + 0.15);
    } catch {
      // Ignore
    }
  }

  /**
   * Aerodynamic whoosh when rotating pieces
   */
  public playRotate(): void {
    if (this.muted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(620, now + 0.05);
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.11);

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.11);
    } catch {
      // Ignore
    }
  }

  /**
   * Crisp shuffle clicks when rerolling tray pieces
   */
  public playReroll(): void {
    if (this.muted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const pitches = [420, 560, 720];

      pitches.forEach((freq, idx) => {
        if (!this.ctx) return;
        const clickTime = now + idx * 0.045;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, clickTime);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.8, clickTime + 0.04);

        gain.gain.setValueAtTime(0.12, clickTime);
        gain.gain.exponentialRampToValueAtTime(0.001, clickTime + 0.04);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(clickTime);
        osc.stop(clickTime + 0.04);
      });
    } catch {
      // Ignore
    }
  }

  /**
   * Fanfare chime when unlocking an achievement
   */
  public playAchievement(): void {
    if (this.muted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5 E5 G5 C6

      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const time = now + idx * 0.07;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, time);

        gain.gain.setValueAtTime(0.14, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.28);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(time);
        osc.stop(time + 0.28);
      });
    } catch {
      // Ignore
    }
  }
}

export const sound = new SoundSystem();
