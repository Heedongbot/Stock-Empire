import React, { useState } from 'react';
import { Heart, X, Copy, Check } from 'lucide-react';

export default function SponsorshipSection() {
    const [isOpen, setIsOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    const accountNumber = "1000-6850-8663";
    const bankName = "토스뱅크";

    const handleCopy = () => {
        navigator.clipboard.writeText(`${bankName} ${accountNumber}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed bottom-6 left-6 z-50 flex flex-col-reverse items-start gap-4 animate-fade-in-up">

            {/* Floating Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`group flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 border border-white/10 ${isOpen ? 'bg-slate-800 text-slate-300 rotate-45' : 'bg-gradient-to-r from-pink-500 to-rose-600 text-white hover:shadow-[0_0_20px_rgba(236,72,153,0.5)]'}`}
            >
                {isOpen ? <X className="w-6 h-6" /> : <Heart className="w-7 h-7 fill-white animate-pulse" />}

                {!isOpen && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-[#050b14] animate-bounce"></span>
                )}
            </button>

            {/* Donation Popup Card */}
            {isOpen && (
                <div className="bg-[#0a1120] border border-slate-700 rounded-3xl p-6 shadow-2xl max-w-xs w-80 relative overflow-hidden animate-slide-up-fade origin-bottom-left">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-pink-500 to-transparent opacity-50" />

                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-pink-500/10 rounded-full">
                            <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />
                        </div>
                        <div>
                            <h3 className="text-sm font-black text-white italic">Stock Empire 후원</h3>
                            <p className="text-[10px] text-slate-400 font-bold">개발자에게 커피 한 잔 ☕</p>
                        </div>
                    </div>

                    <p className="text-[10px] text-slate-300 font-medium mb-4 leading-relaxed">
                        서버 비용과 개발은 여러분의 후원으로 유지됩니다.
                        <br /><span className="text-pink-400 opacity-80">*기능 제한 없는 100% 자발적 후원입니다.</span>
                    </p>

                    <div
                        className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center justify-between group cursor-pointer hover:border-pink-500/50 transition-all active:scale-[0.98]"
                        onClick={handleCopy}
                    >
                        <div className="text-left">
                            <div className="text-[9px] text-pink-500 font-bold uppercase tracking-widest mb-0.5">{bankName}</div>
                            <div className="text-xs font-mono font-black text-white tracking-widest">{accountNumber}</div>
                        </div>
                        <div className={`p-1.5 rounded-lg transition-all ${copied ? 'bg-green-500/20 text-green-400' : 'bg-slate-800 text-slate-400'}`}>
                            {copied ? <Check size={14} /> : <Copy size={14} />}
                        </div>
                    </div>
                    {copied && <div className="text-[9px] text-green-400 font-bold mt-2 text-center animate-fade-in">계좌번호가 복사되었습니다!</div>}
                </div>
            )}
        </div>
    );
}
