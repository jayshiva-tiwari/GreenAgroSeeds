import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Twitter, Instagram, Linkedin, Github, Sprout, MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
  const t = useTranslations('Navigation');

  return (
    <footer className="relative bg-[#F8F9F8] pt-20 pb-40 overflow-hidden flex flex-col items-center">
      {/* Background Giant Watermark */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[30%] w-full flex justify-center pointer-events-none select-none z-0">
        <span className="text-[14rem] md:text-[20vw] font-bold text-gray-200/50 leading-none whitespace-nowrap tracking-tighter">
          GREENS
        </span>
      </div>

      {/* Floating White Card */}
      <div className="relative z-10 w-[92%] max-w-7xl bg-white rounded-[2rem] p-8 md:p-12 lg:p-14 shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-gray-100">

        <div className="flex flex-col lg:flex-row justify-between gap-16 lg:gap-8">
          {/* Left Brand Area */}
          <div className="max-w-sm space-y-6">
            <div className="flex flex-col leading-[0.9] select-none">
              <span className="text-[32px] font-black text-[#009639] tracking-tight">GREEN</span>
              <span className="text-[16px] font-bold text-[#1A1C1A] tracking-[0.12em] mt-[-2px]">SEEDS AGRO</span>
            </div>

            <p className="text-gray-500 text-sm leading-relaxed pr-6">
              Premium agricultural products grown with care and dedication in India. We empower farmers to transform raw harvests into premium exports making quality health products easier to share, understand, and act on.
            </p>

            <div className="flex items-center gap-4 text-[#1A1C1A] pt-1">
              {/* Note: In lucide-react, simple X-like icons form logic. X/Twitter, Instagram, etc */}
              <a href="#" className="hover:text-[#009639] transition-transform hover:-translate-y-0.5"><Twitter className="w-4 h-4 fill-current" /></a>
              <a href="#" className="hover:text-[#009639] transition-transform hover:-translate-y-0.5"><Instagram className="w-4 h-4" /></a>
              <a href="#" className="hover:text-[#009639] transition-transform hover:-translate-y-0.5"><Linkedin className="w-4 h-4 fill-current" /></a>
              <a href="#" className="hover:text-[#009639] transition-transform hover:-translate-y-0.5"><Github className="w-4 h-4 fill-current" /></a>
            </div>
          </div>

          {/* Right Links Area */}
          <div className="flex flex-wrap gap-12 sm:gap-16 lg:gap-20">
            <div className="space-y-6">
              <h4 className="font-bold text-[#1A1C1A] text-sm tracking-wide">Company</h4>
              <ul className="space-y-3.5 text-sm font-medium text-gray-400">
                <li><Link href="/" className="hover:text-[#009639] transition-colors">{t('home')}</Link></li>
                <li><Link href="/about" className="hover:text-[#009639] transition-colors">{t('about')}</Link></li>
                <li><Link href="/products" className="hover:text-[#009639] transition-colors">{t('products')}</Link></li>
                <li><Link href="/offers" className="hover:text-[#009639] transition-colors">{t('offers')}</Link></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="font-bold text-[#1A1C1A] text-sm tracking-wide">Support</h4>
              <ul className="space-y-3.5 text-sm font-medium text-gray-400">
                <li><Link href="/contact" className="hover:text-[#009639] transition-colors">{t('contact')}</Link></li>
                <li><a href="/admin" className="hover:text-[#009639] transition-colors">Staff Portal</a></li>
              </ul>
            </div>

            <div className="space-y-6 max-w-[200px]">
              <h4 className="font-bold text-[#1A1C1A] text-sm tracking-wide">Contact Us</h4>
              <ul className="space-y-3.5 text-[13px] font-medium text-gray-400 leading-relaxed">
                <li className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 shrink-0 mt-[2px]" />
                  <span>123 Farm Road, Gujarat, India</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 shrink-0" />
                  <span>+91 98765 43210</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 shrink-0" />
                  <span>contact@greenseedsagro.in</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gray-100 my-8"></div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-xs font-semibold text-gray-400">
          <p>&copy; {new Date().getFullYear()} Green Seeds Agro. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-6">
            {/* <a href="#" className="underline underline-offset-[3px] decoration-gray-300 hover:text-[#009639] hover:decoration-[#009639] transition-colors">Privacy Policy</a> */}
            <a href="https://shiva-portfolio-eight.vercel.app/" className="underline underline-offset-[3px] decoration-gray-300 hover:text-[#009639] hover:decoration-[#009639] transition-colors">Developed by Jayshiva Tiwari</a>
            {/* <a href="#" className="underline underline-offset-[3px] decoration-gray-300 hover:text-[#009639] hover:decoration-[#009639] transition-colors">Cookies Settings</a> */}
          </div>
        </div>

      </div>
    </footer>
  );
}
