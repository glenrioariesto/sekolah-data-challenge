import React, { useState } from 'react';
import { DailyRoster, GameLevel } from '@/src/types';
import { motion, AnimatePresence } from 'motion/react';
import { Check, AlertCircle, HelpCircle, ClipboardCheck, Info, UserCheck, UserX } from 'lucide-react';

import bgCewe from '@/assets/background-cewe.svg';
import bgCowo from '@/assets/background-cowo.svg';
import papanNama from '@/assets/papan-nama.svg';

import cewePisah1 from '@/assets/cewe-pisah-1.svg';
import cewePisah2 from '@/assets/cewe-pisah-2.svg';
import cewePisah3 from '@/assets/cewe-pisah-3.svg';
import cewePisah4 from '@/assets/cewe-pisah-4.svg';

import cowoPisah1 from '@/assets/cowo-pisah-1.svg';
import cowoPisah2 from '@/assets/cowo-pisah-2.svg';
import cowoPisah3 from '@/assets/cowo-pisah-3.svg';
import cowoPisah4 from '@/assets/cowo-pisah-4.svg';

const isFemale = (name: string): boolean => {
  const lower = name.toLowerCase();
  const femaleList = ['cici', 'eka', 'fani', 'gita', 'kirana', 'lia', 'nita', 'siti', 'susi', 'ani', 'dewi', 'putri', 'rara', 'tari', 'wulan', 'yuni', 'putu', 'made', 'ketut', 'nyoman'];
  if (femaleList.some(f => lower.includes(f))) return true;
  const males = ['budi', 'andi', 'dodi', 'hari', 'joko', 'iwan', 'adi'];
  if (males.some(m => lower.includes(m))) return false;
  return lower.endsWith('a') || lower.endsWith('i');
};

interface StudentCounterProps {
  currentLevel: GameLevel;
  onSuccess: (scoreBonus: number, countedRecords: any) => void;
  onBack?: () => void;
  teacherMode?: boolean;
}

export const StudentCounter: React.FC<StudentCounterProps> = ({
  currentLevel,
  onSuccess,
  onBack,
  teacherMode = false,
}) => {
  const rosters = currentLevel.rosters || [];

  const getStudentAvatar = (name: string) => {
    const isCewe = isFemale(name);
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash += name.charCodeAt(i);
    }
    const index = (hash % 4) + 1;
    const bg = isCewe ? bgCewe : bgCowo;
    let pisah = cewePisah1;
    if (isCewe) {
      if (index === 1) pisah = cewePisah1;
      else if (index === 2) pisah = cewePisah2;
      else if (index === 3) pisah = cewePisah3;
      else if (index === 4) pisah = cewePisah4;
    } else {
      if (index === 1) pisah = cowoPisah1;
      else if (index === 2) pisah = cowoPisah2;
      else if (index === 3) pisah = cowoPisah3;
      else if (index === 4) pisah = cowoPisah4;
    }
    return { bg, pisah };
  };
  
  // Track selected tab/day for list viewing
  const [activeTab, setActiveTab] = useState<number>(0);
  const [currentTab, setCurrentTab] = useState<number>(0);
  const [isFlipping, setIsFlipping] = useState<boolean>(false);
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev'>('next');

  const tabRefs = React.useRef<(HTMLButtonElement | null)[]>([]);

  React.useEffect(() => {
    if (activeTab !== currentTab) {
      setFlipDirection(activeTab > currentTab ? 'next' : 'prev');
      setIsFlipping(true);
      
      const timer = setTimeout(() => {
        setCurrentTab(activeTab);
        setIsFlipping(false);
      }, 500); // Animation duration (500ms)
      return () => clearTimeout(timer);
    }
  }, [activeTab, currentTab]);

  React.useEffect(() => {
    const activeBtn = tabRefs.current[activeTab];
    if (activeBtn) {
      activeBtn.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  }, [activeTab]);
  
  // Highlighting mechanism (helps children checkoff named students while counting)
  const [highlightedStudents, setHighlightedStudents] = useState<Record<string, boolean>>({});

  // User input counts: Record<dayName, { present, permit, sick, alpha }>
  const [inputs, setInputs] = useState<Record<string, { present: string, permit: string, sick: string, alpha: string }>>(() => {
    const initial: Record<string, { present: string, permit: string, sick: string, alpha: string }> = {};
    rosters.forEach(r => {
      initial[r.day] = { present: '', permit: '', sick: '', alpha: '' };
    });
    return initial;
  });

  // Track validation states and help warnings
  const [errorWarning, setErrorWarning] = useState<string | null>(null);
  const [attempted, setAttempted] = useState<boolean>(false);

  // Auto-dismiss warning toast after 4 seconds
  React.useEffect(() => {
    if (errorWarning) {
      const timer = setTimeout(() => {
        setErrorWarning(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [errorWarning]);

  // Track days that have been autofilled using hint helper
  const [autofilledDays, setAutofilledDays] = useState<string[]>([]);

  const toggleHighlight = (day: string, index: number) => {
    const key = `${day}-${index}`;
    setHighlightedStudents(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleInputChange = (day: string, field: 'present' | 'permit' | 'sick' | 'alpha', value: string) => {
    setInputs(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value
      }
    }));
    setErrorWarning(null); // Reset when student tries to fix it
  };

  const handleAutofillHelper = (day: string) => {
    // If not in teacherMode, enforce a maximum of 1 day limit
    if (!teacherMode) {
      if (autofilledDays.length > 0 && !autofilledDays.includes(day)) {
        setErrorWarning("⚠️ Batas penggunaan petunjuk adalah 1 hari saja.");
        return;
      }
      if (!autofilledDays.includes(day)) {
        setAutofilledDays(prev => [...prev, day]);
      }
    }

    const dailyRoster = rosters.find(r => r.day === day);
    if (!dailyRoster) return;
    const actualPresent = dailyRoster.students.filter(s => s.status === 'Hadir').length;
    const actualPermit = dailyRoster.students.filter(s => s.status === 'Izin').length;
    const actualSick = dailyRoster.students.filter(s => s.status === 'Sakit').length;
    const actualAlpha = dailyRoster.students.filter(s => s.status === 'Alfa').length;
    
    setInputs(prev => ({
      ...prev,
      [day]: {
        present: actualPresent.toString(),
        permit: actualPermit.toString(),
        sick: actualSick.toString(),
        alpha: actualAlpha.toString()
      }
    }));
  };

  const verifyCounts = () => {
    setAttempted(true);
    setErrorWarning(null);

    // Validate that all fields have been filled
    for (let rIdx = 0; rIdx < rosters.length; rIdx++) {
      const r = rosters[rIdx];
      const pVal = inputs[r.day]?.present.trim();
      const iVal = inputs[r.day]?.permit.trim();
      const sVal = inputs[r.day]?.sick.trim();
      const aVal = inputs[r.day]?.alpha.trim();
      if (!pVal || !iVal || !sVal || !aVal) {
        setErrorWarning(`⚠️ Mohon isi semua kolom Hadir, Izin, Sakit, dan Alfa untuk hari ${r.day}!`);
        setActiveTab(rIdx); // Switch to the incomplete day tab/page automatically!
        return;
      }
    }

    // Now check figures
    for (let rIdx = 0; rIdx < rosters.length; rIdx++) {
      const r = rosters[rIdx];
      const userPresent = parseInt(inputs[r.day].present, 10);
      const userPermit = parseInt(inputs[r.day].permit, 10);
      const userSick = parseInt(inputs[r.day].sick, 10);
      const userAlpha = parseInt(inputs[r.day].alpha, 10);

      // Find actual level record target
      const target = currentLevel.records.find(rec => rec.day === r.day);
      if (!target) continue;

      if (
        userPresent !== target.present ||
        userPermit !== target.permit ||
        userSick !== target.sick ||
        userAlpha !== target.alpha
      ) {
        setErrorWarning(`⚠️ Hitungan hari ${r.day} belum tepat. Periksa kembali jumlah Hadir, Izin, Sakit, atau Alfa!`);
        setActiveTab(rIdx); // Switch to the incorrect day tab/page automatically!
        return;
      }
    }

    // Convert input state to standard record format
    const countedRecords: Record<string, { present: number, permit: number, sick: number, alpha: number }> = {};
    rosters.forEach(r => {
      countedRecords[r.day] = {
        present: parseInt(inputs[r.day].present, 10),
        permit: parseInt(inputs[r.day].permit, 10),
        sick: parseInt(inputs[r.day].sick, 10),
        alpha: parseInt(inputs[r.day].alpha, 10),
      };
    });

    // Score: 15 points for perfect data collection
    onSuccess(15, countedRecords);
  };

  const activeRoster = rosters[activeTab] || null;

  const renderDayBadge = (day: string, activeTab: number, rIdx: number) => {
    let displayText = day;
    let weekBadge = null;

    const dayNameMap: Record<string, string> = {
      'Sen': 'Senin',
      'Sel': 'Selasa',
      'Rab': 'Rabu',
      'Kam': 'Kamis',
      'Jum': 'Jumat',
      'Senin': 'Senin',
      'Selasa': 'Selasa',
      'Rabu': 'Rabu',
      'Kamis': 'Kamis',
      'Jumat': 'Jumat'
    };

    if (day.includes('(')) {
      const parts = day.split('(');
      displayText = parts[0].trim();
      weekBadge = parts[1].replace(')', '').trim();
    } else if (day.includes('-')) {
      const parts = day.split('-');
      weekBadge = parts[0];
      displayText = dayNameMap[parts[1]] || parts[1];
    } else {
      displayText = dayNameMap[day] || day;
    }

    const isActive = activeTab === rIdx;

    return (
      <div className="relative inline-block my-1 shrink-0">
        <span className={`text-[10px] sm:text-[11px] font-black inline-block px-2.5 py-0.5 rounded border border-black shadow-[1px_1px_0px_#000] transition-colors ${
          isActive ? 'bg-[#FDE047] text-black' : 'bg-slate-100 text-slate-700'
        }`}>
          {displayText}
        </span>
        {weekBadge && (
          <span className="absolute -top-1.5 -right-2 bg-rose-500 text-white text-[7px] sm:text-[8px] font-black border border-black rounded-full px-1 py-0.2 min-w-4 h-4 flex items-center justify-center shadow-[0.5px_0.5px_0px_#000] leading-none">
            {weekBadge}
          </span>
        )}
      </div>
    );
  };

  const backfaceHiddenStyle: React.CSSProperties = {
    backfaceVisibility: 'hidden',
    WebkitBackfaceVisibility: 'hidden',
    position: 'absolute',
    inset: 0,
  };

  const renderPageBack = (dayName: string) => {
    return (
      <div 
        className="w-full h-full flex flex-col bg-[#FAF7F0] border-2 border-black rounded-xl p-2 sm:p-4 pl-6 sm:pl-10  relative select-none"
        style={{
          backgroundImage: 'linear-gradient(#e2e8f0 1px, transparent 1px)',
          backgroundSize: '100% 24px',
        }}
      >
        {/* Red vertical margin line of the notebook */}
        <div className="absolute left-[20px] sm:left-[32px] top-0 bottom-0 w-[1.5px] bg-red-450" />
        
        {/* Page content - school notebook look */}
        <div className="flex flex-col h-full font-mono text-slate-500 pt-1 sm:pt-2">
          <div className="flex items-center justify-between border-b border-slate-300 pb-0.5 sm:pb-1 mb-1 sm:mb-2">
            <span className="text-[8px] sm:text-[10px] font-black uppercase text-slate-400">
              Catatan Harian
            </span>
            <span className="text-[7px] sm:text-[9px] font-bold text-slate-400">
              {dayName}
            </span>
          </div>
          
          <div className="flex-1 flex flex-col justify-center items-center opacity-65 py-2 sm:py-4">
            <ClipboardCheck className="w-8 h-8 sm:w-12 sm:h-12 text-slate-400 mb-1 sm:mb-2" />
            <span className="text-[8px] sm:text-[10px] font-black uppercase text-slate-500 tracking-wider">
              Sudah Direkap
            </span>
            <span className="text-[7px] sm:text-[8px] text-slate-400 mt-0.5 sm:mt-1">
              Sekolah Data Challenge
            </span>
          </div>
        </div>
      </div>
    );
  };

  const renderPageContent = (tabIndex: number, isStatic: boolean) => {
    const roster = rosters[tabIndex];
    if (!roster) return null;

    return (
      <div className="w-full h-full flex flex-col bg-white border-2 border-black rounded-xl p-1.5 sm:p-4 pl-5 sm:pl-4  relative">
        <div className="flex items-center justify-between mb-1 sm:mb-2">
          <span className="text-[10px] sm:text-sm font-black text-slate-800 uppercase tracking-wide">
            Hari: {roster.day}
          </span>
          <span className="text-[8px] sm:text-[9px] font-mono text-slate-500">
            Format: Angka (0-35)
          </span>
        </div>

        {/* Neobrutalist input fields grid */}
        <div className="grid grid-cols-2 gap-1.5 sm:gap-4 my-1 sm:my-2 flex-1 items-center">
          {/* Hadir */}
          <div className="bg-[#ECFDF5] border-2 border-black rounded-xl p-1 sm:p-2 flex flex-col items-center shadow-[1.5px_1.5px_0px_#000]">
            <label className="text-[7px] sm:text-[10px] font-black text-emerald-800 uppercase mb-0.5 font-mono">Hadir</label>
            {isStatic ? (
              <div className="w-10 sm:w-20 p-0.5 sm:p-2 bg-white text-[#1E293B] font-mono font-black text-center border-2 border-black rounded-lg shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] text-[10px] sm:text-base flex items-center justify-center min-h-[22px] sm:min-h-[42px]">
                {inputs[roster.day]?.present || ''}
              </div>
            ) : (
              <input
                type="number"
                min="0"
                max="35"
                placeholder="?"
                id={`input-present-${roster.day}`}
                value={inputs[roster.day]?.present || ''}
                onChange={(e) => handleInputChange(roster.day, 'present', e.target.value)}
                className="w-10 sm:w-20 p-0.5 sm:p-2 bg-white text-[#1E293B] font-mono font-black text-center border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] text-[10px] sm:text-base"
              />
            )}
          </div>

          {/* Izin */}
          <div className="bg-[#F0F9FF] border-2 border-black rounded-xl p-1 sm:p-2 flex flex-col items-center shadow-[1.5px_1.5px_0px_#000]">
            <label className="text-[7px] sm:text-[10px] font-black text-sky-850 uppercase mb-0.5 font-mono">Izin</label>
            {isStatic ? (
              <div className="w-10 sm:w-20 p-0.5 sm:p-2 bg-white text-[#1E293B] font-mono font-black text-center border-2 border-black rounded-lg shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] text-[10px] sm:text-base flex items-center justify-center min-h-[22px] sm:min-h-[42px]">
                {inputs[roster.day]?.permit || ''}
              </div>
            ) : (
              <input
                type="number"
                min="0"
                max="35"
                placeholder="?"
                id={`input-permit-${roster.day}`}
                value={inputs[roster.day]?.permit || ''}
                onChange={(e) => handleInputChange(roster.day, 'permit', e.target.value)}
                className="w-10 sm:w-20 p-0.5 sm:p-2 bg-white text-[#1E293B] font-mono font-black text-center border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] text-[10px] sm:text-base"
              />
            )}
          </div>

          {/* Sakit */}
          <div className="bg-[#FFFBEB] border-2 border-black rounded-xl p-1 sm:p-2 flex flex-col items-center shadow-[1.5px_1.5px_0px_#000]">
            <label className="text-[7px] sm:text-[10px] font-black text-amber-800 uppercase mb-0.5 font-mono">Sakit</label>
            {isStatic ? (
              <div className="w-10 sm:w-20 p-0.5 sm:p-2 bg-white text-[#1E293B] font-mono font-black text-center border-2 border-black rounded-lg shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] text-[10px] sm:text-base flex items-center justify-center min-h-[22px] sm:min-h-[42px]">
                {inputs[roster.day]?.sick || ''}
              </div>
            ) : (
              <input
                type="number"
                min="0"
                max="35"
                placeholder="?"
                id={`input-sick-${roster.day}`}
                value={inputs[roster.day]?.sick || ''}
                onChange={(e) => handleInputChange(roster.day, 'sick', e.target.value)}
                className="w-10 sm:w-20 p-0.5 sm:p-2 bg-white text-[#1E293B] font-mono font-black text-center border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] text-[10px] sm:text-base"
              />
            )}
          </div>

          {/* Alfa */}
          <div className="bg-[#FEF2F2] border-2 border-black rounded-xl p-1 sm:p-2 flex flex-col items-center shadow-[1.5px_1.5px_0px_#000]">
            <label className="text-[7px] sm:text-[10px] font-black text-rose-800 uppercase mb-0.5 font-mono">Alfa</label>
            {isStatic ? (
              <div className="w-10 sm:w-20 p-0.5 sm:p-2 bg-white text-[#1E293B] font-mono font-black text-center border-2 border-black rounded-lg shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] text-[10px] sm:text-base flex items-center justify-center min-h-[22px] sm:min-h-[42px]">
                {inputs[roster.day]?.alpha || ''}
              </div>
            ) : (
              <input
                type="number"
                min="0"
                max="35"
                placeholder="?"
                id={`input-alpha-${roster.day}`}
                value={inputs[roster.day]?.alpha || ''}
                onChange={(e) => handleInputChange(roster.day, 'alpha', e.target.value)}
                className="w-10 sm:w-20 p-0.5 sm:p-2 bg-white text-[#1E293B] font-mono font-black text-center border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] text-[10px] sm:text-base"
              />
            )}
          </div>
        </div>
      </div>
    );
  };

  const baseTabIndex = isFlipping 
    ? (flipDirection === 'next' ? activeTab : currentTab) 
    : activeTab;

  const flippingTabIndex = flipDirection === 'next' ? currentTab : activeTab;

  return (
    <div className="w-full h-fit max-h-[85vh] sm:max-h-[700px] flex flex-row gap-3 sm:gap-4 lg:gap-6 min-h-0 mobile-landscape-compact-gap my-auto">
      {/* Left Side: Roster Viewer (Canvas) */}
      <div className="flex-[7] min-w-0 min-h-0 flex flex-col h-full bg-white border-2 sm:border-4 border-black rounded-2xl sm:rounded-3xl p-3 sm:p-5 shadow-[4px_4px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_rgba(0,0,0,1)] mobile-landscape-compact-card relative">
        
        {/* Instruction Info Text */}
        <p className="text-[10px] sm:text-[11px] text-slate-600 font-mono font-bold hidden sm:block mobile-landscape-hide mb-2 shrink-0">
          Klik nama untuk menandai yang selesai dihitung
        </p>

        {/* Days Tabs & Hint Button Row */}
        <div className="w-full flex items-center justify-between gap-3 mb-3 shrink-0">
          {/* Days Tabs */}
          <div className="flex-1 flex items-center gap-2 overflow-x-auto p-0.5 scrollbar-none mobile-landscape-compact-gap">
            {rosters.map((r, idx) => (
              <button
                key={r.day}
                ref={el => { tabRefs.current[idx] = el; }}
                type="button"
                onClick={() => setActiveTab(idx)}
                className={`px-3 py-1.5 sm:px-4 sm:py-2 text-xs font-black rounded-xl border-2 border-black whitespace-nowrap transition-all duration-205 shadow-[2px_2px_0px_#000] day-tab-compact flex-1 text-center ${
                  activeTab === idx
                    ? 'bg-[#FDE047] text-black scale-105'
                    : 'bg-white text-slate-700 hover:bg-slate-100'
                }`}
                id={`btn-day-tab-${r.day}`}
              >
                {r.day}
              </button>
            ))}
          </div>

          {/* Hint Button */}
          {(() => {
            if (!teacherMode && autofilledDays.length > 0) {
              return null;
            }
            const currentDay = rosters[activeTab]?.day;
            let tooltip = teacherMode 
              ? `Petunjuk (${currentDay}) - Mode Guru` 
              : `Dapatkan Petunjuk Hari Ini (${currentDay}) (Maks. 1 Hari)`;

            return (
              <button
                type="button"
                onClick={() => handleAutofillHelper(currentDay)}
                className="p-1.5 border-2 border-black rounded-xl shadow-[1.5px_1.5px_0px_#000] cursor-pointer transition-all active:translate-y-0.5 active:shadow-none hover:bg-slate-100 bg-[#FDE047] text-black flex items-center justify-center shrink-0"
                title={tooltip}
                id={`autofill-hint-${currentDay}`}
              >
                <HelpCircle className="w-5 h-5 text-black" />
              </button>
            );
          })()}
        </div>

        {/* Student List Grid */}
        {activeRoster && (
          <div className="flex-1 min-h-0 overflow-y-auto">
            <div className="grid grid-cols-4 md:gap-2 ">
              {activeRoster.students.map((student, idx) => {
                const key = `${activeRoster.day}-${idx}`;
                const isHighlighted = highlightedStudents[key];
                const status = student.status;

                const isAbsentStatus = status === 'Alfa' || status === 'Izin' || status === 'Sakit';
                const isRevealed = !isAbsentStatus || isHighlighted;

                // Mystery State (Absent student not yet revealed)
                if (!isRevealed) {
                  return (
                    <motion.div
                      key={key}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => toggleHighlight(activeRoster.day, idx)}
                      className="relative p-1 rounded-lg bg-amber-50/10 hover:bg-amber-100/20 flex flex-col items-center justify-center cursor-pointer select-none transition-all duration-300 w-full aspect-square overflow-hidden"
                      id={`student-item-${activeRoster.day}-${idx}`}
                    >
                      {/* Big Mystery Question Mark */}
                      <div className="absolute inset-x-0 top-0 bottom-6 sm:bottom-7 md:bottom-10 flex items-center justify-center">
                        <span className="text-lg sm:text-xl font-black text-slate-400/80 animate-pulse">❓</span>
                      </div>

                      {/* Name Plate absolute at bottom */}
                      <div className="absolute bottom-1 left-1 right-1 h-6 sm:h-7 md:h-10 flex items-center justify-center z-10">
                        <div className="relative w-full h-full">
                          <img src={papanNama} className="w-full h-full object-contain" alt="Papan Nama" />
                          <span className="absolute inset-0 flex items-center justify-center font-black text-[8px] sm:text-[10px] md:text-sm text-slate-800 uppercase tracking-wider animate-pulse flex items-center gap-0.5 font-display">
                            ❓ <span className="font-mono">Klik</span>
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                }

                // Absent State (Revealed, no character avatar, only nameplate and status badge)
                if (isAbsentStatus) {
                  let cardStyle = "bg-white";
                  let statusBadgeStyle = "bg-slate-100 text-slate-900 border-slate-350";

                  if (status === 'Izin') {
                    cardStyle = "bg-sky-50/40 hover:bg-sky-50/60";
                    statusBadgeStyle = "bg-[#E0F2FE] text-sky-900 border-sky-400";
                  } else if (status === 'Sakit') {
                    cardStyle = "bg-amber-50/40 hover:bg-amber-50/60";
                    statusBadgeStyle = "bg-[#FEF3C7] text-amber-900 border-amber-400";
                  } else if (status === 'Alfa') {
                    cardStyle = "bg-rose-50/40 hover:bg-rose-50/60";
                    statusBadgeStyle = "bg-[#FEE2E2] text-rose-900 border-rose-400";
                  }

                  return (
                    <motion.div
                      key={key}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => toggleHighlight(activeRoster.day, idx)}
                      className={`relative p-1 rounded-lg flex flex-col items-center justify-center cursor-pointer select-none transition-all duration-300 w-full aspect-square overflow-hidden ${cardStyle}`}
                      id={`student-item-${activeRoster.day}-${idx}`}
                    >
                      {/* Status Badge - Centered in the upper region */}
                      <div className="absolute inset-x-0 top-0 bottom-6 sm:bottom-7 md:bottom-10 flex items-center justify-center shrink-0 scale-95 sm:scale-100">
                        <span className={`px-1.5 py-0.5 rounded-lg text-[8px] sm:text-[9px] md:text-[10px] font-black border flex items-center gap-0.5 shadow-[0.5px_0.5px_0px_#000] ${statusBadgeStyle}`}>
                          <UserX className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-inherit" />
                          {status}
                        </span>
                      </div>

                      {/* Name Plate absolute at bottom */}
                      <div className="absolute bottom-1 left-1 right-1 h-6 sm:h-7 md:h-10 flex items-center justify-center z-10">
                        <div className="relative w-full h-full">
                          <img src={papanNama} className="w-full h-full object-contain" alt="Papan Nama" />
                          <span className="absolute inset-0 flex items-center justify-center font-black text-[8px] sm:text-[10px] md:text-sm text-slate-800 truncate px-1.5">
                            {student.name}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                }

                // Hadir State (Always Revealed, shows avatar and nameplate at bottom, no status badge)
                let cardStyle = "bg-white hover:bg-emerald-50/50 text-slate-900";
                if (isHighlighted) {
                  cardStyle = "bg-slate-100 opacity-60 text-slate-400";
                }

                const { bg, pisah } = getStudentAvatar(student.name);

                return (
                  <motion.div
                    key={key}
                    whileHover={{ scale: isHighlighted ? 1 : 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => toggleHighlight(activeRoster.day, idx)}
                    className={`relative rounded-lg flex flex-col items-center justify-between cursor-pointer select-none transition-all duration-300 w-full aspect-square overflow-hidden ${cardStyle}`}
                    id={`student-item-${activeRoster.day}-${idx}`}
                  >
                    {/* Avatar Container - takes full size of card */}
                    <div className="absolute inset-0 w-full h-full pb-3 flex justify-center items-center">
                      <div className="relative w-full h-full">
                        <img src={bg} className="absolute inset-0 w-full h-full object-contain" alt="avatar-bg" />
                        <img src={pisah} className="absolute inset-0 w-full h-full object-contain" alt="avatar-face" />
                      </div>
                    </div>

                    {/* Name Plate absolute at bottom */}
                    <div className="absolute bottom-1 left-1 right-1 h-6 sm:h-7 md:h-10 flex items-center justify-center z-10">
                      <div className="relative w-full h-full">
                        <img src={papanNama} className="w-full h-full object-contain" alt="Papan Nama" />
                        <span className={`absolute inset-0 flex items-center justify-center font-black text-[8px] sm:text-[10px] md:text-sm text-slate-800 truncate px-1.5 ${isHighlighted ? 'line-through text-slate-500' : ''}`}>
                          {student.name}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Right Side: Working Counter Control Panel Card (Buku Rekapitulasi dengan Efek 3D Page Flip) */}
      <div 
        className="flex-[5] min-w-0 min-h-0 flex flex-col justify-between h-full bg-[#FAF7F0] border-2 sm:border-4 border-black rounded-2xl sm:rounded-3xl p-3 sm:p-5 shadow-[4px_4px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_rgba(0,0,0,1)] mobile-landscape-compact-card relative overflow-hidden"
        style={{ perspective: '1500px' }}
      >
        <div className="pl-2 flex flex-col min-h-0 flex-1 z-10">
          {/* Header */}
          <div className="shrink-0 mb-2">
            <div className="flex items-center justify-between border-b-2 border-black/20 pb-1.5">
              <h3 className="text-xs sm:text-sm font-black text-slate-900 uppercase flex items-center gap-1">
                <ClipboardCheck className="w-4 h-4 text-slate-800" />
                <span>Buku Rekapitulasi</span>
              </h3>
              <span className="text-[10px] font-mono font-black bg-black text-white px-2 py-0.5 rounded">
                Hal. {activeTab + 1}/{rosters.length}
              </span>
            </div>
          </div>

          {/* Animated Page Content with 3D Page Flip */}
          <div 
            className="h-[170px] sm:h-[330px] min-h-0 relative flex flex-col justify-center py-2 my-auto"
            style={{ perspective: '1500px', transformStyle: 'preserve-3d' }}
          >
            {/* Ring Binder Visuals on the left side of the book page */}
            <div className="absolute left-0 top-0 bottom-0 w-2 sm:w-3 flex flex-col justify-around items-center py-2 sm:py-4 select-none pointer-events-none z-45">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-slate-350 border border-slate-500 shadow-inner flex items-center justify-center">
                  <div className="w-0.5 h-0.5 rounded-full bg-slate-450 scale-75 sm:scale-100" />
                </div>
              ))}
            </div>

            {/* Gutter spine shadow on the left edge of the page */}
            <div className="absolute left-0 top-2 bottom-2 w-2.5 sm:w-3 bg-gradient-to-l from-black/10 to-transparent pointer-events-none z-30" />

            {/* Shadow cast underneath the turning page */}
            {isFlipping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.3, 0] }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                style={{ willChange: "opacity" }}
                className="absolute inset-y-2 left-0 right-0 bg-black/10 pointer-events-none rounded-xl z-10"
              />
            )}

            {/* The base page underneath (always rendered flat) */}
            <div 
              className="absolute inset-y-2 left-0 right-0"
              style={{
                transform: 'rotateY(0deg)',
                transformStyle: 'preserve-3d',
                zIndex: isFlipping ? 1 : 2
              }}
            >
              {renderPageContent(baseTabIndex, false)}
            </div>

            {/* The flipping page (only visible during transition) */}
            {isFlipping && (
              <motion.div
                initial={{ 
                  rotateY: flipDirection === 'next' ? 0 : -180,
                  opacity: flipDirection === 'next' ? 1 : 0
                }}
                animate={{ 
                  rotateY: flipDirection === 'next' ? -180 : 0,
                  opacity: flipDirection === 'next' ? [1, 1, 0] : [0, 1, 1]
                }}
                transition={{ 
                  duration: 0.5, 
                  ease: "easeInOut",
                  opacity: { duration: 0.5, times: flipDirection === 'next' ? [0, 0.8, 1] : [0, 0.2, 1] }
                }}
                style={{
                  transformOrigin: "left center",
                  transformStyle: "preserve-3d",
                  position: "absolute",
                  top: 8,
                  bottom: 8,
                  left: 0,
                  right: 0,
                  zIndex: 50,
                  pointerEvents: "none",
                  willChange: "transform, opacity"
                }}
              >
                {/* Front Side of the flipping page */}
                <div 
                  style={{
                    ...backfaceHiddenStyle,
                    transform: 'rotateY(0deg)',
                    transformStyle: 'preserve-3d',
                  }}
                >
                  {renderPageContent(flippingTabIndex, true)}
                  {/* Shading overlay for 3D realism */}
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: flipDirection === 'next' ? 0.45 : 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="absolute inset-0 bg-black pointer-events-none rounded-xl"
                  />
                </div>

                {/* Back Side of the flipping page */}
                <div 
                  style={{
                    ...backfaceHiddenStyle,
                    transform: 'rotateY(180deg)',
                    transformStyle: 'preserve-3d',
                  }}
                >
                  {renderPageBack(rosters[flippingTabIndex]?.day || '')}
                  {/* Shading overlay for 3D realism */}
                  <motion.div 
                    initial={{ opacity: 0.45 }}
                    animate={{ opacity: flipDirection === 'next' ? 0 : 0.45 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="absolute inset-0 bg-black pointer-events-none rounded-xl"
                  />
                </div>
              </motion.div>
            )}
          </div>

          {/* Book Page Turner Navigation */}
          <div className="flex items-center justify-between mt-1 mb-2 bg-white/40 border border-black/10 p-1 rounded-xl shrink-0">
            <button
              type="button"
              disabled={activeTab === 0}
              onClick={() => setActiveTab(prev => Math.max(0, prev - 1))}
              className={`px-2.5 py-1 text-[9px] sm:text-[10px] font-black border-2 border-black rounded-lg flex items-center gap-1 transition-all select-none cursor-pointer ${
                activeTab === 0 
                  ? 'bg-slate-100 text-slate-400 border-slate-300 cursor-not-allowed'
                  : 'bg-white text-slate-800 hover:bg-slate-50 shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none'
              }`}
            >
              ← Prev
            </button>
            
            <div className="flex items-center gap-1">
              {[...Array(rosters.length)].map((_, i) => (
                <div 
                  key={i} 
                  className={`w-1.5 h-1.5 rounded-full border border-black/40 ${i === activeTab ? 'bg-[#FDE047]' : 'bg-slate-350'}`}
                />
              ))}
            </div>

            <button
              type="button"
              disabled={activeTab === rosters.length - 1}
              onClick={() => setActiveTab(prev => Math.min(rosters.length - 1, prev + 1))}
              className={`px-2.5 py-1 text-[9px] sm:text-[10px] font-black border-2 border-black rounded-lg flex items-center gap-1 transition-all select-none cursor-pointer ${
                activeTab === rosters.length - 1 
                  ? 'bg-slate-100 text-slate-400 border-slate-300 cursor-not-allowed'
                  : 'bg-white text-slate-800 hover:bg-slate-50 shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none'
              }`}
            >
              Next →
            </button>
          </div>
        </div>

        {/* Controls, Help, and Alerts at the Bottom */}
        <div className="mt-2 pt-2 border-t-2 border-black space-y-2.5 shrink-0 mobile-landscape-compact-text z-20">
          {/* Verify Submission & Back buttons */}
          <div className="flex flex-col sm:flex-row gap-2">
            {onBack && (
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onBack}
                className="w-full sm:w-1/3 py-2.5 sm:py-3 text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer bg-slate-100 hover:bg-slate-200 border-2 border-black rounded-xl font-black shadow-[2.5px_2.5px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1.5px_1.5px_0px_#000]"
                id="btn-back-stage"
              >
                <span>Kembali</span>
              </motion.button>
            )}
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={verifyCounts}
              className={`flex-1 bg-[#F43F5E] hover:bg-[#FB7185] text-white border-2 border-black rounded-xl font-black shadow-[2.5px_2.5px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1.5px_1.5px_0px_#000] py-2.5 sm:py-3 text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer ${onBack ? '' : 'w-full'} animate-pulse hover:animate-none`}
              id="btn-verify-roster"
            >
              <Check className="w-5 h-5" />
              <span>Verifikasi Kehadiran</span>
            </motion.button>
          </div>
        </div>

      </div>

      {/* Floating Toast Notification */}
      <AnimatePresence>
        {errorWarning && (
          <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[1000] w-full max-w-sm px-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: -40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -40, scale: 0.95 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="bg-[#FDE047] border-4 border-black p-3.5 rounded-2xl shadow-[4px_4px_0px_#000] flex items-center gap-3 text-black font-black text-xs pointer-events-auto"
            >
              <AlertCircle className="w-5 h-5 shrink-0 text-black animate-bounce" />
              <span className="flex-1 font-extrabold leading-normal">{errorWarning}</span>
              <button
                type="button"
                onClick={() => setErrorWarning(null)}
                className="font-mono text-base font-black border-2 border-black bg-white rounded-md w-6 h-6 flex items-center justify-center cursor-pointer shadow-[1px_1px_0px_#000] active:translate-y-0.5 active:shadow-none hover:bg-slate-100"
              >
                ×
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
