import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { WhatsNew } from "@/components/whats-new";
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
  description: "妊活・出産準備・産後ケア・育児を夫婦で管理するチェックリストアプリ",
  metadataBase: new URL(siteUrl),
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.svg',
    apple: '/icons/icon-192.png',
  },
  openGraph: {
    title: 'Sprout 🌱 - 夫婦で育てる、新しい命の準備',
    description: '妊活・出産準備・産後ケア・育児を夫婦で管理するチェックリストアプリ',
    url: siteUrl,
    siteName: 'Sprout',
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Sprout 🌱',
    description: '夫婦で育てる、新しい命の準備',
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
        </ThemeProvider>
      </body>
    </html>
  );
}
