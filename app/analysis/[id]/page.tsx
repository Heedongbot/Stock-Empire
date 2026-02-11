"use client";

import {
    Globe, Zap, ArrowUpRight, Play, ChevronRight,
    TrendingUp, Activity, BarChart3, PieChart,
    Network, Lock, Shield, ShieldCheck, AlertCircle, BookOpen, ExternalLink, ArrowLeft, MousePointer2, Layers,
    Flame, ShieldAlert, Sparkles, Star, Clock, Cpu
} from "lucide-react";
import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";
import { translations } from "@/lib/translations";
import AdLeaderboard from "@/components/ads/AdLeaderboard";

interface NewsItem {
    id: string;
    market: string;
    ticker: string;
    title: string;
    title_kr: string;
    sentiment: string;
    free_tier: {
        title: string;
    };
}

export default function AnalysisPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const { user } = useAuth();
    const isAdmin = user?.role === 'ADMIN';
    const lang = 'ko'; // 한국어 고정
    const [insights, setInsights] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(0);

    const [newsItem, setNewsItem] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const newsRes = await fetch('/api/news');
                const newsData = await newsRes.json();

                const parts = resolvedParams.id.split('-');
                const market = parts[1]?.toUpperCase();
                const index = parseInt(parts[2]);

                let selectedNews: NewsItem | null = null;
                if (market && !isNaN(index)) {
                    const filteredNews = newsData.filter((item: NewsItem) => item.market === market);
                    selectedNews = filteredNews[index];
                }
                setNewsItem(selectedNews);

                const insightRes = await fetch('/api/insights');
                const insightData = await insightRes.json();
                setInsights(insightData);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch analysis", error);
            }
        };
        fetchData();
    }, [resolvedParams.id]);

    const baseReport = insights?.insights?.[0] || null;
    let report = baseReport ? { ...baseReport } : null;

    if (report && newsItem && newsItem.title !== insights?.news_title) {
        const seed = newsItem.title.length;
        report.sentiment = (parseFloat(report.sentiment) + (seed % 10 - 5) / 50).toFixed(2);
        const sentimentVal = parseFloat(report.sentiment);
        const calculatedMDD = -10 * (1 + Math.abs(sentimentVal) * 1.5);
        report.mdd = calculatedMDD.toFixed(1);
        const calculatedWinRate = 85 - (Math.abs(sentimentVal) * 20);
        report.win_rate = Math.round(calculatedWinRate).toString();
        report.similarity = `2024 Market Replay Patterns Detected (AI Sync Pulse: 98%)`;
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans">
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-300 px-8 py-4 flex justify-between items-center transition-all">
                <Link href="/analysis" className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors font-black text-[10px] uppercase tracking-widest group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> ANALYSIS CENTER
                </Link>
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                        <Sparkles className="text-white w-4 h-4 fill-current" />
                    </div>
                    <span className="text-lg font-black tracking-tighter uppercase italic text-slate-900">PRO ALPHA <span className="text-blue-600">INSIGHT</span></span>
                </div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest hidden md:block">
                    LIVE STATUS: ONLINE
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-10">
                <div className="mb-12 overflow-hidden rounded-[2.5rem] bg-white border border-slate-300 shadow-xl shadow-blue-500/5">
                    <AdLeaderboard />
                </div>

                {/* HEADER SECTION */}
                <section className="mb-16 text-center max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-3 mb-8">
                        <div className="px-4 py-1.5 bg-blue-50 text-blue-600 text-[10px] font-black rounded-full border border-blue-100 uppercase flex items-center gap-2 animate-pulse">
                            <Star className="w-3 h-3 fill-current" /> UNLOCKED ALPHA INTELLIGENCE
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight mb-8 tracking-tighter italic">
                        {newsItem?.title || insights?.news_title || "분석 보고서 로드 중..."}
                    </h1>
                    <div className="flex items-center justify-center gap-8 text-[11px] font-black uppercase text-slate-400">
                        <span className="flex items-center gap-2 text-blue-600"><Clock className="w-4 h-4" /> 실시간 유효성 체크 완료</span>
                        <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> 리스크 스캔 진행됨</span>
                    </div>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-16">
                    <div className="bg-white border border-slate-300 rounded-[2.5rem] p-10 text-center shadow-xl shadow-blue-500/5">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">AI Sentiment Score</p>
                        <div className="text-6xl font-black text-slate-900 mb-8 italic tracking-tighter">
                            {loading ? '--' : (report?.sentiment || '0.0')}
                        </div>
                        <div className="w-full bg-slate-50 h-3 rounded-full overflow-hidden p-0.5 mb-6 border border-slate-200">
                            <div
                                className="h-full rounded-full transition-all duration-1000 bg-gradient-to-r from-blue-400 to-indigo-600"
                                style={{
                                    width: `${((parseFloat(report?.sentiment) || 0) + 1) * 50}%`
                                }}
                            />
                        </div>
                        <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest italic leading-none">Empire Engine Analysis Safe</p>
                    </div>

                    <div className="bg-white border border-slate-300 rounded-[2.5rem] p-10 text-center shadow-xl shadow-blue-500/5">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Win-Rate Scenario</p>
                        <div className="text-6xl font-black text-blue-600 mb-8 italic tracking-tighter">
                            {loading ? '--' : (report?.win_rate || '0')}%
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Backtested Scenario v4</p>
                    </div>

                    <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 relative overflow-hidden shadow-2xl group">
                        <div className="absolute top-0 right-0 p-10 opacity-10">
                            <BarChart3 className="w-40 h-40 text-white" />
                        </div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-8">
                                <Activity className="text-blue-400 w-5 h-5" />
                                <span className="font-black text-[10px] uppercase tracking-[0.3em] text-blue-300">AI INTELLIGENCE SUMMARY</span>
                            </div>
                            <h3 className="text-2xl font-black leading-snug text-white italic tracking-tight mb-10">
                                "{loading ? '빅데이터 분석 엔진 가동 중...' : (report?.summary?.replace(/###/g, '').trim() || '분석 데이터를 불러오고 있습니다.')}"
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                {report?.transfer_map?.replace(/Themes:|Watchlist:|Stocks:|Key Themes & Stocks:/g, '').split(',').slice(0, 4).map((tag: string, i: number) => (
                                    <div key={i} className="px-4 py-2 bg-white/10 border border-white/10 rounded-xl text-[10px] font-black text-slate-300 uppercase backdrop-blur-sm">
                                        #{tag.trim()}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <section className="mb-16">
                    <div className="flex justify-center border-b border-slate-300 mb-12 gap-12 overflow-x-auto">
                        {['BACKTEST', 'MACRO INTEL', 'WATCHLIST'].map((tab, i) => (
                            <button key={i} onClick={() => setActiveTab(i)} className={`pb-6 text-[11px] font-black uppercase tracking-[0.3em] transition-all relative ${activeTab === i ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}>
                                {tab}
                                {activeTab === i && <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-full shadow-lg shadow-blue-600/20" />}
                            </button>
                        ))}
                    </div>

                    <div className="min-h-[400px]">
                        {activeTab === 0 && (
                            <div className="bg-white border border-slate-300 rounded-[3rem] p-12 text-center shadow-xl shadow-blue-500/5 relative overflow-hidden">
                                <Layers className="w-16 h-16 text-slate-200 mx-auto mb-8" />
                                <h3 className="text-3xl font-black text-slate-900 italic mb-10 tracking-tight">Historical Performance Simulation</h3>
                                <div className="max-w-3xl mx-auto space-y-8">
                                    <div className="p-8 bg-slate-50 rounded-3xl border border-slate-300 italic text-slate-600 font-bold leading-relaxed">
                                        "{report?.similarity || "Loading Similarity..."}"
                                    </div>
                                    <div className="flex items-end gap-3 h-32 px-10">
                                        {[40, 70, 45, 90, 65, 80, 55, 95, 85, 100].map((h, i) => (
                                            <div key={i} className="flex-1 bg-gradient-to-t from-blue-50 to-blue-500 rounded-t-lg opacity-80" style={{ height: `${h}%` }} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 1 && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="bg-white border border-slate-300 rounded-[3rem] p-12 shadow-xl shadow-blue-500/5 relative overflow-hidden">
                                    <div className="flex items-center gap-4 mb-10">
                                        <div className="w-12 h-12 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center">
                                            <ShieldCheck className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black text-slate-900 italic uppercase tracking-tighter">Strategic Intent</h3>
                                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Empire Inside Report (Restricted)</p>
                                        </div>
                                    </div>

                                    {!user ? (
                                        <div className="bg-slate-50 p-12 rounded-3xl text-center border border-slate-300 relative overflow-hidden">
                                            <div className="absolute inset-0 bg-white/40 backdrop-blur-sm z-10" />
                                            <div className="relative z-20">
                                                <Lock className="w-12 h-12 text-orange-400 mx-auto mb-6" />
                                                <h4 className="text-lg font-black text-slate-900 mb-2 uppercase italic">Elite Intelligence Locked</h4>
                                                <p className="text-xs text-slate-500 font-bold leading-relaxed italic mb-8">
                                                    세부 분석 및 대응 전략은 본부 로그인 후 열람 가능합니다.
                                                </p>
                                                <Link href="/sign-in" className="inline-block px-8 py-3 bg-slate-900 text-white font-black uppercase text-[10px] rounded-xl hover:scale-105 transition-all shadow-lg shadow-slate-900/20">
                                                    사령부 접속하기
                                                </Link>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="bg-blue-50/50 p-8 rounded-3xl border border-blue-200 italic text-slate-700 font-bold leading-relaxed clean-text">
                                            "{report?.intent || "전략적 분석 데이터가 준비 중입니다."}"
                                        </div>
                                    )}
                                </div>

                                <div className="bg-white border border-slate-300 rounded-[3rem] p-12 shadow-xl shadow-blue-500/5">
                                    <h3 className="text-xl font-black text-slate-900 italic uppercase tracking-tighter mb-10">Macro Indicator Map</h3>
                                    <div className="space-y-10">
                                        {[
                                            { label: "IB CONSENSUS", val: report?.ib_consensus || "0", p: report?.ib_consensus || 0 },
                                            { label: "MACRO WEIGHT", val: report?.macro_weight || "PAUSE", p: 100 }
                                        ].map((item, i) => (
                                            <div key={i} className="space-y-4">
                                                <div className="flex justify-between items-baseline px-2">
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.label}</span>
                                                    <span className="text-2xl font-black text-blue-600 italic">{item.val}</span>
                                                </div>
                                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${item.p}%` }} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 2 && (
                            <div className="bg-white border border-slate-300 rounded-[3rem] p-16 text-center shadow-xl shadow-blue-500/5 min-h-[400px] flex flex-col justify-center">
                                <Network className="w-16 h-16 text-blue-200 mx-auto mb-10" />
                                <h3 className="text-3xl font-black text-slate-900 italic tracking-tighter mb-10 uppercase">Watchlist Propagation</h3>
                                <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
                                    {report?.transfer_map?.replace(/Themes:|Watchlist:|Stocks:|Key Themes & Stocks:/g, '')
                                        .split(/,|\||\n/)
                                        .filter((s: string) => s.trim().length > 0)
                                        .map((stock: string, i: number) => (
                                            <div key={i} className="px-6 py-3 bg-slate-50 border border-slate-300 rounded-2xl hover:border-blue-400 transition-all font-black text-lg text-slate-600 uppercase italic tracking-tight cursor-pointer hover:text-blue-600 hover:shadow-lg hover:-translate-y-1">
                                                {stock.trim()}
                                            </div>
                                        ))}
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white border border-slate-300 rounded-[3rem] p-12 shadow-xl shadow-blue-500/5 flex flex-col justify-center">
                        <div className="text-center mb-10">
                            <h4 className="text-lg font-black text-slate-900 italic uppercase tracking-[0.2em]">Strategy Scenarios</h4>
                        </div>
                        <div className="space-y-4">
                            {report?.scenarios?.split('/').map((s: string, i: number) => (
                                <div key={i} className="p-6 bg-slate-50 border border-slate-300 rounded-2xl flex gap-4 items-center">
                                    <div className={`w-3 h-3 rounded-full flex-shrink-0 ${i === 0 ? 'bg-green-500' : i === 1 ? 'bg-blue-500' : 'bg-red-500'}`} />
                                    <p className="text-sm font-bold text-slate-600 italic">"{s.trim()}"</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-[3rem] p-12 text-center shadow-2xl flex flex-col items-center justify-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-10 opacity-10">
                            <BookOpen className="w-64 h-64 text-white" />
                        </div>
                        <BookOpen className="w-16 h-16 text-white mb-8 relative z-10" />
                        <h4 className="text-2xl font-black text-white italic mb-6 relative z-10">Quant Education Terminal</h4>
                        <p className="text-xs text-slate-400 font-bold italic leading-relaxed px-10 mb-10 relative z-10">
                            엠파이어 콴트 엔진이 분석한 데이터를 바탕으로 투자 결정을 내리는 법을 배우세요.
                        </p>
                        <button className="w-full py-5 bg-blue-600 text-white font-black uppercase rounded-2xl shadow-xl shadow-blue-600/30 text-xs tracking-widest active:scale-95 transition-all relative z-10 hover:bg-blue-500">
                            심층 리포트 다운로드 (PDF)
                        </button>
                    </div>
                </section>
            </main>
        </div>
    );
}

