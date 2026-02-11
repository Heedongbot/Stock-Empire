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
            if (data.error) {
                alert(data.error);
                return;
            }
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

                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-8">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest border border-blue-100">
                                AI 기반 실시간 분석
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 leading-tight mb-4">
                            Deep <span className="text-blue-600">Market Scan</span>
                        </h1>
                        <p className="text-slate-500 text-sm font-bold">
                            어려운 차트 분석은 AI에게 맡기세요. <br className="md:hidden" />
                            실시간 시장 데이터를 가장 쉽게 해석해드립니다.
                        </p>
                    </div>

                    <div className="flex flex-col gap-4 w-full md:w-auto items-start md:items-end">
                        <div className="flex gap-2 md:gap-3 w-full md:w-auto">
                            <div className="relative flex-1 md:w-64 group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <input
                                    type="text"
                                    className="block w-full pl-10 md:pl-11 pr-4 py-3 bg-white border border-slate-300 rounded-2xl text-sm font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all shadow-sm"
                                    placeholder="종목명/티커"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleDeepScan()}
                                />
                            </div>
                            <button
                                onClick={handleDeepScan}
                                disabled={scanning}
                                className={`px-4 md:px-6 py-3 bg-slate-900 text-white text-[10px] md:text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 flex items-center justify-center gap-2 whitespace-nowrap ${scanning ? 'opacity-70' : ''}`}
                            >
                                {scanning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 text-blue-400" />}
                                {scanning ? '분석 중...' : '긴급 진단'}
                            </button>
                        </div>

                        <div className="flex flex-wrap gap-2 w-full justify-start md:justify-end">
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
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-40">
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
                                    onClick={() => setSelectedSignal(sig)}
                                    className="group relative bg-white border border-slate-300 rounded-[2.5rem] p-8 hover:border-blue-400 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all cursor-pointer shadow-sm overflow-hidden"
                                >
                                    <div className="flex justify-between items-start mb-6 relative z-10">
                                        <div className="px-4 py-2 bg-slate-50 rounded-xl text-xs font-black text-slate-700">{sig.ticker}</div>
                                        <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1 ${sig.sentiment === 'BULLISH' ? 'bg-red-50 text-red-600' : sig.sentiment === 'BEARISH' ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-500'}`}>
                                            {sig.sentiment === 'BULLISH' ? <TrendingUp className="w-3 h-3" /> : sig.sentiment === 'BEARISH' ? <TrendingUp className="w-3 h-3 rotate-180" /> : null}
                                            {sig.sentiment}
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-black text-slate-900 mb-2 truncate group-hover:text-blue-600 transition-colors relative z-10">{sig.name}</h3>
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

            {/* Signal Detail Modal - Light Theme */}
            {selectedSignal && (
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
                                            { label: '목표가', value: `$${selectedSignal.target_price}`, color: 'text-blue-600' },
                                            { label: '손절가', value: `$${selectedSignal.stop_loss}`, color: 'text-red-500' },
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
            )}
        </div>
    );
}

export default function AnalysisPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#f8fafc] flex items-center justify-center"><div className="w-10 h-10 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div></div>}>
            <AnalysisContent />
        </Suspense>
    );
}
