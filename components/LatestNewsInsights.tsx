'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Zap, ChevronRight, ChevronLeft, Terminal, Newspaper, Globe, PlayCircle, BarChart3, TrendingUp } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';

interface NewsItem {
    id: string;
    sentiment: string;
    impact_score: number;
    free_tier: {
        title: string;
        summary: string;
        summary_kr: string;
    };
    vip_tier: {
        ai_analysis: {
            summary_kr: string;
            impact_score: number;
        };
    };
}

export default function LatestNewsInsights() {
    const { user } = useAuth();
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(3);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) setItemsPerPage(1);
            else if (window.innerWidth < 1024) setItemsPerPage(2);
            else setItemsPerPage(3);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const res = await fetch(`/us-news-realtime.json?t=${Date.now()}`);
                if (!res.ok) return;
                const data: NewsItem[] = await res.json();

                // AI 분석 요약이 있고, 시장 영향력이 높은 순으로 최대 15개 수집
                const sorted = data
                    .filter(item => item.vip_tier?.ai_analysis?.summary_kr)
                    .sort((a, b) => (b.vip_tier.ai_analysis.impact_score || 0) - (a.vip_tier.ai_analysis.impact_score || 0))
                    .slice(0, 15);

                if (sorted.length > 0) setNews(sorted);
            } catch (e) {
                console.error("Failed to fetch news insights", e);
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, []);

    const nextSlide = () => {
        if (news.length === 0) return;
        setCurrentIndex((prev) => (prev + 1) % Math.ceil(news.length / itemsPerPage));
    };

    const prevSlide = () => {
        if (news.length === 0) return;
        setCurrentIndex((prev) => (prev - 1 + Math.ceil(news.length / itemsPerPage)) % Math.ceil(news.length / itemsPerPage));
    };

    if (loading) {
        return (
            <section className="max-w-7xl mx-auto px-6 relative z-30 mb-20 animate-pulse">
                <div className="flex items-center justify-between mb-8">
                    <div className="h-10 w-64 bg-slate-200 rounded-xl"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-96 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm"></div>
                    ))}
                </div>
            </section>
        );
    }

    if (news.length === 0) {
        return (
            <section className="max-w-7xl mx-auto px-6 relative z-30 mb-20">
                <div className="bg-white border border-slate-300 rounded-[2.5rem] p-12 text-center shadow-xl shadow-blue-500/5">
                    <Terminal className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-xl font-black text-slate-900 mb-2">데이터 수신 대기 중...</h3>
                    <p className="text-slate-500 text-sm font-bold">미국 시장 데이터를 실시간으로 수집하고 있습니다.</p>
                </div>
            </section>
        );
    }

    // Calculate visible items for current page
    const startIdx = currentIndex * itemsPerPage;
    const visibleNews = news.slice(startIdx, startIdx + itemsPerPage);

    return (
        <section className="max-w-7xl mx-auto px-6 relative z-30 mb-24 animate-fade-in-up">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6">
                <div className="flex items-center gap-4">
                    <div className="bg-blue-50 p-3 rounded-2xl border border-blue-100 shadow-sm">
                        <Terminal className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter">LIVE EMPIRE TERMINAL</h2>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                            </span>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Real-time Market Intelligence</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center bg-white p-1 rounded-2xl border border-slate-200 shadow-sm">
                        <button
                            onClick={prevSlide}
                            className="p-3 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-blue-600 transition-all active:scale-95"
                            title="이전 기사"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>

                        <div className="px-4 flex flex-col items-center">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Feed</span>
                            <span className="text-xs font-black text-slate-900">
                                {currentIndex + 1} <span className="text-slate-300 mx-1">/</span> {Math.ceil(news.length / itemsPerPage)}
                            </span>
                        </div>

                        <button
                            onClick={nextSlide}
                            className="p-3 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-blue-600 transition-all active:scale-95"
                            title="다음 기사"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>

                    <Link href="/newsroom" className="flex md:flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-slate-900/10 transition-all group hover:-translate-y-0.5 w-full md:w-auto">
                        More News <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                </div>
            </div>

            {/* Grid / Carousel Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {visibleNews.map((item, idx) => {
                    const fullSummary = item.vip_tier?.ai_analysis?.summary_kr || "";
                    const insightTitle = fullSummary.split('\n')[0]?.replace('[Empire AI 요약]', '').trim() || "시장 영향력 분석";
                    const insightContent = fullSummary.replace(insightTitle, '').replace('[Empire AI 요약]', '').trim();

                    return (
                        <div key={item.id} className="bg-white border border-slate-300 rounded-[2.5rem] p-8 relative overflow-hidden group hover:border-blue-400 transition-all shadow-xl shadow-blue-500/5 flex flex-col justify-between hover:-translate-y-1">
                            <div>
                                <div className="flex justify-between items-center mb-6">
                                    <span className="px-3 py-1 bg-slate-50 rounded-lg text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-200">
                                        NEWS #{startIdx + idx + 1}
                                    </span>
                                    <div className="flex items-center gap-1 text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-1 rounded-full">
                                        <PlayCircle className="w-3 h-3 fill-current" /> Live
                                    </div>
                                </div>

                                <h3 className="text-lg font-black text-slate-900 mb-4 leading-snug line-clamp-2 min-h-[3.5rem] tracking-tight">
                                    {item.free_tier.title}
                                </h3>

                                <p className="text-sm text-slate-500 font-medium leading-relaxed mb-8 line-clamp-3 min-h-[4.5rem]">
                                    {item.free_tier.summary_kr || item.free_tier.summary || "데이터 로딩 중..."}
                                </p>
                            </div>

                            <div className="relative group/box mt-auto">
                                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 hover:bg-blue-50/50 hover:border-blue-200 transition-colors cursor-pointer group-hover/box:shadow-inner">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <Zap className="w-4 h-4 text-blue-600 fill-blue-600" />
                                            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">AI Analysis</span>
                                        </div>
                                        <Link href={`/analysis/news-us-${startIdx + idx}`} className="text-[9px] font-black text-slate-400 hover:text-blue-600 uppercase flex items-center gap-1 transition-colors">
                                            Full Report <ChevronRight className="w-3 h-3" />
                                        </Link>
                                    </div>
                                    <p className="text-xs text-slate-600 font-bold leading-relaxed line-clamp-2">
                                        {insightContent || insightTitle}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
