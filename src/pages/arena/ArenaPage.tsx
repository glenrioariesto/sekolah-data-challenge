import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { School, Brain, Target, Play, ChevronRight, ArrowLeft, Flame } from 'lucide-react';
import { GameLevel, GameStage } from '@/src/types';
import { StudentCounter } from '@/src/pages/arena/components/StudentCounter';
import { DataEntryTable } from '@/src/pages/arena/components/DataEntryTable';
import { ChartBuilder } from '@/src/pages/arena/components/ChartBuilder';
import { QuizSection } from '@/src/pages/arena/components/QuizSection';
import { DecisionSection } from '@/src/pages/arena/components/DecisionSection';
import { LevelComplete } from '@/src/pages/arena/components/LevelComplete';
import { playSynthesizerNote } from '@/src/utils/audio';



interface ArenaPageProps {
  currentStage: GameStage;
  activeLevel: GameLevel;
  totalScore: number;
  levelPointsAccumulator: number;
  onBackToRoadmap: () => void;
  startCurrentLevelPlay: () => void;
  handleRosterStepFinished: (bonus: number) => void;
  handleTableStepFinished: (bonus: number) => void;
  handleChartStepFinished: (bonus: number) => void;
  handleQuizStepFinished: (bonus: number) => void;
  handleDecisionStepFinished: (bonus: number) => void;
  handleNextLevelTransition: () => void;
  resetAllGameProgress: () => void;
  getStagePercentage: (s: string) => string;
  activeLevelProgressPercentage: () => number;
  isIntroModalOpen: boolean;
}

export const ArenaPage: React.FC<ArenaPageProps> = ({
  currentStage,
  activeLevel,
  totalScore,
  levelPointsAccumulator,
  onBackToRoadmap,
  startCurrentLevelPlay,
  handleRosterStepFinished,
  handleTableStepFinished,
  handleChartStepFinished,
  handleQuizStepFinished,
  handleDecisionStepFinished,
  handleNextLevelTransition,
  resetAllGameProgress,
  getStagePercentage,
  activeLevelProgressPercentage,
  isIntroModalOpen,
}) => {
  return (
    <motion.div
      key="game-page"
      initial={{ opacity: 0, scale: 0.99 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.99 }}
      className="flex-1 max-w-6xl mx-auto w-full p-1 sm:p-4 space-y-3 sm:space-y-6 overflow-y-auto max-h-screen"

    >
      {/* IN-PAGE HUD/BREADCRUMB HEADER - flat borderless buttons */}
      <div className="flex flex-row items-center justify-between gap-2 sm:gap-4 py-1 w-full">
        
        {/* Back button and Active title info */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => { playSynthesizerNote('btn'); onBackToRoadmap(); }}
            className="p-2 bg-white hover:bg-slate-100 border-2 border-black rounded-xl text-black hover:scale-105 transition-transform shadow-[2px_2px_0px_#000] cursor-pointer"
            title="Kembali ke Peta Misi"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
          </button>
          
          <div className="text-left leading-none">
            <span className="font-mono text-[9px] font-black bg-rose-500 text-white px-2 py-0.5 rounded border border-black tracking-widest shadow-[1px_1px_0px_#000]">
              Lvl {activeLevel.id}
            </span>
            <h2 className="text-xs sm:text-sm font-black text-slate-900 uppercase font-display mt-1.5 line-clamp-1">
              {activeLevel.title.split(': ')[1] || activeLevel.title}
            </h2>
          </div>
        </div>

        {/* Steps progression visual trail inside the page bar */}
        <div className="hidden lg:flex items-center gap-1 bg-white px-2.5 py-1 border-2 border-black rounded-xl shadow-[2px_2px_0px_#000]">
          {[
            { key: 'roster', label: 'Dekomposisi' },
            { key: 'input', label: 'Asosiasi' },
            { key: 'chart', label: 'Abstraksi' },
            { key: 'analysis', label: 'Pola' },
            { key: 'decision', label: 'Kebijakan' },
            { key: 'complete', label: 'Selesai' }
          ].map((s, idx, arr) => {
            const isActive = currentStage === s.key;
            // If stage is roster but roster doesn't exist, skip rendering progress for it
            if (s.key === 'roster' && (!activeLevel.rosters || activeLevel.rosters.length === 0)) {
              return null;
            }
            
            return (
              <React.Fragment key={s.key}>
                <span className={`text-[9px] font-mono px-2 py-0.5 rounded-lg border-2 ${
                  isActive 
                    ? 'bg-[#FDE047] text-black border-black font-black shadow-[1px_1px_0px_#000]' 
                    : 'bg-white text-slate-400 border-slate-300 font-bold'
                }`}>
                  {s.label}
                </span>
                {idx < arr.length - 1 && <span className="text-[10px] text-slate-400 font-bold">›</span>}
              </React.Fragment>
            );
          })}
        </div>

        {/* HUD Right hand metrics */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Active Score HUD */}
          <div className="bg-[#CCFBF1] border-2 border-black px-2 py-1 rounded-xl flex items-center gap-1.5 shadow-[2px_2px_0px_#000]">
            <Flame className="w-3.5 h-3.5 text-emerald-700" />
            <div className="text-left">
              <p className="text-[8px] font-mono leading-none text-slate-600 uppercase font-bold">Skor</p>
              <p className="text-xs font-black text-slate-900 font-mono leading-none mt-0.5">
                {totalScore}
              </p>
            </div>
          </div>

          {/* Computational Thinking Percentage Progress */}
          <div className="bg-[#FDE047] border-2 border-black px-2 py-1 rounded-xl flex items-center gap-1.5 shadow-[2px_2px_0px_#000]">
            <Brain className="w-3.5 h-3.5 text-black animate-pulse" />
            <div className="text-left">
              <p className="text-[8px] font-mono leading-none text-slate-600 uppercase font-black">Tahapan</p>
              <p className="text-xs font-black text-slate-900 font-mono leading-none mt-0.5">
                {getStagePercentage(currentStage)}
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Progress Bar under the header */}
      <div className="w-full bg-slate-200 h-2 rounded-full border-2 border-black overflow-hidden p-0.5 shadow-[2.5px_2.5px_0px_#000]">
        <div 
          className="bg-[#10B981] h-full rounded-full border border-black transition-all duration-300 ease-out"
          style={{ width: `${activeLevelProgressPercentage()}%` }}
        />
      </div>

      {/* MAIN LEVEL GAME ARENA VIEWPORT VIEW */}
      <div className="space-y-6">
        <AnimatePresence mode="wait">
          


          {/* Stage: Manual list count Decomposition card */}
          {currentStage === 'roster' && (
            <motion.div key="roster" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <StudentCounter 
                currentLevel={activeLevel} 
                onSuccess={handleRosterStepFinished} 
              />
            </motion.div>
          )}

          {/* Stage: Digital inputs binding */}
          {currentStage === 'input' && (
            <motion.div key="input" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <DataEntryTable 
                currentLevel={activeLevel} 
                onSuccess={handleTableStepFinished} 
              />
            </motion.div>
          )}

          {/* Stage: Interactive Graph adjustment Abstraction */}
          {currentStage === 'chart' && (
            <motion.div key="chart" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ChartBuilder 
                currentLevel={activeLevel} 
                onSuccess={handleChartStepFinished} 
              />
            </motion.div>
          )}

          {/* Stage: Multiple Choice Questions Pattern Recognition */}
          {currentStage === 'analysis' && (
            <motion.div key="analysis" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <QuizSection 
                currentLevel={activeLevel} 
                onSuccess={handleQuizStepFinished} 
              />
            </motion.div>
          )}

          {/* Stage: Policy makers Decisions Data Literacy */}
          {currentStage === 'decision' && (
            <motion.div key="decision" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <DecisionSection 
                currentLevel={activeLevel} 
                onSuccess={handleDecisionStepFinished} 
              />
            </motion.div>
          )}

          {/* Stage: Success summary and celebratory certificates */}
          {currentStage === 'complete' && (
            <motion.div key="complete" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
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
                  Level {activeLevel.id}
                </span>
                <h2 className="text-lg sm:text-2xl font-black font-display uppercase tracking-tight text-slate-900 pt-0.5 sm:pt-1">
                  Cara Bermain
                </h2>
              </div>

              {/* Dynamic steps based on gameplay flow - scrollable inside flex */}
              <div className="flex-1 overflow-y-auto py-2.5 sm:py-4 space-y-2.5 sm:space-y-3 pr-1">
                {activeLevel.rosters && activeLevel.rosters.length > 0 ? (
                  <>
                    <div className="flex gap-2 sm:gap-3 items-start p-2 sm:p-3 bg-[#A5F3FC]/30 border-2 border-black rounded-xl sm:rounded-2xl shadow-[2px_2px_0px_#000]">
                      <span className="text-base sm:text-xl shrink-0">🧩</span>
                      <div>
                        <h4 className="font-black text-[10px] sm:text-xs uppercase text-slate-900">1. Hitung Kehadiran</h4>
                        <p className="text-[9px] sm:text-[11px] text-slate-700 font-bold mt-0.5">Hitung jumlah siswa Hadir dan Tidak Hadir di lembar absen manual harian.</p>
                      </div>
                    </div>
                    <div className="flex gap-2 sm:gap-3 items-start p-2 sm:p-3 bg-[#FBCFE8]/30 border-2 border-black rounded-xl sm:rounded-2xl shadow-[2px_2px_0px_#000]">
                      <span className="text-base sm:text-xl shrink-0">📊</span>
                      <div>
                        <h4 className="font-black text-[10px] sm:text-xs uppercase text-slate-900">2. Isi Tabel Digital</h4>
                        <p className="text-[9px] sm:text-[11px] text-slate-700 font-bold mt-0.5">Masukkan data angka hasil hitunganmu ke dalam tabel sistem sekolah.</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex gap-2 sm:gap-3 items-start p-2 sm:p-3 bg-[#FBCFE8]/30 border-2 border-black rounded-xl sm:rounded-2xl shadow-[2px_2px_0px_#000]">
                    <span className="text-base sm:text-xl shrink-0">📊</span>
                    <div>
                      <h4 className="font-black text-[10px] sm:text-xs uppercase text-slate-900">1. Isi Tabel Digital</h4>
                      <p className="text-[9px] sm:text-[11px] text-slate-700 font-bold mt-0.5">Masukkan data angka kehadiran yang diberikan ke tabel sistem sekolah.</p>
                    </div>
                  </div>
                )}

                <div className="flex gap-2 sm:gap-3 items-start p-2 sm:p-3 bg-[#CCFBF1]/30 border-2 border-black rounded-xl sm:rounded-2xl shadow-[2px_2px_0px_#000]">
                  <span className="text-base sm:text-xl shrink-0">📈</span>
                  <div>
                    <h4 className="font-black text-[10px] sm:text-xs uppercase text-slate-900">
                      {activeLevel.rosters && activeLevel.rosters.length > 0 ? "3. Sesuaikan Grafik" : "2. Sesuaikan Grafik"}
                    </h4>
                    <p className="text-[9px] sm:text-[11px] text-slate-700 font-bold mt-0.5">Atur tinggi diagram batang atau diagram garis agar sesuai dengan angka tabel.</p>
                  </div>
                </div>

                <div className="flex gap-2 sm:gap-3 items-start p-2 sm:p-3 bg-[#FDE047]/30 border-2 border-black rounded-xl sm:rounded-2xl shadow-[2px_2px_0px_#000]">
                  <span className="text-base sm:text-xl shrink-0">🔍</span>
                  <div>
                    <h4 className="font-black text-[10px] sm:text-xs uppercase text-slate-900">
                      {activeLevel.rosters && activeLevel.rosters.length > 0 ? "4. Analisis Pola" : "3. Analisis Pola"}
                    </h4>
                    <p className="text-[9px] sm:text-[11px] text-slate-700 font-bold mt-0.5">Amati pola grafik dan jawab beberapa pertanyaan kuis analisis data.</p>
                  </div>
                </div>

                <div className="flex gap-2 sm:gap-3 items-start p-2 sm:p-3 bg-rose-500/20 border-2 border-black rounded-xl sm:rounded-2xl shadow-[2px_2px_0px_#000]">
                  <span className="text-base sm:text-xl shrink-0">⚙️</span>
                  <div>
                    <h4 className="font-black text-[10px] sm:text-xs uppercase text-slate-900">
                      {activeLevel.rosters && activeLevel.rosters.length > 0 ? "5. Ambil Kebijakan" : "4. Ambil Kebijakan"}
                    </h4>
                    <p className="text-[9px] sm:text-[11px] text-slate-700 font-bold mt-0.5">Tentukan kebijakan sekolah terbaik berdasarkan kesimpulan data.</p>
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
