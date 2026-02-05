'use client';

import { useState, useEffect } from 'react';
import {
    Activity, Zap, Target, ShieldAlert, ChevronRight,
    ArrowUpRight, Lock, Crown, BarChart3, TrendingUp, TrendingDown,
    Filter, Search, Clock, Cpu, X
} from 'lucide-react';
import SiteHeader from '@/components/SiteHeader';
import { translations } from '@/lib/translations';
import { QuizWidget } from '@/components/QuizWidget';
import { useAuth } from '@/lib/AuthContext';

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
    strategy: string;
}

const STRATEGIES = [
    { id: 'ALL', name: '전체 전략', icon: Activity },
    { id: 'Golden Cross', name: '골든크로스', icon: Zap },
    { id: 'RSI Rebound', name: 'RSI 반등', icon: TrendingUp },
    { id: 'Volume Surge', name: '거래량 폭증', icon: BarChart3 }
];

export default function AnalysisPage() {
    const [lang, setLang] = useState<'ko' | 'en'>('ko');
    const t = translations[lang];
    const { user } = useAuth();
    const userTier = user?.tier || 'FREE';

    const [signals, setSignals] = useState<AlphaSignal[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');
    const [selectedSignal, setSelectedSignal] = useState<AlphaSignal | null>(null);

    useEffect(() => {
        const fetchSignals = async () => {
            try {
                const res = await fetch(`/alpha-signals.json?t=${Date.now()}`);
                const data = await res.json();
                if (Array.isArray(data)) {
                    setSignals(data);
                }
            } catch (e) {
                console.error("Failed to fetch signals", e);
            } finally {
                setLoading(false);
            }
        };
        fetchSignals();
    }, []);

    const filteredSignals = signals.filter(s => filter === 'ALL' || s.strategy === filter);

    return (
        <div className="min-h-screen bg-[#050b14] text-slate-200 font-sans">
            <SiteHeader lang={lang} setLang={setLang} />

            <main className="max-w-7xl mx-auto px-6 py-12">
                {/* Dashboard Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-8">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <Cpu className="w-5 h-5 text-indigo-400" />
                            <span className="text-xs font-black text-indigo-400 uppercase tracking-[0.3em]">AI Strategy Dashboard</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter text-white uppercase leading-none">
                            Market <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-500">Intelligence</span>
                        </h1>
                    </div>

                    <div className="flex flex-wrap gap-2 p-2 bg-slate-900/50 rounded-2xl border border-slate-800">
                        {STRATEGIES.map((strat: any) => (
                            <button
                                key={strat.id}
                                onClick={() => setFilter(strat.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === strat.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-500 hover:text-slate-300'}`}
                            >
                                <strat.icon size={14} />
                                {strat.name}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-40">
                        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-6" />
                        <p className="text-slate-500 text-xs font-black uppercase tracking-[0.5em] animate-pulse">Syncing Alpha Nodes...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredSignals.map((sig: AlphaSignal, idx: number) => (
                            <div
                                key={idx}
                                onClick={() => setSelectedSignal(sig)}
                                className="group relative bg-slate-900 border border-slate-800 rounded-3xl p-8 hover:border-indigo-500/50 transition-all cursor-pointer hover:shadow-2xl hover:shadow-indigo-500/10 overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <Activity className="w-24 h-24 text-white" />
                                </div>

                                <div className="flex justify-between items-start mb-6">
                                    <div className="px-3 py-1 bg-slate-950 border border-slate-800 rounded-lg text-xs font-black text-white">{sig.ticker}</div>
                                    <div className={`text-[10px] font-black flex items-center gap-1 uppercase tracking-widest ${sig.sentiment === 'BULLISH' ? 'text-green-500' : 'text-red-500'}`}>
                                        {sig.sentiment} {sig.change_pct}%
                                    </div>
                                </div>

                                <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tight">{sig.name}</h3>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-8">{sig.strategy}</p>

                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800">
                                        <div className="text-[9px] text-slate-600 font-bold uppercase tracking-widest mb-1">Impact</div>
                                        <div className="text-lg font-black text-indigo-400">{sig.impact_score}%</div>
                                    </div>
                                    <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800">
                                        <div className="text-[9px] text-slate-600 font-bold uppercase tracking-widest mb-1">Signal</div>
                                        <div className="text-lg font-black text-white">READY</div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between group-hover:translate-x-1 transition-transform">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400 italic">Deep Analysis Available</span>
                                    <ChevronRight className="w-4 h-4 text-indigo-400" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Signal Detail Modal */}
            {selectedSignal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setSelectedSignal(null)} />
                    <div className="relative bg-[#0f172a] border border-slate-700 w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl animate-fade-in-up">
                        <div className="bg-slate-900/50 p-8 border-b border-slate-800 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-600/20">
                                    <Zap className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">{selectedSignal.ticker}</h3>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{selectedSignal.strategy}</p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedSignal(null)} className="text-slate-500 hover:text-white transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-10">
                            <div className="grid grid-cols-2 gap-6 mb-10">
                                <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800">
                                    <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2">Target Price</div>
                                    <div className={`text-2xl font-black font-mono transition-all ${userTier === 'FREE' ? 'blur-md select-none' : 'text-green-500'}`}>
                                        ${selectedSignal.target_price}
                                    </div>
                                </div>
                                <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800">
                                    <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2">Stop Loss</div>
                                    <div className={`text-2xl font-black font-mono transition-all ${userTier === 'FREE' ? 'blur-md select-none' : 'text-red-500'}`}>
                                        ${selectedSignal.stop_loss}
                                    </div>
                                </div>
                            </div>

                            <div className="mb-10">
                                <div className="flex items-center gap-2 mb-4">
                                    <Activity className="w-4 h-4 text-indigo-400" />
                                    <h4 className="text-xs font-black text-white uppercase tracking-widest">AI Rationale</h4>
                                </div>
                                <div className={`relative p-8 rounded-3xl bg-slate-900/50 border border-slate-800 ${userTier === 'FREE' ? 'blur-lg select-none' : ''}`}>
                                    <p className="text-slate-300 leading-relaxed italic">"{selectedSignal.ai_reason}"</p>
                                </div>
                                {userTier === 'FREE' && (
                                    <div className="flex flex-col items-center justify-center mt-[-80px] relative z-10">
                                        <div className="p-4 bg-indigo-600 rounded-full mb-4 shadow-xl">
                                            <Lock className="w-6 h-6 text-white" />
                                        </div>
                                        <button className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-600/20">Upgrade to VVIP Access</button>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-between items-center pt-8 border-t border-slate-800">
                                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                                    Last Updated: {new Date(selectedSignal.updated_at).toLocaleTimeString()}
                                </div>
                                <button className="flex items-center gap-2 text-xs font-black text-indigo-400 hover:text-white transition-colors uppercase tracking-widest">
                                    Full Market Report <ArrowUpRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <QuizWidget />
        </div>
    );
}
