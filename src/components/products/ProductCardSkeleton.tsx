import React from 'react';

export default function ProductCardSkeleton() {
  return (
    <div className="flex flex-col bg-white rounded-[20px] p-2.5 border border-gray-100 overflow-hidden h-full">
      {/* Image Area */}
      <div className="w-full aspect-[4/3] bg-[#F3F3F3] rounded-[14px] animate-shimmer mb-3" />

      {/* Content Section */}
      <div className="flex flex-col flex-grow px-0.5">
        {/* Title */}
        <div className="h-5 w-[70%] bg-[#F3F3F3] animate-shimmer rounded-md mb-2" />
        
        {/* Price Row */}
        <div className="flex items-center gap-2 mb-4">
          <div className="h-3 w-8 bg-[#F3F3F3] animate-shimmer rounded" />
          <div className="h-5 w-14 bg-[#F3F3F3] animate-shimmer rounded" />
        </div>

        {/* Buttons Row */}
        <div className="flex gap-2.5 mt-auto">
          <div className="flex-1 h-8 bg-[#F3F3F3] animate-shimmer rounded-full" />
          <div className="flex-1 h-8 bg-[#F3F3F3] animate-shimmer rounded-full" />
        </div>
      </div>
    </div>
  );
}


