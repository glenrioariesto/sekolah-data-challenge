import React from 'react';
import { motion } from 'motion/react';
import { Play, Award } from 'lucide-react';
import { playSynthesizerNote } from '../utils/audio';

interface SplashPageProps {
  onStartGame: () => void;
  onOpenBadges: () => void;
}

export const SplashPage: React.FC<SplashPageProps> = ({ onStartGame, onOpenBadges }) => {
  return (
    <motion.div
      key="start-page"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 max-w-4xl mx-auto w-full"
    >
      {/* Elegant Neobrutalism Main Container */}
      <div className="w-full bg-white rounded-3xl border-4 border-black shadow-[8px_8px_0px_#000000] p-6 md:p-12 text-center space-y-8 relative overflow-hidden">
        
        {/* Decorative side badge element */}
        <div className="absolute top-4 right-4 bg-[#FDE047] border-2 border-black px-3 py-1 rounded-xl text-black font-mono text-[9px] font-black uppercase tracking-wider shadow-[2px_2px_0px_#000]">
          Edisi Guru BK © 2026
        </div>

        {/* Custom Hero Emblem Badge (Golden Trophy / Star Panel) */}
        <div className="relative inline-block mt-4">
          <div className="w-24 h-24 bg-[#FDE047] rounded-3xl border-4 border-black flex items-center justify-center text-5xl shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:rotate-6 transition-transform cursor-pointer animate-bounce">
            🏆
          </div>
          <div className="absolute -bottom-2 -right-2 bg-rose-500 border-2 border-black rounded-full h-8 w-8 flex items-center justify-center text-white text-xs font-black shadow-[1.5px_1.5px_0px_#000]">
            ★
          </div>
        </div>

        {/* Title and Subtitle block */}
        <div className="space-y-3">
          <span className="text-[10px] uppercase font-mono font-black border-2 border-black bg-[#CCFBF1] text-black px-4 py-1.5 rounded-full inline-block tracking-widest shadow-[2px_2px_0px_rgba(0,0,0,1)]">
            Simulasi Administrasi Kehadiran Kece
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-slate-1000 font-display uppercase tracking-tight leading-none pt-2">
            Tantangan Sekolah Data
          </h1>
          <p className="text-xs md:text-sm text-slate-700 font-bold max-w-2xl mx-auto leading-relaxed">
            Bantu Kepala Sekolah melacak tingkat kehadiran siswa secara cerdas! Kuasai kompetensi <span className="text-indigo-600 font-black underline">Berpikir Komputasional</span> dengan memecah daftar nama harian, mendeteksi tren pola dalam grafik digital, serta menyusun solusi kebijakan strategis sekolah yang adil.
          </p>
        </div>

        {/* Computational Thinking Core Skills Blocks */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
          {[
            { skill: '🧩 Dekomposisi', desc: 'Memecah daftar siswa harian', color: 'bg-[#A5F3FC]' },
            { skill: '📈 Abstraksi', desc: 'Mewujudkan grafik dari tabel', color: 'bg-[#FBCFE8]' },
            { skill: '🔍 Pengenalan Pola', desc: 'Membaca tren & anomali data', color: 'bg-[#CCFBF1]' },
            { skill: '⚙️ Algoritma', desc: 'Merumuskan solusi sekolah', color: 'bg-[#FDE047]' }
          ].map((item, idx) => (
            <div key={idx} className={`${item.color} p-3 rounded-2xl border-2 border-black text-left shadow-[3px_3px_0px_#000] flex flex-col justify-between`}>
              <h3 className="text-xs font-black text-slate-950 font-display">{item.skill}</h3>
              <p className="text-[10px] text-slate-800 leading-tight font-bold mt-1 line-clamp-2">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Navigation Action Buttons */}
        <div className="pt-6 border-t-2 border-black flex flex-col sm:flex-row gap-4 items-center justify-center">
          
          {/* Main Adventure Button */}
          <button
            type="button"
            onClick={() => { playSynthesizerNote('success'); onStartGame(); }}
            className="w-full sm:w-auto bg-[#FDE047] hover:bg-[#FACC15] text-black font-black text-sm uppercase px-10 py-5 rounded-3xl border-4 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-0.5 hover:shadow-[8px_8px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-2 cursor-pointer font-display tracking-wide"
            id="btn-play-adventure"
          >
            <Play className="w-5 h-5 text-black fill-black" />
            <span>Mulai Pengelolaan</span>
          </button>

          {/* Badge Modal Button */}
          <button
            type="button"
            onClick={() => { playSynthesizerNote('btn'); onOpenBadges(); }}
            className="w-full sm:w-auto bg-[#CCFBF1] hover:bg-teal-200 text-black font-black text-xs uppercase px-7 py-4 rounded-2xl border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer font-mono"
            id="btn-view-gallery-modal"
          >
            <Award className="w-5 h-5 text-rose-600" />
            <span>Galeri Lencana Kehormatan 🏅</span>
          </button>

        </div>

        {/* Humble Footer Credits inline */}
        <div className="pt-4 flex items-center justify-center gap-1.5 text-2xs text-slate-500 font-mono">
          <span>Sekolah Data Challenge • Bermain Sambil Mengasah Logika Komputer</span>
        </div>

      </div>
    </motion.div>
  );
};
