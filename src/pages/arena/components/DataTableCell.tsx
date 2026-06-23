import React from 'react';

interface DataTableCellProps {
  cellKey: string;
  value: number | null;
  isSelected: boolean;
  type: 'present' | 'permit' | 'sick' | 'alpha';
  onClick: () => void;
}

export const DataTableCell: React.FC<DataTableCellProps> = ({
  cellKey,
  value,
  isSelected,
  type,
  onClick,
}) => {
  let styleClasses = '';
  
  if (isSelected) {
    styleClasses = 'bg-[#FDE047] text-black shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] scale-105';
  } else if (value !== null) {
    if (type === 'present') {
      styleClasses = 'bg-[#CCFBF1] text-emerald-900 border-emerald-500 shadow-[1px_1px_0px_rgba(0,0,0,1)]';
    } else if (type === 'permit') {
      styleClasses = 'bg-[#E0F2FE] text-sky-900 border-sky-500 shadow-[1px_1px_0px_rgba(0,0,0,1)]';
    } else if (type === 'sick') {
      styleClasses = 'bg-[#FEF3C7] text-amber-900 border-amber-500 shadow-[1px_1px_0px_rgba(0,0,0,1)]';
    } else {
      styleClasses = 'bg-[#FEE2E2] text-rose-900 border-rose-500 shadow-[1px_1px_0px_rgba(0,0,0,1)]';
    }
  } else {
    styleClasses = 'bg-indigo-50/40 text-[#4F46E5] border-dashed border-indigo-400 hover:bg-[#A5F3FC]/30';
  }

  return (
    <div
      onClick={onClick}
      className={`w-8.5 sm:w-10 mx-auto py-1 sm:py-1.5 rounded-lg border-2 border-black font-mono font-black text-center cursor-pointer transition-all text-[10px] sm:text-xs mobile-landscape-table-btn ${styleClasses}`}
      id={`cell-${cellKey}`}
    >
      {value !== null ? value : '?'}
    </div>
  );
};
