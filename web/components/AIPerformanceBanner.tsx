'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Trophy, Target, Activity, AlertCircle } from 'lucide-react';
import { translations } from '@/lib/translations';

export function AIPerformanceBanner({ lang = 'ko' }: { lang?: 'ko' | 'en' }) {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/ai-performance')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setStats(data.data);
                }
                setLoading(false);
            })
            .catch(err => console.error(err));
    }, []);

    if (loading) return <div className="h-24 bg-slate-900/50 rounded-xl animate-pulse mb-8" />;

    if (!stats) return null;

    return (
        <div className="relative mb-8 overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl">
            {/* Glowing Border Effect */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />

            <div className="flex flex-col md:flex-row items-center justify-between p-6 gap-6">

                {/* Left: Main Stats */}
                <div className="flex items-center gap-6 w-full md:w-auto justify-center md:justify-start">
                    <div className="text-center md:text-left">
                        <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-wider mb-1">
                            <Activity size={12} />
                            {lang === 'ko' ? '지난 30일 AI 실적' : 'Last 30 Days AI Performance'}
                        </div>
                        <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
                            +{stats.averageReturn}%
                        </div>
                        <div className="text-[10px] text-slate-500 font-medium mt-1">
                            {lang === 'ko' ? `총 ${stats.totalPicks}개 종목 추천 평균` : `Avg. return on ${stats.totalPicks} picks`}
                        </div>
                    </div>

                    <div className="h-12 w-[1px] bg-slate-800 hidden md:block" />

                    <div className="text-center md:text-left">
                        <div className="flex items-center gap-2 text-yellow-500 text-xs font-bold uppercase tracking-wider mb-1">
                            <Trophy size={12} />
                            {lang === 'ko' ? '적중률' : 'Win Rate'}
                        </div>
                        <div className="text-3xl font-black text-white">
                            {stats.winRate}%
                        </div>
                        <div className="text-[10px] text-slate-500 font-medium mt-1">
                            {lang === 'ko' ? '손절가 미터치 비율' : 'Selections hit target'}
                        </div>
                    </div>
                </div>

                {/* Right: Best Pick & Ticker */}
                <div className="w-full md:flex-1 bg-slate-800/50 rounded-xl p-3 border border-slate-700/50 flex flex-col justify-center">
                    <div className="flex justify-between items-center mb-2 px-1">
                        <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                            <Target size={10} /> BEST PICK
                        </span>
                        <span className="text-[10px] text-slate-500">{stats.bestPick.date}</span>
                    </div>
                    <div className="flex justify-between items-end px-1">
                        <div>
                            <span className="text-lg font-bold text-white block leading-none">{stats.bestPick.ticker}</span>
                            <span className="text-[10px] text-slate-400">{stats.bestPick.name}</span>
                        </div>
                        <div className="text-xl font-black text-green-400">
                            +{stats.bestPick.return}%
                        </div>
                    </div>
                </div>

            </div>

            {/* Bottom Marquee: Live Updates */}
            <div className="bg-slate-950 py-2 border-t border-slate-800/50 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-12 h-full bg-gradient-to-r from-slate-950 to-transparent z-10" />
                <div className="absolute top-0 right-0 w-12 h-full bg-gradient-to-l from-slate-950 to-transparent z-10" />

                <div className="whitespace-nowrap animate-marquee flex gap-8 items-center px-4">
                    {stats.liveUpdate.map((update: string, i: number) => (
                        <span key={i} className="text-xs font-mono text-slate-300 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                            {update}
                        </span>
                    ))}
                    {/* Duplicate for seamless loop */}
                    {stats.liveUpdate.map((update: string, i: number) => (
                        <span key={`dup-${i}`} className="text-xs font-mono text-slate-300 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                            {update}
                        </span>
                    ))}
                </div>
            </div>

            <style jsx>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    animation: marquee 20s linear infinite;
                }
            `}</style>
        </div>
    );
}
