'use client';

import { useState } from 'react';
import { Search, Brain, TrendingUp, DollarSign, Activity, Lock, BarChart3, AlertCircle, CheckCircle2, Sparkles, Zap, Globe } from 'lucide-react';
import SiteHeader from '@/components/SiteHeader';
import AdInFeed from '@/components/ads/AdInFeed';

export default function ProAnalyzerPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState<any>(null);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchTerm) return;

        setAnalyzing(true);
        setResult(null);

        try {
            // Simulate API call for now or connect to real endpoint
            // const response = await fetch(`/api/stock-analysis?ticker=${searchTerm}`);
            // const data = await response.json();

            // Mock Data for UI Testing (Replace with real fetch later)
            setTimeout(() => {
                setResult({
                    ticker: searchTerm.toUpperCase(),
                    price: "154.23",
                    change: "+2.4%",
                    score: 8.5,
                    verdict: "STRONG BUY",
                    macro: "연준의 금리 인하 기대감이 시장 전반에 긍정적인 영향을 미치고 있습니다. 특히 기술주 중심의 상승세가 뚜렷하며, 해당 종목은 AI 섹터의 대장주로서 수혜가 예상됩니다.",
                    fundamental: "매출 성장률이 전년 동기 대비 15% 증가했으며, 영업이익률 또한 개선되고 있습니다. 현금 흐름이 안정적이며 부채 비율이 낮아 재무 건전성이 우수합니다.",
                    technical: "일봉상 골든크로스가 발생하기 직전이며, RSI 지표가 과매수 구간에 진입하지 않아 추가 상승 여력이 충분합니다. 120일 이동평균선 지지를 받고 반등 중입니다.",
                    risk: "단기 급등에 따른 차익 실현 매물이 출회될 수 있으며, 다음 달 실적 발표 전까지 변동성이 확대될 가능성이 있습니다."
                });
                setAnalyzing(false);
            }, 2000);

        } catch (error) {
            console.error("Fetch error:", error);
            setAnalyzing(false);
            alert("Failed to connect to Alpha Engine.");
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans">
            <SiteHeader />

            <div className="max-w-6xl mx-auto px-6 py-12">
                <div className="mb-12 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-50 border border-yellow-200 text-yellow-600 text-[10px] font-black uppercase tracking-widest mb-6 animate-fade-in shadow-sm">
                        <StarIcon className="w-3 h-3 fill-current" /> VVIP PRO EXCLUSIVE
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black mb-6 text-slate-900 tracking-tighter leading-tight">
                        AI Deep <span className="text-blue-600">Analyzer</span>
                    </h1>
                    <p className="text-slate-500 font-bold text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
                        검색 한 번으로 기본적 분석부터 거시 경제 영향까지. <br />
                        슈퍼 트레이더 AI가 당신의 종목을 낱낱이 파헤칩니다.
                    </p>
                </div>

                {/* Search Bar */}
                <div className="max-w-2xl mx-auto mb-20 relative z-10">
                    <div className="absolute inset-0 bg-blue-500/10 blur-3xl rounded-full transform scale-150 opacity-50" />
                    <form onSubmit={handleSearch} className="relative z-10 flex gap-3">
                        <div className="relative flex-1 group">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-blue-500 transition-colors w-5 h-5" />
                            <input
                                type="text"
                                placeholder="종목 코드 또는 이름 입력 (예: TSLA, AAPL)..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-white border border-slate-300 rounded-[2rem] py-5 pl-16 pr-6 text-lg font-bold focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all placeholder:text-slate-300 text-slate-900 shadow-xl shadow-blue-500/5 hover:shadow-blue-500/10"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={analyzing}
                            className={`bg-slate-900 hover:bg-slate-800 text-white font-black px-6 md:px-10 rounded-[2rem] transition-all shadow-xl shadow-slate-900/10 hover:shadow-slate-900/20 flex items-center gap-2 md:gap-3 text-xs md:text-sm tracking-widest uppercase hover:-translate-y-1 active:scale-95 whitespace-nowrap ${analyzing ? 'opacity-80 cursor-not-allowed' : ''}`}
                        >
                            {analyzing ? <Activity className="animate-spin w-4 h-4 md:w-5 md:h-5" /> : <Brain className="w-4 h-4 md:w-5 md:h-5" />}
                            <span className="hidden md:inline">{analyzing ? 'Analyzing...' : 'Analyze'}</span>
                            <span className="md:hidden">{analyzing ? '...' : 'GO'}</span>
                        </button>
                    </form>
                </div>

                {/* Analysis Dashboard */}
                {analyzing ? (
                    <div className="text-center py-20 bg-white rounded-[3rem] border border-slate-300 shadow-xl shadow-blue-500/5 animate-fade-in-up">
                        <div className="inline-block relative mb-8">
                            <div className="w-24 h-24 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Brain className="text-blue-600 animate-pulse w-8 h-8" />
                            </div>
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-2">AI Analyzing...</h3>
                        <p className="text-slate-500 text-sm font-bold animate-pulse">재무제표 스캔 중... 매크로 데이터 대조 중...</p>
                    </div>
                ) : result ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in-up">
                        {/* Header Stats */}
                        <div className="md:col-span-3 bg-white border border-slate-300 rounded-[3rem] p-10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl shadow-blue-500/5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50" />

                            <div className="flex items-center gap-8 relative z-10">
                                <div className="w-24 h-24 bg-slate-900 rounded-[2rem] flex items-center justify-center text-4xl font-black text-white shadow-2xl shadow-slate-900/20 group hover:scale-105 transition-transform">
                                    {result.ticker.substring(0, 1)}
                                </div>
                                <div>
                                    <div className="flex items-baseline gap-4 mb-2">
                                        <h2 className="text-4xl font-black text-slate-900 tracking-tighter">{result.ticker}</h2>
                                        <span className="px-3 py-1 bg-slate-100 rounded-lg text-xs font-black text-slate-500 uppercase tracking-widest">NASDAQ</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-3xl font-black text-slate-700 tracking-tight">${result.price}</span>
                                        <span className="text-green-600 font-black bg-green-50 px-3 py-1 rounded-xl text-sm">{result.change}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-10 relative z-10">
                                <div className="text-center">
                                    <div className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">AI Score</div>
                                    <div className="text-5xl font-black text-slate-900 tracking-tighter">{result.score}<span className="text-lg text-slate-400 font-bold">/10</span></div>
                                </div>
                                <div className={`px-8 py-4 rounded-2xl font-black text-xl border ${result.verdict.includes('BUY') ? 'bg-green-50 border-green-200 text-green-600' : 'bg-red-50 border-red-200 text-red-600'} shadow-sm`}>
                                    {result.verdict}
                                </div>
                            </div>
                        </div>

                        {/* Macro */}
                        <div className="bg-white border border-slate-300 rounded-[2.5rem] p-8 hover:border-blue-200 transition-all hover:-translate-y-1 shadow-lg shadow-slate-200/50 group">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                                    <Globe className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-black text-slate-900">Macro Insight</h3>
                            </div>
                            <p className="text-slate-500 leading-relaxed text-sm font-medium">
                                {result.macro}
                            </p>
                        </div>

                        {/* Fundamental */}
                        <div className="bg-white border border-slate-300 rounded-[2.5rem] p-8 hover:border-emerald-200 transition-all hover:-translate-y-1 shadow-lg shadow-slate-200/50 group">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm">
                                    <BarChart3 className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-black text-slate-900">Fundamental</h3>
                            </div>
                            <p className="text-slate-500 leading-relaxed text-sm font-medium">
                                {result.fundamental}
                            </p>
                        </div>

                        {/* Technical */}
                        <div className="bg-white border border-slate-300 rounded-[2.5rem] p-8 hover:border-orange-200 transition-all hover:-translate-y-1 shadow-lg shadow-slate-200/50 group">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-orange-50 rounded-2xl text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-all shadow-sm">
                                    <TrendingUp className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-black text-slate-900">Technical</h3>
                            </div>
                            <p className="text-slate-500 leading-relaxed text-sm font-medium">
                                {result.technical}
                            </p>
                        </div>

                        {/* Risk Factor */}
                        <div className="md:col-span-3 bg-red-50 border border-red-200 rounded-[2.5rem] p-8 flex flex-col md:flex-row gap-8 items-start relative overflow-hidden">
                            <div className="absolute -right-10 -bottom-10 opacity-5 pointer-events-none">
                                <AlertCircle className="w-64 h-64 text-red-600" />
                            </div>
                            <div className="flex-shrink-0 p-4 bg-white rounded-2xl text-red-500 shadow-sm border border-red-200">
                                <AlertCircle className="w-8 h-8" />
                            </div>
                            <div className="relative z-10">
                                <h3 className="text-lg font-black text-red-600 mb-2 uppercase tracking-wide">Risk Factor Warning</h3>
                                <p className="text-red-800/80 text-sm font-bold leading-relaxed">{result.risk}</p>
                            </div>
                        </div>

                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-30 pointer-events-none blur-sm select-none">
                        {/* Placeholder Content for "Empty State" Visuals */}
                        <div className="h-64 bg-white rounded-[3rem] border border-slate-300"></div>
                        <div className="h-64 bg-white rounded-[3rem] border border-slate-300"></div>
                    </div>
                )}

                <div className="mt-20">
                    <AdInFeed />
                </div>
            </div>
        </div>
    );
}

function StarIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
        </svg>
    )
}
