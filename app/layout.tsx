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
            <h2 style={{ color: '#ff4d4d' }}>[SYSTEM] SECURITY KEY MISSING</h2>
            <div style={{ border: '1px solid #333', padding: '20px', display: 'inline-block', margin: '0 auto', textAlign: 'left', maxWidth: '500px' }}>
              <p>⚠️ <strong>원인:</strong> Clerk 통신용 열쇠(Publishable Key)를 찾을 수 없습니다.</p>
              <p>📌 <strong>조치 방법:</strong></p>
              <ol style={{ fontSize: '0.85rem', lineHeight: '1.6', color: '#ccc' }}>
                <li>Vercel {" > "} Settings {" > "} Environment Variables 이동</li>
                <li><code>NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</code> 이름 확인 (오타 주의)</li>
                <li><strong>Production, Preview, Development</strong> 전체 체크 확인</li>
                <li>저장 후 <strong>Redeploy</strong> (캐시 없이) 실행</li>
              </ol>
              <p style={{ fontSize: '0.8rem', color: '#888', marginTop: '15px' }}>※ 브라우저가 현재 환경 변수를 전혀 읽지 못하고 있습니다.</p>
            </div>
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
