import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }

    return pages.map((page, index) => {
      if (page === '...') {
        return (
          <span
            key={`ellipsis-${index}`}
            className="w-10 h-10 flex items-center justify-center text-[#4B5563] font-mono text-[14px]"
          >
            ...
          </span>
        );
      }

      const p = page as number;
      const isActive = p === currentPage;
      const displayPage = p.toString().padStart(2, '0');

      return (
        <button
          key={`page-${p}`}
          onClick={() => onPageChange(p)}
          className={`w-10 h-10 flex items-center justify-center rounded-lg font-mono text-[14px] transition-colors duration-150 ${isActive
            ? 'bg-[#4ADE80] text-[#1A2B1C] font-semibold'
            : 'bg-[#fff] border border-[#2D4A32] text-[#7A9E7E] hover:border-[#4ADE80] hover:text-[#000]'
            }`}
        >
          {displayPage}
        </button>
      );
    });
  };

  return (
    <div className="w-full mt-8 rounded-xl py-[14px] px-5 flex items-center justify-center gap-1.5 overflow-x-auto hide-scrollbar">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#000] border border-[#2D4A32] text-[#7A9E7E] hover:text-[#4ADE80] transition-colors duration-150 disabled:opacity-50 disabled:hover:border-[#2D4A32] disabled:hover:text-[#7A9E7E]"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {renderPageNumbers()}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#000] border border-[#2D4A32] text-[#7A9E7E] hover:text-[#4ADE80] transition-colors duration-150 disabled:opacity-50 disabled:hover:border-[#2D4A32] disabled:hover:text-[#7A9E7E]"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
