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

import React from "react";
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
  // --- SURVIVOR MODE: Manual Fallback ---
  const [manualKey, setManualKey] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedKey = localStorage.getItem('EMPIRE_CLERK_KEY_OVERRIDE');
      if (savedKey) setManualKey(savedKey);
    }
  }, []);

  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || manualKey;

  if (!publishableKey) {
    const publicEnvVars = typeof window !== 'undefined'
      ? Object.keys(process.env).filter(key => key.startsWith('NEXT_PUBLIC'))
      : [];

    const handleManualInput = () => {
      const key = prompt('Clerk Publishable Key를 직접 입력해주세요 (pk_test_...):');
      if (key && key.startsWith('pk_')) {
        localStorage.setItem('EMPIRE_CLERK_KEY_OVERRIDE', key);
        window.location.reload();
      } else if (key) {
        alert('올바른 형식의 키가 아닙니다. pk_로 시작하는 키를 입력해주세요.');
      }
    };

    return (
      <html lang="ko">
        <body style={{ margin: 0 }}>
          <div style={{ padding: '20px', textAlign: 'center', background: '#0a101f', color: '#00ffbd', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', fontFamily: 'monospace' }}>
            <div style={{ maxWidth: '600px', margin: '0 auto', background: '#121b2d', padding: '40px', borderRadius: '24px', border: '2px solid #ff4d4d', boxShadow: '0 0 50px rgba(255, 77, 77, 0.2)' }}>
              <h2 style={{ color: '#ff4d4d', fontSize: '1.5rem', marginBottom: '20px' }}>🚨 [CRITICAL] SECURITY KEY MISSING</h2>
              <p style={{ fontSize: '1rem', color: '#ffffff', marginBottom: '30px' }}>Vercel 환경 변수 설정이 완료되지 않았거나, <br />클라이언트 사이드로 전달되지 않았습니다.</p>

              <div style={{ textAlign: 'left', background: '#050b14', padding: '20px', borderRadius: '12px', fontSize: '0.8rem', color: '#888', marginBottom: '30px' }}>
                <p style={{ color: '#00ffbd', fontWeight: 'bold', marginBottom: '10px' }}>🔍 실시간 진단 (Diagnostics):</p>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  <li>🔹 NODE_ENV: {process.env.NODE_ENV}</li>
                  <li>🔹 Detected Keys: <span style={{ color: publicEnvVars.length > 0 ? '#00ffbd' : '#ff4d4d' }}>{publicEnvVars.length > 0 ? publicEnvVars.join(', ') : 'NONE FOUND'}</span></li>
                  <li>🔹 Required: NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</li>
                </ul>
              </div>

              <div style={{ color: '#ccc', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '30px' }}>
                <p><strong>🛠️ 해결 방법:</strong></p>
                <p>1. Vercel Settings {">"} Env Variables 입력 확인</p>
                <p>2. <strong>Redeploy (캐시 해제)</strong> 실행</p>
              </div>

              <button
                onClick={handleManualInput}
                style={{ background: '#ff4d4d', color: 'white', border: 'none', padding: '12px 32px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem', boxShadow: '0 4px 15px rgba(255, 77, 77, 0.4)' }}
              >
                🔐 수동으로 보안 키 입력하여 즉시 입장
              </button>
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
