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
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "pk_test_Y2xlcmstZW1waXJlLWR1bW15LWtleS0wMTAxMDE="}
      localization={koKR}
    >
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
