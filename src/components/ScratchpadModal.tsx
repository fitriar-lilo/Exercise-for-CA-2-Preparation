import React, { useState } from 'react';
import { X, PenLine, Trash2 } from 'lucide-react';

interface ScratchpadModalProps {
  isOpen: boolean;
  onClose: () => void;
  questionId: number;
}

export const ScratchpadModal: React.FC<ScratchpadModalProps> = ({
  isOpen,
  onClose,
  questionId,
}) => {
  const [notes, setNotes] = useState<Record<number, string>>({});

  if (!isOpen) return null;

  const currentNote = notes[questionId] || '';

  const handleUpdate = (text: string) => {
    setNotes((prev) => ({
      ...prev,
      [questionId]: text,
    }));
  };

  const handleClear = () => {
    setNotes((prev) => ({
      ...prev,
      [questionId]: '',
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-700/80 bg-slate-900 p-5 shadow-2xl text-slate-100">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <PenLine className="h-4 w-4 text-cyan-400" />
            <h3 className="font-semibold text-white">
              Working Scratchpad · Question #{questionId}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleClear}
              className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-slate-400 hover:bg-slate-800 hover:text-rose-400 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Clear</span>
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-4">
          <div className="text-xs text-slate-400 mb-2">
            Jot down intermediate calculations, multipliers, or rough steps for this question:
          </div>
          <textarea
            value={currentNote}
            onChange={(e) => handleUpdate(e.target.value)}
            placeholder="e.g.&#10;Gross = 36 * 14.50 = 522&#10;OT = 6 * 21.75 = 130.50&#10;Total = 522 + 130.50 = 652.50"
            rows={8}
            className="w-full rounded-xl border border-slate-800 bg-slate-950/80 p-3 font-mono text-sm text-cyan-200 placeholder-slate-600 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
          <span>Notes auto-save per question number</span>
          <button
            onClick={onClose}
            className="rounded-xl bg-cyan-500 px-4 py-1.5 font-medium text-slate-950 hover:bg-cyan-400 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
