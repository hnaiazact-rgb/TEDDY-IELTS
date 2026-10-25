/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SKILL_QUIZZES, SkillQuiz } from '../data/ieltsData';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Award,
  Sparkles,
  ArrowRight,
  AlertTriangle,
} from 'lucide-react';

export const MicroSkillsTrainer: React.FC = () => {
  const [currentQuizIdx, setCurrentQuizIdx] = useState<number>(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const [scoreCount, setScoreCount] = useState<number>(0);

  const quiz = SKILL_QUIZZES[currentQuizIdx];

  const handleSelectOption = (optId: string) => {
    if (hasSubmitted) return;
    setSelectedOptionId(optId);
  };

  const handleSubmitAnswer = () => {
    if (!selectedOptionId || hasSubmitted) return;
    setHasSubmitted(true);
    const chosen = quiz.options.find((o) => o.id === selectedOptionId);
    if (chosen?.isCorrect) {
      setScoreCount((prev) => prev + 1);
    }
  };

  const handleNextQuiz = () => {
    if (currentQuizIdx < SKILL_QUIZZES.length - 1) {
      setCurrentQuizIdx((prev) => prev + 1);
      setSelectedOptionId(null);
      setHasSubmitted(false);
    }
  };

  const handleRestart = () => {
    setCurrentQuizIdx(0);
    setSelectedOptionId(null);
    setHasSubmitted(false);
    setScoreCount(0);
  };

  const selectedOpt = quiz.options.find((o) => o.id === selectedOptionId);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700 uppercase tracking-wider">
            <span>Micro-Skills Practice Drills</span>
            <span aria-hidden="true">·</span>
            <span>Luyện Phản Xạ Kỹ Năng Nhanh</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Luyện Kỹ Năng Viết IELTS Nhanh
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Thực hành các thử thách then chốt: viết Overview chuẩn Task 1, phát hiện bẫy văn phong học thuật, và kiểm soát liên từ chuyển câu.
          </p>
        </div>

        {/* Progress Tracker */}
        <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
          <div>
            Câu hỏi: <span className="font-bold text-slate-900">{currentQuizIdx + 1}</span> / {SKILL_QUIZZES.length}
          </div>
          <div>
            Điểm số: <span className="font-bold text-indigo-600">{scoreCount}</span> / {SKILL_QUIZZES.length}
          </div>
        </div>
      </div>

      {/* Quiz Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="space-y-2">
          <span className="text-xs font-bold px-2.5 py-1 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
            Dạng bài: {quiz.category}
          </span>
          <h3 className="text-lg font-bold text-slate-900 pt-2">
            {quiz.question}
          </h3>
          <p className="text-xs text-slate-600 italic bg-slate-50 p-3 rounded-lg border border-slate-100">
            <span className="font-semibold text-slate-700 not-italic">Ngữ cảnh: </span>
            {quiz.context}
          </p>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {quiz.options.map((option) => {
            let optionStyles = 'border-slate-200 bg-white hover:border-slate-300 text-slate-800';

            if (selectedOptionId === option.id && !hasSubmitted) {
              optionStyles = 'border-indigo-600 bg-indigo-50/50 text-indigo-950 ring-1 ring-indigo-500';
            }

            if (hasSubmitted) {
              if (option.isCorrect) {
                optionStyles = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-medium';
              } else if (selectedOptionId === option.id && !option.isCorrect) {
                optionStyles = 'border-red-400 bg-red-50 text-red-950';
              } else {
                optionStyles = 'border-slate-200 bg-slate-50/50 text-slate-400 opacity-60';
              }
            }

            return (
              <div
                key={option.id}
                onClick={() => handleSelectOption(option.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer text-xs sm:text-sm flex items-start gap-3 ${optionStyles}`}
              >
                <div className="w-5 h-5 rounded-full border border-current flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold uppercase">
                  {option.id}
                </div>
                <div className="flex-1 leading-relaxed">
                  {option.text}
                </div>
                {hasSubmitted && option.isCorrect && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                )}
                {hasSubmitted && selectedOptionId === option.id && !option.isCorrect && (
                  <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                )}
              </div>
            );
          })}
        </div>

        {/* Explanation Card (After Submission) */}
        {hasSubmitted && selectedOpt && (
          <div
            className={`p-4 rounded-xl border text-xs space-y-2 ${
              selectedOpt.isCorrect
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-amber-50 border-amber-200 text-amber-900'
            }`}
          >
            <div className="font-bold flex items-center gap-1.5">
              {selectedOpt.isCorrect ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Chính xác tuyệt đối! Giám khảo đánh giá rất cao.</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Chưa chính xác. Hãy cùng xem lời giải chi tiết:</span>
                </>
              )}
            </div>
            <p className="leading-relaxed">
              {selectedOpt.explanationVi}
            </p>
          </div>
        )}

        {/* Action Controls */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          {!hasSubmitted ? (
            <button
              onClick={handleSubmitAnswer}
              disabled={!selectedOptionId}
              className="px-6 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition-colors"
            >
              Kiểm Tra Đáp Án
            </button>
          ) : currentQuizIdx < SKILL_QUIZZES.length - 1 ? (
            <button
              onClick={handleNextQuiz}
              className="px-6 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-2"
            >
              <span>Câu hỏi tiếp theo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-emerald-700">
                Chúc mừng bạn đã hoàn thành bài tập!
              </span>
              <button
                onClick={handleRestart}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Luyện tập lại</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
