'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTransition } from 'react';
import { cn } from '@/lib/utils';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function onSelectChange(nextLocale: string) {
    if (nextLocale === locale) return;
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  }

  return (
    <div suppressHydrationWarning>
      <DropdownMenu>
        <DropdownMenuTrigger
          disabled={isPending}
          className="font-bold text-black hover:text-gray-500 transition-colors uppercase outline-none text-sm md:text-base tracking-widest bg-transparent border-none cursor-pointer"
        >
          {locale}
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="min-w-[140px] bg-white border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded-xl p-1 z-[200]"
        >
          <DropdownMenuItem
            onClick={() => onSelectChange('en')}
            className={cn(
              "flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer",
              locale === 'en' ? "bg-earthGreen/10 text-earthGreen" : "text-gray-600 hover:bg-gray-50"
            )}
          >
            <span className="flex items-center gap-2">🇬🇧 English</span>
            {locale === 'en' && <div className="w-1.5 h-1.5 rounded-full bg-earthGreen" />}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onSelectChange('hi')}
            className={cn(
              "flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer",
              locale === 'hi' ? "bg-earthGreen/10 text-earthGreen" : "text-gray-600 hover:bg-gray-50"
            )}
          >
            <span className="flex items-center gap-2">🇮🇳 हिन्दी (HI)</span>
            {locale === 'hi' && <div className="w-1.5 h-1.5 rounded-full bg-earthGreen" />}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onSelectChange('gu')}
            className={cn(
              "flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer",
              locale === 'gu' ? "bg-earthGreen/10 text-earthGreen" : "text-gray-600 hover:bg-gray-50"
            )}
          >
            <span className="flex items-center gap-2">🇮🇳 ગુજરાતી (GU)</span>
            {locale === 'gu' && <div className="w-1.5 h-1.5 rounded-full bg-earthGreen" />}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
