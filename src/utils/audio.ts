/**
 * Web Audio API procedural sound synthesizer for Block Blast.
 * Works 100% offline with zero external audio assets.
 */

class SoundSystem {
  private ctx: AudioContext | null = null;
  private muted: boolean = false;

  constructor() {
    // Read saved mute preference
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('blockblast_muted');
      if (saved !== null) {
        this.muted = saved === 'true';
      }
    }
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
    return this.muted;
  }

  public toggleMute(): boolean {
    this.muted = !this.muted;
    if (typeof window !== 'undefined') {
      localStorage.setItem('blockblast_muted', String(this.muted));
    }
    return this.muted;
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
    } catch {
      // Ignore
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
}

export const sound = new SoundSystem();
