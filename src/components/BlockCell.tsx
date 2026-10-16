import React from 'react';
import { ColorId, ThemeDef } from '../types/game';
import { THEMES } from '../utils/themes';

interface BlockCellProps {
  colorId: ColorId | null;
  isGhost?: boolean;
  ghostColorId?: ColorId;
  isClearing?: boolean;
  cellSize: number;
  theme?: ThemeDef;
}

export const BlockCell: React.FC<BlockCellProps> = ({
  colorId,
  isGhost = false,
  ghostColorId,
  isClearing = false,
  cellSize,
  theme = THEMES.classic3d,
}) => {
  // Empty socket indented into board
  if (!colorId && !isGhost) {
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
        className={`block-3d-ghost bg-gradient-to-br ${colorDef.gradient} opacity-50 border-2 border-white/70 scale-95 animate-pulse`}
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
          className="rounded-md bg-white shadow-xl shadow-white/90 scale-110 transition-transform duration-200 z-10 border-2 border-white"
        />
      );
    }

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
