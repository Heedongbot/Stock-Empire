'use client';

import { useState, useEffect, Suspense } from 'react';
import {
    Crown, TrendingUp, TrendingDown, Target, ShieldAlert,
    ArrowLeft, Activity, Zap, ShieldCheck, RefreshCw, ChevronRight,
    Search, BarChart4, Waves, BrainCircuit, Lock, FileText, X
} from 'lucide-react';
import SiteHeader from '@/components/SiteHeader';
import { useAuth } from '@/lib/AuthContext';
import Link from 'next/link';
import AdLeaderboard from '@/components/ads/AdLeaderboard';
import StockLogo from '@/components/StockLogo';
import { STOCK_LIST } from '@/lib/stocks'; // 한글 종목명 매핑을 위해 추가 // Import added

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
    technical_analysis?: string;
    fundamental_analysis?: string;
    action_plan?: string;
    updated_at: string;
}

function VVIPAlphaContent() {
    const [signals, setSignals] = useState<AlphaSignal[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [scanning, setScanning] = useState(false);
    const [selectedAnalysis, setSelectedAnalysis] = useState<any>(null);
    const [exchangeRate, setExchangeRate] = useState(1435); // 초기값

    useEffect(() => {
        fetch('/api/exchange-rate')
            .then(res => res.json())
            .then(data => {
                if (data.rate) setExchangeRate(data.rate);
            })
            .catch(err => console.error('Failed to load exchange rate:', err));
    }, []);
    const { user } = useAuth();

    const handleDeepScan = async () => {
        if (!searchTerm) return;
        setScanning(true);
        try {
            const res = await fetch(`/api/analyze-ticker?ticker=${searchTerm}`);
            const data = await res.json();
            if (data.error) {
                alert(data.error);
                return;
            }
            // 실시간 분석 결과 목록 처음에 추가 및 모달 팝업
            setSignals(prev => [data, ...prev.filter(s => s.ticker !== data.ticker)]);
            setSelectedAnalysis(data);
        } catch (e) {
            console.error("Deep Scan failed", e);
        } finally {
            setScanning(false);
        }
    };
    useEffect(() => {
        fetchSignals();
    }, []);

    const fetchSignals = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/alpha-signals?lang=ko&t=${Date.now()}`);
            const data = await res.json();
            if (Array.isArray(data)) {
                setSignals(data);
            }
        } catch (e) {
            console.error("Failed to fetch Alpha signals", e);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans">
            <SiteHeader />

            <main className="relative z-10 max-w-7xl mx-auto px-6 py-12">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
                    <div className="space-y-4">
                        <Link href="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-slate-900 transition-colors text-xs font-black uppercase tracking-widest group">
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            사령부로 복귀
                        </Link>
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl shadow-xl shadow-blue-500/20 text-white">
                                <ShieldCheck className="w-8 h-8" />
                            </div>
                            <div>
                                <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-800 leading-none">
                                    LIVE <span className="text-blue-600">ALPHA SIGNALS</span>
                                </h1>
                                <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] mt-2">
                                    AI가 선별한 고수익 유망 종목 추천
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Google-style Central Search - Main Page Style */}
                    <div className="w-full md:w-[500px] relative group z-20">
                        <div className="relative">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleDeepScan()}
                                placeholder="종목 즉시 분석 (애플, 테슬라...)"
                                className="w-full px-6 md:px-8 py-4 md:py-5 rounded-[2rem] bg-white border-2 border-slate-300 shadow-xl shadow-blue-500/5 text-base md:text-lg font-bold focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all placeholder:text-slate-300 pr-32 md:pr-40"
                            />
                            <button
                                onClick={handleDeepScan}
                                disabled={scanning}
                                className="absolute right-2 top-2 bottom-2 md:right-3 md:top-3 md:bottom-3 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-full md:rounded-[1.5rem] font-black text-xs md:text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
                            >
                                {scanning ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Search className="w-4 h-4" />}
                                <span className="hidden md:inline">{scanning ? '분석 중...' : 'DEEP SCAN'}</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {loading ? (
                        Array(8).fill(0).map((_, i) => (
                            <div key={i} className="h-[450px] bg-slate-50 border border-slate-200 rounded-[2.5rem] animate-pulse"></div>
                        ))
                    ) : (
                        (searchTerm
                            ? signals.filter(s => s.ticker.toLowerCase().includes(searchTerm.toLowerCase()) || s.name.toLowerCase().includes(searchTerm.toLowerCase()))
                            : signals
                        ).map((sig) => (
                            <div key={sig.id} className="group relative bg-white border border-slate-300 rounded-[2.5rem] p-8 hover:border-blue-400 transition-all duration-500 hover:translate-y-[-8px] shadow-xl shadow-blue-500/5 hover:shadow-blue-500/10 overflow-hidden">
                                {!user && (
                                    <div className="absolute inset-0 z-30 backdrop-blur-md bg-white/60 flex flex-col items-center justify-center p-8 text-center">
                                        <Lock className="w-10 h-10 text-slate-400 mb-4" />
                                        <h4 className="text-slate-900 font-black tracking-widest text-sm mb-4">로그인이 필요합니다</h4>
                                        <a href="/sign-in" className="px-6 py-2.5 bg-slate-900 text-white font-black uppercase text-[10px] rounded-xl hover:scale-105 transition-all shadow-lg shadow-slate-900/10">
                                            무료 로그인
                                        </a>
                                    </div>
                                )}
                                <div className="absolute top-0 right-0 p-8">
                                    <div className="flex flex-col items-end gap-2">
                                        <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-100 rounded-full">
                                            <Waves className="w-3 h-3 text-blue-600" />
                                            <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">AI 추천</span>
                                        </div>
                                        <div className={`flex items-center gap-1 text-xs font-black ${sig.change_pct >= 0 ? 'text-red-500' : 'text-blue-600'}`}>
                                            {sig.change_pct > 0 ? '▲' : '▼'} {Math.abs(sig.change_pct)}%
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-10">
                                    <div className="inline-block px-4 py-1 bg-slate-100 border border-slate-200 rounded-xl text-xs font-black text-slate-700 mb-4 tracking-wider uppercase">
                                        {sig.ticker}
                                    </div>
                                    <h3 className="text-lg md:text-xl font-black text-slate-800 italic tracking-tighter leading-tight group-hover:text-blue-600 transition-colors break-keep min-h-[3rem] flex items-center">
                                        {STOCK_LIST.find(s => s.ticker === sig.ticker)?.name || sig.ticker}
                                    </h3>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-2 truncate">
                                        {STOCK_LIST.find(s => s.ticker === sig.ticker)?.name ? `${sig.ticker} • NASDAQ` : sig.name}
                                    </p>
                                </div>

                                <div className="mb-10 space-y-3">
                                    <div className="flex justify-between items-end">
                                        <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">AI 신뢰도</span>
                                        <span className="text-sm font-black text-slate-900">{sig.impact_score}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-blue-600"
                                            style={{ width: `${sig.impact_score}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-5 mb-10">
                                    <div className="flex justify-between items-center p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                                        <span className="text-[10px] text-slate-500 font-black uppercase">현재가</span>
                                        <div className="text-right">
                                            <div className="text-2xl font-black font-mono text-slate-900">${sig.price.toFixed(2)}</div>
                                            <div className="text-[10px] text-slate-400 font-bold">약 {Math.round(sig.price * exchangeRate).toLocaleString()}원</div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-2 p-4 bg-red-50 border border-red-100 rounded-2xl">
                                            <span className="text-[9px] text-red-500 font-black">목표가 (익절)</span>
                                            <div className="text-xl font-black font-mono text-red-600">${sig.target_price.toFixed(2)}</div>
                                            <div className="text-[9px] text-red-400 font-semibold">약 {Math.round(sig.target_price * exchangeRate).toLocaleString()}원</div>
                                        </div>
                                        <div className="flex flex-col gap-2 p-4 bg-blue-50 border border-blue-100 rounded-2xl">
                                            <span className="text-[9px] text-blue-500 font-black">손절가 (컷)</span>
                                            <div className="text-xl font-black font-mono text-blue-600">${sig.stop_loss.toFixed(2)}</div>
                                            <div className="text-[9px] text-blue-400 font-semibold">약 {Math.round(sig.stop_loss * exchangeRate).toLocaleString()}원</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="relative pt-6 border-t border-slate-200">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                            <BrainCircuit className="w-4 h-4 text-blue-600" />
                                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">AI 분석 요약</span>
                                        </div>
                                        <button
                                            onClick={() => setSelectedAnalysis(sig)}
                                            className="text-[9px] font-black text-blue-600 hover:text-slate-900 flex items-center gap-1 transition-colors uppercase"
                                        >
                                            상세보기 <ChevronRight className="w-3 h-3" />
                                        </button>
                                    </div>
                                    <p className="text-[11px] leading-relaxed text-slate-500 italic mb-6 line-clamp-2">
                                        {sig.ai_reason}
                                    </p>
                                    <button
                                        onClick={() => setSelectedAnalysis(sig)}
                                        className="w-full py-4 bg-slate-900 border border-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-white hover:bg-blue-600 hover:border-blue-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-900/10"
                                    >
                                        <FileText className="w-4 h-4" />
                                        전체 리포트 보기
                                    </button>

                                    <div className="mt-4 pt-3 border-t border-dashed border-slate-200 text-[9px] text-slate-400 font-medium text-center leading-tight">
                                        <ShieldAlert className="w-3 h-3 inline mr-1 mb-0.5" />
                                        본 정보는 AI 분석 결과로 투자 권유가 아니며,<br />
                                        투자의 책임은 전적으로 본인에게 있습니다.
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Analysis Details Modal */}
                {selectedAnalysis && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedAnalysis(null)} />
                        <div className="relative w-full max-w-5xl max-h-[90vh] bg-white border border-slate-200 rounded-[3rem] shadow-2xl overflow-hidden flex flex-col animate-zoom-in">
                            {/* Modal Header */}
                            <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                <div className="flex items-center gap-6">
                                    <div className="p-4 bg-slate-900 rounded-3xl shadow-xl shadow-slate-900/10 text-white">
                                        <ShieldCheck className="w-10 h-10" />
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-black text-slate-900 tracking-tighter">{selectedAnalysis.name} ({selectedAnalysis.ticker})</h2>
                                        <p className="text-[11px] font-black text-blue-600 uppercase tracking-[0.4em]">AI 심층 분석 리포트 · NotebookLM 제공</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedAnalysis(null)}
                                    className="p-4 bg-white hover:bg-slate-100 rounded-3xl text-slate-400 hover:text-slate-900 transition-all border border-slate-200 shadow-sm"
                                >
                                    <X className="w-8 h-8" />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="flex-1 overflow-y-auto p-10 custom-scrollbar style={{ scrollbarWidth: 'none' }}">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                                    <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-200">
                                        <div className="flex items-center gap-2 mb-4">
                                            <BarChart4 className="w-4 h-4 text-slate-400" />
                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">기술적 분석</span>
                                        </div>
                                        <p className="text-sm text-slate-600 leading-relaxed font-medium">
                                            {selectedAnalysis.technical_analysis || "현 시점 집계된 기술적 지표가 부족합니다."}
                                        </p>
                                    </div>
                                    <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-200">
                                        <div className="flex items-center gap-2 mb-4">
                                            <Activity className="w-4 h-4 text-purple-600" />
                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">기본적 분석</span>
                                        </div>
                                        <p className="text-sm text-slate-600 leading-relaxed font-medium">
                                            {selectedAnalysis.fundamental_analysis || "기업 가치 및 거시 경제 데이터 로드 중..."}
                                        </p>
                                    </div>
                                    <div className="bg-blue-50 p-8 rounded-[2.5rem] border border-blue-100 shadow-xl shadow-blue-500/5">
                                        <div className="flex items-center gap-2 mb-4">
                                            <Target className="w-4 h-4 text-blue-600" />
                                            <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] italic underline decoration-2 underline-offset-4">Strategic Action Plan</span>
                                        </div>
                                        <p className="text-sm text-slate-900 leading-relaxed font-black">
                                            {selectedAnalysis.action_plan || "대응 시나리오가 생성되지 않았습니다."}
                                        </p>
                                    </div>
                                </div>

                                <div className="p-8 bg-slate-900 rounded-[2.5rem] border border-slate-800 relative overflow-hidden shadow-2xl shadow-slate-900/10">
                                    <div className="absolute top-0 right-0 p-8 opacity-10">
                                        <BrainCircuit className="w-32 h-32 text-white" />
                                    </div>
                                    <div className="flex items-center gap-3 mb-6">
                                        <Zap className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                                        <span className="text-xs font-black text-yellow-400 uppercase tracking-widest">Master's Intelligence Summary</span>
                                    </div>
                                    <p className="text-2xl font-black text-white italic leading-tight max-w-2xl relative z-10">
                                        "{selectedAnalysis.ai_reason}"
                                    </p>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="p-8 bg-slate-50 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.4em]">
                                    BOSS TERMINAL v1.5 ALPHA - SECURE DATA LINK ESTABLISHED
                                </p>
                                <div className="flex items-center gap-4">
                                    <span className="text-[9px] text-slate-500 font-bold uppercase">Confidence Score: {selectedAnalysis.impact_score}%</span>
                                    <div className="w-32 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-600" style={{ width: `${selectedAnalysis.impact_score}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <div className="mt-20">
                    <AdLeaderboard />
                </div>
            </main>
        </div>
    );
}

export default function VVIPAlphaPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#020617] flex items-center justify-center text-white font-black uppercase tracking-widest">Accessing Boss Terminal...</div>}>
            <VVIPAlphaContent />
        </Suspense>
    );
}
