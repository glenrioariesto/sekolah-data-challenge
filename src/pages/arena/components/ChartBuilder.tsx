import React, { useState, useEffect } from 'react';
import { GameLevel } from '@/src/types';
import { motion } from 'motion/react';
import { TrendingUp, CircleDot, Check, Info, BarChart2, Star } from 'lucide-react';

interface ChartBuilderProps {
  currentLevel: GameLevel;
  onSuccess: (scoreBonus: number) => void;
  onBack?: () => void;
}

type ChartType = 'batang' | 'garis' | 'lingkaran';

export const ChartBuilder: React.FC<ChartBuilderProps> = ({
  currentLevel,
  onSuccess,
  onBack,
}) => {
  const records = currentLevel.records;
  
  // Choose chart type
  const [selectedChartType, setSelectedChartType] = useState<ChartType | null>(null);
  
  // Validation indicator
  const [isValidated, setIsValidated] = useState<boolean>(false);
  const [warning, setWarning] = useState<string | null>(null);

  useEffect(() => {
    setSelectedChartType(null);
    setIsValidated(false);
    setWarning(null);
  }, [currentLevel]);

  const handleVerifyChart = () => {
    if (!selectedChartType) {
      setWarning("👉 Silakan klik salah satu tombol tipe grafik di atas terlebih dahulu!");
      return;
    }
    setIsValidated(true);
    // Grant 20 score bonus
    onSuccess(20);
  };

  // Calculate weekly totals for categories
  const totalPresent = records.reduce((sum, r) => sum + r.present, 0);
  const totalPermit = records.reduce((sum, r) => sum + r.permit, 0);
  const totalSick = records.reduce((sum, r) => sum + r.sick, 0);
  const totalAlpha = records.reduce((sum, r) => sum + r.alpha, 0);
  const grandTotal = totalPresent + totalPermit + totalSick + totalAlpha;

  // Max value among categories for scale
  const maxCategoryTotal = Math.max(totalPresent, totalPermit, totalSick, totalAlpha, 1);
  // Max value in daily records for daily trend line scaling
  const maxDailyValue = records.reduce((max, r) => Math.max(max, r.present, r.permit, r.sick, r.alpha), 1);

  // Percentages for Donut chart
  const pctPresent = grandTotal > 0 ? (totalPresent / grandTotal) * 100 : 0;
  const pctPermit = grandTotal > 0 ? (totalPermit / grandTotal) * 100 : 0;
  const pctSick = grandTotal > 0 ? (totalSick / grandTotal) * 100 : 0;
  const pctAlpha = grandTotal > 0 ? (totalAlpha / grandTotal) * 100 : 0;

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl border-2 sm:border-4 border-black p-2 sm:p-4 md:p-6 shadow-[4px_4px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_rgba(0,0,0,1)]">
      
      {/* Title block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b-2 border-black pb-3 sm:pb-5 mb-3 sm:mb-6 gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-[#A5F3FC] text-black border-2 border-black rounded-lg text-xs font-black font-mono shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)]">TAHAP 3</span>
            <h2 className="text-sm sm:text-base md:text-lg font-black text-slate-900 font-display uppercase tracking-tight">
              Penyajikan Data & Pembuatan Grafik Otomatis
            </h2>
          </div>
          <p className="text-[10px] sm:text-xs text-slate-700 font-bold">
            Data digital yang telah diinput otomatis diubah menjadi grafik! Pilih tipe diagram di sebelah kiri untuk melihat visualisasinya.
          </p>
        </div>

        <div className="bg-[#FBCFE8] p-2 sm:p-2.5 rounded-lg sm:rounded-xl border-2 border-black max-w-sm shadow-[3px_3px_0px_rgba(0,0,0,1)] text-black">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-black mt-0.5 shrink-0" />
            <p className="text-[10px] sm:text-xs text-slate-900 leading-relaxed font-sans font-bold">
              <strong className="font-extrabold text-black">Kiat Abstraksi:</strong> Kita merangkum data angka tabel ke dalam diagram visual agar mudah mendeteksi mana data yang lebih banyak secara instan.
            </p>
          </div>
        </div>
      </div>

      {/* Grid splits into Chart Choices and Custom Graph Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 md:gap-6">
        
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
                <h4 className="font-extrabold text-xs sm:text-sm text-black">Diagram Batang</h4>
                <p className="text-[9px] sm:text-[10px] mt-0.5 leading-relaxed text-slate-800 font-bold">
                  Membandingkan jumlah total kehadiran tiap kategori (H, I, S, A) secara tegak lurus. Sempurna untuk membandingkan mana yang paling dominan.
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
                <h4 className="font-extrabold text-xs sm:text-sm text-black">Diagram Garis</h4>
                <p className="text-[9px] sm:text-[10px] mt-0.5 leading-relaxed text-slate-800 font-bold">
                  Memetakan titik data harian yang dihubungkan garis kontinu. Ideal untuk melacak naik turunnya absensi dari hari ke hari.
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
                <h4 className="font-extrabold text-xs sm:text-sm text-black">Diagram Lingkaran</h4>
                <p className="text-[9px] sm:text-[10px] mt-0.5 leading-relaxed text-slate-800 font-bold">
                  Menampilkan rasio bagian terhadap keseluruhan. Baik untuk membandingkan proporsi persentase antar kategori kehadiran.
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Step 3B: Interactive Build Stage */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-3xl p-4 sm:p-5 border-4 border-black flex flex-col justify-between min-h-[300px] sm:min-h-[360px] md:min-h-[420px] shadow-[6px_6px_0px_rgba(0,0,0,1)]">
            
            {/* Header statement */}
            <div className="flex items-center justify-between mb-3 border-b-2 border-black pb-2.5">
              <span className="text-xs font-black text-slate-900 font-display uppercase tracking-wide">
                🎨 KANVAS GRAFIK: {selectedChartType ? `Tampilan Diagram ${selectedChartType.toUpperCase()}` : 'MENUNGGU PILIHAN'}
              </span>
              <span className="text-[10px] font-mono text-slate-700 font-black">
                Total Data: {grandTotal} Absensi
              </span>
            </div>

            {/* If no chart chosen */}
            {!selectedChartType ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-slate-50 rounded-2xl border-2 border-black shadow-[2px_2px_0px_#000] my-2">
                <div className="w-16 h-16 rounded-full bg-[#CCFBF1] border-2 border-black flex items-center justify-center text-black mb-3 animate-bounce shadow-[3px_3px_0px_#000]">
                  <BarChart2 className="w-8 h-8 font-black" />
                </div>
                <h4 className="font-black text-slate-900 text-sm">Grafik Belum Dipilih</h4>
                <p className="text-xs text-slate-700 font-bold max-w-xs mt-1">
                  Silakan klik salah satu tombol tipe diagram di sebelah kiri untuk melihat visualisasi data kehadiran secara instan!
                </p>
              </div>
            ) : (
              <div className="flex-1 flex flex-col justify-between gap-4">
                
                {/* SVG Visual Canvas */}
                <div className="relative w-full h-36 sm:h-48 md:h-56 bg-white rounded-2xl border-2 border-black p-2 sm:p-4 flex items-end justify-around overflow-hidden shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)]">
                  
                  {/* Backdrop division lines (only for Bar/Line) */}
                  {selectedChartType !== 'lingkaran' && (
                    <div className="absolute inset-x-0 top-0 bottom-8 flex flex-col justify-between pointer-events-none px-2 z-0">
                      {[1, 2, 3, 4].map((v, i) => {
                        const cap = selectedChartType === 'batang' ? maxCategoryTotal : maxDailyValue;
                        const labelVal = Math.round(cap - (i * (cap / 4)));
                        return (
                          <div key={i} className="w-full border-t border-slate-100 flex justify-between items-center text-[9px] font-mono text-slate-400">
                            <span>{labelVal}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Diagram Batang: Weekly totals comparison (Hadir vs Izin vs Sakit vs Alfa) */}
                  {selectedChartType === 'batang' && (
                    <div className="w-full h-full flex items-end justify-around z-10 pt-6 px-4">
                      {[
                        { label: 'Hadir (H)', val: totalPresent, color: 'bg-[#10B981] border-emerald-600', text: 'text-emerald-700' },
                        { label: 'Izin (I)', val: totalPermit, color: 'bg-[#0EA5E9] border-sky-600', text: 'text-sky-700' },
                        { label: 'Sakit (S)', val: totalSick, color: 'bg-[#F59E0B] border-amber-600', text: 'text-amber-700' },
                        { label: 'Alfa (A)', val: totalAlpha, color: 'bg-[#EF4444] border-rose-600', text: 'text-rose-700' },
                      ].map((item, idx) => {
                        const percentHeight = (item.val / maxCategoryTotal) * 100;
                        return (
                          <div key={idx} className="flex flex-col items-center w-16">
                            <span className={`text-[10px] font-mono font-black mb-1 ${item.text}`}>
                              {item.val}
                            </span>
                            <div className="w-8 sm:w-12 bg-slate-50 h-20 sm:h-28 md:h-36 rounded-t-lg flex items-end overflow-hidden border-2 border-black shadow-[1.5px_1.5px_0px_#000]">
                              <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: `${percentHeight}%` }}
                                transition={{ duration: 0.5, ease: 'easeOut' }}
                                className={`w-full border-t ${item.color}`}
                              />
                            </div>
                            <span className="text-[10px] font-black text-slate-900 mt-1.5 whitespace-nowrap">
                              {item.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Diagram Garis: Daily Trend lines for the 4 categories */}
                  {selectedChartType === 'garis' && (
                    <div className="absolute inset-x-4 top-8 bottom-8 flex items-end justify-around z-10 w-[94%] mx-auto">
                      {/* SVG lines */}
                      <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                        {/* Line Hadir (Emerald) */}
                        <motion.polyline
                          fill="none"
                          stroke="#10B981"
                          strokeWidth="3"
                          strokeLinecap="round"
                          points={records.map((r, idx) => {
                            const x = (idx / (records.length - 1)) * 100;
                            const y = 100 - ((r.present / maxDailyValue) * 100);
                            return `${x}%,${y}%`;
                          }).join(' ')}
                        />
                        {/* Line Izin (Sky) */}
                        <motion.polyline
                          fill="none"
                          stroke="#0EA5E9"
                          strokeWidth="3"
                          strokeLinecap="round"
                          points={records.map((r, idx) => {
                            const x = (idx / (records.length - 1)) * 100;
                            const y = 100 - ((r.permit / maxDailyValue) * 100);
                            return `${x}%,${y}%`;
                          }).join(' ')}
                        />
                        {/* Line Sakit (Amber) */}
                        <motion.polyline
                          fill="none"
                          stroke="#F59E0B"
                          strokeWidth="3"
                          strokeLinecap="round"
                          points={records.map((r, idx) => {
                            const x = (idx / (records.length - 1)) * 100;
                            const y = 100 - ((r.sick / maxDailyValue) * 105); // slight offset to prevent overlap
                            return `${x}%,${y}%`;
                          }).join(' ')}
                        />
                        {/* Line Alfa (Red) */}
                        <motion.polyline
                          fill="none"
                          stroke="#EF4444"
                          strokeWidth="3"
                          strokeLinecap="round"
                          points={records.map((r, idx) => {
                            const x = (idx / (records.length - 1)) * 100;
                            const y = 100 - ((r.alpha / maxDailyValue) * 100);
                            return `${x}%,${y}%`;
                          }).join(' ')}
                        />
                      </svg>

                      {/* Display days at the bottom of chart */}
                      {records.map((r, idx) => (
                        <div key={r.day} className="flex flex-col items-center">
                          <div className="h-20 sm:h-24 md:h-28 w-1 flex flex-col justify-between items-center relative">
                            {/* Marker dot for present */}
                            <div 
                              style={{ bottom: `${(r.present / maxDailyValue) * 100}%` }}
                              className="absolute w-2 h-2 rounded-full bg-[#10B981] border border-black shadow"
                            />
                            <div 
                              style={{ bottom: `${(r.permit / maxDailyValue) * 100}%` }}
                              className="absolute w-2 h-2 rounded-full bg-[#0EA5E9] border border-black shadow"
                            />
                            <div 
                              style={{ bottom: `${(r.sick / maxDailyValue) * 100}%` }}
                              className="absolute w-2 h-2 rounded-full bg-[#F59E0B] border border-black shadow"
                            />
                            <div 
                              style={{ bottom: `${(r.alpha / maxDailyValue) * 100}%` }}
                              className="absolute w-2 h-2 rounded-full bg-[#EF4444] border border-black shadow"
                            />
                          </div>
                          <span className="text-[9px] font-bold text-slate-800 mt-2 rotate-12">
                            {r.day.includes('(') ? r.day.split(' ')[0] : r.day}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Diagram Lingkaran (Total Ratios) */}
                  {selectedChartType === 'lingkaran' && (
                    <div className="w-full h-full flex items-center justify-center gap-4 sm:gap-8 z-10">
                      {/* Donut circle representation */}
                      <div className="relative w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 shrink-0">
                        <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                          {/* Segment 1: Hadir (Emerald) */}
                          <circle 
                            cx="18" cy="18" r="15.915" 
                            fill="none" stroke="#10B981" 
                            strokeWidth="4.5"
                            strokeDasharray={`${pctPresent} ${100 - pctPresent}`}
                            strokeDashoffset="0"
                            className="transition-all duration-500"
                          />
                          {/* Segment 2: Izin (Sky) */}
                          <circle 
                            cx="18" cy="18" r="15.915" 
                            fill="none" stroke="#0EA5E9" 
                            strokeWidth="4.5"
                            strokeDasharray={`${pctPermit} ${100 - pctPermit}`}
                            strokeDashoffset={-pctPresent}
                            className="transition-all duration-500"
                          />
                          {/* Segment 3: Sakit (Amber) */}
                          <circle 
                            cx="18" cy="18" r="15.915" 
                            fill="none" stroke="#F59E0B" 
                            strokeWidth="4.5"
                            strokeDasharray={`${pctSick} ${100 - pctSick}`}
                            strokeDashoffset={-(pctPresent + pctPermit)}
                            className="transition-all duration-500"
                          />
                          {/* Segment 4: Alfa (Rose) */}
                          <circle 
                            cx="18" cy="18" r="15.915" 
                            fill="none" stroke="#EF4444" 
                            strokeWidth="4.5"
                            strokeDasharray={`${pctAlpha} ${100 - pctAlpha}`}
                            strokeDashoffset={-(pctPresent + pctPermit + pctSick)}
                            className="transition-all duration-500"
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center font-display">
                          <span className="text-xs sm:text-base md:text-lg font-black text-slate-900 leading-none">
                            {Math.round(pctPresent)}%
                          </span>
                          <span className="text-[7px] sm:text-[8px] md:text-[9px] font-mono font-black text-slate-800 uppercase mt-0.5">HADIR</span>
                        </div>
                      </div>

                      {/* Legend detail list */}
                      <div className="text-left space-y-1 sm:space-y-1.5 bg-slate-50 border border-slate-200 p-2.5 rounded-xl">
                        <h4 className="text-[10px] font-black text-slate-950 uppercase tracking-wide">Rasio Kumulatif</h4>
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] border border-black" />
                          <span className="text-[10px] text-slate-800 font-bold">Hadir: <strong>{totalPresent}</strong> ({Math.round(pctPresent)}%)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#0EA5E9] border border-black" />
                          <span className="text-[10px] text-slate-800 font-bold">Izin: <strong>{totalPermit}</strong> ({Math.round(pctPermit)}%)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] border border-black" />
                          <span className="text-[10px] text-slate-800 font-bold">Sakit: <strong>{totalSick}</strong> ({Math.round(pctSick)}%)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444] border border-black" />
                          <span className="text-[10px] text-slate-800 font-bold">Alfa: <strong>{totalAlpha}</strong> ({Math.round(pctAlpha)}%)</span>
                        </div>
                      </div>
                    </div>
                  )}

                </div>

                {/* Explanation helper box depending on diagram type */}
                <div className="bg-slate-50 border-2 border-black p-3.5 rounded-2xl flex items-start gap-2.5 shadow-[2px_2px_0px_#000]">
                  <Star className="w-5 h-5 text-[#F59E0B] fill-current shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-black text-slate-900 uppercase">
                      {selectedChartType === 'batang' && "Analisis Perbandingan Diagram Batang"}
                      {selectedChartType === 'garis' && "Analisis Tren Diagram Garis"}
                      {selectedChartType === 'lingkaran' && "Analisis Persentase Diagram Lingkaran"}
                    </h4>
                    <p className="text-[11px] text-slate-700 font-semibold leading-relaxed mt-0.5">
                      {selectedChartType === 'batang' && `Sangat jelas! Di sini terlihat bahwa selama seminggu jumlah Hadir mencapai ${totalPresent} siswa. Kategori ketidakhadiran terbanyak adalah ${
                        Math.max(totalPermit, totalSick, totalAlpha) === totalPermit ? `Izin (${totalPermit} siswa)` :
                        Math.max(totalPermit, totalSick, totalAlpha) === totalSick ? `Sakit (${totalSick} siswa)` :
                        `Alfa (${totalAlpha} siswa)`
                      }.`}
                      {selectedChartType === 'garis' && `Grafik ini sangat baik memetakan fluktuasi harian. Kamu bisa melihat tren naik/turun kehadiran yang diwakili oleh garis hijau.`}
                      {selectedChartType === 'lingkaran' && `Menunjukkan bahwa persentase kehadiran siswa di kelas adalah ${Math.round(pctPresent)}%, sedangkan total ketidakhadiran adalah ${Math.round(100 - pctPresent)}%.`}
                    </p>
                  </div>
                </div>

              </div>
            )}

            {/* Validation row */}
            <div className="mt-2 pt-3 border-t-2 border-black flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                {warning && (
                  <p className="text-xs font-black text-black bg-[#FDE047] border-2 border-black px-3 py-1.5 rounded-xl shadow-[2px_2px_0px_#000]">
                    {warning}
                  </p>
                )}
                {!warning && !isValidated && (
                  <p className="text-xs text-slate-700 font-bold">
                    Pilih format grafik di sebelah kiri, lalu verifikasi untuk lanjut.
                  </p>
                )}
                {isValidated && (
                  <p className="text-xs font-black text-emerald-955 bg-[#CCFBF1] border-2 border-black px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-[2.5px_2.5px_0px_#000]">
                    <Check className="w-4 h-4 text-emerald-900" /> Grafik Sukses Disajikan Sempurna (+20 pts)
                  </p>
                )}
              </div>

              {!isValidated && (
                <div className="flex gap-2">
                  {onBack && (
                    <button
                      type="button"
                      onClick={onBack}
                      className="bg-slate-100 hover:bg-slate-200 text-black font-black border-2 border-black text-xs py-2.5 px-4 rounded-xl flex items-center justify-center cursor-pointer shadow-[2.5px_2.5px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1.5px_1.5px_0px_#000]"
                      id="btn-back-stage"
                    >
                      Kembali
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleVerifyChart}
                    className="bg-rose-500 text-white font-black hover:bg-rose-600 border-2 border-black text-xs py-2.5 px-5 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-[3px_3px_0px_#000]"
                    id="btn-verify-chart"
                  >
                    <Check className="w-4 h-4 text-white" />
                    Sajikan Grafik & Lanjutkan
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
