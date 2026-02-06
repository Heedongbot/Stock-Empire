'use client';

import { FileText } from 'lucide-react';
import { useEffect } from 'react';

export default function AdInFeed() {
    useEffect(() => {
        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (err) {
            console.error('AdSense error', err);
        }
    }, []);

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 relative overflow-hidden group hover:border-slate-700 transition-all">
            <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-black text-slate-500 bg-slate-950 px-2 py-1 rounded">SPONSORED</span>
            </div>

            <div className="min-h-[200px] flex items-center justify-center bg-slate-950/30 rounded-2xl">
                <ins
                    className="adsbygoogle"
                    style={{ display: 'block', width: '100%' }}
                    data-ad-format="fluid"
                    data-ad-layout-key="-fb+5w+4e-db+86"
                    data-ad-client={`ca-pub-${process.env.NEXT_PUBLIC_ADSENSE_ID || '0000000000000000'}`}
                    data-ad-slot="0987654321"
                />
            </div>
        </div>
    );
}
