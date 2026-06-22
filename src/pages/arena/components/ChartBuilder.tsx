import React, { useState, useEffect, useRef } from 'react';
import { GameLevel } from '@/src/types';
import { motion, AnimatePresence } from 'motion/react';
import { TrendingUp, CircleDot, Check, BarChart2, AlertCircle } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

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

  // Manual chart container measurement via callback ref
  const [chartWidth, setChartWidth] = useState(0);
  const [chartHeight, setChartHeight] = useState(0);
  const observerRef = useRef<ResizeObserver | null>(null);

  const chartRefCallback = React.useCallback((node: HTMLDivElement | null) => {
    // Cleanup previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }
    if (!node) return;

    // Immediate measurement (clientWidth and clientHeight minus padding)
    const style = getComputedStyle(node);
    const padL = parseFloat(style.paddingLeft) || 0;
    const padR = parseFloat(style.paddingRight) || 0;
    const padT = parseFloat(style.paddingTop) || 0;
    const padB = parseFloat(style.paddingBottom) || 0;
    const w = Math.floor(node.clientWidth - padL - padR);
    const h = Math.floor(node.clientHeight - padT - padB);
    if (w > 0) setChartWidth(w);
    if (h > 0) setChartHeight(h);

    // Live resize tracking
    const observer = new ResizeObserver(entries => {
      const cw = Math.floor(entries[0].contentRect.width);
      const ch = Math.floor(entries[0].contentRect.height);
      if (cw > 0) setChartWidth(cw);
      if (ch > 0) setChartHeight(ch);
    });
    observer.observe(node);
    observerRef.current = observer;
  }, []);

  useEffect(() => {
    setSelectedChartType(null);
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

  // Calculate weekly totals for categories
  const totalPresent = records.reduce((sum, r) => sum + r.present, 0);
  const totalPermit = records.reduce((sum, r) => sum + (r.permit || 0), 0);
  const totalSick = records.reduce((sum, r) => sum + (r.sick || 0), 0);
  const totalAlpha = records.reduce((sum, r) => sum + (r.alpha || 0), 0);
  const grandTotal = totalPresent + totalPermit + totalSick + totalAlpha;

  // Max value among categories for scale
  const maxCategoryTotal = Math.max(totalPresent, totalPermit, totalSick, totalAlpha, 1);

  // Percentages for Donut chart
  const pctPresent = grandTotal > 0 ? (totalPresent / grandTotal) * 100 : 0;
  const pctPermit = grandTotal > 0 ? (totalPermit / grandTotal) * 100 : 0;
  const pctSick = grandTotal > 0 ? (totalSick / grandTotal) * 100 : 0;
  const pctAlpha = grandTotal > 0 ? (totalAlpha / grandTotal) * 100 : 0;

  // Recharts data for Line Chart
  const lineChartData = records.map(r => ({
    name: r.day.includes('(') ? r.day.split(' ')[0] : r.day,
    Hadir: r.present,
    Izin: r.permit || 0,
    Sakit: r.sick || 0,
    Alfa: r.alpha || 0,
  }));

  // Recharts data for Pie/Donut Chart
  const pieChartData = [
    { name: 'Hadir', value: totalPresent, fill: '#10B981' },
    { name: 'Izin', value: totalPermit, fill: '#0EA5E9' },
    { name: 'Sakit', value: totalSick, fill: '#F59E0B' },
    { name: 'Alfa', value: totalAlpha, fill: '#EF4444' },
  ];

  const PIE_COLORS = ['#10B981', '#0EA5E9', '#F59E0B', '#EF4444'];

  return (
    <div className="w-full h-full flex flex-row gap-2 sm:gap-4 lg:gap-6 min-h-0 mobile-landscape-compact-gap relative">
      
      {/* Left Column: Format Selection */}
      <div className="flex-[3] sm:flex-[4] min-w-0 min-h-0 flex flex-col h-full bg-white border-2 sm:border-4 border-black rounded-2xl sm:rounded-3xl p-2 sm:p-5 shadow-[4px_4px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_rgba(0,0,0,1)] mobile-landscape-compact-card">
        <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3 shrink-0">
          <h3 className="text-[10px] sm:text-sm font-black text-slate-900 uppercase">
            Penyajian Data
          </h3>
        </div>
        
        <p className="hidden sm:block text-[10px] sm:text-xs text-slate-700 font-bold mb-4 shrink-0">
          Pilih tipe diagram di bawah ini untuk memvisualisasikan data kehadiran secara instan:
        </p>

        <div className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-2 sm:space-y-3">
          {/* Bar Chart Choice */}
          <button
            type="button"
            onClick={() => { setSelectedChartType('batang'); setWarning(null); }}
            className={`w-full p-2 sm:p-3.5 rounded-xl border-2 border-black text-left flex items-center sm:items-start gap-2 sm:gap-3 transition-all cursor-pointer shadow-[2.5px_2.5px_0px_#000] active:translate-y-0.5 active:shadow-[1px_1px_0px_#000] ${
              selectedChartType === 'batang'
                ? 'bg-[#A5F3FC] text-black scale-[1.01]'
                : 'bg-white text-slate-800 hover:bg-slate-50'
            }`}
            id="btn-chart-batang"
          >
            <div className={`p-1.5 rounded-lg border border-black shrink-0 ${selectedChartType === 'batang' ? 'bg-[#CCFBF1] text-black' : 'bg-purple-100 text-purple-700'}`}>
              <BarChart2 className="w-4 h-4 font-bold" />
            </div>
            <div>
              <h4 className="font-extrabold text-[10px] sm:text-xs text-black">Batang</h4>
              <p className="hidden sm:block text-[9px] sm:text-[10px] mt-0.5 leading-normal text-slate-800 font-bold">
                Bandingkan total Hadir, Izin, Sakit, dan Alfa secara visual.
              </p>
            </div>
          </button>

          {/* Line Chart Choice */}
          <button
            type="button"
            onClick={() => { setSelectedChartType('garis'); setWarning(null); }}
            className={`w-full p-2 sm:p-3.5 rounded-xl border-2 border-black text-left flex items-center sm:items-start gap-2 sm:gap-3 transition-all cursor-pointer shadow-[2.5px_2.5px_0px_#000] active:translate-y-0.5 active:shadow-[1px_1px_0px_#000] ${
              selectedChartType === 'garis'
                ? 'bg-[#A5F3FC] text-black scale-[1.01]'
                : 'bg-white text-slate-800 hover:bg-slate-50'
            }`}
            id="btn-chart-garis"
          >
            <div className={`p-1.5 rounded-lg border border-black shrink-0 ${selectedChartType === 'garis' ? 'bg-[#CCFBF1] text-black' : 'bg-purple-100 text-purple-700'}`}>
              <TrendingUp className="w-4 h-4 font-bold" />
            </div>
            <div>
              <h4 className="font-extrabold text-[10px] sm:text-xs text-black">Garis</h4>
              <p className="hidden sm:block text-[9px] sm:text-[10px] mt-0.5 leading-normal text-slate-800 font-bold">
                Pantau tren fluktuasi kehadiran harian siswa sepanjang minggu.
              </p>
            </div>
          </button>

          {/* Donut Chart Choice */}
          <button
            type="button"
            onClick={() => { setSelectedChartType('lingkaran'); setWarning(null); }}
            className={`w-full p-2 sm:p-3.5 rounded-xl border-2 border-black text-left flex items-center sm:items-start gap-2 sm:gap-3 transition-all cursor-pointer shadow-[2.5px_2.5px_0px_#000] active:translate-y-0.5 active:shadow-[1px_1px_0px_#000] ${
              selectedChartType === 'lingkaran'
                ? 'bg-[#A5F3FC] text-black scale-[1.01]'
                : 'bg-white text-slate-800 hover:bg-slate-50'
            }`}
            id="btn-chart-lingkaran"
          >
            <div className={`p-1.5 rounded-lg border border-black shrink-0 ${selectedChartType === 'lingkaran' ? 'bg-[#CCFBF1] text-black' : 'bg-purple-100 text-purple-700'}`}>
              <CircleDot className="w-4 h-4 font-bold" />
            </div>
            <div>
              <h4 className="font-extrabold text-[10px] sm:text-xs text-black">Lingkaran</h4>
              <p className="hidden sm:block text-[9px] sm:text-[10px] mt-0.5 leading-normal text-slate-800 font-bold">
                Visualisasikan perbandingan persentase rasio kehadiran kelas.
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Right Column: Chart Canvas & Actions */}
      <div className="flex-[9] sm:flex-[8] min-w-0 min-h-0 flex flex-col justify-between h-full bg-white border-2 sm:border-4 border-black rounded-2xl sm:rounded-3xl p-2 sm:p-5 shadow-[4px_4px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_rgba(0,0,0,1)] mobile-landscape-compact-card">
        
        {/* Header statement */}
        <div className="flex items-center justify-between mb-3 border-b-2 border-black pb-2.5 shrink-0">
          <span className="text-xs font-black text-slate-900 font-display uppercase tracking-wide">
            Visualisasi Grafik: {selectedChartType ? `Diagram ${selectedChartType}` : 'Pilih Format'}
          </span>
          <span className="text-[10px] font-mono text-slate-700 font-black">
            Total: {grandTotal} Absensi
          </span>
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
            
            {/* SVG Visual Canvas */}
            <div ref={chartRefCallback} className="relative w-full flex-1 min-h-0 bg-white rounded-2xl border-2 border-black p-2 sm:p-3 shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] flex flex-col justify-center">
              
              {/* Backdrop division lines (only for Bar Chart) */}
              {selectedChartType === 'batang' && (
                <div className="absolute inset-x-0 top-0 bottom-8 flex flex-col justify-between pointer-events-none px-2 z-0">
                  {[1, 2, 3, 4].map((v, i) => {
                    const cap = maxCategoryTotal;
                    const labelVal = Math.round(cap - (i * (cap / 4)));
                    return (
                      <div key={i} className="w-full border-t border-slate-100 flex justify-between items-center text-[9px] font-mono text-slate-400">
                        <span>{labelVal}</span>
                      </div>
                    );
                  })}
                </div>
              )}
 
              {/* Diagram Batang: Weekly totals comparison */}
              {selectedChartType === 'batang' && (
                <div className="w-full flex items-end justify-around z-10 pt-4 px-1 sm:px-4" style={{ height: chartHeight > 0 ? `${chartHeight}px` : 'auto' }}>
                  {[
                    { label: 'Hadir', val: totalPresent, color: 'bg-[#10B981] border-emerald-600', text: 'text-emerald-700' },
                    { label: 'Izin', val: totalPermit, color: 'bg-[#0EA5E9] border-sky-600', text: 'text-sky-700' },
                    { label: 'Sakit', val: totalSick, color: 'bg-[#F59E0B] border-amber-600', text: 'text-amber-700' },
                    { label: 'Alfa', val: totalAlpha, color: 'bg-[#EF4444] border-rose-600', text: 'text-rose-700' },
                  ].map((item, idx) => {
                    const percentHeight = (item.val / maxCategoryTotal) * 100;
                    return (
                      <div key={idx} className="flex flex-col items-center w-10 sm:w-16">
                        <span className={`text-[8px] sm:text-[10px] font-mono font-black mb-1 ${item.text}`}>
                          {item.val}
                        </span>
                        <div 
                          className="w-5 sm:w-10 bg-slate-50 rounded-t-md flex items-end overflow-hidden border-2 border-black shadow-[1px_1px_0px_#000] relative"
                          style={{ height: chartHeight > 0 ? `${chartHeight - 40}px` : '120px' }}
                        >
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${percentHeight}%` }}
                            transition={{ duration: 0.5, ease: 'easeOut' }}
                            className={`w-full border-t ${item.color} absolute bottom-0 left-0`}
                          />
                        </div>
                        <span className="text-[8px] sm:text-[10px] font-black text-slate-900 mt-1.5 whitespace-nowrap">
                          {item.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
 
              {/* Diagram Garis: Daily Trend lines (Recharts - manual sizing) */}
              {selectedChartType === 'garis' && chartWidth > 0 && (
                <>
                  <LineChart width={chartWidth} height={chartHeight > 0 ? chartHeight - 25 : (isMobileLandscape ? 110 : 250)} data={lineChartData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="4 4" stroke="#E2E8F0" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 10, fontWeight: 900, fill: '#1E293B' }}
                      axisLine={{ stroke: '#000', strokeWidth: 2 }}
                      tickLine={{ stroke: '#000' }}
                    />
                    <YAxis
                      tick={{ fontSize: 10, fontWeight: 700, fill: '#94A3B8' }}
                      axisLine={{ stroke: '#000', strokeWidth: 2 }}
                      tickLine={{ stroke: '#000' }}
                      allowDecimals={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '2px solid #000',
                        borderRadius: '12px',
                        fontWeight: 800,
                        fontSize: '11px',
                        boxShadow: '3px 3px 0px #000',
                      }}
                    />
                    <Line type="monotone" dataKey="Hadir" stroke="#10B981" strokeWidth={3} dot={{ r: 3, fill: '#10B981', stroke: '#000', strokeWidth: 1.5 }} activeDot={{ r: 5 }} />
                    <Line type="monotone" dataKey="Izin" stroke="#0EA5E9" strokeWidth={3} dot={{ r: 3, fill: '#0EA5E9', stroke: '#000', strokeWidth: 1.5 }} activeDot={{ r: 5 }} />
                    <Line type="monotone" dataKey="Sakit" stroke="#F59E0B" strokeWidth={3} dot={{ r: 3, fill: '#F59E0B', stroke: '#000', strokeWidth: 1.5 }} activeDot={{ r: 5 }} />
                    <Line type="monotone" dataKey="Alfa" stroke="#EF4444" strokeWidth={3} dot={{ r: 3, fill: '#EF4444', stroke: '#000', strokeWidth: 1.5 }} activeDot={{ r: 5 }} />
                  </LineChart>
                  <div className="bg-white border border-black px-1.5 py-0.5 rounded-md flex flex-wrap justify-center gap-x-2 gap-y-0.5 shadow-[1px_1px_0px_#000] text-[8px] sm:text-[9px] font-black mt-1 mx-auto w-fit">
                    <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#10B981] border border-black" /><span>Hadir</span></div>
                    <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#0EA5E9] border border-black" /><span>Izin</span></div>
                    <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] border border-black" /><span>Sakit</span></div>
                    <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#EF4444] border border-black" /><span>Alfa</span></div>
                  </div>
                </>
              )}
 
              {/* Diagram Lingkaran: Donut Chart (Recharts - manual sizing) */}
              {selectedChartType === 'lingkaran' && chartWidth > 0 && (() => {
                const maxPieSize = isMobileLandscape ? 110 : Math.max(80, Math.min(chartWidth, chartHeight - 110, 220));
                const pieSize = chartHeight > 0 ? maxPieSize : (isMobileLandscape ? 110 : 180);
                return (
                  <div className={`w-full flex ${isMobileLandscape ? 'flex-row items-center justify-center gap-4' : 'flex-col items-center gap-2'}`}>
                    <PieChart width={pieSize} height={pieSize}>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={pieSize * 0.25}
                        outerRadius={pieSize * 0.42}
                        paddingAngle={2}
                        dataKey="value"
                        stroke="#000"
                        strokeWidth={2}
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={PIE_COLORS[index]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#fff',
                          border: '2px solid #000',
                          borderRadius: '12px',
                          fontWeight: 800,
                          fontSize: '11px',
                          boxShadow: '3px 3px 0px #000',
                        }}
                        formatter={(value: any, name: any) => [`${value} siswa (${grandTotal > 0 ? Math.round((Number(value) / grandTotal) * 100) : 0}%)`, name]}
                      />
                    </PieChart>
                    <div className="text-left space-y-0.5 bg-slate-50 border border-slate-200 p-1.5 sm:p-2 rounded-xl">
                      <h4 className="text-[8px] sm:text-[9px] font-black text-slate-900 uppercase tracking-wide border-b border-slate-200 pb-0.5 mb-1">Rasio Kumulatif</h4>
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] border border-black" />
                        <span className="text-[8px] sm:text-[9px] text-slate-800 font-bold">Hadir: <strong>{totalPresent}</strong> ({Math.round(pctPresent)}%)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0EA5E9] border border-black" />
                        <span className="text-[8px] sm:text-[9px] text-slate-800 font-bold">Izin: <strong>{totalPermit}</strong> ({Math.round(pctPermit)}%)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] border border-black" />
                        <span className="text-[8px] sm:text-[9px] text-slate-800 font-bold">Sakit: <strong>{totalSick}</strong> ({Math.round(pctSick)}%)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444] border border-black" />
                        <span className="text-[8px] sm:text-[9px] text-slate-800 font-bold">Alfa: <strong>{totalAlpha}</strong> ({Math.round(pctAlpha)}%)</span>
                      </div>
                    </div>
                  </div>
                );
              })()}

            </div>


          </div>
        )}

        {/* Validation row */}
        <div className="mt-2 pt-3 border-t-2 border-black flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div>
            {!isValidated && (
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
  );
};
