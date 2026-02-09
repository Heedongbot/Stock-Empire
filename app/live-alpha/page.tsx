'use client';

import { useState, useEffect, Suspense } from 'react';
import { RefreshCw, Zap, TrendingUp, TrendingDown, ArrowLeft, Activity, Lock, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import SiteHeader from '@/components/SiteHeader';
import { useAuth } from '@/lib/AuthContext';
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
    updated_at: string;
}

function LiveAlphaContent() {
    const [signals, setSignals] = useState<AlphaSignal[]>([]);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const { user } = useAuth();
    const isAdmin = user?.role === 'ADMIN';

    useEffect(() => {
        if (isAdmin) {
            fetchSignals();
            const interval = setInterval(fetchSignals, 30000);
            return () => clearInterval(interval);
        } else {
            setLoading(false);
        }
    }, [isAdmin]);

    const fetchSignals = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/alpha-signals?lang=ko&t=${Date.now()}`);
            const data = await res.json();
            if (Array.isArray(data)) {
                setSignals(data);
                setLastUpdated(new Date());
            }
        } catch (e) {
            console.error("Failed to fetch live signals", e);
        } finally {
            setLoading(false);
        }
    };

    if (!isAdmin) {
        return (
            <div className="min-h-screen bg-[#050b14] text-white font-sans">
                <SiteHeader />
                <main className="max-w-4xl mx-auto px-6 py-32 text-center">
                    <div className="inline-flex p-6 bg-slate-900 rounded-full mb-8 border border-white/5">
                        <Lock className="w-16 h-16 text-[#ff4d4d] animate-pulse" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-white mb-6">
                        PRIVATE ALPHA SCANNER
                    </h1>
                    <p className="text-slate-400 text-lg mb-12 font-medium">
                        실시간 알파 스캐너는 보스(ADMIN) 전용 보안 승인이 필요합니다.<br />
                        리스크 제어를 위해 일반 접근이 제한되었습니다.
                    </p>
                    <Link href="/" className="inline-flex items-center gap-2 px-10 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-black uppercase tracking-widest transition-all">
                        메인 화면으로 이동
                    </Link>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050b14] text-white font-sans flex flex-col">
            <SiteHeader />

            <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
                    <div>
                        <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-white mb-4 transition-all group">
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            <span className="text-xs font-black uppercase tracking-widest">대시보드로 돌아가기</span>
                        </Link>
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-[#00ffbd] rounded-xl shadow-lg shadow-[#00ffbd]/20">
                                <ShieldCheck className="w-6 h-6 text-black" />
                            </div>
                            <div>
                                <h1 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter text-white">
                                    BOSS <span className="text-[#00ffbd]">LIVE SCANNER</span>
                                </h1>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
                                    사령관 전용 실시간 시장 동적 분석 엔진
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-right hidden md:block">
                            <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest">LAST SYNC</div>
                            <div className="text-xs font-black text-[#00ffbd] font-mono">
                                {lastUpdated ? lastUpdated.toLocaleTimeString() : '--:--:--'}
                            </div>
                        </div>
                        <button
                            onClick={fetchSignals}
                            disabled={loading}
                            className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition-all active:scale-95 disabled:opacity-50 border border-slate-700 hover:border-[#00ffbd]/50"
                        >
                            <RefreshCw className={`w-5 h-5 text-white ${loading ? 'animate-spin' : ''}`} />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {signals.map((sig) => (
                        <div key={sig.id} className="group relative bg-slate-950 border border-slate-800 rounded-3xl p-6 hover:border-[#00ffbd]/50 transition-all cursor-pointer overflow-hidden shadow-xl">
                            <div className="flex justify-between items-start mb-6 relative z-10">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-2xl font-black text-white tracking-tight">{sig.ticker}</h3>
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wide ${sig.change_pct >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                            {sig.change_pct > 0 ? '+' : ''}{sig.change_pct}%
                                        </span>
                                    </div>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest truncate max-w-[150px]">{sig.name}</p>
                                </div>
                                <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
                                    {sig.change_pct >= 0 ? <TrendingUp className="w-5 h-5 text-green-500" /> : <TrendingDown className="w-5 h-5 text-red-500" />}
                                </div>
                            </div>

                            <div className="space-y-4 relative z-10">
                                <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800">
                                    <div className="flex justify-between items-end mb-2">
                                        <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Confidence</span>
                                        <span className="text-sm font-black text-white">{sig.impact_score}%</span>
                                    </div>
                                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-[#00ffbd]"
                                            style={{ width: `${sig.impact_score}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Target</div>
                                        <div className="text-lg font-black font-mono text-green-400">${sig.target_price}</div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Stop</div>
                                        <div className="text-lg font-black font-mono text-red-400">${sig.stop_loss}</div>
                                    </div>
                                </div>

                                <div className="relative pt-4 border-t border-slate-800/50">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Zap className="w-3 h-3 text-[#00ffbd] fill-[#00ffbd]" />
                                        <span className="text-[10px] font-black text-[#00ffbd] uppercase tracking-widest">Boss Insight</span>
                                    </div>
                                    <p className="text-xs text-slate-300 leading-relaxed italic opacity-80 line-clamp-3">
                                        "{sig.ai_reason}"
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-20">
                    <AdLeaderboard />
                </div>
            </main>
        </div>
    );
}

export default function LiveAlphaPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#050b14] flex items-center justify-center text-white font-black uppercase tracking-widest animate-pulse">Boss Scanner Accessing...</div>}>
            <LiveAlphaContent />
        </Suspense>
    );
}
