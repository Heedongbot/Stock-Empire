'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { TrendingUp, TrendingDown, Plus, X, Search, DollarSign, Activity, Target, Zap, Globe, Flag } from 'lucide-react';
import { translations } from '@/lib/translations';
import SiteHeader from '@/components/SiteHeader';

interface PortfolioItem {
    id: string;
    symbol: string;
    name: string;
    quantity: number;
    avgPrice: number;
    currentPrice: number;
    market: 'KR' | 'US';
}

type MarketTab = 'ALL' | 'KR' | 'US';

export default function PortfolioPage() {
    const [lang, setLang] = useState<'ko' | 'en'>('ko');
    const t = translations[lang];

    const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
    const [activeTab, setActiveTab] = useState<MarketTab>('ALL');
    const [isAddingStock, setIsAddingStock] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    const [newStock, setNewStock] = useState({
        symbol: '',
        name: '',
        quantity: 0,
        avgPrice: 0,
        market: 'US' as 'KR' | 'US'
    });

    const formatCurrency = (value: number, market: 'KR' | 'US') => {
        if (market === 'KR') {
            return `₩${value.toLocaleString()}`;
        }
        return `$${value.toLocaleString()}`;
    };

    const calculatePnL = (item: PortfolioItem) => {
        const totalCost = item.quantity * item.avgPrice;
        const currentValue = item.quantity * item.currentPrice;
        const pnl = currentValue - totalCost;
        const pnlPercent = totalCost > 0 ? ((pnl / totalCost) * 100).toFixed(2) : '0.00';
        return { pnl, pnlPercent };
    };

    const handleAddStock = async () => {
        if (!newStock.symbol || !newStock.name || newStock.quantity <= 0) {
            alert(lang === 'ko' ? '모든 필드를 올바르게 입력해주세요!' : 'Please fill in all fields correctly!');
            return;
        }

        const newItem: PortfolioItem = {
            id: Date.now().toString(),
            symbol: newStock.symbol.toUpperCase(),
            name: newStock.name,
            quantity: newStock.quantity,
            avgPrice: newStock.avgPrice,
            currentPrice: newStock.avgPrice,
            market: newStock.market
        };

        setPortfolio([...portfolio, newItem]);
        setIsAddingStock(false);
        setNewStock({ symbol: '', name: '', quantity: 0, avgPrice: 0, market: 'US' });
    };

    const handleRemoveStock = (id: string) => {
        if (confirm(lang === 'ko' ? '정말 삭제하시겠습니까?' : 'Are you sure you want to delete this?')) {
            setPortfolio(portfolio.filter(item => item.id !== id));
        }
    };

    const handleRefreshPrices = async () => {
        if (portfolio.length === 0) return;
        setIsRefreshing(true);
        try {
            const updatedPortfolio = await Promise.all(
                portfolio.map(async (item) => {
                    try {
                        const response = await fetch(`/api/stock-price?symbol=${item.symbol}&market=${item.market}`);
                        const data = await response.json();
                        return { ...item, currentPrice: data.price };
                    } catch (error) {
                        return item;
                    }
                })
            );
            setPortfolio(updatedPortfolio);
            setLastUpdated(new Date());
        } catch (error) {
            console.error(error);
        } finally {
            setIsRefreshing(false);
        }
    };

    const [isLoaded, setIsLoaded] = useState(false); // 로컬스토리지 로드 완료 여부

    useEffect(() => {
        const saved = localStorage.getItem('stock-empire-portfolio-v2');
        if (saved) {
            try {
                setPortfolio(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to parse portfolio', e);
                setPortfolio([]);
            }
        }
        setIsMounted(true);
        setIsLoaded(true); // 로드 완료 플래그
    }, []);

    useEffect(() => {
        if (isMounted) {
            // 1. Initial Fetch on Load
            handleRefreshPrices();

            // 2. Auto-Refresh Loop (Every 10 seconds)
            const interval = setInterval(() => {
                handleRefreshPrices();
            }, 10000);

            return () => clearInterval(interval);
        }
    }, [isMounted]);

    // Update LocalStorage whenever portfolio changes (빈 배열이어도 저장)
    useEffect(() => {
        if (isLoaded) { // 초기 로드가 끝난 이후에만 저장 (덮어쓰기 방지)
            localStorage.setItem('stock-empire-portfolio-v2', JSON.stringify(portfolio));
        }
    }, [portfolio, isLoaded]);

    const filteredPortfolio = activeTab === 'ALL'
        ? portfolio
        : portfolio.filter(item => item.market === activeTab);

    const totalPortfolioValue = filteredPortfolio.reduce((sum, item) => {
        return sum + (item.quantity * item.currentPrice);
    }, 0);

    const totalPnL = filteredPortfolio.reduce((sum, item) => {
        const { pnl } = calculatePnL(item);
        return sum + pnl;
    }, 0);

    const totalPnLPercent = totalPortfolioValue > 0
        ? ((totalPnL / (totalPortfolioValue - totalPnL)) * 100).toFixed(2)
        : '0.00';

    if (!isMounted) return null;

    return (
        <div className="min-h-screen bg-[#0a0f1a] text-white">
            <SiteHeader lang={lang} setLang={setLang} />

            <main className="max-w-7xl mx-auto px-8 py-12">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        {lastUpdated && (
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-black text-slate-300">{t.stats.lastUpdate}:</span>
                                <span className="text-sm font-black text-white bg-slate-800 px-3 py-1 rounded-lg">
                                    {lastUpdated.toLocaleTimeString(lang === 'ko' ? 'ko-KR' : 'en-US')}
                                </span>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={handleRefreshPrices}
                        disabled={isRefreshing || portfolio.length === 0}
                        className="px-8 py-4 bg-green-600 hover:bg-green-500 disabled:bg-slate-700 disabled:cursor-not-allowed rounded-xl font-black text-base uppercase tracking-widest transition-all flex items-center gap-3 shadow-lg shadow-green-500/20"
                    >
                        <Activity className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                        {isRefreshing ? t.common.loading : t.common.refresh}
                    </button>
                </div>

                <section className="mb-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Key Metrics */}
                    <div className="lg:col-span-2 space-y-6">
                        <h2 className="text-2xl font-black italic tracking-tighter mb-6">{t.dashboard.portfolioSummary}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="premium-card p-8 bg-slate-900/50 border-blue-500/20 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <DollarSign className="w-24 h-24 text-blue-500" />
                                </div>
                                <div className="relative z-10">
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">{t.dashboard.totalValue}</p>
                                    <p className="text-4xl font-black text-white italic tracking-tight">
                                        {activeTab === 'KR' ? `₩${totalPortfolioValue.toLocaleString()}` : `$${totalPortfolioValue.toLocaleString()}`}
                                    </p>
                                    <div className="mt-4 flex items-center gap-2 text-xs font-bold text-slate-400">
                                        <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded">{lang === 'ko' ? '주문 가능' : 'Buying Power'}</span>
                                        <span>$42,500.00</span>
                                    </div>
                                </div>
                            </div>


                            <div className="premium-card p-8 bg-slate-900/50 border-green-500/20 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <TrendingUp className="w-24 h-24 text-green-500" />
                                </div>
                                <div className="relative z-10">
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">{t.dashboard.totalPnL}</p>
                                    <div className="flex items-baseline gap-3">
                                        <p className={`text-4xl font-black italic tracking-tight ${totalPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                            {totalPnL >= 0 ? '+' : ''}{totalPnL.toLocaleString()}
                                        </p>
                                        <span className={`text-lg font-bold ${totalPnLPercent.startsWith('-') ? 'text-red-500' : 'text-green-500'}`}>
                                            {totalPnLPercent}%
                                        </span>
                                    </div>
                                    <div className="mt-4 flex items-center gap-2 text-xs font-bold text-slate-400">
                                        <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded">{lang === 'ko' ? '일일 손익' : 'Daily P&L'}</span>
                                        <span>+$1,240.50 ({lang === 'ko' ? '예상' : 'Est'})</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* AI Diagnosis */}
                        <div className="premium-card p-8 bg-gradient-to-br from-indigo-900/40 to-slate-900 border-indigo-500/30">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/30">
                                    <Zap className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-white italic">{lang === 'ko' ? 'AI 포트폴리오 정밀 진단' : 'AI Portfolio Diagnosis'}</h3>
                                    <p className="text-xs text-indigo-400 font-bold uppercase tracking-widest">{lang === 'ko' ? 'DeepQuant® 엔진 구동 중' : 'Powered by DeepQuant Engine'}</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs font-bold text-slate-400 uppercase">{lang === 'ko' ? '분산 투자 점수' : 'Diversification Score'}</span>
                                        <span className="text-sm font-black text-yellow-500">42/100 ({lang === 'ko' ? '위험' : 'Risky'})</span>
                                    </div>
                                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                        <div className="bg-yellow-500 h-full w-[42%]"></div>
                                    </div>
                                    <p className="mt-3 text-sm text-slate-300 leading-relaxed">
                                        {lang === 'ko' ? (
                                            <>
                                                ⚠️ <strong>집중 투자 경고:</strong> 기술주(NVDA) 비중이 과도하게 높습니다. 변동성에 취약한 구조이니 경기 방어주나 채권 ETF를 편입하여 리스크를 헤지하십시오.
                                            </>
                                        ) : (
                                            <>
                                                ⚠️ <strong>Concentration Risk:</strong> Your portfolio is heavily weighted towards Tech (NVDA). Consider adding defensive sectors or bonds to hedge against volatility.
                                            </>
                                        )}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <button className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold text-xs uppercase tracking-widest transition-all shadow-lg shadow-indigo-500/20">
                                        {lang === 'ko' ? '자동 리밸런싱' : 'Rebalance Now'}
                                    </button>
                                    <button className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-bold text-xs uppercase tracking-widest transition-all">
                                        {lang === 'ko' ? '전체 리포트' : 'View Full Report'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Allocation Chart */}
                    <div className="premium-card p-8 bg-slate-900/50 border-slate-800 flex flex-col items-center justify-center text-center relative overflow-hidden">
                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-8">{lang === 'ko' ? '자산 배분 현황' : 'Asset Allocation'}</h3>

                        <div className="relative w-64 h-64 mb-8">
                            {/* Simple CSS Pie Chart simulation using conic-gradient */}
                            <div
                                className="w-full h-full rounded-full border-8 border-slate-900 shadow-2xl"
                                style={{
                                    background: `conic-gradient(
                                        #3b82f6 0% 60%, 
                                        #10b981 60% 85%, 
                                        #f59e0b 85% 100%
                                    )`
                                }}
                            ></div>
                            <div className="absolute inset-4 bg-[#0a0f1a] rounded-full flex flex-col items-center justify-center">
                                <span className="text-3xl font-black text-white">{lang === 'ko' ? '미국장' : 'US'}</span>
                                <span className="text-xs font-bold text-blue-500 uppercase tracking-widest">{lang === 'ko' ? '주식 60%' : 'Equity 60%'}</span>
                            </div>
                        </div>

                        <div className="w-full space-y-3">
                            <div className="flex items-center justify-between px-4 py-2 bg-slate-800/50 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                    <span className="text-xs font-bold text-slate-300">{t.dashboard.sectors.technology}</span>
                                </div>
                                <span className="text-xs font-black text-white">60%</span>
                            </div>
                            <div className="flex items-center justify-between px-4 py-2 bg-slate-800/50 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                    <span className="text-xs font-bold text-slate-300">{lang === 'ko' ? '반도체' : 'Semiconductors'}</span>
                                </div>
                                <span className="text-xs font-black text-white">25%</span>
                            </div>
                            <div className="flex items-center justify-between px-4 py-2 bg-slate-800/50 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                                    <span className="text-xs font-bold text-slate-300">Crypto</span>
                                </div>
                                <span className="text-xs font-black text-white">15%</span>
                            </div>
                        </div>
                    </div>
                </section>

                <section>
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <h2 className="text-2xl font-black italic tracking-tighter">{t.dashboard.return}</h2>
                            <div className="flex gap-2">
                                <button onClick={() => setActiveTab('ALL')} className={`px-4 py-2 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'ALL' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>ALL</button>
                                <button onClick={() => setActiveTab('KR')} className={`px-4 py-2 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'KR' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>KR</button>
                                <button onClick={() => setActiveTab('US')} className={`px-4 py-2 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'US' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>US</button>
                            </div>
                        </div>
                        <button onClick={() => setIsAddingStock(true)} className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-black text-sm uppercase tracking-widest transition-all flex items-center gap-2">
                            <Plus className="w-4 h-4" /> {t.dashboard.managePortfolio}
                        </button>
                    </div>

                    <div className="premium-card bg-slate-900/50 border-slate-800 overflow-hidden">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-800">
                                    <th className="text-left p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Symbol</th>
                                    <th className="text-left p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Name</th>
                                    <th className="text-right p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Qty</th>
                                    <th className="text-right p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Avg Price</th>
                                    <th className="text-right p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Current</th>
                                    <th className="text-right p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">P&L</th>
                                    <th className="text-right p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPortfolio.map((item) => {
                                    const { pnl, pnlPercent } = calculatePnL(item);
                                    return (
                                        <tr key={item.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                                            <td className="p-6 font-black text-white">{item.symbol}</td>
                                            <td className="p-6 text-slate-400 font-bold text-sm">{item.name}</td>
                                            <td className="p-6 text-right font-black text-white">{item.quantity}</td>
                                            <td className="p-6 text-right font-bold text-slate-400">{formatCurrency(item.avgPrice, item.market)}</td>
                                            <td className="p-6 text-right font-black text-white">{formatCurrency(item.currentPrice, item.market)}</td>
                                            <td className="p-6 text-right">
                                                <div className={`font-black ${Number(pnl) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                    {Number(pnl) >= 0 ? '+' : ''}{formatCurrency(pnl as number, item.market)}
                                                    <div className="text-xs opacity-60">({pnlPercent}%)</div>
                                                </div>
                                            </td>
                                            <td className="p-6 text-right">
                                                <button onClick={() => handleRemoveStock(item.id)} className="text-slate-500 hover:text-red-500 transition-colors">
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>

            {isAddingStock && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsAddingStock(false)} />
                    <div className="relative z-10 bg-slate-900 border border-slate-700 p-8 rounded-3xl max-w-md w-full shadow-2xl">
                        <button onClick={() => setIsAddingStock(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white">✕</button>
                        <h3 className="text-2xl font-black text-white italic tracking-tighter mb-8 text-center">{t.dashboard.managePortfolio}</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Market</label>
                                <select
                                    value={newStock.market}
                                    onChange={(e) => setNewStock({ ...newStock, market: e.target.value as 'KR' | 'US' })}
                                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white font-bold"
                                >
                                    <option value="US">🇺🇸 US Market</option>
                                    <option value="KR">🇰🇷 KR Market</option>
                                </select>
                            </div>
                            <input
                                type="text"
                                placeholder="Symbol (e.g. NVDA)"
                                value={newStock.symbol}
                                onChange={e => setNewStock({ ...newStock, symbol: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white font-bold"
                            />
                            <input
                                type="text"
                                placeholder="Name (e.g. NVIDIA)"
                                value={newStock.name}
                                onChange={e => setNewStock({ ...newStock, name: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white font-bold"
                            />
                            <div className="flex gap-4">
                                <input
                                    type="number"
                                    placeholder="Qty"
                                    value={newStock.quantity || ''}
                                    onChange={e => setNewStock({ ...newStock, quantity: Number(e.target.value) })}
                                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white font-bold"
                                />
                                <input
                                    type="number"
                                    placeholder="Avg Price"
                                    value={newStock.avgPrice || ''}
                                    onChange={e => setNewStock({ ...newStock, avgPrice: Number(e.target.value) })}
                                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white font-bold"
                                />
                            </div>
                        </div>

                        <button onClick={handleAddStock} className="w-full mt-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-xl uppercase tracking-widest transition-all">
                            {t.common.buy}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
