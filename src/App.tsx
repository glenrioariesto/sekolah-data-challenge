import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { useGameState } from '@/src/hooks/useGameState';
import { SplashPage } from '@/src/pages/splash/SplashPage';
import { ArenaPage } from '@/src/pages/arena/ArenaPage';
import { BadgeModal } from '@/src/components/BadgeModal';
import { PortraitWarning } from '@/src/components/PortraitWarning';
import { setupAutoplayUnlock, playSynthesizerNote } from '@/src/utils/audio';

export default function App() {
  const {
    pageView,
    unlockedLevelIds,
    unlockedBadgeIds,
    totalScore,
    teacherMode,
    isBadgeModalOpen,
    isIntroModalOpen,
    isObjectivesModalOpen,
    activeLevel,
    currentStage,
    levelPointsAccumulator,
    userCountedData,
    setIsBadgeModalOpen,
    toggleTeacherMode,
    selectLevelFromHub,
    closeObjectivesAndShowIntro,
    startCurrentLevelPlay,
    handleRosterStepFinished,
    handleChartStepFinished,
    handleQuizStepFinished,
    handleNextLevelTransition,
    resetAllGameProgress,
    handleGoBackStage,
    getStagePercentage,
    activeLevelProgressPercentage,
    setViewStart,
  } = useGameState();

  const [showFullscreenPrompt, setShowFullscreenPrompt] = useState(false);

  useEffect(() => {
    setupAutoplayUnlock();

    // Munculkan modal layar penuh otomatis setiap kali halaman dibuka atau di-refresh.
    setShowFullscreenPrompt(true);
  }, []);

  // Fallback: tombol Mulai langsung memulai game (tanpa menunggu modal)
  const handleStartFromSplash = () => {
    selectLevelFromHub(1);
  };

  const enterFullscreen = async () => {
    playSynthesizerNote('click');
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
    } catch (err) {
      console.warn("Fullscreen permission denied or not supported by browser", err);
    }
    setShowFullscreenPrompt(false);
  };

  const dismissFullscreenPrompt = () => {
    playSynthesizerNote('click');
    setShowFullscreenPrompt(false);
  };

  return (
    <div id="app-root" className="h-screen max-h-screen w-screen overflow-hidden bg-slate-50 flex flex-col antialiased font-sans select-none relative">
      {/* Landscape orientation warning overlay */}
      <PortraitWarning />

      {/* Mode Layar Penuh Modal - Neobrutalism Style (#FDE047 yellow button, black borders, hard shadow) */}
      {showFullscreenPrompt && (
        <div id="fullscreen-prompt-overlay" className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 select-none animate-fadeIn">
          <div id="fullscreen-prompt-card" className="relative max-w-sm w-full mx-auto bg-white border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] rounded-3xl p-6 sm:p-8 flex flex-col items-center text-center">
            <div id="fullscreen-prompt-icon-wrap" className="relative flex items-center justify-center mb-6">
              <div id="fullscreen-prompt-ping" className="absolute w-20 h-20 bg-[#FDE047]/30 rounded-full animate-ping opacity-75" />
              <div id="fullscreen-prompt-icon" className="w-16 h-16 bg-[#FDE047] border-2 border-black rounded-2xl flex items-center justify-center text-3xl shadow-[3px_3px_0px_rgba(0,0,0,1)] z-10">
                📺
              </div>
            </div>

            <h3 id="fullscreen-prompt-title" className="text-lg sm:text-xl font-black text-slate-900 tracking-tight mb-2 uppercase font-display">
              Mode Layar Penuh
            </h3>
            
            <p id="fullscreen-prompt-text" className="text-xs sm:text-sm text-slate-700 font-bold leading-relaxed mb-6">
              Apakah Anda ingin masuk ke mode layar penuh?
            </p>

            <div id="fullscreen-prompt-actions" className="flex items-center gap-3 w-full">
              <button
                id="btn-fullscreen-yes"
                type="button"
                onClick={enterFullscreen}
                className="flex-1 bg-[#FDE047] hover:bg-[#FACC15] text-black font-black py-2.5 rounded-xl border-2 border-black shadow-[3px_3px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer font-display uppercase tracking-wide text-xs"
              >
                Yes
              </button>
              
              <button
                id="btn-fullscreen-no"
                type="button"
                onClick={dismissFullscreenPrompt}
                className="flex-1 bg-slate-100 hover:bg-slate-200 border-2 border-black text-slate-800 font-black py-2.5 rounded-xl shadow-[3px_3px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer font-display uppercase tracking-wide text-xs"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        {pageView === 'start' && (
          <SplashPage
            onStartGame={handleStartFromSplash}
          />
        )}

        {pageView === 'game' && (
          <ArenaPage
            currentStage={currentStage}
            activeLevel={activeLevel}
            totalScore={totalScore}
            levelPointsAccumulator={levelPointsAccumulator}
            userCountedData={userCountedData}
            onBackToRoadmap={setViewStart}
            onGoBackStage={handleGoBackStage}
            isObjectivesModalOpen={isObjectivesModalOpen}
            isIntroModalOpen={isIntroModalOpen}
            onStartGame={startCurrentLevelPlay}
            closeObjectivesAndShowIntro={closeObjectivesAndShowIntro}
            handleRosterStepFinished={handleRosterStepFinished}
            handleChartStepFinished={handleChartStepFinished}
            handleQuizStepFinished={handleQuizStepFinished}
            handleNextLevelTransition={handleNextLevelTransition}
            resetAllGameProgress={resetAllGameProgress}
            getStagePercentage={getStagePercentage}
            activeLevelProgressPercentage={activeLevelProgressPercentage}
            teacherMode={teacherMode}
            onToggleTeacherMode={toggleTeacherMode}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isBadgeModalOpen && (
          <BadgeModal
            isOpen={isBadgeModalOpen}
            unlockedBadgeIds={unlockedBadgeIds}
            onClose={() => setIsBadgeModalOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Footer Copyright: Hanya tampil di halaman tanpa kontrol (Splash) */}
      {pageView === 'start' && (
        <footer className="fixed bottom-1.5 left-0 right-0 z-40 text-center pointer-events-none select-none text-[10px] text-slate-300 font-medium tracking-wide">
          Copyright 2026 Pusat Perbukuan
        </footer>
      )}
    </div>
  );
}
