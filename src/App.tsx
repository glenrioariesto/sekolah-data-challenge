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
    activeLevel,
    currentStage,
    levelPointsAccumulator,
    userCountedData,
    setIsBadgeModalOpen,
    toggleTeacherMode,
    selectLevelFromHub,
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
  }, []);

  const handleStartFromSplash = () => {
    const isFullscreenSupported = typeof document !== 'undefined' && !!document.documentElement.requestFullscreen;
    const isCurrentlyFullscreen = typeof document !== 'undefined' && !!document.fullscreenElement;
    if (isFullscreenSupported && !isCurrentlyFullscreen) {
      setShowFullscreenPrompt(true);
    } else {
      selectLevelFromHub(1);
    }
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
    selectLevelFromHub(1);
  };

  return (
    <div className="h-screen max-h-screen w-screen overflow-hidden bg-slate-50 flex flex-col antialiased font-sans select-none relative">
      {/* Landscape orientation warning overlay */}
      <PortraitWarning />

      {/* Mode Layar Penuh Modal - Neobrutalism Style (#FDE047 yellow button, black borders, hard shadow) */}
      {showFullscreenPrompt && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 select-none animate-fadeIn">
          <div className="relative max-w-sm w-full mx-auto bg-white border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] rounded-3xl p-6 sm:p-8 flex flex-col items-center text-center">
            <div className="relative flex items-center justify-center mb-6">
              <div className="absolute w-20 h-20 bg-[#FDE047]/30 rounded-full animate-ping opacity-75" />
              <div className="w-16 h-16 bg-[#FDE047] border-2 border-black rounded-2xl flex items-center justify-center text-3xl shadow-[3px_3px_0px_rgba(0,0,0,1)] z-10">
                📺
              </div>
            </div>

            <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight mb-2 uppercase font-display">
              Mode Layar Penuh
            </h3>
            
            <p className="text-xs sm:text-sm text-slate-700 font-bold leading-relaxed mb-6">
              Apakah Anda ingin masuk ke mode layar penuh?
            </p>

            <div className="flex items-center gap-3 w-full">
              <button
                type="button"
                onClick={enterFullscreen}
                className="flex-1 bg-[#FDE047] hover:bg-[#FACC15] text-black font-black py-2.5 rounded-xl border-2 border-black shadow-[3px_3px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer font-display uppercase tracking-wide text-xs"
              >
                Yes
              </button>
              
              <button
                type="button"
                onClick={() => {
                  playSynthesizerNote('click');
                  setShowFullscreenPrompt(false);
                  selectLevelFromHub(1);
                }}
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
            startCurrentLevelPlay={startCurrentLevelPlay}
            handleRosterStepFinished={handleRosterStepFinished}
            handleChartStepFinished={handleChartStepFinished}
            handleQuizStepFinished={handleQuizStepFinished}
            handleNextLevelTransition={handleNextLevelTransition}
            resetAllGameProgress={resetAllGameProgress}
            getStagePercentage={getStagePercentage}
            activeLevelProgressPercentage={activeLevelProgressPercentage}
            isIntroModalOpen={isIntroModalOpen}
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
    </div>
  );
}
