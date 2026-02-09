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
        <div className="min-h-screen bg-[#050b14] text-white font-sans">
            <SiteHeader />

            <main className="max-w-7xl mx-auto px-6 py-12">
                {/* 상단 전면 광고 배너 */}
                <div className="mb-12">
                    <AdLeaderboard />
                </div>

                <div className="mb-12 flex justify-center">
                    <div className="px-6 py-2 bg-[#00ffbd]/10 border border-[#00ffbd]/30 rounded-full flex items-center gap-3 animate-pulse">
                        <Sparkles className="w-4 h-4 text-[#00ffbd]" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#00ffbd]">
                            SECTOR DYNAMICS ENGINE v4.0 LIVE
                        </span>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-8">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <LayoutGrid className="w-5 h-5 text-[#00ffbd]" />
                            <span className="text-xs font-black text-[#00ffbd] uppercase tracking-[0.3em]">테마 인텔리전스</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter text-white uppercase leading-none">
                            Sector <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-[#00ffbd]">Scanner</span>
                        </h1>
                        <p className="text-slate-500 text-sm mt-4 font-bold uppercase tracking-widest italic">섹터별 흐름과 기관 수급 분석 결과 공유 (Public Access)</p>
                    </div>

                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder="티커/종목명 검색..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:border-[#00ffbd] transition-all"
                        />
                    </div>
                </div>

                <div className="mb-12">
                    <AIPerformanceBanner lang="ko" />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-16">
                    {THEMES.map((theme) => {
                        const Icon = getIcon(theme.id);
                        const isActive = selectedTheme.id === theme.id;
                        return (
                            <button
                                key={theme.id}
                                onClick={() => setSelectedTheme(theme)}
                                className={`flex flex-col items-center justify-center p-8 rounded-[2.5rem] border transition-all duration-500 ${isActive
                                    ? 'bg-[#00ffbd] border-[#00ffbd] text-black shadow-lg shadow-[#00ffbd]/20 scale-105'
                                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                                    }`}
                            >
                                <Icon className={`w-8 h-8 mb-4 ${isActive ? 'text-black' : 'text-slate-500'}`} />
                                <span className="text-[10px] font-black uppercase tracking-widest text-center leading-tight">
                                    {theme.name_ko}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-40 bg-slate-950 rounded-[3rem] border border-slate-800 border-dashed">
                        <RefreshCw className="w-12 h-12 text-[#00ffbd] animate-spin mb-6" />
                        <p className="text-xs font-black uppercase tracking-[0.5em] text-slate-500">데이터 스캐닝 중...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredSignals.map((sig, idx) => (
                            <div key={idx} className="group bg-[#0a1120] border border-slate-800/80 rounded-[3rem] p-8 hover:border-[#00ffbd]/50 transition-all relative overflow-hidden flex flex-col h-full shadow-2xl">
                                <div className="absolute top-0 right-0 p-8 opacity-5">
                                    <Database className="w-24 h-24 text-white" />
                                </div>

                                <div className="flex justify-between items-start mb-8 relative z-10">
                                    <div className="px-3 py-1 bg-slate-950 border border-slate-800 rounded-lg text-xs font-black text-white w-fit">{sig.ticker}</div>
                                    <div className={`text-xl font-black flex items-center gap-2 ${sig.change_pct >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                        {sig.change_pct > 0 ? '+' : ''}{sig.change_pct}%
                                    </div>
                                </div>

                                <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tight truncate relative z-10">{sig.name}</h3>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-8 relative z-10 italic">Institutional Pulse Sync</p>

                                <div className="grid grid-cols-1 gap-4 mb-8 flex-1 relative z-10">
                                    <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl flex justify-between items-center">
                                        <div className="text-[9px] text-slate-500 font-black uppercase">Current Price</div>
                                        <div className="text-2xl font-black text-white font-mono italic">${sig.price}</div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl">
                                            <div className="text-[9px] text-slate-600 font-bold uppercase mb-1">Impact</div>
                                            <div className="text-xl font-black text-[#00ffbd] font-mono">{sig.impact_score}%</div>
                                        </div>
                                        <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl">
                                            <div className="text-[9px] text-slate-600 font-bold uppercase mb-1">Signals</div>
                                            <div className="text-xl font-black text-white font-mono italic">LIVE</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-slate-800/80 mt-auto relative z-10">
                                    <div className="flex items-center gap-2 mb-4">
                                        <BrainCircuit className="w-4 h-4 text-[#00ffbd]" />
                                        <span className="text-[11px] font-black text-[#00ffbd] uppercase tracking-widest">Empire AI Report</span>
                                    </div>
                                    <p className="text-[13px] leading-relaxed text-slate-300 italic font-medium">
                                        "{sig.ai_reason}"
                                    </p>
                                </div>

                                {/* 보스가 아닌 경우 타겟가는 숨김 (리스크 방칭) */}
                                {!isAdmin && (
                                    <div className="mt-6 p-4 bg-slate-900/50 rounded-2xl border border-white/5 text-center">
                                        <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">
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
        <Suspense fallback={<div className="min-h-screen bg-[#050b14] flex items-center justify-center text-white font-black uppercase">Loading...</div>}>
            <ThemeContent />
        </Suspense>
    );
}
