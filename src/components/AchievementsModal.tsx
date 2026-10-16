import React, { useState } from 'react';
import { X, Trophy, BarChart2, CheckCircle2, Gift, Hammer, RotateCw, Shuffle, Smartphone, Vibrate } from 'lucide-react';
import { Achievement, BoosterType, PlayerStats, ThemeDef } from '../types/game';
import { haptics } from '../utils/haptics';

interface AchievementsModalProps {
  isOpen: boolean;
  achievements: Achievement[];
  stats: PlayerStats;
  theme: ThemeDef;
  onClose: () => void;
  onClaimReward: (achievementId: string, rewardType: BoosterType, count: number) => void;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
  isOpen,
  achievements,
  stats,
  theme,
  onClose,
  onClaimReward,
}) => {
  const [activeTab, setActiveTab] = useState<'achievements' | 'stats'>('achievements');
  const [isHapticsOn, setIsHapticsOn] = useState<boolean>(() => haptics.isEnabled());

  if (!isOpen) return null;

  const handleToggleHaptics = () => {
    const next = haptics.toggle();
    setIsHapticsOn(next);
    if (next) haptics.light();
  };

  const getBoosterIcon = (type: BoosterType) => {
    switch (type) {
      case 'hammer':
        return <Hammer size={12} className="text-amber-400" />;
      case 'rotate':
        return <RotateCw size={12} className="text-cyan-400" />;
      case 'reroll':
        return <Shuffle size={12} className="text-emerald-400" />;
    }
  };

  const getBoosterName = (type: BoosterType) => {
    switch (type) {
      case 'hammer':
        return 'Palu';
      case 'rotate':
        return 'Putar';
      case 'reroll':
        return 'Acak';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150 select-none">
      <div className="w-full max-w-md max-h-[90vh] rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-5 flex flex-col relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Trophy size={18} />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-white tracking-tight leading-tight">
                Ruang Prestasi & Rekor
              </h3>
              <p className="text-[11px] text-slate-400">Pencapaian offline & data statistik</p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Tutup modal prestasi"
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950/70 border border-slate-800/80 rounded-xl my-3">
          <button
            onClick={() => setActiveTab('achievements')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'achievements'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Trophy size={14} />
            <span>Daftar Prestasi</span>
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'stats'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BarChart2 size={14} />
            <span>Statistik Pemain</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 max-h-[52vh]">
          {activeTab === 'achievements' ? (
            achievements.map((ach) => {
              const isComplete = ach.current >= ach.target;
              const progressPct = Math.min(100, Math.round((ach.current / ach.target) * 100));

              return (
                <div
                  key={ach.id}
                  className={`p-3 rounded-2xl border transition-all ${
                    ach.claimed
                      ? 'bg-slate-950/40 border-slate-800/60 opacity-80'
                      : isComplete
                      ? 'bg-amber-500/10 border-amber-500/40 shadow-sm'
                      : 'bg-slate-950/70 border-slate-800/80'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white">{ach.title}</span>
                        {ach.claimed ? (
                          <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/15 px-1.5 py-0.2 rounded-full flex items-center gap-1">
                            <CheckCircle2 size={10} />
                            <span>Selesai</span>
                          </span>
                        ) : isComplete ? (
                          <span className="text-[10px] font-bold text-amber-300 bg-amber-500/25 px-1.5 py-0.2 rounded-full animate-pulse">
                            Siap Diklaim!
                          </span>
                        ) : null}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{ach.description}</p>
                    </div>

                    {/* Reward Badge or Claim Button */}
                    <div>
                      {ach.claimed ? (
                        <div className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                          <CheckCircle2 size={14} className="text-emerald-500" />
                          <span>Sudah Klaim</span>
                        </div>
                      ) : isComplete ? (
                        <button
                          onClick={() => onClaimReward(ach.id, ach.rewardType, ach.rewardCount)}
                          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-500/25 active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <Gift size={13} />
                          <span>Klaim +{ach.rewardCount}</span>
                        </button>
                      ) : (
                        <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400 bg-slate-800/80 border border-slate-700/60 px-2 py-1 rounded-lg">
                          {getBoosterIcon(ach.rewardType)}
                          <span>+{ach.rewardCount} {getBoosterName(ach.rewardType)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Progress bar */}
                  {!ach.claimed && (
                    <div className="mt-2.5">
                      <div className="flex justify-between text-[10px] font-semibold text-slate-400 mb-1">
                        <span>Progres</span>
                        <span className="tabular-nums">
                          {ach.current.toLocaleString()} / {ach.target.toLocaleString()} ({progressPct}%)
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isComplete ? 'bg-emerald-400' : 'bg-amber-400'
                          }`}
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="space-y-2.5">
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col">
                  <span className="text-[11px] font-semibold text-slate-400">Total Game</span>
                  <span className="font-display text-2xl font-black text-white tabular-nums mt-0.5">
                    {stats.gamesPlayed}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col">
                  <span className="text-[11px] font-semibold text-amber-400">Skor Tertinggi</span>
                  <span className="font-display text-2xl font-black text-amber-300 tabular-nums mt-0.5">
                    {stats.highScore.toLocaleString()}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col">
                  <span className="text-[11px] font-semibold text-pink-400">Kombo Terpanjang</span>
                  <span className="font-display text-2xl font-black text-white tabular-nums mt-0.5">
                    {stats.maxCombo > 0 ? `x${stats.maxCombo}` : '-'}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col">
                  <span className="text-[11px] font-semibold text-cyan-400">Garis Dihancurkan</span>
                  <span className="font-display text-2xl font-black text-white tabular-nums mt-0.5">
                    {stats.totalLinesCleared.toLocaleString()}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col">
                  <span className="text-[11px] font-semibold text-indigo-400">Balok Ditempatkan</span>
                  <span className="font-display text-2xl font-black text-white tabular-nums mt-0.5">
                    {stats.totalBlocksPlaced.toLocaleString()}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col">
                  <span className="text-[11px] font-semibold text-emerald-400">Booster Digunakan</span>
                  <span className="font-display text-2xl font-black text-white tabular-nums mt-0.5">
                    {stats.totalBoostersUsed}
                  </span>
                </div>
              </div>

              {/* Haptic vibration switch for mobile */}
              <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Smartphone size={16} className="text-cyan-400" />
                  <div>
                    <p className="text-xs font-bold text-white">Getaran Ponsel (Haptic)</p>
                    <p className="text-[10px] text-slate-400">Sensasi getar saat balok & combo hancur</p>
                  </div>
                </div>

                <button
                  onClick={handleToggleHaptics}
                  className={`w-12 h-6 rounded-full p-0.5 transition-colors cursor-pointer ${
                    isHapticsOn ? 'bg-emerald-500' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      isHapticsOn ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
