import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play } from 'lucide-react';
import { GameLevel, GameStage } from '@/src/types';
import { StudentCounter } from '@/src/pages/arena/components/StudentCounter';
import { ChartBuilder } from '@/src/pages/arena/components/ChartBuilder';
import { QuizSection } from '@/src/pages/arena/components/QuizSection';
import { LevelComplete } from '@/src/pages/arena/components/LevelComplete';
import { AudioToggle } from '@/src/components/AudioToggle';
import { useAudio } from '@/src/hooks/useAudio';
import { playSynthesizerNote } from '@/src/utils/audio';
import logoPusbuk from '@/assets/logo-jenama.webp?v2';
import gameplayBg from '@/assets/bg-arena.webp';

interface ArenaPageProps {
  currentStage: GameStage;
  activeLevel: GameLevel;
  totalScore: number;
  levelPointsAccumulator: number;
  userCountedData?: Record<string, { present: number, permit: number, sick: number, alpha: number }> | null;
  onBackToRoadmap: () => void;
  onGoBackStage: () => void;
  isObjectivesModalOpen: boolean;
  isIntroModalOpen: boolean;
  onStartGame: () => void;
  closeObjectivesAndShowIntro: () => void;
  handleRosterStepFinished: (bonus: number, countedRecords: any) => void;
  handleChartStepFinished: (bonus: number) => void;
  handleQuizStepFinished: (bonus: number) => void;
  handleNextLevelTransition: () => void;
  resetAllGameProgress: () => void;
  getStagePercentage: (s: string) => string;
  activeLevelProgressPercentage: () => number;
  teacherMode: boolean;
  onToggleTeacherMode?: () => void;
}

export const ArenaPage: React.FC<ArenaPageProps> = ({
  currentStage,
  activeLevel,
  totalScore,
  levelPointsAccumulator,
  userCountedData,
  onBackToRoadmap,
  onGoBackStage,
  isObjectivesModalOpen,
  isIntroModalOpen,
  onStartGame,
  closeObjectivesAndShowIntro,
  handleRosterStepFinished,
  handleChartStepFinished,
  handleQuizStepFinished,
  handleNextLevelTransition,
  resetAllGameProgress,
  getStagePercentage,
  activeLevelProgressPercentage,
  teacherMode,
  onToggleTeacherMode,
}) => {
  const { isMuted, toggle } = useAudio();

  return (
    <motion.div
      key="game-page"
      initial={{ opacity: 0, scale: 0.99 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.99 }}
      className="w-full h-full flex flex-col relative overflow-hidden"
      id="arena-page"
    >
      {/* Background Image - top view classroom */}
      <div id="arena-bg-container" className="absolute inset-0 z-0 pointer-events-none">
        <img
          id="arena-bg-image"
          src={gameplayBg}
          alt="Latar Belakang Kelas"
          className="w-full h-full object-cover opacity-50"
        />
      </div>

      {/* Logo Pojok Kiri Atas - Fixed Floating on lg+ screens */}
      <div id="arena-logo-container" className="hidden lg:block fixed top-3 left-4 md:top-4 md:left-6 2xl:top-6 2xl:left-8 z-40 select-none pointer-events-none">
        <img 
          id="arena-logo-image"
          src={logoPusbuk} 
          alt="Logo Pusbuk" 
          className="lg:h-14 2xl:h-20 w-auto object-contain drop-shadow" 
        />
      </div>

      {/* Button Mute/Unmuted Pojok Kanan Atas - Fixed Floating on lg+ screens */}
      <div id="arena-audio-container" className="hidden lg:block fixed top-3 right-4 md:top-4 md:right-6 2xl:top-6 2xl:right-8 z-40 select-none">
        <AudioToggle isMuted={isMuted} onToggle={toggle} />
      </div>

      {/* MAIN LEVEL GAME ARENA VIEWPORT VIEW */}
      <div id="arena-viewport" className="flex-1 min-h-0 w-full flex flex-col relative z-10">
        <AnimatePresence mode="wait">
          
          {/* Stage: Manual list count Decomposition card */}
          {currentStage === 'roster' && (
            <motion.div id="stage-roster" key="roster" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full h-full min-h-0 flex flex-col">
              <StudentCounter 
                currentLevel={activeLevel} 
                onSuccess={handleRosterStepFinished} 
                onBack={onGoBackStage}
                teacherMode={teacherMode}
                onToggleTeacherMode={onToggleTeacherMode}
              />
            </motion.div>
          )}

          {/* Stage: Interactive Graph adjustment Abstraction (kept visible during analysis) */}
          {(currentStage === 'chart' || currentStage === 'analysis') && (
            <motion.div id="stage-chart" key="chart" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full h-full min-h-0 flex flex-col">
              <ChartBuilder 
                currentLevel={activeLevel} 
                onSuccess={handleChartStepFinished} 
                onBack={onGoBackStage}
              />
            </motion.div>
          )}

          {/* Stage: Success summary and celebratory certificates */}
          {currentStage === 'complete' && (
            <motion.div id="stage-complete" key="complete" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full h-full min-h-0 flex flex-col items-center justify-center overflow-y-auto">
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
            id="quiz-modal-overlay"
            onClick={onGoBackStage}
            className="fixed inset-0 bg-black/55 backdrop-blur-xs flex items-center justify-center p-4 z-[990] overflow-y-auto cursor-pointer"
          >
            <motion.div
              id="quiz-modal-card"
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

      {/* Level Objectives Modal Overlay - Tujuan Pembelajaran */}
      <AnimatePresence>
        {isObjectivesModalOpen && (
          <div id="objectives-modal-overlay" className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-[998] overflow-y-auto">
            <motion.div
              id="objectives-modal-card"
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="bg-white rounded-3xl border-4 border-black shadow-[6px_6px_0px_#000] p-2.5 lg:p-8 max-w-lg md:max-w-2xl w-full relative text-left flex flex-col max-h-[88vh] overflow-hidden"
            >
              {/* Header Title */}
              <div id="objectives-header" className="text-center space-y-1 md:space-y-2 border-b-2 sm:border-b-4 border-black shrink-0 pb-2 lg:pb-4">
                <h2 id="objectives-title" className="text-[17px] lg:text-2xl font-black font-display uppercase tracking-tight text-slate-900 pt-0.5 sm:pt-1">
                  Tujuan Pembelajaran
                </h2>
                <p id="objectives-level-title" className="text-[9px] sm:text-xs lg:text-base text-slate-600 font-bold uppercase tracking-wide">
                  {activeLevel.title}
                </p>
              </div>

              {/* Objective / Goal content - scrollable inside flex */}
              <div id="objectives-body" className="flex-1 overflow-y-auto py-2 lg:py-6 space-y-2 sm:space-y-4 md:space-y-5 pr-1">

                {/* Learning objective */}
                <div id="objectives-goal-row" className="flex gap-1.5 lg:gap-4 items-start p-2 lg:p-5 bg-[#FDE047]/30 border-2 sm:border-3 border-black rounded-xl sm:rounded-2xl shadow-[2px_2px_0px_#000] sm:shadow-[3px_3px_0px_#000]">
                  <div id="objectives-goal-icon" className="shrink-0 w-8 h-8 lg:w-12 lg:h-12 rounded-full bg-[#FDE047] border-2 border-black flex items-center justify-center text-sm lg:text-2xl shadow-[2px_2px_0px_#000]">🎯</div>
                  <div id="objectives-goal-text">
                    <h4 id="objectives-goal-heading" className="font-black text-[11px] lg:text-lg uppercase text-slate-900 font-display">Tujuan Pembelajaran</h4>
                    <p id="objectives-goal-desc" className="text-[9px] sm:text-xs lg:text-base text-slate-700 font-bold mt-1 leading-relaxed">{activeLevel.focus}</p>
                  </div>
                </div>

                {/* Learning outcome / what the student will be able to understand */}
                <div id="objectives-outcome-row" className="flex gap-1.5 lg:gap-4 items-start p-2 lg:p-5 bg-[#A5F3FC]/30 border-2 sm:border-3 border-black rounded-xl sm:rounded-2xl shadow-[2px_2px_0px_#000] sm:shadow-[3px_3px_0px_#000]">
                  <div id="objectives-outcome-icon" className="shrink-0 w-8 h-8 lg:w-12 lg:h-12 rounded-full bg-[#A5F3FC] border-2 border-black flex items-center justify-center text-sm lg:text-2xl shadow-[2px_2px_0px_#000]">💡</div>
                  <div id="objectives-outcome-text">
                    <h4 id="objectives-outcome-heading" className="font-black text-[11px] lg:text-lg uppercase text-slate-900 font-display">Setelah Misi Ini, Kamu Mampu</h4>
                    <ul id="objectives-outcome-list" className="text-[9px] sm:text-xs lg:text-base text-slate-700 font-bold mt-1 leading-relaxed list-disc pl-4 space-y-1">
                      <li>Menghitung dan merangkum data kehadiran siswa secara teliti.</li>
                      <li>Memilih tipe grafik yang tepat untuk menyajikan data.</li>
                      <li>Membaca pola kehadiran dan mengambil kesimpulan dari grafik.</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Continue button */}
              <div id="objectives-footer" className="pt-2.5 lg:pt-6 border-t-2 sm:border-t-4 border-black flex justify-center shrink-0">
                <button
                  id="btn-lanjut-cara-bermain"
                  type="button"
                  onClick={closeObjectivesAndShowIntro}
                  className="w-fit sm:w-full bg-[#FDE047] hover:bg-[#FACC15] text-black border-2 sm:border-4 border-black text-[11px] lg:text-lg font-black py-2.5 lg:py-4 rounded-xl sm:rounded-2xl uppercase tracking-wider cursor-pointer shadow-[2px_2px_0px_#000] sm:shadow-[4px_4px_0px_#000] active:translate-y-0.5 active:shadow-[1px_1px_0px_#000] flex items-center justify-center gap-2 font-display"
                >
                  <span>Lanjut ke Cara Bermain</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Level Intro Modal Overlay - Cara Bermain */}
      <AnimatePresence>
        {isIntroModalOpen && (
          <div id="intro-modal-overlay" className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-[999] overflow-y-auto">
            <motion.div
              id="intro-modal-card"
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="bg-white rounded-3xl border-4 border-black shadow-[6px_6px_0px_#000] p-2.5 lg:p-8 max-w-lg md:max-w-2xl w-full relative text-left flex flex-col max-h-[88vh] overflow-hidden"
            >
              {/* Header Title */}
              <div id="intro-header" className="text-center space-y-1 md:space-y-2 border-b-2 sm:border-b-4 border-black shrink-0">
                <h2 id="intro-title" className="text-[17px] lg:text-2xl font-black font-display uppercase tracking-tight text-slate-900 pt-0.5 sm:pt-1">
                  Cara Bermain
                </h2>
              </div>

              {/* Dynamic steps based on gameplay flow - scrollable inside flex */}
              <div id="intro-steps" className="flex-1 overflow-y-auto py-2 lg:py-6 space-y-2 sm:space-y-4 md:space-y-5 pr-1">
                <div id="intro-step-1" className="flex gap-1.5 lg:gap-4 items-start p-2 lg:p-5 bg-[#A5F3FC]/30 border-2 sm:border-3 border-black rounded-xl sm:rounded-2xl shadow-[2px_2px_0px_#000] sm:shadow-[3px_3px_0px_#000]">
                  <div>
                    <h4 id="intro-step-1-title" className="font-black text-[11px] lg:text-lg uppercase text-slate-900 font-display">1. Hitung Kehadiran</h4>
                    <p id="intro-step-1-desc" className="text-[9px] sm:text-xs lg:text-base text-slate-700 font-bold mt-1 leading-relaxed">Hitung jumlah siswa Hadir dan Tidak Hadir di lembar absen manual harian.</p>
                  </div>
                </div>

                <div id="intro-step-2" className="flex gap-1.5 lg:gap-4 items-start p-2 lg:p-5 bg-[#CCFBF1]/30 border-2 sm:border-3 border-black rounded-xl sm:rounded-2xl shadow-[2px_2px_0px_#000] sm:shadow-[3px_3px_0px_#000]">
                  <div>
                    <h4 id="intro-step-2-title" className="font-black text-[11px] lg:text-lg uppercase text-slate-900 font-display">2. Pilih Tipe Grafik</h4>
                    <p id="intro-step-2-desc" className="text-[9px] sm:text-xs lg:text-base text-slate-700 font-bold mt-1 leading-relaxed">Pilih tipe diagram untuk memvisualisasikan data kehadiran.</p>
                  </div>
                </div>

                <div id="intro-step-3" className="flex gap-1.5 lg:gap-4 items-start p-2 lg:p-5 bg-[#FDE047]/30 border-2 sm:border-3 border-black rounded-xl sm:rounded-2xl shadow-[2px_2px_0px_#000] sm:shadow-[3px_3px_0px_#000]">
                  <div>
                    <h4 id="intro-step-3-title" className="font-black text-[11px] lg:text-lg uppercase text-slate-900 font-display">3. Analisis Pola</h4>
                    <p id="intro-step-3-desc" className="text-[9px] sm:text-xs lg:text-base text-slate-700 font-bold mt-1 leading-relaxed">Amati pola grafik dan jawab beberapa pertanyaan kuis analisis data.</p>
                  </div>
                </div>
              </div>

              {/* Start button */}
              <div id="intro-footer" className="pt-2.5 lg:pt-6 border-t-2 sm:border-t-4 border-black flex justify-center shrink-0">
                <button
                  id="btn-start-misi"
                  type="button"
                  onClick={() => {
                    playSynthesizerNote('click');
                    onStartGame();
                  }}
                  className="w-fit sm:w-full bg-[#FDE047] hover:bg-[#FACC15] text-black border-2 sm:border-4 border-black text-[11px] lg:text-lg font-black py-2.5 lg:py-4 rounded-xl sm:rounded-2xl uppercase tracking-wider cursor-pointer shadow-[2px_2px_0px_#000] sm:shadow-[4px_4px_0px_#000] active:translate-y-0.5 active:shadow-[1px_1px_0px_#000] flex items-center justify-center gap-2 font-display"
                >
                  <Play id="intro-play-icon" className="w-4 h-4 lg:w-6 lg:h-6 text-black fill-black animate-pulse" />
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
