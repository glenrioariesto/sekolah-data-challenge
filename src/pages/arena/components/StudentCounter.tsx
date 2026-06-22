import React, { useState } from 'react';
import { DailyRoster, GameLevel } from '@/src/types';
import { motion, AnimatePresence } from 'motion/react';
import { Check, AlertCircle, HelpCircle, ClipboardCheck, Info, UserCheck, UserX } from 'lucide-react';

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
    for (const r of rosters) {
      const pVal = inputs[r.day]?.present.trim();
      const iVal = inputs[r.day]?.permit.trim();
      const sVal = inputs[r.day]?.sick.trim();
      const aVal = inputs[r.day]?.alpha.trim();
      if (!pVal || !iVal || !sVal || !aVal) {
        setErrorWarning(`⚠️ Mohon isi semua kolom Hadir, Izin, Sakit, dan Alfa untuk hari ${r.day}!`);
        return;
      }
    }

    // Now check figures
    for (const r of rosters) {
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
        setErrorWarning(`⚠️ Hitungan hari ${r.day} belum tepat. Periksa kembali jumlah Hadir (${target.present}), Izin (${target.permit}), Sakit (${target.sick}), atau Alfa (${target.alpha})!`);
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

  return (
    <div className="w-full h-full flex flex-row gap-3 sm:gap-4 lg:gap-6 min-h-0 mobile-landscape-compact-gap">
      {/* Left Side: Roster Viewer (Canvas) */}
      <div className="flex-[7] min-w-0 min-h-0 flex flex-col h-full bg-white border-2 sm:border-4 border-black rounded-2xl sm:rounded-3xl p-3 sm:p-5 shadow-[4px_4px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_rgba(0,0,0,1)] mobile-landscape-compact-card">
        <div className="flex items-center justify-between mb-3 shrink-0 mobile-landscape-compact-text">
          <div className="flex flex-col">
            <h3 className="text-xs sm:text-sm font-black text-slate-900 uppercase">
              Lembar Absensi Siswa Harian
            </h3>
            <p className="text-[10px] sm:text-[11px] text-slate-600 font-mono font-bold hidden sm:block mobile-landscape-hide">
              Klik nama untuk menandai yang selesai dihitung
            </p>
          </div>
          <div className="flex items-center gap-2">
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
                  className="p-1.5 border-2 border-black rounded-lg shadow-[1.5px_1.5px_0px_#000] cursor-pointer transition-all active:translate-y-0.5 active:shadow-none hover:bg-slate-100 bg-[#FDE047] text-black flex items-center justify-center"
                  title={tooltip}
                  id={`autofill-hint-${currentDay}`}
                >
                  <HelpCircle className="w-5 h-5 text-black" />
                </button>
              );
            })()}
          </div>
        </div>

        {/* Days Tabs */}
        <div className="w-full max-w-full flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none mb-3 shrink-0 mobile-landscape-compact-gap">
          {rosters.map((r, idx) => (
            <button
              key={r.day}
              type="button"
              onClick={() => setActiveTab(idx)}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 text-xs font-black rounded-xl border-2 border-black whitespace-nowrap transition-all duration-205 shadow-[2px_2px_0px_#000] day-tab-compact ${
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

        {/* Student List Grid */}
        {activeRoster && (
          <div className="flex-1 min-h-0 overflow-y-auto pr-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mobile-landscape-compact-gap">
              {activeRoster.students.map((student, idx) => {
                const key = `${activeRoster.day}-${idx}`;
                const isHighlighted = highlightedStudents[key];
                const status = student.status;

                let cardStyle = "bg-white hover:bg-slate-50 text-slate-900 border-black";
                let statusBadgeStyle = "bg-slate-100 text-slate-900 border-slate-350";
                
                if (status === 'Hadir') {
                  cardStyle = "bg-white hover:bg-emerald-50 text-slate-900 border-black";
                  statusBadgeStyle = "bg-[#CCFBF1] text-emerald-900 border-emerald-400";
                } else if (status === 'Izin') {
                  cardStyle = "bg-white hover:bg-sky-50 text-slate-900 border-black";
                  statusBadgeStyle = "bg-[#E0F2FE] text-sky-900 border-sky-400";
                } else if (status === 'Sakit') {
                  cardStyle = "bg-white hover:bg-amber-50 text-slate-900 border-black";
                  statusBadgeStyle = "bg-[#FEF3C7] text-amber-900 border-amber-400";
                } else if (status === 'Alfa') {
                  cardStyle = "bg-white hover:bg-rose-50 text-rose-950 border-rose-500";
                  statusBadgeStyle = "bg-[#FEE2E2] text-rose-900 border-rose-400";
                }

                if (isHighlighted) {
                  cardStyle = "bg-slate-200 border-slate-400 opacity-50 line-through text-slate-400";
                  statusBadgeStyle = "bg-slate-300 text-slate-500 border-slate-400";
                }

                return (
                  <motion.div
                    key={key}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => toggleHighlight(activeRoster.day, idx)}
                    className={`p-2.5 sm:p-3 rounded-lg sm:rounded-xl border-2 flex items-center justify-between cursor-pointer select-none transition-all duration-300 shadow-[2px_2px_0px_rgba(0,0,0,1)] student-item-compact ${cardStyle}`}
                    id={`student-item-${activeRoster.day}-${idx}`}
                  >
                    <div className="flex items-center gap-2.5 sm:gap-3">
                      <span className="font-bold text-xs sm:text-sm">{student.name}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black border-2 flex items-center gap-1 shadow-[1px_1px_0px_#000] ${statusBadgeStyle}`}>
                        {status === 'Hadir' ? (
                          <UserCheck className="w-3 h-3 text-inherit" />
                        ) : (
                          <UserX className="w-3 h-3 text-inherit" />
                        )}
                        {status}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Right Side: Working Counter Control Panel Card */}
      <div className="flex-[5] min-w-0 min-h-0 flex flex-col justify-between h-full bg-white border-2 sm:border-4 border-black rounded-2xl sm:rounded-3xl p-3 sm:p-5 shadow-[4px_4px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_rgba(0,0,0,1)] mobile-landscape-compact-card">
        <div className="flex flex-col min-h-0 flex-1">
          <h3 className="text-xs sm:text-sm font-black text-slate-900 uppercase border-b-2 border-black pb-2 shrink-0 mobile-landscape-compact-text">
            Hasil Rekapitulasi Data Sementara
          </h3>
          
          <p className="text-[10px] sm:text-xs text-slate-700 font-bold leading-relaxed mt-2.5 shrink-0 mobile-landscape-hide">
            Ketikkan jumlah siswa <strong className="text-emerald-800 font-black">Hadir (H)</strong>, <strong className="text-sky-850 font-black">Izin (I)</strong>, <strong className="text-amber-800 font-black">Sakit (S)</strong>, dan <strong className="text-rose-800 font-black">Alfa (A)</strong> setelah menghitung lembar absen sebelah kiri.
          </p>

          <div className="flex-1 overflow-y-auto mt-3 pr-1 space-y-2.5">
            {rosters.map((r, rIdx) => (
              <div 
                key={r.day}
                onClick={() => setActiveTab(rIdx)}
                className={`p-2.5 sm:p-3 rounded-lg sm:rounded-xl border-2 border-black flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all shadow-[3px_3px_0px_rgba(0,0,0,1)] input-row-compact cursor-pointer ${
                  activeTab === rIdx 
                    ? 'bg-[#A5F3FC]' 
                    : 'bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {renderDayBadge(r.day, activeTab, rIdx)}
                </div>

                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  {/* Hadir input */}
                  <div className="flex flex-col items-center">
                    <label className="text-[8px] font-black text-slate-800 uppercase mb-0.5 font-mono text-emerald-700">Hadir</label>
                    <input
                      type="number"
                      min="0"
                      max="35"
                      placeholder="?"
                      id={`input-present-${r.day}`}
                      value={inputs[r.day]?.present || ''}
                      onChange={(e) => handleInputChange(r.day, 'present', e.target.value)}
                      className="w-11 p-1 bg-white text-[#1E293B] font-mono font-black text-center border-2 border-black rounded-lg focus:outline-none focus:ring-1 focus:ring-black shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] text-xs"
                    />
                  </div>

                  {/* Izin input */}
                  <div className="flex flex-col items-center">
                    <label className="text-[8px] font-black text-slate-800 uppercase mb-0.5 font-mono text-sky-700">Izin</label>
                    <input
                      type="number"
                      min="0"
                      max="35"
                      placeholder="?"
                      id={`input-permit-${r.day}`}
                      value={inputs[r.day]?.permit || ''}
                      onChange={(e) => handleInputChange(r.day, 'permit', e.target.value)}
                      className="w-11 p-1 bg-white text-[#1E293B] font-mono font-black text-center border-2 border-black rounded-lg focus:outline-none focus:ring-1 focus:ring-black shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] text-xs"
                    />
                  </div>

                  {/* Sakit input */}
                  <div className="flex flex-col items-center">
                    <label className="text-[8px] font-black text-slate-800 uppercase mb-0.5 font-mono text-amber-700">Sakit</label>
                    <input
                      type="number"
                      min="0"
                      max="35"
                      placeholder="?"
                      id={`input-sick-${r.day}`}
                      value={inputs[r.day]?.sick || ''}
                      onChange={(e) => handleInputChange(r.day, 'sick', e.target.value)}
                      className="w-11 p-1 bg-white text-[#1E293B] font-mono font-black text-center border-2 border-black rounded-lg focus:outline-none focus:ring-1 focus:ring-black shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] text-xs"
                    />
                  </div>

                  {/* Alfa input */}
                  <div className="flex flex-col items-center">
                    <label className="text-[8px] font-black text-slate-800 uppercase mb-0.5 font-mono text-rose-750">Alfa</label>
                    <input
                      type="number"
                      min="0"
                      max="35"
                      placeholder="?"
                      id={`input-alpha-${r.day}`}
                      value={inputs[r.day]?.alpha || ''}
                      onChange={(e) => handleInputChange(r.day, 'alpha', e.target.value)}
                      className="w-11 p-1 bg-white text-[#1E293B] font-mono font-black text-center border-2 border-black rounded-lg focus:outline-none focus:ring-1 focus:ring-black shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] text-xs"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Controls, Help, and Alerts at the Bottom */}
        <div className="mt-3 pt-3 border-t-2 border-black space-y-3 shrink-0 mobile-landscape-compact-text">
          




          {/* Verify Submission & Back buttons */}
          <div className="flex flex-col sm:flex-row gap-2">
            {onBack && (
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onBack}
                className="w-full sm:w-1/3 py-3 text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer bg-slate-100 hover:bg-slate-200 border-2 border-black rounded-xl font-black shadow-[2.5px_2.5px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1.5px_1.5px_0px_#000]"
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
              className={`flex-1 brutal-btn py-3 text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer ${onBack ? '' : 'w-full'} animate-pulse hover:animate-none`}
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
