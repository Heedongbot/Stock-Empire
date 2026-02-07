'use client';

import { useState, useEffect, Suspense } from 'react';
import {
    Crown, TrendingUp, TrendingDown, Target, ShieldAlert,
    ArrowLeft, Activity, Zap, Lock, RefreshCw, ChevronRight,
    Search, BarChart4, Ghost, Waves, BrainCircuit
} from 'lucide-react';
import SiteHeader from '@/components/SiteHeader';
import { useAuth } from '@/lib/AuthContext';
import Link from 'next/link';

interface AlphaSignal {
    id: string;
    ticker: string;
    name: string;
    price: number;
    change_pct: number;
    sentiment: "BULLISH" | "BEARISH" | "NEUTRAL";
    impact_score: number;
    target_price: number;
    stop_loss: number;
    ai_reason: string;
    technical_analysis?: string;
    fundamental_analysis?: string;
    action_plan?: string;
    updated_at: string;
}

function VVIPAlphaContent() {
    const [signals, setSignals] = useState<AlphaSignal[]>([]);
    const [loading, setLoading] = useState(true);
    const [lang, setLang] = useState<'ko' | 'en'>('ko');
    const { user } = useAuth();
    const isPro = user?.tier === 'PRO' || user?.role === 'ADMIN';

    useEffect(() => {
        const savedLang = localStorage.getItem('stock-empire-lang') as 'ko' | 'en';
        if (savedLang) setLang(savedLang);
        fetchSignals();
    }, []);

    const fetchSignals = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/alpha-signals?lang=${lang}&t=${Date.now()}`);
            const data = await res.json();
            if (Array.isArray(data)) {
                setSignals(data);
            }
        } catch (e) {
            console.error("Failed to fetch VVIP alpha signals", e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-indigo-500/30">
            {/* Ambient Background Glow */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px]"></div>
            </div>

            <SiteHeader lang={lang} setLang={setLang} />

            <main className="relative z-10 max-w-7xl mx-auto px-6 py-12">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
                    <div className="space-y-4">
                        <Link href="/" className="inline-flex items-center gap-2 text-indigo-400 hover:text-white transition-colors text-xs font-black uppercase tracking-widest group">
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            {lang === 'ko' ? '커맨드 센터로' : 'Back to Command Center'}
                        </Link>
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-gradient-to-tr from-yellow-500 to-orange-600 rounded-2xl shadow-lg shadow-yellow-500/20">
                                <Crown className="w-8 h-8 text-slate-900 fill-slate-900" />
                            </div>
                            <div>
                                <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-white leading-none">
                                    PRO <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400 animate-gradient-x">Alpha Insights</span>
                                </h1>
                                <p className="text-[10px] text-yellow-500/70 font-black uppercase tracking-[0.4em] mt-2">
                                    {lang === 'ko' ? '최상위 1%를 위한 고확신 실시간 시그널' : 'High-Conviction Real-Time Signals for the Top 1%'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="flex-1 md:flex-none relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <input
                                type="text"
                                placeholder={lang === 'ko' ? "고확신 종목 필터..." : "Filter high-conviction..."}
                                className="bg-slate-900/50 border border-slate-800 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-yellow-500/50 w-full transition-all"
                            />
                        </div>
                        <button
                            onClick={fetchSignals}
                            className="p-3 bg-slate-900 border border-slate-800 rounded-2xl hover:bg-slate-800 transition-all active:scale-95 group"
                        >
                            <RefreshCw className={`w-5 h-5 text-slate-400 group-hover:text-yellow-500 transition-colors ${loading ? 'animate-spin' : ''}`} />
                        </button>
                    </div>
                </div>

                {/* VVIP Alert Banner for non-members */}
                {!isPro && (
                    <div className="mb-12 bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-transparent border border-yellow-500/20 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                        <div className="flex items-center gap-6 relative z-10">
                            <div className="p-4 bg-yellow-500 rounded-2xl">
                                <Lock className="w-8 h-8 text-slate-950" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-white italic uppercase tracking-tight">PRO Alpha Access</h2>
                                <p className="text-sm text-slate-400 font-medium">
                                    {lang === 'ko' ? '청산 목표가와 기관 인사이더 로직은 PRO 등급에게만 공개됩니다.' : 'Exit targets and institutional insider logic are exclusive to PRO tier.'}
                                </p>
                            </div>
                        </div>
                        <Link href="/pricing" className="px-8 py-4 bg-yellow-500 hover:bg-yellow-400 text-slate-950 rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl shadow-yellow-500/20 active:scale-95 shrink-0 relative z-10">
                            {lang === 'ko' ? 'PRO로 업그레이드' : 'Upgrade to PRO'}
                        </Link>
                    </div>
                )}

                {/* Signals Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {loading ? (
                        Array(8).fill(0).map((_, i) => (
                            <div key={i} className="h-[450px] bg-slate-900/40 border border-slate-800 rounded-[2.5rem] animate-pulse"></div>
                        ))
                    ) : (
                        signals.map((sig, idx) => (
                            <div key={sig.id} className="group relative bg-[#0a0f1e] border border-slate-800/80 rounded-[2.5rem] p-8 hover:border-yellow-500/30 transition-all duration-500 hover:translate-y-[-8px] shadow-2xl overflow-hidden">
                                {/* Whale/Premium Badge */}
                                <div className="absolute top-0 right-0 p-8">
                                    <div className="flex flex-col items-end gap-2">
                                        <div className="flex items-center gap-1.5 px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded-full">
                                            <Waves className="w-3 h-3 text-yellow-500" />
                                            <span className="text-[9px] font-black text-yellow-500 uppercase tracking-widest">
                                                {lang === 'ko' ? '고래 활동 감지' : 'Whale Active'}
                                            </span>
                                        </div>
                                        <div className={`flex items-center gap-1 text-xs font-black ${sig.change_pct >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                            {sig.change_pct >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                            {sig.change_pct > 0 ? '+' : ''}{sig.change_pct}%
                                        </div>
                                    </div>
                                </div>

                                {/* Ticker Symbol */}
                                <div className="mb-10">
                                    <div className="inline-block px-4 py-1 bg-slate-950 border border-slate-800 rounded-xl text-xs font-black text-indigo-400 mb-4 tracking-wider uppercase">
                                        {sig.ticker}
                                    </div>
                                    <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-none group-hover:text-yellow-500 transition-colors">
                                        {sig.ticker}
                                    </h3>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-2 truncate w-[80%]">
                                        {sig.name}
                                    </p>
                                </div>

                                {/* AI Confidence Gauge */}
                                <div className="mb-10 space-y-3">
                                    <div className="flex justify-between items-end">
                                        <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">
                                            {lang === 'ko' ? 'AI 신뢰도' : 'AI Confidence'}
                                        </span>
                                        <span className="text-sm font-black text-white">{sig.impact_score}%</span>
                                    </div>
                                    <div className="relative h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                                        <div
                                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-600 via-purple-500 to-indigo-400 rounded-full transition-all duration-1000 ease-out"
                                            style={{ width: `${sig.impact_score}%` }}
                                        ></div>
                                        <div
                                            className="absolute top-0 left-0 h-full w-20 bg-white/20 blur-md animate-shimmer"
                                            style={{ left: `${sig.impact_score - 10}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Prices & Targets Grid */}
                                <div className="grid grid-cols-1 gap-5 mb-10">
                                    {/* Current Entry Price */}
                                    <div className="flex justify-between items-center p-4 bg-slate-950/50 border border-slate-800/50 rounded-2xl group/price">
                                        <div className="flex items-center gap-2">
                                            <div className="p-2 bg-indigo-500/10 rounded-lg group-hover/price:bg-indigo-500/20 transition-colors">
                                                <Activity className="w-4 h-4 text-indigo-400" />
                                            </div>
                                            <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{lang === 'ko' ? '진입가(현재)' : 'Entry(Current)'}</span>
                                        </div>
                                        <div className="text-2xl font-black font-mono tracking-tighter text-white">
                                            ${sig.price}
                                        </div>
                                    </div>

                                    {/* Exit Targets */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-2 p-4 bg-green-500/5 border border-green-500/10 rounded-2xl group/target">
                                            <div className="flex items-center gap-2">
                                                <Target className="w-3 h-3 text-green-500" />
                                                <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest">{lang === 'ko' ? '익절가' : 'Target'}</span>
                                            </div>
                                            <div className={`text-xl font-black font-mono tracking-tighter transition-all duration-700 ${!isPro ? 'blur-md select-none text-slate-700' : 'text-green-400'}`}>
                                                ${sig.target_price}
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-2 p-4 bg-red-500/5 border border-red-500/10 rounded-2xl group/stop">
                                            <div className="flex items-center gap-2">
                                                <ShieldAlert className="w-3 h-3 text-red-500" />
                                                <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest">{lang === 'ko' ? '손절가' : 'Stop'}</span>
                                            </div>
                                            <div className={`text-xl font-black font-mono tracking-tighter transition-all duration-700 ${!isPro ? 'blur-md select-none text-slate-700' : 'text-red-500'}`}>
                                                ${sig.stop_loss}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Kim Daeri Senior Analyst Report */}
                                <div className="relative pt-6 border-t border-slate-800/80">
                                    <div className="flex items-center gap-2 mb-4">
                                        <BrainCircuit className="w-4 h-4 text-yellow-500" />
                                        <span className="text-[10px] font-black text-white uppercase tracking-widest">
                                            {lang === 'ko' ? '김대리의 심층 알파 리포트' : 'Kim Daeri Alpha Report'}
                                        </span>
                                    </div>

                                    <div className={`space-y-4 transition-all duration-700 ${!isPro ? 'blur-md select-none opacity-20' : ''}`}>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-1.5 text-[9px] font-black text-indigo-400 uppercase tracking-tighter">
                                                <Activity className="w-2.5 h-2.5" /> {lang === 'ko' ? '기술적 분석' : 'Technical'}
                                            </div>
                                            <p className="text-[11px] leading-relaxed text-slate-300 italic">
                                                {sig.technical_analysis || sig.ai_reason}
                                            </p>
                                        </div>

                                        <div className="space-y-1">
                                            <div className="flex items-center gap-1.5 text-[9px] font-black text-purple-400 uppercase tracking-tighter">
                                                <BarChart4 className="w-2.5 h-2.5" /> {lang === 'ko' ? '기본적 분석' : 'Fundamental'}
                                            </div>
                                            <p className="text-[11px] leading-relaxed text-slate-300 italic">
                                                {sig.fundamental_analysis || (lang === 'ko' ? '기관 수급 및 자본 효율성 개선 신호가 포착되었습니다.' : 'Institutional flow and capital efficiency signals detected.')}
                                            </p>
                                        </div>

                                        <div className="space-y-1">
                                            <div className="flex items-center gap-1.5 text-[9px] font-black text-yellow-500 uppercase tracking-tighter">
                                                <Zap className="w-2.5 h-2.5" /> {lang === 'ko' ? '전략 제언' : 'Action Plan'}
                                            </div>
                                            <p className="text-[11px] leading-relaxed text-white font-bold italic">
                                                {sig.action_plan || (lang === 'ko' ? '현 지점에서 비중 확대가 유효합니다.' : 'Accumulation is favorable at this level.')}
                                            </p>
                                        </div>
                                    </div>

                                    {!isPro && (
                                        <div className="absolute inset-0 flex items-center justify-center pt-8">
                                            <div className="px-6 py-2 bg-slate-950 border border-slate-700 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 shadow-2xl">
                                                {lang === 'ko' ? 'PRO 전용 심층 분석' : 'PRO Deep Analysis'}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Hover Glow Layer */}
                                <div className="absolute inset-0 border-[1px] border-yellow-500/0 group-hover:border-yellow-500/20 rounded-[2.5rem] transition-all duration-500 pointer-events-none"></div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer Insight */}
                <div className="mt-20 text-center max-w-2xl mx-auto">
                    <BarChart4 className="w-10 h-10 text-slate-800 mx-auto mb-6" />
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
                        {lang === 'ko'
                            ? '제공되는 모든 시그널은 실시간 뉴스 감성 지수와 거래소 유동성 데이터를 AI가 실시간으로 분석한 결과입니다. 최종 투자의 결정과 책임은 본인에게 있습니다.'
                            : 'All signals provided are real-time AI analysis of news sentiment and exchange liquidity. Final investment decisions and responsibilities lie with the user.'}
                    </p>
                </div>
            </main>
        </div>
    );
}

export default function VVIPAlphaPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#020617] flex items-center justify-center text-white font-black uppercase tracking-widest">Accessing Elite Nodes...</div>}>
            <VVIPAlphaContent />
        </Suspense>
    );
}
