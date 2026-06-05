import React from 'react';
import { AnimatePresence } from 'motion/react';
import { useGameState } from '@/src/hooks/useGameState';
import { SplashPage } from '@/src/pages/splash/SplashPage';
import { DashboardPage } from '@/src/pages/dashboard/DashboardPage';
import { ArenaPage } from '@/src/pages/arena/ArenaPage';
import { BadgeModal } from '@/src/components/BadgeModal';

export default function App() {
  const {
    pageView,
    unlockedLevelIds,
    unlockedBadgeIds,
    totalScore,
    teacherMode,
    isBadgeModalOpen,
    activeLevel,
    currentStage,
    levelPointsAccumulator,
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
    getStagePercentage,
    activeLevelProgressPercentage,
    setViewStart,
    setViewRoadmap,
  } = useGameState();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col antialiased font-sans select-none pb-12">
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
            onOpenBadges={() => setIsBadgeModalOpen(true)}
            onBack={setViewStart}
          />
        )}

        {pageView === 'game' && (
          <ArenaPage
            currentStage={currentStage}
            activeLevel={activeLevel}
            totalScore={totalScore}
            levelPointsAccumulator={levelPointsAccumulator}
            onBackToRoadmap={setViewRoadmap}
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
