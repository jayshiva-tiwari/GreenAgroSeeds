import React, { useState, useEffect, useRef } from 'react';
import { Filter } from 'lucide-react';

export interface FilterState {
  category: string;
  minPrice: number;
  maxPrice: number;
  hasOffer: boolean;
}

interface FilterSidebarProps {
  categories: string[];
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
}

export default function FilterSidebar({ categories, filters, setFilters }: FilterSidebarProps) {
  const minPriceLimit = 0;
  const maxPriceLimit = 5000;
  const sliderRef = useRef<HTMLDivElement>(null);
  
  // Local state for dragging the slider smoothly
  const [localMin, setLocalMin] = useState(filters.minPrice);
  const [localMax, setLocalMax] = useState(filters.maxPrice);

  // Sync if external filters change
  useEffect(() => {
    setLocalMin(filters.minPrice);
    setLocalMax(filters.maxPrice);
  }, [filters.minPrice, filters.maxPrice]);

  const handleCategoryClick = (category: string) => {
    setFilters(prev => ({ ...prev, category }));
  };

  const handleToggleOffer = () => {
    setFilters(prev => ({ ...prev, hasOffer: !prev.hasOffer }));
  };

  // Dual handle slider logic using native ranges
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Number(e.target.value), localMax - 100);
    setLocalMin(value);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(Number(e.target.value), localMin + 100);
    setLocalMax(value);
  };

  const handleSliderMouseUp = () => {
    setFilters(prev => ({ ...prev, minPrice: localMin, maxPrice: localMax }));
  };

  const calculatePercent = (value: number) => {
    return ((value - minPriceLimit) / (maxPriceLimit - minPriceLimit)) * 100;
  };

  return (
    <div className="w-[220px] flex-shrink-0 sticky top-[24px]">
      {/* Categories */}
      <div className="mb-[28px]">
        <div className="flex items-center gap-[8px] mb-[12px]">
          <Filter className="w-[14px] h-[14px] text-[#2D6A35]" />
          <h3 className="font-sans font-medium text-[13px] text-[#1A2B1C] uppercase tracking-[1px]">
            Categories
          </h3>
        </div>
        <div className="flex flex-wrap gap-[8px]">
          {['All Products', ...categories].map(cat => (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className={`h-[32px] px-[14px] rounded-full font-sans font-medium text-[12px] transition-all duration-150 border ${
                filters.category === cat
                  ? 'bg-[#2D6A35] text-white border-transparent'
                  : 'bg-[#FFFFFF] text-[#5A6B5C] border-[#DDD8D0] hover:border-[#2D6A35]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-[28px]">
        <h3 className="font-sans font-medium text-[12px] text-[#1A2B1C] uppercase tracking-[1px] mb-[10px]">
          Price Range
        </h3>
        
        {/* Custom Slider */}
        <div className="relative h-[24px] flex items-center mb-[8px] group">
          {/* Tracks */}
          <div className="absolute w-full h-[4px] bg-[#DDD8D0] rounded-full pointer-events-none" />
          <div 
            className="absolute h-[4px] bg-[#2D6A35] rounded-full pointer-events-none"
            style={{ 
              left: `${calculatePercent(localMin)}%`, 
              width: `${calculatePercent(localMax) - calculatePercent(localMin)}%` 
            }} 
          />
          
          {/* Inputs */}
          <input 
            type="range" 
            min={minPriceLimit} 
            max={maxPriceLimit} 
            step="50"
            value={localMin} 
            onChange={handleMinChange}
            onMouseUp={handleSliderMouseUp}
            onTouchEnd={handleSliderMouseUp}
            className="absolute w-full h-full opacity-0 cursor-grab active:cursor-grabbing z-20"
          />
          <input 
            type="range" 
            min={minPriceLimit} 
            max={maxPriceLimit} 
            step="50"
            value={localMax} 
            onChange={handleMaxChange}
            onMouseUp={handleSliderMouseUp}
            onTouchEnd={handleSliderMouseUp}
            className="absolute w-full h-full opacity-0 cursor-grab active:cursor-grabbing z-20"
          />

          {/* Handles (Visual only) */}
          <div 
            className="absolute w-[18px] h-[18px] bg-[#2D6A35] border-2 border-white rounded-full shadow-sm pointer-events-none transition-transform duration-150 group-active:scale-110 z-10"
            style={{ left: `calc(${calculatePercent(localMin)}% - 9px)` }}
          />
          <div 
            className="absolute w-[18px] h-[18px] bg-[#2D6A35] border-2 border-white rounded-full shadow-sm pointer-events-none transition-transform duration-150 group-active:scale-110 z-10"
            style={{ left: `calc(${calculatePercent(localMax)}% - 9px)` }}
          />
        </div>

        {/* Range Labels */}
        <div className="flex items-center justify-between">
          <span className="font-mono text-[13px] text-[#2D6A35]">₹{localMin}</span>
          <span className="font-mono text-[13px] text-[#2D6A35]">₹{localMax.toLocaleString()}</span>
        </div>
      </div>

      {/* Flash Offers */}
      <div className="flex items-center justify-between">
        <h3 className="font-sans font-medium text-[13px] text-[#1A2B1C]">
          Flash Offers
        </h3>
        <button
          className={`relative w-[48px] h-[26px] rounded-full transition-colors duration-200 ${
            filters.hasOffer ? 'bg-[#2D6A35]' : 'bg-[#DDD8D0]'
          }`}
          onClick={handleToggleOffer}
        >
          <div
            className={`absolute top-[2px] left-[2px] w-[22px] h-[22px] bg-white rounded-full transition-transform duration-200 ${
              filters.hasOffer ? 'transform translate-x-[22px]' : ''
            }`}
          />
        </button>
      </div>
    </div>
  );
}
