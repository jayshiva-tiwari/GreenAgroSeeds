import type { Metadata } from 'next';
import { Inter, Noto_Sans_Devanagari, Noto_Sans_Gujarati } from 'next/font/google';
import '@/app/globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const hindi = Noto_Sans_Devanagari({ subsets: ['devanagari'], weight: ['400', '700'], variable: '--font-hindi' });
const gujarati = Noto_Sans_Gujarati({ subsets: ['gujarati'], weight: ['400', '700'], variable: '--font-gujarati' });

export const metadata: Metadata = {
  title: 'Admin Dashboard | Green Seeds Agro',
  description: 'Manage products and view analytics'
};

export default function AdminRootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={`${inter.variable} ${hindi.variable} ${gujarati.variable} font-sans min-h-screen bg-slate-50 text-slate-900 flex flex-col`} suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  );
}
