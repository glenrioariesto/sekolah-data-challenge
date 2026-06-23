import React, { useState, useEffect } from 'react';
import { GameLevel } from '@/src/types';
import { motion, AnimatePresence } from 'motion/react';
import { Check, RotateCcw, AlertCircle, HelpCircle, ClipboardCheck } from 'lucide-react';
import { DataTableCell } from './DataTableCell';

interface DataEntryTableProps {
  currentLevel: GameLevel;
  onSuccess: (scoreBonus: number) => void;
  prefilledData?: Record<string, { present: number, permit: number, sick: number, alpha: number }> | null;
  onBack?: () => void;
  teacherMode?: boolean;
}

export const DataEntryTable: React.FC<DataEntryTableProps> = ({
  currentLevel,
  onSuccess,
  prefilledData,
  onBack,
  teacherMode = false,
}) => {
  const records = currentLevel.records;
  
  // Find all possible numbers in this level's records to make "Data Pills"
  const availablePills: number[] = Array.from(new Set<number>(
    records.flatMap(r => [r.present, r.permit, r.sick, r.alpha])
      .filter((v): v is number => typeof v === 'number')
  )).sort((a: number, b: number) => a - b);

  // User bound values: Record<string, number | null>
  // Keys will be `${day}-present`, `${day}-permit`, `${day}-sick`, `${day}-alpha`
  const [gridValues, setGridValues] = useState<Record<string, number | null>>(() => {
    const initial: Record<string, number | null> = {};
    records.forEach(r => {
      initial[`${r.day}-present`] = null;
      initial[`${r.day}-permit`] = null;
      initial[`${r.day}-sick`] = null;
      initial[`${r.day}-alpha`] = null;
    });
    return initial;
  });

  useEffect(() => {
    const initial: Record<string, number | null> = {};
    records.forEach(r => {
      initial[`${r.day}-present`] = null;
      initial[`${r.day}-permit`] = null;
      initial[`${r.day}-sick`] = null;
      initial[`${r.day}-alpha`] = null;
    });
    setGridValues(initial);
    setSelectedCell(null);
    setWarningMessage(null);
  }, [currentLevel, records]);

  // Keep track of which cell is currently selected for pill injection
  const [selectedCell, setSelectedCell] = useState<string | null>(null);

  // Track days that have been autofilled using hint helper
  const [autofilledDays, setAutofilledDays] = useState<string[]>([]);
  
  // Validation messages
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const [showRekapModal, setShowRekapModal] = useState<boolean>(false);



  // Auto-dismiss warning toast after 4 seconds
  useEffect(() => {
    if (warningMessage) {
      const timer = setTimeout(() => {
        setWarningMessage(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [warningMessage]);

  const selectCell = (cellKey: string) => {
    setSelectedCell(cellKey);
    setWarningMessage(null);
  };

  const placePill = (value: number) => {
    if (!selectedCell) {
      setWarningMessage("👉 Silakan klik salah satu kotak kosong di tabel terlebih dahulu!");
      return;
    }

    setGridValues(prev => ({
      ...prev,
      [selectedCell]: value
    }));

    // Auto move to the next empty cell for fluid gameplay
    const cellIds = records.flatMap(r => [
      `${r.day}-present`,
      `${r.day}-permit`,
      `${r.day}-sick`,
      `${r.day}-alpha`
    ]);
    const currentIndex = cellIds.indexOf(selectedCell);
    let nextCell = null;
    for (let i = 1; i < cellIds.length; i++) {
      const idx = (currentIndex + i) % cellIds.length;
      if (gridValues[cellIds[idx]] === null) {
        nextCell = cellIds[idx];
        break;
      }
    }
    setSelectedCell(nextCell);
    setWarningMessage(null);
  };

  const handleClear = () => {
    const cleared: Record<string, number | null> = {};
    records.forEach(r => {
      cleared[`${r.day}-present`] = null;
      cleared[`${r.day}-permit`] = null;
      cleared[`${r.day}-sick`] = null;
      cleared[`${r.day}-alpha`] = null;
    });
    setGridValues(cleared);
    setSelectedCell(null);
    setWarningMessage(null);
    setAutofilledDays([]); // Reset autofilled days list when table is cleared
  };

  const handleAutofill = () => {
    const targetDay = selectedCell ? selectedCell.split('-')[0] : records[0]?.day;
    if (!targetDay) return;

    if (!teacherMode) {
      if (autofilledDays.length > 0 && !autofilledDays.includes(targetDay)) {
        setWarningMessage("⚠️ Batas penggunaan petunjuk adalah 1 hari saja.");
        return;
      }
      if (!autofilledDays.includes(targetDay)) {
        setAutofilledDays(prev => [...prev, targetDay]);
      }
    }

    setGridValues(prev => {
      const updated = { ...prev };
      
      if (teacherMode) {
        records.forEach(rec => {
          updated[`${rec.day}-present`] = rec.present;
          updated[`${rec.day}-permit`] = rec.permit !== undefined ? rec.permit : null;
          updated[`${rec.day}-sick`] = rec.sick !== undefined ? rec.sick : null;
          updated[`${rec.day}-alpha`] = rec.alpha !== undefined ? rec.alpha : null;
        });
      } else {
        const r = records.find(rec => rec.day === targetDay);
        if (r) {
          updated[`${r.day}-present`] = r.present;
          updated[`${r.day}-permit`] = r.permit !== undefined ? r.permit : null;
          updated[`${r.day}-sick`] = r.sick !== undefined ? r.sick : null;
          updated[`${r.day}-alpha`] = r.alpha !== undefined ? r.alpha : null;
        }
      }
      
      return updated;
    });

    setSelectedCell(null);
    setWarningMessage(null);
  };

  const handleVerifyTable = () => {
    setWarningMessage(null);

    // Verify all cells are filled
    for (const r of records) {
      const pVal = gridValues[`${r.day}-present`];
      const iVal = gridValues[`${r.day}-permit`];
      const sVal = gridValues[`${r.day}-sick`];
      const aVal = gridValues[`${r.day}-alpha`];
      if (pVal === null || iVal === null || sVal === null || aVal === null) {
        setWarningMessage("⚠️ Mohon lengkapi seluruh sel kosong di tabel terlebih dahulu!");
        return;
      }
    }

    // Compare values
    for (const r of records) {
      const pVal = gridValues[`${r.day}-present`];
      const iVal = gridValues[`${r.day}-permit`];
      const sVal = gridValues[`${r.day}-sick`];
      const aVal = gridValues[`${r.day}-alpha`];
      
      if (pVal !== r.present) {
        setWarningMessage(`⚠️ Periksa kembali data hari ${r.day}! Nilai kehadiran (Hadir) masih belum sesuai.`);
        return;
      }
      if (iVal !== r.permit) {
        setWarningMessage(`⚠️ Periksa kembali data hari ${r.day}! Nilai izin (Izin) masih belum sesuai.`);
        return;
      }
      if (sVal !== r.sick) {
        setWarningMessage(`⚠️ Periksa kembali data hari ${r.day}! Nilai sakit (Sakit) masih belum sesuai.`);
        return;
      }
      if (aVal !== r.alpha) {
        setWarningMessage(`⚠️ Periksa kembali data hari ${r.day}! Nilai alfa (Alfa) masih belum sesuai.`);
        return;
      }
    }

    // Success! Give 15 score points for correct compilation of structured table.
    onSuccess(15);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-1 py-1 sm:px-4 sm:py-4 flex flex-col min-h-0 h-full overflow-y-auto sm:overflow-hidden game-wrapper-padding">
      <div className="w-full min-h-screen sm:min-h-0 sm:h-full flex flex-col sm:flex-row gap-3 sm:gap-4 lg:gap-6 min-h-0 mobile-landscape-compact-gap">
      
      {/* Left column: Central Database Table Grid (Canvas) */}
      <div className="flex-[7] min-w-0 min-h-0 flex flex-col h-fit sm:h-full p-2 sm:p-4 mobile-landscape-flat-container relative">


        <div className="flex items-center justify-between mb-3 shrink-0 mobile-landscape-compact-text">
          <h3 className="text-xs sm:text-sm font-black text-slate-900 uppercase">
            Sistem Basis Data Kehadiran Sekolah
          </h3>
          <div className="flex items-center gap-2">
            {/* Restart/Reset Button */}
            <button
              type="button"
              onClick={handleClear}
              className="p-1.5 border-2 border-black rounded-lg shadow-[1.5px_1.5px_0px_#000] cursor-pointer transition-all active:translate-y-0.5 active:shadow-none hover:bg-rose-100 bg-[#FBCFE8] text-black flex items-center justify-center"
              title="Mulai Ulang Tabel"
              id="btn-restart-grid"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            {/* View Rekap Button */}
            <button
              type="button"
              onClick={() => setShowRekapModal(true)}
              className="p-1.5 border-2 border-black rounded-lg shadow-[1.5px_1.5px_0px_#000] cursor-pointer transition-all active:translate-y-0.5 active:shadow-none hover:bg-emerald-100 bg-[#34D399] text-black flex items-center justify-center"
              title="Lihat Data Rekapitulasi Roster"
              id="btn-view-rekap"
            >
              <ClipboardCheck className="w-5 h-5 text-black" />
            </button>

            {/* Hint Button */}
            {(() => {
              if (!teacherMode && autofilledDays.length > 0) {
                return null;
              }
              const targetDay = selectedCell ? selectedCell.split('-')[0] : records[0]?.day;
              let tooltip = teacherMode
                ? "Isi Otomatis Semua (Mode Guru)"
                : `Isi Otomatis Hari ${targetDay} (Maks. 1 Hari)`;

              return (
                <button
                  type="button"
                  onClick={handleAutofill}
                  className="p-1.5 border-2 border-black rounded-lg shadow-[1.5px_1.5px_0px_#000] cursor-pointer transition-all active:translate-y-0.5 active:shadow-none hover:bg-amber-100 bg-[#FDE047] text-black flex items-center justify-center"
                  title={tooltip}
                  id="btn-autofill-table"
                >
                  <HelpCircle className="w-5 h-5" />
                </button>
              );
            })()}


          </div>
        </div>

        {/* Interactive Grid styled nicely as a professional school system ledger */}
        <div className="flex-1 min-h-0 overflow-y-auto mb-3">
          <div className="overflow-x-auto w-full h-full">
            <table className="w-full text-center border-collapse min-w-[400px] border-4 border-black bg-white">
              <thead>
                <tr className="bg-[#A5F3FC] text-[10px] sm:text-xs font-black text-black font-display border-b-2 border-black sticky top-0 z-10">
                  <th className="py-2 px-2 text-left border-r-2 border-black">HARI</th>
                  <th className="py-2 px-1 border-r border-black text-center text-emerald-800">HADIR (H)</th>
                  <th className="py-2 px-1 border-r border-black text-center text-sky-850">IZIN (I)</th>
                  <th className="py-2 px-1 border-r border-black text-center text-amber-850">SAKIT (S)</th>
                  <th className="py-2 px-1 border-r-2 border-black text-center text-rose-850">ALFA (A)</th>
                  <th className="py-2 px-2 text-center">VALID</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-black">
                {records.map((r) => {
                  const presentKey = `${r.day}-present`;
                  const permitKey = `${r.day}-permit`;
                  const sickKey = `${r.day}-sick`;
                  const alphaKey = `${r.day}-alpha`;

                  const valP = gridValues[presentKey];
                  const valI = gridValues[permitKey];
                  const valS = gridValues[sickKey];
                  const valA = gridValues[alphaKey];

                  const isP = valP === null ? null : valP === r.present;
                  const isI = valI === null ? null : valI === r.permit;
                  const isS = valS === null ? null : valS === r.sick;
                  const isA = valA === null ? null : valA === r.alpha;

                  const allOk = valP !== null && valI !== null && valS !== null && valA !== null && isP && isI && isS && isA;

                  return (
                    <tr key={r.day} className="hover:bg-slate-50 transition-colors">
                      {/* Day Column */}
                      <td className="py-2 px-2 text-left font-black text-slate-900 text-[10px] sm:text-xs border-r-2 border-black whitespace-nowrap mobile-landscape-table-cell">
                        {r.day}
                      </td>

                      {/* Present */}
                      <td className="py-2 px-1 border-r border-black mobile-landscape-table-cell">
                        <DataTableCell
                          cellKey={presentKey}
                          value={valP}
                          isSelected={selectedCell === presentKey}
                          type="present"
                          onClick={() => selectCell(presentKey)}
                        />
                      </td>

                      {/* Permit */}
                      <td className="py-2 px-1 border-r border-black mobile-landscape-table-cell">
                        <DataTableCell
                          cellKey={permitKey}
                          value={valI}
                          isSelected={selectedCell === permitKey}
                          type="permit"
                          onClick={() => selectCell(permitKey)}
                        />
                      </td>

                      {/* Sick */}
                      <td className="py-2 px-1 border-r border-black mobile-landscape-table-cell">
                        <DataTableCell
                          cellKey={sickKey}
                          value={valS}
                          isSelected={selectedCell === sickKey}
                          type="sick"
                          onClick={() => selectCell(sickKey)}
                        />
                      </td>

                      {/* Alpha */}
                      <td className="py-2 px-1 border-r-2 border-black mobile-landscape-table-cell">
                        <DataTableCell
                          cellKey={alphaKey}
                          value={valA}
                          isSelected={selectedCell === alphaKey}
                          type="alpha"
                          onClick={() => selectCell(alphaKey)}
                        />
                      </td>

                      {/* Validation Icon */}
                      <td className="py-2 px-1 mobile-landscape-table-cell">
                        <div className="flex items-center justify-center">
                          {valP === null || valI === null || valS === null || valA === null ? (
                            <span className="text-[9px] text-slate-400 font-bold">...</span>
                          ) : allOk ? (
                            <span className="bg-[#CCFBF1] text-emerald-900 border-2 border-black text-[9px] px-1.5 py-0.5 rounded-md font-bold flex items-center gap-0.5 shadow-[1px_1px_0px_rgba(0,0,0,1)]">
                              <Check className="w-2.5 h-2.5" /> OK
                            </span>
                          ) : (
                            <span className="bg-[#FBCFE8] text-rose-900 border-2 border-black text-[9px] px-1.5 py-0.5 rounded-md font-extrabold shadow-[1px_1px_0px_rgba(0,0,0,1)]">
                              Cek
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick reference block */}
        <div className="bg-[#FDE047] p-2.5 rounded-xl border-2 border-black flex items-center justify-between shadow-[2px_2px_0px_rgba(0,0,0,1)] text-black shrink-0 mobile-landscape-hide">
          <span className="text-xs text-black font-extrabold flex items-center gap-1.5 leading-tight">
            💡 <span>Masukkan data dari rekapitulasi data sementara yang telah kamu hitung sebelumnya.</span>
          </span>
        </div>
      </div>

      {/* Right column: Numbers Pill Board and validator panel (Control Card) */}
      <div className="flex-[5] min-w-0 min-h-0 flex flex-col justify-between h-fit sm:h-full bg-white border-2 sm:border-4 border-black rounded-2xl sm:rounded-3xl p-3 sm:p-5 shadow-[4px_4px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_rgba(0,0,0,1)] mobile-landscape-compact-card">
        <div className="flex flex-col min-h-0 flex-1 space-y-3">
          


          <div>
            <h3 className="text-xs sm:text-sm font-black text-slate-900 uppercase mb-1 shrink-0 mobile-landscape-compact-text">
              Sumber Token Data Kehadiran
            </h3>
            <p className="text-[11px] text-slate-700 font-bold leading-relaxed mb-2.5">
              Pilih sel pada tabel sebelah kiri, lalu klik angka di bawah ini untuk mengisinya:
            </p>
            
            <div className="flex flex-wrap gap-1.5 p-2 bg-[#CCFBF1] rounded-2xl border-2 border-black select-none shadow-[3.5px_3.5px_0px_rgba(0,0,0,1)] mobile-landscape-compact-card">
              {availablePills.map((val) => (
                <motion.button
                  type="button"
                  key={val}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => placePill(val)}
                  id={`token-pill-${val}`}
                  className="w-8.5 h-8.5 sm:w-10 sm:h-10 rounded-xl bg-white border-2 border-black text-black font-mono font-black text-xs sm:text-sm flex items-center justify-center shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] cursor-pointer hover:bg-[#FBCFE8] transition-all mobile-landscape-table-btn"
                >
                  {val}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Selected feedback */}
          <div className="bg-white border-2 border-black rounded-2xl p-3 shadow-[2px_2px_0px_rgba(0,0,0,1)] mobile-landscape-compact-card">
            <p className="text-xs font-black text-slate-900">Sel Terpilih Saat Ini:</p>
            {selectedCell ? (
              <div className="mt-1.5 flex items-center gap-2">
                <span className="text-[10px] font-mono bg-[#A5F3FC] text-black border border-black px-2 py-0.5 rounded-md font-black uppercase">
                  {selectedCell
                    .replace('-present', ' (HADIR)')
                    .replace('-permit', ' (IZIN)')
                    .replace('-sick', ' (SAKIT)')
                    .replace('-alpha', ' (ALFA)')}
                </span>
                <span className="text-xs text-slate-600 font-bold">Pilih angka di atas!</span>
              </div>
            ) : (
              <p className="mt-1 text-xs text-slate-500 italic font-bold">
                Belum ada sel tabel yang Anda pilih. Silakan klik salah satu sel berlambang tanya "?" pada tabel.
              </p>
            )}
          </div>
        </div>

        {/* Action controls & Alert Warning */}
        <div className="mt-3 pt-3 border-t-2 border-black shrink-0 mobile-landscape-compact-text">


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
              onClick={handleVerifyTable}
              className={`flex-1 bg-[#F43F5E] hover:bg-[#FB7185] text-white border-2 border-black rounded-xl font-black shadow-[2.5px_2.5px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1.5px_1.5px_0px_#000] py-3 text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer ${onBack ? '' : 'w-full'}`}
              id="btn-verify-table"
            >
              <Check className="w-5 h-5" />
              <span>Verifikasi Tabel</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Floating Toast Notification */}
      <AnimatePresence>
        {warningMessage && (
          <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[1000] w-full max-w-sm px-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: -40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -40, scale: 0.95 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="bg-[#FDE047] border-4 border-black p-3.5 rounded-2xl shadow-[4px_4px_0px_#000] flex items-center gap-3 text-black font-black text-xs pointer-events-auto"
            >
              <AlertCircle className="w-5 h-5 shrink-0 text-black animate-bounce" />
              <span className="flex-1 font-extrabold leading-normal">{warningMessage}</span>
              <button
                type="button"
                onClick={() => setWarningMessage(null)}
                className="font-mono text-base font-black border-2 border-black bg-white rounded-md w-6 h-6 flex items-center justify-center cursor-pointer shadow-[1px_1px_0px_#000] active:translate-y-0.5 active:shadow-none hover:bg-slate-100"
              >
                ×
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal Lihat Rekap */}
      <AnimatePresence>
        {showRekapModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-[999] overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="bg-white rounded-3xl border-4 border-black shadow-[6px_6px_0px_#000] p-4 sm:p-6 max-w-md w-full relative text-left"
            >
              <div className="text-center border-b-4 border-black pb-3 mb-4">
                <h3 className="text-sm sm:text-base font-black uppercase text-slate-900">
                  Data Hasil Rekapitulasi Anda
                </h3>
                <p className="text-[10px] text-slate-500 font-bold font-mono mt-1">
                  Gunakan data ini untuk mengisi Tabel Digital
                </p>
              </div>

              {prefilledData ? (
                <div className="space-y-3 font-mono text-xs text-slate-800">
                  <div className="grid grid-cols-5 gap-1 border-b-2 border-black pb-1.5 font-black text-center text-[10px]">
                    <div className="text-left">HARI</div>
                    <div className="text-emerald-700">HADIR</div>
                    <div className="text-sky-700">IZIN</div>
                    <div className="text-amber-700">SAKIT</div>
                    <div className="text-rose-700">ALFA</div>
                  </div>
                  {Object.entries(prefilledData).map(([day, val]) => (
                    <div key={day} className="grid grid-cols-5 gap-1 text-center font-bold items-center border-b border-slate-200 py-1">
                      <div className="text-left font-black text-slate-900">{day}</div>
                      <div className="bg-emerald-50 text-emerald-850 border border-emerald-300 rounded py-0.5">{val.present}</div>
                      <div className="bg-sky-50 text-sky-850 border border-sky-300 rounded py-0.5">{val.permit}</div>
                      <div className="bg-amber-50 text-amber-850 border border-amber-300 rounded py-0.5">{val.sick}</div>
                      <div className="bg-rose-50 text-rose-850 border border-rose-300 rounded py-0.5">{val.alpha}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic text-center font-bold py-4">
                  Belum ada data rekap yang direkam. Selesaikan penghitungan absensi manual di tahap pertama terlebih dahulu!
                </p>
              )}

              <div className="mt-5 pt-3 border-t-2 border-black flex justify-center">
                <button
                  type="button"
                  onClick={() => setShowRekapModal(false)}
                  className="w-full bg-[#F43F5E] hover:bg-[#FB7185] text-white border-2 border-black text-xs font-black py-2.5 rounded-xl shadow-[2px_2px_0px_#000] active:translate-y-0.5 active:shadow-none cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
};
