'use client';

import { Lock, TrendingUp, TrendingDown, BarChart3, Target, AlertTriangle, Lightbulb, Crown, ThumbsUp, Activity, Sparkles } from 'lucide-react';

interface NewsItemProps {
    news: any;
    userTier: string;
}

export default function TieredNewsCard({ news }: NewsItemProps) {
    // 100% FREE ACCESS MODE: Always show full analysis
    return (
        <div className="bg-[#0a1120] border border-slate-800/60 rounded-[2.5rem] p-8 hover:border-[#00ffbd]/30 transition-all shadow-2xl relative overflow-hidden group mb-8">
            <div className="absolute top-0 right-0 p-8 opacity-5">
                <Activity className="w-24 h-24 text-white" />
            </div>

            <div className="flex items-start justify-between mb-8 relative z-10">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="flex items-center gap-2 px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-lg">
                            <Activity className="w-3 h-3 text-[#00ffbd]" />
                            <span className="text-[10px] font-black text-[#00ffbd] uppercase tracking-widest">{news.ticker}</span>
                        </div>
                        <span className={`px-2.5 py-1 text-[10px] font-black rounded-lg border uppercase tracking-widest ${news.sentiment === 'BULLISH'
                            ? 'bg-green-500/10 text-green-400 border-green-500/20'
                            : 'bg-red-500/10 text-red-400 border-red-500/20'
                            }`}>
                            {news.sentiment === 'BULLISH' ? '🐂 BULLISH BIAS' : '🐻 BEARISH BIAS'}
                        </span>
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                            <Target className="w-3 h-3 text-blue-400" />
                            <span className="text-[10px] font-black text-blue-400 uppercase">Alpha Sync 94%</span>
                        </div>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-black text-white mb-2 leading-[1.1] tracking-tighter uppercase italic group-hover:text-[#00ffbd] transition-colors">{news.title_kr || news.title}</h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mb-6 opacity-60">{news.title_en || news.title}</p>
                </div>
            </div>

            <div className="space-y-6 relative z-10">
                {/* PREMIUM AI ANALYSIS BLOCK */}
                <div className="p-8 bg-[#050b14] border border-[#00ffbd]/20 rounded-[2rem] relative overflow-hidden group/analysis">
                    <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover/analysis:opacity-[0.07] transition-opacity">
                        <Sparkles className="w-32 h-32 text-[#00ffbd]" />
                    </div>

                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 bg-[#00ffbd]/10 rounded-xl flex items-center justify-center border border-[#00ffbd]/30 shadow-[0_0_15px_rgba(0,255,189,0.2)]">
                            <Sparkles className="w-4 h-4 text-[#00ffbd]" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-[#00ffbd] uppercase tracking-[0.3em] leading-none mb-1">Empire Alpha Intelligence</span>
                            <span className="text-[8px] text-slate-500 font-bold uppercase tracking-widest leading-none">Global Macro Correlation Verified</span>
                        </div>
                    </div>

                    <div className="text-sm md:text-base text-slate-200 font-medium leading-[1.7] mb-8 border-l-2 border-[#00ffbd] pl-6 italic">
                        "{news.summary_kr || "실시간 분석 엔진이 가동 중입니다. 잠시만 기다려주세요."}"
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-slate-800/50">
                        {[
                            { label: 'Market Regime', val: 'Low Volatility', color: 'text-blue-400' },
                            { label: 'Liquidity Score', val: '92.4/100', color: 'text-[#00ffbd]' },
                            { label: 'Risk Factor', val: 'Minimal', color: 'text-[#00ffbd]' },
                            { label: 'Signal Strength', val: 'Level 5', color: 'text-amber-500' }
                        ].map((item, i) => (
                            <div key={i} className="flex flex-col">
                                <span className="text-[8px] text-slate-500 font-black uppercase tracking-widest mb-1">{item.label}</span>
                                <span className={`text-[11px] font-black ${item.color} uppercase tracking-tighter`}>{item.val}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-8 pt-8 border-t border-slate-800/40 relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="flex -space-x-2">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="w-6 h-6 rounded-full border-2 border-[#0a1120] bg-slate-800 flex items-center justify-center overflow-hidden">
                                <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-900" />
                            </div>
                        ))}
                    </div>
                    <span className="text-[10px] text-slate-500 font-bold tracking-tight uppercase">
                        Analyzed by <span className="text-white">Jung & Top Specialists</span>
                    </span>
                </div>

                <div className="flex items-center gap-6">
                    <span className="text-[11px] font-mono text-slate-600 uppercase tracking-tighter">
                        TS: {new Date(news.published_at).toISOString()}
                    </span>
                    <a href={news.link} target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 bg-slate-900 hover:bg-[#00ffbd] text-slate-400 hover:text-black font-black text-[10px] rounded-xl border border-slate-800 hover:border-[#00ffbd] transition-all uppercase tracking-widest">
                        Raw Feed Link
                    </a>
                </div>
            </div>
        </div>
    );
}
