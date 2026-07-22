import React from 'react';
import { motion } from 'motion/react';
import { Play } from 'lucide-react';
import { playSynthesizerNote } from '@/src/utils/audio';
import logoPusbuk from '@/assets/logo-pusbuk.webp';
import studentSplashBg from '@/assets/Student_size_adjusted_ages_12_202607221344.webp';

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
      className="relative w-screen h-screen flex items-center justify-end p-6 md:p-16 lg:p-24 select-none overflow-hidden bg-slate-900"
    >
      {/* Background Image - Full screen */}
      <div className="absolute inset-0 z-0">
        <img
          src={studentSplashBg}
          alt="Latar Belakang Ruang Kelas"
          className="w-full h-full object-cover opacity-90"
        />
      </div>

      {/* Logo Pojok Kiri Atas - Responsive sizing */}
      <div className="absolute top-4 left-4 md:top-6 md:left-6 z-50">
        <img src={logoPusbuk} alt="Logo Pusbuk" className="h-10 w-auto md:h-16 object-contain" />
      </div>

      {/* Card di Sisi Kanan: Judul dan Tombol saja (over empty space) */}
      <div className="relative z-10 w-[85%] max-w-[240px] sm:max-w-[240px] md:max-w-xs lg:max-w-sm 2xl:max-w-lg bg-white p-2 sm:p-4 md:p-6 2xl:p-8 rounded-xl md:rounded-3xl border-2 md:border-4 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_rgba(0,0,0,1)] flex flex-col items-stretch space-y-4 md:space-y-6">
        
        {/* Title */}
        <h1 className="text-base sm:text-base md:text-2xl xl:text-3xl font-black text-slate-900 font-display uppercase tracking-tight leading-none">
          Grafik Kehadiran <br className="hidden sm:inline" /> Siswa di Sekolah
        </h1>

        {/* Navigation Action Button */}
        <div className="w-full">
          <button
            type="button"
            onClick={() => {
              playSynthesizerNote('success');
              onStartGame();
            }}
            className="w-full bg-[#FDE047] hover:bg-[#FACC15] text-black font-black text-[10px] sm:text-[10px] md:text-sm lg:text-base uppercase px-2 py-1.5 sm:px-2.5 sm:py-2 md:px-6 md:py-3 lg:px-8 lg:py-3.5 rounded-lg md:rounded-xl border-2 md:border-4 border-black shadow-[3px_3px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] md:hover:shadow-[10px_10px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-1 sm:gap-2 cursor-pointer font-display tracking-wide whitespace-nowrap"
            id="btn-play-adventure"
          >
            <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-5 md:h-5 text-black fill-black" />
            <span>Mulai Pengelolaan</span>
          </button>
        </div>

      </div>
    </motion.div>
  );
};
