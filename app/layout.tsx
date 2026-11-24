import type { Metadata } from 'next';
import { Unbounded, Manrope, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Providers from '@/components/Providers';
import Navbar from '@/components/Navbar';

const unbounded = Unbounded({ subsets: ['latin', 'cyrillic'], weight: ['400', '500', '700', '800'], variable: '--font-unbounded', display: 'swap' });
const manrope = Manrope({ subsets: ['latin', 'cyrillic'], variable: '--font-manrope', display: 'swap' });
const jetbrains = JetBrains_Mono({ subsets: ['latin', 'cyrillic'], variable: '--font-jetbrains', display: 'swap' });

export const metadata: Metadata = {
  title: { default: 'AI-Академия — 53 урока по ИИ на русском', template: '%s · AI-Академия' },
  description: '53 урока основного курса, карта профессий, тренажёр промптов, 50 идей и чек-листы. Трекер прогресса и сертификат. По материалам открытой академии AI Mayak (CC BY 4.0).',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${unbounded.variable} ${manrope.variable} ${jetbrains.variable}`}>
      <body>
        <Providers>
          <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:bg-accent focus:text-bg-base focus:px-4 focus:py-2 focus:rounded-lg focus:font-bold">К содержимому</a>
          <Navbar />
          <main id="main">{children}</main>
        </Providers>
      </body>
    </html>
  );
}