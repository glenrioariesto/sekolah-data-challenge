import React, { useState } from 'react';
import { DailyRoster, GameLevel } from '@/src/types';
import { motion } from 'motion/react';
import { Check, AlertCircle, HelpCircle, ArrowRight, ClipboardCheck, Info, UserCheck, UserX } from 'lucide-react';

interface StudentCounterProps {
  currentLevel: GameLevel;
  onSuccess: (scoreBonus: number, countedRecords: Record<string, { present: number, absent: number }>) => void;
}

export const StudentCounter: React.FC<StudentCounterProps> = ({
  currentLevel,
  onSuccess,
}) => {
  const rosters = currentLevel.rosters || [];
  
  // Track selected tab/day for list viewing
  const [activeTab, setActiveTab] = useState<number>(0);
  
  // Highlighting mechanism (helps children checkoff named students while counting)
  const [highlightedStudents, setHighlightedStudents] = useState<Record<string, boolean>>({});

  // User input counts: Record<dayName, { presentInput: string, absentInput: string }>
  const [inputs, setInputs] = useState<Record<string, { present: string, absent: string }>>(() => {
    const initial: Record<string, { present: string, absent: string }> = {};
    rosters.forEach(r => {
      initial[r.day] = { present: '', absent: '' };
    });
    return initial;
  });

  // Track validation states and help warnings
  const [errorWarning, setErrorWarning] = useState<string | null>(null);
  const [attempted, setAttempted] = useState<boolean>(false);

  const toggleHighlight = (day: string, index: number) => {
    const key = `${day}-${index}`;
    setHighlightedStudents(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleInputChange = (day: string, field: 'present' | 'absent', value: string) => {
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
    // A helpful hint for younger students or debugging
    const dailyRoster = rosters.find(r => r.day === day);
    if (!dailyRoster) return;
    const actualPresent = dailyRoster.students.filter(s => s.status === 'Hadir').length;
    const actualAbsent = dailyRoster.students.filter(s => s.status === 'Tidak Hadir').length;
    setInputs(prev => ({
      ...prev,
      [day]: {
        present: actualPresent.toString(),
        absent: actualAbsent.toString()
      }
    }));
  };

  const verifyCounts = () => {
    setAttempted(true);
    setErrorWarning(null);

    // Validate that all fields have been filled
    for (const r of rosters) {
      const pVal = inputs[r.day]?.present.trim();
      const aVal = inputs[r.day]?.absent.trim();
      if (!pVal || !aVal) {
        setErrorWarning(`⚠️ Mohon isi semua kolom Hadir dan Tidak Hadir untuk hari ${r.day}!`);
        return;
      }
    }

    // Now check figures
    for (const r of rosters) {
      const userPresent = parseInt(inputs[r.day].present, 10);
      const userAbsent = parseInt(inputs[r.day].absent, 10);

      // Find actual level record target
      const target = currentLevel.records.find(rec => rec.day === r.day);
      if (!target) continue;

      if (userPresent !== target.present || userAbsent !== target.absent) {
        setErrorWarning(`⚠️ Hitungan hari ${r.day} belum tepat. Periksa ulang jumlah Hadir (${target.present}) atau Tidak Hadir (${target.absent})!`);
        return;
      }
    }

    // Convert input state to standard record format
    const countedRecords: Record<string, { present: number, absent: number }> = {};
    rosters.forEach(r => {
      countedRecords[r.day] = {
        present: parseInt(inputs[r.day].present, 10),
        absent: parseInt(inputs[r.day].absent, 10),
      };
    });

    // Score: 10 points for perfect data collection
    onSuccess(15, countedRecords);
  };

  const activeRoster = rosters[activeTab] || null;

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl border-2 sm:border-4 border-black p-2 sm:p-5 md:p-8 shadow-[4px_4px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_rgba(0,0,0,1)]">
      {/* Step description */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b-2 border-black pb-3 sm:pb-5 mb-3 sm:mb-6 gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-[#FDE047] text-black border-2 border-black rounded-lg text-xs font-black font-mono shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)]">TAHAP 1</span>
            <h2 className="text-lg md:text-xl font-black text-slate-900 font-display uppercase tracking-tight">
              Menghitung Data Kehadiran Mentah
            </h2>
          </div>
          <p className="text-xs text-slate-700 font-bold">
            {currentLevel.description}
          </p>
        </div>

        <div className="bg-[#A5F3FC] p-2 sm:p-3 rounded-lg sm:rounded-xl border-2 border-black max-w-sm shadow-[3px_3px_0px_rgba(0,0,0,1)]">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-black mt-0.5 shrink-0" />
            <p className="text-xs text-slate-900 leading-relaxed font-sans font-bold">
              <strong className="font-black text-black">Kiat Dekomposisi:</strong> Pecah masalah besar dengan menghitung absensi per siswa di daftar hari demi hari.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-3 sm:gap-2 sm:gap-4 md:gap-6 md:gap-8">
        
        {/* Left Side: Roster Viewer */}
        <div className="xl:col-span-7">
          <div className="bg-white rounded-2xl p-2.5 sm:p-4 border border-black sm:border-2 shadow-[2.5px_2.5px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center justify-between mb-2 sm:mb-4">
              <h3 className="text-sm font-black text-slate-900 uppercase flex items-center gap-2">
                <ClipboardCheck className="w-4 h-4 text-slate-700" />
                Lembar Absensi Siswa Harian
              </h3>
              <p className="text-[11px] text-slate-600 font-mono font-bold">
                Klik nama untuk menandai
              </p>
            </div>

            {/* Days Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none mb-2 sm:mb-4">
              {rosters.map((r, idx) => (
                <button
                  key={r.day}
                  type="button"
                  onClick={() => setActiveTab(idx)}
                  className={`px-4 py-2 text-xs font-black rounded-xl border-2 border-black whitespace-nowrap transition-all duration-205 shadow-[2px_2px_0px_#000] ${
                    activeTab === idx
                      ? 'bg-[#FBCFE8] text-black scale-105'
                      : 'bg-white text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {r.day}
                </button>
              ))}
            </div>

            {/* Student List Grid */}
            {activeRoster && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {activeRoster.students.map((student, idx) => {
                  const key = `${activeRoster.day}-${idx}`;
                  const isHighlighted = highlightedStudents[key];
                  const isPresent = student.status === 'Hadir';

                  return (
                    <motion.div
                      key={key}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => toggleHighlight(activeRoster.day, idx)}
                      className={`p-2 sm:p-3 rounded-lg sm:rounded-xl border-2 border-black flex items-center justify-between cursor-pointer select-none transition-all duration-300 shadow-[2px_2px_0px_rgba(0,0,0,1)] ${
                        isHighlighted 
                          ? 'bg-slate-200 border-slate-400 opacity-50 line-through text-slate-400' 
                          : isPresent 
                            ? 'bg-white hover:bg-emerald-50 text-slate-900 border-black' 
                            : 'bg-[#FBCFE8] hover:bg-rose-100 text-rose-950 border-black'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-6 h-6 rounded-lg text-xs font-black font-mono border border-black flex items-center justify-center ${
                          isHighlighted 
                            ? 'bg-slate-300 text-slate-500' 
                            : isPresent 
                              ? 'bg-[#CCFBF1] text-emerald-800' 
                              : 'bg-rose-250 text-rose-805'
                        }`}>
                          {idx + 1}
                        </span>
                        <span className="font-bold text-sm">{student.name}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {isPresent ? (
                          <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black border-2 border-black flex items-center gap-1 shadow-[1px_1px_0px_#000] ${
                            isHighlighted ? 'bg-slate-350 text-slate-500' : 'bg-[#CCFBF1] text-emerald-900'
                          }`}>
                            <UserCheck className="w-3 h-3 text-emerald-900" />
                            {student.status}
                          </span>
                        ) : (
                          <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black border-2 border-black flex items-center gap-1 shadow-[1px_1px_0px_#000] ${
                            isHighlighted ? 'bg-slate-350 text-slate-500' : 'bg-[#FBCFE8] text-rose-950'
                          }`}>
                            <UserX className="w-3 h-3 text-rose-900" />
                            {student.status}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
            
            {/* Quick Helper Button for Younger Kids */}
            <div className="mt-2 sm:mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => handleAutofillHelper(rosters[activeTab].day)}
                className="text-[11px] font-black text-black hover:text-black flex items-center gap-1 bg-[#FDE047] border-2 border-black px-3 py-1.5 rounded-lg shadow-[2.5px_2.5px_0px_#000] transition-colors cursor-pointer active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1.5px_1.5px_0px_#000]"
                id={`autofill-hint-${rosters[activeTab]?.day}`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
                Dapatkan Petunjuk Hari Ini ({rosters[activeTab]?.day})
              </button>
            </div>

          </div>
        </div>

        {/* Right Side: Working Counter Inputs */}
        <div className="xl:col-span-5 flex flex-col justify-between">
          <div className="space-y-2 sm:space-y-4">
            <h3 className="text-sm font-black text-slate-900 uppercase flex items-center gap-2 border-b-2 border-black pb-2">
              📂 Hasil Rekapitulasi Data Sementara
            </h3>
            
            <p className="text-xs text-slate-700 font-bold leading-relaxed">
              Ketikkan jumlah total siswa yang <strong className="text-emerald-800 font-black">HADIR (H)</strong> dan <strong className="text-rose-800 font-black">TIDAK HADIR (TH)</strong> pada kolom di bawah setelah Anda menghitungnya dari daftar sebelah kiri.
            </p>

            <div className="space-y-3">
              {rosters.map((r, rIdx) => (
                <div 
                  key={r.day}
                  className={`p-2 sm:p-3 rounded-lg sm:rounded-xl border-2 border-black flex items-center justify-between gap-4 transition-all shadow-[3px_3px_0px_rgba(0,0,0,1)] ${
                    activeTab === rIdx 
                      ? 'bg-[#A5F3FC]' 
                      : 'bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`w-10 h-10 rounded-lg text-xs font-black font-mono border-2 border-black flex items-center justify-center shadow-[1.5px_1.5px_0px_#000] ${
                      activeTab === rIdx ? 'bg-[#FDE047] text-black' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {r.day.substring(0, 3)}
                    </span>
                    <div>
                      <p className="text-xs font-black text-slate-900">{r.day}</p>
                      <p className="text-[10px] text-slate-700 font-semibold font-mono">{r.students.length} Siswa terdaftar</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Hadir input */}
                    <div className="flex flex-col items-center">
                      <label className="text-[9px] font-black text-slate-800 uppercase tracking-wider mb-1 font-mono">Hadir (H)</label>
                      <input
                        type="number"
                        min="0"
                        max="15"
                        placeholder="?"
                        id={`input-present-${r.day}`}
                        value={inputs[r.day]?.present || ''}
                        onChange={(e) => handleInputChange(r.day, 'present', e.target.value)}
                        className="w-16 p-2 bg-white text-[#1E293B] font-mono font-black text-center border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                      />
                    </div>

                    {/* Tidak Hadir input */}
                    <div className="flex flex-col items-center">
                      <label className="text-[9px] font-black text-slate-800 uppercase tracking-wider mb-1 font-mono">TH (Absen)</label>
                      <input
                        type="number"
                        min="0"
                        max="15"
                        placeholder="?"
                        id={`input-absent-${r.day}`}
                        value={inputs[r.day]?.absent || ''}
                        onChange={(e) => handleInputChange(r.day, 'absent', e.target.value)}
                        className="w-16 p-2 bg-white text-[#1E293B] font-mono font-black text-center border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-2 sm:mt-4 sm:mt-8 pt-3 sm:pt-5 border-t-2 border-black">
            {/* Warning Message */}
            {errorWarning && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-2 sm:mb-4 bg-[#FDE047] border-2 border-black rounded-2xl p-3 flex items-start gap-2.5 shadow-[3px_3px_0px_rgba(0,0,0,1)] text-[#1E293B] font-black"
                id="warning-box"
              >
                <AlertCircle className="w-5 h-5 text-black shrink-0 mt-0.5" />
                <span className="text-xs text-black font-extrabold leading-relaxed">
                  {errorWarning}
                </span>
              </motion.div>
            )}

            {/* Verify Submission */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={verifyCounts}
              className="w-full brutal-btn py-2 sm:py-4 text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer"
              id="btn-verify-roster"
            >
              <Check className="w-5 h-5" />
              <span>Verifikasi Hitungan Kehadiran</span>
            </motion.button>
          </div>

        </div>

      </div>
    </div>
  );
};
