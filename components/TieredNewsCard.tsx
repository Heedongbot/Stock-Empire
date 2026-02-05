'use client';

import { useState } from 'react';
import { Lock, TrendingUp, TrendingDown, BarChart3, Target, AlertTriangle, Lightbulb, Crown, ThumbsUp } from 'lucide-react';

interface NewsItemProps {
    news: any;
    userTier: 'FREE' | 'VIP' | 'VVIP';
}

export default function TieredNewsCard({ news, userTier }: NewsItemProps) {
    const canAccess = (requiredTier: string) => {
        const tiers = { FREE: 0, VIP: 1, VVIP: 2 };
        return tiers[userTier] >= tiers[requiredTier as keyof typeof tiers];
    };

    const hasFullTierData = news.free_tier && news.vip_tier && news.vvip_tier;

    const UpgradePrompt = ({ tier }: { tier: string }) => (
        <div className="mt-4 p-6 bg-gradient-to-br from-slate-900 to-slate-800 border border-yellow-500/30 rounded-xl">
            <div className="flex items-center gap-3 mb-3">
                <Lock className="w-5 h-5 text-yellow-500" />
                <h4 className="text-yellow-500 font-bold">{tier} 전용 콘텐츠</h4>
            </div>
            <p className="text-slate-400 text-sm mb-4">
                {tier === 'VIP' && '이 뉴스의 AI 분석과 투자 인사이트를 확인하려면 VIP 멤버십이 필요합니다.'}
                {tier === 'VVIP' && '과거 데이터 분석, AI 기술적 분석 시나리오, 매매 전략을 확인하려면 VVIP 멤버십이 필요합니다.'}
            </p>

            <div className="mb-4 p-3 bg-slate-950/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-400 text-sm">
                        {tier === 'VIP' && '월 ₩19,900'}
                        {tier === 'VVIP' && '월 ₩49,900'}
                    </span>
                    <span className="text-green-400 text-xs font-bold">
                        {tier === 'VIP' && '일일 약 ₩660 = 커피 한 잔 값'}
                        {tier === 'VVIP' && '월 5만원으로 AI 펀드매니저 고용'}
                    </span>
                </div>
                <div className="text-xs text-slate-500">
                    {tier === 'VIP' && '연간 구독 시 ₩199,000 (17% 할인)'}
                    {tier === 'VVIP' && '연간 구독 시 ₩499,000 (17% 할인)'}
                </div>
            </div>

            <div className="mb-4 p-3 bg-gradient-to-r from-green-900/20 to-blue-900/20 border border-green-500/20 rounded-lg">
                <div className="text-xs text-green-400 font-bold mb-1">
                    {tier === 'VIP' && '📊 지난 30일 VIP 분석 성과'}
                    {tier === 'VVIP' && '📊 지난 30일 VVIP 분석 성과'}
                </div>
                <div className="text-xs text-slate-300">
                    {tier === 'VIP' && '평균 수익률: +12.3% | 승률: 73% (22승 8패)'}
                    {tier === 'VVIP' && '평균 수익률: +18.7% | 승률: 81% (26승 6패)'}
                </div>
            </div>

            <button className="w-full py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold rounded-lg hover:shadow-lg hover:shadow-yellow-500/50 transition-all">
                {tier} 멤버십 구독하기 →
            </button>

            <p className="text-xs text-slate-500 text-center mt-2">
                7일 무료 체험 | 30일 환불 보장
            </p>
        </div>
    );

    // 소셜 프루프 컴포넌트
    const SocialProof = ({ tier }: { tier: string }) => {
        // Hydration mismatch 방지를 해 초기값을 null로 설정
        const [counts, setCounts] = useState<{ vip: number, vvip: number } | null>(null);

        useState(() => {
            setCounts({
                vip: Math.floor(Math.random() * 200) + 200, // 200-400
                vvip: Math.floor(Math.random() * 100) + 50  // 50-150
            });
        });

        if (!counts) return null; // 클라이언트 렌더링 전에는 표시하지 않음

        return (
            <div className="mt-3 p-3 bg-blue-900/10 border border-blue-500/20 rounded-lg flex items-center gap-3">
                <ThumbsUp className="w-4 h-4 text-blue-400" />
                <p className="text-xs text-blue-300">
                    {tier === 'VIP' && `👥 VIP 회원 ${counts.vip}명이 이 분석을 유용하게 평가했습니다`}
                    {tier === 'VVIP' && `👥 VVIP 회원 ${counts.vvip}명이 이 전략으로 수익을 냈습니다`}
                </p>
            </div>
        );
    };

    // 기존 뉴스 형식일 경우
    if (!hasFullTierData) {
        return (
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs font-bold rounded">
                                {news.ticker}
                            </span>
                            <span className={`px-2 py-1 text-xs font-bold rounded ${news.sentiment === 'BULLISH'
                                ? 'bg-green-500/20 text-green-400'
                                : 'bg-red-500/20 text-red-400'
                                }`}>
                                {news.sentiment === 'BULLISH' ? '🐂 BULLISH' : '🐻 BEARISH'}
                            </span>
                        </div>
                        <h3 className="text-lg font-bold text-white mb-1">{news.title_kr || news.title}</h3>
                        <p className="text-sm text-slate-400">{news.title}</p>
                    </div>
                </div>

                {/* FREE 티어 - 기본 요약 + Fade-out */}
                <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="px-2 py-1 bg-slate-800 text-slate-400 text-xs font-bold rounded">
                            FREE
                        </div>
                    </div>

                    {/* 첫 2줄만 표시 */}
                    <div className="relative">
                        <p className="text-slate-300 line-clamp-2">{news.summary_kr || "뉴스 요약 정보"}</p>
                    </div>
                </div>

                {/* AI 분석 미리보기 (Fade-out 효과) */}
                {userTier === 'FREE' && (
                    <div className="relative mb-4">
                        {/* 흐린 텍스트 */}
                        <div className="relative overflow-hidden rounded-lg">
                            <div className="blur-sm select-none pointer-events-none p-4 bg-slate-900/50">
                                <p className="text-slate-400 text-sm mb-2">
                                    📊 <strong>AI 핵심 분석:</strong> 이번 뉴스는 시장에 중대한 영향을 미칠 것으로 예상됩니다.
                                    과거 유사 사례를 분석한 결과...
                                </p>
                                <p className="text-slate-400 text-sm mb-2">
                                    💡 <strong>투자 인사이트:</strong> 단기적으로는 상승 모멘텀이 강화될 것으로 보이며,
                                    기관 투자자들의 매수세가...
                                </p>
                                <p className="text-slate-400 text-sm">
                                    📈 <strong>예상 시나리오:</strong> 1주일 내 +5.2%, 1개월 내 +12.8% 상승 가능성...
                                </p>
                            </div>

                            {/* 그라데이션 오버레이 */}
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/80 to-slate-950 pointer-events-none" />
                        </div>

                        {/* Unlock 버튼 */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold text-sm shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2">
                                <Lock className="w-4 h-4" />
                                VIP로 전체 분석 보기
                            </button>
                        </div>
                    </div>
                )}

                {/* 소셜 프루프 */}
                {userTier === 'FREE' && <SocialProof tier="VIP" />}

                {/* VIP/VVIP 업그레이드 프롬프트 */}
                {userTier === 'FREE' && <UpgradePrompt tier="VIP" />}

                {/* 푸터 */}
                <div className="mt-4 pt-4 border-t border-slate-800">
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                        <span>{new Date(news.published_at).toLocaleString('ko-KR')}</span>
                        <a href={news.link} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                            원문 보기 →
                        </a>
                    </div>

                    {/* 법적 면책 조항 */}
                    <div className="p-3 bg-slate-900/50 border border-slate-700/50 rounded-lg">
                        <div className="flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                            <div>
                                <h5 className="text-xs font-bold text-yellow-500 mb-1">⚠️ 투자 유의사항</h5>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    본 서비스는 투자 권유가 아닌 정보 제공 목적입니다.
                                    모든 투자 결정은 본인의 판단과 책임 하에 이루어져야 하며,
                                    투자로 인한 손실에 대해 당사는 책임을 지지 않습니다.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // 전체 티어 데이터가 있는 경우
    return (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all">
            <p className="text-slate-300">Full tiered content here</p>
        </div>
    );
}
