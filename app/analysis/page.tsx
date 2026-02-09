'use client';

import { useState, useEffect, Suspense } from 'react';
import {
    Activity, Zap, Target, ShieldAlert, ChevronRight,
    ArrowUpRight, BarChart3, TrendingUp,
    Search, Cpu, X, Database, Lock, RefreshCw
} from 'lucide-react';
import SiteHeader from '@/components/SiteHeader';
import { useAuth } from '@/lib/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import AdLeaderboard from '@/components/ads/AdLeaderboard';
import AdInFeed from '@/components/ads/AdInFeed';
import { DonationSection } from '@/components/DonationSection';

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
    strategy: string;
}

function AnalysisContent() {
    const searchParams = useSearchParams();
    const initialSearch = searchParams.get('q') || '';
    const { user } = useAuth();
    const isAdmin = user?.role === 'ADMIN';

    const [signals, setSignals] = useState<AlphaSignal[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');
    const [selectedSignal, setSelectedSignal] = useState<AlphaSignal | null>(null);
    const [searchTerm, setSearchTerm] = useState(initialSearch);
    const [scanning, setScanning] = useState(false);

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
            // 실시간 분석 결과를 목록 처음에 추가하고 모달 자동 팝업
            setSignals(prev => [data, ...prev.filter(s => s.ticker !== data.ticker)]);
            setSelectedSignal(data);
        } catch (e) {
            console.error("Deep Scan failed", e);
            alert("연결 오류: 서버 상태를 확인해주세요.");
        } finally {
            setScanning(false);
        }
    };

    useEffect(() => {
        const fetchSignals = async () => {
            try {
                // 전면 무료화에 맞춰 모든 사용자에게 데이터 소스 제공
                const res = await fetch(`/api/alpha-signals?lang=ko&t=${Date.now()}`);
                const data = await res.json();
                if (Array.isArray(data)) {
                    setSignals(data);
                }
            } catch (e) {
                console.error("Failed to fetch market signals", e);
            } finally {
                setLoading(false);
            }
        };
        fetchSignals();
    }, []);

    const filteredSignals = signals.filter(s =>
        (filter === 'ALL' || s.strategy === filter) &&
        (s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.ticker.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const STRATEGIES = [
        { id: 'ALL', name: '전체 전략', icon: Activity },
        { id: 'Golden Cross', name: '골든크로스', icon: Zap },
        { id: 'RSI Rebound', name: 'RSI 반등', icon: TrendingUp },
        { id: 'Volume Surge', name: '거래량 폭증', icon: BarChart3 }
    ];

    return (
        <div className="min-h-screen bg-[#050b14] text-slate-200 font-sans">
            <SiteHeader />

            <main className="max-w-7xl mx-auto px-6 py-12">
                {/* 상단 전면 광고 */}
                <div className="mb-12">
                    <AdLeaderboard />
                </div>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-8">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <Cpu className="w-5 h-5 text-[#00ffbd]" />
                            <span className="text-xs font-black text-[#00ffbd] uppercase tracking-[0.3em]">Empire Market Intelligence</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter text-white uppercase leading-none">
                            Deep <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ffbd] to-blue-500">Market Scan</span>
                        </h1>
                        <p className="text-slate-500 text-sm mt-4 font-bold uppercase tracking-widest">실시간 시장 지표와 AI 기술 분석 통합 대시보드 (전면 무료 개방)</p>
                    </div>

                    <div className="flex flex-col gap-6 w-full md:w-auto items-end">
                        <div className="flex gap-3 w-full md:w-auto">
                            <div className="relative w-full md:w-64 group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                                <input
                                    type="text"
                                    className="block w-full pl-11 pr-4 py-3 bg-slate-900/50 border border-slate-800 rounded-xl text-sm font-bold text-white placeholder-slate-600 focus:border-[#00ffbd] transition-all"
                                    placeholder="익절/손절가 즉시 분석 (티커 입력)"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleDeepScan()}
                                />
                            </div>
                            <button
                                onClick={handleDeepScan}
                                disabled={scanning}
                                className={`px-6 py-3 bg-gradient-to-r from-[#00ffbd] to-blue-500 text-black text-xs font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-all shadow-lg shadow-[#00ffbd]/20 flex items-center gap-2 ${scanning ? 'animate-pulse opacity-70' : ''}`}
                            >
                                {scanning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                                {scanning ? 'Analyzing...' : 'Deep Scan'}
                            </button>
                        </div>

                        <div className="flex flex-wrap gap-2 p-2 bg-slate-900/50 rounded-2xl border border-slate-800">
                            {STRATEGIES.map((strat) => (
                                <button
                                    key={strat.id}
                                    onClick={() => setFilter(strat.id)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === strat.id ? 'bg-[#00ffbd] text-black shadow-lg shadow-[#00ffbd]/20' : 'text-slate-500 hover:text-slate-300'}`}
                                >
                                    <strat.icon size={14} />
                                    {strat.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-40">
                        <div className="w-16 h-16 border-4 border-[#00ffbd] border-t-transparent rounded-full animate-spin mb-6" />
                        <p className="text-slate-500 text-xs font-black uppercase tracking-[0.5em] animate-pulse">알파 데이터 동기화 중...</p>
                    </div>
                ) : filteredSignals.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 animate-fade-in-up text-center">
                        <X className="w-12 h-12 text-slate-800 mb-6" />
                        <h3 className="text-xl font-black text-white italic uppercase tracking-tighter mb-4">
                            No Local Analysis Found
                        </h3>
                        <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mb-12 max-w-md">
                            "{searchTerm}" 에 대한 로컬 분석 데이터가 없습니다. <br />
                            상단의 <span className="text-[#00ffbd]">Deep Scan</span> 버튼을 눌러 실시간 AI 분석을 시작하시겠습니까?
                        </p>
                        <DonationSection />
                    </div>
                ) : (
                    <div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredSignals.map((sig, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => setSelectedSignal(sig)}
                                    className="group relative bg-[#0a1120] border border-slate-800/60 rounded-3xl p-8 hover:border-[#00ffbd]/50 transition-all cursor-pointer shadow-xl overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 p-6 opacity-5">
                                        <Database className="w-24 h-24 text-white" />
                                    </div>

                                    <div className="flex justify-between items-start mb-6">
                                        <div className="px-3 py-1 bg-slate-950 border border-slate-800 rounded-lg text-xs font-black text-white">{sig.ticker}</div>
                                        <div className={`text-[10px] font-black flex items-center gap-1 uppercase tracking-widest ${sig.sentiment === 'BULLISH' ? 'text-green-500' : 'text-red-500'}`}>
                                            {sig.sentiment} {sig.change_pct}%
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tight group-hover:text-[#00ffbd] transition-colors">{sig.name}</h3>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-8">{sig.strategy}</p>

                                    <div className="grid grid-cols-2 gap-4 mb-8">
                                        <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800">
                                            <div className="text-[9px] text-slate-600 font-bold uppercase tracking-widest mb-1">Impact</div>
                                            <div className="text-lg font-black text-[#00ffbd]">{sig.impact_score}%</div>
                                        </div>
                                        <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800">
                                            <div className="text-[9px] text-slate-600 font-bold uppercase tracking-widest mb-1">Status</div>
                                            <div className="text-lg font-black text-white">READY</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between group-hover:translate-x-1 transition-transform">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-[#00ffbd] italic">분석 보고서 열기</span>
                                        <ChevronRight className="w-4 h-4 text-[#00ffbd]" />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-20">
                            <DonationSection />
                        </div>
                    </div>
                )}

                {/* 하단 섹션 광고 */}
                <div className="mt-20">
                    <AdInFeed />
                </div>
            </main>

            {/* Signal Detail Modal */}
            {selectedSignal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setSelectedSignal(null)} />
                    <div className="relative bg-[#0a1120] border border-slate-700 w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col animate-zoom-in">
                        <div className="bg-slate-900/50 p-6 md:p-8 border-b border-slate-800 flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-[#00ffbd]/10 border border-[#00ffbd]/30 rounded-2xl">
                                    <Cpu className="w-8 h-8 text-[#00ffbd]" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">{selectedSignal.ticker}</h3>
                                    <p className="text-[10px] text-[#00ffbd] font-black uppercase tracking-[0.3em]">NotebookLM Strategic Intelligence Report</p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedSignal(null)} className="p-3 bg-slate-800 hover:bg-slate-700 rounded-2xl text-slate-500 hover:text-white transition-all">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                            {!user ? (
                                <div className="py-20 text-center">
                                    <Lock className="w-16 h-16 text-amber-500 mx-auto mb-8 animate-bounce" />
                                    <h4 className="text-xl font-black text-white mb-4 uppercase italic">Elite Analysis Locked</h4>
                                    <p className="text-sm text-slate-500 font-bold leading-relaxed italic mb-10 max-w-md mx-auto">
                                        심층 AI 분석 리포트는 사령관(Boss) 전용 데이터입니다. <br />
                                        지금 로그인하여 마스터들의 실전 대응 계획을 확인하십시오.
                                    </p>
                                    <a href="/sign-in" className="inline-block px-10 py-4 bg-[#00ffbd] text-black font-black rounded-xl text-xs uppercase tracking-widest hover:scale-105 transition-all">
                                        기밀 문서 해제하기
                                    </a>
                                </div>
                            ) : (
                                <div className="space-y-10">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800">
                                            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Technical</div>
                                            <p className="text-sm text-slate-300 leading-relaxed font-medium">{selectedSignal.technical_analysis || "기술적 지표 분석 데이터가 부족합니다."}</p>
                                        </div>
                                        <div className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800">
                                            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Fundamental</div>
                                            <p className="text-sm text-slate-300 leading-relaxed font-medium">{selectedSignal.fundamental_analysis || "기본 가치 분석 데이터 로딩 중..."}</p>
                                        </div>
                                        <div className="bg-[#00ffbd]/5 p-6 rounded-3xl border border-[#00ffbd]/20 shadow-lg">
                                            <div className="text-[10px] font-black text-[#00ffbd] uppercase tracking-widest mb-3">Action Plan</div>
                                            <p className="text-sm text-white leading-relaxed font-black">{selectedSignal.action_plan || "마스터의 대응 계획이 수립되지 않았습니다."}</p>
                                        </div>
                                    </div>

                                    <div className="p-8 bg-black/40 rounded-[2.5rem] border border-slate-800 relative overflow-hidden">
                                        <div className="flex items-center gap-3 mb-6">
                                            <Zap className="w-5 h-5 text-[#00ffbd] fill-[#00ffbd]" />
                                            <span className="text-xs font-black text-white uppercase tracking-widest">Master's Intelligence Summary</span>
                                        </div>
                                        <p className="text-xl font-black text-white italic leading-tight italic">
                                            "{selectedSignal.ai_reason}"
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800 text-center">
                                            <div className="text-[8px] text-slate-600 font-bold uppercase mb-1">Target</div>
                                            <div className="text-lg font-black text-[#00ffbd]">${selectedSignal.target_price}</div>
                                        </div>
                                        <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800 text-center">
                                            <div className="text-[8px] text-slate-600 font-bold uppercase mb-1">Stop Loss</div>
                                            <div className="text-lg font-black text-red-500">${selectedSignal.stop_loss}</div>
                                        </div>
                                        <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800 text-center">
                                            <div className="text-[8px] text-slate-600 font-bold uppercase mb-1">Impact</div>
                                            <div className="text-lg font-black text-blue-500">{selectedSignal.impact_score}%</div>
                                        </div>
                                        <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800 text-center">
                                            <div className="text-[8px] text-slate-600 font-bold uppercase mb-1">Sentiment</div>
                                            <div className={`text-lg font-black ${selectedSignal.sentiment === 'BULLISH' ? 'text-green-500' : 'text-red-500'}`}>{selectedSignal.sentiment}</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-6 bg-slate-900/50 border-t border-slate-800 flex justify-center">
                            <p className="text-[9px] text-slate-700 font-bold uppercase tracking-[0.3em]">
                                AUTHENTICATED ALPHA DATA STREAM - GLOBAL EMPIRE TERMINAL v1.5
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function AnalysisPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#050b14] flex items-center justify-center text-white font-black uppercase tracking-widest">Loading...</div>}>
            <AnalysisContent />
        </Suspense>
    );
}
