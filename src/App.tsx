import React from 'react';
import { AnimatePresence } from 'motion/react';
import { useGameState } from '@/src/hooks/useGameState';
import { SplashPage } from '@/src/pages/splash/SplashPage';
import { ArenaPage } from '@/src/pages/arena/ArenaPage';
import { BadgeModal } from '@/src/components/BadgeModal';
import { PortraitWarning } from '@/src/components/PortraitWarning';

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

  return (
    <div className="h-screen max-h-screen w-screen overflow-hidden bg-slate-50 flex flex-col antialiased font-sans select-none relative">
      {/* Landscape orientation warning overlay */}
      <PortraitWarning />

      <AnimatePresence mode="wait">
        {pageView === 'start' && (
          <SplashPage
            onStartGame={() => selectLevelFromHub(1)}
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
