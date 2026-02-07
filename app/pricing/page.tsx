'use client';

import Link from 'next/link';
import { Check, X, Zap, Crown, Sparkles, TrendingUp, Globe, Bell, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';

export default function PricingPage() {
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
    const [lang, setLang] = useState<'ko' | 'en'>('ko');
    const { user, login, updateTier } = useAuth();
    const router = useRouter();

    const handleUpgrade = (tier: 'FREE' | 'PRO') => {
        if (!user) {
            login();
            return;
        }

        if (user.tier === tier) {
            return; // Already on this plan
        }

        if (tier === 'PRO') {
            // Mock Payment Process
            // In real world: TossPayments.requestPayment(...)
            const confirmed = window.confirm("Toss Payments 테스트 결제를 진행하시겠습니까? (실제 결제 아님)");
            if (confirmed) {
                alert("결제가 완료되었습니다! PRO 멤버십이 활성화됩니다.");
                updateTier('PRO');
                router.push('/');
            }
        } else {
            // Downgrade to FREE
            const confirmed = window.confirm("멤버십을 해지하고 FREE 등급으로 변경하시겠습니까?");
            if (confirmed) {
                updateTier('FREE');
                alert("변경되었습니다.");
            }
        }
    };

    const translations = {
        ko: {
            title: "가격 플랜",
            subtitle: "투자 목표에 맞는 플랜을 선택하세요",
            monthly: "월간",
            yearly: "연간",
            yearlyDiscount: "2개월 무료!",
            freePlan: {
                name: "FREE",
                tagline: "투자의 시작",
                price: "0원",
                period: "영구 무료",
                cta: "지금 시작하기",
                features: [
                    { text: "글로벌 + 한국 뉴스 (실시간)", included: true },
                    { text: "기본 AI 감성 분석", included: true },
                    { text: "제목 + 요약 제공", included: true },
                    { text: "AI 마스터 인사이트", included: false },
                    { text: "실시간 경제지표 속보 심층 분석", included: false },
                    { text: "PRO 전용 알파 시그널", included: false },
                    { text: "광고 제거", included: false },
                ]
            },
            proPlan: {
                name: "PRO",
                tagline: "상위 1%의 무기",
                price: "29,900원",
                yearlyPrice: "299,000원",
                period: "월",
                cta: "PRO 시작하기",
                popular: "베스트",
                features: [
                    { text: "FREE 전체 기능", included: true },
                    { text: "광고 완전 제거", included: true },
                    { text: "AI 마스터 인사이트 (버핏, 달리오)", included: true },
                    { text: "글로벌 경제지표 실시간 속보 (Deep Dive)", included: true },
                    { text: "PRO 전용 알파 시그널 (기관 수급)", included: true },
                    { text: "과거 유사 사례 분석 (Backtest)", included: true },
                    { text: "텔레그램 실시간 알림", included: true },
                ]
            },
            faq: {
                title: "자주 묻는 질문",
                q1: "결제는 어떻게 하나요?",
                a1: "Toss Payments 또는 카드 결제를 통해 안전하게 처리됩니다.",
                q2: "언제든 취소할 수 있나요?",
                a2: "네, 언제든 취소 가능하며 위약금이 없습니다.",
                q3: "환불 정책은 어떻게 되나요?",
                a3: "첫 7일 내 환불 가능하며, 이후에는 남은 기간만큼 일할 계산됩니다.",
            }
        },
        en: {
            title: "Pricing Plans",
            subtitle: "Choose the plan that fits your investment goals",
            monthly: "Monthly",
            yearly: "Yearly",
            yearlyDiscount: "2 months free!",
            freePlan: {
                name: "FREE",
                tagline: "Get Started",
                price: "$0",
                period: "forever",
                cta: "Start Now",
                features: [
                    { text: "Real-time Global + KR News", included: true },
                    { text: "Basic AI sentiment analysis", included: true },
                    { text: "Title + Summary", included: true },
                    { text: "AI Master Insights", included: false },
                    { text: "Deep Dive Economic Indicators", included: false },
                    { text: "PRO Alpha Signals", included: false },
                    { text: "Ad-free experience", included: false },
                ]
            },
            proPlan: {
                name: "PRO",
                tagline: "Elite Arsenal",
                price: "$29.99",
                yearlyPrice: "$299",
                period: "month",
                cta: "Start PRO",
                popular: "Best Value",
                features: [
                    { text: "All FREE features", included: true },
                    { text: "100% ad-free", included: true },
                    { text: "AI Master Insights (Buffett, Dalio)", included: true },
                    { text: "Real-time Economic Indicators (Deep Dive)", included: true },
                    { text: "PRO Alpha Signals (Institutional Flow)", included: true },
                    { text: "Historical Pattern Analysis", included: true },
                    { text: "Telegram Real-time Alerts", included: true },
                ]
            },
            faq: {
                title: "Frequently Asked Questions",
                q1: "How do I pay?",
                a1: "Secure payment via Toss Payments or credit card.",
                q2: "Can I cancel anytime?",
                a2: "Yes, cancel anytime with no penalty.",
                q3: "What's the refund policy?",
                a3: "Full refund within 7 days, prorated thereafter.",
            }
        }
    };

    const t = translations[lang];

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0a0f1a] via-[#0d1420] to-[#0a0f1a] text-white">
            {/* Header */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="text-2xl font-black italic tracking-tighter bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        STOCK EMPIRE
                    </Link>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setLang(lang === 'ko' ? 'en' : 'ko')}
                            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-bold transition-colors"
                        >
                            {lang === 'ko' ? 'EN' : 'KR'}
                        </button>
                        <Link href="/analysis" className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-bold transition-colors">
                            {lang === 'ko' ? '분석 보기' : 'View Analysis'}
                        </Link>
                    </div>
                </div>
            </nav>

            <div className="pt-32 pb-20 px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Title */}
                    <div className="text-center mb-16">
                        <h1 className="text-5xl md:text-6xl font-black italic tracking-tighter mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-amber-400 bg-clip-text text-transparent">
                            {t.title}
                        </h1>
                        <p className="text-xl text-slate-400 font-bold">{t.subtitle}</p>
                    </div>

                    {/* Billing Toggle */}
                    <div className="flex items-center justify-center gap-4 mb-12">
                        <button
                            onClick={() => setBillingCycle('monthly')}
                            className={`px-6 py-3 rounded-xl font-bold transition-all ${billingCycle === 'monthly'
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                }`}
                        >
                            {t.monthly}
                        </button>
                        <button
                            onClick={() => setBillingCycle('yearly')}
                            className={`px-6 py-3 rounded-xl font-bold transition-all relative ${billingCycle === 'yearly'
                                ? 'bg-amber-600 text-white'
                                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                }`}
                        >
                            {t.yearly}
                            <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-black">
                                {t.yearlyDiscount}
                            </span>
                        </button>
                    </div>

                    {/* Pricing Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20 max-w-4xl mx-auto">
                        {/* FREE */}
                        <PricingCard
                            plan={t.freePlan}
                            icon={<Globe className="w-8 h-8" />}
                            color="from-slate-700 to-slate-800"
                            borderColor="border-slate-700"
                            onAction={() => handleUpgrade('FREE')}
                            currentTier={user?.tier}
                            targetTier="FREE"
                            onClick={() => handleUpgrade('FREE')}
                        />

                        {/* PRO */}
                        <PricingCard
                            plan={t.proPlan}
                            icon={<Crown className="w-8 h-8" />}
                            color="from-purple-600 to-blue-600"
                            borderColor="border-purple-500"
                            popular={t.proPlan.popular}
                            billingCycle={billingCycle}
                            onAction={() => handleUpgrade('PRO')}
                            currentTier={user?.tier}
                            targetTier="PRO"
                            onClick={() => handleUpgrade('PRO')}
                        />
                    </div>

                    {/* FAQ */}
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-3xl font-black mb-8 text-center">{t.faq.title}</h2>
                        <div className="space-y-6">
                            <FAQItem q={t.faq.q1} a={t.faq.a1} />
                            <FAQItem q={t.faq.q2} a={t.faq.a2} />
                            <FAQItem q={t.faq.q3} a={t.faq.a3} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function PricingCard({ plan, icon, color, borderColor, popular, billingCycle, onClick, currentTier, targetTier }: any) {
    const displayPrice = billingCycle === 'yearly' && plan.yearlyPrice ? plan.yearlyPrice : plan.price;
    const isCurrent = currentTier === targetTier;

    // If not logged in & default tier is free, we treat it as active? No.
    // If user is null (not logged in), no plan is "current".

    return (
        <div className={`relative bg-slate-900/50 border-2 ${isCurrent ? 'border-green-500 box-shadow-green' : borderColor} rounded-3xl p-8 hover:scale-105 transition-transform flex flex-col`}>
            {popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">
                        {popular}
                    </span>
                </div>
            )}

            {isCurrent && (
                <div className="absolute top-4 right-4">
                    <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-1">
                        <Check size={12} /> 사용 중
                    </span>
                </div>
            )}

            <div className={`w-16 h-16 bg-gradient-to-br ${color} rounded-2xl flex items-center justify-center mb-6`}>
                {icon}
            </div>

            <h3 className="text-3xl font-black mb-2">{plan.name}</h3>
            <p className="text-slate-400 text-sm font-bold mb-6">{plan.tagline}</p>

            <div className="mb-8">
                <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black">{displayPrice}</span>
                    {plan.period !== "영구 무료" && plan.period !== "forever" && (
                        <span className="text-slate-500 font-bold">/ {plan.period}</span>
                    )}
                </div>
                {plan.period === "영구 무료" || plan.period === "forever" ? (
                    <span className="text-sm text-slate-500 font-bold">{plan.period}</span>
                ) : null}
            </div>

            <button
                onClick={onClick}
                disabled={isCurrent}
                className={`w-full py-4 rounded-xl font-black uppercase tracking-wider bg-gradient-to-r ${isCurrent ? 'from-slate-700 to-slate-800 cursor-default opacity-50' : color} hover:opacity-90 transition-opacity mb-8 flex items-center justify-center gap-2`}
            >
                {isCurrent ? "현재 플랜" : plan.cta}
                {!isCurrent && <ArrowRight className="w-4 h-4" />}
            </button>

            <ul className="space-y-4 flex-1">
                {plan.features.map((feature: any, idx: number) => (
                    <li key={idx} className="flex items-start gap-3">
                        {feature.included ? (
                            <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                        ) : (
                            <X className="w-5 h-5 text-slate-600 mt-0.5 flex-shrink-0" />
                        )}
                        <span className={`text-sm font-bold ${feature.included ? 'text-slate-300' : 'text-slate-600'}`}>
                            {feature.text}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function FAQItem({ q, a }: { q: string; a: string }) {
    return (
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <h3 className="text-lg font-black mb-2 text-blue-400">{q}</h3>
            <p className="text-slate-400 font-medium">{a}</p>
        </div>
    );
}
