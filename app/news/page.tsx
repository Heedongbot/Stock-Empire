'use client';

import { useState, useEffect } from 'react';
import { Search, Newspaper, TrendingUp, TrendingDown, Filter, Zap, Lock, ChevronRight, Activity, Globe, X } from 'lucide-react';
import SiteHeader from '@/components/SiteHeader';
import { translations } from '@/lib/translations';
import { useAuth } from '@/lib/AuthContext';

interface TierData {
    summary_kr?: string;
    ai_analysis?: {
        summary_kr: string;
        impact_score?: number;
        investment_insight?: string;
    };
}

interface NewsItem {
    id: string;
    market: string;
    ticker: string;
    title: string;
    title_kr: string;
    link: string;
    published_at: string;
    sentiment: "BULLISH" | "BEARISH" | "NEUTRAL";
    win_rate?: number;
    free_tier: {
        title: string;
        summary_kr: string;
        link: string;
        original_source: string;
    };
    vip_tier?: TierData;
}

export default function NewsPage() {
    const [lang, setLang] = useState<'ko' | 'en'>('ko');
    const t = translations[lang];
    const { user } = useAuth();
    const userTier = user?.tier || 'FREE';

    const [filter, setFilter] = useState<'ALL' | 'BULLISH' | 'BEARISH'>('ALL');
    const [newsData, setNewsData] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [visibleCount, setVisibleCount] = useState(6);
    const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

    // Auto-detect User Locale with Persistence
    useEffect(() => {
        const savedLang = localStorage.getItem('stock-empire-lang') as 'ko' | 'en';
        if (savedLang) {
            setLang(savedLang);
        } else {
            const userLang = navigator.language || navigator.languages[0];
            if (userLang.startsWith('ko')) {
                setLang('ko');
            } else {
                setLang('ko'); // Default to Korean
            }
        }
    }, []);

    const handleSetLang = (newLang: 'ko' | 'en') => {
        setLang(newLang);
        localStorage.setItem('stock-empire-lang', newLang);
    };

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const res = await fetch(`/api/market-news?t=${Date.now()}`);
                const data = await res.json();
                if (data.reports && Array.isArray(data.reports)) {
                    setNewsData(data.reports);
                } else if (Array.isArray(data)) {
                    setNewsData(data);
                }
            } catch (error) {
                console.error("Failed to fetch news", error);
            } finally {
                setLoading(false);
            }
        };
        fetchNews();
    }, []);

    const filteredNews = newsData.filter(item => {
        if (filter === 'ALL') return true;
        return item.sentiment === filter;
    });

    const displayedNews = filteredNews.slice(0, visibleCount);

    return (
        <div className="min-h-screen bg-[#050b14] text-slate-200 font-sans selection:bg-indigo-500/30">
            {/* 1. Breaking News Ticker */}
            <div className="bg-indigo-900/20 border-b border-indigo-500/20 h-8 overflow-hidden flex items-center">
                <div className="flex whitespace-nowrap animate-marquee">
                    {[1, 2].map(iter => (
                        <div key={iter} className="flex items-center gap-8 mx-4">
                            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                                <Zap className="w-3 h-3 text-amber-400 fill-amber-400" /> MARKET UPDATE
                            </span>
                            {newsData.slice(0, 5).map((news, idx) => (
                                <span key={idx} className="text-xs font-bold text-slate-300 flex items-center gap-2">
                                    <span className="text-indigo-400">[{news.ticker}]</span>
                                    {news.free_tier.title}
                                    <span className={`text-[10px] px-1.5 rounded ${news.sentiment === 'BULLISH' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{news.sentiment}</span>
                                    <span className="mx-2 text-slate-600">|</span>
                                </span>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            <SiteHeader lang={lang} setLang={handleSetLang} />

            <main className="max-w-7xl mx-auto px-6 py-12">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                    <div>
                        <h1 className="text-4xl font-black italic tracking-tighter text-white mb-2 uppercase underline decoration-indigo-500 underline-offset-8 decoration-4">
                            AI Newsroom
                        </h1>
                        <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">
                            Real-time Global Market Analysis
                        </p>
                    </div>

                    <div className="flex items-center gap-3 bg-slate-900/50 p-1.5 rounded-2xl border border-slate-800">
                        {(['ALL', 'BULLISH', 'BEARISH'] as const).map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-500 hover:text-slate-300'}`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-40">
                        <LoaderIcon className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
                        <p className="text-slate-500 text-xs font-black uppercase tracking-[0.3em] animate-pulse">Decrypting Market Data...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {displayedNews.map((news, idx) => (
                            <div
                                key={idx}
                                onClick={() => setSelectedNews(news)}
                                className="group relative bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-indigo-500/50 transition-all hover:shadow-2xl hover:shadow-indigo-500/10 flex flex-col h-full animate-fade-in-up cursor-pointer"
                            >
                                <div className={`h-1.5 w-full ${news.sentiment === 'BULLISH' ? 'bg-green-500' : news.sentiment === 'BEARISH' ? 'bg-red-500' : 'bg-slate-500'}`} />
                                <div className="p-6 flex flex-col h-full">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="px-3 py-1 bg-slate-950 rounded-lg text-xs font-black text-indigo-400 border border-slate-800 uppercase tracking-widest">{news.ticker}</span>
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${news.sentiment === 'BULLISH' ? 'bg-green-500/10 text-green-500' : news.sentiment === 'BEARISH' ? 'bg-red-500/10 text-red-500' : 'bg-slate-700/50 text-slate-400'}`}>
                                            {news.sentiment}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-3 line-clamp-2 leading-snug group-hover:text-indigo-300 transition-colors">
                                        {lang === 'en' && news.free_tier.title_en ? news.free_tier.title_en : news.free_tier.title}
                                    </h3>
                                    <div className="text-sm text-slate-400 mb-6 line-clamp-3 leading-relaxed">
                                        {lang === 'en'
                                            ? (news.free_tier.title_en || "Click for details")
                                            : (userTier === 'FREE' ? news.free_tier.summary_kr : (news.vip_tier?.summary_kr || news.free_tier.summary_kr))
                                        }
                                    </div>
                                    <div className="mt-auto pt-4 border-t border-slate-800/50">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Zap className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                            <span className="text-xs font-black text-yellow-500 uppercase tracking-wider">{t.newsPage.aiInsight}</span>
                                        </div>
                                        <div className={`relative ${userTier === 'FREE' ? 'filter blur-[4px] opacity-50 select-none' : ''}`}>
                                            <p className="text-xs text-slate-300 font-medium">
                                                {lang === 'en'
                                                    ? "AI analysis is currently processing this event for market impact."
                                                    : (news.vip_tier?.ai_analysis?.investment_insight || "프리미엄 분석 대기 중...")
                                                }
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!loading && displayedNews.length < filteredNews.length && (
                    <div className="mt-12 text-center">
                        <button onClick={() => setVisibleCount(prev => prev + 6)} className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-all border border-slate-700 mx-auto uppercase text-xs tracking-widest">
                            Load More Intelligence
                        </button>
                    </div>
                )}
            </main>

            {selectedNews && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setSelectedNews(null)} />
                    <div className="relative bg-[#0f172a] border border-slate-700 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl animate-fade-in-up">
                        <div className={`h-2 w-full ${selectedNews.sentiment === 'BULLISH' ? 'bg-green-500' : selectedNews.sentiment === 'BEARISH' ? 'bg-red-500' : 'bg-slate-500'}`} />
                        <div className="p-8">
                            <div className="flex justify-between items-start mb-6">
                                <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-lg text-xs font-black uppercase tracking-widest border border-indigo-500/20">{selectedNews.ticker}</span>
                                <button onClick={() => setSelectedNews(null)} className="text-slate-500 hover:text-white transition-colors"><X className="w-6 h-6" /></button>
                            </div>
                            <h2 className="text-2xl font-black text-white mb-6 leading-tight">{selectedNews.free_tier.title}</h2>
                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Summary</h4>
                                    <p className="text-slate-300 leading-relaxed">{selectedNews.free_tier.summary_kr}</p>
                                </div>
                                <div className={`p-6 rounded-2xl bg-slate-950 border border-slate-800 relative ${userTier === 'FREE' ? 'filter blur-[8px] select-none shadow-inner' : ''}`}>
                                    <div className="flex items-center gap-2 mb-4">
                                        <Zap className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                                        <h4 className="text-sm font-black text-white uppercase tracking-widest">Premium AI Analysis</h4>
                                    </div>
                                    <p className="text-slate-300 leading-relaxed mb-4">{selectedNews.vip_tier?.ai_analysis?.summary_kr || "VIP 분석 데이터를 불러오는 중입니다."}</p>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Impact Score</span>
                                            <div className="text-xl font-black text-indigo-400">{selectedNews.vip_tier?.ai_analysis?.impact_score || 'N/A'}/100</div>
                                        </div>
                                        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Sentiment</span>
                                            <div className={`text-xl font-black ${selectedNews.sentiment === 'BULLISH' ? 'text-green-500' : 'text-red-500'}`}>{selectedNews.sentiment}</div>
                                        </div>
                                    </div>
                                    {userTier === 'FREE' && (
                                        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-transparent">
                                            <Lock className="w-10 h-10 text-indigo-500 mb-2" />
                                            <button className="px-6 py-2 bg-indigo-600 text-white rounded-full font-black text-xs uppercase tracking-widest shadow-lg">Upgrade to Unlock</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="mt-8 pt-8 border-t border-slate-800 flex flex-col md:flex-row gap-4 items-center justify-between">
                                <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">Published: {new Date(selectedNews.published_at).toLocaleString()}</span>
                                <a href={selectedNews.free_tier.link} target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-sm transition-all flex items-center gap-2 uppercase tracking-wide">
                                    Original Source <ChevronRight className="w-4 h-4" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function LoaderIcon({ className }: { className?: string }) {
    return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
        </svg>
    );
}
