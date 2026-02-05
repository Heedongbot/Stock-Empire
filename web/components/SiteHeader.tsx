'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Globe } from 'lucide-react';
import { translations } from '@/lib/translations';

interface SiteHeaderProps {
    lang?: 'ko' | 'en';
    setLang?: (lang: 'ko' | 'en') => void;
}

export default function SiteHeader({ lang = 'ko', setLang }: SiteHeaderProps) {
    const pathname = usePathname();
    const t = translations[lang];

    const toggleLang = () => {
        if (setLang) {
            setLang(lang === 'ko' ? 'en' : 'ko');
        }
    };

    const NAV_ITEMS = [
        { id: 'dashboard', path: '/dashboard' },
        { id: 'news', path: '/news' },
        { id: 'analysis', path: '/analysis' },
        { id: 'market', path: '/market' },
        { id: 'portfolio', path: '/portfolio' },
    ];

    return (
        <header className="sticky top-0 z-50 bg-[#050b14]/80 backdrop-blur-md border-b border-slate-800 h-20 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                        <Globe className="w-6 h-6 text-white animate-pulse-slow" />
                    </div>
                    <span className="text-xl font-black italic tracking-tighter text-white">
                        STOCK<span className="text-indigo-400">EMPIRE</span>
                    </span>
                </Link>

                {/* Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    {NAV_ITEMS.map((item) => {
                        const isActive = pathname === item.path;
                        return (
                            <Link
                                key={item.id}
                                href={item.path}
                                className={`text-sm font-bold uppercase tracking-wide transition-colors relative group ${isActive ? 'text-indigo-400' : 'text-slate-400 hover:text-white'
                                    }`}
                            >
                                {t.nav[item.id as keyof typeof t.nav]}
                                {/* Active Indicator Dot */}
                                {isActive && (
                                    <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-indigo-400 rounded-full shadow-[0_0_8px_rgba(129,140,248,0.8)]"></span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Right Actions */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleLang}
                        className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-black text-slate-400 hover:text-white transition-colors uppercase hover:border-indigo-500/50"
                    >
                        {lang === 'ko' ? 'ENG' : 'KOR'}
                    </button>

                    {/* Placeholder Avatar */}
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600"></div>
                </div>
            </div>
        </header>
    );
}
