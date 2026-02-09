'use client';

import { useState } from 'react';
import { Search, Brain, TrendingUp, DollarSign, Activity, Lock, BarChart3, AlertCircle, CheckCircle2 } from 'lucide-react';

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
            const response = await fetch(`/api/stock-analysis?ticker=${searchTerm}`);
            const data = await response.json();

            if (!response.ok) {
                // Fallback or Error Display (Simple alert for now)
                alert("Ticker not found or API error. Please try a valid US Ticker (e.g., AAPL).");
                setAnalyzing(false);
                return;
            }

            // Artificial delay for "Scanning" effect (Users trust it more if it takes a second)
            setTimeout(() => {
                setAnalyzing(false);
                setResult(data);
            }, 1500);

        } catch (error) {
            console.error("Fetch error:", error);
            setAnalyzing(false);
            alert("Failed to connect to Alpha Engine.");
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 p-8 pt-24">
            <div className="max-w-6xl mx-auto">
                <div className="mb-10 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-sm font-bold mb-4">
                        <Brain size={16} /> PRO EXCLUSIVE
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                        AI Deep Analyzer
                    </h1>
                    <p className="text-slate-400 max-w-2xl mx-auto">
                        검색 한 번으로 기본적 분석부터 거시 경제 영향까지. <br />슈퍼 트레이더 AI가 당신의 종목을 낱낱이 파헤칩니다.
                    </p>
                </div>

                {/* Search Bar */}
                <div className="max-w-2xl mx-auto mb-16 relative">
                    <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full" />
                    <form onSubmit={handleSearch} className="relative z-10 flex gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="종목 코드 또는 이름 입력 (예: TSLA, AAPL)..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-slate-900/80 border border-slate-700 rounded-xl py-4 pl-12 pr-4 text-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-600"
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg hover:shadow-blue-500/25 flex items-center gap-2"
                        >
                            {analyzing ? <Activity className="animate-spin" /> : <Brain />}
                            ANALYZE
                        </button>
                    </form>
                </div>

                {/* Analysis Dashboard */}
                {analyzing && (
                    <div className="text-center py-20">
                        <div className="inline-block relative">
                            <div className="w-24 h-24 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                            <Brain className="absolute inset-0 m-auto text-blue-500 animate-pulse" size={32} />
                        </div>
                        <h3 className="text-2xl font-bold mt-8 animate-pulse text-blue-400">Kim Daeri is thinking...</h3>
                        <p className="text-slate-500 mt-2">재무제표 스캔 중... 매크로 데이터 대조 중...</p>
                    </div>
                )}

                {result && !analyzing && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up">
                        {/* Header Stats */}
                        <div className="md:col-span-3 bg-slate-900/50 border border-slate-800 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-sm">
                            <div className="flex items-center gap-6">
                                <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center text-3xl font-black text-white shadow-lg shadow-blue-500/20">
                                    {result.ticker.substring(0, 1)}
                                </div>
                                <div>
                                    <h2 className="text-3xl font-bold text-white">{result.ticker}</h2>
                                    <div className="flex items-center gap-3 mt-1">
                                        <span className="text-2xl font-mono text-white">${result.price}</span>
                                        <span className="text-green-400 font-mono font-bold bg-green-500/10 px-2 rounded-md">{result.change}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-8">
                                <div className="text-center">
                                    <div className="text-slate-400 text-sm mb-1">AI Score</div>
                                    <div className="text-4xl font-black text-white">{result.score}<span className="text-lg text-slate-500">/10</span></div>
                                </div>
                                <div className={`px-6 py-3 rounded-xl font-black text-xl border ${result.verdict.includes('BUY') ? 'bg-green-500/20 border-green-500/50 text-green-400' : 'bg-red-500/20 border-red-500/50 text-red-400'}`}>
                                    {result.verdict}
                                </div>
                            </div>
                        </div>

                        {/* Macro */}
                        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 hover:border-slate-600 transition-colors group">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400 group-hover:text-purple-300">
                                    <GlobeIcon />
                                </div>
                                <h3 className="text-lg font-bold text-slate-200">Macro Insight</h3>
                            </div>
                            <p className="text-slate-400 leading-relaxed text-sm">
                                {result.macro}
                            </p>
                        </div>

                        {/* Fundamental */}
                        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 hover:border-slate-600 transition-colors group">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400 group-hover:text-emerald-300">
                                    <BarChart3 size={24} />
                                </div>
                                <h3 className="text-lg font-bold text-slate-200">Fundamental</h3>
                            </div>
                            <p className="text-slate-400 leading-relaxed text-sm">
                                {result.fundamental}
                            </p>
                        </div>

                        {/* Technical */}
                        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 hover:border-slate-600 transition-colors group">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-orange-500/10 rounded-lg text-orange-400 group-hover:text-orange-300">
                                    <TrendingUp size={24} />
                                </div>
                                <h3 className="text-lg font-bold text-slate-200">Technical</h3>
                            </div>
                            <p className="text-slate-400 leading-relaxed text-sm">
                                {result.technical}
                            </p>
                        </div>

                        {/* Risk Factor */}
                        <div className="md:col-span-3 bg-red-900/10 border border-red-900/30 rounded-3xl p-6 flex flex-col md:flex-row gap-6 items-start">
                            <div className="flex-shrink-0 p-3 bg-red-500/10 rounded-xl text-red-400">
                                <AlertCircle size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-red-400 mb-2">Risk Factor Warning</h3>
                                <p className="text-red-200/60 text-sm">{result.risk}</p>
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
}

function GlobeIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" /></svg>
    )
}
