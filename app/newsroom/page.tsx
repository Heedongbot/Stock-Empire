'use client';

import React, { useEffect, useState } from 'react';
import { Search, TrendingUp, Calendar, ExternalLink, MessageCircle, Share2, DollarSign } from 'lucide-react';
import SiteHeader from '@/components/SiteHeader';
import AdLeaderboard from '@/components/ads/AdLeaderboard';
import AdInFeed from '@/components/ads/AdInFeed';
import AdRectangle from '@/components/ads/AdRectangle';

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

import { useAuth } from '@/lib/AuthContext';

export default function NewsroomPage() {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    // PRO 티어(VIP/VVIP)가 아닌 경우에만 광고를 보여줌
    const showAds = !user || user.tier === 'FREE';

    useEffect(() => {
        const fetchNews = async () => {
            try {
                // 통합 글로벌 뉴스 API 호출
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
            <SiteHeader />

            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* 1. 상단 광고 배너 (최우선 수익) */}
                {showAds && (
                    <div className="mb-8 overflow-hidden rounded-xl border border-slate-800">
                        <AdLeaderboard />
                    </div>
                )}

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* 왼쪽: 메인 뉴스 피드 */}
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
                                        {/* 뉴스 카드 */}
                                        <article className="bg-[#0c121d] border border-slate-800 rounded-2xl overflow-hidden hover:border-[#00ffbd]/30 transition-all group">
                                            <div className="p-6">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <span className="text-[10px] font-bold bg-[#121b2d] text-[#00d4ff] px-2 py-1 rounded uppercase">
                                                        {item.free_tier.original_source}
                                                    </span>
                                                    <span className="text-xs text-slate-500 flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" />
                                                        {new Date(item.published_at).toLocaleString()}
                                                    </span>
                                                    {item.sentiment === 'BULLISH' && (
                                                        <span className="text-[10px] font-black text-[#ff4d4d]">▲ BULLISH</span>
                                                    )}
                                                    {item.sentiment === 'BEARISH' && (
                                                        <span className="text-[10px] font-black text-[#2dbdff]">▼ BEARISH</span>
                                                    )}
                                                </div>

                                                <h2 className="text-xl font-bold mb-3 group-hover:text-[#00ffbd] transition-colors leading-snug">
                                                    {item.free_tier.title}
                                                </h2>

                                                {/* 제 해설 섹션 (이게 우리 핵심 가치!) */}
                                                <div className="bg-[#121b2d]/50 border-l-4 border-[#00ffbd] p-4 mb-4 rounded-r-xl">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <TrendingUp className="w-4 h-4 text-[#00ffbd]" />
                                                        <span className="text-xs font-bold text-[#00ffbd]">EMPIRE INSIGHT</span>
                                                    </div>
                                                    <p className="text-sm text-slate-200 leading-relaxed italic">
                                                        "{item.vip_tier.ai_analysis.summary_kr}"
                                                    </p>
                                                </div>

                                                <p className="text-slate-400 text-sm line-clamp-2 mb-4">
                                                    {item.free_tier.summary_kr}
                                                </p>

                                                <div className="flex items-center justify-between pt-4 border-t border-slate-800/50">
                                                    <a
                                                        href={item.free_tier.link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-xs text-slate-500 hover:text-white flex items-center gap-1 transition-colors"
                                                    >
                                                        원문 바로가기 <ExternalLink className="w-3 h-3" />
                                                    </a>
                                                    <div className="flex items-center gap-4">
                                                        <button className="text-slate-500 hover:text-[#00ffbd] transition-colors"><Share2 className="w-4 h-4" /></button>
                                                        <button className="text-slate-500 hover:text-[#00ffbd] transition-colors"><MessageCircle className="w-4 h-4" /></button>
                                                    </div>
                                                </div>
                                            </div>
                                        </article>

                                        {/* 2. 피드 중간 광고 (3번째 뉴스마다 하나씩) */}
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

                    {/* 오른쪽: 사이드바 (광고 및 유틸리티) */}
                    <aside className="w-full lg:w-80 space-y-6">
                        {/* 3. 사이드바 사각형 광고 */}
                        {showAds && (
                            <div className="bg-[#0c121d] border border-slate-800 rounded-2xl p-4">
                                <h3 className="text-xs font-bold text-slate-500 mb-4 px-2">SPECIAL SPONSOR</h3>
                                <AdRectangle />
                            </div>
                        )}

                        {/* 실시간 마켓 점수 (AI 추천) */}
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
                            <button className="w-full mt-4 bg-[#00ffbd] text-[#050b14] font-black py-2 rounded-xl text-xs hover:scale-[1.02] active:scale-[0.98] transition-all">
                                정밀 분석 보고서 보기
                            </button>
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    );
}
