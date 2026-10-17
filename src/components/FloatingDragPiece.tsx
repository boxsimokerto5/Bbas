import React from 'react';
import { ColorDef, PlacedPiece } from '../types/game';
import { THEMES } from '../utils/themes';

interface FloatingDragPieceProps {
  piece: PlacedPiece;
  x: number;
  y: number;
  cellSize: number;
  colorDef?: ColorDef;
  isWood?: boolean;
}

export const FloatingDragPiece: React.FC<FloatingDragPieceProps> = ({
  piece,
  x,
  y,
  cellSize,
  colorDef,
  isWood = false,
}) => {
  const activeColor =
    colorDef ||
    piece.color ||
    (isWood ? THEMES.wood.colorDefs.amber : THEMES.classic3d.colorDefs.amber);
  const shadowColor = activeColor.shadowColor || (isWood ? '#2c1509' : 'rgba(0,0,0,0.5)');
  const { matrix } = piece.shape;
  const rows = matrix.length;
  const cols = matrix[0].length;

  const totalWidth = cols * cellSize + (cols - 1) * 4;
  const totalHeight = rows * cellSize + (rows - 1) * 4;

  return (
    <div
      className="pointer-events-none fixed z-50 transition-none will-change-transform filter drop-shadow-2xl"
      style={{
        left: x - totalWidth / 2,
        top: y - totalHeight / 2,
      }}
    >
      {/* Motion Speed Trails underneath piece */}
      <div
        className={`absolute -top-6 inset-x-2 h-7 bg-gradient-to-t ${
          isWood ? 'from-amber-400/25' : 'from-white/20'
        } to-transparent blur-[1px] rounded-t-lg -z-10`}
      />

      <div
        className="grid gap-1 scale-105"
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

            if (isWood) {
              return (
                <div
                  key={`${r}-${c}`}
                  style={
                    {
                      width: cellSize,
                      height: cellSize,
                      '--block-3d-shadow': shadowColor,
                    } as React.CSSProperties
                  }
                  className={`block-wood-3d bg-gradient-to-br ${activeColor.gradient} ${activeColor.border} border-2 relative overflow-hidden`}
                >
                  <div className="wood-grain-texture" />
                  <div className="block-wood-face" />
                  <div className="absolute top-1 left-1 w-2 h-2 rounded-full bg-amber-100/40 pointer-events-none" />
                </div>
              );
            }

            return (
              <div
                key={`${r}-${c}`}
                style={
                  {
                    width: cellSize,
                    height: cellSize,
                    '--block-3d-shadow': shadowColor,
                  } as React.CSSProperties
                }
                className={`block-3d bg-gradient-to-br ${activeColor.gradient} ${activeColor.border} border-2 relative overflow-hidden`}
              >
                <div className="block-3d-face" />
                <div className="absolute top-1 left-1 w-2 h-2 rounded-full bg-white/60 blur-[0.4px] pointer-events-none" />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
