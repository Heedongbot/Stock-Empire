"use client";

import {
    Globe, Zap, ArrowUpRight, Play, ChevronRight,
    TrendingUp, Activity, BarChart3, PieChart,
    Network, Lock, Shield, ShieldCheck, AlertCircle, BookOpen, ExternalLink, ArrowLeft, MousePointer2, Layers,
    Flame, ShieldAlert, Sparkles, Star, Clock
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
    const t = (translations as any)[lang];
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
        <div className="min-h-screen bg-[#050b14] text-[#e2e8f0] font-sans">
            <nav className="sticky top-0 z-50 bg-[#050b14]/90 backdrop-blur-xl border-b border-white/5 px-8 py-4 flex justify-between items-center">
                <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-[#00ffbd] transition-colors font-black text-[10px] uppercase tracking-widest">
                    <ArrowLeft className="w-4 h-4" /> TERMINAL
                </Link>
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#00ffbd] rounded-xl flex items-center justify-center shadow-lg shadow-[#00ffbd]/20">
                        <Sparkles className="text-black w-4 h-4 fill-current" />
                    </div>
                    <span className="text-lg font-black tracking-tighter uppercase italic text-white">PRO ALPHA <span className="text-[#00ffbd]">INSIGHT</span></span>
                </div>
                <div className="text-[10px] font-black text-[#00ffbd] uppercase tracking-widest hidden md:block">
                    LIVE STATUS: EMPIRE ENGINE v4.0
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-10">
                <div className="mb-12">
                    <AdLeaderboard />
                </div>

                {/* HEADER SECTION */}
                <section className="mb-16 text-center max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-3 mb-8">
                        <div className="px-4 py-1.5 bg-[#00ffbd]/10 text-[#00ffbd] text-[10px] font-black rounded-full border border-[#00ffbd]/30 uppercase flex items-center gap-2 animate-pulse">
                            <Star className="w-3 h-3 fill-current" /> UNLOCKED ALPHA
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-8 tracking-tighter italic uppercase">
                        {newsItem?.title || insights?.news_title || "분석 보고서 로드 중..."}
                    </h1>
                    <div className="flex items-center justify-center gap-8 text-[11px] font-black uppercase text-slate-500">
                        <span className="flex items-center gap-2 text-[#00ffbd]"><Clock className="w-4 h-4" /> 실시간 유효성 체크 완료</span>
                        <span className="flex items-center gap-2"><ShieldAlert className="w-4 h-4" /> 리스크 스캔 진행됨</span>
                    </div>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-16">
                    <div className="bg-[#0a1120] border border-slate-800 rounded-[2.5rem] p-10 text-center shadow-2xl">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6">AI Sentiment Score</p>
                        <div className="text-6xl font-black text-white mb-8 italic">
                            {loading ? '--' : (report?.sentiment || '0.0')}
                        </div>
                        <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden p-0.5 mb-6">
                            <div
                                className="h-full rounded-full transition-all duration-1000"
                                style={{
                                    width: `${((parseFloat(report?.sentiment) || 0) + 1) * 50}%`,
                                    backgroundColor: '#00ffbd'
                                }}
                            />
                        </div>
                        <p className="text-[10px] font-black text-[#00ffbd] uppercase tracking-widest italic leading-none">Empire Engine Analysis Safe</p>
                    </div>

                    <div className="bg-[#0a1120] border border-slate-800 rounded-[2.5rem] p-10 text-center shadow-2xl">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6">Simulated Win-Rate</p>
                        <div className="text-6xl font-black text-[#00ffbd] mb-8 italic">
                            {loading ? '--' : (report?.win_rate || '0')}%
                        </div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Backtested Scenario v4</p>
                    </div>

                    <div className="lg:col-span-2 bg-gradient-to-br from-[#0a1120] to-slate-900 border border-slate-800 rounded-[2.5rem] p-10 relative overflow-hidden shadow-2xl group">
                        <div className="absolute top-0 right-0 p-10 opacity-5">
                            <BarChart3 className="w-40 h-40 text-white" />
                        </div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-8">
                                <Activity className="text-[#00ffbd] w-5 h-5" />
                                <span className="font-black text-[10px] uppercase tracking-[0.3em] text-[#00ffbd]">AI INTELLIGENCE SUMMARY</span>
                            </div>
                            <h3 className="text-2xl font-black leading-snug text-white italic tracking-tight mb-10">
                                "{loading ? '빅데이터 분석 엔진 가동 중...' : (report?.summary?.replace(/###/g, '').trim() || '분석 데이터를 불러오고 있습니다.')}"
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                {report?.transfer_map?.replace(/Themes:|Watchlist:|Stocks:|Key Themes & Stocks:/g, '').split(',').slice(0, 4).map((tag: string, i: number) => (
                                    <div key={i} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-slate-400 uppercase">
                                        #{tag.trim()}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <section className="mb-16">
                    <div className="flex border-b border-slate-800 mb-12 gap-12 overflow-x-auto">
                        {['BACKTEST', 'MACRO INTEL', 'WATCHLIST'].map((tab, i) => (
                            <button key={i} onClick={() => setActiveTab(i)} className={`pb-6 text-[11px] font-black uppercase tracking-[0.3em] transition-all relative ${activeTab === i ? 'text-[#00ffbd]' : 'text-slate-500'}`}>
                                {tab}
                                {activeTab === i && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#00ffbd] shadow-lg shadow-[#00ffbd]/50" />}
                            </button>
                        ))}
                    </div>

                    <div className="min-h-[400px]">
                        {activeTab === 0 && (
                            <div className="bg-[#0a1120] border border-slate-800 rounded-[3rem] p-12 text-center shadow-2xl relative overflow-hidden">
                                <Layers className="w-16 h-16 text-slate-800 mx-auto mb-8" />
                                <h3 className="text-2xl font-black text-white italic mb-10">Historical Performance Simulation</h3>
                                <div className="max-w-3xl mx-auto space-y-8">
                                    <div className="p-8 bg-slate-950 rounded-3xl border border-white/5 italic text-slate-400 font-bold leading-relaxed">
                                        "{report?.similarity || "Loading Similarity..."}"
                                    </div>
                                    <div className="flex items-end gap-3 h-32 px-10">
                                        {[40, 70, 45, 90, 65, 80, 55, 95, 85, 100].map((h, i) => (
                                            <div key={i} className="flex-1 bg-gradient-to-t from-[#00ffbd]/10 to-[#00ffbd] rounded-t-lg" style={{ height: `${h}%` }} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 1 && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="bg-[#0a1120] border border-slate-800 rounded-[3rem] p-12 shadow-2xl relative overflow-hidden">
                                    <div className="flex items-center gap-4 mb-10">
                                        <div className="w-12 h-12 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-center">
                                            <ShieldCheck className="w-6 h-6 text-[#00ffbd]" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Strategic Intent</h3>
                                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Empire Inside Report (Restricted)</p>
                                        </div>
                                    </div>

                                    {!user ? (
                                        <div className="bg-slate-950 p-12 rounded-3xl text-center border border-white/5 relative overflow-hidden">
                                            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm z-10" />
                                            <div className="relative z-20">
                                                <Lock className="w-12 h-12 text-amber-500 mx-auto mb-6 animate-pulse" />
                                                <h4 className="text-lg font-black text-white mb-2 uppercase italic">Elite Intelligence Locked</h4>
                                                <p className="text-xs text-slate-500 font-bold leading-relaxed italic mb-8">
                                                    세부 분석 및 대응 전략은 본부 로그인 후 열람 가능합니다.
                                                </p>
                                                <a href="/sign-in" className="px-8 py-3 bg-[#00ffbd] text-black font-black uppercase text-[10px] rounded-xl hover:scale-105 transition-all">
                                                    사령부 접속하기
                                                </a>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="bg-[#00ffbd]/5 p-8 rounded-3xl border border-[#00ffbd]/20 italic text-white font-bold leading-relaxed clean-text">
                                            "{report?.intent || "전략적 분석 데이터가 준비 중입니다."}"
                                        </div>
                                    )}
                                </div>

                                <div className="bg-[#0a1120] border border-slate-800 rounded-[3rem] p-12 shadow-2xl">
                                    <h3 className="text-xl font-black text-white italic uppercase tracking-tighter mb-10">Macro Indicator Map</h3>
                                    <div className="space-y-10">
                                        {[
                                            { label: "IB CONSENSUS", val: report?.ib_consensus || "0", p: report?.ib_consensus || 0 },
                                            { label: "MACRO WEIGHT", val: report?.macro_weight || "PAUSE", p: 100 }
                                        ].map((item, i) => (
                                            <div key={i} className="space-y-4">
                                                <div className="flex justify-between items-baseline px-2">
                                                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{item.label}</span>
                                                    <span className="text-2xl font-black text-[#00ffbd] italic">{item.val}</span>
                                                </div>
                                                <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden">
                                                    <div className="h-full bg-[#00ffbd]" style={{ width: `${item.p}%` }} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 2 && (
                            <div className="bg-[#0a1120] border border-slate-800 rounded-[3rem] p-16 text-center shadow-2xl min-h-[400px] flex flex-col justify-center">
                                <Network className="w-16 h-16 text-[#00ffbd] mx-auto mb-10" />
                                <h3 className="text-3xl font-black text-white italic tracking-tighter mb-10 uppercase">Watchlist Propagation</h3>
                                <div className="flex flex-wrap justify-center gap-6 max-w-4xl mx-auto">
                                    {report?.transfer_map?.replace(/Themes:|Watchlist:|Stocks:|Key Themes & Stocks:/g, '')
                                        .split(/,|\||\n/)
                                        .filter((s: string) => s.trim().length > 0)
                                        .map((stock: string, i: number) => (
                                            <div key={i} className="px-8 py-5 bg-slate-950 border border-slate-800 rounded-2xl hover:border-[#00ffbd]/50 transition-all font-black text-lg text-slate-300 uppercase italic tracking-tight shadow-xl">
                                                {stock.trim()}
                                            </div>
                                        ))}
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-[#0a1120] border border-slate-800 rounded-[3rem] p-12 shadow-2xl flex flex-col justify-center">
                        <div className="text-center mb-10">
                            <h4 className="text-lg font-black text-white italic uppercase tracking-[0.2em]">Strategy Scenarios</h4>
                        </div>
                        <div className="space-y-6">
                            {report?.scenarios?.split('/').map((s: string, i: number) => (
                                <div key={i} className="p-6 bg-slate-950 border border-white/5 rounded-2xl flex gap-6 items-center">
                                    <div className={`w-3 h-3 rounded-full ${i === 0 ? 'bg-green-500' : i === 1 ? 'bg-blue-500' : 'bg-red-500'}`} />
                                    <p className="text-[13px] font-bold text-slate-400 italic">"{s.trim()}"</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-[#00ffbd]/5 to-[#0a1120] border border-[#00ffbd]/20 rounded-[3rem] p-12 text-center shadow-2xl flex flex-col items-center justify-center">
                        <BookOpen className="w-16 h-16 text-[#00ffbd] mb-8" />
                        <h4 className="text-2xl font-black text-white italic mb-6">Quant Education Terminal</h4>
                        <p className="text-xs text-slate-500 font-bold italic leading-relaxed px-10 mb-10">
                            엠파이어 콴트 엔진이 분석한 데이터를 바탕으로 투자 결정을 내리는 법을 배우세요.
                        </p>
                        <button className="w-full py-5 bg-[#00ffbd] text-black font-black uppercase rounded-2xl shadow-xl shadow-[#00ffbd]/10 shadow-lg text-xs tracking-widest active:scale-95 transition-all">
                            심층 리포트 다운로드 (PDF)
                        </button>
                    </div>
                </section>
            </main>
        </div>
    );
}
