'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Newspaper, Zap, Lock, ArrowRight, PlayCircle, Terminal, ChevronRight } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';

interface NewsItem {
    id: string;
    sentiment: string;
    impact_score: number;
    free_tier: {
        title: string;
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

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const res = await fetch(`/us-news-realtime.json?t=${Date.now()}`);
                if (!res.ok) return;
                const data: NewsItem[] = await res.json();

                // Sort by impact and take top 3
                const sorted = data
                    .filter(item => item.vip_tier?.ai_analysis?.summary_kr)
                    .sort((a, b) => (b.vip_tier.ai_analysis.impact_score || 0) - (a.vip_tier.ai_analysis.impact_score || 0))
                    .slice(0, 3);

                setNews(sorted);
            } catch (e) {
                console.error("Failed to fetch news insights", e);
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, []);

    if (loading || news.length === 0) return null;

    return (
        <section className="max-w-7xl mx-auto px-8 relative z-30 mb-20">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
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

                <Link href="/newsroom" className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-black uppercase tracking-widest border border-slate-700 hover:border-[#00ffbd]/50 transition-all group">
                    Enter Terminal <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {news.map((item, idx) => {
                    // Parsing Key Insight for the box
                    const fullSummary = item.vip_tier.ai_analysis.summary_kr || "";
                    const insightTitle = fullSummary.split('\n')[0]?.replace('[Empire AI 요약]', '').trim() || "시장 영향력 분석";
                    // Taking the rest as content
                    const insightContent = fullSummary.replace(insightTitle, '').replace('[Empire AI 요약]', '').trim();

                    return (
                        <div key={item.id} className="bg-[#0a1120] border border-slate-800 rounded-3xl p-6 relative overflow-hidden group hover:border-[#00ffbd]/50 transition-all shadow-2xl">

                            {/* Card Header */}
                            <div className="flex justify-between items-center mb-6">
                                <span className="px-3 py-1 bg-slate-900 rounded-lg text-[10px] font-black text-slate-500 uppercase tracking-widest">뉴스 #{idx + 1}</span>
                                <div className="flex items-center gap-1 text-[10px] text-blue-400 font-bold">
                                    <PlayCircle className="w-3 h-3" /> 요약
                                </div>
                            </div>

                            {/* Title */}
                            <h3 className="text-xl font-black text-white mb-4 leading-snug line-clamp-2 min-h-[3.5rem]">
                                {item.free_tier.title}
                            </h3>

                            {/* Free Summary (Truncated) */}
                            <p className="text-sm text-slate-400 leading-relaxed mb-6 line-clamp-3 min-h-[4.5rem]">
                                {item.free_tier.summary_kr || "내용을 불러오는 중..."}
                            </p>

                            {/* VIP Insight Box */}
                            <div className="relative group/box">
                                {!user && (
                                    <div className="absolute inset-0 z-20 backdrop-blur-sm bg-slate-950/80 rounded-xl flex flex-col items-center justify-center text-center p-4 border border-slate-800/50">
                                        <Lock className="w-6 h-6 text-amber-500 mb-2" />
                                        <p className="text-[10px] text-slate-400 font-bold mb-3">VIP 회원 전용 분석입니다</p>
                                        <a href="/sign-in" className="px-4 py-2 bg-[#00ffbd] hover:bg-[#00d4ff] text-black text-[10px] font-black uppercase rounded-lg transition-colors">
                                            Login to Unlock
                                        </a>
                                    </div>
                                )}

                                <div className={`bg-[#050b14] border border-slate-800 rounded-xl p-5 ${!user ? 'opacity-30 blur-[2px]' : ''}`}>
                                    <div className="flex items-center gap-2 mb-3">
                                        <Zap className="w-3 h-3 text-[#00ffbd] fill-[#00ffbd]" />
                                        <span className="text-[10px] font-black text-[#00ffbd] uppercase tracking-widest">AI 인사이트</span>
                                    </div>
                                    <h4 className="text-sm font-bold text-white mb-2 line-clamp-1">"{insightTitle.substring(0, 30)}..."</h4>
                                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-4">
                                        {insightContent}
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
