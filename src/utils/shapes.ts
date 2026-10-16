import { BlockShape, BoardMatrix, ColorDef, ColorId, PlacedPiece } from '../types/game';
import { THEMES, DEFAULT_THEME_ID } from './themes';

export const BOARD_SIZE = 8;

export const COLOR_DEFS: Record<ColorId, ColorDef> = THEMES[DEFAULT_THEME_ID].colorDefs;


const COLOR_KEYS: ColorId[] = [
  'ruby',
  'amber',
  'topaz',
  'emerald',
  'cyan',
  'sapphire',
  'amethyst',
  'rose',
];

// Complete collection of Block Blast Polyomino Shapes
export const SHAPE_TEMPLATES: Omit<BlockShape, 'id' | 'colorId'>[] = [
  // 1x1 Dot
  { name: 'Dot 1x1', matrix: [[1]] },

  // Lines 2
  { name: 'Line 2H', matrix: [[1, 1]] },
  { name: 'Line 2V', matrix: [[1], [1]] },

  // Lines 3
  { name: 'Line 3H', matrix: [[1, 1, 1]] },
  { name: 'Line 3V', matrix: [[1], [1], [1]] },

  // Lines 4
  { name: 'Line 4H', matrix: [[1, 1, 1, 1]] },
  { name: 'Line 4V', matrix: [[1], [1], [1], [1]] },

  // Lines 5
  { name: 'Line 5H', matrix: [[1, 1, 1, 1, 1]] },
  { name: 'Line 5V', matrix: [[1], [1], [1], [1], [1]] },

  // 2x2 Square
  {
    name: 'Square 2x2',
    matrix: [
      [1, 1],
      [1, 1],
    ],
  },

  // 3x3 Square
  {
    name: 'Square 3x3',
    matrix: [
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
    ],
  },

  // Small Corner (3 blocks, 2x2)
  {
    name: 'Corner Top-Left',
    matrix: [
      [1, 1],
      [1, 0],
    ],
  },
  {
    name: 'Corner Top-Right',
    matrix: [
      [1, 1],
      [0, 1],
    ],
  },
  {
    name: 'Corner Bottom-Left',
    matrix: [
      [1, 0],
      [1, 1],
    ],
  },
  {
    name: 'Corner Bottom-Right',
    matrix: [
      [0, 1],
      [1, 1],
    ],
  },

  // L Shapes 4 blocks (3x2)
  {
    name: 'L-Shape 1',
    matrix: [
      [1, 0],
      [1, 0],
      [1, 1],
    ],
  },
  {
    name: 'L-Shape 2',
    matrix: [
      [0, 1],
      [0, 1],
      [1, 1],
    ],
  },
  {
    name: 'L-Shape 3',
    matrix: [
      [1, 1, 1],
      [1, 0, 0],
    ],
  },
  {
    name: 'L-Shape 4',
    matrix: [
      [1, 1, 1],
      [0, 0, 1],
    ],
  },
  {
    name: 'L-Shape 5',
    matrix: [
      [1, 1],
      [1, 0],
      [1, 0],
    ],
  },
  {
    name: 'L-Shape 6',
    matrix: [
      [1, 1],
      [0, 1],
      [0, 1],
    ],
  },
  {
    name: 'L-Shape 7',
    matrix: [
      [0, 0, 1],
      [1, 1, 1],
    ],
  },
  {
    name: 'L-Shape 8',
    matrix: [
      [1, 0, 0],
      [1, 1, 1],
    ],
  },

  // Big Corner 3x3 (5 blocks)
  {
    name: 'Big Corner 1',
    matrix: [
      [1, 0, 0],
      [1, 0, 0],
      [1, 1, 1],
    ],
  },
  {
    name: 'Big Corner 2',
    matrix: [
      [0, 0, 1],
      [0, 0, 1],
      [1, 1, 1],
    ],
  },
  {
    name: 'Big Corner 3',
    matrix: [
      [1, 1, 1],
      [1, 0, 0],
      [1, 0, 0],
    ],
  },
  {
    name: 'Big Corner 4',
    matrix: [
      [1, 1, 1],
      [0, 0, 1],
      [0, 0, 1],
    ],
  },

  // T Shapes (4 blocks)
  {
    name: 'T-Shape Down',
    matrix: [
      [1, 1, 1],
      [0, 1, 0],
    ],
  },
  {
    name: 'T-Shape Up',
    matrix: [
      [0, 1, 0],
      [1, 1, 1],
    ],
  },
  {
    name: 'T-Shape Right',
    matrix: [
      [1, 0],
      [1, 1],
      [1, 0],
    ],
  },
  {
    name: 'T-Shape Left',
    matrix: [
      [0, 1],
      [1, 1],
      [0, 1],
    ],
  },

  // Z and S Shapes
  {
    name: 'Z-Shape H',
    matrix: [
      [1, 1, 0],
      [0, 1, 1],
    ],
  },
  {
    name: 'S-Shape H',
    matrix: [
      [0, 1, 1],
      [1, 1, 0],
    ],
  },
  {
    name: 'Z-Shape V',
    matrix: [
      [0, 1],
      [1, 1],
      [1, 0],
    ],
  },
  {
    name: 'S-Shape V',
    matrix: [
      [1, 0],
      [1, 1],
      [0, 1],
    ],
  },

  // 2x3 Rectangle
  {
    name: 'Rect 2x3',
    matrix: [
      [1, 1, 1],
      [1, 1, 1],
    ],
  },
  {
    name: 'Rect 3x2',
    matrix: [
      [1, 1],
      [1, 1],
      [1, 1],
    ],
  },
];

/**
 * Creates an empty 8x8 game board
 */
export function createEmptyBoard(): BoardMatrix {
  return Array.from({ length: BOARD_SIZE }, () =>
    Array.from({ length: BOARD_SIZE }, () => null)
  );
}

/**
 * Checks whether a given shape matrix can fit at (startRow, startCol) on the board
 */
export function canPlaceShape(
  board: BoardMatrix,
  matrix: number[][],
  startRow: number,
  startCol: number
): boolean {
  const rows = matrix.length;
  const cols = matrix[0].length;

  // Boundary check
  if (startRow < 0 || startCol < 0 || startRow + rows > BOARD_SIZE || startCol + cols > BOARD_SIZE) {
    return false;
  }

  // Overlap check
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (matrix[r][c] === 1) {
        if (board[startRow + r][startCol + c] !== null) {
          return false;
        }
      }
    }
  }

  return true;
}

/**
 * Checks if a shape can be placed ANYWHERE on the board
 */
export function canPlaceShapeAnywhere(board: BoardMatrix, matrix: number[][]): boolean {
  const rows = matrix.length;
  const cols = matrix[0].length;

  for (let r = 0; r <= BOARD_SIZE - rows; r++) {
    for (let c = 0; c <= BOARD_SIZE - cols; c++) {
      if (canPlaceShape(board, matrix, r, c)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Checks if at least one available piece can be placed on the board.
 * If none can be placed, it's Game Over!
 */
export function hasAnyValidMove(board: BoardMatrix, pieces: PlacedPiece[]): boolean {
  const activePieces = pieces.filter((p) => !p.isUsed);
  if (activePieces.length === 0) return true; // Will deal new pieces

  return activePieces.some((piece) => canPlaceShapeAnywhere(board, piece.shape.matrix));
}

/**
 * Finds all full rows and full columns on the board
 */
export function findFullLines(board: BoardMatrix): { fullRows: number[]; fullCols: number[] } {
  const fullRows: number[] = [];
  const fullCols: number[] = [];

  // Check rows
  for (let r = 0; r < BOARD_SIZE; r++) {
    let isFull = true;
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (board[r][c] === null) {
        isFull = false;
        break;
      }
    }
    if (isFull) {
      fullRows.push(r);
    }
  }

  // Check columns
  for (let c = 0; c < BOARD_SIZE; c++) {
    let isFull = true;
    for (let r = 0; r < BOARD_SIZE; r++) {
      if (board[r][c] === null) {
        isFull = false;
        break;
      }
    }
    if (isFull) {
      fullCols.push(c);
    }
  }

  return { fullRows, fullCols };
}

/**
 * Returns a set of 3 random pieces for a round.
 * Ensures good variety so the player gets playable, engaging pieces.
 */
export function generatePieceSet(
  roundNumber: number,
  colorDefs: Record<ColorId, ColorDef> = COLOR_DEFS
): PlacedPiece[] {
  const result: PlacedPiece[] = [];

  // Categorize shapes to balance difficulty
  const smallShapes = SHAPE_TEMPLATES.filter((s) => {
    const count = s.matrix.flat().reduce((a, b) => a + b, 0);
    return count <= 3;
  });
  const mediumShapes = SHAPE_TEMPLATES.filter((s) => {
    const count = s.matrix.flat().reduce((a, b) => a + b, 0);
    return count === 4;
  });
  const largeShapes = SHAPE_TEMPLATES.filter((s) => {
    const count = s.matrix.flat().reduce((a, b) => a + b, 0);
    return count >= 5;
  });

  // Pick 1 from small/medium, 1 from medium/any, 1 mixed
  const picks: typeof SHAPE_TEMPLATES[0][] = [];

  // Slot 1: small or medium
  picks.push(
    Math.random() > 0.4
      ? smallShapes[Math.floor(Math.random() * smallShapes.length)]
      : mediumShapes[Math.floor(Math.random() * mediumShapes.length)]
  );

  // Slot 2: medium or large
  picks.push(
    Math.random() > 0.5
      ? mediumShapes[Math.floor(Math.random() * mediumShapes.length)]
      : largeShapes[Math.floor(Math.random() * largeShapes.length)]
  );

  // Slot 3: any shape
  picks.push(SHAPE_TEMPLATES[Math.floor(Math.random() * SHAPE_TEMPLATES.length)]);

  // Shuffle order of pieces
  picks.sort(() => Math.random() - 0.5);

  // Assign distinct colors
  const shuffledColors = [...COLOR_KEYS].sort(() => Math.random() - 0.5);

  picks.forEach((template, index) => {
    const colorId = shuffledColors[index % shuffledColors.length];
    const colorDef = colorDefs[colorId] || COLOR_DEFS[colorId];

    result.push({
      id: `piece-${roundNumber}-${index}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      shape: {
        id: `shape-${index}`,
        name: template.name,
        matrix: template.matrix,
        colorId,
      },
      color: colorDef,
      isUsed: false,
    });
  });

  return result;
}

export interface ComboTierInfo {
  tier: number;
  minStreak: number;
  multiplier: number;
  label: string;
  bonusPercent: string;
  glowColor: string;
}

export const COMBO_TIERS: ComboTierInfo[] = [
  { tier: 1, minStreak: 1, multiplier: 1.5, label: '1.5x', bonusPercent: '+50%', glowColor: 'from-amber-400 to-orange-500' },
  { tier: 2, minStreak: 2, multiplier: 2.0, label: '2.0x', bonusPercent: '+100%', glowColor: 'from-emerald-400 to-teal-500' },
  { tier: 3, minStreak: 3, multiplier: 2.5, label: '2.5x', bonusPercent: '+150%', glowColor: 'from-cyan-400 to-blue-500' },
  { tier: 4, minStreak: 4, multiplier: 3.2, label: '3.2x', bonusPercent: '+220%', glowColor: 'from-violet-400 to-purple-500' },
  { tier: 5, minStreak: 5, multiplier: 5.0, label: '5.0x', bonusPercent: '+400%', glowColor: 'from-rose-500 via-amber-400 to-yellow-300' },
];

/**
 * Returns the score multiplier according to active combo streak:
 * 0 streak: 1.0x (Normal)
 * 1 streak: 1.5x (+50% bonus)
 * 2 streak: 2.0x (Double score)
 * 3 streak: 2.5x (+150% bonus)
 * 4 streak: 3.2x (+220% bonus)
 * 5+ streak: 5.0x (Max Fever bonus!)
 */
export function getComboMultiplier(comboStreak: number): number {
  if (comboStreak <= 0) return 1.0;
  if (comboStreak === 1) return 1.5;
  if (comboStreak === 2) return 2.0;
  if (comboStreak === 3) return 2.5;
  if (comboStreak === 4) return 3.2;
  return 5.0;
}

/**
 * Calculates points for placing a piece and clearing lines, applying the combo multiplier
 */
export function calculateScore(
  placedBlocksCount: number,
  linesClearedCount: number,
  comboStreak: number
): {
  points: number;
  baseScore: number;
  multiplier: number;
  title: string;
  subtext: string;
} {
  const multiplier = getComboMultiplier(comboStreak);

  if (linesClearedCount === 0) {
    return {
      points: placedBlocksCount,
      baseScore: placedBlocksCount,
      multiplier: 1.0,
      title: '',
      subtext: '',
    };
  }

  // Base line blast points
  // 1 line = 10 pts, 2 lines = 30 pts, 3 lines = 60 pts, 4 lines = 100 pts, etc.
  const linePoints = [0, 10, 30, 60, 100, 150, 210, 280, 360];
  const baseBlast =
    linePoints[Math.min(linesClearedCount, linePoints.length - 1)] ||
    linesClearedCount * 30;

  // Base move score before multiplier (blocks placed + line clear points)
  const baseScore = placedBlocksCount + baseBlast;

  // Apply multiplier to score gained for this move
  const points = Math.round(baseScore * multiplier);

  // Title / Subtext for celebration
  let title = '';
  if (linesClearedCount === 1) title = 'BLAST!';
  else if (linesClearedCount === 2) title = 'DOUBLE BLAST!';
  else if (linesClearedCount === 3) title = 'TRIPLE BLAST!';
  else if (linesClearedCount >= 4) title = 'MEGA BLAST!';

  let subtext = '';
  if (multiplier > 1.0) {
    subtext = `${multiplier.toFixed(1)}x MULTIPLIER (+${points})`;
  } else if (comboStreak > 1) {
    subtext = `COMBO x${comboStreak} (+${points})`;
  }

  return { points, baseScore, multiplier, title, subtext };
}
