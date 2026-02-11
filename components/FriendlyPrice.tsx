'use client';

import { useState, useEffect } from 'react';

interface FriendlyPriceProps {
    usdPrice: number;
    className?: string;
    showIcon?: boolean;
}

export default function FriendlyPrice({ usdPrice, className = "", showIcon = true }: FriendlyPriceProps) {
    // 기본 환율 (API 연결 전 기본값)
    const [exchangeRate, setExchangeRate] = useState(1345.5);

    useEffect(() => {
        // 향후 실시간 환율 API 연동 가능 영역
        const fetchRate = async () => {
            try {
                const res = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
                const data = await res.json();
                if (data.rates && data.rates.KRW) {
                    setExchangeRate(data.rates.KRW);
                }
            } catch (e) {
                console.error("환율 페칭 실패, 기본값을 사용합니다.");
            }
        };
        fetchRate();
    }, []);

    const krwPrice = Math.round(usdPrice * exchangeRate);

    return (
        <div className={`flex flex-col ${className}`}>
            <div className="flex items-center gap-1">
                <span className="text-lg font-black text-slate-900">
                    {krwPrice.toLocaleString()}원
                </span>
            </div>
            <div className="text-[10px] font-bold text-slate-400">
                (${usdPrice.toLocaleString()})
            </div>
        </div>
    );
}
