import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getTranslations, getMessages } from 'next-intl/server';
import { Analytics } from '@vercel/analytics/react';
import { GoogleAnalytics } from '@next/third-parties/google';
import PageNavbar from "./components/PageNavbar";
import PageFooter from "./components/PageFooter";

import "./globals.css";
import CookieBanner from "./components/CookieBanner";

const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata(props: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });
  const baseUrl = 'https://techstackscale.com';

  return {
    title: {
      default: t('title'),
      template: `%s | TechStackScale`
    },
    description: t('description'),
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        'es': `${baseUrl}/es`,
        'en': `${baseUrl}/en`,
        'fr': `${baseUrl}/fr`,
        'x-default': `${baseUrl}/es`,
      },
    },

    icons: {
      icon: [
        { url: '/favicon.ico' },
        { url: '/favicon.ico', sizes: '32x32', type: 'image/png' },
      ],
      apple: [
        { url: '/favicon.ico', sizes: '180x180', type: 'image/png' },
      ],
    },

    verification: {
      google: 'jECji1cqX_NVvCBQS9Hia3VdmSEBl4gfrP9jB5fmr-4',
    },

    keywords: t('keywords').split(','),
    authors: [{ name: "TechStackScale Team" }],

    openGraph: {
      title: t('title'),
      description: t('description'),
      url: `${baseUrl}/${locale}`,
      siteName: 'TechStackScale',
      locale: locale,
      type: 'website',
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: 'TechStackScale - Cloud Infrastructure Comparison',
        },
      ],
    },

    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
      images: ['/og-image.png'],
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={`${inter.className} antialiased`}>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <PageNavbar />
          <div className="bg-metallic">
            <main>
              {children}
            </main>

            <PageFooter />
          </div>
          <CookieBanner locale={locale} />
        </NextIntlClientProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "TechStackScale",
              "description": "Cloud Infrastructure Price Comparison",
              "url": "https://techstackscale.vercel.app",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://techstackscale.vercel.app/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
        <Analytics />
        <GoogleAnalytics gaId="G-9D5KFZ39QX" />
      </body>
    </html>
  );
}