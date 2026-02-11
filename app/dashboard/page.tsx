'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { LayoutDashboard, TrendingUp, Activity, PieChart, ArrowUpRight, ArrowDownRight, Award, Zap, ShieldCheck, Clock, Users, Brain, Target, Globe, ChevronRight, Sparkles } from 'lucide-react';
import SiteHeader from '@/components/SiteHeader';
import { translations } from '@/lib/translations';
import AdLeaderboard from '@/components/ads/AdLeaderboard';
import AdRectangle from '@/components/ads/AdRectangle';
import ServerStatusSection from '@/components/ServerStatusSection';

import { useAuth } from '@/lib/AuthContext';

export default function Dashboard() {
    const { user } = useAuth();
    const lang = 'ko'; // 한국어 전용 테스트
    const t = translations[lang];

    const [score, setScore] = useState(78); // Market Sentiment Score
    const [rank, setRank] = useState(user?.rank || 'CORPORAL'); // User Rank (Gamification)
    const [sectorData, setSectorData] = useState<Record<string, { change: number }>>({
        'XLK': { change: 2.5 },
        'XLF': { change: -1.2 },
        'XLE': { change: 0.0 },
        'BTC-USD': { change: 4.8 }
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch Sectors (XLK: Tech, XLF: Finance, XLE: Energy, BTC-USD: Crypto)
                const tickers = ['XLK', 'XLF', 'XLE', 'BTC-USD', '^GSPC'].join(',');
                const res = await fetch(`/api/stock-price?tickers=${tickers}`);
                if (res.ok) {
                    const data = await res.json();

                    // Update Sector Data
                    const updatedSectors: Record<string, { change: number }> = {};
                    ['XLK', 'XLF', 'XLE', 'BTC-USD'].forEach(t => {
                        if (data[t]) {
                            updatedSectors[t] = { change: Number(data[t].change.toFixed(1)) };
                        } else {
                            // Keep fallback if API fails for some reason
                            updatedSectors[t] = sectorData[t];
                        }
                    });
                    setSectorData(updatedSectors);

                    // Calculate a dynamic sentiment score based on S&P 500 change
                    // Base 50 + (change * 10), capped at 0-100
                    if (data['^GSPC']) {
                        const spChange = data['^GSPC'].change;
                        const calculatedScore = Math.min(100, Math.max(0, Math.round(50 + (spChange * 15))));
                        setScore(calculatedScore);
                    }
                }
            } catch (e) {
                console.error("Dashboard real-time fetch error", e);
            }
        };

        fetchDashboardData();
        // Refresh every 5 minutes
        const interval = setInterval(fetchDashboardData, 300000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (user?.rank) {
            setRank(user.rank);
        }
    }, [user]);

    return (
        <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans">
            <SiteHeader />

            <main className="max-w-7xl mx-auto px-6 py-12">
                {/* 상단 대형 광고 배치 (부드러운 디자인) */}
                <div className="mb-12 overflow-hidden rounded-[2.5rem] bg-white border border-slate-300 shadow-xl shadow-blue-500/5">
                    <AdLeaderboard />
                </div>

                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12 pb-8 border-b border-slate-300">
                    <div>
                        <h2 className="text-4xl font-black italic tracking-tighter text-slate-900 uppercase">
                            MY <span className="text-blue-600">DASHBOARD</span>
                        </h2>
                        <p className="text-slate-500 font-bold text-sm mt-2 flex items-center gap-2">
                            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                            성공적인 투자를 위해 시장 소식을 한눈에 정리해봤어요
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* User Rank Badge - Light Theme */}
                        <div className="flex items-center gap-3 px-5 py-3 bg-white border border-slate-300 rounded-2xl shadow-sm">
                            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
                                <Award className="w-5 h-5" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">나의 등급</span>
                                <span className="text-sm font-black text-slate-800 tracking-tight">{(t.ranks as any)[rank] || t.auth.member}</span>
                            </div>
                        </div>

                        <button
                            className="flex items-center gap-3 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl shadow-lg shadow-slate-900/10 transition-all active:scale-95 text-xs font-black uppercase tracking-widest"
                        >
                            <Brain className="w-5 h-5 text-blue-400" />
                            보너스 포인트 받기
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    {/* 1. Market Heatmap - Light & Friendly */}
                    <div className="lg:col-span-2 bg-white border border-slate-300 rounded-[2.5rem] p-10 shadow-xl shadow-blue-500/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-10 opacity-5">
                            <Activity className="w-48 h-48 text-blue-600" />
                        </div>
                        <div className="flex items-center justify-between mb-8 relative z-10">
                            <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                                    <Activity className="w-5 h-5" />
                                </div>
                                <span className="tracking-tight">오늘의 핵심 업종 분위기</span>
                            </h3>
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">AI Market Insight</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[160px] relative z-10">
                            {/* Technology */}
                            <div className="md:col-span-8 rounded-[2rem] p-8 flex flex-col justify-between bg-blue-600 text-white shadow-xl shadow-blue-600/20 group hover:scale-[1.02] transition-all cursor-pointer border border-blue-500">
                                <span className="text-[11px] font-black uppercase tracking-widest text-blue-100">💻 기술주 (Technology)</span>
                                <div className="flex items-end justify-between">
                                    <div className="flex items-center gap-2 text-white text-[11px] font-black bg-white/20 px-4 py-2 rounded-xl backdrop-blur-sm">
                                        <ArrowUpRight className="w-4 h-4" /> {sectorData['XLK'].change >= 0 ? '매우 좋음 (Bullish)' : '조정 중 (Correction)'}
                                    </div>
                                    <span className="text-5xl font-black tracking-tighter italic">{sectorData['XLK'].change > 0 ? '+' : ''}{sectorData['XLK'].change}%</span>
                                </div>
                            </div>

                            {/* Finance */}
                            <div className="md:col-span-4 rounded-[2rem] p-8 flex flex-col justify-between bg-slate-50 border border-slate-300 hover:border-red-300 hover:bg-red-50 transition-all cursor-pointer group">
                                <span className="text-[10px] font-black uppercase text-slate-400 group-hover:text-red-400 tracking-widest">💰 금융주 (Finance)</span>
                                <div className="text-right">
                                    <span className="block text-4xl font-black text-slate-800 tracking-tighter mb-2">{sectorData['XLF'].change > 0 ? '+' : ''}{sectorData['XLF'].change}%</span>
                                    <div className="inline-flex items-center gap-1 text-slate-400 text-[10px] font-black">
                                        {sectorData['XLF'].change >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                        {sectorData['XLF'].change >= 0 ? '상승 중' : '조금 하락'}
                                    </div>
                                </div>
                            </div>

                            {/* Energy */}
                            <div className="md:col-span-5 rounded-[2rem] p-8 flex flex-col justify-between bg-slate-50 border border-slate-300 hover:bg-orange-50 hover:border-orange-300 transition-all cursor-pointer group">
                                <span className="text-[10px] font-black uppercase text-slate-400 group-hover:text-orange-400 tracking-widest">⚡ 에너지 (Energy)</span>
                                <div className="text-right">
                                    <span className="block text-4xl font-black text-slate-800 tracking-tighter mb-2 italic">{sectorData['XLE'].change > 0 ? '+' : ''}{sectorData['XLE'].change}%</span>
                                    <div className="inline-flex items-center gap-1 text-slate-400 text-[10px] font-black uppercase">
                                        {sectorData['XLE'].change === 0 ? 'Neutral (보합)' : sectorData['XLE'].change > 0 ? 'Strong (강세)' : 'Weak (약세)'}
                                    </div>
                                </div>
                            </div>

                            {/* Crypto */}
                            <div className="md:col-span-7 rounded-[2rem] p-8 flex flex-col justify-between bg-indigo-50 border border-indigo-200 hover:border-indigo-400 transition-all cursor-pointer group">
                                <span className="text-[10px] font-black uppercase text-indigo-400 tracking-widest">🪙 코인 (Crypto)</span>
                                <div className="flex items-end justify-between">
                                    <div className="inline-flex items-center gap-2 text-indigo-600 text-[10px] font-black bg-white px-3 py-1.5 rounded-xl border border-indigo-200">
                                        <Zap className="w-4 h-4" /> 실시간 변동성
                                    </div>
                                    <span className="text-4xl font-black text-indigo-700 tracking-tighter italic">{sectorData['BTC-USD'].change > 0 ? '+' : ''}{sectorData['BTC-USD'].change}%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 2. Today's Sentiment Score */}
                    <aside className="space-y-8">
                        <div className="bg-white border border-slate-300 rounded-[2.5rem] p-10 flex flex-col justify-between relative overflow-hidden shadow-xl shadow-blue-500/5 h-full">
                            <div className="relative z-10">
                                <h3 className="text-lg font-black text-slate-900 mb-2 flex items-center gap-3">
                                    <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-500">
                                        <TrendingUp className="w-6 h-6" />
                                    </div>
                                    <span className="tracking-tight italic uppercase">오늘의 시장 분위기</span>
                                </h3>
                                <p className="text-slate-400 text-[11px] font-bold leading-relaxed max-w-[200px] mt-3">지금 이 시각 투자자들은 어떤 기분일까요?</p>
                            </div>

                            <div className="text-center py-12 relative z-10">
                                <span className="text-[7rem] font-black text-blue-600 tracking-tighter leading-none">
                                    {score}
                                </span>
                                <div className="text-lg font-black uppercase tracking-[0.2em] text-blue-500 mt-4 flex items-center justify-center gap-2 italic">
                                    {score > 75 ? '극심한 탐욕' : score > 55 ? '탐욕 모드' : score > 45 ? '중립 상태' : score > 25 ? '공포 모드' : '극심한 공포'} <Sparkles className="w-5 h-5" />
                                </div>
                            </div>

                            <div className="space-y-4 relative z-10">
                                <div className="flex justify-between text-[10px] font-black text-slate-300 uppercase tracking-widest">
                                    <span className="text-red-400">조심 (Fear)</span>
                                    <span className="text-blue-500">기대 (Greed)</span>
                                </div>
                                <div className="h-4 bg-slate-50 rounded-full overflow-hidden border border-slate-200 p-1 shadow-inner">
                                    <div
                                        className="h-full bg-gradient-to-r from-red-400 via-yellow-400 to-blue-500 rounded-full transition-all duration-1000 ease-out shadow-lg"
                                        style={{ width: `${score}%` }}
                                    ></div>
                                </div>
                            </div>

                            {/* Decorative Background Icon */}
                            <div className="absolute -bottom-10 -right-10 opacity-5 scale-150 rotate-12">
                                <TrendingUp className="w-48 h-48 text-slate-900" />
                            </div>
                        </div>
                    </aside>
                </div>

                {/* 3. AI Insights Grid - Friendly Mini Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {[
                        { title: "거액의 거래 감지 🐋", value: "엔비디아, 팔란티어", type: "bull", icon: Activity },
                        { title: "큰손들이 사고 있어요 🏦", value: "마소 집중 매수 중", type: "bull", icon: Users },
                        { title: "흐름이 바뀔 수 있어요 🔄", value: "애플 (주의 깊게 관찰)", type: "neutral", icon: TrendingUp },
                        { title: "긴급 뉴스 경보 🚨", value: "물가 지수 발표 예정", type: "warning", icon: ShieldCheck },
                    ].map((item, idx) => (
                        <div key={idx} className="bg-white border border-slate-300 p-8 rounded-[2rem] hover:border-blue-400 hover:shadow-2xl hover:-translate-y-1 transition-all group cursor-pointer shadow-sm">
                            <div className="flex items-center gap-4 mb-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.type === 'bull' ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-400'}`}>
                                    <item.icon className="w-5 h-5" />
                                </div>
                                <span className="text-[12px] font-black text-slate-400 uppercase tracking-tight">{item.title}</span>
                            </div>
                            <div className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors tracking-tight">
                                {item.value}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mb-12">
                    <ServerStatusSection />
                </div>

                {/* 하단 스폰서 영역 - 부드러운 화이트 레이아웃 */}
                <div className="flex justify-center mt-20">
                    <div className="max-w-2xl w-full bg-white border border-slate-300 rounded-[3rem] p-10 shadow-2xl shadow-blue-500/5 transition-all hover:scale-[1.01]">
                        <div className="flex justify-center mb-8">
                            <div className="px-5 py-2 bg-slate-50 rounded-full border border-slate-200">
                                <span className="text-[10px] font-black text-slate-300 tracking-widest uppercase italic">Empire Special Sponsor Network</span>
                            </div>
                        </div>
                        <AdRectangle />
                    </div>
                </div>

            </main >
        </div >
    );
}
