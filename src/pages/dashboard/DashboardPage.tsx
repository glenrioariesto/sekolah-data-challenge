import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Lock, ChevronRight } from 'lucide-react';

import { LEVELS } from '@/src/data/levels';
import { playSynthesizerNote } from '@/src/utils/audio';



interface DashboardPageProps {
  unlockedLevelIds: number[];
  totalScore: number;
  unlockedBadgeIds: string[];
  teacherMode: boolean;
  onToggleTeacherMode: () => void;
  onSelectLevel: (levelId: number) => void;
  onBack: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  unlockedLevelIds,
  totalScore,
  unlockedBadgeIds,
  teacherMode,
  onToggleTeacherMode,
  onSelectLevel,
  onBack,
}) => {
  return (
    <motion.div
      key="roadmap-page"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex-1 mx-auto w-full p-1 sm:p-4 flex flex-col h-full max-h-screen overflow-hidden"
    >
      {/* Header / Top Navigation - borderless flat buttons */}
      <div className="flex items-center justify-between w-full py-1">
        <button
          type="button"
          onClick={() => { playSynthesizerNote('btn'); onBack(); }}
          className="p-2 bg-white hover:bg-slate-100 border-2 border-black rounded-xl text-black hover:scale-105 transition-transform shadow-[2px_2px_0px_#000] cursor-pointer"
          title="Kembali ke Beranda"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
        </button>

        {import.meta.env.DEV && (
          <button
            type="button"
            onClick={onToggleTeacherMode}
            className={`px-3 py-2 rounded-xl text-xs font-black font-mono transition-colors border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer ${
              teacherMode ? 'bg-[#FDE047] text-black' : 'bg-white text-slate-700 hover:bg-slate-100'
            }`}
            id="btn-teacher-roadmap"
          >
            {teacherMode ? 'GURU: AKTIF' : 'MODE GURU'}
          </button>
        )}
      </div>




      {/* Vertically and horizontally centered levels wrapper */}
      <div className="flex-grow flex items-center justify-center w-full overflow-hidden">
        {/* Horizontal scrollable row of game levels - centered */}
        <div className="flex flex-row overflow-x-auto justify-start xl:justify-center gap-3 sm:gap-6 px-4 md:px-8 py-3 sm:py-6 w-full">
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
              className={`rounded-2xl sm:rounded-3xl border-2 sm:border-4 border-black p-3 sm:p-5 flex flex-col justify-between gap-2 sm:gap-4 shadow-[3px_3px_0px_#000] sm:shadow-[5px_5px_0px_#000] relative transition-all duration-250 w-[200px] sm:w-[220px] shrink-0 ${
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
    </div>

    </motion.div>
  );
};
