'use client';

import Image from 'next/image';
import { Product } from '@/lib/api';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Button, buttonVariants } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CldImage } from 'next-cloudinary';

export default function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const locale = useLocale();
  const t = useTranslations('Navigation');

  // Decide which language field to use
  const getLocalizedField = (fieldBase: 'name' | 'description') => {
    if (locale === 'hi') return product[`${fieldBase}_hi` as keyof Product] || product[`${fieldBase}_en` as keyof Product];
    if (locale === 'gu') return product[`${fieldBase}_gu` as keyof Product] || product[`${fieldBase}_en` as keyof Product];
    return product[`${fieldBase}_en` as keyof Product];
  };

  const name = getLocalizedField('name') as string;

  const encodedMessage = encodeURIComponent(`Hi, I'm interested in ${name}. Please share more details.`);
  const waUrl = `https://wa.me/+919879836499?text=${encodedMessage}`;

  return (
    <div className="group flex flex-col bg-white rounded-[20px] p-2.5 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden h-full">
      {/* Image Container (Gray Box) */}
      <div className="relative w-full aspect-[4/3] bg-[#F3F3F3] rounded-[14px] overflow-hidden mb-3">
        {product.has_offer && product.offer_label && (
          <div className="absolute top-2.5 left-2.5 z-10">
            <Badge className="bg-red-500 rounded-full hover:bg-red-600 text-white border-none px-2.5 py-0.5 text-[9px] font-bold shadow-sm">
              {product.offer_label}
            </Badge>
          </div>
        )}

        <div className="absolute inset-0">
          {product.public_id ? (
            <CldImage
              src={product.public_id}
              alt={name}
              width={350}
              height={260}
              crop="fill"
              priority={priority}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <Image
              src={product.image_url}
              alt={name}
              fill
              priority={priority}
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(min-width: 1024px) 20vw, (min-width: 768px) 33vw, 50vw"
            />
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-col flex-grow px-0.5">
        <h3 className="text-base font-bold text-gray-900 mb-1 line-clamp-1">
          {name}
        </h3>

        <div className="flex items-center gap-1.5 mb-3">
          <span className="text-gray-500 text-xs font-medium">Price:</span>
          <span className="text-gray-900 text-base font-bold">₹{product.price}</span>
          {product.category && (
            <span className="ml-auto text-[8px] font-bold tracking-widest text-zinc-400 uppercase">
              {product.category}
            </span>
          )}
        </div>

        {/* Buttons Section */}
        <div className="flex gap-2 mt-auto">
          <Link
            href={`/products/${product.slug}`}
            className="flex-1 rounded-full bg-[#F5F5F5] text-gray-900 font-bold text-center py-2 md:py-2.5 text-[10px] md:text-[11px] transition-all hover:bg-gray-200 active:scale-95 flex items-center justify-center whitespace-nowrap px-1"
          >
            Details
          </Link>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group/wa flex-[0.6] sm:flex-1 rounded-full bg-white border border-[#25D366] text-[#1A2B1C] font-bold text-center py-2 md:py-2.5 text-[10px] md:text-[11px] transition-all hover:bg-[#25D366] hover:text-white active:scale-95 flex items-center justify-center gap-1.5 px-2 md:px-3 min-w-[40px]"
          >
            <MessageCircle className="w-4 h-4 text-[#25D366] group-hover/wa:text-white transition-colors" />
            <span className="hidden sm:inline whitespace-nowrap">Chat on WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}



