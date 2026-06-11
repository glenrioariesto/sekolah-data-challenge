import React from 'react';
import { AnimatePresence } from 'motion/react';
import { useGameState } from '@/src/hooks/useGameState';
import { SplashPage } from '@/src/pages/splash/SplashPage';
import { DashboardPage } from '@/src/pages/dashboard/DashboardPage';
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
    handleTableStepFinished,
    handleChartStepFinished,
    handleQuizStepFinished,
    handleDecisionStepFinished,
    handleNextLevelTransition,
    resetAllGameProgress,
    handleGoBackStage,
    getStagePercentage,
    activeLevelProgressPercentage,
    setViewStart,
    setViewRoadmap,
  } = useGameState();

  return (
    <div className="h-screen max-h-screen w-screen overflow-hidden bg-slate-50 flex flex-col antialiased font-sans select-none relative">
      {/* Landscape orientation warning overlay */}
      <PortraitWarning />

      <AnimatePresence mode="wait">
        {pageView === 'start' && (
          <SplashPage
            onStartGame={setViewRoadmap}
          />
        )}

        {pageView === 'roadmap' && (
          <DashboardPage
            unlockedLevelIds={unlockedLevelIds}
            totalScore={totalScore}
            unlockedBadgeIds={unlockedBadgeIds}
            teacherMode={teacherMode}
            onToggleTeacherMode={toggleTeacherMode}
            onSelectLevel={selectLevelFromHub}
            onBack={setViewStart}
          />
        )}

        {pageView === 'game' && (
          <ArenaPage
            currentStage={currentStage}
            activeLevel={activeLevel}
            totalScore={totalScore}
            levelPointsAccumulator={levelPointsAccumulator}
            userCountedData={userCountedData}
            onBackToRoadmap={setViewRoadmap}
            onGoBackStage={handleGoBackStage}
            startCurrentLevelPlay={startCurrentLevelPlay}
            handleRosterStepFinished={handleRosterStepFinished}
            handleTableStepFinished={handleTableStepFinished}
            handleChartStepFinished={handleChartStepFinished}
            handleQuizStepFinished={handleQuizStepFinished}
            handleDecisionStepFinished={handleDecisionStepFinished}
            handleNextLevelTransition={handleNextLevelTransition}
            resetAllGameProgress={resetAllGameProgress}
            getStagePercentage={getStagePercentage}
            activeLevelProgressPercentage={activeLevelProgressPercentage}
            isIntroModalOpen={isIntroModalOpen}
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
