import React from 'react';
import { Heart, Coffee, Crown, ExternalLink } from 'lucide-react';

export default function SponsorshipSection() {
    return (
        <section className="max-w-7xl mx-auto px-8 relative z-30 mb-20">
            <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#0c121d] via-[#120f2d] to-[#0c121d] border border-slate-800 shadow-2xl p-10 md:p-14">
                {/* Background Effects */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/5 rounded-full blur-[80px] pointer-events-none"></div>

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="text-center md:text-left space-y-6 max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-[10px] font-black tracking-widest uppercase text-amber-500">
                            <Crown className="w-3 h-3" />
                            Official Patronage
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black text-white italic tracking-tighter leading-tight">
                            BECOME A <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-600">GUARDIAN OF EMPEROR</span>
                        </h2>
                        <p className="text-slate-400 font-medium text-sm leading-relaxed max-w-lg">
                            Stock Empire의 AI 엔진은 여러분의 후원으로 가동됩니다.<br />
                            초기 개발 및 서버 운영에 기여하고 명예의 전당에 이름을 올리세요.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                        <a
                            href="https://toss.me/wonseokjung"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative px-8 py-5 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl text-black font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_10px_30px_rgba(245,158,11,0.3)] flex items-center justify-center gap-3"
                        >
                            <Coffee className="w-5 h-5 group-hover:-rotate-12 transition-transform" />
                            <span>Buy Coffee to Dev</span>
                            <div className="absolute inset-0 rounded-2xl ring-2 ring-white/20 group-hover:ring-white/40 transition-all"></div>
                        </a>

                        <a
                            href="#"
                            className="px-8 py-5 bg-slate-900 border border-slate-700 rounded-2xl text-slate-300 font-bold uppercase tracking-widest hover:bg-slate-800 hover:text-white transition-all flex items-center justify-center gap-3 hover:border-slate-500"
                        >
                            <Heart className="w-5 h-5 text-red-500 animate-pulse" />
                            <span>Sponsoring Inquiry</span>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
