'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, PieChart, ArrowUpRight, ArrowDownRight, Briefcase } from 'lucide-react';

export default function LivePortfolioWidget() {
    const [portfolio, setPortfolio] = useState({
        totalValue: 124500000, // 1억 2450만
        totalReturn: 24500000,
        returnRate: 24.5,
        dailyChange: 1250000,
        dailyRate: 1.02,
        holdings: [
            { symbol: 'NVDA', name: 'NVIDIA', shares: 50, price: 845.30, avgPrice: 650.00, change: 2.5 },
            { symbol: 'TSLA', name: 'Tesla', shares: 100, price: 184.20, avgPrice: 210.00, change: -1.2 },
            { symbol: 'AAPL', name: 'Apple', shares: 80, price: 185.50, avgPrice: 170.00, change: 0.8 },
            { symbol: 'SEC', name: '삼성전자', shares: 200, price: 75800, avgPrice: 71000, change: 1.5 },
        ]
    });

    useEffect(() => {
        // 실시간 가격 변동 시뮬레이션
        const interval = setInterval(() => {
            setPortfolio(prev => {
                const newHoldings = prev.holdings.map(item => {
                    const volatility = item.symbol === 'NVDA' ? 0.8 : 0.3; // 변동성 차등 적용
                    const changeAmount = (Math.random() - 0.45) * volatility; // 약간 우상향 바이어스
                    const newPrice = item.price + changeAmount;
                    const newChange = item.change + (changeAmount / item.price * 100);
                    return {
                        ...item,
                        price: newPrice,
                        change: newChange
                    };
                });

                // 전체 포트폴리오 가치 재계산
                const currentTotalValue = newHoldings.reduce((sum, item) => {
                    // USD 종목은 환율 1350원 가정
                    const priceInKRW = item.symbol === 'SEC' ? item.price : item.price * 1350;
                    return sum + (priceInKRW * item.shares);
                }, 0);

                const investedAmount = 100000000; // 원금 1억 가정
                const totalReturn = currentTotalValue - investedAmount;
                const returnRate = (totalReturn / investedAmount) * 100;
                const dailyChange = prev.dailyChange + (Math.random() - 0.5) * 50000;

                return {
                    ...prev,
                    totalValue: currentTotalValue,
                    totalReturn: totalReturn,
                    returnRate: returnRate,
                    dailyChange: dailyChange,
                    dailyRate: prev.dailyRate + (Math.random() - 0.5) * 0.05,
                    holdings: newHoldings
                };
            });
        }, 2000); // 2초마다 갱신

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="premium-card p-6 bg-slate-900/50 border border-slate-800 relative overflow-hidden group">
            {/* 배경 장식 */}
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <Briefcase className="w-32 h-32 text-blue-500" />
            </div>

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-blue-500/20 rounded-lg">
                            <PieChart className="w-5 h-5 text-blue-400" />
                        </div>
                        <h3 className="text-sm font-black text-slate-300 uppercase tracking-widest">Live Portfolio</h3>
                    </div>
                    <span className="flex items-center gap-1.5 px-2 py-1 bg-green-500/10 text-green-400 rounded text-[10px] font-bold animate-pulse">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                        REAL-TIME
                    </span>
                </div>

                {/* 총 자산 가치 */}
                <div className="mb-6">
                    <p className="text-xs text-slate-500 font-bold uppercase mb-1">Total Assets</p>
                    <div className="flex items-baseline gap-3">
                        <h2 className="text-3xl font-black text-white tracking-tight">
                            ₩{Math.floor(portfolio.totalValue).toLocaleString()}
                        </h2>
                        <span className={`flex items-center text-sm font-bold ${portfolio.returnRate >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {portfolio.returnRate >= 0 ? '+' : ''}{portfolio.returnRate.toFixed(2)}%
                            {portfolio.returnRate >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                        </span>
                    </div>
                    <p className={`text-xs font-bold mt-1 ${portfolio.dailyChange >= 0 ? 'text-green-500/80' : 'text-red-500/80'}`}>
                        오늘 변동: ₩{Math.floor(portfolio.dailyChange).toLocaleString()} ({portfolio.dailyRate >= 0 ? '+' : ''}{portfolio.dailyRate.toFixed(2)}%)
                    </p>
                </div>

                {/* 보유 종목 리스트 (간략) */}
                <div className="space-y-3">
                    {portfolio.holdings.map((stock) => (
                        <div key={stock.symbol} className="flex items-center justify-between p-2 bg-slate-950/50 rounded-lg border border-slate-800/50 hover:border-slate-700 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className={`w-1 h-8 rounded-full ${stock.change >= 0 ? 'bg-green-500' : 'bg-red-500'}`} />
                                <div>
                                    <p className="text-xs font-black text-white">{stock.symbol}</p>
                                    <p className="text-[10px] text-slate-500">{stock.name}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="flex items-center justify-end gap-2">
                                    <p className="text-xs font-bold text-slate-200">
                                        {stock.symbol === 'SEC' ? '₩' : '$'}{stock.price.toLocaleString(undefined, { minimumFractionDigits: stock.symbol === 'SEC' ? 0 : 2, maximumFractionDigits: stock.symbol === 'SEC' ? 0 : 2 })}
                                    </p>
                                    <span className={`text-[10px] font-bold w-14 text-right ${stock.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                        {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <button className="w-full mt-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2">
                    View Full Portfolio <ArrowUpRight className="w-3 h-3" />
                </button>
            </div>
        </div>
    );
}
