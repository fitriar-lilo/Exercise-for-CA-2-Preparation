import React from 'react';
import { X, BookOpen, CheckCircle, AlertTriangle } from 'lucide-react';

interface FormulaSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FormulaSheetModal: React.FC<FormulaSheetModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
      <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-slate-700/80 bg-slate-900 p-6 shadow-2xl text-slate-100">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <BookOpen className="h-5 w-5 text-cyan-400" />
            <div>
              <h2 className="text-lg font-bold tracking-tight text-white">
                Cambridge IGCSE 0580 Formula Reference Sheet
              </h2>
              <div className="text-xs text-slate-400">
                Core & Extended Syllabus · Scatter Diagrams & Money Management
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

        {/* Content Sections */}
        <div className="mt-6 space-y-6 text-sm">
          {/* Section 1: Scatter Diagrams */}
          <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/20 p-4">
            <h3 className="mb-3 text-base font-semibold text-cyan-300 flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded bg-cyan-500/20 text-xs font-mono text-cyan-400">01</span>
              Topic 1: Scatter Diagrams & Bivariate Data
            </h3>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-lg bg-slate-950/60 p-3 border border-slate-800">
                <div className="font-semibold text-white mb-1">Types of Correlation</div>
                <ul className="space-y-1 text-xs text-slate-300">
                  <li><strong className="text-emerald-400">Positive:</strong> As x increases, y increases (upward trend).</li>
                  <li><strong className="text-rose-400">Negative:</strong> As x increases, y decreases (downward trend).</li>
                  <li><strong className="text-slate-400">Zero / None:</strong> Points scattered randomly, no clear linear trend.</li>
                  <li><strong className="text-cyan-400">Strong vs Weak:</strong> Tightly clustered near line (Strong) vs widely scattered (Weak).</li>
                </ul>
              </div>

              <div className="rounded-lg bg-slate-950/60 p-3 border border-slate-800">
                <div className="font-semibold text-white mb-1">Line of Best Fit Rules</div>
                <ul className="space-y-1 text-xs text-slate-300">
                  <li>Must pass through or very close to the <strong>Mean Point (x̄, ȳ)</strong>:</li>
                  <li className="font-mono text-cyan-300 bg-slate-900 px-2 py-0.5 rounded my-1">
                    x̄ = (∑x) / n,  ȳ = (∑y) / n
                  </li>
                  <li>Balance roughly equal number of points above and below the line.</li>
                  <li>Ignore anomalous <strong>outliers</strong> when positioning the line.</li>
                </ul>
              </div>

              <div className="rounded-lg bg-slate-950/60 p-3 border border-slate-800">
                <div className="font-semibold text-white mb-1">Gradient & Equation</div>
                <div className="font-mono text-cyan-300 bg-slate-900 px-2 py-1 rounded my-1 text-xs">
                  m = (y₂ - y₁) / (x₂ - x₁),  y = mx + c
                </div>
                <div className="text-xs text-slate-400">
                  Gradient represents rate of change: units of y per unit of x.
                </div>
              </div>

              <div className="rounded-lg bg-slate-950/60 p-3 border border-slate-800">
                <div className="font-semibold text-white mb-1">Interpolation vs Extrapolation</div>
                <ul className="space-y-1 text-xs text-slate-300">
                  <li><strong className="text-emerald-400">Interpolation:</strong> Estimating within the data range (Reliable).</li>
                  <li><strong className="text-amber-400">Extrapolation:</strong> Predicting outside the given data range (Unreliable).</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 2: Managing Money */}
          <div className="rounded-xl border border-indigo-500/30 bg-indigo-950/20 p-4">
            <h3 className="mb-3 text-base font-semibold text-indigo-300 flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded bg-indigo-500/20 text-xs font-mono text-indigo-400">02</span>
              Topic 2: Managing Money & Financial Mathematics
            </h3>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-lg bg-slate-950/60 p-3 border border-slate-800">
                <div className="font-semibold text-white mb-1">Earning & Deductions</div>
                <ul className="space-y-1 text-xs text-slate-300">
                  <li><strong>Overtime:</strong> Time-and-a-half = 1.5 × Basic Rate; Double time = 2 × Basic Rate.</li>
                  <li><strong>Taxable Income:</strong> Gross Salary − Tax-Free Allowance.</li>
                  <li><strong>Net Pay (Take-Home):</strong> Gross Pay − Total Deductions (Tax, Pension, Insurance).</li>
                </ul>
              </div>

              <div className="rounded-lg bg-slate-950/60 p-3 border border-slate-800">
                <div className="font-semibold text-white mb-1">Simple Interest Formula</div>
                <div className="font-mono text-indigo-300 bg-slate-900 px-2 py-1 rounded my-1 text-xs">
                  I = (P × R × T) / 100,  Total Amount A = P + I
                </div>
                <div className="text-xs text-slate-400">
                  P = Principal, R = Annual interest rate %, T = Time in years.
                </div>
              </div>

              <div className="rounded-lg bg-slate-950/60 p-3 border border-slate-800">
                <div className="font-semibold text-white mb-1">Compound Interest & Growth</div>
                <div className="font-mono text-indigo-300 bg-slate-900 px-2 py-1 rounded my-1 text-xs">
                  A = P(1 + r/100)ⁿ
                </div>
                <div className="text-xs text-slate-300">
                  Compound Interest Earned = A − P.
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  Semi-annual compounding: A = P(1 + r/200)²ⁿ.
                </div>
              </div>

              <div className="rounded-lg bg-slate-950/60 p-3 border border-slate-800">
                <div className="font-semibold text-white mb-1">Exponential Population & Decay</div>
                <div className="font-mono text-indigo-300 bg-slate-900 px-2 py-1 rounded my-1 text-xs">
                  Growth: Pₙ = P₀(1 + r)ⁿ  |  Decay/Depreciation: Vₙ = V₀(1 − r)ⁿ
                </div>
                <div className="text-xs text-slate-400">
                  Applicable to bacteria decay, town population, and car depreciation.
                </div>
              </div>

              <div className="rounded-lg bg-slate-950/60 p-3 border border-slate-800">
                <div className="font-semibold text-white mb-1">Profit, Loss & Reverse Percentages</div>
                <div className="font-mono text-indigo-300 bg-slate-900 px-2 py-1 rounded my-1 text-xs">
                  % Profit = [(SP − CP) / CP] × 100%
                </div>
                <div className="font-mono text-indigo-300 bg-slate-900 px-2 py-1 rounded my-1 text-xs">
                  Original Price = New Price / (1 ± r/100)
                </div>
                <div className="text-xs text-amber-300/90 flex items-center gap-1 mt-1">
                  <AlertTriangle className="h-3 w-3 shrink-0" />
                  <span>Never divide by Selling Price! Always divide by Cost Price.</span>
                </div>
              </div>

              <div className="rounded-lg bg-slate-950/60 p-3 border border-slate-800">
                <div className="font-semibold text-white mb-1">Hire Purchase Schemes</div>
                <div className="font-mono text-indigo-300 bg-slate-900 px-2 py-1 rounded my-1 text-xs">
                  Total HP Cost = Deposit + (Number of Instalments × Monthly Payment)
                </div>
                <div className="text-xs text-slate-300 mt-1">
                  Extra Paid = Total HP Cost − Cash Price
                </div>
              </div>
            </div>
          </div>

          {/* Cambridge Exam Writing Tips */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <h4 className="font-semibold text-white mb-2 flex items-center gap-1.5 text-xs uppercase tracking-wider text-slate-400">
              <CheckCircle className="h-4 w-4 text-emerald-400" />
              Cambridge 0580 Examination Precision Tips
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-300">
              <li>• Money answers should be rounded to <strong>2 decimal places</strong> (cents/pence), unless giving a whole currency amount.</li>
              <li>• If the question specifies "nearest whole person" or "nearest hundred", strictly round as requested.</li>
              <li>• Always show your working lines in full: formula, numeric substitution, intermediate steps, and final answer with units.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end border-t border-slate-800 pt-4">
          <button
            onClick={onClose}
            className="rounded-xl bg-slate-800 px-5 py-2 font-medium text-white hover:bg-slate-700 transition-colors"
          >
            Close Reference Sheet
          </button>
        </div>
      </div>
    </div>
  );
};
