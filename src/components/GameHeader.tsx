import React from 'react';
import { Volume2, VolumeX, RotateCcw, HelpCircle, Trophy, Zap, Palette, Crown, Music } from 'lucide-react';
import { ThemeDef } from '../types/game';
import { THEMES } from '../utils/themes';

interface GameHeaderProps {
  score: number;
  highScore: number;
  comboStreak: number;
  isMuted?: boolean;
  isSfxMuted?: boolean;
  isBgmMuted?: boolean;
  theme?: ThemeDef;
  onToggleMute?: () => void;
  onToggleSfxMute?: () => void;
  onToggleBgmMute?: () => void;
  onRestart: () => void;
  onOpenHelp: () => void;
  onOpenTheme: () => void;
  onOpenAchievements?: () => void;
  unclaimedAchievementsCount?: number;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  score,
  highScore,
  comboStreak,
  isMuted = false,
  isSfxMuted,
  isBgmMuted = false,
  theme = THEMES.classic3d,
  onToggleMute,
  onToggleSfxMute,
  onToggleBgmMute,
  onRestart,
  onOpenHelp,
  onOpenTheme,
  onOpenAchievements,
  unclaimedAchievementsCount = 0,
}) => {
  const isLight = theme.isLight;
  const isClassic3D = theme.id === 'classic3d';
  const effectiveSfxMuted = isSfxMuted !== undefined ? isSfxMuted : isMuted;
  const handleToggleSfx = onToggleSfxMute || onToggleMute || (() => {});

  const btnClass = isLight
    ? 'w-6.5 h-6.5 sm:w-7 sm:h-7 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors flex items-center justify-center cursor-pointer shadow-sm active:scale-95 flex-shrink-0'
    : isClassic3D
    ? 'w-6.5 h-6.5 sm:w-7 sm:h-7 rounded-lg bg-blue-950/60 border border-blue-400/30 text-blue-100 hover:text-white hover:bg-blue-900/80 transition-colors flex items-center justify-center cursor-pointer shadow-sm backdrop-blur-sm active:scale-95 flex-shrink-0'
    : 'w-6.5 h-6.5 sm:w-7 sm:h-7 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors flex items-center justify-center cursor-pointer active:scale-95 flex-shrink-0';

  return (
    <header className="w-full max-w-md mx-auto flex flex-col gap-1 px-1.5 pt-0.5 pb-0.5 select-none flex-shrink-0">
      {/* Top action row */}
      <div className="flex items-center justify-between gap-1.5">
        {/* Brand: Single line, compact */}
        <div className="flex items-center gap-1.5 min-w-0 flex-shrink-0">
          <div
            className="w-5 h-5 rounded-md flex items-center justify-center shadow-md border border-white/30 transition-all duration-300 flex-shrink-0"
            style={{
              background: `linear-gradient(135deg, ${theme.previewColors[0]}, ${theme.previewColors[1] || theme.previewColors[0]}, ${theme.previewColors[2] || theme.previewColors[0]})`,
              boxShadow: `0 2px 6px ${theme.previewColors[0]}50`,
            }}
          >
            <div className="w-2.5 h-2.5 rounded-sm bg-white/95 shadow-sm" />
          </div>
          <span
            className={`font-display font-black text-xs sm:text-sm tracking-tight leading-none whitespace-nowrap uppercase ${
              isLight
                ? 'text-slate-900'
                : 'text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]'
            }`}
          >
            mini blockblast
          </span>
        </div>

        {/* Header action buttons */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {onOpenAchievements && (
            <button
              onClick={onOpenAchievements}
              title="Ruang Prestasi & Rekor"
              aria-label="Buka prestasi dan rekor"
              className={`relative ${btnClass}`}
            >
              <Trophy size={13.5} className={unclaimedAchievementsCount > 0 ? 'text-amber-400' : ''} />
              {unclaimedAchievementsCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-slate-900 animate-pulse" />
              )}
            </button>
          )}

          <button
            onClick={onOpenTheme}
            title="Ganti Tema Warna"
            aria-label="Pilih tema warna"
            className={btnClass}
          >
            <Palette size={13.5} />
          </button>

          <button
            onClick={onOpenHelp}
            title="Cara Bermain & Pengaturan"
            aria-label="Petunjuk bermain dan pengaturan suara"
            className={btnClass}
          >
            <HelpCircle size={13.5} />
          </button>

          {/* Independent BGM Music Toggle */}
          {onToggleBgmMute && (
            <button
              onClick={onToggleBgmMute}
              title={isBgmMuted ? 'Nyalakan Musik Latar (BGM)' : 'Matikan Musik Latar (BGM)'}
              aria-label={isBgmMuted ? 'Nyalakan Musik Latar' : 'Matikan Musik Latar'}
              className={`${btnClass} relative ${
                !isBgmMuted
                  ? isLight
                    ? 'text-indigo-600 bg-indigo-50 border-indigo-300 shadow-sm'
                    : 'text-emerald-300 bg-emerald-950/60 border-emerald-400/40 shadow-[0_0_8px_rgba(16,185,129,0.3)]'
                  : 'opacity-50'
              }`}
            >
              <Music size={13.5} className={!isBgmMuted ? 'animate-pulse' : ''} />
              {isBgmMuted && (
                <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-3.5 h-0.5 bg-rose-500 rotate-45 rounded-full" />
                </span>
              )}
            </button>
          )}

          {/* Independent SFX Sound Effects Toggle */}
          <button
            onClick={handleToggleSfx}
            title={effectiveSfxMuted ? 'Nyalakan Efek Suara (SFX)' : 'Matikan Efek Suara (SFX)'}
            aria-label={effectiveSfxMuted ? 'Nyalakan Efek Suara' : 'Matikan Efek Suara'}
            className={`${btnClass} ${effectiveSfxMuted ? 'opacity-50' : ''}`}
          >
            {effectiveSfxMuted ? <VolumeX size={13.5} /> : <Volume2 size={13.5} />}
          </button>

          <button
            onClick={onRestart}
            title="Mulai Ulang"
            aria-label="Mulai ulang game"
            className={btnClass}
          >
            <RotateCcw size={13.5} />
          </button>
        </div>
      </div>

      {/* Score and High Score Display Cards */}
      <div className="grid grid-cols-2 gap-2">
        {/* Current Score */}
        <div
          className={`rounded-xl ${theme.boardBg} ${theme.boardBorder} border px-3 py-1 sm:py-1.5 flex items-center justify-between relative overflow-hidden transition-colors duration-300 ${
            isLight ? 'shadow-sm shadow-slate-200' : 'shadow-md'
          }`}
        >
          <div className="flex flex-col">
            <span
              className={`text-[10px] font-bold uppercase tracking-wider leading-none mb-0.5 ${
                isLight ? 'text-slate-500' : 'text-slate-400'
              }`}
            >
              Skor
            </span>
            <span
              className={`font-display text-xl sm:text-2xl font-black tracking-tight tabular-nums leading-none ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}
            >
              {score.toLocaleString()}
            </span>
          </div>
          {comboStreak > 1 && (
            <div className="flex items-center gap-0.5 text-[10px] font-black text-amber-300 bg-amber-500/25 border border-amber-400/40 px-1.5 py-0.5 rounded-full animate-bounce shadow-sm">
              <Zap size={10} className="fill-amber-300 text-amber-300" />
              <span>x{comboStreak}</span>
            </div>
          )}
        </div>

        {/* High Score with Crown Icon */}
        <div
          className={`rounded-xl ${theme.boardBg} ${theme.boardBorder} border px-3 py-1 sm:py-1.5 flex items-center justify-between transition-colors duration-300 ${
            isLight ? 'shadow-sm shadow-slate-200' : 'shadow-md'
          }`}
        >
          <div className="flex flex-col">
            <div
              className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider leading-none mb-0.5 ${
                isLight ? 'text-amber-600' : 'text-amber-300'
              }`}
            >
              <Crown size={11} className="fill-amber-400 text-amber-400 drop-shadow-sm" />
              <span>Terbaik</span>
            </div>
            <span
              className={`font-display text-xl sm:text-2xl font-black tracking-tight tabular-nums leading-none ${
                isLight ? 'text-amber-600' : 'text-amber-300 drop-shadow-[0_2px_4px_rgba(245,158,11,0.3)]'
              }`}
            >
              {highScore.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
