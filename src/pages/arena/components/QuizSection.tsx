import React, { useState } from 'react';
import { GameLevel } from '@/src/types';
import { motion, AnimatePresence } from 'motion/react';
import { Check, X, ArrowRight, BookOpen } from 'lucide-react';
import { playSynthesizerNote } from '@/src/utils/audio';

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

  // Show wrong-answer modal
  const [showWrongModal, setShowWrongModal] = useState<boolean>(false);

  // Scores for this specific quiz session
  const [quizScore, setQuizScore] = useState<number>(0);

  const activeQuestion = questions[currentIdx];

  const handleSelectOption = (option: string) => {
    if (isAnswered) return;
    playSynthesizerNote('select');
    setSelectedOption(option);
  };

  const handleConfirmAnswer = () => {
    if (!selectedOption) return;

    setIsAnswered(true);
    const isCorrect = selectedOption === activeQuestion.correctAnswer;

    if (isCorrect) {
      playSynthesizerNote('success');
      setQuizScore(prev => prev + 20);
    } else {
      playSynthesizerNote('fail');
      // Show wrong-answer modal
      setShowWrongModal(true);
    }
  };

  const handleCloseWrongModal = () => {
    playSynthesizerNote('click');
    setShowWrongModal(false);
  };

  const handleNext = () => {
    playSynthesizerNote('click');
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setShowWrongModal(false);
    } else {
      onSuccess(quizScore);
    }
  };

  const isCorrect = selectedOption === activeQuestion?.correctAnswer;

  return (
    <>
      {/* ── Main Quiz Card ── */}
      <div id="quiz-main-card" className="bg-white rounded-2xl md:rounded-3xl border-2 md:border-4 border-black p-3 lg:p-8 shadow-[4px_4px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_rgba(0,0,0,1)] max-h-[90vh] overflow-y-auto">

        {/* Index counter */}
        <div id="quiz-header" className="flex items-center justify-between mb-2 sm:mb-4">
          <span id="quiz-counter" className="text-[9px] sm:text-[10px] font-display font-black bg-[#CCFBF1] text-black px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full uppercase tracking-wider border border-black shadow-[1.5px_1.5px_0px_#000]">
            Pertanyaan {currentIdx + 1} dari {questions.length}
          </span>
          <span id="quiz-weight" className="text-[10px] sm:text-xs text-slate-800 font-black font-display uppercase">Bobot: +20 Poin</span>
        </div>

        {/* Actual Question */}
        <h3 id="quiz-question" className="text-xs sm:text-sm lg:text-lg font-black text-slate-900 leading-snug mb-1 sm:mb-4 lg:mb-5">
          {activeQuestion?.question}
        </h3>

        {/* Answer Options */}
        <div id="quiz-options" className="space-y-1.5 sm:space-y-2.5 lg:space-y-3">
          {activeQuestion?.options.map((option, idx) => {
            const letter = String.fromCharCode(65 + idx);
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
                className={`w-full p-2 sm:p-3 lg:p-4 rounded-xl text-left flex items-center justify-between gap-2 sm:gap-3 lg:gap-4 transition-all cursor-pointer ${optionStyle}`}
                id={`btn-quiz-choice-${idx}`}
              >
                <div id={`quiz-choice-text-${idx}`} className="flex items-center gap-2 sm:gap-3">
                  <span id={`quiz-choice-letter-${idx}`} className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg font-display font-black border border-black flex items-center justify-center text-[10px] sm:text-xs shadow-[1px_1px_0px_#000] shrink-0 uppercase ${
                    isAnswered && option === activeQuestion.correctAnswer
                      ? 'bg-black text-white'
                      : isSelected
                        ? 'bg-black text-white'
                        : 'bg-slate-100 text-slate-900'
                  }`}>
                    {letter}
                  </span>
                  <span id={`quiz-choice-label-${idx}`} className="text-xs sm:text-[13px] lg:text-md font-bold leading-normal">{option}</span>
                </div>

                {isAnswered && option === activeQuestion.correctAnswer && (
                  <Check id={`quiz-choice-check-${idx}`} className="w-4 h-4 md:w-5 md:h-5 text-emerald-700 shrink-0 stroke-[3px]" />
                )}
                {isAnswered && isSelected && option !== activeQuestion.correctAnswer && (
                  <X id={`quiz-choice-x-${idx}`} className="w-4 h-4 md:w-5 md:h-5 text-rose-600 shrink-0 stroke-[3px]" />
                )}
              </button>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div id="quiz-action-row" className="mt-2 sm:mt-4 lg:mt-6 flex justify-end">
          {!isAnswered ? (
            <button
              id="btn-confirm-quiz"
              type="button"
              onClick={handleConfirmAnswer}
              disabled={!selectedOption}
              className={`px-3 sm:px-4 lg:px-6 py-1.5 sm:py-2 lg:py-3 rounded-xl font-black font-display text-[10px] sm:text-xs lg:text-md border-2 border-black flex items-center gap-1.5 transition-all cursor-pointer ${
                selectedOption
                  ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-[3px_3px_0px_rgba(0,0,0,1)]'
                  : 'bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed shadow-none'
              }`}
            >
              <span id="quiz-confirm-label">Konfirmasi Jawaban</span>
              <ArrowRight id="quiz-confirm-icon" className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-inherit" />
            </button>
          ) : (
            <button
              id="btn-next-quiz"
              type="button"
              onClick={handleNext}
              className="bg-black hover:bg-slate-900 text-white font-black border-2 border-black px-3 sm:px-4 lg:px-6 py-1.5 sm:py-2 lg:py-3 rounded-xl text-[10px] sm:text-xs lg:text-md flex items-center gap-1.5 transition-all cursor-pointer shadow-[3px_3px_0px_rgba(0,0,0,1)]"
            >
              <span id="quiz-next-label">{currentIdx < questions.length - 1 ? 'Pertanyaan Selanjutnya' : 'Kirim Nilai Analisis'}</span>
              <ArrowRight id="quiz-next-icon" className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
            </button>
          )}
        </div>

      </div>

      {/* ── Wrong Answer Modal ── */}
      <AnimatePresence>
        {showWrongModal && (
          <>
            {/* Backdrop */}
            <motion.div
              id="quiz-wrong-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-50"
              onClick={handleCloseWrongModal}
            />

            {/* Modal */}
            <motion.div
              id="quiz-wrong-modal"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-4"
              role="dialog"
              aria-modal="true"
            >
              <div id="quiz-wrong-card" className="bg-[#FBCFE8] border-2 md:border-4 border-black rounded-xl md:rounded-3xl shadow-[4px_4px_0px_rgba(0,0,0,1)] md:shadow-[10px_10px_0px_rgba(0,0,0,1)] w-full max-w-md md:max-w-md p-2 md:p-6 flex flex-col gap-1 md:gap-4">

                {/* Correct Answer */}
                <div id="quiz-wrong-answer">
                  <p id="quiz-wrong-answer-label" className="text-[8px] md:text-[10px] uppercase tracking-widest font-black text-rose-700 font-mono leading-tight">
                    Jawaban yang benar:
                  </p>
                  <p id="quiz-wrong-answer-value" className="text-[11px] md:text-base font-black text-black leading-snug mt-0.5">
                    {activeQuestion?.correctAnswer}
                  </p>
                </div>

                {/* Explanation */}
                <div id="quiz-wrong-explanation" className="bg-white/70 rounded-lg md:rounded-xl border border-black/20 md:border-2 p-1.5 md:p-4">
                  <div id="quiz-wrong-explanation-header" className="flex items-center gap-1 mb-0.5 md:mb-2">
                    <BookOpen id="quiz-wrong-explanation-icon" className="w-3 h-3 md:w-3.5 md:h-3.5 text-black shrink-0" />
                    <span id="quiz-wrong-explanation-label" className="text-[8px] md:text-[10px] font-black uppercase tracking-wide font-mono text-black">Penjelasan</span>
                  </div>
                  <p id="quiz-wrong-explanation-text" className="text-[9px] md:text-xs text-slate-800 leading-snug md:leading-relaxed font-bold whitespace-pre-line">
                    {activeQuestion?.explanation}
                  </p>
                </div>

                {/* CTA Button */}
                <button
                  id="btn-wrong-modal-next"
                  type="button"
                  onClick={handleNext}
                  className="w-full bg-black hover:bg-slate-900 text-white font-black border-2 border-black px-3 md:px-5 py-1.5 md:py-3.5 rounded-lg md:rounded-xl text-[10px] md:text-md flex items-center justify-center gap-1 md:gap-2 transition-all cursor-pointer font-display uppercase tracking-tight"
                >
                  <span id="quiz-wrong-next-label">{currentIdx < questions.length - 1 ? 'Mengerti, Lanjut Soal' : 'Mengerti, Kirim Nilai'}</span>
                  <ArrowRight id="quiz-wrong-next-icon" className="w-3 h-3 md:w-4 md:h-4 text-white" />
                </button>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
