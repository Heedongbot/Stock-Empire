'use client';

import { Lock, Newspaper, FileText, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { useState } from 'react';

export default function NewsTeaser({ lang, openPayment }: { lang: 'ko' | 'en', openPayment: (plan: string) => void }) {
    const { user } = useAuth();
    const isFree = user?.tier === 'FREE' || !user;

    const newsData = [
        {
            id: 1,
            title: lang === 'ko' ? "엔비디아 Q4 실적 예상치 20% 상회 발표" : "NVIDIA Q4 Earnings Beat Expectations by 20%",
            summary: lang === 'ko'
                ? "엔비디아가 4분기 매출 605억 달러로 월가 질적을..."
                : "NVIDIA reported Q4 revenue of $60.5B, surpassing Wall St...",
            ai_analysis_preview: lang === 'ko'
                ? "이 뉴스는 한국 반도체 관련주에 직접적..."
                : "This news directly impacts Korean semiconductor stocks...",
            ai_analysis_full: lang === 'ko'
                ? "특히 SK하이닉스는 HBM3 공급 확대로 인해 단기적으로 +7~10% 상승 가능하며 후공정 장비주인 한미반도체 또한 수혜가 예상됩니다. 매수 적기는 실적 발표 직후 조정장이 올 때이며..."
                : "Specifically, SK Hynix could see a +7-10% short-term gain due to HBM3 expansion. Hanmi Semiconductor is also expected to benefit. The best entry point is...",
        },
        {
            id: 2,
            title: lang === 'ko' ? "테슬라 모델2 출시 일정 앞당긴다" : "Tesla Model 2 Launch Schedule Moved Up",
            summary: lang === 'ko'
                ? "기가 팩토리 멕시코 착공과 함께 저가형 모델..."
                : "With Gigafactory Mexico breaking ground, the budget model...",
            ai_analysis_preview: lang === 'ko'
                ? "전기차 부품주들의 밸류에이션 재평가가..."
                : "Revaluation of EV component stocks is imminent...",
            ai_analysis_full: lang === 'ko'
                ? "LG에너지솔루션과 엘앤에프의 공급 물량 확대가 확실시되며, 특히 2차전지 소재 섹터의 반등 트리거가 될 것입니다. 목표가 35만원을 제시하며..."
                : "Increased supply volumes for LG Energy Solution and L&F are certain. This will trigger a rebound in the battery materials sector...",
        },
        {
            id: 3,
            title: lang === 'ko' ? "미 연준, 금리 인하 시기 '신중론' 유지" : "Fed Maintains 'Caution' on Rate Cuts",
            summary: lang === 'ko'
                ? "파월 의장은 물가 상승률이 2%에 도달할 때까지..."
                : "Chair Powell stated rates will maintain until inflation hits 2%...",
            ai_analysis_preview: lang === 'ko'
                ? "성장주보다는 가치주 위주의 포트폴리오가..."
                : "A value-focused portfolio is preferred over growth stocks...",
            ai_analysis_full: lang === 'ko'
                ? "고배당 은행주와 통신주 방어율이 높을 것으로 보입니다. KB금융과 SK텔레콤 비중 확대를 권장하며, 나스닥 레버리지 ETF는 비중 축소가 필요합니다..."
                : "High-dividend bank and telecom stocks will show high defense. Increasing weight in KB Financial and SK Telecom is recommended...",
        }
    ];

    return (
        <section className="py-20 px-6 max-w-7xl mx-auto border-t border-slate-900">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-red-500/10 rounded-lg">
                    <Newspaper className="w-6 h-6 text-red-500" />
                </div>
                <h2 className="text-3xl font-black italic tracking-tighter text-white uppercase">
                    {lang === 'ko' ? "TODAY'S TOP NEWS" : "TODAY'S TOP NEWS"}
                </h2>
                <span className="px-3 py-1 bg-slate-800 text-slate-400 text-[10px] font-bold rounded-full uppercase tracking-widest border border-slate-700">
                    AI ANALYZED
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {newsData.map((news) => (
                    <div key={news.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-8 relative overflow-hidden group hover:border-slate-700 transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-[10px] font-black text-slate-500 bg-slate-950 px-2 py-1 rounded">NEWS #{news.id}</span>
                            <span className="text-[10px] font-black text-indigo-400 flex items-center gap-1">
                                <FileText size={12} /> SUMMARY
                            </span>
                        </div>

                        <h3 className="text-lg font-black text-white mb-4 leading-tight group-hover:text-indigo-400 transition-colors">
                            {news.title}
                        </h3>

                        <p className="text-xs text-slate-400 font-medium mb-6 leading-relaxed border-l-2 border-indigo-500/20 pl-4">
                            {news.summary}
                        </p>

                        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 relative">
                            <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                                🤖 AI Insight
                            </h4>

                            <p className="text-xs text-slate-300 font-bold mb-1">
                                "{news.ai_analysis_preview}"
                            </p>

                            <div className="relative mt-2">
                                <p className={`text-xs text-slate-500 leading-relaxed font-medium transition-all duration-500 ${isFree ? 'blur-sm select-none opacity-50' : ''}`}>
                                    {news.ai_analysis_full}
                                </p>

                                {isFree && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                                        <Lock className="w-5 h-5 text-indigo-500 mb-2" />
                                        <button
                                            onClick={() => openPayment('VIP')}
                                            className="px-4 py-2 bg-slate-900 border border-indigo-500/30 text-indigo-400 text-[10px] font-black rounded-lg hover:bg-indigo-600 hover:text-white transition-all uppercase tracking-widest flex items-center gap-2 shadow-xl"
                                        >
                                            UNLOCK <ArrowRight size={10} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {isFree && (
                <div className="mt-8 text-center bg-indigo-900/10 border border-indigo-500/20 rounded-xl p-4 max-w-md mx-auto animate-pulse">
                    <p className="text-xs font-bold text-indigo-300 mb-1">
                        ⏰ {lang === 'ko' ? "오늘 무료 분석 한도: 1/3건" : "Free Analysis Limit: 1/3"}
                    </p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">
                        {lang === 'ko' ? "내일 00:00에 초기화됩니다" : "Resets tomorrow at 00:00"}
                    </p>
                </div>
            )}
        </section>
    );
}
