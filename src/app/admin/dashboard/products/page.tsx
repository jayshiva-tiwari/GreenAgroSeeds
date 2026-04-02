import { supabase } from '@/lib/supabase';
import { getFeaturedProducts, Product } from '@/lib/api';
import ProductTable from '@/components/admin/ProductTable';

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  // Fetch from Supabase, or fallback for demo
  let products: Product[] = [];
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data && data.length > 0) {
      products = data as Product[];
    } else {
      products = await getFeaturedProducts();
    }
  } catch (err) {
    products = await getFeaturedProducts();
  }

  return <ProductTable initialProducts={products} />;
}
