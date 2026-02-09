'use client';

import { useState, useEffect } from 'react';
import { Search, Newspaper, TrendingUp, TrendingDown, Filter, Zap, Lock, ChevronRight, Activity, Globe, X, RefreshCw } from 'lucide-react';
import SiteHeader from '@/components/SiteHeader';
import { translations } from '@/lib/translations';
import { useAuth } from '@/lib/AuthContext';
import AdLeaderboard from '@/components/ads/AdLeaderboard';
import AdInFeed from '@/components/ads/AdInFeed';

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
        title_en?: string;
        summary_kr: string;
        link: string;
        original_source: string;
    };
    pro_tier?: TierData; // Renamed from vip_tier
}

export default function NewsPage() {
    const [lang, setLang] = useState<'ko' | 'en'>('ko');
    const t = (translations as any)[lang];
    const { user } = useAuth();
    const userTier = user?.tier || 'FREE';
    const isPro = userTier === 'PRO';

    const [filter, setFilter] = useState<'ALL' | 'BULLISH' | 'BEARISH'>('ALL');
    const [newsData, setNewsData] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [visibleCount, setVisibleCount] = useState(6);
    const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

    useEffect(() => {
        const savedLang = localStorage.getItem('stock-empire-lang') as 'ko' | 'en';
        if (savedLang) setLang(savedLang);
        fetchNews();
        const interval = setInterval(() => fetchNews(true), 60000);
        return () => clearInterval(interval);
    }, []);

    const handleSetLang = (newLang: 'ko' | 'en') => {
        setLang(newLang);
        localStorage.setItem('stock-empire-lang', newLang);
    };

    const fetchNews = async (isSilent = false) => {
        if (!isSilent) setLoading(true);
        else setRefreshing(true);

        try {
            const res = await fetch(`/api/market-news?market=global&t=${Date.now()}`);
            const data = await res.json();
            // 데이터 매핑 작업 (vip_tier -> pro_tier 호환성 유지)
            const mappedData = (data.reports || data).map((item: any) => ({
                ...item,
                pro_tier: item.pro_tier || item.vip_tier
            }));
            setNewsData(mappedData);
        } catch (error) {
            console.error("Failed to fetch news", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const filteredNews = newsData.filter(item => {
        if (filter === 'ALL') return true;
        return item.sentiment === filter;
    });

    const displayedNews = filteredNews.slice(0, visibleCount);

    return (
        <div className="min-h-screen bg-[#050b14] text-slate-200 font-sans selection:bg-indigo-500/30">
            <div className="bg-indigo-900/20 border-b border-indigo-500/20 h-8 overflow-hidden flex items-center">
                <div className="flex whitespace-nowrap animate-marquee">
                    {[1, 2].map(iter => (
                        <div key={iter} className="flex items-center gap-8 mx-4">
                            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                                <Zap className="w-3 h-3 text-amber-400 fill-amber-400" /> {lang === 'ko' ? '실시간 시장 속보' : 'MARKET UPDATE'}
                            </span>
                            {newsData.slice(0, 5).map((news, idx) => (
                                <span key={idx} className="text-xs font-bold text-slate-300 flex items-center gap-2">
                                    <span className="text-indigo-400">[{news.ticker}]</span>
                                    {news.free_tier.title}
                                    <span className={`text-[10px] px-1.5 rounded ${news.sentiment === 'BULLISH' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                        {news.sentiment === 'BULLISH' ? (lang === 'ko' ? '호재' : 'BULLISH') : (lang === 'ko' ? '악재' : 'BEARISH')}
                                    </span>
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
                            {t.newsPage.title}
                        </h1>
                        <p className="text-slate-500 text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                            {lang === 'ko' ? '글로벌 시장 실시간 데이터 분석 중' : 'Real-time Global Market Analysis'}
                            {refreshing && <RefreshCw className="w-3 h-3 animate-spin text-indigo-500" />}
                        </p>
                    </div>

                    <div className="flex bg-slate-900/50 p-1.5 rounded-2xl border border-slate-800">
                        {(['ALL', 'BULLISH', 'BEARISH'] as const).map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:text-slate-300'}`}
                            >
                                {f === 'ALL' ? (lang === 'ko' ? '전체' : 'ALL') : (f === 'BULLISH' ? (lang === 'ko' ? '호재' : 'BULLISH') : (lang === 'ko' ? '악재' : 'BEARISH'))}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="h-96 flex flex-col items-center justify-center space-y-4">
                        <Activity className="w-12 h-12 text-indigo-600 animate-pulse" />
                        <p className="text-slate-500 text-xs font-black uppercase animate-pulse">{t.common.loading}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {displayedNews.map((news, idx) => (
                            <div key={news.id} className="group">
                                <div className="bg-slate-900/40 border border-slate-800 rounded-[2.5rem] p-8 h-full flex flex-col transition-all hover:border-indigo-500/30 hover:bg-slate-900/60 relative overflow-hidden">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${news.sentiment === 'BULLISH' ? 'bg-green-500 animate-pulse' : 'bg-red-500 animate-pulse'}`} />
                                            <span className={`text-[10px] font-black uppercase tracking-widest ${news.sentiment === 'BULLISH' ? 'text-green-500' : 'text-red-500'}`}>
                                                {news.sentiment === 'BULLISH' ? (lang === 'ko' ? '호재' : 'BULLISH') : (lang === 'ko' ? '악재' : 'BEARISH')}
                                            </span>
                                        </div>
                                        <span className="text-[10px] font-mono text-slate-600">{new Date(news.published_at).toLocaleTimeString()}</span>
                                    </div>

                                    <h3 className="text-lg font-black text-white hover:text-indigo-400 transition-colors leading-tight mb-4 flex-none group-hover:translate-x-1 transition-transform">
                                        {news.free_tier.title}
                                    </h3>

                                    <p className="text-xs text-slate-400 font-medium leading-relaxed mb-8 flex-1 line-clamp-3">
                                        {news.free_tier.summary_kr}
                                    </p>

                                    <div className="pt-6 border-t border-slate-800/50 mt-auto space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Globe size={14} className="text-slate-500" />
                                                <span className="text-[10px] font-black text-slate-500 uppercase">{news.free_tier.original_source}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <TrendingUp size={14} className="text-indigo-500" />
                                                <span className="text-xs font-black text-indigo-400">{news.win_rate}% Win</span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => setSelectedNews(news)}
                                            className={`w-full py-4 rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all ${isPro ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-600/30' : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'}`}
                                        >
                                            {isPro ? (lang === 'ko' ? '심층 분석 보기' : 'VIEW FULL ANALYSIS') : (lang === 'ko' ? '잠금 해제' : 'UNLOCK ANALYSIS')}
                                            <ChevronRight size={14} />
                                        </button>
                                    </div>
                                    {!isPro && idx % 3 === 1 && <div className="absolute top-2 right-2"><Lock size={12} className="text-slate-700" /></div>}
                                </div>
                                {!isPro && idx === 1 && <div className="mt-8"><AdInFeed /></div>}
                            </div>
                        ))}
                    </div>
                )}

                {!loading && filteredNews.length > visibleCount && (
                    <div className="mt-16 text-center">
                        <button
                            onClick={() => setVisibleCount(prev => prev + 6)}
                            className="px-12 py-5 bg-slate-900 border border-slate-800 rounded-2xl text-[10px] font-black text-white uppercase tracking-[0.3em] hover:bg-slate-800 hover:border-indigo-500/30 transition-all shadow-xl"
                        >
                            {t.common.more}
                        </button>
                    </div>
                )}
            </main>

            {/* News Detail Modal */}
            {selectedNews && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setSelectedNews(null)} />
                    <div className="relative bg-[#0a111f] border border-slate-800 w-full max-w-4xl max-h-[90vh] rounded-[3rem] overflow-hidden shadow-2xl animate-fade-in-up flex flex-col">
                        <div className="p-8 border-b border-slate-800 flex justify-between items-center bg-slate-900/30">
                            <div className="flex items-center gap-4">
                                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase ${selectedNews.sentiment === 'BULLISH' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                    {selectedNews.sentiment}
                                </div>
                                <span className="text-xs text-slate-500 font-mono">{selectedNews.ticker} | AI ANALYZED</span>
                            </div>
                            <button onClick={() => setSelectedNews(null)} className="p-2 hover:bg-slate-800 rounded-xl transition-colors">
                                <X className="w-6 h-6 text-slate-500" />
                            </button>
                        </div>

                        <div className="p-10 overflow-y-auto custom-scrollbar flex-1">
                            <h2 className="text-3xl font-black text-white mb-8 leading-tight italic uppercase tracking-tighter">
                                {selectedNews.free_tier.title}
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
                                <div className="space-y-6">
                                    <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">{t.common.articleSummary}</h4>
                                    <p className="text-sm text-slate-300 leading-relaxed font-medium">
                                        {selectedNews.free_tier.summary_kr}
                                    </p>
                                </div>

                                <div className="space-y-6">
                                    <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">{t.newsPage.aiInsight}</h4>
                                    {isPro ? (
                                        <div className="space-y-4 bg-indigo-950/20 p-6 rounded-3xl border border-indigo-500/20">
                                            <p className="text-sm text-white font-bold italic leading-relaxed">
                                                {selectedNews.pro_tier?.ai_analysis?.summary_kr || '분석 중입니다...'}
                                            </p>
                                            <div className="pt-4 border-t border-indigo-500/10">
                                                <p className="text-[10px] font-black text-indigo-400 uppercase mb-2">Investment Strategy</p>
                                                <p className="text-xs text-slate-400 font-medium">
                                                    {selectedNews.pro_tier?.ai_analysis?.investment_insight || '분석된 세부 전략이 없습니다.'}
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="bg-slate-900/50 p-10 rounded-[2.5rem] border border-dashed border-slate-700 flex flex-col items-center justify-center text-center">
                                            <Lock className="w-8 h-8 text-indigo-500 mb-6" />
                                            <h5 className="text-lg font-black text-white uppercase italic tracking-tighter mb-2">{lang === 'ko' ? 'PRO 전용 기밀 정보' : 'PRO EXCLUSIVE'}</h5>
                                            <p className="text-xs text-slate-500 font-bold mb-8 uppercase leading-relaxed tracking-widest">
                                                {lang === 'ko' ? '핵심 투자 리드와 AI 전략을 보려면\n멤버십 업그레이드가 필요합니다.' : 'Upgrade to see key investment leads and AI strategies.'}
                                            </p>
                                            <button className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-[10px] font-black text-white uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-indigo-600/20">
                                                {t.pricing.upgrade_pro}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="p-8 border-t border-slate-800 bg-slate-900/30 flex justify-end gap-4">
                            <a href={selectedNews.link} target="_blank" rel="noopener noreferrer" className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all">
                                {t.newsPage.readMore}
                            </a>
                        </div>
                    </div>
                </div>
            )}
            <AdLeaderboard />
        </div>
    );
}
