import React from 'react';
import { SearchIcon } from './icons';

interface SelectionPopoverProps {
  position: { top: number; left: number };
  onDefine: () => void;
}

const SelectionPopover: React.FC<SelectionPopoverProps> = ({ position, onDefine }) => {
  return (
    <div
      className="absolute z-10"
      style={{ top: `${position.top}px`, left: `${position.left}px` }}
    >
      <button
        onClick={onDefine}
        className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 text-white rounded-lg shadow-lg hover:bg-slate-700 transition-colors text-sm font-semibold"
        aria-label="Define selected text"
      >
        <SearchIcon />
        Define
      </button>
    </div>
  );
};

export default SelectionPopover;
