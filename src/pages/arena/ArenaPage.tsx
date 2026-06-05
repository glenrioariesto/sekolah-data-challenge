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
}) => {
  return (
    <motion.div
      key="game-page"
      initial={{ opacity: 0, scale: 0.99 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.99 }}
      className="flex-1 max-w-6xl mx-auto w-full p-4 md:p-8 space-y-6 overflow-y-auto max-h-screen"

    >
      {/* IN-PAGE HUD/BREADCRUMB HEADER */}
      <div className="bg-white rounded-3xl border-4 border-black p-4 md:p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-[6px_6px_0px_rgba(0,0,0,1)]">
        
        {/* Back button and Active title info */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            type="button"
            onClick={() => { playSynthesizerNote('btn'); onBackToRoadmap(); }}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 border-2 border-black rounded-xl text-black flex items-center justify-center cursor-pointer transition-transform duration-100 hover:scale-105"
            title="Kembali ke Peta Misi"
          >
            <ArrowLeft className="w-5 h-5 text-black" />
          </button>
          
          <div className="text-left">
            <span className="font-mono text-[9px] font-black bg-rose-500 text-white px-2 py-0.5 rounded border border-black tracking-widest shadow-[1px_1px_0px_#000]">
              Misi Tingkat: Level {activeLevel.id}
            </span>
            <h2 className="text-base font-black text-slate-1000 uppercase font-display leading-tight mt-1 line-clamp-1">
              {activeLevel.title}
            </h2>
          </div>
        </div>

        {/* Steps progression visual trail inside the page bar */}
        <div className="hidden lg:flex items-center gap-1 bg-slate-100 px-3 py-1.5 border-2 border-black rounded-2xl shadow-[2px_2px_0px_#000]">
          {[
            { key: 'intro', label: 'Mulai' },
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
        <div className="flex items-center gap-3 shrink-0 ml-auto md:ml-0">
          {/* Active Score HUD */}
          <div className="bg-[#CCFBF1] border-2 border-black px-2.5 py-1 rounded-xl flex items-center gap-1.5 shadow-[2px_2px_0px_#000]">
            <Flame className="w-4 h-4 text-emerald-700" />
            <div className="text-left">
              <p className="text-[8px] font-mono leading-none text-slate-600 uppercase font-bold">Skor</p>
              <p className="text-xs font-black text-slate-900 font-mono">
                {totalScore}
              </p>
            </div>
          </div>

          {/* Computational Thinking Percentage Progress */}
          <div className="bg-[#FDE047] border-2 border-black px-2.5 py-1 rounded-xl flex items-center gap-1.5 shadow-[2px_2px_0px_#000]">
            <Brain className="w-4 h-4 text-black animate-pulse" />
            <div className="text-left">
              <p className="text-[8px] font-mono leading-none text-slate-600 uppercase font-black">Tahapan</p>
              <p className="text-xs font-black text-slate-900 font-mono">
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
          
          {/* Stage: Introduction of current level */}
          {currentStage === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="bg-white rounded-3xl border-4 border-black shadow-[8px_8px_0px_#000000] p-5 md:p-10 text-left"
            >
              {/* Visual Cover Hero Cover */}
              <div className="bg-[#FBCFE8] border-4 border-black p-8 rounded-3xl text-black relative overflow-hidden mb-8 shadow-[4px_4px_0px_#000000]">
                <div className="absolute right-0 bottom-0 translate-y-6 translate-x-4 opacity-10">
                  <School className="w-56 h-56 text-black" />
                </div>

                <span className="font-mono text-xs font-black uppercase bg-black text-white px-3 py-1 rounded-full border border-black tracking-widest">
                  Misi Tingkat: Level {activeLevel.id}
                </span>
                
                <h2 className="text-2xl md:text-3xl font-black font-display text-black mt-4 leading-tight uppercase">
                  {activeLevel.title}
                </h2>
                <p className="text-xs md:text-sm text-slate-905 font-bold leading-relaxed mt-2 max-w-2xl">
                  {activeLevel.description}
                </p>

                <div className="mt-6 flex flex-wrap gap-4 items-center">
                  <span className="text-xs bg-[#FDE047] text-black border-2 border-black px-3 py-1.5 rounded-xl font-bold font-mono uppercase tracking-wider flex items-center gap-1.5 shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                    <Target className="w-3.5 h-3.5 text-black" />
                    Fokus: {activeLevel.focus.split(':')[0]}
                  </span>
                  <span className="text-xs bg-[#A5F3FC] text-black border-2 border-black px-3 py-1.5 rounded-xl font-bold font-mono uppercase tracking-wider shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                    Masa Kerja: {activeLevel.durationLabel}
                  </span>
                </div>
              </div>

              {/* Level pedagogical instructions */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-mono mb-3">
                    🎯 Alur Kerja Pengelolaan Data (Algoritma)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                    {[
                      { step: '1', title: 'Kumpulkan', color: 'bg-[#A5F3FC] text-black border border-black' },
                      { step: '2', title: 'Olah Tabel', color: 'bg-[#FBCFE8] text-black border border-black' },
                      { step: '3', title: 'Sajikan', color: 'bg-[#CCFBF1] text-black border border-black' },
                      { step: '4', title: 'Analisis', color: 'bg-[#FDE047] text-black border border-black' },
                      { step: '5', title: 'Kebijakan', color: 'bg-rose-500 text-white border border-black' }
                    ].map((item, i) => (
                      <div key={i} className="flex md:flex-col items-center gap-3 p-3 bg-white border-2 border-black rounded-2xl relative shadow-[3px_3px_0px_rgba(0,0,0,1)]">
                        <span className={`w-8 h-8 rounded-lg font-mono font-black border border-black flex items-center justify-center text-xs ${item.color}`}>
                          {item.step}
                        </span>
                        <span className="text-xs font-black text-slate-800">{item.title}</span>
                        {i < 4 && (
                          <ChevronRight className="hidden md:block w-4 h-4 text-black absolute -right-3.5 top-1/2 -translate-y-1/2 z-20 font-bold" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-[#CCFBF1] border-2 border-black rounded-2xl flex gap-3.5 shadow-[4px_4px_0px_rgba(0,0,0,1)] text-left">
                  <div className="p-2.5 bg-[#FDE047] text-black border-2 border-black rounded-xl shrink-0 h-11 w-11 flex items-center justify-center shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                    <Brain className="w-6 h-6 text-black animate-pulse" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs font-display">
                      Fokus Kompetensi Level Ini:
                    </h4>
                    <p className="text-[11px] text-slate-800 leading-relaxed mt-0.5 whitespace-pre-line font-black">
                      {activeLevel.focus}
                    </p>
                  </div>
                </div>

                {/* Submit buttons */}
                <div className="pt-4 border-t-2 border-black flex flex-col sm:flex-row justify-between items-center gap-4">
                  <span className="text-xs text-slate-600 font-bold">
                    Admin Kehadiran Sekolah: Siap Melakukan Tugas Kebijakan!
                  </span>
                  <button
                    type="button"
                    onClick={startCurrentLevelPlay}
                    className="brutal-btn px-8 py-4 text-xs uppercase tracking-wider h-12 w-full sm:w-auto"
                    id="btn-start-misi"
                  >
                    <Play className="w-4 h-4 text-white fill-white" />
                    <span>Masuki Ruang Misi</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

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
    </motion.div>
  );
};
