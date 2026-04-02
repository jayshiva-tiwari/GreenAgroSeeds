'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/lib/api';
import ProductCard from './ProductCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export default function ProductGrid({ initialProducts }: { initialProducts: Product[] }) {
  const [search, setSearch] = useState('');
  const [offersOnly, setOffersOnly] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const allCategories = Array.from(new Set(initialProducts.map(p => p.category)));

  const toggleCategory = (cat: string) => {
    setCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
  };

  const filtered = initialProducts.filter(p => {
    const matchSearch = p.name_en.toLowerCase().includes(search.toLowerCase()) || 
                       p.description_en.toLowerCase().includes(search.toLowerCase());
    const matchOffer = offersOnly ? p.has_offer : true;
    const matchCategory = categories.length > 0 ? categories.includes(p.category) : true;
    return matchSearch && matchOffer && matchCategory;
  });

  return (
    <div className="flex flex-col lg:flex-row gap-8 relative items-start">
      {/* Mobile filter toggle */}
      <div className="lg:hidden w-full flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-earthGreen">Filters</h2>
        <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
          <SlidersHorizontal className="w-4 h-4 mr-2" />
          Filter options
        </Button>
      </div>

      {/* Sidebar Filters */}
      <AnimatePresence>
        {(showFilters || isDesktop) && (
          <motion.aside 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="w-full lg:w-64 shrink-0 bg-white p-6 rounded-2xl shadow-sm border border-earthGreen/10 lg:sticky lg:top-24 overflow-hidden lg:block z-10"
          >
            <div className="flex items-center justify-between mb-6 lg:mb-8">
              <h3 className="font-bold text-lg text-earthGreen">Filters</h3>
              <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setShowFilters(false)}>
                <X className="w-5 h-5 text-earthGreen" />
              </Button>
            </div>

            <div className="space-y-6">
              {/* Offers */}
              <div className="flex items-center space-x-2">
                <Switch id="offers-only" checked={offersOnly} onCheckedChange={setOffersOnly} />
                <Label htmlFor="offers-only" className="font-medium cursor-pointer">Special Offers Only</Label>
              </div>

              {/* Categories */}
              <div>
                <h4 className="font-semibold text-earthGreen mb-3 text-sm tracking-wide uppercase">Categories</h4>
                <div className="space-y-2">
                  {allCategories.map(cat => (
                    <label key={cat} className="flex items-center gap-2 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        checked={categories.includes(cat)} 
                        onChange={() => toggleCategory(cat)}
                        className="rounded border-earthGreen/30 text-earthGreen focus:ring-earthGreen bg-white"
                      />
                      <span className="text-sm text-foreground/80 group-hover:text-earthGreen transition-colors">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              <Button variant="ghost" className="w-full text-earthGreen hover:text-earthGreen hover:bg-warmCream mt-4" onClick={() => { setCategories([]); setOffersOnly(false); setSearch(''); }}>
                Reset Filters
              </Button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 w-full">
        {/* Search Bar */}
        <div className="relative mb-8 max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Search products by name or description..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-12 bg-white border-earthGreen/20 focus-visible:ring-earthGreen rounded-full shadow-sm text-base"
          />
        </div>

        {/* Results Info */}
        <p className="text-sm text-muted-foreground mb-6 font-medium">
          Showing {filtered.length} products
        </p>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((product, index) => (
              <ProductCard key={product.id} product={product} priority={index < 4} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-2xl border border-dashed border-earthGreen/30">
            <div className="w-16 h-16 bg-warmCream rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-lightGreen opacity-50" />
            </div>
            <h3 className="text-xl font-bold text-earthGreen mb-2">No products found</h3>
            <p className="text-muted-foreground max-w-sm">
              We couldn't find any products matching your current filters and search query.
            </p>
            <Button variant="outline" className="mt-6 text-earthGreen border-earthGreen hover:bg-earthGreen hover:text-white" onClick={() => { setCategories([]); setOffersOnly(false); setSearch(''); }}>
              Clear all filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
