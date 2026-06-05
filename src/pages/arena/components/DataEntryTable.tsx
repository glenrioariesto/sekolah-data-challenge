import React, { useState } from 'react';
import { GameLevel } from '@/src/types';
import { motion, AnimatePresence } from 'motion/react';
import { Check, ArrowRight, Table, HelpCircle, RefreshCw, Star, Info, ListFilter, RotateCcw } from 'lucide-react';

interface DataEntryTableProps {
  currentLevel: GameLevel;
  onSuccess: (scoreBonus: number) => void;
}

export const DataEntryTable: React.FC<DataEntryTableProps> = ({
  currentLevel,
  onSuccess,
}) => {
  // Available numbers to click and place as tokens
  const records = currentLevel.records;
  
  // Find all possible numbers in this level's records to make "Data Pills"
  // For Level 2: {SeninH: 10, SeninTH: 2, SelasaH: 11, SelasaTH: 1, RabuH: 9, RabuTH: 3, KamisH: 12, KamisTH: 0, JumatH: 8, JumatTH: 4}
  // Let's pool all valid numbers and shuffle them slightly
  const availablePills: number[] = Array.from(new Set<number>(
    records.flatMap(r => [r.present, r.absent])
  )).sort((a: number, b: number) => a - b);

  // User bound values: Record<string, number | null>
  // Keys will be `${day}-present` or `${day}-absent`
  const [gridValues, setGridValues] = useState<Record<string, number | null>>(() => {
    const initial: Record<string, number | null> = {};
    records.forEach(r => {
      initial[`${r.day}-present`] = null;
      initial[`${r.day}-absent`] = null;
    });
    return initial;
  });

  // Keep track of which cell is currently selected for pill injection
  const [selectedCell, setSelectedCell] = useState<string | null>(null);
  
  // Validation messages
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const [attempts, setAttempts] = useState<number>(0);

  const selectCell = (cellKey: string) => {
    setSelectedCell(cellKey);
    setWarningMessage(null);
  };

  const placePill = (value: number) => {
    if (!selectedCell) {
      setWarningMessage("👉 Silakan klik salah satu kotak kosong berwarna biru di tabel terlebih dahulu!");
      return;
    }

    setGridValues(prev => ({
      ...prev,
      [selectedCell]: value
    }));

    // Auto move to the next empty cell for fluid gameplay
    const cellIds = records.flatMap(r => [`${r.day}-present`, `${r.day}-absent`]);
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

  const handleManualChange = (day: string, field: 'present' | 'absent', valStr: string) => {
    const key = `${day}-${field}`;
    const val = valStr === '' ? null : parseInt(valStr, 10);
    setGridValues(prev => ({
      ...prev,
      [key]: val
    }));
    setWarningMessage(null);
  };

  const handleClear = () => {
    const cleared: Record<string, number | null> = {};
    records.forEach(r => {
      cleared[`${r.day}-present`] = null;
      cleared[`${r.day}-absent`] = null;
    });
    setGridValues(cleared);
    setSelectedCell(null);
    setWarningMessage(null);
  };

  const handleAutofill = () => {
    // Fill values with the right ones
    const correct: Record<string, number | null> = {};
    records.forEach(r => {
      correct[`${r.day}-present`] = r.present;
      correct[`${r.day}-absent`] = r.absent;
    });
    setGridValues(correct);
    setSelectedCell(null);
    setWarningMessage(null);
  };

  const handleVerifyTable = () => {
    setWarningMessage(null);
    setAttempts(a => a + 1);

    // Verify all cells are filled
    for (const r of records) {
      const pVal = gridValues[`${r.day}-present`];
      const aVal = gridValues[`${r.day}-absent`];
      if (pVal === null || aVal === null) {
        setWarningMessage("⚠️ Mohon lengkapi seluruh sel kosong di tabel terlebih dahulu!");
        return;
      }
    }

    // Compare values
    for (const r of records) {
      const pVal = gridValues[`${r.day}-present`];
      const aVal = gridValues[`${r.day}-absent`];
      
      if (pVal !== r.present) {
        setWarningMessage(`⚠️ Periksa kembali data hari ${r.day}! Nilai kehadiran (Hadir) masih belum sesuai.`);
        return;
      }
      if (aVal !== r.absent) {
        setWarningMessage(`⚠️ Periksa kembali data hari ${r.day}! Nilai ketidakhadiran (Tidak Hadir) belum sesuai.`);
        return;
      }
    }

    // Success! Give 15 score points for correct compilation of structured table.
    onSuccess(15);
  };

  // Determine standard reference values to display as aid
  // For Level 2, we show calculated lists summary below
  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl border-2 sm:border-4 border-black p-2 sm:p-5 md:p-8 shadow-[4px_4px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_rgba(0,0,0,1)]">
      
      {/* Title block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b-2 border-black pb-3 sm:pb-5 mb-3 sm:mb-6 gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-[#A5F3FC] text-black border-2 border-black rounded-lg text-xs font-black font-mono shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)]">TAHAP 2</span>
            <h2 className="text-lg md:text-xl font-black text-slate-900 font-display uppercase tracking-tight">
              Input & Organisasi Data ke Tabel Digital
            </h2>
          </div>
          <p className="text-xs text-slate-700 font-bold">
            Tata data kehadiran harian ke dalam grid tabel administrasi. Klik salah satu sel kosong, lalu pilih angka dari "Kotak Token Data" untuk memasukkannya!
          </p>
        </div>

        <div className="bg-[#FBCFE8] p-2 sm:p-3 rounded-lg sm:rounded-xl border-2 border-black max-w-sm shadow-[3px_3px_0px_rgba(0,0,0,1)] text-black">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-black mt-0.5 shrink-0" />
            <p className="text-xs text-black leading-relaxed font-sans font-bold">
              <strong className="font-extrabold text-black">Kiat Pengenalan Pola:</strong> Anda menyusun pola lurus tabel agar data dapat diproses menjadi sebuah visualisasi yang rapi.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-3 sm:gap-2 sm:gap-4 md:gap-6 md:gap-8">
        
        {/* Left column: Central Database Table Grid */}
        <div className="xl:col-span-7">
          <div className="bg-white rounded-2xl p-3 sm:p-5 border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)]">
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
              <table className="w-full text-center border-collapse">
                <thead>
                  <tr className="bg-[#A5F3FC] text-xs font-black text-black font-display border-b-2 border-black">
                    <th className="py-1.5 px-2.5 sm:py-3 sm:px-4 text-left border-r-2 border-black">HARI SEKOLAH</th>
                    <th className="py-1.5 px-2 sm:py-3 sm:px-3 uppercase tracking-wider border-r-2 border-black text-center">Hadir (H)</th>
                    <th className="py-1.5 px-2 sm:py-3 sm:px-3 uppercase tracking-wider border-r-2 border-black text-center">Tidak Hadir (TH)</th>
                    <th className="py-1.5 px-2 sm:py-3 sm:px-3 text-center">VALIDASI</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-black">
                  {records.map((r) => {
                    const presentKey = `${r.day}-present`;
                    const absentKey = `${r.day}-absent`;

                    const valP = gridValues[presentKey];
                    const valA = gridValues[absentKey];

                    // Check individual correct/status
                    const isPresentCorr = valP === null ? null : valP === r.present;
                    const isAbsentCorr = valA === null ? null : valA === r.absent;

                    return (
                      <tr key={r.day} className="hover:bg-slate-50 transition-colors">
                        {/* Day Column */}
                        <td className="py-2 px-3 sm:py-3.5 sm:px-4 text-left font-black text-slate-900 text-sm border-r-2 border-black">
                          {r.day}
                        </td>

                        {/* Present input column */}
                        <td className="py-2 px-2 border-r-2 border-black">
                          <div 
                            onClick={() => selectCell(presentKey)}
                            className={`w-16 mx-auto py-1.5 sm:w-20 sm:py-2.5 rounded-xl border-2 border-black font-mono font-black text-center cursor-pointer transition-all ${
                              selectedCell === presentKey
                                ? 'bg-[#FDE047] text-black shadow-[2.5px_2.5px_0px_rgba(0,0,0,1)] scale-105'
                                : valP !== null
                                  ? 'bg-[#CCFBF1] text-black shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)]'
                                  : 'bg-indigo-50/40 text-[#4F46E5] border-dashed border-indigo-400 hover:bg-[#A5F3FC]/30'
                            }`}
                          >
                            {valP !== null ? valP : '?'}
                          </div>
                        </td>

                        {/* Absent input column */}
                        <td className="py-2 px-2 border-r-2 border-black">
                          <div 
                            onClick={() => selectCell(absentKey)}
                            className={`w-16 mx-auto py-1.5 sm:w-20 sm:py-2.5 rounded-xl border-2 border-black font-mono font-black text-center cursor-pointer transition-all ${
                              selectedCell === absentKey
                                ? 'bg-[#FDE047] text-black shadow-[2.5px_2.5px_0px_rgba(0,0,0,1)] scale-105'
                                : valA !== null
                                  ? 'bg-[#FBCFE8] text-black shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)]'
                                  : 'bg-indigo-50/40 text-[#4F46E5] border-dashed border-indigo-400 hover:bg-[#A5F3FC]/30'
                            }`}
                          >
                            {valA !== null ? valA : '?'}
                          </div>
                        </td>

                        {/* Right live validation icons */}
                        <td className="py-1.5 px-2 sm:py-2.5 sm:px-3">
                          <div className="flex items-center justify-center gap-1.5">
                            {valP === null || valA === null ? (
                              <span className="text-[10px] text-slate-500 font-bold">Kosong</span>
                            ) : isPresentCorr && isAbsentCorr ? (
                              <span className="bg-[#CCFBF1] text-black border-2 border-black text-[10px] px-2 py-0.5 rounded-md font-bold flex items-center gap-1 shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)]">
                                <Check className="w-3 h-3 text-black font-black" /> OK
                              </span>
                            ) : (
                              <span className="bg-[#FBCFE8] text-black border-2 border-black text-[10px] px-2 py-0.5 rounded-md font-extrabold shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)]">
                                Cek Ulang
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

            {/* Quick reference block */}
            <div className="mt-2 sm:mt-4 bg-[#FDE047] p-2 sm:p-3 rounded-lg sm:rounded-xl border-2 border-black flex items-center justify-between shadow-[2px_2px_0px_rgba(0,0,0,1)] text-black">
              <span className="text-xs text-black font-extrabold flex items-center gap-1.5 leading-tight">
                <Star className="w-4 h-4 text-black fill-current shrink-0" />
                <span>Total kelas terdaftar adalah 12 siswa per hari. (Hadir + TH = 12)</span>
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
          <div className="space-y-3 sm:space-y-5">
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase mb-2 flex items-center gap-1.5">
                🔢 Sumber Token Data Kehadiran
              </h3>
              <p className="text-xs text-slate-700 font-bold leading-relaxed mb-2 sm:mb-4">
                Pilih sel pada tabel sebelah kiri, lalu klik angka di bawah ini untuk mengisinya:
              </p>
              
              <div className="flex flex-wrap gap-2.5 p-4 bg-[#CCFBF1] rounded-2xl border-2 border-black select-none shadow-[3.5px_3.5px_0px_rgba(0,0,0,1)]">
                {availablePills.map((val) => (
                  <motion.button
                    type="button"
                    key={val}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => placePill(val)}
                    id={`token-pill-${val}`}
                    className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl bg-white border-2 border-black text-black font-mono font-black text-base flex items-center justify-center shadow-[2px_2px_0px_rgba(0,0,0,1)] cursor-pointer hover:bg-[#FBCFE8] transition-all"
                  >
                    {val}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Selected feedback */}
            <div className="bg-white border-2 border-black rounded-2xl p-2.5 sm:p-4 shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] sm:shadow-[2px_2px_0px_rgba(0,0,0,1)]">
              <p className="text-xs font-black text-slate-900">Sel Terpilih Saat Ini:</p>
              {selectedCell ? (
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-[11px] font-mono bg-[#A5F3FC] text-black border border-black px-2 py-1 rounded-md font-black">
                    {selectedCell.replace('-present', ' (HADIR)').replace('-absent', ' (TIDAK HADIR)')}
                  </span>
                  <span className="text-xs text-slate-600 font-bold">Silakan klik tombol angka di atas!</span>
                </div>
              ) : (
                <p className="mt-1 text-xs text-slate-550 italic font-bold">
                  Belum ada sel tabel yang Anda pilih. Silakan klik salah satu sel berlambang tanya "?" pada tabel.
                </p>
              )}
            </div>
            
            {/* Direct manual input help for accessibility */}
            <div className="p-3.5 bg-[#A5F3FC] border-2 border-black rounded-xl shadow-[2.5px_2.5px_0px_#000]">
              <p className="text-[10px] text-slate-950 font-bold leading-relaxed">
                💡 <strong className="font-extrabold text-black">Info Edukatif:</strong> Dengan memasukkan data secara digital, sistem komputer akan mempermudah kita mendiagnosis masalah absensi dengan satu klik.
              </p>
            </div>
          </div>

          <div className="mt-2 sm:mt-4 sm:mt-8 pt-3 sm:pt-5 border-t-2 border-black">
            {/* Dynamic Warnings */}
            {warningMessage && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-2 sm:mb-4 bg-[#FDE047] border-2 border-black rounded-2xl p-3 flex items-start gap-2.5 shadow-[3px_3px_0px_rgba(0,0,0,1)] text-[#1E293B] font-black"
                id="warning-box"
              >
                <div className="w-5 h-5 rounded-full bg-white border border-black flex items-center justify-center text-black font-black shrink-0 text-xs text-center shadow-[1px_1px_0px_#000]">!</div>
                <span className="text-xs text-black font-extrabold leading-relaxed">
                  {warningMessage}
                </span>
              </motion.div>
            )}

            {/* Validation Submit Button */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleVerifyTable}
              className="w-full brutal-btn py-2 sm:py-4 text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer"
              id="btn-verify-table"
            >
              <Check className="w-5 h-5" />
              <span>Simpan & Verifikasi Tabel</span>
            </motion.button>
          </div>

        </div>

      </div>
    </div>
  );
};
