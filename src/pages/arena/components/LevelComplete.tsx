import React from 'react';
import { GameLevel, Badge } from '@/src/types';
import { motion } from 'motion/react';
import { Award, Star, ArrowRight, RefreshCw, Trophy, ClipboardCheck, Sparkles, Brain, CheckCircle, RotateCcw } from 'lucide-react';
import { BADGES, LEVELS } from '@/src/data/levels';

interface LevelCompleteProps {
  currentLevel: GameLevel;
  totalScore: number;
  levelBonus: number;
  onNextLevel: () => void;
  onRestartGame: () => void;
}

export const LevelComplete: React.FC<LevelCompleteProps> = ({
  currentLevel,
  totalScore,
  levelBonus,
  onNextLevel,
  onRestartGame,
}) => {
  // Check if a badge was earned at this level
  const earnedBadge = BADGES.find(b => b.achievedAtLevel === currentLevel.id);

  const getCTBreakdown = (levelId: number) => {
    switch (levelId) {
      case 1:
        return {
          title: "Abstraksi Terpasang!",
          desc: "Kamu berhasil mengaburkan detail individu siswa yang rumit menjadi diagram batang/garis yang informatif."
        };
      default:
        return { title: '', desc: '' };
    }
  };

  const ctBreakdown = getCTBreakdown(currentLevel.id);
  const isFinalLevel = currentLevel.id === LEVELS.length;

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl border-2 sm:border-4 border-black p-3 sm:p-6 md:p-10 w-full max-w-lg sm:max-w-xl md:max-w-2xl mx-auto text-center relative overflow-hidden shadow-[4px_4px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_rgba(0,0,0,1)] max-h-[85vh] sm:max-h-none flex flex-col justify-between sm:justify-start">
      
      {/* Top Trophy badge */}
      <motion.div
        initial={{ scale: 0.3, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="w-10 h-10 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-[#FDE047] border-2 border-black rounded-full flex items-center justify-center mx-auto mb-1.5 sm:mb-4 md:mb-6 text-black shadow-[2px_2px_0px_rgba(0,0,0,1)] sm:shadow-[3px_3px_0px_rgba(0,0,0,1)] animate-pulse shrink-0"
      >
        <Trophy className="w-5 h-5 sm:w-8 sm:h-8 md:w-10 md:h-10" />
      </motion.div>

      {/* Main congratz text */}
      <motion.div
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-xs sm:text-xl md:text-2xl font-black text-slate-950 font-display leading-tight uppercase tracking-tight sm:mt-2 md:mt-3">
          Selamat! Kamu Adalah Master Berpikir Komputasional!
        </h2>
      </motion.div>

      {/* Summary Score Gained Block */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="my-2 sm:mt-6 sm:mb-2 p-2.5 sm:p-4 bg-[#FDE047] border-2 border-black rounded-xl sm:rounded-2xl max-w-xs sm:max-w-sm mx-auto shadow-[2.5px_2.5px_0px_#000] sm:shadow-[4px_4px_0px_#000]"
      >
        <span className="text-[9px] sm:text-[11px] uppercase font-black text-black font-display tracking-wider block">Nilai Akhir Analisis</span>
        <p className="text-xl sm:text-3xl font-mono font-black text-black mt-0.5">{totalScore} <span className="text-xs sm:text-base font-bold text-slate-800">/ 100</span></p>
      </motion.div>

      {/* Foot Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="pt-2 sm:pt-6 sm:mt-6 border-t-2 border-black flex flex-row items-center justify-center gap-2 sm:gap-4"
      >
        <button
          type="button"
          onClick={onNextLevel}
          className="flex-1 sm:flex-none bg-[#FDE047] hover:bg-[#FACC15] text-black font-black px-3 sm:px-6 py-2 sm:py-3.5 rounded-xl sm:rounded-2xl text-[10px] sm:text-xs md:text-sm flex items-center justify-center gap-1 sm:gap-2 border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-colors cursor-pointer font-display uppercase tracking-tight whitespace-nowrap"
          id="btn-play-again"
        >
          <RotateCcw className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
          <span>Main Lagi</span>
        </button>

        <button
          type="button"
          onClick={onRestartGame}
          className="flex-1 sm:flex-none bg-[#CCFBF1] hover:bg-[#99F6E4] text-black font-black px-3 sm:px-6 py-2 sm:py-3.5 rounded-xl sm:rounded-2xl text-[10px] sm:text-xs md:text-sm flex items-center justify-center gap-1 sm:gap-2 border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-colors cursor-pointer font-display uppercase tracking-tight whitespace-nowrap"
          id="btn-play-new-data"
        >
          <RefreshCw className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
          <span>Main Sesi Baru</span>
        </button>
      </motion.div>

    </div>
  );
};
