import React, { useState } from 'react';
import { ScatterPlotConfig, ScatterDataPoint } from '../types';
import { Eye, EyeOff, Crosshair, HelpCircle } from 'lucide-react';

interface ScatterPlotProps {
  config: ScatterPlotConfig;
  theme: string;
}

export const ScatterPlot: React.FC<ScatterPlotProps> = ({ config, theme }) => {
  const [showLineOfBestFit, setShowLineOfBestFit] = useState(true);
  const [showMeanPoint, setShowMeanPoint] = useState(false);
  const [hoveredPoint, setHoveredPoint] = useState<ScatterDataPoint | null>(null);

  // SVG dimensions & padding
  const svgWidth = 560;
  const svgHeight = 360;
  const padding = { top: 30, right: 35, bottom: 55, left: 65 };
  const plotWidth = svgWidth - padding.left - padding.right;
  const plotHeight = svgHeight - padding.top - padding.bottom;

  // Scale mapping functions
  const scaleX = (x: number) => {
    return padding.left + ((x - config.xMin) / (config.xMax - config.xMin)) * plotWidth;
  };

  const scaleY = (y: number) => {
    return padding.top + plotHeight - ((y - config.yMin) / (config.yMax - config.yMin)) * plotHeight;
  };

  // Generate grid ticks
  const xTicks: number[] = [];
  for (let x = config.xMin; x <= config.xMax + 0.0001; x += config.xStep) {
    xTicks.push(Number(x.toFixed(2)));
  }

  const yTicks: number[] = [];
  for (let y = config.yMin; y <= config.yMax + 0.0001; y += config.yStep) {
    yTicks.push(Number(y.toFixed(2)));
  }

  // Calculate mean point if not explicitly given
  const meanX = config.meanPoint
    ? config.meanPoint.x
    : Number((config.points.reduce((acc, p) => acc + p.x, 0) / config.points.length).toFixed(2));
  const meanY = config.meanPoint
    ? config.meanPoint.y
    : Number((config.points.reduce((acc, p) => acc + p.y, 0) / config.points.length).toFixed(2));

  return (
    <div className="rounded-xl border border-slate-700/60 bg-slate-900/80 p-4 shadow-xl backdrop-blur-sm">
      {/* Top Diagram Controls */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2.5 text-xs">
        <div className="flex items-center gap-2 text-slate-300 font-medium">
          <Crosshair className="h-4 w-4 text-cyan-400" />
          <span>Interactive IGCSE Coordinate Graph</span>
          <span className="text-slate-500">· Hover on points to inspect</span>
        </div>

        <div className="flex items-center gap-2">
          {config.lineOfBestFit && (
            <button
              onClick={() => setShowLineOfBestFit(!showLineOfBestFit)}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-medium transition-all ${
                showLineOfBestFit
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700'
              }`}
            >
              {showLineOfBestFit ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
              <span>Line of Best Fit</span>
            </button>
          )}

          <button
            onClick={() => setShowMeanPoint(!showMeanPoint)}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-medium transition-all ${
              showMeanPoint
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700'
            }`}
          >
            <Crosshair className="h-3.5 w-3.5" />
            <span>Mean (x̄, ȳ)</span>
          </button>
        </div>
      </div>

      {/* Main SVG Coordinate Graph */}
      <div className="relative flex justify-center overflow-x-auto">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full max-w-[560px] select-none"
          style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.4))' }}
        >
          <defs>
            {/* Grid background pattern */}
            <pattern id="math-grid-small" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="0.5" />
            </pattern>

            {/* Glowing filter for best fit line */}
            <filter id="cyan-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Plot Background Area */}
          <rect
            x={padding.left}
            y={padding.top}
            width={plotWidth}
            height={plotHeight}
            fill="#090d16"
            stroke="#1e293b"
            strokeWidth="1"
            rx="4"
          />
          <rect
            x={padding.left}
            y={padding.top}
            width={plotWidth}
            height={plotHeight}
            fill="url(#math-grid-small)"
          />

          {/* Grid lines: Horizontal */}
          {yTicks.map((yVal) => {
            const yPos = scaleY(yVal);
            return (
              <g key={`y-grid-${yVal}`}>
                <line
                  x1={padding.left}
                  y1={yPos}
                  x2={padding.left + plotWidth}
                  y2={yPos}
                  stroke="rgba(148, 163, 184, 0.15)"
                  strokeWidth="1"
                  strokeDasharray={yVal === 0 ? undefined : '2,2'}
                />
                <text
                  x={padding.left - 10}
                  y={yPos + 4}
                  textAnchor="end"
                  className="fill-slate-400 font-mono text-[11px] tabular-nums"
                >
                  {yVal}
                </text>
              </g>
            );
          })}

          {/* Grid lines: Vertical */}
          {xTicks.map((xVal) => {
            const xPos = scaleX(xVal);
            return (
              <g key={`x-grid-${xVal}`}>
                <line
                  x1={xPos}
                  y1={padding.top}
                  x2={xPos}
                  y2={padding.top + plotHeight}
                  stroke="rgba(148, 163, 184, 0.15)"
                  strokeWidth="1"
                  strokeDasharray={xVal === 0 ? undefined : '2,2'}
                />
                <text
                  x={xPos}
                  y={padding.top + plotHeight + 18}
                  textAnchor="middle"
                  className="fill-slate-400 font-mono text-[11px] tabular-nums"
                >
                  {xVal}
                </text>
              </g>
            );
          })}

          {/* Major Axes */}
          <line
            x1={padding.left}
            y1={padding.top}
            x2={padding.left}
            y2={padding.top + plotHeight}
            stroke="#94a3b8"
            strokeWidth="2"
          />
          <line
            x1={padding.left}
            y1={padding.top + plotHeight}
            x2={padding.left + plotWidth}
            y2={padding.top + plotHeight}
            stroke="#94a3b8"
            strokeWidth="2"
          />

          {/* Axis Labels */}
          <text
            x={padding.left + plotWidth / 2}
            y={padding.top + plotHeight + 42}
            textAnchor="middle"
            className="fill-slate-200 font-medium text-[12px] tracking-wide"
          >
            {config.xLabel}
          </text>

          <text
            x={-(padding.top + plotHeight / 2)}
            y={18}
            textAnchor="middle"
            transform="rotate(-90)"
            className="fill-slate-200 font-medium text-[12px] tracking-wide"
          >
            {config.yLabel}
          </text>

          {/* Highlighted Query Coordinate (Dashed projection lines) */}
          {config.highlightX !== undefined && config.highlightY !== undefined && (
            <g>
              <line
                x1={scaleX(config.highlightX)}
                y1={padding.top + plotHeight}
                x2={scaleX(config.highlightX)}
                y2={scaleY(config.highlightY)}
                stroke="#38bdf8"
                strokeWidth="1.5"
                strokeDasharray="4,3"
              />
              <line
                x1={padding.left}
                y1={scaleY(config.highlightY)}
                x2={scaleX(config.highlightX)}
                y2={scaleY(config.highlightY)}
                stroke="#38bdf8"
                strokeWidth="1.5"
                strokeDasharray="4,3"
              />
              <circle
                cx={scaleX(config.highlightX)}
                cy={scaleY(config.highlightY)}
                r="4.5"
                fill="#38bdf8"
                stroke="#0284c7"
                strokeWidth="1.5"
              />
              <text
                x={scaleX(config.highlightX) + 8}
                y={scaleY(config.highlightY) - 8}
                className="fill-cyan-300 font-mono text-[10px] font-semibold"
              >
                ({config.highlightX}, {config.highlightY})
              </text>
            </g>
          )}

          {/* Line of Best Fit */}
          {config.lineOfBestFit && showLineOfBestFit && (
            <g>
              <line
                x1={scaleX(config.lineOfBestFit.x1)}
                y1={scaleY(config.lineOfBestFit.y1)}
                x2={scaleX(config.lineOfBestFit.x2)}
                y2={scaleY(config.lineOfBestFit.y2)}
                stroke="#06b6d4"
                strokeWidth="2.5"
                filter="url(#cyan-glow)"
              />
              {config.lineOfBestFit.equation && (
                <text
                  x={scaleX(config.lineOfBestFit.x2) - 10}
                  y={scaleY(config.lineOfBestFit.y2) - 10}
                  textAnchor="end"
                  className="fill-cyan-300 font-mono text-[11px] font-medium"
                >
                  {config.lineOfBestFit.equation}
                </text>
              )}
            </g>
          )}

          {/* Mean Point (x̄, ȳ) marker */}
          {showMeanPoint && (
            <g>
              <circle
                cx={scaleX(meanX)}
                cy={scaleY(meanY)}
                r="6"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2.5"
              />
              <circle
                cx={scaleX(meanX)}
                cy={scaleY(meanY)}
                r="2"
                fill="#f59e0b"
              />
              <text
                x={scaleX(meanX) + 8}
                y={scaleY(meanY) - 8}
                className="fill-amber-400 font-mono text-[11px] font-bold"
              >
                Mean ({meanX}, {meanY})
              </text>
            </g>
          )}

          {/* Data Points (Rendered as authentic Cambridge 'x' markers or circles) */}
          {config.points.map((pt, idx) => {
            const cx = scaleX(pt.x);
            const cy = scaleY(pt.y);
            const isOutlier = pt.isOutlier;
            const size = 5;

            return (
              <g
                key={`pt-${idx}`}
                className="cursor-pointer transition-transform hover:scale-125"
                onMouseEnter={() => setHoveredPoint(pt)}
                onMouseLeave={() => setHoveredPoint(null)}
              >
                {/* Hit target for easy hovering */}
                <circle cx={cx} cy={cy} r="12" fill="transparent" />

                {isOutlier ? (
                  // Outlier highlight
                  <g>
                    <circle
                      cx={cx}
                      cy={cy}
                      r="10"
                      fill="rgba(239, 68, 68, 0.2)"
                      stroke="#ef4444"
                      strokeWidth="1.5"
                      strokeDasharray="2,2"
                    />
                    <line x1={cx - size} y1={cy - size} x2={cx + size} y2={cy + size} stroke="#ef4444" strokeWidth="2.5" />
                    <line x1={cx + size} y1={cy - size} x2={cx - size} y2={cy + size} stroke="#ef4444" strokeWidth="2.5" />
                    <text
                      x={cx + 12}
                      y={cy + 4}
                      className="fill-red-400 font-mono text-[11px] font-bold"
                    >
                      Outlier ({pt.x}, {pt.y})
                    </text>
                  </g>
                ) : (
                  // Standard IGCSE 'x' cross plot point
                  <g>
                    <line
                      x1={cx - size}
                      y1={cy - size}
                      x2={cx + size}
                      y2={cy + size}
                      stroke={hoveredPoint === pt ? '#38bdf8' : '#e2e8f0'}
                      strokeWidth={hoveredPoint === pt ? 3 : 2}
                    />
                    <line
                      x1={cx + size}
                      y1={cy - size}
                      x2={cx - size}
                      y2={cy + size}
                      stroke={hoveredPoint === pt ? '#38bdf8' : '#e2e8f0'}
                      strokeWidth={hoveredPoint === pt ? 3 : 2}
                    />
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        {/* Hover Floating Tooltip */}
        {hoveredPoint && (
          <div
            className="pointer-events-none absolute rounded-lg border border-cyan-500/40 bg-slate-950/90 px-2.5 py-1.5 text-xs text-white shadow-xl backdrop-blur-md"
            style={{
              left: `${Math.min(Math.max(scaleX(hoveredPoint.x) - 40, 10), 450)}px`,
              top: `${Math.max(scaleY(hoveredPoint.y) - 45, 10)}px`,
            }}
          >
            <div className="font-mono font-semibold text-cyan-300">
              ({hoveredPoint.x}, {hoveredPoint.y})
            </div>
            {hoveredPoint.label && (
              <div className="text-[10px] text-amber-300">{hoveredPoint.label}</div>
            )}
          </div>
        )}
      </div>

      {/* Informative Footer Bar */}
      <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-full bg-cyan-400" />
          <span>Cambridge standard bivariate graph: axes calibrated to scale</span>
        </div>
        <div className="flex items-center gap-3 font-mono">
          <span>Points: {config.points.length}</span>
          <span>(x̄, ȳ) = ({meanX}, {meanY})</span>
        </div>
      </div>
    </div>
  );
};
