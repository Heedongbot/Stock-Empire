'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Check, Zap, Crown, Shield, Star, LayoutDashboard, ArrowRight, Brain, Clock } from 'lucide-react';
import { translations } from '@/lib/translations';

export default function StorePage() {
    const [lang, setLang] = useState<'ko' | 'en'>('ko');
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
    const t = translations[lang];

    // Auto-detect Language
    useEffect(() => {
        const userLang = navigator.language || navigator.languages[0];
        if (userLang.startsWith('ko')) {
            setLang('ko');
        } else {
            setLang('en');
        }
    }, []);

    const plans = [
        {
            id: 'free',
            name: lang === 'ko' ? 'FREE' : 'FREE',
            price: '0',
            description: lang === 'ko' ? '시작하는 투자자를 위한 기초 데이터' : 'Basic data for beginning investors',
            features: lang === 'ko'
                ? ['실시간 국내/해외 시황 속보', 'AI 기본 감성 점수 제공', '광고 포함']
                : ['Real-time Global News Feed', 'Basic AI Sentiment Score', 'Contains Ads'],
            icon: <Star className="w-6 h-6 text-slate-400" />,
            color: 'slate',
            button: lang === 'ko' ? '현재 등급' : 'Current Plan'
        },
        {
            id: 'vip',
            name: lang === 'ko' ? 'VIP' : 'VIP',
            price: billingCycle === 'monthly' ? '9,900' : '69,300', // 30% Off roughly for yearly? Let's use user's specific pricing if available.
            originalPrice: billingCycle === 'yearly' ? '99,000' : null,
            description: lang === 'ko' ? '대가의 시선으로 시장을 꿰뚫는 통찰' : 'Master insights to pierce the market',
            features: lang === 'ko'
                ? ['글로벌 대가들의 뉴스 해석 (버핏, 달리오 등)', '심층 분석 리포트 무제한 열람', '광고 완전 제거', 'VIP 전용 커뮤니티']
                : ['Masters Persona Analysis', 'Unlimited Deep Reports', 'No Ads', 'VIP Community'],
            icon: <Zap className="w-6 h-6 text-blue-400" />,
            color: 'blue',
            badge: lang === 'ko' ? '가장 인기' : 'Most Popular',
            button: lang === 'ko' ? 'VIP 업그레이드' : 'Upgrade to VIP'
        },
        {
            id: 'vvip',
            name: lang === 'ko' ? 'VVIP' : 'VVIP',
            price: billingCycle === 'monthly' ? '49,900' : '419,000', // As per previous session
            originalPrice: billingCycle === 'yearly' ? '598,800' : null,
            description: lang === 'ko' ? '상위 1%를 위한 압도적 정보력' : 'Dominant info for the top 1%',
            features: lang === 'ko'
                ? ['매크로 지표별 종목 반응표 (핵심)', '고확신 VVIP 알파 픽 (주간)', '과거 유사 사례 승률 데이터', 'AI 실시간 포트폴리오 최적화']
                : ['Macro Indicator Reaction Map', 'High-Conviction Alpha Picks', 'Historical Win-Rate Data', 'Real-time Portfolio Optimization'],
            icon: <Crown className="w-6 h-6 text-amber-500" />,
            color: 'amber',
            badge: billingCycle === 'yearly' ? (lang === 'ko' ? '🎁 30% 한정 할인' : '🎁 30% OFF EVENT') : null,
            button: lang === 'ko' ? 'VVIP 패스 구매' : 'Get VVIP Pass'
        }
    ];

    return (
        <div className="min-h-screen bg-[#0a0f1a] text-white">
            <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                            <LayoutDashboard className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black italic tracking-tighter">STOCK EMPIRE</h1>
                            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{t.nav.store}</p>
                        </div>
                    </Link>
                    <div className="flex items-center gap-6">
                        <nav className="flex items-center gap-6 hidden md:flex">
                            <Link href="/" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">{t.nav.home}</Link>
                            <Link href="/dashboard" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">{t.nav.dashboard}</Link>
                            <Link href="/analysis" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">{t.nav.analysis}</Link>
                            <Link href="/market" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">{t.nav.market}</Link>
                        </nav>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-8 py-20">
                {/* Hero Header */}
                <div className="text-center mb-16 relative">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-500/10 rounded-full blur-[120px] -z-10" />
                    <h2 className="text-5xl md:text-6xl font-black italic tracking-tighter mb-6 bg-gradient-to-r from-white via-slate-200 to-slate-500 bg-clip-text text-transparent">
                        {lang === 'ko' ? '무한한 부의 확장, 등급을 선택하세요' : 'Expand Your Wealth, Choose Your Tier'}
                    </h2>
                    <p className="text-slate-400 font-bold text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
                        {lang === 'ko'
                            ? '시장의 노이즈를 제거하고 정제된 알파(Alpha)를 소유할 시간입니다. 지금 바로 상위 1%의 도구를 손에 넣으세요.'
                            : 'Remove market noise and own the refined Alpha. Get the top 1% tools in your hands right now.'}
                    </p>

                    {/* Billing Toggle */}
                    <div className="flex items-center justify-center gap-4 mb-20">
                        <span className={`text-sm font-bold transition-colors ${billingCycle === 'monthly' ? 'text-white' : 'text-slate-500'}`}>
                            {lang === 'ko' ? '월간 구독' : 'Monthly'}
                        </span>
                        <button
                            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                            className="w-14 h-7 bg-slate-800 rounded-full relative p-1 transition-colors hover:bg-slate-700"
                        >
                            <div className={`w-5 h-5 bg-indigo-500 rounded-full transition-transform transform ${billingCycle === 'yearly' ? 'translate-x-7' : 'translate-x-0'}`} />
                        </button>
                        <span className={`text-sm font-bold transition-colors ${billingCycle === 'yearly' ? 'text-white' : 'text-slate-500'} flex items-center gap-2`}>
                            {lang === 'ko' ? '연간 구독' : 'Yearly'}
                            <span className="bg-indigo-600/20 text-indigo-400 text-[10px] px-2 py-0.5 rounded-full border border-indigo-500/30">
                                {lang === 'ko' ? '30% 할인' : 'SAVE 30%'}
                            </span>
                        </span>
                    </div>
                </div>

                {/* Plans Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
                    {plans.map((plan) => (
                        <div
                            key={plan.id}
                            className={`premium-card relative flex flex-col p-10 border-slate-800 transition-all hover:scale-[1.02] bg-slate-900/40 backdrop-blur-sm shadow-2xl ${plan.id === 'vip' ? 'border-blue-500/30' :
                                    plan.id === 'vvip' ? 'border-amber-500/30 ring-1 ring-amber-500/20' : ''
                                }`}
                        >
                            {plan.badge && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
                                    {plan.badge}
                                </div>
                            )}

                            <div className="mb-10 text-center md:text-left">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-slate-950 border border-slate-800 ${plan.id === 'vip' ? 'text-blue-400' : plan.id === 'vvip' ? 'text-amber-500' : 'text-slate-500'
                                    }`}>
                                    {plan.icon}
                                </div>
                                <h3 className="text-2xl font-black italic tracking-tighter text-white mb-2">{plan.name}</h3>
                                <p className="text-slate-500 text-sm font-medium">{plan.description}</p>
                            </div>

                            <div className="mb-10">
                                <div className="flex items-baseline gap-1">
                                    <span className="text-sm font-bold text-slate-500">{lang === 'ko' ? '₩' : '$'}</span>
                                    <span className="text-5xl font-black text-white">{plan.price}</span>
                                    <span className="text-slate-500 font-bold ml-1">{billingCycle === 'monthly' ? (lang === 'ko' ? '/월' : '/mo') : (lang === 'ko' ? '/년' : '/yr')}</span>
                                </div>
                                {plan.originalPrice && (
                                    <div className="mt-2 flex items-center gap-2">
                                        <span className="text-slate-600 text-sm line-through font-bold">₩{plan.originalPrice}</span>
                                        <span className="text-green-500 text-xs font-black">-{lang === 'ko' ? '30% 절약' : '30% OFF'}</span>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-5 mb-12 flex-grow">
                                {plan.features.map((feature, idx) => (
                                    <div key={idx} className="flex items-start gap-4">
                                        <div className={`mt-1 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${plan.id === 'free' ? 'bg-slate-800 text-slate-500' :
                                                plan.id === 'vip' ? 'bg-blue-600/20 text-blue-400' : 'bg-amber-600/20 text-amber-500'
                                            }`}>
                                            <Check className="w-3 h-3" />
                                        </div>
                                        <span className="text-slate-300 text-sm font-bold leading-tight">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <button className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 flex items-center justify-center gap-3 ${plan.id === 'free' ? 'bg-slate-800 text-slate-400 cursor-default' :
                                    plan.id === 'vip' ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/20' :
                                        'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white shadow-amber-500/20'
                                }`}>
                                {plan.button}
                                {plan.id !== 'free' && <ArrowRight className="w-4 h-4" />}
                            </button>
                        </div>
                    ))}
                </div>

                {/* Social Proof */}
                <div className="mt-24 pt-12 border-t border-slate-800/50 flex flex-col md:flex-row items-center justify-between gap-12 text-center md:text-left">
                    <div className="flex -space-x-3">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="w-12 h-12 rounded-full border-2 border-[#0a0f1a] bg-slate-800 flex items-center justify-center text-[10px] font-black italic">
                                U{i}
                            </div>
                        ))}
                        <div className="w-12 h-12 rounded-full border-2 border-[#0a0f1a] bg-indigo-600 flex items-center justify-center text-[10px] font-black">
                            +1.2K
                        </div>
                    </div>
                    <div>
                        <p className="text-white font-black italic text-xl mb-1">
                            {lang === 'ko' ? '"결제 10분 만에 수익률이 달라졌습니다."' : '"My returns changed 10 mins after upgrading."'}
                        </p>
                        <p className="text-slate-500 text-sm font-bold">
                            {lang === 'ko' ? '실제 VIP/VVIP 회원 1,245명이 이용 중' : 'Already trusted by 1,245 VIP/VVIP members'}
                        </p>
                    </div>
                    <div className="flex gap-8">
                        <div className="text-center">
                            <div className="text-2xl font-black text-white italic">87.4%</div>
                            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Accuracy</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-black text-white italic">24/7</div>
                            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Monitoring</div>
                        </div>
                    </div>
                </div>

                {/* FAQ / Guarantee Footer */}
                <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="flex items-center gap-4 p-6 bg-slate-900/30 rounded-2xl border border-slate-800/50">
                        <Shield className="w-10 h-10 text-indigo-500/50" />
                        <div>
                            <h4 className="text-xs font-black uppercase tracking-widest text-slate-300 mb-1">{lang === 'ko' ? '안심 환불 보장' : 'Risk-Free Guarantee'}</h4>
                            <p className="text-[10px] text-slate-500 font-bold">{lang === 'ko' ? '30일 이내 불만족 시 100% 환불' : '100% refund within 30 days'}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 p-6 bg-slate-900/30 rounded-2xl border border-slate-800/50">
                        <Brain className="w-10 h-10 text-indigo-500/50" />
                        <div>
                            <h4 className="text-xs font-black uppercase tracking-widest text-slate-300 mb-1">{lang === 'ko' ? '차원이 다른 AI' : 'Elite AI Analysis'}</h4>
                            <p className="text-[10px] text-slate-500 font-bold">{lang === 'ko' ? 'Gemini 1.5 Pro 기반의 심층 분석' : 'Powered by Gemini 1.5 Pro'}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 p-6 bg-slate-900/30 rounded-2xl border border-slate-800/50">
                        <Clock className="w-10 h-10 text-indigo-500/50" />
                        <div>
                            <h4 className="text-xs font-black uppercase tracking-widest text-slate-300 mb-1">{lang === 'ko' ? '실시간 알림' : 'Real-time Alerts'}</h4>
                            <p className="text-[10px] text-slate-500 font-bold">{lang === 'ko' ? 'VVIP 전용 급등 시그널 전송' : 'Instant VVIP Signal delivery'}</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
