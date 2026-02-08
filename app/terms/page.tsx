
'use client';

import SiteHeader from '@/components/SiteHeader';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { AdInFeed } from '@/components/ads/AdInFeed'; // Assuming existing component

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-[#050b14] text-slate-200 font-sans selection:bg-[#00ffbd] selection:text-black">
            <SiteHeader />

            <main className="max-w-4xl mx-auto px-6 py-20 animate-fade-in-up">
                <Link href="/" className="inline-flex items-center text-slate-500 hover:text-[#00ffbd] transition-colors mb-12 group">
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-xs font-bold uppercase tracking-widest">Back to Terminal</span>
                </Link>

                <h1 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter mb-12 leading-none">
                    TERMS & <span className="text-[#00ffbd]">PRIVACY</span>
                </h1>

                <div className="space-y-12 text-sm leading-relaxed text-slate-400">
                    <section>
                        <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-wide">1. Service Overview</h2>
                        <p>
                            본 서비스(Stock Empire)는 사용자의 편의를 위해 제공되는 금융 정보 제공 웹사이트입니다.
                            제공되는 모든 정보는 단순 참고용이며, 실제 투자의 책임은 전적으로 사용자 본인에게 있습니다.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-wide">2. Disclaimer (면책 조항)</h2>
                        <ul className="list-disc list-inside space-y-2 marker:text-[#00ffbd]">
                            <li>
                                본 사이트의 데이터는 실시간으로 수집되나, 원천 데이터의 오류나 지연이 발생할 수 있습니다.
                            </li>
                            <li>
                                제공되는 AI 분석 및 투자 전략은 과거 데이터나 뉴스에 기반한 예측일 뿐, 미래 수익을 보장하지 않습니다.
                            </li>
                            <li>
                                Stock Empire는 본 서비스 이용으로 발생한 어떠한 금전적 손실에 대해서도 법적 책임을 지지 않습니다.
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-wide">3. Privacy Policy (개인정보 처리방침)</h2>
                        <p className="mb-4">
                            Stock Empire는 사용자의 개인정보를 소중하게 생각하며, 다음과 같은 정보를 수집할 수 있습니다.
                        </p>
                        <ul className="list-disc list-inside space-y-2 marker:text-[#00ffbd]">
                            <li>
                                <strong>수집 항목:</strong> 접속 로그, 쿠키, (로그인 시) 이메일 주소, 닉네임
                            </li>
                            <li>
                                <strong>목적:</strong> 서비스 개선, 통계 분석, 개인화된 서비스 제공
                            </li>
                            <li>
                                <strong>보호 조치:</strong> 수집된 정보는 암호화되어 안전하게 보관되며, 법적 요구가 없는 한 제3자에게 제공되지 않습니다.
                            </li>
                        </ul>
                        <p className="mt-4">
                            사용자는 언제든지 자신의 개인정보 삭제를 요청할 수 있으며, 쿠키 사용을 거부할 권리가 있습니다.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-wide">4. Contact</h2>
                        <p>
                            서비스 관련 문의나 제안은 아래 이메일로 연락주시기 바랍니다.
                            <br /><br />
                            <a href="mailto:support@stockempire.com" className="text-[#00ffbd] hover:underline font-bold">support@stockempire.com</a>
                        </p>
                    </section>
                </div>

                <div className="my-20 opacity-50">
                    {/* Placeholder for potential ad inside terms if needed */}
                </div>
            </main>
        </div>
    );
}
