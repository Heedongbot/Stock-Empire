'use client';

import React, { useEffect, useState } from 'react';
import { Search, TrendingUp, Calendar, ExternalLink, MessageCircle, Share2, DollarSign, Sparkles, CheckCircle2, Zap } from 'lucide-react';
import SiteHeader from '@/components/SiteHeader';
import AdLeaderboard from '@/components/ads/AdLeaderboard';
import AdInFeed from '@/components/ads/AdInFeed';
import AdRectangle from '@/components/ads/AdRectangle';
import { useAuth } from '@/lib/AuthContext';

interface NewsItem {
    id: string;
    published_at: string;
    sentiment: string;
    free_tier: {
        title: string;
        title_en: string;
        summary_kr: string;
        link: string;
        original_source: string;
    };
    vip_tier: {
        ai_analysis: {
            summary_kr: string;
            impact_score: number;
        };
    };
}

export default function NewsroomPage() {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const [lang, setLang] = useState<'ko' | 'en'>('ko');

    useEffect(() => {
        const savedLang = localStorage.getItem('stock-empire-lang') as 'ko' | 'en';
        if (savedLang) setLang(savedLang);
    }, []);

    const showAds = !user || user.tier === 'FREE';

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const res = await fetch('/api/news');
                const data = await res.json();
                setNews(data);
            } catch (error) {
                console.error('Failed to fetch news:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchNews();
    }, []);

    return (
        <div className="min-h-screen bg-[#050b14] text-[#e0e6ed]">
            <SiteHeader lang={lang} setLang={setLang} />

            <main className="max-w-7xl mx-auto px-4 py-8">
                {showAds && (
                    <div className="mb-8 overflow-hidden rounded-xl border border-slate-800">
                        <AdLeaderboard />
                    </div>
                )}

                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="flex-1 space-y-8">
                        <header className="flex items-center justify-between border-b border-slate-800 pb-4">
                            <div>
                                <h1 className="text-3xl font-black text-[#00ffbd] tracking-tighter">GLOBAL NEWSROOM</h1>
                                <p className="text-slate-400 text-sm mt-1">현지 소식을 가장 빠르게 해설하여 배달합니다.</p>
                            </div>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input
                                    type="text"
                                    placeholder="종목 또는 키워드 검색"
                                    className="bg-slate-900/50 border border-slate-800 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-[#00ffbd] transition-all"
                                />
                            </div>
                        </header>

                        {loading ? (
                            <div className="space-y-4">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="h-48 bg-slate-900/30 animate-pulse rounded-2xl" />
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {news.map((item, idx) => (
                                    <React.Fragment key={item.id}>
                                        <article className="relative bg-[#0a1120] border border-slate-800/60 rounded-2xl overflow-hidden hover:border-[#00ffbd]/50 transition-all duration-300 group shadow-[0_10px_40px_rgba(0,0,0,0.4)]">
                                            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[length:100%_4px,3px_100%] opacity-20"></div>

                                            <div className="p-7 relative z-10">
                                                <div className="flex flex-wrap items-center gap-3 mb-5">
                                                    <div className="flex items-center gap-2 bg-[#00ffbd]/10 border border-[#00ffbd]/30 px-2.5 py-1 rounded-lg">
                                                        <div className="w-1.5 h-1.5 bg-[#00ffbd] rounded-full animate-pulse"></div>
                                                        <span className="text-[10px] font-black text-[#00ffbd] uppercase tracking-wider">
                                                            Scenario #{100 + (idx * 7) % 899}
                                                        </span>
                                                    </div>
                                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2">
                                                        {item.free_tier.original_source} • {new Date(item.published_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                    <div className="flex-1"></div>
                                                    <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1 rounded-full border border-slate-800">
                                                        <Zap className="w-3 h-3 text-yellow-500" />
                                                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-tighter">Impact</span>
                                                        <div className="flex gap-0.5">
                                                            {[...Array(5)].map((_, i) => (
                                                                <div
                                                                    key={i}
                                                                    className={`w-2 h-1.5 rounded-sm ${i < (item.vip_tier.ai_analysis.impact_score / 2) ? 'bg-[#00ffbd] shadow-[0_0_8px_#00ffbd]' : 'bg-slate-800'}`}
                                                                ></div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="mb-5">
                                                    <h2 className="text-2xl font-black mb-3 group-hover:text-[#00ffbd] transition-colors leading-[1.2] tracking-tight">
                                                        {item.free_tier.title}
                                                    </h2>
                                                    <div className="flex items-start gap-3 bg-[#050b14] border border-slate-800/50 p-3 rounded-xl border-dashed">
                                                        <div className="mt-1 shrink-0"><CheckCircle2 className="w-4 h-4 text-[#00d4ff]" /></div>
                                                        <p className="text-xs font-bold text-[#00d4ff] leading-relaxed uppercase tracking-tight italic">
                                                            FAST ALPHA: {item.free_tier.title_en}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="bg-[#0f172a] border border-blue-500/20 rounded-xl p-5 mb-5 relative overflow-hidden group/insight">
                                                    <div className="absolute top-0 right-0 p-2 opacity-10">
                                                        <TrendingUp className="w-12 h-12" />
                                                    </div>
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <Sparkles className="w-4 h-4 text-[#00ffbd]" />
                                                        <span className="text-[11px] font-black text-[#00ffbd] uppercase tracking-widest flex items-center gap-2">
                                                            Empire Intelligence Report
                                                            <span className="w-px h-3 bg-slate-700"></span>
                                                            <span className="text-slate-500 font-bold">Confidential</span>
                                                        </span>
                                                    </div>
                                                    <p className="text-[14px] text-slate-200 leading-relaxed font-medium">
                                                        {item.vip_tier.ai_analysis.summary_kr}
                                                    </p>
                                                    <div className="mt-4 pt-4 border-t border-slate-800/50 flex flex-wrap gap-4">
                                                        <div className="flex flex-col">
                                                            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Accuracy</span>
                                                            <span className="text-xs font-black text-white">89.4%</span>
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Sentiment</span>
                                                            <span className={`text-xs font-black ${item.sentiment === 'BULLISH' ? 'text-[#ff4d4d]' : 'text-[#2dbdff]'}`}>
                                                                {item.sentiment}
                                                            </span>
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Risk Level</span>
                                                            <span className="text-xs font-black text-yellow-500">MODERATE</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between pt-2">
                                                    <a
                                                        href={item.free_tier.link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="group/link text-[10px] font-black text-slate-500 hover:text-white flex items-center gap-1.5 transition-all bg-slate-900/50 px-3 py-1.5 rounded-lg border border-transparent hover:border-slate-800"
                                                    >
                                                        OPEN TERMINAL <ExternalLink className="w-3 h-3 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                                                    </a>
                                                    <div className="flex items-center gap-3">
                                                        <button className="text-slate-600 hover:text-[#00ffbd] transition-colors p-1.5 hover:bg-slate-900 rounded-lg"><Share2 className="w-4 h-4" /></button>
                                                        <button className="text-slate-600 hover:text-[#00ffbd] transition-colors p-1.5 hover:bg-slate-900 rounded-lg"><MessageCircle className="w-4 h-4" /></button>
                                                    </div>
                                                </div>
                                            </div>
                                        </article>

                                        {showAds && (idx + 1) % 3 === 0 && (
                                            <div className="py-4 border-y border-slate-800/30 my-6">
                                                <AdInFeed />
                                            </div>
                                        )}
                                    </React.Fragment>
                                ))}
                            </div>
                        )}
                    </div>

                    <aside className="w-full lg:w-80 space-y-6">
                        {showAds && (
                            <div className="bg-[#0c121d] border border-slate-800 rounded-2xl p-4">
                                <h3 className="text-xs font-bold text-slate-500 mb-4 px-2">SPECIAL SPONSOR</h3>
                                <AdRectangle />
                            </div>
                        )}

                        <div className="bg-gradient-to-br from-[#0c121d] to-[#121b2d] border border-[#00ffbd]/20 rounded-2xl p-6">
                            <h3 className="text-sm font-black text-[#00ffbd] mb-4 flex items-center gap-2">
                                <DollarSign className="w-4 h-4" />
                                오늘의 EMPIRE TOP PICKS
                            </h3>
                            <div className="space-y-4">
                                {['NVDA', 'TSLA', 'PLTR'].map(ticker => (
                                    <div key={ticker} className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
                                        <span className="font-bold">{ticker}</span>
                                        <span className="text-[#ff4d4d] font-bold">+2.4%</span>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full mt-4 bg-[#00ffbd] text-[#050b14] font-black py-2 rounded-xl text-xs hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(0,255,189,0.3)]">
                                정밀 분석 보고서 보기
                            </button>
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    );
}
