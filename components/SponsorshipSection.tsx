import React from 'react';
import { Lock, ShieldAlert } from 'lucide-react';
import { DonationSection } from '@/components/DonationSection';

export default function SponsorshipSection() {
    return (
        <section className="max-w-7xl mx-auto px-8 relative z-30 mb-20 animate-fade-in-up">
            <div className="flex flex-col items-center justify-center">
                <div className="p-10 bg-slate-900/50 border border-slate-800 rounded-[3rem] text-center max-w-3xl backdrop-blur-sm relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 p-10 opacity-5">
                        <Lock className="w-40 h-40 text-white" />
                    </div>

                    <div className="relative z-10">
                        <ShieldAlert className="w-16 h-16 text-slate-600 mx-auto mb-6" />
                        <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-6 relative inline-block">
                            Alpha Signal Access Restricted
                            <div className="absolute -bottom-2 left-0 w-full h-1 bg-[#00ffbd] opacity-30"></div>
                        </h2>
                        <p className="text-slate-400 mb-8 font-medium leading-relaxed max-w-xl mx-auto">
                            알파 시그널은 리스크 관리를 위해 관리자(Admin) 전용으로 운영됩니다.<br />
                            일반 사용자분들은 뉴스룸과 테마 분석을 통해 시장의 흐름을 파악하실 수 있습니다.
                        </p>

                        <DonationSection />
                    </div>
                </div>
            </div>
        </section>
    );
}
