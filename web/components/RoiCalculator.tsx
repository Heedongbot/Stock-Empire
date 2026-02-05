'use client';

import { useState, useEffect } from 'react';
import { Calculator, DollarSign, TrendingUp, ArrowRight } from 'lucide-react';

export default function RoiCalculator({ lang = 'ko' }: { lang?: 'ko' | 'en' }) {
    const isKr = lang === 'ko';

    // Initial values based on currency
    const [investment, setInvestment] = useState(isKr ? 10000000 : 10000);
    const [monthlyReturn, setMonthlyReturn] = useState(5);
    const [period, setPeriod] = useState(12);

    // Reset investment when language changes
    useEffect(() => {
        setInvestment(isKr ? 10000000 : 10000);
    }, [isKr]);

    const calculateReturns = () => {
        let currentAmount = investment;
        for (let i = 0; i < period; i++) {
            currentAmount = currentAmount * (1 + monthlyReturn / 100);
        }
        return currentAmount;
    };

    const finalAmount = calculateReturns();
    const profit = finalAmount - investment;
    // VIP Cost: 19900 KRW or 29 USD
    const subscriptionCost = (isKr ? 9900 : 29) * period;
    const roi = (profit / subscriptionCost).toFixed(1);

    const formatMoney = (amount: number) => {
        if (isKr) return `₩${Math.floor(amount).toLocaleString()}`;
        return `$${Math.floor(amount).toLocaleString()}`;
    };

    const t = {
        label: {
            title: isKr ? "당신의 잠재 수익을 확인하세요" : "CHECK YOUR POTENTIAL PROFIT",
            subtitle: isKr ? "VIP 시스템을 활용했을 때의 복리 효과를 시뮬레이션합니다." : "Simulate the compound effect of using the VIP system.",
            invest_principal: isKr ? "투자 원금" : "PRINCIPAL INVESTMENT",
            target_return: isKr ? "목표 월 수익률 (VIP 평균 +8.5%)" : "TARGET MONTHLY RETURN (VIP AVG +8.5%)",
            period: isKr ? "투자 기간" : "INVESTMENT PERIOD",
            months: isKr ? "개월" : " Months",
            bank_rate: isKr ? "1% (예금)" : "1% (Bank)",
            pro_rate: isKr ? "20% (슈퍼개미)" : "20% (Pro)",
            profit_label: isKr ? "예상 순수익" : "ESTIMATED NET PROFIT",
            final_asset: isKr ? "최종 자산" : "Final Asset",
            value_title: isKr ? "구독료 대비 가치" : "VALUE VS COST",
            disclaimer: isKr ? "* 이 시뮬레이터는 예시이며 미래의 수익을 보장하지 않습니다." : "* This simulator is for illustrative purposes only.",
            cta: isKr ? "복리 효과 시작하기" : "START COMPOUNDING NOW"
        },
        kr_min: "₩100만",
        kr_max: "₩1억",
        en_min: "$1K",
        en_max: "$100K"
    };

    return (
        <div className={`p-8 rounded-[32px] border shadow-2xl relative overflow-hidden group ${isKr ? 'bg-gradient-to-br from-slate-900 to-slate-950 border-slate-800' : 'bg-[#0a0a0a] border-[#d4af37]/30'}`}>
            {/* Background Effects */}
            <div className={`absolute -right-20 -top-20 w-64 h-64 rounded-full blur-[80px] ${isKr ? 'bg-blue-600/20' : 'bg-[#d4af37]/10'}`} />
            <div className={`absolute -left-20 -bottom-20 w-64 h-64 rounded-full blur-[80px] ${isKr ? 'bg-purple-600/20' : 'bg-slate-800/20'}`} />

            <div className="relative z-10">
                <div className="text-center mb-10">
                    <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-4 border animate-pulse ${isKr ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-[#d4af37]/10 text-[#d4af37] border-[#d4af37]/20'}`}>
                        <Calculator className="w-3 h-3" /> Profit Simulator
                    </div>
                    <h3 className="text-3xl md:text-4xl font-black text-white italic tracking-tighter mb-4 uppercase">
                        {isKr ?
                            <>"당신의 <span className="text-blue-500">잠재 수익</span>을<br />확인하세요"</> :
                            <>"CHECK YOUR <span className="text-[#d4af37]">POTENTIAL PROFIT</span>"</>
                        }
                    </h3>
                    <p className="text-slate-400 text-sm">
                        {t.label.subtitle}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
                    {/* Controls */}
                    <div className="space-y-8">
                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-xs font-bold text-slate-400 uppercase">{t.label.invest_principal}</label>
                                <span className="text-sm font-black text-white">{formatMoney(investment)}</span>
                            </div>
                            <input
                                type="range"
                                min={isKr ? 1000000 : 1000}
                                max={isKr ? 100000000 : 100000}
                                step={isKr ? 1000000 : 1000}
                                value={investment}
                                onChange={(e) => setInvestment(Number(e.target.value))}
                                className={`w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer transition-all ${isKr ? 'accent-blue-500 hover:accent-blue-400' : 'accent-[#d4af37] hover:accent-[#f1c40f]'}`}
                            />
                            <div className="flex justify-between mt-1 text-[10px] text-slate-600 font-bold">
                                <span>{isKr ? t.kr_min : t.en_min}</span>
                                <span>{isKr ? t.kr_max : t.en_max}</span>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-xs font-bold text-slate-400 uppercase">{t.label.target_return}</label>
                                <span className={`text-sm font-black ${isKr ? 'text-blue-400' : 'text-[#d4af37]'}`}>{monthlyReturn}%</span>
                            </div>
                            <input
                                type="range"
                                min="1"
                                max="20"
                                step="0.5"
                                value={monthlyReturn}
                                onChange={(e) => setMonthlyReturn(Number(e.target.value))}
                                className={`w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer transition-all ${isKr ? 'accent-blue-500 hover:accent-blue-400' : 'accent-[#d4af37] hover:accent-[#f1c40f]'}`}
                            />
                            <div className="flex justify-between mt-1 text-[10px] text-slate-600 font-bold">
                                <span>{t.label.bank_rate}</span>
                                <span>{t.label.pro_rate}</span>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-xs font-bold text-slate-400 uppercase">{t.label.period}</label>
                                <span className="text-sm font-black text-white">{period}{t.label.months}</span>
                            </div>
                            <input
                                type="range"
                                min="1"
                                max="60"
                                step="1"
                                value={period}
                                onChange={(e) => setPeriod(Number(e.target.value))}
                                className={`w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer transition-all ${isKr ? 'accent-purple-500 hover:accent-purple-400' : 'accent-white hover:accent-slate-200'}`}
                            />
                        </div>
                    </div>

                    {/* Result Display */}
                    <div className={`bg-slate-900/50 border rounded-2xl p-6 flex flex-col justify-center relative overflow-hidden ${isKr ? 'border-slate-800' : 'border-[#d4af37]/20 bg-[#111]'}`}>
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                            <TrendingUp className="w-32 h-32 text-white" />
                        </div>

                        <div className="relative z-10">
                            <p className="text-xs font-bold text-slate-500 uppercase mb-2">{t.label.profit_label} ({period}{t.label.months})</p>
                            <p className={`text-4xl md:text-5xl font-black tracking-tighter mb-2 ${isKr ? 'text-green-400' : 'text-[#d4af37]'}`}>
                                +{formatMoney(profit)}
                            </p>
                            <p className="text-xs text-slate-400 mb-6">
                                {t.label.final_asset}: <span className="text-white font-bold">{formatMoney(finalAmount)}</span>
                            </p>

                            <div className={`rounded-xl p-4 ${isKr ? 'bg-blue-600/10 border border-blue-500/20' : 'bg-[#d4af37]/10 border border-[#d4af37]/20'}`}>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className={`p-1.5 rounded text-white ${isKr ? 'bg-blue-500' : 'bg-[#d4af37] text-black'}`}>
                                        <DollarSign className="w-4 h-4" />
                                    </div>
                                    <p className={`text-xs font-bold ${isKr ? 'text-blue-300' : 'text-[#d4af37]'}`}>{t.label.value_title}</p>
                                </div>
                                <p className="text-sm text-slate-300 leading-relaxed">
                                    {isKr ?
                                        <>VIP 구독료는 수익의 <span className="text-white font-bold">{((subscriptionCost / profit) * 100).toFixed(1)}%</span>에 불과합니다.<br /></> :
                                        <>Fees are only <span className="text-white font-bold">{((subscriptionCost / profit) * 100).toFixed(1)}%</span> of profits.<br /></>
                                    }
                                    ROI: <span className={`font-black text-lg ${isKr ? 'text-green-400' : 'text-[#d4af37]'}`}>{roi}x</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-center">
                    <button onClick={() => document.getElementById('membership-pricing')?.scrollIntoView({ behavior: 'smooth' })} className={`px-10 py-4 rounded-full font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)] ${isKr ? 'bg-white text-black' : 'bg-[#d4af37] text-black shadow-[0_0_40px_rgba(212,175,55,0.3)]'}`}>
                        {t.label.cta} <ArrowRight className="w-4 h-4 inline ml-2" />
                    </button>
                    <p className="mt-4 text-[10px] text-slate-600">
                        {t.label.disclaimer}
                    </p>
                </div>
            </div>
        </div>
    );
}
