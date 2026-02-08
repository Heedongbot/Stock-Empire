'use client';

import React, { useState, useEffect } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { koKR } from "@clerk/localizations";
import { AuthProvider } from "@/lib/AuthContext";
import TickerTape from "@/components/TickerTape";
import BreakingNewsToast from "./components/BreakingNewsToast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [manualKey, setManualKey] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const savedKey = localStorage.getItem('EMPIRE_CLERK_KEY_OVERRIDE');
    if (savedKey) setManualKey(savedKey);
  }, []);

  // 퍼블리셔블 키가 없을 경우 하드코딩된 테스트 키를 사용 (배포 시 환경 변수 누락 방지용)
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "pk_test_cmF0aW9uYWwtc2VhZ3VsbC05Ny5jbGVyay5hY2NvdW50cy5kZXYk" || manualKey;

  // 서버 사이드와 클라이언트 사이드 모두에서 최소한의 HTML 구조를 유지해야 함
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9538835439937351"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {!isClient ? (
          // 하이드레이션 전 로딩 상태 (서버 렌더링용)
          <div style={{ background: '#050b14', height: '100vh' }} />
        ) : !publishableKey ? (
          // 보안 키 실종 시 (서바이버 모드)
          <div style={{ padding: '20px', textAlign: 'center', background: '#0a101f', color: '#00ffbd', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', fontFamily: 'monospace' }}>
            <div style={{ maxWidth: '600px', margin: '0 auto', background: '#121b2d', padding: '40px', borderRadius: '24px', border: '2px solid #ff4d4d', boxShadow: '0 0 50px rgba(255, 77, 77, 0.2)' }}>
              <h2 style={{ color: '#ff4d4d', fontSize: '1.5rem', marginBottom: '20px' }}>🚨 [CRITICAL] SECURITY KEY MISSING</h2>
              <p style={{ fontSize: '1rem', color: '#ffffff', marginBottom: '30px' }}>Vercel 환경 변수 설정이 완료되지 않았거나, <br />클라이언트 사이드로 전달되지 않았습니다.</p>

              <div style={{ textAlign: 'left', background: '#050b14', padding: '20px', borderRadius: '12px', fontSize: '0.8rem', color: '#888', marginBottom: '30px' }}>
                <p style={{ color: '#00ffbd', fontWeight: 'bold', marginBottom: '10px' }}>🔍 실시간 진단 (Diagnostics):</p>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  <li>🔹 NODE_ENV: {process.env.NODE_ENV}</li>
                  <li>🔹 Detected Keys: {Object.keys(process.env).filter(k => k.startsWith('NEXT_PUBLIC')).join(', ') || 'NONE'}</li>
                </ul>
              </div>

              <button
                onClick={() => {
                  const key = prompt('Clerk Publishable Key (pk_...)를 입력해주세요:');
                  if (key?.startsWith('pk_')) {
                    localStorage.setItem('EMPIRE_CLERK_KEY_OVERRIDE', key);
                    window.location.reload();
                  }
                }}
                style={{ background: '#ff4d4d', color: 'white', border: 'none', padding: '12px 32px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                🔐 수동으로 보안 키 입력하여 입장
              </button>
            </div>
          </div>
        ) : (
          // 정상 가동
          <ClerkProvider publishableKey={publishableKey} localization={koKR}>
            <AuthProvider>
              <TickerTape />
              {children}
              <BreakingNewsToast />
            </AuthProvider>
          </ClerkProvider>
        )}
      </body>
    </html>
  );
}
