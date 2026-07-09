import { useState, useEffect } from 'react';
import { GameStage, GameLevel, AttendanceRecord, DailyRoster, QuizQuestion } from '@/src/types';
import { LEVELS, BADGES } from '@/src/data/levels';
import { playSynthesizerNote } from '@/src/utils/audio';
import { generateDynamicLevelData, generateDynamicQuestions } from '@/src/utils/dataGenerator';

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

  // Dynamic level data states
  const [dynamicRecords, setDynamicRecords] = useState<AttendanceRecord[]>([]);
  const [dynamicRosters, setDynamicRosters] = useState<DailyRoster[]>([]);
  const [dynamicQuestions, setDynamicQuestions] = useState<QuizQuestion[]>([]);

  // Prefilled count data from roster stage
  const [userCountedData, setUserCountedData] = useState<Record<string, { present: number, permit: number, sick: number, alpha: number }> | null>(null);

  useEffect(() => {
    const { records, rosters } = generateDynamicLevelData(currentLevelId);
    const questions = generateDynamicQuestions(currentLevelId, records);
    setDynamicRecords(records);
    setDynamicRosters(rosters);
    setDynamicQuestions(questions);
    setUserCountedData(null); // Reset prefilled data for new level
  }, [currentLevelId]);

  // Active level data pointer
  const staticLevel = LEVELS.find(l => l.id === currentLevelId) || LEVELS[0];
  const activeLevel: GameLevel = {
    ...staticLevel,
    records: dynamicRecords.length > 0 ? dynamicRecords : staticLevel.records,
    rosters: dynamicRosters.length > 0 ? dynamicRosters : staticLevel.rosters,
    questions: dynamicQuestions.length > 0 ? dynamicQuestions : staticLevel.questions,
  };

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
    
    // Every level now has dynamic rosters, so start with roster stage
    setCurrentStage('roster');
    
    setIsIntroModalOpen(true);
    setPageView('game');
  };

  const startCurrentLevelPlay = () => {
    playSynthesizerNote('success');
    setIsIntroModalOpen(false);
  };

  // Stage Success callback triggers
  const handleRosterStepFinished = (bonus: number, countedRecords: any) => {
    playSynthesizerNote('success');
    setUserCountedData(countedRecords);
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
    playSynthesizerNote('unlock');
    setLevelPointsAccumulator(prev => prev + bonus);
    setTotalScore(prev => prev + bonus);

    // Update level progressions
    if (!unlockedLevelIds.includes(currentLevelId + 1) && currentLevelId < LEVELS.length) {
      setUnlockedLevelIds(prev => [...prev, currentLevelId + 1]);
    }

    // Automatically check newly earned badge
    const potentialBadge = BADGES.find(b => b.achievedAtLevel === currentLevelId);
    if (potentialBadge && !unlockedBadgeIds.includes(potentialBadge.id)) {
      setUnlockedBadgeIds(prev => [...prev, potentialBadge.id]);
    }

    setCurrentStage('complete');
  };

  const handleGoBackStage = () => {
    playSynthesizerNote('btn');
    if (currentStage === 'chart') {
      setCurrentStage('roster');
    } else if (currentStage === 'analysis') {
      setCurrentStage('chart');
    } else if (currentStage === 'roster') {
      setPageView('start');
    }
  };

  const handleNextLevelTransition = () => {
    playSynthesizerNote('btn');
    if (currentLevelId < LEVELS.length) {
      const nextId = currentLevelId + 1;
      setCurrentLevelId(nextId);
      setLevelPointsAccumulator(0);
      
      setCurrentStage('roster');
      setIsIntroModalOpen(true);
    } else {
      setPageView('start');
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
    setUserCountedData(null);
    setIsIntroModalOpen(false);
    setPageView('start');
  };

  const getStagePercentage = (s: string) => {
    switch (s) {
      case 'intro': return 'Pendaftaran';
      case 'roster': return 'Dekomposisi';
      case 'chart': return 'Abstraksi';
      case 'analysis': return 'Pola';
      case 'complete': return 'Misi Selesai';
      default: return 'Progress';
    }
  };

  const activeLevelProgressPercentage = () => {
    switch (currentStage) {
      case 'roster': return 33;
      case 'chart': return 66;
      case 'analysis': return 90;
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
    userCountedData,
    setIsBadgeModalOpen,
    setIsIntroModalOpen,
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
    toggleTeacherMode,
    setViewStart,
    setViewGame,
  };
};
