'use client';

import { useState } from 'react';

interface StockLogoProps {
    ticker: string;
    name?: string;
    size?: number;
    className?: string;
}

export default function StockLogo({ ticker, name, size = 48, className = "" }: StockLogoProps) {
    const [error, setError] = useState(false);

    // 티커별 도메인 맵핑 (로고 품질을 높이기 위해 사용)
    const domainMap: Record<string, string> = {
        'AAPL': 'apple.com',
        'TSLA': 'tesla.com',
        'NVDA': 'nvidia.com',
        'MSFT': 'microsoft.com',
        'GOOGL': 'google.com',
        'GOOG': 'google.com',
        'AMZN': 'amazon.com',
        'META': 'meta.com',
        'NFLX': 'netflix.com',
        'SBUX': 'starbucks.com',
        'NKE': 'nike.com',
        'DIS': 'disney.com',
        'KO': 'cocacola.com',
        'MCD': 'mcdonalds.com',
        'PLTR': 'palantir.com',
    };

    const domain = domainMap[ticker?.toUpperCase()] || `${ticker.toLowerCase()}.com`;
    const logoUrl = `https://logo.clearbit.com/${domain}`;

    return (
        <div
            className={`relative flex items-center justify-center overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-sm ${className}`}
            style={{ width: size, height: size }}
        >
            {!error ? (
                <img
                    src={logoUrl}
                    alt={name || ticker}
                    className="w-full h-full object-contain p-2"
                    onError={() => setError(true)}
                />
            ) : (
                <div className="flex items-center justify-center w-full h-full bg-blue-50 text-blue-600 font-black text-xl">
                    {ticker?.substring(0, 1).toUpperCase()}
                </div>
            )}
        </div>
    );
}
