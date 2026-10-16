import React from 'react';
import { Hammer, RotateCw, Shuffle, X, Sparkles } from 'lucide-react';
import { BoostersInventory, ThemeDef } from '../types/game';

interface BoosterBarProps {
  inventory: BoostersInventory;
  isHammerMode: boolean;
  theme: ThemeDef;
  onToggleHammer: () => void;
  onUseRotate: () => void;
  onUseReroll: () => void;
  onOpenAchievements: () => void;
  unclaimedAchievementsCount: number;
}

export const BoosterBar: React.FC<BoosterBarProps> = ({
  inventory,
  isHammerMode,
  theme,
  onToggleHammer,
  onUseRotate,
  onUseReroll,
  onOpenAchievements,
  unclaimedAchievementsCount,
}) => {
  const isLight = theme.isLight;

  return (
    <div className="w-full max-w-md mx-auto px-2 select-none">
      {/* Hammer Mode Alert Banner */}
      {isHammerMode && (
        <div className="mb-2 p-2 rounded-xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-between gap-2 animate-pulse shadow-md">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
            <Hammer size={16} className="text-amber-400 animate-bounce" />
            <span>Mode Palu Aktif: Ketuk kotak berisi balok di papan!</span>
          </div>
          <button
            onClick={onToggleHammer}
            className="px-2 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
          >
            <X size={13} />
            <span>Batal</span>
          </button>
        </div>
      )}

      {/* Boosters Row */}
      <div
        className={`w-full py-1.5 px-3 rounded-2xl ${theme.boardBg} ${theme.boardBorder} border flex items-center justify-between gap-2 backdrop-blur-sm transition-all duration-300 ${
          isLight ? 'shadow-sm shadow-slate-200' : 'shadow-md'
        }`}
      >
        <span
          className={`text-[11px] font-bold uppercase tracking-wider ${
            isLight ? 'text-slate-500' : 'text-slate-400'
          }`}
        >
          Booster
        </span>

        <div className="flex items-center gap-2">
          {/* 1. Hammer Booster */}
          <button
            onClick={onToggleHammer}
            disabled={inventory.hammer <= 0 && !isHammerMode}
            title={
              inventory.hammer > 0
                ? 'Palu: Hancurkan 1 balok yang menghalangi'
                : 'Palu habis (Raih kombo untuk dapat lagi)'
            }
            className={`relative px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              isHammerMode
                ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-300 shadow-lg shadow-amber-500/30'
                : inventory.hammer > 0
                ? isLight
                  ? 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm active:scale-95'
                  : 'bg-slate-800/80 border border-slate-700/80 text-amber-300 hover:bg-slate-800 hover:border-amber-400/50 active:scale-95'
                : 'opacity-40 cursor-not-allowed bg-slate-800/30 border border-slate-800 text-slate-500'
            }`}
          >
            <Hammer size={14} className={isHammerMode ? 'fill-slate-950' : 'text-amber-400'} />
            <span>Palu</span>
            <span
              className={`text-[10px] font-black px-1.5 py-0.2 rounded-full ${
                isHammerMode
                  ? 'bg-slate-950 text-amber-300'
                  : 'bg-amber-500/20 text-amber-400'
              }`}
            >
              {inventory.hammer}
            </span>
          </button>

          {/* 2. Rotate Booster */}
          <button
            onClick={onUseRotate}
            disabled={inventory.rotate <= 0}
            title={
              inventory.rotate > 0
                ? 'Putar: Putar orientasi balok di nampan 90 derajat'
                : 'Putar habis'
            }
            className={`relative px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              inventory.rotate > 0
                ? isLight
                  ? 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm active:scale-95'
                  : 'bg-slate-800/80 border border-slate-700/80 text-cyan-300 hover:bg-slate-800 hover:border-cyan-400/50 active:scale-95'
                : 'opacity-40 cursor-not-allowed bg-slate-800/30 border border-slate-800 text-slate-500'
            }`}
          >
            <RotateCw size={14} className="text-cyan-400" />
            <span>Putar</span>
            <span
              className={`text-[10px] font-black px-1.5 py-0.2 rounded-full ${
                inventory.rotate > 0
                  ? 'bg-cyan-500/20 text-cyan-400'
                  : 'bg-slate-800 text-slate-500'
              }`}
            >
              {inventory.rotate}
            </span>
          </button>

          {/* 3. Reroll Booster */}
          <button
            onClick={onUseReroll}
            disabled={inventory.reroll <= 0}
            title={
              inventory.reroll > 0
                ? 'Acak: Ganti 3 balok di nampan dengan bentuk baru'
                : 'Acak habis'
            }
            className={`relative px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              inventory.reroll > 0
                ? isLight
                  ? 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm active:scale-95'
                  : 'bg-slate-800/80 border border-slate-700/80 text-emerald-300 hover:bg-slate-800 hover:border-emerald-400/50 active:scale-95'
                : 'opacity-40 cursor-not-allowed bg-slate-800/30 border border-slate-800 text-slate-500'
            }`}
          >
            <Shuffle size={14} className="text-emerald-400" />
            <span>Acak</span>
            <span
              className={`text-[10px] font-black px-1.5 py-0.2 rounded-full ${
                inventory.reroll > 0
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'bg-slate-800 text-slate-500'
              }`}
            >
              {inventory.reroll}
            </span>
          </button>
        </div>

        {/* Quick link to Achievements for free booster gifts */}
        <button
          onClick={onOpenAchievements}
          title="Hadiah Booster dari Prestasi"
          className="relative text-slate-400 hover:text-amber-400 p-1 rounded-lg hover:bg-slate-800/40 transition-colors cursor-pointer"
        >
          <Sparkles size={16} />
          {unclaimedAchievementsCount > 0 && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
          )}
        </button>
      </div>
    </div>
  );
};
