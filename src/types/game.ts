export type ColorId =
  | 'ruby'
  | 'amber'
  | 'topaz'
  | 'emerald'
  | 'cyan'
  | 'sapphire'
  | 'amethyst'
  | 'rose';

export type ThemeId = 'classic3d' | 'bright' | 'sunshine' | 'jewel' | 'wood' | 'cyber' | 'ocean' | 'candy';

export interface ThemeDef {
  id: ThemeId;
  name: string;
  tagline: string;
  isLight?: boolean;
  isWood?: boolean;
  previewColors: string[];
  bgClass: string;
  ambientTop: string;
  ambientBottom: string;
  boardBg: string;
  boardBorder: string;
  boardShadow: string;
  socketBg: string;
  socketBorder: string;
  socketDot: string;
  trayBg: string;
  trayBorder: string;
  accentColor: string;
  colorDefs: Record<ColorId, ColorDef>;
}

export interface ColorDef {
  id: ColorId;
  name: string;
  gradient: string;
  glow: string;
  border: string;
  shadowColor: string; // Color for 3D bottom-right extrusion bevel
  particleHex: string;
}

export interface BlockShape {
  id: string;
  name: string;
  matrix: number[][]; // 1 for filled block, 0 for empty
  colorId: ColorId;
}

export interface PlacedPiece {
  id: string;
  shape: BlockShape;
  color: ColorDef;
  isUsed: boolean;
}

export type GridCell = {
  colorId: ColorId | null;
  clearing?: boolean;
  justPlaced?: boolean;
} | null;

export type BoardMatrix = GridCell[][]; // 8x8

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
  rotation: number;
  vRot: number;
  isSquare?: boolean;
}

export interface FloatingText {
  id: string;
  text: string;
  subtext?: string;
  points: number;
  x: number;
  y: number;
  comboCount: number;
  multiplier?: number;
}

export interface BoostersInventory {
  hammer: number;
  rotate: number;
  reroll: number;
}

export type BoosterType = 'hammer' | 'rotate' | 'reroll';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  unlocked: boolean;
  rewardType: BoosterType;
  rewardCount: number;
  claimed: boolean;
}

export interface PlayerStats {
  gamesPlayed: number;
  highScore: number;
  maxCombo: number;
  totalLinesCleared: number;
  totalBlocksPlaced: number;
  totalBoostersUsed: number;
}

