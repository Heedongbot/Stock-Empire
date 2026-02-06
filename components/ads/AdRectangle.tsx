'use client';

import { useEffect } from 'react';

export default function AdRectangle() {
    useEffect(() => {
        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (err) {
            console.error('AdSense error', err);
        }
    }, []);

    return (
        <div className="w-full h-full flex items-center justify-center bg-slate-900/30 rounded-lg border border-slate-800 border-dashed min-h-[250px] relative">
            <div className="text-[10px] text-slate-600 absolute top-2 right-2">AD</div>
            <ins
                className="adsbygoogle"
                style={{ display: 'block', width: '100%' }}
                data-ad-format="fluid"
                data-ad-layout-key="-fb+5w+4e-db+86"
                data-ad-client={`ca-pub-${process.env.NEXT_PUBLIC_ADSENSE_ID || '0000000000000000'}`}
                data-ad-slot="0987654321"
            />
        </div>
    );
}
