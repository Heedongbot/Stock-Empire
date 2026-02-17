
'use client';

import SiteHeader from '@/components/SiteHeader';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-[#050b14] text-slate-200 font-sans selection:bg-[#00ffbd] selection:text-black">
            <SiteHeader />

            <main className="max-w-4xl mx-auto px-6 py-20 animate-fade-in-up">
                <Link href="/" className="inline-flex items-center text-slate-500 hover:text-[#00ffbd] transition-colors mb-12 group">
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-xs font-bold uppercase tracking-widest">Back to Dashboard</span>
                </Link>

                <h1 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter mb-12 leading-none">
                    PRIVACY <span className="text-[#00ffbd]">POLICY</span>
                </h1>

                <div className="space-y-12 text-sm leading-relaxed text-slate-400">
                    <section>
                        <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-wide">1. Information Collection</h2>
                        <p>
                            Stock Empire 서비스는 이용자에게 최적의 주식 분석 정보를 제공하기 위해 다음과 같은 정보를 수집합니다.
                        </p>
                        <ul className="list-disc list-inside mt-4 space-y-2 marker:text-[#00ffbd]">
                            <li><strong>Essential:</strong> 이메일 주소, 접속 로그, 쿠키 (사용자 식별용)</li>
                            <li><strong>Automatic:</strong> 기기 정보, 브라우저 유형, IP 주소 (보안 및 분석용)</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-wide">2. How We Use Data</h2>
                        <p>
                            수집된 정보는 다음의 목적으로만 사용됩니다.
                        </p>
                        <ul className="list-disc list-inside mt-4 space-y-2 marker:text-[#00ffbd]">
                            <li>AI 기반 개인 맞춤형 종목 추천 서비스 제공</li>
                            <li>부정 사용 방지 및 서비스 보안 강화</li>
                            <li>이용자 문의 응대 및 주요 업데이트 공지</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-wide">3. Third Party Ads (Google AdSense)</h2>
                        <p>
                            본 사이트는 Google AdSense를 통해 광고를 게재할 수 있습니다. Google은 사용자가 본 사이트 또는 다른 사이트를 방문할 때 쿠키를 사용하여 사용자의 관심사에 기반한 광고를 제공할 수 있습니다. 사용자는 언제든지 구글 광고 설정을 통해 맞춤 광고를 거부할 수 있습니다.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-wide">4. Contact Information</h2>
                        <p>
                            개인정보와 관련된 문의는 아래 이메일로 연락주시면 신속히 답변해 드리겠습니다.
                            <br /><br />
                            <a href="mailto:66683@naver.com" className="text-[#00ffbd] hover:underline font-bold">66683@naver.com</a>
                        </p>
                    </section>
                </div>

                <div className="mt-20 pt-12 border-t border-slate-800 text-center">
                    <p className="text-slate-600 text-xs uppercase tracking-[0.2em]">
                        &copy; 2026 Stock Empire. Authorized AI Intelligence Service.
                    </p>
                </div>
            </main>
        </div>
    );
}
