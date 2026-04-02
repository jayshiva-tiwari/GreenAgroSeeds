import { getActiveOffers } from '@/lib/api';
import ProductCard from '@/components/products/ProductCard';
import { Tag } from 'lucide-react';
import PromoBanner from '@/components/sections/PromoBanner';

export default async function OffersPage() {
  const offers = await getActiveOffers();

  return (
    <div className="min-h-screen bg-warmCream pt-28 pb-12 md:pt-32">
      <div className="mb-12">
        <PromoBanner />
      </div>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-500">
            <Tag className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-earthGreen mb-2">Exclusive Deals</h1>
            <p className="text-muted-foreground text-lg">Limited time offers on our premium agricultural products.</p>
          </div>
        </div>
        
        {offers.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {offers.map(offer => (
              <ProductCard key={offer.id} product={offer} />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center bg-white rounded-2xl shadow-sm border mt-8">
            <Tag className="w-12 h-12 text-muted-foreground opacity-20 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-earthGreen mb-2">No active offers right now</h3>
            <p className="text-muted-foreground">Check back soon for new discounts and seasonal deals!</p>
          </div>
        )}
      </div>
    </div>
  );
}
