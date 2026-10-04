import React from 'react';
import { Question, UserAnswerState } from '../types';
import { Award, CheckCircle2, RotateCcw, X, TrendingUp, DollarSign, BarChart2 } from 'lucide-react';

interface SummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  questions: Question[];
  userStates: Record<number, UserAnswerState>;
  onJumpToQuestion: (index: number) => void;
  onResetAll: () => void;
}

export const SummaryModal: React.FC<SummaryModalProps> = ({
  isOpen,
  onClose,
  questions,
  userStates,
  onJumpToQuestion,
  onResetAll,
}) => {
  if (!isOpen) return null;

  const totalScore = questions.filter((q) => userStates[q.id]?.isCorrect).length;
  const firstAttemptCorrect = questions.filter((q) => userStates[q.id]?.firstAttemptCorrect).length;
  const percentage = Math.round((totalScore / questions.length) * 100);

  // Cambridge 0580 Grade Estimation
  let cambridgeGrade = 'U (Ungraded)';
  let gradeColor = 'text-rose-400 bg-rose-500/10 border-rose-500/30';
  if (percentage >= 90) {
    cambridgeGrade = 'Grade 9 (High A*)';
    gradeColor = 'text-emerald-400 bg-emerald-500/15 border-emerald-500/40';
  } else if (percentage >= 80) {
    cambridgeGrade = 'Grade 8 (A*)';
    gradeColor = 'text-cyan-400 bg-cyan-500/15 border-cyan-500/40';
  } else if (percentage >= 70) {
    cambridgeGrade = 'Grade 7 (A)';
    gradeColor = 'text-indigo-400 bg-indigo-500/15 border-indigo-500/40';
  } else if (percentage >= 60) {
    cambridgeGrade = 'Grade 6 (B)';
    gradeColor = 'text-amber-400 bg-amber-500/15 border-amber-500/40';
  } else if (percentage >= 50) {
    cambridgeGrade = 'Grade 5 (Strong C)';
    gradeColor = 'text-yellow-400 bg-yellow-500/15 border-yellow-500/40';
  } else if (percentage >= 40) {
    cambridgeGrade = 'Grade 4 (C)';
    gradeColor = 'text-orange-400 bg-orange-500/15 border-orange-500/40';
  }

  // Topic Breakdown
  const scatterQuestions = questions.filter((q) => q.topic === 'scatter_diagrams');
  const scatterCorrect = scatterQuestions.filter((q) => userStates[q.id]?.isCorrect).length;

  const moneyQuestions = questions.filter((q) => q.topic === 'managing_money');
  const moneyCorrect = moneyQuestions.filter((q) => userStates[q.id]?.isCorrect).length;

  const missedQuestions = questions.filter((q) => !userStates[q.id]?.isCorrect);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-md">
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-slate-700/80 bg-slate-900 p-6 md:p-8 shadow-2xl text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                IGCSE 0580 Diagnostic Score Report
              </h2>
              <div className="text-xs text-slate-400">
                Topics: Scatter Diagrams & Managing Money
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Score & Grade Banner */}
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 text-center">
            <div className="text-xs text-slate-400 mb-1">Total Marks Awarded</div>
            <div className="font-mono text-3xl font-extrabold text-cyan-400 tabular-nums">
              {totalScore} <span className="text-sm font-normal text-slate-500">/ 30</span>
            </div>
            <div className="text-xs text-slate-400 mt-1">{percentage}% Accuracy</div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 text-center">
            <div className="text-xs text-slate-400 mb-1">First-Attempt Mastery</div>
            <div className="font-mono text-3xl font-extrabold text-indigo-400 tabular-nums">
              {firstAttemptCorrect} <span className="text-sm font-normal text-slate-500">/ 30</span>
            </div>
            <div className="text-xs text-slate-400 mt-1">Zero Retry Needed</div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 text-center">
            <div className="text-xs text-slate-400 mb-1">Estimated Grade</div>
            <div className={`mt-1 inline-block rounded-xl px-3 py-1 font-mono text-sm font-bold border ${gradeColor}`}>
              {cambridgeGrade}
            </div>
            <div className="text-[10px] text-slate-500 mt-1">IGCSE 0580 Benchmark</div>
          </div>
        </div>

        {/* Topic Breakdown Bars */}
        <div className="mt-6 space-y-4">
          <h3 className="text-sm font-semibold text-slate-200">
            Syllabus Topic Performance
          </h3>

          {/* Scatter Diagrams */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
            <div className="flex items-center justify-between text-xs mb-2">
              <div className="flex items-center gap-2 text-white font-medium">
                <TrendingUp className="h-4 w-4 text-cyan-400" />
                <span>Scatter Diagrams (Q1 – Q10)</span>
              </div>
              <span className="font-mono text-cyan-300 font-bold">
                {scatterCorrect} / 10 ({Math.round((scatterCorrect / 10) * 100)}%)
              </span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-500"
                style={{ width: `${(scatterCorrect / 10) * 100}%` }}
              />
            </div>
            <div className="mt-2 text-[11px] text-slate-400">
              Correlation types, line of best fit construction, mean points, interpolation & extrapolation.
            </div>
          </div>

          {/* Managing Money */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
            <div className="flex items-center justify-between text-xs mb-2">
              <div className="flex items-center gap-2 text-white font-medium">
                <DollarSign className="h-4 w-4 text-indigo-400" />
                <span>Managing Money (Q11 – Q30)</span>
              </div>
              <span className="font-mono text-indigo-300 font-bold">
                {moneyCorrect} / 20 ({Math.round((moneyCorrect / 20) * 100)}%)
              </span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-400 transition-all duration-500"
                style={{ width: `${(moneyCorrect / 20) * 100}%` }}
              />
            </div>
            <div className="mt-2 text-[11px] text-slate-400">
              Wages, overtime, tax allowances, simple & compound interest, population growth, depreciation, profit/loss, discounts & hire purchase.
            </div>
          </div>
        </div>

        {/* Missed / Unresolved Questions List */}
        {missedQuestions.length > 0 ? (
          <div className="mt-6 rounded-2xl border border-amber-500/30 bg-amber-950/20 p-4">
            <div className="text-xs font-bold text-amber-300 mb-2 flex items-center gap-1.5">
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Questions to Resolve for 100% Mastery ({missedQuestions.length})</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {missedQuestions.map((q) => {
                const idx = questions.findIndex((item) => item.id === q.id);
                return (
                  <button
                    key={q.id}
                    onClick={() => {
                      onJumpToQuestion(idx);
                      onClose();
                    }}
                    className="rounded-lg bg-amber-500/20 border border-amber-500/40 px-2.5 py-1 font-mono text-xs font-semibold text-amber-200 hover:bg-amber-500/30 transition-colors"
                  >
                    Q{q.id}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-4 text-center text-emerald-300 text-xs">
            🎉 Outstanding! You have successfully resolved all 30 Cambridge IGCSE 0580 questions!
          </div>
        )}

        {/* Footer Actions */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 pt-4">
          <button
            onClick={onResetAll}
            className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 px-3.5 py-2 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset All Progress</span>
          </button>

          <button
            onClick={onClose}
            className="rounded-xl bg-cyan-500 px-5 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition-colors"
          >
            Continue Learning
          </button>
        </div>
      </div>
    </div>
  );
};
