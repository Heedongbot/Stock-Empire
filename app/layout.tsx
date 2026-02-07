import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import BreakingNewsToast from "./components/BreakingNewsToast";

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Stock Empire HQ",
  description: "0 to 100 Million: Zero Capital Automated Investment System",
};

export const dynamic = 'force-dynamic';

import { ClerkProvider } from "@clerk/nextjs";
import { AuthProvider } from "@/lib/AuthContext";
import Script from "next/script";
import TickerTape from "@/components/TickerTape";
import { koKR, enUS } from "@clerk/localizations";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (!publishableKey) {
    return (
      <html lang="ko">
        <body style={{ margin: 0 }}>
          <div style={{ padding: '20px', textAlign: 'center', background: '#0a0a0a', color: '#00ff41', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', fontFamily: 'monospace' }}>
            <h2>[SYSTEM] SECURITY KEY MISSING</h2>
            <p>Vercel 환경 변수가 아직 로드되지 않았습니다.</p>
            <p><small>Vercel Settings > Environment Variables에서 <br />NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY를 확인해주세요.</small></p>
          </div>
        </body>
      </html>
    );
  }

  return (
    <ClerkProvider publishableKey={publishableKey} localization={koKR}>
      <html lang="ko" suppressHydrationWarning>
        <head>
          <script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9538835439937351"
            crossOrigin="anonymous"
          ></script>
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <AuthProvider>
            <TickerTape />
            {children}
            <BreakingNewsToast />
          </AuthProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
