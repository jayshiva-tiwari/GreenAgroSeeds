'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { Product } from '@/lib/api';
import { Link } from '@/i18n/routing';
import { ArrowLeft, ArrowRight, Plus } from 'lucide-react';
import { CldImage } from 'next-cloudinary';

export default function SimilarProducts({ products, locale }: { products: Product[], locale: string }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -340, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 340, behavior: 'smooth' });
    }
  };

  if (!products || products.length === 0) return null;

  return (
    <div className="mt-24 pt-16 border-t font-sans">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 pl-4 md:pl-0">
        
        {/* Left Column - Intro Header */}
        <div className="lg:w-1/4 flex flex-col justify-between shrink-0 mb-6 lg:mb-0">
          <div>
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-900 text-white mb-6">
              <Plus strokeWidth={2.5} className="w-6 h-6" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#111] leading-tight mb-4 tracking-tight">
              Similar<br />Products
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-sm">
              Explore more fresh and high-quality items handpicked for you.
            </p>
          </div>
          
          <div className="hidden lg:flex gap-3">
            <button 
              onClick={scrollLeft}
              className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-slate-900 hover:text-white hover:border-transparent transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={scrollRight}
              className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center hover:bg-slate-800 transition-all shadow-md"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Right Column - Cards Carousel */}
        <div 
          ref={scrollRef}
          className="lg:w-3/4 flex overflow-x-auto gap-4 md:gap-6 lg:gap-8 pb-8 snap-x snap-mandatory hide-scrollbar pr-4 lg:pr-12"
        >
          {products.map((product, index) => {
            const name = locale === 'hi' ? product.name_hi || product.name_en : locale === 'gu' ? product.name_gu || product.name_en : product.name_en;
            
            return (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="group shrink-0 w-[280px] md:w-[320px] snap-start flex flex-col gap-4"
              >
                {/* Image Container with high border-radius */}
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] bg-[#f8f9fa] shadow-sm transform transition-transform duration-500 will-change-transform group-hover:-translate-y-1">
                  {product.public_id ? (
                    <CldImage
                      src={product.public_id}
                      alt={name}
                      width={400}
                      height={500}
                      crop="fill"
                      gravity="auto"
                      className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <Image
                      src={product.image_url}
                      alt={name}
                      fill
                      className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                      sizes="(min-width: 768px) 320px, 280px"
                    />
                  )}
                  {/* Optional Overlay gradient for premium feel */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {product.has_offer && product.offer_label && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                      {product.offer_label}
                    </div>
                  )}
                </div>
                
                {/* Text section */}
                <div className="flex items-start justify-between px-2 pt-1">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-semibold text-muted-foreground tracking-widest">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <h3 className="font-semibold text-lg text-slate-800 group-hover:text-black transition-colors leading-tight">
                      {name}
                    </h3>
                  </div>
                  <span className="font-bold text-lg text-slate-900">
                    ₹{product.price}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
      
      {/* Mobile arrows */}
      <div className="flex lg:hidden gap-3 px-4 justify-end -mt-4 mb-4">
        <button 
          onClick={scrollLeft}
          className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 active:bg-slate-900 active:text-white transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <button 
          onClick={scrollRight}
          className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center hover:bg-slate-800 transition-all shadow-md"
        >
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
