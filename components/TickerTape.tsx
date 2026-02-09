'use client';

import { useEffect, useState } from 'react';

export default function TickerTape() {
    const [stats, setStats] = useState([
        { label: 'S&P 500', value: '5,023', change: '+0.8%', up: true },
        { label: 'NASDAQ', value: '16,234', change: '-0.3%', up: false },
        { label: 'NVDA', value: '$880', change: '+5.8%', up: true },
        { label: 'AAPL', value: '$189', change: '+1.2%', up: true },
        { label: 'BTC/USD', value: '$64,200', change: '+3.4%', up: true },
        { label: 'GOLD', value: '$2,150', change: '-0.1%', up: false },
    ]);

    const [hotPicks, setHotPicks] = useState([
        { name: 'TESLA', change: '+3.2%', type: 'HOT' },
        { name: 'MICROSOFT', change: '+1.8%', type: 'HOT' },
        { name: 'INTEL', change: '-2.9%', type: 'CRASH' }
    ]);

    return (
        <div className="w-full bg-[#030712] border-b border-slate-900 text-[10px] font-black tracking-widest uppercase overflow-hidden whitespace-nowrap z-[100] relative h-8 flex items-center">

            {/* Left Side Static Badge */}
            <div className="absolute left-0 top-0 bottom-0 bg-red-600 px-3 flex items-center z-10 shadow-xl shadow-red-600/20">
                <span className="text-white animate-pulse">LIVE</span>
            </div>

            {/* Scrolling Ticker Content */}
            <div className="animate-ticker flex items-center gap-8 pl-20 text-slate-400">
                {/* Market Indices */}
                {[...stats, ...stats].map((stat, idx) => (
                    <div key={`stat-${idx}`} className="flex items-center gap-2">
                        <span className="text-slate-500">{stat.label}</span>
                        <span className="text-slate-200">{stat.value}</span>
                        <span className={stat.up ? 'text-green-500' : 'text-red-500'}>
                            {stat.change}
                        </span>
                    </div>
                ))}

                <span className="text-slate-700 mx-4">|</span>

                {/* Hot Picks */}
                <div className="flex items-center gap-6">
                    <span className="text-yellow-500">💡 지금 급등:</span>
                    {hotPicks.map((pick, idx) => (
                        <div key={`pick-${idx}`} className="flex items-center gap-2">
                            <span className="text-slate-300">{pick.name}</span>
                            <span className={pick.type === 'HOT' ? 'text-red-500' : 'text-blue-500'}>
                                {pick.change}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
                @keyframes ticker {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-ticker {
                    display: flex;
                    animation: ticker 30s linear infinite;
                }
                .animate-ticker:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </div>
    );
}
