import React, { useState } from 'react';
import { Calculator as CalcIcon, X, Delete, RotateCcw } from 'lucide-react';

interface BuiltInCalculatorProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BuiltInCalculator: React.FC<BuiltInCalculatorProps> = ({ isOpen, onClose }) => {
  const [display, setDisplay] = useState('0');
  const [history, setHistory] = useState<string[]>([]);
  const [memory, setMemory] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleDigit = (d: string) => {
    if (display === '0' || display === 'Error') {
      setDisplay(d);
    } else {
      setDisplay(display + d);
    }
  };

  const handleOperator = (op: string) => {
    if (display === 'Error') return;
    const lastChar = display.slice(-1);
    if (['+', '-', '*', '/', '^'].includes(lastChar)) {
      setDisplay(display.slice(0, -1) + op);
    } else {
      setDisplay(display + op);
    }
  };

  const handleClear = () => {
    setDisplay('0');
  };

  const handleBackspace = () => {
    if (display.length <= 1 || display === 'Error') {
      setDisplay('0');
    } else {
      setDisplay(display.slice(0, -1));
    }
  };

  const handleEvaluate = () => {
    try {
      // Safely evaluate simple math expressions including ^ power
      let expr = display.replace(/\^/g, '**').replace(/×/g, '*').replace(/÷/g, '/');
      // Sanitize: allow only numbers, +, -, *, /, **, (, ), .
      if (!/^[0-9+\-*/().\s*]+$/.test(expr)) {
        setDisplay('Error');
        return;
      }
      // eslint-disable-next-line no-eval
      const result = Function(`'use strict'; return (${expr})`)();
      if (typeof result === 'number' && !isNaN(result)) {
        const rounded = Number.isInteger(result) ? result.toString() : result.toFixed(4).replace(/\.?0+$/, '');
        setHistory((prev) => [`${display} = ${rounded}`, ...prev.slice(0, 4)]);
        setDisplay(rounded);
      } else {
        setDisplay('Error');
      }
    } catch {
      setDisplay('Error');
    }
  };

  const handlePower = () => {
    handleOperator('^');
  };

  const handleSqrt = () => {
    try {
      const val = parseFloat(display);
      if (val >= 0) {
        const res = Math.sqrt(val);
        const rounded = Number.isInteger(res) ? res.toString() : res.toFixed(4).replace(/\.?0+$/, '');
        setHistory((prev) => [`√(${display}) = ${rounded}`, ...prev.slice(0, 4)]);
        setDisplay(rounded);
      } else {
        setDisplay('Error');
      }
    } catch {
      setDisplay('Error');
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 rounded-2xl border border-slate-700/80 bg-slate-900/95 p-4 shadow-2xl backdrop-blur-xl transition-all">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between border-b border-slate-800 pb-2.5">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
          <CalcIcon className="h-4 w-4 text-cyan-400" />
          <span>IGCSE 0580 Exam Calculator</span>
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          title="Close calculator"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* History tape */}
      <div className="mb-2 h-10 overflow-y-auto text-right text-[11px] font-mono text-slate-400 border-b border-slate-800/50 pb-1">
        {history.length > 0 ? (
          history.map((item, idx) => (
            <div key={idx} className="opacity-75 hover:opacity-100">{item}</div>
          ))
        ) : (
          <span className="text-slate-600">History: e.g. 5000*(1.04)^3</span>
        )}
      </div>

      {/* Screen Display */}
      <div className="mb-3 rounded-xl bg-slate-950/80 p-3 border border-slate-800 text-right">
        <div className="font-mono text-2xl font-bold tracking-wider text-cyan-300 overflow-x-auto whitespace-nowrap">
          {display}
        </div>
      </div>

      {/* Keypad Grid */}
      <div className="grid grid-cols-4 gap-1.5 text-xs font-medium">
        {/* Row 1: Special Math Functions */}
        <button
          onClick={handleClear}
          className="rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30 p-2 font-bold hover:bg-rose-500/30 transition-colors"
        >
          AC
        </button>
        <button
          onClick={handleBackspace}
          className="rounded-lg bg-slate-800 text-slate-300 border border-slate-700 p-2 hover:bg-slate-700 transition-colors flex items-center justify-center"
        >
          <Delete className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={handlePower}
          className="rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 p-2 hover:bg-indigo-500/30 font-mono transition-colors"
          title="Power / Exponent x^y (e.g., (1.04)^3)"
        >
          xʸ
        </button>
        <button
          onClick={() => handleOperator('/')}
          className="rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 p-2 hover:bg-cyan-500/30 font-mono transition-colors"
        >
          ÷
        </button>

        {/* Row 2: 7, 8, 9, * */}
        <button
          onClick={() => handleDigit('7')}
          className="rounded-lg bg-slate-800 text-slate-100 p-2.5 hover:bg-slate-700 font-mono transition-colors"
        >
          7
        </button>
        <button
          onClick={() => handleDigit('8')}
          className="rounded-lg bg-slate-800 text-slate-100 p-2.5 hover:bg-slate-700 font-mono transition-colors"
        >
          8
        </button>
        <button
          onClick={() => handleDigit('9')}
          className="rounded-lg bg-slate-800 text-slate-100 p-2.5 hover:bg-slate-700 font-mono transition-colors"
        >
          9
        </button>
        <button
          onClick={() => handleOperator('*')}
          className="rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 p-2 hover:bg-cyan-500/30 font-mono transition-colors"
        >
          ×
        </button>

        {/* Row 3: 4, 5, 6, - */}
        <button
          onClick={() => handleDigit('4')}
          className="rounded-lg bg-slate-800 text-slate-100 p-2.5 hover:bg-slate-700 font-mono transition-colors"
        >
          4
        </button>
        <button
          onClick={() => handleDigit('5')}
          className="rounded-lg bg-slate-800 text-slate-100 p-2.5 hover:bg-slate-700 font-mono transition-colors"
        >
          5
        </button>
        <button
          onClick={() => handleDigit('6')}
          className="rounded-lg bg-slate-800 text-slate-100 p-2.5 hover:bg-slate-700 font-mono transition-colors"
        >
          6
        </button>
        <button
          onClick={() => handleOperator('-')}
          className="rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 p-2 hover:bg-cyan-500/30 font-mono transition-colors"
        >
          −
        </button>

        {/* Row 4: 1, 2, 3, + */}
        <button
          onClick={() => handleDigit('1')}
          className="rounded-lg bg-slate-800 text-slate-100 p-2.5 hover:bg-slate-700 font-mono transition-colors"
        >
          1
        </button>
        <button
          onClick={() => handleDigit('2')}
          className="rounded-lg bg-slate-800 text-slate-100 p-2.5 hover:bg-slate-700 font-mono transition-colors"
        >
          2
        </button>
        <button
          onClick={() => handleDigit('3')}
          className="rounded-lg bg-slate-800 text-slate-100 p-2.5 hover:bg-slate-700 font-mono transition-colors"
        >
          3
        </button>
        <button
          onClick={() => handleOperator('+')}
          className="rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 p-2 hover:bg-cyan-500/30 font-mono transition-colors"
        >
          +
        </button>

        {/* Row 5: 0, ., (, ) */}
        <button
          onClick={() => handleDigit('0')}
          className="rounded-lg bg-slate-800 text-slate-100 p-2.5 hover:bg-slate-700 font-mono transition-colors"
        >
          0
        </button>
        <button
          onClick={() => handleDigit('.')}
          className="rounded-lg bg-slate-800 text-slate-100 p-2.5 hover:bg-slate-700 font-mono transition-colors"
        >
          .
        </button>
        <button
          onClick={() => handleDigit('(')}
          className="rounded-lg bg-slate-800 text-slate-300 p-2.5 hover:bg-slate-700 font-mono transition-colors"
        >
          (
        </button>
        <button
          onClick={() => handleDigit(')')}
          className="rounded-lg bg-slate-800 text-slate-300 p-2.5 hover:bg-slate-700 font-mono transition-colors"
        >
          )
        </button>
      </div>

      {/* Row 6: Equals & Fast Formulas */}
      <div className="mt-2 flex gap-2">
        <button
          onClick={handleSqrt}
          className="flex-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 py-2 text-xs font-mono hover:bg-slate-700 transition-colors"
        >
          √x
        </button>
        <button
          onClick={handleEvaluate}
          className="flex-[2] rounded-lg bg-cyan-500 text-slate-950 font-bold py-2 text-sm hover:bg-cyan-400 transition-all shadow-md shadow-cyan-500/25 active:scale-95"
        >
          =
        </button>
      </div>
    </div>
  );
};
