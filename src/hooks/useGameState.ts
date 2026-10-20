import { useState, useEffect, useMemo } from 'react';
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
  
  // Idempotent scores per stage so revisiting a stage doesn't exceed 100
  const [stageScores, setStageScores] = useState<{
    roster: number;
    chart: number;
    quiz: number;
  }>({ roster: 0, chart: 0, quiz: 0 });

  const totalScore = Math.min(100, Math.max(0, stageScores.roster + stageScores.chart + stageScores.quiz));
  const levelPointsAccumulator = totalScore;
  
  // Track levels unlocked by current player
  const [unlockedLevelIds, setUnlockedLevelIds] = useState<number[]>([1]);
  
  // Accumulated badges unlocked
  const [unlockedBadgeIds, setUnlockedBadgeIds] = useState<string[]>([]);
  
  // Teacher mode toggled to view any level/bypass restrictions
  const [teacherMode, setTeacherMode] = useState<boolean>(false);

  // Badge Modal State
  const [isBadgeModalOpen, setIsBadgeModalOpen] = useState<boolean>(false);

  // Intro Modal State
  const [isIntroModalOpen, setIsIntroModalOpen] = useState<boolean>(false);

  // Objectives Modal State (ditampilkan sebelum Cara Bermain)
  const [isObjectivesModalOpen, setIsObjectivesModalOpen] = useState<boolean>(false);

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

  // Active level data pointer memoized to prevent unnecessary re-render wipes
  const staticLevel = LEVELS.find(l => l.id === currentLevelId) || LEVELS[0];
  const activeLevel: GameLevel = useMemo(() => ({
    ...staticLevel,
    records: dynamicRecords.length > 0 ? dynamicRecords : staticLevel.records,
    rosters: dynamicRosters.length > 0 ? dynamicRosters : staticLevel.rosters,
    questions: dynamicQuestions.length > 0 ? dynamicQuestions : staticLevel.questions,
  }), [staticLevel, dynamicRecords, dynamicRosters, dynamicQuestions]);

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
    setStageScores({ roster: 0, chart: 0, quiz: 0 });
    
    // Every level now has dynamic rosters, so start with roster stage
    setCurrentStage('roster');
    
    setIsObjectivesModalOpen(true);
    setPageView('game');
  };

  // Tutup modal tujuan pembelajaran lalu buka modal Cara Bermain
  const closeObjectivesAndShowIntro = () => {
    playSynthesizerNote('click');
    setIsObjectivesModalOpen(false);
    setIsIntroModalOpen(true);
  };

  const startCurrentLevelPlay = () => {
    playSynthesizerNote('success');
    setIsIntroModalOpen(false);
  };

  // Stage Success callback triggers (idempotent scoring per stage)
  const handleRosterStepFinished = (bonus: number, countedRecords: any) => {
    playSynthesizerNote('success');
    setUserCountedData(countedRecords);
    setStageScores(prev => ({ ...prev, roster: bonus }));
    setCurrentStage('chart');
  };

  const handleChartStepFinished = (bonus: number) => {
    playSynthesizerNote('success');
    setStageScores(prev => ({ ...prev, chart: bonus }));
    setCurrentStage('analysis');
  };

  const handleQuizStepFinished = (bonus: number) => {
    playSynthesizerNote('unlock');
    setStageScores(prev => ({ ...prev, quiz: bonus }));

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
    // Restart current game session with the same dataset; fresh dataset generates on page refresh
    setUserCountedData(null);
    setStageScores({ roster: 0, chart: 0, quiz: 0 });
    setCurrentStage('roster');
    setIsObjectivesModalOpen(true);
  };

  const resetAllGameProgress = () => {
    playSynthesizerNote('success');
    // Generate fresh dynamic dataset for new challenge session
    const { records, rosters } = generateDynamicLevelData(1);
    const questions = generateDynamicQuestions(1, records);
    setDynamicRecords(records);
    setDynamicRosters(rosters);
    setDynamicQuestions(questions);
    
    setCurrentLevelId(1);
    setCurrentStage('roster');
    setStageScores({ roster: 0, chart: 0, quiz: 0 });
    setUnlockedLevelIds([1]);
    setUnlockedBadgeIds([]);
    setUserCountedData(null);
    setIsObjectivesModalOpen(true);
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
    isObjectivesModalOpen,
    activeLevel,
    userCountedData,
    setIsBadgeModalOpen,
    setIsIntroModalOpen,
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
    toggleTeacherMode,
    setViewStart,
    setViewGame,
  };
};
