'use client';

import Link from 'next/link';
import { Check, Zap, Crown, Sparkles, ArrowRight, ShieldCheck, Lock } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import SiteHeader from '@/components/SiteHeader';
import AdLeaderboard from '@/components/ads/AdLeaderboard';

export default function PricingPage() {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-[#050b14] text-white">
            <SiteHeader />

            <div className="pt-32 pb-20 px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Event Banner */}
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#00ffbd]/10 border border-[#00ffbd]/30 rounded-full text-[#00ffbd] text-xs font-black uppercase tracking-widest mb-6 animate-pulse">
                            <Sparkles className="w-4 h-4" /> EMPIRE EVOLUTION EVENT
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter mb-6 uppercase leading-none">
                            ALL FREE <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ffbd] via-blue-400 to-indigo-600">UNLIMITED ACCESS</span>
                        </h1>
                        <p className="text-xl text-slate-400 font-bold max-w-2xl mx-auto mb-10">
                            스탁 엠파이어의 모든 프리미엄 분석 기능을 개방합니다.<br />
                            지금 바로 AI가 분석하는 실시간 시장 리포트를 확인하세요.
                        </p>

                        <div className="flex justify-center gap-4">
                            <Link href="/newsroom" className="px-10 py-5 bg-[#00ffbd] hover:bg-[#00d4ff] text-black rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl shadow-[#00ffbd]/20 flex items-center gap-3 active:scale-95">
                                실시간 뉴스룸 입장 <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>

                    {/* Free Card Only */}
                    <div className="max-w-2xl mx-auto mb-20">
                        <div className="relative bg-slate-900/50 border-2 border-[#00ffbd] rounded-[3rem] p-10 shadow-2xl overflow-hidden group">
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#00ffbd]/10 rounded-full blur-3xl animate-pulse"></div>

                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h3 className="text-4xl font-black text-white italic uppercase mb-2">Empire Core</h3>
                                    <p className="text-[#00ffbd] text-sm font-black uppercase tracking-widest">Public Alpha Access</p>
                                </div>
                                <div className="p-4 bg-[#00ffbd] rounded-2xl">
                                    <ShieldCheck className="w-8 h-8 text-black" />
                                </div>
                            </div>

                            <div className="mb-10">
                                <span className="text-6xl font-black text-white">$0</span>
                                <span className="text-slate-500 font-bold ml-2">/ No Limits</span>
                            </div>

                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                                {[
                                    "실시간 글로벌 뉴스 분석",
                                    "AI 감성 지수 스캔",
                                    "고정밀 시장 테마 보고서",
                                    "무제한 분석 리포트 열람",
                                    "실시간 경제 지표 알림",
                                    "종목별 시나리오 매칭"
                                ].map((feature, idx) => (
                                    <li key={idx} className="flex items-center gap-3 text-slate-300 font-bold text-sm">
                                        <Check className="w-5 h-5 text-[#00ffbd] flex-shrink-0" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <div className="p-6 bg-slate-950 rounded-2xl border border-white/5 text-center">
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
                                    고위험 알파 시그널 진입/청산 전략은 리베이트 및 리스크 방지를 위해<br />
                                    보스(ADMIN) 전용 터미널에서만 제한적으로 운영됩니다.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Ad Spacer */}
                    <div className="mb-20">
                        <AdLeaderboard />
                    </div>

                    {/* Mini FAQ */}
                    <div className="max-w-3xl mx-auto space-y-6">
                        <h2 className="text-2xl font-black uppercase italic tracking-tighter text-center mb-10">System Briefing</h2>
                        <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl">
                            <h3 className="text-[#00ffbd] font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                                <Zap className="w-4 h-4" /> 왜 무료인가요?
                            </h3>
                            <p className="text-slate-400 font-medium leading-relaxed italic">
                                "스탁 엠파이어는 데이터의 민주화를 지향합니다. 누구나 기관급 인텔리전스에 접근할 수 있도록 일시적으로 모든 유료 벽을 제거했습니다. 광고 수익을 통해 시스템 운영을 유지합니다."
                            </p>
                        </div>
                        <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl">
                            <h3 className="text-[#ff4d4d] font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                                <Lock className="w-4 h-4" /> 알파 시그널은 왜 안 보이나요?
                            </h3>
                            <p className="text-slate-400 font-medium leading-relaxed italic">
                                "강력한 변동성을 동반하는 최상위 사령관 전용 시그널은 리스크가 매우 큽니다. 일반 사용자 보호를 위해 해당 데이터는 사령관(ADMIN) 승인 계정에서만 통제됩니다."
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
