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

/**
 * Calculates points for placing a piece and clearing lines
 */
export function calculateScore(
  placedBlocksCount: number,
  linesClearedCount: number,
  comboStreak: number
): { points: number; title: string; subtext: string } {
  // Placement points
  let points = placedBlocksCount;

  if (linesClearedCount === 0) {
    return { points, title: '', subtext: '' };
  }

  // Base line blast points
  // 1 line = 10 pts, 2 lines = 30 pts, 3 lines = 60 pts, 4 lines = 100 pts, etc.
  const linePoints = [0, 10, 30, 60, 100, 150, 210, 280, 360];
  const baseBlast = linePoints[Math.min(linesClearedCount, linePoints.length - 1)] || linesClearedCount * 30;

  // Combo multiplier: combo 1 = 1x, combo 2 = 1.5x, combo 3 = 2x, combo 4 = 2.5x, etc.
  const comboMultiplier = 1 + (comboStreak - 1) * 0.5;
  const comboBonus = Math.round(baseBlast * comboMultiplier);

  points += comboBonus;

  // Title / Subtext for celebration
  let title = '';
  if (linesClearedCount === 1) title = 'BLAST!';
  else if (linesClearedCount === 2) title = 'DOUBLE BLAST!';
  else if (linesClearedCount === 3) title = 'TRIPLE BLAST!';
  else if (linesClearedCount >= 4) title = 'MEGA BLAST!';

  let subtext = '';
  if (comboStreak > 1) {
    subtext = `COMBO x${comboStreak} (+${comboBonus})`;
  }

  return { points, title, subtext };
}
