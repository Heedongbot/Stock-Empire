'use client';

import { useState, useEffect } from 'react';
import { Search, Newspaper, TrendingUp, TrendingDown, Filter, Zap, Lock, ChevronRight, Activity, Globe, X } from 'lucide-react';
import SiteHeader from '@/components/SiteHeader';
import { translations } from '@/lib/translations';

/* --------------------------------------------------------------------------------
 * Interfaces matching public/us-news-tiered.json
 * -------------------------------------------------------------------------------- */
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
    const [filter, setFilter] = useState<'ALL' | 'BULLISH' | 'BEARISH'>('ALL');
    const [newsData, setNewsData] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [visibleCount, setVisibleCount] = useState(6);
    const [userTier, setUserTier] = useState<'FREE' | 'VIP' | 'VVIP'>('FREE');
    const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

    // Fetch Real Data
    useEffect(() => {
        const fetchNews = async () => {
            try {
                // Use the new tiered JSON
                const res = await fetch(`/us-news-tiered.json?t=${Date.now()}`);
                const data = await res.json();
                setNewsData(data);
            } catch (error) {
                console.error("Failed to fetch news", error);
            } finally {
                setLoading(false);
            }
        };
        fetchNews();
    }, []);

    // Filter Logic
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

            {/* 2. Header */}
            <SiteHeader lang={lang} setLang={setLang} />

            {/* 3. Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-12">
                <div className="mb-12 text-center relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-indigo-500/10 blur-[100px] -z-10 rounded-full" />

                    <div className="flex justify-center gap-2 mb-6">
                        {['FREE', 'VIP', 'VVIP'].map((tier) => (
                            <button
                                key={tier}
                                onClick={() => setUserTier(tier as any)}
                                className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${userTier === tier ? 'bg-indigo-500 text-white border-indigo-500' : 'bg-slate-900 text-slate-500 border-slate-800'}`}
                            >
                                View as {tier}
                            </button>
                        ))}
                    </div>

                    <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter text-white mb-6">
                        {t.newsPage.title}
                    </h1>
                    <p className="text-lg text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
                        {t.newsPage.subtitle}
                    </p>
                </div>

                <div className="flex justify-center gap-2 mb-12">
                    {['ALL', 'BULLISH', 'BEARISH'].map(tabId => (
                        <button
                            key={tabId}
                            onClick={() => { setFilter(tabId as any); setVisibleCount(6); }}
                            className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all border ${filter === tabId
                                ? tabId === 'BULLISH' ? 'bg-green-500/10 border-green-500 text-green-500'
                                    : tabId === 'BEARISH' ? 'bg-red-500/10 border-red-500 text-red-500'
                                        : 'bg-indigo-500/10 border-indigo-500 text-indigo-400'
                                : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-600'
                                }`}
                        >
                            {tabId}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="text-center py-20">
                        <Activity className="w-10 h-10 text-indigo-500 animate-spin mx-auto mb-4" />
                        <p className="text-slate-500 font-bold">브리핑 데이터를 불러오는 중...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {displayedNews.map((news, idx) => (
                            <div
                                key={idx}
                                onClick={() => setSelectedNews(news)}
                                className="group relative bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-indigo-500/50 transition-all hover:shadow-2xl hover:shadow-indigo-500/10 flex flex-col h-full animate-fade-in-up cursor-pointer"
                            >
                                <div className={`h-1.5 w-full ${news.sentiment === 'BULLISH' ? 'bg-green-500' : news.sentiment === 'BEARISH' ? 'bg-red-500' : 'bg-slate-500'}`} />
                                <div className="p-6 flex flex-col h-full">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="px-3 py-1 bg-slate-950 rounded-lg text-xs font-black text-indigo-400 border border-slate-800">{news.ticker}</span>
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${news.sentiment === 'BULLISH' ? 'bg-green-500/10 text-green-500' : news.sentiment === 'BEARISH' ? 'bg-red-500/10 text-red-500' : 'bg-slate-700/50 text-slate-400'}`}>
                                            {news.sentiment}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-3 line-clamp-2 leading-snug group-hover:text-indigo-300 transition-colors">
                                        {news.free_tier.title}
                                    </h3>
                                    <div className="text-sm text-slate-400 mb-6 line-clamp-3 leading-relaxed">
                                        {userTier === 'FREE' ? news.free_tier.summary_kr : (news.vip_tier?.ai_analysis?.summary_kr || news.free_tier.summary_kr)}
                                    </div>
                                    <div className="mt-auto pt-4 border-t border-slate-800/50">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Zap className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                            <span className="text-xs font-black text-yellow-500 uppercase tracking-wider">AI Insight</span>
                                        </div>
                                        <div className={`relative ${userTier === 'FREE' ? 'filter blur-[4px] opacity-50' : ''}`}>
                                            <p className="text-xs text-slate-300 font-medium">
                                                {news.vip_tier?.ai_analysis?.investment_insight || "분석 데이터를 불러오는 중..."}
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
                        <button onClick={() => setVisibleCount(prev => prev + 6)} className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-all border border-slate-700 mx-auto">
                            더 많은 뉴스 보기
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
                                <div className={`p-6 rounded-2xl bg-slate-950 border border-slate-800 relative ${userTier === 'FREE' ? 'filter blur-[8px] select-none' : ''}`}>
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
                                        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/20">
                                            <Lock className="w-10 h-10 text-indigo-500 mb-2" />
                                            <button className="px-6 py-2 bg-indigo-600 text-white rounded-full font-black text-xs uppercase tracking-widest shadow-lg">Upgrade to Unlock</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="mt-8 pt-8 border-t border-slate-800 flex flex-col md:flex-row gap-4 items-center justify-between">
                                <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">Published: {new Date(selectedNews.published_at).toLocaleString()}</span>
                                <a href={selectedNews.free_tier.link} target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-sm transition-all flex items-center gap-2">
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
