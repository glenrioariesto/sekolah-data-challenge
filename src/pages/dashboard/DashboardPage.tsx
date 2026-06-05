import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Award, ShieldAlert, Lock, ChevronRight } from 'lucide-react';
import { LEVELS } from '@/src/data/levels';
import { playSynthesizerNote } from '@/src/utils/audio';



interface DashboardPageProps {
  unlockedLevelIds: number[];
  totalScore: number;
  unlockedBadgeIds: string[];
  teacherMode: boolean;
  onToggleTeacherMode: () => void;
  onSelectLevel: (levelId: number) => void;
  onOpenBadges: () => void;
  onBack: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  unlockedLevelIds,
  totalScore,
  unlockedBadgeIds,
  teacherMode,
  onToggleTeacherMode,
  onSelectLevel,
  onOpenBadges,
  onBack,
}) => {
  return (
    <motion.div
      key="roadmap-page"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex-1 max-w-5xl mx-auto w-full p-4 md:p-8 space-y-6"
    >
      {/* Header / Top Navigation */}
      <div className="bg-white rounded-3xl border-4 border-black p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[6px_6px_0px_#000000]">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => { playSynthesizerNote('btn'); onBack(); }}
            className="p-2 bg-slate-100 hover:bg-slate-200 border-2 border-black rounded-xl text-black hover:scale-105 transition-transform"
            title="Kembali ke Beranda"
          >
            <ArrowLeft className="w-5 h-5 text-black" />
          </button>
          <div className="text-left">
            <h2 className="text-lg md:text-xl font-black text-slate-900 font-display uppercase tracking-tight">
              Peta Misi Administrasi
            </h2>
            <p className="text-[11px] text-slate-600 font-bold font-mono">
              Urutan Tingkatan Kompetensi Berpikir Komputasional SISWA
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {/* Badge Modal Trigger */}
          <button
            type="button"
            onClick={() => { playSynthesizerNote('btn'); onOpenBadges(); }}
            className="bg-[#A5F3FC] hover:bg-cyan-200 border-2 border-[#000] border-black text-black font-black text-xs px-4 py-2.5 rounded-xl shadow-[3px_3px_0px_#000] transition-transform duration-100 active:scale-95 flex items-center gap-1.5 cursor-pointer"
          >
            <Award className="w-4 h-4 text-rose-600" />
            <span>Galeri Lencana 🏅</span>
          </button>

          {/* Teacher toggler */}
          <button
            type="button"
            onClick={onToggleTeacherMode}
            className={`px-3 py-2.5 rounded-xl text-xs font-black font-mono transition-colors border-2 border-black shadow-[3px_3px_0px_#000] cursor-pointer ${
              teacherMode ? 'bg-[#FDE047] text-black' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
            id="btn-teacher-roadmap"
          >
            {teacherMode ? 'GURU: AKTIF' : 'MODE GURU'}
          </button>
        </div>
      </div>

      {/* Total Accumulative Score Box Sheet */}
      <div className="bg-[#CCFBF1] rounded-3xl border-4 border-black p-5 shadow-[6px_6px_0px_rgba(0,0,0,1)] grid grid-cols-1 md:grid-cols-3 gap-4 divide-y-2 md:divide-y-0 md:divide-x-2 divide-black text-center">
        <div className="p-2 flex flex-col justify-center">
          <span className="text-[10px] font-mono font-black text-slate-700 uppercase tracking-widest">Skor Kumulatif</span>
          <p className="text-2xl font-black text-slate-900 font-mono mt-0.5">{totalScore} POIN</p>
        </div>
        <div className="p-2 flex flex-col justify-center">
          <span className="text-[10px] font-mono font-black text-slate-700 uppercase tracking-widest">Lencana Didapatkan</span>
          <p className="text-2xl font-black text-indigo-700 font-mono mt-0.5">{unlockedBadgeIds.length} / 4 Lencana</p>
        </div>
        <div className="p-2 flex flex-col justify-center">
          <span className="text-[10px] font-mono font-black text-slate-700 uppercase tracking-widest">Tingkat Penuntasan</span>
          <p className="text-2xl font-black text-emerald-800 font-mono mt-0.5">{Math.round(((unlockedLevelIds.length - 1) / 5) * 100)}% Lulus</p>
        </div>
      </div>

      {/* Teacher Mode Instruction Warn */}
      {teacherMode && (
        <div className="p-4 bg-[#FDE047] border-2 border-black rounded-2xl flex gap-3.5 shadow-[4px_4px_0px_rgba(0,0,0,1)] text-left">
          <ShieldAlert className="w-5 h-5 text-black shrink-0 animate-pulse" />
          <p className="text-xs text-black font-bold">
            <strong>Edukasi Guru Diaktifkan:</strong> Seluruh pintu level di bawah ini telah dilewati mekanismenya (bypass). Guru dapat melompat, memperagakan, atau menguji materi level manapun secara bebas di depan layar proyektor kelas!
          </p>
        </div>
      )}

      {/* Grid of 5 game levels */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {LEVELS.map((lvl) => {
          const isUnlocked = unlockedLevelIds.includes(lvl.id) || teacherMode;
          
          // Card backgrounds according to difficulty / unlock state
          const cardColor = isUnlocked 
            ? lvl.id === 1 ? 'bg-white hover:bg-[#A5F3FC]/20' :
              lvl.id === 2 ? 'bg-[#A5F3FC]/10 hover:bg-[#A5F3FC]/30' :
              lvl.id === 3 ? 'bg-[#CCFBF1]/20 hover:bg-[#CCFBF1]/40' :
              lvl.id === 4 ? 'bg-[#FBCFE8]/20 hover:bg-[#FBCFE8]/40' : 'bg-[#FDE047]/15 hover:bg-[#FDE047]/30'
            : 'bg-slate-200 grayscale opacity-60';

          return (
            <div
              key={lvl.id}
              className={`rounded-3xl border-4 border-black p-5 flex flex-col justify-between gap-4 shadow-[5px_5px_0px_#000] relative transition-all duration-250 ${
                isUnlocked ? 'hover:-translate-y-1' : ''
              } ${cardColor}`}
            >
              {/* Badge top indicator */}
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-xl font-mono text-xs font-black border-2 border-black bg-white flex items-center justify-center text-black shadow-[1.5px_1.5px_0px_#000]">
                  {lvl.id}
                </span>
                {isUnlocked ? (
                  <span className="text-[9px] font-mono font-black text-emerald-800 bg-[#CCFBF1] px-2 py-0.5 border border-black rounded shadow-[1px_1px_0px_#000]">
                    Terbuka
                  </span>
                ) : (
                  <span className="text-[9px] font-mono font-black text-slate-500 bg-slate-300 px-2 py-0.5 border border-slate-400 rounded">
                    Terkunci
                  </span>
                )}
              </div>

              <div className="space-y-1 text-left flex-1">
                <h4 className="text-xs font-mono font-black text-rose-600 tracking-wider">
                  LEVEL {lvl.id}
                </h4>
                <h3 className="text-sm font-black text-slate-1000 leading-snug line-clamp-2 uppercase font-display">
                  {lvl.title.split(': ')[1]}
                </h3>
                <p className="text-[10px] text-slate-700 leading-normal line-clamp-4 font-bold mt-2">
                  {lvl.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-300 space-y-3">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-600">
                  <span className="font-bold">Durasi:</span>
                  <span className="font-black text-slate-900">{lvl.durationLabel}</span>
                </div>

                {isUnlocked ? (
                  <button
                    type="button"
                    onClick={() => onSelectLevel(lvl.id)}
                    className="w-full bg-black hover:bg-slate-900 text-white border-2 border-black text-xs font-black py-2.5 rounded-xl uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer shadow-[2.5px_2.5px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-[1px_1px_0px_#000]"
                  >
                    <span>Masuk Misi</span>
                    <ChevronRight className="w-3.5 h-3.5 text-white" />
                  </button>
                ) : (
                  <div className="w-full bg-slate-100 text-slate-400 border-2 border-slate-300 text-xs font-semibold py-2.5 rounded-xl text-center flex items-center justify-center gap-1">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Misi Terkunci</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Educational Info box */}
      <div className="bg-white rounded-3xl border-4 border-black p-5 shadow-[4px_4px_0px_rgba(0,0,0,1)] text-center text-xs font-bold leading-relaxed max-w-2xl mx-auto">
        💡 <strong>Tips Pembelajaran:</strong> Nilai atau tingkat keterbukaannya disimpan secara lokal. Capailah lencana tertinggi 🏆 <strong>Ahli Statistik Sekolah</strong> dengan menyelesaikan semua tugas hingga Misi Ke 5!
      </div>
    </motion.div>
  );
};
