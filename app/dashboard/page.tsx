'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { LayoutDashboard, TrendingUp, Activity, PieChart, ArrowUpRight, ArrowDownRight, Award, Zap, ShieldCheck, Clock, Users, Brain, Target, Globe } from 'lucide-react';
import InvestmentQuiz from '../components/InvestmentQuiz';
import SiteHeader from '@/components/SiteHeader';
import { translations } from '@/lib/translations';

export default function Dashboard() {
    const [lang, setLang] = useState<'ko' | 'en'>('ko');
    const t = translations[lang];

    // Auto-detect Language
    useEffect(() => {
        const userLang = navigator.language || navigator.languages[0];
        if (userLang.startsWith('ko')) {
            setLang('ko');
        } else {
            setLang('en');
        }
    }, []);

    const [score, setScore] = useState(78); // Market Sentiment Score
    const [rank, setRank] = useState('CORPORAL'); // User Rank (Gamification)
    const [isQuizOpen, setIsQuizOpen] = useState(false); // Quiz Modal State

    return (
        <div className="min-h-screen bg-[#0a0f1a] text-white">
            <SiteHeader lang={lang} setLang={setLang} />

            <main className="max-w-7xl mx-auto px-6 py-12">
                {/* Gamification & Action Bar (Moved from Header) */}
                <div className="flex flex-wrap items-center justify-end gap-4 mb-8">
                    {/* User Rank Badge */}
                    <div className="flex items-center gap-3 px-4 py-2 bg-slate-800/50 rounded-full border border-slate-700 backdrop-blur-sm">
                        <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-slate-900 text-xs font-black shadow-lg shadow-amber-500/20 animate-pulse-slow">
                            <Award className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Current Rank</span>
                            <span className="text-sm font-black text-amber-500 tracking-widest leading-none">{(t.ranks as any)[rank] || rank}</span>
                        </div>
                    </div>

                    {/* Investment Quiz Trigger */}
                    <button
                        onClick={() => setIsQuizOpen(true)}
                        className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white rounded-full shadow-lg shadow-indigo-500/20 transition-all transform hover:scale-105 active:scale-95"
                    >
                        <Brain className="w-4 h-4" />
                        <span className="text-xs font-black uppercase tracking-wider">{lang === 'ko' ? '투자 성향 테스트 재도전' : 'Retake DNA Test'}</span>
                    </button>
                </div>

                <div className="mb-12">
                    <h2 className="text-4xl font-black italic tracking-tighter mb-4 text-white">
                        {t.dashboard.marketOverview}
                    </h2>
                    <p className="text-slate-400 font-bold text-lg">
                        {t.dashboard.marketOverviewDesc}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    {/* 1. Market Heatmap */}
                    <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-lg font-black text-white flex items-center gap-2">
                                <Activity className="w-5 h-5 text-indigo-500" /> {t.dashboard.sectorHeatmap}
                            </h3>
                            <span className="text-xs font-bold text-slate-500 uppercase">{t.dashboard.newsSentiment}</span>
                        </div>
                        {/* Changed Grid Row Height to 150px for better spacing */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[150px]">
                            {/* 1. Technology (Dominant) */}
                            <div className="md:col-span-8 rounded-3xl p-8 flex flex-col justify-between cursor-pointer bg-gradient-to-br from-green-600 to-green-800 border border-green-500/30 transition-transform hover:scale-[1.01] shadow-lg shadow-green-900/20 relative overflow-hidden group">
                                <span className="relative z-10 text-lg font-black uppercase text-white tracking-widest">{t.dashboard.sectors.technology}</span>
                                <div className="relative z-10 flex items-end justify-between">
                                    <div className="flex items-center gap-2 text-green-200 text-sm font-bold bg-black/20 px-3 py-1 rounded-full backdrop-blur-sm">
                                        <ArrowUpRight className="w-4 h-4" /> Strong Buy
                                    </div>
                                    <span className="text-5xl font-black text-white tracking-tighter drop-shadow-lg">+2.5%</span>
                                </div>
                                <Activity className="absolute bottom-4 left-4 w-32 h-32 text-black/10 group-hover:scale-110 transition-transform duration-500" />
                            </div>

                            {/* 2. Finance (Weak) */}
                            <div className="md:col-span-4 rounded-3xl p-6 flex flex-col justify-between cursor-pointer bg-gradient-to-br from-red-600 to-red-800 border border-red-500/30 transition-transform hover:scale-[1.01] shadow-lg shadow-red-900/20 group">
                                <span className="text-md font-black uppercase text-white/80 tracking-widest">{t.dashboard.sectors.finance}</span>
                                <div className="text-right">
                                    <span className="block text-4xl font-black text-white tracking-tighter mb-1">-1.2%</span>
                                    <div className="inline-flex items-center gap-1 text-red-100 text-xs font-bold bg-black/20 px-2 py-1 rounded-full">
                                        <ArrowDownRight className="w-3 h-3" /> Sell
                                    </div>
                                </div>
                            </div>

                            {/* 3. Energy (Neutral) */}
                            <div className="md:col-span-4 rounded-3xl p-6 flex flex-col justify-between cursor-pointer bg-slate-800 border border-slate-700 transition-transform hover:scale-[1.01] group hover:border-slate-500">
                                <span className="text-md font-black uppercase text-slate-400 tracking-widest">{t.dashboard.sectors.energy}</span>
                                <div className="text-right">
                                    <span className="block text-4xl font-black text-slate-300 tracking-tighter mb-1">0.0%</span>
                                    <div className="inline-flex items-center gap-1 text-slate-500 text-xs font-bold bg-black/20 px-2 py-1 rounded-full">
                                        Neutral
                                    </div>
                                </div>
                            </div>

                            {/* 4. Healthcare (Small Bull) */}
                            <div className="md:col-span-8 rounded-3xl p-6 flex flex-col justify-between cursor-pointer bg-gradient-to-br from-green-700/50 to-slate-800 border border-green-500/20 transition-transform hover:scale-[1.01] hover:border-green-500/50 group">
                                <span className="text-md font-black uppercase text-green-400 tracking-widest">{t.dashboard.sectors.healthcare}</span>
                                <div className="flex items-end justify-between">
                                    <div className="inline-flex items-center gap-1 text-green-400 text-xs font-bold bg-black/20 px-2 py-1 rounded-full">
                                        <ArrowUpRight className="w-3 h-3" /> Accumulate
                                    </div>
                                    <span className="text-4xl font-black text-white tracking-tighter">+0.8%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 2. Fear & Greed Index (Live) */}
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden shadow-2xl h-full">
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                            <Zap className="w-48 h-48 text-white" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-white mb-2 flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-amber-500" /> {t.dashboard.fearGreed}
                            </h3>
                            <p className="text-slate-500 text-xs font-bold leading-relaxed">{t.dashboard.fearGreedDesc}</p>
                        </div>

                        <div className="text-center py-12 relative z-10">
                            <span className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-green-400 to-emerald-600 drop-shadow-2xl">
                                {score}
                            </span>
                            <div className="text-xl font-black uppercase tracking-widest text-green-500 mt-4">Greed</div>
                        </div>

                        <div className="space-y-3 relative z-10 mt-auto">
                            <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                                <span>Extreme Fear</span>
                                <span>Extreme Greed</span>
                            </div>
                            <div className="h-4 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                                <div
                                    className="h-full bg-gradient-to-r from-red-600 via-yellow-500 to-green-600 transition-all duration-1000 ease-out relative"
                                    style={{ width: `${score}%` }}
                                >
                                    <div className="absolute right-0 top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_white]"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. AI Insights Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { title: t.dashboard.aiSignals?.unusualVolume || "Unusual Volume", value: "TSLA, AMD", type: "bull", icon: Activity },
                        { title: t.dashboard.aiSignals?.institutions || "Institutions", value: "Buying NVDA", type: "bull", icon: Users },
                        { title: t.dashboard.aiSignals?.trendReversal || "Reversal", value: "PLTR (Bearish)", type: "bear", icon: TrendingUp },
                        { title: t.dashboard.aiSignals?.riskAlert || "Risk", value: "CPI Data (High)", type: "warning", icon: ShieldCheck },
                    ].map((item, idx) => (
                        <div key={idx} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-indigo-500/50 transition-colors group">
                            <div className="flex items-center gap-3 mb-3">
                                <div className={`p-2 rounded-lg ${item.type === 'bull' ? 'bg-green-500/10 text-green-500' :
                                    item.type === 'bear' ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-500'
                                    }`}>
                                    <item.icon className="w-4 h-4" />
                                </div>
                                <span className="text-xs font-black text-slate-500 uppercase tracking-wider">{item.title}</span>
                            </div>
                            <div className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                                {item.value}
                            </div>
                        </div>
                    ))}
                </div>

            </main>

            {/* Quiz Modal */}
            <InvestmentQuiz
                isOpen={isQuizOpen}
                onClose={() => setIsQuizOpen(false)}
                lang={lang}
            />
        </div>
    );
}
