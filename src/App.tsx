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
    <div className="h-screen max-h-screen w-screen overflow-hidden bg-slate-50 flex flex-col antialiased font-sans select-none relative">
      {/* Landscape orientation warning overlay */}
      <div className="fixed inset-0 z-[9999] bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center space-y-6 portrait:flex landscape:hidden">
        <div className="w-20 h-20 bg-[#FDE047] border-4 border-black rounded-3xl flex items-center justify-center text-4xl shadow-[4px_4px_0px_#000] animate-bounce text-black">
          🔄
        </div>
        <h1 className="text-2xl font-black uppercase tracking-tight text-[#FDE047] font-display">
          Putar Layar Anda!
        </h1>
        <p className="text-sm font-semibold max-w-xs leading-relaxed text-slate-300">
          Tantangan Sekolah Data dioptimalkan untuk tampilan mendatar (landscape). Aktifkan rotasi layar otomatis pada perangkat Anda dan putar perangkat.
        </p>
      </div>

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
