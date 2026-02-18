import type { Metadata, Viewport } from 'next';
import { Nunito } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { ConvexClientProvider } from './ConvexClientProvider';
import './globals.css';

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800', '900'],
  variable: '--font-nunito',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#87CEEB',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: 'CloudPeek 🌤️ — Identify Clouds!',
  description: 'Point your camera at the sky and discover what clouds you see! Fun for kids of all ages.',
  openGraph: {
    title: 'CloudPeek 🌤️',
    description: 'Identify clouds with AI — collect them all!',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" className={nunito.variable}>
        <body className={`${nunito.className} antialiased`}>
          <ConvexClientProvider>
            {children}
          </ConvexClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
