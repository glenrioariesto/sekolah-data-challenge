import { useState, useEffect } from 'react';
import { GameStage, GameLevel } from '@/src/types';
import { LEVELS, BADGES } from '@/src/data/levels';
import { playSynthesizerNote } from '@/src/utils/audio';

export const useGameState = () => {
  // Navigation states: 'start' (Beranda Utama) | 'roadmap' (Peta Misi) | 'game' (Arena Misi)
  const [pageView, setPageView] = useState<'start' | 'roadmap' | 'game'>('start');
  
  // Game & score states
  const [currentLevelId, setCurrentLevelId] = useState<number>(1);
  const [currentStage, setCurrentStage] = useState<GameStage>('roster');
  const [totalScore, setTotalScore] = useState<number>(0);
  
  // Track levels unlocked by current player
  const [unlockedLevelIds, setUnlockedLevelIds] = useState<number[]>([1]);
  
  // Accumulated badges unlocked
  const [unlockedBadgeIds, setUnlockedBadgeIds] = useState<string[]>([]);
  
  // Teacher mode toggled to view any level/bypass restrictions
  const [teacherMode, setTeacherMode] = useState<boolean>(false);

  // Gained points during the current interactive level session
  const [levelPointsAccumulator, setLevelPointsAccumulator] = useState<number>(0);

  // Badge Modal State
  const [isBadgeModalOpen, setIsBadgeModalOpen] = useState<boolean>(false);

  // Intro Modal State
  const [isIntroModalOpen, setIsIntroModalOpen] = useState<boolean>(false);

  // Active level data pointer
  const activeLevel = LEVELS.find(l => l.id === currentLevelId) || LEVELS[0];

  useEffect(() => {
    // Initialise or lock badge checks
    const badgesToUnlock = [...unlockedBadgeIds];
    LEVELS.forEach(lvl => {
      const b = BADGES.find(badge => badge.achievedAtLevel === lvl.id);
      if (b && unlockedLevelIds.includes(lvl.id + 1) && !badgesToUnlock.includes(b.id)) {
        badgesToUnlock.push(b.id);
      }
    });
    setUnlockedBadgeIds(badgesToUnlock);
  }, [unlockedLevelIds]);

  const selectLevelFromHub = (levelId: number) => {
    playSynthesizerNote('btn');
    if (!unlockedLevelIds.includes(levelId) && !teacherMode) return;
    
    setCurrentLevelId(levelId);
    setLevelPointsAccumulator(0);
    
    const targetLvl = LEVELS.find(l => l.id === levelId) || LEVELS[0];
    if (targetLvl.rosters && targetLvl.rosters.length > 0) {
      setCurrentStage('roster');
    } else {
      setCurrentStage('input');
    }
    
    setIsIntroModalOpen(true);
    setPageView('game');
  };

  const startCurrentLevelPlay = () => {
    playSynthesizerNote('success');
    setIsIntroModalOpen(false);
  };

  // Stage Success callback triggers
  const handleRosterStepFinished = (bonus: number) => {
    playSynthesizerNote('success');
    setLevelPointsAccumulator(prev => prev + bonus);
    setTotalScore(prev => prev + bonus);
    setCurrentStage('input');
  };

  const handleTableStepFinished = (bonus: number) => {
    playSynthesizerNote('success');
    setLevelPointsAccumulator(prev => prev + bonus);
    setTotalScore(prev => prev + bonus);
    setCurrentStage('chart');
  };

  const handleChartStepFinished = (bonus: number) => {
    playSynthesizerNote('success');
    setLevelPointsAccumulator(prev => prev + bonus);
    setTotalScore(prev => prev + bonus);
    setCurrentStage('analysis');
  };

  const handleQuizStepFinished = (bonus: number) => {
    playSynthesizerNote('success');
    setLevelPointsAccumulator(prev => prev + bonus);
    setTotalScore(prev => prev + bonus);
    setCurrentStage('decision');
  };

  const handleDecisionStepFinished = (bonus: number) => {
    playSynthesizerNote('unlock');
    setLevelPointsAccumulator(prev => prev + bonus);
    setTotalScore(prev => prev + bonus);

    // Update level progressions
    if (!unlockedLevelIds.includes(currentLevelId + 1) && currentLevelId < 5) {
      setUnlockedLevelIds(prev => [...prev, currentLevelId + 1]);
    }

    // Automatically check newly earned badge
    const potentialBadge = BADGES.find(b => b.achievedAtLevel === currentLevelId);
    if (potentialBadge && !unlockedBadgeIds.includes(potentialBadge.id)) {
      setUnlockedBadgeIds(prev => [...prev, potentialBadge.id]);
    }

    setCurrentStage('complete');
  };

  const handleNextLevelTransition = () => {
    playSynthesizerNote('btn');
    if (currentLevelId < 5) {
      const nextId = currentLevelId + 1;
      setCurrentLevelId(nextId);
      setLevelPointsAccumulator(0);
      
      const nextLvl = LEVELS.find(l => l.id === nextId) || LEVELS[0];
      if (nextLvl.rosters && nextLvl.rosters.length > 0) {
        setCurrentStage('roster');
      } else {
        setCurrentStage('input');
      }
      setIsIntroModalOpen(true);
    } else {
      setPageView('roadmap');
    }
  };

  const resetAllGameProgress = () => {
    playSynthesizerNote('success');
    setCurrentLevelId(1);
    setCurrentStage('roster');
    setTotalScore(0);
    setUnlockedLevelIds([1]);
    setUnlockedBadgeIds([]);
    setLevelPointsAccumulator(0);
    setIsIntroModalOpen(false);
    setPageView('start');
  };

  const getStagePercentage = (s: string) => {
    switch (s) {
      case 'intro': return 'Pendaftaran';
      case 'roster': return 'Dekomposisi';
      case 'input': return 'Organisasi';
      case 'chart': return 'Abstraksi';
      case 'analysis': return 'Pola';
      case 'decision': return 'Literasi Kebijakan';
      case 'complete': return 'Misi Selesai';
      default: return 'Progress';
    }
  };

  const activeLevelProgressPercentage = () => {
    switch (currentStage) {
      case 'roster': return 25;
      case 'input': return 45;
      case 'chart': return 65;
      case 'analysis': return 80;
      case 'decision': return 95;
      case 'complete': return 100;
      default: return 0;
    }
  };

  const toggleTeacherMode = () => {
    playSynthesizerNote('btn');
    setTeacherMode(prev => !prev);
  };

  const setViewStart = () => {
    playSynthesizerNote('btn');
    setPageView('start');
  };

  const setViewRoadmap = () => {
    playSynthesizerNote('success');
    setPageView('roadmap');
  };

  const setViewGame = () => {
    playSynthesizerNote('success');
    setPageView('game');
  };

  return {
    pageView,
    currentLevelId,
    currentStage,
    totalScore,
    unlockedLevelIds,
    unlockedBadgeIds,
    teacherMode,
    levelPointsAccumulator,
    isBadgeModalOpen,
    isIntroModalOpen,
    activeLevel,
    setIsBadgeModalOpen,
    setIsIntroModalOpen,
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
    toggleTeacherMode,
    setViewStart,
    setViewRoadmap,
    setViewGame,
  };
};
