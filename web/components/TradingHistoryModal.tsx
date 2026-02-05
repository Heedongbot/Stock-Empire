import { X, TrendingUp, TrendingDown, Minus, Calendar, Target, DollarSign } from 'lucide-react';

interface TradingRecord {
    id: string;
    symbol: string;
    action: 'BUY' | 'SELL' | 'HOLD';
    entryPrice: number;
    targetPrice?: number;
    stopLoss?: number;
    currentPrice: number;
    profitLoss: number;
    profitPercent: number;
    timestamp: string;
    status: 'WIN' | 'DRAW' | 'LOSE';
}

interface TradingHistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    lang?: 'ko' | 'en';
}

// Mock data - 실제로는 API에서 가져와야 함
const mockTradingHistory: TradingRecord[] = [
    { id: '1', symbol: 'NVDA', action: 'BUY', entryPrice: 680.20, targetPrice: 750.00, stopLoss: 650.00, currentPrice: 725.50, profitLoss: 45.30, profitPercent: 8.4, timestamp: '3일 전', status: 'WIN' },
    { id: '2', symbol: 'TSLA', action: 'SELL', entryPrice: 190.50, currentPrice: 185.40, profitLoss: 5.10, profitPercent: 4.2, timestamp: '3일 전', status: 'WIN' },
    { id: '3', symbol: 'AAPL', action: 'HOLD', entryPrice: 175.30, currentPrice: 174.80, profitLoss: -0.50, profitPercent: -0.5, timestamp: '1주일 전', status: 'DRAW' },
    { id: '4', symbol: 'BTC', action: 'BUY', entryPrice: 75000, stopLoss: 70000, currentPrice: 88500, profitLoss: 13500, profitPercent: 12.1, timestamp: '1주일 전', status: 'WIN' },
    { id: '5', symbol: 'GOOGL', action: 'BUY', entryPrice: 145.20, targetPrice: 160.00, currentPrice: 142.80, profitLoss: -2.40, profitPercent: -1.8, timestamp: '2주 전', status: 'LOSE' },
    { id: '6', symbol: 'AMZN', action: 'BUY', entryPrice: 168.50, currentPrice: 172.30, profitLoss: 3.80, profitPercent: 2.8, timestamp: '2주 전', status: 'WIN' },
];

export function TradingHistoryModal({ isOpen, onClose, lang = 'ko' }: TradingHistoryModalProps) {
    if (!isOpen) return null;

    const t = {
        ko: {
            title: 'AI 실시간 성적표 - 전체 거래 내역',
            close: '닫기',
            symbol: '종목',
            action: '액션',
            entry: '진입가',
            current: '현재가',
            target: '목표가',
            stop: '손절가',
            profit: '수익',
            time: '시점',
            status: '상태',
            win: '승',
            draw: '무',
            lose: '패',
            buy: '매수',
            sell: '매도',
            hold: '홀드',
            summary: '거래 요약',
            totalTrades: '총 거래',
            winRate: '승률',
            avgProfit: '평균 수익률',
        },
        en: {
            title: 'AI Live Performance - Full Trading History',
            close: 'Close',
            symbol: 'Symbol',
            action: 'Action',
            entry: 'Entry',
            current: 'Current',
            target: 'Target',
            stop: 'Stop',
            profit: 'P/L',
            time: 'Time',
            status: 'Status',
            win: 'Win',
            draw: 'Draw',
            lose: 'Loss',
            buy: 'BUY',
            sell: 'SELL',
            hold: 'HOLD',
            summary: 'Summary',
            totalTrades: 'Total Trades',
            winRate: 'Win Rate',
            avgProfit: 'Avg Return',
        }
    };

    const translations = t[lang];

    // Calculate stats
    const wins = mockTradingHistory.filter(r => r.status === 'WIN').length;
    const totalTrades = mockTradingHistory.length;
    const winRate = ((wins / totalTrades) * 100).toFixed(1);
    const avgProfit = (mockTradingHistory.reduce((sum, r) => sum + r.profitPercent, 0) / totalTrades).toFixed(1);

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-fade-in">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/90 backdrop-blur-md"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="bg-[#0a0f1a] border border-slate-700 w-full max-w-5xl rounded-3xl shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto flex flex-col z-10">
                {/* Header */}
                <div className="sticky top-0 z-20 bg-gradient-to-r from-slate-900/95 via-blue-900/95 to-slate-900/95 backdrop-blur border-b border-slate-700 p-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-black text-white">{translations.title}</h2>
                        <p className="text-slate-400 text-sm mt-1">
                            {translations.summary}: {translations.totalTrades} {totalTrades} | {translations.winRate} {winRate}% | {translations.avgProfit} {avgProfit > 0 ? '+' : ''}{avgProfit}%
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 bg-slate-800 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Table */}
                <div className="p-6">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-800">
                                    <th className="text-left p-3 text-slate-500 font-bold text-xs uppercase tracking-widest">{translations.symbol}</th>
                                    <th className="text-left p-3 text-slate-500 font-bold text-xs uppercase tracking-widest">{translations.action}</th>
                                    <th className="text-right p-3 text-slate-500 font-bold text-xs uppercase tracking-widest">{translations.entry}</th>
                                    <th className="text-right p-3 text-slate-500 font-bold text-xs uppercase tracking-widest">{translations.current}</th>
                                    <th className="text-right p-3 text-slate-500 font-bold text-xs uppercase tracking-widest">{translations.target}</th>
                                    <th className="text-right p-3 text-slate-500 font-bold text-xs uppercase tracking-widest">{translations.stop}</th>
                                    <th className="text-right p-3 text-slate-500 font-bold text-xs uppercase tracking-widest">{translations.profit}</th>
                                    <th className="text-center p-3 text-slate-500 font-bold text-xs uppercase tracking-widest">{translations.status}</th>
                                    <th className="text-right p-3 text-slate-500 font-bold text-xs uppercase tracking-widest">{translations.time}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {mockTradingHistory.map((record) => (
                                    <tr key={record.id} className="border-b border-slate-800/50 hover:bg-slate-900/50 transition-colors">
                                        <td className="p-3">
                                            <span className="font-mono font-bold text-white">{record.symbol}</span>
                                        </td>
                                        <td className="p-3">
                                            <span className={`px-2 py-1 rounded text-xs font-black ${record.action === 'BUY' ? 'bg-green-500/20 text-green-400' :
                                                    record.action === 'SELL' ? 'bg-red-500/20 text-red-400' :
                                                        'bg-slate-500/20 text-slate-400'
                                                }`}>
                                                {translations[record.action.toLowerCase() as 'buy' | 'sell' | 'hold']}
                                            </span>
                                        </td>
                                        <td className="p-3 text-right font-mono text-slate-300">${record.entryPrice.toLocaleString()}</td>
                                        <td className="p-3 text-right font-mono text-white font-bold">${record.currentPrice.toLocaleString()}</td>
                                        <td className="p-3 text-right font-mono text-slate-400">
                                            {record.targetPrice ? `$${record.targetPrice.toLocaleString()}` : '-'}
                                        </td>
                                        <td className="p-3 text-right font-mono text-slate-400">
                                            {record.stopLoss ? `$${record.stopLoss.toLocaleString()}` : '-'}
                                        </td>
                                        <td className="p-3 text-right">
                                            <div className="flex flex-col items-end">
                                                <span className={`font-mono font-bold ${record.profitLoss > 0 ? 'text-green-400' :
                                                        record.profitLoss < 0 ? 'text-red-400' :
                                                            'text-slate-400'
                                                    }`}>
                                                    {record.profitLoss > 0 ? '+' : ''}{record.profitLoss.toFixed(2)}
                                                </span>
                                                <span className={`text-xs font-bold ${record.profitPercent > 0 ? 'text-green-400' :
                                                        record.profitPercent < 0 ? 'text-red-400' :
                                                            'text-slate-400'
                                                    }`}>
                                                    {record.profitPercent > 0 ? '+' : ''}{record.profitPercent}%
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-3 text-center">
                                            <span className={`px-2 py-1 rounded-full text-xs font-black flex items-center justify-center gap-1 ${record.status === 'WIN' ? 'bg-green-500/20 text-green-400' :
                                                    record.status === 'LOSE' ? 'bg-red-500/20 text-red-400' :
                                                        'bg-slate-500/20 text-slate-400'
                                                }`}>
                                                {record.status === 'WIN' ? <TrendingUp className="w-3 h-3" /> :
                                                    record.status === 'LOSE' ? <TrendingDown className="w-3 h-3" /> :
                                                        <Minus className="w-3 h-3" />}
                                                {translations[record.status.toLowerCase() as 'win' | 'draw' | 'lose']}
                                            </span>
                                        </td>
                                        <td className="p-3 text-right text-slate-500 text-xs">{record.timestamp}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer Stats */}
                    <div className="mt-8 grid grid-cols-3 gap-4">
                        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
                            <div className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">{translations.totalTrades}</div>
                            <div className="text-2xl font-black text-white">{totalTrades}</div>
                        </div>
                        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                            <div className="text-green-400 text-xs font-bold uppercase tracking-widest mb-1">{translations.winRate}</div>
                            <div className="text-2xl font-black text-green-400">{winRate}%</div>
                        </div>
                        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                            <div className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-1">{translations.avgProfit}</div>
                            <div className={`text-2xl font-black ${Number(avgProfit) > 0 ? 'text-blue-400' : 'text-red-400'}`}>
                                {avgProfit > 0 ? '+' : ''}{avgProfit}%
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
