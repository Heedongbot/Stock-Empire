'use client';

import { useState, useEffect, Suspense } from 'react';
import {
    Crown, TrendingUp, TrendingDown, Target, ShieldAlert,
    ArrowLeft, Activity, Zap, ShieldCheck, RefreshCw, ChevronRight,
    Search, BarChart4, Waves, BrainCircuit, Lock
} from 'lucide-react';
import SiteHeader from '@/components/SiteHeader';
import { useAuth } from '@/lib/AuthContext';
import Link from 'next/link';
import AdLeaderboard from '@/components/ads/AdLeaderboard';

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
    const { user } = useAuth();
    const isAdmin = user?.role === 'ADMIN';

    useEffect(() => {
        if (isAdmin) {
            fetchSignals();
        } else {
            setLoading(false); // 일반 유저에게는 로딩 중단
        }
    }, [isAdmin]);

    const fetchSignals = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/alpha-signals?lang=ko&t=${Date.now()}`);
            const data = await res.json();
            if (Array.isArray(data)) {
                setSignals(data);
            }
        } catch (e) {
            console.error("Failed to fetch Alpha signals", e);
        } finally {
            setLoading(false);
        }
    };

    // 보스(ADMIN)가 아닌 경우 접근 차단 화면 노출
    if (!isAdmin) {
        return (
            <div className="min-h-screen bg-[#050b14] text-slate-100 font-sans">
                <SiteHeader />
                <main className="max-w-4xl mx-auto px-6 py-32 text-center">
                    <div className="inline-flex p-6 bg-slate-900 rounded-full mb-8 border border-white/5">
                        <Lock className="w-16 h-16 text-[#00ffbd] animate-pulse" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-white mb-6">
                        PRIVATE CONTROL ZONE
                    </h1>
                    <p className="text-slate-400 text-lg mb-12 font-medium leading-relaxed">
                        이 구역은 고위험 알파 시그널 통제 센터입니다.<br />
                        리스크 관리를 위해 보스(ADMIN) 전용으로 운영됩니다.
                    </p>
                    <Link href="/" className="inline-flex items-center gap-2 px-10 py-4 bg-[#00ffbd] hover:bg-[#00d4ff] text-black rounded-2xl font-black uppercase tracking-widest transition-all">
                        메인 터미널로 복귀 <ChevronRight className="w-5 h-5" />
                    </Link>
                    <div className="mt-20">
                        <AdLeaderboard />
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#020617] text-slate-100 font-sans">
            <SiteHeader />

            <main className="relative z-10 max-w-7xl mx-auto px-6 py-12">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
                    <div className="space-y-4">
                        <Link href="/" className="inline-flex items-center gap-2 text-[#00ffbd] hover:text-white transition-colors text-xs font-black uppercase tracking-widest group">
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            사령부로 복귀
                        </Link>
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-gradient-to-tr from-[#00ffbd] to-blue-600 rounded-2xl shadow-lg shadow-[#00ffbd]/20">
                                <ShieldCheck className="w-8 h-8 text-black" />
                            </div>
                            <div>
                                <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-white leading-none">
                                    BOSS <span className="text-[#00ffbd]">ALPHA ROOM</span>
                                </h1>
                                <p className="text-[10px] text-[#00ffbd]/70 font-black uppercase tracking-[0.4em] mt-2">
                                    사령관 전용 고위험/고수익 실시간 시그널 통제실
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="flex-1 md:flex-none relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <input
                                type="text"
                                placeholder="데이터 모니터링..."
                                className="bg-slate-900 border border-slate-800 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-[#00ffbd]/50 w-full"
                            />
                        </div>
                        <button
                            onClick={fetchSignals}
                            className="p-3 bg-slate-900 border border-slate-800 rounded-2xl hover:bg-slate-800 transition-all active:scale-95"
                        >
                            <RefreshCw className={`w-5 h-5 text-slate-400 ${loading ? 'animate-spin' : ''}`} />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {loading ? (
                        Array(8).fill(0).map((_, i) => (
                            <div key={i} className="h-[450px] bg-slate-900/40 border border-slate-800 rounded-[2.5rem] animate-pulse"></div>
                        ))
                    ) : (
                        signals.map((sig) => (
                            <div key={sig.id} className="group relative bg-[#0a0f1e] border border-slate-800/80 rounded-[2.5rem] p-8 hover:border-[#00ffbd]/30 transition-all duration-500 hover:translate-y-[-8px] shadow-2xl overflow-hidden">
                                <div className="absolute top-0 right-0 p-8">
                                    <div className="flex flex-col items-end gap-2">
                                        <div className="flex items-center gap-1.5 px-3 py-1 bg-[#00ffbd]/10 border border-[#00ffbd]/20 rounded-full">
                                            <Waves className="w-3 h-3 text-[#00ffbd]" />
                                            <span className="text-[9px] font-black text-[#00ffbd] uppercase tracking-widest">BOSS PICK</span>
                                        </div>
                                        <div className={`flex items-center gap-1 text-xs font-black ${sig.change_pct >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                            {sig.change_pct > 0 ? '+' : ''}{sig.change_pct}%
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-10">
                                    <div className="inline-block px-4 py-1 bg-slate-950 border border-slate-800 rounded-xl text-xs font-black text-[#00ffbd] mb-4 tracking-wider uppercase">
                                        {sig.ticker}
                                    </div>
                                    <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-none group-hover:text-[#00ffbd] transition-colors">
                                        {sig.ticker}
                                    </h3>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-2 truncate">
                                        {sig.name}
                                    </p>
                                </div>

                                <div className="mb-10 space-y-3">
                                    <div className="flex justify-between items-end">
                                        <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">AI Confidence</span>
                                        <span className="text-sm font-black text-white">{sig.impact_score}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-[#00ffbd]"
                                            style={{ width: `${sig.impact_score}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-5 mb-10">
                                    <div className="flex justify-between items-center p-4 bg-slate-950/50 border border-slate-800rounded-2xl">
                                        <span className="text-[10px] text-slate-500 font-black uppercase">Entry</span>
                                        <div className="text-2xl font-black font-mono text-white">${sig.price}</div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-2 p-4 bg-green-500/5 border border-green-500/10 rounded-2xl">
                                            <span className="text-[9px] text-slate-500 font-black">Target</span>
                                            <div className="text-xl font-black font-mono text-green-400">${sig.target_price}</div>
                                        </div>
                                        <div className="flex flex-col gap-2 p-4 bg-red-500/5 border border-red-500/10 rounded-2xl">
                                            <span className="text-[9px] text-slate-500 font-black">Stop</span>
                                            <div className="text-xl font-black font-mono text-red-500">${sig.stop_loss}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="relative pt-6 border-t border-slate-800">
                                    <div className="flex items-center gap-2 mb-4">
                                        <BrainCircuit className="w-4 h-4 text-yellow-500" />
                                        <span className="text-[10px] font-black text-white uppercase tracking-widest">ALPHA INSIGHT</span>
                                    </div>
                                    <p className="text-[11px] leading-relaxed text-slate-400 italic">
                                        {sig.ai_reason}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                <div className="mt-20">
                    <AdLeaderboard />
                </div>
            </main>
        </div>
    );
}

export default function VVIPAlphaPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#020617] flex items-center justify-center text-white font-black uppercase tracking-widest">Accessing Boss Terminal...</div>}>
            <VVIPAlphaContent />
        </Suspense>
    );
}
