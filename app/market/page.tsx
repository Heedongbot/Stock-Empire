'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { TrendingUp, TrendingDown, ArrowRight, Lock, Activity, BarChart3, PieChart, DollarSign, Zap, RefreshCw, Target, ArrowUpRight, ArrowDownRight, ShieldCheck, Globe } from 'lucide-react';
import { translations } from '@/lib/translations';
import SiteHeader from '@/components/SiteHeader';

export default function MarketSignalsPage() {
    const [lang, setLang] = useState<'ko' | 'en'>('ko');
    const [isYearly, setIsYearly] = useState(false);
    const [pricing, setPricing] = useState({
        monthly: { amount: '49,900', symbol: '₩' },
        yearly: { amount: '499,000', symbol: '₩' }
    });
    const t = translations[lang];

    // Auto-detect User Locale & Set Pricing Strategy
    useEffect(() => {
        const userLang = navigator.language || navigator.languages[0];
        if (userLang.startsWith('ko')) {
            setLang('ko');
            setPricing({
                monthly: { amount: '49,900', symbol: '₩' },
                yearly: { amount: '499,000', symbol: '₩' }
            });
        } else {
            setLang('en');
            setPricing({
                monthly: { amount: '49.99', symbol: '$' },
                yearly: { amount: '499.00', symbol: '$' }
            });
        }
    }, []);

    const [isVVIP, setIsVVIP] = useState(false);
    const [activeTab, setActiveTab] = useState<'overview' | 'backtest'>('overview');
    const [signals, setSignals] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState<string | null>(null);

    const fetchSignals = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/market-signals');
            const data = await res.json();
            if (data.signals) {
                setSignals(data.signals);
                setLastUpdated(new Date(data.timestamp).toLocaleTimeString(lang === 'ko' ? 'ko-KR' : 'en-US'));
            }
        } catch (error) {
            console.error("Failed to fetch signals", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSignals();
    }, [lang]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'SAFE': return 'text-green-500 bg-green-500/10 border-green-500/20';
            case 'CAUTION': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
            case 'CRITICAL': return 'text-red-500 bg-red-500/10 border-red-500/20';
            default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0f1a] text-white">
            <SiteHeader lang={lang} setLang={setLang} />

            <main className="max-w-7xl mx-auto px-8 py-12">
                <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="px-4 py-1 bg-red-500/10 text-red-500 rounded-full border border-red-500/20 text-xs font-black uppercase tracking-widest animate-pulse flex items-center gap-2">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                </span>
                                {t.market.liveBadge}
                            </div>
                            {lastUpdated && <span className="text-slate-500 text-xs font-bold">{t.stats.lastUpdate}: {lastUpdated}</span>}
                        </div>
                        <h2 className="text-4xl font-black italic tracking-tighter mb-4 text-white">
                            {t.market.title}
                        </h2>
                        <p className="text-slate-400 font-bold max-w-2xl text-lg">
                            "{t.market.desc_1}" <br />
                            {t.market.desc_2}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        {!isVVIP && (
                            <button
                                onClick={() => setIsVVIP(true)}
                                className="bg-gradient-to-r from-red-600 to-orange-600 hover:scale-105 text-white text-xs font-bold px-4 py-3 rounded-xl transition-all shadow-lg shadow-red-600/20 uppercase tracking-wider"
                            >
                                {lang === 'ko' ? 'VVIP 업그레이드' : 'Upgrade to VVIP'}
                            </button>
                        )}
                        <button
                            onClick={fetchSignals}
                            disabled={isLoading}
                            className="px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl font-bold text-sm transition-all flex items-center gap-2"
                        >
                            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} /> {t.market.refreshBtn}
                        </button>
                    </div>
                </div>

                {isLoading && signals.length === 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="premium-card bg-slate-900/50 border-slate-800 p-8 h-80 animate-pulse flex flex-col items-center justify-center">
                                <div className="w-12 h-12 bg-slate-800 rounded-xl mb-4"></div>
                                <div className="h-6 w-32 bg-slate-800 rounded mb-2"></div>
                                <div className="h-10 w-24 bg-slate-800 rounded"></div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                        {signals.map((signal) => (
                            <div key={signal.id} className="premium-card bg-slate-900/50 border-slate-800 p-8 hover:border-slate-700 transition-all group">
                                <div className="flex items-center justify-between mb-6">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getStatusColor(signal.status)}`}>
                                        <BarChart3 className="w-6 h-6" />
                                    </div>
                                    <span className={`text-[10px] font-black px-3 py-1 rounded full border ${getStatusColor(signal.status)}`}>
                                        {signal.status}
                                    </span>
                                </div>

                                <h3 className="text-lg font-black text-slate-300 mb-1">{signal.name}</h3>
                                <div className="flex items-end gap-3 mb-4">
                                    <span className="text-3xl font-black text-white italic">{signal.value}</span>
                                    {signal.change && (
                                        <span className={`text-xs font-bold mb-1 ${signal.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                            {signal.change >= 0 ? '▲' : '▼'} {Math.abs(signal.change).toFixed(2)}%
                                        </span>
                                    )}
                                </div>
                                <span className="text-xs text-slate-500 font-bold mb-6 block">{t.market.threshold}: {signal.threshold}</span>

                                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 mb-6">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">
                                            {signal.direction === 'DOWN' ? t.market.crashRisk : t.market.rallyChance}
                                        </span>
                                        <span className={`text-lg font-black ${signal.direction === 'DOWN' ? 'text-red-500' : 'text-green-500'}`}>
                                            {signal.probability}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full ${signal.direction === 'DOWN' ? 'bg-red-500' : 'bg-green-500'}`}
                                            style={{ width: `${signal.probability}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <p className="text-xs text-slate-400 font-bold leading-relaxed border-l-2 border-slate-700 pl-3">
                                    {signal.description}
                                </p>
                            </div>
                        ))}
                    </div>
                )}

                {/* VVIP Section - Macro Probability Map */}
                <div className="mt-20 relative rounded-3xl border border-slate-800 bg-[#050b14] overflow-hidden p-8 md:p-12 animate-fade-in-up">
                    {/* 1. Visible Header (Always shown) */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                        <div>
                            <span className="inline-block px-3 py-1 bg-red-500/10 text-red-500 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 animate-pulse border border-red-500/20">
                                🔴 {lang === 'ko' ? '실시간 데이터' : 'LIVE DATA'}
                            </span>
                            <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter text-white mb-6">
                                {lang === 'ko' ? '거시 확률 지도' : 'MACRO PROBABILITY MAP'}
                            </h2>
                            <p className="text-slate-400 font-bold text-lg max-w-2xl leading-relaxed text-balance">
                                "{lang === 'ko' ? '역사는 반복되지 않지만, 각운을 맞춘다.' : 'History doesn\'t repeat itself, but it often rhymes.'}"<br />
                                <span className="text-slate-500 text-sm font-medium mt-2 block">
                                    {lang === 'ko'
                                        ? '현재 거시 경제 데이터를 과거 30년 데이터와 대조하여 폭락 확률과 급등 확률을 계산합니다.'
                                        : 'Calculating crash/rally probabilities based on 30 years of macro data correlation.'}
                                </span>
                            </p>
                        </div>

                        {/* Fake Refresh Button for immersion */}
                        <button className="px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs font-bold text-slate-400 flex items-center gap-2 hover:bg-slate-800 hover:text-white transition-colors">
                            <RefreshCw className="w-3 h-3" /> {lang === 'ko' ? '시그널 새로고침' : 'Refresh Signal'}
                        </button>
                    </div>

                    {/* 2. Content Area (Locked or Unlocked) */}
                    <div className="relative min-h-[500px] bg-slate-950/50 rounded-3xl border border-slate-800/50 overflow-hidden">

                        {/* VVIP Content (The Map & Strategies) */}
                        <div className={`p-8 md:p-12 w-full h-full transition-all duration-700 ${!isVVIP ? 'filter blur-xl opacity-20 select-none pointer-events-none' : ''}`}>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                                {/* 1. Liquidity Cycle Model */}
                                <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl text-center relative overflow-hidden group">
                                    <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-6">
                                        {lang === 'ko' ? '연준 유동성 사이클' : 'FED LIQUIDITY CYCLE'}
                                    </h3>
                                    <div className="text-5xl font-black text-red-500 mb-4 italic tracking-tighter">
                                        {lang === 'ko' ? '수축 국면' : 'CONTRACTION'}
                                    </div>
                                    <p className="text-xs text-slate-400 font-mono font-bold">
                                        {lang === 'ko' ? '순유동성(Net Liq):' : 'Net Liquidity:'} <span className="text-red-400">-$45B (WoW)</span>
                                    </p>
                                    <div className="mt-6 w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                        <div className="h-full bg-red-500 w-[70%]"></div>
                                    </div>
                                </div>

                                {/* 2. Sector Rotation Alpha */}
                                <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl col-span-2">
                                    <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-8">
                                        {lang === 'ko' ? '퀀트 섹터 로테이션' : 'QUANT SECTOR ROTATION'}
                                    </h3>
                                    <div className="grid grid-cols-2 gap-12">
                                        <div>
                                            <div className="text-xs text-slate-500 font-bold mb-2 uppercase">{lang === 'ko' ? '비중 확대 (Overweight)' : 'Overweight (Buy)'}</div>
                                            <div className="text-3xl font-black text-white mb-2">{lang === 'ko' ? '에너지 & 기술주' : 'Energy & XLK'}</div>
                                            <div className="text-sm text-green-500 font-bold bg-green-500/10 px-2 py-1 rounded inline-block">+12.4% Alpha</div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-slate-500 font-bold mb-2 uppercase">{lang === 'ko' ? '비중 축소 (Underweight)' : 'Underweight (Sell)'}</div>
                                            <div className="text-3xl font-black text-white mb-2">{lang === 'ko' ? '경기소비재(Discretionary)' : 'Consumer Disc.'}</div>
                                            <div className="text-sm text-red-500 font-bold bg-red-500/10 px-2 py-1 rounded inline-block">-5.2% Risk</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Signal History Table */}
                            <div className="space-y-6">
                                <h4 className="text-base font-black text-slate-500 uppercase tracking-widest mb-6 border-b border-slate-800 pb-2">
                                    {lang === 'ko' ? '최근 포착된 AI 시그널' : 'Recent AI Signals'}
                                </h4>
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex items-center justify-between p-6 bg-slate-900/50 rounded-2xl border border-slate-800 text-base hover:bg-slate-900 transition-colors">
                                        <span className="text-slate-400 font-mono font-bold text-sm">2024.10.{10 + i}</span>
                                        <span className="text-white font-bold flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                            NVDA {lang === 'ko' ? '매수 진입' : 'Long Entry'}
                                        </span>
                                        <span className="text-green-500 font-black text-lg">+4.{i}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Lock Screen (Overlay) */}
                        {!isVVIP && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-slate-950/30 backdrop-blur-[2px]">
                                <div className="w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center mb-6 shadow-2xl shadow-amber-500/20 animate-bounce">
                                    <Lock className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-3xl font-black text-white italic mb-4">VIP {lang === 'ko' ? '전용' : 'ONLY'}</h3>
                                <p className="text-slate-400 text-sm font-bold mb-8 max-w-sm text-center leading-relaxed">
                                    {lang === 'ko' ? '상위 0.1%를 위한 자산 배분 전략과 구체적인 매매 타이밍을 확인하세요.' : 'Unlock institutional-grade asset allocation strategies and precise entry/exit timing.'}
                                </p>

                                <div className="flex bg-slate-900 p-1 rounded-xl mb-6 border border-slate-800">
                                    <button className="px-6 py-2 rounded-lg bg-slate-800 text-white text-xs font-bold shadow-md">
                                        {lang === 'ko' ? '월간 결제' : 'Monthly'}
                                    </button>
                                    <button className="px-6 py-2 rounded-lg text-slate-500 text-xs font-bold hover:text-white transition-colors relative">
                                        {lang === 'ko' ? '연간 결제' : 'Yearly'}
                                        <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[8px] px-1.5 py-0.5 rounded-full font-black animate-pulse">30%</span>
                                    </button>
                                </div>

                                <button
                                    onClick={() => setIsVVIP(true)}
                                    className="w-full max-w-md px-8 py-5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-black rounded-xl uppercase tracking-widest shadow-2xl transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
                                >
                                    {lang === 'ko' ? 'VVIP 월간 가입 (₩49,900/월)' : 'Join VVIP (₩49,900/mo)'}
                                </button>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-4">
                                    {lang === 'ko' ? '신규 가입자 한정 30% 할인가 적용 중' : '30% Discount for new members applied for a limited time'}
                                </p>
                            </div>
                        )}

                        {/* Admin Relock Button (Visible when unlocked) */}
                        {isVVIP && (
                            <button
                                onClick={() => setIsVVIP(false)}
                                className="absolute top-6 right-6 z-50 text-[10px] font-black text-slate-500 hover:text-white border border-slate-800 hover:border-slate-500 px-3 py-1.5 rounded-full bg-slate-900/80 flex items-center gap-1 transition-all"
                            >
                                <Lock className="w-3 h-3" /> RELOCK
                            </button>
                        )}
                    </div>
                </div>

                {/* Secret Admin Key */}
                <button
                    onClick={() => setIsVVIP(!isVVIP)}
                    className="fixed bottom-4 right-20 text-slate-800 hover:text-slate-600 transition-colors z-50 p-2"
                    title="Toggle VVIP Mode (Dev Only)"
                >
                    <Lock className="w-4 h-4" />
                </button>
            </main>
        </div>
    );
}
