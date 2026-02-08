'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Globe, ShieldCheck
} from "lucide-react";
import { translations } from '@/lib/translations';
import { useAuth } from '@/lib/AuthContext';
import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

export default function SiteHeader() {
    const pathname = usePathname();
    const lang = 'ko'; // 한국어 버전 고정
    const t = translations[lang];
    const { user, isLoading } = useAuth();

    const NAV_ITEMS = [
        { id: 'dashboard', path: '/dashboard' },
        { id: 'newsroom', path: '/newsroom' },
        { id: 'analysis', path: '/analysis' },
        { id: 'themes', path: '/themes' },
        { id: 'pro_alpha', path: '/vvip-alpha' },
        { id: 'market', path: '/market' },
    ];

    return (
        <header className="sticky top-0 z-50 bg-[#050b14]/80 backdrop-blur-md border-b border-slate-800 h-20 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
                {/* Logo Section */}
                <div className="flex-shrink-0 flex items-center min-w-[160px]">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-gradient-to-tr from-[#00ffbd] to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-[#00ffbd]/20 group-hover:scale-105 transition-transform">
                            <Globe className="w-6 h-6 text-black animate-pulse-slow" />
                        </div>
                        <span className="text-xl font-black italic tracking-tighter text-white uppercase whitespace-nowrap">
                            STOCK<span className="text-[#00ffbd]">EMPIRE</span>
                        </span>
                    </Link>
                </div>

                {/* Nav - Centered & Flexible */}
                <nav className="hidden lg:flex flex-1 items-center justify-center gap-3 xl:gap-8 px-2">
                    {NAV_ITEMS.map((item) => {
                        const isActive = pathname === item.path;

                        return (
                            <Link
                                key={item.id}
                                href={item.path}
                                className={`text-[9px] xl:text-[10px] font-black uppercase tracking-widest transition-all relative group whitespace-nowrap flex items-center gap-1 xl:gap-1.5 ${isActive ? 'text-[#00ffbd]' : 'text-slate-400 hover:text-white'
                                    }`}
                            >
                                {isActive && (
                                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-[#00ffbd] shadow-[0_0_12px_rgba(0,255,189,0.8)] rounded-full animate-pulse"></div>
                                )}
                                {t.nav[item.id as keyof typeof t.nav]}
                            </Link>
                        );
                    })}
                </nav>

                {/* Right Utility Zone - Pinned Right */}
                <div className="flex-shrink-0 flex items-center gap-2 xl:gap-4 ml-4 min-w-max">
                    <div className="hidden xl:block w-[1px] h-6 bg-slate-800"></div>

                    {/* Admin HQ Button */}
                    {user?.role === 'ADMIN' && (
                        <Link
                            href="/admin"
                            className="h-9 px-3 xl:px-4 rounded-xl border border-red-500/20 bg-red-500/5 text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all flex items-center gap-2 group/hq"
                        >
                            <ShieldCheck className="w-3.5 h-3.5 group-hover/hq:animate-bounce" />
                            <span className="hidden xl:inline">{t.auth.hq}</span>
                        </Link>
                    )}

                    {/* Auth / Avatar Section */}
                    <div className="flex items-center gap-3 pl-2 xl:pl-4 border-l border-slate-800">
                        {!isLoading && (
                            user ? (
                                <div className="flex items-center gap-3">
                                    <div className="hidden xl:flex flex-col items-end">
                                        <span className="text-[10px] font-black text-white leading-none mb-1">{user.name}</span>
                                        <span className={`text-[8px] font-bold uppercase tracking-tighter px-1.5 py-0.5 rounded bg-slate-900 border ${user.role === 'ADMIN' ? 'text-red-500 border-red-500/20' : 'text-[#00ffbd] border-[#00ffbd]/20'}`}>
                                            {user.role === 'ADMIN' ? t.auth.commander : `EMPIRE ${t.auth.member}`}
                                        </span>
                                    </div>
                                    <div className="relative group/avatar">
                                        <UserButton
                                            appearance={{
                                                elements: {
                                                    avatarBox: "w-8 h-8 rounded-[10px] ring-2 ring-slate-800 hover:ring-[#00ffbd] transition-all"
                                                }
                                            }}
                                            afterSignOutUrl="/"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <SignInButton mode="modal">
                                        <button
                                            className="px-3 xl:px-4 py-2 hover:text-white text-slate-400 text-[10px] font-black uppercase tracking-widest transition-all"
                                        >
                                            {t.auth.portalAccess}
                                        </button>
                                    </SignInButton>

                                    <SignUpButton mode="modal">
                                        <button
                                            className="px-3 xl:px-4 py-2 bg-[#00ffbd] hover:bg-[#00d4ff] text-black rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-[#00ffbd]/20 active:scale-95"
                                        >
                                            {t.auth.createIdentity}
                                        </button>
                                    </SignUpButton>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
