import React from 'react';
import { motion } from 'motion/react';
import { Play } from 'lucide-react';
import { playSynthesizerNote } from '@/src/utils/audio';
import { useAudio } from '@/src/hooks/useAudio';
import { AudioToggle } from '@/src/components/AudioToggle';
import logoPusbuk from '@/assets/logo-pusbuk.webp';
import studentSplashBg from '@/assets/bg-splash.webp';

interface SplashPageProps {
  onStartGame: () => void;
}

export const SplashPage: React.FC<SplashPageProps> = ({ onStartGame }) => {
  const { isMuted, toggle } = useAudio();

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
      <div className="absolute top-4 left-4 md:top-6 md:left-6 2xl:top-8 2xl:left-8 z-50">
        <img src={logoPusbuk} alt="Logo Pusbuk" className="h-10 w-auto md:h-16 2xl:h-20 object-contain drop-shadow" />
      </div>

      {/* Button Mute/Unmute Pojok Kanan Atas */}
      <div className="absolute top-4 right-4 md:top-6 md:right-6 2xl:top-8 2xl:right-8 z-50">
        <AudioToggle isMuted={isMuted} onToggle={toggle} />
      </div>

      {/* Card di Sisi Kanan: Judul dan Tombol saja (over empty space) */}
      <div className="relative z-10 w-[85%] max-w-[240px] sm:max-w-[240px] md:max-w-xs lg:max-w-sm 2xl:max-w-2xl bg-white p-2 sm:p-4 md:p-6 2xl:p-12 rounded-xl md:rounded-3xl 2xl:rounded-[32px] border-2 md:border-4 2xl:border-[6px] border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_rgba(0,0,0,1)] 2xl:shadow-[14px_14px_0px_rgba(0,0,0,1)] flex flex-col items-stretch space-y-4 md:space-y-6 2xl:space-y-8">
        
        {/* Title */}
        <h1 className="text-[22px] sm:text-[20px] md:text-[28px] lg:text-[34px] xl:text-[34px] 2xl:text-[56px] 2xl:leading-[1.1] text-justify font-black text-slate-900 font-display uppercase tracking-tight leading-none">
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
            className="w-full bg-[#FDE047] hover:bg-[#FACC15] text-black font-black text-[10px] sm:text-[10px] md:text-sm lg:text-base 2xl:text-2xl uppercase px-2 py-1.5 sm:px-2.5 sm:py-2 md:px-6 md:py-3 lg:px-8 lg:py-3.5 2xl:px-10 2xl:py-5 rounded-lg md:rounded-xl 2xl:rounded-2xl border-2 md:border-4 2xl:border-[5px] border-black shadow-[3px_3px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_rgba(0,0,0,1)] 2xl:shadow-[10px_10px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] md:hover:shadow-[10px_10px_0px_rgba(0,0,0,1)] 2xl:hover:shadow-[14px_14px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-1 sm:gap-2 2xl:gap-3.5 cursor-pointer font-display tracking-wide whitespace-nowrap"
            id="btn-play-adventure"
          >
            <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-5 md:h-5 2xl:w-8 2xl:h-8 text-black fill-black" />
            <span>Mulai Pengelolaan</span>
          </button>
        </div>

      </div>
    </motion.div>
  );
};
