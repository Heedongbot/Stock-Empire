'use client';

import React, { useEffect, useState } from 'react';
import { Search, TrendingUp, Calendar, ExternalLink, MessageCircle, Share2, DollarSign, Sparkles, CheckCircle2, Zap, Lock, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import SiteHeader from '@/components/SiteHeader';
import AdLeaderboard from '@/components/ads/AdLeaderboard';
import AdInFeed from '@/components/ads/AdInFeed';
import AdRectangle from '@/components/ads/AdRectangle';
import { useAuth } from '@/lib/AuthContext';
import { SignInButton } from '@clerk/nextjs';
import StockLogo from '@/components/StockLogo';

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

interface AlphaSignal {
    ticker: string;
    price: number;
    change_pct: number;
}

export default function NewsroomPage() {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    // 한국 전용 테스트: 언어 고정 및 광고 전면 노출
    const lang = 'ko';
    const showAds = true;

    const [topPicks, setTopPicks] = useState<AlphaSignal[]>([]);

    useEffect(() => {
        // News fetch
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

        // Top Picks fetch (Alpha Signals)
        const fetchTopPicks = async () => {
            try {
                const res = await fetch('/api/alpha-signals?limit=3');
                const data = await res.json();
                if (Array.isArray(data)) {
                    setTopPicks(data.slice(0, 3));
                }
            } catch (e) {
                console.error("Failed to fetch top picks", e);
            }
        };

        fetchNews();
        fetchTopPicks();
    }, []);

    return (
        <div className="min-h-screen bg-[#f8fafc] text-slate-900">
            <SiteHeader />

            <main className="max-w-7xl mx-auto px-6 py-12">
                {/* 상단 전면 광고 - 부드러운 마감 */}
                <div className="mb-12 overflow-hidden rounded-[2.5rem] bg-white border border-slate-100 shadow-xl shadow-blue-500/5">
                    <div className="p-2 text-center border-b border-slate-50">
                        <span className="text-[8px] font-bold text-slate-300 tracking-widest uppercase">Premium Partner</span>
                    </div>
                    <AdLeaderboard />
                </div>

                <div className="flex flex-col lg:flex-row gap-10">
                    <div className="flex-1 space-y-10">
                        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-slate-200">
                            <div>
                                <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic">📰 실시간 <span className="text-blue-600">뉴스룸</span></h1>
                                <p className="text-slate-500 text-sm mt-2 flex items-center gap-2 font-bold">
                                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></span>
                                    AI가 실시간으로 분석 중인 핵심 뉴스들입니다
                                </p>
                            </div>
                        </header>

                        {loading ? (
                            <div className="space-y-6">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="h-48 bg-white border border-slate-100 animate-pulse rounded-[2.5rem]" />
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-8">
                                {news.map((item, idx) => (
                                    <React.Fragment key={item.id}>
                                        <article className="relative bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden hover:border-blue-200 shadow-xl shadow-blue-500/5 transition-all duration-300 group">
                                            <div className="p-8 md:p-10">
                                                <div className="flex flex-wrap items-center gap-4 mb-6">
                                                    <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-xl">
                                                        <Sparkles className="w-3 h-3 text-blue-500" />
                                                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-wider">
                                                            주요 인사이트 #{idx + 1}
                                                        </span>
                                                    </div>
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                        {item.free_tier.original_source} • {new Date(item.published_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                    <div className="flex-1"></div>
                                                    <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
                                                        <Zap className="w-3.5 h-3.5 text-orange-400" />
                                                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-tighter">AI 분석 점수</span>
                                                        <div className="flex gap-1">
                                                            {[...Array(5)].map((_, i) => (
                                                                <div
                                                                    key={i}
                                                                    className={`w-3 h-2 rounded-full ${i < (item.vip_tier.ai_analysis.impact_score / 20) ? 'bg-blue-500 shadow-sm shadow-blue-500/30' : 'bg-slate-200'}`}
                                                                ></div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="mb-8">
                                                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-4 group-hover:text-blue-600 transition-colors leading-[1.3] tracking-tight">
                                                        {item.free_tier.title}
                                                    </h2>
                                                    <div className="inline-flex items-start gap-3 bg-slate-50 border border-slate-100 p-4 rounded-2xl">
                                                        <div className="mt-1 shrink-0"><CheckCircle2 className="w-4 h-4 text-slate-400" /></div>
                                                        <p className="text-xs font-bold text-slate-500 leading-relaxed uppercase tracking-tight italic">
                                                            TRANSLATION: {item.free_tier.title_en}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* PROTECTED CONTENT AREA - FRIENDLY UPGRADE UI */}
                                                <div className="relative">
                                                    {!user && (
                                                        <div className="absolute inset-x-0 bottom-0 top-0 z-20 backdrop-blur-sm bg-white/40 rounded-3xl flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-blue-200 shadow-inner">
                                                            <div className="w-16 h-16 bg-blue-100 rounded-3xl flex items-center justify-center mb-4">
                                                                <Lock className="w-8 h-8 text-blue-600" />
                                                            </div>
                                                            <h3 className="text-xl font-black text-slate-900 mb-2 tracking-tighter uppercase">AI의 특별한 한 줄 분석</h3>
                                                            <p className="text-xs text-slate-500 font-bold mb-6 max-w-[280px] leading-relaxed">
                                                                이 뉴스가 시장에 어떤 영향을 미칠지 <br />
                                                                AI가 정밀하게 분석한 결과가 숨겨져 있어요.
                                                            </p>
                                                            <div className="flex gap-3">
                                                                <SignInButton mode="modal">
                                                                    <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest rounded-2xl transition-all text-xs shadow-lg shadow-blue-600/20 active:scale-95">
                                                                        분석 리포트 읽기
                                                                    </button>
                                                                </SignInButton>
                                                            </div>
                                                        </div>
                                                    )}

                                                    <div className={`bg-blue-50/50 border border-blue-100 rounded-[2rem] p-8 mb-8 relative group/insight ${!user ? 'blur-md select-none opacity-30 h-32 overflow-hidden' : ''}`}>
                                                        <div className="flex items-center justify-between mb-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-sm border border-blue-100">
                                                                    <Sparkles className="w-4 h-4 text-blue-600" />
                                                                </div>
                                                                <span className="text-[12px] font-black text-blue-600 uppercase tracking-widest font-black">
                                                                    AI Analyst Insight
                                                                </span>
                                                            </div>
                                                            <Link href={`/analysis/news-us-${idx}`} className="text-[11px] font-black text-blue-500 hover:text-blue-700 uppercase tracking-widest flex items-center gap-1.5 transition-colors bg-white px-4 py-2 rounded-xl border border-blue-100 shadow-sm">
                                                                자세히 보기 <ChevronRight className="w-4 h-4" />
                                                            </Link>
                                                        </div>
                                                        <p className="text-[16px] text-slate-800 leading-relaxed font-bold">
                                                            {item.vip_tier.ai_analysis.summary_kr}
                                                        </p>

                                                        <div className="mt-8 pt-8 border-t border-slate-200 grid grid-cols-2 md:grid-cols-4 gap-6">
                                                            <div className="flex flex-col gap-1">
                                                                <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest font-black">신뢰도</span>
                                                                <span className="text-sm font-black text-slate-900">89.4%</span>
                                                            </div>
                                                            <div className="flex flex-col gap-1">
                                                                <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest font-black">분위기</span>
                                                                <span className={`text-sm font-black ${item.sentiment === 'BULLISH' ? 'text-red-500' : 'text-blue-500'}`}>
                                                                    {item.sentiment === 'BULLISH' ? '기대됨 (Bullish)' : '주의함 (Bearish)'}
                                                                </span>
                                                            </div>
                                                            <div className="flex flex-col gap-1">
                                                                <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest font-black">위험도</span>
                                                                <span className="text-[11px] font-black text-emerald-600 px-2.5 py-1 rounded bg-emerald-50 border border-emerald-100 self-start">안정적 (STABLE)</span>
                                                            </div>
                                                            <div className="hidden md:flex flex-col gap-1">
                                                                <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest font-black">업데이트</span>
                                                                <span className="text-sm font-black text-slate-900">실시간 반영됨</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                                    <a
                                                        href={item.free_tier.link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="group/link text-[11px] font-black text-slate-400 hover:text-slate-900 flex items-center gap-2 transition-all"
                                                    >
                                                        뉴스 원문 보기 <ExternalLink className="w-4 h-4 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                                                    </a>
                                                    {user && (
                                                        <div className="flex items-center gap-4">
                                                            <button className="text-slate-400 hover:text-blue-600 transition-colors p-2 hover:bg-blue-50 rounded-xl border border-transparent hover:border-blue-100 flex items-center gap-2 text-[11px] font-black">
                                                                공유하기 <Share2 className="w-4 h-4" />
                                                            </button>
                                                            <button className="text-slate-400 hover:text-blue-600 transition-colors p-2 hover:bg-blue-50 rounded-xl border border-transparent hover:border-blue-100 flex items-center gap-2 text-[11px] font-black">
                                                                의견 나누기 <MessageCircle className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </article>

                                        {/* 중간 광고 - 부드러운 화이트 레이아웃 */}
                                        {(idx + 1) % 2 === 0 && (
                                            <div className="py-12 border-y border-slate-100 my-10 bg-white rounded-[3rem] shadow-xl shadow-blue-500/5">
                                                <div className="flex justify-center mb-6">
                                                    <div className="px-4 py-1 bg-slate-50 rounded-full border border-slate-100">
                                                        <span className="text-[9px] font-black text-slate-300 tracking-widest uppercase italic">Sponsored Insight</span>
                                                    </div>
                                                </div>
                                                <AdInFeed />
                                            </div>
                                        )}
                                    </React.Fragment>
                                ))}
                            </div>
                        )}
                    </div>

                    <aside className="w-full lg:w-96 space-y-8">
                        <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-xl shadow-blue-500/5 overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-4 opacity-5">
                                <TrendingUp className="w-20 h-20" />
                            </div>
                            <h3 className="text-xs font-black text-slate-400 mb-6 px-1 tracking-[0.2em] uppercase">Special Partner</h3>
                            <AdRectangle />
                        </div>

                        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] p-8 shadow-2xl shadow-blue-600/20 text-white relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                            <h3 className="text-xl font-black mb-8 flex items-center gap-3 italic tracking-tighter uppercase font-black">
                                <Sparkles className="w-6 h-6 text-blue-200" />
                                Weekly Top Picks
                            </h3>
                            <div className="space-y-4 mb-10">
                                {topPicks.length > 0 ? topPicks.map((pick, idx) => (
                                    <div key={pick.ticker} className="flex items-center justify-between p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/20 transition-all cursor-pointer group/item">
                                        <div className="flex items-center gap-4 text-xs">
                                            <StockLogo ticker={pick.ticker} size={40} className="border-0 shadow-lg bg-white rounded-full" />
                                            <span className="font-black text-lg tracking-tighter">{pick.ticker}</span>
                                        </div>
                                        <div className="text-right">
                                            <div className={`font-extrabold text-sm font-black italic ${pick.change_pct >= 0 ? 'text-red-400' : 'text-blue-300'}`}>
                                                {pick.change_pct > 0 ? '+' : ''}{pick.change_pct.toFixed(2)}%
                                            </div>
                                            <div className="text-[9px] text-white/50 font-bold uppercase tracking-widest">${pick.price.toFixed(2)}</div>
                                        </div>
                                    </div>
                                )) : (
                                    // Loading State or Fallback
                                    ['NVDA', 'TSLA', 'AAPL'].map((ticker) => (
                                        <div key={ticker} className="flex items-center justify-between p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/20 transition-all animate-pulse">
                                            <div className="flex items-center gap-4 text-xs">
                                                <div className="w-10 h-10 bg-white/20 rounded-full" />
                                                <span className="font-black text-lg tracking-tighter">{ticker}</span>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-white/50 font-extrabold text-sm">Loading...</div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                            <Link href="/analysis" className="block w-full text-center bg-white text-blue-700 font-black py-4 rounded-2xl text-[11px] hover:bg-blue-50 transition-all shadow-xl shadow-black/20 uppercase tracking-widest active:scale-95">
                                상세 분석 리포트 열기
                            </Link>
                        </div>
                    </aside>
                </div >
            </main >
        </div >
    );
}
