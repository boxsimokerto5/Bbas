import { Achievement, BoosterType, PlayerStats } from '../types/game';

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_blast',
    title: 'Langkah Pertama',
    description: 'Hancurkan garis pertamamu di kisi',
    target: 1,
    current: 0,
    unlocked: false,
    rewardType: 'hammer',
    rewardCount: 1,
    claimed: false,
  },
  {
    id: 'combo_3',
    title: 'Kombo Beruntun',
    description: 'Capai Kombo x3 dalam satu permainan',
    target: 3,
    current: 0,
    unlocked: false,
    rewardType: 'rotate',
    rewardCount: 1,
    claimed: false,
  },
  {
    id: 'combo_5',
    title: 'Master Fever',
    description: 'Capai Kombo x5 MAX Multiplier',
    target: 5,
    current: 0,
    unlocked: false,
    rewardType: 'hammer',
    rewardCount: 2,
    claimed: false,
  },
  {
    id: 'lines_50',
    title: 'Penghancur Balok',
    description: 'Hancurkan total 50 garis',
    target: 50,
    current: 0,
    unlocked: false,
    rewardType: 'reroll',
    rewardCount: 2,
    claimed: false,
  },
  {
    id: 'lines_150',
    title: 'Legenda Grid',
    description: 'Hancurkan total 150 garis',
    target: 150,
    current: 0,
    unlocked: false,
    rewardType: 'hammer',
    rewardCount: 2,
    claimed: false,
  },
  {
    id: 'score_3000',
    title: 'Pencetak Skor',
    description: 'Capai skor 3.000 poin dalam satu game',
    target: 3000,
    current: 0,
    unlocked: false,
    rewardType: 'reroll',
    rewardCount: 1,
    claimed: false,
  },
  {
    id: 'score_8000',
    title: 'Grand Master',
    description: 'Capai skor 8.000 poin dalam satu game',
    target: 8000,
    current: 0,
    unlocked: false,
    rewardType: 'rotate',
    rewardCount: 2,
    claimed: false,
  },
  {
    id: 'booster_5',
    title: 'Ahli Taktik',
    description: 'Gunakan booster bantuan sebanyak 5 kali',
    target: 5,
    current: 0,
    unlocked: false,
    rewardType: 'hammer',
    rewardCount: 1,
    claimed: false,
  },
];

const STATS_KEY = 'blockblast_player_stats';
const ACHIEVEMENTS_KEY = 'blockblast_achievements';

export function loadPlayerStats(): PlayerStats {
  if (typeof window === 'undefined') {
    return {
      gamesPlayed: 0,
      highScore: 0,
      maxCombo: 0,
      totalLinesCleared: 0,
      totalBlocksPlaced: 0,
      totalBoostersUsed: 0,
    };
  }
  try {
    const saved = localStorage.getItem(STATS_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch {
    // Ignore
  }
  return {
    gamesPlayed: 0,
    highScore: 0,
    maxCombo: 0,
    totalLinesCleared: 0,
    totalBlocksPlaced: 0,
    totalBoostersUsed: 0,
  };
}

export function savePlayerStats(stats: PlayerStats): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch {
    // Ignore
  }
}

export function loadAchievements(): Achievement[] {
  if (typeof window === 'undefined') return INITIAL_ACHIEVEMENTS;
  try {
    const saved = localStorage.getItem(ACHIEVEMENTS_KEY);
    if (saved) {
      const parsed: Achievement[] = JSON.parse(saved);
      // Merge with initial in case new achievements were added
      return INITIAL_ACHIEVEMENTS.map((init) => {
        const found = parsed.find((p) => p.id === init.id);
        return found ? { ...init, ...found } : init;
      });
    }
  } catch {
    // Ignore
  }
  return INITIAL_ACHIEVEMENTS;
}

export function saveAchievements(achievements: Achievement[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(achievements));
  } catch {
    // Ignore
  }
}
