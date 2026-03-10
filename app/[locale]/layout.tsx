import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import PageNavbar from "./components/Navbar";
import PageFooter from "./components/PageFooter";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TechStackScale | Compare Cloud Costs",
  description: "Real-time infrastructure cost comparison tool",
};

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

          <main>
            {children}
          </main>

          <div className="bg-metallic">
            <PageFooter />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}