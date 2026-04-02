'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { ShieldCheck, Award, Heart, TrendingUp, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-warmCream">
      {/* Hero Section */}
      {/* <section className="relative h-[40vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 text-center text-white px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            About Us
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl font-light opacity-90 max-w-2xl mx-auto"
          >
            Rooted in tradition, grown for the future. We bring the best of Indian agriculture to the world.
          </motion.p>
        </div>
      </section> */}

      {/* Our Story Section */}
      <section className="py-20 md:py-32 px-4 md:px-6 bg-[#f8f9fa] overflow-hidden">
        <div className="container mx-auto max-w-[1200px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">

            {/* Left side: Images Layout */}
            <div className="relative w-full aspect-square sm:aspect-[4/3] lg:aspect-square flex-shrink-0">
              {/* Green backdrop shape */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="absolute left-[12%] top-[15%] w-[45%] h-[40%] bg-[#009639] rounded-tl-2xl rounded-br-2xl"
              />

              {/* Large background image - Tractor */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="absolute right-0 top-0 w-[75%] h-[75%] rounded-3xl overflow-hidden shadow-sm"
              >
                <Image
                  src="https://images.unsplash.com/photo-1594117782204-5c398aa0e330?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Agriculture Farming"
                  fill
                  className="object-cover"
                />
              </motion.div>

              {/* Smaller foreground image - Woman Farmer */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="absolute left-0 bottom-4 sm:bottom-8 w-[60%] h-[60%] rounded-3xl overflow-hidden shadow-2xl border-[4px] md:border-[6px] border-white z-10"
              >
                <Image
                  src="https://images.unsplash.com/photo-1710563159928-83611beece71?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Happy Farmer"
                  fill
                  className="object-cover"
                />
              </motion.div>
            </div>

            {/* Right side: Content */}
            <div className="flex flex-col">
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-amber-500 text-xl font-medium mb-2 italic"
                style={{ fontFamily: "'Caveat', cursive, serif" }}
              >
                Get to Know us
              </motion.span>

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-3xl md:text-5xl lg:text-[3.5rem] font-bold text-[#1f2922] leading-[1.1] mb-6 md:mb-8"
              >
                The Best Agriculture Market
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-[#4CAF50] font-semibold text-base md:text-[1.1rem] mb-6 leading-relaxed"
              >
                Direct farm partnerships ensuring the highest return for farmers and best quality for you.
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="text-gray-500 text-sm md:text-[1rem] leading-relaxed mb-6 md:mb-8"
              >
                We specialize in sourcing premium seeds and organic produce from local Indian farms. Our mission is to bridge the gap between traditional wisdom and modern health standards.
              </motion.p>

              <motion.ul
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="space-y-4 mb-8 md:mb-10"
              >
                {[
                  'Certified seeds from reliable sources',
                  '100% chemical-free organic farming',
                  'Sustainable logistics & export quality'
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                      <svg className="w-5 h-5 text-[#a8b927]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-[#1f2922] font-semibold text-sm md:text-base">{item}</span>
                  </li>
                ))}
              </motion.ul>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
              >
                <Link href="/products" className="inline-block bg-[#4CAF50] hover:bg-[#43a047] text-white px-8 py-3.5 rounded-md font-medium transition-colors shadow-sm text-sm">
                  Discover More
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="relative py-20 md:py-24 px-4 md:px-6 overflow-hidden bg-[#F8F9F8]">
        {/* Abstract Blur Backgrounds matching the image style */}
        <div className="absolute top-0 right-0 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-[#dcfce7] rounded-full blur-[80px] md:blur-[120px] opacity-40 -translate-y-1/3 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-[#fef3c7] rounded-full blur-[80px] md:blur-[120px] opacity-40 translate-y-1/3 -translate-x-1/3 pointer-events-none" />

        <div className="container mx-auto relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16 md:mb-20">
            <span className="text-[#009639] uppercase tracking-[0.2em] text-[10px] md:text-xs font-bold mb-4 block">
              GREEN SEEDS AGRO
            </span>
            <h2 className="text-3xl md:text-5xl font-serif text-[#1A1C1A] mb-6">
              Mission & <span className="italic text-[#009639]">Values</span>
            </h2>
            <p className="text-sm md:text-base font-medium text-gray-500 leading-relaxed max-w-2xl mx-auto">
              Since our inception, Green Seeds Agro has been committed to sustainable farming practices, delivering chemical-free legacy produce.
            </p>
          </div>

          <div className="flex overflow-x-auto gap-6 sm:grid sm:grid-cols-2 lg:grid-cols-4 lg:gap-8 pb-8 sm:pb-0 hide-scrollbar snap-x snap-mandatory">
            {[
              {
                icon: Heart,
                title: 'Passion',
                desc: 'Farming is not just our business, it is our heritage and passion.',
                iconBg: 'bg-[#e8f5e9]',
                iconColor: 'text-[#009639]'
              },
              {
                icon: ShieldCheck,
                title: 'Integrity',
                desc: '100% transparency from seed to harvest.',
                iconBg: 'bg-[#e0f2fe]',
                iconColor: 'text-[#0284c7]'
              },
              {
                icon: Award,
                title: 'Quality',
                desc: 'Export-grade quality standards maintained globally.',
                iconBg: 'bg-[#ffedd5]',
                iconColor: 'text-[#ea580c]'
              },
              {
                icon: TrendingUp,
                title: 'Sustainability',
                desc: 'Eco-friendly practices to protect our mother earth.',
                iconBg: 'bg-[#ecfccb]',
                iconColor: 'text-[#65a30d]'
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white p-7 md:p-10 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50 text-left hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 w-[260px] sm:w-auto shrink-0 snap-center"
              >
                <div className={`w-12 h-12 md:w-14 md:h-14 ${item.iconBg} ${item.iconColor} rounded-2xl flex items-center justify-center mb-6 md:mb-8`}>
                  <item.icon className="w-6 h-6 md:w-7 md:h-7" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-[#1A1C1A] mb-3 md:mb-4">{item.title}</h3>
                <p className="text-gray-500 text-xs md:text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-[#F8F9F8] px-4 md:px-6">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl md:text-5xl font-bold text-[#1A1C1A] mb-12 text-center">Our Journey</h2>
          <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-lightGreen before:to-transparent">
            {[
              { year: '1995', title: 'Humble Beginnings', desc: 'Started with 5 acres of family-owned land in Gujarat.' },
              { year: '2005', title: 'Organic Transition', desc: 'Completely eliminated chemical fertilizers and adopted 100% organic farming.' },
              { year: '2015', title: 'Export Operations', desc: 'Began exporting premium spices and grains to the Middle East & Europe.' },
              { year: '2025', title: 'Digital Transformation', desc: 'Launched direct-to-consumer platform bridging the gap between farm and table.' }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
              >
                <div className="hidden md:block w-5/12" />
                <div className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full border-4 border-white bg-earthGreen text-warmCream font-bold shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 text-[10px] md:text-xs">
                  {item.year.slice(-2)}'
                </div>
                <div className="w-[calc(100%-2.5rem)] md:w-5/12 ml-4 md:ml-0 px-4 py-3 bg-warmCream rounded-xl border shadow-sm">
                  <span className="font-bold text-earthGreen text-base md:text-lg">{item.year}</span>
                  <h4 className="font-bold text-base md:text-lg mb-1">{item.title}</h4>
                  <p className="text-muted-foreground text-xs md:text-sm">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="relative py-20 md:py-24 px-4 md:px-6 bg-[#f8f9f8] overflow-hidden">
        {/* Subtle grid background matching the original image */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px]"></div>

        <div className="container mx-auto relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
            <span className="text-[#009639] uppercase tracking-[0.2em] text-[10px] md:text-xs font-bold mb-4 block">
              OUR PEOPLE
            </span>
            <h2 className="text-3xl md:text-5xl font-serif text-[#1A1C1A] mb-6">
              Leadership <span className="italic text-[#009639]">Team</span>
            </h2>
          </div>

          <div className="flex overflow-x-auto gap-6 sm:grid sm:grid-cols-2 lg:grid-cols-4 pb-8 sm:pb-0 hide-scrollbar snap-x snap-mandatory">
            {[
              { name: 'Ramesh Patel', role: 'Founder & CEO', img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=600' },
              { name: 'Anita Sharma', role: 'Head of Quality', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600' },
              { name: 'Vikram Singh', role: 'Director', img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=600' },
              { name: 'Priya Desai', role: 'Chief Agronomist', img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=600' }
            ].map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="relative group rounded-xl bg-[#f4f4f4] overflow-hidden w-[240px] sm:w-auto shrink-0 snap-center"
              >
                {/* Image Container */}
                <div className="aspect-[4/5] w-full relative">
                  <Image
                    src={member.img}
                    alt={member.name}
                    fill
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                </div>

                {/* Info Overlay Box - Frosted Glass */}
                <div className="absolute left-3 right-3 bottom-3 md:left-4 md:right-4 md:bottom-4 bg-white/80 backdrop-blur-md p-4 md:p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 rounded-xl group-hover:bg-white/95 border border-white/20">
                  <h3 className="text-base md:text-xl font-bold text-[#1A1C1A] mb-0.5 md:mb-1">{member.name}</h3>
                  <p className="text-[10px] md:text-sm font-medium text-gray-500">{member.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
