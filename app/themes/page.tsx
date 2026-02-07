'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
    LayoutGrid, List, Search, TrendingUp, TrendingDown,
    ArrowRight, Activity, Zap, ShieldCheck, Globe, Cpu, Car,
    Wallet, Rocket, RefreshCw, Lock, BrainCircuit, Sparkles
} from 'lucide-react';
import SiteHeader from '@/components/SiteHeader';
import { THEMES } from '@/lib/themes';
import { useAuth } from '@/lib/AuthContext';
import { AIPerformanceBanner } from '@/components/AIPerformanceBanner';

function ThemeContent() {
    const searchParams = useSearchParams();
    const [selectedTheme, setSelectedTheme] = useState(THEMES[0]);
    const [signals, setSignals] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [lang, setLang] = useState<'ko' | 'en'>('ko');
    const [searchTerm, setSearchTerm] = useState('');
    const { user } = useAuth();
    const isPro = user?.tier === 'PRO' || user?.role === 'ADMIN';

    useEffect(() => {
        const savedLang = localStorage.getItem('stock-empire-lang') as 'ko' | 'en';
        if (savedLang) setLang(savedLang);

        const themeId = searchParams.get('id');
        if (themeId) {
            const theme = THEMES.find(t => t.id === themeId);
            if (theme) setSelectedTheme(theme);
        }
    }, [searchParams]);

    useEffect(() => {
        fetchThemeData(selectedTheme.id);
    }, [selectedTheme, lang]);

    const fetchThemeData = async (id: string) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/theme-signals?id=${id}&lang=${lang}&t=${Date.now()}`);
            const data = await res.json();
            if (data.signals && data.signals.length > 0) {
                setSignals(data.signals);
            } else {
                console.warn("No signals received from API");
                setSignals([]);
            }
        } catch (e) {
            console.error("Theme fetch error", e);
            setSignals([]);
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
            <SiteHeader lang={lang} setLang={setLang} />

            <main className="max-w-7xl mx-auto px-6 py-12">
                {/* 
                   DYNAMIC ENGINE BADGE 
                   This proves the code is updated and the engine is live.
                */}
                <div className="mb-12 flex justify-center">
                    <div className="px-6 py-2 bg-indigo-600/10 border border-indigo-500/30 rounded-2xl flex items-center gap-3 animate-pulse shadow-2xl shadow-indigo-600/10">
                        <Sparkles className="w-4 h-4 text-indigo-400" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400">
                            Kim Daeri Alpha Engine v2.0 High-Pulse Live
                        </span>
                    </div>
                </div>

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-8">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <LayoutGrid className="w-5 h-5 text-blue-400" />
                            <span className="text-xs font-black text-blue-400 uppercase tracking-[0.3em]">
                                {lang === 'ko' ? '테마 인텔리전스' : 'Theme Intelligence'}
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter text-white uppercase leading-none">
                            Sector <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600">Scanner</span>
                        </h1>
                    </div>

                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder={lang === 'ko' ? "티커 또는 종목명 검색..." : "Search Ticker or Name..."}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:outline-none focus:border-blue-500 transition-all"
                        />
                    </div>
                </div>

                {/* Live AI Performance Stats */}
                <div className="mb-12">
                    <AIPerformanceBanner lang={lang} />
                </div>

                {/* Theme Selector Area */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-16">
                    {THEMES.map((theme) => {
                        const Icon = getIcon(theme.id);
                        const isActive = selectedTheme.id === theme.id;
                        return (
                            <button
                                key={theme.id}
                                onClick={() => setSelectedTheme(theme)}
                                className={`flex flex-col items-center justify-center p-8 rounded-3xl border transition-all duration-500 group ${isActive
                                    ? 'bg-blue-600 border-blue-500 shadow-2xl shadow-blue-600/30 scale-105'
                                    : 'bg-slate-900/50 border-slate-800 hover:border-slate-600 hover:bg-slate-800/40'
                                    }`}
                            >
                                <Icon className={`w-8 h-8 mb-4 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                                <span className={`text-[10px] font-black uppercase tracking-widest text-center leading-tight ${isActive ? 'text-white' : 'text-slate-400'}`}>
                                    {lang === 'ko' ? theme.name_ko : theme.name_en}
                                </span>
                                {isActive && (
                                    <div className="mt-3 flex items-center gap-1">
                                        <div className="w-1 h-1 bg-white rounded-full animate-ping" />
                                        <span className="text-[8px] font-black text-white/70 uppercase">Live</span>
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Grid Content */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-40 bg-slate-900/20 rounded-[3rem] border border-slate-800/50 border-dashed">
                        <RefreshCw className="w-12 h-12 text-blue-500 animate-spin mb-6" />
                        <p className="text-xs font-black uppercase tracking-[0.5em] text-slate-500 animate-pulse">Scanning Global Markets...</p>
                    </div>
                ) : filteredSignals.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredSignals.map((sig, idx) => (
                            <div key={idx} className="group bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-[2.5rem] p-8 hover:border-blue-500/50 transition-all relative overflow-hidden flex flex-col h-full">
                                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                                    <Activity className="w-24 h-24 text-white" />
                                </div>

                                <div className="flex justify-between items-start mb-8">
                                    <div className="flex flex-col gap-2">
                                        <div className="px-3 py-1 bg-slate-950 border border-slate-800 rounded-lg text-xs font-black text-white w-fit">{sig.ticker}</div>
                                        {sig.whale_active && (
                                            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-yellow-500/10 border border-yellow-500/20 rounded text-[9px] font-black text-yellow-500 uppercase tracking-widest italic">
                                                Whale Active
                                            </div>
                                        )}
                                    </div>
                                    <div className={`text-base font-black flex items-center gap-2 ${sig.change_pct >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                        {sig.change_pct > 0 ? '+' : ''}{sig.change_pct}%
                                        {sig.change_pct >= 0 ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                                    </div>
                                </div>

                                <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tight truncate">{sig.name}</h3>
                                <div className="flex items-center gap-2 mb-8">
                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Institutional Pulse Sync</p>
                                </div>

                                <div className="grid grid-cols-1 gap-4 mb-8 flex-1">
                                    <div className="bg-slate-950/80 border border-slate-800 p-5 rounded-3xl flex justify-between items-center group/price transition-colors hover:border-slate-700">
                                        <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{lang === 'ko' ? '현재가' : 'Current Price'}</div>
                                        <div className="text-2xl font-black text-white font-mono italic">${sig.price}</div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-slate-950 border border-slate-800 p-5 rounded-3xl">
                                            <div className="text-[10px] text-slate-600 font-bold uppercase tracking-widest mb-1">{lang === 'ko' ? '목표가' : 'Target'}</div>
                                            <div className={`text-xl font-black font-mono ${!isPro ? 'blur-md select-none text-slate-700' : 'text-blue-400'}`}>${sig.target_price}</div>
                                        </div>
                                        <div className="bg-slate-950 border border-slate-800 p-5 rounded-3xl">
                                            <div className="text-[10px] text-slate-600 font-bold uppercase tracking-widest mb-1">Impact Score</div>
                                            <div className="text-xl font-black text-white font-mono">{sig.impact_score}%</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-slate-800/80 mt-auto">
                                    <div className="flex items-center gap-2 mb-4">
                                        <BrainCircuit className="w-4 h-4 text-indigo-400 stroke-[2.5px]" />
                                        <span className="text-[11px] font-black text-indigo-400 uppercase tracking-widest">
                                            {lang === 'ko' ? '김대리 책임 분석관 리포트' : 'Kim Daeri Senior Analyst Report'}
                                        </span>
                                    </div>
                                    <p className="text-[13px] leading-relaxed text-slate-300 italic font-medium px-1">
                                        "{sig.ai_reason}"
                                    </p>
                                </div>

                                {!isPro && (
                                    <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[3px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="flex flex-col items-center group/upgrade">
                                            <div className="p-4 bg-blue-600 rounded-full mb-4 shadow-2xl shadow-blue-600/50 group-hover/upgrade:scale-110 transition-transform">
                                                <Lock className="w-6 h-6 text-white" />
                                            </div>
                                            <span className="text-xs font-black uppercase tracking-[0.3em] text-white">Upgrade to VVIP</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-40 bg-slate-900/10 rounded-[3rem] border border-slate-800 border-dashed">
                        <Activity className="w-16 h-16 text-slate-700 mb-6" />
                        <h4 className="text-xl font-black text-slate-500 uppercase italic tracking-widest mb-2">No Market Data Detected</h4>
                        <p className="text-slate-600 text-[10px] font-bold uppercase tracking-widest px-8 text-center">
                            Synchronizing with institutional feeds. Please use the refresh button if the scanner remains idle.
                        </p>
                        <button
                            onClick={() => fetchThemeData(selectedTheme.id)}
                            className="mt-8 px-8 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all"
                        >
                            Reconnect Feed
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}

export default function ThemePage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#050b14] flex flex-col items-center justify-center text-white font-black uppercase tracking-[0.5em]">
                <RefreshCw className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
                Initializing Themes...
            </div>
        }>
            <ThemeContent />
        </Suspense>
    );
}
