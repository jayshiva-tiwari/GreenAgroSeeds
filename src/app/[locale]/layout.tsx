import type { Metadata } from 'next';
import { Manrope, Playfair_Display, DM_Sans, DM_Mono } from 'next/font/google';
import '../globals.css';
import { getMessages } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/layout/WhatsAppButton';
import { routing } from '@/i18n/routing';
import { GoogleAnalytics } from '@next/third-parties/google';
import PageTransition from '@/components/layout/PageTransition';

const manrope = Manrope({ subsets: ['latin'], variable: '--font-sans' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair', weight: ['600', '700'], style: ['normal', 'italic'] });
const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans', weight: ['400', '500', '700'] });
const dmMono = DM_Mono({ subsets: ['latin'], variable: '--font-dm-mono', weight: ['400', '500'] });

export const metadata: Metadata = {
  title: 'Green Seeds Agro | Farm to Table',
  description: 'Premium agricultural products grown with care and dedication by Green Seeds Agro.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/icon.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
  },
  openGraph: {
    title: 'Green Seeds Agro | Farm to Table',
    description: 'Premium agricultural products grown with care and dedication by Green Seeds Agro.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Green Seeds Agro | Farm to Table',
    description: 'Premium agricultural products grown with care and dedication by Green Seeds Agro.',
  }
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning className={`${manrope.variable} ${playfair.variable} ${dmSans.variable} ${dmMono.variable}`}>
      <body className={`font-sans antialiased min-h-screen bg-warmCream text-foreground flex flex-col`} suppressHydrationWarning>
        <NextIntlClientProvider messages={messages}>
          <Navbar />
          <PageTransition>
            <main className="flex-1 w-full relative">
              {children}
            </main>
          </PageTransition>
          <Footer />
          <WhatsAppButton />
        </NextIntlClientProvider>
        <GoogleAnalytics gaId="G-ABCDEFGH12" />
      </body>
    </html>
  );
}
