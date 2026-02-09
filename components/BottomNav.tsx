'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Newspaper, BarChart2, Zap, User } from 'lucide-react';

export default function BottomNav() {
    const pathname = usePathname();

    const NAV_ITEMS = [
        { id: 'home', icon: Home, label: '홈', path: '/' },
        { id: 'market', icon: BarChart2, label: '시장', path: '/market' },
        { id: 'news', icon: Newspaper, label: '뉴스', path: '/newsroom' },
        { id: 'analysis', icon: Zap, label: '분석', path: '/analysis' },
        { id: 'profile', icon: User, label: '마이', path: '/dashboard' },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-[100] bg-[#050b14]/90 backdrop-blur-xl border-t border-slate-800 lg:hidden safe-area-bottom">
            <div className="flex justify-around items-center h-20 px-2">
                {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.path;
                    return (
                        <Link
                            key={item.id}
                            href={item.path}
                            className={`flex flex-col items-center justify-center gap-1.5 w-full h-full transition-all duration-300 relative ${isActive ? 'text-[#00ffbd]' : 'text-slate-500 hover:text-white'
                                }`}
                        >
                            {isActive && (
                                <div className="absolute top-0 w-12 h-1 bg-[#00ffbd] shadow-[0_0_15px_rgba(0,255,189,0.5)] rounded-full animate-pulse" />
                            )}
                            <item.icon className={`w-6 h-6 ${isActive ? 'scale-110 drop-shadow-[0_0_8px_rgba(0,255,189,0.4)]' : ''}`} />
                            <span className="text-[10px] font-black uppercase tracking-tighter">{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
