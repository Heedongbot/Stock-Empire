'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
    LayoutGrid, List, Search, TrendingUp, TrendingDown,
    ArrowRight, Activity, Zap, ShieldCheck, Globe, Cpu, Car,
    Wallet, Rocket, RefreshCw, Lock, BrainCircuit, Sparkles, Database
} from 'lucide-react';
import SiteHeader from '@/components/SiteHeader';
import { THEMES } from '@/lib/themes';
import { useAuth } from '@/lib/AuthContext';
import { AIPerformanceBanner } from '@/components/AIPerformanceBanner';
import AdLeaderboard from '@/components/ads/AdLeaderboard';

function ThemeContent() {
    const searchParams = useSearchParams();
    const [selectedTheme, setSelectedTheme] = useState(THEMES[0]);
    const [signals, setSignals] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const { user } = useAuth();
    const isAdmin = user?.role === 'ADMIN';

    useEffect(() => {
        const themeId = searchParams.get('id');
        if (themeId) {
            const theme = THEMES.find(t => t.id === themeId);
            if (theme) setSelectedTheme(theme);
        }
    }, [searchParams]);

    useEffect(() => {
        fetchThemeData(selectedTheme.id);
    }, [selectedTheme]);

    const fetchThemeData = async (id: string) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/theme-signals?id=${id}&lang=ko&t=${Date.now()}`);
            const data = await res.json();
            if (data.signals) {
                setSignals(data.signals);
            }
        } catch (e) {
            console.error("Theme fetch error", e);
        } finally {
            setLoading(false);
        }
    };

    const getIcon = (id: string) => {
        switch (id) {
            case 'ai-revolution': return Cpu;
            case 'ev-energy': return Car;
            case 'semiconductors': return Activity;
            case 'fintech-crypto': return Wallet;
            case 'big-tech': return Rocket;
            default: return Globe;
        }
    };

    const filteredSignals = signals.filter(s =>
        s.ticker.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans">
            <SiteHeader />

            <main className="max-w-7xl mx-auto px-6 py-12">
                {/* 상단 전면 광고 배너 */}
                <div className="mb-12">
                    <AdLeaderboard />
                </div>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-8">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <LayoutGrid className="w-5 h-5 text-blue-600" />
                            <span className="text-xs font-black text-blue-600 uppercase tracking-[0.3em]">테마 인텔리전스</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter text-slate-900 uppercase leading-none">
                            Sector <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Scanner</span>
                        </h1>
                        <p className="text-slate-500 text-sm mt-4 font-bold uppercase tracking-widest italic">섹터별 흐름과 기관 수급 분석 결과 공유 (Public Access)</p>
                    </div>

                    <div className="relative w-full md:w-80">
                        {!user && (
                            <div className="absolute inset-0 z-20 backdrop-blur-sm bg-white/70 rounded-2xl flex items-center justify-center">
                                <Lock className="w-5 h-5 text-blue-600" />
                            </div>
                        )}
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="티커/종목명 검색..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            disabled={!user}
                            className="w-full bg-white border border-slate-300 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all shadow-sm disabled:opacity-50"
                        />
                    </div>
                </div>



                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-16">
                    {THEMES.map((theme) => {
                        const Icon = getIcon(theme.id);
                        const isActive = selectedTheme.id === theme.id;
                        return (
                            <button
                                key={theme.id}
                                onClick={() => setSelectedTheme(theme)}
                                className={`flex flex-col items-center justify-center p-8 rounded-[2.5rem] border transition-all duration-300 ${isActive
                                    ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-600/20 scale-105'
                                    : 'bg-white border-slate-300 text-slate-500 hover:border-slate-400 hover:bg-slate-50'
                                    }`}
                            >
                                <Icon className={`w-8 h-8 mb-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                                <span className="text-[10px] font-black uppercase tracking-widest text-center leading-tight">
                                    {theme.name_ko}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-40 bg-slate-50 rounded-[3rem] border border-slate-300 border-dashed">
                        <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mb-6" />
                        <p className="text-xs font-black uppercase tracking-[0.5em] text-slate-400">데이터 스캐닝 중...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredSignals.map((sig, idx) => (
                            <div key={idx} className="group bg-white border border-slate-300 rounded-[3rem] p-8 hover:border-blue-400 hover:shadow-xl hover:shadow-blue-500/10 transition-all relative overflow-hidden flex flex-col h-full shadow-sm hover:-translate-y-1">
                                {!user && (
                                    <div className="absolute inset-0 z-30 backdrop-blur-md bg-white/60 flex flex-col items-center justify-center p-6 text-center rounded-[3rem]">
                                        <Lock className="w-10 h-10 text-blue-600 mb-3" />
                                        <h4 className="text-sm font-black text-slate-900 mb-2">로그인 필요</h4>
                                        <p className="text-xs text-slate-600 mb-4">회원 전용 테마 분석</p>
                                        <a href="/sign-in" className="px-6 py-2 bg-blue-600 text-white text-xs font-black rounded-xl hover:bg-blue-700 transition-all">
                                            무료 시작
                                        </a>
                                    </div>
                                )}
                                <div className="absolute top-0 right-0 p-8 opacity-5">
                                    <Database className="w-24 h-24 text-slate-900" />
                                </div>

                                <div className="flex justify-between items-start mb-8 relative z-10">
                                    <div className="px-3 py-1 bg-slate-100 border border-slate-200 rounded-lg text-xs font-black text-slate-700 w-fit">{sig.ticker}</div>
                                    <div className={`text-xl font-black flex items-center gap-2 ${sig.change_pct >= 0 ? 'text-red-500' : 'text-blue-600'}`}>
                                        {sig.change_pct > 0 ? '▲' : '▼'} {Math.abs(sig.change_pct)}%
                                    </div>
                                </div>

                                <h3 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight truncate relative z-10">{sig.name}</h3>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-8 relative z-10 italic">Institutional Pulse Sync</p>

                                <div className="grid grid-cols-1 gap-4 mb-8 flex-1 relative z-10">
                                    <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl flex justify-between items-center">
                                        <div className="text-[9px] text-slate-500 font-black uppercase">Current Price</div>
                                        <div className="text-2xl font-black text-slate-900 font-mono italic">${sig.price}</div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl">
                                            <div className="text-[9px] text-slate-500 font-bold uppercase mb-1">Impact</div>
                                            <div className="text-xl font-black text-blue-600 font-mono">{sig.impact_score}%</div>
                                        </div>
                                        <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl">
                                            <div className="text-[9px] text-slate-500 font-bold uppercase mb-1">Signals</div>
                                            <div className="text-xl font-black text-slate-900 font-mono italic">LIVE</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-slate-200 mt-auto relative z-10">
                                    <div className="flex items-center gap-2 mb-4">
                                        <BrainCircuit className="w-4 h-4 text-blue-600" />
                                        <span className="text-[11px] font-black text-blue-600 uppercase tracking-widest">Empire AI Report</span>
                                    </div>
                                    <p className="text-[13px] leading-relaxed text-slate-600 italic font-medium">
                                        "{sig.ai_reason}"
                                    </p>
                                </div>

                                {/* 보스가 아닌 경우 타겟가는 숨김 (리스크 방칭) */}
                                {!isAdmin && (
                                    <div className="mt-6 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                                            리스크 방지를 위해 진입/청산 전략은 제한됩니다.
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

export default function ThemePage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#f8fafc] flex items-center justify-center text-slate-900 font-black uppercase">Loading...</div>}>
            <ThemeContent />
        </Suspense>
    );
}
