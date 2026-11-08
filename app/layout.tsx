import type { Metadata, Viewport } from 'next';
import { Fraunces, Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';

const display = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  weight: ['300', '400', '500', '600'],
  display: 'swap',
});

const sans = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const siteUrl = 'https://aurelia-estates.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Aurelia Estates — Your Land. Your Legacy.',
    template: '%s — Aurelia Estates',
  },
  description:
    'Aurelia Estates is a fictional 50-plot planned residential township: titled parcels, 30 ft internal roads, a landscaped central park and a single gated entry on a 60 ft connect. Explore every plot in an interactive 3D master plan.',
  keywords: [
    'plotted development',
    'residential township',
    '3D master plan',
    'Aurelia Estates',
    'demo real estate experience',
  ],
  authors: [{ name: 'Aurelia Estates — design demonstration' }],
  openGraph: {
    type: 'website',
    url: siteUrl,
    siteName: 'Aurelia Estates',
    title: 'Aurelia Estates — Your Land. Your Legacy.',
    description:
      'Fifty titled parcels, 30 ft internal roads, a central park and a gated entrance — explored in a real-time 3D master plan.',
    images: [{ url: '/og.jpg', width: 1200, height: 630, alt: 'Aurelia Estates master plan' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aurelia Estates — Your Land. Your Legacy.',
    description: 'A 50-plot planned township explored in a real-time 3D master plan.',
    images: ['/og.png'],
  },
  robots: { index: false, follow: false },
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
    apple: [{ url: '/favicon.svg' }],
  },
};

export const viewport: Viewport = {
  themeColor: '#16211c',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Place',
  name: 'Aurelia Estates',
  description:
    'A fictional 50-plot plotted residential township with 30 ft internal roads, a landscaped central park and a gated entrance.',
  slogan: 'Your Land. Your Legacy.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Aurelia belt (illustrative)',
    addressCountry: 'IN',
  },
  amenityFeature: [
    { '@type': 'LocationFeatureSpecification', name: '50 titled plots', value: true },
    { '@type': 'LocationFeatureSpecification', name: '30 ft internal roads', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Central park', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Gated entrance', value: true },
  ],
  disclaimer:
    'Fictional demonstration. Prices, location, availability and legal status are illustrative only.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body className="bg-bone text-ink antialiased">
        <a
          href="#master-plan"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-ink focus:px-4 focus:py-2 focus:text-bone"
        >
          Skip to the interactive master plan
        </a>
        {children}
        <Script src="/arena-picker.js" strategy="afterInteractive" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
