'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { Product } from '@/lib/api';
import FilterSidebar, { FilterState } from './FilterSidebar';
import MobileFilterDrawer from './MobileFilterDrawer';
import ProductCard from './ProductCard';
import ProductCardSkeleton from './ProductCardSkeleton';
import Pagination from './Pagination';
import { ChevronDown, Filter } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ProductsClientProps {
  initialProducts: Product[];
  initialCount: number;
}

type SortOption = 'Latest Release' | 'Price: Low to High' | 'Price: High to Low' | 'Name A–Z';

export default function ProductsClient({ initialProducts, initialCount }: ProductsClientProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [totalCount, setTotalCount] = useState<number>(initialCount);
  const [loading, setLoading] = useState<boolean>(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  
  const [filters, setFilters] = useState<FilterState>({
    category: 'All Products',
    minPrice: 0,
    maxPrice: 5000,
    hasOffer: false,
  });
  
  const [sortOption, setSortOption] = useState<SortOption>('Latest Release');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 6;

  // Categories list
  const [categories, setCategories] = useState<string[]>([]);
  
  // Ref for debouncing price queries
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Extract unique categories from initial load or fetch them
    const getCategories = async () => {
      const { data } = await supabase.from('products').select('category').eq('is_active', true);
      if (data) {
        const unique = Array.from(new Set(data.map(item => item.category))).filter(Boolean);
        setCategories(unique as string[]);
      }
    };
    getCategories();
  }, []);

  const fetchProducts = useCallback(async (isPriceDebounce = false) => {
    setLoading(true);
    let query = supabase.from('products').select('*', { count: 'exact' }).eq('is_active', true);

    if (filters.category !== 'All Products') {
      query = query.eq('category', filters.category);
    }

    query = query.gte('price', filters.minPrice).lte('price', filters.maxPrice);

    if (filters.hasOffer) {
      query = query.eq('has_offer', true);
    }

    switch (sortOption) {
      case 'Price: Low to High':
        query = query.order('price', { ascending: true });
        break;
      case 'Price: High to Low':
        query = query.order('price', { ascending: false });
        break;
      case 'Name A–Z':
        query = query.order('name_en', { ascending: true });
        break;
      case 'Latest Release':
      default:
        query = query.order('created_at', { ascending: false });
        break;
    }

    const offset = (currentPage - 1) * itemsPerPage;
    query = query.range(offset, offset + itemsPerPage - 1);

    const { data, count, error } = await query;
    
    if (data) {
      setProducts(data as Product[]);
      if (count !== null) setTotalCount(count);
    }
    
    setLoading(false);
  }, [filters, sortOption, currentPage]);

  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      fetchProducts();
    }, 400);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [filters, sortOption, currentPage, fetchProducts]);

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value as SortOption);
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 w-full">
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-[220px] flex-shrink-0">
        <FilterSidebar categories={categories} filters={filters} setFilters={(f) => { setFilters(f); setCurrentPage(1); }} />
      </div>

      {/* Mobile Drawer */}
      <MobileFilterDrawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
        categories={categories}
        filters={filters}
        setFilters={(f) => { setFilters(f); setCurrentPage(1); }}
      />

      <div className="flex-1 min-w-0">
        {/* Results Bar */}
        <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          
          <div className="font-sans text-[13px]">
            <span className="text-[#9A9187] font-normal">Showing </span>
            <span className="text-[#1A2B1C] font-medium">{totalCount}</span>
            <span className="text-[#9A9187] font-normal"> Results</span>
          </div>

          <div className="flex items-center gap-4 w-full sm:w-auto">
            {/* Mobile filter trigger */}
            <button 
              className="md:hidden flex-1 h-[36px] bg-[#FFFFFF] border border-[#DDD8D0] rounded-[8px] flex items-center justify-center gap-2 font-sans font-medium text-[13px] text-[#1A2B1C]"
              onClick={() => setIsMobileDrawerOpen(true)}
            >
              <Filter className="w-4 h-4 text-[#2D6A35]" /> Filters
            </button>

            <div className="flex items-center gap-2 flex-1 sm:flex-none justify-end">
              <span className="hidden sm:inline font-sans text-[13px] text-[#9A9187] font-normal">
                Sort By:
              </span>
              <div className="relative">
                <Select value={sortOption} onValueChange={(val) => { setSortOption(val as SortOption); setCurrentPage(1); }}>
                  <SelectTrigger className="w-full sm:w-[160px] h-[36px] bg-[#FFFFFF] border-[#DDD8D0] rounded-[8px] font-sans font-medium text-[13px] text-[#1A2B1C] focus:ring-[#2D6A35] hover:border-[#2D6A35] transition-colors">
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-[#DDD8D0] rounded-[8px] shadow-lg p-1 z-50">
                    <SelectItem value="Latest Release" className="font-sans text-[13px] text-[#1A2B1C] focus:bg-[#F4F9F5] focus:text-[#2D6A35] cursor-pointer rounded-md transition-colors">Latest Release</SelectItem>
                    <SelectItem value="Price: Low to High" className="font-sans text-[13px] text-[#1A2B1C] focus:bg-[#F4F9F5] focus:text-[#2D6A35] cursor-pointer rounded-md transition-colors">Price: Low to High</SelectItem>
                    <SelectItem value="Price: High to Low" className="font-sans text-[13px] text-[#1A2B1C] focus:bg-[#F4F9F5] focus:text-[#2D6A35] cursor-pointer rounded-md transition-colors">Price: High to Low</SelectItem>
                    <SelectItem value="Name A–Z" className="font-sans text-[13px] text-[#1A2B1C] focus:bg-[#F4F9F5] focus:text-[#2D6A35] cursor-pointer rounded-md transition-colors">Name A–Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {loading ? (
            Array(6).fill(0).map((_, i) => <ProductCardSkeleton key={i} />)
          ) : (
            products.map(product => <ProductCard key={product.id} product={product} />)
          )}
        </div>

        {/* Pagination Container */}
        <div className="mt-8 flex justify-center">
            <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
        </div>
      </div>
    </div>
  );
}
