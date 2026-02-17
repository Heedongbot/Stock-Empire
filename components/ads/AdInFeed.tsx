'use client';

import { FileText } from 'lucide-react';
import { useEffect } from 'react';

export default function AdInFeed() {
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
        <div className="w-full bg-slate-50/50 border border-slate-200 rounded-[2.5rem] p-6 md:p-10 relative overflow-hidden group transition-all">
            <div className="flex justify-between items-start mb-4">
                <span className="text-[9px] font-black text-slate-300 bg-white border border-slate-100 px-3 py-1 rounded-full tracking-widest uppercase">Sponsored</span>
            </div>

            <div className="min-h-[250px] flex items-center justify-center bg-white/50 rounded-3xl border border-dashed border-slate-200">
                <ins
                    className="adsbygoogle"
                    style={{ display: 'block', minWidth: '250px', minHeight: '250px' }}
                    data-ad-format="fluid"
                    data-ad-layout-key="-fb+5w+4e-db+86"
                    data-ad-client={`ca-pub-${adClientId}`}
                    data-ad-slot="0987654321"
                />
            </div>
        </div>
    );
}
