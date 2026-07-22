import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play } from 'lucide-react';
import { GameLevel, GameStage } from '@/src/types';
import { StudentCounter } from '@/src/pages/arena/components/StudentCounter';
import { ChartBuilder } from '@/src/pages/arena/components/ChartBuilder';
import { QuizSection } from '@/src/pages/arena/components/QuizSection';
import { LevelComplete } from '@/src/pages/arena/components/LevelComplete';
import { playSynthesizerNote } from '@/src/utils/audio';
import gameplayBg from '@/assets/gameplay_classroom_bg.webp';

interface ArenaPageProps {
  currentStage: GameStage;
  activeLevel: GameLevel;
  totalScore: number;
  levelPointsAccumulator: number;
  userCountedData?: Record<string, { present: number, permit: number, sick: number, alpha: number }> | null;
  onBackToRoadmap: () => void;
  onGoBackStage: () => void;
  startCurrentLevelPlay: () => void;
  handleRosterStepFinished: (bonus: number, countedRecords: any) => void;
  handleChartStepFinished: (bonus: number) => void;
  handleQuizStepFinished: (bonus: number) => void;
  handleNextLevelTransition: () => void;
  resetAllGameProgress: () => void;
  getStagePercentage: (s: string) => string;
  activeLevelProgressPercentage: () => number;
  isIntroModalOpen: boolean;
  teacherMode: boolean;
}

export const ArenaPage: React.FC<ArenaPageProps> = ({
  currentStage,
  activeLevel,
  totalScore,
  levelPointsAccumulator,
  userCountedData,
  onBackToRoadmap,
  onGoBackStage,
  startCurrentLevelPlay,
  handleRosterStepFinished,
  handleChartStepFinished,
  handleQuizStepFinished,
  handleNextLevelTransition,
  resetAllGameProgress,
  getStagePercentage,
  activeLevelProgressPercentage,
  isIntroModalOpen,
  teacherMode,
}) => {
  return (
    <motion.div
      key="game-page"
      initial={{ opacity: 0, scale: 0.99 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.99 }}
      className="w-full h-full flex flex-col relative overflow-hidden"
    >
      {/* Background Image - top view classroom */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src={gameplayBg}
          alt="Latar Belakang Kelas"
          className="w-full h-full object-cover opacity-80"
        />
      </div>

      {/* MAIN LEVEL GAME ARENA VIEWPORT VIEW */}
      <div className="flex-1 min-h-0 w-full flex flex-col relative z-10">
        <AnimatePresence mode="wait">
          
          {/* Stage: Manual list count Decomposition card */}
          {currentStage === 'roster' && (
            <motion.div key="roster" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full h-full min-h-0 flex flex-col">
              <StudentCounter 
                currentLevel={activeLevel} 
                onSuccess={handleRosterStepFinished} 
                onBack={onGoBackStage}
                teacherMode={teacherMode}
              />
            </motion.div>
          )}

          {/* Stage: Interactive Graph adjustment Abstraction (kept visible during analysis) */}
          {(currentStage === 'chart' || currentStage === 'analysis') && (
            <motion.div key="chart" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full h-full min-h-0 flex flex-col">
              <ChartBuilder 
                currentLevel={activeLevel} 
                onSuccess={handleChartStepFinished} 
                onBack={onGoBackStage}
              />
            </motion.div>
          )}

          {/* Stage: Success summary and celebratory certificates */}
          {currentStage === 'complete' && (
            <motion.div key="complete" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full h-full min-h-0 flex flex-col items-center justify-center overflow-y-auto">
              <LevelComplete 
                currentLevel={activeLevel} 
                totalScore={totalScore} 
                levelBonus={levelPointsAccumulator} 
                onNextLevel={handleNextLevelTransition}
                onRestartGame={resetAllGameProgress}
              />
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Modal Overlay for Stage 4: Quiz Section (Analysis) */}
      <AnimatePresence>
        {currentStage === 'analysis' && (
          <div 
            onClick={onGoBackStage}
            className="fixed inset-0 bg-black/55 backdrop-blur-xs flex items-center justify-center p-4 z-[990] overflow-y-auto cursor-pointer"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="w-full max-w-4xl relative cursor-default"
              onClick={(e) => e.stopPropagation()}
            >
              <QuizSection 
                currentLevel={activeLevel} 
                onSuccess={handleQuizStepFinished} 
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Level Intro Modal Overlay - Cara Bermain */}
      <AnimatePresence>
        {isIntroModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-[999] overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="bg-white rounded-3xl border-4 border-black shadow-[6px_6px_0px_#000] p-3 sm:p-5 max-w-lg w-full relative text-left flex flex-col max-h-[88vh] overflow-hidden"
            >
              {/* Header Title */}
              <div className="text-center space-y-1 md:space-y-2 border-b-2 sm:border-b-4 border-black pb-2 sm:pb-4 shrink-0">
                <span className="text-[8px] sm:text-[10px] uppercase font-mono font-black border-2 border-black bg-[#CCFBF1] text-black px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full inline-block tracking-widest shadow-[1.5px_1.5px_0px_#000]">
                  Sekolah Data Challenge
                </span>
                <h2 className="text-lg sm:text-2xl font-black font-display uppercase tracking-tight text-slate-900 pt-0.5 sm:pt-1">
                  Cara Bermain
                </h2>
              </div>

              {/* Dynamic steps based on gameplay flow - scrollable inside flex */}
              <div className="flex-1 overflow-y-auto py-2.5 sm:py-4 space-y-2.5 sm:space-y-3 pr-1">
                <div className="flex gap-2 sm:gap-3 items-start p-2 sm:p-3 bg-[#A5F3FC]/30 border-2 border-black rounded-xl sm:rounded-2xl shadow-[2px_2px_0px_#000]">
                  <span className="text-base sm:text-xl shrink-0">🧩</span>
                  <div>
                    <h4 className="font-black text-[10px] sm:text-xs uppercase text-slate-900">1. Hitung Kehadiran</h4>
                    <p className="text-[9px] sm:text-[11px] text-slate-700 font-bold mt-0.5">Hitung jumlah siswa Hadir dan Tidak Hadir di lembar absen manual harian.</p>
                  </div>
                </div>

                <div className="flex gap-2 sm:gap-3 items-start p-2 sm:p-3 bg-[#CCFBF1]/30 border-2 border-black rounded-xl sm:rounded-2xl shadow-[2px_2px_0px_#000]">
                  <span className="text-base sm:text-xl shrink-0">📈</span>
                  <div>
                    <h4 className="font-black text-[10px] sm:text-xs uppercase text-slate-900">2. Pilih Tipe Grafik</h4>
                    <p className="text-[9px] sm:text-[11px] text-slate-700 font-bold mt-0.5">Pilih tipe diagram (Batang, Garis, atau Lingkaran) untuk memvisualisasikan data kehadiran secara otomatis.</p>
                  </div>
                </div>

                <div className="flex gap-2 sm:gap-3 items-start p-2 sm:p-3 bg-[#FDE047]/30 border-2 border-black rounded-xl sm:rounded-2xl shadow-[2px_2px_0px_#000]">
                  <span className="text-base sm:text-xl shrink-0">🔍</span>
                  <div>
                    <h4 className="font-black text-[10px] sm:text-xs uppercase text-slate-900">3. Analisis Pola</h4>
                    <p className="text-[9px] sm:text-[11px] text-slate-700 font-bold mt-0.5">Amati pola grafik dan jawab beberapa pertanyaan kuis analisis data.</p>
                  </div>
                </div>
              </div>

              {/* Start button */}
              <div className="pt-2 sm:pt-4 border-t-2 border-black flex justify-center shrink-0">
                <button
                  type="button"
                  onClick={startCurrentLevelPlay}
                  className="w-full bg-[#FDE047] hover:bg-[#FACC15] text-black border-2 sm:border-4 border-black text-[10px] sm:text-xs font-black py-2.5 sm:py-3.5 rounded-xl sm:rounded-2xl uppercase tracking-wider cursor-pointer shadow-[2px_2px_0px_#000] sm:shadow-[4px_4px_0px_#000] active:translate-y-0.5 active:shadow-[1px_1px_0px_#000] flex items-center justify-center gap-1.5"
                  id="btn-start-misi"
                >
                  <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-black fill-black animate-pulse" />
                  <span>Mulai Bermain</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
