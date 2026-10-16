import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  BoardMatrix,
  PlacedPiece,
  FloatingText,
  ThemeId,
  ThemeDef,
} from './types/game';
import {
  BOARD_SIZE,
  createEmptyBoard,
  generatePieceSet,
  canPlaceShape,
  canPlaceShapeAnywhere,
  findFullLines,
  calculateScore,
  hasAnyValidMove,
  getComboMultiplier,
} from './utils/shapes';
import { sound } from './utils/audio';
import { THEMES, DEFAULT_THEME_ID, getTheme } from './utils/themes';
import { GameHeader } from './components/GameHeader';
import { GameBoard } from './components/GameBoard';
import { ComboMeter } from './components/ComboMeter';
import { PieceTrayItem } from './components/PieceTrayItem';
import { FloatingDragPiece } from './components/FloatingDragPiece';
import { GameOverModal } from './components/GameOverModal';
import { InstructionsModal } from './components/InstructionsModal';
import { ThemeModal } from './components/ThemeModal';
import { ParticleCanvas, ParticleCanvasHandle } from './components/ParticleCanvas';

export default function App() {
  // Theme state
  const [activeThemeId, setActiveThemeId] = useState<ThemeId>(() => {
    if (typeof window !== 'undefined') {
      const is3DSet = localStorage.getItem('blockblast_has_seen_3d');
      if (!is3DSet) {
        localStorage.setItem('blockblast_has_seen_3d', 'true');
        localStorage.setItem('blockblast_theme', 'classic3d');
        return 'classic3d';
      }
      const savedTheme = localStorage.getItem('blockblast_theme') as ThemeId;
      if (savedTheme && THEMES[savedTheme]) {
        return savedTheme;
      }
    }
    return DEFAULT_THEME_ID;
  });
  const activeTheme: ThemeDef = getTheme(activeThemeId);
  const [showThemeModal, setShowThemeModal] = useState<boolean>(false);

  // Game state
  const [board, setBoard] = useState<BoardMatrix>(() => createEmptyBoard());
  const [roundNumber, setRoundNumber] = useState<number>(1);
  const [pieces, setPieces] = useState<PlacedPiece[]>(() =>
    generatePieceSet(1, activeTheme.colorDefs)
  );
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('blockblast_highscore');
      return saved ? parseInt(saved, 10) || 0 : 0;
    }
    return 0;
  });
  const [comboStreak, setComboStreak] = useState<number>(0);
  const [maxCombo, setMaxCombo] = useState<number>(0);
  const [linesCleared, setLinesCleared] = useState<number>(0);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isNewHighScore, setIsNewHighScore] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(() => sound.isMuted());
  const [showHelp, setShowHelp] = useState<boolean>(false);

  // FX animations state
  const [clearingRows, setClearingRows] = useState<number[]>([]);
  const [clearingCols, setClearingCols] = useState<number[]>([]);
  const [shakeLevel, setShakeLevel] = useState<'none' | 'mild' | 'heavy'>('none');
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);

  // Dragging & Interaction State
  const [selectedPiece, setSelectedPiece] = useState<PlacedPiece | null>(null);
  const [dragState, setDragState] = useState<{
    piece: PlacedPiece | null;
    clientX: number;
    clientY: number;
    isTouch: boolean;
  }>({
    piece: null,
    clientX: 0,
    clientY: 0,
    isTouch: false,
  });
  const [hoverPos, setHoverPos] = useState<{ r: number; c: number } | null>(null);

  // Responsive board sizing
  const [cellSize, setCellSize] = useState<number>(44);
  const [boardDimensions, setBoardDimensions] = useState<{ width: number; height: number }>({
    width: 380,
    height: 380,
  });

  const boardContainerRef = useRef<HTMLDivElement | null>(null);
  const particleCanvasRef = useRef<ParticleCanvasHandle | null>(null);

  // Theme selection handler
  const handleSelectTheme = useCallback((themeId: ThemeId) => {
    setActiveThemeId(themeId);
    if (typeof window !== 'undefined') {
      localStorage.setItem('blockblast_theme', themeId);
    }
    const newTheme = getTheme(themeId);
    // Update existing pieces to use new theme colors
    setPieces((prevPieces) =>
      prevPieces.map((p) => ({
        ...p,
        color: newTheme.colorDefs[p.shape.colorId] || p.color,
      }))
    );
  }, []);

  // Measure and adjust cell size on window resize
  const updateLayoutDimensions = useCallback(() => {
    if (typeof window === 'undefined') return;
    const vWidth = window.innerWidth;
    const vHeight = window.innerHeight;

    // Available board height considering header, combo meter, tray, and paddings
    const maxBoardWidth = Math.min(vWidth - 32, 430);
    const maxBoardHeight = Math.min(vHeight - 330, 420);
    const availableSize = Math.max(240, Math.min(maxBoardWidth, maxBoardHeight));

    // Cell size calculation: (size - inner paddings - gaps) / 8
    const gapTotal = 7 * 5;
    const paddingTotal = 24;
    const computedCellSize = Math.floor((availableSize - gapTotal - paddingTotal) / BOARD_SIZE);
    const clampedCell = Math.max(26, Math.min(computedCellSize, 46));

    setCellSize(clampedCell);

    // Compute actual total board dimensions
    const totalW = clampedCell * BOARD_SIZE + gapTotal + paddingTotal;
    setBoardDimensions({ width: totalW, height: totalW });
  }, []);

  useEffect(() => {
    updateLayoutDimensions();
    window.addEventListener('resize', updateLayoutDimensions);
    return () => window.removeEventListener('resize', updateLayoutDimensions);
  }, [updateLayoutDimensions]);

  // Restart game
  const handleRestart = useCallback(() => {
    setBoard(createEmptyBoard());
    setRoundNumber(1);
    setPieces(generatePieceSet(1, activeTheme.colorDefs));
    setScore(0);
    setComboStreak(0);
    setMaxCombo(0);
    setLinesCleared(0);
    setIsGameOver(false);
    setIsNewHighScore(false);
    setClearingRows([]);
    setClearingCols([]);
    setSelectedPiece(null);
    setHoverPos(null);
    setDragState({ piece: null, clientX: 0, clientY: 0, isTouch: false });
  }, [activeTheme.colorDefs]);

  // Toggle Mute
  const handleToggleMute = useCallback(() => {
    const nextMuted = sound.toggleMute();
    setIsMuted(nextMuted);
  }, []);

  // Update High Score helper
  const checkUpdateHighScore = useCallback(
    (newScore: number) => {
      if (newScore > highScore) {
        setHighScore(newScore);
        setIsNewHighScore(true);
        if (typeof window !== 'undefined') {
          localStorage.setItem('blockblast_highscore', String(newScore));
        }
      }
    },
    [highScore]
  );

  // Core Piece Placement Logic
  const handlePlacePiece = useCallback(
    (pieceToPlace: PlacedPiece, targetRow: number, targetCol: number) => {
      const { matrix } = pieceToPlace.shape;
      const rows = matrix.length;
      const cols = matrix[0].length;

      if (!canPlaceShape(board, matrix, targetRow, targetCol)) {
        return false;
      }

      // 1. Play place sound
      sound.playPlace();

      // 2. Put piece on new board copy
      let blocksPlaced = 0;
      const nextBoard: BoardMatrix = board.map((r) => [...r]);

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (matrix[r][c] === 1) {
            nextBoard[targetRow + r][targetCol + c] = {
              colorId: pieceToPlace.color.id,
              justPlaced: true,
            };
            blocksPlaced++;
          }
        }
      }

      // Mark piece as used
      const updatedPieces = pieces.map((p) =>
        p.id === pieceToPlace.id ? { ...p, isUsed: true } : p
      );
      setPieces(updatedPieces);
      setSelectedPiece(null);
      setHoverPos(null);

      // 3. Check for line clears
      const { fullRows, fullCols } = findFullLines(nextBoard);
      const linesCount = fullRows.length + fullCols.length;

      if (linesCount > 0) {
        // Line clear occurred!
        const nextCombo = comboStreak + 1;
        setComboStreak(nextCombo);
        if (nextCombo > maxCombo) {
          setMaxCombo(nextCombo);
        }
        setLinesCleared((prev) => prev + linesCount);

        // Calculate score with multiplier
        const { points, multiplier, title, subtext } = calculateScore(blocksPlaced, linesCount, nextCombo);
        const nextScore = score + points;
        setScore(nextScore);
        checkUpdateHighScore(nextScore);

        // Sound & Screen Shake
        sound.playClear(linesCount, nextCombo);
        // Unique sound effect specifically for combo streak increase, distinct from placement sound
        setTimeout(() => {
          sound.playComboStreak(nextCombo);
        }, 80);

        const shake = linesCount >= 3 ? 'heavy' : 'mild';
        setShakeLevel(shake);
        setTimeout(() => setShakeLevel('none'), 300);

        // Trigger cell clearing animations
        setClearingRows(fullRows);
        setClearingCols(fullCols);
        setBoard(nextBoard);

        // Trigger particle bursts for each destroyed block using theme colors
        if (boardContainerRef.current && particleCanvasRef.current) {
          const rect = boardContainerRef.current.getBoundingClientRect();
          const cellStep = (rect.width - 24) / BOARD_SIZE;

          // Collect unique cleared cells
          const clearedSet = new Set<string>();
          fullRows.forEach((r) => {
            for (let c = 0; c < BOARD_SIZE; c++) clearedSet.add(`${r},${c}`);
          });
          fullCols.forEach((c) => {
            for (let r = 0; r < BOARD_SIZE; r++) clearedSet.add(`${r},${c}`);
          });

          clearedSet.forEach((coord) => {
            const [r, c] = coord.split(',').map(Number);
            const cellData = nextBoard[r][c];
            const colorKey = cellData?.colorId || 'amber';
            const colorDef = activeTheme.colorDefs[colorKey] || THEMES.jewel.colorDefs[colorKey];
            const colorHex = colorDef.particleHex;
            const cellCenterX = 12 + c * cellStep + cellStep / 2;
            const cellCenterY = 12 + r * cellStep + cellStep / 2;

            particleCanvasRef.current?.burst(cellCenterX, cellCenterY, colorHex, 8);
          });
        }

        // Add Floating Combo/Blast text
        const floatingId = `float-${Date.now()}`;
        setFloatingTexts((prev) => [
          ...prev,
          {
            id: floatingId,
            text: title,
            subtext,
            points,
            x: 50,
            y: 40,
            comboCount: nextCombo,
            multiplier,
          },
        ]);
        setTimeout(() => {
          setFloatingTexts((prev) => prev.filter((t) => t.id !== floatingId));
        }, 1200);

        // After flash delay, remove blocks from board and check for next turn
        setTimeout(() => {
          setClearingRows([]);
          setClearingCols([]);

          const clearedBoard = nextBoard.map((row, r) =>
            row.map((cell, c) => {
              if (fullRows.includes(r) || fullCols.includes(c)) {
                return null;
              }
              return cell;
            })
          );
          setBoard(clearedBoard);

          // Check if all 3 pieces are used
          evaluateRoundEnd(clearedBoard, updatedPieces);
        }, 220);
      } else {
        // No line clear: reset combo streak
        setComboStreak(0);
        const nextScore = score + blocksPlaced;
        setScore(nextScore);
        checkUpdateHighScore(nextScore);
        setBoard(nextBoard);

        // Check if all 3 pieces used
        evaluateRoundEnd(nextBoard, updatedPieces);
      }

      return true;
    },
    [board, pieces, comboStreak, maxCombo, score, activeTheme, checkUpdateHighScore]
  );

  // Evaluate if round is finished or if it's Game Over
  const evaluateRoundEnd = (currentBoard: BoardMatrix, currentPieces: PlacedPiece[]) => {
    const allUsed = currentPieces.every((p) => p.isUsed);

    if (allUsed) {
      // Deal 3 new pieces with active theme colors
      const nextRound = roundNumber + 1;
      setRoundNumber(nextRound);
      const newPieces = generatePieceSet(nextRound, activeTheme.colorDefs);
      setPieces(newPieces);

      // Check if new pieces have any valid moves
      if (!hasAnyValidMove(currentBoard, newPieces)) {
        triggerGameOver();
      }
    } else {
      // Check remaining pieces
      if (!hasAnyValidMove(currentBoard, currentPieces)) {
        triggerGameOver();
      }
    }
  };

  const triggerGameOver = () => {
    setIsGameOver(true);
    sound.playGameOver();
    if (score > highScore) {
      particleCanvasRef.current?.celebrate();
    }
  };

  // Convert screen coordinates (clientX, clientY) to board grid cell (row, col)
  const calculateSnappedGridPos = useCallback(
    (clientX: number, clientY: number, activePiece: PlacedPiece, isTouch: boolean) => {
      if (!boardContainerRef.current) return null;
      const rect = boardContainerRef.current.getBoundingClientRect();

      // On touch devices, elevate target position so finger doesn't obscure the piece
      const touchOffsetY = isTouch ? 60 : 0;
      const targetX = clientX;
      const targetY = clientY - touchOffsetY;

      // Board padding is 12px sm / 10px xs
      const padding = 12;
      const innerWidth = rect.width - padding * 2;
      const innerHeight = rect.height - padding * 2;

      // Check if within board bounds (with generous margin)
      if (
        targetX < rect.left - 40 ||
        targetX > rect.right + 40 ||
        targetY < rect.top - 40 ||
        targetY > rect.bottom + 40
      ) {
        return null;
      }

      const { matrix } = activePiece.shape;
      const pieceRows = matrix.length;
      const pieceCols = matrix[0].length;

      const cellStepX = innerWidth / BOARD_SIZE;
      const cellStepY = innerHeight / BOARD_SIZE;

      // Calculate the top-left cell coordinate by centering the shape around pointer
      const pieceWidthPx = pieceCols * cellStepX;
      const pieceHeightPx = pieceRows * cellStepY;

      const topLeftX = targetX - pieceWidthPx / 2;
      const topLeftY = targetY - pieceHeightPx / 2;

      const col = Math.round((topLeftX - (rect.left + padding)) / cellStepX);
      const row = Math.round((topLeftY - (rect.top + padding)) / cellStepY);

      // Clamp to valid range
      const clampedR = Math.max(0, Math.min(row, BOARD_SIZE - pieceRows));
      const clampedC = Math.max(0, Math.min(col, BOARD_SIZE - pieceCols));

      return { r: clampedR, c: clampedC };
    },
    []
  );

  // Pointer Down on Tray Item
  const handlePiecePointerDown = (
    e: React.PointerEvent<HTMLDivElement>,
    piece: PlacedPiece
  ) => {
    if (piece.isUsed || isGameOver) return;

    // Check if this piece can fit anywhere
    const canFit = canPlaceShapeAnywhere(board, piece.shape.matrix);
    if (!canFit) return;

    sound.playPick();
    const isTouch = e.pointerType === 'touch';

    setDragState({
      piece,
      clientX: e.clientX,
      clientY: e.clientY,
      isTouch,
    });
    setSelectedPiece(piece);

    const snapped = calculateSnappedGridPos(e.clientX, e.clientY, piece, isTouch);
    setHoverPos(snapped);
  };

  // Global Pointer Move & Up listeners for Drag & Drop
  useEffect(() => {
    if (!dragState.piece) return;

    const handlePointerMove = (e: PointerEvent) => {
      setDragState((prev) => ({
        ...prev,
        clientX: e.clientX,
        clientY: e.clientY,
      }));

      if (dragState.piece) {
        const snapped = calculateSnappedGridPos(
          e.clientX,
          e.clientY,
          dragState.piece,
          dragState.isTouch
        );
        setHoverPos(snapped);
      }
    };

    const handlePointerUp = () => {
      if (dragState.piece && hoverPos) {
        // Attempt placement
        const success = handlePlacePiece(dragState.piece, hoverPos.r, hoverPos.c);
        if (!success) {
          // Deselect on invalid placement
          setSelectedPiece(null);
        }
      } else {
        setSelectedPiece(null);
      }

      setDragState({ piece: null, clientX: 0, clientY: 0, isTouch: false });
      setHoverPos(null);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
  }, [dragState, hoverPos, calculateSnappedGridPos, handlePlacePiece]);

  // Handle cell click on board (for click-to-place accessibility mode)
  const handleCellClick = (r: number, c: number) => {
    if (!selectedPiece || isGameOver) return;
    const { matrix } = selectedPiece.shape;
    const rows = matrix.length;
    const cols = matrix[0].length;

    // Adjust target row/col so clicked cell is top-left
    if (r + rows <= BOARD_SIZE && c + cols <= BOARD_SIZE) {
      if (canPlaceShape(board, matrix, r, c)) {
        handlePlacePiece(selectedPiece, r, c);
      }
    }
  };

  return (
    <div
      className={`min-h-screen w-full ${activeTheme.bgClass} ${
        activeTheme.isLight ? 'text-slate-900' : 'text-slate-100'
      } flex flex-col items-center justify-between py-2 px-3 relative overflow-hidden select-none touch-none transition-colors duration-500`}
    >
      {/* Background ambient lighting */}
      <div
        className={`pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[500px] h-[350px] bg-gradient-to-b ${activeTheme.ambientTop} blur-3xl rounded-full transition-all duration-500`}
      />
      <div
        className={`pointer-events-none absolute -bottom-40 left-1/2 -translate-x-1/2 w-[500px] h-[350px] bg-gradient-to-t ${activeTheme.ambientBottom} blur-3xl rounded-full transition-all duration-500`}
      />

      {/* Top Header */}
      <GameHeader
        score={score}
        highScore={highScore}
        comboStreak={comboStreak}
        isMuted={isMuted}
        theme={activeTheme}
        onToggleMute={handleToggleMute}
        onRestart={handleRestart}
        onOpenHelp={() => setShowHelp(true)}
        onOpenTheme={() => setShowThemeModal(true)}
      />

      {/* Main Play Area */}
      <main className="w-full flex-1 flex flex-col items-center justify-center my-auto relative gap-2 sm:gap-2.5">
        {/* Visual Combo Meter UI Element near the board */}
        <ComboMeter
          comboStreak={comboStreak}
          multiplier={getComboMultiplier(comboStreak)}
          maxCombo={maxCombo}
          theme={activeTheme}
          width={boardDimensions.width}
        />

        <div className="relative flex items-center justify-center">
          {/* 60fps Particle Canvas Overlay */}
          <ParticleCanvas
            ref={particleCanvasRef}
            width={boardDimensions.width}
            height={boardDimensions.height}
          />

          {/* 8x8 Game Board */}
          <GameBoard
            board={board}
            cellSize={cellSize}
            activePiece={dragState.piece || selectedPiece}
            hoverPos={hoverPos}
            clearingRows={clearingRows}
            clearingCols={clearingCols}
            shakeLevel={shakeLevel}
            boardRef={boardContainerRef}
            theme={activeTheme}
            onCellClick={handleCellClick}
          />

          {/* Floating Combo / Blast Feedback Popup */}
          {floatingTexts.map((ft) => (
            <div
              key={ft.id}
              className="pointer-events-none absolute z-40 flex flex-col items-center justify-center animate-out fade-out zoom-out-95 fill-mode-forwards duration-1200 scale-110"
              style={{
                top: `${ft.y}%`,
                left: `${ft.x}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              {ft.comboCount > 1 ? (
                <>
                  <div className="flex items-baseline gap-1.5 filter drop-shadow-xl">
                    <span className="font-display font-black text-2xl sm:text-3xl text-white drop-shadow-[0_3px_0_#0f2b6b] italic tracking-tight">
                      Combo
                    </span>
                    <span className="font-display font-black text-4xl sm:text-5xl text-pink-300 drop-shadow-[0_4px_0_#9d174d] tracking-tight ml-0.5 animate-pulse">
                      {ft.comboCount}
                    </span>
                    {ft.multiplier && ft.multiplier > 1.0 && (
                      <span className="font-display font-black text-xl sm:text-2xl text-amber-300 drop-shadow-[0_2px_0_#78350f] tracking-tight ml-1 px-1.5 py-0.5 rounded-md bg-amber-500/25 border border-amber-400/40">
                        {ft.multiplier.toFixed(1)}x
                      </span>
                    )}
                  </div>
                  {ft.text && (
                    <span className="font-display font-black text-xs sm:text-sm text-amber-300 drop-shadow-[0_2px_0_#78350f] uppercase tracking-wider mt-0.5">
                      {ft.text} (+{ft.points})
                    </span>
                  )}
                </>
              ) : (
                <>
                  <span className="font-display font-black text-2xl sm:text-3xl text-amber-300 drop-shadow-[0_3px_0_#78350f] tracking-wider">
                    {ft.text}
                  </span>
                  {ft.points > 0 && (
                    <span className="font-bold text-xs sm:text-sm text-white drop-shadow-md">
                      +{ft.points}
                    </span>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </main>

      {/* Bottom Piece Tray */}
      <footer className="w-full max-w-md mx-auto pb-2 px-1">
        <div
          className={`w-full ${activeTheme.trayBg} ${activeTheme.trayBorder} border rounded-3xl p-2.5 sm:p-3 flex items-center justify-around gap-2 transition-colors duration-300 ${
            activeTheme.isLight ? 'shadow-lg shadow-slate-200/70' : 'shadow-xl'
          }`}
        >
          {pieces.map((piece) => {
            const canFit = !piece.isUsed && canPlaceShapeAnywhere(board, piece.shape.matrix);
            const isDraggingThis = dragState.piece?.id === piece.id;
            const isSelectedThis = selectedPiece?.id === piece.id;
            const pieceColor =
              activeTheme.colorDefs[piece.shape.colorId] || THEMES.jewel.colorDefs[piece.shape.colorId];

            return (
              <PieceTrayItem
                key={piece.id}
                piece={piece}
                canFit={canFit}
                colorDef={pieceColor}
                isDragging={isDraggingThis}
                isSelected={isSelectedThis}
                onPointerDown={handlePiecePointerDown}
                onClick={(p) => {
                  if (canFit && !p.isUsed) {
                    setSelectedPiece(isSelectedThis ? null : p);
                  }
                }}
              />
            );
          })}
        </div>
        <p
          className={`text-center text-[11px] font-medium mt-2 ${
            activeTheme.isLight ? 'text-slate-500' : 'text-slate-500'
          }`}
        >
          Tarik balok ke kisi 8x8 atau ketuk untuk memilih · 100% Offline
        </p>
      </footer>

      {/* Floating Drag Clone that follows pointer */}
      {dragState.piece && (
        <FloatingDragPiece
          piece={dragState.piece}
          colorDef={
            activeTheme.colorDefs[dragState.piece.shape.colorId] ||
            THEMES.jewel.colorDefs[dragState.piece.shape.colorId]
          }
          x={dragState.clientX}
          y={dragState.clientY - (dragState.isTouch ? 60 : 0)}
          cellSize={cellSize}
        />
      )}

      {/* Game Over Modal */}
      {isGameOver && (
        <GameOverModal
          score={score}
          highScore={highScore}
          isNewHighScore={isNewHighScore}
          maxCombo={maxCombo}
          linesCleared={linesCleared}
          onPlayAgain={handleRestart}
        />
      )}

      {/* Instructions Modal */}
      <InstructionsModal isOpen={showHelp} onClose={() => setShowHelp(false)} />

      {/* Theme Customization Modal */}
      <ThemeModal
        isOpen={showThemeModal}
        activeThemeId={activeThemeId}
        onSelectTheme={handleSelectTheme}
        onClose={() => setShowThemeModal(false)}
      />
    </div>
  );
}
