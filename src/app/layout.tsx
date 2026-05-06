import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Analytics } from "@vercel/analytics/react";
import { LanguageProvider } from "@/lib/i18n/context";
import { getLocale } from "@/lib/i18n/server";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

const siteUrl = 'https://sprout-rose.vercel.app';
const ADSENSE_FALLBACK_CLIENT_ID = 'ca-pub-3719155026592660';
const adsenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID ?? ADSENSE_FALLBACK_CLIENT_ID;

export const metadata: Metadata = {
  title: "Sprout 🌱 - 夫婦で育てる、新しい命の準備",
  description: "妊活から育児まで、80以上のエビデンス付きチェックリストを夫婦で共有・管理できる無料アプリ。出産予定日からの自動スケジュール機能付き。",
  metadataBase: new URL(siteUrl),
  manifest: '/manifest.json',
  keywords: ['妊活', '出産準備', '産後', '育児', 'チェックリスト', '夫婦', 'マタニティ', 'ベビー準備'],
  icons: {
    icon: '/favicon.svg',
    apple: '/icons/icon-192.png',
  },
  openGraph: {
    title: 'Sprout 🌱 - 夫婦で育てる、新しい命の準備',
    description: '妊活から育児まで、80以上のエビデンス付きチェックリストを夫婦で共有・管理。登録無料。',
    url: siteUrl,
    siteName: 'Sprout',
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sprout 🌱 - 夫婦で育てる、新しい命の準備',
    description: '妊活から育児まで、80以上のチェックリストを夫婦で共有・管理。',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Sprout',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  return (
    <html
      lang={locale === 'zh' ? 'zh-CN' : locale}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {adsenseClientId && (
          <Script
            id="sprout-adsense-site-verification"
            strategy="beforeInteractive"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientId}`}
            crossOrigin="anonymous"
          />
        )}
        <ThemeProvider>
          <LanguageProvider initialLocale={locale}>
            {children}
          </LanguageProvider>
          <Toaster />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
