'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Check, Zap, Crown, Shield, Star, LayoutDashboard, ArrowRight, Brain, Clock, Sparkles } from 'lucide-react';
import { translations } from '@/lib/translations';
import SiteHeader from '@/components/SiteHeader';
import AdLeaderboard from '@/components/ads/AdLeaderboard';

export default function StorePage() {
    const lang = 'ko'; // 한국어 고정
    const t = translations[lang];

    return (
        <div className="min-h-screen bg-[#050b14] text-white font-sans">
            <SiteHeader />

            <main className="max-w-7xl mx-auto px-6 py-20">
                {/* 상단 전면 광고 */}
                <div className="mb-20">
                    <AdLeaderboard />
                </div>

                {/* Hero Header */}
                <div className="text-center mb-16 relative">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#00ffbd]/10 rounded-full blur-[120px] -z-10" />

                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#00ffbd]/10 border border-[#00ffbd]/30 rounded-full text-[#00ffbd] text-xs font-black uppercase tracking-[0.2em] mb-8 animate-pulse">
                        <Sparkles className="w-4 h-4" /> EMPIRE EVOLUTION EVENT
                    </div>

                    <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter mb-8 uppercase leading-tight">
                        EVERYTHING IS <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ffbd] via-blue-500 to-indigo-600">NOW FREE FOR ALL</span>
                    </h2>

                    <p className="text-slate-400 font-bold text-lg max-w-2xl mx-auto mb-12 leading-relaxed">
                        스탁 엠파이어의 100% 자동화 분석 시스템을 전면 무료로 개방합니다.<br />
                        유료 구독 없이 모든 레포트와 AI 인사이트를 즉시 확인하세요.
                    </p>

                    <div className="flex justify-center gap-6">
                        <Link href="/" className="px-12 py-5 bg-[#00ffbd] text-black font-black rounded-2xl uppercase tracking-widest shadow-2xl shadow-[#00ffbd]/20 transition-all hover:scale-105 active:scale-95">
                            메인 터미널 입장
                        </Link>
                    </div>
                </div>

                {/* Event Highlights */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
                    {[
                        {
                            icon: <Zap className="w-8 h-8 text-[#00ffbd]" />,
                            title: "전면 무료 개방",
                            desc: "VIP/VVIP 전용이었던 대가들의 뉴스 해석과 심층 분석 레포트를 누구나 자유롭게 열람 가능합니다."
                        },
                        {
                            icon: <Brain className="w-8 h-8 text-blue-400" />,
                            title: "AI 콴트 엔진 탑재",
                            desc: "Gemini 1.5 Pro 기반의 고성능 시나리오 분석 엔진이 모든 보고서에 기본 적용됩니다."
                        },
                        {
                            icon: <Shield className="w-8 h-8 text-amber-500" />,
                            title: "리스크 프리 시스템",
                            desc: "핵심 알파 시그널은 보스(ADMIN) 전용으로 관리하여 시장 리스크를 철저히 제어합니다."
                        }
                    ].map((item, i) => (
                        <div key={i} className="bg-[#0a1120] border border-slate-800 rounded-[2.5rem] p-10 text-center shadow-2xl">
                            <div className="w-16 h-16 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                                {item.icon}
                            </div>
                            <h4 className="text-xl font-black text-white italic mb-4 uppercase tracking-tighter">{item.title}</h4>
                            <p className="text-slate-500 text-sm font-bold leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Event Footer Disclaimer */}
                <div className="mt-24 p-12 bg-slate-950 border border-white/5 rounded-[3rem] text-center">
                    <p className="text-[10px] text-slate-700 font-black uppercase tracking-[0.5em] mb-4">Stock Empire Operations Terminal</p>
                    <p className="text-slate-600 text-xs italic max-w-2xl mx-auto leading-relaxed">
                        * 본 이벤트는 한국어 테스트 버전 사용자들을 대상으로 한 한시적 혜택입니다. <br />
                        * 과도한 트래픽 발생 시 서비스 안정성을 위해 접근이 제한될 수 있습니다.
                    </p>
                </div>
            </main>
        </div>
    );
}
