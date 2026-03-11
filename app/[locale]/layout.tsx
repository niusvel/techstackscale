import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getTranslations, getMessages } from 'next-intl/server';
import { Analytics } from '@vercel/analytics/react';
import { GoogleAnalytics } from '@next/third-parties/google';
import PageNavbar from "./components/Navbar";
import PageFooter from "./components/PageFooter";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata(props: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  return {
    title: {
      default: t('title'),
      template: `%s | TechStackScale`
    },
    description: t('description'),
    icons: {
      icon: '/favicon.ico',
      shortcut: '/favicon.ico',
      apple: '/favicon.ico',
    },
    verification: {
      google: 'jECji1cqX_NVvCBQS9Hia3VdmSEBl4gfrP9jB5fmr-4',
    },
    keywords: ["cloud prices", "hosting comparison", "Hetzner vs DigitalOcean", "VPS 2026"],
    authors: [{ name: "TechStackScale Team" }],
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: 'https://techstackscale.vercel.app',
      siteName: 'TechStackScale',
      locale: locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
    },
    robots: {
      index: true,
      follow: true,
    }
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
        </NextIntlClientProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ComparisonWebSite",
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