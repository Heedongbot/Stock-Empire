'use client';

import React, { useState, useEffect } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { koKR } from "@clerk/localizations";
import { AuthProvider } from "@/lib/AuthContext";
import SiteFooter from "@/components/SiteFooter";
import BottomNav from "@/components/BottomNav";
import InstallPWA from "@/components/InstallPWA";
import VisitorTracker from "@/components/VisitorTracker";
import BreakingNewsToast from "./components/BreakingNewsToast";
import Script from "next/script";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [manualKey, setManualKey] = useState<string | null>(null);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        const savedKey = localStorage.getItem('EMPIRE_CLERK_KEY_OVERRIDE');
        if (savedKey) setManualKey(savedKey);
    }, []);

    const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "pk_test_cmF0aW9uYWwtc2VhZ3VsbC05Ny5jbGVyay5hY2NvdW50cy5kZXYk" || manualKey;

    return (
        <ClerkProvider publishableKey={publishableKey} localization={koKR} afterSignOutUrl="/">
            <AuthProvider>
                <div className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}>
                    <div className="flex-grow">
                        {children}
                    </div>
                    {/* 🔧 플로팅 및 위젯 컴포넌트들 */}
                    <SiteFooter />
                    <BottomNav />
                    <InstallPWA />
                    <VisitorTracker />
                    <BreakingNewsToast />
                </div>

                {/* Google AdSense Script - 최적화된 로딩 */}
                <Script
                    async
                    src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9538835439937351"
                    crossOrigin="anonymous"
                    strategy="afterInteractive"
                />
            </AuthProvider>
        </ClerkProvider>
    );
}
