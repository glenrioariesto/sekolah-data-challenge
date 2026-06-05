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
      className="relative w-screen h-screen flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden"
    >
      {/* Logo Pojok Kiri Atas - Diluar Card / Full screen absolute positioning */}
      <div className="absolute top-6 left-6 flex items-center gap-2 bg-white border-4 border-black px-4 py-2 rounded-2xl text-black font-black uppercase text-sm shadow-[4px_4px_0px_#000] z-50">
        <School className="w-5 h-5 text-indigo-600" />
        <span>Sekolah Data</span>
      </div>

      {/* Badge Edisi Guru BK Pojok Kanan Atas - Diluar Card */}
      <div className="absolute top-6 right-6 bg-[#FDE047] border-4 border-black px-4 py-2 rounded-2xl text-black font-mono text-[10px] font-black uppercase tracking-wider shadow-[4px_4px_0px_#000] z-50">
        Edisi Guru BK © 2026
      </div>

      {/* Main Content Area */}
      <div className="max-w-3xl flex flex-col items-center justify-center space-y-8 z-10 px-4">
        
        {/* Custom Hero Emblem Badge (Golden Trophy / Star Panel) */}
        <div className="relative inline-block">
          <div className="w-28 h-28 bg-[#FDE047] rounded-3xl border-4 border-black flex items-center justify-center text-6xl shadow-[8px_8px_0px_rgba(0,0,0,1)] hover:rotate-6 transition-transform cursor-pointer animate-bounce">
            🏆
          </div>
          <div className="absolute -bottom-2 -right-2 bg-rose-500 border-4 border-black rounded-full h-10 w-10 flex items-center justify-center text-white text-sm font-black shadow-[2px_2px_0px_#000]">
            ★
          </div>
        </div>

        {/* Title and Subtitle block */}
        <div className="space-y-4">
          <span className="text-[11px] uppercase font-mono font-black border-4 border-black bg-[#CCFBF1] text-black px-5 py-2 rounded-full inline-block tracking-widest shadow-[3px_3px_0px_rgba(0,0,0,1)]">
            Simulasi Administrasi Kehadiran Kece
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 font-display uppercase tracking-tight leading-none">
            Tantangan Sekolah Data
          </h1>
          <p className="text-xs md:text-base text-slate-700 font-bold max-w-2xl mx-auto leading-relaxed">
            Bantu Kepala Sekolah melacak tingkat kehadiran siswa secara cerdas! Kuasai kompetensi <span className="text-indigo-600 font-black underline">Berpikir Komputasional</span> dengan memecah daftar nama harian, mendeteksi tren pola dalam grafik digital, serta menyusun solusi kebijakan strategis sekolah yang adil.
          </p>
        </div>

        {/* Navigation Action Buttons - Start Button Only */}
        <div className="pt-4">
          <button
            type="button"
            onClick={() => { playSynthesizerNote('success'); onStartGame(); }}
            className="bg-[#FDE047] hover:bg-[#FACC15] text-black font-black text-base uppercase px-14 py-6 rounded-[2rem] border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-0.5 hover:shadow-[10px_10px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-3 cursor-pointer font-display tracking-wide"
            id="btn-play-adventure"
          >
            <Play className="w-6 h-6 text-black fill-black" />
            <span>Mulai Pengelolaan</span>
          </button>
        </div>

      </div>

      {/* Decorative background shapes for clean fullscreen visual */}
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#A5F3FC] border-4 border-black rounded-3xl rotate-12 -z-10 shadow-[6px_6px_0px_#000]" />
      <div className="absolute -top-10 -right-10 w-48 h-48 bg-[#FBCFE8] border-4 border-black rounded-3xl -rotate-12 -z-10 shadow-[6px_6px_0px_#000]" />

    </motion.div>
  );
};
