import React from 'react';
import FilterSidebar, { FilterState } from './FilterSidebar';
import { X } from 'lucide-react';

interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  categories: string[];
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
}

export default function MobileFilterDrawer({
  isOpen,
  onClose,
  categories,
  filters,
  setFilters
}: MobileFilterDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50" onClick={onClose}>
      <div 
        className="w-full bg-[#FFFFFF] rounded-t-2xl flex flex-col max-h-[80vh] animate-in slide-in-from-bottom"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-[#DDD8D0]">
          <h2 className="font-playfair font-semibold text-[20px] text-[#1A2B1C]">Filters</h2>
          <button onClick={onClose} className="p-2 text-[#5A6B5C]">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 flex justify-center w-full">
            <FilterSidebar categories={categories} filters={filters} setFilters={setFilters} />
        </div>
        
        <div className="p-4 border-t border-[#DDD8D0]">
          <button 
            className="w-full h-[48px] bg-[#2D6A35] text-white font-sans font-medium text-[15px] rounded-xl hover:bg-[#1A2B1C] transition-colors"
            onClick={onClose}
          >
            Show Results
          </button>
        </div>
      </div>
    </div>
  );
}
