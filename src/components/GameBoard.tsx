import React, { useMemo } from 'react';
import { BoardMatrix, ColorId, PlacedPiece, ThemeDef } from '../types/game';
import { BlockCell } from './BlockCell';
import { BOARD_SIZE, canPlaceShape, getProjectedLinesCleared } from '../utils/shapes';
import { THEMES } from '../utils/themes';

interface GameBoardProps {
  board: BoardMatrix;
  cellSize: number;
  activePiece: PlacedPiece | null;
  hoverPos: { r: number; c: number } | null;
  clearingRows: number[];
  clearingCols: number[];
  shakeLevel: 'none' | 'mild' | 'heavy';
  boardRef: React.RefObject<HTMLDivElement | null>;
  theme?: ThemeDef;
  isHammerMode?: boolean;
  onCellClick?: (r: number, c: number) => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  board,
  cellSize,
  activePiece,
  hoverPos,
  clearingRows,
  clearingCols,
  shakeLevel,
  boardRef,
  theme = THEMES.jewel,
  isHammerMode = false,
  onCellClick,
}) => {
  // Determine if a cell is currently part of the ghost preview
  const isGhostCell = (r: number, c: number): boolean => {
    if (!activePiece || !hoverPos) return false;
    const { matrix } = activePiece.shape;
    const rows = matrix.length;
    const cols = matrix[0].length;

    // Check if the shape can actually be placed at hoverPos
    if (!canPlaceShape(board, matrix, hoverPos.r, hoverPos.c)) {
      return false;
    }

    const relR = r - hoverPos.r;
    const relC = c - hoverPos.c;

    if (relR >= 0 && relR < rows && relC >= 0 && relC < cols) {
      return matrix[relR][relC] === 1;
    }

    return false;
  };

  // Determine if cell is clearing in this animation tick
  const isClearingCell = (r: number, c: number): boolean => {
    return clearingRows.includes(r) || clearingCols.includes(c);
  };

  // Real-time projection of which lines will clear if dropped at current hoverPos
  const projectedClears = useMemo(() => {
    if (!activePiece || !hoverPos) return { projectedRows: [], projectedCols: [] };
    return getProjectedLinesCleared(board, activePiece.shape.matrix, hoverPos.r, hoverPos.c);
  }, [board, activePiece, hoverPos]);

  const hasProjectedClears =
    projectedClears.projectedRows.length > 0 || projectedClears.projectedCols.length > 0;

  const shakeClass =
    shakeLevel === 'heavy'
      ? 'animate-shake-heavy'
      : shakeLevel === 'mild'
      ? 'animate-shake-mild'
      : '';

  return (
    <div
      ref={boardRef}
      className={`relative p-2 sm:p-2.5 rounded-2xl sm:rounded-3xl ${theme.boardBg} ${theme.boardBorder} border backdrop-blur-md transition-all duration-300 select-none touch-none ${shakeClass}`}
      style={{
        boxShadow: theme.boardShadow,
      }}
    >
      {/* Drop line clear energy beam indicators */}
      {hasProjectedClears && (
        <div className="pointer-events-none absolute inset-2 sm:inset-2.5 z-10 overflow-hidden rounded-2xl">
          {projectedClears.projectedRows.map((r) => (
            <div
              key={`proj-row-${r}`}
              className="absolute inset-x-0 h-[12%] bg-gradient-to-r from-transparent via-white/20 to-transparent blur-[1px] animate-pulse"
              style={{
                top: `${(r / BOARD_SIZE) * 100}%`,
                height: `${(1 / BOARD_SIZE) * 100}%`,
              }}
            />
          ))}
          {projectedClears.projectedCols.map((c) => (
            <div
              key={`proj-col-${c}`}
              className="absolute inset-y-0 w-[12%] bg-gradient-to-b from-transparent via-white/20 to-transparent blur-[1px] animate-pulse"
              style={{
                left: `${(c / BOARD_SIZE) * 100}%`,
                width: `${(1 / BOARD_SIZE) * 100}%`,
              }}
            />
          ))}
        </div>
      )}

      <div
        className="grid gap-1 sm:gap-1.5 relative z-10"
        style={{
          gridTemplateColumns: `repeat(${BOARD_SIZE}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${BOARD_SIZE}, ${cellSize}px)`,
        }}
      >
        {board.map((row, r) =>
          row.map((cell, c) => {
            const isGhost = isGhostCell(r, c);
            const isClearing = isClearingCell(r, c);
            const isProjectedClear =
              projectedClears.projectedRows.includes(r) || projectedClears.projectedCols.includes(c);
            const colorId: ColorId | null = cell ? cell.colorId : null;

            return (
              <div
                key={`${r}-${c}`}
                onClick={() => onCellClick && onCellClick(r, c)}
                className={`relative cursor-pointer transition-transform duration-150 ${
                  isHammerMode && cell
                    ? 'hover:scale-105 hover:ring-2 hover:ring-amber-400 hover:ring-offset-1 hover:ring-offset-slate-900 rounded-lg cursor-crosshair z-20'
                    : ''
                }`}
              >
                <BlockCell
                  colorId={colorId}
                  isGhost={isGhost}
                  ghostColorId={activePiece?.shape.colorId}
                  isClearing={isClearing}
                  isProjectedClear={isProjectedClear}
                  cellSize={cellSize}
                  theme={theme}
                />
                {isHammerMode && cell && (
                  <div className="pointer-events-none absolute inset-0 rounded-lg border border-amber-400/50 bg-amber-500/15 animate-pulse" />
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
