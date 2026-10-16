/**
 * Device Haptic Feedback utility for mobile/Android and web browsers.
 * Uses the Web Vibration API with safe feature detection and localStorage settings.
 */

class HapticsManager {
  private enabled: boolean = true;

  constructor() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('blockblast_haptics');
      if (saved !== null) {
        this.enabled = saved === 'true';
      }
    }
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public toggle(): boolean {
    this.enabled = !this.enabled;
    if (typeof window !== 'undefined') {
      localStorage.setItem('blockblast_haptics', String(this.enabled));
    }
    return this.enabled;
  }

  private vibrate(pattern: number | number[]): void {
    if (!this.enabled || typeof window === 'undefined' || !('vibrate' in navigator)) {
      return;
    }
    try {
      navigator.vibrate(pattern);
    } catch {
      // Ignore if device permission restricted
    }
  }

  /**
   * Subtle tick when picking up or tapping a piece or button
   */
  public light(): void {
    this.vibrate(12);
  }

  /**
   * Ultra-light crisp tick when a piece magnetically snaps to a valid board location
   */
  public snap(): void {
    this.vibrate(8);
  }

  /**
   * Firm tap when placing a block down on the board
   */
  public medium(): void {
    this.vibrate(24);
  }

  /**
   * Energetic pulse when lines blast
   */
  public blast(linesCount: number = 1): void {
    if (linesCount >= 3) {
      this.vibrate([35, 40, 50]);
    } else {
      this.vibrate([25, 30, 25]);
    }
  }

  /**
   * Exciting rumble when combo streak increases
   */
  public combo(streak: number = 1): void {
    if (streak >= 5) {
      // Fever mode high-voltage pattern
      this.vibrate([40, 50, 40, 50, 60]);
    } else {
      this.vibrate([20, 30, 35]);
    }
  }

  /**
   * Heavy crunch when using hammer booster
   */
  public hammer(): void {
    this.vibrate([50, 40, 70]);
  }

  /**
   * Quick dual tick when rotating pieces
   */
  public rotate(): void {
    this.vibrate([15, 20, 15]);
  }

  /**
   * Shuffle flutter when rerolling tray pieces
   */
  public reroll(): void {
    this.vibrate([10, 15, 10, 15, 20]);
  }
}

export const haptics = new HapticsManager();
