'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import LanguageSwitcher from './LanguageSwitcher';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Menu, X, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const t = useTranslations('Navigation');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on resize if screen becomes large
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const links = [
    { href: '/', label: t('home') },
    { href: '/about', label: t('about') },
    { href: '/products', label: t('products') },
    { href: '/offers', label: t('offers') },
  ];

  return (
    <header
      className={cn(
        'fixed top-0 z-[100] w-full transition-all duration-500 ease-in-out',
        isScrolled || isOpen
          ? 'py-3 bg-white shadow-lg border-b border-gray-100'
          : 'py-5 bg-transparent'
      )}
    >
      <div className="container mx-auto flex items-center justify-between px-4 md:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 transition-transform duration-200 hover:scale-105 z-[101]"
        >
          <div className="flex flex-col leading-[0.9]">
            <span className="text-[24px] md:text-[26px] font-bold text-[#009639] tracking-tight drop-shadow-sm">
              GREEN
            </span>
            <span
              className={cn(
                'text-[12px] md:text-[14px] font-semibold tracking-wide mt-[-2px] transition-colors duration-300',
                isScrolled || isOpen ? 'text-gray-600' : 'text-[#3b3a36]'
              )}
            >
              SEEDS AGRO
            </span>
          </div>
        </Link>

        {/* Desktop Nav links */}
        <nav className="hidden md:flex gap-8 font-medium">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'relative text-md transition-colors duration-200',
                'after:absolute after:bottom-[-3px] after:left-0 after:h-[1.5px] after:w-0',
                'after:bg-[#009639] after:transition-all after:duration-300 hover:after:w-full',
                isScrolled
                  ? 'text-black hover:text-[#009639]'
                  : 'text-black/85 hover:text-[#009639]'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side items */}
        <div className="flex items-center gap-4 md:gap-6">
          <div className="hidden sm:block">
             <LanguageSwitcher />
          </div>

          <Link
            href="/contact"
            className={cn(
              'hidden md:flex items-center justify-center',
              'font-bold tracking-wide uppercase text-xs md:text-sm',
              'px-5 py-2.5 rounded-lg transition-all duration-200',
              'bg-[#009639] hover:bg-[#007a2e]',
              'text-white hover:scale-[1.03] active:scale-[0.97]'
            )}
          >
            {t('contact')}
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-gray-700 transition-colors z-[101]"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed inset-0 top-0 h-screen w-full bg-white z-[99] pt-24 px-6 flex flex-col"
          >
            <div className="flex flex-col gap-1 mt-4">
              {links.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between py-5 border-b border-gray-50 text-xl font-semibold text-gray-800 hover:text-earthGreen transition-colors"
                  >
                    {link.label}
                    <ChevronRight className="w-5 h-5 text-gray-300" />
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="mt-auto pb-12 flex flex-col gap-6">
              <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl">
                 <span className="font-medium text-gray-600">Select Language</span>
                 <LanguageSwitcher />
              </div>
              
              <Link
                href="/contact"
                onClick={() => setIsOpen(false)}
                className="w-full bg-earthGreen text-white py-4 rounded-xl text-center font-bold text-lg shadow-lg shadow-earthGreen/20"
              >
                {t('contact')}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}