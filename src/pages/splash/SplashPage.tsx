import React from 'react';
import { motion } from 'motion/react';
import { Play, School } from 'lucide-react';
import { playSynthesizerNote } from '@/src/utils/audio';

interface SplashPageProps {
  onStartGame: () => void;
}

export const SplashPage: React.FC<SplashPageProps> = ({ onStartGame }) => {
  return (
    <motion.div
      key="start-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative w-screen h-screen flex flex-col items-center justify-center p-1 md:p-6 text-center select-none overflow-hidden"
    >
      {/* Logo Pojok Kiri Atas - Responsive sizing */}
      <div className="absolute top-2 left-2 md:top-6 md:left-6 flex items-center gap-1 bg-white border-2 md:border-4 border-black px-2 py-0.5 md:px-4 md:py-2 rounded-xl md:rounded-2xl text-black font-black uppercase text-[9px] md:text-sm shadow-[1.5px_1.5px_0px_#000] md:shadow-[4px_4px_0px_#000] z-50">
        <School className="w-3 h-3 md:w-5 md:h-5 text-indigo-600" />
        <span>Sekolah Data</span>
      </div>

      {/* Main Content Area */}
      <div className="max-w-3xl flex flex-col items-center justify-center space-y-2 md:space-y-6 z-10 px-2 md:px-4">
        
        {/* Custom Hero Emblem Badge (Golden Trophy) - Responsive sizing */}
        <div className="relative inline-block mt-2 md:mt-0">
          <div className="w-14 h-14 md:w-28 md:h-28 bg-[#FDE047] rounded-2xl md:rounded-3xl border-2 md:border-4 border-black flex items-center justify-center text-2xl md:text-6xl shadow-[3px_3px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_rgba(0,0,0,1)] hover:rotate-6 transition-transform cursor-pointer animate-bounce">
            🏆
          </div>
          <div className="absolute -bottom-1 -right-1 md:-bottom-2 md:-right-2 bg-rose-500 border-2 md:border-4 border-black rounded-full h-5 w-5 md:h-10 md:w-10 flex items-center justify-center text-white text-[9px] md:text-sm font-black shadow-[1px_1px_0px_#000] md:shadow-[2px_2px_0px_#000]">
            ★
          </div>
        </div>

        {/* Title and Subtitle block */}
        <div className="space-y-1.5 md:space-y-4">
          <span className="text-[8px] md:text-[11px] uppercase font-mono font-black border-2 md:border-4 border-black bg-[#CCFBF1] text-black px-2.5 py-0.5 md:px-5 md:py-2 rounded-full inline-block tracking-wider md:tracking-widest shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] md:shadow-[3px_3px_0px_rgba(0,0,0,1)]">
            Simulasi Administrasi Kehadiran Kece
          </span>
          <h1 className="text-xl md:text-5xl lg:text-6xl font-black text-slate-900 font-display uppercase tracking-tight leading-none">
            Tantangan Sekolah Data
          </h1>
          <p className="text-[9px] md:text-sm lg:text-base text-slate-700 font-bold max-w-2xl mx-auto leading-normal md:leading-relaxed">
            Bantu sekolah mengelola kehadiran siswa secara cerdas dengan menerapkan kompetensi <span className="text-indigo-600 font-black underline">Berpikir Komputasional</span> untuk merumuskan kebijakan sekolah yang tepat.
          </p>
        </div>

        {/* Navigation Action Buttons - Responsive sizing */}
        <div className="pt-1 md:pt-4">
          <button
            type="button"
            onClick={() => { playSynthesizerNote('success'); onStartGame(); }}
            className="bg-[#FDE047] hover:bg-[#FACC15] text-black font-black text-[10px] md:text-base uppercase px-5 py-2 md:px-14 md:py-5 rounded-xl md:rounded-[2rem] border-2 md:border-4 border-black shadow-[3px_3px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_rgba(0,0,0,1)] md:hover:shadow-[10px_10px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-1.5 md:gap-3 cursor-pointer font-display tracking-wide"
            id="btn-play-adventure"
          >
            <Play className="w-3.5 h-3.5 md:w-6 md:h-6 text-black fill-black" />
            <span>Mulai Pengelolaan</span>
          </button>
        </div>

      </div>

    </motion.div>
  );
};
