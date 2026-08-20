import React, { useEffect } from 'react';
import { GameLevel, Badge } from '@/src/types';
import { motion } from 'motion/react';
import { Award, Star, ArrowRight, RefreshCw, Trophy, ClipboardCheck, Sparkles, Brain, CheckCircle, RotateCcw } from 'lucide-react';
import { BADGES, LEVELS } from '@/src/data/levels';
import { playSynthesizerNote } from '@/src/utils/audio';

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
  // Play triumphant victory sound on stage complete
  useEffect(() => {
    playSynthesizerNote('victory');
  }, []);
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
    <div className="bg-white rounded-2xl lg:rounded-3xl border-2 lg:border-4 border-black p-3 lg:p-8 w-full max-w-md lg:max-w-2xl mx-auto text-center relative overflow-hidden shadow-[4px_4px_0px_rgba(0,0,0,1)] lg:shadow-[8px_8px_0px_rgba(0,0,0,1)] max-h-[90vh] lg:max-h-none flex flex-col justify-between lg:justify-start">
      
      {/* Top Trophy badge */}
      <motion.div
        initial={{ scale: 0.3, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="mx-auto mb-1.5 lg:mb-4 shrink-0"
      >
        <span className="text-3xl lg:text-5xl leading-none animate-bounce inline-block">🏆</span>
      </motion.div>

      {/* Main congratz text */}
      <motion.div
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-sm lg:text-2xl font-black text-slate-950 font-display leading-tight uppercase tracking-tight lg:mt-3">
          Selamat! Kamu <br /> Master Berpikir Komputasional!
        </h2>
      </motion.div>

      {/* Summary Score Gained Block */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="my-2 lg:mt-4 lg:mb-3 text-center"
      >
        <span className="text-[9px] lg:text-[11px] uppercase font-black text-slate-700 font-display tracking-wider block">Nilai Akhir Analisis</span>
        <p className="text-xl lg:text-3xl font-mono font-black text-black mt-0.5">{totalScore} <span className="text-xs lg:text-base font-bold text-slate-600">/ 100</span></p>
      </motion.div>

      {/* Foot Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="pt-2 lg:pt-4 lg:mt-4 border-t-2 border-black flex flex-row items-center justify-center gap-2 lg:gap-3"
      >
        <button
          type="button"
          onClick={() => {
            playSynthesizerNote('click');
            onNextLevel();
          }}
          className="flex-1 lg:flex-none bg-[#FDE047] hover:bg-[#FACC15] text-black font-black px-3 lg:px-5 py-2 lg:py-3 rounded-xl lg:rounded-2xl text-[10px] lg:text-sm flex items-center justify-center gap-1 lg:gap-2 border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] lg:shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-colors cursor-pointer font-display uppercase tracking-tight whitespace-nowrap"
          id="btn-play-again"
        >
          <RotateCcw className="w-3.5 h-3.5 lg:w-5 lg:h-5" />
          <span>Main Lagi</span>
        </button>

        <button
          type="button"
          onClick={() => {
            playSynthesizerNote('click');
            onRestartGame();
          }}
          className="flex-1 lg:flex-none bg-[#CCFBF1] hover:bg-[#99F6E4] text-black font-black px-3 lg:px-5 py-2 lg:py-3 rounded-xl lg:rounded-2xl text-[10px] lg:text-sm flex items-center justify-center gap-1 lg:gap-2 border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] lg:shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-colors cursor-pointer font-display uppercase tracking-tight whitespace-nowrap"
          id="btn-play-new-data"
        >
          <RefreshCw className="w-3.5 h-3.5 lg:w-5 lg:h-5" />
          <span>Main Sesi Baru</span>
        </button>
      </motion.div>

    </div>
  );
};
