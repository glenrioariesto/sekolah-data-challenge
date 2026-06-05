import React from 'react';
import { School, Award, Brain, Target, Flame } from 'lucide-react';
import { motion } from 'motion/react';
import { GameLevel } from '../types';

interface HeaderProps {
  currentLevel: GameLevel;
  totalScore: number;
  stage: string;
  unlockedBadges: string[];
}

export const Header: React.FC<HeaderProps> = ({
  currentLevel,
  totalScore,
  stage,
  unlockedBadges,
}) => {
  const getStageLabel = (s: string) => {
    switch (s) {
      case 'intro': return 'Pendaftaran Misi';
      case 'roster': return 'Tahap 1: Pengumpulan Data';
      case 'input': return 'Tahap 2: Input & Verifikasi';
      case 'chart': return 'Tahap 3: Abstraksi Grafik';
      case 'analysis': return 'Tahap 4: Analisis Kritis';
      case 'decision': return 'Tahap 5: Kebijakan Strategis';
      default: return 'Misi Selesai';
    }
  };

  const getStagePercentage = (s: string) => {
    switch (s) {
      case 'intro': return 10;
      case 'roster': return 30;
      case 'input': return 50;
      case 'chart': return 70;
      case 'analysis': return 85;
      case 'decision': return 95;
      case 'complete': return 100;
      default: return 0;
    }
  };

  return (
    <header className="bg-white border-4 border-black rounded-[24px] shadow-[8px_8px_0px_rgba(0,0,0,1)] sticky top-4 z-50 px-4 py-3 md:px-6 md:py-4 mb-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        
        {/* School Branding */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#A5F3FC] text-black rounded-xl border-2 border-black shadow-[2px_2px_0px_#000]">
            <School className="w-6 h-6 text-black" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[9px] font-bold bg-[#FDE047] text-black px-2 py-0.5 rounded-full border border-black uppercase tracking-wider">
                Simulasi Administrasi Kehadiran
              </span>
              <span className="text-[10px] text-slate-700 font-mono font-bold">ID: de67d6</span>
            </div>
            <h1 className="text-xl font-black text-slate-900 font-display leading-tight uppercase tracking-tight">
              ADMIN KEHADIRAN SEKOLAH
            </h1>
          </div>
        </div>

        {/* Level Status & Stages */}
        <div className="hidden lg:flex items-center gap-6">
          <div className="text-right">
            <p className="text-[11px] font-mono text-slate-500 font-bold uppercase tracking-wider">
              Misi Aktif
            </p>
            <p className="text-sm font-black text-rose-600">
              {currentLevel.title}
            </p>
          </div>
          <div className="w-32 bg-white h-4 rounded-full border-2 border-black overflow-hidden p-0.5">
            <div 
              className="bg-[#10B981] h-full rounded-full border border-black transition-all duration-500 ease-out"
              style={{ width: `${(currentLevel.id / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Dynamic Metric Badges */}
        <div className="flex items-center flex-wrap gap-2 md:gap-4 ml-auto md:ml-0">
          
          {/* Step Indicator */}
          {stage !== 'intro' && stage !== 'complete' && (
            <div className="flex flex-col items-end mr-2 md:mr-4">
              <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Tahapan Kerja</span>
              <span className="text-xs font-extrabold text-black bg-[#FBCFE8] px-2 py-0.5 border border-black rounded">{getStageLabel(stage)}</span>
            </div>
          )}

          {/* Computational Thinking Indicator */}
          <div className="bg-[#FDE047] border-2 border-black px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-[2px_2px_0px_#000]">
            <Brain className="w-4 h-4 text-black animate-pulse" />
            <div className="text-left">
              <p className="text-[9px] font-mono leading-none text-black uppercase font-bold">Kemajuan BK</p>
              <p className="text-xs font-bold text-black font-mono">
                {getStagePercentage(stage)}%
              </p>
            </div>
          </div>

          {/* Score Counter */}
          <motion.div 
            key={totalScore}
            initial={{ scale: 0.8, y: -5 }}
            animate={{ scale: 1, y: 0 }}
            className="bg-[#CCFBF1] border-2 border-black px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-[2px_2px_0px_#000]"
          >
            <Flame className="w-5 h-5 text-emerald-700" />
            <div className="text-left">
              <p className="text-[9px] font-mono leading-none text-black uppercase font-bold">Skor Kamu</p>
              <p className="text-sm font-extrabold text-slate-950 font-mono">
                {totalScore} <span className="text-[10px] font-bold text-[#F43F5E]">poin</span>
              </p>
            </div>
          </motion.div>

          {/* Badges Indicator */}
          <div className="bg-[#A5F3FC] border-2 border-black px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-[2px_2px_0px_#000]">
            <Award className="w-4 h-4 text-black" />
            <div className="text-left">
              <p className="text-[9px] font-mono leading-none text-black uppercase font-bold">Lencana</p>
              <p className="text-xs font-bold text-slate-950 font-mono">
                {unlockedBadges.length}/4
              </p>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};
