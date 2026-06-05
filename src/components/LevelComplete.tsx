import React from 'react';
import { GameLevel, Badge } from '../types';
import { motion } from 'motion/react';
import { Award, Star, ArrowRight, RefreshCw, Trophy, ClipboardCheck, Sparkles, Brain, CheckCircle } from 'lucide-react';
import { BADGES } from '../data/levels';

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
          title: "Dekomposisi Berhasil!",
          desc: "Kamu luar biasa dalam memecah daftar kehadiran siswa harian yang acak menjadi angka-angka statistik individu hari demi hari."
        };
      case 2:
        return {
          title: "Organisasi Algoritma Sempurna!",
          desc: "Kamu menyusun langkah demi langkah input tabel dengan presisi untuk mereduksi kesalahan administrasi sekolah."
        };
      case 3:
        return {
          title: "Abstraksi Terpasang!",
          desc: "Kamu berhasil mengaburkan detail individu siswa yang rumit menjadi diagram batang/garis yang informatif."
        };
      case 4:
        return {
          title: "Pengenalan Pola Aktif!",
          desc: "Kamu mengidentifikasi perbedaan mencolok tingkat disiplin antar-minggu dan efek positif program apresiasi siswa harian."
        };
      case 5:
        return {
          title: "Berpikir Komputasional Dikuasai!",
          desc: "Sempurna! Kamu memahami pencilan anomali badai cuaca dan merancang strategi mitigasi jarak jauh yang prediktif."
        };
      default:
        return { title: '', desc: '' };
    }
  };

  const ctBreakdown = getCTBreakdown(currentLevel.id);
  const isFinalLevel = currentLevel.id === 5;

  return (
    <div className="bg-white rounded-3xl border-4 border-black p-6 md:p-10 max-w-3xl mx-auto text-center relative overflow-hidden shadow-[8px_8px_0px_rgba(0,0,0,1)]">
      
      {/* Rarity Trophy badge */}
      <motion.div
        initial={{ scale: 0.3, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="w-20 h-20 bg-[#FDE047] border-2 border-black rounded-full flex items-center justify-center mx-auto mb-6 text-black shadow-[3px_3px_0px_rgba(0,0,0,1)] animate-pulse"
      >
        <Trophy className="w-10 h-10" />
      </motion.div>

      {/* Main congratz text */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <span className="text-[10px] font-mono font-black bg-[#CCFBF1] text-black px-3 py-1 rounded-full uppercase tracking-widest border border-black shadow-[1.5px_1.5px_0px_#000]">
          Sesi Sukses Terverifikasi
        </span>
        <h2 className="text-2xl md:text-3xl font-black text-slate-1000 font-display mt-3 leading-snug uppercase tracking-tight">
          {isFinalLevel ? '🎉 Selamat! Kamu Adalah Master Berpikir Komputasional!' : `Misi Terlampaui: Level ${currentLevel.id}`}
        </h2>
        <p className="text-sm text-slate-800 font-bold max-w-lg mx-auto mt-2 leading-relaxed">
          Semua verifikasi input, analisis pola, serta langkah kebijakan sekolah harian telah tuntas dieksekusi dengan baik.
        </p>
      </motion.div>

      {/* Summary Score Gained Block */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-6 p-4 bg-white border-2 border-black rounded-2xl max-w-md mx-auto grid grid-cols-2 gap-4 divide-x-2 divide-black shadow-[4px_4px_0px_#000]"
      >
        <div>
          <span className="text-[10px] uppercase font-black text-slate-700 font-mono tracking-wider">Subtotal Skor</span>
          <p className="text-xl font-mono font-black text-black">+{levelBonus} poin</p>
        </div>
        <div>
          <span className="text-[10px] uppercase font-black text-slate-700 font-mono tracking-wider">Skor Kumulatif</span>
          <p className="text-xl font-mono font-black text-slate-900">{totalScore} poin</p>
        </div>
      </motion.div>

      {/* Earned Badge Announcement Card */}
      {earnedBadge && (
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", delay: 0.3 }}
          className="mt-8 p-5 bg-[#A5F3FC] border-2 border-black rounded-3xl max-w-md mx-auto shadow-[4px_4px_0px_#000] flex flex-col items-center gap-3 text-black"
        >
          <div className="flex items-center gap-1.5 text-xs font-black text-black uppercase tracking-widest font-mono">
            <Sparkles className="w-4 h-4 text-black fill-[#FDE047]" />
            Lencana Baru Terbuka
          </div>
          
          {/* Badge Visual Icon */}
          <div className="w-16 h-16 bg-white border-2 border-black rounded-2xl flex items-center justify-center text-3xl shadow-[2.5px_2.5px_0px_#000]">
            {earnedBadge.id === 'data-collector' && '📊'}
            {earnedBadge.id === 'graph-maker' && '📈'}
            {earnedBadge.id === 'data-analyst' && '🔍'}
            {earnedBadge.id === 'school-statistician' && '🏆'}
          </div>

          <div>
            <h4 className="font-black text-base text-slate-950 font-display uppercase tracking-tight">
              {earnedBadge.name}
            </h4>
            <p className="text-[11px] text-slate-900 font-bold px-4 leading-relaxed mt-1">
              {earnedBadge.description}
            </p>
          </div>
        </motion.div>
      )}

      {/* Pedagogical review card */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-6 p-4 bg-[#CCFBF1] border-2 border-black rounded-2xl text-left max-w-xl mx-auto flex gap-3.5 shadow-[4px_4px_0px_rgba(0,0,0,1)]"
      >
        <div className="p-2 bg-[#FBCFE8] text-black border border-black rounded-xl shrink-0 h-10 w-10 flex items-center justify-center shadow-[1px_1px_0px_#000]">
          <Brain className="w-5 h-5 text-black" />
        </div>
        <div>
          <h4 className="font-black text-slate-950 text-xs font-sans uppercase">
            {ctBreakdown.title}
          </h4>
          <p className="text-[11px] text-slate-900 font-bold leading-relaxed mt-0.5">
            {ctBreakdown.desc}
          </p>
        </div>
      </motion.div>

      {/* Foot Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 pt-6 border-t-2 border-black flex flex-col sm:flex-row items-center justify-center gap-4"
      >
        {isFinalLevel ? (
          <div className="w-full space-y-4">
            <p className="text-xs text-slate-850 font-bold leading-relaxed">
              🎉 Selamat! Anda telah menamatkan seluruh level Sekolah Data Challenge. Anda kini siap membuat kebijakan berbasis data di mana saja!
            </p>
            <div className="flex gap-4 justify-center">
              <button
                type="button"
                onClick={onRestartGame}
                className="bg-[#FBCFE8] hover:bg-rose-300 border-2 border-black text-black font-black px-6 py-3 rounded-2xl text-xs flex items-center gap-2 transition-colors cursor-pointer shadow-[3px_3px_0px_#000]"
                id="btn-restart-final"
              >
                <RefreshCw className="w-4 h-4" />
                Mulai Dari Awal
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={onNextLevel}
            className="w-full sm:w-auto bg-[#FDE047] hover:bg-[#FACC15] text-black font-black px-8 py-3.5 rounded-2xl text-sm flex items-center justify-center gap-2 border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-colors cursor-pointer font-display uppercase tracking-tight"
            id="btn-continue-next-level"
          >
            <span>Lanjutkan ke Level {currentLevel.id + 1}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        )}
      </motion.div>

    </div>
  );
};
