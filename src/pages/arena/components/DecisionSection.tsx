import React, { useState } from 'react';
import { GameLevel } from '@/src/types';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, Check, Play, ChevronRight, Award, Megaphone, Milestone, Lightbulb } from 'lucide-react';

interface DecisionSectionProps {
  currentLevel: GameLevel;
  onSuccess: (scoreBonus: number) => void;
}

export const DecisionSection: React.FC<DecisionSectionProps> = ({
  currentLevel,
  onSuccess,
}) => {
  const decision = currentLevel.decision;
  
  // Track currently selected index
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  
  // Confirmed choice state
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const handleSelectOption = (idx: number) => {
    if (isSubmitted) return;
    setSelectedIndex(idx);
  };

  const handleSubmitDecision = () => {
    if (selectedIndex === null) return;
    setIsSubmitted(true);
  };

  const handleFinishLevel = () => {
    if (selectedIndex === null) return;
    const scoreBonus = decision.options[selectedIndex].scoreWeight;
    onSuccess(scoreBonus);
  };

  const options = decision.options;
  const chosenOption = selectedIndex !== null ? options[selectedIndex] : null;

  return (
    <div className="bg-white rounded-3xl border-4 border-black p-5 md:p-8 shadow-[8px_8px_0px_rgba(0,0,0,1)]">
      
      {/* Step Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b-2 border-black pb-5 mb-6 gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-[#FBCFE8] text-black border-2 border-black rounded-lg text-xs font-black font-mono shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)]">TAHAP 5</span>
            <h2 className="text-lg md:text-xl font-black text-slate-900 font-display uppercase tracking-tight">
              Kebijakan Strategis Berbasis Data (Literasi Data)
            </h2>
          </div>
          <p className="text-xs text-slate-700 font-bold">
            Ini adalah tahap akhir dan terpenting. Gunakan wawasan grafik Anda untuk mengambil keputusan logis penyelesaian masalah di sekolah.
          </p>
        </div>

        <div className="bg-[#FDE047] p-3 rounded-xl border-2 border-black max-w-sm shadow-[3px_3px_0px_rgba(0,0,0,1)] text-black">
          <div className="flex items-start gap-2">
            <Milestone className="w-5 h-5 text-black mt-0.5 shrink-0" />
            <p className="text-xs text-slate-950 leading-relaxed font-sans font-bold">
              <strong className="font-extrabold text-black">Kiat Algoritma:</strong> Gunakan hasil laporan diagram untuk merumuskan instruksi solusi yang konsisten dari waktu ke waktu.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left column: Scenario Description & Choices */}
        <div className="lg:col-span-7">
          <div className="bg-[#A5F3FC]/45 rounded-2xl p-5 border-2 border-black mb-6 shadow-[3.5px_3.5px_0px_rgba(0,0,0,1)] text-black">
            <div className="flex items-center gap-2 text-black font-black text-xs uppercase tracking-wider mb-2 font-mono">
              <Megaphone className="w-4 h-4 text-black animate-bounce" />
              Laporan Situasi Sekolah
            </div>
            <p className="text-xs md:text-sm text-slate-900 leading-relaxed font-bold">
              {decision.scenario}
            </p>
          </div>

          <h3 className="text-sm font-black uppercase text-slate-900 mb-3 tracking-tight">
            {decision.question}
          </h3>

          {/* Interactive choices */}
          <div className="space-y-3">
            {options.map((option, idx) => {
              const isSelected = selectedIndex === idx;
              
              let choiceStyle = "border-2 border-black bg-white hover:bg-slate-50 text-slate-800 shadow-[2px_2px_0px_rgba(0,0,0,1)]";
              if (isSelected) {
                choiceStyle = "border-2 border-black bg-[#FBCFE8] text-black font-black shadow-[3px_3px_0px_rgba(0,0,0,1)] scale-[1.01]";
              }

              if (isSubmitted) {
                if (idx === 0) { // The perfect choice (first choice is always programmed as optimal)
                  choiceStyle = "border-2 border-black bg-[#CCFBF1] text-emerald-950 font-black shadow-[3px_3px_0px_rgba(0,0,0,1)]";
                } else if (isSelected) {
                  choiceStyle = "border-2 border-black bg-[#FBCFE8] text-rose-950 line-through opacity-80 shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)]";
                } else {
                  choiceStyle = "border border-slate-350 bg-white text-slate-400 opacity-40";
                }
              }

              return (
                <button
                  key={option.text}
                  type="button"
                  onClick={() => handleSelectOption(idx)}
                  disabled={isSubmitted}
                  className={`w-full p-4 rounded-xl border text-left flex items-start gap-4 transition-all cursor-pointer ${choiceStyle}`}
                >
                  <span className={`w-6 h-6 rounded-lg text-xs font-black font-mono border border-black flex items-center justify-center shrink-0 mt-0.5 ${
                    isSubmitted && idx === 0
                      ? 'bg-black text-white'
                      : isSelected 
                        ? 'bg-black text-white' 
                        : 'bg-slate-100 text-slate-900'
                  }`}>
                    {idx + 1}
                  </span>
                  
                  <div className="text-xs md:text-sm font-bold leading-relaxed text-slate-900">
                    {option.text}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Action button */}
          {!isSubmitted ? (
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={handleSubmitDecision}
                disabled={selectedIndex === null}
                className={`px-6 py-3 rounded-xl font-black font-display text-sm border-2 border-black flex items-center gap-1.5 transition-all cursor-pointer ${
                  selectedIndex !== null
                    ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-[3px_3px_0px_rgba(0,0,0,1)]'
                    : 'bg-slate-200 text-slate-440 border-slate-350 cursor-not-allowed shadow-none'
                }`}
                id="btn-confirm-decision"
              >
                <span>Selesaikan Kebijakan Sekolah</span>
                <ChevronRight className="w-4 h-4 text-inherit" />
              </button>
            </div>
          ) : (
            <div className="mt-8 flex justify-end">
              <button
                type="button"
                onClick={handleFinishLevel}
                className="bg-black hover:bg-slate-900 border-2 border-black text-white font-black px-6 py-3.5 rounded-xl text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-[3px_3px_0px_rgba(0,0,0,1)] cursor-pointer hover:scale-[1.01]"
                id="btn-next-level"
              >
                <span>Lihat Hasil Sidang & Rapor Misi</span>
                <ChevronRight className="w-4 h-4 text-white" />
              </button>
            </div>
          )}
        </div>

        {/* Right column: Feedback Box */}
        <div className="lg:col-span-5">
          <AnimatePresence mode="wait">
            {isSubmitted && chosenOption ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`p-5 rounded-2xl border-2 border-black flex flex-col justify-between h-full gap-4 shadow-[4px_4px_0px_rgba(0,0,0,1)] ${
                  chosenOption.scoreWeight >= 30 
                    ? 'bg-[#CCFBF1]' 
                    : 'bg-[#FBCFE8]'
                }`}
              >
                <div className="text-black">
                  <div className="flex items-center gap-1.5 text-black font-black text-xs uppercase tracking-wider mb-2 font-mono">
                    <Lightbulb className="w-4.5 h-4.5 text-black fill-[#FDE047]" />
                    Tinjauan Keputusan Guru BK
                  </div>
                  <h4 className="text-xs font-black text-slate-950 mb-1">Keputusan Terpilih:</h4>
                  <p className="text-xs font-bold text-slate-900 leading-relaxed italic mb-4">
                    "{chosenOption.text}"
                  </p>
                  
                  <h4 className="text-xs font-black text-slate-950 mb-1">Saran / Evaluasi Pedagogis:</h4>
                  <p className="text-xs text-slate-900 leading-relaxed font-sans font-bold">
                    {chosenOption.feedback}
                  </p>
                </div>

                <div className="p-3 bg-white border-2 border-black rounded-xl flex items-center justify-between shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                  <span className="text-2xs font-mono font-black text-slate-500 uppercase tracking-wider">Koin Tercetak</span>
                  <span className="text-sm font-black font-mono text-emerald-900">
                    +{chosenOption.scoreWeight} Poin
                  </span>
                </div>
              </motion.div>
            ) : (
              <div className="p-6 border-2 border-black rounded-2xl bg-[#CCFBF1] shadow-[4px_4px_0px_rgba(0,0,0,1)] flex flex-col justify-center text-center h-48 lg:h-64 text-black">
                <HelpCircle className="w-8 h-8 text-black mx-auto mb-3" />
                <h4 className="font-black text-sm uppercase tracking-wide">Simulasi Solusi Kontekstual</h4>
                <p className="text-xs text-slate-900 font-bold max-w-xs mx-auto mt-1 leading-relaxed">
                  Data yang dikumpulkan di dunia nyata digunakan untuk membuat kebijakan yang berdampak mulia. Pilih salah satu kebijaksanaan lalu tekan tombol kirim.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};
