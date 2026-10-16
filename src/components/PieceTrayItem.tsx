import React from 'react';
import { ColorDef, PlacedPiece } from '../types/game';

interface PieceTrayItemProps {
  piece: PlacedPiece;
  canFit: boolean;
  colorDef?: ColorDef;
  isSelected?: boolean;
  isDragging?: boolean;
  onPointerDown: (e: React.PointerEvent<HTMLDivElement>, piece: PlacedPiece) => void;
  onClick?: (piece: PlacedPiece) => void;
}

export const PieceTrayItem: React.FC<PieceTrayItemProps> = ({
  piece,
  canFit,
  colorDef,
  isSelected = false,
  isDragging = false,
  onPointerDown,
  onClick,
}) => {
  if (piece.isUsed) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[66px] sm:min-h-[76px] opacity-10 pointer-events-none" />
    );
  }

  const activeColor = colorDef || piece.color;
  const shadowColor = activeColor.shadowColor || 'rgba(0,0,0,0.45)';
  const { matrix } = piece.shape;
  const rows = matrix.length;
  const cols = matrix[0].length;
  const cellSize = 21; // Clear and prominent tray preview size

  return (
    <div
      onPointerDown={(e) => onPointerDown(e, piece)}
      onClick={() => onClick && onClick(piece)}
      role="button"
      tabIndex={0}
      aria-label={`${piece.shape.name} ${!canFit ? '(Tidak muat di papan)' : ''}`}
      className={`flex-1 flex flex-col items-center justify-center p-0.5 sm:p-1 rounded-xl min-h-[66px] sm:min-h-[76px] transition-all duration-200 cursor-grab active:cursor-grabbing touch-none select-none relative group ${
        isDragging
          ? 'opacity-20 scale-95'
          : canFit
          ? 'hover:bg-white/10 hover:scale-105 active:scale-95'
          : 'opacity-40 saturate-50'
      } ${
        isSelected ? 'ring-2 ring-amber-400 bg-amber-500/15 shadow-md shadow-amber-500/10' : ''
      }`}
    >
      <div
        className="grid gap-1 transition-transform"
        style={{
          gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
        }}
      >
        {matrix.map((row, r) =>
          row.map((cell, c) => {
            if (cell === 0) {
              return <div key={`${r}-${c}`} style={{ width: cellSize, height: cellSize }} />;
            }

            return (
              <div
                key={`${r}-${c}`}
                style={{
                  width: cellSize,
                  height: cellSize,
                  ['--block-3d-shadow' as string]: shadowColor,
                }}
                className={`rounded-md bg-gradient-to-br ${activeColor.gradient} ${activeColor.border} border block-3d-tray relative overflow-hidden`}
              >
                <div className="block-3d-face" />
                <div className="absolute top-0.5 left-0.5 w-1 h-1 rounded-full bg-white/60 pointer-events-none" />
              </div>
            );
          })
        )}
      </div>

      {!canFit && (
        <span className="text-[9px] font-bold text-rose-300 bg-rose-950/60 border border-rose-800/80 px-1 py-0.2 rounded-full mt-1 uppercase tracking-wider leading-none">
          Penuh
        </span>
      )}
    </div>
  );
};
