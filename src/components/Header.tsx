import React from 'react';
import { ThemeMode } from '../types';
import { Palette, Award, BookOpen, Calculator, Sparkles } from 'lucide-react';

interface HeaderProps {
  currentScore: number;
  totalQuestions: number;
  theme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
  onOpenSummary: () => void;
  onOpenFormula: () => void;
  onOpenCalculator: () => void;
  onFilterTopic: (topic: 'all' | 'scatter_diagrams' | 'managing_money') => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentScore,
  totalQuestions,
  theme,
  onThemeChange,
  onOpenSummary,
  onOpenFormula,
  onOpenCalculator,
  onFilterTopic,
}) => {
  const themeLabels: Record<ThemeMode, { name: string; dot: string }> = {
    cosmic: { name: 'Cosmic Sky', dot: 'bg-cyan-400' },
    emerald: { name: 'Emerald Focus', dot: 'bg-emerald-400' },
    amber: { name: 'Sunset Glow', dot: 'bg-amber-400' },
    blueprint: { name: 'Blueprint Math', dot: 'bg-blue-400' },
  };

  const nextTheme: Record<ThemeMode, ThemeMode> = {
    cosmic: 'emerald',
    emerald: 'amber',
    amber: 'blueprint',
    blueprint: 'cosmic',
  };

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-800/80 bg-slate-900/90 px-6 py-4 backdrop-blur-xl">
      {/* Zone 1: Single text element wordmark */}
      <a
        href="/"
        onClick={(e) => {
          e.preventDefault();
          onFilterTopic('all');
        }}
        className="text-lg font-extrabold tracking-tight text-white hover:text-cyan-300 transition-colors"
      >
        IGCSE 0580 Master
      </a>

      {/* Zone 2: 4-6 clean text navigation links */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
        <button
          onClick={() => onFilterTopic('scatter_diagrams')}
          className="hover:text-cyan-300 transition-colors whitespace-nowrap"
        >
          Scatter Diagrams
        </button>
        <button
          onClick={() => onFilterTopic('managing_money')}
          className="hover:text-indigo-300 transition-colors whitespace-nowrap"
        >
          Managing Money
        </button>
        <button
          onClick={onOpenFormula}
          className="hover:text-emerald-300 transition-colors whitespace-nowrap"
        >
          Formula Sheet
        </button>
        <button
          onClick={onOpenCalculator}
          className="hover:text-amber-300 transition-colors whitespace-nowrap"
        >
          Exam Calculator
        </button>
        <button
          onClick={onOpenSummary}
          className="hover:text-cyan-300 transition-colors whitespace-nowrap"
        >
          Diagnostic Report
        </button>
      </nav>

      {/* Zone 3: 1-2 primary actions */}
      <div className="flex items-center gap-3">
        {/* Eye-Comfort Theme Cycler */}
        <button
          onClick={() => onThemeChange(nextTheme[theme])}
          className="flex items-center gap-2 rounded-xl border border-slate-700/80 bg-slate-800/70 px-3 py-1.5 text-xs font-medium text-slate-200 hover:border-slate-600 hover:bg-slate-800 transition-all whitespace-nowrap"
          title="Switch eye-comfort color theme"
        >
          <span className={`h-2.5 w-2.5 rounded-full ${themeLabels[theme].dot}`} />
          <span className="hidden sm:inline">{themeLabels[theme].name}</span>
        </button>

        {/* Diagnostic Score Button */}
        <button
          onClick={onOpenSummary}
          className="flex items-center gap-2 rounded-xl bg-cyan-500 px-3.5 py-1.5 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition-all shadow-md shadow-cyan-500/20 whitespace-nowrap"
        >
          <Award className="h-4 w-4" />
          <span>{currentScore}/{totalQuestions} Marks</span>
        </button>
      </div>
    </header>
  );
};
