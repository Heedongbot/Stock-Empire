'use client';

import { useEffect } from 'react';

export default function AdLeaderboard() {
    useEffect(() => {
        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (err) {
            console.error('AdSense error', err);
        }
    }, []);

    return (
        <div className="w-full flex justify-center my-8 overflow-hidden bg-slate-900/30 rounded-lg border border-slate-800 border-dashed min-h-[90px]">
            <div className="text-xs text-slate-600 absolute mt-1">SPONSORED</div>
            <ins
                className="adsbygoogle"
                style={{ display: 'inline-block', width: '728px', height: '90px' }}
                data-ad-client={`ca-pub-${process.env.NEXT_PUBLIC_ADSENSE_ID || '0000000000000000'}`} // Fallback for dev
                data-ad-slot="1234567890" // Replace with actual slot ID later
            />
        </div>
    );
}
