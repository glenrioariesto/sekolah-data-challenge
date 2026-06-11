import React, { useState } from 'react';
import { DailyRoster, GameLevel } from '@/src/types';
import { motion } from 'motion/react';
import { Check, AlertCircle, HelpCircle, ClipboardCheck, Info, UserCheck, UserX } from 'lucide-react';

interface StudentCounterProps {
  currentLevel: GameLevel;
  onSuccess: (scoreBonus: number, countedRecords: any) => void;
  onBack?: () => void;
}

export const StudentCounter: React.FC<StudentCounterProps> = ({
  currentLevel,
  onSuccess,
  onBack,
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

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl border-2 sm:border-4 border-black p-2 sm:p-4 md:p-6 shadow-[4px_4px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_rgba(0,0,0,1)]">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-3 sm:gap-4 md:gap-6">
        
        {/* Left Side: Roster Viewer */}
        <div className="xl:col-span-7">
          <div className="bg-white rounded-2xl p-2.5 sm:p-4 border border-black sm:border-2 shadow-[2.5px_2.5px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center justify-between mb-2 sm:mb-4">
              <h3 className="text-sm font-black text-slate-900 uppercase flex items-center gap-2">
                <ClipboardCheck className="w-4.5 h-4.5 text-slate-700" />
                Lembar Absensi Siswa Harian
              </h3>
              <p className="text-[11px] text-slate-600 font-mono font-bold">
                Klik nama untuk menandai yang selesai dihitung
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
              <div className="overflow-y-auto max-h-[160px] sm:max-h-[220px] md:max-h-[280px] pr-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
                        className={`p-2 sm:p-3 rounded-lg sm:rounded-xl border-2 flex items-center justify-between cursor-pointer select-none transition-all duration-300 shadow-[2px_2px_0px_rgba(0,0,0,1)] ${cardStyle}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-6 h-6 rounded-lg text-xs font-black font-mono border border-black flex items-center justify-center ${
                            isHighlighted 
                              ? 'bg-slate-300 text-slate-500' 
                              : status === 'Hadir' 
                                ? 'bg-[#CCFBF1] text-emerald-805' 
                                : status === 'Izin'
                                  ? 'bg-[#E0F2FE] text-sky-850'
                                  : status === 'Sakit'
                                    ? 'bg-[#FEF3C7] text-amber-855'
                                    : 'bg-[#FEE2E2] text-rose-855'
                          }`}>
                            {idx + 1}
                          </span>
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
            
            {/* Quick Helper Button for Younger Kids */}
            <div className="mt-3 flex justify-end">
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
            <h3 className="text-xs sm:text-sm font-black text-slate-900 uppercase flex items-center gap-2 border-b-2 border-black pb-2">
              📂 Hasil Rekapitulasi Data Sementara
            </h3>
            
            <p className="text-[10px] sm:text-xs text-slate-700 font-bold leading-relaxed">
              Ketikkan jumlah siswa <strong className="text-emerald-800 font-black">Hadir (H)</strong>, <strong className="text-sky-850 font-black">Izin (I)</strong>, <strong className="text-amber-800 font-black">Sakit (S)</strong>, dan <strong className="text-rose-800 font-black">Alfa (A)</strong> setelah menghitung lembar absen sebelah kiri.
            </p>

            <div className="space-y-2 max-h-[140px] sm:max-h-[200px] md:max-h-[280px] overflow-y-auto pr-1">
              {rosters.map((r, rIdx) => (
                <div 
                  key={r.day}
                  className={`p-2 sm:p-3 rounded-lg sm:rounded-xl border-2 border-black flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all shadow-[3px_3px_0px_rgba(0,0,0,1)] ${
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
                      <p className="text-[11px] sm:text-xs font-black text-slate-900">{r.day}</p>
                      <p className="text-[9px] sm:text-[10px] text-slate-700 font-semibold font-mono">{r.students.length} Siswa terdaftar</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
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

          <div className="mt-4 pt-3 border-t-2 border-black">
            {/* Warning Message */}
            {errorWarning && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-3 bg-[#FDE047] border-2 border-black rounded-2xl p-3 flex items-start gap-2.5 shadow-[3px_3px_0px_rgba(0,0,0,1)] text-[#1E293B] font-black"
                id="warning-box"
              >
                <AlertCircle className="w-5 h-5 text-black shrink-0 mt-0.5" />
                <span className="text-xs text-black font-extrabold leading-relaxed">
                  {errorWarning}
                </span>
              </motion.div>
            )}

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
                <span>Verifikasi Hitungan Kehadiran</span>
              </motion.button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
