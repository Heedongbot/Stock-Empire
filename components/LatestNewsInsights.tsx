'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Newspaper, Zap, Lock, ArrowRight, PlayCircle, Terminal, ChevronRight, ChevronLeft } from 'lucide-react';
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

                const sorted = data
                    .filter(item => item.vip_tier?.ai_analysis?.summary_kr)
                    .sort((a, b) => (b.vip_tier.ai_analysis.impact_score || 0) - (a.vip_tier.ai_analysis.impact_score || 0))
                    .slice(0, 9); // Get Top 9

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
            <section className="max-w-7xl mx-auto px-8 relative z-30 mb-20 animate-pulse">
                <div className="flex items-center justify-between mb-8">
                    <div className="h-10 w-64 bg-slate-800 rounded-xl"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-96 bg-[#0a1120] border border-slate-800 rounded-3xl p-6"></div>
                    ))}
                </div>
            </section>
        );
    }

    if (news.length === 0) {
        return (
            <section className="max-w-7xl mx-auto px-8 relative z-30 mb-20">
                <div className="bg-[#0a1120] border border-slate-800 rounded-3xl p-12 text-center">
                    <Terminal className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                    <h3 className="text-xl font-black text-slate-500 mb-2">데이터 수신 대기 중...</h3>
                    <p className="text-slate-600 text-sm">미국 시장 데이터를 실시간으로 수집하고 있습니다.</p>
                </div>
            </section>
        );
    }

    // Calculate visible items for current page
    const startIdx = currentIndex * itemsPerPage;
    const visibleNews = news.slice(startIdx, startIdx + itemsPerPage);
    // If not enough items to fill the page (e.g. last page has 1 item but we want 3), 
    // we can pad it or just list what we have. `slice` handles out of bounds gracefully.

    return (
        <section className="max-w-7xl mx-auto px-8 relative z-30 mb-20 animate-fade-in-up">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
                <div className="flex items-center gap-4">
                    <div className="bg-[#00ffbd]/10 p-3 rounded-xl border border-[#00ffbd]/30">
                        <Terminal className="w-6 h-6 text-[#00ffbd]" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-white italic tracking-tighter">LIVE EMPIRE TERMINAL</h2>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Real-time Market Intelligence</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <button onClick={prevSlide} className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <div className="flex gap-1">
                            {Array.from({ length: Math.ceil(news.length / itemsPerPage) }).map((_, idx) => (
                                <div
                                    key={idx}
                                    className={`w-2 h-2 rounded-full transition-all ${currentIndex === idx ? 'bg-[#00ffbd] w-4' : 'bg-slate-700'}`}
                                />
                            ))}
                        </div>
                        <button onClick={nextSlide} className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700">
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>

                    <Link href="/newsroom" className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-black uppercase tracking-widest border border-slate-700 hover:border-[#00ffbd]/50 transition-all group">
                        Full View <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                </div>
            </div>

            {/* Grid / Carousel Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[400px]">
                {visibleNews.map((item, idx) => {
                    const fullSummary = item.vip_tier?.ai_analysis?.summary_kr || "";
                    const insightTitle = fullSummary.split('\n')[0]?.replace('[Empire AI 요약]', '').trim() || "시장 영향력 분석";
                    const insightContent = fullSummary.replace(insightTitle, '').replace('[Empire AI 요약]', '').trim();

                    return (
                        <div key={item.id} className="bg-[#0a1120] border border-slate-800 rounded-3xl p-6 relative overflow-hidden group hover:border-[#00ffbd]/50 transition-all shadow-2xl flex flex-col justify-between animate-fade-in">
                            <div>
                                <div className="flex justify-between items-center mb-6">
                                    <span className="px-3 py-1 bg-slate-900 rounded-lg text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                        NEWS #{startIdx + idx + 1}
                                    </span>
                                    <div className="flex items-center gap-1 text-[10px] text-blue-400 font-bold">
                                        <PlayCircle className="w-3 h-3" /> Live
                                    </div>
                                </div>

                                <h3 className="text-xl font-black text-white mb-4 leading-snug line-clamp-2 min-h-[3.5rem]">
                                    {item.free_tier.title}
                                </h3>

                                <p className="text-sm text-slate-400 leading-relaxed mb-6 line-clamp-3 min-h-[4.5rem]">
                                    {item.free_tier.summary_kr || item.free_tier.summary || "데이터 로딩 중..."}
                                </p>
                            </div>

                            <div className="relative group/box mt-auto">
                                <div className={`bg-[#050b14] border border-slate-800 rounded-xl p-5 hover:border-[#00ffbd]/30 transition-colors cursor-pointer`}>
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <Zap className="w-3 h-3 text-[#00ffbd] fill-[#00ffbd]" />
                                            <span className="text-[10px] font-black text-[#00ffbd] uppercase tracking-widest">AI Analysis</span>
                                        </div>
                                        <Link href={`/analysis/news-us-${startIdx + idx}`} className="text-[9px] font-black text-slate-500 hover:text-[#00ffbd] uppercase flex items-center gap-1 transition-colors">
                                            Full Report <ChevronRight className="w-3 h-3" />
                                        </Link>
                                    </div>
                                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
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
