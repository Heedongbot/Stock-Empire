'use client';

import { Lock, Newspaper, FileText, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { useState } from 'react';
import { useDailyLimit } from '@/hooks/useDailyLimit';
import AdInFeed from './ads/AdInFeed';

export default function NewsTeaser({ lang, openPayment }: { lang: 'ko' | 'en', openPayment: (plan: string) => void }) {
    const { user } = useAuth();
    const isFree = user?.tier === 'FREE' || !user;
    const { count, visibleLimit } = useDailyLimit();

    const newsData = [
        {
            id: 1,
            title: lang === 'ko' ? "알파벳, AI 인프라 투자 확대로 2026년 실적 가이던스 상향" : "Alphabet Raises 2026 Guidance on AI Infra Surge",
            summary: lang === 'ko'
                ? "구글의 모기업 알파벳이 2026년 자본 지출 계획을 발표하며 AI 리더십 공고화를 선언했습니다..."
                : "Alphabet announced its 2026 capex plan, declaring the solidification of its AI leadership...",
            ai_analysis_preview: lang === 'ko'
                ? "빅테크 실적 장세가 2026년에도 지속될 전망..."
                : "Big Tech earnings rally expected to continue in 2026...",
            ai_analysis_full: lang === 'ko'
                ? "클라우드 부문의 가파른 성장이 밸류에이션을 견인하고 있습니다. 특히 저금리 안착 시기에 접어들며 차입 비용이 감소한 점이 긍정적입니다. 목표가 상향 조정이 잇따를 것으로 보이며..."
                : "Steep growth in the cloud sector is driving valuations. The stabilization of lower rates has reduced borrowing costs. Target price upgrades are expected...",
        },
        {
            id: 2,
            title: lang === 'ko' ? "삼성전자, 1.4nm 공정 양산 성공... 파운드리 점유율 확대" : "Samsung Electronic Success in 1.4nm Mass Production",
            summary: lang === 'ko'
                ? "삼성전자가 세계 최초로 1.4나모 공정 양산에 성공하며 TSMC와의 격차를 좁히기 시작했습니다..."
                : "Samsung succeeds in 1.4nm mass production, closing the gap with TSMC...",
            ai_analysis_preview: lang === 'ko'
                ? "반도체 업황은 '초격차' 시대로 진입 중..."
                : "Semiconductor industry entering 'Super-Gap' era...",
            ai_analysis_full: lang === 'ko'
                ? "1.4nm 양산 성공은 향후 AI 반도체 수주 경쟁에서 우위를 점할 수 있는 핵심 지표입니다. 한국 반도체 섹터 전반에 긍정적인 온기가 퍼질 것으로 보이며, 특히 후공정 관련주들에 주목할 필요가 있습니다..."
                : "Success in 1.4nm is a key metric for AI chip orders. Positive sentiment will spread across the KR semi sector, especially back-end equipment stocks...",
        },
        {
            id: 3,
            title: lang === 'ko' ? "미 연준, 기준금리 3.50~3.75% 동결... '금융 완화 안착'" : "Fed Holds Rates at 3.50~3.75%, 'Monetary Comfort'",
            summary: lang === 'ko'
                ? "미 연준이 공시를 통해 기준금리를 3% 중반대에서 동결하며 시장의 불확실성을 완전히 해소했습니다..."
                : "The Fed held rates in the mid-3% range, completely resolving market uncertainty...",
            ai_analysis_preview: lang === 'ko'
                ? "저금리 기조 안착은 성장주에 최적의 환경..."
                : "Low rate environment is optimal for growth stocks...",
            ai_analysis_full: lang === 'ko'
                ? "금리가 3.50~3.75% 수준에서 횡보함에 따라 시장은 '금리 하향 안정화'를 공식 팩트로 받아들이고 있습니다. 이는 성장주의 밸류에이션 리레이팅을 정당화하며, 자산 배분 전략에서 주식 비중을 확대해야 할 강력한 근거가 됩니다..."
                : "As rates plateau at 3.50-3.75%, the market accepts 'downward stabilization' as fact. This justifies growth stock re-rating and supports increasing equity weight...",
        }
    ];

    return (
        <section className="py-20 px-6 max-w-7xl mx-auto border-t border-slate-900">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-red-500/10 rounded-lg">
                    <Newspaper className="w-6 h-6 text-red-500" />
                </div>
                <h2 className="text-3xl font-black italic tracking-tighter text-white uppercase">
                    {lang === 'ko' ? "오늘의 주요 뉴스" : "TODAY'S TOP NEWS"}
                </h2>
                <span className="px-3 py-1 bg-slate-800 text-slate-400 text-[10px] font-bold rounded-full uppercase tracking-widest border border-slate-700">
                    {lang === 'ko' ? "AI 분석 완료" : "AI ANALYZED"}
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {newsData.map((news, idx) => (
                    <>
                        <div key={news.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-8 relative overflow-hidden group hover:border-slate-700 transition-all">
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-[10px] font-black text-slate-500 bg-slate-950 px-2 py-1 rounded">{lang === 'ko' ? "뉴스" : "NEWS"} #{news.id}</span>
                                <span className="text-[10px] font-black text-indigo-400 flex items-center gap-1">
                                    <FileText size={12} /> {lang === 'ko' ? "요약" : "SUMMARY"}
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
                                    🤖 {lang === 'ko' ? "AI 인사이트" : "AI Insight"}
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
                                                {lang === 'ko' ? "잠금 해제" : "UNLOCK"} <ArrowRight size={10} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        {isFree && idx === 1 && <AdInFeed />}
                    </>
                ))}
            </div>

            {isFree && (
                <div className="mt-8 text-center bg-indigo-900/10 border border-indigo-500/20 rounded-xl p-4 max-w-md mx-auto animate-pulse">
                    <p className="text-xs font-bold text-indigo-300 mb-1">
                        ⏰ {lang === 'ko' ? `오늘 무료 분석 한도: ${count}/${visibleLimit}건` : `Free Analysis Limit: ${count}/${visibleLimit}`}
                    </p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">
                        {lang === 'ko' ? "내일 00:00에 초기화됩니다" : "Resets tomorrow at 00:00"}
                    </p>
                </div>
            )}
        </section>
    );
}
