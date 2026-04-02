import { supabase } from '@/lib/supabase';
import ProductsClient from '@/components/products/ProductsClient';
import { Product } from '@/lib/api';

// Revalidate every 60 seconds (ISR)
export const revalidate = 60;

export default async function ProductsPage() {
  let initialProducts: Product[] = [];
  let initialCount = 0;

  try {
    const { data, count } = await supabase
      .from('products')
      .select('*', { count: 'exact' })
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(6);

    if (data && data.length > 0) {
      initialProducts = data as Product[];
      initialCount = count || data.length;
    } else {
      // Import fallback for demo purposes if DB empty
      const { getFeaturedProducts } = await import('@/lib/api');
      initialProducts = await getFeaturedProducts();
      initialCount = initialProducts.length;
    }
  } catch (error) {
    const { getFeaturedProducts } = await import('@/lib/api');
    initialProducts = await getFeaturedProducts();
    initialCount = initialProducts.length;
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] pt-24 pb-12 md:pt-28 relative z-0">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">

        {/* HEADER AREA */}
        <div className="flex flex-col mb-[32px]">
          {/* Breadcrumb */}
          <div className="font-sans text-[13px] text-[#9A9187] mb-[12px]">
            Home › Products
          </div>

          {/* Heading Row */}
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
            {/* Title */}
            <div className="flex items-baseline flex-wrap">
              <span className="font-playfair font-bold text-[36px] sm:text-[52px] text-[#1A2B1C] whitespace-pre">Our </span>
              <span className="font-playfair font-bold italic text-[36px] sm:text-[52px] text-[#2D6A35]">Products</span>
            </div>

            {/* Count */}
            <div className="flex flex-col sm:items-end text-left sm:text-right w-full sm:w-auto mt-2 sm:mt-0">
              <span className="font-mono font-bold text-[28px] sm:text-[36px] text-[#2D6A35] leading-none mb-1">
                {initialCount}
              </span>
              <span className="font-sans font-normal text-[12px] text-[#9A9187] uppercase tracking-[1px] leading-none">
                Available Products
              </span>
            </div>
          </div>
        </div>

        {/* CLIENT COMPONENT */}
        <ProductsClient initialProducts={initialProducts} initialCount={initialCount} />

      </div>
    </div>
  );
}
