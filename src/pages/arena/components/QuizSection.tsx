import React, { useState } from 'react';
import { GameLevel, QuizQuestion } from '@/src/types';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, Check, X, ArrowRight, BookOpen, AlertCircle, Sparkles, BrainCircuit } from 'lucide-react';

interface QuizSectionProps {
  currentLevel: GameLevel;
  onSuccess: (scoreBonus: number) => void;
}

export const QuizSection: React.FC<QuizSectionProps> = ({
  currentLevel,
  onSuccess,
}) => {
  const questions = currentLevel.questions;
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  
  // Track selected answer for current question
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  
  // Confirmed submission state
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  
  // Scores for this specific quiz session
  const [quizScore, setQuizScore] = useState<number>(0);

  const activeQuestion = questions[currentIdx];

  const handleSelectOption = (option: string) => {
    if (isAnswered) return;
    setSelectedOption(option);
  };

  const handleConfirmAnswer = () => {
    if (!selectedOption) return;
    
    setIsAnswered(true);
    const isCorrect = selectedOption === activeQuestion.correctAnswer;
    
    if (isCorrect) {
      setQuizScore(prev => prev + 15); // +15 points per correct question (total 30 points for 2 questions)
    }
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      // Move to next question
      setCurrentIdx(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      // Completed last question of the quiz!
      onSuccess(quizScore);
    }
  };

  const isCorrect = selectedOption === activeQuestion?.correctAnswer;

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl border-2 sm:border-4 border-black p-2 sm:p-5 md:p-8 shadow-[4px_4px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_rgba(0,0,0,1)]">
      
      {/* Title section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b-2 border-black pb-3 sm:pb-5 mb-3 sm:mb-6 gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-[#FDE047] text-black border-2 border-black rounded-lg text-xs font-black font-mono shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)]">TAHAP 4</span>
            <h2 className="text-lg md:text-xl font-black text-slate-900 font-display uppercase tracking-tight">
              Analisis Informasi & Pola Grafik
            </h2>
          </div>
          <p className="text-xs text-slate-700 font-bold">
            Jawab pertanyaan analisis di bawah ini berdasarkan grafik yang telah Anda sajikan sebelumnya.
          </p>
        </div>

        <div className="bg-[#A5F3FC] p-2 sm:p-3 rounded-lg sm:rounded-xl border-2 border-black max-w-sm shadow-[3px_3px_0px_rgba(0,0,0,1)] text-black">
          <div className="flex items-start gap-2">
            <BrainCircuit className="w-5 h-5 text-black mt-0.5 shrink-0" />
            <p className="text-xs text-slate-950 leading-relaxed font-sans font-bold">
              <strong className="font-extrabold text-black">Pengenalan Pola:</strong> Temukan kecenderungan umum atau anomali yang janggal di tengah lautan data visual.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-2 sm:gap-4 md:gap-6 md:gap-8 items-start">
        
        {/* Left Side: Question Card */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-2xl p-5 md:p-6 border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)]">
            
            {/* Index counter */}
            <div className="flex items-center justify-between mb-2 sm:mb-4">
              <span className="text-[10px] font-mono font-black bg-[#CCFBF1] text-black px-2.5 py-1 rounded-full uppercase tracking-wider border border-black shadow-[1.5px_1.5px_0px_#000]">
                Pertanyaan {currentIdx + 1} dari {questions.length}
              </span>
              <span className="text-xs text-slate-800 font-black">Bobot: +15 Poin</span>
            </div>

            {/* Actual Question */}
            <h3 className="text-base md:text-lg font-black text-slate-900 leading-snug mb-6">
              {activeQuestion?.question}
            </h3>

            {/* Answer Options list */}
            <div className="space-y-3">
              {activeQuestion?.options.map((option, idx) => {
                const letter = String.fromCharCode(65 + idx); // A, B, C, D
                const isSelected = selectedOption === option;
                
                let optionStyle = "border-2 border-black bg-white text-slate-800 hover:bg-slate-50 shadow-[2px_2px_0px_rgba(0,0,0,1)]";
                
                if (isSelected) {
                  optionStyle = "border-2 border-black bg-[#FDE047] text-black font-black shadow-[3px_3px_0px_rgba(0,0,0,1)] scale-[1.01]";
                }

                if (isAnswered) {
                  const isThisCorrect = option === activeQuestion.correctAnswer;
                  if (isThisCorrect) {
                    optionStyle = "border-2 border-black bg-[#CCFBF1] text-emerald-950 font-black shadow-[3px_3px_0px_rgba(0,0,0,1)]";
                  } else if (isSelected) {
                    optionStyle = "border-2 border-black bg-[#FBCFE8] text-rose-950 line-through opacity-85 shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)]";
                  } else {
                    optionStyle = "border border-slate-300 bg-white text-slate-400 opacity-50";
                  }
                }

                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleSelectOption(option)}
                    disabled={isAnswered}
                    className={`w-full p-4 rounded-xl text-left flex items-center justify-between gap-4 transition-all cursor-pointer ${optionStyle}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-7 h-7 rounded-lg font-mono font-black border border-black flex items-center justify-center text-xs shadow-[1px_1px_0px_#000] ${
                        isAnswered && option === activeQuestion.correctAnswer
                          ? 'bg-black text-white'
                          : isSelected
                            ? 'bg-black text-white'
                            : 'bg-slate-100 text-slate-900'
                      }`}>
                        {letter}
                      </span>
                      <span className="text-sm font-bold leading-normal">{option}</span>
                    </div>

                    {isAnswered && option === activeQuestion.correctAnswer && (
                      <Check className="w-5 h-5 text-emerald-700 shrink-0 stroke-[3px]" />
                    )}
                    {isAnswered && isSelected && option !== activeQuestion.correctAnswer && (
                      <X className="w-5 h-5 text-rose-600 shrink-0 stroke-[3px]" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Confirm Actions */}
            {!isAnswered ? (
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={handleConfirmAnswer}
                  disabled={!selectedOption}
                  className={`px-6 py-3 rounded-xl font-black font-display text-sm border-2 border-black flex items-center gap-1.5 transition-all cursor-pointer ${
                    selectedOption 
                      ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-[3px_3px_0px_rgba(0,0,0,1)]'
                      : 'bg-slate-200 text-slate-450 border-slate-300 cursor-not-allowed shadow-none'
                  }`}
                  id="btn-confirm-quiz"
                >
                  <span>Konfirmasi Jawaban</span>
                  <ArrowRight className="w-4 h-4 text-inherit" />
                </button>
              </div>
            ) : (
              <div className="mt-8 flex justify-end">
                <button
                  type="button"
                  onClick={handleNext}
                  className="bg-black hover:bg-slate-900 text-white font-black border-2 border-black px-6 py-3 rounded-xl text-sm flex items-center gap-1.5 transition-all cursor-pointer shadow-[3px_3px_0px_rgba(0,0,0,1)]"
                  id="btn-next-quiz"
                >
                  <span>{currentIdx < questions.length - 1 ? 'Pertanyaan Selanjutnya' : 'Kirim Nilai Analisis'}</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>
              </div>
            )}

          </div>
        </div>

        {/* Right Side: Visual explanations */}
        <div className="lg:col-span-5">
          <AnimatePresence mode="wait">
            {isAnswered ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className={`p-5 rounded-2xl border-2 border-black flex flex-col h-full justify-between gap-4 shadow-[4px_4px_0px_#000] ${
                  isCorrect 
                    ? 'bg-[#CCFBF1] text-black' 
                    : 'bg-[#FBCFE8] text-black'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpen className="w-5 h-5 text-black" />
                    <span className="text-xs font-black uppercase tracking-wider font-mono text-black">
                      {isCorrect ? 'Penjelasan Jawaban Tepat' : 'Analisis Kurang Tepat'}
                    </span>
                  </div>

                  <p className="text-sm font-black mb-2 text-black">
                    {activeQuestion.correctAnswer}
                  </p>

                  <p className="text-xs text-slate-900 leading-relaxed font-bold whitespace-pre-line">
                    {activeQuestion.explanation}
                  </p>
                </div>

                <div className="p-3 bg-white rounded-xl flex items-center gap-2 border-2 border-black shadow-[2px_2px_0px_#000]">
                  <Sparkles className="w-4.5 h-4.5 text-black fill-[#FDE047]" />
                  <span className="text-xs font-black text-slate-900">
                    {isCorrect ? 'Keren! Kamu mendapatkan +15 Poin!' : 'Belajar dari kesalahan! Mari pelajari ulasannya!'}
                  </span>
                </div>
              </motion.div>
            ) : (
              <div className="p-6 border-2 border-black rounded-2xl bg-[#FDE047] shadow-[4px_4px_0px_rgba(0,0,0,1)] flex flex-col justify-center text-center h-48 lg:h-64 text-black">
                <HelpCircle className="w-8 h-8 text-black mx-auto mb-3" />
                <h4 className="font-black text-sm uppercase tracking-wide">Tahap Penelaahan Data</h4>
                <p className="text-xs text-slate-900 font-bold max-w-xs mx-auto mt-1 leading-relaxed">
                  Pilih salah satu pilihan di sebelah kiri yang paling sesuai membaca grafik visual, lalu klik Konfirmasi Jawaban.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};
