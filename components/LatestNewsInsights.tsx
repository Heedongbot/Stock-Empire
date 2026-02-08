'use client';

import React, { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Zap, TrendingUp, TrendingDown, Star, AlertTriangle, ChevronRight, Activity } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';

interface NewsItem {
    id: string;
    sentiment: string;
    impact_score: number;
    free_tier: {
        title: string;
        summary_kr: string; // [Empire AI 요약] ...
    };
    vip_tier: {
        ai_analysis: {
            summary_kr: string; // [Empire AI 요약] ...
            impact_score: number;
        };
    };
}

export default function LatestNewsInsights() {
    const { user } = useAuth(); // Check auth
    const [news, setNews] = useState<NewsItem[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                // Fetch cached news JSON
                const res = await fetch(`/us-news-realtime.json?t=${Date.now()}`);
                if (!res.ok) return;
                const data: NewsItem[] = await res.json();

                // Sort by impact_score descending and filter for valid summaries
                const sorted = data
                    .filter(item => item.vip_tier?.ai_analysis?.summary_kr)
                    .sort((a, b) => (b.vip_tier.ai_analysis.impact_score || 0) - (a.vip_tier.ai_analysis.impact_score || 0))
                    .slice(0, 5); // Top 5

                setNews(sorted);
            } catch (e) {
                console.error("Failed to fetch news insights", e);
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, []);

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % news.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + news.length) % news.length);
    };

    if (loading || news.length === 0) return null;

    const currentItem = news[currentIndex];
    const fullSummary = currentItem.vip_tier.ai_analysis.summary_kr || "";
    const parts = fullSummary.split('\n\n');
    const insightSection = parts[0] || fullSummary;
    const bodySection = parts.length > 1 ? parts[1] : "";

    return (
        <section className="max-w-7xl mx-auto px-8 relative z-30 -mt-10 mb-20 animate-fade-in-up">
            <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden">
                {/* Decorative Background */}
                <div className="absolute top-0 right-0 p-20 opacity-[0.03] pointer-events-none">
                    <Activity className="w-64 h-64 text-white" />
                </div>

                <div className="flex flex-col md:flex-row gap-8 items-start relative z-10 text-left">
                    {/* Header / Controls */}
                    <div className="md:w-1/3 w-full">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                            <span className="text-[#00ffbd] text-xs font-black uppercase tracking-widest">LIVE BRIEFING</span>
                        </div>
                        <h2 className="text-3xl font-black text-white italic tracking-tighter mb-4 leading-tight">
                            TODAY'S <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">MARKET MOVER</span>
                        </h2>
                        <p className="text-slate-400 text-xs font-medium mb-8 leading-relaxed">
                            매일 쏟아지는 수천 건의 뉴스 중, <br />
                            시장을 뒤흔들 <b>상위 1% 핵심 지표</b>만 분석합니다.
                        </p>

                        <div className="flex gap-4">
                            <button onClick={handlePrev} className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-colors border border-slate-700">
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <button onClick={handleNext} className="p-3 rounded-xl bg-[#00ffbd] hover:bg-[#00d4ff] text-black transition-colors shadow-lg shadow-[#00ffbd]/20 font-bold border border-transparent">
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Content Card (Blurred if not logged in) */}
                    <div className="md:w-2/3 w-full relative">
                        {!user && (
                            <div className="absolute inset-0 z-20 backdrop-blur-md bg-slate-900/60 rounded-2xl flex flex-col items-center justify-center text-center p-6 border border-slate-700/50">
                                <AlertTriangle className="w-12 h-12 text-amber-500 mb-4" />
                                <h3 className="text-xl font-black text-white mb-2 uppercase italic">Members Only Analysis</h3>
                                <p className="text-slate-400 text-xs font-medium mb-6 max-w-xs">
                                    시장 핵심 분석은 회원에게만 제공됩니다. <br />지금 로그인하여 1%의 정보를 확인하세요.
                                </p>
                                <a href="/sign-in" className="px-8 py-3 bg-[#00ffbd] hover:bg-[#00d4ff] text-black font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-[#00ffbd]/20">
                                    Login to Unlock
                                </a>
                            </div>
                        )}

                        <div className={`bg-slate-900/50 border border-slate-700/50 rounded-2xl p-6 md:p-8 backdrop-blur-sm transition-all ${!user ? 'blur-sm opacity-50 select-none' : ''}`}>
                            <div className="flex items-center gap-3 mb-4">
                                <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1 ${currentItem.sentiment === 'BULLISH' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : currentItem.sentiment === 'BEARISH' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'}`}>
                                    {currentItem.sentiment === 'BULLISH' ? <TrendingUp className="w-3 h-3" /> : currentItem.sentiment === 'BEARISH' ? <TrendingDown className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                                    {currentItem.sentiment}
                                </span>
                                <span className="px-3 py-1 rounded-lg bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase tracking-widest border border-blue-500/20 flex items-center gap-1">
                                    <Star className="w-3 h-3 fill-blue-400" />
                                    IMPACT {currentItem.vip_tier.ai_analysis.impact_score}
                                </span>
                            </div>

                            <h3 className="text-xl md:text-2xl font-bold text-white mb-6 leading-snug">
                                {currentItem.free_tier.title}
                            </h3>

                            <div className="space-y-4">
                                <div className="bg-[#050b14] p-5 rounded-xl border-l-4 border-l-[#00ffbd] border-y border-r border-slate-800">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Zap className="w-4 h-4 text-[#00ffbd] fill-[#00ffbd]" />
                                        <span className="text-[10px] font-black text-[#00ffbd] uppercase tracking-widest">Empire AI Insight</span>
                                    </div>
                                    <p className="text-sm text-slate-200 font-medium leading-relaxed whitespace-pre-wrap">
                                        {insightSection.replace(/\[Empire AI 요약\]/g, '').trim()}
                                    </p>
                                </div>

                                {bodySection && (
                                    <div className="pl-4 border-l border-slate-800">
                                        <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                                            {bodySection.replace(/\[내용 번역\]/g, '').trim()}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="mt-6 flex justify-end">
                                <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                                    Analyzing Source: {currentItem.id.substring(0, 8)}...
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Pagination Dots */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                    {news.map((_, idx) => (
                        <div
                            key={idx}
                            className={`w-1.5 h-1.5 rounded-full transition-all ${idx === currentIndex ? 'bg-[#00ffbd] w-4' : 'bg-slate-700'}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
