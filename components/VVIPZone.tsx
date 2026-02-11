'use client';

import { useState, useEffect } from 'react';
import { Lock, Crown, TrendingUp, Target, ShieldAlert, Zap, Key, Star, Search } from 'lucide-react';
import { translations } from '@/lib/translations';
import { AIPerformanceBanner } from './AIPerformanceBanner';

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

export function VVIPZone({ lang = 'ko' }: { lang?: 'ko' | 'en' }) {
    const [isVVIP, setIsVVIP] = useState(false); // Default to locked
    const [picks, setPicks] = useState<VVIPPick[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const t: any = (translations as any)[lang]?.vvipZone || (translations['ko'] as any).vvipZone;

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

        // 10초마다 자동 업데이트
        const interval = setInterval(fetchPicks, 10000);

        return () => clearInterval(interval);
    }, []);

    return (
        <section className="mb-12">

            {/* AI Performance Dashboard (New) */}
            <AIPerformanceBanner lang={lang} />

            <div className="relative overflow-hidden rounded-[2.5rem] border border-yellow-300 bg-gradient-to-br from-yellow-50 via-white to-yellow-50 p-8 shadow-xl shadow-yellow-500/10">
                {/* Dev/Admin Toggle for User Testing */}
                <button
                    onClick={() => setIsVVIP(!isVVIP)}
                    className="absolute top-6 right-6 z-50 p-2 bg-white/80 hover:bg-white rounded-xl text-yellow-600 hover:text-yellow-700 transition-all text-xs flex items-center gap-2 border border-yellow-300 shadow-sm"
                    title="Admin: Toggle PRO View"
                >
                    <Key size={14} />
                    {isVVIP ? (lang === 'ko' ? '🔒 잠금 모드 보기' : 'View as Locked') : (lang === 'ko' ? '🔓 VIP 모드 보기' : 'View as VIP')}
                </button>

                {/* Background Decoration */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-yellow-400/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                <div className="relative z-10">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-6">
                        <div className="flex items-center gap-4">
                            <div className="p-4 bg-yellow-100 rounded-2xl border border-yellow-300 shadow-inner">
                                <Crown className="w-8 h-8 text-yellow-600" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-black italic tracking-tighter text-slate-900">
                                    {t.title}
                                </h2>
                                <p className="text-slate-500 text-sm font-bold mt-1">
                                    {t.subtitle}
                                </p>
                            </div>
                        </div>
                        <a href="/vvip/analyzer" className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black transition-all hover:scale-105 shadow-xl shadow-slate-900/10 group text-xs uppercase tracking-widest">
                            <Zap className="w-4 h-4 text-yellow-400 group-hover:text-yellow-300 transition-colors" />
                            <span>{t.launchAnalyzer}</span>
                        </a>
                    </div>


                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {isLoading ? (
                            // 로딩 상태
                            [1, 2, 3].map((i) => (
                                <div key={i} className="p-6 md:p-8 rounded-[2rem] border border-slate-200 bg-white animate-pulse shadow-sm">
                                    <div className="h-16 bg-slate-200 rounded-2xl mb-4"></div>
                                    <div className="h-4 bg-slate-200 rounded mb-2 w-1/2"></div>
                                    <div className="h-4 bg-slate-200 rounded w-3/4"></div>
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
                            <div className="col-span-3 text-center py-20 bg-white rounded-[2.5rem] border border-slate-300 shadow-sm">
                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Search className="w-6 h-6 text-slate-400" />
                                </div>
                                <p className="text-slate-500 font-bold">현재 분석 중인 실시간 데이터가 없습니다.</p>
                            </div>
                        )}
                    </div>

                    {/* VVIP CTA Overlay (Mobile Only or Bottom) */}
                    {!isVVIP && (
                        <div className="mt-10 flex justify-center">
                            <button className="group relative px-10 py-5 bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-2xl font-black text-white shadow-xl shadow-yellow-500/30 hover:shadow-yellow-500/50 transition-all active:scale-95 hover:-translate-y-1 w-full md:w-auto">
                                <span className="flex items-center justify-center gap-3 text-sm tracking-wide">
                                    <Lock className="w-5 h-5" />
                                    {t.unlockPicks}
                                </span>
                                <div className="absolute inset-0 rounded-2xl bg-white/20 blur opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                        </div>
                    )}

                    {/* Legal Disclaimer */}
                    <div className="mt-12 pt-8 border-t border-yellow-200/50 text-center">
                        <p className="text-[10px] text-slate-400 font-medium leading-relaxed max-w-3xl mx-auto">
                            <ShieldAlert className="inline w-3 h-3 mr-1 mb-0.5 text-slate-300" />
                            <span className="font-bold text-slate-500">DISCLAIMER:</span> {lang === 'ko' ? '본 서비스에서 제공하는 모든 AI 분석 정보는 투자 판단을 위한 참고 자료일 뿐이며, 투자의 최종 책임은 투자자 본인에게 있습니다. 과거의 수익률이 미래의 수익을 보장하지 않습니다.' : 'All AI analysis information provided by this service is for reference only for investment decisions, and the final responsibility for investment lies with the investor themselves. Past returns do not guarantee future profits.'}
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
    const badgeColor = isBuy ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200';

    return (
        <div className={`relative group p-6 md:p-8 rounded-[2rem] border transition-all duration-300 overflow-hidden ${isVVIP
            ? 'bg-white border-yellow-200 hover:border-yellow-400 hover:shadow-xl hover:shadow-yellow-500/10 hover:-translate-y-1'
            : 'bg-white border-slate-300 opacity-90'}`}>

            {/* Signal Badge (Absolute Top Right) */}
            {isVVIP && signal && (
                <div className={`absolute top-6 right-6 px-3 py-1 rounded-full font-black text-[10px] tracking-widest border ${badgeColor} flex items-center gap-1`}>
                    {isBuy ? <TrendingUp className="w-3 h-3" /> : <TrendingUp className="w-3 h-3 rotate-180" />}
                    {signal} <span className="opacity-50">|</span> {confidence}%
                </div>
            )}

            {!isVVIP && (
                <div className="absolute inset-0 z-20 backdrop-blur-md bg-white/60 flex flex-col items-center justify-center p-8 text-center border border-white/50 rounded-[2rem]">
                    <div className="w-16 h-16 bg-yellow-50 rounded-2xl flex items-center justify-center mb-4 shadow-sm border border-yellow-200">
                        <Lock className="w-8 h-8 text-yellow-500" />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mb-2 border border-transparent">{t.hiddenGem}</h3>
                    <p className="text-slate-500 text-xs font-bold leading-relaxed">{t.upgradeToReveal}</p>
                </div>
            )}

            <div className="flex flex-col items-start mb-6">
                <span className="text-[10px] font-black text-slate-400 bg-slate-50 px-2 py-1 rounded-lg mb-2 border border-slate-200">{ticker}</span>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-tight mb-1 truncate w-full">{name}</h3>
                <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-slate-900 tracking-tighter">${price}</span>
                    <span className="text-xs font-bold text-slate-400">USD</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className={`flex flex-col p-4 rounded-2xl border ${isVVIP ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-200'}`}>
                    <span className="text-[9px] font-black text-green-600 flex items-center gap-1 tracking-widest uppercase mb-1"><Target size={12} /> {t.targetPrice}</span>
                    <span className="font-black text-lg text-green-700">${target}</span>
                </div>
                <div className={`flex flex-col p-4 rounded-2xl border ${isVVIP ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-200'}`}>
                    <span className="text-[9px] font-black text-red-500 flex items-center gap-1 tracking-widest uppercase mb-1"><ShieldAlert size={12} /> {t.stopPrice}</span>
                    <span className="font-black text-lg text-red-600">${stop}</span>
                </div>
            </div>

            <div className="pt-4 border-t border-slate-200">
                <div className="flex items-center gap-2 mb-2">
                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                    <span className="text-[10px] font-black text-yellow-600 uppercase tracking-widest">{t.aiRationale}</span>
                </div>
                <p className="text-sm text-slate-600 font-medium leading-relaxed line-clamp-3">
                    {reason}
                </p>
            </div>
        </div>
    );
}
