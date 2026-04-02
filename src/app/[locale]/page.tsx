import { getTranslations } from 'next-intl/server';
import { getFeaturedProducts, getActiveOffers } from '@/lib/api';
import HomeContent from '@/components/home/HomeContent';
import PromoBanner from '@/components/sections/PromoBanner';

// Use ISR revalidation
export const revalidate = 60;

export default async function HomePage() {
  const t = await getTranslations('Home');
  const products = await getFeaturedProducts();
  const offers = await getActiveOffers();

  const translations = {
    heroTitle: t('hero_title'),
    heroSubtitle: t('hero_subtitle'),
    ctaProducts: t('cta_products'),
    ctaContact: t('cta_contact'),
    statsYears: t('stats_years'),
    statsProducts: t('stats_products'),
    statsCities: t('stats_cities'),
  };

  return (
    <HomeContent 
      products={products}
      offers={offers} 
      translations={translations} 
      promoBanner={<PromoBanner />}
    />
  );
}
