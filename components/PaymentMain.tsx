"use client";

import { useEffect, useState } from "react";
import { X, CreditCard, Lock, CheckCircle2, ShieldCheck, AlertTriangle } from "lucide-react";

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    plan: string;
    onComplete: () => void;
    lang: 'ko' | 'en';
}

export default function PaymentModal({ isOpen, onClose, plan, onComplete, lang }: PaymentModalProps) {
    const [step, setStep] = useState<'INFO' | 'PROCESSING' | 'SUCCESS'>('INFO');

    useEffect(() => {
        if (isOpen) {
            setStep('INFO');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handlePayment = async () => {
        setStep('PROCESSING');

        // 실제 매출 트래킹 요청
        try {
            await fetch('/api/admin/track', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'PAYMENT',
                    payload: {
                        amount: plan === 'PRO' ? 29900 : 0,
                        plan: plan
                    }
                })
            });
        } catch (e) {
            console.error("Payment tracking failed", e);
        }

        setTimeout(() => {
            setStep('SUCCESS');
            setTimeout(() => {
                onComplete();
                onClose();
            }, 1500);
        }, 2000);
    };

    const isPro = plan === 'PRO';
    const price = isPro ? (lang === 'ko' ? '29,900원' : '$29.99') : '0원';

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-[#0f172a] border border-slate-700 rounded-3xl p-8 max-w-md w-full relative shadow-2xl">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>

                {step === 'INFO' && (
                    <>
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-500/20 mb-4">
                                <Lock className="w-8 h-8 text-indigo-400" />
                            </div>
                            <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter">
                                {lang === 'ko' ? '멤버십 업그레이드' : 'Upgrade Membership'}
                            </h2>
                            <p className="text-slate-400 text-sm">
                                {lang === 'ko' ? `${plan} 플랜으로 투자의 격을 높이세요.` : `Elevate your investing with ${plan} plan.`}
                            </p>
                        </div>

                        <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 mb-8">
                            <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-800">
                                <span className="text-slate-400 font-bold">{lang === 'ko' ? '선택한 플랜' : 'Selected Plan'}</span>
                                <span className="text-white font-black text-lg">{plan}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400 font-bold">{lang === 'ko' ? '결제 금액' : 'Total Amount'}</span>
                                <span className="text-indigo-400 font-black text-2xl">{price}</span>
                            </div>
                        </div>

                        <div className="space-y-3 mb-8">
                            <button
                                onClick={handlePayment}
                                className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-black text-lg flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 transition-all hover:scale-[1.02]"
                            >
                                <CreditCard className="w-5 h-5" />
                                {lang === 'ko' ? '카드 결제하기 (테스트)' : 'Pay with Card (Test)'}
                            </button>
                            <p className="text-[10px] text-center text-slate-500 flex items-center justify-center gap-1">
                                <ShieldCheck className="w-3 h-3" />
                                {lang === 'ko' ? '안전한 결제를 위해 암호화됩니다.' : 'Encrypted for secure payment.'}
                            </p>
                        </div>
                    </>
                )}

                {step === 'PROCESSING' && (
                    <div className="text-center py-12">
                        <div className="inline-block w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-6"></div>
                        <h3 className="text-xl font-bold text-white mb-2">{lang === 'ko' ? '결제 처리 중...' : 'Processing Payment...'}</h3>
                        <p className="text-slate-400 text-sm">{lang === 'ko' ? '잠시만 기다려주세요.' : 'Please wait a moment.'}</p>
                    </div>
                )}

                {step === 'SUCCESS' && (
                    <div className="text-center py-12">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 mb-6 animate-bounce">
                            <CheckCircle2 className="w-10 h-10 text-green-500" />
                        </div>
                        <h3 className="text-2xl font-black text-white mb-2">{lang === 'ko' ? '결제 성공!' : 'Payment Successful!'}</h3>
                        <p className="text-slate-400 text-sm">{lang === 'ko' ? '이제 PRO 기능을 마음껏 누리세요.' : 'Enjoy your PRO features now.'}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
