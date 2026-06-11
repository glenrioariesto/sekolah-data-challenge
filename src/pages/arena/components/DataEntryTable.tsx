import React, { useState, useEffect } from 'react';
import { GameLevel } from '@/src/types';
import { motion } from 'motion/react';
import { Check, Table, Info, RotateCcw } from 'lucide-react';

interface DataEntryTableProps {
  currentLevel: GameLevel;
  onSuccess: (scoreBonus: number) => void;
  prefilledData?: Record<string, { present: number, permit: number, sick: number, alpha: number }> | null;
  onBack?: () => void;
}

export const DataEntryTable: React.FC<DataEntryTableProps> = ({
  currentLevel,
  onSuccess,
  prefilledData,
  onBack,
}) => {
  const records = currentLevel.records;
  
  // Find all possible numbers in this level's records to make "Data Pills"
  const availablePills: number[] = Array.from(new Set<number>(
    records.flatMap(r => [r.present, r.permit, r.sick, r.alpha])
  )).sort((a: number, b: number) => a - b);

  // User bound values: Record<string, number | null>
  // Keys will be `${day}-present`, `${day}-permit`, `${day}-sick`, `${day}-alpha`
  const [gridValues, setGridValues] = useState<Record<string, number | null>>(() => {
    const initial: Record<string, number | null> = {};
    records.forEach(r => {
      if (prefilledData && prefilledData[r.day]) {
        const pre = prefilledData[r.day];
        initial[`${r.day}-present`] = pre.present;
        initial[`${r.day}-permit`] = pre.permit;
        initial[`${r.day}-sick`] = pre.sick;
        initial[`${r.day}-alpha`] = pre.alpha;
      } else {
        initial[`${r.day}-present`] = null;
        initial[`${r.day}-permit`] = null;
        initial[`${r.day}-sick`] = null;
        initial[`${r.day}-alpha`] = null;
      }
    });
    return initial;
  });

  useEffect(() => {
    const initial: Record<string, number | null> = {};
    records.forEach(r => {
      if (prefilledData && prefilledData[r.day]) {
        const pre = prefilledData[r.day];
        initial[`${r.day}-present`] = pre.present;
        initial[`${r.day}-permit`] = pre.permit;
        initial[`${r.day}-sick`] = pre.sick;
        initial[`${r.day}-alpha`] = pre.alpha;
      } else {
        initial[`${r.day}-present`] = null;
        initial[`${r.day}-permit`] = null;
        initial[`${r.day}-sick`] = null;
        initial[`${r.day}-alpha`] = null;
      }
    });
    setGridValues(initial);
    setSelectedCell(null);
    setWarningMessage(null);
  }, [currentLevel, prefilledData, records]);

  // Keep track of which cell is currently selected for pill injection
  const [selectedCell, setSelectedCell] = useState<string | null>(null);
  
  // Validation messages
  const [warningMessage, setWarningMessage] = useState<string | null>(null);

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
  };

  const handleAutofill = () => {
    const correct: Record<string, number | null> = {};
    records.forEach(r => {
      correct[`${r.day}-present`] = r.present;
      correct[`${r.day}-permit`] = r.permit;
      correct[`${r.day}-sick`] = r.sick;
      correct[`${r.day}-alpha`] = r.alpha;
    });
    setGridValues(correct);
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
    <div className="bg-white rounded-2xl sm:rounded-3xl border-2 sm:border-4 border-black p-2 sm:p-4 md:p-6 shadow-[4px_4px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_rgba(0,0,0,1)]">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-3 sm:gap-4 md:gap-6">
        
        {/* Left column: Central Database Table Grid */}
        <div className="xl:col-span-7">
          <div className="bg-white rounded-2xl p-2.5 sm:p-4 border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center justify-between mb-2 sm:mb-4">
              <h3 className="text-sm font-black text-slate-900 uppercase flex items-center gap-2">
                <Table className="w-4.5 h-4.5 text-indigo-600 font-black" />
                Sistem Basis Data Kehadiran Sekolah
              </h3>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleClear}
                  className="px-2.5 py-1 text-[10px] font-black text-black bg-[#FBCFE8] border-2 border-black rounded-lg hover:bg-rose-100 flex items-center gap-1 cursor-pointer shadow-[1.5px_1.5px_0px_#000]"
                >
                  <RotateCcw className="w-3 h-3" />
                  Mulai Ulang
                </button>
              </div>
            </div>

            {/* Interactive Grid styled nicely as a professional school system ledger */}
            <div className="overflow-hidden rounded-xl border-4 border-black shadow-[3px_3px_0px_rgba(0,0,0,1)] bg-white">
              <div className="overflow-x-auto w-full">
                <table className="w-full text-center border-collapse min-w-[400px]">
                  <thead>
                    <tr className="bg-[#A5F3FC] text-[10px] sm:text-xs font-black text-black font-display border-b-2 border-black">
                      <th className="py-1.5 px-2 text-left border-r-2 border-black">HARI</th>
                      <th className="py-1.5 px-1 border-r border-black text-center text-emerald-800">HADIR (H)</th>
                      <th className="py-1.5 px-1 border-r border-black text-center text-sky-850">IZIN (I)</th>
                      <th className="py-1.5 px-1 border-r border-black text-center text-amber-850">SAKIT (S)</th>
                      <th className="py-1.5 px-1 border-r-2 border-black text-center text-rose-850">ALFA (A)</th>
                      <th className="py-1.5 px-2 text-center">VALID</th>
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
                          <td className="py-1.5 px-2 text-left font-black text-slate-900 text-[10px] sm:text-xs border-r-2 border-black whitespace-nowrap">
                            {r.day}
                          </td>

                          {/* Present */}
                          <td className="py-1.5 px-1 border-r border-black">
                            <div 
                              onClick={() => selectCell(presentKey)}
                              className={`w-8 sm:w-10 mx-auto py-1 sm:py-1.5 rounded-lg border-2 border-black font-mono font-black text-center cursor-pointer transition-all text-[10px] sm:text-xs ${
                                selectedCell === presentKey
                                  ? 'bg-[#FDE047] text-black shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] scale-105'
                                  : valP !== null
                                    ? 'bg-[#CCFBF1] text-emerald-900 border-emerald-500 shadow-[1px_1px_0px_rgba(0,0,0,1)]'
                                    : 'bg-indigo-50/40 text-[#4F46E5] border-dashed border-indigo-400 hover:bg-[#A5F3FC]/30'
                              }`}
                            >
                              {valP !== null ? valP : '?'}
                            </div>
                          </td>

                          {/* Permit */}
                          <td className="py-1.5 px-1 border-r border-black">
                            <div 
                              onClick={() => selectCell(permitKey)}
                              className={`w-8 sm:w-10 mx-auto py-1 sm:py-1.5 rounded-lg border-2 border-black font-mono font-black text-center cursor-pointer transition-all text-[10px] sm:text-xs ${
                                selectedCell === permitKey
                                  ? 'bg-[#FDE047] text-black shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] scale-105'
                                  : valI !== null
                                    ? 'bg-[#E0F2FE] text-sky-900 border-sky-500 shadow-[1px_1px_0px_rgba(0,0,0,1)]'
                                    : 'bg-indigo-50/40 text-[#4F46E5] border-dashed border-indigo-400 hover:bg-[#A5F3FC]/30'
                              }`}
                            >
                              {valI !== null ? valI : '?'}
                            </div>
                          </td>

                          {/* Sick */}
                          <td className="py-1.5 px-1 border-r border-black">
                            <div 
                              onClick={() => selectCell(sickKey)}
                              className={`w-8 sm:w-10 mx-auto py-1 sm:py-1.5 rounded-lg border-2 border-black font-mono font-black text-center cursor-pointer transition-all text-[10px] sm:text-xs ${
                                selectedCell === sickKey
                                  ? 'bg-[#FDE047] text-black shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] scale-105'
                                  : valS !== null
                                    ? 'bg-[#FEF3C7] text-amber-900 border-amber-500 shadow-[1px_1px_0px_rgba(0,0,0,1)]'
                                    : 'bg-indigo-50/40 text-[#4F46E5] border-dashed border-indigo-400 hover:bg-[#A5F3FC]/30'
                              }`}
                            >
                              {valS !== null ? valS : '?'}
                            </div>
                          </td>

                          {/* Alpha */}
                          <td className="py-1.5 px-1 border-r-2 border-black">
                            <div 
                              onClick={() => selectCell(alphaKey)}
                              className={`w-8 sm:w-10 mx-auto py-1 sm:py-1.5 rounded-lg border-2 border-black font-mono font-black text-center cursor-pointer transition-all text-[10px] sm:text-xs ${
                                selectedCell === alphaKey
                                  ? 'bg-[#FDE047] text-black shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] scale-105'
                                  : valA !== null
                                    ? 'bg-[#FEE2E2] text-rose-900 border-rose-500 shadow-[1px_1px_0px_rgba(0,0,0,1)]'
                                    : 'bg-indigo-50/40 text-[#4F46E5] border-dashed border-indigo-400 hover:bg-[#A5F3FC]/30'
                              }`}
                            >
                              {valA !== null ? valA : '?'}
                            </div>
                          </td>

                          {/* Validation Icon */}
                          <td className="py-1 px-1">
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
            <div className="mt-3 bg-[#FDE047] p-2.5 rounded-xl border-2 border-black flex items-center justify-between shadow-[2px_2px_0px_rgba(0,0,0,1)] text-black">
              <span className="text-xs text-black font-extrabold flex items-center gap-1.5 leading-tight">
                💡 <span>Masukkan data dari rekapitulasi data sementara yang telah kamu hitung sebelumnya.</span>
              </span>
              <button 
                type="button"
                onClick={handleAutofill}
                className="text-[10px] font-black underline hover:text-[#4F46E5] shrink-0"
              >
                Isi Otomatis (Petunjuk)
              </button>
            </div>

          </div>
        </div>

        {/* Right column: Numbers Pill Board and validator panel */}
        <div className="xl:col-span-5 flex flex-col justify-between">
          <div className="space-y-2 sm:space-y-4">
            <div>
              <h3 className="text-xs sm:text-sm font-black text-slate-900 uppercase mb-1 flex items-center gap-1.5">
                🔢 Sumber Token Data Kehadiran
              </h3>
              <p className="text-[11px] text-slate-700 font-bold leading-relaxed mb-2">
                Pilih sel pada tabel sebelah kiri, lalu klik angka di bawah ini untuk mengisinya:
              </p>
              
              <div className="flex flex-wrap gap-1.5 p-2 bg-[#CCFBF1] rounded-2xl border-2 border-black select-none shadow-[3.5px_3.5px_0px_rgba(0,0,0,1)]">
                {availablePills.map((val) => (
                  <motion.button
                    type="button"
                    key={val}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => placePill(val)}
                    id={`token-pill-${val}`}
                    className="w-8.5 h-8.5 sm:w-10 sm:h-10 rounded-xl bg-white border-2 border-black text-black font-mono font-black text-xs sm:text-sm flex items-center justify-center shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] cursor-pointer hover:bg-[#FBCFE8] transition-all"
                  >
                    {val}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Selected feedback */}
            <div className="bg-white border-2 border-black rounded-2xl p-3 shadow-[2px_2px_0px_rgba(0,0,0,1)]">
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
            
            <div className="p-3 bg-[#A5F3FC] border-2 border-black rounded-xl shadow-[2.5px_2.5px_0px_#000]">
              <p className="text-[10px] text-slate-950 font-bold leading-relaxed">
                💡 <strong className="font-extrabold text-black">Info Edukatif:</strong> Dengan memasukkan data secara digital, sistem komputer akan mempermudah kita mendiagnosis masalah absensi dengan satu klik.
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t-2 border-black">
            {warningMessage && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-3 bg-[#FDE047] border-2 border-black rounded-2xl p-3 flex items-start gap-2.5 shadow-[3px_3px_0px_rgba(0,0,0,1)] text-[#1E293B] font-black"
                id="warning-box"
              >
                <div className="w-5 h-5 rounded-full bg-white border border-black flex items-center justify-center text-black font-black shrink-0 text-xs text-center shadow-[1px_1px_0px_#000]">!</div>
                <span className="text-xs text-black font-extrabold leading-relaxed">
                  {warningMessage}
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
                onClick={handleVerifyTable}
                className={`flex-1 brutal-btn py-3 text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer ${onBack ? '' : 'w-full'}`}
                id="btn-verify-table"
              >
                <Check className="w-5 h-5" />
                <span>Simpan & Verifikasi Tabel</span>
              </motion.button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
