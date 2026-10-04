export type TopicType = 'scatter_diagrams' | 'managing_money';

export type SubTopic =
  | 'types_of_correlation'
  | 'real_world_correlation'
  | 'line_of_best_fit'
  | 'outliers_analysis'
  | 'interpolation_extrapolation'
  | 'mean_point_calculation'
  | 'earning_overtime_piecework'
  | 'income_tax_deductions'
  | 'simple_interest'
  | 'compound_interest'
  | 'population_growth_decay'
  | 'asset_depreciation'
  | 'profit_and_loss'
  | 'discounts_reverse_percent'
  | 'hire_purchase_finance';

export interface ScatterDataPoint {
  x: number;
  y: number;
  label?: string;
  isOutlier?: boolean;
}

export interface ScatterPlotConfig {
  xLabel: string;
  yLabel: string;
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  xStep: number;
  yStep: number;
  points: ScatterDataPoint[];
  lineOfBestFit?: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    equation?: string;
  };
  meanPoint?: {
    x: number;
    y: number;
  };
  highlightX?: number;
  highlightY?: number;
}

export interface QuestionOption {
  id: 'A' | 'B' | 'C' | 'D';
  text: string;
  explanationNote?: string;
}

export interface Question {
  id: number;
  topic: TopicType;
  subtopic: SubTopic;
  title: string;
  cambridgeReference: string; // e.g., "Cambridge IGCSE 0580 / Paper 2 / Scatter Diagrams"
  questionText: string;
  contextData?: string;
  scatterPlot?: ScatterPlotConfig;
  tableData?: {
    headers: string[];
    rows: (string | number)[][];
  };
  options: QuestionOption[];
  correctOption: 'A' | 'B' | 'C' | 'D';
  hint: {
    title: string;
    steps: string[];
    keyFormula?: string;
  };
  solution: {
    finalAnswer: string;
    stepByStep: string[];
    formulaUsed?: string;
    examinerTip?: string;
  };
}

export interface UserAnswerState {
  selectedOption: 'A' | 'B' | 'C' | 'D' | null;
  attempts: ('A' | 'B' | 'C' | 'D')[];
  isCorrect: boolean;
  scoreAwarded: number; // 1 if correct on 1st attempt, or tracked for total resolved
  firstAttemptCorrect: boolean;
  hintViewed: boolean;
  solutionViewed: boolean;
  flaggedForReview: boolean;
}

export type ThemeMode = 'cosmic' | 'emerald' | 'amber' | 'blueprint';
