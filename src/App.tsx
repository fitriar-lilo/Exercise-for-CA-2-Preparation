import React, { useState, useEffect } from 'react';
import { QUESTIONS_DATA } from './data/questions';
import { UserAnswerState, ThemeMode, TopicType } from './types';
import { Header } from './components/Header';
import { QuestionCard } from './components/QuestionCard';
import { QuestionNavigator } from './components/QuestionNavigator';
import { FormulaSheetModal } from './components/FormulaSheetModal';
import { BuiltInCalculator } from './components/BuiltInCalculator';
import { ScratchpadModal } from './components/ScratchpadModal';
import { SummaryModal } from './components/SummaryModal';
import { BookOpen, Calculator, Award, Lightbulb, CheckCircle2, TrendingUp, DollarSign } from 'lucide-react';

const STORAGE_KEY = 'igcse_0580_review_progress_v1';

export default function App() {
  const questions = QUESTIONS_DATA;
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [theme, setTheme] = useState<ThemeMode>('cosmic');
  const [activeFilter, setActiveFilter] = useState<'all' | TopicType | 'needs_retry' | 'flagged'>('all');

  // Modals state
  const [isFormulaOpen, setIsFormulaOpen] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isScratchpadOpen, setIsScratchpadOpen] = useState(false);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);

  // Initialize or load user progress
  const [userStates, setUserStates] = useState<Record<number, UserAnswerState>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }

    const initial: Record<number, UserAnswerState> = {};
    questions.forEach((q) => {
      initial[q.id] = {
        selectedOption: null,
        attempts: [],
        isCorrect: false,
        scoreAwarded: 0,
        firstAttemptCorrect: false,
        hintViewed: false,
        solutionViewed: false,
        flaggedForReview: false,
      };
    });
    return initial;
  });

  // Persist to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userStates));
    } catch {
      // ignore
    }
  }, [userStates]);

  const currentQuestion = questions[currentIndex];
  const currentState = userStates[currentQuestion.id] || {
    selectedOption: null,
    attempts: [],
    isCorrect: false,
    scoreAwarded: 0,
    firstAttemptCorrect: false,
    hintViewed: false,
    solutionViewed: false,
    flaggedForReview: false,
  };

  const totalScore = Object.values(userStates).filter((s) => s.isCorrect).length;

  // Handle Option Selection
  const handleSelectOption = (optionId: 'A' | 'B' | 'C' | 'D') => {
    setUserStates((prev) => {
      const existing = prev[currentQuestion.id];
      const isAlreadyCorrect = existing.isCorrect;
      const isThisCorrect = optionId === currentQuestion.correctOption;
      const attempts = existing.attempts.includes(optionId)
        ? existing.attempts
        : [...existing.attempts, optionId];
      const isFirstAttempt = existing.attempts.length === 0;

      return {
        ...prev,
        [currentQuestion.id]: {
          ...existing,
          selectedOption: optionId,
          attempts,
          isCorrect: isThisCorrect || isAlreadyCorrect,
          scoreAwarded: (isThisCorrect || isAlreadyCorrect) ? 1 : 0,
          firstAttemptCorrect: isFirstAttempt && isThisCorrect,
        },
      };
    });
  };

  // Handle Retry Reset
  const handleRetryQuestion = () => {
    setUserStates((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        ...prev[currentQuestion.id],
        selectedOption: null,
        attempts: [],
        isCorrect: false,
        scoreAwarded: 0,
        firstAttemptCorrect: false,
      },
    }));
  };

  // Handle Toggle Flag
  const handleToggleFlag = () => {
    setUserStates((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        ...prev[currentQuestion.id],
        flaggedForReview: !prev[currentQuestion.id].flaggedForReview,
      },
    }));
  };

  // Reset entire test
  const handleResetAll = () => {
    if (window.confirm('Are you sure you want to reset all 30 questions and start fresh?')) {
      const resetMap: Record<number, UserAnswerState> = {};
      questions.forEach((q) => {
        resetMap[q.id] = {
          selectedOption: null,
          attempts: [],
          isCorrect: false,
          scoreAwarded: 0,
          firstAttemptCorrect: false,
          hintViewed: false,
          solutionViewed: false,
          flaggedForReview: false,
        };
      });
      setUserStates(resetMap);
      setCurrentIndex(0);
      setIsSummaryOpen(false);
    }
  };

  // Navigation handlers
  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleJumpToIndex = (idx: number) => {
    setCurrentIndex(idx);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Theme background styles
  const themeBackgrounds: Record<ThemeMode, string> = {
    cosmic:
      'bg-radial-[at_top_right] from-indigo-950/60 via-slate-950 to-slate-950 text-slate-100',
    emerald:
      'bg-radial-[at_top_left] from-emerald-950/50 via-slate-950 to-slate-950 text-slate-100',
    amber:
      'bg-radial-[at_top] from-amber-950/40 via-slate-950 to-slate-950 text-slate-100',
    blueprint:
      'bg-radial-[at_top_right] from-blue-950/50 via-slate-950 to-slate-950 text-slate-100',
  };

  return (
    <div className={`min-h-screen ${themeBackgrounds[theme]} transition-colors duration-500 font-sans`}>
      {/* Top Header */}
      <Header
        currentScore={totalScore}
        totalQuestions={questions.length}
        theme={theme}
        onThemeChange={setTheme}
        onOpenSummary={() => setIsSummaryOpen(true)}
        onOpenFormula={() => setIsFormulaOpen(true)}
        onOpenCalculator={() => setIsCalculatorOpen(true)}
        onFilterTopic={(topic) => {
          setActiveFilter(topic);
          const firstInTopic = questions.findIndex(
            (q) => topic === 'all' || q.topic === topic
          );
          if (firstInTopic !== -1) {
            setCurrentIndex(firstInTopic);
          }
        }}
      />

      {/* Main Container */}
      <main className="mx-auto max-w-6xl px-4 py-8 md:py-10 space-y-8">
        {/* Hero Banner / Course Overview */}
        <div className="rounded-3xl border border-slate-700/60 bg-slate-900/60 p-6 md:p-8 backdrop-blur-xl shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400 font-mono">
                <span>Cambridge Assessment International Education</span>
                <span>·</span>
                <span>IGCSE Mathematics 0580</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
                Interactive Exam Review: Scatter Diagrams & Managing Money
              </h1>
              <p className="text-sm text-slate-300 leading-relaxed">
                Master 30 syllabus-aligned multiple choice questions. Receive instant step-by-step Cambridge mark scheme solutions, hints, and resolve each problem until full mastery!
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setIsFormulaOpen(true)}
                className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition-all shadow-md"
              >
                <BookOpen className="h-4 w-4 text-emerald-400" />
                <span>Formula Sheet</span>
              </button>

              <button
                onClick={() => setIsCalculatorOpen(true)}
                className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition-all shadow-md"
              >
                <Calculator className="h-4 w-4 text-cyan-400" />
                <span>Exam Calculator</span>
              </button>

              <button
                onClick={() => setIsSummaryOpen(true)}
                className="flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2.5 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition-all shadow-md shadow-cyan-500/20"
              >
                <Award className="h-4 w-4" />
                <span>Score Breakdown</span>
              </button>
            </div>
          </div>

          {/* Quick Syllabus Topics Badges */}
          <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-slate-800/80 pt-4 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4 text-cyan-400" />
              <span><strong>Topic 1 (Q1–Q10):</strong> Types of Correlation, Lines of Best Fit, Outliers, Mean Point (x̄, ȳ)</span>
            </div>
            <span className="hidden md:inline text-slate-700">|</span>
            <div className="flex items-center gap-1.5">
              <DollarSign className="h-4 w-4 text-indigo-400" />
              <span><strong>Topic 2 (Q11–Q30):</strong> Wages, Overtime, Deductions, Simple & Compound Interest, Decay, Discounts</span>
            </div>
          </div>
        </div>

        {/* Active Question Viewer */}
        <QuestionCard
          question={currentQuestion}
          userState={currentState}
          onSelectOption={handleSelectOption}
          onRetry={handleRetryQuestion}
          onToggleFlag={handleToggleFlag}
          onNext={handleNext}
          onPrev={handlePrev}
          currentIndex={currentIndex}
          totalQuestions={questions.length}
          theme={theme}
          onOpenCalculator={() => setIsCalculatorOpen(true)}
          onOpenScratchpad={() => setIsScratchpadOpen(true)}
        />

        {/* 30-Question Navigator & Progress Matrix */}
        <QuestionNavigator
          questions={questions}
          userStates={userStates}
          currentIndex={currentIndex}
          onSelectIndex={handleJumpToIndex}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
      </main>

      {/* Modals & Tools */}
      <FormulaSheetModal
        isOpen={isFormulaOpen}
        onClose={() => setIsFormulaOpen(false)}
      />

      <BuiltInCalculator
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
      />

      <ScratchpadModal
        isOpen={isScratchpadOpen}
        onClose={() => setIsScratchpadOpen(false)}
        questionId={currentQuestion.id}
      />

      <SummaryModal
        isOpen={isSummaryOpen}
        onClose={() => setIsSummaryOpen(false)}
        questions={questions}
        userStates={userStates}
        onJumpToQuestion={handleJumpToIndex}
        onResetAll={handleResetAll}
      />

      {/* Quiet Footer */}
      <footer className="mt-16 border-t border-slate-800/80 bg-slate-950/80 px-6 py-6 text-center text-xs text-slate-500">
        <p>Cambridge IGCSE 0580 Mathematics · Scatter Diagrams & Money Management Digital Interactive Review</p>
      </footer>
    </div>
  );
}
