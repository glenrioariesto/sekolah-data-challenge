import React, { useState, useEffect } from 'react';
import { GameLevel } from '@/src/types';
import { motion, AnimatePresence } from 'motion/react';
import { TrendingUp, CircleDot, Check, BarChart2, AlertCircle } from 'lucide-react';
import { ChartVisualizer } from './ChartVisualizer';

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
  
  // Choose chart type & optional day filter ('semua' | 'Senin' | 'Selasa' | ...)
  const [selectedChartType, setSelectedChartType] = useState<ChartType | null>(null);
  const [selectedDay, setSelectedDay] = useState<string>('semua');
  
  // Validation indicator
  const [isValidated, setIsValidated] = useState<boolean>(false);
  const [warning, setWarning] = useState<string | null>(null);

  // Mobile landscape detection state
  const [isMobileLandscape, setIsMobileLandscape] = useState<boolean>(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-height: 560px) and (orientation: landscape)');
    setIsMobileLandscape(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => {
      setIsMobileLandscape(e.matches);
    };
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    setSelectedChartType(null);
    setSelectedDay('semua');
    setIsValidated(false);
    setWarning(null);
  }, [currentLevel]);

  // Auto-dismiss warning toast after 4 seconds
  useEffect(() => {
    if (warning) {
      const timer = setTimeout(() => {
        setWarning(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [warning]);

  const handleVerifyChart = () => {
    if (!selectedChartType) {
      setWarning("👉 Silakan klik salah satu tombol tipe grafik di atas terlebih dahulu!");
      return;
    }
    setIsValidated(true);
    // Grant 20 score bonus
    onSuccess(20);
  };

  // Calculate totals for categories based on day filter
  const targetRecords = selectedDay === 'semua' ? records : records.filter(r => r.day === selectedDay);
  const totalPresent = targetRecords.reduce((sum, r) => sum + r.present, 0);
  const totalPermit = targetRecords.reduce((sum, r) => sum + (r.permit || 0), 0);
  const totalSick = targetRecords.reduce((sum, r) => sum + (r.sick || 0), 0);
  const totalAlpha = targetRecords.reduce((sum, r) => sum + (r.alpha || 0), 0);
  const grandTotal = totalPresent + totalPermit + totalSick + totalAlpha;

  return (
    <div className="w-full max-w-7xl mx-auto px-1 py-1 sm:px-4 sm:py-4 flex flex-col min-h-0 h-full overflow-y-auto sm:overflow-hidden game-wrapper-padding">
      <div className="w-full min-h-screen sm:min-h-0 sm:h-full flex flex-col sm:flex-row gap-2 sm:gap-4 lg:gap-6 min-h-0 mobile-landscape-compact-gap relative">
      
      {/* Left Column: Format Selection */}
      <div className="flex-[3] sm:flex-[4] min-w-0 flex flex-col h-fit sm:h-full bg-white border-2 sm:border-4 border-black rounded-2xl sm:rounded-3xl p-2 sm:p-5 shadow-[4px_4px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_rgba(0,0,0,1)] mobile-landscape-compact-card">
        <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3 shrink-0">
          <h3 className="text-[10px] sm:text-sm font-black text-slate-900 uppercase font-display">
            Penyajian Data
          </h3>
        </div>
        
        <p className="hidden sm:block text-xs sm:text-sm text-slate-700 font-bold mb-3 shrink-0">
          Pilih tipe diagram di bawah ini untuk memvisualisasikan data kehadiran secara instan:
        </p>

        <div className="flex flex-col space-y-2 sm:space-y-3">
          {/* Bar Chart Choice */}
          <button
            type="button"
            onClick={() => { setSelectedChartType('batang'); setWarning(null); }}
            className={`w-full p-2 sm:p-3 rounded-xl border-2 border-black text-left flex items-center gap-2 sm:gap-3 transition-all cursor-pointer shadow-[2.5px_2.5px_0px_#000] active:translate-y-0.5 active:shadow-[1px_1px_0px_#000] ${
              selectedChartType === 'batang'
                ? 'bg-[#A5F3FC] text-black scale-[1.01]'
                : 'bg-white text-slate-800 hover:bg-slate-50'
            }`}
            id="btn-chart-batang"
          >
            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg border border-black shrink-0 aspect-square flex items-center justify-center ${selectedChartType === 'batang' ? 'bg-[#CCFBF1] text-black' : 'bg-purple-100 text-purple-700'}`}>
              <BarChart2 className="w-4 h-4 sm:w-5 sm:h-5 font-bold" />
            </div>
            <div className="flex-1">
              <h4 className="font-extrabold text-[10px] sm:text-xs text-black font-display uppercase">Batang</h4>
              <p className="hidden sm:block text-[9px] sm:text-[10px] mt-0.5 leading-normal text-slate-800 font-bold">
                Bandingkan total Hadir, Izin, Sakit, dan Alfa (Semua Hari / Per Hari).
              </p>
            </div>
          </button>

          {/* Line Chart Choice */}
          <button
            type="button"
            onClick={() => { setSelectedChartType('garis'); setWarning(null); }}
            className={`w-full p-2 sm:p-3 rounded-xl border-2 border-black text-left flex items-center gap-2 sm:gap-3 transition-all cursor-pointer shadow-[2.5px_2.5px_0px_#000] active:translate-y-0.5 active:shadow-[1px_1px_0px_#000] ${
              selectedChartType === 'garis'
                ? 'bg-[#A5F3FC] text-black scale-[1.01]'
                : 'bg-white text-slate-800 hover:bg-slate-50'
            }`}
            id="btn-chart-garis"
          >
            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg border border-black shrink-0 aspect-square flex items-center justify-center ${selectedChartType === 'garis' ? 'bg-[#CCFBF1] text-black' : 'bg-purple-100 text-purple-700'}`}>
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 font-bold" />
            </div>
            <div className="flex-1">
              <h4 className="font-extrabold text-[10px] sm:text-xs text-black font-display uppercase">Garis</h4>
              <p className="hidden sm:block text-[9px] sm:text-[10px] mt-0.5 leading-normal text-slate-800 font-bold">
                Pantau tren fluktuasi kehadiran harian siswa sepanjang minggu.
              </p>
            </div>
          </button>

          {/* Donut Chart Choice */}
          <button
            type="button"
            onClick={() => { setSelectedChartType('lingkaran'); setWarning(null); }}
            className={`w-full p-2 sm:p-3 rounded-xl border-2 border-black text-left flex items-center gap-2 sm:gap-3 transition-all cursor-pointer shadow-[2.5px_2.5px_0px_#000] active:translate-y-0.5 active:shadow-[1px_1px_0px_#000] ${
              selectedChartType === 'lingkaran'
                ? 'bg-[#A5F3FC] text-black scale-[1.01]'
                : 'bg-white text-slate-800 hover:bg-slate-50'
            }`}
            id="btn-chart-lingkaran"
          >
            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg border border-black shrink-0 aspect-square flex items-center justify-center ${selectedChartType === 'lingkaran' ? 'bg-[#CCFBF1] text-black' : 'bg-purple-100 text-purple-700'}`}>
              <CircleDot className="w-4 h-4 sm:w-5 sm:h-5 font-bold" />
            </div>
            <div className="flex-1">
              <h4 className="font-extrabold text-[10px] sm:text-xs text-black font-display uppercase">Lingkaran</h4>
              <p className="hidden sm:block text-[9px] sm:text-[10px] mt-0.5 leading-normal text-slate-800 font-bold">
                Visualisasikan perbandingan persentase rasio kehadiran (Semua Hari / Per Hari).
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Right Column: Chart Canvas & Actions */}
      <div className="flex-[9] sm:flex-[8] min-w-0 flex flex-col justify-between h-fit sm:h-full bg-white border-2 sm:border-4 border-black rounded-2xl sm:rounded-3xl p-2 sm:p-5 shadow-[4px_4px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_rgba(0,0,0,1)] mobile-landscape-compact-card">
        
        {/* Header statement with Day Filter Tabs */}
        <div className="flex items-center justify-between gap-2 mb-3 border-b-2 border-black pb-2.5 shrink-0 min-w-0">
          <span className="text-xs font-black text-slate-900 font-display uppercase tracking-wide shrink-0">
            Visualisasi: {selectedChartType ? `Diagram ${selectedChartType}` : 'Pilih Format'}
          </span>

          {/* Filter Per Hari (for Batang & Lingkaran) */}
          {(selectedChartType === 'batang' || selectedChartType === 'lingkaran') && (
            <div className="flex items-center gap-1 overflow-x-auto p-0.5 scrollbar-none whitespace-nowrap shrink min-w-0">
              <span className="text-[9px] font-display font-black text-slate-600 mr-1 uppercase shrink-0">Filter:</span>
              <button
                type="button"
                onClick={() => setSelectedDay('semua')}
                className={`px-2 py-0.5 text-[9px] font-display font-black rounded-md border border-black uppercase transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  selectedDay === 'semua' ? 'bg-[#FDE047] text-black shadow-[1px_1px_0px_#000]' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Semua Hari
              </button>
              {records.map(r => (
                <button
                  key={r.day}
                  type="button"
                  onClick={() => setSelectedDay(r.day)}
                  className={`px-2 py-0.5 text-[9px] font-display font-black rounded-md border border-black uppercase transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    selectedDay === r.day ? 'bg-[#FDE047] text-black shadow-[1px_1px_0px_#000]' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {r.day}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* If no chart chosen */}
        {!selectedChartType ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-slate-50 rounded-2xl border-2 border-black shadow-[2px_2px_0px_#000] my-2">
            <div className="w-16 h-16 rounded-full bg-[#CCFBF1] border-2 border-black flex items-center justify-center text-black mb-3 animate-bounce shadow-[3px_3px_0px_#000]">
              <BarChart2 className="w-8 h-8 font-black" />
            </div>
            <h4 className="font-black text-slate-900 text-sm">Grafik Belum Dipilih</h4>
            <p className="text-xs text-slate-700 font-bold max-w-xs mt-1 leading-relaxed">
              Silakan klik salah satu tipe diagram di sebelah kiri untuk melihat visualisasi data kehadiran secara instan!
            </p>
          </div>
        ) : (
          <div className="flex-1 flex flex-col gap-2 sm:gap-4 min-h-0 overflow-y-auto">
            <ChartVisualizer
              selectedChartType={selectedChartType}
              records={records}
              selectedDay={selectedDay}
              isMobileLandscape={isMobileLandscape}
            />
          </div>
        )}

        {/* Validation row */}
        <div className="mt-2 pt-3 border-t-2 border-black flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div>
            {!isValidated && (
              <p className="text-sm text-slate-700 font-bold">
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
              <button
                type="button"
                onClick={handleVerifyChart}
                className="bg-rose-500 text-white font-black hover:bg-rose-600 border-2 border-black text-xs py-2.5 px-5 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-[3px_3px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1.5px_1.5px_0px_#000]"
                id="btn-verify-chart"
              >
                <Check className="w-4 h-4 text-white" />
                Lanjut
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Floating Toast Notification */}
      <AnimatePresence>
        {warning && (
          <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[1000] w-full max-w-sm px-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: -40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -40, scale: 0.95 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="bg-[#FDE047] border-4 border-black p-3.5 rounded-2xl shadow-[4px_4px_0px_#000] flex items-center gap-3 text-black font-black text-xs pointer-events-auto"
            >
              <AlertCircle className="w-5 h-5 shrink-0 text-black animate-bounce" />
              <span className="flex-1 font-extrabold leading-normal">{warning}</span>
              <button
                type="button"
                onClick={() => setWarning(null)}
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
