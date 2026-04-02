import { supabase } from '@/lib/supabase';
import { Link } from '@/i18n/routing';
import { unstable_noStore as noStore } from 'next/cache';

export interface PromoBannerRow {
  id: string;
  badge_text: string | null;
  badge_color: string;
  heading: string;
  subheading: string | null;
  button_text: string;
  button_link: string;
  bg_color: string;
  bg_image_url: string | null;
  bg_overlay: number;
  text_color: string;
  is_active: boolean;
  updated_at: string;
}

export default async function PromoBanner() {
  // Opt out of static caching for this request
  noStore();

  const { data, error } = await supabase
    .from('promo_banner')
    .select('*')
    .limit(1)
    .single();

  if (error || !data) {
    // If table doesn't exist or row missing, or error, return null to avoid breaking page
    return null;
  }

  const banner = data as PromoBannerRow;

  if (!banner.is_active) {
    return null;
  }

  // Calculate overlay styling if image exists
  const overlayStyle = banner.bg_image_url ? {
    backgroundColor: banner.bg_color,
    opacity: banner.bg_overlay,
  } : {};

  return (
    <section
      style={{
        minHeight: '280px',
        padding: '60px 24px',
        backgroundColor: banner.bg_image_url ? 'transparent' : banner.bg_color,
        backgroundImage: banner.bg_image_url ? `url(${banner.bg_image_url})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative'
      }}
      className="w-full flex justify-center items-center overflow-hidden"
    >
      {/* Overlay */}
      {banner.bg_image_url && (
        <div
          className="absolute inset-0 z-0"
          style={{ backgroundColor: banner.bg_color, opacity: banner.bg_overlay }}
        />
      )}

      {/* Content wrapper */}
      <div className="relative z-10 w-full max-w-[800px] flex flex-col items-center">
        {/* Badge */}
        {banner.badge_text && (
          <span
            className="font-dm-sans font-bold text-[12px] uppercase tracking-[1px] px-[16px] py-[6px] rounded-full mb-[16px] inline-block text-white"
            style={{ backgroundColor: banner.badge_color }}
          >
            {banner.badge_text}
          </span>
        )}

        {/* Heading */}
        <h2
          className="font-playfair text-[36px] md:text-[52px] font-bold mb-[16px] text-center leading-[1.2]"
          style={{ color: banner.text_color }}
        >
          {banner.heading}
        </h2>

        {/* Subheading */}
        {banner.subheading && (
          <p
            className="font-dm-sans text-[16px] opacity-85 text-center w-full max-w-[560px] mx-auto mb-[28px] leading-[1.6]"
            style={{ color: banner.text_color }}
          >
            {banner.subheading}
          </p>
        )}

        {/* Button - using Tailwind variables dynamically by injecting style */}
        <style dangerouslySetInnerHTML={{
          __html: `
          .promo-btn {
            background-color: #FFFFFF;
            color: ${banner.bg_color};
            font-family: 'DM Sans', sans-serif;
            font-weight: 600;
            font-size: 15px;
            padding: 13px 28px;
            border-radius: 50px;
            border: 2px solid transparent;
            cursor: pointer;
            text-decoration: none;
            transition: all 200ms ease;
            display: inline-block;
          }
          .promo-btn:hover {
            background-color: transparent !important;
            border-color: #FFFFFF !important;
            color: #FFFFFF !important;
          }
        `}} />

        {banner.button_link.startsWith('http') ? (
          <a
            href={banner.button_link}
            target="_blank"
            rel="noopener noreferrer"
            className="promo-btn"
          >
            {banner.button_text}
          </a>
        ) : (
          <Link
            href={banner.button_link as any}
            className="promo-btn"
          >
            {banner.button_text}
          </Link>
        )}
      </div>
    </section>
  );
}
