'use client';

import { useState, useEffect, Suspense } from 'react';
import {
    Activity, Zap, Target, ShieldAlert, ChevronRight,
    ArrowUpRight, BarChart3, TrendingUp,
    Search, Cpu, X, Database, Lock, RefreshCw, Sparkles, AlertCircle
} from 'lucide-react';
import SiteHeader from '@/components/SiteHeader';
import { useAuth } from '@/lib/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import AdLeaderboard from '@/components/ads/AdLeaderboard';
import AdInFeed from '@/components/ads/AdInFeed';
import ServerStatusSection from '@/components/ServerStatusSection';
import { STOCK_LIST } from '@/lib/stocks';

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
    const router = useRouter();

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

            console.log('API Response:', data); // Debug log

            if (data.error) {
                alert(data.error);
                return;
            }

            // Ensure data has all required fields
            const completeData = {
                ...data,
                id: data.id || data.ticker,
                technical_analysis: data.technical_analysis || data.ai_reason || "기술적 분석 진행 중...",
                fundamental_analysis: data.fundamental_analysis || "기본적 분석 진행 중...",
                action_plan: data.action_plan || "실행 전략 수립 중..."
            };

            setSignals(prev => [completeData, ...prev.filter(s => s.ticker !== completeData.ticker)]);
            setSelectedSignal(completeData); // Open modal immediately
            console.log('Modal should open with:', completeData); // Debug log
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
        { id: 'ALL', name: '전체 보기', icon: Activity },
        { id: 'Golden Cross', name: '상승 신호', icon: Zap },
        { id: 'RSI Rebound', name: '반등 기대', icon: TrendingUp },
        { id: 'Volume Surge', name: '거래량 급증', icon: BarChart3 }
    ];

    return (
        <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans">
            <SiteHeader />

            <main className="max-w-7xl mx-auto px-6 py-12">
                {/* 상단 전면 광고 */}
                <div className="mb-12 overflow-hidden rounded-[2.5rem] bg-white border border-slate-300 shadow-xl shadow-blue-500/5">
                    <AdLeaderboard />
                </div>

                {/* Hero Search Section */}
                <section className="relative mb-20 pt-10 pb-16 overflow-hidden">
                    <div className="text-center mb-12">
                        <div className="flex items-center justify-center gap-2 mb-6">
                            <span className="px-4 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest border border-blue-100">
                                AI 기반 실시간 분석
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 leading-tight text-slate-900">
                            주식 공부 대신 <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Stock Empire</span>에서 <br />
                            쉽게 물어보세요
                        </h1>
                    </div>

                    <div className="max-w-2xl mx-auto mb-10 md:mb-12 relative group">
                        {!user && (
                            <div className="absolute inset-0 z-20 backdrop-blur-sm bg-white/70 rounded-[2rem] flex items-center justify-center">
                                <div className="text-center p-8">
                                    <Lock className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                                    <h3 className="text-xl font-black text-slate-900 mb-2">로그인이 필요합니다</h3>
                                    <p className="text-sm text-slate-600 mb-6">AI 종목 분석은 회원 전용 서비스입니다</p>
                                    <a href="/sign-in" className="inline-block px-8 py-3 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-lg">
                                        3초만에 무료 시작
                                    </a>
                                </div>
                            </div>
                        )}
                        <div className="relative">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                }}
                                onFocus={() => setSearchTerm('')}
                                onKeyDown={(e) => e.key === 'Enter' && handleDeepScan()}
                                placeholder="애플, 테슬라, 엔비디아..."
                                disabled={!user}
                                className="w-full px-6 md:px-8 py-4 md:py-6 rounded-[2rem] bg-white border-2 border-slate-300 shadow-xl shadow-blue-500/5 text-base md:text-xl font-bold focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all placeholder:text-slate-300 pr-16 md:pr-40 disabled:opacity-50"
                            />
                            <button
                                onClick={handleDeepScan}
                                disabled={scanning || !user}
                                className="absolute right-2 top-2 bottom-2 md:right-3 md:top-3 md:bottom-3 w-12 md:w-auto px-0 md:px-8 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-full md:rounded-[1.5rem] font-black text-xs md:text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                            >
                                {scanning ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Search className="w-5 h-5 md:w-4 md:h-4" />}
                                <span className="hidden md:inline">{scanning ? '분석 중...' : '심층 분석기'}</span>
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-slate-500 font-bold">
                        <span className="text-slate-400">🔥 지금 많이 찾는 종목:</span>
                        {STOCK_LIST.slice(0, 5).map(s => (
                            <button
                                key={s.ticker}
                                onClick={() => {
                                    if (user) setSearchTerm(s.name);
                                }}
                                disabled={!user}
                                className="px-4 py-1.5 rounded-full bg-white border border-slate-300 hover:border-blue-400 hover:text-blue-600 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {s.name}
                            </button>
                        ))}
                    </div>

                    {/* Floating Decorative Elements */}
                    <div className="absolute top-1/4 left-10 w-24 h-24 bg-blue-200/30 rounded-3xl blur-2xl animate-pulse" />
                    <div className="absolute bottom-1/4 right-10 w-32 h-32 bg-purple-200/30 rounded-full blur-3xl animate-pulse delay-700" />
                </section>

                {/* Strategy Filter Buttons */}
                <div className="flex flex-wrap gap-2 mb-12 justify-center">
                    {STRATEGIES.map((strat) => (
                        <button
                            key={strat.id}
                            onClick={() => setFilter(strat.id)}
                            className={`flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all border ${filter === strat.id
                                ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/20'
                                : 'bg-white text-slate-500 border-slate-300 hover:border-slate-400'
                                }`}
                        >
                            <strat.icon size={12} className={`md:w-3.5 md:h-3.5 ${filter === strat.id ? 'text-white' : 'text-slate-400'}`} />
                            {strat.name}
                        </button>
                    ))}
                </div>

                {/* Signals Display */}
                {
                    loading ? (
                        <div className="flex flex-col items-center justify-center py-40" >
                            <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-6" />
                            <p className="text-slate-400 text-xs font-black uppercase tracking-widest animate-pulse">데이터를 불러오고 있습니다...</p>
                        </div>
                    ) : filteredSignals.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-32 text-center bg-white rounded-[3rem] border border-slate-300 shadow-xl shadow-blue-500/5">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                                <Search className="w-8 h-8 text-slate-400" />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 mb-2">
                                검색 결과가 없습니다
                            </h3>
                            <p className="text-slate-500 text-sm font-bold mb-8">
                                "{searchTerm}" 에 대한 분석 데이터가 아직 없습니다. <br />
                                상단의 <span className="text-blue-600">긴급 진단</span> 버튼을 눌러 AI 분석을 요청해보세요.
                            </p>
                        </div>
                    ) : (
                        <div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredSignals.map((sig, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => user && setSelectedSignal(sig)}
                                        className="group relative bg-white border border-slate-300 rounded-[2.5rem] p-8 hover:border-blue-400 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all cursor-pointer shadow-sm overflow-hidden"
                                    >
                                        {!user && (
                                            <div className="absolute inset-0 z-30 backdrop-blur-md bg-white/60 flex flex-col items-center justify-center p-6 text-center rounded-[2.5rem]">
                                                <Lock className="w-10 h-10 text-blue-600 mb-3" />
                                                <h4 className="text-sm font-black text-slate-900 mb-2">로그인 필요</h4>
                                                <p className="text-xs text-slate-600 mb-4">회원 전용 AI 분석</p>
                                                <a href="/sign-in" className="px-6 py-2 bg-blue-600 text-white text-xs font-black rounded-xl hover:bg-blue-700 transition-all">
                                                    무료 시작
                                                </a>
                                            </div>
                                        )}
                                        <div className="flex justify-between items-start mb-6 relative z-10">
                                            <div className="px-4 py-2 bg-slate-50 rounded-xl text-xs font-black text-slate-700">{sig.ticker}</div>
                                            <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1 ${sig.sentiment === 'BULLISH' ? 'bg-red-50 text-red-600' : sig.sentiment === 'BEARISH' ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-500'}`}>
                                                {sig.sentiment === 'BULLISH' ? <TrendingUp className="w-3 h-3" /> : sig.sentiment === 'BEARISH' ? <TrendingUp className="w-3 h-3 rotate-180" /> : null}
                                                {sig.sentiment}
                                            </div>
                                        </div>

                                        <h3 className="text-xl font-black text-slate-900 mb-2 truncate group-hover:text-blue-600 transition-colors relative z-10">
                                            {STOCK_LIST.find(s => s.ticker === sig.ticker)?.name || sig.name}
                                        </h3>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-8 relative z-10">{sig.strategy}</p>

                                        <div className="grid grid-cols-2 gap-4 mb-8 relative z-10">
                                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                                                <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">영향력</div>
                                                <div className="text-xl font-black text-slate-900">{sig.impact_score}%</div>
                                            </div>
                                            <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                                                <div className="text-[10px] text-blue-400 font-black uppercase tracking-widest mb-1">상태</div>
                                                <div className="text-xl font-black text-blue-600">분석완료</div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between group-hover:pl-2 transition-all relative z-10">
                                            <span className="text-[11px] font-black text-slate-400 group-hover:text-blue-600 transition-colors">리포트 자세히 보기</span>
                                            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                                                <ChevronRight className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                }

                {user?.role === 'ADMIN' && (
                    <div className="mt-20">
                        <ServerStatusSection />
                    </div>
                )}
            </main >

            {/* Signal Detail Modal - Light Theme */}
            {
                selectedSignal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setSelectedSignal(null)} />
                        <div className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-[3rem] overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in duration-300">
                            <div className="bg-slate-50 p-6 md:p-8 border-b border-slate-200 flex justify-between items-center z-10">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-white border border-slate-200 rounded-2xl shadow-sm">
                                        <Cpu className="w-8 h-8 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">{selectedSignal.ticker}</h3>
                                        <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest">AI 심층 분석 리포트</p>
                                    </div>
                                </div>
                                <button onClick={() => setSelectedSignal(null)} className="p-3 bg-white border border-slate-200 hover:bg-slate-100 rounded-2xl text-slate-400 hover:text-slate-900 transition-all">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-white">
                                {!user ? (
                                    <div className="py-20 text-center">
                                        <div className="w-24 h-24 bg-orange-50 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                                            <Lock className="w-10 h-10 text-orange-500" />
                                        </div>
                                        <h4 className="text-2xl font-black text-slate-900 mb-3">로그인이 필요한 정보입니다</h4>
                                        <p className="text-slate-500 font-bold mb-8 max-w-md mx-auto leading-relaxed">
                                            심층 AI 분석 리포트는 회원 전용 서비스입니다. <br />
                                            무료로 로그인하고 모든 정보를 확인하세요.
                                        </p>
                                        <a href="/sign-in" className="inline-flex items-center justify-center px-10 py-4 bg-slate-900 text-white font-black rounded-2xl text-sm transition-all hover:scale-105 shadow-lg shadow-slate-900/20">
                                            3초만에 간편 로그인
                                        </a>
                                    </div>
                                ) : (
                                    <div className="space-y-8">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-200">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <TrendingUp className="w-4 h-4 text-blue-500" />
                                                    <div className="text-[11px] font-black text-slate-500 uppercase tracking-widest">기술적 분석</div>
                                                </div>
                                                <p className="text-sm text-slate-700 leading-relaxed font-bold">{selectedSignal.technical_analysis || "분석 데이터가 부족합니다."}</p>
                                            </div>
                                            <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-200">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <Database className="w-4 h-4 text-emerald-500" />
                                                    <div className="text-[11px] font-black text-slate-500 uppercase tracking-widest">기본적 분석</div>
                                                </div>
                                                <p className="text-sm text-slate-700 leading-relaxed font-bold">{selectedSignal.fundamental_analysis || "데이터 로딩 중..."}</p>
                                            </div>
                                            <div className="bg-blue-50/50 p-8 rounded-[2rem] border border-blue-100">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <Target className="w-4 h-4 text-blue-600" />
                                                    <div className="text-[11px] font-black text-blue-600 uppercase tracking-widest">실행 전략</div>
                                                </div>
                                                <p className="text-sm text-slate-900 leading-relaxed font-black">{selectedSignal.action_plan || "대응 계획 수립 중..."}</p>
                                            </div>
                                        </div>

                                        <div className="p-10 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-[2.5rem] relative overflow-hidden shadow-xl shadow-slate-900/10">
                                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                                <Sparkles className="w-48 h-48 text-white" />
                                            </div>
                                            <div className="flex items-center gap-2 mb-6 relative z-10">
                                                <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-blue-300 backdrop-blur-sm border border-white/10">AI 요약</span>
                                            </div>
                                            <p className="text-2xl md:text-3xl font-black italic leading-tight text-white relative z-10">
                                                "{selectedSignal.ai_reason}"
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {[
                                                { label: '목표 가격', value: `$${selectedSignal.target_price}`, color: 'text-blue-600' },
                                                { label: '조심할 가격', value: `$${selectedSignal.stop_loss}`, color: 'text-red-500' },
                                                { label: '영향력', value: `${selectedSignal.impact_score}%`, color: 'text-slate-900' },
                                                { label: '전망', value: selectedSignal.sentiment, color: selectedSignal.sentiment === 'BULLISH' ? 'text-red-500' : 'text-blue-600' }
                                            ].map((stat, i) => (
                                                <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm text-center">
                                                    <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">{stat.label}</div>
                                                    <div className={`text-xl font-black ${stat.color}`}>{stat.value}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
}

export default function AnalysisPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#f8fafc] flex items-center justify-center"><div className="w-10 h-10 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div></div>}>
            <AnalysisContent />
        </Suspense>
    );
}
