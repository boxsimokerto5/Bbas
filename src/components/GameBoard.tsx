import React from 'react';
import { BoardMatrix, ColorId, PlacedPiece, ThemeDef } from '../types/game';
import { BlockCell } from './BlockCell';
import { BOARD_SIZE, canPlaceShape } from '../utils/shapes';
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

  const shakeClass =
    shakeLevel === 'heavy'
      ? 'animate-shake-heavy'
      : shakeLevel === 'mild'
      ? 'animate-shake-mild'
      : '';

  return (
    <div
      ref={boardRef}
      className={`relative p-2.5 sm:p-3.5 rounded-3xl ${theme.boardBg} ${theme.boardBorder} border backdrop-blur-md transition-all duration-300 select-none touch-none ${shakeClass}`}
      style={{
        boxShadow: theme.boardShadow,
      }}
    >
      <div
        className="grid gap-1 sm:gap-1.5"
        style={{
          gridTemplateColumns: `repeat(${BOARD_SIZE}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${BOARD_SIZE}, ${cellSize}px)`,
        }}
      >
        {board.map((row, r) =>
          row.map((cell, c) => {
            const isGhost = isGhostCell(r, c);
            const isClearing = isClearingCell(r, c);
            const colorId: ColorId | null = cell ? cell.colorId : null;

            return (
              <div
                key={`${r}-${c}`}
                onClick={() => onCellClick && onCellClick(r, c)}
                className="cursor-pointer"
              >
                <BlockCell
                  colorId={colorId}
                  isGhost={isGhost}
                  ghostColorId={activePiece?.shape.colorId}
                  isClearing={isClearing}
                  cellSize={cellSize}
                  theme={theme}
                />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
