import { supabase } from './supabase';

export interface Product {
  id: string;
  name_en: string;
  name_hi: string;
  name_gu: string;
  description_en: string;
  description_hi: string;
  description_gu: string;
  price: number;
  category: string;
  image_url: string;
  public_id?: string; // Cloudinary public_id
  is_active: boolean;
  has_offer: boolean;
  offer_label?: string;
  original_price?: number;
  offer_expiry?: string;
  slug: string;
  created_at?: string;
  updated_at?: string;
}

const fallbackProducts: Product[] = [
  {
    id: '00000000-0000-0000-0000-000000000001',
    name_en: 'Organic Wheat',
    name_hi: 'जैविक गेहूं',
    name_gu: 'ઓર્ગેનિક ઘઉં',
    description_en: 'Premium quality organic wheat directly from the fields of Punjab.',
    description_hi: 'पंजाब के खेतों से सीधे प्रीमियम गुणवत्ता वाले जैविक गेहूं।',
    description_gu: 'પંજાબના ખેતરોમાંથી સીધા પ્રીમિયમ ગુણવત્તાવાળા ઓર્ગેનિક ઘઉં.',
    price: 450,
    category: 'Grains',
    image_url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=800&auto=format&fit=crop',
    is_active: true,
    has_offer: true,
    offer_label: '10% OFF',
    slug: 'organic-wheat'
  },
  {
    id: '00000000-0000-0000-0000-000000000002',
    name_en: 'Basmati Rice',
    name_hi: 'बासमती चावल',
    name_gu: 'બાસમતી ચોખા',
    description_en: 'Long grain, aromatic Basmati rice for the perfect Biryani.',
    description_hi: 'परफेक्ट बिरयानी के लिए लंबे दाने वाले खुशबूदार बासमती चावल।',
    description_gu: 'પરફેક્ટ બિરયાની માટે લાંબા દાણાવાળા સુગંધિત બાસમતી ચોખા.',
    price: 850,
    category: 'Grains',
    image_url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=800&auto=format&fit=crop',
    is_active: true,
    has_offer: false,
    slug: 'basmati-rice'
  },
  {
    id: '00000000-0000-0000-0000-000000000003',
    name_en: 'Fresh Turmeric',
    name_hi: 'ताजी हल्दी',
    name_gu: 'તાજી હળદર',
    description_en: 'Organically grown rich yellow turmeric with high curcumin content.',
    description_hi: 'उच्च करक्यूमिन सामग्री के साथ जैविक रूप से उगाई गई समृद्ध पीली हल्दी।',
    description_gu: 'કર્ક્યુમિનનું પ્રમાણ વધુ હોય તેવી જૈવિક રીતે ઉગાડવામાં આવેલી પીળી હળદર.',
    price: 150,
    category: 'Spices',
    image_url: 'https://images.unsplash.com/photo-1583209814683-c0ccd3cb5997?q=80&w=800&auto=format&fit=crop',
    is_active: true,
    has_offer: true,
    offer_label: 'Seasonal',
    slug: 'fresh-turmeric'
  }
];

export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .limit(6);
    
    if (error || !data || data.length === 0) {
      console.log("Using fallback featured products. Supabase error:", error);
      return fallbackProducts;
    }
    
    return data as Product[];
  } catch (error) {
    return fallbackProducts;
  }
}

export async function getActiveOffers(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .eq('has_offer', true);
    
    if (error || !data || data.length === 0) {
      return fallbackProducts.filter(p => p.has_offer);
    }
    return data as Product[];
  } catch (error) {
    return fallbackProducts.filter(p => p.has_offer);
  }
}
