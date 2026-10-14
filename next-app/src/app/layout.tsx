import type { Metadata } from 'next';
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { AppProvider } from '@/lib/context';

const space = Space_Grotesk({ subsets: ['latin'], weight: ['300','400','500','600','700'], variable: '--font-space' });
const mono = JetBrains_Mono({ subsets: ['latin'], weight: ['400','500'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'Kopi Senja \u2014 Coffee Shop POS / ERP Prototype',
  description: 'Full frontend prototype with owner/cashier separation',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${space.variable} ${mono.variable}`}>
      <body className="font-sans bg-[#F7F6F3] text-[#111] text-base leading-relaxed antialiased">
        <AppProvider>
          <div className="min-h-[100dvh]">{children}</div>
        </AppProvider>
      </body>
    </html>
  );
}
