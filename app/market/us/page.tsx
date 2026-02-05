"use client";

import {
    Globe, Zap, ArrowUpRight, ArrowLeft, TrendingUp,
    Database, Cpu, Activity, BarChart3, Clock,
    ShieldAlert, Sparkles, Milestone
} from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function USMarketPage() {
    const [news, setNews] = useState<any[]>([]);

    useEffect(() => {
        const fetchNews = async () => {
            const res = await fetch('/api/news');
            const data = await res.json();
            setNews(data.filter((n: any) => n.market === 'US'));
        };
        fetchNews();
    }, []);

    return (
        <div className="min-h-screen pb-20 bg-[#050b14] text-[#e2e8f0]">
            <nav className="sticky top-0 z-50 bg-[#050b14]/80 backdrop-blur-xl border-b border-slate-800/60 px-8 py-4 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <Link href="/" className="p-2 hover:bg-slate-800 rounded-xl transition-all">
                        <ArrowLeft className="w-5 h-5 text-slate-400 theme-hover:text-white" />
                    </Link>
                    <h1 className="text-xl font-black tracking-tighter uppercase italic flex items-center gap-2">
                        <Globe className="w-6 h-6 text-[#d4af37]" /> US GLOBAL TERMINAL
                    </h1>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-[10px] font-black text-green-500 uppercase flex items-center gap-2 animate-pulse">
                        <div className="w-2 h-2 bg-green-500 rounded-full" /> NYSE/NASDAQ LIVE
                    </span>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-8 py-10">
                <header className="mb-12">
                    <div className="premium-card p-10 bg-gradient-to-br from-[#0a192f] to-slate-950 border-[#d4af37]/20 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-10 opacity-5">
                            <Globe className="w-60 h-60 text-[#d4af37]" />
                        </div>
                        <div className="relative z-10">
                            <p className="text-[#d4af37] text-[10px] font-black uppercase tracking-[0.4em] mb-4">The World's Liquidity Center</p>
                            <h2 className="text-4xl font-black text-white italic tracking-tighter mb-6">"달러의 흐름이 곧 수익의 지도입니다."</h2>
                            <div className="flex gap-4">
                                <div className="px-4 py-2 bg-slate-900/50 rounded-xl border border-slate-800 text-[10px] font-bold">
                                    NASDAQ: <span className="text-green-400">+1.24%</span>
                                </div>
                                <div className="px-4 py-2 bg-slate-900/50 rounded-xl border border-slate-800 text-[10px] font-bold">
                                    S&P 500: <span className="text-green-400">+0.85%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {news.map((item, idx) => (
                        <div key={idx} className="premium-card p-8 bg-slate-900/50 border-slate-800 hover:border-[#d4af37]/50 transition-all group relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-0 group-hover:h-full transition-all duration-500 bg-[#d4af37]" />
                            <div className="flex items-center justify-between mb-6">
                                <span className="text-[9px] font-black px-2 py-1 bg-[#d4af37]/10 text-[#d4af37] rounded border border-[#d4af37]/20 uppercase">US PREMIUM</span>
                                <div className="flex items-center gap-1 text-[9px] font-black text-blue-400">
                                    <Zap className="w-3 h-3 fill-current" /> WIN: {70 + (item.title.length % 25)}%+
                                </div>
                            </div>
                            <h3 className="text-lg font-black text-white leading-snug mb-8 group-hover:text-[#d4af37] transition-colors italic">
                                {item.title}
                            </h3>
                            <Link href={`/analysis/us-${idx}`} className="w-full py-4 bg-slate-950 text-slate-400 group-hover:bg-[#d4af37] group-hover:text-black rounded-xl text-[10px] font-black transition-all flex items-center justify-center gap-2 border border-slate-800">
                                OPEN DEEP REPORT <ArrowUpRight className="w-4 h-4" />
                            </Link>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
