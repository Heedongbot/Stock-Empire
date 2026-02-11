import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ClientLayout from './ClientLayout'; // 새로 만든 클라이언트 레이아웃 임포트

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Stock Empire | 100% 자동화 주식 AI 분석 및 매매',
  description: 'AI가 실시간으로 분석하는 미국 주식, 테마별 종목 분석, 그리고 자동 매매 시스템. 감정을 배제한 완벽한 트레이딩을 경험하세요.',
  keywords: ['미국 주식', 'AI 매매', '주식 자동화', '나스닥 분석', '퀀트 투자', 'Stock Empire'],
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://stock-empire.vercel.app', // 실제 배포 URL로 변경 필요
    title: 'Stock Empire - AI 주식 자동화 연구소',
    description: '당신의 주식 투자를 AI가 혁신합니다. 실시간 시그널과 심층 분석 리포트를 무료로 확인하세요.',
    siteName: 'Stock Empire',
    images: [
      {
        url: '/og-image.png', // public 폴더에 이미지 추가 필요
        width: 1200,
        height: 630,
        alt: 'Stock Empire AI Trading System',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Stock Empire | 주식의 미래',
    description: 'AI 기반 실시간 주식 분석 및 자동 매매 플랫폼',
    images: ['/og-image.png'],
  },
  other: {
    'google-adsense-account': 'ca-pub-9538835439937351', // 애드센스 메타 태그
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <meta name="google-adsense-account" content="ca-pub-9538835439937351" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
