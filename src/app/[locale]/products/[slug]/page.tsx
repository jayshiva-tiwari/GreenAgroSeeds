import { supabase } from '@/lib/supabase';
import { Product } from '@/lib/api';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { Calendar, ChevronRight, MessageCircle, ShieldCheck, Truck } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import SimilarProducts from '@/components/products/SimilarProducts';

export const revalidate = 60;

export async function generateStaticParams() {
  const { data } = await supabase.from('products').select('slug').eq('is_active', true);
  if (!data) return [];
  return data.map((p) => ({ slug: p.slug }));
}

export default async function ProductDetailPage({
  params
}: {
  params: Promise<{ slug: string; locale: string }>
}) {
  const { slug, locale } = await params;
  let product: Product | null = null;

  // Try to fetch from Supabase
  const { data } = await supabase.from('products').select('*').eq('slug', slug).single();
  if (data) {
    product = data as Product;
  } else {
    // Check fallback for demo
    const { getFeaturedProducts } = await import('@/lib/api');
    const catalog = await getFeaturedProducts();
    product = catalog.find(p => p.slug === slug) || null;
  }

  if (!product) {
    notFound();
  }

  // Fetch similar products based on the category of current product
  const { data: similarProductsData } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .eq('category', product?.category || '')
    .neq('slug', slug)
    .limit(6);

  const similarProducts = (similarProductsData as Product[]) || [];

  const name = locale === 'hi' ? product.name_hi || product.name_en : locale === 'gu' ? product.name_gu || product.name_en : product.name_en;
  const description = locale === 'hi' ? product.description_hi || product.description_en : locale === 'gu' ? product.description_gu || product.description_en : product.description_en;

  const encodedMessage = encodeURIComponent(`Hi, I'm interested in ${name}. Please share more details.`);
  const waUrl = `https://wa.me/+917947137134?text=${encodedMessage}`;

  // Log product view event (Server-side fire-and-forget for demo, realistically done via client or edge)
  if (product.id) {
    supabase.from('analytics_events').insert({
      event_type: 'product_view',
      product_id: product.id,
      metadata: { locale }
    }).then();
  }

  return (
    <div className="min-h-screen bg-warmCream pt-28 pb-12 md:pt-32">
      <div className="container mx-auto px-4 md:px-6">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-earthGreen">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/products" className="hover:text-earthGreen">Products</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-earthGreen font-medium">{name}</span>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border overflow-hidden p-6 md:p-8 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">

            {/* Image Section */}
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-muted border">
              <Image
                src={product.image_url}
                alt={name}
                fill
                priority
                className="object-cover"
                sizes="(min-width: 1024px) 40vw, 90vw"
              />
              {product.has_offer && product.offer_label && (
                <Badge className="absolute left-3 top-3 bg-red-500 hover:bg-red-600 px-2 py-0.5 text-xs shadow-md">
                  {product.offer_label}
                </Badge>
              )}
            </div>

            {/* Product Details */}
            <div className="flex flex-col py-2">
              <Badge className="bg-earthGreen/10 text-earthGreen hover:bg-earthGreen/20 w-fit mb-3 text-xs">
                {product.category}
              </Badge>
              <h1 className="text-2xl md:text-3xl font-bold text-earthGreen mb-3">{name}</h1>

              <div className="text-3xl font-extrabold text-lightGreen mb-5">
                ₹{product.price}
                <span className="text-sm text-muted-foreground font-medium ml-1.5">/ kg</span>
              </div>

              <div className="prose prose-earthGreen max-w-none text-muted-foreground mb-6">
                <p className="text-base leading-relaxed line-clamp-4">{description}</p>
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-3 mb-8 text-[13px] font-medium">
                <div className="flex items-center gap-2 text-earthGreen">
                  <ShieldCheck className="w-4 h-4 text-lightGreen" />
                  100% Organic Quality
                </div>
                <div className="flex items-center gap-2 text-earthGreen">
                  <Truck className="w-4 h-4 text-lightGreen" />
                  Direct Farm Sourced
                </div>
                <div className="flex items-center gap-2 text-earthGreen">
                  <Calendar className="w-4 h-4 text-lightGreen" />
                  Freshly Harvested
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-auto">
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(buttonVariants({ size: "lg" }), "w-full bg-[#25D366] hover:bg-[#1DA851] text-white flex items-center justify-center h-12")}
                >
                  <MessageCircle className="w-5 h-5 mr-2" /> Inquire on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>


        {/* Similar Products Section */}
        <SimilarProducts products={similarProducts} locale={locale} />

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org/",
              "@type": "Product",
              "name": name,
              "image": product.image_url,
              "description": description,
              "sku": product.id,
              "offers": {
                "@type": "Offer",
                "url": `https://greenseedsagro.in/products/${product.slug}`,
                "priceCurrency": "INR",
                "price": product.price,
                "availability": "https://schema.org/InStock"
              }
            })
          }}
        />
      </div>
    </div>
  );
}
