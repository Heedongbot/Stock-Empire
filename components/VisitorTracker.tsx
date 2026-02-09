
'use client';

import { useEffect } from 'react';

export default function VisitorTracker() {
    useEffect(() => {
        // 중복 트래킹 방지 (세션당 한 번)
        const sessionKey = `v_tracked_${new Date().toISOString().split('T')[0]}`;
        if (sessionStorage.getItem(sessionKey)) return;

        const trackVisit = async () => {
            try {
                await fetch('/api/admin/track', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ type: 'VISIT', payload: {} })
                });
                sessionStorage.setItem(sessionKey, 'true');
            } catch (e) {
                console.error("Visit tracking failed", e);
            }
        };

        // 페이지 성격상 첫 로드 시 트래킹
        trackVisit();
    }, []);

    return null; // 화면에 아무것도 그리지 않음
}
