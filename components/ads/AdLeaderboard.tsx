'use client';

import { useEffect } from 'react';

export default function AdLeaderboard() {
    useEffect(() => {
        try {
            if (typeof window !== 'undefined') {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
            }
        } catch (err) {
            console.error('AdSense error', err);
        }
    }, []);

    const adClientId = process.env.NEXT_PUBLIC_ADSENSE_ID || '9538835439937351';

    return (
        <div className="w-full flex flex-col items-center my-6 overflow-hidden bg-white rounded-3xl border border-slate-100 shadow-sm min-h-[100px] py-4">
            <div className="text-[8px] font-black text-slate-300 uppercase tracking-[0.2em] mb-3">Advertisement</div>
            <div className="w-full flex justify-center">
                <ins
                    className="adsbygoogle"
                    style={{ display: 'block', width: '100%', maxWidth: '728px', height: '90px' }}
                    data-ad-client={`ca-pub-${adClientId}`}
                    data-ad-slot="1234567890"
                    data-ad-format="horizontal"
                    data-full-width-responsive="true"
                />
            </div>
        </div>
    );
}
