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
  // Empty socket indented into board
  if (!colorId && !isGhost) {
    return (
      <div
        style={{ width: cellSize, height: cellSize }}
        className={`rounded-md ${
          isProjectedClear
            ? 'bg-white/15 border-white/40 ring-1 ring-white/30'
            : `${theme.socketBg} ${theme.socketBorder} border`
        } grid-socket-3d transition-all duration-150 relative flex items-center justify-center`}
      >
        <div
          className={`w-1.5 h-1.5 rounded-full ${
            isProjectedClear ? 'bg-white/80 animate-ping' : theme.socketDot
          } pointer-events-none transition-colors duration-200 opacity-60`}
        />
      </div>
    );
  }

  // Ghost preview cell (when dragging or hovering over a valid placement)
  if (isGhost && ghostColorId) {
    const colorDef = theme.colorDefs[ghostColorId] || THEMES.classic3d.colorDefs[ghostColorId];
    const shadowColor = colorDef.shadowColor || 'rgba(0,0,0,0.5)';

    return (
      <div
        style={{
          width: cellSize,
          height: cellSize,
          ['--block-3d-shadow' as string]: shadowColor,
        }}
        className={`block-3d-ghost bg-gradient-to-br ${colorDef.gradient} relative overflow-hidden transition-all duration-150 ${
          isProjectedClear
            ? 'opacity-90 scale-100 ring-2 ring-white shadow-[0_0_18px_rgba(255,255,255,0.85)] brightness-125 border-2 border-white'
            : 'opacity-70 scale-95 border-2 border-white/80 shadow-[0_0_10px_rgba(255,255,255,0.35)]'
        }`}
      >
        {/* Ghost 3D Bevel Overlay */}
        <div className="block-3d-face opacity-80" />

        {/* Top-left specular dot */}
        <div className="absolute top-1 left-1 w-1.5 h-1.5 rounded-full bg-white/80 blur-[0.3px] pointer-events-none" />

        {/* Projected clear pulse energy */}
        {isProjectedClear ? (
          <div className="absolute inset-0 bg-white/25 animate-pulse pointer-events-none" />
        ) : (
          <div className="absolute inset-0 bg-white/10 animate-pulse pointer-events-none" />
        )}
      </div>
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
        className={`block-3d bg-gradient-to-br ${colorDef.gradient} ${colorDef.border} border relative overflow-hidden transition-all duration-150 ${
          isProjectedClear
            ? 'ring-2 ring-white/90 brightness-130 shadow-[0_0_14px_rgba(255,255,255,0.7)] scale-98'
            : ''
        }`}
      >
        {/* 3D Toy Block Raised Cushion / Beveled Cap */}
        <div className="block-3d-face" />

        {/* Top-left specular gleam point */}
        <div className="absolute top-1 left-1 w-2 h-2 rounded-full bg-white/50 blur-[0.4px] pointer-events-none" />

        {/* Projected clear line shine */}
        {isProjectedClear && (
          <div className="absolute inset-0 bg-white/20 animate-pulse pointer-events-none" />
        )}

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
