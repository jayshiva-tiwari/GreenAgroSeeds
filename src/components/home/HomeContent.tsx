'use client';

import { motion } from 'framer-motion';
import { Product } from '@/lib/api';
import ProductCard from '@/components/products/ProductCard';
import { Button, buttonVariants } from '@/components/ui/button';
import { Link } from '@/i18n/routing';
import { ShieldCheck, Leaf, Truck, Users, ArrowRight, Twitter, Linkedin, Github, Mail } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import Testimonials from '@/components/sections/Testimonials';

interface HomeContentProps {
  products: Product[];
  offers: Product[];
  translations: {
    heroTitle: string;
    heroSubtitle: string;
    ctaProducts: string;
    ctaContact: string;
    statsYears: string;
    statsProducts: string;
    statsCities: string;
  };
  promoBanner?: React.ReactNode;
}

export default function HomeContent({ products, offers, translations, promoBanner }: HomeContentProps) {
  return (
    <div className="flex flex-col">
      {/* 1. HERO SECTION */}
      <section className="relative pt-24 sm:pt-32 pb-12 bg-[#F8F9F8] overflow-hidden flex flex-col items-center">
        {/* Subtle background vertical lines */}
        <div className="absolute inset-0 pointer-events-none flex justify-center gap-[20%] opacity-5">
          <div className="w-px h-full bg-black border-r border-dashed border-black"></div>
          <div className="w-px h-full bg-black border-r border-dashed border-black"></div>
          <div className="w-px h-full bg-black border-r border-dashed border-black"></div>
          <div className="w-px h-full bg-black border-r border-dashed border-black"></div>
        </div>

        {/* Decorative Stars */}
        <motion.svg
          animate={{ rotate: 360, opacity: [0.5, 1, 0.5], scale: [1, 1.1, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-24 left-[5%] md:left-[15%] w-5 h-5 md:w-7 md:h-7 text-[#1A4D2E]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 0C12 6.62742 6.62742 12 0 12C6.62742 12 12 17.3726 12 24C12 17.3726 17.3726 12 24 12C17.3726 12 12 6.62742 12 0Z" fill="currentColor" />
        </motion.svg>
        <motion.svg
          animate={{ rotate: -360, opacity: [0.3, 0.8, 0.3], scale: [0.9, 1.2, 0.9] }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          className="absolute top-64 left-[20%] md:left-[25%] w-4 h-4 md:w-5 md:h-5 text-[#1A4D2E]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 0C12 6.62742 6.62742 12 0 12C6.62742 12 12 17.3726 12 24C12 17.3726 17.3726 12 24 12C17.3726 12 12 6.62742 12 0Z" fill="currentColor" />
        </motion.svg>
        <motion.svg
          animate={{ rotate: 360, opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-32 right-[10%] md:right-[20%] w-5 h-5 md:w-6 md:h-6 text-[#1A4D2E]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 0C12 6.62742 6.62742 12 0 12C6.62742 12 12 17.3726 12 24C12 17.3726 17.3726 12 24 12C17.3726 12 12 6.62742 12 0Z" fill="currentColor" />
        </motion.svg>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="z-10 bg-white border border-gray-200 shadow-sm rounded-full px-3 py-1 md:px-4 md:py-1.5 flex items-center gap-2 mb-6 md:mb-8"
        >
          <div className="w-2 h-2 rounded-full bg-green-600"></div>
          <span className="text-[10px] md:text-xs font-bold text-gray-700 tracking-wide uppercase">Sustainable Growth Partners</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-7xl font-bold text-[#1f2922] text-center max-w-[90%] md:max-w-4xl tracking-tight leading-[1.1]"
        >
          Bring Fresh Growth <br className="hidden sm:block" /> To Agriculture.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-4 md:mt-6 text-gray-600 text-center max-w-[85%] md:max-w-2xl font-medium text-sm md:text-base"
        >
          Experience the ultimate agriculture journey with expert seeds, <br className="hidden md:block" /> premium organic produce, and professional farming insights.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 z-10"
        >
          <Link
            href="/products"
            className="bg-[#1a1c1a] hover:bg-black text-white px-6 md:px-8 py-3 md:py-3.5 rounded-full flex items-center gap-2 shadow-xl hover:shadow-2xl transition-all font-medium text-sm md:text-base"
          >
            Get Started <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </section>

      {/* 1.5 BIG IMAGE SECTION */}
      <section className="bg-[#F8F9F8] w-full px-3 md:px-8 pb-12 pt-4 flex justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="relative rounded-[1.5rem] md:rounded-[2rem] overflow-hidden w-full max-w-[1400px] h-[300px] md:h-[600px] shadow-2xl"
        >
          <img
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2000&auto=format&fit=crop"
            alt="Agriculture field"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

          <div className="absolute bottom-6 left-6 md:bottom-12 md:left-12 max-w-[80%] md:max-w-md">
            <h2 className="text-2xl md:text-5xl font-bold text-white leading-tight">
              The Journey to a <br className="hidden md:block" /> Perfection.
            </h2>
          </div>

          <div className="absolute bottom-6 right-6 md:bottom-12 md:right-12 hidden sm:block">
            <span className="text-white md:text-lg font-medium tracking-wide">
              Book a Free Field Visit
            </span>
          </div>
        </motion.div>
      </section>

      {/* 2. STATS SECTION */}
      <section className="bg-[#F8F9F8] pb-16 md:pb-24">
        <div className="container max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-10 md:gap-0 md:divide-x divide-gray-200">
            <div className="flex flex-col text-left md:px-8 border-l md:border-l-0 border-green-200 pl-4 md:pl-8">
              <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1f2922] mb-1 md:mb-2 tracking-tight">50+</span>
              <span className="text-xs md:text-sm text-gray-500 font-semibold tracking-wide uppercase">Experience</span>
            </div>
            <div className="flex flex-col text-left md:px-8 border-l md:border-l-0 border-green-200 pl-4 md:pl-8">
              <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1f2922] mb-1 md:mb-2 tracking-tight">200+</span>
              <span className="text-xs md:text-sm text-gray-500 font-semibold tracking-wide uppercase">Fields</span>
            </div>
            <div className="flex flex-col text-left md:px-8 border-l md:border-l-0 border-green-200 pl-4 md:pl-8">
              <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1f2922] mb-1 md:mb-2 tracking-tight">120k+</span>
              <span className="text-xs md:text-sm text-gray-500 font-semibold tracking-wide uppercase">Farmers</span>
            </div>
            <div className="flex flex-col text-left md:px-8 border-l md:border-l-0 border-green-200 pl-4 md:pl-8">
              <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1f2922] mb-1 md:mb-2 tracking-tight">₹15B</span>
              <span className="text-xs md:text-sm text-gray-500 font-semibold tracking-wide uppercase">Value Produced</span>
            </div>
          </div>
        </div>
      </section>


      {/* 3. FEATURED PRODUCTS SECTION */}
      <section className="py-24 bg-warmCream w-full">
        <div className="container mx-auto px-4 md:px-6 max-w-[1400px]">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <div className="flex flex-col">
              <div className="inline-flex items-center rounded-full bg-[#f1f2f3] px-4 py-1.5 text-sm font-semibold tracking-widest text-[#4a5568] mb-6 w-fit border border-[#e2e8f0]">
                02 FEATURED PRODUCTS
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-5xl font-extrabold tracking-tight text-[#111827] leading-[1.15]">
                Our Top Picks <br /> Handpicked Just For You
              </h2>
            </div>
            <Link
              href="/products"
              className="inline-flex shrink-0 items-center justify-center rounded-full bg-[#111827] px-8 py-4 text-center font-medium text-white transition-all hover:bg-[#1f2937] hover:scale-105 shadow-lg shadow-black/10 text-lg w-full md:w-auto"
            >
              View More Products
            </Link>
          </div>

          <div className="flex overflow-x-auto gap-6 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-8 pb-8 sm:pb-0 hide-scrollbar snap-x snap-mandatory">
            {products.slice(0, 3).map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="min-w-[85%] sm:min-w-0 snap-center"
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. ACTIVE OFFERS BANNER */}
      {promoBanner}

      {/* 5. WHY CHOOSE US */}
      <section className="py-24 bg-[#f8f9fa] relative overflow-hidden">
        <div className="container relative mx-auto px-4 md:px-6 max-w-[1400px]">

          <div className="flex flex-col items-center text-center mb-12 lg:mb-20 relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-[#2d2d2d] tracking-tight">Why Choose Green Seeds Agro?</h2>
          </div>

          <div className="relative">
            {/* Background Dotted Curve SVG */}
            <div className="absolute top-[40%] left-0 w-full -translate-y-1/2 z-0 hidden lg:block pointer-events-none opacity-60">
              <svg width="100%" height="400" viewBox="0 0 1200 400" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                <path
                  d="M-50 100 C 150 400, 350 400, 600 200 C 850 0, 1050 350, 1250 150"
                  stroke="#c5dfd3" strokeWidth="4" strokeDasharray="12 12" strokeLinecap="round"
                />
              </svg>
            </div>

            <div className="flex overflow-x-auto gap-6 lg:grid lg:grid-cols-4 lg:gap-10 relative z-10 pb-8 lg:pb-0 hide-scrollbar snap-x snap-mandatory">
              {[
                { icon: Leaf, title: '100% Organic', desc: 'Certified organic products grown without harmful chemicals.' },
                { icon: ShieldCheck, title: 'Premium Quality', desc: 'Stringent quality checks before reaching your table.' },
                { icon: Truck, title: 'Fast Delivery', desc: 'Direct from farm delivery network across 50+ cities.' },
                { icon: Users, title: 'Farmer First', desc: 'Direct partnership with farmers ensuring fair prices.' },
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className={cn(
                    "group flex flex-col text-left p-8 rounded-xl transition-all duration-300 min-h-[230px] shrink-0",
                    "bg-white shadow-[0_15px_60px_-15px_rgba(0,0,0,0.08)] border border-gray-50",
                    "hover:-translate-y-2 hover:bg-earthGreen hover:shadow-xl hover:shadow-earthGreen/20",
                    "w-[280px] lg:w-auto snap-center",
                    // Stagger translation for wave effect
                    i % 2 !== 0 ? "lg:translate-y-16" : ""
                  )}
                >
                  <div className={cn(
                    "w-12 h-12 flex items-center justify-center rounded-full mb-6 transition-colors duration-300",
                    "bg-[#eef5f0] text-earthGreen group-hover:bg-white/20 group-hover:text-white group-hover:border group-hover:border-white/30"
                  )}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className={cn(
                    "text-xl font-bold mb-3 tracking-wide uppercase text-sm transition-colors duration-300",
                    "text-[#1f2922] group-hover:text-white"
                  )}>
                    {feature.title}
                  </h3>
                  <p className={cn(
                    "text-[15px] leading-relaxed transition-colors duration-300",
                    "text-gray-500 group-hover:text-white/80"
                  )}>
                    {feature.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5.5. TESTIMONIALS */}
      <Testimonials limit={5} />

      {/* 6. LEADERSHIP TEAM SECTION */}
      {/* <section className="w-full overflow-hidden text-[#424851]">

        <div className="bg-white pt-24 pb-0 w-full relative z-10">
          <div className="container mx-auto px-4 md:px-6 max-w-[1000px]">
            <div className="flex flex-col text-left max-w-2xl mb-16 lg:mb-20">
              <h2 className="text-[2.2rem] md:text-[2.5rem] font-bold mb-6">Meet Our Team</h2>

              <p className="text-[1.125rem] text-[#939ca8] font-light leading-relaxed mb-6">
                Green Seeds Agro team leads the digital transformation of modern agriculture through
                <span className="text-[#0088cc] font-medium ml-1.5">innovation</span>,
                <span className="text-[#0088cc] font-medium mx-1.5">sustainable practices</span>,
                <span className="text-[#0088cc] font-medium mr-1.5">expert research</span>,
                <span className="text-[#0088cc] font-medium mr-1.5">logistics</span>,
                <span className="text-[#0088cc] font-medium mr-1.5">tech</span> and direct partnerships.
              </p>

              <p className="text-[1.125rem] text-[#939ca8] font-light leading-relaxed">
                We value integrity, quality, learning, remote work, and open communication.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#f6f8f9] pb-32 w-full pt-16 md:pt-0">
          <div className="container mx-auto px-4 md:px-6 max-w-[1000px]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-24 md:gap-y-8">
              {[
                {
                  name: "Neeraj Singh",
                  role: "FOUNDER & CEO",
                  img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Neeraj",
                },
                {
                  name: "Vipul",
                  role: "DIRECTOR",
                  img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Vipul",
                },
                {
                  name: "Prathamesh",
                  role: "HEAD OF OPERATIONS",
                  img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Prathamesh",
                }
              ].map((member, i) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="bg-white rounded-[1.5rem] md:rounded-t-none md:rounded-b-[1.5rem] shadow-[0_15px_40px_-15px_rgba(0,0,0,0.06)] flex flex-col items-center p-8 pt-24 relative"
                >

                  <div className="absolute -top-[5rem] w-40 h-40 rounded-full bg-[#dcf1fa] flex items-center justify-center overflow-hidden">
                    <img
                      src={member.img}
                      alt={member.name}
                      className="w-full h-full object-cover scale-[1.1] mt-3"
                    />
                  </div>

                  <h3 className="text-[1.3rem] font-bold text-[#424851] mb-1">{member.name}</h3>
                  <p className="text-[11px] font-bold text-[#b4bac4] tracking-[0.15em] uppercase mb-8">{member.role}</p>

                  <div className="flex items-center gap-[18px] mt-auto">
                    <Twitter className="w-[18px] h-[18px] text-[#b4bac4] hover:text-[#0088cc] cursor-pointer transition-colors" />
                    <Linkedin className="w-[18px] h-[18px] text-[#b4bac4] hover:text-[#0088cc] cursor-pointer transition-colors" />
                    <Github className="w-[18px] h-[18px] text-[#b4bac4] hover:text-[#0088cc] cursor-pointer transition-colors" />
                    <Mail className="w-[18px] h-[18px] text-[#b4bac4] hover:text-[#0088cc] cursor-pointer transition-colors" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section> */}
    </div>
  );
}
