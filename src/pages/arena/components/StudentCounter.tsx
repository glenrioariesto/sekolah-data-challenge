import React, { useState } from 'react';
import { DailyRoster, GameLevel } from '@/src/types';
import { motion, AnimatePresence } from 'motion/react';
import { Check, AlertCircle, HelpCircle, ClipboardCheck } from 'lucide-react';
import { StudentCard } from './StudentCard';

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
      <div className="w-full h-full flex flex-col bg-[#FAF7F0] border-2 border-black rounded-xl pr-6 pt-1 sm:pr-10 sm:pt-2 relative select-none">
        {/* Red vertical margin line of the notebook */}
        <div className="absolute left-[20px] sm:left-[32px] top-0 bottom-0 w-[1.5px] bg-red-450 z-10" />
        
        {/* Page content - school notebook look */}
        <div className="flex flex-col h-full font-mono text-slate-500 pl-2 sm:pl-4 z-10">
          <div className="flex items-center justify-between h-7 sm:h-10 border-b border-[#e2e8f0] pb-1 shrink-0">
            <span className="text-[8px] sm:text-[10px] font-black uppercase text-slate-400">
              Catatan Harian
            </span>
            <span className="text-[7px] sm:text-[9px] font-bold text-slate-400">
              {dayName}
            </span>
          </div>
          
          {/* Lined page lines */}
          <div className="flex-1 flex flex-col justify-start relative min-h-0">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-7 sm:h-12 border-b border-[#e2e8f0] w-full shrink-0" />
            ))}
            
            {/* Absolute Centered "Sudah Direkap" Rubber Stamp */}
            <div className="absolute inset-0 flex flex-col justify-center items-center py-2 sm:py-4 bg-[#FAF7F0]/40 backdrop-blur-[0.5px]">
              <div className="bg-[#ECFDF5] border-4 border-emerald-600 rounded-2xl p-3 sm:p-4 flex flex-col items-center rotate-[-6deg] shadow-lg max-w-[85%] text-center">
                <ClipboardCheck className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-600 mb-1" />
                <span className="text-[9px] sm:text-[11px] font-black uppercase text-emerald-800 tracking-wider font-display">
                  Sudah Direkap
                </span>
                <span className="text-[7px] sm:text-[8px] text-emerald-700 font-bold font-mono mt-0.5">
                  Sekolah Data Challenge
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderPageContent = (tabIndex: number, isStatic: boolean) => {
    const roster = rosters[tabIndex];
    if (!roster) return null;

    return (
      <div className="w-full h-full flex flex-col bg-[#FAF7F0] border-2 border-black rounded-xl pt-1 sm:pt-2 relative select-none">
        {/* Red vertical margin line of the notebook */}
        <div className="absolute left-[20px] sm:left-[32px] top-0 bottom-0 w-[1.5px] bg-red-450 z-10" />

        {/* Content wrapper to shift content past the red vertical margin line */}
        <div className="flex flex-col h-full pl-2 sm:pl-4 z-10 justify-between">
          {/* Header row */}
          <div className="flex items-center justify-between h-7 sm:h-10 border-b border-[#e2e8f0] pb-1">
            <span className="text-[10px] sm:text-xs font-black text-slate-800 uppercase tracking-wide">
              Hari: {roster.day}
            </span>
            <span className="text-[8px] sm:text-[9px] font-mono text-slate-500 font-bold pr-6 sm:pr-10">
              Format: Angka
            </span>
          </div>

          {/* Hadir Row */}
          <div className="flex items-center justify-between h-7 sm:h-12 border-b border-[#e2e8f0] pb-1 w-full">
            <label className="text-[10px] sm:text-xs font-black text-emerald-700 uppercase font-mono">Hadir</label>
            {isStatic ? (
              <div className="w-16 sm:w-24 p-0.5 sm:p-1.5 mr-2 sm:mr-4 bg-white text-[#1E293B] font-mono font-black text-center border-2 border-black rounded-lg shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] text-[10px] sm:text-sm flex items-center justify-center min-h-[20px] sm:min-h-[32px]">
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
                className="w-16 sm:w-24 p-0.5 sm:p-1.5 mr-2 sm:mr-4 bg-white text-[#1E293B] font-mono font-black text-center border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] text-[10px] sm:text-sm"
              />
            )}
          </div>

          {/* Izin Row */}
          <div className="flex items-center justify-between h-7 sm:h-12 border-b border-[#e2e8f0] pb-1 w-full">
            <label className="text-[10px] sm:text-xs font-black text-sky-700 uppercase font-mono">Izin</label>
            {isStatic ? (
              <div className="w-16 sm:w-24 p-0.5 sm:p-1.5 mr-2 sm:mr-4 bg-white text-[#1E293B] font-mono font-black text-center border-2 border-black rounded-lg shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] text-[10px] sm:text-sm flex items-center justify-center min-h-[20px] sm:min-h-[32px]">
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
                className="w-16 sm:w-24 p-0.5 sm:p-1.5 mr-2 sm:mr-4 bg-white text-[#1E293B] font-mono font-black text-center border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] text-[10px] sm:text-sm"
              />
            )}
          </div>

          {/* Sakit Row */}
          <div className="flex items-center justify-between h-7 sm:h-12 border-b border-[#e2e8f0] pb-1 w-full">
            <label className="text-[10px] sm:text-xs font-black text-amber-700 uppercase font-mono">Sakit</label>
            {isStatic ? (
              <div className="w-16 sm:w-24 p-0.5 sm:p-1.5 mr-2 sm:mr-4 bg-white text-[#1E293B] font-mono font-black text-center border-2 border-black rounded-lg shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] text-[10px] sm:text-sm flex items-center justify-center min-h-[20px] sm:min-h-[32px]">
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
                className="w-16 sm:w-24 p-0.5 sm:p-1.5 mr-2 sm:mr-4 bg-white text-[#1E293B] font-mono font-black text-center border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] text-[10px] sm:text-sm"
              />
            )}
          </div>

          {/* Alfa Row */}
          <div className="flex items-center justify-between h-7 sm:h-12 border-b border-[#e2e8f0] pb-1 w-full">
            <label className="text-[10px] sm:text-xs font-black text-rose-700 uppercase font-mono">Alfa</label>
            {isStatic ? (
              <div className="w-16 sm:w-24 p-0.5 sm:p-1.5 mr-2 sm:mr-4 bg-white text-[#1E293B] font-mono font-black text-center border-2 border-black rounded-lg shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] text-[10px] sm:text-sm flex items-center justify-center min-h-[20px] sm:min-h-[32px]">
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
                className="w-16 sm:w-24 p-0.5 sm:p-1.5 mr-2 sm:mr-4 bg-white text-[#1E293B] font-mono font-black text-center border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] text-[10px] sm:text-sm"
              />
            )}
          </div>

          {/* Empty Line Row */}
          <div className="h-6 sm:h-10 border-b border-[#e2e8f0] w-full shrink-0" />
        </div>
      </div>
    );
  };

  const baseTabIndex = isFlipping 
    ? (flipDirection === 'next' ? activeTab : currentTab) 
    : activeTab;

  const flippingTabIndex = flipDirection === 'next' ? currentTab : activeTab;

  return (
    <div className="w-full max-w-7xl mx-auto px-1 py-1 sm:px-4 sm:py-4 flex flex-col min-h-0 h-full overflow-y-auto sm:overflow-hidden game-wrapper-padding">
      <div className="w-full min-h-screen sm:min-h-0 sm:max-h-[700px] flex flex-col sm:flex-row gap-3 sm:gap-4 lg:gap-6 min-h-0 mobile-landscape-compact-gap sm:my-auto">
      {/* Left Side: Roster Viewer (Canvas) */}
      <div className="flex-[7] min-w-0 min-h-0 flex flex-col h-fit sm:h-full bg-white border-2 sm:border-4 border-black rounded-2xl sm:rounded-3xl p-3 sm:p-5 shadow-[4px_4px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_rgba(0,0,0,1)] mobile-landscape-compact-card relative">
        
        {/* Instruction Info Text */}
        <p className="text-[10px] sm:text-[11px] text-slate-600 font-mono font-bold mb-2 shrink-0">
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
          <div className="flex-1 min-h-0 overflow-y-auto pt-7 px-3 pb-2">
            <div className="grid grid-cols-4 md:gap-2">
              {activeRoster.students.map((student, idx) => {
                const key = `${activeRoster.day}-${idx}`;
                const isHighlighted = highlightedStudents[key];
                return (
                  <StudentCard
                    key={key}
                    student={student}
                    idx={idx}
                    day={activeRoster.day}
                    isHighlighted={isHighlighted}
                    onToggleHighlight={toggleHighlight}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Right Side: Working Counter Control Panel Card (Buku Rekapitulasi dengan Efek 3D Page Flip) */}
      <div 
        className="flex-[5] min-w-0 min-h-0 flex flex-col justify-between h-fit sm:h-full bg-[#FAF7F0] border-2 sm:border-4 border-black rounded-2xl sm:rounded-3xl p-3 sm:p-5 shadow-[4px_4px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_rgba(0,0,0,1)] mobile-landscape-compact-card relative overflow-hidden"
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
    </div>
  );
};
