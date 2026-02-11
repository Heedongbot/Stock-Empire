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
        <section className="max-w-7xl mx-auto px-6 relative z-30 mb-20 bg-gradient-to-b from-transparent to-slate-50/50 pt-10 rounded-[4rem]">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-10 px-4">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/30 animate-pulse">
                        <Newspaper className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="flex w-2 h-2 bg-red-500 rounded-full animate-ping" />
                            <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">LIVE BROADCAST</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 italic tracking-tighter leading-none">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">BREAKING</span> NEWS
                        </h2>
                        <p className="text-slate-400 text-xs font-bold mt-2 uppercase tracking-widest">
                            AI가 전 세계 14,000개 언론사를 24시간 감시 중입니다
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 bg-white p-1 rounded-full border border-slate-200 shadow-sm mt-4 md:mt-0">
                    <button onClick={prevSlide} className="w-10 h-10 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center transition-all active:scale-95 text-slate-400 hover:text-slate-900">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-[10px] font-black text-slate-300 w-12 text-center">
                        {currentIndex + 1} / {Math.ceil(news.length / itemsPerPage)}
                    </span>
                    <button onClick={nextSlide} className="w-10 h-10 rounded-full bg-slate-900 hover:bg-slate-800 flex items-center justify-center transition-all active:scale-95 text-white shadow-lg shadow-slate-900/20">
                        <ChevronRight className="w-5 h-5" />
                    </button>
                    <Link href="/newsroom" className="ml-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-blue-100 transition-colors">
                        MORE NEWS
                    </Link>
                </div>
            </div>

            {/* News Cards Slider */}
            <div className="relative overflow-hidden px-4 md:px-0 pb-10">
                <div
                    className="flex transition-transform duration-500 ease-out gap-6"
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                    {news.map((item) => (
                        <div
                            key={item.id}
                            style={{ flex: `0 0 calc(${100 / itemsPerPage}% - 16px)` }}
                            className="group relative bg-white border border-slate-200 rounded-[2.5rem] p-8 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-2 overflow-hidden flex flex-col h-[450px]"
                        >
                            {/* Background Decoration */}
                            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${item.sentiment === 'Negative' ? 'from-blue-50 to-transparent' : 'from-red-50 to-transparent'} rounded-bl-[100px] opacity-50 transition-all group-hover:scale-110`} />

                            <div className="relative z-10 flex flex-col h-full">
                                {/* Top Badges */}
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex gap-2">
                                        <div className="bg-slate-100 px-3 py-1 rounded-lg">
                                            <Newspaper className="w-4 h-4 text-slate-400" />
                                        </div>
                                        <div className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 ${(item.vip_tier?.ai_analysis?.impact_score || 0) >= 80
                                                ? 'bg-red-50 text-red-600 ring-1 ring-red-100'
                                                : 'bg-slate-50 text-slate-500'
                                            }`}>
                                            {(item.vip_tier?.ai_analysis?.impact_score || 0) >= 80 && <Zap className="w-3 h-3 fill-current animate-pulse" />}
                                            IMPACT {(item.vip_tier?.ai_analysis?.impact_score || 0)}
                                        </div>
                                    </div>

                                    <div className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1 ${item.sentiment === 'Positive' ? 'bg-red-50 text-red-600' :
                                            item.sentiment === 'Negative' ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-500'
                                        }`}>
                                        {item.sentiment === 'Positive' ? '호재 (Bullish)' : item.sentiment === 'Negative' ? '악재 (Bearish)' : '중립 (Neutral)'}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 mb-6">
                                    <h3 className="text-xl font-black text-slate-900 leading-snug mb-4 line-clamp-3 group-hover:text-blue-600 transition-colors">
                                        {item.free_tier?.title || "제목 없음"}
                                    </h3>

                                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 relative">
                                        <div className="absolute -top-3 left-4 bg-white px-2 text-[10px] font-black text-blue-600 uppercase tracking-widest border border-blue-100 rounded-md">
                                            AI 3줄 요약
                                        </div>
                                        <p className="text-xs text-slate-600 font-medium leading-relaxed line-clamp-4">
                                            {item.vip_tier?.ai_analysis?.summary_kr || item.free_tier?.summary_kr || "AI 분석 중입니다..."}
                                        </p>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="mt-auto pt-6 border-t border-slate-100 flex justify-between items-center relative z-10">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                            <Terminal className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <div className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">분석 완료</div>
                                            <div className="text-[10px] font-black text-slate-900">1분 전</div>
                                        </div>
                                    </div>

                                    <Link href="/newsroom" className="group/btn flex items-center gap-2 pl-4 pr-2 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all hover:pr-4">
                                        <span>분석 보기</span>
                                        <div className="w-5 h-5 bg-white/20 rounded-lg flex items-center justify-center group-hover/btn:bg-white group-hover/btn:text-blue-600 transition-colors">
                                            <ChevronRight className="w-3 h-3" />
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Background Elements */}
            <div className="absolute top-10 left-10 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl -z-10 animate-pulse" />
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-100/30 rounded-full blur-3xl -z-10 animate-pulse delay-1000" />
        </section>
    );
}
