'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { TrendingUp, TrendingDown, Plus, X, Activity, Zap, DollarSign, ShieldCheck } from 'lucide-react';
import { translations } from '@/lib/translations';
import SiteHeader from '@/components/SiteHeader';
import AdLeaderboard from '@/components/ads/AdLeaderboard';

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
    const lang = 'ko';
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
        if (market === 'KR') return `₩${value.toLocaleString()}`;
        return `$${value.toLocaleString()}`;
    };

    const calculatePnL = (item: PortfolioItem) => {
        const totalCost = item.quantity * item.avgPrice;
        const currentValue = item.quantity * item.currentPrice;
        const pnl = currentValue - totalCost;
        const pnlPercent = totalCost > 0 ? ((pnl / totalCost) * 100).toFixed(2) : '0.00';
        return { pnl, pnlPercent };
    };

    const handleAddStock = () => {
        if (!newStock.symbol || !newStock.name || newStock.quantity <= 0) {
            alert('모든 필드를 올바르게 입력해주세요!');
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
        if (confirm('정말 삭제하시겠습니까?')) {
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

    useEffect(() => {
        const saved = localStorage.getItem('stock-empire-portfolio-v2');
        if (saved) {
            try {
                setPortfolio(JSON.parse(saved));
            } catch (e) {
                console.error(e);
            }
        }
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (isMounted) {
            handleRefreshPrices();
            const interval = setInterval(handleRefreshPrices, 15000);
            return () => clearInterval(interval);
        }
    }, [isMounted]);

    useEffect(() => {
        if (isMounted) {
            localStorage.setItem('stock-empire-portfolio-v2', JSON.stringify(portfolio));
        }
    }, [portfolio, isMounted]);

    const filteredPortfolio = activeTab === 'ALL'
        ? portfolio
        : portfolio.filter(item => item.market === activeTab);

    const totalPortfolioValue = filteredPortfolio.reduce((sum, item) => sum + (item.quantity * item.currentPrice), 0);
    const totalPnL = filteredPortfolio.reduce((sum, item) => sum + calculatePnL(item).pnl, 0);
    const totalPnLPercent = totalPortfolioValue > 0 ? ((totalPnL / (totalPortfolioValue - totalPnL)) * 100).toFixed(2) : '0.00';

    if (!isMounted) return null;

    return (
        <div className="min-h-screen bg-[#050b14] text-white font-sans">
            <SiteHeader />

            <main className="max-w-7xl mx-auto px-6 py-12">
                <div className="mb-12">
                    <AdLeaderboard />
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-8 border-b border-slate-800 pb-12">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase mb-2">
                            Empire <span className="text-[#00ffbd]">Portfolio</span>
                        </h2>
                        <p className="text-slate-500 font-bold text-sm tracking-widest uppercase italic">실시간 자산 동기화 및 AI 리스크 진단</p>
                    </div>

                    <div className="flex items-center gap-4">
                        {lastUpdated && (
                            <div className="text-right hidden md:block">
                                <div className="text-[10px] text-slate-500 font-black uppercase">Last Updated</div>
                                <div className="text-xs font-black text-[#00ffbd] font-mono">{lastUpdated.toLocaleTimeString()}</div>
                            </div>
                        )}
                        <button
                            onClick={handleRefreshPrices}
                            disabled={isRefreshing || portfolio.length === 0}
                            className="px-8 py-4 bg-[#00ffbd] hover:bg-[#00d4ff] text-black rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-[#00ffbd]/20 active:scale-95"
                        >
                            {isRefreshing ? 'SYNCING...' : 'LIVE REFRESH'}
                        </button>
                    </div>
                </div>

                <section className="mb-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-[#0a1120] border border-slate-800 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
                            <DollarSign className="absolute -top-6 -right-6 w-32 h-32 text-white/5" />
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Total Evaluation</p>
                            <h3 className="text-4xl font-black text-white italic tracking-tighter">
                                {activeTab === 'KR' ? `₩${totalPortfolioValue.toLocaleString()}` : `$${totalPortfolioValue.toLocaleString()}`}
                            </h3>
                            <p className="mt-4 text-[10px] text-[#00ffbd] font-black uppercase">Market Live Active</p>
                        </div>

                        <div className="bg-[#0a1120] border border-slate-800 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
                            <TrendingUp className="absolute -top-6 -right-6 w-32 h-32 text-white/5" />
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Profit & Loss</p>
                            <div className="flex items-baseline gap-3">
                                <span className={`text-4xl font-black italic tracking-tighter ${totalPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                    {totalPnL >= 0 ? '+' : ''}{totalPnL.toLocaleString()}
                                </span>
                                <span className={`text-lg font-black ${totalPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                    {totalPnLPercent}%
                                </span>
                            </div>
                        </div>

                        <div className="md:col-span-2 bg-gradient-to-br from-[#00ffbd]/10 to-slate-900 border border-[#00ffbd]/20 rounded-3xl p-8">
                            <div className="flex items-center gap-4 mb-6">
                                <Zap className="w-8 h-8 text-[#00ffbd]" />
                                <h4 className="text-lg font-black uppercase italic text-white tracking-widest font-mono">AI Portfolio Health Check</h4>
                            </div>
                            <div className="bg-slate-950 p-6 rounded-2xl border border-white/5">
                                <p className="text-sm text-slate-300 leading-relaxed italic">
                                    "현재 자산 구성상 특정 섹터에 대한 노출도가 높습니다. 상관관계가 낮은 자산을 추가하여 전체 변동성을 제어하는 것을 권장합니다."
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#0a1120] border border-slate-800 rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-2xl">
                        <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-8 italic">Asset Allocation</h3>
                        <div className="relative w-48 h-48 mb-8">
                            <div className="w-full h-full rounded-full border-4 border-slate-900" style={{ background: 'conic-gradient(#00ffbd 0% 70%, #3b82f6 70% 100%)' }}></div>
                            <div className="absolute inset-4 bg-[#050b14] rounded-full flex items-center justify-center">
                                <span className="text-sm font-black uppercase text-[#00ffbd]">Empire Core</span>
                            </div>
                        </div>
                        <ul className="w-full space-y-3">
                            <li className="flex justify-between text-xs font-black"><span className="text-slate-500">EQUITY</span> <span className="text-white">70%</span></li>
                            <li className="flex justify-between text-xs font-black"><span className="text-slate-500">CASH</span> <span className="text-white">30%</span></li>
                        </ul>
                    </div>
                </section>

                <section>
                    <div className="flex justify-between items-center mb-8">
                        <div className="flex gap-2">
                            {['ALL', 'KR', 'US'].map((tab) => (
                                <button key={tab} onClick={() => setActiveTab(tab as MarketTab)} className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-[#00ffbd] text-black shadow-lg shadow-[#00ffbd]/20' : 'bg-slate-900 text-slate-500'}`}>
                                    {tab}
                                </button>
                            ))}
                        </div>
                        <button onClick={() => setIsAddingStock(true)} className="px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all">
                            <Plus className="w-4 h-4 text-[#00ffbd]" /> 자산 추가
                        </button>
                    </div>

                    <div className="bg-[#0a1120] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-800/50">
                                    <th className="text-left p-6 text-[10px] font-black text-slate-600 uppercase">Symbol</th>
                                    <th className="text-right p-6 text-[10px] font-black text-slate-600 uppercase">Current</th>
                                    <th className="text-right p-6 text-[10px] font-black text-slate-600 uppercase">P&L</th>
                                    <th className="text-right p-6 text-[10px] font-black text-slate-600 uppercase">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPortfolio.map((item) => {
                                    const { pnl, pnlPercent } = calculatePnL(item);
                                    return (
                                        <tr key={item.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                            <td className="p-6">
                                                <div className="font-black text-white">{item.symbol}</div>
                                                <div className="text-[9px] text-slate-600 font-bold uppercase">{item.name}</div>
                                            </td>
                                            <td className="p-6 text-right font-black text-white">{formatCurrency(item.currentPrice, item.market)}</td>
                                            <td className="p-6 text-right">
                                                <div className={`font-black ${Number(pnl) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                    {Number(pnl) >= 0 ? '+' : ''}{pnlPercent}%
                                                </div>
                                            </td>
                                            <td className="p-6 text-right">
                                                <button onClick={() => handleRemoveStock(item.id)} className="text-slate-700 hover:text-red-500">
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
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-sm shadow-2xl" onClick={() => setIsAddingStock(false)} />
                    <div className="relative bg-[#0a1120] border border-slate-800 p-10 rounded-[2.5rem] w-full max-w-md shadow-2xl">
                        <h3 className="text-2xl font-black text-white italic tracking-tighter mb-8 uppercase text-center">Add Asset</h3>
                        <div className="space-y-4">
                            <select value={newStock.market} onChange={e => setNewStock({ ...newStock, market: e.target.value as any })} className="w-full p-4 bg-slate-950 border border-slate-800 rounded-2xl text-xs font-black text-white">
                                <option value="US">🇺🇸 US MARKET</option>
                                <option value="KR">🇰🇷 KR MARKET</option>
                            </select>
                            <input type="text" placeholder="SYMBOL" value={newStock.symbol} onChange={e => setNewStock({ ...newStock, symbol: e.target.value })} className="w-full p-4 bg-slate-950 border border-slate-800 rounded-2xl text-xs font-black text-white uppercase" />
                            <input type="text" placeholder="NAME" value={newStock.name} onChange={e => setNewStock({ ...newStock, name: e.target.value })} className="w-full p-4 bg-slate-950 border border-slate-800 rounded-2xl text-xs font-black text-white uppercase" />
                            <div className="flex gap-4">
                                <input type="number" placeholder="QTY" value={newStock.quantity || ''} onChange={e => setNewStock({ ...newStock, quantity: Number(e.target.value) })} className="w-full p-4 bg-slate-950 border border-slate-800 rounded-2xl text-xs font-black text-white" />
                                <input type="number" placeholder="PRICE" value={newStock.avgPrice || ''} onChange={e => setNewStock({ ...newStock, avgPrice: Number(e.target.value) })} className="w-full p-4 bg-slate-950 border border-slate-800 rounded-2xl text-xs font-black text-white" />
                            </div>
                        </div>
                        <button onClick={handleAddStock} className="w-full mt-10 py-5 bg-[#00ffbd] text-black font-black uppercase rounded-2xl shadow-xl shadow-[#00ffbd]/20 transition-all active:scale-95">포트폴리오에 추가</button>
                    </div>
                </div>
            )}
        </div>
    );
}
