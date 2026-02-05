'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Zap, Clock, TrendingUp, TrendingDown, AlertTriangle, Lock,
    ArrowUpRight, ArrowDownRight, Activity, BarChart2, CheckCircle2,
    RefreshCw, Globe, ShieldAlert, Award, Search, Target, Crown, ChevronRight,
    PieChart, MousePointer2, Info
} from 'lucide-react';
import SiteHeader from '@/components/SiteHeader';
import { translations } from '@/lib/translations';
import { QuizWidget } from '@/components/QuizWidget';

// --- Interfaces ---
interface AlphaSignal {
    id: string;
    ticker: string;
    name: string;
    strategy: string;
    price: number;
    change_pct: number;
    sentiment: "BULLISH" | "BEARISH" | "NEUTRAL";
    impact_score: number;
    target_price: number;
    stop_loss: number;
    ai_reason: string;
    updated_at: string;
}

const STRATEGY_DATA = [
    { id: 'ALL', name: '전체 전략', icon: <Activity className="w-4 h-4" /> },
    { id: '골든크로스', name: '골든크로스', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'RSI', name: 'RSI 반등', icon: <BarChart2 className="w-4 h-4" /> },
    { id: '수급', name: '수급 폭발', icon: <Zap className="w-4 h-4" /> },
    { id: '낙폭', name: '낙폭 과대', icon: <AlertTriangle className="w-4 h-4" /> },
];

export default function AnalysisStrategyPage() {
    const [lang, setLang] = useState<'ko' | 'en'>('ko');
    const t = translations[lang];
    const [signals, setSignals] = useState<AlphaSignal[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('ALL');
    const [userTier, setUserTier] = useState<'FREE' | 'VIP' | 'VVIP'>('FREE');
    const [selectedSignal, setSelectedSignal] = useState<AlphaSignal | null>(null);

    useEffect(() => {
        // Load Tier from local storage
        const savedTier = localStorage.getItem('stock-empire-tier');
        if (savedTier) setUserTier(savedTier as any);

        const fetchSignals = async () => {
            try {
                const res = await fetch(`/alpha-signals.json?t=${Date.now()}`);
                if (res.ok) {
                    const data = await res.json();
                    setSignals(data);
                }
            } catch (e) {
                console.error("Failed to load signals", e);
            } finally {
                setLoading(false);
            }
        };
        fetchSignals();
    }, []);

    const filteredSignals = signals.filter(s => {
        if (activeTab === 'ALL') return true;
        return s.strategy.includes(activeTab);
    });

    return (
        <div className="min-h-screen bg-[#050b14] text-slate-200 font-sans selection:bg-indigo-500/30">
            <SiteHeader lang={lang} setLang={setLang} />

            <main className="max-w-7xl mx-auto px-6 py-12">
                {/* 1. Page Hero */}
                <div className="mb-20 text-center relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-indigo-500/10 blur-[120px] -z-10 rounded-full" />

                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/50 border border-slate-700 mb-8 animate-fade-in-up">
                        <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                        <span className="text-xs font-black text-slate-300 uppercase tracking-widest">Global Multi-Strategy Intelligence</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter text-white mb-6">
                        {lang === 'ko' ? 'AI 멀티 전략 분석실' : 'AI Multi-Strategy Lab'}
                    </h1>
                    <p className="text-lg text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
                        {lang === 'ko'
                            ? '기술적 지표, 펀더멘털, 수급을 분석하여 AI가 도출한 실시간 최적의 매매 전략입니다.'
                            : 'Real-time optimized trading strategies derived by AI by analyzing indicators, fundamentals, and supply.'}
                    </p>

                    {/* Tier Switcher for Demo */}
                    <div className="mt-8 flex justify-center gap-3">
                        {['FREE', 'VIP', 'VVIP'].map(tier => (
                            <button
                                key={tier}
                                onClick={() => setUserTier(tier as any)}
                                className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${userTier === tier ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-500'}`}
                            >
                                {tier} 시점
                            </button>
                        ))}
                    </div>
                </div>

                {/* 2. Strategy Tabs */}
                <div className="flex flex-wrap justify-center gap-3 mb-12">
                    {STRATEGY_DATA.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest border transition-all ${activeTab === tab.id
                                ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400 shadow-lg shadow-indigo-500/10'
                                : 'bg-slate-900/50 border-slate-800 text-slate-500 hover:border-slate-600'}`}
                        >
                            {tab.icon}
                            {tab.name}
                        </button>
                    ))}
                </div>

                {/* 3. Signals Grid */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-40">
                        <RefreshCw className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
                        <p className="text-slate-500 font-black animate-pulse uppercase tracking-widest">Analyzing Market Patterns...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredSignals.map((signal, idx) => (
                            <div
                                key={idx}
                                onClick={() => setSelectedSignal(signal)}
                                className="group relative bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden hover:border-indigo-500/50 transition-all hover:shadow-2xl hover:shadow-indigo-500/20 cursor-pointer flex flex-col h-full animate-fade-in-up"
                                style={{ animationDelay: `${idx * 100}ms` }}
                            >
                                {/* Strategy Badge */}
                                <div className="absolute top-4 right-4 z-10">
                                    <span className="px-3 py-1 bg-indigo-500 text-white text-[10px] font-black uppercase tracking-tighter rounded-lg shadow-lg">
                                        {signal.strategy}
                                    </span>
                                </div>

                                <div className="p-8 flex flex-col h-full">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="w-12 h-12 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-center text-xl font-black text-indigo-400">
                                            {signal.ticker[0]}
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black text-white">{signal.ticker}</h3>
                                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{signal.name}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-8">
                                        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                                            <span className="text-[10px] font-black text-slate-500 uppercase block mb-1">Sentiment</span>
                                            <span className={`text-sm font-black uppercase flex items-center gap-1 ${signal.sentiment === 'BULLISH' ? 'text-green-500' : 'text-red-500'}`}>
                                                {signal.sentiment === 'BULLISH' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                                {signal.sentiment}
                                            </span>
                                        </div>
                                        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                                            <span className="text-[10px] font-black text-slate-500 uppercase block mb-1">AI Score</span>
                                            <span className="text-sm font-black text-indigo-400">{signal.impact_score}%</span>
                                        </div>
                                    </div>

                                    <div className="space-y-4 mb-8">
                                        <div className="flex justify-between items-center text-sm font-bold">
                                            <span className="text-slate-500">Target</span>
                                            <span className={`text-green-500 ${userTier === 'FREE' ? 'filter blur-[6px]' : ''}`}>
                                                ${signal.target_price}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm font-bold">
                                            <span className="text-slate-500">Stop Loss</span>
                                            <span className={`text-red-500 ${userTier === 'FREE' ? 'filter blur-[6px]' : ''}`}>
                                                ${signal.stop_loss}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-auto pt-6 border-t border-slate-800/50">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Activity className="w-3 h-3 text-indigo-400" />
                                            <span className="text-[10px] font-black text-slate-400 uppercase">Analysis Brief</span>
                                        </div>
                                        <p className={`text-xs text-slate-300 font-medium leading-relaxed line-clamp-2 ${userTier === 'FREE' ? 'filter blur-[1px] opacity-50' : ''}`}>
                                            {signal.ai_reason}
                                        </p>
                                        {userTier === 'FREE' && (
                                            <div className="mt-2 flex items-center gap-1 text-[10px] font-black text-indigo-500 uppercase tracking-widest">
                                                <Lock className="w-3 h-3" /> Upgrade to view details
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* --- Signal Detail Modal --- */}
            {selectedSignal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-md animate-fade-in" onClick={() => setSelectedSignal(null)} />
                    <div className="relative bg-[#0f172a] border border-slate-700 w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl animate-fade-in-up">
                        <div className={`h-2 w-full ${selectedSignal.sentiment === 'BULLISH' ? 'bg-green-500 shadow-lg shadow-green-500/20' : 'bg-red-500 shadow-lg shadow-red-500/20'}`} />

                        <div className="p-10">
                            <div className="flex justify-between items-start mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-2xl font-black text-indigo-400 border border-indigo-500/20">
                                        {selectedSignal.ticker[0]}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <h2 className="text-3xl font-black text-white">{selectedSignal.ticker}</h2>
                                            <span className="px-2 py-0.5 bg-slate-800 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-md">Live Update</span>
                                        </div>
                                        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">{selectedSignal.name} • {selectedSignal.strategy}</p>
                                    </div>
                                </div>
                                <button onClick={() => setSelectedSignal(null)} className="p-2 hover:bg-slate-800 rounded-full transition-colors">
                                    <RefreshCw className="w-6 h-6 text-slate-500" />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                                <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800">
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Current Price</span>
                                    <div className="text-2xl font-black text-white">${selectedSignal.price}</div>
                                    <div className={`text-xs font-black ${selectedSignal.change_pct > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                        {selectedSignal.change_pct > 0 ? '+' : ''}{selectedSignal.change_pct}%
                                    </div>
                                </div>
                                <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800">
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">AI Impact Score</span>
                                    <div className="text-2xl font-black text-indigo-400">{selectedSignal.impact_score}/100</div>
                                    <div className="text-[10px] font-bold text-slate-600 uppercase">High Confidence</div>
                                </div>
                                <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800">
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Detected Trend</span>
                                    <div className={`text-lg font-black uppercase flex items-center gap-2 ${selectedSignal.sentiment === 'BULLISH' ? 'text-green-500' : 'text-red-500'}`}>
                                        {selectedSignal.sentiment} {selectedSignal.sentiment === 'BULLISH' ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6 mb-10">
                                <div className="p-6 rounded-3xl bg-indigo-500/5 border border-indigo-500/10 mb-6">
                                    <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <Zap className="w-4 h-4 fill-indigo-400" /> AI Strategy Insight
                                    </h4>
                                    <p className={`text-base text-slate-300 leading-relaxed font-medium ${userTier === 'FREE' ? 'filter blur-[10px] select-none opacity-40' : ''}`}>
                                        {selectedSignal.ai_reason}
                                    </p>
                                    {userTier === 'FREE' && (
                                        <div className="mt-4 flex flex-col items-center">
                                            <Lock className="w-8 h-8 text-indigo-500/50 mb-2" />
                                            <p className="text-xs font-black text-white uppercase mb-4 tracking-widest">Locked Content</p>
                                            <button
                                                onClick={() => setUserTier('VIP')}
                                                className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-900/40"
                                            >
                                                Unlock Strategy Report
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 relative overflow-hidden">
                                        <span className="text-[10px] font-black text-green-500 uppercase tracking-widest block mb-1">Target TP</span>
                                        <div className={`text-2xl font-black text-green-400 ${userTier === 'FREE' ? 'filter blur-[12px]' : ''}`}>
                                            ${selectedSignal.target_price}
                                        </div>
                                        {userTier === 'FREE' && <div className="absolute inset-0 flex items-center justify-center"><Crown className="w-5 h-5 text-slate-700" /></div>}
                                    </div>
                                    <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 relative overflow-hidden">
                                        <span className="text-[10px] font-black text-red-500 uppercase tracking-widest block mb-1">Stop Loss SL</span>
                                        <div className={`text-2xl font-black text-red-400 ${userTier === 'FREE' ? 'filter blur-[12px]' : ''}`}>
                                            ${selectedSignal.stop_loss}
                                        </div>
                                        {userTier === 'FREE' && <div className="absolute inset-0 flex items-center justify-center"><Crown className="w-5 h-5 text-slate-700" /></div>}
                                    </div>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
                                <div className="flex items-center gap-2 text-xs text-slate-500 font-bold uppercase">
                                    <Clock className="w-4 h-4" /> Analyzed At: {new Date(selectedSignal.updated_at).toLocaleString()}
                                </div>
                                <div className="flex gap-4">
                                    <button className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all">
                                        Back to Market
                                    </button>
                                    <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-900/20 transition-all flex items-center gap-2">
                                        Trading View <ArrowUpRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <QuizWidget />

            <footer className="border-t border-slate-800 py-12 text-center text-slate-700 text-[10px] font-black uppercase tracking-widest">
                &copy; 2026 STOCK EMPIRE ANALYSIS LAB. SYSTEM OPERATIONAL.
            </footer>
        </div>
    );
}
