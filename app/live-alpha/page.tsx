'use client';

import { useState, useEffect, Suspense } from 'react';
import { RefreshCw, Zap, TrendingUp, TrendingDown, ArrowLeft, Activity, Lock } from 'lucide-react';
import Link from 'next/link';
import SiteHeader from '@/components/SiteHeader';
import { useAuth } from '@/lib/AuthContext';
import { translations } from '@/lib/translations';

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
    const [lang, setLang] = useState<'ko' | 'en'>('ko');
    const { user } = useAuth();
    const isVVIP = user?.tier === 'VVIP';

    useEffect(() => {
        const savedLang = localStorage.getItem('stock-empire-lang') as 'ko' | 'en';
        if (savedLang) setLang(savedLang);
        fetchSignals();

        // Auto-refresh every 30 seconds
        const interval = setInterval(fetchSignals, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchSignals = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/alpha-signals?lang=${lang}&t=${Date.now()}`);
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

    return (
        <div className="min-h-screen bg-[#050b14] text-white font-sans flex flex-col">
            <SiteHeader lang={lang} setLang={setLang} />

            <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
                    <div>
                        <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-white mb-4 transition-colors">
                            <ArrowLeft className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase tracking-widest">{lang === 'ko' ? '메인으로 돌아가기' : 'Back to Dashboard'}</span>
                        </Link>
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></span>
                                <div className="p-3 bg-red-600 rounded-xl shadow-lg shadow-red-600/20">
                                    <Activity className="w-6 h-6 text-white animate-pulse" />
                                </div>
                            </div>
                            <div>
                                <h1 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter text-white">
                                    Live <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">Alpha Scanner</span>
                                </h1>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
                                    {lang === 'ko' ? '실시간 시장 데이터 기반 AI 자동 분석' : 'AI Analysis based on Real-Time Market Data'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-right hidden md:block">
                            <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Last Update</div>
                            <div className="text-xs font-mono text-indigo-400">
                                {lastUpdated ? lastUpdated.toLocaleTimeString() : '--:--:--'}
                            </div>
                        </div>
                        <button
                            onClick={fetchSignals}
                            disabled={loading}
                            className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition-all active:scale-95 disabled:opacity-50"
                        >
                            <RefreshCw className={`w-5 h-5 text-white ${loading ? 'animate-spin' : ''}`} />
                        </button>
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {signals.map((sig, idx) => (
                        <div key={sig.id} className="group relative bg-slate-900/50 border border-slate-800 rounded-3xl p-6 hover:border-indigo-500/50 transition-all cursor-pointer overflow-hidden">
                            {/* Background Pulse Effect on Hover */}
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 via-indigo-500/0 to-indigo-500/0 group-hover:to-indigo-500/5 transition-all duration-500"></div>

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
                                <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
                                    {sig.change_pct >= 0 ? <TrendingUp className="w-5 h-5 text-green-500" /> : <TrendingDown className="w-5 h-5 text-red-500" />}
                                </div>
                            </div>

                            <div className="space-y-4 relative z-10">
                                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
                                    <div className="flex justify-between items-end mb-2">
                                        <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">AI Confidence</span>
                                        <span className="text-sm font-black text-white">{sig.impact_score}%</span>
                                    </div>
                                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full ${sig.impact_score > 90 ? 'bg-purple-500' : 'bg-indigo-500'}`}
                                            style={{ width: `${sig.impact_score}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">{lang === 'ko' ? '목표가' : 'Target'}</div>
                                        <div className={`text-lg font-black font-mono ${!isVVIP ? 'blur-sm select-none text-slate-600' : 'text-green-400'}`}>
                                            ${sig.target_price}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">{lang === 'ko' ? '손절가' : 'Stop Loss'}</div>
                                        <div className={`text-lg font-black font-mono ${!isVVIP ? 'blur-sm select-none text-slate-600' : 'text-red-400'}`}>
                                            ${sig.stop_loss}
                                        </div>
                                    </div>
                                </div>

                                <div className="relative pt-4 border-t border-slate-800/50">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Zap className="w-3 h-3 text-yellow-400" />
                                        <span className="text-[10px] font-black text-yellow-400 uppercase tracking-widest">{lang === 'ko' ? 'AI 분석 근거' : 'AI Rationale'}</span>
                                    </div>
                                    <p className="text-xs text-slate-300 leading-relaxed italic opacity-80 line-clamp-2">
                                        "{sig.ai_reason}"
                                    </p>

                                    {!isVVIP && (
                                        <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-[1px] flex flex-col items-center justify-center text-center p-2 rounded-xl">
                                            <Lock className="w-4 h-4 text-slate-400 mb-1" />
                                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">VVIP Only</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}

export default function LiveAlphaPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#050b14] flex items-center justify-center text-white font-black uppercase tracking-widest">Initializing Live Scanner...</div>}>
            <LiveAlphaContent />
        </Suspense>
    );
}
