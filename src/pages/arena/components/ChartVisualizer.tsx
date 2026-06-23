import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { GameLevel } from '@/src/types';
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

interface ChartVisualizerProps {
  selectedChartType: 'batang' | 'garis' | 'lingkaran';
  records: GameLevel['records'];
  isMobileLandscape: boolean;
}

export const ChartVisualizer: React.FC<ChartVisualizerProps> = ({
  selectedChartType,
  records,
  isMobileLandscape,
}) => {
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
  );
};
