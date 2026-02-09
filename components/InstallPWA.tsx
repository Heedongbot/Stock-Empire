'use client';

import React, { useState, useEffect } from 'react';
import { Download, X, Share } from 'lucide-react';

export default function InstallPWA() {
    const [showPrompt, setShowPrompt] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

    useEffect(() => {
        // 1. 이미 설치되어 있는지 확인
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
        if (isStandalone) return;

        // 2. 안드로이드/크롬용 설치 이벤트 캡처
        const handleBeforeInstallPrompt = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
            // 접속 후 3초 뒤에 보여줌
            setTimeout(() => setShowPrompt(true), 3000);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        // 3. iOS용 안내 (iOS는 수동으로 '공유 -> 홈 화면 추가' 해야함)
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
        if (isIOS && !isStandalone) {
            setTimeout(() => setShowPrompt(true), 5000);
        }

        return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) {
            // iOS용 안내 알림
            alert('iPhone을 사용 중이신가요? \n브라우저 하단의 [공유] 버튼을 누르고 \n[홈 화면에 추가]를 선택해주세요! 🚀');
            return;
        }
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            setShowPrompt(false);
        }
        setDeferredPrompt(null);
    };

    if (!showPrompt) return null;

    return (
        <div className="fixed bottom-24 left-4 right-4 z-[110] animate-in fade-in slide-in-from-bottom-5 duration-500">
            <div className="bg-gradient-to-r from-[#00ffbd] to-[#00d4ff] p-[1px] rounded-2xl shadow-2xl shadow-[#00ffbd]/30">
                <div className="bg-[#050b14] rounded-[15px] p-5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center border border-slate-700">
                            <Download className="w-6 h-6 text-[#00ffbd]" />
                        </div>
                        <div>
                            <p className="text-white font-black text-sm uppercase tracking-tighter">Stock Empire App</p>
                            <p className="text-slate-400 text-[10px] font-bold">홈 화면에 추가하고 실시간 분석 받기</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleInstallClick}
                            className="px-4 py-2 bg-[#00ffbd] text-black text-[10px] font-black rounded-lg uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all"
                        >
                            설치하기
                        </button>
                        <button
                            onClick={() => setShowPrompt(false)}
                            className="p-2 text-slate-500 hover:text-white"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
