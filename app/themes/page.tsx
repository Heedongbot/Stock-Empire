'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
    LayoutGrid, List, Search, TrendingUp, TrendingDown,
    ArrowRight, Activity, Zap, ShieldCheck, Globe, Cpu, Car,
    Wallet, Rocket, RefreshCw, Lock
} from 'lucide-react';
import SiteHeader from '@/components/SiteHeader';
import { THEMES } from '@/lib/themes';
import { useAuth } from '@/lib/AuthContext';

function ThemeContent() {
    const searchParams = useSearchParams();
    const [selectedTheme, setSelectedTheme] = useState(THEMES[0]);
    const [signals, setSignals] = useState<any[]>([]);

    useEffect(() => {
        const themeId = searchParams.get('id');
        if (themeId) {
            const theme = THEMES.find(t => t.id === themeId);
            if (theme) setSelectedTheme(theme);
        }
    }, [searchParams]);
    const [loading, setLoading] = useState(true);
    const [lang, setLang] = useState<'ko' | 'en'>('ko');
    const [searchTerm, setSearchTerm] = useState('');
    const { user } = useAuth();
    const isVVIP = user?.tier === 'VVIP';

    useEffect(() => {
        const savedLang = localStorage.getItem('stock-empire-lang') as 'ko' | 'en';
        if (savedLang) setLang(savedLang);
    }, []);

    useEffect(() => {
        fetchThemeData(selectedTheme.id);
    }, [selectedTheme, lang]);

    const fetchThemeData = async (id: string) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/theme-signals?id=${id}&lang=${lang}&t=${Date.now()}`);
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
            <SiteHeader lang={lang} setLang={setLang} />

            <main className="max-w-7xl mx-auto px-6 py-12">
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

                {/* Theme Selector Area */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
                    {THEMES.map((theme) => {
                        const Icon = getIcon(theme.id);
                        const isActive = selectedTheme.id === theme.id;
                        return (
                            <button
                                key={theme.id}
                                onClick={() => setSelectedTheme(theme)}
                                className={`flex flex-col items-center justify-center p-6 rounded-3xl border transition-all duration-300 ${isActive
                                    ? 'bg-blue-600 border-blue-500 shadow-xl shadow-blue-600/20 scale-105'
                                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                                    }`}
                            >
                                <Icon className={`w-8 h-8 mb-3 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                                <span className={`text-[10px] font-black uppercase tracking-widest text-center ${isActive ? 'text-white' : 'text-slate-400'}`}>
                                    {lang === 'ko' ? theme.name_ko : theme.name_en}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Grid Content */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-40">
                        <RefreshCw className="w-12 h-12 text-blue-500 animate-spin mb-4" />
                        <p className="text-xs font-black uppercase tracking-[0.5em] text-slate-500 animate-pulse">Scanning Market Data...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredSignals.map((sig, idx) => (
                            <div key={idx} className="group bg-slate-900 border border-slate-800 rounded-3xl p-8 hover:border-blue-500/50 transition-all relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <Activity className="w-20 h-20 text-white" />
                                </div>

                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex flex-col gap-2">
                                        <div className="px-3 py-1 bg-slate-950 border border-slate-800 rounded-lg text-xs font-black text-white w-fit">{sig.ticker}</div>
                                        {sig.whale_active && (
                                            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-yellow-500/10 border border-yellow-500/20 rounded text-[8px] font-black text-yellow-500 uppercase tracking-widest">
                                                Whale Active
                                            </div>
                                        )}
                                    </div>
                                    <div className={`text-sm font-black flex items-center gap-1.5 ${sig.change_pct >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                        {sig.change_pct > 0 ? '+' : ''}{sig.change_pct}%
                                        {sig.change_pct >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                                    </div>
                                </div>

                                <h3 className="text-xl font-black text-white mb-1 uppercase tracking-tight truncate">{sig.name}</h3>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-8">Constituent Performance</p>

                                <div className="grid grid-cols-1 gap-4 mb-8">
                                    <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl flex justify-between items-center group/price">
                                        <div className="text-[9px] text-slate-500 font-black uppercase tracking-widest">{lang === 'ko' ? '현재가' : 'Live Price'}</div>
                                        <div className="text-xl font-black text-white font-mono italic">${sig.price}</div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl">
                                            <div className="text-[9px] text-slate-600 font-bold uppercase tracking-widest mb-1">{lang === 'ko' ? '목표가' : 'Target'}</div>
                                            <div className={`text-lg font-black font-mono ${!isVVIP && user?.role !== 'ADMIN' ? 'blur-md select-none text-slate-700' : 'text-blue-400'}`}>${sig.target_price}</div>
                                        </div>
                                        <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl">
                                            <div className="text-[9px] text-slate-600 font-bold uppercase tracking-widest mb-1">Impact</div>
                                            <div className="text-lg font-black text-white font-mono">{sig.impact_score}%</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-slate-800/80">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Zap className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                                        <span className="text-[10px] font-black text-yellow-500 uppercase tracking-widest">
                                            {lang === 'ko' ? '김대리의 인사이트' : 'Kim Daeri Analyst Insight'}
                                        </span>
                                    </div>
                                    <p className="text-[12px] leading-relaxed text-slate-300 italic font-medium">
                                        "{sig.ai_reason}"
                                    </p>
                                </div>

                                {!isVVIP && (
                                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="flex flex-col items-center">
                                            <div className="p-3 bg-blue-600 rounded-full mb-3 shadow-lg">
                                                <Lock className="w-5 h-5 text-white" />
                                            </div>
                                            <span className="text-xs font-black uppercase tracking-widest">Upgrade to VVIP</span>
                                        </div>
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
        <Suspense fallback={<div className="min-h-screen bg-[#050b14] flex items-center justify-center text-white font-black uppercase tracking-widest">Initializing Themes...</div>}>
            <ThemeContent />
        </Suspense>
    );
}
