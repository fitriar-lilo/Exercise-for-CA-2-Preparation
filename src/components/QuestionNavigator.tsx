import React from 'react';
import { Question, UserAnswerState, TopicType } from '../types';
import { Check, RotateCcw, Flag, Circle, Filter } from 'lucide-react';

interface QuestionNavigatorProps {
  questions: Question[];
  userStates: Record<number, UserAnswerState>;
  currentIndex: number;
  onSelectIndex: (index: number) => void;
  activeFilter: 'all' | TopicType | 'needs_retry' | 'flagged';
  onFilterChange: (filter: 'all' | TopicType | 'needs_retry' | 'flagged') => void;
}

export const QuestionNavigator: React.FC<QuestionNavigatorProps> = ({
  questions,
  userStates,
  currentIndex,
  onSelectIndex,
  activeFilter,
  onFilterChange,
}) => {
  // Filter questions based on selection
  const filteredQuestions = questions.filter((q) => {
    const state = userStates[q.id];
    if (activeFilter === 'all') return true;
    if (activeFilter === 'scatter_diagrams') return q.topic === 'scatter_diagrams';
    if (activeFilter === 'managing_money') return q.topic === 'managing_money';
    if (activeFilter === 'needs_retry') {
      return state && state.attempts.length > 0 && !state.isCorrect;
    }
    if (activeFilter === 'flagged') {
      return state && state.flaggedForReview;
    }
    return true;
  });

  // Calculate statistics
  const totalCorrect = questions.filter((q) => userStates[q.id]?.isCorrect).length;
  const scatterCorrect = questions
    .filter((q) => q.topic === 'scatter_diagrams' && userStates[q.id]?.isCorrect).length;
  const moneyCorrect = questions
    .filter((q) => q.topic === 'managing_money' && userStates[q.id]?.isCorrect).length;
  const retryNeededCount = questions
    .filter((q) => userStates[q.id]?.attempts.length > 0 && !userStates[q.id]?.isCorrect).length;
  const flaggedCount = questions
    .filter((q) => userStates[q.id]?.flaggedForReview).length;

  return (
    <div className="rounded-3xl border border-slate-700/60 bg-slate-900/90 p-5 shadow-2xl backdrop-blur-md">
      {/* Header and Filter Tabs */}
      <div className="mb-4 flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight">
            Question Matrix & Progress
          </h3>
          <div className="text-xs text-slate-400">
            Total Score: <strong className="text-cyan-400 font-mono text-sm">{totalCorrect}</strong> / 30 marks
            <span className="mx-2 text-slate-600">·</span>
            Scatter: <strong className="text-emerald-400 font-mono">{scatterCorrect}/10</strong>
            <span className="mx-2 text-slate-600">·</span>
            Money: <strong className="text-indigo-400 font-mono">{moneyCorrect}/20</strong>
          </div>
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-950/70 rounded-xl border border-slate-800/80 text-xs">
          <button
            onClick={() => onFilterChange('all')}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${
              activeFilter === 'all'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All (30)
          </button>
          <button
            onClick={() => onFilterChange('scatter_diagrams')}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${
              activeFilter === 'scatter_diagrams'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Scatter (10)
          </button>
          <button
            onClick={() => onFilterChange('managing_money')}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${
              activeFilter === 'managing_money'
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Money (20)
          </button>
          {retryNeededCount > 0 && (
            <button
              onClick={() => onFilterChange('needs_retry')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1 ${
                activeFilter === 'needs_retry'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                  : 'text-rose-400 hover:text-rose-300'
              }`}
            >
              <RotateCcw className="h-3 w-3" />
              <span>Retry ({retryNeededCount})</span>
            </button>
          )}
          {flaggedCount > 0 && (
            <button
              onClick={() => onFilterChange('flagged')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1 ${
                activeFilter === 'flagged'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-amber-400 hover:text-amber-300'
              }`}
            >
              <Flag className="h-3 w-3" />
              <span>Flagged ({flaggedCount})</span>
            </button>
          )}
        </div>
      </div>

      {/* 30 Questions Grid */}
      <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-2">
        {filteredQuestions.map((q) => {
          const originalIdx = questions.findIndex((item) => item.id === q.id);
          const state = userStates[q.id];
          const isCurrent = originalIdx === currentIndex;
          const isCorrect = state?.isCorrect;
          const hasFailedAttempt = state?.attempts.length > 0 && !isCorrect;
          const isFlagged = state?.flaggedForReview;

          let btnBg = 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-700';
          if (isCorrect) {
            btnBg = 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-bold';
          } else if (hasFailedAttempt) {
            btnBg = 'bg-rose-500/20 border-rose-500/50 text-rose-300 font-bold';
          }

          if (isCurrent) {
            btnBg += ' ring-2 ring-cyan-400 ring-offset-2 ring-offset-slate-900';
          }

          return (
            <button
              key={q.id}
              onClick={() => onSelectIndex(originalIdx)}
              className={`group relative flex flex-col items-center justify-center rounded-xl border p-2 text-xs transition-all active:scale-95 ${btnBg}`}
            >
              <div className="flex items-center gap-1 font-mono font-semibold">
                <span>{q.id}</span>
                {isCorrect && <Check className="h-3 w-3 text-emerald-400 stroke-[3]" />}
                {hasFailedAttempt && <RotateCcw className="h-3 w-3 text-rose-400" />}
              </div>

              {/* Little flagged dot */}
              {isFlagged && (
                <div className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-amber-400" />
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-800 pt-3 text-[11px] text-slate-400">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <span>Solved (+1)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
            <span>Retry Needed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-slate-600" />
            <span>Unattempted</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
            <span>Flagged</span>
          </div>
        </div>

        <div className="font-mono text-cyan-400">
          Click any number to jump
        </div>
      </div>
    </div>
  );
};
