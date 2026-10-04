import React, { useState } from 'react';
import { Question, UserAnswerState, ThemeMode } from '../types';
import { ScatterPlot } from './ScatterPlot';
import confetti from 'canvas-confetti';
import {
  Lightbulb,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Flag,
  HelpCircle,
  FileText,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Calculator as CalcIcon,
  PenLine,
} from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  userState: UserAnswerState;
  onSelectOption: (optionId: 'A' | 'B' | 'C' | 'D') => void;
  onRetry: () => void;
  onToggleFlag: () => void;
  onNext: () => void;
  onPrev: () => void;
  currentIndex: number;
  totalQuestions: number;
  theme: ThemeMode;
  onOpenCalculator: () => void;
  onOpenScratchpad: () => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  userState,
  onSelectOption,
  onRetry,
  onToggleFlag,
  onNext,
  onPrev,
  currentIndex,
  totalQuestions,
  theme,
  onOpenCalculator,
  onOpenScratchpad,
}) => {
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  const handleOptionClick = (optionId: 'A' | 'B' | 'C' | 'D') => {
    // If already correct, student can still review
    onSelectOption(optionId);

    // If correct, fire celebratory confetti
    if (optionId === question.correctOption) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#06b6d4', '#10b981', '#6366f1', '#f59e0b'],
      });
      setShowSolution(true);
    }
  };

  const isAnswered = userState.selectedOption !== null;
  const isCorrect = userState.isCorrect;
  const hasFailedAttempt = userState.attempts.length > 0 && !isCorrect;

  return (
    <div className="relative mx-auto w-full max-w-4xl space-y-6">
      {/* Top Question Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-700/60 bg-slate-900/90 px-5 py-3.5 shadow-lg backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex h-8 items-center rounded-lg bg-indigo-500/20 px-3 font-mono text-xs font-bold text-indigo-300 border border-indigo-500/30">
            Q{question.id} of {totalQuestions}
          </div>

          <div className="text-xs text-slate-400">
            <span className="font-semibold text-slate-200">
              {question.topic === 'scatter_diagrams' ? 'Scatter Diagrams' : 'Managing Money'}
            </span>
            <span className="mx-1.5 text-slate-600">·</span>
            <span>{question.cambridgeReference}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Scratchpad Quick Button */}
          <button
            onClick={onOpenScratchpad}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:border-slate-600 hover:text-white transition-colors"
            title="Open scratchpad for this question"
          >
            <PenLine className="h-3.5 w-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Scratchpad</span>
          </button>

          {/* Calculator Quick Button */}
          <button
            onClick={onOpenCalculator}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:border-slate-600 hover:text-white transition-colors"
            title="Open scientific & financial calculator"
          >
            <CalcIcon className="h-3.5 w-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Calculator</span>
          </button>

          {/* Flag For Review */}
          <button
            onClick={onToggleFlag}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all ${
              userState.flaggedForReview
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-700'
            }`}
            title="Flag this question to review later"
          >
            <Flag className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">
              {userState.flaggedForReview ? 'Flagged' : 'Flag'}
            </span>
          </button>
        </div>
      </div>

      {/* Main Question Body Card */}
      <div className="rounded-3xl border border-slate-700/60 bg-slate-900/90 p-6 md:p-8 shadow-2xl backdrop-blur-md">
        {/* Question Header */}
        <div className="mb-4">
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white mb-2">
            {question.title}
          </h2>
          <div className="text-base text-slate-200 leading-relaxed whitespace-pre-line font-medium">
            {question.questionText}
          </div>
        </div>

        {/* Data Table (if question includes structured table) */}
        {question.tableData && (
          <div className="my-5 overflow-x-auto rounded-xl border border-slate-700 bg-slate-950/60 p-3">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono">
                  {question.tableData.headers.map((h, i) => (
                    <th key={i} className="pb-2 px-3 font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {question.tableData.rows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-slate-800/40 transition-colors">
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="py-2 px-3 text-slate-200 tabular-nums">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Interactive Scatter Plot Component (for Scatter questions) */}
        {question.scatterPlot && (
          <div className="my-6">
            <ScatterPlot config={question.scatterPlot} theme={theme} />
          </div>
        )}

        {/* Multiple Choice Options (A, B, C, D) */}
        <div className="mt-6 space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Select one answer option:
          </div>

          <div className="grid gap-3 sm:grid-cols-1">
            {question.options.map((option) => {
              const isSelected = userState.selectedOption === option.id;
              const hasAttemptedThis = userState.attempts.includes(option.id);
              const isThisCorrect = option.id === question.correctOption;

              // Compute border and background based on state
              let containerStyle =
                'border-slate-700/80 bg-slate-800/40 hover:bg-slate-800 hover:border-slate-600 text-slate-200';
              let badgeStyle = 'bg-slate-800 text-slate-300 border-slate-700';

              if (isCorrect && isThisCorrect) {
                containerStyle =
                  'border-emerald-500/70 bg-emerald-500/15 text-white ring-1 ring-emerald-500/30';
                badgeStyle = 'bg-emerald-500 text-slate-950 font-bold border-emerald-400';
              } else if (hasAttemptedThis && !isThisCorrect) {
                containerStyle =
                  'border-rose-500/60 bg-rose-500/10 text-rose-200 opacity-80';
                badgeStyle = 'bg-rose-500/30 text-rose-300 border-rose-500/50';
              } else if (isSelected) {
                containerStyle =
                  'border-cyan-500/80 bg-cyan-500/15 text-white ring-1 ring-cyan-500/30';
                badgeStyle = 'bg-cyan-500 text-slate-950 font-bold border-cyan-400';
              }

              return (
                <button
                  key={option.id}
                  onClick={() => handleOptionClick(option.id)}
                  className={`group relative flex items-center gap-4 rounded-2xl border p-4 text-left transition-all ${containerStyle} active:scale-[0.99]`}
                >
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border text-sm font-bold transition-all ${badgeStyle}`}
                  >
                    {option.id}
                  </div>

                  <div className="flex-1 text-sm md:text-base font-medium">
                    {option.text}
                  </div>

                  {/* Status Indicator Icon */}
                  {isCorrect && isThisCorrect && (
                    <div className="flex items-center gap-1 text-emerald-400 text-xs font-semibold">
                      <CheckCircle2 className="h-5 w-5 shrink-0" />
                      <span className="hidden sm:inline">Correct</span>
                    </div>
                  )}

                  {hasAttemptedThis && !isThisCorrect && (
                    <div className="flex items-center gap-1 text-rose-400 text-xs font-semibold">
                      <XCircle className="h-5 w-5 shrink-0" />
                      <span className="hidden sm:inline">Incorrect</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Resolution Feedback Banner */}
        <div className="mt-6">
          {isCorrect ? (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-2xl border border-emerald-500/40 bg-emerald-950/30 p-4 text-emerald-300">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-bold text-white text-base">
                    Excellent! Correct Answer (+1 Mark)
                  </div>
                  <div className="text-xs text-emerald-200/80">
                    {userState.attempts.length === 1
                      ? 'Solved perfectly on your first attempt!'
                      : `Successfully resolved after ${userState.attempts.length} attempts.`}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowSolution(!showSolution)}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-500/20 px-3.5 py-2 text-xs font-semibold text-emerald-200 hover:bg-emerald-500/30 transition-colors border border-emerald-500/30"
              >
                <FileText className="h-4 w-4" />
                <span>{showSolution ? 'Hide Solution' : 'View Detail Steps'}</span>
                {showSolution ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
              </button>
            </div>
          ) : hasFailedAttempt ? (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-2xl border border-rose-500/40 bg-rose-950/30 p-4 text-rose-300">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-500/20 text-rose-400">
                  <RotateCcw className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-bold text-white text-base">
                    Not quite right! You can resolve until correct.
                  </div>
                  <div className="text-xs text-rose-200/80">
                    Try another option above or click the Hint below for guidance!
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowHint(true)}
                  className="flex items-center gap-1.5 rounded-xl bg-amber-500/20 px-3 py-2 text-xs font-semibold text-amber-200 hover:bg-amber-500/30 transition-colors border border-amber-500/30"
                >
                  <Lightbulb className="h-4 w-4" />
                  <span>Open Hint</span>
                </button>
              </div>
            </div>
          ) : null}
        </div>

        {/* Hint Accordion */}
        <div className="mt-4">
          <button
            onClick={() => setShowHint(!showHint)}
            className="flex items-center gap-2 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
          >
            <Lightbulb className="h-4 w-4 text-amber-400" />
            <span>{showHint ? 'Hide Cambridge Hint' : 'Need help? Show Cambridge Examiner Hint'}</span>
            {showHint ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </button>

          {showHint && (
            <div className="mt-3 rounded-2xl border border-amber-500/30 bg-amber-950/20 p-5 text-sm text-amber-100/90 space-y-3">
              <div className="font-bold text-amber-300 text-sm flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-amber-400" />
                <span>{question.hint.title}</span>
              </div>

              <ul className="space-y-1.5 text-xs text-slate-300">
                {question.hint.steps.map((st, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="font-mono text-amber-400 font-bold shrink-0">{i + 1}.</span>
                    <span>{st}</span>
                  </li>
                ))}
              </ul>

              {question.hint.keyFormula && (
                <div className="rounded-xl bg-slate-950/80 p-2.5 font-mono text-xs text-amber-300 border border-amber-500/20">
                  Key Formula: {question.hint.keyFormula}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Detailed Cambridge Step-by-Step Mark Scheme Solution */}
        {showSolution && (
          <div className="mt-5 rounded-2xl border border-cyan-500/30 bg-slate-950/90 p-6 text-sm text-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-cyan-400" />
                <span className="font-bold text-white text-base">
                  Cambridge IGCSE 0580 Mark Scheme Solution
                </span>
              </div>
              <span className="font-mono text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/30">
                Correct: {question.correctOption}
              </span>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Detailed Working Steps:
              </div>
              <div className="space-y-2">
                {question.solution.stepByStep.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs md:text-sm text-slate-300">
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-cyan-500/20 text-[10px] font-mono font-bold text-cyan-300">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {question.solution.examinerTip && (
              <div className="rounded-xl border border-indigo-500/30 bg-indigo-950/20 p-3.5 text-xs text-indigo-200">
                <strong className="text-indigo-300">Examiner Advice & Common Pitfalls: </strong>
                <span>{question.solution.examinerTip}</span>
              </div>
            )}
          </div>
        )}

        {/* Bottom Navigation Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 pt-5">
          <button
            onClick={onPrev}
            disabled={currentIndex === 0}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
              currentIndex === 0
                ? 'opacity-40 cursor-not-allowed text-slate-600 bg-slate-900'
                : 'bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Previous Question</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onRetry}
              className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-2 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset Attempts</span>
            </button>

            <button
              onClick={onNext}
              disabled={currentIndex === totalQuestions - 1}
              className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all ${
                currentIndex === totalQuestions - 1
                  ? 'opacity-40 cursor-not-allowed text-slate-600 bg-slate-900'
                  : 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-md shadow-cyan-500/20'
              }`}
            >
              <span>Next Question</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
