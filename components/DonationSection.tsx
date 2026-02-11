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
        <div className={`mt-12 text-center ${props.className}`}>
            <div className="max-w-md mx-auto bg-white border border-slate-300 rounded-[2.5rem] p-8 relative overflow-hidden group hover:border-pink-300 transition-all shadow-xl shadow-pink-500/5 hover:shadow-pink-500/10">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-pink-400 to-transparent opacity-30" />

                <div className="flex justify-center mb-6">
                    <div className="w-14 h-14 bg-pink-50 rounded-full flex items-center justify-center animate-pulse-slow shadow-lg shadow-pink-500/20">
                        <Heart className="w-7 h-7 text-pink-500 fill-pink-100" />
                    </div>
                </div>

                <h3 className="text-xl font-black text-slate-900 mb-2 tracking-tight">
                    💝 Stock Empire를 응원해주세요
                </h3>

                <div className="w-full h-px bg-slate-200 my-6" />

                <p className="text-sm text-slate-500 font-bold mb-6 leading-relaxed">
                    모든 사용자에게 동일한 무료 서비스를 제공합니다.<br />
                    후원은 100% 자발적이며, 서비스 이용과 무관합니다.
                </p>

                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-8 text-left shadow-sm">
                    <div className="flex items-start gap-3 mb-2">
                        <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        <span className="text-xs text-amber-700 font-bold">중요: 후원에 대한 특별 혜택은 없습니다.</span>
                    </div>
                    <div className="flex items-start gap-3">
                        <CheckCircleIcon className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        <span className="text-xs text-amber-700 font-bold">후원금은 서버 운영비와 개선에만 사용됩니다.</span>
                    </div>
                </div>

                <div
                    className="bg-slate-50 border border-slate-300 rounded-2xl p-5 mb-4 flex items-center justify-between group/account cursor-pointer hover:bg-white hover:border-blue-400 transition-all shadow-sm hover:shadow-md"
                    onClick={handleCopy}
                >
                    <div className="text-left">
                        <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">{bankName}</div>
                        <div className="text-lg font-mono font-black text-slate-900 tracking-wider select-all">{accountNumber}</div>
                    </div>
                    <button
                        className={`p-3 rounded-xl transition-all ${copied ? 'bg-green-100 text-green-600' : 'bg-white border border-slate-200 group-hover/account:border-blue-200 text-slate-400 group-hover/account:text-blue-600 shadow-sm'}`}
                    >
                        {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                    </button>
                </div>

                <p className="text-[10px] text-slate-400 mt-4 font-black uppercase tracking-widest">
                    클릭하여 계좌번호 복사 (예금주: 한희동)
                </p>

                <div className="mt-8 text-3xl animate-bounce">
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
