import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { WhatsNew } from "@/components/whats-new";
import { Analytics } from "@vercel/analytics/react";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          {children}
          <WhatsNew />
          <Toaster />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
