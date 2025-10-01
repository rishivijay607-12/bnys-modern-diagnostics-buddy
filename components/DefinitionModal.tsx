import React from 'react';
import LoadingSpinner from './LoadingSpinner';
import { CloseIcon, BookIcon } from './icons';

interface DefinitionModalProps {
  word: string;
  definition: string;
  isLoading: boolean;
  error: string | null;
  onClose: () => void;
}

const DefinitionModal: React.FC<DefinitionModalProps> = ({ word, definition, isLoading, error, onClose }) => {
  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="definition-title"
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-lg relative animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-4 border-b border-slate-200">
          <h2 id="definition-title" className="text-xl font-bold text-slate-800 flex items-center gap-3">
            <BookIcon />
            Definition: <span className="text-cyan-600">{word}</span>
          </h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-800 transition-colors"
            aria-label="Close definition modal"
          >
            <CloseIcon />
          </button>
        </header>

        <div className="p-6 min-h-[150px]">
          {isLoading && <LoadingSpinner />}
          {error && <div className="text-red-600 bg-red-100 p-4 rounded-lg text-center font-medium">{error}</div>}
          {!isLoading && !error && (
            <p className="text-slate-700 leading-relaxed">{definition}</p>
          )}
        </div>
      </div>
       <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default DefinitionModal;
