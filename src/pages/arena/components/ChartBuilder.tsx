import React, { useState, useEffect } from 'react';
import { GameLevel, AttendanceRecord } from '@/src/types';
import { motion } from 'motion/react';
import { TrendingUp, CircleDot, Check, HelpCircle, ChevronUp, ChevronDown, Info, BarChart2 } from 'lucide-react';

interface ChartBuilderProps {
  currentLevel: GameLevel;
  onSuccess: (scoreBonus: number) => void;
}

type ChartType = 'batang' | 'garis' | 'lingkaran';

export const ChartBuilder: React.FC<ChartBuilderProps> = ({
  currentLevel,
  onSuccess,
}) => {
  const records = currentLevel.records;
  
  // Choose chart type
  const [selectedChartType, setSelectedChartType] = useState<ChartType | null>(null);
  
  // Interactive bar adjustment values (for Abstraction step)
  const [barValues, setBarValues] = useState<Record<string, number>>({});
  
  // Validation indicator
  const [isValidated, setIsValidated] = useState<boolean>(false);
  const [warning, setWarning] = useState<string | null>(null);

  // Initialize interactive heights with mild scrambled errors
  useEffect(() => {
    const initial: Record<string, number> = {};
    records.forEach(r => {
      // Offset by some random value so kids have to adjust it
      // Let's make it easy to tweak by setting it to a base of 15
      initial[r.day] = 15;
    });
    setBarValues(initial);
    setIsValidated(false);
    setWarning(null);
  }, [currentLevel, records]);

  const handleAdjustValue = (day: string, increment: number) => {
    setWarning(null);
    setBarValues(prev => {
      const currentVal = prev[day] || 0;
      // Keep within realistic class bounds (0 to 30)
      const maxLimit = currentLevel.id === 1 ? 10 : currentLevel.id === 2 ? 12 : 30;
      const newVal = Math.min(Math.max(currentVal + increment, 0), maxLimit);
      return {
        ...prev,
        [day]: newVal
      };
    });
  };

  const handleVerifyChart = () => {
    if (!selectedChartType) {
      setWarning("👉 Silakan klik salah satu tombol tipe grafik di atas terlebih dahulu!");
      return;
    }

    // Checking if all values match target record present values
    let allMatch = true;
    for (const r of records) {
      if (barValues[r.day] !== r.present) {
        allMatch = false;
        break;
      }
    }

    if (!allMatch) {
      setWarning(`⚠️ Grafik belum sesuai dengan nilai tabel! Periksa tinggi grafik di setiap hari harian.`);
      return;
    }

    setIsValidated(true);
    // Grant 20 score bonus
    onSuccess(20);
  };

  const handleAutofillChart = () => {
    const correct: Record<string, number> = {};
    records.forEach(r => {
      correct[r.day] = r.present;
    });
    setBarValues(correct);
    setWarning(null);
  };

  const maxCapacity = currentLevel.id === 1 ? 10 : currentLevel.id === 2 ? 12 : 30;

  // Pie chart computations (if total hadir vs absent ratios)
  const totalPresent = records.reduce((sum, r) => sum + r.present, 0);
  const totalAbsent = records.reduce((sum, r) => sum + r.absent, 0);
  const grandTotal = totalPresent + totalAbsent;
  const presentAngle = grandTotal > 0 ? (totalPresent / grandTotal) * 360 : 0;

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl border-2 sm:border-4 border-black p-2 sm:p-5 md:p-8 shadow-[4px_4px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_rgba(0,0,0,1)]">
      
      {/* Title block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b-2 border-black pb-3 sm:pb-5 mb-3 sm:mb-6 gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-[#A5F3FC] text-black border-2 border-black rounded-lg text-xs font-black font-mono shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)]">TAHAP 3</span>
            <h2 className="text-lg md:text-xl font-black text-slate-900 font-display uppercase tracking-tight">
              Penyajian Data & Pembuatan Grafik Interaktif
            </h2>
          </div>
          <p className="text-xs text-slate-700 font-bold">
            Komputer menerjemahkan angka ke visual. Pilih format penyajian, lalu ubah ketinggian grafik agar akurat mewakili tabel di bawah.
          </p>
        </div>

        <div className="bg-[#FBCFE8] p-2 sm:p-3 rounded-lg sm:rounded-xl border-2 border-black max-w-sm shadow-[3px_3px_0px_rgba(0,0,0,1)] text-black">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-black mt-0.5 shrink-0" />
            <p className="text-xs text-slate-900 leading-relaxed font-sans font-bold">
              <strong className="font-extrabold text-black">Kiat Abstraksi:</strong> Kita membuang detail kecil dan menampilkan struktur tren utamanya agar mudah dipahami pengambil keputusan.
            </p>
          </div>
        </div>
      </div>

      {/* Database Reference Mini Table */}
      <div className="mb-6 bg-[#FDE047] border-2 border-black p-4 rounded-2xl shadow-[3px_3px_0px_rgba(0,0,0,1)] text-black">
        <h4 className="text-xs font-black text-slate-950 uppercase tracking-wider mb-2 font-mono">
          📋 Acuan Angka Tabel Database Kelas (Hadir)
        </h4>
        <div className="flex flex-wrap gap-4 items-center">
          {records.map(r => (
            <div key={r.day} className="bg-white border-2 border-black px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-[2px_2px_0px_#000]">
              <span className="text-xs font-black text-slate-900">{r.day}:</span>
              <span className="text-xs font-mono font-black text-indigo-700">{r.present} Siswa</span>
            </div>
          ))}
          <button 
            type="button" 
            onClick={handleAutofillChart}
            className="text-[12px] font-black text-black underline hover:text-[#4F46E5] ml-auto"
          >
            Selesaikan Grafik (Isi Otomatis)
          </button>
        </div>
      </div>

      {/* Grid splits into Chart Choices and Custom Graph Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-2 sm:gap-4 md:gap-6 md:gap-8">
        
        {/* Step 3A: Choose presentation medium */}
        <div className="lg:col-span-4 space-y-2 sm:space-y-4">
          <h3 className="text-sm font-black text-slate-900 uppercase border-b-2 border-black pb-2">
            1. Pilih Format Diagram
          </h3>

          <div className="space-y-3.5">
            {/* Bar Chart Choice */}
            <button
              type="button"
              onClick={() => { setSelectedChartType('batang'); setWarning(null); }}
              className={`w-full p-4 rounded-2xl border-2 border-black text-left flex items-start gap-3.5 transition-all cursor-pointer shadow-[3.5px_3.5px_0px_#000] ${
                selectedChartType === 'batang'
                  ? 'bg-[#A5F3FC] text-black scale-[1.02]'
                  : 'bg-white text-slate-800 hover:bg-slate-50'
              }`}
            >
              <div className={`p-2 rounded-xl border border-black shrink-0 ${selectedChartType === 'batang' ? 'bg-[#CCFBF1] text-black' : 'bg-purple-100 text-purple-700'}`}>
                <BarChart2 className="w-5 h-5 font-bold" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-black">Diagram Batang</h4>
                <p className="text-[11px] mt-0.5 leading-relaxed text-slate-800 font-bold">
                  Membandingkan jumlah antar kategori harian secara tegak lurus. Sempurna untuk melihat data kuantitatif mutlak.
                </p>
              </div>
            </button>

            {/* Line Chart Choice */}
            <button
              type="button"
              onClick={() => { setSelectedChartType('garis'); setWarning(null); }}
              className={`w-full p-4 rounded-2xl border-2 border-black text-left flex items-start gap-3.5 transition-all cursor-pointer shadow-[3.5px_3.5px_0px_#000] ${
                selectedChartType === 'garis'
                  ? 'bg-[#A5F3FC] text-black scale-[1.02]'
                  : 'bg-white text-slate-800 hover:bg-slate-50'
              }`}
            >
              <div className={`p-2 rounded-xl border border-black shrink-0 ${selectedChartType === 'garis' ? 'bg-[#CCFBF1] text-black' : 'bg-purple-100 text-purple-700'}`}>
                <TrendingUp className="w-5 h-5 font-bold" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-black">Diagram Garis</h4>
                <p className="text-[11px] mt-0.5 leading-relaxed text-slate-800 font-bold">
                  Memetakan titik data dihubungkan garis kontinu. Ideal untuk melacak perubahan tren naik/turun waktu-ke-waktu.
                </p>
              </div>
            </button>

            {/* Donut Chart Choice */}
            <button
              type="button"
              onClick={() => { setSelectedChartType('lingkaran'); setWarning(null); }}
              className={`w-full p-4 rounded-2xl border-2 border-black text-left flex items-start gap-3.5 transition-all cursor-pointer shadow-[3.5px_3.5px_0px_#000] ${
                selectedChartType === 'lingkaran'
                  ? 'bg-[#A5F3FC] text-black scale-[1.02]'
                  : 'bg-white text-slate-800 hover:bg-slate-50'
              }`}
            >
              <div className={`p-2 rounded-xl border border-black shrink-0 ${selectedChartType === 'lingkaran' ? 'bg-[#CCFBF1] text-black' : 'bg-purple-100 text-purple-700'}`}>
                <CircleDot className="w-5 h-5 font-bold" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-black">Diagram Lingkaran</h4>
                <p className="text-[11px] mt-0.5 leading-relaxed text-slate-800 font-bold">
                  Menampilkan rasio bagian terhadap keseluruhan. Baik untuk membandingkan proporsi total Hadir vs Tidak Hadir.
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Step 3B: Interactive Build Stage */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-3xl p-5 border-4 border-black flex flex-col justify-between min-h-[400px] shadow-[6px_6px_0px_rgba(0,0,0,1)]">
            
            {/* Header statement */}
            <div className="flex items-center justify-between mb-2 sm:mb-4 border-b-2 border-black pb-2.5">
              <span className="text-xs font-black text-slate-900 font-display uppercase tracking-wide">
                🎨 Kanvas Penyajian: {selectedChartType ? `Tampilan ${selectedChartType.toUpperCase()}` : 'Hubungkan Tipe'}
              </span>
              <span className="text-[10px] font-mono text-slate-700 font-black">
                Skala Maksimum: {maxCapacity} Siswa
              </span>
            </div>

            {/* If no chart chosen */}
            {!selectedChartType ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-slate-50 rounded-2xl border-2 border-black shadow-[2px_2px_0px_#000] my-2">
                <div className="w-16 h-16 rounded-full bg-[#CCFBF1] border-2 border-black flex items-center justify-center text-black mb-3 animate-bounce shadow-[3px_3px_0px_#000]">
                  <BarChart2 className="w-8 h-8 font-black" />
                </div>
                <h4 className="font-black text-slate-900 text-sm">Penyajian Data Masih Kosong</h4>
                <p className="text-xs text-slate-700 font-bold max-w-xs mt-1">
                  Silakan pilih jenis penyajian data (batang, garis, atau lingkaran) di panel kiri untuk memulai analisis visual!
                </p>
              </div>
            ) : (
              <div className="flex-1 flex flex-col justify-end">
                
                {/* SVG Visual Canvas */}
                <div className="relative w-full h-52 bg-white rounded-2xl border-2 border-black p-4 mb-2 sm:mb-4 flex items-end justify-around">
                  
                  {/* Backdrop division lines */}
                  <div className="absolute inset-x-0 top-0 bottom-8 flex flex-col justify-between pointer-events-none px-2 z-0">
                    {[1, 2, 3, 4].map((v, i) => (
                      <div key={i} className="w-full border-t border-slate-100 flex justify-between items-center text-[9px] font-mono text-slate-400">
                        <span>{Math.round(maxCapacity - (i * (maxCapacity / 4)))}</span>
                      </div>
                    ))}
                  </div>

                  {/* Diagram Batang Renderer */}
                  {selectedChartType === 'batang' && records.map((r) => {
                    const currentVal = barValues[r.day] || 0;
                    const percentHeight = (currentVal / maxCapacity) * 100;
                    const isPerfect = currentVal === r.present;

                    return (
                      <div key={r.day} className="flex flex-col items-center z-10 w-full">
                        <div className="text-[10px] font-mono font-black text-slate-900 mb-1">
                          {currentVal}
                        </div>
                        <div className="w-8 md:w-12 bg-slate-100 h-32 rounded-lg flex items-end overflow-hidden border-2 border-black shadow-[1.5px_1.5px_0px_#000]">
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${percentHeight}%` }}
                            transition={{ duration: 0.3 }}
                            className={`w-full rounded-t-sm ${isPerfect ? 'bg-indigo-600' : 'bg-rose-500'}`}
                          />
                        </div>
                      </div>
                    );
                  })}

                  {/* Diagram Garis Renderer */}
                  {selectedChartType === 'garis' && (
                    <div className="absolute inset-x-4 top-10 bottom-8 flex items-end justify-around z-10 w-[95%] mx-auto">
                      {/* SVG line connector */}
                      <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                        <polyline
                          fill="none"
                          stroke="black"
                          strokeWidth="4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          points={records.map((r, idx) => {
                            const val = barValues[r.day] || 0;
                            const x = (idx / (records.length - 1)) * 100; // rough placement
                            const y = 100 - ((val / maxCapacity) * 100);
                            return `${x}%,${y}%`;
                          }).join(' ')}
                          style={{ transition: 'all 0.3s' }}
                        />
                      </svg>

                      {/* Interactive dot plotters */}
                      {records.map((r) => {
                        const currentVal = barValues[r.day] || 0;
                        const isPerfect = currentVal === r.present;

                        return (
                          <div key={r.day} className="flex flex-col items-center z-20">
                            <span className="text-[10px] font-mono font-black text-black bg-[#FDE047] border border-black px-1 py-0.5 rounded-sm mb-1 shadow-[1px_1px_0px_#000]">
                              {currentVal}
                            </span>
                            <div className="h-28 flex items-end">
                              <motion.div 
                                style={{ transform: `translateY(-${(currentVal / maxCapacity) * 100}px)` }}
                                className={`w-4 h-4 rounded-full border-2 border-black shadow-md cursor-pointer transition-colors ${
                                  isPerfect ? 'bg-[#CCFBF1] ring-2 ring-black' : 'bg-rose-500'
                                }`}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Diagram Lingkaran (Total Ratios) */}
                  {selectedChartType === 'lingkaran' && (
                    <div className="w-full h-full flex items-center justify-center gap-2 sm:gap-4 md:gap-6 z-10">
                      {/* Doughnut structure */}
                      <div className="relative w-28 h-28 shrink-0">
                        <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                          {/* Outer Track */}
                          <circle cx="18" cy="18" r="15.915" fill="none" stroke="#FBCFE8" strokeWidth="5.5" className="stroke-rose-200" />
                          {/* Inner filled present ratio */}
                          <circle 
                            cx="18" cy="18" r="15.915" 
                            fill="none" stroke="black" 
                            strokeWidth="5.5"
                            strokeDasharray={`${(totalPresent / grandTotal) * 100} ${100 - ((totalPresent / grandTotal) * 100)}`}
                            strokeDashoffset="0"
                            className="transition-all duration-500"
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center font-display">
                          <span className="text-md font-black text-slate-900 leading-none">
                            {Math.round((totalPresent / grandTotal) * 100)}%
                          </span>
                          <span className="text-[8px] font-mono font-black text-slate-800 uppercase mt-0.5">Hadir</span>
                        </div>
                      </div>

                      <div className="text-left space-y-2">
                        <h4 className="text-xs font-black text-slate-950 uppercase">Rasio Kumulatif Mingguan</h4>
                        <div className="flex items-center gap-2">
                          <span className="w-3.5 h-3.5 rounded-full bg-black border border-black shadow-[1px_1px_0px_#000]" />
                          <span className="text-xs text-slate-800 font-bold animate-pulse">Hadir: <strong>{totalPresent}</strong> Siswa ({Math.round((totalPresent / grandTotal) * 100)}%)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-3.5 h-3.5 rounded-full bg-[#FBCFE8] border border-black shadow-[1px_1px_0px_#000]" />
                          <span className="text-xs text-slate-800 font-bold">Tidak Hadir: <strong>{totalAbsent}</strong> Siswa ({Math.round((totalAbsent / grandTotal) * 100)}%)</span>
                        </div>
                      </div>
                    </div>
                  )}

                </div>

                {/* Sub-Interactive Controls for Adjusting Values */}
                {selectedChartType !== 'lingkaran' ? (
                  <div className="bg-white border-2 border-black p-3 rounded-2xl shadow-[2.5px_2.5px_0px_rgba(0,0,0,1)]">
                    <p className="text-[11px] font-black text-slate-700 text-center mb-3">
                      👇 Klik tombol (+) dan (-) untuk menyamakan tinggi grafik siswa HADIR dengan tabel acuan!
                    </p>
                    
                    <div className="grid grid-cols-5 gap-1.5 md:gap-3 text-center">
                      {records.map((r) => {
                        const currentVal = barValues[r.day] || 0;
                        const isPerfect = currentVal === r.present;

                        return (
                          <div 
                            key={r.day} 
                            className={`p-1.5 rounded-xl border-2 border-black flex flex-col items-center justify-between gap-1 transition-all shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] ${
                              isPerfect ? 'bg-[#CCFBF1] border-black' : 'bg-slate-100 border-slate-350'
                            }`}
                          >
                            <span className="text-[10px] font-black text-slate-900">{r.day.substring(0, 3)}</span>

                            <div className="flex flex-col gap-1 w-full max-w-[48px]">
                              {/* Higher */}
                              <button
                                type="button"
                                onClick={() => handleAdjustValue(r.day, 1)}
                                className="p-1 text-black bg-[#CCFBF1] border-2 border-black rounded-lg shadow-[1px_1px_0px_rgba(0,0,0,1)] flex items-center justify-center cursor-pointer hover:bg-emerald-300"
                                id={`btn-up-${r.day}`}
                              >
                                <ChevronUp className="w-4 h-4 font-black" />
                              </button>
                              
                              {/* Value badge */}
                              <span className={`text-xs font-mono font-black py-0.5 rounded-md border border-black shadow-[1px_1px_0px_rgba(0,0,0,1)] ${
                                isPerfect ? 'bg-[#A5F3FC]/60 text-indigo-950' : 'bg-white text-slate-900'
                              }`}>
                                {currentVal}
                              </span>

                              {/* Lower */}
                              <button
                                type="button"
                                onClick={() => handleAdjustValue(r.day, -1)}
                                className="p-1 text-black bg-[#FBCFE8] border-2 border-black rounded-lg shadow-[1px_1px_0px_rgba(0,0,0,1)] flex items-center justify-center cursor-pointer hover:bg-rose-300"
                                id={`btn-down-${r.day}`}
                              >
                                <ChevronDown className="w-4 h-4 font-black" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="bg-[#A5F3FC] border-2 border-black p-4 rounded-2xl text-center shadow-[3px_3px_0px_#000]">
                    <p className="text-xs text-slate-950 leading-relaxed font-bold">
                      🎯 <strong className="font-extrabold text-black">Diagram Lingkaran sudah otomatis sesuai!</strong> Jenis diagram ini sangat bagus untuk memaparkan proporsi visual presentase kehadiran siswa secara kumulatif, namun kurang efektif dalam melacak tren perubahan hari demi hari.
                    </p>
                  </div>
                )}

              </div>
            )}

            {/* Validation row */}
            <div className="mt-2 sm:mt-4 pt-4 border-t-2 border-black flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                {warning && (
                  <p className="text-xs font-black text-black bg-[#FDE047] border-2 border-black px-3 py-1.5 rounded-xl shadow-[2px_2px_0px_#000]">
                    {warning}
                  </p>
                )}
                {!warning && !isValidated && (
                  <p className="text-xs text-slate-700 font-bold">
                    Pastikan susunan diagram sesuai dengan database acuan harian!
                  </p>
                )}
                {isValidated && (
                  <p className="text-xs font-black text-emerald-950 bg-[#CCFBF1] border-2 border-black px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-[2.5px_2.5px_0px_#000]">
                    <Check className="w-4 h-4 text-emerald-900" /> Grafik Sukses Disajikan Sempurna (+20 pts)
                  </p>
                )}
              </div>

              {!isValidated && (
                <button
                  type="button"
                  onClick={handleVerifyChart}
                  className="bg-rose-500 text-white font-black hover:bg-rose-600 border-2 border-black text-xs py-2.5 px-5 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-[3px_3px_0px_#000]"
                  id="btn-verify-chart"
                >
                  <Check className="w-4 h-4 text-white" />
                  Sajikan Grafik & Lanjutkan
                </button>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
