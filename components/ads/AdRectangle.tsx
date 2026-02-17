'use client';

import { useEffect } from 'react';

export default function AdRectangle() {
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
        <div className="w-full h-full flex items-center justify-center bg-slate-50 border border-slate-100 rounded-3xl min-h-[250px] relative overflow-hidden group">
            <div className="text-[8px] font-black text-slate-300 absolute top-4 right-6 tracking-widest uppercase italic">Partner</div>
            <ins
                className="adsbygoogle"
                style={{ display: 'block', width: '100%', minHeight: '250px' }}
                data-ad-client={`ca-pub-${adClientId}`}
                data-ad-slot="0987654321"
                data-ad-format="auto"
                data-full-width-responsive="true"
            />
        </div>
    );
}
