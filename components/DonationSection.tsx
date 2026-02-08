'use client';

import { ComponentProps, useState } from "react";
import { Heart, Coffee, AlertTriangle, CheckCircle2, Copy, Check } from "lucide-react";

export function DonationSection(props: ComponentProps<"div">) {
    const [copied, setCopied] = useState(false);
    const accountNumber = "1000-6850-8663";
    const bankName = "토스뱅크";

    const handleCopy = () => {
        navigator.clipboard.writeText(`${bankName} ${accountNumber}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className={`border-t border-dashed border-slate-800 pt-12 pb-8 text-center ${props.className}`}>
            <div className="max-w-md mx-auto bg-[#0a1120] border border-slate-800 rounded-[2rem] p-8 relative overflow-hidden group hover:border-pink-500/30 transition-all">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-pink-500 to-transparent opacity-50" />

                <div className="flex justify-center mb-6">
                    <div className="w-12 h-12 bg-pink-500/10 rounded-full flex items-center justify-center animate-pulse-slow">
                        <Heart className="w-6 h-6 text-pink-500 fill-pink-500/50" />
                    </div>
                </div>

                <h3 className="text-xl font-black text-white italic mb-2">
                    💝 Stock Empire를 응원해주세요
                </h3>

                <div className="w-full h-px bg-slate-800/50 my-6" />

                <p className="text-sm text-slate-300 font-bold mb-4">
                    모든 사용자에게 동일한 무료 서비스를 제공합니다.<br />
                    후원은 100% 자발적이며, 서비스 이용과 무관합니다.
                </p>

                <div className="bg-amber-500/5 border border-amber-500/10 rounded-xl p-4 mb-6 text-left">
                    <div className="flex items-start gap-2 mb-2">
                        <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        <span className="text-[11px] text-amber-200/80 font-bold">중요: 후원에 대한 특별 혜택은 없습니다.</span>
                    </div>
                    <div className="flex items-start gap-2">
                        <CheckCircleIcon className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        <span className="text-[11px] text-amber-200/80 font-bold">후원금은 서버 운영비와 개선에만 사용됩니다.</span>
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-4 flex items-center justify-between group/account cursor-pointer hover:border-[#00ffbd]/50 transition-all" onClick={handleCopy}>
                    <div className="text-left">
                        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">{bankName}</div>
                        <div className="text-lg font-mono font-black text-white tracking-wider user-select-all">{accountNumber}</div>
                    </div>
                    <button
                        className={`p-3 rounded-xl transition-all ${copied ? 'bg-green-500/20 text-green-400' : 'bg-slate-800 group-hover/account:bg-slate-700 text-slate-400 group-hover/account:text-white'}`}
                    >
                        {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                    </button>
                </div>

                <p className="text-[10px] text-slate-500 mt-4 font-bold uppercase tracking-widest">
                    클릭하여 계좌번호 복사 (예금주: 정원석)
                </p>

                <div className="mt-6 text-2xl animate-bounce">
                    ❤️
                </div>
            </div>
        </div>
    );
}

function CheckCircleIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
    )
}
