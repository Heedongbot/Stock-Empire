'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { TrendingUp, TrendingDown, ArrowRight, Lock, Activity, BarChart3, PieChart, DollarSign, Zap, RefreshCw, Target, ArrowUpRight, ArrowDownRight, ShieldCheck, Globe, Search } from 'lucide-react';
import { translations } from '@/lib/translations';
import SiteHeader from '@/components/SiteHeader';
import { useAuth } from '@/lib/AuthContext';
import AdLeaderboard from '@/components/ads/AdLeaderboard';

export default function MarketSignalsPage() {
    const { user } = useAuth();
    const lang = 'ko'; // 한국어 고정
    const t = translations[lang];

    const [signals, setSignals] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState<string | null>(null);
    const [vvipData, setVvipData] = useState<any>(null);

    const fetchSignals = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/market-signals?lang=ko&t=${Date.now()}`);
            const data = await res.json();
            if (data.signals) {
                setSignals(data.signals);
                setVvipData(data.vvip);
                setLastUpdated(new Date(data.timestamp).toLocaleTimeString('ko-KR'));
            }
        } catch (error) {
            console.error("Failed to fetch signals", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSignals();
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'SAFE': return 'text-[#00ffbd] border-[#00ffbd]/20 bg-[#00ffbd]/5';
            case 'CAUTION': return 'text-amber-500 border-amber-500/20 bg-amber-500/5';
            case 'CRITICAL': return 'text-red-500 border-red-500/20 bg-red-500/5';
            default: return 'text-slate-400 border-slate-500/20 bg-slate-500/5';
        }
    };

    return (
        <div className="min-h-screen bg-[#050b14] text-white font-sans">
            <SiteHeader />

            <main className="max-w-7xl mx-auto px-6 py-12">
                {/* 상단 전면 광고 */}
                <div className="mb-12">
                    <AdLeaderboard />
                </div>

                <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="px-4 py-1 bg-[#00ffbd]/10 text-[#00ffbd] rounded-full border border-[#00ffbd]/20 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                <Activity className="w-3 h-3 animate-pulse" />
                                LIVE PROBABILITY ENGINE
                            </div>
                            {lastUpdated && <span className="text-slate-500 text-xs font-bold font-mono">SYNC: {lastUpdated}</span>}
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter mb-4 text-white uppercase">
                            Macro <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ffbd] to-blue-500">Alpha Map</span>
                        </h2>
                        <p className="text-slate-400 font-bold max-w-2xl text-lg">
                            거시 경제 지표와 퀀트 알고리즘을 결합한 시장 확률 지도입니다.<br />
                            <span className="text-slate-600 text-sm font-black uppercase tracking-widest italic mt-2 block">Powered by Empire Intelligence v4.0</span>
                        </p>
                    </div>

                    <button
                        onClick={fetchSignals}
                        disabled={isLoading}
                        className="px-8 py-4 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2 active:scale-95"
                    >
                        <RefreshCw className={`w-4 h-4 text-[#00ffbd] ${isLoading ? 'animate-spin' : ''}`} /> 리셋 엔진
                    </button>
                </div>

                {isLoading && signals.length === 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-slate-900/50 border border-slate-800 rounded-3xl p-10 h-80 animate-pulse"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                        {signals.map((signal) => (
                            <div key={signal.id} className="bg-[#0a1120] border border-slate-800/60 rounded-[2.5rem] p-8 hover:border-[#00ffbd]/30 transition-all group shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8 opacity-5">
                                    <BarChart3 className="w-24 h-24 text-white" />
                                </div>
                                <div className="flex items-center justify-between mb-8 relative z-10">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${getStatusColor(signal.status)}`}>
                                        <Zap className="w-6 h-6" />
                                    </div>
                                    <span className={`text-[10px] font-black px-3 py-1 rounded-full border ${getStatusColor(signal.status)} uppercase tracking-widest`}>
                                        {signal.status}
                                    </span>
                                </div>

                                <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tight relative z-10">{signal.name}</h3>
                                <div className="flex items-end gap-3 mb-6 relative z-10">
                                    <span className="text-4xl font-black text-[#00ffbd] italic">{signal.value}</span>
                                    {signal.change && (
                                        <span className={`text-sm font-black mb-1 ${signal.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                            {signal.change >= 0 ? '▲' : '▼'} {Math.abs(signal.change).toFixed(2)}%
                                        </span>
                                    )}
                                </div>

                                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 mb-6 relative z-10">
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">
                                            {signal.direction === 'DOWN' ? 'CRASH RISK' : 'RALLY CHANCE'}
                                        </span>
                                        <span className={`text-xl font-black ${signal.direction === 'DOWN' ? 'text-red-500' : 'text-[#00ffbd]'}`}>
                                            {signal.probability}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full ${signal.direction === 'DOWN' ? 'bg-red-500' : 'bg-[#00ffbd]'}`}
                                            style={{ width: `${signal.probability}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <p className="text-xs text-slate-400 font-bold leading-relaxed border-l-2 border-[#00ffbd]/30 pl-4 italic relative z-10">
                                    "{signal.description}"
                                </p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Macro Detail Unlocked Section */}
                <div className="mt-20 relative rounded-[3rem] border border-slate-800 bg-[#0a1120] overflow-hidden p-8 md:p-14 shadow-2xl">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#00ffbd]/10 border border-[#00ffbd]/30 rounded-full text-[#00ffbd] text-[10px] font-black uppercase mb-6">
                                <ShieldCheck className="w-3 h-3" /> EMPIRE SECURE ACCESS UNLOCKED
                            </div>
                            <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter text-white mb-6 uppercase">
                                Liquidity Cycle <span className="text-[#00ffbd]">Deep Dive</span>
                            </h2>
                            <p className="text-slate-400 font-bold text-lg max-w-2xl leading-relaxed">
                                글로벌 중앙은행 유동성과 인플레이션 데이터를 기반으로 한 독점 리스크 매트릭스입니다. (전면 무료 개방 이벤트)
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Liquidity Cycle */}
                        <div className="bg-slate-950 border border-slate-800 p-10 rounded-[2.5rem] text-center relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#00ffbd] to-blue-500"></div>
                            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-8">유동성 순환 모델</h3>
                            <div className="flex justify-around items-center mb-8">
                                <div>
                                    <div className="text-[9px] text-slate-600 font-black mb-1 uppercase tracking-tighter">변곡점 리스크</div>
                                    <div className="text-4xl font-black text-red-500 italic">14.2%</div>
                                </div>
                                <div className="w-px h-12 bg-slate-800" />
                                <div>
                                    <div className="text-[9px] text-slate-600 font-black mb-1 uppercase tracking-tighter">상승 지지력</div>
                                    <div className="text-4xl font-black text-[#00ffbd] italic">68.5%</div>
                                </div>
                            </div>
                            <p className="text-[11px] text-slate-400 font-bold leading-relaxed italic">
                                "비트코인 반감기 이후 온체인 유동성 유입이 관찰되며, 이는 기술 섹터의 추가적인 상승 연료로 작용할 가능성이 70% 이상입니다."
                            </p>
                        </div>

                        {/* Indicators Grid */}
                        <div className="md:col-span-2 bg-slate-950 border border-slate-800 p-10 rounded-[2.5rem] relative overflow-hidden">
                            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-10">거시 리스크 체제 지표</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                {[
                                    { label: "VIX INDEX", val: "12.45", sub: "-2.1% (LOW)", color: "text-[#00ffbd]" },
                                    { label: "FED RATE", val: "PAUSE", sub: "92% PROB", color: "text-blue-500" },
                                    { label: "CPI YoY", val: "2.8%", sub: "STABLE", color: "text-[#00ffbd]" },
                                    { label: "USD INDEX", val: "102.1", sub: "NEUTRAL", color: "text-slate-500" }
                                ].map((item, i) => (
                                    <div key={i}>
                                        <div className="text-[9px] text-slate-600 font-bold mb-2 uppercase">{item.label}</div>
                                        <div className="text-2xl font-black text-white italic mb-1">{item.val}</div>
                                        <div className={`text-[10px] font-black ${item.color} uppercase tracking-tight`}>{item.sub}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
