import React from 'react';
import { ColorId, ThemeDef } from '../types/game';
import { THEMES } from '../utils/themes';

interface BlockCellProps {
  colorId: ColorId | null;
  isGhost?: boolean;
  ghostColorId?: ColorId;
  isClearing?: boolean;
  isProjectedClear?: boolean;
  cellSize: number;
  theme?: ThemeDef;
}

export const BlockCell: React.FC<BlockCellProps> = ({
  colorId,
  isGhost = false,
  ghostColorId,
  isClearing = false,
  isProjectedClear = false,
  cellSize,
  theme = THEMES.classic3d,
}) => {
  const isWood = theme.isWood;

  // Empty socket indented into board
  if (!colorId && !isGhost) {
    if (isWood) {
      return (
        <div
          style={{ width: cellSize, height: cellSize }}
          className={`rounded-md ${theme.socketBg} ${theme.socketBorder} border grid-socket-wood transition-colors duration-200 relative flex items-center justify-center`}
        >
          {/* Subtle wood socket center grain dot */}
          <div className="w-1.5 h-1.5 rounded-full bg-amber-950/70 pointer-events-none" />
        </div>
      );
    }

    return (
      <div
        style={{ width: cellSize, height: cellSize }}
        className={`rounded-md ${theme.socketBg} ${theme.socketBorder} border grid-socket-3d transition-colors duration-200 relative flex items-center justify-center`}
      >
        <div className={`w-1.5 h-1.5 rounded-full ${theme.socketDot} pointer-events-none transition-colors duration-200 opacity-60`} />
      </div>
    );
  }

  // Ghost preview cell (when dragging or hovering over a valid placement)
  if (isGhost && ghostColorId) {
    const colorDef = theme.colorDefs[ghostColorId] || THEMES.classic3d.colorDefs[ghostColorId];
    return (
      <div
        style={{ width: cellSize, height: cellSize }}
        className={`block-3d-ghost bg-gradient-to-br ${colorDef.gradient} ${
          isProjectedClear ? 'opacity-85 ring-2 ring-white scale-100' : 'opacity-50 scale-95'
        } border-2 border-amber-300/60 animate-pulse`}
      />
    );
  }

  // Active 3D placed block
  if (colorId) {
    const colorDef = theme.colorDefs[colorId] || THEMES.classic3d.colorDefs[colorId];
    const shadowColor = colorDef.shadowColor || 'rgba(0,0,0,0.5)';

    if (isClearing) {
      return (
        <div
          style={{ width: cellSize, height: cellSize }}
          className={`rounded-md ${
            isWood ? 'bg-amber-100 shadow-xl shadow-amber-400/80 border-2 border-amber-200' : 'bg-white shadow-xl shadow-white/90 border-2 border-white'
          } scale-110 transition-transform duration-200 z-10`}
        />
      );
    }

    // Carved Wood Block
    if (isWood) {
      return (
        <div
          style={{
            width: cellSize,
            height: cellSize,
            ['--block-3d-shadow' as string]: shadowColor,
          }}
          className={`block-wood-3d bg-gradient-to-br ${colorDef.gradient} ${colorDef.border} border relative overflow-hidden transition-all duration-150`}
        >
          {/* Natural wood grain striations */}
          <div className="wood-grain-texture" />

          {/* Carved top chamfer cushion */}
          <div className="block-wood-face" />

          {/* Sanded wood highlight on top-left edge */}
          <div className="absolute top-0.5 left-0.5 w-1.5 h-1.5 rounded-full bg-amber-100/40 pointer-events-none" />

          {/* Deep dark timber bottom edge */}
          <div
            className="absolute inset-x-0 bottom-0 h-1.5 rounded-b-md pointer-events-none opacity-60 mix-blend-multiply"
            style={{ backgroundColor: shadowColor }}
          />
        </div>
      );
    }

    // Standard 3D Toy/Jewel Block
    return (
      <div
        style={{
          width: cellSize,
          height: cellSize,
          ['--block-3d-shadow' as string]: shadowColor,
        }}
        className={`block-3d bg-gradient-to-br ${colorDef.gradient} ${colorDef.border} border relative overflow-hidden transition-all duration-150`}
      >
        {/* 3D Toy Block Raised Cushion / Beveled Cap */}
        <div className="block-3d-face" />

        {/* Top-left specular gleam point */}
        <div className="absolute top-1 left-1 w-2 h-2 rounded-full bg-white/50 blur-[0.4px] pointer-events-none" />

        {/* Bottom edge shadow accent */}
        <div
          className="absolute inset-x-0 bottom-0 h-1.5 rounded-b-md pointer-events-none opacity-40 mix-blend-multiply"
          style={{ backgroundColor: shadowColor }}
        />
      </div>
    );
  }

  return null;
};
