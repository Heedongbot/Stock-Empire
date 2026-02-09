'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { LayoutDashboard, TrendingUp, Activity, PieChart, ArrowUpRight, ArrowDownRight, Award, Zap, ShieldCheck, Clock, Users, Brain, Target, Globe, ChevronRight } from 'lucide-react';
import InvestmentQuiz from '../components/InvestmentQuiz';
import SiteHeader from '@/components/SiteHeader';
import { translations } from '@/lib/translations';
import AdLeaderboard from '@/components/ads/AdLeaderboard';
import AdRectangle from '@/components/ads/AdRectangle';

export default function Dashboard() {
    const lang = 'ko'; // 한국어 전용 테스트
    const t = translations[lang];

    const [score, setScore] = useState(78); // Market Sentiment Score
    const [rank, setRank] = useState('CORPORAL'); // User Rank (Gamification)
    const [isQuizOpen, setIsQuizOpen] = useState(false); // Quiz Modal State

    return (
        <div className="min-h-screen bg-[#050b14] text-white font-sans">
            <SiteHeader />

            <main className="max-w-7xl mx-auto px-6 py-12">
                {/* 상단 대형 광고 배치 (전면 무료화 정책) */}
                <div className="mb-12">
                    <AdLeaderboard />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 mb-12 border-b border-slate-800 pb-8">
                    <div>
                        <h2 className="text-4xl font-black italic tracking-tighter text-white uppercase mb-2">
                            EMPIRE <span className="text-[#00ffbd]">DASHBOARD</span>
                        </h2>
                        <p className="text-slate-500 font-bold text-sm uppercase tracking-widest">
                            실시간 글로벌 시장 지능 및 AI 성과 트래킹
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* User Rank Badge */}
                        <div className="flex items-center gap-3 px-4 py-2 bg-slate-900 rounded-xl border border-slate-800">
                            <div className="w-8 h-8 bg-[#00ffbd] rounded-lg flex items-center justify-center text-black text-xs font-black shadow-lg shadow-[#00ffbd]/20">
                                <Award className="w-4 h-4" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Citizen Status</span>
                                <span className="text-xs font-black text-[#00ffbd] tracking-widest leading-none">EMPIRE {t.auth.member}</span>
                            </div>
                        </div>

                        {/* Investment Quiz Trigger */}
                        <button
                            onClick={() => setIsQuizOpen(true)}
                            className="flex items-center gap-2 px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl border border-slate-700 transition-all active:scale-95"
                        >
                            <Brain className="w-4 h-4" />
                            <span className="text-[10px] font-black uppercase tracking-wider">DNA 리셋</span>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    {/* 1. Market Heatmap */}
                    <div className="lg:col-span-2 bg-[#0a1120] border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                            <Activity className="w-40 h-40 text-white" />
                        </div>
                        <div className="flex items-center justify-between mb-8 relative z-10">
                            <h3 className="text-lg font-black text-white flex items-center gap-2">
                                <Activity className="w-5 h-5 text-[#00ffbd]" /> {t.dashboard.sectorHeatmap}
                            </h3>
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">AI Sentiment Analyzer</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 auto-rows-[140px] relative z-10">
                            {/* Technology */}
                            <div className="md:col-span-8 rounded-2xl p-6 flex flex-col justify-between bg-gradient-to-br from-[#00ffbd]/20 to-slate-900 border border-[#00ffbd]/30 group hover:border-[#00ffbd] transition-all cursor-pointer">
                                <span className="text-sm font-black uppercase text-white tracking-widest">TECHNOLOGY</span>
                                <div className="flex items-end justify-between">
                                    <div className="flex items-center gap-2 text-[#00ffbd] text-[10px] font-black bg-black/40 px-3 py-1 rounded-lg">
                                        <ArrowUpRight className="w-3 h-3" /> STRONG BULLISH
                                    </div>
                                    <span className="text-4xl font-black text-white tracking-tighter">+2.5%</span>
                                </div>
                            </div>

                            {/* Finance */}
                            <div className="md:col-span-4 rounded-2xl p-6 flex flex-col justify-between bg-gradient-to-br from-red-600/20 to-slate-900 border border-red-500/20 hover:border-red-500/50 transition-all cursor-pointer">
                                <span className="text-sm font-black uppercase text-white/80 tracking-widest">FINANCE</span>
                                <div className="text-right">
                                    <span className="block text-3xl font-black text-white tracking-tighter mb-1">-1.2%</span>
                                    <div className="inline-flex items-center gap-1 text-red-400 text-[10px] font-black bg-black/40 px-2 py-1 rounded-lg">
                                        <ArrowDownRight className="w-2 h-2" /> WEAK
                                    </div>
                                </div>
                            </div>

                            {/* Energy */}
                            <div className="md:col-span-5 rounded-2xl p-6 flex flex-col justify-between bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer">
                                <span className="text-sm font-black uppercase text-slate-500 tracking-widest">ENERGY</span>
                                <div className="text-right">
                                    <span className="block text-3xl font-black text-slate-300 tracking-tighter mb-1">0.0%</span>
                                    <div className="inline-flex items-center gap-1 text-slate-600 text-[10px] font-black bg-black/40 px-2 py-1 rounded-lg">
                                        NEUTRAL
                                    </div>
                                </div>
                            </div>

                            {/* Crypto */}
                            <div className="md:col-span-7 rounded-2xl p-6 flex flex-col justify-between bg-gradient-to-br from-orange-500/10 to-slate-900 border border-orange-500/20 hover:border-orange-500/50 transition-all cursor-pointer">
                                <span className="text-sm font-black uppercase text-orange-400 tracking-widest">CRYPTO</span>
                                <div className="flex items-end justify-between">
                                    <div className="inline-flex items-center gap-1 text-orange-400 text-[10px] font-black bg-black/40 px-2 py-1 rounded-lg">
                                        <Zap className="w-2 h-2" /> HIGH VOLATILITY
                                    </div>
                                    <span className="text-3xl font-black text-white tracking-tighter">+4.8%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 2. Fear & Greed Index */}
                    <aside className="space-y-6">
                        <div className="bg-[#0c121d] border border-slate-800 rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden shadow-2xl h-full">
                            <div>
                                <h3 className="text-lg font-black text-white mb-2 flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-yellow-500" /> {t.dashboard.fearGreed}
                                </h3>
                                <p className="text-slate-500 text-[10px] font-bold leading-relaxed uppercase tracking-widest">{t.dashboard.fearGreedDesc}</p>
                            </div>

                            <div className="text-center py-10">
                                <span className="text-8xl font-black text-[#00ffbd] drop-shadow-[0_0_20px_rgba(0,255,189,0.3)]">
                                    {score}
                                </span>
                                <div className="text-xl font-black uppercase tracking-[0.2em] text-[#00ffbd] mt-4">Greed Mode</div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between text-[8px] font-black text-slate-600 uppercase tracking-widest">
                                    <span>Extreme Fear</span>
                                    <span>Extreme Greed</span>
                                </div>
                                <div className="h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                                    <div
                                        className="h-full bg-gradient-to-r from-red-600 via-yellow-500 to-[#00ffbd] transition-all duration-1000 ease-out"
                                        style={{ width: `${score}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>

                {/* 3. AI Insights Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {[
                        { title: "특이 거래량 감지", value: "NVDA, PLTR", type: "bull", icon: Activity },
                        { title: "기관 수급 포착", value: "Buy MSFT", type: "bull", icon: Users },
                        { title: "추세 전환 임박", value: "AAPL (Watch)", type: "neutral", icon: TrendingUp },
                        { title: "거시 리스크 경고", value: "CPI Announcement", type: "warning", icon: ShieldCheck },
                    ].map((item, idx) => (
                        <div key={idx} className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl hover:border-[#00ffbd]/30 transition-all group">
                            <div className="flex items-center gap-3 mb-3">
                                <div className={`p-2 rounded-lg ${item.type === 'bull' ? 'bg-[#00ffbd]/10 text-[#00ffbd]' : 'bg-slate-800 text-slate-400'}`}>
                                    <item.icon className="w-4 h-4" />
                                </div>
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{item.title}</span>
                            </div>
                            <div className="text-lg font-black text-white group-hover:text-[#00ffbd] transition-colors">
                                {item.value}
                            </div>
                        </div>
                    ))}
                </div>

                {/* 하단 사각 광고 */}
                <div className="flex justify-center">
                    <div className="max-w-md w-full bg-[#0c121d] border border-slate-800 rounded-3xl p-6">
                        <span className="text-[9px] font-black text-slate-700 uppercase tracking-widest mb-4 block text-center italic">Empire Sponsor Network</span>
                        <AdRectangle />
                    </div>
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
