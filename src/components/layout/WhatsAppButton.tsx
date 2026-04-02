'use client';

import { usePathname } from 'next/navigation';
import { MessageCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function WhatsAppButton() {
  const pathname = usePathname();
  const phoneNumber = '+919879836499';
  let message = "Hello! I found your website and I'm interested in your products.";

  if (pathname.includes('/products/')) {
    message = "Hi, I'm interested in the product shown on your website. Please share more details.";
  }

  const encodedMessage = encodeURIComponent(message);
  const waUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

  const handleClick = async () => {
    // Optionally: check if Supabase envs are fully ready before logging, 
    // or just fire and forget if so
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      try {
        await supabase.from('analytics_events').insert({
          event_type: 'whatsapp_click',
          metadata: { path: pathname }
        });
      } catch (err) {
        console.error('Failed to log event', err);
      }
    }
  };

  return (
    <a
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-[100] flex items-center justify-center gap-3 rounded-full bg-white px-4 py-4 sm:px-6 sm:py-3.5 text-[#111] border-2 border-[#111] shadow-[4px_4px_0px_#25D366] transition-all hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_#25D366] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none font-semibold text-lg"
      aria-label="Chat on WhatsApp"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="28"
        height="28"
        className="flex-shrink-0"
        fill="none"
        stroke="#25D366"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        <path d="M16 14.5c-.7-1-1.4-1.1-2.2-.4s-1-.3-1.6-.9c-.6-.6-1.5-1.5-.9-1.6s.6-1.5-.4-2.2c-.6-.3-1.5-.5-2.2-.1-1.3 1-1.3 3.6.4 5.3 1.7 1.7 4.3 1.7 5.3.4.4-.7.2-1.6-.1-2.2z" />
      </svg>
      <span className="hidden sm:inline-block">Chat on WhatsApp</span>
    </a>
  );
}
