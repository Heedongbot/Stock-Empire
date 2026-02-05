'use client';

import { useState, useEffect } from 'react';
import { Lock, Crown, TrendingUp, Target, ShieldAlert, Zap, Key } from 'lucide-react';
import { translations } from '@/lib/translations';

interface VVIPPick {
    ticker: string;
    name: string;
    price: string;
    target: string;
    stop: string;
    reason: string;
    impact?: string;
    sector?: string;
    signal?: string;
    confidence?: number;
}

import { AIPerformanceBanner } from './AIPerformanceBanner';

export function VVIPZone({ lang = 'ko' }: { lang?: 'ko' | 'en' }) {
    const [isVVIP, setIsVVIP] = useState(false); // Default to locked
    const [picks, setPicks] = useState<VVIPPick[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const t = translations[lang].vvipZone;

    // 실시간 데이터 페칭
    useEffect(() => {
        const fetchPicks = async () => {
            try {
                const response = await fetch('/api/vvip-picks');
                const result = await response.json();

                if (result.success && result.data) {
                    setPicks(result.data);
                }
                setIsLoading(false);
            } catch (error) {
                console.error('Failed to fetch VVIP picks:', error);
                setIsLoading(false);
            }
        };

        // 초기 로드
        fetchPicks();

        // 3초마다 자동 업데이트 (티커용 효과)
        const interval = setInterval(fetchPicks, 10000); // 10초로 변경 (API 부하 감소)

        return () => clearInterval(interval);
    }, []);

    return (
        <section className="mb-12">

            {/* AI Performance Dashboard (New) */}
            <AIPerformanceBanner lang={lang} />

            <div className="relative overflow-hidden rounded-3xl border border-yellow-500/30 bg-gradient-to-b from-slate-900 to-slate-950 p-8 shadow-2xl">
                {/* Dev/Admin Toggle for User Testing */}
                <button
                    onClick={() => setIsVVIP(!isVVIP)}
                    className="absolute top-4 right-4 z-50 p-2 bg-slate-800/50 hover:bg-slate-700/80 rounded-lg text-slate-500 hover:text-white transition-all text-xs flex items-center gap-2 border border-slate-700"
                    title="Admin: Toggle VVIP View"
                >
                    <Key size={14} />
                    {isVVIP ? (lang === 'ko' ? '일반인 시전' : 'View as FREE') : (lang === 'ko' ? 'VVIP 시점' : 'View as VVIP')}
                </button>
                {/* Background Glow */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-yellow-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-yellow-500/20 rounded-xl border border-yellow-500/50">
                                <Crown className="w-8 h-8 text-yellow-400" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600">
                                    {t.title}
                                </h2>
                                <p className="text-slate-400 text-sm font-medium">
                                    {t.subtitle}
                                </p>
                            </div>
                        </div>
                        <a href="/vvip/analyzer" className="hidden md:flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-yellow-400 font-bold transition-all hover:scale-105 shadow-lg group">
                            <Zap className="group-hover:text-white transition-colors" />
                            <span>{t.launchAnalyzer}</span>
                        </a>
                    </div>


                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {isLoading ? (
                            // 로딩 상태
                            [1, 2, 3].map((i) => (
                                <div key={i} className="p-6 rounded-2xl border border-slate-800 bg-slate-900/50 animate-pulse">
                                    <div className="h-20 bg-slate-800 rounded mb-4"></div>
                                    <div className="h-4 bg-slate-800 rounded mb-2"></div>
                                    <div className="h-4 bg-slate-800 rounded w-2/3"></div>
                                </div>
                            ))
                        ) : picks.length > 0 ? (
                            // 실시간 데이터 렌더링
                            picks.map((pick, index) => (
                                <StockCard
                                    key={pick.ticker + index}
                                    isVVIP={isVVIP}
                                    ticker={pick.ticker}
                                    name={pick.name}
                                    price={pick.price}
                                    target={pick.target}
                                    stop={pick.stop}
                                    reason={pick.reason}
                                    signal={pick.signal}
                                    confidence={pick.confidence}
                                    t={t}
                                />
                            ))
                        ) : (
                            // 데이터 없음
                            <div className="col-span-3 text-center py-12 text-slate-500">
                                <p className="text-sm">실시간 데이터를 불러오는 중입니다...</p>
                            </div>
                        )}
                    </div>

                    {/* VVIP CTA Overlay (Mobile Only or Bottom) */}
                    {!isVVIP && (
                        <div className="mt-8 flex justify-center">
                            <button className="group relative px-8 py-4 bg-gradient-to-r from-yellow-600 to-yellow-400 rounded-xl font-black text-slate-900 shadow-lg hover:shadow-yellow-500/50 transition-all active:scale-95">
                                <span className="flex items-center gap-2">
                                    <Lock className="w-5 h-5" />
                                    {t.unlockPicks}
                                </span>
                                <div className="absolute inset-0 rounded-xl bg-white/30 blur opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                        </div>
                    )}

                    {/* Legal Disclaimer */}
                    <div className="mt-8 pt-6 border-t border-slate-800 text-center">
                        <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                            <ShieldAlert className="inline w-3 h-3 mr-1 mb-0.5" />
                            <span className="font-bold text-slate-400">DISCLAIMER:</span> {lang === 'ko' ? '본 서비스에서 제공하는 모든 AI 분석 정보는 투자 판단을 위한 참고 자료일 뿐이며, 투자의 최종 책임은 투자자 본인에게 있습니다. 과거의 수익률이 미래의 수익을 보장하지 않습니다.' : 'All AI analysis information provided by this service is for reference only for investment decisions, and the final responsibility for investment lies with the investor themselves. Past returns do not guarantee future profits.'}
                            <br className="hidden md:block" />
                            {lang === 'ko' ? '우리는 공인된 금융 어드바이저가 아닙니다. 모든 거래에는 리스크가 수반됩니다.' : 'We are not a licensed financial advisor. All trading involves risk.'}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}

// --- StockCard Component ---
function StockCard({ isVVIP, ticker, name, price, target, stop, reason, signal, confidence, t }: any) {
    const isBuy = signal?.includes('BUY');
    const badgeColor = isBuy ? 'bg-green-500 text-green-950' : 'bg-red-500 text-white';

    return (
        <div className={`relative group p-6 rounded-2xl border ${isVVIP ? 'border-yellow-500/50 bg-slate-800/50' : 'border-slate-800 bg-slate-900/50'} transition-all hover:border-yellow-500/30 overflow-hidden`}>

            {/* Signal Badge (Absolute Top Right) */}
            {isVVIP && signal && (
                <div className={`absolute top-0 right-0 px-4 py-1.5 rounded-bl-xl font-black text-[10px] tracking-widest ${badgeColor} shadow-lg z-10`}>
                    {signal} <span className="opacity-70 font-medium">| {confidence}%</span>
                </div>
            )}

            {!isVVIP && (
                <div className="absolute inset-0 z-20 backdrop-blur-md bg-slate-900/60 rounded-2xl flex flex-col items-center justify-center p-6 text-center border border-slate-700/50">
                    <Lock className="w-10 h-10 text-yellow-500 mb-3 animate-pulse" />
                    <h3 className="text-xl font-bold text-white mb-1">{t.hiddenGem}</h3>
                    <p className="text-slate-400 text-[10px] sm:text-xs leading-tight">{t.upgradeToReveal}</p>
                </div>
            )}

            <div className="flex justify-between items-start mb-4 mt-2">
                <div>
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-700/50">{ticker}</span>
                    <h3 className="text-lg md:text-xl font-bold text-white mt-1 mb-0.5 truncate max-w-[150px]">{name}</h3>
                </div>
                <div className="text-right">
                    <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">{t.currentPrice}</div>
                    <div className="text-lg font-mono font-bold text-slate-200">${price}</div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-5">
                <div className={`flex flex-col p-2.5 rounded-lg border ${isVVIP ? 'bg-green-500/5 border-green-500/20' : 'bg-slate-800 border-slate-700 grayscale opacity-50'}`}>
                    <span className="text-[9px] font-black text-green-400 flex items-center gap-1 tracking-widest uppercase mb-0.5"><Target size={10} /> {t.targetPrice}</span>
                    <span className="font-mono font-bold text-base text-green-400">${target}</span>
                </div>
                <div className={`flex flex-col p-2.5 rounded-lg border ${isVVIP ? 'bg-red-500/5 border-red-500/20' : 'bg-slate-800 border-slate-700 grayscale opacity-50'}`}>
                    <span className="text-[9px] font-black text-red-400 flex items-center gap-1 tracking-widest uppercase mb-0.5"><ShieldAlert size={10} /> {t.stopPrice}</span>
                    <span className="font-mono font-bold text-base text-red-400">${stop}</span>
                </div>
            </div>

            <div className="text-[11px] text-slate-400 leading-relaxed border-t border-slate-800 pt-3 relative">
                <span className="text-yellow-500 font-black mr-1 uppercase tracking-tighter text-[10px]">{t.aiRationale}</span>
                <span className="line-clamp-3">{reason}</span>
            </div>
        </div>
    );
}
