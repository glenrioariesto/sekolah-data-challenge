import React from 'react';
import { motion } from 'motion/react';
import { Play } from 'lucide-react';
import { playSynthesizerNote } from '@/src/utils/audio';
import logoPusbuk from '@/assets/logo-pusbuk.webp';

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
      <div className="absolute top-2 left-2 md:top-6 md:left-6 z-50">
        <img src={logoPusbuk} alt="Logo Pusbuk" className="h-10 w-auto md:h-16 object-contain" />
      </div>

      {/* Main Content Area */}
      <div className="max-w-3xl flex flex-col items-center justify-center space-y-4 md:space-y-6 z-10 px-2 md:px-4">
        
        {/* Title and Subtitle block */}
        <div className="space-y-1.5 md:space-y-4 flex flex-col items-center">
          <span className="text-[8px] md:text-[11px] uppercase font-mono font-black border-2 md:border-4 border-black bg-[#CCFBF1] text-black px-2.5 py-0.5 md:px-5 md:py-2 rounded-full inline-block tracking-wider md:tracking-widest shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] md:shadow-[3px_3px_0px_rgba(0,0,0,1)] mb-2">
            Simulasi Administrasi Kehadiran Kece
          </span>
          <h1 className="text-xl md:text-5xl lg:text-6xl font-black text-slate-900 font-display uppercase tracking-tight leading-none">
            Tantangan Sekolah Data
          </h1>
        </div>

        {/* Navigation Action Buttons - Responsive sizing */}
        <div className="pt-2 md:pt-4">
          <button
            type="button"
            onClick={() => { playSynthesizerNote('success'); onStartGame(); }}
            className="bg-[#FDE047] hover:bg-[#FACC15] text-black font-black text-[10px] md:text-base uppercase px-5 py-2 md:px-14 md:py-5 rounded-lg md:rounded-xl border-2 md:border-4 border-black shadow-[3px_3px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_rgba(0,0,0,1)] md:hover:shadow-[10px_10px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-1.5 md:gap-3 cursor-pointer font-display tracking-wide"
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
