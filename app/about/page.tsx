
'use client';

import SiteHeader from '@/components/SiteHeader';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-[#050b14] text-slate-200 font-sans selection:bg-[#00ffbd] selection:text-black">
            <SiteHeader />

            <main className="max-w-4xl mx-auto px-6 py-20 animate-fade-in-up">
                <Link href="/" className="inline-flex items-center text-slate-500 hover:text-[#00ffbd] transition-colors mb-12 group">
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-xs font-bold uppercase tracking-widest">Back to Terminal</span>
                </Link>

                <h1 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter mb-12 leading-none">
                    ABOUT <span className="text-[#00ffbd]">US</span>
                </h1>

                <div className="space-y-12 text-lg leading-relaxed text-slate-400">
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-wide">Our Mission</h2>
                        <p>
                            Stock Empire는 복잡한 금융 시장 데이터를 가장 직관적이고 강력한 형태로 제공하기 위해 탄생했습니다.
                            우리는 정보의 비대칭성을 해소하고, 개인 투자자들이 기관 수준의 인사이트를 확보할 수 있도록 돕습니다.
                            최첨단 AI 기술과 실시간 데이터 분석을 통해 시장의 흐름을 읽고, 투자의 나침반이 되어드리겠습니다.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-wide">Technology</h2>
                        <ul className="list-disc list-inside space-y-4 marker:text-[#00ffbd]">
                            <li>
                                <strong className="text-white">Real-time Data Processing:</strong>
                                <br />글로벌 시장 데이터를 실시간으로 수집하고 분석합니다.
                            </li>
                            <li>
                                <strong className="text-white">AI-Driven Insights:</strong>
                                <br />독자적인 AI 알고리즘(Empire AI)을 통해 뉴스의 맥락과 파급력을 심층 분석합니다.
                            </li>
                            <li>
                                <strong className="text-white">Intuitive Visualization:</strong>
                                <br />복잡한 수치를 한눈에 파악할 수 있는 직관적인 대시보드 UI를 제공합니다.
                            </li>
                        </ul>
                    </section>
                </div>

                <div className="mt-20 pt-12 border-t border-slate-800 text-center">
                    <p className="text-slate-600 text-sm mb-4">
                        &copy; {new Date().getFullYear()} Stock Empire. All rights reserved.
                    </p>
                </div>
            </main>
        </div>
    );
}
