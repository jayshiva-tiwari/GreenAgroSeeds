import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://greenseedsagro.in';
  
  // base routes
  const routes = ['', '/about', '/products', '/offers', '/contact'].map((route) => ({
    url: `${baseUrl}/en${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));
  
  // fetch products for dynamic routes
  try {
    const { data } = await supabase.from('products').select('slug').eq('is_active', true);
    if (data) {
      const productRoutes = data.map((product) => ({
        url: `${baseUrl}/en/products/${product.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
      }));
      return [...routes, ...productRoutes];
    }
  } catch (err) {
    // fallback
    return routes;
  }
  
  return routes;
}
